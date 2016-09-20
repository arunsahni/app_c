var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('sgCreateCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
    $('body').removeClass('setting-page').addClass('sg-page');
    $('#content').removeClass('chapter').removeClass('boards').addClass('media');
    console.log(' --inside sg--Create ctrl -- ')
    $('[data-toggle="tooltip"]').tooltip();
/*________________________________________________________________________
* @Date:      	27 May 2015
* @Method :   	init_dragDrop
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to call login service to check user login and get user data.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.init_dragDrop = function(){
    $(".sg-page").on("dragenter", function(event) {
        event.preventDefault();
        $('.popup-overlayer').show();
        $('.drag-popup').show();
    });
    $(".sg-page").on("dragover", function(event) {
        event.preventDefault();
        $('.popup-overlayer').show();
        $('.drag-popup').show();
    });
    
    $('.sg-page').on('dragleave',function(event){
        event.preventDefault();
        $('.popup-overlayer').hide();
        $('.drag-popup').hide();
    })
    $("html").on("drop", function(event) {
        //alert(event.target.id);
        event.preventDefault();
        $('.popup-overlayer').hide();
        $('.drag-popup').hide();
        event.dataTransfer = event.originalEvent.dataTransfer;
        var file = event.originalEvent.dataTransfer.files;          
        if (file.length == 0) {
           alert('Please drop Image files .');
        }else if (file.length == 1) {
            if ((file[0].type).indexOf('image') != -1) {
                var sendFile = [];
                sendFile.push(file[0]);
                console.log(sendFile[0]);
               // $scope.uploadHeader(sendFile[0]);
            }else{
                alert(file.type+" not allowed...");
            }
        }else{
            alert('Please drop only one Image at a time');
        }
    });
}
$scope.init_dragDrop();
/**********************************END***********************************/




/*________________________________________________________________________
* @Date:      	20 July 2015
* @Method :   	onHeaderSelect
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	Action : Upload Header Image
* @Param:     	
* @Return:    	no
_________________________________________________________________________
*/
	$scope.onHeaderSelect = function() {
        var uploadHeader = $('#uploadHeader');
		var val = uploadHeader.val();
		if (!val.match(/(?:gif|jpg|png|bmp)$/)) {
			$scope.setFlashInstant('<span style="color:red">Selected file is not an image. Please select an image file to proceed.</span>' , 'success');
		}else{
            console.log($scope.myFile);
			//$scope.uploadHeader($scope.myFile);
		}
	};
/********************************************END*********************************************/



/*________________________________________________________________________
* @Date:      	20 July 2015
* @Method :   	uploadHeader
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	Action : Upload Header Image
* @Param:     	
* @Return:    	no
_________________________________________________________________________
*/
$scope.uploadHeader = function(file){
    var uploadUrl = "/pages/uploadHeader";
    var fd = new FormData();
    fd.append('file', file);
    //fd.append('pageID', data.data.data._id);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .success(function(abc){
        console.log(abc);
    })
    .error(function(){
         console.log("failure");
    });    
}
/********************************************END*********************************************/



}]);