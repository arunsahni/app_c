var collabmedia = angular.module('collabmedia');
collabmedia.controller('sourceCtrl',function($rootScope,$scope,$http,$location,loginService,$window,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	$scope.loaded=false;
	if ($window.localStorage['addSource']=='true') {
		//code
		$scope.msg1='Source added successfully';
		$window.localStorage['addSource']=false;
	}
	if ($window.localStorage['editSource']=='true') {
		//code
		$scope.msg1='Source updated successfully';
		$window.localStorage['editSource']=false;
	}
	if ($window.localStorage['delSource']=='true') {
		//code
		$scope.msg1='Source deleted successfully';
		$window.localStorage['delSource']=false;
	}
	$scope.result={};
	$scope.data={};
	$http.get('/sources/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				//$scope.result=data.data.response;
				//setPagingData($scope.result);
				//<-- parul table code starts-->
				
				$scope.sourceData=data.data.response;
				$scope.sourceData=($scope.sourceData==undefined)?"":$scope.sourceData;
				//console.log(data);
	
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   sourceTitle: ''       // initial filter
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
		                    $filter('filter')($scope.sourceData, params.filter()) :
		                    $scope.sourceData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.sourceData;
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
	})
	/*
	function setPagingData(datam){
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
		};

		$scope.previous = function() {
			$scope.offset = $scope.offset - $scope.perPage;
			
		};

		$scope.next = function() {
			//alert("offset value : "+os);
			$scope.offset = $scope.offset + $scope.perPage;
			
		};	

		$scope.$watch('offset', function() {
			
			if( $scope.offset < 0 ){
				$scope.isPreviousDisabled = true;
				$scope.isNextDisabled = false;
				//alert("Previous button disabled : "+$scope.offset);
				$scope.offset = 0;
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
	}
	*/
	$scope.ssource={};
	$scope.addsource = function(isValid){
		if(isValid){
			//alert("validated....");
			//alert(JSON.stringify($scope.ssource));
			$http.post('/sources/add',$scope.ssource).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.result=data.data.response;
					$scope.sourceData=data.data.response;
					$scope.sourceData=($scope.sourceData==undefined)?"":$scope.sourceData;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Source added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					//$scope.msg1="Scope added Successfully.";
					$('#myModal').modal('hide');

				}	
			})
		}
	}
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.ssource.title="";
		$scope.ssource.notes="";
		$scope.ssource.id="";
		$('#myModal').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.openedit = function(Source){
		$scope.ssource.title=Source.sourceTitle;
		$scope.ssource.notes=Source.notes;
		$scope.ssource.id=Source._id;
		$scope.edit=1;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.editsource = function(isValid){
		if(isValid){
			$http.post('/sources/edit',$scope.ssource).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.result=data.data.response;
					$scope.sourceData=data.data.response;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Source updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					//$scope.msg1="Source updated successfully.";
					$('#myModal').modal('hide');

				}	
			})
		}
	}
	
	$scope.sourceId	=	"";
	$scope.openDelete = function(id){
		$scope.sourceId = id;
		$('#delete_pop').modal('show');
	}
	
	$scope.deleteSource = function(id){
		$http.post('/sources/delete',{"id":id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.result = data.data.response;
				$scope.sourceData=data.data.response;
				$scope.sourceData=($scope.sourceData==undefined)?"":$scope.sourceData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Source deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				//$scope.msg1='Source deleted successfully';
				$('#delete_pop').modal('hide');
			}	
		})
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