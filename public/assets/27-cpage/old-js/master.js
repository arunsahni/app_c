$( document ).ready(function() {
    console.log( "ready!" );
	
	// ---- SWITCH OFF/ON ---- //
	$(".switch-btn").click(function(){
//		$(".switch-btn").addClass("switch-btn-on");
		
		if(!$(this).hasClass("switch-btn-on")){
			$(".switch-btn").addClass("switch-btn-on");
		}
		else{
			$(".switch-btn").removeClass("switch-btn-on");
		}
	});
	
	// ---- DESKTOP MODAL ---- //
	$("#screen-view").click(function(){
		$(".desktop-popup").show();
	});
	$(".screen-view li").click(function(){
		$(".screen-view li").removeClass("active");
		$(this).addClass("active"); 
		$('#WorkshopId').removeClass().addClass('workshop ' + $(this).data('view'));
	});
	
	// ---- UNDO/REDO ---- //
	$(".undo-redo .layout").click(function(){
		$(".undo-redo .layout").removeClass("active");
		$(this).addClass("active");
	});
	
	
	// ---- BACKGROUND ---- //
	$(".edit-bg").click(function(){
		$("a.edit-bg-link").hide();
		$(".background-icons").show();
	});
	
	// ---- FOREGROUND ---- //
	$(".edit-fg").click(function(){
		$("a.edit-fg-link").hide();
		$(".foreground-icons").show();
	});
	
	// ---- COLOR MODAL ---- //
	$("#color-background-modal").click(function(){
		$(".color-bg-popup").show();
	});
	
	// ---- PHOTO MODAL ---- //
	$("#photo-background-modal").click(function(){
		$(".picture-bg-popup").show();
	});
	$("#photo-foreground-modal").click(function(){
		$(".picture-forground-popup").show();
	});
	
	// ---- VIDEO MODAL ---- //
	$("#video-background-modal").click(function(){
		$(".video-bg-popup").show();
	});
	$("#video-foreground-modal").click(function(){
		$(".video-forground-popup").show();
	});
	
	// ---- AUDIO MODAL ---- //
	$("#audio-foreground-modal").click(function(){
		$(".audio-forground-popup").show();
	});
	
	// ---- SEARCH GALLER MODAL ---- //
	$(".search-list-modal").click(function(){
		$(".search-gallery-modal").show();
	});
	
	$(".search-gallery-modal .close-btn a").click(function(){
		$(".search-gallery-modal").hide();
	});
	
	// ---- QUESTION ANSWER MODAL ---- //
	$("#ques-ans-foreground-modal").click(function(){
		$(".que-ans-forground-popup").show();
	});
	$(".que-ans-forground-popup li").click(function(){
		$(".que-ans-forground-popup li").removeClass("active");
		$(this).addClass("active");
	});
	
	$("#question-type-text, #question-type-gallery").click(function(){
		$(".question-answer-box").show();
	});
	
	$("#question-type-text").click(function(){
		$(".edit-ques-bg").removeClass("question-bg-box");
		$(".text-toolbar").removeClass("text-toolbar-d");
	});
	
	$("#question-type-gallery").click(function(){
		$(".edit-ques-bg").addClass("question-bg-box");
		$(".text-toolbar").addClass("text-toolbar-d");
	});
	
	$("#edit-add-media").click(function(){
		$(".add-media-link").hide();
		$(".add-media-box").show();
		$("#edit-add-media").hide();
	});
	
	$("#question-answer-box-close").click(function(){
		$(".question-answer-box").hide();
	});
	
	
	
	
	// ---- GRID MODAL ---- //
	$("#grid-modal").click(function(){
		$(".grid-popup").show();
	});
	
	$(".switch-grid-btn").click(function(){
		if(!$(this).parent("li:eq(0)").hasClass("active")){
			$(".brandon-bold").removeClass("active");
			$(this).parent("li:eq(0)").addClass("active");
		}
		else{
			$(".brandon-bold").removeClass("active");
		}
		
	});
	
	// ---- ADD MODAL ---- //
	$("#add-modal").click(function(){
		$(".add-popup").show();
	});	
	
	// ---- FONT SETTING MODAL ---- //
	$("#font-setting-modal").click(function(){
		$(".font-setting-popup").show();
	});
	$(".style-font a").click(function(){
		$(".style-font a").removeClass("active");
		$(this).addClass("active");
	});
	
	
		
});

// ---- STICKY NAV ---- //
$(document).ready(function(){
	var elmnt = $(document.getElementById("pop-up-uncle"));
	elmnt.scroll(function(){
		a = elmnt.scrollTop();
		if (a >= 150) {
			$('.search-form').addClass('sticky-nav');		
		} else {
			$('.search-form').removeClass('sticky-nav');
		}
	});
});



// ---- CLOSE POPUP WINDOW CLICK OUTSIDE ---- //
 $(document).ready(function () {
     $('.widget-tollbar-popup, .text-widget-popup').hide()
 });

 $(document).mouseup(function (e) {
     var popup = $(".widget-tollbar-popup, .text-widget-popup");
     if (!$('').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
         popup.hide();
     }
 });