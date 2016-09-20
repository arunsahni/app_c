var collabmedia = angular.module('collabmedia');
	
	collabmedia.controller('adminLoginCtrl', function($scope,$rootScope, $http, $window, $location) {
		$rootScope.loggedIn=false;
	// Admin Login
		$scope.merlog={};
		
		
		
		$scope.submitForm = function(isValid) {
			if (isValid) {
				$http.post('/admin/signin',$scope.adminlog)
				.success(function (data, status, headers, config) {
					if (data.code=="200"){
						$location.path('/dashboard');
					}
					else if (data.code=="404") {
						$scope.msg='Invalid username or password.';
					}
				})
				.error(function (data, status) {
					document.getElementById("errMsg").innerHTML="Sorry! Server error.";
				});	
			}
		}	
	});	