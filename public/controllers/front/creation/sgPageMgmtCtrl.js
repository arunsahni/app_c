var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('SgPageMgmtCtrl',['$scope','$stateParams','$location','$rootScope','loginService','SgPageService','LSService','$http','$timeout','$filter','$upload','$window','$q', function($scope,$stateParams,$location,$rootScope,loginService,SgPageService,LSService,$http,$timeout,$filter,$upload,$window,$q){
    //module collabmedia: Pages management
    $scope.SgPageMgmt = (function(){
        var app = {
                capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0, 
                chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0, 
                page_id : $stateParams.page_id ? $stateParams.page_id : 0,
                allPages : [],
                whichPage : "middle",
                pageName : "",
                pageData : {},
                medias : [],
                fsgs : [],
                selectedMedia: [],
                mediaLimit: 3000,		//not the requirement, mean while removing from client end. will finalize this later.
                prevMediaLimit: 30,
                contentmediaType: [],
                countries : [],
                currentCountries:[],
                remainingCountries:[],
                keywordList : [],
                keywordsSelcted : [],
                selectionType : '',
                canSelect : true,
                selectedMediaData: [],
                maxMediaLimit : 100,         //changed the per_page things with this.
                keywordType : "descriptors",
                mmts: [],
                mts: [],
                gts: [],
                grouptfs: [],
                addAnotherTag : [],
                excludeTag : [],
                themeDisabled: false,
                descriptorsDisabled: false,
                
                count:0,
                percentUpload:0,
                disablebtn: false,
                loaded: false,
                fileUpload: [],
                showVideo: false,
                addKeywordDisabled: true,
                toolTipMsg: " ",
                mediaType: ['Image','Link','Montage'],
                selectedMediaType : [],
                mediaTypeLink : false,
                mediaTypeImage : false,
                mediaTypeMontage: false,
                uploadedMediaCount: 0,
                selectedMediaCount: 0,
                mediaRangeOld: 0,
                selectedMediaCopy: [],
                pageNo : 1,
                init : function(){
                    this.getChapterData(this.chapter_id);
                    $scope.firstAlert = true;
                    startupCreate();
                    $scope.selectedFSGs = {};
                    startupCreate();
                    $('body').removeClass('page-bg-pic').removeClass('chapter-bg-pic').addClass('creation-section').addClass('content-bg-pic');//.addClass('sg-page');
                    $('[data-toggle="tooltip"]').tooltip();
                    $('#content').removeClass('chapter').removeClass('boards').addClass('media');
                    console.log(' --inside sg--Create ctrl -- ');
                    this.init_dragDrop();
                    this.get_allFSG();
                    this.getPageData();
                    this.init_masonry();
                    this.per_page = 100;
                    this.filterByPage();
                    this.findQuesTipData();
                
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
                },
                getChapterData : function (chapter_id){   //need allPages for navigation purpose
                    SgPageService.getChapterData(chapter_id).success(function(data){
                        console.log(data)
                        if ( data.status == 200 ) {
                            $scope.SgPageMgmt.allPages = data.results ;
                            $scope.SgPageMgmt.openPage();
                        }
                        else{
                            $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
                        }
                    })
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
                    //$scope.SgPageMgmt.selectionType = 'media';
                    var msg = "Caution ! by performing this action you will lost your selected media";
                    if ($scope.SgPageMgmt.selectedMedia.length > 0 && $scope.firstAlert) {
                        //alert("90");
                        if (window.confirm(msg)) {
                            $scope.SgPageMgmt.selectionType = 'all-media';
                            $scope.SgPageMgmt.setAllMedia_final();
                            $scope.firstAlert = false;
                            $scope.SgPageMgmt.toolTipMsg = "ALL MEDIA : In this mode, all media will be listed in gallery as per our search engine algorithm.";
                        }
                    }else{
                      //  alert("91");
                        $scope.SgPageMgmt.selectionType = 'all-media';
                        $scope.SgPageMgmt.toolTipMsg = "ALL MEDIA : In this mode, all media will be listed in gallery as per our search engine algorithm.";
                        $scope.SgPageMgmt.setAllMedia_final();
                    }
                    $('#descriptor-btn').removeClass('active');
                    $('#upload-btn').removeClass('active');
                    
                    
                    $('#upload-btn').removeClass('semiactive');
                    $('#theme-btn').removeClass('semiactive');
                    
                    
                    $('#filter-btn').removeClass('active');
                    $scope.SgPageMgmt.themeDisabled = false;
                    $scope.SgPageMgmt.descriptorsDisabled = false;
                    $('#sub-handpick-btn').fadeOut('1000');
                    $('#sell-desellAll').fadeOut('1000');
                },
                setAllMedia_final : function(){
                    $scope.SgPageMgmt.selectionType = 'all-media';
                    $('#theme-btn').removeClass('active');
                    $('#media-btn').removeClass('active');
                    $('#all-media-btn').addClass('active');
                    $scope.SgPageMgmt.canSelect = false;
                    $('#container .item').removeClass('item-selected');
                    $scope.SgPageMgmt.selectedMedia = [];
                    $scope.SgPageMgmt.keywordsSelcted = [];
                    $scope.SgPageMgmt.addAnotherTag  = [];
                    $scope.SgPageMgmt.excludeTag = [];
                    $scope.SgPageMgmt.saveSG();
                    $scope.SgPageMgmt.filterByPage();
                    
                    //this.canSelect = true;
                   
                },
              setMediaSelected : function(){
                    $scope.SgPageMgmt.selectionType = 'hand-picked';
                    $('#media-btn').addClass('active');
                    //$('#theme-btn').removeClass('active');
                    $('#all-media-btn').removeClass('active');
                    //$('#descriptor-btn').removeClass('active');
                    //$('#upload-btn').removeClass('active');
                    //$('#filter-btn').removeClass('active');
                    $('#sub-handpick-btn').fadeIn('1000');
                      $('#sell-desellAll').fadeIn('1000');
                     $('#upload-btn').removeClass('semiactive');
                      $('#theme-btn').removeClass('semiactive');
                    this.canSelect = true;
                    $scope.SgPageMgmt.themeDisabled = false;
                    $scope.SgPageMgmt.descriptorsDisabled = false;
                    $scope.SgPageMgmt.toolTipMsg ="HAND-PICKED : In this mode, you can select your media preferences from media gallery below - by clicking on media indivisually. The selected media will be the top media of this page in default case and then other media will come up as per our search engine algorithm.";
                    $scope.SgPageMgmt.saveSG();
                },
                setThemeSelected : function(){
                        
                    $scope.SgPageMgmt.addKeywordDisabled = true;
                    $scope.SgPageMgmt.mmts = [];
                    $scope.SgPageMgmt.mmt = {};
                    $scope.SgPageMgmt.mt = {};
                    $scope.SgPageMgmt.mts= [];
                    $scope.SgPageMgmt.grouptfs= [];
                    
                    //$scope.SgPageMgmt.selectionType = 'theme';
                    //$scope.SgPageMgmt.keywordType = "themes";
                  
                    var msg = "Caution ! by performing this action you will lost your selection";
                    //if ($scope.SgPageMgmt.selectedMedia.length > 0 && $scope.firstAlert) {
                    if ($scope.SgPageMgmt.selectionType == "theme") {

                    }else{
                      //  if (window.confirm(msg)) {
                           // $scope.SgPageMgmt.selectionType = 'theme';
                            $scope.SgPageMgmt.keywordType ="themes";
                           // $scope.SgPageMgmt.toolTipMsg = 'BY THEMES : In this mode, you can select your default themes using "Enter Keyword" or using "Select from Branches" panel. The media from selected themes will be the top media of this page in default case and then other media will come up as per our search engine algorithm.';
                            $scope.SgPageMgmt.toolTipMsg ="HAND-PICKED : In this mode, you can select your media preferences from media gallery below - by clicking on media indivisually. The selected media will be the top media of this page in default case and then other media will come up as per our search engine algorithm.";
                            $('select').selectric('destroy');
                            $http.get('/metaMetaTags/view').then(function (data, status, headers, config) {
                                if (data.data.code==200){
                                    for (i in data.data.response){
                                        //if (data.data.response[i]._id == '54e7211a60e85291552b1187') {    // for ===== "5555"
                                        if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 "
                                            data.data.response.splice(i,1);
                                        }
                                    }
                                    $scope.SgPageMgmt.mmts=data.data.response;
                                    $('body').addClass('prevent-body-scroll');
                                    $("#pop-up-overlay").show();
                                }
                            })
                            $scope.SgPageMgmt.setThemeSelected_final();
                            this.canSelect = true;
                            $scope.firstAlert = false;
                        }
                   // }
                },
                setThemeSelected_final: function(){
                    //alert("92");
                    $scope.SgPageMgmt.themeDisabled = false;
                    $scope.SgPageMgmt.descriptorsDisabled = false;
                    
                    $('#theme-btn').addClass('semiactive');
                    $('#media-btn').addClass('active');
                    $('#descriptor-btn').removeClass('active');
                    $('#upload-btn').removeClass('active');
                    $('#upload-btn').removeClass('semiactive');
                    $('#filter-btn').removeClass('active');
                  //  $('#media-btn').removeClass('active');
                    $('#all-media-btn').removeClass('active');
                    
                   // $scope.SgPageMgmt.canSelect = false;
                    //$('#container .item').removeClass('item-selected');
                    
                    //if ($scope.SgPageMgmt.keywordsSelcted.length > 0 || $scope.SgPageMgmt.addAnotherTag.length > 0 || $scope.SgPageMgmt.excludeTag.length > 0) {
                    //    $scope.SgPageMgmt.keywordsSelcted = [];
                    //    $scope.SgPageMgmt.addAnotherTag = [];
                    //    $scope.SgPageMgmt.excludeTag = [];
                    //    SgPageService.saveSettings(this.chapter_id , this.page_id ,{'selectionCriteria':$scope.SgPageMgmt.selectionType,'ids':$scope.SgPageMgmt.keywordsSelcted,'id_another': $scope.SgPageMgmt.addAnotherTag,'id_exclude': $scope.SgPageMgmt.excludeTag                                } ).then(function(data){
                    //        if (data.data.status == 200) {
                    //            //$scope.setFlashInstant('<span style="color:green">Saved...</span>' , 'success');
                    //            //$window.history.back();
                    //            //$location.path('/manage-pages/'+$scope.SgPageMgmt.capsule_id+'/'+$scope.SgPageMgmt.chapter_id);
                    //        }else{
                    //            //alert('Oopss!! something went wrong.');
                    //            //$scope.setFlashInstant('<span style="color:red">Oopss!! something went wrong.</span>' , 'success');
                    //        }
                    //    })
                    //}
                },
                setKey : function(key){
                    console.log('setKey');
                    $scope.current__gtID = key.id;
                    console.log("$scope.current__gtID",$scope.current__gtID)
                    $('#loader').show().css({'opacity':'1'});
                    //$('#'+key.id).addClass('active-tag');
                    this.filterByPage();
                    //console.log(key);
                },
                delKey : function(key,tagType){
                    console.log('delKey');
                    console.log('Key : ',key);
                    console.log('tagType : ',tagType);
                    
                    var replaceByTagType = [];
                    //console.log(key);
                    switch(tagType){
                        case 'Kword':
                            replaceByTagType = $scope.SgPageMgmt.keywordsSelcted;
                            break;
                        case 'another':
                             replaceByTagType = $scope.SgPageMgmt.addAnotherTag;
                            break;
                        case 'exclude':
                             replaceByTagType = $scope.SgPageMgmt.excludeTag;
                            break;
                    }
                    
                    
                    for (var i = 0; i< replaceByTagType.length; i++ ) {
                        if (replaceByTagType[i].id == key.id) {
                            replaceByTagType.splice(i,1);
                            break;
                        }
                    }
                    console.log("replaceByTagType : ",replaceByTagType);
                    console.log("$scope.current__gtID",$scope.current__gtID);
                    if (key.id == $scope.current__gtID && replaceByTagType.length > 0 ) {
                        $scope.current__gtID = replaceByTagType[replaceByTagType.length-1].id;
                        $('#loader').show().css({'opacity':'1'});
                        $scope.SgPageMgmt.filterByPage();
                    }else if(replaceByTagType.length == 0){
                        $scope.current__gtID = '';
                        $('#loader').show().css({'opacity':'1'});
                        $scope.SgPageMgmt.filterByPage();
                    } else {
                        $('#loader').show().css({'opacity':'1'});
                        $scope.SgPageMgmt.filterByPage();
                    }
                },
                getPageData : function(id){
                    this.isAllowed();
                    SgPageService.getPageData(this.chapter_id , this.page_id)
                    .then(function(data){
                        console.log("success data-------------",data);
                        $scope.SgPageMgmt.pageData = data.data.result;
                        
                        //$scope.SgPageMgmt.maxMediaLimit = $scope.SgPageMgmt.pageData.mediaRange;
                        $scope.SgPageMgmt.maxMediaLimit = $scope.SgPageMgmt.pageData.mediaRange;
                        $scope.SgPageMgmt.mediaRangeOld = data.data.result.mediaRange;
                   
                     //   console.log('****************************************************',mediaType);
                        
                        
                           
                         var mediaTypes = data.data.result.mediaTypes;
                         
                           if(mediaTypes){
                                    //console.log(key,'------------------------------------------->>',filterData[key]);
                                    for (var valuekey in mediaTypes) {
                                     var newValue = mediaTypes[valuekey];
                                        $scope.SgPageMgmt[newValue]= true;
                                    }
                                }
                            $timeout(function(){
                                var filterData = data.data.result.PageFilters;
                            
                                for(var key in filterData){
                                    var checkCount = 0;
                                    var keyName = [];
                                    if (key) {
                                        if(key == 'Country of Affiliation'){
                                        $scope.SgPageMgmt.addCountry(data.data.result.PageFilters["Country of Affiliation"]);
                                        //$scope.SgPageMgmt.remainingCountries = $scope.SgPageMgmt.countries.Values;
                                        }
                                        else{
                                            keyName = filterData[key].split(",");
                                            var checkCount = 0;
                                            for (var valuekey in keyName) {
                                                if (keyName.hasOwnProperty(valuekey)) {
                                                   $('.filter_checbox').each(function(){
                                                    if (keyName[valuekey]==$(this).find('.radiobb2').attr('rel')) {
                                                                $(this).find('.radiobb2').prop('checked',true);
                                                                checkCount++;
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            
                                $('ul.figureAll').each(function(){
                                var checkcoutPrior = $(this).children('li').length;
                                var checkcoutLater = $(this).children('li').children('label').find('input:checked').length;
                                if ((parseInt(checkcoutPrior)-1)==parseInt(checkcoutLater)) {
                                $(this).children('li').find('.all').prop('checked',true);
                                }
                                
                                });
                            },1000);
                          
                           
                        //if (data.data.result.PageFilters["Country of Affiliation"]) {
                        //     $scope.SgPageMgmt.addCountry(data.data.result.PageFilters["Country of Affiliation"]);
                        //}
                        //
                        $scope.SgPageMgmt.addAnotherTag = $scope.SgPageMgmt.pageData.AddAnotherGts;
                        $scope.SgPageMgmt.excludeTag =  $scope.SgPageMgmt.pageData.ExcludedGts;
                        console.log("================================================");
                        console.log("$scope.SgPageMgmt.pageData",data.data.result);
                        //$scope.SgPageMgmt.setPageFilters.media = data.data.result.PageFilters.Media;
                        //$scope.SgPageMgmt.setPageFilters.media.Image = true;
                        //console.log();
                        $scope.SgPageMgmt.pageData.HeaderImage = $scope.SgPageMgmt.pageData.HeaderImage ? "/assets/Media/headers/aspectfit/"+$scope.SgPageMgmt.pageData.HeaderImage : "";
                        if ($scope.SgPageMgmt.pageData.HeaderImage != '') {
                            $('.upload.upload-block').removeClass('upload-nopic');
                        }else{
                            $('.upload.upload-block').addClass('upload-nopic');
                        }
                        
                        //update the data-set.
                        console.log("$scope.SgPageMgmt.pageData.SelectionCriteria",$scope.SgPageMgmt.pageData.SelectionCriteria)
                        $scope.SgPageMgmt.selectionType = $scope.SgPageMgmt.pageData.SelectionCriteria ? $scope.SgPageMgmt.pageData.SelectionCriteria : "all-media";
                        console.log("SgPageMgmt.selectionType",$scope.SgPageMgmt.selectionType)
                        $scope.SgPageMgmt.selectedMedia = $scope.SgPageMgmt.pageData.SelectedMedia ? $scope.SgPageMgmt.pageData.SelectedMedia : [];
                        
                        if($scope.SgPageMgmt.selectionType == "keyword"){
                            $scope.SgPageMgmt.selectionType = "theme";
                        }else if($scope.SgPageMgmt.selectionType == "media" && $scope.SgPageMgmt.selectedMedia.length == 0){
                        
                            $scope.SgPageMgmt.selectionType = "all-media";
                        }
                        else if($scope.SgPageMgmt.selectionType == "hand-picked" && $scope.SgPageMgmt.selectedMedia.length > 0){
                            $scope.SgPageMgmt.selectionType = "hand-picked";   
                        }
                        else{
                            //ignore - other case - descriptor, filter or upload
                            console.log("ignore - it's other case - descriptor, filter or upload----------------$scope.SgPageMgmt.selectionType = ",$scope.SgPageMgmt.selectionType);
                        }
                       
                        switch($scope.SgPageMgmt.selectionType){
                            case "all-media" :
                                $('#all-media-btn').addClass('active');
                                $('#theme-btn').removeClass('active');
                                $('#media-btn').removeClass('active');
                                $scope.SgPageMgmt.canSelect = false;
                                $scope.SgPageMgmt.toolTipMsg = "ALL MEDIA : In this mode, all media will be listed in gallery as per our search engine algorithm.";
                                break;
                                
                            case "hand-picked" :
                                $('#media-btn').addClass('active');
                                
                                $('#theme-btn').removeClass('active');
                                $('#all-media-btn').removeClass('active');
                                 $('#sub-handpick-btn').fadeIn('1000');
                                   $('#sell-desellAll').fadeIn('1000');
                                $scope.SgPageMgmt.canSelect = true;
                                $scope.SgPageMgmt.toolTipMsg ="HAND-PICKED : In this mode, you can select your media preferences from media gallery below - by clicking on media indivisually. The selected media will be the top media of this page in default case and then other media will come up as per our search engine algorithm.";
                                break;
                                
                            case "theme" :
                                console.log($scope.SgPageMgmt.pageData.SelectedKeywords);
                                $scope.SgPageMgmt.keywordType = "themes";
                                $scope.SgPageMgmt.keywordsSelcted = $scope.SgPageMgmt.pageData.SelectedKeywords ? $scope.SgPageMgmt.pageData.SelectedKeywords : [];
                                if ($scope.SgPageMgmt.keywordsSelcted.length > 0) {
                                    $scope.current__gtID = $scope.SgPageMgmt.keywordsSelcted[ $scope.SgPageMgmt.keywordsSelcted.length -1 ].id;
                                }
                                
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
                                
                                $scope.SgPageMgmt.selectedMedia = [];
                                    //$scope.SgPageMgmt.f();
                                $scope.SgPageMgmt.themeDisabled = true;
                                $scope.SgPageMgmt.descriptorsDisabled = true;
                                $scope.SgPageMgmt.toolTipMsg = 'BY THEMES : In this mode, you can select your default themes using "Enter Keyword" or using "Select from Branches" panel. The media from selected themes will be the top media of this page in default case and then other media will come up as per our search engine algorithm.';
                                break;
                            case "descriptor" :
                                console.log($scope.SgPageMgmt.pageData.SelectedKeywords);
                                $scope.SgPageMgmt.keywordType = "descriptors";
                                 $scope.SgPageMgmt.themeDisabled = true;
                                $scope.SgPageMgmt.descriptorsDisabled = true;
                                $scope.SgPageMgmt.keywordsSelcted = $scope.SgPageMgmt.pageData.SelectedKeywords ? $scope.SgPageMgmt.pageData.SelectedKeywords : [];
                                if ($scope.SgPageMgmt.keywordsSelcted.length > 0) {
                                     $scope.current__gtID = $scope.SgPageMgmt.keywordsSelcted[ $scope.SgPageMgmt.keywordsSelcted.length -1 ].id;
                                }
                                $('#loader').show().css({'opacity':'1'});
                                $('.keys').removeClass('activeKey');
                                $('.keys').removeClass('activeKey');
                                $('.keys').last().addClass('activeKey');
                                $('#keyword_slider').scrollLeft($('#keyword_slider ul').width())

                                $('#theme-btn').removeClass('active');
                                $('#media-btn').removeClass('active');
                                $('#all-media-btn').removeClass('active');
                                $('#filter-btn').removeClass('active');
                                $('#upload-btn').removeClass('active');
                                $('#descriptor-btn').addClass('active');
                                    
                                
                                $scope.SgPageMgmt.canSelect = false;
                                $('#container .item').removeClass('item-selected');
                                $scope.SgPageMgmt.selectedMedia = [];
                                $scope.SgPageMgmt.filterByPage();
                                
                                break;
                                
                            case "filter" :
                                //alert("yes filter case found - set the default flag accrodingly....");
                                //console.log($scope.SgPageMgmt.pageData.SelectedKeywords);
                                $('#filter-btn').addClass('active');
                                
                                $('#theme-btn').removeClass('active');
                                $('#media-btn').removeClass('active');
                                $('#all-media-btn').removeClass('active');
                                
                                $scope.SgPageMgmt.canSelect = false;
                                $('#container .item').removeClass('item-selected');
                                
                                $scope.SgPageMgmt.selectedMedia = [];
                                
                                
                                $scope.SgPageMgmt.keywordsSelcted = $scope.SgPageMgmt.pageData.SelectedKeywords ? $scope.SgPageMgmt.pageData.SelectedKeywords : [];
                                if ($scope.SgPageMgmt.keywordsSelcted.length > 0) {
                                    $scope.current__gtID = $scope.SgPageMgmt.keywordsSelcted[ $scope.SgPageMgmt.keywordsSelcted.length -1 ].id;
                                }
                                $('#loader').show().css({'opacity':'1'});
                                $('.keys').removeClass('activeKey');
                                $('.keys').last().addClass('activeKey');
                                $('#keyword_slider').scrollLeft($('#keyword_slider ul').width())
                                $scope.SgPageMgmt.filterByPage();
                                break;
                                
                            case "upload" :
                                //alert("yes filter case found - set the default flag accrodingly....");
                                $('#upload-btn').addClass('active');
                                
                                $('#filter-btn').removeClass('active');
                                $('#theme-btn').removeClass('active');
                                $('#media-btn').removeClass('active');
                                $('#all-media-btn').removeClass('active');
                                
                                $scope.SgPageMgmt.canSelect = false;
                                $('#container .item').removeClass('item-selected');
                                
                                $scope.SgPageMgmt.selectedMedia = [];
                                
                                //$scope.SgPageMgmt.filterSub();
                                 $scope.SgPageMgmt.filterByPage()
                                
                                break;
                                
                            default :
                                alert("unknown case found! need to fix it--code00000999999");
                        }
                        $scope.SgPageMgmt.pageName = $scope.SgPageMgmt.pageData.Title;
                    });
                },
                onHeaderSelect : function(){
                    this.isAllowed();
                    var uploadHeader = $('#uploadHeader');
                    var val = uploadHeader.val();
                    val = angular.lowercase(val);
                    if (!val.match(/(?:gif|jpg|jpeg|png|bmp)$/)) {
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
                            $scope.setFlashInstant('<span style="color:red">something went wrong please try again.</span>' , 'success');
                            //alert('something went wrong please try again');
                            $('#crop-pop').hide();
                            $('.popup-overlayer').hide();
                            $timeout(function(){
                                $('#loader').hide().css({'opacity':'0'});
                            },500)
                        }
                        else if (data.data.code == 400) {
                            $scope.setFlashInstant('<span style="color:red">Header image must be  minimum "1000 X 350" in size.</span>' , 'success');
                            //alert('something went wrong please try again');
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
                filterSub : function(tag){
                   
                   /*  
                    console.log('hello i am heeeeeeeeeeeeeeeeeeeeeeeeeer');
                    var keywordsSelctedId = ["ab","ac","ad"];
                    var addAnotherTagId = ["bb","bc","bd"];
                    var excludeTagId = ["cb","cc","cd"];
            
                 
                    var searchObj = {};
                    searchObj.query = {};
                    searchObj.query["$or"] = [];
	
                    if (keywordsSelctedId.length) {
                            
                            for(var loop = 0; loop < keywordsSelctedId.length; loop++){
                                var tempQueryObj = {};
                
                                tempQueryObj = {
                                        "$and" : []
                                        
                                };	
                                var temp = {};
                                temp = {
                                        "GroupTags.GroupTagID" : {$eq : keywordsSelctedId[loop]}
                                }
                                tempQueryObj["$and"].push(temp);
                                
                                //code
                                for(var loop1 = 0; loop1 < addAnotherTagId.length; loop1++){
                                        var temp = {};
                                        temp = {
                                                "GroupTags.GroupTagID" : {$eq : addAnotherTagId[loop1]}
                                        }
                                        
                                        tempQueryObj["$and"].push(temp);
                                        
                                }
                                
                                for(var loop2 = 0; loop2 < excludeTagId.length; loop2++){
                                        var temp = {};
                                        temp = {
                                                "GroupTags.GroupTagID" : {$ne : excludeTagId[loop2]}
                                        }
                                        
                                        tempQueryObj["$and"].push(temp);
                                        
                                }
                                
                                //searchObj.query["$or"].push(tempQueryObj);
                                searchObj.query["$or"][loop] = tempQueryObj;
                                    
                            }
                    }
                    else{
                            
                            var tempQueryObj = {};
                    
                            tempQueryObj = {
                                    "$and" : []
                                    
                            };
                            
                            
                            for(var loop = 0; loop < addAnotherTagId.length; loop++){
                                    var temp = {};
                                    temp = {
                                            "GroupTags.GroupTagID" : {$eq : addAnotherTagId[loop]}
                                    }
                                    
                                    tempQueryObj["$and"].push(temp);
                                    
                            }
                            
                            for(var loop1 = 0; loop1 < excludeTagId.length; loop1++){
                                    var temp = {};
                                    temp = {
                                            "GroupTags.GroupTagID" : {$ne : excludeTagId[loop1]}
                                    }
                                    
                                    tempQueryObj["$and"].push(temp);
                                    
                            }
                            
                            //searchObj.query["$or"].push(tempQueryObj);
                            searchObj.query["$or"][loop] = tempQueryObj;
                            
                    }
                    
                    //searchObj.query["$or"].push()
                    
                    console.log("---------------------",searchObj.query)
                    
                    return;                
                    console.log(tag);return false;
                       */
             
                    $scope.arrayOfMedias=[];
                    $scope.page = 1;
                    var queryParams = {};
                    if(!$scope.ownerFSG){
                        userFsgs=$scope.selectedFSGs;
                    }
                    //queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
                    //queryParams = {page:$scope.page,per_page:$scope.per_page,mediaType:$scope.contentmediaType,userFSGs:userFsgs,groupTagID:$scope.current__gtID};
                    //queryParams = {page:$scope.page,per_page:$scope.per_page,mediaType:$scope.contentmediaType,userFSGs:userFsgs,groupTagID:$scope.selectedgt};
                    //console.log(groupTagID);return false;
                   // queryParams = {page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID};
                   //  $scope.SgPageMgmt = [];
                 
                    //$scope.SgPageMgmt.keywordsSelcted = $scope.SgPageMgmt.keywordsSelcted ? $scope.SgPageMgmt.keywordsSelcted : [];
                    //$scope.SgPageMgmt.addAnotherTag = $scope.SgPageMgmt.addAnotherTag ? $scope.SgPageMgmt.addAnotherTag : [];
                    //$scope.SgPageMgmt.excludeTag = $scope.SgPageMgmt.excludeTag ? $scope.SgPageMgmt.excludeTag : [];

       
                    queryParams = {page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID, keywordsSelcted: this.keywordsSelcted, addAnotherTag: this.addAnotherTag, excludeTag: this.excludeTag};
                    $http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
                        if (data1.data.status=="success"){
                            $scope.SgPageMgmt.medias=data1.data.results;
                            $scope.SgPageMgmt.mediaCount = data1.data.count;
                            console.log("$scope.SgPageMgmt.mediaCount :",$scope.SgPageMgmt.mediaCount)
                            for(i in $scope.SgPageMgmt.medias){
                                    $scope.arrayOfMedias.push($scope.SgPageMgmt.medias[i]._id);
                            }
                            $scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.SgPageMgmt.per_page);
                            $scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
                            //$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
                            //});
                        }
                        else{
                            $scope.SgPageMgmt.medias={};
                            $scope.arrayOfMedias=[];
                        }
                        $timeout(function(){
                            $scope.SgPageMgmt.reinit_masonry();
                        },500)
                       if (tag=='tag1') {
                            $('#keyword_slider').find('li').removeClass('active-tag')
                            $('#keyword_'+$scope.current__gtID).addClass('active-tag');
                        } else if (tag=='tag2') {
                             $('#another_tag_slider').find('li').removeClass('active-tag')
                             $('#another_'+$scope.current__gtID).addClass('active-tag');
                        } else if (tag=='tag3') {
                             $('#exclude_tag_slider').find('li').removeClass('active-tag')
                             $('#'+$scope.current__gtID).addClass('active-tag');
                        }
                        
                      
                    });
                },
                manageSelection : function (data){
                  // console.log("chelkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",$scope.SgPageMgmt.canSelect);return;
                    if ($scope.SgPageMgmt.canSelect) {
                        if ($('#'+data._id).hasClass('item-selected')) {
                            var index = $scope.SgPageMgmt.selectedMedia.indexOf(data._id);
                            if ( index != -1 ) {
                                $scope.SgPageMgmt.selectedMedia.splice(index , 1);
                                $('#'+data._id).removeClass('item-selected');
                                
                                $scope.SgPageMgmt.saveSG();
                            }
                        }else{
                            
                            if ($scope.SgPageMgmt.selectedMedia.length < $scope.SgPageMgmt.mediaLimit) {
                                var index = $scope.SgPageMgmt.selectedMedia.indexOf(data._id);
                                if ( index == -1 ) {
                                      console.log("In Elssss",data._id)
                                    $scope.SgPageMgmt.selectedMedia.push(data._id);
                                    $('#'+data._id).addClass('item-selected');
                                    $scope.SgPageMgmt.saveSG();
                                }
                            }else{
                                alert('Media selection limit reached!!')
                            }
                        }
                        //console.log($scope.SgPageMgmt.selectedMedia);
                    }
                },
                
                
                selectAll : function (){
                     if ($scope.SgPageMgmt.medias.length) {
                        for(key in $scope.SgPageMgmt.medias){
                            var mediaData  = {};
                            mediaData.mediaId =  $scope.SgPageMgmt.medias[key]._id;
                            mediaData.pageNo =   $scope.SgPageMgmt.pageNo;
                            var index = $scope.SgPageMgmt.selectedMedia.indexOf(mediaData.mediaId);
                            if ( index == -1 ) {
                                $scope.SgPageMgmt.selectedMediaCopy.push(mediaData);             
                                $scope.SgPageMgmt.selectedMedia.push(mediaData.mediaId);
                                $('#'+mediaData.mediaId).addClass('item-selected');
                            }
                        }
                        //console.log("Sm: ",$scope.SgPageMgmt.selectedMedia)
                        $timeout(function(){$scope.SgPageMgmt.saveSG();},700);
                    }else{
                               alert('Media selection limit reached!!')
                    }
                },
                deSelectAll : function (){
                    if ($scope.SgPageMgmt.selectedMediaCopy.length==0) {
                       for(var i = 0; i < $scope.SgPageMgmt.medias.length ; i++){
                           var indexo = $scope.SgPageMgmt.selectedMedia.indexOf($scope.SgPageMgmt.medias[i]._id);
                           if (indexo > -1) {
                             $('#'+$scope.SgPageMgmt.selectedMedia[indexo]).removeClass('item-selected');
                               $scope.SgPageMgmt.selectedMedia.splice(indexo, 1);
                               
                           }
                       }
                       $timeout(function(){$scope.SgPageMgmt.saveSG();},700);
                    }
                    if ($scope.SgPageMgmt.selectedMediaCopy.length) {
                            for(key in  $scope.SgPageMgmt.selectedMediaCopy){
                                if($scope.SgPageMgmt.selectedMediaCopy[key].pageNo == $scope.SgPageMgmt.pageNo){
                                    var index = $scope.SgPageMgmt.selectedMedia.indexOf($scope.SgPageMgmt.selectedMediaCopy[key].mediaId);
                                    if (index != -1) {
                                        $scope.SgPageMgmt.selectedMedia.splice(index, 1);
                                    }
                                    var mediaId  = $scope.SgPageMgmt.selectedMediaCopy[key].mediaId;
                                    $('#'+mediaId).removeClass('item-selected');
                                }
                            }
                            $timeout(function(){$scope.SgPageMgmt.saveSG();},700);
                            
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
                                //$scope.SgPageMgmt.filterSub();
                                 $scope.SgPageMgmt.filterByPage()
                        }else{
                                alert("Media display limit cannot be less than media selection limit");
                                $scope.SgPageMgmt.per_page  = $scope.SgPageMgmt.mediaLimit;
                        }
                        },500)
                },
                filterMedia: function(){
                    console.log("$scope.SgPageMgmt.setPageFilters.media", $scope.selectedFSGs)
                        $('#loader').show().css({'opacity':'1'});
                        $scope.SgPageMgmt.contentmediaType = [];
                        $('.media-type .type').each(function () {
                                if($(this).is(':checked')){
                                        $scope.SgPageMgmt.contentmediaType.push($(this).attr('value'))
                                        //$scope.selectedFSGs["mediaType"] = $scope.SgPageMgmt.contentmediaType;
                                        var pageFilterData = $scope.selectedFSGs;
                                        $http.post('/pages/saveMediaTypes',{pageId: $stateParams.page_id,mediaTypes : $scope.SgPageMgmt.contentmediaType}).then(function (data1, status, headers, config) {
                                            if (data1.data.status== 200){
                                              
                                            }
                                            else{
                                        
                                            }
                                        });
                                }
                        });
                        //this.filterSub();
                        $scope.SgPageMgmt.filterByPage()
                },
                get_allFSG : function(){
                        $http.get('/fsg/view').then(function (data, status, headers, config){
                                if (data.data.code==200){
                                        $scope.SgPageMgmt.fsgs = data.data.response;
                                        console.log("$scope.SgPageMgmt.fsgs",$scope.SgPageMgmt.fsgs);
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
                        //var index = this.remainingCountries.indexOf(country);
                        var index = this.getObjArrayIdxByKey(this.remainingCountries,'_id',country._id);
                        
                        if (index > -1) {
                          this.remainingCountries.splice(index,1)
                        }
                },
                removeCountry: function(country){
                        this.remainingCountries.push(country);
                        var index = this.currentCountries.indexOf(country);
                        this.currentCountries.splice(index,1);
                },
                changeCss : function(id,sg,fsg){
                        var loopFlag = -1;
                        console.log(id)
                        
                        console.log("Fsg id", id)
                        console.log("fsg Title", sg)
                        console.log("fsg valueTitle", fsg)
                        
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
                                $http.post('/pages/savePageFilters',{pageId: $stateParams.page_id, PageFilters: $scope.selectedFSGs}).then(function (data1 , status, headers, config) {
                                    if (data1.data.status== 200){
                                      
                                    }
                                    else{
                                
                                    }
                                });
                                $scope.SgPageMgmt.countrySearch();
                        },800);
                },
                countrySearch: function(){
                        var countries = $scope.SgPageMgmt.currentCountries;
                        console.log("countries",countries);
                        if(countries.length != 0){
                                var countryLast = countries[countries.length-1].valueTitle.trim();
                                var countryLastTemp = countries[countries.length-1];
                                $scope.selectedFSGs["Country of Affiliation"] = countryLastTemp;
                                $http.post('/pages/savePageFilters',{pageId: $stateParams.page_id,  PageFilters: $scope.selectedFSGs}).then(function (data1, status, headers, config) {
                                    if (data1.data.status== 200){
                                      
                                    }
                                    else{
                                
                                    }
                                }); 
                        }
                        console.log($scope.selectedFSGs);
                        $('#loader').show().css({'opacity':'1'});
                        //$scope.SgPageMgmt.filterSub();
                         $scope.SgPageMgmt.filterByPage()
                },
                saveSG: function(){
                    var ids = [], id_another = [], id_exclude = [];
                    if ( $scope.SgPageMgmt.selectionType == '' ) {
                        $scope.setFlashInstant('<span style="color:red">Something wen wrong! I did not find any Selection.</span>' , 'failer');
                    }
                    else if ($scope.SgPageMgmt.selectionType == 'theme' && $scope.SgPageMgmt.keywordsSelcted.length < 1 ) {
                        $scope.setFlashInstant('<span style="color:red">You have selected option "BY THEME". Please select at least one theme to proceed.</span>' , 'failer');
                    }
                    else if ($scope.SgPageMgmt.selectionType == 'descriptor' && $scope.SgPageMgmt.keywordsSelcted.length < 1 ) {
                        $scope.setFlashInstant('<span style="color:red">You have selected option "BY Descriptor". Please select at least one theme to proceed.</span>' , 'failer');
                    }/*
                    else if ($scope.SgPageMgmt.selectionType == 'hand-picked' && $scope.SgPageMgmt.selectedMedia.length < 1 ) {
                        $scope.setFlashInstant('<span style="color:red">You have selected option "HAND-PICKED". Please select at least one media to proceed.</span>' , 'failer');
                    }*/
                    else{
                        console.log($scope.SgPageMgmt.keywordsSelcted);
                        $scope.setFlashInstant('<span style="color:green">Processing...</span>' , 'success');
                        //var ids = [];
                        switch($scope.SgPageMgmt.selectionType){
                            case "all-media" : 
                                
                                break;
                                
                            case "hand-picked" : 
                                ids = $scope.SgPageMgmt.selectedMedia;
                                break;
                                
                            case "theme" : 
                                ids = $scope.SgPageMgmt.keywordsSelcted;
                                id_another = $scope.SgPageMgmt.addAnotherTag;
                                id_exclude = $scope.SgPageMgmt.excludeTag;
                                break;
                                
                            case "descriptor" :
                                ids = $scope.SgPageMgmt.keywordsSelcted;
                                id_another = $scope.SgPageMgmt.addAnotherTag;
                                id_exclude = $scope.SgPageMgmt.excludeTag;
                                break;
                                
                            case "filter" : 
                                ids = $scope.SgPageMgmt.keywordsSelcted;
                                break;
                                
                            case "upload" :
                                
                                break;
                            default :
                                alert("something went wrong! check this error - code00076654 with development team.");
                                return;
                        }
                        
                       // alert(ids.length);return
                        
                        /*
                        if (this.selectionType !== 'hand-picked') {
                            ids = $scope.SgPageMgmt.keywordsSelcted;
                        }
                        else{
                            ids = $scope.SgPageMgmt.selectedMedia;
                        }
                        */
                       
                        SgPageService.saveSettings(this.chapter_id , this.page_id ,{'selectionCriteria':$scope.SgPageMgmt.selectionType,'ids':ids,'id_another': $scope.SgPageMgmt.addAnotherTag,'id_exclude': $scope.SgPageMgmt.excludeTag} ).then(function(data){
                            if (data.data.status == 200) {
                                $scope.setFlashInstant('<span style="color:green">Saved...</span>' , 'success');
                                //$window.history.back();
                                //$location.path('/manage-pages/'+$scope.SgPageMgmt.capsule_id+'/'+$scope.SgPageMgmt.chapter_id);
                            }else{
                                //alert('Oopss!! something went wrong.');
                                $scope.setFlashInstant('<span style="color:red">Oopss!! something went wrong.</span>' , 'success');
                            }
                        })
                    }
                },
                openPage : function(navigationType){
                    var currentPageId =  app.page_id;
                    console.log("app.allPages = ",app.allPages);
                    //return;

                    var idx = this.getObjArrayIdxByKey(app.allPages,'_id',currentPageId);
                    var firstIdx = 0;
                    var lastIdx = app.allPages.length - 1;
                    var pagetoNavigate = 0;
                    var pagetoNavigateType = "";
                    
                    switch(idx){
                        case firstIdx :
                            $scope.SgPageMgmt.whichPage = "first";
                            break;
                        case lastIdx :
                            $scope.SgPageMgmt.whichPage = "last";
                            break;
                        default : 
                            $scope.SgPageMgmt.whichPage = "middle";
                    }

                    switch(navigationType){
                        case "next" :
                            if($scope.SgPageMgmt.whichPage != "last"){
                                pagetoNavigate = app.allPages[idx + 1]._id;
                                pagetoNavigateType = app.allPages[idx + 1].PageType;
                            }
                            else{
                                return false;
                            }
                            break;
                        case "previous" :
                            if($scope.SgPageMgmt.whichPage != "first"){
                                pagetoNavigate = app.allPages[idx - 1]._id;
                                pagetoNavigateType = app.allPages[idx - 1].PageType;
                            }
                            else{
                                return false;
                            }
                            break;
                        default : 
                            console.log("Unknown navigation type...");return;
                    }

                    switch(pagetoNavigateType){
                        case "content":
                            $location.path("/manage-cp/"+this.capsule_id+"/"+this.chapter_id+"/"+pagetoNavigate);
                            break;
                        case "gallery":
                            $location.path("/manage-sg/"+this.capsule_id+"/"+this.chapter_id+"/"+pagetoNavigate);
                            break;
                        default :
                           console.log("unknown page type...");return;

                    }
                },
              
                
                // added by arun Sahani
               /*
                showGalleryImg: function(){
                    if ($scope.SgPageMgmt.selectionType =='hand-picked') {
                        $scope.SgPageMgmt.selectedMediaData = [];
                         $scope.SgPageMgmt.selectedMediaCount = 0;
                        $http.post('/pages/findSelectedMedia',{pageId: $stateParams.page_id}).then(function (data1, status, headers, config) {
                            
                            if (data1.data.status==200){
                                $scope.SgPageMgmt.selectedMediaData = data1.data.result;
                                $scope.SgPageMgmt.selectedMediaCount = data1.data.selectedMediaCount;
                                $(".search-gallery-page-modal1").show();
                                $('body').addClass('prevent-body-scroll');
                                $timeout(function(){
                                  $("#mygalleryHandpicked").justifiedGallery({
                                            rowHeight: 180,
                                            maxRowHeight : 250,
                                            lastRow : 'nojustify',
                                            margins : 10,
                                            fixedHeight: true
                                        });  
                                },500)
                            }
                            else{
                                   
                            }
                        });
                    } else if ($scope.SgPageMgmt.selectionType == 'upload') {
                        $scope.SgPageMgmt.selectedMediaData = [];
                        $scope.SgPageMgmt.uploadedMediaCount = 0;
                        $http.post('/pages/showUploadedImg',{pageId: $stateParams.page_id}).then(function (data1, status, headers, config) {
                            if (data1.data.status== 200){
                                console.log("Uploaded media",data1.data.result)
                                $scope.SgPageMgmt.selectedMediaData = data1.data.result;
                                $scope.SgPageMgmt.uploadedMediaCount = data1.data.uploadedMediaCount;
                                $(".search-gallery-page-modal").show();
                                $('body').addClass('prevent-body-scroll');
                                $timeout(function(){
                                  $("#mygallery").justifiedGallery({
                                            rowHeight: 180,
                                            maxRowHeight : 250,
                                            lastRow : 'nojustify',
                                            margins : 10,
                                            fixedHeight: true
                                        });  
                                },500)
                                console.log("$scope.SgPageMgmt.uploadedMediaCount",  $scope.SgPageMgmt.uploadedMediaCount)
                                 console.log("Uploaded media",$scope.SgPageMgmt.selectedMediaData)
                            }
                            else{
                                   
                            }
                        });
                    }
                  
                  
                },*/
                closeOverlay: function(){
                    $(".search-gallery-page-modal").hide();
                    $('body').removeClass('prevent-body-scroll');        
                },
                closeOverlayHandPicked: function(){
                    $(".search-gallery-page-modal1").hide();
                    $('body').removeClass('prevent-body-scroll');        
                },
                
                loadmoreMedia: function(){
                    if ($scope.SgPageMgmt.medias.length < $scope.SgPageMgmt.mediaCount) {
                      //this.per_page = this.per_page + 40;
                      $scope.page = $scope.page + 1;
                      $scope.SgPageMgmt.loaded = true;
                    }
                    $scope.SgPageMgmt.filterSub_showMore();
                },
                filterSub_showMore : function(){
                    $scope.arrayOfMedias=[];
                    var queryParams = {};
                    if(!$scope.ownerFSG){
                        userFsgs=$scope.selectedFSGs;
                    }
                    //queryParams = {page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID};
                    queryParams = {page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID, keywordsSelcted: this.keywordsSelcted, addAnotherTag: this.addAnotherTag, excludeTag: this.excludeTag};
                    $http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
                        if (data1.data.status=="success"){
                            //$scope.SgPageMgmt.medias.push(data1.data.results);
                             $scope.SgPageMgmt.medias = data1.data.results;
                             //$scope.SgPageMgmt.loaded = false;
                             $timeout(function(){
                                $scope.SgPageMgmt.loaded = false;
                            },2000)
                            for(i in $scope.SgPageMgmt.medias){
                                    $scope.arrayOfMedias.push($scope.SgPageMgmt.medias[i]._id);
                            }
                            $scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.SgPageMgmt.per_page);
                            $scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
                            //$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
                            //});
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
                saveQuesTip: function(questionTip){
                    var quesTip = {};
					quesTip.chapter_id= this.chapter_id;
					quesTip.page_id = this.page_id;
					quesTip.questionTip = questionTip;
					if (questionTip) {
					   SgPageService.saveQuesTip(quesTip).then(function(data){
							if (data.data.status == 200) {
								$scope.setFlashInstant('<span style="color:green">Saved...</span>' , 'success');
							}else{
								$scope.setFlashInstant('<span style="color:red">Oopss!! something went wrong.</span>' , 'success');
							}
						})
					}
                    
                },
                onFileSelect : function(video) {
                    if (video) {
                        $scope.SgPageMgmt.loaded = true;
                        var fd = new FormData();
                        fd.append("file", video[0]);

                        console.log(fd)
                        $http.post('/pages/saveVideo', fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                        .success(function(data){
                            var otherParams = {};
                            otherParams.chapter_id= $stateParams.chapter_id;
                            otherParams.page_id = $stateParams.page_id;
                            otherParams.videoPath = data.result;
                            //alert("data = "+JSON.Stringify(data));
                            $http.post('/pages/saveVideoData',otherParams).then(function (data1, status, headers, config) {
                                if (data1.data.status== 200){
                                    console.log("Successs")
                                    $scope.SgPageMgmt.showVideo = true;
                                   
                                }
                                else{
                                  
                                }
                                $scope.SgPageMgmt.loaded = false;
                            });
                        })
                        .error(function(){
                        });    
                    } else{
                        alert("No video000000 Selected");                      
                    }
                },
                 
                fetchmt: function(){
                    console.log("In fetch mt")
                    console.log("MMt", $scope.SgPageMgmt.mmts);
                    for(key in $scope.SgPageMgmt.mmts){
                            if($scope.SgPageMgmt.mmts[key]._id==$scope.SgPageMgmt.mmt){
                                    $scope.SgPageMgmt.mts=$scope.SgPageMgmt.mmts[key].MetaTags;
                            }
                    }
                },
                
                fetchgt: function(){
                        $scope.SgPageMgmt.grouptfs=[];
                        $scope.loading = true;
                        //$http.get('/groupTags/view').then(function (data, status, headers, config) {			
                        $http.get('/pages/findAllGtOfMt?mmt='+$scope.SgPageMgmt.mmt+'&mt='+$scope.SgPageMgmt.mt).then(function (data, status, headers, config) {
                                        if (data.data.code==200){
                                                $scope.SgPageMgmt.gts=data.data.response;
                                                $scope.loading = false;
                                                for(key in $scope.SgPageMgmt.gts){
                                                        if($scope.SgPageMgmt.gts[key].MetaTagID==$scope.SgPageMgmt.mt){							
                                                                        $scope.SgPageMgmt.grouptfs.push($scope.SgPageMgmt.gts[key]);							
                                                        }				
                                                }
                                        }	
                        })
                },
                // to save gt by filter
                saveByTheme: function(){
                    console.log($scope.SgPageMgmt.gt);
                    var flag = false;
                    if($scope.SgPageMgmt.gt){
                        for(var i= 0; i< $scope.SgPageMgmt.keywordsSelcted.length; i++){
                            if ($scope.SgPageMgmt.keywordsSelcted[i].id == $scope.SgPageMgmt.gt._id) {
                                flag = true;
                            }
                        }
                        if (flag == true) {
                            $scope.setFlashInstant('<span style="color:red">Oopss!! Already Exists</span>' , 'success');
                        } else{
                            $scope.current__gt = $scope.SgPageMgmt.gt.GroupTagTitle;
                            $scope.current__gtID = $scope.SgPageMgmt.gt._id;

                            var keyword = {};
                            keyword.id = $scope.SgPageMgmt.gt._id;
                            keyword.title = $scope.SgPageMgmt.gt.GroupTagTitle;
                            $scope.SgPageMgmt.keywordsSelcted.push(keyword);
                            //$scope.SgPageMgmt.addKeywordDisabled = true;
                            //$scope.SgPageMgmt.gt = {};
                            if ($('#keyword_slider ul').width() >$('#keyword_slider').width()) {
                                $('.prev-slide').fadeIn();
                                $('.next-slide').fadeIn();
                            }else{
                                $('.prev-slide').fadeOut();
                                $('.next-slide').fadeOut();
                            }
                            $timeout(function(){
                                $('#loader').show().css({'opacity':'1'});
                                 ;
                                //$scope.SgPageMgmt.filterSub('search-by-theme');
                                 $scope.SgPageMgmt.filterByPage()
                                $('.keys').removeClass('activeKey');
                                $('.keys').removeClass('activeKey');
                                $('.keys').last().addClass('activeKey');
                                $('#keyword_slider').scrollLeft($('#keyword_slider ul').width())
                            },1000);                        
                        }
                    }
                },
                closeFilterOverlay: function(){
                   $("#pop-up-overlay").hide();
                   $('body').removeClass('prevent-body-scroll');
                   $('select').selectric();
                },
		openLaunchSetting : function(section){
                    $('#loader').css("display", "block");
                    console.log("Section",section);
                    LSService.getChapters(this.capsule_id).then(function(data){
                        if (data.data.code==400) {
                            $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
                        }else{
                            console.log(data);
                            if (data.data.chapter_ids.length == 0) {
                                alert('There are no chapters under this capsule.');
                            }else{
                                $location.path('/ls/'+$scope.SgPageMgmt.capsule_id +'/' +section);
                            }
                        }
                    });
                },
                chgKeywordType: function(keywordValue){
                    $scope.SgPageMgmt.keywordType = keywordValue;
                },
                setDesciptorSelected: function(){
                    var msg = "Caution ! by performing this action you will lost your previous selection";
                    //if ($scope.SgPageMgmt.selectedMedia.length > 0 && $scope.firstAlert) {
                    if ($scope.SgPageMgmt.selectionType == "descriptor") {

                    }else{
                        if (window.confirm(msg)) {
                            $scope.SgPageMgmt.selectionType = "descriptor";
                            $scope.SgPageMgmt.keywordType ="descriptors";
                            
                            $scope.SgPageMgmt.themeDisabled = true;
                            $scope.SgPageMgmt.descriptorsDisabled = false;
                           
                            $('#theme-btn').removeClass('active');
                            $('#media-btn').removeClass('active');
                            $('#all-media-btn').removeClass('active');
                            $('#filter-btn').removeClass('active');
                            $('#upload-btn').removeClass('active');
                            $('#descriptor-btn').addClass('active');
                            
                            $scope.SgPageMgmt.toolTipMsg ='BY DESCRIPTORS : In this mode, you can select your default descriptors using "Enter Keyword". The media from selected descriptors will be the top media of this page in default case and then other media will come up as per our search engine algorithm.';
                            $scope.firstAlert = false;
                            if ($scope.SgPageMgmt.keywordsSelcted.length > 0 || $scope.SgPageMgmt.addAnotherTag.length > 0 || $scope.SgPageMgmt.excludeTag.length > 0) {
                                $scope.SgPageMgmt.keywordsSelcted = [];
                                $scope.SgPageMgmt.addAnotherTag = [];
                                $scope.SgPageMgmt.excludeTag = [];
                                SgPageService.saveSettings(this.chapter_id , this.page_id ,{'selectionCriteria':$scope.SgPageMgmt.selectionType,'ids':                                $scope.SgPageMgmt.keywordsSelcted,'id_another': $scope.SgPageMgmt.addAnotherTag,'id_exclude': $scope.SgPageMgmt.excludeTag                                } ).then(function(data){
                                    if (data.data.status == 200) {
                                        //$scope.setFlashInstant('<span style="color:green">Saved...</span>' , 'success');
                                        //$window.history.back();
                                        //$location.path('/manage-pages/'+$scope.SgPageMgmt.capsule_id+'/'+$scope.SgPageMgmt.chapter_id);
                                    }else{
                                        //alert('Oopss!! something went wrong.');
                                        //$scope.setFlashInstant('<span style="color:red">Oopss!! something went wrong.</span>' , 'success');
                                    }
                                })
                            }
                            
                        }
                    }
                },
                setFilterSelected: function(){
                    $scope.SgPageMgmt.selectionType = "filter";
                    
                    $scope.SgPageMgmt.themeDisabled = false;
                    $scope.SgPageMgmt.descriptorsDisabled = false;
                    
                    $('#theme-btn').removeClass('active');
                    $('#media-btn').removeClass('active');
                    $('#all-media-btn').removeClass('active');
                    $('#descriptor-btn').removeClass('active');
                    $('#upload-btn').removeClass('active');
                    $('#filter-btn').addClass('active');
                    
                    $scope.SgPageMgmt.toolTipMsg ="BY FILTERS : In this mode, your filter selection will be saved and the media as per your filter selection will be the top media of this page in default case and then other media will come up as per our search engine algorithm.";
                },
                setUploadSelected: function(){
                    $scope.SgPageMgmt.selectionType = "upload";
                    
                    $('#multi-upload').show();
                    $('body').addClass('prevent-body-scroll'); 
                    
                    $scope.SgPageMgmt.themeDisabled = false;
                    $scope.SgPageMgmt.descriptorsDisabled = false;
                    
                    $('#theme-btn').removeClass('active');
                      $('#theme-btn').removeClass('semiactive');
                    //$('#media-btn').removeClass('active');
                    $('#media-btn').addClass('active');
                    $('#all-media-btn').removeClass('active');
                    $('#descriptor-btn').removeClass('active');
                    $('#filter-btn').removeClass('active');
                  //  $('#upload-btn').addClass('active');
                    $('#upload-btn').addClass('semiactive');
                    
                    $scope.SgPageMgmt.imagessize=0;
                    $scope.SgPageMgmt.selectedFiles = [];
                    $("#multiUpload").val("");
                    $scope.SgPageMgmt.toolTipMsg = "UPLOAD : In this mode, you can upload multiple media images - which will be private-set of media for this page only. The uploaded media will be the top media of this page in default case and then other media will come up as per our search engine algorithm.";
                },
                findQuesTipData: function(){
                    //$timeout(function(){
                    $http.post('/pages/viewQuesTipData',{pageId: $stateParams.page_id}).then(function (data, status, headers, config) {
                        if (data.data.status==200){
                            $scope.SgPageMgmt.themeData=data.data.result[0];
                             console.log(" $scope.SgPageMgmt.themeData  ---", $scope.SgPageMgmt.themeData)
                            $scope.SgPageMgmt.questionTip = data.data.result[0].QuestionTip;   
                            if (data.data.result[0].uploadedVideo){
                                console.log("data.data.result[0].uploadedVideo---",data.data.result[0].uploadedVideo)
                                $scope.SgPageMgmt.showVideo = true;
                            }
                        }
                    })
                    //},1000);
                   
                },
                closemultiUploadOverlay: function(){
                   $('#multi-upload-gallery').hide();
                   $("#multi-upload").hide();
                   $('body').removeClass('prevent-body-scroll'); 
                },
                onmultiFileSelect: function($files) {
                    $('#multi-upload-gallery').show();
                    $scope.SgPageMgmt.percentUpload=0;
                    $scope.SgPageMgmt.imagessize=0;
                    $scope.SgPageMgmt.selectedFiles = [];
                    $scope.SgPageMgmt.fileUpload=[];
                    $scope.SgPageMgmt.progress = [];
                    if ($scope.SgPageMgmt.upload && $scope.SgPageMgmt.upload.length > 0) {
                            for (var i = 0; i < $scope.SgPageMgmt.upload.length; i++) {
                                    if ($scope.SgPageMgmt.upload[i] != null) {
                                            $scope.SgPageMgmt.upload[i].abort();
                                    }
                            }
                    }
                    $scope.SgPageMgmt.upload = [];
                    $scope.SgPageMgmt.uploadResult = [];
                    
                    //$scope.SgPageMgmt.selectedFiles = $files;
                    //$files = [];
                    for(var x=0;x<$files.length;x++){
                        if ($files[x].type == "image/png" || $files[x].type == "image/jpeg" || $files[x].type == "image/jpg") {
                           $scope.SgPageMgmt.selectedFiles.push($files[x]);
                           $scope.SgPageMgmt.fileUpload.push($files[x]);
                           
                        }
                        else{
                            //delete $files[x]
                        }
                    }
                   // $("#mygallery").justifiedGallery();
                    if ($scope.SgPageMgmt.selectedFiles.length > 0) {
                        $timeout(function(){
                            $("#multi-upload-gallery").justifiedGallery({
                                rowHeight: 150,
                                maxRowHeight : 180,
                                lastRow : 'nojustify',
                                margins : 10,
                                fixedHeight: true
                            });
                        },500)  
                    }
                    
                    if ($scope.SgPageMgmt.selectedFiles.length == 0){
                        $('#multi-upload-gallery').hide();
                         $("#multiUpload").val("");
                        //code
                    }
                    
                    console.log($scope.SgPageMgmt.selectedFiles);
                    $scope.SgPageMgmt.lengthofuploads=$scope.SgPageMgmt.selectedFiles.length;
                    console.log("AAA",$scope.SgPageMgmt.lengthofuploads)
                    //$scope.SgPageMgmt.fileUpload=$scope.SgPageMgmt.selectedFiles;
                    $scope.SgPageMgmt.dataUrls = [];
                    for ( var i = 0; i < $scope.SgPageMgmt.selectedFiles.length; i++) {
                        var $file = $scope.SgPageMgmt.selectedFiles[i];
                        $scope.SgPageMgmt.imagessize+=Math.round($scope.SgPageMgmt.selectedFiles[i].size/1024);
                        if (window.FileReader && $file.type.indexOf('image') > -1) {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL($scope.SgPageMgmt.selectedFiles[i]);
                            var loadFile = function(fileReader, index) {
                                fileReader.onload = function(e) {
                                    $timeout(function() {
                                        $scope.SgPageMgmt.dataUrls[index] = e.target.result;
                                    });
                                }
                            }(fileReader, i);
                        }
                        $scope.SgPageMgmt.progress[i] = -1;
                        if ($scope.SgPageMgmt.uploadRightAway) {
                            $scope.SgPageMgmt.start(i);
                        }
                    }
                },
                start: function(index) {
                    $scope.SgPageMgmt.disablebtn=true;
                    $scope.SgPageMgmt.progress[index] = 0;
                    $scope.SgPageMgmt.errorMsg = null;
                    if ($scope.SgPageMgmt.howToSend != 1) {
                        $scope.SgPageMgmt.upload[index] = $upload.upload({
                            url : '/pages/uploadGalleryMedia',
                            method: $scope.httpMethod,
                            headers: {'my-header': 'my-header-value'},
                            data : {
                                myModel : $scope.myModel,
                                pageId : $stateParams.page_id
                            },
                            file: $scope.SgPageMgmt.selectedFiles[index],
                            fileFormDataName: 'myFile'
                        }).then(function(response) {
                            $scope.SgPageMgmt.disablebtn=false;
                            $scope.SgPageMgmt.uploadResult.push(response.data);
                        }, function(response) {
                            if (response.status > 0) $scope.SgPageMgmt.errorMsg = response.status + ': ' + response.data;
                        }, function(evt) {
                            // Math.min is to fix IE which reports 200% sometimes
                            $scope.SgPageMgmt.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        }).xhr(function(xhr){
                            xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
                        }).success(function(data, status, headers, config) {				
                            $scope.SgPageMgmt.count++;				
                            if($scope.SgPageMgmt.count==$scope.SgPageMgmt.selectedFiles.length){
                                $scope.SgPageMgmt.percentUpload=100;
                                $scope.SgPageMgmt.imagessize=0;
                                $scope.SgPageMgmt.selectedFiles = [];
                                $scope.SgPageMgmt.fileUpload=[];
                                $scope.SgPageMgmt.progress = [];
                                $scope.SgPageMgmt.count=0;

                                $scope.SgPageMgmt.loaded = false;
                                $('#multi-upload-gallery').hide();
                                $("#multiUpload").val("");
                            }
                            else{
                                $scope.SgPageMgmt.percentUpload=Math.round(($scope.SgPageMgmt.count/$scope.SgPageMgmt.lengthofuploads)*100);
                                if ($scope.SgPageMgmt.percentUpload == 100) {
                                }
                            }		
                        });
                    } else {
                        var fileReader = new FileReader();
                        fileReader.onload = function(e) {
                            $scope.SgPageMgmt.upload[index] = $upload.http({
                                url: '/pages/uploadGalleryMedia',
                                headers: {'Content-Type': $scope.SgPageMgmt.selectedFiles[index].type},
                                data: e.target.result
                            }).then(function(response) {
                                $scope.SgPageMgmt.uploadResult.push(response.data);
                            }, function(response) {
                                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                            }, function(evt) {
                                // Math.min is to fix IE which reports 200% sometimes
                                $scope.SgPageMgmt.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                            });
                        }
                        fileReader.readAsArrayBuffer($scope.SgPageMgmt.selectedFiles[index]);
                    }
                },
                uploadAll: function(){
                    if ($scope.SgPageMgmt.fileUpload.length > 0) {
                        $scope.SgPageMgmt.count=0;
                        $scope.SgPageMgmt.loaded = true;
                        for(var i=0;i<$scope.SgPageMgmt.fileUpload.length;i++){
                            $scope.SgPageMgmt.start(i);
                        }
                        
                        //if (i == $scope.SgPageMgmt.fileUpload.length) {
                        //    $('#multi-upload-gallery').hide();
                        //    //$scope.SgPageMgmt.loaded = false;
                        //    $scope.SgPageMgmt.imagessize=0;
                        //    $scope.SgPageMgmt.selectedFiles = [];
                        //    $("#multiUpload").val("");
                        //}
                    } else{
                        alert("No media to upload")
                    }
                },
                viewUploadedVideo: function(){
                    //$scope.SgPageMgmt.bindData = '<video style="width: 100%;height: auto;" controls src="../../../assets/Media/video/gallery_video/upload_03f8cc10196ece39930115fda18196c5.mp4"></video>'
                    console.log("data",$scope.SgPageMgmt.themeData.uploadedVideo);
                    var videoSrc = "../../../assets/Media/quest-tip-video/" + $scope.SgPageMgmt.themeData.uploadedVideo;
                    console.log("Src--",videoSrc);
                    $("#embed-video").html('<div style="height: 500px;"><h1 align="center" style="border-bottom: none;">Uploaded Video</h1><video class="whatever" style="width: 100%;height: 100%;" controls src=[videoSrc]></video></div>');
                    $('.whatever').attr( 'src', videoSrc);
                    $("#video-display").show();
                    $('body').addClass('prevent-body-scroll'); 
                },
                closeVideoOverlay: function(){
                    $("#embed-video").html('');
                    $("#video-display").hide();
                    $('body').removeClass('prevent-body-scroll'); 
                },
                dsbledValCheck: function(){
                    $scope.SgPageMgmt.addKeywordDisabled = false;
                },
                deleteQuesTipVideo: function(){
                    //console.log("$scope.SgPageMgmt.themeData :",$scope.SgPageMgmt.themeData);
                    if (confirm("Are you sure you want to delete this ?")) {
                        $http.post('/pages/delQuesVideo',{pageId: $stateParams.page_id}).then(function (data, status, headers, config) {
                            if (data.data.status==200){
                                $scope.SgPageMgmt.showVideo = false;
                            }
                        })
                    }

                },
                deleteHeaderImage: function(){
                    if (confirm("Are you sure you want to delete this header image?")) {
                        $http.post('/pages/deleteHeaderImage',{pageId: $stateParams.page_id,imgUrl: $scope.SgPageMgmt.pageData.HeaderImage}).then(function (data, status, headers, config) {
                            if (data.data.status==200){
                                console.log("Deleted Successfully");
                                $scope.SgPageMgmt.pageData.HeaderImage = '';
                                if ($scope.SgPageMgmt.pageData.HeaderImage != '') {
                                    $('.upload.upload-block').removeClass('upload-nopic');
                                }else{
                                    $('.upload.upload-block').addClass('upload-nopic');
                                }
                            }
                        })
                    }
                },
                deleteUploadedImage: function(image,index){
                 
                    console.log("image id---------",image.Location[0].URL)
            
                    if (confirm("Are you sure you want to delete this image?")) {
                        $http.post('/pages/deleteUploadedImage',{pageId: $stateParams.page_id,imgId: image._id,imgUrl: image.Location[0].URL}).then(function (data, status, headers, config) {
                            if (data.data.status==200){
                                $scope.SgPageMgmt.selectedMediaData.splice(index,1);
                                console.log("Deleted Successfully");
                            }
                        })
                    }
                },
                /*
                deleteHandPickedImage: function(image,index){
                 
                    console.log("image id---------",image.Location[0].URL)
                
                    if (confirm("Are you sure you want to delete this image?")) {
                        $http.post('/pages/deleteHandPickedImage',{pageId: $stateParams.page_id,imgId: image._id,imgUrl: image.Location[0].URL}).then(function (data, status, headers, config) {
                            if (data.data.status==200){
                                $scope.SgPageMgmt.selectedMediaData.splice(index,1);
                                console.log("Deleted Successfully");
                            }
                        })
                    }
                },*/
                // To load more uploaded media by arun sahani 6may,2016
                loadMoreUploadedMedia: function(){
                    var skipValue = $scope.SgPageMgmt.selectedMediaData.length;
                    console.log("skipValue11",skipValue);
                    $http.post('/pages/showUploadedImg',{pageId: $stateParams.page_id,skipValue: skipValue}).then(function (data1, status, headers, config                    ) {
                        if (data1.data.status== 200){
                            for(var i=0;i< data1.data.result.length;i++){
                                $scope.SgPageMgmt.selectedMediaData.push(data1.data.result[i]);
                            }
                           
                            console.log("New Uploaded media",$scope.SgPageMgmt.selectedMediaData)
                            $(".search-gallery-page-modal").show();
                            $('body').addClass('prevent-body-scroll');
                            $timeout(function(){
                              $("#mygallery").justifiedGallery({
                                        rowHeight: 180,
                                        maxRowHeight : 250,
                                        lastRow : 'nojustify',
                                        margins : 10,
                                        fixedHeight: true
                                    });  
                            },500)
                        }
                        else{
                               
                        }
                    });
                },
                // To load more hand picked media by arun sahani 6may,2016
                loadMoreHandPickedMedia: function(){
                    var skipHandPickedMedia = $scope.SgPageMgmt.selectedMediaData.length;
                    console.log("skipValue1122",skipHandPickedMedia);
                     console.log(" @@@@",$scope.SgPageMgmt.selectionType);
                    $http.post('/pages/findSelectedMedia',{pageId: $stateParams.page_id,skipValue: skipHandPickedMedia}).then(function (data1, status, headers, config                    ) {
                        if (data1.data.status== 200){
                            for(var i=0;i< data1.data.result.length;i++){
                                $scope.SgPageMgmt.selectedMediaData.push(data1.data.result[i]);
                            }
                            $(".search-gallery-page-modal1").show();
                            $('body').addClass('prevent-body-scroll');
                            $timeout(function(){
                              $("#mygalleryHandpicked").justifiedGallery({
                                        rowHeight: 180,
                                        maxRowHeight : 250,
                                        lastRow : 'nojustify',
                                        margins : 10,
                                        fixedHeight: true
                                    });  
                            },500)
                        }
                        else{
                               
                        }
                    });
                },
                
                // For pagination
                mediaByPage: function(currentPage){
                    if ($scope.SgPageMgmt.medias.length < $scope.SgPageMgmt.mediaCount) {
                      //$scope.page = $scope.page + 1;
                    }
                    
                    console.log("Current page",currentPage)
                    $scope.SgPageMgmt.filterPage_showMore(currentPage);
                },
                filterByPage : function(tag){
                    $scope.arrayOfMedias=[];
                    var queryParams = {};
                    if(!$scope.ownerFSG){
                        userFsgs=$scope.selectedFSGs;
                    }
                    this.pageNo = 1;
                    console.log("FilterPage Function Called")
                    var skipValue = (this.pageNo - 1) * this.per_page;
                    queryParams = {skip:skipValue, limit:this.per_page, mediaType: this.contentmediaType,
                    userFSGs: $scope.selectedFSGs,keywordsSelcted: this.keywordsSelcted, addAnotherTag: this.addAnotherTag, excludeTag: this.excludeTag};
                    
                    var temp={page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,
                    userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID,
                    keywordsSelcted: this.keywordsSelcted, addAnotherTag: this.addAnotherTag, excludeTag: this.excludeTag};
                
                    $http.post('/media/searchByPage',queryParams).then(function (data1, status, headers, config) {
                        
                        if (data1.data.status=="success"){
                            $scope.SgPageMgmt.medias = data1.data.results;
                            $scope.SgPageMgmt.pageNo = 1;
                            console.log("Filter by page page no: ",$scope.SgPageMgmt.pageNo);
                            $scope.SgPageMgmt.mediaCount = data1.data.count;
                          
                            for(i in $scope.SgPageMgmt.medias){
                                    $scope.arrayOfMedias.push($scope.SgPageMgmt.medias[i]._id);
                            }
                            $scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.SgPageMgmt.per_page);
                            $scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
                            //$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
                            //});
                        }
                        else{
                            $scope.SgPageMgmt.medias={};
                            $scope.arrayOfMedias=[];
                        }
                        $timeout(function(){
                            $scope.SgPageMgmt.reinit_masonry();
                        },500)
                        //$('#keyword_slider').find('li').removeClass('active-tag')
                        //$('#'+$scope.current__gtID).addClass('active-tag');
                         if (tag=='tag1') {
                            $('#keyword_slider').find('li').removeClass('active-tag')
                            $('#keyword_'+$scope.current__gtID).addClass('active-tag');
                        } else if (tag=='tag2') {
                             $('#another_tag_slider').find('li').removeClass('active-tag')
                             $('#another_'+$scope.current__gtID).addClass('active-tag');
                        } else if (tag=='tag3') {
                             $('#exclude_tag_slider').find('li').removeClass('active-tag')
                             $('#'+$scope.current__gtID).addClass('active-tag');
                        }
                        
                    });
                },
                filterPage_showMore : function(currentPage){
                    $scope.arrayOfMedias=[];
                    var queryParams = {};
                    if(!$scope.ownerFSG){
                        userFsgs=$scope.selectedFSGs;
                    }
                   
                    console.log("filterPage_showMore Function Called")
                    var skipValue = (currentPage - 1) * this.per_page;
                    queryParams = {skip:skipValue, limit:this.per_page, mediaType: this.contentmediaType,
                    userFSGs: $scope.selectedFSGs,keywordsSelcted: this.keywordsSelcted, addAnotherTag: this.addAnotherTag, excludeTag: this.excludeTag};
                    
                    var temp={page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,
                    userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID,
                    keywordsSelcted: this.keywordsSelcted, addAnotherTag: this.addAnotherTag, excludeTag: this.excludeTag};
                
                    $http.post('/media/searchByPage',queryParams).then(function (data1, status, headers, config) {
                        
                        if (data1.data.status=="success"){
                            $scope.SgPageMgmt.medias = data1.data.results;
                            console.log("filter Show more page no: ",$scope.SgPageMgmt.pageNo)
                            $scope.SgPageMgmt.mediaCount = data1.data.count;
                          
                            for(i in $scope.SgPageMgmt.medias){
                                    $scope.arrayOfMedias.push($scope.SgPageMgmt.medias[i]._id);
                            }
                            $scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.SgPageMgmt.per_page);
                            $scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
                            //$http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
                            //});
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
                openUserGallery : function(){
                   // $('#loader').css("display", "block");
                   $window.open('#/userGallery-preview/'+ this.chapter_id + '/' + this.page_id);
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