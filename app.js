var app = angular.module('app', ['angularMoment', 'ui.bootstrap', 'ui.router', angularDragula(angular)]);

app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
  function($httpProvider, $stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('monthly', {
        url: '/monthly',
        templateUrl: 'calendar.html',
        controller : 'monthlyCtrl'
      })
      .state('weekly', {
      	url: '/weekly',
      	templateUrl: 'weekly.html',
      	controller : 'weeklyCtrl'
      })
      $urlRouterProvider.otherwise('/monthly');
  }
]);

app.factory('mainFactory', function() {
	var getSemester = function(weekOfYear){
		var semester;
		if(weekOfYear>=33 && weekOfYear<54){
			semester = 'Semester 1';
		} else if(weekOfYear>=1 && weekOfYear<33){
			semester = 'Semester 2';
		}
		return semester;
	}

	var getNtuWeek = function(weekOfYear, currentMoment){
		var retVal;
			if(weekOfYear>=33 && weekOfYear<54){
					if(weekOfYear-32 == 8){
						retVal = 'Recess Week';
					} else if(weekOfYear>=41 && weekOfYear<=46){
						retVal = 'Week ' + (weekOfYear-33).toString();
					} else if(weekOfYear>46 && weekOfYear<=49){
						if(weekOfYear-46 == 1){
							retVal = 'Reading Week';
						} else{
							retVal = 'Examination Week ' + (weekOfYear-47).toString();
						}
					} else if(weekOfYear>=50 && weekOfYear<54){
						retVal = 'Vacation';
					} else{
						retVal = 'Week ' + (weekOfYear-32).toString();
					}
				} else if(weekOfYear>=1 && weekOfYear<33){
					var lastDayOfLastYr = '12-31' + '-' + (currentMoment.year()-1).toString();
					var noOfWeeksLastYr = moment(lastDayOfLastYr, 'MM-DD-YYYY').week();
					var startWeekSem1;
					var subtractor;
					if(noOfWeeksLastYr == 53){
						startWeekSem1  = 2;
						subtractor = 1;
					} else{
						startWeekSem1 = 3;
						subtractor = 2;
					}
					var endOfStudyWeek;
					if(weekOfYear>=startWeekSem1 && weekOfYear <= startWeekSem1+13){
						if(weekOfYear>=startWeekSem1 && weekOfYear <= startWeekSem1+13 && weekOfYear != startWeekSem1 + 7){
							if(weekOfYear < startWeekSem1 + 7){
								retVal = 'Week ' + (weekOfYear-subtractor).toString();
							} else if(weekOfYear > startWeekSem1 + 7 && weekOfYear <= startWeekSem1 +13){
								retVal = 'Week ' + (weekOfYear-subtractor-1).toString();
							}
						} else if(weekOfYear == startWeekSem1 + 7){
							retVal = 'Recess Week';
						} else {
							retVal = 'Vacation';
						}
					} else if(weekOfYear == startWeekSem1 + 14){
						retVal = 'Reading Week';
					} else if(weekOfYear == startWeekSem1 + 15){
						retVal = 'Examination Week 1';
					} else if(weekOfYear == startWeekSem1 + 16){
						retVal = 'Examination Week 2';
					} else{
						retVal = 'Vacation';
					}
				}
				return retVal;
	}
	return {
		semester : getSemester,
		ntuWeek : getNtuWeek
	}
});

