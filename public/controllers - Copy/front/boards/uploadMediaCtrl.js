var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('uploadMediaCtrl',function($scope,$rootScope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile , $controller){    
    $controller('uploadLinkEngine',{$scope : $scope });
	/*
	 *
	 *	Action : write Note Done - Add Note in the board*
	 *
	 *
	*/
	$scope.checknotes = function(){
		if ($('#media-tray-elements').find('li').length <15) {
			//alert($scope.notes.comment);
			$("#token-input-tag-Input-Token").addClass('keyword-search bx-sz');
			$("#token-input-tag-Input-Token").attr('placeholder','Label your media');
			$("#token-input-tag-Input-Token").val('');
			if($scope.notes.comment==''||$scope.notes.comment==undefined) {
				//code
			}else{
				//console.log($scope.notes.comment);
				if ($scope.notes.comment!="<p><br></p>" && $scope.notes.comment!="") {
					var fields={};
					fields.content=$scope.notes.comment;
					fields.type='Notes';
					$http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
						if(data.data.code==200){
							//$scope.setFlash('Link added successfully.' , 'success');
							$scope.uploadedLink=data.data.response;
							$('.link_upload_themes').trigger('click');
							$('.link_holder').html($scope.notes.comment);            
							$('.link_holder').children().css('width',$('.link_holder').width()+'px');
						}
					});            
				}
			}
			return false;
		}else{
			$("#media_tray_full_pop").show();
		}
		
    }
	
	/*
		Action : upload media from hard drive
	
	*/
	$scope.onFileSelect = function($files) {
		if ($('#media-tray-elements').find('li').length <15) {
			$('#overlay2').show();
			$('#overlayContent2').show();
	
            console.log("$files = ",$files);
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
		}else{
			$("#media_tray_full_pop").show();
		}
	};
	
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
	};
	
	//Add Link to Board 
	/*
	$scope.uploadLink=function(){
		var url = $scope.link.content;
		if( url.match(/youtube.com/gi) != null ) {
		  // Code for Youttube
		  var op = url.split(/[=]+/).pop();
		  //alert("Youtube video id: " + op);
		  var youtubeIframe = '<iframe width="560" height="315" src="//www.youtube.com/embed/'+op+'?autohide=1&fs=1&rel=0&hd=1&wmode=opaque" frameborder="0" allowfullscreen></iframe>';
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
		  return false;
		}
	    
        if ($scope.link.content!="") {
            var fields={};
            
            fields.content=$scope.link.content
            
            $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                if(data.data.code==200){
					//$scope.setFlash('Link added successfully.' , 'success');
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
	*/
	//updated on 24122014 by manishp- from swapneshk 25112014 code
	$scope.link={};
    $scope.uploadedLink={};
	
	$scope.uploadLink_old=function(){
		$scope.uploadedMedia={}; //added on 07012015 by manishp : resolved link after h/d image upload issue
		var url = $scope.link.content;
		
		if( (url.match(/youtube.com/gi) != null) ){
			var youtube_url = '';
			if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) == null ) {
				// Code for Youttube
				var op = url.split(/[=]+/).pop();
				//alert("Youtube video id: " + op);
				var youtubeIframe = '<iframe width="560" height="315" src="//www.youtube.com/embed/'+op+'?autohide=1&fs=1&rel=0&hd=1&wmode=opaque" frameborder="0" allowfullscreen></iframe>';
				$scope.link.content = youtubeIframe;
				
				//getting thumbnail
				if( url.match(/youtube.com/gi) != null ){
					$scope.link.thumbnail = '';
					youtube_url = url;
					console.log("youtube_url = ",youtube_url);
					$scope.link.thumbnail = $scope.youtube_thumb(youtube_url);
					console.log("Got thumbnail from youtube drag-drop = ",$scope.link.thumbnail);
					saveLinkData();
				}
			}
			else if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null ) {
				//alert("Youtube IFRAME case Found here---");//return false;
				//alert("IFRAME case");
				$scope.link.thumbnail = '';
				youtube_url = url;
				console.log("youtube_url = ",youtube_url);
				$scope.link.thumbnail = $scope.youtube_thumb(youtube_url);
				console.log("Got thumbnail from youtube IFRAME = ",$scope.link.thumbnail);
				saveLinkData();
			}
			else{
				alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
			}
		} 
		else if( (url.match(/vimeo.com/gi) != null) ){ 
			var vimeo_url = '';
			if(url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) == null) {
				//alert("iframe == null")
				// code for Vimeo
				var op = url.split(/[/]+/).pop();
				varvimeoIframe = '<iframe src="//player.vimeo.com/video/'+ op +'?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=ff0179" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
				$scope.link.content = varvimeoIframe;
				
				//getting thumbnail
				if( url.match(/vimeo.com/gi) != null ){
					$scope.link.thumbnail = '';
					vimeo_url = url;
					console.log("vimeo_url = ",vimeo_url);
					$scope.vimeo_thumb(vimeo_url);
					console.log("Got thumbnail from youtube drag-drop = ",$scope.link.thumbnail);
				}
				else{
					alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
				}
				
			}
			else if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null ) {
				alert("iframe != null")
				$scope.link.thumbnail = '';
				var srcUrl = '';
				//get src of the vimeo iframe
				var res = url.split("src=");
				var res2 = res[1].split('"');
				srcUrl = res2[1]
				vimeo_url = srcUrl;
				$scope.vimeo_thumb(vimeo_url);
			}
			else{
				alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
			}
			
		}
		else {
		  
			// Code for another image handling from google 26-11-2014@Swapnesh
			var newData = url.split(".");
			var ext = newData[newData.length-1];
			if( ( "JPEG" === ext ) || ( "jpeg" === ext ) || ( "JPG" === ext ) || ( "jpg" === ext ) || ( "PNG" === ext ) || ( "png" === ext ) || ( "gif" === ext ) || ( "GIF" === ext ) ) {
				//alert("Any image link from web...");
				$scope.link.content = '<img src="'+url+'" alt="image" />';
				$scope.link.type = "image";
				
				$scope.link.thumbnail = '';
				$scope.link.thumbnail = url;
				saveLinkData()
			}
			else {
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
					alert("Please drag and drop videos from youtube.com, vimeo.com or web-images.");
					$("#capturetext").val("");
					return false;
				}
			}
		}
	    
    }
	
	$scope.uploadLink=function(){
		$scope.link.Title = "";
		$scope.link.Prompt = "";
		
		if ($('#media-tray-elements').find('li').length <15) {
			$scope.webLinkTitle = '';
			$scope.uploadedMedia={}; //added on 07012015 by manishp : resolved link after h/d image upload issue
			var input = $scope.link.content;
			var getOmbedProvider = {};
			//alert("input = "+input);
			var foundCase = $scope.find__initialCase( input );
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
							$scope.__UploadMediaCase( input );
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
	
	$scope.__UploadMediaCase = function ( url ) {
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
	
	$scope.__UploadOembedCase = function ( url ) {
		getOmbedProvider = oEmbeder.get__MatchedoEmbedProvider(url);
		if( !$.isEmptyObject( getOmbedProvider ) ){
			$scope.get__oEmbedObj( getOmbedProvider.ApiEndPoint , url )
		}
		else{
			alert("Did not find oEmbed specification for the given link!");
			return false;
		}
	}
	
	$scope.__UploadIframeCase = function ( url ) {
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
	
	$scope.get__oEmbedObj = function(oEmbedApi , url){
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
	
	/*
	//added on 30042015
	$scope.embedly__get__oEmbedObj = function( url ){
		var returnTitle = '';
		var key = "63953b23179d406d9c27ab937ea4fb5d";
		//var new_curl = "http://api.embed.ly/1/extract?key="+key+"&url="+url+"&format=json";
		
		var oEmbedApi = "http://api.embed.ly/1/extract";
		//alert("thumbnail before = "+$scope.link.thumbnail);
		if( oEmbedApi && url ){
			$http.get('/proxy/get_oembed?url='+oEmbedApi+"?key="+key+'&url='+url+'&format=json')
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
	*/
	
	/*
	$scope.get__oEmbedObj = function(oEmbedApi , url){
		alert("get__oEmbedObj called");
		var returnTitle = '';
		if( oEmbedApi && url ){
			
			
			$http.defaults.headers.put = {
				'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			};
			
			//$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			//$http.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
			//$http.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With';
            //$http.defaults.headers.common['X-Random-Shit':'123123123';
			//$http.defaults.headers.common['Origin'] = 'http://www.youtube.com';
			//$http.defaults.headers.common['Referer'] = '';
			//$httpProvider.defaults.headers.common['Accept'] = 'application/json';
			function appendTransform(defaults, transform) {

				// We can't guarantee that the default transformation is an array
				//defaults = angular.isArray(defaults) ? defaults : [defaults];
				defaults = angular.toJson(defaults);
				// Append the new transformation to the defaults
				return defaults.concat(transform);
			}
			
			//$http.defaults.headers.common['Content-Type'] = 'application/json';
			//makeCorsRequest(oEmbedApi+'?url='+url+'&format=json&callback=JSON_CALLBACK');
				
			$.ajax({

				  // The 'type' property sets the HTTP method.
				  // A value of 'PUT' or 'DELETE' will trigger a preflight request.
				  type: 'GET',

				  // The URL to make the request to.
				  //url: 'http://updates.html5rocks.com',
				  url : oEmbedApi+'?url='+url+'&format=json&callback=JSON_CALLBACK',
				  // The 'contentType' property sets the 'Content-Type' header.
				  // The JQuery default for this property is
				  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
				  // a preflight. If you set this value to anything other than
				  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
				  // you will trigger a preflight request.
				  contentType: 'text/plain',

				  xhrFields: {
					// The 'xhrFields' property sets additional fields on the XMLHttpRequest.
					// This can be used to set the 'withCredentials' property.
					// Set the value to 'true' if you'd like to pass cookies to the server.
					// If this is enabled, your server must respond with the header
					// 'Access-Control-Allow-Credentials: true'.
					withCredentials: false
				  },

				  headers: {
					// Set any custom headers here.
					// If you set any non-simple headers, your server must include these
					// headers in the 'Access-Control-Allow-Headers' response header.
					//'useXDomain':true,
					//'Access-Control-Allow-Headers':'*'
				  },

				  success: function() {
					// Here's where you handle a successful response.
					alert("success");
				  },

				  error: function() {
					// Here's where you handle an error response.
					// Note that if the error was due to a CORS issue,
					// this function will still fire, but there won't be any additional
					// information about the error.
					alert("error");
				  }
				});
			
			
			//url = "/media/get_oembed?url=http://chirb.it/oembed.json?url=http://chirb.it/OBnAr1&format=json";
			$http.get('/proxy/get_oembed?url='+oEmbedApi+'?url='+url+'&format=json')
				.success(function (data, status, headers, config) {
					console.log("data ",data);
					alert("success = "+JSON.stringify(data));
					$scope.link.content = data.data.html;
					$scope.link.thumbnail = data.data.thumbnail_url;
					saveLinkData()
				})
				.error(function (data, status, headers, config) {
					alert("error = "+status);
				});
			
		}else{
			console.log("oEmbedApi && url = ",oEmbedApi+"---------"+url);
			$scope.webLinkTitle = returnTitle;
		}
	}
	*/
	
	/*
	2.3.4. Response parameters
	Responses can specify a resource type, such as photo or video. Each type has specific parameters associated with it. The following response parameters are valid for all response types:

	type (required)
		The resource type. Valid values, along with value-specific parameters, are described below.
	version (required)
		The oEmbed version number. This must be 1.0.
	title (optional)
		A text title, describing the resource.
	author_name (optional)
		The name of the author/owner of the resource.
	author_url (optional)
		A URL for the author/owner of the resource.
	provider_name (optional)
		The name of the resource provider.
	provider_url (optional)
		The url of the resource provider.
	cache_age (optional)
		The suggested cache lifetime for this resource, in seconds. Consumers may choose to use this value or not.
	thumbnail_url (optional)
		A URL to a thumbnail image representing the resource. The thumbnail must respect any maxwidth and maxheight parameters. If this parameter is present, thumbnail_width and thumbnail_height must also be present.
	thumbnail_width (optional)
		The width of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_height must also be present.
	thumbnail_height (optional)
		The height of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_width must also be present. 
	*/
	
	$scope.get__oEmbedHtmlContent = function(result , url){
		var html_content = '';
		
		$scope.__getDesciptors(result);
		//alert(JSON.stringify(result));
		//alert(result.type.toUpperCase());
		//try(){
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
		//}catch(e){}
		return html_content;
	}
	
	function saveLinkData(){
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
	
	//End Add Link to Board
	
	//End Add Montage to Board
    
    $scope.uploadMontage=function(){
		$('.avatar-widget').css({'display':'block'}); //parul 14012015
		$('.avatarwdgt').css({'display':'block'});
        var fields={};
		var montage_canvas='';
        $("#media-icons").show(); //--26Dec show single & double media icon   
		var grid_data = $(".gridster_div").html();
		var grid_replace = grid_data.split('<a title="Setting" class="setting_gs closemedia pos-l-t" href="javascript:void(0);" onclick="montageObject.settingElem($(this))"><span class="m-icon settingicon"></span></a>');
		grid_replace = grid_replace.join("");
		grid_replace = grid_replace.split('<a title="Close" class="close_gs closemedia pos-r-t" href="javascript:void(0);" onclick="montageObject.deleteElem($(this))"><span class="m-icon closeicon"></span></a>');
		grid_replace = grid_replace.join("");
		
		$(".gridster_div").html(grid_replace);
		//--- html to canvas...
		$('.gridster_div').html2canvas({
			useCORS:true,
			onrendered: function (canvas) {  
				var imgsrc = canvas.toDataURL("image/png");
				var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
				
				fields.content=grid_replace;
				fields.type='Montage';
				$http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
					if(data.data.code==200){
						//$scope.setFlash('Link added successfully.' , 'success');
						$scope.uploadedLink=data.data.response;						
						$('.link_upload_themes').trigger('click');
						$('.link_holder').html(fields.content);            
						$('.link_holder').children().css('width',$('.link_holder').width()+'px');
						
						fields = {
							image: base64Data,
							montage_id: $scope.uploadedLink._id         
						};
						/*--thumbnail upload--*/
						$http.post('/media/updateMontage',fields).then(function (data, status, headers, config) {
							if(data.data.code==200){
								console.log("---updateMontage------------");
								//$scope.setFlash('Link added successfully.' , 'success');
								$scope.uploadedLink.thumbnail=data.data.thumbnail;
								$('.link_holder').html('<img src="../assets/Media/img/'+$scope.uploadedLink.thumbnail+'">');
								//console.log("---After override $scope.uploadedLink : ",$scope.uploadedLink);
								//$('.link_upload_themes').trigger('click');
								//$('.link_holder').html(fields.content);            
								//$('.link_holder').children().css('width',$('.link_holder').width()+'px');
							}
						});	
						/*-----*/
					}
				}); 				
				$(".gridster_div").empty();// empty gridster div  20Dec..		
			}
		}); 
            //$(".gridster_div").empty();// empty gridster div  20Dec..
        return false;
	}
	
	//End Add Montage to Board
	
	//Add Media from boards actions
	$scope.closeBoardMedia = function(){
        $scope.boardMedia=null
        $scope.boardsMedia=null
    }
    
    $scope.viewBoardsMedia =  function(){               
        $('.main-container-boards-index li').each(function(){
            $(this).height($(this).width())
        })

        $('.main-container-boards-index li a').each(function(){
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
        $scope.boardsMedia=1;  
    }
    
    $scope.boardsMedia=0;
    
    
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
		console.log(board);
		
        if ($('#'+board._id).attr('class')=='ng-scope backgroundaaa') {
            $('#'+board._id).removeClass('backgroundaaa');
        }
        else{
            $('#'+board._id).addClass('backgroundaaa');
			//if (board.MediaType == 'Montage') {
			//	$scope.setFlashInstant('You have selected a montage. It will be directly added to your board.' , 'success');
			//}
        }
        $scope.selectedMediaFromBoards=[];
        $('.backgroundaaa').each(function(){
            $scope.selectedMediaFromBoards.push($(this).attr('id'))
        })
        
    }
    
	//this function was used to add media from other boards to current board
	//now the functionality has changed and we are using  AddBoardsMediasToBoard_v_2 for the purpose
    $scope.AddBoardsMediasToBoard= function(){        
        $http.post('/addBoardMediaToBoard',{board:$scope.boardMedia._id,media:$scope.selectedMediaFromBoards,id:$stateParams.id,gt:$scope.selectedgt}).then(function (data, status, headers, config) {
			if (data.data.code==200) {
			$scope.setFlashInstant('Media added to board successfully!' , 'success');
			$scope.changePT();
			}
			else{
			$scope.changePT();
			}
		});
    }
	//end
	
	//parul 08042015
    $scope.AddBoardsMediasToBoard_v_2= function(){
		//console.log('--------------------')
		//console.log($scope.selectedMediaFromBoards);
		//return;
		if ($('#media-tray-elements').find('li').length < 15) {
			if ( ( $('#media-tray-elements').find('li').length + $scope.selectedMediaFromBoards.length ) <= 15) {
				//console.log($scope.selectedMediaFromBoards);
				for (i in $scope.selectedMediaFromBoards) {
					console.log('----------------'+i)
					$http.post('/media/getBoardMedia',{ID:$scope.selectedMediaFromBoards[i],boardId:$stateParams.id}).then(function(data){
						if (data.data.code == 200) {
							$scope.addtoTray_uploadCase(data.data.result[0]);
						}
						//console.log(data);
					})
				}
				setTimeout(function(){$('.ui-dialog-titlebar-close').trigger('click');},20);
			}else{
				$("#media_tray_full_board_pop").show();
			}
		}else{
			$("#media_tray_full_pop").show();
		}
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
	
	//End Add Media from boards actions
	$scope.ispriAlert=function(value){
		alert(value);
	}
	$scope.youtube_thumb = function (youtube_url){
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
	
    $scope.vimeo_thumb = function (vimeo_url) {
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
	
	//added on 11022015 : making dynamic The Ruins statement, currently for youtube.com only
	$scope.webLinkTitle = '';
	$scope.getWebLinkOembed = function(oEmbedApi , url){
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
	
	
	//parul 20012015
	
	$scope.changeProfilePic=function(){
		var file = $scope.myFile;
		if (file) {
			console.dir(file);
			var uploadUrl = "/user/fileUpload";
			var fd = new FormData();
			fd.append('file', file);
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			})
			.success(function(abc){
				console.log("value returned to service in success function = "+abc.filename);
				$rootScope.nameOfFile=abc.filename;
				var saveUrl="/user/saveFile";
				console.log('$rootScope.nameOfFile='+$rootScope.nameOfFile);
				setTimeout(function(){
					$http.post(saveUrl,{data : $rootScope.nameOfFile} ).success(function(abc){
						console.log(abc);
						$scope.userInfo=abc.data;
						$scope.getBoardData();
						$scope.changePT();
						$scope.setFlashInstant('Profile Picture changed successfully!' , 'success');
					});
				},2000);
			})
			.error(function(){
				console.log("failure");
				$scope.setFlashInstant('sorry!! An error occured while processing your request.' , 'success');
			});
		}
	}
	
	
	
	//testing javascript -xhr CORS
	// Create the XHR object.
	function createCORSRequest(method, url) {
	  var xhr = new XMLHttpRequest();
	  if ("withCredentials" in xhr) {
		// XHR for Chrome/Firefox/Opera/Safari.
		xhr.open(method, url, true);
	  } else if (typeof XDomainRequest != "undefined") {
		// XDomainRequest for IE.
		xhr = new XDomainRequest();
		xhr.open(method, url);
	  } else {
		// CORS not supported.
		xhr = null;
	  }
	  return xhr;
	}

	// Helper method to parse the title tag from the response.
	function getTitle(text) {
	  return text.match('<title>(.*)?</title>')[1];
	}

	// Make the actual CORS request.
	function makeCorsRequest(url) {
	  // All HTML5 Rocks properties support CORS.
	  var url = 'http://updates.html5rocks.com';

	  var xhr = createCORSRequest('GET', url);
	  if (!xhr) {
		alert('CORS not supported');
		return;
	  }

	  // Response handlers.
	  xhr.onload = function() {
		var text = xhr.responseText;
		var title = getTitle(text);
		alert('Response from CORS request to ' + url + ': ' + title);
	  };

	  xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	  };

	  xhr.send();
	}
	
	
});
