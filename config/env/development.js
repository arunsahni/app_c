/*
* Author - 
* Date - 3 June 2014
* Comments - Sets the environment variable values for the development environment
*/

module.exports = function(){

	//Set the default port to run the app
	process.env.PORT = process.env.PORT || 9100;
	
	//setting global object
	process.globalSettings = {};
	process.urls = {};
	
	process.globalSettings.init__urlLocations = function(){
		process.urls.small__thumbnail = process.urls.small__thumbnail || '100';
		process.urls.SG__thumbnail = process.urls.SG__thumbnail || '300';
		process.urls.medium__thumbnail = process.urls.medium__thumbnail || '600';
		process.urls.large__thumbnail = process.urls.large__thumbnail || '1200';
		process.urls.aspectfit__thumbnail = process.urls.aspectfit__thumbnail || 'aspectfit';
		process.urls.aspectfitSmall__thumbnail = process.urls.aspectfitSmall__thumbnail || 'aspectfit_small';
		
		process.urls.__VIDEO_UPLOAD_DIR = __dirname+'/../../public/assets/Media/video';
	}
	
	process.globalSettings.init__urlLocations();
}
