var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('discussCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	/*
		Action : Media Mark Action Code
	
	*/
	$scope.mark = function(media){
        
        media.BoardId=$stateParams.id;
        media.Action='Mark';
        $http.post('/media/actions',media).then(function (data, status, headers, config) {
			if(data.data.status=="success"){
				//alert(data.data.message)
				$scope.setFlashInstant(data.data.message , 'success');
			}
			else{
				//alert(data.data.message)    
				$scope.setFlashInstant(data.data.message , 'success');
			}
        }); 
    }
    
	/*
		Action : Media Stamp Action Code
	
	*/
    $scope.stamp = function(media){
        media.BoardId=$stateParams.id;
        media.Action='Stamp';
        $http.post('/media/actions',media).then(function (data, status, headers, config) {
			if(data.data.status=="success"){
				//alert(data.data.message)
				$scope.setFlashInstant(data.data.message , 'success');
			}
			else{
				//alert(data.data.message)    
				$scope.setFlashInstant(data.data.message , 'success');
			}
        }); 
    }
    
	/*
		Action : Media Vote Action Code
	
	*/
    $scope.vote = function(media){
        media.BoardId=$stateParams.id;
        media.Action='Vote';
        $http.post('/media/actions',media).then(function (data, status, headers, config) {
			if(data.data.status=="success"){
				//alert(data.data.message)
				$scope.setFlashInstant(data.data.message , 'success');
			}
			else{
				//alert(data.data.message)    
				$scope.setFlashInstant(data.data.message , 'success');
			}
        }); 
    }
    
	/*
		Action : Media Delete Action Code
	
	*/
	
	$scope.deleteMedia = function(media_id){
    	$("#delete_pop").show();
    	$scope.confirmDel = function() {
	        var fields={};
	        
	        fields.id=$stateParams.id;
	        fields.media=media_id.MediaID;
	                    
	        $http.post('/boards/deleteMedia',fields).then(function (data, status, headers, config) {
	            if (data.data.code==200){ 
	        $scope.setFlashInstant('Media deleted successfully.' , 'success');
	                $scope.changePT();
	                $("#delete_pop").hide();
	            }
	        })
    	};  
    }
	$scope.deleteMediaDiscuss = function(){
    	$("#delete_pop").show();
    	$scope.confirmDel = function() {
	        var fields={};
	        
	        fields.id=$stateParams.id;
	        fields.media=$scope.mediasData.MediaID;
	            console.log(fields);        
	        $http.post('/boards/deleteMedia',fields).then(function (data, status, headers, config) {
	            if (data.data.code==200){ 
	        $scope.setFlashInstant('Media deleted successfully.' , 'success');
	                $scope.changePT();
	                $("#delete_pop").hide();
					$('.holder-act').fadeOut(400)
					$scope.checkPageFlagAndRedirect();
					$('#filterbar').find('a').show();//added by parul to show filter bar 21012015
	            }
	        })
    	};  
    }
	
	//get next media of the board's current page-theme
	$scope.getNextMedia = function(){
		var currentTheme = $scope.selectedgt;
		console.log("CurrentTheme ID = "+currentTheme+"----- Name = "+$scope.selectedgtsa);
	}
	
	//$timeout(function(){
		$scope.getNextMedia();
	//},4500);
	
	
});