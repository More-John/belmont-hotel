import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();
        const password = (body.password || '').trim();

        const adminEmail = (process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'johnnyscreenpage1@gmail.com').trim().toLowerCase();
        const adminPassword = (process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'BelmontHotelAbuja').trim();

        if (email === adminEmail && password === adminPassword) {
            return NextResponse.json({
                success: true,
                message: 'Login successful',
                user: { email: adminEmail, role: 'admin' },
            });
        }

        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
