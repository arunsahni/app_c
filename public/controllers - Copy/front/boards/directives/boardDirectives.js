var collabmedia = angular.module('collabmedia');
//commented and edited by parul 25 dec
//collabmedia.compileProvider.directive('demoinputlocal', function($timeout, $http) {
//  return {
//    link: function (scope, element, attrs) {
//
//        $http.get('/fsg/view').then(function (data){
//            if (data.data.code==200) {
//               var myArr = new Array();
//               for(var i=0; i< data.data.response.length; i++) {
//                    if (data.data.response[i].Title == "Country of Affiliation") {
//                        myArr = data.data.response[i];
//                    }
//               }
//               var newArr = new Array();
//               newArr = myArr.Values;
//               var aNewArr = new Array();
//                for(var i=0; i< newArr.length; i++) {
//                  aNewArr.push({id: newArr[i]._id, name: newArr[i].valueTitle});
//                }
//               element.tokenInput(aNewArr, {excludeCurrent: true});
//            }
//        })
//    }
//  }    
//});

collabmedia.compileProvider.directive('demoinputlocal', function($timeout, $http) {
  return {
    link: function (scope, element, attrs) {

        $http.get('/fsg/view').then(function (data){
            if (data.data.code==200) {
			  //alert(1)
			$http.get('/user/chklogin')
			.success(function (data1, status, headers, config) {				
				if (data1.code=="200"){
				  //alert(2);
				  //console.log(data);
					userInfo = data1.usersession;
					//for (i in data.data.response) {
					//  for (x in userInfo.FSGsArr){
					//	  if (data.data.response[i].Title=="Country of Affiliation") {
					//		  if (userInfo.FSGsArr[x].keyval==data.data.response[i].Title) {
					//			  for (j in data.data.response[i].Values ){
					//				  for(y in userInfo.FSGsArr[x].values){
					//					  if (data.data.response[i].Values[j].valueTitle==userInfo.FSGsArr[x].values[y]) {
					//						  //$('#'+data.data.response[i].Values[j]._id).prop('checked',true);
					//						  var abc={id:data.data.response[i].Values[j]._id,name:data.data.response[i].Values[j].valueTitle};
					//						  currentCountries.push(abc);
					//					  }
					//				  }
					//			  }
					//		  }
					//	  }
					//    }
					//}
					for (i in data.data.response) {
					  for (x in userInfo.FSGsArr2){
						  if (data.data.response[i].Title=="Country of Affiliation") {
							  if (x==data.data.response[i].Title) {
								  for (j in data.data.response[i].Values ){
									  var fsgsArrVal = '';
									  fsgsArrVal = (userInfo.FSGsArr2[x]).split(',');
									  for(y in fsgsArrVal){
										 // console.log("val = ",data.data.response[i].Values[j].valueTitle+"=="+fsgsArrVal[y]);
										  if (data.data.response[i].Values[j].valueTitle==fsgsArrVal[y]) {
											  //$('#'+data.data.response[i].Values[j]._id).prop('checked',true);
											  var abc={id:data.data.response[i].Values[j]._id,name:data.data.response[i].Values[j].valueTitle};
											  currentCountries.push(abc);
										  }
									  }
								  }
							  }
						  }
					    }
					}
					//alert('clearconsole');
					//console.log(currentCountries);
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
					  prePopulate: currentCountries});
					 
					 
				}else{
					userInfo = {};
				}
			});	
			  var currentCountries=[];
			//  for (x in userInfo.FSGsArr){
			//		if (userInfo.FSGsArr[x].keyval=="Country of Affiliation") {
			//		  for(a in userInfo.FSGsArr[x].)
			//		}
			//	}
			//for (i in data.data.response) {
			//	for (x in userInfo.FSGsArr){
			//		if (data.data.response[i].Title=="Country of Affiliation") {
			//			if (userInfo.FSGsArr[x].keyval==data.data.response[i].Title) {
			//				for (j in data.data.response[i].Values ){
			//					for(y in userInfo.FSGsArr[x].values){
			//						if (data.data.response[i].Values[j].valueTitle==userInfo.FSGsArr[x].values[y]) {
			//							//$('#'+data.data.response[i].Values[j]._id).prop('checked',true);
			//							var abc={id:data.data.response[i].values[j]._id,name:data.data.response[i].Values[j].valueTitle};
			//							currentCountries.push(abc);
			//						}
			//					}
			//				}
			//			}
			//		}
			//	}
			//}
//			  alert('clearconsole');
//			  console.log(currentCountries);
//               var myArr = new Array();
//               for(var i=0; i< data.data.response.length; i++) {
//                    if (data.data.response[i].Title == "Country of Affiliation") {
//                        myArr = data.data.response[i];
//                    }
//               }
//               var newArr = new Array();
//               newArr = myArr.Values;
//               var aNewArr = new Array();
//                for(var i=0; i< newArr.length; i++) {
//                  aNewArr.push({id: newArr[i]._id, name: newArr[i].valueTitle});
//                }
//               element.tokenInput(aNewArr, {excludeCurrent: true,
//				prePopulate: currentCountries});
            }
        })
    }
  }    
});
//directive added by parul 26 dec
collabmedia.compileProvider.directive('tagInputToken', function($timeout, $http,$interval) {
  return {
    link: function (scope, element, attrs) {
		var selGT,
		  timeoutId;
		//alert("selected gt = "+scope.selectedgt);
		function update(){
		  var sendData={};
		  if (selGT) {
			sendData.id=selGT;
			$http.post('/tags/view',sendData).then(function (data){
		  console.log(data);
		  console.log('data');
            if (data.data.code==200) {
              var myArr = [];
				for(i in data.data.response){
				  if (myArr.length!=0) {
					var copy=false;
					for (k in myArr) {
					  if (myArr[k].name==data.data.response[i].TagTitle) {
						copy=true;
					  }
					}
					if (copy==false) {
					var tagdata={
					  id:data.data.response[i]._id,
					  name:data.data.response[i].TagTitle
					}
					  myArr.push(tagdata)
					}
				  }else{
					var tagdata={
					  id:data.data.response[i]._id,
					  name:data.data.response[i].TagTitle
					}
					myArr.push(tagdata)
				  }
				}
			   
               //var newArr = new Array();
               //newArr = myArr.Values;
               //var aNewArr = new Array();
               // for(var i=0; i< newArr.length; i++) {
               //   aNewArr.push({id: newArr[i]._id, name: newArr[i].valueTitle});
               // }
			   console.log('myarr');
			   console.log(myArr);
			   //alert('here')
               element.tokenInput(myArr, {excludeCurrent: true,theme: "facebook"});
            }
        })
		  }
		  
		  
		}
		scope.$watch(attrs.tagInputToken, function(value) {
		  selGT = value;
		  update();
		});
	
		element.on('$destroy', function() {
		  $interval.cancel(timeoutId);
		});
	
		// start the UI update process; save the timeoutId for canceling
		timeoutId = $interval(function() {
		  update(); // update DOM
		}, 1000000);
        
    }
  }    
});

