<?php
/**
 * Rooms API Endpoint for cPanel
 * Handles GET, PATCH, and POST for hotel room details (pricing, description, bedType, size, amenities).
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$dataDir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
$roomsFile = $dataDir . DIRECTORY_SEPARATOR . 'rooms.json';

function getDefaultRoomsData() {
    return [
        [
            'id'        => 'business-suite',
            'label'     => 'BUSINESS SUITE',
            'desc'      => "1 extra-large double bed.\nThe suite features 1 bedroom and 1 bathroom with a bath and free toiletries. The air-conditioned suite provides a flat-screen TV with cable channels, a wardrobe, an electric kettle and a sofa.",
            'images'    => [
                '/uploads/et5cxwtpgsoaqdztptme.jpg',
                '/uploads/pff6xmd2hd2tqzglcrik.jpg',
                '/uploads/qrzqio8csilffapjji0c.jpg',
            ],
            'price'     => 107500,
            'bedType'   => 'Extra-large double bed',
            'size'      => '49m²',
            'amenities' => [
                'Free Wi-Fi',
                'Flat-screen TV',
                'Air conditioning',
                'Bath with bathtub',
                'Electric kettle',
                'Work desk',
                'Refrigerator',
                'Wake-up service',
            ],
        ],
        [
            'id'        => 'executive-suite',
            'label'     => 'EXECUTIVE SUITE',
            'desc'      => "1 Large Double Bed. Relax in this spacious, air-conditioned double room complete with a large double bed, wardrobe, and a private bathroom with a bathtub. Additional amenities include an electric kettle and a flat-screen TV offering a variety of cable channels.",
            'images'    => [
                '/uploads/sncwlrtxyuycylaqc6du.jpg',
                '/uploads/qhvjhunjna6dix7nweat.jpg',
            ],
            'price'     => 96750,
            'bedType'   => 'Large double bed',
            'size'      => '38m²',
            'amenities' => [
                'Free Wi-Fi',
                'Flat-screen TV',
                'Air conditioning',
                'Private bathroom',
                'Electric kettle',
                'Work desk',
                'Wake-up service',
            ],
        ],
        [
            'id'        => 'executive-deluxe',
            'label'     => 'EXECUTIVE DELUXE',
            'desc'      => "1 large double bed. The spacious double room features air conditioning, a wardrobe, as well as a private bathroom boasting a bath. This double room offers a flat-screen TV with cable channels.",
            'images'    => [
                '/uploads/enzwah6rllk0gxgnm5up.jpg',
                '/uploads/huav4erxn1vktr596y3v.jpg',
                '/uploads/zclp21mzxq8bsfcze8lv.jpg',
            ],
            'price'     => 80625,
            'bedType'   => 'Large double bed',
            'size'      => '34m²',
            'amenities' => [
                'Free Wi-Fi',
                'Flat-screen TV',
                'Air conditioning',
                'Private bathroom',
                'Electric kettle',
                'Work desk',
                'Wake-up service',
            ],
        ],
        [
            'id'        => 'deluxe',
            'label'     => 'DELUXE ROOM',
            'desc'      => "Simpler than the standard room but with all the necessary amenities. Every room is simply furnished and decorated and equipped with Air Conditioning, a TV and a private bathroom.",
            'images'    => [
                '/uploads/z8ldhldxmvdbm89hwpi0.jpg',
                '/uploads/viudrckt6he4ky49nufz.jpg',
            ],
            'price'     => 69875,
            'bedType'   => 'Double bed',
            'size'      => '24m²',
            'amenities' => [
                'Free Wi-Fi',
                'TV',
                'Air conditioning',
                'Private bathroom',
                'Wake-up service',
            ],
        ],
    ];
}

function readRoomsData($file) {
    if (!file_exists($file)) {
        $defaults = getDefaultRoomsData();
        @file_put_contents($file, json_encode($defaults, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        return $defaults;
    }
    $raw = @file_get_contents($file);
    if (!$raw) return getDefaultRoomsData();
    $data = json_decode($raw, true);
    return (is_array($data) && count($data) > 0) ? $data : getDefaultRoomsData();
}

function writeRoomsData($file, $rooms) {
    @file_put_contents($file, json_encode(array_values($rooms), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

switch ($method) {
    case 'GET':
        $rooms = readRoomsData($roomsFile);
        sendJson($rooms);
        break;

    case 'PATCH':
    case 'POST':
        $body = getRequestBody();
        $id = $_GET['id'] ?? ($body['id'] ?? null);

        if (!$id) {
            sendJson(['error' => 'Missing room id'], 400);
        }

        $rooms = readRoomsData($roomsFile);
        $foundIndex = -1;

        foreach ($rooms as $idx => $r) {
            if (($r['id'] ?? '') === $id) {
                $foundIndex = $idx;
                break;
            }
        }

        if ($foundIndex === -1) {
            sendJson(['error' => 'Room not found'], 404);
        }

        $existing = $rooms[$foundIndex];

        if (isset($body['price'])) {
            $cleanPrice = preg_replace('/[^0-9.]/', '', (string)$body['price']);
            $numPrice = floatval($cleanPrice);
            if ($numPrice <= 0) {
                sendJson(['error' => 'Price must be a valid positive number'], 400);
            }
            $existing['price'] = $numPrice;
        }

        if (isset($body['label']) && trim($body['label']) !== '') {
            $existing['label'] = trim($body['label']);
        }

        if (isset($body['desc'])) {
            $existing['desc'] = trim($body['desc']);
        }

        if (isset($body['bedType'])) {
            $existing['bedType'] = trim($body['bedType']);
        }

        if (isset($body['size'])) {
            $existing['size'] = trim($body['size']);
        }

        if (isset($body['amenities']) && is_array($body['amenities'])) {
            $cleanAmenities = array_values(array_filter(array_map('trim', $body['amenities'])));
            $existing['amenities'] = $cleanAmenities;
        }

        $rooms[$foundIndex] = $existing;
        writeRoomsData($roomsFile, $rooms);

        sendJson($existing);
        break;

    default:
        sendJson(['error' => 'Method not allowed'], 405);
}
