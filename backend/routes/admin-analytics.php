<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
require_method('GET');
require_admin();
$days = filter_var($_GET['days'] ?? 30, FILTER_VALIDATE_INT);
$days = min(365, max(1, $days === false ? 30 : $days));
try {
    $pdo = database();
    $daily = $pdo->prepare("SELECT DATE(visited_at) AS date, COUNT(*) AS page_views, COUNT(DISTINCT visitor_hash) AS unique_visitors FROM analytics_visits WHERE visited_at >= DATE_SUB(CURRENT_DATE, INTERVAL {$days} DAY) GROUP BY DATE(visited_at) ORDER BY date ASC");
    $daily->execute();
    $pages = $pdo->prepare("SELECT page_path, COUNT(*) AS page_views, COUNT(DISTINCT visitor_hash) AS unique_visitors FROM analytics_visits WHERE visited_at >= DATE_SUB(CURRENT_DATE, INTERVAL {$days} DAY) GROUP BY page_path ORDER BY page_views DESC LIMIT 10");
    $pages->execute();
    $totals = $pdo->prepare("SELECT COUNT(*) AS page_views, COUNT(DISTINCT visitor_hash) AS unique_visitors FROM analytics_visits WHERE visited_at >= DATE_SUB(CURRENT_DATE, INTERVAL {$days} DAY)");
    $totals->execute();
    $bookingTotals = $pdo->prepare("SELECT COUNT(*) AS total, COALESCE(SUM(status = 'pending'), 0) AS pending, COALESCE(SUM(status = 'confirmed'), 0) AS confirmed, COALESCE(SUM(status = 'completed'), 0) AS completed FROM bookings WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL {$days} DAY)");
    $bookingTotals->execute();
    $customerTotals = $pdo->query('SELECT COUNT(*) FROM customers')->fetchColumn();
    success(['days' => $days, 'totals' => $totals->fetch(), 'bookings' => $bookingTotals->fetch(), 'customerAccounts' => (int) $customerTotals, 'daily' => $daily->fetchAll(), 'topPages' => $pages->fetchAll()]);
} catch (Throwable $error) {
    error_log('Admin analytics query failed: ' . $error->getMessage());
    fail_request(503, 'Analytics are temporarily unavailable.');
}
