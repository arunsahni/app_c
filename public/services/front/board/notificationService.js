var collabmedia = angular.module('collabmedia');
collabmedia.service('notificationService', function($http,$location,$window,$scope){
	
	this.getComment = function(data){
		return $http.get('/notification/get_comment')
			.success(function (data, status, headers, config) {				
				if (data.code=="200"){
					tempData = data.usersession;
				}else{
					tempData = {};
					$window.location='/#/login';
				}
			});	
	};
});