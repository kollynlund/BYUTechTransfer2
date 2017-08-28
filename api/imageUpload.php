<?php
// cors
header("Access-Control-Allow-Origin: *");

// connect to the mysql database
$link = mysqli_connect('localhost', 'techtrb5_php', 'BlueHost3760#', 'techtrb5_techs');
mysqli_set_charset($link,'utf8');

foreach ($_FILES as $fileName => $fileObject) {
	move_uploaded_file($_FILES[$fileName]["tmp_name"], "uploads/" . $_FILES[$fileName]["name"]);

	// create SQL
	$techID = preg_replace('/\.[^\.]+$/', '', $_FILES[$fileName]["name"]);
	$sql = "UPDATE techs SET `Total Photos` = `Total Photos` + 1 WHERE `ID` = '" . $techID . "';";

	// excecute SQL statement
	$result = mysqli_query($link,$sql);

	// die if SQL statement failed
	if (!$result) {
		http_response_code(404);
		echo mysqli_error($link);
		die(mysqli_error($link));
		break;
	}
}

// close mysql connection
mysqli_close($link);
?>