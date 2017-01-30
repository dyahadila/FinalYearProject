<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input");
$activityID = $data->activityID;
$query = "DELETE FROM activityMonth WHERE activityID='".$activityID."' LIMIT 1";
$result = $dbcnx->query($query);
echo $result;
?>