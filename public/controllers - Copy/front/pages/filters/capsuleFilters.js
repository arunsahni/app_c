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

collabmedia.filterProvider.register('htmlToPlaintext', [function(){
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    };
}]);
collabmedia.filterProvider.register('unique', [function () {
	return function (items, filterOn) {
		if (filterOn === false) {
			return items;
		}
		if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
			var hashCheck = {}, newItems = [];
			var extractValueToCompare = function (item) {
				if (angular.isObject(item) && angular.isString(filterOn)) {
					return item[filterOn];
				} else {
					return item;
				}
			};
			angular.forEach(items, function (item) {
				var valueToCheck, isDuplicate = false;
				for (var i = 0; i < newItems.length; i++) {
					if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
						isDuplicate = true;
						break;
					}
				}
				if (!isDuplicate) {
					newItems.push(item);
				}
			});
			items = newItems;
		}
		setTimeout(function(){
			$('#lmn_slider').lemmonSlider('destroy');
			mediaSite.initSlider();
		},1000)
		return items;
		
	};
}]);