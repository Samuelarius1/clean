<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/customer-auth.php';
require_method('POST');
start_customer_session();
$data = request_data();
$action = (string) ($data['action'] ?? 'login');
$email = filter_var(strtolower(trim((string) ($data['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
$password = (string) ($data['password'] ?? '');
if (!$email || strlen($email) > 190 || $password === '' || strlen($password) > 1024) {
    fail_request(422, 'Enter a valid email address and password.');
}
try {
    $pdo = database();
    $subject = hash_hmac('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|' . $email, app_secret());
    $rate = $pdo->prepare('SELECT COUNT(*) FROM auth_login_attempts WHERE subject_hash = :subject AND succeeded = 0 AND attempted_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE)');
    $rate->execute(['subject' => $subject]);
    if ((int) $rate->fetchColumn() >= 8) {
        fail_request(429, 'Too many account attempts. Please wait and try again.');
    }
    if ($action === 'register') {
        $name = trim((string) ($data['name'] ?? ''));
        $phone = trim((string) ($data['phone'] ?? ''));
        if ($name === '' || strlen($name) > 120 || $phone === '' || strlen($phone) > 32 || strlen($password) < 12) {
            fail_request(422, 'Add your name and phone, and choose a password with at least 12 characters.');
        }
        $insert = $pdo->prepare('INSERT INTO customers (full_name, email, phone, password_hash) VALUES (:name, :email, :phone, :password_hash)');
        try {
            $insert->execute(['name' => $name, 'email' => $email, 'phone' => $phone, 'password_hash' => password_hash($password, PASSWORD_DEFAULT)]);
        } catch (PDOException $error) {
            if ($error->getCode() === '23000') fail_request(409, 'An account already exists for this email. Please sign in instead.');
            throw $error;
        }
        $id = (int) $pdo->lastInsertId();
        $nameForSession = $name;
    } elseif ($action === 'login') {
        $query = $pdo->prepare('SELECT id, full_name, email, password_hash FROM customers WHERE email = :email AND password_hash IS NOT NULL AND is_active = 1 LIMIT 1');
        $query->execute(['email' => $email]);
        $customer = $query->fetch();
        $success = $customer && password_verify($password, $customer['password_hash']);
        $attempt = $pdo->prepare('INSERT INTO auth_login_attempts (subject_hash, succeeded) VALUES (:subject, :succeeded)');
        $attempt->execute(['subject' => $subject, 'succeeded' => $success ? 1 : 0]);
        if (!$success) fail_request(401, 'Email or password is incorrect.');
        $id = (int) $customer['id'];
        $nameForSession = $customer['full_name'];
    } else {
        fail_request(422, 'Choose a supported account action.');
    }
    session_regenerate_id(true);
    $_SESSION['customer_id'] = $id;
    $_SESSION['customer_email'] = $email;
    $_SESSION['customer_name'] = $nameForSession;
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    success(['customer' => ['id' => $id, 'email' => $email, 'name' => $nameForSession], 'csrfToken' => $_SESSION['csrf_token']], $action === 'register' ? 201 : 200);
} catch (Throwable $error) {
    error_log('Customer authentication failed: ' . $error->getMessage());
    fail_request(503, 'Account sign-in is temporarily unavailable.');
}
