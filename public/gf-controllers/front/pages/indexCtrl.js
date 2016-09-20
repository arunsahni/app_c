var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('indexCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter,$state,PreviewService){    
	
        $timeout(function(){
            console.log("After 5 seconds........-------------------------------------------$scope----------------------------------------------- ",$scope);  
            //alert("After 5 seconds........");  
        },5000);
    
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
            if ($state.current.name == "chapterView_allPages") {
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
	//$scope.allPages = [];
        
        $scope.chapterLazyLoadEngineLimit = 1;
        
        
        /*
        $('body').removeClass('creation-section').removeClass('content-bg-pic').removeClass('page-bg-pic').removeClass('chapter-bg-pic');
	$('.toggle-menu').jPushMenu();
        */
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
    $scope.setMediaId__mannualy = function(id , pageId){
        if(pageId != null){
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
                    if ($("'#"+pageId+" .holder-act'").css('display') == 'none') {
                        console.log('in steMediaIdd_uploadCase setting page flag');
                        $scope.setPageFlag('ST',$scope.mediasData.value.MediaType);
                    }
                },1000);

                if ( $scope.del_grid_noteCase == true ) {
                    $scope.del_grid_noteCase = false;
                    $scope.addMedia(pageId);
                }
                console.log('====================================');
                console.log($scope.mediasData);
            })
        }
        else{
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
$scope.reset__views = function(pageId){
    if(pageId != null){
        alert("reset__views = "+pageId);
        $(window).scrollTop(10);
        $(window).scrollTop(0);
        $('body').removeClass('sidebar-toggle');
        $("#"+pageId+" #search_gallery_elements").hide();
        $("#"+pageId+" #discuss_gallery_elements").hide();
        $("#"+pageId+" #search_view").hide();
        $("#"+pageId+" #discuss_view").hide();
    }else{
        $(window).scrollTop(10);
        $(window).scrollTop(0);
        $('body').removeClass('sidebar-toggle');
        $('#search_gallery_elements').hide();
        $('#discuss_gallery_elements').hide();
        $('#search_view').hide();
        $('#discuss_view').hide();
    }
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
$scope.switch__toDiscuss = function(pageId){
    if(pageId != null){
        alert("pageId = "+pageId);
        $scope.has_more_discuss = false;
        $scope.reset__views(pageId);
        $("#"+pageId+" #discuss_gallery_elements").show();
        $scope.sync_discussTray(pageId);
        $scope.pageNo_discuss=1;
        $scope.newdata = null;
        $scope.init__Discuss(pageId);
    }
    else{
        alert("999999999999999ELSE---switch__toDiscuss");
        $scope.has_more_discuss = false;
        $scope.reset__views();
        $('#discuss_gallery_elements').show();
        $scope.sync_discussTray();
        $scope.pageNo_discuss=1;
        $scope.newdata = null;
        $scope.init__Discuss();

    }
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
$scope.switch__toDiscussView = function(pageId){
    if(pageId != null){
        $scope.reset__views(pageId);
        $("#"+pageId+" #discuss_view").show();
    }
    else{
        alert("999999999999999ELSE---switch__toDiscussView");
        $scope.reset__views();
        $('#discuss_view').show();
    }
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
$scope.close__DiscussView = function(pageId){
    if(pageId != null){
        $("#"+pageId+" #holder-discuss").html('');
        $scope.switch__toDiscuss(pageId);
    }
    else{
       alert("999999999999999ELSE---close__DiscussView");
       $('#holder-discuss').html('');
       $scope.switch__toDiscuss(); 
    }
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
$scope.prior_switch__toSearch = function(pageId){
    if(pageId != null){
        if ($("#"+pageId+" #grid").css('display')=='none') {
            if ( $scope.countOfTrayMedia < 15) {
                if (!$scope.showAddImage) {
                    $scope.add_toTray_fromPlatform(pageId);
                }
                $scope.switch__toSearch(pageId);
            }else{
                $("#"+pageId+" #tary_full_onClose").show();
            }
	}
	else{
            alert("999999999999999ELSE---prior_switch__toSearch");
            if (((4-$("#"+pageId+" #grid").find('.addnote').length) + $scope.countOfTrayMedia) <= 15) {
                $scope.add_toTray_fromPlatform(pageId);
                console.log('--here--');
                $scope.switch__toSearch(pageId);
            }
            else{
                $("#"+pageId+" #tary_full_onClose").show();
            }
	}
    }
    else{
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
$scope.switch__toSearch = function(pageId){
    if(pageId != null){
        $scope.small_header = false;
	$scope.reset__views(pageId);
	$scope.reset_grid_holderBox(pageId);
	$scope.showCloseSingle = false;
	$scope.showAddImage = false;
	$scope.showCloseSingle = false;
	$scope.showAddImage = false;
	$("#"+pageId+" #search_gallery_elements").show();
	$("#"+pageId+" .quest-block").slideDown('slow',function(){
            $("#"+pageId+" .tag-block").removeClass('tag-block-scroll');
            $("#"+pageId+" .tag-block").removeClass('shadow-no');
            $("#"+pageId+" .tag-block").removeClass('grey-bg');	
            $scope.small_header = false;
            $("#"+pageId+" .sidebar-panel").css('top', $("#"+pageId+' .header').outerHeight());
            $("#"+pageId+" .gallery-block").css('top',$("#"+pageId+' .header').outerHeight());
            //$('.ansr-box-inr').trigger('focus');
	})
	$scope.setHeight(pageId);
    }
    else{
        alert("999999999999999ELSE---switch__toSearch");
        $scope.small_header = false;
	$scope.reset__views();
	$scope.reset_grid_holderBox();
	$scope.showCloseSingle = false;
	$scope.showAddImage = false;
	$scope.showCloseSingle = false;
	$scope.showAddImage = false;
	$('#search_gallery_elements').show();
	$('.quest-block').slideDown('slow',function(){
		$('.tag-block').removeClass('tag-block-scroll');
		$('.tag-block').removeClass('shadow-no');
		$('.tag-block').removeClass('grey-bg');	
		$scope.small_header = false;
		$('.sidebar-panel').css('top', $('.header').outerHeight());
		$('.gallery-block').css('top',$('.header').outerHeight());
		//$('.ansr-box-inr').trigger('focus');
	})
	$scope.setHeight();
    }
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

//content page builder - module
$controller('ContentPageBuilder',{$scope : $scope });
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
    //$scope.prior_close_holderAct = function(medid , pageId){
    $scope.prior_close_holderAct = function(pageId){
        if(pageId != null){
            if ($("#"+pageId+" #grid").css('display')=='none') {
                if ( $scope.countOfTrayMedia < 15) {
                    if (!$scope.showAddImage) {
                        $scope.add_toTray_fromPlatform(pageId);
                    }
                    $scope.close_holderAct(pageId);
                }else{
                    $("#"+pageId+" #tary_full_onClose").show();
                }

            }
            else{
                if (((4-$("#"+pageId+" #grid").find('.addnote').length) + $scope.countOfTrayMedia) <= 15) {
                    $scope.add_toTray_fromPlatform(pageId);
                    console.log('--here--')
                    $scope.close_holderAct(pageId);
                }
                else{
                    $("#"+pageId+" #tary_full_onClose").show();
                }
            }
            
        }
        else{
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
	$scope.close_holderAct = function(pageId){
            if(pageId != null){
                $("#"+pageId+" .gridster.gridster-montage").removeClass('sepcial_montageCase');
		$scope.__isMontagePrivate = false;
		$scope.reset_grid_holderBox(pageId);
		$scope.showCloseSingle = false;
		$scope.showAddImage = false;
		$scope.switch__toDiscuss(pageId);
		$("#"+pageId+" .edit_froala1").editable('setHTML','Start writing...');
		$("#"+pageId+" #tary_full_onClose").hide();
            }
            else{
                $('.gridster.gridster-montage').removeClass('sepcial_montageCase');
		$scope.__isMontagePrivate = false;
		$scope.reset_grid_holderBox();
		$scope.showCloseSingle = false;
		$scope.showAddImage = false;
		$scope.switch__toDiscuss();
		$('.edit_froala1').editable('setHTML','Start writing...');
		
		$("#tary_full_onClose").hide();
                
            }
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
	$scope.reset_grid_holderBox = function(pageId){
            if(pageId != null){
                //$('.holder_bulb').html("");
		$("#"+pageId+" #holder-box").html("");
		$("#"+pageId+" #holder-box").show();
		var grid_li = [];
		for (i=0;i<4;i++) {
                    grid_li[i] = angular.element('<a href="javascript:void(0)" ng-click="openNote_mctrl()" onClick="montage_ele.openNote($(this))" class="addnote drop-here"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a>');
                    grid_li[i] = $compile(grid_li[i])($scope);
		}
		$("#"+pageId+" #grid").find('li').each(function(){
                    $(this).html(grid_li[$(this).index()]);
		})
		$("#"+pageId+" #grid").hide();
            }
            else{
                //$('.holder_bulb').html("");
		$('#holder-box').html("");
		$('#holder-box').show();
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
                $scope.groupta.push({"id":$scope.gts[i]._id,"title":$scope.gts[i].GroupTagTitle})
                $scope.groupt.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].GroupTagTitle})
                for(j in $scope.gts[i].Tags){
                    $scope.tagta.push({"value":$scope.gts[i]._id,"label":$scope.gts[i].Tags[j].TagTitle,"description":$scope.gts[i].GroupTagTitle})    
                }
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
	$scope.init_headerPadding = function(pageId){
            if(pageId != null){
                
                $scope.$watch
		(
                    function () {
                        return $("#"+pageId+" header").outerHeight();
                    },
                    function (newValue, oldValue) {
                        //alert(1)
                        if (newValue != oldValue) {
                            //console.log(newValue);
                            $("#"+pageId+" .inner-container").css('top',newValue);
                            $("#"+pageId+" .gallery-block").css('top',newValue);
                            $("#"+pageId+" .sidebar-panel").css('top', newValue);
                            $("#"+pageId+" .show-count").css('margin-top',newValue);
                        }
                        if (newValue >= $(window).height()) {
                            console.log('greater than');
                            $("#"+pageId+" #edit55").height($("#"+pageId+" #edit55").height()-50).css({'overflow-y':'scroll'});
                        }else{
                            console.log('less than');
                            //$('#edit55').css({'overflow-y':'visible'});
                        }
                    }
		);
                
            }
            else{
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
	}
	
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
                            
                            var currentPageId = $scope.allPages[0]._id;
                            chapterLazyLoadEngine.init($scope.allPages , currentPageId , 'NEXT' , $scope.chapterLazyLoadEngineLimit);
                            
                            $(document).ready(function(){
                                /*
                                setTimeout(function(){
                                    for(var loop = 0; loop < $scope.allPages.length; loop++){
                                        startupall($scope.allPages[loop]._id);
                                    }
                                },2000)
                                */
                                
                                setTimeout(function(){
                                    /*
                                    for(var loop = 0; loop < $scope.allPages.length; loop++){
                                        mediaSite.init($scope.allPages[loop]._id);
                                        montage_ele.init($scope.allPages[loop]._id);
                                        console.log("----All scripts have been initialized after 7 seconds------");
                                    }
                                    */
                                    mediaSite.init($scope.page_id);
                                    montage_ele.init($scope.page_id);
                                    console.log("----All scripts have been initialized after 3 seconds------");
                                },3000)
                                    
                            });

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
    
    $scope.navigateRight = function(){
        console.log('navigateRight')
        //$scope.init_chapterPageFlipAnimation($scope.allPages[$rootScope.pageIndex+1]._id);
        if ( ( $rootScope.pageIndex++ ) < $scope.allPages.length ) {
            //console.log('in -if')
            //console.log('id  == '+$scope.allPages[$rootScope.pageIndex + 1]._id)
            //$location.path('/chapter-view/' + $scope.chapter_id + '/' + $scope.allPages[$rootScope.pageIndex + 1]._id);
            $scope.setFlashInstant('Loading Page Number = '+$rootScope.pageIndex , 'success');
            /*
            angular.element('#'+$scope.allPages[$rootScope.pageIndex]._id).slideUp(function(){
                angular.element('#'+$scope.allPages[$rootScope.pageIndex + 1]._id).slideDown(function(){
                    //alert("I am the new page :)");
                    $scope.init__allCtrl($scope.allPages[$rootScope.pageIndex + 1]._id);
                })
            });
            */
            
            console.log("----All scripts have been initialized after 3 seconds------");
            //mediaSite.init($scope.allPages[$rootScope.pageIndex+1]._id);
            //montage_ele.init($scope.allPages[$rootScope.pageIndex+1]._id);
            
            //angular.element('#'+$scope.allPages[$rootScope.pageIndex]._id).toggle('down',function(){
              //  angular.element('#'+$scope.allPages[$rootScope.pageIndex + 1]._id).toggle('down' , function(){
                    //$rootScope.pageIndex = $rootScope.pageIndex + 1;
                    //$rootScope.showLoader = true;
                    //$scope.page_id = $scope.allPages[$rootScope.pageIndex + 1]._id;
                    //$scope.init__allCtrl($scope.allPages[$rootScope.pageIndex]._id);
                //});
            //});
        }else{
            $scope.setFlashInstant('All Pages have been loaded..Go Back Now!');return;
            //console.log('in -else')
            //console.log('id  == '+$scope.allPages[0]._id)
            $location.path('/chapter-view/' + $scope.chapter_id + '/' + $scope.allPages[0]._id);
            $rootScope.pageIndex  = 0;
            $rootScope.showLoader = true;
        }
    }
    
    $scope.navigateRight = function(){
        var chapterElement = angular.element('.chapterClass').children();
        console.log("chapterElement ============",chapterElement);
        console.log("chapterElement.length ============",chapterElement.length);
        
        if ( ( $rootScope.pageIndex + 1 ) < $scope.allPages.length ) {
            var currentId = $scope.allPages[$rootScope.pageIndex]._id;
            var nextId = $scope.allPages[$rootScope.pageIndex+1]._id
            var current = angular.element('#'+currentId);
            var next = angular.element('#'+nextId);
            var currElemSelectors = '';
            var nextElemSelectors = '';
            
            var sgPageTemplate = '<search-gallery-page></search-gallery-page>';
            var contentPageTemplate = '<content-page style="color:black;"></content-page>';
            
            
            if(current.hasClass('galleryClass')){
                angular.element('#'+currentId +' #search_gallery_elements .header').css('position','relative');
                currElemSelectors = '#'+currentId +' #search_gallery_elements .header,#'+currentId +' #search_gallery_elements .gallery-block-mn,#'+currentId +' #search_gallery_elements,#'+currentId;
            }else{
                currElemSelectors = '#'+currentId;
            }

            if(next.hasClass('galleryClass')){
                angular.element('#'+currentId).html($compile(sgPageTemplate)($scope));
                $timeout(function(){
                    angular.element('#'+nextId +' #search_gallery_elements .header').css('position','relative');
                    nextElemSelectors = '#'+nextId +' #search_gallery_elements .header,#'+nextId +' #search_gallery_elements .gallery-block-mn,#'+nextId +' #search_gallery_elements,#'+nextId;
                    
                    $timeout(function(){
                        if(current.hasClass('galleryClass')){
                            for(var loop = $rootScope.pageIndex; loop > 0; loop-- ){
                                console.log("chapterElement[loop]-------",chapterElement[loop]);
                                chapterElement[loop].css('display','none');
                            } 
                            //$(currElemSelectors).slideUp(4000,function(){
                            $(nextElemSelectors).fadeIn(function(){
                                //alert("now done---");
                                $rootScope.pageIndex = $rootScope.pageIndex + 1;
                            });
                            //});
                        }
                        else{
                            for(var loop = $rootScope.pageIndex; loop > 0; loop-- ){
                                console.log("chapterElement[loop]-------",chapterElement[loop]);
                                chapterElement[loop].css('display','none');
                            }    
                            //$(currElemSelectors).slideUp(4000,function(){
                            $(nextElemSelectors).fadeIn(function(){
                                //alert("now done---");
                                $rootScope.pageIndex = $rootScope.pageIndex + 1;
                            });
                            //});
                        }
                        
                    },500)
                },1000)
            }
            else{
                angular.element('#'+currentId).html($compile(contentPageTemplate)($scope));
                nextElemSelectors = '#'+nextId;
                
                if(current.hasClass('galleryClass')){
                    for(var loop = $rootScope.pageIndex; loop > 0; loop-- ){
                        console.log("chapterElement[loop]-------",chapterElement[loop]);
                        chapterElement[loop].css('display','none');
                    } 
                    //$(currElemSelectors).slideUp(4000,function(){
                    $(nextElemSelectors).fadeIn(function(){
                        //alert("now done---");
                        $rootScope.pageIndex = $rootScope.pageIndex + 1;
                    });
                    //});
                }
                else{
                    for(var loop = $rootScope.pageIndex; loop > 0; loop-- ){
                        console.log("chapterElement[loop]-------",chapterElement[loop]);
                        chapterElement[loop].css('display','none');
                    }    
                    //$(currElemSelectors).slideUp(4000,function(){
                    $(nextElemSelectors).fadeIn(function(){
                        //alert("now done---");
                        $rootScope.pageIndex = $rootScope.pageIndex + 1;
                    });
                    //});
                }
                
            }
        } 
        else{
            alert('--end of chapter--');
            
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
    $scope.initial_events = function(pageId){
        if(pageId != null){
            $('body').removeClass('creation-section').removeClass('content-bg-pic').removeClass('page-bg-pic').removeClass('chapter-bg-pic');
            $("#"+pageId+" .toggle-menu").jPushMenu();
            
            $( window ).resize(function() {
                $scope.setHeight(pageId);
            });
            $(window).scroll(function() {    
                var scroll = $(window).scrollTop();
                var scrollHeight = $('body').prop('scrollHeight');
                var questBlock = $("#"+pageId+" .quest-block");
                var hdrOuterHeight = $("#"+pageId+" header").outerHeight();
                if (scroll >= hdrOuterHeight) {
                    $("#"+pageId+" .tag-block").addClass('tag-block-scroll');
                    if(!($("#"+pageId+" header").hasClass('header-bg'))){
                        $("#"+pageId+" .tag-block").addClass('shadow-no');
                        $("#"+pageId+" .tag-block").addClass('grey-bg');
                    }
                    questBlock.slideUp('slow',function(){
                        var after__hdOuterHight = $("#"+pageId+" .header").outerHeight();
                        $("#"+pageId ,"#"+pageId+" .inner-container","#"+pageId+" .gallery-block","#"+pageId+" .sidebar-panel").css('top',after__hdOuterHight);
                        //$("#"+pageId+" .gallery-block").css('top',after__hdOuterHight);
                        //$("#"+pageId+" .sidebar-panel").css('top', after__hdOuterHight);
                        $("#"+pageId+" .show-count").css('margin-top',after__hdOuterHight);
                        
                    });
                    $scope.small_header = true;
                    $scope.$apply();
                } else {
                    var after__hdOuterHight = $("#"+pageId+" .header").outerHeight();
                    $("#"+pageId+" .tag-block").removeClass('tag-block-scroll');
                    $("#"+pageId+" .tag-block").removeClass('shadow-no');
                    $("#"+pageId+" .tag-block").removeClass('grey-bg');				
                    questBlock.slideDown('slow',function(){
                        $("#"+pageId ,"#"+pageId+" .inner-container","#"+pageId+" .gallery-block","#"+pageId+" .sidebar-panel").css('top',after__hdOuterHight);
                        //$("#"+pageId+" .gallery-block").css('top',after__hdOuterHight);
                        //$("#"+pageId+" .sidebar-panel").css('top', after__hdOuterHight);
                        $("#"+pageId+" .show-count").css('margin-top',after__hdOuterHight);
                    });
                    $scope.small_header = false;
                    $scope.$apply();
                }
            });
            
        }
        else{
            $('body').removeClass('creation-section').removeClass('content-bg-pic').removeClass('page-bg-pic').removeClass('chapter-bg-pic');
            $('.toggle-menu').jPushMenu();
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
            
        }
    }
    
    $scope.init_chapterPageFlipAnimation = function (pageId){
        
        var Page = (function() {
            var config = {
                $bookBlock : $('#bb-bookblock'),
                $navNext : $('.right-page-arrow'),
                $navPrev : $('.left-page-arrow'),
                $navFirst : $('#bb-nav-first'),
                $navLast : $('#bb-nav-last')
            },
            init = function() {
                config.$bookBlock.bookblock( {
                    speed : 800,
                    shadowSides : 0.8,
                    shadowFlip : 0.7
                } );
                initEvents();
            },
            initEvents = function() {

                var $slides = config.$bookBlock.children();

                // add navigation events
                config.$navNext.on( 'click touchstart', function() {
                        config.$bookBlock.bookblock( 'next' );
                        return false;
                });

                config.$navPrev.on( 'click touchstart', function() {
                        config.$bookBlock.bookblock( 'prev' );
                        return false;
                } );

                config.$navFirst.on( 'click touchstart', function() {
                        config.$bookBlock.bookblock( 'first' );
                        return false;
                } );

                config.$navLast.on( 'click touchstart', function() {
                        config.$bookBlock.bookblock( 'last' );
                        return false;
                } );

                // add swipe events
                $slides.on( {
                        'swipeleft' : function( event ) {
                                config.$bookBlock.bookblock( 'next' );
                                return false;
                        },
                        'swiperight' : function( event ) {
                                config.$bookBlock.bookblock( 'prev' );
                                return false;
                        }
                } );

                // add keyboard events
                $( document ).keydown( function(e) {
                        var keyCode = e.keyCode || e.which,
                                arrow = {
                                        left : 37,
                                        up : 38,
                                        right : 39,
                                        down : 40
                                };

                        switch (keyCode) {
                                case arrow.left:
                                        config.$bookBlock.bookblock( 'prev' );
                                        break;
                                case arrow.right:
                                        config.$bookBlock.bookblock( 'next' );
                                        break;
                        }
                });
            };
            return { init : init };
        })();
        Page.init();
        
    }
    
    //chapter lazy load engine module
    var chapterLazyLoadEngine = (function(){
        var getObjArrayIdxByKey = function(ObjArr , matchKey , matchVal){
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
        var config = {};
        var app = {
            init : function(chapter , currentPageId , navigationPattern , limit){
                config = {
                    pageArr : chapter,
                    currentPageId : currentPageId,
                    noOfPages : chapter.length,
                    limit : limit,
                };
                var currentSetOfPages = app.getCurrentSetOfPages(config.pageArr , config.currentPageId , config.limit , navigationPattern);
                console.log("-------------------currentSetOfPages-------------------------------" , currentSetOfPages);
                
                //app.loadAndCompilePages(config.limit);
                //app.initEvents();
                
            },
            initEvents : function(){
                
                angular.element(window).scroll(function() {
                    
                    $rootScope.showLoader = true;
                    $rootScope.$apply();
                    $scope.$apply();
                    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                       //alert("near bottom!");
                    }
                });
                angular.element(window).scroll(function() {
                    if($(window).scrollTop() + $(window).height() == $(document).height()) {
                        console.log('navigateRight')
                        //console
                        if ( ( $rootScope.pageIndex + 1 ) < $scope.allPages.length ) {
                            var chapterElement = angular.element('.chapterClass').children();
                            console.log("chapterElement ============",chapterElement);
                            var currentId = $scope.allPages[$rootScope.pageIndex]._id;
                            var nextId = $scope.allPages[$rootScope.pageIndex+1]._id
                            var current = angular.element('#'+currentId);
                            var next = angular.element('#'+nextId);
                            var currElemSelectors = '';
                            var nextElemSelectors = '';
                            
                            if(current.hasClass('galleryClass')){
                                angular.element('#'+currentId +' #search_gallery_elements .header').css('position','relative');
                                currElemSelectors = '#'+currentId +' #search_gallery_elements .header,#'+currentId +' #search_gallery_elements .gallery-block-mn,#'+currentId +' #search_gallery_elements,#'+currentId;
                            }else{
                                currElemSelectors = '#'+currentId;
                            }
                            
                            if(next.hasClass('galleryClass')){
                                nextElemSelectors = '#'+nextId +' #search_gallery_elements .header,#'+nextId +' #search_gallery_elements .gallery-block-mn,#'+nextId +' #search_gallery_elements,#'+nextId;
                            }
                            else{
                                nextElemSelectors = '#'+nextId;
                            }
                            
                            
                            //$(currElemSelectors).slideUp(4000,function(){
                                $(nextElemSelectors).fadeIn(function(){
                                    //alert("now done---");
                                    $rootScope.pageIndex = $rootScope.pageIndex + 1;
                                });
                            //}); 
                            /*
                            $('#'+$scope.allPages[$rootScope.pageIndex]._id +' #search_gallery_elements .header,#'+$scope.allPages[$rootScope.pageIndex]._id +' #search_gallery_elements .gallery-block-mn,#'+$scope.allPages[$rootScope.pageIndex]._id +' #search_gallery_elements,#'+$scope.allPages[$rootScope.pageIndex]._id).slideUp(4000,function(){
                                $('#'+$scope.allPages[$rootScope.pageIndex]._id).fadeIn(6000,function(){
                                    //alert("now done---");
                                    $rootScope.pageIndex = $rootScope.pageIndex + 1;
                                });
                            });
                            */
                        }
                        else{
                            alert('--end of chapter--');
                            
                        }
                        
                    }
                }); 
                
                
                /*
                alreadyloading = false;
                nextpage = 2;
                $(window).scroll(function() {
                    if ($('body').height() <= ($(window).height() + $(window).scrollTop())) {
                        if (alreadyloading == false) {
                            var url = "page"+nextpage+".html";
                            alreadyloading = true;
                            $.post(url, function(data) {
                                $('#galleryThumbsCol').children().last().after(data);
                                alreadyloading = false;
                                nextpage++;
                            });
                        }
                    }
                });
                */
                 
            },
            getCurrentSetOfPages : function(pageArr , currentPageId , limit , navigationPattern ){
                var currentSetOfPages = [];
                var noOfPages = pageArr.length;
                
                switch ( navigationPattern ){
                    case 'NEXT' : 
                        //var startIdx = pageArr.indexOf(currentPageId) + 1;    //for simple array
                        var startIdx = getObjArrayIdxByKey(pageArr , '_id' , currentPageId) + 1;      //for associative array
                        
                        if(startIdx == 0 || startIdx >= noOfPages){
                            break;
                        }
                        startIdx = startIdx > 0 ? startIdx : 0;
                            
                        var loopTill = startIdx + limit;
                            loopTill = loopTill > noOfPages ? noOfPages : loopTill;
                            
                        for(var loop = startIdx; loop < loopTill; loop++){
                            currentSetOfPages.push(pageArr[loop]);
                        }
                        break;
                        
                    case 'PREVIOUS' : //[1,2,3]
                        //var startIdx = pageArr.indexOf(currentPageId) - 1;                           //for simple array
                        var startIdx = getObjArrayIdxByKey(pageArr , '_id' , currentPageId) - 1;      //for associative array
                        
                        if(startIdx < 0){
                            break;
                        }
                            
                        startIdx = startIdx > 0 ? startIdx : 0;
                                                        
                        var loopTill = startIdx - limit;
                            loopTill = loopTill > 0 ? loopTill : 0;
                            //loopTill = startIdx == 0 && loopTill == 0 ? 1 : loopTill;
                                                                
                        for(var loop = startIdx; loop >= loopTill; loop--){
                            currentSetOfPages.push(pageArr[loop]);
                        }
                        break;
                        
                    default :
                    
                }
                return currentSetOfPages;
                
            },
            pageLoader : function(limit){
                //This will deal with display of pages
                var currentSetOfPages = app.getCurrentSetOfPages(config.pageArr , config.currentPageId , config.limit , navigationPattern);
                console.log("currentSetOfPages" , currentSetOfPages);
                
                
                
            },
            pageCompiler : function(pageId){
                var currentSetOfPages = app.getCurrentSetOfPages(config.pageArr , config.currentPageId , config.limit , navigationPattern);
                console.log("currentSetOfPages" , currentSetOfPages);
                
                var _template = "<search-gallery-page pageId="+pageId+" pageType='Gallery'></search-gallery-page>";
                var _template = "<content-page pageId="+pageId+" pageType='Content'></content-page>";
                
                
                
                
            },
            pageInterpreter : function(pageId){
                var currentSetOfPages = app.getCurrentSetOfPages(config.pageArr , config.currentPageId , config.limit , navigationPattern);
                console.log("currentSetOfPages" , currentSetOfPages);
                var _template = "<search-gallery-page></search-gallery-page>";
                
                
                
                
            }
            
            
        }; 
        return app;
    })();
    
    //chapter lazy load engine module
    
    
    //initial scripts : put always at the end 
    $scope.init__indexCtrl = function(pageId){
        if(pageId != null){
            $timeout(function(){
                $scope.init_chapterPageFlipAnimation(pageId);
                alert("Done -- check now");
            },7000)
            $scope.initial_events(pageId);
            $scope.init_headerPadding(pageId)
            $scope.getPageData(pageId)
        }
        else{
            $scope.initial_events();
            $scope.init_headerPadding()
            $scope.getPageData()
        }
    }
    $scope.init__indexCtrl($scope.page_id);
    
    $scope.init__allCtrl = function(pageId){
        $scope.init__indexCtrl(pageId);
        $scope.init__discussCtrl(pageId);
        $scope.init__dragDropCtrl(pageId);
        $scope.init__filterCtrl(pageId);
        $scope.init__searchViewCtrl(pageId);
        $scope.init__searchGalleryCtrl(pageId);
    }
    //initial scripts : put always at the end
    
    
});
