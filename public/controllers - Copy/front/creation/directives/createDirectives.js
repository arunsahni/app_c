var collabmedia = angular.module('collabmedia');


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