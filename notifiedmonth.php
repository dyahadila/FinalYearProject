<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$notified = $data->notified;
	$activityID = $data->activityID;
    $query = "UPDATE activityMonth SET notified='".$notified."'WHERE activityID=".$activityID;
    $result = $dbcnx->query($query);
}
?>