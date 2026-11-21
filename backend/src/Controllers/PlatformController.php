<?php
declare(strict_types=1);
namespace CleanPro\Controllers;
use CleanPro\Middleware\Auth;
use CleanPro\Utils\Http;
use PDO;

final class PlatformController {
  public static function dispatch(PDO $db, string $method, string $path, array $input): bool {
    if ($method === 'GET' && in_array($path, ['gallery', 'testimonials', 'faqs', 'content'], true)) {
      $queries = [
        'gallery' => 'SELECT id,title,description,category,file_name,published FROM gallery_images WHERE published=1 ORDER BY sort_order,id',
        'testimonials' => 'SELECT id,customer_name,content,rating FROM testimonials WHERE approved=1 AND published=1 ORDER BY created_at DESC',
        'faqs' => 'SELECT id,question,answer,category FROM faqs WHERE published=1 ORDER BY sort_order,id',
        'content' => 'SELECT setting_key,setting_value FROM website_settings',
      ];
      $rows=$db->query($queries[$path])->fetchAll();
      if($path==='gallery')foreach($rows as &$row)$row['image_url']=self::uploadUrl((string)$row['file_name']);
      if($path==='content'){$map=[];foreach($rows as $row)$map[$row['setting_key']]=$row['setting_value'];$rows=$map;}
      Http::respond(['success'=>true,'message'=>'Content loaded','data'=>$rows]);
    }

    if ($path==='testimonials' && $method==='POST') {
      Auth::requireCustomer();Auth::requireCsrf();$content=Http::string($input,'content',2000);$rating=filter_var($input['rating']??null,FILTER_VALIDATE_INT);if(!$rating||$rating<1||$rating>5)Http::fail(422,'Choose a rating from 1 to 5.');$completed=$db->prepare("SELECT id FROM bookings WHERE customer_id=? AND status='completed' LIMIT 1");$completed->execute([(int)$_SESSION['customer_id']]);if(!$completed->fetch())Http::fail(403,'A completed service is required before submitting a review.');
      $stmt=$db->prepare('INSERT INTO testimonials (customer_name,content,rating) VALUES (?,?,?)');$stmt->execute([$_SESSION['customer_name'],$content,$rating]);Http::respond(['success'=>true,'message'=>'Your review was submitted for moderation','data'=>['id'=>(int)$db->lastInsertId()]],201);
    }

    if ($path==='admin/availability' && $method==='GET') {
      Auth::requireAdmin();Auth::requireCsrf();$rows=$db->query('SELECT a.id,a.service_id,s.name AS service_name,a.slot_date,a.starts_at,a.ends_at,a.capacity,a.active FROM availability_slots a JOIN services s ON s.id=a.service_id ORDER BY a.slot_date,a.starts_at')->fetchAll();Http::respond(['success'=>true,'message'=>'Availability loaded','data'=>$rows]);
    }
    if ($path==='admin/availability' && $method==='POST') {
      Auth::requireAdmin();Auth::requireCsrf();$service=(int)($input['service_id']??0);$date=(string)($input['slot_date']??'');$start=(string)($input['starts_at']??'');$end=(string)($input['ends_at']??'');$capacity=filter_var($input['capacity']??1,FILTER_VALIDATE_INT);$parts=explode('-',$date);
      if(!$service||count($parts)!==3||!checkdate((int)($parts[1]??0),(int)($parts[2]??0),(int)($parts[0]??0))||$date<date('Y-m-d')||!preg_match('/^([01]\\d|2[0-3]):[0-5]\\d$/',$start)||!preg_match('/^([01]\\d|2[0-3]):[0-5]\\d$/',$end)||$end<=$start||!$capacity||$capacity>25)Http::fail(422,'Enter a valid date, time range, service, and capacity.');
      $serviceCheck=$db->prepare('SELECT id FROM services WHERE id=? AND active=1');$serviceCheck->execute([$service]);if(!$serviceCheck->fetch())Http::fail(422,'Choose an active service.');
      $stmt=$db->prepare('INSERT INTO availability_slots (service_id,slot_date,starts_at,ends_at,capacity) VALUES (?,?,?,?,?)');$stmt->execute([$service,$date,$start,$end,$capacity]);Http::respond(['success'=>true,'message'=>'Time slot added','data'=>['id'=>(int)$db->lastInsertId()]],201);
    }
    if(preg_match('#^admin/availability/(\\d+)$#',$path,$match)&&$method==='PATCH'){
      Auth::requireAdmin();Auth::requireCsrf();$active=filter_var($input['active']??null,FILTER_VALIDATE_BOOLEAN,FILTER_NULL_ON_FAILURE);if($active===null)Http::fail(422,'Choose a valid availability status.');$stmt=$db->prepare('UPDATE availability_slots SET active=? WHERE id=?');$stmt->execute([$active?1:0,(int)$match[1]]);if(!$stmt->rowCount())Http::fail(404,'Availability slot not found.');Http::respond(['success'=>true,'message'=>'Availability updated','data'=>null]);
    }

    if ($path==='admin/faqs' && $method==='GET') {Auth::requireAdmin();Auth::requireCsrf();Http::respond(['success'=>true,'message'=>'FAQs loaded','data'=>$db->query('SELECT * FROM faqs ORDER BY sort_order,id')->fetchAll()]);}
    if ($path==='admin/faqs' && $method==='POST') {Auth::requireAdmin();Auth::requireCsrf();$q=Http::string($input,'question',300);$a=Http::string($input,'answer',5000);$cat=Http::string($input,'category',80,false)?:'General';$stmt=$db->prepare('INSERT INTO faqs (question,answer,category,published) VALUES (?,?,?,?)');$stmt->execute([$q,$a,$cat,!empty($input['published'])?1:0]);Http::respond(['success'=>true,'message'=>'FAQ created','data'=>['id'=>(int)$db->lastInsertId()]],201);}
    if(preg_match('#^admin/faqs/(\\d+)$#',$path,$match)&&$method==='PATCH') {Auth::requireAdmin();Auth::requireCsrf();$id=(int)$match[1];$q=Http::string($input,'question',300);$a=Http::string($input,'answer',5000);$cat=Http::string($input,'category',80,false)?:'General';$stmt=$db->prepare('UPDATE faqs SET question=?,answer=?,category=?,published=? WHERE id=?');$stmt->execute([$q,$a,$cat,!empty($input['published'])?1:0,$id]);if(!$stmt->rowCount())Http::fail(404,'FAQ not found.');Http::respond(['success'=>true,'message'=>'FAQ updated','data'=>null]);}
    if(preg_match('#^admin/faqs/(\\d+)$#',$path,$match)&&$method==='DELETE') {Auth::requireAdmin();Auth::requireCsrf();$stmt=$db->prepare('DELETE FROM faqs WHERE id=?');$stmt->execute([(int)$match[1]]);if(!$stmt->rowCount())Http::fail(404,'FAQ not found.');Http::respond(['success'=>true,'message'=>'FAQ deleted','data'=>null]);}

    if ($path==='admin/testimonials' && $method==='GET') {Auth::requireAdmin();Auth::requireCsrf();Http::respond(['success'=>true,'message'=>'Testimonials loaded','data'=>$db->query('SELECT * FROM testimonials ORDER BY created_at DESC')->fetchAll()]);}
    if(preg_match('#^admin/testimonials/(\\d+)$#',$path,$match)&&$method==='PATCH') {Auth::requireAdmin();Auth::requireCsrf();$approved=filter_var($input['approved']??null,FILTER_VALIDATE_BOOLEAN,FILTER_NULL_ON_FAILURE);$published=filter_var($input['published']??null,FILTER_VALIDATE_BOOLEAN,FILTER_NULL_ON_FAILURE);if($approved===null||$published===null||($published&&!$approved))Http::fail(422,'Approve a review before publishing it.');$stmt=$db->prepare('UPDATE testimonials SET approved=?,published=? WHERE id=?');$stmt->execute([$approved?1:0,$published?1:0,(int)$match[1]]);if(!$stmt->rowCount())Http::fail(404,'Testimonial not found.');Http::respond(['success'=>true,'message'=>'Testimonial updated','data'=>null]);}

    if ($path==='admin/gallery' && $method==='GET') {Auth::requireAdmin();Auth::requireCsrf();$rows=$db->query('SELECT * FROM gallery_images ORDER BY sort_order,id')->fetchAll();foreach($rows as &$row)$row['image_url']=self::uploadUrl((string)$row['file_name']);Http::respond(['success'=>true,'message'=>'Gallery loaded','data'=>$rows]);}
    if ($path==='admin/gallery' && $method==='POST') {Auth::requireAdmin();Auth::requireCsrf();$title=Http::string($_POST,'title',160);$description=Http::string($_POST,'description',500,false);$category=Http::string($_POST,'category',80,false)?:'General';$upload=$_FILES['image']??null;if(!$upload||$upload['error']!==UPLOAD_ERR_OK||$upload['size']>5*1024*1024)Http::fail(422,'Choose an image under 5 MB.');$finfo=new \finfo(FILEINFO_MIME_TYPE);$mime=$finfo->file($upload['tmp_name']);$extensions=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];if(!isset($extensions[$mime])||!@getimagesize($upload['tmp_name']))Http::fail(422,'Use a valid JPG, PNG, or WebP image.');$directory=__DIR__.'/../../public/uploads';if(!is_dir($directory)&&!mkdir($directory,0750,true)&&!is_dir($directory))Http::fail(500,'Image storage is not available.');$filename=bin2hex(random_bytes(20)).'.'.$extensions[$mime];if(!move_uploaded_file($upload['tmp_name'],$directory.'/'.$filename))Http::fail(500,'Image upload failed.');$stmt=$db->prepare('INSERT INTO gallery_images (title,description,category,file_name,mime_type,published) VALUES (?,?,?,?,?,?)');$stmt->execute([$title,$description,$category,$filename,$mime,!empty($_POST['published'])?1:0]);Http::respond(['success'=>true,'message'=>'Image uploaded','data'=>['id'=>(int)$db->lastInsertId(),'file_name'=>$filename,'image_url'=>self::uploadUrl($filename)]],201);}
    if(preg_match('#^admin/gallery/(\\d+)$#',$path,$match)&&$method==='PATCH') {Auth::requireAdmin();Auth::requireCsrf();$published=filter_var($input['published']??null,FILTER_VALIDATE_BOOLEAN,FILTER_NULL_ON_FAILURE);if($published===null)Http::fail(422,'Choose a valid visibility.');$stmt=$db->prepare('UPDATE gallery_images SET published=? WHERE id=?');$stmt->execute([$published?1:0,(int)$match[1]]);if(!$stmt->rowCount())Http::fail(404,'Image not found.');Http::respond(['success'=>true,'message'=>'Image updated','data'=>null]);}
    if(preg_match('#^admin/gallery/(\\d+)$#',$path,$match)&&$method==='DELETE') {Auth::requireAdmin();Auth::requireCsrf();$stmt=$db->prepare('SELECT file_name FROM gallery_images WHERE id=?');$stmt->execute([(int)$match[1]]);$image=$stmt->fetch();if(!$image)Http::fail(404,'Image not found.');$delete=$db->prepare('DELETE FROM gallery_images WHERE id=?');$delete->execute([(int)$match[1]]);$file=__DIR__.'/../../public/uploads/'.basename($image['file_name']);if(is_file($file))unlink($file);Http::respond(['success'=>true,'message'=>'Image deleted','data'=>null]);}

