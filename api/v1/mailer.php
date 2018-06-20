<?php

if (isset($_POST)) {

  $to = "info@collegefalafel.com";
  $subject = "Request: ".$_POST['type'];

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
  <p>".$_POST['details']."</p>
  </body>
  </html>
  ";

  // Always set content-type when sending HTML email
  $headers = "MIME-Version: 1.0" . "\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

  // More headers
  $headers .= 'From: '.$_POST['email']. "\r\n";

}

?>
<!DOCTYPE html>
<html>
<head>
  <title>Redirecting...</title>
</head>
<body>
<?php
  $result = mail($to,$subject,$message,$headers);
  if (!$result) {
?>
  <h3 class="text-center">There was an error sending your request! Redirecting...</h3>
<?php
  } else {
?>
  <h3 class="text-center">Your request was sent successfully! Redirecting...</h3>
<?php
  }
?>
<a style="text-align: center;" href="/home">Click here if the page does not redirect within a few seconds.</a>

<script type="text/javascript">
  setTimeout(function(){
    window.location = "http://apps.phrakture.com/cfstaging/";
  }, 7000);
</script>
</body>
</html>