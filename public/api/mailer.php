<?php
/**
 * Belmont Hotel - Email Notification Handler
 * Supports direct SMTP (Gmail, etc.) via socket and native PHP mail() fallback.
 */
require_once __DIR__ . '/config.php';

class SimpleSMTP {
    private $host;
    private $port;
    private $user;
    private $pass;
    private $socket;

    public function __construct($host, $port, $user, $pass) {
        $this->host = $host;
        $this->port = $port;
        $this->user = $user;
        $this->pass = $pass;
    }

    private function getResponse() {
        $data = "";
        while ($str = fgets($this->socket, 515)) {
            $data .= $str;
            if (substr($str, 3, 1) === " ") break;
        }
        return $data;
    }

    private function sendCmd($cmd, $expectedCode = 250) {
        fputs($this->socket, $cmd . "\r\n");
        $response = $this->getResponse();
        $code = (int)substr($response, 0, 3);
        if ($code !== $expectedCode) {
            throw new Exception("SMTP Error [$cmd]: $response");
        }
        return $response;
    }

    public function send($from, $fromName, $to, $subject, $htmlBody) {
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        $this->socket = @stream_socket_client(
            "tcp://{$this->host}:{$this->port}",
            $errno,
            $errstr,
            3,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$this->socket) {
            throw new Exception("Could not connect to SMTP server: $errstr ($errno)");
        }

        $this->getResponse(); // Read 220 welcome banner
        $this->sendCmd("EHLO " . gethostname(), 250);

        if ($this->port == 587) {
            $this->sendCmd("STARTTLS", 220);
            stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $this->sendCmd("EHLO " . gethostname(), 250);
        }

        $this->sendCmd("AUTH LOGIN", 334);
        $this->sendCmd(base64_encode($this->user), 334);
        $this->sendCmd(base64_encode($this->pass), 235);

        $this->sendCmd("MAIL FROM:<$from>", 250);
        $this->sendCmd("RCPT TO:<$to>", 250);
        $this->sendCmd("DATA", 354);

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$from>\r\n";
        $headers .= "To: <$to>\r\n";
        $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
        $headers .= "Date: " . date("r") . "\r\n";

        fputs($this->socket, "$headers\r\n$htmlBody\r\n.\r\n");
        $dataRes = $this->getResponse();
        if ((int)substr($dataRes, 0, 3) !== 250) {
            throw new Exception("Failed to send message body: $dataRes");
        }

        $this->sendCmd("QUIT", 221);
        fclose($this->socket);
        return true;
    }
}

function sendEmailMessage($to, $subject, $htmlContent) {
    if (empty($to)) return false;

    if (defined('USE_SMTP') && USE_SMTP && defined('SMTP_HOST') && !empty(SMTP_HOST)) {
        try {
            $smtp = new SimpleSMTP(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS);
            return $smtp->send(SMTP_FROM, SMTP_FROM_NAME, $to, $subject, $htmlContent);
        } catch (Exception $e) {
            error_log("SMTP send failed, trying native mail(): " . $e->getMessage());
        }
    }

    // Native mail() fallback
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM . ">\r\n";
    $headers .= "Reply-To: " . SMTP_FROM . "\r\n";

    return @mail($to, $subject, $htmlContent, $headers);
}

function sendInquiryEmail($inquiry) {
    $adminEmail = defined('ADMIN_EMAIL') ? ADMIN_EMAIL : SMTP_FROM;
    $subject = "New Inquiry from " . $inquiry['name'];
    $phone = !empty($inquiry['phone']) ? htmlspecialchars($inquiry['phone']) : 'Not provided';
    $messageFormatted = nl2br(htmlspecialchars($inquiry['message']));

    $html = "
    <h2>New Contact Inquiry</h2>
    <p><strong>Name:</strong> " . htmlspecialchars($inquiry['name']) . "</p>
    <p><strong>Email:</strong> " . htmlspecialchars($inquiry['email']) . "</p>
    <p><strong>Phone:</strong> " . $phone . "</p>
    <p><strong>Subject:</strong> " . htmlspecialchars($inquiry['subject'] ?? 'No Subject') . "</p>
    <p><strong>Message:</strong><br/>" . $messageFormatted . "</p>
    ";

    return sendEmailMessage($adminEmail, $subject, $html);
}

function sendReservationEmail($resv) {
    $adminEmail = defined('ADMIN_EMAIL') ? ADMIN_EMAIL : SMTP_FROM;
    $subject = "New Reservation from " . $resv['guestName'];
    $checkInStr = date('M d, Y', strtotime($resv['checkIn']));
    $checkOutStr = date('M d, Y', strtotime($resv['checkOut']));

    $html = "
    <h2>New Reservation Request</h2>
    <p><strong>Guest:</strong> " . htmlspecialchars($resv['guestName']) . "</p>
    <p><strong>Email:</strong> " . htmlspecialchars($resv['guestEmail']) . "</p>
    <p><strong>Phone:</strong> " . htmlspecialchars($resv['guestPhone']) . "</p>
    <p><strong>Room Type:</strong> " . htmlspecialchars($resv['roomType']) . "</p>
    <p><strong>Check-in:</strong> " . $checkInStr . "</p>
    <p><strong>Check-out:</strong> " . $checkOutStr . "</p>
    <p><strong>Persons:</strong> " . intval($resv['persons']) . "</p>
    ";

    return sendEmailMessage($adminEmail, $subject, $html);
}

function sendGuestConfirmationEmail($resv) {
    $guestEmail = $resv['guestEmail'];
    $subject = "Your Reservation Request at Belmont Hotel";
    $checkInStr = date('M d, Y', strtotime($resv['checkIn']));
    $checkOutStr = date('M d, Y', strtotime($resv['checkOut']));

    $html = "
    <div style=\"font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;\">
        <h2 style=\"color: #c5a880; text-align: center;\">Reservation Request Received</h2>
        <p>Dear " . htmlspecialchars($resv['guestName']) . ",</p>
        <p>Thank you for choosing Belmont Hotel! Your reservation request was received successfully.</p>
        <p>We are currently reviewing your request for the <strong>" . htmlspecialchars($resv['roomType']) . "</strong> from <strong>" . $checkInStr . "</strong> to <strong>" . $checkOutStr . "</strong>.</p>
        <p>Please be assured that a response will be issued to you shortly with your final confirmation.</p>
        <p>We look forward to hosting you.</p>
        <p style=\"margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999;\">
            Belmont Hotel<br/>
            This is an automated message, please do not reply directly to this email.
        </p>
    </div>
    ";

    return sendEmailMessage($guestEmail, $subject, $html);
}
