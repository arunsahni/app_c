var user = require('./../models/userModel.js');
var group = require('./../models/groupModel.js');
var friend = require('./../models/friendsModel.js');
var fs = require('fs');
var formidable = require('formidable');
var mediaController = require('./../controllers/mediaController.js');


function checkFriendship(req,email,name,relation,IsRegistered){
    friend.find({'UserID': req.session.user._id,'Friend.Email':email,Status:1,IsDeleted:0},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            console.log('here');
            if (data.length>0) {
                //return 'friends';
                console.log('already friends');
            }else{
                //return 'not friends';
                console.log('adding a friend');
                user.findOne({Email:{ $regex : new RegExp(req.body.email, "i") }},function(err,frndData){
                    if (data.length == 0) {
                        var rel = relation.split('~');
                        console.log('saving data');
                        var newFriendData = {};
                        if (IsRegistered) {
                            newFriendData.ID = frndData._id;
                            newFriendData.NickName =  frndData.NickName;
                            newFriendData.Pic =  frndData.ProfilePic;
                        }
                        
                        newFriendData.IsRegistered = IsRegistered;
                        newFriendData.Email = email;
                        newFriendData.Name = name;
                        
                        newFriendData.Relation = rel[0].trim();
                        newFriendData.RelationID = rel[1].trim();
                        console.log('--------------------------------------------------------');
                        console.log(newFriendData);
                        console.log('--------------------------------------------------------');
                        var friendship = new friend();
                        friendship.UserID = req.session.user._id;
                        friendship.Friend = newFriendData;
                        friendship.Status = 1;
                        friendship.IsDeleted = 0;
                        friendship.CreatedOn = Date.now();
                        friendship.ModifiedOn = Date.now();
                        friendship.save(function(err,data){
                            if (err) {
                                console.log(err);
                                //res.json(err);
                            }else{
                                console.log('data saved')
                                //res.json({'code':200,msg:'data saved'});
                            }
                        });
                    }else{
                        console.log('not a member yet ');
                        //res.json({'code':400,msg:'Already a friend'});
                    }
                })
            }
        }
    })
}


/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		getAll
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var getAll = function(req,res){
    group.find({OwnerID:req.session.user._id,IsDeleted:0},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            res.json({'code':200,'groups':data});
        }
    })
}
exports.getAll = getAll;



