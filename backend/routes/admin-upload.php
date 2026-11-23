<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
require_method('POST');
$admin = require_admin_csrf();
$file = $_FILES['image'] ?? null;
$maxBytes = 5 * 1024 * 1024;
if (!$file || !is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || (int) ($file['size'] ?? 0) < 1 || (int) $file['size'] > $maxBytes || !is_uploaded_file($file['tmp_name'] ?? '')) {
    fail_request(422, 'Choose an image smaller than 5 MB.');
}
try {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $dimensions = @getimagesize($file['tmp_name']);
    if (!isset($types[$mime]) || !$dimensions || $dimensions[0] > 8000 || $dimensions[1] > 8000 || $dimensions[0] * $dimensions[1] > 30000000) {
        fail_request(422, 'Use a valid JPEG, PNG or WebP image with dimensions up to 8000 × 8000 pixels.');
    }
    $directory = __DIR__ . '/../uploads';
    if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
        fail_request(503, 'The image upload folder is unavailable.');
    }
    $filename = bin2hex(random_bytes(16)) . '.' . $types[$mime];
    if (!move_uploaded_file($file['tmp_name'], $directory . '/' . $filename)) {
        fail_request(503, 'The image could not be saved.');
    }
    chmod($directory . '/' . $filename, 0644);
    $apiBase = rtrim((string) (config_value('CLEANPRO_PUBLIC_API_URL', '') ?: ''), '/');
    if ($apiBase === '') {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $scriptPath = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? '/backend/routes/admin-upload.php'));
        $apiPath = dirname(dirname($scriptPath));
        $apiBase = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . $apiPath;
    }
    $url = $apiBase . '/uploads/' . $filename;
    $pdo = database();
    $audit = $pdo->prepare('INSERT INTO admin_audit_log (admin_id, action, entity_type, entity_id, details) VALUES (:admin, :action, :type, NULL, :details)');
    $audit->execute(['admin' => $admin['id'], 'action' => 'image.uploaded', 'type' => 'image', 'details' => json_encode(['mime' => $mime, 'size' => (int) $file['size']])]);
    success(['url' => $url, 'mime' => $mime, 'size' => (int) $file['size']], 201);
} catch (Throwable $error) {
    error_log('Owner image upload failed: ' . $error->getMessage());
    fail_request(503, 'The image could not be uploaded.');
}
