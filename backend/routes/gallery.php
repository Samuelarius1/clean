<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_method('GET');
try {
    $statement = database()->query('SELECT id, title, description, before_image_path, after_image_path, category FROM gallery_items WHERE is_published = 1 AND is_before_after = 1 AND before_image_path IS NOT NULL AND after_image_path IS NOT NULL ORDER BY display_order, id LIMIT 24');
    success($statement->fetchAll());
} catch (Throwable $error) {
    error_log('Public gallery query failed: ' . $error->getMessage());
    fail_request(503, 'The photo gallery is temporarily unavailable.');
}
