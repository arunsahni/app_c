var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('pageSettingCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	$scope.initFlags = function(){
		//Page Flags
		$scope.writeNote = false;
		$scope.sgOther = false;
		$scope.sgMontage = false;
		$scope.stOther = false;
		$scope.stMontage = false;
		$scope.dPage = false;
		
		$scope.makeMontage = false;
		$scope.saveMontage = false;
		$scope.singleMedia = false;
		//End Page Flags
		
		//Movement Flags
		$scope.pageThemeMovement = true;
		$scope.sMediaMovement = false;
		$scope.dMediaMovement = false;
	}
	
	$scope.initFlags();
	
	$scope.setPageFlag = function(flag,mediaType,elemObj){
		//alert("m here");
		if(mediaType){
			//alert("m here");
			if( mediaType == 'Image' || mediaType == 'Notes' || mediaType == 'Link'  || mediaType == 'Video' || mediaType == 'DragMedia'){
				flag = flag+'-Other';
			}
			else{
				flag = flag+'-'+mediaType;
			}
		}
		
		var flag__init = function(){
			//alert("flag__init called");
			//set false to all flags
			$scope.writeNote = false;
			$scope.sgOther = false;
			$scope.sgMontage = false;
			$scope.stOther = false;
			$scope.stMontage = false;
			$scope.dPage = false;
			
			$scope.makeMontage = false;
			$scope.saveMontage = false;
			$scope.singleMedia = false;
			
			//Movement Flags
			$scope.pageThemeMovement = false;
			$scope.sMediaMovement = false;
			$scope.dMediaMovement = false;
		}
		
		flag__init();
		
		switch(flag){
			
			//case-1 : On Write Note click
			case 'write-note':	
					//alert('write-note');
					$scope.writeNote = true;
					
					$scope.sMediaMovement = true;
					break;
			
			//case-2 : On SG-other than Montage type media click
			case 'SG-Other':
				//alert('SG-Image or SG-Notes or SG-Link');
				$scope.sgOther = true;
				
				$scope.sMediaMovement = true;
				break;
				
			//case-3 : On SG-Montage type media click
			case 'SG-Montage':
				//alert('SG-Montage');
				
				$scope.sgMontage = true;
				$scope.sMediaMovement = true;
				break;
				
			//case-4 : On ST-other than Montage type media click
			case 'ST-Other':
				//alert('ST-Image or ST-Notes or ST-Link');
				
				$scope.stOther = true;
				$scope.sMediaMovement = true;
				break;
				
			//case-5 : On ST-Montage type media click
			case 'ST-Montage':
				//alert('ST-Montage');
				
				$scope.stMontage = true;
				$scope.sMediaMovement = true;
				break;
			
			//case-6 : On D-other than Montage type media click
			case 'D':
				//alert('Discuss');
				$scope.dPage = true;
				$scope.dMediaMovement = true;
				break;
				
			default:
				alert('Unknown case....!');
				break;
			
		}
	};
	
	
	$scope.setMontagePageFlag = function(flag){
		
		var flag__init = function(){
			if ($scope.makeMontage == false && flag == 'make-montage') {
				//alert("Again clicked");
				if ($("#media-tray-elements li").length!=0) {
					$(".media-tray").css({"display":"block"});
					var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
					bodyHeight=bodyHeight+30+parseInt(($(".media-tray").css('height')).replace("px",""),10);
					$("body").css({'padding-top':bodyHeight+'px'});	
				}
			}
			
			
			$scope.makeMontage = false;
			$scope.saveMontage = false;
			$scope.singleMedia = false;
			
			//Movement Flags
			$scope.pageThemeMovement = false;
			$scope.sMediaMovement = false;
			$scope.dMediaMovement = false;
		}
		
		flag__init();
		
		//first check which one is true : It will tell us from where the previous single page view came.
		switch(flag){
			case 'single-media':
				//alert('single-media');
				
				$scope.singleMedia = true;
				$scope.sMediaMovement = true;
				break;
			//make-montage case
			case 'make-montage':
				//alert('make-montage');
				//$scope.tray_height=$('.media-tray').css('height');
				$scope.makeMontage = true;
				break;
			
			//save montage case
			case 'save-montage':
				//alert('save-montage');
				$scope.saveMontage = true;
				break;
			
			default:
				alert('Unknown case!');
				break;
		}
			
	}
	
	// function to close closeMonntageDelete pop
	$scope.closeMonDel=function(){
		$('#closeMontage_pop').css({'display':'none'})
	}
	
	
	
	
	//this function is to close ACT Page in both - search-gallery & discuss page
	$scope.close_holder_act = function(){
		if ($('.holder-act').css('display') != 'none') {
			$scope.close_holder_act_final();
		}
		else if ($scope.makeMontage == true || $scope.saveMontage == true) {
			$('#closeMontage_pop').css({'display':'block'});
			return;
		}
		else{
			if ($('#grid').css('display')=='none') {
				if ( $('.search-view #search-media-tray li').length < 15) {
					$scope.add_toTray_fromPlatform();
					$scope.close_holder_act_final();
				}else{
					$('#tary_full_onClose').show();
				}
				
			}
			else{
				if (((4-$('#grid').find('.addnote').length) + $('.search-view #search-media-tray li').length) <= 15) {
					$scope.add_toTray_fromPlatform();
					console.log('--here--')
					$scope.close_holder_act_final();
				}
				else{
					$('#tary_full_onClose').show();
				}
			}
		}
	}
	
	$scope.add_toTray_fromPlatform = function(){
		if ($('#grid').css('display')=='none') {
			$scope.addtoTray_delCase($scope.mediasData._id);
		}else{
			console.log($window.item_ids);
			for(i in $window.item_ids){
				if ($window.item_ids[i] != '' && $window.item_ids[i] != 'mon_note' && $window.item_ids[i] != 'mon_note_unknown') {
					console.log('---------------------------------------------------');
					console.log($window.item_ids[i]);
					$scope.addtoTray_delCase($window.item_ids[i]);	
					console.log('---------------------------------------------------');
				}
			}
		}
	}
	//close holder act working part
	// modified(modularized) by parul
	// to add confirmation popup
	$scope.close_holder_act_final=function(){
		//console.log(item_ids);
		$scope.reset_tray();
		$scope.del_grid_noteCase = false;
		$('.holder_bulb').css({'width':'600px'});
		$scope.init__stateVar();
		$('#menuicon').show();
		$('.edit_froala1').editable('setHTML','Start writing...');
		//$('.edit_froala2').editable('setHTML','Start writing...');
		//$('.wrapper').fadeIn();// Parul 06042015
		$('#bighead-header1').fadeIn();
		$('.search-view').fadeOut();//0602015 Parul
		$('#closeMontage_pop').css({'display':'none'})
		$(".media-tray").css({"display":"none"});
		//$('.avatar-widget').css({'display':'block'});
		//$('.avatar-widget ul').html('');
		$('.avatarwdgt').css({'display':'block'});
		//$('.avatarwdgt ul').html('');
		//$("body").css({'padding-top':'234px'});//--26Dec
		$("body").css({'padding-top':'244px'});//--updated on 09012015 after rakesh's suggestion
		$('body').css({'background':'none repeat scroll 0 0 #181818'});//0802015 Parul
		// code added by parul to manage classes of s-media and d-media buttons on closing act page
		//---- 19 dec 2014
		$('#s-media').addClass('active');
		$('#d-media').removeClass('active');
		//---- end
		$(".gridster_div").css({"display":"none"}); //--18 Dec..
		// Scroll to top of page after exit from act-page
		body = $("html, body");
		var bodyClass = $('body');
		var currentPageClass = bodyClass.data('page-class');
		body.animate('500');

		$('.holder_bulb').html("");
		$('#holder-box').html("");
		$('#holder-box').show();
		var grid_li = [];
		for (i=0;i<4;i++) {
			grid_li[i] = angular.element('<a href="javascript:void(0)" ng-click="openNote_mctrl()" onClick="openNote($(this))" class="addnote drop-here"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a>');
			grid_li[i] = $compile(grid_li[i])($scope);
		}
		//$('#grid').html('<li data-row="1" data-col="1" data-sizex="1" data-sizey="1"><a href="javascript:void(0)" class="addnote"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a></li><li data-row="1" data-col="2" data-sizex="1" data-sizey="1"><a href="javascript:void(0)" class="addnote"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a></li><li data-row="2" data-col="1" data-sizex="1" data-sizey="1"><a href="javascript:void(0)" class="addnote"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a></li><li data-row="2" data-col="2" data-sizex="1" data-sizey="1"><a href="javascript:void(0)" class="addnote"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a></li>');
		$('#grid').find('li').each(function(){
			$(this).html(grid_li[$(this).index()]);
		})
		
		$('#grid').hide();
		// Back sidebar
		$('.filterMenu-sidebar').show();
		bodyClass.addClass(currentPageClass);
		$('.holder-act').fadeOut(400)
		// Remove page act
		bodyClass.removeClass('act-page');

		// Back full header only for home page
		if(bodyClass.hasClass('home-page')){
			bodyClass.removeClass('small-fixed-header');
		}
		
		//check the cases and redirect accordingly
		$scope.checkPageFlagAndRedirect();
		
		// show back all icons
		$('#tary_full_onClose').hide()
		$('#filterbar').find('a').show();
		// modified by parul to change body padding 13012015
		//$('body').css('padding-top')=$('body').css('padding-top')-
		//var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
		//bodyHeight=bodyHeight+43;
		//$("body").css({'padding-top':bodyHeight+'px'});
		return false;
	}
	
	
	/*________________________________________________________________________
		* @Date:      	14 May 2015
		* @Method :   	reset_tray
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used reset media tray to its initial location .
		* @Param:     	-
		* @Return:    	no
	_________________________________________________________________________
	*/  
	$scope.reset_tray = function(){
		$('#media-tray-elements').css({'margin-left':'0px'})
		if($('#media-tray-elements').children().length>5){
			$('.avarrow-left').show()
			$('.avarrow-right').show()	 
		}else{
			$('.avarrow-left').hide()
			$('.avarrow-right').hide()	 
		}
	};
	/********************************************END******************************************************/	 
	var allPageFlags = [];
	allPageFlags = {
		writeNote:'write-note',
		sgOther:'SG-Other',
		sgMontage:'SG-Montage',
		stOther:'ST-Other',
		stMontage:'ST-Montage',
		dPage:'D',
		singleMedia:'single-media',
		makeMontage:'make-montage',
		saveMontage:'save-montage'
	};
	
	$scope.checkPageFlagAndRedirect = function (){
		var flag__init = function(){
			//Movement Flags
			$scope.pageThemeMovement = false;
			$scope.sMediaMovement = false;
			$scope.dMediaMovement = false;
		}
		
		flag__init();
	
		var redirectionFlag = '';
		//check the current page Flag
		for (var key in allPageFlags) {
			if (allPageFlags.hasOwnProperty(key)) {
				console.log(key + " -> " + allPageFlags[key]);
				if( $scope[key] ){
					redirectionFlag = allPageFlags[key];
				}
			}
		}
		//console.log("Redirection Flag = ",redirectionFlag);
		//return true;
		
		var finalRflag = '';
		switch(redirectionFlag){
			//case-1 : On Write Note click
			case 'write-note':	
					//alert('write-note');
					finalRflag = 'search-gallery';
					break;
			
			//case-2 : On SG-other than Montage type media click
			case 'SG-Other':
				finalRflag = 'search-gallery';
				break;
				
			//case-3 : On SG-Montage type media click
			case 'SG-Montage':
				//alert('SG-Montage');
				finalRflag = 'search-gallery';
				break;
				
			//case-4 : On ST-other than Montage type media click
			case 'ST-Other':
				//alert('ST-Image or ST-Notes or ST-Link');
				
				finalRflag = 'search-gallery';
				break;
				
			//case-5 : On ST-Montage type media click
			case 'ST-Montage':
				//alert('ST-Montage');
				
				finalRflag = 'search-gallery';
				break;
			
			//case-6 : On D-other than Montage type media click
			case 'D':
				//alert('Discuss');
				finalRflag = 'discuss-page';
				break;
				
			case 'single-media':
				//alert('single-media');
				
				finalRflag = 'search-gallery';
				break;
			//make-montage case
			case 'make-montage':
				//alert('make-montage');
				
				finalRflag = 'search-gallery';
				break;
			
			//save montage case
			case 'save-montage':
				//alert('save-montage');
				
				finalRflag = 'search-gallery';
				break;
				
			default:
				//alert('Unknown case!');
				finalRflag = 'discuss-page'; //24Feb2015 for browser back button.
				break;
		}
		
		//redirecting....
		switch( finalRflag ){
			case 'search-gallery':
				//alert('Redirecting in search gallery');
				$scope.pageThemeMovement = true;
				$scope.showSearchGallery();
				break;
				
			case 'discuss-page':
				//alert("changed the value");
				$scope.pageThemeMovement = true;
				$scope.showDiscussPage();
				break;
				
			default:
				$scope.showSearchGallery();
				//alert('Unknown redirection point Error!');
				break;
		}
	
	}
	
	$scope.showSearchGallery = function(){
		$('#discuss_elements').hide(function(){
			$scope.__openSearchPage();
			if( !($('#search_elements #thumbs').find('li').is('li')) ){
				$scope.changePT();
				//alert('This is the first time, we need data for search gallery!');
			}
		})
	}
	
	$scope.showDiscussPage = function(){
		$('#search_elements').hide(function(){
			$scope.__openDiscussPage();
		})
	}
	
	
	$scope.setExpandedScreenView = function(){
		$('.center').css({"display":"none"});
		$("body").css({"padding-top":"100px"});
	}
	
	$scope.setNormalScreenView = function(){
		$('.center').css({"display":"block"});
		$("body").css({"padding-top":"234px"});
	}
	
	$scope.isOnSearchActPage = false;
	$scope.isOnDiscussActPage = false;
	
	$scope.isPrevSearchMedia = false;
	$scope.isNextSearchMedia = false;
	
	$scope.prevHoverIn__OnAct = function(){
		$scope.isPrevSearchMedia = true;
		$scope.isNextSearchMedia = false;
		
		$scope.isOnSearchActPage = true;
		$scope.isOnDiscussActPage = false;
	}
	
	
	$scope.nextHoverIn__OnAct = function(){
		$scope.isNextSearchMedia = true;
		$scope.isPrevSearchMedia = false;
		
		$scope.isOnSearchActPage = true;
		$scope.isOnDiscussActPage = false;
	}
	
	$scope.prevHoverOut__OnAct = function(){
		$scope.isPrevSearchMedia = false;
		//$scope.isNextSearchMedia = true;
		
		$scope.isOnSearchActPage = false;
		$scope.isOnDiscussActPage = true;
	}
	
	
	$scope.nextHoverOut__OnAct = function(){
		$scope.isNextSearchMedia = false;
		//$scope.isPrevSearchMedia = true;
		
		$scope.isOnSearchActPage = false;
		$scope.isOnDiscussActPage = true;
	}
	
	//set the search header (Header1)
	$scope.__openSearchPage = function(){
		//$scope.setPageFlag('SG','DragMedia'); //DragMedia as by-default, can change this in future or make it standard- (explain to team)
		$scope.__closeDiscussListPage();
		$scope.__closeMviewStatementPage();
		$scope.__setSearchBody();
		$scope.__setSearchHeader();
		$scope.__setSearchFilterbar();
		$('#thumbs,#search_elements').fadeIn();
		$('#discuss_elements').hide();
		$('.search-view').hide();
	}
	
	$scope.__setSearchHeader = function (){
		$('#bighead-header1').show();
	}
	
	$scope.__setSearchBody = function (){
		$('body').css({'padding-top':'244px'});
		$('body').css({'background':'none repeat scroll 0 0 #181818'});
	}
	
	$scope.__setSearchFilterbar = function (){
		$('#filterbar').find('a').show();
	}
	
	$scope.__unsetSearchFilterbar = function (){
		$('#filterbar').find('a').hide();
	}
	
	var setDiscussMediaContainer = function(){
		console.log("----setting Discuss media container----");
	    $('.discuss-img-cont').each(function(){
			$(this).height($('.discuss-img-cont').first().width())
	    })
    
	    $('.discuss-img-cont a').each(function(){
			$(this).height($('.discuss-img-cont a img').width())
			height = $(this).height()	
			//console.log("$(this).height = ",height);
			//$(this).minHeight(height)
	    })
	}
	
	//set Discuss header (header2)
	$scope.__openDiscussPage = function(){
		//alert("discuss-2");
		$scope.switch_class_inverted()
		$scope.__openDiscussListPage();
		$scope.__setDiscussBody();
		$scope.__setDiscussHeader();
		$('#discuss_elements').show();
		$('#search_elements').fadeOut();
	}
	$scope.__setDiscussHeader = function (){
		$('#bighead-header1').hide()
		$scope.__unsetSearchFilterbar();
	}
	
	$scope.__setDiscussBody = function (){
		$('body').css({'background':'none repeat scroll 0 0 #fff'});  //for background color
		$('body').css({'padding-top':'0px'});
	}
	
	$scope.__openMviewStatementPage = function(){
		$scope.__closeSearchViewPage();
		$scope.__closeDiscussListPage();
		$scope.__setDiscussBody();
		$scope.__setDiscussHeader();
		$('#media_view_statements').show();
	}
	
	$scope.__closeMviewStatementPage = function(){
		$('#media_view_statements').hide();
	}
	
	$scope.__openSearchViewPage = function(){
		$('.search-view').show();
	}
	
	$scope.__closeSearchViewPage = function(){
		$('.search-view').hide();
	}
	
	$scope.__openDiscussListPage = function(){
		$('#discuss_list').show(function(){
			//$scope.setPageFlag('D');
			setTimeout(function(){
				$('#discuss_list #thumbs').show();
				setDiscussMediaContainer();
			},1000);
		});
	}
	
	$scope.__closeDiscussListPage = function(){
		$('#discuss_list').hide();
	}
	
	//- always at bottom...
	//by default discuss page 
	//$scope.__openDiscussPage(); - initial calling from index.html from changePT
});