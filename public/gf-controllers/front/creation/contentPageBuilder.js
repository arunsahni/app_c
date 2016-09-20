var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('ContentPageBuilder',['$scope','$stateParams','$location','loginService','CpPageService','$http','$timeout','$filter','$upload','$window','$compile','$controller', function($scope,$stateParams,$location,loginService,CpPageService,$http,$timeout,$filter,$upload,$window,$compile,$controller){
    //module collabmedia: Pages management
    var AVEngine = (function(){
	var app = {
            __toggleVideo : function(element , state) {
                // if state == 'hide', hide. Else: show video
                //var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
                //must have enablejsapi=1 after ?
                var src = element.attr('src');
                var newSrc =  src;
                var srcArr = src.split('?');
                alert("element.src = "+src);
                if(srcArr.length){
                    //It means already having ? so - include enablejsapi=1
                    newSrc = srcArr[0]+'?enablejsapi=1;';
                }
                else{
                    //It means not having ? so - include enablejsapi=1
                    newSrc = src + '?enablejsapi=1;';
                }
                alert("newSrc = "+newSrc);
                
                var iframe = element[0].contentWindow;
                console.log("youtube iframe = ",iframe);
                //div.style.display = state == 'hide' ? 'none' : '';
                func = state == 'hide' ? 'pauseVideo' : 'playVideo';
                iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');
            },
            play : function(element , type){
                switch(type){
                    case "youtube" : 
                        app.__toggleVideo(element);   
                        break;
                    case "vimeo" : 
                        var froogaloop = $f(element);
                        froogaloop.api('play');
                        break;
                    case "soundCloud" :
                        var widget = SC.Widget(widgetIframe);
                        widget.play();
                        break;
                    case "htmlTag" : 
                        var myVideo = element; 
                        myVideo.play();
                        break;
                    default : 
                        console.log("Unknown video type : ",type);
                }
            },
            pause : function(element , type){
                switch(type){
                    case "youtube" : 
                        app.__toggleVideo(element,'hide');
                        break;
                    case "vimeo" : 
                        var froogaloop = $f(element);
                        froogaloop.api('pause');
                        break;
                    case "soundCloud" :
                        var widget = SC.Widget(widgetIframe);
                        widget.pause();
                        break;
                    case "htmlTag" : 
                        var myVideo = element; 
                        myVideo.pause();
                        break;
                    default : 
                        console.log("Unknown video type : ",type);
                }
            },
            mute : function(element , type){
                switch(type){
                    case "youtube" : 
                        app.__toggleVideo(element,'hide');
                        break;
                    case "vimeo" : 
                        var froogaloop = $f(element);
                        // Grab the value in the input field
                        var volumeVal = 0; //this.querySelector('input').value;
                        froogaloop.api('setVolume', volumeVal);
                        break;
                    case "soundCloud" :
                        var widget = SC.Widget(widgetIframe);
                        widget.toggle();
                        break;
                    case "htmlTag" : 
                        var myVideo = element; 
                        myVideo.pause();
                        break;
                    default : 
                        console.log("Unknown video type : ",type);
                }
            }
        };
        return app;
    })();
    
    $scope.link = {};

    $controller('uploadLinkEngine',{$scope : $scope });
    //$controller('uploadMediaCtrl',{$scope : $scope });
    
    $scope.ContentPageBuilder = (function(){
        var app = {
            capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0, 
            chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0, 
            page_id : $stateParams.page_id ? $stateParams.page_id : 0,
            pageName : "",
            pasteData : "", //paste url - a common model variable for all - used in setPasteData(type)
            selectGallery : "",
            medialist: [],
            // To get images by Arun Sahani
            pageSize : 0,
            totalpages: 0,
            show_load: true,
            keywordsSelcted:[],
            // To get images by Arun Sahani
            allPages : [],
            whichPage : "middle",
            chapter : [],
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
                //alert("I got it, yuppiee..........");
                CpPageService.getPageData(this.chapter_id , this.page_id)
                .then(function(data){
                    console.log("success",data);
                    $scope.ContentPageBuilder.pageData = data.data.result;
                    $scope.ContentPageBuilder.pageName = $scope.ContentPageBuilder.pageData.Title;
                    $scope.ContentPageBuilder.__config.SyncObject = app.get__configSyncObject(data.data.result);
                    console.log("$scope.ContentPageBuilder.__config.SyncObject",$scope.ContentPageBuilder.__config.SyncObject);
                    app.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                    $scope.ContentPageBuilder.init_colorPicker();
                    $scope.ContentPageBuilder.init_editBackground();
                    $scope.ContentPageBuilder.init_editForeground();
                });
                app.getChapterData(app.chapter_id);
            },
            getChapterData : function (chapter_id){   //need allPages for navigation purpose
                CpPageService.getChapterData(chapter_id).success(function(data){
                    console.log(data)
                    if ( data.status == 200 ) {
                        $scope.ContentPageBuilder.allPages = data.results ;
                        $scope.ContentPageBuilder.openPage();
                    }
                    else{
                        $scope.setFlashInstant('Opps!! Something went wrong' , 'success');
                    }
                })
            },
            init_colorPicker : function(){
                angular.element("#customhexspectrum").spectrum({
                    appendTo : "#builder",
                    preferredFormat: "hex",
                    showInput: true,
                    showPalette: true,
                    textColor : '#000',
                    palette: [["red", "rgba(0, 255, 0, .5)", "rgb(0, 0, 255)"]],
                    move : function(textColor){
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type = "color";
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data = String(textColor);
                        $scope.$apply();
                        $scope.ContentPageBuilder.updateBackground();
                    }
                });

            },
            init_editBackground : function(){
                // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
                angular.element("html").on("dragover", function(event) {
                   event.preventDefault();
                });

                // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
                angular.element("html").on("dragenter", function(event) {
                    event.preventDefault();
                });

                angular.element("html").on("drop", function(event) {
                    if ( event.target.className.indexOf("drop-bg-image") > -1 ) {
                        event.preventDefault();
                        event.dataTransfer = event.originalEvent.dataTransfer;			
                        var file = event.originalEvent.dataTransfer.files;          
                        if (file.length == 0) {
                            //alert("String dropped...");//return;

                            var data = event.dataTransfer.getData("Text");
                            //alert("data = "+data);
                            $scope.link.content = data;
                            //setTimeout(function(){
                            $scope.ContentPageBuilder.uploadLink('background','Image');
                            //},500);
                        }else if (file.length == 1) {
                            if ((file[0].type).indexOf('image') != -1) {
                                //alert("image dropped...");//return;
                                var sendFile = [];
                                sendFile.push(file[0]);
                                $scope.ContentPageBuilder.onFileSelect(sendFile , 'BackgroundImage');
                            }else{
                                alert(file.type+" not allowed...");
                            }
                        }else{
                            alert('Please drop only one Link/Image at a time');
                        }
                    }
                    else if ( event.target.className.indexOf("drop-bg-video") > -1 ) {
                        event.preventDefault();
                        event.dataTransfer = event.originalEvent.dataTransfer;			
                        var file = event.originalEvent.dataTransfer.files;          
                        if (file.length == 0) {
                            //alert("String dropped...");//return;

                            var data = event.dataTransfer.getData("Text");
                            //alert("data = "+data);
                            $scope.link.content = data;
                            //setTimeout(function(){
                            $scope.ContentPageBuilder.uploadLink('background','Video');
                            //},500);
                        }else if (file.length == 1) {
                            if ((file[0].type).indexOf('video') != -1) {
                                //alert("image dropped...");//return;
                                var sendFile = [];
                                sendFile.push(file[0]);
                                $scope.ContentPageBuilder.onFileSelect(sendFile , 'BackgroundVideo');
                            }else{
                                alert(file.type+" not allowed...");
                            }
                        }else{
                            alert('Please drop only one Link/Video at a time');
                        }
                    }
                    else{
                        //alert(2);
                        event.preventDefault();
                        event.stopPropagation();
                    }
                });
            },
            init_editForeground : function(){
                // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
                angular.element("html").on("dragover", function(event) {
                   event.preventDefault();
                });

                // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
                angular.element("html").on("dragenter", function(event) {
                    event.preventDefault();
                });

                angular.element("html").on("drop", function(event) {
                    if ( event.target.className.indexOf("drop-wid-image") > -1 ) {
                        event.preventDefault();
                        event.dataTransfer = event.originalEvent.dataTransfer;			
                        var file = event.originalEvent.dataTransfer.files;          
                        if (file.length == 0) {
                            //alert("String dropped...");//return;

                            var data = event.dataTransfer.getData("Text");
                            //alert("data = "+data);
                            $scope.link.content = data;
                            //setTimeout(function(){
                            $scope.ContentPageBuilder.uploadLink('foreground','Image');
                            //},500);
                        }else if (file.length == 1) {
                            if ((file[0].type).indexOf('image') != -1) {
                                //alert("image dropped...");//return;
                                var sendFile = [];
                                sendFile.push(file[0]);
                                $scope.ContentPageBuilder.onFileSelect(sendFile , 'WidgetImage');
                            }else{
                                alert(file.type+" not allowed...");
                            }
                        }else{
                            alert('Please drop only one Link/Image at a time');
                        }
                    }
                    else if ( event.target.className.indexOf("drop-wid-video") > -1 ) {
                        event.preventDefault();
                        event.dataTransfer = event.originalEvent.dataTransfer;			
                        var file = event.originalEvent.dataTransfer.files;          
                        if (file.length == 0) {
                            //alert("String dropped...");//return;

                            var data = event.dataTransfer.getData("Text");
                            //alert("data = "+data);
                            $scope.link.content = data;
                            //setTimeout(function(){
                            $scope.ContentPageBuilder.uploadLink('foreground','Video');
                            //},500);
                        }else if (file.length == 1) {
                            if ((file[0].type).indexOf('video') != -1) {
                                //alert("image dropped...");//return;
                                var sendFile = [];
                                sendFile.push(file[0]);
                                $scope.ContentPageBuilder.onFileSelect(sendFile , 'WidgetVideo');
                            }else{
                                alert(file.type+" not allowed...");
                            }
                        }else{
                            alert('Please drop only one Link/Video at a time');
                        }
                    }
                    else if ( event.target.className.indexOf("drop-wid-audio") > -1 ) {
                        event.preventDefault();
                        event.dataTransfer = event.originalEvent.dataTransfer;			
                        var file = event.originalEvent.dataTransfer.files;          
                        if (file.length == 0) {
                            //alert("String dropped...");//return;

                            var data = event.dataTransfer.getData("Text");
                            //alert("data = "+data);
                            $scope.link.content = data;
                            //setTimeout(function(){
                            $scope.ContentPageBuilder.uploadLink('foreground','Audio');
                            //},500);
                        }else if (file.length == 1) {
                            if ((file[0].type).indexOf('audio') != -1) {
                                //alert("image dropped...");//return;
                                var sendFile = [];
                                sendFile.push(file[0]);
                                $scope.ContentPageBuilder.onFileSelect(sendFile , 'WidgetAudio');
                            }else{
                                alert(file.type+" not allowed...");
                            }
                        }else{
                            alert('Please drop only one Link/Audio at a time');
                        }
                    }
                    else{
                        //alert(98982);
                        event.preventDefault();
                        event.stopPropagation();
                    }
                });
            },
            uploadLink : function(context,mediaType){
                $scope.webLinkTitle = '';
                var input = $scope.link.content;
                var getOmbedProvider = {};
                var foundCase = $scope.find__initialCase( input ); // function is in uploadLink engine
                switch( foundCase ){
                    case "IFRAME" :
                        alert("Iframe case found!");
                        //handle iframe case
                        $scope.__UploadIframeCase( input )
                        break;

                    case "URL_OR_STRING" :
                        var foundOtherCase = $scope.find__OtherCase( input );
                        //alert("foundOtherCase = "+foundOtherCase);
                        switch( foundOtherCase ){
                            case "MEDIA" :
                                alert("Web Media case found....!");
                                $scope.__UploadMediaCase( input );// function is in uploadLink engine
                                break;

                            case "MAYBEOEMBED" :
                                //alert("MAYBEOEMBED case....!");
                                $scope.ContentPageBuilder.__UploadOembedCase(input,context,mediaType);
                                break;

                            default : 
                                alert("2) Strange......! How is this possible..check it!!!");
                        }
                        break;

                    default : 
                        alert("1) Strange......! How is this possible..check it!!!");

                }
                return false;
            },
            __UploadOembedCase : function ( url , context,mediaType) {
                var getOmbedProvider = oEmbeder.get__MatchedoEmbedProvider(url);
                if( !$.isEmptyObject( getOmbedProvider ) ){
                    $scope.ContentPageBuilder.get__oEmbedObj( getOmbedProvider.ApiEndPoint , url , context,mediaType )
                }
                else{
                    alert("Did not find oEmbed specification for the given link!");
                    return false;
                }
            },
            get__oEmbedObj : function(oEmbedApi , url , context , mediaType){
                var returnTitle = '';
                if( oEmbedApi && url ){
                    $http.get('/proxy/get_oembed?url='+oEmbedApi+'?url='+url+'&format=json')
                    .success(function (data, status, headers, config) {
                        console.log("data ",data);
                        //here we need to check the type of the link and accordingly create the html 
                        //content field
                        if( data.data ){
                            //alert("data.data = "+JSON.stringify(data.data));
                            if(!$.isEmptyObject(data.data)){
                                //data.data.html = $scope.get__oEmbedHtmlContent(data.data , url);
                                var html_content = "";
                                var result = data.data;
                                if ( result.type ) {
                                    switch(result.type.toUpperCase()){
                                        case 'PHOTO' :
                                            html_content = '<img src="'+result.url+'" alt="image" />';
                                            break;

                                        case 'VIDEO' :
                                            html_content = result.html;
                                            break;

                                        case 'AUDIO' :
                                            html_content = result.html;
                                            break;

                                        case 'RICH' :   //leaving this because soundcloud audio links type is "rich"
                                            html_content = result.html;
                                            break;
                                        /*    Not Now
                                        case 'LINK' : 
                                            html_content = '<a href="'+url+'" alt='+result.title+' title='+result.title+'>'+result.title+'</a>';
                                            if(result.thumbnail_url){
                                                html_content += '<img src="'+result.thumbnail_url+'" alt="image" />';
                                            }
                                            break;
                                        */
                                        default:
                                            html_content = result.html;
                                            alert("Sorry, We can not process this request, Try another one.");
                                            return;
                                            break;

                                    }
                                }

                                data.data.html = html_content;

                                if(data.data.html){
                                    data.data.html = data.data.html.replace("<![CDATA[", ""); 
                                    data.data.html = data.data.html.replace("]]>", ""); 
                                    $scope.link.content = data.data.html;
                                    $scope.link.linkType = data.data.type ? data.data.type : "";

                                    if( data.data.url ){
                                        $scope.link.thumbnail = data.data.url;
                                    }
                                    else if( data.data.image ){
                                        $scope.link.thumbnail = data.data.image;
                                    }
                                    else if( data.data.thumbnail_url ){
                                        $scope.link.thumbnail = data.data.thumbnail_url;
                                    }
                                    else{
                                        //$scope.link.thumbnail = data.data.thumbnail_url;
                                        //plan
                                        //alert("Error Code: get__oEmbedObj-001 => thumbnail_url,image & url keys are not present = "+$scope.link.thumbnail);
                                        alert("No Thumbnail Found!");
                                    }

                                    //$scope.webLinkTitle = data.data.title;
                                    //saveLinkData(pageId)
                                    //set data for create widget $watcher
                                    var inputObj = {};
                                    if(context && mediaType){
                                        switch(context){
                                            case 'background':
                                                inputObj.linkType = $scope.link.linkType ? $scope.link.linkType : "";     //image,video,audio
                                                inputObj.content = $scope.link.content ? $scope.link.content : "";
                                                inputObj.thumbnail = $scope.link.thumbnail ? $scope.link.thumbnail : "";
                                                inputObj.MediaType = "WidgetBg"+mediaType;     //'WidgetBgLink,'WidgetLink'
                                                CpPageService.uploadLink(this.chapter_id , this.page_id , inputObj)
                                                .then(function(data){
                                                    console.log("context = "+context+" and uploadLink : ----------------success----");
                                                    switch(mediaType){
                                                        case 'Image' : 
                                                            $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type = mediaType.toLowerCase();
                                                            $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data = inputObj.thumbnail;
                                                            $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData = inputObj.thumbnail ? inputObj.thumbnail : "";
                                                            $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Thumbnail = inputObj.thumbnail ? inputObj.thumbnail : "";
                                                            break;
                                                        case 'Video' :
                                                            $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type = mediaType.toLowerCase();
                                                            $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data = inputObj.content;
                                                            $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData = inputObj.thumbnail ? inputObj.thumbnail : "";
                                                            $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Thumbnail = inputObj.thumbnail ? inputObj.thumbnail : "";
                                                            $scope.ContentPageBuilder.updateBackground();
                                                            break;
                                                        default : 
                                                            console.log("How is this possible..Error - 9876554 ");
                                                            return;
                                                    }
                                                });

                                                break;
                                            case 'foreground':
                                                console.log("In foreground.............",mediaType);
                                                inputObj.linkType = $scope.link.linkType ? $scope.link.linkType : "";     //image,video,audio
                                                inputObj.content = $scope.link.content ? $scope.link.content : "";
                                                inputObj.thumbnail = $scope.link.thumbnail ? $scope.link.thumbnail : "";
                                                inputObj.MediaType = "Widget"+mediaType;     //'WidgetBgLink,'WidgetLink'
                                                CpPageService.uploadLink(this.chapter_id , this.page_id , inputObj)
                                                .then(function(data){
                                                    console.log("context = "+context+" and uploadLink : ----------------success----");
                                                    switch(mediaType){
                                                        case 'Image' : 
                                                            var createObj = {};
                                                            createObj.Type = 'image';
                                                            createObj.Data = inputObj.thumbnail;
                                                            createObj.LqData = inputObj.thumbnail;
                                                            createObj.Thumbnail = inputObj.thumbnail;

                                                            $scope.ContentPageBuilder.createWidget(createObj);
                                                            break;
                                                        case 'Video' :
                                                            var createObj = {};
                                                            createObj.Type = 'video';
                                                            createObj.Data = inputObj.content;
                                                            createObj.LqData = inputObj.content;
                                                            createObj.Thumbnail = inputObj.thumbnail;

                                                            $scope.ContentPageBuilder.createWidget(createObj);
                                                            break;
                                                        case 'Audio' :
                                                            var createObj = {};
                                                            createObj.Type = 'audio';
                                                            createObj.Data = inputObj.content;
                                                            createObj.LqData = inputObj.content;
                                                            createObj.Thumbnail = inputObj.thumbnail;

                                                            $scope.ContentPageBuilder.createWidget(createObj);
                                                            break;
                                                        default : 
                                                            console.log("How is this possible..Error - 9876554 ");
                                                            return;
                                                    }

                                                });

                                                break;
                                            default :
                                                alert("Context not found..."+context);

                                        }
                                    }
                                }
                                else{
                                    alert("Unknown Link!");
                                    return false;
                                }
                            }
                            else{
                                //alert("data.data = "+JSON.stringify(data.data));
                                alert("Unknown Link!");
                                return false;
                            }
                        }else{
                            alert("Error Code: get__oEmbedObj-002 => data.data not found...");
                        }
                    })
                    .error(function (data, status, headers, config) {
                        alert("Error Code: get__oEmbedObj-003 => error = "+status);
                    });
                }else{
                    console.log("oEmbedApi && url = ",oEmbedApi+"---------"+url);
                    $scope.webLinkTitle = returnTitle;
                }
            },
            updateViewport : function(viewport){
                var currentViewport = $scope.ContentPageBuilder.__config.currentViewport;
                if(viewport != currentViewport){
                    switch(currentViewport){
                        case 'desktop': 
                            $scope.ContentPageBuilder.__config.currentViewport = viewport;
                            console.log("$scope.ContentPageBuilder.__config.currentViewport = ",$scope.ContentPageBuilder.__config.currentViewport);
                            $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                            break;
                        case 'tablet': 
                            //$scope.ContentPageBuilder.__config.SyncObject.CommonParams. = viewport;
                            $scope.ContentPageBuilder.__config.currentViewport = viewport;
                            console.log("$scope.ContentPageBuilder.__config.SyncObject.CommonParams.ViewportTablet = ",$scope.ContentPageBuilder.__config.SyncObject.CommonParams.ViewportTablet);
                            if(!$scope.ContentPageBuilder.__config.SyncObject.CommonParams.ViewportTablet){
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.ViewportTablet = true;
                                $scope.ContentPageBuilder.updateCommonParams();
                            }
                            console.log("$scope.ContentPageBuilder.__config.currentViewport = ",$scope.ContentPageBuilder.__config.currentViewport);
                            $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                            break;
                        case 'mobile': 
                            $scope.ContentPageBuilder.__config.currentViewport = viewport;
                            console.log("$scope.ContentPageBuilder.__config.SyncObject.CommonParams.ViewportMobile = ",$scope.ContentPageBuilder.__config.SyncObject.CommonParams.ViewportMobile);
                            if(!$scope.ContentPageBuilder.__config.SyncObject.CommonParams.ViewportMobile){
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.ViewportMobile = true;
                                $scope.ContentPageBuilder.updateCommonParams();
                            }
                            console.log("$scope.ContentPageBuilder.__config.currentViewport = ",$scope.ContentPageBuilder.__config.currentViewport);
                            $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                            break;
                        default :
                            alert("Wrong currentViewport = ",currentViewport);
                            return;
                    }
                }

            },
            WidgetLazyLoadEngine : function(obj){
                var Widgets = obj.ViewportDesktopSections.Widgets;
                var workshop = $scope.ContentPageBuilder.__config.workshop;
                var showroom = $scope.ContentPageBuilder.__config.showroom;

                workshop.html($compile('')($scope));
                showroom.html($compile('')($scope));

                var currentViewport = $scope.ContentPageBuilder.__config.currentViewport;
                switch(currentViewport){
                    case 'desktop': 
                        Widgets = obj.ViewportDesktopSections.Widgets;
                        console.log("----WidgetLazyLoadEngine----currentViewport = ",currentViewport);
                        console.log("Widgets.length------",Widgets.length);

                        if(Widgets.length==0){
                            workshop.html($compile('')($scope));
                            $scope.ContentPageBuilder.update();
                            return;
                        }
                        //make an order in the object - first take in temp array then override at once because SyncObject-$watch is working on changes
                        //$scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets[loop].SrNo = loop+1;
                        for(var loop = 0; loop < Widgets.length; loop++){
                            Widgets[loop].SrNo = loop+1;
                        }
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets = Widgets;

                        var workshop__Widgets = '';
                        var showroom__Widgets = '';
                        for(var loop = 0; loop < Widgets.length; loop++){
                            var currentWid = Widgets[loop];
                            console.log("currentWid------",currentWid);

                            switch(currentWid.Type){
                                case "text" : 
                                    workshop__Widgets += '<div text-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow fadeIn" data-wow-delay="2s" data-wow-duration="2s" showroom-text-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "image" : 
                                    workshop__Widgets += '<div image-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow fadeIn" data-wow-delay="2s" data-wow-duration="2s" showroom-image-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "video" : 
                                    workshop__Widgets += '<div video-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow fadeIn" data-wow-delay="2s" data-wow-delay="2s" data-wow-duration="2s" showroom-video-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "audio" : 
                                    workshop__Widgets += '<div audio-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow fadeIn" data-wow-delay="2s" data-wow-duration="3s" showroom-audio-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "questAnswer" : 
                                    workshop__Widgets += '<div quest-answer-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow fadeIn" data-wow-delay="2s" data-wow-duration="1s" showroom-quest-answer-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                default :
                                    console.log("unknwon widget type = ",currentWid.Type);
                            }
                        }
                        //now $compile the angular templates...optimized..
                        workshop.html($compile(workshop__Widgets)($scope));
                        showroom.html($compile(showroom__Widgets)($scope));
                        break;
                    case 'tablet': 
                        Widgets = obj.ViewportTabletSections.Widgets;
                        console.log("----WidgetLazyLoadEngine----currentViewport = ",currentViewport);
                        console.log("Widgets.length------",Widgets.length);

                        if(Widgets.length==0){
                            workshop.html($compile('')($scope));
                            $scope.ContentPageBuilder.update();
                            return;
                        }
                        for(var loop = 0; loop < Widgets.length; loop++){
                            Widgets[loop].SrNo = loop+1;
                        }
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets = Widgets;

                        var workshop__Widgets = '';
                        var showroom__Widgets = '';
                        for(var loop = 0; loop < Widgets.length; loop++){
                            var currentWid = Widgets[loop];
                            console.log("currentWid------",currentWid);

                            switch(currentWid.Type){
                                case "text" : 
                                    workshop__Widgets += '<div text-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-text-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "image" : 
                                    workshop__Widgets += '<div image-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-image-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "video" : 
                                    workshop__Widgets += '<div video-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-video-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "audio" : 
                                    workshop__Widgets += '<div audio-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-audio-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "questAnswer" : 
                                    workshop__Widgets += '<div quest-answer-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-quest-answer-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                default :
                                    console.log("unknwon widget type = ",currentWid.Type);
                            }
                        }
                        //now $compile the angular templates...optimized..
                        workshop.html($compile(workshop__Widgets)($scope));
                        showroom.html($compile(showroom__Widgets)($scope));

                        break;
                    case 'mobile': 
                        Widgets = obj.ViewportMobileSections.Widgets;
                        console.log("----WidgetLazyLoadEngine----currentViewport = ",currentViewport);
                        console.log("Widgets.length------",Widgets.length);

                        if(Widgets.length==0){
                            workshop.html($compile('')($scope));
                            $scope.ContentPageBuilder.update();
                            return;
                        }
                        for(var loop = 0; loop < Widgets.length; loop++){
                            Widgets[loop].SrNo = loop+1;
                        }
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets = Widgets;

                        var workshop__Widgets = '';
                        var showroom__Widgets = '';
                        for(var loop = 0; loop < Widgets.length; loop++){
                            var currentWid = Widgets[loop];
                            console.log("currentWid------",currentWid);

                            switch(currentWid.Type){
                                case "text" : 
                                    workshop__Widgets += '<div text-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-text-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "image" : 
                                    workshop__Widgets += '<div image-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-image-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "video" : 
                                    workshop__Widgets += '<div video-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-video-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "audio" : 
                                    workshop__Widgets += '<div audio-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-audio-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                case "questAnswer" : 
                                    workshop__Widgets += '<div quest-answer-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';
                                    showroom__Widgets += '<div style="display:none;" class="forWidAnimation wow bounceInUp" showroom-quest-answer-widget cpbuilder="ContentPageBuilder" obj="ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets['+loop+']"></div>';

                                    $scope.$watchCollection("ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets["+loop+"]", function(newValue , oldValue) {  
                                        "undefined" != typeof newValue && "undefined" != typeof oldValue && !angular.equals({}, oldValue) && newValue != oldValue && $scope.ContentPageBuilder.update(newValue , oldValue);
                                    });
                                    break;
                                default :
                                    console.log("unknwon widget type = ",currentWid.Type);
                            }
                        }
                        //now $compile the angular templates...optimized..
                        workshop.html($compile(workshop__Widgets)($scope));
                        showroom.html($compile(showroom__Widgets)($scope));
                        break;
                    default :
                        alert("Wrong currentViewport = ",currentViewport);
                        return;
                }
            },
            getOnlyWidAnimationArr : function(){
                var currentViewport = $scope.ContentPageBuilder.__config.currentViewport;
                var Widgets = [];
                switch(currentViewport){
                    case 'desktop': 
                        Widgets = $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets;
                        break;
                    case 'tablet': 
                        Widgets = $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets;
                        break;
                    case 'mobile': 
                        Widgets = $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets;
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
            startWidgetLoading : function(widgetNo){
                //return;
                //first of all - play background video if any..
                var background = angular.element('.showroom-main .main-bg');
                
                if(background.find('iframe')){
                    var videoElem = background.find('iframe'); 
                    var src = angular.element(videoElem).attr("src");
                    //AVEngine.play(videoElem , 'youtube');
                    //alert("youtube background case found..");
                }
                else if(background.find('video')){
                    var videoElem = background.find('video'); 
                    //AVEngine.play(videoElem , 'htmlTag');
                }
                else if(background.find('audio')){
                    var videoElem = background.find('audio'); 
                    //AVEngine.play(videoElem , 'htmlTag');
                }
                else{
                   //image case - no need to do anything... 
                }
                
                /*
                var videoElem = element.find('iframe');
                angular.element(videoElem).addClass("hundredpercentwh");
                console.log("angular.element(videoElem).attr(src) =00000000000000000 ",angular.element(videoElem).attr("src"));
                var src = angular.element(videoElem).attr("src");
                var newsrc = src+";autoplay=1&amp;loop=1&amp;";
                angular.element(videoElem).attr("src" , newsrc);
                */

                angular.element('.showroom-content-wrap').height(angular.element('.ui-draggable').height() - 100);
                var allWidgets = angular.element('.forWidAnimation');
                var widCount = allWidgets.length;
                var animArr = $scope.ContentPageBuilder.getOnlyWidAnimationArr();

                var AnimationProgress = false   //true/false
                widgetNo = ((widgetNo < 0) ? -1 : ((widgetNo > widCount) ? widCount : widgetNo));

                if(widgetNo > widCount ){
                   //alert("End of the current page, Now load Next Page.."); 
                   console.log("-----------End of the current page, Now load Next Page.."); 
                   return;
                }

                if(widgetNo < -1 ){
                   //alert("Start of the current page, Now load Previous Page.."); 
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
                    //angular.element(Widget).toggle(Animation , function(){
                    angular.element(Widget).transit();
                                            (function(){
                        AnimationProgress = false;
                        //alert("AnimationProgress = Done");
                        //autoplay=1 if it's a video/audio
                        var element = angular.element(angular.element(Widget).find('iframe'));
                        element.addClass("hundredpercentwh");
                        //play(element);

                    })();
                }

                document.onkeydown = function (e) {
                    console.log("AnimationProgress-----------",AnimationProgress);
                    var left = 37,
                    up = 38,
                    right = 39,
                    down = 40;

                    var keyCode = e.keyCode;

                    switch(keyCode){
                        /*case left:
                            if(!AnimationProgress){
                                $timeout(function(){
                                    AnimationProgress = true;
                                    loadWidget(allWidgets[widgetNo] , animArr[widgetNo]);
                                    $scope.ContentPageBuilder.startWidgetLoading(widgetNo-1);
                                },20)
                            }
                            break;*/
                        case right:
                            if(!AnimationProgress){
                                $timeout(function(){
                                    AnimationProgress = true;
                                    loadWidget(allWidgets[widgetNo] , animArr[widgetNo]);
                                    $scope.ContentPageBuilder.startWidgetLoading(widgetNo+1);
                                },20)
                            }
                            break;
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
                        case down:
                            //alert("It's still working");
                            //$timeout(function(){
                                if(!AnimationProgress && (angular.element(window).height()+angular.element(window).scrollTop() == angular.element(document).height())){
                                    //alert('Scrolled to Page Bottom'+(angular.element(window).height()+angular.element(window).scrollTop()+" = "+angular.element(document).height()));
                                    $timeout(function(){
                                        AnimationProgress = true;
                                        loadWidget(allWidgets[widgetNo] , animArr[widgetNo]);
                                        $scope.ContentPageBuilder.startWidgetLoading(widgetNo+1);
                                    },20)
                                }
                            //},100)
                            break;
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
                //return;
                document.onkeydown = null;
                //angular.element(document).off('keydown');
                //var workshop = $scope.ContentPageBuilder.__config.workshop;
                //var showroom = $scope.ContentPageBuilder.__config.showroom;

                //workshop.html($compile('')($scope));
                //showroom.html($compile('')($scope));

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
            },
            update : function(){
                var inputObj = {};
                inputObj.currentViewport = $scope.ContentPageBuilder.__config.currentViewport;
                console.log("inputObj.currentViewport----0000000000000000000000000000",inputObj.currentViewport);
                
                
                switch(inputObj.currentViewport){
                    case 'desktop': 
                        inputObj.ViewportDesktopSections = $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections;
                        break;
                    case 'tablet': 
                        inputObj.ViewportTabletSections = $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections;
                        break;
                    case 'mobile': 
                        inputObj.ViewportMobileSections = $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections;
                        break;
                    default :
                        console.log("Wrong currentViewport = ",inputObj.currentViewport);
                        return;
                }

                //inputObj.ViewportDesktopSections = $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections;
                CpPageService.updateWidgets(this.chapter_id , this.page_id , inputObj)
                .then(function(data){
                    console.log("update : updateWidgets----------------success----");
                });
            },
            deleteBackground : function(){
                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type = "color";
                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data = "";
                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData = "";
                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.BgOpacity = "";
                var inputObj = {};

                inputObj.Type = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type;
                inputObj.Data = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data;
                inputObj.LqData = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData;
                inputObj.BgOpacity = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.BgOpacity;

                CpPageService.updateBackground(this.chapter_id , this.page_id , inputObj)
                .then(function(data){
                    console.log("success----",data);
                    console.log("updateBackground---------------Object Synced with the server..... :)");
                });
            },
            updateBackground : function(){
                var inputObj = {};
                inputObj.Type = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type;
                inputObj.Data = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data;
                inputObj.LqData = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData;
                inputObj.Thumbnail = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Thumbnail;
                inputObj.BgOpacity = $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.BgOpacity;

                CpPageService.updateBackground(this.chapter_id , this.page_id , inputObj)
                .then(function(data){
                    console.log("success----",data);
                    console.log("updateBackground---------------Object Synced with the server..... :)");
                });
            },
            updateCommonParams : function(){
                var inputObj = {};
                inputObj.CommonParams = $scope.ContentPageBuilder.__config.SyncObject.CommonParams;
                //console.log("inputObj.CommonParams-------------",inputObj.CommonParams);

                CpPageService.updateCommonParams(this.chapter_id , this.page_id , inputObj)
                .then(function(data){
                    //console.log("success----",data);
                    console.log("updateCommonParams---------------Object Synced with the server..... :)");
                });
            },
            createWidget : function(inputObj){
                var Type = inputObj.Type ? inputObj.Type : "";
                var Data = inputObj.Data ? inputObj.Data : "";
                var LqData = inputObj.LqData ? inputObj.LqData : "";
                var Thumbnail = inputObj.Thumbnail ? inputObj.Thumbnail : "";


                console.log("$scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.length = ",$scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.length);
                //var widgetType = req.body.currentViewport ? req.body.currentViewport : ""; 
                //"text","image","audio","video","questAnswer"
                var W = 610;
                var H = 322;
                var X = 100;
                var Y = 200;
                var zIndex_desktop = 100 + $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.length;
                var zIndex_tablet = 100 + $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.length;
                var zIndex_mobile = 100 + $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.length;

                var data_desktop = {
                    SrNo : 1,
                    Animation : "fadeIn",
                    BgMusic : "",
                    Type : "text",
                    Data : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    LqData : LqData,
                    Thumbnail : Thumbnail,
                    W : W,
                    H : H,
                    X : X,
                    Y : Y,
                    Z : zIndex_desktop
                };
                var data_tablet = data_desktop;
                data_tablet.Z = zIndex_tablet;

                var data_mobile = data_desktop;
                data_mobile.Z = zIndex_mobile;

                var currentViewport = $scope.ContentPageBuilder.__config.currentViewport;
                switch(currentViewport){
                    case 'desktop':
                        console.log("$scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.length = ",$scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.length);
                        W = 500;
                        H = 322;
                        X = 100;
                        Y = 100;
                        break;
                    case 'tablet': 
                        console.log("$scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.length = ",$scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.length);
                        W = 500;
                        H = 322;
                        X = 70;
                        Y = 100;
                        break;
                    case 'mobile': 
                        console.log("$scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.length = ",$scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.length);
                        W = 500;
                        H = 322;
                        X = -77;
                        Y = 50;
                        break;
                    default :
                        alert("Wrong currentViewport = ",currentViewport);
                        return;
                }

                switch(Type){
                    case "text" : 
                        data_desktop = {
                            SrNo : 1,
                            Animation : "fadeIn",
                            BgMusic : "",
                            Type : "text",
                            Data : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                            LqData : LqData,
                            Thumbnail : Thumbnail,
                            W : W,
                            H : H,
                            X : X,
                            Y : Y,
                            Z : zIndex_desktop
                        };
                        data_tablet = data_desktop;
                        data_tablet.Z = zIndex_tablet;

                        data_mobile = data_desktop;
                        data_mobile.Z = zIndex_mobile;

                        //Only in case of create - add in all viewports
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.push(data_desktop);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.push(data_tablet);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.push(data_mobile);

                        $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                        break;
                    case "image" : 
                        //$scope.ContentPageBuilder.start($file)
                        data_desktop = {
                            SrNo : 1,
                            Animation : "fadeIn",
                            BgMusic : "",
                            Type : "image",
                            Data : Data,
                            LqData : LqData,
                            Thumbnail : Thumbnail,
                            W : W,
                            H : H,
                            X : X,
                            Y : Y,
                            Z : zIndex_desktop
                        };

                        data_tablet = data_desktop;
                        data_tablet.Z = zIndex_tablet;

                        data_mobile = data_desktop;
                        data_mobile.Z = zIndex_mobile;

                        //Only in case of create - add in all viewports
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.push(data_desktop);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.push(data_tablet);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.push(data_mobile);

                        $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                        break;
                    case "video" : 
                        data_desktop = {
                            SrNo : 1,
                            Animation : "fadeIn",
                            BgMusic : "",
                            Type : "video",
                            Data : Data,
                            LqData : LqData,
                            Thumbnail : Thumbnail,
                            W : W,
                            H : H,
                            X : X,
                            Y : Y,
                            Z : zIndex_desktop
                        };

                        data_tablet = data_desktop;
                        data_tablet.Z = zIndex_tablet;

                        data_mobile = data_desktop;
                        data_mobile.Z = zIndex_mobile;
                        //Only in case of create - add in all viewports
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.push(data_desktop);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.push(data_tablet);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.push(data_mobile);

                        $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                        break;
                    case "audio" : 
                        data_desktop = {
                            SrNo : 1,
                            Animation : "fadeIn",
                            BgMusic : "",
                            Type : "audio",
                            Data : Data,
                            LqData : LqData,
                            Thumbnail : Thumbnail,
                            W : W,
                            H : H,
                            X : X,
                            Y : Y,
                            Z : zIndex_desktop
                        };

                        data_tablet = data_desktop;
                        data_tablet.Z = zIndex_tablet;

                        data_mobile = data_desktop;
                        data_mobile.Z = zIndex_mobile;
                        //Only in case of create - add in all viewports
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.push(data_desktop);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.push(data_tablet);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.push(data_mobile);

                        $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                        break;
                    case "questAnswer" : 
                        data_desktop = {
                            SrNo : 1,
                            Animation : "fadeIn",
                            BgMusic : "",
                            Type : "questAnswer",
                            Data : Data,
                            LqData : LqData,
                            Thumbnail : Thumbnail,
                            W : 838,
                            H : 560,
                            X : X,
                            Y : Y,
                            Z : zIndex_desktop
                        };

                        data_tablet = data_desktop;
                        data_tablet.Z = zIndex_tablet;

                        data_mobile = data_desktop;
                        data_mobile.Z = zIndex_mobile;
                        //Only in case of create - add in all viewports
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.push(data_desktop);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.push(data_tablet);
                        $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.push(data_mobile);

                        $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                        break;
                    default :
                        console.log("Input Error : Wrong Widget Type = ",Type);
                        return;

                }
            },
            removeWidget : function(obj){
                //alert("removeWidget...........");
                console.log("removeWidget...........object ========= ",obj.Z);//return;
                var idx = -1;

                switch($scope.ContentPageBuilder.__config.currentViewport){
                    case 'desktop': 
                        idx = this.getObjArrayIdxByKey($scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets,'Z',obj.Z);
                        if(idx >= 0){
                            console.log("deleted index = ",idx);
                            $scope.ContentPageBuilder.__config.SyncObject.ViewportDesktopSections.Widgets.splice(idx , 1);
                            $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                        }
                        else{
                            alert("222Something went wrong, index not found = ",idx);
                        }
                        break;
                    case 'tablet': 
                        idx = this.getObjArrayIdxByKey($scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets,'Z',obj.Z);
                        if(idx >= 0){
                            console.log("deleted index = ",idx);
                            $scope.ContentPageBuilder.__config.SyncObject.ViewportTabletSections.Widgets.splice(idx , 1);
                            $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                        }
                        else{
                            alert("333Something went wrong, index not found = ",idx);
                        }
                        break;
                    case 'mobile': 
                        idx = this.getObjArrayIdxByKey($scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets,'Z',obj.Z);
                        if(idx >= 0){
                            console.log("deleted index = ",idx);
                            $scope.ContentPageBuilder.__config.SyncObject.ViewportMobileSections.Widgets.splice(idx , 1);
                            $scope.ContentPageBuilder.WidgetLazyLoadEngine($scope.ContentPageBuilder.__config.SyncObject);
                        }
                        else{
                            alert("444Something went wrong, index not found = ",idx);
                        }
                        break;
                    default :
                        alert("Wrong currentViewport = ",currentViewport);
                        return;
                }
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
            onFileSelect : function($files , flag) {
                var MediaType = "";
                //set MediaType
                switch(flag){
                    case 'BackgroundImage':
                        MediaType = 'WidgetBgImage';
                        break;
                    case 'BackgroundVideo':
                        MediaType = 'WidgetBgVideo';
                        break;
                    case 'WidgetImage':
                        MediaType = 'WidgetImage';
                        break;
                    case 'WidgetVideo':
                        MediaType = 'WidgetVideo';
                        break;
                    case 'WidgetAudio':
                        MediaType = 'WidgetAudio';
                        break;
                    case 'WidgetQuestAnswer':
                        MediaType = 'WidgetQuestAnswer';
                        break;
                    default:
                        alert("Error-9898 : Something went wrong...");
                        return;
                }

                $('#overlay2').show();
                $('#overlayContent2').show();
                $scope.uploadRightAway=1;
                $scope.percentUpload=0;
                $scope.imagessize=0;
                $scope.selectedFiles = [];
                $scope.fileUpload=[];
                $scope.progress = [];
                if ($scope.upload && $scope.upload.length > 0) {
                    for (var i = 0; i < $scope.upload.length; i++) {
                        if ($scope.upload[i] != null) {
                            $scope.upload[i].abort();
                        }
                    }
                }
                $scope.upload = [];
                $scope.uploadResult = [];
                $scope.selectedFiles = $files;
                $scope.lengthofuploads=$files.length;
                $scope.fileUpload=$files;
                $scope.dataUrls = [];
                for ( var i = 0; i < $files.length; i++) {
                    var $file = $files[i];
                    $scope.imagessize+=Math.round($files[i].size/1024);
                    if (window.FileReader && $file.type.indexOf('image') > -1) {
                        var fileReader = new FileReader();
                        fileReader.readAsDataURL($files[i]);
                        var loadFile = function(fileReader, index) {
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    $scope.dataUrls[index] = e.target.result;
                                });
                            }
                        }(fileReader, i);
                    }
                    $scope.progress[i] = -1;
                    if ($scope.uploadRightAway) {
                        $scope.ContentPageBuilder.start(i , MediaType);
                    }
                }
            },
            start : function(index , MediaType) {
                $scope.disablebtn=true;
                $scope.progress[index] = 0;
                $scope.errorMsg = null;
                if ($scope.howToSend != 1) {
                    //alert("Start - If");
                    $scope.upload[index] = $upload.upload({
                        url : '/pages/uploadMedia',
                        method: $scope.httpMethod,
                        headers: {'my-header': 'my-header-value'},
                        data : {
                            MediaType : MediaType,
                            myModel : $scope.myModel
                        },				
                        file: $scope.selectedFiles[index],
                        fileFormDataName: 'myFile'
                    }).then(function(response) {
                        $('#overlay2').hide();
                        $('#overlayContent2').hide();
                        $scope.disablebtn=false;
                        $scope.uploadResult.push(response.data);
                    }, function(response) {
                            if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                    }, function(evt) {
                            // Math.min is to fix IE which reports 200% sometimes
                            $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    }).xhr(function(xhr){
                            xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
                    }).success(function(data, status, headers, config) {				
                        switch(MediaType){
                            case 'WidgetBgImage':
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type = "image";
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data = "../assets/Media/img/"+data.Location[0].URL;
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData = "../assets/Media/img/"+data.Location[0].URL;
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Thumbnail = "../assets/Media/img/"+data.thumbnail;
                                $scope.ContentPageBuilder.updateBackground();
                                //$scope.$apply();

                                break;
                            case 'WidgetBgVideo':
                                //alert("Still pending case...use gridfs..");return;
                                console.log("data-------",data);

                                var videoTemplate = '<video style="width:100%;height:100%;" autoplay loop controls>';
                                    videoTemplate += '<source src="../assets/Media/video/'+data.Locator+'.mp4" type="video/mp4"/>';
                                    videoTemplate += '<source src="../assets/Media/video/'+data.Locator+'.webm" type="video/webm"/>';
                                    videoTemplate += '<source src="../assets/Media/video/'+data.Locator+'.ogg" type="video/ogg"/>';
                                    videoTemplate += 'Your browser does not support the <code>video</code> element.';
                                    videoTemplate += '</video>';

                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type = "video";
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data = videoTemplate;
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData = videoTemplate;
                                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Thumbnail = "../assets/Media/video/"+data.thumbnail;
                                $scope.ContentPageBuilder.updateBackground();
                                break;
                            case 'WidgetImage':
                                var inputObj = {};
                                inputObj.Type = 'image';
                                inputObj.Data = "../assets/Media/img/"+data.Location[0].URL;
                                inputObj.LqData = "../assets/Media/img/"+data.Location[0].URL;
                                inputObj.Thumbnail = "../assets/Media/img/"+data.Location[0].URL;

                                $scope.ContentPageBuilder.createWidget(inputObj);
                                break;
                            case 'WidgetVideo':
                                console.log("data-------",data);

                                var videoTemplate = '<video style="width:100%;height:100%;" controls>';
                                    videoTemplate += '<source src="../assets/Media/video/'+data.Locator+'.mp4" type="video/mp4"/>';
                                    videoTemplate += '<source src="../assets/Media/video/'+data.Locator+'.webm" type="video/webm"/>';
                                    videoTemplate += '<source src="../assets/Media/video/'+data.Locator+'.ogg" type="video/ogg"/>';
                                    videoTemplate += 'Your browser does not support the <code>video</code> element.';
                                    videoTemplate += '</video>';

                                var inputObj = {};
                                inputObj.Type = 'video';
                                inputObj.Data = videoTemplate;
                                inputObj.LqData = videoTemplate;
                                inputObj.Thumbnail = "../assets/Media/video/"+data.thumbnail;

                                $scope.ContentPageBuilder.createWidget(inputObj);
                                break;
                            case 'WidgetAudio':
                                console.log("data-------",data);

                                var audioTemplate = '<audio style="width:100%;height:100%;" controls>';
                                    audioTemplate += '<source src="../assets/Media/video/'+data.Locator+'.mp3" type="audio/mp3"/>';
                                    //audioTemplate += '<source src="../assets/Media/video/'+data.Locator+'.webm" type="audio/webm"/>';
                                    audioTemplate += '<source src="../assets/Media/video/'+data.Locator+'.ogg" type="audio/ogg"/>';
                                    audioTemplate += 'Your browser does not support the <code>video</code> element.';
                                    audioTemplate += '</audio>';

                                var inputObj = {};
                                inputObj.Type = 'audio';
                                inputObj.Data = audioTemplate;
                                inputObj.LqData = audioTemplate;
                                inputObj.Thumbnail = "../assets/Media/img/"+data.thumbnail;

                                $scope.ContentPageBuilder.createWidget(inputObj);
                                break;
                            case 'WidgetQuestAnswer':
                                inputObj.Type = 'questAnswer';
                                inputObj.Data = "../assets/Media/img/"+data.Location[0].URL;
                                inputObj.LqData = "../assets/Media/img/"+data.Location[0].URL;
                                inputObj.Thumbnail = "../assets/Media/img/"+data.Location[0].URL;

                                $scope.ContentPageBuilder.createWidget(inputObj);
                                break;
                            default:
                                alert("Error-9898 : Something went wrong...");

                        }
                        return;
                        $scope.count++;				
                        console.log('scope.count = '+$scope.count);
                        console.log('$scope.selectedFiles.length = '+$scope.selectedFiles.length);

                        if($scope.count==$scope.selectedFiles.length){
                            $scope.percentUpload=100;

                            $scope.imagessize=0;
                            $scope.selectedFiles = [];
                            $scope.fileUpload=[];
                            $scope.progress = [];
                            $scope.count=0;
                            var offsetlength={
                                offset:0,
                                limit:20
                            };
                            $scope.uploadedMedia=data;                                    
                            //$('.upload_img').trigger('click');
                            //$('#'+pageId+' .upload_img').trigger('click');
                        }
                        else{
                            $scope.percentUpload=Math.round(($scope.count/$scope.lengthofuploads)*100);
                        }		
                    });
                } else {
                    alert("Start - ELSE-");
                    var fileReader = new FileReader();
                    fileReader.onload = function(e) {
                        $scope.upload[index] = $upload.http({
                            url: '/massmediaupload/add',
                            headers: {'Content-Type': $scope.selectedFiles[index].type},
                            data: e.target.result
                        }).then(function(response) {
                            $('#overlay2').hide();
                            $('#overlayContent2').hide();
                            $scope.uploadResult.push(response.data);
                        }, function(response) {
                            if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                        }, function(evt) {
                            // Math.min is to fix IE which reports 200% sometimes
                            $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        });
                    }
                    fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
                }
            },
            setPasteData : function(type){
                var data = $scope.ContentPageBuilder.pasteData ? $scope.ContentPageBuilder.pasteData : "";
                switch(type){
                    case 'WidgetBgImage':
                        $scope.link.content = data;
                        $scope.ContentPageBuilder.uploadLink('background','Image');
                        $scope.ContentPageBuilder.pasteData = "";
                        break;
                    case 'WidgetBgVideo':
                        $scope.link.content = data;
                        $scope.ContentPageBuilder.uploadLink('background','Video');
                        $scope.ContentPageBuilder.pasteData = "";
                        break;
                    case 'WidgetImage':
                        $scope.link.content = data;
                        $scope.ContentPageBuilder.uploadLink('foreground','Image');
                        $scope.ContentPageBuilder.pasteData = "";
                        break;
                    case 'WidgetVideo':
                        $scope.link.content = data;
                        $scope.ContentPageBuilder.uploadLink('foreground','Video');
                        $scope.ContentPageBuilder.pasteData = "";
                        break;
                    case 'WidgetAudio':
                        $scope.link.content = data;
                        $scope.ContentPageBuilder.uploadLink('foreground','Audio');
                        $scope.ContentPageBuilder.pasteData = "";
                        break;
                    default:
                        alert("Error-9898 : Something went wrong...");
                        $scope.ContentPageBuilder.pasteData = "";
                        return;
                }
            },
            setSelectGallery : function(type , test){
                $scope.ContentPageBuilder.selectGallery  = type ? type : "";

                var selectGallery = $scope.ContentPageBuilder.selectGallery ? $scope.ContentPageBuilder.selectGallery : "";
                switch(selectGallery){
                    case 'WidgetBgImage':
                        $scope.ContentPageBuilder.show_load = true;
                        $scope.ContentPageBuilder.medialist = [];
                        $scope.ContentPageBuilder.totalpages = 0;
                        $scope.ContentPageBuilder.pagecount =1;
                        $scope.ContentPageBuilder.getImagesList();

                        break;
                    case 'WidgetBgVideo':
                        $scope.ContentPageBuilder.show_load = true;
                        $scope.ContentPageBuilder.medialist = [];
                        $scope.ContentPageBuilder.totalpages = 0;
                        $scope.ContentPageBuilder.pagecount = 1;
                        $scope.ContentPageBuilder.getVideosList();
						if(test == 'step_1')
							$(".search-gallery-page-step-1").show();
							
						if(test == 'test')
							$(".search-gallery-page-modal").show();
						
                        break;

                    case 'WidgetImage':
                        $scope.ContentPageBuilder.show_load = true;
                        $scope.ContentPageBuilder.medialist = [];
                        $scope.ContentPageBuilder.totalpages = 0;
                        $scope.ContentPageBuilder.pagecount =1;
                        $scope.ContentPageBuilder.getImagesList();

                        break;
                    case 'WidgetVideo':
                        $scope.ContentPageBuilder.show_load = true;
                        $scope.ContentPageBuilder.medialist = [];
                        $scope.ContentPageBuilder.totalpages = 0;
                        $scope.ContentPageBuilder.pagecount = 1;
                        $scope.ContentPageBuilder.getVideosList();

                        break;
                    default:
                        alert("Error-986868 : Something went wrong...");
                        return;
                }
            },
            getImagesList: function(offset){
                var obj = {};
                obj.type = 'Image';
                //obj.type1 = 'Link';
                obj.limit = 50;
                obj.skip = offset ? offset : 0;

                $http.post('/pages/getMedia',obj).then(function (data) {			
                    if (data.data.code==200){
                        $scope.ContentPageBuilder.pageSize = obj.skip + obj.limit;
                        console.log("Response",data.data.response)
                        angular.forEach(data.data.response, function(value, key) {
                            $scope.ContentPageBuilder.medialist.push(value);
                        });

                        $scope.ContentPageBuilder.count = data.data.count;
                        console.log($scope.ContentPageBuilder.count);
                        $scope.ContentPageBuilder.totalpages = Math.floor($scope.ContentPageBuilder.count / obj.limit);
                    }
                })
            },
            getVideosList: function(offset){
                var obj = {};
                obj.type = 'Video';
                obj.limit = 50;
                obj.skip = offset ? offset : 0;

                $http.post('/pages/getMedia',obj).then(function (data) {			
                    if (data.data.code==200){
                        $scope.ContentPageBuilder.pageSize = obj.skip + obj.limit;
                        console.log("Response",data.data.response)

                        angular.forEach(data.data.response, function(value, key) {
                                $scope.ContentPageBuilder.medialist.push(value);
                        });
                        $scope.ContentPageBuilder.count = data.data.count;
                        $scope.ContentPageBuilder.totalpages = Math.floor($scope.ContentPageBuilder.count / obj.limit);
                    }	
                })	
            },
            showMoreItems : function() {
                var selectGallery = $scope.ContentPageBuilder.selectGallery ? $scope.ContentPageBuilder.selectGallery : "";
                switch(selectGallery){
                    case 'WidgetBgImage':
                        if ($scope.ContentPageBuilder.pagecount < $scope.ContentPageBuilder.totalpages -1) {
                            var offset = $scope.ContentPageBuilder.pageSize;
                            $scope.ContentPageBuilder.pagecount = $scope.ContentPageBuilder.pagecount + 1;
                            $scope.ContentPageBuilder.getImagesList(offset);
                            $scope.ContentPageBuilder.show_load = true;
                        }else{
                            $scope.ContentPageBuilder.show_load = false;
                        }
                        break;
                    case 'WidgetBgVideo':
                        if ($scope.ContentPageBuilder.pagecount < $scope.ContentPageBuilder.totalpages -1) {
                            var offset = $scope.ContentPageBuilder.pageSize;
                            $scope.ContentPageBuilder.pagecount = $scope.ContentPageBuilder.pagecount + 1;
                            $scope.ContentPageBuilder.getVideosList(offset);
                            $scope.ContentPageBuilder.show_load = true;
                        }else{
                            $scope.ContentPageBuilder.show_load = false;
                        }

                        break;

                    case 'WidgetImage':
                        if ($scope.ContentPageBuilder.pagecount < $scope.ContentPageBuilder.totalpages -1) {
                            var offset = $scope.ContentPageBuilder.pageSize;
                            $scope.ContentPageBuilder.pagecount = $scope.ContentPageBuilder.pagecount + 1;
                            $scope.ContentPageBuilder.getImagesList(offset);
                            $scope.ContentPageBuilder.show_load = true;
                        }else{
                            $scope.ContentPageBuilder.show_load = false;
                        }

                        break;
                    case 'WidgetVideo':
                        if ($scope.ContentPageBuilder.pagecount < $scope.ContentPageBuilder.totalpages -1) {
                            var offset = $scope.ContentPageBuilder.pageSize;
                            $scope.ContentPageBuilder.pagecount = $scope.ContentPageBuilder.pagecount + 1;
                            $scope.ContentPageBuilder.getVideosList(offset);
                            $scope.ContentPageBuilder.show_load = true;
                        }else{
                            $scope.ContentPageBuilder.show_load = false;
                        }

                        break;
                    default:
                        alert("Error-986868 : Something went wrong...");
                        return;
                }	
            },
            setMedia : function(data){
                console.log("Media ---",data);
                var data = data ? data : {};
                var selectGallery = $scope.ContentPageBuilder.selectGallery ? $scope.ContentPageBuilder.selectGallery : "";
                switch(selectGallery){
                    case 'WidgetBgImage':
                        switch(data.MediaType){
                            case "Image" : 
                                //continue with data.Location[0].URL
                                break;
                            case "Link" : 
                                data.Location[0].URL = data.thumbnail;
                                break;
                        }
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type = "image";
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data = "../assets/Media/img/"+data.Location[0].URL;
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData = "../assets/Media/img/"+data.Location[0].URL;
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Thumbnail = "../assets/Media/img/"+data.thumbnail;
                        $scope.ContentPageBuilder.updateBackground();
                        //$scope.$apply();
                        angular.element(".search-gallery-modal").hide();
                        break;
                    case 'WidgetBgVideo':
                        //alert("Still pending case...use gridfs..");return;
                        console.log("data-------",data);
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Type = "video";
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Data = data.Content;
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.LqData = data.Content;
                        $scope.ContentPageBuilder.__config.SyncObject.CommonParams.Background.Thumbnail = "../assets/Media/img/"+data.thumbnail;
                        $scope.ContentPageBuilder.updateBackground();
                        angular.element(".search-gallery-modal").hide();
                        break;
                    case 'WidgetImage':
                        switch(data.MediaType){
                            case "Image" : 
                                //continue with data.Location[0].URL
                                break;
                            case "Link" : 
                                alert("data.thumbnaildata.thumbnail---"+data.thumbnail);
                                data.Location[0].URL = data.thumbnail;
                                break;
                        }
                        var inputObj = {};
                        inputObj.Type = 'image';
                        inputObj.Data = "../assets/Media/img/"+data.Location[0].URL;
                        inputObj.LqData = "../assets/Media/img/"+data.Location[0].URL;
                        inputObj.Thumbnail = "../assets/Media/img/"+data.Location[0].URL;

                        $scope.ContentPageBuilder.createWidget(inputObj);
                        angular.element(".search-gallery-modal").hide();
                        break;
                    case 'WidgetVideo':
                        console.log("data-------",data);
                                                    var inputObj = {};
                        inputObj.Type = 'video';
                        inputObj.Data = data.Content;
                        inputObj.LqData = data.Content;
                        inputObj.Thumbnail = "../assets/Media/img/"+data.thumbnail;

                        $scope.ContentPageBuilder.createWidget(inputObj);
                        angular.element(".search-gallery-modal").hide();
                        break;
                    default:
                        alert("Error-986868 : Something went wrong...");
                        $scope.ContentPageBuilder.pasteData = "";
                        return;
                }
            },
            openPage : function(navigationType){
                var currentPageId =  $scope.ContentPageBuilder.page_id;
                //var whichPage = "middle";
                
                console.log("$scope.ContentPageBuilder.allPages = ",$scope.ContentPageBuilder.allPages);
                //return;
                
                var idx = this.getObjArrayIdxByKey($scope.ContentPageBuilder.allPages,'_id',currentPageId);
                var firstIdx = 0;
                var lastIdx = $scope.ContentPageBuilder.allPages.length - 1;
                var pagetoNavigate = 0;
                var pagetoNavigateType = "";
                
                switch(idx){
                    case firstIdx :
                        $scope.ContentPageBuilder.whichPage = "first";
                        break;
                    case lastIdx :
                        $scope.ContentPageBuilder.whichPage = "last";
                        break;
                    default : 
                        $scope.ContentPageBuilder.whichPage = "middle";
                }
                
                switch(navigationType){
                    case "next" :
                        if($scope.ContentPageBuilder.whichPage != "last"){
                            pagetoNavigate = $scope.ContentPageBuilder.allPages[idx + 1]._id;
                            pagetoNavigateType = $scope.ContentPageBuilder.allPages[idx + 1].PageType;
                        }
                        else{
                            return false;
                        }
                        break;
                    case "previous" :
                        if($scope.ContentPageBuilder.whichPage != "first"){
                            pagetoNavigate = $scope.ContentPageBuilder.allPages[idx - 1]._id;
                            pagetoNavigateType = $scope.ContentPageBuilder.allPages[idx - 1].PageType;
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
            setGrid : function(flag){
                $scope.ContentPageBuilder.__config.SyncObject.CommonParams.IsGrid = flag;
                //Sync CommonParams now
                $scope.ContentPageBuilder.updateCommonParams();
            }
        };
        app.init();
        return app;
    })();
}]);