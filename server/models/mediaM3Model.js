var mongoose = require('mongoose');

var mediaLocationSchema = new mongoose.Schema({
	Size:{type:String},
	URL:{type:String}	
})

var groupTagSchema = new mongoose.Schema({
	GroupTagID:{type:String}
})

//updated on 21072014
var viewInfoSchema = new mongoose.Schema({
	Users:[
		{
			//By:{type : String},
			//On:{type : Date , Default : Date.now},
			UserFSGs: { type : Object }
		}
	]
});

//Select Info
var selectInfoSchema = new mongoose.Schema({
	Users:[
		{
			//By:{type : String},
			//On:{type : Date , Default : Date.now},
			UserFSGs: { type : Object }
		}
	]
});

//Post Info
var postInfoSchema = new mongoose.Schema({	
	Users:[
		{
			//By:{type : ObjectId},
			//On:{type : Date , Default : Date.now},
			UserFSGs: { type : Object }
		}
	]
});

//Mark Info
var markInfoSchema = new mongoose.Schema({
	Users:[
		{
			//By:{type : ObjectId},
			//On:{type : Date , Default : Date.now},
			UserFSGs: { type : Object }
		}
	]
});

//Stamp Info
var stampInfoSchema = new mongoose.Schema({
	Users:[
		{
			//By:{type : ObjectId},
			//On:{type : Date , Default : Date.now},
			UserFSGs: { type : Object }
		}
	]
});


var mediaSchema = new mongoose.Schema({
	Title:{ type: String },
	Prompt:{ type:String },
	Locator:{ type: String },
	UploadedBy:{type:String},
	UploadedOn:{type : Date, default: Date.now},
	UploaderID:{type:String},
	Notes:{type:String},
	Collection:{ type: mongoose.Schema.Types.ObjectId, ref: 'Collections' },
	Source:{type:String},
	SourceUniqueID:{ type: mongoose.Schema.Types.ObjectId, ref: 'Sources' },
	GroupTags:[groupTagSchema],
	AddedWhere:{ type : String },
	Location:[mediaLocationSchema],
	Status:{ type:Number },
	IsDeleted:{ type:Number },
	ViewsCount:{type : Number},
	Views:{type:Object},
	Selects:{type:Object},
	Posts:{type:Object},
	Marks:{type:Object},
	Stamps:{type:Object}
},{shardKey:{_id: 1}},{ collection: 'mediam3' });

var mediaM3 = mongoose.model('MediaM3',mediaSchema);

module.exports = mediaM3;