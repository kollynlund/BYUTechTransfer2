<?php
// cors
header("Access-Control-Allow-Origin: *");

foreach ($_FILES as $fileName => $fileObject) {
	move_uploaded_file($_FILES[$fileName]["tmp_name"], "uploads/" . $_FILES[$fileName]["name"]);
}
?>