/*
Comments - Loads custom middle-wares for the application.
*/

module.exports = function(router){
	
	//1) authentication middle-ware
	//Loading custom middle-ware to check the session with each request
	var checkAdminSession = require('./middlewares/checkSubAdminSession.js');
	router.use(checkAdminSession);
}