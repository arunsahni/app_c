//Define Montage Object
var montageObject = (function($){
	var app = {
		init: function(){
			//alert("called---");
			app.initBindEvents();
			app.initMScroller();
		},
		initBindEvents: function(){
			//to hide tray del pop--parul--29dec 2014
			$("#tray_dmedia_delete").hide();
			$(".upload-col").hover(function(){
			$('.upload-button').fadeIn('slow')},
			function(){
				$('.upload-button').fadeOut('slow');
			}); 
			$(".media-col").hover(function(){
				$('.upload-button').fadeIn('slow')},
					function(){
						$('.upload-button').fadeOut('slow');
			}); 


		// function changed by parul
		$('#d-media').click(function(e){
			$(".media-tray").html('');
			$('.gridster_div').css({'display':'none'}); //--18 Dec
			//$('.button-btn').css({'display':'none'}); //--18 Dec
		   // $('.fl-rt').css({'display':'block'}); //--19 Dec
			/*$("#media-tray-elements").find('li').each(function(){
				
			});
			$(".media-tray").append("<ul class='mediatray-list clearfix'>"+"</ul>");
			for(i=0;i<$("#media-tray-elements li").length;i++){
			if (i%2!=0) {
				 data=data+"<div class='media-tray-item'>"+$('#media-tray-elements li').eq(i).html()+"</div>";
			}else{
				var data="<div class='media-tray-item'>"+$('#media-tray-elements li').eq(i).html()+"</div>";
			}
			
			if ((i%2!=0)||i+1==$("#media-tray-elements li").length) {
			$(".media-tray ul").append("<li>"+data+"</li>");	
			}
			}*/
			//$(".media-tray").html('');//--26Dec
			//$(".media-tray").append($('.avatar-widget').html());
			//$(".media-tray").append("<div class='content12' scrollable>"+$('.avatarwdgt').html()+"</div>");
			$(".media-tray").append("<div>"+$('.avatarwdgt').html()+"</div>");
			$('.close_icon').css({'cursor':'pointer'});
			//$('.media-tray').find('a img').unwrap();
			//parul 14012015
			$('.media-tray').find("a img").unwrap();
			$('.media-tray').find("a iframe").unwrap();
			$('.media-tray').find("a span ").unwrap();
			$('.media-tray').find("a div").unwrap();
			//$("#media-tray-elements").html('');commented by parul--29 dec 2014
			//$('.avatar-widget').css({'display':'none'}); //parul 14012015
			$('.avatarwdgt').css({'display':'none'});
			$(".dragable").draggable({revert:'invalid',helper: 'clone'});
			if ($("#media-tray-elements li").length!=0) {
				$(".media-tray").css({"display":"block"});
				//$(".content12").mCustomScrollbar();
			}else{
				$(".media-tray").css({"display":"none"});
				//$("body").css({'padding-top':'191px'});//--26Dec//--- 16 jan 2015 parul
			}
			//moved to pagesetting ctrl
			//if ($("#media-tray-elements li").length!=0) {
			//	$(".media-tray").css({"display":"block"});
			//	var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
			//	bodyHeight=bodyHeight+parseInt(($(".media-tray").css('height')).replace("px",""),10);
			//	$("body").css({'padding-top':bodyHeight+'px'});	
			//}
			
			
			//--check media tray item & dragbox item
		 
			//	if ($("#media-tray-elements li").length!=0 && $('#img-list li').length==0) {
			//	   var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
			//	   bodyHeight=bodyHeight+parseInt(($(".media-tray").css('height')).replace("px",""),10);
			//	   $("body").css({'padding-top':bodyHeight+'px'});
			//	   //alert(bodyHeight);
			//    }
		
			$("#montage_text2").html('');
			$('.avarrow-left').hide();
			$('.avarrow-right').hide();
			$("#mg-list").html('');
			$('#img-list li').remove();
			if (media==true) {
				if ($('.holder_bulb').find('img')) {
					//$('.holder_bulb').find('img').wrap('<p class="innerimg-wrap"></p>');
				}
				/*if ($('.holder_bulb').find(".linkContent").attr('class')) {
					//$('.holder_bulb').find("iframe").remove();
					$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'>"+$('#linkActual').html()+"</span></li>");
					//$('#linkActual').css({'display':'block'});
				}else{
					if ($('.holder_bulb').find('img')) {
						//--check first note/text..gaurav 8jan15..
						if ($('.holder_bulb').find(".notetext").attr('class')) {
							$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'>"+$('.holder_bulb').html()+"</span></li>");
						}else{
							$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'><p class='innerimg-wrap'>"+$('.holder_bulb').html()+"</p></span></li>");
						}
					}else{
						$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'>"+$('.holder_bulb').html()+"</span></li>");
					}
				}*/
				if ($('.holder_bulb').find(".linkContent").attr('class')) {
					//$('.holder_bulb').find("iframe").remove();
					$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'>"+$('#linkActual').html()+"</span></li>");
					//$('#linkActual').css({'display':'block'});
				}else
					if ($('.holder_bulb').find(".linkElement").attr('class')) { //--check first link..gaurav 8jan15..
					$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'>"+$('#linkActual').html()+"</span></li>");
					
				}else{
					if ($('.holder_bulb').find('img').is('img')) {
						//--check first note/text..gaurav 8jan15..
						if ($('.holder_bulb').find(".notetext").attr('class')) {
							$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'>"+$('.holder_bulb').html()+"</span></li>");
						}else{
							/*--15Jan15--*/
							if($('.holder_bulb').find('img').is('img')){
								var orgUrl = $('.holder_bulb').find('img').attr('src');
								var thumbSize = "/img/"+discuss__thumbnail;
								var replaceWith="/img/"+medium__thumbnail;
								newUrl = getResizedThumbnail(orgUrl,thumbSize,replaceWith);
								var url400 = '<img src="'+newUrl+'">';
							}
							/*----*/
							//$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'><p class='innerimg-wrap'>"+$('.holder_bulb').html()+"</p></span></li>");
							$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><p class='innerimg-wrap'>"+url400+"</p></li>");
						}
					}else{//console.log($('.holder_bulb').html());
						//$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'>"+$('.holder_bulb').html()+"</span></li>");
						$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div>"+$('.holder_bulb').html()+"</li>");
					}
				}
			}
			   
				$('.ticked').hide();
			   
				$("#content_2").droppable({
					accept: '.dragable',
					drop: function(event, ui) {
						var trayheight=parseInt(($('.media-tray').css('height')).replace("px",""),10);
						var item = $(ui.draggable);console.log(item);
						if(item.hasClass('makeMeDroppable'))
						{
							return;
						}
						else{
						  if(($('#img-list li').length)<=16){
								 if (item.hasClass('dragable')){
									item.removeClass("dragable");
									item.removeClass("ng-scope");
									item.removeClass("ui-draggable");
								}
							   
								if (($('#img-list li').length)<=5) {
									item.attr({"data-sizex":"1", "data-sizey":"1"}); // 17 Dec
									item.attr({"data-row":"1"});
									item.attr({"data-col":($('#img-list li').length+1)});
									if($('.avatar-name').find("img").length>0){
										item.children("img").addClass("img_set1"+($('#img-list li').length+1));
									}
								}else if(($('#img-list li').length)<=11){
									item.attr({"data-sizex":"1", "data-sizey":"1"}); // 17 Dec
									item.attr({"data-row":"2"});
									item.attr({"data-col":($('#img-list li').length+1)-6});
									item.children("img").addClass("img_set2"+($('#img-list li').length-5));
								}else{
									item.attr({"data-sizex":"1", "data-sizey":"1"}); // 17 Dec
									item.attr({"data-row":"3"});
									item.attr({"data-col":($('#img-list li').length+1)-12});
									item.children("img").addClass("img_set3"+($('#img-list li').length-11));
								}
								//parul 14012015
								//item.find("a img").unwrap();
								//item.find("a iframe").unwrap();
								//item.find("a span ").unwrap();
								//item.find("a div").unwrap();
								//item.find("span").remove();
								item.find("img").addClass("img_set");
								//if (item.find('img')) {
								if (item.find('img').is("img")) {
									
									//item.find('img').wrap("<p class='innerimg-wrap'></p>");
									/*--15Jan15--*/
									var imgStr = item.find('img').attr('src');
									var thumbSize = "/"+small__thumbnail;
									var replaceWith="/"+medium__thumbnail;
									imgStr = getResizedThumbnail(imgStr,thumbSize,replaceWith);
									var itemImg = item.find('img').attr('src',imgStr);
									itemImg.wrap("<p class='innerimg-wrap'></p>");
									/*---------*/
								}
								//item.find("div").removeClass("close_icon");
								//item.find("div").addClass("closemedia pos-r-t");
								$('#img-list').append(item);
								setTimeout(function(){
									if (trayheight!=parseInt(($('.media-tray').css('height')).replace("px",""),10)) {
										//alert('here2')
										if ($('.media-tray ul li').length==0) {
											//alert('here');
											var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
											bodyHeight=bodyHeight-trayheight;
											$("body").css({'padding-top':bodyHeight+'px'});
											$('.media-tray').hide();
										}
										else{
											//alert('there');
											var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
											bodyHeight=bodyHeight-(trayheight-parseInt(($('.media-tray').css('height')).replace("px",""),10));
											$("body").css({'padding-top':bodyHeight+'px'});
										}
									 }
									
									},500)
								if (($('#img-list li').length)==2) {
									$('#img-list').find("li").addClass("col2");
								}else if (($('#img-list li').length)>2) {
									$('#img-list').find("li").addClass("col3");
								}
								
								
								 if ($('.media-tray ul li').length==0) {
										$('.media-tray').hide();
										var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
										bodyHeight=bodyHeight-parseInt(trayheight.replace("px",""),10);
										$("body").css({'padding-top':bodyHeight+'px'});
									}
								// if ($('.media-tray ul li').length==0) {
								//	$('.media-tray').hide();
								// }
								
							}else
							{
								alert("sorry!! you can't add more than 17 images");
							}
							
						}
					}
				});
				$('.s-media').removeClass('active');   
				$('.s-media-con').fadeOut('slow', function(){
				$('.d-media-con').fadeIn('slow');
				});
				$('#media_advanced').fadeOut();
				$(this).addClass('active');
		}); //-- d-media end...
			
			$('#s-media').click(function(e){
			$('.avatarwdgt').css({'display':'block'});
			//added by parul 14012015
			if($('.avatarlist').children().length>5){
				$('.avarrow-left').show();
				$('.avarrow-right').show();	 
			}
			if ($(".media-tray").css("display")!="none") {
				//commented and modifie by parul 14012015
				
				$("body").css({'padding-top':'201px'})
			//var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
			//bodyHeight=bodyHeight-parseInt(($(".media-tray").css('height')).replace("px",""),10);
			//$("body").css({'padding-top':bodyHeight+'px'});
			$(".media-tray").css({"display":"none"});
			}
				
				$('.gridster_div').css({'display':'none'}); //--18 Dec
				//$('.button-btn').css({'display':'none'}); //--18 Dec
				//$('.fl-rt').css({'display':'none'}); //--19 Dec
				$('.d-media').removeClass('active');
				if (media==true) {
			if (media_from=='search') {
				$('.ticked').show();
			}else{
				$('.ticked').hide();
			}
			$('.d-media-con').fadeOut('slow', function(){
				$('#media_advanced').fadeIn('slow');
			});               
				}else{
					$('.d-media-con').fadeOut('slow', function(){
				$('.s-media-con').fadeIn('slow');
				$('.ticked').hide();
					});
				}
				 $(this).addClass('active');
					
			}); //--single end...
			
			//functionality of add another note added by parul
			$('#addNote').click(function(){
			
			//if ($(".media-tray").css("display")!="none") {
			//	var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
			//	bodyHeight=bodyHeight-parseInt(($(".media-tray").css('height')).replace("px",""),10);
			//	$("body").css({'padding-top':bodyHeight+'px'});
			//	$(".media-tray").css({"display":"none"});
			//}
				if($('#montage_text2').val()){
					if(($('#img-list li').length)<=16){
						if(($('#img-list li').length)<=5) {
								var dc=($('#img-list li').length+1);
								var dr=1;
							}else if (($('#img-list li').length)<=11) {
								var dc=($('#img-list li').length-5);
								var dr=2;
							}else{
								var dc=($('#img-list li').length-11);
								var dr=3;
							}
						if ($('#img-list li').length>=2) {
						   
							$('#img-list').append("<li class='col3 notes' data-sizex='1' data-sizey='1' data-row='"+dr+"' data-col='"+dc+"'><div onclick='deleteMedia($(this))' class='close_icon' style='top:0' title='Delete'></div><span class='avtar_list_overlay'></span><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
							$('#img-list li').addClass('col3');
							$('#montage_text2').val('');
						}else if($('#img-list li').length<=1) {
							$('#img-list').append("<li class='col2 notes' data-sizex='1' data-sizey='1' data-row='"+dr+"' data-col='"+dc+"'><div onclick='deleteMedia($(this))' class='close_icon' style='top:0' title='Delete'></div><span class='avtar_list_overlay'></span><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
							$('#img-list li').addClass('col2');
							$('#montage_text2').val('');
						}else{
							$('#img-list').append("<li class='notes' data-sizex='1' data-sizey='1' data-row='"+dr+"' data-col='"+dc+"'><div onclick='deleteMedia($(this))' class='close_icon' style='top:0' title='Delete'></div><span class='avtar_list_overlay'></span><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
							$('#montage_text2').val('');
						}
					}else{
						alert("Sorry you can not add more than 17 items.");
					}
				}
			})
			
		/*--17 Dec--*/
		$('#confirmSend').on('click',function(){
			

			if ($("#img-list li").length<=1&&$("#montage_text2").val()=="") {
				alert("You should select atleast 2 media items to create montage");
			}else{
			//alert("m called---");
			$(".media-tray").html('');//--26Dec
			$(".media-tray").css({'display':'none'});
			$("body").css({'padding-top':'191px'});//--26Dec
			//$("#media-tray-elements").html(''); //commented by parul on 04022015
			// $("#media-icons").hide();

			$('#img-list').find('p img').unwrap();
			//$(".media-tray").css({"display":"none"});
			$('.gridster_div').html('');//added by parul to empty grid_content before appending
			$('.gridster_div').css({'display':'block'}); //--18 Dec
			//$('.button-btn').css({'display':'block'});  //--18 Dec
			//$('#confirmSend').css({'display': 'none'}); //--18 Dec
			//$('#saveMontage').css({'display': 'block'}); //--20 Dec
			//-----------check row & col for text..------//
			if($('#montage_text2').val()!=''){
				
				if (($('#img-list li').length)<=5) {
				// 17 Dec
				var dataCol = $('#img-list li').length+1;		    
				$('#img-list').append("<li class='notes' data-row='1' data-col="+dataCol+" data-sizex='1' data-sizey='1'><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
				
				}else if(($('#img-list li').length)<=11){
				var dataCol = $('#img-list li').length-5;		
				$('#img-list').append("<li class='notes' data-row='2' data-col="+dataCol+" data-sizex='1' data-sizey='1'><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
				}else{
				var dataCol = $('#img-list li').length-11;		
				$('#img-list').append("<li class='notes' data-row='3' data-col="+dataCol+" data-sizex='1' data-sizey='1'><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
				}
			}
				
			//-- add close & setting buttons..
			   $("#img-list li").each(function(){
					if(!$(this).hasClass('notes')){
						$(this).append('<a title="Setting" class="setting_gs closemedia pos-l-t" href="javascript:void(0);" onclick="montageObject.settingElem($(this))"><span class="m-icon settingicon"></span></a>');
						/*-15Jan15-*/
					if($(this).find('img').is('img')){
						var mSrc = $(this).find('img').attr('src');
						var thumbSize = "/"+medium__thumbnail;
						var replaceWith="/"+discuss__thumbnail;
						mSrc = getResizedThumbnail(mSrc,thumbSize,replaceWith);
						$(this).find('img').attr('src',mSrc);
					}
					
					/*--*/
					}
					
					$(this).append('<a title="Close" class="close_gs closemedia pos-r-t" href="javascript:void(0);" onclick="montageObject.deleteElem($(this))"><span class="m-icon closeicon"></span></a>');					
					
					
								   
			    });
			   
			   
				
			   //$("#img-list li").append('<a title="Close" class="close_gs closemedia pos-r-t" href="javascript:void(0);" onclick="montageObject.deleteElem($(this))"><span class="m-icon closeicon"></span></a>');
			  
				  
			   $('#img-list').find('.close_icon').remove();
			   $('#img-list').find('img').removeAttr("width");
			   $('#img-list').find('img').removeAttr("height");
			   
			   $('#img-list').find('li').removeClass("col3");
			   $('#img-list').find('li').removeClass("col2");
			   //$('.gs-resize-handle').remove();
			   var grid_content = $('#img-list').html();
			   
			   /*---------------------------------*/
			   
			   $(".d-media-con").css({'display':'none'});
			   $(".gridster_div").addClass("gridster");
			   $(".gridster_div").append("<ul>"+grid_content+"</ul>");
			   
			   //-- gridster block width & height..
			   var gs_height = 98;
			   var gs_width = 98;
			   
			   $(".gridster ul").gridster({
			   widget_margins: [1, 1],
			   widget_base_dimensions: [gs_width, gs_height],
			   resize: {
				   enabled: true
			   },
			   max_cols:6,
			   //min_rows:3
			   });
				
			}
				/*------*/    
		})

			$(document).keypress(function(e){
				if(e.keyCode==27){
					$(".ui-widget-overlay").fadeOut("slow");
					$(".imagecropp").fadeOut("slow");
				}
			});

			$(".ui-widget-overlay").click(function(){
				$(".ui-widget-overlay").fadeOut("slow");
				$("imagecropp").fadeOut("slow");
			});
		},
		initMScroller: function (){
			//alert("mscroller init---");
			$("#content_1, #content_2, .content12").mCustomScrollbar();
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
			
			//demo fn
			$("a[rel='dialog']").click(function(e){
				e.preventDefault();
				$(".content12").fadeIn("slow",function(){
				var customScrollbar=$(".content12").find(".mCSB_scrollTools");
				customScrollbar.css({"opacity":0});
				$(".content12").mCustomScrollbar("update");
				customScrollbar.animate({opacity:1},"slow");
				});
			});
			
			
			
		},
		/*--start--*/
		deleteElem: function (obj){
			var length_grid = $('.gridster ul li').length;
			if(length_grid>2){
				var gridster = $('.gridster ul').gridster().data('gridster');		
				gridster.remove_widget(obj.parent());  
			}
			return false;			
		},
		
		//-- media pop-up
		settingElem: function (obj){        
			var gs_height = 98;
			var gs_width = 98;
		 window.scrollTo(20, 50);
		//-- gridster block size..
			var sizeX = obj.parent().attr("data-sizex");
			var sizeY = obj.parent().attr("data-sizey");
			
		//-- gridster col & row..
			var data_col = obj.parent().attr("data-col");
			var data_row = obj.parent().attr("data-row");

		//-- media class..        
			var imgsrc = obj.parent().find('img').attr("src");
		   
		//-- media set in pop-up..	
			//$("#grid_background").css({"opacity" : "0.7"}).fadeIn("slow");
			$(".ui-widget-overlay").fadeIn("slow");        
			$(".imagecropp").html("<div id='content12'><div id='content1'><img src='"+imgsrc+"' id='inner' /></div></div><button id='getDimensions' class='i-ico i-ico11'></button>").fadeIn("slow");

		//-- image height & width..
			var imgwidth = obj.parent().find('img').width();
			var imgheight = obj.parent().find('img').height();
			
		//-- pop-up css..			
			var inner_css = { width: imgwidth, height: imgheight, top:imgheight,left:'0px',cursor: 'move'};
			$("#inner").css(inner_css);
			
			var content1_css = { top:'-'+imgheight+'px', left:'-'+imgwidth+'px', width:imgwidth*2, height:imgheight*2,position:'absolute',background:'white'};
			$("#content1").css(content1_css);
			
			var content12_css = { width:gs_width*sizeX, height:gs_height*sizeY, overflow:'hidden', position:'relative'};
			$("#content12").css(content12_css);
			
		//-- image draggable in pop-up..	
			$("#inner").draggable({
					containment: $('#content1')
			});
		
		
		//-- get image dimensions.. 
			$("#getDimensions").on("click", function(){
				var left = $("#inner").css("left");
				var top  = $("#inner").css("top");
				
				var leftarr = left.split('px');
				var toparr  = top.split('px');
				
			//-- set media into gridster after set in pop-up..	
				//var img_left = -parseInt((gs_width/2)*sizeX)+parseInt(leftarr[0]);
				//var img_top  = imgheight-parseInt(toparr[0]);
				
			/*--22Dec--*/
				var img_left = parseInt(imgwidth/2)-parseInt(leftarr[0]);
				var img_top  = imgheight-parseInt(toparr[0]);
				
				var img_set_css = { left:-img_left, top:-img_top};
				obj.parent().find('img').css(img_set_css);
				
				$(".ui-widget-overlay").fadeOut("slow");
				$("#grid_img").fadeOut("slow");
			});
					
			return false;
		},
		deletePadding : function(){
			var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
			bodyHeight=bodyHeight-parseInt(($(".media-tray").css('height')).replace("px",""),10);
			$("body").css({'padding-top':bodyHeight+'px'});
			$(".media-tray").css({"display":"none"});
		},
		
		limitText: function (limitField, limitCount, limitNum) {
			if (limitField.value.length > limitNum) {
				limitField.value = limitField.value.substring(0, limitNum);
			} else {
				limitCount.value = limitNum - limitField.value.length;
			}
		},
		// function to view montage items
		// added by parul 24 dec 
		//called from index.js and scripts.js
		
		gsView: function (obj1) {
			var list_length = 0;
			monIndex=obj1.index();
			if ($('.holder-act').css('display') == 'none') {
				list_length = $('#holder-box li').length;
			}else{
				list_length = $('.holder_bulb li').length;
			}
			obj = obj1.clone();
			//list_length = $('#holder-box li').length;
			console.log('---------list length-------'+list_length);
			console.log('---------index--------------'+monIndex);
			$('#overlayContent').html('');
			$('#overlay').css({'display':'block'});
			if (obj.find(".linkContent").attr('class')) {
				var data=obj.find('.linkContent').html();
				data = data.replace("less","<");
				data = data.replace("greater",">");
				$('#overlayContent').append(data);
			}else if (obj.find(".noteContent").attr('class')) {
				var data=obj.find('.noteContent').html();
				data = data.replace(/@less@/g,"<");
				data = data.replace(/gre@ter/g,">");
				data = data.replace("less","<");
				data = data.replace("greater",">");
				if (data.indexOf('&lt') != -1) {
					$('#overlayContent').html($('<div/>').html(data).text());
				}else{
					$('#overlayContent').html('<div class="overlay-text-cont">'+data+'</div>');
				}
			}
			else if (obj.find(".videoContent").attr('class')) {
				//$('#overlayContent').html('<video id="videoID" class="media_video" controls ><'+obj.find('.videoContent').html()+'></video><a onClick="btnReplay()">Replay</a>');
				$('#overlayContent').html('<video id="videoID" class="media_video" controls ><'+obj.find('.videoContent').html()+'></video>');
				console.log($('#overlayContent').html());
				var whichBrowser = BrowserDetecter.whichBrowser();
				var videoSrc = $('#overlayContent').find('source').attr('src');
				//alert(videoSrc);
				var ext = videoSrc.split('.').pop();
				
				if (whichBrowser == "FireFox") {
				  if ( ext.toUpperCase() != 'WEBM' ) {
					videoSrc = videoSrc.replace('.'+ext,'.webm');
				  }
				}
				else if (whichBrowser == 'Safari') {
				  if ( ext.toUpperCase() != 'MP4' ) {
					videoSrc = videoSrc.replace('.'+ext,'.mp4');	
				  }
				}
				else{
				  if ( ext.toUpperCase() != 'MP4' ) {
					videoSrc = videoSrc.replace('.'+ext,'.mp4');	
				  }
				}
				$('#overlayContent').find('source').attr('src', videoSrc);
				
				var ext = videoSrc.split('.').pop();
				$('.s-media-con').hide();
				$('.d-media-con').hide();
				media_type="text";
			}
			else{
				obj.find("span img").unwrap();
				obj.find("img").wrap('<div class="image-avatar"><span class="image-avatar-span"></span></div>')
				//alert(obj.index());
				// added by parul 13012015
				$('#overlayContent').append(obj.html());
			}
			$('#overlayContent').append('<a id="closeBtn" onclick="montageObject.closeOverlay()"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span></a><a onClick="monPrev()" id="mon_prev" class="prev-m trans navarrow-left"><span class="i-ico i-prev"></span></a><a id="mon_next" onClick="monNext()" class="next-m trans navarrow-right"><span class="i-ico i-next"></span></a>');
			if (monIndex==(list_length-1)) {
				$('#mon_next').css({'display':'none'})
				$('#mon_prev').css({'display':'block'})
			}
			else if (monIndex == 0) {
				$('#mon_prev').css({'display':'none'})
				$('#mon_next').css({'display':'block'})
			}else{
				$('#mon_prev').css({'display':'block'})
				$('#mon_next').css({'display':'block'})
				$('#mon_prev').attr({'onClick':'monPrev()'})
				$('#mon_next').attr({'onClick':'monNext()'})
			}
			$('#overlayContent').css({'display':'block'});
		},
		
		/*
		gsView: function (obj) {
			//parul 07042015
			var list_length = 0;
			//if ($('.holder-act').css('display') == 'none') {
			list_length = $('#holder-box li').length;
			//}else{
				//list_length = $('.holder_bulb ul li').length;
			//}
			// END parul 07042015
			monIndex=obj.index();
			
			$('#overlayContent').html('');
			$('#overlay').css({'display':'block'});
			
			obj.find('img').attr('height','auto');
			obj.find('img').attr('width','700px');
			if (obj.find(".linkContent").attr('class')) {
				//$('.media-row').hide()
				var data=obj.find('.linkContent').html();
				data = data.replace("less","<");
				data = data.replace("greater",">");
				//alert(data);
				$('#overlayContent').append(data);
				//$('.holder_bulb').append($('<div/>').html(data).text());
				//alert($('.holder_bulb').html());
			}else{
				//obj.find('innerimg-wrap').attr('class').remove();
				
				obj.find('.innerimg-wrap').remove();
				//alert(1);
				obj.find("span img").unwrap();
				obj.find("img").wrap('<div class="image-avatar"><span class="image-avatar-span"></span></div>')
				//alert(obj.index());
				
				// added by parul 13012015
				$('#overlayContent').append(obj.html());
			}
			$('#overlayContent').append('<a id="closeBtn" onclick="montageObject.closeOverlay()"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span></a><a onClick="monPrev()" id="mon_prev" class="prev-m trans navarrow-left"><span class="i-ico i-prev"></span></a><a id="mon_next" onClick="monNext()" class="next-m trans navarrow-right"><span class="i-ico i-next"></span></a>');
			//if (monIndex==$('.holder_bulb ul li').length-1) {
			if (monIndex==(list_length-1)) {
				//$('#mon_next').css({'cursor':'not-allowed'})
				//$('#mon_prev').css({'cursor':'pointer'})
				//$('#mon_next').removeAttr('onClick')
				$('#mon_next').css({'display':'none'})
				$('#mon_prev').css({'display':'block'})
				//$('#mon_next').removeAttr('onClick')
			}
			//else if (monIndex==0) {
			else if (monIndex == 0) {
				//$('#mon_prev').css({'cursor':'not-allowed'})
				//$('#mon_prev').removeAttr('onClick')
				//$('#mon_next').css({'cursor':'pointer'})
				$('#mon_prev').css({'display':'none'})
				$('#mon_next').css({'display':'block'})
			}else{
				$('#mon_prev').css({'display':'block'})
				$('#mon_next').css({'display':'block'})
				$('#mon_prev').attr({'onClick':'monPrev()'})
				$('#mon_next').attr({'onClick':'monNext()'})
			}
			$('#overlayContent').css({'display':'block'});
		},
		*/
		closeOverlay: function (){
			$('#overlay').css({'display':'none'});
			$('#overlayContent').css({'display':'none'});
			if($('#overlayContent').find('iframe').is('iframe')){
				$('#overlayContent').find('iframe').remove(); /* sound continues to play after close popup 23Jan2015*/	
			}
			
		}
	}
	return app;
})(jQuery);
/*________________________________________________________________________
	* @Date:      	16 Jan 2015
	* @Method :   	getResizedThumbnail
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used for Check media Thumbnails.
	* @Param:     	3
	* @Return:    	Yes
_________________________________________________________________________
*/                                            
function getResizedThumbnail(url,thumbSize,replaceWith){
	//alert('functioncalled');
    if(url!='' && thumbSize!=''){
        var newUrl = url;
        var n = newUrl.search(thumbSize);
        if(n>=0){
			newUrl = newUrl.replace(thumbSize, replaceWith);
			//alert('1='+newUrl);
            return newUrl;
        }else{
			//alert('2='+newUrl);
            return newUrl;
        }        
    }else{
		//alert('3='+newUrl);
        return url;
    }    
}

//End Montage Object definition