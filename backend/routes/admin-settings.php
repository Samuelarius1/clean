<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
$method = $_SERVER['REQUEST_METHOD'] ?? '';
$keys = ['business_name', 'home_hero_eyebrow', 'home_hero_title', 'home_hero_accent', 'home_hero_description', 'about_intro_title', 'about_intro_body', 'contact_email', 'contact_phone', 'business_address', 'whatsapp_url', 'instagram_url', 'facebook_url', 'booking_lead_days'];
if ($method === 'GET') {
    require_admin();
    $placeholders = implode(',', array_fill(0, count($keys), '?'));
    $statement = database()->prepare("SELECT content_key, content_value FROM site_content WHERE content_key IN ({$placeholders})");
    $statement->execute($keys);
    $result = [];
    foreach ($statement->fetchAll() as $row) $result[$row['content_key']] = $row['content_value'];
    success($result);
}
if ($method !== 'POST') { header('Allow: GET, POST, OPTIONS'); fail_request(405, 'Method not allowed.'); }
$admin = require_admin_csrf();
$data = request_data();
$values = $data['settings'] ?? null;
if (!is_array($values)) fail_request(422, 'Settings are required.');
$limits = ['business_name' => 160, 'home_hero_eyebrow' => 120, 'home_hero_title' => 140, 'home_hero_accent' => 140, 'home_hero_description' => 500, 'about_intro_title' => 200, 'about_intro_body' => 1200, 'contact_email' => 190, 'contact_phone' => 40, 'business_address' => 320, 'whatsapp_url' => 500, 'instagram_url' => 500, 'facebook_url' => 500, 'booking_lead_days' => 3];
$clean = [];
foreach ($limits as $key => $limit) {
    if (!array_key_exists($key, $values)) continue;
    $value = trim((string) $values[$key]);
    if (strlen($value) > $limit) fail_request(422, 'One or more settings are too long.');
    if ($key === 'contact_email' && $value !== '' && !filter_var($value, FILTER_VALIDATE_EMAIL)) fail_request(422, 'Enter a valid contact email.');
    if (in_array($key, ['whatsapp_url', 'instagram_url', 'facebook_url'], true) && $value !== '' && (!filter_var($value, FILTER_VALIDATE_URL) || !str_starts_with($value, 'https://'))) fail_request(422, 'Social and WhatsApp links must use HTTPS.');
    if ($key === 'booking_lead_days' && (!ctype_digit($value) || (int) $value > 365)) fail_request(422, 'Booking lead days must be between 0 and 365.');
    $clean[$key] = $value;
}
if (!$clean) fail_request(422, 'No supported settings were provided.');
try {
    $pdo = database();
    $pdo->beginTransaction();
    $upsert = $pdo->prepare('INSERT INTO site_content (content_key, content_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)');
    foreach ($clean as $key => $value) $upsert->execute(['key' => $key, 'value' => $value]);
    $audit = $pdo->prepare('INSERT INTO admin_audit_log (admin_id, action, entity_type, entity_id, details) VALUES (:admin, :action, :type, NULL, :details)');
    $audit->execute(['admin' => $admin['id'], 'action' => 'site.settings.updated', 'type' => 'settings', 'details' => json_encode(['keys' => array_keys($clean)])]);
    $pdo->commit();
    success($clean);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    error_log('Site settings update failed: ' . $error->getMessage());
    fail_request(503, 'Site settings could not be saved.');
}
