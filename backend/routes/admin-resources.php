<?php
declare(strict_types=1);
require_once __DIR__ . '/../middleware/admin-auth.php';
$method = $_SERVER['REQUEST_METHOD'] ?? '';

function resource_query(string $resource): string
{
    return match ($resource) {
        'services' => 'SELECT id, name, slug, category, summary, description, features_json, price_from, image_url, is_published, is_featured, display_order, created_at FROM services ORDER BY display_order, id',
        'faqs' => 'SELECT id, category, question, answer, is_published, display_order FROM faqs ORDER BY category, display_order, id',
        'gallery' => 'SELECT id, title, description, before_image_path, after_image_path, category, is_published, display_order FROM gallery_items ORDER BY display_order, id',
        'testimonials' => 'SELECT id, customer_name, quote, rating, profile_image, is_approved, is_featured, created_at FROM testimonials ORDER BY created_at DESC, id DESC',
        'messages' => 'SELECT id, customer_name, email, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 300',
        'customers' => 'SELECT c.id, c.full_name, c.email, c.phone, c.is_active, c.created_at, COUNT(b.id) AS booking_count FROM customers c LEFT JOIN bookings b ON b.customer_id = c.id GROUP BY c.id ORDER BY c.created_at DESC LIMIT 300',
        default => '',
    };
}

function audit_change(PDO $pdo, array $admin, string $action, string $type, ?int $id, array $details = []): void
{
    $statement = $pdo->prepare('INSERT INTO admin_audit_log (admin_id, action, entity_type, entity_id, details) VALUES (:admin_id, :action, :type, :entity_id, :details)');
    $statement->execute(['admin_id' => $admin['id'], 'action' => $action, 'type' => $type, 'entity_id' => $id, 'details' => json_encode($details, JSON_INVALID_UTF8_SUBSTITUTE)]);
}

if ($method === 'GET') {
    $staff = require_staff();
    $resource = (string) ($_GET['resource'] ?? '');
    if ($staff['role'] === 'manager' && $resource !== 'gallery') fail_request(403, 'Managers can access bookings and gallery only.');
    $sql = resource_query($resource);
    if ($sql === '') fail_request(404, 'This management section does not exist.');
    try { success(database()->query($sql)->fetchAll()); }
    catch (Throwable $error) { error_log('Admin resource query failed: ' . $error->getMessage()); fail_request(503, 'This management section is temporarily unavailable.'); }
}
if ($method !== 'POST') {
    header('Allow: GET, POST, OPTIONS');
    fail_request(405, 'Method not allowed.');
}
$admin = require_admin_role_csrf('manager');
$data = request_data();
$resource = (string) ($data['resource'] ?? '');
if ($admin['role'] === 'manager' && $resource !== 'gallery') fail_request(403, 'Managers can access bookings and gallery only.');
$action = (string) ($data['action'] ?? '');
$allowedResources = ['services', 'faqs', 'gallery', 'testimonials', 'messages', 'customers'];
if (!in_array($resource, $allowedResources, true)) fail_request(404, 'This management section does not exist.');
$id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
$pdo = database();

