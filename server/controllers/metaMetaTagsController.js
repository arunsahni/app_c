var metaMetaTags = require('./../models/metaMetaTagsModel.js');
var groupTags = require('./../models/groupTagsModel.js');
// Find all meta tags
var findAll = function(req, res){    
	
	metaMetaTags.find({status:1},function(err,result){
    //metaMetaTags.find({status:1,_id:{$ne:'54e7211a60e85291552b1187'}},function(err,result){	//for ===5555
	//metaMetaTags.find({status:1,_id:{$ne:'54c98aab4fde7f30079fdd5a'}},function(err,result){ //for=======8888	
		
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
	});
    
};

exports.findAll = findAll;

// Find all meta meta tags of particular domain
var findDomainAll = function(req, res){    	
    metaMetaTags.find({status:1,"Domains.DomainId":req.body.domainid},function(err,result){
		console.log(result)
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
	}).populate('DomainTitle');
    
};

exports.findDomainAll = findDomainAll;

// added by parul 

function chkMmt(abc,callback){
    metaMetaTags.find({status:1,MetaMetaTagTitle:abc},function(err,result){
	if (err) {
	    throw err;
	    	}
	    else{
		    callback(result);
		}
	
	
	});
};

function chkMt(req,callback){
    metaMetaTags.find({status:1},function(err,result){
	if (err) {
	    throw err;
	    	}
	    else{ var mts=[];
	    var dup=false
		 for(a in result){
			for(b in result[a].MetaTags){
			    if(result[a].MetaTags[b].MetaTagTitle==req.body.name){
			       if (req.body.metaid) {
				if (req.body.metaid==result[a].MetaTags[b]._id) {
				    
				}else{ 
				    var dup=true;
				}
			       }else{
				var dup=true;
			       }
			    }
			    
			}
		    }
		callback(dup);		
		}
	
	
	});
};

//modified by parul

var add = function(req,res){
  //console.log(req.body.name);
  chkMmt(req.body.name,function(response){
    if (response.length!=0) {
	//console.log(result);
	res.json({"code":"400"});
    }else{
	    if(typeof(req.body.domainid)!='undefined'){
      
	    fields={
		    MetaMetaTagTitle:req.body.name,
		    Notes:req.body.notes,
		    DateAdded:Date.now(),
		    Domains:[],
		    status:1
	    };
	    
	    fields.Domains.push({
		DomainTitle:req.body.title,
		DomainId:req.body.domainid
	    });
	    
	    
      }else{
      
	    fields={
		    MetaMetaTagTitle:req.body.name,
		    Notes:req.body.notes,
		    DateAdded:Date.now(),
		    status:1
	    };
      
      }
      
      
      metaMetaTags(fields).save(function(err){
	if(err){
	  res.json(err);
	}
	else{
	  if(typeof(req.body.domainid)!='undefined'){
		    findDomainAll(req,res)
	      }
	      else{
		    findAll(req,res)
	      }
	  //res.json({"code":"200","response":});
	}
      });
      
    }
    });
 
 
  
  
};

exports.add = add;

//modified by parul

var edit = function(req,res){

metaMetaTags.find({_id:req.body.id,status:1},function(err,data){
    if (err) {
	res.json(err);
    }
    else{
	if(data[0].MetaMetaTagTitle==req.body.name) {
	
	var fields={
	MetaMetaTagTitle:req.body.name,
	Notes:req.body.notes,
	LastModified:Date.now(),
	Domains:[],
	status:1
	};
	
	
	
	var query={_id:req.body.id};
	var options = { multi: true };
	metaMetaTags.update(query, { $set: fields}, options, function(err, numAffected){
	    if(err){
			res.json(err)
		}
		else{
			if(typeof(req.body.domainid)!='undefined'){
				findDomainAll(req,res)
			}
			else{
				findAll(req,res)
			}
		}
	    
	    });
    }else{
	 chkMmt(req.body.name,function(response){
	 if (response.length!=0) {
	//console.log(result);
	res.json({"code":"400"});
    }else{
	var fields={
	MetaMetaTagTitle:req.body.name,
	Notes:req.body.notes,
	LastModified:Date.now(),
	Domains:[],
	status:1
	};
	
	
	
	var query={_id:req.body.id};
	var options = { multi: true };
	metaMetaTags.update(query, { $set: fields}, options, function(err, numAffected){
	    if(err){
			res.json(err)
		}
		else{
			if(typeof(req.body.domainid)!='undefined'){
				findDomainAll(req,res)
			}
			else{
				findAll(req,res)
			}
		}
	    
	    });
	
    }
    });
    }
    }
    }); 
  

	 
};

