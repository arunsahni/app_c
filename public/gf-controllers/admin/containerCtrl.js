var collabmedia = angular.module('collabmedia');
collabmedia.controller('containerCtrl',function($scope,$rootScope){
	//alert('containerCtrl');
        $rootScope.loggedIn=false;
	//-------------------------- for theme and links ==> STARTS---------------->
	//highlight current / active link
	$('ul.main-menu li a').each(function(){
		if($($(this))[0].href==String(window.location))
			$(this).parent().addClass('active');
	});
	
	//themes, change CSS with JS
	//default theme(CSS) is cerulean, change it if needed
	var current_theme = $.cookie('current_theme')==null ? 'cerulean' :$.cookie('current_theme');
	//alert(current_theme);
	switch_theme(current_theme);
	
	$('#themes a[data-value="'+current_theme+'"]').find('i').addClass('icon-ok');
				 
	$('#themes a').click(function(e){
		//alert('hi');
		e.preventDefault();
		current_theme=$(this).attr('data-value');
		$.cookie('current_theme',current_theme,{expires:365});
		switch_theme(current_theme);
		$('#themes i').removeClass('icon-ok');
		$(this).find('i').addClass('icon-ok');
	});
	
	
	function switch_theme(theme_name)
	{
		//alert('switch_theme');
		$('#bs-css').attr('href','../assets/charisma/css/bootstrap-'+theme_name+'.css');
	}
	
	//-------------------------- for theme and links ==> STARTS---------------->
});