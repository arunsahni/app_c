var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('manageFriendsCtrl',['$scope','$sce','$http','$location','$window','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){

//$scope.clicked = false;
$('body').removeClass('page-bg-pic').removeClass('chapter-bg-pic').addClass('creation-section').addClass('content-bg-pic');
    $scope.friend = {};
    $scope.friends =[];
    $scope.pageNo = 1;
    $scope.perPage = 20;
    $('[data-toggle="tooltip"]').tooltip();
/*________________________________________________________________________
* @Date:      	4 Aug 2015
* @Method :   	getAllFriends
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to call login service to check user login and get user data.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/   
    $scope.getAllFriends =function(){
        $http.get('/members').then(function(data){
            if (data.data.code==400) {
                $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
            }else{
                console.log(data)
                $scope.friends = data.data.friends;
            }
        })
    }
    //$scope.getAllFriends();
/**********************************END***********************************/
   
/*________________________________________________________________________
* @Date:      	4 Aug 2015
* @Method :   	getFriendsPerPAge
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to call login service to check user login and get user data.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/   
    $scope.getAllFriendsPaginated =function(pNo){
        $scope.pageNo = pNo ; 
        $http.post('/members',{pageNo:$scope.pageNo,perPage : $scope.perPage}).then(function(data){
            if (data.data.code==400) {
                $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
            }else{
                console.log(data)
                $scope.friends = data.data.friends;
                $scope.total = data.data.total;
                $timeout(function(){$scope.$apply()},1)
            }
        })
    }
    $scope.getAllFriendsPaginated($scope.pageNo);
/**********************************END***********************************/   
 
/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	loginService
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to call login service to check user login and get user data.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    loginService.chkUserLogin($http,$location,$window).then(function(){
        $scope.userInfo = tempData;
        userdata=$scope.userInfo;
        console.log($scope.userInfo);
    });
/**********************************END***********************************/
    
/*________________________________________________________________________
* @Date:      	4 Aug 2015
* @Method :   	getRelationData 
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to call login service to check user login and get user data.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.getRelationData = function(){
        $http.get('/fsg/view').then(function (data, status, headers, config){
            if (data.data.code==200){
                var fsg = data.data.response;
                for(var i = 0; i < fsg.length; i++){
                    if (fsg[i].Title == 'Relation') {
                        $scope.relations = fsg[i];
                    }
                }
            }
        })
    };
    $scope.getRelationData();
/**********************************END***********************************/

    
/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	addFriend
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to call add a user to friend list
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.addFriend = function(){
    if($scope.friend.relation != null && $scope.friend.relation != undefined && $scope.friend.email != '' &&  $scope.friend.email != null && $scope.friend.email != undefined){
        if (($scope.friend.email).toLowerCase() != ($scope.userInfo.Email).toLowerCase()) {
            //alert('got it');
            $http.post('/members/addFriend',$scope.friend).then(function(data){
                console.log(data);
                if (data.data.code == 400) {
                    //flash msg
                    $scope.setFlashInstant('This user is already your friend!' , 'success');
                }else if (data.data.code == 200) {
                   $scope.setFlashInstant('Friend added successfuly!' , 'success');
                   $scope.getAllFriendsPaginated($scope.pageNo);
                }else if (data.data.code == 401) {
                   $scope.setFlashInstant('This user is not registered! Work in progress' , 'success');
                }
                $scope.friend.email ='';
                $scope.friend.name = '';
                $scope.friend.relation = null;
            })
        }else{
            $scope.setFlashInstant('<span style="color:red">You can\'t add yourself as a member/friend.</span>' , 'error');
        }
    }else{
        
    }
    
}
/**********************************END***********************************/


$scope.removeFriend = function(email){
    //alert(2)
    $http.post('/members/removeFriend',{'email':email}).then(function(data){
        console.log(data);
        if (data.data.code == 400 || data.data.code == 401) {
            //flash msg
            $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
        }else if (data.data.code == 200) {
           $scope.setFlashInstant('Friend removed successfuly!' , 'success');
        }
    })
    $scope.getAllFriendsPaginated($scope.pageNo);
}

}]);
