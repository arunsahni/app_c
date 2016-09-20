var Capsule = require('./../models/capsuleModel.js');
var Chapter = require('./../models/chapterModel.js');
var Page = require('./../models/pageModel.js');
var User = require('./../models/userModel.js');

var fs = require('fs');
var formidable = require('formidable');
var mediaController = require('./../controllers/mediaController.js');

var nodemailer = require('nodemailer');
//var Page = require('./../models/pageModel.js');


/*________________________________________________________________________
   * @Date:      		16 September 2015
   * @Method :   		getAllChapters
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var getChapters = function ( req , res ){
	var conditions = {
		CapsuleId : req.headers.capsule_id,
		//CreaterId : req.session.user._id,
		OwnerId : req.session.user._id,			//used by both creater - for publish and by Owner - for launch.
		//IsLaunched : 0,
		Status : 1,
		IsDeleted : 0
	};
	var sortObj = {
		Order : 1,
		ModifiedOn : -1
	};
	
	var fields = {}; 
		
	Chapter.find(conditions , fields).sort(sortObj).exec(function( err , results ){
		if( !err ){
			var chapter_ids = [];
			for(var loop = 0; loop < results.length; loop++){
				chapter_ids.push(results[loop]._id);
			}
			
			var response = {
				status: 200,
				message: "Chapters listing",
				results : results,
				chapter_ids : chapter_ids 
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
   * @Date:      		07 September 2015
   * @Method :   		find
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var find = function ( req , res ){
	var conditions = {
		//CreaterId : req.session.user._id,
		_id: req.headers.capsule_id ? req.headers.capsule_id : 0,
		Status : 1,
		IsDeleted : 0
	};
	
	var fields = {};
	console.log('===========================================');
	console.log(conditions);
	console.log('===========================================');
	
	Capsule.findOne(conditions).exec(function( err , results ){
		if( !err ){
			var response = {
				status: 200,
				message: "Capsules listing",
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

var chapter__sendInvitations = function(ChapterData , invitees , req){
	for( var loop = 0; loop < invitees.length; loop++ ){
		var shareWithEmail = invitees[loop].UserEmail;
		
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
			subject: 'Scrpt - '+req.session.user.Name+' has invited you in a chapter!',
			text: 'http://203.100.79.94:8888/#/login', 
			html: "Hi , <br/><br/> Scrpt - "+req.session.user.Name+" has invited you in the chapter : '"+ChapterData.Title+"'. Login to access this chapter.<br/><br/>Sincerely,<br>The Scrpt team. "
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
		/*
		var mailOptions = {
			from: 'collabmedia support  <collabmedia.scrpt@gmail.com>', // sender address
			to: to, // list of receivers
			subject: 'You are invited to join my board on Scrpt',
			text: 'http://203.100.79.94:8888/#/'+type+'/'+boardId, 
			html: 'You are invited by '+senderEmailId+' to join his/her board on Scrpt.<br />click the below link to join this board<br /><a href="http://203.100.79.94:8888/#/'+type+'/'+boardId+'">http://203.100.79.94:8888/#/'+type+'/'+boardId+'</a><br /><br />Regards<br />collabmedia.scrpt@gmail.com'
		};
		*/
	}
};

