var collabmedia = angular.module('collabmedia');
collabmedia.config(function($httpProvider,$stateProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $urlRouterProvider) {
	//console.log = function(){};
	//enabling CORS
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.headers.common['Content-Type'] = 'text/plain';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

	var spinnerFunction = function (data, headersGetter) {
		// todo start the spinner here
		//alert('start spinner');
		$('body').addClass('wait');
		return data;
	};
	$httpProvider.defaults.transformRequest.push(spinnerFunction);
	
	
	//code for IE redirection after login issue added on 09012014 suggested by vinodb
	//will uncomment if found the case
	/*
	var init_IE = function(){
		$httpProvider.defaults.cache = false;
		if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
		}
		// disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
	}
	init_IE();
	*/
	
	 
	//  // check if admin is logged out
	//  var checkLoggedOut = function($q, $timeout, $http, $location, $rootScope,$window)
	//	{ 
	//		var deferred = $q.defer(); 
	//		$http.get('/user/chklogin').success(function(data, status, headers, config)
	//		{
	//			  
	//			if (data.code === '200') {
	//			$timeout(deferred.reject, 0);
	//			console.log('case3'); 
	//			$location.path('http://203.100.79.94:5555/#/projects');
	//			}
	//			else{
	//			  console.log('case4');
	//			  $rootScope.message = 'You need to log in.'; 
	//			  $timeout(function(){
	//				deferred.resolve();
	//			  },0); 
	//			}
	//		}); 
	//	  return deferred.promise;
	//	};
	user={}; 
	var submitForm2 = function($http,$timeout,$q,$location,$rootScope,$window){
		var deferred = $q.defer();
		//console.log('===================================================');
		//console.log(deferred);
		if(user.email && user.password){
			//console.log(user);
			var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
			var expires = new Date();
			expires.setTime(expires.getTime() + (7*24*60*60 * 1000));
			//return;
			$http.post('/user/login',user).then(function (data, status, headers, config) {
				if (data.data.code==200){
					if (user.rememberMe) {
						//console.log($);
						$.cookie('email', Base64.encode(user.email), { expires: expires , path: '/'});
						$.cookie('password', Base64.encode(user.password), { expires: expires , path: '/'});
					}else{
						//console.log('Deleting cookies');
						$.removeCookie('email', { path: '/' });
						$.removeCookie('password', { path: '/' });
					}
					$timeout(deferred.resolve, 0);
					
					//console.log('resolve');
					//$location.path('/projects')
				}
				else if(data.data.code==404)
				{
					//console.log(2);
					//$scope.msg='Incorrect email or password';
					console.log('case2');
					$rootScope.message = 'You need to log in.'; 
					$timeout(function(){
					  deferred.reject();
					},0); 
					//$location.path('/');
					window.location.href='/#/login';
					}
			})
		}
		return deferred.promise;
	}
  
  var checkLoggedin = function($q,  $timeout, $http, $location,$rootScope,$window)
	{
		console.log('checkLoggedin');
		//user={};
		var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
		var expires = new Date();
		expires.setTime(expires.getTime() + (7*24*60*60 * 1000));
		var deferred = $q.defer();
		
		$http.get('/user/chklogin').success(function(data, status, headers, config)
		{ 
			if (data.code === '200') {
				console.log('case1');
				$timeout(deferred.resolve, 0);
				return deferred.promise;
			}
			else 
			{
				if($.cookie('email') != undefined && $.cookie('password') != undefined){
					//user={};
					user.email=Base64.decode($.cookie('email'));
					user.password=Base64.decode($.cookie('password'));
					user.rememberMe=true;
					//console.log($scope.user);
					console.log('calling submitForm2');
					submitForm2($http,$timeout,$q,$location,$rootScope,$window);
					
					
				}else{
					//cookieLogin();
					//console.log('case2');
					$rootScope.message = 'You need to log in.'; 
					$timeout(function(){
					  deferred.reject();
					},0); 
					//$window.location.href='/admin/#/';
					window.location.href='/#/login';
					return deferred.promise;
				}
			}
		});
		 // return deferred.promise;
	};
	
	$httpProvider.responseInterceptors.push(function ($q, $location,$window) 
	{ 
		return function (promise) 
		{ 	
			return promise.then(
				function (response){
					//console.log('interceptor1');
					$('body').removeClass('wait');

					return response;
					console.log("promise return : ",response);
				},
				function (response){ 	
					$('body').removeClass('wait');
					
					//var deferred = $q.defer(); 
					if (response.status===401){
						console.log('interceptor2');
						window.location.href='/#/login';
					}
					console.log("reject return : ",response);
					return $q.resolve(response); 
				}
			); 
		} 
	}); 
	
	
	
	
	
	
	
	
	collabmedia.controllerProvider = $controllerProvider;
	collabmedia.compileProvider    = $compileProvider;
	collabmedia.stateProvider      = $stateProvider;
	collabmedia.filterProvider     = $filterProvider;
	collabmedia.provide            = $provide;
  
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  // Now set up the states
  $stateProvider	
    .state('discuss', {
		url: "/discuss/:id",
		templateUrl: "../views/front/boards/index.html",
		controller:"indexCtrl",
		resolve: {deps: function($q, $rootScope){
			console.log("in resolve block...board");
			var dependencies =  [
									'/controllers/front/boards/directives/boardDirectives.js',
									'/controllers/front/boards/filters/boardFilters.js',
									'/controllers/front/boards/indexCtrl.js',
									'/controllers/front/boards/commentCtrl.js',
									'/controllers/front/boards/boardCtrl.js',
									'/controllers/front/boards/designNsoundCtrl.js',
									'/controllers/front/boards/pageThemesCtrl.js',
									'/controllers/front/boards/memberCtrl.js',
									'/controllers/front/boards/recorderCtrl.js',
									'/controllers/front/boards/filterCtrl.js',
									'/controllers/front/boards/uploadMediaCtrl.js',
									'/controllers/front/boards/discussCtrl.js',
									'/controllers/front/boards/searchGalleryCtrl.js',
									'/controllers/front/boards/mediaTrayCtrl.js',
									'/controllers/front/boards/actCtrl.js',
									'/controllers/front/boards/montageCtrl.js',
									'/controllers/front/boards/dragDropCtrl.js',
									'/controllers/front/boards/pageSettingCtrl.js',
									'/controllers/front/boards/uploadLinkEngine.js',
									'/services/front/loginService.js',
									'/assets/board/assets/js/plugin.min.js',
									
									'/assets/board/assets/js/core.min.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		},check:checkLoggedin}
    })
    .state('search', {
		url: "/search/:id",
		templateUrl: "../views/front/boards/search.html",
		controller:"searchCtrl",
		resolve: {deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'/controllers/front/boards/searchCtrl.js',
									'/services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		},check:checkLoggedin}
    })
});

/* Load Only Required Modules */
function loadDependencies($q, $rootScope, dependencies) {
    console.log("In loadDependencies...");
	var deferred = $q.defer();
    $script(dependencies, function() {
        console.log("In loadDependencies : $script called....");
		// all dependencies have now been loaded by $script.js so resolve the promise
        $rootScope.$apply(function(){
            deferred.resolve();
        });
    });
	console.log("In loadDependencies before end line...");
	return deferred.promise;
}