// end


collabmedia.compileProvider.directive('autoCompleteProject', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select:function (event, ui) {
				  //console.log(scope[iAttrs.uiItems]);
                    console.log(ui.item.label)
                    scope.project.project = ui.item.label;
                    scope.project.projectid = ui.item.value;
                    scope.$apply();
                    return false;
                },
                focus:function (event, ui) {
                    scope.project.project = ui.item.label;
                    scope.project.projectid = ui.item.value;
                    scope.$apply();
                    return false;
                },
            });
    };
});

//collabmedia.compileProvider.directive('eatClick', function() {
//  alert(1);
//    return function(scope, element, attrs) {
//        $(element).click(function(event) {
//            event.preventDefault();
//        });
//    }
//});
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


collabmedia.compileProvider.directive("htmleditorRedactor", function() {
  return {
    require: '?ngModel',
    link: function($scope, elem, attrs, controller) {   

      controller.$render = function() {

        elem.redactor({
          keyupCallback: function() {
            $scope.$apply(controller.$setViewValue(elem.getCode()));
          },
          execCommandCallback: function() {
            $scope.$apply(controller.$setViewValue(elem.getCode()));
          }
        });

        //elem.setCode(controller.$viewValue);
      };
    }
  };
});

collabmedia.compileProvider.directive('autoCompleteInvitees', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
        iElement.autocomplete({
            source: scope[iAttrs.uiItems],
            select:function (event, ui) {
				//alert(1)
				//scope.member.name = ui.item.label; commented and modified by parul 09012015
                scope.member.name = ui.item.name;
                scope.member.email = ui.item.email;
                scope.member.relation = ui.item.relation;
                scope.$apply();
				return false;
            },
            focus:function (event, ui) {
			  //alert(2)
				//scope.member.name = ui.item.label; commented and modified by parul 09012015
                scope.member.name = ui.item.name;
                scope.$apply();
                return false;
            },
			click:function (event, ui) {
				//scope.member.name = ui.item.label; commented and modified by parul 09012015
                scope.member.name = ui.item.name;
                scope.member.email = ui.item.email;
                scope.member.relation = ui.item.relation;
                scope.$apply();
				return false;
            }
        });
    };
});

