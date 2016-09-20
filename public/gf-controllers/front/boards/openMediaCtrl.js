var collabmedia = angular.module('collabmedia');

collabmedia.config(function($httpProvider,$stateProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $urlRouterProvider) {
		$httpProvider.responseInterceptors.push(function ($q, $location,$window) 
		{ 
			return function (promise) 
			{ return promise.then(
					function (response)
						{
						  //console.log('interceptor1');
						 return response;
						},
			function (response) 
				{ 	//var deferred = $q.defer(); 
					if (response.status===401){
						console.log('interceptor2');
						window.location.href='/#/login';
					}
					return $q.resolve(response); 
				}); 
			} 
		}); 
	
	
	});

collabmedia.controller('openMediaCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,$timeout,$compile){    
    function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	console.log(getParameterByName('mid'));
	var mid = getParameterByName('mid');
	$http.post('/media/getMediaDetail',{id:mid}).then(function (data, status, headers, config) {
        if ( data.data.code == "200" ){
            $scope.media = data.data.response;
            if ( $scope.media.MediaType == 'Link' ) {
                console.log('content typee link');
                $('#content').html($scope.media.Content)
            }else if ( $scope.media.MediaType == 'Notes' ) {
                $('#content').html('<div class="note">'+$scope.media.Content+'</div>')
            }else if ( $scope.media.MediaType == 'Video' ) {
                var whichBrowser = BrowserDetecter.whichBrowser();
                var videoSrc = $scope.media.Location[0].URL;
                var ext = videoSrc.split('.').pop();
                if ( whichBrowser == "FireFox" ) {
                  if ( ext.toUpperCase() != 'WEBM' ) {
                    videoSrc = videoSrc.replace('.'+ext,'.webm');
                  }
                }
                else if ( whichBrowser == 'Safari') {
                  if ( ext.toUpperCase() != 'MP4' ) {
                    videoSrc = videoSrc.replace('.'+ext,'.mp4');	
                  }
                }
                else{
                  if ( ext.toUpperCase() != 'MP4' ) {
                    videoSrc = videoSrc.replace('.'+ext,'.mp4');	
                  }
                }
                console.log($scope.media.Location[0].URL);
                $('#content').html('<div class="video"><video class="media_video"  controls ><source src="../assets/Media/video/'+videoSrc+'" dynamic-url dynamic-url-src="../assets/Media/video/'+videoSrc+'"></video></div>')
            }
        }	
    })
	
});
