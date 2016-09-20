var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('mediaTrayCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){

/*-----initializing required variables------*/
    $scope.countOfTrayMedia = 0;                    //addToMediaTray
/*-----end of initializing  variables------*/   

/*________________________________________________________________________
    * @Date:      	13 May 2015 ( for newer version)
    * @Method :   	addToMediaTray
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-
    * @Purpose:   	This function is used to add media from search gallery to media tray 
    * @Param:     	2
    * @Return:    	no
_________________________________________________________________________
*/   
    $scope.addToMediaTray = function(media,event){
        if(event){
			event.stopPropagation();
            event.preventDefault();
        }
		if ($scope.countOfTrayMedia <15) {
			var test='';
			//var func_openMediaDetail = "openMediaDetail_discuss($(this))";
            var func_openMediaDetail = "";
            $scope.countOfTrayMedia++;
			if(media.value.MediaType == 'Montage'){
				var montageHTML =  (media.value.Content).toString();
				console.log(montageHTML);
				montageHTML = montageHTML.replace(/</g,"@frst@");
				montageHTML = montageHTML.replace(/>/g,"@second@");
				test = angular.element('<li class="dragable"><div title="Delete" class="close_icon"  onclick="montage_ele.deleteMedia($(this))" style="display:none"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><img fallback-src=""  width="44" height="44"  class="montageElement" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Montage"><p class="montageContent" style="display:none">'+montageHTML+'</p></a></li>');
			}
			else if(media.value.MediaType=='Notes'){
				var noteHTML =  (media.value.Content).toString();
				noteHTML = noteHTML.replace(/</g,"@less@");
				noteHTML = noteHTML.replace(/>/g,"gre@ter");
				var func_setID = "setMediaIdd_uploadCase('"+media._id+"')";
				test = angular.element('<li class="dragable notes"><div title="Delete" class="close_icon"  onclick="montage_ele.deleteMedia($(this))" style="display:none"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><img fallback-src=""  width="44" height="44"  class="noteElement" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Note"><p class="noteContent" style="display:none">'+noteHTML+'</p></a></li>');
			}
			else if (media.value.MediaType=='Link' ) {
				var strIframeHTML =  media.value.Content;
				strIframeHTML = strIframeHTML.replace(/</g,"@less@");
				strIframeHTML = strIframeHTML.replace(/>/g,"gre@ter");
				test = angular.element('<li class="dragable"><div title="Delete" class="close_icon"  onclick="montage_ele.deleteMedia($(this))" style="display:none"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><img fallback-src=""   width="44" height="44" class="linkElement" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.thumbnail+'" alt="Link"><p class="linkContent" style="display: none">'+strIframeHTML+'</p></a></li>');
			}
			else if(media.value.ContentType=='application/pdf'){
				test = angular.element('<li class="dragable"><div title="Delete" class="close_icon" onclick="montage_ele.deleteMedia($(this))" style="display:none"></div> <a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><img fallback-src=""   width="44" height="44" class="avatar" alt="" src="../assets/img/PDF.png"><span  class="avatar-name"></a></li>');
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.wordprocessingml.document' || media.value.ContentType=='application/msword'){
				test = angular.element('<li class="dragable"><div title="Delete" class="close_icon" onclick="montage_ele.deleteMedia($(this))" style="display:none"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><img fallback-src=""   width="44" height="44" class="avatar" alt="" src="../assets/img/Icon-Document.jpg"><span  class="avatar-name"></a></li>');
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || media.value.ContentType=='application/vnd.ms-excel' || media.value.ContentType=='application/vnd.oasis.opendocument.spreadsheet'){
			   test = angular.element('<li class="dragable"><div title="Delete" class="close_icon" onclick="montage_ele.deleteMedia($(this))" style="display:none"></div><a href="javascript:void(0)" data-id='+media._id+'  onclick='+func_openMediaDetail+'><img fallback-src=""  width="44" height="44" class="avatar" alt="" src="../assets/img/excel.png"><span  class="avatar-name"></a></li>');
			}
			else if(media.value.ContentType=='application/vnd.openxmlformats-officedocument.presentationml.presentation' || media.value.ContentType=='application/vnd.ms-powerpoint'){
				test = angular.element('<li class="dragable"><div title="Delete" class="close_icon" onclick="montage_ele.deleteMedia($(this))" style="display:none"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><img fallback-src=""  width="44" height="44" class="avatar" alt="" src="../assets/img/ppt.png"><span  class="avatar-name"></a></li>');
			}
			else if(media.value.ContentType=='image/png' || media.value.ContentType=='image/jpeg' || media.value.ContentType=='image/gif' || media.value.ContentType==null){
				test = angular.element('<li class="dragable"><div title="Delete" class="close_icon" onclick="montage_ele.deleteMedia($(this))" style="display:none"></div><a href="javascript:void(0)" data-id='+media._id+' onclick='+func_openMediaDetail+'><img fallback-src=""  width="44" height="44" class="avatar" alt="" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.URL+'" ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.value.URL+'"></a></li>');
			}
			$compile(test)($scope);
			$('#searchList__mediaTray').append(test);
			//$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			/*----*/
		}else{
			$("#media_tray_full_pop").show();
		}
		setTimeout(function(){$scope.$apply()},10)
    }
/**********************************END***********************************/


/*________________________________________________________________________
    * @Date:      	29 May 2015 
    * @Method :   	sync_discussTray
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-1 june 2015-
    * @Purpose:   	This function is used sync search media tray with discuss media tray on switch to discuss.  
    * @Param:     	-
    * @Return:    	no
_________________________________________________________________________
*/ 
	$scope.sync_discussTray = function(){
		if ($('#searchList__mediaTray').find('.empty-list').is('img')) {
			
		}
		else{
			var search_tray_items = angular.element('<ul id="discussList__mediaTray">'+$('#searchList__mediaTray').html()+'</ul>');
			search_tray_items.find('li').each(function(){
				$(this).find('.close_icon').css({'display':'block'});
				$(this).find('a').attr('onClick','mediaSite.discussTrayClick($(this))');
			})
			$('.discuss_trayArea').html(search_tray_items);
		}
	}
/**********************************END***********************************/



/*________________________________________________________________________
    * @Date:      	1 june 2015 
    * @Method :   	sync_searchViewTray
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	--
    * @Purpose:   	This function is used sync search media tray with search view media tray on switch.  
    * @Param:     	-
    * @Return:    	no
_________________________________________________________________________
*/ 
	$scope.sync_searchViewTray = function(){
		if ($('#searchList__mediaTray').find('.empty-list').is('img')) {
		}else{
			var search_tray_items = angular.element('<ul id="searchView-media-tray">'+$('#searchList__mediaTray').html()+'</ul>');
			search_tray_items.find('li').each(function(){
				$(this).find('.close_icon').css({'display':'block'});
				$(this).find('a').attr('onClick','montage_ele.gridster_tray($(this))');
				$(this).addClass('drag-me');
			})
			setTimeout(function(){$('.drag-me').draggable({revert:'invalid',helper: 'clone'})},50);
			$('#search_view .image-selector').html(search_tray_items);
		}
	}
/**********************************END***********************************/

/*________________________________________________________________________
		* @Date:      	25 Feb 2015
		* @Method :   	addtoTray_delCase
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used to add a icon of deleted media to media tray.
		* @Param:     	1
		* @Return:    	no
	_________________________________________________________________________
	*/
	$scope.addtoTray_delCase = function(mediaID){
		if ($scope.countOfTrayMedia < 15) {
			$http.post('/media/viewMedia',{ID:mediaID}).then(function(response){
				var data = response.data.result[0];
				$scope.addtoTray_uploadCase(data);
			})
		}else{
			$("#media_tray_full_pop").show();
		}
	}
/********************************************END******************************************************/



/*________________________________________________________________________
	* @Date:      	25 Feb 2015
	* @Method :   	addtoTray_uploadCase
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to add a icon of uploaded media to media tray.
	* @Param:     	1
	* @Return:    	no
_________________________________________________________________________
*/     
	$scope.addtoTray_uploadCase = function(media){
		console.log('addtoTray_uploadCase ')
		if ($scope.countOfTrayMedia <15) {
			$('.avatar-widget').css({'display':'block'});
			$scope.countOfTrayMedia++;
			var test='';	
			var func_setID = "setMediaIdd_uploadCase('"+media._id+"')";
			if(media.MediaType == 'Montage'){
				var montageHTML =  (media.Content).toString();
				montageHTML = montageHTML.replace(/</g,"@frst@");
				montageHTML = montageHTML.replace(/>/g,"@second@");
				//montageHTML = montageHTML.replace(/</g,"@less@");
				//montageHTML = montageHTML.replace(/>/g,"gre@ter");
				//console.log(montageHTML);
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon"  onclick="montage_ele.deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="" is-private="'+media.IsPrivate+'"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="montageElement"   src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" fallback-src="" alt="Montage"><p class="montageContent"  style="display:none">'+montageHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				console.log(test);
				$('#searchList__mediaTray').append(test);
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			else if (media.MediaType == 'Link') {
				var strIframeHTML =  media.Content;
				strIframeHTML = strIframeHTML.replace(/</g,"@less@");
				strIframeHTML = strIframeHTML.replace(/>/g,"gre@ter");
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon"  onClick="montage_ele.deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="" is-private="'+media.IsPrivate+'"><span  class="avatar-name"><img  class="linkElement" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" alt="Loading..." fallback-src=""><p class="linkContent" style="display: none">'+strIframeHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				$('#searchList__mediaTray').append(test);
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			else if (media.MediaType == 'Image') {
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon" onClick="montage_ele.deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="" is-private="'+media.IsPrivate+'"><img width="30" class="avatar" alt="" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.Location[0].URL+'"   fallback-src=""><span  class="avatar-name"></span></a></li>');
				test = $compile(test)($scope);
				$('#searchList__mediaTray').append(test);
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			else if(media.MediaType=='Notes'){
				var noteHTML =  (media.Content).toString();
				noteHTML = noteHTML.replace(/</g,"@less@");
				noteHTML = noteHTML.replace(/>/g,"gre@ter");
				var func_setID = "setMediaIdd_uploadCase('"+media._id+"')";
				test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onclick="montage_ele.deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="" is-private="'+media.IsPrivate+'"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="noteElement"  src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" fallback-src="" alt="Note"><p class="noteContent" style="display:none">'+noteHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				$('#searchList__mediaTray').append(test);
				$(".dragable").draggable({revert:'invalid', appendTo: "body",helper: 'clone'});
			}
			else if (media.MediaType == 'Video') {
				test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onClick="montage_ele.deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="" is-private="'+media.IsPrivate+'"><span  class="avatar-name" style="width:100%"><img class="media_img" src="../assets/Media/video/'+$scope.small__thumbnail+'/'+media.thumbnail+'" alt="Video" fallback-src=""/></span><p class="videoContent" style="display: none;">source src="../assets/Media/video/'+media.Location[0].URL+'"</p></a></li>');
				test = $compile(test)($scope);
				$('#searchList__mediaTray').append(test);
			}else{
				alert('else case addtoTray_uploadCase')
			}
			setTimeout(function(){
				$scope.$apply();
				$scope.sync_searchViewTray();
				$scope.sync_discussTray();
				setTimeout(function(){$('.drag-me').draggable({revert:'invalid',helper: 'clone'})},50);
			},1)
		}else{
			$("#media_tray_full_pop").show();
		}
	};
/********************************************END******************************************************/

}]);