var mongoose = require('mongoose');

fsgValueSchema = new mongoose.Schema({
	valueTitle:{type:String}
})

var fsgSchema = new mongoose.Schema({
	Title:{type:String},
	Values:[fsgValueSchema],
	status:{type:Number},
	DateAdded : { type : Date, default: Date.now },
	LastModified : { type : Date, default: Date.now },
	isDeleted:{type:Number}
}, { collection: 'FSGs' });

var fsg = mongoose.model('FSGs',fsgSchema);

module.exports = fsg;

