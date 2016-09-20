var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('recorderCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	/*
		Action : video/Audio Recording
	
	*/
	//parul 20032015========start
	$scope.isRecording =function(type){
		$scope.recordingMode=type;
		//alert($scope.recordingMode);
		$scope.setPageFlag('ST','Video');
		if ($scope.recordingMode == 'video') {
			var videoElement = document.querySelector('video');
			$('#btn-start-recording').show();
			btnStartRecording.disabled = false;
			$('#btn-stop-recording').hide();
			btnStopRecording.disabled = true;
		}
	}
	//parul 20032015========end
	
	
	//$('#recVideo').click(function(event){
	//	if ($('#media-tray-elements').find('li').length < 15) {
	//		//$('#popUpVideoTag').attr('')
	//		//$('#popUpVideoTag').removeProp('src');
	//		$('#popUpVideoTag').removeAttr('src');
	//		$('#popUpVideoTag').removeAttr('controls');
	//	}else{
	//		setTimeout(function(){$('.ui-dialog-titlebar-close').trigger('click');},50)
	//		$("#media_tray_full_pop").show();
	//	}
	//})
	//$('#recAudio').click(function(){
	//	//$('#popUpVideoTag').attr('')
	//	$('#popUpVideoTag').removeAttr('src');
	//	$('#popUpVideoTag').removeAttr('controls');
	//	})
	//
    function onStopRecording() {
		audioRecorder.getDataURL(function(audioDataURL) {
			var audio = {
				blob: audioRecorder.getBlob(),
				dataURL: audioDataURL
			};
			$scope.media.isPrivate=1;
			// if record both wav and webm
			if(!isRecordOnlyAudio) {
				videoRecorder.getDataURL(function(videoDataURL) {
					var video = {
						blob: videoRecorder.getBlob(),
						dataURL: videoDataURL
					};
					
					postFiles(audio, video);
				});
			}
			// if record only audio (either wav or ogg)
			if (isRecordOnlyAudio) postFiles(audio);
		});
    }
	
	function postFiles(audio, video) {
		// getting unique identifier for the file name
		fileName = generateRandomString();
		
		// this object is used to allow submitting multiple recorded blobs
		var files = { };

		// recorded audio blob
		files.audio = {
			name: fileName + '.' + audio.blob.type.split('/')[1],
			type: audio.blob.type,
			contents: audio.dataURL
		};
		
		if(video) {
			files.video = {
				name: fileName + '.' + video.blob.type.split('/')[1],
				type: video.blob.type,
				contents: video.dataURL
			};
		}
		console.log()
		files.uploadOnlyAudio = !video;

		videoElement.src = '';
		//videoElement.poster = '/assets/img/ajax-loader.gif';//commented by parul 06022015
		$('#loaderImg').css({'display':'block'});
		xhr('/recorder/uploadRecordedVideo', JSON.stringify(files), function(_fileName) {
			console.log(_fileName);
			fname=JSON.parse(_fileName);
			var href = location.href.substr(0, location.href.lastIndexOf('/') + 1);
			console.log(href + 'uploads/' + fname.Location[0]['URL'])
			$('#loaderImg').css({'display':'none'});//parul 06022015
			videoElement.src = '../assets/Media/video/' + fname.Location[0]['URL'];
			
			videoElement.poster = '';
			//videoElement.play();
			videoElement.muted = false;
			videoElement.controls = true;
			$scope.uploadedMedia=fname;
			$scope.media.isPrivate = 1;
		});
		
		if(mediaStream) mediaStream.stop();
	}
	
	// XHR2/FormData
	function xhr(url, data, callback) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				callback(request.responseText);
			}
		};
				
		request.upload.onprogress = function(event) {
			progressBar.max = event.total;
			progressBar.value = event.loaded;
			progressBar.innerHTML = 'Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%";
		};
				
		request.upload.onload = function() {
			percentage.style.display = 'none';
			progressBar.style.display = 'none';
		};
		request.open('POST', url);
		request.send(data);
	}

	// generating random string
	function generateRandomString() {
		if (window.crypto) {
			var a = window.crypto.getRandomValues(new Uint32Array(3)),
				token = '';
			for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
			return token;
		} else {
			return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
		}
	}
	

	var mediaStream = null;
	// reusable getUserMedia
	function captureUserMedia(success_callback) {
		var session = {
			audio: true,
			video: true
		};
		
		navigator.getUserMedia(session, success_callback, function(error) {
			//alert( error.message +" "+error.name );
			//if (error.message && error.name) {
			//	//alert(1);
			//	$scope.setFlashInstant('<span style="color:red">'+error.message +" "+error.name +'</span>', 'success');
			//}/*else if (error.message && error.name) {
			//	alert(2)
			//	$scope.setFlashInstant('<span style="color:red"> There is some problem with the recording device.</span>', 'success');
			//}*/
			//else{
			//	//alert(3);
			//	$scope.setFlashInstant('<span style="color:red">Please ensure you have attached microphone and camera to record the video.</span>', 'success');
			//}
			
			$scope.setFlashInstant('<span style="color:red">Please ensure you have attached microphone and camera to record the video.</span>', 'success');
			$('#btn-start-recording').show();
			$('#btn-start-recording').attr('disabled',false);
			$('#btn-stop-recording').hide();
			$('#btn-stop-recording').attr('disabled',true);
		});
	}

	$scope.startrecording = function() {
		$scope.uploadedMedia = {};
		$('#btn-start-recording').hide();
		$('.tohide').hide();
		$('#btn-stop-recording').show();
		btnStartRecording.disabled = true;
		
		captureUserMedia(function(stream) {
			//alert(1);
			mediaStream = stream;
			
			videoElement.src = window.URL.createObjectURL(stream);
			videoElement.play();
			videoElement.muted = true;
			videoElement.controls = false;
			
			// it is second parameter of the RecordRTC
			var audioConfig = {};
			if(!isRecordOnlyAudio) {
				audioConfig.onAudioProcessStarted = function() {
					// invoke video recorder in this callback
					// to get maximum sync
					videoRecorder.startRecording();
				};
			}
			
			audioRecorder = RecordRTC(stream, audioConfig);
			
			if(!isRecordOnlyAudio) {
				// it is second parameter of the RecordRTC
				var videoConfig = { type: 'video' };
				videoRecorder = RecordRTC(stream, videoConfig);
			}
			
			audioRecorder.startRecording();
			
			// enable stop-recording button
			btnStopRecording.disabled = false;
		});
	};

	//setTimeout(function(){
		//init_recorder();
	//},8000);
	
	//function init_recorder(){
		//alert("called after 8 second....");
		var btnStartRecording = document.querySelector('#btn-start-recording');
		var btnStopRecording  = document.querySelector('#btn-stop-recording');
		
		var videoElement      = document.querySelector('video');
		
		var progressBar = document.querySelector('#progress-bar');
		var percentage = document.querySelector('#percentage');
		
		var currentBrowser = !!navigator.mozGetUserMedia ? 'gecko' : 'chromium';
		
		var fileName;
		var audioRecorder;
		var videoRecorder;
		
		// Firefox can record both audio/video in single webm container
		// Don't need to create multiple instances of the RecordRTC for Firefox
		// You can even use below property to force recording only audio blob on chrome
		// var isRecordOnlyAudio = true;
		var isRecordOnlyAudio = !!navigator.mozGetUserMedia;
		console.log("Browser",currentBrowser)
		console.log("isRecordOnlyAudio",isRecordOnlyAudio)
		// if recording only audio, we should replace "HTMLVideoElement" with "HTMLAudioElement"
		if(isRecordOnlyAudio && currentBrowser == 'chromium') {
			var parentNode = videoElement.parentNode;
			parentNode.removeChild(videoElement);
			
			videoElement = document.createElement('audio');
			//videoElement.style.padding = '.4em';
			videoElement.style.padding = '.4em';
			videoElement.controls = true;
			parentNode.appendChild(videoElement);
		}
	//}
	
	$scope.stoprecording = function() {
		$('.tohide').show()
		$('#btn-start-recording').show()
		$('#btn-stop-recording').hide()
		btnStartRecording.disabled = false;
		btnStopRecording.disabled = true;
		
		if(isRecordOnlyAudio) {
			audioRecorder.stopRecording(onStopRecording);
		}

		if(!isRecordOnlyAudio) {
			audioRecorder.stopRecording(function() {
				videoRecorder.stopRecording(function() {
					onStopRecording();
				});
			});
		}
	};	
	
	