exports.edit = edit;

var addDomain = function(req,res){
  
  fields={
    DomainTitle:req.body.title,
    DomainId:req.body.domainid
  };
  
  console.log(req.body.id);
  
  metaMetaTags.findOne({_id:req.body.id},function(err,result){
  //console.log(res)
  var mmt = result;  
  mmt.Domains.push(fields);
  mmt.save(function(err){
	if(err)
	res.json(err);
	else
	findDomainAll(req,res)
  });   
  })
  
  
};

exports.addDomain = addDomain;

var addDomains = function(req,res){
  
  console.log(req.body);
  
  
  metaMetaTags.findOne({_id:req.body.mmt},function(err,result){
  //console.log(res)
  var mmt = result;
  
  mmt.Domains=[];
  
  for(key in req.body.domains){
	mmt.Domains.push({DomainId:req.body.domains[key]});	
  }
  console.log(mmt.Domains)
  mmt.save(function(err){
	if(err)
	res.json(err);
	else{
	metaMetaTags.find({status:1},function(err,result){
		
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
	});
	}
  });   
  })
  
  
};

exports.addDomains = addDomains;



var findMeta = function(req, res){    
	
	var fields={
	_id:req.body.id
	}
	
    metaMetaTags.find(fields,function(err,result){
		
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				res.json({"code":"404","msg":"Not Found"})
			}
			else{
			    var data=[];
			    for (i=0;i<result[0].MetaTags.length;i++) {
				//code
				if (result[0].MetaTags[i].status==0) {
				    //code
				}else{
				    
				    data.push(result[0].MetaTags[i]);
				}
			    }
				res.json({"code":"200","msg":"Success","response":data})
			}
		}
	});
    
};

exports.findMeta = findMeta

var addMeta = function(req,res){
  chkMt(req,function(dup){
    if (dup) {
	res.json({"code":"400","msg":"duplicate name"});
    }else{
	
	fields={
	 MetaTagTitle:req.body.name,
	 Notes:req.body.notes,
	 DateAdded:Date.now(),
	     status:1	
       };
       
       console.log(req.body.id);
       
       metaMetaTags.findOne({_id:req.body.id},function(err,result){
       //console.log(res)
       var mmt = result;
       mmt.MetaTags.push(fields);
       mmt.save(function(err){
	     if(err)
	     res.json(err);
	     else
	     findMeta(req,res)
       });   
       }) 
    }
    
	
    
    })
  
  
  
};

exports.addMeta = addMeta;

var editMeta = function(req,res){
    chkMt(req,function(dup){
	if (dup) {
	    res.json({"code":"400","msg":"duplicate name"});
	}else{
	    var dt=Date.now();
	fields={
	  LastModified:dt,
	  _id:req.body.metaid,
	  MetaTagTitle:req.body.name,
	  Notes:req.body.notes,
	  DateAdded:Date.now(),
	  status:1	
	};
	
	metaMetaTags.findOne({_id:req.body.id},function(err,result){
	
	var mmt = result;
	mmt.MetaTags.id(req.body.metaid).remove();
	mmt.MetaTags.push(fields);
	mmt.save(function(err){
	      if(err)
	      res.json(err);
	      else
	      findMeta(req,res)
	});   
	})
	}
		
    });
 
  
  
};

exports.editMeta = editMeta;


// modified by parul shukla--on 1-dec-2014
var deleteOne = function(req,res){
    groupTags.remove({MetaMetaTagID:req.body.id},function(err,data){
	if(err){
	    res.json(err);
	}else{
	    var fields={
		status:0
	    };
	    var query={_id:req.body.id};
	    var options = { multi: false };
	    metaMetaTags.update(query, { $set: fields}, options, function(err, numAffected){
		if(err){
			    res.json(err)
		    }
		    else{
			    findAll(req,res)
		    }
		
		});	    
	}
	});
	 
}

exports.deleteOne = deleteOne;


// modified by parul shukla-- on 1-dec-2014
var deleteMeta = function(req,res){
   groupTags.remove({MetaTagID:req.body.mtid},function(err,data){
	if(err){
	    res.json(err);
	}else{
		fields={
		_id:req.body.mtid,
		MetaTagTitle:req.body.name,
		    status:0
	      };
	      
	      metaMetaTags.findOne({_id:req.body.id},function(err,result){
	      
	      var mt = result;
	      mt.MetaTags.id(req.body.mtid).remove();
	      mt.MetaTags.push(fields);
	      mt.save(function(err){
		    if(err)
		    res.json(err);
		    else
		    findMeta(req,res)
	      });   
	      })
	      
	}
	});
};

exports.deleteMeta = deleteMeta;