app.controller('weeklyCtrl', function($scope, $uibModal, moment, $http, mainFactory, dragulaService){
//fix semester 1 vacation bug in first week of new year later

$scope.tasks;

$scope.initFirst=function(){
	$scope.thisWeek = moment();
	$scope.currentMoment = $scope.thisWeek;
	$scope.daysInWeek = ['Mon', 'Tue', 'Wed','Thu', 'Fri', 'Sat', 'Sun'];
	var weekInYear = $scope.currentMoment.week();
	var dayInWeek = $scope.currentMoment.day();
	$scope.daysArray = getDaysArray(dayInWeek, $scope.currentMoment);
	$scope.semester = mainFactory.semester(weekInYear);
	$scope.ntuWeek = mainFactory.ntuWeek(weekInYear, $scope.currentMoment);
	$scope.hours = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
	'4:30 PM', '5:00 PM', '5:30 PM','6:00 PM', '6:30 PM','7:00 PM', '7:30 PM','8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
	'10:00 PM', '10:30 PM','11:00 PM','11:30 PM', '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
	'3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM',
	 '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
	$scope.getTasks();
}
$scope.popover = {
	templateUrl : 'popoverTemplate.html'
}
$scope.checked = {};
$scope.disable = function($event, taskId){
	$event.stopPropagation();
	if(!(taskId in $scope.checked)){
		$scope.checked[taskId] = false;
	}
}
$scope.mouseDown = function(taskId){
	$scope.trash = true;
}
$scope.mouseUp = function(taskId){
	$scope.trash = false;
}
dragulaService.options($scope, 'first-bag', {
    revertOnSpill: true
});
$scope.$on('first-bag.drop', function (e, el, target, source, draggable){
	if ( !draggable ) e.stopPropagation();
	$scope.trash = false;
	var taskId = parseInt(el.attr('id'));
	var hourday = target.attr('id').toString();
	var index;
	if(hourday.indexOf("AM") !== -1){
		index = hourday.indexOf("AM");
	} else if(hourday.indexOf("PM") !== -1){
		index = hourday.indexOf("PM");
	}
	var day = hourday.substring(index+2);
	var hour = hourday.substring(0,index+2);
	

	if(target.attr('id').toString() == "trashcan"){
		$http({
		method: 'POST',
		url:  'deleteTask.php',
	    data: {
	        taskId : taskId
		}
		}).then(function (data) {
			$scope.getTasks();
		});
	} else{
		$http({
		method: 'POST',
		url:  'moveTask.php',
	    data: {
	        taskId : taskId,
			hour : hour,
			day : day
		}
		}).then(function (data) {
			$scope.getTasks();
		});
	}
})
$scope.check = function($event, taskId){
	$event.stopPropagation();
	$scope.checked[taskId] = !$scope.checked[taskId];
}
$scope.markcomplete = function($event, taskId){
	$event.stopPropagation();
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
$scope.moveTask = function(taskId){
	console.log(taskId);
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
	$http.get('gettasks.php', {
		params: {
			"days[]": $scope.daysArray
		}
	}).success(function (data,status) {
  	    $scope.tasks = data;
	});
}

$scope.nextWeek = function(){
	$scope.currentMoment = $scope.currentMoment.add(1, 'week');
	var weekInYear = $scope.currentMoment.week();
	var dayInWeek = $scope.currentMoment.day();
	$scope.daysArray = getDaysArray(dayInWeek, $scope.currentMoment);
	$scope.semester = mainFactory.semester(weekInYear);
	$scope.ntuWeek = mainFactory.ntuWeek(weekInYear, $scope.currentMoment);
	$scope.getTasks();
}

$scope.prevWeek = function(){
	$scope.currentMoment = $scope.currentMoment.subtract(1, 'week');
	var weekInYear = $scope.currentMoment.week();
	var dayInWeek = $scope.currentMoment.day();
	$scope.daysArray = getDaysArray(dayInWeek, $scope.currentMoment);
	$scope.semester = mainFactory.semester(weekInYear);
	$scope.ntuWeek = mainFactory.ntuWeek(weekInYear, $scope.currentMoment);
	$scope.getTasks();
}
$scope.convert = function(date, time){
	$scope.originalDate = moment(new Date(date)).format('DD MMMM YYYY');
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
	$scope.ok = function(){
		$uibModalInstance.close();
		$scope.getTasks();
	};
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
			$http({
		        method: 'POST',
		        url:  'posttask.php',
                data: {
		            taskname : $scope.taskname,
		            tasktype : $scope.type.name,
		            taskdate : $scope.dateToInput,
		            starttime : $scope.starttime,
		            duration : $scope.duration
		        }
				}).then(function (data) {
				    $scope.taskname = null;
				    $scope.tasks = data;
				    alert('Task added successfully');
				}, function (response) {
				   console.log(response.data,response.status);
		        });
		}
	}
}
$scope.check1 = function(time, hour){
	if(hour.toString() === time.toString()){
		return true;
	}	 
}

$scope.getStyle = function(duration){
	var height = (((duration*2)-1)*50)+35;
	return height.toString() +'px';
}
});