var capsule__createNewInstance = function( CapsuleData , owner, req ){
	
	var __capsuleId = CapsuleData._id;
	
	console.log("owner = ",owner);
	
	//check if the owner is register or not
	var shareWithEmail = owner.UserEmail ? owner.UserEmail : false;
	if( shareWithEmail ){
		var conditions = {};
		conditions.Email = shareWithEmail;
		
		var fields = {
			Email : true
		};
		
		User.find(conditions , fields , function(err , UserData){
			if(!err){
				console.log("UserData = ",UserData);
				
				var data = {};
				data.Origin = "published";
				data.OriginatedFrom = __capsuleId;

				data.CreaterId = req.session.user._id;

				if(!UserData.length){
					//Non-Registered user case
					data.OwnerId = req.session.user._id;	//will update this ownerId at the time of user registeration.
				}
				else{
					data.OwnerId = UserData[0]._id;
				}

				data.OwnerEmail = shareWithEmail;
				data.Title = CapsuleData.Title;
				data.CoverArt = CapsuleData.CoverArt;
				
				data.IsPublished = true;				//published by someone else....
				
				var nowDate = Date.now();
				data.CreatedOn = nowDate;
				data.ModifiedOn = nowDate;

				//console.log("data = ",data);
				Capsule(data).save(function( err , result ){
					if( !err ){
						//pages under chapters
						var conditions = {
							CapsuleId : __capsuleId, 
							CreaterId : req.session.user._id,
							Status : 1,
							IsDeleted : 0
						};
						var sortObj = {
							Order : 1,
							ModifiedOn : -1
						};
						var fields = {
							_id : true
						}; 
						
						var newCapsuleId = result._id;
						Chapter.find(conditions , fields).sort(sortObj).exec(function( err , results ){
							if( !err ){
								var fields = {
									_id : true,
									Title : true,
									CoverArt : true,
									Order : true,
									LaunchSettings : true
								}; 
								for( var loop = 0; loop < results.length; loop++ ){
									var conditions = {};
									conditions._id = results[loop]._id;
									Chapter.findOne(conditions , fields, function( err , result ){
										
										var __chapterId = result._id ? result._id : 0;
										//delete result._id;
										var data = {};
										data.Origin = "published";
										data.OriginatedFrom = result._id;
										data.CreaterId = req.session.user._id;
										
										if(!UserData.length){
											//Non-Registered user case			- this will be modified when user will register into the platform.
											data.OwnerId = req.session.user._id;
										}
										else{
											data.OwnerId = UserData[0]._id;
										}
										
										data.OwnerEmail = shareWithEmail;
										data.CapsuleId = newCapsuleId;
										
										data.Title = result.Title;
										data.CoverArt = result.CoverArt;
										data.Order = result.Order;
										data.LaunchSettings = {};
										data.LaunchSettings.NamingConvention = result.LaunchSettings.NamingConvention;	//Recommendation from creater 
										data.LaunchSettings.ShareMode = result.LaunchSettings.ShareMode;	//Recommendation from creater
										
										data.CreatedOn = nowDate;
										data.UpdatedOn = nowDate;
										
										console.log("-------",result);
										//console.log("data = ",data);
										Chapter(data).save(function( err , result ){
											if( !err ){
												
												//pages under chapters
												var conditions = {
													ChapterId : __chapterId, 
													CreaterId : req.session.user._id,
													IsDeleted : 0
												};
												var sortObj = {
													Order : 1,
													UpdatedOn : -1
												};
												var fields = {
													_id : true
												}; 
												
												var newChapterId = result._id;
												Page.find(conditions , fields).sort(sortObj).exec(function( err , results ){
													if( !err ){
														var fields = {
															_id : true,
															Title : true,
															PageType : true,
															Order : true,
															HeaderImage : true,
															BackgroundMusic : true
														}; 
														for( var loop = 0; loop < results.length; loop++ ){
															var conditions = {};
															conditions._id = results[loop]._id;
															Page.findOne(conditions , fields, function( err , result ){
																//delete result._id;
																var data = {};
																data.Origin = "published";
																data.OriginatedFrom = result._id;
																data.CreaterId = req.session.user._id;
																
																if(!UserData.length){
																	//Non-Registered user case
																	data.OwnerId = req.session.user._id;
																}
																else{
																	data.OwnerId = UserData[0]._id;
																}
																
																data.OwnerEmail = shareWithEmail;
																data.ChapterId = newChapterId?newChapterId:"";
																data.Title = result.Title;
																data.PageType = result.PageType;
																data.Order = result.Order;
																data.HeaderImage = result.HeaderImage?result.HeaderImage:"";
																data.BackgroundMusic = result.BackgroundMusic?result.BackgroundMusic:"";
																
																data.CreatedOn = nowDate;
																data.UpdatedOn = nowDate;
                                                                                                                                
                                                                                                                                if(data.PageType == "content"){
                                                                                                                                    data.CommonParams = result.CommonParams ? result.CommonParams : {};
                                                                                                                                    data.ViewportDesktopSections = result.ViewportDesktopSections ? result.ViewportDesktopSections : {};
                                                                                                                                    data.ViewportTabletSections = result.ViewportTabletSections ? result.ViewportTabletSections : {};
                                                                                                                                    data.ViewportMobileSections = result.ViewportMobileSections ? result.ViewportMobileSections : {};
                                                                                                                                }
                                                                                                                                
                                                                                                                                //content page data keys were missing before - fixing on 12052016 with team
																console.log("-------",result);
																Page(data).save(function( err , result ){
                                                                                                                                    if(!err){
                                                                                                                                        console.log("----new page instance created..",result);
                                                                                                                                    }
                                                                                                                                    else{
                                                                                                                                        console.log(err);
                                                                                                                                    }
																});
															});
														}	
													}
													else{
														console.log("095944564-----------");
													}
												});	
											}
											else{
												console.log("0959345485-----------");
											}
										});
										
									});
								}
								
								console.log("--------DONE------------");
														
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
									subject: 'Scrpt - '+req.session.user.Name+' has published a capsule for you!',
									text: 'http://203.100.79.94:8888/#/login', 
									html: "Hi , <br/><br/> Scrpt - "+req.session.user.Name+" has published a capsule for you : '"+data.Title+"'. Login and check 'Published For You' section under your dashboard to access this capsule.<br/><br/>Sincerely,<br>The Scrpt team. "
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
							}
							else{
								console.log("3875634876-----------");
							}
						});
					}
					else{
						console.log("--------jhdsgfiu0959485-----------");
					}
				});	
			}
			else{
				console.log("0959485-----------");
			}
		});
	}
	else{
		console.log("09579-----------");
	}
}


