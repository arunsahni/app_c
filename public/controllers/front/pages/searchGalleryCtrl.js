var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('searchGalleryCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
    var media_type = ['Image'];
	$scope.last_list = [];
	$scope.keywordsArr = [];
	$scope.showCloseSingle = false;
	$scope.showAddImage = false;
	$scope.mediaOffset = 0;
	$scope.resultfrommediaId = [];
	$scope.justifyGallery = function(){
		/*
		var _configObject = configObject ? configObject : {};
		_configObject.lastRow = configObject.lastRow ? configObject.lastRow : 'nojustify';
		_configObject.rowHeight = configObject.rowHeight ? configObject.rowHeight : 200;
		_configObject.rel = configObject.rel ? configObject.rel : 'gallery2';
		_configObject.margins = configObject.margins ? configObject.margins : 10;
		*/
		$("#justifiedgallery").justifiedGallery({
			lastRow : 'nojustify', 
			rowHeight : 250, 
			//rel : 'gallery2',
			margins : 10  
		});
		
		
	}
	
	$scope.filterSub = function(searchFlag){
		//alert("called...");
		//$('#overlay2').show();
		//$('#overlayContent2').show();
		$scope.arrayOfMedias=[];
		$scope.per_page = 48;
		$scope.page = 1;
		var queryParams = {};
		if(!$scope.ownerFSG){
			userFsgs=$scope.selectedFSGs;
		}
		//queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
		//queryParams = {page:$scope.page,per_page:$scope.per_page,mediaType:$scope.contentmediaType,userFSGs:userFsgs,groupTagID:$scope.current__gtID};
		queryParams = {page:$scope.page,per_page:$scope.per_page,mediaType:$scope.contentmediaType,userFSGs:userFsgs,groupTagID:$scope.selectedgt};
		$http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
			if (data1.data.status=="success"){
				//$scope.init__showMorePagination();
				//$('#justifiedgallery').justifiedGallery('destroy');
			
				
				$scope.medias=data1.data.results;
				
				$timeout(function(){
					$scope.justifyGallery();
				},1500)
				
				
				for(i in $scope.medias){
					$scope.arrayOfMedias.push($scope.medias[i]._id);
				}
				console.log($scope.arrayOfMedias.length+ "  === "+($scope.page*$scope.per_page))
				$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.per_page);
				//alert($filter('number')($scope.arrayOfMedias.length));
				$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
				
				//var responseLength = $scope.arrayOfMedias.length;
				//$scope.more = $scope.medias.length === $scope.per_page;
				//$scope.families = $scope.families.concat(response.data.library.families);
				//$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
				
				//adding show_more pagination code on 27012015
				$timeout(function(){
					$scope.setHeight();
				},100);
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$('#loading').hide();
				
				$http.post('/media/addViews',{board:$scope.page_id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
				
				});
				if ($scope.selectedgt) {
					$('.keys').removeClass('activeKey');
					$('.keys #'+$scope.selectedgt).parent().addClass('activeKey');
				}
			}
			else{
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$scope.medias={};
				$scope.arrayOfMedias=[];
			}
			setTimeout(function(){
				$('#overlay2').hide();
				$('#overlayContent2').hide();
			},1000)
		});
    }
	
	//$scope.filterSub();
	$timeout(function(){
		$scope.setHeight();
	},2000);
	
	$scope.setHeight = function(){
		return;
		$('.gallery-block ul li .hover-overlayer').height($('.gallery-block ul li').width());
		$('.gallery-block ul li').height($('.gallery-block ul li').width());
		$('.gallery-block ul li .gallery-pic-bx').height($('.gallery-block ul li').width());
		$('.gallery-block ul li a').height($('.gallery-block ul li').width());
		$('.gallery-block ul li img').height($('.gallery-block ul li').width());
		//alert("called...");
	}
	//show more code -------------start
	
	$scope.arrayOfMedias=[];
    $scope.init__showMorePagination = function(){
		$scope.per_page = 48;
		$scope.page = 1;
		$scope.arrayOfMedias=[];
		$scope.more = true;
		$scope.status_bar = "";
	}
	$scope.init__showMorePagination();
	
	$scope.show_more = function () {
		$('#loading').show();
        $scope.page += 1;
		$scope.filterSub__showMore();
    }

    $scope.has_more = function () {
        return $scope.more;
    }
	
    $scope.filterSub__showMore = function(searchFlag){
		if(!$scope.ownerFSG){
			userFsgs = $scope.selectedFSGs;
		}
		
		if(searchFlag == 'search-by-theme'){
			//using boardDirective we set the selected theme (GT)
		}
		else{
			$('#slideTitleHeader li').each(function(){
				if ($(this).css('visibility')!='hidden') {
					$scope.selectedgt=$(this).attr('id');
				}
			});
		}
		
		if( $scope.search1.tata2 != "" && $scope.search1.tata2 != null ){
			queryParams = {searchBy:'Descriptor',descValue:$scope.search1.tata2,title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:['Image'],page:$scope.page,per_page:$scope.per_page};
		}
		else{
			queryParams = {title:$scope.searchTitle,groupTagID:$scope.selectedgt,userFSGs:userFsgs,powerUserCase:powerUserCase,mediaType:$scope.contentmediaType,page:$scope.page,per_page:$scope.per_page};
		}
		
		   
                    
		/* chapter-view show more through UserMedia_currentuser model Start   */
		
		var pageLimit = 48;
                var offset = $scope.medias.length;
		//var mediaOffset = 1;
		
		
		//  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',$rootScope.UserDetails._id);return
		//alert($scope.contentmediaType);
		  $http.post('/media/showMoreMedia',{pageLimit: pageLimit,offset:offset,mediaTypes:$scope.contentmediaType,mediaOffset:$scope.mediaOffset, resultfrommediaId:  $scope.resultfrommediaId}).then(function (data1, status, headers, config) {
	    //$http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {
	    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',data1);
			if (data1.status==200){
				$scope.arrayOfMedias = [];
				$('#justifiedgallery').justifiedGallery('destroy');
				$scope.medias= $scope.medias.concat(data1.data.result);
				
				
				//console.log('%%%%%%%%%%%%%%%%%%%%%%',data1.data.result);
				//alert($scope.medias.length);
				$timeout(function(){
					$scope.justifyGallery();
				},1500)
				
				for(i in $scope.medias){
					$scope.arrayOfMedias.push($scope.medias[i]._id);
				}
				console.log($scope.arrayOfMedias.length+ "  === "+($scope.page*$scope.per_page))
				$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.per_page);
				$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
				
				$timeout(function(){
					$scope.setHeight();
				},200);
				$('#loading').hide();
				
				//$http.post('/media/addViews',{board:$scope.page_id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
				//	
				//});
				if (data1.data.mediaOffset) {
				    $scope.mediaOffset = data1.data.mediaOffset;
				}
				if (data1.data.resultfrommediaId.length) {
				    $scope.resultfrommediaId = data1.data.resultfrommediaId;
				}				    

			}
			else{
				$('.loader_overlay').hide()
				$('.loader_img_overlay').hide()
				$scope.medias={};
				$scope.arrayOfMedias=[];
			}
		});
		
		/* chapter-view show more through UserMedia_currentuser model end   */
		
		//$http.post('/media/searchEngine',queryParams).then(function (data1, status, headers, config) {	
		//	if (data1.data.status=="success"){
		//		$scope.arrayOfMedias = [];
		//		$('#justifiedgallery').justifiedGallery('destroy');
		//		$scope.medias=data1.data.results;
		//		alert($scope.medias.length);
		//		$timeout(function(){
		//			$scope.justifyGallery();
		//		},1500)
		//		
		//		for(i in $scope.medias){
		//			$scope.arrayOfMedias.push($scope.medias[i]._id);
		//		}
		//		console.log($scope.arrayOfMedias.length+ "  === "+($scope.page*$scope.per_page))
		//		$scope.more = $scope.arrayOfMedias.length === ($scope.page*$scope.per_page);
		//		$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(data1.data.mediaCount) + " entries";
		//		
		//		$timeout(function(){
		//			$scope.setHeight();
		//		},200);
		//		$('#loading').hide();
		//		
		//		$http.post('/media/addViews',{board:$scope.page_id,arrayOfMedias:$scope.arrayOfMedias}).then(function (data, status, headers, config) {
		//			
		//		});
		//	}
		//	else{
		//		$('.loader_overlay').hide()
		//		$('.loader_img_overlay').hide()
		//		$scope.medias={};
		//		$scope.arrayOfMedias=[];
		//	}
		//});
	}
	
	$scope.setShowMorePagination = function(response){
		for(i in response){
			$scope.arrayOfMedias.push(response[i]._id);
		}
		
		var responseLength = $scope.arrayOfMedias.length;
		console.log(responseLength + "=== "+ $scope.per_page)
		$scope.more = responseLength === $scope.per_page;
		$scope.status_bar = "Showing " + ($scope.arrayOfMedias.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.arrayOfMedias.length) + " of " + $filter('number')(response.data.library.pagination.count) + " entries";
	};
	
	//show more code -----------------end
	setTimeout(function(){
		$scope.awesomeThings = [
			'HTML5',
			'AngularJS',
			'Karma',
			'Slick',
			'Bower',
			'Coffee'
		]},1000);
	
	
	$scope.parseKeywords__old = function (){
		var postData = {};
		postData.keywordsArr = $scope.last_list;
		postData.inputText = $('.ansr-box-inr').text();
		$http.post('/keywords/parse',postData).then(function (data, status, headers, config) {
			
			console.log("parse keyword data = ",data);
			if(data.status == 200){
				if ($scope.gt_fromDwn.length>0) {
					for(i=0;i<$scope.gt_fromDwn.length;i++){
						data.data.response.suggestedArr.push($scope.gt_fromDwn[i])
					}
				}
				$scope.last_list = data.data.response.suggestedArr;
				return;
				var keywordsArrDup = $scope.keywordsArr;
				var suggestedArrDup = data.data.response.suggestedArr;
				console.log('keywordsArrDup');
				console.log(keywordsArrDup.length)
				console.log('suggestedArrDup')
				console.log(suggestedArrDup.length)
				var difference = [];
				if (suggestedArrDup.length>keywordsArrDup.length) {
					jQuery.grep(suggestedArrDup, function(el,index) {
						var flag= false;
						keywordsArrDup.filter(function(obj){
							if(obj.id==el.id){
								flag=true;
							}
						  
						})
						if(!flag){
							difference.push(el);
						}
					});
					
					var lastKeyWord =difference.pop();
					$scope.selectedgt = lastKeyWord.id;
				}
				else{
					
				}
				//$scope.lastGT = suggestedArrDup.pop();
				console.log('difference');
				console.log(difference);
				if( angular.toJson($scope.keywordsArr) != angular.toJson(data.data.response.suggestedArr) ){
					$scope.keywordsArr = data.data.response.suggestedArr;
					console.log("$scope.keywordsArr----",$scope.keywordsArr);
					setTimeout(function(){
						$('#lmn_slider').lemmonSlider('destroy');
						mediaSite.initSlider();
					},100)
					
					//if( $scope.keywordsArr.length ){
					//	//var lastKeyWord = $scope.keywordsArr.pop();
					//	var lastKeyWord = $scope.keywordsArr[$scope.keywordsArr.length-1];
					//	$scope.selectedgt = lastKeyWord.id;
					//}
					
					setTimeout(function(){
						$scope.filterSub();
					},100);
				}
			}
		});
	}
	
	$scope.parseKeywords = function ($event){
		//alert("$event-----"+$event)
		if($event.keyCode == 13) {
			//alert('Enter pressed');
			console.log('Enter pressed');		//continue
		} else if($event.keyCode == 8) {
			console.log('Backspace pressed');   //continue
			return;
		} else if($event.keyCode == 9) {
			console.log('Tab pressed');         //continue
			return;
		} else if($event.keyCode == 32) {
			console.log('space pressed');       //continue  
			return;
		} else {
			//alert($event.keyCode);
			if(typeof($event.keyCode)!='undefined'){	//ng-blur case.
				return;
			}
		} 
		
		console.log("$http.pendingRequests-------------",$http.pendingRequests);
		angular.forEach($http.pendingRequests, function(request) {
			if (request.cancel && request.timeout) {
			 request.cancel.resolve();
			}
		});
		
		/*
		if ($scope.keywordsArr.length>0) {
			for(var x = 0; x < $scope.keywordsArr.length ; x++){
				$scope.MakeBold($scope.keywordsArr[x].title);
			}
		}
		*/
		var data = ($('#edit55').text().trim().split('Start typing and click on the keywords OR drop any media from the web or your drive.')).join(' ');
		if ( data.trim() != '' ) {
			var postData = {};
			postData.keywordsArr = $scope.keywordsArr;
			postData.inputText = $('.ansr-box-inr').text();
			if (postData.inputText == ""  ||  postData.inputText.indexOf("Start typing...") != -1 || postData.inputText=="Unlicensed Froala Editor") {
			    return;
			}
			$http.post('/keywords/parse',postData).then(function (data, status, headers, config) {
				if(data.status == 200){
					console.log('here1');
					if (data.data.response.newGT.length>0) {
						console.log('here2')
						for(var i=0; i<data.data.response.newGT.length; i++){
							$scope.keywordsArr.push(data.data.response.newGT[i])
							//$scope.MakeBold(data.data.response.newGT[i].title);
						}
						setTimeout(function(){
							$('#lmn_slider').lemmonSlider('destroy');
							mediaSite.initSlider();
							$scope.selectedgt = $scope.keywordsArr[$scope.keywordsArr.length-1].id;
							$scope.filterSub();
							$('.keys').removeClass('activeKey');
							$('.keys').last().addClass('activeKey');
							$('#lmn_slider').scrollLeft($('#lmn_slider ul').width());
						},100);
					}
					if (data.data.response.removeGT.length>0) {
						var removeGT = data.data.response.removeGT;
						for(var j = 0; j< $scope.keywordsArr.length; j++){
							for(var k = 0; k< removeGT.length; k++){
								if ($scope.keywordsArr[j].id==removeGT[k].id) {
									$scope.keywordsArr.splice(j,1);
								}
							}
						}
						setTimeout(function(){
							$('#lmn_slider').lemmonSlider('destroy');
							mediaSite.initSlider();
							if ($scope.keywordsArr.length>0) {
								$scope.selectedgt = $scope.keywordsArr[$scope.keywordsArr.length-1].id;
							}else{
								$scope.selectedgt = '';
							}
							$scope.filterSub();
							$('.keys').removeClass('activeKey');
							$('.keys').last().addClass('activeKey');
							$('#lmn_slider').scrollLeft($('#lmn_slider ul').width())
						},100);
					}
					//console.log($('.ansr-box-inr').html());
					//$('.ansr-box-inr').html().replace(/pride/g,'<b>$&</b>')
					
				}
			});
		}
	}


