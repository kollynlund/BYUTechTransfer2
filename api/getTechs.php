<?php
// cors
header("Access-Control-Allow-Origin: *");

// get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];
 
// connect to the mysql database
$link = mysqli_connect('tech-transfer.byu.edu', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
mysqli_set_charset($link, 'utf8');
 
// create SQL
$sql = "select * from techs;";
 
// excecute SQL statement
$result = mysqli_query($link, $sql);
 
// die if SQL statement failed
if (!$result) {
  http_response_code(404);
  die(mysqli_error());
}
 
// print results, insert id or affected row count
if ($method == 'GET') {
  echo '[';
  for ($i = 0; $i < mysqli_num_rows($result); $i++) {
    echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
  }
  echo ']';
}
 
// close mysql connection
mysqli_close($link);

?>