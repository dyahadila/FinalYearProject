<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$activityID = $data->activityID;
	$date = $data->date;
	$hour = $data->hour;
    $query = "UPDATE activityMonth SET activityFullDate='".$date."', activityTime='".$hour."' WHERE activityID=".$activityID;
    $result = $dbcnx->query($query);
    echo $result;
}
?>