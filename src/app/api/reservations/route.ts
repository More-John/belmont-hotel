import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReservationEmail, sendGuestConfirmationEmail } from '@/lib/email';

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
                status: 'pending',
            },
        });

        // Send email notification to admin
        await sendReservationEmail(reservation);

        // Send confirmation email to guest
        await sendGuestConfirmationEmail(reservation);

        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }
}

// PATCH: update reservation status
export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const body = await request.json();
        const updated = await prisma.reservation.update({
            where: { id },
            data: { status: body.status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
    }
}

// DELETE: remove a reservation
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await prisma.reservation.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
    }
}