    if ($path==='admin/customers' && $method==='GET') {Auth::requireAdmin();Auth::requireCsrf();$items=$db->query('SELECT c.id,c.name,c.email,c.created_at,COUNT(b.id) AS booking_count FROM customers c LEFT JOIN bookings b ON b.customer_id=c.id GROUP BY c.id ORDER BY c.created_at DESC LIMIT 200')->fetchAll();Http::respond(['success'=>true,'message'=>'Customers loaded','data'=>$items]);}
    if (preg_match('#^admin/customers/(\\d+)$#',$path,$match)&&$method==='GET') {Auth::requireAdmin();Auth::requireCsrf();$stmt=$db->prepare('SELECT id,name,email,created_at FROM customers WHERE id=? LIMIT 1');$stmt->execute([(int)$match[1]]);$customer=$stmt->fetch();if(!$customer)Http::fail(404,'Customer not found.');$bookings=$db->prepare('SELECT b.id,b.preferred_date,b.preferred_time,b.status,s.name AS service_name FROM bookings b JOIN services s ON s.id=b.service_id WHERE b.customer_id=? ORDER BY b.created_at DESC');$bookings->execute([(int)$customer['id']]);Http::respond(['success'=>true,'message'=>'Customer loaded','data'=>['customer'=>$customer,'bookings'=>$bookings->fetchAll()]]);}

