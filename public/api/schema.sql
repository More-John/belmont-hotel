-- ======================================================
-- Belmont Hotel Database Schema
-- Import this SQL file into your cPanel MySQL Database via phpMyAdmin
-- ======================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Inquiries Table
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `subject` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'unread',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_inquiries_createdAt` (`createdAt` DESC),
  INDEX `idx_inquiries_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Reservations Table
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` VARCHAR(64) NOT NULL,
  `guestName` VARCHAR(255) NOT NULL,
  `guestEmail` VARCHAR(255) NOT NULL,
  `guestPhone` VARCHAR(50) NOT NULL,
  `roomType` VARCHAR(100) NOT NULL,
  `checkIn` DATE NOT NULL,
  `checkOut` DATE NOT NULL,
  `persons` INT NOT NULL DEFAULT 1,
  `specialRequests` TEXT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_reservations_createdAt` (`createdAt` DESC),
  INDEX `idx_reservations_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Images Table (All pictures served from local /uploads/)
CREATE TABLE IF NOT EXISTS `images` (
  `id` VARCHAR(64) NOT NULL,
  `url` TEXT NOT NULL,
  `publicId` VARCHAR(255) DEFAULT NULL,
  `alt` VARCHAR(255) DEFAULT NULL,
  `section` VARCHAR(100) NOT NULL,
  `order` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_images_order` (`order` ASC),
  INDEX `idx_images_section` (`section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Posts Table (Updates, Events, Blogs, Service News)
CREATE TABLE IF NOT EXISTS `posts` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Update', -- 'Service Update', 'Event', 'Blog', 'News'
  `excerpt` TEXT NULL,
  `content` LONGTEXT NOT NULL,
  `imageUrl` TEXT NULL,
  `author` VARCHAR(100) DEFAULT 'Belmont Hotel',
  `status` VARCHAR(20) NOT NULL DEFAULT 'published', -- 'published', 'draft'
  `eventDate` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_posts_slug` (`slug`),
  INDEX `idx_posts_category` (`category`),
  INDEX `idx_posts_status` (`status`),
  INDEX `idx_posts_createdAt` (`createdAt` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- Initial Seed Data: Hotel Images (Configured for local cPanel /uploads/)
-- ======================================================
REPLACE INTO `images` (`id`, `url`, `publicId`, `alt`, `section`, `order`, `createdAt`) VALUES
('cmr3v24mp000810j7ldkjra16', '/uploads/drhq3lx2bkvmcg1dspc9.jpg', NULL, 'service-event', 'Services', 0, '2026-07-02 18:51:39'),
('cmrp2biuh0000ap23l7fwgpv5', '/uploads/sncwlrtxyuycylaqc6du.jpg', NULL, 'room-executive-suite-01', 'Rooms', 0, '2026-07-17 14:58:04'),
('cmrp2gxhb0003ap235a6q7l1i', '/uploads/qhvjhunjna6dix7nweat.jpg', NULL, 'room-executive-suite-02', 'Rooms', 0, '2026-07-17 15:02:15'),
('cmrp3i0b2000dap23q97uerwk', '/uploads/z8ldhldxmvdbm89hwpi0.jpg', NULL, 'room-deluxe-02', 'Rooms', 0, '2026-07-17 15:31:06'),
('cmrp3imcu000eap23vqq8t3tb', '/uploads/viudrckt6he4ky49nufz.jpg', NULL, 'room-deluxe-03', 'Rooms', 0, '2026-07-17 15:31:35'),
('cmrp3k3iy000gap23kgql5oi5', '/uploads/enzwah6rllk0gxgnm5up.jpg', NULL, 'room-executive-deluxe-02', 'Rooms', 0, '2026-07-17 15:32:43'),
('cmrp3m3w2000hap23xi4bgnw4', '/uploads/huav4erxn1vktr596y3v.jpg', NULL, 'room-executive-deluxe-03', 'Rooms', 0, '2026-07-17 15:34:17'),
('cmrp3mutn000iap23uqmz2y1v', '/uploads/zclp21mzxq8bsfcze8lv.jpg', NULL, 'room-executive-deluxe-04', 'Rooms', 0, '2026-07-17 15:34:52'),
('cmrp3p78d000jap23kgohzh5l', '/uploads/vwtwkunucjf4jllmormh.jpg', NULL, 'service-minibar', 'Services', 0, '2026-07-17 15:36:42'),
('cmrp3r052000kap23jma9uml4', '/uploads/f5klmtyyw8xlaurxq1aw.jpg', NULL, 'service-restaurant', 'Services', 0, '2026-07-17 15:38:06'),
('cmrp4qbnu0000wpsrfu47xnsq', '/uploads/kxtucqrtgjcczg16lprb.jpg', NULL, 'hero-section-01', 'Hero', 0, '2026-07-17 16:05:34'),
('cmrp54w9y000oap2306nn56t0', '/uploads/cjlaz22ev7gmecrftsxe.jpg', NULL, 'service-catering', 'Services', 0, '2026-07-17 16:16:53'),
('cmrp5c8ct0000fc1badghquuh', '/uploads/ykgpts73ve6yx6w3nrjb.jpg', NULL, 'room-deluxe-03', 'Rooms', 0, '2026-07-17 16:22:36'),
('cms7kp26z0000uov3icn3bp42', '/uploads/et5cxwtpgsoaqdztptme.jpg', NULL, 'room-business-suite-01', 'Rooms', 0, '2026-07-30 13:52:20'),
('cms7kq4r40001uov3mryx5vbr', '/uploads/pff6xmd2hd2tqzglcrik.jpg', NULL, 'room-business-suite-02', 'Rooms', 0, '2026-07-30 13:53:10'),
('cms7kqkdh0002uov3yg2snjky', '/uploads/qrzqio8csilffapjji0c.jpg', NULL, 'room-business-suite-03', 'Rooms', 0, '2026-07-30 13:53:30'),
('cms7l8g5o0004uov3qjpglype', '/uploads/wz9hvhgbpp21mhtmeluv.jpg', NULL, 'service-conference', 'Services', 0, '2026-07-30 14:07:24'),
('cms7lpu090005uov3ggqj86td', '/uploads/tltfaq7ib9wblopbkfpj.jpg', NULL, 'hero-section-05', 'Hero', 0, '2026-07-30 14:20:55'),
('cms7m0oed0008uov39w1345vo', '/uploads/pynp5hmdt0ymyx1rfmvq.jpg', NULL, 'hero-section-08', 'Hero', 0, '2026-07-30 14:29:21'),
('cms8qciob0000te73o0pp2dp6', '/uploads/rxpz3ew0bjhx4mpmshbh.jpg', NULL, 'room-executive-deluxe-04', 'Rooms', 0, '2026-07-31 09:18:18'),
('cmsi2kd7w0000o05fy9ejm2ne', '/uploads/uwu6nzja7jcmnujnnphx.jpg', NULL, 'hero-section-06', 'Hero', 0, '2026-08-06 22:10:16'),
('cmsj7cwrt0000ed63ekqaszi8', '/uploads/nap8otoht6ojdkquuf5x.jpg', NULL, 'hero-section-05', 'Hero', 0, '2026-08-07 17:12:12');

-- ======================================================
-- Initial Seed Data: Sample Updates & Events
-- ======================================================
REPLACE INTO `posts` (`id`, `title`, `slug`, `category`, `excerpt`, `content`, `imageUrl`, `author`, `status`, `eventDate`, `createdAt`) VALUES
('post_welcome_event', 'Grand Weekend Live Acoustic & BBQ Night', 'weekend-live-acoustic-bbq-night', 'Event', 'Join us every Saturday evening by the poolside for tender BBQ grills, handcrafted cocktails, and relaxing live acoustic music under the stars.', 'We are excited to invite all guests and visitors to our signature Weekend Live Acoustic & BBQ Night.\n\nEnjoy an unforgettable open-air dining experience featuring our chef\'s special prime cuts, fresh seafood skewers, and tropical cocktails prepared by our master mixologists.\n\nEvent Highlights:\n- Live acoustic performance starting from 7:00 PM\n- Unlimited buffet sides and artisan desserts\n- Special poolside seating with romantic ambient lighting\n- Complimentary welcome cocktail for all hotel guests\n\nReservations are highly recommended. Contact our front desk or use the reservation tab on our website.', '/uploads/drhq3lx2bkvmcg1dspc9.jpg', 'Belmont Events Team', 'published', '2026-11-15 19:00:00', '2026-10-15 10:00:00'),
('post_service_update', 'Newly Refurbished Executive Conference Center', 'newly-refurbished-executive-conference-center', 'Service Update', 'Our modern conference hall has been upgraded with state-of-the-art audiovisual systems, fiber-optic internet, and luxury ergonomic seating.', 'Belmont Hotel is proud to announce the completion of our multi-million renovation for our Executive Conference & Event Center.\n\nDesigned to host corporate seminars, private banquets, and executive board meetings, the new facility offers:\n- 4K Ultra-HD laser projection and digital surround sound\n- High-speed dedicated optical fiber Wi-Fi with backup power\n- Modular acoustic partitioning for tailored group sizes (up to 250 delegates)\n- Dedicated banquet foyer and bespoke coffee break catering\n\nBook your upcoming corporate retreat or symposium with our concierge today to take advantage of introductory promotional packages.', '/uploads/wz9hvhgbpp21mhtmeluv.jpg', 'Belmont Management', 'published', NULL, '2026-10-18 14:30:00');

SET FOREIGN_KEY_CHECKS = 1;
