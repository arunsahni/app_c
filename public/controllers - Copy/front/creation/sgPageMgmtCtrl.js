var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('SgPageMgmtCtrl',['$scope','$stateParams','$location','loginService','SgPageService','$http','$timeout','$filter','$upload','$window', function($scope,$stateParams,$location,loginService,SgPageService,$http,$timeout,$filter,$upload,$window){
	//module collabmedia: Pages management
	$scope.SgPageMgmt = (function(){
		var app = {
			capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0, 
			chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0, 
			page_id : $stateParams.page_id ? $stateParams.page_id : 0,
			pageName : "",
			pageData : {},
			medias : [],
			fsgs : [],
			selectedMedia: [],
			mediaLimit: 30,
			prevMediaLimit: 30,
			contentmediaType: [],
			countries : [],
			currentCountries:[],
			remainingCountries:[],
			keywordList : [],
			keywordsSelcted : [],
			selectionType : '',
			canSelect : true,
			init : function(){
				$scope.firstAlert = true;
				startupCreate();
				$scope.selectedFSGs = {};
				startupCreate();
				$('body').removeClass('page-bg-pic').removeClass('chapter-bg-pic').addClass('creation-section').addClass('content-bg-pic');//.addClass('sg-page');
				$('[data-toggle="tooltip"]').tooltip();
				$('#content').removeClass('chapter').removeClass('boards').addClass('media');
				console.log(' --inside sg--Create ctrl -- ');
				this.init_dragDrop();
				this.getPageData();
				this.init_masonry();
				this.filterSub();
				this.get_allFSG();
				this.per_page = 40;
				//$scope.imgLoad = new imagesLoaded( document.querySelector('#container') );
				//createModule.initSlider();
				//$(document).mouseup(function (e){
				//	console.log(e.target);
				//	var slider = $("#slider1");
				//	//var toggleBtn = $('.toggle-icn');
				//
				//	if (!slider.is(e.target) && slider.has(e.target).length === 0 ) 
				//	{
				//		console.log('outside');
				//	}else{
				//		$scope.SgPageMgmt.setPageLimit()
				//		console.log('inside');
				//	}
				//	
				//});
				
			},
			isAllowed : function(){
				if( !this.chapter_id || !this.page_id ){
					$location.path('/manage-chapters');
					return;
				}
			},
			init_masonry: function(){
				console.log('init masonry');
				var container = $('#container');
				$scope.imgLoad = new imagesLoaded( document.querySelector('#container') );
				$timeout(function() {
					//imagesLoaded( document.querySelector('#container') , function(){
					$scope.imgLoad.on( 'always', function( instance ) {
						$timeout(function() {
							//alert(1);
							$scope.msnry = new Masonry(document.querySelector('#container') , {
							  itemSelector: '.item',
							  gutter: 10
							})
							$('#loader').hide().css({'opacity':'0'});
							for(var i = 0; i < $scope.SgPageMgmt.selectedMedia.length ; i++){
								$('#'+$scope.SgPageMgmt.selectedMedia[i]).addClass('item-selected');
							}
						}, 1);
					});
				}, 1);
			},
			reinit_masonry: function(){
				var container = $('#container');
				console.log('re-init masonry');
				//alert(2);
				$timeout(function(){
					$scope.msnry.destroy();
					$scope.SgPageMgmt.init_masonry();
				
				},1000)
			},
			init_dragDrop : function(){
				$(".test123").on("dragenter", function(event) {
					event.preventDefault();
					$('.popup-overlayer').show();
					$('.drag-popup').show();
				});
				$(".test123").on("dragover", function(event) {
					event.preventDefault();
					$('.popup-overlayer').show();
					$('.drag-popup').show();
				});
				
				$('.test123').on('dragleave',function(event){
					event.preventDefault();
					$('.popup-overlayer').hide();
					$('.drag-popup').hide();
				})
				$('body').on('dragleave',function(event){
					event.preventDefault();
					$('.popup-overlayer').hide();
					$('.drag-popup').hide();
				})
				$("html").on("drop", function(event) {
					event.preventDefault();
					$('.popup-overlayer').hide();
					$('.drag-popup').hide();
					event.dataTransfer = event.originalEvent.dataTransfer;
					var file = event.originalEvent.dataTransfer.files;          
					if (file.length == 0) {
					   alert('Please drop Image files .');
					}else if (file.length == 1) {
						if ((file[0].type).indexOf('image') != -1) {
							var sendFile = [];
							sendFile.push(file[0]);
							console.log(sendFile[0]);
							$scope.SgPageMgmt.uploadHeader(sendFile[0]);
						}else{
							alert(file.type+" not allowed...");
						}
					}else{
						alert('Please drop only one Image at a time');
					}
				});
			},
			setAllMedia : function(){
				this.selectionType = 'media';
				var msg = "Caution ! by performing this action you will loose your selected media";
				if ($scope.SgPageMgmt.selectedMedia.length > 0 && $scope.firstAlert) {
					//alert("90");
					if (window.confirm(msg)) {
						$scope.SgPageMgmt.setAllMedia_final();
						$scope.firstAlert = false;
					}
				}else{
					//alert("91");
					$scope.SgPageMgmt.setAllMedia_final();
				}
			},
			setAllMedia_final : function(){
				this.selectionType = 'media';
				$('#theme-btn').removeClass('active');
				$('#media-btn').removeClass('active');
				$('#all-media-btn').addClass('active');
				$scope.SgPageMgmt.canSelect = false;
				$('#container .item').removeClass('item-selected');
				$scope.SgPageMgmt.selectedMedia=[];
				//this.canSelect = true;
			},
			setMediaSelected : function(){
				this.selectionType = 'media';
				$('#media-btn').addClass('active');
				$('#theme-btn').removeClass('active');
				$('#all-media-btn').removeClass('active');
				this.canSelect = true;
			},
			setThemeSelected : function(){
				//alert("89");
				this.selectionType = 'keyword';
				var msg = "Caution ! by performing this action you will loose your selected media";
				if ($scope.SgPageMgmt.selectedMedia.length > 0 && $scope.firstAlert) {
					//alert("90");
					if (window.confirm(msg)) {
						$scope.SgPageMgmt.setThemeSelected_final();
						$scope.firstAlert = false;
					}
				}else{
					//alert("91");
					$scope.SgPageMgmt.setThemeSelected_final();
				}
			},
			setThemeSelected_final: function(){
				//alert("92");
				$('#theme-btn').addClass('active');
				$('#media-btn').removeClass('active');
				$('#all-media-btn').removeClass('active');
				$scope.SgPageMgmt.canSelect = false;
				$('#container .item').removeClass('item-selected');
				$scope.SgPageMgmt.selectedMedia=[];
			},
			setKey : function(key){
				console.log('setKey');
				$scope.current__gtID = key.id;
				$('#loader').show().css({'opacity':'1'});
				//$('#'+key.id).addClass('active-tag');
				this.filterSub();
				//console.log(key);
			},
			delKey : function(key){
				console.log('delKey');
				//console.log(key);
				for (var i = 0; i< $scope.SgPageMgmt.keywordsSelcted.length; i++ ) {
					if ($scope.SgPageMgmt.keywordsSelcted[i].id == key.id) {
						$scope.SgPageMgmt.keywordsSelcted.splice(i,1);
						break;
					}
				}
				if (key.id == $scope.current__gtID && $scope.SgPageMgmt.keywordsSelcted.length > 0 ) {
					$scope.current__gtID = $scope.SgPageMgmt.keywordsSelcted[$scope.SgPageMgmt.keywordsSelcted.length-1].id;
					$('#loader').show().css({'opacity':'1'});
					$scope.SgPageMgmt.filterSub();
				}else if($scope.SgPageMgmt.keywordsSelcted.length == 0){
					$scope.current__gtID = '';
					$('#loader').show().css({'opacity':'1'});
					$scope.SgPageMgmt.filterSub();
				}
				
			},
			getPageData : function(id){
				this.isAllowed();
				SgPageService.getPageData(this.chapter_id , this.page_id)
					.then(function(data){
						console.log("success",data);
						$scope.SgPageMgmt.pageData = data.data.result;
						$scope.SgPageMgmt.pageData.HeaderImage = $scope.SgPageMgmt.pageData.HeaderImage ? "/assets/Media/headers/aspectfit/"+$scope.SgPageMgmt.pageData.HeaderImage : "";
						if ($scope.SgPageMgmt.pageData.HeaderImage != '') {
							$('.upload.upload-block').removeClass('upload-nopic');
						}else{
							$('.upload.upload-block').addClass('upload-nopic');
						}
						if (data.data.result.SelectionCriteria == 'keyword') {
							console.log($scope.SgPageMgmt.pageData.SelectedKeywords);
							$scope.SgPageMgmt.keywordsSelcted = $scope.SgPageMgmt.pageData.SelectedKeywords;
							$scope.current__gtID = $scope.SgPageMgmt.keywordsSelcted[ $scope.SgPageMgmt.keywordsSelcted.length -1 ].id;
							this.selectionType = 'keyword';
							
							$('#loader').show().css({'opacity':'1'});
							$('.keys').removeClass('activeKey');
							$('.keys').removeClass('activeKey');
							$('.keys').last().addClass('activeKey');
							$('#keyword_slider').scrollLeft($('#keyword_slider ul').width())
							
							$('#theme-btn').addClass('active');
							$('#media-btn').removeClass('active');
							$('#all-media-btn').removeClass('active');
							$scope.SgPageMgmt.canSelect = false;
							$('#container .item').removeClass('item-selected');
							$scope.SgPageMgmt.selectedMedia=[];
							$scope.SgPageMgmt.filterSub();
						}else{
							$scope.SgPageMgmt.selectedMedia = $scope.SgPageMgmt.pageData.SelectedMedia ; 
							$scope.SgPageMgmt.selectionType = 'media';
							if( $scope.SgPageMgmt.selectedMedia.length == 0 ){
								$('#theme-btn').removeClass('active');
								$('#media-btn').removeClass('active');
								$('#all-media-btn').addClass('active');
							}else{
								$('#media-btn').addClass('active');
								$('#theme-btn').removeClass('active');
								$('#all-media-btn').removeClass('active');
								$scope.SgPageMgmt.canSelect = true;
							}
						}
						$scope.SgPageMgmt.pageName = $scope.SgPageMgmt.pageData.Title;
					});
			},
			onHeaderSelect : function(){
				this.isAllowed();
				var uploadHeader = $('#uploadHeader');
				var val = uploadHeader.val();
				val = angular.lowercase(val);
				if (!val.match(/(?:gif|jpg|png|bmp)$/)) {
					$scope.setFlashInstant('<span style="color:red">Selected file is not an image. Please select an image file to proceed.</span>' , 'success');
				}else{
					console.log($scope.myFile);
					$scope.SgPageMgmt.uploadHeader($scope.myFile);
				}
			},
			uploadHeader : function(file){
				$('#loader').show().css({'opacity':'1'});
				this.isAllowed();
				var fd = null;
				fd = new FormData();
				fd.append('file', file);
				fd.append('pageID', this.page_id);
				console.log("fd = ",fd);//return;
				SgPageService.uploadHeader(this.chapter_id , this.page_id , fd)
					.then(function(data){
						console.log(data);
						if (data.data.code == 404) {
							alert('something went wrong please try again');
							$('#crop-pop').hide();
							$('.popup-overlayer').hide();
							$timeout(function(){
								$('#loader').hide().css({'opacity':'0'});
							},500)
						}else{
							$timeout(function(){
								$timeout(function(){
									$('#loader').hide().css({'opacity':'0'});
								},500)
								console.log("success",data);
								$scope.cropImg=data.data.location;
								$('#crop-pop').show();
								$('.popup-overlayer').show();
							},1000);
						}
					});
			},
			closeCropPop: function(){
				$('#crop-pop').hide();
				$('.popup-overlayer').hide();
			},
			uploadCroppedHeader: function(){
				$('#loader').show().css({'opacity':'1'});
				console.log($scope.cropData);
				$scope.cropData.location = $scope.cropImg;
				$scope.cropData.pageID = this.page_id;
				SgPageService.cropHeader($scope.cropData)
				.then(function(data){
					console.log("success",data);
					$scope.SgPageMgmt.pageData.HeaderImage = "";
					$timeout(function(){
						$scope.SgPageMgmt.pageData.HeaderImage = data.data.location+'?adasd';
						$scope.SgPageMgmt.pageData.HeaderImage = $scope.SgPageMgmt.pageData.HeaderImage ? $scope.SgPageMgmt.pageData.HeaderImage : "";
						if ($scope.SgPageMgmt.pageData.HeaderImage != '') {
							$('.upload.upload-block').removeClass('upload-nopic');
						}else{
							$('.upload.upload-block').addClass('upload-nopic');
						}
					},100)
					$timeout(function(){$('#loader').hide().css({'opacity':'0'});},500);
					$('#crop-pop').hide();
					$('.popup-overlayer').hide();
					$(window).scrollTop(0);
				});
			},
			updatePageName : function (){
				this.isAllowed();
				SgPageService.updatePageName(this.chapter_id , this.page_id , $scope.SgPageMgmt.pageName)
				.then(function(data){
				});
			},
			filterSub : function(){
				$scope.arrayOfMedias=[];
				$scope.page = 1;
				var queryParams = {};
				if(!$scope.ownerFSG){
					userFsgs=$scope.selectedFSGs;
				}
				//queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
				//queryParams = {page:$scope.page,per_page:$scope.per_page,mediaType:$scope.contentmediaType,userFSGs:userFsgs,groupTagID:$scope.current__gtID};
				//queryParams = {page:$scope.page,per_page:$scope.per_page,mediaType:$scope.contentmediaType,userFSGs:userFsgs,groupTagID:$scope.selectedgt};
				queryParams = {page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID};
				$http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
					if (data1.data.status=="success"){
						$scope.SgPageMgmt.medias=data1.data.results;
						for(i in $scope.SgPageMgmt.medias){
							$scope.arrayOfMedias.push($scope.SgPageMgmt.medias[i]._id);
						}
						$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.SgPageMgmt.per_page);
						$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
						$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
						});
					}
					else{
						$scope.SgPageMgmt.medias={};
						$scope.arrayOfMedias=[];
					}
					$timeout(function(){
						$scope.SgPageMgmt.reinit_masonry();
					},500)
					$('#keyword_slider').find('li').removeClass('active-tag')
					$('#'+$scope.current__gtID).addClass('active-tag');
				});
			},
			manageSelection : function (data){
				if ($scope.SgPageMgmt.canSelect) {
					if ($('#'+data._id).hasClass('item-selected')) {
						var index = $scope.SgPageMgmt.selectedMedia.indexOf(data._id);
						if ( index != -1 ) {
							$scope.SgPageMgmt.selectedMedia.splice(index , 1);
							$('#'+data._id).removeClass('item-selected');
						}
					}else{
						if ($scope.SgPageMgmt.selectedMedia.length < $scope.SgPageMgmt.mediaLimit) {
							var index = $scope.SgPageMgmt.selectedMedia.indexOf(data._id);
							if ( index == -1 ) {
								$scope.SgPageMgmt.selectedMedia.push(data._id);
								$('#'+data._id).addClass('item-selected');
							}
						}else{
							alert('Media selectin limit reached!!')
						}
					}
					console.log($scope.SgPageMgmt.selectedMedia);
				}
			},
			mediaRangeChange: function(){
				console.log( parseInt( $scope.SgPageMgmt.mediaLimit)+' >= '+ parseInt( $scope.SgPageMgmt.selectedMedia.length) )
				console.log( parseInt(this.per_page)<parseInt($scope.SgPageMgmt.mediaLimit) );
				if(parseInt($scope.SgPageMgmt.per_page) < parseInt($scope.SgPageMgmt.mediaLimit) ) {
					alert("Media display limit cannot be less than media selection limit");
					$scope.SgPageMgmt.mediaLimit  = $scope.SgPageMgmt.per_page;
					return;
				}
				if ( parseInt( $scope.SgPageMgmt.mediaLimit) >=  parseInt( $scope.SgPageMgmt.selectedMedia.length) ) {
					$scope.SgPageMgmt.prevMediaLimit = $scope.SgPageMgmt.mediaLimit;
				}
				else{
					var msg = "Selected media count is more than the range selected. If you proceed ur selection will be lost."
					if(window.confirm(msg)){
						$scope.SgPageMgmt.selectedMedia=[];
						$('#container .item').removeClass('item-selected');
						$scope.SgPageMgmt.prevMediaLimit = $scope.SgPageMgmt.mediaLimit;
					}else{
						$scope.SgPageMgmt.mediaLimit = $scope.SgPageMgmt.prevMediaLimit;
					}
				}
			},
			setPageLimit : function(){
				console.log( parseInt(this.per_page)>parseInt($scope.SgPageMgmt.mediaLimit) )
				$timeout(function(){
				if ( parseInt($scope.SgPageMgmt.per_page) >= parseInt($scope.SgPageMgmt.mediaLimit)) {
					$('#loader').show().css({'opacity':'1'});
					$scope.SgPageMgmt.filterSub();
				}else{
					alert("Media display limit cannot be less than media selection limit");
					$scope.SgPageMgmt.per_page  = $scope.SgPageMgmt.mediaLimit;
				}
				},500)
			},
			filterMedia: function(){
				$('#loader').show().css({'opacity':'1'});
				$scope.SgPageMgmt.contentmediaType = [];
				$('.media-type .type').each(function () {
					if($(this).is(':checked')){
						$scope.SgPageMgmt.contentmediaType.push($(this).attr('value'))
					}
				});
				this.filterSub();
			},
			get_allFSG : function(){
				$http.get('/fsg/view').then(function (data, status, headers, config){
					if (data.data.code==200){
						$scope.SgPageMgmt.fsgs = data.data.response;
						console.log($scope.SgPageMgmt.fsgs);
						for(var i = 0; i < $scope.SgPageMgmt.fsgs.length; i++){
							if ($scope.SgPageMgmt.fsgs[i].Title == "Country of Affiliation") {
							   $scope.SgPageMgmt.countries = $scope.SgPageMgmt.fsgs[i];
							   $scope.SgPageMgmt.remainingCountries = $scope.SgPageMgmt.countries.Values;
							}
						}
					}
				})
			},
			addCountry: function(country){
				this.currentCountries.push(country);
				var index = this.remainingCountries.indexOf(country);
				this.remainingCountries.splice(index,1);
			},
			removeCountry: function(country){
				this.remainingCountries.push(country);
				var index = this.currentCountries.indexOf(country);
				this.currentCountries.splice(index,1);
			},
			changeCss : function(id,sg,fsg){
				var loopFlag = -1;
				console.log(id)
				if ($('#'+id).hasClass('all')) {
					console.log('all case');
				}else{
					var allChecked=0;
					var allOptionsCount=0;
					var filterGroup=($('#'+id).attr('data')).split('~');
					console.log('filterGroup = '+filterGroup);
					$('.filter_checbox').each(function(){
						if ($(this).find('.radiobb2').attr('data') != '' && $(this).find('.radiobb2').attr('data') != undefined ) {
							var attr1=$(this).find('.radiobb2').attr('data');
							attr1=attr1.split('~');
							if (filterGroup[0] == attr1[0] && attr1[1] !== undefined) {
								allOptionsCount++;
								if ($(this).find('.radiobb2').prop('checked') ) {
									if ($(this).find('.radiobb2').attr('id') == id ) {}
									else{
									allChecked++
									}
								}else{
									if ($(this).find('.radiobb2').attr('id') == id && ($(this).find('.radiobb2').prop('checked') == false)) {
										allChecked++
									}
								}
							}
						} 
					})
					console.log('allChecked == allOptionsCount'+allChecked +" =="+ allOptionsCount)
					if (allChecked == allOptionsCount) {
						$('.filter_checbox').each(function(){
							if ($(this).find('.radiobb2').hasClass('all')) {
								console.log(2);
								if ( filterGroup[0] == $(this).find('.radiobb2').attr('name') ) {
									console.log(3);
									$(this).find('.radiobb2').prop('checked',true)
								}
							}
						})
					}else{
						$('.filter_checbox').each(function(){
								if ($(this).find('.radiobb2').hasClass('all')) {
									if (filterGroup[0]==$(this).find('.radiobb2').attr('name')) {
										$(this).find('.radiobb2').prop('checked',false)
									}
								}
						})
					}
				}		
				$scope.selectedFSGs={};
				setTimeout(function(){
					$('.filter_checbox').each(function(){
						if ($(this).find('.radiobb2').prop('checked') && $(this).find('.radiobb2').attr('data')!='' && $(this).find('.radiobb2').attr('data') != undefined) {
							loopFlag++;
							var attr=$(this).find('.radiobb2').attr('data');
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
					$scope.SgPageMgmt.countrySearch();
				},800);
			},
			countrySearch: function(){
				var countries = $scope.SgPageMgmt.currentCountries;
				if(countries.length != 0){
					var countryLast = countries[countries.length-1].valueTitle.trim();
					$scope.selectedFSGs["Country of Affiliation"] = countryLast;
				}
				console.log($scope.selectedFSGs);
				$('#loader').show().css({'opacity':'1'});
				$scope.SgPageMgmt.filterSub();
			}/*,
			saveSG: function(){
				if ( this.selectionType == '' ) {
					$window.history.back();
				}
				else if (this.selectionType == 'keyword' && $scope.SgPageMgmt.keywordsSelcted.length < 1 ) {
					alert('Please select at least one keyword to proceed.');
				}
				else if (this.selectionType == 'media' && $scope.SgPageMgmt.selectedMedia.length < 1 ) {
					alert('Please select at least one media to proceed.');
				}
				else{
					console.log($scope.SgPageMgmt.keywordsSelcted);
					var ids = [];
					if (this.selectionType !== 'media') {
						//for(var i = 0 ; i < $scope.SgPageMgmt.keywordsSelcted.length ; i++){
						//	ids.push($scope.SgPageMgmt.keywordsSelcted[i].id);
						//}
						ids = $scope.SgPageMgmt.keywordsSelcted;
					}
					else{
						ids = $scope.SgPageMgmt.selectedMedia;
					}
					SgPageService.saveSettings(this.chapter_id , this.page_id ,{'selectionCriteria':this.selectionType,'ids':ids} ).then(function(data){
						if (data.data.status == 200) {
							$window.history.back();
						}else{
							alert('Oopss!! something went wrong.');
						}
					})
				}
			}*/
			,
			saveSG: function(){
				var ids = [];
				if ( this.selectionType == '' ) {
					$window.history.back();
				}
				else if (this.selectionType == 'keyword' && $scope.SgPageMgmt.keywordsSelcted.length < 1 ) {
					alert('Please select at least one keyword to proceed.');
					//this.selectionType = 'media';
					//$window.history.back();
					$location.path('/manage-pages/'+this.capsule_id+'/'+this.chapter_id);
				}
				else if (this.selectionType == 'media' && $scope.SgPageMgmt.selectedMedia.length < 1 ) {
					//alert('Please select at least one media to proceed.');
					//$window.history.back();
					$location.path('/manage-pages/'+this.capsule_id+'/'+this.chapter_id);
				}
				else{
					console.log($scope.SgPageMgmt.keywordsSelcted);
					//var ids = [];
					if (this.selectionType !== 'media') {
						ids = $scope.SgPageMgmt.keywordsSelcted;
					}
					else{
						ids = $scope.SgPageMgmt.selectedMedia;
					}
					SgPageService.saveSettings(this.chapter_id , this.page_id ,{'selectionCriteria':this.selectionType,'ids':ids} ).then(function(data){
						if (data.data.status == 200) {
							//$window.history.back();
							$location.path('/manage-pages/'+$scope.SgPageMgmt.capsule_id+'/'+$scope.SgPageMgmt.chapter_id);
						}else{
							alert('Oopss!! something went wrong.');
						}
					})
				}
			}
		};
		app.init();
		return app;
	})();
	/*
	//$watchCollection for reordering
	$scope.$watchCollection("PagesMgmt.pages", function(newValue , oldValue) {  
		"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.PagesMgmt.reorder()
	});
	*/
}]);