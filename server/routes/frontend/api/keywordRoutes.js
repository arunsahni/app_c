var keywords = require('../../../controllers/keywordManagementController.js');

module.exports = function( router ){
	
	router.post('/parse',function(req,res){
		keywords.keywordParsar(req,res);
	});
}