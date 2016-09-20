var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('montageCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
$scope.link = {};
$scope.__isMontagePrivate = false;
/*________________________________________________________________________
* @Date:      	14 April 2015
* @Method :   	openNote_mctrl
* Created By: 	smartData Enterprises Ltd
* Modified On:	16 Aril 2015
* @Purpose:   	This function is called when user clicks on addnote in gridster.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.openNote_mctrl = function(pageId){
        if(pageId != null){
            //alert('work in progress');
            setTimeout(function(){
                $scope.note_case = false;
                $scope.note_montage_case = true;
                $scope.search_view_case = false;
                $scope.post_montage_case = false;
                $scope.$apply();
            },1);
            
        }
        else{
            //alert('work in progress');
            setTimeout(function(){
                $scope.note_case = false;
                $scope.note_montage_case = true;
                $scope.search_view_case = false;
                $scope.post_montage_case = false;
                $scope.$apply();
            },1);
            
        }
    }
/********************************************END******************************************************/	 


/*________________________________________________________________________
* @Date:      	14 April 2015
* @Method :   	close_note
* Created By: 	smartData Enterprises Ltd
* Modified On:	16 Aril 2015
* @Purpose:   	This is called when user closes add note screen
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.close_note = function(pageId){
        if(pageId != null){
            if ($('#'+pageId+' #grid').css('display')=='block') {
                $scope.montage_case_buttons_handler(pageId);
            }else{
                $scope.init__stateVar(pageId);
            }
            $('#'+pageId+' .edit_froala2').editable('setHTML','Start writing...');
            console.log('$scope.note_montage_case = ',$scope.note_montage_case);
             console.log('$scope.search_view_case = ',$scope.search_view_case);
            $('#'+pageId+' #note_forMontage').hide();
        }
        else{
            if ($('#grid').css('display')=='block') {
                $scope.montage_case_buttons_handler();
            }else{
                $scope.init__stateVar();
            }
            $('.edit_froala2').editable('setHTML','Start writing...');
            console.log('$scope.note_montage_case = ',$scope.note_montage_case);
             console.log('$scope.search_view_case = ',$scope.search_view_case);
            $('#note_forMontage').hide();
        }
        
    }
/********************************************END******************************************************/	 


/*________________________________________________________________________
* @Date:      	14 April 2015
* @Method :   	montage_case_buttons_handler
* Created By: 	smartData Enterprises Ltd
* Modified On:	16 Aril 2015
* @Purpose:   	This is used to set make montage state
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
	$scope.montage_case_buttons_handler = function(pageId){
            if(pageId != null){
                setTimeout(function(){
			console.log('---------************************************************----------');
			$scope.note_case = false;
			$scope.note_montage_case = false;
			$scope.search_view_case = false;
			$scope.post_montage_case = true;
			$scope.$apply();
		},1)
                
            }
            else{
                setTimeout(function(){
			console.log('---------************************************************----------');
			$scope.note_case = false;
			$scope.note_montage_case = false;
			$scope.search_view_case = false;
			$scope.post_montage_case = true;
			$scope.$apply();
		},1)
                
            }
	}
/********************************************END******************************************************/


/*________________________________________________________________________
* @Date:      	20 April 2015
* @Method :   	note_screenshot_for_montage
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to take screenshot of user custom notes for montage
* @Param:     	-
* @Return:    	yes
_________________________________________________________________________
*/
    $scope.note_screenshot_for_montage = function(pageId){
        if(pageId != null){
            $('#'+pageId+' .edit_froala2').css({'padding':'15px'});
            $('#overlay2').show();
            $('#overlayContent2').show();
            $('#'+pageId+' .edit_froala2').html2canvas({
                useCORS:true,
                onrendered: function (canvas) {
                    console.log(canvas);
                    var imgsrc = canvas.toDataURL("image/png");
                    var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
                    fields = {
                        image: base64Data,
                    };
                    /*--thumbnail upload--*/

                    $http.post('/media/note_screenshot',fields).then(function (data, status, headers, config) {
                        if(data.data.code==200){
                            console.log("-------note_screenshot--done--------");
                            console.log('link'+data.data.link);
                            var obj = angular.element('<div>'+$('#'+pageId+' .edit_froala2').editable('getHTML', true, true)+'</div>');
                            obj.find('a').attr('target','_blank');
                            //$scope.note_data = $('.edit_froala2').editable('getHTML', true, true);
                            $scope.note_data = obj.html();
                            //$scope.notes.comment = $scope.note_data;
                            var link = data.data.link;
                            link = link.split('/');
                            var final_thumb =  link[link.length -1];
                            $scope.note_thumb = final_thumb;
                            $scope.note_data = $scope.note_data.replace(/</g,"@less@");
                            $scope.note_data = $scope.note_data.replace(/>/g,"gre@ter");
                            var new_note = angular.element('<p class="innerimg-wrap"><img alt="Note" src='+data.data.link+' ng-src='+data.data.link+' class="noteElement"></p><p style="display: none" class="noteContent" >'+$scope.note_data+'</p><div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                            $('#'+pageId+' #grid li[data-row='+$scope.row_no+'][data-col='+$scope.col_no+']').html(new_note);

                            $scope.addtags_note(pageId);
                            $scope.close_note(pageId);

                        }
                    });	
                    /*------*/
                }
            });
            setTimeout(function(){
                $('#'+pageId+' .edit_froala2').css({'padding':'0px'});
                $('#'+pageId+' .edit_froala2').editable({'setHTML':'Start writing...'});
            },6000)
            
        }
        else{
            $('.edit_froala2').css({'padding':'15px'});
            $('#overlay2').show();
            $('#overlayContent2').show();
            $('.edit_froala2').html2canvas({
                useCORS:true,
                onrendered: function (canvas) {
                    console.log(canvas);
                    var imgsrc = canvas.toDataURL("image/png");
                    var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
                    fields = {
                        image: base64Data,
                    };
                    /*--thumbnail upload--*/

                    $http.post('/media/note_screenshot',fields).then(function (data, status, headers, config) {
                        if(data.data.code==200){
                            console.log("-------note_screenshot--done--------");
                            console.log('link'+data.data.link);
                            var obj = angular.element('<div>'+$('.edit_froala2').editable('getHTML', true, true)+'</div>');
                            obj.find('a').attr('target','_blank');
                            //$scope.note_data = $('.edit_froala2').editable('getHTML', true, true);
                            $scope.note_data = obj.html();
                            //$scope.notes.comment = $scope.note_data;
                            var link = data.data.link;
                            link = link.split('/');
                            var final_thumb =  link[link.length -1];
                            $scope.note_thumb = final_thumb;
                            $scope.note_data = $scope.note_data.replace(/</g,"@less@");
                            $scope.note_data = $scope.note_data.replace(/>/g,"gre@ter");
                            var new_note = angular.element('<p class="innerimg-wrap"><img alt="Note" src='+data.data.link+' ng-src='+data.data.link+' class="noteElement"></p><p style="display: none" class="noteContent" >'+$scope.note_data+'</p><div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                            $('#grid li[data-row='+$scope.row_no+'][data-col='+$scope.col_no+']').html(new_note);

                            $scope.addtags_note();
                            $scope.close_note();

                        }
                    });	
                    /*------*/
                }
            });
            setTimeout(function(){
                $('.edit_froala2').css({'padding':'0px'});
                $('.edit_froala2').editable({'setHTML':'Start writing...'});
            },6000)
            
        }
    }
/********************************************END******************************************************/


/*________________________________________________________________________
* @Date:      	13 May 2015
* @Method :   	addtags_note
* Created By: 	smartData Enterprises Ltd
* Modified On:	16 june
* @Purpose:   	This is used add entry of note to media table
* @Param:     	-
* @Return:    	- 
_________________________________________________________________________
*/
    $scope.addtags_note = function(pageId){
        if(pageId != null){
            var fields={};
            fields.content = $scope.note_data;
            fields.type = 'Notes';
            fields.thumbnail = $scope.note_thumb;
            $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                if(data.data.code==200){
                    $scope.uploadedLink=data.data.response;
                    $scope.mon_note_id = $scope.uploadedLink._id;
                    var row = $scope.row_no;
                    var col = $scope.col_no;
                    $window.item_ids[$('#'+pageId+' #grid li[data-row='+row+'][data-col='+col+']').index()] = $scope.mon_note_id;
                    console.log('8888888888888888888888888888888888888888888888888888888888888888888888');
                    console.log($window.item_ids);
                    console.log('8888888888888888888888888888888888888888888888888888888888888888888888');
                    $scope.mon_note_id = null;
                    $scope.link.isPrivate = 1;
                    $scope.link.mmt = '5464931fde9f6868484be3d7';
                    $scope.link.gt = $scope.selectedgt;
                    $scope.link.gtsa = $scope.selectedgtsa;
                    $scope.link.Action = 'Post';
                    if ($('#'+pageId+' #tag-Input-Token2').val() != '') {
                        $scope.link.Tags=$('#'+pageId+' #tag-Input-Token2').val();
                    }
                    $scope.link.MediaID = $scope.uploadedLink._id;
                    $scope.link.data = {};
                    $scope.link.board = $scope.page_id;
                    $scope.link.data = $scope.uploadedLink;        
                    console.log("----input data for addTagsToUploadedMedia = ",$scope.link);
                    $http.post('/media/addTagsToUploadedMedia',$scope.link).then(function (data, status, headers, config) {
                        $('#'+pageId+' .ui-dialog-titlebar-close').trigger('click');
                        setTimeout(function(){
                            $('#overlay2').hide();
                            $('#overlayContent2').hide();
                            if (data.data.response[0] != undefined && data.data.response[0] != null) {
                                $scope.setFlashInstant('Media added to grid successfully!' , 'success');
                            }	
                            $scope.uploadedLink={}; //added on 17122014 by manishp
                        },1000)
                        //media_ele.test();
                    });
                }
            }); 
            
        }
        else{
            var fields={};
            fields.content = $scope.note_data;
            fields.type = 'Notes';
            fields.thumbnail = $scope.note_thumb;
            $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                if(data.data.code==200){
                    $scope.uploadedLink=data.data.response;
                    $scope.mon_note_id = $scope.uploadedLink._id;
                    var row = $scope.row_no;
                    var col = $scope.col_no;
                    $window.item_ids[$('#grid li[data-row='+row+'][data-col='+col+']').index()] = $scope.mon_note_id;
                    console.log('8888888888888888888888888888888888888888888888888888888888888888888888');
                    console.log($window.item_ids);
                    console.log('8888888888888888888888888888888888888888888888888888888888888888888888');
                    $scope.mon_note_id = null;
                    $scope.link.isPrivate = 1;
                    $scope.link.mmt = '5464931fde9f6868484be3d7';
                    $scope.link.gt = $scope.selectedgt;
                    $scope.link.gtsa = $scope.selectedgtsa;
                    $scope.link.Action = 'Post';
                    if ($('#tag-Input-Token2').val() != '') {
                        $scope.link.Tags=$('#tag-Input-Token2').val();
                    }
                    $scope.link.MediaID = $scope.uploadedLink._id;
                    $scope.link.data = {};
                    $scope.link.board = $scope.page_id;
                    $scope.link.data = $scope.uploadedLink;        
                    console.log("----input data for addTagsToUploadedMedia = ",$scope.link);
                    $http.post('/media/addTagsToUploadedMedia',$scope.link).then(function (data, status, headers, config) {
                        $('.ui-dialog-titlebar-close').trigger('click');
                        setTimeout(function(){
                            $('#overlay2').hide();
                            $('#overlayContent2').hide();
                            if (data.data.response[0] != undefined && data.data.response[0] != null) {
                                $scope.setFlashInstant('Media added to grid successfully!' , 'success');
                            }	
                            $scope.uploadedLink={}; //added on 17122014 by manishp
                        },1000)
                        //media_ele.test();
                    });
                }
            }); 
            
        }
    };
