<?php
// Simple test to check if PHP mail function is working
echo "<h2>PHP Mail Function Test</h2>";

// Check if mail function exists
if (function_exists('mail')) {
    echo "<p style='color: green;'>✅ PHP mail() function is available</p>";
    
    // Test email configuration
    $to = 'creativedigitalwork73@gmail.com';
    $subject = 'Test Email from Portfolio Website';
    $message = 'This is a test email to verify that the mail function is working properly.';
    $headers = 'From: test@portfolio.com' . "\r\n" .
               'Reply-To: test@portfolio.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();
    
    // Try to send test email
    $result = mail($to, $subject, $message, $headers);
    
    if ($result) {
        echo "<p style='color: green;'>✅ Test email sent successfully!</p>";
        echo "<p>Check your email: <strong>$to</strong></p>";
    } else {
        echo "<p style='color: red;'>❌ Failed to send test email</p>";
        echo "<p>This might be due to server configuration. Check with your hosting provider.</p>";
    }
    
} else {
    echo "<p style='color: red;'>❌ PHP mail() function is not available</p>";
}

// Display server information
echo "<h3>Server Information:</h3>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p><strong>Operating System:</strong> " . php_uname() . "</p>";

// Check if we can write to files (for logging)
if (is_writable('.')) {
    echo "<p style='color: green;'>✅ Directory is writable (can create log files)</p>";
} else {
    echo "<p style='color: orange;'>⚠️ Directory is not writable (cannot create log files)</p>";
}
?>
