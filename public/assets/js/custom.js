$(document).ready(function(){
	$(".textarea").live("keypress", function(){
		//alert($(this).attr("rows"));
	var myRows=	$(this).attr("rows");
		$(".textarea").closest(".simform-inner").find("textarea").attr("rows",myRows);
	});
	
	
});