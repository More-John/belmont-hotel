import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReservationEmail } from '@/lib/email';

// GET: fetch all reservations (for admin dashboard)
export async function GET() {
    try {
        const reservations = await prisma.reservation.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(reservations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }
}

// POST: create a new reservation
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const reservation = await prisma.reservation.create({
            data: {
                guestName: body.guestName,
                guestEmail: body.guestEmail,
                guestPhone: body.guestPhone,
                roomType: body.roomType,
                checkIn: new Date(body.checkIn),
                checkOut: new Date(body.checkOut),
                persons: body.persons,
                specialRequests: body.specialRequests,
                status: 'pending',
            },
        });

        // Send email notification to admin
        await sendReservationEmail(reservation);

        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }
}