app.controller('monthlyCtrl', function($scope, $uibModal, moment, $filter, $http, mainFactory, dragulaService){
		$scope.getActivityMonth = function(){
			$http
		    .get('getactivitymonth.php?matcher='+$scope.matcher).success(function (data,status) {
  	            $scope.activitiesmonth = data;
			});
		}
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
				$scope.getActivityMonth();
		 	}
		 }

		$scope.isString = function(item) {
    		return angular.isString(item);
		}

		$scope.isNumber = function(item){
			return angular.isNumber(item);
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

		 	$scope.initFirst();
$scope.getActivity = function(){
				$http({
                method: 'POST',
                url:  'getactivity.php',
                data: {
               	momentClicked : $scope.momentClicked
               	}
		          }).then(function (response) {
		          	$scope.activities = response.data;
		          }, function (response) {
		             console.log(response.data,response.status);
		    });
			}
		var ModalInstanceCtrl = function ($scope, $uibModalInstance, $http) {
			$scope.matcher = moment().format('YYYY-MM');
			$scope.addActivity = false;
			$scope.mytime = new Date().setHours(12,0,0,0);
			$scope.hstep = 1;
  			$scope.mstep = 30;
  			$scope.ismeridian = true;
  			$scope.hour = $filter('date')($scope.mytime, 'shortTime');
  			$scope.printDate = moment($scope.currentMoment).format('DD MMMM YYYY');

			$scope.activities;
			$scope.getActivity();
  			$scope.changed = function () {
    			$scope.hour = $filter('date')($scope.mytime, 'shortTime');
  			};

			$scope.ok = function () {
				$scope.getActivityMonth();
			    $uibModalInstance.close();
			};

			$scope.saveActivity = function(){
				if($scope.activityname == null || $scope.activitytype == null){
					alert("Please complete the form!");
				} else {
					$http({
		               method: 'POST',
		               url:  'postactivity.php',
		               data: {
		               activityname : $scope.activityname,
		               activitytype : $scope.activitytype,
		               date : $scope.momentClicked,
		               time : $scope.hour
		               }
				         }).then(function (response) {
				               $scope.activityname = null;
				               $scope.activitytype = null;
				               $scope.addActivity = false;
				               $scope.mytime = new Date().setHours(12,0,0,0);
				               $scope.hour = $filter('date')($scope.mytime, 'shortTime');
				               alert("Activity successfully added!");
				               $scope.getActivity();
				          }, function (response) {
				               console.log(response.data,response.status);
				          });
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
$scope.mouseDown = function(taskId){
	$scope.trash = true;
}
$scope.mouseUp = function(taskId){
	$scope.trash = false;
}
dragulaService.options($scope, 'second-bag', {
    revertOnSpill: true
});

$scope.$on('second-bag.drop', function (e, el, target, source){
	$scope.trash=false;
	var activityDate = target.attr('id').toString();
	var activityID = parseInt(el.attr('id'));
	var currentMonthAndYear = moment($scope.currentMoment).format('YYYY-MM');
	var day = activityDate;
	if(day<10){
		day = '0' + day;
	}
	var newdate = currentMonthAndYear + '-' + day;
	
	if(target.attr('id').toString() == "trashcan"){
		$http({
		method: 'POST',
		url:  'deleteActivity.php',
	    data: {
	        activityID : activityID
		}
		}).then(function (data) {
			$scope.getActivity();
		});
	} else{
		$http({
		method: 'POST',
		url:  'moveActivity.php',
	    data: {
	        activityID : activityID,
			date : newdate,
			day : activityDate
		}
		}).then(function (data) {
			$scope.getActivity();
		});
	}
})
	});