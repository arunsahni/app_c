var user = require('./../models/userModel.js');
var board = require('./../models/boardModel.js');
var boardInvitees = require('./../models/boardInviteesModel.js');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var formidable = require('formidable');
var nodemailer = require('nodemailer');
var mediaController = require('./../controllers/mediaController.js');

// For login of a admin


/*
var login = function(req, res){
    
	
	//updated by manishp on 01102014 session issue	
    if( !req.body.email || !req.body.password ){
		res.json({"code":"404","msg":"Failed"});
		return;
	}
	
	var fields = {        
		Email: req.body.email,
		Password: req.body.password
    };
    
	console.log("fields----",fields);
	
	user.find(fields,function(err,result){
		if(err){ 		
			res.json(err);
		}
		else{
			console.log("result-----" , result);	//by manishp on 01102014 testing session 
			if(result.length==0){
				res.json({"code":"404","msg":"Failed"});
			}
			else{
				var userid=result[0].id;
				username=result[0].Name;
				req.session.user = result[0];
				
				console.log("body-------" ,req.body.board);	//by manishp on 01102014 testing session 
				if (req.body.board) {		    
					boardInvitees.find({UserId:userid,BoardId:req.body.board},function(err,resl){
						if (resl.length) {
							board.findOne({_id:req.body.board,'Invitees.UserID':userid},function(err,result){
								if(!err){
									res.json({"code":"200","msg":"Success","url":req.body.board});
								}
								else{
									res.json({"code":"200","msg":"Success"});
								}
							})    
						}
						else{
							res.json({"code":"200","msg":"Success"});
						}   
					})   
				}
				else{
					console.log("body-------m here");			//by manishp on 01102014 testing session 
					res.json({"code":"200","msg":"Success"});
				}
			}
		}
    });
    
};

exports.login = login;

*/
// parul 27022015
var login = function(req, res){
	//updated by manishp on 01102014 session issue	
    if( !req.body.email || !req.body.password ){
		res.json({"code":"404","msg":"Failed"});
		return;
	}
	
	var fields = {        
		Email: req.body.email
    };
    
	console.log("fields----",fields);
	
	user.find(fields,function(err,result){
		if(err){ 		
			res.json(err);
		}
		else{
			console.log("result-----" , result);	//by manishp on 01102014 testing session 
			if(result.length==0){
				res.json({"code":"404","msg":"Wrong Email"});
			}
			else if(!result[0].validPassword(req.body.password,result[0].Password)){
				res.json({"code":"404","msg":"Wrong Password"});
			}
			else if(result[0].validPassword(req.body.password,result[0].Password)){
				var userid=result[0].id;
				username=result[0].Name;
				req.session.user = result[0];
				
				console.log("body-------" ,req.body.board);	//by manishp on 01102014 testing session 
				if (req.body.board) {		    
					boardInvitees.find({UserId:userid,BoardId:req.body.board},function(err,resl){
						if (resl.length) {
							board.findOne({_id:req.body.board,'Invitees.UserID':userid},function(err,result){
								if(!err){
									res.json({"code":"200","msg":"Success","url":req.body.board});
								}
								else{
									res.json({"code":"200","msg":"Success"});
								}
							})    
						}
						else{
							res.json({"code":"200","msg":"Success"});
						}   
					})   
				}
				else{
					console.log("body-------m here");			//by manishp on 01102014 testing session 
					res.json({"code":"200","msg":"Success"});
				}
			}
		}
    });
    
};

exports.login = login;




//file upload profile page parul ==> starts
var fileUpload=function(req,res){
    
    var form = new formidable.IncomingForm();
        form.keepExtensions = true;     //keep file extension

    

        form.uploadDir = (__dirname+"/../../public/assets/users/");       //set upload directory
        form.keepExtensions = true;     //keep file extension
        form.parse(req, function(err, fields, files) {
            //res.writeHead(200, {'content-type': 'text/plain'});
            //res.write('received upload:\n\n');
        console.log("form.bytesReceived");
            //TESTING
        console.log("file size: "+JSON.stringify(files.file.size));
        console.log("file path: "+JSON.stringify(files.file.path));
        console.log("file name: "+JSON.stringify(files.file.name));
        console.log("file type: "+JSON.stringify(files.file.type));
        console.log("lastModifiedDate: "+JSON.stringify(files.file.lastModifiedDate));
        //Formidable changes the name of the uploaded file
        //Rename the file to its original name
        var dateTime = new Date().toISOString().replace(/T/,'').replace(/\..+/, '').split(" ");
        fs.rename(files.file.path, __dirname+"/../../public/assets/users/"+  req.session.user._id+ files.file.name, function(err) {
        if (err){
            throw err;
            }
            else {
				var imgUrl = req.session.user._id+ files.file.name;
				var mediaCenterPath = "/../../public/assets/users/";
				var srcPath = __dirname + mediaCenterPath + imgUrl;
				if (fs.existsSync(srcPath)) {
					var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+ imgUrl;
					//var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+ imgUrl;
					var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
					//var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
					var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
					mediaController.crop_image(srcPath,dstPathCrop_SMALL,100,100);
					mediaController.crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
					mediaController.resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
				}
                setTimeout(function(){
					res.json({'filename':"../assets/users/"+ process.urls.small__thumbnail+"/"+req.session.user._id+ files.file.name});
				},2000)
            }
            
          console.log('renamed complete');  
        });
    });
    
    
};
exports.fileUpload = fileUpload;
//file upload profile page parul ==> ends