    if ($path==='admin/content' && $method==='GET') {Auth::requireAdmin();Auth::requireCsrf();Http::respond(['success'=>true,'message'=>'Settings loaded','data'=>$db->query('SELECT setting_key,setting_value FROM website_settings')->fetchAll()]);}
    if ($path==='admin/content' && $method==='PUT') {Auth::requireAdmin();Auth::requireCsrf();$allowed=['business_name','business_email','business_phone','business_address','business_hours','home_headline','home_intro','about_story','mission','vision','social_instagram','social_facebook'];$stmt=$db->prepare('INSERT INTO website_settings (setting_key,setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)');foreach($allowed as $key)if(array_key_exists($key,$input)){$value=Http::string($input,$key,4000,false);$stmt->execute([$key,$value]);}Http::respond(['success'=>true,'message'=>'Website content saved','data'=>null]);}

    if ($path==='admin/reports/bookings.csv' && $method==='GET') {
      Auth::requireAdmin();Auth::requireCsrf();$from=(string)($_GET['from']??'');$to=(string)($_GET['to']??'');$fromParts=explode('-',$from);$toParts=explode('-',$to);
      if(count($fromParts)!==3||count($toParts)!==3||!checkdate((int)($fromParts[1]??0),(int)($fromParts[2]??0),(int)($fromParts[0]??0))||!checkdate((int)($toParts[1]??0),(int)($toParts[2]??0),(int)($toParts[0]??0))||$to<$from)Http::fail(422,'Choose a valid report date range.');
      $stmt=$db->prepare('SELECT b.id,b.created_at,b.name,b.email,b.phone,s.name AS service,b.preferred_date,b.preferred_time,b.status FROM bookings b JOIN services s ON s.id=b.service_id WHERE b.preferred_date BETWEEN ? AND ? ORDER BY b.preferred_date,b.preferred_time');$stmt->execute([$from,$to]);header('Content-Type: text/csv; charset=utf-8');header('Content-Disposition: attachment; filename="cleanpro-bookings.csv"');$out=fopen('php://output','w');fputcsv($out,['ID','Created','Customer','Email','Phone','Service','Date','Time','Status']);
      while($row=$stmt->fetch(PDO::FETCH_ASSOC)){foreach($row as $key=>$value){$first=substr((string)$value,0,1);if(is_string($value)&&in_array($first,['=','+','-','@',"\\t"],true))$row[$key]="'".$value;}fputcsv($out,$row);}fclose($out);exit;
    }
    return false;
  }

  private static function uploadUrl(string $file): string {
    $script=(string)($_SERVER['SCRIPT_NAME']??'/api/index.php');$public=dirname(dirname($script));return rtrim($public,'/').'/uploads/'.rawurlencode(basename($file));
  }
}
