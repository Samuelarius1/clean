<?php
declare(strict_types=1);
require_once __DIR__ . '/../../src/Config/bootstrap.php';
use CleanPro\Config\Database;
use CleanPro\Utils\Http;
use CleanPro\Middleware\Auth;

Http::cors();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = trim((string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');
$path = preg_replace('#^.*?/api/?#', '', $path) ?? '';
$input = Http::json();

try {
  $db = Database::connection();
  if ($method === 'GET' && $path === 'services') {
    $stmt = $db->query('SELECT id,name,slug,description,price_from,active FROM services WHERE active=1 ORDER BY sort_order,id');
    Http::respond(['success'=>true,'message'=>'Services loaded','data'=>$stmt->fetchAll()]);
  }
  if ($method === 'GET' && preg_match('#^services/([a-z0-9-]{1,170})$#', $path, $match)) {
    $stmt=$db->prepare('SELECT id,name,slug,description,price_from,active FROM services WHERE slug=? AND active=1 LIMIT 1');$stmt->execute([$match[1]]);$service=$stmt->fetch();
    if(!$service)Http::fail(404,'Service not found.');Http::respond(['success'=>true,'message'=>'Service loaded','data'=>$service]);
  }
  if ($method === 'POST' && $path === 'bookings') {
    Http::assertSameOrigin();
    $name=Http::string($input,'name',120); $email=Http::email($input); $phone=Http::string($input,'phone',30);
    $service=(int)($input['service_id']??0); $date=(string)($input['preferred_date']??''); $address=Http::string($input,'address',255); $notes=Http::string($input,'notes',1200,false);
    $dateParts=explode('-',$date);
    if (!$service || count($dateParts)!==3 || !checkdate((int)($dateParts[1]??0),(int)($dateParts[2]??0),(int)($dateParts[0]??0)) || $date < date('Y-m-d')) Http::fail(422,'Choose a valid service and future date.');
    $stmt=$db->prepare('SELECT id FROM services WHERE id=? AND active=1');$stmt->execute([$service]);if(!$stmt->fetch())Http::fail(422,'That service is not currently available.');
    $stmt=$db->prepare('INSERT INTO bookings (name,email,phone,service_id,preferred_date,address,notes) VALUES (?,?,?,?,?,?,?)');$stmt->execute([$name,$email,$phone,$service,$date,$address,$notes]);
    Http::respond(['success'=>true,'message'=>'Request received','data'=>['id'=>(int)$db->lastInsertId()]],201);
  }
  if ($method === 'POST' && $path === 'contact') {
    Http::assertSameOrigin();$name=Http::string($input,'name',120);$email=Http::email($input);$phone=Http::string($input,'phone',30,false);$message=Http::string($input,'message',3000);
    $stmt=$db->prepare('INSERT INTO contact_messages (name,email,phone,message) VALUES (?,?,?,?)');$stmt->execute([$name,$email,$phone,$message]);
    Http::respond(['success'=>true,'message'=>'Message received','data'=>['id'=>(int)$db->lastInsertId()]],201);
  }
  if ($path === 'admin/session' && $method === 'GET') {
    Auth::requireAdmin();Http::respond(['success'=>true,'message'=>'Session active','data'=>['csrf'=>$_SESSION['csrf'],'name'=>$_SESSION['admin_name']]]);
  }
  if ($method === 'POST' && $path === 'admin/login') {
    Http::assertSameOrigin();$email=Http::email($input);$password=(string)($input['password']??'');
    $allowed=strtolower((string)(getenv('ADMIN_EMAIL')?:''));if($allowed===''||!hash_equals($allowed,strtolower($email)))Http::fail(401,'Invalid email or password.');
    $stmt=$db->prepare('SELECT id,name,email,password_hash,role FROM admin_users WHERE email=? AND active=1');$stmt->execute([$email]);$user=$stmt->fetch();
    if(!$user||!password_verify($password,$user['password_hash']))Http::fail(401,'Invalid email or password.');
    session_regenerate_id(true);$_SESSION['admin_id']=(int)$user['id'];$_SESSION['admin_name']=$user['name'];$_SESSION['csrf']=bin2hex(random_bytes(32));$_SESSION['last_seen']=time();
    Http::respond(['success'=>true,'message'=>'Signed in','data'=>['csrf'=>$_SESSION['csrf'],'name'=>$user['name']]]);
  }
  if ($path === 'admin/logout' && $method === 'POST') { Auth::requireAdmin();Auth::requireCsrf();$_SESSION=[];session_destroy();Http::respond(['success'=>true,'message'=>'Signed out','data'=>null]); }
  if ($path === 'admin/dashboard' && $method === 'GET') {
    Auth::requireAdmin();Auth::requireCsrf();
    $counts=['bookings'=>(int)$db->query('SELECT COUNT(*) FROM bookings')->fetchColumn(),'messages'=>(int)$db->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn(),'services'=>(int)$db->query('SELECT COUNT(*) FROM services WHERE active=1')->fetchColumn()];
    $bookings=$db->query('SELECT b.id,b.name,s.name AS service_name,b.preferred_date,b.status FROM bookings b JOIN services s ON s.id=b.service_id ORDER BY b.created_at DESC LIMIT 20')->fetchAll();
    Http::respond(['success'=>true,'message'=>'Dashboard loaded','data'=>compact('counts','bookings')]);
  }
  if (preg_match('#^admin/services/(\\d+)$#',$path,$match)&&$method==='PATCH') {
    Auth::requireAdmin();Auth::requireCsrf();$id=(int)$match[1];$active=filter_var($input['active']??null,FILTER_VALIDATE_BOOLEAN,FILTER_NULL_ON_FAILURE);if($active===null)Http::fail(422,'Choose a valid service status.');
    $stmt=$db->prepare('UPDATE services SET active=? WHERE id=?');$stmt->execute([$active?1:0,$id]);if(!$stmt->rowCount())Http::fail(404,'Service not found.');Http::respond(['success'=>true,'message'=>'Service updated','data'=>null]);
  }
  if ($path === 'admin/services' && $method === 'GET') {
    Auth::requireAdmin();Auth::requireCsrf();$items=$db->query('SELECT id,name,slug,description,price_from,active,sort_order FROM services ORDER BY sort_order,id')->fetchAll();
    Http::respond(['success'=>true,'message'=>'Services loaded','data'=>$items]);
  }
  if ($path === 'admin/services' && $method === 'POST') {
    Auth::requireAdmin();Auth::requireCsrf();$name=Http::string($input,'name',150);$description=Http::string($input,'description',3000);$slug=strtolower(trim((string)($input['slug']??'')));
    if(!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/',$slug))Http::fail(422,'Enter a valid service URL name.');
    $price=isset($input['price_from'])&&$input['price_from']!==''?(float)$input['price_from']:null;if($price!==null&&($price<0||$price>1000000))Http::fail(422,'Enter a valid starting price.');
    $stmt=$db->prepare('INSERT INTO services (name,slug,description,price_from) VALUES (?,?,?,?)');$stmt->execute([$name,$slug,$description,$price]);Http::respond(['success'=>true,'message'=>'Service created','data'=>['id'=>(int)$db->lastInsertId()]],201);
  }
  if ($path === 'admin/messages' && $method === 'GET') {
    Auth::requireAdmin();Auth::requireCsrf();$items=$db->query('SELECT id,name,email,phone,message,status,created_at FROM contact_messages ORDER BY created_at DESC LIMIT 100')->fetchAll();Http::respond(['success'=>true,'message'=>'Messages loaded','data'=>$items]);
  }
  if (preg_match('#^admin/messages/(\\d+)/status$#',$path,$match)&&$method==='PATCH') {
    Auth::requireAdmin();Auth::requireCsrf();$status=(string)($input['status']??'');if(!in_array($status,['new','read','replied','archived'],true))Http::fail(422,'Choose a valid message status.');
    $stmt=$db->prepare('UPDATE contact_messages SET status=? WHERE id=?');$stmt->execute([$status,(int)$match[1]]);if(!$stmt->rowCount())Http::fail(404,'Message not found.');Http::respond(['success'=>true,'message'=>'Message updated','data'=>null]);
  }
  if (preg_match('#^admin/bookings/(\\d+)/status$#',$path,$match)&&$method==='PATCH') {
    Auth::requireAdmin();Auth::requireCsrf();$status=(string)($input['status']??'');if(!in_array($status,['new','contacted','confirmed','completed','cancelled'],true))Http::fail(422,'Choose a valid booking status.');
    $stmt=$db->prepare('UPDATE bookings SET status=? WHERE id=?');$stmt->execute([$status,(int)$match[1]]);if(!$stmt->rowCount())Http::fail(404,'Booking not found.');Http::respond(['success'=>true,'message'=>'Booking updated','data'=>null]);
  }
  Http::fail(404,'Endpoint not found.');
} catch (Throwable $error) {
  error_log('[CleanPro API] '.$error->getMessage());
  Http::fail(500,'Something went wrong. Please try again later.');
}
