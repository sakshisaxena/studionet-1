var app = angular.module('studionet', ['ui.router', 'ngTagsInput'])
									.run(['profile', function(profile){
										profile.getProfile();
									}]);

app.config(['$stateProvider', '$urlRouterProvider', 'tagsInputConfigProvider', function($stateProvider, $urlRouterProvider, tagsInputConfigProvider){

	// user 'routes'
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/user/templates/home.html',
			controller: 'HomeCtrl'
		});

	$urlRouterProvider.otherwise('/');
}]);

app.controller('HomeCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.test = 'Hello';
	$scope.profile = profile.profile;
}]);

app.factory('profile', ['$http', function($http){
	var o ={
		profile: {}
	};

	o.getProfile = function(){
		return $http.get('/api/profile').success(function(data){
			angular.copy(data, o.profile);
		});
	};

	return o;
}])