var collabmedia = angular.module('collabmedia', ['ui.router','angularFileUpload','checklist-model','ngTable','angularUtils.directives.dirPagination']);
collabmedia.filter('to_trusted', ['$sce', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);

collabmedia.controller('adminMainCtrl',function($scope,$window,$http,$stateParams,$location,$rootScope){
	$scope.mediaList = [];
	
	//defining thumbnails routes
	$scope.init__urlLocations = function(){
		
		$scope.small__thumbnail = '100';
		$scope.medium__thumbnail = '300';
		$scope.discuss__thumbnail = '600';
		$scope.large__thumbnail = '1200';
		$scope.aspectfit__thumbnail = 'aspectfit';
	}
	$scope.init__urlLocations();
	
	
});