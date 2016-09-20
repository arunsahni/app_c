var media = require('./../models/mediaModel.js');
//var board = require('./../models/boardModel.js');
var board = require('./../models/pageModel.js');
var mediaAction = require('../models/mediaActionLogModel.js');
var groupTags = require('./../models/groupTagsModel.js');
var formidable = require('formidable');
var fs = require('fs');
var counters=require('./../models/countersModel.js');
var dateFormat =function(){
	var d = new Date,
	dformat = [(d.getMonth()+1)>10?(d.getMonth()+1):'0'+(d.getMonth()+1),
		(d.getDate())>10?d.getDate():'0'+d.getDate(),
		d.getFullYear()].join('')+''+
		[d.getHours(),
		d.getMinutes(),
		d.getSeconds()].join('');
		return dformat;
}
// To fetch all domains
// commented by parul
//var findAll = function(req, res){
//    var fields={};
//    if(typeof(req.body.title)!='undefined'){
//	if (req.body.title!="") {
//	    fields['Title']=new RegExp(req.body.title, 'i');	    
//	}
//	fields['Status']=1;	
//    }
//    else{	
//	fields['Status']=0;
//    }
//    if(req.body.gt!=null && req.body.gt!=""){
//	fields['GroupTags.GroupTagID']=req.body.gt
//    }
//	//added by parul
//	if(req.body.collection!=null && req.body.collection!=""){
//	fields['Collection.CollectionID']=req.body.collection
//    }
//    
//    media.find(fields).sort({UploadedOn: 'desc'}).skip(req.body.offset).limit(req.body.limit).exec(function(err,result){
//		
//		if(err){ 		
//			res.json(err);
//		}
//		else{
//			if(result.length==0){
//				res.json({"code":"404","msg":"Not Found",responselength:0})
//			}
//			else{				
//				media.find({Status:0}).sort({UploadedOn: 'desc'}).exec(function(err,resultlength){								
//					if(err){ 		
//						res.json(err);
//					}
//					else{					
//						res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength.length});
//						
//					}
//				})
//			}
//		}
//	})
//    
//};
//
//exports.findAll = findAll;

//added by parul 26 dec 2014

var findAll = function(req, res){
    var fields={};
    if(typeof(req.body.title)!='undefined'){
		if (req.body.title!="") {
			fields['Title']=new RegExp(req.body.title, 'i');	    
		}
		fields['Status']=1;	
	}
	else{	
		fields['Status']=0;
	}
	
	if(req.body.gt!=null && req.body.gt!=""){
		fields['GroupTags.GroupTagID']=req.body.gt
	}
	//added by parul
	if(req.body.collection!=null && req.body.collection!=""){
		fields['Collection.CollectionID']=req.body.collection
	}
    
    media.find(fields).sort({UploadedOn: 'desc'}).skip(req.body.offset).limit(req.body.limit).exec(function(err,result){
		
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				res.json({"code":"404","msg":"Not Found",responselength:0})
			}
			else{				
				//media.find({Status:0}).sort({UploadedOn: 'desc'}).exec(function(err,resultlength){								
				media.find({Status:0} , {_id:1}).count().exec(function(err,resultlength){								
					if(err){ 		
						res.json(err);
					}
					else{					
						console.log("yes confirmed return.....");
						//res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength.length});
						res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength});
						
					}
				})
			}
		}
	})
    
};

exports.findAll = findAll;



//end
var findAllStatus = function(req, res){    
	
	
	fields={};
	
	fields['IsDeleted']= 0;
	if(req.body.domain!=null && req.body.domain!=""){
	    fields['Domains']=req.body.domain
	}
	
	//added by parul 09022015
	if(req.body.Media!=null && req.body.domain!=""){
		if (req.body.locator == 'record') {
			fields['Locator']={$regex:req.body.Media};
		}else{
			fields['AutoId']=req.body.Media;
		}
	    
	}
	//added by parul 09012015
	//if(req.body.status!=null && req.body.status!=""){
	//	if(req.body.status==0){
	//		fields['Status']={'$ne':2};
	//	}else{
	//		fields['Status']=req.body.status;	
	//	}	
	//	
	//}
	//fields['IsPrivate']={$exists:false,$ne:1};
	fields['$or'] = [{IsPrivate:{'$exists':false}},{IsPrivate:{$exists:true,$ne:1}}];
	
	if(req.body.status!=null && req.body.status!=""){
	    fields['Status']=req.body.status
	}else{
		fields['Status']={'$nin':[2,3]};
	}
	//end of 09012015
	if(req.body.source!=null && req.body.source!=""){
		fields['SourceUniqueID']=req.body.source
	}
	
	//if(req.body.collection!=null && req.body.collection!=""){
	//	fields['Collection']=req.body.collection
	//}commented by parul
	if(req.body.gt!=null && req.body.gt!=""){
		//fields.GroupTags=[];
		fields['GroupTags.GroupTagID']=req.body.gt
	}
	//added by parul 26 dec 2014
	if(req.body.collection!=null && req.body.collection!=""){
		//fields.GroupTags=[];
		fields['Collection']={$in:[req.body.collection]};
	}
	if(req.body.mmt!=null && req.body.mmt!=""){		
		fields['MetaMetaTags']=req.body.mmt
	}
	if(req.body.mt!=null && req.body.mt!=""){		
	    fields['MetaTags']=req.body.mt
	}
	if (req.body.whereAdded) {
	    fields['AddedWhere']=req.body.whereAdded
	}
	if (req.body.tagtype) {
	    fields['TagType']=req.body.tagtype
	}
	if (req.body.howAdded) {
	    fields['AddedHow']=req.body.howAdded
	}
	if (req.body.mediaType) {
	    
		if( req.body.mediaType == 'Image' ){
			fields['$or'] = [{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}];
		}
		else if( req.body.mediaType == 'Link' ){
			fields['MediaType'] = req.body.mediaType;
			fields['LinkType'] = {$ne:'image'};
		}
		else{
			fields['MediaType'] = req.body.mediaType;
		}
		
	}
	if (req.body.dtEnd!=null && req.body.dtStart!=null) {
	    var end = req.body.dtEnd;
	    var start = req.body.dtStart;
	    var end_dt=end.split('/');
	    var start_dt=start.split('/');
	    start_dt[0]=start_dt[0]-1;
	    end_dt[0]=end_dt[0]-1;
	    
	    console.log(start_dt);
	    console.log(end_dt);
	    
	    var start_date=new Date(start_dt[2],start_dt[0],start_dt[1],0,0,0);
	    var end_date=new Date(end_dt[2],end_dt[0],end_dt[1],23,59,59);
	    
	    fields['UploadedOn']={$lte:end_date,$gte:start_date}
	}
	
	//fields['Status']={'$ne':2}; //commented and moved to else condition of status by parul 09012015 
	/*if(req.body.gt!=null && req.body.gt!=""){
		fields.GroupTags=[];
		fields.GroupTags.GroupTagID=req.body.gt
	}*/
	
	console.log(fields);//return;
	
    media.find(fields).sort({UploadedOn: 'desc'}).skip(req.body.offset).limit(req.body.limit).exec(function(err,result){
		if(err){ 		
			res.json(err);
		}
		else{
			media.find(fields,{_id : 1}).count().exec(function(err,resultlength){		
				if(err){ 		
					res.json(err);
				}
				else{
					if( resultlength > 0 ){
						//res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength.length});
						res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength});
					}
					else{
						res.json({"code":"404","msg":"Not Found",responselength:0})
					}
				}
			})
		}
	})
};

exports.findAllStatus = findAllStatus;

/*
var edit = function(req,res){
  
	var fields={
		SourceUniqueID:req.body.source,
		GroupTags:[],
		Collection:[],
		Domains:req.body.domain,
		Status:1,
		MetaMetaTags:req.body.mmt,
		MetaTags:req.body.mt,
		TagType:req.body.tagtype
	};
	for(k in req.body.gt){
		fields.GroupTags.push({
			GroupTagID:req.body.gt[k]
		})
	}
	//added by parul 26 dec 2014
	for(j in req.body.collection){
		fields.Collection.push({
			CollectionID:req.body.collection[j]
		})
	}
	for(i in req.body.media){
		var query={_id:req.body.media[i]['id']};
		var options={};
		fields.Title=req.body.media[i]['title'];
		fields.Prompt=req.body.media[i]['prompt'];
		fields.Locator=req.body.media[i]['locator'];
		media.update(query, { $set: fields}, options, callback)
	}
	
	var counter=0;
	function callback (err, numAffected) {
		counter++;
		if(counter==req.body.media.length){
			findAll(req,res)
		}
		
	}
};
*/


var edit = function(req,res){
  
	var fields={
		//SourceUniqueID:req.body.source,
		SourceUniqueID:"53ceb0263aceabbe5d573db9",
		GroupTags:[],
		Collection:[],
		Domains:req.body.domain,
		Status:1,
		MetaMetaTags:req.body.mmt,
		MetaTags:req.body.mt,
		TagType:req.body.tagtype
	};
	for(k in req.body.gt){
		fields.GroupTags.push({
			GroupTagID:req.body.gt[k]
		})
	}
	//added by parul 26 dec 2014
	for(j in req.body.collection){
		fields.Collection.push(
			req.body.collection[j]
		)
	}
	
	
	for(i in req.body.media){
		var query={_id:req.body.media[i]['id']};
		console.log("query = ",query);
		var options={};
		fields.Title=req.body.media[i]['title'];
		fields.Prompt=req.body.media[i]['prompt'];
		fields.Photographer=req.body.media[i]['Photographer'];
		console.log("fields = ",fields);//return;
		media.update(query, { $set: fields}, options, callback)
	}
	
	var counter=0;
	function callback (err, numAffected) {
		counter++;
		if(counter==req.body.media.length){
			findAll(req,res)
		}
		
	}
};

exports.edit = edit;

/*
var editAll = function(req,res){
  
	var fields={
		SourceUniqueID:req.body.source,
		GroupTags:[],
		Collection:[],
		Domains:req.body.domain,
		Status:1,
		MetaMetaTags:req.body.mmt,
		MetaTags:req.body.mt,
		TagType:req.body.tagtype		
	};
	console.log(fields);
	
	for(k in req.body.gt){
		fields.GroupTags.push({
			GroupTagID:req.body.gt[k]
		})
	}
	//added by parul 26 dec
	for(j in req.body.collection){
		fields.Collection.push(
			req.body.collection[j]
		)
	}
	for(i in req.body.media){
		var query={_id:req.body.media[i]['id']};
		var options={};
		fields.Title=req.body.media[i]['title'];
		fields.Prompt=req.body.media[i]['prompt'];
		fields.Locator=req.body.media[i]['locator'];
		media.update(query, { $set: fields}, options, callback)
	}
	var counter=0;
	function callback (err, numAffected) {
		counter++;
		if(counter==req.body.media.length){
			findAllStatus(req,res)
		}
		
	}
};
*/
// static source to Platform in case of admin upload on 07012015 by manishp
var editAll = function(req,res){
  
	var fields={
		//SourceUniqueID:req.body.source,
		SourceUniqueID:"53ceb0263aceabbe5d573db9",
		GroupTags:[],
		Collection:[],
		Domains:req.body.domain,
		Status:1,
		MetaMetaTags:req.body.mmt,
		MetaTags:req.body.mt,
		TagType:req.body.tagtype		
	};
	console.log(fields);
	
	for(k in req.body.gt){
		fields.GroupTags.push({
			GroupTagID:req.body.gt[k]
		})
	}
	//added by parul 26 dec
	for(j in req.body.collection){
		fields.Collection.push(
			req.body.collection[j]
		)
	}
	//var counter=0;
	//for(i in req.body.media){
	//	var query={_id:req.body.media[i]['id']};
	//	var options={};
	//	fields.Title=req.body.media[i]['title'];
	//	fields.Prompt=req.body.media[i]['prompt'];
	//	fields.Photographer=req.body.media[i]['Photographer'];
	//	media.update(query, { $set: fields}, options, callback)
	//	function callback (err, numAffected) {
	//		counter++;
	//		if(counter==req.body.media.length){
	//			//addTag(req,res);   //--now not in use
	//			addGT(req,res);
	//			findAllStatus(req,res)
	//		}
	//		
	//	}
	//}
	// added by arun
	var counter=0;
	for(i in req.body.media){
		var query={_id:req.body.media[i]['id']};
		console.log("Iteration",i);
		console.log("Query Param", query);
		var options={};
		fields.Title=req.body.media[i]['title'];
		fields.Prompt=req.body.media[i]['prompt'];
		fields.Photographer=req.body.media[i]['Photographer'];
		console.log("Media To update",fields)
		console.log("=========================");
		
		if(req.body.media.length > counter){
			counter++;
			console.log("====Called", counter);
			//var tags = req.body.media[i]['prompt'];
			//tags = tags.split(',');
			//console.log(tags);
			//var mediaID = req.body.media[i]['id'];
			//for(j in tags){
			//	if (tags[j] != '' && tags[j] != ' ') {
			//		var particular_tag = tags[j].trim();
			//		tags[j] = particular_tag;
			//		//console.log('==========================================================================');
			//		//console.log(tags[j]);
			//		//console.log('==========================================================================');
			//		checkNSaveGT(tags[j], mediaID)
			//		console.log("-------Inside AddGT function---------------");
			//	}
			//}
				
			addGT(req,res,i);	
			//findAllStatus(req,res)
		}
		media.update(query, { $set: fields}, options,function(err, numAffected) {
			
		});
	}
	findAllStatus(req,res);
	
};

exports.editAll = editAll;


var editTags = function(req,res){
	
	var fields={
		Title:req.body.title,
		Prompt:req.body.prompt,
		Photographer:req.body.Photographer
	};
	
	for(i in req.body.media){
		var query={_id:req.body.media[i]['id']};
		
		fields.Title=req.body.media[i]['title'];
		fields.Prompt=req.body.media[i]['prompt'];
		fields.Photographer=req.body.media[i]['Photographer'];
		
		media.update(query, { $set: fields}, options, callback)
	}
	var counter=0;
	function callback (err, numAffected) {
		counter++;
		if(counter==req.body.media.length){
			findAll(req,res)
		}
		
	}
};

exports.editTags = editTags;



//
//var addTagsToUploadedMedia = function(req,res){
//    
//    var fields={
//	//SourceUniqueID:null,
//	GroupTags:[],
//	//Collection:null,
//	//Domains:null,
//	Status:1,
//	MetaMetaTags:req.body.mmt,
//	MetaTags:null,
//	TagType:null,
//	Posts:{},
//	ViewsCount:1
//    };
//    
//    if (req.body.isPrivate) {
//	fields.Status=2;
//    }
//    
//    fields.Posts.Users=[];
//    
//    fields.Posts.Users.push({UserFSGs:req.session.user.FSGs});
//    
//    fields.GroupTags.push({
//	GroupTagID:req.body.gt
//    })
//   
//    
//    fields.Title=null;
//    fields.Prompt=null;
//    fields.Locator=null;
//    req.body.id=req.body.MediaID;
//    var query={_id:req.body.MediaID};
//    var options={};
//    media.update(query, { $set: fields}, options, callback)
//    
//    var counter=0;
//    function callback (err, numAffected) {
//	addMediaToBoard(req,res);
//    }
//};
//
//exports.addTagsToUploadedMedia = addTagsToUploadedMedia;





