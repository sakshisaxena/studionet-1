angular.module('studionet')

.controller('UserCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.user = profile.user;
	$scope.modules = profile.modules;

}])


/*
 *	Controller for Groups
 * 
 */
.controller('GroupsCtrl', ['$scope', 'profile', '$http', function($scope, profile, $http){


	$scope.user = profile.user;
	$scope.modules = profile.modules;

	// Initial no group
	$scope.groups = [
		{
			'name': 'None',
			'id': -1
		}

	]


	refresh();
	function refresh(){

		$scope.groups = [		{
			'name': 'None',
			'id': -1
		}];
		$scope.users = [];

		/** better solution to get data this way from server */
		// get general list of groups
		$http.get('/api/groups/').success(function(data){
			$scope.groups = $scope.groups.concat(data);

			// append data from user modules
			for(var mod=0; mod < $scope.modules.length; mod++){
				for(var g=0; g < $scope.groups.length; g++ ){
					if($scope.modules[mod].id == $scope.groups[g].id){
						// assign role
						$scope.groups[g].role =  $scope.modules[mod].role;
					}
				}
			}

			console.log($scope.groups);
		});

		$http.get('/api/users/').success(function(data){
			$scope.users = data;
		});		
	}



	/*
	 *	0 - View Mode (No Editing)
	 *  1 - Editing Mode (only for group owner)
	 *  2 - Creating Mode
	 */
	
	$scope.displayError = false;
	$scope.displaySuccess = false;
	
	$scope.users = undefined;

	$scope.activeGroup = {

			'name' : "",
			'description' : "",
			'restricted': false,
			'groupParentId': "" 

		};


	/*** Viewing ***/
	$scope.viewGroup = function(group){
		$scope.activeGroup = group;
		
		/*
		 * Details of the group
		 */
		console.log('/api/groups/' + $scope.activeGroup.id);
		$http({
		  method  : 'GET',
		  url     : '/api/groups/' + $scope.activeGroup.id,
		 })
		.success(function(data) {
			    
		    if (data == undefined) {
				console.log("Error fetching Group Data")
		    } else {

		    	//console.log(data, data);
				// Add additional data    
				$scope.activeGroup = data;
		    }

		  })


	}

	$scope.joinGroup = function(){

	}

	$scope.editGroup = function(group){
		$scope.activeGroup = group;
	}


	/*** Creating ***/
	$scope.createGroup = function(){
		
		$scope.activeGroup = {

			'name' : "",
			'description' : "",
			'restricted': false,
			'groupParentId': "-1",
		};
	}

	$scope.toggleRestricted = function(){
		$scope.activeGroup.restricted = !$scope.activeGroup.restricted;
	}


	/** Saving Group ***/
	$scope.saveGroup = function(){

		// Convert Group Parent Id to Integer
		$scope.activeGroup.groupParentId = parseInt($scope.activeGroup.groupParentId);
		console.log($scope.activeGroup);

		/*
		
		$http({
		  method  : 'POST',
		  url     : '/api/groups/',
		  data    : $scope.activeGroup,  // pass in data as strings
		  headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
		 })
		.success(function(data) {
		    
		    if (!data.success) {
		      // if not successful, bind errors to error variables
		      //$scope.errorName = data.errors.name;
		      //$scope.errorSuperhero = data.errors.superheroAlias;
		    } else {
		      // if successful, bind success message to message
		      //$scope.message = data.message;
		    }

		  })	 */

		refresh();

	}

	$scope.saveGroupEdit = function(){

		console.log($scope.activeGroup);
		
		$http({
		  method  : 'PUT',
		  url     : '/api/groups/' + $scope.activeGroup.id,
		  data    : $scope.activeGroup,  // pass in data as strings
		  headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
		 })
		.success(function(data) {
		    
		    console.log("data", data);

		    if (!data.success) {


		      // if not successful, bind errors to error variables
		      //$scope.errorName = data.errors.name;
		      //$scope.errorSuperhero = data.errors.superheroAlias;
		    } else {
		      // if successful, bind success message to message
		      //$scope.message = data.message;
		    }

		  })	

	}


	$scope.addUser = function(){

	}





}]);
