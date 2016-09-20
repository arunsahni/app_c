var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('filterCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$filter){    
    
	/*
		Action : conditional show and hide searchGallery and discuss page
	
	*/
	//alert(2)
	$scope.selectedFSGs={}
	// added by parul 21 dec
	/*
	$scope.setDefaultFilters=function(){
		$timeout(function(){
			//alert(2)
			//console.log('$scope.fsgs');
			//console.log($scope.fsgs);
			//console.log('$scope.userInfo.FSGsArr');
			//console.log($scope.userInfo.FSGsArr);
			for (i in $scope.fsgs) {
				for (x in $scope.userInfo.FSGsArr){
					if ($scope.fsgs[i].Title!="Country of Affiliation") {
						if ($scope.userInfo.FSGsArr[x].keyval==$scope.fsgs[i].Title) {
							//console.log('here 1')
							for (j in $scope.fsgs[i].Values ){
								for(y in $scope.userInfo.FSGsArr[x].values){
									if ($scope.fsgs[i].Values[j].valueTitle==$scope.userInfo.FSGsArr[x].values[y]) {
										$('#'+$scope.fsgs[i].Values[j]._id).prop('checked',true);
									}
								}
							}
						}
					}
				}
			}
			if ($scope.userInfo.Settings[0].Users != '' && $scope.userInfo.Settings[0].Users != undefined) {
				$('#'+$scope.userInfo.Settings[0].Users).prop('checked',true);
				
				if( $scope.userInfo.Settings[0].Users == "powerUser" ){
					$scope.powerUser = true;
					powerUserCase=1;
				}
				
			}
			
			if ($scope.userInfo.Settings[0].Prefrence != '' && $scope.userInfo.Settings[0].Prefrence != undefined) {
				$('#'+$scope.userInfo.Settings[0].Prefrence).prop('checked',true);
				
				
			}
			if ($scope.userInfo.Settings[0].MotivationType != '' && $scope.userInfo.Settings[0].MotivationType != undefined) {
				$('#'+$scope.userInfo.Settings[0].MotivationType).prop('checked',true);
			}
			if ($scope.userInfo.Settings[0].MediaType != '' && $scope.userInfo.Settings[0].MediaType != undefined) {
				$('#'+$scope.userInfo.Settings[0].MediaType).prop('checked',true);
				
				if( $scope.userInfo.Settings[0].MediaType == 'radioLink' ){
					$scope.contentmediaType='Link';
				}
				else if( $scope.userInfo.Settings[0].MediaType == 'radioMontage' ){
					$scope.contentmediaType='Montage';
				}
				else if( $scope.userInfo.Settings[0].MediaType == 'radioImage' ){
					$scope.contentmediaType='Image';
				}
				else if( $scope.userInfo.Settings[0].MediaType == 'radioNotes' ){
					$scope.contentmediaType='Notes';
				}
				else if( $scope.userInfo.Settings[0].MediaType == 'radioVideo' ){
					$scope.contentmediaType='Video';
				}
				else if( $scope.userInfo.Settings[0].MediaType == 'radioAudio' ){
					$scope.contentmediaType='Audio';
				}
				else{
					//do nothing
				}
			}
		},1000);
	}
	$scope.setDefaultFilters();
	*/
	
	$scope.set__defaultValueInSelectedFSGs = function(){
		$scope.selectedFSGs={};
        var loopFlag = -1;
		setTimeout(function(){
			$('.filter_checbox').each(function(){
				if ($(this).find('.radiobb').prop('checked')   && $(this).find('.radiobb').attr('data')!='' && $(this).find('.radiobb').attr('data') != undefined) {
					loopFlag++;
					var attr=$(this).find('.radiobb').attr('data');
					attr=attr.split('~');
					if (attr[1] != 'undefined'){
						if (loopFlag == 0) {
							$scope.selectedFSGs[attr[0]]=attr[1];
						}
						else{
							if ($scope.selectedFSGs[attr[0]] == undefined) {
								$scope.selectedFSGs[attr[0]] = attr[1];
							}else{
								$scope.selectedFSGs[attr[0]] = $scope.selectedFSGs[attr[0]]+','+attr[1];                
							}
						}	
					}
					
				}  
			});
			console.log("-----default fsg data = ",$scope.selectedFSGs);
			//$scope.filterSub();
			//console.log('$scope.selectedFSGs'+$scope.selectedFSGs);
        },800);
	}
	
	$scope.setDefaultFilters=function(){
		$timeout(function(){
			//alert(2)
			//console.log('$scope.fsgs');
			//console.log($scope.fsgs);
			//console.log('$scope.userInfo.FSGsArr');
			//console.log($scope.userInfo.FSGsArr);
			for (i in $scope.fsgs) {
				for (x in $scope.userInfo.FSGsArr2){
					//console.log('$scope.fsgs[i].Title = ',$scope.fsgs[i].Title);
					if ($scope.fsgs[i].Title!="Country of Affiliation") {
						//console.log("val = ",$scope.userInfo.FSGsArr2[x]+"=="+$scope.fsgs[i].Title)
						//if ($scope.userInfo.FSGsArr2[x]==$scope.fsgs[i].Title) {
						if (x==$scope.fsgs[i].Title) {	
							//alert("m here");
							//console.log('here 1')
							for (j in $scope.fsgs[i].Values ){
								//alert('inside 3rd for');
								var fsgArrVal=($scope.userInfo.FSGsArr2[x]).split(',');
								//console.log('fsgArrVal = ',fsgArrVal)
								//console.log('$scope.userInfo.FSGsArr2[x] = ',$scope.userInfo.FSGsArr2[x])
								for(y in fsgArrVal){
									if ($scope.fsgs[i].Values[j].valueTitle==fsgArrVal[y]) {
										$('#'+$scope.fsgs[i].Values[j]._id).prop('checked',true);
									}
								}
							}
						}
					}
				}
			}
			
			if ($scope.userInfo.Settings[0].Users != '' && $scope.userInfo.Settings[0].Users != undefined) {
				$('#'+$scope.userInfo.Settings[0].Users).prop('checked',true);
				
				if( $scope.userInfo.Settings[0].Users == "powerUser" ){
					$scope.powerUser = true;
					powerUserCase=1;
				}
				
			}
			
			if ($scope.userInfo.Settings[0].Prefrence != '' && $scope.userInfo.Settings[0].Prefrence != undefined) {
				$('#'+$scope.userInfo.Settings[0].Prefrence).prop('checked',true);
				
				
			}
			if ($scope.userInfo.Settings[0].MotivationType != '' && $scope.userInfo.Settings[0].MotivationType != undefined) {
				$('#'+$scope.userInfo.Settings[0].MotivationType).prop('checked',true);
			}
			if ($scope.userInfo.Settings[0].MediaType != '' && $scope.userInfo.Settings[0].MediaType != undefined && $scope.userInfo.Settings[0].MediaType.length != 0) {
				//$('#'+$scope.userInfo.Settings[0].MediaType).prop('checked',true);
				
				for (i in $scope.userInfo.Settings[0].MediaType) {
					$('#'+$scope.userInfo.Settings[0].MediaType[i]).prop('checked',true);
				}
				$('.select_media').each(function(){
					if($(this).prop('checked')){
						$scope.contentmediaType.push($(this).attr('value'));
					}
				});
				//if( $scope.userInfo.Settings[0].MediaType == 'radioLink' ){
				//	$scope.contentmediaType='Link';
				//}
				//else if( $scope.userInfo.Settings[0].MediaType == 'radioMontage' ){
				//	$scope.contentmediaType='Montage';
				//}
				//else if( $scope.userInfo.Settings[0].MediaType == 'radioImage' ){
				//	$scope.contentmediaType='Image';
				//}
				//else if( $scope.userInfo.Settings[0].MediaType == 'radioNotes' ){
				//	$scope.contentmediaType='Notes';
				//}
				//else if( $scope.userInfo.Settings[0].MediaType == 'radioVideo' ){
				//	$scope.contentmediaType='Video';
				//}
				//else if( $scope.userInfo.Settings[0].MediaType == 'radioAudio' ){
				//	$scope.contentmediaType='Audio';
				//}
				//else{
				//	//do nothing
				//}
			}else{
				$('.select_media').each(function(){
					$(this).prop('checked',true);
				});
				$scope.contentmediaType = [];
			}
			$scope.set__defaultValueInSelectedFSGs();
			//console.log('$scope.selectedFSGs');
			//console.log($scope.selectedFSGs);
		},1000);
		
	}
	$scope.setDefaultFilters();
	
	$scope.opensearchContainerif = function(){
	    if($('#search_elements').css('display')=='none'){
		$scope.opensearchContainer()
	    }
	    setFilterBoxHeight()
	}
	
	$scope.onDiscussPage = false;
	$scope.onSearchPage = false;
	$scope.opensearchContainer = function(){
		if ($('.search-view').css('display') == "none") {
			$scope.opensearchContainer_final();
		}
		else{
			if ($('#grid').css('display')=='none') {
				if ( $('.search-view #search-media-tray li').length < 15) {
					$scope.add_toTray_fromPlatform()
					$scope.opensearchContainer_final();
				}else{
					$('#tary_full_onClose_openSearch').show();
				}
				
			}
			else{
				if (((4-$('#grid').find('.addnote').length) + $('.search-view #search-media-tray li').length) <= 15) {
					$scope.add_toTray_fromPlatform();
					console.log('--here--')
					$scope.opensearchContainer_final();
				}
				else{
					$('#tary_full_onClose_openSearch').show();
				}
			}
		}
	}
	
	$scope.opensearchContainer_final = function(){
		$scope.switch_class_normal();
		var test = angular.element()
		$('.image-selector').html('<ul id="search-media-tray" class="avatarlist clearfix">'+$('#media-tray-elements').html()+'</ul>');
		
		
		//$('#search-media-tray').html($('#media-tray-elements').html());	
		
		//alert("sync....");
		if($('#search_elements').css('display')!='none'){
		    $scope.onDiscussPage = true;
			$scope.onSearchPage = false;
			$scope.isOnSearchActPage = false;
			$scope.isOnDiscussActPage = false;
			
			$('#search_elements').fadeOut(400,function(){
				$scope.__openDiscussPage();
				//$('#search-media-tray').html($('#media-tray-elements').html());
				//alert("opening discuss page!");
				//$('#discuss_elements').fadeIn();	
				//$('#search_elements thumbs').html("")
				//$('#search_elements thumbs').html("");
				//$('.avatarlist').html("");
				//$('.avarrow-left').hide()
				//$('.avatarlist').css('margin-left','0px');
				//$('.avarrow-right').hide()			
				//$('.filtersssss').css('visibility','hidden');
			})
		}
		else{
			$scope.onDiscussPage = false;
			$scope.onSearchPage = true;
			
			$scope.isOnSearchActPage = false;
			$scope.isOnDiscussActPage = false;
			
		    $('#discuss_elements').fadeOut(400,function(){
				$scope.__openSearchPage();
				//$('#search-media-tray').html($('#media-tray-elements').html());
				//alert("opening search page!");
				//$('#thumbs,#search_elements').fadeIn();
				//$('.filtersssss').css('visibility','visible');
		    })
		}
		$('.holder_bulb').html("");
		$('#holder-box').html("");
		$('#holder-box').show();
		var grid_li = [];
		for (i=0;i<4;i++) {
			grid_li[i] = angular.element('<a href="javascript:void(0)" ng-click="openNote_mctrl()" onClick="openNote($(this))" class="addnote drop-here"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a>');
			grid_li[i] = $compile(grid_li[i])($scope);
		}
		
		
		//$('#grid').html('<li data-row="1" data-col="1" data-sizex="1" data-sizey="1"><a href="javascript:void(0)" class="addnote"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a></li><li data-row="1" data-col="2" data-sizex="1" data-sizey="1"><a href="javascript:void(0)" class="addnote"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a></li><li data-row="2" data-col="1" data-sizex="1" data-sizey="1"><a href="javascript:void(0)" class="addnote"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a></li><li data-row="2" data-col="2" data-sizex="1" data-sizey="1"><a href="javascript:void(0)" class="addnote"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a></li>');
		$('#grid').find('li').each(function(){
			$(this).html(grid_li[$(this).index()]);
		})
		$('#discuss_list .image-selector li').each(function(){
			//console.log('------------------------------------------------------');
			//console.log($(this));
			$(this).find('a').attr('onClick','openMediaDetail_discuss($(this))')
			//$compile($(this).html())($scope)
		})
		$('#grid').hide();
		$scope.changePT();
	}
	var setFilterBoxHeight = function(){
	    var clientH = $( window ).height();
		var headT = $("#head-top").height();
		var calc = clientH - headT;
	    $('#mCSB_1').css({'max-height': calc});
		$('#content_scroll').css({'height': calc});
	}
	/*
		Action : filter
	
	*/
	$scope.getCountrySel = function(){
		$('.loader_overlay').show()
		$('.loader_img_overlay').show()
		//alert("called - show loader");
		//$("input[type=button]").click(function () {
			var countryName = "";
			if(countryName)
				countryName = $(this).siblings("input[type=text]").val();
			/* Select only last element from comma separated string */
			//if(countryName){
				var countryLast = countryName.split(",").pop();
				var userFsgs = $scope.selectedFSGs;
				if(countryLast)
					userFsgs["Country of Affiliation"] = countryLast;
				//alert("hello");
			//}
			alert(countryLast);
			//$http.post('/media/searchEngine',{title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType}).then(function (data1, status, headers, config) {
			var queryParams = {};
			if( $scope.search1.tata2 != "" && $scope.search1.tata2 != null ){
				queryParams = {searchBy:'Descriptor',descValue:$scope.search1.tata2,title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
			}
			else{
				queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
			}
			$http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
				if (data1.data.status=="success"){
					//alert("m here-----if");
					$scope.medias=data1.data.results;
					$('.loader_overlay').hide()
					$('.loader_img_overlay').hide()
					for(i in $scope.medias){
						$scope.arrayOfMedias.push($scope.medias[i]._id);
					}
					$timeout(function(){
						setMediaContainer()
					},1300)
					$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
					});
				}
				else{
					$('.loader_overlay').hide()
					$('.loader_img_overlay').hide()
					$scope.medias={};
					$scope.arrayOfMedias=[];
				}
			});
		   //});
    };
	
	var powerUserCase=0;
	var powerFlag = 0;
	$scope.changePower=function(powerFlag){
		setTimeout(function(){
			//alert("val = "+$scope.powerUser)
			//if ($scope.powerUser) {
			if (powerFlag) {
				$scope.powerUser = true;
				powerUserCase=1;
			}
			else{
				$scope.powerUser = false;
				powerUserCase=0;
			}
			$scope.filterSub();
		},10)  
    }
	
