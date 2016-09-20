var groupTags = require('./../models/groupTagsModel.js');
var media = require('./../models/mediaModel.js');
var mongoose = require('mongoose');

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


// Smooth-Media Manager - Find all group tags of a mt
var findAllGtOfMt = function(req, res){    
	var MetaMetaTag = req.query.mmt ? req.query.mmt : "";
	var MetaTag = req.query.mt ? req.query.mt : "";
	
	var conditions = {
		MetaMetaTagID : MetaMetaTag,
		MetaTagID : MetaTag,
		$or:[{status:1},{status:3}]
	};
	
	var fields = {
		
	};
	
	groupTags.find(conditions , fields ,function(err,result){		
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

exports.findAllGtOfMt = findAllGtOfMt;

// Find all group tags
var withoutDescriptors = function(req, res){    
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
    });
    
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
	if(abc){
		abc = abc ? abc.trim() : "";	//added by manishp on 09032016
	}

    //groupTags.find({$or:[{status:1},{status:3}],GroupTagTitle:{ $regex : new RegExp(abc, "i") }},function(err,result){
	groupTags.find({$or:[{status:1},{status:3}],GroupTagTitle:abc},function(err,result){
		if (err) {
			throw err;
	    }
	    else{
		    callback(result);
		}
	});
};

var add = function(req,res){
	if(req.body.name){
		req.body.name = req.body.name ? req.body.name.trim() : "";	//added by manishp on 09032016
	}
	
	if(req.body.name != ""){
		chkGt(req.body.name,function(response){
    
			if (response.length > 1 ){
				res.json({"code":"400"});
			}else if (response.length == 1 && response[0].status == 1) {
				res.json({"code":"400"});
			}else if (response.length == 1 && response[0].status == 3) {
				console.log("==================================================");
				console.log('gt id ==== ',response[0]._id)
				console.log("==================================================");
				fields={
					GroupTagTitle:req.body.name,
					Notes:req.body.notes,
					DateAdded:Date.now(),
					MetaMetaTagID:req.body.mmt,
					MetaTagID:req.body.mt,
					status:1
				};
				//custom descriptor check on 11032016 by manishp
				if(String(req.body.mmt) == "54c98aab4fde7f30079fdd5a"){
					fields.status = 3;
				}
				
				groupTags.update({_id : response[0]._id}, { $set: fields}, {multi:false},function(err, numAffected){
					if (!err) {
						console.log(numAffected);
					}
				});
			}
			else{    
				//groupTags.find({status:1,})
				fields={
					GroupTagTitle:req.body.name,
					Notes:req.body.notes,
					DateAdded:Date.now(),
					MetaMetaTagID:req.body.mmt,
					MetaTagID:req.body.mt,
					status:1
				};      
				
				//custom descriptor check on 11032016 by manishp
				if(String(req.body.mmt) == "54c98aab4fde7f30079fdd5a"){
					fields.status = 3;
				}
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
						// findAll(req,res)
						// commentd by parul calling listing function from fronentd
						res.json({"code":"200","response":'gt saved'});
					}
				});
			}
		});
	}else{
		res.json({"code":"400"});
	}
  
};

exports.add = add;




