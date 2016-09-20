var collabmedia = angular.module('collabmedia');
collabmedia.controller('metatagCtrl',function($rootScope,$scope,$http,$location,loginService,$window,$stateParams,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	
	
	
	
	
	$scope.id=$stateParams.id;
	$scope.amit={};
	$http.post('/metaTags/view',{"id":$scope.id}).then(function (data, status, headers, config) {			
		if (data.data.code==200){				
			//$scope.amit=data.data.response;
			//<-- parul table code starts-->
				
				$scope.mtData=data.data.response;
				$scope.mtData=($scope.mtData==undefined)?"":$scope.mtData;
				//console.log(data);
	
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   MetaTagTitle: ''       // initial filter
			       },
			       sorting: {
				   LastModified: 'desc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.mtData, params.filter()) :
		                    $scope.mtData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.mtData;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        },$scope:{$data:{}}
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
		    });
				
				// parul table code ends
		}
				setTimeout(function(){
				
				$scope.loaded=true;
				},10);
	});
	$scope.mt={};
	
	$scope.addmt = function(isValid){
		$scope.dupMsg="";
		if(isValid){
			$http.post('/metaTags/add',$scope.mt).then(function (data, status, headers, config) {
				if (data.data.code==200){
					//console.log(data)
				$scope.mtData=data.data.response;
				$scope.mtData=($scope.mtData==undefined)?"":$scope.mtData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Meta tag added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
					$('#myModal').modal('hide');
				}else if(data.data.code==400){
					$scope.dupMsg="A meta Tag with this name already exists.";
					}	
			})
		}
	}
	
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.dupMsg="";
		$scope.mt.name="";
		$scope.mt.notes="";
		$scope.mt.metaid="";
		$scope.mt.id=$scope.id;
		$('#myModal').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.openedit = function(MT){
		$scope.dupMsg="";
		$scope.mt.name=MT.MetaTagTitle;
		$scope.mt.notes=MT.Notes;
		$scope.mt.metaid=MT._id;
		$scope.mt.id=$scope.id;
		console.log(MT._id);
		$scope.edit=1;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.deletemt = function(){		
		$http.post('/metaTags/delete',$scope.mt).then(function (data, status, headers, config) {				
				$scope.mtData=data.data.response;
				$scope.mtData=($scope.mtData==undefined)?"":$scope.mtData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Meta tag deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				//$scope.msg1=" Meta tag deleted successfully.";
				$('#delete_pop').modal('hide');
		})		
	}
	
	$scope.opendelete = function(MT){
		$scope.mt.name=MT.MetaTagTitle;	
		$scope.mt.mtid=MT._id;
		$scope.mt.id=$scope.id;		
		$('#delete_pop').modal('show');
	}
	
	
	
	
	$scope.editmt = function(isValid){
		if(isValid){
			console.log($scope.mt);
			$http.post('/metaTags/edit',$scope.mt).then(function (data, status, headers, config) {
				if (data.data.code==200){
				$scope.mtData=data.data.response;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Meta tag updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
					$('#myModal').modal('hide');

				}else if(data.data.code==400){
					$scope.dupMsg="A meta Tag with this name already exists.";
					}	
			})
		}
	}
	
	$scope.adminLogout = function() {
		$http.get('/admin/logout').then(function (data, status, headers, config) {
			if (data.data.logout=="200"){
				tempData = {};
				$window.location.href='/admin/login';
			}	
		})
	};
	
});