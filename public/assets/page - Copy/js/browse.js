//$(function() {
//	setTimeout(function() {
//		$.each($('.browse-images .item img'), function() {
//			$(this).siblings('.menu').height($(this).height());
//		});
//	}, 1000);
//	
//	$('.browse .browse-images ul li a').hover(function() {
//		$(this).siblings('.tooltip').animate({ opacity: 1 }, { duration: 200 });
//	}, function() {
//		$(this).siblings('.tooltip').animate({ opacity: 0 }, { duration: 200 });
//	});
//	
//	$(window).resize(function() {
//		$.each($('.browse-images .item img'), function() {
//			$(this).siblings('.menu').height($(this).height());
//		});
//	});
//	
//	$('.item').hover(function() {
//		$(this).children('.menu').animate({ opacity: 0.9 }, { duration: 300 });
//		$(this).children('ul').animate({ opacity: 0.9 }, { duration: 300 });
//		$(this).children('h3').animate({ opacity: 0.9 }, { duration: 300 });
//		$(this).children('.date').animate({ opacity: 0.9 }, { duration: 300 });
//	}, function() {
//		$(this).children('.menu').animate({ opacity: 0 }, { duration: 300 });
//		$(this).children('ul').animate({ opacity: 0 }, { duration: 300 });
//		$(this).children('h3').animate({ opacity: 0 }, { duration: 300 });
//		$(this).children('.date').animate({ opacity: 0 }, { duration: 300 });		
//	});
//});