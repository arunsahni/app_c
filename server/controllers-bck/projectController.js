var project = require('./../models/projectModel.js');
var formidable = require('formidable');

// To fetch all project
var findAll = function(req, res){    
	
	
    project.find({isDeleted:{$ne:1},OwnerID:req.session.user._id},function(err,result){
		
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				res.json({"code":"404","msg":"Not Found"})
			}
			else{				
				res.json({"code":"200","msg":"Success","response":result})
			}
		}
	}).populate('Domain')
    
};

exports.findAll = findAll;


// Add a new project
/*
var add = function(req,res){
  fields={
    ProjectTitle:req.body.name,
    OwnerID:req.session.user._id,
	Domain:req.body.domain,
	isDeleted:0
  };
  project(fields).save(function(err){
    if(err){
      res.json(err);
    }
    else{
      findAll(req,res)
    }
  });
  
};
*/
//static domain: Work case on 07012015
var add = function(req,res){
  fields={
    ProjectTitle:req.body.name,
    OwnerID:req.session.user._id,
	//Domain:req.body.domain,
	Domain:"53ad6993f222ef325c05039c",
	isDeleted:0
  };
  project(fields).save(function(err){
    if(err){
      res.json(err);
    }
    else{
      findAll(req,res)
    }
  });
  
};
exports.add = add;

/*
var edit = function(req,res){
  
	var  fields={
		ProjectTitle:req.body.name,
		OwnerID:req.session.user._id,
		Domain:req.body.domain,
		isDeleted:0,
		ModifiedOn:Date.now()
	};
	var query={_id:req.body.id};
	var options = { multi: true };
	project.update(query, { $set: fields}, options, callback)
	function callback (err, numAffected) {
		if(err){
			res.json(err)
		}
		else{
			findAll(req,res)
		}
	} 
};
*/

//static domain: Work case on 07012015
var edit = function(req,res){
  
	var  fields={
		ProjectTitle:req.body.name,
		OwnerID:req.session.user._id,
		//Domain:req.body.domain,
		Domain:"53ad6993f222ef325c05039c",
		isDeleted:0,
		ModifiedOn:Date.now()
	};
	var query={_id:req.body.id};
	var options = { multi: true };
	project.update(query, { $set: fields}, options, callback)
	function callback (err, numAffected) {
		if(err){
			res.json(err)
		}
		else{
			findAll(req,res)
		}
	} 
};
exports.edit = edit;


var deleteOne = function(req,res){
	var fields={
		isDeleted:1
	};
	var query={_id:req.body.id};
	var options = { multi: false };
	project.update(query, { $set: fields}, options, callback)
	function callback (err, numAffected) {
		if(err){
			res.json(err)
		}
		else{
			findAll(req,res)
		}
	} 
}
exports.deleteOne = deleteOne;