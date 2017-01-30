<?php
include 'dbconnect.php';
$matcher = $_GET['matcher'];
$query = "SELECT * FROM activityMonth where activityMonthYear='".$matcher."'";
$result = $dbcnx->query($query);
$num_results = $result->num_rows;
if($num_results > 0){
	while($row = mysqli_fetch_array($result)){
		$output[] = $row;
	}
	echo json_encode($output);
} 
?>