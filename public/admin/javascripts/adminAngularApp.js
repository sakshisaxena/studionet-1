var app = angular.module('studionetAdmin', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

	// admin 'routes'
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/admin/templates/home.html',
			controller: 'HomeCtrl'
		})
		.state('modules', {
			url: '/modules',
			templateUrl: '/admin/templates/modules.html',
			controller: 'ModulesCtrl'
		});

	$urlRouterProvider.otherwise('/');
}]);

app.controller('HomeCtrl', ['$scope', function($scope){
	$scope.test = 'Hello world!';
}]);

app.controller('ModulesCtrl', ['$scope', function($scope){
	$scope.test = 'ModulesCtrl test!';
}]);