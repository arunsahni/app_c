var collabmedia = angular.module('collabmedia');
collabmedia.controller('domainmmtCtrl',function($rootScope,$scope,$http,$location,loginService,$window,$timeout,$stateParams,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	//alert(1);
	$scope.loaded=false;
	$scope.mmtid=$stateParams.id;
	$scope.amit={};
	$scope.domainmmt={};
	
	/* if ($window.localStorage['addMmt']=='true') {
		//code
		$scope.msg1='Meta meta tag added successfully';
		$window.localStorage['addMmt']=false;
	}
	if ($window.localStorage['editMmt']=='true') {
		//code
		$scope.msg1='Meta meta tag updated successfully';
		$window.localStorage['editMmt']=false;
	}
	if ($window.localStorage['delMmt']=='true') {
		//code
		$scope.msg1='Meta meta tag deleted successfully';
		$window.localStorage['delMmt']=false;
	}*/
	
	
	
	$http.post('/metaMetaTags/view',{domainid:$stateParams.id}).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data.response;
				//<-- parul table code starts-->
				
				$scope.mmtData=data.data.response;
				$scope.mmtData=($scope.mmtData)?$scope.mmtData:[];
			
				//console.log(data);
			
			
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   MetaMetaTagTitle: ''       // initial filter
			       },
			       sorting: {
				   LastModified: 'desc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			     $timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.mmtData, params.filter()) :
		                    $scope.mmtData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.mmtData;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        }
			,500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
			},$scope: {$data: {}}
		    });
			
			
				//console.log($scope.tableParams);
				// parul table code ends
				// $scope.tableParams.settings().$scope = $scope;
				//console.log($scope.amit);		
			}
			
				
				$scope.loaded=true;
				console.log($scope.tableParams);
	})
	
	$scope.amit1={};
	$http.get('/metaMetaTags/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit1=data.data.response;
				
			}	
	})
	
	$scope.mmt={};
	$scope.mmt.domainid=$scope.mmtid;
	$scope.addmmt = function(isValid){
		if(isValid){
		$http.post('/metaMetaTags/add',$scope.mmt).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.mmtData=data.data.response;
				$scope.mmtData=($scope.mmtData)?$scope.mmtData:[];
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Meta meta tag added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				
				if ($scope.tableParams) {
					
					$scope.tableParams.reload();
				}else{
					$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   MetaMetaTagTitle: ''       // initial filter
			       },
			       sorting: {
				   LastModified: 'desc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			     $timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.mmtData, params.filter()) :
		                    $scope.mmtData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.mmtData;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        }
			,500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
			},$scope: {$data: {}}
		    });
				}
				$('#myModal').modal('hide');

			}	
		})
		}
	}
	$scope.edit=0;
	
	//existingMMT
	
	$scope.openexisting = function(){		
		$('#existingMMT').modal('show');
	}
	
	$scope.addexistingmmt = function(isValid){
		if(isValid){
		$http.post('/metaMetaTags/addDomain',{id:$scope.mmt.id,domainid:$stateParams.id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.mmtData=data.data.response;
				$scope.mmtData=($scope.mmtData==undefined)?[]:$scope.mmtData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Meta meta tag added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				//$scope.tableParams.reload();
				//$scope.msg1="Meta meta tag added successfully.";
				//$window.localStorage['addMmt']=true;
				//$window.location.reload();
				
				if ($scope.tableParams) {
					
					$scope.tableParams.reload();
				}else{
					$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   MetaMetaTagTitle: ''       // initial filter
			       },
			       sorting: {
				   LastModified: 'desc'     // initial sorting
			       }
						// count per page
					    }, {
						 total: 0, // length of data
					 getData: function($defer, params) {
					     // use build-in angular filter
					      $timeout(function() {
					     var filteredData = params.filter() ?
						     $filter('filter')($scope.mmtData, params.filter()) :
						     $scope.mmtData;
					     var orderedData = params.sorting() ?
						     $filter('orderBy')(filteredData, params.orderBy()) : $scope.mmtData;
					     params.total(orderedData.length); // set total for recalc pagination
					     $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
					 }
					 ,500);
					 // getData: function($defer, params) {
					 //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					 // }
					 },$scope: {$data: {}}
				     });
				}
				
				$('#existingMMT').modal('hide');
			}	
		})
		}
	}
	
	
	$scope.openadd = function(){
		$scope.mmt.name="";
		$scope.mmt.notes="";
		$scope.mmt.id="";
		$('#myModal').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.openedit = function(MMT){
		$scope.mmt.name=MMT.MetaMetaTagTitle;
		$scope.mmt.notes=MMT.Notes;
		$scope.mmt.id=MMT._id;
		$scope.edit=1;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.editmmt = function(isValid){
		if(isValid){
			$http.post('/metaMetaTags/edit',$scope.mmt).then(function (data, status, headers, config) {
					if (data.data.code==200){
					$scope.mmtData=data.data.response;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Meta meta tag updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					//$window.localStorage['editMmt']=true;
					//$window.location.reload();
					$('#myModal').modal('hide');

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
	//-------------------------- for theme and links ==> STARTS---------------->
	//highlight current / active link
	$('ul.main-menu li a').each(function(){
		if($($(this))[0].href==String(window.location))
			$(this).parent().addClass('active');
	});
	
	//themes, change CSS with JS
	//default theme(CSS) is cerulean, change it if needed
	var current_theme = $.cookie('current_theme')==null ? 'cerulean' :$.cookie('current_theme');
	//alert(current_theme);
	switch_theme(current_theme);
	
	$('#themes a[data-value="'+current_theme+'"]').find('i').addClass('icon-ok');
				 
	$('#themes a').click(function(e){
		//alert('hi');
		e.preventDefault();
		current_theme=$(this).attr('data-value');
		$.cookie('current_theme',current_theme,{expires:365});
		switch_theme(current_theme);
		$('#themes i').removeClass('icon-ok');
		$(this).find('i').addClass('icon-ok');
	});
	
	
	function switch_theme(theme_name)
	{
		//alert('switch_theme');
		$('#bs-css').attr('href','../assets/charisma/css/bootstrap-'+theme_name+'.css');
	}
	
	//-------------------------- for theme and links ==> STARTS---------------->
});