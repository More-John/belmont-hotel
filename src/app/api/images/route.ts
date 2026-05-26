import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function GET() {
    const images = await prisma.image.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(images);
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;
    const section = formData.get('section') as string;

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await writeFile(path.join(uploadDir, filename), buffer);
    const url = `/uploads/${filename}`;

    const image = await prisma.image.create({
        data: { url, alt, section, order: 0 },
    });
    return NextResponse.json(image, { status: 201 });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const image = await prisma.image.findUnique({ where: { id } });
    if (image && image.url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', image.url);
        await unlink(filePath).catch(() => { });
    }
    await prisma.image.delete({ where: { id } });
    return NextResponse.json({ success: true });
}