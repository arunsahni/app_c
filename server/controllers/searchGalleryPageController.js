var Page = require('./../models/pageModel.js');
var groupTags = require('./../models/groupTagsModel.js');
var media = require('./../models/mediaModel.js');
var fs = require('fs');
var formidable = require('formidable');
var mediaController = require('./../controllers/mediaController.js');
//var gm = require('gm');
var im   = require('imagemagick');
var gm = require('gm').subClass({ imageMagick: true });
var counters=require('./../models/countersModel.js');

var Chapter = require('./../models/chapterModel.js');
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


/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		createGalleryPage
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to create a search gallery page under self chapter
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var SearchGalleryPage = {};

/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		getPageName
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR" + "CR" + "PE"
_________________________________________________________________________
*/

SearchGalleryPage.getPageName = function ( req , res ){
	var conditions = {
		ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		_id : req.headers.page_id ? req.headers.page_id : 0, 
		IsDeleted : 0
	};
	
	var fields = {
		Title : true
	}; 
		
	Page.findOne(conditions , fields , function( err , result ){
		if( !err ){
			var response = {
				status: 200,
				message: "Page Title",
				result : result.Title
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
	});
}

/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		updatePageName
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR (req.headers.chapter_id)"
_________________________________________________________________________
*/

SearchGalleryPage.updatePageName = function ( req , res ){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check 
	
	var conditions = {};
	var data = {};
	//console.log("req.headers = " , req.headers)
	
	conditions.ChapterId = req.headers.chapter_id;
	conditions._id = req.headers.page_id;
	data.Title = req.body.page_name ? req.body.page_name : "";
	
	console.log("conditions = ",conditions);
	//Chapter.update(query , $set:data , function( err , result ){
	Page.update(conditions , {$set:data} , function( err , result ){
		if( !err ){
			var response = {
				status: 200,
				message: "Page name updated successfully.",
				result : result				
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
	});

}

SearchGalleryPage.create = function ( req , res ){
	//check isMyChapter( req.header.chapter_id ) - Middle-ware Authorization check 
	var data = {};
	data.CreaterId = req.session.user._id;
	data.OwnerId = req.session.user._id;
	
	data.ChapterId = req.headers.chapter_id ? req.headers.chapter_id : null;
	data.PageType = req.body.page_type ? req.body.page_type : "gallery";  
	 
	Page(data).save(function( err , result ){
		if( !err ){
			var response = {
				status: 200,
				message: "Page created successfully.",
				result : result
			}
			pushPageId(data.ChapterId,result._id)
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
	});

}



/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		searchGalleryPage.updateTitle
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to update Page Title on change 
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/
SearchGalleryPage.updateTitle = function ( req , res ){

	
}

/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		searchGalleryPage.listHeaders
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to list user's Page headers
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/
SearchGalleryPage.listHeaders = function ( req , res ){
	
	
	
}

/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		searchGalleryPage.uploadHeader
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to update Page header
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/
SearchGalleryPage.uploadHeader = function ( req , res ){
	var form = new formidable.IncomingForm();
    console.log(form);
    form.keepExtensions = true;     //keep file extension
    form.uploadDir = (__dirname+"/../../public/assets/Media/headers/orignal/");       //set upload directory
    form.parse(req, function(err, fields, files) {
        console.log("form.bytesReceived");
        console.log("file path: "+JSON.stringify(files.file.path));
        console.log("file name: "+JSON.stringify(files.file.name));
        console.log("fields: "+JSON.stringify(fields));
        //Formidable changes the name of the uploaded file
        //Rename the file to its original name
        var dateTime = new Date().toISOString().replace(/T/,'').replace(/\..+/, '').split(" ");
		var temp = files.file.name.split('.');
		var ext = temp.pop();
		try{
		fs.renameSync(files.file.path, __dirname+"/../../public/assets/Media/headers/orignal/"+  fields.pageID+'_'+Date.now()+ '.' + ext);
		}catch(e){
			console.log(e)
		}finally{
			var imgUrl = fields.pageID+'_'+Date.now()+ '.' + ext;
			var mediaCenterPath = "/../../public/assets/Media/headers/";
			var srcPath = __dirname + mediaCenterPath+'orignal/' + imgUrl;
			if (fs.existsSync(srcPath)) {
				var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
				//mediaController.resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
				
				try{
					im.identify(srcPath,function(err,features){
						if (err) {
							console.log(err);
						}else{
							if (features.width < 1000 || features.height < 350) {
								res.json({'code':400,'msg':'file dimension error.',result:{dimensions : {width :features.width,height:features.height}}});
								//now unlink
								if(fs.existsSync(srcPath)){
									fs.unlink(srcPath);
							        } 
								
							}
							else{
								im.resize({
									srcPath: srcPath,
									dstPath: dstPathCrop_ORIGNAL,
									width: features.width,
									height: features.height,
								}, function(err, stdout, stderr){
									if (err) {
										res.json(err);
									}else{
										var location = '/assets/Media/headers/aspectfit/'+imgUrl;
										res.json({'code':200,'msg':'file uploaded successfully','location':location});
									}
								});	
							}
							
						}
					})
				}
				catch(e){
					console.log("=========================ERROR : ",e);
				}
			}else{
				console.log('---------------file not found--------------');
				res.json({'code':404,'msg':'file not found'});
			}
			
		}
//        fs.renameSync(files.file.path, __dirname+"/../../public/assets/Media/headers/orignal/"+  fields.pageID+'_'+Date.now()+ files.file.name, function(err) {
//            if (err){
//                throw err;
//            }
//            else {
//                var imgUrl = fields.pageID+'_'+Date.now()+ files.file.name;
//                var mediaCenterPath = "/../../public/assets/Media/headers/";
//                var srcPath = __dirname + mediaCenterPath+'orignal/' + imgUrl;
//                if (fs.existsSync(srcPath)) {
//                    var dstPathCrop_ORIGNAL = __dirname+ mediaCenterPath +process.urls.aspectfit__thumbnail+"/"+imgUrl;
//                    mediaController.resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
//                }
//                setTimeout(function(){
//                    Page.findOne({_id:fields.pageID},function(err,page1){
//                        if (err) {
//                            res.json({code:400,'msg':err});
//                        }else{
//							var location = '/assets/Media/headers/aspectfit/'+imgUrl;
//                            page1.HeaderImage = imgUrl;
//                            page1.save(function(err,data){
//                                 if (err) {
//                                    res.json({'code':400,'msg':err});
//                                }else{
//                                    res.json({'code':200,'msg':'file uploaded successfully','location':location});
//                                }
//                            })
//                        }
//                    })
//                },2000)
//            }
//            console.log('renamed complete');  
//        });
    });
}



/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		searchGalleryPage.uploadHeader
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		to update Page header
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/
SearchGalleryPage.cropHeader = function ( req , res ){
	console.log(__dirname);
	var location = __dirname+ '/../../public'+req.body.location;
	im.identify(location,function(err,features){
		if (err) {
			console.log(err);
		}else{
			console.log(features.width);
			var mediumLocation = location.replace('/aspectfit/','/medium/');
			var smallLocation = location.replace('/aspectfit/','/small/');
			var sgLocation = location.replace('/aspectfit/','/sg/');
			console.log(location);
			
			try{
				im.crop({
					srcPath: __dirname+ '/../../public'+req.body.location,
					dstPath: mediumLocation,
					width: 262,
					height: 162,
					quality: 1,
					gravity: "Center"
				}, function(err, stdout, stderr){
					if (err){
						throw err;
					}else{
						console.log('success..');
						im.crop({
							srcPath: __dirname+ '/../../public'+req.body.location,
							dstPath:smallLocation,
							width: 155,
							height: 121,
							quality: 1,
							gravity: "Center"
						}, function(err, stdout, stderr){
							if (err){
								throw err;
							}else{
								im.crop({
									srcPath: __dirname+ '/../../public'+req.body.location,
									dstPath: sgLocation,
									width: 300,
									height: 300,
									quality: 1,
									gravity: "Center"
								}, function(err, stdout, stderr){
									if (err){
										throw err;
									}else{
										
										console.log('success..');
										gm(__dirname+ '/../../public'+req.body.location).crop(features.width,parseInt(req.body.height), 0,parseInt(req.body.y))
										.write(location, function (err) {
											if (!err) {
												console.log('done');
												Page.findOne({_id:req.body.pageID},function(err,page1){
													if (err) {
														res.json({code:400,'msg':err});
													}else{
														var location = req.body.location;
														var imgUrlTemp = req.body.location.split('/');
														var imgUrl = imgUrlTemp[imgUrlTemp.length-1];
														page1.HeaderImage = imgUrl;
														page1.save(function(err,data){
															 if (err) {
																res.json({'code':400,'msg':err});
															}else{
																res.json({'code':200,'msg':'file uploaded successfully','location':req.body.location});
															}
														})
													}
												})
												//res.json({'code':200,'msg':'success','location':req.body.location})
											}
											else{
												res.json(err);
											}
										});
										console.log('after gm')
									}
								});
							}
						});
					}
				});
			}
			catch(e){
				console.log("=========================ERROR : ",e);
			}
		}
	});
	
}





/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		searchGalleryPage.update
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   		To Update Search Gallery Page Settings 
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/
SearchGalleryPage.saveSettings = function ( req , res ){
	//change status
	var inputData = {
		selectionCriteria : "",   //media/keywords
		ids : [],		//send array of ids - string format , These ids may be either of media or keywords depending upon the selection criteria.
		page_id : req.headers.page_id,
		createrId : req.session.user._id
	}
	
	inputData.selectionCriteria = req.body.selectionCriteria ? req.body.selectionCriteria:"";
	inputData.ids = req.body.ids ? req.body.ids : [];
	inputData.id_another = req.body.id_another ? req.body.id_another : [];
	inputData.id_exclude = req.body.id_exclude ? req.body.id_exclude : [];
	switch (inputData.selectionCriteria){
		case "all-media" : 
			SearchGalleryPage.defaultMedia.__setAllMedia(res , inputData);
			break;
		case "hand-picked" : 
			SearchGalleryPage.defaultMedia.__setSelectedMedia(res , inputData);
			break;
                case "theme" : 
			SearchGalleryPage.defaultMedia.__setSelectedThemes(res , inputData);
			break;
		case "descriptor" : 
			SearchGalleryPage.defaultMedia.__setSelectedDescriptors(res , inputData);
			break;
		case "filter" : 
			SearchGalleryPage.defaultMedia.__setSelectedFilters(res , inputData);
			break;
		case "upload" : 
			SearchGalleryPage.defaultMedia.__setUploadedMedia(res , inputData);
			break;	
		default : 
			console.log("wrong SelectionCriteria = ",selectionCriteria);
			return;
	}
}


/*
SearchGalleryPage.saveSettings = function ( req , res ){
	//change status
	var inputData = {
		selectionCriteria : "",   //media/keywords
		ids : []			//send array of ids - string format , These ids may be either of media or keywords depending upon the selection criteria. 
	}
	
	var selectionCriteria = req.body.selectionCriteria ? req.body.selectionCriteria:"";
	var ids = req.body.ids ? req.body.ids : [];
	switch (selectionCriteria){
		case "media" : 
			SearchGalleryPage.defaultMedia.__setSelectedMedia(ids);
			break;
		case "keyword" : 
			SearchGalleryPage.defaultMedia.__setSelectedKeywords(ids);
			break;
			
		default : 
			console.log("wrong SelectionCriteria = ",selectionCriteria);
			return;
	}
}
*/
SearchGalleryPage.defaultMedia = {};
SearchGalleryPage.defaultMedia.__setAllMedia = function ( res , inputData ){
	var conditions = {},
            fields = {};
	conditions._id = inputData.page_id;
	conditions.CreaterId = inputData.createrId;
	console.log('__setAllMedia');
	fields.SelectionCriteria = 'all-media';
	fields.SelectedMedia = [];
	fields.UploadedMedia = [];
	Page.update(conditions,{$set:fields},function( err , numAffected ){
            if( !err ){
                var response = {
                        status: 200,
                        message: "Page name updated successfully.",
                        result : numAffected				
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
	//update SelectedMedia array -  
}
SearchGalleryPage.defaultMedia.__setSelectedMedia = function ( res , inputData ){
	var conditions = {},
            fields = {};
	conditions._id = inputData.page_id;
	conditions.CreaterId = inputData.createrId;
	console.log('__setSelectedMedia');
	fields.SelectionCriteria = 'hand-picked';
	fields.SelectedMedia = inputData.ids;
	Page.update(conditions,{$set:fields},function( err , numAffected ){
            if( !err ){
                var response = {
                        status: 200,
                        message: "Page name updated successfully.",
                        result : numAffected				
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
	//update SelectedMedia array -  
}

SearchGalleryPage.defaultMedia.__setSelectedThemes = function ( res , inputData ){
	var conditions = {},
            fields = {};
	conditions._id = inputData.page_id;
	conditions.CreaterId = inputData.createrId;
	fields.SelectionCriteria = 'theme';
	fields.SelectedKeywords = inputData.ids;
	fields.AddAnotherGts = inputData.id_another;
	fields.ExcludedGts = inputData.id_exclude;
	console.log('__setSelectedThemes');
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "Page name updated successfully.",
				result : numAffected				
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
	//update SelectedKeywords array - 
}

SearchGalleryPage.defaultMedia.__setSelectedDescriptors = function ( res , inputData ){
	var conditions = {},
            fields = {};
	conditions._id = inputData.page_id;
	conditions.CreaterId = inputData.createrId;
	fields.SelectionCriteria = 'descriptor';
	fields.SelectedKeywords = inputData.ids;
	fields.AddAnotherGts = inputData.id_another;
	fields.ExcludedGts = inputData.id_exclude;
	console.log('__setSelectedDescriptors');
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
                    var response = {
                            status: 200,
                            message: "Page name updated successfully.",
                            result : numAffected				
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
	//update SelectedKeywords array - 
}

SearchGalleryPage.defaultMedia.__setSelectedFilters = function ( res , inputData ){
	var conditions = {},
            fields = {};
	conditions._id = inputData.page_id;
	conditions.CreaterId = inputData.createrId;
	fields.SelectionCriteria = 'filter';
	fields.SelectedKeywords = inputData.ids;
	console.log('__setSelectedFilters');
	Page.update(conditions,{$set:fields},function( err , numAffected ){
            if( !err ){
                var response = {
                    status: 200,
                    message: "Page name updated successfully.",
                    result : numAffected				
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
	//update SelectedKeywords array - 
}

SearchGalleryPage.defaultMedia.__setUploadedMedia = function ( res , inputData ){
	var conditions = {},
            fields = {};
	conditions._id = inputData.page_id;
	conditions.CreaterId = inputData.createrId;
	fields.SelectionCriteria = 'upload';
	fields.SelectedMedia = inputData.ids;
	console.log('__setUploadedMedia');
	Page.update(conditions,{$set:fields},function( err , numAffected ){
            if( !err ){
                var response = {
                    status: 200,
                    message: "Page name updated successfully.",
                    result : numAffected				
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
	//update SelectedKeywords array - 
}

// to save questio tip data
SearchGalleryPage.saveQuesTip = function(req, res){
	console.log("------------------------------------------");
	console.log(req.body);
	var conditions = {},
		fields = {};
	conditions._id = req.body.page_id;
	conditions.ChapterId = req.body.chapter_id;
	fields.QuestionTip = req.body.questionTip;
	
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "Question Tip saved successfully.",
				result : numAffected				
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

// to save video in folder
SearchGalleryPage.saveQuesVideo = function(req, res){
	console.log("------------------------------------------");
	
	var form = new formidable.IncomingForm();
	
	form.uploadDir = __dirname+"/../../public/assets/Media/quest-tip-video";
	
	form.keepExtensions = true;   
	form.parse(req, function (error, fields, files) 
	{
		
		var abc = 'krishan.mp4';
		fs.rename(files.file.path, "/"+ abc,function(err) {  
			console.log(files.file.path); 
			var url=files.file.path;
			console.log(url);
			var url1=url.split('/');
			console.log(url1[url1.length-1]);
			
			var fields = {};
			fields.uploadedVideo = url1[url1.length-1];
		
			var response = {
				status: 200,
				message: "Video Uploaded successfully.",
				result : fields.uploadedVideo
			}
			res.json(response);
		});
        });
	
}

// to save video information
SearchGalleryPage.saveVideoData = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	var conditions = {},
		fields = {};
	conditions._id = req.body.page_id;
	conditions.ChapterId = req.body.chapter_id;
	fields.uploadedVideo = req.body.videoPath;
	
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "Video data saved successfully.",
				result : numAffected				
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

SearchGalleryPage.saveThemeData = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	console.log("!@!@! -- ",req.body.selected_gts)
	var conditions = {},
            fields = {};
	conditions._id = req.body.page_id;
	conditions.ChapterId = req.body.chapter_id;
	fields.SelectedGts = req.body.selected_gts;
	fields.AddAnotherGts = req.body.addAnother_gts;
	fields.ExcludedGts = req.body.excluded_gts;
	
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "Theme data saved successfully.",
				result : numAffected				
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

SearchGalleryPage.getallKeywordsByThemes = function(req, res){
	
    var regex = new RegExp('\s*\s*^\s*\s*'+req.body.startsWith,'i');
    console.log(regex);
    
    var conditions = {
	status:1,
	GroupTagTitle:regex
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

SearchGalleryPage.getallKeywordsByCondition = function(req, res){
	
    var regex = new RegExp('\s*\s*^\s*\s*'+req.body.startsWith,'i');
    console.log(regex);
    var statusValue = 0;
    console.log("req.body.selectionCriteria",req.body.selectionCriteria)
    console.log("req.body.keywordType",req.body.keywordType)
    
    if (req.body.keywordType == "themes") {
	statusValue = 1;
    } else if (req.body.keywordType == "descriptors") {
	statusValue = 3;
    }
    var conditions = {
	status: statusValue,
	GroupTagTitle:regex
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


// Smooth-Media Manager - Find all group tags of a mt
SearchGalleryPage.findAllGtOfMt = function(req, res){    
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

SearchGalleryPage.viewQuesTipData = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body.pageId);
	
	var conditions = {};
	conditions._id = req.body.pageId;
	
	
	Page.find(conditions,function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "Theme data saved successfully.",
				result : numAffected				
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

SearchGalleryPage.uploadGalleryMedia = function(req,res){
	var incNum = 0;
	counters.findOneAndUpdate(
	{ _id: "userId" },{$inc:{seq:1}},{new:true},function(err,data){
	if (!err) {
		console.log('=========================')
		//console.log(data);
		//data.seq=(data.seq)+1;
		//console.log(data.seq);
		incNum = data.seq;
		//data.save(function(err){
		//if( !err ){
		//console.log("incNum="+incNum);
		var form = new formidable.IncomingForm();        	
		var RecordLocator = "";
		
		form.parse(req, function(err, fields, files) {
		  var file_name="";
		  
		  if(files.myFile.name){
			//uploadDir = __dirname + "/../../public/assets/Media/themeImages";
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
			//console.log(files.myFile.type);
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
					SearchGalleryPage.crop_image(srcPath,dstPathCrop_SMALL,100,100);
					SearchGalleryPage.crop_image(srcPath,dstPathCrop_SG,300,300);
					//crop_image(srcPath,dstPathCrop_400,400,400);
					//crop_image(srcPath,dstPathCrop_500,500,500);
					SearchGalleryPage.crop_image(srcPath,dstPathCrop_MEDIUM,600,600);
					SearchGalleryPage.crop_image(srcPath,dstPathCrop_LARGE,1200,1200);
					SearchGalleryPage.resize_image(srcPath,dstPathCrop_ORIGNAL,2300,1440);
				}
				
			}
			
			
			//console.log("incNum="+incNum);
			var successFlag = false;
			
			var __UploaderID = '';
			if(req.session.user){
				__UploaderID = req.session.user._id;
				successFlag = true;
			}
			else{
				//return;
			}
			
			if( successFlag ){
				dataToUpload={
					Location:[],
					UploadedBy:"owner",
					UploadedOn:Date.now(),
					UploaderID:__UploaderID,
					Source:null,
					SourceUniqueID:null,
					Domains:null,
					AutoId:incNum,
					GroupTags:[],
					Collection:null,
					Status:4,
					MetaMetaTags:null,
					MetaTags:null,
					AddedWhere:"directToPf", //directToPf,hardDrive,dragDrop
					IsDeleted:0,
					TagType:"",
					ContentType:files.myFile.type,
					MediaType:media_type,
					AddedHow:'hardDrive',
					Locator:RecordLocator+"_"+incNum,	//added on 23012014
					IsPrivate:1
				}
				  
				dataToUpload.Location.push({
					Size:files.myFile.size,
					URL:file_name
				})
				
				media(dataToUpload).save(function(err,data){
					if(err){
					  res.json(err);
					}
					else{
						console.log("returning data ....",data);
						Page.update({_id:fields.pageId},{ $push: { UploadedMedia: data._id,SelectedMedia: data._id.toString()} },function(err,data){
							if (err) {
								var response = {
									status: 502,
									message: "something went wrong" 
								}
								res.json(response);
							}else{
								var response = {
									status: 200,
									message: "media uploaded sucessfully",
									result : data
								}
								res.json(response);
							}
						})
					}
				});
			}
			else{
				res.json({"code":401,"msg":"User session not found."});
			}
			
		}
		});
	}
	});
}

SearchGalleryPage.crop_image = function(srcPath,dstPath,width,height){
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

 
SearchGalleryPage.resize_image = function(srcPath,dstPath,w,h){
	console.log("source : ",srcPath+" ---- destination : "+dstPath);
	var im   = require('imagemagick');
	
	try{
	im.identify(srcPath,function(err,features){
		if (err) {
			console.log(err);
		}else{
			console.log(features.width+"======================"+features.height);
			if (features.height >= 1440) {
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
			else if (features.width >= 2300) {
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
 

SearchGalleryPage.delQuesVideo = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var conditions = {},
            fields = {};
	    conditions._id = req.body.pageId;
	    fields.uploadedVideo = null;
	
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "Video deleted successfully.",
				result : numAffected				
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

SearchGalleryPage.deleteHeaderImage = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var conditions = {},
            fields = {};
	    conditions._id = req.body.pageId;
	    fields.HeaderImage = null;
	    
	var img_path = req.body.imgUrl;
	
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var mediaCenterPath = "/../../public/assets/Media/headers/";
			var img_name = img_path.split('/');
			var temp_imgUrl = img_name[img_name.length-1].split('?');
			var srcPath = __dirname + mediaCenterPath+'orignal/' + temp_imgUrl[0];
			var srcPath_aspectfit = __dirname + mediaCenterPath+'aspectfit/' + temp_imgUrl[0];
			var srcPath_sg = __dirname + mediaCenterPath+'sg/' + temp_imgUrl[0];
			var srcPath_small = __dirname + mediaCenterPath+'small/' + temp_imgUrl[0];
			var srcPath_medium = __dirname + mediaCenterPath+'medium/' + temp_imgUrl[0];
			var srcPath_cropped = __dirname + mediaCenterPath+'cropped/' + temp_imgUrl[0];
			var srcPath_100 = __dirname + mediaCenterPath+'100/' + temp_imgUrl[0];
			var srcPath_600 = __dirname + mediaCenterPath+'600/' + temp_imgUrl[0];
			
			if(fs.existsSync(srcPath)){
				fs.unlink(srcPath);
			}
			if(fs.existsSync(srcPath_aspectfit)){
				fs.unlink(srcPath_aspectfit);
			}
			if(fs.existsSync(srcPath_sg)){
				fs.unlink(srcPath_sg);
			}
			if(fs.existsSync(srcPath_small)){
				fs.unlink(srcPath_small);
			}
			if(fs.existsSync(srcPath_medium)){
				fs.unlink(srcPath_medium);
			}
			if(fs.existsSync(srcPath_cropped)){
				fs.unlink(srcPath_cropped);
			}
			if(fs.existsSync(srcPath_100)){
				fs.unlink(srcPath_100);
			}
			if(fs.existsSync(srcPath_600)){
				fs.unlink(srcPath_600);
			} 
			var response = {
				status: 200,
				message: "Header image deleted successfully.",
				result : numAffected				
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

SearchGalleryPage.showUploadedImg = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var conditions = {};
	    conditions._id = req.body.pageId;
	var skipValue =req.body.skipValue ? req.body.skipValue : 0;
	var uploadedMediaCount = 0;
	
	console.log("skipValue",skipValue);
	Page.find(conditions,{UploadedMedia: {$slice:[skipValue, 10]}},function( err , data ){
		if( !err ){
			if (data[0].UploadedMedia) {
				media.find({ _id: { $in: data[0].UploadedMedia } },function(err,data1){
					if (err) {
						var response = {
							status: 502,
							message: "something went wrong"
						}
						res.json(response);
					}else{
						Page.find(conditions,{UploadedMedia: 1},function( err , data2 ){
							if( !err ){
								uploadedMediaCount = data2[0].UploadedMedia.length;
								var response = {
									status: 200,
									message: "got uploaded media successfully",
									result : data1,
									uploadedMediaCount: uploadedMediaCount
								}
								res.json(response);
							}
							else{
							}
						})
					}
				})
			}
		
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

SearchGalleryPage.findSelectedMedia = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var conditions = {};
	    conditions._id = req.body.pageId;
	var skipValue =req.body.skipValue ? req.body.skipValue : 0;
	var selectedMediaCount = 0;
	
	console.log("skipValue",skipValue);
	Page.find(conditions,{SelectedMedia: {$slice:[skipValue, 48]}},function( err , data ){
		if( !err ){
			console.log("daata--->",data[0].SelectedMedia)
			media.find({ _id: { $in: data[0].SelectedMedia } },function(err,data1){
				if (err) {
					var response = {
						status: 502,
						message: "something went wrong"
					}
					res.json(response);
				}else{
					Page.find(conditions,{SelectedMedia: 1},function( err , data2 ){
						if( !err ){
							selectedMediaCount = data2[0].SelectedMedia.length;
							var response = {
								status: 200,
								message: "got uploaded media successfully",
								result : data1,
								selectedMediaCount: selectedMediaCount
							}
							res.json(response);
						}
						else{
						}
					})
				}
			})
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



SearchGalleryPage.savePageFilters = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var conditions = {},
            fields = {};
	    conditions._id = req.body.pageId;
	    fields.PageFilters = req.body.PageFilters ? req.body.PageFilters : [];
	
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "updated successfully.",
				result : numAffected				
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
SearchGalleryPage.saveMediaTypes = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var conditions = {},
            fields = {};
	    conditions._id = req.body.pageId;
	    fields.mediaTypes = req.body.mediaTypes ? req.body.mediaTypes : [];
	
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "updated successfully.",
				result : numAffected				
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

SearchGalleryPage.deleteUploadedImage = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var img_id = req.body.imgId;
	var mongoose = require('mongoose');
	var img_idz = mongoose.Types.ObjectId(img_id);
	
	Page.update({_id: req.body.pageId},{ $pull: { 'UploadedMedia': {$in :[img_idz]} } },function(err,data1){
		if( !err ){
			
			/*
			media.findOne({_id: img_id}, function(err, mediaData){
				mediaData.remove();
					var response = {
					status: 200,
					message: "image deleted successfully.",
					result : 'success'			
				}
				res.json(response);
				
			}) */
			var conditions = {},
			fields = {};
			conditions._id = img_id;
			fields.IsDeleted = 1;
		    
			media.update(conditions,{$set:fields},function( err , numAffected ){
				if( !err ){
					/*
					var mediaCenterPath = "/../../public/assets/Media/img/";
					var temp_imgUrl = req.body.imgUrl;
					var srcPath = __dirname + mediaCenterPath+'/' + temp_imgUrl;
					var srcPath_aspectfit = __dirname + mediaCenterPath+'aspectfit/' + temp_imgUrl;
					var srcPath_300 = __dirname + mediaCenterPath+'300/' + temp_imgUrl;
					var srcPath_1200 = __dirname + mediaCenterPath+'1200/' + temp_imgUrl;
					var srcPath_100 = __dirname + mediaCenterPath+'100/' + temp_imgUrl;
					var srcPath_600 = __dirname + mediaCenterPath+'600/' + temp_imgUrl;
					
					if(fs.existsSync(srcPath)){
						fs.unlink(srcPath);
					}
					if(fs.existsSync(srcPath_aspectfit)){
						fs.unlink(srcPath_aspectfit);
					}
					if(fs.existsSync(srcPath_300)){
						fs.unlink(srcPath_300);
					}
					if(fs.existsSync(srcPath_1200)){
						fs.unlink(srcPath_1200);
					}
					
					if(fs.existsSync(srcPath_100)){
						fs.unlink(srcPath_100);
					}
					if(fs.existsSync(srcPath_600)){
						fs.unlink(srcPath_600);
					}
					*/
					var response = {
						status: 200,
						message: "image deleted successfully.",
						result : numAffected				
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

/*
SearchGalleryPage.deleteHandPickedImage = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var img_id = req.body.imgId;
	//var mongoose = require('mongoose');
	//var img_idz = mongoose.Types.ObjectId(img_id);
	
	Page.update({_id: req.body.pageId},{ $pull: { 'SelectedMedia': {$in :[img_id]} } },function(err,data1){
		if( !err ){
			var conditions = {},
			fields = {};
			conditions._id = img_id;
			fields.IsDeleted = 1;
		    
			media.update(conditions,{$set:fields},function( err , numAffected ){
				if( !err ){
					var response = {
						status: 200,
						message: "image deleted successfully.",
						result : numAffected				
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
		else{
			console.log(err);
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			res.json(response);
		}
	})
}*/

SearchGalleryPage.saveMediaRange = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var conditions = {},
            fields = {};
	    conditions._id = req.body.pageId;
	    fields.mediaRange = req.body.mediaRange ? req.body.mediaRange : 100;
	
	Page.update(conditions,{$set:fields},function( err , numAffected ){
		if( !err ){
			var response = {
				status: 200,
				message: "updated successfully.",
				result : numAffected				
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

SearchGalleryPage.dashEditCreate = function ( req , res ){
	//check isMyChapter( req.header.chapter_id ) - Middle-ware Authorization check 
	var data = {};
	data.CreaterId = req.session.user._id;
	data.OwnerId = req.session.user._id;
	data.IsDeleted = 1;
	
	data.ChapterId = req.headers.chapter_id ? req.headers.chapter_id : null;
	data.PageType = req.body.page_type ? req.body.page_type : "gallery";  
	 
	Page(data).save(function( err , result ){
		if( !err ){
				var data = {};
				data = result.toObject();
				delete data._id;		//so that new id will be created automartically
				delete data.IsDeleted;
				data.UpdatedOn = Date.now();
				data.OriginatedFrom = result._id;
				data.Origin = "publishNewChanges";
				data.IsDasheditpage = true;
				data.IsLaunched = false;
				

				Page(data).save(function( err , results ){
					if( !err ){
						var response = {
							status: 200,
							message: "Page duplicated successfully.",
							result : results				
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
				});

		}
		else{
			console.log(err);
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			res.json(response);
		}
	});

}


// To preview user gallery
SearchGalleryPage.userGalleryPreview = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	
	var offset = req.body.offset ? req.body.offset : 0;
	var limit = req.body.per_page ? req.body.per_page : 48;
	
	
	var conditions = {};
	conditions._id = req.body.pageId;
	
	var subDocSkipAndLimitObj = {
		SelectedMedia: {
			$slice:[offset, limit]
		}
	};
		
	
	//console.log("skipValue",skipValue);
	Page.find(conditions,subDocSkipAndLimitObj,function( err , data ){
		if( !err ){
			console.log("daata--->",data[0].SelectedMedia.length)
			var selectedMedia = [];
			selectedMedia = data[0].SelectedMedia ? data[0].SelectedMedia : [];
			
			var sortObj = {MediaScore :-1 , UploadedOn : -1};
			
			
			media.find({ _id: { $in: selectedMedia } }).sort(sortObj).exec(function(err,data1){
				if (err) {
					var response = {
						status: 502,
						message: "something went wrong"
					}
					res.json(response);
				}else{
					Page.find(conditions,{SelectedMedia: 1},function( err , data2 ){
						if( !err ){
							selectedMediaCount = data2[0].SelectedMedia.length;
							var response = {
								status: 200,
								message: "got uploaded media successfully",
								result : data1,
								selectedMediaCount: selectedMediaCount
							}
							res.json(response);
						}
						else{
						}
					})
				}
			})
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

// To Delete media from user gallery
SearchGalleryPage.deleteGalleryMedia = function(req, res){
	console.log("------------------------------------------");
	console.log("Data come---",req.body);
	var mediaID =req.body.mediaId ? req.body.mediaId : 0;
	
	Page.update({_id: req.body.pageId},{ $pull: { 'SelectedMedia': {$in :[mediaID]} } },function(err,data1){
		if( err ){
			console.log(err);
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			res.json(response);
		}else{
			var response = {
				status: 200,
				message: "Media deleted successfully",
				result : data1,
			}
			res.json(response);
		}
	});
}
// To push page id in chapter by arun sahani 20-05-2016
var pushPageId = function(chapterId , pageId){
	Chapter.update({_id: chapterId},{ $push: { pages: pageId} },function(err,data){
		if (err) {
			console.log(err);
		}else{
			console.log("page saved in chapter successfully.");
		}
	})
}
//My Pages Apis
module.exports = SearchGalleryPage;