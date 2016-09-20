var collabmedia = angular.module('collabmedia');


//------------ directive to change src of media image in case of error
collabmedia.compileProvider.directive('fallbackSrc', [function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
		angular.element(this).attr("src", "/assets/img/404error.png");
      });
    }
   }
   return fallbackSrc;
}]);
//-------------------------------------------------------------------  END





//------------ directive to change src of header image in case of error
collabmedia.compileProvider.directive('fallbackSrcHeader', [function () {
  var fallbackSrcHeader = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
		angular.element(this).attr("src", "/assets/board/img/bg-hills.jpg");
      });
    }
   }
   return fallbackSrcHeader;
}]);
//-------------------------------------------------------------------  END



//------------ directive for static include - will not create a new scope.
collabmedia.compileProvider.directive('includeStatic',['$http', '$templateCache', '$compile',function($http, $templateCache, $compile) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    scope:false,
    link: function($scope, element, attrs, ctrl, transclude) {
      var templatePath = attrs.includeStatic;

      try{
      	templatePath = $scope.$eval(templatePath);
      }catch(err){
      	throw new Error(attrs.includeStatic+' is not a valid object');
      }

      $http.get(templatePath, { cache: $templateCache })
      .success(function(response) {
      	var contents = element.html(response).contents();
		$compile(contents)($scope);
      });
    }
  };
}]);



//------------ directive for grouptags drop-down --autocomplete
collabmedia.compileProvider.directive('autoCompleteTagsPreview', function($timeout,$http) {
    return function(scope, iElement, iAttrs) {                        
		iElement.autocomplete({
			source: function(request,response){
				//console.log(request);
				scope.groupta = [];
				scope.groupt = [];
				scope.keywordList = [];
				$http.post('/groupTags/getKeywords',{startsWith:request.term}).then(function(data,status,headers,config){
					if (data.data.code==200){
						scope.gts=data.data.response;
						for(i in scope.gts){
							scope.groupta.push({"id":scope.gts[i]._id,"title":scope.gts[i].GroupTagTitle})
							scope.groupt.push({"value":scope.gts[i]._id,"label":scope.gts[i].GroupTagTitle})
							for(j in scope.gts[i].Tags){
									scope.keywordList.push({"value":scope.gts[i]._id,"label":scope.gts[i].Tags[j].TagTitle,"description":scope.gts[i].GroupTagTitle})    
							}
						}
						response(scope.groupt);
					}
				})
				
			},
			select:function (event, ui) {                    
				scope.current__gt = ui.item.label;
				scope.current__gtID = ui.item.value;
				scope.selectedgt = ui.item.value;
				//scope.gt_fromDwn.push({title:ui.item.label,id:ui.item.value})
				scope.previewIndex.keywordsSelcted.push({title:ui.item.label,id:ui.item.value,from:'dropDown'});
				console.log("$scope.previewIndex.keywordsSelcted----",scope.previewIndex.keywordsSelcted);
				setTimeout(function(){
					scope.$apply();
					$('#lmn_slider').lemmonSlider('destroy');
					mediaSite.initSlider();
				},100)
				scope.$apply();
				if ($('#lmn_slider ul').width() >$('#lmn_slider').width()) {
					$('.prev-slide').fadeIn();
					$('.next-slide').fadeIn();
				}else{
					$('.prev-slide').fadeOut();
					$('.next-slide').fadeOut();
				}
				setTimeout(function(){
					scope.previewIndex.filterSub('search-by-theme');
					$('.keys').removeClass('activeKey');
					$('.keys').removeClass('activeKey');
					$('.keys').last().addClass('activeKey');
					$('#lmn_slider').scrollLeft($('#lmn_slider ul').width())
				},1000);
				iElement.val('');
				return false;
			},
			focus:function (event, ui) {    
				return false;
			}                   
		})
		.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
			var flag = false;
			for(var i= 0; i<scope.previewIndex.keywordsSelcted.length; i++){
				if (scope.previewIndex.keywordsSelcted[i].id == item.value) {
					console.log('here')
					flag = true;
				}
			}
			if (flag) {
			 return $("<li>")
				  .data("item.autocomplete", item)
				  .remove();	
			}else{
				return $("<li>")
				  .data("item.autocomplete", item)
				  //.append("<a>" + item.label + "<span style='color:grey;'> in  <span style='text-transform: uppercase'>" + item.description + "</span></span></a>")
				  .append("<a>" + item.label + "</a>")
				  .appendTo(ul);
			}
		};
		
		/***-------This code overwrites autocompletes default filter function to filter results who starts whith the seaesc parameter-------***/
		$.ui.autocomplete.filter = function (array, term) {
			var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
			return $.grep(array, function (value) {
				return matcher.test(value.label || value.value || value);
			});
		};
		/****-------------------------------------------------------****/
    };
});
//-------------------------------------------------------------------  END



//------------ directive for header background image-- in search list

collabmedia.compileProvider.directive('bgImage', function () {
    return {
        link: function(scope, element, attr) {
			console.log('inside bg-header directive');
            attr.$observe('bgImage', function() {           
				if (!attr.bgImage) {
					// No attribute specified, so use default
					element.removeClass("header-bg");
				}
				else {
					var image = new Image();  
					image.src = attr.bgImage;
					image.onload = function() { 
						//Image loaded- set the background image to it
						element.css("background-image","url("+attr.bgImage+")");
						element.addClass("header-bg");
					};
					image.onerror = function() {
						//Image failed to load- use default
						//element.css("background-image","url(/assets/img/404error.png)");
						element.removeClass("header-bg");
					};
				}
			});
      }
    };
});
//-------------------------------------------------------------------  END

collabmedia.compileProvider.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if ( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
}]);
