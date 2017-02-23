<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$taskname = $data->taskname;
	$tasktype = $data->tasktype;
	$taskdate = $data->taskdate;
	$time = $data->starttime;
	$duration = $data->duration;
	$userID = $data->userID;
    $query = "INSERT INTO activityWeek VALUES ('', '".$taskname."', '".$tasktype."', '".$time."', ".$duration.", '".$taskdate."',0,0,".$userID.")";
    $result = $dbcnx->query($query);
    echo $result;
}
?>