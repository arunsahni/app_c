var small__thumbnail = '';
var medium__thumbnail = '';
var large__thumbnail = '';
function startupall(){
	mediaSite = (function($){
	var app = {
		init: function(){
			app.openFullHeader();
			app.initSmallHeader();
		},
		openFullHeader:function(){
			var btn = $('#head-top').find('.counter_item a');
			btn.on('click',function(){
				$('body').removeClass('small-fixed-header');
				return false
			});
		},
		initSmallHeader:function(){
			var w = $(window);
			var bodyClass = $('body');
			w.on('scroll',function(){
			    var scrollTop = w.scrollTop();
				if(scrollTop  > 100) {
					$(".quest-block").css("display","none");
				} else {
					$(".quest-block").css("display","block");
				}
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