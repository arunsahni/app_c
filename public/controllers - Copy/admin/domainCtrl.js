var collabmedia = angular.module('collabmedia');
collabmedia.controller('domainCtrl',function($rootScope,$timeout,$state,$scope,$http,$location,loginService,$window,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	
	$scope.loaded=false;
	/*
	if ($window.localStorage['addDomain']=='true') {
		//code
		$scope.msg1='Domain added successfully';
		$window.localStorage['addDomain']=false;
	}
	if ($window.localStorage['editDomain']=='true') {
		//code
		$scope.msg1='Domain updated successfully';
		$window.localStorage['editDomain']=false;
	}
	if ($window.localStorage['delDomain']=='true') {
		//code
		$scope.msg1='Domain deleted successfully';
		$window.localStorage['delDomain']=false;
	}*/
	$scope.amit={};
	init();
	function init(){
		$http.get('/domains/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				//$scope.amit=data.data.response;
				//setPagingData($scope.amit,$scope);
				//pagingService.setPagingData($scope.amit,$scope);
				//<-- parul table code starts-->
				
				$scope.domainData=data.data.response;
				$scope.domainData=($scope.domainData==undefined)?"":$scope.domainData;
			
				//console.log(data);
			
			
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   DomainTitle: ''       // initial filter
			       },
			       sorting: {
				   LastModified: 'desc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			//$timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.domainData, params.filter()) :
		                    data;
		            var orderedData = params.sorting() ?
		        $filter('orderBy')(filteredData, params.orderBy()) : $scope.domainData;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        //},500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
				
			},$scope: {$data: {}}
		    });
			
				
				// parul table code ends
				//$scope.$apply();
			}
			setTimeout(function(){
				
				$scope.loaded=true;
				},10);
		})
		
		
	}
	
	/*function setPagingData(datam){
		$scope.allData = {};
		$scope.perPage = 10;
		//$scope.allData = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		$scope.allData = datam;
		$scope.offset = 0;
		$scope.navButtons = [];
		
		$scope.isPreviousDisabled = false;
		$scope.isNextDisabled = false;

		$scope.buildNavButtons = function () {
			for (var i = 0, len = ($scope.allData.length / $scope.perPage); i < len; i = i + 1) {
				$scope.navButtons.push(i);
			}
			//alert("Nav Buttons : " + $scope.navButtons);
		}

		$scope.paginate = function() {
			$scope.data = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
			//alert("Sliced Data : " + $scope.data);
			//alert('length='+$scope.data.length);
		};

		$scope.previous = function() {
			$scope.offset = $scope.offset - $scope.perPage;
			
		};

		$scope.next = function() {
//alert("offset value : "+os);
			$scope.offset = $scope.offset + $scope.perPage;
			//alert('length='+$scope.data.length)
		};	

		$scope.$watch('offset', function() {
			
			if( $scope.offset < 0 ){
				$scope.isPreviousDisabled = true;
				$scope.isNextDisabled = false;
				//alert("Previous button disabled : "+$scope.offset);
				$scope.offset = 0;
				if ($scope.data.length<10) {
					$scope.isNextDisabled = false;
					//code
				}
				//alert("Offset Value changed to : "+$scope.offset);
				return false;
			}
			else{
				$scope.isPreviousDisabled = false;
			}
			
			//disable Next button
			//if( $scope.offset > (($scope.perPage * ($scope.allData.length/$scope.perPage))-1) ){
			if( $scope.offset > ($scope.allData.length-1) ){
				$scope.isNextDisabled = true;
				$scope.isPreviousDisabled = false;
				//alert("Next button disabled : "+$scope.offset);
				$scope.offset = ($scope.perPage * ($scope.allData.length/$scope.perPage));
				//alert("Offset Value changed to : "+$scope.offset);
				return false;
			}
			else{
				$scope.isNextDisabled = false;
			}
			$scope.paginate();
			//alert("In else...");
		});
		$scope.buildNavButtons();
			//alert('offset='+$scope.offset);
	}*/
	//alert('offset='+$scope.offset);
	$scope.domain={};
	$scope.adddomain = function(isValid){
		if(isValid){
		$http.post('/domains/add',$scope.domain).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.domainData=data.data.response;
				$scope.domainData=($scope.domainData==undefined)?"":$scope.domainData;
				//$scope.msg1="Domain addded successfully.";
				$("p").css("display", "block");
				//init();
				//$window.location.reload();
				//$scope.tableParams.total(data.length);
				$scope.tableParams.reload();
				//$window.localStorage['addDomain']=true;
				$('#myModal').modal('hide');
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Domain added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				//$window.location.reload();
				
			}	
		})
		}
	}
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.domain.name="";
		$scope.domain.notes="";
		$scope.domain.id="";
		
		$scope.edit=0;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
		
	}
	
	$scope.openedit = function(Domain){
		$scope.domain.name=Domain.DomainTitle;
		$scope.domain.notes=Domain.Notes;
		$scope.domain.id=Domain._id;
		$scope.edit=1;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.editdomain = function(isValid){
		if(isValid){
			$http.post('/domains/edit',$scope.domain).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.domainData=data.data.response;
					//alert('edit domain');
					//$window.localStorage['editDomain']=true;
					//$window.location.reload();
					//$window.location.reload();
					//$scope.msg1="Domain updated successfully.";
					$("p").css("display", "block");
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Domain updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#myModal').modal('hide');
					
				}	
			})
		}
	}
	
	$scope.domainId	=	"";
	$scope.openDelete = function(id){
		$scope.domainId = id;
		$('#delete_pop').modal('show');
	}
	
	$scope.deleteDomain = function(id){
		$http.post('/domains/delete',{"id":id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.domainData = data.data.response;
				$scope.domainData=($scope.domainData==undefined)?"":$scope.domainData;
				//$window.localStorage['delDomain']=true;
				//$window.location.reload();
				//$scope.msg1="Domain deleted successfully.";
				//$scope.$apply;
				$("p").css("display", "block");
				//$scope.tableParams.total(data.length);
				$scope.tableParams.reload();
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Domain deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";

				//$state.reload();
				$('#delete_pop').modal('hide');
			}	
		})
	}
	
	$scope.adminLogout = function() {
		console.log("asdasdasd");
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
	