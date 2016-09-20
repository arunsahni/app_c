var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('filterCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){

/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	get_allFSG
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is get values of all fsg's .
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//$scope.get_allFSG = function(){
//    $scope.fsgs=[];
//    $http.get('/fsg/view').then(function (data, status, headers, config){
//        if (data.data.code==200){
//            $scope.fsgs=data.data.response;
//            //getting country data for country ng-repeat
//            //start 
//            for(var i = 0; i < $scope.fsgs.length; i++){
//                console.log($scope.fsgs[i].Title);
//                if ($scope.fsgs[i].Title == "Country of Affiliation") {
//                   $scope.countries = $scope.fsgs[i];
//                }
//            }
//            $scope.currentCountries =[];
//            $scope.restCountries=[];
//            $http.get('/user/chklogin')
//			.success(function (data1, status, headers, config) {				
//				if (data1.code=="200"){
//                    $scope.userInfo = data1.usersession;
//					userInfo = data1.usersession;
//                    if (userInfo.FSGsArr2 && userInfo.FSGsArr2 != [] && userInfo.FSGsArr2 != undefined) {
//                        console.log('------------> HERE1');
//                        for (x in userInfo.FSGsArr2){
//                            if (x == $scope.countries.Title) {
//                                console.log('------------> HERE3');
//                                for (j in $scope.countries.Values ){
//                                    var fsgsArrVal = '';
//                                    var flag = false;
//                                    fsgsArrVal = (userInfo.FSGsArr2[x]).split(',');
//                                    for(y in fsgsArrVal){
//                                        if ($scope.countries.Values[j].valueTitle==fsgsArrVal[y]) {
//                                            $scope.currentCountries.push($scope.countries.Values[j]);
//                                            flag = true;
//                                        }
//                                    }
//                                    if (!flag) {
//                                        $scope.restCountries.push($scope.countries.Values[j])
//                                    }
//                                }
//                            }
//					    }
//                    }else{
//                        console.log('------------> HERE2');
//                        $scope.currentCountries = [];
//                        $scope.restCountries =$scope.countries.Values;
//                    }
//				}else{
//					userInfo = {};
//				}
//			});	
//            //End
//            setTimeout(function(){
//                //$scope.set__defaultValueInSelectedFSGs
//                $scope.setDefaultFilters();
//            },10);
//        }
//    })
//}
//$scope.get_allFSG();
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	set__defaultValueInSelectedFSGs
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to set users default fsg options.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//    $scope.set__defaultValueInSelectedFSGs = function(){
//		$scope.selectedFSGs={};
//        var loopFlag = -1;
//        console.log('----------set__defaultValueInSelectedFSGs---------------');
//		setTimeout(function(){
//			$('.filter_checbox').each(function(){
//				if ($(this).find('.radiobb').prop('checked')   && $(this).find('.radiobb').attr('data')!='' && $(this).find('.radiobb').attr('data') != undefined) {
//					loopFlag++;
//					var attr=$(this).find('.radiobb').attr('data');
//					attr=attr.split('~');
//					if (attr[1] != 'undefined'){
//						if (loopFlag == 0) {
//							$scope.selectedFSGs[attr[0]]=attr[1];
//						}
//						else{
//							if ($scope.selectedFSGs[attr[0]] == undefined) {
//								$scope.selectedFSGs[attr[0]] = attr[1];
//							}else{
//								$scope.selectedFSGs[attr[0]] = $scope.selectedFSGs[attr[0]]+','+attr[1];                
//							}
//						}	
//					}
//				}  
//			});
//			console.log("-----default fsg data = ",$scope.selectedFSGs);
//			//$scope.filterSub();
//			//console.log('$scope.selectedFSGs'+$scope.selectedFSGs);
//        },800);
//	}
/**********************************END***********************************/
/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	changeCss
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is called when user clicks on fsg radio button.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.changeCss = function(id,sg,fsg){
        $('#overlay2').show();
        $('#overlayContent2').show();
        console.log('----------changeCss-------------');
		var loopFlag = -1;
		if ($('#'+id).hasClass('all')) {
			console.log('all case');
		}else{
			var allChecked=0;
			var allOptionsCount=0;
			var filterGroup=($('#'+id).attr('data')).split('~');
			console.log('filterGroup = '+filterGroup);
			$('.filter_checbox').each(function(){
				if ($(this).find('.radiobb').attr('data') != '' && $(this).find('.radiobb').attr('data') != undefined ) {
					var attr1=$(this).find('.radiobb').attr('data');
					attr1=attr1.split('~');
					if (filterGroup[0] == attr1[0] && attr1[1] !== undefined) {
						allOptionsCount++;
						if ($(this).find('.radiobb').prop('checked') ) {
							if ($(this).find('.radiobb').attr('id') == id ) {}
							else{
							allChecked++
							}
						}else{
							if ($(this).find('.radiobb').attr('id') == id && ($(this).find('.radiobb').prop('checked') == false)) {
								allChecked++
							}
						}
					}
				} 
			})
            console.log('allChecked == allOptionsCount'+allChecked +" =="+ allOptionsCount);
            if (allChecked == allOptionsCount) {
                $('.filter_checbox').each(function(){
                    //console.log(1);
                        if ($(this).find('.radiobb').hasClass('all')) {
                            console.log(2);
                            if (filterGroup[0]==$(this).find('.radiobb').attr('name')) {
                                console.log(3);
                                $(this).find('.radiobb').prop('checked',true)
                            }
                        }
                })
            }else{
                $('.filter_checbox').each(function(){
                        if ($(this).find('.radiobb').hasClass('all')) {
                            if (filterGroup[0]==$(this).find('.radiobb').attr('name')) {
                                $(this).find('.radiobb').prop('checked',false)
                            }
                        }
                })
            }
		}		
		$scope.selectedFSGs={};
        setTimeout(function(){
            $('.filter_checbox').each(function(){
				if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data')!='' && $(this).find('.radiobb').attr('data') != undefined) {
					loopFlag++;
					var attr=$(this).find('.radiobb').attr('data');
					attr=attr.split('~');
					if (attr[1] != 'undefined'){
						if (loopFlag == 0) {
							$scope.selectedFSGs[attr[0]]=attr[1];
						}
						else{
							if ($scope.selectedFSGs[attr[0]] == undefined) {
								$scope.selectedFSGs[attr[0]] = attr[1];
							}else{
								$scope.selectedFSGs[attr[0]] = $scope.selectedFSGs[attr[0]]+','+attr[1];                
							}
						}	
					}
				}  
			});
			console.log($scope.selectedFSGs);
			$scope.previewIndex.filterSub();
        },800);
    }
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	get_allFSG
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is get values of all fsg's .
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//    $scope.setDefaultFilters=function(){
//		$timeout(function(){
//			for (i in $scope.fsgs) {
//				for (x in $scope.userInfo.FSGsArr2){
//					if ($scope.fsgs[i].Title!="Country of Affiliation") {
//						if (x==$scope.fsgs[i].Title) {	
//							for (j in $scope.fsgs[i].Values ){
//								var fsgArrVal=($scope.userInfo.FSGsArr2[x]).split(',');
//								for(y in fsgArrVal){
//									if ($scope.fsgs[i].Values[j].valueTitle==fsgArrVal[y]) {
//										$('#'+$scope.fsgs[i].Values[j]._id).prop('checked',true);
//									}
//								}
//							}
//						}
//					}
//				}
//			}
//			//if ($scope.userInfo.Settings[0].Users != '' && $scope.userInfo.Settings[0].Users != undefined) {
//			//	$('#'+$scope.userInfo.Settings[0].Users).prop('checked',true);
//			//	
//			//	if( $scope.userInfo.Settings[0].Users == "powerUser" ){
//			//		$scope.powerUser = true;
//			//		powerUserCase=1;
//			//	}
//			//	
//			//}
//			//
//            if ($scope.userInfo.Settings!=[]) {
//                if ($scope.userInfo.Settings[0] != [] && $scope.userInfo.Settings[0] != undefined) {
//         
//                    if ($scope.userInfo.Settings[0].Prefrence != '' && $scope.userInfo.Settings[0].Prefrence != undefined) {
//                        $('#'+$scope.userInfo.Settings[0].Prefrence).prop('checked',true);
//                    }
//                    //if ($scope.userInfo.Settings[0].MotivationType != '' && $scope.userInfo.Settings[0].MotivationType != undefined) {
//                    //	$('#'+$scope.userInfo.Settings[0].MotivationType).prop('checked',true);
//                    //}
//                    if ($scope.userInfo.Settings[0].MediaType != '' && $scope.userInfo.Settings[0].MediaType != undefined && $scope.userInfo.Settings[0].MediaType.length != 0) {
//                        for (i in $scope.userInfo.Settings[0].MediaType) {
//                            //console.log($scope.userInfo.Settings[0].MediaType);
//                            $('#'+$scope.userInfo.Settings[0].MediaType[i]).prop('checked',true);
//                        }
//                        $('.select_media').each(function(){
//                            if($(this).prop('checked')){
//                                $scope.contentmediaType.push($(this).attr('value'));
//                            }
//                        });
//                    }else{
//                        $('.select_media').each(function(){
//                            $(this).prop('checked',true);
//                        });
//                        $scope.contentmediaType = [];
//                    }
//                }
//            }
//			$scope.set__defaultValueInSelectedFSGs();
//		},1);
//		
//	}
//	
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	20 April 2015
* @Method :   	changeMediaType
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used for sending selected media types to search engine(on client request for allowing multiselect in media types)
* @Param:     	-
* @Return:    	yes
_________________________________________________________________________
*/
	//$scope.contentmediaType = [];