try {
    if ($resource === 'messages' || $resource === 'customers') {
        if (!$id || $action !== 'update') fail_request(422, 'A valid record and update action are required.');
        if ($resource === 'messages') {
            $status = (string) ($data['status'] ?? '');
            if (!in_array($status, ['new', 'read', 'archived'], true)) fail_request(422, 'Choose a valid message status.');
            $statement = $pdo->prepare('UPDATE contact_messages SET status = :status WHERE id = :id');
            $statement->execute(['status' => $status, 'id' => $id]);
            audit_change($pdo, $admin, 'message.status.updated', 'message', (int) $id, ['status' => $status]);
            success(['id' => (int) $id, 'status' => $status]);
        }
        $active = filter_var($data['is_active'] ?? null, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($active === null) fail_request(422, 'Choose whether the customer account is active.');
        $statement = $pdo->prepare('UPDATE customers SET is_active = :active WHERE id = :id');
        $statement->execute(['active' => (int) $active, 'id' => $id]);
        audit_change($pdo, $admin, 'customer.account.updated', 'customer', (int) $id, ['is_active' => $active]);
        success(['id' => (int) $id, 'is_active' => $active]);
    }

    if ($action === 'delete') {
        if (!$id) fail_request(422, 'A valid record is required.');
        $table = ['services' => 'services', 'faqs' => 'faqs', 'gallery' => 'gallery_items', 'testimonials' => 'testimonials'][$resource] ?? '';
        if ($table === '') fail_request(422, 'This record cannot be removed.');
        $statement = $pdo->prepare("DELETE FROM {$table} WHERE id = :id");
        $statement->execute(['id' => $id]);
        audit_change($pdo, $admin, $resource . '.deleted', $resource, (int) $id);
        success(['id' => (int) $id]);
    }
    if (!in_array($action, ['create', 'update'], true) || ($action === 'update' && !$id)) fail_request(422, 'Choose a valid create or update action.');

    $pdo->beginTransaction();
    if ($resource === 'services') {
        $name = trim((string) ($data['name'] ?? ''));
        $slug = strtolower(trim((string) ($data['slug'] ?? '')));
        $category = trim((string) ($data['category'] ?? ''));
        $summary = trim((string) ($data['summary'] ?? ''));
        $description = trim((string) ($data['description'] ?? ''));
        $featuresRaw = trim((string) ($data['features_json'] ?? '[]'));
        $features = $featuresRaw === '' ? [] : json_decode($featuresRaw, true);
        if (!is_array($features) || count($features) > 20) fail_request(422, 'Service features must be a JSON array with no more than 20 items.');
        foreach ($features as &$feature) {
            if (!is_string($feature) || trim($feature) === '' || strlen(trim($feature)) > 120) fail_request(422, 'Each service feature must be a short text label.');
            $feature = trim($feature);
        }
        unset($feature);
        $featuresJson = json_encode(array_values($features), JSON_THROW_ON_ERROR);
        $price = $data['price_from'] ?? null;
        $image = trim((string) ($data['image_url'] ?? ''));
        if ($name === '' || strlen($name) > 140 || !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) || strlen($slug) > 160 || $category === '' || strlen($category) > 100 || $summary === '' || strlen($summary) > 320 || $description === '' || strlen($description) > 12000 || strlen($image) > 1000) fail_request(422, 'Check the service name, slug, category, summary and description.');
        if ($price !== null && $price !== '' && (!is_numeric($price) || (float) $price < 0 || (float) $price > 99999999)) fail_request(422, 'Enter a valid non-negative starting price.');
        if ($image !== '' && !(str_starts_with($image, 'https://') || preg_match('~^/[^\s]*$~', $image))) fail_request(422, 'Use a secure image URL or an uploaded image path.');
        $fields = ['name' => $name, 'slug' => $slug, 'category' => $category, 'summary' => $summary, 'description' => $description, 'features_json' => $featuresJson, 'price_from' => $price === '' ? null : $price, 'image_url' => $image ?: null, 'is_published' => !empty($data['is_published']) ? 1 : 0, 'is_featured' => !empty($data['is_featured']) ? 1 : 0, 'display_order' => max(0, (int) ($data['display_order'] ?? 0))];
        if ($action === 'create') {
            $statement = $pdo->prepare('INSERT INTO services (name, slug, category, summary, description, features_json, price_from, image_url, is_published, is_featured, display_order) VALUES (:name, :slug, :category, :summary, :description, :features_json, :price_from, :image_url, :is_published, :is_featured, :display_order)');
            $statement->execute($fields); $id = (int) $pdo->lastInsertId();
        } else {
            $statement = $pdo->prepare('UPDATE services SET name=:name, slug=:slug, category=:category, summary=:summary, description=:description, features_json=:features_json, price_from=:price_from, image_url=:image_url, is_published=:is_published, is_featured=:is_featured, display_order=:display_order WHERE id=:id');
            $statement->execute([...$fields, 'id' => $id]);
        }
    } elseif ($resource === 'faqs') {
        $category = trim((string) ($data['category'] ?? 'general')); $question = trim((string) ($data['question'] ?? '')); $answer = trim((string) ($data['answer'] ?? ''));
        if ($category === '' || strlen($category) > 100 || $question === '' || strlen($question) > 320 || $answer === '' || strlen($answer) > 12000) fail_request(422, 'Check the FAQ category, question and answer.');
        $fields = ['category' => $category, 'question' => $question, 'answer' => $answer, 'is_published' => !empty($data['is_published']) ? 1 : 0, 'display_order' => max(0, (int) ($data['display_order'] ?? 0))];
        if ($action === 'create') { $statement = $pdo->prepare('INSERT INTO faqs (category, question, answer, is_published, display_order) VALUES (:category,:question,:answer,:is_published,:display_order)'); $statement->execute($fields); $id = (int) $pdo->lastInsertId(); }
        else { $statement = $pdo->prepare('UPDATE faqs SET category=:category, question=:question, answer=:answer, is_published=:is_published, display_order=:display_order WHERE id=:id'); $statement->execute([...$fields, 'id' => $id]); }
    } elseif ($resource === 'gallery') {
        $title = trim((string) ($data['title'] ?? '')); $description = trim((string) ($data['description'] ?? '')); $category = trim((string) ($data['category'] ?? 'general'));
        $before = trim((string) ($data['before_image_path'] ?? '')); $after = trim((string) ($data['after_image_path'] ?? ''));
        if ($title === '' || strlen($title) > 160 || strlen($description) > 600 || $category === '' || strlen($category) > 100 || $before === '' || $after === '' || strlen($before) > 1000 || strlen($after) > 1000) fail_request(422, 'Add a title and both image paths for this gallery pair.');
        $fields = ['title' => $title, 'description' => $description, 'before_image_path' => $before, 'after_image_path' => $after, 'category' => $category, 'is_published' => !empty($data['is_published']) ? 1 : 0, 'display_order' => max(0, (int) ($data['display_order'] ?? 0))];
        if ($action === 'create') { $statement = $pdo->prepare('INSERT INTO gallery_items (title, description, image_path, before_image_path, after_image_path, category, is_before_after, is_published, display_order) VALUES (:title,:description,:after,:before_image_path,:after_image_path,:category,1,:is_published,:display_order)'); $statement->execute([...$fields, 'after' => $after]); $id = (int) $pdo->lastInsertId(); }
        else { $statement = $pdo->prepare('UPDATE gallery_items SET title=:title, description=:description, image_path=:after_image_path, before_image_path=:before_image_path, after_image_path=:after_image_path, category=:category, is_before_after=1, is_published=:is_published, display_order=:display_order WHERE id=:id'); $statement->execute([...$fields, 'id' => $id]); }
    } else {
        $name = trim((string) ($data['customer_name'] ?? '')); $quote = trim((string) ($data['quote'] ?? '')); $rating = filter_var($data['rating'] ?? 5, FILTER_VALIDATE_INT);
        $image = trim((string) ($data['profile_image'] ?? ''));
        if ($name === '' || strlen($name) > 120 || $quote === '' || strlen($quote) > 3000 || $rating === false || $rating < 1 || $rating > 5 || strlen($image) > 1000) fail_request(422, 'Check the testimonial name, quote and rating.');
        $fields = ['customer_name' => $name, 'quote' => $quote, 'rating' => $rating, 'profile_image' => $image ?: null, 'is_approved' => !empty($data['is_approved']) ? 1 : 0, 'is_featured' => !empty($data['is_featured']) ? 1 : 0];
        if ($action === 'create') { $statement = $pdo->prepare('INSERT INTO testimonials (customer_name, quote, rating, profile_image, is_approved, is_featured) VALUES (:customer_name,:quote,:rating,:profile_image,:is_approved,:is_featured)'); $statement->execute($fields); $id = (int) $pdo->lastInsertId(); }
        else { $statement = $pdo->prepare('UPDATE testimonials SET customer_name=:customer_name, quote=:quote, rating=:rating, profile_image=:profile_image, is_approved=:is_approved, is_featured=:is_featured WHERE id=:id'); $statement->execute([...$fields, 'id' => $id]); }
    }
    audit_change($pdo, $admin, $resource . '.' . $action, $resource, (int) $id);
    $pdo->commit();
    success(['id' => (int) $id], $action === 'create' ? 201 : 200);
} catch (Throwable $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('Admin resource write failed: ' . $error->getMessage());
    fail_request(422, 'This change could not be saved. Check for missing fields or duplicate values.');
}