var chapter__createNewInstance = function( __capsuleId , ChapterData , owner, req ){
	console.log("owner = ",owner);
	//check if the owner is register or not
	var shareWithEmail = owner.UserEmail ? owner.UserEmail : false;
	if( shareWithEmail ){
		var conditions = {};
		conditions.Email = shareWithEmail;
		
		var fields = {
			Email : true
		};
		
		User.find(conditions , fields , function(err , UserData){
			if(!err){
				console.log("UserData = ",UserData);
				var data = {};
				data.Origin = "published";
				data.OriginatedFrom = ChapterData._id;
				
				data.CapsuleId = __capsuleId;
				data.CreaterId = req.session.user._id;
				
				if(!UserData.length){
					//Non-Registered user case
					data.OwnerId = req.session.user._id;	//will update this ownerId at the time of user registeration.
				}
				else{
					data.OwnerId = UserData[0]._id;
				}
				
				data.OwnerEmail = shareWithEmail;
				data.Title = ChapterData.Title;
				data.CoverArt = ChapterData.CoverArt;
				data.LaunchSettings = {};
				//data.LaunchSettings.MakingFor = ChapterData.LaunchSettings.MakingFor;
				data.LaunchSettings.NamingConvention = ChapterData.LaunchSettings.NamingConvention;
				data.LaunchSettings.ShareMode = ChapterData.LaunchSettings.ShareMode;
				
				var nowDate = Date.now();
				data.CreatedOn = nowDate;
				data.ModifiedOn = nowDate;
				
				//console.log("data = ",data);
				Chapter(data).save(function( err , result ){
					if( !err ){
						//pages under chapters
						var conditions = {
							ChapterId : req.headers.chapter_id ? req.headers.chapter_id : 0, 
							OwnerId : req.session.user._id,
							IsDeleted : 0
						};
						var sortObj = {
							Order : 1,
							UpdatedOn : -1
						};
						var fields = {
							_id : true
						}; 
						
						var newChapterId = result._id;
						Page.find(conditions , fields).sort(sortObj).exec(function( err , results ){
							if( !err ){
								var fields = {
									_id : true,
									Title : true,
									PageType : true,
									Order : true,
									HeaderImage : true,
									BackgroundMusic : true
								}; 
								for( var loop = 0; loop < results.length; loop++ ){
									var conditions = {};
									conditions._id = results[loop]._id;
									Page.findOne(conditions , fields, function( err , result ){
										//delete result._id;
										var data = {};
										data.Origin = "published";
										data.OriginatedFrom = result._id;
										data.CreaterId = req.session.user._id;
										
										if(!UserData.length){
											//Non-Registered user case
											data.OwnerId = req.session.user._id;
										}
										else{
											data.OwnerId = UserData[0]._id;
										}
										
										data.OwnerEmail = shareWithEmail;
										data.ChapterId = newChapterId?newChapterId:"";
										data.Title = result.Title;
										data.PageType = result.PageType;
										data.Order = result.Order;
										data.HeaderImage = result.HeaderImage?result.HeaderImage:"";
										data.BackgroundMusic = result.BackgroundMusic?result.BackgroundMusic:"";
										
										data.CreatedOn = nowDate;
										data.UpdatedOn = nowDate;
										
										console.log("-------",result);
										Page(data).save(function( err , result ){
											if(!err){
												console.log("----new page instance created..",result);
											}
											else{
												console.log(err);
											}
										});
									});
								}
								
								console.log("--------DONE------------");
								
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
									subject: 'Scrpt - '+req.session.user.Name+' has created a chapter for you!',
									text: 'http://203.100.79.94:8888/#/login', 
									html: "Hi , <br/><br/> Scrpt - "+req.session.user.Name+" has created a chapter for you : '"+data.Title+"'. Login to access this chapter.<br/><br/>Sincerely,<br>The Scrpt team. "
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
								
							}
							else{
								console.log("095944564-----------");
							}
						});	
					}
					else{
						console.log("0959345485-----------");
					}
				});
			}
			else{
				console.log("0959485-----------");
			}
		});
	}
	else{
		console.log("09579-----------");
	}
}

