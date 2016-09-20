var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('discussCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){

$scope.has_more_discuss = false;
$scope.show_img_discuss = false;
$scope.showsetting=0;
$scope.arrayOfMedias=[];
$scope.per_page_discuss = 30;
$scope.pageNo_discuss = 1;
$scope.newdata = null;

$scope.setName=function(){
	var i=0;
	$('.col-xs-4').find('a').each(function(){
		$(this).attr("name", i);
		i=i+1;
	})
}

$scope.open_note_forBoard = function(){
	if ($scope.countOfTrayMedia < 15) {
		$('#note_forBoard').show();
	}else{
		$("#media_tray_full_pop").show();
	}
}


/*________________________________________________________________________
* @Date:      	23 April 2015
* @Method :   	deleteMediaDiscuss
* Created By: 	smartData Enterprises Ltd
* Modified On:	16 Aril 2015
* @Purpose:   	This is used to delete media posted on discuss.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.deleteMediaDiscuss = function(){
		$("#delete_pop").show();
    	$scope.confirmDel = function() {
			$('#overlay2').show();
			$('#overlayContent2').show();
	        var fields={};
	        fields.id=$scope.page_id;
	        fields.media=$scope.mediasData.MediaID;       
	        $http.post('/boards/deleteMedia',fields).then(function (data, status, headers, config) {
	            if (data.data.code==200){ 
					$scope.setFlashInstant('Media deleted successfully.' , 'success');
	                
					$scope.init__Discuss();
	                $("#delete_pop").hide();
					$scope.switch__toDiscuss()
	            }
	        })
    	};  
	}
/********************************************END******************************************************/


/*________________________________________________________________________
* @Date:      	23 April 2015
* @Method :   	close_noteBoardCase
* Created By: 	smartData Enterprises Ltd
* Modified On:	16 Aril 2015
* @Purpose:   	This is used initialize alls state managing variables
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/

$scope.close_noteBoardCase = function(){
	//$('body').removeClass('note_padding');
	$('#note_forBoard').hide();
	$scope.init__stateVar();
	$('.edit_froala3').editable('setHTML','Start writing...');
}
/********************************************END******************************************************/

/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	loginService
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to call login service to check user login and get user data.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
loginService.chkUserLogin($http,$location,$window).then(function(){
    $scope.userInfo = tempData;
    userdata=$scope.userInfo;   
});
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	switch__toSearch
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to initialize discuss page media list.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.init__Discuss = function(){
		$http.post('/boards/getCurrentBoardDetails',{id:$scope.page_id,perPage:$scope.per_page_discuss, pageNo:$scope.pageNo_discuss}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				console.log('=======');
				console.log(data);
				$scope.boardMedia = data.data.media;
				$rootScope.boarddata2=data.data.response;
			    $scope.boarddata=data.data.response;
				if (data.data.media.length > 0 && data.data.media.length == $scope.per_page_discuss) {
					$scope.has_more_discuss = true;
				}else{
					$scope.has_more_discuss = false;
				}
			    //$scope.gt=data.data.response[0].Themes;
			    $scope.title=data.data.response[0].Title;
			    $timeout(function(){                
				    if ($scope.userInfo._id == $scope.boarddata[0].OwnerId._id) {
						//alert(1);
					    $scope.showsetting=1;                    
				    }
				    
				//    if ($scope.boarddata[0].PrivacySetting[0].BoardType=='FriendsSolo' && !$scope.showsetting) {
				//	    $scope.isFriendSolo=1;
				//    }
					
				    if (typeof($scope.boarddata[0].HeaderImage)!='undefined') {                    
					    if ($scope.boarddata[0].HeaderImage!="") {
						    $scope.headerstyle="background:url(../assets/board/headerImg/"+$scope.boarddata[0].HeaderImage+");";
						    $scope.headerImg="../assets/Media/headers/aspectfit/"+$scope.boarddata[0].HeaderImage;
					    }                    
				    }
				    if (typeof($scope.boarddata[0].BackgroundMusic)!='undefined') {                    
					    if ($scope.boarddata[0].BackgroundMusic!="") {
							    $('#audio').attr("src","../assets/board/backgroundAudio/"+$scope.boarddata[0].BackgroundMusic);
					    }
				    }
				    $scope.changePT();
			    },2500);
			}	
		})
	};
	//$scope.init__Discuss = function(){
	//	$http.post('/boards',{id:$stateParams.id,perPage:$scope.per_page_discuss, pageNo:$scope.pageNo_discuss}).then(function (data, status, headers, config) {
	//		if (data.data.code==200){
	//			$rootScope.boarddata2=data.data.response;
	//		    $scope.boarddata=data.data.response;
	//			if ($scope.boarddata[0].Invitees!=null) {
	//				
	//			}else{
	//				$scope.boardMembers=false;
	//			}
	//			if (data.data.hasMore) {
	//				$scope.has_more_discuss = true;
	//			}else{
	//				$scope.has_more_discuss = false;
	//			}
	//		    $scope.gt=data.data.response[0].Themes;
	//		    $scope.title=data.data.response[0].Title;
	//		    $timeout(function(){                
	//			    if ($scope.userInfo._id == $scope.boarddata[0].OwnerID._id) {
	//					//alert(1);
	//				    $scope.showsetting=1;                    
	//			    }
	//			    
	//			    if ($scope.boarddata[0].PrivacySetting[0].BoardType=='FriendsSolo' && !$scope.showsetting) {
	//				    $scope.isFriendSolo=1;
	//			    }
	//				
	//			    if (typeof($scope.boarddata[0].HeaderImage)!='undefined') {                    
	//				    if ($scope.boarddata[0].HeaderImage!="") {
	//					    $scope.headerstyle="background:url(../assets/board/headerImg/"+$scope.boarddata[0].HeaderImage+");";
	//					    
	//				    }                    
	//			    }
	//			    if (typeof($scope.boarddata[0].BackgroundMusic)!='undefined') {                    
	//				    if ($scope.boarddata[0].BackgroundMusic!="") {
	//						    $('#audio').attr("src","../assets/board/backgroundAudio/"+$scope.boarddata[0].BackgroundMusic);
	//				    }
	//			    }
	//			    $scope.changePT();
	//		    },2500);
	//		}	
	//	})
	//};
	
	$scope.init__Discuss();
    
