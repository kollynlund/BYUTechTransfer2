<?php
require 'password_compat.php';
// cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// print results, insert id or affected row count
if ($method == 'POST') {
  // connect to the mysql database
  $link = mysqli_connect('tech-transfer.byu.edu', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');

  mysqli_set_charset($link, 'utf8');

  $input = json_decode(file_get_contents('php://input'),true);
  $token = $input["token"];
  $password = $input["password"];

  $sql = "select reset_token from users where users.username='techtransfer';";
  $result = mysqli_query($link, $sql);
  $realToken_array = $result->fetch_assoc();
  $realToken = $realToken_array["reset_token"];

  if($realToken != "" && $realToken == $token) {

    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $sql = "UPDATE users SET users.password='$hashed', users.reset_token='' WHERE users.username='techtransfer';";
    $result = mysqli_query($link, $sql);

    if (!$result) {
      http_response_code(404);
      echo mysqli_error($link);
      die(mysqli_error($link) . "\n$sql");
    }
    else {
      echo '{"success": true}';
    }
  }
  else {
    echo '{"error": "invalid password token"}';
  }

  // close mysql connection
  mysqli_close($link);
}
else {
  echo '{"error": "malformed request"}';
}
?>
