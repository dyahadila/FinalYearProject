<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
$matcher = $data->matcher;
$userID = $data->userID;
$query = "SELECT * FROM activityMonth where activityFullDate LIKE'%".$matcher."%' AND userID=".$userID;
$result = $dbcnx->query($query);
$num_results = $result->num_rows;
if($num_results > 0){
	while($row = mysqli_fetch_array($result)){
		$output[] = $row;
	}
	echo json_encode($output);
} 
}
?>