//	$scope.changeMediaType = function(type){
//        $('#overlay2').show();
//        $('#overlayContent2').show();
//			if (!($('.select_media[value='+type+']').prop('checked'))) {
//				console.log('in-if');
//				var num =0;
//				$('.select_media').each(function(){
//					if($(this).prop('checked') ){
//						num = num + 1;
//					}
//				});
//				if ( num == 4 ) {
//					$scope.contentmediaType = [];
//				}else{
//					$scope.contentmediaType = [];
//					$('.select_media').each(function(){
//						if($(this).prop('checked')){
//							$scope.contentmediaType.push($(this).attr('value'));
//						}
//					});
//				}
//			}else{
//				console.log('in-else');
//				var num =0;
//				$('.select_media').each(function(){
//					if($(this).prop('checked') ){
//						num = num + 1;
//					}
//				});
//				if ( num == 4 ) {
//					$scope.contentmediaType = [];
//				}else{
//					$scope.contentmediaType = [];
//					$('.select_media').each(function(){
//						if($(this).prop('checked')){
//							$scope.contentmediaType.push($(this).attr('value'));
//						}
//					});
//				}
//			}
//		console.log('-----------------------$scope.contentmediaType2----------------------------');
//		console.log($scope.contentmediaType);
//		console.log('-----------------------$scope.contentmediaType2----------------------------');
//	    $scope.filterSub();
//    }
/**********************************END***********************************/