//function added by parul to manage user tags to use when we add tagging functionality to media
var addTagsToUploadedMedia = function(req,res){
	media.find({_id:req.body.MediaID},function(err,data){
		if(!err && data.length > 0){
			console.log('add--tags to uploaded media--');
			var fields={
				//SourceUniqueID:null,
				GroupTags:data[0].GroupTags.length ==0 ? []: data[0].GroupTags,
				//Collection:null,
				//Domains:null,
				//Status:1,
				Status:3,
				// edited on 03 april 2015 by parul
				//to refrain media to appear in search media listing
				MetaMetaTags:req.body.mmt,
				IsPrivate:req.body.isPrivate,//added by parul 05022015
				MetaTags:null,
				TagType:null,
				Posts:{},
				ViewsCount:1
			};
			
		//    if (req.body.isPrivate) {
		//	fields.Status=2;
		//    }
			
			fields.Posts.Users=[];
			
			//fields.Posts.Users.push({UserFSGs:req.session.user.FSGs});
			fields.Posts.Users.push({UserFSGs:req.session.user.FSGsArr2});
			if (req.body.gt) {
				//fields.GroupTags=[];
				fields.GroupTags.push({
					GroupTagID:req.body.gt
				})
			}
		   
			
			//fields.Title=null;	//by manishp on 17042015
			//fields.Prompt=null;	//by manishp on 17042015
			fields.Photographer=null;
			req.body.id=req.body.MediaID;
			var query={_id:req.body.MediaID};
			var options={};
			
			
			
		   // media.update(query, { $set: fields}, options, callback)
		   // if (req.body.data.MediaType == "Montage" || req.body.data.MediaType == "Video") {
			if( req.body.data.MediaType == "Montage" ){
				//addMediaToBoard(req,res);
				fields.Status=1;
				media.update(query, { $set: fields}, options, callback)
			}
			else{
				media.update(query, { $set: fields}, options, callback)
			}
				if (req.body.Tags) {
					addTags_toGT(req.body.MediaID,req.body.Tags)
				}
			var counter=0;
			function callback (err, numAffected) {
				//addMediaToBoard(req,res);
				//above code commented and below code added by parul on 03 april 2015
				//Now media will only be added to board when user posts it to board
				media.find(query,function(err,data){
					if(err){
					res.json(err);
					}
					else{
						if (req.body.data.MediaType == 'Montage') {
							//added by manishp on 27042015
							media.findById(req.body.MediaID,{OwnStatement:1},function(error , m){
								if(error){
									console.log(error);
								}
								else{
									console.log('---- in else ---');
									req.body.Statement = m.OwnStatement?m.OwnStatement:"";
									addMediaToBoard(req,res);
								}
							});
							//addMediaToBoard(req,res);
						}else{
							res.json({"code":"200","message":"success","response":data});
						}
					}
				})
			}
		}
	})
};

//function added by parul to manage user tags to use when we add tagging functionality to media
var addTagsToUploadedMedia_M_7 = function(req,res){
    
	var fields = {
		GroupTags:[],
		Status:3,
		MetaMetaTags:req.body.mmt,
		IsPrivate:req.body.isPrivate, //added by parul 05022015
		MetaTags:null,
		TagType:null,
		Posts:{},
		ViewsCount:1
    };
    
    //Add user preferences object under post/repost array : For Search Engine Algorithm Processing
	fields.Posts.Users=[];
    fields.Posts.Users.push({UserFSGs:req.session.user.FSGsArr2});
    
	
	//There may be no grouptag/theme/keyword or there may be one keyword.
	if (req.body.gt) {
		fields.GroupTags.push({
		GroupTagID:req.body.gt
		})
	}
   
    fields.Photographer = null;
    req.body.id = req.body.MediaID;
    
	var query = {_id:req.body.MediaID};
    var options = {};
	
	//This is for user suggested tags (alias of the keyword), if any : there may be multiple
	//A tag can belongs to multiple keywords
	//In front end, we have to provide auto-complete list of the tags of current keyword. or 
	//all unique tags list if no keyword is selected - need to map those tags under NO_THEME grouptag
	//that will be custom for implementing logic for CRUD on related places later
	
	if (req.body.Tags) {
		//req.body.Tags = req.body.Tags.trim();
		var tags = req.body.Tags.trim();
		var tagsArr = [];
		
		tagsArr = tags.split(',');
					
		//check if NO_THEME Case
		if( req.body.gt ){
			groupTags.find({_id:req.body.gt},function(err,result){
				console.log(result);
				if (!err) {
					var resultFinal = false;
					
					//Remove this loop apply mongodb's sub-document query.
					for ( x in result[0].Tags ) {
						if ( result[0].Tags[x].TagTitle == req.body.Tags ) {
							resultFinal = true;
							var tagID = result[0].Tags[x]._id;
							break;
						}	
					}	
						
					if ( !resultFinal ) {
						groupTags.findOne({_id:req.body.gt},function(err,result){
							var gt = result;
							gt.Tags.push({
								TagTitle:req.body.Tags,
								status:2
							});
							
							gt.save(function(err){
								if(err){
									res.json(err);
								}
								else{}
							});   
						})
					}
					else{
						//fields.Tags={TagId:tagID,TagTitle:req.body.Tags};
					}
				}
				else{res.json(err);}
			})
		}
		else{
			
		}
	}
	
	
   // media.update(query, { $set: fields}, options, callback)
   // if (req.body.data.MediaType == "Montage" || req.body.data.MediaType == "Video") {
	if( req.body.data.MediaType == "Montage" ){
		//addMediaToBoard(req,res);
		fields.Status=1;
		media.update(query, { $set: fields}, options, callback)
	}
	else{
		media.update(query, { $set: fields}, options, callback)
	}
    var counter=0;
    function callback (err, numAffected) {
		//addMediaToBoard(req,res);
		//above code commented and below code added by parul on 03 april 2015
		//Now media will only be added to board when user posts it to board
		media.find(query,function(err,data){
			if(err){
			res.json(err);
			}
			else{
				if (req.body.data.MediaType == 'Montage') {
					//added by manishp on 27042015
					media.findById(req.body.MediaID,{OwnStatement:1},function(error , m){
						if(error){
							console.log(error);
						}
						else{
							req.body.Statement = m.OwnStatement?m.OwnStatement:"";
							addMediaToBoard_M_7(req,res);
						}
					});
					//addMediaToBoard(req,res);
				}else{
					res.json({"code":"200","message":"success","response":data});
				}
			}
		})
	}
};


exports.addTagsToUploadedMedia = addTagsToUploadedMedia;
//end




var addMediaToBoard = function(req,res){
       console.log('addMediaToBoard');
    fields={	
		Medias:[]
    };
    
    board.find({_id:req.body.board},function(err,result){
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				res.json({"code":"404","msg":"Not Found"})
			}
			else{
				
				//added by manishp on 22122014-Montage case
				var thumbnail = '';
				if( req.body.data.thumbnail ){
					thumbnail = req.body.data.thumbnail;
					console.log("if -----------------------thumbnail = ",thumbnail);
				}
				else{
					console.log("else thumbnail = ");
				}
				
				//end
			
				if (req.body.gt=="" || typeof(req.body.gt)=='undefined') {
					console.log("if (req.body.gt== check");//return false;
					var fields={};
					if (result[0].Medias==null) {
						fields.Medias=[];
					}
					else{
						fields.Medias = result[0].Medias;
					}
					gtfields={
						GroupTagTitle:req.body.gtsa,
						Notes:"",
						DateAdded:Date.now(),
						MetaMetaTagID:null,
						MetaTagID:null,
						status:2
					};
					
					groupTags(gtfields).save(function(err,data){
						if(err){
						  res.json(err);
						}
						else{
							if (result[0].Themes==null) {
								fields.Themes=[];
							}
							else{
								fields.Themes = result[0].Themes;
							}
										
							fields.Themes.push({
								ThemeID:data.id, 
								ThemeTitle:req.body.gtsa,
								SuggestedBy:req.session.user._id,
								SuggestedOn:Date.now(),
								isApproved:0
							});
						   
							if (req.body.data.Content) {
								fields.Medias.push({
									MediaID:req.body.id,
									MediaURL:req.body.data.Location[0].URL,
									MediaTitle:null,
									PostedBy:req.session.user._id,
									PostedOn:Date.now(),
									Content:req.body.data.Content,
									ThemeID:data.id,
									ThemeTitle:req.body.gtsa,
									ContentType:req.body.data.ContentType,
									Votes:[],
									Marks:[],
									thumbnail:thumbnail, //added by manishp on 22122014- montage case 
									PostStatement:req.body.Statement?req.body.Statement:"" //New Montage Case - Added on 27042015 By manishp
								});
							}else{
								fields.Medias.push({
									MediaID:req.body.id,
									MediaURL:req.body.data.Location[0].URL,
									MediaTitle:null,
									PostedBy:req.session.user._id,
									PostedOn:Date.now(),
									ThemeID:data.id,
									ThemeTitle:req.body.gtsa,
									ContentType:req.body.data.ContentType,
									Votes:[],
									Marks:[],
									thumbnail:thumbnail, //added by manishp on 22122014- montage case 
									PostStatement:req.body.Statement?req.body.Statement:"" //New Montage Case - Added on 27042015 By manishp
								});
							}
							
							var query={_id:req.body.board};
							var options = { multi: true };
							
							board.update(query, { $set: fields}, options, callback);
						}
					});	    	
				}else{
					console.log("else (req.body.gt== check thumbnail = ",thumbnail);//return false;
					var fields={};
					if (result[0].Medias==null) {
						fields.Medias=[];
					}
					else{
						fields.Medias = result[0].Medias;
					}
					var flag=0;
					for(as in result[0].Themes){
						if (result[0].Themes[as].ThemeID==req.body.gt) {
							flag=1;
						}
					}
					
					if (flag==0) {
						fields.Themes=[];
						if (result[0].Themes==null) {
							fields.Themes=[];
						}
						else{
							fields.Themes = result[0].Themes;
						}
						fields.Themes.push({
							ThemeID:req.body.gt, 
							ThemeTitle:req.body.gtsa,
							SuggestedBy:req.session.user._id,
							SuggestedOn:Date.now(),
							isApproved:1
						});
					}
					if (req.body.data.Content) {
						console.log("else (req.body.gt== check-222222 thumbnail = ",thumbnail);//return false;
						/*
						fields.Medias.push({
							MediaID:req.body.id,
							MediaURL:req.body.data.Location[0].URL,
							Title:null,
							Prompt:null,
							Locator:null,
							PostedBy:req.session.user._id,			
							PostedOn:Date.now(),
							ThemeID:req.body.gt,
							ThemeTitle:req.body.gtsa,
							MediaType:req.body.data.MediaType,
							ContentType:req.body.data.ContentType,
							Votes:[],
							Marks:[],			
							OwnerId:req.body.owner,
							Content:req.body.data.Content,
							thumbnail:thumbnail
						});
						*/
						//added by manishp on 22122014- montage case 
						var obj = {
							MediaID:req.body.id,
							MediaURL:req.body.data.Location[0].URL,
							Title:null,
							Prompt:null,
							Photographer:null,
							PostedBy:req.session.user._id,			
							PostedOn:Date.now(),
							ThemeID:req.body.gt,
							ThemeTitle:req.body.gtsa,
							MediaType:req.body.data.MediaType,
							ContentType:req.body.data.ContentType,
							Votes:[],
							Marks:[],			
							OwnerId:req.body.owner,
							Content:req.body.data.Content,
							thumbnail:thumbnail,
							PostStatement:req.body.Statement?req.body.Statement:"" //New Montage Case - Added on 27042015 By manishp
						};
						
						fields.Medias.push(obj);
						
						//console.log("fields.Medias = ",fields.Medias);
						//console.log("fields.Medias object = ",obj);return false;
					}
					else{
						console.log("else (req.body.gt== check-3333333");//return false;
						fields.Medias.push({
							MediaID:req.body.id,
							MediaURL:req.body.data.Location[0].URL,
							Title:null,
							Prompt:null,
							Photographer:null,
							PostedBy:req.session.user._id,			
							PostedOn:Date.now(),
							ThemeID:req.body.gt,
							ThemeTitle:req.body.gtsa,
							MediaType:req.body.data.MediaType,
							ContentType:req.body.data.ContentType,
							Votes:[],
							Marks:[],			
							OwnerId:req.body.owner,
							thumbnail:thumbnail, //added by manishp on 22122014- montage case 
							PostStatement:req.body.Statement?req.body.Statement:"" //New Montage Case - Added on 27042015 By manishp
						});    
					}
					var query={_id:req.body.board};
					var options = { multi: true };
					//console.log("fields = ",fields);return false;
					board.update(query, { $set: fields}, options, callback);
				}
			}
		}
	
    }).populate('Domain Collection ProjectID');
    
    function callback (err, numAffected) {	    
		if(err){
			res.json(err)
		}
		else{
			postMedia(req,res);
		}
    }   
}

