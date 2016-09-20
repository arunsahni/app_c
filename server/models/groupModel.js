var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
	MemberID : {
		type : String, 
	},
	MemberEmail : {
		type : String , 
		required : true
	},
	MemberName : {
		type : String
	},
	MemberNickName : {
		type : String
	},
    MemberPic : {
		type : String, 
		default:'/assets/users/default.png'
	},
    MemberRelation : {
		type : String
	},
    MemberRelationID : {
		type : String
	},
	IsRegistered : {
		type : Boolean,
		required : true
	}
});


var groupSchema = new mongoose.Schema({	
	Title:{
		type : String,
		required : true
	},
	OwnerID:{
		type : String
	},
	Status : {
		type : Boolean, 
		default : 1 
	},
	IsDeleted : {
		type : Boolean,
		default : 0
	},
	Icon : {
		type : String
	},
	CreatedOn : {
		type : Date
	},
	ModifiedOn : {
		type : Date, 
		default : Date.now()
	},
	Members : [ memberSchema]
	
},{ collection : 'Groups' });

var group = mongoose.model('Groups',groupSchema);

module.exports = group;