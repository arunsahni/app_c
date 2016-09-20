var collabmedia = angular.module('collabmedia');


//------------ directive to change src of media image in case of error - for capsule,chapter & pages listing
collabmedia.compileProvider.directive('fallbackSrcRect', [function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
            //angular.element(this).attr("src", "/assets/img/404error.png");
            angular.element(this).attr("src", "/assets/create/images/no-chapter-pic.jpg");
      });
    }
   }
   return fallbackSrc;
}]);

//------------ directive to change src of media image in case of error - for media listing.
collabmedia.compileProvider.directive('fallbackSrc', [function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
            angular.element(this).attr("src", "/assets/img/404error.png");
            //angular.element(this).attr("src", "http://localhost:9100/assets/create/images/no-chapter-pic.jpg");
      });
    }
   }
   return fallbackSrc;
}]);


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




//------------ directive to apply cropper( jquery image croping tool) to the element
collabmedia.compileProvider.directive('imgCrop', ['$parse', function ($parse) {
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

//confirm box directive 
collabmedia.compileProvider.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                console.log('inside link function');
                var msg = attr.ngConfirmClick || "Are you sure you want to proceed ?";
                var clickAction=attr.confirmedClick;
                element.bind('click',function(event){
                    if(window.confirm(msg)){
                        scope.$eval(clickAction);
                        scope.$apply();
                    }
                });
            }   
        };
    }
]);
//-------------------------------------------------------------------  END

// to initialize cropper
collabmedia.compileProvider.directive("headerCropper", [function () {
    return {
        restrict: 'A',

        // Bind the DOM events to the scope
        
        link: function (scope, element, attrs) {
            //console.log(($('.upload-popup-ttl').width())-20);
            element.cropper({
                aspectRatio: 4.5 / 1,
                dragCrop: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
                guides: false,
                center: false,
                background: false,
                minCropBoxWidth: 2100,
                zoomable: false,
                crop: function(data) {
                    //console.log('-----------------------------------------');
                    scope.cropData = data;
                    //console.log('-----------------------------------------');
                }
            });
            
            // Check when change scope occurs
            scope.$watch('cropImg', function () {
                //element.cropper('destroy');
                if (scope.cropImg) {
                    console.log("New image url : " + scope.cropImg);
                    element.cropper('replace',scope.cropImg);
                    setTimeout(function(){
                        console.log('----------here---------------');
                        element.cropper('move', 0, 0);
                    },3000);
                    //element.cropper.setDefaults({
                    //    minCropBoxWidth: ($('.upload-popup-ttl').width())-20,
                    //})
                }
            });

            // When new image is loaded
            //element.bind('load', function () {
            //    console.log("New image url is loaded ! " + scope.cropImg);
            //});
        }
    };
}]);


collabmedia.compileProvider.directive("scrollable", [function () {
    return function(scope, elm) {        
        elm.mCustomScrollbar({
            autoHideScrollbar: false,
            advanced:{
                updateOnContentResize: true
            }
        });
        //scrollToFunc1();
     };
}]);


//------------ directive for header  image fallback-- in page list
//
collabmedia.compileProvider.directive('bgImage', function () {
    return {
        link: function(scope, element, attr) {
         
            element.bind('error', function() {
                //if (attr.data == 'small') {
                    element.attr('src','/assets/img/no-chapter-pic.jpg');
                //}else{
                //    element.attr('src','/assets/img/no-browse-pic.jpg');
                //}
            });
        }
    };
});
//-------------------------------------------------------------------  END

// Post repeat directive for logging the rendering time
collabmedia.compileProvider.directive('postRepeatDirective',
['$timeout',
    function($timeout) {
        return function(scope) {
        if (scope.$first)
            window.a = new Date(); // window.a can be updated anywhere if to reset counter at some action if ng-repeat is not getting started from $first
            if (scope.$last)
                $timeout(function(){
                console.log("## DOM rendering list took: " + (new Date() - window.a) + " ms");
            });
        };
    }
]);

//collabmedia.compileProvider.directive("masonry", [function () {
//    return {
//        link: function(scope, element, attr) {
//            $(window).on('load',function(){
//                element.masonry({
//                    itemSelector: '.item',
//                    gutter: 10
//                })
//            })
//        }
//    };
//}]);


//------------ directive to initialize tokenizer for countries filter
collabmedia.compileProvider.directive('keywordsTokenizer', function($timeout, $http) {
  return {
    link: function (scope, element, attrs) {
        console.log('keywordsTokenizer directive')
        $http.get('/fsg/view').then(function (data){
			console.log('--------------------------demoinputlocal---------------------------------------');
            if (data.data.code==200) {
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
                                        onAdd: function(){
                                            console.log(element.parent());
                                            //element.parent().animate({ height: element.parent().height()+60 }, { duration: 500 });
                                        }
//						resultsFormatter: function(item){
//                                            $('#country_container ul').append("<li>" + item.valueTitle+"</li>")
//                                            return ;
//                                            },
					});
            }
        })
    }
  }    
});
//-------------------------------------------------------------------  END


collabmedia.compileProvider.directive("lmnSlider", [function () {
    return {
        link: function(scope, element, attr) {
            element.lemmonSlider();
            function getKeys(){
                return scope.SgPageMgmt.keywordsSelcted;
            }
            scope.$watch(getKeys, function () {
                console.log('value changed');
                element.lemmonSlider('destroy');
                element.lemmonSlider({'loop':false});
                var setWidth = ($('#keyword_slider ul li').length)*33 +$('#keyword_slider ul').width();
                $('#keyword_slider ul').width(setWidth);
            },true);
            
        }
    };
}]);

collabmedia.compileProvider.directive("disableAnimate", function ($animate) {
    return {
        link: function (scope, element) {
            console.log('disableAnimate')
            $animate.enabled(false, element);
        }
    }
});

// not in use 
/*
collabmedia.compileProvider.directive("ckeckAll", [function () {
    return {
        link: function(scope, element, attr) {
            console.log('---------Check All-----');
            element.bind('click', function(){
                console.log(element.prop('checked'))
                if (element.prop('checked')) {
                    element.parent().find('.type').prop('checked',true)
                }
            });
        }
    };
}]);
*/



