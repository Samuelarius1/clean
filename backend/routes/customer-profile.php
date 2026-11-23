<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/customer-auth.php';
require_method('POST');
$customer = require_customer_csrf();
$data = request_data();
$name = trim((string) ($data['name'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
if ($name === '' || strlen($name) > 120 || $phone === '' || strlen($phone) > 32) {
    fail_request(422, 'Add a valid name and phone number.');
}
try {
    $statement = database()->prepare('UPDATE customers SET full_name = :name, phone = :phone WHERE id = :id');
    $statement->execute(['name' => $name, 'phone' => $phone, 'id' => $customer['id']]);
    $_SESSION['customer_name'] = $name;
    success(['customer' => ['id' => $customer['id'], 'email' => $customer['email'], 'name' => $name, 'phone' => $phone]]);
} catch (Throwable $error) {
    error_log('Customer profile update failed: ' . $error->getMessage());
    fail_request(503, 'Your profile could not be updated.');
}
