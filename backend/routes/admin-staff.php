<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'GET') {
    require_admin();
    try {
        $rows = database()->query("SELECT id, email, display_name, role, is_active, created_at FROM admin_users ORDER BY role, display_name")->fetchAll();
        success($rows);
    } catch (Throwable $error) {
        error_log('Staff list failed: ' . $error->getMessage());
        fail_request(503, 'Staff accounts are temporarily unavailable.');
    }
}
if ($method !== 'POST') {
    header('Allow: GET, POST, OPTIONS');
    fail_request(405, 'Method not allowed.');
}
require_admin_role_csrf('admin');
$data = request_data();
$action = (string) ($data['action'] ?? '');
$pdo = database();
try {
    if ($action === 'create') {
        $name = trim((string) ($data['name'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        if ($name === '' || strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190 || $email === 'samuelarius437@gmail.com' || strlen($password) < 12 || strlen($password) > 1024) {
            fail_request(422, 'Enter a name, valid non-owner email, and a password of at least 12 characters.');
        }
        $statement = $pdo->prepare("INSERT INTO admin_users (email, display_name, role, is_active, password_hash) VALUES (:email, :name, 'manager', 1, :hash)");
        $statement->execute(['email' => $email, 'name' => $name, 'hash' => password_hash($password, PASSWORD_DEFAULT)]);
        success(['id' => (int) $pdo->lastInsertId(), 'role' => 'manager'], 201);
    }
    if ($action === 'update') {
        $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        $active = filter_var($data['is_active'] ?? null, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if (!$id || $active === null) fail_request(422, 'Choose a staff account and active status.');
        $statement = $pdo->prepare("UPDATE admin_users SET is_active = :active WHERE id = :id AND role = 'manager' AND email <> 'samuelarius437@gmail.com'");
        $statement->execute(['active' => (int) $active, 'id' => $id]);
        if (!$statement->rowCount()) fail_request(404, 'Manager account not found.');
        success(['id' => (int) $id, 'is_active' => $active]);
    }
    fail_request(422, 'Choose a supported staff account action.');
} catch (PDOException $error) {
    if ($error->getCode() === '23000') fail_request(409, 'A staff account with that email already exists.');
    error_log('Staff account change failed: ' . $error->getMessage());
    fail_request(503, 'This staff account change could not be saved.');
}
