var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('searchViewCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){

/*________________________________________________________________________
* @Date:      	14 April 2015
* @Method :   	init__stateVar
* Created By: 	smartData Enterprises Ltd
* Modified On:	-1 july 2015- 
* @Purpose:   	This is to initialize post and close buttons.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.init__stateVar = function(){
		$('#note_forMontage').hide();
        $('#note_forMontage2').hide();
        $scope.note_case = false;
        $scope.search_view_case = true;
        $scope.note_montage_case = false;
        $scope.post_montage_case = false;
    }
    $scope.init__stateVar();
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	9 june 2015
* @Method :   	add_toTray_fromPlatform
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to add media on platform to tray.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.add_toTray_fromPlatform = function(){
	if ($('#grid').css('display')=='none') {
		$scope.addtoTray_delCase($scope.mediasData._id);
	}else{
		console.log($window.item_ids);
		for(i in $window.item_ids){
			if ($window.item_ids[i] != '' && $window.item_ids[i] != 'mon_note' && $window.item_ids[i] != 'mon_note_unknown') {
				$scope.addtoTray_delCase($window.item_ids[i]);	
			}
		}
	}
}
/*****************************************END****************************/




}]);