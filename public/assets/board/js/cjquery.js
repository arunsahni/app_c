var preventClick = function (e) { e.stopPropagation(); e.preventDefault(); };
var gridster;
  $(function(){
    gridster = $(".gridster > ul").gridster({
        widget_margins: [0, 0],
        widget_base_dimensions: [222, 222],
        min_cols: 2,
		avoid_overlapped_widgets: true,
        resize: {
          enabled: false
        },
		draggable:{
					start:function(event,ui){
						event.stopPropagation();
					  ui.$player[0].addEventListener('click', preventClick, true);
					  col = $(ui.$player).attr('data-col');
					  row = $(ui.$player).attr('data-row');
					  //event.preventDefault();
					  return false;
					},
					stop:function(event,ui){
						event.stopPropagation()
						var player = ui.$player;
						setTimeout(function () {
							player[0].removeEventListener('click', preventClick, true);
						},0);
						//event.preventDefault();
						newCol = $(ui.$player).attr('data-col');
						newRow = $(ui.$player).attr('data-row');
						row_limit = 2;
						col_limit = 2;
						grid_size= row_limit * col_limit;
						setTimeout(function(){
							$('#grid').find('li').each(function(){
								console.log($(this).attr('data-row')+','+$(this).attr('data-col'));
								if($(this).attr('data-row') > row_limit){
									console.log('----------over row limit------------')
									if ($('#grid li[data-row='+row+'][ data-col='+col+']').is('li')) {
										for(i = 1; i <= row_limit;i++){
											for(j = 1; j <= col_limit;j++){
											//  console.log('-----length-----' + $('#grid li[data-row='+i+'][ data-col='+j+']').length);
											//  if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 1) {
											//	// one li at this place
											//	
											//  }
											//  else if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 0) {
											//	//  no li at this place
											//	console.log('-------New Position-------')
											//	console.log(i+','+j);
											//	$(this).attr({'data-row':i});
											//	$(this).attr({'data-col':j});
											//  }else{
											//	// more than  one li at this place
											//	alert('two li case')
											//  }
											rearrange($(this))
											}
										  
										}
										//if (!($('#grid li[data-row="1"][ data-col="1"]').is('li'))) {
										//  $(this).attr({'data-row':'1'});
										//  $(this).attr({'data-col':'1'});
										//}else if (!($('#grid li[data-row="1"][ data-col="2"]').is('li'))) {
										//  $(this).attr({'data-row':'1'});
										//  $(this).attr({'data-col':'2'});
										//}else if (!($('#grid li[data-row="2"][ data-col="1"]').is('li'))) {
										//  $(this).attr({'data-row':'2'});
										//  $(this).attr({'data-col':'1'});
										//}else if (!($('#grid li[data-row="2"][ data-col="2"]').is('li'))) {
										//  $(this).attr({'data-row':'2'});
										//  $(this).attr({'data-col':'2'});
										//}
									}else{
									  $(this).attr({'data-row':row});
									  $(this).attr({'data-col':col});
									}
								}
								else if ($('#grid li[data-row='+$(this).attr('data-row')+'][ data-col='+$(this).attr('data-col')+']').length > 1) {
								  console.log('--------calling rearrange-----------');
								  rearrange_again($(this));
								}
								else{
								  
								}
							})
						},50)
						return false;
					}
				},
    }).data('gridster');

///****************************************************************************************************************
///****************************************************************************************************************
/// initializing froala for media statement case
///****************************************************************************************************************
///****************************************************************************************************************
/// parul 20042015
	$('.edit_froala1').editable({
	// Set the file upload URL.
	//imageUploadURL: "/media/froala_file",
	placeholder: "",
	buttons: ['blockStyle','fontSize','fontFamily','color','align','fullscreen','html']
	}).on('editable.focus', function (e, editor) {
		// editor focused
	    // $('.edit_froala1')
		var text = $('.edit_froala1').editable('getText');
		console.log(text);
		if(text == 'Start writing...'){
			$('.edit_froala1').editable('setHTML','')
		}
	}).on('editable.blur', function (e, editor) {
		// editor focused
	    // $('.edit_froala1')
		var text = $('.edit_froala1').editable('getText');
		console.log(text);
		if(text == ''){
			$('.edit_froala1').editable('setHTML','Start writing...')
		}
	});
/********************************************END******************************************************/



//$('.froala-view').keydown(function(){
//	//console.log('keydown');
//	//console.log($('.edit_froala1').editable('getHTML', true, true))
//	if ($('.edit_froala1').editable('getHTML', true, true) == '<p class="fr-tag">Start writing...</p>') {
//		
//		$('.edit_froala1').editable('setHTML','');
//	}
//})
///****************************************************************************************************************
///****************************************************************************************************************
/// initializing froala for add note for montage
///****************************************************************************************************************
///****************************************************************************************************************
/// parul 20042015
	$('.edit_froala2').editable({
		// Set the file upload URL.
		placeholder: "",
		imageUploadURL: "/media/froala_file",
		buttons: ['blockStyle','fontSize','fontFamily','color','align','sep','insertImage','insertVideo','table','createLink','fullscreen','html']
	
	}) .on('editable.imageError', function (e, editor, error) {
        // Custom error message returned from the server.
        if (error.code == 0) {  }

        // Bad link.
        else if (error.code == 1) { }

        // No link in upload response.
        else if (error.code == 2) { }

        // Error during image upload.
        else if (error.code == 3) { }

        // Parsing response failed.
        else if (error.code == 4) {  }

        // Image too large.
        else if (error.code == 5) {  }

        // Invalid image type.
        else if (error.code == 6) {  }

        // Image can be uploaded only to same domain in IE 8 and IE 9.
        else if (error.code == 7) {  }
      }).on('editable.focus', function (e, editor) {
		// editor focused
	    // $('.edit_froala1')
		var text = $('.edit_froala2').editable('getText');
		console.log(text);
		if(text == 'Start writing...'){
			$('.edit_froala2').editable('setHTML','')
		}
	}).on('editable.blur', function (e, editor) {
		// editor focused
	    // $('.edit_froala1')
		var text = $('.edit_froala2').editable('getText');
		console.log(text);
		if(text == ''){
			$('.edit_froala2').editable('setHTML','Start writing...')
		}
	});
	
	
///****************************************************************************************************************
///****************************************************************************************************************
/// initializing froala for add note to board case
///****************************************************************************************************************
///****************************************************************************************************************
/// parul 20042015
	$('.edit_froala3').editable({
		// Set the file upload URL.
		placeholder: "",
		imageUploadURL: "/media/froala_file",
		buttons: ['blockStyle','fontSize','fontFamily','color','align','sep','insertImage','insertVideo','table','createLink','fullscreen','html']
	
	}) .on('editable.imageError', function (e, editor, error) {
        // Custom error message returned from the server.
        if (error.code == 0) {  }

        // Bad link.
        else if (error.code == 1) { }

        // No link in upload response.
        else if (error.code == 2) { }

        // Error during image upload.
        else if (error.code == 3) { }

        // Parsing response failed.
        else if (error.code == 4) {  }

        // Image too large.
        else if (error.code == 5) {  }

        // Invalid image type.
        else if (error.code == 6) {  }

        // Image can be uploaded only to same domain in IE 8 and IE 9.
        else if (error.code == 7) {  }
      }).on('editable.focus', function (e, editor) {
		// editor focused
	    // $('.edit_froala1')
		var text = $('.edit_froala3').editable('getText');
		console.log(text);
		if(text == 'Start writing...'){
			$('.edit_froala3').editable('setHTML','')
		}
	}).on('editable.blur', function (e, editor) {
		// editor focused
	    // $('.edit_froala1')
		var text = $('.edit_froala3').editable('getText');
		console.log(text);
		if(text == ''){
			$('.edit_froala3').editable('setHTML','Start writing...')
		}
	});
	

/********************************************END******************************************************/	
	
	



	
  });
  
  
  function rearrange(obj) {
	for(i = 1; i <= row_limit;i++){
	  for(j = 1; j <= col_limit;j++){
		//console.log('-----length-----' + $('#grid li[data-row='+i+'][ data-col='+j+']').length);
		if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 1) {
		  // one li at this place
		  
		}
		else if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 0) {
		  //  no li at this place
		  console.log('-------New Position-------')
		  console.log(i+','+j);
		  obj.attr({'data-row':i});
		  obj.attr({'data-col':j});
		}else{
		  // more than  one li at this place
		  alert('two li case');
		  rearrange_again($('#grid li[data-row='+i+'][ data-col='+j+']:eq(1)'))
		}
	  }
	}
  }
  
 function rearrange_again(obj) {
	for(i = 1; i <= row_limit;i++){
	  for(j = 1; j <= col_limit;j++){
		//console.log('-----length-----' + $('#grid li[data-row='+i+'][ data-col='+j+']').length);
		if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 1) {
		  // one li at this place
		  
		}
		else if ($('#grid li[data-row='+i+'][ data-col='+j+']').length == 0) {
		  //  no li at this place
		  console.log('-------New Position-------')
		  console.log(i+','+j);
		  obj.attr({'data-row':i});
		  obj.attr({'data-col':j});
		}else{
		  // more than  one li at this place
		  //alert('two li case');
		  //rearrange($('#grid li[data-row='+i+'][ data-col='+j+']:eq(1)'))
		}
	  }
	}
  } 
  
    $(function() {
		// Tooltip Circle
	    $('#a-tooltip1').hover(function() {
			$(this).addClass('show'); 
			$('.fa-pencil-square-o').fadeIn(200);
		}, 
		function() { 
		    $(this).removeClass('show');  
			$('.fa-pencil-square-o').fadeOut(200);
		});
		
		$('#a-tooltip5').hover(function() {
			$(this).addClass('show'); 
			$('.fa-pencil-square-o').fadeIn(200);
		}, 
		function() { 
		    $(this).removeClass('show');  
			$('.fa-pencil-square-o').fadeOut(200);
		});
		
		$('#a-tooltip6').hover(function() {
			$(this).addClass('show'); 
			$('.fa-pencil-square-o').fadeIn(200);
		}, 
		function() { 
		    $(this).removeClass('show');  
			$('.fa-pencil-square-o').fadeOut(200);
		});
		
		$('#a-tooltip7').hover(function() {
			$(this).addClass('show'); 
			$('.fa-pencil-square-o').fadeIn(200);
		}, 
		function() { 
		    $(this).removeClass('show');  
			$('.fa-pencil-square-o').fadeOut(200);
		});
		
		// Tooltip Square
		$('#a-tooltip2').hover(function() { 
		    $(this).addClass('show'); 
			$('.fa-remove').fadeIn(200); 
		}, 
		function() { 
		    $(this).removeClass('show'); 
			$('.fa-remove').fadeOut(200); 
		});
		
		$('#a-tooltip3').hover(function() { 
		    $(this).addClass('show'); 
			$('.fa-remove').fadeIn(200); 
		}, 
		function() { 
		    $(this).removeClass('show'); 
			$('.fa-remove').fadeOut(200); 
		});
		
		$('#a-tooltip4').hover(function() { 
		    $(this).addClass('show'); 
			$('.fa-remove').fadeIn(200); 
		}, 
		function() { 
		    $(this).removeClass('show'); 
			$('.fa-remove').fadeOut(200); 
		});
		
		$('#a-tooltip8').hover(function() { 
		    $(this).addClass('show'); 
			$('.fa-remove').fadeIn(200); 
		}, 
		function() { 
		    $(this).removeClass('show'); 
			$('.fa-remove').fadeOut(200); 
		});
   });
   
 
 
 jQuery(function() {                                              // <== Doc ready

    jQuery(".close").hide();                  // Initially hide all buttons

    jQuery('.white-panel').hover(function() {
         jQuery(this).find('.close').fadeIn(300);         // use .find() !
    }, function() {
        jQuery(this).find('.close').fadeOut(300);         // use .find() !
    });
});



