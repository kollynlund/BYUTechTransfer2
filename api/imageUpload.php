<?php
foreach ($_FILES as $fileName => $fileObject) {
	move_uploaded_file($_FILES[$fileName]["tmp_name"], "uploads/" .  basename($_FILES[$fileName]["name"]));
}
?>