<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/customer-auth.php';
$method = $_SERVER['REQUEST_METHOD'] ?? '';
start_customer_session();
if ($method === 'GET') {
    $customer = require_customer();
    $query = database()->prepare('SELECT phone FROM customers WHERE id = :id');
    $query->execute(['id' => $customer['id']]);
    $customer['phone'] = (string) ($query->fetchColumn() ?: '');
    if (!isset($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    success(['customer' => $customer, 'csrfToken' => $_SESSION['csrf_token']]);
}
if ($method === 'POST') {
    require_customer_csrf();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    success(['signedOut' => true]);
}
header('Allow: GET, POST, OPTIONS');
fail_request(405, 'Method not allowed.');
