var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('uploadMediaCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
    $scope.count=0;
    $scope.media={};
    $scope.uploadedMedia = {};
    $scope.uploadedLink = {};
/*________________________________________________________________________
* @Date:      	11 june 2015--added to new ctrl on
* @Method :   	postMedia --earlier it was addmedia
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to called to add media to current page/board
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    
    $scope.postMedia = function(pageId){
        if(pageId != null){
            console.log('post media');
            var fields={};
            fields.id=$scope.page_id;
            fields.BoardId=$scope.page_id;
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
            fields.Statement = $('#'+pageId+' .edit_froala1').editable('getHTML', true, true);
            fields.Statement  = (fields.Statement == '<p class="fr-tag">Start writing...</p>') ? '':fields.Statement;
            var thumbnail = '';
            if( $scope.mediasData.value.thumbnail ){
                thumbnail=$scope.mediasData.value.thumbnail;
                console.log("--------------if-------"+$scope.mediasData.value.thumbnail);
            }
            fields.thumbnail=thumbnail;
            fields.themeId='';
            fields.theme='';
            console.log(fields);
            $http.post('/media/actions',fields).then(function (data, status, headers, config) {
                if (data.data.status=="success"){ 
                    $('#overlay2').show();
                    $('#overlayContent2').show();//its get hidden in change pt function that is called by $scope.init__Discuss()
                    $scope.init__Discuss(pageId);
                    $scope.setFlashInstant('Media Posted into the Board' , 'success');
                    $scope.close_holderAct(pageId);
                }
                else{
                    $scope.medias={};
                }
            })          
            
        }
        else{
            console.log('post media');
            var fields={};
            fields.id=$scope.page_id;
            fields.BoardId=$scope.page_id;
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
            fields.Statement = $('.edit_froala1').editable('getHTML', true, true);
            fields.Statement  = (fields.Statement == '<p class="fr-tag">Start writing...</p>') ? '':fields.Statement;
            var thumbnail = '';
            if( $scope.mediasData.value.thumbnail ){
                thumbnail=$scope.mediasData.value.thumbnail;
                console.log("--------------if-------"+$scope.mediasData.value.thumbnail);
            }
            fields.thumbnail=thumbnail;
            fields.themeId='';
            fields.theme='';
            console.log(fields);
            $http.post('/media/actions',fields).then(function (data, status, headers, config) {
                if (data.data.status=="success"){ 
                    $('#overlay2').show();
                    $('#overlayContent2').show();//its get hidden in change pt function that is called by $scope.init__Discuss()
                    $scope.init__Discuss();
                    $scope.setFlashInstant('Media Posted into the Board' , 'success');
                    $scope.close_holderAct();
                }
                else{
                    $scope.medias={};
                }
            })          
            
        }
        
    }
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	11 june 2015--added to new ctrl on
* @Method :   	onFileSelect
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to called to upload images dropped or selected by user.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.onFileSelect = function($files , pageId) {
        if(pageId != null){
            if ($scope.countOfTrayMedia < 15) {
                $('#overlay2').show();
                $('#overlayContent2').show();
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
                        $scope.start(i , pageId);
                    }
                }
            }else{
                $('#'+pageId+" #media_tray_full_pop").show();
            }
        }
        else{
            if ($scope.countOfTrayMedia < 15) {
                $('#overlay2').show();
                $('#overlayContent2').show();
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
            }else{
                    $("#media_tray_full_pop").show();
            }
            
        }
    };
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	start
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is called in onFileSelect function-- used to upload image;
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.start = function(index , pageId) {
        if(pageId != null){
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
                    $('#overlay2').hide();
                    $('#overlayContent2').hide();
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
                    console.log('scope.count = '+$scope.count);
                    console.log('$scope.selectedFiles.length = '+$scope.selectedFiles.length);
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
                        //$('.upload_img').trigger('click');
                        $('#'+pageId+' .upload_img').trigger('click');
                    }
                    else{
                        $scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
                    }		
                });
            } else {
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    $scope.upload[index] = $upload.http({
                        url: '/massmediaupload/add',
                        headers: {'Content-Type': $scope.selectedFiles[index].type},
                        data: e.target.result
                    }).then(function(response) {
                        $('#overlay2').hide();
                        $('#overlayContent2').hide();
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
        
        }
        else{
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
                        $('#overlay2').hide();
                        $('#overlayContent2').hide();
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
                    console.log('scope.count = '+$scope.count);
                    console.log('$scope.selectedFiles.length = '+$scope.selectedFiles.length);
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
                        //$('.upload_img').trigger('click');
                        $('.upload_img').trigger('click');
                    }
                    else{
                        $scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
                    }		
                });
            } else {
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    $scope.upload[index] = $upload.http({
                        url: '/massmediaupload/add',
                        headers: {'Content-Type': $scope.selectedFiles[index].type},
                        data: e.target.result
                    }).then(function(response) {
                        $('#overlay2').hide();
                        $('#overlayContent2').hide();
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
        }
        
    };
/**********************************END***********************************/




	$scope.uploadLink=function(pageId){
            if(pageId != null){
                $scope.link.Title = "";
                $scope.link.Prompt = "";

                if ($scope.countOfTrayMedia <15) {
                    //$('#overlay2').show();
                    //$('#overlayContent2').show();
                    $scope.webLinkTitle = '';
                    $scope.uploadedMedia={}; //added on 07012015 by manishp : resolved link after h/d image upload issue
                    var input = $scope.link.content;
                    var getOmbedProvider = {};
                    //alert("input = "+input);
                    var foundCase = $scope.find__initialCase( input ); // function is in uploadLink engine
                    //alert("foundCase = "+foundCase);
                    switch( foundCase ){
                            case "IFRAME" :
                                    //alert("Iframe case found!");
                                    //handle iframe case
                                    $scope.__UploadIframeCase( input , pageId )

                                    break;

                            case "URL_OR_STRING" :
                                    var foundOtherCase = $scope.find__OtherCase( input );
                                    //alert("foundOtherCase = "+foundOtherCase);
                                    switch( foundOtherCase ){
                                            case "MEDIA" :
                                                    //alert("Web Media case found....!");
                                                    $scope.__UploadMediaCase( input , pageId );// function is in uploadLink engine
                                                    break;

                                            case "MAYBEOEMBED" :
                                                    //alert("MAYBEOEMBED case....!");
                                                    $scope.__UploadOembedCase( input , pageId )
                                                    break;

                                            default : 
                                                    alert("2) Strange......! How is this possible..check it!!!");
                                    }
                                    break;

                            default : 
                                    alert("1) Strange......! How is this possible..check it!!!");

                    }

                    return false;
                }else{
                    $('#'+pageId+" #media_tray_full_pop").show();
                }
            }
            else{
                $scope.link.Title = "";
                $scope.link.Prompt = "";

                if ($scope.countOfTrayMedia <15) {
                        //$('#overlay2').show();
                        //$('#overlayContent2').show();
                        $scope.webLinkTitle = '';
                        $scope.uploadedMedia={}; //added on 07012015 by manishp : resolved link after h/d image upload issue
                        var input = $scope.link.content;
                        var getOmbedProvider = {};
                        //alert("input = "+input);
                        var foundCase = $scope.find__initialCase( input ); // function is in uploadLink engine
                        //alert("foundCase = "+foundCase);
                        switch( foundCase ){
                                case "IFRAME" :
                                        //alert("Iframe case found!");
                                        //handle iframe case
                                        $scope.__UploadIframeCase( input )

                                        break;

                                case "URL_OR_STRING" :
                                        var foundOtherCase = $scope.find__OtherCase( input );
                                        //alert("foundOtherCase = "+foundOtherCase);
                                        switch( foundOtherCase ){
                                                case "MEDIA" :
                                                        //alert("Web Media case found....!");
                                                        $scope.__UploadMediaCase( input );// function is in uploadLink engine
                                                        break;

                                                case "MAYBEOEMBED" :
                                                        //alert("MAYBEOEMBED case....!");
                                                        $scope.__UploadOembedCase( input )
                                                        break;

                                                default : 
                                                        alert("2) Strange......! How is this possible..check it!!!");
                                        }
                                        break;

                                default : 
                                        alert("1) Strange......! How is this possible..check it!!!");

                        }

                        return false;
                }else{
                        $("#media_tray_full_pop").show();
                }
                
            }
	}
	
	$scope.__UploadIframeCase = function ( url , pageId ) {
            if(pageId != null){
                if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null  || url.match(/^(<div)(.*?)(><script)(.*?)<\/script>(.*?)(<\/div>)$/)) {
                    if( (url.match(/youtube.com/gi) != null) ){
                        //alert("youtube IFRAME case Found here---");//return false;
                        var youtube_url = '';
                        $scope.link.thumbnail = '';

                        youtube_url = url;
                        console.log("youtube_url = ",youtube_url);
                        $scope.link.thumbnail = $scope.youtube_thumb(youtube_url , pageId);
                        console.log("Got thumbnail from youtube IFRAME = ",$scope.link.thumbnail);
                        saveLinkData(pageId);
                    }
                    else if( (url.match(/vimeo.com/gi) != null) ){ 
                        //alert("vimeo IFRAME case Found here---");//return false;

                        var vimeo_url = '';
                        $scope.link.thumbnail = '';
                        vimeo_url = url;
                        console.log("vimeo_url = ",vimeo_url);
                        $scope.vimeo_thumb(vimeo_url , pageId);
                        console.log("Got thumbnail from youtube drag-drop = ",$scope.link.thumbnail);
                    }
                    else{
                        //other cases...
                        $scope.link.content = url;
                        $scope.link.thumbnail = '';
                        //$scope.link.thumbnail = url;
                        saveLinkData(pageId)
                    }

		}
		else{
                    alert("Not Possible Case!");
                    return false;
		}
                
            }
            else{
                if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null  || url.match(/^(<div)(.*?)(><script)(.*?)<\/script>(.*?)(<\/div>)$/)) {
			if( (url.match(/youtube.com/gi) != null) ){
                            //alert("youtube IFRAME case Found here---");//return false;
                            var youtube_url = '';
                            $scope.link.thumbnail = '';

                            youtube_url = url;
                            console.log("youtube_url = ",youtube_url);
                            $scope.link.thumbnail = $scope.youtube_thumb(youtube_url);
                            console.log("Got thumbnail from youtube IFRAME = ",$scope.link.thumbnail);
                            saveLinkData();
			}
			else if( (url.match(/vimeo.com/gi) != null) ){ 
				//alert("vimeo IFRAME case Found here---");//return false;
				
				var vimeo_url = '';
				$scope.link.thumbnail = '';
				vimeo_url = url;
				console.log("vimeo_url = ",vimeo_url);
				$scope.vimeo_thumb(vimeo_url);
				console.log("Got thumbnail from youtube drag-drop = ",$scope.link.thumbnail);
			}
			else{
				//other cases...
				$scope.link.content = url;
				$scope.link.thumbnail = '';
				//$scope.link.thumbnail = url;
				saveLinkData()
			}
			
		}
		else{
			alert("Not Possible Case!");
			return false;
		}
                
            }
	}
	
	
	$scope.__UploadMediaCase = function ( url , pageId ) {
            if(pageId != null){
                if( url.match(/.www.google./) != null ) {
                    //alert("Google image link...");
                    // Code for match
                    var newData = url.split('&url=');
                    var nextData = newData[1].split('&ei=');
                    var imgUrl = decodeURIComponent(nextData[0]);
                    $scope.link.content = '<img src="'+imgUrl+'" alt="image" />';
                    $scope.link.type = "image";

                    $scope.link.thumbnail = '';
                    $scope.link.thumbnail = imgUrl;
                    saveLinkData(pageId)

                }
                else if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null ){
                    // Code for iframe check
                    $scope.link.content = url;

                    $scope.link.thumbnail = '';

                    if( (url.match(/soundcloud.com/gi) != null) ){
                        var soundcloud_url = '';
                        // code for Vimeo
                        var srcUrl = '';
                        //get src of the soundcloud iframe
                        //srcUrl = url.match(/^(<iframe.*? src=")(.*?)(\??)(.*?)(".*)$/mg);
                        var res = url.split("src=");
                        //console.log("split result = ",res);
                        //alert(res);
                        var res2 = res[1].split('"');
                        //alert(res2[1]);
                        srcUrl = res2[1]
                        //console.log('matching object ',srcUrl);
                        soundcloud_url = srcUrl;
                        //alert("Vimeo video id: " + op);
                        $scope.getWebLinkOembed('http://www.soundcloud.com/oembed',soundcloud_url , pageId);
                    } 

                    //$scope.link.thumbnail = url;
                    saveLinkData(pageId)
                }
                else {
                    $scope.link.content = '<img src="'+url+'" alt="image" />';
                    $scope.link.type = "image";

                    $scope.link.thumbnail = '';
                    $scope.link.thumbnail = url;
                    saveLinkData(pageId)
                }
                
            }
            else{
                if( url.match(/.www.google./) != null ) {
                    //alert("Google image link...");
                    // Code for match
                    var newData = url.split('&url=');
                    var nextData = newData[1].split('&ei=');
                    var imgUrl = decodeURIComponent(nextData[0]);
                    $scope.link.content = '<img src="'+imgUrl+'" alt="image" />';
                    $scope.link.type = "image";

                    $scope.link.thumbnail = '';
                    $scope.link.thumbnail = imgUrl;
                    saveLinkData()

                }
                else if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null ){
                        // Code for iframe check
                        $scope.link.content = url;

                        $scope.link.thumbnail = '';

                        if( (url.match(/soundcloud.com/gi) != null) ){
                                var soundcloud_url = '';
                                // code for Vimeo
                                var srcUrl = '';
                                //get src of the soundcloud iframe
                                //srcUrl = url.match(/^(<iframe.*? src=")(.*?)(\??)(.*?)(".*)$/mg);
                                var res = url.split("src=");
                                //console.log("split result = ",res);
                                //alert(res);
                                var res2 = res[1].split('"');
                                //alert(res2[1]);
                                srcUrl = res2[1]
                                //console.log('matching object ',srcUrl);
                                soundcloud_url = srcUrl;
                                //alert("Vimeo video id: " + op);
                                $scope.getWebLinkOembed('http://www.soundcloud.com/oembed',soundcloud_url);
                        } 

                        //$scope.link.thumbnail = url;
                        saveLinkData()
                }
                else {
                        $scope.link.content = '<img src="'+url+'" alt="image" />';
                        $scope.link.type = "image";

                        $scope.link.thumbnail = '';
                        $scope.link.thumbnail = url;
                        saveLinkData()
                }
                
            }
	}
	
	$scope.__UploadOembedCase = function ( url , pageId ) {
            if(pageId != null){
                getOmbedProvider = oEmbeder.get__MatchedoEmbedProvider(url);
                if( !$.isEmptyObject( getOmbedProvider ) ){
                    $scope.get__oEmbedObj( getOmbedProvider.ApiEndPoint , url , pageId )
                }
                else{
                    alert("Did not find oEmbed specification for the given link!");
                    return false;
                }
                
            }
            else{
                getOmbedProvider = oEmbeder.get__MatchedoEmbedProvider(url);
                if( !$.isEmptyObject( getOmbedProvider ) ){
                    $scope.get__oEmbedObj( getOmbedProvider.ApiEndPoint , url , pageId )
                }
                else{
                    alert("Did not find oEmbed specification for the given link!");
                    return false;
                }
                
            }
	}
	
	
	$scope.youtube_thumb = function (youtube_url , pageId){
            if(pageId != null){
                if(youtube_url){
                    var youtube_video_id = youtube_url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
                    //var thumbnail_url = 'http://img.youtube.com/vi/'+youtube_video_id+'/0.jpg';
                    var thumbnail_url = 'http://img.youtube.com/vi/'+youtube_video_id+'/mqdefault.jpg';
                    $scope.getWebLinkOembed('http://www.youtube.com/oembed','http://www.youtube.com/watch?v='+youtube_video_id , pageId);

                    return thumbnail_url; 
		}
		return false;
		//$('#youtub_id').attr('src',thumbnail_url);
                
            }
            else{
                if(youtube_url){
                    var youtube_video_id = youtube_url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
                    //var thumbnail_url = 'http://img.youtube.com/vi/'+youtube_video_id+'/0.jpg';
                    var thumbnail_url = 'http://img.youtube.com/vi/'+youtube_video_id+'/mqdefault.jpg';
                    $scope.getWebLinkOembed('http://www.youtube.com/oembed','http://www.youtube.com/watch?v='+youtube_video_id);

                    return thumbnail_url; 
		}
		return false;
		//$('#youtub_id').attr('src',thumbnail_url);
                
            }
		
	}
	
	$scope.vimeo_thumb = function (vimeo_url , pageId) {
            if(pageId != null){
                //var res = vimeo_url.split("/");
                //var vimeo_id = res[res.length-1];
                //vimeoLoadingThumb(vimeo_id);
                $http.get('http://vimeo.com/api/oembed.json?url='+vimeo_url).
                success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        var thumbnail_src = data.thumbnail_url;

                        console.log("Vimeo thumbnail =---- ",thumbnail_src);
                        //return thumbnail_src;
                        $scope.link.thumbnail = thumbnail_src;
                        if(data.title)
                            $scope.webLinkTitle = data.title;

                        if(data.html)
                            $scope.link.content = data.html;

                        saveLinkData(pageId)
                        //$scope.$apply();

                }).
                error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        alert('Vimeo thumbnail case Error!');
                        $scope.link.thumbnail = '';
                        saveLinkData(pageId)
                        //$scope.$apply();
                });
                
            }
            else{
                //var res = vimeo_url.split("/");
                //var vimeo_id = res[res.length-1];
                //vimeoLoadingThumb(vimeo_id);
                $http.get('http://vimeo.com/api/oembed.json?url='+vimeo_url).
                success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        var thumbnail_src = data.thumbnail_url;

                        console.log("Vimeo thumbnail =---- ",thumbnail_src);
                        //return thumbnail_src;
                        $scope.link.thumbnail = thumbnail_src;
                        if(data.title)
                                $scope.webLinkTitle = data.title;

                        if(data.html)
                                $scope.link.content = data.html;

                        saveLinkData()
                        //$scope.$apply();

                }).
                error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        alert('Vimeo thumbnail case Error!');
                        $scope.link.thumbnail = '';
                        saveLinkData()
                        //$scope.$apply();
                });
                
            }
	}
	
	$scope.get__oEmbedObj = function(oEmbedApi , url , pageId){
            if(pageId != null){
                var returnTitle = '';
		//alert("thumbnail before = "+$scope.link.thumbnail);
		if( oEmbedApi && url ){
			$http.get('/proxy/get_oembed?url='+oEmbedApi+'?url='+url+'&format=json')
				.success(function (data, status, headers, config) {
					console.log("data ",data);
					//here we need to check the type of the link and accordingly create the html 
					//content field
					if( data.data ){
						//alert("data.data = "+JSON.stringify(data.data));
						
						if(!$.isEmptyObject(data.data)){
							data.data.html = $scope.get__oEmbedHtmlContent(data.data , url);
						
							if(data.data.html){
								data.data.html = data.data.html.replace("<![CDATA[", ""); 
								data.data.html = data.data.html.replace("]]>", ""); 
								$scope.link.content = data.data.html;
								if( data.data.thumbnail_url ){
									$scope.link.thumbnail = data.data.thumbnail_url;
								}
								else if( data.data.image ){
									$scope.link.thumbnail = data.data.image;
								}
								else if( data.data.url ){
									$scope.link.thumbnail = data.data.url;
								}
								else{
									//$scope.link.thumbnail = data.data.thumbnail_url;
									//plan
									//alert("Error Code: get__oEmbedObj-001 => thumbnail_url,image & url keys are not present = "+$scope.link.thumbnail);
									alert("No Thumbnail Found!");
								}
								
								$scope.webLinkTitle = data.data.title;
								saveLinkData(pageId)
							}
							else{
								alert("Unknown Link!");
								return false;
							}
						
						}
						else{
							//alert("data.data = "+JSON.stringify(data.data));
							alert("Unknown Link!");
							return false;
						}
						
						
					}else{
						alert("Error Code: get__oEmbedObj-002 => data.data not found...");
					}
					
				})
				.error(function (data, status, headers, config) {
					alert("Error Code: get__oEmbedObj-003 => error = "+status);
				});
			
		}else{
			console.log("oEmbedApi && url = ",oEmbedApi+"---------"+url);
			$scope.webLinkTitle = returnTitle;
		}
                
            }
            else{
                var returnTitle = '';
		//alert("thumbnail before = "+$scope.link.thumbnail);
		if( oEmbedApi && url ){
			$http.get('/proxy/get_oembed?url='+oEmbedApi+'?url='+url+'&format=json')
				.success(function (data, status, headers, config) {
					console.log("data ",data);
					//here we need to check the type of the link and accordingly create the html 
					//content field
					if( data.data ){
						//alert("data.data = "+JSON.stringify(data.data));
						
						if(!$.isEmptyObject(data.data)){
							data.data.html = $scope.get__oEmbedHtmlContent(data.data , url);
						
							if(data.data.html){
								data.data.html = data.data.html.replace("<![CDATA[", ""); 
								data.data.html = data.data.html.replace("]]>", ""); 
								$scope.link.content = data.data.html;
								if( data.data.thumbnail_url ){
									$scope.link.thumbnail = data.data.thumbnail_url;
								}
								else if( data.data.image ){
									$scope.link.thumbnail = data.data.image;
								}
								else if( data.data.url ){
									$scope.link.thumbnail = data.data.url;
								}
								else{
									//$scope.link.thumbnail = data.data.thumbnail_url;
									//plan
									//alert("Error Code: get__oEmbedObj-001 => thumbnail_url,image & url keys are not present = "+$scope.link.thumbnail);
									alert("No Thumbnail Found!");
								}
								
								$scope.webLinkTitle = data.data.title;
								saveLinkData()
							}
							else{
								alert("Unknown Link!");
								return false;
							}
						
						}
						else{
							//alert("data.data = "+JSON.stringify(data.data));
							alert("Unknown Link!");
							return false;
						}
						
						
					}else{
						alert("Error Code: get__oEmbedObj-002 => data.data not found...");
					}
					
				})
				.error(function (data, status, headers, config) {
					alert("Error Code: get__oEmbedObj-003 => error = "+status);
				});
			
		}else{
			console.log("oEmbedApi && url = ",oEmbedApi+"---------"+url);
			$scope.webLinkTitle = returnTitle;
		}
                
            }
	}
	
	$scope.getWebLinkOembed = function(oEmbedApi , url , pageId){
	    if(pageId != null){
                $scope.webLinkTitle = '';
		var returnTitle = '';
		if( oEmbedApi && url ){
                    /*
                    $http.defaults.headers.put = {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    };
                    */
                    //$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                    //$http.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                    //$http.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With';
                    //$http.defaults.headers.common['X-Random-Shit':'123123123';
                    $http.get(oEmbedApi+'?url='+url+'&format=json').then(function (data, status, headers, config) {
                        if (data){
                            console.log("if data = ",data);
                            if(data.title){
                                $scope.webLinkTitle = data.title;
                                $scope.link.thumbnail = data.thumbnail_url;
                            }
                            else{
                                console.log("data.data.title = ",data.title);
                            }
                        }
                        else{
                            console.log("else data = ",data);
                        }				
                    })
		}else{
                    console.log("oEmbedApi && url = ",oEmbedApi+"---------"+url);
                    $scope.webLinkTitle = returnTitle;
		}
                
            }
            else{
                $scope.webLinkTitle = '';
		var returnTitle = '';
		if( oEmbedApi && url ){
                    /*
                    $http.defaults.headers.put = {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    };
                    */
                    //$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                    //$http.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                    //$http.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With';
                    //$http.defaults.headers.common['X-Random-Shit':'123123123';
                    $http.get(oEmbedApi+'?url='+url+'&format=json').then(function (data, status, headers, config) {
                            if (data){
                                    console.log("if data = ",data);
                                    if(data.title){
                                            $scope.webLinkTitle = data.title;
                                            $scope.link.thumbnail = data.thumbnail_url;
                                    }
                                    else{
                                            console.log("data.data.title = ",data.title);
                                    }
                            }
                            else{
                                    console.log("else data = ",data);
                            }				
                    })
		}else{
                    console.log("oEmbedApi && url = ",oEmbedApi+"---------"+url);
                    $scope.webLinkTitle = returnTitle;
		}
                
            }
		
	}
	
	
	function saveLinkData(pageId){
            if(pageId != null){
                //alert("thumbnail = "+$scope.link.thumbnail+" , ----content = "+$scope.link.content);
		if ($scope.link.content!="") {
                    var fields={};

                    fields.content=$scope.link.content
                    if($scope.link.Prompt){
                        fields.Prompt = $scope.link.Prompt;	
                    }

                    if($scope.link.Title){
                        fields.Title = $scope.link.Title;	
                    }

                    //added on 24122014 by manishp embedded link thumbnail case.
                    var thumbnail = '';
                    if($scope.link.thumbnail){
                        thumbnail = $scope.link.thumbnail;
                        if( $scope.link.type == 'image' ){
                            fields.linkType = $scope.link.type;
                        }
                    }
                    fields.thumbnail=$scope.link.thumbnail;
                    //End added on 24122014 by manishp embedded link thumbnail case.


                    $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                        if(data.data.code==200){
                            //$scope.setFlash('Link added successfully.' , 'success');
                            $scope.uploadedLink=data.data.response;
                            $('#'+pageId+' .link_upload_themes').trigger('click');
                            $('#overlay2').hide();
                            $('#overlayContent2').hide();

                            // Code to show image in block after drag drog - 26-11-2014@Swapnesh
                            $('#'+pageId+' .link_holder').html($scope.link.content);
                            $scope.link.type = "";

                            $('#'+pageId+' .link_holder').children().css('width',$('#'+pageId+' .link_holder').width()+'px');
                        }
                    });


                    //$('.link_holder').first().height='100%';
		}
		return false;
                
            }
            else{
                //alert("thumbnail = "+$scope.link.thumbnail+" , ----content = "+$scope.link.content);
		if ($scope.link.content!="") {
			var fields={};
			
			fields.content=$scope.link.content
			if($scope.link.Prompt){
				fields.Prompt = $scope.link.Prompt;	
			}
			
			if($scope.link.Title){
				fields.Title = $scope.link.Title;	
			}
			
			//added on 24122014 by manishp embedded link thumbnail case.
			var thumbnail = '';
			if($scope.link.thumbnail){
				thumbnail = $scope.link.thumbnail;
				if( $scope.link.type == 'image' ){
					fields.linkType = $scope.link.type;
				}
			}
			fields.thumbnail=$scope.link.thumbnail;
			//End added on 24122014 by manishp embedded link thumbnail case.
			
			
			$http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
				if(data.data.code==200){
					//$scope.setFlash('Link added successfully.' , 'success');
					$scope.uploadedLink=data.data.response;
					$('.link_upload_themes').trigger('click');
					$('#overlay2').hide();
					$('#overlayContent2').hide();
					
					// Code to show image in block after drag drog - 26-11-2014@Swapnesh
					$('.link_holder').html($scope.link.content);
					$scope.link.type = "";

					$('.link_holder').children().css('width',$('.link_holder').width()+'px');
				}
			});
			
			
			//$('.link_holder').first().height='100%';
		}
		return false;
                
            }
	}
	
	$scope.get__oEmbedHtmlContent = function(result , url , pageId){
            if(pageId != null){
                var html_content = '';
		
		$scope.__getDesciptors(result);
		//alert(JSON.stringify(result));
		//alert(result.type.toUpperCase());
		//try(){
		if ( result.type ) {
			switch(result.type.toUpperCase()){
				case 'PHOTO' :
                                    html_content = '<img src="'+result.url+'" alt="image" />';
                                    break;
				
				case 'VIDEO' :
					html_content = result.html;
					break;
					
				case 'AUDIO' :
					html_content = result.html;
					break;
					
				case 'RICH' :
					html_content = result.html;
					break;
				
				case 'LINK' : 
					html_content = '<a href="'+url+'" alt='+result.title+' title='+result.title+'>'+result.title+'</a>';
					if(result.thumbnail_url){
						html_content += '<img src="'+result.thumbnail_url+'" alt="image" />';
					}
					break;
				
				default:
					html_content = result.html;
					break;
				
			}
		}
		//}catch(e){}
		return html_content;
                
            }
            else{
                var html_content = '';
		
		$scope.__getDesciptors(result);
		//alert(JSON.stringify(result));
		//alert(result.type.toUpperCase());
		//try(){
		if ( result.type ) {
			switch(result.type.toUpperCase()){
				case 'PHOTO' :
					html_content = '<img src="'+result.url+'" alt="image" />';
					break;
				
				case 'VIDEO' :
					html_content = result.html;
					break;
					
				case 'AUDIO' :
					html_content = result.html;
					break;
					
				case 'RICH' :
					html_content = result.html;
					break;
				
				case 'LINK' : 
					html_content = '<a href="'+url+'" alt='+result.title+' title='+result.title+'>'+result.title+'</a>';
					if(result.thumbnail_url){
						html_content += '<img src="'+result.thumbnail_url+'" alt="image" />';
					}
					break;
				
				default:
					html_content = result.html;
					break;
				
			}
		}
		//}catch(e){}
		return html_content;
                
            }
	}
	
	
	$scope.addTags=function(isValid , pageId){
            if(pageId != null){
                console.log($scope.notes);
		if ($scope.uploadedMedia._id && $scope.media.mmt && $scope.media.isPrivate) {
                    $('#overlay2').show();
                    $('#overlayContent2').show();
                    //$scope.media.gt=$scope.selectedgt;
                    $scope.media.gt='';
                    //$scope.media.gtsa=$scope.selectedgtsa;
                    $scope.media.gtsa='';
                    $scope.media.Action='Post';
                    $scope.media.MediaID=$scope.uploadedMedia._id;
                    $scope.media.data={};
                    $scope.media.board=$scope.page_id;
                    $scope.media.data=$scope.uploadedMedia;        
                    if ($('#'+pageId+' #tag-Input-Token').val() != '') {
                        $scope.media.Tags=$('#'+pageId+' #tag-Input-Token').val();
                    }
                    $http.post('/media/addTagsToUploadedMedia',$scope.media).then(function (data, status, headers, config) {
                        $('#'+pageId+' .ui-dialog-titlebar-close').trigger('click');
                        $scope.setFlashInstant('Media added successfully!' , 'success');
                        $scope.uploadedMedia={}; 
                        //$scope.changePT();
                        setTimeout(function(){
                            $('#overlay2').hide();
                            $('#overlayContent2').hide();
                            if (data.data.response[0] != undefined && data.data.response[0] != null) {
                                $scope.addtoTray_uploadCase(data.data.response[0] , pageId);	
                            }
                        },1000)
                   });
                }
                else if($scope.uploadedLink._id && $scope.link.mmt && $scope.link.isPrivate){
                    $('#overlay2').show();
                    $('#overlayContent2').show();
                    console.log($scope.uploadedLink);
                    $scope.link.gt=$scope.selectedgt;
                    $scope.link.gtsa=$scope.selectedgtsa;
                    $scope.link.Action='Post';
                    if ($('#'+pageId+' #tag-Input-Token2').val()!='') {
                        $scope.link.Tags=$('#'+pageId+' #tag-Input-Token2').val();
                    }
                    $scope.link.MediaID=$scope.uploadedLink._id;
                    $scope.link.data={};
                    $scope.link.board=$scope.page_id;
                    $scope.link.data=$scope.uploadedLink;        
                    $http.post('/media/addTagsToUploadedMedia',$scope.link).then(function (data, status, headers, config) {
                        $('#'+pageId+' .ui-dialog-titlebar-close').trigger('click');
                        //__update_descriptors_object();
                        setTimeout(function(){
                            $('#overlay2').hide();
                            $('#overlayContent2').hide();
                            if ($scope.uploadedLink.ContentType == "Montage") {
                                $scope.setFlashInstant('Media posted into the Board' , 'success');
                                $scope.init__Discuss(pageId);
                                $scope.close_holderAct(pageId);
                            }else{
                                /*if ( $scope.del_grid_noteCase == true ) {
                                        $scope.setMediaIdd_uploadCase(data.data.response[0]);
                                }else */
                                if ($scope.uploadedLink.ContentType == "Notes") {
                                    if ($scope.notes.isAnsNote == true) {
                                        $scope.setFlashInstant('Your answer/note has been added into the media tray!' , 'success');
                                        $('#'+pageId+' .ansr-box-inr').text(' ');
                                        setTimeout(function(){
                                            $scope.answerText='Start typing and click on the keywords OR drop any media from the web or your drive.';
                                            $('#'+pageId+' .ansr-box-inr').text('Start typing and click on the keywords OR drop any media from the web or your drive.');
                                            $scope.$apply()
                                        },500)
                                    }else{
                                        $scope.setFlashInstant('Media added successfully!' , 'success');
                                    }
                                    $scope.addtoTray_uploadCase(data.data.response[0] , pageId);
                                }
                                else if (data.data.response[0] != undefined && data.data.response[0] != null) {
                                    $scope.addtoTray_uploadCase(data.data.response[0] , pageId);
                                    $scope.setFlashInstant('Media added successfully!' , 'success');
                                    $scope.close_holderAct(pageId);	
                                }	
                            }
                            $scope.uploadedLink={}; 
                        },1000)
                    });
                }
		else{
		}
		$('#'+pageId+' #dialog1').css({'display':'block'});
                
            }
            else{
                console.log($scope.notes);
		if ($scope.uploadedMedia._id && $scope.media.mmt && $scope.media.isPrivate) {
                    $('#overlay2').show();
                    $('#overlayContent2').show();
                    //$scope.media.gt=$scope.selectedgt;
                    $scope.media.gt='';
                    //$scope.media.gtsa=$scope.selectedgtsa;
                    $scope.media.gtsa='';
                    $scope.media.Action='Post';
                    $scope.media.MediaID=$scope.uploadedMedia._id;
                    $scope.media.data={};
                    $scope.media.board=$scope.page_id;
                    $scope.media.data=$scope.uploadedMedia;        
                    if ($('#tag-Input-Token').val() != '') {
                            $scope.media.Tags=$('#tag-Input-Token').val();
                    }
                    $http.post('/media/addTagsToUploadedMedia',$scope.media).then(function (data, status, headers, config) {
                        $('.ui-dialog-titlebar-close').trigger('click');
                            $scope.setFlashInstant('Media added successfully!' , 'success');
                            $scope.uploadedMedia={}; 
                            //$scope.changePT();
                            setTimeout(function(){
                                    $('#overlay2').hide();
                                    $('#overlayContent2').hide();
                                    if (data.data.response[0] != undefined && data.data.response[0] != null) {
                                            $scope.addtoTray_uploadCase(data.data.response[0]);	
                                    }
                            },1000)
                    });
                }
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
                        $scope.link.MediaID=$scope.uploadedLink._id;
                        $scope.link.data={};
                        $scope.link.board=$scope.page_id;
                        $scope.link.data=$scope.uploadedLink;        
                        $http.post('/media/addTagsToUploadedMedia',$scope.link).then(function (data, status, headers, config) {
                            $('.ui-dialog-titlebar-close').trigger('click');
                            //__update_descriptors_object();
                            setTimeout(function(){
                                $('#overlay2').hide();
                                $('#overlayContent2').hide();
                                if ($scope.uploadedLink.ContentType == "Montage") {
                                        $scope.setFlashInstant('Media posted into the Board' , 'success');
                                        $scope.init__Discuss();
                                        $scope.close_holderAct();
                                }else{
                                        /*if ( $scope.del_grid_noteCase == true ) {
                                                $scope.setMediaIdd_uploadCase(data.data.response[0]);
                                        }else */if ($scope.uploadedLink.ContentType == "Notes") {
                                                if ($scope.notes.isAnsNote == true) {
                                                        $scope.setFlashInstant('Your answer/note has been added into the media tray!' , 'success');
                                                        $('.ansr-box-inr').text(' ');
                                                        setTimeout(function(){
                                                                $scope.answerText='Start typing and click on the keywords OR drop any media from the web or your drive.';
                                                                $('.ansr-box-inr').text('Start typing and click on the keywords OR drop any media from the web or your drive.');
                                                                $scope.$apply()
                                                        },500)
                                                }else{
                                                        $scope.setFlashInstant('Media added successfully!' , 'success');
                                                }
                                                $scope.addtoTray_uploadCase(data.data.response[0]);
                                        }
                                        else if (data.data.response[0] != undefined && data.data.response[0] != null) {
                                                $scope.addtoTray_uploadCase(data.data.response[0]);
                                                $scope.setFlashInstant('Media added successfully!' , 'success');
                                                $scope.close_holderAct();	
                                        }	
                                }
                                $scope.uploadedLink={}; 
                        },1000)
                    });
                }
		else{
		}
		$('#dialog1').css({'display':'block'});
                
            }
	}
	
