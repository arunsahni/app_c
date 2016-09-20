var mongoose = require('mongoose');
var inviteeSchema = new mongoose.Schema({
	UserID : {
		type : mongoose.Schema.Types.ObjectId, 
	},
	UserEmail : {
		type : String , 
		required : true
	},
	UserPic : {
		type : String , 
		default:'/assets/users/default.png'
	},
	UserName : {
		type : String
	},
	UserNickName : {
		type : String
	},
	CreatedOn : {
		type : Date,
		default : Date.now()
	},
	Relation : {
		type : String, 
		required : true
	},
	RelationId : {
		type : String
	},
	IsAccepted : {
		type : Boolean, 
		default : false,
	},
	AcceptedOn : {
		type : Date
	},
	IsDeleted : {
		type : Boolean,
		default : false,
	},
	DeletedOn : {
		type : Date
	},
	DeletedBy : {
		type : mongoose.Schema.Types.ObjectId, 
		ref : 'user'
	},
	UserLeft : {
		type : Boolean, 
	},
	LeftOn : {
		type : Date
	},
	ModifiedOn : {
		type : Date
	},
	IsRegistered : {
		type : Boolean,
		required : true
	},
	
});
var launchSettings = {
	Audience : {						//ME & OTHERS & PUBLISH (SUBSCRIBERS)
		type : String , 
		enum : ['ME','OTHERS','SUBSCRIBERS'],
		default : 'ME'
	},
	ShareMode : {						//(private/public/friend-solo/friend-group)	//this is participation
		type : String,
		default : "private"
	},
	OthersData : [inviteeSchema],
	Invitees : [inviteeSchema]
};

var capsuleSchema = new mongoose.Schema({	
	Origin:{
		type : String,
		enum : ["created","shared","byTheHouse","duplicated","addedFromLibrary","createdForMe","published","purchased","gifted"],	//published : this is the case when the creater will publish Capsule for other 
		default : "created"
	},
	OriginatedFrom:{			//keep the id from which the instance is created, useful for other than Origin = created case.
		type : mongoose.Schema.Types.ObjectId
	},
	CreaterId : {
		type : String,
		required : true
	},
	OwnerId:{
		type : String , 
		required : true
	},
	OwnerEmail : {									//- To Manage ShareWith Case: Non-Registered user
		type: String 
	},
	Title:{
		type : String,
		default : "Untitled Capsule", 
		required : true
	},
	Order : {
		type : Number,
		default : 0
	},
	Status : {
		type : Boolean, 
		default : 1
	},
	IsPublished : {
		type : Boolean,
		default : 0
	},
	IsLaunched : {
		type : Boolean,
		default : 0
	},
	IsDeleted : {
		type : Boolean,
		default : 0
	},
	CreatedOn : {
		type : Date
	},
	ModifiedOn : {
		type : Date, 
		default : Date.now()
	},
	LaunchSettings : launchSettings,
	CoverArt : {
		type : String
	},
	MenuIcon : {
		type : String
	},
	Chapters : {
		type : Array
	}
	
},{ collection : 'Capsules' });

var capsule = mongoose.model('Capsules',capsuleSchema);

/*
chapter.pre('save', function(next){
  //Yes, good. `this` here will be your mongoose model instance
  self = this
  request.get('myapi.com/method', { param_one: this_is_myparam } , function(err, data){
    //Yes, good. All you have to do here is CHANGE the mongoose model instance
    self.myField = data['myFrield']
    //No, bad. This is extraneous. By definition, mongoose is going to save your model
    //automatically after the "preSave" hook completes, so you should remove this.
    //self.save()
    next()
  }
  //No, bad. Remove this as well. You need to wait for the response to come back
  //next()
})
*/
// assign a function to the "methods" object of our capsule schema
/*
capsule.methods.findByIDD = function (cb) {
  return this.model('Capsule').find({ type: this.type }, cb);
}
*/
module.exports = capsule;