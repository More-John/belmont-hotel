<?php
/**
 * Database Connection & Common Utilities
 * Supports MySQL/PostgreSQL, automatic SQLite fallback, and JSON file fallback on cPanel.
 */
require_once __DIR__ . '/config.php';

// Set common API headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS preflight
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Initial seed data for cPanel (Images & Posts)
 */
function getInitialSeedImages() {
    return [
        ['id' => 'cmr3v24mp000810j7ldkjra16', 'url' => '/uploads/drhq3lx2bkvmcg1dspc9.jpg', 'publicId' => null, 'alt' => 'service-event', 'section' => 'Services', 'order' => 0, 'createdAt' => '2026-07-02 18:51:39'],
        ['id' => 'cmrp2biuh0000ap23l7fwgpv5', 'url' => '/uploads/sncwlrtxyuycylaqc6du.jpg', 'publicId' => null, 'alt' => 'room-executive-suite-01', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-17 14:58:04'],
        ['id' => 'cmrp2gxhb0003ap235a6q7l1i', 'url' => '/uploads/qhvjhunjna6dix7nweat.jpg', 'publicId' => null, 'alt' => 'room-executive-suite-02', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-17 15:02:15'],
        ['id' => 'cmrp3i0b2000dap23q97uerwk', 'url' => '/uploads/z8ldhldxmvdbm89hwpi0.jpg', 'publicId' => null, 'alt' => 'room-deluxe-02', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-17 15:31:06'],
        ['id' => 'cmrp3imcu000eap23vqq8t3tb', 'url' => '/uploads/viudrckt6he4ky49nufz.jpg', 'publicId' => null, 'alt' => 'room-deluxe-03', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-17 15:31:35'],
        ['id' => 'cmrp3k3iy000gap23kgql5oi5', 'url' => '/uploads/enzwah6rllk0gxgnm5up.jpg', 'publicId' => null, 'alt' => 'room-executive-deluxe-02', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-17 15:32:43'],
        ['id' => 'cmrp3m3w2000hap23xi4bgnw4', 'url' => '/uploads/huav4erxn1vktr596y3v.jpg', 'publicId' => null, 'alt' => 'room-executive-deluxe-03', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-17 15:34:17'],
        ['id' => 'cmrp3mutn000iap23uqmz2y1v', 'url' => '/uploads/zclp21mzxq8bsfcze8lv.jpg', 'publicId' => null, 'alt' => 'room-executive-deluxe-04', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-17 15:34:52'],
        ['id' => 'cmrp3p78d000jap23kgohzh5l', 'url' => '/uploads/vwtwkunucjf4jllmormh.jpg', 'publicId' => null, 'alt' => 'service-minibar', 'section' => 'Services', 'order' => 0, 'createdAt' => '2026-07-17 15:36:42'],
        ['id' => 'cmrp3r052000kap23jma9uml4', 'url' => '/uploads/f5klmtyyw8xlaurxq1aw.jpg', 'publicId' => null, 'alt' => 'service-restaurant', 'section' => 'Services', 'order' => 0, 'createdAt' => '2026-07-17 15:38:06'],
        ['id' => 'cmrp4qbnu0000wpsrfu47xnsq', 'url' => '/uploads/kxtucqrtgjcczg16lprb.jpg', 'publicId' => null, 'alt' => 'hero-section-01', 'section' => 'Hero', 'order' => 0, 'createdAt' => '2026-07-17 16:05:34'],
        ['id' => 'cmrp54w9y000oap2306nn56t0', 'url' => '/uploads/cjlaz22ev7gmecrftsxe.jpg', 'publicId' => null, 'alt' => 'service-catering', 'section' => 'Services', 'order' => 0, 'createdAt' => '2026-07-17 16:16:53'],
        ['id' => 'cms7kp26z0000uov3icn3bp42', 'url' => '/uploads/et5cxwtpgsoaqdztptme.jpg', 'publicId' => null, 'alt' => 'room-business-suite-01', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-30 13:52:20'],
        ['id' => 'cms7kq4r40001uov3mryx5vbr', 'url' => '/uploads/pff6xmd2hd2tqzglcrik.jpg', 'publicId' => null, 'alt' => 'room-business-suite-02', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-30 13:53:10'],
        ['id' => 'cms7kqkdh0002uov3yg2snjky', 'url' => '/uploads/qrzqio8csilffapjji0c.jpg', 'publicId' => null, 'alt' => 'room-business-suite-03', 'section' => 'Rooms', 'order' => 0, 'createdAt' => '2026-07-30 13:53:30'],
        ['id' => 'cms7l8g5o0004uov3qjpglype', 'url' => '/uploads/wz9hvhgbpp21mhtmeluv.jpg', 'publicId' => null, 'alt' => 'service-conference', 'section' => 'Services', 'order' => 0, 'createdAt' => '2026-07-30 14:07:24'],
        ['id' => 'cms7lpu090005uov3ggqj86td', 'url' => '/uploads/tltfaq7ib9wblopbkfpj.jpg', 'publicId' => null, 'alt' => 'hero-section-05', 'section' => 'Hero', 'order' => 0, 'createdAt' => '2026-07-30 14:20:55'],
        ['id' => 'cms7m0oed0008uov39w1345vo', 'url' => '/uploads/pynp5hmdt0ymyx1rfmvq.jpg', 'publicId' => null, 'alt' => 'hero-section-08', 'section' => 'Hero', 'order' => 0, 'createdAt' => '2026-07-30 14:29:21'],
        ['id' => 'cmsi2kd7w0000o05fy9ejm2ne', 'url' => '/uploads/uwu6nzja7jcmnujnnphx.jpg', 'publicId' => null, 'alt' => 'hero-section-06', 'section' => 'Hero', 'order' => 0, 'createdAt' => '2026-08-06 22:10:16'],
    ];
}

function getInitialSeedPosts() {
    return [
        [
            'id'        => 'post_welcome_event',
            'title'     => 'Grand Weekend Live Acoustic & BBQ Night',
            'slug'      => 'weekend-live-acoustic-bbq-night',
            'category'  => 'Event',
            'excerpt'   => 'Join us every Saturday evening by the poolside for tender BBQ grills, handcrafted cocktails, and relaxing live acoustic music under the stars.',
            'content'   => "We are excited to invite all guests and visitors to our signature Weekend Live Acoustic & BBQ Night.\n\nEnjoy an unforgettable open-air dining experience featuring our chef's special prime cuts, fresh seafood skewers, and tropical cocktails prepared by our master mixologists.\n\nEvent Highlights:\n- Live acoustic performance starting from 7:00 PM\n- Unlimited buffet sides and artisan desserts\n- Special poolside seating with romantic ambient lighting\n- Complimentary welcome cocktail for all hotel guests\n\nReservations are highly recommended. Contact our front desk or use the reservation tab on our website.",
            'imageUrl'  => '/uploads/drhq3lx2bkvmcg1dspc9.jpg',
            'author'    => 'Belmont Events Team',
            'status'    => 'published',
            'eventDate' => '2026-11-15 19:00:00',
            'createdAt' => '2026-10-15 10:00:00',
            'updatedAt' => '2026-10-15 10:00:00',
        ],
        [
            'id'        => 'post_service_update',
            'title'     => 'Newly Refurbished Executive Conference Center',
            'slug'      => 'newly-refurbished-executive-conference-center',
            'category'  => 'Service Update',
            'excerpt'   => 'Our modern conference hall has been upgraded with state-of-the-art audiovisual systems, fiber-optic internet, and luxury ergonomic seating.',
            'content'   => "Belmont Hotel is proud to announce the completion of our multi-million renovation for our Executive Conference & Event Center.\n\nDesigned to host corporate seminars, private banquets, and executive board meetings, the new facility offers:\n- 4K Ultra-HD laser projection and digital surround sound\n- High-speed dedicated optical fiber Wi-Fi with backup power\n- Modular acoustic partitioning for tailored group sizes (up to 250 delegates)\n- Dedicated banquet foyer and bespoke coffee break catering\n\nBook your upcoming corporate retreat or symposium with our concierge today to take advantage of introductory promotional packages.",
            'imageUrl'  => '/uploads/wz9hvhgbpp21mhtmeluv.jpg',
            'author'    => 'Belmont Management',
            'status'    => 'published',
            'eventDate' => null,
            'createdAt' => '2026-10-18 14:30:00',
            'updatedAt' => '2026-10-18 14:30:00',
        ],
    ];
}

/**
 * Pure-PHP JSON File Fallback Adapter that mimics PDO/PDOStatement
 * Used when neither MySQL nor SQLite is available or configured on cPanel.
 */
class JsonFallbackStatement {
    private $db;
    private $sql;
    private $results = [];

    public function __construct($db, $sql) {
        $this->db = $db;
        $this->sql = trim($sql);
    }

    public function execute($params = []) {
        $this->results = $this->db->runQuery($this->sql, $params);
        return true;
    }

    public function fetchAll() {
        return is_array($this->results) ? $this->results : [];
    }

    public function fetch() {
        return (is_array($this->results) && count($this->results) > 0) ? $this->results[0] : false;
    }

    public function fetchColumn() {
        if (is_array($this->results) && count($this->results) > 0) {
            $first = $this->results[0];
            if (is_array($first)) {
                return reset($first);
            }
            return $first;
        }
        return 0;
    }
}

class JsonFallbackPDO {
    private $dataDir;

    public function __construct($dataDir) {
        $this->dataDir = rtrim($dataDir, '/\\');
        if (!is_dir($this->dataDir)) {
            @mkdir($this->dataDir, 0755, true);
        }
        $this->ensureSeedData();
    }

    private function getFilePath($table) {
        return $this->dataDir . DIRECTORY_SEPARATOR . strtolower($table) . '.json';
    }

    private function ensureSeedData() {
        $imagesFile = $this->getFilePath('images');
        if (!file_exists($imagesFile)) {
            $this->writeTable('images', getInitialSeedImages());
        }
        $postsFile = $this->getFilePath('posts');
        if (!file_exists($postsFile)) {
            $this->writeTable('posts', getInitialSeedPosts());
        }
        foreach (['reservations', 'inquiries'] as $tbl) {
            $f = $this->getFilePath($tbl);
            if (!file_exists($f)) {
                $this->writeTable($tbl, []);
            }
        }
    }

    public function readTable($table) {
        $file = $this->getFilePath($table);
        if (!file_exists($file)) return [];
        $raw = @file_get_contents($file);
        if (!$raw) return [];
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public function writeTable($table, $rows) {
        $file = $this->getFilePath($table);
        @file_put_contents($file, json_encode(array_values($rows), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    public function query($sql) {
        $stmt = new JsonFallbackStatement($this, $sql);
        $stmt->execute([]);
        return $stmt;
    }

    public function prepare($sql) {
        return new JsonFallbackStatement($this, $sql);
    }

    private function getParam($params, $name) {
        if (array_key_exists(':' . $name, $params)) return $params[':' . $name];
        if (array_key_exists($name, $params)) return $params[$name];
        return null;
    }

    public function runQuery($sql, $params = []) {
        // 1. SELECT COUNT(*) FROM table WHERE col = :val
        if (preg_match('/^SELECT\s+COUNT\(\*\)\s+FROM\s+[`"]?(\w+)[`"]?\s+WHERE\s+(\w+)\s*=\s*:(\w+)/i', $sql, $m)) {
            $table = $m[1];
            $col = $m[2];
            $paramName = $m[3];
            $val = $this->getParam($params, $paramName);
            $rows = $this->readTable($table);
            $count = 0;
            foreach ($rows as $r) {
                if (($r[$col] ?? null) == $val) $count++;
            }
            return [['count' => $count]];
        }

        // 2. SELECT * FROM table ...
        if (preg_match('/^SELECT\s+\*\s+FROM\s+[`"]?(\w+)[`"]?(.*)$/is', $sql, $m)) {
            $table = $m[1];
            $rest = $m[2];
            $rows = $this->readTable($table);

            // Filter by WHERE conditions like col = :param
            if (preg_match_all('/(\w+)\s*=\s*:(\w+)/i', $rest, $conds, PREG_SET_ORDER)) {
                foreach ($conds as $c) {
                    $col = $c[1];
                    $pName = $c[2];
                    $val = $this->getParam($params, $pName);
                    $rows = array_values(array_filter($rows, function ($r) use ($col, $val) {
                        return isset($r[$col]) && strtolower((string)$r[$col]) === strtolower((string)$val);
                    }));
                }
            }

            // Sort by createdAt DESC by default
            usort($rows, function ($a, $b) {
                $tA = isset($a['createdAt']) ? strtotime($a['createdAt']) : 0;
                $tB = isset($b['createdAt']) ? strtotime($b['createdAt']) : 0;
                return $tB <=> $tA;
            });

            if (stripos($rest, 'LIMIT 1') !== false) {
                return count($rows) > 0 ? [$rows[0]] : [];
            }

            return $rows;
        }

        // 3. INSERT INTO table (cols...) VALUES (vals...)
        if (preg_match('/^INSERT\s+INTO\s+[`"]?(\w+)[`"]?\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/is', $sql, $m)) {
            $table = $m[1];
            $cols = array_map(function ($c) {
                return trim($c, " \t\n\r\0\x0B`\"");
            }, explode(',', $m[2]));
            $vals = array_map('trim', explode(',', $m[3]));

            $newRow = [];
            foreach ($cols as $idx => $col) {
                $vToken = $vals[$idx] ?? '';
                if (strpos($vToken, ':') === 0) {
                    $pName = ltrim($vToken, ':');
                    $newRow[$col] = $this->getParam($params, $pName);
                } else {
                    $newRow[$col] = trim($vToken, "'\"");
                }
            }

            $rows = $this->readTable($table);
            array_unshift($rows, $newRow);
            $this->writeTable($table, $rows);
            return [];
        }

        // 4. UPDATE table SET ... WHERE id = :id
        if (preg_match('/^UPDATE\s+[`"]?(\w+)[`"]?\s+SET\s+(.+?)\s+WHERE\s+id\s*=\s*:id/is', $sql, $m)) {
            $table = $m[1];
            $setPart = $m[2];
            $id = $this->getParam($params, 'id');

            $updates = [];
            if (preg_match_all('/[`"]?(\w+)[`"]?\s*=\s*:(\w+)/i', $setPart, $assigns, PREG_SET_ORDER)) {
                foreach ($assigns as $a) {
                    $col = $a[1];
                    $pName = $a[2];
                    $updates[$col] = $this->getParam($params, $pName);
                }
            }

            $rows = $this->readTable($table);
            foreach ($rows as &$r) {
                if (($r['id'] ?? '') === (string)$id) {
                    foreach ($updates as $k => $v) {
                        $r[$k] = $v;
                    }
                }
            }
            unset($r);
            $this->writeTable($table, $rows);
            return [];
        }

        // 5. DELETE FROM table WHERE id = :id
        if (preg_match('/^DELETE\s+FROM\s+[`"]?(\w+)[`"]?\s+WHERE\s+id\s*=\s*:id/is', $sql, $m)) {
            $table = $m[1];
            $id = $this->getParam($params, 'id');
            $rows = $this->readTable($table);
            $rows = array_values(array_filter($rows, function ($r) use ($id) {
                return ($r['id'] ?? '') !== (string)$id;
            }));
            $this->writeTable($table, $rows);
            return [];
        }

        return [];
    }
}

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    // 1. Try MySQL / PostgreSQL if configured with non-default credentials
    if (defined('DB_USER') && (DB_USER !== 'root' || (defined('DB_PASS') && DB_PASS !== ''))) {
        try {
            if (defined('DB_TYPE') && DB_TYPE === 'pgsql') {
                $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
            } else {
                $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            }
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            return $pdo;
        } catch (Exception $e) {
            // Fall through to local cPanel storage fallback
        }
    }

    // 2. Use pure-PHP JSON file storage in api/data/ (works on 100% of cPanel servers without setup)
    $dataDir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
    $pdo = new JsonFallbackPDO($dataDir);
    return $pdo;
}

/**
 * Helper to generate a unique string ID similar to cuid
 */
function generateId($prefix = '') {
    return ($prefix ? $prefix . '_' : '') . bin2hex(random_bytes(10));
}

/**
 * Helper to read JSON request body
 */
function getRequestBody() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Helper to return JSON response and exit
 */
function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Format a DB datetime string to ISO 8601
 */
function toIsoDate($dateString) {
    if (!$dateString) return null;
    $time = strtotime($dateString);
    return $time ? date('c', $time) : $dateString;
}
