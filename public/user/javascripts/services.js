angular.module('studionet')

.factory('profile', ['$http', function($http){
	var o ={
		user: {},
		modules: [],
	};

	o.getUser = function(){
		return $http.get('/api/profile/user').success(function(data){
			angular.copy(data, o.user);
		});
	};

	o.getModules = function(){
		return $http.get('/api/profile/modules').success(function(data){
			angular.copy(data, o.modules);
		});
	};

	return o;
}])

.factory('module', ['$http', function($http){

	var o = {
		module: {},
		users: []
	};

	o.getModuleInfo = function(id){
		return $http.get('/api/modules/' + id).success(function(data){
			angular.copy(data, o.module);
		});
	};

	o.getModuleUsers = function(id){
		return $http.get('/api/modules/' + id + '/users').success(function(data){
			angular.copy(data, o.users);
		});
	};
	return o;
}])

.factory('users', ['$http', function($http){

	var o = {
		users: []
	};

	o.getAllUsers = function(){
		return $http.get('/api/users').success(function(data){
			angular.copy(data, o.users);
		});
	};
	return o;

}]);