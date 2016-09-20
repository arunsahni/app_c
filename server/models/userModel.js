var mongoose = require('mongoose');
var bcrypt=require('bcryptjs');


var userSchema = new mongoose.Schema({	
	Name:{type:String},
	NickName:{type:String},
	Email:{type : String, unique:true},
	Password:{type:String},
	ProfilePic:{type:String,default:'/assets/users/default.png'},
	FSGs:{type:Object},
	FSGsArr:[],
	FSGsArr2:{type:Object}, //added by parul searchApi Multiple case on -24012015
	Settings:[],
	RepostCount:{type:Number},
	MarkCount:{type:Number},
	StampCount:{type:Number},
	VoteScore:{type:Number},
	UserScore:{type:Number},
});



	
/*________________________________________________________________________
	* @Date:      	27 Feb 2015
	* @Method :   	generateHash
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function returns hash value for password
	* @Param:     	1
	* @Return:    	Yes
_________________________________________________________________________
*/   
/// returns hash value for password
userSchema.methods.generateHash=function(password){
	var abc=bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
	return abc;
};



/*________________________________________________________________________
	* @Date:      	27 Feb 2015
	* @Method :   	generateHash
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function returns boolean value after comparing stored hash vaue and user entered value 
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/   
userSchema.methods.validPassword=function(password,compPass){
	return bcrypt.compareSync(password,compPass);
};

var user = mongoose.model('user',userSchema);

module.exports = user;