/*________________________________________________________________________
    * @Date:      	3 June 2015 
    * @Method :   	setMediaId
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-
    * @Purpose:   	This function is used set media data of media clicked on search list.  
    * @Param:     	-
    * @Return:    	no
_________________________________________________________________________
*/
	$scope.setMediaId = function(media){
        $scope.mediasData = media;
		$scope.showCloseSingle = true;
		$scope.showAddImage = false;
		
	}
/**********************************END***********************************/

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
    var fsgFlag = 0;
	$scope.changeOwner =function(fsgFlag){
        $('#overlay2').show();
        $('#overlayContent2').show();
        setTimeout(function(){
			if(fsgFlag){
				$scope.ownerFSG = true;
				userFsgs=$scope.boarddata[0].OwnerId.FSGs;
			}
			else{
				$scope.ownerFSG = false;
				userFsgs={};
			}
			$scope.filterSub();
		},10)  
    }
    
/**********************************END***********************************/



/*________________________________________________________________________
* @Date:      	14 July 2015
* @Method :   	setGT
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to cahnge selectedGT when user clicks on a keyword in slider.
* @Param:     	1
* @Return:    	no
_________________________________________________________________________
*/
$scope.setGT = function(gt){
	console.log('setGT()');
	$('.keys').removeClass('activeKey');
	console.log($('.keys #'+gt));
	$('.keys #'+gt).parent().addClass('activeKey');
	$scope.selectedgt = gt;
	$scope.filterSub();
}

