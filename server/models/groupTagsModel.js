var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	TagTitle:{type:String},
	DateAdded : { type : Date, default: Date.now },
	LastModified : { type : Date, default: Date.now },
	gtTitle:{type:String},
	gtId:{type:String},
	status:{type:Number}
})

var moreSchema = new mongoose.Schema({
	GroupTagId:{type:String},
	GroupTagName:{type:String}
})

var lessSchema = new mongoose.Schema({
	GroupTagId:{type:String},
	GroupTagName:{type:String}
})

var thinkSchema = new mongoose.Schema({
	GroupTagId:{type:String},
	GroupTagName:{type:String}
})
var groupTagSchema = new mongoose.Schema({
	GroupTagTitle:{type:String},
	Notes:{type:String},
	MetaMetaTagID:{ type: mongoose.Schema.Types.ObjectId, ref: 'metaMetaTags' },
	MetaTagID:{type:String},
	More:[moreSchema],
	Less:[lessSchema],
	Think:[thinkSchema],
	Tags:[tagSchema],	
	DateAdded : { type : Date, default: Date.now },
	LastModified : { type : Date, default: Date.now },
	status:{type:Number} // status is 3 for descriptor case// 1 active gt // 2 user gt // 0 deleted gt
	
}, { collection: 'groupTags' });
var groupTag = mongoose.model('groupTags',groupTagSchema);


module.exports = groupTag;
