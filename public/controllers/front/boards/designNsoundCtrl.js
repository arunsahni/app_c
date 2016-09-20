var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('designNsoundCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
	
	/*
		Action : Upload Header Image
	
	*/
	
	$scope.onHeaderSelect = function($files) {
		var val = $("#headerUpload").val();
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
		
	};

	$scope.headerstyle="";
	
	$scope.startHeader = function(index) {
		$('.loader_overlay_full').show();
		$('.loader_img_overlay_full').show();	
		
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
				
				$scope.headerstyle="background:url(../assets/board/headerImg/"+data.result.HeaderImage+");";
				//$('.upload').trigger('click');                                    
			}
			else{
				$scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
			}		
		});
	};


	
	/*
		Action : Upload Background Music
	
	*/
	
    $scope.audioFile="";
    
    $scope.onAudioSelect = function($files) {
		var val = $("#musicUpload").val();
		if (!val.match(/(?:mp3|mp4|ogg|wav)$/)) {
			$scope.setFlashInstant('<span style="color:red">Selected file is not an audio. Please select an audio file to proceed.</span>' , 'success');
		}else{
	
            $('.loader_overlay_full').show();
            $('.loader_img_overlay_full').show();
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
                    
                    $scope.startAudio(i);
                   
            }
		}
	};
    
    $scope.startAudio = function(index) {
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
	
	
	
	
	/*________________________________________________________________________
		* @Date:      	27 April 2015
		* @Method :   	switch_class_inverted
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used to switch classes of navigation buttons .
		* @Param:     	1
		* @Return:    	no
	_________________________________________________________________________
	*/  
	$scope.switch_class_inverted = function(){
		//alert('switch_class_normal');
		$('#pt-l-1').addClass('invert-bg');
		$('#pt-l-2').addClass('invert-bg-btn');
		$('#pt-r-1').addClass('invert-bg');
		$('#pt-r-2').addClass('invert-bg-btn');
	}
	/*********************************END*****************************************************************/
	
	
	
	
	/*________________________________________________________________________
		* @Date:      	27 April 2015
		* @Method :   	switch_class_normal
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used to switch classes of navigation buttons .
		* @Param:     	1
		* @Return:    	no
	_________________________________________________________________________
	*/  
	$scope.switch_class_normal = function(){
		//alert('switch_class_inverted');
		$('#pt-l-1').removeClass('invert-bg');
		$('#pt-l-2').removeClass('invert-bg-btn');
		$('#pt-r-1').removeClass('invert-bg');
		$('#pt-r-2').removeClass('invert-bg-btn');
	}
	
	/*********************************END*****************************************************************/
});
