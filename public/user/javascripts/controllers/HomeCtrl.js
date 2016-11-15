angular.module('studionet')

.controller('HomeCtrl', ['$scope', 'profile', 'Upload', '$timeout', 'modelsFactory', 'ModalService', '$http', 

 function($scope, profile, Upload, $timeout, modelsFactory, ModalService, $http){
	$scope.user = profile.user;
	$scope.modules = profile.modules;
  $scope.userModels = modelsFactory.userModels;
  
	$scope.isAdmin = profile.modules.reduce(function(res, curr){
		return res || curr.role==='Admin';
	}, false); 

  $scope.showDetailsModal = function(data) {

      ModalService.showModal({
        templateUrl: "/user/templates/home.graphView.modal.html",
        controller: "DetailsModalCtrl",
        inputs: {
          title: "A More Complex Example"
        }
      }).then(function(modal) {
        modal.element.modal({
          backdrop: 'static'
          // keyboard: false
        });

        /// set data
        modal.scope.setData(data);

/*        modal.close.then(function(result) {
          //$scope.complexResult  = "Name: " + result.name + ", age: " + result.age;
        });*/
        
      });

    };

$(document).ready(function() { 





     var filterData =
       [
        {
          "id": 1,
         
          "module": "AR232",
          "description": "desc1",
          "groups":
        
          [
              { "id": "1", "name": "Regular" },
              { "id": "2", "name": "Chocolate" },
              { "id": "3", "name": "Blueberry" },
              { "id": "4", "name": "Devil's Food" }
            ]
        ,
          
        },
        {
          "id": 1,
         
          "module": "AR232",
          "description": "desc1",
          "groups":
            [
              { "id": "1", "name": "Regular " },
              { "id": "2", "name": "Chocolate" },
              { "id": "3", "name": "Blueberry" },
              { "id": "4", "name": "Devil's Food" }
            ]
        
          
        },
        {
          "id": 1,
         
          "module": "AR232",
          "description": "desc1",
          "groups":
            [
              { "id": "1", "name": "abc" },
              { "id": "2", "name": "Chocolate" },
              { "id": "3", "name": "Blueberry" },
              { "id": "4", "name": "Devil's Food" }
            ]
          
        }
      ];


      var filterData1;
      $http.get('/api/groups/').success(function(data){
        //filterData1 = data;  
        //console.log(filterData1);
        filterData1 = [{"parent":202,"name":"Group 1a","description":"Subgroup 1 of Group 1","id":204,"restricted":"false"},
        {"parent":206,"name":"Group 2a","description":"Subgroup of Group 2","id":208,"restricted":"false"},
        {"parent":-1,"name":"Group 1","id":202,"description":"AR2332","restricted":"false"},
        {"parent":-1,"name":"Group 2","id":206,"description":"A2321","restricted":"false"}
        ];
        console.log(filterData1);
        $scope.filterData=filterData1;
                
      
      }); 

      
$('#search').trigger('click');


     $('#search').click(function(){
                        
                        var scope = angular.element("#filters").scope();
                        for(var i=0; i<scope.filterData.length;i++){
                        var d= scope.filterData[i];
                        
                        if(d.parent!=-1){
                          console.log("yes");
                          $('#'+d.parent).find('div').append('<input type="checkbox" ng-model="'+d.id+'"> '+ d.name+'</input> <br>');
                        }
                      }
                      });





});


$('.filter-option').load(function() {
        var scope = angular.element("#filters").scope();
                        for(var i=0; i<scope.filterData.length;i++){
                        var d= scope.filterData[i];
                        
                        if(d.parent!=-1){
                          console.log("yes");
                          $('#'+d.parent).find('div').append('<input type="checkbox" ng-model="'+d.id+'"> '+ d.name+'</input> <br>');
                        }
                      }
});

}]);