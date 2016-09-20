var user = require('./../models/userModel.js');
var group = require('./../models/groupModel.js');
var friend = require('./../models/friendsModel.js');
/*
* the purpose of this function is to check if two person are friends already
*/

function checkFriendship(email){
    friend.find({'UserID': req.session.user._id,'Friend.Email':email,Status:1,IsDeleted:0},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            console.log('here');
            if (data.length>0) {
                return 'friends';
            }else{
                return 'not friends';
            }
        }
    })
}


/*
* the purpose of this function is to check if email provided by user is registered or not
*/

function checkUser(email){
    user.findOne({Email:email},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            console.log(data);
            return data;
        }
    })
}






/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		addFriend
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
___________________________________________________________________________
*/

var addFriend = function(req,res){
    user.findOne({Email:{ $regex : new RegExp(req.body.email, "i") }},function(err,frndData){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            var IsRegistered = false;
            if (frndData != undefined && frndData != null) {
                IsRegistered = true;
            }else{
                IsRegistered = false;
                //console.log('not registered');
                //res.json({'code':401,msg:'user not registered'});
            }
            friend.find({'UserID': req.session.user._id,'Friend.Email':{ $regex : new RegExp(req.body.email, "i") },Status:1,IsDeleted:0},function(err,data){
                if (err) {
                    res.json({'code':404,'error':err});
                }else{
                    console.log(data);
                    if (data.length == 0) {
                        console.log('saving data');
                        var rel = req.body.relation;
                        rel = rel.split('~');
                        var newFriendData = {};
                        newFriendData.IsRegistered = IsRegistered;
                        if ( IsRegistered ) {
                            newFriendData.ID = frndData._id;
                            newFriendData.Pic =  frndData.ProfilePic;
                            newFriendData.NickName =  frndData.NickName;
                        }
                        
                        newFriendData.Email = req.body.email;
                        newFriendData.Name = IsRegistered ? frndData.Name : req.body.name;
                        newFriendData.Relation =  rel[0].trim();
                        newFriendData.RelationID =  rel[1].trim();
                        
                        var friendship = new friend();
                        friendship.UserID = req.session.user._id;
                        friendship.Friend = newFriendData;
                        friendship.Status = 1;
                        friendship.IsDeleted = 0;
                        friendship.CreatedOn = Date.now();
                        friendship.ModifiedOn = Date.now();
                        friendship.save(function(err,data){
                            if (err) {
                                res.json(err);
                            }else{
                                res.json({'code':200,msg:'data saved'});
                            }
                        });
                    }else{
                        console.log('already friend');
                        res.json({'code':400,msg:'Already a friend'});
                    }
                }
            });
            
        }
    })
}
/*
var addFriend_old = function(req,res){
    //var email = new regex
    user.findOne({Email:{ $regex : new RegExp(req.body.email, "i") }},function(err,frndData){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
      
            if (frndData != undefined && frndData != null) {
                friend.find({'UserID': req.session.user._id,'Friend.Email':{ $regex : new RegExp(req.body.email, "i") },Status:1,IsDeleted:0},function(err,data){
                    if (err) {
                        res.json({'code':404,'error':err});
                    }else{
                        console.log(data);
                        if (data.length == 0) {
                            console.log('saving data');
                            var rel = req.body.relation;
                            rel = rel.split('~');
                            var newFriendData = {};
                            newFriendData.ID = frndData._id;
                            newFriendData.Email = frndData.Email;
                            newFriendData.Name = frndData.Name;
                            newFriendData.NickName =  frndData.NickName;
                            newFriendData.Pic =  frndData.ProfilePic;
                            newFriendData.Relation =  rel[0].trim();
                            newFriendData.RelationID =  rel[1].trim();
                            
                            var friendship = new friend();
                            friendship.UserID = req.session.user._id;
                            friendship.Friend = newFriendData;
                            friendship.Status = 1;
                            friendship.IsDeleted = 0;
                            friendship.CreatedOn = Date.now();
                            friendship.ModifiedOn = Date.now();
                            friendship.save(function(err,data){
                                if (err) {
                                    res.json(err);
                                }else{
                                    res.json({'code':200,msg:'data saved'});
                                }
                            });
                        }else{
                            console.log('already friend');
                            res.json({'code':400,msg:'Already a friend'});
                        }
                    }
                });
            }else{
                console.log('not registered');
                res.json({'code':401,msg:'user not registered'});
            }
        }
    })
}
*/
exports.addFriend = addFriend;






