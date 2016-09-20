var collabmedia = angular.module('collabmedia');
collabmedia.config(function($httpProvider,$stateProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $urlRouterProvider) {
	//enabling CORS
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.headers.common['Content-Type'] = 'text/plain';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

	var spinnerFunction = function (data, headersGetter) {
		// todo start the spinner here
		$('body').addClass('wait');
		return data;
	};
	$httpProvider.defaults.transformRequest.push(spinnerFunction);
	
	
	user={}; 
	var submitForm2 = function($http,$timeout,$q,$location,$rootScope,$window){
		var deferred = $q.defer();
		if(user.email && user.password){
			var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
			var expires = new Date();
			expires.setTime(expires.getTime() + (7*24*60*60 * 1000));
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
				}
				else if(data.data.code==404)
				{
					console.log('case2');
					$rootScope.message = 'You need to log in.'; 
					$timeout(function(){
					  deferred.reject();
					},0); 
					window.location.href='/#/login';
				}
			})
		}
		return deferred.promise;
	}
  
  var checkLoggedin = function($q,  $timeout, $http, $location,$rootScope,$window)
	{
		console.log('checkLoggedin');
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
					user.email=Base64.decode($.cookie('email'));
					user.password=Base64.decode($.cookie('password'));
					user.rememberMe=true;
					console.log('calling submitForm2');
					submitForm2($http,$timeout,$q,$location,$rootScope,$window);
				}else{
					$rootScope.message = 'You need to log in.'; 
					$timeout(function(){
					  deferred.reject();
					},0); 
					window.location.href='/#/login';
					return deferred.promise;
				}
			}
		});
	};
	
	$httpProvider.responseInterceptors.push(function ($q, $location,$window) 
	{ 
		return function (promise) 
		{ 	
			return promise.then(
				function (response){
					$('body').removeClass('wait');
					return response;
					console.log("promise return : ",response);
				},
				function (response){ 	
					$('body').removeClass('wait');
					if (response.status===401){
						console.log('interceptor2');
						
						$('.flash_msg_element').addClass('flash_msg_hide_show');
						$('.flash_msg_element').html("<span style='color:red;'>Unauthorized Access!</span>");
						setTimeout(function(){
							$('.flash_msg_element').removeClass('flash_msg_hide_show');
						},5000)
						
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
  //$urlRouterProvider.otherwise("/manage-chapters");
  $urlRouterProvider.otherwise("/manage-capsules");
  // Now set up the states
  $stateProvider	
    .state('discuss', {
		url: "/discuss/:id",
		views:{
			"":{
				templateUrl: "../views/front/pages/index.html",
				controller:"indexCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/pages/directives/capsuleDirectives.js',
											'/controllers/front/pages/indexCtrl.js',
											'/controllers/front/pages/searchGalleryCtrl.js',
											'/controllers/front/pages/discussCtrl.js',
											'/controllers/front/pages/mediaTrayCtrl.js',
											'/controllers/front/pages/searchViewCtrl.js',
											'/controllers/front/pages/montageCtrl.js',
											'/controllers/front/pages/dragDropCtrl.js',
											'/controllers/front/pages/uploadMediaCtrl.js',
											'/controllers/front/pages/uploadLinkEngine.js',
											'/controllers/front/pages/recorderCtrl.js',
											'/controllers/front/pages/boardCtrl.js',
											'/controllers/front/pages/filterCtrl.js',
											'/controllers/front/pages/filters/capsuleFilters.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/sgSideMenu.html",
			}
			
		}
    })
    .state('pageView', {
		url: "/page-view/:chapter_id/:page_id",
		views:{
			"":{
				templateUrl: "../views/front/pages/index.html",
				controller:"indexCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/pages/directives/capsuleDirectives.js',
											'/controllers/front/pages/indexCtrl.js',
											'/controllers/front/pages/searchGalleryCtrl.js',
											'/controllers/front/pages/discussCtrl.js',
											'/controllers/front/pages/mediaTrayCtrl.js',
											'/controllers/front/pages/searchViewCtrl.js',
											'/controllers/front/pages/montageCtrl.js',
											'/controllers/front/pages/dragDropCtrl.js',
											'/controllers/front/pages/uploadMediaCtrl.js',
											'/controllers/front/pages/uploadLinkEngine.js',
											'/controllers/front/pages/recorderCtrl.js',
											'/controllers/front/pages/boardCtrl.js',
											'/controllers/front/pages/filterCtrl.js',
											'/controllers/front/pages/filters/capsuleFilters.js',
											'/services/front/loginService.js',
											'/controllers/front/creation/services/previewService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			
		}
    })
    .state('chapterView', {
		url: "/chapter-view/:chapter_id/:page_id",
		views:{
			"":{
				templateUrl: "../views/front/pages/index.html",
				controller:"indexCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/pages/directives/capsuleDirectives.js',
											'/controllers/front/pages/indexCtrl.js',
											'/controllers/front/pages/searchGalleryCtrl.js',
											'/controllers/front/pages/discussCtrl.js',
											'/controllers/front/pages/mediaTrayCtrl.js',
											'/controllers/front/pages/searchViewCtrl.js',
											'/controllers/front/pages/montageCtrl.js',
											'/controllers/front/pages/dragDropCtrl.js',
											'/controllers/front/pages/uploadMediaCtrl.js',
											'/controllers/front/pages/uploadLinkEngine.js',
											'/controllers/front/pages/recorderCtrl.js',
											'/controllers/front/pages/boardCtrl.js',
											'/controllers/front/pages/filterCtrl.js',
											'/controllers/front/pages/filters/capsuleFilters.js',
											'/services/front/loginService.js',
											'/controllers/front/creation/services/previewService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			
		}
    })
    .state('chapterView2', {
		url: "/view/:chapter_id/:page_id",
		views:{
			"":{
				templateUrl: "../views/front/pages/index.html",
				controller:"indexCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/pages/directives/capsuleDirectives.js',
											'/controllers/front/pages/indexCtrl.js',
											'/controllers/front/pages/searchGalleryCtrl.js',
											'/controllers/front/pages/discussCtrl.js',
											'/controllers/front/pages/mediaTrayCtrl.js',
											'/controllers/front/pages/searchViewCtrl.js',
											'/controllers/front/pages/montageCtrl.js',
											'/controllers/front/pages/dragDropCtrl.js',
											'/controllers/front/pages/uploadMediaCtrl.js',
											'/controllers/front/pages/uploadLinkEngine.js',
											'/controllers/front/pages/recorderCtrl.js',
											'/controllers/front/pages/boardCtrl.js',
											'/controllers/front/pages/filterCtrl.js',
											'/controllers/front/pages/filters/capsuleFilters.js',
											'/services/front/loginService.js',
											'/controllers/front/creation/services/previewService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			
		}
    })
	.state('pagePreview', {
		url: "/page-preview/:chapter_id/:page_id",
		views:{
			"":{
				//templateUrl: "../views/front/preview/index.html",
				templateUrl: "../views/front/preview/preview.html",
				controller:"PreviewIndexCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/preview/directives/previewDirectives.js',
											'/controllers/front/creation/services/previewService.js',
											'/controllers/front/creation/preview/previewIndexCtrl.js',
											'/controllers/front/pages/filters/capsuleFilters.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			
		}
    })
	.state('dashboard111', {
		url: "/dashboard111",
		views:{
			"":{
				templateUrl: "../views/front/creation/dashboard.html",
				controller:"DashboardMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/dashboardMgmtCtrl.js',
											'/controllers/front/creation/services/pagesService.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			
		}
    })
	.state('dashboard', {
		url: "/dashboard",
		views:{
			"":{
				templateUrl: "../views/front/creation/db-capsules.html",
				//template: "<h1 style='color:black; align:center'>Create Capsule<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"DbCapsulesCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/dashboard/dbCapsulesCtrl.js',
											'/controllers/front/creation/dashboard/services/dbCapsulesService.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/services/pagesService.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
		}
    })
	.state('dashboardChapters', {
		url: "/dashboard-chapters/:id",
		views:{
			"":{
				templateUrl: "../views/front/creation/db-chapters.html",
				//template: "<h1 style='color:black; align:center'>Create Chapter<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"DbChaptersCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/dashboard/services/dbChaptersService.js',
											'/controllers/front/creation/dashboard/dbChaptersCtrl.js',
											'/controllers/front/creation/services/pagesService.js',
											'/controllers/front/creation/services/lsService.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
			
		}
    })
	.state('chapterPreview', {
		url: "/chapter-preview/:chapter_id/:page_id",
		views:{
			"":{
				templateUrl: "../views/front/preview/index.html",
				controller:"PreviewIndexCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/preview/directives/previewDirectives.js',
											'/controllers/front/creation/services/previewService.js',
											'/controllers/front/creation/preview/previewIndexCtrl.js',
											'/controllers/front/pages/filters/capsuleFilters.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			
		}
    })
	.state('manageCapsules', {
		url: "/manage-capsules",
		views:{
			"":{
				templateUrl: "../views/front/creation/manage-capsules.html",
				//template: "<h1 style='color:black; align:center'>Create Capsule<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"CapsulesMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/capsulesMgmtCtrl.js',
											'/controllers/front/creation/services/capsulesService.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/services/pagesService.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })/*
	.state('manageChapters', {
		url: "/manage-chapters",
		views:{
			"":{
				templateUrl: "../views/front/creation/manage-chapters.html",
				//template: "<h1 style='color:black; align:center'>Create Chapter<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"ChaptersMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/chaptersMgmtCtrl.js',
											'/controllers/front/creation/services/pagesService.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })*/
	.state('manageChapters_ID', {
		url: "/manage-chapters/:id",
		views:{
			"":{
				templateUrl: "../views/front/creation/manage-chapters.html",
				//template: "<h1 style='color:black; align:center'>Create Chapter<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"ChaptersMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/chaptersMgmtCtrl.js',
											'/controllers/front/creation/services/pagesService.js',
											'/controllers/front/creation/services/lsService.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })
	.state('managePages', {
		url: "/manage-pages/:id",
		views:{
			"":{
				templateUrl: "../views/front/creation/manage-pages.html",
				//template: "<h1 style='color:black ; align:center'>Create Page<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"PagesMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/services/pagesService.js',
											'/controllers/front/creation/pagesMgmtCtrl.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })
	.state('managePages2', {
		url: "/manage-pages/:capsule_id/:id",
		views:{
			"":{
				templateUrl: "../views/front/creation/manage-pages.html",
				//template: "<h1 style='color:black ; align:center'>Create Page<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"PagesMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/services/pagesService.js',
											'/controllers/front/creation/services/sgPageService.js',
											'/controllers/front/creation/pagesMgmtCtrl.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })/*
	.state('manageCapsules', {
		url: "/manage-capsules",
		views:{
			"":{
				//templateUrl: "../views/front/creation/capsule-c.html",
				template: "<h1 style='color:black ; align:center'>Create Capsule<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"capsuleMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/capsuleMgmtCtrl.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })*/
	.state('manageSG', {
		url: "/manage-sg/:chapter_id/:page_id",
		views:{
			"":{
				templateUrl: "../views/front/creation/manage-sg.html",
				//template: "<h1 style='color:black ; align:center'>Create Search Gallery<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"SgPageMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/services/sgPageService.js',
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/sgPageMgmtCtrl.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })
	.state('manageSG2', {
		url: "/manage-sg/:capsule_id/:chapter_id/:page_id",
		views:{
			"":{
				templateUrl: "../views/front/creation/manage-sg.html",
				//template: "<h1 style='color:black ; align:center'>Create Search Gallery<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"SgPageMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/services/sgPageService.js',
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/sgPageMgmtCtrl.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })
	.state('manageGroups', {
		url: "/manage-groups",
		views:{
			"":{
				templateUrl: "../views/front/creation/groups-c.html",
				//template: "<h1 style='color:black ; align:center'>Setting<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"manageGroupsCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/manageGroupsCtrl.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })
	.state('capsuleLS', {
		url: "/ls/capsules/:capsule_id",
		views:{
			"":{
				templateUrl: "../views/front/creation/launchSettingsCapsules.html",
				controller:"lsCapsuleMgmtCtrl",
				resolve: {
					deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/lsCapsuleMgmtCtrl.js',
											'/controllers/front/creation/services/lsService.js',
											'/controllers/front/creation/services/capsulesService.js',
											'/controllers/front/creation/services/launchSettingsService.js',
											'/controllers/front/creation/services/chaptersService.js',	//added
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
		}
    })
	.state('manageFriends', {
		url: "/manage-friends",
		views:{
			"":{
				templateUrl: "../views/front/creation/friends-c.html",
				controller:"manageFriendsCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/manageFriendsCtrl.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
		}
    })
	
	.state('manageLS', {
		url: "/launch-settings/:chapter_id",
		views:{
			"":{
				templateUrl: "../views/front/creation/launchSettings.html",
				controller:"launchSettingsMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/launchSettingsMgmtCtrl.js',
											'/controllers/front/creation/services/launchSettingsService.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
		}
    })
	
	.state('manageLS2', {				//testing not in use
		url: "/ls/:capsule_id/:chapter_id",
		views:{
			"":{
				templateUrl: "../views/front/creation/ls.html",
				controller:"lsMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/lsMgmtCtrl.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/services/lsService.js',
											'/controllers/front/creation/services/launchSettingsService.js',
											'/controllers/front/creation/services/capsulesService.js',	//added
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
		}
    })
	//$locationProvider.html5Mode(true);
	.state('manageLS3', {				//testing not in use
		url: "/ls/:capsule_id",
		views:{
			"":{
				templateUrl: "../views/front/creation/ls.html",
				controller:"lsMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/lsMgmtCtrl.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/services/lsService.js',
											'/controllers/front/creation/services/launchSettingsService.js',
											'/controllers/front/creation/services/capsulesService.js',	//added
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
		}
    })
	.state('manageLS4', {				//testing not in use
		url: "/launch/:capsule_id",
		views:{
			"":{
				templateUrl: "../views/front/creation/ls-own.html",
				controller:"lsOwnMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/lsOwnMgmtCtrl.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/services/lsService.js',
											'/controllers/front/creation/services/launchSettingsService.js',
											'/controllers/front/creation/services/capsulesService.js',	//added
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
		}
    })
	.state('capsuleGallery', {
		url: "/capsule-gallery",
		views:{
			"":{
				templateUrl: "../views/front/creation/capsule-gallery.html",
				//template: "<h1 style='color:black; align:center'>Create Capsule<br>OPPS!!! We are working on it.. to go to a board <a href='#/discuss/55a3a6ecdf65c2555862dc10'>click here</a></h1>",
				controller:"CapsulesMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/directives/createDirectives.js',
											'/controllers/front/creation/capsulesMgmtCtrl.js',
											'/controllers/front/creation/services/capsulesService.js',
											'/controllers/front/creation/services/chaptersService.js',
											'/controllers/front/creation/services/pagesService.js',
											'/services/front/loginService.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })
	//Milestone:8 - Content Page Builder
	.state('manageCP', {
		url: "/manage-cp",
		views:{
			"":{
				templateUrl: "../views/front/creation/manage-cp.html",
				//template: "<h1 style='color:black ; align:center'>Content Page Builder</h1>",
				//controller:"sgCreateCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/services/front/loginService.js',
											'../vendors/cPageBuilder/ng-content-page-builder.js'
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			},
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
    })
	.state('manageCP2', {
		url: "/manage-cp/:capsule_id/:chapter_id/:page_id",
		views:{
			//params : {capsule_id:null,chapter_id:null,page_id:null},
			"":{
				//params : {capsule_id:null,chapter_id:null,page_id:null},
				templateUrl: "../views/front/creation/manage-cp.html",
				//templateUrl: "../assets/cpage/manage-cp.html",
				//template: "<h1 style='color:black ; align:center'>Content Page Builder</h1>",
				controller:"CpPageMgmtCtrl",
				resolve: {deps: function($q, $rootScope){
					var dependencies =  [
											'/controllers/front/creation/services/cpPageService.js',
											'/controllers/front/creation/directives/createDirectives.js',
											'/services/front/loginService.js',
											'/controllers/front/creation/cpPageMgmtCtrl.js'
											//'../vendors/cPageBuilder/ng-content-page-builder.js',
										];
					return loadDependencies($q, $rootScope, dependencies);
				},check:checkLoggedin}
			},
			sideMenu:{
				templateUrl: "../views/layouts/frontend/frontElements/outerPagesSideMenu.html",
				controller:"sideMenuCtrl",
				resolve: {deps: function($q, $rootScope){
						var dependencies =  [
											'/controllers/front/creation/sideMenuCtrl.js',
										];
						return loadDependencies($q, $rootScope, dependencies);
					}
				}
			}
			//settings:{
			//	templateUrl: "../views/layouts/frontend/frontElements/settings.html",
			//}
		}
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