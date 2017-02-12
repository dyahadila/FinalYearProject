<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$activityname = $data->activityname;
	$activitytype = $data->activitytype;
	$fulldate = $data->date;
	$time = $data->time;
	$userID = $data->userID;
	$matcher = $data->matcher;
    $query = "INSERT INTO activityMonth VALUES ('', '".$activityname."', '".$activitytype."', '".$fulldate."', '".$time."',".$userID.")";
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