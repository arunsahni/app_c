var collabmedia = angular.module('collabmedia');
collabmedia.controllerProvider.register('uploadLinkEngine',function($scope){    
	var allowedMediaTypes = {
		"Image" : ['.jpg','.jpeg','.png','.gif']
	};
	
	var arrayIntersection = function () {
		var val, arrayCount, firstArray, i, j, intersection = [], missing;
		var arrays = Array.prototype.slice.call(arguments); 
		firstArr = arrays.pop();
		if (firstArr) {
			j = firstArr.length;
			arrayCount = arrays.length;
			while (j--) {
				val = firstArr[j];
				missing = false;
				i = arrayCount;
				idx = null;
				while (!missing && i--) {
					idx = arrays[i].indexOf(val);
					if ( !arrayContains(arrays[i], val) ) {
						missing = true;
					}
				}
				if (!missing) {
					intersection.push(idx);
				}
			}
		}
		return intersection;
	}
	
	$scope.find__initialCase = function( inputString ){
		if( inputString.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null ) {
			return "IFRAME";
		}
		else{
			return "URL_OR_STRING";
		}
	}
	
	
	$scope.find__OtherCase = function( inputString ){
		//if( inArray() )
		var inputStringExt = 'test.jpg';
		var array1 , array2 = [];
		
		inputStringExt = inputString.split('.').pop();
		//prepare both array
		array1 = allowedMediaTypes.Image;
		array2.push( inputStringExt );
		
		alert("return value by arrayIntersection = "+arrayIntersection(array1 , array2));
		return;
		if( inputString.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null ) {
			return "IFRAME";
		}
		else{
			return "URL_OR_STRING";
		}
	}
	
	
	
	
});
