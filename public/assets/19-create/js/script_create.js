
function startupCreate(){
	createModule = (function($){
        var app = {
            init: function(){
				
            },
			checkAll : function(obj){
				if (obj.prop('checked')) {
					obj.parent().parent().parent().find('.type').prop('checked',true);
				}else{
					obj.parent().parent().parent().find('.type').prop('checked',false);
				}
			},
			initSlider:function(){
				//var setWidth = ($('#keyword_slider ul li').length)*50 +$('#keyword_slider ul').width();
				//$('#keyword_slider ul').width(setWidth);
				//$('#keyword_slider').lemmonSlider({'loop':false});
			}
        }
        return app;
    })(jQuery);
}