//------------ directive for grouptags drop-down --autocomplete
collabmedia.compileProvider.directive('autoCompleteTagsCreate', function($timeout,$http) {
    return function(scope, iElement, iAttrs) {                        
		iElement.autocomplete({
			source: function(request,response){
				//console.log(request);
				scope.groupta = [];
				scope.groupt = [];
				$http.post('/groupTags/getKeywords',{startsWith:request.term}).then(function(data,status,headers,config){
					if (data.data.code==200){
						scope.gts=data.data.response;
						for(i in scope.gts){
							scope.groupta.push({"id":scope.gts[i]._id,"title":scope.gts[i].GroupTagTitle})
							scope.groupt.push({"value":scope.gts[i]._id,"label":scope.gts[i].GroupTagTitle})
							for(j in scope.gts[i].Tags){
									scope.SgPageMgmt.keywordList.push({"value":scope.gts[i]._id,"label":scope.gts[i].Tags[j].TagTitle,"description":scope.gts[i].GroupTagTitle})    
							}
						}
						response(scope.groupt);
					}
				})
				
			},
			select:function (event, ui) {                    
				scope.current__gt = ui.item.label;
				scope.current__gtID = ui.item.value;
				//$('#'+scope.current__gtID).addClass('active-tag');
				scope.selectedgt = ui.item.value;
				////scope.gt_fromDwn.push({title:ui.item.label,id:ui.item.value})
				scope.SgPageMgmt.keywordsSelcted.push({title:ui.item.label,id:ui.item.value,from:'dropDown'});
				console.log("$scope.SgPageMgmt.keywordsSelcted----",scope.SgPageMgmt.keywordsSelcted);
				scope.$apply();
				//$('#keyword_slider').lemmonSlider('destroy');
				//setTimeout(function(){
				//	createModule.initSlider();
				//},100)
				if ($('#keyword_slider ul').width() >$('#keyword_slider').width()) {
					$('.prev-slide').fadeIn();
					$('.next-slide').fadeIn();
				}else{
					$('.prev-slide').fadeOut();
					$('.next-slide').fadeOut();
				}
				setTimeout(function(){
                    $('#loader').show().css({'opacity':'1'});
					scope.SgPageMgmt.filterSub('search-by-theme');
                    $('.keys').removeClass('activeKey');
					$('.keys').removeClass('activeKey');
					$('.keys').last().addClass('activeKey');
					$('#keyword_slider').scrollLeft($('#keyword_slider ul').width())
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
			for(var i= 0; i<scope.SgPageMgmt.keywordsSelcted.length; i++){
				if (scope.SgPageMgmt.keywordsSelcted[i].id == item.value) {
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


//------------ directive for grouptags drop-down --autocomplete
collabmedia.compileProvider.directive('autoCompleteMembers', function($timeout,$http) {
    return function(scope, iElement, iAttrs) {                        
		iElement.autocomplete({
			source: function(request,response){
				//console.log(request);
				scope.membersList = [];
				$http.post('/members',{startsWith:request.term}).then(function(data,status,headers,config){
					if (data.data.code==200){
						
						for(var i = 0;  i < data.data.friends.length ; i++){
							scope.membersList.push({'label': data.data.friends[i].Friend.Email , 'value' : data.data.friends[i].Friend.Name  , 'pic' : data.data.friends[i].Friend.Pic })
						}
                        console.log(scope.membersList)
						response(scope.membersList);
					}
				})
				
			},
			select:function (event, ui) {          
				//iElement.val('');
                scope.LaunchSettingsMgmt.ownerEmail = ui.item.label;          
				scope.$apply();
				return false;
			},
			focus:function (event, ui) {    
				return false;
			}                   
		})
		.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
            ul.addClass('list-dropdown-box');
             return $( "<li class='list-dropdown-row'>" )
                        .attr( "data-value", item.value )
                        .prepend( '<div class="listLeft"><img class="listImg" src='+item.pic+'></div>' +'<div class="listRight"><p class="listName" title="'+item.value+'">'+item.value+'</p><p class="listEmail" title="'+item.label+'">'+item.label+'</p></div>')
                        .appendTo( ul );
        }
        
		
		/***-------This code overwrites autocompletes default filter function to filter results who starts whith the seaesc parameter-------***/
		//$.ui.autocomplete.filter = function (array, term) {
		//	var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
		//	return $.grep(array, function (value) {
		//		return matcher.test(value.label || value.value || value);
		//	});
		//};
		/****-------------------------------------------------------****/
    };
});

//------------ directive for grouptags drop-down --autocomplete
collabmedia.compileProvider.directive('lsAutoCompleteMembers', function($timeout,$http) {
    return function(scope, iElement, iAttrs) {                        
		iElement.autocomplete({
			source: function(request,response){
				//console.log(request);
				scope.membersList = [];
				$http.post('/members',{startsWith:request.term}).then(function(data,status,headers,config){
					if (data.data.code==200){
						
						for(var i = 0;  i < data.data.friends.length ; i++){
							scope.membersList.push({'label': data.data.friends[i].Friend.Email , 'value' : data.data.friends[i].Friend.Name  , 'pic' : data.data.friends[i].Friend.Pic })
						}
                        console.log(scope.membersList)
						response(scope.membersList);
					}
				})
				
			},
			select:function (event, ui) {          
				//iElement.val('');
                scope.LSMgmt.ownerEmail[iAttrs.index] = ui.item.label;          
				scope.$apply();
				return false;
			},
			focus:function (event, ui) {    
				return false;
			}                   
		})
		.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
            ul.addClass('list-dropdown-box');
             return $( "<li class='list-dropdown-row'>" )
                        .attr( "data-value", item.value )
                        .prepend( '<div class="listLeft"><img class="listImg" src='+item.pic+'></div>' +'<div class="listRight"><p class="listName" title="'+item.value+'">'+item.value+'</p><p class="listEmail" title="'+item.label+'">'+item.label+'</p></div>')
                        .appendTo( ul );
        }
        
		
		/***-------This code overwrites autocompletes default filter function to filter results who starts whith the seaesc parameter-------***/
		//$.ui.autocomplete.filter = function (array, term) {
		//	var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
		//	return $.grep(array, function (value) {
		//		return matcher.test(value.label || value.value || value);
		//	});
		//};
		/****-------------------------------------------------------****/
    };
});


//combining
//workshop
//setTrustedBackground
collabmedia.compileProvider.directive('setTrustedBg' , [function(){
    return {
        scope:{
            cpbuilder:'='
        },
        link : function(scope , element , attr){
            //console.log("scope.$eval(scope.bgvideodata) --------------------",scope.cpbuilder.__config.SyncObject.CommonParams.Background.Data);
            element.html(scope.cpbuilder.__config.SyncObject.CommonParams.Background.Data);
            
            var videoElem = element.find('iframe');
            angular.element(videoElem).addClass("hundredpercentwh");
            console.log("angular.element(videoElem).attr(src) =00000000000000000 ",angular.element(videoElem).attr("src"));
            /*
            var src = angular.element(videoElem).attr("src");
            var newsrc = src+";autoplay=1&amp;loop=1&amp;";
            angular.element(videoElem).attr("src" , newsrc);
            */
            if(!element.find('iframe') && !element.find('video') && !element.find('audio') && !element.find('div')){
                element.html('');
            }
                
        }
    }
}]);

//End - Edit Background
/*
$(function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 10,
      values: [ 0, 1 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
  });
  */
//bgp-opacity-slider-range
collabmedia.compileProvider.directive('bgpOpacitySliderRange' , ['$timeout', function($timeout){
    return {
        scope:{
            obj:'=',
            cpbuilder:'='
        },
        link : function(scope , element , attr){
            $timeout(function(){
                element.slider({
                    range: true,
                    min: 0,
                    max: 100,
                    values: [ 0, parseInt(scope.cpbuilder.__config.SyncObject.CommonParams.Background.BgOpacity*100) ],
                    slide: function( event, ui ) {
                      scope.cpbuilder.__config.SyncObject.CommonParams.Background.BgOpacity = parseInt(ui.values[ 1 ])/100;
                      scope.$apply();
                      $("#bgp-amount").val( ui.values[ 1 ] + "%" );
                    },
                    stop : function( event, ui ){
                        scope.cpbuilder.updateBackground();
                        scope.$apply();
                    }
                });
                $("#bgp-amount").val( element.slider( "values", 1 ) + "%" );
                //scope.cpbuilder.__config.SyncObject.CommonParams.Background.BgOpacity = parseInt(scope.cpbuilder.__config.SyncObject.CommonParams.Background.BgOpacity)*100;
                //scope.$apply();
            },1000);
        }
    }
}]);

//Edit foreground
collabmedia.compileProvider.directive('setTrustedData' , [function(){
    return {
        scope:{
            obj:'='
        },
        link : function(scope , element , attr){
            //console.log("scope.$eval(scope.bgvideodata) --------------------",scope.cpbuilder.__config.SyncObject.CommonParams.Background.Data);
            element.html(scope.obj.Data);
            /*
            var videoElem = element.find('iframe');
            angular.element(videoElem).addClass("hundredpercentwh");
            var src = angular.element(videoElem).attr("src");
            var newsrc = src+";autoplay=1&amp;";
            angular.element(videoElem).attr("src" , newsrc);
            */
        }
    }
}]);



collabmedia.compileProvider.directive('textWidget', ["$compile" , function($compile){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!--text-box Start-->',
            '<div class="text-box" title="block block-text" style="z-index:{{obj.Z}};left:{{obj.X}}px; top:{{obj.Y}}px; width:{{obj.W}}px;height:{{obj.H+38}}px;position:absolute;display:block;" xpos="obj.X" ypos="obj.Y" wval="obj.W" hval="obj.H" draggable resizable>',
            //'<!-- Text toolbar -->',
            '<div class="text-toolbar">',
                '<div class="f-left">',
                    '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a href="Javascript:void(0);" class="brandon-bold count dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara">{{obj.SrNo}}</a></div>',
                    '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara"><img src="../assets/cpage/images/icons/audio.png" alt="audio" /></a></div>',
                    '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a set-animation obj="obj" cpbuilder="cpbuilder" href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a>',
                    '<div class="transition-effect-box" style="z-index:{{500+obj.SrNo}};">',
                        '<ul>',
                            '<li ng-click="obj.Animation=',"'blind'",'"><a href="javascript:void(0);">Blind</a></li>',
                            '<li ng-click="obj.Animation=',"'bounce'",'"><a href="javascript:void(0);">Bounce</a></li>',
                            '<li ng-click="obj.Animation=',"'clip'",'"><a href="javascript:void(0);">Clip</a></li>',
                            '<li ng-click="obj.Animation=',"'drop'",'"><a href="javascript:void(0);">Drop</a></li>',
                            '<li ng-click="obj.Animation=',"'fade'",'"><a href="javascript:void(0);">Fade</a></li>',
                            '<li ng-click="obj.Animation=',"'fold'",'"><a href="javascript:void(0);">Fold</a></li>',
                            '<li ng-click="obj.Animation=',"'scale'",'"><a href="javascript:void(0);">Scale</a></li>',
                            '<li ng-click="obj.Animation=',"'highlight'",'"><a href="javascript:void(0);">Highlight</a></li>',
                            '<li ng-click="obj.Animation=',"'puff'",'"><a href="javascript:void(0);">Puff</a></li>',
                            '<li ng-click="obj.Animation=',"'slide'",'"><a href="javascript:void(0);">Slide</a></li>',
                            '<li ng-click="obj.Animation=',"'shake'",'"><a href="javascript:void(0);">Shake</a></li>',
                            //'<li ng-click="obj.Animation=',"'transfer'",'"><a href="javascript:void(0);">Transfer</a></li>',
                            '<li ng-click="obj.Animation=',"'explode'",'"><a href="javascript:void(0);">Explode</a></li>',
                        '</ul>',
                    '</div>',
                    '</div>',
                '</div>',
                '<div class="f-right">',
                    '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a" ng-click="cpbuilder.removeWidget(obj)"><a href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara" id="question-answer-box-close"><img src="../assets/cpage/images/icons/cross-icon.png" alt="cross" /></a></div>',
                '</div>',
            '</div>',
            '<!-- /Text toolbar -->',
            '<div class="box text-box-edit border" style="height:{{obj.H}}px; top:38px;">',
                '<div class="drag-resize-option">',
                    '<a href="javascript:void(0)" class="drag-option"><img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /></a>',
                    '<a href="javascript:void(0)" class="resize-option"><img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /></a>',
                '</div>',
                '<div class="text-box-bg"></div>',
                '<div contenteditable="true" ng-model="obj.Data" class="content-frame" style="color:#000;width:{{obj.W}}px;height:{{obj.H}}px;">',
                '</div>',
                '<!--text-box-resize-handle start-->',
                '<div class="border-box"></div>',
                '<!--text-box-resize-handle start-->',
            '</div>',
            '</div>',
            '<!--text-box End-->'
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------textWidget--------" , scope.obj);
        }
    }
        
}]);

//set-animation
collabmedia.compileProvider.directive('setAnimation', ["$compile" , function($compile){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        link: function(scope, element, attrs) {
            console.log("--------setAnimation--------" , scope.obj);
            
            //console.log("element =",element);
            
            //console.log("attrs =",attrs);
            
            //console.log(".position(); ---------------= ",element.position());
            
            var chooseAnimation = $(element.context.nextSibling);
            //console.log("element.parent() = ",$(element.context.parentNode.parentNode.parentNode.parentNode.previousSibling));
            //var chooseAnimation = $(element.context.parentNode.parentNode.parentNode.parentNode.previousSibling);
            //console.log("chooseAnimation = ",chooseAnimation);
            
            //set XY of chooseAnimation
            //chooseAnimation.css('top',scope.obj.X).css('left',scope.obj.Y);
            element.on('click',function(){
                //var chooseAnimation = $(element.context.parentNode.parentNode.parentNode.parentNode.previousSibling);
                //chooseAnimation.css('top',scope.obj.X).css('left',scope.obj.Y);
                chooseAnimation.show();
                function getObjAnimation(){
                    return scope.obj.Animation;
                }
                scope.$watch(getObjAnimation , function(newValue , oldValue){
                    closeAnimationPanel();
                })
            })
            function closeAnimationPanel(){
                chooseAnimation.hide()
            }
            
        }
    }
        
}]);

/*
 //set-animation
collabmedia.compileProvider.directive('setAnimation', ["$compile" , function($compile){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        link: function(scope, element, attrs) {
            console.log("--------setAnimation--------" , scope.obj);
            
            console.log("element =",element);
            
            console.log("attrs =",attrs);
            
            console.log(".position(); ---------------= ",element.position());
            
            //var chooseAnimation = $(element.context.nextSibling);
            console.log("element.parent() = ",$(element.context.parentNode.parentNode.parentNode.parentNode.previousSibling));
            var chooseAnimation = $(element.context.parentNode.parentNode.parentNode.parentNode.previousSibling);
            console.log("chooseAnimation = ",chooseAnimation);
            
            //set XY of chooseAnimation
            //chooseAnimation.css('top',scope.obj.X).css('left',scope.obj.Y);
            element.on('click',function(){
                var chooseAnimation = $(element.context.parentNode.parentNode.parentNode.parentNode.previousSibling);
                chooseAnimation.css('top',scope.obj.X).css('left',scope.obj.Y);
                chooseAnimation.show();
                function getObjAnimation(){
                    return scope.obj.Animation;
                }
                scope.$watch(getObjAnimation , function(newValue , oldValue){
                    closeAnimationPanel();
                })
            })
            function closeAnimationPanel(){
                chooseAnimation.hide()
            }
            
        }
    }
        
}]);
 */

collabmedia.compileProvider.directive('imageWidget', ["$compile" , function($compile){
    var linker = function(scope, element, attrs) {
        console.log("--------textWidget--------" , scope.textWidgetObj);
    }
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!--picture-box Start-->',
            '<div class="picture-widget-center" style="z-index:{{obj.Z}};left:{{obj.X}}px; top:{{obj.Y}}px; width:{{obj.W}}px;height:{{obj.H+38}}px;position:absolute;display:block" xpos="obj.X" ypos="obj.Y" wval="obj.W" hval="obj.H" draggable resizable>',
                '<!-- Text toolbar -->',
                '<div class="text-toolbar">',
                    '<div class="f-left">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a href="Javascript:void(0);" class="brandon-bold count dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara">{{obj.SrNo}}</a></div>',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a set-animation obj="obj" cpbuilder="cpbuilder" href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a>',
                        '<div class="transition-effect-box" style="z-index:{{9999+obj.SrNo}};">',
                            '<ul>',
                                '<li ng-click="obj.Animation=',"'blind'",'"><a href="javascript:void(0);">Blind</a></li>',
                                '<li ng-click="obj.Animation=',"'bounce'",'"><a href="javascript:void(0);">Bounce</a></li>',
                                '<li ng-click="obj.Animation=',"'clip'",'"><a href="javascript:void(0);">Clip</a></li>',
                                '<li ng-click="obj.Animation=',"'drop'",'"><a href="javascript:void(0);">Drop</a></li>',
                                '<li ng-click="obj.Animation=',"'fade'",'"><a href="javascript:void(0);">Fade</a></li>',
                                '<li ng-click="obj.Animation=',"'fold'",'"><a href="javascript:void(0);">Fold</a></li>',
                                '<li ng-click="obj.Animation=',"'scale'",'"><a href="javascript:void(0);">Scale</a></li>',
                                '<li ng-click="obj.Animation=',"'highlight'",'"><a href="javascript:void(0);">Highlight</a></li>',
                                '<li ng-click="obj.Animation=',"'puff'",'"><a href="javascript:void(0);">Puff</a></li>',
                                '<li ng-click="obj.Animation=',"'slide'",'"><a href="javascript:void(0);">Slide</a></li>',
                                '<li ng-click="obj.Animation=',"'shake'",'"><a href="javascript:void(0);">Shake</a></li>',
                                //'<li ng-click="obj.Animation=',"'transfer'",'"><a href="javascript:void(0);">Transfer</a></li>',
                                '<li ng-click="obj.Animation=',"'explode'",'"><a href="javascript:void(0);">Explode</a></li>',
                            '</ul>',
                        '</div>',
                        '</div>',
                    '</div>',
                    '<div class="f-right">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a" ng-click="cpbuilder.removeWidget(obj)"><a href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara" id="question-answer-box-close"><img src="../assets/cpage/images/icons/cross-icon.png" alt="cross" /></a></div>',
                    '</div>',
                '</div>',
                '<!-- /Text toolbar -->',
                '<!-- -->',
                '<div class="box border" style="width:{{obj.W}}px;height:{{obj.H}}px;top:38px;">',
                    '<div class="drag-resize-option">',
                        '<a href="javascript:void(0)" class="drag-option"><img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /></a>',
                        '<a href="javascript:void(0)" class="resize-option"><img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /></a>',
                    '</div>',
                    //'<div class="picture-frame-picture" style="background-image:url(../assets/cpage/images/icons/picture.png);">',
                    '<div class="picture-frame-picture" style="background-image:url({{obj.Data}})">',
                        //'<!-- -->',
                        //'<div style="background-image:url({{obj.Data}}); box-shadow: none; border-radius: 0px; background-position: 50% 50%; opacity: 1;"></div>',
                        //'<!-- -->',
                    '</div>',
                '</div>',
            '</div>',
            '<!--picture-box End-->'
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------textWidget--------" , scope.obj);
        }
    }
        
}]);

collabmedia.compileProvider.directive('videoWidget', ["$compile" , function($compile){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
	template: [
            '<div class="video-widget-center" style="z-index:{{obj.Z}};left:{{obj.X}}px; top:{{obj.Y}}px; width:{{obj.W}}px;height:{{obj.H}}px;position:absolute;display:block;" xpos="obj.X" ypos="obj.Y" wval="obj.W" hval="obj.H" draggable resizable>',
            '<!-- Text toolbar -->',
            '<div class="text-toolbar">',
                '<div class="f-left">',
                    '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a href="Javascript:void(0);" class="brandon-bold count dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara">{{obj.SrNo}}</a></div>',
                    '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a set-animation obj="obj" cpbuilder="cpbuilder" href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a>',
                    '<div class="transition-effect-box" style="z-index:{{9999+obj.SrNo}};">',
                        '<ul>',
                            '<li ng-click="obj.Animation=',"'blind'",'"><a href="javascript:void(0);">Blind</a></li>',
                            '<li ng-click="obj.Animation=',"'bounce'",'"><a href="javascript:void(0);">Bounce</a></li>',
                            '<li ng-click="obj.Animation=',"'clip'",'"><a href="javascript:void(0);">Clip</a></li>',
                            '<li ng-click="obj.Animation=',"'drop'",'"><a href="javascript:void(0);">Drop</a></li>',
                            '<li ng-click="obj.Animation=',"'fade'",'"><a href="javascript:void(0);">Fade</a></li>',
                            '<li ng-click="obj.Animation=',"'fold'",'"><a href="javascript:void(0);">Fold</a></li>',
                            '<li ng-click="obj.Animation=',"'scale'",'"><a href="javascript:void(0);">Scale</a></li>',
                            '<li ng-click="obj.Animation=',"'highlight'",'"><a href="javascript:void(0);">Highlight</a></li>',
                            '<li ng-click="obj.Animation=',"'puff'",'"><a href="javascript:void(0);">Puff</a></li>',
                            '<li ng-click="obj.Animation=',"'slide'",'"><a href="javascript:void(0);">Slide</a></li>',
                            '<li ng-click="obj.Animation=',"'shake'",'"><a href="javascript:void(0);">Shake</a></li>',
                            //'<li ng-click="obj.Animation=',"'transfer'",'"><a href="javascript:void(0);">Transfer</a></li>',
                            '<li ng-click="obj.Animation=',"'explode'",'"><a href="javascript:void(0);">Explode</a></li>',
                        '</ul>',
                    '</div>',
                    '</div>',
                '</div>',
                '<div class="f-right">',
                    '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a" ng-click="cpbuilder.removeWidget(obj)"><a href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara" id="question-answer-box-close"><img src="../assets/cpage/images/icons/cross-icon.png" alt="cross" /></a></div>',
                '</div>',
            '</div>',
            '<!-- /Text toolbar -->',
            '<div class="box border" style="width:100%;height:{{obj.H}}px;top:38px;">',
            '<div class="drag-resize-option">',
                '<a href="javascript:void(0)" class="drag-option"><img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /></a>',
                '<a href="javascript:void(0)" class="resize-option"><img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /></a>',
            '</div>',
            '<div ng-if="obj.Thumbnail" class="picture-frame-picture picture-bg" style="background-image:url({{obj.Thumbnail}});">',
                //'<div style="width:100%;height:{{obj.H}}px; position: absolute;"></div>',
            '</div>',
            '<div ng-if="!obj.Thumbnail" class="picture-frame-picture picture-bg" style="background-image:url(../assets/cpage/images/icons/video-bg.png);">',
                //'<div style="width:100%;height:{{obj.H}}px; position: absolute;"></div>',
            '</div>',
            '</div>',
        '</div>',
        '<!--video-box End-->'
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------videoWidget--------" , scope.obj);
            console.log("--------obj.Data--------" , scope.obj.Data);
        }
    }
}]);

collabmedia.compileProvider.directive('audioWidget', ["$compile" , function($compile){
    var linker = function(scope, element, attrs) {
        console.log("--------textWidget--------" , scope.textWidgetObj);
    }
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!--audio-box Start-->',
            '<div class="audio-widget-center" style="z-index:{{obj.Z}};left:{{obj.X}}px;top:{{obj.Y}}px;width:{{obj.W}}px;height:{{obj.H+38}}px;position:absolute;display:block" xpos="obj.X" ypos="obj.Y" wval="obj.W" hval="obj.H" draggable resizable>',
                '<!-- Text toolbar -->',
                '<div class="text-toolbar">',
                    '<div class="f-left">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a href="Javascript:void(0);" class="brandon-bold count dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara">{{obj.SrNo}}</a></div>',
                        '<!--<div class="icon-box"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a></div>-->',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a set-animation obj="obj" cpbuilder="cpbuilder" href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a>',
                        '<div class="transition-effect-box" style="z-index:{{9999+obj.SrNo}};">',
                            '<ul>',
                                '<li ng-click="obj.Animation=',"'blind'",'"><a href="javascript:void(0);">Blind</a></li>',
                                '<li ng-click="obj.Animation=',"'bounce'",'"><a href="javascript:void(0);">Bounce</a></li>',
                                '<li ng-click="obj.Animation=',"'clip'",'"><a href="javascript:void(0);">Clip</a></li>',
                                '<li ng-click="obj.Animation=',"'drop'",'"><a href="javascript:void(0);">Drop</a></li>',
                                '<li ng-click="obj.Animation=',"'fade'",'"><a href="javascript:void(0);">Fade</a></li>',
                                '<li ng-click="obj.Animation=',"'fold'",'"><a href="javascript:void(0);">Fold</a></li>',
                                '<li ng-click="obj.Animation=',"'scale'",'"><a href="javascript:void(0);">Scale</a></li>',
                                '<li ng-click="obj.Animation=',"'highlight'",'"><a href="javascript:void(0);">Highlight</a></li>',
                                '<li ng-click="obj.Animation=',"'puff'",'"><a href="javascript:void(0);">Puff</a></li>',
                                '<li ng-click="obj.Animation=',"'slide'",'"><a href="javascript:void(0);">Slide</a></li>',
                                '<li ng-click="obj.Animation=',"'shake'",'"><a href="javascript:void(0);">Shake</a></li>',
                                //'<li ng-click="obj.Animation=',"'transfer'",'"><a href="javascript:void(0);">Transfer</a></li>',
                                '<li ng-click="obj.Animation=',"'explode'",'"><a href="javascript:void(0);">Explode</a></li>',
                            '</ul>',
                        '</div>',
                        '</div>',
                    '</div>',
                    '<div class="f-right">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a" ng-click="cpbuilder.removeWidget(obj)"><a href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara" id="question-answer-box-close"><img src="../assets/cpage/images/icons/cross-icon.png" alt="cross" /></a></div>',
                    '</div>',
                '</div>',
                '<!-- /Text toolbar -->',
                '<!-- -->',
                '<div class="box border" style="width:100%;height:{{obj.H}}px;top:38px;">',
                    '<div class="drag-resize-option">',
                        '<a href="javascript:void(0)" class="drag-option"><img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /></a>',
                        '<a href="javascript:void(0)" class="resize-option"><img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /></a>',
                    '</div>',
                    '<div ng-if="obj.Thumbnail" class="picture-frame-picture" style="background-image:url({{obj.Thumbnail}});">',
                    '<div ng-if="!obj.Thumbnail" class="picture-frame-picture" style="background-image:url(../assets/cpage/images/icons/audio-bg.png);">',
                        '<div class="audio-player-wrapper">',
                        '</div>',
                        '<div class="audio-overlay"></div>',
                    '</div>',
                '</div>',
            '</div>',
            '<!--audio-box End-->'
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------audioWidget--------" , scope.obj);
        }
    }
}]);

