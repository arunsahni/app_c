var collabmedia = angular.module('collabmedia');
/*
$('body').animate({scrollTop:$('#top3').offset().top}, '500', 'swing', function() { 
   //alert("Finished animating"+body.scrollTop());
});
*/

collabmedia.controllerProvider.register('lsOwnMgmtCtrl',['$scope', '$location','$timeout','loginService','LSService','$stateParams','ChaptersService','LaunchSettingsService','CapsulesService','$http', function($scope, $location, $timeout, loginService,LSService,$stateParams,ChaptersService,LaunchSettingsService,CapsulesService, $http){
	//module collabmedia: chapters management
	//module collabmedia: chapters management
	loginService.chkUserLogin($http,$location).then(function(){
		$scope.userInfo = tempData;
		userdata = $scope.userInfo;
		console.log($scope.userInfo);
	});
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
								$location.path('/dashboard-chapters/'+$scope.LsCapsuleMgmt.capsule_id);
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
				if( !$scope.LSMgmt.chapters.length ){
					alert("Oops! You can't publish an empty capsule. Add a chapter and try again.");
					return;
				}
				
				if(this.makingFor == 'SUBSCRIBERS'){
					alert("Publish for subscribers case is on hold for now...Try other options.");return;
				}
				
				$scope.setFlashInstant('Launching...' , 'success');
				var temp = {};
				temp.makingFor = this.makingFor ;
				temp.title = this.newTitle;
				if (temp.makingFor == 'myself') {
					temp.participation = $scope.LsCapsuleMgmt.participation;
				}else{
					temp.participation = $scope.LsCapsuleMgmt.participationO;
				}
				CapsulesService.publish( this.capsule_id , temp ).then(function(data){
					if (data.data.status == 200) {
						$timeout(function(){
							$scope.setFlashInstant('Capsule has been Launched sucessfully.' , 'success');
							//$scope.LsCapsuleMgmt.getCapsuleData();	//no need
							$location.path('/dashboard');
						},1000)
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
			perPageGroups : 5,
			perPageFriends : 20,
			pageNoGroups : {},
			//pageNoFriends : [],
			memberPaginate : [],
			pageNoInvitee : {},
			pageNoFrnd : {},
			pageNoMembers : {},
			totalFrnds : 0,
			totalGroups : 0,
			// variables for slider added by arun sahani 2032016
			groupMode: true,
			sliderval: 1,
			sliderval1: 1,
			toggleDiv: false,
			friend_hide: [],
			group_hide: [],
			
			init : function(){
				$('body').removeClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').removeClass('chapter');
				//$scope.relations = [];
				$scope.friends = {};
				this.getChapterData();
				this.getFsgs();
				this.getChapters();
				$scope.groupSlider = {
					name: 'percentage'
			        };
				//this.getAllGroups(1);
				// options for Slider by arun sahani
				$scope.options = {				
					from: 1,
					to: 100,
					floor: true,
					step: 1,
					dimension: " ",
					css: {
						default: {"background-color": "white"},
						before: {"background-color": "white"},
						after: {"background-color": "white"},
						pointer: {"background-color": "grey"}
					}      
				};
				$scope.options1 = {				
					from: 1,
					to: 100,
					floor: true,
					step: 1,
					dimension: " ",
					css: {
						default: {"background-color": "white"},
						before: {"background-color": "white"},
						after: {"background-color": "white"},
						pointer: {"background-color": "grey"}
					} 
				};
				
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
							if( $scope.currentCapsule.IsLaunched ){
								$scope.setFlashInstant('Invitation sent.' , 'success');
							}
							else{
								$scope.setFlashInstant('User added! A notification email will be delivered at the time of publish.' , 'success');
							}
							
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
			inviteMember : function(data , id ,  index, flag, ChpterIndex){
				console.log(index);
				var member = {};
				//if ($scope.LSMgmt.showGroupMembers[index]) {
				if (flag == 'group') {
					member.UserID = data.MemberID;
					member.UserEmail = data.MemberEmail;
					member.UserName = data.MemberName;
					member.UserNickName = data.MemberNickName;
					member.CreatedOn = Date.now();
					member.Relation = data.MemberRelation;
					member.RelationId = data.MemberRelationID;
					member.UserPic = data.MemberPic;
				}else if (flag == 'friends') {
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
						
						if( $scope.currentCapsule.IsLaunched ){
							$scope.setFlashInstant('Invitation sent.' , 'success');
							if (flag == 'friends') {
								$scope.LSMgmt.toggleFriends(index);
							}else{
								$scope.LSMgmt.toggleGroups(index);	
							}
						}
						else{
							$scope.setFlashInstant('User added! A notification email will be delivered at the time of publish.' , 'success');
							// added by Arun sahani 1032016
							if (flag == 'friends') {
								console.log("Flag Friend",ChpterIndex);
								$scope.LSMgmt.toggleFriends(ChpterIndex);
							}else{
								console.log("Flag Group",ChpterIndex);
								$scope.LSMgmt.toggleGroups(ChpterIndex);	
							}
						}
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
							$location.path('/dashboard-chapters/'+$scope.LSMgmt.capsule_id)
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
			getAllMembers : function(id, index, chapterID,ChpIndex){
				//alert(id);
				groupId = id;
				$scope.LSMgmt.showGroupMembers[index] = true;
				$scope.LSMgmt.showGroups[index] = false;
				$scope.LSMgmt.showFriends[index] = false;
				
				console.log($scope.LSMgmt.groups[chapterID]);
				$scope.LSMgmt.groupMembers =$.map($scope.LSMgmt.groups[chapterID] , function( group ) {
					return group._id == id ? group.Members : null;
				});
				console.log($scope.LSMgmt.groupMembers);
				
				// added by Arun Sahani 1032016
				if($scope.LSMgmt.showGroupMembers[index] == true) {
					if($('#group_members'+index).hasClass('visible')) {
						
						$('.closeOverlay1').fadeIn('fast');
						$('.closeOverlay1').addClass('visible');
						
						$('#group_members'+index).fadeOut('fast');
						$('#group_members'+index).removeClass('visible');
						
						
					} else {
							
						$('#group_members'+index).fadeIn('fast');
						$('#group_members'+index).addClass('visible');
						
						$('.closeOverlay1').fadeOut('fast');
						$('.closeOverlay1').removeClass('visible');
						
						//$('#settings .members-con #groups').fadeOut('fast');
						//$('#settings .members-con #groups').removeClass('visible');
						
						
						
					}
				}
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
			},
			// added by Arun Sahani 1032016
			toggleFriends: function(index){
				console.log("Index",index)
				if($('.show-members').length) {
					if($('#friends'+index).hasClass('visible')) {
						$('#friends'+index).removeClass('visible');
						$('#friends'+index).fadeOut('fast');
						
						//$('#settings .members-con #members').fadeIn(300);
						//$('#settings .members-con #members').addClass('visible');
						$scope.LSMgmt.friend_hide[index] = false;
						
					} else {
						$('#friends'+index).addClass('visible');
						$('#friends'+index).fadeIn('fast');
						
						//$('#settings .members-con #members').fadeOut(300);
						//$('#settings .members-con #members').removeClass('visible');
						$scope.LSMgmt.friend_hide[index] = true;
						
					}
					 
				}
			},
			// added by arun sahani 2032016
			toggleGroups: function(index){
				if($('.show-members').length) {
					if($('#groups'+index).hasClass('visible')) {
						$('#groups'+index).removeClass('visible');
						$('#groups'+index).fadeOut('fast');
					
						//$('#settings .members-con #members').fadeIn(300);
						
						$scope.LSMgmt.group_hide[index] = false;
						
					} else {
						$('#groups'+index).addClass('visible');
						$('#groups'+index).fadeIn('fast');
					
						$scope.LSMgmt.group_hide[index] = true;
						
						//$('#settings .members-con #members').fadeOut(300);
						//$('#settings .members-con #members .friend-list-rw').addClass('hidden');
						
					}
				}
			},
			// To change groupmode by arun sahani
			chgGroupMode: function(index, arg, groupSlider) {
				if (arg == 'first') {
				   $scope.groupSlider.name = groupSlider;
				   $scope.LSMgmt.groupMode = true;
				}
				if (arg == 'second') {
				   $scope.groupSlider.name = groupSlider;
         			   $scope.LSMgmt.groupMode = false;
				} 
			}
		};
		app.init();
		return app;
	})();
	
	
	//new requirement - combining Group Management Module
	$scope.LSGroupMgmt = (function(){
		
		var app = {
			group : {},
			member : {},
			friend_hide: [],
			selectedMember : {},
			group_hide: [],
			init : function(){
				
			},//Add, View , //Delete
			
			addGroup : function(invalid, index){
			//update group listing $scope variable, so that html view will be sync.
				console.log($scope.LSGroupMgmt.myFile)
				//alert(invalid);return;
				if (!invalid && $scope.LSGroupMgmt.myFile != undefined) {
				    $http.post('/groups/addGroup',$scope.LSGroupMgmt.group).then(function(data){
					console.log(data);
					if (data.data.code == 200) {
					    $scope.setFlashInstant('Group added successfully.' , 'success');
					    var uploadUrl = "/groups/iconUpload";
					    var fd = new FormData();
					    fd.append('file', $scope.LSGroupMgmt.myFile);
					    fd.append('groupID', data.data.data._id);
					    $http.post(uploadUrl, fd, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					    })
					    .success(function(abc){
						console.log("value returned to service in success function = "+abc.filename);
						$scope.LSMgmt.toggleGroups(index);
						$scope.LSMgmt.getAllGroups(1);
						$scope.LSGroupMgmt.group.title = '';
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
			},
			deleteGroup : function(){
				//update group listing $scope variable, so that html view will be sync.
				
			},
			addGroupMember : function(){
				
				
			},
			deleteGroupMember : function(){
				
				
			},
			// For Toggle Group Overlay added by arun sahani
			toggleGroups: function(index){
				if($('.show-members').length) {
					if($('#groups'+index).hasClass('visible')) {
						$('#groups'+index).removeClass('visible');
						$('#groups'+index).fadeOut('fast');
						$scope.LSGroupMgmt.group_hide[index] = false;
					} else {
						$('#groups'+index).addClass('visible');
						$('#groups'+index).fadeIn('fast');
						$scope.LSGroupMgmt.group_hide[index] = true;
					}
				}
			},
			// To add member in group
			addMember: function(invalid){
				console.log("Member add=============",$scope.LSGroupMgmt.member)
				if (!invalid && $scope.LSGroupMgmt.member.relation != null && $scope.LSGroupMgmt.member.relation != undefined) {
				    if (($scope.LSGroupMgmt.member.email).toLowerCase() != ($scope.userInfo.Email).toLowerCase()) {
					$scope.LSGroupMgmt.finalAddToGroup($scope.LSGroupMgmt.member);
				    }else{
					$scope.setFlashInstant('<span style="color:red">You can\'t add yourself as a member/friend.</span>' , 'error');        
				    }
				}
                        },
			finalAddToGroup: function(frnd){
				console.log("GroupID",groupId);
				
				$http.post('/groups/addMember',{'email':frnd.email,'name':frnd.name,'id':groupId,'relation': frnd.relation}).then(function(data){
				    if (data.data.code == 401) {
					$scope.setFlashInstant('<span style="color:red">This user is already a member of this group.</span>' , 'error');        
				    }else if (data.data.code == 402) {
					$scope.setFlashInstant('<span style="color:red">Opps!! Something went wrong.</span>' , 'error');        
				    }else if (data.data.code == 403) {
					$scope.setFlashInstant('<span style="color:red">This user is not registered with scrpt right now.</span>' , 'error');        
				    }else if (data.data.code == 200) {
					$scope.LSMgmt.groupMembers.push(data.data.data.member);
					$scope.LSMgmt.getAllGroups(1);
					console.log("Newly Add======", $scope.LSMgmt.groupMembers);
					$scope.setFlashInstant('Member added successfully' , 'success');        
					$scope.LSGroupMgmt.member.email = "";
					$scope.LSGroupMgmt.member.name = '';
					$scope.LSGroupMgmt.member.relation = null;
					$('select').prop('selectedIndex', 0).selectric('refresh');
					//$scope.LSGroupMgmt.updateCurrentGroup();
					
					//$scope.getAllFriends($scope.currentGroup.Members);
				    }
				});
			},
			// To get index 
			getObjArrayIdxByKey : function(ObjArr , matchKey , matchVal){
				var idx;
				for( var loop = 0; loop < ObjArr.length; loop++ ){
					if (ObjArr[loop].hasOwnProperty(matchKey)) {
						if(ObjArr[loop][matchKey] == matchVal){
							idx = loop;
							break;
						}
					}
				}
				return idx;
			},
			// To add all members of group to member listing.
			addAllMembersofGroup: function(id,chapterID){
				$scope.LSMgmt.groupMembers =$.map($scope.LSMgmt.groups[chapterID] , function( group ) {
					return group._id == id ? group.Members : null;
				});
				console.log("LsMgt----------------------------", $scope.LSMgmt.groupMembers);
				console.log("--------------------------------------");
				
				var idx = $scope.LSGroupMgmt.getObjArrayIdxByKey($scope.LSMgmt.chapters , '_id' , chapterID);
				
				/*
				for( var loop = 0; loop < $scope.LSMgmt.groupMembers.length; loop++ ){
					$scope.LSMgmt.groupMembers =$.map($scope.LSMgmt.chapters[idx].LaunchSettings.Invitees , function( invitee ) {
						return invitee._id == $scope.LSMgmt.groupMembers[loop]._id ? 1 : null;
					});
						
				}*/
				
				if ($scope.LSMgmt.groupMembers) {
					var allSuccValiFlag = 0;
					var allErrValiFlag = 0;
					
					var resultCount = 0;
					$scope.setFlashInstant('<span style="color:green">Processing...</span>' , 'success');
					if (!$scope.LSMgmt.groupMembers.length) {
						//code
						$scope.setFlashInstant('<span style="color:red">There are no members in this group.</span>' , 'error');
						return;
					}
					
					for( var loop = 0; loop < $scope.LSMgmt.groupMembers.length; loop++ ){
						var invitee = {};
						invitee.IsRegistered = $scope.LSMgmt.groupMembers[loop].IsRegistered;
						invitee.Relation     = $scope.LSMgmt.groupMembers[loop].MemberRelation;
						invitee.UserEmail    = $scope.LSMgmt.groupMembers[loop].MemberEmail;
						invitee.UserName     = $scope.LSMgmt.groupMembers[loop].MemberName;
						invitee.UserPic      = $scope.LSMgmt.groupMembers[loop].MemberPic;
						invitee._id          = $scope.LSMgmt.groupMembers[loop]._id;
						invitee.RelationId   = $scope.LSMgmt.groupMembers[loop].MemberRelationID;
						
						LSService.inviteMembers( chapterID , invitee ).then(function(data){
							console.log(data)
							
							resultCount++;
							if ( data.data.status == 200 ) {
								$scope.LSMgmt.chapters[idx].LaunchSettings.Invitees.push(invitee);
								$scope.LSMgmt.getChapters();
								
								allSuccValiFlag++;
								if (allSuccValiFlag == $scope.LSMgmt.groupMembers.length) {
									//code
									$timeout(function(){
										$scope.setFlashInstant('Done..., A notification email will be delivered at the time of publish to each member of this chapter.' , 'success');
									},1000)
								}
								
							}else if(data.data.status == 401){
								allErrValiFlag++;
								
								if (allErrValiFlag == $scope.LSMgmt.groupMembers.length) {
									//code
									$timeout(function(){
										$scope.setFlashInstant('<span style="color:red">These members are already added.</span>' , 'error');	
									},1000)
								}
							}
							else{
								$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
							}
							
							
							if (resultCount == $scope.LSMgmt.groupMembers.length  && (allSuccValiFlag != $scope.LSMgmt.groupMembers.length && allErrValiFlag != $scope.LSMgmt.groupMembers.length)) {
								//code
								$timeout(function(){
									$scope.setFlashInstant('Done..., A notification email will be delivered at the time of publish to each member of this chapter.' , 'success');
								},1000)
							}
						})
					}	
				} 
				console.log("scope.LSMgmt.chapters[idx].LaunchSettings.Invitees------------",$scope.LSMgmt.chapters[idx].LaunchSettings.Invitees);
				console.log("--------------------------------------");
			},
			
			// To add all members of group to Capsule member listing.
			addAllMembersofGroupToCapsule: function(id){
				$scope.LsCapsuleMgmt.groupMembers =$.map($scope.LsCapsuleMgmt.groups , function( group ) {
					return group._id == id ? group.Members : null;
				});
				console.log("$scope.LsCapsuleMgmt.groupMembers---------------------------", $scope.LsCapsuleMgmt.groupMembers);
				console.log("--------------------------------------");
				
				var capsuleID= $stateParams.capsule_id;
				if ($scope.LsCapsuleMgmt.groupMembers) {
					var allSuccValiFlag = 0;
					var allErrValiFlag = 0;
					
					var resultCount = 0;
					$scope.setFlashInstant('<span style="color:green">Processing...</span>' , 'success');
					if (!$scope.LsCapsuleMgmt.groupMembers.length) {
						//code
						$scope.setFlashInstant('<span style="color:red">There are no owners/leads in this group.</span>' , 'error');
						return;
					}
					for( var loop = 0; loop < $scope.LsCapsuleMgmt.groupMembers.length; loop++ ){
						var invitee = {};
						invitee.IsRegistered = $scope.LsCapsuleMgmt.groupMembers[loop].IsRegistered;
						invitee.Relation     = $scope.LsCapsuleMgmt.groupMembers[loop].MemberRelation;
						invitee.UserEmail    = $scope.LsCapsuleMgmt.groupMembers[loop].MemberEmail;
						invitee.UserName     = $scope.LsCapsuleMgmt.groupMembers[loop].MemberName;
						invitee.UserPic      = $scope.LsCapsuleMgmt.groupMembers[loop].MemberPic;
						invitee._id          = $scope.LsCapsuleMgmt.groupMembers[loop]._id;
						invitee.RelationId   = $scope.LsCapsuleMgmt.groupMembers[loop].MemberRelationID;
						
						CapsulesService.inviteMembers( capsuleID , invitee ).then(function(data){
							console.log(data)
							resultCount++;
							if ( data.data.status == 200 ) {
								$scope.currentCapsule.LaunchSettings.Invitees.push(invitee);
								$scope.LsCapsuleMgmt.getCapsuleData();
								allSuccValiFlag++;
								if (allSuccValiFlag == $scope.LsCapsuleMgmt.groupMembers.length) {
									//code
									$timeout(function(){
										$scope.setFlashInstant('Done..., A notification email will be delivered at the time of publish to each Owner/Lead of this chapter.' , 'success');
									},1000)
								}
								//$scope.setFlashInstant('User added! A notification email will be delivered at the time of publish.' , 'success');
							}else if(data.data.status == 401){
								allErrValiFlag++;
								
								if (allErrValiFlag == $scope.LsCapsuleMgmt.groupMembers.length) {
									//code
									$timeout(function(){
										$scope.setFlashInstant('<span style="color:red">These Owners/Leads are already added.</span>' , 'error');	
									},1000)
								}
								//$scope.setFlashInstant('<span style="color:red">This member is already added.</span>' , 'error');
							}
							else{
								$scope.setFlashInstant('Opps!! Something went wrong' , 'error');
							}
							
							if (resultCount == $scope.LsCapsuleMgmt.groupMembers.length  && (allSuccValiFlag != $scope.LsCapsuleMgmt.groupMembers.length && allErrValiFlag != $scope.LsCapsuleMgmt.groupMembers.length)) {
								//code
								$timeout(function(){
									$scope.setFlashInstant('Done..., A notification email will be delivered at the time of publish to each Owner/Lead of this capsule.' , 'success');
								},1000)
							}
						})
					}	
				} 
				console.log("--------------------------------------");
			}
			
		};
		
		app.init();
		return app;
	})();

}]);