/*________________________________________________________________________
   * @Date:      		25 September 2015
   * @Method :   		launch
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var saveAndLaunch = function ( req , res ){

	console.log('server side saveSetting function');
	var condition = {};
	condition._id = req.headers.chapter_id ? req.headers.chapter_id : '0';
	
	var title = req.body.newTitle ? req.body.newTitle : "Untitled Chapter";
	var ShareMode = req.body.participation ? req.body.participation : "private";
	var NamingConvention = req.body.namingConvention ? req.body.namingConvention : "realnames";
	
	Chapter.update(condition,{$set:{Title:title, 'LaunchSettings.ShareMode' : ShareMode , 'LaunchSettings.NamingConvention': NamingConvention}} , {multi:false}, function(err,numAffected){
		if(err){
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			res.json(response)
		}else{
			var conditions = {
				//CreaterId : req.session.user._id,
				_id: req.headers.chapter_id ? req.headers.chapter_id : 0,
				OwnerId : req.session.user._id,
				IsLaunched : 0,
				Status : 1,
				IsDeleted : 0
			};
			
			var fields = {};
			console.log('===========================================');
			console.log(conditions);
			console.log('===========================================');
			
			Chapter.find(conditions, fields , function( err , results ){
				if( !err ){
					if( results.length ){
						var ChapterData = results[0];
						var MakingFor = ChapterData.LaunchSettings.MakingFor;
						var ShareMode = ChapterData.LaunchSettings.ShareMode;
						
						if(ChapterData.LaunchSettings.OthersData.length)
							MakingFor = "OTHERS";
							
						switch( MakingFor ){
							case "ME":
								if( ShareMode == "public" || ShareMode == "friend-solo" || ShareMode == "friend-group" ){
									ShareMode = "invite";
								}
								switch( ShareMode ){
									case  "invite": 
										console.log("public / friend-solo / friend-group Case........");
										var invitees = ChapterData.LaunchSettings.Invitees ? ChapterData.LaunchSettings.Invitees : [];
										chapter__sendInvitations(ChapterData , invitees , req);
										Chapter.update({_id:req.headers.chapter_id},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"ME"}} , {multi:false}, function(err,numAffected){
											if(err){
												var response = {
													status: 501,
													message: "Something went wrong."
												}
												res.json(response)
											}else{
												var response = {
													status: 200,
													message: "Chapter has been launched successfully.",
													result : results
												}
												res.json(response);
											}
										});
										break;
										
									case "private" : 
										console.log("No need to do anything.. It's private area.");
										Chapter.update({_id:req.headers.chapter_id},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"ME"}} , {multi:false}, function(err,numAffected){
											if(err){
												var response = {
													status: 501,
													message: "Something went wrong."
												}
												res.json(response)
											}else{
												var response = {
													status: 200,
													message: "Chapter has been launched successfully.",
													result : results
												}
												res.json(response);
											}
										});
										break;
										
									default : 
										console.log("Error on ShareMode = ",ShareMode);
										var response = {
											status: 501,
											message: "Something went wrong."
										}
										res.json(response);
										return;
								}
								break;

							case "OTHERS":
								console.log("--------------------------OTHERS CASE----------------------------");
								//create a new instance of the chapter for each other user
								var OtherUsers = ChapterData.LaunchSettings.OthersData ? ChapterData.LaunchSettings.OthersData : [];
								if(OtherUsers.length){
									for( var loop = 0; loop < OtherUsers.length; loop++ ){
										var owner = OtherUsers[loop];
										chapter__createNewInstance(ChapterData , owner , req);
										//update the chapter's IsLaunched Key value.
									}
									Chapter.update({_id:req.headers.chapter_id},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"OTHERS"}} , {multi:false}, function(err,numAffected){
										if(err){
											var response = {
												status: 501,
												message: "Something went wrong." 
											}
											res.json(response)
										}else{
											var response = {
												status: 200,
												message: "Chapter has been launched successfully.",
												result : results
											}
											res.json(response);
										}
									});
								}
								else{
									var response = {
										status: 501,
										message: "Something went wrong." 
									}
									res.json(response)
								}
								break;
								
							default : 
								console.log("ERROR on MakingFor = ",MakingFor);
								var response = {
									status: 501,
									message: "Something went wrong."
								}
								res.json(response);
								return;
						}
					}
					else{
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
			});
		}	
	})
}

/*________________________________________________________________________
   * @Date:      		12 October 2015
   * @Method :   		saveAndPublish
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var saveAndPublish = function ( req , res ){

	console.log('server side saveAndPublish function');
	
	//get capsule data and loop through it
	var conditions = {
		OwnerId : req.session.user._id,
		_id : req.headers.capsule_id,
		IsPublished : false,
		Status : true,
		IsDeleted : false
	};
	var fields = {};
	
	Capsule.find(conditions , fields , function( err , result ){
		if( !err ){
			for( var loop = 0; loop < result.length; loop++ ){
				var condition = {};
				condition._id = req.headers.chapter_id ? req.headers.chapter_id : '0';
				
				var title = req.body.newTitle ? req.body.newTitle : "Untitled Chapter";
				var ShareMode = req.body.participation ? req.body.participation : "private";
				var NamingConvention = req.body.namingConvention ? req.body.namingConvention : "realnames";
				
				Chapter.update(condition,{$set:{Title:title, 'LaunchSettings.ShareMode' : ShareMode , 'LaunchSettings.NamingConvention': NamingConvention}} , {multi:false}, function(err,numAffected){
					if(err){
						var response = {
							status: 501,
							message: "Something went wrong." 
						}
						res.json(response)
					}else{
						var conditions = {
							//CreaterId : req.session.user._id,
							_id: req.headers.chapter_id ? req.headers.chapter_id : 0,
							OwnerId : req.session.user._id,
							IsLaunched : 0,
							Status : 1,
							IsDeleted : 0
						};
						
						var fields = {};
						console.log('===========================================');
						console.log(conditions);
						console.log('===========================================');
						
						Chapter.find(conditions, fields , function( err , results ){
							if( !err ){
								if( results.length ){
									var ChapterData = results[0];
									var MakingFor = ChapterData.LaunchSettings.MakingFor;
									var ShareMode = ChapterData.LaunchSettings.ShareMode;
									
									if(ChapterData.LaunchSettings.OthersData.length)
										MakingFor = "OTHERS";
										
									switch( MakingFor ){
										case "ME":
											if( ShareMode == "public" || ShareMode == "friend-solo" || ShareMode == "friend-group" ){
												ShareMode = "invite";
											}
											switch( ShareMode ){
												case  "invite": 
													console.log("public / friend-solo / friend-group Case........");
													var invitees = ChapterData.LaunchSettings.Invitees ? ChapterData.LaunchSettings.Invitees : [];
													chapter__sendInvitations(ChapterData , invitees , req);
													Chapter.update({_id:req.headers.chapter_id},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"ME"}} , {multi:false}, function(err,numAffected){
														if(err){
															var response = {
																status: 501,
																message: "Something went wrong."
															}
															res.json(response)
														}else{
															var response = {
																status: 200,
																message: "Chapter has been launched successfully.",
																result : results
															}
															res.json(response);
														}
													});
													break;
													
												case "private" : 
													console.log("No need to do anything.. It's private area.");
													Chapter.update({_id:req.headers.chapter_id},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"ME"}} , {multi:false}, function(err,numAffected){
														if(err){
															var response = {
																status: 501,
																message: "Something went wrong."
															}
															res.json(response)
														}else{
															var response = {
																status: 200,
																message: "Chapter has been launched successfully.",
																result : results
															}
															res.json(response);
														}
													});
													break;
													
												default : 
													console.log("Error on ShareMode = ",ShareMode);
													var response = {
														status: 501,
														message: "Something went wrong."
													}
													res.json(response);
													return;
											}
											break;

										case "OTHERS":
											console.log("--------------------------OTHERS CASE----------------------------");
											//create a new instance of the chapter for each other user
											var OtherUsers = ChapterData.LaunchSettings.OthersData ? ChapterData.LaunchSettings.OthersData : [];
											if(OtherUsers.length){
												for( var loop = 0; loop < OtherUsers.length; loop++ ){
													var owner = OtherUsers[loop];
													chapter__createNewInstance(ChapterData , owner , req);
													//update the chapter's IsLaunched Key value.
												}
												Chapter.update({_id:req.headers.chapter_id},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"OTHERS"}} , {multi:false}, function(err,numAffected){
													if(err){
														var response = {
															status: 501,
															message: "Something went wrong." 
														}
														res.json(response)
													}else{
														var response = {
															status: 200,
															message: "Chapter has been launched successfully.",
															result : results
														}
														res.json(response);
													}
												});
											}
											else{
												var response = {
													status: 501,
													message: "Something went wrong." 
												}
												res.json(response)
											}
											break;
											
										default : 
											console.log("ERROR on MakingFor = ",MakingFor);
											var response = {
												status: 501,
												message: "Something went wrong."
											}
											res.json(response);
											return;
									}
								}
								else{
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
						});
					}	
				})
			}
		}
		else{
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			res.json(response)
		}		
	})
}

/*________________________________________________________________________
   * @Date:      		10 October 2015
   * @Method :   		publish
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR + CR"
_________________________________________________________________________
*/
var capsuleLaunchEngine = function (__capsuleId , MakingFor , req , res) {
	console.log("------capsule----------LaunchEngine-------");	
	switch( MakingFor ){
		case "ME":
			chapterLaunchEngine(__capsuleId , MakingFor , req , res);
			break;
			
		case "OTHERS":
			var conditions = {
				_id : __capsuleId
			}
			var fields = {};
			Capsule.find(conditions , fields , function(err , results){
				if( !err ){
					if(results.length){
						var CapsuleData = results[0];
						//OthersData
						console.log("CapsuleData.LaunchSettings == ",CapsuleData);
						var OtherUsers = CapsuleData.LaunchSettings.OthersData ? CapsuleData.LaunchSettings.OthersData : [];
						//coding error - need to fix
						if(!OtherUsers.length)
							var OtherUsers = CapsuleData.LaunchSettings.Invitees ? CapsuleData.LaunchSettings.Invitees : [];
						//coding error - need to fix
						
						if(OtherUsers.length){
							for( var loop = 0; loop < OtherUsers.length; loop++ ){
								var owner = OtherUsers[loop];
								capsule__createNewInstance(CapsuleData , owner , req);
							}
						}
						else{
							var response = {
								status: 501,
								message: "Something went wrong." 
							}
							console.log("125-------------",response)
						}
						Capsule.update({_id:__capsuleId},{$set:{IsPublished:true , IsLaunched:true , "LaunchSettings.Audience":"OTHERS"}} , {multi:false}, function(err,numAffected){
							if(err){
								var response = {
									status: 501,
									message: "Something went wrong." 
								}
								console.log("123-------------",response)
							}else{
								Chapter.update({CapsuleId:__capsuleId,Status:true,IsDeleted:false},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"OTHERS"}} , {multi:true}, function(err,numAffected){
									if(!err){
										var response = {
											status: 200,
											message: "Capsule has been published successfully.",
											result : results
										}
										res.json(response);
									}
									else{
										var response = {
											status: 501,
											message: "Something went wrong." 
										}
										console.log("123000-------------",response)
									}
								})
							}
						});
					}
					else{
						var response = {
							status: 501,
							message: "Something went wrong." 
						}
						console.log("126-------------",response)
					}
				}
				else{
					var response = {
						status: 501,
						message: "Something went wrong." 
					}
					console.log("127-------------",response)
				}
			})	
			break;
			
		case "SUBSCRIBERS":
			console.log("---------------SUBSCRIBERS CASE-----------");
			var response = {
				status: 501,
				message: "Something went wrong." 
			}
			console.log("128-------------",response)
			res.json(response)
			break;
			
		default:
		
	}

}

