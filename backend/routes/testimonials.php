<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_method('GET');
try {
    $statement = database()->query('SELECT id, customer_name, quote, rating, profile_image FROM testimonials WHERE is_approved = 1 AND is_featured = 1 ORDER BY id DESC LIMIT 12');
    success($statement->fetchAll());
} catch (Throwable $error) {
    error_log('Public testimonials query failed: ' . $error->getMessage());
    fail_request(503, 'Testimonials are temporarily unavailable.');
}
