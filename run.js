angular.module('app').run(['$rootScope', 'loginFactory', '$state', function($rootScope, loginFactory, $state){
	$rootScope.$on('$stateChangeSuccess', function(event){
        if(!loginFactory.islogged()){
            $state.go('login');
            event.preventDefault();
            return;
        }
        return;
	});
}]);