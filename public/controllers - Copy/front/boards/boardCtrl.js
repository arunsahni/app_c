var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('boardCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	/*
		Action : Rename Board
	
	*/
	
    $scope.rename={};
    $scope.renameBoard = function(){
        var fields={};
        fields.id=$stateParams.id;
        fields.title=$scope.rename.title;
        if(fields.title==""){
			$scope.setFlashInstant('<span style="color:red;">Board title can not be empty.</span>' , 'error');
			return 0;
		}
		
		$http.post('/boards/rename',fields).then(function (data, status, headers, config) {
            if (data.data.code==200){  
				$scope.setFlashInstant('Board renamed successfully.' , 'error');
				//console.log("Swapnesh Rocks",data)
				$scope.title=$scope.rename.title;
				$('.ui-dialog-titlebar-close').trigger('click')
            }
            else{
                $scope.title={};
            }
        })     
    };
	
	/*
		Action : Move Board
	
	*/
	
    $scope.moveBoard = function(){
        if ($scope.project.projectid) {
            var fields={};
            fields.board=$stateParams.id;
            fields.project=$scope.project.projectid;
            fields.projectTitle=$scope.project.project;
            $http.post('/boards/move',fields).then(function (data, status, headers, config) {
                if(data.data.code==200){
					$scope.setFlash('Board moved successfully.' , 'success');
                    $window.location='/#/projects';                   
                }
                
            });
        }        
    };
    
	
	/*
		Action : Delete Board
	
	*/
	$scope.deleteBoard=function(board_del){
        $("#delete_pop").show();
        $scope.confirmDel = function() {
	        var data={};
	        data.id=$stateParams.id;
            $http.post('/boards/delete',data).then(function (data, status, headers, config){
                $scope.setFlash('Board deleted successfully.' , 'success');
                $("#delete_pop").hide();
				$window.location='/#/projects';
            })
        };
    };
	
	/*
		Action : Duplicate Board
	
	*/
    
    $scope.duplicate = function(){
        var fields={};
        fields.id=$stateParams.id;
        fields.title=$scope.duplicate.title;
        console.log(fields);
		if(fields.title=="" || fields.title=="undefined" || fields.title==undefined){
			//alert("m here--");
			$scope.setFlashInstant('<span style="color:red;">Board title can not be empty.</span>' , 'error');
			return 0;
		}
		else{
			//alert("m here--In else"+fields.title);
		}
		
        $http.post('/boards/duplicate',fields).then(function (data, status, headers, config) {
            if (data.data.code==200){         
                //$scope.setFlashInstant('Board duplicated successfully.' , 'success');
				$scope.setFlash('Board duplicated successfully.' , 'success');
				$window.location='/#/boards/'+data.data.message;
            }
            else{
              $scope.medias={};
            }
        })     
    };
	
});
