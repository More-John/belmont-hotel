import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    const images = await prisma.image.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(images);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const alt = formData.get('alt') as string;
        const section = formData.get('section') as string;

        if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a Promise
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'belmont-hotel' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        }) as any;

        const image = await prisma.image.create({
            data: {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                alt,
                section,
                order: 0
            },
        });
        return NextResponse.json(image, { status: 201 });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        const image = await prisma.image.findUnique({ where: { id } });
        if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        await prisma.image.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}