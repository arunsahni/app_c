// added by parul 20141211
$(document).ready(function(){
	
	
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
	
		$('.gridster_div').css({'display':'none'}); //--18 Dec
		$('.button-btn').css({'display':'none'}); //--18 Dec
		$('.fl-rt').css({'display':'block'}); //--19 Dec
//            $("#media-tray-elements").find('li').each(function(){
//			
//			});
		//$(".media-tray").append("<ul class='mediatray-list clearfix'>"+"</ul>");
		//for(i=0;i<$("#media-tray-elements li").length;i++){
		//	if (i%2!=0) {
		//		 data=data+"<div class='media-tray-item'>"+$('#media-tray-elements li').eq(i).html()+"</div>";
		//	}else{
		//		var data="<div class='media-tray-item'>"+$('#media-tray-elements li').eq(i).html()+"</div>";
		//	}
		//	
		//	
		//	if ((i%2!=0)||i+1==$("#media-tray-elements li").length) {
		//	$(".media-tray ul").append("<li>"+data+"</li>");	
		//	}
		//}
		$(".media-tray").append($('.avatar-widget').html());
		$("#media-tray-elements").html('');
		$(".dragable").draggable({revert:'invalid',helper: 'clone'});
		if ($("#media-tray-elements li").length!=0) {
			$(".media-tray").css({"display":"block"});
		}else{
			$(".media-tray").css({"display":"none"});
		}
		
		$(".media-tray").css({"display":"block"});
		var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
		bodyHeight=bodyHeight+parseInt(($(".media-tray").css('height')).replace("px",""),10);
		$("body").css({'padding-top':bodyHeight+'px'});
		$("#montage_text2").html('');
		$('.avarrow-left').hide();
		$('.avarrow-right').hide();
		$("#mg-list").html('');
		$('#img-list li').remove();
		if (media==true) {
			if ($('.holder_bulb').find('img')) {
				$('.holder_bulb').find('img').wrap('<p class="innerimg-wrap"></p>');
			}
			$('#img-list').append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'><div title='Delete' style='top:0' class='close_icon' onclick='deleteMedia($(this))'></div><span class='avatar-name'><p>"+$('.holder_bulb').html()+"</p></span></li>")
		}
	   
		$('.ticked').hide();
	   
		$("#content_2").droppable({
			accept: '.dragable',
			drop: function(event, ui) {
				var item = $(ui.draggable);
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
						item.find("a img").unwrap();
						item.find("a iframe").unwrap();
						item.find("a span ").unwrap();
						item.find("a div").unwrap();
						//item.find("span").remove();
						item.find("img").addClass("img_set");
						if (item.find('img')) {
							//alert('here');
							item.find('img').wrap("<p class='innerimg-wrap'></p>");
						}
						//item.find("div").removeClass("close_icon");
						//item.find("div").addClass("closemedia pos-r-t");
						$('#img-list').append(item);
						if (($('#img-list li').length)==2) {
							$('#img-list').find("li").addClass("col2");
						}else if (($('#img-list li').length)>2) {
							$('#img-list').find("li").addClass("col3");
						}
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
	});
	
	$('#s-media').click(function(e){
		if ($(".media-tray").css("display")!="none") {
			var bodyHeight=parseInt(($("body").css('padding-top')).replace("px",""),10);
			bodyHeight=bodyHeight-parseInt(($(".media-tray").css('height')).replace("px",""),10);
			$("body").css({'padding-top':bodyHeight+'px'});
			$(".media-tray").css({"display":"none"});
		}
		
		$('.gridster_div').css({'display':'none'}); //--18 Dec
		$('.button-btn').css({'display':'none'}); //--18 Dec
		$('.fl-rt').css({'display':'none'}); //--19 Dec
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
			
	});
	
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
	$('#confirmSend').click(function(){
		$('#img-list').find('p img').unwrap();
		alert($("#img-list li").length);
		if ($("#img-list li").length<=1&&$("#montage_text2").val()=="") {
			alert("You should select atleast 2 media items to create montage");
		}else{
		$(".media-tray").css({"display":"none"});
		//var bodyHeight=
		$('.gridster_div').css({'display':'block'}); //--18 Dec
		$('.button-btn').css({'display':'block'});  //--18 Dec
	$('#confirmSend').css({'display': 'none'}); //--18 Dec
		$('#saveMontage').css({'display': 'block'}); //--20 Dec
	//-----------check row & col for text..------//
	if($('#montage_text2').val()!=''){
	
	if (($('#img-list li').length)<=5) {
		// 17 Dec
		var dataCol = $('#img-list li').length+1;		    
		$('#img-list').append("<li data-row='1' data-col="+dataCol+" data-sizex='1' data-sizey='1'><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
		
	}else if(($('#img-list li').length)<=11){
		var dataCol = $('#img-list li').length-5;		
		$('#img-list').append("<li data-row='2' data-col="+dataCol+" data-sizex='1' data-sizey='1'><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
	}else{
		var dataCol = $('#img-list li').length-11;		
		$('#img-list').append("<li data-row='3' data-col="+dataCol+" data-sizex='1' data-sizey='1'><span class='avatar-name'><p>"+$('#montage_text2').val()+"</p></span></li>");
	}
	}
		
	 //-- add close & setting buttons..
		$("#img-list li").append('<a title="Setting" class="setting_gs closemedia pos-l-t" href="javascript:void(0);" onclick="settingElem($(this))"><span class="m-icon settingicon"></span></a>');
	$("#img-list li").append('<a title="Close" class="close_gs closemedia pos-r-t" href="javascript:void(0);" onclick="deleteElem($(this))"><span class="m-icon closeicon"></span></a>');
	   
		   
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
			min_rows:3
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
	
});
	 
/*--start--*/
function deleteElem(obj){
var gridster = $('.gridster ul').gridster().data('gridster');		
gridster.remove_widget(obj.parent());        
	return false;			
}

//-- media pop-up
function settingElem(obj){        
	var gs_height = 98;
	var gs_width = 98;

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
		alert('sssss');
	   
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
}
/*--end-*/


/*Script block-2*/

function limitText(limitField, limitCount, limitNum) {
	if (limitField.value.length > limitNum) {
		limitField.value = limitField.value.substring(0, limitNum);
	} else {
		limitCount.value = limitNum - limitField.value.length;
	}
}
// function to view montage items
// added by parul 24 dec 2014
function gsView(obj) {
	$('#overlayContent').html('');
	//alert('clear console');
	$('#overlay').css({'display':'block'});
	//console.log()
	obj.find('img').attr('height','auto');
	obj.find('img').attr('width','700px');
	$('#overlayContent').append(obj.html());
	$('#overlayContent').append('<a id="closeBtn" onclick="closeOverlay()"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span></a>');
	$('#overlayContent').css({'display':'block'});
}
function closeOverlay(){
	$('#overlay').css({'display':'none'});
	$('#overlayContent').css({'display':'none'});
}

// end
/*Script block-2*/

!window.jQuery && document.write(unescape('%3Cscript src="js/minified/jquery-1.9.1.min.js"%3E%3C/script%3E'))

(function($){
		
	$(window).load(function(){
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
	});
})(jQuery);