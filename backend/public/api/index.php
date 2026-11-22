<?php
declare(strict_types=1);
require_once __DIR__ . '/../../src/Config/bootstrap.php';
use CleanPro\Config\Database;
use CleanPro\Utils\Http;
use CleanPro\Middleware\Auth;
use CleanPro\Controllers\PlatformController;
use CleanPro\Middleware\RateLimiter;

Http::cors();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = trim((string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');
$path = preg_replace('#^.*?/api/?#', '', $path) ?? '';
$contentType=(string)($_SERVER['CONTENT_TYPE']??'');$input=str_contains($contentType,'application/json')?Http::json():[];

try {
  $db = Database::connection();
  if ($method === 'POST' && $path === 'analytics/track') {
    Http::assertSameOrigin();RateLimiter::enforce($db,'analytics-track',240);
    $page=Http::string($input,'path',240);
    $visitor=(string)($input['visitor_id']??'');
    if(!preg_match('#^/(?!/)[a-zA-Z0-9/_-]*$#',$page)||!preg_match('/^[a-f0-9-]{36}$/i',$visitor))Http::fail(422,'Invalid visit data.');
    $referrer=(string)($input['referrer']??'');$host=null;
    if($referrer!==''&&filter_var($referrer,FILTER_VALIDATE_URL)){$parsed=parse_url($referrer);$hosts=[strtolower((string)(parse_url((string)(getenv('FRONTEND_ORIGIN')?:'http://localhost:5173'),PHP_URL_HOST)?:'')),strtolower((string)(parse_url((string)($_SERVER['HTTP_ORIGIN']??''),PHP_URL_HOST)?:'')),strtolower((string)($_SERVER['HTTP_HOST']??''))];if(isset($parsed['host'])&&!in_array(strtolower((string)$parsed['host']),$hosts,true))$host=substr(strtolower((string)$parsed['host']),0,190);}
    $agent=strtolower((string)($_SERVER['HTTP_USER_AGENT']??''));$device=str_contains($agent,'ipad')||str_contains($agent,'tablet')?'tablet':(preg_match('/android|iphone|ipod|mobile/',$agent)?'mobile':($agent!==''?'desktop':'unknown'));
    $stmt=$db->prepare('INSERT INTO visit_events (visitor_hash,page_path,referrer_host,device_type) VALUES (?,?,?,?)');$stmt->execute([hash('sha256',$visitor),$page,$host,$device]);
    Http::respond(['success'=>true,'message'=>'Visit recorded','data'=>null],202);
  }
  if ($method === 'GET' && $path === 'admin/analytics') {
    Auth::requireAdmin();Auth::requireCsrf();$days=filter_var($_GET['days']??30,FILTER_VALIDATE_INT);if(!in_array($days,[7,30,90],true))Http::fail(422,'Choose a supported reporting period.');
    $start=(new DateTimeImmutable('today'))->modify('-'.($days-1).' days')->format('Y-m-d 00:00:00');
    $summary=$db->prepare('SELECT COUNT(*) AS total_views,COUNT(DISTINCT visitor_hash) AS unique_visitors FROM visit_events WHERE visited_at>=?');$summary->execute([$start]);$totals=$summary->fetch()?:['total_views'=>0,'unique_visitors'=>0];
    $daily=$db->prepare('SELECT DATE(visited_at) AS date,COUNT(*) AS views FROM visit_events WHERE visited_at>=? GROUP BY DATE(visited_at) ORDER BY date');$daily->execute([$start]);
    $pages=$db->prepare('SELECT page_path AS path,COUNT(*) AS views FROM visit_events WHERE visited_at>=? GROUP BY page_path ORDER BY views DESC LIMIT 8');$pages->execute([$start]);
    $referrers=$db->prepare('SELECT referrer_host AS host,COUNT(*) AS views FROM visit_events WHERE visited_at>=? AND referrer_host IS NOT NULL GROUP BY referrer_host ORDER BY views DESC LIMIT 8');$referrers->execute([$start]);
    Http::respond(['success'=>true,'message'=>'Analytics loaded','data'=>['total_views'=>(int)$totals['total_views'],'unique_visitors'=>(int)$totals['unique_visitors'],'daily'=>array_map(static fn(array $row):array=>['date'=>(string)$row['date'],'views'=>(int)$row['views']],$daily->fetchAll()),'top_pages'=>array_map(static fn(array $row):array=>['path'=>(string)$row['path'],'views'=>(int)$row['views']],$pages->fetchAll()),'referrers'=>array_map(static fn(array $row):array=>['host'=>(string)$row['host'],'views'=>(int)$row['views']],$referrers->fetchAll())]]);
  }
  if(PlatformController::dispatch($db,$method,$path,$input))return;
  if ($method === 'GET' && $path === 'customer/session') {
    Auth::requireCustomer();Http::respond(['success'=>true,'message'=>'Session active','data'=>['csrf'=>$_SESSION['csrf'],'name'=>$_SESSION['customer_name']]]);
  }
  if ($method === 'POST' && $path === 'customer/password/forgot') {
    Http::assertSameOrigin();RateLimiter::enforce($db,'password-reset',3);$email=Http::email($input);$stmt=$db->prepare('SELECT id,name FROM customers WHERE email=? AND active=1 LIMIT 1');$stmt->execute([$email]);$customer=$stmt->fetch();
    if($customer){$token=bin2hex(random_bytes(32));$hash=hash('sha256',$token);$db->prepare('UPDATE password_reset_tokens SET used_at=CURRENT_TIMESTAMP WHERE customer_id=? AND used_at IS NULL')->execute([(int)$customer['id']]);$db->prepare('INSERT INTO password_reset_tokens (customer_id,token_hash,expires_at) VALUES (?,?,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 1 HOUR))')->execute([(int)$customer['id'],$hash]);$origin=rtrim((string)(getenv('PASSWORD_RESET_URL')?:((getenv('FRONTEND_ORIGIN')?:'http://localhost:5173').'/reset-password')),'/');$link=$origin.'?'.http_build_query(['token'=>$token]);$from=(string)(getenv('PASSWORD_RESET_FROM')?:'no-reply@localhost.localdomain');if(filter_var($from,FILTER_VALIDATE_EMAIL)){ $headers='From: '.$from."\r\n".'Content-Type: text/plain; charset=UTF-8';$sent=@mail($email,'Reset your CleanPro password',"Use this link within one hour to reset your password:\n\n".$link,$headers);if(!$sent){error_log('[CleanPro API] Password reset email could not be delivered.');$db->prepare('UPDATE password_reset_tokens SET used_at=CURRENT_TIMESTAMP WHERE token_hash=?')->execute([$hash]);}} }
    Http::respond(['success'=>true,'message'=>'If an active account matches that email, password reset instructions will be sent.','data'=>null]);
  }
  if ($method === 'POST' && $path === 'customer/password/reset') {
    Http::assertSameOrigin();RateLimiter::enforce($db,'password-reset',8);$token=(string)($input['token']??'');$password=(string)($input['password']??'');if(!preg_match('/^[a-f0-9]{64}$/',$token)||strlen($password)<12||strlen($password)>200)Http::fail(422,'Check the reset link and use a password with at least 12 characters.');
    $db->beginTransaction();try{$stmt=$db->prepare('SELECT t.id,t.customer_id FROM password_reset_tokens t JOIN customers c ON c.id=t.customer_id WHERE t.token_hash=? AND c.active=1 AND t.used_at IS NULL AND t.expires_at>CURRENT_TIMESTAMP FOR UPDATE');$stmt->execute([hash('sha256',$token)]);$reset=$stmt->fetch();if(!$reset){$db->rollBack();Http::fail(400,'This reset link is invalid or has expired.');}$db->prepare('UPDATE customers SET password_hash=? WHERE id=?')->execute([password_hash($password,PASSWORD_DEFAULT),(int)$reset['customer_id']]);$db->prepare('UPDATE password_reset_tokens SET used_at=CURRENT_TIMESTAMP WHERE customer_id=? AND used_at IS NULL')->execute([(int)$reset['customer_id']]);$db->commit();Http::respond(['success'=>true,'message'=>'Password updated. You can now sign in.','data'=>null]);}catch(Throwable $error){if($db->inTransaction())$db->rollBack();throw $error;}
  }
  if ($method === 'POST' && $path === 'customer/register') {
    Http::assertSameOrigin();RateLimiter::enforce($db,'customer-registration',5);$name=Http::string($input,'name',120);$email=Http::email($input);$password=(string)($input['password']??'');
    if(strlen($password)<12||strlen($password)>200)Http::fail(422,'Use a password with at least 12 characters.');
    $stmt=$db->prepare('INSERT INTO customers (name,email,password_hash) VALUES (?,?,?)');
    try{$stmt->execute([$name,$email,password_hash($password,PASSWORD_DEFAULT)]);}catch(PDOException $error){if($error->getCode()==='23000')Http::fail(409,'An account could not be created with those details.');throw $error;}
    session_regenerate_id(true);$_SESSION=[];$_SESSION['customer_id']=(int)$db->lastInsertId();$_SESSION['customer_name']=$name;$_SESSION['csrf']=bin2hex(random_bytes(32));$_SESSION['last_seen']=time();
    Http::respond(['success'=>true,'message'=>'Account created','data'=>['csrf'=>$_SESSION['csrf'],'name'=>$name]],201);
  }
  if ($method === 'POST' && $path === 'customer/login') {
    Http::assertSameOrigin();RateLimiter::enforce($db,'customer-login',8);$email=Http::email($input);$password=(string)($input['password']??'');
    $stmt=$db->prepare('SELECT id,name,password_hash FROM customers WHERE email=? AND active=1 LIMIT 1');$stmt->execute([$email]);$customer=$stmt->fetch();
    if(!$customer||!password_verify($password,$customer['password_hash']))Http::fail(401,'Invalid email or password.');
    session_regenerate_id(true);$_SESSION=[];$_SESSION['customer_id']=(int)$customer['id'];$_SESSION['customer_name']=$customer['name'];$_SESSION['csrf']=bin2hex(random_bytes(32));$_SESSION['last_seen']=time();
    Http::respond(['success'=>true,'message'=>'Signed in','data'=>['csrf'=>$_SESSION['csrf'],'name'=>$customer['name']]]);
  }
  if ($path === 'customer/logout' && $method === 'POST') {Auth::requireCustomer();Auth::requireCsrf();$_SESSION=[];session_regenerate_id(true);Http::respond(['success'=>true,'message'=>'Signed out','data'=>null]);}
  if ($path === 'customer/bookings' && $method === 'GET') {
    Auth::requireCustomer();Auth::requireCsrf();$stmt=$db->prepare('SELECT b.id,b.preferred_date,b.preferred_time,b.status,s.name AS service_name FROM bookings b JOIN services s ON s.id=b.service_id WHERE b.customer_id=? ORDER BY b.created_at DESC');$stmt->execute([(int)$_SESSION['customer_id']]);Http::respond(['success'=>true,'message'=>'Bookings loaded','data'=>$stmt->fetchAll()]);
  }
  if ($method === 'GET' && $path === 'availability') {
    $service=(int)($_GET['service_id']??0);$date=(string)($_GET['date']??'');$parts=explode('-',$date);
    if(!$service||count($parts)!==3||!checkdate((int)($parts[1]??0),(int)($parts[2]??0),(int)($parts[0]??0))||$date<date('Y-m-d'))Http::fail(422,'Choose a valid service and date.');
    $stmt=$db->prepare("SELECT a.id,a.slot_date,a.starts_at,a.ends_at FROM availability_slots a WHERE a.service_id=? AND a.slot_date=? AND a.active=1 AND (a.slot_date>CURRENT_DATE() OR a.starts_at>CURRENT_TIME()) AND (SELECT COUNT(*) FROM bookings b WHERE b.service_id=a.service_id AND b.preferred_date=a.slot_date AND b.preferred_time=a.starts_at AND b.status IN ('new','contacted','confirmed'))<a.capacity ORDER BY a.starts_at");$stmt->execute([$service,$date]);Http::respond(['success'=>true,'message'=>'Availability loaded','data'=>$stmt->fetchAll()]);
  }
  if ($method === 'POST' && $path === 'booking-lookup') {
    Http::assertSameOrigin();$email=Http::email($input);$reference=strtoupper(trim((string)($input['reference']??'')));
    if(!preg_match('/^CP-[A-F0-9]{24}$/',$reference))Http::fail(404,'We could not find a booking with those details.');
    $stmt=$db->prepare('SELECT b.preferred_date,b.preferred_time,b.status,s.name AS service_name FROM bookings b JOIN services s ON s.id=b.service_id WHERE b.reference_hash=? AND b.email=? LIMIT 1');$stmt->execute([hash('sha256',$reference),$email]);$booking=$stmt->fetch();if(!$booking)Http::fail(404,'We could not find a booking with those details.');Http::respond(['success'=>true,'message'=>'Booking found','data'=>$booking]);
  }
  if ($method === 'GET' && $path === 'services') {
    $stmt = $db->query('SELECT id,name,slug,description,price_from,active FROM services WHERE active=1 ORDER BY sort_order,id');
    Http::respond(['success'=>true,'message'=>'Services loaded','data'=>$stmt->fetchAll()]);
  }
  if ($method === 'GET' && preg_match('#^services/([a-z0-9-]{1,170})$#', $path, $match)) {
    $stmt=$db->prepare('SELECT id,name,slug,description,price_from,active FROM services WHERE slug=? AND active=1 LIMIT 1');$stmt->execute([$match[1]]);$service=$stmt->fetch();
    if(!$service)Http::fail(404,'Service not found.');Http::respond(['success'=>true,'message'=>'Service loaded','data'=>$service]);
  }
  if ($method === 'POST' && $path === 'bookings') {
    Http::assertSameOrigin();$name=Http::string($input,'name',120);$email=Http::email($input);$phone=Http::string($input,'phone',30);
    $service=(int)($input['service_id']??0);$date=(string)($input['preferred_date']??'');$time=(string)($input['preferred_time']??'');$address=Http::string($input,'address',255);$property=Http::string($input,'property_type',40);$notes=Http::string($input,'notes',1200,false);$parts=explode('-',$date);
    if(!$service||count($parts)!==3||!checkdate((int)($parts[1]??0),(int)($parts[2]??0),(int)($parts[0]??0))||$date<date('Y-m-d')||($date===date('Y-m-d')&&$time<=date('H:i'))||!preg_match('/^(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?$/',$time)||!in_array($property,['Apartment','House','Office','Other'],true))Http::fail(422,'Choose a valid service, date, time, and property type.');
    $stmt=$db->prepare('SELECT id,price_from FROM services WHERE id=? AND active=1');$stmt->execute([$service]);$serviceRow=$stmt->fetch();if(!$serviceRow)Http::fail(422,'That service is not currently available.');
    $db->beginTransaction();
    try{$slot=$db->prepare('SELECT id,capacity FROM availability_slots WHERE service_id=? AND slot_date=? AND starts_at=? AND active=1 FOR UPDATE');$slot->execute([$service,$date,$time]);$available=$slot->fetch();if(!$available) { $db->rollBack();Http::fail(409,'That time is no longer available. Choose another slot.'); }
      $count=$db->prepare("SELECT COUNT(*) FROM bookings WHERE service_id=? AND preferred_date=? AND preferred_time=? AND status IN ('new','contacted','confirmed')");$count->execute([$service,$date,$time]);if((int)$count->fetchColumn()>=(int)$available['capacity']){$db->rollBack();Http::fail(409,'That time is no longer available. Choose another slot.');}
      $reference='CP-'.strtoupper(bin2hex(random_bytes(12)));$customerId=empty($_SESSION['customer_id'])?null:(int)$_SESSION['customer_id'];
      $stmt=$db->prepare('INSERT INTO bookings (customer_id,name,email,phone,service_id,preferred_date,preferred_time,address,property_type,price_quote,notes,reference_hash,reference_created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)');$stmt->execute([$customerId,$name,$email,$phone,$service,$date,$time,$address,$property,$serviceRow['price_from'],$notes,hash('sha256',$reference)]);$bookingId=(int)$db->lastInsertId();$initialHistory=$db->prepare('INSERT INTO booking_status_history (booking_id,old_status,new_status) VALUES (?,NULL,?)');$initialHistory->execute([$bookingId,'new']);$db->commit();
      Http::respond(['success'=>true,'message'=>'Request received','data'=>['id'=>$bookingId,'reference'=>$reference]],201);
    }catch(Throwable $error){if($db->inTransaction())$db->rollBack();throw $error;}
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
    Http::assertSameOrigin();RateLimiter::enforce($db,'admin-login',8);$email=Http::email($input);$password=(string)($input['password']??'');
    $allowed=strtolower((string)(getenv('ADMIN_EMAIL')?:''));if($allowed===''||!hash_equals($allowed,strtolower($email)))Http::fail(401,'Invalid email or password.');
    $stmt=$db->prepare('SELECT id,name,email,password_hash,role FROM admin_users WHERE email=? AND active=1');$stmt->execute([$email]);$user=$stmt->fetch();
    if(!$user||!password_verify($password,$user['password_hash']))Http::fail(401,'Invalid email or password.');
    session_regenerate_id(true);$_SESSION=[];$_SESSION['admin_id']=(int)$user['id'];$_SESSION['admin_name']=$user['name'];$_SESSION['csrf']=bin2hex(random_bytes(32));$_SESSION['last_seen']=time();
    Http::respond(['success'=>true,'message'=>'Signed in','data'=>['csrf'=>$_SESSION['csrf'],'name'=>$user['name']]]);
  }
  if ($path === 'admin/logout' && $method === 'POST') { Auth::requireAdmin();Auth::requireCsrf();$_SESSION=[];session_destroy();Http::respond(['success'=>true,'message'=>'Signed out','data'=>null]); }
  if ($path === 'admin/dashboard' && $method === 'GET') {
    Auth::requireAdmin();Auth::requireCsrf();
    $counts=['bookings'=>(int)$db->query('SELECT COUNT(*) FROM bookings')->fetchColumn(),'pending'=>(int)$db->query("SELECT COUNT(*) FROM bookings WHERE status IN ('new','contacted')")->fetchColumn(),'confirmed'=>(int)$db->query("SELECT COUNT(*) FROM bookings WHERE status='confirmed'")->fetchColumn(),'in_progress'=>(int)$db->query("SELECT COUNT(*) FROM bookings WHERE status='in_progress'")->fetchColumn(),'completed'=>(int)$db->query("SELECT COUNT(*) FROM bookings WHERE status='completed'")->fetchColumn(),'cancelled'=>(int)$db->query("SELECT COUNT(*) FROM bookings WHERE status='cancelled'")->fetchColumn(),'customers'=>(int)$db->query('SELECT COUNT(*) FROM customers')->fetchColumn(),'messages'=>(int)$db->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn(),'unread_messages'=>(int)$db->query("SELECT COUNT(*) FROM contact_messages WHERE status='new'")->fetchColumn(),'services'=>(int)$db->query('SELECT COUNT(*) FROM services WHERE active=1')->fetchColumn()];
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
    Auth::requireAdmin();Auth::requireCsrf();$status=(string)($input['status']??'');if(!in_array($status,['new','contacted','confirmed','in_progress','completed','cancelled'],true))Http::fail(422,'Choose a valid booking status.');
    $db->beginTransaction();try{$stmt=$db->prepare('SELECT status FROM bookings WHERE id=? FOR UPDATE');$stmt->execute([(int)$match[1]]);$old=$stmt->fetchColumn();if($old===false){$db->rollBack();Http::fail(404,'Booking not found.');}$update=$db->prepare('UPDATE bookings SET status=? WHERE id=?');$update->execute([$status,(int)$match[1]]);if($old!==$status){$history=$db->prepare('INSERT INTO booking_status_history (booking_id,old_status,new_status,changed_by_admin_id) VALUES (?,?,?,?)');$history->execute([(int)$match[1],$old,$status,(int)$_SESSION['admin_id']]);}$db->commit();Http::respond(['success'=>true,'message'=>'Booking updated','data'=>null]);}catch(Throwable $error){if($db->inTransaction())$db->rollBack();throw $error;}
  }
  Http::fail(404,'Endpoint not found.');
} catch (Throwable $error) {
  error_log('[CleanPro API] '.$error->getMessage());
  Http::fail(500,'Something went wrong. Please try again later.');
}
