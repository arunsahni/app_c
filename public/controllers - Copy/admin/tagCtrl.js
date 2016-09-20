var collabmedia = angular.module('collabmedia');
collabmedia.controller('tagCtrl',function($rootScope,$scope,$http,$location,loginService,$window,$stateParams,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	$scope.loaded=false;
	$scope.t={};
	////////////////Test start
	$scope.id=$stateParams.id;
	if($scope.id == '54e7214560e85291552b1189'){
		$scope.showDel = false;
	}else{
		$scope.showDel = true;
	}
	$scope.amit={};
	
	
	
	$http.post('/tags/view',{"id":$scope.id}).then(function (data, status, headers, config) {			
		if (data.data.code==200){				
			$scope.amit=data.data.response;
			//<-- parul table code starts-->
				
				$scope.tagData=data.data.response;
				$scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
				//console.log(data);
	
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   TagTitle: ''       // initial filter
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
		                    $filter('filter')($scope.tagData, params.filter()) :
		                    $scope.tagData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.tagData;
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
	
	$scope.addt = function(isValid){
		if(isValid){
		$http.post('/tags/add',$scope.t).then(function (data, status, headers, config) {
			if (data.data.code==200){
				console.log(data)
				$scope.amit=data.data.response;
				$scope.tagData=data.data.response;
				$scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				$('#myModal').modal('hide');
			}
			else if (data.data.code=='420') {
				$scope.msgDup='A tag with same name already exists.';
			}
		})
		}
	}
	
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.msgDup='';
		$scope.t.name="";
		$scope.t.tagid="";
		$scope.t.id=$scope.id;
		$('#myModal').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.openedit = function(T){
		$scope.t.name=T.TagTitle;
		$scope.t.tagid=T._id;
		$scope.t.id=$scope.id;
		$scope.edit=1;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.editt = function(isValid){
		if(isValid){
			$http.post('/tags/edit',$scope.t).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.amit=data.data.response;
					$scope.tagData=data.data.response;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#myModal').modal('hide');

				}	
			})
		}
	}
	
	$scope.deletet = function(){
			console.log($scope.t)
			$http.post('/tags/delete',$scope.t).then(function (data, status, headers, config) {
				
					$scope.amit=data.data.response;
					$scope.tagData=data.data.response;
					$scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#delete_pop').modal('hide');
					
			})
		
	}
	
	$scope.opendelete = function(T){
		$scope.t.name=T.TagTitle;	
		$scope.t.tagid=T._id;
		$scope.t.id=$scope.id;
		$('#delete_pop').modal('show');
	}
	
	///////////////Test End
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