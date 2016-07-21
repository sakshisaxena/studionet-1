angular.module('studionet')

.controller('ModuleAdminCtrl', ['$scope', 'module', 'users', function($scope, module, users){
	$scope.moduleInfo = module.module;
	$scope.moduleUsers = module.users;
	$scope.allUsers = users.users;
}]);