// save file parul ==> starts

var saveFile=function(req,res){
    console.log("user="+req.session.user.Email);
	var img1=((req.body.data)?req.body.data:"");
	var query={Email:req.session.user.Email};
	// console.log(a);
	user.update(
	query,
	{$set:{ProfilePic:img1}},{upsert:true},
	function(err,docs){
		console.log("docs="+docs);
		if(err){
			res.send('error');
		}
		else
		{	req.session.user.ProfilePic=img1;
			//res.send('done'); //parul 20012015
			user.findOne(query,function(err,data){
				res.json({"data":data});	
			})
			
		}
	});    
};
exports.saveFile=saveFile;

// save file parul ==> ends
//edited by parul 20 nov
/*
var addFsg = function(req,res){
  
	var fields={
	//FSGs:{}
	FSGsArr:[]   //edited by parul
	};
	
	console.log(req.body.fsg);
	//commented and modified by parul
	//for(i in req.body.fsg){
	//	if(req.body.fsg[i]!=null){
	//		var keyval = req.body.fsg[i].split('~')
	//		fields.FSGs[keyval[0]]=keyval[1];
	//	}
	//}
	
	var subFsg=[];
	
	for (i in req.body.fsg) {
		if(req.body.fsg[i]!=null){
			var valuesD=[];
			for(j in req.body.fsg[i]){
				
				if(req.body.fsg[i][j]!=null){
					keyvalD =req.body.fsg[i][j].split('~');
					console.log(req.body.fsg[i][j].split('~'));
					valuesD.push(keyvalD[1]);
					console.log(keyvalD[1]);
				}
			}
			
			subFsg.push({
				keyval:keyvalD[0],
				values:valuesD
		    });
		}
	}
	console.log(subFsg);
	fields.FSGsArr=subFsg;
	//end
	if(req.body.NickName)
		fields.NickName = req.body.NickName;
		
	if(req.body.ProfilePic){
		//fields.ProfilePic = req.body.ProfilePic;
		//upload pic
	}
	
	console.log("fields = ",fields);
		
	var query={_id:req.session.user._id};
	var options = { multi: true };
	user.update(query, { $set: fields}, options, callback)
	function callback (err, numAffected) {
		if(err){
			res.json(err)
		}
		else{
			user.find({'_id':req.session.user._id},function(err, result){
				req.session.user=result[0];
				res.json({"code":200,"msg":"Success"});
			})			
		}
	}
};
*/
//edited by parul on-24012015 mutiple searchapi case
var addFsg = function(req,res){
  
	var fields={
	//FSGs:{}
	FSGsArr2:{}   //edited by parul
	};
	
	console.log(req.body.fsg);
	//commented and modified by parul
	//for(i in req.body.fsg){
	//	if(req.body.fsg[i]!=null){
	//		var keyval = req.body.fsg[i].split('~')
	//		fields.FSGs[keyval[0]]=keyval[1];
	//	}
	//}
	
	
	
	for (i in req.body.fsg) {
		if(req.body.fsg[i]!=null){
			var valuesD='';
			var temp = {}
			for(j in req.body.fsg[i]){
				if(req.body.fsg[i][j]!=null){
					if (j==0) {
						keyvalD =req.body.fsg[i][j].split('~');
						valuesD=keyvalD[1];
					}else{
						keyvalD =req.body.fsg[i][j].split('~');
						valuesD=valuesD+','+keyvalD[1];
						
					}
				}
			}
			fields.FSGsArr2[keyvalD[0]] = valuesD;
			//fields.FSGsArr2.keyvalD[0]=valuesD;
		//	subFsg.push({
		//		keyval:keyvalD[0],
		//		values:valuesD
		//    });
		}
	}
	console.log(fields);
	//return;
	//return;
	//fields.FSGsArr=subFsg;
	//end
	if(req.body.NickName)
		fields.NickName = req.body.NickName;
		
	if(req.body.ProfilePic){
		//fields.ProfilePic = req.body.ProfilePic;
		//upload pic
	}
	
	console.log("fields = ",fields);
		
	var query={_id:req.session.user._id};
	var options = { multi: true };
	user.update(query, { $set: fields}, options, callback)
	function callback (err, numAffected) {
		if(err){
			res.json(err)
		}
		else{
			user.find({'_id':req.session.user._id},function(err, result){
				req.session.user=result[0];
				res.json({"code":200,"msg":"Success"});
			})			
		}
	}
};
exports.addFsg = addFsg;