//new search gallery-updates on 10052016 by manishp
$scope.keywordsArr2 = [];
$scope.setGT = function(gt,keyword){
	console.log('setGT()');
	//$('.keys').removeClass('activeKey');
	console.log($('.keys #'+gt));
	//$('.keys #'+gt).parent().addClass('activeKey');
	$scope.selectedgt = gt;
	console.log("--------keyword-------------",keyword);
	var index = getObjArrayIdxByKey($scope.keywordsArr,'id',keyword.id);
	if (index > -1) {
	  $scope.keywordsArr.splice(index,1)
	}
	$scope.keywordsArr2.push(keyword);	//push in the left active keywords listing
	//$scope.keywordsArr2				//pull from the right hand side keywords listing
	
	console.log("key2--->",$scope.keywordsArr2)
	$scope.filterSub();
}
    
/**********************************END***********************************/


/*________________________________________________________________________
* @Date:      	15 July 2015
* @Method :   	MakeBold
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to make keyword in editable bold.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
$scope.MakeBold = function(key){
	//alert(1);
	var _break = /<br\s?\/?>$/g,
		_rxword = new RegExp('('+key+')','gmi'),
		_rxboldDown = /<\/b>/gm,
		_rxboldUp = /<\/b>(?!<br\s?\/?>)([\w]+)(?:<br\s?\/?>)?$/,
		_rxline = /(<br\s?\/?>)+(?!<b>)(<\/b>$)+/gm;

    var html = document.getElementById('edit55').innerHTML.replace(_break, ""),
		dom = $('.ansr-box-inr');
		
	//finds the word
	if (_rxword.test(dom.text())){
		dom.data("_newText", html.replace(_rxword, "<b>$1</b>&nbsp;"));
		console.log('dom.data("_newText")',dom.data("_newText"));
	}
	console.log('html',html);
	console.log('_rxboldDown.test(html)',_rxboldDown.test(html));
	//finds the end of bold text
	if (_rxboldDown.test(html)){
		dom.data("_newText", dom.data("_newText") + "&nbsp;");
		console.log('dom.data("_newText")',dom.data("_newText"));
	}
    
	//prevents the bold NodeContent to be cached
    dom.attr("contenteditable", false).attr("contenteditable", true);
    var newText = dom.data("_newText"),
		innerHtml = document.getElementById('edit55').innerHTML;
		//html;
		
    console.log('newText',newText);
    //resets the NodeContent
    if (!dom.text().length || innerHtml == '<br>') {
		console.log('in if textarea is empty');
		dom.empty();
		return false;
    }

    //fixes firefox issue when text must follow with bold
    if (!newText && _rxboldUp.test(innerHtml)){
		newText = innerHtml.replace(_rxboldUp, "$1</b>");
		console.log('newText',newText);
    }

    //fixes firefox issue when space key is rendered as <br>
    if (!newText && _rxline.test(innerHtml)){
		html = innerHtml;
		console.log('html',html);
	}
    else if (newText && _rxline.test(newText)){
		html = newText;
		console.log('html',html);
	}
    
    if (html){
		//newText = html.replace(_rxline, "$2$1");
		console.log('html',html);
		console.log('newText',newText);
	}
    
	console.log('newText',newText);
    if (newText && newText.length) {
      dom.html(newText).removeData("_newText");
      placeCaretAtEnd();
    }
}
$scope.delKeyword = function(keyword){
	console.log("--------delete keyword-------------",keyword);
	if (confirm("Are you sure you want to delete this keyword?")) {
	    var index = getObjArrayIdxByKey($scope.keywordsArr,'id',keyword.id);
	    if (index > -1) {
	      $scope.keywordsArr.splice(index,1)
	    }
	}
}
$scope.delKeyword2 = function(keyword){
	console.log("--------delete keyword-------------",keyword);
	if (confirm("Are you sure you want to delete this keyword?")) {
	    var index = getObjArrayIdxByKey($scope.keywordsArr2,'id',keyword.id);
	    if (index > -1) {
	      $scope.keywordsArr2.splice(index,1)
	    }
	}
}

/**********************************END***********************************/

	function placeCaretAtEnd () {
		dom = document.getElementById('edit55');
		var range, sel;
		dom.focus();
		if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
			range = document.createRange();
			range.selectNodeContents(dom);
			range.collapse(false);
			sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else if (typeof document.body.createTextRange != "undefined") {
			//this handles the text selection in IE
			range = document.body.createTextRange();
			range.moveToElementText(dom);
			range.collapse(false);
			range.select();
		}
		
		dom.focus();
	}

	// to get index 
	function getObjArrayIdxByKey(ObjArr , matchKey , matchVal){
	    var idx;
	    for( var loop = 0; loop < ObjArr.length; loop++ ){
		if (ObjArr[loop].hasOwnProperty(matchKey)) {
		    if(ObjArr[loop][matchKey] == matchVal){
			idx = loop;
			break;
		    }
		}
	    }
	    return idx;
	}
});