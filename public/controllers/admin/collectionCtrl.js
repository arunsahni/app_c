var collabmedia = angular.module('collabmedia');
collabmedia.controller('collectionCtrl',function($rootScope,$scope,$http,$location,loginService,$window,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	$scope.loaded=false;
	
	
	$scope.amit={};
	$scope.data={};
	$http.get('/collections/view').then(function (data, status, headers, config) {			
		if (data.data.code==200){
			//$scope.result=data.data.response;
			//setPagingData($scope.result);
				//<-- parul table code starts-->
				
				$scope.collectionData=data.data.response;
				$scope.collectionData=($scope.collectionData==undefined)?"":$scope.collectionData;
				
				//console.log(data);
				
				
	
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   collectionTitle: ''       // initial filter
			       },
			       sorting: {
				   LastModified: 'desc'     // initial sorting
			       }            // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.collectionData, params.filter()) :
		                    $scope.collectionData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.collectionData;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        },$scope: {$data: {}}
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
	}*/
	
	$scope.collection={};
	$scope.addcollection = function(isValid){
		if(isValid){
		$http.post('/collections/add',$scope.collection).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.result=data.data.response;
				$scope.collectionData=data.data.response;
				$scope.collectionData=($scope.collectionData==undefined)?"":$scope.collectionData;
				//$scope.msg1='Collection added successfully.';
				//$window.localStorage['addCollection']=true;
				//$window.location.reload();
				$scope.tableParams.reload();
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Collection added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$('#myModal').modal('hide');

			}	
		})
		}
	}
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.collection.name="";
		$scope.collection.notes="";
		$scope.collection.id="";
		$('#myModal').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.openedit = function(Collection){
		$scope.collection.name=Collection.collectionTitle;
		$scope.collection.notes=Collection.notes;
		$scope.collection.id=Collection._id;
		$scope.edit=1;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.editcollection = function(isValid){
		if(isValid){
			$http.post('/collections/edit',$scope.collection).then(function (data, status, headers, config) {
				if (data.data.code==200){
					//$scope.result=data.data.response;
					$scope.collectionData=data.data.response;
					$scope.tableParams.reload();
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Collection updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$('#myModal').modal('hide');
				}	
			})
		}
	}
	$scope.collectionId	=	"";
	$scope.openDelete = function(id){
		$scope.collectionId = id;
		$('#delete_pop').modal('show');
	}
	
	$scope.deleteCollection = function(id){
		$http.post('/collections/delete',{"id":id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.result = data.data.response;
				$scope.collectionData = data.data.response;
				$scope.collectionData=($scope.collectionData==undefined)?"":$scope.collectionData;
				$scope.tableParams.reload();
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Collection deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
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