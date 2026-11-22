<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_method('POST');
enforce_rate_limit('contact-message', 5, 15);
$data = request_data();
$name = trim((string) ($data['name'] ?? ''));
$email = filter_var(trim((string) ($data['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$subject = trim((string) ($data['subject'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
if ($name === '' || strlen($name) > 120 || !$email || strlen($email) > 190 || strlen($subject) > 180 || $message === '' || strlen($message) > 2400) {
    fail_request(422, 'Please check the required fields and try again.');
}
try {
    $statement = database()->prepare('INSERT INTO contact_messages (customer_name, email, subject, message) VALUES (:name, :email, :subject, :message)');
    $statement->execute(['name' => $name, 'email' => $email, 'subject' => $subject, 'message' => $message]);
    success(['id' => (int) database()->lastInsertId()], 201);
} catch (Throwable $error) {
    error_log('Contact message save failed: ' . $error->getMessage());
    fail_request(503, 'We couldn’t send your message. Please try again shortly.');
}
