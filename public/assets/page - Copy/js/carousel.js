$(document).ready(function() {
	setTimeout(function() {
		$.each($('.carousel img.primary'), function() {
			$(this).siblings('div.menu').height($(this).height());
			$(this).siblings('div.menu').width($(this).width());
			$(this).siblings('ul').height($(this).height() - 20);
			$(this).siblings('ul').width($(this).width() - 20);
		});
		
		$('#loader').animate({ opacity: 0 }, { duration: 300 });
	}, 1000);
	
	setTimeout(function() {
		$('#loader').css('display', 'none');
	}, 1300);
	
	$(window).resize(function() {
		setTimeout(function() {
		$.each($('.carousel img.primary'), function() {
			$(this).siblings('div.menu').height($(this).height());
			$(this).siblings('div.menu').width($(this).width());
			$(this).siblings('ul').height($(this).height() - 20);
			$(this).siblings('ul').width($(this).width() - 20);
		});
		}, 1000);
	});

	$('.carousel ul').hover(function() {
		$(this).animate({ opacity: 1 }, { duration: 200 });
		$(this).siblings('.menu').animate({ opacity: 0.9 }, { duration: 200 });
	}, function() {
		$(this).animate({ opacity: 0 }, { duration: 200 });
		$(this).siblings('.menu').animate({ opacity: 0 }, { duration: 200 });
	});
	
	$('.carousel ul li a').hover(function() {
		$(this).siblings('.tooltip').animate({ opacity: 1 }, { duration: 200 });
	}, function() {
		$(this).siblings('.tooltip').animate({ opacity: 0 }, { duration: 200 });
	});
});