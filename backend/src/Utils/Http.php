<?php
namespace CleanPro\Utils;
final class Http {
 public static function cors():void{$allowed=(string)(getenv('FRONTEND_ORIGIN')?:'http://localhost:5173');$origin=$_SERVER['HTTP_ORIGIN']??'';if($origin!==''&&hash_equals($allowed,$origin)){header('Access-Control-Allow-Origin: '.$allowed);header('Access-Control-Allow-Credentials: true');header('Vary: Origin');}header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');header('Content-Type: application/json; charset=utf-8');header('X-Content-Type-Options: nosniff');header('Cache-Control: no-store');if(($_SERVER['REQUEST_METHOD']??'')==='OPTIONS'){http_response_code(204);exit;}}
 public static function json():array{$data=json_decode(file_get_contents('php://input')?:'{}',true);if(!is_array($data))self::fail(400,'Invalid JSON request.');return $data;}
 public static function respond(array $body,int $status=200):never{http_response_code($status);echo json_encode($body,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE);exit;}
 public static function fail(int $status,string $message):never{self::respond(['success'=>false,'message'=>$message,'data'=>null],$status);}
 public static function string(array $data,string $key,int $max,bool $required=true):string{$value=trim((string)($data[$key]??''));if(($required&&$value==='')||mb_strlen($value)>$max)self::fail(422,'Please check the submitted information.');return $value;}
 public static function email(array $data):string{$email=filter_var(trim((string)($data['email']??'')),FILTER_VALIDATE_EMAIL);if(!$email||strlen($email)>190)self::fail(422,'Enter a valid email address.');return $email;}
 public static function assertSameOrigin():void{$origin=$_SERVER['HTTP_ORIGIN']??'';$allowed=(string)(getenv('FRONTEND_ORIGIN')?:'http://localhost:5173');if($origin!==''&&!hash_equals($allowed,$origin))self::fail(403,'Request origin is not allowed.');}
}
