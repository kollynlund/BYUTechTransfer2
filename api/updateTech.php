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
  $sql = "UPDATE techs SET ";
  $sql .= '`ID` = "'. str_replace('"', '\"', $input["ID"]) .'",';
  $sql .= '`Name` = "'. str_replace('"', '\"', $input["Name"]) .'",';
  $sql .= '`PI` = "'. str_replace('"', '\"', $input["PI"]) .'",';
  $sql .= '`Contact Name` = "'. str_replace('"', '\"', $input["Contact Name"]) .'",';
  $sql .= '`Contact Email` = "'. str_replace('"', '\"', $input["Contact Email"]) .'",';
  $sql .= '`Contact Phone` = "'. str_replace('"', '\"', $input["Contact Phone"]) .'",';
  $sql .= '`Media 1` = "'. str_replace('"', '\"', $input["Media 1"]) .'",';
  $sql .= '`Media 2` = "'. str_replace('"', '\"', $input["Media 2"]) .'",';
  $sql .= '`Media 3` = "'. str_replace('"', '\"', $input["Media 3"]) .'",';
  $sql .= '`Media 4` = "'. str_replace('"', '\"', $input["Media 4"]) .'",';
  $sql .= '`Tags` = "'. str_replace('"', '\"', $input["Tags"]) .'",';
  $sql .= '`Categories` = "'. str_replace('"', '\"', $input["Categories"]) .'",';
  $sql .= '`Links` = "'. str_replace('"', '\"', $input["Links"]) .'",';
  $sql .= '`Short Description` = "'. str_replace('"', '\"', $input["Short Description"]) .'",';
  $sql .= '`Long Description` = "'. str_replace('"', '\"', $input["Long Description"]) .'",';
  $sql .= '`About the Market` = "'. str_replace('"', '\"', $input["About the Market"]) .'",';
  $sql .= '`Videos` = "'. str_replace('"', '\"', $input["Videos"]) .'"';
  $sql .= " WHERE `ID` = '". $input["Old ID"] ."';";

  // // excecute SQL statement
  $result = mysqli_query($link,$sql);

  // // die if SQL statement failed
  if (!$result) {
    http_response_code(404);
    echo mysqli_error($link);
    die(mysqli_error($link));
  }

  // close mysql connection
  mysqli_close($link);

  echo '{"success": true}';
}
else {
  echo '{"error": "malformed request"}';
}
?>