var chapterLaunchEngine = function (__capsuleId , MakingFor , req , res) {
	console.log("------chapterLaunchEngine-------");	
	var conditions = {
		CapsuleId: __capsuleId,
		IsLaunched : 0,						//IsLaunched = true means the batch invitations have been sent.
		Status : 1,
		IsDeleted : 0
	};
	
	var fields = {};
	console.log('===========================================');
	console.log(conditions);
	console.log('===========================================');
	
	Chapter.find(conditions, fields , function( err , results ){
		if( !err ){
			if( results.length ){
				for(var loop = 0; loop < results.length; loop++){
					var ChapterData = results[loop];
					//var MakingFor = ChapterData.LaunchSettings.MakingFor;
					var ShareMode = ChapterData.LaunchSettings.ShareMode;
					var __chapterId = ChapterData._id;
					
					if( ShareMode == "public" || ShareMode == "friend-solo" || ShareMode == "friend-group" ){
						ShareMode = "invite";
					}
					switch( ShareMode ){
						case  "invite": 
							console.log("public / friend-solo / friend-group Case........");
							var invitees = ChapterData.LaunchSettings.Invitees ? ChapterData.LaunchSettings.Invitees : [];
							chapter__sendInvitations(ChapterData , invitees , req);
							Chapter.update({_id:__chapterId},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"ME"}} , {multi:false}, function(err,numAffected){
								if(err){
									var response = {
										status: 501,
										message: "Something went wrong."
									}
									console.log("129-------------",response)
								}else{
									var response = {
										status: 200,
										message: "Chapter has been launched successfully.",
										result : results
									}
									console.log(response);
								}
							});
							break;
							
						case "private" : 
							console.log("No need to do anything.. It's private area.");
							Chapter.update({_id:__chapterId},{$set:{IsLaunched:true , "LaunchSettings.MakingFor":"ME"}} , {multi:false}, function(err,numAffected){
								if(err){
									var response = {
										status: 501,
										message: "Something went wrong."
									}
									console.log("130-------------",response)
								}else{
									var response = {
										status: 200,
										message: "Chapter has been launched successfully.",
										result : results
									}
									console.log(response);
								}
							});
							break;
							
						default : 
							console.log("Error on ShareMode = ",ShareMode);
							var response = {
								status: 501,
								message: "Something went wrong."
							}
							console.log("131-------------",response);
							//return;
					}
					
					console.log("loop = "+loop+" ---results.length - 1 = "+results.length - 1);

					if( loop == results.length - 1 ){
						var setData = {};
						switch( MakingFor ){
							case "ME":
								setData = {
									IsPublished:true, 
									IsLaunched:true
								}
								break;
								
							case "OTHERS":
								setData = {
									IsPublished:true
								}
								break;
							
							case "SUBSCRIBERS":
								setData = {
									IsPublished:true
								}
								break;
								
							default:
							
								console.log("ERROR--------------9798875765764564544654");
						}

						console.log("setData = ",setData);
						Capsule.update({_id:__capsuleId},{$set:setData} , {multi:false}, function(err,numAffected){
							if( !err ){
								var response = {
									status: 200,
									message: "Capsule has been published successfully.",
									result : results
								}
								res.json(response);
							}
							else{
								var response = {
									status: 501,
									message: "Something went wrong."
								}
								console.log("133-------------",response);
							}
						});
					}
				}
			}
			else{
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
	});

}

