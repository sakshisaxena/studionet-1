var app = angular.module('studionet', ['ui.router', 'ngTagsInput'])
									.run(['profile', function(profile){
										profile.getUser();
										profile.getModules();
									}]);

app.config(['$stateProvider', '$urlRouterProvider', 'tagsInputConfigProvider', function($stateProvider, $urlRouterProvider, tagsInputConfigProvider){

	// user 'routes'
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/user/templates/home.html',
			controller: 'HomeCtrl',

		});

	$urlRouterProvider.otherwise('/');
}]);

app.controller('HomeCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.test = 'Hello';
	$scope.user = profile.user;
	$scope.modules = profile.modules;
	console.log($scope.modules);
}]);

app.factory('profile', ['$http', function($http){
	var o ={
		user: {},
		modules: [],
	};

	o.getUser = function(){
		return $http.get('/api/profile/user').success(function(data){
			angular.copy(data, o.user);
		});
	};

	o.getModules = function(){
		return $http.get('/api/profile/modules').success(function(data){
			angular.copy(data, o.modules);
		});
	};

	return o;
}]);