var addMediaToBoard_M_7 = function(req,res){
        
    fields={	
		Medias:[]
    };
    
    board.find({_id:req.body.board},function(err,result){
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				res.json({"code":"404","msg":"Not Found"})
			}
			else{
				
				//added by manishp on 22122014-Montage case
				var thumbnail = '';
				if( req.body.data.thumbnail ){
					thumbnail = req.body.data.thumbnail;
					console.log("if -----------------------thumbnail = ",thumbnail);
				}
				else{
					console.log("else thumbnail = ");
				}
				
				//end
				
				if (req.body.gt=="" || typeof(req.body.gt)=='undefined') {
					console.log("if (req.body.gt== check");return false;
					var fields={};
					if (result[0].Medias==null) {
						fields.Medias=[];
					}
					else{
						fields.Medias = result[0].Medias;
					}
					gtfields={
						GroupTagTitle:req.body.gtsa,
						Notes:"",
						DateAdded:Date.now(),
						MetaMetaTagID:null,
						MetaTagID:null,
						status:2
					};
					
					groupTags(gtfields).save(function(err,data){
						if(err){
						  res.json(err);
						}
						else{
							if (result[0].Themes==null) {
								fields.Themes=[];
							}
							else{
								fields.Themes = result[0].Themes;
							}
										
							fields.Themes.push({
								ThemeID:data.id, 
								ThemeTitle:req.body.gtsa,
								SuggestedBy:req.session.user._id,
								SuggestedOn:Date.now(),
								isApproved:0
							});
						   
							if (req.body.data.Content) {
								fields.Medias.push({
									MediaID:req.body.id,
									MediaURL:req.body.data.Location[0].URL,
									MediaTitle:null,
									PostedBy:req.session.user._id,
									PostedOn:Date.now(),
									Content:req.body.data.Content,
									ThemeID:data.id,
									ThemeTitle:req.body.gtsa,
									ContentType:req.body.data.ContentType,
									Votes:[],
									Marks:[],
									thumbnail:thumbnail, //added by manishp on 22122014- montage case 
									PostStatement:req.body.Statement?req.body.Statement:"" //New Montage Case - Added on 27042015 By manishp
								});
							}else{
								fields.Medias.push({
									MediaID:req.body.id,
									MediaURL:req.body.data.Location[0].URL,
									MediaTitle:null,
									PostedBy:req.session.user._id,
									PostedOn:Date.now(),
									ThemeID:data.id,
									ThemeTitle:req.body.gtsa,
									ContentType:req.body.data.ContentType,
									Votes:[],
									Marks:[],
									thumbnail:thumbnail, //added by manishp on 22122014- montage case 
									PostStatement:req.body.Statement?req.body.Statement:"" //New Montage Case - Added on 27042015 By manishp
								});
							}
							
							var query={_id:req.body.board};
							var options = { multi: true };
							
							board.update(query, { $set: fields}, options, callback);
						}
					});	    	
				}else{
					console.log("else (req.body.gt== check thumbnail = ",thumbnail);//return false;
					var fields={};
					if (result[0].Medias==null) {
						fields.Medias=[];
					}
					else{
						fields.Medias = result[0].Medias;
					}
					var flag=0;
					for(as in result[0].Themes){
						if (result[0].Themes[as].ThemeID==req.body.gt) {
							flag=1;
						}
					}
					
					if (flag==0) {
						fields.Themes=[];
						if (result[0].Themes==null) {
							fields.Themes=[];
						}
						else{
							fields.Themes = result[0].Themes;
						}
						fields.Themes.push({
							ThemeID:req.body.gt, 
							ThemeTitle:req.body.gtsa,
							SuggestedBy:req.session.user._id,
							SuggestedOn:Date.now(),
							isApproved:1
						});
					}
					if (req.body.data.Content) {
						console.log("else (req.body.gt== check-222222 thumbnail = ",thumbnail);//return false;
						/*
						fields.Medias.push({
							MediaID:req.body.id,
							MediaURL:req.body.data.Location[0].URL,
							Title:null,
							Prompt:null,
							Locator:null,
							PostedBy:req.session.user._id,			
							PostedOn:Date.now(),
							ThemeID:req.body.gt,
							ThemeTitle:req.body.gtsa,
							MediaType:req.body.data.MediaType,
							ContentType:req.body.data.ContentType,
							Votes:[],
							Marks:[],			
							OwnerId:req.body.owner,
							Content:req.body.data.Content,
							thumbnail:thumbnail
						});
						*/
						//added by manishp on 22122014- montage case 
						var obj = {
							MediaID:req.body.id,
							MediaURL:req.body.data.Location[0].URL,
							Title:null,
							Prompt:null,
							Photographer:null,
							PostedBy:req.session.user._id,			
							PostedOn:Date.now(),
							ThemeID:req.body.gt,
							ThemeTitle:req.body.gtsa,
							MediaType:req.body.data.MediaType,
							ContentType:req.body.data.ContentType,
							Votes:[],
							Marks:[],			
							OwnerId:req.body.owner,
							Content:req.body.data.Content,
							thumbnail:thumbnail,
							PostStatement:req.body.Statement?req.body.Statement:"" //New Montage Case - Added on 27042015 By manishp
						};
						
						fields.Medias.push(obj);
						
						//console.log("fields.Medias = ",fields.Medias);
						//console.log("fields.Medias object = ",obj);return false;
					}
					else{
						console.log("else (req.body.gt== check-3333333");//return false;
						fields.Medias.push({
							MediaID:req.body.id,
							MediaURL:req.body.data.Location[0].URL,
							Title:null,
							Prompt:null,
							Photographer:null,
							PostedBy:req.session.user._id,			
							PostedOn:Date.now(),
							ThemeID:req.body.gt,
							ThemeTitle:req.body.gtsa,
							MediaType:req.body.data.MediaType,
							ContentType:req.body.data.ContentType,
							Votes:[],
							Marks:[],			
							OwnerId:req.body.owner,
							thumbnail:thumbnail, //added by manishp on 22122014- montage case 
							PostStatement:req.body.Statement?req.body.Statement:"" //New Montage Case - Added on 27042015 By manishp
						});    
					}
					var query={_id:req.body.board};
					var options = { multi: true };
					//console.log("fields = ",fields);return false;
					board.update(query, { $set: fields}, options, callback);
				}
			}
		}
	
    }).populate('Domain Collection ProjectID');
    
    function callback (err, numAffected) {	    
		if(err){
			res.json(err)
		}
		else{
			postMedia(req,res);
		}
    }   
}

exports.addMediaToBoard = addMediaToBoard;


/*________________________________________________________________________
	* @Date:      	29 june 2015
	* @Method :   	addTags_toGT
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to add tags to all gts associated with media.
	* @Param:     	2
	* @Return:    	no
_________________________________________________________________________
*/

var addTags_toGT = function(mediaID,tags){
	tags = tags.split(',');
	media.findOne({_id:mediaID},function(err,med_Data){
		console.log(med_Data.GroupTags.length);
		for(var i=0; i<med_Data.GroupTags.length;i++){
			console.log('----------sending=============='+med_Data.GroupTags[i].GroupTagID)
			final__addTags_toGT(med_Data.GroupTags[i].GroupTagID,tags)
		}
	})
}

var final__addTags_toGT = function(gtID,tags){
	groupTags.findOne({_id:gtID},function(err,result){
		if (!err) {
			var gt = result;
			console.log('---------------------------------------------------------');
			console.log(gt);
			console.log('---------------------------------------------------------');
			for(j in tags){
				var resultFinal=false;
				if ( gt.Tags != null && gt.Tags != undefined) {
					
				}else{
					gt.Tags =[];
				}
				for (x in gt.Tags) {
					if (gt.Tags[x].TagTitle==tags[j]) {
						resultFinal=true;
						var tagID=gt.Tags[x]._id;
					}
				}
				if (!resultFinal) {
					gt.Tags.push({
						TagTitle:tags[j],
						status:2
					});  
				}
				gt.save(function(err){
					if(err)
					{
						//res.json(err);
					}
				});
			} 
		}
	})
}
/********************************************* END ****************************************************/
/*
var uploadfile = function(req,res){
	var form = new formidable.IncomingForm();        	
	
	form.parse(req, function(err, fields, files) {
	  var file_name="";
	  if(files.myFile.name){
		uploadDir = __dirname + "/../../public/assets/Media/img";
		file_name=files.myFile.name;
	    file_name=file_name.split('.');
	    ext=file_name[file_name.length-1];
	    var name = '';
		name=Date.now();
	    //file_name=name+'.'+ext;
		file_name=name+'.'+ext; //updated on 09022015 by manishp : <timestamp>_<media_unique_number>_<size>.<extension> = 1421919905373_101_600.jpeg
		console.log(files.myFile.type);
	    fs.renameSync(files.myFile.path, uploadDir + "/" + file_name)
		
		var media_type='';
		if(files.myFile.type=="application/pdf" || files.myFile.type=="application/msword" || files.myFile.type=="application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||  files.myFile.type=="application/vnd.ms-excel" || files.myFile.type=="application/vnd.oasis.opendocument.spreadsheet" ||  files.myFile.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || files.myFile.type=="application/vnd.ms-powerpoint" || files.myFile.type=='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
			media_type='Document';
		}
		else if(files.myFile.type=='video/mp4' || files.myFile.type=='video/ogg'){
			media_type='Video';			    
		}
		else if(files.myFile.type=='audio/mpeg' || files.myFile.type=='audio/ogg'){
			media_type='Audio';			    
		}
		else{
			media_type='Image';
			//add thumbnail code
			var imgUrl = file_name;
			var mediaCenterPath = "/../../public/assets/Media/img/";
		    var srcPath = __dirname + mediaCenterPath + imgUrl;
			
			if (fs.existsSync(srcPath)) {
				var dstPathCrop_100 = __dirname + mediaCenterPath +"100X100/"+ imgUrl;
				var dstPathCrop_400 = __dirname+ mediaCenterPath +"400X400/"+imgUrl;
				var dstPathCrop_500 = __dirname+ mediaCenterPath +"500X500/"+imgUrl;
				  
				crop_image(srcPath,dstPathCrop_100,100,100);
				//crop_image(srcPath,dstPathCrop_400,400,400);
				//crop_image(srcPath,dstPathCrop_500,500,500);
				crop_image(srcPath,dstPathCrop_400,600,600);
				crop_image(srcPath,dstPathCrop_500,1200,1200);
			}
			
		}
		
		var incNum = 0;
		counters.findOneAndUpdate(
			   { _id: "userId" },{$inc:{seq:1}},{new:true},function(err,data){
			if (!err) {
				console.log('=========================')
				console.log(data);
				//data.seq=(data.seq)+1;
				console.log(data.seq);
				incNum=data.seq;
				//data.save(function(err){
					//if( !err ){
						console.log("incNum="+incNum);
						dataToUpload={
							Location:[],
							UploadedBy:"admin",
							UploadedOn:Date.now(),
							UploaderID:req.session.admin._id,
							Source:"Thinkstock",
							SourceUniqueID:null,
							Domains:null,
							AutoId:incNum,
							GroupTags:[],
							Collection:null,
							Status:0,
							MetaMetaTags:null,
							MetaTags:null,
							AddedWhere:"directToPf", //directToPf,hardDrive,dragDrop
							IsDeleted:0,
							TagType:"",
							ContentType:files.myFile.type,
							MediaType:media_type,
							AddedHow:'hardDrive',
							Locator:name+"_"+incNum	//added on 23012014
						}
						  
						dataToUpload.Location.push({
							Size:files.myFile.size,
							URL:file_name
						})
						
						media(dataToUpload).save(function(err){
							if(err){
							  res.json(err);
							}
							else{
								console.log("returning....");
								findAll(req,res)
							}
						});
					//}
				//});
			}
	   });
		
			    
	}
    });
}
*/
var uploadfile = function(req,res){
	var incNum = 0;
	counters.findOneAndUpdate(
	{ _id: "userId" },{$inc:{seq:1}},{new:true},function(err,data){
	if (!err) {
		console.log('=========================')
		console.log(data);
		//data.seq=(data.seq)+1;
		console.log(data.seq);
		incNum = data.seq;
		//data.save(function(err){
		//if( !err ){
		console.log("incNum="+incNum);
		var form = new formidable.IncomingForm();        	
		var RecordLocator = "";
		
		form.parse(req, function(err, fields, files) {
		  var file_name="";
		  
		  if(files.myFile.name){
			uploadDir = __dirname + "/../../public/assets/Media/img";
			file_name = files.myFile.name;
			file_name = file_name.split('.');
			ext = file_name[file_name.length-1];
			RecordLocator = file_name[0];
			var name = '';
			name=dateFormat()+'_'+incNum;
			////name = Math.floor( Date.now() / 1000 ).toString()+'_'+incNum;
			//file_name=name+'.'+ext;
			file_name=name+'.'+ext; //updated on 09022015 by manishp : <timestamp>_<media_unique_number>_<size>.<extension> = 1421919905373_101_600.jpeg
			console.log(files.myFile.type);
			fs.renameSync(files.myFile.path, uploadDir + "/" + file_name)
			
			var media_type='';
			if(files.myFile.type=="application/pdf" || files.myFile.type=="application/msword" || files.myFile.type=="application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||  files.myFile.type=="application/vnd.ms-excel" || files.myFile.type=="application/vnd.oasis.opendocument.spreadsheet" ||  files.myFile.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || files.myFile.type=="application/vnd.ms-powerpoint" || files.myFile.type=='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
				media_type='Document';
			}
			else if(files.myFile.type=='video/mp4' || files.myFile.type=='video/ogg'){
				media_type='Video';			    
			}
			else if(files.myFile.type=='audio/mpeg' || files.myFile.type=='audio/ogg'){
				media_type='Audio';			    
			}
			else{
				media_type='Image';
				//add thumbnail code
				var imgUrl = file_name;
				var mediaCenterPath = "/../../public/assets/Media/img/";
				var srcPath = __dirname + mediaCenterPath + imgUrl;
				
				if (fs.existsSync(srcPath)) {
					var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+imgUrl;
					var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+imgUrl;
					var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
					var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
					var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
					crop_image(srcPath,dstPathCrop_SMALL,100,100);
					crop_image(srcPath,dstPathCrop_SG,300,300);
					//crop_image(srcPath,dstPathCrop_400,400,400);
					//crop_image(srcPath,dstPathCrop_500,500,500);
					crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
					crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
					resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440); // 575,360
				}
				
			}
			
			
			console.log("incNum="+incNum);
			var successFlag = false;
			
			var __UploaderID = '';
			if(req.session.admin){
				__UploaderID = req.session.admin._id;
				successFlag = true;
			}else if(req.session.subAdmin){
				 __UploaderID = req.session.subAdmin._id;
				 successFlag = true;
			}
			else{
				//return;
			}
			
			if( successFlag ){
				dataToUpload={
					Location:[],
					UploadedBy:"admin",
					UploadedOn:Date.now(),
					UploaderID:__UploaderID,
					Source:"Thinkstock",
					SourceUniqueID:null,
					Domains:null,
					AutoId:incNum,
					GroupTags:[],
					Collection:null,
					Status:0,
					MetaMetaTags:null,
					MetaTags:null,
					AddedWhere:"directToPf", //directToPf,hardDrive,dragDrop
					IsDeleted:0,
					TagType:"",
					ContentType:files.myFile.type,
					MediaType:media_type,
					AddedHow:'hardDrive',
					Locator:RecordLocator+"_"+incNum	//added on 23012014
				}
				  
				dataToUpload.Location.push({
					Size:files.myFile.size,
					URL:file_name
				})
				
				media(dataToUpload).save(function(err){
					if(err){
					  res.json(err);
					}
					else{
						console.log("returning....");
						findAll(req,res)
					}
				});
			}
			else{
				res.json({"code":401,"msg":"Admin/Subadmin session not found."});
			}
			
		}
		});
	}
	});
}
exports.uploadfile = uploadfile;

