var AVEngine = (function(){
	var app = {
		play : function(element , type){
			switch(type){
				case "youtube" : 
					
					break;
				case "vimeo" : 
					var froogaloop = $f(element);
					froogaloop.api('play');
					break;
				case "soundCloud" :
					var widget = SC.Widget(widgetIframe);
					widget.play();
					break;
				case "htmlTag" : 
					var myVideo = element; 
					myVideo.play();
					break;
				default : 
					console.log("Unknown video type : ",type);
					
			}
		},
		pause : function(element , type){
			switch(type){
				case "youtube" : 
				
					break;
				case "vimeo" : 
					var froogaloop = $f(element);
					froogaloop.api('pause');
					break;
				case "soundCloud" :
					var widget = SC.Widget(widgetIframe);
					widget.pause();
					break;
				case "htmlTag" : 
					var myVideo = element; 
					myVideo.pause();
					break;
				default : 
					console.log("Unknown video type : ",type);
					
			}

		},
		mute : function(element , type){
			switch(type){
				case "youtube" : 
					
					break;
				case "vimeo" : 
					var froogaloop = $f(element);
					// Grab the value in the input field
					var volumeVal = 0; //this.querySelector('input').value;
					froogaloop.api('setVolume', volumeVal);
					break;
				case "soundCloud" :
					var widget = SC.Widget(widgetIframe);
					widget.toggle();
					break;
				case "htmlTag" : 
					var myVideo = element; 
					myVideo.pause();
					break;
				default : 
					console.log("Unknown video type : ",type);
					
			}
		}
	};
	return app;
})();