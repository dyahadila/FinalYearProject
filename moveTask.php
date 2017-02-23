<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$taskId = $data->taskId;
	$hour = $data->hour;
	$day = $data->day;
    $query = "UPDATE activityWeek SET startTime='".$hour."', taskDate='".$day."', notified = 0 WHERE taskId=".$taskId;
    $result = $dbcnx->query($query);
    echo $result;
}
?>