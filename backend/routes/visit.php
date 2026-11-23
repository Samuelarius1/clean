<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_method('POST');
$data = request_data();
$path = (string) ($data['path'] ?? '');
if (!preg_match('~^/[a-zA-Z0-9/_-]{0,150}$~', $path) || preg_match('~^/(dashboard|admin|login)(/|$)~i', $path)) {
    fail_request(422, 'This page cannot be tracked.');
}

$referrerDomain = null;
$referrer = trim((string) ($data['referrer'] ?? ''));
if ($referrer !== '' && strlen($referrer) <= 253 && filter_var($referrer, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME)) {
    $requestHost = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    if (strtolower($referrer) !== $requestHost) {
        $referrerDomain = strtolower($referrer);
    }
}

try {
    $pdo = database();
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $dailySalt = gmdate('Y-m-d');
    $visitorHash = hash_hmac('sha256', $dailySalt . '|' . $ip, app_secret());
    $recent = $pdo->prepare('SELECT id FROM analytics_visits WHERE visitor_hash = :visitor AND page_path = :path AND visited_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 SECOND) LIMIT 1');
    $recent->execute(['visitor' => $visitorHash, 'path' => $path]);
    if (!$recent->fetch()) {
        $insert = $pdo->prepare('INSERT INTO analytics_visits (visitor_hash, page_path, referrer_domain) VALUES (:visitor, :path, :referrer)');
        $insert->execute(['visitor' => $visitorHash, 'path' => $path, 'referrer' => $referrerDomain]);
        if (random_int(1, 100) === 1) {
            $pdo->exec('DELETE FROM analytics_visits WHERE visited_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 90 DAY)');
        }
    }
    success(['recorded' => true], 202);
} catch (Throwable $error) {
    error_log('Visit collection failed: ' . $error->getMessage());
    fail_request(503, 'Analytics is temporarily unavailable.');
}
