var collabmedia = angular.module('collabmedia');
collabmedia.service('loginService', function(){
	this.chkAdminLogin = function($http,$location,$window){
		return $http.get('/admin/chklogin')
			.success(function (data, status, headers, config) {				
				if (data.code=="200"){
					tempData = data.adminsession;
				}else{
					tempData = {};
					$window.location.href='/admin/login';
				}
			});	
	};
});