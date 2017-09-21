<?php
// cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");


function imageMatchesIdAndNumber($techId, $deleteNumber) {
  return function($imageFileName) use ($techId, $deleteNumber) {
    return strpos($imageFileName, $techId . '---' . $deleteNumber) > -1;
  };
}

function imageMatchesId($techId) {
  return function($imageFileName) use ($techId) {
    return strpos($imageFileName, $techId) > -1;
  };
}

function getImageNumberFromImageFileName($imageFileName) {
  $imageNumberWithExtension = substr($imageFileName, strpos($imageFileName, '---') + 3);
  $imageNumberString = substr($imageNumberWithExtension, 0, strpos($imageNumberWithExtension, '.'));
  return intval($imageNumberString);
}

function imageIsGreaterThanDeleteNumber($deleteNumber) {
  return function($imageFileName) use ($deleteNumber) {
    return getImageNumberFromImageFileName($imageFileName) > intval($deleteNumber);
  };
}


// request method and body
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
  $input = json_decode(file_get_contents('php://input'),true);

  $imagesToRemove = array_filter(scandir('./uploads'), imageMatchesIdAndNumber($input["ID"], $input["Image Number"]));
  foreach($imagesToRemove as $imageName) { unlink('./uploads/' . $imageName); }

  $imagesMatchingId = array_filter(scandir('./uploads'), imageMatchesId($input["ID"]));
  $imagesToChange = array_filter($imagesMatchingId, imageIsGreaterThanDeleteNumber($input["Image Number"]));
  foreach($imagesToChange as $imageFileName) {
    $currentImageNumber = getImageNumberFromImageFileName($imageFileName);
    $newImageFileName = str_replace('---' . $currentImageNumber, '---' . ($currentImageNumber - 1), $imageFileName);
    rename('./uploads/' . $imageFileName, './uploads/' . $newImageFileName);
  }


  // connect to the mysql database

  // $link = mysqli_connect('localhost', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
  // mysqli_set_charset($link,'utf8');
  //
  $link = mysqli_connect('tech-transfer.byu.edu', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
  mysqli_set_charset($link,'utf8');

  // create SQL
  $sql = "UPDATE techs SET `Total Photos` = `Total Photos` - 1 WHERE `ID` = '". $input["ID"] ."';";

  // excecute SQL statement
  $result = mysqli_query($link,$sql);

  // die if SQL statement failed
  if (!$result) {
    http_response_code(404);
    echo $sql;
    die(mysqli_error());
  }

  // close mysql connection
  mysqli_close($link);

  echo '{"success": true, "deletedImage": "' . $input["ID"] . '---' . $input["Image Number"] . '"}';
}
else {
  echo '{"error": "malformed request"}';
}
?>
