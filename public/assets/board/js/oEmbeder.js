var oEmbeder = (function($){
	var app = {
		init: function(){
			//app.get__oEmbedProviders();
			//app.get__MatchedoEmbedProvider();
		},
		get__oEmbedProviders: function(){
			return oEmbedProviders = 
				[
					{
						Host : "ifttt.com",
						ApiEndPoint : "http://www.ifttt.com/oembed",
					},
					{
						Host : "youtube.com",
						ApiEndPoint : "http://www.youtube.com/oembed",
					},
					{
						Host : "flickr.com",
						ApiEndPoint : "https://www.flickr.com/services/oembed.json",
					},
					{
						Host : "flic.kr",
						ApiEndPoint : "https://www.flickr.com/services/oembed.json",
					},
					{
						Host : "viddler.com",
						ApiEndPoint : "http://www.viddler.com/oembed",
					},
					{
						Host : "revision3.com",
						ApiEndPoint : "http://revision3.com/api/oembed",
					},
					{
						Host : "hulu.com",
						ApiEndPoint : "http://www.hulu.com/api/oembed.json",
					},
					{
						Host : "vimeo.com",
						ApiEndPoint : "http://vimeo.com/api/oembed.json",
					},
					{
						Host : "collegehumor.com",
						ApiEndPoint : "http://www.collegehumor.com/oembed.json",
					},
					{
						Host : "jest.com",
						ApiEndPoint : "http://www.jest.com/oembed.json",
					},
					{
						Host : "polleverywhere.com",
						ApiEndPoint : "http://www.polleverywhere.com/services/oembed",
					},
					{
						Host : "iFixit.com",
						ApiEndPoint : "http://www.ifixit.com/Embed",
					},
					{
						Host : "smugmug.com",
						ApiEndPoint : "http://api.smugmug.com/services/oembed",
					},
					{
						Host : "deviantart.com",
						ApiEndPoint : "http://backend.deviantart.com/oembed",
					},
					{
						Host : "slideshare.net",
						ApiEndPoint : "http://www.slideshare.net/api/oembed/2",
					},
					{
						Host : "wordpress.com",
						ApiEndPoint : "http://public-api.wordpress.com/oembed",
					},
					{
						Host : "chirb.it",
						ApiEndPoint : "http://chirb.it/oembed.json",
					},
					{
						Host : "nfb.ca",
						ApiEndPoint : "http://www.nfb.ca/remote/services/oembed",
					},
					{
						Host : "scribd.com",
						ApiEndPoint : "http://www.scribd.com/services/oembed",
					},
					{
						Host : "dotsub.com",
						ApiEndPoint : "http://dotsub.com/services/oembed",
					},
					{
						Host : "animoto.com",
						ApiEndPoint : "https://animoto.com/oembeds/create",
					},
					{
						Host : "rdio.com",
						ApiEndPoint : "http://www.rdio.com/api/oembed",
					},
					{
						Host : "mixcloud.com",
						ApiEndPoint : "https://www.mixcloud.com/oembed",
					},
					{
						Host : "clyp.it",
						ApiEndPoint : "http://api.clyp.it/oembed",
					},
					{
						Host : "screenr.com",
						ApiEndPoint : "http://www.screenr.com/api/oembed.json",
					},
					{
						Host : "funnyordie.com",
						ApiEndPoint : "http://www.funnyordie.com/oembed.json",
					},
					{
						Host : "polldaddy.com",
						ApiEndPoint : "http://polldaddy.com/oembed",
					},
					{
						Host : "ted.com",
						//ApiEndPoint : "http://www.ted.com/talks/oembed.json",
						ApiEndPoint : "http://www.ted.com/services/v1/oembed.json"
					},
					{
						Host : "videojug.com",
						ApiEndPoint : "http://www.videojug.com/oembed.json",
					},
					{
						Host : "videos.sapo.pt",
						ApiEndPoint : "http://rd3.videos.sapo.pt/oembed",
					},
					{
						Host : "official.fm",
						ApiEndPoint : "http://official.fm/services/oembed.json",
					},
					{
						Host : "huffduffer.com",
						ApiEndPoint : "https://huffduffer.com/oembed",
					},
					{
						Host : "shoudio.com",
						ApiEndPoint : "https://shoudio.com/api/oembed",
					},
					{
						Host : "mobypicture.com",
						ApiEndPoint : "http://api.mobypicture.com/oEmbed",
					},
					{
						Host : "23hq.com",
						ApiEndPoint : "http://www.23hq.com/23/oembed",
					},
					{
						Host : "cacoo.com",
						ApiEndPoint : "http://cacoo.com/oembed.json",
					},
					{
						Host : "dipity.com",
						ApiEndPoint : "http://www.dipity.com/oembed/timeline",
					},
					{
						Host : "roomshare.jp",
						ApiEndPoint : "http://roomshare.jp/en/oembed.json",
					},
					{
						Host : "dailymotion.com",
						ApiEndPoint : "http://www.dailymotion.com/services/oembed",
					},
					{
						Host : "crowdranking.com",
						ApiEndPoint : "http://crowdranking.com/api/oembed.json",
					},
					{
						Host : "circuitlab.com",
						ApiEndPoint : "https://www.circuitlab.com/circuit/oembed",
					},
					{
						Host : "quiz.biz",
						ApiEndPoint : "http://www.quiz.biz/api/oembed",
					},
					{
						Host : "quizz.biz",
						ApiEndPoint : "http://www.quizz.biz/api/oembed",
					},
					{
						Host : "coub.com",
						ApiEndPoint : "http://coub.com/api/oembed.json",
					},
					{
						Host : "speakerdeck.com",
						ApiEndPoint : "https://speakerdeck.com/oembed.json",
					},
					{
						Host : "alpha.app.net",
						ApiEndPoint : "https://alpha-api.app.net/oembed",
					},
					{
						Host : "blip.tv",
						ApiEndPoint : "http://blip.tv/oembed",
					},
					{
						Host : "yfrog.com",
						ApiEndPoint : "http://www.yfrog.com/api/oembed",
					},
					{
						Host : "yfrog.us",
						ApiEndPoint : "http://www.yfrog.com/api/oembed",
					},
					{
						Host : "instagram.com",
						ApiEndPoint : "http://api.instagram.com/oembed",
					},
					{
						Host : "instagr.am",
						ApiEndPoint : "http://api.instagram.com/oembed",
					},
					{
						Host : "soundcloud.com",
						ApiEndPoint : "https://soundcloud.com/oembed.json",
					},
					{
						Host : "on.aol.com",
						ApiEndPoint : "http://on.aol.com/api",
					},
					{
						Host : "kickstarter.com",
						ApiEndPoint : "http://www.kickstarter.com/services/oembed",
					},
					{
						Host : "ustream.tv",
						ApiEndPoint : "http://www.ustream.tv/oembed",
					},
					{
						Host : "ustream.com",
						ApiEndPoint : "http://www.ustream.tv/oembed",
					},
					{
						Host : "gmep.org",
						ApiEndPoint : "https://gmep.org/oembed.json",
					},
					{
						Host : "dailymile.com",
						ApiEndPoint : "http://api.dailymile.com/oembed",
					},
					{
						Host : "sketchfab.com",
						ApiEndPoint : "http://sketchfab.com/oembed",
					},
					{
						Host : "meetup.com",
						ApiEndPoint : "https://api.meetup.com/oembed",
					},
					{
						Host : "meetu.ps",
						ApiEndPoint : "https://api.meetup.com/oembed",
					},
					{
						Host : "videofork.com",
						ApiEndPoint : "http://videofork.com/oembed",
						//Not in use- Domain is on sale
					},
					{
						Host : "audiosnaps.com",
						ApiEndPoint : "http://audiosnaps.com/service/oembed",
					},
					{
						Host : "edocr.com",
						ApiEndPoint : "http://edocr.com/api/oembed",
					},
					{
						Host : "rapidengage.com",
						ApiEndPoint : "https://rapidengage.com/api/oembed",
					},
					{
						Host : "ora.tv",
						ApiEndPoint : "https://www.ora.tv/oembed"
					},
					{
						Host : "gettyimages.com", //working
						ApiEndPoint : "http://embed.gettyimages.com/oembed",
					},
					{
						Host : "live.amcharts.com",
						ApiEndPoint : "http://live.amcharts.com/oembed",
					},
					{
						Host : "isnare.com",
						ApiEndPoint : "http://www.isnare.com/oembed",
					},
					{
						Host : "wistia.com", //working
						ApiEndPoint : "https://fast.wistia.com/oembed"
					},
					{
						Host : "wi.st", //working
						ApiEndPoint : "https://fast.wistia.com/oembed"
					},
					{
						Host : "issuu.com",	//working
						ApiEndPoint : "http://issuu.com/oembed"
						
					},
					{
						Host:"etsy.com",
						ApiEndPoint:"http://openapi.etsy.com/svc/oembed"
						
					}
				];
				
		},
		get__MatchedoEmbedProvider : function( url ){
			//alert("get__MatchedoEmbedProvider called");
			var oEmbedProviders = [];
			var error_obj = {};
			
			oEmbedProviders = this.get__oEmbedProviders();
			//alert("Total oEmbedProviders = "+oEmbedProviders.length);
			var ret__obj = {};
			
			//host found --- continue match with available oEmbedProviders;
			var matchedObject = {};
			
			for( var loop = 0; loop < oEmbedProviders.length; loop++ ){
				var idx = {};
				idx.Host = oEmbedProviders[loop].Host;
				idx.ApiEndPoint = oEmbedProviders[loop].ApiEndPoint;
				//alert("matching : "+'/'+idx.Host+'/gi');
				//alert("matched return value = "+url.match('/'+idx.Host+'/gi')+" -----url = "+url);
				var regex = new RegExp(idx.Host , 'gi');
				
				if( (url.match(regex) != null) ){ 
					//alert("matched object = "+JSON.stringify(idx));
					ret__obj = idx;
					break;
				}
				else{
					//alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");
					//return false;
					ret__obj = {};
				}
			}
			
			//alert("return value = "+ret__obj);
			return ret__obj;
		},
		match__WithProviders : function( URL__host ){
			if( (url.match(/vimeo.com/gi) != null) ){ 
				var vimeo_url = '';
				if(url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) == null) {
					//alert("iframe == null")
					// code for Vimeo
					var op = url.split(/[/]+/).pop();
					varvimeoIframe = '<iframe src="//player.vimeo.com/video/'+ op +'?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=ff0179" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
					$scope.link.content = varvimeoIframe;
					
					//getting thumbnail
					if( url.match(/vimeo.com/gi) != null ){
						$scope.link.thumbnail = '';
						vimeo_url = url;
						console.log("vimeo_url = ",vimeo_url);
						$scope.vimeo_thumb(vimeo_url);
						console.log("Got thumbnail from youtube drag-drop = ",$scope.link.thumbnail);
					}
					else{
						alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
					}
					
				}
				else if( url.match(/^(<iframe)(.*?)(<\/iframe>)(.*?)$/) != null ) {
					//alert("iframe != null")
					$scope.link.thumbnail = '';
					var srcUrl = '';
					//get src of the vimeo iframe
					var res = url.split("src=");
					var res2 = res[1].split('"');
					srcUrl = res2[1]
					vimeo_url = srcUrl;
					$scope.vimeo_thumb(vimeo_url);
				}
				else{
					alert("Unknown case - Error! Please drag and drop videos from youtube.com, vimeo.com or web-images.");return false;
				}
				
			}
		}
	}
	return app;
})(jQuery);

jQuery(document).ready(function(){
    oEmbeder.init();

});