var register = function(req, res){
       
    user.find({Email:req.body.email},function(err,result){
	if(result.length==0){
	//    var fields = {        
	//	Email: req.body.email,
	//	Password: user.generateHash(req.body.password),
	//	Name: req.body.name,
	//	NickName:req.body.name
	//    };
	//commented modified on 27022015 by parul
	
		var newUser = new user();
		newUser.Email = req.body.email;
		newUser.Password = newUser.generateHash(req.body.password);
		newUser.Name = req.body.name;
		newUser.NickName =req.body.name;
		
	    //user(fields).save(function(err,numAffected){	//commented modified on 27022015 by parul
		newUser.save(function(err,numAffected){
		if(err){ 		
		    res.json(err);
		}
		else{			
		    if(req.body.board){		    
				boardInvitees.findOne({UserEmail:new Buffer(req.body.emailInvite, 'base64').toString('ascii'),BoardId:req.body.board,AcceptedOn:null},function(err,resl){
					if (typeof(resl.UserEmail)!='undefined') {
						resl.UserId = numAffected._id;
						resl.UserEmail = req.body.email;
						resl.AcceptedOn = Date.now();
						resl.save();
						board.findOne({_id:req.body.board},function(err,result){
							
							if(!err){					
								if (result.Invitees==null) {
									result.Invitees=[];
								}
								
								result.Invitees.push({
									UserID:numAffected._id,
									UserEmail:req.body.email,
									UserName:req.body.name
								})
								
								result.save(function(err){
									res.json({"code":"200","msg":"Success"});
								})
							}
							else{
								res.json({"code":"200","msg":"Success"});
							}
							
						})    
					}
					else{
						res.json({"code":"200","msg":"Success"});
					}
				})   
		    }
		    else{
				res.json({"code":"200","msg":"Success"});
		    }
		}
	    });
	}
	else{
	    res.json({"code":"404","msg":"Email already exists!"});
	}
    });
    
};

exports.register = register;



var chklogin = function(req, res){
    if (req.session.user) {
        res.json({"code":"200","msg":"Success","usersession":req.session.user});
    }
    else{
        res.json({"code":"404","msg":"Failed"})
    }
    
}
exports.chklogin = chklogin;


var uploadDP = function(req,res){
    
    var form = new formidable.IncomingForm();        	
    form.parse(req, function(err, fields, files) {
	var file_name="";
      
	if(files.myFile.name){
	    uploadDir = __dirname + "/../../public/assets/users";   
	}
	else{
	    res.json({"code":"404","message":"No File"});
	    return;
	}		
	file_name=files.myFile.name;
	file_name=file_name.split('.');
	ext=file_name[file_name.length-1];
	name=Date.now();
	file_name=name+'.'+ext;
	
	fs.rename(files.myFile.path, uploadDir + "/" + file_name);
	
	var dataToUpload={
		ProfilePic:file_name
	};
	
	var query={_id:req.session.user._id};
	var options = { multi: false };		
	user.update(query, { $set: dataToUpload}, options, callback)
	
	
	function callback (err, numAffected) {
	    if(err){
		    res.json({"code":"404","message":err});
	    }
	    else{
		    res.json({"code":"200","message":"Success","result":dataToUpload});		    
	    }
	}	  
    })
    
}
exports.uploadDP = uploadDP;

/*________________________________________________________________________
	* @Date:      	21 dec 2014
	* @Method :   	fsgArrUpdate
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to save users serch prefrences to the filed fsgArr.
	* @Param:     	2
	* @Return:    	yes
_________________________________________________________________________
*/

