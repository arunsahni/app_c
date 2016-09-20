var BrowserDetecter = (function($){
	var app = {
		init: function(){
			//app.get__oEmbedProviders();
			//app.get__MatchedoEmbedProvider();
		},
		whichBrowser: function(){
            //Check if browser is IE or not
            if (navigator.userAgent.search("MSIE") >= 0) {
                //alert("Browser is InternetExplorer");
                return "InternetExplorer";
            }
            //Check if browser is Chrome or not
            else if (navigator.userAgent.search("Chrome") >= 0) {
                //alert("Browser is Chrome");
                return "Chrome";
            }
            //Check if browser is Firefox or not
            else if (navigator.userAgent.search("Firefox") >= 0) {
                //alert("Browser is FireFox");
                return "FireFox";
            }
            //Check if browser is Safari or not
            else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                //alert("Browser is Safari");
                return "Safari";
            }
            //Check if browser is Opera or not
            else if (navigator.userAgent.search("Opera") >= 0) {
                //alert("Browser is Opera");
                return "Opera";
            }
            else{
                return 0;
                
            }
        }	
	}
	return app;
})(jQuery);

jQuery(document).ready(function(){
    BrowserDetecter.init();

});