var domain = require('./../models/domainModel.js');
var formidable = require('formidable');

// To fetch all domains
var findAll = function(req, res){    
	
	
    domain.find({status:1,isDeleted:{$ne:1}},function(err,result){
		
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
    DomainTitle:req.body.name,
    Notes:req.body.notes,
	status:1
  };
  
  domain(fields).save(function(err){
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
	DomainTitle:req.body.name,
    Notes:req.body.notes,
	status:1
	};
	var query={_id:req.body.id};
	var options = { multi: true };
	domain.update(query, { $set: fields}, options, callback)
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


var uploadfile = function(req,res){
var form = new formidable.IncomingForm(),
        fields = [];        
	//form.uploadDir = __dirname + "/../../public/assets/img/productImg";
	
	form.parse(req, function(err, fields, files) {      
      console.log(files);
	  res.send("asdasdasdasdasd");
    });
	
	
}

exports.uploadfile = uploadfile;

var deleteOne = function(req,res){
	console.log("request params : "+JSON.stringify(req.body));
	var fields={
		isDeleted:1
	};
	var query={_id:req.body.id};
	console.log("id to delete : " + req.body.id);
	var options = { multi: false };
	domain.update(query, { $set: fields}, options, callback)
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