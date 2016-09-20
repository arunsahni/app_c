var collabmedia = angular.module('collabmedia');

collabmedia.filterProvider.register('to_trusted', ['$sce', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);

collabmedia.filterProvider.register('textFromHtml', [function(){
	return function(input) {
		return input.replace(/<[^>]*>/g, '');
	};
}]);