<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_method('GET');
try {
    $statement = database()->query('SELECT id, category, question, answer FROM faqs WHERE is_published = 1 ORDER BY display_order, id');
    success($statement->fetchAll());
} catch (Throwable $error) {
    error_log('Public FAQ query failed: ' . $error->getMessage());
    fail_request(503, 'Frequently asked questions are temporarily unavailable.');
}