//	$scope.contentmediaType=null;
//    $scope.contentmediaType=null;
//    $scope.changeMediaType = function(type){
//	    if(type=='All'){
//		    $scope.contentmediaType=null;
//	    }
//	    else{
//		    $scope.contentmediaType=type;
//	    }
//	    $scope.filterSub();
//    }
    
	
	
	/*________________________________________________________________________
    * @Date:      	20 April 2015
    * @Method :   	changeMediaType
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-
    * @Purpose:   	This is used for sending selected media types to search engine(on client request for allowing multiselect in media types)
    * @Param:     	-
    * @Return:    	yes
    _________________________________________________________________________
    */
    //parul 20042015
	$scope.contentmediaType = [];
	$scope.changeMediaType = function(type){
	//    if(type=='All'){
	//	    //$scope.contentmediaType=null;
	//		alert($('.select_media:eq(0)').prop('checked'));
	//		if (!($('.select_media:eq(0)').prop('checked'))) {
	//			$('.select_media').each(function(){
	//				$(this).prop('checked',true);
	//			});
	//			$scope.contentmediaType = [];
	//		}else{
	//			
	//			$('.select_media').each(function(){
	//				$(this).prop('checked',false);
	//			});
	//			$scope.contentmediaType = [];
	//		}
	//    }
	    //else{
			//alert($('.select_media[value='+type+']').prop('checked'));
			if (!($('.select_media[value='+type+']').prop('checked'))) {
				console.log('in-if');
				//$scope.contentmediaType.push(type);
				//$('.select_media[value='+type+']').prop('checked',true);
				var num =0;
				$('.select_media').each(function(){
					//console.log($(this).index);
					
					if($(this).prop('checked') ){
						num = num + 1;
					}
				});
				console.log('num========================'+num);
				if ( num == 4 ) {
					//$('.select_media:eq(0)').prop('checked',true);
					$scope.contentmediaType = [];
				}else{
					//$('.select_media:eq(0)').prop('checked',false);
					$scope.contentmediaType = [];
					$('.select_media').each(function(){
						if($(this).prop('checked')){
							$scope.contentmediaType.push($(this).attr('value'));
						}
					});
				}
			}else{
				console.log('in-else');
				var num =0;
				$('.select_media').each(function(){
					if($(this).prop('checked') ){
						num = num + 1;
					}
				});
				if ( num == 4 ) {
					//$('.select_media:eq(0)').prop('checked',true);
					$scope.contentmediaType = [];
				}else{
					//$('.select_media:eq(0)').prop('checked',false);
					$scope.contentmediaType = [];
					$('.select_media').each(function(){
						if($(this).prop('checked')){
							$scope.contentmediaType.push($(this).attr('value'));
						}
					});
				}
			}
	    //}
		console.log('-----------------------$scope.contentmediaType2----------------------------');
		console.log($scope.contentmediaType);
		console.log('-----------------------$scope.contentmediaType2----------------------------');
	    $scope.filterSub();
    }
    
	var fsgFlag = 0;
	$scope.changeOwner =function(fsgFlag){
        setTimeout(
		function(){
			//alert("$scope.ownerFSG = "+$scope.ownerFSG);
			//if($scope.ownerFSG){
			if(fsgFlag){
				$scope.ownerFSG = true;
				userFsgs=$scope.boarddata[0].OwnerID.FSGs;
				//alert("Receiver's preferences = "+JSON.stringify(userFsgs));
			}
			else{
				$scope.ownerFSG = false;
				userFsgs={};
				//alert("Your preferences = "+userFsgs);
			}
			$scope.filterSub();
		},10)  
    }
    
	
	
	$scope.selectedFSGs={};
	
        // function edited by parul 21 december
    $scope.changeCss = function(id,sg,fsg){
		//$('#'+id).prop('checked',true);
        //alert(id);
		var loopFlag = -1;
		if ($('#'+id).hasClass('all')) {
			
		}else{
			//alert($('#'+id).prop('checked'));
			var allChecked=0;
			var allOptionsCount=0;
			var filterGroup=($('#'+id).attr('data')).split('~');
			console.log('filterGroup = '+filterGroup);
			$('.filter_checbox').each(function(){
				if ($(this).find('.radiobb').attr('data') != '' && $(this).find('.radiobb').attr('data') != undefined ) {
					var attr1=$(this).find('.radiobb').attr('data');
					//console.log(attr1);
					attr1=attr1.split('~');
					//alert($(this).attr('id'));
					if (filterGroup[0] == attr1[0] && attr1[1] !== undefined) {
						allOptionsCount++;
						if ($(this).find('.radiobb').prop('checked') ) {
							if ($(this).find('.radiobb').attr('id') == id ) {}
							else{
							allChecked++
							}
						}else{
							if ($(this).find('.radiobb').attr('id') == id && ($(this).find('.radiobb').prop('checked') == false)) {
								//alert($(this).find('.radiobb').prop('checked'));
								//alert(1);
								allChecked++
							}
						}
					}
				} 
			
			})
		
		console.log('allChecked == allOptionsCount'+allChecked +" =="+ allOptionsCount)
		if (allChecked == allOptionsCount) {
			//alert(filterGroup[0]);
			$('.filter_checbox').each(function(){
				//if ($(this).find('.radiobb').attr('data') != ''  ) {
					if ($(this).find('.radiobb').hasClass('all')) {
						//alert(1)
						//var attr1=$(this).find('.radiobb').attr('data');
						//attr1=attr1.split('~');
						if (filterGroup[0]==$(this).find('.radiobb').attr('name')) {
							//alert(2);
							$(this).find('.radiobb').prop('checked',true)
						}
					}
				//}
			})
		}else{
			$('.filter_checbox').each(function(){
				//if ($(this).find('.radiobb').attr('data') != ''  ) {
					if ($(this).find('.radiobb').hasClass('all')) {
						//alert(1)
						//var attr1=$(this).find('.radiobb').attr('data');
						//attr1=attr1.split('~');
						if (filterGroup[0]==$(this).find('.radiobb').attr('name')) {
							//alert(2);
							$(this).find('.radiobb').prop('checked',false)
						}
					}
				//}
			})
		}
		}		
		
		$scope.selectedFSGs={};
        setTimeout(function(){
			// $('.filter_checbox').each(function(){
			//	if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data')!='' ) {
			//		//alert(1);
			//		var attr=$(this).find('.radiobb').attr('data');
			//		attr=attr.split('~');
			//		var fields={};
			//		fields[attr[0]]=attr[1];
			//		//$scope.selectedFSGs.push({attr[0]:attr[1]})
			//		$scope.selectedFSGs[attr[0]]=attr[1];                
			//		//alert("again");
			//	}  
			//});
            $('.filter_checbox').each(function(){
				if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data')!='' && $(this).find('.radiobb').attr('data') != undefined) {
					loopFlag++;
					var attr=$(this).find('.radiobb').attr('data');
					//alert(attr);
					attr=attr.split('~');
					//var fields={};
					//fields[attr[0]]=attr[1];
					//$scope.selectedFSGs.push({attr[0]:attr[1]})
					//if (attr[1] != 'undefined' || attr[1] != undefined){
					if (attr[1] != 'undefined'){
						//alert(attr[1]);
						if (loopFlag == 0) {
							
							$scope.selectedFSGs[attr[0]]=attr[1];
							//loopFlag--;
						}
						else{
							if ($scope.selectedFSGs[attr[0]] == undefined) {
								$scope.selectedFSGs[attr[0]] = attr[1];
							}else{
								$scope.selectedFSGs[attr[0]] = $scope.selectedFSGs[attr[0]]+','+attr[1];                
							}
						}	
					}
					
				}  
			});
			console.log($scope.selectedFSGs);
			$scope.filterSub();
			//console.log('$scope.selectedFSGs'+$scope.selectedFSGs);
        },800);
		
        
    }
	
	var setMediaContainer = function(){
		console.log("----setting media container----");
	    $('.searchlis').each(function(){
			$(this).height($('.searchlis').first().width())
	    })
    
	    $('.searchlis a').each(function(){
			$(this).height($(this).width())
			height=$(this).height()	
	    })
	    
	    jQuery('.text_wrap').each(function(){
			if($(this).children().first().prop('tagName')!='IFRAME'){
				$(this).prev().hide();
			}
	    })
			    
	    $( ".text_wrap p img" ).parent().addClass("innerimg-wrap")
	    var i=0;
	    $('.innerimg-wrap').each(function(){
			height=$(this).parent().height();
			imgheight=$(this).children().first('img').height();
			imgwidth=$(this).children().first('img').width();
			
			
			if(imgheight<imgwidth){
				$(this).children().first('img').height(height)
				$(this).children().first('img').css('width','auto !important')
			}
			else if(imgwidth<imgheight){
				$(this).children().first('img').width(height)
				$(this).children().first('img').css('height','auto !important')
			}
			else{
				$(this).children().first('img').width(height)
				$(this).children().first('img').css('height','auto !important')
			}
			i++;
	    })
	};
	
	//var setMediaContainer = function(){}
	
	$scope.arrayOfMedias=[];
    $scope.init__showMorePagination = function(){
		$scope.per_page = 48;
		$scope.page = 1;
		$scope.arrayOfMedias=[];
		//$scope.families = [];
		$scope.more = true;
		$scope.status_bar = "";
	}
	$scope.init__showMorePagination();
	
	$scope.show_more = function () {
		//alert("m here");
		$('#loading').show();
        $scope.page += 1;
		$scope.filterSub__showMore();
    }

    $scope.has_more = function () {
        return $scope.more;
    }
	
    var userFsgs={};
    $scope.filterSub = function(searchFlag){
		//alert();
		$('.loader_overlay').show()
		$('.loader_img_overlay').show()
		if(!$scope.ownerFSG){
			userFsgs=$scope.selectedFSGs;
			//alert("in if"+$scope.ownerFSG+"-----"+JSON.stringify($scope.selectedFSGs));
		}
		else{
			//alert("in else"+$scope.ownerFSG+"-----"+$scope.selectedFSGs);
			//alert("your preferences-2 = "+userFsgs);
		}
		/*
		$('#slideTitleHeader li').each(function(){
			if ($(this).css('visibility')!='hidden') {
				$scope.selectedgt=$(this).attr('id');
			}
		});
		*/
		//added by manishp on 08012015 to resolve search by theme case
		if(searchFlag == 'search-by-theme'){
			//using boardDirective we set the selected theme (GT)
		}
		else{
			$('#slideTitleHeader li').each(function(){
				if ($(this).css('visibility')!='hidden') {
					$scope.selectedgt=$(this).attr('id');
				}
			});
		}
		$scope.init__showMorePagination();
		//console.log("After",$scope.selectedgt)
		//$http.post('/media/searchEngine',{title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page}).then(function (data1, status, headers, config) {
		
		var queryParams = {};
		if( $scope.search1.tata2 != "" && $scope.search1.tata2 != null ){
			queryParams = {searchBy:'Descriptor',descValue:$scope.search1.tata2,title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
		}
		else{
			queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
		}
		$http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {

			if (data1.data.status=="success"){
				$scope.init__showMorePagination();
				$scope.medias=data1.data.results;
				for(i in $scope.medias){
					$scope.arrayOfMedias.push($scope.medias[i]._id);
					
				}
				$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.per_page);
				//alert($filter('number')($scope.arrayOfMedias.length));
				$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
				
				//var responseLength = $scope.arrayOfMedias.length;
				//$scope.more = $scope.medias.length === $scope.per_page;
				//$scope.families = $scope.families.concat(response.data.library.families);
				//$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
				
				
				//adding show_more pagination code on 27012015
				
				$timeout(function(){
					setMediaContainer()
				},1300)
				
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$('#loading').hide();
				
				$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
				
				});
			}
			else{
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$scope.medias={};
				$scope.arrayOfMedias=[];
			}
		});
    }
	
	$scope.filterSub__showMore = function(searchFlag){
		//$('.loader_overlay').show()
		//$('.loader_img_overlay').show()
		if(!$scope.ownerFSG){
			userFsgs=$scope.selectedFSGs;
		}
		//added by manishp on 08012015 to resolve search by theme case
		if(searchFlag == 'search-by-theme'){
			//using boardDirective we set the selected theme (GT)
		}
		else{
			$('#slideTitleHeader li').each(function(){
				if ($(this).css('visibility')!='hidden') {
					$scope.selectedgt=$(this).attr('id');
				}
			});
		}
		
		//console.log("After",$scope.selectedgt)
		//$http.post('/media/searchEngine',{title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page}).then(function (data1, status, headers, config) {
		if( $scope.search1.tata2 != "" && $scope.search1.tata2 != null ){
			queryParams = {searchBy:'Descriptor',descValue:$scope.search1.tata2,title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
		}
		else{
			queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
		}	
		$http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {	
			if (data1.data.status=="success"){
				$scope.arrayOfMedias = [];
				$scope.medias=data1.data.results;
				//adding show_more pagination code on 27012015
				//$scope.setShowMorePagination($scope.medias);
				for(i in $scope.medias){
					$scope.arrayOfMedias.push($scope.medias[i]._id);
				}
				$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.per_page);
				$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
				//adding show_more pagination code on 27012015
				
				$timeout(function(){
					setMediaContainer()
					$('#loading').hide();
				},1300)
				
				//$('.loader_overlay').hide()
				//$('.loader_img_overlay').hide()
				
				
				$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
				
				});
			}
			else{
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$scope.medias={};
				$scope.arrayOfMedias=[];
			}
		});
    }
	
	$scope.setShowMorePagination = function(response){
		
		
		for(i in response){
			$scope.arrayOfMedias.push(response[i]._id);
			
		}
		
		var responseLength = $scope.arrayOfMedias.length;
		$scope.more = responseLength === $scope.per_page;
		//$scope.families = $scope.families.concat(response.data.library.families);
		$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(response.data.library.pagination.count) + " entries";
	};	
	
	//function added by parul 21 dec
	/*
	$scope.saveDefault= function(title){
		//alert(title);
		var fsg=[];
		 $('.filter_checbox').each(function(){
				if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data').indexOf(title)!=-1) {
					fsg.push($(this).find('.radiobb').attr('data'));                
				}  
			});
			var data={
				fsgTitle:title,
				values:fsg
			}
		 //console.log(data);
		 $http.post('/user/fsgArrUpdate',data).then(function (data, status, headers, config) {
				$scope.setFlashInstant('Your search prefrences have been saved successfully!' , 'success');
		});
		
	}
	*/
	$scope.saveDefault= function(title){
		//alert(title);
		var data={};
		var fsg='';
		 $('.filter_checbox').each(function(){
				if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data').indexOf(title)!=-1) {
					//alert(1);
					var titleNvalue=[];
					var titleNvalue=($(this).find('.radiobb').attr('data')).split('~');
					
					if(fsg==''){
						fsg=titleNvalue[1];
					}else{
						fsg=fsg+','+titleNvalue[1];
					}
					
				}  
			});
			data.title=title;
			data.value=fsg;
			
		 //console.log(data);
		 $http.post('/user/fsgArrUpdate',data).then(function (data, status, headers, config) {
				$scope.setFlashInstant('Your search prefrences have been saved successfully!' , 'success');
		});
		
	}
	
	//funcion added by parul
	/*
	$scope.saveCon=function(){
		var newData= $('#demo-input-local').tokenInput('get');
		var fsg=[];
		for (i in newData) {
			fsg.push("'Country of Affiliation'"+"~"+newData[i].name);
		}
		// $('.filter_checbox').each(function(){
		//		if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data').indexOf(title)!=-1) {
		//			fsg.push($(this).find('.radiobb').attr('data'));                
		//		}  
		//	});
		var data={
			fsgTitle:'Country of Affiliation',
			values:fsg
		}
		//console.log(data);
		$http.post('/user/fsgArrUpdate',data).then(function (data, status, headers, config) {
			$scope.setFlashInstant('Your search prefrences have been saved successfully!' , 'success');
		});
	}
	*/
	
	$scope.saveCon=function(){
		var newData= $('#demo-input-local').tokenInput('get');
		
		var fsg='';
		for (i in newData) {
			if (i==0) {
				fsg=newData[i].name;	
			}else{
				fsg=fsg+','+newData[i].name;
			}
			
		}
		// $('.filter_checbox').each(function(){
		//		if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data').indexOf(title)!=-1) {
		//			fsg.push($(this).find('.radiobb').attr('data'));                
		//		}  
		//	});
		var data={
			title:'Country of Affiliation',
			value:fsg
		}
		//console.log(data);
		$http.post('/user/fsgArrUpdate',data).then(function (data, status, headers, config) {
			$scope.setFlashInstant('Your search prefrences have been saved successfully!' , 'success');
		});
	}
	
	//function added by parul 6 jan 2015
	$scope.saveSetting=function(){
		var fields={};
		fields.MediaType=[];
		if ($('#powerUser').prop('checked')) {
			fields.Users="powerUser";
		}else{
			fields.Users="allUser";
		}
		
		if ($('#yourFSG').prop('checked')) {
			fields.Prefrence="powerUser";
		}
		else{
			fields.Prefrence="ownerFSG";
		}
		if ($('#radio5').prop('checked')) {
			fields.MotivationType="radio5";
		}
		else{
			fields.MotivationType="radio6";
		}
		if ($('#radioAll').prop('checked')) {
			fields.MediaType.push("radioAll");
		}
		if($('#radioImage').prop('checked')){
			fields.MediaType.push("radioImage");
		}
		if($('#radioLink').prop('checked')){
			fields.MediaType.push("radioLink");
		}
		if($('#radioNotes').prop('checked')){
			fields.MediaType.push("radioNotes");
		}
		if($('#radioMontage').prop('checked')){
			fields.MediaType.push("radioMontage");
		}
		if($('#radioVideo').prop('checked')){
			fields.MediaType.push("radioVideo");
		}
		//alert(1);
		//console.log(fields);
		$http.post('/user/saveSettings',fields).then(function (data, status, headers, config) {
			$scope.setFlashInstant('Your search settings have been saved successfully!' , 'success');
		});
	}
	//end


