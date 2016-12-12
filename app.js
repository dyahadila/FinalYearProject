var app = angular.module('app', ['angularMoment', 'ui.bootstrap']);
	
	app.constant('moment', moment);

	app.controller('mainCtrl', function($scope, $uibModal, moment, $log, $filter, $http){

		$scope.daysInWeek = ['Mon', 'Tue', 'Wed','Thu', 'Fri', 'Sat', 'Sun'];
		$scope.currentMoment;

		$scope.isString = function(item) {
    		return angular.isString(item);
		}

		$scope.isNumber = function(item){
			return angular.isNumber(item);
		}

		 var init = function() {
			$scope.thisMonth = moment();
			$scope.currentMoment = $scope.thisMonth;
			$scope.printedMonth = $scope.currentMoment.format('MMMM YYYY');
			$scope.startAndEndArray = getMonthDetails();
			$scope.daysArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[0];
			$scope.weeksArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[1];
			$scope.semester = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[2];
			$scope.matcher = $scope.currentMoment.format('YYYY-MM');
			console.log($scope.matcher);
		}

		var getMonthDetails = function() {
			var startDayOfMonth = moment($scope.currentMoment).startOf('month').day();
			var endDayOfMonth = moment($scope.currentMoment).endOf('month').day();
			var numberOfDays = moment($scope.currentMoment).daysInMonth();
			var numberOfRows;

			if($scope.startDayOfMonth !=1){
				numberOfRows = 5;
				//fix bugs here
			}else{
				numberOfRows = 4;
				if($scope.startDayOfMonth==5 || $scope.startDayOfMonth==6){
					numberOfRows = 6;
				}
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
			var semester;

			if(rows == 5 || row == 6){
				var lastDayPreviousMonth = moment($scope.currentMoment).subtract(1, 'month').endOf('month').format('DD');
				var buffer = 0;
				for(var i=0; i<startDate-1; i++){
					buffer++;
				}
				while(buffer!=0){
					arrayFirstWeek.push((lastDayPreviousMonth-buffer+1).toString());
					buffer--;
				}
				var j =i;
				while(count <= daysNum && j<=6){
					arrayFirstWeek.push(count);
					count++;
					j++;
				}
				index=2;
				testDate = arrayFirstWeek[arrayFirstWeek.length-2].toString();
				buildString = currentMonthString + '-' + testDate + '-' + currentYearString;
				weekOfYear = moment(buildString, "MM-DD-YYYY").week();

				ntuWeek = syncWithNtuWeek(weekOfYear, currentMoment);
				weeksArray.push(ntuWeek);
				daysArray.push(arrayFirstWeek);
			}

			var x = index;
			while(x<=rows && count<=daysNum){
				var tempArray = [];
				var k = 0;
				while(k<=6){
					tempArray.push(count);
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
				ntuWeek = syncWithNtuWeek(weekOfYear, currentMoment);
				weeksArray.push(ntuWeek);
				if(tempArray.length < 7){
					var nextMonthDate = 1;
					for(var i = tempArray.length-1; i<6; i++){
						tempArray.push(nextMonthDate.toString());
						nextMonthDate++;
					}
				}
				daysArray.push(tempArray);
			}
			returnArray.push(daysArray);
			returnArray.push(weeksArray);
			if(weekOfYear>=33 && weekOfYear<54){
				semester = 'Semester 1';
			} else if(weekOfYear>=1 && weekOfYear<33){
				semester = 'Semester 2';
			}
			returnArray.push(semester);
			return returnArray;
		}

		var syncWithNtuWeek = function(weekOfYear, currentMoment){
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

		init();

		$scope.previousMonth = function() {
			$scope.currentMoment = $scope.currentMoment.subtract(1, 'month');
			$scope.printedMonth = $scope.currentMoment.format('MMMM YYYY');
			$scope.startAndEndArray = getMonthDetails();
			$scope.daysArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[0];
			$scope.weeksArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[1];
			$scope.semester = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[2];
			$scope.matcher = $scope.currentMoment.format('YYYY-MM');
			console.log($scope.matcher);
		}

		$scope.nextMonth = function() {
			$scope.currentMoment = $scope.currentMoment.add(1, 'month');
			$scope.printedMonth = $scope.currentMoment.format('MMMM YYYY');
			$scope.matcher = 
			$scope.startAndEndArray = getMonthDetails();
			$scope.daysArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[0];
			$scope.weeksArray = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[1];
			$scope.semester = getDateAndWeekArray($scope.startAndEndArray[0], $scope.startAndEndArray[2], $scope.startAndEndArray[3], $scope.currentMoment)[2];
			$scope.matcher = $scope.currentMoment.format('YYYY-MM');
			console.log($scope.matcher);
		}

		$scope.check = function(day){
			if($scope.isNumber(day)){
				$scope.open(day);
			}
		}

		$scope.open = function (day) {
			var currentMonthAndYear = moment($scope.currentMoment).format('YYYY-MM');
			if(day<10){
				day = '0' + day;
			}
			var momentClicked = currentMonthAndYear + '-' + day;
		    var modalInstance = $uibModal.open({
		      templateUrl: 'myModalContent.html',
		      controller: ModalInstanceCtrl,
		      resolve: {
			      momentClicked: function(){
			       return momentClicked;
			      }
		      }
		    });

		    $scope.momentClicked = momentClicked;

			var request = $http({
			    method: "POST",
			    url: "http://localhost/FinalYearProject/calendar.php",
			    data: {
			        datasent : $scope.momentClicked
			    },
			    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			});

			request.success(function (data) {
				
			});

		    modalInstance.result.then(function () {
		    }, function () {

		    });
		 };

		var ModalInstanceCtrl = function ($scope, $uibModalInstance, momentClicked, $http) {
			$scope.momentClicked = momentClicked;
			$scope.addActivity = false;
			$scope.mytime = new Date().setHours(12,0,0,0);
			$scope.hstep = 1;
  			$scope.mstep = 30;
  			$scope.ismeridian = true;
  			$scope.hour = $filter('date')($scope.mytime, 'shortTime');


  			$scope.changed = function () {
    			$scope.hour = $filter('date')($scope.mytime, 'shortTime');
  			};

			$scope.ok = function () {
			    $uibModalInstance.close();
			};

			$scope.cancel = function () {
			    $uibModalInstance.dismiss('cancel');
			  };

			$scope.saveActivity = function(){
				console.log(convertDateTimeFormat($scope.momentClicked, $scope.hour));
				console.log($scope.activityname);
				console.log($scope.activitytype);
			}
		};

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

	});