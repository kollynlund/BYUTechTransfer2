<?php
require 'password_compat.php';
// cors
header("Access-Control-Allow-Origin: *");

// get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// connect to the mysql database
$link = mysqli_connect('tech-transfer.byu.edu', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
mysqli_set_charset($link, 'utf8');

// create SQL
$sql = "select * from users where username = '" . $input["username"] . "';";

// excecute SQL statement
$result = mysqli_query($link, $sql);
$hashedPassword = json_decode(json_encode(mysqli_fetch_object($result)), true)["password"];

if (password_verify($input["password"], $hashedPassword)) {
  echo '{"success": true}';
}
else {
  echo '{"success": false}';
}

// close mysql connection
mysqli_close($link);
?>