angular.module('app').controller('weeklyCtrl', function($scope, $interval, $uibModal, moment, $http, mainFactory, loginFactory, sessionService, Notification){

$scope.tasks = [];
$scope.activitiesmonth = [];

$scope.logout = function(){
	loginFactory.logout();
}
$scope.isCurrentDay = function(day){
	var currentDay = moment().format('DD MMM YYYY');
	if(day == currentDay){
		return true;
	} else{
		return false;
	}
}

$interval(function(){ 
	 for(var i = 0; i<$scope.tasks.length; i++){
	 	if(moment($scope.tasks[i].taskDate + " " + $scope.tasks[i].startTime, "DD MMM YYYY HH:mm A").subtract(30, 'minute').isSameOrBefore(moment()) && 
	 		moment().isBefore(moment($scope.tasks[i].taskDate + " " + $scope.tasks[i].startTime, "DD MMM YYYY HH:mm A")) && 
	 		$scope.tasks[i].notified == 0){
	 		var msg = "You have upcoming " + $scope.tasks[i].taskName + " on " + $scope.tasks[i].taskDate + " at " + $scope.tasks[i].startTime +"!";
	 		var notified = true;
	 		$scope.showNotif(msg);
	 		$http({
				method: 'POST',
				url:  'notified.php',
		        data: {
		        		taskId : $scope.tasks[i].taskId,
				        notified : notified
				      }
				}).then(function (data) {
					$scope.getTasks();
			});
	 	}
	 }
	 	}, 5000);
$interval(function(){ 
	 for(var i = 0; i<$scope.activitiesmonth.length; i++){
	 	if(moment($scope.activitiesmonth[i].activityFullDate + " " + $scope.activitiesmonth[i].activityTime, "YYYY-MM-DD HH:mm A").subtract(30, 'minute').isSameOrBefore(moment()) && 
	 		moment().isBefore(moment($scope.activitiesmonth[i].activityFullDate + " " + $scope.activitiesmonth[i].activityTime, "YYYY-MM-DD HH:mm A")) && 
	 		$scope.activitiesmonth[i].notified == 0){
	 		var msg = "You have upcoming " + $scope.activitiesmonth[i].activityName + " on " + $scope.activitiesmonth[i].activityFullDate + " at " + $scope.activitiesmonth[i].activityTime +"!";
	 		var notified = true;
	 		$scope.showNotif(msg);
	 		$http({
				method: 'POST',
				url:  'notifiedmonth.php',
		        data: {
		        		activityID : $scope.activitiesmonth[i].activityID,
				        notified : notified
				      }
				}).then(function (data) {
					$scope.getActivityMonth();
			});
	 	}
	 }
	 	}, 5000);

$scope.showNotif = function(msg){
	Notification({message: msg});
}
$scope.isNight = function(hour){
	var length = hour.length;
	if(hour.toString().substring(length-2,length) == 'AM'){
		var index = hour.toString().indexOf(' AM');
		if(hour.substring(0,index)==="12:30" || hour.substring(0,index)==="1:00" || hour.substring(0,index)==="1:30" ||
			hour.substring(0,index)==="2:00" || hour.substring(0,index)==="2:30" || hour.substring(0,index)==="3:00" ||
			hour.substring(0,index)==="3:30" || hour.substring(0,index)==="4:00" || hour.substring(0,index)==="4:30" ||
			hour.substring(0,index)==="5:00" || hour.substring(0,index)==="5:30" || hour.substring(0,index)==="6:30" ||
			hour.substring(0,index)==="6:00" || hour.substring(0,index)==="12:00" ){
			return true;
		}
	} else if(hour.toString().substring(length-2,length) == 'PM'){
		var index = hour.toString().indexOf(' PM');
		if(hour.substring(0,index)==="11:30" || hour.substring(0,index)==="11:00"){
			return true;
		}
	}
}
$scope.initFirst=function(){
	$scope.thisWeek = moment();
	$scope.currentMoment;
	if(sessionService.get('currentWeek')){
		$scope.currentMoment = moment(sessionService.get('currentWeek'));
	} else{
		sessionService.set('currentWeek', $scope.thisWeek);
		$scope.currentMoment = moment(sessionService.get('currentWeek'));
	}
	$scope.daysInWeek = ['Mon', 'Tue', 'Wed','Thu', 'Fri', 'Sat', 'Sun'];
	
	var dayInWeek = $scope.currentMoment.day();
	$scope.daysArray = getDaysArray(dayInWeek, $scope.currentMoment);
	var weekInYear = moment($scope.daysArray[$scope.daysArray.length-2]).week();
	$scope.semester = mainFactory.semester(weekInYear);
	$scope.ntuWeek = mainFactory.ntuWeek(weekInYear, $scope.currentMoment);
	$scope.hours = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
	'4:30 PM', '5:00 PM', '5:30 PM','6:00 PM', '6:30 PM','7:00 PM', '7:30 PM','8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
	'10:00 PM', '10:30 PM','11:00 PM','11:30 PM', '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
	'3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM',
	 '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
	 $scope.getTasks();
	 $scope.getActivityMonth();
}
$scope.editActivity = function(e){
	e.stopPropagation();
	var modalInstance = $uibModal.open({
		templateUrl: 'editActivity.html',
	    controller: editActivityCtrl,
	    scope: $scope
	});
}
var editActivityCtrl = function($scope, $uibModalInstance, $http){
	
}
$scope.popover = {
	templateUrl : 'popoverTemplate.html'
}
$scope.checked = {};
$scope.disable = function(event, taskId, done){
	event.stopPropagation();
	if(done == 0){
		$scope.checked[taskId] = false;
	} else if(done == 1){
		$scope.checked[taskId] = true;
	}
}
$scope.handleDrop = function(item, bin){
	var Id = item.toString();
	var hourday = bin.toString();
	var index;
	if(hourday.indexOf("AM") !== -1){
		index = hourday.indexOf("AM");
	} else if(hourday.indexOf("PM") !== -1){
		index = hourday.indexOf("PM");
	}
	var day = hourday.substring(index+2);
	var hour = hourday.substring(0,index+2);
	if(Id.indexOf("_task") != -1){
		var taskId = item.toString().substring(0, item.toString().indexOf("_task"));
		$http({
			method: 'POST',
			url:  'moveTask.php',
		    data: {
		        taskId : taskId,
				hour : hour,
				day : day
			}
		}).then(function(data){
			$scope.getTasks();
		});
	} else {
		var activityId = item.toString().substring(0, item.toString().indexOf("_activity"));
		var activityFullDate = moment(day).format("YYYY-MM-DD").toString();
		$http({
			method: 'POST',
			url:  'moveActivityWeek.php',
		    data: {
		        activityID : activityId,
				hour : hour,
				date : activityFullDate
			}
		}).then(function(data){
			$scope.getActivityMonth();
		});
	}
}
$scope.deleteTask = function(taskId, e){
	e.stopPropagation();
	e.preventDefault();
	if(confirm("Are you sure you want to delete this activity?")==true){
		$http({
		method: 'POST',
		url:  'deleteTask.php',
		data: {
		    taskId : taskId
		}
		}).then(function(data){
			$scope.getTasks();
		});
	}
	
}
$scope.deleteActivity = function(activityId, e){
	e.stopPropagation();
	e.preventDefault();
	if(confirm("Are you sure you want to delete this activity?") == true){
		$http({
			method: 'POST',
			url:  'deleteActivity.php',
			data: {
			     activityID : activityId
			}
		}).then(function (data,status){
			$scope.getActivityMonth();
		});
	}
}
$scope.check = function(event, taskId){
	event.stopPropagation();
	$scope.checked[taskId] = !$scope.checked[taskId];
}
$scope.markcomplete = function(event, taskId){
	event.stopPropagation();
	$http({
		method: 'POST',
		url:  'completetask.php',
        data: {
        		taskId : taskId,
		        checkedbol : $scope.checked[taskId]
		      }
			}).then(function (data) {
				$scope.getTasks();
			});
}
$scope.getChecked = function(bol){
	if(bol == 1){
		return true;
	} else if(bol == 0){
		return false;
	}
}
var getDaysArray = function (dayInWeek, currentMoment){
	var daysArray = [];
	if(dayInWeek == 1){
		for(var i = 0; i<7; i++){
			daysArray.push(currentMoment.add(i, 'day').format('DD MMM YYYY'));
			currentMoment.subtract(i, 'day');
		}
		
	} else if(dayInWeek > 1){
		for(var i = dayInWeek; i > 0; i--){
			daysArray.push(currentMoment.subtract(i-1, 'day').format('DD MMM YYYY'));
			currentMoment.add(i-1, 'day')
		}
		for(var i = 1; i<=7-dayInWeek; i++){
			daysArray.push(currentMoment.add(i, 'day').format('DD MMM YYYY'));
			currentMoment.subtract(i, 'day')
		}
	} else if(dayInWeek == 0){
		for(var i = 6; i>0; i--){
			daysArray.push(currentMoment.subtract(i,'day').format('DD MMM YYYY'));
			currentMoment.add(i,'day');
		}
		daysArray.push(currentMoment.format('DD MMM YYYY'));
	}
	return daysArray;
}

$scope.getTasks = function(){
	var userID = sessionService.get('user');
	$http.get('gettasks.php', {
		params: {
			"days[]": $scope.daysArray,
			userID : userID
		}
	}).success(function (data,status) {
  	    $scope.tasks = data;
	});
}

$scope.nextWeek = function(){
	sessionService.set('currentWeek', $scope.currentMoment.add(1, 'week'));
	$scope.currentMoment = moment(sessionService.get('currentWeek'));
	var dayInWeek = $scope.currentMoment.day();
	var weekInYear;
	if(dayInWeek == 0){
		weekInYear = $scope.currentMoment.subtract(1, 'day').week();
	} else{
		weekInYear = $scope.currentMoment.week();
	}
	$scope.daysArray = getDaysArray(dayInWeek, $scope.currentMoment);
	$scope.semester = mainFactory.semester(weekInYear);
	$scope.ntuWeek = mainFactory.ntuWeek(weekInYear, $scope.currentMoment);
	$scope.getTasks();
}
$scope.getActivityMonth = function(){
	var userID = sessionService.get('user');
	$http.get('getactivities.php', {
		params: {
			userID : userID
		}
	}).success(function (data,status) {
  	    $scope.activitiesmonth = data;
	});
}
$scope.prevWeek = function(){
	sessionService.set('currentWeek', $scope.currentMoment.subtract(1, 'week'));
	$scope.currentMoment = moment(sessionService.get('currentWeek'));
	var dayInWeek = $scope.currentMoment.day();
	var weekInYear;
	if(dayInWeek == 0){
		weekInYear = $scope.currentMoment.subtract(1, 'day').week();
	} else{
		weekInYear = $scope.currentMoment.week();
	}
	$scope.daysArray = getDaysArray(dayInWeek, $scope.currentMoment);
	$scope.semester = mainFactory.semester(weekInYear);
	$scope.ntuWeek = mainFactory.ntuWeek(weekInYear, $scope.currentMoment);
	$scope.getTasks();
}
$scope.convert = function(date, time){
	$scope.originalDate = moment(new Date(date)).format('DD MMM YYYY');
	$scope.taskdate = moment(new Date(date)).format('YYYY-MM-DD');
	$scope.dateToInput = date;
	for(var i = 0; i<time.length; i++){
		if(time.charAt(i) == ' '){
			var index = i;
			break;
		}
	}
	if(time.indexOf(":") !== -1){
		$scope.starttime = time.toString();
	}
	else{
		$scope.starttime = time.substring(0, index) + ':00 ' + time.substring(index+1, time.length);
	}
		$scope.showModal();
	
}
$scope.showModal = function(){
	var modalInstance = $uibModal.open({
		templateUrl: 'weeklyModal.html',
	    controller: weeklyModalCtrl,
	    scope: $scope
	});
}

var weeklyModalCtrl = function ($scope, $uibModalInstance, $http){
	$scope.type = {
		name : 'normal'
	};
	$scope.duration = 0.5;
	$scope.durationDisplay = $scope.duration.toString() + " hour";
	var momentDummy = moment($scope.taskdate + 'T' + $scope.starttime, 'HH:mm A');
	$scope.cancel = function(){
		$uibModalInstance.close();
	}
	$scope.addDuration = function(){
		$scope.duration = $scope.duration + 0.5;
		$scope.durationDisplay = $scope.duration.toString() + " hour";
	};
	$scope.subDuration = function(){
		if($scope.duration > 0){
			$scope.duration = $scope.duration - 0.5;
		}
		$scope.durationDisplay = $scope.duration.toString() + " hour";
	};
	$scope.saveTask = function(){
		if($scope.taskname == null){
			alert("Please complete the form!");
		} else {
			var userID = sessionService.get('user');
			var notified = false;
			$http({
		        method: 'POST',
		        url:  'posttask.php',
                data: {
		            taskname : $scope.taskname,
		            tasktype : $scope.type.name,
		            taskdate : $scope.dateToInput,
		            starttime : $scope.starttime,
		            duration : $scope.duration,
		            userID : userID
		        }
				}).then(function (data) {
				    $scope.taskname = null;
				    $scope.tasks = data;
				    $scope.getTasks();
				}, function (response) {
		        });
		    $uibModalInstance.close();
		}
	}
}
$scope.filterDay = function(day) {
	return function(task){
		return task.taskDate == day;
	};
};
$scope.filterDate = function(day) {
	return function(activity){
		var activityFullDate = moment(activity.activityFullDate).format('DD MMM YYYY').toString();
		return activityFullDate == day;
	};
};
$scope.check1 = function(time, hour){
	if(hour.toString() === time.toString()){
		return true;
	}	 
}
$scope.check2 = function(time, hour){
	if(hour.toString() === time.toString()){
		return true;
	}
}
$scope.getStyle = function(duration){
	var height = 0;
	if(duration == 0.5){
		height = 42;
	} else if(duration == 1){
		height = 90;
	} else if(duration == 1.5){
		height = 135;
	} else if(duration == 2){
		height = 180;
	} else {
		height = (((duration*2)-1)*50)+52;
	}
	return height.toString() +'px';
}
$scope.initFirst();
});