/*
var uploadLink = function(req,res){
    var type='Link';
    if (req.body.type == 'Notes') {
		type='Notes';
    }
    if (req.body.type == 'Montage') {
		type='Montage';
	}
	
	var thumbnail = '';
	if(req.body.thumbnail){
		thumbnail = req.body.thumbnail;
	}
	
	
	dataToUpload={
		Location:[],
		UploadedBy:"user",
		UploadedOn:Date.now(),
		UploaderID:req.session.user._id,
		Source:"Thinkstock",
		SourceUniqueID:null,
		Domains:null,
		GroupTags:[],
		Collection:null,
		//Status:0,
		Status:2, //updated on 25122014 by manishp after discussing with amitchh - for more detail on Status codes check the comments on media model
		MetaMetaTags:null,
		MetaTags:null,
		AddedWhere:"directToPf", //directToPf,hardDrive,dragDrop
		IsDeleted:0,
		TagType:"",
		Content:req.body.content,
		ContentType:type,
		MediaType:type,
		AddedHow:type,
		thumbnail:thumbnail	//added on 24122014 by manishp embedded link thumbnail case.
    }
      
    dataToUpload.Location.push({
		Size:"",
		URL:""
    })
    
    media(dataToUpload).save(function(err,tata){
		if(err){
		  res.json({"code":"404","message":err});
		}
		else{
		  res.json({"code":"200","message":"success","response":tata})
		}
    });    
}

exports.uploadLink = uploadLink;
*/
/*
var uploadLink = function(req,res){
    var type='Link';
    if (req.body.type == 'Notes') {
		type='Notes';
    }
    if (req.body.type == 'Montage') {
		type='Montage';
	}
	console.log("---------------req.body.type = "+req.body.type);
	
	var LinkType = '';
	if( req.body.linkType ){
		LinkType = req.body.linkType;
	}
	var thumbnail = '';
	if(req.body.thumbnail){
		thumbnail = req.body.thumbnail;
		if( type == 'Link' ){
			
			//console.log("Thumbnail = "+thumbnail);
			var url = require('url');
			var fileName = "web-link-"+Date.now()+url.parse(thumbnail).pathname.split('/').pop().split('?').shift();
			var nameArr = [];
			var name = '';
			nameArr = fileName.split('.');
			if( nameArr.length ){
				name = nameArr[0];
			}
			else{
				name = fileName;
			}
			
			//asynchronous call - child process command execution
			saveFileFromUrl(thumbnail , fileName);
			thumbnail = fileName;
		}
	}
	console.log("------------------name = ",name);
	var incNum = 0;
		counters.findOneAndUpdate(
			   { _id: "userId" },{$inc:{seq:1}},{new:true},function(err,data){
			if (!err) {
				console.log('=========================')
				console.log(data);
				//data.seq=(data.seq)+1;
				console.log(data.seq);
				incNum=data.seq;
				data.save();
				console.log("incNum="+incNum);
				dataToUpload={
					Location:[],
					AutoId:incNum,
					UploadedBy:"user",
					UploadedOn:Date.now(),
					UploaderID:req.session.user._id,
					Source:"Thinkstock",
					//SourceUniqueID:null,
					SourceUniqueID:"53ceb02d3aceabbe5d573dba", //updated on 06012015
					//Domains:null,
					Domains:"53ad6993f222ef325c05039c",
					GroupTags:[],
					//Collection:null,
					Collection:["53ceaf933aceabbe5d573db4","53ceaf9d3aceabbe5d573db6","549323f9610706c30a70679e"],
					//Status:0,
					Status:2, //updated on 25122014 by manishp after discussing with amitchh - for more detail on Status codes check the comments on media model
					MetaMetaTags:null,
					MetaTags:null,
					//AddedWhere:"directToPf", //directToPf,hardDrive,dragDrop
					AddedWhere:"board", //directToPf,board,capsule
					IsDeleted:0,
					TagType:"",
					Content:req.body.content,
					ContentType:type,
					MediaType:type,
					AddedHow:type,
					thumbnail:thumbnail,	//added on 24122014 by manishp embedded link thumbnail case.
					Locator:name+"_"+incNum,
					LinkType:LinkType
				}
				  
				dataToUpload.Location.push({
					Size:"",
					URL:""
				})
				//console.log("dataToUpload = ",dataToUpload);return;
				media(dataToUpload).save(function(err,tata){
					if(err){
					  res.json({"code":"404","message":err});
					}
					else{
					  res.json({"code":"200","message":"success","response":tata})
					}
				});   
				
			}
			});
 
}
*/
var uploadLink = function(req,res){
	var incNum = 0;
	counters.findOneAndUpdate(
		   { _id: "userId" },{$inc:{seq:1}},{new:true},function(err,data){
		if (!err) {
			console.log('=========================')
			console.log(data);
			//data.seq=(data.seq)+1;
			console.log(data.seq);
			incNum=data.seq;
			//data.save();
			console.log("incNum="+incNum);
			var type='Link';
			if (req.body.type == 'Notes') {
				type='Notes';
				name=dateFormat();
				//name = Date.now();//18022015
			}
			if (req.body.type == 'Montage') {
				type='Montage';
				name = 'montage_'+incNum;
			}
			console.log("---------------req.body.type = "+req.body.type);
			
			var LinkType = '';
			if( req.body.linkType ){
				LinkType = req.body.linkType;
			}
			
			var thumbnail = '';
			if(req.body.thumbnail){
				thumbnail = req.body.thumbnail;
				if( type == 'Link' ){
					
					//console.log("Thumbnail = "+thumbnail);
					var url = require('url');
					var f = '';
					var fArr = [];
					//var fileName = "web-link-"+Date.now()+url.parse(thumbnail).pathname.split('/').pop().split('?').shift();
					f = url.parse(thumbnail).pathname.split('/').pop().split('?').shift();
					fArr = f.split('.');
					RecordLocator = fArr[0];
					console.log("RecordLocator = "+RecordLocator);//return;
					ext = fArr[fArr.length - 1];
					//var fileName = Date.now()+'_'+incNum+'.'+ext;
					var name = '';
					name = RecordLocator;
					   var fileName = dateFormat()+'_'+incNum+'.'+ext;
					//asynchronous call - child process command execution
					saveFileFromUrl(thumbnail , fileName);
					thumbnail = fileName;
				}
			}
			console.log("------------------name = ",name);
			
			var dataToUpload={
				Location:[],
				AutoId:incNum,
				UploadedBy:"user",
				UploadedOn:Date.now(),
				UploaderID:req.session.user._id,
				Source:"Thinkstock",
				//SourceUniqueID:null,
				SourceUniqueID:"53ceb02d3aceabbe5d573dba", //updated on 06012015
				//Domains:null,
				Domains:"53ad6993f222ef325c05039c",
				GroupTags:[],
				//Collection:null,
				Collection:["53ceaf933aceabbe5d573db4","53ceaf9d3aceabbe5d573db6","549323f9610706c30a70679e"],
				//Status:0,
				Status:2, //updated on 25122014 by manishp after discussing with amitchh - for more detail on Status codes check the comments on media model
				MetaMetaTags:null,
				MetaTags:null,
				//AddedWhere:"directToPf", //directToPf,hardDrive,dragDrop
				AddedWhere:"board", //directToPf,board,capsule
				IsDeleted:0,
				TagType:"",
				Content:req.body.content,
				ContentType:type,
				MediaType:type,
				AddedHow:type,
				thumbnail:thumbnail,	//added on 24122014 by manishp embedded link thumbnail case.
				Locator:name+"_"+incNum,
				LinkType:LinkType,
				OwnerFSGs:req.session.user.FSGsArr2,
				OwnStatement:req.body.Statement?req.body.Statement:"",	//The Original statement by the image owner 
				CurrStatement:req.body.Statement?req.body.Statement:"",	// Statement currently in use
			}
			if ( req.body.Prompt ){
				dataToUpload.Prompt = req.body.Prompt;
			}
			dataToUpload.Location.push({
				Size:"",
				URL:""
			})
			
			if ( req.body.Title ){
				dataToUpload.Title = req.body.Title;
			}
			
			//console.log("dataToUpload = ",dataToUpload);return;
			media(dataToUpload).save(function(err,tata){
				if(err){
				  res.json({"code":"404","message":err});
				}
				else{
					if ( req.body.Prompt ){
						add__Descriptors( req.body.Prompt , tata._id );
					}
				  res.json({"code":"200","message":"success","response":tata})
				}
			});   
			
		}
	});
 
}

exports.uploadLink = uploadLink;


var deleteMedia = function(req,res){
	//delete thumbnail code
	media.find({_id:{$in:req.body.media}}, function(err , mediaRecords){
		if( !err ){
			media.remove({_id:{$in:req.body.media}},function(err){
				if(err){
					res.json(err)
				}
				else{
					for( var loop = 0; loop < mediaRecords.length; loop++ ){	
						mediaRec = mediaRecords[loop];
						if( mediaRec.Status != 1 ){	//delete from file system in case of de-active media 
							if( mediaRec.MediaType != 'Notes' ){
								console.log("-----------------------------------IF----");
								var file_name = '';
								console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
								switch( mediaRec.MediaType ){
									case 'Image':
										file_name = mediaRec.Location[0].URL;
										console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
										break;
										
									case 'Montage':
										file_name = mediaRec.thumbnail;
										console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
										break;
										
									case 'Link':
										file_name = mediaRec.thumbnail;
										console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
										break;
									
									default:
										console.log("default case---");
										//do nothing
								}
								console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
								if( file_name != '' ){
									console.log("Calling delete...");
									__deleteMediaThumbnails(file_name);
								}
								
							}else{
								console.log("ELSE----");
							}
						}
					}
					
					findAllStatus(req,res)
				}
			});
		}
	})
}

//exports.deleteMedia = deleteMedia;

var deleteMedia_v2 = function(req,res){
	var deactivatedMediaArr = [];
	var deactivatedMediaIds = [];
	
	var activatedMediaIds = [];
	
	//delete thumbnail code
	media.find({_id:{$in:req.body.media}},{Status:1,MediaType:1,thumbnail:1,Location:1}, function(err , mediaRecords){
		if( !err ){
			//make two array one for de-active media and another for active media
			for( var loop = 0; loop < mediaRecords.length; loop++ ){	
				mediaRec = mediaRecords[loop];
				if( mediaRec.Status != 1 ){	//delete from file system in case of de-active media 
					deactivatedMediaArr.push(mediaRec);
					deactivatedMediaIds.push(mediaRec._id);
				}
				else{
					activatedMediaIds.push(mediaRec._id);
				}
			}
			
			console.log("De-activated Media IDs : ",deactivatedMediaIds);
			console.log("activated Media IDs : ",activatedMediaIds);
			
			//handle activated media case
			if( deactivatedMediaIds.length > 0 ){
				media.remove({_id:{$in:deactivatedMediaIds}},function(err){
					if(err){
						res.json(err)
					}
					else{
						for( var loop = 0; loop < deactivatedMediaArr.length; loop++ ){	
							var mediaRec = [];
							mediaRec = deactivatedMediaArr[loop];
							if( mediaRec.MediaType != 'Notes' ){
								console.log("-----------------------------------IF----");
								var file_name = '';
								console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
								switch( mediaRec.MediaType ){
									case 'Image':
										file_name = mediaRec.Location[0].URL;
										console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
										break;
										
									case 'Montage':
										file_name = mediaRec.thumbnail;
										console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
										break;
										
									case 'Link':
										file_name = mediaRec.thumbnail;
										console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
										break;
									
									default:
										console.log("default case---");
										//do nothing
								}
								console.log("file_name = "+file_name+"--------mediaRec.MediaType = "+mediaRec.MediaType);
								if( file_name != '' ){
									console.log("Calling delete...");
									__deleteMediaThumbnails(file_name);
								}
								
							}else{
								console.log("ELSE----");
							}
							
						}
						
						deleteActivatedMedia( activatedMediaIds );
						//findAllStatus(req,res)
					}
				});
			}
			else{
				deleteActivatedMedia( activatedMediaIds );
			}
			//end handle de-activated media case
		}
	})
	
	function deleteActivatedMedia( activatedMediaIds ){
		console.log("CAlled....");
		//handle activated media case
		if( activatedMediaIds.length > 0 ){
			var condition = {_id:{$in:activatedMediaIds}};
			var fields = {$set:{IsDeleted:1}};
			var options = {multi:true};
			
			media.update(condition,fields,options,function(err){
				if(err){
					console.log("ERROR----");
					res.json(err)
				}
				else{
					console.log("Yes m in success");
					//No need to delete media from hard disk
					findAllStatus(req,res)
				}
			});
		}
		else{
			findAllStatus(req,res)
		}
	}
}

exports.deleteMedia = deleteMedia_v2;

function __deleteMediaThumbnails(file_name){
	console.log("Got action...");
	
	var imgUrl = file_name;
	var mediaCenterPath = "/../../public/assets/Media/img/";
	//var mediaCenterPath = "/public/assets/Media/img/";
	var srcPath = __dirname + mediaCenterPath + imgUrl;
	
	if (fs.existsSync(srcPath)) {
		console.log("file found...");
		
		fs.unlink(srcPath);
		
		var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+ imgUrl;
		var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+imgUrl;
		var dstPathCrop_MEDIUM = __dirname + mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
		var dstPathCrop_LARGE = __dirname + mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
		var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
		
		if (fs.existsSync(dstPathCrop_SMALL)) {
			fs.unlink(dstPathCrop_SMALL);
			console.log("dstPathCrop_SMALL Deleted...");
		}
		
		if (fs.existsSync(dstPathCrop_SG)) {
			fs.unlink(dstPathCrop_SG);
			console.log("dstPathCrop_SG Deleted...");
		}
		
		if (fs.existsSync(dstPathCrop_MEDIUM)) {
			fs.unlink(dstPathCrop_MEDIUM);
			console.log("dstPathCrop_MEDIUM Deleted...");
		}
		if (fs.existsSync(dstPathCrop_LARGE)) {
			fs.unlink(dstPathCrop_LARGE);
			console.log("dstPathCrop_LARGE Deleted...");
		}
		if (fs.existsSync(dstPathCrop_ORIGNAL)) {
			fs.unlink(dstPathCrop_ORIGNAL);
			console.log("dstPathCrop_ORIGNAL Deleted...");
		}
		
	}
	else{
		console.log("file not found..." + srcPath);
	}
}

var postMedia = function(req,res){
    
    var fields={
	MediaId:req.body.id,
	Title:null,
	Prompt:null,
	Photographer:null,
	BoardId:req.body.board,
	Action:'Post',
	OwnerId:req.session.user._id,
	MediaType:req.body.data.MediaType,
	ContentType:req.body.data.ContentType,
	UserFsg:req.session.user.FSGs,
	CreatedOn:Date.now(),
	UserId:req.session.user._id
    }
    
    console.log("Media entered to action logs here")
    console.log(fields);
    
    mediaAction(fields).save(function(err){
	if(err){
	    res.json({"code":"404","message":err});
	}
	else{
	    board.find({_id:req.body.board},function(err,result1){
		res.json({"code":"200","message":"success","response":result1});
	    })
	}
    })
    
    
}

exports.postMedia = postMedia;

