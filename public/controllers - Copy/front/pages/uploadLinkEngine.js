var collabmedia = angular.module('collabmedia');
collabmedia.controllerProvider.register('uploadLinkEngine',function($scope){    
	
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
		//alert(intersection.toString());
		return intersection;
	}
	
	
	var allowedMediaTypes = {
		"Image" : ['jpg','jpeg','png','gif']
	};
	
	var arrayContains = function( arr , val ){
		//alert( arr.toString() +"-------"+arr.length+"------------"+val )
		var retVal = 0;
		for( var loop = 0; loop < arr.length; loop++ ){
			if( arr[loop] == val ) {
				//alert(loop+"---------"+"matched....");
				retVal = val;
				break;
			}
		}
		//alert("retVal = "+val);
		return retVal;
	}
	
	$scope.find__initialCase = function( inputString ){
		if( inputString.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null  || inputString.match(/^(<div)(.*?)(><script)(.*?)<\/script>(.*?)(<\/div>)$/) ) {
			return "IFRAME";
		}
		else{
			return "URL_OR_STRING";
		}
	}
	
	
	$scope.find__OtherCase = function( inputString ){
		//if( inArray() )
		var inputStringExt = '';
		var array1 , array2 = [];
		
		inputStringExt = inputString.split('.').pop();
		//prepare both array
		array1 = allowedMediaTypes.Image;
		
		//if( arrayIntersection(array1 , array2) ) {
		if( arrayContains(array1 , inputStringExt) ) {
			return "MEDIA";
		}
		else{
			return "MAYBEOEMBED";
		}
	}
	
	$scope.__getDesciptors = function ( oembedObj ){
		$scope.link.Title = "";
		$scope.link.Prompt = "";
		
		if( !$.isEmptyObject( oembedObj ) ){
			var selectedKeys__4descriptor = [
				'title',
				'author_name',
				'author_url',
				'provider_name',
				'provider_url'
			];
			var __descriptors = "";
			for( var loop = 0; loop < selectedKeys__4descriptor.length; loop++ ){
				if( oembedObj[ selectedKeys__4descriptor[loop] ] ){
					if( loop < selectedKeys__4descriptor.length ){
						__descriptors += oembedObj[ selectedKeys__4descriptor[loop] ]+","	
					}
					else{
						__descriptors += oembedObj[ selectedKeys__4descriptor[loop] ];	
					}
				}
				else{
					//alert(selectedKeys__4descriptor[loop]+" key is not present!");
				}
			}
			//alert("__descriptors = "+__descriptors);
			if( __descriptors != "" ){
				$scope.link.Prompt = __descriptors;
			}
			//alert("Title = "+oembedObj["title"]);
			
			if ( oembedObj["title"] ) {
				$scope.link.Title = oembedObj["title"];
			}
			
			if ( oembedObj["type"] ) {
				if ( oembedObj["type"].toUpperCase() == "PHOTO" || oembedObj["type"].toUpperCase() == "IMAGE" )	
					$scope.link.type = "image";
			}
		}
		else{
			alert("Empty Object!");
		}
		
	}
	
});
