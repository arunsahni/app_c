var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('memberCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
	$scope.member={};
	// For Invitee suggestion while inviting 
	$scope.myInvitees=[];
    $scope.myInvitee=[];
	$scope.my_invitees=function(){
		$http.get('/myInvitees').then(function (data, status, headers, config) {
			if (data.data.code==200){
				//alert(1);
				//console.log(data.data.response);
				//alert(data.data.response)
				//commented and modified by parul 09012015
				//for(i in data.data.response){
				//    var akk={};
				//    akk.label=data.data.response[i].UserName;
				//    akk.value=data.data.response[i]._id;
				//    akk.email=data.data.response[i].UserEmail;
				//    akk.relation=data.data.response[i].Relation;
				//    $scope.myInvitee.push(akk)
				//}
				for(i in data.data.response){
					var akk={};
					akk.label=data.data.response[i].UserName+' ('+data.data.response[i].UserEmail+')';
					akk.name=data.data.response[i].UserName
					akk.value=data.data.response[i]._id;
					akk.email=data.data.response[i].UserEmail;
					akk.relation=data.data.response[i].Relation;
					$scope.myInvitee.push(akk)
				}
				$scope.myInvitees=data.data.response;
				//console.log('$scope.myInvitees')
				//console.log($scope.myInvitees)
			}
			else{
				$scope.myInvitees=[];
			}
		})
	}
      
	$scope.my_invitees();// Wrapped code in a function and called it here
		
	/*________________________________________________________________________
	* @Date:      	30 Mar 2015
	* @Method :   	boardInvitees
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to populate .myBoardInvitees variable that contains invitaion sent by user for current board
	* @Param:     	0
	* @Return:    	No
	_________________________________________________________________________
	*/
	$scope.boardInvitees=function(){
		$http.post('/myInvitees/board',{boardId:$stateParams.id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.myBoardInvitees = data.data.response;
				console.log('$scope.myBoardInvitees=======================');
				console.log($scope.myBoardInvitees);
				
			}
			else{
				$scope.myBoardInvitees=[];
			}
		})
	}
      
	$scope.boardInvitees();// Wrapped code in a function and called it here
	
	
	/*
		Action : Add Member
	
	*/
	
	$scope.addMembers = function(){
        if($scope.member.emails!=""||$scope.member.emails!=null||$scope.member.emails!=undefined){
            $scope.member.id=$stateParams.id;
            console.log($scope.member);
            //return;
            $http.post('/boards/addMembers',$scope.member).then(function (data, status, headers, config) {
                if(data.data.code==200){
					$scope.setFlashInstant('Member added successfully.' , 'success');
                    $('.ui-dialog-titlebar-close').trigger('click')
					$scope.changePT();
					//alert(1);
					$scope.member = {};
					$scope.boardMembers=true;
					$scope.update__MembersObject();
					$scope.my_invitees();//added by parul 13012015
					$scope.boardInvitees();// parul 30032015	
                }else if (data.data.code==400) {
					alert('ERROR!!! You can not add yourself as a member');
				}
            });
			
        }else{
			$scope.setFlashInstant('Please fill the details to add member.' , 'error');
		}
    };
	
	
	/*
		Action : Delete Member
	
	*/
	
	$scope.deleteMember = function(invitee_id){
		//alert('deleteMember called with id='+invitee_id);
        $("#delete_pop").show();
        $scope.confirmDel = function() {
		    var fields={};
	        fields.id=$stateParams.id;
	        fields.user=invitee_id;
            $http.post('/boards/deleteInvitee',fields).then(function (data, status, headers, config) {
                if (data.data.code==200){         
                    $scope.setFlashInstant('Member deleted successfully.' , 'success');
					//$('.ui-dialog-titlebar-close').trigger('click')
					$scope.changePT();
					$("#delete_pop").hide();
					//update members object
					$scope.update__MembersObject();
                }
            });
        }; 
    }
});
