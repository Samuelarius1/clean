<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require_once __DIR__ . '/../../backend/config/bootstrap.php';

$email = 'samuelarius437@gmail.com';
$password = getenv('CLEANPRO_INITIAL_ADMIN_PASSWORD');
if (!is_string($password) || strlen($password) < 12 || strlen($password) > 1024) {
    fwrite(STDERR, "Set CLEANPRO_INITIAL_ADMIN_PASSWORD to a unique password of at least 12 characters in the current shell. Do not save it in the repository.\n");
    exit(1);
}

try {
    $pdo = database();
    $count = (int) $pdo->query("SELECT COUNT(*) FROM admin_users WHERE role = 'admin'")->fetchColumn();
    if ($count > 0) {
        fwrite(STDERR, "An administrator account already exists. This bootstrap is only for the first owner account.\n");
        exit(1);
    }
    $statement = $pdo->prepare('INSERT INTO admin_users (email, display_name, role, password_hash) VALUES (:email, :name, :role, :hash)');
    $statement->execute([
        'email' => $email,
        'name' => 'Faith’s Walk Administrator',
        'role' => 'admin',
        'hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);
    fwrite(STDOUT, "Owner account created for {$email}. Remove the temporary password from the shell environment.\n");
} catch (Throwable $error) {
    error_log('Owner account bootstrap failed: ' . $error->getMessage());
    fwrite(STDERR, "Owner account setup failed. Check the XAMPP database connection and migrations.\n");
    exit(1);
}
