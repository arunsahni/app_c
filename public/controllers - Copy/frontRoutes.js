var collabmedia = angular.module('collabmedia');
collabmedia.directive('autoFocus', function() {
  return {
    link: {
      pre: function(scope, element, attr) {
        console.log('prelink executed for');
      },
      post: function(scope, element, attr) {
        console.log('postlink executed');
        element[0].focus();
      }
    }
  }
});
collabmedia.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

collabmedia.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {
                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);
				//alert(attrs.ngModel);
                //get the value of the other password 
                var e2 = scope.$eval(attrs.passwordMatch);
				//alert(attrs.passwordMatch)
               // alert(e1 == e2);
				return e1 == e2;
            };
            scope.$watch(checker, function (n) {
				//alert('watch');
                //set the form control to valid if both
                //passwords are the same, else invalid
                control.$setValidity("unique", n);
            });
        }
    };
}]);

collabmedia.config(function($httpProvider,$stateProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $urlRouterProvider) {
	$httpProvider.defaults.headers.common['my-custom-header'] = 'testing';
	
	//code for IE redirection after login issue added on 09012014 suggested by vinodb
	var init_IE = function(){
		$httpProvider.defaults.cache = false;
		if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
		}
		// disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
	}
	init_IE();
	//code for IE redirection after login issue added on 09012014 suggested by vinodb
	
	collabmedia.controllerProvider = $controllerProvider;
	collabmedia.compileProvider    = $compileProvider;
	collabmedia.stateProvider      = $stateProvider;
	collabmedia.filterProvider     = $filterProvider;
	collabmedia.provide            = $provide;
  

	user={};
	
	var submitForm1 = function($http,$timeout,$q,$location,$rootScope,$window){
		var deferred = $q.defer(); 
		if(user.email && user.password){
			var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
			var expires = new Date();
			expires.setTime(expires.getTime() + (7*24*60*60 * 1000));
			$http.post('/user/login',user).then(function (data, status, headers, config) {
				if (data.data.code==200){
					if (user.rememberMe) {
						$.cookie('email', Base64.encode(user.email), { expires: expires , path: '/'});
						$.cookie('password', Base64.encode(user.password), { expires: expires , path: '/'});
					}else{
						console.log('Deleting cookies');
						$.removeCookie('email', { path: '/' });
						$.removeCookie('password', { path: '/' });
					}
					$timeout(deferred.reject, 0);
					console.log('case3');
					//$location.path('/projects');
					$window.location.href = '/capsule/#/manage-chapters';
					return deferred.promise;
				}
				else if(data.data.code==404)
				{
					deferred.resolve();
					return deferred.promise;
				}
			})
		}
	}
  
	var submitForm2 = function($http,$timeout,$q,$location,$rootScope,$window){
		var deferred = $q.defer();
		console.log('===================================================');
		console.log(deferred);
		if(user.email && user.password){
			console.log(user);
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
						console.log('Deleting cookies');
						$.removeCookie('email', { path: '/' });
						$.removeCookie('password', { path: '/' });
					}
					$timeout(function(){
						deferred.resolve()
					}, 0);
				}
				else if(data.data.code==404)
				{
					console.log('case2');
					$rootScope.message = 'You need to log in.'; 
					$timeout(function(){
						deferred.reject();
					},0); 
					$location.path('/');
				}
			})
		}
		return deferred.promise;
	}
  
  var checkLoggedin = function($q,  $timeout, $http, $location,$rootScope,$window)
	{
		var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
		var expires = new Date();
		expires.setTime(expires.getTime() + (7*24*60*60 * 1000));
		var deferred = $q.defer();
		
		$http.get('/user/chklogin').success(function(data, status, headers, config){ 
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
					console.log('case2');
					$rootScope.message = 'You need to log in.'; 
					$timeout(function(){
					  deferred.reject();
					},0); 
					//$window.location.href='/admin/#/';
					$location.path('/');
					return deferred.promise;
				}
			}
		});
		 // return deferred.promise;
	};

  // check if admin is logged out
	var checkLoggedOut = function($q, $timeout, $http, $location, $rootScope,$window)
	{
		var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
		var expires = new Date();
		expires.setTime(expires.getTime() + (7*24*60*60 * 1000));
		var deferred = $q.defer(); 
		$http.get('/user/chklogin').success(function(data, status, headers, config){
			if (data.code === '200') {
				$timeout(deferred.reject, 0);
				console.log('case3'); 
				//$location.path('/projects');
				$window.location.href = '/capsule/#/manage-chapters';
				return deferred.promise;
			}
			else{
				if($.cookie('email') != undefined && $.cookie('password') != undefined){
					user.email=Base64.decode($.cookie('email'));
					user.password=Base64.decode($.cookie('password'));
					user.rememberMe=true;
					console.log('calling submitForm1');
					submitForm1($http,$timeout,$q,$location,$rootScope,$window);
					
				}else{
					console.log('case4');
					$rootScope.message = 'You need to log in.'; 
					$timeout(function(){
					  deferred.resolve();
					},0);
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
				return response;
			},
			function (response){
				if (response.status===401){
					console.log('interceptor2');
					$location.path('/');
					//$window.location.href = '/capsule';
				}
				return $q.resolve(response); 
			}
		); 
	} 
}); 
  
  
  
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  // Now set up the states
  $stateProvider	
    .state('dashboard', {
      url: "/",
      templateUrl: "../views/front/index.html",
	  controller:"frontCtrl",
	  resolve: {check:checkLoggedOut,deps: function($q, $rootScope){
			console.log(">>>>>in resolve block...");
			var dependencies =  [
									'controllers/front/frontCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
	.state('forgotPassword', {
      url: "/forgotPassword",
      templateUrl: "../views/front/forgotPassword.html",
	  controller:"forgotPasswordCtrl",
	  resolve: {check:checkLoggedOut,deps: function($q, $rootScope){
			console.log(">>>>>in resolve block...");
			var dependencies =  [
									'controllers/front/forgotPasswordCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
	.state('dashboardlogin', {
      url: "/dashboard",
      templateUrl: "../views/front/dashboard.html",
	  controller:"dashboardCtrl",
	  resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			console.log(">>>>>in resolve block...");
			var dependencies =  [
									'controllers/front/dashboardCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('logout', {
		url: "/logout",
		templateUrl: "../views/front/login.html",
		controller:"logoutCtrl",
		resolve: {deps: function($q, $rootScope){
			console.log("----in resolve block...");
			var dependencies =  [
									'controllers/front/logoutCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('projects', {
		url: "/projects",
		templateUrl: "../views/front/projects.html",
		controller:"projectsCtrl",
		resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/projectsCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('projects.add', {
		url: "/add",
		templateUrl: "../views/front/addProject.html",
		controller:"projectsCtrl",
		resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/projectsCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('projects.edit', {
		url: "/edit/:id",
		templateUrl: "../views/front/addProject.html",
		controller:"projectsCtrl",
		resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/projectsCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('login', {
		url: "/login",
		templateUrl: "../views/front/login.html",
		controller:"loginCtrl",
		resolve: {check:checkLoggedOut,deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/loginCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('logins', {
		url: "/login/:id",
		templateUrl: "../views/front/login.html",
		controller:"loginsCtrl",
		resolve: {check:checkLoggedOut,deps: function($q, $rootScope){
			//checkLoggedOut();
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/loginCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('register', {
		url: "/register",
		templateUrl: "../views/front/register.html",
		controller:"registerCtrl",
		resolve: {check:checkLoggedOut,deps: function($q, $rootScope){
			//checkLoggedOut();
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/registerCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('registers', {
		url: "/register/:email/:id",
		templateUrl: "../views/front/register.html",
		controller:"registersCtrl",
		resolve: {check:checkLoggedOut,deps: function($q, $rootScope){
			//checkLoggedOut();
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/registerCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
	//added by parul 23012015
	.state('changePassword', {
		url: "/changePassword/:id",
		templateUrl: "../views/front/changePassword.html",
		controller:"changePasswordCtrl",
		resolve: {check:checkLoggedOut,deps: function($q, $rootScope){
			//checkLoggedOut();
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/changePasswordCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('myprofile', {
		url: "/myprofile",
		templateUrl: "../views/front/myprofile.html",
		controller:"myprofileCtrl",
		resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			//checkLoggedin();
			console.log("<<<<in resolve block...");
			var dependencies =  [
									'controllers/front/myprofileCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('boards', {
		url: "/boards/:id",
		templateUrl: "../views/front/boards.html",
		controller:"boardsCtrl",
		resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/boardsCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('editBoards', {
		url: "/boards/edit/:projid/:id",
		templateUrl: "../views/front/addBoards.html",
		controller:"editboardsCtrl",
		resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/boardsCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('addBoards', {
		url: "/boards/add/:projid",
		templateUrl: "../views/front/addBoards.html",
		controller:"addboardsCtrl",
		resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/boardsCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
    })
    .state('board', {
		url: "/board",
		templateUrl: "../views/front/board.html",
		controller:"boardCtrl",
		resolve: {check:checkLoggedin,deps: function($q, $rootScope){
			console.log("in resolve block...");
			var dependencies =  [
									'controllers/front/boardCtrl.js',
									'services/front/loginService.js'
								];
			return loadDependencies($q, $rootScope, dependencies);
		}}
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