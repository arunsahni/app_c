var collabmedia = angular.module('collabmedia');
collabmedia.controller('metametatagCtrl',function($rootScope,$scope,$http,$location,loginService,$window,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	//alert('here');
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	$scope.loaded=false;
	
	
	
	$scope.amit={};
	$http.get('/metaMetaTags/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data.response;
				//<-- parul table code starts-->
				
				$scope.mmtData=data.data.response;
				$scope.mmtData=($scope.mmtData==undefined)?"":$scope.mmtData;
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
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.mmtData, params.filter()) :
		                    $scope.mmtData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.mmtData;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        },$scope:{$data:{}}
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
		    });
				
				// parul table code ends
			}
		
				$scope.loaded=true;
				
			
	})
	$scope.mmt={};
	$scope.addmmt = function(isValid){
		if(isValid){
			$http.post('/metaMetaTags/add',$scope.mmt).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.mmtData=data.data.response;
					$scope.mmtData=($scope.mmtData==undefined)?"":$scope.mmtData;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Meta meta tag added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#myModal').modal('hide');

				}else if(data.data.code==400){
					$scope.dupMsg="A meta meta tag with the same name already exists.";
					}	
			})
		}
	}
	$scope.mmtdomains=[];
	$scope.domains={};
	$http.get('/domains/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.domains=data.data.response;
			}	
	})
	
	$scope.selectedMeta="";
	
	$scope.openDomains = function(metatagid){	
		$scope.selectedMeta=metatagid;
		$scope.mmtdomains=[];
		for(key in $scope.amit){
			if($scope.amit[key]._id==metatagid){
				for(k in $scope.amit[key].Domains){
					$scope.mmtdomains.push($scope.amit[key].Domains[k].DomainId)
				}
				console.log("mmtdomains");
				console.log($scope.mmtdomains);
			}
		}		
		$('#domainModal').modal('show');
	}
	
	$scope.addDomains = function(isValid){	
		if(isValid){			
			$http.post('/metaMetaTags/addDomains',{"mmt":$scope.selectedMeta,"domains":$scope.mmtdomains}).then(function (data, status, headers, config) {				
				$scope.amit=data.data.response;
				$scope.mmtdomains=[];
				for(key in $scope.amit){
					if($scope.amit[key]._id==$scope.selectedMeta){
						for(k in $scope.amit[key].Domains){
							$scope.mmtdomains.push($scope.amit[key].Domains[k].DomainId)
						}
					}
				}
				$scope.mmtData=data.data.response;
				$scope.tableParams.reload();
				//$scope.msg1="Meta meta tag added successfully.";
					//$window.localStorage['addMmtag']=true;
					//$window.location.reload();
				$('#domainModal').modal('hide');
			})
		}	
	}
	
	$scope.deletemmt = function(){		
		$http.post('/metaMetaTags/delete',$scope.mmt).then(function (data, status, headers, config) {				
				$scope.mmtData=data.data.response;
				$scope.mmtData=($scope.mmtData==undefined)?"":$scope.mmtData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Meta meta tag deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				//$scope.msg1="Meta meta tag deleted successfully.";				
				$('#delete_pop').modal('hide');
		})		
	}
	
	$scope.opendelete = function(MMT){
		$scope.dupMsg="";
		$scope.mmt.id=MMT._id;
		$('#delete_pop').modal('show');
	}
	
	
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.dupMsg="";
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
		$scope.dupMsg="";
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
					$('#myModal').modal('hide');

				}
				else if(data.data.code==400){
					$scope.dupMsg="A meta meta tag with the same name already exists.";
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