/*________________________________________________________________________
* @Date:      	23 April 2015
* @Method :   	post_noteToBoard
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to Post note to media table
* @Param:     	-
* @Return:    	yes
_________________________________________________________________________
*/
    $scope.post_noteToBoard = function(pageId){
        if(pageId != null){
            $('#'+pageId+' .edit_froala3').css({'padding':'15px'});
            $('#'+pageId+' .edit_froala3').html2canvas({
                useCORS:true,
                onrendered: function (canvas) {  
                    var imgsrc = canvas.toDataURL("image/png");
                    var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
                    fields = {
                        image: base64Data,
                    };
                    /*--thumbnail upload--*/
                    $http.post('/media/note_screenshot',fields).then(function (data, status, headers, config) {
                        if(data.data.code==200){
                            console.log("-------note_screenshot--done--------");
                            var link = data.data.link;
                            link = link.split('/');
                            var final_thumb =  link[link.length -1];
                            $scope.notes={};
                            var obj = angular.element('<div>'+$('#'+pageId+' .edit_froala3').editable('getHTML', true, true)+'</div>');
                            obj.find('a').attr('target','_blank');
                            $scope.notes.comment = obj.html();
                            $scope.notes.thumbnail = final_thumb;
                            //*********** code from $scope.checknotes in upload media controller
                            if ($scope.countOfTrayMedia <15) {
                                $('#'+pageId+' #dialog1').css({'display':'none'});
                                $scope.link.isPrivate = 1;
                                $scope.link.mmt = '5464931fde9f6868484be3d7';
                                $('#'+pageId+" #token-input-tag-Input-Token").addClass('keyword-search bx-sz');
                                $('#'+pageId+" #token-input-tag-Input-Token").attr('placeholder','Label your media');
                                $('#'+pageId+" #token-input-tag-Input-Token").val('');
                                if($scope.notes.comment==''||$scope.notes.comment==undefined || $scope.notes.comment == "<p>Start writing...</p>" || $scope.notes.comment ==  '<p class="fr-tag">Start writing...</p>') {
                                    alert('please enter valid text/media');return;
                                }else{
                                    if ($scope.notes.comment!="<p><br></p>" && $scope.notes.comment!="" ) {
                                        var fields={};
                                        fields.content = $scope.notes.comment;
                                        fields.type = 'Notes';
                                        fields.thumbnail = $scope.notes.thumbnail;
                                        $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                                            if(data.data.code==200){
                                                $scope.uploadedLink=data.data.response;
                                                var initial_url='/assets/Media/img/600/'+fields.thumbnail;
                                                $scope.addTags(pageId);
                                            }
                                        });            
                                    }
                                }
                            }else{
                                $('#'+pageId+" #media_tray_full_pop").show();
                            }
                            //************************ END
                            $scope.close_noteBoardCase(pageId);
                        }
                    });	
                    /*-----*/
                }
            });
            setTimeout(function(){
                $('#'+pageId+' .edit_froala3').css({'padding':'0px'});
                //$('.edit_froala3').css({'border': 'none'});
            },6000)
            
        }
        else{
            $('.edit_froala3').css({'padding':'15px'});
            $('.edit_froala3').html2canvas({
                useCORS:true,
                onrendered: function (canvas) {  
                    var imgsrc = canvas.toDataURL("image/png");
                    var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
                    fields = {
                        image: base64Data,
                    };
                    /*--thumbnail upload--*/
                    $http.post('/media/note_screenshot',fields).then(function (data, status, headers, config) {
                        if(data.data.code==200){
                            console.log("-------note_screenshot--done--------");
                            var link = data.data.link;
                            link = link.split('/');
                            var final_thumb =  link[link.length -1];
                            $scope.notes={};
                            var obj = angular.element('<div>'+$('.edit_froala3').editable('getHTML', true, true)+'</div>');
                            obj.find('a').attr('target','_blank');
                            $scope.notes.comment = obj.html();
                            $scope.notes.thumbnail = final_thumb;
                            //*********** code from $scope.checknotes in upload media controller
                            if ($scope.countOfTrayMedia <15) {
                                $('#dialog1').css({'display':'none'});
                                $scope.link.isPrivate = 1;
                                $scope.link.mmt = '5464931fde9f6868484be3d7';
                                $("#token-input-tag-Input-Token").addClass('keyword-search bx-sz');
                                $("#token-input-tag-Input-Token").attr('placeholder','Label your media');
                                $("#token-input-tag-Input-Token").val('');
                                if($scope.notes.comment==''||$scope.notes.comment==undefined || $scope.notes.comment == "<p>Start writing...</p>" || $scope.notes.comment ==  '<p class="fr-tag">Start writing...</p>') {
                                    alert('please enter valid text/media');return;
                                }else{
                                    if ($scope.notes.comment!="<p><br></p>" && $scope.notes.comment!="" ) {
                                        var fields={};
                                        fields.content = $scope.notes.comment;
                                        fields.type = 'Notes';
                                        fields.thumbnail = $scope.notes.thumbnail;
                                        $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                                            if(data.data.code==200){
                                                $scope.uploadedLink=data.data.response;
                                                var initial_url='/assets/Media/img/600/'+fields.thumbnail;
                                                $scope.addTags();
                                            }
                                        });            
                                    }
                                }
                            }else{
                                $("#media_tray_full_pop").show();
                            }
                            //************************ END
                            $scope.close_noteBoardCase();
                        }
                    });	
                    /*-----*/
                }
            });
            setTimeout(function(){
                $('.edit_froala3').css({'padding':'0px'});
                //$('.edit_froala3').css({'border': 'none'});
            },6000)
            
        }
    }
