angular.module('studionet')

.controller('AdminCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.user = profile.user;
	$scope.modules = profile.modules;
}]);