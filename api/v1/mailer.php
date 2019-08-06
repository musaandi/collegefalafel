<?php

$_POST = json_decode(file_get_contents('php://input'), true);

$to = "info@collegefalafel.com";
$subject = "Request: ".$_POST['type'];

$details_list = explode("####", $_POST['details']);

$message = "
<html>
<head>
<title>Collegefalafel Mail</title>
</head>
<body>
<p>You have received a ".$_POST['type']." request from the following:</p>
<table>
<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
</tr>
<tr>
<td>".$_POST['name']."</td>
<td>".$_POST['email']."</td>
<td>".$_POST['phone']."</td>
</tr>
</table>
<p>Order ID: ".$_POST['orderId']."</p>
<p>Time of submission: ".$_POST['timestamp']."</p>
<p>Subtotal: $".$_POST['subtotal']."</p>
<p>HST (13%): $".$_POST['tax']."</p>
<p>Total: $".$_POST['total']."</p>
<p>Order Details:</p>
";

foreach ($details_list as &$value) {
  $message .= "<p>" . $value . "</p>";
}

$message .= "
<p>Special Request(s):</p>
<p>".$_POST['specialRequest']."</p>
</body>
</html>
";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: '.$_POST['email']. "\r\n";

$result = mail($to,$subject,$message,$headers);

// Confirmation Email
$to = $_POST['email'];
$subject = "Catering Request Confirmation";

$message = "
<html>
<head>
<title>Collegefalafel Mail</title>
</head>
<body>
<p>Your catering request with the following information has been submitted to College Falafel. Thank you for your submission, a representative from College Falafel will followup with you soon.</p>
<table>
<tr>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
</tr>
<tr>
<td>".$_POST['name']."</td>
<td>".$_POST['email']."</td>
<td>".$_POST['phone']."</td>
</tr>
</table>
<p>Order ID: ".$_POST['orderId']."</p>
<p>Time of submission: ".$_POST['timestamp']."</p>
<p>Subtotal: $".$_POST['subtotal']."</p>
<p>HST (13%): $".$_POST['tax']."</p>
<p>Total: $".$_POST['total']."</p>
<p>Order Details:</p>
";

foreach ($details_list as &$value) {
  $message .= "<p>" . $value . "</p>";
}

$message .= "
<p>Special Request(s):</p>
<p>".$_POST['specialRequest']."</p>
</body>
</html>
";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: info@collegefalafel.com' . "\r\n";

$confirmation = mail($to,$subject,$message,$headers);

if (!$result && !$confirmation) {
  echo "Catering request was not sent successfully";
} else {
  echo "Catering request sent successfully";
}

?>