var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('boardCtrl',function($scope,$http,$location,loginService,$window,$stateParams,ngTableParams,$filter){
      var userdata={};
      var ud=[];
      loginService.chkUserLogin($http,$location,$window).then(function(){
              $scope.userInfo = tempData;
              //$rootScope.userInfo
              userdata=$scope.userInfo;
              console.log(userdata)
              for(k in userdata.FSGs){
                      ud.push(k+'~'+userdata.FSGs[k])
              }
              
              
              
      });
      
      dat={};
      $scope.projid=$stateParams.id;
      dat.project=$stateParams.id;
      $http.get('/boards/userBoards').then(function (data, status, headers, config) {
         if (data.data.code==200){
                 $scope.boards=data.data.response;
                 //<-- parul table code starts-->
				
				//var data=data.data.response;
			
				//console.log(data);
			
			
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 3,
			       filter: {
				   Title: ''       // initial filter
			       },
			       sorting: {
				   ModifiedDate: 'asc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			//$timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.boards, params.filter()) :
		                    data;
		            var orderedData = params.sorting() ?
		        $filter('orderBy')(filteredData, params.orderBy()) : $scope.boards;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        //},500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
				
			},$scope: {$data: {}}
		    });
                       // console.log($scope.projects);
			
				
				// parul table code ends
                 
         }	
      })
      
      
      
      $scope.project={};
      
      $scope.deleteBoard=function(board_del){
         
         var data={};
            data.id=board_del;   
         if (confirm('Are you sure you want to delete this Board?')) {            
            $http.post('/boards/delete',data).then(function (data, status, headers, config) {
               window.localStorage['deleteBoard']=true;
			   if (data.data.code==200){                     
                  $scope.boards=data.data.response;
				  window.localStorage['deleteBoard']=true;
               }
               $window.location.reload();
            })
         }
      }
      
});