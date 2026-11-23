<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_method('POST');
enforce_rate_limit('newsletter-subscribe', 3, 60);
$data = request_data();
$email = filter_var(trim((string) ($data['email'] ?? '')), FILTER_VALIDATE_EMAIL);
if (!$email || strlen($email) > 190) {
    fail_request(422, 'Enter a valid email address.');
}
try {
    $token = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $token);
    $statement = database()->prepare('INSERT INTO newsletter_subscribers (email, unsubscribe_token_hash, subscribed_at, unsubscribed_at) VALUES (:email, :token, CURRENT_TIMESTAMP, NULL) ON DUPLICATE KEY UPDATE unsubscribe_token_hash = VALUES(unsubscribe_token_hash), subscribed_at = CURRENT_TIMESTAMP, unsubscribed_at = NULL');
    $statement->execute(['email' => strtolower($email), 'token' => $tokenHash]);
    success(['subscribed' => true, 'unsubscribe_token' => $token], 201);
} catch (Throwable $error) {
    error_log('Newsletter subscription failed: ' . $error->getMessage());
    fail_request(503, 'We couldn’t save your subscription. Please try again shortly.');
}
