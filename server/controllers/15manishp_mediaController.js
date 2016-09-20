var media = require('./../models/mediaModel.js');
var board = require('./../models/boardModel.js');
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
				media.find({Status:0}).sort({UploadedOn: 'desc'}).exec(function(err,resultlength){								
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

exports.findAll = findAll;



//end
var findAllStatus = function(req, res){    
	
	
	fields={};
	
	//fields['IsDeleted']= 0;
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
		fields['Status']={'$ne':2};
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
			if(result.length==0){
				res.json({"code":"404","msg":"Not Found",responselength:0})
			}
			else{				
				media.find(fields).sort({UploadedOn: 'desc'}).exec(function(err,resultlength){		
					if(err){ 		
						res.json(err);
					}
					else{					
						res.json({"code":"200","msg":"Success","response":result,"responselength":resultlength.length});
					}
				})
			}
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
	for(i in req.body.media){
		var query={_id:req.body.media[i]['id']};
		var options={};
		fields.Title=req.body.media[i]['title'];
		fields.Prompt=req.body.media[i]['prompt'];
		fields.Photographer=req.body.media[i]['Photographer'];
		media.update(query, { $set: fields}, options, callback)
	}
	var counter=0;
	function callback (err, numAffected) {
		counter++;
		if(counter==req.body.media.length){
			//addTag(req,res);   //--now not in use
			addGT(req,res);
			findAllStatus(req,res)
		}
		
	}
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
    
    var fields={
	//SourceUniqueID:null,
	GroupTags:[],
	//Collection:null,
	//Domains:null,
	Status:1,
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
    
    fields.GroupTags.push({
	GroupTagID:req.body.gt
    })
   
    
    fields.Title=null;
    fields.Prompt=null;
    fields.Photographer=null;
    req.body.id=req.body.MediaID;
    var query={_id:req.body.MediaID};
    var options={};
	if (req.body.Tags) {
	
		groupTags.find({_id:req.body.gt},function(err,result){
			console.log('result');
			console.log(result);
		if (!err) {
			var resultFinal=false;
			for (x in result[0].Tags) {
				if (result[0].Tags[x].TagTitle==req.body.Tags) {
					resultFinal=true;
					var tagID=result[0].Tags[x]._id;
				}
			}
			if (!resultFinal) {
				groupTags.findOne({_id:req.body.gt},function(err,result){
					//console.log(res)
					var gt = result;
					  gt.Tags.push({
						  TagTitle:req.body.Tags,
						  status:2
					  });
					
					gt.save(function(err){
					  if(err)
					  {
						res.json(err);
					  }
					  else
					  {
						//groupTags.find({_id:req.body.gt},function(err,result){
						//	if (!err) {
						//		var resultFinal=false;
						//		for (x in result[0].Tags) {
						//			if (result[0].Tags[x].TagTitle==req.body.Tags) {
						//				resultFinal=true;
						//				var tagID=result[0].Tags[x]._id;
						//			}
						//		}
						//		//fields.Tags={TagId:tagID,TagTitle:req.body.Tags};
						//	}
						//})
					  }
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
	
	
    media.update(query, { $set: fields}, options, callback)
    
    var counter=0;
    function callback (err, numAffected) {
	addMediaToBoard(req,res);
    }
};

exports.addTagsToUploadedMedia = addTagsToUploadedMedia;
//end


var addMediaToBoard = function(req,res){
        
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
									thumbnail:thumbnail //added by manishp on 22122014- montage case 
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
									thumbnail:thumbnail //added by manishp on 22122014- montage case 
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
							thumbnail:thumbnail
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
							thumbnail:thumbnail //added by manishp on 22122014- montage case 
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
//15032015 - manishp - handling deletion of original image asynchronously - multi upload case requirement 
var mediaCompletionStatusTknWise = [];

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
			
			// handling original media deletion after all asynchronous task completion - Multi media Upload case requirement
			var token = incNum; 
			var tokenMediaFile = uploadDir + "/" + file_name;
			
			mediaCompletionStatusTknWise[token] = 0;
			
			
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
					var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit_1200__thumbnail+"/"+imgUrl;
					
					crop_image(srcPath,dstPathCrop_SMALL,100,100,token,tokenMediaFile);
					crop_image(srcPath,dstPathCrop_SG,300,300,token,tokenMediaFile);
					//crop_image(srcPath,dstPathCrop_400,400,400);
					//crop_image(srcPath,dstPathCrop_500,500,500);
					crop_image(srcPath,dstPathCrop_MEDIUM,600,600,token,tokenMediaFile);
					crop_image(srcPath,dstPathCrop_LARGE,1200,1200,token,tokenMediaFile);
					//resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
					
					resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440,token,tokenMediaFile);
				}
				
			}
			
			
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
					LinkType:LinkType,
					OwnerFSGs:req.session.user.FSGsArr2,
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

exports.deleteMedia = deleteMedia;

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
		var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit_1200__thumbnail+"/"+imgUrl;
		
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
		res.json({"code":"200","message":"success","result":result1});
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

exports.viewMedia = viewMedia

/***
 * Image crop..
 * Available gravity options are [NorthWest, North, NorthEast, West, Center, East, SouthWest, South, SouthEast]
***/
function crop_image(srcPath,dstPath,width,height,token,tokenMediaFile){
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
			mediaCompletionStatusTknWise__CALLBACK(token , tokenMediaFile);
			if (err){ 
				//throw err;
			
			}
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
 
 function resize_image(srcPath,dstPath,w,h,token,tokenMediaFile){
	console.log("source : ",srcPath+" ---- destination : "+dstPath);
	var im   = require('imagemagick');
	try{
		console.log('========================================================================== here');
		im.resize({
			srcPath: srcPath,
			dstPath: dstPath,
			//width: w,
			height: h
			//resizeStyle: 'aspectfit', // is the default, or 'aspectfit' or 'fill'
			//gravity: 'Center' // optional: position crop area when using 'aspectfill'
		}, function(err, stdout, stderr){
			mediaCompletionStatusTknWise__CALLBACK(token , tokenMediaFile);
			if (err) {
				//throw err;
			}
			console.log('success..');
		});
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
						var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit_1200__thumbnail+"/"+imgUrl; 
						
						crop_image(srcPath,dstPathCrop_SMALL,100,100);
						crop_image(srcPath,dstPathCrop_SG,300,300);
						crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
						crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
						resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1200);
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
/*
function resize_image(srcPath,dstPath,img_wh,flag){
    var strtxt = srcPath+'|'+dstPath+'|'+img_wh+'|'+flag+'| _thumb';
    console.log(strtxt);
    var im   = require('imagemagick');
    if(flag=='height'){
        im.resize({
        srcPath: srcPath,
        dstPath: dstPath,
        height:   img_wh,
        quality: 0.8,
        sharpening: 0.5,
        }, function(err, stdout, stderr){
            if (err) throw err;
            console.log('Success.');
        });    
    }else{
        im.resize({
        srcPath: srcPath,
        dstPath: dstPath,
        width:   img_wh,
        quality: 0.8,
        sharpening: 0.5,
        }, function(err, stdout, stderr){
            if (err) throw err;
            console.log('Success thumb.');
        });    
    }
}
*/
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
    var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit_1200__thumbnail+"/"+imgUrl; 
    
    crop_image(srcPath,dstPathCrop_SMALL,100,100);
    crop_image(srcPath,dstPathCrop_SG,300,300);
	//crop_image(srcPath,dstPathCrop_400,400,400);
    //crop_image(srcPath,dstPathCrop_500,500,500);
	crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
    crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
    resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1200);
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
						var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit_1200__thumbnail+"/"+imgUrl; 
						crop_image(srcPath,dstPathCrop_SMALL,100,100);
						crop_image(srcPath,dstPathCrop_SG,300,300);
						//crop_image(srcPath,dstPathCrop_400,400,400);
						//crop_image(srcPath,dstPathCrop_500,500,500);
						crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
						crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
						resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1200);
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
 var addGT = function(req,res){
  
	var tags = req.body.media[i]['prompt'];
	tags = tags.split(',');
	console.log(tags);
	for(j in tags){
		if (tags[j] != '' && tags[j] != ' ') {
			//console.log('==========================================================================');
			//console.log(tags[j]);
			//console.log('==========================================================================');
			checkNSaveGT(tags[j])
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
	* @Param:     	1
	* @Return:    	Yes
_________________________________________________________________________
*/
 function checkNSaveGT(title){
	groupTags.find({"GroupTagTitle":title,"status":3},function(err,data){
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
				fields.Tags = []; 
				fields.Think = [];
				fields.Less = [];
				fields.More = [];
				//console.log(fields);
				groupTags(fields).save();
			}
		}
	})
}

function mediaCompletionStatusTknWise__CALLBACK(token , tokenMediaFile){
	console.log("-------mediaCompletionStatusTknWise__CALLBACK called........" + tokenMediaFile);
	//if( mediaCompletionStatusTknWise[token] ){
	//if ( mediaCompletionStatusTknWise.indexOf(token) > -1 ) {
	if(typeof mediaCompletionStatusTknWise[token] !== 'undefined') {
		console.log("-------in if case...");
	
		mediaCompletionStatusTknWise[token] = mediaCompletionStatusTknWise[token] + 1;
		if( mediaCompletionStatusTknWise[token] == 5 ){
			console.log("=====================Equal to 5....");
		
			//all task have been finished, now delete the original media and remove the variable
			fs.exists(tokenMediaFile, function (exists) {
				if(exists){
					fs.unlink(tokenMediaFile);
					console.log("----original file found & deleted after all task... = " + tokenMediaFile);
					
					//now remove token variable
					var index = mediaCompletionStatusTknWise.indexOf(token);
					if (index > -1) {
						mediaCompletionStatusTknWise.splice(index, 1);
						console.log("---token key from array has been removed now = "+token);
					}
				}
			});
			/*
			if (fs.existsSync(tokenMediaFile)) {
				fs.unlink(tokenMediaFile);
				console.log("----original file found & deleted after all task... = " + tokenMediaFile);
				
				//now remove token variable
				var index = mediaCompletionStatusTknWise.indexOf(token);
				if (index > -1) {
					mediaCompletionStatusTknWise.splice(index, 1);
					console.log("---token key from array has been removed now = "+token);
				}
			}
			*/			
		}
		else{
			console.log("-------in else ...NOt equal to 5....");
		}
		
	}
	else{
		console.log("-------in else case...");
		//mediaCompletionStatusTknWise[token] = 1;
	}

}


