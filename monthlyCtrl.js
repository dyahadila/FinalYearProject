angular.module('app').controller('monthlyCtrl',['$scope', '$interval', '$timeout', '$uibModal', 'moment', '$filter', '$http', 'mainFactory','loginFactory', 'sessionService',
 function($scope, $interval, $timeout, $uibModal, moment, $filter, $http, mainFactory, loginFactory, sessionService){
$scope.logout = function(){
	loginFactory.logout();
}
$scope.activitiesmonth = [];
$scope.getActivityMonth = function(){
	var userID = sessionService.get('user');
	var matcher = moment().format('YYYY-MM');
	$http.get('getactivitymonth.php', {
		params: {
			matcher : $scope.matcher,
			userID : userID
		}
	}).success(function (data,status) {
  	    $scope.activitiesmonth = data;
	});
}
$scope.handleDrop = function(item, bin){
	console.log(item);
	console.log(bin);
	var activityDate = bin.toString();
	var activityID = item.toString();
	var currentMonthAndYear = moment($scope.currentMoment).format('YYYY-MM');
	var day = activityDate;
	if(day<10){
		day = '0' + day;
	}
	var newdate = currentMonthAndYear + '-' + day; 
	$http({
		method: 'POST',
		url:  'moveActivity.php',
		data: {
		    activityID : activityID,
			date : newdate,
		}
	});
}
$scope.filterDate = function(day) {
	return function(activity){
		if(day.length == 1){
			day = "0" + day;
		}
		var date = $scope.currentMoment.format('YYYY-MM') + "-" + day;
		return activity.activityFullDate == date;
	};
};
$scope.initFirst=function()
{	
	$scope.thisMonth = moment();
	$scope.currentMoment = $scope.thisMonth;
	$scope.printedMonth = $scope.currentMoment.format('MMMM YYYY');
	$scope.startAndEndArray = getMonthDetails();
	$scope.daysArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[0];
	$scope.weeksArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[1];
	$scope.semester = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[2];
	$scope.matcher = $scope.currentMoment.format('YYYY-MM');
	$scope.daysInWeek = ['Mon', 'Tue', 'Wed','Thu', 'Fri', 'Sat', 'Sun'];
	$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
	'October', 'November', 'December'];
	$scope.years = [$scope.currentMoment.format('YYYY')];
	for(var i = 1; i<=4; i++){
		$scope.years.push(moment($scope.currentMoment).add(i, 'year').format('YYYY'));
	}
	$scope.getActivityMonth();
}

$scope.submit = function(){
	if($scope.selectedMonth && $scope.selectedYear){
		var month = moment().month($scope.selectedMonth).format('M');
		var str = month + '-' + $scope.currentMoment.format('DD') + '-' + $scope.selectedYear;
		$scope.currentMoment = moment(str, 'MM-DD-YYYY');
		$scope.printedMonth = $scope.currentMoment.format('MMMM YYYY');
		$scope.startAndEndArray = getMonthDetails();
		$scope.daysArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[0];
		$scope.weeksArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[1];
		$scope.semester = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[2];
		$scope.matcher = $scope.currentMoment.format('YYYY-MM');
	}
}

$scope.isString = function(item) {
    return angular.isString(item);
}

$scope.isNumber = function(item){
	return angular.isNumber(item);
}

$scope.isCurrentDay = function(day){
	var day1 = moment().format('DD-MM-YYYY');
	var monthyear = $scope.currentMoment.format('MM-YYYY');
	if(day.length ==  1){
		day = "0" + day;
	}
	var daymonthyear = day +"-"+ monthyear;
	if(daymonthyear == day1){
		return true;
	} else{
		return false;
	}
}

var getMonthDetails = function() {
	var startDayOfMonth = moment($scope.currentMoment).startOf('month').day();
	var endDayOfMonth = moment($scope.currentMoment).endOf('month').day();
	var numberOfDays = moment($scope.currentMoment).daysInMonth();
	var numberOfRows;
	
	if($scope.startDayOfMonth !=1){
		if($scope.startDayOfMonth != 0){
			numberOfRows = 6
		} else{
			numberOfRows = 5;
		}
	} else {
		numberOfRows = 4;
	}

	$scope.startAndEndArray = [startDayOfMonth, endDayOfMonth, numberOfRows, numberOfDays];
		return $scope.startAndEndArray;
	}

var getDateAndWeekArray = function(startDate, rows, daysNum, currentMoment) {
	var daysArray = [];
	var arrayFirstWeek = [];
	var index=1;
	var count = 1;
	var weeksArray = [];
	var ntuWeeksArray = [];
	var returnArray = [];
	var currentMonth = moment($scope.currentMoment).month() + 1;
	var currentMonthString = currentMonth.toString();
	var currentYear = moment($scope.currentMoment).year();
	var currentYearString = currentYear.toString();
	var testDate;
	var buildString;
	var weekOfYear;
	var ntuWeek;
	var lastDayPreviousMonth = moment($scope.currentMoment).subtract(1, 'month').endOf('month').format('DD');
	if(startDate!=0){
		var buffer = 0;
	for(var i=0; i<startDate-1; i++){
		buffer++;
	}
	while(buffer!=0){
		arrayFirstWeek.push((lastDayPreviousMonth-buffer+1));
		buffer--;
	}
	var j =i;
	while(count <= daysNum && j<=6){
		arrayFirstWeek.push(count.toString());
		count++;
		j++;
	}
	index=2;
	testDate = arrayFirstWeek[arrayFirstWeek.length-2].toString();
	buildString = currentMonthString + '-' + testDate + '-' + currentYearString;
	weekOfYear = moment(buildString, "MM-DD-YYYY").week();
	} else {
	var buffer = 6;
	var x = 1
	while(buffer!=0){
		arrayFirstWeek.push((lastDayPreviousMonth-buffer+1));
		buffer--;
	}
	arrayFirstWeek.push(x.toString());
	index=2;
	testDate = arrayFirstWeek[arrayFirstWeek.length-2].toString();
	buildString = currentMonthString + '-' + testDate + '-' + currentYearString;
	weekOfYear = moment(buildString, "MM-DD-YYYY").subtract(1, 'month').week();
}
	ntuWeek = mainFactory.ntuWeek(weekOfYear, currentMoment);
	weeksArray.push(ntuWeek);
	daysArray.push(arrayFirstWeek);
	var x = index;
	if(arrayFirstWeek[6] == 1){
			count++;
		}
	while(x<=rows && count<=daysNum){
		var tempArray = [];
		var k = 0;
	while(k<=6){
		tempArray.push(count.toString());
		count++;
		k++;
		if(count > daysNum){
			break;
		} 
	}
	if(tempArray.length == 1){
		var testDate = tempArray[tempArray.length-1].toString();
	} else{
		var testDate = tempArray[tempArray.length-2].toString();
	}
	buildString = currentMonthString + '-' + testDate + '-' + currentYearString;
	weekOfYear = moment(buildString, "MM-DD-YYYY").week();
	ntuWeek = mainFactory.ntuWeek(weekOfYear, currentMoment);
	weeksArray.push(ntuWeek);
	if(tempArray.length < 7){
		var nextMonthDate = 1;
		for(var i = tempArray.length-1; i<6; i++){
			tempArray.push(nextMonthDate);
			nextMonthDate++;
		}
	}
	daysArray.push(tempArray);
}
returnArray.push(daysArray);
returnArray.push(weeksArray);
var semester = mainFactory.semester(weekOfYear);
returnArray.push(semester);
return returnArray;
}

$scope.previousMonth = function() {
	$scope.currentMoment = $scope.currentMoment.subtract(1, 'month');
	$scope.printedMonth = $scope.currentMoment.format('MMMM YYYY');
	$scope.startAndEndArray = getMonthDetails();
	$scope.daysArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[0];
	$scope.weeksArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[1];
	$scope.semester = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[2];
	$scope.matcher = $scope.currentMoment.format('YYYY-MM');
	$scope.getActivityMonth();
}

$scope.nextMonth = function() {
	$scope.currentMoment = $scope.currentMoment.add(1, 'month');
	$scope.printedMonth = $scope.currentMoment.format('MMMM YYYY');
	$scope.startAndEndArray = getMonthDetails();
	$scope.daysArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[0];
	$scope.weeksArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[1];
	$scope.semester = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[2];
	$scope.matcher = $scope.currentMoment.format('YYYY-MM');
	$scope.getActivityMonth();
}

$scope.check = function(day){
	if($scope.isString(day)){
		$scope.open(day);
	}
}

$scope.open = function (day) {
	var currentMonthAndYear = moment($scope.currentMoment).format('YYYY-MM');
	if(day<10){
		day = '0' + day;
	}
	$scope.momentClicked = currentMonthAndYear + '-' + day;
		var modalInstance = $uibModal.open({
			templateUrl: 'myModalContent.html',
			controller: ModalInstanceCtrl,
			scope: $scope
		});
};

var ModalInstanceCtrl = function ($scope, $uibModalInstance, $http) {
	$scope.matcher = moment().format('YYYY-MM');
	$scope.mytime = new Date().setHours(12,0,0,0);
	$scope.hstep = 1;
  	$scope.mstep = 30;
  	$scope.ismeridian = true;
  	$scope.hour = $filter('date')($scope.mytime, 'shortTime');
  	$scope.printDate = moment($scope.currentMoment).format('DD MMMM YYYY');
	$scope.activities;
  	$scope.changed = function () {
    	$scope.hour = $filter('date')($scope.mytime, 'shortTime');
  	};

	$scope.cancel = function () {
		$uibModalInstance.close();
	};

	$scope.saveActivity = function(){
		var matcher = moment().format('YYYY-MM');
		if($scope.activityname == null || $scope.activitytype == null){
			alert("Please complete the form!");
		} else {
			var userID = sessionService.get('user');
			$http({
		        method: 'POST',
		        url:  'postactivity.php',
		        data: {
		        	activityname : $scope.activityname,
		            activitytype : $scope.activitytype,
		            date : $scope.momentClicked,
		            time : $scope.hour,
		            userID : userID
		        }
				}).success(function (response, data) {
					$scope.getActivityMonth();
				});
				$uibModalInstance.close();
			}
		}
}
var convertDateTimeFormat = function(date, time){
	var hourIndex = time.toString().indexOf(':');
	var hourStr = time.toString().substring(0,hourIndex);
	var hourInt = parseInt(hourStr);
	var convertedTime;

	if(time.toString().indexOf('PM') != -1 && hourInt !=12) { 
		convertedTime = (hourInt+12).toString() + time.toString().substring(hourIndex, time.toString().indexOf(' ')) + ':00';
	} else if(time.toString().indexOf('AM') != -1 && hourInt !=12) {
		convertedTime = (hourInt).toString() + time.toString().substring(hourIndex, time.toString().indexOf(' ')) + ':00';
	} else if(time.toString().indexOf('AM') != -1 && hourInt ==12){
		convertedTime = '00' + time.toString().substring(hourIndex, time.toString().indexOf(' ')) + ':00';
	} else{
		convertedTime = (hourInt).toString() + time.toString().substring(hourIndex, time.toString().indexOf(' ')) + ':00';
	}

	if(convertedTime.length <8){
		convertedTime = '0' + convertedTime;
	}
		return date + ' ' + convertedTime;
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

$scope.initFirst();
	}]);