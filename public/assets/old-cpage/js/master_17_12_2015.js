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


// ---- CUSTOM SELECT BOX ---- //
$(document).ready(function(){
	$(".custom-select").each(function(){
		$(this).wrap("<span class='select-wrapper'></span>");
		$(this).after("<span class='holder'></span>");
	});
	$(".custom-select").change(function(){
		var selectedOption = $(this).find(":selected").text();
		$(this).next(".holder").text(selectedOption);
	}).trigger('change');
})



// ---- CLOSE POPUP WINDOW CLICK OUTSIDE ---- //
 $(document).ready(function () {
     $('.popup').hide()
 });

 $(document).mouseup(function (e) {
     var popup = $(".popup");
     if (!$('').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
         popup.hide();
     }
 });
 
//window.onkeydown = function( event ) {
//    if ( event.keyCode === 27 ) {
//        console.log( 'escape pressed' );
//    }
//};
//$(document).keydown(function(e) {        
//    if (e.keyCode == 27) {
//        window.close();
//    }
//});