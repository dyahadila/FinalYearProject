<?php
include 'dbconnect.php';
$days = $_GET['days'];
$userID = $_GET['userID'];
$query = "SELECT * FROM activityWeek where userID=".$userID." AND taskDate in('".$days[0]."','".$days[1]."','".$days[2]."','".$days[3]."','".$days[4]."','".$days[5]."','".$days[6]."')";
$result = $dbcnx->query($query);
$num_results = $result->num_rows;
if($num_results > 0){
	while($row = mysqli_fetch_array($result)){
		$output[] = $row;
	}
	echo json_encode($output);
} 
?>