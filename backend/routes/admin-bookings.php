<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
require_method('GET');
require_staff();
try {
    $limit = filter_var($_GET['limit'] ?? 50, FILTER_VALIDATE_INT);
    $limit = min(100, max(1, $limit === false ? 50 : $limit));
    $statement = database()->query('SELECT b.id, b.reference, b.customer_name, b.customer_email, b.customer_phone, b.preferred_date, b.preferred_time, b.status, b.quoted_amount, b.created_at, s.name AS service_name FROM bookings b INNER JOIN services s ON s.id = b.service_id ORDER BY b.created_at DESC LIMIT ' . $limit);
    success($statement->fetchAll());
} catch (Throwable $error) {
    error_log('Admin bookings query failed: ' . $error->getMessage());
    fail_request(503, 'Booking requests are temporarily unavailable.');
}