/********************************************END******************************************************/

/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	changePT
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This function divides media into row pattrem (3 media per row).
* @Param:     	1
* @Return:    	no
_________________________________________________________________________
*/
      $scope.changePT =function(navigatorType){
		if ($scope.pageNo_discuss ==1){
			$scope.newdata = null;
		}
		if ($scope.newdata != null) {
			$scope.newdata.push.apply($scope.newdata,$scope.boardMedia);
		}else{
			$scope.newdata=$scope.boardMedia;
		}
        for(i in $scope.boardMedia) {
			$scope.boardMedia[i].Medias.PostStatement = $scope.boardMedia[i].Medias.PostStatement?$('<div>').html($scope.boardMedia[i].Medias.PostStatement).text():"No Statement";
        }
        //added for animation point
        var dinesh = $scope.newdata.length/3;
        var sectionDivider = Math.ceil(dinesh);
        var finalData = [];
        var count = 3;
        var k = 0;
        for(var i =1 ; i<= sectionDivider; i++){
            var inner = [];
            for(j = k; j<= $scope.newdata.length-1 ; j++ ){
                if(j == count){
                break;   
                }
                inner.push($scope.newdata[j]);
            }
            k = i * 3;
            count = count+3;
            finalData.push({section: inner});
        }
        $scope.sections =  finalData;
		$('#overlay2').hide();
		$('#overlayContent2').hide();
		$scope.show_img_discuss = false;
		setTimeout(function(){$scope.$apply()},1)
		setTimeout(function(){$scope.setName();},1000);
    }    
/********************************************END******************************************************/

	
	
//    $scope.changePT =function(navigatorType){	
//        newdata=[];
//        for(i in $scope.boarddata[0].Medias) {
//			$scope.boarddata[0].Medias[i].PostStatement = $scope.boarddata[0].Medias[i].PostStatement?$('<div>').html($scope.boarddata[0].Medias[i].PostStatement).text():"No Statement";
//			newdata.push($scope.boarddata[0].Medias[i])
//        }
//        $scope.boarddata[0].Medias=[];
//        $scope.boarddata[0].Medias=newdata;
//        //added for animation point
//        var dinesh = newdata.length/3;
//        var sectionDivider = Math.ceil(dinesh);
//        var finalData = [];
//        var count = 3;
//        var k = 0;
//        for(var i =1 ; i<= sectionDivider; i++){
//            var inner = [];
//            for(j = k; j<= newdata.length-1 ; j++ ){
//                if(j == count){
//                break;   
//                }
//                inner.push(newdata[j]);
//            }
//            k = i * 3;
//            count = count+3;
//            finalData.push({section: inner});
//        }
//        $( "#tabs" ).tabs();
//        $scope.sections =  finalData;
//		$('#overlay2').hide();
//		$('#overlayContent2').hide();
//		$scope.show_img_discuss = false;
//		setTimeout(function(){$scope.setName();},1000)
//    }