collabmedia.compileProvider.directive('questAnswerWidgetBck', ["$compile" , function($compile){
    var linker = function(scope, element, attrs) {
        console.log("--------textWidget--------" , scope.textWidgetObj);
    }
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!-- QUESTION/ANSWER WIDGET  -->',
            '<!--<div class="question-answer-box" title="block block-text" style=" left:112px; top:20px; width:800px; position:absolute; display:block;">-->',
            '<div class="question-answer-box" title="block block-text" style="z-index:{{obj.Z}};left:{{obj.X}}px;top:{{obj.Y}}px;width:{{obj.W}}px;height:{{obj.H+38}}px;position:absolute;display:block" xpos="obj.X" ypos="obj.Y" wval="obj.W" hval="obj.H" draggable resizable >',
                '<!-- Text toolbar -->',
                '<div class="text-toolbar">',
                    '<div class="f-left">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a href="Javascript:void(0);" class="brandon-bold count dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara">{{obj.SrNo}}</a></div>',
                        '<!--<div class="icon-box"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a></div>-->',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a set-animation obj="obj" cpbuilder="cpbuilder" href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a>',
                        '<div class="transition-effect-box" style="z-index:{{9999+obj.SrNo}};">',
                            '<ul>',
                                '<li ng-click="obj.Animation=',"'blind'",'"><a href="javascript:void(0);">Blind</a></li>',
                                '<li ng-click="obj.Animation=',"'bounce'",'"><a href="javascript:void(0);">Bounce</a></li>',
                                '<li ng-click="obj.Animation=',"'clip'",'"><a href="javascript:void(0);">Clip</a></li>',
                                '<li ng-click="obj.Animation=',"'drop'",'"><a href="javascript:void(0);">Drop</a></li>',
                                '<li ng-click="obj.Animation=',"'fade'",'"><a href="javascript:void(0);">Fade</a></li>',
                                '<li ng-click="obj.Animation=',"'fold'",'"><a href="javascript:void(0);">Fold</a></li>',
                                '<li ng-click="obj.Animation=',"'scale'",'"><a href="javascript:void(0);">Scale</a></li>',
                                '<li ng-click="obj.Animation=',"'highlight'",'"><a href="javascript:void(0);">Highlight</a></li>',
                                '<li ng-click="obj.Animation=',"'puff'",'"><a href="javascript:void(0);">Puff</a></li>',
                                '<li ng-click="obj.Animation=',"'slide'",'"><a href="javascript:void(0);">Slide</a></li>',
                                '<li ng-click="obj.Animation=',"'shake'",'"><a href="javascript:void(0);">Shake</a></li>',
                                //'<li ng-click="obj.Animation=',"'transfer'",'"><a href="javascript:void(0);">Transfer</a></li>',
                                '<li ng-click="obj.Animation=',"'explode'",'"><a href="javascript:void(0);">Explode</a></li>',
                            '</ul>',
                        '</div>',
                        '</div>',
                    '</div>',
                    '<div class="f-right">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a" ng-click="cpbuilder.removeWidget(obj)"><a href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara" id="question-answer-box-close"><img src="../assets/cpage/images/icons/cross-icon.png" alt="cross" /></a></div>',
                    '</div>',
                '</div>',
                '<!-- /Text toolbar -->',
                '<!-- -->',
                '<div class="box border" style="height:438px; z-index:99; width:100%;">',
                    '<div class="drag-resize-option">',
                        '<a href="javascript:void(0)" class="drag-option"><img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /></a>',
                        '<a href="javascript:void(0)" class="resize-option"><img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /></a>',
                    '</div>',
                    '<!--CONTENT -->',
                    '<div style="position:absolute; left:83px; top:15px; width:632px;">',
                        '<!-- QUESTION -->',
                        '<div style="z-index:99; position:absolute; top:0; width:100%;">',
                            '<!-- Text toolbar -->',
                            '<div class="text-toolbar text-toolbar-h ">',
                                '<div class="f-right">',
                                    '<div class="icon-box"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/edit-icon.png" alt="edit" /></a></div>',
                                '</div>',
                            '</div>',
                            '<!-- /Text toolbar -->',
                            '<div class="box border edit-ques-bg" style="height:70px; z-index:99; width:100%; top:35px;" >',
                                '<div class="drag-resize-option">',
                                    '<a href="javascript:void(0)" class="drag-option">',
                                        '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                    '</a>',
                                    '<a href="javascript:void(0)" class="resize-option">',
                                        '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                    '</a>',
                                '</div>',
                                '<div class="text-box-bg"></div>',
                                '<div class="content-frame" style="z-index:100;">',
                                    '<div class="text-view brandon-bold" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
                                        '<div class="text-view-spacing text-view-spacing-2">',
                                            '<p class="shadow" style="font-size:28px; line-height:60px; letter-spacing:1px;">What is Lorem ipsum dolor sit amet?</p>',
                                       '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- QUESTION END -->',
                        '<!-- ANSWWER -->',
                        '<div class="box border" style="height:52px; z-index:99; width:100%; top:129px;" >',
                            '<div class="drag-resize-option">',
                                '<a href="javascript:void(0)" class="drag-option">',
                                    '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                '</a>',
                                '<a href="javascript:void(0)" class="resize-option">',
                                    '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                '</a>',
                            '</div>',
                            '<div class="text-box-bg"></div>',
                            '<div class="content-frame" style="z-index:100;">',
                                    '<div class="text-view brandon-medium" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
                                    '<div class="text-view-spacing text-view-spacing-2">',
                                        '<p class="shadow" style="font-size:20px; line-height:40px; letter-spacing:1px;">Answer Line</p>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- ANSWWER END -->',
                        '<!-- MEDIA -->',
                        '<div style="z-index:99; position:absolute; top:220px; width:100%;">',
                            '<!-- Text toolbar -->',
                            '<div class="text-toolbar">',
                                '<div class="f-right">',
                                    '<div class="icon-box" id="edit-add-media"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/edit-icon.png" alt="edit" /></a></div>',
                                '</div>',
                            '</div>',
                            '<!-- /Text toolbar -->',
                            '<div class="box border" style="height:108px; z-index:99; width:100%; top:35px;" >',
                                '<div class="drag-resize-option">',
                                    '<a href="javascript:void(0)" class="drag-option">',
                                        '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                    '</a>',
                                    '<a href="javascript:void(0)" class="resize-option">',
                                        '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                    '</a>',
                                '</div>',
                                '<div class="text-box-bg"></div>',
                                '<div class="content-frame" style="z-index:100;">',
                                    '<div class="text-view brandon-bold" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
                                            '<div class="add-media-link">',
                                            '<a href="javascript:void(0)" class="add-media-text dark-bg">ADD MEDIA</a>',
                                        '</div>',
                                        '<div class="add-media-box" style="display:none;">',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:41px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/www-icon.png" alt="www" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:164px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/dot-box-icon.png" alt="dot-box-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:287px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                        '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                        '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/upload-icon.png" alt="upload-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:409px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/camera-icon.png" alt="camera-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!--  -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:532px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/emmbed-icon.png" alt="emmbed-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- /MEDIA END -->',
                    '</div>',
                    '<!-- /CONTENT -->',
                '</div>',
                '<!-- -->',
            '</div>',
            '<!-- QUESTION/ANSWER WIDGET END -->',
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------audioWidget--------" , scope.obj);
        }
    }
}]);