;(function ($, window, document, undefined) {
    var pluginName = 'pinterest_grid',
        defaults = {
            padding_x: 10,
            padding_y: 10,
            no_columns: 3,
            margin_bottom: 50,
            single_column_breakpoint: 700
        },
        columns,
        $article,
        article_width;

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {
        var self = this,
            resize_finish;

        $(window).resize(function() {
            clearTimeout(resize_finish);
            resize_finish = setTimeout( function () {
                self.make_layout_change(self);
            }, 11);
        });

        self.make_layout_change(self);

        setTimeout(function() {
            $(window).resize();
        }, 500);
    };

    Plugin.prototype.calculate = function (single_column_mode) {
        var self = this,
            tallest = 0,
            row = 0,
            $container = $(this.element),
            container_width = $container.width();
            $article = $(this.element).children();

        if(single_column_mode === true) {
            article_width = $container.width() - self.options.padding_x;
        } else {
            article_width = ($container.width() - self.options.padding_x * self.options.no_columns) / self.options.no_columns;
        }

        $article.each(function() {
            $(this).css('width', article_width);
        });

        columns = self.options.no_columns;

        $article.each(function(index) {
            var current_column,
                left_out = 0,
                top = 0,
                $this = $(this),
                prevAll = $this.prevAll(),
                tallest = 0;

            if(single_column_mode === false) {
                current_column = (index % columns);
            } else {
                current_column = 0;
            }

            for(var t = 0; t < columns; t++) {
                $this.removeClass('c'+t);
            }

            if(index % columns === 0) {
                row++;
            }

            $this.addClass('c' + current_column);
            $this.addClass('r' + row);

            prevAll.each(function(index) {
                if($(this).hasClass('c' + current_column)) {
                    top += $(this).outerHeight() + self.options.padding_y;
                }
            });

            if(single_column_mode === true) {
                left_out = 0;
            } else {
                left_out = (index % columns) * (article_width + self.options.padding_x);
            }

            $this.css({
                'left': left_out,
                'top' : top
            });
        });

        this.tallest($container);
        $(window).resize();
    };

    Plugin.prototype.tallest = function (_container) {
        var column_heights = [],
            largest = 0;

        for(var z = 0; z < columns; z++) {
            var temp_height = 0;
            _container.find('.c'+z).each(function() {
                temp_height += $(this).outerHeight();
            });
            column_heights[z] = temp_height;
        }

        largest = Math.max.apply(Math, column_heights);
        _container.css('height', largest + (this.options.padding_y + this.options.margin_bottom));
    };

    Plugin.prototype.make_layout_change = function (_self) {
        if($(window).width() < _self.options.single_column_breakpoint) {
            _self.calculate(true);
        } else {
            _self.calculate(false);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);
   
   
   // Enables custom scrollbar
//$('.scrollbox3').enscroll({
//    showOnHover: true,
//    verticalTrackClass: 'track3',
//    verticalHandleClass: 'handle3'
//});


   