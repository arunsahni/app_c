

collabmedia.controllerProvider.register('forgotPasswordCtrl',function($scope,$http,$location,$window,$stateParams){

/*________________________________________________________________________
	* @Date:      	23 Jan 2015
	* @Method :   	resetPswrd
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to reset user password.
	* @Param:     	
	* @Return:    	no
_________________________________________________________________________
*/ 
	$scope.redirectToLogin=function(){
		$location.path('/login');
	}


/*________________________________________________________________________
	* @Date:      	23 Jan 2015
	* @Method :   	resetPswrd
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to reset user password.
	* @Param:     	
	* @Return:    	no
_________________________________________________________________________
*/   
	$scope.resetPswrd=function(){
		console.log($scope.user);
		$('#overlay').show();
		$('#overlayContent').show();
		
		$http.post('/user/reset_password',$scope.user).then(function (data, status, headers, config) {
			console.log(data);
            if (data.data.code=='400') {
				$('#overlay').hide();
				$('#overlayContent').hide();
                $scope.msg='This email is not registered with scrpt.';
            }else if(data.data.code=='200'){
                $window.localStorage['resetPassword']="true";
                $location.path('/login');
				$('#overlay').hide();
				$('#overlayContent').hide();
            }else{
				$('#overlay').hide();
				$('#overlayContent').hide();
                $scope.msg='Sorry! there was some error processing your request. Please try again later.'
            }
		})
	}
});