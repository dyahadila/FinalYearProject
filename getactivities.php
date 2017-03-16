<?php
include 'dbconnect.php';
$userID = $_GET['userID'];
$query = "SELECT * FROM activityMonth where userID=".$userID;
$result = $dbcnx->query($query);
$num_results = $result->num_rows;
if($num_results > 0){
	while($row = mysqli_fetch_array($result)){
		$output[] = $row;
	}
	echo json_encode($output);
}
?>