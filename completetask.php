<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$checkedbol = $data->checkedbol;
	$taskId = $data->taskId;
    $query = "UPDATE activityWeek SET done='".$checkedbol."'WHERE taskId=".$taskId;
    $result = $dbcnx->query($query);
}
?>