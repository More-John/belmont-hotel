import nodemailer from 'nodemailer';

// Configure your email transport (use environment variables)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendReservationEmail(reservation: any) {
    const adminEmail = process.env.ADMIN_EMAIL; // e.g., manager@belmonthotel.com
    const subject = `New Reservation from ${reservation.guestName}`;
    const html = `
    <h2>New Reservation Request</h2>
    <p><strong>Guest:</strong> ${reservation.guestName}</p>
    <p><strong>Email:</strong> ${reservation.guestEmail}</p>
    <p><strong>Phone:</strong> ${reservation.guestPhone}</p>
    <p><strong>Room Type:</strong> ${reservation.roomType}</p>
    <p><strong>Check-in:</strong> ${new Date(reservation.checkIn).toLocaleDateString()}</p>
    <p><strong>Check-out:</strong> ${new Date(reservation.checkOut).toLocaleDateString()}</p>
    <p><strong>Adults:</strong> ${reservation.adults}, <strong>Children:</strong> ${reservation.children}</p>
    <p><strong>Special Requests:</strong> ${reservation.specialRequests || 'None'}</p>
  `;

    await transporter.sendMail({
        from: `"Belmont Hotel" <${process.env.SMTP_FROM}>`,
        to: adminEmail,
        subject,
        html,
    });
}