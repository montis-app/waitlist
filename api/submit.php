<?php
require 'config.php';
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method"]);
    exit();
}

$email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);
if (!$email) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email address"]);
    exit();
}

try {
    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("INSERT INTO waitlist (email, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token)");
    if (!$stmt->execute([$email, $token])) {
        throw new Exception("Database error while saving email");
    }

    sendVerificationEmail($email, $token);
    http_response_code(201);
    echo json_encode(["message" => "Check your email for verification"]);
    exit();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage() . ' - ' . $_ENV['SMTP_HOST']]);
    exit();
}

function sendVerificationEmail($email, $token)
{
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'];
    $mail->Password = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $_ENV['SMTP_PORT'];

    $mail->setFrom("hello@montis.app", "MONTIS");
    $mail->addAddress($email);
    $mail->Subject = "Verify your email - MONTIS";
    $mail->isHTML(true);

    $verificationLink = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['HTTP_HOST'] . "/api/verify.php?token=$token";
    $mail->Body = "
            <div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
                <h2 style='color: #333;'>MONTIS - Confirm Your Email</h2>
                <p>Thank you for signing up! Click the button below to verify your email:</p>
                <a href='$verificationLink' style='display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Verify Email</a>
                <p>If you did not request this, you can ignore this email.</p>
            </div>
        ";

    return $mail->send();
}