/********************************************END******************************************************/

 /*________________________________________________________________________
* @Date:      	20 April 2015
* @Method :   	postMontage_mCtrl
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used to take screenshot of user custom notes
* @Param:     	-
* @Return:    	yes
_________________________________________________________________________
*/
    $scope.postMontage_mCtrl = function(pageId){
        if(pageId != null){
            console.log('---------postMontage_mCtrl--------');
        console.log($scope.__isMontagePrivate);
        var fields={};
        $('#'+pageId+' #grid_clone').html($('#'+pageId+' #grid').html());
		$('#'+pageId+' #grid_clone').find('li').each(function(){
            if ($(this).find('.addnote').is('a')) {
                $(this).remove()
            }
            else{
                $(this).find('.close_icon').remove()
            }
        });
        $('#'+pageId+' #grid').hide();
		$('#'+pageId+' .m-gridster .gridster').addClass('noScroll');
        if ($('#'+pageId+' #grid_clone').find('li').length>2) {
            $('#'+pageId+' #grid_clone').css({'height':'444px'});
        }else{
            $('#'+pageId+' #grid_clone li').each(function(){
                if($(this).attr('data-row') > 1){
                    if(!($('#'+pageId+' #grid_clone li[data-row="1"][data-col="1"]').is('li'))){
                        $(this).attr({'data-row':'1'});
                        $(this).attr({'data-col':'1'});
                        
                    }else if (!($('#'+pageId+' #grid_clone li[data-row="1"][data-col="2"]').is('li'))){
                        $(this).attr({'data-row':'1'});
                        $(this).attr({'data-col':'2'});
                    }
                }else{
                }
            });
            $('#'+pageId+' #grid_clone').css({'height':'223px'});
        }
        $('#'+pageId+' #grid_clone').css({'width':'444px'});
        $('#'+pageId+' #grid_clone').show();
        var grid_data =$('#'+pageId+' #grid_clone').html();
		var grid_replace = grid_data.split('<a title="Setting" class="setting_gs closemedia pos-l-t" href="javascript:void(0);" onclick="montage_ele.settingElem($(this) , "'+pageId+'")"><span class="m-icon settingicon"></span></a>');
		grid_replace = grid_replace.join("");
		grid_replace = grid_replace.split('<a title="Close" class="close_gs closemedia pos-r-t" href="javascript:void(0);" onclick="montage_ele.deleteElem($(this) , "'+pageId+'")"><span class="m-icon closeicon"></span></a>');
		grid_replace = grid_replace.join("");
        $('#'+pageId+' #grid_clone').html(grid_replace);
		//--- html to canvas...
		$('#'+pageId+' #grid_clone').html2canvas({
			useCORS:true,
			onrendered: function (canvas) {  
				var imgsrc = canvas.toDataURL("image/png");
				var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
				$('#'+pageId+' #grid_clone').html('');
                $('#'+pageId+' #grid_clone').hide();
                $('#'+pageId+' .m-gridster .gridster').removeClass('noScroll');
				$('#'+pageId+' #grid').show();
				
                $('#'+pageId+' #grid_clone').css({'height':'0px'});
                $('#'+pageId+' #grid_clone').css({'width':'0px'});
				fields.content=grid_replace;
				fields.type='Montage';
                fields.Statement = $('#'+pageId+' .edit_froala1').editable('getHTML', true, true);
                fields.Statement  = (fields.Statement == '<p class="fr-tag">Start writing...</p>') ? '':fields.Statement;
				$http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
					if(data.data.code==200){
						$scope.uploadedLink=data.data.response;						
						$('#'+pageId+' .link_upload_themes').trigger('click');
						$('#'+pageId+' .link_holder').html(fields.content);            
						$('#'+pageId+' .link_holder').children().css('width',$('#'+pageId+' .link_holder').width()+'px');
						
						fields = {
							image: base64Data,
							montage_id: $scope.uploadedLink._id         
						};
						/*--thumbnail upload--*/
						$http.post('/media/updateMontage',fields).then(function (data, status, headers, config) {
							if(data.data.code==200){
								console.log("---updateMontage------------");
								$scope.uploadedLink.thumbnail=data.data.thumbnail;
								$('#'+pageId+' .link_holder').html('<img src="../assets/Media/img/'+$scope.uploadedLink.thumbnail+'">');
                                if ($scope.__isMontagePrivate == true) {
                                    $('#'+pageId+' #dialog1').css({'display':'none'});
                                    $scope.link.isPrivate = 1;    
                                }
							}
						});	
					}
				}); 				
			}
		}); 
            
        }
        else{
            console.log('---------postMontage_mCtrl--------');
        console.log($scope.__isMontagePrivate);
        var fields={};
        $('#grid_clone').html($('#grid').html());
		$('#grid_clone').find('li').each(function(){
            if ($(this).find('.addnote').is('a')) {
                $(this).remove()
            }
            else{
                $(this).find('.close_icon').remove()
            }
        });
        $('#grid').hide();
		$('.m-gridster .gridster').addClass('noScroll');
        if ($('#grid_clone').find('li').length>2) {
            $('#grid_clone').css({'height':'444px'});
        }else{
            $('#grid_clone li').each(function(){
                if($(this).attr('data-row') > 1){
                    if(!($('#grid_clone li[data-row="1"][data-col="1"]').is('li'))){
                        $(this).attr({'data-row':'1'});
                        $(this).attr({'data-col':'1'});
                        
                    }else if (!($('#grid_clone li[data-row="1"][data-col="2"]').is('li'))){
                        $(this).attr({'data-row':'1'});
                        $(this).attr({'data-col':'2'});
                    }
                }else{
                }
            });
            $('#grid_clone').css({'height':'223px'});
        }
        $('#grid_clone').css({'width':'444px'});
        $('#grid_clone').show();
        var grid_data =$('#grid_clone').html();
		var grid_replace = grid_data.split('<a title="Setting" class="setting_gs closemedia pos-l-t" href="javascript:void(0);" onclick="montage_ele.settingElem($(this))"><span class="m-icon settingicon"></span></a>');
		grid_replace = grid_replace.join("");
		grid_replace = grid_replace.split('<a title="Close" class="close_gs closemedia pos-r-t" href="javascript:void(0);" onclick="montage_ele.deleteElem($(this))"><span class="m-icon closeicon"></span></a>');
		grid_replace = grid_replace.join("");
        $('#grid_clone').html(grid_replace);
		//--- html to canvas...
		$('#grid_clone').html2canvas({
			useCORS:true,
			onrendered: function (canvas) {  
				var imgsrc = canvas.toDataURL("image/png");
				var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
				$('#grid_clone').html('');
                $('#grid_clone').hide();
                $('.m-gridster .gridster').removeClass('noScroll');
				$('#grid').show();
				
                $('#grid_clone').css({'height':'0px'});
                $('#grid_clone').css({'width':'0px'});
				fields.content=grid_replace;
				fields.type='Montage';
                fields.Statement = $('.edit_froala1').editable('getHTML', true, true);
                fields.Statement  = (fields.Statement == '<p class="fr-tag">Start writing...</p>') ? '':fields.Statement;
				$http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
					if(data.data.code==200){
						$scope.uploadedLink=data.data.response;						
						$('.link_upload_themes').trigger('click');
						$('.link_holder').html(fields.content);            
						$('.link_holder').children().css('width',$('.link_holder').width()+'px');
						
						fields = {
							image: base64Data,
							montage_id: $scope.uploadedLink._id         
						};
						/*--thumbnail upload--*/
						$http.post('/media/updateMontage',fields).then(function (data, status, headers, config) {
							if(data.data.code==200){
								console.log("---updateMontage------------");
								$scope.uploadedLink.thumbnail=data.data.thumbnail;
								$('.link_holder').html('<img src="../assets/Media/img/'+$scope.uploadedLink.thumbnail+'">');
                                if ($scope.__isMontagePrivate == true) {
                                    $('#dialog1').css({'display':'none'});
                                    $scope.link.isPrivate = 1;    
                                }
							}
						});	
					}
				}); 				
			}
		}); 
            
        }
    }
