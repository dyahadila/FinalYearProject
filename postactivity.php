<?php
include 'dbconnect.php';
$data = json_decode(file_get_contents("php://input"));
if(count($data) > 0){
	$activityname = $data->activityname;
	$activitytype = $data->activitytype;
	$fulldate = $data->date;
	$time = $data->time;
	$date = substr($fulldate,8,9);
    $monthyear = substr($fulldate,0,7);
    if(strcmp(substr($date,0,1), '0') == 0){
        $date = substr($date,1);
    }
    $query = "INSERT INTO activityMonth VALUES ('', '".$activityname."', '".$activitytype."', '".$fulldate."', '".$date."', '".$monthyear."', '".$time."')";
    $result = $dbcnx->query($query);
}
?>