<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_name('faith_cleanpro_admin');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict']);
    session_start();
}

function require_staff(): array
{
    start_admin_session();
    $role = (string) ($_SESSION['admin_role'] ?? '');
    if (!isset($_SESSION['admin_id'], $_SESSION['admin_email']) || !in_array($role, ['admin', 'manager'], true)) fail_request(401, 'Staff sign-in is required.');
    try {
        $statement = database()->prepare('SELECT email, display_name, role, is_active FROM admin_users WHERE id = :id LIMIT 1');
        $statement->execute(['id' => (int) $_SESSION['admin_id']]);
        $account = $statement->fetch();
    } catch (Throwable $error) {
        error_log('Staff session verification failed: ' . $error->getMessage());
        fail_request(503, 'Staff authorization is temporarily unavailable.');
    }
    if (!$account || (int) $account['is_active'] !== 1 || !in_array($account['role'], ['admin', 'manager'], true) || $account['email'] !== $_SESSION['admin_email']) {
        $_SESSION = [];
        fail_request(401, 'This staff account is inactive. Sign in again or contact the administrator.');
    }
    $_SESSION['admin_role'] = $account['role'];
    $_SESSION['admin_name'] = $account['display_name'];
    return ['id' => (int) $_SESSION['admin_id'], 'email' => (string) $account['email'], 'name' => (string) $account['display_name'], 'role' => (string) $account['role']];
}

function require_admin(): array
{
    $staff = require_staff();
    if ($staff['role'] !== 'admin' || $staff['email'] !== 'samuelarius437@gmail.com') {
        fail_request(403, 'Administrator access is required.');
    }
    return $staff;
}

function require_admin_csrf(): array
{
    $staff = require_staff();
    $provided = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $expected = (string) ($_SESSION['csrf_token'] ?? '');
    if ($provided === '' || $expected === '' || !hash_equals($expected, $provided)) fail_request(403, 'Your session could not be verified. Refresh and try again.');
    return $staff;
}

function require_admin_role_csrf(string $role): array
{
    $staff = require_admin_csrf();
    if ($role === 'manager' && !in_array($staff['role'], ['admin', 'manager'], true)) fail_request(403, 'You do not have access to this section.');
    if ($role === 'admin' && $staff['role'] !== 'admin') fail_request(403, 'Administrator access is required.');
    return $staff;
}