collabmedia.compileProvider.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select:function (event, ui) {
                    
                    console.log(ui.item.label)
                    scope.media.gtsa = ui.item.label;
                    scope.media.gt = ui.item.value;
                    scope.$apply();
                    return false;
                },
                focus:function (event, ui) {
                    scope.media.gtsa = ui.item.label;
                    scope.media.gt = ui.item.value;
                    scope.$apply();
                    return false;
                },
            });
    };
});

/*
collabmedia.compileProvider.directive('dynamicUrl', function () {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attr) {
            element.attr('src', attr.dynamicUrlSrc);
        }
    };
});
*/
//edited by parul 10032015
collabmedia.compileProvider.directive('dynamicUrl', function () {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attr) {
			var whichBrowser = BrowserDetecter.whichBrowser()
			var videoSrc = attr.dynamicUrlSrc;
			var ext = videoSrc.split('.').pop();
			//alert(whichBrowser);
			if (whichBrowser == "FireFox") {
			  if ( ext.toUpperCase() != 'WEBM' ) {
				videoSrc = videoSrc.replace('.'+ext,'.webm');
			  }
			}
			else if (whichBrowser == 'Safari') {
			  if ( ext.toUpperCase() != 'MP4' ) {
				videoSrc = videoSrc.replace('.'+ext,'.mp4');	
			  }
			}
			else{
			  if ( ext.toUpperCase() != 'MP4' ) {
				videoSrc = videoSrc.replace('.'+ext,'.mp4');	
			  }
			}
            element.attr('src', videoSrc);
        }
    };
});

// Use for right click in angularJS
collabmedia.compileProvider.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});
;

collabmedia.compileProvider.directive('autoCompleteLink', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select:function (event, ui) {
                    console.log(ui.item.label)
                    scope.link.gtsa = ui.item.label;
                    scope.link.gt = ui.item.value;
                    scope.$apply();
                    return false;
                },
                focus:function (event, ui) {
                    scope.link.gtsa = ui.item.label;
                    scope.link.gt = ui.item.value;
                    scope.$apply();
                    return false;
                },
            });
    };
});

//added on 16122014
collabmedia.compileProvider.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            console.log('loading directive');
            //$("#"+raw.id).addClass("overflow-style");    
            element.bind('scroll', function () {
                console.log('in scroll of = '+raw.id);
                console.log(raw.scrollTop + raw.offsetHeight);
                console.log(raw.scrollHeight);
                if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
                    scope.$apply(attrs.scrolly);
                }
			});
        }
    };
});

collabmedia.compileProvider.directive('autoCompleteTags', function($timeout) {
    return function(scope, iElement, iAttrs) {                        
		iElement.autocomplete({
			source: scope[iAttrs.uiItems],
			select:function (event, ui) {                    
				scope.search1.tata1 = ui.item.label;
				scope.search1.gt = ui.item.value;
				scope.selectedgt=scope.search1.gt;
				scope.$apply();
				console.log("Now selected gt = ",scope.selectedgt);
				$('a.searchBar').parent().addClass('active');
				$('li.searchBar').removeClass('hidden');
				setTimeout(function(){scope.filterSub('search-by-theme')},1000)
				return false;
			},
			focus:function (event, ui) {                    
				scope.search1.tata1 = ui.item.label;
				scope.search1.gt = ui.item.value;
				scope.selectedgt=scope.search1.gt;		    
				scope.$apply();
				return false;
			}                   
		})
		.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
			//alert(1);
			return $("<li>")
				  .data("item.autocomplete", item)
				  .append("<a>" + item.label + "<span style='color:grey;'> in  <span style='text-transform: uppercase'>" + item.description + "</span></span></a>")
				  .appendTo(ul);
		};
    };
});


