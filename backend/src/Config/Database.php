<?php
namespace CleanPro\Config;
use PDO;
use RuntimeException;
final class Database {
 private static ?PDO $pdo=null;
 public static function connection():PDO{if(self::$pdo)return self::$pdo;$host=getenv('DB_HOST')?:'127.0.0.1';$name=getenv('DB_NAME')?:'faiths_cleanpro';$user=getenv('DB_USER')?:'root';$password=getenv('DB_PASSWORD')?:'';if(!preg_match('/^[a-zA-Z0-9_]+$/',$name))throw new RuntimeException('Invalid DB_NAME configuration');$dsn="mysql:host={$host};dbname={$name};charset=utf8mb4";self::$pdo=new PDO($dsn,$user,$password,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]);return self::$pdo;}
}
