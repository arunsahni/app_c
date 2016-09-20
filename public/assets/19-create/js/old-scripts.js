$(function() {
	//$('#left-menu').jPushMenu();
	setTimeout(function(){
		// Full height sidebar
		//alert();
		$('#left-menu').height($(window).height());
		$('#settings').show();
		// Full height content
		$('#content').height($(window).height());
		
		// Set Loader height
		$('#loader').height($(window).height());
		$('body').height($(window).height()).css({'overflow':'visible'});
		$('#content').height($(window).height());
		
		
		$('#menu-button').click(function() {
			if($('#content').hasClass('open')) {
				$('#content').animate({ 'right': '0' }, { duration: 500 });
				$('#content').removeClass('open');
				setTimeout(function(){
					$('#overflow-container').css({'overflow-x':'visible'});
				},1000)
			} else {
				$('#content').animate({ 'right': '-200px' }, { duration: 500 });
				$('#content').addClass('open');
				$('#overflow-container').css({'overflow-x':'hidden'});
			}
		});
		
		$('.settings-button').on('click',function(e) {
			e.preventDefault();
			$('#settings').fadeIn(400);
		});
		
		$('#settings .close').click(function() {
			$('#settings').fadeOut(400);
		});
		
		// Set settings modal height
		$('#settings, #settings #background, #settings .wrapper').height($(window).height());
		
		// Settings slider
		$('#response-slider').slider({
			range: "min",
			min: 0,
			max: 100,
			step: 5,
			slide: function( event, ui ) {
				$( "#settings h3 > span > span" ).text( ui.value );
			},
			value: 25
		});
		
		
		// Window resize
		$(window).resize(function() {
			// Full height sidebar
			$('#left-menu').height($(window).height());
			
			// Full height content
			$('#content').height($(window).height());
			
			// Set settings modal height
			//$('#settings, #settings #background, #settings .wrapper').height($(window).height());
			
			// Set Loader height
			$('#loader').height($(window).height());
		
		});
		
		
		
		if($('.carousel').length) {
			$('.carousel').slick({
				dots: true,
				infinite: false,
				speed: 500,
				slidesToShow: 4,
				slidesToScroll: 1,
				arrows: true,
				draggable: true,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 1,
							infinite: true,
						}
					},
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}
				]
			});
		}
		
		//if($('.show-members').length) {
	//		$('.show-members').click(function() {
	//			if($('#settings .members-con .friends').hasClass('visible')) {
	//				$('#settings .members-con .friends').fadeOut(300);
	//				$('#settings .members-con .friends').removeClass('visible');
	//			} else {
	//				$('#settings .members-con .friends').fadeIn(300);
	//				$('#settings .members-con .friends').addClass('visible');
	//			}
	//		});
	//	}
		
		
		
		
		
		// Create new sub question
		if($('.sub-question').length) {
			$(document.body).on('click', '.sub-question' ,function(){
				addSubQuestion($(this));
			});
		}
		
		function addSubQuestion(el) {
			el.removeAttr('readonly');
			
			$('.s-question').append(
				$('<input />').attr({ 
					readonly : "readonly",
					type: "text",
					name: "sub-question",
					placeholder: "+ Add a sub question",
				}).addClass('sub-question').css('height', 0).animate({ 'height': '44px' },{ duration: 500 })
			);
		}
		
		
		if($('.set-the-focus').length) {
			$('.set-the-focus label').click(function() {
				$(this).siblings('.subheading').text($(this).attr('rel'));
			});
		}
		
		if($('.question-type-label')) {
			$('.question-type label').click(function() {
				if($(this).attr('rel') == 'standard') {
					$('.standard-question').css('display', 'block');
					$('.columned-question').css('display', 'none');
				} else if($(this).attr('rel') == 'columned') {
					$('.standard-question').css('display', 'none');
					$('.columned-question').css('display', 'block');
				}
			});
		}
		
		
		if($('#question-slider').length) {
			// Settings slider
			$('#question-slider').slider({
				range: "min",
				min: 1,
				max: 5,
				step: 1,
				slide: function( event, ui ) {
					$( ".question-slider-label" ).text( ui.value );
					$('#inputs').empty();
					
					// work out width
					var width = (100 / ui.value) - 1;
					var right_margin = ui.value / (ui.value - 1);
					
					console.log(width);
					console.log(right_margin);
					
					for(x = 1; x <= ui.value; x++) {
	
						var newinput = $('<input />').attr({
							type: "text",
							name: "question" + x,
							placeholder: "Enter Question..",
							style: "margin-right: " + right_margin + "%; width: " + width + "%;"
						})
						
						if(x == ui.value) {
							newinput.addClass('last');
						}
						$('#inputs').append(newinput);
					}
				},
				value: 4
			});
		}
	
	
	
	
		if($('.u-carousel').length) {
			$('.u-carousel').slick({
				dots: true,
				infinite: false,
				speed: 500,
				slidesToShow: 5,
				slidesToScroll: 1,
				arrows: true,
				draggable: true,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 5,
							slidesToScroll: 1,
							infinite: true,
						}
					},
					{
						breakpoint: 600,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}
				]
			});
		}
		
		
		if($('.media-qty-slider').length) {
			$('.media-qty-slider').slider({
				range: "min",
				min: 0,
				max: 200,
				step: 5,
				slide: function( event, ui ) {
					$(this).siblings('.res').text( ui.value );
				},
				value: 100
			});
		}
		
		if($('.user-qty-slider').length) {
			$('.user-qty-slider').slider({
				range: "min",
				min: 0,
				max: 200,
				step: 5,
				slide: function( event, ui ) {
					$(this).siblings('.res').text( ui.value );
				},
				value: 100
			});
		}
	
	
		if($('#container').length) {
			var container = document.querySelector('#container');
			
			setTimeout(function() {
				var msnry = new Masonry( container, {
			  // options
			
				  itemSelector: '.item',
				  gutter: 10
				})
			}, 1000);
		}
	
		if($('.tabs').length) {
			$('.tabs').tabs();	
		}
		
		$('.modal .close').click(function() {
			$(this).parent('.modal').fadeOut();
		});
		
		$('.modal .close-context').click(function() {
			$(this).parent().parent('.modal').fadeOut();
		});
		
		$('.foreground.btn').click(function(e) {
			e.preventDefault();
			$('.modal.foreground').fadeIn();
		});
		
		$('.background.btn').click(function(e) {
			e.preventDefault();
			$('.modal.background').fadeIn();
		});
		
		if($('.modal.fixed').length) {
			$('.modal.fixed, .modal.fixed .bg').height($(window).height());
			$(window).resize(function() {
				$('.modal.fixed, .modal.fixed .bg').height($(window).height());
			});
		}
		
		if($('.add-context').length) {
			$('.add-context').click(function(e) {
				e.preventDefault();
				$('.modal.context').fadeIn();
			});
		}
		
		if($('#content.chapter .carousel li.edit a img').length) {
			$('#content.chapter .carousel li.edit a img').click(function() {
				$('.modal.chapter').fadeIn();
			});
		}
		
		
		if($('.scheme .view')) {
			$('.scheme .view').click(function() {
				$('.modal.color').fadeIn();
			});	
		}
		
	
		
		$.each($('.filters > li > ul'), function() {
			$(this).attr('rel', $(this).height());
			$(this).height(0);
			$(this).css('display', 'block');
		});
		
		$('.filters > li').click(function() {
			if($(this).children('ul').height() == 0) {
				$(this).children('ul').animate({ height: $(this).children('ul').attr('rel') }, { duration: 500 });
			} else {
				$(this).children('ul').animate({ height: 0 }, { duration: 500 });
			}
		});
	},1)
});

