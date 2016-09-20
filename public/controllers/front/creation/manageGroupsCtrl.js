var collabmedia = angular.module('collabmedia');


collabmedia.controllerProvider.register('manageGroupsCtrl',['$scope','$sce','$http','$location','$window','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
    $('[data-toggle="tooltip"]').tooltip();
    $scope.showFriends = false;
    $scope.groupPop = false;
    $scope.member = {};
    $('body').removeClass('page-bg-pic').removeClass('chapter-bg-pic').addClass('creation-section').addClass('content-bg-pic');
    //alert(1);
    $scope.group = {};
    $scope.friends =[];
    //$scope.perPageGroups = 2;
	$scope.perPageGroups = 20;
    $scope.perPageFriends = 20;
    $scope.pageNoGroups = 1;
    $scope.pageNoFriends = 1;
    
    
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
    $scope.getAllFriends =function(members){
        $http.get('/members').then(function(data){
            if (data.data.code==400) {
                $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
            }else{
                console.log(data);
                var frndData = friends = data.data.friends;
                $scope.gotFriends = data.data.friends.length > 0 ? true : false;
                //for(var i = 0; i < members.length; i++){
                //    for(var j = 0; j < frndData.length; j++){
                //        if (members[i].MemberEmail.toLowerCase() == frndData[j].Friend.Email.toLowerCase()) {
                //            frndData.splice(j,1);
                //        }
                //    }
                //}
                //$scope.friends = frndData;
            }
        })
    }
    $scope.getAllFriends();
/**********************************END***********************************/  
    
    
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
    $scope.getAllFriendsPaginated =function(members , pNo){
        $scope.pageNoFriends = pNo ;
        var memberEmails = $.map(members , function(a,i){
            return a.MemberEmail;
        })
        $http.post('/members/excludeMembers',{pageNo:$scope.pageNoFriends,perPage : $scope.perPageFriends,emails : memberEmails}).then(function(data){
            if (data.data.code==400) {
                $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
            }else{
                var frndData = friends = data.data.friends;
                //$scope.gotFriends = data.data.friends.length > 0 ? true : false;
                $scope.friends = frndData;
                $scope.totalFriends = data.data.total;
                $timeout(function(){$scope.$apply()},1)
            }
        })
    }
    //$scope.getAllFriendsPaginated($scope.currentGroup.Members , $scope.pageNo);
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
        userdata = $scope.userInfo;
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
* @Date:      	3 Aug 2015
* @Method :   	getAllGroups
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.getAllGroups = function(){
    $http.get('/groups').then(function(data){
        console.log(data)
        $scope.groupData = data.data.groups;
        $scope.totalGroups = data.data.total;
    });
}
//$scope.getAllGroups();

/**********************************END***********************************/



    
/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	getAllGroups
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.getAllGroupsPaginated = function(pNo , id){
    //alert(here)
    $scope.pageNoGroups = pNo ; 
    $http.post('/groups',{pageNo:$scope.pageNoGroups,perPage : $scope.perPageGroups}).then(function(data){
        console.log(data)
        $scope.groupData = data.data.groups;
        $scope.totalGroups = data.data.total;
    });
}
$scope.getAllGroupsPaginated($scope.pageNoGroups);

/**********************************END***********************************/
/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	addGroup
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.addGroup = function(invalid){
    console.log($scope.myFile)
    //alert(invalid);return;
    if (!invalid && $scope.myFile != undefined) {
        $http.post('/groups/addGroup',$scope.group).then(function(data){
            console.log(data);
            if (data.data.code == 200) {
                $scope.setFlashInstant('Group added successfully.' , 'success');
                var uploadUrl = "/groups/iconUpload";
                var fd = new FormData();
                fd.append('file', $scope.myFile);
                fd.append('groupID', data.data.data._id);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(abc){
                    console.log("value returned to service in success function = "+abc.filename);
                    //$scope.getAllGroups();
                    $scope.getAllGroupsPaginated($scope.pageNoGroups);
                    $scope.group.title = '';
                 })
                 .error(function(){
                     console.log("failure");
                });
                
            }else if (data.data.code == 400) {
                $scope.setFlashInstant('<span style="color:red">Opps!! Something went wrong</span>' , 'success');
            }else if (data.data.code == 401) {
                $scope.setFlashInstant('<span style="color:red">A group with same name already exists.</span>' , 'success');
            }
            
        })
    }
}
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	viewGroup
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.viewGroup = function(group){
    $scope.currentGroup = group;
    $scope.groupPop = true;
    //$scope.getAllFriends($scope.currentGroup.Members);
    $scope.getAllFriendsPaginated($scope.currentGroup.Members , 1);
}
/**********************************END***********************************/




/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	delGroup
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.delGroup = function(Id){
    if(confirm('Are you sure that you want to remove this group')){
        $http.post('/groups/removeGroup',{id:Id}).then(function(data){
            if (data.data.code ==200) {
                $scope.setFlashInstant('Group deleted successfully.' , 'success');
            }else{
                $scope.setFlashInstant('<span style="color:red">Opps!! Something went wrong</span>' , 'success');
            }
            //$scope.getAllGroups();
            $scope.getAllGroupsPaginated($scope.pageNoGroups);
        })
    }
}
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	closePop
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.closePop = function(Id){
    $scope.currentGroup = null;
    $scope.groupPop = false;    
    $scope.member.email = "";
    $scope.member.name = '';
    //$scope.pageNoFriends = 1;
    $scope.member.relation = null;
    $('select').prop('selectedIndex', 0).selectric('refresh');
}
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	finalAddToGroup
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.finalAddToGroup = function(frnd){
    $http.post('/groups/addMember',{'email':frnd.email,'name':frnd.name,'id':$scope.currentGroup._id,'relation': frnd.relation}).then(function(data){
        if (data.data.code == 401) {
            $scope.setFlashInstant('<span style="color:red">This user is already a member of this group.</span>' , 'error');        
        }else if (data.data.code == 402) {
            $scope.setFlashInstant('<span style="color:red">Opps!! Something went wrong.</span>' , 'error');        
        }else if (data.data.code == 403) {
            $scope.setFlashInstant('<span style="color:red">This user is not registered with scrpt right now.</span>' , 'error');        
        }else if (data.data.code == 200) {
            $scope.setFlashInstant('Member added successfully' , 'error');        
            $scope.member.email = "";
            $scope.member.name = '';
            $scope.member.relation = null;
            $('select').prop('selectedIndex', 0).selectric('refresh');
            $scope.updateCurrentGroup();
            
            //$scope.getAllFriends($scope.currentGroup.Members);
        }
    });
}


/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	addMember
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.addMember = function(invalid){
    if (!invalid && $scope.member.relation != null && $scope.member.relation != undefined) {
        if (($scope.member.email).toLowerCase() != ($scope.userInfo.Email).toLowerCase()) {
            $scope.finalAddToGroup($scope.member);
        }else{
            $scope.setFlashInstant('<span style="color:red">You can\'t add yourself as a member/friend.</span>' , 'error');        
        }
    }
}
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	updateCurrentGroup
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.updateCurrentGroup = function(invalid){
    $http.post('/groups/current',{id:$scope.currentGroup._id}).then(function(data){
        //console.log('-------------');
        //console.log(data);
        if (data.data.code == 200) {
           // alert(1);
            $scope.currentGroup = data.data.group;
            //$scope.getAllFriends($scope.currentGroup.Members);
            $scope.getAllFriendsPaginated($scope.currentGroup.Members , $scope.pageNoFriends);
            //$scope.getAllGroups();
            $scope.getAllGroupsPaginated($scope.pageNoGroups);
           // $scope.$apply();
        }
    })
}
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	3 Aug 2015
* @Method :   	removeMember
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.removeMember = function(email){
    if(confirm('Are you sure that you want to remove this member')){
        $http.post('/groups/removeMember',{'id':$scope.currentGroup._id,'email':email}).then(function(data){
            if (data.data.code == 200) {
                $scope.setFlashInstant('Member removed successfully' , 'error');
                $scope.updateCurrentGroup();
            }else  {
               $scope.setFlashInstant('<span style="color:red">Opps!! Something went wrong.</span>' , 'error');        
            } 
        })
    }
}
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	4 Aug 2015
* @Method :   	addAsMember
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.addAsMember = function(frnd){
    console.log(frnd);
    $scope.newMember = {}
    $scope.newMember.name = frnd.Name;
    $scope.newMember.email = frnd.Email;
    $scope.newMember.relation = frnd.Relation+'~'+frnd.RelationID;
    if ($scope.currentGroup.Members.length > 0) {
        var flag = false;
        for(var i = 0; i< $scope.currentGroup.Members.length;i++){
            console.log($scope.currentGroup.Members[i].MemberEmail);
            if ($scope.currentGroup.Members[i].MemberEmail.toLowerCase() == frnd.Email.toLowerCase()) {
                flag = true; 
            }
            console.log(i);
        }
        console.log('here');
        if (flag) {
            $scope.setFlashInstant('<span style="color:red">This user is already a member of this group.</span>' , 'error');        
        }else{
            $scope.finalAddToGroup($scope.newMember);
        }
    }else{
        $scope.finalAddToGroup($scope.newMember);
    }
}
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	4 Aug 2015
* @Method :   	viewFriends
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to add a new group.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.viewFriends = function(){
    $scope.showFriends = !$scope.showFriends;
}
/**********************************END***********************************/

}]);
