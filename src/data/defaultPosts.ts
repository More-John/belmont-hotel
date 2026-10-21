export interface PostItem {
    id: string;
    title: string;
    slug: string;
    category: "Service Update" | "Event" | "Blog" | "News" | string;
    excerpt: string;
    content: string;
    imageUrl: string | null;
    author: string;
    status: "published" | "draft" | string;
    eventDate: string | null;
    createdAt: string;
    updatedAt?: string;
}

export const defaultPosts: PostItem[] = [
    {
        id: "post_welcome_event",
        title: "Grand Weekend Live Acoustic & BBQ Night",
        slug: "weekend-live-acoustic-bbq-night",
        category: "Event",
        excerpt: "Join us every Saturday evening by the poolside for tender BBQ grills, handcrafted cocktails, and relaxing live acoustic music under the stars.",
        content: "We are excited to invite all guests and visitors to our signature Weekend Live Acoustic & BBQ Night.\n\nEnjoy an unforgettable open-air dining experience featuring our chef's special prime cuts, fresh seafood skewers, and tropical cocktails prepared by our master mixologists.\n\nEvent Highlights:\n- Live acoustic performance starting from 7:00 PM\n- Unlimited buffet sides and artisan desserts\n- Special poolside seating with romantic ambient lighting\n- Complimentary welcome cocktail for all hotel guests\n\nReservations are highly recommended. Contact our front desk or use the reservation tab on our website.",
        imageUrl: "https://res.cloudinary.com/dumtoo8hl/image/upload/v1783018299/belmont-hotel/drhq3lx2bkvmcg1dspc9.jpg",
        author: "Belmont Events Team",
        status: "published",
        eventDate: "2026-11-15T19:00:00.000Z",
        createdAt: "2026-10-15T10:00:00.000Z",
        updatedAt: "2026-10-15T10:00:00.000Z",
    },
    {
        id: "post_service_update",
        title: "Newly Refurbished Executive Conference Center",
        slug: "newly-refurbished-executive-conference-center",
        category: "Service Update",
        excerpt: "Our modern conference hall has been upgraded with state-of-the-art audiovisual systems, fiber-optic internet, and luxury ergonomic seating.",
        content: "Belmont Hotel is proud to announce the completion of our multi-million renovation for our Executive Conference & Event Center.\n\nDesigned to host corporate seminars, private banquets, and executive board meetings, the new facility offers:\n- 4K Ultra-HD laser projection and digital surround sound\n- High-speed dedicated optical fiber Wi-Fi with backup power\n- Modular acoustic partitioning for tailored group sizes (up to 250 delegates)\n- Dedicated banquet foyer and bespoke coffee break catering\n\nBook your upcoming corporate retreat or symposium with our concierge today to take advantage of introductory promotional packages.",
        imageUrl: "https://res.cloudinary.com/dumtoo8hl/image/upload/v1785420444/belmont-hotel/wz9hvhgbpp21mhtmeluv.jpg",
        author: "Belmont Management",
        status: "published",
        eventDate: null,
        createdAt: "2026-10-18T14:30:00.000Z",
        updatedAt: "2026-10-18T14:30:00.000Z",
    },
];