//addded by parul 21 dec
/*
var fsgArrUpdate=function(req,res){
	console.log(req.body);
	//console.log(req.body.fsg);
	var subFsg=[];
	for (i in req.body.values){
		keyvalD =req.body.values[i].split('~');
		subFsg.push(keyvalD[1]);
		//console.log()
	}
	var data={
		keyval:req.body.fsgTitle,
		values:subFsg
	}
	console.log("fields = ",data);
	var query={_id:req.session.user._id};
	
	user.find(query,function(err,userData){
		if(!err){console.log('---------------------no error');
			console.log('userData.FSGsArr');
			console.log(userData[0].FSGsArr);
			for(n in userData[0].FSGsArr){
				console.log("---------------------------in for:")
				if (userData[0].FSGsArr[n].keyval==req.body.fsgTitle) {
					userData[0].FSGsArr[n]={};
					userData[0].FSGsArr[n]=data;
					console.log('here');
					var changed=true;
					//console.log(userData.FSGsArr);
				}
			}
			if (changed!=true) {
				userData[0].FSGsArr.push(data);
			}
			console.log("Gender =========== ",userData[0].FSGsArr[0].values);
			user.update(query,{$set:{FSGsArr:userData[0].FSGsArr}},{upsert:false},function(err,result){
			if (!err) {
				console.log('success');
				user.find({'_id':req.session.user._id},function(err, result){
					req.session.user=result[0];
					res.json({"code":200,"msg":"Success"});
				})
				//res.json({"code":200,"msg":"Success"});
			}
			else{
				res.json(err)
			}
			})
			//userData.save(function(err,result){
			//	if(err){
			//		res.json(err)
			//	}
			//	else{
			//		user.find({'_id':req.session.user._id},function(err, result){
			//			req.session.user=result[0];
			//			res.json({"code":200,"msg":"Success"});
			//		})			
			//	}
			//})
		}
		else{
			console.log('---------------------Error---------------');
			res.json(err);
		}	
	})
	
};
*/
var fsgArrUpdate=function(req,res){
	console.log(req.body);
	//console.log(req.body.fsg);
	//var data={
	//	keyval:req.body.fsgTitle,
	//	values:subFsg
	//}
	//console.log("fields = ",data);
	var query={_id:req.session.user._id};
	user.findOne(query,function(err,userData){
		if(!err){console.log('---------------------no error');
			console.log('userData.FSGsArr--');
			//console.log(userData);
			//console.log(userData.FSGsArr2);
			var fields = {};
			var found = false;
			for(tempKey in userData.FSGsArr2){
				console.log("tempKey = ",tempKey);
				if (tempKey == req.body.title) {
					//code
					found = true;
					fields[tempKey]=req.body.value;
					
				}
				else{
					fields[tempKey]=userData.FSGsArr2[tempKey];
				}
				
			}
			if( !found ){
				fields[req.body.title]=req.body.value;
			}
			
			//console.log("userData.FSGsArr2[req.body.title]",userData.FSGsArr2[req.body.title]);
			//console.log('userData = ',userData)
			user.update(query,{$set:{FSGsArr2:fields}},{upsert:false},function(err,data){
				if (!err) {
					console.log(data);
					user.find({'_id':req.session.user._id},function(err, result){
						req.session.user=result[0];
						res.json({"code":200,"msg":"Success"});
					})
					//res.json({"code":200,"msg":"Success"});
				}else{
					res.json(err);
				}
			});
		}
		else{
			console.log('---------------------Error---------------');
			res.json(err);
		}	
	})
	
};
exports.fsgArrUpdate=fsgArrUpdate;


// 
var saveSettings=function(req,res){
	var query={_id:req.session.user._id};
	user.update(query,{$set:{Settings:req.body}},{upsert:false},function(err,result){
		if (err) {
			console.log(err);
			res.json(err);
		}else{
		user.find({'_id':req.session.user._id},function(err, result){
			req.session.user=result[0];
			res.json({"code":200,"msg":"Success"});
		})
		}
	});
}
exports.saveSettings=saveSettings;


/*________________________________________________________________________
	* @Date:      	23 Jan 2015
	* @Method :   	resetPswrd
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to reset user password.
	* @Param:     	2
	* @Return:    	yes
_________________________________________________________________________
*/
//addded by parul 
var resetPassword=function(req,res){
	sendmail(req.body.email,"reset",req,res);
	console.log('send email called');
}
exports.resetPassword=resetPassword;

/*________________________________________________________________________
	* @Date:      	23 Jan 2015
	* @Method :   	sendmail
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to send email to user in case of password reset request and password reset successful.
	* @Param:     	4
	* @Return:    	no
_________________________________________________________________________
*/

