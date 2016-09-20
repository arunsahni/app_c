var fsg = require('./../models/fsgModel.js');
var formidable = require('formidable');

// To fetch all domains
var findAll = function(req, res){    
	
	
    //fsg.find({status:1,isDeleted:{$ne:1}},function(err,result){
	fsg.find({status:1,isDeleted:{$ne:1}}).sort({order:'asc'}).exec(function(err,result){
		
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
	})
    
};

exports.findAll = findAll;


// Add a new domain
var add = function(req,res){
  
  fields={
    Title:req.body.name,
    Values:[],
	status:1
  };
  
  var values=(req.body.values).split(';');
  
  for(k in values){
	fields.Values.push({
		valueTitle:values[k]
	});
  }
  
  
  fsg(fields).save(function(err){
    if(err){
      res.json(err);
    }
    else{
      findAll(req,res)
    }
  });
  
};

exports.add = add;



var edit = function(req,res){
	var dt=Date.now();
	var fields={
	    LastModified:dt,
	Title:req.body.name,
    Values:[],
	status:1
	};
	
	var values=(req.body.values).split(';');
  
	for(k in values){
	fields.Values.push({
		valueTitle:values[k]
	});
	}

	var query={_id:req.body.id};
	var options = { multi: true };
	fsg.update(query, { $set: fields}, options, callback)
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
	fsg.update(query, { $set: fields}, options, callback)
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