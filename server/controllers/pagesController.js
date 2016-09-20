var Chapter = require('./../models/chapterModel.js');
var Page = require('./../models/pageModel.js');
var SearchGalleryPage = require('./../controllers/searchGalleryPageController.js');
var User = require('./../models/userModel.js');
var nodemailer = require('nodemailer');

var ContentPage = require('./../controllers/contentPageController.js');
/*
var ContentPage = {
	create : function(req , res){res.json({status:404});},
	update : function(req , res){res.json({status:200});}
}
*/
//My Pages Apis

/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		getChapterName
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR" + "CR"
_________________________________________________________________________
*/

var getChapterName = function ( req , res ){
	var conditions = {
		_id : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		OwnerId : req.session.user._id,
		IsDeleted : 0
	};
	
	var fields = {
		Title : true
	}; 
		
	Chapter.findOne(conditions , fields , function( err , result ){
		if( !err ){
			if(result){
				var response = {
					status: 200,
					message: "Chapter Title",
					result : result.Title ? result.Title : "Chapter Title"
				}
				//res.json(response);
			}
			else{
				console.log(result);
				var response = {
					status: 501,
					message: "Something went wrong." 
				}
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
   * @Method :   		getPageName
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR" + "CR" + "PE"
_________________________________________________________________________
*/

var getPageData = function ( req , res ){
	var conditions = {
		//ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		_id : req.headers.page_id ? req.headers.page_id : 0, 
		IsDeleted : 0
	};
	
	var fields = {}; 
		
	Page.findOne(conditions , fields ).populate('ChapterId','MenuIcon').exec(function( err , result ){
		if( !err ){
			var response = {
				status: 200,
				message: "Page Data",
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


/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		getPageLibrary
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var getPageLibrary = function ( req , res ){
	var limit = req.body.perPage ? req.body.perPage : 0;
	var offset = req.body.pageNo ? ( (req.body.pageNo-1) * limit) : 0;
	var conditions = {
		//ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0,
		Origin : {"$ne":"publishNewChanges"},
		OwnerId : req.session.user._id,
		//IsDashEditPage : {$exists:false},
		IsDeleted : 0
	};
	var sortObj = {
		//Order : 1,
		UpdatedOn : -1
	};
	var fields = {}; 
		
	Page.find(conditions , fields).skip(offset).limit(limit).populate('ChapterId').sort(sortObj).exec(function( err , results ){
		if( !err ){
			Page.find(conditions , fields).exec(function( errr , results2 ){
				if (!errr) {
					var response = {
						count : results2.length,
						status: 200,
						message: "Pages listing",
						results : results
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
	});
}

/*________________________________________________________________________
   * @Date:      		31 August 2015
   * @Method :   		createdByMe
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var createdByMe = function ( req , res ){
	var limit = req.body.perPage ? req.body.perPage : 0;
	var offset = req.body.pageNo ? ( (req.body.pageNo-1) * limit) : 0;
	var conditions = {
		//ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		//Origin : "created",
		$or : [{Origin : "created"},{Origin : "duplicated"},{Origin : "addedFromLibrary"}],
		CreaterId : req.session.user._id, 
		//OwnerId : req.session.user._id,
		$or : [{Origin : 'created'},{Origin : 'duplicated'},{Origin : 'addedFromLibrary'}],
		IsDeleted : 0
	};
	var sortObj = {
		//Order : 1,
		UpdatedOn : -1
	};
	var fields = {}; 
		
	Page.find(conditions , fields).skip(offset).limit(limit).populate('ChapterId').sort(sortObj).exec(function( err , results ){
		if( !err ){
			Page.find(conditions , fields).exec(function( errr , results2 ){
				if (!errr) {
					var response = {
						count : results2.length,
						status: 200,
						message: "Pages listing",
						results : results
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
	});
}

/*________________________________________________________________________
   * @Date:      		31 August 2015
   * @Method :   		sharedWithMe
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var sharedWithMe = function ( req , res ){
	var limit = req.body.perPage ? req.body.perPage : 0;
	var offset = req.body.pageNo ? ( (req.body.pageNo-1) * limit) : 0;
	var conditions = {
		//ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		//CreaterId : req.session.user._id, 
		Origin : 'shared',
		CreaterId : {$ne:req.session.user._id},
		OwnerId : req.session.user._id,
		IsDeleted : 0
	};
	var sortObj = {
		//Order : 1,
		UpdatedOn : -1
	};
	var fields = {}; 
		
	Page.find(conditions , fields).skip(offset).limit(limit).populate('ChapterId').sort(sortObj).exec(function( err , results ){
		if( !err ){
			Page.find(conditions , fields).exec(function( errr , results2 ){
				if (!errr) {
					var response = {
						count : results2.length,
						status: 200,
						message: "Pages listing",
						results : results
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
	});
}


/*________________________________________________________________________
   * @Date:      		31 August 2015
   * @Method :   		byTheHouse
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var byTheHouse = function ( req , res ){
	var limit = req.body.perPage ? req.body.perPage : 0;
	var offset = req.body.pageNo ? ( (req.body.pageNo-1) * limit) : 0;
	var conditions = {
		//ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		CreaterId : req.session.user._id, 
		OwnerId : req.session.user._id,
		Origin : 'byTheHouse',			
		IsDeleted : 0
	};
	var sortObj = {
		//Order : 1,
		UpdatedOn : -1
	};
	var fields = {}; 
		
	Page.find(conditions , fields).skip(offset).limit(limit).populate('ChapterId').sort(sortObj).exec(function( err , results ){
		if( !err ){
			Page.find(conditions , fields).exec(function( errr , results2 ){
				if (!errr) {
					var response = {
						count : results2.length,
						status: 200,
						message: "Pages listing",
						results : results
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
	});
}


/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		findAll
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var findAll = function ( req , res ){
	var conditions = {
		$or : [{Origin : "created"},{Origin : "duplicated"},{Origin : "addedFromLibrary"}],
		ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		CreaterId : req.session.user._id,
		//IsDasheditpage: { $exists: false},
		//IsLaunched : false,
		IsDeleted : 0
	};
	var sortObj = {
		Order : 1,
		UpdatedOn : -1
	};
	
	var fields = {}; 
		
	Page.find(conditions , fields).populate('ChapterId').sort(sortObj).exec(function( err , results ){
		if( !err ){
			var response = {
				status: 200,
				message: "Pages listing",
				results : results
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
   * @Method :   		getAllPages - For Preview
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var getAllPages = function ( req , res ){
	var conditions = {
		//$or : [{Origin : "created"},{Origin : "duplicated"},{Origin : "addedFromLibrary"},{Origin : "createdForMe"},{Origin : "shared"}],
		ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		//OwnerId : req.session.user._id,
		IsDeleted : 0
	};
	var sortObj = {
		Order : 1,
		UpdatedOn : -1
	};
	
	var fields = {}; 
		
	Page.find(conditions , fields).populate('ChapterId').sort(sortObj).exec(function( err , results ){
		if( !err ){
			var response = {
				status: 200,
				message: "Pages listing",
				results : results
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
   * @Method :   		create
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR (req.header.chapter_id) + PE (req.header.page_id)"
_________________________________________________________________________
*/

var create = function ( req , res ){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check 
	
	//separate functionality of Search Gallery page & Content page
	var pageType = req.body.page_type ? req.body.page_type : ""; 
	console.log("page create called..........");
	switch( pageType ){
		case "gallery": 
			console.log("calling ----- SearchGalleryPage.create(req , res)");
			var s= SearchGalleryPage.create(req , res);
			break;
		
		case "content": 
			ContentPage.create(req , res);
			break;
		
		default:
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			res.json(response);
	}
}

/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		duplicate
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR (req.headers.chapter_id) + PE (req.header.page_id)"
_________________________________________________________________________
*/

var duplicate = function ( req , res ){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check 
	var conditions = {};
	var fields = {
		Title : true,
		PageType : true,
		HeaderImage : true,
                BackgroundMusic : true,
                CommonParams : true,
                ViewportDesktopSections : true,
                ViewportTabletSections : true,
                ViewportMobileSections : true
	};
	
	conditions.ChapterId = req.headers.chapter_id;
	conditions._id = req.headers.page_id;
	conditions.IsDeleted = 0;
	
	Page.findOne(conditions , fields , function( err , result ){
		if( !err ){
			var data = {};
			data.Origin = "duplicated",
			data.OriginatedFrom = req.headers.page_id;
			
			data.CreaterId = req.session.user._id;
			data.OwnerId = req.session.user._id;
			data.ChapterId = req.headers.chapter_id;
			data.Title = result.Title ? result.Title : "Untitled Page";
			data.PageType = result.PageType;
			data.HeaderImage = result.HeaderImage?result.HeaderImage:"";
			data.BackgroundMusic = result.BackgroundMusic ? result.BackgroundMusic : "";
                        
                        if(data.PageType == "content"){
                            data.CommonParams = result.CommonParams ? result.CommonParams : {};
                            data.ViewportDesktopSections = result.ViewportDesktopSections ? result.ViewportDesktopSections : {};
                            data.ViewportTabletSections = result.ViewportTabletSections ? result.ViewportTabletSections : {};
                            data.ViewportMobileSections = result.ViewportMobileSections ? result.ViewportMobileSections : {};
                        }
                        
			
			data.CreatedOn = Date.now();
			data.UpdatedOn = Date.now();
			
			console.log("data = ",data);
			Page(data).save(function( err , result ){
				if( !err ){
					var response = {
						status: 200,
						message: "Page duplicated successfully.",
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

/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		remove
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR (req.header.chapter_id)"
_________________________________________________________________________
*/

var remove = function ( req , res ){
	//check isMyChapter( req.header.chapter_id ) - Middle-ware Authorization check 
	
	var data = {};
	var query = {};
	
	query._id = req.headers.page_id;
	var chapterId = req.headers.chapter_id;
	data.IsDeleted = 1;
	
	Page.update(query , {$set : data} , function( err , result ){
		if( !err ){
			//console.log("result = ",result);return;
			var response = {
				status: 200,
				message: "Page deleted successfully.",
				result : result				
			}
			pullPageId(chapterId,query._id)
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
   * @Method :   		reorder
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR (req.headers.chapter_id)"
_________________________________________________________________________
*/

var reorder = function ( req , res ){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check 
	var pageIds = req.body.page_ids ? req.body.page_ids : [];
	console.log("pageIds = ",pageIds);
	var resultCount = 0;
	for( var loop = 0; loop < pageIds.length; loop++,resultCount++ ){
		var pageId = pageIds[loop];
		var conditions = {};
		var data = {};
		console.log("req.headers = " , req.headers)
		conditions._id = pageId;
		console.log("conditions = ",conditions);
		findAndUpdate(conditions , loop+1);
	}
	
	function findAndUpdate(conditions , order){
		Page.findOne(conditions , function( err , result ){
			if( !err ){
				result.Order = order;
				console.log("result = ",result);
				result.save(function(err , result){
					console.log("Reordered = ",result);
				});
			}
		});
	}
	
	if( pageIds.length > 0 && resultCount == pageIds.length ){
		var response = {
			status: 200,
			message: "Pages reordered successfully."
		}
		res.json(response);
		
	}
	else{
		var response = {
			status: 501,
			message: "Something went wrong." 
		}
		res.json(response);
	}
}



//Page library Apis

/*________________________________________________________________________
   * @Date:      		31 August 2015
   * @Method :   		addFromLibrary
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + PE"
_________________________________________________________________________
*/

var addFromLibrary = function ( req , res ){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check 
	var conditions = {};
	var fields = {
		Title : 1,
		PageType : 1,
		HeaderImage : 1
	};
	
	conditions._id = req.headers.page_id;
	conditions.IsDeleted = 0;
	console.log("conditions ============",conditions);
	Page.findOne(conditions , fields , function( err , result ){
		if( !err ){
			var data = {};
			data.Origin = "addedFromLibrary";
			data.OriginatedFrom = req.headers.page_id;
			
			data.CreaterId = req.session.user._id;
			data.OwnerId = req.session.user._id;
			data.ChapterId = req.headers.chapter_id;
			data.Title = result.Title ? result.Title : "Untitled Page";
			data.PageType = result.PageType;
			data.HeaderImage = result.HeaderImage;
			
			data.CreatedOn = Date.now();
			data.UpdatedOn = Date.now();
			
			console.log("data = ",data);
			Page(data).save(function( err , result ){
				if( !err ){
					var response = {
						status: 200,
						message: "A new instance of the page has been added from library.",
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


/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		preview
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var preview = function ( req , res ){
	var query = {};
	var fields = {};
	query._id = req.headers.chapter_id;
	
	Page.findOne(query , fields , function( err , result ){
		
		var query = {};
		var fields = {};
		query._id = req.headers.chapter_id;
		
		if( !err ){
			var response = {
				status: 200,
				message: "Chapter added successfully.",
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
	})

}

/*________________________________________________________________________
   * @Date:      		17 June 2015
   * @Method :   		share
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/

var share = function ( req , res ){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check 
	var conditions = {};
	var fields = {
		Title : 1,
		PageType : 1,
		HeaderImage : 1
	};
	
	conditions.ChapterId = req.headers.chapter_id;
	conditions._id = req.headers.page_id;
	conditions.IsDeleted = 0;
	
	Page.findOne(conditions , fields , function( err , result ){
		if( !err ){
			var shareWithEmail = req.body.share_with_email ? req.body.share_with_email : false;
			if( shareWithEmail ){
				var conditions = {};
				conditions.Email = shareWithEmail;
				
				var fields = {
					Email : true
				};
				
				User.find(conditions , fields , function(err , UserData){
					if(!err){
						
						var data = {};
						data.Origin = "shared",
						data.OriginatedFrom = req.headers.page_id;
						
						data.CreaterId = req.session.user._id;
						
						if(!UserData.length){
							//Non-Registered user case
							data.OwnerId = req.session.user._id;
							data.OwnerEmail = req.session.user.Email;
						}
						else{
							data.OwnerId = UserData[0]._id;
							data.OwnerEmail = UserData[0].Email;
						}
						
						data.Title = result.Title ? result.Title : "Untitled Page";
						data.PageType = result.PageType;
						data.HeaderImage = result.HeaderImage;
						
						data.CreatedOn = Date.now();
						data.UpdatedOn = Date.now();
						
						console.log("data = ",data);
						Page(data).save(function( err , result ){
							if( !err ){
								//shareEmail();
								var transporter = nodemailer.createTransport({
									service: 'Gmail',
									auth: {
										user: 'collabmedia.scrpt@gmail.com',
										pass: 'scrpt123_2014collabmedia#1909'
									}
								});	
								var to = shareWithEmail;
								
								var mailOptions = {
									from: 'collabmedia support  <collabmedia.scrpt@gmail.com>', // sender address
									to: to, // list of receivers
									subject: 'Scrpt - '+req.session.user.Name+' has sent you a Page!',
									text: 'http://203.100.79.94:8888/#/login', 
									html: "Hi , <br/><br/> Scrpt - "+req.session.user.Name+" has sent you a Page : '"+data.Title+"'.<br/><br/>Sincerely,<br>The Scrpt team. "
								};

								transporter.sendMail(mailOptions, function(error, info){
									if(error){
										console.log(error);
										//res.json(err);
									}else{
										console.log('Message sent to: '+to + info.response);
										//res.json({'msg':'done','code':'200'});
									}
								});
								
								var response = {
									status: 200,
									message: "Page shared successfully.",
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

var findAll_dashedit = function ( req , res ){
	//console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.i am here');return
	
	var conditions = {
		//$or : [{Origin : "created"},{Origin : "duplicated"},{Origin : "addedFromLibrary"},{Origin : "published"}],
		Origin : "publishNewChanges",
		ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		OwnerId : req.session.user._id,
		IsDeleted : 0,
		//IsDasheditpage:{$exists:true, IsDasheditpage: {$eq:true}}
		IsDasheditpage : true
	};
	var  conditionsforInitialCase = {
		$or : [{Origin : "created"},{Origin : "duplicated"},{Origin : "addedFromLibrary"},{Origin : "published"}],
		ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		OwnerId : req.session.user._id,
		IsDeleted : 0
	}
	var sortObj = {
		Order : 1,
		UpdatedOn : -1
	};
	
	var fields = {
		_id : true
	};
		//console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",conditions);return
	Page.find(conditions).populate('ChapterId').sort(sortObj).exec(function( err , results ){
		if( !err ){
			if (results.length) {
				//console.log("theeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
					var response = {
					status: 200,
					message: "Pages listing",
					results : results
				}
				res.json(response);
			}else{
				Page.find(conditionsforInitialCase).populate('ChapterId').sort(sortObj).exec(function( err , resultz ){
					if (!err) {
						var pageCreatedCount = createDashEditCopy(resultz,conditions.ChapterId,conditions.OwnerId);
						console.log("pagecount55555555555555555555555555555555555555555555555555555",pageCreatedCount);	
						if (pageCreatedCount) {
							setTimeout(function(){
								Page.find(conditions).populate('ChapterId').sort(sortObj).exec(function( err , results ){
									if (!err) {
										var response = {
											status: 200,
											message: "Pages listing",
											results : results
										}
										res.json(response);
									}else{
										console.log(err);
										var response = {
											status: 501,
											message: "Something very went wrong." 
										}
										res.json(response);	
									}
									
								});
							},1000);
						}else{
						console.log("no page counttttttttttttttttttttttttttttttttttttttttttttttttttttt");//return	
						}
					}else{
					  console.log(err);
						var response = {
							status: 501,
							message: "Something very went wrong." 
						}
						res.json(response);	
					}
					
				});
				//console.log("00000000000000000000000000000000000000000000000000000000000000");return
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
	});
	
}

var createDashEditCopy = function(pages,ChapterId,OwnerId){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check
	var countPages = 0;
	var pageId = '';
	//console.log("-----------------------------------page are--------------------------------",pages.length);return
	for(var i=0;i<pages.length;i++){
		
		//console.log("theeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",pages[i]);return
		
		var conditions = {};
		var fields = {};
			
		conditions.ChapterId = ChapterId;
		conditions._id = pages[i]._id;
		//pageId = pages[i]._id;
		conditions.IsDeleted = 0;
		
		Page.findOne(conditions , fields , function( err , result ){
			if( !err ){
				//console.log("77777777777777788888888888888888888888888888888888888888888------------",result);return;
				var data = {};
				//delete result._id;
				
				data = result.toObject();
				delete data._id;		//so that new id will be created automartically
				
				data.UpdatedOn = Date.now();
				
				data.OriginatedFrom = result._id;
				data.Origin = "publishNewChanges";
				
				data.IsDasheditpage = true;
				
				data.IsLaunched = false;
				//data._id = null;
				
				console.log("data------------------------------------------->>>>>>>",data);//return;
				Page(data).save(function( err , result ){
					if( !err ){
						var response = {
							status: 200,
							message: "Page duplicated successfully.",
							result : result				
						}
						//res.json(response);
					}
					else{
						console.log(err);
						var response = {
							status: 501,
							message: "Something went wrong." 
						}
						//res.json(response);
					}
				});
			}
			else{
				console.log(err);
				var response = {
					status: 501,
					message: "Something went wrong." 
				}
				//res.json(response);
			}
		})
		countPages++;
	}
	return countPages;
	
	
}


var publishNewUpdates_dashedit = function ( req , res ){
	//console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++');return
	
	var fields = {
		IsDasheditpage : true
	}
	var sortObj = {
		Order : 1,
		UpdatedOn : -1
	};
	
	var conditions = {
		Origin : "publishNewChanges",
		ChapterId :req.headers.chapter_id ? req.headers.chapter_id : 0,
		OwnerId : req.session.user._id,
		//IsDeleted : 1,
		//IsDasheditpage:{$exists:true, IsDasheditpage: {$eq:true}}
		IsDasheditpage : true
	};
	var pageCheckCout = 0;
	
	Page.find(conditions).populate('ChapterId').sort(sortObj).exec(function( err , result ){
		//console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',result);return
		if( !err ){
			for(var i=0;i<result.length;i++){
				//console.log(result[i]._id,'--------------------------------------------',result[i].OriginatedFrom);return
				
				
				var data = {};
				//delete result._id;
				
				data = result[i].toObject();
				delete data._id;		//so that new id will be created automartically
				delete data.CreaterId;
				delete data.OwnerId;
				delete data.ChapterId;
				delete data.PageType;
				delete data.IsDasheditpage;
				delete data.IsLaunched;
				delete data.CreatedOn;
				delete data.Status;
				delete data.Order;
				delete data.Origin;
				data.UpdatedOn = Date.now();
				/*data._id = null;
				
				var data = {};
				
				data.Title = result[i].Title ? result[i].Title : "Untitled Page";
				data.PageType = result[i].PageType;
				data.HeaderImage = result[i].HeaderImage?result[i].HeaderImage:"";
				data.BackgroundMusic = result[i].BackgroundMusic ? result[i].BackgroundMusic : "";
				
				if(data.PageType == "content"){
				    data.CommonParams = result[i].CommonParams ? result[i].CommonParams : {};
				    data.ViewportDesktopSections = result[i].ViewportDesktopSections ? result[i].ViewportDesktopSections : {};
				    data.ViewportTabletSections = result[i].ViewportTabletSections ? result[i].ViewportTabletSections : {};
				    data.ViewportMobileSections = result[i].ViewportMobileSections ? result[i].ViewportMobileSections : {};
				}*/
				
				
				//console.log("data << -----------> ",data);return
				
				Page.update({_id: result[i].OriginatedFrom} , {$set:data} , function( err , result ){
					if( !err ){
						//console.log("YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
						var response = {
							status: 200,
							message: "Page name updated successfully.",
							result : result				
						}
						//res.json(response);
					}
					else{
						console.log(err);
						var response = {
							status: 501,
							message: "Something went wrong." 
						}
						//res.json(response);
					}
				});
				
			pageCheckCout++;	
			}
			if (pageCheckCout==result.length) {
				var responseNewPublish = {
						status: 200,
						message: "New changes has been published successfully.",			
					}
				res.json(responseNewPublish);
			}
		}else{
			console.log(err);
				var response = {
					status: 501,
					message: "Something went wrong." 
				}
				res.json(response);
		}
	});
}

var dashEditCreate = function ( req , res ){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check 
	
	//separate functionality of Search Gallery page & Content page
	var pageType = req.body.page_type ? req.body.page_type : ""; 
	console.log("page create called..........");
	switch( pageType ){
		case "gallery": 
			console.log("calling ----- SearchGalleryPage.create(req , res)");
			SearchGalleryPage.dashEditCreate(req , res);
			break;
		
		case "content": 
			ContentPage.dashEditCreate(req , res);
			break;
		
		default:
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			res.json(response);
	}
}

// To delete page id in chapter by arun sahani 20-05-2016
var pullPageId = function(chapterId , pageId){
	var mongoose = require('mongoose');
	var pageObjId = mongoose.Types.ObjectId(pageId);
	//db.Capsules.update({"_id": ObjectId("573ea437217581540bb6acab")},
	//{$pull: {'Chapters': {$in: [ObjectId('573ea914689766de10851e96')]}}})
	
	Chapter.update({_id: chapterId},{ $pull: { 'pages': {$in :[pageObjId]} } },function(err,data1){
		if(err){
			console.log(err);
		} else{
			console.log("page pulled from chapter's pages[] successfully.")
		}
	});
}

// To restore the latest changes by arun sahani
var revertDashEditCopy = function(req , res){
	//console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.i am here');return
	
	var conditions = {
		//$or : [{Origin : "created"},{Origin : "duplicated"},{Origin : "addedFromLibrary"},{Origin : "published"}],
		Origin : "publishNewChanges",
		ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		OwnerId : req.session.user._id,
		IsDeleted : 0,
		//IsDasheditpage:{$exists:true, IsDasheditpage: {$eq:true}}
		IsDasheditpage : true
	};
	var  conditionsforInitialCase = {
		$or : [{Origin : "created"},{Origin : "duplicated"},{Origin : "addedFromLibrary"},{Origin : "published"}],
		ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
		OwnerId : req.session.user._id,
		//IsDeleted : 0
	}
	var sortObj = {
		Order : 1,
		UpdatedOn : -1
	};
	
	var fields = {
		_id : true
	};
		//console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",conditions);return
	Page.find(conditionsforInitialCase).sort(sortObj).exec(function( err , resultz ){
		if( !err ){
			
			var pageCreatedCount = revertEditCopy(resultz,conditions.ChapterId,conditions.OwnerId);
			//console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4mailID",pageCreatedCount);	//return
				
			if (pageCreatedCount==resultz.length) {
				setTimeout(function(){
					Page.find(conditions).populate('ChapterId').sort(sortObj).exec(function( err , results ){
						if (!err) {
							var response = {
								status: 200,
								message: "Pages listing",
								results : results
							}
							res.json(response);
						}else{
							console.log(err);
							var response = {
								status: 501,
								message: "Something very went wrong." 
							}
							res.json(response);	
						}
						
					});
				},1000);
			}else{
			console.log("no page counttttttttttttttttttttttttttttttttttttttttttttttttttttt");//retur	
			}
		}else{
		  console.log(err);
			var response = {
				status: 501,
				message: "Something very went wrong." 
			}
			res.json(response);	
		}
					
	});
}

// Used in 'revertDashEditCopy' function by arun sahani
var revertEditCopy = function(pages,ChapterId,OwnerId){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check
	var countPages = 0;
	var pageId = '';
	//console.log("-----------------------------------page are--------------------------------",pages.length);return
	for(var i=0;i<pages.length;i++){
		
		var conditions = {};
		//var fields = {'_id':true};
		conditions.ChapterId = ChapterId;
		var mongoose = require('mongoose');
		
		conditions.OriginatedFrom = mongoose.Types.ObjectId(pages[i]._id);
		conditions.Origin = "publishNewChanges",
		conditions.IsDasheditpage = true,
		conditions.IsDeleted = 0;
		
		
		var data = {};

		data = pages[i].toObject();
		data.OriginatedFrom = data._id;
		delete data._id;		//so that new id will be created automartically
		
		data.UpdatedOn = Date.now();
		data.Origin = "publishNewChanges";
		data.IsDasheditpage = true;
		data.IsLaunched = false;
		//console.log(conditions.OriginatedFrom,'------------------------------------------------------------',data);return
		
		Page.update(conditions  , {$set:data} , { upsert: true }, function( err , result ){
			if (!err) {
				
				//code
			}
		       });
		countPages++;
	}
		
	return countPages;
	
	
}
//  To add page from library in edit case

var addFromLibrary_dashEdit = function ( req , res ){
	//check isMyChapter( req.headers.chapter_id ) - Middle-ware Authorization check 
	var conditions = {};
	var fields = {
		Title : 1,
		PageType : 1,
		HeaderImage : 1
	};
	
	conditions._id = req.headers.page_id;
	conditions.IsDeleted = 0;
	console.log("conditions ============",conditions);
	Page.findOne(conditions , fields , function( err , result ){
		if( !err ){
			var data = {};
			data.Origin = "addedFromLibrary";
			data.OriginatedFrom = req.headers.page_id;
			
			data.CreaterId = req.session.user._id;
			data.OwnerId = req.session.user._id;
			data.ChapterId = req.headers.chapter_id;
			data.Title = result.Title ? result.Title : "Untitled Page";
			data.PageType = result.PageType;
			data.HeaderImage = result.HeaderImage;
			data.IsDeleted = 1;
			data.CreatedOn = Date.now();
			data.UpdatedOn = Date.now();
			
			console.log("data = ",data);
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
					data.IsDeleted = 0;
					
					Page(data).save(function( err , results ){
						if( !err ){
							var response = {
								status: 200,
								message: "A new instance of the page has been added from library..",
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


//Page library Apis - common
exports.getChapterName = getChapterName;
exports.getPageData = getPageData;
exports.getPageLibrary = getPageLibrary;
exports.createdByMe = createdByMe;
exports.sharedWithMe = sharedWithMe;
exports.byTheHouse = byTheHouse;

exports.findAll = findAll;
exports.getAllPages = getAllPages;		//For Preview
exports.create = create;
exports.duplicate = duplicate;
exports.remove = remove;
exports.reorder = reorder;
exports.addFromLibrary = addFromLibrary;
exports.preview = preview;
exports.share = share;

exports.findAll_dashedit = findAll_dashedit;
exports.publishNewUpdates_dashedit = publishNewUpdates_dashedit;
exports.revertDashEditCopy = revertDashEditCopy;
exports.addFromLibrary_dashEdit = addFromLibrary_dashEdit;

exports.dashEditCreate = dashEditCreate;
//Page library Apis - specific :- Exported from SearchGalleryPageController & ContentPageController
exports.SearchGalleryPage = SearchGalleryPage;
exports.ContentPage = ContentPage;
