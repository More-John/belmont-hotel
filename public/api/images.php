<?php
/**
 * Images API Endpoint
 * Handles GET, POST, DELETE for hotel gallery and section images.
 * Supports local /uploads/ folder and Cloudinary fallback.
 */
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

function normalizeImage($row) {
    if (!$row) return null;
    return [
        'id'        => (string)$row['id'],
        'url'       => $row['url'],
        'publicId'  => $row['publicId'] ?? null,
        'alt'       => $row['alt'] ?? '',
        'section'   => $row['section'] ?? 'General',
        'order'     => (int)($row['order'] ?? 0),
        'createdAt' => toIsoDate($row['createdAt'] ?? null),
    ];
}

function uploadToCloudinary($filePath, $mimeType, $filename) {
    if (!defined('CLOUDINARY_CLOUD_NAME') || empty(CLOUDINARY_CLOUD_NAME) ||
        !defined('CLOUDINARY_API_KEY') || empty(CLOUDINARY_API_KEY) ||
        !defined('CLOUDINARY_API_SECRET') || empty(CLOUDINARY_API_SECRET) ||
        !function_exists('curl_init')) {
        return null;
    }

    $cloudName = trim(CLOUDINARY_CLOUD_NAME);
    $apiKey = trim(CLOUDINARY_API_KEY);
    $apiSecret = trim(CLOUDINARY_API_SECRET);
    $timestamp = time();
    $folder = 'belmont-hotel';

    $signatureStr = "folder={$folder}&timestamp={$timestamp}" . $apiSecret;
    $signature = sha1($signatureStr);

    $url = "https://api.cloudinary.com/v1_1/{$cloudName}/image/upload";

    $postData = [
        'file'      => new CURLFile($filePath, $mimeType, $filename),
        'folder'    => $folder,
        'timestamp' => $timestamp,
        'api_key'   => $apiKey,
        'signature' => $signature,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        $json = json_decode($response, true);
        if (!empty($json['secure_url'])) {
            return [
                'url'      => $json['secure_url'],
                'publicId' => $json['public_id'] ?? null,
            ];
        }
    }
    return null;
}

