<?php
declare(strict_types=1);

$localConfigPath = __DIR__ . '/local.php';
$localConfig = is_file($localConfigPath) ? require $localConfigPath : [];
$GLOBALS['cleanpro_local_config'] = is_array($localConfig) ? $localConfig : [];

function config_value(string $key, mixed $default = null): mixed
{
    $environmentValue = getenv($key);
    if ($environmentValue !== false) return $environmentValue;
    return $GLOBALS['cleanpro_local_config'][$key] ?? $default;
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

function cleanpro_origins(): array
{
    $configured = config_value('CLEANPRO_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173');
    return array_values(array_filter(array_map('trim', explode(',', $configured))));
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    if (!in_array($origin, cleanpro_origins(), true)) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Request origin is not allowed.']);
        exit;
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-CSRF-Token');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function respond(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function success(mixed $data = null, int $statusCode = 200): never
{
    respond($statusCode, ['status' => 'success', 'data' => $data]);
}

function fail_request(int $statusCode, string $message): never
{
    respond($statusCode, ['status' => 'error', 'message' => $message]);
}

function require_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        header('Allow: ' . $method . ', OPTIONS');
        fail_request(405, 'Method not allowed.');
    }
}

function request_data(): array
{
    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > 10000) {
        fail_request(413, 'Request is too large.');
    }
    $decoded = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($decoded)) {
        fail_request(400, 'A valid JSON request is required.');
    }
    return $decoded;
}

function database(): PDO
{
    static $connection = null;
    if ($connection instanceof PDO) {
        return $connection;
    }
    $production = config_value('APP_ENV', 'development') === 'production';
    $host = config_value('DB_HOST', $production ? '' : '127.0.0.1');
    $name = config_value('DB_NAME', $production ? '' : 'faith_cleanpro');
    $user = config_value('DB_USER', $production ? '' : 'root');
    $password = config_value('DB_PASSWORD', $production ? null : '');
    if ($production && ($host === '' || $name === '' || $user === '' || $password === null || $password === '')) {
        fail_request(503, 'Database configuration is incomplete.');
    }
    $password = $password === false ? '' : $password;
    try {
        $connection = new PDO("mysql:host={$host};dbname={$name};charset=utf8mb4", $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $error) {
        error_log('CleanPro database connection failed: ' . $error->getMessage());
        fail_request(503, 'The service is temporarily unavailable.');
    }
    return $connection;
}

function app_secret(): string
{
    $secret = config_value('CLEANPRO_APP_SECRET');
    if (!is_string($secret) || strlen($secret) < 32) {
        fail_request(503, 'Application security configuration is incomplete.');
    }
    return $secret;
}

function enforce_rate_limit(string $scope, int $maximum, int $windowMinutes): void
{
    $minutes = min(1440, max(1, $windowMinutes));
    $maximum = max(1, $maximum);
    $address = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $subject = hash_hmac('sha256', 'api-rate|' . $scope . '|' . $address, app_secret());
    try {
        $pdo = database();
        $count = $pdo->prepare("SELECT COUNT(*) FROM api_rate_limit_events WHERE subject_hash = :subject AND attempted_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL {$minutes} MINUTE)");
        $count->execute(['subject' => $subject]);
        if ((int) $count->fetchColumn() >= $maximum) {
            fail_request(429, 'Too many requests. Please wait and try again.');
        }
        $record = $pdo->prepare('INSERT INTO api_rate_limit_events (subject_hash) VALUES (:subject)');
        $record->execute(['subject' => $subject]);
        if (random_int(1, 100) === 1) {
            $pdo->exec('DELETE FROM api_rate_limit_events WHERE attempted_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY)');
        }
    } catch (Throwable $error) {
        error_log('Request rate limit check failed: ' . $error->getMessage());
        fail_request(503, 'The service is temporarily unavailable.');
    }
}
