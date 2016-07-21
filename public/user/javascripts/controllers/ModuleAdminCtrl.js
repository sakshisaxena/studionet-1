angular.module('studionet')

.controller('ModuleAdminCtrl', ['$scope', 'module', function($scope, module){
	$scope.moduleInfo = module.module;
	$scope.moduleUsers = module.users;
}]);
