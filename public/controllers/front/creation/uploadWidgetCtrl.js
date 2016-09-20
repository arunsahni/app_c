var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('uploadWidgetCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
    $scope.count=0;
    $scope.media={};
    $scope.uploadedMedia = {};
    $scope.uploadedLink = {};

    $scope.__UploadIframeCase = function ( url , pageId ) {
        if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null  || url.match(/^(<div)(.*?)(><script)(.*?)<\/script>(.*?)(<\/div>)$/)) {
            if( (url.match(/youtube.com/gi) != null) ){
                //alert("youtube IFRAME case Found here---");//return false;
                var youtube_url = '';
                $scope.link.thumbnail = '';

                youtube_url = url;
                console.log("youtube_url = ",youtube_url);
                $scope.link.thumbnail = $scope.youtube_thumb(youtube_url);
                console.log("Got thumbnail from youtube IFRAME = ",$scope.link.thumbnail);
                saveLinkData();
            }
            else if( (url.match(/vimeo.com/gi) != null) ){ 
                //alert("vimeo IFRAME case Found here---");//return false;

                var vimeo_url = '';
                $scope.link.thumbnail = '';
                vimeo_url = url;
                console.log("vimeo_url = ",vimeo_url);
                $scope.vimeo_thumb(vimeo_url);
                console.log("Got thumbnail from youtube drag-drop = ",$scope.link.thumbnail);
            }
            else{
                //other cases...
                $scope.link.content = url;
                $scope.link.thumbnail = '';
                //$scope.link.thumbnail = url;
                saveLinkData()
            }

        }
        else{
            alert("Not Possible Case!");
            return false;
        }
    }


    $scope.__UploadMediaCase = function ( url , pageId ) {
        if( url.match(/.www.google./) != null ) {
            //alert("Google image link...");
            // Code for match
            var newData = url.split('&url=');
            var nextData = newData[1].split('&ei=');
            var imgUrl = decodeURIComponent(nextData[0]);
            $scope.link.content = '<img src="'+imgUrl+'" alt="image" />';
            $scope.link.type = "image";

            $scope.link.thumbnail = '';
            $scope.link.thumbnail = imgUrl;
            saveLinkData()

        }
        else if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null ){
            // Code for iframe check
            $scope.link.content = url;

            $scope.link.thumbnail = '';

            if( (url.match(/soundcloud.com/gi) != null) ){
                var soundcloud_url = '';
                // code for Vimeo
                var srcUrl = '';
                //get src of the soundcloud iframe
                //srcUrl = url.match(/^(<iframe.*? src=")(.*?)(\??)(.*?)(".*)$/mg);
                var res = url.split("src=");
                //console.log("split result = ",res);
                //alert(res);
                var res2 = res[1].split('"');
                //alert(res2[1]);
                srcUrl = res2[1]
                //console.log('matching object ',srcUrl);
                soundcloud_url = srcUrl;
                //alert("Vimeo video id: " + op);
                $scope.getWebLinkOembed('http://www.soundcloud.com/oembed',soundcloud_url);
            } 

            //$scope.link.thumbnail = url;
            saveLinkData()
        }
        else {
            $scope.link.content = '<img src="'+url+'" alt="image" />';
            $scope.link.type = "image";

            $scope.link.thumbnail = '';
            $scope.link.thumbnail = url;
            saveLinkData()
        }
    }

    $scope.__UploadOembedCase = function ( url ) {
        getOmbedProvider = oEmbeder.get__MatchedoEmbedProvider(url);
        if( !$.isEmptyObject( getOmbedProvider ) ){
            $scope.get__oEmbedObj( getOmbedProvider.ApiEndPoint , url , pageId )
        }
        else{
            alert("Did not find oEmbed specification for the given link!");
            return false;
        }
    }

    $scope.get__oEmbedObj = function(oEmbedApi , url , pageId){
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
                            data.data.html = $scope.get__oEmbedHtmlContent(data.data , url);

                            if(data.data.html){
                                    data.data.html = data.data.html.replace("<![CDATA[", ""); 
                                    data.data.html = data.data.html.replace("]]>", ""); 
                                    $scope.link.content = data.data.html;
                                    if( data.data.thumbnail_url ){
                                            $scope.link.thumbnail = data.data.thumbnail_url;
                                    }
                                    else if( data.data.image ){
                                            $scope.link.thumbnail = data.data.image;
                                    }
                                    else if( data.data.url ){
                                            $scope.link.thumbnail = data.data.url;
                                    }
                                    else{
                                            //$scope.link.thumbnail = data.data.thumbnail_url;
                                            //plan
                                            //alert("Error Code: get__oEmbedObj-001 => thumbnail_url,image & url keys are not present = "+$scope.link.thumbnail);
                                            alert("No Thumbnail Found!");
                                    }

                                    $scope.webLinkTitle = data.data.title;
                                    saveLinkData(pageId)
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
    }

    $scope.youtube_thumb = function (youtube_url , pageId){
        if(youtube_url){
            var youtube_video_id = youtube_url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
            //var thumbnail_url = 'http://img.youtube.com/vi/'+youtube_video_id+'/0.jpg';
            var thumbnail_url = 'http://img.youtube.com/vi/'+youtube_video_id+'/mqdefault.jpg';
            $scope.getWebLinkOembed('http://www.youtube.com/oembed','http://www.youtube.com/watch?v='+youtube_video_id);

            return thumbnail_url; 
        }
        return false;
    }

    $scope.vimeo_thumb = function (vimeo_url , pageId) {
        //var res = vimeo_url.split("/");
        //var vimeo_id = res[res.length-1];
        //vimeoLoadingThumb(vimeo_id);
        $http.get('http://vimeo.com/api/oembed.json?url='+vimeo_url).
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            var thumbnail_src = data.thumbnail_url;

            console.log("Vimeo thumbnail =---- ",thumbnail_src);
            //return thumbnail_src;
            $scope.link.thumbnail = thumbnail_src;
            if(data.title)
                $scope.webLinkTitle = data.title;

            if(data.html)
                $scope.link.content = data.html;

            saveLinkData()
            //$scope.$apply();
        }).
        error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert('Vimeo thumbnail case Error!');
                $scope.link.thumbnail = '';
                saveLinkData()
                //$scope.$apply();
        });
    }
    
    $scope.getWebLinkOembed = function(oEmbedApi , url , pageId){
        $scope.webLinkTitle = '';
        var returnTitle = '';
        if( oEmbedApi && url ){
            $http.get(oEmbedApi+'?url='+url+'&format=json').then(function (data, status, headers, config) {
                if (data){
                    console.log("if data = ",data);
                    if(data.title){
                        $scope.webLinkTitle = data.title;
                        $scope.link.thumbnail = data.thumbnail_url;
                    }
                    else{
                        console.log("data.data.title = ",data.title);
                    }
                }
                else{
                    console.log("else data = ",data);
                }				
            })
        }else{
            console.log("oEmbedApi && url = ",oEmbedApi+"---------"+url);
            $scope.webLinkTitle = returnTitle;
        }
    }

    $scope.get__oEmbedHtmlContent = function(result , url , pageId){
        var html_content = '';
        $scope.__getDesciptors(result);
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

                case 'RICH' :
                    html_content = result.html;
                    break;

                case 'LINK' : 
                    html_content = '<a href="'+url+'" alt='+result.title+' title='+result.title+'>'+result.title+'</a>';
                    if(result.thumbnail_url){
                            html_content += '<img src="'+result.thumbnail_url+'" alt="image" />';
                    }
                    break;
                default:
                    html_content = result.html;
                    break;

            }
        }
        return html_content;
    }
    
    function saveLinkData(){
        if ($scope.link.content!="") {
            var fields={};
            fields.content=$scope.link.content
            
            //added on 24122014 by manishp embedded link thumbnail case.
            var thumbnail = '';
            if($scope.link.thumbnail){
                thumbnail = $scope.link.thumbnail;
                if( $scope.link.type == 'image' ){
                    fields.linkType = $scope.link.type;
                }
            }
            fields.thumbnail=$scope.link.thumbnail;
            //End added on 24122014 by manishp embedded link thumbnail case.

            $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                if(data.data.code==200){
                    $scope.uploadedLink=data.data.response;
                }
            });
        }
        return false;
    }

}]);