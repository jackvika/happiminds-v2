<?php
// Strict error reporting for development (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to users
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Buffering to prevent any accidental output
ob_start();

// Headers must be sent before any output
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Content-Type: application/json; charset=UTF-8");

// Initialize response
$response = [
    'success' => false,
    'message' => 'An unexpected error occurred',
    'errors' => []
];

// Handle fatal errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'A server error occurred. Please try again later.'
        ]);
        exit;
    }
});

try {
    // Check for honeypot field
    if (!empty($_POST['honeypot'])) {
        throw new Exception('Spam attempt detected');
    }

    // Only process POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Validate required fields
    $required = ['name', 'email', 'message'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            $response['errors'][$field] = ucfirst($field) . ' is required';
        }
    }

    // Sanitize inputs
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $childAge = filter_input(INPUT_POST, 'childAge', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Invalid email format';
    }

    // Validate phone format if provided
    if (!empty($phone) && !preg_match('/^[0-9+\-\s]{10,20}$/', $phone)) {
        $response['errors']['phone'] = 'Invalid phone number format';
    }

    // Validate child age if provided
    $validAges = ['0.7-2', '2-4', '4-6', '6-9'];
    if (!empty($childAge) && !in_array($childAge, $validAges)) {
        $response['errors']['childAge'] = 'Invalid age group selected';
    }

    // If no validation errors, proceed
    if (empty($response['errors'])) {
        $to = 'earnbyapk@gmail.com';
        $subject = 'New Contact Form Submission: ' . substr($name, 0, 20);
        
        $emailContent = "Contact Form Submission Details:\n\n";
        $emailContent .= "Name: $name\n";
        $emailContent .= "Email: $email\n";
        $emailContent .= "Phone: " . ($phone ?: 'Not provided') . "\n";
        $emailContent .= "Child's Age: " . ($childAge ?: 'Not specified') . "\n\n";
        $emailContent .= "Message:\n" . wordwrap($message, 70) . "\n\n";
        $emailContent .= "---\n";
        $emailContent .= "Submitted from: " . ($_SERVER['HTTP_REFERER'] ?? 'Direct access') . "\n";
        $emailContent .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
        $emailContent .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";

        $headers = [
            'From' => "$name <$email>",
            'Reply-To' => $email,
            'X-Mailer' => 'PHP/' . phpversion(),
            'Content-Type' => 'text/plain; charset=UTF-8',
            'MIME-Version' => '1.0'
        ];

        // Convert headers array to string
        $headerString = implode("\r\n", array_map(
            function($k, $v) { return "$k: $v"; },
            array_keys($headers),
            $headers
        ));

        // Send email
        $mailSent = mail($to, $subject, $emailContent, $headerString);
        
        if ($mailSent) {
            $response['success'] = true;
            $response['message'] = 'Thank you! Your message has been sent.';
            
            // Log successful submission
            file_put_contents(
                'contact_submissions.log',
                date('[Y-m-d H:i:s]') . " Success - $email\n",
                FILE_APPEND
            );
        } else {
            throw new Exception('Failed to send email. Please try again later.');
        }
    } else {
        $response['message'] = 'Please correct the form errors';
    }
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = $e->getMessage();
    
    // Log the error
    file_put_contents(
        'contact_errors.log',
        date('[Y-m-d H:i:s]') . " Error: " . $e->getMessage() . "\n",
        FILE_APPEND
    );
}

// Clear any buffered output
ob_end_clean();

// Send JSON response
echo json_encode($response);
exit;
?>
