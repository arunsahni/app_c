/*
* Author - Dipin Behl
* Date - 3 June 2014
* Comments - Sets the environment variable values for the production environment
*/

module.exports = function(){
        //Set the default port to run the app
        process.env.PORT = process.env.PORT || 9090;
		
		//setting global object
		process.globalSettings = {};
		process.globalSettings.init__urlLocations = function(){
			process.urls.small__thumbnail = 'small';
			process.urls.medium__thumbnail = 'medium';
			process.urls.large__thumbnail = 'large';
		}
		process.globalSettings.init__urlLocations();
}
