var module = angular.module('collabmedia');
module.controller('massImageManagerCtrl', function ($rootScope,$scope,$http,$timeout,$upload,$location,loginService,$window,$q) {
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	
	//setting new design filter & tags on scroll
	angular.element(window).on('scroll', function(){
		console.log("angular.element(window).scrollTop = ",angular.element(window).scrollTop());
		if( angular.element(window).scrollTop() >= 200 ){
			angular.element('#sidebar-wrapper').addClass('element_fixtotop_class');
			angular.element('#sidebar-wrapper1').addClass('element_fixtotop_class');
		}
		if( angular.element(window).scrollTop() < 200 ){
			angular.element('#sidebar-wrapper').removeClass('element_fixtotop_class');
			angular.element('#sidebar-wrapper1').removeClass('element_fixtotop_class');
		}
	})
	//setting new design filter & tags on scroll
	
	
	$scope.loading = false;
	$scope.showDiv = true;
	$scope.exists = false;
	$scope.addedTag = {};
	var counter = true;
	$scope.media = {};
	$scope.media_gallery_data = {};	
	$scope.filter = {};
	$scope.filtering_params = {};
	$scope.keywordsSelcted = [];
	$scope.addAnotherTag = [];
	$scope.excludeWords = [];
	$scope.loaded=false;
	$scope.filtering_params = $scope.filter;
	$scope.filtering_params.offset = 0;
	$scope.filtering_params.limit = 100;
		
	/* Pagination Starts*/
	$scope.current_page=0;
	$scope.max_pages=0;
	$scope.next=1;	
	$scope.prev=0;
	
	//Loader variable 10032016
	$scope.actionModalloaded=false;
	
	// temperory Code
    $scope.domain={};
    $scope.source={};
    $scope.collection={};

    $scope.mmts={};
    $scope.mts={};
    $scope.gts={};

    var domain = function() {
        var deferred = $q.defer();

        $http.get('/domains/view').then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.domain=data.data.response;
				deferred.resolve($scope.domain);
			}
        })
		return deferred.promise;
	}
    var source = function () {
        var deferred = $q.defer();
        $http.get('/sources/view').then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.source=data.data.response;
				deferred.resolve($scope.source);
				console.log("Sources---------------------",$scope.source);
			}
        })
		return deferred.promise;
    }
    var collection = function() {
        var deferred = $q.defer();

        $http.get('/collections/view').then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.collection=data.data.response;
				deferred.resolve($scope.collection);
				console.log("Collection---------------------",$scope.collection);
			}
        })
		return deferred.promise;
    }
    var mmt = function() {
        var deferred = $q.defer();
        $http.get('/metaMetaTags/view').then(function (data, status, headers, config) {
            if (data.data.code==200){
                for (i in data.data.response){
                    //if (data.data.response[i]._id == '54e7211a60e85291552b1187') {    // for ===== "5555"
                    if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 "
                        data.data.response.splice(i,1);
                    }
                }
                $scope.mmts=data.data.response;
                deferred.resolve($scope.mmts);
            }
        })
		return deferred.promise;
    }


    $q.all([domain(),source(),collection(), mmt()]).then(function(value) {
        // Success callback where value is an array containing the success values
        console.log("==========================================");
        console.log("Success-------------------",value)
        console.log("===========================================");
        if($window.localStorage['tagsMIM']) {
			//$scope.trackTags =($window.localStorage['tagsMt']).split(',');
			//JSON.parse($window.localStorage['tagsMIM'])
			//
		}
		if($window.localStorage['filtersMIM']) {
            console.log("Window localstrge",JSON.parse($window.localStorage['filtersMIM']));
			$scope.filter = JSON.parse($window.localStorage['filtersMIM']);
			$scope.fetchmtfilter(true);
			$scope.fetchgtfilter(true);
			$scope.filtering_params = $scope.filter;
		}
		else{
			console.log("not set------$window.localStorage['filtersMIM']",$window.localStorage['filtersMIM']);
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
				$timeout(function(){
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
					$timeout(function(){
						if ($window.localStorage['MIMtagsMt'] != undefined && $window.localStorage['MIMtagsMt'] != '' && $window.localStorage['MIMtagsMt'] != null) {
							 $scope.miu.mt=$window.localStorage['MIMtagsMt'];
							 $scope.fetchgts();
							 $timeout(function(){
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
			
			// tag type
			if ($window.localStorage['MIMtagsTagType']!=undefined&&$window.localStorage['MIMtagsTagType']!=''&&$window.localStorage['MIMtagsTagType']!=null) {
				$scope.miu.tagtype=$window.localStorage['MIMtagsTagType'];
			}
		},500)
		
		viewall();
		
    }, function(reason) {
        // Error callback where reason is the value of the first rejected promise
        $scope.result = reason;
    });
    // end 
	
	var search__elements = $('#search_gallery_elements');
				
	search__elements.on('click','.gallery-block .search_item',function(e){
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		//alert('Please Switch to view mode to view and edit page contents');
	})
	
	$scope.getNumber = function(num) {
		console.log("on pagination--------------------------------$scope.getNumber-----num = ",num)
		//console.log($scope.filtering_params.limit);
		if(num){
			num=Math.ceil(num/$scope.filtering_params.limit)
			console.log("on pagination--------------------------------$scope.getNumber-----num = ",num)
			return new Array(num);   
		}
	}
	
	$scope.get_page = function(page){
		$scope.loaded=false;
		$('.pagination a').each(function(){
			$(this).removeClass("active");		
		});
		page.target.className="active";
		console.log("parseInt(page.target.innerHTML)------------",parseInt(page.target.innerHTML));
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
		console.log("$scope.max_pages----------------",$scope.max_pages);
		$scope.pagination(page_no, $scope.max_pages);
		$scope.current_page=page_no;
		if(page_no > 0){
			$scope.filtering_params.offset=(page_no-1)*$scope.filtering_params.limit;
		}
		else{
			$scope.filtering_params.offset=0;
		}
		
		$scope.loaded=false;
		$scope.selcted.Media=""; //added by parul to clear search by locator textbox 09022015
		$scope.filtering_params.offset = $scope.filtering_params.offset > 0 ? $scope.filtering_params.offset : 0;
		
		//alert(1);
		$scope.filtering_params.keywordsSearch = [];
		$scope.filtering_params.addAnotherTag = [];
		$scope.filtering_params.excludeWord = [];
		
		//this is to set current filter parameter to $local storage...
		$window.localStorage['filtersMIM'] = JSON.stringify($scope.filter);
		
		if ($scope.keywordsSelcted) {
			angular.forEach( $scope.keywordsSelcted, function(value, key) {
				$scope.filtering_params.keywordsSearch.push(value.id);
			});
		}
		if ($scope.addAnotherTag) {
			angular.forEach( $scope.addAnotherTag, function(value, key) {
				$scope.filtering_params.addAnotherTag.push(value.id);
			});
		}
		if ($scope.excludeWords) {
			angular.forEach( $scope.excludeWords, function(value, key) {
				$scope.filtering_params.excludeWord.push(value.id);
			});
		}
		
		console.log("My params----IN SHOW FILTERED---------------",$scope.filtering_params);
	
		$http.post('/massmediaupload/view/allstatus',$scope.filtering_params).then(function (data, status, headers, config) {
			$scope.loaded=true;
			if (data.data.code==200){
				$scope.media_gallery_data=data.data;
				console.log("22",$scope.media_gallery_data);
				$scope.loaded=true;
				$scope.current_page=1;	
			}
			else{
				$scope.media_gallery_data={};
				$scope.media_gallery_data.responselength=0;
				$scope.current_page=0;
				$scope.loaded=true;
			}
			
			if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.media_gallery_data.responselength){
				$scope.page_last_record=$scope.media_gallery_data.responselength;
			}
			else{
				$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
			}
			
			//$scope.max_pages=Math.ceil($scope.media_gallery_data.responselength/$scope.filtering_params.limit);
			//console.log("$scope.max_pages----------------------------",$scope.max_pages);		
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
			//$scope.setPagination();
		})
		/*
		//added by arun
		$scope.paginationObj = {};
		$scope.paginationObj.offset = $scope.filtering_params.offset;
		$scope.paginationObj.limit = $scope.filtering_params.limit;
		//**********End 
		
		$http.post('/massmediaupload/view/all',$scope.paginationObj).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.media_gallery_data=data.data;
				$scope.loaded=true;
				if(($scope.filtering_params.offset+$scope.filtering_params.limit) > $scope.media_gallery_data.responselength){
					$scope.page_last_record=$scope.media_gallery_data.responselength;
					
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
		*/
	}
	/* Pagination Ends*/
	
	// added by arun
	function viewall() {
		//alert("called.........viewall-------refresh/redirect case");
		
		console.log("**************************************************");
		console.log("Current page value",$scope.current_page);
		console.log("**************************************************");
		if($scope.current_page > 0){
			$scope.filtering_params.offset=($scope.current_page-1)*$scope.filtering_params.limit;
		}
		else{
			$scope.filtering_params.offset=0;
		}
		
		console.log("viewall----------------------",$scope.filtering_params);
		
		$scope.showFiltered();
		
		/*
		
		$scope.paginationObj = {};
		$scope.paginationObj.offset = $scope.filtering_params.offset;
		$scope.paginationObj.limit = $scope.filtering_params.limit;
		
		$http.post('/massmediaupload/view/allStatus',$scope.paginationObj).then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.media_gallery_data=data.data;
				console.log("11",$scope.media_gallery_data);
				$scope.loaded=true;
				//$scope.current_page=1;
			}
			//else if (data.data.code == 404) {
				//$scope.loaded=true;
				
			//}
			else{
				$scope.loaded=true;
				$scope.media_gallery_data={};
				$scope.media_gallery_data.responselength=0;
				$scope.current_page=0;
			}
	
			if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.media_gallery_data.responselength){
					$scope.page_last_record=$scope.media_gallery_data.responselength;
			}
			else{
				$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);
				console.log("Page offset",$scope.filtering_params.offset)
				console.log("Page limit",$scope.filtering_params.limit)
				console.log("Page last record",$scope.page_last_record)
			}
			
			$scope.max_pages=Math.ceil($scope.media_gallery_data.responselength/$scope.filtering_params.limit);
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
		});
		*/
	}

	$scope.setPagination = function(){
		counter = true;
		setTimeout(function(){
			$("#index0").addClass("active");
			$scope.pagination(1,$scope.max_pages);
		},10);
	}
	
	$scope.miuk={};
	
	$scope.showFiltered = function(){
		$scope.loaded=false;
		$scope.selcted.Media=""; //added by parul to clear search by locator textbox 09022015
		$scope.filtering_params.offset = 0;
		
		//alert(1);
		$scope.filtering_params.keywordsSearch = [];
		$scope.filtering_params.addAnotherTag = [];
		$scope.filtering_params.excludeWord = [];
		
		//this is to set current filter parameter to $local storage...
		$window.localStorage['filtersMIM'] = JSON.stringify($scope.filter);
		
		if ($scope.keywordsSelcted) {
			angular.forEach( $scope.keywordsSelcted, function(value, key) {
				$scope.filtering_params.keywordsSearch.push(value.id);
			});
		}
		if ($scope.addAnotherTag) {
			angular.forEach( $scope.addAnotherTag, function(value, key) {
				$scope.filtering_params.addAnotherTag.push(value.id);
			});
		}
		if ($scope.excludeWords) {
			angular.forEach( $scope.excludeWords, function(value, key) {
				$scope.filtering_params.excludeWord.push(value.id);
			});
		}
		
		console.log("My params----IN SHOW FILTERED---------------",$scope.filtering_params);
	
		$http.post('/massmediaupload/view/allstatus',$scope.filtering_params).then(function (data, status, headers, config) {
			$scope.loaded=true;
			if (data.data.code==200){
				$scope.media_gallery_data=data.data;
				console.log("22",$scope.media_gallery_data);
				$scope.loaded=true;
				$scope.current_page=1;	
			}
			else{
				$scope.media_gallery_data={};
				$scope.media_gallery_data.responselength=0;
				$scope.current_page=0;
				$scope.loaded=true;
			}
			
			if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.media_gallery_data.responselength){
				$scope.page_last_record=$scope.media_gallery_data.responselength;
			}
			else{
				$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
			}
			
			$scope.max_pages=Math.ceil($scope.media_gallery_data.responselength/$scope.filtering_params.limit);
			console.log("$scope.max_pages----------------------------",$scope.max_pages);		
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
					$scope.media_gallery_data=data.data.response;
					$scope.loaded=true;
					$("#myModal1").modal("hide");
				}	
			})			
			
		}		
	}
	
	
	
	$scope.selectAll = function(){
		$scope.testingarray=[];			
		for(key in $scope.media_gallery_data.response){
			$scope.testingarray.push($scope.media_gallery_data.response[key]._id);
			$('#image-'+$scope.media_gallery_data.response[key]._id).addClass("selected");
			$('#check-'+$scope.media_gallery_data.response[key]._id).attr("checked",true);
			$('#div-'+$scope.media_gallery_data.response[key]._id).slideDown('slow');
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
		if (mediatodelete) {
			$("#deleteModal").modal("hide");
			$scope.loaded=false;
			
			$http.post('/massmediaupload/delete',mediatodelete).then(function (data, status, headers, config) {			
				if (data.data.code==200){
					$scope.media_gallery_data=data.data;
					$scope.loaded=true;
					//$scope.current_page=1;	
				}
				else{
					$scope.media_gallery_data={};
					$scope.media_gallery_data.responselength=0;
					$scope.current_page=0;
				}
				
				if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.media_gallery_data.responselength){
					$scope.page_last_record=$scope.media_gallery_data.responselength;
				}
				else{
					$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
				}
				
				$scope.max_pages=Math.ceil($scope.media_gallery_data.responselength/$scope.filtering_params.limit);
						
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
				viewall();
				$scope.testingarray = [];
			})
		}
	
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
		console.log("locatorSearch------------$scope.selcted-------------",$scope.selcted);
		//return;
		$http.post('/massmediaupload/view/all',$scope.selcted).then(function (data, status, headers, config) {				
			if (data.data.code==200){
				$scope.media_gallery_data=data.data;
				console.log("33",$scope.media_gallery_data);
				$scope.loaded=true;
				$scope.current_page=1;	
			}
			else{
				$scope.media_gallery_data={};
				$scope.media_gallery_data.responselength=0;
				$scope.current_page=0;
			}
			
			if(($scope.filtering_params.offset+$scope.filtering_params.limit)>$scope.media_gallery_data.responselength){
				$scope.page_last_record=$scope.media_gallery_data.responselength;
			}
			else{
				$scope.page_last_record=($scope.filtering_params.offset+$scope.filtering_params.limit);					
			}
			
			$scope.max_pages=Math.ceil($scope.media_gallery_data.responselength/$scope.filtering_params.limit);
					
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
		$scope.loading1 = true;
		$http.get('/metaMetaTags/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				for (i in data.data.response){
					//if (data.data.response[i]._id == '54e7211a60e85291552b1187') {	// for ===== "5555" 
					if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 " 
						data.data.response.splice(i,1);
					}
				}
				$scope.mmts=data.data.response;
				//$scope.loading1 = true;
				for(key in $scope.mmts){
					if($scope.mmts[key]._id==$scope.miu.mmt){
						$scope.mts=$scope.mmts[key].MetaTags;
						$scope.loading1 = false;
						//alert("00000000000000000000000000$scope.loading1 = false;");
					}
				}
			}
			$scope.loading1 = false;
		})
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
		
	$scope.groupts=[];
	$scope.fetchgts=function(){
		$scope.loading = true;
		$scope.groupts = [];
		$http.get('/groupTags/view').then(function (data, status, headers, config) {
				if (data.data.response.length == 0) {
					$scope.loading = false;
				}
				if (data.data.code==200){
					$scope.gts=data.data.response;
					$scope.loading = false;
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
		$scope.loading = true;
		$http.get('/groupTags/view').then(function (data, status, headers, config) {			
				if (data.data.code==200){
					$scope.gts=data.data.response;
					$scope.loading = false;
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
			alert("isValid = "+isValid);
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
		console.log("Media Details", $scope.MediaDetail);
		console.log("Gr",data.data.result[0].GroupTags)
		$scope.GroupTagsDetail = [];
		$scope.DescriptorsDetail = [];
		if (data.data.result[0].GroupTags) {
			angular.forEach(data.data.result[0].GroupTags,function(value,key){
				console.log("View Details",value)
				if (value.GroupTagID != undefined || value.GroupTagID != null) {
					if (value.GroupTagID.status == 1) {
						$scope.GroupTagsDetail.push(value);
					}
					if (value.GroupTagID.status == 3) {
						$scope.DescriptorsDetail.push(value);
					}
				}
			
			});
		}
		//
		//console.log(data.data.result[0]);
		
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
		});
		$('#MediaDetail').modal('show');
	}
	
	//-- image resize
	
	$timeout(function(){
		$('.image-wrap').each(function(){
			height=$(this).parent().height();
			imgheight=$(this).children().first('img').height();
			imgwidth=$(this).children().first('img').width();
			$(this).children().first('img').css("height","180 !important");
			$(this).children().first('img').css("width","180 !important");
			$(this).children().first('img').css("margin","");
		})
	},4000);
	
	//added by parul to clear content of modal
	$scope.closeView=function(){
		$scope.MediaDetail={};
		$('#MediaContainer').html('');
		$scope.showDiv = true;
	}
	
	
	$scope.finaladd = function(){
		var tagInfo=[];
		i=0;
		for(key in $scope.testingarray){
			tagInfo[i]={};
			tagInfo[i].id=$scope.testingarray[key];
			tagInfo[i].title=$('#title-'+$scope.testingarray[key]).val();
			var prompt=$('#prompt-'+$scope.testingarray[key]).val();
			$scope.media_gallery_data.response[i].Prompt = prompt;
			if (prompt) {
				var promptArr1 = prompt.split(',');
				var promptArrFinal = [];
				var unique = promptArr1.filter(function(elem, index, self) {
					return index == self.indexOf(elem)
				})
				
				var arr = unique.filter(function(n){
					n= n.trim();
					if(n != " " && n.length > 0){
						promptArrFinal.push(n);
					}
				});
				console.log("Without Blank", promptArrFinal);
			
				var promptArr = promptArrFinal.join();
				tagInfo[i].prompt = promptArr;
			}else{
				tagInfo[i].prompt=$('#prompt-'+$scope.testingarray[key]).val();
			}
			
			tagInfo[i].Photographer=$('#Photographer-'+$scope.testingarray[key]).val();
			i++;
		}
		$scope.miu.media=tagInfo;
		$scope.miu.offset=0;
		$scope.miu.limit=20;
		//alert('clear console');
		console.log("Data to addedd-----", $scope.miu);
		console.log("----------------------ended addedd-----");
		if ($scope.miu) {
			$scope.loaded=false;
			
			$scope.actionModalloaded=true;
			$http.post('/massmediaupload/editall',$scope.miu).then(function (data, status, headers, config) {			
				if (data.data.code == 200){
					$scope.media_gallery_data=data.data;
				}
				else{
					$scope.media_gallery_data={};
				}	
				//$scope.filter=$scope.miu;
				$('#sure').modal('hide');
				//$scope.showFiltered();
				$timeout(function(){
					$scope.actionModalloaded=false;
				},1000)		
			});
		}
		
		
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
		
		
		
		
		
		function switch_theme(theme_name){
			//alert('switch_theme');
			$('#bs-css').attr('href','../assets/charisma/css/bootstrap-'+theme_name+'.css');
		}
		
		
		
		
		
		
		//-------------------------- for theme and links ==> STARTS---------------->
		viewall();
		console.log("Wrapup",$scope.miu)
		
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
	
	//////Code
	$scope.logResult = function(){
		console.log("Event triggered");
	}

	$scope.filterSub = function(){
		console.log('filterSub__showMore');
		$scope.arrayOfMedias=[];
		$scope.per_page = 48;
		$scope.page = 1;
		var queryParams = {};
		if(!$scope.ownerFSG){
			userFsgs=$scope.selectedFSGs;
		}
		queryParams = {page:$scope.page,per_page:$scope.per_page,mediaType:$scope.contentmediaType,userFSGs:userFsgs,groupTagID:$scope.selectedgt};
		PreviewService.mediaSearchEngine(queryParams).then(function (data1, status, headers, config) {
			if (data1.data.status=="success"){
				//alert(1);
				$scope.medias=data1.data.results;
				
				for(var i=0; i < $scope.medias.length ; i++){
					$scope.arrayOfMedias.push($scope.medias[i]._id);
				}
				//adding show_more pagination code on 27012015
				$timeout(function(){
					console.log('$scope.arrayOfMedias.length === ($scope.page*$scope.per_page)')
					console.log($scope.arrayOfMedias.length+' ==='+ ($scope.page*$scope.per_page));
					$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.per_page);
					$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
					$scope.previewIndex.setHeight();
				},100);
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$('#loading').hide();
				PreviewService.mediaAddViews({board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
				
				});
				if ($scope.selectedgt) {
					$('.keys').removeClass('activeKey');
					$('.keys #'+$scope.selectedgt).parent().addClass('activeKey');
				}
			}
			else{
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$scope.medias={};
				$scope.arrayOfMedias=[];
			}
			setTimeout(function(){
				$('#overlay2').hide();
				$('#overlayContent2').hide();
			},1000)
		});
	}
	
	$scope.setGT = function(gt){
		console.log('setGT()', gt);
		$('.keys').removeClass('activeKey');
		//console.log($('.keys #'+gt));
		$('.keys #'+gt).parent().addClass('activeKey');
		$scope.selectedgt = gt;
		$('#overlay2').show();
		$('#overlayContent2').show();
		$scope.filterSub();
	}		
	
	$scope.editMedia = function(media){
		console.log(typeof media._id);
		$scope.Media= {};
		$scope.collection ={};
		$http.get('/collections/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.collection=data.data.response;
				
			}	
		});
		$scope.domain={};
		$http.get('/domains/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.domain=data.data.response;
				
			}	
		})
		$http.post('/massmediaupload/viewMedia',{'ID':media._id}).then(function (data, status, headers, config) {
		$scope.Media._id =data.data.result[0]._id;
		//$scope.Media.Collection =data.data.result[0].Collection;
		//$scope.Media.Domains =data.data.result[0].Domains;
		//$scope.Media.Domains =$scope.domain[0];
		$scope.Media.TagType =data.data.result[0].TagType;
		$scope.Media.Title =data.data.result[0].Title;
		$scope.Media.Photographer =data.data.result[0].Photographer;
		//$scope.Media.GroupTags = data.data.result[0].GroupTags;
		$scope.Media.GroupTags = [];
		$scope.Media.Descriptors = [];
		if (data.data.result[0].GroupTags) {
			angular.forEach(data.data.result[0].GroupTags,function(value,key){
				console.log("!!!!!!!!!!!!!!!!!!",value)
				if (value.GroupTagID != undefined || value.GroupTagID != null) {
					if (value.GroupTagID.status == 1) {
						$scope.Media.GroupTags.push(value);
					}
					if (value.GroupTagID.status == 3) {
						$scope.Media.Descriptors.push(value);
					}
				}
			
			});
			console.log("Group tag info---------------------",$scope.Media.GroupTags);
		}
		
		$scope.Media.domain = $scope.domain;
		$scope.Media.collection = $scope.collection;
		
		angular.forEach($scope.domain,function(value,key){
			if (data.data.result[0].Domains) {
				if (value.DomainTitle == data.data.result[0].Domains.DomainTitle) {
					$scope.Media.Domains = $scope.domain[key];
				} 
			} else{
				$scope.Media.Domains = $scope.domain;
			}
		});
		
		angular.forEach($scope.collection,function(value,key){
			if(data.data.result[0].Collection){
				if (value.collectionTitle == data.data.result[0].Collection[0].collectionTitle) {
					$scope.Media.Collection = $scope.collection[key];
				} 
			} else{
				$scope.Media.Collection = $scope.collection;
			}
		});
		console.log(data.data.result[0]);
		console.log("grouptags", $scope.Media.GroupTags.GroupTagID)
		
		})
		$('#dialogContent').modal('show');
	}
	
	$scope.toggleDiv = function(){
		if($scope.showDiv == true){
			$scope.showDiv = false;
		} else{
			$scope.showDiv = true;	
		}
	}
	
	$scope.updateDetails = function(media){
		console.log("Media",media)
		$scope.actionModalloaded = true;
		$http.post('/massmediaupload/editMedia',{media: media}).then(function (data, status, headers, config) {
			console.log("Data updated",data);
			$timeout(function(){
				$scope.actionModalloaded = false;
			},1000)	
		});
		$('#MediaContainer').html('');
		
	}
	
	$scope.deleteDescriptor = function(media, descriptorId, descriptorTitle){
		if (descriptorId != undefined && descriptorId != null) {
			if (confirm("Do you want to delete this tag?")) {
				for(var loop=0; loop < $scope.media_gallery_data.response.length;loop++){
					if($scope.media_gallery_data.response[loop]._id == media._id){
						if ($scope.media_gallery_data.response[loop].Prompt) {
							var promptArr1 = $scope.media_gallery_data.response[loop].Prompt.split(',');
							
							var txt = (descriptorTitle).toLowerCase();
							var index = promptArr1.indexOf(txt);
							if (index > -1) {
								promptArr1.splice(index, 1);
							}
							$scope.media_gallery_data.response[loop].Prompt = promptArr1.join();
							console.log("Prompt---------------",$scope.media_gallery_data.response[loop].Prompt);
						}
					}
				};
			
				$scope.actionModalloaded = true;
				$http.post('/massmediaupload/deleteDescriptor',{mediaId: media._id, descriptorId: descriptorId, descriptorTitle: descriptorTitle}).then(function (data, status, headers, config) {
					console.log("Data removed",data);
					$timeout(function(){
						$scope.actionModalloaded = false;
					},1000)	
				});
				angular.forEach($scope.Media.GroupTags, function(value, key) {
					if(value.GroupTagID._id == descriptorId){
						$scope.Media.GroupTags.splice(key,1);
					}
				});
				angular.forEach($scope.Media.Descriptors, function(value, key) {
					if(value.GroupTagID._id == descriptorId){
						$scope.Media.Descriptors.splice(key,1);
					}
				});
				
			}
		}
		
	}
	
	$scope.addDetails = function(media,filter){
		var mediaId = media._id;
		$scope.addedTag.mmt = filter.mmt;
		$scope.addedTag.mt = filter.mt;
		$scope.addedTag.gt = filter.gt;
		console.log("Add Details",$scope.addedTag);
		if ($scope.Media.GroupTags) {
			var uniquenessFlag = false;
			for(var loop = 0; loop < $scope.Media.GroupTags.length; loop++){
				var value = $scope.Media.GroupTags[loop];
				if (value.GroupTagID._id == $scope.addedTag.gt) {
					uniquenessFlag = true;
					break;
				}
			}
			
			if(!uniquenessFlag){
				$scope.actionModalloaded = true;
				$http.post('/massmediaupload/addedTag',{mediaId: mediaId, addedTag: $scope.addedTag}).then(function (result, status, headers, config) {
					console.log("Data updated",result.data.msg);
					$http.post('/massmediaupload/viewMedia',{'ID':media._id}).then(function (data, status, headers, config) {
						$scope.Media.GroupTags = [];
						if (data.data.result[0].GroupTags) {
							angular.forEach(data.data.result[0].GroupTags,function(value,key){
								if (value.GroupTagID != undefined || value.GroupTagID != null) {
									if (value.GroupTagID.status == 1) {
										$scope.Media.GroupTags.push(value);
									}
								}
							});
						}
						
						$timeout(function(){
							$scope.actionModalloaded=false;
						},1000)
					});	
				});
			}
			else{
				alert("Already Exists");
				return;
			}
		}
	}
	
	$scope.clearlist = function(){
		$scope.keywordsSelcted = [];
		$scope.addAnotherTag = [];
		$scope.excludeWords = [];
	}
	
}).$inject = ["$scope","$http","$timeout","$upload","$location","loginService","$window","$q"];

