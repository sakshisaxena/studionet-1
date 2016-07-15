var app = angular.module('studionetAdmin', ['ui.router', 'ngResource']);

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

app.controller('ModulesCtrl', ['$scope', 'modules', function($scope, modules){
	$scope.modules = modules.query();

	$scope.deleteModule = function(module){
		modules.delete(module, function(){
			// success callback
			$scope.modules.splice($scope.modules.indexOf(modules), 1);
		});
	};
	
}]);

app.factory('modules', ['$resource', function($resource){
	// trying out $resource instead of $http
	return $resource('/api/modules/:id', {}, {
		update: {
			method: 'PUT'
		}
	});
}]);