<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/customer-auth.php';
require_once __DIR__ . '/../models/BookingModel.php';
require_once __DIR__ . '/../controllers/BookingController.php';
require_once __DIR__ . '/../models/ServiceModel.php';
require_method('POST');
enforce_rate_limit('booking-submit', 5, 15);
start_customer_session();

$data = request_data();
$serviceId = filter_var($data['service_id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
$name = trim((string) ($data['name'] ?? ''));
$email = filter_var(trim((string) ($data['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$phone = trim((string) ($data['phone'] ?? ''));
$address = trim((string) ($data['address'] ?? ''));
$date = trim((string) ($data['preferred_date'] ?? ''));
$time = trim((string) ($data['preferred_time'] ?? 'Flexible'));
$notes = trim((string) ($data['notes'] ?? ''));

if (!$serviceId || $name === '' || strlen($name) > 120 || !$email || strlen($email) > 190 || $phone === '' || strlen($phone) > 32 || $address === '' || strlen($address) > 500 || strlen($time) > 40 || strlen($notes) > 1200) {
    fail_request(422, 'Please check the required fields and try again.');
}
$dateObject = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
if (!$dateObject || $dateObject->format('Y-m-d') !== $date) {
    fail_request(422, 'Choose a valid service date.');
}
$leadStatement = database()->prepare('SELECT content_value FROM site_content WHERE content_key = :key');
$leadStatement->execute(['key' => 'booking_lead_days']);
$leadDays = min(365, max(0, (int) ($leadStatement->fetchColumn() ?: 0)));
$minimumDate = (new DateTimeImmutable('today'))->modify('+' . $leadDays . ' days');
if ($dateObject < $minimumDate) fail_request(422, 'Choose a date that meets the service booking lead time.');
if (!in_array($time, ['Flexible', 'Morning', 'Afternoon', 'Evening'], true)) fail_request(422, 'Choose a valid preferred service time.');

try {
    $pdo = database();
    $customerId = null;
    if (isset($_SESSION['customer_id'], $_SESSION['customer_email'])) {
        if (!hash_equals((string) $_SESSION['customer_email'], (string) $email)) {
            fail_request(403, 'The booking email must match your signed-in customer account.');
        }
        $customerId = (int) $_SESSION['customer_id'];
    }
    $service = new ServiceModel($pdo);
    if (!$service->isPublic($serviceId)) {
        fail_request(422, 'That service is not currently available.');
    }
    $controller = new BookingController(new BookingModel($pdo));
    $reference = $controller->submit([
        'customer_id' => $customerId,
        'service_id' => $serviceId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'address' => $address,
        'preferred_date' => $date,
        'preferred_time' => $time ?: 'Flexible',
        'notes' => $notes !== '' ? $notes : null,
    ]);
    success(['reference' => $reference], 201);
} catch (Throwable $error) {
    error_log('Booking creation failed: ' . $error->getMessage());
    fail_request(503, 'We couldn’t save your request. Please try again shortly.');
}
