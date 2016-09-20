function customjs(){
$(document).ready(function(){
		$("#filterbar").hover(function(){
			$(".searchinglist").addClass("highlight")},
		function(){
			$(".searchinglist").removeClass("highlight")
		});  
		
		$('.searchBar').click(function () {
			$("input#searchfld").focus();	
		});
		
		$('#tips-btn').click(function(e){    
			    $('#questionMenu').fadeOut('slow', function(){
			        $('#tips, .ui-widget-overlay').fadeIn('slow');
			    });
			});
			
			$('#closetips').click(function(e){    
			    $('#tips, .ui-widget-overlay').fadeOut('slow', function(){
			        $('#questionMenu').fadeIn('slow');
			    });
			});
			
			$(".sidemenu").click(function(){
				$("nav").slideToggle(500);
				$(this).toggleClass("active");
				return false;
			 });			
			
		
    });
	/*
	var flashMsg = '';
	function setFlash(flashMsg,msgClass){
		//alert("m here...");
		$(document).ready(function(){
			//alert("m ready now...");
			$('body').append("<div class='flash_msg_hide "+msgClass+"'>"+flashMsg+"</div>");
			$('.flash_msg_hide').addClass('flash_msg').removeClass('flash_msg_hide');
			setTimeout(function(){
				//alert("m called");
				$('.flash_msg').removeClass('flash_msg').addClass('flash_msg_hide');
			},5000)
		});
	}
	*/
}