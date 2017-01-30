<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
$taskId = $data->taskId;
$query = "DELETE FROM activityWeek WHERE taskId='".$taskId."' LIMIT 1";
$result = $dbcnx->query($query);
echo $result;
?>