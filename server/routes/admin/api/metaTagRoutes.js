var metaMetaTags = require('../../../controllers/metaMetaTagsController.js');
module.exports = function(router){
	console.log("in userRoutes.js",router);
	
	router.post('/view', function(req,res){
		metaMetaTags.findMeta(req,res);
	})
	router.post('/add', function(req,res){
		metaMetaTags.addMeta(req,res);
	})
	router.post('/edit', function(req,res){
		metaMetaTags.editMeta(req,res);
	})
	router.post('/delete', function(req,res){
		metaMetaTags.deleteMeta(req,res);
	})
}