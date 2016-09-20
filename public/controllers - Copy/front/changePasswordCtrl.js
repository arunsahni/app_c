

collabmedia.controllerProvider.register('changePasswordCtrl',function($scope,$http,$location,$window,$stateParams){


    //alert($stateParams.id);
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
	* @Method :   	changePswrd
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to reset user password.
	* @Param:     	
	* @Return:    	no
_________________________________________________________________________
*/   
	$scope.resetPswrd=function(){
        $('#overlay').show();
		$('#overlayContent').show();
		//console.log($scope.user);
		var fields={};
        fields.id=$stateParams.id;
        fields.password=$scope.password1;
		console.log(fields);
		$http.post('/user/new_password', fields).then(function (data, status, headers, config) {
			if (data.data.code!='200') {
                $('#overlay').hide();
				$('#overlayContent').hide();
                $scope.msg='Sorry! there was some error processing your request. Please try again later.'
            }else{
                $('#overlay').hide();
				$('#overlayContent').hide();
                $window.localStorage['changePassword']=true;
                $location.path('/login');
            }
		})
	}
});