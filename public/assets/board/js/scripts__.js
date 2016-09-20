mediaSite = (function($){
	var app = {
		init: function(){
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
			$(".accordion").accordion({
			    collapsible: true,
			    active: false,
			    heightStyle: "content"
			});
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
				scope.scrollToFunc();
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
						if(idx+1 < array.length){
							$(array[idx]).removeClass('active');
							$(array[idx+1]).addClass('active');
							thisObj.mCustomScrollbar("scrollTo",'.active');
						}
					});
					array.on('click',function(){
						array.filter('.active').removeClass('active');
						$(this).addClass('active');
					});
				});
			}
		},
		showMediaContent:function(){
			var mediaElements = $('#thumbs, #discuss_elements');
			var holderAct = $('.holder-act');
			var body = $("html, body");
			var bodyClass = $('body');
			var currentPageClass = bodyClass.data('page-class');
			mediaElements.on('click', '>li a, a.btn',function(){
				// Scroll to top of page after act-page open
				body.animate({scrollTop:0}, '500');

				// Add classes for act page
				bodyClass.addClass('small-fixed-header act-page');
				bodyClass.removeClass(currentPageClass);

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
			holderAct.on('click','.close_media',function(){
				// Scroll to top of page after exit from act-page
				body.animate({scrollTop:0}, '500');

				// Back sidebar
				$('.filterMenu-sidebar').show();
				bodyClass.addClass(currentPageClass);

				// Remove page act
				bodyClass.removeClass('act-page');

				// Back full header only for home page
				if(bodyClass.hasClass('home-page')){
					bodyClass.removeClass('small-fixed-header');
				}

				// show back all icons
				$('#filterbar').find('a').show();

				// Remove page act and return masonry elements
				holderAct.fadeOut(400,function(){
					if( mediaElements.attr('id') == 'thumbs' ){
						mediaElements.fadeIn().masonry();
					}else{
						mediaElements.fadeIn();
					}
				});
				return false;
			});
		},
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
				var masonry = $('#thumbs');
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
				var masonry = $('#thumbs');
				var btn = filterbar.find('a.filterMenu').parent();
				btn.removeClass('active');
				filterMenuSidebar.addClass('hidden');
				masonry.removeClass('with-sidebar');
				setTimeout(function(){
					masonry.masonry();
					filterMenuSidebar.css('height','0');
				},200);
				app.filterMenuSidebar.closeSubmenu();
			},
			openSubmenu:function(){
				var idx = $(this).index();
				var masonry = $('#thumbs');
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
				var masonry = $('#thumbs');
				var menu = $('#filterMenu-sidebar-main-menu');
				var subMenu = $('#filterMenu-sidebar-sub-menu');

				// reload masonry
				masonry.removeClass('with-submenu');
				setTimeout(function(){
					masonry.masonry();
				},200);

				//remove active status
				menu.find('li').removeClass('active');

				// remove subMenu
				subMenu.find('li').removeClass('active');
				menu.parent().removeClass('with-submenu');
			},
			fixHeight:function(){
				var masonry = $('#thumbs');
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
				    if(scrollTop  > 100) {
						$('body').addClass('small-fixed-header');
				    } else {
				    	$('body').removeClass('small-fixed-header');
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
		}
	}
	return app;
})(jQuery);

jQuery(document).ready(function(){
	$("body").queryLoader2({
		minimumTime: 500,
		backgroundColor:'#111111',
		barColor:'#000',
		percentage: false,
		completeAnimation: "grow"
	});
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
	
	$('.close_comment').click(function () {
		$("#meta_overlay").fadeOut(1000);
	});
	
	$('.prev_comment').click(function () {
		$(".current").fadeOut(600);
		$(".old").delay(700).fadeIn(600);
	});
	
	$('.commentBar').click(function () {
		$("#meta_overlay").fadeIn(1000);
	});
	
	$('.add-comment').click(function () {
		$(".commentsframe").fadeOut(600);
		$(".write-comment").delay(700).fadeIn(600);
	});
	
});



