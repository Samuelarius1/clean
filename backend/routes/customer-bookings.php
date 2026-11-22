<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/customer-auth.php';
require_method('GET');
$customer = require_customer();
try {
    $statement = database()->prepare('SELECT b.reference, b.preferred_date, b.preferred_time, b.status, b.created_at, s.name AS service_name FROM bookings b INNER JOIN services s ON s.id = b.service_id WHERE b.customer_id = :customer_id ORDER BY b.created_at DESC LIMIT 100');
    $statement->execute(['customer_id' => $customer['id']]);
    success($statement->fetchAll());
} catch (Throwable $error) {
    error_log('Customer booking history query failed: ' . $error->getMessage());
    fail_request(503, 'Your booking history is temporarily unavailable.');
}
