var app = angular.module('studionet', ['ui.router', 'ngTagsInput', 'ngFileUpload'])
									.run(['profile', function(profile){
										/*
										profile.getUser();
										profile.getModules();
										*/
									}]);

app.config(['$stateProvider', '$urlRouterProvider', 'tagsInputConfigProvider', function($stateProvider, $urlRouterProvider, tagsInputConfigProvider){

	// user 'routes'
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/user/templates/home.html',
			controller: 'HomeCtrl',
			resolve: {
				userProfile: ['profile', function(profile){
					return profile.getUser() && profile.getModules();
				}],
				userModels: ['modelsFactory', 'userProfile', 'profile', function(modelsFactory, userProfile, profile){
					return modelsFactory.getUserModels(profile.user.nusOpenId);
				}]

			}
		})
		.state('home.graphView', {
			url: 'graph',
			templateUrl: '/user/templates/home.graphView.html',
			controller: 'HomeCtrl',
			resolve: {
				userProfile: ['profile', function(profile){
					return profile.getUser() && profile.getModules();
				}],
				userModels: ['modelsFactory', 'userProfile', 'profile', function(modelsFactory, userProfile, profile){
					return modelsFactory.getUserModels(profile.user.nusOpenId);
				}]

			}
		})
		.state('home.userDetails', {
			url: 'me',
			templateUrl: '/user/templates/home.userDetails.html',
			controller: 'HomeCtrl',
			resolve: {
				userProfile: ['profile', function(profile){
					return profile.getUser() && profile.getModules();
				}],
				userModels: ['modelsFactory', 'userProfile', 'profile', function(modelsFactory, userProfile, profile){
					return modelsFactory.getUserModels(profile.user.nusOpenId);
				}]

			}
		})
		.state('admin', {
			// admin front
			url: '/admin',
			templateUrl: '/user/templates/admin.html',
			controller: 'AdminCtrl',
			resolve: {
				// ensure that profile is loaded before admin rights are decided
				userProfile: ['profile', function(profile){
					//if (angular.equals({},profile.user) || angular.equals([], profile.modules)){
						// Need to get the data (probably refreshed browser)
						return profile.getUser() && profile.getModules();
					//}
					// else already have the data, don't need to do anything
				}],
				adminRights: ['$q', 'profile', 'userProfile', function($q, profile, userProfile){
					var isAdmin = profile.modules.reduce((res, curr)=> res || curr.role==='Admin', false);
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
					// if (angular.equals({},profile.user) || angular.equals([], profile.modules)){
						// Need to get the data (probably refreshed browser)
						return profile.getUser() && profile.getModules();
					// }
				}],
				adminRights: ['$q', 'profile', 'userProfile', '$stateParams', function($q, profile, userProfile, $stateParams){
					// must be admin of THIS module
					var isAdmin = profile.modules.find((mod) => mod.code===$stateParams.moduleCode && mod.role === 'Admin');
					if (!isAdmin)
						return $q.reject('Not authorized!');
					else
						return $q.resolve('Welcome admin!');
				}],
				moduleInfo: ['userProfile', 'module', 'profile', '$stateParams', function(userProfile, module, profile, $stateParams){
					var myMod = profile.modules.find((mod) => mod.code === $stateParams.moduleCode);
					angular.copy(myMod, module.module);
					return module.getModuleUsers(module.module.id);
				}]			
			}
		})
		.state('moduleAdmin.addUser', {
			url: '/add',
			templateUrl: '/user/templates/moduleAdmin.addUser.html',
			controller: 'ModuleAdminCtrl',
			resolve: {
				allUsers: ['users', function(users){
					return users.getAllUsers();
				}]
			}
		})
		.state('moduleAdmin.restrictUser', {
			url: '/restrict', 
			templateUrl: '/user/templates/moduleAdmin.restrictUser.html'
		})
		.state('moduleAdmin.editTypes', {
			url: '/types', 
			templateUrl: '/user/templates/moduleAdmin.editTypes.html'
		})
		.state('moduleAdmin.editRoles', {
			url:'/roles',
			templateUrl: '/user/templates/moduleAdmin.editRoles.html'
		})

	$urlRouterProvider.otherwise('/');
}]);
