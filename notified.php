<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$notified = $data->notified;
	$taskId = $data->taskId;
    $query = "UPDATE activityWeek SET notified='".$notified."'WHERE taskId=".$taskId;
    $result = $dbcnx->query($query);
}
?>