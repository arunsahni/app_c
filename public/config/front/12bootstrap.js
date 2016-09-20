var collabmedia = angular.module('collabmedia', ['ui.router','ngTable','angularFileUpload','angular-redactor','flash']);

collabmedia.controller('frontMainCtrl',function($scope , $window){
	
	var flashMsg = '';
	$scope.showFlash = function(flashMsg,msgClass){
		$(document).ready(function(){
			$('.flash_msg_element').addClass('flash_msg_hide_show');
			$('.flash_msg_element').html(flashMsg);
			setTimeout(function(){
				$('.flash_msg_element').removeClass('flash_msg_hide_show');
				$scope.clearFlash();
			},5000)
		});
	}
	
	$scope.setFlash = function(flashMsg , flashMsgClass){
		$window.localStorage['flash_msg'] = flashMsg; 
		$window.localStorage['flash_msg_class'] = flashMsgClass; 
	}
	
	$scope.clearFlash = function(){
		$window.localStorage['flash_msg'] = ''; 
		$window.localStorage['flash_msg_class'] = ''; 
	}
	
	//set flash message after 2 seconds wait - (query loader's min-time is 1 second)
	if(($window.localStorage['flash_msg'] != '') && ($window.localStorage['flash_msg_class'] != '') ){
		setTimeout(function(){
			var flashMsg = $window.localStorage['flash_msg'];
			var flashMsgClass = $window.localStorage['flash_msg_class'];
			$scope.showFlash(flashMsg , flashMsgClass);
			console.log("--------flash msg---------",flashMsg);
			//alert("--------flash msg---------");
		},1000);
	}
	
	$scope.setFlashInstant = function(flashMsg , flashMsgClass){
		$scope.showFlash(flashMsg , flashMsgClass);
	}
});
