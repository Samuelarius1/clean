<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../models/BookingModel.php';
require_once __DIR__ . '/../controllers/BookingController.php';
require_method('POST');
$data = request_data();
$reference = strtoupper(trim((string) ($data['reference'] ?? '')));
$email = filter_var(strtolower(trim((string) ($data['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
if (!preg_match('/^FW-[A-F0-9]{10}$/', $reference) || !$email || strlen($email) > 190) fail_request(422, 'Enter your request reference and the email used to make the booking.');
try {
    $pdo = database();
    $subject = hash_hmac('sha256', 'booking-lookup|' . (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|' . $email, app_secret());
    $rate = $pdo->prepare('SELECT COUNT(*) FROM auth_login_attempts WHERE subject_hash = :subject AND succeeded = 0 AND attempted_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE)');
    $rate->execute(['subject' => $subject]);
    if ((int) $rate->fetchColumn() >= 8) fail_request(429, 'Too many lookups. Please wait before trying again.');
    $controller = new BookingController(new BookingModel($pdo));
    $booking = $controller->lookup($reference, $email);
    $attempt = $pdo->prepare('INSERT INTO auth_login_attempts (subject_hash, succeeded) VALUES (:subject, :succeeded)');
    $attempt->execute(['subject' => $subject, 'succeeded' => $booking ? 1 : 0]);
    if (!$booking) fail_request(404, 'No matching booking was found. Check the reference and email, then try again.');
    success($booking);
} catch (Throwable $error) {
    error_log('Booking reference lookup failed: ' . $error->getMessage());
    fail_request(503, 'Booking lookup is temporarily unavailable.');
}
