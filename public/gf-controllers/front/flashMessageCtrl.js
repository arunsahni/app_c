var collabmedia = angular.module('collabmedia');
collabmedia.controller('flashMessageCtrl',function($scope,$rootScope){
	$rootScope.flashMessage = "testing flash Message...";
	//$scope.$apply();
	$("#flash_msg_popup").hide();
	if($("#flash_msg_popup").html().length > 0){
		alert("m with message...");
		$("#flash_msg_popup").show();
	}
	
});