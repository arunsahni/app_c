var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('mediaTrayCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	/*
		Action : Media Tray - It will set mediaId for ticked action on click of media on 
		media-tray 
	
	*/
	$scope.setMediaIdd = function(medid){
        //holder_img
		//$scope.mediasData
		//alert('here');
		console.log('---------------------------Here in set MediaIdd-------------------------------------------------')
		for(i=0;i<$scope.medias.length;i++){
			if ($scope.medias[i]._id==medid) {
				$scope.mediasData=$scope.medias[i];
				//added on 26122014 by manishp setting pageFlag
				$scope.setPageFlag('ST',$scope.mediasData.value.MediaType);
				//console.log('-=-=-=--===================================----------------------============');
				//console.log($scope.mediasData)
			}
		}
	
    }
	
	$scope.exMediaTrayFlag = false;
	$scope.norMediaTrayFlag = true;
	$scope.setExpendedMediaTray = function(){
		//if( $scope.onSearchPage ){
			$scope.exMediaTrayFlag = true;
			$scope.norMediaTrayFlag = true;
			
			var body = $("html, body");
			var bodyClass = $('body');
			var currentPageClass = bodyClass.data('page-class');
			body.animate({scrollTop:0}, '500');
			/*
			//scrollTopVal = parseInt($("#"+idTofocusOn).offset().top) - parseInt($(body).css('paddingTop')) - 20 ;
			//scrollTopVal = parseInt($(body).css('paddingTop')) + 128 ;
			scrollTopVal = parseInt($(body).css('paddingTop')) + 128;
			//alert("scrollTop = "+scrollTopVal);
			$('html , body , .main-container').animate({
				//scrollTop: $( $(this).attr('href') ).offset().top
				scrollTop: -500
			}, 500);
			*/
			bodyClass.addClass('small-fixed-header act-page');
			bodyClass.removeClass(currentPageClass);
		//}
		var top = body.scrollTop() // Get position of the body
		alert("body.scrollTop() val = "+top);
	}
	
	$scope.setNormalMediaTray = function(){
		alert($('.media-tray').height());
		$scope.exMediaTrayFlag = false;
		$scope.norMediaTrayFlag = true;
		$scope.onSearchPage = true;
		$scope.onDiscussPage = false;
		var body = $("html, body");
		var bodyClass = $('body');
		var currentPageClass = bodyClass.data('page-class');
		body.animate('500');
		bodyClass.removeClass('small-fixed-header act-page');
		bodyClass.addClass(currentPageClass);
	}
	
	
	/*
		Action : Media Tray - openMediaDetail, This function is in the index.html page. 
		the event bound with onClick.
		function prototype : openMediaDetail(obj);
	
	*/
	
	
	
	/*
		Action : Media Tray - deleteMedia from tray, This function is in the index.html page. 
		the event bound with onClick.
		function prototype : deleteMedia($this);
	
	*/
	
	
});