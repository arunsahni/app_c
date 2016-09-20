var collabmedia = angular.module('collabmedia');
collabmedia.controllerProvider.register('registerCtrl',function($scope,$http,$location,$window){
	$http.get('/user/chklogin')
			.success(function (data, status, headers, config) {				
				if (data.code=="200"){
					$location.path('/myprofile');
				}
			});
	$scope.redirectToLogin=function(){
		$location.path('/login');
	}
	
	$("li").keydown(function(){
         //alert(1);
         $(this).find("p").css("display", "block");
         
       });
	
	$(".close_icon").click(function(){
         //alert(1);
         $(this).parent().fadeOut();
         $scope.msg2="";
         });
	
	
	
	$scope.submitForm = function(isValid){
		if(isValid){
			$http.post('/user/register',$scope.user).then(function (data, status, headers, config) {
				//alert('submitForm');
				if (data.data.code==200){					
					$window.localStorage['register']=true;
					$location.path('/login');
					
				}
				else if (data.data.code==404) 
				{
					//alert('adding msg');
					$scope.msg="This Email-ID has already been registered.";
				}
				else{
					//alert('inside else');
					}
			})
		}
	}	
});

collabmedia.controllerProvider.register('registersCtrl',function($scope,$http,$location,$window,$stateParams){
	$http.get('/user/chklogin')
			.success(function (data, status, headers, config) {				
				if (data.code=="200"){
					$location.path('/myprofile');
				}
			});
	
	$scope.submitForm = function(isValid){
		//alert('submitForm');
		if(isValid){
			$scope.user.board=$stateParams.id;
			$scope.user.emailInvite=$stateParams.email;
			$http.post('/user/register',$scope.user).then(function (data, status, headers, config) {
				if (data.data.code==200){					
					$window.localStorage['register']=true;
					$location.path('/login')
				}
				else if (data.data.code==404) 
				{
					alert('adding msg');
					$scope.msg="This Email-ID has already been registered.";
				}
			})
		}
	}
	$scope.redirectToLogin=function(){
		$location.path('/login');
	}
});