/*________________________________________________________________________
*  @Date:      	27 Jan 2015
*  @Method :   	clearAllSelected
*  Created By: 	smartData Enterprises Ltd
*  Modified On:	-
*  @Purpose:   	This function is used to clear all selected filter options.
*  @Param:     	
*  @Return:    	no
_________________________________________________________________________
*/
	$scope.clearAllSelected=function(){
		$('.filter_checbox').each(function(){
			$(this).find('.radiobb').prop('checked',false);
		});
		$('#demo-input-local').tokenInput('clear');
		setTimeout(function(){
			//alert(1)
            $('.filter_checbox').each(function(){
				$scope.selectedFSGs={};
				if ($(this).find('.radiobb').prop('checked')   && $(this).find('.radiobb').attr('data')!='' && $(this).find('.radiobb').attr('data') != undefined) {
					console.log('here');
					loopFlag++;
					var attr=$(this).find('.radiobb').attr('data');
					attr=attr.split('~');
					if (attr[1] != 'undefined'){
						if (loopFlag == 0) {
							
							$scope.selectedFSGs[attr[0]]=attr[1];
						}
						else{
							if ($scope.selectedFSGs[attr[0]] == undefined) {
								$scope.selectedFSGs[attr[0]] = attr[1];
							}else{
								$scope.selectedFSGs[attr[0]] = $scope.selectedFSGs[attr[0]]+','+attr[1];                
							}
						}	
					}
					
				}  
			});
			console.log($scope.selectedFSGs);
			//$scope.getCountrySel();
			$scope.filterSub();
        },800);
	}
	
	
	/*________________________________________________________________________
		* @Date:      	19 Feb 2015
		* @Method :   	filterSub__descriptor
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used for search by descriptor feature.
		* @Param:     	2
		* @Return:    	
	_________________________________________________________________________
	*/
	 //BY Parul 19022015
	
	$scope.filterSub__descriptor=function(value,searchFlag){
		//console.log(search_by+'_______'+value);
		//alert();
		$('.loader_overlay').show()
		$('.loader_img_overlay').show()
		if(!$scope.ownerFSG){
			userFsgs=$scope.selectedFSGs;
			//alert("your preferences-2 = "+userFsgs);
		}
		/*
		$('#slideTitleHeader li').each(function(){
			if ($(this).css('visibility')!='hidden') {
				$scope.selectedgt=$(this).attr('id');
			}
		});
		*/
		//added by manishp on 08012015 to resolve search by theme case
		if(searchFlag == 'search-by-theme'){
			//using boardDirective we set the selected theme (GT)
		}
		else{
			$('#slideTitleHeader li').each(function(){
				if ($(this).css('visibility')!='hidden') {
					$scope.selectedgt=$(this).attr('id');
				}
			});
		}
		$scope.init__showMorePagination();
		//console.log("After",$scope.selectedgt)
		$http.post('/media/searchEngine',{searchBy:'Descriptor',descValue:value,title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page}).then(function (data1, status, headers, config) {
			if (data1.data.status=="success"){
				$scope.init__showMorePagination();
				$scope.medias=data1.data.results;
				for(i in $scope.medias){
					$scope.arrayOfMedias.push($scope.medias[i]._id);
					
				}
				$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.per_page);
				//alert($filter('number')($scope.arrayOfMedias.length));
				$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
				
				//var responseLength = $scope.arrayOfMedias.length;
				//$scope.more = $scope.medias.length === $scope.per_page;
				//$scope.families = $scope.families.concat(response.data.library.families);
				//$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
				
				
				//adding show_more pagination code on 27012015
				
				$timeout(function(){
					setMediaContainer()
				},1300)
				
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$('#loading').hide();
				
				$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
				
				});
			}
			else{
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$scope.medias={};
				$scope.arrayOfMedias=[];
			}
		});
	}
	//END
	
		
});