collabmedia.compileProvider.directive('questAnswerWidget', ["$compile" , function($compile){
    var linker = function(scope, element, attrs) {
        console.log("--------textWidget--------" , scope.textWidgetObj);
    }
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!-- QUESTION/ANSWER WIDGET  -->',
            '<!--<div class="question-answer-box" title="block block-text" style=" left:112px; top:20px; width:800px; position:absolute; display:block;">-->',
            '<div class="question-answer-box" title="block block-text" style="z-index:{{obj.Z}};left:{{obj.X}}px;top:{{obj.Y}}px;width:{{obj.W}}px;height:{{obj.H+38}}px;position:absolute;display:block" xpos="obj.X" ypos="obj.Y" wval="obj.W" hval="obj.H" draggable resizable >',
                '<!-- Text toolbar -->',
                '<div class="text-toolbar">',
                    '<div class="f-left">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a href="Javascript:void(0);" class="brandon-bold count dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara">{{obj.SrNo}}</a></div>',
                        '<!--<div class="icon-box"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a></div>-->',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a set-animation obj="obj" cpbuilder="cpbuilder" href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a>',
                        '<div class="transition-effect-box" style="z-index:{{9999+obj.SrNo}};">',
                            '<ul>',
                                '<li ng-click="obj.Animation=',"'blind'",'"><a href="javascript:void(0);">Blind</a></li>',
                                '<li ng-click="obj.Animation=',"'bounce'",'"><a href="javascript:void(0);">Bounce</a></li>',
                                '<li ng-click="obj.Animation=',"'clip'",'"><a href="javascript:void(0);">Clip</a></li>',
                                '<li ng-click="obj.Animation=',"'drop'",'"><a href="javascript:void(0);">Drop</a></li>',
                                '<li ng-click="obj.Animation=',"'fade'",'"><a href="javascript:void(0);">Fade</a></li>',
                                '<li ng-click="obj.Animation=',"'fold'",'"><a href="javascript:void(0);">Fold</a></li>',
                                '<li ng-click="obj.Animation=',"'scale'",'"><a href="javascript:void(0);">Scale</a></li>',
                                '<li ng-click="obj.Animation=',"'highlight'",'"><a href="javascript:void(0);">Highlight</a></li>',
                                '<li ng-click="obj.Animation=',"'puff'",'"><a href="javascript:void(0);">Puff</a></li>',
                                '<li ng-click="obj.Animation=',"'slide'",'"><a href="javascript:void(0);">Slide</a></li>',
                                '<li ng-click="obj.Animation=',"'shake'",'"><a href="javascript:void(0);">Shake</a></li>',
                                //'<li ng-click="obj.Animation=',"'transfer'",'"><a href="javascript:void(0);">Transfer</a></li>',
                                '<li ng-click="obj.Animation=',"'explode'",'"><a href="javascript:void(0);">Explode</a></li>',
                            '</ul>',
                        '</div>',
                        '</div>',
                    '</div>',
                    '<div class="f-right">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a" ng-click="cpbuilder.removeWidget(obj)"><a href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara" id="question-answer-box-close"><img src="../assets/cpage/images/icons/cross-icon.png" alt="cross" /></a></div>',
                    '</div>',
                '</div>',
                '<!-- /Text toolbar -->',
                '<!-- -->',
                '<div class="box border" style="height:100%; z-index:99; width:100%;">',
                    '<div class="drag-resize-option">',
                        '<a href="javascript:void(0)" class="drag-option"><img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /></a>',
                        '<a href="javascript:void(0)" class="resize-option"><img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /></a>',
                    '</div>',
                    '<!--CONTENT -->',
                    '<div style="position:absolute; left:83px; top:15px; width:632px;">',
                        '<!-- QUESTION -->',
                        '<div style="z-index:99; position:absolute; top:0; width:100%;">',
                            '<!-- Text toolbar -->',
                            '<div class="text-toolbar text-toolbar-h ">',
                                '<div class="f-right">',
                                    '<div class="icon-box"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/edit-icon.png" alt="edit" /></a></div>',
                                '</div>',
                            '</div>',
                            '<!-- /Text toolbar -->',
                            '<div class="box border edit-ques-bg" style="height:70px; z-index:99; width:100%; top:35px;" >',
                                '<div class="drag-resize-option">',
                                    '<a href="javascript:void(0)" class="drag-option">',
                                        '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                    '</a>',
                                    '<a href="javascript:void(0)" class="resize-option">',
                                        '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                    '</a>',
                                '</div>',
                                '<div class="text-box-bg"></div>',
                                '<div class="content-frame" style="z-index:100;">',
                                    '<div class="text-view brandon-bold" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
                                        '<div class="text-view-spacing text-view-spacing-2">',
                                            '<p class="shadow" style="font-size:28px; line-height:60px; letter-spacing:1px;">What is Lorem ipsum dolor sit amet?</p>',
                                       '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- QUESTION END -->',
                        '<!-- ANSWWER -->',
                        '<div class="box border" style="height:52px; z-index:99; width:100%; top:129px;" >',
                            '<div class="drag-resize-option">',
                                '<a href="javascript:void(0)" class="drag-option">',
                                    '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                '</a>',
                                '<a href="javascript:void(0)" class="resize-option">',
                                    '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                '</a>',
                            '</div>',
                            '<div class="text-box-bg"></div>',
                            '<div class="content-frame" style="z-index:100;">',
                                    '<div class="text-view brandon-medium" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
                                    '<div class="text-view-spacing text-view-spacing-2">',
                                        '<p class="shadow" style="font-size:20px; line-height:40px; letter-spacing:1px;">Answer Line</p>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- ANSWWER END -->',
                        '<!-- MEDIA -->',
                        '<div style="z-index:99; position:absolute; top:220px; width:100%;">',
                            '<!-- Text toolbar -->',
                            '<div class="text-toolbar">',
                                '<div class="f-right">',
                                    '<div class="icon-box" id="edit-add-media"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/edit-icon.png" alt="edit" /></a></div>',
                                '</div>',
                            '</div>',
                            '<!-- /Text toolbar -->',
                            '<div class="box border" style="height:108px; z-index:99; width:100%; top:35px;" >',
                                '<div class="drag-resize-option">',
                                    '<a href="javascript:void(0)" style="z-index:999999;" class="drag-option">',
                                        '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                    '</a>',
                                    '<a href="javascript:void(0)" class="resize-option">',
                                        '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                    '</a>',
                                '</div>',
                                '<div class="text-box-bg"></div>',
                                '<div class="content-frame" style="z-index:100;">',
                                    '<div class="text-view brandon-bold" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
                                            '<div class="add-media-link">',
                                            '<a href="javascript:void(0)" class="add-media-text dark-bg">ADD MEDIA</a>',
                                        '</div>',
                                        '<div class="add-media-box" style="display:none;">',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:41px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/www-icon.png" alt="www" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:164px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/dot-box-icon.png" alt="dot-box-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:287px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                        '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                        '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/upload-icon.png" alt="upload-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:409px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/camera-icon.png" alt="camera-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!--  -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:532px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/emmbed-icon.png" alt="emmbed-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- /MEDIA END -->',
                    '</div>',
                    '<!-- /CONTENT -->',
                '</div>',
                '<!-- -->',
            '</div>',
            '<!-- QUESTION/ANSWER WIDGET END -->',
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------audioWidget--------" , scope.obj);
        }
    }
}]);
collabmedia.compileProvider.directive('draggable', function () {
    var resizableConfig = {
        handles:"n, e, s, w"
        
    };
    return {
        restrict: 'A',
        scope : {
          xpos:'=',
          ypos:'=',
          wval:'=',
          hval:'='
        },        
        link: function (scope, element, attrs) {
            element.draggable({
                cursor: "move",
                handle:".drag-option",
                start : function(){
                    //element.editable = null;
                },
                stop: function (event, ui) {
                    //event.preventDefault();
                    //event.stopPropagation();

                    scope.xpos = ui.position.left;
                    scope.ypos = ui.position.top;
                    scope.$apply();
                    console.log("scope--------",scope);

                    /*
                    element.editable({
                        initOnClick: true,
                        // Set the file upload URL.
                        placeholder: "",
                        imageUploadURL: "/media/froala_file",
                        buttons: ['blockStyle','fontSize','fontFamily','color','align','sep','insertImage','insertVideo','table','createLink','fullscreen','html']
                    }).attr('data-initialized', true)
                    */

                }
            });
            //element.disableSelection();
            
            element.resizable(resizableConfig);
            /*
            element.on('resizestart', function (event, ui) {
                console.log("resized...",ui);
                scope.wval = ui.size.width;
                scope.hval = ui.size.height;
                //scope.$apply();
                //scope.$digest();
                console.log("scope--------",scope);
                //if (scope.callback) scope.callback();
            });
            */
            element.on('resizestop', function (event, ui) {
                event.preventDefault();
                //event.stopPropagation();
                console.log("resized...",ui);
                scope.wval = ui.size.width;
                scope.hval = ui.size.height;
                scope.$apply();
                //console.log("scope--------",scope);
                //if (scope.callback) scope.callback();
            });
            
        }
    };
});

