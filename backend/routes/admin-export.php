<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
require_method('GET');
require_admin();
$report = (string) ($_GET['report'] ?? 'bookings');
$days = filter_var($_GET['days'] ?? 30, FILTER_VALIDATE_INT);
$days = min(365, max(1, $days === false ? 30 : $days));
$queries = [
    'bookings' => ['SELECT b.reference, b.customer_name, b.customer_email, b.customer_phone, s.name AS service, b.preferred_date, b.preferred_time, b.status, b.quoted_amount, b.created_at FROM bookings b INNER JOIN services s ON s.id = b.service_id WHERE b.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL ' . $days . ' DAY) ORDER BY b.created_at DESC', 'bookings'],
    'customers' => ['SELECT c.full_name, c.email, c.phone, c.is_active, c.created_at, COUNT(b.id) AS booking_count FROM customers c LEFT JOIN bookings b ON b.customer_id = c.id GROUP BY c.id ORDER BY c.created_at DESC', 'customers'],
    'analytics' => ['SELECT DATE(visited_at) AS date, page_path, COUNT(*) AS page_views, COUNT(DISTINCT visitor_hash) AS daily_visitor_ids FROM analytics_visits WHERE visited_at >= DATE_SUB(CURRENT_DATE, INTERVAL ' . $days . ' DAY) GROUP BY DATE(visited_at), page_path ORDER BY date DESC, page_views DESC', 'analytics'],
];
if (!isset($queries[$report])) fail_request(422, 'Choose an available report.');
try {
    $rows = database()->query($queries[$report][0]);
    header_remove('Content-Type');
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="faith-cleanpro-' . $queries[$report][1] . '-' . gmdate('Y-m-d') . '.csv"');
    header('Cache-Control: no-store, private');
    $output = fopen('php://output', 'wb');
    fwrite($output, "\xEF\xBB\xBF");
    $headersWritten = false;
    while ($row = $rows->fetch(PDO::FETCH_ASSOC)) {
        if (!$headersWritten) { fputcsv($output, array_keys($row)); $headersWritten = true; }
        foreach ($row as &$value) {
            $value = (string) $value;
            if (preg_match('/^[\s]*[=+@\-]/u', $value)) $value = "'" . $value;
        }
        unset($value);
        fputcsv($output, $row);
    }
    if (!$headersWritten) fputcsv($output, ['No records in this date range']);
    fclose($output);
    exit;
} catch (Throwable $error) {
    error_log('Admin report export failed: ' . $error->getMessage());
    fail_request(503, 'This report is temporarily unavailable.');
}
