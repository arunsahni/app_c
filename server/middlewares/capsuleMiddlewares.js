var Capsule = require('../models/capsuleModel.js');
var Chapter = require('../models/chapterModel.js');

var capsule__checkCreator = function (req , res , next){
	var capsuleId = req.headers.capsule_id; 
	var userId = req.session.user._id;
	
	var conditions = {
		_id:capsuleId,
		CreaterId : userId,
		Status : true,
		IsDeleted : false
	};
	
	var fields = {
		_id : true
	};
	
	Capsule.find(conditions , fields , function(err , result){
		if( !err ){
			if( result.length ){
				return next();
			}
			else{
				res.send(401, 'Access Denied');
			}
		}
		else{
			res.send(401, 'Access Denied');
		}
	});
}

var capsule__checkOwnership = function (req , res , next){
	var capsuleId = req.headers.capsule_id; 
	var userId = req.session.user._id;
	
	var conditions = {
		_id:capsuleId,
		OwnerId : userId,
		Status : true,
		IsDeleted : false
	};
	
	var fields = {
		_id : true
	};
	
	Capsule.find(conditions , fields , function(err , result){
		if( !err ){
			if( result.length ){
				return next();
			}
			else{
				res.send(401, 'Access Denied');
			}
		}
		else{
			res.send(401, 'Access Denied');
		}
	});
}

var capsule__checkIsSharable = function (req , res , next){
	var capsuleId = req.headers.capsule_id; 
	var userId = req.session.user._id;
	
	var conditions = {
		_id:capsuleId,
		OwnerId : userId,
		Status : true,
		IsDeleted : false
	};
	
	var fields = {
		_id : true
	};
	
	Capsule.find(conditions , fields , function(err , result){
		if( !err ){
			if( result.length ){
				return next();
			}
			else{
				res.send(401, 'Access Denied');
			}
		}
		else{
			res.send(401, 'Access Denied');
		}
	});
}

var capsule__checkPublishStatusAndCreator = function (req , res , next){
	var capsuleId = req.headers.capsule_id; 
	var userId = req.session.user._id;
	
	var conditions = {
		_id:capsuleId,
		CreaterId : userId,
		Status : true,
		IsDeleted : false,
		IsPublished : false
	};
	
	var fields = {
		_id : true
	};
	
	Capsule.find(conditions , fields , function(err , result){
		if( !err ){
			if( result.length ){
				return next();
			}
			else{
				req.session.user = null; // Deletes the cookie.
				res.clearCookie('connect.sid', { path: '/capsule' });
				res.send(401, 'Access Denied');
				return;
			}
		}
		else{
			req.session.user = null; // Deletes the cookie.
			res.clearCookie('connect.sid', { path: '/capsule' });
			res.send(401, 'Access Denied');
			return;
		}
	});
}

var chapter__checkOwnership = function (req , res , next){
	var chapterId = req.headers.chapter_id; 
	var userId = req.session.user._id;
	
	var conditions = {
		_id:chapterId,
		OwnerId : userId,
		Status : true,
		IsDeleted : false
	};
	
	var fields = {
		_id : true
	};
	
	Chapter.find(conditions , fields , function(err , result){
		if( !err ){
			if( result.length ){
				return next();
			}
			else{
				req.session.user = null; // Deletes the cookie.
				res.clearCookie('connect.sid', { path: '/capsule' });
				res.send(401, 'Access Denied');
			}
		}
		else{
			req.session.user = null; // Deletes the cookie.
			res.clearCookie('connect.sid', { path: '/capsule' });
			res.send(401, 'Access Denied');
		}
	});
} 

var chapter__checkMembership = function (req , res , next){
	var chapterId = req.headers.chapter_id; 
	var userId = req.session.user._id;
	
	var conditions = {
		_id : chapterId,
		$or : [{OwnerId : userId},{"LaunchSettings.Invitees.UserID" : userId}],
		//$or : [{OwnerId : userId}],
		Status : true,
		IsDeleted : false
	};
	
	var fields = {
		_id : true
	};
	
	Chapter.find(conditions , fields , function(err , result){
		if( !err ){
			if( result.length ){
				return next();
			}
			else{
				req.session.user = null; // Deletes the cookie.
				res.clearCookie('connect.sid', { path: '/capsule' });
				res.send(401, 'Access Denied');
				
			}
		}
		else{
			req.session.user = null; // Deletes the cookie.
			res.clearCookie('connect.sid', { path: '/capsule' });
			res.send(401, 'Access Denied');
			
		}
	});
} 


var chapter__checkIsSharable = function (req , res , next){
	var chapterId = req.headers.chapter_id; 
	var userId = req.session.user._id;
	
	var conditions = {
		_id:chapterId,
		OwnerId : userId,
		Status : true,
		IsDeleted : false
	};
	
	var fields = {
		_id : true
	};
	
	Chapter.find(conditions , fields , function(err , result){
		if( !err ){
			if( result.length ){
				return next();
			}
			else{
				req.session.user = null; // Deletes the cookie.
				res.clearCookie('connect.sid', { path: '/capsule' });
				res.send(401, 'Access Denied');
			}
		}
		else{
			req.session.user = null; // Deletes the cookie.
			res.clearCookie('connect.sid', { path: '/capsule' });
			res.send(401, 'Access Denied');
		}
	});
}

//capsule level authorization
exports.capsule__checkCreator = capsule__checkCreator;
exports.capsule__checkOwnership = capsule__checkOwnership;
exports.capsule__checkIsSharable = capsule__checkIsSharable;
exports.capsule__checkPublishStatusAndCreator = capsule__checkPublishStatusAndCreator;

//chapter level authorization
exports.chapter__checkOwnership = chapter__checkOwnership
exports.chapter__checkMembership = chapter__checkMembership
exports.chapter__checkIsSharable = chapter__checkIsSharable;