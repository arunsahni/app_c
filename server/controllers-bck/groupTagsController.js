var groupTags = require('./../models/groupTagsModel.js');

// Find all group tags
var findAll = function(req, res){    
	
	
    groupTags.find({$or:[{status:1},{status:3}]},function(err,result){		
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
    }).populate('MetaMetaTagID');
    
};

exports.findAll = findAll;

// Find all group tags
var withoutDescriptors = function(req, res){    
    groupTags.find({status:1},function(err,result){		
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
    }).populate('MetaMetaTagID');
    
};

exports.withoutDescriptors = withoutDescriptors;

// find all user defined group tags ---parul


var findAllUserGt = function(req, res){    
	
	
    groupTags.find({status:2},function(err,result){
		
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
	}).populate('MetaMetaTagID');
    
};

exports.findAllUserGt = findAllUserGt;


// Find all meta tags
var findById = function(req, res){    
		
    groupTags.find({_id:req.body.id},function(err,result){
		
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

exports.findById = findById;


// Find all meta tags
var findMTAll = function(req, res){    
	
	
    groupTags.find({MetaTagID:req.body.mt},function(err,result){
		
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

exports.findMTAll = findMTAll;

// Find all meta tags
var findAllBinding = function(req, res){    
	
	
    groupTags.find({_id:req.body.id},function(err,result){
		
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

exports.findAllBinding = findAllBinding;





var deleteOne = function(req,res){
	var fields={
		status:0
	};
	var query={_id:req.body.id};
	var options = { multi: true };
	if (req.body.status==2) {
		groupTags.update(query, { $set: fields}, options, function(err, numAffected){
			if(err){
				res.json(err)
			}
			else{
				findAllUserGt(req,res)
			}
		});    
	}else{
		groupTags.update(query, { $set: fields}, options, function(err, numAffected){
			if(err){
				res.json(err)
			}
			else{
				findAll(req,res)
			}
		});
	}
}

exports.deleteOne = deleteOne;

function chkGt(abc,callback){
    groupTags.find({status:1,GroupTagTitle:abc},function(err,result){
	if (err) {
	    throw err;
	    	}
	    else{
		    callback(result);
		}
	});
};

var add = function(req,res){
    chkGt(req.body.name,function(response){
    
		if (response.length!=0){
			res.json({"code":"400"});
		}else{    
			groupTags.find({status:1,})
			fields={
				GroupTagTitle:req.body.name,
				Notes:req.body.notes,
				DateAdded:Date.now(),
				MetaMetaTagID:req.body.mmt,
				MetaTagID:req.body.mt,
				status:1
			};      
			groupTags(fields).save(function(err,data){
				if(err){
					
				  res.json(err);
				}
				else{
					groupTags.findOne({_id:data._id},function(err,gtData){
						gtData.Tags.push({
							TagTitle:req.body.name,
							status:1
						});
						gtData.save();
					})
				  findAll(req,res)
				  //res.json({"code":"200","response":});
				}
			});
		}
	});
  
};

exports.add = add;




var edit = function(req,res){
    
    groupTags.find({_id:req.body.id,status:1},function(err,data){
	if (err) {
	    res.json(err);
	}else{
	    
	    if (data[0].GroupTagTitle==req.body.name) {
		//console.log(1);
		 var fields={
		GroupTagTitle:req.body.name,
		Notes:req.body.notes,
		MetaMetaTagID:req.body.mmt,
		MetaTagID:req.body.mt,
		status:1
		};
		var query={_id:req.body.id};
		var options = { multi: true };
		groupTags.update(query, { $set: fields}, options,function(err, numAffected){
		    if(err){
				res.json(err)
			}
			else{
				findAll(req,res)
			}
		    });
	    }else{
		//console.log(2);
		 chkGt(req.body.name,function(response){
		  if (response.length!=0){
		     res.json({"code":"400"});
		    }else{
		     var fields={
			 GroupTagTitle:req.body.name,
			 Notes:req.body.notes,
			 MetaMetaTagID:req.body.mmt,
			 MetaTagID:req.body.mt,
			 status:1
			 };
			 var query={_id:req.body.id};
			 var options = { multi: true };
			 groupTags.update(query, { $set: fields}, options,function(err, numAffected){
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
	}
	});
    
    

	
};

exports.edit = edit;

// approve group tag---parul

var approve = function(req,res){
	chkGt(req.body.name,function(response){
    if (response.length!=0){
	res.json({"code":"400"});
    }else{
		var fields={
			GroupTagTitle:req.body.name,
			Notes:req.body.notes,
			MetaMetaTagID:req.body.mmt,
			MetaTagID:req.body.mt,
			status:1
		};
		var query={_id:req.body.id};
		var options = { multi: true };
		groupTags.update(query, { $set: fields}, options,function(err, numAffected){
			if(err){
				res.json(err)
			}
			else{
				groupTags.findOne({_id:req.body.id},function(err,gtData){
				gtData.Tags.push({
					TagTitle:req.body.name,
					status:1
				});
				gtData.save();
			})
				findAllUserGt(req,res)
			}
		});
			
	}
	});
	 
};

exports.approve = approve;



var addBinding = function(req,res){
  
  groupTags.find({_id:req.body.gt},function(err,result){
		var fields={};
		if(err){ 		
			res.json(err);
		}
		else{
			fields={
				GroupTagName:result[0].GroupTagTitle,
				GroupTagId:result[0]._id 	
			};
			
			groupTags.findOne({_id:req.body.id},function(err,result1){			  
				var gt = result1;
				if(req.body.call=="More")
					gt.More.push(fields);
				else if(req.body.call=="Less")
					gt.Less.push(fields);
				else
					gt.Think.push(fields);
					
				gt.save(function(err){
					if(err)
						res.json(err);
					else
						findById(req,res)
				});   
			})		
			
		}
	});
  
  
  
  
  
  
};

exports.addBinding = addBinding;


var deleteBinding = function(req,res){
 
  
    groupTags.findOne({_id:req.body.id},function(err,result){
    
	var gt = result;
	
	if(req.body.call=="More"){
	    gt.More.id(req.body.tagid).remove();	
	}
	else if(req.body.call=="Less"){
	    gt.Less.id(req.body.tagid).remove();
	}
	else{
	    gt.Think.id(req.body.tagid).remove();
	}
	gt.save(function(err){
	    if(err)
		res.json(err);
	    else
		findById(req,res)
	});	  
    })
  
  
};

exports.deleteBinding = deleteBinding;


var findTag = function(req, res){    
	
	var fields={
	_id:req.body.id
	}
	
    groupTags.find(fields,function(err,result){
		
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				res.json({"code":"404","msg":"Not Found"})
			}
			else{				
				res.json({"code":"200","msg":"Success","response":result[0].Tags})
			}
		}
	});
    
};

exports.findTag = findTag

//var addTag = function(req,res){
//  
//  var tags = req.body.name;
//  tags = tags.split(',');
//  
//  groupTags.findOne({_id:req.body.id},function(err,result){
//  //console.log(res)
//  var gt = result;
//  for(k in tags){
//	gt.Tags.push({
//		TagTitle:tags[k],
//		status:1
//	});
//  }
//  gt.save(function(err){
//	if(err)
//	res.json(err);
//	else
//	findTag(req,res)
//  });   
//  })
//  
//  
//};
var addTag = function(req,res){
  
  var tags = req.body.name;
  tags = tags.split(',');
  
  groupTags.findOne({_id:req.body.id},function(err,result){
  //console.log(res)
  var gt = result;
  var gtChanged=false;
  for(k in tags){
	var duplicate=false;
	for (j in gt.Tags) {
		if (gt.Tags[j].TagTitle==tags[k]) {
			duplicate=true;
		}
	}
	
	if (!duplicate) {
		gtChanged=true;
		gt.Tags.push({
			TagTitle:tags[k],
			status:1
		});
	}
  }
  if (gtChanged) {
	gt.save(function(err){
	if(err)
	res.json(err);
	else
	findTag(req,res)
  });
  }else{
		res.json({'code':'420','response':'duplicate tag'});
		return;
	}
     
  })
  
  
};

exports.addTag = addTag;

var editTag = function(req,res){
  
  fields={
	_id:req.body.tagid,
    TagTitle:req.body.name,
	status:1
  };
  
  groupTags.findOne({_id:req.body.id},function(err,result){
  
  var gt = result;
  gt.Tags.id(req.body.tagid).remove();
  gt.Tags.push(fields);
  gt.save(function(err){
	if(err)
	res.json(err);
	else
	findTag(req,res)
  });   
  })
  
  
};

exports.editTag = editTag;


var deleteTag = function(req,res){
  
    fields={
	_id:req.body.tagid,
	TagTitle:req.body.name,
	status:0
    };
    
    groupTags.findOne({_id:req.body.id},function(err,result){
    
	var gt = result;
	gt.Tags.id(req.body.tagid).remove();
	gt.Tags.push(fields);
	gt.save(function(err){
	    if(err)
	    res.json(err);
	    else
	    findTag(req,res)
	});
	
    })
  
  
};

exports.deleteTag = deleteTag;


// function to update status of approved tag in parent  gt---- added by --parul shukla---on ---27 November


var updateUserTag=function(req,res){
    var dt=Date.now();
  fields={
    _id:req.body._id,
    TagTitle:req.body.TagTitle,
    LastModified:dt,
    status:1
  };
  
  groupTags.findOne({_id:req.body.gtId},function(err,result){
  
  var gt = result;
  gt.Tags.id(req.body._id).remove();
  gt.Tags.push(fields);
  gt.save(function(err){
	if(err)
	res.json(err);
	else
	findAllUserTags(req,res)
  });   
  })
}
exports.updateUserTag=updateUserTag;



// function to add approved tag to new system suggested gt's---- added by --parul shukla---on ---27 November
var addUserTags=function(req,res){
    fields={    
	DateAdded:Date.now(),
	LastModified:Date.now(),
	TagTitle:req.body.TagTitle,
	    status:1
      };
    for (t in req.body.newGT) {
    groupTags.findOne({_id:req.body.newGT[t]._id},function(err,result){
    var gt = result;
    gt.Tags.push(fields);
    gt.save(function(err){
	  if(err)
	  {res.json(err);}
	  else if((t+1)==req.body.newGT.length) {
	    findAllUserTags(req,res);
	  }
	  
	 
    });   
    })
    }
    findAllUserTags(req,res);
}
exports.addUserTags=addUserTags;




//edit user tag created by ---Parul Shuklla on--- 26 november


var editUserTag = function(req,res){
  var dt=Date.now();
  fields={
	_id:req.body._id,
    LastModified:dt,
    TagTitle:req.body.TagTitle,
	status:2
  };
  
  groupTags.findOne({_id:req.body.gtId},function(err,result){
  
  var gt = result;
  gt.Tags.id(req.body._id).remove();
  gt.Tags.push(fields);
  gt.save(function(err){
	if(err)
	res.json(err);
	else
	findAllUserTags(req,res)
  });   
  })
  
  
};

exports.editUserTag = editUserTag;


/// find all user added tags under group tags -------Parul Shukla on- 26th november
var findAllUserTags=function(req,res){
    
    groupTags.find({status:1},function(err,result){
		
		if(err){ 		
			res.json(err);
		}
		else{
		    var tags=[];
			for(x in result){
			    for(tg in result[x].Tags ){
				if (result[x].Tags[tg].status==2) {
				result[x].Tags[tg].gtTitle= result[x].GroupTagTitle;
				result[x].Tags[tg].gtId= result[x]._id;
				tags.push(result[x].Tags[tg]);
				//console.log(result[x].Tags[tg]);
				}
			    }
			}
			res.json({"code":"200","msg":"success","response":tags});
		}
	}).populate('MetaMetaTagID');
    
};
exports.findAllUserTags=findAllUserTags;




// delete group tag added by ---parul shukla on---- 26th november 



var deleteUserTag = function(req,res){
  
    
    groupTags.findOne({_id:req.body.gtId},function(err,result){
    
    
    for(x in result.Tags){
	if (result.Tags[x]._id==req.body._id) {
	    var index=x;
	}
	
    }
    result.Tags.splice(index,1);
	result.save(function(err){
	    if(err){
		res.json(err);
	    }else{
		findAllUserTags(req,res);
	    }
	    });
	
    /*
	var gt = result;
	gt.Tags.id(req.body.tagid).remove();
	gt.Tags.push(fields);
	gt.save(function(err){
	    if(err)
	    res.json(err);
	    else
	    findTag(req,res)
	});*/
	
    })
  
  
};

exports.deleteUserTag = deleteUserTag;



/*________________________________________________________________________
	* @Date:      	21 May 2015
	* @Method :   	findPerPage
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used get only limited no of grouptags per page.
	* @Param:     	4
	* @Return:    	no
_________________________________________________________________________
*/
var findPerPage = function(req,res){
	groupTags.find({$or:[{status:1},{status:3}]}).skip(req.body.offset).limit(req.body.limit).populate('MetaMetaTagID').exec(function(err,result){		
	if(err){ 		
		res.json(err);
	}
	else{
	    if(result.length==0){
		    res.json({"code":"404","msg":"Not Found"})
	    }
	    else{
			groupTags.find({$or:[{status:1},{status:3}]},function(err,data){
				if (!err) {
					res.json({"code":"200","msg":"Success","response":result,"count":data.length })
				}
				else{
					res.json({"code":"200","msg":"Success","response":result,"count": 0 })
				}
			});
		    
	    }
	}
    });
}
exports.findPerPage = findPerPage;