//------------ directive for grouptags drop-down --autocomplete
module.directive('autoCompleteTagsPreview', function($timeout,$http) {
    return function(scope, iElement, iAttrs) {                        
		iElement.autocomplete({
			source: function(request,response){
			  
				//console.log(request);
				scope.groupta = [];
				scope.groupt = [];
				scope.keywordList = [];
				
				console.log("keywordsSelcted",scope.keywordsSelcted);
				scope.remove = function(keyword , index){
				      scope.keywordsSelcted.splice(index,1);
				      scope.groupt.splice(0, keyword);
				}
				scope.removeAt = function(keyword, index){
				      scope.addAnotherTag.splice(index,1);
				      scope.groupt.splice(0, keyword);
				}
				scope.removeEW = function(keyword, index){
				      scope.excludeWords.splice(index,1);
				      scope.groupt.splice(0, keyword);
				}
				
				$http.post('/groupTags/getallKeywords',{startsWith:request.term}).then(function(data,status,headers,config){
					if (data.data.code==200){
						scope.gts=data.data.response;
						for(i in scope.gts){
							scope.groupta.push({"id":scope.gts[i]._id,"title":scope.gts[i].GroupTagTitle})
							scope.groupt.push({"value":scope.gts[i]._id,"label":scope.gts[i].GroupTagTitle})
							for(j in scope.gts[i].Tags){
									scope.keywordList.push({"value":scope.gts[i]._id,"label":scope.gts[i].Tags[j].TagTitle,"description":scope.gts[i].GroupTagTitle})    
							}
						}
						if (scope.keywordsSelcted) {
							angular.forEach(scope.groupt, function(value, key) {
								console.log("--------------------------",value)
								angular.forEach(scope.keywordsSelcted, function(selected, key1) {
									console.log("value----------->", value.value);
									console.log("Seelet----------->", selected.id);
									if(value.value == selected.id) {
										scope.groupt.splice(key, 1);
										console.log("Working")
									}
								});
								
							});
						}
						if (scope.addAnotherTag) {
							angular.forEach(scope.groupt, function(value, key) {
								console.log("--------------------------",value)
								angular.forEach(scope.addAnotherTag, function(selected, key1) {
									console.log("value----------->", value.value);
									console.log("Seelet----------->", selected.id);
									if(value.value == selected.id) {
										scope.groupt.splice(key, 1);
										console.log("Working")
									}
								});
								
							});
						}
						response(scope.groupt);
					}
				})
				
			},
			select:function (event, ui) {                    
				scope.current__gt = ui.item.label;
				scope.current__gtID = ui.item.value;
				scope.selectedgt = ui.item.value;
				
				if(iAttrs.id == 'keyword'){
					scope.keywordsSelcted.push({title:ui.item.label,id:ui.item.value,from:'dropDown'});
				} else if (iAttrs.id == 'another') {
					scope.addAnotherTag.push({title:ui.item.label,id:ui.item.value,from:'dropDown'});
				} else if (iAttrs.id == 'exclude') {
					scope.excludeWords.push({title:ui.item.label,id:ui.item.value,from:'dropDown'});
				} else {
				}
				console.log("$scope.previewIndex.keywordsSelcted----",scope.selectedgt);
				
				scope.$apply();
				iElement.val('');
				return false;
			},
			focus:function (event, ui) {    
				return false;
			}                   
		})/*
		.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
			var flag = false;
			console.log("UI",ul);
			console.log("item", item);
			for(var i= 0; i<scope.keywordsSelcted.length; i++){
				if (scope.keywordsSelcted[i].id == item.value) {
					console.log('here --------------->',item.value)
					flag = true;
				}
			}
			if (flag) {
			 return $("<li>")
				  .data("item.autocomplete", item)
				  .remove();	
			}else{
				return $("<li>")
				  .data("item.autocomplete", item)
				  .append("<a>" + item.label + "</a>")
				  .appendTo(ul);
			}
		};*/
		
		/***-------This code overwrites autocompletes default filter function to filter results who starts whith the seaesc parameter-------***/
		$.ui.autocomplete.filter = function (array, term) {
			var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
			return $.grep(array, function (value) {
				return matcher.test(value.label || value.value || value);
			});
		};
		/****-------------------------------------------------------****/
    };
});
