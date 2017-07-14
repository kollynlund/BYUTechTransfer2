<?php
// cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];
 
  
 
// print results, insert id or affected row count
if ($method == 'POST') {
  // connect to the mysql database
  $link = mysqli_connect('tech-transfer.byu.edu', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
  $input = json_decode(file_get_contents('php://input'),true);
  mysqli_set_charset($link, 'utf8');
  
  mysqli_query($link, 'delete from categories;');

  // create SQL
  $sql = "insert into categories values ";
  foreach ($input["Categories"] as $category) {
    $sql = $sql . "('" . $category . "'),";
  }

  $sql = rtrim($sql, ",") . ";";
  echo '$sql' . $sql;

  // excecute SQL statement
  $result = mysqli_query($link, $sql);
  
  // die if SQL statement failed
  if (!$result) {
    http_response_code(404);
    echo mysqli_error($link);
    die(mysqli_error($link));
  }
  else {
    echo '{"success": true}';
  }

  // close mysql connection
  mysqli_close($link);
}
else {
  echo '{"error": "malformed request"}';
}
?>