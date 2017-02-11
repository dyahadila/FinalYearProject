<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
$activityID = $data->activityID;
$query = "DELETE FROM activityMonth WHERE activityID='".$activityID."' LIMIT 1";
$result = $dbcnx->query($query);
    $num_results = $result->num_rows;
if($num_results > 0){
	while($row = mysqli_fetch_array($result)){
		$output[] = $row;
	}
	echo json_encode($output);
} 
?>