var collabmedia = angular.module('collabmedia');


collabmedia.controllerProvider.register('dragDropCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	/*Chrome does not support contains*/
	//String.prototype.contains = function(str) { return this.indexOf(str) != -1; };
	
    /* Events fired on the drop target */
    // When the draggable p element enters the droptarget, change the DIVS's border style
    $("html").on("dragenter", function(event) {
		$scope.setPageFlag('SG','DragMedia');
        event.preventDefault();
        if ( event.target.className.indexOf("dropzone3") > -1 ) {
			$('#dropzone').css({'border':'3px dotted red'})
        }else{
			$('#dropzone').css({'border':''})
		}
    });
	$('.avatar-widget').on('dragleave',function(event){
		event.preventDefault();
		$('#dropzone').css({'border':''})
	})
    // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
     $("html").on("dragover", function(event) {
        event.preventDefault();
    });
    /* On drop - Prevent the browser default handling of the data (default is open as link on drop)
       Reset the color of the output text and DIV's border color
       Get the dragged data with the dataTransfer.getData() method
       The dragged data is the id of the dragged element ("drag1")
       Append the dragged element into the drop element
    */
     $("html").on("drop", function(event) {
        event.preventDefault();
	   if ( event.target.className.indexOf("dropzone3") > -1 ) {
			$('#dropzone').css({'border':''});
			if ($('#media-tray-elements').find('li').length <15) {
				event.dataTransfer = event.originalEvent.dataTransfer;			
				var file = event.originalEvent.dataTransfer.files;          
				console.log(file);
				console.log(file.length);
				if (file.length == 0) {
					var data = event.dataTransfer.getData("Text");
					$scope.link.content = data;
					setTimeout(function(){
						$scope.uploadLink();
					},500);
				}else if (file.length == 1) {
					if ((file[0].type).indexOf('image') != -1) {
						var sendFile = [];
						sendFile.push(file[0]);
						$scope.onFileSelect(sendFile);
					}else{
						alert(file.type+" not allowed...");
					}
				}else{
					alert('Please drop only one Link/Image at a time');
				}
			}else{
				$("#media_tray_full_pop").show();
			}
        }
    });
	 
	 
	 
	$scope.init__dragDropObjects = function(){
		$scope.link = {};
	} 
	
	/*________________________________________________________________________
		* @Date:      	25 Feb 2015
		* @Method :   	uploadLinkIndex
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used for Check media Thumbnails.
		* @Param:     	0
		* @Return:    	no
	_________________________________________________________________________
	*/  
	// parul 25022015
	$scope.linkIndex = {};
	$scope.uploadedLink = {};
	$scope.uploadedMedia = {};
	$scope.uploadLinkIndex = function(){
		$scope.uploadedMedia={}; //added on 07012015 by manishp : resolved link after h/d image upload issue
		var url = $scope.linkIndex.content;
		if( (url.match(/youtube.com/gi) != null) ){
			var youtube_url = '';
			if( url.match(/^(<iframe)(.*?)(<\/iframe>)$/) == null ) {
				// Code for Youttube
				var op = url.split(/[=]+/).pop();
				//alert("Youtube video id: " + op);
				var youtubeIframe = '<iframe width="560" height="315" src="//www.youtube.com/embed/'+op+'?autohide=1&fs=1&rel=0&hd=1&wmode=opaque" frameborder="0" allowfullscreen></iframe>';
				$scope.linkIndex.content = youtubeIframe;
				//getting thumbnail
				if( url.match(/youtube.com/gi) != null ){
					$scope.linkIndex.thumbnail = '';
					youtube_url = url;
					console.log("youtube_url = ",youtube_url);
					$scope.linkIndex.thumbnail = $scope.youtube_thumb(youtube_url);
					console.log("Got thumbnail from youtube drag-drop = ",$scope.linkIndex.thumbnail);
					saveLinkData();
				}
			}
			else if( url.match(/^(<iframe)(.*?)(<\/iframe>)$/) != null ) {
				//alert("Youtube IFRAME case Found here---");//return false;
				if( url.match(/^(<iframe)(.*?)(<\/iframe>)$/) != null ){
					//alert("IFRAME case");
					$scope.linkIndex.thumbnail = '';
					youtube_url = url;
					console.log("youtube_url = ",youtube_url);
					$scope.linkIndex.thumbnail = $scope.youtube_thumb(youtube_url);
					console.log("Got thumbnail from youtube IFRAME = ",$scope.linkIndex.thumbnail);
					saveLinkData();
				}
			}
			else{
				alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
			}
		} 
		else if( (url.match(/vimeo.com/gi) != null) ){ 
			var vimeo_url = '';
			if(url.match(/^(<iframe)(.*?)(<\/iframe>)$/) == null) {
				// code for Vimeo
				var op = url.split(/[/]+/).pop();
				//alert("Vimeo video id: " + op);
				varvimeoIframe = '<iframe src="//player.vimeo.com/video/'+ op +'?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=ff0179" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
				$scope.linkIndex.content = varvimeoIframe;
				
				//vimeo_thumb
				//getting thumbnail
				if( url.match(/vimeo.com/gi) != null ){
					$scope.linkIndex.thumbnail = '';
					vimeo_url = url;
					console.log("vimeo_url = ",vimeo_url);
					$scope.vimeo_thumb(vimeo_url);
					console.log("Got thumbnail from youtube drag-drop = ",$scope.linkIndex.thumbnail);
				}
				else{
					alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
				}
				
			}
			else if( url.match(/^(<iframe)(.*?)(<\/iframe>)$/) != null ) {
				//alert("Youtube IFRAME case Found here---");//return false;
				
				if( url.match(/^(<iframe)(.*?)(<\/iframe>)$/) != null ){
					//alert("Vimeo IFRAME copy paste case");
					$scope.linkIndex.thumbnail = '';
					var srcUrl = '';
					//get src of the vimeo iframe
					//srcUrl = url.match(/^(<iframe.*? src=")(.*?)(\??)(.*?)(".*)$/mg);
					var res = url.split("src=");
					//console.log("split result = ",res);
					//alert(res);
					var res2 = res[1].split('"');
					//alert(res2[1]);
					srcUrl = res2[1]
					//console.log('matching object ',srcUrl);
					vimeo_url = srcUrl;
					//console.log("vimeo_iframe srcUrl = ",vimeo_url);
					//$scope.vimeo_thumb(vimeo_url);
					//console.log("Got thumbnail from vimeo IFRAME = ",srcUrl);
					$scope.vimeo_thumb(vimeo_url);
					
				}
				else{
					alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
				}
			}
			else{
				alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
			}
			
		}
		else {
		  
			// Code for another image handling from google 26-11-2014@Swapnesh
			var newData = url.split(".");
			var ext = newData[newData.length-1];
			if( ( "jpg" === ext ) || ( "png" === ext ) || ( "gif" === ext ) ) {
				$scope.linkIndex.content = '<img src="'+url+'" alt="image" />';
				$scope.linkIndex.type = "image";
				$scope.linkIndex.thumbnail = '';
				$scope.linkIndex.thumbnail = url;
				saveLinkData()
			}
			else {
				if( url.match(/.www.google./) != null ) {
					// Code for match
					var newData = url.split('&url=');
					var nextData = newData[1].split('&ei=');
					var imgUrl = decodeURIComponent(nextData[0]);
					$scope.linkIndex.content = '<img src="'+imgUrl+'" alt="image" />';
					$scope.linkIndex.type = "image";
					
					$scope.linkIndex.thumbnail = '';
					$scope.linkIndex.thumbnail = imgUrl;
					saveLinkData()
					
				}
				else if( url.match(/^(<iframe)(.*?)(<\/iframe>)$/) != null ){
					// Code for iframe check
					$scope.linkIndex.content = url;
					$scope.linkIndex.thumbnail = '';
					$scope.linkIndex.thumbnail = url;
					saveLinkData();
				}
				else {
					alert("Please drag and drop videos from youtube.com, vimeo.com or web-images.");
					$("#dropLink").val("");
					return false;
				}
			}
		}
	    $("#dropLink").val("");
    }
	
	
	/*________________________________________________________________________
		* @Date:      	25 Feb 2015
		* @Method :   	uploadLinkIndex
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used for save data of link.
		* @Param:     	0
		* @Return:    	no
	_________________________________________________________________________
	*/  
	function saveLinkData(){
		if ($scope.linkIndex.content!="") {
			var fields={};
			
			fields.content=$scope.linkIndex.content
			
			//added on 24122014 by manishp embedded link thumbnail case.
			var thumbnail = '';
			if($scope.linkIndex.thumbnail){
				thumbnail = $scope.linkIndex.thumbnail;
			}
			fields.thumbnail=$scope.linkIndex.thumbnail;
			//End added on 24122014 by manishp embedded link thumbnail case.
			
			
			$http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
				if(data.data.code==200){
					//$scope.setFlash('Link added successfully.' , 'success');
					$scope.uploadedLink=data.data.response;
					$('.link_upload_themes').trigger('click');
					
					// Code to show image in block after drag drog - 26-11-2014@Swapnesh
					$('.link_holder').html($scope.linkIndex.content);
					$scope.linkIndex.type = "";
	
					$('.link_holder').children().css('width',$('.link_holder').width()+'px');
				}
			});
			//$('.link_holder').first().height='100%';
		}
		return false;
	}
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
		//if ( $('#grid').css('display') != 'none' ) {
		//	var items = (4-$('#grid').find('.addnote').length)+$(".search-view #search-media-tray li").length;
		//	if (items <= 12) {
		//		$http.post('/media/viewMedia',{ID:mediaID}).then(function(response){
		//			//alert(1);
		//			var data = response.data.result[0];
		//			$scope.addtoTray_uploadCase(data);
		//		})
		//	}else{
		//		$("#media_tray_full_pop").show();
		//	}
		//}else{
			var items = $(".search-view #search-media-tray li").length;
			if (items < 16) {
				$http.post('/media/viewMedia',{ID:mediaID}).then(function(response){
					//alert(1);
					var data = response.data.result[0];
					$scope.addtoTray_uploadCase(data);
				})
			}else{
				$("#media_tray_full_pop").show();
			}
		//}
	}
	
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
		if ($('#media-tray-elements').find('li').length <15) {
			$('.avatar-widget').css({'display':'block'})
			$scope.countOfTrayMedia++;
			var test='';	
			var func_setID = "setMediaIdd_uploadCase('"+media._id+"')";
			if(media.MediaType == 'Montage'){
				var montageHTML =  (media.Content).toString();
				montageHTML = montageHTML.replace(/</g,"@less@");
				montageHTML = montageHTML.replace(/>/g,"gre@ter");
				//alert('montage');
				console.log(montageHTML);
				//media.value.Content
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))" is-private="'+media.IsPrivate+'"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="montageElement"  ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" alt="Montage"><p class="montageContent"  style="display:none">'+montageHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				console.log(test);
				$('#media-tray-elements').append(test);
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			else if (media.MediaType == 'Link') {
				//alert('link');
				var strIframeHTML =  media.Content;
				strIframeHTML = strIframeHTML.replace("<","less");
				strIframeHTML = strIframeHTML.replace(">","greater");
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon"  onClick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))" is-private="'+media.IsPrivate+'"><span  class="avatar-name"><img  class="linkElement" ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" alt="Loading..." fallback-src=""><p class="linkContent" style="display: none">'+strIframeHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				$('#media-tray-elements').append(test);
				//$compile(test)($scope);
				//$compile($('#media-tray-elements').contents())($scope);
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			else if (media.MediaType == 'Image') {
				//alert('Image');
				console.log(media);
				test = angular.element('<li class="dragable"><div title="Delete" style="top:0" class="close_icon" onClick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))" is-private="'+media.IsPrivate+'"><img width="30" class="avatar" alt="" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.Location[0].URL+'"  ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.Location[0].URL+'"><span  class="avatar-name"></span></a></li>');
				test = $compile(test)($scope);
				$('#media-tray-elements').append(test);
				//$compile(test)($scope);
				$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			}
			/*
			else if (media.MediaType == 'Notes') {
				//alert('note');
				//media.value.Content
				test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onClick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))" is-private="'+media.IsPrivate+'"><span  class="avatar-name" style="width:100%"><p>'+media.Content+'</p></span></a></li>');
				test = $compile(test)($scope);
				$('#media-tray-elements').append(test);
				//$compile(test)($scope);
				$(".dragable").draggable({revert:'invalid', appendTo: "body",helper: 'clone'});
			}*/
			else if(media.MediaType=='Notes'){
				//alert('notes');
				//media.value.Content
				var noteHTML =  (media.Content).toString();
				noteHTML = noteHTML.replace(/</g,"@less@");
				noteHTML = noteHTML.replace(/>/g,"gre@ter");
				var func_setID = "setMediaIdd_uploadCase('"+media._id+"')";
				//test = angular.element('<li class="dragable      "><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="montageElet"  ng-src="../assets/Media/img/'+media.value.thumbnail+'" src="../assets/Media/img/'+media.value.thumbnail+'" alt="Mont"><p class="montageContent" style="display:none">'+montageHTML+'</p></span></a></li>');
				test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onclick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))" is-private="'+media.IsPrivate+'"><span class="avtar_list_overlay"></span><span  class="avatar-name"><img  class="noteElement"  ng-src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" src="../assets/Media/img/'+$scope.small__thumbnail+'/'+media.thumbnail+'" alt="Note"><p class="noteContent" style="display:none">'+noteHTML+'</p></span></a></li>');
				test = $compile(test)($scope);
				$('#media-tray-elements').append(test);
				$(".dragable").draggable({revert:'invalid', appendTo: "body",helper: 'clone'});
			}
			else if (media.MediaType == 'Video') {
				//alert('Video'+media);
				//<p class="videoContent" ng-if="media.MediaType == 'Video'" style="display: none;">source src="../assets/Media/video/+media.MediaURL+"</p>
				//test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onClick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))" is-private="'+media.IsPrivate+'"><span  class="avatar-name" style="width:100%"><img class="media_img" ng-src="../assets/Media/video/'+$scope.small__thumbnail+'/'+media.thumbnail+'" src="../assets/Media/video/'+$scope.small__thumbnail+'/'+media.thumbnail+'" alt="Sample Image 1" /></span><p class="videoContent" style="display: none;">source src="../assets/Media/video/'+media.Location[0].URL+'"</p></a></li>');
				test = angular.element('<li class="dragable notes"><div title="Delete" style="top:0" class="close_icon"  onClick="deleteMedia($(this))"></div><a href="javascript:void(0)" data-id='+media._id+' data-ng-click='+func_setID+' onclick="openMediaDetail($(this))" is-private="'+media.IsPrivate+'"><span  class="avatar-name" style="width:100%"><img class="media_img" ng-src="../assets/Media/video/'+$scope.small__thumbnail+'/'+media.thumbnail+'" src="../assets/Media/video/'+$scope.small__thumbnail+'/'+media.thumbnail+'" alt="Video" /></span><p class="videoContent" style="display: none;">source src="../assets/Media/video/'+media.Location[0].URL+'"</p></a></li>');
				test = $compile(test)($scope);
				$('#media-tray-elements').append(test);
			}else{
				alert('else case addtoTray_uploadCase')
			}
			if($('#media-tray-elements').children().length>5){
				$('.avarrow-left').show()
				$('.avarrow-right').show()	 
			}
			//alert($('.avatarwdgt ul li').length);
			//$('.image-selector').html('<ul id="search-media-tray" class="avatarlist clearfix">'+$('#media-tray-elements').html()+'</ul>');
			$('.image-selector').html('<ul id="search-media-tray" class="avatarlist clearfix">'+$('#media-tray-elements').html()+'</ul>');
			$("#discuss_list #search-media-tray li").each(function(){
				//console.log($(this));
				$(this).find('a').attr('onClick','openMediaDetail_discuss($(this))')
				$(this).addClass('drag-me');
			});
			$(".search-view #search-media-tray li").each(function(){
				//console.log($(this));
				$(this).find('a').attr('onClick','gridster_tray($(this))')
				$(this).addClass('drag-me');
			})
			setTimeout(function(){$('.drag-me').draggable({revert:'invalid',helper: 'clone'})},50);
		}else{
			$("#media_tray_full_pop").show();
		}
	};
	
	/*________________________________________________________________________
	* @Date:      	25 Feb 2015
	* @Method :   	setMediaIdd_uploadCase
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to add set id and details of media in direct upload case.
	* @Param:     	1
	* @Return:    	no
	_________________________________________________________________________
	*/
	$scope.setMediaIdd_uploadCase = function(id){
		$http.post('/media/viewMedia',{ID:id}).then(function(response){
			//alert(1);
			var data = response.data.result[0];
			console.log(data);
			$scope.mediasData = {};
			$scope.mediasData._id = data._id;
			$scope.mediasData.MediaID = data._id;
			$scope.mediasData.value = {};
			$scope.mediasData.value.Title = data.Title?data.Title:null;
			$scope.mediasData.value.Prompt = data.Prompt?data.Prompt:null;
			$scope.mediasData.value.Locator = data.Locator?data.Locator:null;	
			$scope.mediasData.value.Title = data.Title? data.Title:null;
			$scope.mediasData.value.URL = data.Location[0].URL?data.Location[0].URL:null;
			$scope.mediasData.value.MediaType = data.MediaType?data.MediaType:null;
			$scope.mediasData.value.ContentType = data.ContentType?data.ContentType:null;	
			$scope.mediasData.value.UploadedOn = data.UploadedOn?data.UploadedOn:null;		
			$scope.mediasData.value.UploaderID = data.UploaderID?data.UploaderID:null;			
			$scope.mediasData.value.Content = data.Content?data.Content:null;	//added on 30092014-Link case
			$scope.mediasData.value.thumbnail = data.thumbnail?data.thumbnail:null;	//added on 21122014-Montage case
			$scope.mediasData.value.IsPrivate = data.IsPrivate?data.IsPrivate:null;	//added on 05022015-Private Media Case
			
			$scope.mediasData.value.PostsBestFSGCount = 0;
			$scope.mediasData.value.PostsCount = 0;
			
			$scope.mediasData.value.StampsBestFSGCount = 0;
			$scope.mediasData.value.StampsCount = 0;
			 
			$scope.mediasData.value.ViewsCount = 0;
			if(data.ViewsCount) 
				$scope.mediasData.ViewsCount = data.ViewsCount?data.ViewsCount:null;
			$scope.mediasData.value.MaxFSGSort = 0;
			$scope.mediasData.value.AvgFSGSort = 0;
			$scope.mediasData.value.MediaScore = 0;
			setTimeout(function(){
				if ($('.holder-act').css('display') == 'none') {
					console.log('in steMediaIdd_uploadCase setting page flag');
					$scope.setPageFlag('ST',$scope.mediasData.value.MediaType);
				}
			},1000);
			
			if ( $scope.del_grid_noteCase == true ) {
				$scope.del_grid_noteCase = false;
				$scope.addMedia();
			}
			//alert(1);
			//console.log('=================================================================================');
			//console.log($scope.mediasData);
			//console.log('=================================================================================');
		})
	}
	
	/*________________________________________________________________________
	* @Date:      	07042015 April 2015
	* @Method :   	closePrivate
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to close private case popup.
	* @Param:     	0
	* @Return:    	no
	_________________________________________________________________________
	*/
	$scope.closePrivate = function(){
		$('#private_media_pop').css({'display':'none'});
		$('#private_media_pop1').css({'display':'none'});
	}
	
	/*________________________________________________________________________
	* @Date:      	09042015 April 2015
	* @Method :   	closeMontagePop
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to montage case popup.
	* @Param:     	0
	* @Return:    	no
	_________________________________________________________________________
	*/
	$scope.closeMontagePop = function(){
		$('#montage_pop').css({'display':'none'});
		$('#montage_replace_pop').css({'display':'none'});
	}
	
	
});

