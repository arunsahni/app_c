var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('ContentPageBuilder',['$scope','$stateParams','$location','loginService','CpPageService','$http','$timeout','$filter','$upload','$window','$compile','$controller', function($scope,$stateParams,$location,loginService,CpPageService,$http,$timeout,$filter,$upload,$window,$compile,$controller){
    //module collabmedia: Chapter Viewer
    $scope.ContentPageBuilder = function(pageNo , pageId){
        var app = {
            //capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0, 
            chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0, 
            //page_id : $stateParams.page_id ? $stateParams.page_id : 0,
            page_id : pageId ? pageId : 0,
            pageName : "",
            pageData : {},
            __config : {
                SyncObject : {
                    CommonParams : {
                        IsGrid : false,
                        IsSnap : false,
                        ViewportDesktop : true,
                        ViewportTablet : false,
                        ViewportMobile : false,
                        Background : {
                            Type : "",
                            Data : "",
                            LqData : "",
                            BgOpacity : "1"
                        }
                    },
                    ViewportDesktopSections : {
                        Widgets : []
                    },
                    ViewportTabletSections : {
                        Widgets : []
                    },
                    ViewportMobileSections : {
                        Widgets : []
                    }  
                },
                currentViewport : "desktop",         //desktop-1024X640/tablet-768X640/mobile-320X528
                workshop : angular.element('#workshop-inr-manish'),
                showroom : angular.element('#test-showroom-manish')
            },
            isAllowed : function(){
                if( !this.chapter_id || !this.chapter_id || !this.page_id ){
                    $scope.setFlashInstant('<span style="color:red">Access Denied, Redirecting...</span>' , 'error');
                    $timeout(function(){
                            $location.path('/manage-capsules');
                    },2000)
                    return;
                }
            },
            init : function(){
                CpPageService.getPageData(this.chapter_id , this.page_id)
                .then(function(data){
                    console.log("success--------------->>>>>>>",data);
                    $scope.chapter[pageNo].pageData = data.data.result;
                    $scope.chapter[pageNo].pageName = $scope.chapter[pageNo].pageData.Title;
                    $scope.chapter[pageNo].__config.SyncObject = app.get__configSyncObject(data.data.result);
                    console.log("$scope.chapter[pageId].__config.SyncObject",$scope.chapter[pageNo].__config.SyncObject);

                    $scope.chapter[pageNo].__config.showroom = angular.element('#test-showroom-manish-'+$scope.chapter[pageNo].page_id);
                    app.WidgetLazyLoadEngine($scope.chapter[pageNo].__config.SyncObject);
                });
            },
            WidgetLazyLoadEngine : function(obj){
                var Widgets = obj.ViewportDesktopSections.Widgets;
                var showroom = $scope.chapter[pageNo].__config.showroom;
                showroom.html($compile('')($scope));
                //this will be calculated dynamically as per the viewing device viewport
                var currentViewport = $scope.chapter[pageNo].__config.currentViewport;
                switch(currentViewport){
                    case 'desktop': 
                        Widgets = obj.ViewportDesktopSections.Widgets;
                        console.log("----WidgetLazyLoadEngine----currentViewport = ",currentViewport);
                        console.log("Widgets.length------",Widgets.length);

                        //make an order in the object - first take in temp array then override at once because SyncObject-$watch is working on changes
                        //$scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets[loop].SrNo = loop+1;
                        for(var loop = 0; loop < Widgets.length; loop++){
                            Widgets[loop].SrNo = loop+1;
                        }
                        $scope.chapter[pageNo].__config.SyncObject.ViewportDesktopSections.Widgets = Widgets;

                        var showroom__Widgets = '';
                        for(var loop = 0; loop < Widgets.length; loop++){
                            var currentWid = Widgets[loop];
                            console.log("currentWid------",currentWid);

                            switch(currentWid.Type){
                                case "text" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-text-widget cpbuilder="chapter['+pageNo+']" obj="chapter['+pageNo+'].__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    break;
                                case "image" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-image-widget cpbuilder="chapter['+pageNo+']" obj="chapter['+pageNo+'].__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    break;
                                case "video" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-video-widget cpbuilder="chapter['+pageNo+']" obj="chapter['+pageNo+'].__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    break;
                                case "audio" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-audio-widget cpbuilder="chapter['+pageNo+']" obj="chapter['+pageNo+'].__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    break;
                                case "questAnswer" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-quest-answer-widget cpbuilder="chapter['+pageNo+']" obj="chapter['+pageNo+'].__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    break;
                                default :
                                    console.log("unknwon widget type = ",currentWid.Type);
                            }
                        }
                        //now $compile the angular templates...optimized..
                        console.log("showroom__Widgets =999999999999999999999999 ",showroom__Widgets);
                        showroom.html($compile(showroom__Widgets)($scope));
                        $timeout(function(){
                            //$scope.chapter[pageNo].startWidgetLoading(0);
                        },1000)
                        break;
                    case 'tablet': 
                        Widgets = obj.ViewportTabletSections.Widgets;
                        console.log("----WidgetLazyLoadEngine----currentViewport = ",currentViewport);
                        console.log("Widgets.length------",Widgets.length);

                        for(var loop = 0; loop < Widgets.length; loop++){
                            Widgets[loop].SrNo = loop+1;
                        }
                        $scope.chapter[pageNo].__config.SyncObject.ViewportTabletSections.Widgets = Widgets;

                        var showroom__Widgets = '';
                        for(var loop = 0; loop < Widgets.length; loop++){
                            var currentWid = Widgets[loop];
                            console.log("currentWid------",currentWid);

                            switch(currentWid.Type){
                                case "text" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-text-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    break;
                                case "image" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-image-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    break;
                                case "video" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-video-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    break;
                                case "audio" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-audio-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    break;
                                case "questAnswer" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-quest-answer-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    break;
                                default :
                                    console.log("unknwon widget type = ",currentWid.Type);
                            }
                        }
                        //now $compile the angular templates...optimized..
                        showroom.html($compile(showroom__Widgets)($scope));
                        //$scope.chapter[pageNo].startWidgetLoading(0);

                        break;
                    case 'mobile': 
                        Widgets = obj.ViewportMobileSections.Widgets;
                        console.log("----WidgetLazyLoadEngine----currentViewport = ",currentViewport);
                        console.log("Widgets.length------",Widgets.length);

                        for(var loop = 0; loop < Widgets.length; loop++){
                            Widgets[loop].SrNo = loop+1;
                        }
                        $scope.chapter[pageNo].__config.SyncObject.ViewportMobileSections.Widgets = Widgets;

                        var workshop__Widgets = '';
                        var showroom__Widgets = '';
                        for(var loop = 0; loop < Widgets.length; loop++){
                            var currentWid = Widgets[loop];
                            console.log("currentWid------",currentWid);

                            switch(currentWid.Type){
                                case "text" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-text-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    break;
                                case "image" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-image-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    break;
                                case "video" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-video-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    break;
                                case "audio" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-audio-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    break;
                                case "questAnswer" : 
                                    showroom__Widgets += '<div class="forWidAnimation" style="display:none;" showroom-quest-answer-widget cpbuilder="chapter["'+pageId+'"]" obj="chapter["'+pageId+'"].__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    break;
                                default :
                                    console.log("unknwon widget type = ",currentWid.Type);
                            }
                        }
                        //now $compile the angular templates...optimized..
                        showroom.html($compile(showroom__Widgets)($scope));
                        //$scope.chapter[pageNo].startWidgetLoading(0);

                        break;
                    default :
                        alert("Wrong currentViewport = ",currentViewport);
                        return;
                }
            },
            get__configSyncObject : function(obj){
                var obj = typeof obj != "undefined" ? obj : {};
                var __configSyncObject = {
                    CommonParams : app.get_CommonParams(obj.CommonParams),
                    ViewportDesktopSections : app.get_ViewportDesktopSections(obj.ViewportDesktopSections),
                    ViewportTabletSections : app.get_ViewportTabletSections(obj.ViewportTabletSections),
                    ViewportMobileSections : app.get_ViewportMobileSections(obj.ViewportMobileSections)
                };
                return __configSyncObject;
            },
            get_Background : function(obj){
                var obj = typeof obj != "undefined" ? obj : {};
                var backgroundSchema = {
                    Type : obj.Type ? obj.Type : "color",     // "color"/"image"/"video"
                    Data : obj.Data ? obj.Data : 'http://stricte.io/assets/sm_bg.jpg',     //"/assets/create/images/preview-icon.png",          // will contain color, image url or video embed
                    LqData : obj.LqData ? obj.LqData : "",         //will contain color, image url or video embed - will be used in case of image and video
                    Thumbnail : obj.Thumbnail ? obj.Thumbnail : "",         
                    BgOpacity : obj.BgOpacity ? obj.BgOpacity : "0.6"
                };
                return backgroundSchema;
            },
            get_CommonParams : function(obj){
                var obj = typeof obj != "undefined" ? obj : {};
                var commonParamsSchema = {
                    Animation : obj.Animation ? obj.Animation : "fadeIn",
                    IsGrid : obj.IsGrid ? obj.IsGrid : false,
                    IsSnap : obj.IsSnap ? obj.IsSnap : false,
                    ViewportDesktop : obj.ViewportDesktop ? obj.ViewportDesktop : true,
                    ViewportTablet : obj.ViewportTablet ? obj.ViewportTablet : false,
                    ViewportMobile : obj.ViewportMobile ? obj.ViewportMobile : false,
                    Background : app.get_Background(obj.Background)
                };
                return commonParamsSchema;
            },
            get_ViewportDesktopSections : function(obj){
                var obj = typeof obj != "undefined" ? obj : {};
                var viewportDesktopSectionsSchema = {
                    Animation : obj.Animation ? obj.Animation : "fadeIn",
                    Height : obj.Height ? obj.Height : 640,
                    Widgets : obj.Widgets ? obj.Widgets : []

                };
                return viewportDesktopSectionsSchema;
            },
            get_ViewportTabletSections : function(obj){
                var obj = typeof obj != "undefined" ? obj : {};
                var viewportTabletSectionsSchema = {
                    Animation : obj.Animation ? obj.Animation : "fadeIn",
                    Height : obj.Height ? obj.Height : 640,
                    Widgets : obj.Widgets ? obj.Widgets : []

                };
                return viewportTabletSectionsSchema;
            },
            get_ViewportMobileSections : function(obj){
                var obj = typeof obj != "undefined" ? obj : {};
                var viewportMobileSectionsSchema = {
                    Animation : obj.Animation ? obj.Animation : "fadeIn",
                    Height : obj.Height ? obj.Height : 640,
                    Widgets : obj.Widgets ? obj.Widgets : []
                };
                return viewportMobileSectionsSchema;
            }
        };
        app.init();
        return app;
    }//)();


    //Now initialize allPages
    $scope.allPages = [];  
    $scope.chapter = [];
    $scope.chapter_id = $stateParams.chapter_id ? $stateParams.chapter_id : 0;


    $scope.getChapterData = (function (){
        CpPageService.getChapterData($scope.chapter_id).success(function(data){
            console.log(data)
            if ( data.status == 200 ) {
                $scope.allPages = data.results ;

                for(var loop = 0; loop < $scope.allPages.length; loop++){
                    //$scope.ContentPageBuilder.init();
                    //$scope.chapter[loop] = $scope.ContentPageBuilder($scope.allPages[loop]._id);
                    $scope.chapter.push($scope.ContentPageBuilder(loop , $scope.allPages[loop]._id));
                    console.log("------------------$scope.chapter------------",$scope.chapter);
                }


                /*
                var currentPageId = $scope.allPages[0]._id;
                chapterLazyLoadEngine.init($scope.allPages , currentPageId , 'NEXT' , $scope.chapterLazyLoadEngineLimit);

                $(document).ready(function(){
                    setTimeout(function(){
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
                */
            }
            else{
                $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
            }
        })
    })();
        
        
    $timeout(function(){
    $scope.chapterLazyLoadEngine = (function(){
        var app = {
            getOnlyWidAnimationArr : function(pageNo){
                var currentViewport = $scope.chapter[pageNo].__config.currentViewport;
                var Widgets = [];
                switch(currentViewport){
                    case 'desktop': 
                        Widgets = $scope.chapter[pageNo].__config.SyncObject.ViewportDesktopSections.Widgets;
                        break;
                    case 'tablet': 
                        Widgets = $scope.chapter[pageNo].__config.SyncObject.ViewportTabletSections.Widgets;
                        break;
                    case 'mobile': 
                        Widgets = $scope.chapter[pageNo].__config.SyncObject.ViewportMobileSections.Widgets;
                        break;
                    default :
                        alert("Wrong currentViewport = ",currentViewport);
                }

                var animArr = [];
                for( var loop = 0; loop < Widgets.length; loop++ ){
                    animArr.push(Widgets[loop].Animation ? Widgets[loop].Animation : "drop");
                }
                console.log("returning animArr =------------ ",animArr);
                return animArr;
            },
            getWidgetArr : function(pageNo){
                var currentViewport = $scope.chapter[pageNo].__config.currentViewport;
                var Widgets = [];
                switch(currentViewport){
                    case 'desktop': 
                        Widgets = $scope.chapter[pageNo].__config.SyncObject.ViewportDesktopSections.Widgets;
                        break;
                    case 'tablet': 
                        Widgets = $scope.chapter[pageNo].__config.SyncObject.ViewportTabletSections.Widgets;
                        break;
                    case 'mobile': 
                        Widgets = $scope.chapter[pageNo].__config.SyncObject.ViewportMobileSections.Widgets;
                        break;
                    default :
                        alert("Wrong currentViewport = ",currentViewport);
                }

                return Widgets;
            },
            startWidgetLoading : function(pageNo , widgetNo){
                //first of all - play background video if any..
                /*

                var videoElem = element.find('iframe');
                angular.element(videoElem).addClass("hundredpercentwh");
                var src = angular.element(videoElem).attr("src");
                var newsrc = src+";autoplay=1&amp;";
                angular.element(videoElem).attr("src" , newsrc);
                */


                //angular.element('.showroom-content-wrap').height(angular.element('.ui-draggable').height() - 100);
                var pageId = $scope.allPages[pageNo]._id;
                //alert("$scope.chapter[pageNo] = "+pageId);
                
                
                var allWidgets = angular.element("#test-showroom-manish-"+pageId+" .forWidAnimation");
                //var allWidgets = app.getWidgetArr(pageNo);
                var widCount = allWidgets.length;
                var animArr = app.getOnlyWidAnimationArr(pageNo);

                var AnimationProgress = false   //true/false
                widgetNo = ((widgetNo < 0) ? -1 : ((widgetNo > widCount) ? widCount : widgetNo));

                if(widgetNo > widCount ){
                   alert("End of the current page, Now load Next Page.."); 
                   console.log("-----------End of the current page, Now load Next Page.."); 
                   return;
                }

                if(widgetNo < -1 ){
                   alert("Start of the current page, Now load Previous Page.."); 
                   console.log("-----------Start of the current page, Now load Previous Page.."); 
                   return;
                }

                console.log("-----------------------widCount = ",widCount);
                console.log("-----------------------widgetNo = ",widgetNo);
                var play = function(element){
                    element.addClass("hundredpercentwh");
                    //whichcase
                    var provider = 'youtube';   //this need to be implemented...
                    switch(provider){
                        case 'youtube' : 
                            var src = element.attr("src");
                            var newsrc = src+";autoplay=1&amp;";
                            element.attr("src" , newsrc);
                            break;
                        case 'vimeo' :

                            break;
                        default :
                            console.log("unknown provider...");

                    }
                }

                var pause = function(element){
                    var src = element.attr("src");
                    var newsrc = src+";autoplay=0&amp;";
                    element.attr("src" , newsrc);
                }

                var loadWidget = function(Widget , Animation){
                    console.log("Widget------------",Widget);
                    if(angular.element(Widget).css('display') == 'none'){
                        angular.element(Widget).toggle(Animation , function(){
                            AnimationProgress = false;
                            //alert("AnimationProgress = Done");
                            //autoplay=1 if it's a video/audio
                            var element = angular.element(angular.element(Widget).find('iframe'));
                            element.addClass("hundredpercentwh");
                            //play(element);

                        });
                    }
                }
                
                //document.onkeydown = null;
                document.onkeydown = function (e) {
                    console.log("AnimationProgress-----------",AnimationProgress);
                    var left = 37,
                        up = 38,
                        right = 39,
                        down = 40;

                    var keyCode = e.keyCode;
                    console.log("keyCode = ",keyCode);
                    switch(keyCode){
                        case down:
                            //alert("It's still working");
                            //$timeout(function(){
                            if(!AnimationProgress){
                                //alert('Scrolled to Page Bottom'+(angular.element(window).height()+angular.element(window).scrollTop()+" = "+angular.element(document).height()));
                                $timeout(function(){
                                    AnimationProgress = true;
                                    loadWidget(allWidgets[widgetNo] , animArr[widgetNo]);
                                    $scope.chapterLazyLoadEngine.startWidgetLoading(pageNo , widgetNo+1);
                                },20)
                            }
                            //},100)
                            break;
                        /*case left:
                            if(!AnimationProgress){
                                $timeout(function(){
                                    AnimationProgress = true;
                                    loadWidget(allWidgets[widgetNo] , animArr[widgetNo]);
                                    $scope.ContentPageBuilder.startWidgetLoading(widgetNo-1);
                                },20)
                            }
                            break;*/
                        /*case right:
                            if(!AnimationProgress){
                                $timeout(function(){
                                    AnimationProgress = true;
                                    loadWidget(allWidgets[widgetNo] , animArr[widgetNo]);
                                    $scope.chapter[pageNo].startWidgetLoading(widgetNo+1);
                                },20)
                            }
                            break;*/
                        /*case up:
                            //$timeout(function(){
                                if(!AnimationProgress && angular.element(window).scrollTop() == 0){
                                    //alert('Scrolled to Page Top');
                                    $timeout(function(){
                                        AnimationProgress = true;
                                        loadWidget(allWidgets[widgetNo] , animArr[widgetNo]);
                                        $scope.ContentPageBuilder.startWidgetLoading(widgetNo-1);
                                    },20)
                                }
                            //},100)
                            break;*/
                        
                    }
                };
            },
            openNextPage : function(currentPage){
                //var pages = chapter
                var nextPageType = "content";
                switch(nextPageType){
                    case 'content' :
                        alert("The next page is a content page - load accordingly....");
                        break;
                    case 'gallery' :
                        alert("The next page is a search gallery page - load accordingly....");
                        break;
                }

            },
            stopWidgetLoading : function(){
                document.onkeydown = null;
                var pause = function(element){
                    element.addClass("hundredpercentwh");
                    var src = element.attr("src");
                    var newsrc = src+";autoplay=0&amp;";
                    element.attr("src" , newsrc);
                    console.log("newsrc = ------------------------",newsrc);
                }

                var allWidgets = angular.element('.forWidAnimation');

                allWidgets.each(function(){
                    var myself = this;
                    angular.element(myself).css('display','none');
                    var element = angular.element(angular.element(myself).find('iframe'));
                    pause(element);
                });
            }
        }
        return app;
    })();
        
    var Page_VerticalFlip = (function() {
        var config = {
            $bookBlock : $( '#bb-bookblock' ),
            $navNext : $( '#bb-nav-next' ),
            $navPrev : $( '#bb-nav-prev' ),
            $navFirst : $( '#bb-nav-first' ),
            $navLast : $( '#bb-nav-last' )
        },
        init = function() {
            config.$bookBlock.bookblock( {
                speed : 800,
                shadowSides : 0.8,
                shadowFlip : 0.7,
                // isLimit is true if the current page is the last one (or the first one).
                //onEndFlip : function(old, page, isLimit) { return false; },
                onEndFlip : function(old, page, isLimit ) { 
                    console.log("Flip onEndFlip....old = ",old);
                    console.log("Flip onEndFlip....page = ",page);
                    if(page < $scope.allPages.length){
                        $scope.chapterLazyLoadEngine.startWidgetLoading(page , 0);
                    }
                    return false; 
                },
                // callback before the flip transition.
                // page is the current item's index.
                onBeforeFlip : function( page ) { 
                    console.log("Flip onBeforeFlip....",page);
                    //alert("Flip onBeforeFlip....");
                    return false; 
                }
            });
            //initEvents();
        },
        initEvents = function() {
            var $slides = config.$bookBlock.children();

            // add navigation events
            config.$navNext.on( 'click touchstart', function() {
                    config.$bookBlock.bookblock( 'next' );
                    return false;
            } );

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
            });

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
    
    //horizontal flip page loading            
    var Page_HorizontalFlip = (function() {

        var config = {
                $bookBlock : $( '#bb-bookblock' ),
                $navNext : $( '#bb-nav-next' ),
                $navPrev : $( '#bb-nav-prev' )
        },
        init = function() {
                config.$bookBlock.bookblock( {
                        orientation : 'horizontal',
                        speed : 700,
                        shadowSides : 1,
                        shadowFlip : 1,
                        // if we should show the first item after reaching the end.
                        circular: false,
                        // If true it overwrites the circular option to true!
                        autoplay: false,
                        // time (ms) between page switch, if autoplay is true. 
                        interval: 3000,
                        // isLimit is true if the current page is the last one (or the first one).
                        onEndFlip : function(old, page, isLimit ) { 
                            console.log("Flip onEndFlip....old = ",old);
                            console.log("Flip onEndFlip....page = ",page);
                            if(page < $scope.allPages.length){
                                $scope.chapterLazyLoadEngine.startWidgetLoading(page , 0);
                            }
                            return false; 
                        },
                        // callback before the flip transition.
                        // page is the current item's index.
                        onBeforeFlip : function( page ) { 
                            console.log("Flip onBeforeFlip....",page);
                            //alert("Flip onBeforeFlip....");
                            return false; 
                        }
                } );
                initEvents();
        },
        initEvents = function() {

                var $slides = config.$bookBlock.children();

                // add navigation events
                config.$navNext.on( 'click touchstart', function() {
                        config.$bookBlock.bookblock( 'next' );
                        return false;
                } );

                config.$navPrev.on( 'click touchstart', function() {
                        config.$bookBlock.bookblock( 'prev' );
                        return false;
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
                                        e.preventDefault();
                                        break;
                                case arrow.right:
                                        config.$bookBlock.bookblock( 'next' );
                                        e.preventDefault();
                                        break;
                        }

                });
        };

        return { init : init };
    })();
    
        $timeout(function(){
            //$scope.chapterLazyLoadEngine();
            $scope.chapterLazyLoadEngine.startWidgetLoading(0 , 0);
            //Page_VerticalFlip.init();
            Page_HorizontalFlip.init();  
        },1000);
    },3000);
        
}]);