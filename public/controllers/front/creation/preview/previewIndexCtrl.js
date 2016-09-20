var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('PreviewIndexCtrl',['$scope','$stateParams','$location','$timeout','loginService','$controller','PreviewService','$filter','$state','$rootScope', function($scope,$stateParams,$location,$timeout,loginService,$controller,PreviewService,$filter,$state,$rootScope){
	//module collabmedia: Pages management
	$scope.page = 1;
	$scope.per_page = 48;
	$scope.medias = [];

	$scope.previewIndex = (function(){
		var app = {
			page_id : $stateParams.page_id ? $stateParams.page_id : 0,
			chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0,
			keywordsSelcted : [],
			userGalleryMedia : [],
			userGalleryMedia1: [],
			headerImg: '' ,
			init : function(){
				//alert(1);
				console.log($rootScope.pageIndex);
				$rootScope.pageIndex = $rootScope.pageIndex ? $rootScope.pageIndex : 0;
				console.log($rootScope.pageIndex);
				$('body').removeClass('creation-section').removeClass('content-bg-pic').removeClass('page-bg-pic').removeClass('chapter-bg-pic');
				this.get_allFSG();
				this.init_variables();
                this.init_windowScroll();
				this.init__showMorePagination();
                //this.filterSub();
				this.init_headerPadding();
				this.init_mediaClick();
				this.getPageData();
				$timeout(function(){
					$scope.previewIndex.setHeight();
					$rootScope.showLoader = false;
				},2000);
				$timeout(function(){
					if ($state.current.name == "chapterPreview") {
						$scope.isChapterPreview = true;
						$scope.previewIndex.getChapterData();
					}
				},1)
				
				//testing array preview things
				$timeout(function(){
					$scope.setFlashInstant('Loading....' , 'success');
					$('#chapter-page-index1').toggle('down',function(){
						$('#chapter-page-index2').toggle('down');
					});
				},10000)
			},
			init_headerPadding : function(){
				$scope.$watch
				(
					function () {
						return $('header').outerHeight();
					},
					function (newValue, oldValue) {
						//alert(1)
						if (newValue != oldValue) {
							//console.log(newValue);
							$('.inner-container').css('top',newValue);
							$('.gallery-block').css('top',newValue);
							$('.sidebar-panel').css('top', newValue);
							$('.show-count').css('margin-top',newValue);
						}
					}
				);
			},
			init_variables : function(){
				var fsgFlag = 0;
				$scope.search1 = {};		
				userFsgs = {};
				$scope.contentmediaType = [];
				powerUserCase = 0;			
				$scope.arrayOfMedias=[];
				$scope.answerText = "";
				$scope.keywordsArr = [];
				$scope.small_header = false;
				$scope.del_grid_noteCase = false;
				$scope.tagta=[];
				$scope.gt_fromDwn= [];
				$scope.selectedFSGs = {};
			},
			init_windowScroll: function(){
				$(window).scroll(function() {    
					var scroll = $(window).scrollTop();
					var scrollHeight = $('body').prop('scrollHeight');
					var questBlock = $(".quest-block");
					var hdrOuterHeight = $('header').outerHeight();
					if (scroll >= hdrOuterHeight) {
						questBlock.slideUp('slow',function(){
							$('.tag-block').addClass('tag-block-scroll');
							if(!($('header').hasClass('header-bg'))){
								$('.tag-block').addClass('shadow-no');
								$('.tag-block').addClass('grey-bg');
							}
							$('.inner-container').css('top',$('.header').outerHeight());
							$('.gallery-block').css('top',$('.header').outerHeight());
							$('.sidebar-panel').css('top', $('.header').outerHeight());
							$('.show-count').css('margin-top',$('.header').outerHeight());
						});
						$scope.small_header = true;
						$scope.$apply();
					} else {
						questBlock.slideDown('slow',function(){
							$('.tag-block').removeClass('tag-block-scroll');
							$('.tag-block').removeClass('shadow-no');
							$('.tag-block').removeClass('grey-bg');				
							$('.inner-container').css('top',$('.header').outerHeight());
							$('.gallery-block').css('top',$('.header').outerHeight());
							$('.sidebar-panel').css('top', $('.header').outerHeight());
							$('.show-count').css('margin-top',$('.header').outerHeight());
						});
						$scope.small_header = false;
						$scope.$apply();
					}
						
				});
				$('.inner-container').css('top',$('.header').outerHeight());
				$('.gallery-block').css('top',$('.header').outerHeight());
				$('.sidebar-panel').css('top', $('.header').outerHeight());
				$('.show-count').css('margin-top',$('.header').outerHeight());
			},
			getPageData : function(){
				PreviewService.getPageData(this.chapter_id, this.page_id).success(function(data){
					//console.log(data)
					if ( data.status == 200 ) {
						$scope.previewIndex.pageData = data.result;
						$scope.previewIndex.headerImg = '/assets/Media/headers/aspectfit/'+data.result.HeaderImage ;
						if ( $scope.previewIndex.pageData.SelectionCriteria == 'keyword' && $scope.previewIndex.pageData.SelectedKeywords.length > 0 ) {
							$scope.previewIndex.keywordsSelcted = $scope.previewIndex.pageData.SelectedKeywords ;
							$scope.selectedgt = $scope.previewIndex.keywordsSelcted[$scope.previewIndex.keywordsSelcted.length-1].id;
							//$('.keys').removeClass('activeKey');
							//$('.keys #'+$scope.selectedgt).parent().addClass('activeKey');
						}
						//$scope.previewIndex.filterSub();
						$scope.previewIndex.userGallery();
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				});
			},
			init_mediaClick : function(){
				var search__elements = $('#search_gallery_elements');
				
				search__elements.on('click','.gallery-block .search_item',function(e){
					if (e) {
						e.preventDefault();
						e.stopPropagation();
					}
					//alert('Please Switch to view mode to view and edit page contents');
				})
			},
			setHeight : function(){
				$('.gallery-block ul li .hover-overlayer').height($('.gallery-block ul li').width());
				$('.gallery-block ul li').height($('.gallery-block ul li').width());
				$('.gallery-block ul li .gallery-pic-bx').height($('.gallery-block ul li').width());
				$('.gallery-block ul li a').height($('.gallery-block ul li').width());
				$('.gallery-block ul li img').height($('.gallery-block ul li').width());
			},
			init__showMorePagination : function(){
				$scope.per_page = 48;
				$scope.page = 1;
				$scope.arrayOfMedias=[];
				$scope.more = true;
				$scope.status_bar = "";
			},
			reset__views: function(){
				$(window).scrollTop(10);
				$(window).scrollTop(0);
				$('body').removeClass('sidebar-toggle');
				$('#search_gallery_elements').hide();
				//$('#discuss_gallery_elements').hide();
				$('#search_view').hide();
			},
			show_more : function () {
				$('#loading').show();
				$scope.page += 1;
				//$scope.previewIndex.filterSub__showMore();
				$scope.previewIndex.userGallery();
			},
			has_more : function () {
				//console.log('has_more');
				//alert($scope.more);
				return $scope.more;
			
			},
			filterSub : function(){
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
			},
			filterSub__showMore : function(){
				console.log('filterSub__showMore');
				if(!$scope.ownerFSG){
					userFsgs = $scope.selectedFSGs;
				}
				else{
					$('#slideTitleHeader li').each(function(){
						if ($(this).css('visibility')!='hidden') {
							$scope.selectedgt=$(this).attr('id');
						}
					});
				}
				//if( $scope.search1.tata2 != "" && $scope.search1.tata2 != null ){
				//	queryParams = {searchBy:'Descriptor',descValue:$scope.search1.tata2,title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:['Image'],page:$scope.page,per_page:$scope.per_page};
				//}
				//else{
				queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
				//}
				//queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
				PreviewService.mediaSearchEngine(queryParams).then(function (data1, status, headers, config) {	
					if (data1.data.status=="success"){
						$scope.arrayOfMedias = [];
						$scope.medias=data1.data.results;
						
						for(i in $scope.medias){
							$scope.arrayOfMedias.push($scope.medias[i]._id);
						}
						
						
						
						$timeout(function(){
							console.log('$scope.arrayOfMedias.length === ($scope.page*$scope.per_page)')
							console.log($scope.arrayOfMedias.length+' ==='+ ($scope.page*$scope.per_page));
							
							$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.per_page);
							$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
							$scope.previewIndex.setHeight();
						},200);
						$('#loading').hide();
						
						PreviewService.mediaAddViews({board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
						});
					}
					else{
						$('.loader_overlay').hide()
						$('.loader_img_overlay').hide()
						$scope.medias={};
						$scope.arrayOfMedias=[];
					}
				});
			},
			/*
			setShowMorePagination : function(){
				for(i in response){
					$scope.arrayOfMedias.push(response[i]._id);
				}
				var responseLength = $scope.arrayOfMedias.length;
				$scope.more = responseLength === $scope.per_page;
				$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(response.data.library.pagination.count) + " entries";
			},
			*/
			parseKeywords : function (){
				//console.log('in parseKeywords')
				var data = ($('#edit55').text().trim().split('Start typing and click on the keywords OR drop any media from the web or your drive.')).join(' ');
				if ( data.trim() != '' ) {
					var postData = {};
					postData.keywordsArr = $scope.previewIndex.keywordsSelcted;
					postData.inputText = $('.ansr-box-inr').text();
					PreviewService.keywordsParse(postData).then(function (data, status, headers, config) {
						if(data.status == 200){
							//console.log('here1');
							if (data.data.response.newGT.length>0) {
								//console.log('here2')
								for(var i=0; i<data.data.response.newGT.length; i++){
									$scope.previewIndex.keywordsSelcted.push(data.data.response.newGT[i])
								}
								setTimeout(function(){
									$('#lmn_slider').lemmonSlider('destroy');
									mediaSite.initSlider();
									$scope.selectedgt = $scope.previewIndex.keywordsSelcted[$scope.previewIndex.keywordsSelcted.length-1].id;
									$scope.previewIndex.filterSub();
									$('.keys').removeClass('activeKey');
									$('.keys').last().addClass('activeKey');
									$('#lmn_slider').scrollLeft($('#lmn_slider ul').width());
								},100);
							}
							if (data.data.response.removeGT.length>0) {
								var removeGT = data.data.response.removeGT;
								for(var j = 0; j< $scope.previewIndex.keywordsSelcted.length; j++){
									for(var k = 0; k< removeGT.length; k++){
										if ($scope.previewIndex.keywordsSelcted[j].id==removeGT[k].id) {
											$scope.previewIndex.keywordsSelcted.splice(j,1);
										}
									}
								}
								setTimeout(function(){
									$('#lmn_slider').lemmonSlider('destroy');
									mediaSite.initSlider();
									if ($scope.previewIndex.keywordsSelcted.length>0) {
										$scope.selectedgt = $scope.previewIndex.keywordsSelcted[$scope.previewIndex.keywordsSelcted.length-1].id;
									}else{
										$scope.selectedgt = '';
									}
									$scope.previewIndex.filterSub();
									$('.keys').removeClass('activeKey');
									$('.keys').last().addClass('activeKey');
									$('#lmn_slider').scrollLeft($('#lmn_slider ul').width())
								},100);
							}
						}
					});
				}
			},
			changeOwner : function(fsgFlag){
				$('#overlay2').show();
				$('#overlayContent2').show();
				setTimeout(function(){
					if(fsgFlag){
						$scope.ownerFSG = true;
						//userFsgs=$scope.pagedata[0].OwnerID.FSGs;
					}
					else{
						$scope.ownerFSG = false;
						userFsgs={};
					}
					$scope.previewIndex.filterSub();
				},10)  
			},
			setGT : function(gt){
				//console.log('setGT()');
				$('.keys').removeClass('activeKey');
				//console.log($('.keys #'+gt));
				$('.keys #'+gt).parent().addClass('activeKey');
				$scope.selectedgt = gt;
				$('#overlay2').show();
				$('#overlayContent2').show();
				$scope.previewIndex.filterSub();
			},
		/********************** functions from filterCtrl **********************************/
			get_allFSG: function(){
				$scope.fsgs=[];
				PreviewService.getAllFsg().then(function (data, status, headers, config){
					if (data.data.code==200){
						$scope.fsgs=data.data.response;
						for(var i = 0; i < $scope.fsgs.length; i++){
							//console.log($scope.fsgs[i].Title);
							if ($scope.fsgs[i].Title == "Country of Affiliation") {
							   $scope.countries = $scope.fsgs[i];
							}
						}
						$scope.currentCountries =[];
						$scope.restCountries=[];
						PreviewService.getUserData()
						.success(function (data1, status, headers, config) {				
							if (data1.code=="200"){
								$scope.userInfo = data1.usersession;
								$scope.currentCountries = [];
								$scope.restCountries =$scope.countries.Values;
							}
						});	
					}
				})
			},
			clearAllSelected : function(){
				$('.filter_checbox').each(function(){
					$(this).find('.radiobb').prop('checked',false);
				});
				//$('#demo-input-local').tokenInput('clear');
				$scope.currentCountries=[];
				$scope.restCountries = $scope.countries.Values;
				setTimeout(function(){
					//alert(1)
					$('.filter_checbox').each(function(){
						$scope.selectedFSGs={};
						if ($(this).find('.radiobb').prop('checked')   && $(this).find('.radiobb').attr('data')!='' && $(this).find('.radiobb').attr('data') != undefined) {
							//console.log('here');
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
					//console.log($scope.selectedFSGs);
					//$scope.getCountrySel();
					$('#overlay2').show();
					$('#overlayContent2').show();
					$scope.previewIndex.filterSub();
				},800);
			},
			getCountrySel : function(){
				$('#overlay2').show();
				$('#overlayContent2').show();
				var countries = $scope.currentCountries;
				if(countries.length != 0){
					var countryLast = countries[countries.length-1].valueTitle.trim();
					var userFsgs = $scope.selectedFSGs;
					userFsgs["Country of Affiliation"] = countryLast;
				}
				var queryParams = {};
				//alert(countryName);
				queryParams = {page :$scope.page, per_page:$scope.per_page, mediaType:$scope.contentmediaType, userFSGs:userFsgs, groupTagID:$scope.selectedgt};
				PreviewService.mediaSearchEngine(queryParams).then(function (data1, status, headers, config) {
					if (data1.data.status=="success"){
						$scope.medias=data1.data.results;
						$('#overlay2').hide();
						$('#overlayContent2').hide();
						for(i in $scope.medias){
							$scope.arrayOfMedias.push($scope.medias[i]._id);
						}
						PreviewService.mediaAddViews({board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
						});
					}
					else{
						$('#overlay2').hide();
						$('#overlayContent2').hide();
						$scope.medias={};
						$scope.arrayOfMedias=[];
					}
				});
			},
			changeMediaType : function(type){
				$('#overlay2').show();
				$('#overlayContent2').show();
				if (!($('.select_media[value='+type+']').prop('checked'))) {
					//console.log('in-if');
					var num =0;
					$('.select_media').each(function(){
						if($(this).prop('checked') ){
							num = num + 1;
						}
					});
					if ( num == 4 ) {
						$scope.contentmediaType = [];
					}else{
						$scope.contentmediaType = [];
						$('.select_media').each(function(){
							if($(this).prop('checked')){
								$scope.contentmediaType.push($(this).attr('value'));
							}
						});
					}
				}else{
					//console.log('in-else');
					var num =0;
					$('.select_media').each(function(){
						if($(this).prop('checked') ){
							num = num + 1;
						}
					});
					if ( num == 4 ) {
						$scope.contentmediaType = [];
					}else{
						$scope.contentmediaType = [];
						$('.select_media').each(function(){
							if($(this).prop('checked')){
								$scope.contentmediaType.push($(this).attr('value'));
							}
						});
					}
				}
				//console.log('-----------------------$scope.contentmediaType2----------------------------');
				//console.log($scope.contentmediaType);
				//console.log('-----------------------$scope.contentmediaType2----------------------------');
				$('#overlay2').show();
				$('#overlayContent2').show();
				$scope.previewIndex.filterSub();
			},
			removeSelected_country : function(country){
				$scope.restCountries.push(country);
				var index = $scope.currentCountries.indexOf(country);
				$scope.currentCountries.splice(index,1);
			},
			addToSelected_country : function(country){
				$scope.currentCountries.push(country);
				var index = $scope.restCountries.indexOf(country);
				$scope.restCountries.splice(index,1);
				$scope.ctryName='';
			},
			changeCss : function(id,sg,fsg){
				$('#overlay2').show();
				$('#overlayContent2').show();
				//console.log('----------changeCss-------------');
				var loopFlag = -1;
				if ($('#'+id).hasClass('all')) {
					//console.log('all case');
				}else{
					var allChecked=0;
					var allOptionsCount=0;
					var filterGroup=($('#'+id).attr('data')).split('~');
					//console.log('filterGroup = '+filterGroup);
					$('.filter_checbox').each(function(){
						if ($(this).find('.radiobb').attr('data') != '' && $(this).find('.radiobb').attr('data') != undefined ) {
							var attr1=$(this).find('.radiobb').attr('data');
							attr1=attr1.split('~');
							if (filterGroup[0] == attr1[0] && attr1[1] !== undefined) {
								allOptionsCount++;
								if ($(this).find('.radiobb').prop('checked') ) {
									if ($(this).find('.radiobb').attr('id') == id ) {}
									else{
									allChecked++
									}
								}else{
									if ($(this).find('.radiobb').attr('id') == id && ($(this).find('.radiobb').prop('checked') == false)) {
										allChecked++
									}
								}
							}
						} 
					})
					//console.log('allChecked == allOptionsCount'+allChecked +" =="+ allOptionsCount);
					if (allChecked == allOptionsCount) {
						$('.filter_checbox').each(function(){
							//console.log(1);
								if ($(this).find('.radiobb').hasClass('all')) {
									//console.log(2);
									if (filterGroup[0]==$(this).find('.radiobb').attr('name')) {
										///console.log(3);
										$(this).find('.radiobb').prop('checked',true)
									}
								}
						})
					}else{
						$('.filter_checbox').each(function(){
								if ($(this).find('.radiobb').hasClass('all')) {
									if (filterGroup[0]==$(this).find('.radiobb').attr('name')) {
										$(this).find('.radiobb').prop('checked',false)
									}
								}
						})
					}
				}		
				$scope.selectedFSGs={};
				setTimeout(function(){
					$('.filter_checbox').each(function(){
						if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data')!='' && $(this).find('.radiobb').attr('data') != undefined) {
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
					//console.log($scope.selectedFSGs);
					$('#overlay2').show();
					$('#overlayContent2').show();
					$scope.previewIndex.filterSub();
				},800);
			},
			getChapterData : function (){
				//PreviewService.getChapterData(this.chapter_id).success(function(data){
				PreviewService.getAllPages(this.chapter_id).success(function(data){
					console.log(data)
					if ( data.status == 200 ) {
						$scope.previewIndex.allPages = data.results ;
						for (var i = 0; i < $scope.previewIndex.allPages.length;i++) {
							if ($scope.previewIndex.allPages[i]._id == $scope.previewIndex.page_id) {
								$rootScope.pageIndex = i;
							}
						}
					}
					else{
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}
				})
			},
			navigateRight : function(){
				console.log('navigateRight')
				if ( ( $rootScope.pageIndex + 1 ) < $scope.previewIndex.allPages.length ) {
					//console.log('in -if')
					//console.log('id  == '+$scope.previewIndex.allPages[$rootScope.pageIndex + 1]._id)
					$location.path('/chapter-preview/' + $scope.previewIndex.chapter_id + '/' + $scope.previewIndex.allPages[$rootScope.pageIndex + 1]._id);
					$rootScope.pageIndex = $rootScope.pageIndex + 1;
					$rootScope.showLoader = true;
				}else{
					//console.log('in -else')
					//console.log('id  == '+$scope.previewIndex.allPages[0]._id)
					$location.path('/chapter-preview/' + $scope.previewIndex.chapter_id + '/' + $scope.previewIndex.allPages[0]._id);
					$rootScope.pageIndex  = 0;
					$rootScope.showLoader = true;
				}
			},
			
			navigateLeft : function(){
				console.log('navigateLeft')
				if ( ( $rootScope.pageIndex ) > 0 ) {
					//console.log('in -if')
					//console.log('id  == '+$scope.previewIndex.allPages[$rootScope.pageIndex - 1]._id)
					$location.path('/chapter-preview/' + $scope.previewIndex.chapter_id + '/' + $scope.previewIndex.allPages[$rootScope.pageIndex - 1]._id);
					$rootScope.pageIndex = $rootScope.pageIndex - 1;
					$rootScope.showLoader = true;
				}else{
					//console.log('in -else');
					//console.log('id  == '+$scope.previewIndex.allPages[$scope.previewIndex.allPages.length - 1]._id);
					$location.path('/chapter-preview/' + $scope.previewIndex.chapter_id + '/' + $scope.previewIndex.allPages[$scope.previewIndex.allPages.length - 1]._id);
					$rootScope.pageIndex  = $scope.previewIndex.allPages.length - 1;
					$rootScope.showLoader = true;
				}
			},
			userGallery : function(){
				var offset = ($scope.page - 1)*$scope.per_page;
				PreviewService.userGalleryMedia({pageId: this.page_id,offset:offset,per_page:$scope.per_page}).then(function (data1, status, headers, config) {
					if (data1.data.status==200){
						$scope.arrayOfMedias = [];
						if ($scope.page == 1) {
							$scope.medias = data1.data.result;
						}
						else{
							var result = data1.data.result;
							$scope.medias = $scope.medias.concat(data1.data.result);
							
						}
						
						
						for(i in $scope.medias){
							$scope.arrayOfMedias.push($scope.medias[i]._id);
						}
						
						$timeout(function(){	
							
							$scope.more = data1.data.selectedMediaCount != ($scope.medias.length);
							//$scope.more = 1;
							$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
							$scope.previewIndex.setHeight();
						},1000);
						$('.loader_overlay').hide()
						$('.loader_img_overlay').hide()
						$('#loading').hide();
					}
					
				});
				
				/*
				var offset = ($scope.page - 1)*$scope.per_page;
				PreviewService.userGalleryMedia({pageId: this.page_id,page:offset,per_page:$scope.per_page}).then(function (data1, status, headers, config) {
					if (data1.data.status==200){
						if ($scope.page == 1) {
							$scope.medias = data1.data.result;
							console.log("first : ",$scope.medias);
						}
						else{
							for(var i=0;i<data1.data.result.length;i++){
								$scope.medias.push(data1.data.result[i]);
							}
							
							console.log("media : ",$scope.medias);
						}
					}
					
				});*/
			},
			deleteGalleryMedia : function(mediaId){
				console.log("Delete : ", mediaId);	
				PreviewService.deleteGalleryMedia({pageId: this.page_id,mediaId: mediaId}).then(function (data1, status, headers, config) {
					if (data1.data.status==200){
						var index = $scope.previewIndex.getObjArrayIdxByKey($scope.medias,'_id',mediaId);
						//$scope.previewIndex.userGalleryMedia.splice(index,1);
						$scope.medias.splice(index,1);
						console.log("Deleted successfully")
					}
				});
			},
			getObjArrayIdxByKey : function(ObjArr , matchKey , matchVal){
				var idx;
				for( var loop = 0; loop < ObjArr.length; loop++ ){
				    if (ObjArr[loop].hasOwnProperty(matchKey)) {
					if(ObjArr[loop][matchKey] == matchVal){
					    idx = loop;
					    break;
					}
				    }
				}
				return idx;
			}
		};
		app.init();
		return app;
	})();

}]);