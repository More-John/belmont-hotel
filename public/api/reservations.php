<?php
/**
 * Reservations API Endpoint
 * Handles GET, POST, PATCH, DELETE for reservations
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mailer.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to normalize a reservation row for frontend consumption
function normalizeReservation($row) {
    if (!$row) return null;
    return [
        'id'              => (string)$row['id'],
        'guestName'       => $row['guestName'],
        'guestEmail'      => $row['guestEmail'],
        'guestPhone'      => $row['guestPhone'],
        'roomType'        => $row['roomType'],
        'checkIn'         => toIsoDate($row['checkIn']),
        'checkOut'        => toIsoDate($row['checkOut']),
        'persons'         => (int)$row['persons'],
        'specialRequests' => $row['specialRequests'] ?? null,
        'status'          => $row['status'],
        'createdAt'       => toIsoDate($row['createdAt']),
    ];
}

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM reservations ORDER BY createdAt DESC");
            $rows = $stmt->fetchAll();
            $data = array_map('normalizeReservation', $rows);
            sendJson($data);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to fetch reservations: ' . $e->getMessage()], 500);
        }
        break;

    case 'POST':
        $body = getRequestBody();
        $guestName = trim($body['guestName'] ?? '');
        $guestEmail = trim($body['guestEmail'] ?? '');
        $guestPhone = trim($body['guestPhone'] ?? '');
        $roomType = trim($body['roomType'] ?? '');
        $checkInRaw = trim($body['checkIn'] ?? '');
        $checkOutRaw = trim($body['checkOut'] ?? '');
        $persons = isset($body['persons']) ? intval($body['persons']) : 1;
        $specialRequests = trim($body['specialRequests'] ?? '') ?: null;

        if (empty($guestName) || empty($guestEmail) || empty($guestPhone) || empty($roomType) || empty($checkInRaw) || empty($checkOutRaw)) {
            sendJson(['error' => 'Missing required reservation fields'], 400);
        }

        try {
            $id = generateId('resv');
            $createdAt = date('Y-m-d H:i:s');
            $status = 'pending';
            $checkIn = date('Y-m-d', strtotime($checkInRaw));
            $checkOut = date('Y-m-d', strtotime($checkOutRaw));

            $stmt = $pdo->prepare("
                INSERT INTO reservations (id, guestName, guestEmail, guestPhone, roomType, checkIn, checkOut, persons, specialRequests, status, createdAt)
                VALUES (:id, :guestName, :guestEmail, :guestPhone, :roomType, :checkIn, :checkOut, :persons, :specialRequests, :status, :createdAt)
            ");
            $stmt->execute([
                ':id'              => $id,
                ':guestName'       => $guestName,
                ':guestEmail'      => $guestEmail,
                ':guestPhone'      => $guestPhone,
                ':roomType'        => $roomType,
                ':checkIn'         => $checkIn,
                ':checkOut'        => $checkOut,
                ':persons'         => $persons,
                ':specialRequests' => $specialRequests,
                ':status'          => $status,
                ':createdAt'       => $createdAt,
            ]);

            $reservation = [
                'id'              => $id,
                'guestName'       => $guestName,
                'guestEmail'      => $guestEmail,
                'guestPhone'      => $guestPhone,
                'roomType'        => $roomType,
                'checkIn'         => toIsoDate($checkIn),
                'checkOut'        => toIsoDate($checkOut),
                'persons'         => $persons,
                'specialRequests' => $specialRequests,
                'status'          => $status,
                'createdAt'       => toIsoDate($createdAt),
            ];

            // Send notification email to admin
            @sendReservationEmail($reservation);

            // Send confirmation email to guest
            @sendGuestConfirmationEmail($reservation);

            sendJson($reservation, 201);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to create reservation: ' . $e->getMessage()], 500);
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
            $stmt = $pdo->prepare("UPDATE reservations SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $status, ':id' => $id]);

            $stmt = $pdo->prepare("SELECT * FROM reservations WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $updated = normalizeReservation($stmt->fetch());

            sendJson($updated ?: ['success' => true]);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to update reservation: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            sendJson(['error' => 'Missing id'], 400);
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM reservations WHERE id = :id");
            $stmt->execute([':id' => $id]);
            sendJson(['success' => true]);
        } catch (Exception $e) {
            sendJson(['error' => 'Failed to delete reservation: ' . $e->getMessage()], 500);
        }
        break;

    default:
        sendJson(['error' => 'Method not allowed'], 405);
}
