<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
require_method('POST');
$admin = require_admin_role_csrf('manager');
$data = request_data();
$id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if (!$id) fail_request(422, 'Choose a valid booking.');
$changes = [];
$details = [];
if (array_key_exists('status', $data)) {
    $status = (string) $data['status'];
    if (!in_array($status, ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'], true)) fail_request(422, 'Choose a valid booking status.');
    $changes['status'] = $status; $details['status'] = $status;
}
if (array_key_exists('preferred_date', $data)) {
    $date = trim((string) $data['preferred_date']);
    $parsedDate = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
    if (!$parsedDate || $parsedDate->format('Y-m-d') !== $date || $parsedDate < new DateTimeImmutable('today')) fail_request(422, 'Choose a valid date that is today or later.');
    $changes['preferred_date'] = $date; $details['preferred_date'] = $date;
}
if (array_key_exists('preferred_time', $data)) {
    $time = (string) $data['preferred_time'];
    if (!in_array($time, ['Flexible', 'Morning', 'Afternoon', 'Evening'], true)) fail_request(422, 'Choose a valid preferred time.');
    $changes['preferred_time'] = $time; $details['preferred_time'] = $time;
}
if (array_key_exists('quoted_amount', $data)) {
    $quote = $data['quoted_amount'];
    if ($quote !== null && $quote !== '' && (!is_numeric($quote) || (float) $quote < 0 || (float) $quote > 99999999)) fail_request(422, 'Enter a valid non-negative quote amount.');
    $changes['quoted_amount'] = $quote === '' ? null : $quote; $details['quoted_amount'] = $changes['quoted_amount'];
}
if (!$changes) fail_request(422, 'Provide a booking change.');
$allowedColumns = ['status', 'preferred_date', 'preferred_time', 'quoted_amount'];
$assignments = [];
$params = ['id' => $id];
foreach ($changes as $column => $value) {
    if (!in_array($column, $allowedColumns, true)) fail_request(422, 'Invalid booking field.');
    $assignments[] = $column . ' = :' . $column;
    $params[$column] = $value;
}
try {
    $pdo = database();
    $pdo->beginTransaction();
    $update = $pdo->prepare('UPDATE bookings SET ' . implode(', ', $assignments) . ' WHERE id = :id');
    $update->execute($params);
    $exists = $pdo->prepare('SELECT id FROM bookings WHERE id = :id');
    $exists->execute(['id' => $id]);
    if (!$exists->fetch()) { $pdo->rollBack(); fail_request(404, 'Booking request not found.'); }
    $audit = $pdo->prepare('INSERT INTO admin_audit_log (admin_id, action, entity_type, entity_id, details) VALUES (:admin_id, :action, :type, :entity_id, :details)');
    $audit->execute(['admin_id' => $admin['id'], 'action' => 'booking.updated', 'type' => 'booking', 'entity_id' => $id, 'details' => json_encode($details)]);
    $pdo->commit();
    success(['id' => (int) $id, ...$details]);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    error_log('Booking update failed: ' . $error->getMessage());
    fail_request(503, 'The booking could not be updated.');
}
