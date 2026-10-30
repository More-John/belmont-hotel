<?php
/**
 * Admin Authentication Endpoint for cPanel
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $body = getRequestBody();
    $email = trim($body['email'] ?? '');
    $password = trim($body['password'] ?? '');

    $adminEmail = defined('ADMIN_EMAIL') ? trim(ADMIN_EMAIL) : '';
    $adminPassword = defined('ADMIN_PASSWORD') ? trim(ADMIN_PASSWORD) : '';

    if (strcasecmp($email, $adminEmail) === 0 && $password === $adminPassword) {
        sendJson([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'email' => $adminEmail,
                'role' => 'admin'
            ]
        ]);
    } else {
        sendJson(['error' => 'Invalid email or password'], 401);
    }
} else {
    sendJson(['error' => 'Method not allowed'], 405);
}
