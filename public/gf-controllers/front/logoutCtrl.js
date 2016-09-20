var collabmedia = angular.module('collabmedia');
collabmedia.controllerProvider.register('logoutCtrl',function($scope,$http,$location,$window){
	
	$http.get('/user/logout')
			.success(function (data, status, headers, config) {				
				$.removeCookie('email', { path: '/' });
				$.removeCookie('password', { path: '/' });
				$location.path('/login');
			});	
	
});