/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	saveDefault
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to set default value for fsg's .
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//    $scope.saveDefault= function(title){
//        console.log('save default');
//		var data={};
//		var fsg='';
//		 $('.filter_checbox').each(function(){
//            if ($(this).find('.radiobb').prop('checked') && $(this).find('.radiobb').attr('data').indexOf(title)!=-1) {
//                var titleNvalue=[];
//                var titleNvalue=($(this).find('.radiobb').attr('data')).split('~');
//                if(fsg==''){
//                    fsg=titleNvalue[1];
//                }else{
//                    fsg=fsg+','+titleNvalue[1];
//                }
//            }  
//        });
//        data.title=title;
//        data.value=fsg;
//		$http.post('/user/fsgArrUpdate',data).then(function (data, status, headers, config) {
//			$scope.setFlashInstant('Your search prefrences have been saved successfully!' , 'success');
//		});
//	}
/**********************************END***********************************

/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	changeOwner
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to cahnge user media prefrence owner vs reciver.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
// function is in searchGalleryCtrl
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	22 June 2015
* @Method :   	saveFormat
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is to set basic value for format .
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//	$scope.saveFormat=function(){
//        if ($scope.userInfo.Settings!=[] && $scope.userInfo.Settings != undefined) {
//            if ($scope.userInfo.Settings[0] != [] && $scope.userInfo.Settings[0] != undefined) {
//                var fields = $scope.userInfo.Settings[0];
//            }else{
//                var fields={};
//            }
//        }else{
//            var fields={};
//        }
//        //console.log($scope.userInfo.Settings[0]);
//		fields.MediaType=[];
//		if($('#radioImage').prop('checked')){
//			fields.MediaType.push("radioImage");
//		}
//		if($('#radioLink').prop('checked')){
//			fields.MediaType.push("radioLink");
//		}
//		if($('#radioNotes').prop('checked')){
//			fields.MediaType.push("radioNotes");
//		}
//		if($('#radioMontage').prop('checked')){
//			fields.MediaType.push("radioMontage");
//		}
//        //console.log(fields);
//		$scope.postSettings(fields);
//	}
/**********************************END***********************************/




/*________________________________________________________________________
* @Date:      	22 June 2015
* @Method :   	postSettings
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is final step of save setting(format/powerUser etc..).
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//$scope.postSettings  = function(fields){
//    $http.post('/user/saveSettings',fields).then(function (data, status, headers, config) {
//        $scope.setFlashInstant('Your search settings have been saved successfully!' , 'success');
//    });
//}
/**********************************END***********************************/



