<?php 

if (isset($_GET["id"])) {
    $technology_id = $_GET["id"];
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try{
    include_once('inc/phpmailer/class.phpmailer.php');
    require_once('inc/phpmailer/class.smtp.php');


    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $message = trim($_POST["message"]);


    if ($name == "" OR $email == "" OR $message == "") {
        throw new Exception("You must specify a value for name, email address, and message.");
    }

    foreach( $_POST as $value ){
        if( stripos($value,'Content-Type:') !== FALSE ){
        throw new Exception("There was a problem with the information you entered.");    
        }
    }

    if ($_POST["address"] != "") {
        throw new Exception("Your form submission has an error.");
    }

    require_once("inc/phpmailer/class.phpmailer.php");
    $mail = new PHPMailer();

    if (!$mail->ValidateAddress($email)){
        throw new Exception("You must specify a valid email address.");
    }

    $email_body = "";
    $email_body = $email_body . "Name: " . $name . "<br>";
    $email_body = $email_body . "Email: " . $email . "<br>";
    $email_body = $email_body . "Message: " . $message;


    $mail->Host = 'localhost';
    $mail->SetFrom($email, $name);
    $address = "paskclothing@gmail.com";
    $mail->AddAddress($address, "Technology request");
    $mail->Subject    = "Request about technology ". $technology_id . "by" . $name;
    $mail->MsgHTML($email_body);

    if(!$mail->Send()) {
      throw new Exception("There was a problem sending the email: " . $mail->ErrorInfo);
    }

    header("Location: contact.php?status=thanks");
    exit;
} catch (Exception $e) {
    $message = $e->getMessage();
}
}
?>