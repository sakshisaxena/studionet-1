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
			controller: 'ModulesCtrl'
		})
		.state('module', {
			url: '/modules/:id',
			templateUrl: '/admin/templates/module.html',
			controller: 'ModuleCtrl'
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

app.controller('ModulesCtrl', ['$scope', 'modules', function($scope, modules){
	$scope.modules = modules.query();

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

		});

		$scope.moduleName = '';
		$scope.moduleCode = '';
		$scope.contributionTypes = [];
	}
	
}]);

app.controller('ModuleCtrl', ['$scope', '$stateParams', 'modules', function($scope, $stateParams, modules){
	// consider placing this in resolve during route?
	$scope.module = modules.get({id: $stateParams.id}, function(){
		// success callback
		$scope.moduleCode = $scope.module.code;
		$scope.moduleName = $scope.module.name;
		$scope.contributionTypes = $scope.module.contributionTypes;
	});

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

app.factory('modules', ['$resource', function($resource){
	// trying out $resource instead of $http
	return $resource('/api/modules/:id', {}, {
		update: {
			method: 'PUT'
		}
	});
}]);