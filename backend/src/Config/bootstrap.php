<?php
declare(strict_types=1);
spl_autoload_register(static function(string $class): void { $prefix='CleanPro\\'; if(strncmp($class,$prefix,strlen($prefix))!==0)return; $file=__DIR__.'/../'.str_replace('\\','/',substr($class,strlen($prefix))).'.php'; if(is_file($file))require $file; });
$envFile=__DIR__.'/../../.env';
if(is_file($envFile)){foreach(parse_ini_file($envFile,false,INI_SCANNER_RAW)?:[] as $key=>$value){if(getenv((string)$key)===false){putenv($key.'='.$value);$_ENV[$key]=$value;}}}
$secure=(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off');
session_name('cleanpro_admin');session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>$secure,'httponly'=>true,'samesite'=>'Strict']);session_start();
