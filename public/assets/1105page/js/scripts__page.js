var small__thumbnail = '';
var medium__thumbnail = '';
var large__thumbnail = '';
function startupall(){
        //alert("called----");
	mediaSite = (function($){
        var app = {
            init: function(pageId){
                if(pageId != null){
                    window.obj_stage_index = null;
                    app.initSmallHeader(pageId);
                    app.jscriptNgcommon.init__urlLocations(pageId);
                    app.init_jpushMEnu_left(pageId);
                    app.init_fraola(pageId);
                    app.initModalPopup(pageId);
                    app.init_captureText(pageId);
                    app.initSlider(pageId);
                    app.init_linkDropTextBox(pageId);
                    app.initSearchAnim(pageId);
                    app.init_button_effect(pageId);
                    app.init__discussClick(pageId);
                    app.initAnsboxAnim(pageId);
                    app.resetSearchHeader(pageId);
                    app.init__searchClick(pageId);
                    
                }
                else{
                    window.obj_stage_index = null;
                    app.initSmallHeader();
                    app.jscriptNgcommon.init__urlLocations();
                    app.init_jpushMEnu_left();
                    app.init_fraola();
                    app.initModalPopup();
                    app.init_captureText();
                    app.initSlider();
                    app.init_linkDropTextBox();
                    app.initSearchAnim();
                    app.init_button_effect();
                    app.init__discussClick();
                    app.initAnsboxAnim();
                    app.resetSearchHeader();
                    app.init__searchClick();
                    
                }
                
            },
            init_linkDropTextBox: function(pageId){
                if(pageId != null){
                    $("#"+pageId+" #capturetext").on('keypress',function(){
                        return false;
                    })
                    $(document).on("click", "#"+pageId+" .ui-dialog-titlebar button.ui-dialog-titlebar-close", function(){
                        $("#"+pageId+" #capturetext").val("");
                    })
                }
                else{
                    $("#capturetext").on('keypress',function(){
                        return false;
                    })
                    $(document).on("click", ".ui-dialog-titlebar button.ui-dialog-titlebar-close", function(){
                        $("#capturetext").val("");
                    })
                }
            },
            /*________________________________________________________________________
            * @Date:      	18 june 2015
            * @Method :   	initSearchAnim
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	-
            * @Purpose:   	This is used initialize animations in search page.
            * @Param:     	-
            * @Return:    	no
            _________________________________________________________________________
            */
            initSearchAnim: function(pageId){
                if(pageId != null){
                    $("#"+pageId+" .dropdown-box-hover").hover(function () {
                        $(this).toggleClass("dropdown-box-full");
                    });

                    $("#"+pageId+" .dropdown-box-mobile").click(function () {
                        $(this).toggleClass("dropdown-box-full");
                        console.log($(this).find('.dropdown-nav'))
                        $(this).find('.dropdown-nav').toggle()
                    });
                    $("#"+pageId+" .toggle-icn").on('click', function(event){
                        event.preventDefault();
                        console.log('clicked');
                        $('body').toggleClass('sidebar-toggle');	
                        if($('body').hasClass('sidebar-toggle')){
                            console.log('in if');
                            $('body , html, #'+pageId+" .inner-container").scrollTop(0);
                            $("#"+pageId+" .inner-container").height($("#"+pageId+" .sidebar-panel").height()-30).css({'overflow':'hidden'});
                            $("#"+pageId+" .gallery-block").css({'position':'fixed'});
                        }else{
                            $("#"+pageId+" .inner-container").height('').css({'overflow':'visible'});
                            $('body , html, #'+pageId+" .inner-container").scrollTop(0);
                            $("#"+pageId+" .gallery-block").css({'position':'relative'});
                            console.log('in else');
                        }
                        event.stopPropagation();
                    });

                    $(document).mouseup(function (e){
                        //console.log(e.target);
                        var container = $("#"+pageId+" .sidebar-panel");
                        var toggleBtn = $("#"+pageId+" .toggle-icn");

                        if (!container.is(e.target) // if the target of the click isn't the container...
                                && container.has(e.target).length === 0 && !toggleBtn.is(e.target) && toggleBtn.has(e.target).length === 0) // ... nor a descendant of the container
                        {
                            //container.hide();
                            if($('body').hasClass('sidebar-toggle')){
                                $('body').removeClass('sidebar-toggle');
                                $("#"+pageId+" .inner-container").height('').css({'overflow':'visible'});
                                $('body , html, #'+pageId+" .inner-container").scrollTop(0);
                                $("#"+pageId+" .gallery-block").css({'position':'relative'});
                            }
                            //console.log('outside');
                        }else{
                            //console.log('inside');
                        }

                    });
                    $("#"+pageId+" .quest-row-sml").click(function(){
                        $("#"+pageId+" .quest-block").slideDown('slow',function(){
                            $("#"+pageId+" .tag-block").removeClass('tag-block-scroll');
                            $("#"+pageId+" .tag-block").removeClass('shadow-no');
                            $("#"+pageId+" .tag-block").removeClass('grey-bg');	
                            var scope2 = angular.element($("#"+pageId+" #search_gallery_elements")).scope();
                            scope2.small_header = false;
                            scope2.$apply();	
                            scope2 = null;
                            setTimeout(function(){
                                $("#"+pageId+" .inner-container").css('top',$("#"+pageId+" .header").outerHeight());
                                $("#"+pageId+" .gallery-block").css('top',$("#"+pageId+" .header").outerHeight());
                                $("#"+pageId+" .sidebar-panel").css('top', $("#"+pageId+" .header").outerHeight());
                            },1)
                            $("#"+pageId+" .ansr-box-inr").trigger('focus');
                        })
                    });

                    //sidebar scroll based on window height
                    var windowHeight = $(window).height();
                    var sidebarHeight = $("#"+pageId+" .sidebar-panel").outerHeight();
                    if(sidebarHeight > (windowHeight- $("#"+pageId+" .header").outerHeight())){
                        $("#"+pageId+" .sidebar-panel").addClass('sidebar-scroll');
                    }

                    //inner container top position header height
                    //sidebar top position & height based on header height
                    // on window load first case
                    setTimeout(function(){
                        $("#"+pageId+" .sidebar-panel").css('top', $("#"+pageId+" .header").outerHeight());
                        $("#"+pageId+" .gallery-block").css('top',$("#"+pageId+" .header").outerHeight());
                    },500)

                    //custom scrollbar
                    $("#"+pageId+" .sidebar-panel").mCustomScrollbar({
                        theme:"light-3"
                    });

                }else{
                    $(".dropdown-box-hover").hover(function () {
                        $(this).toggleClass("dropdown-box-full");
                    });

                    $(".dropdown-box-mobile").click(function () {
                        $(this).toggleClass("dropdown-box-full");
                        console.log($(this).find('.dropdown-nav'))
                        $(this).find('.dropdown-nav').toggle()
                    });
                    $('.toggle-icn').on('click', function(event){
                        event.preventDefault();
                        console.log('clicked');
                        $('body').toggleClass('sidebar-toggle');	
                        if($('body').hasClass('sidebar-toggle')){
                            console.log('in if');
                            $('body , html, .inner-container').scrollTop(0);
                            $('.inner-container').height($('.sidebar-panel').height()-30).css({'overflow':'hidden'});
                            $('.gallery-block').css({'position':'fixed'});
                        }else{
                            $('.inner-container').height('').css({'overflow':'visible'});
                            $('body , html, .inner-container').scrollTop(0);
                            $('.gallery-block').css({'position':'relative'});
                            console.log('in else');
                        }
                        event.stopPropagation();
                    });

                    $(document).mouseup(function (e){
                        //console.log(e.target);
                        var container = $(".sidebar-panel");
                        var toggleBtn = $('.toggle-icn');

                        if (!container.is(e.target) // if the target of the click isn't the container...
                                && container.has(e.target).length === 0 && !toggleBtn.is(e.target) && toggleBtn.has(e.target).length === 0) // ... nor a descendant of the container
                        {
                            //container.hide();
                            if($('body').hasClass('sidebar-toggle')){
                                $('body').removeClass('sidebar-toggle');
                                $('.inner-container').height('').css({'overflow':'visible'});
                                $('body , html, .inner-container').scrollTop(0);
                                $('.gallery-block').css({'position':'relative'});
                            }
                            //console.log('outside');
                        }else{
                            //console.log('inside');
                        }

                    });
                    $('.quest-row-sml').click(function(){
                        $('.quest-block').slideDown('slow',function(){
                            $('.tag-block').removeClass('tag-block-scroll');
                            $('.tag-block').removeClass('shadow-no');
                            $('.tag-block').removeClass('grey-bg');	
                            var scope2 = angular.element($("#search_gallery_elements")).scope();
                            scope2.small_header = false;
                            scope2.$apply();	
                            scope2 = null;
                            setTimeout(function(){
                                $('.inner-container').css('top',$('.header').outerHeight());
                                $('.gallery-block').css('top',$('.header').outerHeight());
                                $('.sidebar-panel').css('top', $('.header').outerHeight());
                            },1)
                            $('.ansr-box-inr').trigger('focus');
                        })
                    });

                    //sidebar scroll based on window height
                    var windowHeight = $(window).height();
                    var sidebarHeight = $('.sidebar-panel').outerHeight();
                    if(sidebarHeight > (windowHeight- $('.header').outerHeight())){
                        $('.sidebar-panel').addClass('sidebar-scroll');
                    }

                    //inner container top position header height
                    //sidebar top position & height based on header height
                    // on window load first case
                    setTimeout(function(){
                        $('.sidebar-panel').css('top', $('.header').outerHeight());
                        $('.gallery-block').css('top',$('.header').outerHeight());
                    },500)

                    //custom scrollbar
                    $(".sidebar-panel").mCustomScrollbar({
                        theme:"light-3"
                    });
                }
            },
            /*****************************************END*********************************************************/	

            /*________________________________________________________________________
            * @Date:      	23june 2015
            * @Method :   	initAnsboxAnim
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	-
            * @Purpose:   	This is used initialize animations on answer box in search page.
            * @Param:     	-
            * @Return:    	no
            _________________________________________________________________________
            */
            initAnsboxAnim: function(pageId){
                    if(pageId != null){
                        $("#"+pageId+' .ansr-box-inr').on('keypress',function(){
                            if ($("#"+pageId+' .ansr-box-inr').text().indexOf('Start typing and click on the keywords OR drop any media from the web or your drive.') != -1) {
                                $("#"+pageId+' #dn-btn').fadeOut();
                            }else if ($("#"+pageId+' .ansr-box-inr').text() == '') {
                                $("#"+pageId+' #dn-btn').fadeOut();
                            }else{
                                $("#"+pageId+' #dn-btn').fadeIn();
                            }
                        });

                        $("#"+pageId+' .ansr-box-inr').on('focus',function(){
                            $("#"+pageId+' .ansr-box-focus').addClass('focus-line');
                            if ($("#"+pageId+' .ansr-box-inr').text().indexOf('Start typing and click on the keywords OR drop any media from the web or your drive.') != -1) {
                                $("#"+pageId+' .ansr-box-inr').text('')
                            }else{
                                $("#"+pageId+' #dn-btn').fadeIn();
                            }
                        });

                        $("#"+pageId+' .ansr-box-inr').on('blur',function(){
                                $("#"+pageId+' .ansr-box-focus').removeClass('focus-line');
                                $("#"+pageId+' #dn-btn').fadeOut()
                                if ($("#"+pageId+' .ansr-box-inr').text() == '') {
                                    $("#"+pageId+' .ansr-box-inr').text('Start typing and click on the keywords OR drop any media from the web or your drive.');
                                }
                        });
                        //$('.ansr-box-inr').trigger('focus');
                        
                    }
                    else{
                        $('.ansr-box-inr').on('keypress',function(){
                            if ($('.ansr-box-inr').text().indexOf('Start typing and click on the keywords OR drop any media from the web or your drive.') != -1) {
                                $('#dn-btn').fadeOut();
                            }else if ($('.ansr-box-inr').text() == '') {
                                $('#dn-btn').fadeOut();
                            }else{
                                $('#dn-btn').fadeIn();
                            }
                        });

                        $('.ansr-box-inr').on('focus',function(){
                            $('.ansr-box-focus').addClass('focus-line');
                            if ($('.ansr-box-inr').text().indexOf('Start typing and click on the keywords OR drop any media from the web or your drive.') != -1) {
                                $('.ansr-box-inr').text('')
                            }else{
                                $('#dn-btn').fadeIn();
                            }
                        });

                        $('.ansr-box-inr').on('blur',function(){
                            $('.ansr-box-focus').removeClass('focus-line');
                            $('#dn-btn').fadeOut()
                            if ($('.ansr-box-inr').text() == '') {
                                $('.ansr-box-inr').text('Start typing and click on the keywords OR drop any media from the web or your drive.');
                            }
                        });
                        //$('.ansr-box-inr').trigger('focus');
                    }
            },
            /*****************************************END*********************************************************/	

            /*________________________________________________________________________
            * @Date:      	26 May 2015
            * @Method :   	clickAll
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	-
            * @Purpose:   	This is used initialize slider on descriptors in search page
            * @Param:     	-
            * @Return:    	no
            _________________________________________________________________________
            */
            clickAll: function(obj , pageId) {
                   if(pageId != null){
                        var name=obj.attr('name');
                        //alert(obj.prop('checked'));
                        if (obj.prop(' checked')) {
                            $("#"+pageId+' .filter_checbox').each(function(){
                                if($(this).find('.radiobb').attr('name')==name){
                                    $(this).find('.radiobb').prop("checked",true);
                                }
                            });
                        }
                        else{
                            $("#"+pageId+' .filter_checbox').each(function(){
                                if($(this).find('.radiobb').attr('name')==name){
                                        $(this).find('.radiobb').prop("checked",false);
                                }
                            });
                        }
                    }
                   else{
                       var name=obj.attr('name');
                        //alert(obj.prop('checked'));
                        if (obj.prop('checked')) {
                                $('.filter_checbox').each(function(){
                                        if($(this).find('.radiobb').attr('name')==name){
                                                $(this).find('.radiobb').prop("checked",true);
                                        }
                                });
                        }
                        else{
                                $('.filter_checbox').each(function(){
                                        if($(this).find('.radiobb').attr('name')==name){
                                                $(this).find('.radiobb').prop("checked",false);
                                        }
                                });

                        }
                   }
            },
            /*****************************************END*********************************************************/	

            /*________________________________________________________________________
            * @Date:      	26 May 2015
            * @Method :   	init__slider
            * Created By: 	smartData Enterprises Ltd
            * Modified On:	-
            * @Purpose:   	This is used initialize slider on descriptors in search page
            * @Param:     	-
            * @Return:    	no
            _________________________________________________________________________
            */
            initSlider: function(pageId){
                if(pageId != null){
                    //$('#lmn_slider').lemmonSlider();
                    console.log('called');
                    $("#"+pageId+' #lmn_slider').find('li').removeClass('active');
                    $("#"+pageId+' #lmn_slider').find('li').eq(0).addClass('active');
                    $("#"+pageId+' #lmn_slider').lemmonSlider({'loop':false});
                    setTimeout(function(){
                        //$('#lmn_slider ul').css({'padding-right':'0px'});
                        var setWidth = ($("#"+pageId+' #lmn_slider ul li').length)*30 +$("#"+pageId+' #lmn_slider ul').width();
                        $("#"+pageId+' #lmn_slider ul').width(setWidth);
                        if ($("#"+pageId+' #lmn_slider ul').width() >$("#"+pageId+' #lmn_slider').width()) {
                            $("#"+pageId+' .prev-slide').fadeIn();
                            $("#"+pageId+' .next-slide').fadeIn();
                        }else{
                            $("#"+pageId+' .prev-slide').fadeOut();
                            $("#"+pageId+' .next-slide').fadeOut();
                        }
                    },100);
                    
                }
                else{
                    //$('#lmn_slider').lemmonSlider();
                    console.log('called');
                    $('#lmn_slider').find('li').removeClass('active');
                    $('#lmn_slider').find('li').eq(0).addClass('active');
                    $('#lmn_slider').lemmonSlider({'loop':false});
                    setTimeout(function(){
                            //$('#lmn_slider ul').css({'padding-right':'0px'});
                            var setWidth = ($('#lmn_slider ul li').length)*30 +$('#lmn_slider ul').width();
                            $('#lmn_slider ul').width(setWidth);
                            if ($('#lmn_slider ul').width() >$('#lmn_slider').width()) {
                                    $('.prev-slide').fadeIn();
                                    $('.next-slide').fadeIn();
                            }else{
                                    $('.prev-slide').fadeOut();
                                    $('.next-slide').fadeOut();
                            }
                    },100);
                    
                }

            },
            /*****************************************END*********************************************************/	
            initSmallHeader:function(pageId){
                if(pageId != null){
                    var tagBlock = $("#"+pageId+' .tag-block'); 
                    //var tagBlock = $('.slider2');
                    var body = $('body');
                    var questBlock = $("#"+pageId+" .quest-block");
                    var keywordSpan = $("#"+pageId+' .tag-block .tag-list .slick-track').find('.slick-slide span');
                }
                else{
                    var tagBlock = $('.tag-block'); 
                    //var tagBlock = $('.slider2');
                    var body = $('body');
                    var questBlock = $(".quest-block");
                    var keywordSpan = $('.tag-block .tag-list .slick-track').find('.slick-slide span');
                }
            },

    /********  "init__searchClick" function to handle click on search list items*/
            init__searchClick: function(pageId){
                if(pageId != null){
                    //alert("---init__searchClick---");
                    var search__elements = $("#"+pageId+" #search_gallery_elements");
                    //alert(search__elements.parent().parent().html());
                    search__elements.on('click',".gallery-block .search_item",function(e){
                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        app.view_mediaSearch($(this) , pageId);
                        $("#"+pageId+" #holder-box").attr({'is-private':'0'});
                    })
                }
                else{
                    var search__elements = $('#search_gallery_elements');

                    search__elements.on('click','.gallery-block .search_item',function(e){
                            if (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                            }

                            app.view_mediaSearch($(this));
                            $('#holder-box').attr({'is-private':'0'});
                    })
                }
            },
    /******** init_captureText handles click and key press events for textbox in upload link dialog ********/	
            init_captureText: function(pageId){
                if(pageId != null){
                    $(document).on("click", "#"+pageId+" .ui-dialog-titlebar button.ui-dialog-titlebar-close", function(){
                        $("#"+pageId+" #capturetext").val("");
                    })
                    $("#"+pageId+" #capturetext").on('keypress',function(){
                        return false;	
                    })
                    $("#"+pageId+" #capturetext").on("drop", function(event) {
                        event.stopPropagation();
                        if ($(this).val()!="") {
                            $(this).val("")
                            $(this).focus();
                        }		
                    });
                }
                else{
                    $(document).on("click", ".ui-dialog-titlebar button.ui-dialog-titlebar-close", function(){
                            $("#capturetext").val("");
                    })
                    $("#capturetext").on('keypress',function(){
                            return false;	
                    })
                    $("#capturetext").on("drop", function(event) {
                            event.stopPropagation();
                            if ($(this).val()!="") {
                                    $(this).val("")
                                    $(this).focus();
                            }		
                    });
                    
                }
            },
    /********  "init__searchClick" function to handle click on search list items*/
            init__discussClick: function(pageId){
                if(pageId != null){
                    var discuss__elements = $("#"+pageId+' #discuss_gallery_elements');
                    //for .on() to work on dynamic html parent on which function is applied should be static
                    // i.e. not dynamic
                    discuss__elements.on('click',"#"+pageId+' .discuss_item a',function(e){
                        console.log('------------------init__discussClick------------');
                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        app.view_mediaDiscuss($(this) , pageId);
                        //$('#holder-box').attr({'is-private':'0'});
                    })
                    
                }
                else{
                    var discuss__elements = $('#discuss_gallery_elements');
                    //for .on() to work on dynamic html parent on which function is applied should be static
                    // i.e. not dynamic
                    discuss__elements.on('click','.discuss_item a',function(e){
                            console.log('------------------init__discussClick------------');
                            if (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                            }
                            app.view_mediaDiscuss($(this));
                            //$('#holder-box').attr({'is-private':'0'});
                    })
                    
                }
            },
    /********  "discussTrayClick" function to handle click on discuss list media tray items*/
            discussTrayClick : function(obj , pageId){
                if(pageId != null){
                    var scope = angular.element($("#"+pageId+" #search_gallery_elements")).scope();
                    scope.setMediaId__mannualy(obj.attr('data-id') , pageId);
                    scope.showCloseSingle = true;
                    scope.showAddImage = false;
                    var new_obj = angular.element(obj.parent().find('a'));
                    if (obj.attr('is-private')=='1') {
                        $("#"+pageId+' #holder-box').attr({'is-private':'1'});
                        obj_stage_index = obj.parent().index();
                    }
                    else{
                        $("#"+pageId+' #holder-box').attr({'is-private':'0'});
                        obj_stage_index = null;
                    }
                    app.view_mediaSearch(new_obj , pageId);
                    setTimeout(function(){
                        montage_ele.remove_from_trays(obj , pageId);
                    },1) 
                }
                else{
                    var scope = angular.element($("#search_gallery_elements")).scope();
                    scope.setMediaId__mannualy(obj.attr('data-id'));
                    scope.showCloseSingle = true;
                    scope.showAddImage = false;
                    var new_obj = angular.element(obj.parent().find('a'));
                    if (obj.attr('is-private')=='1') {
                            $('#holder-box').attr({'is-private':'1'});
                            obj_stage_index = obj.parent().index();
                    }
                    else{
                            $('#holder-box').attr({'is-private':'0'});
                            obj_stage_index = null;
                    }
                    app.view_mediaSearch(new_obj);
                    setTimeout(function(){
                            montage_ele.remove_from_trays(obj);
                    },1) 
                    
                }
            },


    /*common function for init__searchClick and discussTrayClick*/
            view_mediaSearch:function(obj , pageId){
                alert("3244444view now - set");
                if(pageId != null){
                    alert("view now - set");
                    var scope = angular.element($("#"+pageId+" #search_gallery_elements")).scope();
                    scope.reset__views(pageId);
                    $("#"+pageId+" #search_view").show();
                    scope.init__stateVar(pageId);
                    scope.sync_searchViewTray(pageId);
                    $("#"+pageId+" #search-media-tray li").each(function(){
                        obj.find('a').attr('onClick','gridster_tray($(this))')
                        obj.addClass('drag-me');
                    });
                    setTimeout(function(){$("#"+pageId+" .drag-me").draggable({revert:'invalid',helper: 'clone'});},50);
                    //var index = obj.parent().index();

                    /****MONTAGE*****/
                    if (obj.find(".montageContent").attr('class')) {
                        var data=obj.find('.montageContent').html();
                        console.log('data',data);
                        data = $('<div/>').html(data).text();
                        console.log("#"+pageId+" .montageContent",data);
                        data = data.replace(/@frst@/g,"<");
                        data = data.replace(/@second@/g,">");
                        //data = data.replace("less","<");
                        //data = data.replace("greater",">");
                        //data = ;
                        $("#"+pageId+" .gridster.gridster-montage").addClass('sepcial_montageCase');
                        $("#"+pageId+" #holder-box").html('<div id="montageContainer" class="montageContainer">'+data+'</div>');
                        $("#"+pageId+" #holder-box").find('li').attr("onClick","montage_ele.gsView($(this))");
                        $("#"+pageId+" #holder-box").append("<div id='montageActual' style='display:none'>"+obj.html()+"</div>");
                    }
                    /***LINK****/
                    else if (obj.find(".linkContent").attr('class')) {
                        var data = obj.find('.linkContent').html();
                        data = $('<div/>').html(data).text();
                        data = data.replace(/@less@/g,"<");
                        data = data.replace(/gre@ter/g,">");
                        //data = data.replace("less","<");
                        //data = data.replace("greater",">");
                        $("#"+pageId+" #holder-box").html("<div id='iframeContainer' class='holder_bulb_iframe'></div>");
                        $("#"+pageId+" #iframeContainer").html(data);
                        var strIframeHTML =  obj.find('.linkContent').text();
                        strIframeHTML = strIframeHTML.replace("<","less");
                        strIframeHTML = strIframeHTML.replace(">","greater");
                        var linkdataContent = '<p class="linkContent" style="display: none">'+strIframeHTML+'</p>';
                        var linkdataElement = '<div id="linkActual" style="display:none"><p class="innerimg-wrap">'+obj.find('img').get(0).outerHTML+'</p>'+linkdataContent+'</div>';                    
                        $("#"+pageId+" #holder-box").append(linkdataElement);
                    }
                    /***NOTES***/
                    else if (obj.find(".noteContent").attr('class')) {
                        var data=obj.find('.noteContent').html();
                        data = $('<div/>').html(data).text();
                        data = data.replace(/@less@/g,"<");
                        data = data.replace(/gre@ter/g,">");
                        //data = data.replace("less","<");
                        //data = data.replace("greater",">");
                        $("#"+pageId+" #holder-box").html('<div id="noteContainer">'+data+'</div>');
                        $("#"+pageId+" #holder-box").append("<div id='noteActual' style='display:none'>"+obj.html()+"</div>");
                    }
                    /***VIDEOS***/
                    else if(obj.find('.videoContent').is('p')){
                        $("#"+pageId+" #holder-box").html("<div id='videoContainer' class='holder_bulb_iframe'></div>");
                        $("#"+pageId+" #videoContainer").append('<video class="media_video" controls ><'+obj.find('.videoContent').html()+'></video>');
                        var whichBrowser = BrowserDetecter.whichBrowser();
                        var videoSrc = $("#"+pageId+" #holder-box").find('source').attr('src');
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
                        $("#"+pageId+" #holder-box").append("<div id='videoActual' style='display:none'>"+obj.html()+"</div>");

                    }
                    /*** ELSE (-images-)****/
                    else{
                        var str = obj.find('img').attr('src');
                        var res = str.replace("/"+medium__thumbnail, "/"+discuss__thumbnail);
                        var res = str.replace("/"+small__thumbnail, "/"+discuss__thumbnail);//19022015			
                        $("#"+pageId+" #holder-box").html('<img src="'+res+'">');
                    }
                    /***END***/
                    scope = null;
                }
                else{
                    alert("ELSE-----view now - set");
                    var scope = angular.element($("#search_gallery_elements")).scope();
                    scope.reset__views();
                    $('#search_view').show();
                    scope.init__stateVar();
                    scope.sync_searchViewTray();
                    $("#search-media-tray li").each(function(){
                        obj.find('a').attr('onClick','gridster_tray($(this))')
                        obj.addClass('drag-me');
                    });
                    setTimeout(function(){$('.drag-me').draggable({revert:'invalid',helper: 'clone'});},50);
                    //var index = obj.parent().index();

                    /****MONTAGE*****/
                    if (obj.find(".montageContent").attr('class')) {
                        var data=obj.find('.montageContent').html();
                        console.log('data',data);
                        data = $('<div/>').html(data).text();
                        console.log('.montageContent',data);
                        data = data.replace(/@frst@/g,"<");
                        data = data.replace(/@second@/g,">");
                        //data = data.replace("less","<");
                        //data = data.replace("greater",">");
                        //data = ;
                        $('.gridster.gridster-montage').addClass('sepcial_montageCase');
                        $('#holder-box').html('<div id="montageContainer" class="montageContainer">'+data+'</div>');
                        $('#holder-box').find('li').attr("onClick","montage_ele.gsView($(this))");
                        $('#holder-box').append("<div id='montageActual' style='display:none'>"+obj.html()+"</div>");
                    }
                    /***LINK****/
                    else if (obj.find(".linkContent").attr('class')) {
                        var data = obj.find('.linkContent').html();
                        data = $('<div/>').html(data).text();
                        data = data.replace(/@less@/g,"<");
                        data = data.replace(/gre@ter/g,">");
                        //data = data.replace("less","<");
                        //data = data.replace("greater",">");
                        $('#holder-box').html("<div id='iframeContainer' class='holder_bulb_iframe'></div>");
                        $('#iframeContainer').html(data);
                        var strIframeHTML =  obj.find('.linkContent').text();
                        strIframeHTML = strIframeHTML.replace("<","less");
                        strIframeHTML = strIframeHTML.replace(">","greater");
                        var linkdataContent = '<p class="linkContent" style="display: none">'+strIframeHTML+'</p>';
                        var linkdataElement = '<div id="linkActual" style="display:none"><p class="innerimg-wrap">'+obj.find('img').get(0).outerHTML+'</p>'+linkdataContent+'</div>';                    
                        $('#holder-box').append(linkdataElement);
                    }
                    /***NOTES***/
                    else if (obj.find(".noteContent").attr('class')) {
                        var data=obj.find('.noteContent').html();
                        data = $('<div/>').html(data).text();
                        data = data.replace(/@less@/g,"<");
                        data = data.replace(/gre@ter/g,">");
                        //data = data.replace("less","<");
                        //data = data.replace("greater",">");
                        $('#holder-box').html('<div id="noteContainer">'+data+'</div>');
                        $('#holder-box').append("<div id='noteActual' style='display:none'>"+obj.html()+"</div>");
                    }
                    /***VIDEOS***/
                    else if(obj.find('.videoContent').is('p')){
                        $('#holder-box').html("<div id='videoContainer' class='holder_bulb_iframe'></div>");
                        $('#videoContainer').append('<video class="media_video" controls ><'+obj.find('.videoContent').html()+'></video>');
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
                        $('#holder-box').append("<div id='videoActual' style='display:none'>"+obj.html()+"</div>");

                    }
                    /*** ELSE (-images-)****/
                    else{
                        var str = obj.find('img').attr('src');
                        var res = str.replace("/"+medium__thumbnail, "/"+discuss__thumbnail);
                        var res = str.replace("/"+small__thumbnail, "/"+discuss__thumbnail);//19022015			
                        $('#holder-box').html('<img src="'+res+'">');
                    }
                    /***END***/
                    scope = null;
                }
            },
            view_mediaDiscuss: function(obj , pageId){
                if(pageId != null){
                    var scope36 = angular.element($("#"+pageId+" #search_gallery_elements")).scope();
                    scope36.__isMontagePrivate = false;
                    scope36.switch__toDiscussView(pageId);
                    scope36 = null;
                    obj.attr("href","javascript:void(0)");
                    $("#"+pageId+' #dM-prev-m2').find('img').attr("src","");
                    $("#"+pageId+' #dM-next-m2').find('img').attr("src","");
                    var discuss_list = $("#"+pageId+' .col-xs-4');
                    var index=parseInt($(obj).attr("name"),10);
                    console.log('clicked function');
                    app.set_prev__next(obj);
                    var newobj=app.get_discussHTML(obj);
                    $("#"+pageId+' #holder-discuss').html(newobj);
                    if (obj.find(".montageContent").attr('class')) {
                        $("#"+pageId+' #holder-discuss').find('li').attr("onClick","montage_ele.gsView($(this))");
                    }
                    return false;
                    
                }
                else{
                    var scope36 = angular.element($("#search_gallery_elements")).scope();
                    scope36.__isMontagePrivate = false;
                    scope36.switch__toDiscussView();
                    scope36 = null;
                    obj.attr("href","javascript:void(0)");
                    $('#dM-prev-m2').find('img').attr("src","");
                    $('#dM-next-m2').find('img').attr("src","");
                    var discuss_list = $('.col-xs-4');
                    var index=parseInt($(obj).attr("name"),10);
                    console.log('clicked function');
                    app.set_prev__next(obj);
                    var newobj=app.get_discussHTML(obj);
                    $('#holder-discuss').html(newobj);
                    if (obj.find(".montageContent").attr('class')) {
                            $('#holder-discuss').find('li').attr("onClick","montage_ele.gsView($(this))");
                    }
                    return false;
                    
                }
            },
            get_discussHTML: function(obj , pageId){
                if(pageId != null){
                    $("#"+pageId+' #discuss_view .m-gridster.m-gridster-2').removeClass('gridMontageCase');
                    var data =''
                    if (obj.find(".montageContent").attr('class')) {
                        $("#"+pageId+' #discuss_view .m-gridster.m-gridster-2').addClass('gridMontageCase');
                        data=obj.find('.montageContent').html();
                        data = '<div class="montageContainer">'+$('<div/>').html(data).text()+'</div>';
                        $("#"+pageId+' #holder-discuss').css({'width':'444px'});
                        $("#"+pageId+' #holder-discuss').find('li').attr("onClick","montage_ele.gsView($(this))");
                    }
                    else if (obj.find(".noteContent").attr('class')) {
                        data=obj.find('.noteContent').text();
                        data = data.replace(/@less@/g,"<");
                        data = data.replace(/gre@ter/g,">");
                        data = '<div class="noteContainer">'+data+'</div>';
                    }
                    else if(obj.find('.videoContent').is('p')){
                        var newobj = angular.element('<div class="video-box"><video class="media_video" controls ></video></div>');
                        var newobj__videosrc = angular.element('<div class="video-box"><video class="media_video" controls ><'+obj.find('.videoContent').html()+'></video></div>');
                        var whichBrowser = BrowserDetecter.whichBrowser();
                        var videoSrc = newobj__videosrc.find('source').attr('src');
                        var ext = videoSrc.split('.').pop();
                        //console.log('whichBrowser = ',whichBrowser);
                        newobj.find('video').append('<source src="'+ videoSrc.replace('.'+ext,'.webm')+'"/>');
                        newobj.find('video').append('<source src="'+ videoSrc.replace('.'+ext,'.mp4')+'"/>');

                        if (whichBrowser == 'Safari') {
                            if ( ext.toUpperCase() != 'MP4' ) {
                                videoSrc = videoSrc.replace('.'+ext,'.mp4');
                                newobj.find('video').html('<source src="'+ videoSrc+'"/>');
                            }
                        }
                        data = '<div class="video-box">'+newobj.html()+'</div>';
                    }
                    else if(obj.find('.audioContent').is('p')){
                        var newobj = angular.element('<video class="media_video" controls poster="../assets/img/audio-recording-thumb.jpg"><'+obj.find('.audioContent').html()+'></video>');
                        var whichBrowser = BrowserDetecter.whichBrowser();
                        var audioSrc = newobj.find('source').attr('src');
                        var ext = audioSrc.split('.').pop();
                        audioSrc = audioSrc.replace('.'+ext,'.mp3');
                        newobj.find('source').attr('src', audioSrc);
                        var ext = audioSrc.split('.').pop();
                        data = '<div class="audio-box">'+newobj.html()+'</div>';
                    }
                    else if (obj.find(".linkContent").attr('class')) {
                        data=obj.find('.linkContent').html();
                        $("#"+pageId+' #holder-discuss').html()
                        data= "<div id='iframeContainer' class='holder_bulb_iframe'>"+$('<div/>').html(data).text()+'</div>';
                    }
                    else if (typeof(obj.find('.media_img').attr('src'))=='string') {
                        /*-----remove medium from img url---15Jan15--*/
                        imgStr = obj.find('.media_img').attr('src'); //20022015
                        data = '<img src="'+imgStr+'">';
                        /*-----end------*/
                    }
                    return data;
                    
                }
                else{
                    $('#discuss_view .m-gridster.m-gridster-2').removeClass('gridMontageCase');
                    var data =''
                    if (obj.find(".montageContent").attr('class')) {
                        $('#discuss_view .m-gridster.m-gridster-2').addClass('gridMontageCase');
                        data=obj.find('.montageContent').html();
                        data = '<div class="montageContainer">'+$('<div/>').html(data).text()+'</div>';
                        $('#holder-discuss').css({'width':'444px'});
                        $('#holder-discuss').find('li').attr("onClick","montage_ele.gsView($(this))");

                    }
                    else if (obj.find(".noteContent").attr('class')) {
                        data=obj.find('.noteContent').text();
                        data = data.replace(/@less@/g,"<");
                        data = data.replace(/gre@ter/g,">");
                        data = '<div class="noteContainer">'+data+'</div>';
                    }
                    else if(obj.find('.videoContent').is('p')){
                        var newobj = angular.element('<div class="video-box"><video class="media_video" controls ></video></div>');
                        var newobj__videosrc = angular.element('<div class="video-box"><video class="media_video" controls ><'+obj.find('.videoContent').html()+'></video></div>');
                        var whichBrowser = BrowserDetecter.whichBrowser();
                        var videoSrc = newobj__videosrc.find('source').attr('src');
                        var ext = videoSrc.split('.').pop();
                        //console.log('whichBrowser = ',whichBrowser);
                        newobj.find('video').append('<source src="'+ videoSrc.replace('.'+ext,'.webm')+'"/>');
                        newobj.find('video').append('<source src="'+ videoSrc.replace('.'+ext,'.mp4')+'"/>');

                        if (whichBrowser == 'Safari') {
                          if ( ext.toUpperCase() != 'MP4' ) {
                                videoSrc = videoSrc.replace('.'+ext,'.mp4');
                                newobj.find('video').html('<source src="'+ videoSrc+'"/>');
                          }
                        }
                        data = '<div class="video-box">'+newobj.html()+'</div>';
                    }
                    else if(obj.find('.audioContent').is('p')){
                            var newobj = angular.element('<video class="media_video" controls poster="../assets/img/audio-recording-thumb.jpg"><'+obj.find('.audioContent').html()+'></video>');
                            var whichBrowser = BrowserDetecter.whichBrowser();
                            var audioSrc = newobj.find('source').attr('src');
                            var ext = audioSrc.split('.').pop();
                            audioSrc = audioSrc.replace('.'+ext,'.mp3');
                            newobj.find('source').attr('src', audioSrc);
                            var ext = audioSrc.split('.').pop();
                            data = '<div class="audio-box">'+newobj.html()+'</div>';
                    }
                    else if (obj.find(".linkContent").attr('class')) {
                            data=obj.find('.linkContent').html();
                            $('#holder-discuss').html()
                            data= "<div id='iframeContainer' class='holder_bulb_iframe'>"+$('<div/>').html(data).text()+'</div>';
                    }
                    else if (typeof(obj.find('.media_img').attr('src'))=='string') {
                        /*-----remove medium from img url---15Jan15--*/
                        imgStr = obj.find('.media_img').attr('src'); //20022015
                        data = '<img src="'+imgStr+'">';
                        /*-----end------*/
                    }
                    return data;
                    
                }
            },
            set_prev__next: function(obj , pageId){
                if(pageId != null){
                    var discuss_list = $("#"+pageId+' .col-xs-4');
                    var index=parseInt($(obj).attr("name"),10);
                    if ($(obj).attr("name")>0 && (parseInt($(obj).attr("name"),10)+1)<discuss_list.find('a').length) {
                            //alert('case center');
                            $("#"+pageId+' #dM-next-m1').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $("#"+pageId+' #dM-next-m2').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $("#"+pageId+' #dM-prev-m1').attr("onClick","mediaSite.mediaMove("+(index-1)+")");
                            $("#"+pageId+' #dM-prev-m2').attr("onClick","mediaSite.mediaMove("+(index-1)+")");
                            if (discuss_list.find('a').eq(index+1).find('.media_img').is("img")) {
                                    var url_next=discuss_list.find('a').eq(index+1).find('.media_img').attr('src').replace('/'+discuss__thumbnail,'/'+small__thumbnail);
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("src",url_next);
                            }else if(discuss_list.find('a').eq(index+1).find('.linkElement').is("img")){
                                    var url_next=discuss_list.find('a').eq(index+1).find('.linkElement').attr('src');
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("src",url_next);
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("height","100px");
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("width","100px");
                            }else if (discuss_list.find('a').eq(index+1).find('span').attr("ng-if")=="media.MediaType=='Notes'") {
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("src","/assets/board/img/Sticky-Notes-Pro.png");
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("height","100px");
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("width","100px");
                            }
                            if (discuss_list.find('a').eq(index-1).find('.media_img').is("img")) {
                                    var url_prev=discuss_list.find('a').eq(index-1).find('.media_img').attr('src').replace('/'+discuss__thumbnail,'/'+small__thumbnail);
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("src",url_prev);
                            }else if(discuss_list.find('a').eq(index-1).find('.linkElement').is("img")){
                                    var url_prev=discuss_list.find('a').eq(index-1).find('.linkElement').attr('src');
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("src",url_prev);
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("height","100px");
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("width","100px");
                            }else if (discuss_list.find('a').eq(index-1).find('span').attr("ng-if")=="media.MediaType=='Notes'") {
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("src","/assets/board/img/Sticky-Notes-Pro.png");
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("height","100px");
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("width","100px");
                            }

                            $("#"+pageId+' #dM-next-m1').show();
                            $("#"+pageId+' #dM-next-m2').show();
                            $("#"+pageId+' #dM-prev-m1').show();
                            $("#"+pageId+' #dM-prev-m2').show();
                    }
                    else if (parseInt($(obj).attr("name"),10)==0 && (discuss_list.find('a').length==1)) {
                            //alert('case only one');
                            $("#"+pageId+' #dM-next-m1').hide();
                            $("#"+pageId+' #dM-next-m2').hide();
                            $("#"+pageId+' #dM-prev-m1').hide();
                            $("#"+pageId+' #dM-prev-m2').hide();
                    }
                    else if ((parseInt($(obj).attr("name"),10)+1)==discuss_list.find('a').length) {
                            //alert('case last');
                            $("#"+pageId+' #dM-next-m1').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $("#"+pageId+' #dM-next-m2').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $("#"+pageId+' #dM-prev-m1').attr("onClick","mediaSite.mediaMove("+(index-1)+")");
                            $("#"+pageId+' #dM-prev-m2').attr("onClick","mediaSite.mediaMove("+(index-1)+")");

                            if (discuss_list.find('a').eq(index-1).find('.media_img').is("img")) {
                                    var url_prev=discuss_list.find('a').eq(index-1).find('.media_img').attr('src').replace('/'+discuss__thumbnail,'/'+small__thumbnail);
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("src",url_prev);
                            }else if(discuss_list.find('a').eq(index-1).find('.linkElement').is("img")){
                                    var url_prev=discuss_list.find('a').eq(index-1).find('.linkElement').attr('src');
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("src",url_prev);
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("height","100px");
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("width","100px");
                            }else if (discuss_list.find('a').eq(index-1).find('span').attr("ng-if")=="media.MediaType=='Notes'") {
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("src","/assets/board/img/Sticky-Notes-Pro.png");
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("height","100px");
                                    $("#"+pageId+' #dM-prev-m2').find('img').attr("width","100px");
                            }

                            $("#"+pageId+' #dM-next-m1').hide();
                            $("#"+pageId+' #dM-next-m2').hide();
                            $("#"+pageId+' #dM-prev-m1').show();
                            $("#"+pageId+' #dM-prev-m2').show();
                    }
                    else if ((parseInt($(obj).attr("name"),10))==0) {
                            $("#"+pageId+' #dM-next-m1').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $("#"+pageId+' #dM-next-m2').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $("#"+pageId+' #dM-prev-m1').attr("onClick","mediaSite.mediaMove("+(index-1)+")");
                            $("#"+pageId+' #dM-prev-m2').attr("onClick","mediaSite.mediaMove("+(index-1)+")");

                            if (discuss_list.find('a').eq(index+1).find('.media_img').is("img")) {
                                    var url_next=discuss_list.find('a').eq(index+1).find('.media_img').attr('src').replace('/'+discuss__thumbnail,'/'+small__thumbnail);
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("src",url_next);
                            }else if(discuss_list.find('a').eq(index+1).find('.linkElement').is("img")){
                                    var url_next=discuss_list.find('a').eq(index+1).find('.linkElement').attr('src');
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("src",url_next);
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("height","100px");
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("width","100px");
                            }else if (discuss_list.find('a').eq(index+1).find('span').attr("ng-if")=="media.MediaType=='Notes'") {
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("src","/assets/board/img/Sticky-Notes-Pro.png");
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("height","100px");
                                    $("#"+pageId+' #dM-next-m2').find('img').attr("width","100px");
                            }
                            $("#"+pageId+' #dM-next-m1').show();
                            $("#"+pageId+' #dM-next-m2').show();
                            $("#"+pageId+' #dM-prev-m1').hide();
                            $("#"+pageId+' #dM-prev-m2').hide();
                    }
                    
                }
                else{
                    var discuss_list = $('.col-xs-4');
                    var index=parseInt($(obj).attr("name"),10);
                    if ($(obj).attr("name")>0 && (parseInt($(obj).attr("name"),10)+1)<discuss_list.find('a').length) {
                            //alert('case center');
                            $('#dM-next-m1').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $('#dM-next-m2').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $('#dM-prev-m1').attr("onClick","mediaSite.mediaMove("+(index-1)+")");
                            $('#dM-prev-m2').attr("onClick","mediaSite.mediaMove("+(index-1)+")");
                            if (discuss_list.find('a').eq(index+1).find('.media_img').is("img")) {
                                    var url_next=discuss_list.find('a').eq(index+1).find('.media_img').attr('src').replace('/'+discuss__thumbnail,'/'+small__thumbnail);
                                    $('#dM-next-m2').find('img').attr("src",url_next);
                            }else if(discuss_list.find('a').eq(index+1).find('.linkElement').is("img")){
                                    var url_next=discuss_list.find('a').eq(index+1).find('.linkElement').attr('src');
                                    $('#dM-next-m2').find('img').attr("src",url_next);
                                    $('#dM-next-m2').find('img').attr("height","100px");
                                    $('#dM-next-m2').find('img').attr("width","100px");
                            }else if (discuss_list.find('a').eq(index+1).find('span').attr("ng-if")=="media.MediaType=='Notes'") {
                                    $('#dM-next-m2').find('img').attr("src","/assets/board/img/Sticky-Notes-Pro.png");
                                    $('#dM-next-m2').find('img').attr("height","100px");
                                    $('#dM-next-m2').find('img').attr("width","100px");
                            }
                            if (discuss_list.find('a').eq(index-1).find('.media_img').is("img")) {
                                    var url_prev=discuss_list.find('a').eq(index-1).find('.media_img').attr('src').replace('/'+discuss__thumbnail,'/'+small__thumbnail);
                                    $('#dM-prev-m2').find('img').attr("src",url_prev);
                            }else if(discuss_list.find('a').eq(index-1).find('.linkElement').is("img")){
                                    var url_prev=discuss_list.find('a').eq(index-1).find('.linkElement').attr('src');
                                    $('#dM-prev-m2').find('img').attr("src",url_prev);
                                    $('#dM-prev-m2').find('img').attr("height","100px");
                                    $('#dM-prev-m2').find('img').attr("width","100px");
                            }else if (discuss_list.find('a').eq(index-1).find('span').attr("ng-if")=="media.MediaType=='Notes'") {
                                    $('#dM-prev-m2').find('img').attr("src","/assets/board/img/Sticky-Notes-Pro.png");
                                    $('#dM-prev-m2').find('img').attr("height","100px");
                                    $('#dM-prev-m2').find('img').attr("width","100px");
                            }

                            $('#dM-next-m1').show();
                            $('#dM-next-m2').show();
                            $('#dM-prev-m1').show();
                            $('#dM-prev-m2').show();
                    }
                    else if (parseInt($(obj).attr("name"),10)==0 && (discuss_list.find('a').length==1)) {
                            //alert('case only one');
                            $('#dM-next-m1').hide();
                            $('#dM-next-m2').hide();
                            $('#dM-prev-m1').hide();
                            $('#dM-prev-m2').hide();
                    }
                    else if ((parseInt($(obj).attr("name"),10)+1)==discuss_list.find('a').length) {
                            //alert('case last');
                            $('#dM-next-m1').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $('#dM-next-m2').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $('#dM-prev-m1').attr("onClick","mediaSite.mediaMove("+(index-1)+")");
                            $('#dM-prev-m2').attr("onClick","mediaSite.mediaMove("+(index-1)+")");

                            if (discuss_list.find('a').eq(index-1).find('.media_img').is("img")) {
                                    var url_prev=discuss_list.find('a').eq(index-1).find('.media_img').attr('src').replace('/'+discuss__thumbnail,'/'+small__thumbnail);
                                    $('#dM-prev-m2').find('img').attr("src",url_prev);
                            }else if(discuss_list.find('a').eq(index-1).find('.linkElement').is("img")){
                                    var url_prev=discuss_list.find('a').eq(index-1).find('.linkElement').attr('src');
                                    $('#dM-prev-m2').find('img').attr("src",url_prev);
                                    $('#dM-prev-m2').find('img').attr("height","100px");
                                    $('#dM-prev-m2').find('img').attr("width","100px");
                            }else if (discuss_list.find('a').eq(index-1).find('span').attr("ng-if")=="media.MediaType=='Notes'") {
                                    $('#dM-prev-m2').find('img').attr("src","/assets/board/img/Sticky-Notes-Pro.png");
                                    $('#dM-prev-m2').find('img').attr("height","100px");
                                    $('#dM-prev-m2').find('img').attr("width","100px");
                            }

                            $('#dM-next-m1').hide();
                            $('#dM-next-m2').hide();
                            $('#dM-prev-m1').show();
                            $('#dM-prev-m2').show();
                    }
                    else if ((parseInt($(obj).attr("name"),10))==0) {
                            $('#dM-next-m1').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $('#dM-next-m2').attr("onClick","mediaSite.mediaMove("+(index+1)+")");
                            $('#dM-prev-m1').attr("onClick","mediaSite.mediaMove("+(index-1)+")");
                            $('#dM-prev-m2').attr("onClick","mediaSite.mediaMove("+(index-1)+")");

                            if (discuss_list.find('a').eq(index+1).find('.media_img').is("img")) {
                                    var url_next=discuss_list.find('a').eq(index+1).find('.media_img').attr('src').replace('/'+discuss__thumbnail,'/'+small__thumbnail);
                                    $('#dM-next-m2').find('img').attr("src",url_next);
                            }else if(discuss_list.find('a').eq(index+1).find('.linkElement').is("img")){
                                    var url_next=discuss_list.find('a').eq(index+1).find('.linkElement').attr('src');
                                    $('#dM-next-m2').find('img').attr("src",url_next);
                                    $('#dM-next-m2').find('img').attr("height","100px");
                                    $('#dM-next-m2').find('img').attr("width","100px");
                            }else if (discuss_list.find('a').eq(index+1).find('span').attr("ng-if")=="media.MediaType=='Notes'") {
                                    $('#dM-next-m2').find('img').attr("src","/assets/board/img/Sticky-Notes-Pro.png");
                                    $('#dM-next-m2').find('img').attr("height","100px");
                                    $('#dM-next-m2').find('img').attr("width","100px");
                            }
                            $('#dM-next-m1').show();
                            $('#dM-next-m2').show();
                            $('#dM-prev-m1').hide();
                            $('#dM-prev-m2').hide();
                    }
                    
                }
            },
            mediaMove: function(index , pageId){
                if(pageId != null){
                    var discuss_list = $("#"+pageId+' .col-xs-4');
                    $("#"+pageId+' #dM-prev-m2').find('img').attr("src","");
                    $("#"+pageId+' #dM-next-m2').find('img').attr("src","");
                    var obj=discuss_list.find('a').eq(index);
                    var scope = angular.element($("#"+pageId+" #search_gallery_elements")).scope();
                    var id = obj.attr('data-id');
                    console.log(id)
                    scope.$apply(function () {
                        scope.setMediaId__mannualy(id , pageId);
                    });
                    scope = null;
                    app.set_prev__next(obj , pageId);
                    var newobj=app.get_discussHTML(obj , pageId);
                    console.log(newobj);
                    $("#"+pageId+' #holder-discuss').html(newobj);
                    $("#"+pageId+' #holder-discuss').find('li').attr("onClick","montage_ele.gsView($(this))");
                    return false;
                    
                }
                else{
                    var discuss_list = $('.col-xs-4');
                    $('#dM-prev-m2').find('img').attr("src","");
                    $('#dM-next-m2').find('img').attr("src","");
                    var obj=discuss_list.find('a').eq(index);
                    var scope = angular.element($("#search_gallery_elements")).scope();
                    var id = obj.attr('data-id');
                    console.log(id)
                    scope.$apply(function () {
                            scope.setMediaId__mannualy(id);
                    });
                    scope = null;
                    app.set_prev__next(obj);
                    var newobj=app.get_discussHTML(obj);
                    console.log(newobj);
                    $('#holder-discuss').html(newobj);
                    $('#holder-discuss').find('li').attr("onClick","montage_ele.gsView($(this))");
                    return false;
                    
                }
            },
		/********  "init_jpushMEnu_left" function initialize jPushMenu on toggle-menu*/
            init_jpushMEnu_left: function(pageId){
                 if(pageId != null){
                     $('.toggle-menu').jPushMenu();
                     
                 }
                 else{
                     $('.toggle-menu').jPushMenu();
                     
                 }
            },	
            /*    */
		
		
		/********  "init_jpushMEnu_left" function initialize jPushMenu on toggle-menu*/
			init_fraola : function(pageId){
			    if(pageId != null){
                                /*----Froala - 1 ----*/
				/***-Search view media statement case-***/
				$("#"+pageId+' .edit_froala1').editable({
                                    placeholder: "",
                                    buttons: ['blockStyle','fontSize','fontFamily','color','align','fullscreen','html']
				}).on('editable.focus', function (e, editor) {
                                    var text = $("#"+pageId+' .edit_froala1').editable('getText');
                                    //console.log(text);
                                    if(text == 'Start writing...'){
                                        $("#"+pageId+' .edit_froala1').editable('setHTML','')
                                    }
				}).on('editable.blur', function (e, editor) {
					var text = $("#"+pageId+' .edit_froala1').editable('getText');
					//console.log(text);
					if(text == ''){
                                            $("#"+pageId+' .edit_froala1').editable('setHTML','Start writing...')
					}
				});
				
				/*----Froala - 2 ----*/
				/***- add note to montage case -***/
				$("#"+pageId+' .edit_froala2').editable({
					// Set the file upload URL.
					placeholder: "",
					imageUploadURL: "/media/froala_file",
					buttons: ['blockStyle','fontSize','fontFamily','color','align','sep','insertImage','insertVideo','table','createLink','fullscreen','html']
				
				}).on('editable.imageError', function (e, editor, error) {
                                    // Custom error message returned from the server.
                                    if (error.code == 0) {  }
                                    // Bad link.
                                    else if (error.code == 1) { }
                                    // No link in upload response.
                                    else if (error.code == 2) { }
                                    // Error during image upload.
                                    else if (error.code == 3) { }
                                    // Parsing response failed.
                                    else if (error.code == 4) {  }
                                    // Image too large.
                                    else if (error.code == 5) {  }
                                    // Invalid image type.
                                    else if (error.code == 6) {  }
                                    // Image can be uploaded only to same domain in IE 8 and IE 9.
                                    else if (error.code == 7) {  }
				}).on('editable.focus', function (e, editor) {
                                    var text = $("#"+pageId+' .edit_froala2').editable('getText');
                                    //console.log(text);
                                    if(text == 'Start writing...'){
                                        $("#"+pageId+' .edit_froala2').editable('setHTML','')
                                    }
				}).on('editable.blur', function (e, editor) {
                                    var text = $("#"+pageId+' .edit_froala2').editable('getText');
                                    //console.log(text);
                                    if(text == ''){
                                        $("#"+pageId+' .edit_froala2').editable('setHTML','Start writing...')
                                    }
				});
				
				/*----Froala - 3 ----*/
				/***- add note to BOARD case -***/
				$("#"+pageId+' .edit_froala3').editable({
                                    // Set the file upload URL.
                                    placeholder: "",
                                    imageUploadURL: "/media/froala_file",
                                    buttons: ['blockStyle','fontSize','fontFamily','color','align','sep','insertImage','insertVideo','table','createLink','fullscreen','html']
				
				}) .on('editable.imageError', function (e, editor, error) {
                                    // Custom error message returned from the server.
                                    if (error.code == 0) {  }

                                    // Bad link.
                                    else if (error.code == 1) { }

                                    // No link in upload response.
                                    else if (error.code == 2) { }

                                    // Error during image upload.
                                    else if (error.code == 3) { }

                                    // Parsing response failed.
                                    else if (error.code == 4) {  }

                                    // Image too large.
                                    else if (error.code == 5) {  }

                                    // Invalid image type.
                                    else if (error.code == 6) {  }

                                    // Image can be uploaded only to same domain in IE 8 and IE 9.
                                    else if (error.code == 7) {  }
				  }).on('editable.focus', function (e, editor) {
                                    // editor focused
                                    // $('.edit_froala1')
                                    var text = $("#"+pageId+' .edit_froala3').editable('getText');
                                    console.log(text);
                                    if(text == 'Start writing...'){
                                        $("#"+pageId+' .edit_froala3').editable('setHTML','')
                                    }
				}).on('editable.blur', function (e, editor) {
                                    // editor focused
                                    // $('.edit_froala1')
                                    var text = $("#"+pageId+' .edit_froala3').editable('getText');
                                    console.log(text);
                                    if(text == ''){
                                        $("#"+pageId+' .edit_froala3').editable('setHTML','Start writing...')
                                    }
				});
                                
                            }
                            else{
                                /*----Froala - 1 ----*/
				/***-Search view media statement case-***/
				$('.edit_froala1').editable({
				placeholder: "",
				buttons: ['blockStyle','fontSize','fontFamily','color','align','fullscreen','html']
				}).on('editable.focus', function (e, editor) {
					var text = $('.edit_froala1').editable('getText');
					//console.log(text);
					if(text == 'Start writing...'){
						$('.edit_froala1').editable('setHTML','')
					}
				}).on('editable.blur', function (e, editor) {
					var text = $('.edit_froala1').editable('getText');
					//console.log(text);
					if(text == ''){
						$('.edit_froala1').editable('setHTML','Start writing...')
					}
				});
				
				/*----Froala - 2 ----*/
				/***- add note to montage case -***/
				$('.edit_froala2').editable({
					// Set the file upload URL.
					placeholder: "",
					imageUploadURL: "/media/froala_file",
					buttons: ['blockStyle','fontSize','fontFamily','color','align','sep','insertImage','insertVideo','table','createLink','fullscreen','html']
				
				}).on('editable.imageError', function (e, editor, error) {
					// Custom error message returned from the server.
					if (error.code == 0) {  }
					// Bad link.
					else if (error.code == 1) { }
					// No link in upload response.
					else if (error.code == 2) { }
					// Error during image upload.
					else if (error.code == 3) { }
					// Parsing response failed.
					else if (error.code == 4) {  }
					// Image too large.
					else if (error.code == 5) {  }
					// Invalid image type.
					else if (error.code == 6) {  }
					// Image can be uploaded only to same domain in IE 8 and IE 9.
					else if (error.code == 7) {  }
				}).on('editable.focus', function (e, editor) {
					var text = $('.edit_froala2').editable('getText');
					//console.log(text);
					if(text == 'Start writing...'){
						$('.edit_froala2').editable('setHTML','')
					}
				}).on('editable.blur', function (e, editor) {
					var text = $('.edit_froala2').editable('getText');
					//console.log(text);
					if(text == ''){
						$('.edit_froala2').editable('setHTML','Start writing...')
					}
				});
				
				/*----Froala - 3 ----*/
				/***- add note to BOARD case -***/
				$('.edit_froala3').editable({
					// Set the file upload URL.
					placeholder: "",
					imageUploadURL: "/media/froala_file",
					buttons: ['blockStyle','fontSize','fontFamily','color','align','sep','insertImage','insertVideo','table','createLink','fullscreen','html']
				
				}) .on('editable.imageError', function (e, editor, error) {
					// Custom error message returned from the server.
					if (error.code == 0) {  }
			
					// Bad link.
					else if (error.code == 1) { }
			
					// No link in upload response.
					else if (error.code == 2) { }
			
					// Error during image upload.
					else if (error.code == 3) { }
			
					// Parsing response failed.
					else if (error.code == 4) {  }
			
					// Image too large.
					else if (error.code == 5) {  }
			
					// Invalid image type.
					else if (error.code == 6) {  }
			
					// Image can be uploaded only to same domain in IE 8 and IE 9.
					else if (error.code == 7) {  }
				  }).on('editable.focus', function (e, editor) {
					// editor focused
					// $('.edit_froala1')
					var text = $('.edit_froala3').editable('getText');
					console.log(text);
					if(text == 'Start writing...'){
						$('.edit_froala3').editable('setHTML','')
					}
				}).on('editable.blur', function (e, editor) {
					// editor focused
					// $('.edit_froala1')
					var text = $('.edit_froala3').editable('getText');
					console.log(text);
					if(text == ''){
						$('.edit_froala3').editable('setHTML','Start writing...')
					}
				});
                                
                            }
				
			},
			initModalPopup: function(pageId){
			    if(pageId != null){
                                $("#"+pageId+' .ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-resizable.ui-draggable.ui-draggable-handle').remove();
				var viewportWidth = window.innerWidth-30;
				//var viewportHeight = window.innerHeight-30;
				if (viewportWidth > 600) viewportWidth = 600;
				//if (viewportHeight > 600) viewportHeight = 600;
				console.log('viewportWidth',viewportWidth);
				
				$("#"+pageId+' a[rel="dialog"]').on('click',function(){
					$('body').addClass('popup-append');
					//console.log('binding dialog box calls');
					var dataDialogId = $(this).data('dialog-id');
					//console.log($('.dialog[data-dialog-id="'+dataDialogId+'"]').dialog( "instance" ));
					var overlay = $('<div/>',{class:'modal-overlay'});
					var dialogClass = $(this).data('dialog-class');
					//console.log(dialogClass);
					$("#"+pageId+' .dialog[data-dialog-id="'+dataDialogId+'"]').dialog({
						dialogClass: dialogClass,
						draggable: false,
						fluid: true,
						minWidth: 600,
						//width: 'auto',
						maxWidth: 800,
						minHeight: 0,
						modal: true,
						position:{ my: "center", at: "center", of: window },
						show: { 
							effect: "fade",
							duration: 400
						},
						hide: {
							effect: "fade",
							duration: 400
						},
						open: function( event, ui ) {
						},
						// added by parul 11-sep-2015
						close: function( event, ui ){
							console.log($(this));
							//$(this).empty();
						}
					});
					$("#"+pageId+' .ui-dialog-titlebar-close').on('click',function(){
                                            $('body').removeClass('popup-append');
					})
					$("#"+pageId+' .ui-dialog').draggable({axis: "y" });
					
					return false;
				});
				// on window resize run function
				$(window).resize(function () {
                                    fluidDialog();
				});
				
				// catch dialog if opened within a viewport smaller than the dialog width
				$(document).on("dialogopen", "#"+pageId+" .ui-dialog", function (event, ui) {
                                    fluidDialog();
				});
				
				function fluidDialog() {
                                    var $visible = $("#"+pageId+" .ui-dialog:visible");
                                    // each open dialog
                                    $visible.each(function () {
                                        var $this = $(this);
                                        var dialog = $this.find(".ui-dialog-content").data("ui-dialog");
                                        // if fluid option == true
                                        if (dialog.options.fluid) {
                                            var wWidth = $(window).width();
                                            // check window width against dialog width
                                            if (wWidth < (parseInt(dialog.options.maxWidth) + 50))  {
                                                    // keep dialog from filling entire screen
                                                    $this.css("max-width", "90%");
                                                    $this.css("left", "5%");
                                            } else {
                                                    // fix maxWidth bug
                                                    $this.css("max-width", dialog.options.maxWidth + "px");
                                            }
                                            //reposition dialog
                                            dialog.option("position", dialog.options.position);
                                        }
                                    });
				}
                            }
                            else{
                                $('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-resizable.ui-draggable.ui-draggable-handle').remove();
				var viewportWidth = window.innerWidth-30;
				//var viewportHeight = window.innerHeight-30;
				if (viewportWidth > 600) viewportWidth = 600;
				//if (viewportHeight > 600) viewportHeight = 600;
				console.log('viewportWidth',viewportWidth);
				
				$('a[rel="dialog"]').on('click',function(){
					$('body').addClass('popup-append');
					//console.log('binding dialog box calls');
					var dataDialogId = $(this).data('dialog-id');
					//console.log($('.dialog[data-dialog-id="'+dataDialogId+'"]').dialog( "instance" ));
					var overlay = $('<div/>',{class:'modal-overlay'});
					var dialogClass = $(this).data('dialog-class');
					//console.log(dialogClass);
					$('.dialog[data-dialog-id="'+dataDialogId+'"]').dialog({
						dialogClass: dialogClass,
						draggable: false,
						fluid: true,
						minWidth: 600,
						//width: 'auto',
						maxWidth: 800,
						minHeight: 0,
						modal: true,
						position:{ my: "center", at: "center", of: window },
						show: { 
							effect: "fade",
							duration: 400
						},
						hide: {
							effect: "fade",
							duration: 400
						},
						open: function( event, ui ) {
						},
						// added by parul 11-sep-2015
						close: function( event, ui ){
							console.log($(this));
							//$(this).empty();
						}
					});
					$('.ui-dialog-titlebar-close').on('click',function(){
						$('body').removeClass('popup-append');
					})
					$('.ui-dialog').draggable({axis: "y" });
					
					return false;
				});
				// on window resize run function
				$(window).resize(function () {
					fluidDialog();
				});
				
				// catch dialog if opened within a viewport smaller than the dialog width
				$(document).on("dialogopen", ".ui-dialog", function (event, ui) {
					fluidDialog();
				});
				
				function fluidDialog() {
					var $visible = $(".ui-dialog:visible");
					// each open dialog
					$visible.each(function () {
						var $this = $(this);
						var dialog = $this.find(".ui-dialog-content").data("ui-dialog");
						// if fluid option == true
						if (dialog.options.fluid) {
							var wWidth = $(window).width();
							// check window width against dialog width
							if (wWidth < (parseInt(dialog.options.maxWidth) + 50))  {
								// keep dialog from filling entire screen
								$this.css("max-width", "90%");
								$this.css("left", "5%");
							} else {
								// fix maxWidth bug
								$this.css("max-width", dialog.options.maxWidth + "px");
							}
							//reposition dialog
							dialog.option("position", dialog.options.position);
						}
					});
				
				}
                                
                            }
				
			},
		/*****/
            initMasonry: function(pageId){
                if(pageId != null){
                    $(window).load(function(){
                        // initialize
                        var $container = $("#"+pageId+' .inner-container');
                        $container.masonry({
                          itemSelector: 'li',
                          columnWidth: 'li#columnWidth',
                          gutter: 0
                        });
                        $("#"+pageId+' #orderItems').on('click',function(){
                            var el = $(this).parent();
                            var elements = $container.masonry('getItemElements');
                            if(el.hasClass('active')){
                                el.removeClass('active');
                                var newElements = $(elements).tsort('h3',{order:'asc'});
                            }else{
                                el.addClass('active');
                                var newElements = $(elements).tsort('h3',{order:'desc'});
                            }
                            $container.html( $(newElements) );
                            // Strange masonry need to update twice for reload elements
                            $container.masonry().masonry('reloadItems');
                            $container.masonry().masonry('reloadItems');
                            return false;
                        });
                    });
                    
                }
                else{
                    $(window).load(function(){
                        // initialize
                        var $container = $('.inner-container');
                        $container.masonry({
                          itemSelector: 'li',
                          columnWidth: 'li#columnWidth',
                          gutter: 0
                        });
                        $('#orderItems').on('click',function(){
                            var el = $(this).parent();
                            var elements = $container.masonry('getItemElements');
                            if(el.hasClass('active')){
                                el.removeClass('active');
                                var newElements = $(elements).tsort('h3',{order:'asc'});
                            }else{
                                el.addClass('active');
                                var newElements = $(elements).tsort('h3',{order:'desc'});
                            }
                            $container.html( $(newElements) );
                            // Strange masonry need to update twice for reload elements
                            $container.masonry().masonry('reloadItems');
                            $container.masonry().masonry('reloadItems');
                            return false;
                        });
                    });
                    
                }
            },
		/*********   "init_button_effect"  initializes animation an all square and round buttons  */
			init_button_effect : function(pageId){
			    if(pageId != null){
                                $("#"+pageId+' #a-tooltip1').hover(function() {
                                    $(this).addClass('show'); 
                                    $("#"+pageId+' .fa-pencil-square-o').fadeIn(200);
				}, 
				function() { 
                                    $(this).removeClass('show');  
                                    $("#"+pageId+' .fa-pencil-square-o').fadeOut(200);
				});
				
				$("#"+pageId+' #a-tooltip5').hover(function() {
                                    $(this).addClass('show'); 
                                    $("#"+pageId+' .fa-pencil-square-o').fadeIn(200);
				}, 
				function() { 
                                    $(this).removeClass('show');  
                                    $("#"+pageId+' .fa-pencil-square-o').fadeOut(200);
				});
				
				$("#"+pageId+' #a-tooltip6').hover(function() {
                                    $(this).addClass('show'); 
                                    $("#"+pageId+' .fa-pencil-square-o').fadeIn(200);
				}, 
				function() { 
                                    $(this).removeClass('show');  
                                    $("#"+pageId+' .fa-pencil-square-o').fadeOut(200);
				});
				
				$("#"+pageId+' #a-tooltip7').hover(function() {
                                    $(this).addClass('show'); 
                                    $("#"+pageId+' .fa-pencil-square-o').fadeIn(200);
				}, 
				function() { 
					$(this).removeClass('show');  
					$("#"+pageId+' .fa-pencil-square-o').fadeOut(200);
				});
				
				// Tooltip Square
				$("#"+pageId+' #a-tooltip2').hover(function() { 
					$(this).addClass('show'); 
					$("#"+pageId+' .fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$("#"+pageId+' .fa-remove').fadeOut(200); 
				});
				
				$("#"+pageId+' #a-tooltip3').hover(function() { 
					$(this).addClass('show'); 
					$("#"+pageId+' .fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$("#"+pageId+' .fa-remove').fadeOut(200); 
				});
				
				$("#"+pageId+' #a-tooltip4').hover(function() { 
					$(this).addClass('show'); 
					$("#"+pageId+' .fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$("#"+pageId+' .fa-remove').fadeOut(200); 
				});
				
				$("#"+pageId+' #a-tooltip8').hover(function() { 
					$(this).addClass('show'); 
					$("#"+pageId+' .fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$("#"+pageId+' .fa-remove').fadeOut(200); 
				});
				
				$("#"+pageId+' #a-tooltip11').hover(function() { 
					$(this).addClass('show'); 
					$("#"+pageId+' .fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$("#"+pageId+' .fa-remove').fadeOut(200); 
				});
                                
                            }
                            else{
                                $('#a-tooltip1').hover(function() {
					$(this).addClass('show'); 
					$('.fa-pencil-square-o').fadeIn(200);
				}, 
				function() { 
					$(this).removeClass('show');  
					$('.fa-pencil-square-o').fadeOut(200);
				});
				
				$('#a-tooltip5').hover(function() {
					$(this).addClass('show'); 
					$('.fa-pencil-square-o').fadeIn(200);
				}, 
				function() { 
					$(this).removeClass('show');  
					$('.fa-pencil-square-o').fadeOut(200);
				});
				
				$('#a-tooltip6').hover(function() {
					$(this).addClass('show'); 
					$('.fa-pencil-square-o').fadeIn(200);
				}, 
				function() { 
					$(this).removeClass('show');  
					$('.fa-pencil-square-o').fadeOut(200);
				});
				
				$('#a-tooltip7').hover(function() {
					$(this).addClass('show'); 
					$('.fa-pencil-square-o').fadeIn(200);
				}, 
				function() { 
					$(this).removeClass('show');  
					$('.fa-pencil-square-o').fadeOut(200);
				});
				
				// Tooltip Square
				$('#a-tooltip2').hover(function() { 
					$(this).addClass('show'); 
					$('.fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$('.fa-remove').fadeOut(200); 
				});
				
				$('#a-tooltip3').hover(function() { 
					$(this).addClass('show'); 
					$('.fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$('.fa-remove').fadeOut(200); 
				});
				
				$('#a-tooltip4').hover(function() { 
					$(this).addClass('show'); 
					$('.fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$('.fa-remove').fadeOut(200); 
				});
				
				$('#a-tooltip8').hover(function() { 
					$(this).addClass('show'); 
					$('.fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$('.fa-remove').fadeOut(200); 
				});
				
				$('#a-tooltip11').hover(function() { 
					$(this).addClass('show'); 
					$('.fa-remove').fadeIn(200); 
				}, 
				function() { 
					$(this).removeClass('show'); 
					$('.fa-remove').fadeOut(200); 
				});
                                
                            }
			},
            fixDiscussPage:function(pageId){
                if(pageId != null){
                    var list = $("#"+pageId+' .discuss_list li');
                    list.each(function(){
                        var width = $(this).find('.text_holder').width();
                        $(this).find('p').css('columnWidth', width);
                    });
                }
                else{
                    var list = $('.discuss_list li');
                    list.each(function(){
                        var width = $(this).find('.text_holder').width();
                        $(this).find('p').css('columnWidth', width);
                    });
                    
                }
            },
            test:function(pageId){
                $('[data-toggle="tooltip"]').tooltip();
            },
            //browse:
            jscriptNgcommon:{
                init__urlLocations:function(pageId){
                     small__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().small__thumbnail;
                     medium__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().medium__thumbnail;
                     discuss__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().discuss__thumbnail;
                     large__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().large__thumbnail;
                },
                
            },
            resetSearchHeader:function(pageId){
                if(pageId != null){
                    var switchBtn=$("#"+pageId+' .reset_header');
                    switchBtn.on('click',function(){
                        $("#"+pageId+" .quest-block").show();
                        $("#"+pageId+' .tag-block').removeClass('tag-block-scroll');
                        $("#"+pageId+' .tag-block').removeClass('shadow-no');
                        $("#"+pageId+' .tag-block').removeClass('grey-bg');		
                        $("#"+pageId+' .sidebar-panel').css('top', $('.header').outerHeight());
                        $("#"+pageId+' .inner-container').css('top',$('.header').outerHeight());
                        $('body').removeClass('sidebar-toggle');
                    });
                    
                }
                else{
                    var switchBtn=$('.reset_header');
                    switchBtn.on('click',function(){
                            $(".quest-block").show();
                            $('.tag-block').removeClass('tag-block-scroll');
                            $('.tag-block').removeClass('shadow-no');
                            $('.tag-block').removeClass('grey-bg');		
                            $('.sidebar-panel').css('top', $('.header').outerHeight());
                            $('.inner-container').css('top',$('.header').outerHeight());
                            $('body').removeClass('sidebar-toggle');
                    });
                    
                }
            },
			del_keyword : function(event,obj,id,pageId){
			    if(pageId != null){
                                console.log(obj.attr('data-id'));
				event.stopPropagation();
				//console.log('del_keyword') 	
				obj.closest('li').remove();
				$("#"+pageId+' #lmn_slider').lemmonSlider('destroy');
				var scope = angular.element($("#"+pageId+" #search_gallery_elements")).scope();
				console.log(scope.gt_fromDwn);
				var item = obj.closest('li').text().trim();
				var flag=false;
				var indx = [];
				var flag_key=false;
				var indx_key = [];
				console.log(item);
				for(i=0;i <  scope.gt_fromDwn.length; i++){
                                    if ( scope.gt_fromDwn[i].title == item) {
                                            flag = true;
                                            indx.push(i);
                                    }
				}
				for(i=0;i <  scope.keywordsArr.length; i++){
                                    if ( scope.keywordsArr[i].title == item) {
                                            flag_key = true;
                                            indx_key.push(i);
                                    }
				}
				setTimeout(function(){
                                    if(flag){
                                        console.log('-in if -');
                                        for(j = (indx.length-1);j >= 0 ;j--){
                                                scope.$apply(function () {
                                                        scope.gt_fromDwn.splice(indx[j],1);
                                                })
                                        }
                                    }
                                    if(flag_key){
                                        console.log('-in if -');
                                        for(j = (indx_key.length-1);j >= 0 ;j--){
                                                scope.$apply(function () {
                                                        scope.keywordsArr.splice(indx_key[j],1);
                                                })
                                        }
                                    }
                                    if (scope.selectedgt == obj.attr('data-id')) {
                                        if (scope.keywordsArr[scope.keywordsArr.length-1].id) {
                                                scope.selectedgt = scope.keywordsArr[scope.keywordsArr.length-1].id;
                                                scope.filterSub();
                                                app.initSlider();
                                                $("#"+pageId+' .keys').removeClass('activeKey');
                                                $("#"+pageId+' .keys').last().addClass('activeKey');
                                                $("#"+pageId+' #lmn_slider').scrollLeft($('#lmn_slider ul').width());
                                        }else{
                                                scope.selectedgt = '';
                                                scope.filterSub();
                                                app.initSlider();
                                                $("#"+pageId+' .keys').removeClass('activeKey');
                                        }
                                        scope = null;
                                    }
				},1000)
                                
                            }
                            else{
                                console.log(obj.attr('data-id'));
				event.stopPropagation();
				//console.log('del_keyword') 	
				obj.closest('li').remove();
				$('#lmn_slider').lemmonSlider('destroy');
				var scope = angular.element($("#search_gallery_elements")).scope();
				console.log(scope.gt_fromDwn);
				var item = obj.closest('li').text().trim();
				var flag=false;
				var indx = [];
				var flag_key=false;
				var indx_key = [];
				console.log(item);
				for(i=0;i <  scope.gt_fromDwn.length; i++){
					if ( scope.gt_fromDwn[i].title == item) {
						flag = true;
						indx.push(i);
					}
				}
				for(i=0;i <  scope.keywordsArr.length; i++){
					if ( scope.keywordsArr[i].title == item) {
						flag_key = true;
						indx_key.push(i);
					}
				}
				setTimeout(function(){
					if(flag){
						console.log('-in if -');
						for(j = (indx.length-1);j >= 0 ;j--){
							scope.$apply(function () {
								scope.gt_fromDwn.splice(indx[j],1);
							})
						}
					}
					if(flag_key){
						console.log('-in if -');
						for(j = (indx_key.length-1);j >= 0 ;j--){
							scope.$apply(function () {
								scope.keywordsArr.splice(indx_key[j],1);
							})
						}
					}
					if (scope.selectedgt == obj.attr('data-id')) {
						if (scope.keywordsArr[scope.keywordsArr.length-1].id) {
							scope.selectedgt = scope.keywordsArr[scope.keywordsArr.length-1].id;
							scope.filterSub();
							app.initSlider();
							$('.keys').removeClass('activeKey');
							$('.keys').last().addClass('activeKey');
							$('#lmn_slider').scrollLeft($('#lmn_slider ul').width());
						}else{
							scope.selectedgt = '';
							scope.filterSub();
							app.initSlider();
							$('.keys').removeClass('activeKey');
						}
						scope = null;
					}
				},1000)
                                
                            }
			},
			del_keyword_page : function(event,obj,id,pageId){
			    if(pageId != null){
                                console.log(obj.attr('data-id'));
				event.stopPropagation();
				//console.log('del_keyword') 	
				obj.closest('li').remove();
				$("#"+pageId+' #lmn_slider').lemmonSlider('destroy');
				var scope = angular.element($("#"+pageId+" #search_gallery_elements")).scope();
				console.log(scope.gt_fromDwn);
				var item = obj.closest('li').text().trim();
				var flag=false;
				var indx = [];
				var flag_key=false;
				var indx_key = [];
				console.log(item);
				for(i=0;i <  scope.gt_fromDwn.length; i++){
					if ( scope.gt_fromDwn[i].title == item) {
						flag = true;
						indx.push(i);
					}
				}
				for(i=0;i <  scope.previewIndex.keywordsSelcted.length; i++){
					if ( scope.previewIndex.keywordsSelcted[i].title == item) {
						flag_key = true;
						indx_key.push(i);
					}
				}
				setTimeout(function(){
					if(flag){
						console.log('-in if -');
						for(j = (indx.length-1);j >= 0 ;j--){
							scope.$apply(function () {
								scope.gt_fromDwn.splice(indx[j],1);
							})
						}
					}
					if(flag_key){
						console.log('-in if -');
						for(j = (indx_key.length-1);j >= 0 ;j--){
							scope.$apply(function () {
								scope.previewIndex.keywordsSelcted.splice(indx_key[j],1);
							})
						}
					}
					if (scope.selectedgt == obj.attr('data-id')) {
						if (scope.previewIndex.keywordsSelcted[scope.previewIndex.keywordsSelcted.length-1].id) {
							scope.selectedgt = scope.previewIndex.keywordsSelcted[scope.previewIndex.keywordsSelcted.length-1].id;
							scope.previewIndex.filterSub();
							app.initSlider();
							$("#"+pageId+' .keys').removeClass('activeKey');
							$("#"+pageId+' .keys').last().addClass('activeKey');
							$("#"+pageId+' #lmn_slider').scrollLeft($('#lmn_slider ul').width());
						}else{
							scope.selectedgt = '';
							scope.previewIndex.filterSub();
							app.previewIndex.initSlider();
							$("#"+pageId+' .keys').removeClass('activeKey');
						}
						scope = null;
					}
				},1000)
                                
                            }
                            else{
                                console.log(obj.attr('data-id'));
				event.stopPropagation();
				//console.log('del_keyword') 	
				obj.closest('li').remove();
				$('#lmn_slider').lemmonSlider('destroy');
				var scope = angular.element($("#search_gallery_elements")).scope();
				console.log(scope.gt_fromDwn);
				var item = obj.closest('li').text().trim();
				var flag=false;
				var indx = [];
				var flag_key=false;
				var indx_key = [];
				console.log(item);
				for(i=0;i <  scope.gt_fromDwn.length; i++){
					if ( scope.gt_fromDwn[i].title == item) {
						flag = true;
						indx.push(i);
					}
				}
				for(i=0;i <  scope.previewIndex.keywordsSelcted.length; i++){
					if ( scope.previewIndex.keywordsSelcted[i].title == item) {
						flag_key = true;
						indx_key.push(i);
					}
				}
				setTimeout(function(){
					if(flag){
						console.log('-in if -');
						for(j = (indx.length-1);j >= 0 ;j--){
							scope.$apply(function () {
								scope.gt_fromDwn.splice(indx[j],1);
							})
						}
					}
					if(flag_key){
						console.log('-in if -');
						for(j = (indx_key.length-1);j >= 0 ;j--){
							scope.$apply(function () {
								scope.previewIndex.keywordsSelcted.splice(indx_key[j],1);
							})
						}
					}
					if (scope.selectedgt == obj.attr('data-id')) {
						if (scope.previewIndex.keywordsSelcted[scope.previewIndex.keywordsSelcted.length-1].id) {
							scope.selectedgt = scope.previewIndex.keywordsSelcted[scope.previewIndex.keywordsSelcted.length-1].id;
							scope.previewIndex.filterSub();
							app.initSlider();
							$('.keys').removeClass('activeKey');
							$('.keys').last().addClass('activeKey');
							$('#lmn_slider').scrollLeft($('#lmn_slider ul').width());
						}else{
							scope.selectedgt = '';
							scope.previewIndex.filterSub();
							app.previewIndex.initSlider();
							$('.keys').removeClass('activeKey');
						}
						scope = null;
					}
				},1000)
                                
                            }
			}
        }
        return app;
    })(jQuery);
}
startupall();