var mongoose = require('mongoose');

var metaTagSchema = new mongoose.Schema({
	MetaTagTitle:{type:String},
	Notes:{type:String},
	DateAdded : { type : Date, default: Date.now },
	LastModified : { type : Date, default: Date.now },
	status:{type:Number}	
})

var domainSchema = new mongoose.Schema({
	DomainId:{type:String}	
})

var metaMetaTagSchema = new mongoose.Schema({
	MetaMetaTagTitle:{type:String},
	Notes:{type:String},
	MetaTags:[metaTagSchema],
	Domains:[domainSchema],
	DateAdded : { type : Date, default: Date.now },
	LastModified : { type : Date, default: Date.now },
	status:{type:Number},
	Type : {type:String,enum:["GalleryMMT" , "Other"],default : "Other"}	//added on 16032016 by manishp for other MMTs
}, { collection: 'metaMetaTags' });

var metaMetaTag = mongoose.model('metaMetaTags',metaMetaTagSchema);

module.exports = metaMetaTag;