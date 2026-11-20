<?php
namespace CleanPro\Middleware;
use CleanPro\Utils\Http;
final class Auth {
 public static function requireAdmin():void{if(empty($_SESSION['admin_id'])||empty($_SESSION['last_seen'])||time()-(int)$_SESSION['last_seen']>1800){$_SESSION=[];Http::fail(401,'Please sign in again.');}$_SESSION['last_seen']=time();}
 public static function requireCsrf():void{$given=$_SERVER['HTTP_X_CSRF_TOKEN']??'';$expected=$_SESSION['csrf']??'';if($given===''||$expected===''||!hash_equals($expected,$given))Http::fail(403,'Your session expired. Please refresh and try again.');}
}