/********************************************END*********************************************/

/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	post_ansNote
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to post anwer of user to page as note.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.post_ansNote = function(pageId){
        if(pageId != null){
            if($scope.answerText==''||$scope.answerText==undefined || $scope.answerText == "Start typing and click on the keywords OR drop any media from the web or your drive." ) {
                alert('please enter valid text/media');return;
            }else{
                $('#'+pageId+' #ans_screen').html('<p>'+$scope.answerText+'</p>');
                console.log($('#'+pageId+' #ans_screen').html());
                //$('#ans_screen').height(50);
                $('#'+pageId+' #note_forAnswer').slideDown();
                $('#'+pageId+' #ans_screen').css({'padding':'15px'});
                $('#'+pageId+' #ans_screen').html2canvas({
                    useCORS:true,
                    onrendered: function (canvas) {  
                        var imgsrc = canvas.toDataURL("image/png");
                        var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
                        fields = {
                            image: base64Data,
                        };
                        $('#'+pageId+' #note_forAnswer').slideUp('slow');
                        /*--thumbnail upload--*/
                        $http.post('/media/note_screenshot',fields).then(function (data, status, headers, config) {
                            if(data.data.code==200){
                                console.log("-------note_screenshot--done--------");
                                var link = data.data.link;
                                link = link.split('/');
                                var final_thumb =  link[link.length -1];
                                $scope.notes={};
                                var obj = angular.element('<div>'+$('#'+pageId+' #ans_screen').text()+'</div>');
                                obj.find('a').attr('target','_blank');
                                $scope.notes.comment = obj.html();
                                $scope.notes.thumbnail = final_thumb;
                                $scope.notes.isAnsNote = true;
                                //*********** code from $scope.checknotes in upload media controller
                                if ($scope.countOfTrayMedia <15) {
                                    $('#'+pageId+' #dialog1').css({'display':'none'});
                                    $scope.link.isPrivate = 1;
                                    $scope.link.mmt = '5464931fde9f6868484be3d7';
                                    $('#'+pageId+" #token-input-tag-Input-Token").addClass('keyword-search bx-sz');
                                    $('#'+pageId+" #token-input-tag-Input-Token").attr('placeholder','Label your media');
                                    $('#'+pageId+" #token-input-tag-Input-Token").val('');
                                    if($scope.notes.comment==''||$scope.notes.comment==undefined || $scope.notes.comment == "Start typing and click on the keywords OR drop any media from the web or your drive." ) {
                                        alert('please enter valid text/media');return;
                                    }else{
                                        if ($scope.notes.comment!="<p><br></p>" && $scope.notes.comment!="" ) {
                                            var fields={};
                                            fields.content = $scope.notes.comment;
                                            fields.type = 'Notes';
                                            fields.thumbnail = $scope.notes.thumbnail;
                                            $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                                                if(data.data.code==200){
                                                    $scope.uploadedLink=data.data.response;
                                                    var initial_url='/assets/Media/img/600/'+fields.thumbnail;
                                                    $scope.addTags(pageId);

                                                }
                                            });            
                                        }
                                    }
                                }else{
                                        $('#'+pageId+" #media_tray_full_pop").show();
                                }
                                //************************ END
                                $scope.close_noteBoardCase(pageId);
                            }
                        });	
                        /*-----*/
                    }
                });
                setTimeout(function(){
                    $('#'+pageId+' #ans_screen').css({'padding':'0px'});
                },6000)
            }
            
        }
        else{
            if($scope.answerText==''||$scope.answerText==undefined || $scope.answerText == "Start typing and click on the keywords OR drop any media from the web or your drive." ) {
                alert('please enter valid text/media');return;
            }else{
                $('#ans_screen').html('<p>'+$scope.answerText+'</p>');
                console.log($('#ans_screen').html());
                //$('#ans_screen').height(50);
                $('#note_forAnswer').slideDown();
                $('#ans_screen').css({'padding':'15px'});
                $('#ans_screen').html2canvas({
                    useCORS:true,
                    onrendered: function (canvas) {  
                        var imgsrc = canvas.toDataURL("image/png");
                        var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
                        fields = {
                                image: base64Data,
                        };
                        $('#note_forAnswer').slideUp('slow');
                        /*--thumbnail upload--*/
                        $http.post('/media/note_screenshot',fields).then(function (data, status, headers, config) {
                                if(data.data.code==200){
                                        console.log("-------note_screenshot--done--------");
                                        var link = data.data.link;
                                        link = link.split('/');
                                        var final_thumb =  link[link.length -1];
                                        $scope.notes={};
                                        var obj = angular.element('<div>'+$('#ans_screen').text()+'</div>');
                                        obj.find('a').attr('target','_blank');
                                        $scope.notes.comment = obj.html();
                                        $scope.notes.thumbnail = final_thumb;
                                        $scope.notes.isAnsNote = true;
                                        //*********** code from $scope.checknotes in upload media controller
                                        if ($scope.countOfTrayMedia <15) {
                                                $('#dialog1').css({'display':'none'});
                                                $scope.link.isPrivate = 1;
                                                $scope.link.mmt = '5464931fde9f6868484be3d7';
                                                $("#token-input-tag-Input-Token").addClass('keyword-search bx-sz');
                                                $("#token-input-tag-Input-Token").attr('placeholder','Label your media');
                                                $("#token-input-tag-Input-Token").val('');
                                                if($scope.notes.comment==''||$scope.notes.comment==undefined || $scope.notes.comment == "Start typing and click on the keywords OR drop any media from the web or your drive." ) {
                                                        alert('please enter valid text/media');return;
                                                }else{
                                                        if ($scope.notes.comment!="<p><br></p>" && $scope.notes.comment!="" ) {
                                                                var fields={};
                                                                fields.content = $scope.notes.comment;
                                                                fields.type = 'Notes';
                                                                fields.thumbnail = $scope.notes.thumbnail;
                                                                $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                                                                        if(data.data.code==200){
                                                                                $scope.uploadedLink=data.data.response;
                                                                                var initial_url='/assets/Media/img/600/'+fields.thumbnail;
                                                                                $scope.addTags();

                                                                        }
                                                                });            
                                                        }
                                                }
                                        }else{
                                                $("#media_tray_full_pop").show();
                                        }
                                        //************************ END
                                        $scope.close_noteBoardCase();
                                }
                        });	
                        /*-----*/
                    }
                });
                setTimeout(function(){
                    $('#ans_screen').css({'padding':'0px'});
                },6000)
            }
        }
			
    }
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	20 July 2015
* @Method :   	onHeaderSelect
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	Action : Upload Header Image
* @Param:     	1
* @Return:    	no
_________________________________________________________________________
*/
	$scope.onHeaderSelect = function($files , pageId) {
            if(pageId != null){
                $('#overlay2').show()
		$('#overlayContent2').show()
		//var val = $("#headerUpload").val();
		var val = $('#'+pageId+' #search_gallery_elements').css('display')=='block' ? $('#'+pageId+" #headerUpload_search").val() : $('#'+pageId+" #headerUpload_discuss").val() ;
		if (!val.match(/(?:gif|jpg|png|bmp)$/)) {
			$scope.setFlashInstant('<span style="color:red">Selected file is not an image. Please select an image file to proceed.</span>' , 'success');
		}else{
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

                            $scope.startHeader(i , pageId);
				   
			}
		}
                
            }
            else{
                $('#overlay2').show()
		$('#overlayContent2').show()
		//var val = $("#headerUpload").val();
		var val = $('#search_gallery_elements').css('display')=='block' ? $("#headerUpload_search").val() : $("#headerUpload_discuss").val() ;
		if (!val.match(/(?:gif|jpg|png|bmp)$/)) {
			$scope.setFlashInstant('<span style="color:red">Selected file is not an image. Please select an image file to proceed.</span>' , 'success');
		}else{
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
		}
                
            }
		
	};

	$scope.headerstyle="";
	
	$scope.startHeader = function(index , pageId) {
            if(pageId != null){
                $('#'+pageId+' .loader_overlay_full').show();
		$('#'+pageId+' .loader_img_overlay_full').show();	
		
		$scope.disablebtn=true;
		$scope.progress[index] = 0;
		$scope.errorMsg = null;
		$scope.upload[index] = $upload.upload({
                    url : '/boards/uploadHeader?id='+$scope.page_id,
                    method: $scope.httpMethod,
                    headers: {'my-header': 'my-header-value'},
                    data : {
                            id : $scope.page_id
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
                    setTimeout(function(){
                        $('#overlay2').hide()
                        $('#overlayContent2').hide()			
                    },1000)
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
                        $scope.headerImg="../assets/Media/headers/aspectfit/"+data.result.HeaderImage;
                        $scope.setFlashInstant('Header image changed successfully.' , 'success');
                        //$('.upload').trigger('click');                                    
                    }
                    else{
                        $scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
                    }		
		});
                
            }
            else{
                $('.loader_overlay_full').show();
		$('.loader_img_overlay_full').show();	
		
		$scope.disablebtn=true;
		$scope.progress[index] = 0;
		$scope.errorMsg = null;
		$scope.upload[index] = $upload.upload({
			url : '/boards/uploadHeader?id='+$scope.page_id,
			method: $scope.httpMethod,
			headers: {'my-header': 'my-header-value'},
			data : {
				id : $scope.page_id
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
			setTimeout(function(){
				$('#overlay2').hide()
				$('#overlayContent2').hide()			
			},1000)
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
				$scope.headerImg="../assets/Media/headers/aspectfit/"+data.result.HeaderImage;
				$scope.setFlashInstant('Header image changed successfully.' , 'success');
				//$('.upload').trigger('click');                                    
			}
			else{
				$scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
			}		
		});
                
            }
	};
/********************************************END*********************************************/




	$scope.checkTray = function(pageId){
            if(pageId != null){
                if ($scope.countOfTrayMedia < 15) {
			
		}else{
                    $('#'+pageId+" #media_tray_full_pop").show();
                    setTimeout(function(){
                        $('#'+pageId+' .ui-dialog-titlebar-close').trigger('click');
                    },1)
		}
            }
            else{
                if ($scope.countOfTrayMedia < 15) {
			
		}else{
                    $("#media_tray_full_pop").show();
                    setTimeout(function(){
                            $('.ui-dialog-titlebar-close').trigger('click');
                    },1)
		}
                
            }
	}

}]);