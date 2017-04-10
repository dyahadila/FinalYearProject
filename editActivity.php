<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
	$activityname = $data->activityname;
	$activitytype = $data->activitytype;
	$time = $data->time;
	$userID = $data->userID;
    $query = "UPDATE activityMonth
    SET activityName='".$activityname."', activityType='".$activitytype."', activityTime='".$time."'
    WHERE activityID=".$userID;
    $result = $dbcnx->query($query);
?>