var edit = function(req,res){
    if(req.body.name){
		req.body.name = req.body.name ? req.body.name.trim() : "";	//added by manishp on 09032016
	}
	
	if(req.body.name != ""){
		//groupTags.find({_id:req.body.id,status:1},function(err,data){
		groupTags.find({_id:req.body.id},function(err,data){
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
					
					if(String(req.body.mmt) == "54c98aab4fde7f30079fdd5a"){
						fields.status = 3;
					}
					
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

							if(String(req.body.mmt) == "54c98aab4fde7f30079fdd5a"){
								fields.status = 3;
							}
							
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
	}
	else{
		res.json({"code":"400"});
	}
};

exports.edit = edit;

// approve group tag---parul

var approve = function(req,res){
	if(req.body.name){
		req.body.name = req.body.name ? req.body.name.trim() : "";	//added by manishp on 09032016
	}
	
	if(req.body.name != ""){
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
	}else{
		res.json({"code":"400"});
	}
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
		  var gt = result;
		  var gtChanged=false;
		  for(var k = 0; k < tags.length ; k++){
			var duplicate=false;
			for (var j = 0; j < gt.Tags.length ; j++) {
				if (gt.Tags[j].TagTitle.toLowerCase()==tags[k].toLowerCase()) {
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
	var fields={
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
    var fields={    
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
				if(err){
					res.json(err);
				}
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
	req.body.TagTitle = req.body.TagTitle ? req.body.TagTitle.trim() : "";
	if(req.body.TagTitle != ""){
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
	}else{
		findAllUserTags(req,res)
	}
};

exports.editUserTag = editUserTag;

// find all user added tags under group tags -------Parul Shukla on- 26th november
var findAllUserTags=function(req,res){
	var conditions = {
		$or:[{status:1},{status:3}]
	};
	
	var fields = {
		_id : true,
		GroupTagTitle : true,
		Tags : true
	};
	
    groupTags.find(conditions,fields,function(err,result){
		if(err){ 		
			res.json(err);
		}
		else{
		    var tags=[];
			for(x in result){
			    for(tg in result[x].Tags ){
					if (result[x].Tags[tg].status==2) {						//user added tags under group tags - Need to remember the case, when tags will be added by user.
						result[x].Tags[tg].gtTitle= result[x].GroupTagTitle;
						result[x].Tags[tg].gtId= result[x]._id;
						tags.push(result[x].Tags[tg]);
						//console.log(result[x].Tags[tg]);
					}
			    }
			}
			res.json({"code":"200","msg":"success","response":tags});
		}
	});
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
	//groupTags.find({$or:[{status:1},{status:3}]}).sort({DateAdded:1}).skip(req.body.offset).limit(req.body.limit).populate('MetaMetaTagID').exec(function(err,result){		
	groupTags.find({$or:[{status:1},{status:3}]}).sort({DateAdded:1}).skip(req.body.offset).limit(req.body.limit).populate('MetaMetaTagID').exec(function(err,result){		
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

/*________________________________________________________________________
	* @Date:      	17 july 2015
	* @Method :   	delete__duplicateDescriptor
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	27 july
	* @Purpose:   	This function is used to delete duplicate keywords.
	* @Param:     	2
	* @Return:    	no
_________________________________________________________________________
*/
var delete__duplicateDescriptor = function(req,res){
	groupTags.find({status:3}, function(err , data1){
		if (!err) {
			var descriptors = data1;
			groupTags.find({status:1}, function(err , data){
				if (!err) {
					var dup = 0;
					var del_keywords = [];
					for (var i = 0 ; i < data.length ; i++ ) {
						for(var j =0; j < descriptors.length; j++){
							if (data[i].GroupTagTitle.toLowerCase() == descriptors[j].GroupTagTitle.toLowerCase()) {
								del_keywords.push(data[i].GroupTagTitle);
								addRef_toMedia(data[i]._id,descriptors[j]._id);
								groupTags.remove({_id:descriptors[j]._id},function(){
									console.log('deleted')
								});
								dup++;
							}
						}
					}
					console.log(dup);
				}
			});
		}
	})
}

//added by manishp
var delete__duplicateDescriptor_2 = function(req,res){
	var searchObj = {
		map: function (){
			emit(
				this.GroupTagTitle.trim(),
				{
					id:this._id , 
					count:1 , 
					keywords:[
								{
									id:this._id,
									GroupTagTitle:this.GroupTagTitle,
									status:this.status
								}
					],
					replace_with_id:"",
					remaining_ids:[],
					remaining_objids : []
				}
			);
		},
		reduce : function(key , values){
			var reduced = {
							_id:"" , 
							count:0 , 
							keywords:[],
							replace_with_id:"",
							remaining_ids:[],
							remaining_objids : []
						}; // initialize a doc (same format as emitted value)
						
			values.forEach(function(val) {
				reduced.count += val.count; 
				reduced.keywords.push(val.keywords[0]);
			});
			return reduced;		
		},
		finalize : function(key, reduced){
			/*  
			// Make final updates or calculations
			reduced.avgAge = reduced.age / reduced.count;
			*/
			reduced.keywords.sort(function(a,b){
				return (a.status - b.status)
			})
			
			reduced.replace_with_id = reduced.keywords[0].id.valueOf().toString();
			reduced.keywords.forEach(function(val) {
				if(val.id != reduced.replace_with_id){
					reduced.remaining_objids.push(val.id.valueOf());
					reduced.remaining_ids.push(val.id.valueOf().toString());
				}
			})
			
			return reduced;
		},
		query : {status:{$in:[1,3]}},
		scope : {},
		out : {replace: "keywords_mapped_out"}
	};
	
	groupTags.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: searchObj.out.replace}; // Define info.
		var KeywordMappedModel = __createModelForName(stuff.name); // Create the model.
		
		var conditions = {"value.count":{$gt:1}};
		var sortObj = {"value.keywords.status":1,"value.count":-1};
		KeywordMappedModel.find(conditions).sort(sortObj).exec(function (err,results) { // Save
			if (err) {
				console.log(err);
				res.json({"status":"error"});
			}
			else{
				console.log("results.length =>>>>>>>>>> ",results.length);
				var options = { multi: true };
				var resCounter = 0;
				var keywordsToDelete = [];
				
				results.forEach(function(result){
					var conditions = {"GroupTags.GroupTagID":{"$in":result.value.remaining_ids}};
					
					var pushObj = {"GroupTags":{"GroupTagID":result.value.replace_with_id}};
					
					resCounter ++;
					var n = 0;
					media.update(conditions,{"$push":pushObj},options,function(err , numAffected){
						if(err){
							console.log("ERROR---",err);
							res.json(err);return;
						}
						else{
							n += numAffected
							//res.json({"numAffected":numAffected , "result" : result});
						}
					})
					
					keywordsToDelete = keywordsToDelete.concat(result.value.remaining_objids);
					
					if(resCounter == results.length){
						console.log("total numAffected =========== ",n);
						
						var finalArr = [];
						for(var loop=0;loop < keywordsToDelete.length;loop++){
							var key = keywordsToDelete[loop];
							var i = mongoose.Types.ObjectId(key);
							finalArr.push(i);
							//console.log(typeof i);
							//console.log(typeof i.valueOf());
						}
						
						console.log("finalArr.length ====== ",finalArr.length);
						var deleteCondition = {_id:{"$in":finalArr}};
						//console.log("deleteCondition = ",deleteCondition);
						groupTags.remove({_id:{"$in":finalArr}},function(err , result){
							if( !err ){
								console.log("all groupTags count = ",result)
								res.json(result)
							}
							else{
								console.log(err);
								res.json(err);
							}
						});
						//res.json({"resCounter":resCounter,"keywordsToDelete":finalArr,"results":results});
					}
				})
			}
		});
	});
	
}

var establishedModels = {};
function __createModelForName(name) {
	if (!(name in establishedModels)) {
		var Any = new mongoose.Schema(
					{ 
						_id: {type:String},
						value:{
								_id : {type:String},
								count : {type:Number},
								keywords : {type:Object},
								replace_with_id : {type:String},
								remaining_ids : {type:Array},
								remaining_objids : {type:Array}
							}
					}, 
					{ collection: name }
				);
		establishedModels[name] = mongoose.model(name, Any);
	}
	return establishedModels[name];
}

var addRef_toMedia = function(gtId,desId){
	//media.find().elemMatch("GroupTags", {"GroupTagsID":desId}).exec(function(err,data){
	media.find({GroupTags:{$elemMatch:{GroupTagID:desId}}},function(err,data){
		if (err) {
			res.json({'code':400,'error':err});
		}else{
			console.log('---------------------------------------------------------');
			console.log('descriptor----Id');
			console.log(desId);
			console.log('number of media having this descriptor');
			console.log(data.length);
			console.log('---------------------------------------------------------');
			for(var i=0; i<data.length;i++){
				media.findOne({_id:data[i]._id},function(err,med){
					if (err) {
						res.json({'code':400,'error':err});
					}else{
						var flag = false;
						for(var j = 0; j < med.GroupTags.length; j++){
							if ( gtId == med.GroupTags[j].GroupTagID ) {
								flag = true;
							}
						}
						if (!flag) {
							var gt = {};
							gt.GroupTagID = gtId;
							med.GroupTags.push(gt);
							med.save();
						}
					}
				});
			}
		}
	})
}
//exports.delete__duplicateDescriptor = delete__duplicateDescriptor;

exports.delete__duplicateDescriptor = delete__duplicateDescriptor_2;

/*________________________________________________________________________
	* @Date:      	30 june 2015
	* @Method :   	add__tagToDescriptor
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to add gt of same name to previously added descriptors.
	* @Param:     	2
	* @Return:    	no
_________________________________________________________________________
*/
var add__tagToDescriptor = function(req,res){
	var count=0;
	groupTags.find({status:3}, function(err , data1){
		for(var i=0; i < data1.length ; i++){
			//groupTags.findOne({_id:data1[i]._id}, function(err , gt){
			//	gt.Tags=[];
			//	gt.save();
			//});
			if (data1[i].Tags.length ==0) {
				count++;
				add__tagToDescriptor_final(data1[i]._id);
			}else{
				var flag = true;
				for(var j=0; j < data1[i].Tags.length; j++){
					if(data1[i].Tags[j].TagTitle == data1[i].GroupTagTitle){
						flag = false;
					}
				}
				if (flag) {
					count++;
					add__tagToDescriptor_final(data1[i]._id);
				}
			}
			if ((data1.length-1) ==i) {
				console.log('end of 1st for')
			}
		}
		console.log('##################################################################');
		console.log('count = '+count);
		console.log('##################################################################');
	})
}
var add__tagToDescriptor_final= function(id){
	//groupTags.findOne({_id:id},function(err,result){
	//	var gt = result;
	//	gt.Tags.push({
	//		TagTitle:gt.GroupTagTitle,
	//		status:1
	//	});
	//	
	//	gt.save(function(err,dataa){
	//		if(err){
	//			res.json(err);
	//		}
	//		else{
	//			console.log(dataa);
	//		}
	//	});   
	//})
}
exports.add__tagToDescriptor = add__tagToDescriptor;


/*________________________________________________________________________
	* @Date:      	30 june 2015
	* @Method :   	remove_dup_tags
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to add gt of same name to previously added descriptors.
	* @Param:     	2
	* @Return:    	no
_________________________________________________________________________
*/
//var remove_dup_tags = function(req,res){
//	console.log('remove_dup_tags function');
//	var count=0;
//	groupTags.find({status:3}, function(err , data1){
//		for(var i=0; i < data1.length ; i++){
//			if (data1[i].Tags.length ==0) {
//				//count++;
//				//add__tagToDescriptor_final(data1[i]._id);
//			}else{
//				//var flag = false;
//				for(var j=0; j < data1[i].Tags.length; j++){
//					for(var k=0; k < data1[i].Tags.length; k++){
//						if(data1[i].Tags[j].TagTitle == data1[i].Tags[k].TagTitle && j != k){
//							console.log('here');
//							count++;
//								//groupTags.findOne({_id:data1[i]._id},function(err,result){
//								//	var gt = result;
//								//	gt.Tags.splice(k,1);
//								//	
//								//	gt.save(function(err,dataa){
//								//		if(err){
//								//			//res.json(err);
//								//		}
//								//		else{
//								//			console.log(dataa);
//								//		}
//								//	});   
//								//})
//						}
//					}
//				}
//			}
//			
//		}
//		console.log('##################################################################');
//		console.log('count = '+count);
//		console.log('##################################################################');
//	})
//}
//exports.remove_dup_tags = remove_dup_tags;




var getKeywords = function(req, res){
	//var regex = new RegExp('^('+req.body.startsWith+')','i');
	var regex = new RegExp('\s*\s*^\s*\s*'+req.body.startsWith,'i');
	console.log(regex);
    //groupTags.find({$or:[{status:1,'Tags.TagTitle':regex},{status:1,'GroupTagTitle':regex},{status:3,'Tags.TagTitle':regex},{status:3,'GroupTagTitle':regex}]},function(err,result){		
	//groupTags.find({$or:[{status:1},{status:3}],'GroupTagTitle':regex},function(err,result){		
	//groupTags.find({$or:[{status:1},{status:3}]},function(err,result){
	//groupTags.find({$or:[{status:1},{status:3}],'GroupTagTitle':regex},function(err,result){		
	groupTags.find({status:3,'GroupTagTitle':regex},function(err,result){			
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
exports.getKeywords = getKeywords;


var trim =function(req,res){
	var count = 0;
	groupTags.find({},function(err,data){
		if (!err) {
			for(var i =0; i<data.length;i++){
				if (data[i].GroupTagTitle != undefined) {
					groupTags.findOne({_id:data[i]._id},function(err2,gt){
						if (!err2) {
							var abc=(gt.GroupTagTitle).replace(/^\s+|\s+$/g, "")
							console.log(abc);
							gt.GroupTagTitle = abc;
							gt.save();
							count++;
							console.log(count);
						}
					})
				}
			}
		}
	})
}
exports.trim = trim;

var deleteAll = function(req,res){
	var ids = req.body.ids ? req.body.ids : [];
	groupTags.update({_id:{$in:ids}},{$set:{status:0}},{multi:true},function(err,data){
		if( !err ){
			var response = {
				status: 200,
				message: "items removed",
				result : data
			}
			res.json(response);
		}
		else{
			console.log(err);
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			res.json(response);
		}
	})
}
exports.deleteAll = deleteAll;

// Search Query by Arun Sahani
var searchQuery = function(req, res){
	var mmts,mt,searchCriteria,
	searchparam = req.body.searchText,
	ObjectID = require('mongodb').ObjectID;
	if (req.body.mmtSq) {
	    mmts= new  ObjectID(req.body.mmtSq);
	} 
	if (req.body.mtSq) {
	    mt= req.body.mtSq;
	}
	console.log("MMM",mmts);
	console.log("MT",mt);
	
	if (searchparam) {
	    if(mmts) {
		if (mt) {
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(searchparam, "i")},MetaMetaTagID: mmts,MetaTagID: mt};
		}
		if(mt ==" " || typeof(mt) == "undefined"){
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(searchparam, "i")},MetaMetaTagID: mmts};
		}
	    }
	    if (mmts ==" " || typeof(mmts) == "undefined") {
		searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(searchparam, "i")}};
	    }
	    console.log("Limit",req.body.limit);
	    console.log("Skip",req.body.offset)
	    console.log("Search1")
	    
	
	    groupTags.find(searchCriteria).sort({DateAdded:1}).skip(req.body.offset).limit(req.body.limit).populate('MetaMetaTagID').exec(function(err,result){				
		if(err){		
			res.json(err);
		}
		else{
		    if(result.length==0){
			res.json({"code":"404","msg":"Not Found"})
		    }else{
			groupTags.find(searchCriteria,function(err,data){
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
	if (searchparam =="" || typeof(searchparam) == "undefined") {
	    if(mmts) {
		if (mt) {
		    searchCriteria = {$or:[{status:1},{status:3}],MetaMetaTagID: mmts,MetaTagID: mt};
		}
		if(mt =="" || typeof(mt) == "undefined"){
		    searchCriteria = {$or:[{status:1},{status:3}],MetaMetaTagID: mmts};
		}
	    }
	    if (mmts =="" || typeof(mmts) == "undefined") {
		searchCriteria = {$or:[{status:1},{status:3}]};
	    }
	    
	    groupTags.find(searchCriteria).sort({DateAdded:1}).skip(req.body.offset).limit(req.body.limit).populate('MetaMetaTagID').exec(function(err,result){				
		if(err){		
			res.json(err);
		}
		else{
		    if(result.length==0){
			res.json({"code":"404","msg":"Not Found"})
		    }else{
			groupTags.find(searchCriteria,function(err,data){
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
};
exports.searchQuery = searchQuery;

// Search via MT by Arun Sahani
var searchMT = function(req, res){
	var  mmts,mt,searchCriteria,
	     ObjectID = require('mongodb').ObjectID;
	    mmts= new  ObjectID(req.body.mmtSq);
	    mt= req.body.mtSq;
	   
	console.log("MMM",mmts);
	console.log("MT",mt);
	if (mt) {
	   if (mmts) {
		if(req.body.searchText) {
		    console.log("Mt with all params");
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(req.body.searchText, "i")},MetaMetaTagID: mmts,MetaTagID: mt};
		}
		if(req.body.searchText =="" || typeof(req.body.searchText) == "undefined") {
		     console.log("Mt without search");
		    searchCriteria = {$or:[{status:1},{status:3}],MetaMetaTagID: mmts,MetaTagID: mt};
		}
	    }
	    if(mmts =="" || typeof(mmts) == "undefined"){
		if(req.body.searchText) {
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(req.body.searchText, "i")},MetaTagID: mt};
		}
		if (req.body.searchText =="" || typeof(req.body.searchText) == "undefined") {
		    searchCriteria = {$or:[{status:1},{status:3}],MetaTagID: mt};
		}
	    }
	}
	if(mt ==" " || typeof(mt) == "undefined" ){
	    if (mmts) {
		if(req.body.searchText) {
		    console.log("Mt with all params");
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(req.body.searchText, "i")},MetaMetaTagID: mmts};
		}
		if(req.body.searchText =="" || typeof(req.body.searchText) == "undefined") {
		     console.log("Mt without search");
		    searchCriteria = {$or:[{status:1},{status:3}],MetaMetaTagID: mmts};
		}
	    }
	    if(mmts =="" || typeof(mmts) == "undefined"){
		if(req.body.searchText) {
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(req.body.searchText, "i")}};
		}
		if (req.body.searchText =="" || typeof(req.body.searchText) == "undefined") {
		    searchCriteria = {$or:[{status:1},{status:3}]};
		}
	    }
	}
	    groupTags.find(searchCriteria).sort({DateAdded:1}).skip(req.body.offset).limit(req.body.limit).populate('MetaMetaTagID').exec(function(err,result){			
		if(err){ 		
			res.json(err);
		}
		else{
		    if(result.length==0){
			res.json({"code":"404","msg":"Not Found"})
		    }else{
			groupTags.find(searchCriteria,function(err,data){
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
	
};
exports.searchMT = searchMT;

// Search via MMT by Arun Sahani
var searchMMT = function(req, res){
	var mmts,mt,searchCriteria,
	    ObjectID = require('mongodb').ObjectID;
	    console.log("All case MMT",typeof(req.body.mmtSq))
	    //mmts = new  ObjectID(req.body.mmtSq);
	    mt = req.body.mtSq;
	    
	    if (req.body.mmtSq) {
		mmts= new  ObjectID(req.body.mmtSq);
	    } 
	
	console.log("MMM",mmts);
	console.log("MT",mt);
    
	if (mmts) {
	    if (mt) {
		if(req.body.searchText) {
		    console.log("MMT Search Text -------------------------->req.body.searchText")
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(req.body.searchText, "i")},MetaMetaTagID: mmts,MetaTagID: mt};
		}
		if(req.body.searchText =="" || typeof(req.body.searchText) == "undefined") {
		    console.log("MMT without Search text ----------------------------------> req.body.searchText == || typeof(req.body.searchText) == undefined");
		    searchCriteria = {$or:[{status:1},{status:3}],MetaMetaTagID: mmts,MetaTagID: mt};
		}
	    }
	    if(mt ==" " || typeof(mt) == "undefined" ){
		if(req.body.searchText) {
		    console.log("MMT without mt --------------->mt == || typeOf(mt) == undefined");
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(req.body.searchText, "i")},MetaMetaTagID: mmts};
		}
		if (req.body.searchText =="" || typeof(req.body.searchText) == "undefined") {
		    console.log("MMT without mt --------------->req.body.searchText == || typeof(req.body.searchText)");
		    searchCriteria = {$or:[{status:1},{status:3}],MetaMetaTagID: mmts};
		}
	    }
	}
	if (mmts ==" " || typeof(mmts) == "undefined") {
	    console.log("All Case ")
	    if (mt) {
		if(req.body.searchText) {
		    console.log("MMT Search Text -------------------------->req.body.searchText")
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(req.body.searchText, "i")},MetaTagID: mt};
		}
		if(req.body.searchText =="" || typeof(req.body.searchText) == "undefined") {
		    console.log("MMT without Search text ----------------------------------> req.body.searchText == || typeof(req.body.searchText) == undefined");
		    searchCriteria = {$or:[{status:1},{status:3}],MetaTagID: mt};
		}
	    }
	    if(mt ==" " || typeof(mt) == "undefined" ){
		if(req.body.searchText) {
		    console.log("MMT without mt --------------->mt == || typeOf(mt) == undefined");
		    searchCriteria = {$or:[{status:1},{status:3}],GroupTagTitle: { $regex: new RegExp(req.body.searchText, "i")}};
		}
		if (req.body.searchText =="" || typeof(req.body.searchText) == "undefined") {
		    console.log("MMT without mt --------------->req.body.searchText == || typeof(req.body.searchText)");
		    searchCriteria = {$or:[{status:1},{status:3}]};
		}
	    }
	}
	    groupTags.find(searchCriteria).sort({DateAdded:1}).skip(req.body.offset).limit(req.body.limit).populate('MetaMetaTagID').exec(function(err,result){		
		if(err){ 		
			res.json(err);
		}
		else{
		    if(result.length==0){
			res.json({"code":"404","msg":"Not Found"})
		    }else{
			groupTags.find(searchCriteria,function(err,data){
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
	 
};
exports.searchMMT = searchMMT;


// For Text Search added by arun

var getallKeywords = function(req, res){
	//var regex = new RegExp('^('+req.body.startsWith+')','i');
	var regex = new RegExp('\s*\s*^\s*\s*'+req.body.startsWith,'i');
	console.log(regex);
    //groupTags.find({$or:[{status:1,'Tags.TagTitle':regex},{status:1,'GroupTagTitle':regex},{status:3,'Tags.TagTitle':regex},{status:3,'GroupTagTitle':regex}]},function(err,result){		
	//groupTags.find({$or:[{status:1},{status:3}],'GroupTagTitle':regex},function(err,result){		
	//groupTags.find({$or:[{status:1},{status:3}]},function(err,result){
	//groupTags.find({$or:[{status:1},{status:3}],'GroupTagTitle':regex},function(err,result){	
	var conditions = {
		$or:[{status:1},{status:3}],
		'GroupTagTitle':regex
	};

	var fields = {
		_id : true,
		GroupTagTitle : true,
		Tags : true
	};
	
	var sort = {
		GroupTagTitle:1
	};
	
	var limit = 50;
	
	groupTags.find(conditions , fields).sort(sort).limit(limit).exec(function(err,result){			
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
exports.getallKeywords = getallKeywords;