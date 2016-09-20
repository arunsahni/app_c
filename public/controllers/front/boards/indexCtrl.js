var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('indexCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope){    
    $scope.search1={};
	$scope.__isMontagePrivate = false;
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
    };
	
	$scope.mobileDevice=isMobile.any();
	//$scope.mobileDevice=true;
	if ($(window).width() <= 650){
		$('.avatar-widget').css({'display':'none'})
		if ($(window).width() <= 650 && $('#media-tray-elements li').length>0) {
			$('.avatar-widget').css({'display':'block'})
		}	
	}
	/* added by parul 04022015*/
	$('#tb-1').click(function(){
		$('#cur_txt').focus();
	});
	
	$('#tb-2').click(function(){
		$('#invt_txt').focus();
	});
	//20022015
	//$('#searchfld').focus();
	$('#searchfld').click(function(){
		$scope.search1.tata2=null;
		$scope.byDesc=false;
		$scope.byTheme=true;
	})
	$('#searchfld2').click(function(){
		$scope.search1.tata1=null;
		$scope.byDesc=true;
		$scope.byTheme=false;
	})
	//var handleClicks=function(){
	//	alert(1);
	//}
	//
	//$('.ui-dialog-titlebar-close').on('click');
	//Touche(document.querySelectorAll('.ui-dialog-titlebar-close')).on('click', handleClicks);
	
	/* added by parul 04022015*/
	$scope.search1.tata="";
	$scope.search1.gt="";
	$scope.membrNm={};
	$scope.acceptedOn=null;
	//$( "#accordion" ).accordion();
	$scope.currentTheme = 'No Theme';
	$scope.setName=function(){
		var i=0;
		$('.col-xs-4').find('a').each(function(){
			$(this).attr("name", i);
			i=i+1;
		})
	}
	setTimeout(function(){
		$scope.setName();
	},6000);
	

	
	//$('body').click(function(){
	//    $(".user-info").hide();
	//});
	//$('body').click(function() {
	//    if (!$(this.target).is('.user-info')){
	//       $(".user-info").hide();
	//    }
	//});
	
	/*
	var initAll = function(){
		$http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
			    $scope.boarddata=data.data.response;
			    $scope.gt=data.data.response[0].Themes;
			    $scope.title=data.data.response[0].Title;
			    $scope.rename.title=data.data.response[0].Title;
			    
			    //time of time out function changed to 2500 from 500 by parul
			    $timeout(function(){                
				    if ($scope.userInfo._id == $scope.boarddata[0].OwnerID._id) {
						//alert(1);
					    $scope.showsetting=1;                    
				    }
				    
				    if ($scope.boarddata[0].PrivacySetting[0].BoardType=='FriendsSolo' && !$scope.showsetting) {
					    $scope.isFriendSolo=1;
				    }
				    $http.get('/projects').then(function (data, status, headers, config) {
					    if (data.data.code==200){
						    $scope.projects=data.data.response;
						    for(i in $scope.projects){
							    $scope.projectsa.push({"label":$scope.projects[i].ProjectTitle,"value":$scope.projects[i]._id});
						    }
					    }	
				    })
				    
				    
				    if (!$scope.showsetting) {
					    for (x in $scope.boarddata[0].Themes) {                    
						    if ($scope.boarddata[0].Themes[x].isApproved==0) {
							    if ($scope.boarddata[0].Themes[x].SuggestedBy!=$scope.userInfo._id) {
								    $scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"0","canAdded":"0"})   
							    }
						    }
					    }
					    
					    for (x in $scope.boarddata[0].Themes) {
						for(z in $scope.groupta){                        
							if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
								if ($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id) {
									$scope.groupta[z].title=$scope.boarddata[0].Themes[x].ThemeTitle;
									$scope.groupta[z].canDeleted="1";
									$scope.groupta[z].canAdded="0";    
								}
								
							}                            
						}
					    }
					    
					    for(z in $scope.groupta){
						    if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
							    $scope.groupta[z].canDeleted="0";
							    $scope.groupta[z].canAdded="1";
						    }                    
					    }
				    }
				    else{
					    for (x in $scope.boarddata[0].Themes) {                    
						    if ($scope.boarddata[0].Themes[x].isApproved==0) {
							    $scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"1","canAdded":"0"})
						    }
					    }
					    
					    for (x in $scope.boarddata[0].Themes) {
						    for(z in $scope.groupta){                        
							    if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
								    $scope.groupta[z].title=$scope.boarddata[0].Themes[x].ThemeTitle;
								    $scope.groupta[z].canDeleted="1";
								    $scope.groupta[z].canAdded="0";
							    }
						    }
					    }
					    
					    for(z in $scope.groupta){
						    if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
							    $scope.groupta[z].canDeleted="0";
							    $scope.groupta[z].canAdded="1";
						    }                    
					    }                    
				    }
				    
				    
				    if (typeof($scope.boarddata[0].HeaderImage)!='undefined') {                    
					    if ($scope.boarddata[0].HeaderImage!="") {
						    $scope.headerstyle="background:url(../assets/board/headerImg/"+$scope.boarddata[0].HeaderImage+");";
						    
					    }                    
				    }
				    if (typeof($scope.boarddata[0].BackgroundMusic)!='undefined') {                    
					    if ($scope.boarddata[0].BackgroundMusic!="") {
							    $('#audio').attr("src","../assets/board/backgroundAudio/"+$scope.boarddata[0].BackgroundMusic);
					    }
				    }
				    
				    
				    $(document).ready(function(){
					    //$(".customScrollbar").mCustomScrollbar();
					    startupall();
					    $("#filterbar").hover(function(){
						    //alert("m here---");
						    $(".searchinglist").addClass("highlight")
					    },
					    function(){
						    $(".searchinglist").removeClass("highlight")
					    });  

					    $('.searchBar').click(function () {
						    //alert("m her--->>>");
						    $("input#searchfld").focus();	
					    });

					    //$('#tips-btn').click(function(e){    
					    //$('#questionMenu').fadeOut('slow', function(){
					    //$('#tips, .ui-widget-overlay').fadeIn('slow');
					    //});
					    //});

					    //$('#closetips').click(function(e){    
					    //$('#tips, .ui-widget-overlay').fadeOut('slow', function(){
					    //$('#questionMenu').fadeIn('slow');
					    //});
					    //});


					    $('#tips-btn').click(function(e){    
						    $('#questionMenu').fadeOut('slow', function(){
							    $('#tips, .ui-widget-overlay').fadeIn('slow');
						    });
					    });

					    $('#closetips').click(function(e){    
						    $('#tips, .ui-widget-overlay').fadeOut('slow', function(){
							    $('#questionMenu').fadeIn('slow');
						    });
					    });

					    $(".sidemenu").click(function(){
						    $("nav").slideToggle(500);
						    $(this).toggleClass("active");
						    return false;
					    });			

					    setTimeout(function(){
						    jQuery('.text_wrap_index').each(function(){
							    if($(this).children().first().prop('tagName')!='IFRAME'){
								    //$(this).prev().hide();
							    }
						    })
						    $( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
						    
					    },1500)	
					    
					    $scope.changePT();                    
				    });
			    },2500);
			}	
		})
	};
	*/
	
	//updated by manishp on 25122014- amit's code for page theme popup issue
	$scope.current_boardId=$stateParams.id;
	//alert($scope.current_boardId);
	
	
	//function added by parul 14012015
	$scope.getBoardData=function(){
		//alert('here');
		$http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.boarddata=data.data.response;
				$rootScope.boarddata2=data.data.response;
			}
		});
	}
	
	$scope.commentIndex=function(ind){
		console.log("$scope.commentIndex = func = "+ind);
		//alert(ind)
		//if () {
		//	alert('asdsa');
		//}
	}
	
	var initAll = function(){
		$http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				//alert(1);
				//console.log(data.data.response);
				$rootScope.boarddata2=data.data.response;
			    $scope.boarddata=data.data.response;
				if ($scope.boarddata[0].Invitees!=null) {
					if ($scope.boarddata[0].Invitees.length>0) {
						//alert($scope.boarddata[0].Invitees.length+" members");
						$scope.boardMembers=true;
					}else{
						$scope.boardMembers=false;
					}
				}else{
					$scope.boardMembers=false;
				}
				if ($scope.boarddata[0].Comments!=null) {
					if ($scope.boarddata[0].Comments.length>0) {
						//alert($scope.boarddata[0].Comments.length+" comments");
						$scope.boardComments=true;	
					}else{
						$scope.boardComments=false;
					}
					
				}else{
					$scope.boardComments=false;
				}
			    $scope.gt=data.data.response[0].Themes;
			    $scope.title=data.data.response[0].Title;
			    $scope.rename.title=data.data.response[0].Title;
			    
			    //time of time out function changed to 2500 from 500 by parul
			    $timeout(function(){                
				    if ($scope.userInfo._id == $scope.boarddata[0].OwnerID._id) {
						//alert(1);
					    $scope.showsetting=1;                    
				    }
				    
				    if ($scope.boarddata[0].PrivacySetting[0].BoardType=='FriendsSolo' && !$scope.showsetting) {
					    $scope.isFriendSolo=1;
				    }
				    $http.get('/projects').then(function (data, status, headers, config) {
					    if (data.data.code==200){
						    $scope.projects=data.data.response;
						    for(i in $scope.projects){
							    $scope.projectsa.push({"label":$scope.projects[i].ProjectTitle,"value":$scope.projects[i]._id});
						    }
					    }	
				    })
				    
				    /*
				    if (!$scope.showsetting) {
					    for (x in $scope.boarddata[0].Themes) {                    
						    if ($scope.boarddata[0].Themes[x].isApproved==0) {
							    if ($scope.boarddata[0].Themes[x].SuggestedBy!=$scope.userInfo._id) {
								    $scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"0","canAdded":"0"})   
							    }
						    }
					    }
					    
					    for (x in $scope.boarddata[0].Themes) {
						for(z in $scope.groupta){                        
							if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
								if ($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id) {
									$scope.groupta[z].title=$scope.boarddata[0].Themes[x].ThemeTitle;
									$scope.groupta[z].canDeleted="1";
									$scope.groupta[z].canAdded="0";    
								}
								
							}                            
						}
					    }
					    
					    for(z in $scope.groupta){
						    if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
							    $scope.groupta[z].canDeleted="0";
							    $scope.groupta[z].canAdded="1";
						    }                    
					    }
				    }
				    else{
					    for (x in $scope.boarddata[0].Themes) {                    
						    if ($scope.boarddata[0].Themes[x].isApproved==0) {
							    $scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"1","canAdded":"0"})
						    }
					    }
					    
					    for (x in $scope.boarddata[0].Themes) {
						    for(z in $scope.groupta){                        
							    if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
								    $scope.groupta[z].title=$scope.boarddata[0].Themes[x].ThemeTitle;
								    $scope.groupta[z].canDeleted="1";
								    $scope.groupta[z].canAdded="0";
							    }
						    }
					    }
					    
					    for(z in $scope.groupta){
						    if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
							    $scope.groupta[z].canDeleted="0";
							    $scope.groupta[z].canAdded="1";
						    }                    
					    }                    
				    }
				    */
				    
					//$scope.boarddata[0].Themes containes all existing board themes
				    
				    //$scope.groupta contains all existing platform themes which are approved
				    //console.log("Previous Group Tags",$scope.groupta);
				    for (x in $scope.boarddata[0].Themes) {
						if ($scope.boarddata[0].Themes[x].isApproved==0) {
							if ($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id || $scope.showsetting) {
								$scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"1","canAdded":"0"})   
							}
							else{
								$scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"0","canAdded":"0"}) 
							}
						}
					
				    }
				    for (x in $scope.boarddata[0].Themes) {
						for(z in $scope.groupta){                        
							if( $scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].ThemeTitle != $scope.groupta[z].title ){
								$scope.groupta[z].title = $scope.boarddata[0].Themes[x].ThemeTitle+" ("+$scope.groupta[z].title+")";
							}
							
							if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
								
								if($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id || $scope.showsetting){
									$scope.groupta[z].canDeleted="1";
									$scope.groupta[z].canAdded="0";
								}
								else{
									$scope.groupta[z].canDeleted="0";
									$scope.groupta[z].canAdded="0";
								}
							}
						}
				    }
				    
				    for(z in $scope.groupta){
						if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
							$scope.groupta[z].canDeleted="0";
							$scope.groupta[z].canAdded="1";
						}                    
				    }
				    
				    console.log("Final Group Tags",$scope.groupta);
					
				    if (typeof($scope.boarddata[0].HeaderImage)!='undefined') {                    
					    if ($scope.boarddata[0].HeaderImage!="") {
						    $scope.headerstyle="background:url(../assets/board/headerImg/"+$scope.boarddata[0].HeaderImage+");";
						    
					    }                    
				    }
				    if (typeof($scope.boarddata[0].BackgroundMusic)!='undefined') {                    
					    if ($scope.boarddata[0].BackgroundMusic!="") {
							    $('#audio').attr("src","../assets/board/backgroundAudio/"+$scope.boarddata[0].BackgroundMusic);
					    }
				    }
				    
				    
				    $(document).ready(function(){
					    $(".customScrollbar").mCustomScrollbar();
					    startupall();
					    $("#filterbar").hover(function(){
						    //alert("m here---");
						    $(".searchinglist").addClass("highlight")
					    },
					    function(){
						    $(".searchinglist").removeClass("highlight")
					    });  

					    $('#tips-btn').click(function(e){    
						    $('#questionMenu').fadeOut('slow', function(){
							    $('#tips, .ui-widget-overlay').fadeIn('slow');
						    });
					    });

					    $('#closetips').click(function(e){    
						    $('#tips, .ui-widget-overlay').fadeOut('slow', function(){
							    $('#questionMenu').fadeIn('slow');
						    });
					    });

					    $(".sidemenu").click(function(){
						    $("nav").slideToggle(500);
						    $(this).toggleClass("active");
						    return false;
					    });			

					    setTimeout(function(){
						    jQuery('.text_wrap_index').each(function(){
							    if($(this).children().first().prop('tagName')!='IFRAME'){
								    //$(this).prev().hide();
							    }
						    })
						    $( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
					    },1500)	
					    $scope.changePT();
					});
			    },2500);
			}	
		})
	};
	
	initAll();
	
	/*
	$scope.update__PTObject = function(){
		//$scope.gts={};
		$scope.groupt=[];
		$scope.groupta=[];
		for(i in $scope.gts){
			$scope.groupta.push({"id":$scope.gts[i]._id,"title":$scope.gts[i].GroupTagTitle})
			$scope.groupt.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].GroupTagTitle})
		}
		//alert("m here----");
		if (!$scope.showsetting) {
			for (x in $scope.boarddata[0].Themes) {                    
				if ($scope.boarddata[0].Themes[x].isApproved==0) {
					if ($scope.boarddata[0].Themes[x].SuggestedBy!=$scope.userInfo._id) {
						$scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"0","canAdded":"0"})   
					}
				}
			}
			
			for (x in $scope.boarddata[0].Themes) {
				for(z in $scope.groupta){                        
					if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
						if ($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id) {
							$scope.groupta[z].title=$scope.boarddata[0].Themes[x].ThemeTitle;
							$scope.groupta[z].canDeleted="1";
							$scope.groupta[z].canAdded="0";    
						}
					}                            
				}
			}
			
			for(z in $scope.groupta){
				if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
					$scope.groupta[z].canDeleted="0";
					$scope.groupta[z].canAdded="1";
				}                    
			}
		}
		else{
			for (x in $scope.boarddata[0].Themes) {                    
				if ($scope.boarddata[0].Themes[x].isApproved==0) {
					$scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"1","canAdded":"0"})
				}
			}
			
			for (x in $scope.boarddata[0].Themes) {
				for(z in $scope.groupta){                        
					if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
						$scope.groupta[z].title=$scope.boarddata[0].Themes[x].ThemeTitle;
						$scope.groupta[z].canDeleted="1";
						$scope.groupta[z].canAdded="0";
					}
				}
			}
			
			for(z in $scope.groupta){
				if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
					$scope.groupta[z].canDeleted="0";
					$scope.groupta[z].canAdded="1";
				}                    
			}                    
		}
		
	}
	*/
	
	$scope.update__PTObject = function(){
		//$scope.gts={};
		$scope.groupt=[];
		$scope.groupta=[];
		/*
		for(i in $scope.gts){
			$scope.groupta.push({"id":$scope.gts[i]._id,"title":$scope.gts[i].GroupTagTitle})
			$scope.groupt.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].GroupTagTitle})
		}
		*/
		//added on 17032015 by paruls
		for(i in $scope.gts){
			if ($scope.gts[i].status==1) {
				$scope.groupta.push({"id":$scope.gts[i]._id,"title":$scope.gts[i].GroupTagTitle})
			}	
			$scope.groupt.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].GroupTagTitle})
		}
		//added on 17032015
		for (x in $scope.boarddata[0].Themes) {
			if ($scope.boarddata[0].Themes[x].isApproved==0) {
				if ($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id || $scope.showsetting) {
					$scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"1","canAdded":"0"})   
				}
				else{
					$scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"0","canAdded":"0"}) 
				}
			}
		
		}
		for (x in $scope.boarddata[0].Themes) {
			for(z in $scope.groupta){                        
				if( $scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].ThemeTitle != $scope.groupta[z].title ){
					$scope.groupta[z].title = $scope.boarddata[0].Themes[x].ThemeTitle+" ("+$scope.groupta[z].title+")";
				}
				
				if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
					if($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id || $scope.showsetting){
						$scope.groupta[z].canDeleted="1";
						$scope.groupta[z].canAdded="0";
					}
					else{
						$scope.groupta[z].canDeleted="0";
						$scope.groupta[z].canAdded="0";
					}
				}
			}
		}
		
		for(z in $scope.groupta){
			if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
				$scope.groupta[z].canDeleted="0";
				$scope.groupta[z].canAdded="1";
			}                    
		}
		
		console.log("Final Group Tags",$scope.groupta);
		
	}
	
	/*
	
	$scope.update__PTObject = function(){
		//$scope.gts={};
		$scope.groupt=[];
		$scope.groupta=[];
		for(i in $scope.gts){
			$scope.groupta.push({"id":$scope.gts[i]._id,"title":$scope.gts[i].GroupTagTitle})
			$scope.groupt.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].GroupTagTitle})
		}
		//alert("m here----");
		for (x in $scope.boarddata[0].Themes) {
			if ($scope.boarddata[0].Themes[x].isApproved==0) {
				if ($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id || $scope.showsetting) {
					$scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"1","canAdded":"0"})   
				}
				else{
					$scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"0","canAdded":"0"}) 
				}
			}
		
		}
		for (x in $scope.boarddata[0].Themes) {
			for(z in $scope.groupta){                        
				if ($scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
					
					if($scope.boarddata[0].Themes[x].SuggestedBy==$scope.userInfo._id || $scope.showsetting){
						$scope.groupta[z].canDeleted="1";
						$scope.groupta[z].canAdded="0";
					}
					else{
						$scope.groupta[z].canDeleted="0";
						$scope.groupta[z].canAdded="0";
					}
				}
			}
		}
		
		for(z in $scope.groupta){
			if(typeof($scope.groupta[z].canDeleted)=='undefined' && typeof($scope.groupta[z].canAdded)=='undefined'){
				$scope.groupta[z].canDeleted="0";
				$scope.groupta[z].canAdded="1";
			}                    
		}
		
	}
	*/
	//added by manishp on 09012015 - real time object update 
	$scope.update__MembersObject = function(){
		$http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				//alert(1);
				//console.log(data.data.response);
			    $scope.boarddata[0].Invitees = data.data.response[0].Invitees;
				//$scope.boarddata=data.data.response;
				if ($scope.boarddata[0].Invitees!=null) {
					if ($scope.boarddata[0].Invitees.length>0) {
						//alert($scope.boarddata[0].Invitees.length+" members");
						$scope.boardMembers=true;
					}else{
						$scope.boardMembers=false;
					}
				}else{
					$scope.boardMembers=false;
				}
			}
		});
	};
	
	$scope.runVendorScripts = function(){
		
		mediaSite.tooltip();
		mediaSite.initMasonry();
		//mediaSite.filterbarFunc.init();
		mediaSite.slideTitleHeader();
		mediaSite.initModalPopup();
		mediaSite.mediaDropDownMenu();
		mediaSite.actionBarDropDown();
		mediaSite.recordButton();
		mediaSite.uploadButton();
		mediaSite.tagButton();
		mediaSite.initSmallHeader();
		mediaSite.headerTitleDropDown();
		mediaSite.headerQuestionDropDown();
		mediaSite.fixDiscussPage();
		mediaSite.showMediaContent();
		mediaSite.filterMenuSidebar.fixHeight();
		mediaSite.openFullHeader();
		mediaSite.headerThemeDropdown();
		//mediaSite.closeAllDropdowns.init();
		//mediaSite.accountFunctions.init();
		//mediaSite.filterMenuSidebar.init();
	};
	
	$scope.runVendorScripts2 = function(){
		
		//mediaSite.tooltip();
		//mediaSite.initMasonry();
		//mediaSite.filterbarFunc.init();
		mediaSite.slideTitleHeader();
		mediaSite.initModalPopup();
		//mediaSite.mediaDropDownMenu();
		//mediaSite.actionBarDropDown();
		//mediaSite.recordButton();
		//mediaSite.uploadButton();
		//mediaSite.tagButton();
		//mediaSite.initSmallHeader();
		mediaSite.headerTitleDropDown();
		//mediaSite.headerQuestionDropDown();
		//mediaSite.fixDiscussPage();
		//mediaSite.showMediaContent();
		//mediaSite.filterMenuSidebar.fixHeight();
		//mediaSite.openFullHeader();
		mediaSite.headerThemeDropdown();
		mediaSite.closeAllDropdowns.init();
		//mediaSite.accountFunctions.init();
		//mediaSite.filterMenuSidebar.init();
	};
	
	$scope.notes={};
    $scope.searcha=null;
    
	//Don't know why ?
	$scope.clear = function(){
        if($scope.searcha.length == 0){
            delete $scope.searcha;
        }
    }
	
	//Don't know why ? for testing
	
	$scope.openWindow = function(val){
	    alert(val);
	    window.open(val, '_blank');

	}
	
	$scope.fsgs=[];
    $http.get('/fsg/view').then(function (data, status, headers, config){
         //alert('-----here');
         if (data.data.code==200){
            $scope.fsgs=data.data.response;
			console.log("fsg");
			console.log($scope.fsgs);
			console.log($scope.userInfo);
			//added by parul
         }
         
    })
    
	$controller('filterCtrl',{$scope : $scope });
	
	$controller('mediaTrayCtrl',{$scope : $scope });
	//$controller('dragDropCtrl',{$scope : $scope });
	
	$scope.id=$stateParams.id;
    
    $scope.boarddataAll={};
    $scope.boarddata={};
    $scope.showsetting=0;
    
    
    $scope.userInfo={};
    
	$scope.media={};
    $scope.changemmt=function(id){
        $scope.media.mmt=id;
    }
    
    $scope.changemmtlink=function(id){
        $scope.link.mmt=id;
    }
    
    $http.get('/metaMetaTags/view').then(function (data, status, headers, config) {
        if (data.data.code==200){
			for (i in data.data.response){
				//if (data.data.response[i]._id == '54e7211a60e85291552b1187') {	// for ===== "5555" 
				if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 " 
					data.data.response.splice(i,1);
				}
			}
            $scope.mmt=data.data.response;
        }
        else{
            $scope.mmt={};
        }
    })    
    
    $scope.gts={};
    $scope.groupt=[];
    $scope.groupta=[];
	
	$scope.tagss = [];    
    $scope.tagta=[];
    
	$http.get('/groupTags/without_descriptors').then(function(data,status,headers,config){
        if (data.data.code==200){
			/*for (i in data.data.response){
				//if (data.data.response[i].MetaMetaTagID._id == '54e7211a60e85291552b1187') {	// for ===== "5555" 
				if (data.data.response[i].MetaMetaTagID._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 " 
					data.data.response.splice(i,1);
				}
			}*/
            $scope.gts=data.data.response;
            
            for(i in $scope.gts){
				if($scope.gts[i].status != 3){
					$scope.groupta.push({"id":$scope.gts[i]._id,"title":$scope.gts[i].GroupTagTitle})
					$scope.groupt.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].GroupTagTitle})
					for(j in $scope.gts[i].Tags){
						//$scope.tagta.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].Tags[j].TagTitle+' ('+$scope.gts[i].GroupTagTitle+')'}) //commented and modified by parul 09012015   
						//if ($scope.gts[i].Tags[j].status==1 && $scope.gts[i]._id != '54e7214560e85291552b1189') {
						if ($scope.gts[i].Tags[j].status==1) {
							$scope.tagta.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].Tags[j].TagTitle,"description":$scope.gts[i].GroupTagTitle})    
						}
					}
				}
            }
        }    
    })
	
	//get data for descriptor autoComplete BY Parul 19022015
	$scope.descriptors = {};

    var __update_descriptors_object = function(){
		$http.get('/media/descriptor').then(function(data, status, headers, config){
			if (data.data.code == 200){
				//alert(1)
				$scope.descriptors = data.data.response;
				$('#searchfld2').autocomplete({
					source:$scope.descriptors,
					select:function(event, ui){
						//alert(ui.item.label);
						$scope.descSearch = ui.item.label;
						$scope.search1.tata2 = ui.item.label;
						$('a.searchBar').parent().addClass('active');
						$('li.searchBar').removeClass('hidden');
						$scope.filterSub__descriptor($scope.descSearch);
						return false;
					},
					focus:function(event, ui){
						//alert(ui.item.label);
						$scope.descSearch = ui.item.label;
						$scope.search1.tata2 = ui.item.label;
						$('a.searchBar').parent().addClass('active');
						$('li.searchBar').removeClass('hidden');
						return false;
					}
				});
				setTimeout(function(){$scope.$apply();},10)
			}    
		})
	}
	__update_descriptors_object();
	//$scope.descriptors.selected = [];
	
	
	// end
	
    $scope.project={};
    $scope.projects={};
    $scope.projectsa=[];
    $scope.isFriendSolo=0;
    
    $scope.link={};
    $scope.uploadedLink={};
    
	//don't know why ? for testing 
    $scope.aclicked = function($event){
		console.log($event.target)
    }
    
	//15122014 scroll pageTheme movement code
	//$scope.PTitems = [];
	
	
	
	//15122014
	var finalBoardData=[];
	
	$scope.selectedgt='';
    /*
	$scope.changePT =function(){		
		
		//mediaSite.slideTitleHeader();
		
		$('.avatarlist').html("");
		$('.avarrow-left').hide()
		$('.avatarlist').css('margin-left','0px');
		$('.avarrow-right').hide()
        $timeout(function(){
            $('#slideTitleHeader li').each(function(){
                if ($(this).css('visibility')!='hidden') {
                    $scope.selectedgt=$(this).attr('id');
					$scope.selectedgtsa=$(this).find('span').html();
					if($('#search_elements').css('display')=='none'){
					
						$('.loader_overlay').show()
						$('.loader_img_overlay').show()
						$http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {
							if (data.data.code==200){
								$scope.boarddata=data.data.response;  
								console.log('board data = ',$scope.boarddata);								
								//var newdata=[];
								for(i in $scope.boarddata[0].Medias) {
									if($scope.selectedgt==$scope.boarddata[0].Medias[i].ThemeID){
										newdata.push($scope.boarddata[0].Medias[i])
									}
								}
								$scope.boarddata[0].Medias=[];
								$scope.boarddata[0].Medias=newdata;
								
								//added for animation point
								var dinesh = newdata.length/3;
								//var sectionDivider = Math.round(dinesh);
								var sectionDivider = Math.ceil(dinesh);
								var finalData = [];
								var count = 3;
								var k = 0;
								for(var i =1 ; i<= sectionDivider; i++){
									var inner = [];
									for(j = k; j<= newdata.length-1 ; j++ ){
										if(j == count){
										break;   
										}
										inner.push(newdata[j]);
									}
									k = i * 3;
									count = count+3;
									finalData.push({section: inner});
								}
								//console.log(finalData, "$scope");
								//$scope.sections =  finalData;
								generateSectionTemplateAndAppend(finalData);
								//added for animation point
								setTimeout(function(){
									$('.loader_overlay').hide()
									$('.loader_img_overlay').hide()
									jQuery('.text_wrap_index').each(function(){
										if($(this).children().first().prop('tagName')!='IFRAME'){
										//$(this).prev().hide();
										}
									})
									$( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
									//setTimeout(function(){
										runDiscussAnimation();
									//},100);
									
								},10)
							}
							else{
								$('.loader_overlay').hide()
								$('.loader_img_overlay').hide()
								$scope.boarddata={};                                  
							}
						})
					}
					else{
						$scope.filterSub();
					}
				}                    
			});
        },1050)
	
    }*/
    var keyIdx = 0;
	var selectedgtArr = [];
	var idx = -1;
	
	$scope.changePT =function(navigatorType){		
		//mediaSite.slideTitleHeader();
		// commented by parul 04022015
		//to retain media tray entries
		//$('.avatarlist').html("");
		//$('.avarrow-left').hide()
		//$('.avatarlist').css('margin-left','0px');
		//$('.avarrow-right').hide()
        $timeout(function(){
            $('#slideTitleHeader li').each(function(){
                if ($(this).css('visibility')!='hidden') {
                    $scope.selectedgt=$(this).attr('id');
					$scope.selectedgtsa=$(this).find('span').html();
					
					if( navigatorType == 'next' ){
						$scope.getNextPageTheme();
						$scope.isNextTheme = true;
					}
					else if( navigatorType == 'previous' ){
						$scope.getPrevPageTheme();
						$scope.isPrevTheme = true;
					}
					else{
						//nothing
					}
					
					if($('#search_elements').css('display')=='none'){
					
						$('.loader_overlay').show()
						$('.loader_img_overlay').show()
						$http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {
							if (data.data.code==200){
								$scope.boarddata=data.data.response;  
								console.log('board data = ',$scope.boarddata);								
								newdata=[];
								for(i in $scope.boarddata[0].Medias) {
									//if($scope.boarddata[0].Medias[i].PostStatement){
										//$scope.boarddata[0].Medias[i].PostStatement = $scope.boarddata[0].Medias[i].PostStatement?$scope.boarddata[0].Medias[i].PostStatement.replace(/<[^>]*>/g, ''):"No Statement";
										$scope.boarddata[0].Medias[i].PostStatement = $scope.boarddata[0].Medias[i].PostStatement?$('<div>').html($scope.boarddata[0].Medias[i].PostStatement).text():"No Statement";
									//}
										
									if($scope.selectedgt==$scope.boarddata[0].Medias[i].ThemeID){
										newdata.push($scope.boarddata[0].Medias[i])
									}
									
								}
								$scope.boarddata[0].Medias=[];
								$scope.boarddata[0].Medias=newdata;
								
								//added for animation point
								var dinesh = newdata.length/3;
								//var sectionDivider = Math.round(dinesh);
								var sectionDivider = Math.ceil(dinesh);
								var finalData = [];
								var count = 3;
								var k = 0;
								for(var i =1 ; i<= sectionDivider; i++){
									var inner = [];
									for(j = k; j<= newdata.length-1 ; j++ ){
										if(j == count){
										break;   
										}
										inner.push(newdata[j]);
									}
									k = i * 3;
									count = count+3;
									finalData.push({section: inner});
								}
								
								console.log('board final data = ',finalData);								
								
								var themeData = {};
								themeData = {gt:$scope.selectedgtsa , finalData:finalData};
								keyIdx = selectedgtArr.indexOf($scope.selectedgt);
								//isKeyIdxFound = false;
								idTofocusOn = '';
								if( keyIdx >= 0 ){
									idTofocusOn = "section--"+keyIdx;
									//alert("index Found = "+keyIdx);
									finalBoardData[keyIdx] = themeData;
									
								}
								else{
									idx++;
									keyIdx = idx;
									idTofocusOn = "section--"+keyIdx;
									//alert("No index found = "+keyIdx);
									selectedgtArr.push($scope.selectedgt);
									finalBoardData.push(themeData);
								}
								
								
								console.log('board final data in array = ',finalBoardData);
								//alert(2)
								//console.log($scope.myInvitees);
								//console.log(finalData, "$scope");
								//$( "#accordion" ).accordion();
								 $( "#tabs" ).tabs();
								$scope.sections =  finalData;
								//generateSectionTemplateAndAppend(finalBoardData , keyIdx);
								//added for animation point
								setTimeout(function(){
									//if( idTofocusOn != '' ){
										//alert("--"+idTofocusOn+" = "+$("#"+idTofocusOn).offset().top+" ---.main-container-top = "+$(".main-container").offset().top+" ---.main-container-paddingTop = "+$(".main-container").css('paddingTop'));
										//alert("idTofocusOn = "+idTofocusOn);
										/*
										var scrollTopVal = 0;
										
										scrollTopVal = parseInt($("#"+idTofocusOn).offset().top) - parseInt($(".main-container").css('paddingTop')) - 20 ;
										//alert("scrollTop = "+scrollTopVal);
										$('html , body , .main-container').animate({
											//scrollTop: $( $(this).attr('href') ).offset().top
											scrollTop: scrollTopVal
										}, 1);
										*/
										//alert("my position is = "+$('#section--0').position());
										//alert("my top value is = "+$('#section--0').css('top'));
										//$('#idTofocusOn').focus();
										//$('#idTofocusOn').attr('top');
									//}
									
									$('.loader_overlay').hide()
									$('.loader_img_overlay').hide()
									jQuery('.text_wrap_index').each(function(){
										if($(this).children().first().prop('tagName')!='IFRAME'){
										//$(this).prev().hide();
										}
									})
									$( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
									//setTimeout(function(){
										runDiscussAnimation();
									//},100);
									
									$scope.setName();
								},10)
								//- always at bottom...
								//by default discuss page 
								setTimeout(function(){
									//alert("called after 1 second");
									$scope.__openDiscussPage();
								},1000);
								
							}
							else{
								$('.loader_overlay').hide()
								$('.loader_img_overlay').hide()
								$scope.boarddata={};                                  
							}
						})
					}
					else{
						$scope.filterSub();
					}
				}                    
			});
        },1050)
	
    }
	
	
	$scope.changePT2 =function(){		
		$('.avatarlist').html("");
		$('.avarrow-left').hide()
		$('.avatarlist').css('margin-left','0px');
		$('.avarrow-right').hide()
        $timeout(function(){
            $('#slideTitleHeader li').each(function(){
                if ($(this).css('visibility')!='hidden') {
                    $scope.selectedgt=$(this).attr('id');
					$scope.selectedgtsa=$(this).find('span').html();
					if($('#search_elements').css('display')=='none'){
					
						$('.loader_overlay').show()
						$('.loader_img_overlay').show()
						$http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {
							if (data.data.code==200){
								$scope.boarddata=data.data.response;                              
								console.log('board data = ',$scope.boarddata);
								var newdata=[];
								for(i in $scope.boarddata[0].Medias) {
									if($scope.selectedgt==$scope.boarddata[0].Medias[i].ThemeID){
										newdata.push($scope.boarddata[0].Medias[i])
									}
								}
								$scope.boarddata[0].Medias=[];
								$scope.boarddata[0].Medias=newdata;
								
								//added for animation point
								var dinesh = newdata.length/3;
								//var sectionDivider = Math.round(dinesh);
								var sectionDivider = Math.ceil(dinesh);
								var finalData = [];
								var count = 3;
								var k = 0;
								for(var i =1 ; i<= sectionDivider; i++){
									var inner = [];
									for(j = k; j<= newdata.length-1 ; j++ ){
										if(j == count){
										break;   
										}
										inner.push(newdata[j]);
									}
									k = i * 3;
									count = count+3;
									finalData.push({section: inner});
								}
								//console.log(finalData, "$scope");
								//$scope.sections =  finalData;
								generateSectionTemplateAndAppend(finalData);
								//added for animation point
								setTimeout(function(){
									$('.loader_overlay').hide()
									$('.loader_img_overlay').hide()
									jQuery('.text_wrap_index').each(function(){
										if($(this).children().first().prop('tagName')!='IFRAME'){
										//$(this).prev().hide();
										}
									})
									$( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
									//setTimeout(function(){
										runDiscussAnimation();
									//},100);
									
								},10)
							}
							else{
								$('.loader_overlay').hide()
								$('.loader_img_overlay').hide()
								$scope.boarddata={};                                  
							}
						})
					}
					else{
						$scope.filterSub();
					}
				}                    
			});
        },1050)
	
    }
	
	var templateHTML = '';
	var generateSectionTemplateAndAppend = function(finalBoardData , keyIdx){
		//$scope.arraySections =  finalBoardData;
		//$scope.sections =  finalData;
		//alert("m called --- "+finalData);
		templateHTML = '';
		var ngElemTemplateHTML = '';
		templateHTML += '<div id="section--{{$index}}" data-ng-repeat= "sections in arraySections">'
			+'<p onClick="prevPageTheme();" data-ng-click="changePT()" href="javascript:void(0)"><a>Load Previous</a></p>'
			+'<div style="min-height:400px;">'
			+'<div>'
				+'<p>{{sections.gt}}</p>'
			+'</div>';
		
		templateHTML += '<section class="row-{{$index+1}} fluid-container" data-ng-repeat= "sectiondivider in sections.finalData">'
			+'<div class="row">'
				+'<div class="col-sm-6 toflip fixedheight cover_img" id="thumbs" data-ng-repeat="media in sectiondivider.section">'
				+'<a class="item" onclick="clicked($(this),event)" href="javascript:void(0)">'
				+'<div class="caption">'
					+'<img data-ng-src="{{media.PostedBy.ProfilePic}}" style="border-radius:30px;" alt="" height="30" width="30" class="avatar">'
					+'<h3 style="display:block !important" data-ng-show="boarddata[0].PrivacySetting[0].DisplayNames=='+'RealNames'+'">{{media.PostedBy.Name}}</h3>'
					+'<h3 style="display:block !important" data-ng-show="boarddata[0].PrivacySetting[0].DisplayNames=='+'NickNames'+'">{{media.PostedBy.NickName}}</h3>'
				+'</div>'
				+'<span class="text_wrap_index" data-ng-if=\'media.MediaType=="Link" || media.MediaType=="Notes"\' style="color:#fff"  data-ng-bind-html="media.Content | to_trusted" ></span>'
				+'<img class="media_img" data-ng-if=\'media.ContentType=="application/pdf"\' class=""  data-ng-src="../assets/img/PDF.png" alt="Sample PDF 1" />'
				+'<video class="media_video" data-ng-if=\'media.ContentType=="video/webm"\' controls >'
					+'<source src="" dynamic-url dynamic-url-src="../assets/Media/video/{{media.MediaURL}}">'
				+'</video>'
				+'<img class="media_img" data-ng-if=\'media.ContentType=="application/vnd.openxmlformats-officedocument.wordprocessingml.document" || media.ContentType=="application/msword"\' class=""  data-ng-src="../assets/img/Icon-Document.jpg" alt="Sample Word 1" />'
				+'<img class="media_img" data-ng-if=\'media.ContentType=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || media.ContentType=="application/vnd.ms-excel" || media.ContentType=="application/vnd.oasis.opendocument.spreadsheet"\' class=""  data-ng-src="../assets/img/excel.png" alt="Sample Excel 1" />'
				+'<img class="media_img" data-ng-if=\'media.ContentType=="application/vnd.openxmlformats-officedocument.presentationml.presentation" || media.ContentType=="application/vnd.ms-powerpoint"\' class=""  data-ng-src="../assets/img/ppt.png" alt="Sample PPT 1" />'
				+'<img class="media_img" data-ng-if=\'media.ContentType=="image/png" || media.ContentType=="image/jpeg" || media.ContentType=="image/gif" || media.ContentType==null\' class=""  data-ng-src="../assets/Media/img/{{media.MediaURL}}" alt="Sample Image 1" /> '
				+'<div class="overlay anim"></div>'
				+'</a>'
				+'<div class="format_file_right cross_format anim" style="top:0;cursor:pointer;" data-ng-show="showsetting" data-ng-click="deleteMedia(media)" title="Delete"></div>'
				+'<div style="margin-bottom:0px;cursor:pointer;" class="format_file tick_format anim" data-ng-click="mark(media)" data-ng-show="showsetting && media.PostedBy._id!=userInfo._id" title="Mark"></div>'
				+'<div style="margin-bottom:0px;cursor:pointer;" class="format_file_mid vote_format anim" data-ng-show="showsetting && media.PostedBy._id!=userInfo._id" data-ng-click="stamp(media)" title="Stamp"></div>'
				+'<div style="margin-bottom:0px;cursor:pointer;" class="format_file_right stamp_format anim" data-ng-show="media.PostedBy._id!=userInfo._id" data-ng-click="vote(media)" title="Vote"></div>'
				+'</div>'
			+'</div>'
		+'</section></div><p onClick="nextPageTheme();" data-ng-click="changePT()" href="javascript:void(0)"><a>Load Next</a></p>';
		ngElemTemplateHTML = angular.element(templateHTML);
		$('#section-cont').html(ngElemTemplateHTML);
		$compile(ngElemTemplateHTML)($scope);
		$scope.arraySections =  finalBoardData;
	}
	
	
	var ud=[];
    
    loginService.chkUserLogin($http,$location,$window).then(function(){
        $scope.userInfo = tempData;
        userdata=$scope.userInfo;
		console.log("$scope.userInfo");
        console.log($scope.userInfo);
        for(k in userdata.FSGs){
            ud.push(k+'~'+userdata.FSGs[k])
        }
		
		
		
    });
    
    
    /////Upload Media
    //don't know why ?
	$scope.uploadSuccess = function(){
        $('.upload').each(function(){
            if($(this).attr('data-dialog-id')==21) {
                $(this).trigger('click');    
            }
        })        
    } 
	
    $scope.uploadedMedia123='';
	//$scope.isPrivate = false;
	//$scope.isPublic = false;
	
	
	//$scope.link.isPrivate='';
	
    $scope.addTags=function(isValid){
	//alert("called");
	//alert('link'+$scope.link.isPrivate)
	//alert('media'+$scope.media.isPrivate);
	//$scope.media.gtsa 
	//if ($scope.uploadedMedia._id && $scope.media.gtsa && $scope.media.mmt) {
	//if ($scope.uploadedMedia._id && $scope.media.mmt ) {
	if ($scope.uploadedMedia._id && $scope.media.mmt && $scope.media.isPrivate) {
		$('#overlay2').show();
        $('#overlayContent2').show();
	    //alert("in if- ");
		//alert('in media $scope.uploadedMedia');//return;
	    $scope.media.gt=$scope.selectedgt;
	    $scope.media.gtsa=$scope.selectedgtsa;
	    
	    $scope.media.Action='Post';
            $scope.media.MediaID=$scope.uploadedMedia._id;
            $scope.media.data={};
            $scope.media.board=$stateParams.id;
            $scope.media.data=$scope.uploadedMedia;        
//          alert(1);
//			console.log($scope.media);
			if ($('#tag-Input-Token').val() != '') {
				$scope.media.Tags=$('#tag-Input-Token').val();
			}

            $http.post('/media/addTagsToUploadedMedia',$scope.media).then(function (data, status, headers, config) {
                $('.ui-dialog-titlebar-close').trigger('click');
				$scope.setFlashInstant('Media added successfully!' , 'success');
				$scope.uploadedMedia={}; //added on 17122014 by manishp
				$scope.changePT();
				setTimeout(function(){
					$('#overlay2').hide();
					$('#overlayContent2').hide();
					if (data.data.response[0] != undefined && data.data.response[0] != null) {
						$scope.addtoTray_uploadCase(data.data.response[0]);	
					}
				},1000)
			});
        }
		 //else if($scope.uploadedLink._id && $scope.link.mmt ){
        else if($scope.uploadedLink._id && $scope.link.mmt && $scope.link.isPrivate){
			$('#overlay2').show();
			$('#overlayContent2').show();
			console.log($scope.uploadedLink);
			$scope.link.gt=$scope.selectedgt;
			$scope.link.gtsa=$scope.selectedgtsa;
            $scope.link.Action='Post';
			if ($('#tag-Input-Token2').val()!='') {
				$scope.link.Tags=$('#tag-Input-Token2').val();
			}
			//added and commented by parul
            $scope.link.MediaID=$scope.uploadedLink._id;
            $scope.link.data={};
            $scope.link.board=$stateParams.id;
            $scope.link.data=$scope.uploadedLink;        
            console.log("----input data for addTagsToUploadedMedia = ",$scope.link);
            $http.post('/media/addTagsToUploadedMedia',$scope.link).then(function (data, status, headers, config) {
                $('.ui-dialog-titlebar-close').trigger('click');
                __update_descriptors_object();
                setTimeout(function(){
					$('#overlay2').hide();
					$('#overlayContent2').hide();
					if ($scope.uploadedLink.ContentType == "Montage") {
						$scope.setFlashInstant('Media posted into the Board' , 'success');
						$scope.close_holder_act_final()
					}else{
						if ( $scope.del_grid_noteCase == true ) {
							$scope.setMediaIdd_uploadCase(data.data.response[0]._id);
						}else if ($scope.uploadedLink.ContentType == "Notes") {
							$scope.addtoTray_uploadCase(data.data.response[0]);
							$scope.setFlashInstant('Media added successfully!' , 'success');
						}
						else if (data.data.response[0] != undefined && data.data.response[0] != null) {
							$scope.addtoTray_uploadCase(data.data.response[0]);
							$scope.setFlashInstant('Media added successfully!' , 'success');
							$scope.close_holder_act();	
						}	
					}
					//added on 20122014-manishp
					//$scope.redirectInSearchGallery();
					//added on 20122014-manishp
					$scope.uploadedLink={}; //added on 17122014 by manishp
					//$scope.changePT();
				},1000)
				//$window.location.reload();
            });
        }
		else{
			//alert("In else--");
			//alert("isPrivate = "+$scope.isPrivate);
			//alert("isPublic = "+$scope.isPublic);
		}
		$('#dialog1').css({'display':'block'});
	};
   
	
	
	//added on 20122014-manishp
	$scope.redirectInSearchGallery = function(){
		body = $("html, body");
		var bodyClass = $('body');
		var currentPageClass = bodyClass.data('page-class');
		body.animate('500');
		//$('#discuss_elements').show();
		$('.holder_bulb').html("");
		// Back sidebar
		$('.filterMenu-sidebar').show();
		bodyClass.addClass(currentPageClass);
		$('.holder-act').fadeOut(400)
		$('#discuss_elements').hide();
		//$('#discuss_elements thumbs').hide();
		
		// Remove page act
		bodyClass.removeClass('act-page');

		// Back full header only for home page
		if(bodyClass.hasClass('home-page')){
			bodyClass.removeClass('small-fixed-header');
		}
		$('.holder-act').hide();
		$('#thumbs, #search_elements').show();
		// show back all icons
		$('#filterbar').find('a').show();
		bodyClass.css({'padding-top':'244px'});//added by parul to set padding afert montage and note case
		
	}
	
    $controller('searchGalleryCtrl',{$scope : $scope });
	
	$controller('actCtrl',{$scope : $scope });
	
	$controller('montageCtrl',{$scope : $scope });
	
	$scope.fileReaderSupported = window.FileReader != null;
	$scope.uploadRightAway = false;
	$scope.changeAngularVersion = function() {
		window.location.hash = $scope.angularVersion;
		window.location.reload(true);
	};
	$scope.imagessize=0;
	$scope.hasUploader = function(index) {
		return $scope.upload[index] != null;
	};
	$scope.abort = function(index) {
		$scope.upload[index].abort(); 
		$scope.upload[index] = null;
	};	
	
	$scope.fileUpload=[];
	$scope.disablebtn=false;
	$scope.angularVersion = window.location.hash.length > 1 ? window.location.hash.substring(1) : '1.2.0';
	
	$scope.lengthofuploads=0;
	
	$scope.count=0;
	$scope.percentUpload=0;
	
	$scope.uploadedMedia={};
    
	$controller('uploadMediaCtrl',{$scope : $scope });
	
    //don't know why ? for testing
	$scope.uploadAll = function(){
		$scope.count=0;
		for(i=0;i<$scope.fileUpload.length;i++){
			$scope.start(i);
		}
	};
        
	$scope.media123={};
    
	$controller('designNsoundCtrl',{$scope : $scope });
	
    $controller('boardCtrl',{$scope : $scope });
	
	$controller('pageThemesCtrl',{$scope : $scope });
	
	/*Now the above commented code belongsTo commentCtrl*/
	//var commentCtrlViewModel = $scope.$new(); //You need to supply a scope while instantiating.
	//Provide the scope, you can also do $scope.$new(true) in order to create an isolated scope.
	//In this case it is the child scope of this scope.
	$controller('commentCtrl',{$scope : $scope });
	
	$controller('memberCtrl',{$scope : $scope });
	
	$controller('pageSettingCtrl',{$scope : $scope });
	
	
	$scope.showMore = function() {
        alert('show more triggered');  
    };
	
	// Added to hide delete_pop div on DOM ready - 21-11-2014 @Swapnesh
    $(document).ready(function() {
        $("#delete_pop").hide();
		
		/*
		$('body').on('dblclick', function(){
			//alert("m called as debounced -- delay = 500 ");
			console.log("----ondblClick----");
			
			//$scope.setExpandedScreenView();
			return true;
			$('#slideTitleHeader').cycle('destroy');
			$('#slideTitleHeader').cycle({
			    startingSlide: 2,
				speed:1000,
			    timeout:0,
			    slides: '>li',
			    fx: 'scrollHorz',
			    prev:'.navarrow-left',
			    next:'.navarrow-right',
			    pager: "#header-dropdown-pager",
			    pagerTemplate: ''
			});
		});
		*/
		/*
		angular.element('html , body , .main-container').on('scroll', function(){
			//alert("m called as debounced -- delay = 500 ");
			console.log("----onScroll----");
		});
		*/
	});

    // hide delete_pop on "No I am not sure" text click - 21-11-2014 @Swapnesh
    $scope.closeDel = function() {
       $("#delete_pop").hide(); 
    };
	
	
	
    
	$controller('discussCtrl',{$scope : $scope });
	
	$controller('recorderCtrl',{$scope : $scope });
	
	$controller('dragDropCtrl',{$scope : $scope });
	
	function runDiscussAnimation(){
		var fissa = 0;
		function toggleNavbar() {
			if ($(window).scrollTop() > (250)) {
				if (fissa == 0) {
					fissa = 1;
					$(".navbar").addClass("navbar-fixed-top").css({
						opacity: 0,
						top: -30
					}).animate({
						opacity: 1,
						top: 0
					}, 200, function() {});
					$(".navbar").addClass("navbar-fissa");
					$(".navbar").removeClass("navbar-statica");
					$(".navbar").addClass("navbar-inverse");
					$(".navbar").removeClass("navbar-default");
				}
			}
			if ($(window).scrollTop() < (250)) {
				if (fissa == 1) {
					fissa = 0;
					$(".navbar").animate({
						opacity: 0,
						top: -30
					}, 200, function() {
						$(".navbar").removeClass("navbar-fixed-top");
						$(".navbar").removeClass("navbar-fissa");
						$(".navbar").addClass("navbar-statica").animate({
							opacity: 1,
							top: 0
						}, 300);
					});
					$(".navbar").addClass("navbar-default");
					$(".navbar").removeClass("navbar-inverse");
				}
			}
		}

		function pareggio_h(a) {
			var b = 0;
			$(a).each(function(c, d) {
				if ($(this).height() > b) {
					b = $(this).height();
				}
			});
			$(a).height(b);
		}
		var lastId, topMenuHeight = 90,
			menuItems = $("#section_nav").find("a"),
			scrollItems = menuItems.map(function() {
				var a = $($(this).attr("href"));
				if (a.length) {
					return a;
				}
			});
		menuItems.click(function(c) {
			var a = $(this).attr("href"),
				b = a === "#" ? 0 : $(a).offset().top - topMenuHeight + 1;
			$("html, body").stop().animate({
				scrollTop: b
			}, 1000, "easeInOutExpo");
			c.preventDefault();
		});
		$(window).scroll(function() {
			if ($(window).width() >= 768) {
				toggleNavbar();
			}
			if ($(this).scrollTop() > 500 && $(this).width() > 1024 && $("#section_nav").length > 0) {

				$("#section_nav a").fadeIn();
				var a = $(this).scrollTop() + topMenuHeight;
				var b = scrollItems.map(function() {
					if ($(this).offset().top < a) {
						return this;
					}
				});
				b = b[b.length - 1];
				var c = b && b.length ? b[0].id : "";
				if (lastId !== c) {
					lastId = c;
					menuItems.parent().removeClass("active").end().filter("[href=#" + c + "]").parent().addClass("active");
				}
			} else {
				$("#section_nav a").fadeOut();
			}
		});
		$(window).resize(function() {
			if ($(window).width() >= 768) {
				$(".navbar-fissa .dropdown-toggle, .navbar-statica .dropdown-toggle").click(function(a) {
					a.preventDefault();
					return false;
				});
				$(".navbar").removeClass("navbar-mobile");
				$(".navbar").addClass("navbar-statica");
			} else {
				$(".navbar").addClass("navbar-fixed-top");
				$(".navbar").addClass("navbar-mobile");
				$(".navbar").removeClass("navbar-statica");
				$(".navbar").removeClass("navbar-fissa");
				$(".navbar").addClass("navbar-inverse");
				$(".navbar").removeClass("navbar-default");
			}
			if ($("#section_nav").length > 0) {
				$("#section_nav").css({
					"margin-top": -($("#section_nav").height() / 2 + 8)
				});
			}
			$(window).trigger("scroll");
		});
		$(window).trigger("resize");

		function attiva_mappa_produttori() {
			new Maplace({
				locations: suppliers,
				map_options: {
					set_center: [41.892916, 12.48252],
					mapTypeControl: false,
					streetViewControl: true,
					panControlOptions: {
						position: google.maps.ControlPosition.RIGHT_BOTTOM,
					},
					zoomControlOptions: {
						position: google.maps.ControlPosition.RIGHT_BOTTOM,
						style: google.maps.ZoomControlStyle.DEFAULT
					},
					scrollwheel: false,
					zoom: 5
				},
				generate_controls: false,
				styles: {
					"Monte Ré": [{
						featureType: "administrative",
						stylers: [{
							visibility: "off"
						}]
					}, {
						featureType: "transit",
						stylers: [{
							visibility: "off"
						}]
					}, {
						featureType: "poi",
						stylers: [{
							visibility: "off"
						}]
					}, {
						featureType: "road",
						stylers: [{
							visibility: "off"
						}]
					}, {
						featureType: "water",
						stylers: [{}, {
							lightness: 0
						}]
					}, {
						stylers: [{
							saturation: -100
						}, {
							hue: "#735768"
						}]
					}]
				}
			}).Load();
		}
		$(document).ready(function() {
			$(".filtri a").click(function() {
				$(".filtri a.current").removeClass("current");
				$(this).addClass("current");
				var f = $(this).data("filtro").substr(7);
				if (f == "tutti") {
					$(".grid-item").animate({
						opacity: 1
					}, 300);
				} else {
					$(".grid-item").each(function() {
						if (!$(this).hasClass(f)) {
							$(this).animate({
								opacity: 0.1
							}, 300);
						} else {
							$(this).animate({
								opacity: 1
							}, 300);
						}
					});
				}
				return false;
			});
			if ($("#section_nav").length > 0) {
				$("#section_nav a").tooltip();
			}
			$("#faq-group .collapse").each(function(f, h) {
				var h = $(h);
				var g = h.parent().find("h3");
				h.on("show.bs.collapse", function() {
					$("html, body").animate({
						scrollTop: g.offset().top - 90 - 40
					}, 1000, "easeInOutExpo", function() {});
					g.addClass("aperto");
				});
				h.on("hidden.bs.collapse", function() {
					g.removeClass("aperto");
				});
			});
			$(".dot-irecommendthis").click(function(g) {
				var f = $(this);
				if (f.hasClass("active")) {
					return false;
				}
				var i = $(this).attr("id");
				var h = f.find(".dot-irecommendthis-suffix").text();
				$.post("/wp-admin/admin-ajax.php", {
					action: "dot-irecommendthis",
					recommend_id: i,
					suffix: h
				}, function(j) {
					f.html(j).addClass("active").attr("title", "");
				});
				g.preventDefault();
			});
			if ($("#gmap").length > 0) {
				attiva_mappa_produttori();
			}
			$("textarea").autosize();
			$("textarea").focus(function(f) {
				if ($(this).val() == "MESSAGGIO" || $(this).val() == "MESSAGE") {
					$(this).val("").css("color", "#555");
				}
			});
			$("textarea").blur(function(f) {
				if ($(this).val() == "") {
					$(this).val("MESSAGGIO").css("color", "#999");
				}
			});
			if ($(window).width() > 1200) {
				$(".parallax").each(function(f, h) {
					var g = $(h);
					g.scrollAnimate({
						startScroll: g.offset().top - $(window).height(),
						endScroll: g.offset().top + g.height(),
						cssProperty: "background-position-y",
						before: 0,
						after: -100
					});
				});
				$(".img-block").each(function(f, h) {
					var g = $(h);
					g.scrollAnimate({
						startScroll: g.offset().top - $(window).height(),
						endScroll: g.offset().top + g.height(),
						cssProperty: "background-position-y",
						before: 300,
						after: -300
					});
				});
			}
			$(".scroll-top").click(function(f) {
				$("body, html").animate({
					scrollTop: 0
				}, 1000, "easeInOutExpo");
				f.preventDefault();
			});
			$.fn.waypoint.defaults = {
				context: window,
				continuous: true,
				enabled: true,
				horizontal: false,
				offset: 0,
				triggerOnce: false
			};
			if ($(window).width() > 1024) {
				$.fn.waypoint.defaults = {
					context: window,
					continuous: true,
					enabled: true,
					horizontal: false,
					offset: "80%",
					triggerOnce: false
				};
				$(".totop-wrapper").waypoint(function(f) {
					if (f == "down") {
						$("#section_nav").fadeOut();
					} else {
						$("#section_nav").fadeIn();
					}
				});
				$(".tofade,.toflip,.tofadel,.tofader").css("opacity", 1);
				$(".tofade").waypoint(function(f) {
					if (f == "down") {
						$(this).removeClass("animated fadeOutDown").addClass("animated fadeInUp");
					} else {
						$(this).removeClass("animated fadeInUp").addClass("animated fadeOutDown");
					}
				});
				$(".toflip").waypoint(function(f) {
					//alert("hjgfhjgfjh");
					if (f == "down") {
						$(this).removeClass("animated fadeOutDown").addClass("animated flipInY");
					} else {
						$(this).removeClass("animated flipInY").addClass("animated fadeOutDown");
					}
				});
				$(".tofadel").waypoint(function(f) {
					if (f == "down") {
						$(this).removeClass("animated fadeOutLeft").addClass("animated fadeInLeft");
					} else {
						$(this).removeClass("animated fadeInLeft").addClass("animated fadeOutLeft");
					}
				});
				$(".tofader").waypoint(function(f) {
					if (f == "down") {
						$(this).removeClass("animated fadeOutRight").addClass("animated fadeInRight");
					} else {
						$(this).removeClass("animated fadeInRight").addClass("animated fadeOutRight");
					}
				});
			}

			function c() {
				var h = false;
				var k = $("#contact-form");
				var g = $("#contact-form #nome");
				var l = $("#contact-form #cognome");
				var f = $("#contact-form #telefono");
				var i = $("#contact-form #email");
				var j = $("#contact-form #messaggio");
				if (g.val() == "") {
					g.addClass("required animated shake");
					h = true;
				} else {
					g.removeClass("required animated shake");
				}
				if (l.val() == "") {
					l.addClass("required animated shake");
					h = true;
				} else {
					l.removeClass("required animated shake");
				}
				if (f.val() == "") {
					f.addClass("required animated shake");
					h = true;
				} else {
					f.removeClass("required animated shake");
				}
				if (i.val().indexOf("@") == -1 || i.val().indexOf(".") == -1) {
					i.addClass("required animated shake");
					h = true;
				} else {
					i.removeClass("required animated shake");
				}
				if (j.val() == "MESSAGGIO" || j.val() == "MESSAGE") {
					j.addClass("required animated shake");
					h = true;
				} else {
					j.removeClass("required animated shake");
				}
				if (h == true) {
					return false;
				}
				$(this).find(".btn").attr("disabled", "disabled");
				$.ajax({
					type: "post",
					url: "/form-contatti.php",
					data: k.serialize(),
					success: function(m) {
						k.css("overflow", "hidden").animate({
							height: 0
						}, 1000, "easeInOutExpo", function() {
							k.html('<h5 class="text-center">' + m + "</h5>");
							k.animate({
								height: 200
							}, 1000, "easeInOutExpo");
						});
					}
				});
			}
			$("#contact-form").submit(function(f) {
				c();
				f.preventDefault();
			});

			function d() {
				var g = false;
				var k = $("#newsletter-form");
				var i = $("#newsletter-form #email");
				var j = $("#newsletter-form .input-wrapper");
				var f = $("#newsletter-form #result");

				function h() {
					myVar = setTimeout(function() {
						$("#newsletter-form #result").animate({
							height: 0
						}, 500, "easeOutExpo", function() {
							$("#newsletter-form #result").html("");
							$("#newsletter-form #email").val("").trigger("blur");
						});
					}, 4000);
				}
				if (i.val().indexOf("@") == -1 || i.val().indexOf(".") == -1) {
					i.addClass("required animated shake");
					g = true;
				} else {
					i.removeClass("required animated shake");
				}
				if (g == true) {
					return false;
				}
				j.animate({
					height: 0
				}, 1000, "easeInOutExpo", function() {
					$.ajax({
						type: "post",
						url: "/form-newsletter.php",
						data: k.serialize(),
						success: function(l) {
							if (l.indexOf("GOT") != -1 || l.indexOf("FATTO") != -1) {
								i.css("display", "none");
								f.html(l);
								j.animate({
									height: 70
								}, 1000, "easeInOutExpo", function() {});
							}
							if (l.indexOf("Invalid") != -1) {
								i.css("display", "none");
								if ($("#newsletter-form #lingua").val() == "it") {
									l = l.replace("Invalid Email Address:", "Indirizzo email non valido.");
								}
								f.html(l);
								j.animate({
									height: 70
								}, 1000, "easeInOutExpo", function() {
									j.delay(1000).animate({
										height: 0
									}, 1000, "easeInOutExpo", function() {
										f.html("");
										i.css("display", "block").val("");
										j.animate({
											height: 70
										}, 1000, "easeInOutExpo", function() {});
									});
								});
							}
							if (l.indexOf("already") != -1) {
								i.css("display", "none");
								if ($("#newsletter-form #lingua").val() == "it") {
									l = l.replace("is already subscribed to list Monte Ré Newsletter.", "è già iscritto alla newsletter.<br>");
									l = l.replace("Click here to update your profile", "Aggiorna qui il tuo profilo");
								}
								f.html(l);
								f.find("a").attr("target", "_blank");
								j.animate({
									height: 70
								}, 1000, "easeInOutExpo", function() {});
							}
						}
					});
				});
			}
			$("#newsletter-form").submit(function(f) {
				d();
				f.preventDefault();
			});

			function e() {
				var i = $("#tracking-form-in-page");
				var f = $(".track-result");
				var g = $(".track-result > .inner");
				var h = $(".main-content");
				$("body, html").animate({
					scrollTop: h.offset().top - 90
				}, 1000, "easeInOutExpo", function() {});
				f.animate({
					height: 0
				}, 1000, "easeInOutExpo", function() {
					$(".track-result > .loader-temp").height(50);
					g.html("");
					i.find("#a").val("");
					i.find("#b").val("");
					i.find("#c").val("");
					i.find("#d").val("");
					i.find(".btn").removeAttr("disabled");
					if ($(".facebook").length > 0) {
						window.fbAsyncInit = function() {
							FB.init();
							FB.Canvas.setAutoGrow();
						};
					}
				});
			}

			function b() {
				var m = $("#tracking-form-in-page");
				var l = $("#tracking-form-in-page #a");
				var k = $("#tracking-form-in-page #b");
				var j = $("#tracking-form-in-page #c");
				var i = $("#tracking-form-in-page #d");
				if (l.val() != "" && i.val() != "" && j.val() != "" && i.val() != "") {
					var g = $(".track-result > .loader-temp");
					var h = $(".track-result > .inner");
					var f = $(".track-result");
					m.find(".btn").attr("disabled", "disabled");
					f.animate({
						height: 50
					}, 500, "easeInOutExpo", function() {
						$.ajax({
							type: "POST",
							url: "/form-tracking.php",
							data: m.serialize(),
							success: function(n) {
								h.html(n);
								g.animate({
									height: 0
								}, 500, "easeInOutExpo", function() {});
								h.find(".img-responsive").load(function() {
									$("body, html").animate({
										scrollTop: h.offset().top - 150
									}, 1000, "easeInOutExpo", function() {});
									f.animate({
										height: h.height() + 200
									}, 1000, "easeInOutExpo", function() {
										if ($(".facebook").length > 0) {
											window.fbAsyncInit = function() {
												FB.init();
												FB.Canvas.setAutoGrow();
											};
										}
										$(".reset-button").click(function(o) {
											e();
											return false;
											o.preventDefault();
										});
									});
								});
							}
						});
					});
				}
			}
			$("#tracking-form-in-page").submit(function(f) {
				b();
				f.preventDefault();
			});
			$("#tracking-form").submit(function(f) {
				$("#tracking-form .btn").val("").addClass("loader-temp-mini");
			});
			if ($("#tracking-form-in-page").find("#a").val() != "" && $("#tracking-form-in-page").find("#b").val() != "" && $("#tracking-form-in-page").find("#c").val() != "" && $("#tracking-form-in-page").find("#d").val() != "") {
				if ($(".track-result > .inner").length > 0) {
					var a = $(".track-result > .inner");
					$("body, html").animate({
						scrollTop: a.offset().top - 200
					}, 1500, "easeInOutExpo", function() {
						$("#tracking-form-in-page").trigger("submit");
					});
				}
			}
			$(window).trigger("resize");
		});
	}
	
});
