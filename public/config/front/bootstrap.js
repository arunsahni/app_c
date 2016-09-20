var collabmedia = angular.module('collabmedia', ['ui.router','ui','angularFileUpload','ngSanitize','ngAnimate','angular-loading-bar','angularUtils.directives.dirPagination','ngTouch','angularAwesomeSlider']);

collabmedia.controller('frontMainCtrl',function($scope,$window,$http,$stateParams,$location,$rootScope , $compile){
	
	//added on 16022015 - thumbnail urls 
	//defining thumbnails routes
	$scope.init__urlLocations = function(){
		
		$scope.small__thumbnail = '100';
		$scope.medium__thumbnail = '300';
		$scope.discuss__thumbnail = '600';
		$scope.large__thumbnail = '1200';
		
	}
	$scope.init__urlLocations();
	
	//added on 16022015
	
	//$http.post('/boards',{id:$stateParams.id}).then(function (data, status, headers, config) {
	//		if (data.data.code==200){
	//			console.log(data.data.response);
	//		    $scope.boarddata2=data.data.response;
	//		}
	//});
	setTimeout(function(){
		//alert($rootScope.boarddata2);
			 
			//    $scope.boarddata3=$rootScope.boarddata2;
			//	  console.log($scope.boarddata3);
				},3000)
	
	var flashMsg = '';
	$scope.showFlash = function(flashMsg,msgClass){
		$(document).ready(function(){
			if(msgClass=='error' || msgClass=='failure'){
				flashMsg = "<span style="+"color:red"+">"+flashMsg+"</span>";
			}
			
			$('.flash_msg_element').addClass('flash_msg_hide_show');
			$('.flash_msg_element').html(flashMsg);
			setTimeout(function(){
				$('.flash_msg_element').removeClass('flash_msg_hide_show');
				$scope.clearFlash();
			},3000)
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
	};
});
