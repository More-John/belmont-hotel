import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultPosts } from '@/data/defaultPosts';

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `post-${Date.now()}`;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');
        const category = searchParams.get('category');
        const status = searchParams.get('status');

        if (id) {
            const dbPost = await prisma.post.findUnique({ where: { id } });
            if (dbPost) return NextResponse.json(dbPost);

            const fallback = defaultPosts.find((p) => p.id === id);
            if (fallback) return NextResponse.json(fallback);

            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (slug) {
            const dbPost = await prisma.post.findUnique({ where: { slug } });
            if (dbPost) return NextResponse.json(dbPost);

            const fallback = defaultPosts.find((p) => p.slug === slug);
            if (fallback) return NextResponse.json(fallback);

            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        let posts = await prisma.post.findMany({
            where: {
                NOT: {
                    category: '__room_config__',
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // If database is empty, return defaultPosts so initial sample posts render immediately
        if (posts.length === 0) {
            let sampleList = [...defaultPosts];
            if (category && category !== 'All') {
                sampleList = sampleList.filter((p) => p.category.toLowerCase() === category.toLowerCase());
            }
            if (status && status !== 'all') {
                sampleList = sampleList.filter((p) => p.status === status);
            }
            return NextResponse.json(sampleList);
        }

        if (category && category !== 'All') {
            posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
        }

        if (status && status !== 'all') {
            posts = posts.filter((p) => p.status === status);
        }

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Failed to fetch posts from DB:', error);
        // Fallback to default posts on DB error
        return NextResponse.json(defaultPosts);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const title = (body.title || '').trim();
        const content = (body.content || '').trim();
        const category = (body.category || '').trim() || 'Blog';
        const excerpt = (body.excerpt || '').trim() || content.substring(0, 150) + '...';
        const imageUrl = body.imageUrl || null;
        const author = (body.author || '').trim() || 'Belmont Hotel';
        const status = body.status === 'draft' ? 'draft' : 'published';
        const eventDate = body.eventDate ? new Date(body.eventDate) : null;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        let slug = slugify(title);
        const existing = await prisma.post.findUnique({ where: { slug } });
        if (existing) {
            slug += `-${Date.now().toString().slice(-4)}`;
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                slug,
                category,
                excerpt,
                content,
                imageUrl,
                author,
                status,
                eventDate,
            },
        });

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
        const updateData: any = {};

        if (body.title !== undefined) updateData.title = body.title.trim();
        if (body.slug !== undefined) updateData.slug = body.slug.trim();
        if (body.category !== undefined) updateData.category = body.category.trim();
        if (body.excerpt !== undefined) updateData.excerpt = body.excerpt.trim();
        if (body.content !== undefined) updateData.content = body.content.trim();
        if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
        if (body.author !== undefined) updateData.author = body.author.trim();
        if (body.status !== undefined) updateData.status = body.status;
        if (body.eventDate !== undefined) {
            updateData.eventDate = body.eventDate ? new Date(body.eventDate) : null;
        }

        const updated = await prisma.post.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updated);
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

        await prisma.post.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete post error:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
