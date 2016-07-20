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
			// admin front
			url: '/admin',
			templateUrl: '/user/templates/admin.html',
			controller: 'AdminCtrl',
			resolve: {
				// ensure that profile is loaded before admin rights are decided
				userProfile: ['profile', function(profile){
					if (angular.equals({},profile.user) || angular.equals([], profile.modules)){
						// Need to get the data (probably refreshed browser)
						return profile.getUser() && profile.getModules();
					}
					// else already have the data, don't need to do anything
				}],
				adminRights: ['$q', 'profile', 'userProfile', function($q, profile, userProfile){
					var isAdmin = profile.modules.reduce((res, curr)=> res || curr.r.properties.role==='Admin', false);
					if (!isAdmin)
						return $q.reject('Not authorized!');
					else
						return $q.resolve('Welcome admin!');
				}]
			}
		})
		.state('moduleAdmin', {
			url: '/admin/:moduleCode',
			templateUrl: '/user/templates/moduleAdmin.html',
			controller: 'ModuleAdminCtrl',
			resolve: {
				userProfile: ['profile', function(profile){
					if (angular.equals({},profile.user) || angular.equals([], profile.modules)){
						// Need to get the data (probably refreshed browser)
						return profile.getUser() && profile.getModules();
					}
				}],
				adminRights: ['$q', 'profile', 'userProfile', '$stateParams', function($q, profile, userProfile, $stateParams){
					// must be admin of THIS module
					var isAdmin = profile.modules.find((mod) => mod.m.code===$stateParams.moduleCode && mod.r.properties.role === 'Admin');
					if (!isAdmin)
						return $q.reject('Not authorized!');
					else
						return $q.resolve('Welcome admin!');
				}],
				moduleInfo: [function(){
					return;
				}]
			}
		});

	$urlRouterProvider.otherwise('/');
}]);

app.controller('HomeCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.user = profile.user;
	$scope.modules = profile.modules;

	$scope.isAdmin = profile.modules.reduce(function(res, curr){
		return res || curr.r.properties.role==='Admin';
	}, false);

}]);

app.controller('AdminCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.user = profile.user;
	$scope.modules = profile.modules;
}]);

app.controller('ModuleAdminCtrl', ['$scope', function($scope){

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