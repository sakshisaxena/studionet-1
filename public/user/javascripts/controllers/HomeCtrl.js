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

    $scope.selectedItem2 = {};

    $scope.filterRequest = function(data){

        //alert($scope.selectedItem2);
        var selectedFilters = $scope.selectedItem2;
        var grp=[];
        for(var j=0;j<selectedFilters.length;j++){
          grp.push(selectedFilters[j].id);
        }
        alert(grp);

    };

$(document).ready(function() { 

     $(".filter-heading").click(function(){
        $(this).siblings().toggle();
     });


      
      $http.get('/api/groups/').success(function(data){
        
      
        $scope.filterData=data;
        var list=data;
        var groups = [];
        var mainGrps = [];
        var numGrp=0;
        for(var i=0;i<list.length;i++){
          
          var obj = {
            name: list[i].name,
            id: list[i].id,
            parentId: list[i].parentId,
            isExpanded: false,
            children:[]
          }
          mainGrps.push(obj);
          groups[list[i].id] = obj;
        }
       
        for(var b=0;b<list.length;b++){
          var parent = list[b].parentId;
          if(groups[parent]!=null){

            groups[parent].children.push(list[b].id);

          }
        }
        
        
        var grpList = [];
       /* for(var j=0;j<mainGrps.length;j++){
          if( mainGrps[j].children.length >0){
            for(var k=0; k < mainGrps[j].children.length; k++){
              mainGrps[j].children[k] = groups[mainGrps[j].children[k]];
            }
          }
        }*/
            //grpList[j] = groups[[j]];
          for(var j=0;j<mainGrps.length;j++){
            var key = mainGrps[j].id;
            if(groups.hasOwnProperty(key)){
              for(var i=0;i<groups[key].children.length;i++){
                var id = groups[key].children[i];
                mainGrps[j].children[i] = groups[id];
             }
            }
          }

       
        //console.log(mainGrps);
        for(var j=0;j<mainGrps.length;j++){
          
          if(mainGrps[j].parentId!=null){
            
            mainGrps.splice(j,1);
            j--;
          }
        }
        $scope.data = angular.copy(mainGrps);
        $scope.datas = angular.copy(mainGrps);  
        
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


        $scope.CustomCallback = function (item, selectedItems) {
            if (selectedItems !== undefined && selectedItems.length >= 80) {
                return false;
            } else {
                return true;
            }
        };



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