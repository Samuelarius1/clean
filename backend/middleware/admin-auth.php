<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_name('faith_cleanpro_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function require_admin(): array
{
    start_admin_session();
    if (!isset($_SESSION['admin_id'], $_SESSION['admin_email']) || $_SESSION['admin_email'] !== 'samuelarius437@gmail.com') {
        fail_request(401, 'Administrator sign-in is required.');
    }
    return ['id' => (int) $_SESSION['admin_id'], 'email' => (string) $_SESSION['admin_email'], 'name' => (string) ($_SESSION['admin_name'] ?? 'Administrator')];
}

function require_admin_csrf(): void
{
    require_admin();
    $provided = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $expected = (string) ($_SESSION['csrf_token'] ?? '');
    if ($provided === '' || $expected === '' || !hash_equals($expected, $provided)) {
        fail_request(403, 'Your session could not be verified. Refresh and try again.');
    }
}