collabmedia.compileProvider.directive('contenteditable', ['$sce','$timeout', function($sce,$timeout) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    scope:{
      obj:'='  
    },
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        //console.log("on render -------",$sce.getTrustedHtml(ngModel.$viewValue || ''));  
        //element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
        //$('.selector').froalaEditor('html.get', true);
        //element.html(ngModel.$viewValue || '');
        element.editable('setHTML', ngModel.$viewValue, false);
        //var html = element.editable('setHTML', true, true);//element.html();
      };
      
      //element.on('mouseenter',function(){
          //element.focus();
        //  element.trigger('click');
      //})
      
      // Listen for change events to enable binding
      element.on('blur', function() {
          //console.log("on blur keyup change -------",read); 
          scope.$evalAsync(read);
      });
      
      //$timeout(function(){
        element.editable({
            initOnClick: true,
            // Set the file upload URL.
            placeholder: "",
            imageUploadURL: "/media/froala_file",
            buttons: ['blockStyle','fontSize','fontFamily','color','align','sep','insertImage','insertVideo','table','createLink','fullscreen','html']
        }).attr('data-initialized', true)
        //read(); // initialize   
        element.editable('setHTML', ngModel.$viewValue || '', false);
      //},1000);

      
      // Write data to the model
      function read() {
        //element.editable('setHTML', scope.obj.Data, false);
        var html = element.editable('getHTML', true, true);//element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        //if ( attrs.stripBr && html == '<br>' ) {
          //html = '';
        //}
        ngModel.$setViewValue(html);
        console.log("html value ==========",html);
      }
    }
  };
}]);