/********************* functions for page nav animations********************************************/
	$scope.prevHoverIn__OnAct = function(){
		$scope.isPrevSearchMedia = true;
		$scope.isNextSearchMedia = false;
		
		$scope.isOnSearchActPage = true;
		$scope.isOnDiscussActPage = false;
	}
	
	
	$scope.nextHoverIn__OnAct = function(){
		$scope.isNextSearchMedia = true;
		$scope.isPrevSearchMedia = false;
		
		$scope.isOnSearchActPage = true;
		$scope.isOnDiscussActPage = false;
	}
	
	$scope.prevHoverOut__OnAct = function(){
		$scope.isPrevSearchMedia = false;
		//$scope.isNextSearchMedia = true;
		
		$scope.isOnSearchActPage = false;
		$scope.isOnDiscussActPage = true;
	}
	
	
	$scope.nextHoverOut__OnAct = function(){
		$scope.isNextSearchMedia = false;
		//$scope.isPrevSearchMedia = true;
		
		$scope.isOnSearchActPage = false;
		$scope.isOnDiscussActPage = true;
	}
	
	$scope.prevHoverIn = function(){
		$scope.getPrevPageTheme();
        $scope.isPrevTheme = true;
    };

    $scope.prevHoverOut = function(){
        $scope.isPrevTheme = false;
	};
	
	$scope.nextHoverIn = function(){
        $scope.getNextPageTheme();
		$scope.isNextTheme = true;
	};

    $scope.nextHoverOut = function(){
        $scope.isNextTheme = false;
    };
/********************************************END******************************************************/



/*________________________________________________________________________
* @Date:      	24 June 2015
* @Method :   	show_more_discuss
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This function handles working of show more button on discuss (gets next set of media ans appends it to current media set).
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/ 
	
	$scope.show_more_discuss = function(){
		$scope.show_img_discuss = true;
		//$('#overlay2').show();
		//$('#overlayContent2').show();
		$scope.pageNo_discuss++;
		$scope.init__Discuss();
	}
/********************************************END******************************************************/


/*________________________________________________________________________
* @Date:      	20 July 2015
* @Method :   	deleteMedia
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	this function deletes media from the board, is called from discuss_list.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.deleteMedia = function(media){
    	$("#delete_pop").show();
    	$scope.confirmDel = function() {
	        var fields={};
	        
	        fields.id = $scope.page_id;
	        fields.media=media.MediaID;
	                    
	        $http.post('/boards/deleteMedia',fields).then(function (data, status, headers, config) {
	            if (data.data.code==200){ 
					$scope.refresh_discuss();
					$scope.setFlashInstant('Media deleted successfully.' , 'success');
	            }
	        })
    	};  
    }
/********************************************END******************************************************/
	
/*________________________________________________________________________
* @Date:      	20 July 2015
* @Method :   	mark
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	Action : Media Mark Action Code.
* @Param:     	1
* @Return:    	no
_________________________________________________________________________
*/
	$scope.mark = function(media){
        
        media.BoardId=$scope.page_id;
        media.Action='Mark';
        $http.post('/media/actions',media).then(function (data, status, headers, config) {
			if(data.data.status=="success"){
				$scope.refresh_discuss();
				$scope.setFlashInstant(data.data.message , 'success');
			}
			else{   
				$scope.setFlashInstant(data.data.message , 'success');
			}
        }); 
    }
/********************************************END******************************************************/

  
/*________________________________________________________________________
* @Date:      	20 July 2015
* @Method :   	stamp
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	Action : Media Stamp Action Code
* @Param:     	1
* @Return:    	no
_________________________________________________________________________
*/
    $scope.stamp = function(media){
        media.BoardId=$scope.page_id;
        media.Action='Stamp';
        $http.post('/media/actions',media).then(function (data, status, headers, config) {
			if(data.data.status=="success"){
				$scope.refresh_discuss();
				$scope.setFlashInstant(data.data.message , 'success');
			}
			else{  
				$scope.setFlashInstant(data.data.message , 'success');
			}
        }); 
    }
/********************************************END******************************************************/

    
/*________________________________________________________________________
* @Date:      	20 July 2015
* @Method :   	vote
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	Action : Media Vote Action Code
* @Param:     	1
* @Return:    	no
_________________________________________________________________________
*/
    $scope.vote = function(media){
        media.BoardId=$scope.page_id;
        media.Action='Vote';
        $http.post('/media/actions',media).then(function (data, status, headers, config) {
			if(data.data.status=="success"){
				$scope.refresh_discuss();
				$scope.setFlashInstant(data.data.message , 'success');
			}
			else{
				$scope.setFlashInstant(data.data.message , 'success');
			}
        }); 
    }
/********************************************END******************************************************/
	$scope.refresh_discuss = function(){
		$('#overlay2').show();
		$('#overlayContent2').show();
		$scope.has_more_discuss = false;
		$scope.pageNo_discuss=1;
		$scope.newdata = null;
		$scope.init__Discuss();
		$("#delete_pop").hide();
	}
});

