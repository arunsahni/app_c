var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({	
	name:{type:String},
	email:{type : String},
	password:{type:String}
});

var admin = mongoose.model('admin',adminSchema);
module.exports = admin;