var small__thumbnail = '';
var medium__thumbnail = '';
var large__thumbnail = '';
function startupall_montage(){
	montage_ele = (function($){
        
        var app = {
            init: function(pageId){
                if(pageId != null){
                    var trayObject_index = null;
                    app.jscriptNgcommon.init__urlLocations(pageId);
                    app.grid_init(pageId);
                    app.holderBox_droppable(pageId);
                    app.singleImage_droppable(pageId);
                    app.init_gridster(pageId);
                    
                }
                else{
                    var trayObject_index = null;
                    app.jscriptNgcommon.init__urlLocations();
                    app.grid_init();
                    app.holderBox_droppable();
                    app.singleImage_droppable();
                    app.init_gridster();
                    
                }
            },
            jscriptNgcommon:{
                init__urlLocations:function(pageId){
                     small__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().small__thumbnail;
                     medium__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().medium__thumbnail;
                     discuss__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().discuss__thumbnail;
                     large__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().large__thumbnail;
                }
            },
            grid_init: function(pageId){
                if(pageId != null){
                    //console.log('========montage_elements_init============');
                    setTimeout(function(){
                        $('#'+pageId+' .drop-here').droppable({
                            accept: '.drag-me',
                            hoverClass: "grid-focused",
                            drop:function(event,ui){
                                var row = $(this).parent().attr('data-row');
                                var col = $(this).parent().attr('data-col');
                                var item = $(ui.draggable);
                                montage_ele.gridster_tray(item.find('a'),row,col ,pageId);  
                            }
                        })
                    },1000)
                    
                }
                else{
                    //console.log('========montage_elements_init============');
                    setTimeout(function(){
                        $('.drop-here').droppable({
                            accept: '.drag-me',
                            hoverClass: "grid-focused",
                            drop:function(event,ui){
                                var row = $(this).parent().attr('data-row');
                                var col = $(this).parent().attr('data-col');
                                var item = $(ui.draggable);
                                montage_ele.gridster_tray(item.find('a'),row,col);  
                            }
                        })
                    },1000)
                    
                }
            },
            holderBox_droppable: function(pageId){
                if(pageId != null){
                    $('#'+pageId+' #holder-box').droppable({
                        accept: '.drag-me',
                        hoverClass: "grid-focused",
                        drop:function(event,ui){
                            var item = $(ui.draggable);
                            montage_ele.gridster_tray(item.find('a') , pageId);
                        }
                    }) 
                    
                }
                else{
                    $('#holder-box').droppable({
                        accept: '.drag-me',
                        hoverClass: "grid-focused",
                        drop:function(event,ui){
                            var item = $(ui.draggable);
                            montage_ele.gridster_tray(item.find('a'));
                        }
                    }) 
                    
                }
            },
            singleImage_droppable:  function(pageId){
                if(pageId != null){
                    $('#'+pageId+' .single_image').droppable({
                        accept: '.drag-me',
                        hoverClass: "image-fade",
                        drop:function(event,ui){
                            var item = $(ui.draggable);
                            montage_ele.gridster_tray(item.find('a') , pageId);
                        }
                    })  
                    
                }
                else{
                    $('.single_image').droppable({
                        accept: '.drag-me',
                        hoverClass: "image-fade",
                        drop:function(event,ui){
                            var item = $(ui.draggable);
                            montage_ele.gridster_tray(item.find('a'));
                        }
                    })  
                    
                }
            },
            init_gridster: function(pageId){
                if(pageId != null){
                    var preventClick = function (e) { e.stopPropagation(); e.preventDefault(); };
                    var gridster;
                    $(function(){
                        gridster = $('#'+pageId+" .gridster > ul").gridster({
                            widget_margins: [0, 0],
                            widget_base_dimensions: [222, 222],
                            min_cols: 2,
                            avoid_overlapped_widgets: true,
                            resize: {
                              enabled: false
                            },
                            draggable:{
                                start:function(event,ui){
                                    event.stopPropagation();
                                    ui.$player[0].addEventListener('click', preventClick, true);
                                    col = $(ui.$player).attr('data-col');
                                    row = $(ui.$player).attr('data-row');
                                    return false;
                                },
                                stop:function(event,ui){
                                    event.stopPropagation()
                                    var player = ui.$player;
                                    setTimeout(function () {
                                        player[0].removeEventListener('click', preventClick, true);
                                    },0);
                                    newCol = $(ui.$player).attr('data-col');
                                    newRow = $(ui.$player).attr('data-row');
                                    row_limit = 2;
                                    col_limit = 2;
                                    grid_size= row_limit * col_limit;
                                    setTimeout(function(){
                                        $('#'+pageId+' #grid').find('li').each(function(){
                                            //console.log($(this).attr('data-row')+','+$(this).attr('data-col'));
                                            if($(this).attr('data-row') > row_limit){
                                                console.log('----------over row limit------------')
                                                if ($('#'+pageId+' #grid li[data-row='+row+'][ data-col='+col+']').is('li')) {
                                                    for(i = 1; i <= row_limit;i++){
                                                        for(j = 1; j <= col_limit;j++){
                                                        montage_ele.rearrange($(this) , pageId)
                                                        }
                                                    }
                                                }else{
                                                  $(this).attr({'data-row':row});
                                                  $(this).attr({'data-col':col});
                                                }
                                            }
                                            else if ($('#'+pageId+' #grid li[data-row='+$(this).attr('data-row')+'][ data-col='+$(this).attr('data-col')+']').length > 1) {
                                                //console.log('--------calling rearrange-----------');
                                                montage_ele.rearrange_again($(this) , pageId);
                                            }
                                            else{
                                            }
                                            $('#'+pageId+' #grid').height(444);
                                        })
                                    },50)
                                    return false;
                                }
                            },
                        }).data('gridster');
                    });
                    
                }
                else{
                    var preventClick = function (e) { e.stopPropagation(); e.preventDefault(); };
                    var gridster;
                    $(function(){
                        gridster = $(".gridster > ul").gridster({
                            widget_margins: [0, 0],
                            widget_base_dimensions: [222, 222],
                            min_cols: 2,
                            avoid_overlapped_widgets: true,
                            resize: {
                              enabled: false
                            },
                            draggable:{
                                start:function(event,ui){
                                    event.stopPropagation();
                                    ui.$player[0].addEventListener('click', preventClick, true);
                                    col = $(ui.$player).attr('data-col');
                                    row = $(ui.$player).attr('data-row');
                                    return false;
                                },
                                stop:function(event,ui){
                                    event.stopPropagation()
                                    var player = ui.$player;
                                    setTimeout(function () {
                                        player[0].removeEventListener('click', preventClick, true);
                                    },0);
                                    newCol = $(ui.$player).attr('data-col');
                                    newRow = $(ui.$player).attr('data-row');
                                    row_limit = 2;
                                    col_limit = 2;
                                    grid_size= row_limit * col_limit;
                                    setTimeout(function(){
                                        $('#grid').find('li').each(function(){
                                            //console.log($(this).attr('data-row')+','+$(this).attr('data-col'));
                                            if($(this).attr('data-row') > row_limit){
                                                console.log('----------over row limit------------')
                                                if ($('#grid li[data-row='+row+'][ data-col='+col+']').is('li')) {
                                                    for(i = 1; i <= row_limit;i++){
                                                        for(j = 1; j <= col_limit;j++){
                                                        montage_ele.rearrange($(this))
                                                        }
                                                    }
                                                }else{
                                                  $(this).attr({'data-row':row});
                                                  $(this).attr({'data-col':col});
                                                }
                                            }
                                            else if ($('#grid li[data-row='+$(this).attr('data-row')+'][ data-col='+$(this).attr('data-col')+']').length > 1) {
                                                //console.log('--------calling rearrange-----------');
                                                montage_ele.rearrange_again($(this));
                                            }
                                            else{
                                            }
                                                                                    $('#grid').height(444);
                                        })
                                    },50)
                                    return false;
                                }
                            },
                        }).data('gridster');
                    });
                    
                }
            },
            rearrange: function(obj , pageId) {
                if(pageId != null){
                    for(i = 1; i <= row_limit;i++){
                        for(j = 1; j <= col_limit;j++){
                            //console.log('-----length-----' + $('#grid li[data-row='+i+'][ data-col='+j+']').length);
                            if ($('#'+pageId+' #grid li[data-row='+i+'][ data-col='+j+']').length == 1) {
                                // one li at this place

                            }
                            else if ($('#'+pageId+' #grid li[data-row='+i+'][ data-col='+j+']').length == 0) {
                                //  no li at this place
                                //console.log('-------New Position-------')
                                //console.log(i+','+j);
                                obj.attr({'data-row':i});
                                obj.attr({'data-col':j});
                            }else{
                                // more than  one li at this place
                                console.log('two li case');
                                montage_ele.rearrange_again($('#'+pageId+' #grid li[data-row='+i+'][ data-col='+j+']:eq(1)') , pageId)
                            }
                        }
                    }
                    
                }
                else{
                    for(i = 1; i <= row_limit;i++){
                        for(j = 1; j <= col_limit;j++){
                            //console.log('-----length-----' + $('#grid li[data-row='+i+'][ data-col='+j+']').length);
                            if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 1) {
                                // one li at this place

                            }
                            else if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 0) {
                                //  no li at this place
                                //console.log('-------New Position-------')
                                //console.log(i+','+j);
                                obj.attr({'data-row':i});
                                obj.attr({'data-col':j});
                            }else{
                                // more than  one li at this place
                                console.log('two li case');
                                montage_ele.rearrange_again($('#grid li[data-row='+i+'][ data-col='+j+']:eq(1)'))
                            }
                        }
                    }
                }
            },
  
            rearrange_again: function(obj , pageId) {
                if(pageId != null){
                    for(i = 1; i <= row_limit;i++){
                        for(j = 1; j <= col_limit;j++){
                            if ($('#'+pageId+' #grid li[data-row='+i+'][ data-col='+j+']').length == 1) {
                                // one li at this place
                            }
                            else if ($('#'+pageId+' #grid li[data-row='+i+'][ data-col='+j+']').length == 0) {
                                //  no li at this place
                                //console.log('-------New Position-------')
                                //console.log(i+','+j);
                                obj.attr({'data-row':i});
                                obj.attr({'data-col':j});
                            }else{
                                // more than  one li at this place
                            }
                        }
                    }
                    
                }
                else{
                    for(i = 1; i <= row_limit;i++){
                        for(j = 1; j <= col_limit;j++){
                            if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 1) {
                                // one li at this place
                            }
                            else if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 0) {
                                //  no li at this place
                                //console.log('-------New Position-------')
                                //console.log(i+','+j);
                                obj.attr({'data-row':i});
                                obj.attr({'data-col':j});
                            }else{
                                // more than  one li at this place
                            }
                        }
                    }
                    
                }
            },
            /*________________________________________________________________________
                * @Date:      	02 April 2015
                * @Method :   	gridster_tray
                * Created By: 	smartData Enterprises Ltd
                * Modified On:	14 Apr 2015, 16 April 2015
                * @Purpose:   	This is called when user clicks on media tray of view_search page.
                * @Param:     	3
                * @Return:    	no
            _________________________________________________________________________
            */ 
            gridster_tray:function(obj,row,col , pageId){
                if(pageId != null){
                    if ($('#'+pageId+' .single_image').hasClass('ng-hide')) {
                        var scope = angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                        scope.showCloseSingle = false;
                        scope.showAddImage = false;
                        scope.trayObject = obj;
                        trayObject = obj;
                        trayObject_index = obj.parent().index();
                        if ($('#'+pageId+' #holder-box').find('#montageContainer').is('div')) {
                            console.log('1');
                            $('#'+pageId+' #montage_replace_pop').css({'display':'block'});
                        }
                        else if (scope.__isMontagePrivate == false && $('#'+pageId+' #holder-box').attr('is-private') == '1' && !($('#'+pageId+' #holder-box').find('.noteContent').is('p')) && !($('#'+pageId+' #holder-box').find('.videoContent').is('p'))) {
                            console.log('2');
                            if ($('#'+pageId+' #grid').find('.addnote').length >= 1) {
                                if ($('#'+pageId+' #holder-box').attr('is-private') == '1') {
                                   $('#'+pageId+' #private_media_pop1').show();
                                }
                            }else{
                                alert('no room left for new media')
                            }
                        }else{
                                console.log('3');
                                if (obj.find('.montageElement').is('img')) {
                                  $('#'+pageId+' #montage_pop').css({'display':'block'});
                                }
                                else if (scope.__isMontagePrivate == false && obj.attr('is-private') == 1 && !(obj.find('.noteContent').is('p')) && !(obj.find('.videoContent').is('p'))) {
                                        if ($('#'+pageId+' #grid').find('.addnote').length >= 1) {
                                                if (obj.attr('is-private') == 1) {
                                                        $('#'+pageId+' #private_media_pop').css({'display':'block'});
                                                }
                                        }else{
                                                alert('no room left for new media');
                                        }
                                }else{
                                        setTimeout(function(){
                                                var scope2 = angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                                                scope2.$apply(function(){
                                                        angular.element($('#'+pageId+" #search_gallery_elements")).scope().montage_case_buttons_handler(pageId);
                                                })
                                                scope2 = null;
                                        },100)

                                        montage_ele.addToGrid(obj,row,col , pageId);
                                        montage_ele.grid_init(pageId);
                                }
                        }
                        scope = null;
                    }else{
                        var scope = angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                        mediaSite.discussTrayClick(obj , pageId)
                    }
                    
                }
                else{
                    if ($('.single_image').hasClass('ng-hide')) {
                        var scope = angular.element($("#search_gallery_elements")).scope();
                        scope.showCloseSingle = false;
                        scope.showAddImage = false;
                        scope.trayObject = obj;
                        trayObject = obj;
                        trayObject_index = obj.parent().index();
                        if ($('#holder-box').find('#montageContainer').is('div')) {
                                console.log('1');
                                $('#montage_replace_pop').css({'display':'block'});
                        }
                        else if (scope.__isMontagePrivate == false && $('#holder-box').attr('is-private') == '1' && !($('#holder-box').find('.noteContent').is('p')) && !($('#holder-box').find('.videoContent').is('p'))) {
                                console.log('2');
                                if ($('#grid').find('.addnote').length >= 1) {
                                        if ($('#holder-box').attr('is-private') == '1') {
                                           $('#private_media_pop1').show();
                                        }
                                }else{
                                        alert('no room left for new media')
                                }
                        }else{
                                console.log('3');
                                if (obj.find('.montageElement').is('img')) {
                                  $('#montage_pop').css({'display':'block'});
                                }
                                else if (scope.__isMontagePrivate == false && obj.attr('is-private') == 1 && !(obj.find('.noteContent').is('p')) && !(obj.find('.videoContent').is('p'))) {
                                        if ($('#grid').find('.addnote').length >= 1) {
                                                if (obj.attr('is-private') == 1) {
                                                        $('#private_media_pop').css({'display':'block'});
                                                }
                                        }else{
                                                alert('no room left for new media');
                                        }
                                }else{
                                        setTimeout(function(){
                                                var scope2 = angular.element($("#search_gallery_elements")).scope();
                                                scope2.$apply(function(){
                                                        angular.element($("#search_gallery_elements")).scope().montage_case_buttons_handler();
                                                })
                                                scope2 = null;
                                        },100)

                                        montage_ele.addToGrid(obj,row,col);
                                        montage_ele.grid_init();
                                }
                        }
                        scope = null;
                    }else{
                        var scope = angular.element($("#search_gallery_elements")).scope();
                        mediaSite.discussTrayClick(obj)
                    }
                }
            },
            /********************************************END******************************************************/	 
            
            /*________________________________________________________________________
            * @Date:      	15 April 2015
            * @Method :   	addToGrid
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	16 April 2015,
            * @Purpose:   	This is to add media tray item to gridster.
            * @Param:     	3
            * @Return:    	no
            _________________________________________________________________________
            */
            addToGrid: function(obj,row,col , pageId){
                if(pageId != null){
                    //console.log($('#grid li[data-row="2"][data-col="1"]').html());
                    $('#'+pageId+' #grid').show();
                    if ($('#'+pageId+' #holder-box').css('display') != 'none') {
                        console.log('addToGrid_first_case')
                        montage_ele.addToGrid_first_case(obj , pageId);
                    }else{
                        console.log('addToGrid_else_case')
                        if (row != undefined && row != null && col != undefined && col != null) {
                            var objct = montage_ele.getHtml(obj , pageId);
                            item_ids[$('#'+pageId+' #grid li[data-row='+row+'][data-col='+col+']').index()] = "mon_note_unknown";
                            $('#'+pageId+' #grid li[data-row='+row+'][data-col='+col+']').html(objct.html());
                            $('#'+pageId+' #grid li[data-row='+row+'][data-col='+col+']').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                            montage_ele.remove_from_trays(obj , pageId);
                        }else{
                            if ($('#'+pageId+' #grid li[data-row="1"][data-col="1"]').find('.addnote').is('a')) {
                                var objct = montage_ele.getHtml(obj , pageId);
                                item_ids[$('#'+pageId+' #grid li[data-row="1"][data-col="1"]').index()] = obj.attr('data-id');
                                $('#'+pageId+' #grid li[data-row="1"][data-col="1"]').html(objct.html());
                                $('#'+pageId+' #grid li[data-row="1"][data-col="1"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                                montage_ele.remove_from_trays(obj , pageId)
                            }
                            else if ($('#'+pageId+' #grid li[data-row="1"][data-col="2"]').find('.addnote').is('a')) {
                                var objct = montage_ele.getHtml(obj , pageId);
                                item_ids[$('#'+pageId+' #grid li[data-row="1"][data-col="2"]').index()] = obj.attr('data-id');
                                $('#'+pageId+' #grid li[data-row="1"][data-col="2"]').html(objct.html());
                                $('#'+pageId+' #grid li[data-row="1"][data-col="2"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                                montage_ele.remove_from_trays(obj , pageId)
                            }
                            else if ($('#'+pageId+' #grid li[data-row="2"][data-col="1"]').find('.addnote').is('a')) {
                                var objct = montage_ele.getHtml(obj , pageId);
                                item_ids[$('#'+pageId+' #grid li[data-row="2"][data-col="1"]').index()] = obj.attr('data-id');
                                $('#'+pageId+' #grid li[data-row="2"][data-col="1"]').html(objct.html());
                                $('#'+pageId+' #grid li[data-row="2"][data-col="1"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                                montage_ele.remove_from_trays(obj , pageId)
                            }
                            else if ($('#'+pageId+' #grid li[data-row="2"][data-col="2"]').find('.addnote').is('a')) {
                                var objct = montage_ele.getHtml(obj , pageId);
                                item_ids[$('#'+pageId+' #grid li[data-row="2"][data-col="2"]').index()] = obj.attr('data-id');
                                $('#'+pageId+' #grid li[data-row="2"][data-col="2"]').html(objct.html());
                                $('#'+pageId+' #grid li[data-row="2"][data-col="2"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                                montage_ele.remove_from_trays(obj , pageId)
                            }
                            else{
                                alert('no room left for new media')
                            }
                        }
                        console.log('***********************************************');
                        console.log(item_ids);
                        console.log('***********************************************');
                    }
                    $('#'+pageId+' #holder-box').hide();
                    $('#'+pageId+' #holder-box').html("");

                    
                }
                else{
                    //console.log($('#grid li[data-row="2"][data-col="1"]').html());
                    $('#grid').show();
                    if ($('#holder-box').css('display') != 'none') {
                        console.log('addToGrid_first_case')
                        montage_ele.addToGrid_first_case(obj);
                    }else{
                        console.log('addToGrid_else_case')
                        if (row != undefined && row != null && col != undefined && col != null) {
                            var objct = montage_ele.getHtml(obj);
                            item_ids[$('#grid li[data-row='+row+'][data-col='+col+']').index()] = "mon_note_unknown";
                            $('#grid li[data-row='+row+'][data-col='+col+']').html(objct.html());
                            $('#grid li[data-row='+row+'][data-col='+col+']').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                            montage_ele.remove_from_trays(obj);
                        }else{
                            if ($('#grid li[data-row="1"][data-col="1"]').find('.addnote').is('a')) {
                                var objct = montage_ele.getHtml(obj);
                                item_ids[$('#grid li[data-row="1"][data-col="1"]').index()] = obj.attr('data-id');
                                $('#grid li[data-row="1"][data-col="1"]').html(objct.html());
                                $('#grid li[data-row="1"][data-col="1"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                                montage_ele.remove_from_trays(obj)
                            }
                            else if ($('#grid li[data-row="1"][data-col="2"]').find('.addnote').is('a')) {
                                var objct = montage_ele.getHtml(obj);
                                item_ids[$('#grid li[data-row="1"][data-col="2"]').index()] = obj.attr('data-id');
                                $('#grid li[data-row="1"][data-col="2"]').html(objct.html());
                                $('#grid li[data-row="1"][data-col="2"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                                montage_ele.remove_from_trays(obj)
                            }
                            else if ($('#grid li[data-row="2"][data-col="1"]').find('.addnote').is('a')) {
                                var objct = montage_ele.getHtml(obj);
                                item_ids[$('#grid li[data-row="2"][data-col="1"]').index()] = obj.attr('data-id');
                                $('#grid li[data-row="2"][data-col="1"]').html(objct.html());
                                $('#grid li[data-row="2"][data-col="1"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                                montage_ele.remove_from_trays(obj)
                            }
                            else if ($('#grid li[data-row="2"][data-col="2"]').find('.addnote').is('a')) {
                                var objct = montage_ele.getHtml(obj);
                                item_ids[$('#grid li[data-row="2"][data-col="2"]').index()] = obj.attr('data-id');
                                $('#grid li[data-row="2"][data-col="2"]').html(objct.html());
                                $('#grid li[data-row="2"][data-col="2"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                                montage_ele.remove_from_trays(obj)
                            }
                            else{
                                alert('no room left for new media')
                            }
                        }
                        console.log('***********************************************');
                        console.log(item_ids);
                        console.log('***********************************************');
                    }
                    $('#holder-box').hide();
                    $('#holder-box').html("");

                    
                }
            },
            /********************************************END******************************************************/
            
            /*________________________________________________________________________
            * @Date:      	16 April 2015
            * @Method :   	addToGrid_first_case
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	23 Apr 2015
            * @Purpose:   	This is called to make private media public.
            * @Param:     	-
            * @Return:    	no
            _________________________________________________________________________
            */
            //parul 16042015
            addToGrid_first_case: function(obj , pageId) {
                if(pageId != null){
                    console.log('in first case');
                    window.item_ids = ['','','',''];
                    var scope = angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                    if (scope.del_grid_noteCase == false) {
                        item_ids[$('#'+pageId+' #grid li[data-row="1"][data-col="1"]').index()] = scope.mediasData._id;
                    }else{
                        item_ids[$('#'+pageId+' #grid li[data-row="1"][data-col="1"]').index()] = 'mon_note';
                    }

                    item_ids[$('#'+pageId+' #grid li[data-row="1"][data-col="2"]').index()] = obj.attr('data-id');
                    scope = null;
                    console.log('***********************************************');
                    console.log(item_ids);
                    console.log('***********************************************');
                    //console.log($('#grid li[data-row="2"][data-col="1"]').html());
                    if ($('#'+pageId+' #holder-box').find('#videoContainer').is('div')) {
                        var first = montage_ele.getHtml($('#'+pageId+' #holder-box').find('#videoActual') , pageId);
                    }
                    else if ($('#'+pageId+' #holder-box').find('#iframeContainer').is('div')) {
                                            console.log('iframeContainer');
                        var first = montage_ele.getHtml($('#'+pageId+' #holder-box').find('#linkActual') , pageId);
                                            console.log(first.html());
                    }else if ($('#'+pageId+' #holder-box').find('#noteContainer').is('div')) {
                        var first = montage_ele.getHtml($('#'+pageId+' #holder-box').find('#noteActual') , pageId);
                    }else{
                        var first = montage_ele.getHtml($('#'+pageId+' #holder-box') , pageId);
                    }
                    $('#'+pageId+' #grid li[data-row="1"][data-col="1"]').html(first.html());
                    $('#'+pageId+' #grid li[data-row="1"][data-col="1"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon"  title="Delete"></div>');
                    var second= montage_ele.getHtml(obj , pageId);
                    montage_ele.remove_from_trays(obj , pageId)
                    $('#'+pageId+' #grid li[data-row="1"][data-col="2"]').html(second.html());
                    $('#'+pageId+' #grid li[data-row="1"][data-col="2"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                    
                }
                else{
                    console.log('in first case');
                    window.item_ids = ['','','',''];
                    var scope = angular.element($("#search_gallery_elements")).scope();
                    if (scope.del_grid_noteCase == false) {
                        item_ids[$('#grid li[data-row="1"][data-col="1"]').index()] = scope.mediasData._id;
                    }else{
                        item_ids[$('#grid li[data-row="1"][data-col="1"]').index()] = 'mon_note';
                    }

                    item_ids[$('#grid li[data-row="1"][data-col="2"]').index()] = obj.attr('data-id');
                    scope = null;
                    console.log('***********************************************');
                    console.log(item_ids);
                    console.log('***********************************************');
                    //console.log($('#grid li[data-row="2"][data-col="1"]').html());
                    if ($('#holder-box').find('#videoContainer').is('div')) {
                        var first = montage_ele.getHtml($('#holder-box').find('#videoActual'));
                    }
                    else if ($('#holder-box').find('#iframeContainer').is('div')) {
                                            console.log('iframeContainer');
                        var first = montage_ele.getHtml($('#holder-box').find('#linkActual'));
                                            console.log(first.html());
                    }else if ($('#holder-box').find('#noteContainer').is('div')) {
                        var first = montage_ele.getHtml($('#holder-box').find('#noteActual'));
                    }else{
                        var first = montage_ele.getHtml($('#holder-box'));
                    }
                    $('#grid li[data-row="1"][data-col="1"]').html(first.html());
                    $('#grid li[data-row="1"][data-col="1"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon"  title="Delete"></div>');
                    var second= montage_ele.getHtml(obj);
                    montage_ele.remove_from_trays(obj)
                    $('#grid li[data-row="1"][data-col="2"]').html(second.html());
                    $('#grid li[data-row="1"][data-col="2"]').append('<div onclick="montage_ele.del_grid($(this))" class="close_icon" title="Delete"></div>');
                    
                }
            },
            /********************************************END******************************************************/
           
            /*________________________________________________________________________
            * @Date:      	15 April 2015
            * @Method :   	getHtml
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	16 Aril 2015
            * @Purpose:   	This is used to get html from object to append it to gridster. it is used in addToGrid() function
            * @Param:     	1
            * @Return:    	yes
            _________________________________________________________________________
            */
            //parul 15042015		 
            getHtml: function(obj1 , pageId){
                if(pageId != null){
                    var obj = obj1.clone();
                    if (obj.find('img').is("img")) {
                        obj.find('img').removeAttr('width');
                        if (obj.find('img').parent().hasClass('avatar-name')) {
                            obj.find('img').unwrap();
                            obj.find('img').wrap("<p class='innerimg-wrap'></p>");
                        }else if(obj.find('.avatar-name').is('span')){
                            obj.find('.avatar-name').remove();
                            obj.find('img').wrap("<p class='innerimg-wrap'></p>");
                        }
                        if (!(obj.find('img').parent().hasClass('innerimg-wrap'))) {
                            obj.find('img').wrap("<p class='innerimg-wrap'></p>");
                        }
                        if (obj.find('.avtar_list_overlay').is('span')) {
                            obj.find('.avtar_list_overlay').remove();
                        }
                        var imgStr = obj.find('img').attr('src');
                        var thumbSize = "/"+small__thumbnail;
                        var replaceWith="/"+discuss__thumbnail;
                        imgStr = montage_ele.getResizedThumbnail(imgStr,thumbSize,replaceWith , pageId);
                        var itemImg = obj.find('img').attr('src',imgStr);
                    }else{
                        if (obj.find('.avatar-name').find('p').is('p')) {
                            obj.find('.avatar-name').find('p').addClass('textWrap');
                            obj.find('.textWrap').unwrap();
                            obj.find('.avtar_list_overlay').remove();
                        }
                    }
                    if (obj.find('.videoContent').is('p')) {
                        obj.append('<span class="play-btn"><img src="../assets/img/play-btn.png" /></span>');
                    }
                    return obj;
                    
                }
                else{
                    var obj = obj1.clone();
                    if (obj.find('img').is("img")) {
                        obj.find('img').removeAttr('width');
                        if (obj.find('img').parent().hasClass('avatar-name')) {
                            obj.find('img').unwrap();
                            obj.find('img').wrap("<p class='innerimg-wrap'></p>");
                        }else if(obj.find('.avatar-name').is('span')){
                            obj.find('.avatar-name').remove();
                            obj.find('img').wrap("<p class='innerimg-wrap'></p>");
                        }
                        if (!(obj.find('img').parent().hasClass('innerimg-wrap'))) {
                            obj.find('img').wrap("<p class='innerimg-wrap'></p>");
                        }
                        if (obj.find('.avtar_list_overlay').is('span')) {
                            obj.find('.avtar_list_overlay').remove();
                        }
                        var imgStr = obj.find('img').attr('src');
                        var thumbSize = "/"+small__thumbnail;
                        var replaceWith="/"+discuss__thumbnail;
                        imgStr = montage_ele.getResizedThumbnail(imgStr,thumbSize,replaceWith);
                        var itemImg = obj.find('img').attr('src',imgStr);
                    }else{
                        if (obj.find('.avatar-name').find('p').is('p')) {
                            obj.find('.avatar-name').find('p').addClass('textWrap');
                            obj.find('.textWrap').unwrap();
                            obj.find('.avtar_list_overlay').remove();
                        }
                    }
                    if (obj.find('.videoContent').is('p')) {
                        obj.append('<span class="play-btn"><img src="../assets/img/play-btn.png" /></span>');
                    }
                    return obj;
                    
                }
            },
            /********************************************END******************************************************/
            
            /*________________________________________________________________________
                * @Date:      	16 Jan 2015
                * @Method :   	getResizedThumbnail
                * Created By: 	smartData Enterprises Ltd
                * Modified On:	-
                * @Purpose:   	This function is used for Check media Thumbnails.
                * @Param:     	3
                * @Return:    	Yes
            _________________________________________________________________________
            */                                            
            getResizedThumbnail: function(url,thumbSize,replaceWith , pageId){
                if(pageId != null){
                    if(url!='' && thumbSize!=''){
                        var newUrl = url;
                        var n = newUrl.search(thumbSize);
                        if(n>=0){
                            newUrl = newUrl.replace(thumbSize, replaceWith);
                            return newUrl;
                        }else{
                            return newUrl;
                        }        
                    }else{
                        return url;
                    }    
                }
                else{
                    if(url!='' && thumbSize!=''){
                        var newUrl = url;
                        var n = newUrl.search(thumbSize);
                        if(n>=0){
                            newUrl = newUrl.replace(thumbSize, replaceWith);
                            return newUrl;
                        }else{
                            return newUrl;
                        }        
                    }else{
                        return url;
                    }    
                    
                }
            },
            /********************************************END******************************************************/
            
			/*________________________________________________________________________
            * @Date:      	15 April 2015
            * @Method :   	remove_from_trays
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	16 April 2015,
            * @Purpose:   	This is to remove media entry from media trays.
            * @Param:     	1
            * @Return:    	no
            _________________________________________________________________________
            */
            deleteMedia:function(obj , pageId){
                if(pageId != null){
                    app.remove_from_trays(obj , pageId);
                    
                }
                else{
                    app.remove_from_trays(obj);
                    
                }
            },
			/********************************************END******************************************************/
			
            /*________________________________________________________________________
            * @Date:      	15 April 2015
            * @Method :   	remove_from_trays
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	16 April 2015,
            * @Purpose:   	This is to remove media entry from media trays.
            * @Param:     	1
            * @Return:    	no
            _________________________________________________________________________
            */
            remove_from_trays: function(obj , pageId) {
                if(pageId != null){
                    var scope3 = angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                    scope3.$apply(function(){
                        scope3.countOfTrayMedia--;
                        var index = obj.parent().index();
                        $('#'+pageId+' #discussList__mediaTray li:eq('+index+')').remove();
                        $('#'+pageId+' #searchList__mediaTray li:eq('+index+')').remove();
                        $('#'+pageId+' #searchView-media-tray li:eq('+index+')').remove();
                    });
                    scope3 = null;
                    return false;
                    
                }
                else{
                    var scope3 = angular.element($("#search_gallery_elements")).scope();
                    scope3.$apply(function(){
                        scope3.countOfTrayMedia--;
                        var index = obj.parent().index();
                        $('#discussList__mediaTray li:eq('+index+')').remove();
                        $('#searchList__mediaTray li:eq('+index+')').remove();
                        $('#searchView-media-tray li:eq('+index+')').remove();
                    });
                    scope3 = null;
                    return false;
                    
                }
            },
            /********************************************END******************************************************/
            
            /*________________________________________________________________________
                * @Date:      	24 April 2015
                * @Method :   	add_id_forNote
                * Created By: 	smartData Enterprises Ltd
                * Modified On:	-
                * @Purpose:   	This is used to handle note case for item_ids .
                * @Param:     	1
                * @Return:    	no
            _________________________________________________________________________
            */    
            add_id_forNote: function(pageId) {
                
            },
            /********************************************END******************************************************/
            
            /*________________________________________________________________________
                * @Date:      	24 April 2015
                * @Method :   	openMontage
                * Created By: 	smartData Enterprises Ltd
                * Modified On:	-
                * @Purpose:   	This is called for replacing montage on platform with another montage .
                * @Param:     	1
                * @Return:    	no
            _________________________________________________________________________
            */    
            openMontage: function(pageId){
                if(pageId != null){
                    var scope = angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                    var id = trayObject.attr('data-id');
                    var temp = angular.element(trayObject);
                    scope.$apply(function () {
                        if ($('#'+pageId+' #grid').css('display') == 'none' ) {
                            var items = scope.countOfTrayMedia;
                            if ( items <= 15) {
                                scope.addtoTray_delCase(scope.mediasData._id , pageId);
                            }
                        }else{
                            if (((4-$('#'+pageId+' #grid').find('.addnote').length) + scope.countOfTrayMedia) <= 16) {
                                for(i in item_ids){
                                    if (item_ids[i] != '' && item_ids[i] != 'mon_note' && item_ids[i] != 'mon_note_unknown') {
                                        console.log('---------------------------------------------------');
                                        console.log(item_ids[i]);
                                        scope.addtoTray_delCase(item_ids[i] , pageId);	
                                        console.log('---------------------------------------------------');
                                    }
                                }
                                $('#'+pageId+' #holder-box').show();
                                $('#'+pageId+' #grid').hide();
                                var grid_li = [];
                                angular.element($('#'+pageId+" #search_gallery_elements")).injector().invoke(function($compile) {
                                    for (i=0;i<4;i++) {
                                        grid_li[i] = angular.element('<a href="javascript:void(0)" ng-click="openNote_mctrl()" onClick="montage_ele.openNote($(this))" class="addnote drop-here"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a>');
                                        grid_li[i] = $compile(grid_li[i])(scope);
                                    }
                                });
                                $('#'+pageId+' #grid').find('li').each(function(){
                                    $(this).html(grid_li[$(this).index()]);
                                })
                            }else{
                                    alert('else Open montage');
                            }
                        }
                        scope.setMediaId__mannualy(id , pageId);
                    });
                    mediaSite.discussTrayClick(temp , pageId);
                    $('#'+pageId+' #montage_pop').css({'display':'none'});
                    $('#'+pageId+' #montage_replace_pop').css({'display':'none'});
                    scope = null;
                    
                }
                else{
                    var scope = angular.element($("#search_gallery_elements")).scope();
                    var id = trayObject.attr('data-id');
                    var temp = angular.element(trayObject);
                    scope.$apply(function () {
                        if ($('#grid').css('display') == 'none' ) {
                                var items = scope.countOfTrayMedia;
                                if ( items <= 15) {
                                        scope.addtoTray_delCase(scope.mediasData._id);
                                }
                        }else{
                            if (((4-$('#grid').find('.addnote').length) + scope.countOfTrayMedia) <= 16) {
                                for(i in item_ids){
                                        if (item_ids[i] != '' && item_ids[i] != 'mon_note' && item_ids[i] != 'mon_note_unknown') {
                                                console.log('---------------------------------------------------');
                                                console.log(item_ids[i]);
                                                scope.addtoTray_delCase(item_ids[i]);	
                                                console.log('---------------------------------------------------');
                                        }
                                }
                                $('#holder-box').show();
                                $('#grid').hide();
                                var grid_li = [];
                                angular.element($("#search_gallery_elements")).injector().invoke(function($compile) {
                                            for (i=0;i<4;i++) {
                                                    grid_li[i] = angular.element('<a href="javascript:void(0)" ng-click="openNote_mctrl()" onClick="montage_ele.openNote($(this))" class="addnote drop-here"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a>');
                                                    grid_li[i] = $compile(grid_li[i])(scope);
                                            }
                                    });
                                    $('#grid').find('li').each(function(){
                                    $(this).html(grid_li[$(this).index()]);
                                })
                            }else{
                                    alert('else Open montage');
                            }
                        }
                        scope.setMediaId__mannualy(id);
                    });
                    mediaSite.discussTrayClick(temp);
                    $('#montage_pop').css({'display':'none'});
                    $('#montage_replace_pop').css({'display':'none'});
                    scope = null;
                    
                }

            },
            /********************************************END******************************************************/
            
            
            /*________________________________________________________________________
                * @Date:      	17 April 2015
                * @Method :   	openNote
                * @Created By: 	smartData Enterprises Ltd
                * @Modified On:	-
                * @Purpose:   	This is used for the purpose of adding note to montage grid .
                * @Param:     	1
                * @Return:    	no
            _________________________________________________________________________
            */    
            openNote:  function(obj , pageId) {
                if(pageId != null){
                    $('#'+pageId+' #note_forMontage').show();
                    var scope = angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                    scope.$apply(function(){
                        scope.row_no = obj.parent().attr('data-row');
                        scope.col_no = obj.parent().attr('data-col');
                    })
                    scope = null;
                    
                }
                else{
                    $('#note_forMontage').show();
                    var scope = angular.element($("#search_gallery_elements")).scope();
                    scope.$apply(function(){
                        scope.row_no = obj.parent().attr('data-row');
                        scope.col_no = obj.parent().attr('data-col');
                    })
                    scope = null;
                    
                }
            },
            /********************************************END******************************************************/
                        
            /*________________________________________________________________________
                * @Date:      	12 May 2015
                * @Method :   	add_back_to_tray
                * Created By: 	smartData Enterprises Ltd
                * Modified On:	-
                * @Purpose:   	This is used to add media deleted from grid back to media tray .
                * @Param:     	1
                * @Return:    	no
            _________________________________________________________________________
            */    
            add_back_to_tray: function(dup_obj,curr_id , pageId){
                if(pageId != null){
                    var new_li_srch = angular.element('<li class="dragable"></li>');
                    var new_li_grid = document.createElement('li');
                    var obj = document.createElement('li');
                    $(obj).append(dup_obj);
                    new_li_srch.append('<div onclick="deleteMedia($(this))" class="close_icon" style="top:0" title="Delete"></div><a onclick="openMediaDetail($(this))" data-ng-click="setMediaIdd("'+curr_id+'")" data-id="'+curr_id+'" href="javascript:void(0)"><span class="avtar_list_overlay"></span><span class="avatar-name"></span></a>');
                    $(new_li_grid).append('<div onclick="deleteMedia($(this))" class="close_icon" style="top:0" title="Delete"></div><a onclick="gridster_tray($(this))" data-ng-click="setMediaIdd("'+curr_id+'")" data-id="'+curr_id+'" href="javascript:void(0)"><span class="avtar_list_overlay"></span><span class="avatar-name"></span></a>');

                    if ($(obj).find('.linkContent').is('p')) {
                        console.log('-------------------------------Link case----------------------------------------------------');

                    }else if($(obj).find('.videoContent').is('p')) {
                        console.log('-------------------------------video case----------------------------------------------------');

                    }else if($(obj).find('.noteContent').is('p')) {
                        console.log('-------------------------------note case----------------------------------------------------');

                    }else{
                        console.log('-------------------------------Image case----------------------------------------------------');
                        //new_li_srch.find('.avatar-name').append($(obj).find('.innerimg-wrap').html())
                        //$('.search-view #search-media-tray').append(new_li_srch);
                    }
                
                }
                else{
                    var new_li_srch = angular.element('<li class="dragable"></li>');
                    var new_li_grid = document.createElement('li');
                    var obj = document.createElement('li');
                    $(obj).append(dup_obj);
                    new_li_srch.append('<div onclick="deleteMedia($(this))" class="close_icon" style="top:0" title="Delete"></div><a onclick="openMediaDetail($(this))" data-ng-click="setMediaIdd("'+curr_id+'")" data-id="'+curr_id+'" href="javascript:void(0)"><span class="avtar_list_overlay"></span><span class="avatar-name"></span></a>');
                    $(new_li_grid).append('<div onclick="deleteMedia($(this))" class="close_icon" style="top:0" title="Delete"></div><a onclick="gridster_tray($(this))" data-ng-click="setMediaIdd("'+curr_id+'")" data-id="'+curr_id+'" href="javascript:void(0)"><span class="avtar_list_overlay"></span><span class="avatar-name"></span></a>');

                    if ($(obj).find('.linkContent').is('p')) {
                        console.log('-------------------------------Link case----------------------------------------------------');

                    }else if($(obj).find('.videoContent').is('p')) {
                        console.log('-------------------------------video case----------------------------------------------------');

                    }else if($(obj).find('.noteContent').is('p')) {
                        console.log('-------------------------------note case----------------------------------------------------');

                    }else{
                        console.log('-------------------------------Image case----------------------------------------------------');
                        //new_li_srch.find('.avatar-name').append($(obj).find('.innerimg-wrap').html())
                        //$('.search-view #search-media-tray').append(new_li_srch);
                    }
                    
                }
                
                
            },
            /********************************************END******************************************************/
            
            /*________________________________________________________________________
                * @Date:      	17 April 2015
                * @Method :   	del_grid
                * Created By: 	smartData Enterprises Ltd
                * Modified On:	-
                * @Purpose:   	This is used to replace content of #grid li in case user wants to remove media from li.
                * @Param:     	1
                * @Return:    	no
            _________________________________________________________________________
            */    
            del_grid: function(obj , pageId) {
                if(pageId != null){
                    var scope =angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                    var grid_li = [];
                    angular.element($('#'+pageId+" #search_gallery_elements")).injector().invoke(function($compile) {
                        for (i=0;i<4;i++) {
                            grid_li[i] = angular.element('<a href="javascript:void(0)" ng-click="openNote_mctrl()" onClick="montage_ele.openNote($(this))" class="addnote drop-here"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a>');
                            grid_li[i] = $compile(grid_li[i])(scope);
                        }
                    });
                    var dup_obj = obj.parent().html();
                    var curr_index = obj.parent().index();
                    var curr_id = item_ids[curr_index];
                    if($('#'+pageId+' #grid').find('.addnote').length < 2){
                        obj.parent().html(grid_li[0]);
                        scope.showCloseSingle = false;
                        scope.showAddImage = false;
                        item_ids[curr_index] = '';
                    }else{
                        item_ids[curr_index] = '';
                        var mon_note_flag = false;
                        for(i in item_ids){
                            if (item_ids[i] != '' && item_ids[i] != 'mon_note' && item_ids[i] != 'mon_note_unknown') {
                                console.log('here in del_grid');
                                scope.$apply(function(){
                                    console.log('===========================================================');
                                    console.log(item_ids[i]);
                                    scope.setMediaId__mannualy(item_ids[i] , pageId);
                                })
                            }else if( item_ids[i] == 'mon_note' ){
                                scope.$apply(function(){
                                    scope.del_grid_noteCase = true;
                                    mon_note_flag = true;
                                })
                            }
                        }
                        if (!mon_note_flag) {
                            scope.del_grid_noteCase = false;
                        }
                        $('#'+pageId+' #grid li').each(function(){
                            //console.log($(this).index()+' == '+curr_index)
                            if ($(this).find('.addnote').is('a')) {
                                console.log('first case');
                            }else if($(this).index() == curr_index){
                                console.log('second case');
                            }else{
                                $('#'+pageId+' #grid').hide();
                                //console.log('third case');
                                $('#'+pageId+' #holder-box').show();
                                scope.showCloseSingle = true;
                                scope.showAddImage = false;
                                $(this).find('.close_icon').remove();		
                                if ($(this).find(".montageContent").attr('class')) {
                                    media=true;
                                    var data=$(this).find('.montageContent').html();
                                    data = data.replace(/@less@/g,"<");
                                    data = data.replace(/gre@ter/g,">");
                                    $('#'+pageId+' #holder-box').html('');
                                    $('#'+pageId+' #holder-box').html("<div id='montageContainer'></div>")
                                    $('#'+pageId+' #montageContainer').append(data);
                                    $('#'+pageId+' #holder-box').append("<div id='montageActual' style='display:none'>"+$(this).html()+"</div>");
                                }
                                else if ($(this).find(".linkContent").attr('class')) {
                                    media=true;
                                    var data=$(this).find('.linkContent').html();
                                    data = data.replace(/@less@/g,"<");
                                    data = data.replace(/gre@ter/g,">");
                                    data = data.replace("less","<");
                                    data = data.replace("greater",">");
                                    $('#'+pageId+' #holder-box').html('');
                                    $('#'+pageId+' #holder-box').html("<div id='iframeContainer' class='holder_bulb_iframe'></div>")
                                    $('#'+pageId+' #iframeContainer').append(data);
                                    $('#'+pageId+' #holder-box').append("<div id='linkActual' style='display:none'>"+$(this).html()+"</div>");
                                }else if ($(this).find(".noteContent").attr('class')) {
                                                                    //console.log('noteContent')
                                    media=true;
                                    var data=$(this).find('.noteContent').html();
                                    console.log('-------------------------------------');
                                    console.log(data);
                                    console.log('-------------------------------------');
                                    data = data.replace(/@less@/g,"<");
                                    data = data.replace(/gre@ter/g,">");
                                    console.log('-------------------------------------');
                                    console.log(data);
                                    console.log('-------------------------------------');
                                    $('#'+pageId+' #holder-box').html('');
                                    $('#'+pageId+' #holder-box').html("<div id='noteContainer'></div>")
                                    $('#'+pageId+' #noteContainer').append(data);
                                    $('#'+pageId+' #holder-box').append("<div id='noteActual' style='display:none'>"+$(this).html()+"</div>");
                                }else if($(this).find('.videoContent').is('p')){
                                    $('#'+pageId+' #holder-box').html("<div id='videoContainer' class='holder_bulb_iframe'></div>");
                                    $('#'+pageId+' #videoContainer').append('<video class="media_video" controls ><'+$(this).find('.videoContent').html()+'></video>');
                                    var whichBrowser = BrowserDetecter.whichBrowser();
                                    var videoSrc = $('#'+pageId+' #holder-box').find('source').attr('src');
                                    var ext = videoSrc.split('.').pop();
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
                                    $('#'+pageId+' #holder-box').find('source').attr('src', videoSrc);

                                    var ext = videoSrc.split('.').pop();
                                    $('#'+pageId+' .s-media-con').hide();
                                    $('#'+pageId+' .d-media-con').hide();
                                    media_type = "video";
                                    $('#'+pageId+' #holder-box').append("<div id='videoActual' style='display:none'>"+$(this).html()+"</div>");
                                }
                                else{
                                    if($(this).find('img').is('img')){
                                        if($(this).find('img').parent().hasClass('innerimg-wrap')){
                                            $(this).find('img').unwrap();
                                        }
                                        var orgUrl = $(this).find('img').attr('src');
                                        var thumbSize = "/"+small__thumbnail;
                                        var replaceWith="/"+discuss__thumbnail;		//20022015
                                        imgStr = montage_ele.getResizedThumbnail(orgUrl,thumbSize,replaceWith , pageId);
                                        $(this).find('img').attr('src',imgStr);
                                        $('#'+pageId+' #holder-box').html($(this).html())
                                    }else{
                                        var objj=$(this).clone();
                                        if (objj.find('.avatar-name').find('p').is('p')) {
                                            objj.find('.avatar-name').find('p').addClass('textWrap');
                                            objj.find('.textWrap').unwrap();
                                            objj.find('.avtar_list_overlay').remove();
                                        }

                                        $('#'+pageId+' #holder-box').html(objj.html())
                                    }
                                }
                                $('#'+pageId+' #grid').find('li').each(function(){
                                    $(this).html(grid_li[$(this).index()]);
                                })
                                scope.$apply(function(){
                                    angular.element($('#'+pageId+" #search_gallery_elements")).scope().init__stateVar(pageId);
                                })
                            }
                        })
                    }
                    if (curr_id != '' && curr_id != 'mon_note') {
                        scope.addtoTray_delCase(curr_id , pageId);
                    }else if (curr_id == 'mon_note') {
                        alert('mon_note case still under discussion')
                    }else{
                        //alert('unknown case in del_grid')
                    }
                    console.log('***********************************************');
                    console.log(item_ids);
                    console.log('***********************************************');
                    scope=null;
                    montage_ele.grid_init(pageId);

                    
                }
                else{
                    var scope =angular.element($("#search_gallery_elements")).scope();
                    var grid_li = [];
                    angular.element($("#search_gallery_elements")).injector().invoke(function($compile) {
                        for (i=0;i<4;i++) {
                            grid_li[i] = angular.element('<a href="javascript:void(0)" ng-click="openNote_mctrl()" onClick="montage_ele.openNote($(this))" class="addnote drop-here"><span class="tb-cell"><span class="fa fa-plus-circle"></span> <b>Click to add note</b></span></a>');
                            grid_li[i] = $compile(grid_li[i])(scope);
                        }
                    });
                    var dup_obj = obj.parent().html();
                    var curr_index = obj.parent().index();
                    var curr_id = item_ids[curr_index];
                    if($('#grid').find('.addnote').length < 2){
                        obj.parent().html(grid_li[0]);
                                            scope.showCloseSingle = false;
                                            scope.showAddImage = false;
                        item_ids[curr_index] = '';
                    }else{
                        item_ids[curr_index] = '';
                        var mon_note_flag = false;
                        for(i in item_ids){
                            if (item_ids[i] != '' && item_ids[i] != 'mon_note' && item_ids[i] != 'mon_note_unknown') {
                                console.log('here in del_grid');
                                                            scope.$apply(function(){
                                    console.log('===========================================================');
                                    console.log(item_ids[i]);
                                    scope.setMediaId__mannualy(item_ids[i]);
                                })
                            }else if( item_ids[i] == 'mon_note' ){
                                scope.$apply(function(){
                                    scope.del_grid_noteCase = true;
                                    mon_note_flag = true;
                                })
                            }
                        }
                        if (!mon_note_flag) {
                            scope.del_grid_noteCase = false;
                        }
                        $('#grid li').each(function(){
                            //console.log($(this).index()+' == '+curr_index)
                            if ($(this).find('.addnote').is('a')) {
                                console.log('first case');
                            }else if($(this).index() == curr_index){
                                console.log('second case');
                            }else{
                                $('#grid').hide();
                                //console.log('third case');
                                $('#holder-box').show();
                                                            scope.showCloseSingle = true;
                                                            scope.showAddImage = false;
                                $(this).find('.close_icon').remove();		
                                if ($(this).find(".montageContent").attr('class')) {
                                    media=true;
                                    var data=$(this).find('.montageContent').html();
                                    data = data.replace(/@less@/g,"<");
                                    data = data.replace(/gre@ter/g,">");
                                    $('#holder-box').html('');
                                    $('#holder-box').html("<div id='montageContainer'></div>")
                                    $('#montageContainer').append(data);
                                    $('#holder-box').append("<div id='montageActual' style='display:none'>"+$(this).html()+"</div>");
                                }
                                else if ($(this).find(".linkContent").attr('class')) {
                                    media=true;
                                    var data=$(this).find('.linkContent').html();
                                                                    data = data.replace(/@less@/g,"<");
                                                                    data = data.replace(/gre@ter/g,">");
                                    data = data.replace("less","<");
                                    data = data.replace("greater",">");
                                    $('#holder-box').html('');
                                    $('#holder-box').html("<div id='iframeContainer' class='holder_bulb_iframe'></div>")
                                    $('#iframeContainer').append(data);
                                    $('#holder-box').append("<div id='linkActual' style='display:none'>"+$(this).html()+"</div>");
                                }else if ($(this).find(".noteContent").attr('class')) {
                                                                    //console.log('noteContent')
                                    media=true;
                                    var data=$(this).find('.noteContent').html();
                                                                    console.log('-------------------------------------');
                                                                    console.log(data);
                                                                    console.log('-------------------------------------');
                                    data = data.replace(/@less@/g,"<");
                                    data = data.replace(/gre@ter/g,">");
                                                                    console.log('-------------------------------------');
                                                                    console.log(data);
                                                                    console.log('-------------------------------------');
                                    $('#holder-box').html('');
                                    $('#holder-box').html("<div id='noteContainer'></div>")
                                    $('#noteContainer').append(data);
                                    $('#holder-box').append("<div id='noteActual' style='display:none'>"+$(this).html()+"</div>");
                                }else if($(this).find('.videoContent').is('p')){
                                    $('#holder-box').html("<div id='videoContainer' class='holder_bulb_iframe'></div>");
                                    $('#videoContainer').append('<video class="media_video" controls ><'+$(this).find('.videoContent').html()+'></video>');
                                    var whichBrowser = BrowserDetecter.whichBrowser();
                                    var videoSrc = $('#holder-box').find('source').attr('src');
                                    var ext = videoSrc.split('.').pop();
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
                                    $('#holder-box').find('source').attr('src', videoSrc);

                                    var ext = videoSrc.split('.').pop();
                                    $('.s-media-con').hide();
                                    $('.d-media-con').hide();
                                    media_type = "video";
                                    $('#holder-box').append("<div id='videoActual' style='display:none'>"+$(this).html()+"</div>");
                                }
                                else{
                                    if($(this).find('img').is('img')){
                                        if($(this).find('img').parent().hasClass('innerimg-wrap')){
                                            $(this).find('img').unwrap();
                                        }
                                        var orgUrl = $(this).find('img').attr('src');
                                        var thumbSize = "/"+small__thumbnail;
                                        var replaceWith="/"+discuss__thumbnail;		//20022015
                                        imgStr = montage_ele.getResizedThumbnail(orgUrl,thumbSize,replaceWith);
                                        $(this).find('img').attr('src',imgStr);
                                        $('#holder-box').html($(this).html())
                                    }else{
                                        var objj=$(this).clone();
                                        if (objj.find('.avatar-name').find('p').is('p')) {
                                            objj.find('.avatar-name').find('p').addClass('textWrap');
                                            objj.find('.textWrap').unwrap();
                                            objj.find('.avtar_list_overlay').remove();
                                        }

                                        $('#holder-box').html(objj.html())
                                    }
                                }
                                $('#grid').find('li').each(function(){
                                    $(this).html(grid_li[$(this).index()]);
                                })
                                scope.$apply(function(){
                                    angular.element($("#search_gallery_elements")).scope().init__stateVar();
                                })
                            }
                        })
                    }
                    if (curr_id != '' && curr_id != 'mon_note') {
                        scope.addtoTray_delCase(curr_id);
                    }else if (curr_id == 'mon_note') {
                        alert('mon_note case still under discussion')
                    }else{
                        //alert('unknown case in del_grid')
                    }
                    console.log('***********************************************');
                    console.log(item_ids);
                    console.log('***********************************************');
                    scope=null;
                    montage_ele.grid_init();

                    
                }
            
            },
            /********************************************END******************************************************/


            
            /*________________________________________________________________________
            * @Date:      	14 April 2015
            * @Method :   	mkPublic
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	--
            * @Purpose:   	This is called to make private media public.
            * @Param:     	no
            * @Return:    	no
            _________________________________________________________________________
            */
            //parul 14042015
            mkPublic: function(pageId){
                if(pageId != null){
                    var scope = angular.element($('#'+pageId+" #search_gallery_elements")).scope();
                    var id = trayObject.attr('data-id');
                    scope.$apply( function () {
                        setTimeout( function () {
                            if (obj_stage_index != null && obj_stage_index != undefined && obj_stage_index != '') {
                                scope.makePublic(id,obj_stage_index,'stage_case' , pageId);
                                obj_stage_index = null;
                            }
                            else{
                                scope.makePublic(id,trayObject_index,'tray_case' , pageId);
                                setTimeout(function(){trayObject_index = null},500);	
                            }
                        },20);
                    });
                    
                }
                else{
                    var scope = angular.element($("#search_gallery_elements")).scope();
                    var id = trayObject.attr('data-id');
                    scope.$apply( function () {
                        setTimeout( function () {
                            if (obj_stage_index != null && obj_stage_index != undefined && obj_stage_index != '') {
                                scope.makePublic(id,obj_stage_index,'stage_case');
                                obj_stage_index = null;
                            }
                            else{
                                scope.makePublic(id,trayObject_index,'tray_case');
                                setTimeout(function(){trayObject_index = null},500);	
                            }
                        },20);
                    });
                    
                }
            },
            /********************************************END******************************************************/	 

            
            /*________________________________________________________________________
            * @Date:      	22 june 2015
            * @Method :   	gsView
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	--
            * @Purpose:   	This is called to make private media public.
            * @Param:     	no
            * @Return:    	no
            _________________________________________________________________________
            */
            gsView: function (obj1 , pageId) {
                if(pageId != null){
                    var list_length = 0;
                    monIndex=obj1.index();
                    if ($('#'+pageId+' #search_view').css('display') == 'none') {
                            list_length = $('#'+pageId+' #holder-discuss li').length;
                    }else{
                            list_length = $('#'+pageId+' #holder-box li').length;
                    }
                    obj = obj1.clone();
                    //list_length = $('#holder-box li').length;
                    console.log('---------list length-------'+list_length);
                    console.log('---------index--------------'+monIndex);
                    $('#overlayContent').html('');
                    $('#overlay').css({'display':'block'});
                    if (obj.find(".linkContent").attr('class')) {
                            var data=obj.find('.linkContent').html();
                            data = data.replace(/@less@/g,"<");
                            data = data.replace(/gre@ter/g,">");
                            data = data.replace("less","<");
                            data = data.replace("greater",">");
                            $('#overlayContent').append('<div class="iframeMontage">'+data+'</div>');
                    }else if (obj.find(".noteContent").attr('class')) {
                            var data=obj.find('.noteContent').html();
                            data = ($('<div/>').html(data).text());
                            data = data.replace(/@less@/g,"<");
                            data = data.replace(/gre@ter/g,">");
                            data = data.replace("less","<");
                            data = data.replace("greater",">");

                            //if (data.indexOf('&lt') != -1) {
                            //}else{
                            $('#overlayContent').html('<div class="overlay-text-cont">'+data+'</div>');
                            //}
                    }
                    else if (obj.find(".videoContent").attr('class')) {
                            //$('#overlayContent').html('<video id="videoID" class="media_video" controls ><'+obj.find('.videoContent').html()+'></video><a onClick="btnReplay()">Replay</a>');
                            $('#overlayContent').html('<video id="videoID" class="media_video" controls ><'+obj.find('.videoContent').html()+'></video>');
                            console.log($('#overlayContent').html());
                            var whichBrowser = BrowserDetecter.whichBrowser();
                            var videoSrc = $('#overlayContent').find('source').attr('src');
                            //alert(videoSrc);
                            var ext = videoSrc.split('.').pop();

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
                            $('#overlayContent').find('source').attr('src', videoSrc);

                            var ext = videoSrc.split('.').pop();
                            $('#'+pageId+' .s-media-con').hide();
                            $('#'+pageId+' .d-media-con').hide();
                            media_type="text";
                    }
                    else{
                            obj.find("span img").unwrap();
                            obj.find("img").wrap('<div class="image-avatar"><span class="image-avatar-span"></span></div>')
                            $('#overlayContent').append(obj.html());
                    }
                    $('#overlayContent').append('<a id="closeBtn" onclick="montage_ele.closeOverlay()"><span class="">X</span></a><a onClick="montage_ele.monPrev()" id="mon_prev" class="prev-m trans navarrow-left"><span class="i-ico i-prev"></span></a><a id="mon_next" onClick="montage_ele.monNext()" class="next-m trans navarrow-right"><span class="i-ico i-next"></span></a>');
                    if (monIndex==(list_length-1)) {
                            $('#'+pageId+' #mon_next').css({'display':'none'})
                            $('#'+pageId+' #mon_prev').css({'display':'block'})
                    }
                    else if (monIndex == 0) {
                            $('#'+pageId+' #mon_prev').css({'display':'none'})
                            $('#'+pageId+' #mon_next').css({'display':'block'})
                    }else{
                            $('#'+pageId+' #mon_prev').css({'display':'block'})
                            $('#'+pageId+' #mon_next').css({'display':'block'})
                            $('#'+pageId+' #mon_prev').attr({'onClick':'montage_ele.monPrev()'})
                            $('#'+pageId+' #mon_next').attr({'onClick':'montage_ele.monNext()'})
                    }
                    $('#overlayContent').css({'display':'block'});
                    
                }
                else{
                    var list_length = 0;
                    monIndex=obj1.index();
                    if ($('#search_view').css('display') == 'none') {
                            list_length = $('#holder-discuss li').length;
                    }else{
                            list_length = $('#holder-box li').length;
                    }
                    obj = obj1.clone();
                    //list_length = $('#holder-box li').length;
                    console.log('---------list length-------'+list_length);
                    console.log('---------index--------------'+monIndex);
                    $('#overlayContent').html('');
                    $('#overlay').css({'display':'block'});
                    if (obj.find(".linkContent").attr('class')) {
                            var data=obj.find('.linkContent').html();
                            data = data.replace(/@less@/g,"<");
                            data = data.replace(/gre@ter/g,">");
                            data = data.replace("less","<");
                            data = data.replace("greater",">");
                            $('#overlayContent').append('<div class="iframeMontage">'+data+'</div>');
                    }else if (obj.find(".noteContent").attr('class')) {
                            var data=obj.find('.noteContent').html();
                            data = ($('<div/>').html(data).text());
                            data = data.replace(/@less@/g,"<");
                            data = data.replace(/gre@ter/g,">");
                            data = data.replace("less","<");
                            data = data.replace("greater",">");

                            //if (data.indexOf('&lt') != -1) {
                            //}else{
                                    $('#overlayContent').html('<div class="overlay-text-cont">'+data+'</div>');
                            //}
                    }
                    else if (obj.find(".videoContent").attr('class')) {
                            //$('#overlayContent').html('<video id="videoID" class="media_video" controls ><'+obj.find('.videoContent').html()+'></video><a onClick="btnReplay()">Replay</a>');
                            $('#overlayContent').html('<video id="videoID" class="media_video" controls ><'+obj.find('.videoContent').html()+'></video>');
                            console.log($('#overlayContent').html());
                            var whichBrowser = BrowserDetecter.whichBrowser();
                            var videoSrc = $('#overlayContent').find('source').attr('src');
                            //alert(videoSrc);
                            var ext = videoSrc.split('.').pop();

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
                            $('#overlayContent').find('source').attr('src', videoSrc);

                            var ext = videoSrc.split('.').pop();
                            $('.s-media-con').hide();
                            $('.d-media-con').hide();
                            media_type="text";
                    }
                    else{
                            obj.find("span img").unwrap();
                            obj.find("img").wrap('<div class="image-avatar"><span class="image-avatar-span"></span></div>')
                            $('#overlayContent').append(obj.html());
                    }
                    $('#overlayContent').append('<a id="closeBtn" onclick="montage_ele.closeOverlay()"><span class="">X</span></a><a onClick="montage_ele.monPrev()" id="mon_prev" class="prev-m trans navarrow-left"><span class="i-ico i-prev"></span></a><a id="mon_next" onClick="montage_ele.monNext()" class="next-m trans navarrow-right"><span class="i-ico i-next"></span></a>');
                    if (monIndex==(list_length-1)) {
                            $('#mon_next').css({'display':'none'})
                            $('#mon_prev').css({'display':'block'})
                    }
                    else if (monIndex == 0) {
                            $('#mon_prev').css({'display':'none'})
                            $('#mon_next').css({'display':'block'})
                    }else{
                            $('#mon_prev').css({'display':'block'})
                            $('#mon_next').css({'display':'block'})
                            $('#mon_prev').attr({'onClick':'montage_ele.monPrev()'})
                            $('#mon_next').attr({'onClick':'montage_ele.monNext()'})
                    }
                    $('#overlayContent').css({'display':'block'});
                    
                }
            
            },
            /********************************************END******************************************************/	 
			
            /*________________________________________________________________________
            * @Date:      	22 june 2015
            * @Method :   	monPrev
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	--
            * @Purpose:   	This is called to view previous media in montage.
            * @Param:     	no
            * @Return:    	no
            _________________________________________________________________________
            */
            monPrev: function(pageId){
                if(pageId != null){
                    //alert('prev')
                    console.log($('#'+pageId+' #search_view').css('display') == 'none');
                    if ($('#'+pageId+' #search_view').css('display') == 'none') {
                        var obj=$('#'+pageId+' #holder-discuss li:eq('+(monIndex-1)+')');
                        montage_ele.gsView(obj , pageId);
                    }else{
                        var obj=$('#'+pageId+' #holder-box li:eq('+(monIndex-1)+')');
                        montage_ele.gsView(obj , pageId);
                    }
                }
                else{
                    //alert('prev')
                    console.log($('#search_view').css('display') == 'none');
                    if ($('#search_view').css('display') == 'none') {
                            var obj=$('#holder-discuss li:eq('+(monIndex-1)+')');
                            montage_ele.gsView(obj);
                    }else{
                            var obj=$('#holder-box li:eq('+(monIndex-1)+')');
                            montage_ele.gsView(obj);
                    }
                    
                }
            },
            /********************************************END******************************************************/	 
            /*________________________________________________________________________
            * @Date:      	22 june 2015
            * @Method :   	monNext
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	--
            * @Purpose:   	This is called to view next media in montage.
            * @Param:     	no
            * @Return:    	no
            _________________________________________________________________________
            */
            monNext: function(pageId){
                if(pageId != null){
                    //console.log('monIndex = '+monIndex);
                    //console.log($('#search_view').css('display') == 'none');
                    if ($('#'+pageId+' #search_view').css('display') == 'none') {
                        var obj=$('#'+pageId+' #holder-discuss li:eq('+(monIndex+1)+')');
                        montage_ele.gsView(obj , pageId);
                    }else{
                        var obj=$('#'+pageId+' #holder-box li:eq('+(monIndex+1)+')');
                        montage_ele.gsView(obj , pageId);
                    }
                    
                }
                else{
                    //console.log('monIndex = '+monIndex);
                    //console.log($('#search_view').css('display') == 'none');
                    if ($('#search_view').css('display') == 'none') {
                            var obj=$('#holder-discuss li:eq('+(monIndex+1)+')');
                            montage_ele.gsView(obj);
                    }else{
                            var obj=$('#holder-box li:eq('+(monIndex+1)+')');
                            montage_ele.gsView(obj);
                    }
                    
                }
            },
            /********************************************END******************************************************/	 

			/*________________________________________________________________________
            * @Date:      	22 june 2015
            * @Method :   	closeOverlay
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	--
            * @Purpose:   	This is called to view next media in montage.
            * @Param:     	no
            * @Return:    	no
            _________________________________________________________________________
            */
            closeOverlay: function (pageId){
                if(pageId != null){
                    $('#overlay').css({'display':'none'});
                    $('#overlayContent').css({'display':'none'});
                    if($('#overlayContent').find('iframe').is('iframe')){
                            $('#overlayContent').find('iframe').remove(); /* sound continues to play after close popup 23Jan2015*/	
                    }
                    
                }
                else{
                    $('#overlay').css({'display':'none'});
                    $('#overlayContent').css({'display':'none'});
                    if($('#overlayContent').find('iframe').is('iframe')){
                            $('#overlayContent').find('iframe').remove(); /* sound continues to play after close popup 23Jan2015*/	
                    }
                    
                }

            },
            /********************************************END******************************************************/	 

            test: function(){
                alert('called');
            }		
			
        }
        return app;
    })(jQuery);

    jQuery(document).ready(function(){
        //alert(2);
        //montage_ele.init();
    });
}
startupall_montage();