var publish = function(req,res){
	console.log('getting here----------capsule publish api');
	
	var __capsuleId = req.headers.capsule_id ? req.headers.capsule_id : '0';
	var makingFor = req.body.makingFor ? req.body.makingFor : 'ME';
	var participation = req.body.participation ? req.body.participation : 'private';
	var title = req.body.title ? req.body.title : "Untitled Capsule";
	
	var conditions = {};
	conditions._id = __capsuleId;
	
	var setData = {
		'LaunchSettings.Audience' : makingFor,
		'LaunchSettings.ShareMode' : participation, 
		'Title' : title
	};
	
	Capsule.update(conditions,{$set:setData},{multi:false},function(err,numAffected){
		if (!err) {
			switch( makingFor ){
				case "ME" : 
					//making it for	ME/myself - Launch associated chapters ie. send invitations and update the IsLaunched Key to true.
					//chapterLaunchEngine(__capsuleId , makingFor , req , res);
					capsuleLaunchEngine(__capsuleId , makingFor , req , res);
					break;
					
				case "OTHERS":
					//making it for	OTHERS - update the IsLaunched Key to false - Owner will Launch it later.
					//chapterLaunchEngine(__capsuleId , makingFor , req , res);
					capsuleLaunchEngine(__capsuleId , makingFor , req , res);
					break;
				
				case "SUBSCRIBERS":
					//making it for	SUBSCRIBERS - update the IsLaunched Key to false - Owner/subscibers will Launch it later.
					capsuleLaunchEngine(__capsuleId , makingFor , req , res);
					
					break;
					
				default :
					console.log("------WRONG CASE FOUND ERROR : MakingFor-------");
					
			}
		}
		else{
		
		}
	});
}

