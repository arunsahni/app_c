var collabmedia = angular.module('collabmedia');
collabmedia.controller('logoutCtrl',function($scope,$http,$location,$window,$rootScope){
	$rootScope.loggedIn=false;
	$http.get('/admin/logout')
			.success(function (data, status, headers, config) {				
				//alert('inside success function');
				$window.location.href='/admin';
				
			});	
	
});