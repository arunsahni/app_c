var mongoose = require('mongoose');

var subAdminSchema = new mongoose.Schema({	
	name:{type:String},
	email:{type : String},
	password:{type:String}
});

var subAdmins = mongoose.model('subadmins',subAdminSchema);

module.exports = subAdmins;