//End Workshop-------------------------------------------------------------------

//Showroom : defining dynamic widget templates-----------------------------------
//text widget
collabmedia.compileProvider.directive('showroomTextWidget', ["$sce" , function($sce){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!--text-box Start-->',
            '<div class="text-box" title="block block-text" style="z-index:{{obj.Z}};left:{{obj.X}}px; top:{{obj.Y}}px; width:{{obj.W}}px;height:{{obj.H+38}}px;position:absolute;display:block">',
            '<!-- Text toolbar -->',
            '<div class="text-toolbar" style="height:38px;">',
                
            '</div>',
            '<!-- /Text toolbar -->',
            '<div class="box text-box-edit" style="height:{{obj.H}}px;position:absolute;top:38px;border:1px solid transparent;">',
                '<div contenteditable="false" ng-model="obj.Data" class="content-frame" style="color:#000;width:{{obj.W}}px;height:{{obj.H}}px;">',
                '</div>',
            '</div>',
            '</div>',
            '<!--text-box End-->',

        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------Showroom--------------textWidget--------" , scope.obj);
            /*setTimeout(function(){
                wow.init();
            },1000)*/
        }
    }
}]);

collabmedia.compileProvider.directive('showroomImageWidget', ["$sce" , function($sce){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!--picture-box Start-->',
            '<div class="picture-widget-center" style="width:{{obj.W}}px;height:{{obj.H}}px;left:{{obj.X}}px;top:{{obj.Y}}px;z-index:{{obj.Z}};">',
                '<!-- Text toolbar -->',
                '<div class="text-toolbar">',
                '</div>',
                '<!-- /Text toolbar -->',
                '<div class="box border" style="width:100%;height:{{obj.H}}px;top:38px; position:absolute">',
                    //'<div class="picture-frame-picture" style="background-image:url(../assets/cpage/images/icons/picture.png); style="z-index:{{obj.Z+1}};"">',
                    '<div class="picture-frame-picture" style="background-image:url({{obj.Data}});">',
                    '</div>',
                '</div>',
            '</div>',
            '<!--picture-box End-->',
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------showroomImageWidget--------" , scope.obj);
            /*setTimeout(function(){
                wow.init();
            },1000)*/
        }
    }
        
}]);