/*________________________________________________________________________
	* @Date:      	19 Feb 2015
	* @Method :   	autoCompleteDescriptor
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This Directive is used for populating descriptor auto complete in serach page.
	* @Param:     	1
	* @Return:    	Yes
_________________________________________________________________________
*/
 //BY Parul 19022015

//collabmedia.compileProvider.directive('autoCompleteDescriptor', function($timeout) {
//    return function(scope, iElement, iAttrs) {
//		iElement.autocomplete({
//			source:scope[iAttrs.uiItems],
//			select:function (event, ui) {
//				scope.descSearch = ui.item.label;
//				//scope.search1.tata = ui.item.label;
//				//scope.search1.gt = ui.item.value;
//				//scope.selectedgt=scope.search1.gt;
//				scope.$apply();
//				console.log("Now selected descriptor = ",scope.descSearch);
//				//$('a.searchBar').parent().addClass('active');
//				//$('li.searchBar').removeClass('hidden');
//				//setTimeout(function(){scope.filterSub('search-by-theme')},1000)
//				return false;
//			},
//			focus:function (event, ui) {
//				scope.descSearch = ui.item.label;
//				//scope.search1.tata = ui.item.label;
//				//scope.search1.gt = ui.item.value;
//				//scope.selectedgt=scope.search1.gt;		    
//				scope.$apply();
//				return false;
//			},                   
//		});
//		//.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
//		//	//alert(1);
//		//	return $("<li>")
//		//		  .data("item.autocomplete", item)
//		//		  .append("<a>" + item.label + "<span style='color:grey;'> in  <span style='text-transform: uppercase'>" + item.description + "</span></span></a>")
//		//		  .appendTo(ul);
//		//};
//    };
//});

// End autoCompleteDescriptor



collabmedia.compileProvider.directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        //alert("image onerror event caught & this.src = "+this.src+" / "+iElement.src);
		angular.element(this).attr("src", "/assets/img/404error.png");
		//angular.element(this).attr("src", "http://www.difdesign.com/img/404error.png");
		//angular.element(((this.parent).parent).parent).attr("style", {display:none!important;});
      });
    }
   }
   return fallbackSrc;
});
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

collabmedia.compileProvider.directive('checkFileSize', function() {
  return {
    link: function(scope, elem, attr, ctrl) {
      function bindEvent(element, type, handler) {
        if (element.addEventListener) {
          element.addEventListener(type, handler, false);
        } else {
          element.attachEvent('on' + type, handler);
        }
      }

      bindEvent(elem[0], 'change', function() {
        //alert("file width = "+ this.files[loop].width());
        for(var loop = 0; loop < this.files.length; loop++){
          if(this.files[loop].size == 1440000){
          
            alert('File size is equal to 1200*1200 = 1440000 :' + this.files[0].size);
          }
          else{
            alert('File size is less than 1200*1200 = 1440000 :' + this.files[0].size);
            
          }
          
        }
        
      });
    }
  }
});

// parul 04022015
collabmedia.compileProvider.directive('autoFocus', function() {
  return {
    link: {
      pre: function(scope, element, attr) {
        console.log('prelink executed for');
      },
      post: function(scope, element, attr) {
        console.log('postlink executed');
        element[0].focus();
      }
    }
  }
});


//for static include - will not create a new scope.
collabmedia.compileProvider.directive('includeStatic', function($http, $templateCache, $compile) {
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
        //$compile(contents)($scope.$parent);
		$compile(contents)($scope);
      });
    }
  };
});

//collabmedia.compileProvider.directive( 'compileData', function ( $compile ) {
//  return {
//    scope: true,
//    link: function ( scope, element, attrs ) {
//
//      var elmnt;
//
//      attrs.$observe( 'template', function ( myTemplate ) {
//        if ( angular.isDefined( myTemplate ) ) {
//          // compile the provided template against the current scope
//          elmnt = $compile( myTemplate )( scope );
//
//            element.html(""); // dummy "clear"
//
//          element.append( elmnt );
//        }
//      });
//    }
//  };
//});
//
//
//collabmedia.compileProvider.factory( 'tempService', function () {
//  return function () { 
//    return '<td contenteditable><input type="text" class="editBox" value=""/></td>'+ 
//            '<td contenteditable><input type="text" class="editBox" value=""/></td>'+
//             '<td>'+
//                '<span>'+
//         '<button id="createHost" class="btn btn-mini btn-success" data-ng-click="create()"><b>Create</b></button>'+
//              '</span>'+
//            '</td>';
//  };
//});