/*________________________________________________________________________
   * @Date:      		29 sep 2015
   * @Method :   		getAllPaginated
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var getAllPaginated = function(req,res){
    var perPage = req.body.perPage ? req.body.perPage : 40 ;
    var pageNo = req.body.pageNo ? req.body.pageNo : 1 ;
    var offset = perPage * ( pageNo-1 );
    group.find({OwnerID:req.session.user._id,IsDeleted:0}).sort({CreatedOn: 'desc'}).skip(offset).limit(perPage).exec(function(err,data1){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            group.find({OwnerID:req.session.user._id,IsDeleted:0},function(err,data2){
                if (err) {
                    res.json({'code':400,'error':err});
                }else{
                    res.json({'code':200,'groups':data1 ,'total' : data2.length});
                }
            })
        }
    })
}
exports.getAllPaginated = getAllPaginated;





/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		addGroup
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var addGroup = function(req,res){
    group.find({OwnerID:req.session.user._id,Title:{ $regex : new RegExp("^"+req.body.title+"$", "i") }, IsDeleted:0},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            if (data.length>0) {
                res.json({'code':401,'error':'a group with same name already exists'});
            }else{
                var newGroup = new group();
                newGroup.Title = req.body.title;
                newGroup.OwnerID = req.session.user._id;
                newGroup.Status = 1;
                newGroup.IsDeleted = 0;
                newGroup.CreatedOn = Date.now();
                newGroup.ModifiedOn = Date.now();
                newGroup.Members = [];
                newGroup.save(function(err,data){
                    if (err) {
                        res.json({'code':400,'error':err});
                    }else{
                        res.json({'code':200,'data':data});
                    }
                });
            }
        }
    })
    
}
exports.addGroup = addGroup;


/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		removeGroup
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var removeGroup = function(req,res){
    group.findOne({_id:req.body.id},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            if (data) {
                data.IsDeleted = 1;
                data.save(function(err,data1){
                     if (err) {
                        res.json({'code':400,'error':'error while saving'});
                    }else{
                        res.json({'code':200,'msg':'group deleted .'});
                    }
                })
            }
        }
    })
}
exports.removeGroup = removeGroup;


/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		addMember
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var addMember = function(req,res){
    group.findOne({_id:req.body.id},function(err,data){
        if (err) {
            res.json({'code':400,'error':"mongo error1"});
        }else{
            if (data) {
                user.findOne({Email:{ $regex : new RegExp(req.body.email, "i") }},function(err,user1){
                    if (err ) {
                        res.json({'code':400,'error':"mongo error4"});
                    }else{
                        var IsRegistered = false;
                        console.log('user1');
                        console.log(user1)
                        if (user1) {
                            IsRegistered = true;
                        }else{
                            IsRegistered = false;
                            //console.log('not a member case ');
                            //res.json({'code':403,'error':"user not registered with scrpt"});
                        }
                        group.find({_id:req.body.id,Members:{$elemMatch:{MemberEmail:{$regex: new RegExp(req.body.email,"i")}}}},function(err,data){
                            if (err) {
                                throw err;
                                res.json({'code':400,'error':err});
                            }else{
                                if (data.length == 0) {
                                    checkFriendship(req,req.body.email,req.body.name,req.body.relation, IsRegistered);
                                    user.findOne({Email:{ $regex : new RegExp(req.body.email, "i") }},function(err,frndData){
                                        var rel = req.body.relation;
                                        rel = rel.split('~');
                                        var member = {};
                                        member.IsRegistered = IsRegistered;
                                        if (IsRegistered) {
                                            member.MemberID = frndData._id;
                                            member.MemberNickName = frndData.NickName;
                                            member.MemberPic = frndData.ProfilePic;
                                        }
                                        member.MemberEmail = IsRegistered ? frndData.Email : req.body.email;
                                        member.MemberName = IsRegistered ? frndData.Name : req.body.name;
                                        member.MemberRelation = rel[0].trim();
                                        member.MemberRelationID = rel[1].trim();
                                        
                                        group.update({_id:req.body.id},{$push:{Members:member}},{multi:false},function(err,data){
                                            if (err) {
                                                res.json({'code':400,'error':"mongo error3"});
                                            }else{
                                                data.member = member;
                                                res.json({'code':200,'data':data});
                                            }
                                        })
                                    })
                                }else{
                                    res.json({'code':401,'error':"Already a member"});
                                }
                            }
                        })
                    }
                })
            }else{
                res.json({'code':402,'error':"group not found"});
            }
        }
    })
}
/*
var addMember = function(req,res){
    group.findOne({_id:req.body.id},function(err,data){
        if (err) {
            res.json({'code':400,'error':"mongo error1"});
        }else{
            if (data) {
                user.findOne({Email:{ $regex : new RegExp(req.body.email, "i") }},function(err,user1){
                    if (err ) {
                        res.json({'code':400,'error':"mongo error4"});
                    }else{
                        if (user1) {
                            group.find({_id:req.body.id,Members:{$elemMatch:{MemberEmail:{$regex: new RegExp(req.body.email,"i")}}}},function(err,data){
                                if (err) {
                                    throw err;
                                    res.json({'code':400,'error':err});
                                }else{
                                    if (data.length == 0) {
                                        checkFriendship(req,req.body.email,req.body.name,req.body.relation);
                                        user.findOne({Email:{ $regex : new RegExp(req.body.email, "i") }},function(err,frndData){
                                            var rel = req.body.relation;
                                            rel = rel.split('~');
                                            var member = {};
                                            member.MemberID = frndData._id;
                                            member.MemberEmail = frndData.Email;
                                            member.MemberName = req.body.name;
                                            member.MemberNickName = frndData.NickName;
                                            member.MemberPic = frndData.ProfilePic;
                                            member.MemberRelation = rel[0].trim();
                                            member.MemberRelationID = rel[1].trim();
                                            
                                            group.update({_id:req.body.id},{$push:{Members:member}},{multi:false},function(err,data){
                                                if (err) {
                                                    res.json({'code':400,'error':"mongo error3"});
                                                }else{
                                                    res.json({'code':200,'data':data});
                                                }
                                            })
                                        })
                                    }else{
                                        res.json({'code':401,'error':"Already a member"});
                                    }
                                }
                            })
                        }else{
                            console.log('not a member case ');
                            res.json({'code':403,'error':"user not registered with scrpt"});
                        }
                    }
                })
            }else{
                res.json({'code':402,'error':"group not found"});
            }
        }
    })
}

*/
exports.addMember = addMember;