collabmedia.compileProvider.directive('showroomVideoWidget', ["$sce","$timeout" , function($sce,$timeout){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!--video-box Start-->',
            '<div class="video-widget-center" style="width:{{obj.W}}px;height:{{obj.H}}px;left:{{obj.X}}px;top:{{obj.Y}}px;z-index:{{obj.Z}};">',
                '<!-- Text toolbar -->',
                '<div class="text-toolbar">',
                '</div>',
                '<!-- /Text toolbar -->',
                '<!-- -->',
                '<div class="box border" style="width:100%;height:{{obj.H}}px;top:38px;position:absolute">',
                    '<div ng-if="obj.Thumbnail" set-trusted-data obj="obj" class="picture-frame-picture picture-bg" style="background-image:url({{obj.Thumbnail}});">',
                        //'<div style="width:100%;height:{{obj.H}}px; position: absolute;"></div>',
                    '</div>',
                    '<div ng-if="!obj.Thumbnail" set-trusted-data obj="obj" class="picture-frame-picture picture-bg" style="background-image:url(../assets/cpage/images/icons/video-bg.png);">',
                        //'<div style="width:100%;height:{{obj.H}}px; position: absolute;"></div>',
                    '</div>',
                '</div>',
            '</div>',
            '<!--video-box End-->'
        ].join(""),
        link: function(scope, element, attrs) {
            //console.log("--------showroomVideoWidget--------" , scope.obj);
            //console.log("--------obj.Data--------" , scope.obj.Data);
            /*setTimeout(function(){
                wow.init();
            },1000)*/
        }
    }
        
}]);

collabmedia.compileProvider.directive('showroomAudioWidget', ["$sce" , function($sce){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!--audio-box Start-->',
            '<div class="audio-widget-center" style="width:{{obj.W}}px;height:{{obj.H}}px;left:{{obj.X}}px;top:{{obj.Y}}px;z-index:{{obj.Z}};">',
                '<!-- Text toolbar -->',
                '<div class="text-toolbar">',
                '</div>',
                '<!-- /Text toolbar -->',
                '<!-- -->',
                '<div class="box border" style="width:100%;height:{{obj.H}}px;top:38px;position:absolute">',
                    '<div ng-if="obj.Thumbnail" class="picture-frame-picture" style="background-image:url({{obj.Thumbnail}});">',
                        '<div class="audio-player-wrapper" set-trusted-data obj="obj">',
                            '<!--<iframe width="100%" height="100%" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F239793212&amp;auto_play=false&amp;buying=true&amp;liking=true&amp;download=true&amp;sharing=true&amp;show_artwork=true&amp;show_comments=false&amp;show_playcount=true&amp;color=ff5100&amp;auto_advance=true&amp;show_user=true&amp;visual=true" scrolling="no" class="common-audio-player standard" style="opacity: 1;"></iframe>-->',
                        '</div>',
                    '</div>',
                    '<div ng-if="!obj.Thumbnail" class="picture-frame-picture" style="background-image:url(../assets/cpage/images/icons/audio-bg.png);">',
                        '<div class="audio-player-wrapper" set-trusted-data obj="obj">',
                            '<!--<iframe width="100%" height="100%" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F239793212&amp;auto_play=false&amp;buying=true&amp;liking=true&amp;download=true&amp;sharing=true&amp;show_artwork=true&amp;show_comments=false&amp;show_playcount=true&amp;color=ff5100&amp;auto_advance=true&amp;show_user=true&amp;visual=true" scrolling="no" class="common-audio-player standard" style="opacity: 1;"></iframe>-->',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<!--audio-box End-->',
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------showroomAudioWidget--------" , scope.obj);
            //scope.trustedData = $sce.trustAsHtml(scope.obj.Data);                  //important point otherwise iframe will not work.
            /*
            setTimeout(function(){
                wow.init();
            },1000)
            */
        }
    }
}]);

