<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_method('POST');
$data = request_data();
$token = strtolower(trim((string) ($data['token'] ?? '')));
if (!preg_match('/^[a-f0-9]{64}$/', $token)) fail_request(422, 'This unsubscribe link is invalid or incomplete.');
try {
    $statement = database()->prepare('UPDATE newsletter_subscribers SET unsubscribed_at = CURRENT_TIMESTAMP, unsubscribe_token_hash = NULL WHERE unsubscribe_token_hash = :token AND unsubscribed_at IS NULL');
    $statement->execute(['token' => hash('sha256', $token)]);
    success(['updated' => true]);
} catch (Throwable $error) {
    error_log('Newsletter unsubscribe failed: ' . $error->getMessage());
    fail_request(503, 'Your mailing preference could not be updated. Please try again.');
}
