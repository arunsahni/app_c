var collabmedia = angular.module('collabmedia');
collabmedia.controllerProvider.register('loginCtrl',function($scope,$http,$location,$window){
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	var expires = new Date();
	expires.setTime(expires.getTime() + (7*24*60*60 * 1000));
	//var encodedString = Base64.encode(string);
	//var decodedString = Base64.decode(encodedString);
	if($window.localStorage['register']=='true'){
			$scope.msg1 = "You have been registered successfully.";
			
			$window.localStorage['register'] = false;
	}
	if($window.localStorage['changePassword']=='true'){
			$scope.msg1 = "Your password has been changed successfully.";
			
			$window.localStorage['changePassword'] = false;
	}
	if($window.localStorage['resetPassword']=='true'){
			$scope.msg1 = "An email has been sent to your email id. Please follow the link in the email to reset your password.";
			
			$window.localStorage['resetPassword'] = false;
	}
	
	
	
	$("li").keydown(function(){
         //alert(1);
		 $scope.msg='';
		 $scope.msg1='';
         $('.msg').css("display", "block");
         
       });
	
	$(".close_icon").click(function(){
         //alert(1);
         $(this).parent().fadeOut();
         $scope.msg2="";
         });
		
	$http.get('/user/chklogin')
	.success(function (data, status, headers, config) {				
		if (data.code=="200"){
			$window.location.href = '/capsule/#/manage-capsules';
		}
	});
			
	
	$scope.user={};
	$scope.submitForm = function(){		
		if($scope.user.email && $scope.user.password){
			console.log($scope.user);
			
			//return;
			$http.post('/user/login',$scope.user).then(function (data, status, headers, config) {
				if (data.data.code==200){
					if ($scope.user.rememberMe) {
						console.log($);
						$.cookie('email', Base64.encode($scope.user.email), { expires: expires , path: '/'});
						$.cookie('password', Base64.encode($scope.user.password), { expires: expires , path: '/'});
					}else{
						console.log('Deleting cookies');
						$.removeCookie('email', { path: '/' });
						$.removeCookie('password', { path: '/' });
					}
					$window.location.href = '/capsule/#/manage-capsules';
				}
				else if(data.data.code==404)
				{
					console.log(2);
					$scope.msg='Incorrect email or password';	
				}
			})
		}
	}
	//$scope.cookieLogin=function(){
	//	if($.cookie('email') != undefined && $.cookie('password') != undefined){
	//		$scope.user={};
	//		$scope.user.email=Base64.decode($.cookie('email'));
	//		$scope.user.password=Base64.decode($.cookie('password'));
	//		$scope.user.rememberMe=true;
	//		//console.log($scope.user);
	//		$scope.submitForm();
	//		
	//	}
	//}
	//$scope.cookieLogin();
	$scope.redirectToRegister=function(){
		$location.path('/register');
	}
	
	$(document).ready(function(){
		$("body").removeClass("cbp-spmenu-push-toright");
	});
});

collabmedia.controllerProvider.register('loginsCtrl',function($scope,$http,$location,$window,$stateParams){
	
	$http.get('/user/chklogin').success(function (data, status, headers, config) {
		if (data.code=="200"){
			$window.location.href = '/capsule/#/manage-capsules';
		}
	});	
	
	$scope.user={};
	$scope.submitForm = function(){
		if($scope.user.email && $scope.user.password){
			$scope.user.board=$stateParams.id;
			$http.post('/user/login',$scope.user).then(function (data, status, headers, config) {
				if (data.data.code==200 && typeof(data.data.url)!='undefined'){
					$window.location='/board/#/discuss/'+$stateParams.id;
				}
				else if(data.data.code==200){
					$window.location.href = '/capsule/#/manage-capsules';
				}
				else if(data.data.code==404)
				{
					console.log(2);
					$scope.msg='Incorrect email or password';	
				}
			})
		}
	}
	$scope.redirectToRegister=function(){
		$location.path('/register');
	}
	
	
});