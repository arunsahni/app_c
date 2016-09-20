var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('lsCapsuleMgmtCtrl',['$scope', '$location','$timeout','loginService','LaunchSettingsService','$stateParams','CapsulesService','LSService', function($scope, $location, $timeout, loginService,LaunchSettingsService,$stateParams,CapsulesService,LSService){
	//module collabmedia: chapters management
	$scope.LsCapsuleMgmt = (function(){
		var app = {
			capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0, 
            makingFor: 'myself',
            participation : 'private',
            participationO : 'private',
			showFriends : false,
			showGroups : false,
			showGroupMembers :false,
			perPageFriends : 20,
			perPageGroups : 5,
			pageNoInvitees : 1,
			pageNoGroups : 1,
			pageNoMembers : 1,
			pageNoFriends : 1 ,
			init : function(){
				$scope.friends =[];
				$('body').removeClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').removeClass('chapter');
				this.getCapsuleData();
				this.getFsgs();
			},
			getCapsuleData : function(){
				CapsulesService.current(this.capsule_id).then(function(data){
					$scope.currentCapsule = data.data.result;
					$scope.LsCapsuleMgmt.makingFor = $scope.currentCapsule.LaunchSettings.Audience ? $scope.currentCapsule.LaunchSettings.Audience : $scope.LsCapsuleMgmt.makingFor;
					if ($scope.LsCapsuleMgmt.makingFor == 'ME') {
						$scope.LsCapsuleMgmt.participation = $scope.currentCapsule.LaunchSettings.ShareMode;
					}else{
						$scope.LsCapsuleMgmt.participationO = $scope.currentCapsule.LaunchSettings.ShareMode;
					}
					if ($scope.currentCapsule.CoverArt) {
						$scope.LsCapsuleMgmt.newCover = '/assets/Media/capsules/medium/'+$scope.currentCapsule.CoverArt;
					}
					
					if ($scope.currentCapsule.Title) {
						$scope.LsCapsuleMgmt.newTitle = $scope.currentCapsule.Title;
					}
					console.log('$scope.LsCapsuleMgmt.makingFor = ',$scope.LsCapsuleMgmt.makingFor);
					console.log('$scope.LsCapsuleMgmt.participationO = ',$scope.LsCapsuleMgmt.participationO);
					console.log('$scope.LsCapsuleMgmt.participation =',$scope.LsCapsuleMgmt.participation );
					$scope.LsCapsuleMgmt.getAllFriends($scope.LsCapsuleMgmt.pageNoFriends);
					$scope.LsCapsuleMgmt.getAllGroups($scope.LsCapsuleMgmt.pageNoGroups);
				})
			},
			saveSettings : function(){
				var temp = {};
				temp.makingFor = this.makingFor ;
				temp.title = this.newTitle;
				if (temp.makingFor == 'myself') {
					temp.participation = $scope.LsCapsuleMgmt.participation;
				}else{
					temp.participation = $scope.LsCapsuleMgmt.participationO;
				}
				CapsulesService.saveSettings( this.capsule_id , temp ).then(function(data){
					if (data.data.status == 200) {
						$timeout(function(){
							$scope.setFlashInstant('Settings saved sucessfully.' , 'success');
							$scope.LsCapsuleMgmt.getCapsuleData();
						},10)
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
					
				})
			},
			uploadCover : function(){
				//console.log($scope.myFile);
				CapsulesService.uploadCover( this.capsule_id , $scope.myFile ).then(function(data){
					if ( data.data.status == 200 ) {
						$timeout(function(){
							$scope.LsCapsuleMgmt.newCover = data.data.result;
						},1000)
					}else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				})
			},
			getFsgs: function(){
				LSService.getFsgs().then(function(data){
					if (data.data.code==200){
						var fsg = data.data.response;
						for(var i = 0; i < fsg.length; i++){
							if (fsg[i].Title == 'Relation') {
								$scope.relations = fsg[i];
							}
						}
					}
				})
			},
			addInvitee : function(invalid){
				if (invalid) {
					alert('Please enter valid values in all fields');
				}else{
					CapsulesService.invite( $scope.LsCapsuleMgmt.capsule_id , $scope.LsCapsuleMgmt.invitee ).then(function(data){
						if ( data.data.status == 200 ) {
							$scope.LsCapsuleMgmt.getCapsuleData();
							$scope.setFlashInstant('Invitation sent.' , 'success');
							$scope.LsCapsuleMgmt.invitee.name = '';
							$scope.LsCapsuleMgmt.invitee.email = '';
							$scope.LsCapsuleMgmt.invitee.relation = '';
							$('select').prop('selectedIndex', 0).selectric('refresh');
							
						}else if(data.data.status == 401){
							$scope.setFlashInstant('<span style="color:red">This member is already invited.</span>' , 'success');
						}
						else if(data.data.status == 402){
							$scope.setFlashInstant('<span style="color:red">Caution ! You can not invite yourself.</span>' , 'success');
						}
						else{
							$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
						}
					})
				}
			},
			getAllFriends: function(pNo){
				var emails = $.map($scope.currentCapsule.LaunchSettings.Invitees , function(a){
					return a.UserEmail ;
				})
				LSService.getAllFriends(pNo , this.perPageFriends , emails).then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}else{
						$scope.LsCapsuleMgmt.totalFrnds = data.data.total;
						$scope.friends = data.data.friends;
					}
				})
			},
			inviteMember : function(data){
				var member = {};
				if ($scope.LsCapsuleMgmt.showGroupMembers) {
					member.UserID = data.MemberID;
					member.UserEmail = data.MemberEmail;
					member.UserName = data.MemberName;
					member.UserNickName = data.MemberNickName;
					member.CreatedOn = Date.now();
					member.Relation = data.MemberRelation;
					member.RelationId = data.MemberRelationID;
					member.UserPic = data.MemberPic;
				}else{
					member.UserID = data.Friend.ID;
					member.UserEmail = data.Friend.Email;
					member.UserName = data.Friend.Name;
					member.UserNickName = data.Friend.NickName;
					member.CreatedOn = Date.now();
					member.Relation = data.Friend.Relation;
					member.RelationId = data.Friend.RelationId;
					member.UserPic = data.Friend.Pic;
					//return;
				}	
				CapsulesService.inviteMembers( this.capsule_id , member ).then(function(data){
					console.log(data)
					if ( data.data.status == 200 ) {
						$scope.LsCapsuleMgmt.getCapsuleData();
						$scope.setFlashInstant('Invitation sent.' , 'success');
					}else if(data.data.status == 401){
						$scope.setFlashInstant('<span style="color:red">This member is already invited.</span>' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				})
				
			},
			removeInvitee : function(data ){
				console.log(data)
				CapsulesService.removeInvitee( this.capsule_id , data ).then(function(data){
					if ( data.data.status == 200 ) {
						$scope.LsCapsuleMgmt.getCapsuleData();
						$scope.setFlashInstant('Removed' , 'success');
					}else if(data.data.status == 401){
						$scope.setFlashInstant('<span style="color:red">This member is not invited.</span>' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				})
			},
			getAllGroups :  function(pNo){
				LSService.getAllGroups(pNo , this.perPageGroups).then(function(data){
					console.log(data)
					if (data.data.code == 200) {
						$scope.LsCapsuleMgmt.groups = data.data.groups;
						$scope.LsCapsuleMgmt.totalGroups = data.data.total;
					}
				})
			},
			getAllMembers : function(id){
				//alert(id);
				$scope.LsCapsuleMgmt.showGroupMembers = true;
				$scope.LsCapsuleMgmt.showGroups = false;
				$scope.LsCapsuleMgmt.showFriends = false;
				console.log($scope.LsCapsuleMgmt.groups);
				$scope.LsCapsuleMgmt.groupMembers =$.map($scope.LsCapsuleMgmt.groups , function( group ) {
					return group._id == id ? group.Members : null;
				});
				console.log($scope.LsCapsuleMgmt.groupMembers);
			},
		};
		app.init();
		return app;
	})();
}]);