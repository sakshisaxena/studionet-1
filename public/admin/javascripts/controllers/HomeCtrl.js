angular.module('studionetAdmin')

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http){
	
	$scope.test = 'Hello world!';
	$scope.users = [];
	$scope.tags = [];
	$scope.contributions = [];
	$scope.groups = [];


	/*
	 * Get basic information about all the different key components
	 */
	$http.get('/api/users/').success(function(data){
		$scope.users = data;
	});		

	$http.get('/api/tags/').success(function(data){
		$scope.tags = data;
	});		


	$http.get('/api/groups/').success(function(data){
		$scope.groups = data;
	});	


	$http.get('/api/contributions/').success(function(data){
		$scope.contributions = data;
	});	




}]);
