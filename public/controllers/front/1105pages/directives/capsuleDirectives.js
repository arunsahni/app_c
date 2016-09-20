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






//------------ directive to get selected file's data in controller 
collabmedia.compileProvider.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
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
//-------------------------------------------------------------------  END




//------------ directive probaby not in use
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
//-------------------------------------------------------------------  END




//------------ directive to appy m cutom scrollbar 
collabmedia.compileProvider.directive("scrollable", [function () {
    return function(scope, elm) {        
        elm.mCustomScrollbar({
            autoHideScrollbar: false,
			autoDraggerLength: true,
            advanced:{
                updateOnContentResize: true
            }
        });
    };
}]);
//-------------------------------------------------------------------  END




//------------ directive for slick slider--not in use
collabmedia.compileProvider.directive('slick', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'AEC',
      scope: {
        initOnload: '@',
        data: '=',
        currentIndex: '=',
        accessibility: '@',
        adaptiveHeight: '@',
        arrows: '@',
        asNavFor: '@',
        appendArrows: '@',
        appendDots: '@',
        autoplay: '@',
        autoplaySpeed: '@',
        centerMode: '@',
        centerPadding: '@',
        cssEase: '@',
        customPaging: '&',
        dots: '@',
        draggable: '@',
        easing: '@',
        fade: '@',
        focusOnSelect: '@',
        infinite: '@',
        initialSlide: '@',
        lazyLoad: '@',
        onBeforeChange: '&',
        onAfterChange: '&',
        onInit: '&',
        onReInit: '&',
        onSetPosition: '&',
        pauseOnHover: '@',
        pauseOnDotsHover: '@',
        responsive: '=',
        rtl: '@',
        slide: '@',
        slidesToShow: '@',
        slidesToScroll: '@',
        speed: '@',
        swipe: '@',
        swipeToSlide: '@',
        touchMove: '@',
        touchThreshold: '@',
        useCSS: '@',
        variableWidth: '@',
        vertical: '@',
        prevArrow: '@',
        nextArrow: '@'
      },
      link: function (scope, element, attrs) {
        var destroySlick, initializeSlick, isInitialized;
        destroySlick = function () {
          return $timeout(function () {
            var slider;
            slider = $(element);
            slider.slick('unslick');
            slider.find('.slick-list').remove();
            return slider;
          });
        };
        initializeSlick = function () {
          return $timeout(function () {
            var currentIndex, customPaging, slider;
            slider = $(element);
            if (scope.currentIndex != null) {
              currentIndex = scope.currentIndex;
            }
            customPaging = function (slick, index) {
              return scope.customPaging({
                slick: slick,
                index: index
              });
            };
            slider.slick({
              accessibility: scope.accessibility !== 'false',
              adaptiveHeight: scope.adaptiveHeight === 'true',
              arrows: scope.arrows !== 'false',
              asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
              appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
              appendDots: scope.appendDots ? $(scope.appendDots) : $(element),
              autoplay: scope.autoplay === 'true',
              autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
              centerMode: scope.centerMode === 'true',
              centerPadding: scope.centerPadding || '50px',
              cssEase: scope.cssEase || 'ease',
              customPaging: attrs.customPaging ? customPaging : void 0,
              dots: scope.dots === 'true',
              draggable: scope.draggable !== 'false',
              easing: scope.easing || 'linear',
              fade: scope.fade === 'true',
              focusOnSelect: scope.focusOnSelect === 'true',
              infinite: scope.infinite !== 'false',
              initialSlide: scope.initialSlide || 0,
              lazyLoad: scope.lazyLoad || 'ondemand',
              beforeChange: attrs.onBeforeChange ? scope.onBeforeChange : void 0,
              onReInit: attrs.onReInit ? scope.onReInit : void 0,
              onSetPosition: attrs.onSetPosition ? scope.onSetPosition : void 0,
              pauseOnHover: scope.pauseOnHover !== 'false',
              responsive: scope.responsive || void 0,
              rtl: scope.rtl === 'true',
              slide: scope.slide || 'div',
              slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
              slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
              speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
              swipe: scope.swipe !== 'false',
              swipeToSlide: scope.swipeToSlide === 'true',
              touchMove: scope.touchMove !== 'false',
              touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
              useCSS: scope.useCSS !== 'false',
              variableWidth: scope.variableWidth === 'true',
              vertical: scope.vertical === 'true',
              prevArrow: scope.prevArrow ? $(scope.prevArrow) : void 0,
              nextArrow: scope.nextArrow ? $(scope.nextArrow) : void 0
            });
            slider.on('init', function (sl) {
              if (attrs.onInit) {
                scope.onInit();
              }
              if (currentIndex != null) {
                return sl.slideHandler(currentIndex);
              }
            });
            slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
              if (scope.onAfterChange) {
                scope.onAfterChange();
              }
              if (currentIndex != null) {
                return scope.$apply(function () {
                  currentIndex = currentSlide;
                  return scope.currentIndex = currentSlide;
                });
              }
            });
            return scope.$watch('currentIndex', function (newVal, oldVal) {
              if (currentIndex != null && newVal != null && newVal !== currentIndex) {
                return slider.slick('slickGoTo', newVal);
              }
            });
          });
        };
        if (scope.initOnload) {
          isInitialized = false;
          return scope.$watch('data', function (newVal, oldVal) {
            if (newVal != null) {
              if (isInitialized) {
                destroySlick();
              }
              initializeSlick();
              return isInitialized = true;
            }
          });
        } else {
          return initializeSlick();
        }
      }
    };
  }
]);
//-------------------------------------------------------------------  END




