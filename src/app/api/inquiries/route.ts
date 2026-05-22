import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(inquiries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const inquiry = await prisma.inquiry.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone || null,
                subject: body.subject,
                message: body.message,
                status: 'unread',
            },
        });
        return NextResponse.json(inquiry, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
    }
}

// Optional: PATCH to mark as read, DELETE to remove
export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const updated = await prisma.inquiry.update({
        where: { id },
        data: { status },
    });
    return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
}