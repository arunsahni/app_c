var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('indexCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter,$state,PreviewService){    
	$('body').removeClass('creation-section').removeClass('content-bg-pic');
	//initialize default common variables here
	$scope.search1 = {};		//1) used in filtersub__showmore
	userFsgs = {};				//1) used in filtersub__showmore
	powerUserCase = 0;			//1) used in filtersub__showmore
	$scope.page_id = $stateParams.page_id ? $stateParams.page_id : 0;
	$scope.chapter_id = $stateParams.chapter_id ? $stateParams.chapter_id : 0;
	
	console.log($rootScope.pageIndex);
	$rootScope.pageIndex = $rootScope.pageIndex ? $rootScope.pageIndex : 0;
	console.log($rootScope.pageIndex);
	$timeout(function(){
		if ($state.current.name == "chapterView") {
			$scope.isChapterPreview = true;
			$scope.getChapterData();
		}
	},1)
	
	
	$scope.answerText = "";
	$scope.keywordsArr = [];
	$scope.small_header = false;
	$scope.del_grid_noteCase = false;
	$scope.tagta=[];
	$scope.gt_fromDwn= [];
	$('body').removeClass('creation-section').removeClass('content-bg-pic').removeClass('page-bg-pic').removeClass('chapter-bg-pic');
	$('.toggle-menu').jPushMenu();
/*________________________________________________________________________
* @Date:      	12 jun 2015
* @Method :   	--
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	getting list of meta tags.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$http.get('/metaMetaTags/view').then(function (data, status, headers, config) {
        if (data.data.code==200){
			for (i in data.data.response){
				//if (data.data.response[i]._id == '54e7211a60e85291552b1187') {	// for ===== "5555" 
				if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 " 
					data.data.response.splice(i,1);
				}
			}
            $scope.mmt=data.data.response;
        }
        else{
            $scope.mmt={};
        }
    })  
/*****************************************END****************************/


/*________________________________________________________________________
* @Date:      	26 May 2015
* @Method :   	setMediaId
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used set clicked media's id toperform actions.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.setMediaId = function(media){
        $scope.mediasData=media;
		console.log('====================================');
		console.log($scope.mediasData);
	}
/*****************************************END****************************/


/*________________________________________________________________________
* @Date:      	8 jun 2015
* @Method :   	setMediaId__mannualy
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used set clicked media's id to perform actions.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.setMediaId__mannualy = function(id){
        $http.post('/media/viewMedia',{ID:id}).then(function(response){
			var data = response.data.result[0];
			console.log(data);
			$scope.mediasData = {};
			$scope.mediasData._id = data._id;
			$scope.mediasData.MediaID = data._id;
			$scope.mediasData.value = {};
			$scope.mediasData.value.Title = data.Title?data.Title:null;
			$scope.mediasData.value.Prompt = data.Prompt?data.Prompt:null;
			$scope.mediasData.value.Locator = data.Locator?data.Locator:null;	
			$scope.mediasData.value.Title = data.Title? data.Title:null;
			$scope.mediasData.value.URL = data.Location[0].URL?data.Location[0].URL:null;
			$scope.mediasData.value.MediaType = data.MediaType?data.MediaType:null;
			$scope.mediasData.value.ContentType = data.ContentType?data.ContentType:null;	
			$scope.mediasData.value.UploadedOn = data.UploadedOn?data.UploadedOn:null;		
			$scope.mediasData.value.UploaderID = data.UploaderID?data.UploaderID:null;			
			$scope.mediasData.value.Content = data.Content?data.Content:null;	//added on 30092014-Link case
			$scope.mediasData.value.thumbnail = data.thumbnail?data.thumbnail:null;	//added on 21122014-Montage case
			$scope.mediasData.value.IsPrivate = data.IsPrivate?data.IsPrivate:null;	//added on 05022015-Private Media Case
			
			$scope.mediasData.value.PostsBestFSGCount = 0;
			$scope.mediasData.value.PostsCount = 0;
			
			$scope.mediasData.value.StampsBestFSGCount = 0;
			$scope.mediasData.value.StampsCount = 0;
			 
			$scope.mediasData.value.ViewsCount = 0;
			if(data.ViewsCount) 
				$scope.mediasData.ViewsCount = data.ViewsCount?data.ViewsCount:null;
			$scope.mediasData.value.MaxFSGSort = 0;
			$scope.mediasData.value.AvgFSGSort = 0;
			$scope.mediasData.value.MediaScore = 0;
			setTimeout(function(){
				if ($('.holder-act').css('display') == 'none') {
					console.log('in steMediaIdd_uploadCase setting page flag');
					$scope.setPageFlag('ST',$scope.mediasData.value.MediaType);
				}
			},1000);
			
			if ( $scope.del_grid_noteCase == true ) {
				$scope.del_grid_noteCase = false;
				$scope.addMedia();
			}
			console.log('====================================');
			console.log($scope.mediasData);
		})
	}
/*****************************************END****************************/

	
/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	reset__views
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is hide all other displays.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.reset__views = function(){
	$(window).scrollTop(10);
	$(window).scrollTop(0);
	$('body').removeClass('sidebar-toggle');
	$('#search_gallery_elements').fadeOut(150);
	$('#discuss_gallery_elements').fadeOut(150);
	$('#search_view').fadeOut(150);
	$('#discuss_view').fadeOut(150);
}
/*****************************************END****************************/

	
/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	switch__toDiscuss
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is hide all other displays and only show discuss page.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.switch__toDiscuss = function(){
	$scope.has_more_discuss = false;
	$scope.reset__views();
	$('#discuss_gallery_elements').fadeIn(150);
	$scope.sync_discussTray();
	$scope.pageNo_discuss=1;
	$scope.newdata = null;
	$scope.init__Discuss();
}
/*****************************************END****************************/
	
/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	switch__toDiscuss
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is hide all other displays and only show discuss page.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.switch__toDiscussView = function(){
	$scope.reset__views();
	$('#discuss_view').fadeIn(150);
}
/*****************************************END****************************/

/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	switch__toDiscuss
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is hide all other displays and only show discuss page.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.close__DiscussView = function(){
	$('#holder-discuss').html('');
	$scope.switch__toDiscuss();
}
/*****************************************END****************************/

/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	prior_switch__toSearch
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This function is run before switch__toSearch() in search view to add media
* 				.on platform to back to tray
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.prior_switch__toSearch = function(){
	if ($('#grid').css('display')=='none') {
		if ( $scope.countOfTrayMedia < 15) {
			if (!$scope.showAddImage) {
				$scope.add_toTray_fromPlatform();
			}
			$scope.switch__toSearch();
		}else{
			$('#tary_full_onClose').show();
		}
		
	}
	else{
		if (((4-$('#grid').find('.addnote').length) + $scope.countOfTrayMedia) <= 15) {
			$scope.add_toTray_fromPlatform();
			console.log('--here--');
			$scope.switch__toSearch();
		}
		else{
			$('#tary_full_onClose').show();
		}
	}
}
/*****************************************END****************************/


	
/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	switch__toSearch
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is hide all other displays and only show search page.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.switch__toSearch = function(){
	$scope.small_header = false;
	$scope.reset__views();
	$scope.reset_grid_holderBox();
	$scope.showCloseSingle = false;
	$scope.showAddImage = false;
	$scope.showCloseSingle = false;
	$scope.showAddImage = false;
	$('#search_gallery_elements').fadeIn(150);
	//$('.quest-block').slideDown('slow',function(){
	$('.quest-block').fadeIn(150);
		$('.tag-block').removeClass('tag-block-scroll');
		$('.tag-block').removeClass('shadow-no');
		$('.tag-block').removeClass('grey-bg');	
		$scope.small_header = false;
		$('.sidebar-panel').css('top', $('.header').outerHeight());
		$('.gallery-block').hide();
		$('.gallery-block').css('top',$('.header').outerHeight());
		$('.gallery-block').fadeIn(150);
		//$('.ansr-box-inr').trigger('focus');
	//})
	$scope.setHeight();
}
/*****************************************END****************************/


/*--------------Creating common scope for multiple controllers------*/
$controller('searchGalleryCtrl',{$scope : $scope });
$controller('discussCtrl',{$scope : $scope });
$controller('mediaTrayCtrl',{$scope : $scope });
$controller('searchViewCtrl',{$scope : $scope });
$controller('montageCtrl',{$scope : $scope });
$controller('dragDropCtrl',{$scope : $scope });
$controller('uploadMediaCtrl',{$scope : $scope });
$controller('uploadLinkEngine',{$scope : $scope });
$controller('recorderCtrl',{$scope : $scope });
$controller('boardCtrl',{$scope : $scope });
$controller('filterCtrl',{$scope : $scope });
/*-------------------------------END--------------------------------*/
	
/*________________________________________________________________________
* @Date:      	26 May 2015
* @Method :   	prior_close_holderAct
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to close both search and discuss view and redirect to disscuss page.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.prior_close_holderAct = function(medid){
		if ($('#grid').css('display')=='none') {
			if ( $scope.countOfTrayMedia < 15) {
				if (!$scope.showAddImage) {
					$scope.add_toTray_fromPlatform();
				}
				$scope.close_holderAct();
			}else{
				$('#tary_full_onClose').show();
			}
			
		}
		else{
			if (((4-$('#grid').find('.addnote').length) + $scope.countOfTrayMedia) <= 15) {
				$scope.add_toTray_fromPlatform();
				console.log('--here--')
				$scope.close_holderAct();
			}
			else{
				$('#tary_full_onClose').show();
			}
		}
	}
/*****************************************END****************************/

	
/*________________________________________________________________________
* @Date:      	26 May 2015
* @Method :   	close_holderAct
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to close both search and discuss view and redirect to disscuss page.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.close_holderAct = function(){
		$('.gridster.gridster-montage').removeClass('sepcial_montageCase');
		$scope.__isMontagePrivate = false;
		$scope.reset_grid_holderBox();
		$scope.showCloseSingle = false;
		$scope.showAddImage = false;
		$scope.switch__toDiscuss();
		$('.edit_froala1').editable('setHTML','Start writing...');
		
		$("#tary_full_onClose").hide();
	}
/*****************************************END****************************/


/*________________________________________________________________________
* @Date:      	8 june 2015
* @Method :   	reset_grid_holderBox
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used restet holder box and #grid to their initial state.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.reset_grid_holderBox = function(){
		//$('.holder_bulb').html("");
		$('#holder-box').html("");
		$('#holder-box').fadeIn(150);
		var grid_li = [];
		for (i=0;i<4;i++) {
			grid_li[i] = angular.element('<a href="javascript:void(0)" ng-click="openNote_mctrl()" onClick="montage_ele.openNote($(this))" class="addnote drop-here"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a>');
			grid_li[i] = $compile(grid_li[i])($scope);
		}
		$('#grid').find('li').each(function(){
			$(this).html(grid_li[$(this).index()]);
		})
		$('#grid').hide();
	}
/*****************************************END****************************/




/*________________________________________________________________________
* @Date:      	8 june 2015
* @Method :   	getGT
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used restet holder box and #grid to their initial state.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.groupta = [];
$scope.groupt = [];
$scope.getGT = function(){
	$http.get('/groupTags/without_descriptors').then(function(data,status,headers,config){
        if (data.data.code==200){
            $scope.gts=data.data.response;
			console.log('================================================================');
			console.log($scope.gts.length);
			console.log('================================================================');
            for(i in $scope.gts){
				//if($scope.gts[i].status != 3){
					$scope.groupta.push({"id":$scope.gts[i]._id,"title":$scope.gts[i].GroupTagTitle})
					$scope.groupt.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].GroupTagTitle})
					for(j in $scope.gts[i].Tags){
						//if ($scope.gts[i].Tags[j].status==1) {
							$scope.tagta.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].Tags[j].TagTitle,"description":$scope.gts[i].GroupTagTitle})    
						//}
					}
				//}
            }
			console.log('$scope.groupt.length============='+$scope.groupt.length);
        }    
    })
}
//$scope.getGT()



/*________________________________________________________________________
* @Date:      	3 sep 2015
* @Method :   	init_headerPadding
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	changes gallery block and other erlevent block's top padding according to
* 				change in height of header.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.init_headerPadding = function(){
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
				if (newValue >= $(window).height()) {
					console.log('greater than');
					$('#edit55').height($('#edit55').height()-50).css({'overflow-y':'scroll'});
				}else{
					console.log('less than');
					//$('#edit55').css({'overflow-y':'visible'});
				}
			}
		);
	}
	$scope.init_headerPadding()
/*****************************************END****************************/



/*________________________________________________________________________
* @Date:      	3 sep 2015
* @Method :   	getPageData
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	get data of current page 
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.getPageData = function(){
		PreviewService.getPageData($scope.chapter_id, $scope.page_id).success(function(data){
			//console.log(data)
			if ( data.status == 200 ) {
				$scope.pageData = data.result;
				$scope.headerImg = '/assets/Media/headers/aspectfit/'+data.result.HeaderImage ;
				if ( $scope.pageData.SelectionCriteria == 'keyword' && $scope.pageData.SelectedKeywords.length > 0 ) {
					//$scope.keywordsArr = $scope.pageData.SelectedKeywords ;
					$scope.keywordsArr = $scope.pageData.SelectedKeywords ;
					$scope.selectedgt = $scope.keywordsArr[$scope.keywordsArr.length-1].id;
					//$('.keys').removeClass('activeKey');
					//$('.keys #'+$scope.selectedgt).parent().addClass('activeKey');
				}
				$scope.filterSub();
			}
			else{
				$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
			}
		});
	}
	$scope.getPageData()
/*****************************************END****************************/


/*________________________________________________________________________
* @Date:      	3 sep 2015
* @Method :   	getChapterData
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	gets data of current chapter.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/		
	
	$scope.getChapterData = function (){
		PreviewService.getChapterData($scope.chapter_id).success(function(data){
			console.log(data)
			if ( data.status == 200 ) {
				$scope.allPages = data.results ;
				for (var i = 0; i < $scope.allPages.length;i++) {
					if ($scope.allPages[i]._id == $scope.page_id) {
						$rootScope.pageIndex = i;
					}
				}
				$timeout(function(){
					$scope.$apply();
				},1)
			}
			else{
				$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
			}
		})
	}		
/*****************************************END****************************/
	
		
/*________________________________________________________________________
* @Date:      	3 sep 2015
* @Method :   	navigateRight
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	move to chapter on right.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/	
	$scope.navigateRight = function(){
		console.log('navigateRight')
		if ( ( $rootScope.pageIndex + 1 ) < $scope.allPages.length ) {
			//console.log('in -if')
			//console.log('id  == '+$scope.allPages[$rootScope.pageIndex + 1]._id)
			$location.path('/chapter-view/' + $scope.chapter_id + '/' + $scope.allPages[$rootScope.pageIndex + 1]._id);
			$rootScope.pageIndex = $rootScope.pageIndex + 1;
			$rootScope.showLoader = true;
		}else{
			//console.log('in -else')
			//console.log('id  == '+$scope.allPages[0]._id)
			$location.path('/chapter-view/' + $scope.chapter_id + '/' + $scope.allPages[0]._id);
			$rootScope.pageIndex  = 0;
			$rootScope.showLoader = true;
		}
	}
/*****************************************END****************************/
	
		
/*________________________________________________________________________
* @Date:      	3 sep 2015
* @Method :   	navigateLeft
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	move to chapter on left.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/		
	$scope.navigateLeft = function(){
		console.log('navigateLeft')
		if ( ( $rootScope.pageIndex ) > 0 ) {
			//console.log('in -if')
			//console.log('id  == '+$scope.allPages[$rootScope.pageIndex - 1]._id)
			$location.path('/chapter-view/' + $scope.chapter_id + '/' + $scope.allPages[$rootScope.pageIndex - 1]._id);
			$rootScope.pageIndex = $rootScope.pageIndex - 1;
			$rootScope.showLoader = true;
		}else{
			//console.log('in -else');
			//console.log('id  == '+$scope.allPages[$scope.allPages.length - 1]._id);
			$location.path('/chapter-view/' + $scope.chapter_id + '/' + $scope.allPages[$scope.allPages.length - 1]._id);
			$rootScope.pageIndex  = $scope.allPages.length - 1;
			$rootScope.showLoader = true;
		}
	}		
/*****************************************END****************************/


	$( window ).resize(function() {
		$scope.setHeight();
	});

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

});
