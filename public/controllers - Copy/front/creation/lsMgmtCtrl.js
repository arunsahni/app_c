var collabmedia = angular.module('collabmedia');
/*
$('body').animate({scrollTop:$('#top3').offset().top}, '500', 'swing', function() { 
   //alert("Finished animating"+body.scrollTop());
});
*/

collabmedia.controllerProvider.register('lsMgmtCtrl',['$scope', '$location','$timeout','loginService','LSService','$stateParams','ChaptersService','LaunchSettingsService','CapsulesService', function($scope, $location, $timeout, loginService,LSService,$stateParams,ChaptersService,LaunchSettingsService,CapsulesService){
	//module collabmedia: chapters management
	//module collabmedia: chapters management
	$scope.LsCapsuleMgmt = (function(){
		var app = {
			capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0, 
            publishTitle : "Are you sure ?",
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
			saveSettings : function(flag){
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
							$scope.LsCapsuleMgmt.getCapsuleData();
							if(flag == 'saveNexit'){
								$scope.setFlashInstant('Settings saved sucessfully.' , 'success');
								$location.path('/manage-chapters/'+$scope.LsCapsuleMgmt.capsule_id);
							}
							
						},10)
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
					
				})
			},
			saveMakingFor : function(makingFor){
				var temp = {};
				temp.makingFor = makingFor;
				temp.title = this.newTitle;
				if (temp.makingFor == 'myself') {
					temp.participation = $scope.LsCapsuleMgmt.participation;
				}else{
					temp.participation = $scope.LsCapsuleMgmt.participationO;
				}
				CapsulesService.saveSettings( this.capsule_id , temp );
			},
			publish : function(){
				$scope.setFlashInstant("Please be patience! Checking capsule's completeness..." , 'success');
				
				if( !$scope.LSMgmt.chapters.length ){
					alert("Oops! You can't publish an empty capsule. Add a chapter and try again.");
					return;
				}
				
				if(this.makingFor == 'SUBSCRIBERS'){
					alert("Publish for subscribers case is on hold for now...Try other options.");
					return;
				}
				
				LSService.capsule__checkCompleteness( this.capsule_id ).then(function(data){
					if (data.data.status == 200) {
						publishNow();
					}
					else if ( data.data.status == 400 ){
						var msg = data.data.message;
						$scope.LSMgmt.showWarning(msg);		
						//$scope.setFlashInstant(data.data.message , 'error');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				});
				
				var publishNow = function(){
					$scope.setFlashInstant('Publishing...' , 'success');
					var temp = {};
					temp.makingFor = $scope.LsCapsuleMgmt.makingFor ;
					temp.title = $scope.LsCapsuleMgmt.newTitle;
					if (temp.makingFor == 'myself') {
						temp.participation = $scope.LsCapsuleMgmt.participation;
					}else{
						temp.participation = $scope.LsCapsuleMgmt.participationO;
					}
					CapsulesService.publish( $scope.LsCapsuleMgmt.capsule_id , temp ).then(function(data){
						if (data.data.status == 200) {
							$timeout(function(){
								$scope.setFlashInstant('Capsule has been published sucessfully.' , 'success');
								//$scope.LsCapsuleMgmt.getCapsuleData();	//no need
								$location.path('#/manage-capsules');
							},1000)
						}
						else{
							$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
						}
					})
				}
				
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
							$scope.setFlashInstant('User added! A notification email will be delivered at the time of publish.' , 'success');
							$scope.LsCapsuleMgmt.invitee.name = '';
							$scope.LsCapsuleMgmt.invitee.email = '';
							$scope.LsCapsuleMgmt.invitee.relation = '';
							$('select').prop('selectedIndex', 0).selectric('refresh');
							
						}else if(data.data.status == 401){
							$scope.setFlashInstant('<span style="color:red">This member is already added.</span>' , 'success');
						}
						else if(data.data.status == 402){
							$scope.setFlashInstant('<span style="color:red">Caution ! You can not add yourself.</span>' , 'success');
						}
						else{
							$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
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
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
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
						$scope.setFlashInstant('User added! A notification email will be delivered at the time of publish.' , 'success');
					}else if(data.data.status == 401){
						$scope.setFlashInstant('<span style="color:red">This member is already added.</span>' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
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
						$scope.setFlashInstant('<span style="color:red">This member is not added.</span>' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
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
	
	
	//$watch for updating conditional chapters view 
	$scope.$watch("LsCapsuleMgmt.makingFor", function(newValue , oldValue) {  
		"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.LSMgmt.set_chapter_views()
	});
	
	$scope.LSMgmt = (function(){
		var app = {
			capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0,
			chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0,
            chapters : [],
			chapter_ids : [],
			makingFor: [],
            participation : [],
            namingConvention: [],
			showFriends : [],
			showGroups : [],
			groupMembers : [],
			showGroupMembers : [],
			ownerEmail : [],
			invitee : [] ,
			newCover : [] ,
			newTitle : [] ,
			groups : {},
			isFirstLoad : true,
			perPageGroups : 3,
			perPageFriends : 20,
			pageNoGroups : {},
			//pageNoFriends : [],
			memberPaginate : [],
			pageNoInvitee : {},
			pageNoFrnd : {},
			pageNoMembers : {},
			totalFrnds : 0,
			totalGroups : 0,
			init : function(){
				$('body').removeClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').removeClass('chapter');
				//$scope.relations = [];
				$scope.friends = {};
				this.getChapterData();
				this.getFsgs();
				this.getChapters();
				//this.getAllGroups(1);
				
			},
			showWarning : function(msg){
				//if( !$scope.LSMgmt.chapters.length ){
					$scope.setFlashInstant(msg , 'failure');
					$timeout(function(){
						$scope.setFlashInstant(msg , 'failure');
						$timeout(function(){
							$scope.setFlashInstant(msg , 'failure');
						},3000);
					},3000);
				//}
			},
			getChapters : function(){
				console.log(this.capsule_id);
				LSService.getChapters(this.capsule_id).then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}else{
						console.log(data);
						$scope.LSMgmt.chapters = data.data.results;
						if ($scope.LSMgmt.isFirstLoad) {
							$scope.LSMgmt.set_chapter_views();
							$scope.LSMgmt.getAllFriends(1);
							$scope.LSMgmt.getAllGroups(1);
							
							//show incomplete capsule warning message
							if( !$scope.LSMgmt.chapters.length ){
								var msg = 'If you want to publish this capsule, you need to complete it by adding atleast a chapter and a page under this capsule.';
								$scope.LSMgmt.showWarning(msg);					
							}
						}
						
						$scope.LSMgmt.chapter_ids = data.data.chapter_ids;
						$timeout(function(){
							$('select').selectric();
							$scope.LSMgmt.goTo('top' , 'AI');
							$(".response-sliders").slider();
						},1000);
						$scope.LSMgmt.isFirstLoad = false;
						
					}
				})
			},
			set_chapter_views : function(){
				for(var i = 0; i < $scope.LSMgmt.chapters.length ; i++){
					$scope.LSMgmt.showFriends[i] = false;
					$scope.LSMgmt.showGroups[i] = false;
					$scope.LSMgmt.showGroupMembers[i] = false;
					$scope.LSMgmt.makingFor[i] = "OTHERS";//$scope.LSMgmt.chapters[i].LaunchSettings.MakingFor ? $scope.LSMgmt.chapters[i].LaunchSettings.MakingFor : "ME";
					$scope.LSMgmt.makingFor[i] = $scope.LSMgmt.chapters[i].LaunchSettings.MakingFor ? $scope.LSMgmt.chapters[i].LaunchSettings.MakingFor : "ME";
					$scope.LSMgmt.makingFor[i] = $scope.LsCapsuleMgmt.makingFor;
					$scope.LSMgmt.participation[i] = $scope.LSMgmt.chapters[i].LaunchSettings.ShareMode ? $scope.LSMgmt.chapters[i].LaunchSettings.ShareMode : 'private';
					$scope.LSMgmt.namingConvention[i] = $scope.LSMgmt.chapters[i].LaunchSettings.NamingConvention ? $scope.LSMgmt.chapters[i].LaunchSettings.NamingConvention : 'realnames';
					$scope.LSMgmt.ownerEmail[i] = '';
					$scope.LSMgmt.invitee[i] = {};
					$scope.LSMgmt.newCover[i] = $scope.LSMgmt.chapters[i].CoverArt ? '/assets/Media/covers/medium/'+$scope.LSMgmt.chapters[i].CoverArt : '';
					$scope.LSMgmt.newTitle[i] = $scope.LSMgmt.chapters[i].Title ;
					$scope.LSMgmt.pageNoGroups[i] = 1;
					$scope.LSMgmt.memberPaginate[i] = 'memberPaginate' + i;
					$scope.LSMgmt.pageNoInvitee['c'+ $scope.LSMgmt.chapters[i]._id] = 1;
					$scope.LSMgmt.pageNoFrnd['f'+ $scope.LSMgmt.chapters[i]._id] = 1;
					$scope.LSMgmt.pageNoMembers['m'+ $scope.LSMgmt.chapters[i]._id] = 1;
					$scope.LSMgmt.pageNoGroups['g'+ $scope.LSMgmt.chapters[i]._id] = 1;
				}
			},
			goTo : function(id , section){
				//var minus = 0;
				//var part = section ? section : "AI";	//AI and DE
				//var body = $('body');
				//body.animate({scrollTop:$('#'+id+' .'+part).offset().top - minus}, '500', 'swing', function() { 
				//   alert("Finished animating"+body.scrollTop());
				//});
			},
			goToNext : function(id){
				var currentIdx = chapter_ids.indexOf(id);
				var nextIdx = currentIdx < chapter_ids.length ? currentIdx + 1 : 0;
				this.goTo(nextIdx);
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
			getChapterData : function(){
				console.log(this.chapter_id);
				LSService.getChapterData(this.chapter_id).then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}else{
						console.log(data);
					}
				})
			},
			getAllFriends: function(pNo){
				LSService.getAllFriends(pNo , this.perPageFriends).then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Oops!! Something went wrong' , 'error');
					}else{
						$scope.LSMgmt.totalFrnds = data.data.total;
						for(var i = 0; i < $scope.LSMgmt.chapters.length ; i++){
							$scope.friends[$scope.LSMgmt.chapters[i]._id] = data.data.friends;
						}
					}
				})
			},
			getFriendsIndividually: function(pNo,id){
				LSService.getAllFriends(pNo , $scope.LSMgmt.perPageFriends).then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Oops!! Something went wrong' , 'error');
					}else{
						$scope.LSMgmt.totalFrnds = data.data.total;
						console.log('=========================================================================');
						console.log( $scope.friends[id]);
						console.log('=========================================================================');
						$scope.friends[id] = data.data.friends;
					}
				})
			},
			uploadCover : function(index , file){
				LSService.uploadCover( $scope.LSMgmt.chapters[index]._id , file).then(function(data){
					if ( data.data.status == 200 ) {
						$timeout(function(){
							$scope.LSMgmt.newCover[index] = data.data.result;
						},2500)
					}else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
				})
			},
			addInvitee : function(invalid , index){
				if (invalid) {
					alert('Please enter valid values in all fields');
				}else{
					LSService.invite( $scope.LSMgmt.chapters[index]._id , $scope.LSMgmt.invitee[index] ).then(function(data){
						if ( data.data.status == 200 ) {
							$scope.LSMgmt.getChapters();
							$scope.setFlashInstant('User added! A notification email will be delivered at the time of publish.' , 'success');
							$scope.LSMgmt.invitee[index].name = '';
							$scope.LSMgmt.invitee[index].email = '';
							$scope.LSMgmt.invitee[index].relation = '';
							$('select').prop('selectedIndex', 0).selectric('refresh');
							
						}else if(data.data.status == 401){
							$scope.setFlashInstant('<span style="color:red">This member is already added.</span>' , 'error');
						}
						else if(data.data.status == 402){
							$scope.setFlashInstant('<span style="color:red">Caution ! You can not add yourself.</span>' , 'error');
						}
						else{
							$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
						}
					})
				}
			},
			inviteMember : function(data , id ,  index){
				console.log(index);
				var member = {};
				if ($scope.LSMgmt.showGroupMembers[index]) {
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
				LSService.inviteMembers( id , member ).then(function(data){
					console.log(data)
					if ( data.data.status == 200 ) {
						$scope.LSMgmt.getChapters();
						$scope.setFlashInstant('User added! A notification email will be delivered at the time of publish.' , 'success');
					}else if(data.data.status == 401){
						$scope.setFlashInstant('<span style="color:red">This member is already added.</span>' , 'error');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
				})
				
			},
			removeInvitee : function(data , id){
				console.log(data)
				LSService.removeInvitee( id , data ).then(function(data){
					console.log(data)
					if ( data.data.status == 200 ) {
						$scope.LSMgmt.getChapters();
						$scope.setFlashInstant('Removed' , 'success');
					}else if(data.data.status == 401){
						$scope.setFlashInstant('<span style="color:red">This member is not added.</span>' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
				})
			},
			addOwner : function(invalid , index){
				if (invalid) {
				}else{
					LSService.addOwner( $scope.LSMgmt.chapters[index]._id , $scope.LSMgmt.ownerEmail[index] ).then(function(data){
						console.log(data);
						if ( data.data.status == 200 ) {
							$scope.LSMgmt.getChapters();
							$scope.setFlashInstant('Added' , 'success');
							$scope.LSMgmt.ownerEmail[index] ='';
						}else if(data.data.status == 401){
							$scope.setFlashInstant('<span style="color:red">This member is already added.</span>' , 'success');
						}
						else if(data.data.status == 402){
							$scope.setFlashInstant('<span style="color:red">Caution ! You can not add yourself.</span>' , 'success');
						}
						else{
							$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
						}
					})
				}
			},
			removeOwner : function(email, id){
				//alert(id)
				var msg = "Are you sure, you want to remove this user?";
				if(confirm(msg)){
					LSService.removeOwner( id , email ).then(function(data){
						console.log(data);
						if ( data.data.status == 200 ) {
							$scope.LSMgmt.getChapters();
							$scope.setFlashInstant('Removed' , 'success');
						}else if(data.data.status == 401){
							$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
						}
						else{
							$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
						}
					})
				}
			},
			saveSetting : function(index , flag){
				//alert(index);
				var data = {};
				data.participation = $scope.LSMgmt.participation[index]; 
				data.namingConvention = $scope.LSMgmt.namingConvention[index]; 
				data.newTitle = $scope.LSMgmt.newTitle[index]; 
				ChaptersService.saveSetting($scope.LSMgmt.chapters[index]._id , data).then(function(data){
					console.log(data);
					if ( data.data.status == 200 ) {
						$scope.LSMgmt.getChapters();
						if (flag == 'save') {
							
						}
						else{
							$scope.setFlashInstant('Settings Saved' , 'success');
							$location.path('/manage-chapters/'+$scope.LSMgmt.capsule_id)
						}
					}else if(data.data.status == 401){
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
				})
			},
			saveParticipation : function(index , value){
				//alert(index);
				var data = {};
				data.participation = value; 
				data.namingConvention = $scope.LSMgmt.namingConvention[index]; 
				data.newTitle = $scope.LSMgmt.newTitle[index]; 
				ChaptersService.saveSetting($scope.LSMgmt.chapters[index]._id , data).then(function(data){
					console.log(data);
					if ( data.data.status == 200 ) {
						$scope.LSMgmt.getChapters();
						//$scope.setFlashInstant('Settings Saved' , 'success');
					}else if(data.data.status == 401){
						//$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
					else{
						//$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
				})
			},
			saveAndLaunch : function(index , flag){
				//alert(index);
				var data = {};
				data.participation = $scope.LSMgmt.participation[index]; 
				data.namingConvention = $scope.LSMgmt.namingConvention[index]; 
				data.newTitle = $scope.LSMgmt.newTitle[index]; 
				ChaptersService.saveAndLaunch($scope.LSMgmt.chapters[index]._id , data).then(function(data){
					console.log(data);
					if ( data.data.status == 200 ) {
						$scope.LSMgmt.getChapters();
						$scope.setFlashInstant('Settings Saved' , 'success');
						$location.path('/manage-chapters/'+$scope.LSMgmt.capsule_id)
					}else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
				})
			},
			getAllGroups :  function(pNo){
				LSService.getAllGroups(pNo , this.perPageGroups).then(function(data){
					console.log(data)
					if (data.data.code == 200) {
						for(var i = 0; i < $scope.LSMgmt.chapters.length ; i++){
							$scope.LSMgmt.groups[$scope.LSMgmt.chapters[i]._id] = data.data.groups;
						}
						//$scope.LSMgmt.groups = data.data.groups;
						$scope.LSMgmt.totalGroups = data.data.total;
					}
				})
			},
			getGroupsSpecific :  function( pNo , id ){
				LSService.getAllGroups( pNo , this.perPageGroups ).then(function(data){
					if (data.data.code == 200) {
					$scope.LSMgmt.groups[id] = data.data.groups;
					$scope.LSMgmt.totalGroups = data.data.total;
					}
				})
			},
			getAllMembers : function(id, index, chapterID){
				//alert(id);
				$scope.LSMgmt.showGroupMembers[index] = true;
				$scope.LSMgmt.showGroups[index] = false;
				$scope.LSMgmt.showFriends[index] = false;
				console.log($scope.LSMgmt.groups[chapterID]);
				$scope.LSMgmt.groupMembers =$.map($scope.LSMgmt.groups[chapterID] , function( group ) {
					return group._id == id ? group.Members : null;
				});
				console.log($scope.LSMgmt.groupMembers);
			},
			saveAndLaunch : function(index){
				//alert(index);
				var data = {};
				data.participation = $scope.LSMgmt.participation[index]; 
				data.namingConvention = $scope.LSMgmt.namingConvention[index]; 
				data.newTitle = $scope.LSMgmt.newTitle[index]; 
				ChaptersService.saveSetting($scope.LSMgmt.chapters[index]._id , data).then(function(data){
					console.log(data);
					if ( data.data.status == 200 ) {
						$scope.LSMgmt.getChapters();
						$scope.setFlashInstant('Settings Saved' , 'success');
						$location.path('/manage-chapters/'+$scope.LSMgmt.capsule_id)
					}else if(data.data.status == 401){
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
					}
				})
			}
		};
		app.init();
		return app;
	})();
}]);