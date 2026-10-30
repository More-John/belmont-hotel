<?php
/**
 * Posts / Updates & Blog API Endpoint
 * Handles GET, POST, PATCH, DELETE for hotel updates, service announcements, events, and blogs.
 */
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

function slugify($text) {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9-]+/', '-', $text);
    $text = preg_replace('/-+/', '-', $text);
    $text = trim($text, '-');
    return empty($text) ? 'post-' . bin2hex(random_bytes(4)) : $text;
}

function normalizePost($row) {
    if (!$row) return null;
    return [
        'id'          => (string)$row['id'],
        'title'       => $row['title'] ?? '',
        'slug'        => $row['slug'] ?? '',
        'category'    => $row['category'] ?? 'Update',
        'excerpt'     => $row['excerpt'] ?? '',
        'content'     => $row['content'] ?? '',
        'imageUrl'    => $row['imageUrl'] ?? null,
        'author'      => $row['author'] ?? 'Belmont Hotel',
        'status'      => $row['status'] ?? 'published',
        'eventDate'   => toIsoDate($row['eventDate'] ?? null),
        'createdAt'   => toIsoDate($row['createdAt'] ?? null),
        'updatedAt'   => toIsoDate($row['updatedAt'] ?? ($row['createdAt'] ?? null)),
    ];
}

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $slug = $_GET['slug'] ?? null;
        $category = $_GET['category'] ?? null;
        $status = $_GET['status'] ?? null;

        try {
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = :id LIMIT 1");
                $stmt->execute([':id' => $id]);
                $post = normalizePost($stmt->fetch());
                if (!$post) sendJson(['error' => 'Post not found'], 404);
                sendJson($post);
            }

            if ($slug) {
                $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = :slug LIMIT 1");
                $stmt->execute([':slug' => $slug]);
                $post = normalizePost($stmt->fetch());
                if (!$post) sendJson(['error' => 'Post not found'], 404);
                sendJson($post);
            }

            $sql = "SELECT * FROM posts WHERE 1=1";
            $params = [];

            if ($category && strtolower($category) !== 'all') {
                $sql .= " AND category = :category";
                $params[':category'] = $category;
            }

            if ($status && strtolower($status) !== 'all') {
                $sql .= " AND status = :status";
                $params[':status'] = $status;
            }

            $sql .= " ORDER BY createdAt DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            // Exclude internal __room_config__ entries unless explicitly queried
            if (!$category || strtolower($category) !== '__room_config__') {
                $rows = array_values(array_filter($rows, function ($r) {
                    return ($r['category'] ?? '') !== '__room_config__';
                }));
            }

            $data = array_map('normalizePost', $rows);
            sendJson($data);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to fetch posts: ' . $e->getMessage()], 500);
        }
        break;

    case 'POST':
        $body = getRequestBody();
        $title = trim($body['title'] ?? '');
        $content = trim($body['content'] ?? '');
        $category = trim($body['category'] ?? '') ?: 'Update';
        $excerpt = trim($body['excerpt'] ?? '') ?: (substr(strip_tags($content), 0, 160) . '...');
        $imageUrl = trim($body['imageUrl'] ?? '') ?: null;
        $author = trim($body['author'] ?? '') ?: 'Belmont Hotel';
        $status = in_array($body['status'] ?? '', ['published', 'draft']) ? $body['status'] : 'published';
        $eventDate = !empty($body['eventDate']) ? date('Y-m-d H:i:s', strtotime($body['eventDate'])) : null;

        if (empty($title) || empty($content)) {
            sendJson(['error' => 'Title and content are required'], 400);
        }

        $slug = trim($body['slug'] ?? '') ?: slugify($title);

        // Check slug uniqueness, if duplicate append random suffix
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE slug = :slug");
        $checkStmt->execute([':slug' => $slug]);
        if ($checkStmt->fetchColumn() > 0) {
            $slug .= '-' . bin2hex(random_bytes(3));
        }

        try {
            $id = generateId('post');
            $createdAt = date('Y-m-d H:i:s');

            $stmt = $pdo->prepare("
                INSERT INTO posts (id, title, slug, category, excerpt, content, imageUrl, author, status, eventDate, createdAt, updatedAt)
                VALUES (:id, :title, :slug, :category, :excerpt, :content, :imageUrl, :author, :status, :eventDate, :createdAt, :updatedAt)
            ");
            $stmt->execute([
                ':id'        => $id,
                ':title'     => $title,
                ':slug'      => $slug,
                ':category'  => $category,
                ':excerpt'   => $excerpt,
                ':content'   => $content,
                ':imageUrl'  => $imageUrl,
                ':author'    => $author,
                ':status'    => $status,
                ':eventDate' => $eventDate,
                ':createdAt' => $createdAt,
                ':updatedAt' => $createdAt,
            ]);

            $post = [
                'id'        => $id,
                'title'     => $title,
                'slug'      => $slug,
                'category'  => $category,
                'excerpt'   => $excerpt,
                'content'   => $content,
                'imageUrl'  => $imageUrl,
                'author'    => $author,
                'status'    => $status,
                'eventDate' => toIsoDate($eventDate),
                'createdAt' => toIsoDate($createdAt),
                'updatedAt' => toIsoDate($createdAt),
            ];

            sendJson($post, 201);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to create post: ' . $e->getMessage()], 500);
        }
        break;

    case 'PATCH':
        $id = $_GET['id'] ?? null;
        if (!$id) sendJson(['error' => 'Missing post id'], 400);

        $body = getRequestBody();

        try {
            $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $existing = $stmt->fetch();
            if (!$existing) sendJson(['error' => 'Post not found'], 404);

            $title = isset($body['title']) ? trim($body['title']) : $existing['title'];
            $slug = isset($body['slug']) ? trim($body['slug']) : $existing['slug'];
            $category = isset($body['category']) ? trim($body['category']) : $existing['category'];
            $excerpt = isset($body['excerpt']) ? trim($body['excerpt']) : $existing['excerpt'];
            $content = isset($body['content']) ? trim($body['content']) : $existing['content'];
            $imageUrl = array_key_exists('imageUrl', $body) ? trim((string)$body['imageUrl']) : $existing['imageUrl'];
            $author = isset($body['author']) ? trim($body['author']) : $existing['author'];
            $status = isset($body['status']) ? trim($body['status']) : $existing['status'];
            $eventDate = array_key_exists('eventDate', $body)
                ? (!empty($body['eventDate']) ? date('Y-m-d H:i:s', strtotime($body['eventDate'])) : null)
                : $existing['eventDate'];
            $updatedAt = date('Y-m-d H:i:s');

            $stmt = $pdo->prepare("
                UPDATE posts 
                SET title = :title, slug = :slug, category = :category, excerpt = :excerpt, 
                    content = :content, imageUrl = :imageUrl, author = :author, status = :status, 
                    eventDate = :eventDate, updatedAt = :updatedAt
                WHERE id = :id
            ");
            $stmt->execute([
                ':title'     => $title,
                ':slug'      => $slug,
                ':category'  => $category,
                ':excerpt'   => $excerpt,
                ':content'   => $content,
                ':imageUrl'  => $imageUrl,
                ':author'    => $author,
                ':status'    => $status,
                ':eventDate' => $eventDate,
                ':updatedAt' => $updatedAt,
                ':id'        => $id,
            ]);

            $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            sendJson(normalizePost($stmt->fetch()));
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to update post: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) sendJson(['error' => 'Missing post id'], 400);

        try {
            $stmt = $pdo->prepare("DELETE FROM posts WHERE id = :id");
            $stmt->execute([':id' => $id]);
            sendJson(['success' => true]);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to delete post: ' . $e->getMessage()], 500);
        }
        break;

    default:
        sendJson(['error' => 'Method not allowed'], 405);
}