var viewMedia = function(req,res){
    var medias = req.body.arrayOfMedias;
    var board = req.body.board;
    media.find({"_id":{$in:medias}},function(err,result){
	console.log(medias);
	console.log(result);
	if(err){
	    res.json({"code":"404","message":"Not Found!"})
	}
	else{
	    for(i in result){
		var fields={
		    MediaId:result[i].id,
		    Title:result[i].Title,
		    Prompt:result[i].Prompt,
		    Photographer:result[i].Photographer,
		    BoardId:req.body.board,
		    Action:'View',
		    MediaType:result[i].MediaType,
		    ContentType:result[i].ContentType,
		    UserFsg:req.session.user.FSGs,
		    CreatedOn:Date.now(),
		    OwnerId:result[i].UploaderID,
		    UserId:req.session.user._id
		};
		
		mediaAction(fields).save(function(err){
		    if(err){
			//res.json({"code":"404","message":err});
		    }
		    else{
				    
		    }
		})
		
		var viewcount=1;
		if (typeof(result[i].ViewsCount)!='undefined') {
		    viewcount=result[i].ViewsCount+1;
		}
		datafield={
		    ViewsCount:viewcount
		};
		var query={_id:result[i]._id};
		var options={multi:false};
		media.update(query,datafield,options,function(err){
		    if(err){
			//res.json({"code":"404","message":err});
		    }
		    else{
			//res.json({"code":"200","message":"success"});
		    }
		})
		
	    }
	    res.json({"code":"200","message":"success"});
	}
    })
}

exports.viewMedia = viewMedia;

/***
 * Image crop..
 * Available gravity options are [NorthWest, North, NorthEast, West, Center, East, SouthWest, South, SouthEast]
***/
var crop_image = function(srcPath,dstPath,width,height){
    console.log("source : ",srcPath+" ---- destination : "+dstPath);
	var im   = require('imagemagick');
	//var im = require('imagemagick').subClass({ imageMagick: true });
    try{
		im.crop({
			srcPath: srcPath,
			dstPath: dstPath,
			width: width,
			height: height,
			quality: 1,
			gravity: "Center"
		}, function(err, stdout, stderr){
			if (err) throw err;
			console.log('success..');
		});
	}
	catch(e){
		console.log("=========================ERROR : ",e);
	}
	
}
exports.crop_image = crop_image;

/***
 * Image crop..
 * Available gravity options are [NorthWest, North, NorthEast, West, Center, East, SouthWest, South, SouthEast]
***/
function crop_image__Note(srcPath,dstPath,width,height){
    console.log("source : ",srcPath+" ---- destination : "+dstPath);
	var im   = require('imagemagick');
	//var im = require('imagemagick').subClass({ imageMagick: true });
    try{
		im.crop({
			srcPath: srcPath,
			dstPath: dstPath,
			width: width,
			height: height+"^",
			quality: 1,
			gravity: "North"
		}, function(err, stdout, stderr){
			if (err) throw err;
			console.log('success..');
		});
	}
	catch(e){
		console.log("=========================ERROR : ",e);
	}
	
}

/*________________________________________________________________________
	* @Date:      	13 March 2015
	* @Method :   	resize_image
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to resize orignal media.
	* @Param:     	4
	* @Return:    	no
_________________________________________________________________________
*/
 //BY Parul 20022015
 
  var  resize_image = function(srcPath,dstPath,w,h){
	console.log("source : ",srcPath+" ---- destination : "+dstPath);
	var im   = require('imagemagick');
	
	try{
	im.identify(srcPath,function(err,features){
		if (err) {
			console.log(err);
		}else{
			console.log(features.width+"======================"+features.height);
			if (parseInt(features.height) >= parseInt(h)) {
				console.log('========================================================================== here1');
				im.resize({
					srcPath: srcPath,
					dstPath: dstPath,
					//width: w,
					height: h,
					//resizeStyle: 'aspectfit', // is the default, or 'aspectfit' or 'fill'
					//gravity: 'Center' // optional: position crop area when using 'aspectfill'
				});
			}
			else if (parseInt(features.width) >= parseInt(w)) {
				console.log('========================================================================== here2');
				im.resize({
					srcPath: srcPath,
					dstPath: dstPath,
					width: w,
					//height: 1440,
					//resizeStyle: 'aspectfit', // is the default, or 'aspectfit' or 'fill'
					//gravity: 'Center' // optional: position crop area when using 'aspectfill'
				});
			}
			else{
				console.log('========================================================================== here3');
				im.resize({
					srcPath: srcPath,
					dstPath: dstPath,
					width: features.width,
					height: features.height,
					//resizeStyle: 'aspectfit', // is the default, or 'aspectfit' or 'fill'
					//gravity: 'Center' // optional: position crop area when using 'aspectfill'
				});
			}
		}
		})
	
		
	}
	catch(e){
		console.log("=========================ERROR : ",e);
	}
 }
 exports.resize_image = resize_image;
 
 /**************************** END IMAGE RESIZE ***************************************/

/*________________________________________________________________________
	* @Date:      	13 March 2015
	* @Method :   	resize_image__Note
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to resize orignal media for Note case.
	* @Param:     	4
	* @Return:    	no
_________________________________________________________________________
*/
 //BY Parul 20022015
 
 function resize_image__Note(srcPath,dstPath,w,h){
	console.log("source : ",srcPath+" ---- destination : "+dstPath);
	var im   = require('imagemagick');
	
	try{
	im.identify(srcPath,function(err,features){
		if (err) {
			console.log(err);
		}else{
			console.log(features.width+"======================"+features.height);
			if (parseInt(features.height) >= parseInt(h)) {
				console.log('========================================================================== here1');
				im.resize({
					srcPath: srcPath,
					dstPath: dstPath,
					//width: w,
					height: h,
					//resizeStyle: 'aspectfit', // is the default, or 'aspectfit' or 'fill'
					gravity: 'North' // optional: position crop area when using 'aspectfill'
				});
			}
			else if (parseInt(features.width) >= parseInt(w)) {
				console.log('========================================================================== here2');
				im.resize({
					srcPath: srcPath,
					dstPath: dstPath,
					width: w,
					//height: 1440,
					//resizeStyle: 'aspectfit', // is the default, or 'aspectfit' or 'fill'
					gravity: 'North' // optional: position crop area when using 'aspectfill'
				});
			}
			else{
				console.log('========================================================================== here3');
				im.resize({
					srcPath: srcPath,
					dstPath: dstPath,
					width: features.width,
					height: features.height,
					//resizeStyle: 'aspectfit', // is the default, or 'aspectfit' or 'fill'
					gravity: 'North' // optional: position crop area when using 'aspectfill'
				});
			}
		}
		})
	
		
	}
	catch(e){
		console.log("=========================ERROR : ",e);
	}
 }
 
 
 /**************************** END IMAGE RESIZE ***************************************/


/*20 Dec 2014 parul*/
var updateMontage = function(req, res) {
	// Code for montage upload
	var fields = req.body;
	console.log("*****");
	console.log(fields.montage_id);
	//var imagename = "./public/assets/Media/img/a"+fields.montage_id+".png";
	
	var query={_id:fields.montage_id};
	//var field={thumbnail:"./public/assets/board/img/a"+fields.montage_id+".png"};
	//var field={thumbnail:"a"+fields.montage_id+".png"};
	
	media.findOne(query,function(err,montageData){
		if(!err){
			var name = '';
			name = dateFormat()+'_'+montageData.AutoId;
			
			var imagename = __dirname+"/../../public/assets/Media/img/"+name+".png"; //updated by manishp on 23122014 at 10 PM
			fs.writeFile(imagename, fields.image, 'base64', function(err) {
				if (err) {
					console.log("ERROOORR");
					console.log(err);
					console.log("imagename = ",imagename);return false;
				}else{
					//add thumbnail code
					var imgUrl = name+".png";
					var mediaCenterPath = "/../../public/assets/Media/img/";
					var srcPath = __dirname + mediaCenterPath + imgUrl;
					
					if (fs.existsSync(srcPath)) {
						var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+ imgUrl;
						var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+imgUrl;
						var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
						var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
						var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl; 
						
						crop_image(srcPath,dstPathCrop_SMALL,100,100);
						crop_image(srcPath,dstPathCrop_SG,300,300);
						crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
						crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
						resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
					}
				}
			});
		
			montageData.thumbnail = name + ".png";
			montageData.Locator = name;
			montageData.save(function(){
				if( !err ){
					res.json({"code":"200","message":"success","thumbnail":montageData.thumbnail});
				}
			})
		}else{
			res.json(err);
		}
		
	})
	
	
	/*
	media.update(query,{$set:field},{upsert:false},function(err){
		if (err) {
			console.log(err);
		}
		else{
			res.json({"code":"200","message":"success","thumbnail":field.thumbnail});
		}
	});
	*/	
};

exports.updateMontage = updateMontage;



/// parul 08012015

var viewMediaAdmin=function(req,res){
	console.log('in view media admin');
	console.log(req.body);
	media.find({_id:req.body.ID},function(err,data){
		if (!err) {
			res.json({"code":"200","message":"success","result":data})
		}else{
			console.log(err);return;
		}
	}).populate('MetaMetaTags SourceUniqueID Domains Collection GroupTags.GroupTagID')
	 
};
exports.viewMediaAdmin=viewMediaAdmin;


/***
 * npm install imagemagick 
 * Image resize..
 * srcPath, dstPath and (at least one of) width and height are required. 
***/
//function resize_image(srcPath,dstPath,img_wh,flag){
//    var strtxt = srcPath+'|'+dstPath+'|'+img_wh+'|'+flag+'| _thumb';
//    console.log(strtxt);
//    var im   = require('imagemagick');
//    if(flag=='height'){
//        im.resize({
//        srcPath: srcPath,
//        dstPath: dstPath,
//        height:   img_wh,
//        quality: 0.8,
//        sharpening: 0.5,
//        }, function(err, stdout, stderr){
//            if (err) throw err;
//            console.log('Success.');
//        });    
//    }else{
//        im.resize({
//        srcPath: srcPath,
//        dstPath: dstPath,
//        width:   img_wh,
//        quality: 0.8,
//        sharpening: 0.5,
//        }, function(err, stdout, stderr){
//            if (err) throw err;
//            console.log('Success thumb.');
//        });    
//    }
//}

/***
 * Image crop..
 * Available gravity options are [NorthWest, North, NorthEast, West, Center, East, SouthWest, South, SouthEast]
***/
/*
function crop_image(srcPath,dstPath,width,height){
    var strtxt = srcPath+'|'+dstPath+'|'+width+'|'+height+'| _crop';
    console.log(strtxt);
    
    var im   = require('imagemagick');
	
    im.crop({
        srcPath: srcPath,
        dstPath: dstPath,
        width: width,
        height: height,
        quality: 1,
        gravity: "Center"
    }, function(err, stdout, stderr){
        if (err) throw err;
        console.log('Success crop.');
    });
}
*/

//Generating Thumbnails of all the Existing Images
//added by manishp on 14012015

var GenerateThumbnail = function(req, res){
    var fields={};
    //fields['MediaType'] = "Montage";
	fields['MediaType'] = "Link";
    
    var rec_skip = 0;
    var rec_limit = 1;
    if(req.query.rec_skip && req.query.rec_limit){
	    rec_skip = req.query.rec_skip;
	    rec_limit = req.query.rec_limit;
    }
	
    media.find(fields).sort({UploadedOn: 'desc'}).skip(rec_skip).limit(rec_limit).exec(function(err,result){
	if(err){ 		
	    res.json(err);
	}
	else{
	    if(result.length==0){
		res.json({"code":"404","msg":"Not Found",responselength:0})
	    }
	    else{				
			//start code here
			console.log("Total "+result.length+" Links found----Process starting...");
			for( var loop = 0; loop < result.length; loop++ ){
				
				if( fields['MediaType'] = "Link" ){
					console.log("Link case");
					if( result[loop].WebThumbnail ){
						console.log("Found WebThumbnail...");
						var thumbnail = result[loop].WebThumbnail;
						//console.log("Thumbnail = "+thumbnail);
						var url = require('url');
						var fileName = "web-link-"+Date.now()+url.parse(thumbnail).pathname.split('/').pop().split('?').shift();
						//asynchronous call - child process command execution
						saveFileFromUrl(thumbnail , fileName , result[loop]._id , res , result.length);
					}
				}
				else{
					console.log("Other case");
					//saveThumbnail(result[loop]);
				}
				
			}
			
			/*----------------*/
			//res.json({"code":"200","msg":"api found",responselength:result.length});
	    }
	}
    })
};

exports.GenerateThumbnail = GenerateThumbnail;

function saveThumbnail(result){
    
    if(!result.Location.length)
	return false;
    
    //var imgUrl = result.Location[0].URL;
	var imgUrl = result.thumbnail;
    var mediaCenterPath = "/../../public/assets/Media/img/";
   
    var srcPath = __dirname + mediaCenterPath + imgUrl;
    
    var fs = require('fs');
    
    if (!fs.existsSync(srcPath)) {
		// Do something
		return false;
    }
     		
    var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+ imgUrl;
    var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+imgUrl;
	var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
    var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
    var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl; 
    
    crop_image(srcPath,dstPathCrop_SMALL,100,100);
    crop_image(srcPath,dstPathCrop_SG,300,300);
	//crop_image(srcPath,dstPathCrop_400,400,400);
    //crop_image(srcPath,dstPathCrop_500,500,500);
	crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
    crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
    resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
    return true;
    
    //var dstPathThumb_100 = __dirname+"/../../public/assets/Media/img/100X100/thumb_"+imgUrl;
    //var dstPathThumb_400 = __dirname+"/../../public/assets/Media/img/400X400/thumb_"+imgUrl;
    //var dstPathThumb_500 = __dirname+"/../../public/assets/Media/img/500X500/thumb_"+imgUrl;
    
    //var flag="Width";				
    /*-----------------*/
    //resize_image(srcPath,dstPathThumb_100,100,flag);
    //resize_image(srcPath,dstPathThumb_400,400,flag);
    //resize_image(srcPath,dstPathThumb_500,500,flag);
    
}

function saveFileFromUrl(fileUrl , fileName , mediaId , res , resultLength){
	console.log("saveFileFromUrl called");
	if( fileUrl ){
		console.log("saveFileFromUrl called in if");
		var mediaCenterPath = "/../../public/assets/Media/img/";
		var dlDir = __dirname + mediaCenterPath;
		
		console.log("Download From = "+fileUrl.replace(/&/g,'\\&'));
		console.log("To = "+dlDir+fileName);
		
		var exec = require('child_process').exec;
		//in curl we have to escape '&' from fileUrl
		var curl =  'curl ' + fileUrl.replace(/&/g,'\\&') +' -o ' + dlDir+fileName + ' --create-dirs';
		
		console.log("Command to download : "+curl);
		
		try{
			var child = exec(curl, function(err, stdout, stderr) {
				if (err){ 
					console.log(stderr); //throw err; 
				} 
				else {
					console.log(fileName + ' downloaded to ' + dlDir);
					
					//crop
					var srcPath = dlDir+fileName;
					var imgUrl = fileName;
					if (fs.existsSync(srcPath)) {
						var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+ imgUrl;
						var dstPathCrop_SG = __dirname+ mediaCenterPath + process.urls.SG__thumbnail+"/"+imgUrl;
						var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
						var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
						var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl; 
						crop_image(srcPath,dstPathCrop_SMALL,100,100);
						crop_image(srcPath,dstPathCrop_SG,300,300);
						//crop_image(srcPath,dstPathCrop_400,400,400);
						//crop_image(srcPath,dstPathCrop_500,500,500);
						crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
						crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
						resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
					}
					
					if(mediaId){
						var query={_id:mediaId};
						var options={};
						var fields = {};
						fields.thumbnail=fileName;
						media.update(query, { $set: fields}, options, generateCounter)
						
					}
					
				}
			});
		}
		catch(e){
			console.log("E = ",e);
			
		}
		
		function generateCounter(){
			resultCounter++;
			console.log("resultCounter = "+resultCounter);
			if( resultCounter > (resultLength/2) ){
				res.json({"code":"200","msg":resultCounter+" Links have been processed..",responselength:resultCounter});
				return;
			}
		}
	}
	else{
		console.log("fileUrl Error = "+fileUrl);
	}
}

