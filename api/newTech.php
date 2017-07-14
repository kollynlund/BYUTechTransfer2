<?php
// cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// request method and body
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'),true);

if ($method == 'POST') {
  // connect to the mysql database
  $link = mysqli_connect('localhost', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
  mysqli_set_charset($link,'utf8');

  // // create SQL
  $sql = "INSERT INTO techs VALUES (";
  $sql .= '"'. str_replace('"', '\"', $input["ID"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Name"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["PI"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Contact Name"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Contact Email"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Contact Phone"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Media 1"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Media 2"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Media 3"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Media 4"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Tags"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Categories"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Links"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Short Description"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["Long Description"]) .'",';
  $sql .= '"'. str_replace('"', '\"', $input["About the Market"]) .'"';
  $sql .= ");";

  // // excecute SQL statement
  $result = mysqli_query($link,$sql);

  // // die if SQL statement failed
  if (!$result) {
    http_response_code(404);
    die(mysqli_error());
  }

  // close mysql connection
  mysqli_close($link);

  echo '{"success": true}';
}
else {
  echo '{"error": "malformed request"}';
}
?>