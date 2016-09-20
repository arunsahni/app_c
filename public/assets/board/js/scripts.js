var small__thumbnail = '';
var medium__thumbnail = '';
var large__thumbnail = '';
function startupall(){
	mediaSite = (function($){
	var app = {
		init: function(){
			app.jscriptNgcommon.init__urlLocations();
			app.tooltip();
			app.initMasonry();
			app.filterbarFunc.init();
			app.slideTitleHeader();
			app.initModalPopup();
			app.mediaDropDownMenu();
			app.actionBarDropDown();
			app.recordButton();
			app.uploadButton();
			app.tagButton();
			app.initSmallHeader();
			app.headerTitleDropDown();
			app.headerQuestionDropDown();
			app.fixDiscussPage();
			app.showMediaContent();
			app.note();
			app.filterMenuSidebar.fixHeight();
			app.openFullHeader();
			app.headerThemeDropdown();
			app.closeAllDropdowns.init();
			app.accountFunctions.init();
			app.filterMenuSidebar.init();
		},
		tooltip: function(){
			$( document ).tooltip({
				position: {
        			my: "center top+30",
            		at: "center center"
				}
			});
		},
		initAccordion: function(){
			/*$(".accordion").accordion({
			    collapsible: true,
			    active: false,
			    heightStyle: "content"
			});*/
		},
		initMasonry: function(){
			$(window).load(function(){
				// initialize
				var $container = $('#thumbs');
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
				$(".customScrollbar").mCustomScrollbar();
				app.customScrollbar.initScroll();
				app.initAccordion();
			});
		},
		customScrollbar:{
			initScroll:function(){
				var scope = app.customScrollbar;
				setTimeout(function(){scrollToFunc1()},10);
			},
			updateScroll:function(el){
				$(el).mCustomScrollbar("update");
			},
			scrollToFunc:function(){				
				var obj = $('body').find('.customScrollbar');
				obj.each(function(){
					var thisObj = $(this);
					var array = $(this).find('li');
					
					var btnTop = $('<span/>',{class:'btnTop'}).appendTo($(this));
					var btnBottom = $('<span/>',{class:'btnBottom'}).appendTo($(this));
					btnTop.on('click',function(){
						var idx = thisObj.find('li.active').index();
						if(idx > 0){
							$(array[idx]).removeClass('active');
							$(array[idx-1]).addClass('active');
							thisObj.mCustomScrollbar("scrollTo",'.active');
						}
					});
					btnBottom.on('click',function(){
						var idx = thisObj.find('li.active').index();
						if(idx == -1){
							var themeArray = array.filter(function(){return !this.className});
							themeArray.first().addClass('active');
							thisObj.mCustomScrollbar("scrollTo",'.active');
						}
						else {
							if(idx+1 < array.length){
								$(array[idx]).removeClass('active');
								$(array[idx+1]).addClass('active');
								thisObj.mCustomScrollbar("scrollTo",'.active');
							}
						}
					});
					array.on('click',function(){
						array.filter('.active').removeClass('active');
						$(this).addClass('active');
					});
				});
			}
		},
		/*
		showMediaContent:function(){
			var mediaElements = $('#thumbs, #search_elements');
			var holderAct = $('.holder-act');
			var body = $("html, body");
			var bodyClass = $('body');
			var currentPageClass = bodyClass.data('page-class');
                        
			mediaElements.on('click', '>li a, a.btn',function(){
                           
                            $('.ticked').show()
				
				if ($(this).find('.text_wrap').attr('class')) {
                                    $('.holder_bulb').html($(this).find('.text_wrap').html())			                
				}
				else{
				    $('.holder_bulb').html('<img src="'+$(this).find('.innerimg-wrap img').attr('src')+'">')
				}
				
				
				
				// Scroll to top of page after act-page open
				body.animate({scrollTop:0}, '500');

				// Add classes for act page
				//bodyClass.addClass('small-fixed-header act-page');
				//bodyClass.removeClass(currentPageClass);

				// Remove masonry elements and show page act
				mediaElements.fadeOut(400,function(){					
					holderAct.fadeIn();
					// Hide filter sidebar, if clicked, for remove his height from DOM
					$('.filterMenu-sidebar').hide();
					app.initAccordion();
				});

				// hide all icons, except search
				$('#filterbar').find('a').filter(':not(.searchBar)').hide();

				// init redactor
				holderAct.find('.redactor').redactor({
			        buttons: [
			          	'bold',
			          	'italic',
			          	'deleted',
			          	'unorderedlist',
			          	'orderedlist',
			          	'outdent',
			          	'indent',
			          	'table',
			          	'file',
			          	'alignleft',
			          	'aligncenter',
			          	'alignright',
			          	'underline',
			          	'horizontalrule'
			        ]
			    });

			    // add placeholder for redactor
			    holderAct.find('.wrapper-redactor .redactor_editor').on('focus',function(e){
			    	$(this).parents('.wrapper-redactor').addClass('focus');
			    });
			    holderAct.find('.wrapper-redactor .redactor_editor').on('blur',function(e){
			    	$(this).parents('.wrapper-redactor').removeClass('focus');
			    });

				// Close sidebar, if it was open
				app.filterMenuSidebar.close();

				//close dropdowns
				app.closeAllDropdowns.close();
				
				return false;
			});
			
		},
		*/
/************************** showMediaContent  PRevious Version******************************************/		
//		showMediaContent:function(){
//                       
//			var mediaElements = $('#thumbs, #search_elements');
//			var holderAct = $('.holder-act');
//			var body = $("html, body");
//			var bodyClass = $('body');
//			var currentPageClass = bodyClass.data('page-class');
//            //alert("currentPageClass = "+currentPageClass)            
//			mediaElements.on('click', '>li a, a.btn',function(){
//				//console.log($(this).parent().index());
//				var index = $(this).parent().index();
//				$('.ticked').show()
//                    // to view montage added by parul
//                if ($(this).find(".montageContent").attr('class')) {
//                    //$('#media-row1').hide()
//                    var data=$(this).find('.montageContent').html();
//                    
//                    $('.holder_bulb').html($('<div/>').html(data).text());
//                    $('.holder_bulb').find('li').attr("onClick","montageObject.gsView($(this))");
//            
//            /*--comment by gaurav 5 jan 2015--*/
//                    //var gridster_bulb = $(".holder_bulb ul").gridster({
//                    //    widget_margins: [1, 1],
//                    //    widget_base_dimensions: ['98', '98'],
//                    //    autogenerate_stylesheet: true,
//                    //    //resize: {
//                    //    //    enabled: true
//                    //    //},
//                    //   avoid_overlapped_widgets:true
//                    //});
//                    //
//                    //gridster_bulb.gridster().data('gridster').disable();
//                    
//            /*--end comment--*/        
//                }//end
//				else if ($(this).find(".linkContent").attr('class')) {
//                    //$('.media-row').hide()
//					var data=$(this).find('.linkContent').html();
//                    
//                    //alert($(this).find('img'));
//					//$('.holder_bulb').append($('<div/>').html(data).text()+"<div id='linkActual' style='display:none'>"+$(this).html()+"</div>");
//                    $('.holder_bulb').html("<div id='iframeContainer' class='holder_bulb_iframe'></div>");
//                    $('#iframeContainer').html($('<div/>').html(data).text());
//                /*--08jan15 gaurav--*/    
//                    var strIframeHTML =  $(this).find('.linkContent').text();
//					strIframeHTML = strIframeHTML.replace("<","less");
//					strIframeHTML = strIframeHTML.replace(">","greater");
//                    
//                    var linkdataContent = '<p class="linkContent" style="display: none">'+strIframeHTML+'</p>';
//                    var linkdataElement = '<div id="linkActual" style="display:none"><p class="innerimg-wrap">'+$(this).find('.innerimg-wrap').html()+'</p>'+linkdataContent+'</div>';                    
//                    $('.holder_bulb').append(linkdataElement);
//                    /*--08jan15 end--*/
//                }
//				else if ($(this).find('.text_wrap').attr('class')) {
//					//$('#media-row1').show()
//					$('.holder_bulb').html('<p class="notetext">'+$(this).find('.text_wrap').html()+'</p>');
//                                        //$('.holder_bulb').html($(this).find('.text_wrap').html());
//				}
//				else{
//					//$('#media-row1').show()
//					/*-----remove medium from img url---15Jan15--*/
//						var str = $(this).find('.innerimg-wrap img').attr('src');
//						var res = str.replace("/"+medium__thumbnail, "/"+discuss__thumbnail); //19022015			
//						$('.holder_bulb').html('<img src="'+res+'">');
//					/*-----end------*/
//					//$('.holder_bulb').html('<img src="'+$(this).find('.innerimg-wrap img').attr('src')+'">');
//					
//				}
//
//			  
//				
//				
//				
//				// Scroll to top of page after act-page open
//				body.animate({scrollTop:0}, '500');
//
//				// Add classes for act page
//				//bodyClass.addClass('small-fixed-header act-page');
//				//bodyClass.removeClass(currentPageClass);
//
//				// Remove masonry elements and show page act
//				mediaElements.fadeOut(400,function(){
//					
//					$('.holder-act').fadeIn();
//					$('#media_advanced').show();
//                    //code added to show hide media rows
//                    //parul 24 dec
////					if ($(this).find(".montageContent").attr('class')) {
////                    $('.media-row').hide()
////                    }else{
////                        $('.media-row').show()
////                    }
//                    //end
//					media=true;
//					media_from='search';
//					$(".s-media-con").fadeOut();
//					$(".d-media-con").fadeOut();
//					// Hide filter sidebar, if clicked, for remove his height from DOM
//					$('.filterMenu-sidebar').hide();
//					app.initAccordion();
//				});
//				// hide all icons, except search
//                //alert('here2')
//				//$('#filterbar').find('a').filter(':not(.searchBar)').hide();
//                // modified by parul to changr body padding 13012015
//                //$('body').css('padding-top')=$('body').css('padding-top')-
//                //var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
//                //bodyHeight=bodyHeight-43;
//                bodyHeight=234-43;
//                $("body").css({'padding-top':bodyHeight+'px'});
//				$('#filterbar').find('a').hide(); //updated on 24122014 by manishp
//				
//				// init redactor
//				holderAct.find('.redactor').redactor({
//				buttons: [
//						'bold',
//						'italic',
//						'deleted',
//						'unorderedlist',
//						'orderedlist',
//						'outdent',
//						'indent',
//						'table',
//						'file',
//						'alignleft',
//						'aligncenter',
//						'alignright',
//						'underline',
//						'horizontalrule']
//			});
//			// add placeholder for redactor
//			holderAct.find('.wrapper-redactor .redactor_editor').on('focus',function(e){
//				$(this).parents('.wrapper-redactor').addClass('focus');
//			});
//			holderAct.find('.wrapper-redactor .redactor_editor').on('blur',function(e){
//				$(this).parents('.wrapper-redactor').removeClass('focus');
//			});
//				// Close sidebar, if it was open
//				app.filterMenuSidebar.close();
//				//close dropdowns
//				app.closeAllDropdowns.close();
//				return false;
//		});
//			/*holderAct.on('click','.close_media',function(){
//				// Scroll to top of page after exit from act-page
//                                
//				body.animate({scrollTop:0}, '500');
//
//				// Back sidebar
//				$('.filterMenu-sidebar').show();
//				bodyClass.addClass(currentPageClass);
//
//				// Remove page act
//				bodyClass.removeClass('act-page');
//
//				// Back full header only for home page
//				if(bodyClass.hasClass('home-page')){
//					bodyClass.removeClass('small-fixed-header');
//				}
//
//				// show back all icons
//				$('#filterbar').find('a').show();
//
//				// Remove page act and return masonry elements
//				holderAct.fadeOut(400,function(){					
//                                        if ($('.ticked').css('display')=='none') {
//                                            //if( mediaElements.attr('id') == 'thumbs' ){
//					    $('#thumbs, #discuss_elements').fadeIn();
//                                        }
//                                        else{
//                                            $('#thumbs, #search_elements').fadeIn();
//                                        }
//                                        
//				});
//				return false;
//			});*/
//		},


/**************************End of showMediaContent  PRevious Version******************************************/



		showMediaContent:function(){
			var mediaElements = $('#thumbs, #search_elements');
			var holderAct = $('.holder-act');
			var holder = $('#holder-box'); // parul 06042015
			var searchView = $('.search-view');
			var body = $("html, body");
			var bodyClass = $('body');
			var currentPageClass = bodyClass.data('page-class');
			mediaElements.on('click', '>li a, a.btn',function(){
				obj_stage_index = null;
				var scope34 = angular.element($(".search-view")).scope();
				//alert(id)
				//setTimeout(function(){
					scope34.init__stateVar();
				//},1)
				//scope.$apply(function () {
					//scope.init__stateVar();
				//});
				scope34=null;
				//console.log($(this).parent().index());
				
				$('.image-selector').html('<ul id="search-media-tray" class="avatarlist clearfix">'+$('#media-tray-elements').html()+'</ul>');
				$("#search-media-tray li").each(function(){
					//console.log($(this));
					$(this).find('a').attr('onClick','gridster_tray($(this))')
					$(this).addClass('drag-me');
				})
				setTimeout(function(){$('.drag-me').draggable({revert:'invalid',helper: 'clone'});},50);
				var index = $(this).parent().index();
				$('.ticked').show()
                    // to view montage added by parul
                if ($(this).find(".montageContent").attr('class')) {
					//alert('montage case');
                    var data=$(this).find('.montageContent').html();
					console.log(data);
					//console.log($('<div/>').html(data).text());
                    $('#holder-box').html('<div id="montageContainer">'+$('<div/>').html(data).text()+'</div>');
					//console.log('------------------------------------------------------------------------');
					//console.log($('#holder-box').html())
			        $('#holder-box').find('li').attr("onClick","montageObject.gsView($(this))");
					$('#holder-box').append("<div id='montageActual' style='display:none'>"+$(this).html()+"</div>");
                }//end
				else if ($(this).find(".linkContent").attr('class')) {
                    //alert('link');
					//$('.media-row').hide()
					var data = $(this).find('.linkContent').html();
                    //alert($(this).find('img'));
					//$('.holder_bulb').append($('<div/>').html(data).text()+"<div id='linkActual' style='display:none'>"+$(this).html()+"</div>");
                    $('#holder-box').html("<div id='iframeContainer' class='holder_bulb_iframe'></div>");
                    $('#iframeContainer').html($('<div/>').html(data).text());
					/*--08jan15 gaurav--*/    
                    var strIframeHTML =  $(this).find('.linkContent').text();
					strIframeHTML = strIframeHTML.replace("<","less");
					strIframeHTML = strIframeHTML.replace(">","greater");
                    
                    var linkdataContent = '<p class="linkContent" style="display: none">'+strIframeHTML+'</p>';
                    var linkdataElement = '<div id="linkActual" style="display:none"><p class="innerimg-wrap">'+$(this).find('.innerimg-wrap').html()+'</p>'+linkdataContent+'</div>';                    
                    $('#holder-box').append(linkdataElement);
                    /*--08jan15 end--*/
                }/*
				else if ($(this).find('.text_wrap').attr('class')) {
					//$('#media-row1').show()
					//alert('note');
					$('#holder-box').html('<p class="notetext">'+$(this).find('.text_wrap').html()+'</p>');
                    //$('.holder_bulb').html($(this).find('.text_wrap').html());
				}*/
				else if ($(this).find(".noteContent").attr('class')) {
					//alert('montage case');
                    var data=$(this).find('.noteContent').html();
                    $('#holder-box').html('<div id="noteContainer">'+$('<div/>').html(data).text()+'</div>');
			        //$('#holder-box').find('li').attr("onClick","noteObject.gsView($(this))");
					$('#holder-box').append("<div id='noteActual' style='display:none'>"+$(this).html()+"</div>");
                }//end
				else{
					//alert('else');
					//$('#media-row1').show();
					/*-----remove medium from img url---15Jan15--*/
						var str = $(this).find('.innerimg-wrap img').attr('src');
						var res = str.replace("/"+medium__thumbnail, "/"+discuss__thumbnail); //19022015			
						$('#holder-box').html('<img src="'+res+'">');
					/*-----end------*/
					//$('.holder_bulb').html('<img src="'+$(this).find('.innerimg-wrap img').attr('src')+'">');
				}
				$('#holder-box').attr({'is-private':'0'});
				// Scroll to top of page after act-page open
				//body.animate({scrollTop:0}, '500');
				
				// Add classes for act page
				//bodyClass.addClass('small-fixed-header act-page');
				//bodyClass.removeClass(currentPageClass);
				// Remove masonry elements and show page act
				mediaElements.hide(function(){
					$('.holder-act').hide();
					$('body').css({'background':'none repeat scroll 0 0 #fff'});//0802015 Parul
					$('body').css({'padding-top':'0px'});//0602015 Parul
					//$('.wrapper').hide(function(){
					$('#bighead-header1').hide(function(){
							
					});//0602015 Parul
					setTimeout(function(){
						$('.search-view').show();
						$('#menuicon').hide();
					},1);
				});
				
				
				
				
				//$('#media_advanced').show();
				//code added to show hide media rows
				//parul 24 dec
//					if ($(this).find(".montageContent").attr('class')) {
//                    $('.media-row').hide()
//                    }else{
//                        $('.media-row').show()
//                    }
				//end
				media=true;
				media_from='search';
				$(".s-media-con").hide();
				$(".d-media-con").hide();
				// Hide filter sidebar, if clicked, for remove his height from DOM
				$('.filterMenu-sidebar').hide();
				app.initAccordion();
				// hide all icons, except search
                //alert('here2')
				//$('#filterbar').find('a').filter(':not(.searchBar)').hide();
                // modified by parul to changr body padding 13012015
                //$('body').css('padding-top')=$('body').css('padding-top')-
                //var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
                //bodyHeight=bodyHeight-43;
                //bodyHeight=234-43;
                //$("body").css({'padding-top':bodyHeight+'px'});
				$('#filterbar').find('a').hide(); //updated on 24122014 by manishp
				
				// init redactor
				holderAct.find('.redactor').redactor({
				buttons: [
						'bold',
						'italic',
						'deleted',
						'unorderedlist',
						'orderedlist',
						'outdent',
						'indent',
						'table',
						'file',
						'alignleft',
						'aligncenter',
						'alignright',
						'underline',
						'horizontalrule']
				});
				// add placeholder for redactor
				holderAct.find('.wrapper-redactor .redactor_editor').on('focus',function(e){
					$(this).parents('.wrapper-redactor').addClass('focus');
				});
				holderAct.find('.wrapper-redactor .redactor_editor').on('blur',function(e){
					$(this).parents('.wrapper-redactor').removeClass('focus');
				});
					// Close sidebar, if it was open
					app.filterMenuSidebar.close();
					//close dropdowns
					app.closeAllDropdowns.close();
					return false;
			});
		},
		// function added by parul
		
		/*
		 * //open note previous flow
		note:function(){
			var mediaElements = $('#thumbs, #search_elements');
			var mediaElements2 = $('#discuss_elements');
			var writenote = $('#noteIcon');
			var body = $("html, body");
			var bodyClass = $('body');
			var currentPageClass = bodyClass.data('page-class');
			var holderAct = $('.holder-act');
			writenote.on('click', function(){
                $('#montage_text1').val('');
                //$('#media-row1').show();
				$('.ticked').hide();
				// Scroll to top of page after act-page open
				body.animate({scrollTop:0}, '500');
				// Remove masonry elements and show page act
				//mediaElements.fadeOut();
				$('#search_elements').fadeOut();
				mediaElements2.fadeOut(400,function(){
					// Hide filter sidebar, if clicked, for remove his height from DOM
					$('.filterMenu-sidebar').hide();
					app.initAccordion();
				});
				$('.holder-act').fadeIn(400,function(){
					media=false;
					$("#media_advanced").hide();
					$('.s-media-con').fadeIn();
					$('.d-media-con').fadeOut();
				});
				// hide all icons, except search
				//$('#filterbar').find('a').filter(':not(.searchBar)').hide();
				$('#filterbar').find('a').hide(); //updated on 24122014 by manishp
				$("body").css({"padding-top":"191px"});// added by parul 21022015
				// Close sidebar, if it was open
				app.filterMenuSidebar.close();
				//close dropdowns
				app.closeAllDropdowns.close();
				return false;
			});
		},// END
		*/
		
		/*
		 *note function for new montage flow
		*/
		note:function(){
			var mediaElements = $('#thumbs, #search_elements');
			var mediaElements2 = $('#discuss_elements');
			var writenote = $('.noteIcons');
			var body = $("html, body");
			var bodyClass = $('body');
			var currentPageClass = bodyClass.data('page-class');
			var holderAct = $('.holder-act');
			
			writenote.on('click', function(){
				if ($('#media-tray-elements').find('li').length >= 15) {
					$("#media_tray_full_pop").show();
					return false;
				}else{
					//alert($('#discuss_elements').css('display') )
					if ($('#search_elements').css('display') == 'none') {
						//alert('here')
						setTimeout(function(){$('body').addClass('note_padding');},100)
						
					}
					// Scroll to top of page after act-page open
					body.animate({scrollTop:0}, '500');
					$('.filterMenu-sidebar').hide();
					$('#note_forMontage2').show();
					var scope = angular.element($(".search-view")).scope();
					//alert(obj.parent().attr('data-row'));
					scope.$apply(function(){
						scope.openNote_mctrl_toBoard();
					})
					scope = null;
					app.initAccordion();
					app.filterMenuSidebar.close();
					//close dropdowns
					app.closeAllDropdowns.close();
					//$('.edit_froala3').editable('focus');
					return false;
				}
			});
		},// END	
		openFullHeader:function(){
			var btn = $('#head-top').find('.counter_item a');
			btn.on('click',function(){
				$('body').removeClass('small-fixed-header');
				return false
			});
		},
		filterbarFunc: {
			init:function(){
				var scope = app.filterbarFunc;
				scope.searchDropDown();
				scope.dropdown();
				$('body').on('click', scope.closeDropdown);
				$('body').on('click', scope.closeSettingsDropdown);
			},
			searchDropDown:function(){
				var el = $('#filterbar-dropdown');
				var btn = el.find('button');
				var dropdown = el.find('.search-dropdown');
				btn.on('click',function(){
					if(dropdown.hasClass('active')){
						dropdown.removeClass('active');
						dropdown.slideUp();
					} else {
						dropdown.addClass('active');
						dropdown.slideDown();
					}
				});
			},
			dropdown:function(){
				var filterbar = $('#filterbar');
				var filterbarDropdown = $('#filterbar-dropdown');
				filterbar.on('click','a.searchBar',function(e){
					e.stopPropagation();
					app.filterMenuSidebar.close();
					app.filterbarFunc.closeSettingsDropdown();
					var el = $(this).parent();
					if(el.hasClass('active')){
						el.removeClass('active');
						filterbarDropdown.find('>li.searchBar').addClass('hidden');
					} else {
						el.addClass('active');
						filterbarDropdown.find('>li.searchBar').removeClass('hidden');
					}
					return false
				});
				filterbar.on('click','a.settingsBar',function(e){
					e.stopPropagation();
					app.filterMenuSidebar.close();
					app.filterbarFunc.closeDropdown();
					var el = $(this).parent();
					if( el.hasClass('active') ){
						el.removeClass('active');
						filterbarDropdown.find('>li.settingsBar').removeClass('active').slideUp();
					} else {
						el.addClass('active');
						filterbarDropdown.find('>li.settingsBar').addClass('active').slideDown();
					}
					return false
				});
				filterbar.on('click','a.filterMenu',function(e){
					e.stopPropagation();
					app.filterbarFunc.closeDropdown();
					app.filterbarFunc.closeSettingsDropdown();
					var el = $(this).parent();
					if(el.hasClass('active')){
						app.filterMenuSidebar.close();
						//$('[ng-controller="frontMainCtrl"]').scope().setMediaContainer();
					} else {
						app.filterMenuSidebar.open();
					}
					return false
				});
				filterbarDropdown.on('click',function(e){
					e.stopPropagation();
				});
			},
			closeDropdown:function(){
				var filterbarDropdown = $('#filterbar-dropdown');
				var dropdown = filterbarDropdown.find('.search-dropdown');
				var settingsBar = filterbarDropdown.find('>li.settingsBar');
				filterbarDropdown.find('>li.searchBar').addClass('hidden');
				$('#filterbar').find('a.searchBar').parent().removeClass('active');
				if(dropdown.hasClass('active')){
					dropdown.removeClass('active');
					dropdown.slideUp();
				}
				if( settingsBar.hasClass('active') ){
					settingsBar.removeClass('active');
					settingsBar.slideUp();
				}
			},
			closeSettingsDropdown:function(){
				var filterbarDropdown = $('#filterbar-dropdown');
				var settingsBar = filterbarDropdown.find('>li.settingsBar');
				$('#filterbar').find('a.settingsBar').parent().removeClass('active');
				if( settingsBar.hasClass('active') ){
					settingsBar.removeClass('active');
					settingsBar.slideUp();
				}
			}
		},
		filterMenuSidebar:{
			init:function(){
				var scope = app.filterMenuSidebar;
				var menu = $('#filterMenu-sidebar-main-menu');
				menu.on('click', 'li', scope.openSubmenu);
			},
			open:function(){
				var filterbar = $('#filterbar');
				var filterMenuSidebar = $('.filterMenu-sidebar');
				var masonry = $('#thumbs #discuss_elements');
				var btn = filterbar.find('a.filterMenu').parent();
				btn.addClass('active');
				filterMenuSidebar.removeClass('hidden');
				masonry.addClass('with-sidebar');
				setTimeout(function(){
					masonry.masonry();
					app.filterMenuSidebar.fixHeight();
				},200);
			},
			close:function(){
				var filterbar = $('#filterbar');
				var filterMenuSidebar = $('.filterMenu-sidebar');
				var masonry = $('#thumbs #discuss_elements');
				var btn = filterbar.find('a.filterMenu').parent();
				btn.removeClass('active');
				filterMenuSidebar.addClass('hidden');
				masonry.removeClass('with-sidebar');
				setTimeout(function(){
				    //masonry.masonry(); //--first media height issue in discuss page 09Jan15
				    filterMenuSidebar.css('height','0');
				},200);
				app.filterMenuSidebar.closeSubmenu();
			},
			openSubmenu:function(){
				var idx = $(this).index();
				var masonry = $('#thumbs #discuss_elements');
				var menu = $('#filterMenu-sidebar-main-menu');
				var subMenu = $('#filterMenu-sidebar-sub-menu');
				var menuWidth = menu.width();
				
				if( $(this).hasClass('active') ){
					$(this).removeClass('active');
					app.filterMenuSidebar.closeSubmenu();
					return;
				}
				console.log('work :(');
				// add fixed width for menus
				subMenu.width(menuWidth);
				menu.width(menuWidth);

				//remove active status in main menu
				menu.find('li').removeClass('active');
				
				// set active
				$(this).addClass('active');
				
				// add submenu
				subMenu.find('li').removeClass('active');
				subMenu.find('>li:eq('+idx+')').addClass('active');
				menu.parent().addClass('with-submenu');
				
				// reload masonry
				masonry.addClass('with-submenu');
				setTimeout(function(){
					masonry.masonry();
				},200);
			},
			closeSubmenu:function(){
				var masonry = $('#thumbs #discuss_elements');
				var menu = $('#filterMenu-sidebar-main-menu');
				var subMenu = $('#filterMenu-sidebar-sub-menu');

				// reload masonry
				masonry.removeClass('with-submenu');
				setTimeout(function(){
				    //masonry.masonry();//--first media height issue in discuss page 09Jan15
				},200);

				//remove active status
				menu.find('li').removeClass('active');

				// remove subMenu
				subMenu.find('li').removeClass('active');
				menu.parent().removeClass('with-submenu');
			},
			fixHeight:function(){
				var masonry = $('#thumbs #discuss_elements');
				var filterMenuSidebar = $('.filterMenu-sidebar');
				masonry.masonry().masonry('on','layoutComplete',function(msnryInstance,laidOutItems){
					var h = masonry.height();
					filterMenuSidebar.css('height',h);
				});
			}
		},
		initSmallHeader:function(){
			var w = $(window);
			var bodyClass = $('body');
			w.on('scroll',function(){
			    var scrollTop = w.scrollTop();
			    if(bodyClass.hasClass('home-page')){
					var clientH = $( window ).height();
					var headT = $("#head-top").height();
					var calc = clientH - headT;
           
				    if(scrollTop  > 100) {
						$('body').addClass('small-fixed-header');
						$('#mCSB_1').css({'max-height': calc});
						$('#content_scroll').css({'height': calc});
				    } else {
				    	$('body').removeClass('small-fixed-header');
						$('#mCSB_1').css({'max-height': calc});
						$('#content_scroll').css({'height': calc});
				    }
			    } else {
			    	$('body').addClass('small-fixed-header');
			    }
			});
		},
		slideTitleHeader:function(){
			$('#slideTitleHeader').cycle({
			    speed:1000,
			    timeout:0,
			    slides: '>li',
			    fx: 'scrollHorz',
			    prev:'.navarrow-left',
			    next:'.navarrow-right',
			    pager: "#header-dropdown-pager",
			    pagerTemplate: ''
			});
			$('#slideTitleHeader').on('cycle-update-view',function(){
				
				var headerTitleMenu = $('.headerTitleMenu');
				headerTitleMenu.removeClass('active');
			});
		},
		initModalPopup: function(){
			$('a[rel="dialog"]').on('click',function(){
				console.log('dialog called');
				var dataDialogId = $(this).data('dialog-id');
				var overlay = $('<div/>',{class:'modal-overlay'});
				var dialogClass = $(this).data('dialog-class');
				$('.dialog[data-dialog-id="'+dataDialogId+'"]').dialog({
					dialogClass: dialogClass,
					maxWidth: 800,
					minWidth: 600,
					minHeight: 0,
					modal: true,
					show: { 
						effect: "fade",
						duration: 400
					},
					hide: {
						effect: "fade",
						duration: 400
					},
  					open: function( event, ui ) {
  						$(this).find('.redactor').redactor({
					        buttons: [
					          	'bold',
					          	'italic',
					          	'deleted',
					          	'unorderedlist',
					          	'orderedlist',
					          	'outdent',
					          	'indent',
					          	'table',
					          	'file',
					          	'alignleft',
					          	'aligncenter',
					          	'alignright',
					          	'underline',
					          	'horizontalrule'
					        ]
					    });
  					},
				});
				return false;
			});
		},
		closeAllDropdowns:{
			init:function(){
				var scope = app.closeAllDropdowns;
				$('body').on('click', scope.close);
				$('.dropdown-menu').on('click',function(e){
				    e.stopPropagation();
				});	
			},
			close:function(){
				$('body').find('.dropdown-menu').removeClass('active');
				app.filterbarFunc.closeDropdown();
			}
		},
		headerTitleDropDown:function(){
			var headerTitle = $('.title_header_block h1 span');
			headerTitle.on('click', function(e){
				e.stopPropagation();
				var dropdown = $('.cycle-pager-active .headerTitleMenu');
				if(dropdown.hasClass('active')){
					dropdown.removeClass('active');
				} else {
					app.closeAllDropdowns.close();
					dropdown.addClass('active');
				}
			});
		},
		headerThemeDropdown:function(){
			$('.theme_dropdown').on('click','.button',function(e){
				e.stopPropagation();
				var dropdown = $(this).parent().find('ul');
				if(dropdown.hasClass('active')){
					dropdown.removeClass('active');
				} else {
					app.closeAllDropdowns.close();
					dropdown.addClass('active');
				}
				return false;
			});
		},
		headerQuestionDropDown:function(){
			var headerQuestion = $('.headerBg h2 span');
			var dropdown = $('#questionMenu');
			headerQuestion.on('click', function(e){
				e.stopPropagation();
				if(dropdown.hasClass('active')){
					dropdown.removeClass('active');
				} else {
					app.closeAllDropdowns.close();
					dropdown.addClass('active');
				}
			});
		},
		mediaDropDownMenu:function(){
			var mediaBar = $('.mediaBar');
			var mediaBarDropDown = $('.mediaBar-dropdown');
			var timer;
			var obj;
			mediaBar.on('mouseenter',function(){
				clearTimeout(timer);
				mediaBarDropDown.removeClass('hidden');
				obj = $(this).parent();
				obj.addClass('active');
			});
			
			mediaBar.on('mouseleave',function(){
				timer = setTimeout(function(){
					mediaBarDropDown.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
			
			mediaBarDropDown.on('mouseenter',function(){
				clearTimeout(timer);
			});
			
			mediaBarDropDown.on('mouseleave',function(){
				timer = setTimeout(function(){
					mediaBarDropDown.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
			
		},
		
		mediaDropDownMenu:function(){
			var mediaBar2 = $('.mediaBar2');
			var mediaBarDropDown2 = $('.mediaBar-dropdown2');
			var timer;
			var obj;
			mediaBar2.on('mouseenter',function(){
				clearTimeout(timer);
				mediaBarDropDown2.removeClass('hidden');
				obj = $(this).parent();
				obj.addClass('active');
			});
			
			mediaBar2.on('mouseleave',function(){
				timer = setTimeout(function(){
					mediaBarDropDown2.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
			
			mediaBarDropDown2.on('mouseenter',function(){
				clearTimeout(timer);
			});
			
			mediaBarDropDown2.on('mouseleave',function(){
				timer = setTimeout(function(){
					mediaBarDropDown2.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
			
		},
		actionBarDropDown:function(){
			var actionBar = $('.actionBar');
			var actionBarDropDown = $('.actionBar-dropdown');
			var timer;
			var obj;
			actionBar.on('mouseenter',function(){
				clearTimeout(timer);
				actionBarDropDown.removeClass('hidden');
				obj = $(this).parent();
				obj.addClass('active');
			});
			actionBar.on('mouseleave',function(){
				timer = setTimeout(function(){
					actionBarDropDown.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
			actionBarDropDown.on('mouseenter',function(){
				clearTimeout(timer);
			});
			actionBarDropDown.on('mouseleave',function(){
				timer = setTimeout(function(){
					actionBarDropDown.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
		},
		recordButton:function(){
			var mediaBar = $('.record');
			var mediaBarDropDown = $('.record-dropdown');
			var timer;
			var obj;
			mediaBar.on('mouseenter',function(){
				clearTimeout(timer);
				mediaBarDropDown.removeClass('hidden');
				obj = $(this).parent();
				obj.addClass('active');
			});
			mediaBar.on('mouseleave',function(){
				timer = setTimeout(function(){
					mediaBarDropDown.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
			mediaBarDropDown.on('mouseenter',function(){
				clearTimeout(timer);
			});
			mediaBarDropDown.on('mouseleave',function(){
				timer = setTimeout(function(){
					mediaBarDropDown.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
		},
		uploadButton:function(){
			var mediaBar = $('.upload');
			var mediaBarDropDown = $('.upload-dropdown');
			var timer;
			var obj;
			mediaBar.on('mouseenter',function(){
				clearTimeout(timer);
				mediaBarDropDown.removeClass('hidden');
				obj = $(this).parent();
				obj.addClass('active');
			});
			mediaBar.on('mouseleave',function(){
				timer = setTimeout(function(){
					mediaBarDropDown.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
			mediaBarDropDown.on('mouseenter',function(){
				clearTimeout(timer);
			});
			mediaBarDropDown.on('mouseleave',function(){
				timer = setTimeout(function(){
					mediaBarDropDown.addClass('hidden');
					obj.removeClass('active');
				},100);
			});
		},
		tagButton:function(){
			var btn = $('#tagButton');
			var itemsWithTags = $('#thumbs > li');
			var tags = itemsWithTags.find('.overlay');
			btn.on('click',function(){
				if(btn.parent().hasClass('active')){
					btn.parent().removeClass('active');
					tags.removeAttr('style');
				}else{
					btn.parent().addClass('active');
					tags.css({'visibility':'visible','opacity':'1'});
				}
				return false;
			});
		},
		fixDiscussPage:function(){
			var list = $('.discuss_list li');
			list.each(function(){
				var width = $(this).find('.text_holder').width();
				$(this).find('p').css('columnWidth', width);
			});
		},
		accountFunctions:{
			init:function(){
				var scope = app.accountFunctions;
				scope.open();
				scope.close();
				scope.openMoreInfo();
				scope.closeMoreInfo();
				scope.accountTitleDropdown();
				scope.accountQuestionDropdown();
			},
			open:function(){
				$('.btn_open_account').on('click',function(){
					var accPage = $('#account_holder');
					if(accPage.hasClass('open')){
						$('#account_holder').removeClass('open more_info_opened');
						$('.account_more_info_holder').removeClass('open');
					} else {
						$('#account_holder').addClass('open');
					}
				});
			},
			close:function(){
				$('#close_account').on('click',function(){
					$('#account_holder').removeClass('open more_info_opened');
				});
			},
			openMoreInfo:function(){
				$('.open_more_info').on('click',function(){
					$('#account_holder').addClass('more_info_opened');
					$('.account_more_info_holder').addClass('open');
				});
			},
			closeMoreInfo:function(){
				$('#close_more_info').on('click',function(){
					$('#account_holder').removeClass('more_info_opened');
					$('.account_more_info_holder').removeClass('open');
				});
			},
			accountTitleDropdown:function(){
				$('.button_chapter h3').on('click','span',function(e){
					e.stopPropagation();
					var dropdown = $(this).parent().parent().find('ul');
					if(dropdown.hasClass('active')){
						dropdown.removeClass('active');
					} else {
						app.closeAllDropdowns.close();
						dropdown.addClass('active');
					}
					return false;
				});
			},
			accountQuestionDropdown:function(){
				$('.button_question h3').on('click','span',function(e){
					e.stopPropagation();
					var dropdown = $(this).parent().parent().find('ul');
					if(dropdown.hasClass('active')){
						dropdown.removeClass('active');
					} else {
						app.closeAllDropdowns.close();
						dropdown.addClass('active');
					}
					return false;
				});
			}
		},
		jscriptNgcommon:{
			init__urlLocations:function(){
				 small__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().small__thumbnail;
				 medium__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().medium__thumbnail;
				 discuss__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().discuss__thumbnail;
				 large__thumbnail = $('[ng-controller="frontMainCtrl"]').scope().large__thumbnail;
			},
			
		}
	}
	return app;
})(jQuery);

jQuery(document).ready(function(){
    mediaSite.init();
});

$(document).ready(function(){
 
    $('.linkicon').click(function () {
	    $(".urlspacer").toggle("fade",1000);
	});
 
});

$(document).ready(function(){
	$('.makeprivate').click(function(){
	    var $this = $(this);
	    $this.toggleClass('makeprivate');
	    if($this.hasClass('makeprivate')){
	        $this.text('Make Private');         
	    } else {
	        $this.text('Now Private');
	    }
	});
});

$(document).ready(function(){
 
    $('.hidetoolbar').click(function () {
	    $(".redactor_toolbar").toggle("fade",200);
	});
 
});

$(document).ready(function(){
 
    $('.add-ques').click(function () {
	    $(".add-ques").fadeOut(500);
	    $(".ques-input").delay(700).fadeIn(500);
	});
	
	$('.addques').click(function () {
	    $(".ques-input").fadeOut(500);
	    $(".add-ques").delay(700).fadeIn(500);
	});
	/*start 30Dec*/
	//$('.close_comment').click(function () {
        $('.close_view_comment').click(function () {
	    $("#meta_overlay").fadeOut(1000);
	});

	$('.close_add_comment').click(function () {
            $(".write-comment").fadeOut(1000);
            $('.add-comment').fadeIn(300);
			
	});
	/*end*/
	$('.commentBar').click(function () {
		$("#meta_overlay").fadeIn(1000);
	});
	// changed by parul 30012015
	$('#add-cmnt').click(function () {
		//$(".commentsframe").fadeOut(600);
        $(this).fadeOut(600);
		$(".write-comment").delay(700).fadeIn(600,function(){
			//$('#comment-box').focus();// parul 16 jan 2015
			$('#comment-box').focus();
		
		});
		
	});
	
});



var updateScroll = function(el){
	$(el).mCustomScrollbar("update");
}
var scrollToFunc1 = function(){
	
	var obj = $('.customScrollbar');
	obj.each(function(){
		var thisObj = $(this);
		var array = $(this).find('li');
		
		var btnTop = $('<span/>',{class:'btnTop'}).appendTo($(this));
		var btnBottom = $('<span/>',{class:'btnBottom'}).appendTo($(this));
		btnTop.on('click',function(){
			var idx = thisObj.find('li.active').index();
			if(idx > 0){
				$(array[idx]).removeClass('active');
				$(array[idx-1]).addClass('active');
				thisObj.mCustomScrollbar("scrollTo",'.active');
			}
		});
		btnBottom.on('click',function(){
			var idx = thisObj.find('li.active').index();
			if(idx == -1){
				var themeArray = array.filter(function(){return !this.className});
				themeArray.first().addClass('active');
				thisObj.mCustomScrollbar("scrollTo",'.active');
			}
			else {
				if(idx+1 < array.length){
					$(array[idx]).removeClass('active');
					$(array[idx+1]).addClass('active');
					thisObj.mCustomScrollbar("scrollTo",'.active');
				}
			}
		});
		array.on('click',function(){
			array.filter('.active').removeClass('active');
			$(this).addClass('active');
		});
	});
	
}

var scrollToFunc2 = function(){
	
	var obj = $('.customScrollbar');
	obj.each(function(){
		var thisObj = $(this);
		var array = $(this).find('li');
		
		var btnTop = $('.avarrow-left');
		var btnBottom = $('.avarrow-right');
		btnTop.on('click',function(){
			var idx = thisObj.find('li.active').index();
			if(idx > 0){
				$(array[idx]).removeClass('active');
				$(array[idx-1]).addClass('active');
				thisObj.mCustomScrollbar("scrollTo",'.active');
			}
		});
		btnBottom.on('click',function(){
			var idx = thisObj.find('li.active').index();
			if(idx == -1){
				var themeArray = array.filter(function(){return !this.className});
				themeArray.first().addClass('active');
				thisObj.mCustomScrollbar("scrollTo",'.active');
			}
			else {
				if(idx+1 < array.length){
					$(array[idx]).removeClass('active');
					$(array[idx+1]).addClass('active');
					thisObj.mCustomScrollbar("scrollTo",'.active');
				}
			}
		});
		array.on('click',function(){
			array.filter('.active').removeClass('active');
			$(this).addClass('active');
		});
	});
	
}


	
}