var resultCounter = 0;

//Generating Thumbnails of all the Existing Images



var view_media = function(req,res){
	console.log(req.body.id);
	//console.log(req.body);
	//res.json({"message":"Api routes success...", "request":req.query});
	media.findOne({_id:req.body.id},function(err,mediaDetails){
		if (!err) {
			res.json({"code":"200","msg":"success","response":mediaDetails});
		}else{
			res.json(err);
		}
	})
};
exports.view_media = view_media;
/********************************************END******************************************************/	 


/*________________________________________________________________________
	* @Date:      	19 Feb 2015
	* @Method :   	get_descriptor
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used for populating descriptor auto complete in serach page.
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/
 //BY Parul 19022015
/*
var get_descriptor = function(req,res){
	media.find({Status:1,IsDeleted:0},function(err,result){
		if (!err) {
			var descriptor = [];
			for (i in result) {
				if (result[i].Prompt && result[i].Prompt != '') {
					var obj = {};
					obj.label = result[i].Prompt;
					obj.value = result[i].Prompt;
					var flag = false;
					for(j in  descriptor){
						if (descriptor[j] == result[i].Prompt) {
							flag = true;
						}
					}
					if (flag != true) {
						descriptor.push(obj);
					}
				}
			}
			res.json({"code":"200","msg":"success","response":descriptor});
		}else{
			res.json(err);
		}
	});
}
*/


//updated on 20022015 by manishp
var get_descriptor = function(req,res){
	media.find({Status:1,IsDeleted:0},{Prompt:1},function(err,result){
		if (!err) {
			var descriptor = [];
			for (i in result) {
				if (result[i].Prompt && result[i].Prompt.trim() != '') {
					var objArr = [];
					objArr = result[i].Prompt.split(',');
					
					for( var loop = 0; loop < objArr.length; loop++  ){
						var obj = {};
						obj.label = objArr[loop].trim();
						obj.value = objArr[loop].trim();
						var flag = false;
						for( var j = 0; j < descriptor.length; j++ ){
							var mStr = '';
							mStr = objArr[loop].trim();
							if ( descriptor[j].value.toUpperCase() == mStr.toUpperCase() ) {
								flag = true;
								break;
							}
							
						}
						if (flag != true) {
							descriptor.push(obj);
						}
						
					}
				}
			}
			res.json({"code":"200","msg":"success","response":descriptor});
		}else{
			res.json(err);
		}
	});
}

exports.get_descriptor=get_descriptor;
/********************************************END******************************************************/	 


/*________________________________________________________________________
	* @Date:      	19 Feb 2015
	* @Method :   	addTag
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to add media descriptors as tags under descriptor gt.
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/
 //BY Parul 20022015
 var addTag = function(req,res){
  
	var tags = req.body.media[i]['prompt'];
	tags = tags.split(',');
	groupTags.findOne({_id:'54e7214560e85291552b1189'},function(err,result){
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
			//else
			//	findTag(req,res)
		});
		}else{
			//res.json({'code':'420','response':'duplicate tag'});
			return;
		  }
	   
	})
  
  
};

exports.addTag = addTag;
/********************************************END******************************************************/	 




/*________________________________________________________________________
	* @Date:      	2 Mar 2015
	* @Method :   	get_descriptor
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to add media descriptors as group tags under descriptor mt & mmt
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/
 //BY Parul 02032015
// var addGT = function(req,res){
//	var tags = req.body.media[i]['prompt'];
//	tags = tags.split(',');
//	console.log(tags);
//	var mediaID = req.body.media[i]['id'];
//	for(j in tags){
//		if (tags[j] != '' && tags[j] != ' ') {
//			//console.log('==========================================================================');
//			//console.log(tags[j]);
//			//console.log('==========================================================================');
//			checkNSaveGT(tags[j], mediaID)
//		}
//	}
//  
//};
//
//exports.addGT = addGT;
/********************************************END******************************************************/	 

//added by arun
 var addGT = function(req, res, temp){
		var tags = req.body.media[i]['prompt'];
		tags = tags.split(',');
		console.log(tags);
		var mediaID = req.body.media[i]['id'];
		console.log("Temp value -------->", temp);
		if (temp > 0) {
			for(i in tags){
				var flag = false;
				for (var k=0;k<temp;k++) {
					var prev_tags = req.body.media[k]['prompt'];
					prev_tags = prev_tags.split(',');
					for(j in prev_tags){
						if (tags[i] == prev_tags[j]) {
							flag = true;
							break;	
						}	
					}
				}
				if (flag == true) {
					console.log("---------Already Exists Yo ================>")	
				}else{
					checkNSaveGT(tags[i], mediaID)
				}
			}
		} else{
			for(j in tags){
				if (tags[j] != '' && tags[j] != ' ') {
					var particular_tag = tags[j].trim();
					tags[j] = particular_tag;
					console.log('==========================================================================');
					console.log("Prev",tags[j-1]);
					console.log(tags[j]);
					console.log('==========================================================================');
					if (tags[j-1] != undefined) {
						var flag = false;
						console.log("J----> ",j);
						for(var k=0;k<j;k++){
							if (tags[j] == tags[k]) {
								flag = true;
								break;	
							}
						}
						if (flag == true) {
							console.log("---------Already Exists Yo ================>")
						} else {
							checkNSaveGT(tags[j], mediaID)
						}
					} else{
						checkNSaveGT(tags[j], mediaID)
					}
				}
			}
		}
	
	

};

exports.addGT = addGT;


/*________________________________________________________________________
	* @Date:      	2 Mar 2015
	* @Method :   	checkNSaveGT
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function checks if a gt with same name exists or not then save accordingly.
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/
 function checkNSaveGT(title, mediaID){
	//groupTags.find({"GroupTagTitle":title,"status":3},function(err,data){ //29 june
	groupTags.find({"GroupTagTitle":title,$or:[{"status":3},{"status":1}]},function(err,data){
		if (err) {
			res.json(err);
		}else{
			if (data.length == 0) {
				var fields = {};
				fields.GroupTagTitle = title;
				//fields.MetaMetaTagID = '54e7211a60e85291552b1187';// for 5555
				//fields.MetaTagID='54e7213560e85291552b1188';// for 5555
				fields.MetaMetaTagID = '54c98aab4fde7f30079fdd5a';// for 8888
				fields.MetaTagID='54c98aba4fde7f30079fdd5b';// for 8888
				fields.status = 3;
				fields.LastModified = Date.now();
				fields.DateAdded = Date.now();
				fields.Tags = [{TagTitle:title,status:1}]; 
				fields.Think = [];
				fields.Less = [];
				fields.More = [];
				//console.log(fields);
				groupTags(fields).save(function(err,retGT){
					if (!err) {
						saveGT_toMedia(retGT._id,mediaID);
					}
				});
			}else{
				saveGT_toMedia(data[0]._id,mediaID);
			}
		}
	})
}
/********************************************END******************************************************/


/*________________________________________________________________________
	* @Date:      	29 June 2015
	* @Method :   	saveGT_toMedia
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-27 02 2015- 
	* @Purpose:   	This function is used update gt field of media.
	* @Param:     	2
	* @Return:    	no
	_________________________________________________________________________
*/
function saveGT_toMedia(gtID,mediaID) {
	media.findOne({_id:mediaID}, function(err,media){
		if (!err) {
			media.GroupTags.push({GroupTagID:gtID});
			media.save();	
		}
		
	})
}
/********************************************END******************************************************/


/*________________________________________________________________________
	* @Date:      	18 Mar 2015
	* @Method :   	videoUpload
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-27 02 2015- 
	* @Purpose:   	This function is used for demo mobile video recording.
	* @Param:     	2
	* @Return:    	no
	_________________________________________________________________________
*/
	
var videoUpload=function(req,res){
    saveFile(req,res,"Video");
};
exports.videoUpload=videoUpload;
/********************************************END******************************************************/	 



/*________________________________________________________________________
	* @Date:      	23 Mar 2015
	* @Method :   	videoUpload
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-27 02 2015- 
	* @Purpose:   	This function is used for demo mobile video recording.
	* @Param:     	2
	* @Return:    	no
	_________________________________________________________________________
*/
	
var audioUpload=function(req,res){
    saveFile(req,res,"Audio");
};
exports.audioUpload=audioUpload;
/********************************************END******************************************************/	 



/*________________________________________________________________________
	* @Date:      	23 Mar 2015
	* @Method :   	saveFile 
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-- 
	* @Purpose:   	This function is used to save audio video file.
	* @Param:     	5
	* @Return:    	-
	_________________________________________________________________________
*/
function saveFile(req,res,fileType){
	console.log('========================================= here =========================================')
    var form = new formidable.IncomingForm();
	form.keepExtensions = true;     //keep file extension
	form.uploadDir = (__dirname+"/../../public/assets/Media/video/");       //set upload directory
	form.keepExtensions = true;     //keep file extension
	form.parse(req, function(err, fields, files) {
		console.log('========================================= here2 =========================================')
		console.log("file size: "+JSON.stringify(files.file.size));
		console.log("file path: "+JSON.stringify(files.file.path));
		console.log("file name: "+JSON.stringify(files.file.name));
		console.log("file type: "+JSON.stringify(files.file.type));
		console.log("lastModifiedDate: "+JSON.stringify(files.file.lastModifiedDate));
		var temp = files.file.name.split('.');
		var ext = temp.pop();
		var incNum = 0;
		var dateTime = new Date().toISOString().replace(/T/,'').replace(/\..+/, '').split(" ");
		counters.findOneAndUpdate({ _id: "userId" },{$inc:{seq:1}},{new:true},function(err,data){
			if (!err) {
				incNum=data.seq;
				var fileName = Date.now()+"_recording_"+ incNum + "." + ext;
				
				fs.rename(files.file.path, __dirname+"/../../public/assets/Media/video/"+ fileName, function(err) {
					if (err){
						res.json(err);
					}
					else {
						//console.log("../assets/Media/video/Recorded_" + incNum + '.' + ext);
						console.log('renamed complete');
						if (fileType == 'Video') {
							video__anyToMP4OrWebm(fileName);
						}else{
							Audio__anyToMP3(fileName);
						}
						saveMedia__toDB(req,res,incNum, fileName,fileType);
						//res.json({'filename':"../assets/Media/video/Recorded_" + incNum + '.' + ext});
					}
				});
			}
		})
    });
}
/********************************************END******************************************************/	 



/*________________________________________________________________________
	* @Date:      	18 Mar 2015
	* @Method :   	saveMedia__toDB
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-- 
	* @Purpose:   	This function is used for to add a document of video in media collection.
	* @Param:     	5
	* @Return:    	-
	_________________________________________________________________________
*/
function saveMedia__toDB(req,res,incNum, fileName,fileType){
	if (req.session.user.FSGsArr2) {
	}
	else{
		req.session.user.FSGsArr2={};
	}
	if (incNum) {
		var	thumbName = fileName.replace( '.'+fileName.split('.').pop() , '.png');
		var locator = fileName.replace( '.'+fileName.split('.').pop() , '');
		//'Recorded_'+incNum+'.png'
		
		var cType = 'video/webm';
		if ( fileType == 'Audio' ) {
			cType = 'audio/mp3';
			thumbName = '';
		}
		
		dataToUpload={
			Location:[],
			AutoId:incNum,
			UploadedBy:"user",
			UploadedOn:Date.now(),
			UploaderID:req.session.user._id,
			Source:"Thinkstock",
			SourceUniqueID:null,
			Domains:null,
			GroupTags:[],
			Collection:null,
			Status:2, 
			MetaMetaTags:null,
			MetaTags:null,
			AddedWhere:"board", //directToPf,board,capsule
			IsDeleted:0,
			TagType:"",
			ContentType: cType,
			MediaType:fileType,
			AddedHow:'recording',
			OwnerFSGs:req.session.user.FSGsArr2,
			IsPrivate:1,
			Locator: locator,
			thumbnail: thumbName
		}
	  
		dataToUpload.Location.push({
			Size:1289,
			URL:fileName
		})


		media(dataToUpload).save(function(err,model){
			if(err){
				response.json(err);
			}
			else{
				dataToUpload._id=model._id;
				if (fileType == 'Video') {
					video__getNsaveThumbnail(fileName , dataToUpload._id);	
				}
				
				console.log("==================================" + dataToUpload._id);
				res.json(dataToUpload);
			}
		});
	}
}
/********************************************END******************************************************/	 



/*________________________________________________________________________
	* @Date:      	19 March 2015
	* @Method :   	video__any_to_MP4OrWebm
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	Convert any recorded video to webm or mp4.
	* @Param:     	1
	* @Return:    	No
_________________________________________________________________________
*/
function video__anyToMP4OrWebm(inputFile){
	if(inputFile){
		var outputFile = '';
		var extension = '';
		extension = inputFile.split('.').pop();
		extensionUpper = extension.toUpperCase();
		
		switch( extensionUpper ){
			case 'WEBM':
				outputFile = inputFile.replace('.'+extension,'.mp4');
				__convertVideo( inputFile , outputFile );
				break;
				
			case 'MP4':
				outputFile = inputFile.replace('.'+extension,'.webm');
				__convertVideo( inputFile , outputFile );
				break;
				
			case 'MOV':
				outputFile = inputFile.replace('.'+extension,'.mp4');
				__convertVideo( inputFile , outputFile );
				
				outputFile = inputFile.replace('.'+extension,'.webm');
				__convertVideo( inputFile , outputFile );
				break;
			
			default:
				console.log("------Unknown extension found = ",extension);
				if( extension != '' && extension != null  ){
					outputFile = inputFile.replace('.'+extension,'.mp4');
					__convertVideo( inputFile , outputFile );
					
					outputFile = inputFile.replace('.'+extension,'.webm');
					__convertVideo( inputFile , outputFile );
				}
				break;
		}
	}
	return;		
}


