<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
$headers = apache_request_headers();

var_dump($_POST);

foreach($headers as $h => $v) {
	echo "$h: $v\n";
}


?>