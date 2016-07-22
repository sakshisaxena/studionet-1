angular.module('studionet')

.controller('HomeCtrl', ['$scope', 'profile', 'Upload', function($scope, profile, Upload){
	$scope.user = profile.user;
	$scope.modules = profile.modules;

	$scope.isAdmin = profile.modules.reduce(function(res, curr){
		return res || curr.r.properties.role==='Admin';
	}, false);

	$scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: '/uploads/avatar',
      data: {username: $scope.username, file: file},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
   }

}]);