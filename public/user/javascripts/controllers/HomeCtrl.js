angular.module('studionet')

.controller('HomeCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.user = profile.user;
	$scope.modules = profile.modules;

	$scope.isAdmin = profile.modules.reduce(function(res, curr){
		return res || curr.r.properties.role==='Admin';
	}, false);

}]);