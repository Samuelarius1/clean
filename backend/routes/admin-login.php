<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
require_method('POST');
start_admin_session();
$data = request_data();
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');
if ($email !== 'samuelarius437@gmail.com' || $password === '' || strlen($password) > 1024) {
    fail_request(401, 'Email or password is incorrect.');
}

try {
    $pdo = database();
    $subjectHash = hash_hmac('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|' . $email, app_secret());
    $attempts = $pdo->prepare('SELECT COUNT(*) FROM auth_login_attempts WHERE subject_hash = :subject AND succeeded = 0 AND attempted_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE)');
    $attempts->execute(['subject' => $subjectHash]);
    if ((int) $attempts->fetchColumn() >= 6) {
        fail_request(429, 'Too many sign-in attempts. Please wait before trying again.');
    }
    $query = $pdo->prepare('SELECT id, email, display_name, password_hash FROM admin_users WHERE email = :email LIMIT 1');
    $query->execute(['email' => $email]);
    $admin = $query->fetch();
    $ok = $admin && password_verify($password, $admin['password_hash']);
    $record = $pdo->prepare('INSERT INTO auth_login_attempts (subject_hash, succeeded) VALUES (:subject, :succeeded)');
    $record->execute(['subject' => $subjectHash, 'succeeded' => $ok ? 1 : 0]);
    if (!$ok) {
        fail_request(401, 'Email or password is incorrect.');
    }
    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int) $admin['id'];
    $_SESSION['admin_email'] = $admin['email'];
    $_SESSION['admin_name'] = $admin['display_name'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    success(['admin' => ['email' => $admin['email'], 'name' => $admin['display_name']], 'csrfToken' => $_SESSION['csrf_token']]);
} catch (Throwable $error) {
    error_log('Admin authentication failed: ' . $error->getMessage());
    fail_request(503, 'Sign-in is temporarily unavailable.');
}
