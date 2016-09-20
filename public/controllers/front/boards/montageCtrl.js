var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('montageCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    $scope.del_grid_noteCase = false;
    /*________________________________________________________________________
    * @Date:      	14 April 2015
    * @Method :   	init__stateVar
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	16 Aril 2015
    * @Purpose:   	This is used initialize alls state managing variables
    * @Param:     	-
    * @Return:    	no
    _________________________________________________________________________
    */
    
    $scope.init__stateVar = function(){
		$('#note_forMontage').hide();
        $('#note_forMontage2').hide();
        $scope.note_case = false;
        $scope.search_view_case = true;
        $scope.note_montage_case = false;
        $scope.post_montage_case = false;
    }
    $scope.init__stateVar();
    /********************************************END******************************************************/	 
    
    
    
    
    /*________________________________________________________________________
    * @Date:      	23 April 2015
    * @Method :   	close_noteBoardCase
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	16 Aril 2015
    * @Purpose:   	This is used initialize alls state managing variables
    * @Param:     	-
    * @Return:    	no
    _________________________________________________________________________
    */
    
    $scope.close_noteBoardCase = function(){
        $('body').removeClass('note_padding');
        $scope.init__stateVar();
		$('.edit_froala3').editable('setHTML','Start writing...');
    }
    /********************************************END******************************************************/
    
    
     /*________________________________________________________________________
    * @Date:      	23 April 2015
    * @Method :   	init__note_state
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-
    * @Purpose:   	This is used initialize alls state managing variables
    * @Param:     	-
    * @Return:    	no
    _________________________________________________________________________
    */
    
    $scope.init__note_state = function(){
		$('#note_forMontage').hide();
        $scope.note_case = true;
        $scope.search_view_case = false;
        $scope.note_montage_case = false;
        $scope.post_montage_case = false;
    }
    
    /********************************************END******************************************************/	 
      
    
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
    $scope.openNote_mctrl = function(){
        //alert('work in progress');
        setTimeout(function(){
            $scope.note_case = false;
            $scope.note_montage_case = true;
            $scope.search_view_case = false;
            $scope.post_montage_case = false;
            $scope.$apply();
        },1);
    }
    /********************************************END******************************************************/	 
    
    
    
    /*________________________________________________________________________
    * @Date:      	21 April 2015
    * @Method :   	openNote_mctrl_toBoard
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-
    * @Purpose:   	This function is called when user  tries to add note to board.
    * @Param:     	-
    * @Return:    	no
    _________________________________________________________________________
    */
    $scope.openNote_mctrl_toBoard = function(){
        //alert('work in progress');
        setTimeout(function(){
            $scope.note_case = true;
            $scope.note_montage_case = false;
            $scope.search_view_case = false;
            $scope.post_montage_case = false;
            $scope.$apply();
        },1);
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
    $scope.montage_case_buttons_handler = function(){
        setTimeout(function(){
            console.log('---------************************************************----------');
            $scope.note_case = false;
            $scope.note_montage_case = false;
            $scope.search_view_case = false;
            $scope.post_montage_case = true;
            $scope.$apply();
        },1)
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
        
    $scope.close_note = function(){
        if ($('#grid').css('display')=='block') {
            $scope.montage_case_buttons_handler();
        }else{
            $scope.init__stateVar();
        }
        //setTimeout(function(){
        //    $scope.$apply();
        //},10);
        $('.edit_froala2').editable('setHTML','Start writing...');
        console.log('$scope.note_montage_case = ',$scope.note_montage_case);
         console.log('$scope.search_view_case = ',$scope.search_view_case);
        $('#note_forMontage').hide();
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
    $scope.makePublic = function(id,obj_index , m_case){
        //alert('obj_stage_index'+obj_stage_index);
        console.log('obj_index'+obj_index);
        console.log('m_case'+m_case);
        
        $scope.fields={};
        if (m_case == 'tray_case') {
             $scope.fields.ID=id;
        }else{
            $scope.fields.ID=$scope.mediasData._id;
        }
        $http.post('/media/makePublic',$scope.fields).then(function(response){
            //console.log(response);
            if (response.data.code == '200') {
                $scope.setFlashInstant('Media is now public.' , 'success');
                
                $('#private_media_pop').hide();
                if (m_case == 'tray_case') {
                    $('#media-tray-elements li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                    $('#discuss_list #search-media-tray li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                    $('.search-view #search-media-tray li:eq('+obj_index+')').find('a').attr({'is-private':'0'});
                }else{
                    $('#media-tray-elements li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
                    $('#discuss_list #search-media-tray li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
                    $('.search-view #search-media-tray li:eq('+obj_stage_index+')').find('a').attr({'is-private':'0'});
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
    //parul 20042015

    $scope.note_screenshot_for_montage = function(){
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
                        $scope.notes.comment = $scope.note_data;
                        var link = data.data.link;
                        link = link.split('/');
                        var final_thumb =  link[link.length -1];
                        $scope.notes.thumbnail = final_thumb;
                        $scope.note_data = $scope.note_data.replace(/</g,"@less@");
                        $scope.note_data = $scope.note_data.replace(/>/g,"gre@ter");
                        //var new_note = angular.element('<p class="innerimg-wrap"><img alt="Note" src='+data.data.link+' ng-src='+data.data.link+' class="noteElement"></p><p style="display: none" class="noteContent" ng-bind-html='+$scope.note_data+'></p><div onclick="del_grid($(this))" class="close_icon" title="Delete"></div>');
                        var new_note = angular.element('<p class="innerimg-wrap"><img alt="Note" src='+data.data.link+' ng-src='+data.data.link+' class="noteElement"></p><p style="display: none" class="noteContent" >'+$scope.note_data+'</p><div onclick="del_grid($(this))" class="close_icon" title="Delete"></div>');
                        $('#grid li[data-row='+$scope.row_no+'][data-col='+$scope.col_no+']').html(new_note);
                        $scope.addtags_note();
                        $scope.close_note();
                        
                    }
                });	
                /*------*/
			}
		});
        setTimeout(function(){
            $('.edit_froala3').css({'padding':'0px'});
            //$('.edit_froala3').css({'border': 'none'});
        },6000)
    }
    /********************************************END******************************************************/
    

    
    
    /*________________________________________________________________________
    * @Date:      	13 May 2015
    * @Method :   	addtags_note
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-
    * @Purpose:   	This is used add entry of note to media table
    * @Param:     	-
    * @Return:    	- 
    _________________________________________________________________________
    */
    $scope.addtags_note = function(){
        var fields={};
        fields.content = $scope.notes.comment;
        fields.type = 'Notes';
        fields.thumbnail = $scope.notes.thumbnail;
        $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
            if(data.data.code==200){
                $scope.uploadedLink=data.data.response;
                $scope.mon_note_id = $scope.uploadedLink._id;
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
                $scope.link.board = $stateParams.id;
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
                });
            }
        }); 
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
    //parul 20042015
	$scope.postMontage_mCtrl = function(){
        
        var fields={};
        $('#grid_clone').html($('#grid').html());
		$('#grid_clone').find('li').each(function(){
            if ($(this).find('.addnote').is('a')) {
                $(this).remove()
            }
            else{
                $(this).find('.close_icon').remove()
            }
        })
        $('#grid').hide();
        if ($('#grid_clone').find('li').length>2) {
            
            $('#grid_clone').css({'height':'444px'});
        }else{
            $('#grid_clone li').each(function(){
                if($(this).attr('data-row') > 1){
                    //alert('first');
                    //alert($('#grid li[data-row="1"][data-col="1"]').is('li'))
                    if(!($('#grid_clone li[data-row="1"][data-col="1"]').is('li'))){
                        $(this).attr({'data-row':'1'});
                        $(this).attr({'data-col':'1'});
                        
                    }else if (!($('#grid_clone li[data-row="1"][data-col="2"]').is('li'))){
                        $(this).attr({'data-row':'1'});
                        $(this).attr({'data-col':'2'});
                    }
                }else{
                    //alert('second');
                    
                }
            });
            $('#grid_clone').css({'height':'223px'});
        }
        
        $('#grid_clone').css({'width':'444px'});
        $('#grid_clone').show();
        var grid_data =$('#grid_clone').html();
		var grid_replace = grid_data.split('<a title="Setting" class="setting_gs closemedia pos-l-t" href="javascript:void(0);" onclick="montageObject.settingElem($(this))"><span class="m-icon settingicon"></span></a>');
		grid_replace = grid_replace.join("");
		grid_replace = grid_replace.split('<a title="Close" class="close_gs closemedia pos-r-t" href="javascript:void(0);" onclick="montageObject.deleteElem($(this))"><span class="m-icon closeicon"></span></a>');
		grid_replace = grid_replace.join("");
        //return;
        $('#grid_clone').html(grid_replace);
		//--- html to canvas...
        
		$('#grid_clone').html2canvas({
			useCORS:true,
			onrendered: function (canvas) {  
				var imgsrc = canvas.toDataURL("image/png");
				var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
				$('#grid_clone').html('');
                $('#grid_clone').hide();
                $('#grid').show();
                $('#grid_clone').css({'height':'0px'});
                 $('#grid_clone').css({'width':'0px'});
				fields.content=grid_replace;
				fields.type='Montage';
                fields.Statement = $('.edit_froala1').editable('getHTML', true, true);
                fields.Statement  = (fields.Statement == '<p class="fr-tag">Start writing...</p>') ? '':fields.Statement;
				$http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
					if(data.data.code==200){
						//$scope.setFlash('Link added successfully.' , 'success');
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
								//$scope.setFlash('Link added successfully.' , 'success');
								$scope.uploadedLink.thumbnail=data.data.thumbnail;
								$('.link_holder').html('<img src="../assets/Media/img/'+$scope.uploadedLink.thumbnail+'">');
                                //alert($scope.__isMontagePrivate == true)
                                if ($scope.__isMontagePrivate == true) {
                                    $('#dialog1').css({'display':'none'});
                                    $scope.link.isPrivate = 1;    
                                }
                                
								//console.log("---After override $scope.uploadedLink : ",$scope.uploadedLink);
								//$('.link_upload_themes').trigger('click');
								//$('.link_holder').html(fields.content);            
								//$('.link_holder').children().css('width',$('.link_holder').width()+'px');
							}
						});	
						/*-----*/
					}
				}); 				
				//$(".gridster_div").empty();// empty gridster div  20Dec..		
			}
		}); 
            //$(".gridster_div").empty();// empty gridster div  20Dec..
        //return false;
    }
    /********************************************END******************************************************/
    
    
    
    /*________________________________________________________________________
    * @Date:      	23 April 2015
    * @Method :   	post_noteToBoard
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-
    * @Purpose:   	This is used to Post note to media table
    * @Param:     	-
    * @Return:    	yes
    _________________________________________________________________________
    */
    //parul 23042015
    $scope.post_noteToBoard = function(){
        $('.edit_froala3').css({'padding':'15px'});
        $('.edit_froala3').html2canvas({
			useCORS:true,
			onrendered: function (canvas) {  
				var imgsrc = canvas.toDataURL("image/png");
				var base64Data = imgsrc.replace(/^data:image\/png;base64,/, "");
                fields = {
                    image: base64Data,
                };
                /*--thumbnail upload--*/
                $http.post('/media/note_screenshot',fields).then(function (data, status, headers, config) {
                    if(data.data.code==200){
                        $('body').removeClass('note_padding');
                        console.log("-------note_screenshot--done--------");
                        console.log('link'+data.data.link);
                        var link = data.data.link;
                        link = link.split('/');
                        var final_thumb =  link[link.length -1];
                        $scope.notes={};
                        var obj = angular.element('<div>'+$('.edit_froala3').editable('getHTML', true, true)+'</div>');
                        obj.find('a').attr('target','_blank');
                        $scope.notes.comment = obj.html();
                        $scope.notes.thumbnail = final_thumb;
                        //*********** code from $scope.checknotes in upload media controller
                        if ($('#media-tray-elements').find('li').length <15) {
                            $('#dialog1').css({'display':'none'});
                            $scope.link.isPrivate = 1;
                            $scope.link.mmt = '5464931fde9f6868484be3d7';
                            $("#token-input-tag-Input-Token").addClass('keyword-search bx-sz');
                            $("#token-input-tag-Input-Token").attr('placeholder','Label your media');
                            $("#token-input-tag-Input-Token").val('');
                            if($scope.notes.comment==''||$scope.notes.comment==undefined || $scope.notes.comment == "<p>Start writing...</p>" || $scope.notes.comment ==  '<p class="fr-tag">Start writing...</p>') {
                                alert('please enter valid text/media');return;
                            }else{
                                if ($scope.notes.comment!="<p><br></p>" && $scope.notes.comment!="" ) {
                                    var fields={};
                                    fields.content = $scope.notes.comment;
                                    fields.type = 'Notes';
                                    fields.thumbnail = $scope.notes.thumbnail;
                                    $http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
                                        if(data.data.code==200){
                                            $scope.uploadedLink=data.data.response;
                                            var initial_url='/assets/Media/img/600/'+fields.thumbnail;
                                            $scope.addTags();
                                        }
                                    });            
                                }
                            }
                        }else{
                            $("#media_tray_full_pop").show();
                        }
                        //************************ END
                        $scope.close_noteBoardCase();
                    }
                });	
                /*-----*/
			}
		});
        setTimeout(function(){
            $('.edit_froala3').css({'padding':'0px'});
            //$('.edit_froala3').css({'border': 'none'});
        },6000)
    }
    
    
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
    //parul 29042015
    $scope.keep_private = function(){
        $scope.__isMontagePrivate = true;
        console.log($scope.trayObject);
        $scope.closePrivate();
        $scope.trayObject.click();
    }
    
    /********************************************END******************************************************/
});