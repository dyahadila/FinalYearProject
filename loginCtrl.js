angular.module('app').controller('loginCtrl', 
	function($scope, $http, $location, moment, loginFactory){	
	$scope.formData = {};
	$scope.submit = function(formData){
		loginFactory.login(formData);
	}
});