/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		current
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var current = function(req,res){
    group.findOne({_id:req.body.id},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            res.json({'code':200,'group':data});
        }
    })
    
}
exports.current = current;

/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		removeMember
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var removeMember = function(req,res){
    group.findOne({_id:req.body.id},function(err,data){
        if (err) {
            res.json({'code':400,'error':err});
        }else{
            if (data) {
                group.update({_id:req.body.id},{$pull:{Members:{MemberEmail:{$regex: new RegExp(req.body.email,"i")}}}},{multi:false},function(err,data){
                    if (err) {
                        res.json({'code':400,'error':err});
                    }else{
                        res.json({'code':200,'data':data});
                    }
                })
            }else{
                res.json({'code':401,'error':'group not found'});
            }
        }
    })
    
}
exports.removeMember = removeMember;

/*________________________________________________________________________
   * @Date:      		31 July 2015
   * @Method :   		iconUpload
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var iconUpload = function(req,res){
    var form = new formidable.IncomingForm();
    console.log(form);
    form.keepExtensions = true;     //keep file extension
    form.uploadDir = (__dirname+"/../../public/assets/users/");       //set upload directory
    form.keepExtensions = true;     //keep file extension
    form.parse(req, function(err, fields, files) {
        console.log("form.bytesReceived");
        console.log("file path: "+JSON.stringify(files.file.path));
        console.log("file name: "+JSON.stringify(files.file.name));
        console.log("fields: "+fields);
        console.log("fields: "+JSON.stringify(fields));
        //Formidable changes the name of the uploaded file
        //Rename the file to its original name
        var dateTime = new Date().toISOString().replace(/T/,'').replace(/\..+/, '').split(" ");
        fs.rename(files.file.path, __dirname+"/../../public/assets/groups/"+  fields.groupID+'_'+Date.now()+ files.file.name, function(err) {
            if (err){
                throw err;
            }
            else {
                var imgUrl = fields.groupID+'_'+Date.now()+ files.file.name;
                var mediaCenterPath = "/../../public/assets/groups/";
                var srcPath = __dirname + mediaCenterPath + imgUrl;
                if (fs.existsSync(srcPath)) {
                    var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+ imgUrl;
                    //var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+ imgUrl;
                    var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
                    //var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
                    //var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
                    mediaController.crop_image(srcPath,dstPathCrop_SMALL,100,100);
                    mediaController.crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
                    //mediaController.resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
                }
                setTimeout(function(){
                    group.findOne({_id:fields.groupID},function(err,group1){
                        if (err) {
                            res.json({code:400,'msg':err});
                        }else{
                            group1.Icon = '/assets/groups/100/'+imgUrl;
                            group1.save(function(err,data){
                                 if (err) {
                                    res.json({'code':400,'msg':err});
                                }else{
                                    res.json({'code':200,'msg':'file uploaded successfully'});
                                }
                            })
                        }
                    })
                },2000)
            }
            console.log('renamed complete');  
        });
    });
}
exports.iconUpload = iconUpload;