function __convertVideo( inputFile , outputFile ){
	var util = require('util'),
	exec = require('child_process').exec;
	
	var command = "ffmpeg -fflags +genpts -i " + process.urls.__VIDEO_UPLOAD_DIR+'/'+inputFile + " -r 24 "+process.urls.__VIDEO_UPLOAD_DIR+'/'+ outputFile;
	
	exec(command, function (error, stdout, stderr) {
		if (stdout) console.log(stdout);
		if (stderr) console.log(stderr);

		if (error) {
			console.log('exec error: ' + error);
			//response.statusCode = 404;
			//response.end();

		} else {
			console.log("==========Successfully converted from "+inputFile+" to "+outputFile);
		}
	});
}
/********************************************END******************************************************/	 





/*________________________________________________________________________
	* @Date:      	2 Mar 2015
	* @Method :   	checkNSaveGT
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function checks if a gt with same name exists or not then save accordingly.
	* @Param:     	1
	* @Return:    	Yes
_________________________________________________________________________
*/ 
function video__getNsaveThumbnail(inputFile , MediaId){
	var util = require('util'),
    exec = require('child_process').exec;

    //var command = "ffmpeg -i " + audioFile + " -i " + videoFile + " -map 0:0 -map 1:0 " + mergedFile;
	//var command = "ffmpeg -i " + inputFile + " -vframes 1 "+output.png;
	
	var outputThumbnail = Date.now();
	var outputThumbnailArr = [];
	
	outputThumbnailArr = inputFile.split('.');
	if(outputThumbnailArr.length)
		outputThumbnail = outputThumbnailArr[0];
	
	outputThumbnail = outputThumbnail+'.png';
	
	var command = "ffmpeg -i " + process.urls.__VIDEO_UPLOAD_DIR +'/'+inputFile + " -vframes 1 " + process.urls.__VIDEO_UPLOAD_DIR +'/'+outputThumbnail;
    exec(command, function (error, stdout, stderr) {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);
		
        if (error) {
            try{
				console.log('exec error: ' + error);
            	response.statusCode = 404;
				response.end();
			}
			catch(e){
			
			}
			
		} 
		else {
			//success case
			saveRequiredThumbnail__video(outputThumbnail);
			
			//update media thumbnail
			media.update({"_id":MediaId},{$set:{"thumbnail":outputThumbnail}},{},function(err,numAffected){
				if( err ){
					console.log("err = ",err);
				}
				else{
					console.log("numAffected = ",numAffected);
				}
			});
		}
	});
}
/********************************************END******************************************************/

var saveRequiredThumbnail__video = function( file_name ){
	//add thumbnail code
	var imgUrl = file_name;
	var mediaCenterPath = "/../../public/assets/Media/video/";
	var srcPath = __dirname + mediaCenterPath + imgUrl;
	
	if (fs.existsSync(srcPath)) {
		var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+imgUrl;
		var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+imgUrl;
		var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
		var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
		var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
		crop_image(srcPath,dstPathCrop_SMALL,100,100);
		crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
		crop_image(srcPath,dstPathCrop_SG,300,300);
		crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
		resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
	}
	
}



function Audio__anyToMP3(inputFile){
	if(inputFile){
		var outputFile = '';
		var extension = '';
		extension = inputFile.split('.').pop();
		extensionUpper = extension.toUpperCase();
		
		switch( extensionUpper ){
			case 'OGG':
				outputFile = inputFile.replace('.'+extension,'.mp3');
				__convertAudio( inputFile , outputFile );
				break;
				
			case 'WAV':
				outputFile = inputFile.replace('.'+extension,'.mp3');
				__convertAudio( inputFile , outputFile );
				break;
				
			case 'MP3':
				//no need to convert
				break;
				
			default:
				console.log("------Unknown extension found = ",extension);
				if( extension != '' && extension != null  ){
					outputFile = inputFile.replace('.'+extension,'.mp3');
					__convertAudio( inputFile , outputFile );
				}
				break;
		}
	}
	return;		
}


function __convertAudio( inputFile , outputFile ){
	var util = require('util'),
	exec = require('child_process').exec;
	
	var command = "ffmpeg -fflags +genpts -i " + process.urls.__VIDEO_UPLOAD_DIR+'/'+inputFile + " -r 24 "+process.urls.__VIDEO_UPLOAD_DIR+'/'+ outputFile;
	
	exec(command, function (error, stdout, stderr) {
		if (stdout) console.log(stdout);
		if (stderr) console.log(stderr);

		if (error) {
			console.log('exec error: ' + error);
			//response.statusCode = 404;
			//response.end();

		} else {
			console.log("==========Successfully converted from "+inputFile+" to "+outputFile);
		}
	});
}



/*________________________________________________________________________
	* @Date:      	03 April 2015
	* @Method :   	viewMediaAdmin
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function gets media details is used in setMediaIdd_uploadCase function in dragDropCtrl.js .
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/ 
/// parul 03-04-2015
var viewMediaAdmin = function(req,res){
	console.log('in view media admin');
	console.log(req.body);
	media.find({_id:req.body.ID},function(err,data){
		if (!err) {
			res.json({"code":"200","message":"success","result":data})
		}else{
			console.log(err);return;
		}
	}).populate('MetaMetaTags SourceUniqueID Domains Collection GroupTags.GroupTagID')
};
exports.viewMediaAdmin=viewMediaAdmin;
/********************************************END******************************************************/	 


/*________________________________________________________________________
	* @Date:      	08 April 2015
	* @Method :   	getBoardMedia
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function gets media details is used in AddBoardsMediasToBoard_v_2 function in uploadMediaCtrl.js .
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/ 
/// parul 08-04-2015
var getBoardMedia = function(req,res){
	console.log('in view media admin');
	console.log(req.body);
	board.find({'Medias._id':req.body.ID},{'Medias.$':1},function(err,data){
		if (!err) {
			media.find({_id:data[0].Medias[0].MediaID},function(er,dt){
				if (!er) {
					res.json({"code":"200","message":"success","result":dt})
				}else{
					res.json(err);
				}
			})
			
		}else{
			console.log(err);return;
		}
	});edi
};
exports.getBoardMedia=getBoardMedia;
/********************************************END******************************************************/




/*________________________________________________________________________
	* @Date:      	08 April 2015
	* @Method :   	findAll_subAdmin
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function gets media for sub admin mass media uploader. a modification of find all function .
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/ 
/// parul 08-04-2015
var findAll_subAdmin = function(req, res){
    var fields={};
	fields.UploaderID=req.session.subAdmin._id;
    if(typeof(req.body.title)!='undefined'){
		if (req.body.title!="") {
			fields['Title']=new RegExp(req.body.title, 'i');	    
		}
		fields['Status']=1;	
	}
	else{	
		fields['Status']=0;
	}
	
	if(req.body.gt!=null && req.body.gt!=""){
		fields['GroupTags.GroupTagID']=req.body.gt
	}
	//added by parul
	if(req.body.collection!=null && req.body.collection!=""){
		fields['Collection.CollectionID']=req.body.collection
	}
	console.log('================================================================================');
    console.log(fields);
    media.find(fields).sort({UploadedOn: 'desc'}).skip(req.body.offset).limit(req.body.limit).exec(function(err,result){
		
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				res.json({"code":"404","msg":"Not Found",responselength:0})
			}
			else{				
				media.find({Status:0,UploaderID:req.session.subAdmin._id}).sort({UploadedOn: 'desc'}).exec(function(err,resultlength){								
					if(err){ 		
						res.json(err);
					}
					else{					
						console.log("yes confirmed return.....");
						res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength.length});
						
					}
				})
			}
		}
	})
    
};

exports.findAll_subAdmin = findAll_subAdmin;
/********************************************END******************************************************/



/*________________________________________________________________________
	* @Date:      	14 April 2015
	* @Method :   	makePublic
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function update certain media's isPrivate attribute to 1 .
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/ 

/// parul 14-04-2015

var makePublic = function(req,res){
	media.update({_id:req.body.ID},{$set:{IsPrivate:0}},function(err,data){
		if (!err) {
			res.json({"code":"200","msg":"Success"});
		}else{
			res.json(err);
		}
	});
}
exports.makePublic = makePublic;
/************************edi********************END******************************************************/	 

var add__Descriptors = function(tags , mediaId){
	//var tags = req.body.media[i]['prompt'];
	tags = tags.split(',');
	dup_tags = [];
	console.log(tags);
	//console.log()
	for(var a = 0; a < tags.length;a++){
		var flag = 0;
		if(dup_tags.indexOf(tags[a]) == -1){
			dup_tags.push(tags[a]);
		}
	}
	tags = dup_tags;
	for(j in tags){
		if (tags[j] != '' && tags[j] != ' ') {
			//console.log('==========================================================================');
			//console.log(tags[j]);
			//console.log('==========================================================================');
			checkNSaveGT(tags[j] , mediaId)
		}
	}
}


//for testing faulty images
var get_faulty_images = function (req,res){
	var faultyImages = {};
	faultyImages.records = [];

	var ifCounter = 0;
	var else1Counter = 0;
	var else2Counter = 0;
	var else3Counter = 0;

	var opLimit = 0;
	
	var startpoint = 0;
	var endpoint = 0;
	if( req.query.start ){
		startpoint = req.query.start;
	}
	if( req.query.end ){
		endpoint = req.query.end;
	}
	
	media.find({MediaType:"Image"},{_id:1,Location:1,Locator:1}).sort({UploadedOn: 'desc'}).skip(startpoint).limit(endpoint).exec(function(err,data){
		if (!err) {
			opLimit = data.length;
			for( var loop = 0; loop < opLimit; loop++ ){
				var mObj = {};
				mObj = data[loop];
				identify_faulty_image( mObj );
			}
			
		}else{
			console.log(err);return;
		}
	})
	
	var im   = require('imagemagick');
	function identify_faulty_image( mObj ){
		try{
			var imgName = mObj.Location["0"]["URL"];
			var mediaCenterPath = "/../../public/assets/Media/img/600/";
			var srcPath = __dirname + mediaCenterPath + imgName;
						
			if (fs.existsSync(srcPath)) {
				im.identify(srcPath,function(err,features){
					if (err) {
						console.log(err);
						else1Counter++;
						keepTrack( 0 );
						
					}else{
						console.log(features.width+"======================"+features.height);
						if (features.height < 600 || features.width < 600) {
							ifCounter++;
							keepTrack( mObj );
						}
						else{
							else2Counter++;
							keepTrack( 0 );
						}
					}
				})
			}
			else{
				else3Counter++;
				keepTrack( 0 );
				console.log("srcPath ====> ",srcPath);
			}
		}
		catch(e){
			console.log("=========================ERROR : ",e);
		}
	}
	
	function keepTrack( mObj ){
		if( mObj != 0 ){
			faultyImages.records.push(mObj);
		}
		
		if( opLimit == ( ifCounter + else1Counter + else2Counter + else3Counter ) ){
			res.json({"code":"200","message":"success : "+opLimit+" ==  ( "+ifCounter+" + "+else1Counter+" + "+else2Counter+" + "+else3Counter+" )","result":faultyImages})
		}
	}
}
exports.get_faulty_images = get_faulty_images;
/********************************************END******************************************************/	 



/*________________________________________________________________________
	* @Date:      	20 April 2015
	* @Method :   	froala_file
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used by froala text editor to upload files .
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/ 

/// parul 20-04-2015
var froala_file = function (req,res){
	var form = new formidable.IncomingForm();
	console.log('--------------------------------------------------------------------------------------------------------------');
	form.parse(req, function(err, fields, files) {
		console.log("Fields",files.file);
		if(files.file.name){	  
			uploadDir = __dirname + "/../../public/assets/Media/img";
			file_name = files.file.name;
			file_name = file_name.split('.');
			ext = file_name[file_name.length-1];
			RecordLocator = file_name[0];
			var name = '';
			name = dateFormat()+'_'+Math.floor((Math.random() * 3333333) + 1);
			file_name=name+'.'+ext;
			//saving file
			fs.renameSync(files.file.path, uploadDir + "/" + file_name)
			if(files.file.type=="application/pdf" || files.file.type=="application/msword" || files.file.type=="application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||  files.file.type=="application/vnd.ms-excel" || files.file.type=="application/vnd.oasis.opendocument.spreadsheet" ||  files.file.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || files.file.type=="application/vnd.ms-powerpoint" || files.file.type=='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
				//media_type='Document';
			}
			else if(files.file.type=='video/mp4' || files.file.type=='video/ogg'){
				//media_type='Video';			    
			}
			else if(files.file.type=='audio/mpeg' || files.file.type=='audio/ogg'){
				//media_type='Audio';			    
			}
			else{
				//media_type='Image';
				//add thumbnail code
				var imgUrl = file_name;
				var mediaCenterPath = "/../../public/assets/Media/img/";
				var srcPath = __dirname + mediaCenterPath + imgUrl;
				if (fs.existsSync(srcPath)) {
					var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+ imgUrl;
					var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+ imgUrl;
					var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
					var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
					var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
					crop_image(srcPath,dstPathCrop_SMALL,100,100);
					crop_image(srcPath,dstPathCrop_SG,300,300);
					crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
					crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
					resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
				}
			}
			console.log('-------------------------------------------------------------------------------');
			// for future ref see 	uploadmedia function in boardController
			setTimeout(function(){
				res.json({link: '/assets/Media/img/'+process.urls.medium__thumbnail+"/"+imgUrl});
			},3000)
			
		}else{
			res.json({ error: 'File not found.' })
		}
	})
	//console.log(req);
	console.log('--------------------------------------------------------------------------------------------------------------');
}
exports.froala_file = froala_file;
/********************************************END******************************************************/





/*________________________________________________________________________
	* @Date:      	21 April 2015
	* @Method :   	note_screenshot
	* Created By: 	smartData Enterprises Ltd
	* Modified On:	-
	* @Purpose:   	This function is used to save note screenshots.
	* @Param:     	2
	* @Return:    	Yes
_________________________________________________________________________
*/ 
/// parul 21-04-2015
var note_screenshot = function(req,res){
	var fields = req.body;
	var name = '';
	name = dateFormat()+'_'+Math.floor((Math.random() * 3333333) + 1);
	
	var imagename = __dirname+"/../../public/assets/Media/img/"+name+".png"; //updated by manishp on 23122014 at 10 PM
	fs.writeFile(imagename, fields.image, 'base64', function(err) {
		if (err) {
			console.log("ERROOORR");
			console.log(err);
			console.log("imagename = ",imagename);
			res.json(err);
		}else{
			//add thumbnail code
			var imgUrl = name+".png";
			var mediaCenterPath = "/../../public/assets/Media/img/";
			var srcPath = __dirname + mediaCenterPath + imgUrl;
			
			if (fs.existsSync(srcPath)) {
				var dstPathCrop_SMALL = __dirname + mediaCenterPath + process.urls.small__thumbnail+"/"+ imgUrl;
				var dstPathCrop_SG = __dirname + mediaCenterPath + process.urls.SG__thumbnail+"/"+imgUrl;
				var dstPathCrop_MEDIUM = __dirname+ mediaCenterPath + process.urls.medium__thumbnail+"/"+imgUrl;
				var dstPathCrop_LARGE = __dirname+ mediaCenterPath + process.urls.large__thumbnail+"/"+imgUrl;
				var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl; 
				
				crop_image__Note(srcPath,dstPathCrop_SMALL,100,100);
				crop_image__Note(srcPath,dstPathCrop_SG,300,300);
				crop_image__Note(srcPath,dstPathCrop_MEDIUM,600,600);
				crop_image__Note(srcPath,dstPathCrop_LARGE,1200,1200);
				resize_image__Note(srcPath,dstPathCrop_ORIGNAL,2300,1440);
			}
			setTimeout(function(){
				res.json({"code":"200","message":"success" , "link" :'/assets/Media/img/'+process.urls.medium__thumbnail+"/"+imgUrl})
			},1000)
		}
	});
		
}
exports.note_screenshot = note_screenshot;


