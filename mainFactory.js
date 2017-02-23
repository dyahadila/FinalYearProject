angular.module('app').factory('mainFactory', function($http, moment, sessionService, $location) {
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