/*________________________________________________________________________
   * @Date:      		21 October 2015
   * @Method :   		capsule__checkCompleteness
   * Created By: 		smartData Enterprises Ltd
   * Modified On:		-
   * @Purpose:   	
   * @Param:     		2
   * @Return:    	 	yes
   * @Access Category:	"UR"
_________________________________________________________________________
*/

var __getObjArrayIdxByKey = function (ObjArr , matchKey , matchVal){
	var idx;
	for( var loop = 0; loop < ObjArr.length; loop++ ){
		var data = ObjArr[loop];
		if (data.hasOwnProperty(matchKey)) {
			if(data[matchKey] == matchVal){
				idx = loop;
				break;
			}
		}
	}
	return idx;
}

var capsule__checkCompleteness = function ( req , res ){
	Capsule.find({_id : req.headers.capsule_id , Status : true, IsDeleted : false},{_id : true},function( err , result ){
		if( !err ){
			if( result.length ){
				var conditions = {
					CapsuleId : req.headers.capsule_id,
					Status : 1,
					IsDeleted : 0
				};
				
				var fields = {_id : true}; 
				Chapter.find(conditions , fields , function( err , results ){
					if( !err ){
						if( results.length ){
							var chapter_ids = [] , temp_cIds = [];
							for(var loop = 0; loop < results.length; loop++){
								chapter_ids.push(results[loop]._id);
								temp_cIds.push(String(results[loop]._id));
							}
							console.log("chapter_ids = ", temp_cIds);
							if( chapter_ids.length ){
								var conditions = {
									ChapterId : { $in : temp_cIds },
									//Status : 1,
									IsDeleted : 0
								};
								
								var fields = {
									_id : false, 
									ChapterId : true
								}; 
								
								
								Page.find(conditions , fields , function( err , result ){
									if( !err ){
										//var result = new Array(result);
										var resultArr = [];
										for( var loop = 0; loop < result.length; loop++ ){
											resultArr[loop] = {ChapterId : result[loop].ChapterId};
										}										
										
										console.log(resultArr.length+ "---------- >= --------------" +chapter_ids.length);
										if( resultArr.length && resultArr.length >= chapter_ids.length){
											var flag = true;
											for( var loop = 0; loop < chapter_ids.length; loop++ ){
												var idx = __getObjArrayIdxByKey(resultArr , 'ChapterId' , chapter_ids[loop]);
												if(idx >= 0){
													continue;
												}
												else{
													flag = false;
													break;
												}
											}
											
											if( flag ){
												var response = {
													status: 200,
													message: "Capsule is complete to publish."
												}
												res.json(response);
											}
											else{
												console.log("--------------------------------------4");
												var response = {
													status: 400,
													message: "Error : You can not publish an incomplete capsule. It seems like you have atleast one chapter without page. Go back and add atleast a page into that empty chapter or simply delete that and try publishing it again." 
												}
												res.json(response);
											}
										}
										else{
											console.log("--------------------------------------3");
											var response = {
												status: 400,
												message: "Error : You can not publish an incomplete capsule. It seems like you have atleast one chapter without page. Go back and add atleast a page into that empty chapter or simply delete that and try publishing it again." 
											}
											res.json(response);
										}
									}
									else{
										var response = {
											status: 501,
											message: "Something went wrong." 
										}
										res.json(response);
									}
								})
							}
							else{
								console.log("--------------------------------------2");
								var response = {
									status: 400,
									message: "Error : You can not publish an incomplete capsule. It seems like you have no chapter under this capsule. Go back and add atleast a chapter and a page under this capsule and try publishing it again." 
								}
								res.json(response);
							}
						}
						else{
							console.log("--------------------------------------1");
							var response = {
								status: 400,
								message: "Error : You can not publish an incomplete capsule. It seems like you have no chapter under this capsule. Go back and add atleast a chapter and a page under this capsule and try publishing it again." 
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
				});
			}
			else{
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
	});
}

//Capsules In the making Apis
exports.getChapters = getChapters;
exports.find = find;
exports.saveAndLaunch = saveAndLaunch;
exports.publish = publish;

exports.capsule__checkCompleteness = capsule__checkCompleteness;