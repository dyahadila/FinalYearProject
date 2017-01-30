<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"),true);
$momentClicked = $data['momentClicked'];
$query = "SELECT * FROM activityMonth where activityFullDate='".$momentClicked."'";
$result = $dbcnx->query($query);
$num_results = $result->num_rows;
if($num_results > 0){
	while($row = mysqli_fetch_array($result)){
		$output[] = $row;
	}
	echo json_encode($output);
} 
?>