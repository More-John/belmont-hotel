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
    <p><strong>Persons:</strong> ${reservation.persons}</p>
  `;

    await transporter.sendMail({
        from: `"Belmont Hotel" <${process.env.SMTP_FROM}>`,
        to: adminEmail,
        subject,
        html,
    });
}

export async function sendInquiryEmail(inquiry: any) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const subject = `New Inquiry from ${inquiry.name}`;
    const html = `
    <h2>New Contact Inquiry</h2>
    <p><strong>Name:</strong> ${inquiry.name}</p>
    <p><strong>Email:</strong> ${inquiry.email}</p>
    <p><strong>Phone:</strong> ${inquiry.phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${inquiry.subject}</p>
    <p><strong>Message:</strong><br/>${inquiry.message.replace(/\n/g, '<br/>')}</p>
  `;
    await transporter.sendMail({
        from: `"Belmont Hotel" <${process.env.SMTP_FROM}>`,
        to: adminEmail,
        subject,
        html,
    });
}