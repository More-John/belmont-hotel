import nodemailer from 'nodemailer';
import path from 'path';

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

export async function sendGuestConfirmationEmail(reservation: any) {
    const subject = `Your Reservation Request at Belmont Hotel`;
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="cid:belmontlogo" alt="Belmont Hotel" style="max-width: 200px; height: auto;" />
        </div>
        <h2 style="color: #c5a880; text-align: center;">Reservation Request Received</h2>
        <p>Dear ${reservation.guestName},</p>
        <p>Thank you for choosing Belmont Hotels! Your reservation request was successful.</p>
        <p>We are currently reviewing your request for the <strong>${reservation.roomType}</strong> room from <strong>${new Date(reservation.checkIn).toLocaleDateString()}</strong> to <strong>${new Date(reservation.checkOut).toLocaleDateString()}</strong>.</p>
        <p>Please be assured that a response will be issued to you shortly with your final confirmation.</p>
        <p>We look forward to hosting you.</p>
        <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999;">
            Belmont Hotel<br/>
            This is an automated message, please do not reply directly to this email.
        </p>
    </div>
    `;

    const logoPath = path.join(process.cwd(), 'src', 'assets', 'belmont-logo.png');

    await transporter.sendMail({
        from: `"Belmont Hotel" <${process.env.SMTP_FROM}>`,
        to: reservation.guestEmail,
        subject,
        html,
        attachments: [
            {
                filename: 'belmont-logo.png',
                path: logoPath,
                cid: 'belmontlogo'
            }
        ]
    });
}