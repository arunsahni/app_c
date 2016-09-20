var module = angular.module('collabmedia');
module.directive('fallbackSrc', function () {
	 setTimeout(function(){
		var fallback_Src = {
			link: function postLink(scope, iElement, iAttrs) {
			  iElement.bind('error', function() {
				angular.element(this).attr("src", iElement.src);
				//angular.element(((this.parent).parent).parent).attr("style", {display:none!important;});
			  });
			}
		}
	   //alert("fallback-----after 3 sec"+fallback_Src);
		return fallback_Src;
   },9000);
});

module.controller('massImageUploaderCtrl', function ($rootScope,$scope,$http,$timeout,$upload,$location,loginService,$window) {
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	var counter =true;
	
	$scope.miu={};
	$scope.trackMt =[];
	if($window.localStorage['tagsMt']) //added by manishp on 29012015 to resolve issue
		$scope.trackMt =($window.localStorage['tagsMt']).split(',');
	$scope.loaded=false;
	$scope.current_page=0;
	$scope.max_pages=0;
	$scope.next=1;	
	$scope.prev=0;
	
	//// added by parul 21012015
	//$('.descriptor').live("paste", function(e) {
	//	$(e.target).keyup(getInput);
	//	//alert($(e.target).val()); // [object Clipboard]
	//});
	//
	//function getInput(e){
	//	$(e.target).unbind('keyup');
	//	var inputText = $(e.target).val();
	//	$(e.target).val('');
	//	alert(inputText);
	//	var dataArr=inputText.split(' ');
	//	var newData="";
	//	console.log(dataArr);
	//	for(i in dataArr){
	//		if (i==0) {
	//			newData=dataArr[i];
	//		}else if(i>0 && i<((dataArr.length)-1)){
	//			newData=newData+', '+dataArr[i];
	//		}else{
	//		} 
	//		//newData=newData+', '+dataArr[i];
	//	}
	//	$(e.target).val(newData);
	//}
	//$window.localStorage['tagsTagType']=$scope.miu.tagtype;


	
	$scope.get_page = function(page){
		$scope.loaded=false;
		console.log(page);
		$('.pagination a').each(function(){
			$(this).removeClass("active");		
		});
		page.target.className="active";
		$scope.change_page(parseInt(page.target.innerHTML));		
	}
	
	$scope.next_page = function(){
		$scope.loaded=false;
		if($scope.current_page<$scope.max_pages){
			$scope.change_page(($scope.current_page+1));
			$('.pagination a').each(function(){
			$(this).removeClass("active");		
		});
		var new_id="index"+($scope.current_page-1);
		console.log("new id="+new_id)
		$("#"+new_id).addClass("active");
		}
	}	
	
	$scope.prev_page = function(){
		$scope.loaded=false;
		if($scope.current_page>1){
			$scope.change_page(($scope.current_page-1));
			$('.pagination a').each(function(){
			$(this).removeClass("active");		
		});
		var new_id="index"+($scope.current_page-1);
		console.log("new id="+new_id)
		$("#"+new_id).addClass("active");
		}
	}	
	
	
	$scope.change_page = function(page_no){
		$scope.pagination(page_no, $scope.max_pages);
		$scope.current_page=page_no;
		$scope.filtering_params.offset=(page_no-1)*$scope.filtering_params.limit;
		$http.post('/massmediaupload/view',$scope.filtering_params).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data;
				$scope.loaded=true;
				if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.amit.responselength){
					$scope.page_last_record=$scope.amit.responselength;
					
				}
				else{
					$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
				}
				$scope.getNumber($scope.amit.responselength)
				
				///For Next page
				if(page_no==$scope.max_pages){
					$scope.next=0;
				}
				else{
					$scope.next=1;	
				}
				
				
				///For Previous page
				if(page_no==1){
					$scope.prev=0;
				}
				else{
					$scope.prev=1;
				}
				
			}	
		})
		
	}
	
	
	$scope.media={};
	$scope.amit={};
	$scope.filtering_params={};
	$scope.page_last_record=0;
	
	$scope.filtering_params={
						offset:0,
						limit:20
					};
	$scope.getNumber = function(num) {
		num=Math.ceil(num/$scope.filtering_params.limit)
		return new Array(num);   
	}
	
	$http.post('/massmediaupload/view',$scope.filtering_params).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data;
				$scope.loaded=true;
				
				$scope.current_page=1;
			}else if (data.data.code==404 && data.data.msg=="Not Found"){
				//alert('in else-if');
				$scope.amit={};
				$scope.amit.responselength=0;
				$scope.current_page=0;
				$scope.loaded=true;
			}
			else{
				$scope.amit={};
				$scope.amit.responselength=0;
				$scope.current_page=0;
			}	
			if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.amit.responselength){
				$scope.page_last_record=$scope.amit.responselength;
			}
			else{
				$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
			}
			$scope.getNumber($scope.amit.responselength)
			$scope.max_pages=Math.ceil($scope.amit.responselength/$scope.filtering_params.limit);
			
			///For Next page
			if($scope.current_page==$scope.max_pages){
				$scope.next=0;
			}
			else{
				$scope.next=1;	
			}
			
			
			///For Previous page
			if($scope.current_page>=0){
				$scope.prev=0;
			}
			else{
				$scope.prev=1;
			}
	})
	
	$scope.domain={};
	$http.get('/domains/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.domain=data.data.response;
			}	
	})
	
	$scope.miuk={};
	
	$scope.getValues = function(asd,event){		
			
			$scope.miuk.title=asd.Title;
		
			$scope.miuk.prompt=asd.Prompt;
		
			$scope.miuk.Photographer=asd.Photographer;			
			/*}
			else{
				event.stopPropagation();
			}*/
	}
	
	$scope.openMetaModal = function(media){
		
		$scope.miuk.media=media._id;
		$scope.miuk.title=media.Title;		
		$scope.miuk.prompt=media.Prompt;		
		$scope.miuk.Photographer=media.Photographer;		
		
		$("#myModal1").modal("show");
	}
	
	$scope.saveTag = function(isValid){		
		if(isValid){
		
			/*
			$http.post('/massmediaupload/editTag',$scope.miuk).then(function (data, status, headers, config) {			
				if (data.data.code==200){
					$scope.amit=data.data.response;
					$("#myModal1").modal("hide");
				}	
			})*/			
			
		}		
	}
	
	$scope.selectAll = function(){
		$scope.testingarray=[];			
		for(key in $scope.amit.response){
			$scope.testingarray.push($scope.amit.response[key]._id);
			$('#image-'+$scope.amit.response[key]._id).addClass("selected");
			$('#check-'+$scope.amit.response[key]._id).attr("checked",true);
			$('#div-'+$scope.amit.response[key]._id).slideDown('slow');
		}
	}
	
	$scope.deselectAll = function(){
		$scope.testingarray=[];			
		$('.selected').each(function(){
			$(this).removeClass("selected");
		})
		$('.iphone-toggle').each(function(){			
			$(this).attr("checked",false);
		})
		$('.testing').each(function(){
			$(this).slideUp('slow');
		})
	}
	
	$scope.showAlert = function(event){
		var elem="";
		$scope.testingarray=[];				
		//console.log(elem=event.target.parentNode.parentNode.parentNode.id)
		if(event.target.tagName=="LI"){
			elem = event.target.id;
		}
		else{
			elem = event.target.parentNode.id;			
		}
		imgname = elem.split('-')
		//elem=event.target.parentNode.parentNode.parentNode.parentNode.id
		if($('#'+elem).attr('class')=='thumbnail ng-scope'){
			$('#'+elem).addClass('selected');
			$('#div-'+imgname[1]).slideDown('slow');
		}
		else{
			$('#'+elem).removeClass('selected');
			$('#div-'+imgname[1]).slideUp('slow');
		}
		
		$('.selected').each(function(){
			var imgname = $(this).attr('id');
			imgname = imgname.split('-')
			$scope.testingarray.push(imgname[1])
		})
	}
	
	$scope.testingarray = [];
	
	$scope.adminLogout = function() {
		$http.get('/admin/logout').then(function (data, status, headers, config) {
			if (data.data.logout=="200"){
				tempData = {};
				$window.location.href='/admin/login';
			}	
		})
	};    
	
	$scope.openadd = function(){
		$("#myModal").modal("show")
	}
	
	$scope.addTagsToMedia = function(){		
		$('.selected').each(function(){
			var imgname = $(this).attr('id');
			imgname = imgname.split('-')
			$scope.tesingarray.push(imgname[1])
		});
	};
	
	$scope.mmts={};
	
	$scope.mts={};
	
	$scope.gts={};
	
	//$scope.gt.mmt={};
	
	$scope.fetchmts=function(){
		
		for(key in $scope.mmts){
			if($scope.mmts[key]._id==$scope.miu.mmt){
				$scope.mts=$scope.mmts[key].MetaTags;				
			}
		
		}
		
		
	}
	//source  static on 23012015
	//$scope.source={};
	//$http.get('/sources/view').then(function (data, status, headers, config) {			
	//		if (data.data.code==200){
	//			$scope.source=data.data.response;
	//		}	
	//})
	
	$scope.collection={};	
	$http.get('/collections/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.collection=data.data.response;
			}	
	})
	
	$http.get('/metaMetaTags/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				for (i in data.data.response){
					//if (data.data.response[i]._id == '54e7211a60e85291552b1187') {	// for ===== "5555" 
					if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 " 
						data.data.response.splice(i,1);
					}
				}
				$scope.mmts=data.data.response;
			}	
	})
	$scope.groupts=[];
	$scope.fetchgts=function(){
		//alert(1);
		if ($scope.trackMt == null || $scope.trackMt == undefined) {
			//alert(1)
			//$scope.trackMt =[];
			$scope.trackMt =$window.localStorage['trackMt'];
			$scope.trackMt.push($scope.miu.gt);
		}else if ($scope.trackMt.length==0) {
			//alert(2)
			$scope.trackMt.push($scope.miu.mmt);
		}
		else{
			//alert('h');
			
			for(i in $scope.trackMt){
				//alert($scope.trackMmt[i]==$scope.miu.mmt);
				if ($scope.trackMt[i]==$scope.miu.mt) {
					var containMt=true;
					//alert('containMmt'+containMmt);

				}
			}
			if (!(containMt)) {
				//alert(3)
				$scope.trackMt.push($scope.miu.mt);
			}else{
				//alert('in else')
			}
		}
		$http.get('/groupTags/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.gts=data.data.response;
				for(key in $scope.gts){
					if($scope.gts[key].MetaTagID==$scope.miu.mt){
						var count=0;
						for(k in $scope.groupts){
							if($scope.groupts[k]._id == $scope.gts[key]._id){
							count++;
							}
						}
						if(count==0){
							$scope.groupts.push($scope.gts[key]);
						}
					}				
				}
			}	
		})
	}
	//added by parul for popup 07012015
	$scope.openalert = function(){
		$('#sure').modal('show');
	}
	
	//edited by parul 07012015  // again editeed by parul 22012015
	$scope.addmiu = function(isValid){
		$window.localStorage['trackMt']=$scope.trackMt
		console.log($scope.miu);
		$window.localStorage['tagsDomain']=$scope.miu.domain;
		$window.localStorage['tagsCollection']=$scope.miu.collection;
		$window.localStorage['tagsGt']=$scope.miu.gt;
		$window.localStorage['tagsMmt']=$scope.miu.mmt;
		$window.localStorage['tagsMt']=$scope.miu.mt;
		//$window.localStorage['tagsSource']=$scope.miu.source;
		$window.localStorage['tagsTagType']=$scope.miu.tagtype;
		//$window.localStorage['tags']=$scope.miu;
		if(isValid){
			//$scope.miu.media=$scope.testingarray;			
			$('#sure').modal('show');
		}
	}



	$scope.finalAddmiu=function(){
		var tagInfo=[];
		i=0;
		for(key in $scope.testingarray){
			tagInfo[i]={};
			tagInfo[i].id=$scope.testingarray[key];
			tagInfo[i].title=$('#title-'+$scope.testingarray[key]).val();
			tagInfo[i].prompt=$('#prompt-'+$scope.testingarray[key]).val();
			tagInfo[i].Photographer=$('#Photographer-'+$scope.testingarray[key]).val();
			i++;
		}
		$scope.miu.media=tagInfo;
		$scope.miu.offset=0;
		$scope.miu.limit=20;
		//alert('clear console');
		//console.log($scope.miu);
		$http.post('/massmediaupload/edit',$scope.miu).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				//alert(1)
				$scope.amit=data.data;
				$scope.current_page=1;
				$scope.loaded=true;
				
			}
			else{
				//alert(2)
				$scope.amit={};
				$scope.amit.responselength=0;
				$scope.current_page=0;
			}	
			if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.amit.responselength){
				$scope.page_last_record=$scope.amit.responselength;
			}
			else{
				$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
			}
			$scope.getNumber($scope.amit.responselength)
			$scope.max_pages=Math.ceil($scope.amit.responselength/$scope.filtering_params.limit);
			
			///For Next page
			if($scope.current_page==$scope.max_pages){
				$scope.next=0;
			}
			else{
				$scope.next=1;	
			}
			
			
			///For Previous page
			if($scope.current_page>=0){
				$scope.prev=0;
			}
			else{
				$scope.prev=1;
			}
			$('#myModal').modal('hide');	
		})
		$('#sure').modal('hide');
	}
	
	
	
	
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
		console.log("$files = ",$files);
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
		console.log($scope.selectedFiles);
		$scope.lengthofuploads=$files.length;
		$scope.fileUpload=$files;
		$scope.dataUrls = [];
		for ( var i = 0; i < $files.length; i++) {
			var $file = $files[i];
			$scope.imagessize+=Math.round($files[i].size/1024);
			if (window.FileReader && $file.type.indexOf('image') > -1) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL($files[i]);
				console.log(fileReader.width + " X " + fileReader.height);
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
	
	$scope.start = function(index) {
		$scope.disablebtn=true;
		$scope.progress[index] = 0;
		$scope.errorMsg = null;
		if ($scope.howToSend != 1) {
			$scope.upload[index] = $upload.upload({
				url : '/massmediaupload/add',
				method: $scope.httpMethod,
				headers: {'my-header': 'my-header-value'},
				data : {
					myModel : $scope.myModel
				},
				/* formDataAppender: function(fd, key, val) {
					if (angular.isArray(val)) {
                        angular.forEach(val, function(v) {
                          fd.append(key, v);
                        });
                      } else {
                        fd.append(key, val);
                      }
				}, */
				/* transformRequest: [function(val, h) {
					console.log(val, h('my-header')); return val + 'aaaaa';
				}], */
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
					 setTimeout(function(){
                        $('#overlay').hide();
                        $('#overlayContent').hide();
                      },800)
					$scope.imagessize=0;
					$scope.selectedFiles = [];
					$scope.fileUpload=[];
					$scope.progress = [];
					$scope.count=0;
					var offsetlength={
						offset:0,
						limit:20
					};
					$http.post('/massmediaupload/view',offsetlength).then(function (data, status, headers, config) {			
							if (data.data.code==200){
								$scope.amit=data.data;
								$scope.current_page=1;
								$scope.loaded=true;
							}
							else{
								$scope.amit={};
								$scope.amit.responselength=0;
								$scope.current_page=0;
							}	
							if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.amit.responselength){
								$scope.page_last_record=$scope.amit.responselength;
							}
							else{
								$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
							}
							$scope.getNumber($scope.amit.responselength)
							$scope.max_pages=Math.ceil($scope.amit.responselength/$scope.filtering_params.limit);
							
							///For Next page
							if($scope.current_page==$scope.max_pages){
								$scope.next=0;
							}
							else{
								$scope.next=1;	
							}
							
							
							///For Previous page
							if($scope.current_page>=0){
								$scope.prev=0;
							}
							else{
								$scope.prev=1;
							}
					})
				}
				else{
					
					$scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
					if ($scope.percentUpload == 100) {
                      setTimeout(function(){
                        $('#overlay').hide();
                        $('#overlayContent').hide();
                      },800)
                     
                    }
					
				}		
			});
		} else {
			console.log("asdasdasd");
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
	
	
	// parul 22012015
	
	setTimeout(function(){
		// domain
		if ($window.localStorage['tagsDomain']!=undefined&&$window.localStorage['tagsDomain']!=''&&$window.localStorage['tagsDomain']!=null) {
			$scope.miu.domain=$window.localStorage['tagsDomain'];
		}
		// collection
		if ($window.localStorage['tagsCollection'] != undefined && $window.localStorage['tagsCollection']!='' && $window.localStorage['tagsCollection'] != null) {
		 var splitCollection=($window.localStorage['tagsCollection']).split(',');
		 $scope.miu.collection=splitCollection;
		}
		
		// mmt
		if ($window.localStorage['tagsMmt'] != undefined && $window.localStorage['tagsMmt'] != '' && $window.localStorage['tagsMmt'] != null) {
			$scope.miu.mmt=$window.localStorage['tagsMmt'];
			
			
			//alert($scope.trackMmt);
			$scope.fetchmts();
			//mt 
			setTimeout(function(){
				if ($window.localStorage['trackMt'] == null || $window.localStorage['trackMt'] == undefined || $window.localStorage['trackMt'] == '') {
					//$scope.trackMt =[];
					$scope.trackMt=($window.localStorage['tagsMt']).split(',');
				}else{
					$scope.trackMt=($window.localStorage['trackMt']).split(',');
					for(key in $scope.trackMt){
						$scope.miu.mt=$scope.trackMt[key];
						$scope.fetchgts();
					}
					//$scope.miu.mt=$window.localStorage['tagsMt'];
				}
				setTimeout(function(){
					if ($window.localStorage['tagsMt'] != undefined && $window.localStorage['tagsMt'] != '' && $window.localStorage['tagsMt'] != null) {
						//console.log($window.localStorage['tagsMt']);
						//console.log($scope.mts);
						//console.log($window.localStorage['tagsMt']);
						$scope.miu.mt=$window.localStorage['tagsMt'];
						//$scope.$apply();
						//alert($scope.miu.mt);
						$scope.fetchgts();
						// gt 
						setTimeout(function(){
							if ($window.localStorage['tagsGt'] != undefined && $window.localStorage['tagsGt'] != '' && $window.localStorage['tagsGt'] != null) {
								var splitGt=($window.localStorage['tagsGt']).split(',');
								$scope.miu.gt=splitGt;
								
							}
							$scope.miu.mt=$window.localStorage['tagsMt'];
							//$scope.miu.mt= "546f4e1b706bfc6e3375b7a4";
							//alert($scope.miu.mt);
							$('#'+$scope.miu.mt).attr({'selected':'true'})
							$scope.$apply();
						},2100);
					}
				},600)
				
			},2100)
		}
		
		// source
		//if ($window.localStorage['tagsSource']!=undefined&&$window.localStorage['tagsSource']!=''&&$window.localStorage['tagsSource']!=null) {
		//	$scope.miu.source=$window.localStorage['tagsSource'];
		//}
		// tag type
		if ($window.localStorage['tagsTagType']!=undefined&&$window.localStorage['tagsTagType']!=''&&$window.localStorage['tagsTagType']!=null) {
			$scope.miu.tagtype=$window.localStorage['tagsTagType'];
		}
		
		
	},500)






	$scope.uploadAll = function(){
		$('#overlay').show();
        $('#overlayContent').show();
		$scope.count=0;
		for(i=0;i<$scope.fileUpload.length;i++){
			$scope.start(i);
		}
	};
	
	setTimeout(function(){
		$("#index0").addClass("active");
		$scope.pagination(1, $scope.max_pages);
		},4500);

		
		//-------------------------- for theme and links ==> STARTS---------------->
	//highlight current / active link
	$('ul.main-menu li a').each(function(){
		if($($(this))[0].href==String(window.location))
			$(this).parent().addClass('active');
	});
	
	//themes, change CSS with JS
	//default theme(CSS) is cerulean, change it if needed
	var current_theme = $.cookie('current_theme')==null ? 'cerulean' :$.cookie('current_theme');
	//alert(current_theme);
	switch_theme(current_theme);
	
	$('#themes a[data-value="'+current_theme+'"]').find('i').addClass('icon-ok');
				 
	$('#themes a').click(function(e){
		//alert('hi');
		e.preventDefault();
		current_theme=$(this).attr('data-value');
		$.cookie('current_theme',current_theme,{expires:365});
		switch_theme(current_theme);
		$('#themes i').removeClass('icon-ok');
		$(this).find('i').addClass('icon-ok');
	});
	
	
	function switch_theme(theme_name)
	{
		//alert('switch_theme');
		$('#bs-css').attr('href','../assets/charisma/css/bootstrap-'+theme_name+'.css');
	}
	
	//-------------------------- for theme and links ==> STARTS---------------->
	
		/*________________________________________________________________________
	* @Date:      	16 Mar 2015
	* @Method :   	pagination
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used manage pagination.
	* @Param:     	2
	* @Return:    	No
	_________________________________________________________________________
	*/
	$scope.pagination = function(currentPg,totalPg){
		if (totalPg > 9) {
			$('.nums').hide();
			$('#index'+(currentPg-1)).parent().show();
			$('#index'+(totalPg-1)).parent().show();
			$('#index0').parent().show();
			$scope.moreBtn(totalPg);
			if (currentPg > 5) {
				$("#leftDots").show();
				//$("#rightDots").hide();
				if ((currentPg + 4) < totalPg) {
					//console.log($('#index'+(currentPg-3)).is(":visible"));
					$("#rightDots").show();
					$("#index"+(currentPg-3)).parent().show();
					$('#index'+(currentPg-2)).parent().show();
					$('#index'+(currentPg)).parent().show();
					$('#index'+(currentPg+1)).parent().show();
				}
				else if ((currentPg + 4) == totalPg) {
					$("#rightDots").hide();
					$('#index'+(currentPg-3)).parent().show();
					$('#index'+(currentPg-2)).parent().show();
					$('#index'+(currentPg)).parent().show();
					$('#index'+(currentPg+1)).parent().show();
					$('#index'+(currentPg+2)).parent().show();
				}
				else if ((currentPg + 4) > totalPg) {
					$("#rightDots").hide();
					
					$('#index'+(totalPg-2)).parent().show();
					$('#index'+(totalPg-3)).parent().show();
					$('#index'+(totalPg-4)).parent().show();
					$('#index'+(totalPg-5)).parent().show();
					$('#index'+(totalPg-6)).parent().show();
					$('#index'+(totalPg-7)).parent().show();
				}
			}
			else{
				$("#leftDots").hide();
				$("#rightDots").show();
				//$('#index7').parent().show();
				$('#index6').parent().show();
				$('#index5').parent().show();
				$('#index4').parent().show();
				$('#index3').parent().show();
				$('#index2').parent().show();
				$('#index1').parent().show();
				
			}
		}
		else{
			
		}
	}	
			
	/*________________________________________________________________________
	* @Date:      	16 Mar 2015
	* @Method :   	moreBtn
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to add more buttons to pagination.
	* @Param:     	1
	* @Return:    	No
	_________________________________________________________________________
	*/
	$scope.moreBtn=function(totalPg){
		if (counter && $scope.max_pages > 9) {
				console.log('adding dots');
				$("#ul1 li:eq("+(totalPg-1)+")").after($("<li id='rightDots' class='nums'><a>...</a></li>"));
				$("#ul1 li:eq(1)").after($("<li id='leftDots' class='nums'><a>...</a></li>"));	
				counter=false;
			}
	}
	
	
	
	$scope.wrongPattern = false;
	$scope.checkInp = function($event , id){
		//alert("id = "+id);
		var x = $("#title-"+id).val();
		var regex=/((^[0-9])|([\sa-zA-Z,]))+$/;
		//var regex=/^(([^0-9]*)|(^[0-9]+[a-z]+)|(^[a-z]+[0-9]+)|(^[a-zA-Z])|([\sa-zA-Z]))$/
		//var regex = /^[a-zA-Z,][\sa-zA-Z,]*$/;
		//alert("value = "+x);
		var evt = $event;
		var theEvent = evt || window.event;
		
		var key = theEvent.keyCode || theEvent.which;
		key = String.fromCharCode( key );
		
		//if (x.match(regex)){
		if (regex.test(x)){
			$scope.wrongPattern = false;
			return false;
		}
		else{
			//$("#prompt-"+id).val($("#prompt-"+id).val().replace(key,''));
			$scope.wrongPattern = true;
			//alert("failed..");
			theEvent.returnValue = false;
			
			if(theEvent.preventDefault) theEvent.preventDefault();
			$("#title-"+id).val("");
			return false;
		}
	}
    
}).$inject = ["$scope","$http","$timeout","$upload","$location","loginService","$window"];