function sendmail(to,type,req,res){
//    if (type=='register') {
//		type=type+'/'+new Buffer(to).toString('base64');
//    }
	var salt = bcrypt.genSaltSync(10); //setting salt for bcrypt
    console.log(type);
	user.findOne({'Email':to},function(err,data){
	 if (!err) {
		if (data) {
			console.log('here1');
			var userToHash=data._id+'_'+Date.now();
			console.log("userToHash="+userToHash);
			if (type=="reset") {
				var userHash=new Buffer(userToHash).toString('base64');
				console.log("userHash="+userHash);
				var mailOptions = {
					from: 'collabmedia support  <collabmedia.scrpt@gmail.com>', // sender address
					to: to, // list of receivers
					subject: 'Scrpt - Reset password!',
					text: 'http://203.100.79.94:8888/#/changePassword/'+userHash, 
					html: 'We have recieved a request to reset the password of your Scrpt account. If you made this request, click on the link below. If you did not make this request you can ignore this mail.<br /><a href="http://203.100.79.94:8888/#/changePassword/'+userHash+'">http://203.100.79.94:8888/#/changePassword/'+userHash+'</a><br /><br />Regards<br />collabmedia.scrpt@gmail.com'
				};
			}else if (type=="pswrdChanged") {
				var mailOptions = {
					from: 'collabmedia support  <collabmedia.scrpt@gmail.com>', // sender address
					to: to, // list of receivers
					subject: 'Scrpt - Password changed successfully!',
					text: 'http://203.100.79.94:8888/#/login', 
					html: 'Hi '+data.Name+",<br/><br/>The password for your scrpt Account was recently changed.If you made this change, you don't need to do anything more.<br/>If you didn't change your password, your account might have been hijacked. To get back into your account, you'll need to reset your password.<br/><a target='_blank' style='text-align:center;font-size:11px;font-family:arial,sans-serif;color:white;font-weight:bold;border-color:#3079ed;background-color:#4d90fe;background-image:linear-gradient(top,#4d90fe,#4787ed);text-decoration:none;display:inline-block;min-height:27px;padding-left:8px;padding-right:8px;line-height:27px;border-radius:2px;border-width:1px' href='http://203.100.79.94:8888/#/forgotPassword'><span style='color:white'>Reset password</span></a><br/>Sincerely,<br>The Scrpt team. "
				};
			}
			
			var transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'collabmedia.scrpt@gmail.com',
					pass: 'scrpt123_2014collabmedia#1909'
				}
			});		
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
					res.json(err);
				}else{
					console.log('Message sent to: '+to + info.response);
					res.json({'msg':'done','code':'200'});
				}
			});
		 }else{
			res.json({'code':'400'});
		 }
		
		
	 }else{
		console.log('here2');
		res.json(err);
	 }
	});

}
	

		
	var newPassword=function(req,res){
		var idAndTime = new Buffer(req.body.id, 'base64').toString('ascii');
		if (req.body.id) {
			var userData=(idAndTime).split('_');
			console.log('userData[0]='+userData[0]);
			user.findOne({_id:userData[0]},function(err,data){
				if (!err) {
					//data.Password=req.body.password;
					data.Password=data.generateHash(req.body.password);
					data.save(function(err1){
						if (!err) {
							//res.json({'code':'200','message':'password changed succesfully'});
							sendmail(data.Email,"pswrdChanged",data,res);
						}else{
							res.json(err);
						}
					});
				}
				else{
					res.json(err);
				}
			});
		}else{
			res.json(err);
		}
	}
	exports.newPassword=newPassword;
	
	
/*________________________________________________________________________
	* @Date:      	23 Jan 2015
	* @Method :   	updateAllPassword
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-27 02 2015- 
	* @Purpose:   	This function is used to Update all un.
	* @Param:     	2
	* @Return:    	no
	_________________________________________________________________________
*/	
	var updateAllPassword=function(req,res){
		//user.find({},function(err,userData){
		//	if (err) {
		//		res.send(err);
		//	}else{
		//		for (i in userData){
		//			fields={Password:userData[i].generateHash(userData[i].Password)}
		//			user.update({_id:userData[i]._id},{$set:fields},{upsert:false},function(err2,num){
		//				if(err2){
		//					res.send(err2)
		//				}	
		//			})
		//		}
		//		
		//	}
		//})
		res.send("working api----------------code commented for security reason--!");
	}
	exports.updateAllPassword=updateAllPassword;