/*________________________________________________________________________
*  @Date:      	27 Jan 2015
*  @Method :   	clearAllSelected
*  Created By: 	smartData Enterprises Ltd
*  Modified On:	-
*  @Purpose:   	This function is used to clear all selected filter options.
*  @Param:     	
*  @Return:    	no
_________________________________________________________________________
*/
//	$scope.clearAllSelected=function(){
//		$('.filter_checbox').each(function(){
//			$(this).find('.radiobb').prop('checked',false);
//		});
//		//$('#demo-input-local').tokenInput('clear');
//		$scope.currentCountries=[];
//        $scope.restCountries = $scope.countries.Values;
//        setTimeout(function(){
//			//alert(1)
//            $('.filter_checbox').each(function(){
//				$scope.selectedFSGs={};
//				if ($(this).find('.radiobb').prop('checked')   && $(this).find('.radiobb').attr('data')!='' && $(this).find('.radiobb').attr('data') != undefined) {
//					console.log('here');
//					loopFlag++;
//					var attr=$(this).find('.radiobb').attr('data');
//					attr=attr.split('~');
//					if (attr[1] != 'undefined'){
//						if (loopFlag == 0) {
//							
//							$scope.selectedFSGs[attr[0]]=attr[1];
//						}
//						else{
//							if ($scope.selectedFSGs[attr[0]] == undefined) {
//								$scope.selectedFSGs[attr[0]] = attr[1];
//							}else{
//								$scope.selectedFSGs[attr[0]] = $scope.selectedFSGs[attr[0]]+','+attr[1];                
//							}
//						}	
//					}
//					
//				}  
//			});
//			console.log($scope.selectedFSGs);
//			//$scope.getCountrySel();
//			$scope.filterSub();
//        },800);
//	}
/**********************************END***********************************/
	

/*________________________________________________________________________
* @Date:      	02 July 2015
* @Method :     saveCon
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to save default value for countries filter.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
//*/
//$scope.saveCon=function(){
//    var newData= $scope.currentCountries;
//    var fsg='';
//    for (i in newData) {
//        if (i==0) {
//            fsg=newData[i].valueTitle;	
//        }else{
//            fsg=fsg+','+newData[i].valueTitle;
//        }
//    }
//    var data={
//        title:'Country of Affiliation',
//        value:fsg
//    }
//    $http.post('/user/fsgArrUpdate',data).then(function (data, status, headers, config) {
//        $scope.setFlashInstant('Your search prefrences have been saved successfully!' , 'success');
//    });
//}
/**********************************END***********************************/
	

/*________________________________________________________________________
* @Date:      	02 July 2015
* @Method :   	getCountrySel
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is get values of all fsg's .
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//$scope.getCountrySel = function(){
//    $('#overlay2').show();
//    $('#overlayContent2').show();
//    var countries = $scope.currentCountries;
//    if(countries.length != 0){
//        var countryLast = countries[countries.length-1].valueTitle.trim();
//        var userFsgs = $scope.selectedFSGs;
//        userFsgs["Country of Affiliation"] = countryLast;
//    }
//    var queryParams = {};
//    //alert(countryName);
//    queryParams = {page :$scope.page, per_page:$scope.per_page, mediaType:$scope.contentmediaType, userFSGs:userFsgs, groupTagID:$scope.selectedgt};
//    $http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
//        if (data1.data.status=="success"){
//            $scope.medias=data1.data.results;
//            $('#overlay2').hide();
//            $('#overlayContent2').hide();
//            for(i in $scope.medias){
//                $scope.arrayOfMedias.push($scope.medias[i]._id);
//            }
//            $http.post('/media/addViews',{board:$stateParams.id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
//            });
//        }
//        else{
//            $('#overlay2').hide();
//            $('#overlayContent2').hide();
//            $scope.medias={};
//            $scope.arrayOfMedias=[];
//        }
//    });
//};
/**********************************END***********************************/
	
/*________________________________________________________________________
* @Date:      	23 July 2015
* @Method :   	addToSelected_country
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is add selected country to $scope.currentCountries and remove from $scope.restCountries .
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//$scope.addToSelected_country = function(country){
//    //alert(1);
//    $scope.currentCountries.push(country);
//    var index = $scope.restCountries.indexOf(country);
//    $scope.restCountries.splice(index,1);
//    $scope.ctryName='';
//}
/**********************************END***********************************/

/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	removeSelected_country
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is remove selected country from $scope.currentCountries and add to $scope.restCountries .
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
//$scope.removeSelected_country = function(country){
//    //alert(1);
//    $scope.restCountries.push(country);
//    var index = $scope.currentCountries.indexOf(country);
//    $scope.currentCountries.splice(index,1);
//    
//}
/**********************************END***********************************/

/*________________________________________________________________________
* @Date:      	17 June 2015
* @Method :   	get_allFSG
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is get values of all fsg's .
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/

/**********************************END***********************************/

}]);