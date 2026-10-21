import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const postsFilePath = path.join(dataDir, 'posts.json');

const initialPosts = [
    {
        id: 'post_welcome_event',
        title: 'Grand Weekend Live Acoustic & BBQ Night',
        slug: 'weekend-live-acoustic-bbq-night',
        category: 'Event',
        excerpt: 'Join us every Saturday evening by the poolside for tender BBQ grills, handcrafted cocktails, and relaxing live acoustic music under the stars.',
        content: "We are excited to invite all guests and visitors to our signature Weekend Live Acoustic & BBQ Night.\n\nEnjoy an unforgettable open-air dining experience featuring our chef's special prime cuts, fresh seafood skewers, and tropical cocktails prepared by our master mixologists.\n\nEvent Highlights:\n- Live acoustic performance starting from 7:00 PM\n- Unlimited buffet sides and artisan desserts\n- Special poolside seating with romantic ambient lighting\n- Complimentary welcome cocktail for all hotel guests\n\nReservations are highly recommended. Contact our front desk or use the reservation tab on our website.",
        imageUrl: '/uploads/drhq3lx2bkvmcg1dspc9.jpg',
        author: 'Belmont Events Team',
        status: 'published',
        eventDate: '2026-11-15T19:00:00.000Z',
        createdAt: '2026-10-15T10:00:00.000Z',
        updatedAt: '2026-10-15T10:00:00.000Z',
    },
    {
        id: 'post_service_update',
        title: 'Newly Refurbished Executive Conference Center',
        slug: 'newly-refurbished-executive-conference-center',
        category: 'Service Update',
        excerpt: 'Our modern conference hall has been upgraded with state-of-the-art audiovisual systems, fiber-optic internet, and luxury ergonomic seating.',
        content: "Belmont Hotel is proud to announce the completion of our multi-million renovation for our Executive Conference & Event Center.\n\nDesigned to host corporate seminars, private banquets, and executive board meetings, the new facility offers:\n- 4K Ultra-HD laser projection and digital surround sound\n- High-speed dedicated optical fiber Wi-Fi with backup power\n- Modular acoustic partitioning for tailored group sizes (up to 250 delegates)\n- Dedicated banquet foyer and bespoke coffee break catering\n\nBook your upcoming corporate retreat or symposium with our concierge today to take advantage of introductory promotional packages.",
        imageUrl: '/uploads/wz9hvhgbpp21mhtmeluv.jpg',
        author: 'Belmont Management',
        status: 'published',
        eventDate: null,
        createdAt: '2026-10-18T14:30:00.000Z',
        updatedAt: '2026-10-18T14:30:00.000Z',
    },
];

function readPosts(): any[] {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(postsFilePath)) {
            fs.writeFileSync(postsFilePath, JSON.stringify(initialPosts, null, 2), 'utf-8');
            return initialPosts;
        }
        const raw = fs.readFileSync(postsFilePath, 'utf-8');
        return JSON.parse(raw);
    } catch (e) {
        return initialPosts;
    }
}

function writePosts(posts: any[]) {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `post-${Date.now()}`;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const posts = readPosts();

    if (id) {
        const post = posts.find((p) => p.id === id);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        return NextResponse.json(post);
    }

    if (slug) {
        const post = posts.find((p) => p.slug === slug);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        return NextResponse.json(post);
    }

    let filtered = [...posts];

    if (category && category !== 'All') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'all') {
        filtered = filtered.filter((p) => p.status === status);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filtered);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const title = (body.title || '').trim();
        const content = (body.content || '').trim();
        const category = (body.category || '').trim() || 'Update';
        const excerpt = (body.excerpt || '').trim() || content.substring(0, 150) + '...';
        const imageUrl = body.imageUrl || null;
        const author = (body.author || '').trim() || 'Belmont Hotel';
        const status = body.status === 'draft' ? 'draft' : 'published';
        const eventDate = body.eventDate || null;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const posts = readPosts();
        let slug = slugify(title);
        if (posts.some((p) => p.slug === slug)) {
            slug += `-${Date.now().toString().slice(-4)}`;
        }

        const newPost = {
            id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            title,
            slug,
            category,
            excerpt,
            content,
            imageUrl,
            author,
            status,
            eventDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        posts.unshift(newPost);
        writePosts(posts);

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing post id' }, { status: 400 });

        const body = await request.json();
        const posts = readPosts();
        const idx = posts.findIndex((p) => p.id === id);

        if (idx === -1) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        posts[idx] = {
            ...posts[idx],
            ...body,
            updatedAt: new Date().toISOString(),
        };

        writePosts(posts);
        return NextResponse.json(posts[idx]);
    } catch (error) {
        console.error('Update post error:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing post id' }, { status: 400 });

        const posts = readPosts();
        const filtered = posts.filter((p) => p.id !== id);

        writePosts(filtered);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete post error:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