//------------ directive to initialize tokenizer for countries filter
collabmedia.compileProvider.directive('demoinputlocal', function($timeout, $http) {
  return {
	
    link: function (scope, element, attrs) {
        $http.get('/fsg/view').then(function (data){
			console.log('--------------------------demoinputlocal---------------------------------------');
            if (data.data.code==200) {
			$http.get('/user/chklogin')
			.success(function (data1, status, headers, config) {				
				if (data1.code=="200"){
					userInfo = data1.usersession;
					for (i in data.data.response) {
					  for (x in userInfo.FSGsArr2){
							if (data.data.response[i].Title=="Country of Affiliation") {
								if (x==data.data.response[i].Title) {
									for (j in data.data.response[i].Values ){
										var fsgsArrVal = '';
										fsgsArrVal = (userInfo.FSGsArr2[x]).split(',');
										for(y in fsgsArrVal){
											if (data.data.response[i].Values[j].valueTitle==fsgsArrVal[y]) {
												var abc={id:data.data.response[i].Values[j]._id,name:data.data.response[i].Values[j].valueTitle};
												currentCountries.push(abc);
											}
										}
									}
								}
							}
					    }
					}
					var myArr = new Array();
					for(var i=0; i< data.data.response.length; i++) {
						 if (data.data.response[i].Title == "Country of Affiliation") {
							 myArr = data.data.response[i];
						 }
					}
					var newArr = new Array();
					newArr = myArr.Values;
					var aNewArr = new Array();
					for(var i=0; i< newArr.length; i++) {
						aNewArr.push({id: newArr[i]._id, name: newArr[i].valueTitle});
					}
					element.tokenInput(aNewArr, {excludeCurrent: true,
						prePopulate: currentCountries,
						resultsFormatter: function(item){
							//return
							$('#country_container ul').append("<li>" + item.valueTitle+"</li>")
							return ;
							},
						});
					 
					 
				}else{
					userInfo = {};
				}
			});	
			  var currentCountries=[];
            }
        })
    }
  }    
});
//-------------------------------------------------------------------  END