function deleteFromCloudinary($publicId) {
    if (!defined('CLOUDINARY_CLOUD_NAME') || empty($publicId) || !function_exists('curl_init')) return;

    $cloudName = trim(CLOUDINARY_CLOUD_NAME);
    $apiKey = trim(CLOUDINARY_API_KEY);
    $apiSecret = trim(CLOUDINARY_API_SECRET);
    $timestamp = time();

    $signatureStr = "public_id={$publicId}&timestamp={$timestamp}" . $apiSecret;
    $signature = sha1($signatureStr);

    $url = "https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy";

    $postData = [
        'public_id' => $publicId,
        'timestamp' => $timestamp,
        'api_key'   => $apiKey,
        'signature' => $signature,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_exec($ch);
    curl_close($ch);
}

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM images ORDER BY `order` ASC, createdAt DESC");
            $rows = $stmt->fetchAll();
            $data = array_map('normalizeImage', $rows);
            sendJson($data);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to fetch images: ' . $e->getMessage()], 500);
        }
        break;

    case 'POST':
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            $errCode = $_FILES['file']['error'] ?? -1;
            sendJson(['error' => 'No valid image file uploaded (Error code: ' . $errCode . ')'], 400);
        }

        $alt = trim($_POST['alt'] ?? '') ?: 'Hotel Image';
        $section = trim($_POST['section'] ?? '') ?: 'General';
        $file = $_FILES['file'];

        $tmpPath = $file['tmp_name'];
        $origName = $file['name'];
        $mimeType = !empty($file['type'])
            ? $file['type']
            : (function_exists('mime_content_type') ? @mime_content_type($tmpPath) : 'image/jpeg');

        $uploadResult = null;

        // 1. If explicitly configured for Cloudinary, try Cloudinary first
        if (defined('UPLOAD_STORAGE') && UPLOAD_STORAGE === 'cloudinary') {
            $uploadResult = uploadToCloudinary($tmpPath, $mimeType, $origName);
        }

        // 2. Save directly to cPanel local uploads/ directory
        if (!$uploadResult) {
            $uploadDir = defined('LOCAL_UPLOAD_DIR') ? LOCAL_UPLOAD_DIR : (__DIR__ . '/../uploads/');
            if (!is_dir($uploadDir)) {
                @mkdir($uploadDir, 0755, true);
            }
            $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION)) ?: 'jpg';
            $uniqueFilename = bin2hex(random_bytes(10)) . '.' . $ext;
            $destPath = rtrim($uploadDir, '/\\') . DIRECTORY_SEPARATOR . $uniqueFilename;

            if (@move_uploaded_file($tmpPath, $destPath) || @copy($tmpPath, $destPath)) {
                @chmod($destPath, 0644);
                $baseUrl = defined('LOCAL_UPLOAD_URL') ? LOCAL_UPLOAD_URL : '/uploads/';
                $uploadResult = [
                    'url'      => rtrim($baseUrl, '/') . '/' . $uniqueFilename,
                    'publicId' => null,
                ];
            } else {
                // Fallback to Cloudinary if local folder is not writable
                $uploadResult = uploadToCloudinary($tmpPath, $mimeType, $origName);
            }
        }

        if (!$uploadResult) {
            sendJson(['error' => 'Failed to save uploaded file. Ensure public_html/uploads/ has 755 permissions.'], 500);
        }

        try {
            $id = generateId('img');
            $createdAt = date('Y-m-d H:i:s');
            $order = 0;

            $stmt = $pdo->prepare("
                INSERT INTO images (id, url, publicId, alt, section, `order`, createdAt)
                VALUES (:id, :url, :publicId, :alt, :section, :order, :createdAt)
            ");
            $stmt->execute([
                ':id'        => $id,
                ':url'       => $uploadResult['url'],
                ':publicId'  => $uploadResult['publicId'],
                ':alt'       => $alt,
                ':section'   => $section,
                ':order'     => $order,
                ':createdAt' => $createdAt,
            ]);

            $image = [
                'id'        => $id,
                'url'       => $uploadResult['url'],
                'publicId'  => $uploadResult['publicId'],
                'alt'       => $alt,
                'section'   => $section,
                'order'     => $order,
                'createdAt' => toIsoDate($createdAt),
            ];

            sendJson($image, 201);
        } catch (Exception $e) {
            sendJson(['error' => 'Database error: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            sendJson(['error' => 'Missing id parameter'], 400);
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM images WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $image = $stmt->fetch();

            if (!$image) {
                sendJson(['error' => 'Image not found'], 404);
            }

            // Destroy from Cloudinary if publicId exists
            if (!empty($image['publicId'])) {
                deleteFromCloudinary($image['publicId']);
            }

            // Remove local file if stored in /uploads/
            if (!empty($image['url']) && strpos($image['url'], '/uploads/') !== false) {
                $filename = basename($image['url']);
                $uploadDir = defined('LOCAL_UPLOAD_DIR') ? LOCAL_UPLOAD_DIR : (__DIR__ . '/../uploads/');
                $localFile = rtrim($uploadDir, '/\\') . DIRECTORY_SEPARATOR . $filename;
                if (file_exists($localFile)) {
                    @unlink($localFile);
                }
            }

            // Delete from DB
            $stmt = $pdo->prepare("DELETE FROM inquiries WHERE 1=0"); // no-op safety
            $stmt = $pdo->prepare("DELETE FROM images WHERE id = :id");
            $stmt->execute([':id' => $id]);

            sendJson(['success' => true]);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to delete image: ' . $e->getMessage()], 500);
        }
        break;

    default:
        sendJson(['error' => 'Method not allowed'], 405);
}
