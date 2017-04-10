angular.module('app').factory('loginFactory', ['$http','$location', 'sessionService', 
	function($http, $location, sessionService){
	var login = function(formData){
		var $promise=$http.post('userlogin.php', formData);
		$promise.then(function(msg){
			var uid = msg.data;
			if(uid) {
				sessionService.set('user', uid);
				$location.path("/monthly");
			}
			else {
				alert("Invalid username or password!");
				$location.path('/login');
			}
		});
	}
	var logout = function(){
		$http.post('logout.php');
		sessionService.destroy('user');
		$location.path("/login");
	}
	var islogged = function(){
		if(sessionService.get('user')){
			return true;
		} else{
			return false;
		}
	}
	return {
		login: login,
		logout: logout,
		islogged: islogged
	}
}]);