//------------ directive for grouptags drop-down --autocomplete
collabmedia.compileProvider.directive('autoCompleteTags', function($timeout,$http) {
    return function(scope, iElement, iAttrs) {                        
		iElement.autocomplete({
			source: function(request,response){
				//console.log(request);
				scope.groupta = [];
				scope.groupt = [];
				$http.post('/groupTags/getKeywords',{startsWith:request.term}).then(function(data,status,headers,config){
					if (data.data.code==200){
						scope.gts=data.data.response;
						//console.log('================================================================');
						//console.log(scope.gts.length);
						//console.log('================================================================');
						for(i in scope.gts){
							scope.groupta.push({"id":scope.gts[i]._id,"title":scope.gts[i].GroupTagTitle})
							scope.groupt.push({"value":scope.gts[i]._id,"label":scope.gts[i].GroupTagTitle})
							for(j in scope.gts[i].Tags){
									scope.tagta.push({"value":scope.gts[i]._id,"label":scope.gts[i].Tags[j].TagTitle,"description":scope.gts[i].GroupTagTitle})    
							}
						}
						//console.log('$scope.groupt.length============='+scope.groupt.length);
						//console.log(scope.groupt);
						response(scope.groupt);
					}
				})
				
			},
			select:function (event, ui) {                    
				scope.current__gt = ui.item.label;
				scope.current__gtID = ui.item.value;
				scope.selectedgt = ui.item.value;
				//scope.gt_fromDwn.push({title:ui.item.label,id:ui.item.value})
				scope.keywordsArr.push({title:ui.item.label,id:ui.item.value,from:'dropDown'});
				console.log("$scope.keywordsArr----",scope.keywordsArr);
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
					scope.filterSub('search-by-theme');$('.keys').removeClass('activeKey');
					$('.keys').removeClass('activeKey');
					$('.keys').last().addClass('activeKey');
					$('#lmn_slider').scrollLeft($('#lmn_slider ul').width())
				},1000);
				iElement.val('');
				return false;
			},
			focus:function (event, ui) {                    
				//scope.search1.tata1 = ui.item.label;
				//scope.search1.gt = ui.item.value;
				//scope.selectedgt=scope.search1.gt;		    
				//scope.$apply();
				return false;
			}                   
		})
		.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
			var flag = false;
			for(var i= 0; i<scope.keywordsArr.length; i++){
				if (scope.keywordsArr[i].id == item.value) {
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

collabmedia.compileProvider.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
       var raw = elm[0];
       console.log("raw.scrollHeight = ",raw.scrollHeight);
       elm.bind('scroll', function() {
            console.log("raw.scrollHeight = ",raw.scrollHeight);
            console.log("raw.scrollTop + raw.offsetHeight = ",(raw.scrollTop + raw.offsetHeight));
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});



//combining directives
collabmedia.compileProvider.directive('searchGalleryPage', ["$compile" , function ($compile) {
    var template = '<div include-static="'+"'../views/front/pages/elements/popups.html'"+'"></div>"';
        template += '<div id="search_gallery_elements" include-static="'+"'../views/front/pages/elements/search_list.html'"+'"></div>"';
        template += '<div id="discuss_gallery_elements"  style="display: none" include-static="'+"'../views/front/pages/elements/discuss_list.html'"+'"></div>"';
        template += '<div include-static="'+"'../views/front/pages/elements/dialogs.html'"+'"></div>"';
        template += '<div id="discuss_view" style="display: none" include-static="'+"'../views/front/pages/elements/discuss_view.html'"+'"></div>"';
        template += '<div id="search_view"  style="display: none" include-static="'+"'../views/front/pages/elements/search_view.html'"+'"></div>"';
    
    //console.log("------------------------template-------------------------------------",template);
    var linker = function(scope, element, attrs) {
        element.html(template).show();
        $compile(element.contents())(scope);
    }

    return {
        scope:true,
        restrict: "E",
        link: linker
    };
}]);


collabmedia.compileProvider.directive('contentPageTest', ["$compile" , function ($compile) {
    var template = '<div style="color:black">';
        template += '<h1>Content Page : {{chappage.Title}}'+" - "+'{{chappage.Order}}</h1>';
        template += '</div>';
    
    //console.log("------------------------template-------------------------------------",template);
    var linker = function(scope, element, attrs) {
        element.html(template).show();
        $compile(element.contents())(scope);
    }

    return {
        scope:true,
        restrict: "E",
        link: linker
    };
}]);

collabmedia.compileProvider.directive('contentPage', ["$compile" , function($compile){
    return {
        //restrict : 'EA',
        scope : {
            cpbuilder:'='
        },
        template: [
            '<div id="builder" title="id:constructor">',
            '<div class="showroom-main">',
            '<div class="showroom-page-container">',
                '<!-- BACKGROUND -->',
                '<div class="main-bg-block">',
                    '<div class="main-bg" style="z-index:0;">',
                        '<div ng-if="cpbuilder.__config.SyncObject.CommonParams.Background.Type==',"'color'",' class="picture-bg" style="background-color:{{cpbuilder.__config.SyncObject.CommonParams.Background.Data}};"></div>',
                        '<div ng-if="cpbuilder.__config.SyncObject.CommonParams.Background.Type==',"'image'",' class="picture-bg" style="background-image:url({{cpbuilder.__config.SyncObject.CommonParams.Background.Data}});opacity:{{cpbuilder.__config.SyncObject.CommonParams.Background.BgOpacity}};"></div>',
                        '<div ng-if="cpbuilder.__config.SyncObject.CommonParams.Background.Type==',"'video'",' class="picture-bg" style="background-image:url({{cpbuilder.__config.SyncObject.CommonParams.Background.Thumbnail}});opacity:{{cpbuilder.__config.SyncObject.CommonParams.Background.BgOpacity}};">',
                            '<div class="video-overlay"></div>',
                            '<div class="video-block" set-trusted-bg cpbuilder="cpbuilder">',
                                '<!--<iframe frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/CcsUYu0PVxY?wmode=opaque&amp;enablejsapi=1&amp;playlist=&amp;autohide=1&amp;loop=1&amp;showinfo=0&amp;theme=dark&amp;controls=1&amp;html5=1&amp;rel=0;autoplay=1" style="width:1366px;height:768px;"></iframe>-->',
                                '<!--<video style="width:100%;height:100%;" src="https://www.youtube.com/embed/CcsUYu0PVxY?wmode=opaque&amp;enablejsapi=1&amp;playlist=&amp;autohide=1&amp;loop=1&amp;showinfo=0&amp;theme=dark&amp;controls=1&amp;html5=1&amp;rel=0"></video>-->',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
                '<!-- BACKGROUND END -->',

                '<div id="showroomScrollContainer" class="container" title="id:showroom_main" tabindex="-1">',
                    '<!-- SHOWROOM -->',
                    '<div class="showroom {{cpbuilder.__config.currentViewport}}" style="opacity:1; top:0; position:relative; margin:0 auto;height:{{cpbuilder.__config.SyncObject[(cpbuilder.__config.currentViewport==',"'desktop'?'ViewportDesktopSections':(cpbuilder.__config.currentViewport=='tablet'?'ViewportTabletSections':'ViewportMobileSections'))].Height}}px;min-height:642px;",' title="class:showroom">',
                        '<!-- SHOWROOM INNER -->',
                        '<div class="showroom-inner" style="height:{{cpbuilder.__config.SyncObject[(cpbuilder.__config.currentViewport==',"desktop'?'ViewportDesktopSections':(cpbuilder.__config.currentViewport=='tablet'?'ViewportTabletSections':'ViewportMobileSections'))].Height}}px;min-height:642px;",'>',
                            '<div class="showroom-page showroom-neighbour">',
                                '<!-- SHOWROOM CONTNET -->',
                                '<div class="showroom-content-wrap showroom-vertical-scroll accelerated-scroll">',
                                    '<!--<div id="test-showroom-manish" class="content-page-width-frame" tabindex="-1" style="width:1024px; height:642px; top:0px; left:163px; border:1px solid transparent"></div>-->',
                                    '<div id="test-showroom-manish" class="content-page-width-frame" tabindex="-1"></div>',
                                '</div>',
                                '<!-- SHOWROOM CONTNET END -->',
                            '</div>',
                        '</div>',
                        '<!-- SHOWROOM INNER END -->',
                        '<div class="showroom-border" style="opacity:0;"></div>',
                    '</div>',
                    '<!-- SHOWROOM END -->',
                '</div>',
            '</div>',
        '</div>',
        '<!-- SHOWROOM MAIN END -->',
        '</div>'
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------content-page2--------" , scope.obj);
        }
    }
        
}]);


collabmedia.compileProvider.directive('videoBackgroundWidget', ["$compile" , function($compile){
    var linker = function(scope, element, attrs) {
        var template = scope.backgroundData;
    
        console.log("------------------------template-------------------------------------",template);
        element.html(template).show();
        $compile(element.contents())(scope);
    }
        
    return {
        restrict : E,
        scope: {
            backgroundType: '=', //use =? for optionality
            backgroundData: '='
        },
        link: linker
    }
        
}])

//combining directives