/*________________________________________________________________________
	* @Date:      	17 Mar 2015
	* @Method :   	postVideo
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to post/upload video file recorded on mobile devices.
	* @Param:     	3
	* @Return:    	Yes
_________________________________________________________________________
*/
	$scope.postVideo = function(){
		
		if ($scope.media.mmt && $scope.myFile) {
			$scope.media.isPrivate = 1;
			$('#overlay2').show();
			$('#overlayContent2').show();
			var file = $scope.myFile;
			if (file) {
				console.dir(file);
				var fd = new FormData();
				fd.append('file', file);
				console.log(fd);
				$http.post('/media/videoUpload',fd,{transformRequest: angular.identity,headers: {'Content-Type': undefined}}).then(function(data){
					//alert(1);
					console.log(data);
					$scope.uploadedMedia=data.data;
					$scope.addTags();
				});
			}
		}else{
			alert('Please select the required fields.');
		}
	}
	



/*________________________________________________________________________
	* @Date:      	17 Mar 2015
	* @Method :   	postAudio
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to post/upload video file recorded on mobile devices.
	* @Param:     	3
	* @Return:    	Yes
_________________________________________________________________________
*/
	$scope.postAudio = function(){
		if ($scope.media.mmt && $scope.media.isPrivate && $scope.myFile) {
		$('#overlay2').show();
        $('#overlayContent2').show();
			var file = $scope.myFile;
			if (file) {
				console.dir(file);
				var fd = new FormData();
				fd.append('file', file);
				console.log(fd);
				$http.post('/media/audioUpload',fd,{transformRequest: angular.identity,headers: {'Content-Type': undefined}}).then(function(data){
					//alert(1);
					console.log(data);
					$scope.uploadedMedia=data.data;
					$scope.addTags();
				});
			}
		}else{
			alert('Please select the required fields.');
		}
	}
});