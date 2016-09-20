var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('launchSettingsMgmtCtrl',['$scope', '$location','$timeout','loginService','LaunchSettingsService','$stateParams', function($scope, $location, $timeout, loginService,LaunchSettingsService,$stateParams){
	//module collabmedia: chapters management
	$scope.LaunchSettingsMgmt = (function(){
		var app = {
			chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0, 
            makingFor: 'myself',
            participation : 'private',
            namingConvention: 'realnames',
			showFriends : false,
			invitee : {} ,
			init : function(){
				$('body').removeClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').removeClass('chapter');
				//$scope.relations = [];
				this.getAllFriends();
				this.getChapterData();
				this.getFsgs();
			},
			getFsgs: function(){
				LaunchSettingsService.getFsgs().then(function(data){
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
			getChapterData : function(){
				console.log(this.chapter_id);
				LaunchSettingsService.getChapterData(this.chapter_id).then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}else{
						console.log(data);
						$scope.LaunchSettingsMgmt.chapterData = data.data.result;
					}
				})
			},
			getAllFriends: function(){
				LaunchSettingsService.getAllFriends().then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}else{
						//console.log(data);
						$scope.friends = data.data.friends;
					}
				})
			},
			uploadCover : function(){
				//console.log($scope.myFile);
				LaunchSettingsService.uploadCover( this.chapter_id , $scope.myFile ).then(function(data){
					if ( data.data.status == 200 ) {
						$timeout(function(){
							$scope.LaunchSettingsMgmt.newCover = data.data.result;
						},1000)
					}else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				})
			},
			addInvitee : function(invalid){
				//alert('')
				if (invalid) {
					alert('Please enter valid values in all fields');
				}else{
					//alert('valid');
					LaunchSettingsService.invite( this.chapter_id , $scope.LaunchSettingsMgmt.invitee ).then(function(data){
						if ( data.data.status == 200 ) {
							$scope.LaunchSettingsMgmt.getChapterData();
							$scope.setFlashInstant('Invitation sent.' , 'success');
							$scope.LaunchSettingsMgmt.invitee.name = '';
							$scope.LaunchSettingsMgmt.invitee.email = '';
							$scope.LaunchSettingsMgmt.invitee.relation = '';
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
			inviteMember : function(data){
				console.log(data);
				var member = {};
				member.UserID = data.Friend.ID;
				member.UserEmail = data.Friend.Email;
				member.UserName = data.Friend.Name;
				member.UserNickName = data.Friend.NickName;
				member.CreatedOn = Date.now();
				member.Relation = data.Friend.Relation;
				member.RelationId = data.Friend.RelationId;
				member.UserPic = data.Friend.Pic;
				//return;
				LaunchSettingsService.inviteMembers( this.chapter_id , member ).then(function(data){
					console.log(data)
					if ( data.data.status == 200 ) {
						$scope.LaunchSettingsMgmt.getChapterData();
						$scope.setFlashInstant('Invitation sent.' , 'success');
					}else if(data.data.status == 401){
						$scope.setFlashInstant('<span style="color:red">This member is already invited.</span>' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				})
			},
			removeInvitee : function(data){
				console.log(data)
				LaunchSettingsService.removeInvitee( this.chapter_id , data ).then(function(data){
					console.log(data)
					if ( data.data.status == 200 ) {
						$scope.LaunchSettingsMgmt.getChapterData();
						$scope.setFlashInstant('Invitation canceled' , 'success');
					}else if(data.data.status == 401){
						$scope.setFlashInstant('<span style="color:red">This member is not invited.</span>' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				})
			},
			addOwner : function(invalid){
				if (invalid) {
					
				}else{
					LaunchSettingsService.addOwner( this.chapter_id , $scope.LaunchSettingsMgmt.ownerEmail ).then(function(data){
						console.log(data);
						if ( data.data.status == 200 ) {
							$scope.LaunchSettingsMgmt.getChapterData();
							$scope.setFlashInstant('Invitation sent' , 'success');
							$scope.LaunchSettingsMgmt.ownerEmail ='';
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
			removeOwner : function(email){
				LaunchSettingsService.removeOwner( this.chapter_id , email ).then(function(data){
					console.log(data);
					if ( data.data.status == 200 ) {
						$scope.LaunchSettingsMgmt.getChapterData();
						$scope.setFlashInstant('Member removed' , 'success');
					}else if(data.data.status == 401){
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				})
			}
			
		};
		app.init();
		return app;
	})();
}]);