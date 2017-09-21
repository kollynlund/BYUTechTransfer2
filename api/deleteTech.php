<?php
// cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");


function imageMatchesId($techId) {
  return function($imageFileName) use ($techId) {
    return (strpos($imageFileName, $techId . "---") === 0);
  };
}
// request method and body
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'),true);

if ($method == 'POST') {
  // connect to the mysql database

  // $images = scandir('./uploads');
  // $imagesToRemove = array_filter($images, imageMatchesId($input["id"]));
  //
  // echo "delete[".count($imagesToRemove)."]\n";
  // for($i = 0; $i < count($imagesToRemove); $i++) {
  //   echo "Deleting image ".$i.": ["."./uploads/".$imagesToRemove[$i]."]";
  //   unlink("./uploads/".$imagesToRemove[$i]);
  // }

  $link = mysqli_connect('tech-transfer.byu.edu', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
  mysqli_set_charset($link,'utf8');

  // // create SQL
  $sql = "DELETE FROM techs WHERE `ID` = \"". $input["id"] ."test\";";

  // // excecute SQL statement
  $result = mysqli_query($link,$sql);

  // // die if SQL statement failed
  if (!$result) {
    http_response_code(404);
    die(mysqli_error());
  }

  // close mysql connection
  mysqli_close($link);
}
else {
  echo '{"error": "malformed request"}';
}
?>
