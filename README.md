# Belmont Hotel — Luxury Hospitality Web Platform

A production-grade, full-stack web application built for **Belmont Hotel Abuja**, combining an opulent luxury aesthetic with robust hospitality management. Engineered with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Neon PostgreSQL**, and **Cloudinary**.

Designed with a dual-deployment architecture supporting both high-performance serverless hosting on **Vercel** and static deployment with clean URL routing on **cPanel/Apache**.

---

## Visual Showcase

### Hero & Brand Identity
*Immersive full-screen carousel with dynamic slide transitions, gold typography, and intuitive navigation controls.*

![Belmont Hotel Hero Section](docs/screenshots/hero-section.png)

### Interactive Room Suite Explorer
*Showcasing executive suites and deluxe accommodations with live pricing in Naira (₦), high-resolution imagery, and smooth tab switching.*

![Belmont Hotel Rooms Showcase](docs/screenshots/rooms-showcase.png)

### Room Detail Modal & Gallery
*Rich modal drawer featuring multi-angle photo preview, room dimensions, bed configurations, comprehensive amenities, and instant reservation hooks.*

![Belmont Hotel Room Details Modal](docs/screenshots/room-modal.png)

---

## Key Features

### Guest Experience
* **Luxury Dark & Gold Aesthetic**: Tailored bespoke palette (`hotel-black`, `hotel-gold`, `hotel-white`) creating an upscale boutique hotel ambiance.
* **Interactive Suite Showcase**: Seamless browsing across Business Suites, Executive Suites, Executive Deluxe, and Deluxe Rooms with synchronized image carousels.
* **Rich Room Detail Modal**: Displays dimensions ($m^2$), bed types, daily rates, complete amenity lists, and direct checkout hooks without page reload.
* **Services & Facilities**: Highlights on-site amenities including the Fine Dining Restaurant, Mini Bar, Executive Conference Center, and Catering Services.
* **Updates & Events Hub**: Dedicated blog and events page featuring categorized updates (Service Announcements, Events, Culinary News) with event countdown dates.
* **Reservation & Inquiry Engine**: Frictionless direct booking workflow with automated status tracking.

### Admin & Hotel Operations
* **Protected Administrative Portal**: Secure credential-authenticated login (`/admin/login`) backed by configurable environment variables.
* **Centralized Dashboard**: Real-time management interface featuring:
  * **Overview Analytics**: Active reservations, room occupancy, guest inquiries, and recent activity feed.
  * **Reservation Manager**: Status controls to confirm, modify, or archive guest reservations.
  * **Post & Event Publisher**: Rich publishing tool with automated slug generation, category assignment, draft/published toggle, and direct Cloudinary image uploading.
  * **Media Asset Manager**: Real-time reassignment and deletion of hero banners, room galleries, and service imagery.

### Engineering & Reliability
* **Cold-Start Resilience & Instant Paint**: Smart fallback mechanism ensuring high-res visuals and sample posts display immediately on first paint, eliminating blank states or database latency delays.
* **Dual-Hosting Compatibility**:
  * **Vercel**: Full dynamic serverless API execution with live Neon PostgreSQL queries.
  * **cPanel / Apache**: Pre-configured static HTML export via `scripts/build-static.js` with automated directory indexing (`trailingSlash: true`) and custom `.htaccess` rewrite rules.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Radix UI Primitives](https://www.radix-ui.com/) |
| **Database & ORM** | [PostgreSQL (Neon Serverless)](https://neon.tech/), [Prisma ORM v5](https://www.prisma.io/) |
| **Media & Storage** | [Cloudinary Media SDK](https://cloudinary.com/) (Streaming uploads & CDN delivery) |
| **Communication** | [Nodemailer](https://nodemailer.com/) (Reservation confirmations & inquiries) |
| **Deployment** | [Vercel](https://vercel.com/) (Serverless) / [cPanel Apache](https://cpanel.net/) (Static Export + PHP API) |

---

## Project Structure

```text
belmont-hotel/
├── docs/
│   └── screenshots/          # Showcase images for documentation
├── prisma/
│   └── schema.prisma         # PostgreSQL schema (Reservation, Inquiry, Image, Post)
├── public/
│   ├── .htaccess             # Apache rewrite rules for clean URLs & SPA fallback
│   ├── api/                  # Standalone PHP backend handlers for cPanel
│   └── uploads/              # Local image storage for cPanel environments
├── scripts/
│   └── build-static.js       # Custom static export builder for cPanel hosting
└── src/
    ├── app/
    │   ├── admin/            # Authenticated admin dashboard & login
    │   ├── api/              # Next.js Serverless Route Handlers
    │   ├── updates/          # Dedicated news, updates & events page
    │   ├── layout.tsx        # Root layout, fonts & metadata
    │   └── page.tsx          # Homepage aggregating Hero, Rooms, Services, Updates
    ├── components/
    │   ├── admin/            # Admin management panels (Posts, Images, Overview)
    │   ├── HeroSection.tsx   # Full-width hero banner carousel
    │   ├── RoomsSection.tsx  # Interactive room suite switcher
    │   ├── ServicesSection.tsx # Additional services grid
    │   └── UpdatesSection.tsx # Latest news & event cards
    ├── data/
    │   └── defaultPosts.ts   # Fallback seed posts for zero-latency loading
    └── lib/
        └── prisma.ts         # Singleton Prisma client instance
```

---

## Getting Started

### Prerequisites
* **Node.js**: v18.18.0 or later
* **npm**, **pnpm**, or **yarn**
* A **Neon PostgreSQL** database (or any PostgreSQL instance)
* A **Cloudinary** account (for media storage)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/belmont-hotel.git
   cd belmont-hotel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://user:password@ep-your-instance.neon.tech/neondb?sslmode=require"

   # Cloudinary Media Storage
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"

   # Administrative Access
   ADMIN_EMAIL="admin@belmonthotel.com"
   ADMIN_PASSWORD="YourSecurePasswordHere"
   NEXT_PUBLIC_ADMIN_EMAIL="admin@belmonthotel.com"
   NEXT_PUBLIC_ADMIN_PASSWORD="YourSecurePasswordHere"
   ```

4. **Synchronize Database Schema:**
   ```bash
   npx prisma db push
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add the environment variables from your `.env` in **Vercel Settings > Environment Variables**.
4. Deploy! The build script (`prisma generate && next build`) automatically configures Prisma and serverless routes.

### Deploying to cPanel / Apache
1. Run the custom static export script:
   ```bash
   node scripts/build-static.js
   ```
2. Compress the contents of the generated `out/` directory into a `.zip` archive.
3. Upload and extract directly into your cPanel `public_html/` root.
4. Clean URLs and `/admin/login` routing work automatically via the pre-packaged `.htaccess`.

---

## Author & Acknowledgements

* **Developed by**: Belmont Hotel Engineering Team
* **Location**: Abuja, Nigeria
* **Design System**: Tailored boutique luxury hospitality guidelines