/********************************************END******************************************************/


/*________________________________________________________________________
* @Date:      	07042015 April 2015
* @Method :   	closePrivate
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This function is used to close private case popup.
* @Param:     	0
* @Return:    	no
_________________________________________________________________________
*/
    $scope.closePrivate = function(pageId){
        if(pageId != null){
            console.log('-----------------closePrivate----------------');
            $('#'+pageId+' #private_media_pop').css({'display':'none'});
            $('#'+pageId+' #private_media_pop1').css({'display':'none'});
            
        }
        else{
            console.log('-----------------closePrivate----------------');
            $('#private_media_pop').css({'display':'none'});
            $('#private_media_pop1').css({'display':'none'});
            
        }
    }
/********************************************END******************************************************/


/*________________________________________________________________________
* @Date:      	29 April 2015
* @Method :   	keep_private
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is used set flag that the current montage we are making contains a private media.
* @Param:     	-
* @Return:    	yes
_________________________________________________________________________
*/
$scope.keep_private = function(pageId){
    if(pageId != null){
        $scope.__isMontagePrivate = true;
        console.log($scope.trayObject);
        $scope.closePrivate(pageId);
        $scope.trayObject.click(pageId);
        
    }
    else{
        $scope.__isMontagePrivate = true;
        console.log($scope.trayObject);
        $scope.closePrivate(pageId);
        $scope.trayObject.click(pageId);
        
    }
}

