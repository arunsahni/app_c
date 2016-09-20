var member = require('../../../controllers/memberController.js');
module.exports = function(router){
	console.log("in memberRoutes.js",router);
	router.get('/',function(req,res){
		member.allFriends(req,res);
        //board.findAll(req,res);
	});
    
	router.post('/',function(req,res){
		member.allFriendsPaginated(req,res);
        //board.findAll(req,res);
	});
	
	router.post('/excludeMembers',function(req,res){
		member.excludeMembers(req,res);
	});
	
    router.post('/allFriendsStartingWith',function(req,res){
		member.allFriendsStartingWith(req,res);
        //board.findAll(req,res);
	});
    
    router.post('/addFriend',function(req,res){
        member.addFriend(req,res); 
	});
    
     router.post('/removeFriend',function(req,res){
        member.removeFriend(req,res); 
	});
    
    
}