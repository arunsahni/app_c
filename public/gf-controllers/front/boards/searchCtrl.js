var collabmedia = angular.module('collabmedia');

collabmedia.compileProvider.directive('autoCompleteProject', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select:function (event, ui) {
                    //console.log(ui.item.label)
                    scope.project.project = ui.item.label;
                    scope.project.projectid = ui.item.value;
                    scope.$apply();
                    return false;
                },
						focus:function (event, ui) {
                    scope.project.project = ui.item.label;
                    scope.project.projectid = ui.item.value;
                    scope.$apply();
                    return false;
                },
            });
    };
});

// Use for right click in angularJS
collabmedia.compileProvider.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

collabmedia.compileProvider.directive("scrollable", [function () {
    return function(scope, elm) {        
        elm.mCustomScrollbar({
            autoHideScrollbar: false,
            advanced:{
                updateOnContentResize: true
            }
        });
        //scrollToFunc1();
    };
}]);


collabmedia.compileProvider.directive("htmleditorRedactor", function() {
  return {
    require: '?ngModel',
    link: function($scope, elem, attrs, controller) {   

      controller.$render = function() {

        elem.redactor({
          keyupCallback: function() {
            $scope.$apply(controller.$setViewValue(elem.getCode()));
          },
          execCommandCallback: function() {
            $scope.$apply(controller.$setViewValue(elem.getCode()));
          }
        });

        //elem.setCode(controller.$viewValue);
      };
    }
  };
});

collabmedia.compileProvider.directive('autoCompleteInvitees', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
        iElement.autocomplete({
            source: scope[iAttrs.uiItems],
            select:function (event, ui) {
                scope.member.name = ui.item.label;
                scope.member.email = ui.item.email;
                scope.member.relation = ui.item.relation;
				scope.$apply();
                return false;
            },
            focus:function (event, ui) {
                scope.member.name = ui.item.label;
                scope.$apply();
                return false;
            },
			click:function (event, ui) {
                scope.member.name = ui.item.label;
                scope.member.email = ui.item.email;
                scope.member.relation = ui.item.relation;
				scope.$apply();
                return false;
            }
        });
    };
});

collabmedia.compileProvider.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select:function (event, ui) {
                    //console.log("asdasdasd")
                    //console.log(ui.item.label)
                    scope.media.gtsa = ui.item.label;
                    scope.media.gt = ui.item.value;
                    scope.$apply();
                    return false;
                },
                focus:function (event, ui) {
                    scope.media.gtsa = ui.item.label;
                    scope.media.gt = ui.item.value;
                    scope.$apply();
                    return false;
                },
            });
    };
});


collabmedia.compileProvider.directive('autoCompleteLink', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select:function (event, ui) {
                    //console.log(ui.item.label)
                    scope.link.gtsa = ui.item.label;
                    scope.link.gt = ui.item.value;
                    scope.$apply();
                    return false;
                },
                focus:function (event, ui) {
                    scope.link.gtsa = ui.item.label;
                    scope.link.gt = ui.item.value;
                    scope.$apply();
                    return false;
                },
            });
    };
});

