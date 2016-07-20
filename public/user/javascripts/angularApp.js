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
		})
		.state('admin', {
			url: '/admin',
			templateUrl: '/user/templates/admin.html',
			controller: 'AdminCtrl',
			resolve: {
				// ensure that profile is loaded before admin rights are decided
				userProfile: ['profile', function(profile){
					return profile.getUser() && profile.getModules();
				}],
				adminRights: ['$q', 'profile', 'userProfile', function($q, profile, userProfile){
					var isAdmin = profile.modules.reduce(function(res, curr){
						return res || curr.r.properties.role==='Admin';
					}, false);
					if (!isAdmin)
						return $q.reject('Not authorized!');
					else
						return $q.resolve('Welcome admin!');
				}]
			}
		});

	$urlRouterProvider.otherwise('/');
}]);

app.controller('HomeCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.test = 'Hello';
	$scope.user = profile.user;
	$scope.modules = profile.modules;
}]);

app.controller('AdminCtrl', ['$scope', function($scope){
	$scope.test = 'Hello';
}])

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