/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		removeFriend
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var removeFriend = function(req,res){
    friend.find({'UserID': req.session.user._id,'Friend.Email':{ $regex : new RegExp(req.body.email, "i") },Status:1,IsDeleted:0},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            console.log('here');
            if (data.length>0) {
                //return 'friends';
                friend.update({UserID: req.session.user._id , 'Friend.Email':{ $regex : new RegExp(req.body.email, "i") },IsDeleted:0},{$set:{IsDeleted:1,ModifiedOn:Date.now()}},{upsert:false},function(err,numAffected){
                    if (err) {
                        res.json({'code':400,'error':err});
                    }else{
                        group.update({OwnerID:req.session.user._id},{$pull:{Members:{MemberEmail:{$regex: new RegExp(req.body.email,"i")}}}},{multi:true},function(err,numAffected){
                            if (err) {
                                res.json({'code':400,'error1':err});
                            }else{
                                res.json({'code':200,msg:'friend removed sucessfully!!', num:numAffected});
                                /*
                                if (numAffected>0) {
                                    res.json({'code':200,msg:'friend removed sucessfully!!', num:numAffected});
                                }else{
                                    res.json({'code':401,msg:'Opps!! Something went wrong', num:numAffected});
                                }
                                */
                            }
                        });
                    }
                })
            }else{
                //return 'not friends';
                res.json({'code':401,msg:'Opps!! Something went wrong'});
            }
        }
    })
}
exports.removeFriend = removeFriend;




/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		addNewMember
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var addNewMember = function(req,res){
    if (checkFriendship(req.body.email) != 'friends') {
        
    }
}
exports.addNewMember = addNewMember;


/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		allFriends
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var allFriends = function(req,res){
    friend.find({UserID:req.session.user._id,Status:1,IsDeleted:0},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            res.json({'code':200,'friends':data});
        }
    })
}
exports.allFriends = allFriends;



/*________________________________________________________________________
   * @Date:      		29 Sep 2015
   * @Method :   		allFriendsPaginated
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var allFriendsPaginated = function(req,res){
    var perPage = req.body.perPage ? req.body.perPage : 40 ;
    var pageNo = req.body.pageNo ? req.body.pageNo : 1 ;
    var offset = perPage * ( pageNo-1 );
    console.log('Offset ---------' + offset);
    friend.find({UserID:req.session.user._id,Status:1,IsDeleted:0}).skip(offset).limit(perPage).exec(function(err,data1){
        if (err) {
                res.json({'code':400,'error':err});
            }else{
                console.log('---------------------------------------------------------');
                console.log('data1 outside');
                console.log('---------------------------------------------------------');
                console.log(data1.length);
                console.log('---------------------------------------------------------');
                friend.find({UserID:req.session.user._id,Status:1,IsDeleted:0},function(err,data2){
                    if (err) {
                        res.json({'code':400,'error':err});
                    }else{
                        res.json({'code':200,'friends':data1 , total : data2.length});
                    }
                })
            }
    })
}
exports.allFriendsPaginated = allFriendsPaginated;



/*________________________________________________________________________
   * @Date:      		29 Sep 2015
   * @Method :   		excludeMembers
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var excludeMembers = function(req,res){
    var perPage = req.body.perPage ? req.body.perPage : 40 ;
    var pageNo = req.body.pageNo ? req.body.pageNo : 1 ;
    var offset = perPage * ( pageNo-1 );
    var emails = req.body.emails ? req.body.emails : [] ;
    var emailRegEx = [];
    for(var i = 0 ; i< emails.length ; i++){
        emailRegEx.push( new RegExp('^'+emails[i]+'$' , 'i'))
    }
    console.log('emailRegEx ---------' + emailRegEx);
    friend.find({ UserID : req.session.user._id , Status : 1 , IsDeleted : 0 , 'Friend.Email' :{$nin:emailRegEx}}).skip(offset).limit(perPage).exec(function(err,data1){
        if (err) {
                res.json({'code':400,'error':err});
            }else{
                console.log('---------------------------------------------------------');
                console.log('data1 outside');
                console.log('---------------------------------------------------------');
                console.log(data1.length);
                console.log('---------------------------------------------------------');
                friend.find({ UserID : req.session.user._id , Status : 1 , IsDeleted : 0 , 'Friend.Email' :{$nin:emailRegEx}},function(err,data2){
                    if (err) {
                        res.json({'code':400,'error':err});
                    }else{
                        res.json({'code':200,'friends':data1 , total : data2.length});
                    }
                })
            }
    })
}
exports.excludeMembers = excludeMembers;

/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		allFriendsStartingWith
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var allFriendsStartingWith = function(req,res){
    var regex = new RegExp('\s*\s*^\s*\s*'+req.body.startsWith,'i');
	console.log(regex);
    
    friend.find( { UserID : req.session.user._id, Status : 1, IsDeleted : 0 , 'Friend.Name' : regex} ,function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            res.json({'code':200,'friends':data});
        }
    })
}
exports.allFriendsStartingWith = allFriendsStartingWith;