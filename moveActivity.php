<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$activityID = $data->activityID;
	$date = $data->date;
	$day = $data->day;
    $query = "UPDATE activityMonth SET activityDate='".$day."', activityFullDate='".$date."' WHERE activityID=".$activityID;
    $result = $dbcnx->query($query);
    echo $result;
}
?>