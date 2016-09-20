var collabmedia = angular.module('collabmedia');


collabmedia.compileProvider.directive('autoFillSync', function($timeout) {
   return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
          var origVal = elem.val();
          $timeout(function () {
              var newVal = elem.val();
              if(ngModel.$pristine && origVal !== newVal) {
                  ngModel.$setViewValue(newVal);
                  
              }
          }, 500);
      }
   }
})


collabmedia.controllerProvider.register('projectsCtrl',function($scope,$http,$location,loginService,$timeout,$window,$stateParams,ngTableParams,$filter){
      var userdata={};
      var ud=[];
      $scope.loaded=false;
      $("#div1").keydown(function(){
         //alert(1);
         $scope.err=true;
         $(this).find("p").css("display", "block");
       });
      $('#div2').click(function() {
            //alert(1);
         $scope.err=true;
         $(this).find("p").css("display", "block");
        });

      loginService.chkUserLogin($http,$location,$window).then(function(){
              $scope.userInfo = tempData;
              userdata=$scope.userInfo;
              
              for(k in userdata.FSGs){
                      ud.push(k+'~'+userdata.FSGs[k])
              }
              
              
              
      });
      
      document.getElementById('close_span').addEventListener('click', function(e) {
              // $("#msg").fadeOut();
              //alert("click");
              $("#close_span").parent().fadeOut();
              
           }, false);
	$(".close_icon").click(function(){
         //alert(1);
         //$scope.msg2="";
         $(this).parent().fadeOut();
         });
      $http.get('/projects').then(function (data, status, headers, config) {
         if (data.data.code==200){
                 $scope.projects=data.data.response;
                 $scope.projects=($scope.projects)?($scope.projects):[];
                 //<-- parul table code starts-->

//var data=data.data.response;
			
				//console.log(data);
			
			
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 5,
			       filter: {
				   ProjectTitle: ''       // initial filter
			       },
			       sorting: {
				   ProjectTitle: 'asc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			//$timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.projects, params.filter()) :
		                    data;
		            var orderedData = params.sorting() ?
		        $filter('orderBy')(filteredData, params.orderBy()) : $scope.projects;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        //},500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
				
			},$scope: {$data: {}}
		    });
                        console.log($scope.projects);
			
				
				// parul table code ends
         }
        // setTimeout(function(){
				
				$scope.loaded=true;
	//			},10);
      })
      
      
      
      $http.get('/domains/view').then(function (data, status, headers, config) {
         if (data.data.code==200){
                 $scope.domains=data.data.response;
         }	
      })
      
      $scope.addProject=function(isValid){
         if (isValid) {
            if ($scope.project.id!="") {
               console.log(1);
               var dat={};
               dat=$scope.project;
               $http.post('/projects/edit',dat).then(function (data, status, headers, config) {
                  if (data.data.code==200){
                     
                     $scope.projects=data.data.response;
                     $scope.projects=($scope.projects)?($scope.projects):[];
                     $scope.tableParams.reload();
		     $scope.add=0;
		     $scope.msg='Project updated successfully';
                     $("p").css("display", "block");
                            
                  }
               })
            }         
            else{
               console.log(2);
               $http.post('/projects/add',$scope.project).then(function (data, status, headers, config) {
                  if (data.data.code==200){
                     $scope.projects=data.data.response;
                 $scope.projects=($scope.projects)?($scope.projects):[];
                     if ($scope.tableParams) {
                        //code
                        $scope.tableParams.reload();
                     }else{
                        $scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 5,
			       filter: {
				   ProjectTitle: ''       // initial filter
			       },
			       sorting: {
				   ProjectTitle: 'asc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			//$timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.projects, params.filter()) :
		                    data;
		            var orderedData = params.sorting() ?
		        $filter('orderBy')(filteredData, params.orderBy()) : $scope.projects;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        //},500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
				
			},$scope: {$data: {}}
		    });
                     }
                     
                     $scope.add=0;
                     $scope.msg='Project added successfully';
                      $("p").css("display", "block");
                  }
               })
            }
         }else{
            $("p").css("display", "block");
            $scope.msg2="Please complete all the fields to proceed.";
      }
      }
      $scope.add=0;
      $scope.showAdd = function(val){
         $scope.err=false;
         $scope.project.id="";
         $scope.add=1;
         $timeout(function(){
            //alert('ac');
            document.getElementById("name").focus();
            },200);
        
         //document.getElementById("name").reset();
         //document.getElementById("domain").reset();
         if (typeof(val)=='undefined') {
            $scope.project.domain="";
            $scope.project.name="";
         }
         else{
            $scope.project.id=val._id;
            for(i in $scope.projects){
               if(val._id==$scope.projects[i]._id) {
                  $scope.project.name=$scope.projects[i].ProjectTitle;
                  $scope.project.domain=$scope.projects[i].Domain._id;
               }
            }            
         }     
         
      }
      $("#delete_pop").hide();
      $scope.project={};
      
      
      
      $scope.closeDel=function(){
         $("#delete_pop").hide();
      }
      
      
      $scope.confirmDel=function(){
         var dat={}
            dat.id=$scope.delItem._id;
         $("#delete_pop").hide();
            
            $http.post('/projects/delete',dat).then(function (data, status, headers, config) {
                                          $scope.msg="Project deleted successfully";
		  
                                          $scope.projects=data.data.response;
                                          $scope.projects=($scope.projects)?($scope.projects):[];
                                          if ($scope.tableParams) {
                        //code
                        $scope.tableParams.reload();
                     }else{
                        $scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 5,
			       filter: {
				   ProjectTitle: ''       // initial filter
			       },
			       sorting: {
				   ProjectTitle: 'asc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			//$timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.projects, params.filter()) :
		                    data;
		            var orderedData = params.sorting() ?
		        $filter('orderBy')(filteredData, params.orderBy()) : $scope.projects;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        //},500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
				
			},$scope: {$data: {}}
		    });
                     }
					 //$window.localStorage['projectDel']=true;
                                          $("p").css("display", "block");
                     //$window.location.reload();
                  	
               })
      };
      
      
      $scope.deleteProject=function(project_del){
         //console.log(e, "eeeeeeeeeeeee");
         var dat={};
          //$(document).ready(function(){
          $("#delete_pop").show();
			
         $scope.delItem=project_del;
            
            /*
         if (confirm('Are you sure you want to delete this Project?')) {
            
            $http.post('/projects/delete',dat).then(function (data, status, headers, config) {
                                          $scope.msg="Project deleted successfully";
		  
                                          $scope.projects=data.data.response;
                                          $scope.projects=($scope.projects)?($scope.projects):[];
                                          if ($scope.tableParams) {
                        //code
                        $scope.tableParams.reload();
                     }else{
                        $scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 5,
			       filter: {
				   ProjectTitle: ''       // initial filter
			       },
			       sorting: {
				   ProjectTitle: 'asc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			//$timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.projects, params.filter()) :
		                    data;
		            var orderedData = params.sorting() ?
		        $filter('orderBy')(filteredData, params.orderBy()) : $scope.projects;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        //},500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
				
			},$scope: {$data: {}}
		    });
                     }
					 //$window.localStorage['projectDel']=true;
                                          $("p").css("display", "block");
                     //$window.location.reload();
                  	
               })
         }*/
         
         
      }
      
      if (typeof($stateParams.id)!='undefined') {
         $scope.id=$stateParams.id;
         
        
         
         
         for(i in $scope.projects){
            if($scope.id==$scope.projects[i]._id) {
               $scope.project.name=$scope.projects[i].ProjectTitle;
               $scope.project.domain=$scope.projects[i].Domain._id;
               //alert($scope.projects[i].Domain._id)
               $('#domain').val($scope.projects[i].Domain._id);
            }
         }
      }
      
      
      
      
});