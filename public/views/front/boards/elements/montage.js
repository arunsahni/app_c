var montage = (function($){
	var app = {
		init: function(){
			app.initMScroller();
			app.initMasonry();
			app.filterbarFunc.init();
		},
		initMScroller: function setMscroller(){
			alert("mscroller init---");
			$("#content_1, #content_2").mCustomScrollbar();
			//demo fn
			$("a[rel='tips-content']").click(function(e){
				e.preventDefault();
				$("#content_1").fadeToggle("slow",function(){
				var customScrollbar=$("#content_1").find(".mCSB_scrollTools");
				customScrollbar.css({"opacity":0});
				$("#content_1").mCustomScrollbar("update");
				customScrollbar.animate({opacity:1},"slow");
				});
			});
			//demo fn
			$("a[rel='dmedia']").click(function(e){
				e.preventDefault();
				$("#content_2").fadeIn("slow",function(){
				var customScrollbar=$("#content_2").find(".mCSB_scrollTools");
				customScrollbar.css({"opacity":0});
				$("#content_2").mCustomScrollbar("update");
				customScrollbar.animate({opacity:1},"slow");
				});
			});
		}
	}
	return app;
})(jQuery);

jQuery(document).ready(function(){
	montage.init();

});
