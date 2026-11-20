<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){fwrite(STDERR,"Run this script from the command line only.\n");exit(1);}
require_once __DIR__.'/../src/Config/bootstrap.php';
use CleanPro\Config\Database;
$allowed=strtolower((string)(getenv('ADMIN_EMAIL')?:''));if($allowed!=='samuelarius437@gmail.com'){fwrite(STDERR,"Set ADMIN_EMAIL=samuelarius437@gmail.com in the PHP environment first.\n");exit(1);}
function ask(string $label):string{fwrite(STDOUT,$label);return trim((string)fgets(STDIN));}
$name=ask('Administrator name: ');$password=ask('New password (minimum 12 characters): ');
if($name===''||strlen($password)<12){fwrite(STDERR,"Name is required and password must contain at least 12 characters.\n");exit(1);}
$db=Database::connection();$stmt=$db->prepare('INSERT INTO admin_users (name,email,password_hash,role) VALUES (?,?,?,?)');
try{$stmt->execute([$name,$allowed,password_hash($password,PASSWORD_DEFAULT),'superadmin']);fwrite(STDOUT,"Administrator created for {$allowed}. Store the password securely.\n");}catch(Throwable $e){fwrite(STDERR,"Unable to create administrator (the account may already exist).\n");exit(1);}
