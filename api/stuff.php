<?php
require 'password_compat.php';
$input = json_decode(file_get_contents('php://input'), true)["password"];
echo password_hash($input, PASSWORD_BCRYPT);
// echo password_hash(json_decode(json_encode(mysqli_fetch_object($result)), true)["password"]);
?>