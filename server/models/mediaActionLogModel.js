var mongoose = require('mongoose');

var mediaActionLogSchema = new mongoose.Schema({
	UserId:{ type : mongoose.Schema.Types.ObjectId },
	MediaId:{ type : mongoose.Schema.Types.ObjectId },
	Title:{ type: String },
	Prompt:{ type:String },
	Locator:{ type: String },
	OwnerId:{ type : mongoose.Schema.Types.ObjectId },
	BoardId:{type : mongoose.Schema.Types.ObjectId}, 
	Action:{ type: String },
	MediaType:{ type:String },
	ContentType:{ type:String },
	UserFsg:{ type:Object },
	CreatedOn:{type : Date, default: Date.now},
	IsDeleted:{ type:Number }
},{ collection: 'MediaActionLogs' });

var mediaActionLog = mongoose.model('MediaActionLog',mediaActionLogSchema);

module.exports = mediaActionLog;