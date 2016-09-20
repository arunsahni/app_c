var module = angular.module('collabmedia');
module.controller('massImageManagerCtrl', function ($rootScope,$scope,$http,$timeout,$upload,$location,loginService,$window) {
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	var counter = true;
	
	
	$scope.loaded=false;
	
	$scope.media = {};
	$scope.amit = {};	
	$scope.filter = {};
	$scope.filtering_params = {};
	$scope.filtering_params = $scope.filter;
	$scope.filtering_params.offset = 0;
	$scope.filtering_params.limit = 20;
	
	
	/* Pagination Starts*/
	$scope.current_page=0;
	$scope.max_pages=0;
	$scope.next=1;	
	$scope.prev=0;
	if($window.localStorage['tagsMIM']) {
		//$scope.trackTags =($window.localStorage['tagsMt']).split(',');
		//JSON.parse($window.localStorage['tagsMIM'])
		//
	}
	if($window.localStorage['filtersMIM']) {
		console.log(JSON.parse($window.localStorage['filtersMIM']));
		$timeout(function(){
			$scope.filter = JSON.parse($window.localStorage['filtersMIM']);
			$scope.fetchmtfilter(true);
			$scope.fetchgtfilter(true);
			$scope.filtering_params = $scope.filter;
			$timeout(function(){
				$scope.$apply();
			},1)
		})
	}
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
	//	//alert(inputText);
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
		
	
	
	/*.on('paste', function () {
		var element = this;
		setTimeout(function () {
		alert( $(element).val());
		}, 100);
	  });*/
	
	
	$scope.getNumber = function(num) {
		//console.log($scope.filtering_params.limit);
		num=Math.ceil(num/$scope.filtering_params.limit)
		return new Array(num);   
	}
	
	$scope.get_page = function(page){
		$scope.loaded=false;
		$('.pagination a').each(function(){
			$(this).removeClass("active");		
		});
		page.target.className="active";
		
		$scope.change_page(parseInt(page.target.innerHTML));		
	}
	$scope.miu={};
	$scope.next_page = function(){
		$scope.loaded=false;
		if($scope.current_page<$scope.max_pages){
			$scope.change_page(($scope.current_page+1))
		
		
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
		$http.post('/massmediaupload/view/all',$scope.filtering_params).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data;
				$scope.loaded=true;
				if(($scope.filtering_params.offset+$scope.filtering_params.limit) > $scope.amit.responselength){
					$scope.page_last_record=$scope.amit.responselength;
					
				}
				else{
					$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
				}
				
				
				
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
	
	/* Pagination Ends*/
	
	
	
	
	$http.post('/massmediaupload/view/all',$scope.filtering_params).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data;
				$scope.loaded=true;
				$scope.current_page=1;
			}/*else if (data.data.code == 404) {
				$scope.loaded=true;
				
			}*/
			else{
				$scope.loaded=true;
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
			$scope.setPagination();
	})
	
	$scope.setPagination = function(){
		counter = true;
		setTimeout(function(){
			$("#index0").addClass("active");
			$scope.pagination(1,$scope.max_pages);
		},10);
	}
	
	$scope.miuk={};
	
	$scope.showFiltered = function(){
		$scope.selcted.Media="";// added by parul to clear search by locator textbox 09022015
		$scope.filtering_params.offset=0;
		//alert(1);
		$window.localStorage['filtersMIM'] = JSON.stringify($scope.filter);
		console.log($scope.filtering_params);
		$http.post('/massmediaupload/view/all',$scope.filtering_params).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data;
				$scope.loaded=true;
				$scope.current_page=1;	
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
			$scope.setPagination();
		})
	}
	
	$scope.getValues = function(asd,event){
			//if(event.target.className=="testing foreground" || event.target.className=="testing"){
			
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
			$http.post('/massmediaupload/editTag',$scope.miuk).then(function (data, status, headers, config) {			
				if (data.data.code==200){
					$scope.amit=data.data.response;
					$scope.loaded=true;
					$("#myModal1").modal("hide");
				}	
			})			
			
		}		
	}
	
	$scope.domain={};
	$http.get('/domains/view').then(function (data, status, headers, config) {			
		if (data.data.code==200){
			$scope.domain=data.data.response;
		}	
	})
	
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
	
	$scope.open_delete = function(){		
		$('#deleteModal').modal("show");		
	}
	
	$scope.deletemedia = function(){
		
		var mediatodelete={};
		mediatodelete=$scope.filtering_params;
		mediatodelete.media=[];
		mediatodelete.media=$scope.testingarray;
		$http.post('/massmediaupload/delete',mediatodelete).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data;
				$scope.loaded=true;
				$scope.current_page=1;	
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
			$("#deleteModal").modal("hide");
			$scope.setPagination();
		})
	}
	
	$scope.showAlert = function(event){
	
		var elem="";
		
		$scope.testingarray=[];	
		
		if(event.target.tagName=="LI"){
			elem = event.target.id;
		}
		else{
			elem = event.target.parentNode.id;		
		}
		
		imgname = elem.split('-');
		
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
			imgname = imgname.split('-');
			$scope.testingarray.push(imgname[1]);
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
	
	
	$scope.domain={};
	$http.get('/domains/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.domain=data.data.response;
			}	
	})
	
	//$scope.gt.mmt={};
	
	
	
	/*________________________________________________________________________
	* @Date:      	09 Feb 2015
	* @Method :   	locatorSearch
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to searc media on the basis of record/platform locator.
	* @Param:     	-
	* @Return:    	No
	_________________________________________________________________________
	*/

	$scope.locatorSearch = function(){
		//$scope.selcted.Media="";// added by parul to clear search by locator textbox 09022015
		$scope.selcted.offset=0;
		$scope.selcted.limit=$scope.filtering_params.limit;
		$http.post('/massmediaupload/view/all',$scope.selcted).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data;
				$scope.loaded=true;
				$scope.current_page=1;	
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
			$scope.setPagination();
		})
		
	}
	
	//end
	
	$scope.changeDomain=function(){
		$scope.miu.domain=$scope.filter.domain;
	}
	
	$scope.changeSource=function(){
		$scope.miu.source=$scope.filter.source;
	}
	
	$scope.changeCollection=function(){
		$scope.miu.collection=$scope.filter.collection;
	}
	
	$scope.fetchmts=function(){		
		for(key in $scope.mmts){
			if($scope.mmts[key]._id==$scope.miu.mmt){
				$scope.mts=$scope.mmts[key].MetaTags;				
			}
		
		}
		
		
	}
	
	$scope.fetchmtfilter=function(flag){		
		for(key in $scope.mmts){
			if($scope.mmts[key]._id==$scope.filter.mmt){
				$scope.mts=$scope.mmts[key].MetaTags;				
			}
		
		}
		if (flag) {
			//alert('inside')
			$scope.filter.mmt = $scope.filter.mmt ? $scope.filter.mmt : '';
			$scope.filter.mt = $scope.filter.mt ? $scope.filter.mt : '';
			console.log($scope.filter.mt);
			$timeout(function(){
				$('#filter'+$scope.filter.mt).attr({'selected':'true'});
			},1)
		}
		$scope.miu.mmt=$scope.filter.mmt;
	}
	 
	$scope.source={};
	$http.get('/sources/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.source=data.data.response;
			}	
	})
	
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
	
	$scope.grouptfs=[];
	$scope.fetchgtfilter = function(flag){
		$scope.grouptfs=[];
		$http.get('/groupTags/view').then(function (data, status, headers, config) {			
				if (data.data.code==200){
					$scope.gts=data.data.response;
					for(key in $scope.gts){
						if($scope.gts[key].MetaTagID==$scope.filter.mt){							
								$scope.grouptfs.push($scope.gts[key]);							
						}				
					}
					if (flag) {
						//alert('inside')
						$scope.filter.gt = $scope.filter.gt ? $scope.filter.gt : '';
						//$scope.filter.mt = $scope.filter.mt ? $scope.filter.mt : '';
						console.log($scope.filter.gt);
						$timeout(function(){
							$('#filter'+$scope.filter.gt).attr({'selected':'true'});
						},1)
					}
				}	
		})
		
		$scope.miu.mt=$scope.filter.mt;
	}
	$scope.addmiu = function(isValid){
		$window.localStorage['MIMtrackMt']=$scope.trackMt
		console.log($scope.miu);
		$window.localStorage['MIMtagsDomain']=$scope.miu.domain;
		$window.localStorage['MIMtagsCollection']=$scope.miu.collection;
		$window.localStorage['MIMtagsGt']=$scope.miu.gt;
		$window.localStorage['MIMtagsMmt']=$scope.miu.mmt;
		$window.localStorage['MIMtagsMt']=$scope.miu.mt;
		//$window.localStorage['tagsSource']=$scope.miu.source;
		$window.localStorage['MIMtagsTagType']=$scope.miu.tagtype;
		if(isValid){
			$scope.openalert();
		}
	}
	
	setTimeout(function(){
		$("#index0").addClass("active");
		},4500);
	
	$scope.openalert = function(){
		$('#sure').modal('show');
	}
	//function added by parul 07012015
	$scope.viewDetails=function(dataa){
		console.log(typeof dataa._id);
		$http.post('/massmediaupload/viewMedia',{'ID':dataa._id}).then(function (data, status, headers, config) {
		//alert(1);
		$scope.MediaDetail=data.data.result[0];
		console.log(data.data.result[0]);
		if (dataa.MediaType=='Image') {
			//alert('img');
			var url=dataa.Location[0].URL;
			$('#MediaContainer').html('<div class="image-wrap"><img class="" src="../assets/Media/img/'+$scope.aspectfit__thumbnail+'/'+url+'" alt="Sample Image 1"></div>');
		}else if (dataa.MediaType=='Notes') {
			//alert('notes');
			$('#MediaContainer').html('<div class="text_wrap" style="max-height:200px;overflow-y:auto">'+ dataa.Content+' </div>');
		}else if (dataa.MediaType=='Montage') {
			var url=dataa.thumbnail;
			//alert('montage');
			$('#MediaContainer').html('<div class="image-wrap"><img  class="" src="../assets/Media/img/'+url+'" alt="Montage thumbnail not available"></div>');
		}else if (dataa.MediaType=='Link') {
			//alert('link');
			var url=dataa.Content;
			$('#MediaContainer').html('<div class="image-wrap">'+url+'</div>')
		}
		})
		$('#MediaDetail').modal('show');
	}
	
	//-- image resize
	
	setTimeout(function(){
		//alert(1);
		$('.image-wrap').each(function(){
			height=$(this).parent().height();
			imgheight=$(this).children().first('img').height();
			imgwidth=$(this).children().first('img').width();
			$(this).children().first('img').css("height","180 !important");
			$(this).children().first('img').css("width","180 !important");
			$(this).children().first('img').css("margin","");
				
		/* 
			if(imgheight<imgwidth){
			$(this).children().first('img').height(height)
			$(this).children().first('img').css('width','auto')
			}
			else if(imgwidth<imgheight){
			$(this).children().first('img').width(height)
			$(this).children().first('img').css('height','auto')
			}
			else{
			$(this).children().first('img').width(height)
			$(this).children().first('img').css('height','auto')
			}
			*/
		})
		
	},4000);
	//added by parul to clear content of modal
	$scope.closeView=function(){
		$scope.MediaDetail={};
		$('#MediaContainer').html('');
	}
	
	$scope.finaladd = function(){		
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
			$http.post('/massmediaupload/editall',$scope.miu).then(function (data, status, headers, config) {			
				if (data.data.code==200){
					$scope.amit=data.data;
					$scope.loaded=true;
					
				}
				else{
					$scope.amit={};
					
				}	
				//$scope.filter=$scope.miu;
				$('#sure').modal('hide');
				$scope.showFiltered();
				
							
			});
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
			
			
			console.log($scope.miu)
		
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
		$('.nums').hide();
		$('#index'+(currentPg-1)).parent().show();
		$('#index'+(totalPg-1)).parent().show();
		$('#index0').parent().show();
		if (totalPg > 9) {
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
			$('.nums').show();
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
		if (counter) {
				//console.log('adding dots');
				if(!$('#ul1').find('#rightDots').is('li') || !$('#ul1').find('#leftDots').is('li')){
					$("#ul1 li:eq("+(totalPg-1)+")").after($("<li id='rightDots' class='nums'><a>...</a></li>"));
					$("#ul1 li:eq(1)").after($("<li id='leftDots' class='nums'><a>...</a></li>"));	
				}
				counter=false;
			}
	}
	
	
	
	
	$timeout(function(){
		// domain
		if ($window.localStorage['MIMtagsDomain']!=undefined&&$window.localStorage['tagsDomain']!=''&&$window.localStorage['MIMtagsDomain']!=null) {
			$scope.miu.domain=$window.localStorage['MIMtagsDomain'];
		}
		// collection
		if ($window.localStorage['MIMtagsCollection'] != undefined && $window.localStorage['MIMtagsCollection']!='' && $window.localStorage['MIMtagsCollection'] != null) {
		 var splitCollection=($window.localStorage['MIMtagsCollection']).split(',');
		 $scope.miu.collection=splitCollection;
		}
		
		// mmt
		if ($window.localStorage['MIMtagsMmt'] != undefined && $window.localStorage['MIMtagsMmt'] != '' && $window.localStorage['MIMtagsMmt'] != null) {
			$scope.miu.mmt=$window.localStorage['MIMtagsMmt'];
			
			
			//alert($scope.trackMmt);
			$scope.fetchmts();
			//mt 
			setTimeout(function(){
				if ($window.localStorage['MIMtrackMt'] == null || $window.localStorage['MIMtrackMt'] == undefined || $window.localStorage['MIMtrackMt'] == '') {
					//$scope.trackMt =[];
					$scope.trackMt=($window.localStorage['MIMtagsMt']).split(',');
				}else{
					$scope.trackMt=($window.localStorage['MIMtrackMt']).split(',');
					for(key in $scope.trackMt){
						$scope.miu.mt=$scope.trackMt[key];
						$scope.fetchgts();
					}
					//$scope.miu.mt=$window.localStorage['tagsMt'];
				}
				setTimeout(function(){
					if ($window.localStorage['MIMtagsMt'] != undefined && $window.localStorage['MIMtagsMt'] != '' && $window.localStorage['MIMtagsMt'] != null) {
                         //console.log($window.localStorage['tagsMt']);
                         //console.log($scope.mts);
                         //console.log($window.localStorage['tagsMt']);
                         $scope.miu.mt=$window.localStorage['MIMtagsMt'];
                         //$scope.$apply();
                         //alert($scope.miu.mt);
                         $scope.fetchgts();
                         // gt 
                         setTimeout(function(){
                              if ($window.localStorage['MIMtagsGt'] != undefined && $window.localStorage['MIMtagsGt'] != '' && $window.localStorage['MIMtagsGt'] != null) {
                                  var splitGt=($window.localStorage['MIMtagsGt']).split(',');
                                  $scope.miu.gt=splitGt;
                                  
                              }
                              $scope.miu.mt=$window.localStorage['MIMtagsMt'];
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
		if ($window.localStorage['MIMtagsTagType']!=undefined&&$window.localStorage['MIMtagsTagType']!=''&&$window.localStorage['MIMtagsTagType']!=null) {
			$scope.miu.tagtype=$window.localStorage['MIMtagsTagType'];
		}
		
		
	},500)
    
}).$inject = ["$scope","$http","$timeout","$upload","$location","loginService","$window"];