<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$activityID = $data->activityID;
	$date = $data->date;
    $query = "UPDATE activityMonth SET activityFullDate='".$date."' WHERE activityID=".$activityID;
    $result = $dbcnx->query($query);
    echo $result;
}
?>