// For Filterd data added by arun
var filteredData = function(req, res){    
	
	fields={};
	
	fields['IsDeleted']= 0;
	if(req.body.domain!=null && req.body.domain!=""){
	    fields['Domains']=req.body.domain
	}
	
	//added by parul 09022015
	if(req.body.Media!=null && req.body.domain!=""){
		if (req.body.locator == 'record') {
			fields['Locator']={$regex:req.body.Media};
		}else{
			fields['AutoId']=req.body.Media;
		}
	    
	}
	//added by parul 09012015
	//if(req.body.status!=null && req.body.status!=""){
	//	if(req.body.status==0){
	//		fields['Status']={'$ne':2};
	//	}else{
	//		fields['Status']=req.body.status;	
	//	}	
	//	
	//}
	//fields['IsPrivate']={$exists:false,$ne:1};
	fields['$or'] = [{IsPrivate:{'$exists':false}},{IsPrivate:{$exists:true,$ne:1}}];
	
	if(req.body.status!=null && req.body.status!=""){
	    fields['Status']=req.body.status
	}else{
		fields['Status']={'$nin':[2,3]};
	}
	//end of 09012015
	if(req.body.source!=null && req.body.source!=""){
		fields['SourceUniqueID']=req.body.source
	}
	
	//if(req.body.collection!=null && req.body.collection!=""){
	//	fields['Collection']=req.body.collection
	//}commented by parul
	if(req.body.gt!=null && req.body.gt!=""){
		//fields.GroupTags=[];
		fields['GroupTags.GroupTagID']=req.body.gt
	}
	//added by parul 26 dec 2014
	if(req.body.collection!=null && req.body.collection!=""){
		//fields.GroupTags=[];
		fields['Collection']={$in:[req.body.collection]};
	}
	if(req.body.mmt!=null && req.body.mmt!=""){		
		fields['MetaMetaTags']=req.body.mmt
	}
	if(req.body.mt!=null && req.body.mt!=""){		
	    fields['MetaTags']=req.body.mt
	}
	if (req.body.whereAdded) {
	    fields['AddedWhere']=req.body.whereAdded
	}
	if (req.body.tagtype) {
	    fields['TagType']=req.body.tagtype
	}
	if (req.body.howAdded) {
	    fields['AddedHow']=req.body.howAdded
	}
	if (req.body.mediaType) {
	    
		if( req.body.mediaType == 'Image' ){
			fields['$or'] = [{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}];
		}
		else if( req.body.mediaType == 'Link' ){
			fields['MediaType'] = req.body.mediaType;
			fields['LinkType'] = {$ne:'image'};
		}
		else{
			fields['MediaType'] = req.body.mediaType;
		}
		
	}
	if (req.body.dtEnd!=null && req.body.dtStart!=null) {
	    var end = req.body.dtEnd;
	    var start = req.body.dtStart;
	    var end_dt=end.split('/');
	    var start_dt=start.split('/');
	    start_dt[0]=start_dt[0]-1;
	    end_dt[0]=end_dt[0]-1;
	    
	    console.log(start_dt);
	    console.log(end_dt);
	    
	    var start_date=new Date(start_dt[2],start_dt[0],start_dt[1],0,0,0);
	    var end_date=new Date(end_dt[2],end_dt[0],end_dt[1],23,59,59);
	    
	    fields['UploadedOn']={$lte:end_date,$gte:start_date}
	}
	
	//fields['Status']={'$ne':2}; //commented and moved to else condition of status by parul 09012015 
	/*if(req.body.gt!=null && req.body.gt!=""){
		fields.GroupTags=[];
		fields.GroupTags.GroupTagID=req.body.gt
	}*/
	
	console.log(fields);//return;
	
	//fields = {};
	if(req.body.keywordsSearch!=null && req.body.keywordsSearch!="" || req.body.addAnotherTag!=null && req.body.addAnotherTag!="" || req.body.excludeWord!=null && req.body.excludeWord!=""){
		console.log(req.body.keywordsSearch);
		console.log(req.body.addAnotherTag);
		console.log(req.body.excludeWord);
		if(req.body.gt!=null && req.body.gt!=""){
			//fields.GroupTags=[];
			req.body.keywordsSearch.push(req.body.gt);
			delete fields['GroupTags.GroupTagID'];
			
			if(req.body.addAnotherTag)
				req.body.keywordsSearch.concat(req.body.addAnotherTag);
		}
		
		fields["GroupTags.GroupTagID"] = {$in:req.body.keywordsSearch , $nin:req.body.excludeWord};
	}
	
	//added by manishp on 12022016 - for avoiding the listing of contentPage medias
	fields['AddedWhere'] = {$ne:"contentPage"};
	
	
	console.log("Fields---------",fields);//return;
	media.find(fields).sort({UploadedOn: 'desc'}).skip(req.body.offset).limit(req.body.limit).exec(function(err,result){
		if(err){ 		
			res.json(err);
		} else{
			media.find(fields,{_id : 1}).count().exec(function(err,resultlength){		
				if(err){ 		
					res.json(err);
				}
				else{
					if( resultlength > 0 ){
						//res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength.length});
						res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength});
					}
					else{
						res.json({"code":"404","msg":"Not Found",responselength:0})
					}
				}
			})
		}
	})	
	
};
exports.filteredData = filteredData;


// To push new tag to Existing Media by Arun Sahani

var addedTag = function(req,res){
	console.log("Info to add",req.body.addedTag);
	var fields = {
		GroupTagID:req.body.addedTag.gt,
		MetaMetaTagID: req.body.addedTag.mmt,
		MetaTagID: req.body.addedTag.mt
	};
	media.find({"_id": req.body.mediaId}).exec(function(err, result){
		if(err){
		
		}else{
			var flag = false;
			for(var j=0; j< result[0].GroupTags.length; j++){
				if (result[0].GroupTags[j].GroupTagID == req.body.addedTag.gt) {
					flag = true;
					console.log("---------Exists-----------");
				}
			}
			if (flag == true) {
				res.json({"code":"200","msg":"exists"});	
			}else{
				media.update({"_id" : req.body.mediaId},{$push : {GroupTags: fields}}).exec(function(err, data){
				if(err){
				} else{
					console.log("---------Pushed Successfully-----------")
					res.json({"code":"200","msg":"Success","response":data});
				}
			});		
			}
		
				
		}
	});
	
	
};
exports.addedTag = addedTag;

	
// To delete Descriptor to Existing Media by Arun Sahani

var deleteDescriptor = function(req,res){
	
	console.log("Info id of media",req.body.mediaId);
	console.log("Info id to Remove",req.body.descriptorId);
	console.log("Info Title to Remove",req.body.descriptorTitle);
	var prompt= req.body.descriptorTitle;
	media.findOne({ _id: req.body.mediaId }).exec(function(err, data){
		if (err) {
			res.json(err);
		} else{
			var promptArr1 = data.Prompt.split(',');
			var txt = (req.body.descriptorTitle).toLowerCase();
			var index = promptArr1.indexOf(txt);
			if (index > -1) {
				promptArr1.splice(index, 1);
			}
			
			var promptArr = promptArr1.join();
			console.log("Result", promptArr);
			media.update({ _id: req.body.mediaId}, {$pull: {GroupTags: {GroupTagID: req.body.descriptorId} }}).exec(function(err, data1){
				if(err){
					res.json(err);
				} else{
					media.update({ _id: req.body.mediaId}, { $set: { Prompt: promptArr} }).exec(function(err,desc){
						if (err) {
							res.json(err);
						} else{
							res.json({"code":"200","msg":"Success"});
						}
					})
					
				}
			});
			
		}
	});
	
	
};
exports.deleteDescriptor = deleteDescriptor;

// For Edit Media
var editMedia = function(req,res){
	console.log("Edit info",req.body.media);
	media.update({_id: req.body.media._id},{ $set: req.body.media}).exec(function(err, data){
		if(err){
			res.json(err);
		} else{
			res.json({"code":"200","msg":"Success","response":data});
		}
	});
};
exports.editMedia = editMedia;

// to find all selected media - added by arun on 05042016
var findSelectedMedia = function(req , res){
	console.log("-------------------------------------");
	console.log("req.body",req.body.selectedMedia);
	req.body.selectedMedia = req.body.selectedMedia ? req.body.selectedMedia : [];
	
	media.find({ _id: { $in: req.body.selectedMedia}}).exec(function (err,results) {
		if (err) {
			res.json({"status":"error","message":err});
			
		}
		else{
			res.json({"status":"success","results":results});
			
		}
	});	
};

exports.findSelectedMedia = findSelectedMedia;

// to find by page- added by arun on 26052016
var searchByPage = function(req , res){
	console.log("-------------------------------------");
	console.log("Skip",req.body.skip);
	console.log("Limit",req.body.limit);
	
	console.log("userFSGs: ",req.body.userFSGs);
	
	var conditions ={};
	var keywordsSelected = [],
	    excludeTag = [];
	
	conditions.IsDeleted = 0;
	
	if (req.body.userFSGs.Gender) {
		conditions["OwnerFSGs.Gender"]=req.body.userFSGs.Gender;
	}
	if (req.body.userFSGs.Relation) {
		conditions["OwnerFSGs.Relation"]=req.body.userFSGs.Relation;
	}
	if (req.body.userFSGs.Level) {
		conditions["OwnerFSGs.Level"]=req.body.userFSGs.Level;
	}
	if (req.body.userFSGs.Industry) {
		conditions["OwnerFSGs.Industry"]=req.body.userFSGs.Industry;
	}

	if (req.body.userFSGs['Size of Co']) {
		conditions["OwnerFSGs.Size of Co"] = req.body.userFSGs['Size of Co'];
	}
	if (req.body.userFSGs['Country of Affiliation']) {
		conditions["OwnerFSGs.Country of Affiliation"]=req.body.userFSGs['Country of Affiliation'];
	}

	var skipVal = req.body.skip ? req.body.skip : 0;
	var limitTo = req.body.limit ? req.body.limit : 100;
	console.log("Skip var: ",skipVal);
	console.log("Limit var: ",limitTo);
	if(req.body.keywordsSelcted!=null && req.body.keywordsSelcted!="" || req.body.addAnotherTag!=null && req.body.addAnotherTag!="" || req.body.excludeTag!=null && req.body.excludeTag!=""){
		for (var i=0;i<req.body.keywordsSelcted.length;i++) {
			keywordsSelected.push(req.body.keywordsSelcted[i].id);
		}
		for (var i=0;i<req.body.addAnotherTag.length;i++) {
			keywordsSelected.push(req.body.addAnotherTag[i].id);
		}
		for (var i=0;i<req.body.excludeTag.length;i++) {
			excludeTag.push(req.body.excludeTag[i].id);
		}
		console.log("keywordsSelcted:",keywordsSelected);
		console.log("excludeTag:",excludeTag);
		
		console.log("Updated keywordsSelected",keywordsSelected);
		conditions["GroupTags.GroupTagID"] = {$in:keywordsSelected , $nin:excludeTag};
	}
	//console.log("$$$$$$$$$$$$$",conditions);
	
	media.find(conditions).skip(skipVal).limit(limitTo).exec(function (err,results) {
		if (err) {
			res.json({"status":"error","message":err});
		}
		else{
			console.log("conditions :-----",conditions)
			
			media.find(conditions).count().exec(function (err,mediaCount) {
				if (err) {
					res.json({"status":"error","message":err});
				}else{
				
					res.json({"status":"success","results":results,"count": mediaCount});	
				}
			});
		}
	});	
};

exports.searchByPage = searchByPage;

//for temporary use - creating small version of aspectfit for search gallery so loading will be smoth. 
var createResizedVersion = function(req,res){
	var skipValue = parseInt(req.query.skip)?parseInt(req.query.skip):0;
	var limitValue = parseInt(req.query.limit)?parseInt(req.query.limit):1000;
	
	console.log("skipValue = "+skipValue+"------------------limitValue = "+limitValue);
	
	var conditions = {
		IsDeleted :0
		
	}
	var fields = {
		Posts : false,
		Stamps : false,
		Marks : false,
		GroupTags : false
	}
	
	media.find(conditions , fields).exec(function(err , result){
		if(!err){
			var resultCount = result.length;
			console.log('Total----------------------------------------------------',resultCount);
			if (resultCount) {
				//code
				for(var loop = 0; loop < resultCount ; loop++ ){
					//console.log(loop,'---------------------------',result[loop]);return
					doItNow(result[loop]);
					
					//if (loop == resultCount-1) {
						//code
						//res.json({code : 200 , message : "All Done! Total "+resultCount+"media have been resized."});
					//}
				}
				
				function doItNow(mediaRecord){
					
					var imgUrl = mediaRecord.Location[0].URL ? mediaRecord.Location[0].URL : (mediaRecord.Thumbnail ? mediaRecord.Thumbnail : (mediaRecord.thumbnail?mediaRecord.thumbnail:false));
					//console.log('---------------------------',imgUrl);
					if (imgUrl) {
						//code
						var mediaCenterPath = "public/assets/Media/img/";
						var newpath = '/home/arunsahani/Arun/Official/projects/26052016/beta-content-page-v1.0-start/';
						var srcPath = newpath+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
						
						var dstPathCrop_ORIGNAL = newpath+ mediaCenterPath +process.urls.aspectfitSmall__thumbnail+"/"+imgUrl;
						
						//console.log('---------------------------',dstPathCrop_ORIGNAL);return
						if (fs.existsSync(srcPath)) {
							
							if(resize_image(srcPath,dstPathCrop_ORIGNAL,575,360)){
								//console.log('---------------------------bauji ho gya');
							}else{
								//console.log('---------------------------bauji galt bat');
								
							}// 575,360
							//console.log('-------------------------------------------------------Done IT');return
							//console.log("-------------------------Success with imgUrl........::::::::::::");
						}
						else{
							
							console.log("srcPath = "+srcPath+"---------dstPath = "+dstPathCrop_ORIGNAL);
						}
					}
					else{
						console.log("-------------------------Something went wrong with imgUrl........::::::::::::");
						
					}
					
					
				}
			
			}
			else{
				res.json({code : 200 , message : "All Done!"});
				
			}
			
		}		
	})
	
}
exports.createResizedVersion = createResizedVersion;
