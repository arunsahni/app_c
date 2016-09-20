var collabmedia = angular.module('collabmedia');

collabmedia.compileProvider.directive('autoFillSync', function($timeout) {
   return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
          var origVal = elem.val();
          console.log("origVal ",origVal);
          
          
          $timeout(function () {
              var newVal = elem.val();
              //console.log("newVal = ",newVal);
              //alert("m here---");
              if(ngModel.$pristine && origVal !== newVal) {
                  ngModel.$setViewValue(newVal);
              }
          }, 500);
      }
   }
})

collabmedia.controllerProvider.register('myprofileCtrl',function($scope,$http,$location,loginService,$window,$rootScope){

      document.getElementById('close_span').addEventListener('click', function(e) {
              // $("#msg").fadeOut();
              //alert("click");
              $("#close_span").parent().fadeOut();
              
           }, false);
      /*
        $("li").keydown(function(){
         //alert(1);
         $(this).find("p").css("display", "block");
         
       });
   
      $('li').click(function() {
            //alert(1);
            //$("p").css("display", "block");
            
                  $(this).find("p").css("display", "block");
                  
            
        });*/
      $(".close_icon").click(function(){
         //alert(1);
         $(this).parent().fadeOut();
         });

$scope.loaded=false;

	$scope.init=function(){		
		$('#menuicon').jPushMenu();
	}
        
        // image click
            $("#imgSmall").click(function () {
               //alert('clicked');
               //$("#imgBig").attr("src", "");
               $("#overlay").show();
               
               $("#overlayContent").show();
           });
           
           $("#imgBig").click(function () {
               //alert(' big clicked');
               
               $("#overlay").hide();
               $("#overlayContent").hide();
           });
        
	  //hide image on esc key press
          $(document).keyup(function(event) {
               if(event.which === 27) {
                   $("#overlay").hide();
                   $("#overlayContent").hide();
               }
           });
          
          //overlay close button
          document.getElementById('closeBtn').addEventListener('click', function(e) {
               $("#overlay").hide();
               $("#overlayContent").hide();
           }, false);
          
          
      var userdata={};
      var ud=[];
      $scope.fsgArr2=[];
      $scope.userInfo = {};
	  loginService.chkUserLogin($http,$location,$window).then(function(){
        $scope.__getNsetFSGvalueArr();
      });
	
    $scope.__getNsetFSGvalueArr = function(){
       $scope.userInfo = tempData;
         console.log("fgdfgdf "+JSON.stringify($scope.userInfo));
         $scope.fssg.NickName = $scope.userInfo.NickName;
         $scope.imageName=($scope.userInfo.ProfilePic)?($scope.userInfo.ProfilePic):("../assets/users/default.png");
         $scope.imageName_medium = $scope.imageName.replace('/users/'+$scope.small__thumbnail,'/users/'+$scope.discuss__thumbnail);
         userdata=$scope.userInfo;
         $scope.fsgArr2=$scope.userInfo.FSGsArr2;
         var fsgArr2=$scope.fsgArr2;
         console.log('$scope.fsgArr2');
         console.log($scope.fsgArr2);
         var finalArr = [];
         
         for(idx in fsgArr2){
             var values=(fsgArr2[idx]).split(',');
             var tempArr=[]
             for(i in values){
                ud.push(idx+'~'+values[i]);
             }
          }
         //alert(1);
         console.log(finalArr)
         console.log("ud = ",ud); 
    }
    
    
	$scope.init__setUserDefaultFsgs = function(){
      $scope.fsg=[];
      $scope.fsgs={};
      $scope.fssg={};
      $scope.fssg.fsg=[];
	  
      $http.get('/fsg/view').then(function (data, status, headers, config){
           
           if (data.data.code==200){
              $scope.fsgs=data.data.response;
			  console.log("$scope.fsgArr2 = ",$scope.fsgArr2);
              if($scope.fsgArr2){
				if ($scope.fsgArr2.length!=0) {
					 setTimeout(function(){
						 console.log("setTimeout ud = ",ud); 
						 $('option').each(function(){					
							for(i in ud){
							   if($(this).attr('value')==ud[i]){
								  console.log($(this).parent().val());
								  $(this).parent().val(function(index,value){
									 if (value==null) {
									   value=[];
									   value[0]=ud[i];
									   return value;
									 }else{
										value.push(ud[i]);
										return value;
									 }
								  })
							   }
							}
						 })
						 $scope.loaded=true;
					 },500)   
				  }
			  }
			  $scope.loaded=true;
           }
           
      })
      
    }
    $scope.init__setUserDefaultFsgs();
	
	
	
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


	
	
	$scope.submitForm = function(isValid){
         console.log($scope.fssg);
         console.log($scope.fssg);
        	$http.post('/user/addFsg',$scope.fssg).then(function (data, status, headers, config) {
			if (data.data.code==200){
				//$scope.fsgs=data.data.response;
                                
                                //start image upload
                                
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
			        	// saveFile.save(nameOfFile,function(abc){
			        	// 	console.log(abc);
			        	// });
                        var saveUrl="/user/saveFile";
                        console.log('$rootScope.nameOfFile='+$rootScope.nameOfFile);
                        $http.post(saveUrl,{data : $rootScope.nameOfFile} ).success(function(abc){
                           $scope.imageName=$rootScope.nameOfFile;
                           console.log(abc);
                           $scope.userInfo=abc.data;
                        });
                     })
                     .error(function(){
			        	 console.log("failure");

			        });
                              }
                                // image upload ends
                                $("p").css("display", "block");
				$scope.msg = "Profile updated successfully.";
			}	
		})
	}
	
	
	//profile picture uploading code
	$scope.onProfilePicSelect = function($files) {
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
                    
                    $scope.startUpload(i);
                   
            }
	};

	$scope.dp_style="";
	
	$scope.startUpload = function(index) {
		$scope.disablebtn=true;
		$scope.progress[index] = 0;
		$scope.errorMsg = null;
		$scope.upload[index] = $upload.upload({
			url : '/users/upload_dp',
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
					
					$scope.dp_style="background:url(../assets/users/"+data.result.HeaderImage+");";
					//$('.upload').trigger('click');                                    
				}
				else{
					$scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
				}		
		});
	};
	//End profile picture uploading code
	
});