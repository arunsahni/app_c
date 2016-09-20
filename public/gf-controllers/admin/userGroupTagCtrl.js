var collabmedia = angular.module('collabmedia');
collabmedia.controller('userGrouptagCtrl',function($rootScope,$scope,$http,$timeout,$location,loginService,$window,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	$scope.loaded=false;
	$scope.amit={};
	$scope.data={};
	////////////////Test start
	$scope.mmts={};
	$scope.mts={};
	//$scope.gt.mmt={};
	$scope.selected={};
	$scope.gtAll = false;
	$scope.selected.GT =[];
	
	
	
	
	
	$scope.fetchmts=function(){		
		for(key in $scope.mmts){
			if($scope.mmts[key]._id==$scope.gt.mmt){
				$scope.mts=$scope.mmts[key].MetaTags;				
			}
		}
	}
	
	$http.get('/metaMetaTags/view').then(function (data, status, headers, config) {			
		if (data.data.code==200){
			for (i in data.data.response){
				//if (data.data.response[i]._id == '54e7211a60e85291552b1187') {	// for ===== "5555" 
				if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 " 
					data.data.response.splice(i,1);
				}
			}
			$scope.mmts=data.data.response;
			
		}	
	})
	
	
	
	$http.get('/groupTags/userGt/view').then(function (data, status, headers, config) {			
		if (data.data.code==200){
			$scope.amit=data.data.response;
			$scope.data=data.data.response;
			console.log($scope.data);
			//<-- parul table code starts-->
				
				$scope.gtData=data.data.response;
				$scope.gtData=($scope.gtData==undefined)?"":$scope.gtData;
				//console.log(data);
	
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   GroupTagTitle: ''       // initial filter
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
		                    $filter('filter')($scope.gtData, params.filter()) :
		                    $scope.gtData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.gtData;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        },$scope:{$data:{}}
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
		    });
				
				// parul table code ends
			
			//alert("data : "+$scope.amit);
			//alert("data length : "+angular.toJson($scope.amit.length));
			setPagingData($scope.amit);
		}
		setTimeout(function(){
				
				$scope.loaded=true;
				},10);
	})
	
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
			//alert("Sliced Data : " + angular.toJson($scope.data));
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
	
	$scope.gt={};
	$scope.addgt = function(isValid){
		if(isValid){
		$http.post('/groupTags/add',$scope.gt).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.amit=data.data.response;
				$scope.gtData=data.data.response;
				$scope.gtData=($scope.gtData==undefined)?"":$scope.gtData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Group tag added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				$('#myModal').modal('hide');
			}	
		})
		}
	}
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.gt.mmt="";
		$scope.mt = "";
		$scope.gt.mt="";
		$scope.gt.name="";
		$scope.gt.notes="";
		$scope.gt.id="";
		$('#myModal').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	
	$scope.mt = "";
	$scope.openedit = function(GT){
		document.getElementById("mt").selectedIndex = "0";
		document.getElementById("mmt").selectedIndex = "0";
		$scope.gt.name=GT.GroupTagTitle;
		$scope.gt.notes=GT.Notes;
		$scope.msgDup=""
		$scope.gt.id=GT._id;
		$scope.edit=1;				
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.opendelete = function(GT){
		$scope.gt.mmt=GT.MetaMetaTagID;		
		$scope.gt.mt=GT.MetaTagID;
		$scope.gt.id=GT._id;
		$('#delete_pop').modal('show');
	}
	
	$scope.editgt = function(isValid){
		if(isValid){
			$scope.gt.notes=($scope.gt.notes==undefined)?"":$scope.gt.notes;
			console.log($scope.gt);
		    $http.post('/groupTags/approve',$scope.gt).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.amit=data.data.response;
					$scope.gtData=data.data.response;
					console.log("data.data.response");
					console.log(data.data.response);
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>User group tag approved successfully. You can now view it under<a href='#/grouptag'>Group Tags</a> Section <a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#myModal').modal('hide');
				}else if (data.data.code==400) {
					//alert('here');
					$scope.msgDup="A group tag with same name already exists. Please rename in order to approve it.";
				}
			})
		}
	}
	
	$scope.deletegt = function(){
                        $scope.gt.status=2;
			$http.post('/groupTags/delete',$scope.gt).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.amit=data.data.response;
					$scope.gtData=data.data.response;
					$scope.gtData=($scope.gtData==undefined)?"":$scope.gtData;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Group tag deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#delete_pop').modal('hide');
				}	
			})
	}
	
	
	$scope.selectAll = function(){
		var checked = $('#selectAllGT').is(':checked');
		if(checked){
			//$scope.selected.GT = $scope.gtData.map(function(gt){return gt._id});
			//console.log($scope.gtData.map(function(gt){return gt._id}));
			var data =[]
			$('.gtSelect').each(function(){
				data.push($(this).attr('value'))
				})
			$scope.selected.GT = data;
			//console.log(data)
		}else{
			$scope.selected.GT = [] ;
		}
	}
	
	
	$scope.setGT = function(){
		console.log($scope.selected.GT.length);
		console.log();
		$timeout(function(){
			if ($scope.selected.GT.length == $('.gtSelect').length) {
				$('#selectAllGT').prop('checked', true);
			}else{
				$('#selectAllGT').prop('checked', false);
			}
		},1);
	}
	
	$scope.deleteAll = function(){
		$http.post('/groupTags/deleteAll',{ids: $scope.selected.GT}).then(function (data, status, headers, config) {
			console.log(data.data.status);
			if (data.data.status==200){
				$http.get('/groupTags/userGt/view').then(function (data, status, headers, config) {			
					if (data.data.code==200){
						$scope.amit=data.data.response;
						$scope.data=data.data.response;
						console.log($scope.data);
						$scope.gtData=data.data.response;
						$scope.gtData=($scope.gtData==undefined)?"":$scope.gtData;
						document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Group tag(s) deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
						$scope.tableParams.reload();
						$('#deleteAll_pop').modal('hide');
					}
				})
			}	
		})
	}
	$timeout(function(){
		$('.ng-table-pager .pagination').on('click', 'li', function(){
			$scope.selected.GT = [];
			//alert(1);
			$('#selectAllGT').prop('checked', false);
			$scope.$apply();
		})
	},1000)
	
	
	
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