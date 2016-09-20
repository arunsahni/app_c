var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('SgPageMgmtCtrl',['$scope','$stateParams','$location','loginService','SgPageService','LSService','$http','$timeout','$filter','$upload','$window', function($scope,$stateParams,$location,loginService,SgPageService,LSService,$http,$timeout,$filter,$upload,$window){
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
                mediaCount : 0,				
                maxMediaLimit : 48,         //changed the per_page things with this.
                keywordType : "themes",
                mmts: [],
                mts: [],
                gts: [],
                grouptfs: [],
                keywordsSelctedM : [],
                addAnotherTag : [],
                excludeWords : [],
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
                    this.getPageData();
                    this.init_masonry();
                    this.filterSub();
                    this.get_allFSG();
                    this.per_page = 40;
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
                    $scope.SgPageMgmt.selectionType = 'media';
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
                    $scope.SgPageMgmt.selectionType = 'media';
                    $('#theme-btn').removeClass('active');
                    $('#media-btn').removeClass('active');
                    $('#all-media-btn').addClass('active');
                    $scope.SgPageMgmt.canSelect = false;
                    $('#container .item').removeClass('item-selected');
                    $scope.SgPageMgmt.selectedMedia=[];
                    //this.canSelect = true;
                },
                setMediaSelected : function(){
                    $scope.SgPageMgmt.selectionType = 'media';
                    $('#media-btn').addClass('active');
                    $('#theme-btn').removeClass('active');
                    $('#all-media-btn').removeClass('active');
                    this.canSelect = true;
                },
                setThemeSelected : function(){
                    console.log("yes M here....in setThemeSelected-------------");
                    alert("89");
                    $scope.SgPageMgmt.selectionType = 'keyword';
                    var msg = "Caution ! by performing this action you will loose your selected media";
                    if ($scope.SgPageMgmt.selectedMedia.length > 0 && $scope.firstAlert) {
                        alert("90");
                        if (window.confirm(msg)) {
                            $scope.SgPageMgmt.setThemeSelected_final();
                            $scope.firstAlert = false;
                        }
                    }else{
                        alert("91");
                        $scope.SgPageMgmt.setThemeSelected_final();
                    }
                    
                    $('select').selectric('destroy');
                    $http.get('/metaMetaTags/view').then(function (data, status, headers, config) {
                        if (data.data.code==200){
                            for (i in data.data.response){
                                //if (data.data.response[i]._id == '54e7211a60e85291552b1187') {    // for ===== "5555"
                                if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 "
                                    data.data.response.splice(i,1);
                                }
                            }
                            //var Selectric = $('select').selectric('destroy');
                            //Selectric.destroy(); // Destroy select and go back to normal
                            $scope.SgPageMgmt.mmts=data.data.response;
                            console.log("$scope.SgPageMgmt.mmts",$scope.SgPageMgmt.mmts)
                            
                            $('body').addClass('prevent-body-scroll');
                            $("#pop-up-overlay").show();
                        }
                    })
                },
                setThemeSelected_final: function(){
                    alert("92");
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
                            $scope.SgPageMgmt.selectionType = 'keyword';

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
                    queryParams = {page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID};
                    $http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
                        if (data1.data.status=="success"){
                            $scope.SgPageMgmt.medias=data1.data.results;
                            $scope.SgPageMgmt.mediaCount = data1.data.mediaCount;
                            
                            
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
                                alert('Media selection limit reached!!')
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
                },
                saveSG: function(){
                    var ids = [];
                    if ( $scope.SgPageMgmt.selectionType == '' ) {
                        //$window.history.back();
                        //alert("I am here.sdfsdfds.."+$scope.SgPageMgmt.selectionType);
                    }
                    else if ($scope.SgPageMgmt.selectionType == 'keyword' && $scope.SgPageMgmt.keywordsSelcted.length < 1 ) {
                        //alert('Please select at least one keyword to proceed.');
                        $scope.setFlashInstant('<span style="color:red">You have selected the option "ONLY MEDIA ASSIGNED TO A SINGLE OR SET OF THEMES(GTS)". Please select at least one keyword to proceed.</span>' , 'failer');
                        //this.selectionType = 'media';
                        //$window.history.back();
                        //$location.path('/manage-pages/'+this.capsule_id+'/'+this.chapter_id);
                    }
                    else if ($scope.SgPageMgmt.selectionType == 'media' && $scope.SgPageMgmt.selectedMedia.length < 1 ) {
                        //alert('Please select at least one media to proceed.');
                        //$window.history.back();
                        //$location.path('/manage-pages/'+this.capsule_id+'/'+this.chapter_id);
                        $scope.setFlashInstant('<span style="color:red">You have selected the option "ONLY MEDIA SELECTED BY ME, EXCLUDE THE REST". Please select at least one media to proceed.</span>' , 'failer');
                    }
                    else{
                        console.log($scope.SgPageMgmt.keywordsSelcted);
                        $scope.setFlashInstant('<span style="color:green">Processing...</span>' , 'success');
                        //var ids = [];
                        if (this.selectionType !== 'media') {
                            ids = $scope.SgPageMgmt.keywordsSelcted;
                        }
                        else{
                            ids = $scope.SgPageMgmt.selectedMedia;
                        }
                        SgPageService.saveSettings(this.chapter_id , this.page_id ,{'selectionCriteria':$scope.SgPageMgmt.selectionType,'ids':ids} ).then(function(data){
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
                showGalleryImg: function(){
                    $scope.SgPageMgmt.selectedMediaData = [];
                    $('body').addClass('prevent-body-scroll');
                    $(".search-gallery-page-modal").fadeIn();
                    if ($scope.SgPageMgmt.selectedMedia) {
                        $http.post('/media/findSelectedMedia',{selectedMedia: $scope.SgPageMgmt.selectedMedia}).then(function (data1, status, headers, config) {
                            if (data1.data.status=="success"){
                                console.log("-----------------------------------------")
                                console.log("Data--------",data1.data.results)
								
                                $("#mygallery").css('opacity',0);
                                $scope.SgPageMgmt.selectedMediaData = data1.data.results;
                                console.log("Data in $scope.SgPageMgmt.selectedMediaData--------",$scope.SgPageMgmt.selectedMediaData)
                                
                                $timeout(function(){
                                    $("#mygallery").css('opacity',1);
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
                    }
                },
                closeOverlay: function(){
                    $(".search-gallery-page-modal").hide();
                    $('body').removeClass('prevent-body-scroll');        
                },
                loadmoreMedia: function(){
                    if ($scope.SgPageMgmt.medias.length < $scope.SgPageMgmt.mediaCount) {
                      //this.per_page = this.per_page + 40;
                      $scope.page = $scope.page + 1;
                    }
                    $scope.SgPageMgmt.filterSub_showMore();
                },
                filterSub_showMore : function(){
                    $scope.arrayOfMedias=[];
                    var queryParams = {};
                    if(!$scope.ownerFSG){
                        userFsgs=$scope.selectedFSGs;
                    }
                    queryParams = {page:$scope.page, per_page:this.per_page, mediaType: this.contentmediaType,userFSGs: $scope.selectedFSGs,groupTagID:$scope.current__gtID};
                    $http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
                        if (data1.data.status=="success"){
                            //$scope.SgPageMgmt.medias.push(data1.data.results);
                             $scope.SgPageMgmt.medias = data1.data.results;
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
                saveQuesTip: function(questionTip){
                    var quesTip = {};
                    quesTip.chapter_id= this.chapter_id;
                    quesTip.page_id = this.page_id;
                    quesTip.questionTip = questionTip;
                    SgPageService.saveQuesTip(quesTip).then(function(data){
                        if (data.data.status == 200) {
                            $scope.setFlashInstant('<span style="color:green">Saved...</span>' , 'success');
                        }else{
                            $scope.setFlashInstant('<span style="color:red">Oopss!! something went wrong.</span>' , 'success');
                        }
                    })
                },
                onFileSelect : function(video) {
                    console.log("File ----------------->",video[0])
                    var fd = new FormData();
                    fd.append("file", video[0]);

                    console.log(fd)
                    $http.post('/pages/saveVideo', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(data){
                        console.log("Data After--",data);
                        var otherParams = {};
                            otherParams.chapter_id= $stateParams.chapter_id;
                            otherParams.page_id = $stateParams.page_id;
                            otherParams.videoPath = data.result;
                            console.log("DAata to ===",otherParams);

                        $http.post('/pages/saveVideoData',otherParams).then(function (data1, status, headers, config) {
                            if (data1.data.status=="success"){
                               console.log("Successs")
                            }
                            else{

                            }
                        });
                    })
                    .error(function(){
                    });
                },
                fetchmt: function(){
                    console.log("MT---------------",$scope.SgPageMgmt.mmts)
                    for(key in $scope.SgPageMgmt.mmts){
                            if($scope.SgPageMgmt.mmts[key]._id==$scope.SgPageMgmt.mmt){
                                    $scope.SgPageMgmt.mts=$scope.SgPageMgmt.mmts[key].MetaTags;
                            }
                    }
                },
                fetchgt: function(){
                    $scope.SgPageMgmt.grouptfs=[];
                    $scope.loading = true;
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
                    var themeData = {};
                    var selected_gts = [];
                    var excluded_gts = [];
                    var merge_selected_gts = [];
                    
                    merge_selected_gts = $scope.SgPageMgmt.keywordsSelctedM.concat($scope.SgPageMgmt.addAnotherTag);
                    
                    console.log("merge_selected_gts",merge_selected_gts);
                    
                    for(var i=0;i< merge_selected_gts.length;i++){
                        selected_gts.push(merge_selected_gts[i].id);
                    }
                                       
                    for(var i=0;i< $scope.SgPageMgmt.excludeWords.length;i++){
                        excluded_gts.push($scope.SgPageMgmt.excludeWords[i].id);
                        
                    }
                    console.log("@!@!@!",selected_gts);
                    console.log("excluded_gts --->",excluded_gts);
                    
                    if($scope.SgPageMgmt.gt){
                        selected_gts.push($scope.SgPageMgmt.gt);
                    }
                    console.log("selected_gts---",selected_gts);
                    
                    themeData.chapter_id = $stateParams.chapter_id;
                    themeData.page_id = $stateParams.page_id;
                    themeData.selected_gts = selected_gts;
                    themeData.excluded_gts = excluded_gts;
                    
                    console.log("themeData --",themeData);
                    
                    console.log("1.. KeyWord Selected", $scope.SgPageMgmt.keywordsSelctedM[0].id)
                    console.log("2.. Add another Selected",$scope.SgPageMgmt.addAnotherTag)
                    console.log("3.. Exclude Selected",$scope.SgPageMgmt.excludeWords)
                    $http.post('/pages/saveThemeData',themeData).then(function (data1, status, headers, config) {
                        if (data1.data.status=="success"){
                           console.log("Successs")
                        }
                        else{

                        }
                    });
                },
                closeFilterOverlay: function(){
                   $("#pop-up-overlay").hide();
                   $('body').removeClass('prevent-body-scroll'); 
                }/*,
                openLaunchSetting : function(section){
                    $location.path('/ls/'+this.capsule_id+'/'+this.chapter_id);
                }*/,
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