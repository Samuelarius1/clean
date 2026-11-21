<?php
declare(strict_types=1);
namespace CleanPro\Middleware;
use CleanPro\Utils\Http;
use PDO;

final class RateLimiter {
  public static function enforce(PDO $db, string $scope, int $limit=10): void {
    $address=(string)($_SERVER['REMOTE_ADDR']??'unknown');
    $bucket=hash('sha256',$scope.'|'.$address);
    $stmt=$db->prepare('INSERT INTO api_rate_limits (bucket_key,window_started_at,attempts) VALUES (?,CURRENT_TIMESTAMP,1) ON DUPLICATE KEY UPDATE attempts=IF(window_started_at<CURRENT_TIMESTAMP-INTERVAL 15 MINUTE,1,attempts+1),window_started_at=IF(window_started_at<CURRENT_TIMESTAMP-INTERVAL 15 MINUTE,CURRENT_TIMESTAMP,window_started_at)');
    $stmt->execute([$bucket]);
    $check=$db->prepare('SELECT attempts FROM api_rate_limits WHERE bucket_key=?');$check->execute([$bucket]);
    if((int)$check->fetchColumn()>$limit){header('Retry-After: 900');Http::fail(429,'Too many attempts. Please wait and try again.');}
  }
}
