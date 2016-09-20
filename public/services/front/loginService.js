var collabmedia = angular.module('collabmedia');
collabmedia.provide.service('loginService', function(){
	this.chkUserLogin = function($http,$location,$window,$scope){
		return $http.get('/user/chklogin')
			.success(function (data, status, headers, config) {				
				if (data.code=="200"){
					tempData = data.usersession;
				}else{
					tempData = {};
					$location.path('/login');
				}
			});	
	};
});