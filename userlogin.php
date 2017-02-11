<?php
session_start() ;
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$username = $data->username;
    $password = $data->password;
    $query = "SELECT * FROM users WHERE username='".$username."'AND password='".$password."'";
    $result = $dbcnx->query($query);
    if($result->num_rows>0){
		$row=$result->fetch_assoc();
		$_SESSION['uid'] = $row['userID'];
		print $_SESSION['uid'];
	}
}
?>