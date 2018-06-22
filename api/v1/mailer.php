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

// More headers
$headers .= 'From: '.$_POST['email']. "\r\n";

$result = mail($to,$subject,$message,$headers);

if (!$result) {
  echo "Catering request was not sent successfully";
} else {
  echo "Catering request sent successfully";
}

?>