collabmedia.compileProvider.directive('showroomQuestAnswerWidget', ["$compile" , function($compile){
    return {
        //restrict : 'EA',
        scope : {
            obj:'=',
            cpbuilder:'='
        },
        template: [
            '<!-- QUESTION/ANSWER WIDGET  -->',
            '<!--<div class="question-answer-box" title="block block-text" style=" left:112px; top:20px; width:800px; position:absolute; display:block;">-->',
            '<div class="question-answer-box" title="block block-text" style="z-index:{{obj.Z}};left:{{obj.X}}px;top:{{obj.Y}}px;width:{{obj.W}}px;height:{{obj.H+38}}px;position:absolute;display:block" xpos="obj.X" ypos="obj.Y" wval="obj.W" hval="obj.H" draggable resizable >',
                '<!-- Text toolbar -->',
                '<div class="text-toolbar">',
                    '<div class="f-left">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a href="Javascript:void(0);" class="brandon-bold count dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara">{{obj.SrNo}}</a></div>',
                        '<!--<div class="icon-box"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a></div>-->',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a"><a set-animation obj="obj" cpbuilder="cpbuilder" href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara"><img src="../assets/cpage/images/icons/effects.png" alt="effects" /></a>',
                        '<div class="transition-effect-box" style="z-index:{{9999+obj.SrNo}};">',
                            '<ul>',
                                '<li ng-click="obj.Animation=',"'blind'",'"><a href="javascript:void(0);">Blind</a></li>',
                                '<li ng-click="obj.Animation=',"'bounce'",'"><a href="javascript:void(0);">Bounce</a></li>',
                                '<li ng-click="obj.Animation=',"'clip'",'"><a href="javascript:void(0);">Clip</a></li>',
                                '<li ng-click="obj.Animation=',"'drop'",'"><a href="javascript:void(0);">Drop</a></li>',
                                '<li ng-click="obj.Animation=',"'fade'",'"><a href="javascript:void(0);">Fade</a></li>',
                                '<li ng-click="obj.Animation=',"'fold'",'"><a href="javascript:void(0);">Fold</a></li>',
                                '<li ng-click="obj.Animation=',"'scale'",'"><a href="javascript:void(0);">Scale</a></li>',
                                '<li ng-click="obj.Animation=',"'highlight'",'"><a href="javascript:void(0);">Highlight</a></li>',
                                '<li ng-click="obj.Animation=',"'puff'",'"><a href="javascript:void(0);">Puff</a></li>',
                                '<li ng-click="obj.Animation=',"'slide'",'"><a href="javascript:void(0);">Slide</a></li>',
                                '<li ng-click="obj.Animation=',"'shake'",'"><a href="javascript:void(0);">Shake</a></li>',
                                //'<li ng-click="obj.Animation=',"'transfer'",'"><a href="javascript:void(0);">Transfer</a></li>',
                                '<li ng-click="obj.Animation=',"'explode'",'"><a href="javascript:void(0);">Explode</a></li>',
                            '</ul>',
                        '</div>',
                        '</div>',
                    '</div>',
                    '<div class="f-right">',
                        '<div class="icon-box hi-icon-wrap hi-icon-effect-1 hi-icon-effect-1a" ng-click="cpbuilder.removeWidget(obj)"><a href="Javascript:void(0);" class="dark-bg hi-icon hi-icon-mobile cbutton cbutton--effect-tamara" id="question-answer-box-close"><img src="../assets/cpage/images/icons/cross-icon.png" alt="cross" /></a></div>',
                    '</div>',
                '</div>',
                '<!-- /Text toolbar -->',
                '<!-- -->',
                '<div class="box border" style="height:100%; z-index:99; width:100%;">',
                    '<div class="drag-resize-option">',
                        '<a href="javascript:void(0)" class="drag-option"><img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /></a>',
                        '<a href="javascript:void(0)" class="resize-option"><img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /></a>',
                    '</div>',
                    '<!--CONTENT -->',
                    '<div style="position:absolute; left:83px; top:15px; width:632px;">',
                        '<!-- QUESTION -->',
                        '<div style="z-index:99; position:absolute; top:0; width:100%;">',
                            '<!-- Text toolbar -->',
                            '<div class="text-toolbar text-toolbar-h ">',
                                '<div class="f-right">',
                                    '<div class="icon-box"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/edit-icon.png" alt="edit" /></a></div>',
                                '</div>',
                            '</div>',
                            '<!-- /Text toolbar -->',
                            '<div class="box border edit-ques-bg" style="height:70px; z-index:99; width:100%; top:35px;" >',
                                '<div class="drag-resize-option">',
                                    '<a href="javascript:void(0)" class="drag-option">',
                                        '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                    '</a>',
                                    '<a href="javascript:void(0)" class="resize-option">',
                                        '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                    '</a>',
                                '</div>',
                                '<div class="text-box-bg"></div>',
                                '<div class="content-frame" style="z-index:100;">',
                                    '<div class="text-view brandon-bold" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
                                        '<div class="text-view-spacing text-view-spacing-2">',
                                            '<p class="shadow" style="font-size:28px; line-height:60px; letter-spacing:1px;">What is Lorem ipsum dolor sit amet?</p>',
                                       '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- QUESTION END -->',
                        '<!-- ANSWWER -->',
                        '<div class="box border" style="height:52px; z-index:99; width:100%; top:129px;" >',
                            '<div class="drag-resize-option">',
                                '<a href="javascript:void(0)" class="drag-option">',
                                    '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                '</a>',
                                '<a href="javascript:void(0)" class="resize-option">',
                                    '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                '</a>',
                            '</div>',
                            '<div class="text-box-bg"></div>',
                            '<div class="content-frame" style="z-index:100; overflow:visible;">',
								'<div class="text-view brandon-medium" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
                                    '<div class="text-view-spacing text-view-spacing-2">',
                                        '<!--<p class="shadow" style="font-size:20px; line-height:40px; letter-spacing:1px;">Answer Line</p>-->',
										'<div scrollable contenteditable="true" class="editable-box" ng-enter="cpbuilder.setSelectGallery(',"'WidgetBgVideo','step_1'",')">Answer Line</div>',
										'<!-- <textarea placeholder="Answer Line" class="chapter-input">Answer Line</textarea> -->',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- ANSWWER END -->',
                        '<!-- MEDIA -->',
                        '<div style="z-index:99; position:absolute; top:220px; width:100%;">',
                            '<!-- Text toolbar -->',
                            '<div class="text-toolbar">',
                                '<div class="f-right">',
                                    '<div class="icon-box" id="edit-add-media"><a href="Javascript:void(0);" class="dark-bg"><img src="../assets/cpage/images/icons/edit-icon.png" alt="edit" /></a></div>',
                                '</div>',
                            '</div>',
                            '<!-- /Text toolbar -->',
                            '<div class="box border" style="height:108px; z-index:99; width:100%; top:35px;" >',
                                '<div class="drag-resize-option">',
                                    '<a href="javascript:void(0)" class="drag-option">',
                                        '<img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" />',
                                    '</a>',
                                    '<a href="javascript:void(0)" class="resize-option">',
                                        '<img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" />',
                                    '</a>',
                                '</div>',
                                '<div class="text-box-bg"></div>',
                                '<div class="content-frame" style="z-index:100;">',
                                    '<div class="text-view brandon-bold" style=" -moz-column-count: auto; -moz-column-gap: 16px;">',
										'<div ng-click="cpbuilder.setSelectGallery(',"'WidgetBgVideo','test'",')" class="add-media-link">',
                                            '<a href="javascript:void(0)" class="add-media-text dark-bg">ADD MEDIA</a>',
                                        '</div>',
                                        '<div class="add-media-box" style="display:none;">',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:41px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/www-icon.png" alt="www" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:164px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/dot-box-icon.png" alt="dot-box-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:287px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                        '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                        '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/upload-icon.png" alt="upload-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!-- -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:409px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/camera-icon.png" alt="camera-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<!--  -->',
                                            '<div class="box border" style="height:64px; z-index:99; width:64px; top:21px; left:532px;" >',
                                                '<div class="drag-resize-option">',
                                                    '<a href="javascript:void(0)" class="drag-option"> <img src="../assets/cpage/images/icons/drag-icon.png" alt="drag" /> </a>',
                                                    '<a href="javascript:void(0)" class="resize-option"> <img src="../assets/cpage/images/icons/resize-icon.png" alt="resize" /> </a>',
                                                '</div>',
                                                '<div class="content-frame" style="z-index:100; overflow:visible;">',
                                                    '<div class="text-view" style="-moz-column-count:auto; -moz-column-gap:16px;">',
                                                            '<a href="javascript:void(0)" class="round-media-close darg-bg"><img src="../assets/cpage/images/icons/cross-icon-s.png" alt="close" /></a>',
                                                            '<a href="javascript:void(0)" class="round-media-box darg-bg"><img src="../assets/cpage/images/icons/emmbed-icon.png" alt="emmbed-icon" /></a>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<!-- /MEDIA END -->',
                    '</div>',
                    '<!-- /CONTENT -->',
                '</div>',
                '<!-- -->',
            '</div>',
            '<!-- QUESTION/ANSWER WIDGET END -->',
        ].join(""),
        link: function(scope, element, attrs) {
            console.log("--------showroomQuestAnswerWidget--------" , scope.obj);
        }
    }
}]);

collabmedia.compileProvider.directive('ngEnter', [function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
}]);

collabmedia.compileProvider.directive('autoCompleteTagsPreview', function($timeout,$http) {
    return function(scope, iElement, iAttrs) {                        
		iElement.autocomplete({
			source: function(request,response){
			  
				//console.log(request);
				scope.groupt = [];
				scope.keywordList = [];
				
				console.log("keywordsSelcted",scope.ContentPageBuilder.keywordsSelcted);
				scope.remove = function(keyword){
				      scope.keywordsSelcted.splice(keyword,1);
				      scope.groupt.splice(0, keyword);
				}
		
				$http.post('/pages/getallKeywords',{startsWith:request.term}).then(function(data,status,headers,config){
					if (data.data.code==200){
						scope.gts=data.data.response;
						for(i in scope.gts){
							//scope.groupta.push({"id":scope.gts[i]._id,"title":scope.gts[i].GroupTagTitle})
							scope.groupt.push({"value":scope.gts[i]._id,"label":scope.gts[i].GroupTagTitle})
							for(j in scope.gts[i].Tags){
									scope.keywordList.push({"value":scope.gts[i]._id,"label":scope.gts[i].Tags[j].TagTitle,"description":scope.gts[i].GroupTagTitle})    
							}
						}
						//if (scope.keywordsSelcted) {
						//	angular.forEach(scope.groupt, function(value, key) {
						//		console.log("--------------------------",value)
						//		angular.forEach(scope.keywordsSelcted, function(selected, key1) {
						//			console.log("value----------->", value.value);
						//			console.log("Seelet----------->", selected.id);
						//			if(value.value == selected.id) {
						//				scope.groupt.splice(key, 1);
						//				console.log("Working")
						//			}
						//		});
						//		
						//	});
						//}
						response(scope.groupt);
					}
				})
				
			},
			select:function (event, ui) {                    
				scope.current__gt = ui.item.label;
				scope.current__gtID = ui.item.value;
				scope.selectedgt = ui.item.value;
			
				scope.ContentPageBuilder.keywordsSelcted.push({title:ui.item.label,id:ui.item.value,from:'dropDown'});
				
				scope.$apply();
				//iElement.val('');
				return false;
			},
			focus:function (event, ui) {    
				return false;
			}                   
		})
		.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
			var flag = false;
			
			if (flag) {
			 return $("<li>")
				  .data("item.autocomplete", item)
				  .remove();	
			}else{
				return $("<li>")
				  .data("item.autocomplete", item)
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
//combining