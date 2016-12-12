<!DOCTYPE html>
<html lang="en">

<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
 <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
 <link rel=stylesheet href="https://s3-us-west-2.amazonaws.com/colors-css/2.2.0/colors.min.css">

<script src="http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-2.0.2.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-moment/0.10.3/angular-moment.min.js"></script>

 <link rel="stylesheet" type="text/css" href="style.css">
 <script type="text/javascript" src="app.js"></script>

<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet">


<body ng-app="app" ng-controller="mainCtrl">
<div class="header">
	{{ printedMonth }} &nbsp
	<button type="button" class="btn btn-default" ng-click="previousMonth()"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>
	<button type="button" class="btn btn-default" ng-click="nextMonth()"><i class="fa fa-chevron-right" aria-hidden="true" ></i></button>
</div>
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <ul class="nav navbar-nav">
      <li><a href="calendar.php">Monthly Planner</a></li>
      <li><a href="#">Weekly Planner</a></li>
    </ul>
  </div>
</nav>
<table class="table table-bordered">
		<thead>
			<tr>
				<th id="acadWeekHeader">{{semester}}</th>
				<th id="daysHeader" ng-repeat="day in daysInWeek">
					{{ day }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr class="days" ng-repeat="week in daysArray">
				<td id="acadWeek">{{weeksArray[$index]}}</td>
				<td ng-repeat="day in week track by $index" ng-class="{'greyOut':isString(day), 'highlight':isNumber(day)}" ng-click="check(day)">
					{{day}}
				</td>
			</tr>
		</tbody>
</table>

<script type="text/ng-template" id="myModalContent.html">
        <div class="modal-header">
            <h3>List of Activities</h3>
        </div>
        <?php
        include 'dbconnect.php';
            if(isset($_POST['saveActivity'])){
            	$activityname = $_POST['activityName'];
            	$activitytype = $_POST['activityType'];
            	$fulldate = $_POST['date'];
            	$date = substr($fulldate,8,9);
            	$monthyear = substr($fulldate,0,7);
            	if(strcmp(substr($date,0,1), '0') == 0){
            		$date = substr($date,1);
            	}
            	$time = $_POST['time'];
            	$query = "INSERT INTO activityMonth VALUES ('', '".$activityname."', '".$activitytype."', '".$fulldate."', '".$date."', '".$monthyear."', '".$time."')";
            	$result = $dbcnx->query($query);
            	header("Location:calendar.php");
            } else{
        ?>
        <div class="modal-body">
        <?php
        	$postdata = file_get_contents("php://input");
		    $request = json_decode($postdata);
		    var_dump($postdata);
		    var_dump($_POST);
            $query2 = "SELECT * FROM activityMonth";
            $result2 = $dbcnx->query($query2);
			$num_results = $result2->num_rows;
			if($num_results > 0){
				$j = 0;
				?>
        <ul class="list-group">
            <?php
				while($j<$num_results){
					$row = $result2->fetch_assoc();
					if ($row['activityType'] == 'Quiz') {	
				?>
				<li class="list-group-item list-group-item-warning">
				<span class="activityname">
					<?php
					echo $row['activityName'];
					?>
				</span><br>
				<span class="datetime">
					<?php
					echo $row['activityTime'];
					?>
				</span>
				</li>
				<?php
					} else if($row['activityType'] == 'Assignment Deadline'){
				?>
				<li class="list-group-item list-group-item-danger">
				<span class="activityname">
					<?php
					echo $row['activityName'];
					?>
				</span><br>
				<span class="datetime">
					<?php
					echo $row['activityTime'];
					?>
				</span>
				</li>
				<?php
					} else if($row['activityType'] == 'CCA Activity'){
				?>
				<li class="list-group-item list-group-item-info">
				<span class="activityname">
					<?php
					echo $row['activityName'];
					?>
				</span><br>
				<span class="datetime">
					<?php
					echo $row['activityTime'];
					?>
				</span>
				</li>
				<?php
					} else if($row['activityType'] == 'Appoinment with Friends or Family'){		
				?>
				<li class="list-group-item list-group-item-success">
				<span class="activityname">
					<?php
					echo $row['activityName'];
					?>
				</span><br>
				<span class="datetime">
					<?php
					echo $row['activityTime'];
					?>
				</span>
				</li>
				<?php
					}
					$j++;
				}
			}
			?>
            </ul>
            <?php

        	}
			?>
        	<form ng-show="addActivity" method="post" action="calendar.php">
        		  <div class="form-group">
				      <label for="activityname">Activity name:</label>
				      <input type="text" class="form-control" data-ng-model="activityname" name="activityName" id="activityName" placeholder="Enter Activity Name">
			      </div>
			      <div class="form-group">
				      <label for="sel1">Select activity type:</label>
				      <select class="form-control" id="sel1" data-ng-model="activitytype" name="activityType">
				        <option>Quiz</option>
				        <option>Assignment Deadline</option>
				        <option>CCA Activity</option>
				        <option>Appoinment with Friends or Family</option>
				      </select>
			      </div>
          		  <div class="form-group">
				      <label for="date">Date:</label>
				      <input type="text" class="form-control" id="date" data-ng-model="momentClicked" name="date">
			      </div>
			      <div class="form-group">
			      	  <label for="time">Time:</label>
			      	  <div class="input-group bootstrap-timepicker timepicker">
	            		  <input id="timepicker1" type="text" class="form-control input-small" data-ng-model="hour" name="time">
	            		  <span class="input-group-addon" >
	            		  	<i class="glyphicon glyphicon-time" popover-placement="right" uib-popover-template="'popover.html'"></i>
	            		  </span>
       				  </div>
		          </div>

			      <input type="submit" class="btn btn-default" ng-click="saveActivity()" value="Save Activity!" name="saveActivity">	
            </form>
            <a href="#" ng-click="addActivity = !addActivity" class="btn btn-link">Add Activity <i class="fa fa-plus" aria-hidden="true" ng-show="!addActivity"></i><i class="fa fa-minus" aria-hidden="true" ng-show="addActivity"></i></a>
      </div>
        <div class="modal-footer">
            <button class="btn btn-primary" ng-click="ok()">OK</button>
            <button class="btn btn-warning" ng-click="cancel()">Cancel</button>
        </div>

<script type="text/ng-template" id="popover.html">
	<div class="timepicker" uib-timepicker data-ng-model="$parent.mytime" ng-change="changed()" hour-step="hstep" minute-step="mstep" show-meridian="ismeridian"></div>
</script>

</script>


</body>

</html>