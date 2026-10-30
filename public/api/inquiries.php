<?php
/**
 * Inquiries API Endpoint
 * Handles GET, POST, PATCH, DELETE for inquiries
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mailer.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to normalize an inquiry row for frontend consumption
function normalizeInquiry($row) {
    if (!$row) return null;
    return [
        'id'        => (string)$row['id'],
        'name'      => $row['name'],
        'email'     => $row['email'],
        'phone'     => $row['phone'],
        'subject'   => $row['subject'],
        'message'   => $row['message'],
        'status'    => $row['status'],
        'createdAt' => toIsoDate($row['createdAt']),
    ];
}

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM inquiries ORDER BY createdAt DESC");
            $rows = $stmt->fetchAll();
            $data = array_map('normalizeInquiry', $rows);
            sendJson($data);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to fetch inquiries: ' . $e->getMessage()], 500);
        }
        break;

    case 'POST':
        $body = getRequestBody();
        $name = trim($body['name'] ?? '');
        $email = trim($body['email'] ?? '');
        $phone = trim($body['phone'] ?? '') ?: null;
        $subject = trim($body['subject'] ?? '') ?: null;
        $message = trim($body['message'] ?? '');

        if (empty($name) || empty($email) || empty($message)) {
            sendJson(['error' => 'Missing required fields: name, email, message'], 400);
        }

        try {
            $id = generateId('inq');
            $createdAt = date('Y-m-d H:i:s');
            $status = 'unread';

            $stmt = $pdo->prepare("
                INSERT INTO inquiries (id, name, email, phone, subject, message, status, createdAt)
                VALUES (:id, :name, :email, :phone, :subject, :message, :status, :createdAt)
            ");
            $stmt->execute([
                ':id'        => $id,
                ':name'      => $name,
                ':email'     => $email,
                ':phone'     => $phone,
                ':subject'   => $subject,
                ':message'   => $message,
                ':status'    => $status,
                ':createdAt' => $createdAt,
            ]);

            $inquiry = [
                'id'        => $id,
                'name'      => $name,
                'email'     => $email,
                'phone'     => $phone,
                'subject'   => $subject,
                'message'   => $message,
                'status'    => $status,
                'createdAt' => toIsoDate($createdAt),
            ];

            // Send notification email to admin
            @sendInquiryEmail($inquiry);

            sendJson($inquiry, 201);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to create inquiry: ' . $e->getMessage()], 500);
        }
        break;

    case 'PATCH':
        $id = $_GET['id'] ?? null;
        $body = getRequestBody();
        $status = $body['status'] ?? null;

        if (!$id || !$status) {
            sendJson(['error' => 'Missing id or status'], 400);
        }

        try {
            $stmt = $pdo->prepare("UPDATE inquiries SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);

            $stmt = $pdo->prepare("SELECT * FROM inquiries WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $updated = normalizeInquiry($stmt->fetch());

            sendJson($updated ?: ['success' => true]);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to update inquiry: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            sendJson(['error' => 'Missing id'], 400);
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM inquiries WHERE id = :id");
            $stmt->execute([':id' => $id]);
            sendJson(['success' => true]);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to delete inquiry: ' . $e->getMessage()], 500);
        }
        break;

    default:
        sendJson(['error' => 'Method not allowed'], 405);
}
