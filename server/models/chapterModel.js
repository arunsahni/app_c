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
	MakingFor : {						//ME & OTHERS & SUBSCRIBERS
		type : String , 
		default : 'ME'
	},	
	NamingConvention : {
		type : String,
		default : 'realnames'
	},
	/*
	dependent on MakingFor(Audience) = ME :- (private/public/friend-solo/friend-group)
	Public can NOT be private,  
	Private can be public/Friend-Solo/Friend-Group at any point,
	Friend-Solo can be public/Friend-Group
	*/
	ShareMode : {						//(private/public/friend-solo/friend-group)
		type : String,
		default : "private"
	},			
	Invitees : [inviteeSchema],
	OthersData : [inviteeSchema]
	//MusicLibrary:[]
};

var chapterSchema = new mongoose.Schema({	
	CapsuleId : {
		type : String
	},
	Origin:{
		type : String,
		enum : ["created","shared","byTheHouse","duplicated","addedFromLibrary","createdForMe","published","purchased","gifted"],
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
		default : "Untitled Chapter", 
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
	pages : {
		type : Array
	}
	
},{ collection : 'Chapters' });

var chapter = mongoose.model('Chapters',chapterSchema);

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
module.exports = chapter;