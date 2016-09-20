var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('searchGalleryCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	/*
		Action : Media Gallery - setMediaId, It will be used by ticked action. which will add the
		selected media into the board discuss
	
	*/

	
	$scope.setMediaId = function(medid){
		//alert("1");
        $scope.mediasData=medid;
		//added on 26122014 by manishp setting pageFlag
		$scope.setPageFlag('SG',$scope.mediasData.value.MediaType);
	}
	//--parul--5 jan 2015
	$scope.setMediaIdDiscuss = function(medid){
		//alert("1");
        $scope.mediasData=medid;
		console.log($scope.mediasData);
		//added on 26122014 by manishp setting pageFlag
		$scope.setPageFlag('D');
	}
	//----end
	/*
		Action : Media Gallery - addToMediaTray, It adds media into the media tray.
	
	*/
	$scope.countOfTrayMedia=0;
    /*
	$scope.addToMediaTray = function(media){
		//console.log(media)
		$scope.countOfTrayMedia++;
		var test='';								
											
		if(media.value.MediaType=='Link' || media.value.MediaType=='Notes'){	   	   
			media.value.Content
			test = angular.element('<li><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click=\'setMediaIdd("'+media._id+'")\' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><span  class="avatar-name">'+media.value.Content+'</span></a></li>');
			$('.avatarlist').append(test);
			$compile(test)($scope);
		}
		else if(media.value.ContentType=='application/pdf'){
			test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div> <a href="javascript:void(0)" data-ng-click=\'setMediaIdd("'+media._id+'")\' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/PDF.png"><span  class="avatar-name"></span></a></li>');
			$('.avatarlist').append(test);
			$compile(test)($scope);
		}
		else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || media.value.ContentType=='application/msword'){
			test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click=\'setMediaIdd("'+media._id+'")\' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/Icon-Document.jpg"><span  class="avatar-name"></span></a></li>');
			$('.avatarlist').append(test);
			$compile(test)($scope);
		}
		else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || media.value.ContentType=='application/vnd.ms-excel' || media.value.ContentType=='application/vnd.oasis.opendocument.spreadsheet'){
		   test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click=\'setMediaIdd("'+media._id+'")\' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/excel.png"><span  class="avatar-name"></span></a></li>');
		   $('.avatarlist').append(test);
			$compile(test)($scope);
		}
		else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.presentationml.presentation' || media.value.ContentType=='application/vnd.ms-powerpoint'){
			test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click=\'setMediaIdd("'+media._id+'")\' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/ppt.png"><span  class="avatar-name"></span></a></li>');
			$('.avatarlist').append(test);
			$compile(test)($scope);
		}
		else if(media.value.ContentType=='image/png' || media.value.ContentType=='image/jpeg' || media.value.ContentType=='image/gif' || media.value.ContentType==null){
			test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click=\'setMediaIdd("'+media._id+'")\' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/Media/img/'+media.value.URL+'"><span  class="avatar-name"></span></a></li>');
			$('.avatarlist').append(test);
			$compile(test)($scope);
		}
		//alert($('.avatarlist').children().length)
		if($('.avatarlist').children().length>5){
			$('.avarrow-left').show()
			$('.avarrow-right').show()	 
		}
    }
	*/
	
	
	/*________________________________________________________________________
		* @Date:      	13 May 2015 ( for newer version)
		* @Method :   	addToMediaTray
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used to add media from search gallery to media tray 
		* @Param:     	1
		* @Return:    	no
	_________________________________________________________________________
	*/   
    $scope.addToMediaTray = function(media){
		if ($('#media-tray-elements').find('li').length <15) {
			$('.avatar-widget').css({'display':'block'});
			$scope.countOfTrayMedia++;
			var test='';
			var func_openMediaDetail = "openMediaDetail_discuss($(this))"
			if(media.value.MediaType == 'Montage'){
				var montageHTML =  (media.value.Content).toString();
				montageHTML = montageHTML.replace(/</g,"@less@");
				montageHTML = montageHTML.replace(/>/g,"gre@ter");
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="montageElement" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Montage"><p class="montageContent" style="display:none">'+montageHTML+'</p></span></a></li>');
			}
			else if(media.value.MediaType=='Notes'){
				var noteHTML =  (media.value.Content).toString();
				noteHTML = noteHTML.replace(/</g,"@less@");
				noteHTML = noteHTML.replace(/>/g,"gre@ter");
				var func_setID = "setMediaIdd_uploadCase('"+media._id+"')";
				test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="noteElement" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Note"><p class="noteContent" style="display:none">'+noteHTML+'</p></span></a></li>');
			}
			else if (media.value.MediaType=='Link' ) {
				var strIframeHTML =  media.value.Content;
				strIframeHTML = strIframeHTML.replace("<","less");
				strIframeHTML = strIframeHTML.replace(">","greater");
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="linkElement" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Link"><p class="linkContent" style="display: none">'+strIframeHTML+'</p></span></a></li>');
			}
			else if(media.value.ContentType=='application/pdf'){
				test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div> <a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/PDF.png"><span  class="avatar-name"></span></a></li>');
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || media.value.ContentType=='application/msword'){
				test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/Icon-Document.jpg"><span  class="avatar-name"></span></a></li>');
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || media.value.ContentType=='application/vnd.ms-excel' || media.value.ContentType=='application/vnd.oasis.opendocument.spreadsheet'){
			   test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+'  onclick='+func_openMediaDetail+'><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/excel.png"><span  class="avatar-name"></span></a></li>');
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.presentationml.presentation' || media.value.ContentType=='application/vnd.ms-powerpoint'){
				test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/ppt.png"><span  class="avatar-name"></span></a></li>');
			}
			else if(media.value.ContentType=='image/png' || media.value.ContentType=='image/jpeg' || media.value.ContentType=='image/gif' || media.value.ContentType==null){
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.URL+'" ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.URL+'"><span  class="avatar-name"></span></a></li>');
			}
			$('.avatarlist').append(test);
			$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			/*----*/
			if($('.avatarlist').children().length>5){
				$('.avarrow-left').show();
				$('.avarrow-right').show();	 
			}
		}else{
			$("#media_tray_full_pop").show();
		}
		setTimeout(function(){$scope.$apply()},10)
    }
	/********************************************END******************************************************/
	
	
	
	/*________________________________________________________________________
		* @Date:      	-
		* @Method :   	addToMediaTray__OLD
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is replaced with a newer version because there was someproblem with angular compile.
		* 				now calling required function from jquery function.also removing ng-click
		* @Param:     	1
		* @Return:    	no
	_________________________________________________________________________
	*/   
	//function added to add class dragable to tray elements by parul
    $scope.addToMediaTray__OLD = function(media){
		//console.log(media)
		if ($('#media-tray-elements').find('li').length <15) {
			$('.avatar-widget').css({'display':'block'});
			$scope.countOfTrayMedia++;
			var test='';
			var func_setID = "setMediaIdd_uploadCase('"+media._id+"')";
			//alert('addtomediatray')								
			if(media.value.MediaType == 'Montage'){
				//console.log(media.value.Content);
				//console.log('---------------------------------------------------------------------------');
				var montageHTML =  (media.value.Content).toString();
				//console.log(montageHTML);
				montageHTML = montageHTML.replace(/</g,"@less@");
				montageHTML = montageHTML.replace(/>/g,"gre@ter");
				//alert('montage');
				//console.log(montageHTML);
				//media.value.Content
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="montageElement"  ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Montage"><p class="montageContent" style="display:none">'+montageHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				//console.log(test);
				$('.avatarlist').append(test);
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			/*
			else if(media.value.MediaType=='Notes'){
				//alert('notes');
				media.value.Content
				test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click=\'setMediaIdd("'+media._id+'")\' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><span  class="avatar-name"><p>'+media.value.Content+'</p></span></a></li>');
				test = $compile(test)($scope);
				$('.avatarlist').append(test);
				//$compile(test)($scope);
				$(".dragable").draggable({revert:'invalid', appendTo: "body",helper: 'clone'
											//start: function(){ //hide original when showing clone
											//	$(this).hide();             
											//},
											//stop: function(){ //show original when hiding clone
											//	$(this).show();
											//}
										});
				}
			*/
			else if(media.value.MediaType=='Notes'){
				//alert('notes');
				media.value.Content
				var noteHTML =  (media.value.Content).toString();
				noteHTML = noteHTML.replace(/</g,"@less@");
				noteHTML = noteHTML.replace(/>/g,"gre@ter");
				var func_setID = "setMediaIdd_uploadCase('"+media._id+"')";
				//test = angular.element('<li class="dragable      "><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="montageElet"  ng-src="../assets/Media/img/'+media.value.thumbnail+'" src="../assets/Media/img/'+media.value.thumbnail+'" alt="Mont"><p class="montageContent" style="display:none">'+montageHTML+'</p></span></a></li>');
				test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="noteElement"  ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Note"><p class="noteContent" style="display:none">'+noteHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				$('.avatarlist').append(test);
				//$compile(test)($scope);
				$(".dragable").draggable({revert:'invalid', appendTo: "body",helper: 'clone'
											//start: function(){ //hide original when showing clone
											//	$(this).hide();             
											//},
											//stop: function(){ //show original when hiding clone
											//	$(this).show();
											//}
										});
			}
			else if (media.value.MediaType=='Link' ) {
				//alert('Link');
				var strIframeHTML =  media.value.Content;
				strIframeHTML = strIframeHTML.replace("<","less");
				strIframeHTML = strIframeHTML.replace(">","greater");
				
				
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="linkElement"  ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Link"><p class="linkContent" style="display: none">'+strIframeHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				$('.avatarlist').append(test);
				//$compile(test)($scope);
				
				
				
				
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			else if(media.value.ContentType=='application/pdf'){
				test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div> <a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/PDF.png"><span  class="avatar-name"></span></a></li>');
				test = $compile(test)($scope);
				$('.avatarlist').append(test);
				//$compile(test)($scope);
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || media.value.ContentType=='application/msword'){
				test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/Icon-Document.jpg"><span  class="avatar-name"></span></a></li>');
				test = $compile(test)($scope);
				$('.avatarlist').append(test);
				//$compile(test)($scope);
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || media.value.ContentType=='application/vnd.ms-excel' || media.value.ContentType=='application/vnd.oasis.opendocument.spreadsheet'){
			   test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/excel.png"><span  class="avatar-name"></span></a></li>');
			   test = $compile(test)($scope);
			   $('.avatarlist').append(test);
			   
				//$compile(test)($scope);
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.presentationml.presentation' || media.value.ContentType=='application/vnd.ms-powerpoint'){
				test = angular.element('<li><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/img/ppt.png"><span  class="avatar-name"></span></a></li>');
				test = $compile(test)($scope);
				$('.avatarlist').append(test);
				//$compile(test)($scope);
			}
			else if(media.value.ContentType=='image/png' || media.value.ContentType=='image/jpeg' || media.value.ContentType=='image/gif' || media.value.ContentType==null){
				//test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-ng-click=\'setMediaIdd("'+media._id+'")\' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/Media/img/'+media.value.URL+'"><span  class="avatar-name"></span></a></li>');
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon" onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><img width="30" class="avatar" alt="" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.URL+'" ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.URL+'"><span  class="avatar-name"></span></a></li>');
				test = $compile(test)($scope);
				$('.avatarlist').append(test);
				//$compile(test)($scope);
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			//alert($('.avatarlist').children().length)
			if($('.avatarlist').children().length>5){
				$('.avarrow-left').show();
				$('.avarrow-right').show();	 
			}
		}else{
			$("#media_tray_full_pop").show();
		}
		setTimeout(function(){$scope.$apply()},10)
    }
	/********************************************END******************************************************/
	
	
	/*
		Action : Media Gallery - openInNextTab, only applicable for image type media on right 
		click opens media into the next tab
	
	*/
	$scope.openInNextTab = function(value){
        window.open('../assets/Media/img/'+value,'_blank'); 
    };
	
	
	$scope.isOnSearchActPage = false;
	$scope.isOnDiscussActPage = false;
	
	$scope.isPrevSearchMedia = false;
	$scope.isNextSearchMedia = false;
	
	$scope.prevHoverIn__OnAct = function(){
		$scope.isPrevSearchMedia = true;
		$scope.isNextSearchMedia = false;
		
		$scope.isOnSearchActPage = true;
		$scope.isOnDiscussActPage = false;
	}
	
	
	$scope.nextHoverIn__OnAct = function(){
		$scope.isNextSearchMedia = true;
		$scope.isPrevSearchMedia = false;
		
		$scope.isOnSearchActPage = true;
		$scope.isOnDiscussActPage = false;
	}
	
});