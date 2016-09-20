var board = require('../../../controllers/boardController.js');
module.exports = function(router){
	console.log("in userRoutes.js",router);
	
	router.post('/',function(req,res){
		board.addBoardMediaToBoard(req,res);	
	})
}