collabmedia.filterProvider.register('to_trusted', ['$sce', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);

collabmedia.controllerProvider.register('searchCtrl',function($scope,$compile,$http,$location,$window,$upload,$stateParams,loginService,$timeout){
  
    // for right click - Swapnesh on 13-11-2014
    $scope.openInNextTab = function(value){
        window.open('../assets/Media/img/'+value,'_blank'); 
    };
	
    
	$scope.contentmediaType=null;
	$scope.changeMediaType = function(type){
		if(type=='All'){
			$scope.contentmediaType=null;
		}
		else{
			$scope.contentmediaType=type;
		}
		$scope.filterSub();
	}
	
	$scope.myInvitees=[];
    $scope.myInvitee=[];
    $http.get('/myInvitees').then(function (data, status, headers, config) {
        if (data.data.code==200){
            
            for(i in data.data.response){
                var akk={};
                akk.label=data.data.response[i].UserName;
                akk.value=data.data.response[i]._id;
                akk.email=data.data.response[i].UserEmail;
                akk.relation=data.data.response[i].Relation;
                $scope.myInvitee.push(akk)
            }
            $scope.myInvitees=data.data.response;
            //console.log($scope.myInvitees)
        }
        else{
            $scope.myInvitees=[];
        }
    })
	
    /////Upload Media
    $scope.countOfTrayMedia=0;
    $scope.addToMediaTray = function(media){
	//console.log(media)
	$scope.countOfTrayMedia++;
	var test='';								
										
	if(media.value.MediaType=='Link' || media.value.MediaType=='Notes'){	   	   
	    media.value.Content
	    $test = $('<li><div title="Delete" style="top:0" class="close_icon" ng-click="setMediaId('+media+')" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><span  class="avatar-name">'+media.value.Content+'</span></a></li>').appendTo('.avatarlist');
	    $compile($test)($scope);
	}
	else if(media.value.ContentType=='application/pdf'){
	    $test = $('<li><div title="Delete" style="top:0" class="close_icon" data-ng-click="setMediaId()" onclick="deleteMedia($(this))"></div> <a href="javascript:void(0)" data-ng-click="setMediaId('+media+')" onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/PDF.png"><span  class="avatar-name"></span></a></li>').appendTo('.avatarlist');
	    $compile($test)($scope);
	}
	else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || media.value.ContentType=='application/msword'){
	    $test = $('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click="setMediaId('+media+')" onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/Icon-Document.jpg"><span  class="avatar-name"></span></a></li>').appendTo('.avatarlist');
	    $compile($test)($scope);
	}
	else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || media.value.ContentType=='application/vnd.ms-excel' || media.value.ContentType=='application/vnd.oasis.opendocument.spreadsheet'){
	   $test = $('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click="setMediaId('+media+')" onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/excel.png"><span  class="avatar-name"></span></a></li>').appendTo('.avatarlist');
	    $compile($test)($scope);
	}
	else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.presentationml.presentation' || media.value.ContentType=='application/vnd.ms-powerpoint'){
	    $test = $('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click="setMediaId('+media+')" onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/ppt.png"><span  class="avatar-name"></span></a></li>').appendTo('.avatarlist');
	    $compile($test)($scope);
	}
	else if(media.value.ContentType=='image/png' || media.value.ContentType=='image/jpeg' || media.value.ContentType=='image/gif' || media.value.ContentType==null){
	    $test = $('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click="setMediaId('+media+')" onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/Media/img/'+media.value.URL+'"><span  class="avatar-name"></span></a></li>').appendTo('.avatarlist');
	    $compile($test)($scope);
	}
	 if($('.avatarlist').children().length>5){
		$('.avarrow-left').show()
		$('.avarrow-right').show()	 
	 }
    }
    
    $scope.media={};
    $scope.changemmt=function(id){
        $scope.media.mmt=id;
    }
    
    $scope.arrayOfMedias=[];
    
    $scope.addTags=function(isValid){
        
        if ($scope.uploadedMedia._id && $scope.media.gtsa && $scope.media.mmt) {
            $scope.media.Action='Post';
            $scope.media.MediaID=$scope.uploadedMedia._id;
            $scope.media.data={};
            $scope.media.board=$stateParams.id;
            $scope.media.data=$scope.uploadedMedia;        
            
            $http.post('/media/addTagsToUploadedMedia',$scope.media).then(function (data, status, headers, config) {
                $('.ui-dialog-titlebar-close').trigger('click');
                $window.location='/board/#/discuss/'+$stateParams.id;           
            });
        }
        else if($scope.uploadedLink._id && $scope.link.gtsa && $scope.link.mmt){
            $scope.link.Action='Post';
            $scope.link.MediaID=$scope.uploadedLink._id;
            $scope.link.data={};
            $scope.link.board=$stateParams.id;
            $scope.link.data=$scope.uploadedLink;        
            
            $http.post('/media/addTagsToUploadedMedia',$scope.link).then(function (data, status, headers, config) {
                $('.ui-dialog-titlebar-close').trigger('click');
                //console.log(data)
                $window.location='/board/#/discuss/'+$stateParams.id;            
            });
        }
    
    };
    
    $scope.changemmtlink=function(id){
        $scope.link.mmt=id;
    }
    
    $scope.link={};
    $scope.uploadedLink={};
    $scope.uploadLink=function(){
    var url = $scope.link.content;
    if( url.match(/youtube.com/gi) != null ) {
      // Code for Youttube
      var op = url.split(/[=]+/).pop();
      //alert("Youtube video id: " + op);
      var youtubeIframe = '<iframe width="560" height="315" src="//www.youtube.com/embed/'+op+'" frameborder="0" allowfullscreen></iframe>';
      $scope.link.content = youtubeIframe;
    }
    else if( url.match(/vimeo.com/gi) != null ) {
      // code for Vimeo
      var op = url.split(/[/]+/).pop();
      //alert("Vimeo video id: " + op);
      varvimeoIframe = '<iframe src="//player.vimeo.com/video/'+ op +'?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=ff0179" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
      $scope.link.content = varvimeoIframe;
    }
    else {
      // Code for another nuts
      alert("Please check url.");
    }
        
        
        if ($scope.link.content!="") {
            var fields={};
            
            fields.content=$scope.link.content
            
            $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                if(data.data.code==200){
					$scope.setFlash('Link added successfully.' , 'success');
                    $scope.uploadedLink=data.data.response;
                    $('.link_upload_themes').trigger('click');
                    $('.link_holder').html($scope.link.content);            
                    $('.link_holder').children().css('width',$('.link_holder').width()+'px');
                }
            });
            
            
            //$('.link_holder').first().height='100%';
        }
        return false;
        
    }
    
    
    $scope.boardMedia=null;
    
    $scope.showMyBoardMedia = function(board){
        $scope.boardMedia=board;        
    }
    
    $scope.showMyBoard = function(){
        $scope.boardMedia=null;
        $scope.selectedMediaFromBoards=[];
    }
    
    $scope.selectedMediaFromBoards=[];
    
    $scope.selectBoardMedia = function(board){
        if ($('#'+board._id).attr('class')=='ng-scope backgroundaaa') {
            $('#'+board._id).removeClass('backgroundaaa');
        }
        else{
            $('#'+board._id).addClass('backgroundaaa');
        }
        $scope.selectedMediaFromBoards=[];
        $('.backgroundaaa').each(function(){
            $scope.selectedMediaFromBoards.push($(this).attr('id'))
        })
        
    }
    
    $scope.AddBoardsMediasToBoard= function(){        
        $http.post('/addBoardMediaToBoard',{board:$scope.boardMedia._id,media:$scope.selectedMediaFromBoards,id:$stateParams.id,gt:$scope.selectedgt}).then(function (data, status, headers, config) {
			if (data.data.code==200) {
				$window.location='/board/#/discuss/'+$stateParams.id;
			}
			else{
				$scope.myboardsMedia=[];    
			}
		});
    }
    
    $scope.myboardsMedia=[];
    $http.post('/myBoards',{boards:$stateParams.id}).then(function (data, status, headers, config) {
        if (data.data.code==200 && data.data.response.length) {
            $scope.myboardsMedia=data.data.response;
        }
        else{
            $scope.myboardsMedia=[];    
        }
    });
    
    /////Upload Media
    
    $scope.id=$stateParams.id;
    
    $http.get('/metaMetaTags/view').then(function (data, status, headers, config) {
        if (data.data.code==200){
            $scope.mmt=data.data.response;
        }
        else{
            $scope.mmt={};
        }
    })    
    
    $scope.gts={};
    $scope.groupt=[];
    $scope.groupta=[];
    $http.get('/groupTags/view').then(function(data,status,headers,config){
        if (data.data.code==200){
            $scope.gts=data.data.response;
            
            for(i in $scope.gts){
                $scope.groupta.push({"id":$scope.gts[i]._id,"title":$scope.gts[i].GroupTagTitle})
                $scope.groupt.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].GroupTagTitle})
            }
            
        }    
    })
    
    $scope.duplicate = function(){
        var fields={};
        fields.id=$stateParams.id;
        fields.title=$scope.duplicate.title;
        //console.log(fields);
        $http.post('/boards/duplicate',fields).then(function (data, status, headers, config) {
            if (data.data.code==200){  
				$scope.setFlash('Board duplicated successfully.' , 'success');
                $window.location='/#/boards/'+data.data.message;
            }
            else{
              $scope.medias={};
            }
        })     
    }
    
    
    
    $scope.addcomment = function(){
        var fields={};
        fields.id=$stateParams.id;
        fields.comment=$scope.comment.title;
        $http.post('/boards/addComment',fields).then(function (data, status, headers, config) {
            if (data.data.code==200){   
				$scope.setFlash('Comment added successfully.' , 'success');
                $window.location.reload();
            }
        })     
    }
    
    $scope.deleteMember = function(invitee_id){
        
        if (confirm('Are you sure you want to delete this User from Board?')) {      
            var fields={};
            
            fields.id=$stateParams.id;
            fields.user=invitee_id;
            
            $http.post('/boards/deleteInvitee',fields).then(function (data, status, headers, config) {
                if (data.data.code==200){
					$scope.setFlash('Member deleted successfully.' , 'success');
                    $window.location.reload();
                }
            })
        }   
           
    }
    
    $scope.closeBoardMedia = function(){
        $scope.boardMedia=null
        $scope.boardsMedia=null
    }
    
    /*$scope.addMembers = function(){
        if($scope.member.emails!=""){
            $scope.member.id=$stateParams.id;
            $http.post('/boards/addMembers',$scope.member).then(function (data, status, headers, config) {
                if(data.data.code==200){
					$scope.setFlash('Member added successfully.' , 'success');
                    $('.ui-dialog-titlebar-close').trigger('click')
                }
            });
        }
    }*/
	
	 $scope.addMembers = function(){
        if($scope.member.emails!=""){
            $scope.member.id=$stateParams.id;
            //console.log($scope.member);
            //return;
            $http.post('/boards/addMembers',$scope.member).then(function (data, status, headers, config) {
                if(data.data.code==200){
					$scope.setFlash('Member added successfully.' , 'success');
                    $('.ui-dialog-titlebar-close').trigger('click')
					$window.location.reload();
                }
            });
        }
    }
   
	
    
    
    $scope.moveBoard = function(){
        if ($scope.project.projectid) {
            var fields={};
            fields.board=$stateParams.id;
            fields.project=$scope.project.projectid;
            fields.projectTitle=$scope.project.project;
            $http.post('/boards/move',fields).then(function (data, status, headers, config) {
                if(data.data.code==200){
					$scope.setFlash('Board moved successfully.' , 'success');
                    $window.location='/#/projects';                   
                }
                
            });
        }        
    }
    
    
    $scope.medias=[];
    $scope.userInfo=[];
    
    $scope.project={};
    $scope.projects={};
    $scope.projectsa=[];
    
    $http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {        
        if (data.data.code==200){ 
			$('.loader_overlay').show()
			$('.loader_img_overlay').show()
			$scope.boarddata=data.data.response;
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
                
                $http.get('/projects').then(function (data, status, headers, config) {
                    if (data.data.code==200){
                        $scope.projects=data.data.response;
                        for(i in $scope.projects){
                            $scope.projectsa.push({"label":$scope.projects[i].ProjectTitle,"value":$scope.projects[i]._id});
                        }
                    }	
                })
                
                $scope.gt=data.data.response[0].Themes;
                for (x in $scope.boarddata[0].Themes) {                    
                    if ($scope.boarddata[0].Themes[x].isApproved==0) {
                        $scope.groupta.push({"id":$scope.boarddata[0].Themes[x].ThemeID,"title":$scope.boarddata[0].Themes[x].ThemeTitle,"canDeleted":"1","canAdded":"0"})
                    }
                }
                
                for (x in $scope.boarddata[0].Themes) {
                    for(z in $scope.groupta){                        
                        if ($scope.boarddata[0].Themes[x].ThemeTitle == $scope.groupta[z].title && $scope.boarddata[0].Themes[x].ThemeID == $scope.groupta[z].id && $scope.boarddata[0].Themes[x].isApproved!=0) {
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
                //$scope.$apply();
        }
        else{
            $scope.boarddata=[];
        }
            $timeout(function(){
                if ($scope.userInfo._id == $scope.boarddata[0].OwnerID._id) {
                    $scope.showsetting=1;                    
                }
                $timeout(function(){
                    
                $('#slideTitleHeader li').each(function(){
                    if ($(this).css('visibility')!='hidden') {
                        $scope.selectedgt=$(this).attr('id');
                    }
                });
                
                $http.post('/media/searchEngine',{title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType}).then(function (data1, status, headers, config) {   
                if (data1.data.status=="success"){
                    $scope.medias=data1.data.results;
                    for(i in $scope.medias){
                        $scope.arrayOfMedias.push($scope.medias[i]._id);
                    }
                    
                    setTimeout(function(){
					$('.loader_overlay').hide()
					$('.loader_img_overlay').hide()
                        jQuery('.text_wrap').each(function(){
                            if($(this).children().first().prop('tagName')!='IFRAME'){
                                    $(this).prev().hide();
                            }
                        })
                        //$(document).ready(function(){
                        $( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
                        //});
						mainHeight=$(window).height();
						headerHeight=$('.head-top').height();
						$('#content_scroll').height(mainHeight-headerHeight);
						$('.innerimg-wrap').each(function(){
									  height=$(this).parent().height();
									  imgheight=$(this).children().first('img').height();
									  imgwidth=$(this).children().first('img').width();
									  if(height>imgheight){
										$(this).children().first('img').height(height)
									  }
									  else if(height>imgwidth){
										$(this).children().first('img').width(height)
									  }
									  else{
										if(imgheight<imgwidth){
										    $(this).children().first('img').height(height)
										}
										else if(imgwidth<imgheight){
											$(this).children().first('img').width(height)
										}
										else{
											$(this).children().first('img').width(height)
										}
									}
								})
		    },1000)
                    
                    $http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
                        
                    });
                }
                else{
					$('.loader_overlay').hide()
					$('.loader_img_overlay').hide()
                    $scope.arrayOfMedias=[];    
                    $scope.medias=[];
                }
                });
                   	
                },10); 
                $(document).ready(function(){
                    startupall();
					$("#filterbar").hover(function(){
			$(".searchinglist").addClass("highlight")},
		function(){
			$(".searchinglist").removeClass("highlight")
		});  
		
		$('.searchBar').click(function () {
			$("input#searchfld").focus();	
		});
		
		/*$('#tips-btn').click(function(e){    
			    $('#questionMenu').fadeOut('slow', function(){
			        $('#tips, .ui-widget-overlay').fadeIn('slow');
			    });
			});
			
			$('#closetips').click(function(e){    
			    $('#tips, .ui-widget-overlay').fadeOut('slow', function(){
			        $('#questionMenu').fadeIn('slow');
			    });
			});*/
			
			
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
                    
                });
            },10);                    	
    })
    var powerUserCase=0;
    $scope.changePT =function(){
		$('.loader_overlay').show()
		$('.loader_img_overlay').show()
        $timeout(function(){
            $('#slideTitleHeader li').each(function(){
                if ($(this).css('visibility')!='hidden') {
                    $scope.selectedgt=$(this).attr('id');
                }
            });
            $http.post('/media/searchEngine',{title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType}).then(function (data1, status, headers, config) {
                
                if (data1.data.status=="success"){
					
                        $scope.medias=data1.data.results;
                        for(i in $scope.medias){
                            $scope.arrayOfMedias.push($scope.medias[i]._id);
                        }
                        
                        setTimeout(function(){
						$('.loader_overlay').hide()
						$('.loader_img_overlay').hide()
                        jQuery('.text_wrap').each(function(){
                            if($(this).children().first().prop('tagName')!='IFRAME'){
                                    $(this).prev().hide();
                            }
                        })
                        //$(document).ready(function(){
                        $( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
                        //});
						
						$('.innerimg-wrap').each(function(){
									  height=$(this).parent().height();
									  imgheight=$(this).children().first('img').height();
									  imgwidth=$(this).children().first('img').width();
									  if(height>imgheight){
										$(this).children().first('img').height(height)
									  }
									  else if(height>imgwidth){
										$(this).children().first('img').width(height)
									  }
									  else{
										if(imgheight<imgwidth){
										    $(this).children().first('img').height(height)
										}
										else if(imgwidth<imgheight){
											$(this).children().first('img').width(height)
										}
										else{
											$(this).children().first('img').width(height)
										}
									}
								})
						
		    },1000)
                        
                        $http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
                        
                        });
                }
                else{
					$('.loader_overlay').hide()
					$('.loader_img_overlay').hide()
                  $scope.medias={};
                  $scope.arrayOfMedias=[];
                }
				
            });
        },1200)
    }
    
    $scope.searchTitle="";
    $scope.mediaId="";
    
	//added on 06102014 by manishp
	//$scope.isMediaDetailPage = 0;
	
    $scope.setMediaId = function(medid){
		//alert("1");
	$('.navarrow-left').removeClass('navarrow-left');
        $('.navarrow-right').removeClass('navarrow-right');
        $scope.mediasData=medid;
        //console.log("Medias-Data : ",$scope.mediasData);
        //holder_img
	}
    
    $scope.cancel = function(){
        $('.holder_bulb').html("");
        $('.center-container a:nth-child(2) ').addClass('navarrow-right');  
        $('.center-container a:nth-child(1)').addClass('navarrow-left');      
        
    }
    $scope.changePower=function(){
        setTimeout(function(){if ($scope.powerUser) {
            powerUserCase=1;
        }
        else{
            powerUserCase=0;
        }
        $scope.filterSub();},10)  
    }
    $scope.changeOwner =function(){
        setTimeout(function(){if($scope.ownerFSG){
            userFsgs=$scope.boarddata[0].OwnerID.FSGs;
        }
        else{
            userFsgs={};
        }
        $scope.filterSub();},10)  
    }
    $scope.selectedFSGs={};
        
    $scope.changeCss = function(id,sg,fsg){
		if($('#'+id).prop('checked')){
			$('#'+id).prop('checked',false)
		}
        $scope.selectedFSGs={};
        setTimeout(function(){
            $('.filter_checbox').each(function(){
				
				if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data')!='') {
					var attr=$(this).find('.radiobb').attr('data');
					attr=attr.split('~');
					var fields={};
					fields[attr[0]]=attr[1];
					$scope.selectedFSGs[attr[0]]=attr[1];                
				}  
			});
			$scope.filterSub();           
        },800);
        
    }
    var userFsgs={};
    $scope.filterSub = function(){
		$('.loader_overlay').show()
		$('.loader_img_overlay').show()
        if(!$scope.ownerFSG){
            userFsgs=$scope.selectedFSGs;
        }
        $('#slideTitleHeader li').each(function(){
                if ($(this).css('visibility')!='hidden') {
                    $scope.selectedgt=$(this).attr('id');
                }
            });
            $http.post('/media/searchEngine',{title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType}).then(function (data1, status, headers, config) {
                
                if (data1.data.status=="success"){    
                        $scope.medias=data1.data.results;
                        for(i in $scope.medias){
                            $scope.arrayOfMedias.push($scope.medias[i]._id);
                        }
                        
                        setTimeout(function(){
						$('.loader_overlay').hide()
						$('.loader_img_overlay').hide()
                        jQuery('.text_wrap').each(function(){
                            if($(this).children().first().prop('tagName')!='IFRAME'){
                                    $(this).prev().hide();
                            }
                        })
                        //$(document).ready(function(){
                        $( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
                        //});
						$('.innerimg-wrap').each(function(){
									  height=$(this).parent().height();
									  imgheight=$(this).children().first('img').height();
									  imgwidth=$(this).children().first('img').width();
									  if(height>imgheight){
										$(this).children().first('img').height(height)
									  }
									  else if(height>imgwidth){
										$(this).children().first('img').width(height)
									  }
									  else{
										if(imgheight<imgwidth){
										    $(this).children().first('img').height(height)
										}
										else if(imgwidth<imgheight){
											$(this).children().first('img').width(height)
										}
										else{
											$(this).children().first('img').width(height)
										}
									}
								})
		    },1000)
                        
                        $http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
                        
                        });
                }
                else{
					$('.loader_overlay').hide()
					$('.loader_img_overlay').hide()
                  $scope.medias={};
                  $scope.arrayOfMedias=[];
                }
            });
    }
    
    /////Upload Media
    
    $scope.addMedia = function(){       
        var fields={};
        fields.id=$scope.id;
        fields.BoardId=$stateParams.id;
        fields.media=$scope.mediasData._id;
        fields.MediaID=$scope.mediasData._id;
        fields.owner=$scope.mediasData.value.UploaderID;
        fields.OwnerId=$scope.mediasData.value.UploaderID;
        fields.Action="Post";
        fields.url=$scope.mediasData.value.URL;
        fields.MediaURL=$scope.mediasData.value.URL;
        fields.MediaType=$scope.mediasData.value.MediaType;
        fields.ContentType=$scope.mediasData.value.ContentType;
        fields.contentType=$scope.mediasData.value.ContentType;
        fields.Content=$scope.mediasData.value.Content;
        fields.title=$scope.mediasData.value.Title;
        fields.prompt=$scope.mediasData.value.Prompt;
        fields.locator=$scope.mediasData.value.Locator;
        fields.Title=$scope.mediasData.value.Title;
        fields.Prompt=$scope.mediasData.value.Prompt;
        fields.Locator=$scope.mediasData.value.Locator;
        fields.data=$scope.mediasData;
        //console.log(fields)
        
        $('#slideTitleHeader li').each(function(){
            if ($(this).css('visibility')!='hidden') {                
                fields.themeId=$(this).attr('id')
                fields.theme=$(this).find('span').html()
                
                $http.post('/media/actions',fields).then(function (data, status, headers, config) {
                    if (data.data.status=="success"){ 
						$scope.setFlash('Success.' , 'success');
                        $window.location='#/discuss/'+fields.id;
                    }
                    else{
                        $scope.medias={};
                    }
                })          
            }
        })
    }
    /////Upload Media
     
    
    
    $scope.searchMedia = function(){
		$('.loader_overlay').show()
		$('.loader_img_overlay').show()
        $('#slideTitleHeader li').each(function(){
            if ($(this).css('visibility')!='hidden') {
                $scope.selectedgt=$(this).attr('id');
                $http.post('/media/searchEngine',{title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType}).then(function (data, status, headers, config) {
                   if (data.data.status=="success"){
                        $scope.medias=data.data.results;
                        for(i in $scope.medias){
                            $scope.arrayOfMedias.push($scope.medias[i]._id);
                        }
                        
                        setTimeout(function(){
						$('.loader_overlay').hide()
						$('.loader_img_overlay').hide()
                        jQuery('.text_wrap').each(function(){
                            if($(this).children().first().prop('tagName')!='IFRAME'){
                                    $(this).prev().hide();
                            }
                        })
                        //$(document).ready(function(){
                        $( ".text_wrap p img" ).parent().addClass( "innerimg-wrap" )
                        //});
						$('.innerimg-wrap').each(function(){
									  height=$(this).parent().height();
									  imgheight=$(this).children().first('img').height();
									  imgwidth=$(this).children().first('img').width();
									  if(height>imgheight){
										$(this).children().first('img').height(height)
									  }
									  else if(height>imgwidth){
										$(this).children().first('img').width(height)
									  }
									  else{
										if(imgheight<imgwidth){
										    $(this).children().first('img').height(height)
										}
										else if(imgwidth<imgheight){
											$(this).children().first('img').width(height)
										}
										else{
											$(this).children().first('img').width(height)
										}
									}
								})
		    },1000)
                        
                        $http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
                            
                        });
                    }
                    else{
						$('.loader_overlay').hide()
						$('.loader_img_overlay').hide()
                        $scope.arrayOfMedias=[];    
                        $scope.medias=[];
                    }
                })  
            }
        })        
    }
    $scope.fsgs=[];
    $http.get('/fsg/view').then(function (data, status, headers, config){
         
         if (data.data.code==200){
            $scope.fsgs=data.data.response;
         }
         
    })
    
    var ud=[];
    loginService.chkUserLogin($http,$location,$window).then(function(){
        $scope.userInfo = tempData;
        userdata=$scope.userInfo;
        for(k in userdata.FSGs){
                ud.push(k+'~'+userdata.FSGs[k])
        }
    });
    
    /////Upload Media
    $scope.uploadSuccess = function(){
        $('.upload').each(function(){
            if($(this).attr('data-dialog-id')==5) {
                $(this).trigger('click');    
            }
        })        
    }
    
    
    
    
    
    //////Uploader Script Starts
    
    
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
	
	$scope.onFileSelect = function($files) {
                $scope.uploadRightAway=1;
		$scope.percentUpload=0;
		$scope.imagessize=0;
		$scope.selectedFiles = [];
		$scope.fileUpload=[];
		$scope.progress = [];
		if ($scope.upload && $scope.upload.length > 0) {
			for (var i = 0; i < $scope.upload.length; i++) {
				if ($scope.upload[i] != null) {
					$scope.upload[i].abort();
				}
			}
		}
		$scope.upload = [];
		$scope.uploadResult = [];
		$scope.selectedFiles = $files;
		//console.log($scope.selectedFiles);
		$scope.lengthofuploads=$files.length;
		$scope.fileUpload=$files;
		$scope.dataUrls = [];
		for ( var i = 0; i < $files.length; i++) {
			var $file = $files[i];
			$scope.imagessize+=Math.round($files[i].size/1024);
			if (window.FileReader && $file.type.indexOf('image') > -1) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL($files[i]);
				var loadFile = function(fileReader, index) {
					fileReader.onload = function(e) {
						$timeout(function() {
							$scope.dataUrls[index] = e.target.result;
						});
					}
				}(fileReader, i);
			}
			$scope.progress[i] = -1;
			if ($scope.uploadRightAway) {
				$scope.start(i);
			}
		}
	};
	
	$scope.count=0;
	$scope.percentUpload=0;
	
        $scope.uploadedMedia={};
        
	$scope.start = function(index) {
		$scope.disablebtn=true;
		$scope.progress[index] = 0;
		$scope.errorMsg = null;
		if ($scope.howToSend != 1) {
			$scope.upload[index] = $upload.upload({
                            url : '/boards/uploadMedia',
                            method: $scope.httpMethod,
                            headers: {'my-header': 'my-header-value'},
                            data : {
                                myModel : $scope.myModel
                            },				
                            file: $scope.selectedFiles[index],
                            fileFormDataName: 'myFile'
			}).then(function(response) {
				$scope.disablebtn=false;
				$scope.uploadResult.push(response.data);
			}, function(response) {
				if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
			}, function(evt) {
				// Math.min is to fix IE which reports 200% sometimes
				$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			}).xhr(function(xhr){
				xhr.upload.addEventListener('abort', function() {
					//console.log('abort complete')
				}, false);
			}).success(function(data, status, headers, config) {				
				$scope.count++;				
				
				if($scope.count==$scope.selectedFiles.length){
                                    $scope.percentUpload=100;
                                    
                                    $scope.imagessize=0;
                                    $scope.selectedFiles = [];
                                    $scope.fileUpload=[];
                                    $scope.progress = [];
                                    $scope.count=0;
                                    var offsetlength={
                                            offset:0,
                                            limit:20
                                    };
                                    $scope.uploadedMedia=data;                                    
                                    $('.upload').trigger('click');                                    
				}
				else{
					
					$scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
					
					
				}		
			});
		} else {
			//console.log("asdasdasd");
			var fileReader = new FileReader();
            fileReader.onload = function(e) {
		        $scope.upload[index] = $upload.http({
		        	url: '/massmediaupload/add',
					headers: {'Content-Type': $scope.selectedFiles[index].type},
					data: e.target.result
		        }).then(function(response) {
					$scope.uploadResult.push(response.data);
				}, function(response) {
					if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
				}, function(evt) {
					// Math.min is to fix IE which reports 200% sometimes
					$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
            }
	        fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
		}
	};

	$scope.uploadAll = function(){
		$scope.count=0;
		for(i=0;i<$scope.fileUpload.length;i++){
			$scope.start(i);
		}
	};

    
    //////Uploader Script Ends

    $scope.media123={};
    
    
    
    
    
    
    
    
	$scope.uploadAll = function(){
		$scope.count=0;
		for(i=0;i<$scope.fileUpload.length;i++){
			$scope.start(i);
		}
	};
        
	
        $scope.onHeaderSelect = function($files) {
            $scope.uploadRightAway=1;
            $scope.percentUpload=0;
            $scope.imagessize=0;
            $scope.selectedFiles = [];
            $scope.fileUpload=[];
            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                    for (var i = 0; i < $scope.upload.length; i++) {
                            if ($scope.upload[i] != null) {
                                    $scope.upload[i].abort();
                            }
                    }
            }
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            //console.log($scope.selectedFiles);
            $scope.lengthofuploads=$files.length;
            $scope.fileUpload=$files;
            $scope.dataUrls = [];
            for ( var i = 0; i < $files.length; i++) {
                    var $file = $files[i];
                    $scope.imagessize+=Math.round($files[i].size/1024);
                    if (window.FileReader && $file.type.indexOf('image') > -1) {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL($files[i]);
                            var loadFile = function(fileReader, index) {
                                    fileReader.onload = function(e) {
                                            $timeout(function() {
                                                    $scope.dataUrls[index] = e.target.result;
                                            });
                                    }
                            }(fileReader, i);
                    }
                    $scope.progress[i] = -1;
                    
                    $scope.startHeader(i);
                   
            }
	};

	
        $scope.headerstyle="";
        
        $scope.startHeader = function(index) {
		$scope.disablebtn=true;
		$scope.progress[index] = 0;
		$scope.errorMsg = null;
                $scope.upload[index] = $upload.upload({
                    url : '/boards/uploadHeader?id='+$stateParams.id,
                    method: $scope.httpMethod,
                    headers: {'my-header': 'my-header-value'},
                    data : {
                        id : $stateParams.id
                    },				
                    file: $scope.selectedFiles[index],
                    fileFormDataName: 'myFile'
                }).then(function(response) {
                        $scope.disablebtn=false;
                        $scope.uploadResult.push(response.data);
                }, function(response) {
                        if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }).xhr(function(xhr){
                        xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
                }).success(function(data, status, headers, config) {				
                        $scope.count++;				
                        
                        if($scope.count==$scope.selectedFiles.length){
                            $scope.percentUpload=100;
                            
                            $scope.imagessize=0;
                            $scope.selectedFiles = [];
                            $scope.fileUpload=[];
                            $scope.progress = [];
                            $scope.count=0;
                            var offsetlength={
                                    offset:0,
                                    limit:20
                            };
                            $scope.uploadedMedia=data;
                            
                            $scope.headerstyle="background:url(../assets/board/headerImg/"+data.result.HeaderImage+");";
                            //$('.upload').trigger('click');                                    
                        }
                        else{
                                
                                $scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
                                
                                
                        }		
                });
	};


        $scope.media123={};
    
    $scope.audioFile="";
    
    $scope.onAudioSelect = function($files) {
            $scope.showProgress = true;
            $scope.uploadRightAway=1;
            $scope.percentUpload=0;
            $scope.imagessize=0;
            $scope.selectedFiles = [];
            $scope.fileUpload=[];
            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                    for (var i = 0; i < $scope.upload.length; i++) {
                            if ($scope.upload[i] != null) {
                                    $scope.upload[i].abort();
                            }
                    }
            }
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            //console.log($scope.selectedFiles);
            $scope.lengthofuploads=$files.length;
            $scope.fileUpload=$files;
            $scope.dataUrls = [];
            
            $('.loader_overlay_full').show();
            $('.loader_img_overlay_full').show();
            
            for ( var i = 0; i < $files.length; i++) {
                    var $file = $files[i];
                    $scope.imagessize+=Math.round($files[i].size/1024);
                    if (window.FileReader && $file.type.indexOf('image') > -1) {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL($files[i]);
                            var loadFile = function(fileReader, index) {
                                    fileReader.onload = function(e) {
                                            $timeout(function() {
                                                    $scope.dataUrls[index] = e.target.result;
                                            });
                                    }
                            }(fileReader, i);
                    }
                    $scope.progress[i] = -1;
                    
                    $scope.startAudio(i, $files.length);
                   
            }
	};
    
    $scope.startAudio = function(index, fileLength) {
		$scope.disablebtn=true;
		$scope.progress[index] = 0;
		$scope.errorMsg = null;
                $scope.upload[index] = $upload.upload({
                    url : '/boards/uploadHeader?id='+$stateParams.id+'&type=audio',
                    method: $scope.httpMethod,
                    headers: {'my-header': 'my-header-value'},
                    data : {
                        id : $stateParams.id
                    },				
                    file: $scope.selectedFiles[index],
                    fileFormDataName: 'myFile'
                }).then(function(response) {
                        $scope.disablebtn=false;
                        $scope.uploadResult.push(response.data);
                }, function(response) {
                        if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                        // Math.min is to fix IE which reports 200% sometimes
                        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }).xhr(function(xhr){
                        xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
                }).success(function(data, status, headers, config) {
                            $('.loader_overlay_full').hide();
                            $('.loader_img_overlay_full').hide();
                        $scope.count++;				
                        
                        if($scope.count==$scope.selectedFiles.length){
                            $scope.percentUpload=100;
                            
                            $scope.imagessize=0;
                            $scope.selectedFiles = [];
                            $scope.fileUpload=[];
                            $scope.progress = [];
                            $scope.count=0;
                            var offsetlength={
                                    offset:0,
                                    limit:20
                            };
                            $scope.uploadedMedia=data;
                            
                            $('#audio').attr('src',"../assets/board/backgroundAudio/"+data.result.BackgroundMusic);//$('.upload').trigger('click');                                    
                        }
                        else{
                                
                                $scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
                                
                                
                        }		
                });
	};
    
     $scope.deleteBoard=function(board_del){
         
        var data={};        
        data.id=$stateParams.id;   
        
        if (confirm('Are you sure you want to delete this Board?')) {            
            $http.post('/boards/delete',data).then(function (data, status, headers, config){
				$scope.setFlash('Board deleted successfully.' , 'success');
                $window.location='/#/projects';
                	
            })
        }
      }
    
    $scope.duplicate = function(){
        var fields={};
        fields.id=$stateParams.id;
        fields.title=$scope.duplicate.title;
        //console.log(fields);
        $http.post('/boards/duplicate',fields).then(function (data, status, headers, config) {
            if (data.data.code==200){
				$scope.setFlash('Board duplicated successfully.' , 'success');
                $window.location='/#/boards/'+data.data.message;
            }
            else{
              $scope.medias={};
            }
        })     
    }
    
    
    $scope.checknotes = function(){
        
        //console.log($scope.notes.comment);
        cmt=$scope.notes.comment;
        
        if ($scope.notes.comment!="<p><br></p>" && $scope.notes.comment!="") {
            var fields={};
            
            fields.content=$scope.notes.comment;
            fields.type='Notes';
            
            $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                if(data.data.code==200){
					$scope.setFlash('Operation performed successfully.' , 'success');
                    $scope.uploadedLink=data.data.response;
                    $('.link_upload_themes').trigger('click');
                    $('.link_holder').html($scope.notes.comment);            
                    $('.link_holder').children().css('width',$('.link_holder').width()+'px');
                }
            });            
        }
        return false;
        
    }
    
    
    
    $scope.viewBoardsMedia =  function(){
        $scope.boardsMedia=1;        
        $('.thumbs li').each(function(){
            $(this).height($(this).width())
        })

        $('.thumbs li a').each(function(){
            $(this).height($(this).width())
        })
		
		$('.innerimg-wrap').each(function(){
			  height=$(this).parent().height();
			  imgheight=$(this).children().first('img').height();
			  imgwidth=$(this).children().first('img').width();
			  if(height>imgheight){
				$(this).children().first('img').height(height)
			  }
			  else if(height>imgwidth){
				$(this).children().first('img').width(height)
			  }
			  else{
				if(imgheight<imgwidth){
					$(this).children().first('img').height(height)
				}
				else if(imgwidth<imgheight){
					$(this).children().first('img').width(height)
				}
				else{
					$(this).children().first('img').width(height)
				}
			}
		})
    }
    
    $scope.boardsMedia=0;
    
    $scope.rename = function(){
        var fields={};
        fields.id=$stateParams.id;
        fields.title=$scope.rename.title;
        $http.post('/boards/rename',fields).then(function (data, status, headers, config) {
            if (data.data.code==200){
				$scope.setFlash('Board renamed successfully.' , 'success');
				$window.location.reload();
            }
            else{
                $scope.medias={};
            }
        })     
    }
	
	//search media detail page actions
	$scope.media_comments = [];
	//$scope.searchMedia = {};
	$scope.media_comment = "";
	$scope.redactorOptions = {};

	
	$scope.postMediaComment = function(comment){
		//console.log("media_comments "+comment);
		//alert("m here"+$scope.media_comment);
        
		/*
		var fields={};
        fields.comment = comment;
        console.log("media_comments",fields.comment);
		alert("media-comment : "+fields.comment);
		return;
        $http.post('/search_gallery/media_comment',fields).then(function (data, status, headers, config) {
            if (data.data.code==200){         
                $scope.media_comments=data.data.media_comments;
				$window.location='/#/boards/'+data.data.message;
            }
            else{
              $scope.media_comments=[];
            }
        })
		*/
    }
	
	var innerimg_wrap_class = "innerimg-wrap";
	collabmedia.filterProvider.register('GalleryBoxPClass', ['$scope', function($scope){
		return function(mediaType) {
			if(mediaType == 'Notes')
				innerimg_wrap_class = "";
				
			return innerimg_wrap_class;
		};
	}]);
	
	
	
	
});
