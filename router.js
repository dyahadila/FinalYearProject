angular.module('app').config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
  function($httpProvider, $stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller : 'loginCtrl'
      })

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
      $urlRouterProvider.otherwise('/login');
  }
]);