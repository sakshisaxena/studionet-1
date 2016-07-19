var app = angular.module('studionetAdmin', ['ui.router', 'ngResource', 'ngTagsInput']);

app.config(['$stateProvider', '$urlRouterProvider', 'tagsInputConfigProvider', function($stateProvider, $urlRouterProvider, tagsInputConfigProvider){

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
			controller: 'ModulesCtrl',
			resolve: {
				usersPromise: ['users', function(users){
					return users.getAll();
				}],
				// get modules data before page loads
				modulesPromise: ['modules', function(modules){
					return modules.query();
				}]
			}
		})
		.state('module', {
			url: '/modules/:id',
			templateUrl: '/admin/templates/module.html',
			controller: 'ModuleCtrl',
			resolve: {
				// get data first
				modulePromise: ['$q', 'modules', '$stateParams', function($q, modules, $stateParams){
					var defer = $q.defer();
				  modules.get({id: $stateParams.id}, function(module){
						defer.resolve(module);
					});
					return defer.promise;
				}]
			}
		})
		.state('users', {
			url: '/users',
			templateUrl: '/admin/templates/users.html',
			controller: 'UsersCtrl',
			resolve: {
				usersPromise: ['users', function(users){
					return users.getAll();
				}]
			}
		});

	$urlRouterProvider.otherwise('/');

	tagsInputConfigProvider
		.setDefaults('tagsInput', {
			placeholder: 'Contribution Types'
		});
}]);

app.controller('HomeCtrl', ['$scope', function($scope){
	$scope.test = 'Hello world!';
}]);

app.controller('ModulesCtrl', ['$scope', 'modules', 'users', 'modulesPromise', function($scope, modules, users, modulesPromise){
	// $scope.modules = modules.query();
	// get modules data before page loads
	$scope.modules = modulesPromise;
	$scope.usersList = users.users;

	$scope.moderators = [{modtype: 'existing'}];

	$scope.addNewModField = function(){
		$scope.moderators.push({modtype: 'existing'});
	};

	$scope.removeModField = function(moderator){
		$scope.moderators.splice($scope.moderators.indexOf(moderator), 1);
	};

	$scope.modIsExisting = function(moderator){
		return moderator.modtype === 'existing';
	};

	$scope.deleteModule = function(module){
		modules.delete(module, function(){
			// success callback
			$scope.modules.splice($scope.modules.indexOf(module), 1);
		});
	};

	$scope.addModule = function(){
		if (!$scope.moduleCode || $scope.moduleCode === '' || !$scope.moduleName || $scope.moduleName === '' || !$scope.contributionTypes || $scope.contributionTypes === [])
			return;

		modules.save({
			name: $scope.moduleName,
			code: $scope.moduleCode,
			// convert array into string array, ngTagsInput gives an object array for some reason
			contributionTypes: $scope.contributionTypes.map((o) => o.text) 
		}, function(module){
			// update the modules doing a resource query
			// can consider doing a local push instead..
			// $scope.modules = modules.query();

			$scope.modules.push(module);

			$scope.moderators.forEach(function(moderator){
				// check if existing or new user
				if (moderator.modtype === 'existing'){
					// user already exists in db
					users.createModExisting({
						nusOpenId: moderator.nusOpenIdExisting,
						moduleId: module.id
					});

				}
				else {
					// need to create a new user
					users.createModNew({
						name: moderator.name,
						nusOpenId: moderator.nusOpenId,
						canEdit: moderator.canEdit,
						year: moderator.year,
						moduleId: module.id
					});
				}

			});

			$scope.moderators = [{modtype: 'existing'}]

		});

		$scope.moduleName = '';
		$scope.moduleCode = '';
		$scope.contributionTypes = [];
	}
	
}]);

app.controller('ModuleCtrl', ['$scope', '$stateParams', 'modules', 'modulePromise', function($scope, $stateParams, modules, modulePromise){
	// consider placing this in resolve during route?
	/*
	$scope.module = modules.get({id: $stateParams.id}, function(){
		// success callback
		$scope.moduleCode = $scope.module.code;
		$scope.moduleName = $scope.module.name;
		$scope.contributionTypes = $scope.module.contributionTypes;
	});
	*/

	// doing it in resolve, get data first then load page
	$scope.module = modulePromise;
	$scope.moduleCode = $scope.module.code;
	$scope.moduleName = $scope.module.name;
	$scope.contributionTypes = $scope.module.contributionTypes;


	$scope.updateModule = function(){
		if (!$scope.moduleCode || $scope.moduleCode === '' || !$scope.moduleName || $scope.moduleName === '' || !$scope.contributionTypes || $scope.contributionTypes === [])
			return;

		modules.update({id: $stateParams.id},{
			name: $scope.moduleName,
			code: $scope.moduleCode,
			// convert array into string array, ngTagsInput gives an object array for some reason
			contributionTypes: $scope.contributionTypes.map((o) => o.text) 
		}, function(module){
			// update the modules doing a resource query
			// can consider doing a local push instead..
			// $scope.modules = modules.query();

			$scope.module = modules.get({id: $stateParams.id}, function(){
				// success callback
				$scope.moduleCode = $scope.module.code;
				$scope.moduleName = $scope.module.name;
				$scope.contributionTypes = $scope.module.contributionTypes;
			})

		});
	}

}]);

app.controller('UsersCtrl', ['$scope', 'users', function($scope, users){
	$scope.test = 'Hello';
	$scope.users = users.users;
	$scope.option = 'nusOpenId';
	$scope.showForm = false;

	$scope.toggleForm = function(){
		$scope.showForm = !$scope.showForm;
	}

	$scope.clearSearch = function(){
		$scope.search = {};
	};

	$scope.addNewUser = function(){
		if (!$scope.userName || $scope.userName === '' || !$scope.userNusOpenId || $scope.userNusOpenId === '' || !$scope.userYear || $scope.userYear === '')
			return;

		users.createNewUser({
			name: $scope.userName,
			nusOpenId: $scope.userNusOpenId,
			year: $scope.userYear,
			canEdit: $scope.userCanEdit
		});

		$scope.userName = '';
		$scope.userNusOpenId = '';
		$scope.userYear = '';
		$scope.userCanEdit = '';
	}

}])

app.factory('modules', ['$resource', function($resource){
	// trying out $resource instead of $http
	return $resource('/api/modules/:id', {}, {
		update: {
			method: 'PUT'
		}
	});
}]);

app.factory('users', ['$http', function($http){
	/*
	return $resource('/api/users/:id', {}, {
		update: {
			method: 'PUT'
		}
	});
	*/

	var o = {
		users: []
	};

	o.getAll = function(){
		return $http.get('/api/users').success(function(data){
			angular.copy(data, o.users);
		});
	};

	o.createModNew = function(moderator){
		return $http.post('/api/moderators/new', moderator).success(function(data){
			o.users.push(data);
		});
	};

	o.createModExisting = function(moderator){
		return $http.post('/api/moderators/existing', moderator).success(function(data){
			o.users.push(data);
		});
	};

	o.createNewUser = function(user){
		return $http.post('/api/users', user).success(function(data){
			o.users.push(data);
		});
	}

	return o;
}]);

