<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$role = $_POST['role'] ?? '';
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$message = $_POST['message'] ?? '';

if (empty($role) || empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin bắt buộc.']);
    exit;
}

$roleLabels = [
    'co-founder' => 'Đồng sáng lập',
    'partner' => 'Đối tác',
    'investor' => 'Nhà đầu tư',
    'advisor' => 'Cố vấn',
];
$roleLabel = $roleLabels[$role] ?? $role;

// Include PHPMailer classes manually
require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Server settings for Gmail SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    
    // TODO: Replace with your actual Gmail address and App Password
    $mail->Username   = 'YOUR_GMAIL_ACCOUNT@gmail.com'; 
    $mail->Password   = 'YOUR_GMAIL_APP_PASSWORD'; 
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    // Sender
    $mail->setFrom('YOUR_GMAIL_ACCOUNT@gmail.com', 'Doctor Genie');
    
    // Receivers: User (Submitter)
    $mail->addAddress($email, $name);
    
    // CC to contact@hearme.vn
    $mail->addCC('contact@hearme.vn');

    // Content
    $mail->isHTML(true);
    $mail->Subject = "[Doctor Genie] Cảm ơn bạn đã đăng ký: $roleLabel";
    
    // Embed the logo
    $logoPath = __DIR__ . '/../public/images/genie_logo.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'genie_logo');
        $logoHtml = "<img src='cid:genie_logo' alt='Doctor Genie' style='height:40px; margin-bottom:15px;'>";
    } else {
        $logoHtml = "<h3>Doctor Genie</h3>";
    }
    
    $body = "
    <div style='font-family: Arial, sans-serif; color: #333;'>
        $logoHtml
        <h2>Cảm ơn bạn, $name!</h2>
        <p>Chúng tôi đã nhận được đăng ký của bạn với vai trò <strong>$roleLabel</strong>.</p>
        <p>Dưới đây là thông tin bạn đã cung cấp:</p>
        <table style='border-collapse:collapse;width:100%;max-width:600px;'>
            <tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Vai trò</td><td style='padding:8px;border:1px solid #ddd'>$roleLabel</td></tr>
            <tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Họ tên</td><td style='padding:8px;border:1px solid #ddd'>$name</td></tr>
            <tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Email</td><td style='padding:8px;border:1px solid #ddd'>$email</td></tr>
            <tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Điện thoại</td><td style='padding:8px;border:1px solid #ddd'>$phone</td></tr>
            <tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Lời nhắn</td><td style='padding:8px;border:1px solid #ddd'>" . nl2br(htmlspecialchars($message)) . "</td></tr>
        </table>
        <br>
        <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
        <br>
        <p>Trân trọng,</p>
        <p><strong>Doctor Genie - AI Healthcare Ecosystem</strong></p>
        <p><a href='https://business.gnixy.com'>business.gnixy.com</a></p>
    </div>
    ";
    
    $mail->Body = $body;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Đăng ký thành công!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gửi thất bại. Vui lòng thử lại. Lỗi: ' . $mail->ErrorInfo]);
}