/********************************************END******************************************************/


/*________________________________________________________________________
* @Date:      	14 April 2015
* @Method :   	makePublic
* Created By: 	smartData Enterprises Ltd
* Modified On:	16 Aril 2015
* @Purpose:   	This is used to make private media in tray public
* @Param:     	-
* @Return:    	yes
_________________________________________________________________________
*/
    $scope.makePublic = function(id,obj_index , m_case , pageId){
        if(pageId != null){
            $scope.fields={};
            if (m_case == 'tray_case') {
                 $scope.fields.ID=id;
            }else{
                $scope.fields.ID=$scope.mediasData._id;
            }
            $http.post('/media/makePublic',$scope.fields).then(function(response){
                if (response.data.code == '200') {
                    $scope.setFlashInstant('Media is now public.' , 'success');

                    $('#'+pageId+' #private_media_pop').hide();
                    if (m_case == 'tray_case') {
                        $('#'+pageId+' #searchList__mediaTray li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                        $('#'+pageId+' #discussList__mediaTray li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                        $('#'+pageId+' #searchView-media-tray li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                    }else{
                        $('#'+pageId+' #searchList__mediaTray li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
                        $('#'+pageId+' #discussList__mediaTray li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
                        $('#'+pageId+' #searchView-media-tray li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
                        $('#'+pageId+' #holder-box').attr({'is-private':'0'});
                    }
                    setTimeout(function(){
                        console.log($scope.trayObject);
                        $scope.trayObject.click(pageId);
                    },100)
                    $scope.closePrivate(pageId);
                }else{
                    $scope.setFlashInstant('<span style="color:red">Error! There was some error while processing your request </span>' , 'success');
                }
            })
            
        }
        else{
            $scope.fields={};
            if (m_case == 'tray_case') {
                 $scope.fields.ID=id;
            }else{
                $scope.fields.ID=$scope.mediasData._id;
            }
            $http.post('/media/makePublic',$scope.fields).then(function(response){
                if (response.data.code == '200') {
                    $scope.setFlashInstant('Media is now public.' , 'success');

                    $('#private_media_pop').hide();
                    if (m_case == 'tray_case') {
                        $('#searchList__mediaTray li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                        $('#discussList__mediaTray li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                        $('#searchView-media-tray li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                    }else{
                        $('#searchList__mediaTray li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
                        $('#discussList__mediaTray li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
                        $('#searchView-media-tray li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
                        $('#holder-box').attr({'is-private':'0'});
                    }
                    setTimeout(function(){
                        console.log($scope.trayObject);
                        $scope.trayObject.click();
                    },100)
                    $scope.closePrivate();
                }else{
                    $scope.setFlashInstant('<span style="color:red">Error! There was some error while processing your request </span>' , 'success');
                }
            })
            
        }
    }	
/********************************************END******************************************************/	 




/*________________________________________________________________________
* @Date:      	4 Sep 2015
* @Method :   	delSingleMedia
* Created By: 	smartData Enterprises Ltd
* Modified On:	
* @Purpose:   	del single media on platform(search view)
* @Param:     	-
* @Return:    	yes
_________________________________________________________________________
*/
$scope.delSingleMedia = function(pageId){
    if(pageId != null){
        if ( $scope.countOfTrayMedia < 15) {
		$scope.addtoTray_delCase($scope.mediasData._id , pageId);
		$('#'+pageId+' .gridster.gridster-montage').removeClass('sepcial_montageCase');
		$scope.__isMontagePrivate = false;
		$scope.reset_grid_holderBox(pageId);
		$scope.showCloseSingle = false;
		$scope.showAddImage = true;
		//$scope.close_holderAct();
	}else{
		$('#'+pageId+' #tary_full_onClose').show();
	}

    }
    else{
        if ( $scope.countOfTrayMedia < 15) {
		$scope.addtoTray_delCase($scope.mediasData._id);
		$('.gridster.gridster-montage').removeClass('sepcial_montageCase');
		$scope.__isMontagePrivate = false;
		$scope.reset_grid_holderBox();
		$scope.showCloseSingle = false;
		$scope.showAddImage = true;
		//$scope.close_holderAct();
	}else{
		$('#tary_full_onClose').show();
	}

    }
}



}]);