<?php
// cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// print results, insert id or affected row count
if ($method == 'GET') {
  // connect to the mysql database
  $link = mysqli_connect('tech-transfer.byu.edu', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
  //$input = json_decode(file_get_contents('php://input'),true);

  mysqli_set_charset($link, 'utf8');

  //mysqli_query($link, 'delete from categories;');

  $token = md5(time());
  //$token = "cool";

  // create SQL
  $sql = "UPDATE users SET users.reset_token='$token'";

  $sql = $sql . ";";
  //echo '$sql' . $sql;

  // excecute SQL statement
  $result = mysqli_query($link, $sql);

  // die if SQL statement failed
  if (!$result) {
    http_response_code(404);
    echo mysqli_error($link);
    die(mysqli_error($link));
  }
  else {

    $body = <<<EOS
        Hello,

        Someone has requested a password reset for your account. If you wish to set a new password,
        use the link below. Otherwise, do nothing and your password will remain unchanged.

        http://techtransfer.byu.edu/#/reset?reset_token=$token

EOS;
      mail("kollyn.lund@gmail.com", "Tech Transfer Password Reset", $body);

    echo '{"success": true}';
  }

  // close mysql connection
  mysqli_close($link);
}
else {
  echo '{"error": "malformed request"}';
}
?>
