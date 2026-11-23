<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_method('GET');
$publicKeys = ['business_name', 'home_hero_eyebrow', 'home_hero_title', 'home_hero_accent', 'home_hero_description', 'about_intro_title', 'about_intro_body', 'contact_email', 'contact_phone', 'business_address', 'whatsapp_url', 'instagram_url', 'facebook_url'];
try {
    $placeholders = implode(',', array_fill(0, count($publicKeys), '?'));
    $statement = database()->prepare("SELECT content_key, content_value FROM site_content WHERE content_key IN ({$placeholders})");
    $statement->execute($publicKeys);
    $settings = [];
    foreach ($statement->fetchAll() as $row) $settings[$row['content_key']] = $row['content_value'];
    success($settings);
} catch (Throwable $error) {
    error_log('Public site settings query failed: ' . $error->getMessage());
    fail_request(503, 'Business contact details are temporarily unavailable.');
}
