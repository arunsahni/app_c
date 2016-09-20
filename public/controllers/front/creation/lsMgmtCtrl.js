var collabmedia = angular.module('collabmedia');
/*
$('body').animate({scrollTop:$('#top3').offset().top}, '500', 'swing', function() { 
   //alert("Finished animating"+body.scrollTop());
});
*/

collabmedia.controllerProvider.register('lsMgmtCtrl',['$scope', '$location','$timeout','$upload','loginService','LSService','$stateParams','ChaptersService','LaunchSettingsService','CapsulesService','$http','$window', function($scope, $location, $timeout,$upload, loginService,LSService,$stateParams,ChaptersService,LaunchSettingsService,CapsulesService, $http, $window){
	//module collabmedia: chapters management
	//module collabmedia: chapters management
	loginService.chkUserLogin($http,$location,$window).then(function(){
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
			pageNoFriends : 1,
			newCover : "",
                        MenuIcon : "",
			init : function(){
				
				$scope.friends =[];
				$('body').removeClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').removeClass('chapter');
				$('#loader-ls').css("display", "block");
				this.getCapsuleData();
				this.getFsgs();
				
				$timeout(function(){
					app.scrollSection($stateParams.jump_to);
				},5000)
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
                                        if ($scope.currentCapsule.MenuIcon) {
						$scope.LsCapsuleMgmt.MenuIcon = "/assets/Media/menu/resized/"+$scope.currentCapsule.MenuIcon;
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
			inviteMember : function(data, flag){
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
						//// added by Arun sahani 1032016
						if (flag == 'friends') {
							
							$scope.LsCapsuleMgmt.toggleFriends();
						}else {
							
							$scope.LsCapsuleMgmt.getAllMembers()
							//$scope.LsCapsuleMgmt.toggleGroupsOth();	
						}
					}else if(data.data.status == 401){
						$scope.setFlashInstant('<span style="color:red">This member is already added.</span>' , 'success');
					}
					else{
						$scope.setFlashInstant('Opps!! Something wenttoggleGroupsOth wrong' , 'error');
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
			getAllMembers : function(id, index){
				//alert(id);
				groupId = id;
				$scope.LsCapsuleMgmt.showGroupMembers = true;
				$scope.LsCapsuleMgmt.showGroups = false;
				$scope.LsCapsuleMgmt.showFriends = false;
				console.log($scope.LsCapsuleMgmt.groups);
				$scope.LsCapsuleMgmt.groupMembers =$.map($scope.LsCapsuleMgmt.groups , function( group ) {
					return group._id == id ? group.Members : null;
				});
				console.log($scope.LsCapsuleMgmt.groupMembers);
				// added by arun sahani 2032016
				if($scope.LsCapsuleMgmt.showGroupMembers == true) {
					if($('#group_members_Oth').hasClass('visible')) {
						
						$('.closeOverlay').fadeIn('fast');
						$('.closeOverlay').addClass('visible');
						
						$('#group_members_Oth').fadeOut('fast');
						$('#group_members_Oth').removeClass('visible');
						
						
					} else {
						
						
						$('#group_members_Oth').fadeIn('fast');
						$('#group_members_Oth').addClass('visible');
						
						$('.closeOverlay').fadeOut('fast');
						$('.closeOverlay').removeClass('visible');
						
						//$('#settings .members-con #groups').fadeOut('fast');
						//$('#settings .members-con #groups').removeClass('visible');
						
						
						
					}
				}
			},
			// added by Arun Sahani 29022016
			toggleFriends: function(){
				if($('.cpsltoggleSf').length) {
					if($('#friends_Oth').hasClass('visible')) {
						
						$('#friends_Oth').removeClass('visible');
						$('#friends_Oth').fadeOut('fast');
						
						//$('#settings .members-con #members').fadeIn(300);
						//$('#settings .members-con #members').addClass('visible');
						$scope.friend_hide_Oth = false;
						
					} else {
						
						$('#friends_Oth').addClass('visible');
						$('#friends_Oth').fadeIn('fast');
						
						
						//$('#settings .members-con #members').fadeOut(300);
						//$('#settings .members-con #members').removeClass('visible');
						$scope.friend_hide_Oth = true;
						
					}
					 
				}
			},
			
			// added by Arun Sahani 29022016
			toggleGroupsOth: function(){
				if($('.cpsltoggleSg').length) {
					if($('#groups_Oth').hasClass('visible')) {
						$('#groups_Oth').removeClass('visible');
						$('#groups_Oth').fadeOut('fast');
						
						//$('#settings .members-con #members').fadeIn(300);
						
						$scope.group_hide_Oth = false;
						
					} else {
						
						$('#groups_Oth').addClass('visible');
						$('#groups_Oth').fadeIn('fast');
					
						$scope.group_hide_Oth = true;
						
						//$('#settings .members-con #members').fadeOut(300);
						//$('#settings .members-con #members .friend-list-rw').addClass('hidden');
						
					}
				}
			},
			scrollSection: function(sectionName){
                            $('#loader-ls').css("display", "none");
                            if (sectionName == 'DE') {
                                console.log("Section---------",sectionName)
                                $('.design_n_exp').css('opacity',0);
                                //$('body,html').scrollTop($('.design_n_exp').offset().top-45);
				$('html, body').animate({scrollTop: $('.design_n_exp').offset().top-45}, 1000);

                                $timeout(function(){
                                    $('.design_n_exp').css('transition','opacity 2s ease');
                                    $('.design_n_exp').css('opacity',1); 
                                    //$timeout(function(){
                                        $('.design_n_exp').css('transition','opacity 0s ease');
                                    //},500)
                                },400)
                            } else{
                                console.log("Section---------",sectionName)
				//$('body,html').scrollTop($('.audience_n_inv').offset().top);
				$('html, body').animate({scrollTop:$('.audience_n_inv').offset().top}, 1000);
                              
                            }
			},
			uploadMenuIcon: function(file){
                            console.log(file)
                            $upload.upload({
                                    url : '/capsules/uploadMenuIcon',
                                    method: 'POST',
                                    headers: {'my-header': 'my-header-value'},
                                    data : {
                                            capsule_id : $scope.LsCapsuleMgmt.capsule_id
                                    },
                                    file: file[0],
                                    fileFormDataName: 'myFile'
                            }).success(function(data, status, headers, config) {				
                                    console.log("Data ---",data);
				    if (data.code == 400) {
					$scope.setFlashInstant('<span style="color:red">Menu icon must be  square in size.</span>' , 'success');
				    }else{
					$timeout(function(){
                                            $scope.LsCapsuleMgmt.MenuIcon = "/assets/Media/menu/resized/"+data.result.MenuIcon;
					},1000)
				    }
                                 
                            })
			},
			deleteMenuIcon: function(){
				  if (confirm("Do you want to delete your menu icon?")) {
                                        $http.post('/capsules/delMenuIcon',{capsule_id: $stateParams.capsule_id}).then(function (data, status, headers, config) {
                                            if (data.data.status==200){
						$scope.LsCapsuleMgmt.MenuIcon = '';
						$scope.setFlashInstant('<span>Menu icon deleted successfully.</span>' , 'success');
                                               
                                            }
                                        })
                                    }
			},
			delCoverArt: function(){
				//if ($scope.LsCapsuleMgmt.newCover!='') {
					if (confirm("Do you want to delete your Cover Art?")) {
						$http.post('/capsules/delCoverArt',{capsule_id: $stateParams.capsule_id}).then(function (data, status, headers, config) {
						    if (data.data.status==200){
							$scope.LsCapsuleMgmt.newCover = '';
							$scope.setFlashInstant('<span>Cover art deleted successfully.</span>' , 'success');
						    }
						})
					}
				//}
			
			}
			
		};
		app.init();
		return app;
	})();
	
	
	//$watch for updating conditional chapters view 
	$scope.$watch("LsCapsuleMgmt.makingFor", function(newValue , oldValue) {  
		"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.LSMgmt.set_chapter_views()
	});
	//$(document).on('click','.show-members',function(){
	//	$(this).hide();
	//});
	
	
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
			currentChapterId: 0,
                        MenuIcon : [],
			init : function(){
				$('body').removeClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').removeClass('chapter');
				//$scope.relations = [];
				
				$scope.friends = {};
				this.getChapterData();
				this.getFsgs();
				this.getChapters();
				//this.getAllGroups(1);
			
				$scope.groupSlider = {
					name: 'percentage'
			        };
			
				// options for Slider by arun sahani
				$scope.options = {				
					from: 1,
					to: 100,
					floor: true,
					step: 1,
					skin: "plastic",
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
						console.log("Chapters",data.data.results);
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
                                $scope.LSMgmt.MenuIcon[i] = $scope.LSMgmt.chapters[i].MenuIcon ? "/assets/Media/menu/resized/"+$scope.LSMgmt.chapters[i].MenuIcon : "";
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
			inviteMember : function(data , id ,  index, flag,ChpterIndex){
				console.log("Index",index);
				console.log("=================Invited member===>",data);
				console.log("=================Display Flag===>",flag);
				
				var member = {};
				console.log("Index --------------------->",$scope.LSMgmt.showGroupMembers[index])
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
				
				console.log("data------------------------------>",data);
				console.log("Member data------------------------------>",member);
				LSService.inviteMembers( id , member ).then(function(data){
					console.log(data)
					if ( data.data.status == 200 ) {
						$scope.LSMgmt.getChapters();
						$scope.setFlashInstant('User added! A notification email will be delivered at the time of publish.' , 'success');
						
						// added by Arun sahani 1032016
						if (flag == 'friends') {
							console.log("Chapter Index------",index)
							$scope.LSMgmt.toggleFriends(index);
						}else {
							$scope.LSMgmt.toggleGroups(index);	
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
				console.log("Data------------------",data)
				console.log("id------------------",id)
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
			getAllMembers : function(id, index, chapterID,ChpIndex){
				groupId = id;
				$scope.LSMgmt.showGroupMembers[index] = true;
				$scope.LSMgmt.showGroups[index] = false;
				$scope.LSMgmt.showFriends[index] = false;
				console.log($scope.LSMgmt.groups[chapterID]);
				console.log("==============================================")
				console.log("Group id---",id,"<-->","index",index,"<-->","chapterID---",chapterID,"<-->","ChpIndex---",ChpIndex)
				console.log("==============================================")
				// added by arun sahani 2032016
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
				$scope.LSMgmt.groupMembers =$.map($scope.LSMgmt.groups[chapterID] , function( group ) {
					console.log("Particular member---", group,"----",id);
					return group._id == id ? group.Members : null;
				});
				console.log("$scope.LSMgmt.groupMembers ---", $scope.LSMgmt.groupMembers);
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
			},
			
			
			// added by arun sahani 2032016
			toggleFriends: function(index){
				console.log("Index",index)
				//$(event.target).css('display','none');
				//console.log(ele);
				//console.log(ele.attr('class'));
				
				if($('.show-members').length) {
					if($('#friends'+index).hasClass('visible')) {
						
						//$(event.target).css('display','none');
						$('#friends'+index).removeClass('visible');
						$('#friends'+index).fadeOut('fast');
						//$('#settings .members-con #members').fadeIn(300);
						//$('#settings .members-con #members').addClass('visible');
						$scope.LSMgmt.friend_hide[index] = false;
						
					} else {
						//$(event.target).css('display','none');
						$('#friends'+index).addClass('visible');
						$('#friends'+index).fadeIn('fast');
						//$('#settings .members-con #members').fadeOut(300);
						//$('#settings .members-con #members').removeClass('visible');
						$scope.LSMgmt.friend_hide[index] = true;
						
					}
				}
			},
			toggleGroups: function(index, chapterDataId){
				$scope.LSMgmt.currentChapterId = chapterDataId;
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
			uploadMenuIconChp: function(index,file){
                            console.log(file)
                            $upload.upload({
                                    url : '/chapters/uploadMenuIcon',
                                    method: 'POST',
                                    headers: {'my-header': 'my-header-value'},
                                    data : {
                                            chapter_id : $scope.LSMgmt.chapters[index]._id
                                    },
                                    file: file[0],
                                    fileFormDataName: 'myFile'
                            }).success(function(data, status, headers, config) {				
				    if (data.code == 400) {
					$scope.setFlashInstant('<span style="color:red">Menu icon must be  square in size.</span>' , 'success');
				    }else{
					$timeout(function(){
						$scope.LSMgmt.MenuIcon[index] = "/assets/Media/menu/resized/"+data.result.MenuIcon;
						console.log("Her i am ",$scope.LSMgmt.MenuIcon);
					},1000)
				    }
                            })
			},
			deleteMenuIcon: function(chpData,index){
				console.log("Chp--",chpData._id);
				if (confirm("Do you want to delete your menu icon?")) {
                                        $http.post('/chapters/delMenuIcon',{chapter_id: chpData._id}).then(function (data, status, headers, config) {
                                            if (data.data.status==200){
 					       $scope.LSMgmt.MenuIcon[index] = "";
                                               $scope.setFlashInstant('<span>Menu icon deleted successfully.</span>' , 'success');
                                            }
                                        })
                                }
			},
			deleteCoverArt: function(chpData,index){
				console.log("Chp--",chpData._id,"-----------",index);
				if (confirm("Do you want to delete your Cover Art?")) {
                                        $http.post('/chapters/delCoverArt',{chapter_id: chpData._id}).then(function (data, status, headers, config) {
                                            if (data.data.status==200){
						$scope.LSMgmt.newCover[index] = "";
						$scope.setFlashInstant('<span>Cover art deleted successfully.</span>' , 'success');
                                            }
                                        })
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
			friend_group_hide: [],
			
			
			init : function(){
				
			},//Add, View , //Delete
			
			addGroup : function(validGroup, index){
			//update group listing $scope variable, so that html view will be sync.
				
				//alert(invalid);return;
				if (validGroup && $scope.LSGroupMgmt.myFile != undefined) {
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
						
						$scope.LSMgmt.getAllGroups(1);
						$scope.LSMgmt.pageNoGroups['g'+ $scope.LSMgmt.currentChapterId] = 1;
						$scope.LSMgmt.toggleGroups(index);
						$scope.LsCapsuleMgmt.pageNoGroups = 1;
						$scope.LsCapsuleMgmt.toggleGroupsOth();
						$scope.LsCapsuleMgmt.getAllGroups();
						
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
						$scope.LSGroupMgmt.friend_group_hide[index] = false;
					} else {
						$('#groups'+index).addClass('visible');
						$('#groups'+index).fadeIn('fast');
						$scope.LSGroupMgmt.friend_group_hide[index] = true;
					}
				}
			},
			// To add member in group
			addMember: function(member,invalid,makingFor){
				console.log("Member name=============",member.name)
				console.log("Member email=============",member.email)
				if (!invalid && member.relation != null && member.relation != undefined) {
				    if ((member.email).toLowerCase() != ($scope.userInfo.Email).toLowerCase()) {
					$scope.LSGroupMgmt.finalAddToGroup(member, makingFor);
				    }else{
					$scope.setFlashInstant('<span style="color:red">You can\'t add yourself as a member/friend.</span>' , 'error');        
				    }
				}
                        },
			finalAddToGroup: function(frnd, makingFor){
				console.log("member to add",frnd);
				
				$http.post('/groups/addMember',{'email':frnd.email,'name':frnd.name,'id':groupId,'relation': frnd.relation}).then(function(data){
				    if (data.data.code == 401) {
					$scope.setFlashInstant('<span style="color:red">This user is already a member of this group.</span>' , 'error');        
				    }else if (data.data.code == 402) {
					$scope.setFlashInstant('<span style="color:red">Opps!! Something went wrong.</span>' , 'error');        
				    }else if (data.data.code == 403) {
					$scope.setFlashInstant('<span style="color:red">This user is not registered with scrpt right now.</span>' , 'error');        
				    }else if (data.data.code == 200) {
					console.log("Returned data ================================",data.data.data.member)
					if (makingFor == 'mySelf') {
						$scope.LSMgmt.groupMembers.push(data.data.data.member);
						//$scope.LSMgmt.getAllMembers(groupid,index,chapterID,index);
						$scope.LSMgmt.getAllFriends();
						$scope.LSMgmt.getAllGroups(1);
						console.log("Newly Add======", $scope.LSMgmt.groupMembers);	
					} else{
						$scope.LsCapsuleMgmt.groupMembers.push(data.data.data.member);
						$scope.LsCapsuleMgmt.getAllGroups(1);
						console.log("Newly Add======", $scope.LsCapsuleMgmt.groupMembers);
					}
					
					//$scope.setFlashInstant('Member added successfully' , 'success');        
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
	
	$scope.LsSchedulingMgmt = (function(){
	
		var app = {
			capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0,
			chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0,
           
			inviation: {
				daysToLaunch : [],
				dateofLaunch: []
			},
			reminder: {
				days: [],
				daysToRemind: [],
				reminderTotal: []
			},
			showprior: [],
			invitation: 'NOW',
			maxvalue: '/^[0-9]{4}$/',
			
			init : function(){
				
				setTimeout(function(){
					$(function() {
						//$( ".datepicker" ).datepicker({
						//        onSelect: function(dateText, inst) {
						//		//Get today's date at midnight
						//		var today = new Date();
						//		today = Date.parse(today.getMonth()+1+'/'+today.getDate()+'/'+today.getFullYear());
						//		//Get the selected date (also at midnight)
						//		var selDate = Date.parse(dateText);
						//		
						//		if(selDate < today) {
						//		    //If the selected date was before today, continue to show the datepicker
						//		  
						//		    $('.datepicker').val('');
						//		    //$(inst).datepicker('show');
						//		}
						//	}	
						//});
						
						$( ".datepicker" ).datepicker({ minDate: 0, maxDate: "+1M +10D"});
						
						
					});
					
				},1000)
				
			},
			showPriorChp: function(index,selectedOption){
				
				if($scope.LsSchedulingMgmt.inviation.daysToLaunch[index] >= 9999){
					$scope.LsSchedulingMgmt.inviation.daysToLaunch[index] = 9999;
				}
				//else{
				//	alert("$scope.LsSchedulingMgmt.daysToLaunch = 9999; = "+$scope.LsSchedulingMgmt.daysToLaunch[index])
				//	
				//}
				//	alert("---------$scope.LsSchedulingMgmt.daysToLaunch = 9999; = "+$scope.LsSchedulingMgmt.daysToLaunch[index])
				//	
				if (index > 0) {
					$scope.LsSchedulingMgmt.showprior[index] = true;	
				} else {
					$scope.LsSchedulingMgmt.showprior[index] = false;
				}
			},
			invitationOption: function(selectedOption,index){
				if (selectedOption == 'NOW') {
					$scope.LsSchedulingMgmt.inviation.dateofLaunch[index] = null;
					$scope.LsSchedulingMgmt.inviation.daysToLaunch[index] = null;
				} else if (selectedOption == 'FIXED_DATE') {
					$scope.LsSchedulingMgmt.inviation.daysToLaunch[index] = null;
				} else if (selectedOption == 'XDAYS') {
					$scope.LsSchedulingMgmt.inviation.dateofLaunch[index] = null;
				}
				
			}
		};
		app.init();
		return app;
	})();
	

}]);

