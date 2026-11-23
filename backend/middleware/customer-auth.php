<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';

function start_customer_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_name('faith_cleanpro_customer');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function require_customer(): array
{
    start_customer_session();
    if (!isset($_SESSION['customer_id'], $_SESSION['customer_email'])) {
        fail_request(401, 'Customer sign-in is required.');
    }
    return ['id' => (int) $_SESSION['customer_id'], 'email' => (string) $_SESSION['customer_email'], 'name' => (string) ($_SESSION['customer_name'] ?? '')];
}

function require_customer_csrf(): array
{
    $customer = require_customer();
    $provided = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $expected = (string) ($_SESSION['csrf_token'] ?? '');
    if ($provided === '' || $expected === '' || !hash_equals($expected, $provided)) {
        fail_request(403, 'Your session could not be verified. Refresh and try again.');
    }
    return $customer;
}
