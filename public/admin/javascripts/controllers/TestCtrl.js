
/*
 *	Remove in production
 * 	To create synthetic data and check APIs
 *
 * 
 */
angular.module('studionetAdmin').controller('TestCtrl', ['$scope', '$http', function($scope, $http){

	$scope.users = [];
	$scope.tags = [];
	$scope.contributions = [];
	$scope.relationships = [];

	$scope.contributionData = { 'tags' : [] };
	$scope.tag = "";
	
	var refresh = function(){
		$scope.contributionData = { 'tags' : [] };
		$scope.tag = "";		
	}

	refresh();


	$http.get('/api/users/').success(function(data){
		$scope.users = data;
	});		

	$http.get('/api/tags/').success(function(data){
		$scope.tags = data;
	});		


	$http.get('/api/contributions/').success(function(data){
		$scope.contributions = data;
	});	

	$http.get('/api/relationships/').success(function(data){
		$scope.relationships = data;
	});	


	$scope.addTag = function(tag){

		$scope.contributionData.tags.push(tag || $scope.tag)
		$scope.tag = "";
	}

	$scope.createNewContribution = function(){

		$http({
				  method  : 'POST',
				  url     : '/api/contributions/',
				  data    : $scope.contributionData,  // pass in data as strings
				  headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
				 })
				.success(function(data) {
				    
					alert("Contribution Created");  
					refresh();  

				})
		
	}

}]);