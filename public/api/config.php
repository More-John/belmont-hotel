<?php
/**
 * Belmont Hotel - API & Database Configuration
 * Configure your cPanel MySQL / Database and Email credentials here.
 */

// Database Settings
define('DB_TYPE', 'mysql');               // 'mysql' for standard cPanel MySQL, or 'pgsql' for PostgreSQL
define('DB_HOST', 'localhost');           // Typically 'localhost' on cPanel
define('DB_NAME', 'belmont_hotel');       // Your cPanel Database Name (e.g., cpaneluser_belmont)
define('DB_USER', 'root');                // Your cPanel Database Username (e.g., cpaneluser_dbuser)
define('DB_PASS', '');                    // Your cPanel Database Password
define('DB_PORT', '3306');                // Default 3306 for MySQL, 5432 for Postgres
define('DB_CHARSET', 'utf8mb4');

// Email & Notification Settings
define('USE_SMTP', true);                 // true = use SMTP (Gmail, etc.), false = use cPanel native mail()
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);                 // 587 for TLS, 465 for SSL
define('SMTP_USER', 'johnissaking@gmail.com');
define('SMTP_PASS', 'ppbb hpid jdyl frqe');
define('SMTP_FROM', 'johnissaking@gmail.com');
define('SMTP_FROM_NAME', 'Belmont Hotel');
define('ADMIN_EMAIL', 'johnnyscreenpage1@gmail.com');
define('ADMIN_PASSWORD', 'BelmontHotelAbuja');

// Image Storage Mode: 'local' (stores on cPanel in public_html/uploads) or 'cloudinary'
define('UPLOAD_STORAGE', 'local');

// Cloudinary Image Storage Settings (Only used if UPLOAD_STORAGE is set to 'cloudinary')
define('CLOUDINARY_CLOUD_NAME', 'dumtoo8hl');
define('CLOUDINARY_API_KEY', '652692342582187');
define('CLOUDINARY_API_SECRET', 'fqlBYzUwN360weihrWyc6drNy44');

// Local uploads folder settings (Used when UPLOAD_STORAGE is 'local')
define('LOCAL_UPLOAD_DIR', __DIR__ . '/../uploads/');
define('LOCAL_UPLOAD_URL', '/uploads/');
