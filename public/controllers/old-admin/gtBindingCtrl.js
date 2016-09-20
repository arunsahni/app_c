var collabmedia = angular.module('collabmedia');
collabmedia.controller('gtbindingCtrl',function($rootScope,$scope,$http,$location,loginService,$window,$stateParams,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	
	$scope.call=[{"id":"More","value":"More"},{"id":"Less","value":"Less"},{"id":"Think","value":"Think"}]
	$scope.loaded=false;
	$scope.amit={};
	$scope.gtbinding={};
	$scope.gtbinding.id=$stateParams.id;
	$http.post('/gtbinding/view',{id:$stateParams.id}).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data.response;
				$scope.result=[];
				//console.log($scope.amit);
				
				//console.log("less="+$scope.amit.Less.length);
				//console.log("more="+$scope.amit[0].More.length);
				//console.log("think="+$scope.amit[0].Think.length);
				for(i=0;i<$scope.amit[0].Less.length;i++)
				{
					$scope.amit[0].Less[i].callButton="Less";
					$scope.result.push($scope.amit[0].Less[i]);
				}
				for(i=0;i<$scope.amit[0].More.length;i++)
				{
					$scope.amit[0].More[i].callButton="More";
					$scope.result.push($scope.amit[0].More[i]);
				}
				for(i=0;i<$scope.amit[0].Think.length;i++)
				{
					$scope.amit[0].Think[i].callButton="Think";
					$scope.result.push($scope.amit[0].Think[i]);
				}
				//<-- parul table code starts-->
				
				
				$scope.result=($scope.result==undefined)?"":$scope.result;
			
				//console.log(data);
			
			
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   callButton: ''       // initial filter
			       },
			       sorting: {
				   callButton: 'desc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			//$timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.result, params.filter()) :
		                    $scope.result;
		            var orderedData = params.sorting() ?
		        $filter('orderBy')(filteredData, params.orderBy()) : $scope.result;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        //},500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
				
			},$scope: {$data: {}}
		    });
			
				
				// parul table code ends
				
				
				
			}	$scope.loaded=true;
	})
	
	$scope.mmts={};
	
	$http.get('/metaMetaTags/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.mmts=data.data.response;
			}	
	})
	
	$scope.mts={};
		
	$scope.fetchmts=function(){		
		for(key in $scope.mmts){
			if($scope.mmts[key]._id==$scope.gtbinding.mmt){
				$scope.mts=$scope.mmts[key].MetaTags;				
			}		
		}
	}
	$scope.gts={};
	$scope.fetchgts=function(){		
		$http.post('/groupTags/viewmt',{mt:$scope.gtbinding.mt}).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.gts=data.data.response;
			}	
		})
	}
	
	$scope.addgtbinding = function(isValid){
		if(isValid){		
		$http.post('/gtbinding/add',$scope.gtbinding).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.amit=data.data.response;
				$scope.result=[];
				//console.log($scope.amit);
				
				//console.log("less="+$scope.amit.Less.length);
				//console.log("more="+$scope.amit[0].More.length);
				//console.log("think="+$scope.amit[0].Think.length);
				for(i=0;i<$scope.amit[0].Less.length;i++)
				{
					$scope.amit[0].Less[i].callButton="Less";
					$scope.result.push($scope.amit[0].Less[i]);
				}
				for(i=0;i<$scope.amit[0].More.length;i++)
				{
					$scope.amit[0].More[i].callButton="More";
					$scope.result.push($scope.amit[0].More[i]);
				}
				for(i=0;i<$scope.amit[0].Think.length;i++)
				{
					$scope.amit[0].Think[i].callButton="Think";
					$scope.result.push($scope.amit[0].Think[i]);
				}
				
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Group tag binding added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				$('#myModal').modal('hide');

			}	
		})
		}
	}
	
	$scope.deletegtbinding = function(){
	
		$http.post('/gtbinding/delete',$scope.gtbinding).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.amit=data.data.response;
				$scope.result=[];
				//console.log($scope.amit);
				
				//console.log("less="+$scope.amit.Less.length);
				//console.log("more="+$scope.amit[0].More.length);
				//console.log("think="+$scope.amit[0].Think.length);
				for(i=0;i<$scope.amit[0].Less.length;i++)
				{
					$scope.amit[0].Less[i].callButton="Less";
					$scope.result.push($scope.amit[0].Less[i]);
				}
				for(i=0;i<$scope.amit[0].More.length;i++)
				{
					$scope.amit[0].More[i].callButton="More";
					$scope.result.push($scope.amit[0].More[i]);
				}
				for(i=0;i<$scope.amit[0].Think.length;i++)
				{
					$scope.amit[0].Think[i].callButton="Think";
					$scope.result.push($scope.amit[0].Think[i]);
				}
				
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Group tag binding deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				$('#delete_pop').modal('hide');

			}	
		})
	}
	
	$scope.edit=0;
	
	$scope.openadd = function(){
		$scope.gtbinding.mmt="";
		$scope.gtbinding.mt="";
		$scope.gtbinding.gt="";
		$('#myModal').modal('show');
		$scope.edit=0;
	}
	
	$scope.opendelete = function(GT){
		$scope.gtbinding.tagid=GT._id;		
		$scope.gtbinding.call=GT.callButton;
		$('#delete_pop').modal('show');
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