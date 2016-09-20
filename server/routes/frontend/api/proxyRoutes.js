var curlProxyServer = require('../../../controllers/curlProxyController.js');

module.exports = function(router){
	console.log("in proxyRoutes.js",router);
	
	//CORS point 
	router.get('/get_oembed',function(req , res){
		curlProxyServer.get_oembed(req,res);
	});
}