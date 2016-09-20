var media = require('./../models/mediaModel.js');
var user = require('./../models/userModel.js');
var formidable = require('formidable');
var fs = require('fs');
var mongoose = require('mongoose');

//var media1 = require('./../models/media1Model.js');
//var userMedia = require('./../models/userMediaModel.js');

var media_m3 = require('./../models/mediaM3Model.js');

//var media_m3 = require('./../models/mediaModel.js');

var GroupTag = require('./../models/groupTagsModel.js');

/*
	Media Search Engine :
  - Media Searching & Ranking according to Media Score 
	& best matched FSGs criteria 

*/
var search_v_3 = function( req , res ){
	//console.log("okok.....");
	//console.log(JSON.stringify(req.session.user));
	/*
	if( req.session.user._id != 'undefined' && req.session.user.userFsgs != 'undefined' ){
		req.query.login_user_id = req.session.user._id;
		req.query.userFsgs = req.session.user.FSGs;
	}
	else{
		req.render('layouts/frontend/frontLayout.html');
	}
	*/
	/*
	req.query.inputData = {
                "inputData":{
                        "groupTagID":"53d0a0f18dfd23c40e918395",
                        "login_user_id":"837633465",
                        "userFsgs":{
                                "Gender":"Male",
                                "Age":"20-30",
                                "Country":"Europe",
                                "Relations":"Self",
                                "RelationStatus":"Single",
                                "AttractedTo":"Female",
                                "PlatformSegments":"Experts",
                                "Media":"All",
                                "FanClubs":"Football",
                                "Privacy":"Public"
                        }
                }
        };
	*/
	if( req.body.inputData == 'undefined'  ){
		req.json({"error":"wrong input"});
	}
	else{
		//console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagId = req.body.inputData.groupTagID;
	var login_user_id = req.body.inputData.login_user_id;
	var mediaTitle = "";
	if( req.body.inputData.Title != 'undefined' )
		mediaTitle = req.body.inputData.Title;
	var limit = 1000;	
    if( req.body.inputData.Title != 'undefined' )
		limit = req.body.inputData.limit;			
		
	var userFsgs = req.body.inputData.userFsgs;
	
	var searchObj = {};
	searchObj.map = function(){
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};//{thisObj_id:{SelectsFSGCount:bestMatchedCount , SelectsCount:occurrences}};
		
		//finalObj.SelectsBestFSGCount = 0;
		//finalObj.SelectsCount = 0;
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = thisObj.ViewsCount;
		finalObj.MediaScore = 0;
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		
		var actionObj = {};
		var result = {};
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		//actionObj = {"Users":[]};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		if(actionObj.Users){
			for(var idx = 0; idx < actionObj.Users.length; idx++ ){
				if(actionObj.Users[idx].UserFSGs){
					itemObj = actionObj.Users[idx].UserFSGs;
					var temp = {};
					var countN = 0;
					for( var attrName in loginUsrFsgs ){
						if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
							temp[attrName] = loginUsrFsgs[attrName];
							countN += 1;
						}
					}
					objToMap.push(countN);
				}
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		 //result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		
		objToMap = [];
		if(actionObj.Users){
			for(var idx = 0; idx < actionObj.Users.length; idx++ ){
				if(actionObj.Users[idx].UserFSGs){
					itemObj = actionObj.Users[idx].UserFSGs;
					var temp = {};
					var countN = 0;
					for( var attrName in loginUsrFsgs ){
						if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
							temp[attrName] = loginUsrFsgs[attrName];
							countN += 1;
						}
					}
					objToMap.push(countN);
				}
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		 
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//searchObj.query = { "GroupTags.GroupTagID" : "53d0a0f18dfd23c40e918395" };
	searchObj.query = { "GroupTags.GroupTagID" : groupTagId };
	//searchObj.sort = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs 
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	//var outCollection = "m3_out";
	searchObj.out = {replace: outCollection};
	media_m3.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		userMedia_userIdmodel.find({}).sort({'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1}).limit(48).exec(function (err,result) { // Save
			if (err) {
				console.log(err);
				res.json({"status":"error"});
			}
			else{
				res.json(result);
			}
		});
	})
}

exports.search_v_3 = search_v_3;


var search_v_4 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined || req.session.user.FSGs != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.session.user.FSGs
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	var mediaTitle = "";
	if( req.body.inputData.Title != 'undefined' )
		mediaTitle = req.body.inputData.Title;
	var limit = 1000;	
    if( req.body.inputData.Title != 'undefined' )
		limit = req.body.inputData.limit;			
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		finalObj.MediaScore = 0;
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;			
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		 
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2} };
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs 
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	//media_m3.mapReduce(searchObj,function(err,result){
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		userMedia_userIdmodel.find({}).sort({'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1}).limit(48).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log(result[0]);
				res.json({"status":"success","results":result});
				return;
			}
		});
	})
}
exports.search_v_4 = search_v_4;

//with user-score
var search_v_5_back = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
			
		userMedia_userIdmodel.find({}).sort(sortObj).limit(48).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				//console.log(result[0]);
				res.json({"status":"success","results":result});
				return;
			}
		});
	})
}
exports.search_v_5_back = search_v_5_back;


//with user-score
var search_v_5 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2}};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	
	if(mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"MediaType":mediaType};
	
	if(mediaTitle && mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
			
		userMedia_userIdmodel.find({}).sort(sortObj).limit(48).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				//console.log(result[0]);
				res.json({"status":"success","results":result});
				return;
			}
		});
	})
}
exports.search_v_5 = search_v_5;


//with user-score api version for demo
var search_v_5_api = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	var mediaTitle = "";
	if( req.body.inputData.Title != 'undefined' )
		mediaTitle = req.body.inputData.Title;
	var limit = 1000;	
    if( req.body.inputData.Title != 'undefined' )
		limit = req.body.inputData.limit;			
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2} };
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};;
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
			
		userMedia_userIdmodel.find({}).sort(sortObj).limit(48).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log(result[0]);
				res.json({"status":"success","results":result});
				return;
			}
		});
	})
}
exports.search_v_5_api = search_v_5_api;


/*
	Action : search api with all media : if available media under the group tag is less than limit 
			 then It will fill limit by sending last modified media.
	AddedOn : 28/11/2014
*/

//with user-score
var search_v_6 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2}};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	
	if(mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"MediaType":mediaType};
	
	if(mediaTitle && mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		var pageLimit = 48;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				__fullfillMediaLimit(result , pageLimit , mediaType , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}
exports.search_v_6 = search_v_6;

var __fullfillMediaLimit = function(result , pageLimit , mediaType , res){
	console.log("---------__fullfillMediaLimit-----");
	var outputRecords = [];
	var newLimit = 0;
	
	var outputRecords = result;
	console.log("outputRecords.length = ",outputRecords.length);
	//console.log("outputRecords.length = ",outputRecords);return;
	
	if( outputRecords.length < pageLimit ){
		newLimit = parseInt(pageLimit - result.length);
		
		console.log("---------In __fullfillMediaLimit if block-----newLimit = ",newLimit);
		var sortObj = {UploadedOn:-1};
		var fields = {};
		fields = {
			_id:1,
			Title:1,
			Prompt:1,
			Locator:1,
			Location:1,
			MediaType:1,
			ContentType:1,
			UploadedOn:1,
			UploaderID:1,
			Content:1,
			UploadedBy:1,
			thumbnail:1
		};
		
		var conditions = {};
		//conditions = {Status:1,IsDeleted:0};
		conditions.Status = 1;
		//conditions.UploadedOn = 'desc';
		if( mediaType ){
			//conditions = {Status:1,IsDeleted:0,MediaType:mediaType};
			conditions.MediaType = mediaType;
		}
		
		//Remove already selected media
		var selectedMediaIds = [];
		for( var loop = 0; loop < outputRecords.length; loop++ ){
			if( outputRecords[loop]._id )
				selectedMediaIds.push(outputRecords[loop]._id);
				conditions._id = {$nin : selectedMediaIds};
		}
		//console.log("selectedMediaIds = ",selectedMediaIds);//return;
		//conditions = { Status:1, MediaType:mediaType, _id:{$nin : selectedMediaIds} };
		//console.log("conditions = ",conditions);return;
		//End Remove already selected media
		
		media.find(conditions,fields).sort(sortObj).limit(newLimit).exec(function (err,results) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log(results);
				//change media object structure
				for( var loop = 0; loop < results.length; loop++ ){
					console.log("single - ",results[loop])
					var tempObj = {};
					tempObj = results[loop].toObject();
					if( tempObj.Location[0].URL ){
						tempObj.URL = tempObj.Location[0].URL;
					}
					
					var requiredObj = {};
					requiredObj._id = tempObj._id;
					requiredObj.value = tempObj;
					
					
					if(requiredObj.value.Location[0].URL){
						requiredObj.value['URL'] = requiredObj.value.Location[0].URL;
					}
					outputRecords.push(requiredObj);
				}
				
				//return outputRecords;
				//console.log(results[0]);
				res.json({"status":"success","results":outputRecords});
				return;
			}
		});
	}
	else{
		res.json({"status":"success","results":outputRecords});
		return;
	}
};


var establishedModels = {};
function createModelForName(name) {
	if (!(name in establishedModels)) {
		var Any = new mongoose.Schema(
										{ 
											_id: {type:String},
											value:{
													id : {type:mongoose.Schema.Types.ObjectId},
													userId : {type:mongoose.Schema.Types.ObjectId},
													UserScore : {type:Number},
													MediaScore : {type:Number},
													Title : {type:String},
													Prompt : {type:String},
													Locator : {type:String},
													URL : {type:String},
													MediaType:{type:String},
													ContentType:{type:String},
													UploadedOn:{type:Date},
													count : {type:String}
												}
										}, 
										{ collection: name }
									);
		establishedModels[name] = mongoose.model(name, Any);
	}
	return establishedModels[name];
}



/*
	Action : search api with all media : if available media under the group tag is less than limit 
			 then It will fill limit by sending last modified media.
	AddedOn : 27/01/2015
*/

//with user-score
var search_v_7 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2}};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	
	if(mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"MediaType":mediaType};
	
	if(mediaTitle && mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}
exports.search_v_7 = search_v_7;

/*
	Action : search api with all media : if available media under the group tag is less than limit 
			 then It will fill limit by sending last modified media.
	AddedOn : 27/01/2015
	UpdatedOn: 05/02/2015 - With IsPrivate Status Check!
*/

//with user-score
var search_v_8 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	//console.log('----------------here--------------------');return false;
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1}};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i')};
	
	if(mediaType == 'Image'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}]};
	}
	else if(mediaType == 'Link'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Link',"LinkType":{$ne:'image'}};
	}
	else if(mediaType == 'Notes'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Notes'};
	}
	else if(mediaType == 'Montage'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Montage'};
	}
	else{	
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1}};	
	}
	
	
	if(mediaTitle && mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}

var search_v_8_revised = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"IsDeleted":0};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"IsDeleted":0};
	
	if(mediaType == 'Image'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}],"IsDeleted":0};
	}
	else if(mediaType == 'Link'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Link',"LinkType":{$ne:'image'},"IsDeleted":0};
	}
	else if(mediaType == 'Notes'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Notes',"IsDeleted":0};
	}
	else if(mediaType == 'Montage'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Montage',"IsDeleted":0};
	}
	else{
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"IsDeleted":0};	
	}
	
	
	if(mediaTitle && mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType,"IsDeleted":0};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}

//changed query Status:{$ne:2}-------->Status:1 on 03042015 by manishp
var search_v_8_revised_2 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"IsDeleted":0};
	
	if(mediaType == 'Image'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}],"IsDeleted":0};
	}
	else if(mediaType == 'Link'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"MediaType":'Link',"LinkType":{$ne:'image'},"IsDeleted":0};
	}
	else if(mediaType == 'Notes'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"MediaType":'Notes',"IsDeleted":0};
	}
	else if(mediaType == 'Montage'){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"MediaType":'Montage',"IsDeleted":0};
	}
	else{
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};	
	}
	
	
	if(mediaTitle && mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType,"IsDeleted":0};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}


var search_v_8_revised_3 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	//var mediaType = "";
	var mediaType = [];		//multiple selection case : updated on 30042015
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"IsDeleted":0};
	
	var mTypeArr = [];
	
	if( mediaType.length ){
		for( var loop = 0; loop < mediaType.length; loop++ ){
			if(mediaType[loop] == 'Image'){
				mTypeArr.push({$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}]});
			}
			else if(mediaType[loop] == 'Link'){
				mTypeArr.push({"MediaType":'Link',"LinkType":{$ne:'image'}});
			}
			else if(mediaType[loop] == 'Notes'){
				mTypeArr.push({"MediaType":'Notes'});
			}
			else if(mediaType[loop] == 'Montage'){
				mTypeArr.push({"MediaType":'Montage'});
			}
			else{
				//no case
				console.log("------Something went wrong with the mediaType query parameters------",mediaType);
			}
		}
	}
	
	console.log("---------------mTypeArr-------------",mTypeArr);//return;
	
	if( mTypeArr.length ){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},$or:mTypeArr,"IsDeleted":0};
		//searchObj.query["$and"] = mTypeArr;
	}
	else{
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};	
	}
	
	
	if(mediaTitle){
		//searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType,"IsDeleted":0};
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),$or:mTypeArr,"IsDeleted":0};
	}
		
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				//__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				__fullfillMediaLimit_3(result , pageLimit , mTypeArr , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}

// 1) equal , 2) Like and 3) FullfillLimit
var search_v_8_revised_4 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	//var mediaType = "";
	var mediaType = [];		//multiple selection case : updated on 30042015
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj._id = thisObj._id;			//fixed on 08042016 by manishp - was giving problem on createSearch Gallery manageSelection.
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"IsDeleted":0};
	
	var mTypeArr = [];
	
	if( mediaType.length ){
		for( var loop = 0; loop < mediaType.length; loop++ ){
			if(mediaType[loop] == 'Image'){
				mTypeArr.push({$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}]});
			}
			else if(mediaType[loop] == 'Link'){
				mTypeArr.push({"MediaType":'Link',"LinkType":{$ne:'image'}});
			}
			else if(mediaType[loop] == 'Notes'){
				mTypeArr.push({"MediaType":'Notes'});
			}
			else if(mediaType[loop] == 'Montage'){
				mTypeArr.push({"MediaType":'Montage'});
			}
			else{
				//no case
				console.log("------Something went wrong with the mediaType query parameters------",mediaType);
			}
		}
	}
	
	console.log("---------------mTypeArr-------------",mTypeArr);//return;
	
	if( mTypeArr.length ){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},$or:mTypeArr,"IsDeleted":0};
		//searchObj.query["$and"] = mTypeArr;
	}
	else{
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};	
	}
	
	
	if(mediaTitle){
		//searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType,"IsDeleted":0};
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),$or:mTypeArr,"IsDeleted":0};
	}
		
		
	console.log('----query-----',searchObj.query);
	
	//fixing 
		
	searchObj.query.MetaMetaTags = "5464931fde9f6868484be3d7";
	console.log("searchObj.query---------------",searchObj.query);//return;
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				//console.log("result = ",result);
				//__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				__fullfillMediaLimit_LIKECASE(result , pageLimit , mTypeArr , res , groupTagID);
				//__fullfillMediaLimit_3(result , pageLimit , mTypeArr , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}

//upgrading from search_v_8_revised_4
// 1) equal , 2) Like and 3) FullfillLimit 
//updates - updating it with different choices of preferred media of the gallery
var search_v_8_revised_5 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	//var mediaType = "";
	var mediaType = [];		//multiple selection case : updated on 30042015
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj._id = thisObj._id;			//fixed on 08042016 by manishp - was giving problem on createSearch Gallery manageSelection.
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"IsDeleted":0};
	
	var mTypeArr = [];
	
	if( mediaType.length ){
		for( var loop = 0; loop < mediaType.length; loop++ ){
			if(mediaType[loop] == 'Image'){
				mTypeArr.push({$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}]});
			}
			else if(mediaType[loop] == 'Link'){
				mTypeArr.push({"MediaType":'Link',"LinkType":{$ne:'image'}});
			}
			else if(mediaType[loop] == 'Notes'){
				mTypeArr.push({"MediaType":'Notes'});
			}
			else if(mediaType[loop] == 'Montage'){
				mTypeArr.push({"MediaType":'Montage'});
			}
			else{
				//no case
				console.log("------Something went wrong with the mediaType query parameters------",mediaType);
			}
		}
	}
	
	console.log("---------------mTypeArr-------------",mTypeArr);//return;
	
	if( mTypeArr.length ){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},$or:mTypeArr,"IsDeleted":0};
		//searchObj.query["$and"] = mTypeArr;
	}
	else{
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};	
	}
	
	
	if(mediaTitle){
		//searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType,"IsDeleted":0};
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),$or:mTypeArr,"IsDeleted":0};
	}
		
		
	console.log('----query-----',searchObj.query);
	
	//fixing 
		
	searchObj.query.MetaMetaTags = "5464931fde9f6868484be3d7";
	console.log("searchObj.query---------------",searchObj.query);//return;
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
        
        
        //put a filter here which will by-pass as per the page media preference
        //1) ALL MEDIA
        //2) HAND_PICKED
        //3) BY THEMES
        //4) BY DESCRIPTORS
        //5) BY FILTERS
        //6) UPLOAD             -   private-set
        
        var mediaChoice = "all-media";      //["all-media" , "hand-picked" , by-themes , by-descriptors , by-filters , upload]
        switch(mediaChoice){
            case "all-media":
                console.log("mediaChoice----------------------------------",mediaChoice);
                //no need to do anything just by-pass
                
                break;
            case "hand-picked":
                console.log("mediaChoice----------------------------------",mediaChoice);
                //need to first fetch the selected media for the page. and then upate search query that the 
                //already selected media shhould not be there
                
                
                break;
            case "by-themes":
                console.log("mediaChoice----------------------------------",mediaChoice);
                //need to first fetch the selected media for the page. and then upate search query that the 
                //already selected media shhould not be there
                
                
                break;
            case "by-descriptors":
                console.log("mediaChoice----------------------------------",mediaChoice);
                //need to first fetch the selected media for the page. and then upate search query that the 
                //already selected media shhould not be there
                
                break;
            case "by-filters":
                console.log("mediaChoice----------------------------------",mediaChoice);
                //need to first fetch the selected media for the page. and then upate search query that the 
                //already selected media shhould not be there
                
                break;
            case "upload":
                console.log("mediaChoice----------------------------------",mediaChoice);
                //need to first fetch the selected media for the page. and then upate search query that the 
                //already selected media shhould not be there
                
                
                break;
            default : 
                console.log("Wrong mediaChoice-------000000000000000000987655444");
        }
        
        
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				//console.log("result = ",result);
				//__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				__fullfillMediaLimit_LIKECASE(result , pageLimit , mTypeArr , res , groupTagID);
				//__fullfillMediaLimit_3(result , pageLimit , mTypeArr , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}

// 1) equal , 2) Like and 3) FullfillLimit
//var search_v_8_revised_4 = function( req , res ){
var search_v_8_temp = function( req , res ){
//console.log("okok.....");
	console.log("Hi i am in function");
	// 
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}

	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	//var mediaType = "";
	var mediaType = [];		//multiple selection case : updated on 30042015
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj._id = thisObj._id;			//fixed on 08042016 by manishp - was giving problem on createSearch Gallery manageSelection.
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCgroupTagIDount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	//{$in:keywordsSelctedId , $nin:excludeTagId}	
	//==searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};
	//searchObj.query={"GroupTags.GroupTagID":{$in:keywordsSelctedId , $nin:excludeTagId},"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"IsDeleted":0};
	
	var mTypeArr = [];
	
	if( mediaType.length ){
		for( var loop = 0; loop < mediaType.length; loop++ ){
			if(mediaType[loop] == 'Image'){
				mTypeArr.push({$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}]});
			}
			else if(mediaType[loop] == 'Link'){
				mTypeArr.push({"MediaType":'Link',"LinkType":{$ne:'image'}});
			}
			else if(mediaType[loop] == 'Notes'){
				mTypeArr.push({"MediaType":'Notes'});
			}
			else if(mediaType[loop] == 'Montage'){
				mTypeArr.push({"MediaType":'Montage'});
			}
			else{
				//no case
				console.log("------Something went wrong with the mediaType query parameters------",mediaType);
			}
		}
	}
	
	//console.log("---------------mTypeArr-------------",mTypeArr);//return;
	
	if( mTypeArr.length ){
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},$or:mTypeArr,"IsDeleted":0};
		//searchObj.query["$and"] = mTypeArr;
	}
	else{
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};	
	}
	
	
	if(mediaTitle){
		//searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType,"IsDeleted":0};
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),$or:mTypeArr,"IsDeleted":0};
	}
		
		
	//console.log('----query-----',searchObj.query);
	
	//fixing start on 29042016
	var keywordsSelctedId = [];
	var addAnotherTagId = [];
	var excludeTagId = [];
	
	console.log("data of req.keywordsSelcted",req.body.keywordsSelcted);
	console.log("data of req.body.add",req.body.addAnotherTag);
	console.log("data of req.body.excludeTag",req.body.excludeTag);
	//return
	for(var i=0;i< req.body.keywordsSelcted.length;i++){
		keywordsSelctedId.push(req.body.keywordsSelcted[i].id);	
	}
	for(var i=0;i< req.body.addAnotherTag.length;i++){
		addAnotherTagId.push(req.body.addAnotherTag[i].id);	
	}
	for(var i=0;i< req.body.excludeTag.length;i++){
		excludeTagId.push(req.body.excludeTag[i].id);	
	}
	
	//if(addAnotherTagId){
	//	keywordsSelctedId.concat(addAnotherTagId);
	//}
	
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":1,"IsPrivate":{$ne:1},"IsDeleted":0};
	searchObj.query= {"GroupTags.GroupTagID": { $and: [{$in: keywordsSelctedId },{$in: addAnotherTagId }], $nin:excludeTagId}};
	
	searchObj.query= {$and:[{"GroupTags.GroupTagID": {$in: keywordsSelctedId}},{"GroupTags.GroupTagID":{$in:addAnotherTagId}},{"GroupTags.GroupTagID":{$nin:excludeTagId}}]}
	//fixing end on 29042016
	
	searchObj.query.MetaMetaTags = "5464931fde9f6868484be3d7";
	console.log("searchObj.query ---------------",searchObj.query);//return;
	
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---");
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				//console.log("result = ",result);
				//__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				__fullfillMediaLimit_LIKECASE(result , pageLimit , mTypeArr , res , groupTagID);
				//__fullfillMediaLimit_3(result , pageLimit , mTypeArr , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}

//exports.search_v_8 = search_v_8;
//exports.search_v_8 = search_v_8_revised;
//exports.search_v_8 = search_v_8_revised_3;



//exports.search_v_8 = search_v_8_revised_4;
exports.search_v_8_temp = search_v_8_temp;

//exports.search_v_8 = search_v_8_revised_3;


var __fullfillMediaLimit_LIKECASE = function(result , pageLimit , mediaType , res , groupTagID){
	console.log("---------__fullfillMediaLimit_LIKECASE-----");
	GroupTag.findOne(groupTagID , function( err , data ){
		if( !err ){
			var partiallyMatchedKeywords = [];
			GroupTag.find({GroupTagTitle:new RegExp(data.GroupTagTitle, 'i'),status:{$in:[1,3]}} , {_id:1} , function( err , data ){
				if( !err ){
					for( var loop = 0; loop < data.length; loop++ ){
						partiallyMatchedKeywords.push(data[loop]._id);	
					}
					
					var outputRecords = [];
					var newLimit = 0;
					
					var outputRecords = result;
					console.log("outputRecords.length = ",outputRecords.length);
					//console.log("outputRecords.length = ",outputRecords);return;
					
					var conditions = {};
					conditions.GroupTags = [];
					//conditions.GroupTags.GroupTagID = "";
					conditions.GroupTags.GroupTagID = {};
					conditions.GroupTags.GroupTagID.$in = [];
					//conditions = {Status:1,IsDeleted:0};
					conditions.IsDeleted = 0;
					conditions.Status = 1;
					conditions.IsPrivate = {$ne:1};
					//conditions.UploadedOn = 'desc';
					if( mediaType.length ){
						//conditions = {Status:1,IsDeleted:0,MediaType:mediaType};
						conditions.$or = mediaType;
					}
					
					conditions.GroupTags.GroupTagID.$in = partiallyMatchedKeywords;
					
					console.log( "-------conditions----------",conditions );
					var mediaCount = 0;
					
					conditions.MetaMetaTags = "5464931fde9f6868484be3d7";
					
					//get count of all media records
					media.find(conditions).count().exec(function (err,results) { // Save
						if (err) {
							console.log("-------09876--------",err)
							res.json({"status":"error","message":err});
							return;
						}
						else{
							mediaCount = results;
							console.log("mediaCount = ",mediaCount);//return;
							if( outputRecords.length < pageLimit ){
								newLimit = parseInt(pageLimit - result.length);
								
								console.log("---------In __fullfillMediaLimit if block-----newLimit = ",newLimit);
								var sortObj = {MediaScore:-1,UploadedOn:-1};
								var fields = {};
								fields = {
									_id:1,
									Title:1,
									Prompt:1,
									Locator:1,
									Location:1,
									MediaType:1,
									ContentType:1,
									UploadedOn:1,
									UploaderID:1,
									Content:1,
									UploadedBy:1,
									thumbnail:1
								};
								
								//Remove already selected media
								var selectedMediaIds = [];
								for( var loop = 0; loop < outputRecords.length; loop++ ){
									if( outputRecords[loop]._id )
										selectedMediaIds.push(outputRecords[loop]._id);
										conditions._id = {$nin : selectedMediaIds};
								}
								//console.log("selectedMediaIds = ",selectedMediaIds);//return;
								//conditions = { Status:1, MediaType:mediaType, _id:{$nin : selectedMediaIds} };
								//console.log("conditions = ",conditions);return;
								//End Remove already selected media
								
								conditions.MetaMetaTags = "5464931fde9f6868484be3d7";
								
								media.find(conditions,fields).sort(sortObj).limit(newLimit).exec(function (err,results) { // Save
									if (err) {
										console.log("-------999999--------",err)
										res.json({"status":"error","message":err});
										return;
									}
									else{
										if( !results.length ){
											console.log("NO RESULTS---------------");
											//return false;
										}
										//console.log(results);
										//change media object structure
										for( var loop = 0; loop < results.length; loop++ ){
											//console.log("single - ",results[loop])
											var tempObj = {};
											tempObj = results[loop].toObject();
											if( tempObj.Location[0].URL ){
												tempObj.URL = tempObj.Location[0].URL;
											}
											
											var requiredObj = {};
											requiredObj._id = tempObj._id;
											requiredObj.value = tempObj;
											
											
											if(requiredObj.value.Location[0].URL){
												requiredObj.value['URL'] = requiredObj.value.Location[0].URL;
											}
											outputRecords.push(requiredObj);
										}
										
										//return outputRecords;
										//console.log(results[0]);
										__fullfillMediaLimit_3(outputRecords , pageLimit , mediaType , res);
										
										/*
										res.json({"status":"success","results":outputRecords,"mediaCount":mediaCount});
										return;
										*/
									}
								});
							}
							else{
								__fullfillMediaLimit_3(outputRecords , pageLimit , mediaType , res);
								//res.json({"status":"success","results":outputRecords,"mediaCount":mediaCount});
								//return;
							}
							
						}
					});
					
					
				}
			});
		}
	})
	
};



/*
	Action : search api with all media : if available media under the group tag is less than limit 
			 then It will fill limit by sending last modified media.
	AddedOn : 27/01/2015
	UpdatedOn: 05/02/2015 - Multiple FSGs Case!
*/

//with user-score
var search_v_9 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"groupTagID":req.body.groupTagID,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var groupTagID = req.body.inputData.groupTagID;
	console.log("jhsdgfsjhg"+groupTagID);
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}

	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		var arrayIntersection = function () {
			var val, arrayCount, firstArray, i, j, intersection = [], missing;
			var arrays = Array.prototype.slice.call(arguments); 
			firstArr = arrays.pop();
			if (firstArr) {
				j = firstArr.length;
				arrayCount = arrays.length;
				while (j--) {
					val = firstArr[j];
					missing = false;
					i = arrayCount;
					idx = null;
					while (!missing && i--) {
						idx = arrays[i].indexOf(val);
						if ( !arrayContains(arrays[i], val) ) {
							missing = true;
						}
					}
					if (!missing) {
						intersection.push(idx);
					}
				}
			}
			return intersection;
		}
		
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				
				var matchedFsgWeight = 0;
				
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && ( itemObj[attrName] != '' || itemObj[attrName] != null ) ){
						var array1 = [];
						var array2 = [];
						var arrayIntersection = [];
						
						array1 = itemObj[attrName].split(',');
						array2 = loginUsrFsgs[attrName].split(',');
						
						//get the matched/common values 
						arrayIntersection = intersect( array1 , array2 );
						matchedFsgWeight += arrayIntersection.length; //get weight of the matched values - multiple case!
						
						countN += 1; //This count will tell the BestMatchedFSGs at last.
					}
				}
				
				//objToMap.push(countN);
				objToMap.push( { "MatchedCount":countN , "MatchedFsgWeight":matchedFsgWeight } );
			}
		}

		objToMapSorted = [];
		//objToMapSorted = objToMap.sort();
		objToMapSorted = objToMap.sort(function( a , b ){
			return b.MatchedCount - a.MatchedCount || b.MatchedFsgWeight - a.MatchedFsgWeight;
		});

		bestMatchedCount = 0;
		bestMatchedFsgWeight = 0;
		
		if(objToMap.length){
			//bestMatchedCount = Array.max(objToMap);
			bestMatchedCount = objToMapSorted[0].MatchedCount;
			bestMatchedFsgWeight = objToMapSorted[0].MatchedFsgWeight;
		}

		occurrences = 0;

		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			//if(  objToMapSorted[occIdx] == bestMatchedCount ){
			if(  objToMapSorted[occIdx].MatchedCount == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		//result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences , actionWeightCount:bestMatchedFsgWeight};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		finalObj.PostsBestFSGWeigthCount = result.actionWeightCount;
				
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				
				var matchedFsgWeight = 0;
				
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && ( itemObj[attrName] != '' || itemObj[attrName] != null ) ){
						var array1 = [];
						var array2 = [];
						var arrayIntersection = [];
						
						array1 = itemObj[attrName].split(',');
						array2 = loginUsrFsgs[attrName].split(',');
						
						//get the matched/common values 
						arrayIntersection = intersect( array1 , array2 );
						matchedFsgWeight += arrayIntersection.length; //get weight of the matched values - multiple case!
						
						countN += 1; //This count will tell the BestMatchedFSGs at last.
					}
				}
				
				//objToMap.push(countN);
				objToMap.push( { "MatchedCount":countN , "MatchedFsgWeight":matchedFsgWeight } );
			}
		}

		objToMapSorted = [];
		//objToMapSorted = objToMap.sort();
		objToMapSorted = objToMap.sort(function( a , b ){
			return b.MatchedCount - a.MatchedCount || b.MatchedFsgWeight - a.MatchedFsgWeight;
		});

		bestMatchedCount = 0;
		bestMatchedFsgWeight = 0;
		
		if(objToMap.length){
			//bestMatchedCount = Array.max(objToMap);
			bestMatchedCount = objToMapSorted[0].MatchedCount;
			bestMatchedFsgWeight = objToMapSorted[0].MatchedFsgWeight;
		}

		occurrences = 0;

		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			//if(  objToMapSorted[occIdx] == bestMatchedCount ){
			if(  objToMapSorted[occIdx].MatchedCount == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences , actionWeightCount:bestMatchedFsgWeight};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		finalObj.StampsBestFSGWeigthCount = result.actionWeightCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1}};
	if(mediaTitle)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i')};
	
	if(mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":mediaType};
	
	if(mediaTitle && mediaType)
		searchObj.query={"GroupTags.GroupTagID":groupTagID,"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}
exports.search_v_9 = search_v_9;

var search_by_descriptor = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"searchBy":req.body.searchBy,
				"descValue":req.body.descValue,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var descValue = "909089";
	
	descValue = req.body.inputData.descValue;
	
	console.log("descValue = ",descValue);
	
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}
	
	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"IsDeleted":0};
	if(mediaTitle)
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"IsDeleted":0};
	
	if(mediaType == 'Image'){
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}],"IsDeleted":0};
	}
	else if(mediaType == 'Link'){
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Link',"LinkType":{$ne:'image'},"IsDeleted":0};
	}
	else if(mediaType == 'Notes'){
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Notes',"IsDeleted":0};
	}
	else if(mediaType == 'Montage'){
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Montage',"IsDeleted":0};
	}
	else{
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"IsDeleted":0};	
	}
	
	
	if(mediaTitle && mediaType)
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType,"IsDeleted":0};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}

//added on 30042015 - multiple case
var search_by_descriptor_v2 = function( req , res ){
	//console.log("okok.....");
	if(req.session.user){
		console.log("Session is set!");
		console.log(JSON.stringify(req.session.user));
		if( req.session.user._id != undefined ){
			//continue;
			//req.query.login_user_id = req.session.user._id;
			//req.query.userFsgs = req.session.user.FSGs;
		}
		else{
			res.json({"status":"error","message":"Access Denied"});
			return;
		}
	}
	else{
		res.json({"status":"error","message":"Access Denied"});
		return;
	}
	
	req.body.inputData = {
				"searchBy":req.body.searchBy,
				"descValue":req.body.descValue,
				"login_user_id":req.session.user._id,
				"userFsgs":req.body.userFSGs,
				"powerUserCase":req.body.powerUserCase
			};
	//console.log("INPUT : "+req.body.inputData);
	if( req.body.inputData == 'undefined'  ){
		req.json({"status":"error","message":"wrong input"});
		return;
	}
	else{
		console.log("inputData : "+JSON.stringify(req.body.inputData));
	}
	
	var descValue = "909089";
	
	descValue = req.body.inputData.descValue;
	
	console.log("descValue = ",descValue);
	
	var login_user_id = req.body.inputData.login_user_id;
	
	//for searching on Title 'LIKE'
	var mediaTitle = "";
	if(req.body.title)
		mediaTitle = req.body.title;
	
	//for searching on MediaType
	var mediaType = "";
	if(req.body.mediaType)
		mediaType = req.body.mediaType;
	
	/*limit : not for MR
	var limit = 1000;	
    if( req.body.inputData.limit != 'undefined' )
		limit = req.body.inputData.limit;			
	*/
	
	var userFsgs = {};
	if(req.body.inputData.userFsgs)	
		userFsgs = req.body.inputData.userFsgs;
	
	var powerUserCase = 0;
	if(req.body.inputData.powerUserCase)	
		powerUserCase = 1;

	//show more pagination code
	var page = 1;
	if( req.body.page ){
		page = parseInt(req.body.page);
	}
	
	var per_page = 48;
	if( req.body.per_page ){
		per_page = parseInt(req.body.per_page);
	}
	
	//show more pagination code	
		
	var searchObj = {};
	searchObj.map = function(){
		/*
		var loginUsrFsgs = {
			"Gender":"Male",
			"Age":"20-30",
			"Country":"Europe",
			"Relations":"Self",
			"RelationStatus":"Single"//,
			//"AttractedTo":"Female",
			//"PlatformSegments":"Experts",
			//"Media":"All",
			//"FanClubs":"Football",
			//"Privacy":"Public"
		};
		*/
		Array.max = function( array ){
			return Math.max.apply( Math, array );
		};
		var thisObj = {};
		thisObj = this;
		
		var thisObj_id = 0;
		thisObj_id = thisObj._id;
		var finalObj = {};
		
		finalObj.Title = thisObj.Title;
		finalObj.Prompt = thisObj.Prompt;
		finalObj.Locator = thisObj.Locator;	
		finalObj.Title = thisObj.Title;
		finalObj.URL = thisObj.Location[0].URL;
		finalObj.MediaType = thisObj.MediaType;
		finalObj.ContentType = thisObj.ContentType;	
		finalObj.UploadedOn = thisObj.UploadedOn;		
		finalObj.UploaderID = thisObj.UploaderID;			
		finalObj.Content = thisObj.Content;	//added on 30092014-Link case
		finalObj.thumbnail = thisObj.thumbnail;	//added on 21122014-Montage case
		finalObj.IsPrivate = thisObj.IsPrivate;	//added on 05022015-Private Media Case
		
		finalObj.PostsBestFSGCount = 0;
		finalObj.PostsCount = 0;
		
		finalObj.StampsBestFSGCount = 0;
		finalObj.StampsCount = 0;
		 
		finalObj.ViewsCount = 0;
		if(thisObj.ViewsCount) 
			finalObj.ViewsCount = thisObj.ViewsCount;
		
		
		finalObj.MaxFSGSort = 0;
		finalObj.AvgFSGSort = 0;
		finalObj.MediaScore = 0;
		
		var actionObj = {};
		var result = {};
		
		actionObj = {"Users":[]};
		if (thisObj.Posts)
			actionObj = thisObj.Posts;
		
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		var objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		var objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		var bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		var occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		 
		finalObj.PostsBestFSGCount = result.actionBestFSGCount;
		finalObj.PostsCount = result.actionCount;
		
		actionObj = {"Users":[]};
		if (thisObj.Stamps)
			actionObj = thisObj.Stamps;
		
		result = {};
		
		//result = perMediaMappedData(actionObj); ////return {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		objToMap = [];
		for(var idx = 0; idx < actionObj.Users.length; idx++ ){
			if(actionObj.Users[idx].UserFSGs){
				itemObj = actionObj.Users[idx].UserFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				objToMap.push(countN);
			}
		}
		objToMapSorted = [];
		objToMapSorted = objToMap.sort();
		
		bestMatchedCount = 0;
		if(objToMap.length)
			bestMatchedCount = Array.max(objToMap);
		occurrences = 0;
		
		for( var occIdx = objToMapSorted.length - 1; occIdx >= 0; occIdx-- ){
			if(  objToMapSorted[occIdx] == bestMatchedCount ){
				occurrences++;
			}
			else{ //objToMapSorted[occIdx] < Array.max(objToMap)
				break;
			}
		}
		//console.log('Max value : '+Array.max(objToMap)+"  ----And occurrences : "+occurrences);	
		result = {actionBestFSGCount:bestMatchedCount,actionCount:occurrences};
		finalObj.StampsBestFSGCount = result.actionBestFSGCount;
		finalObj.StampsCount = result.actionCount;
		
		//added on 16092014 power-user case
		//if(powerUserCase){
			finalObj.UserMaxFSGSort = 0;
			finalObj.UserScore = 0;
			if(thisObj.OwnerFSGs && thisObj.UploadedBy == 'user'){
				itemObj = thisObj.OwnerFSGs;
				var temp = {};
				var countN = 0;
				for( var attrName in loginUsrFsgs ){
					if( itemObj[attrName] != undefined && itemObj[attrName] == loginUsrFsgs[attrName] ){
						temp[attrName] = loginUsrFsgs[attrName];
						countN += 1;
					}
				}
				finalObj.UserMaxFSGSort = countN;
			}
			if(thisObj.UserScore)
				finalObj.UserScore = thisObj.UserScore;
			
			if(thisObj.UploadedBy)
				finalObj.UploadedBy = thisObj.UploadedBy;
		//}
		//End added on 16092014 power-user case
		
		
		var temp = [];
		temp.push(finalObj.PostsBestFSGCount,finalObj.StampsBestFSGCount);
		finalObj.MaxFSGSort = Array.max(temp);
		finalObj.AvgFSGSort = (finalObj.PostsBestFSGCount+finalObj.StampsBestFSGCount)/2;
		finalObj.MediaScore = ((finalObj.PostsCount+finalObj.StampsCount)/finalObj.ViewsCount)*10; 
		
		if(!finalObj.MediaScore)
			finalObj.MediaScore = 0;
		//console.log('record to map : '+JSON.stringify(finalObj));
		//print("final obj : "+finalObj);
		
		emit(
			thisObj._id,
			finalObj
		);
	}
	searchObj.reduce = function(key , values){
		return values;
	}
	
	//console.log("GT-------"+groupTagID);
	/*
	if(mediaTitle)
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2},"Title":new RegExp(mediaTitle, 'i')};
	else
		searchObj.query = { "GroupTags.GroupTagID" : groupTagID,Status:{$ne:2}};
	*/
	searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"IsDeleted":0};
	if(mediaTitle)
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"IsDeleted":0};
	
	if(mediaType == 'Image'){
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},$or:[{"MediaType":'Image'},{"MediaType":'Link',"LinkType":'image'}],"IsDeleted":0};
	}
	else if(mediaType == 'Link'){
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Link',"LinkType":{$ne:'image'},"IsDeleted":0};
	}
	else if(mediaType == 'Notes'){
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Notes',"IsDeleted":0};
	}
	else if(mediaType == 'Montage'){
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"MediaType":'Montage',"IsDeleted":0};
	}
	else{
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"IsDeleted":0};	
	}
	
	
	if(mediaTitle && mediaType)
		searchObj.query={"Prompt":new RegExp(descValue, 'i'),"Status":{$ne:2},"IsPrivate":{$ne:1},"Title":new RegExp(mediaTitle, 'i'),"MediaType":mediaType,"IsDeleted":0};
		
	console.log('----query-----',searchObj.query);
		
	//searchObj.query = {};
	searchObj.scope = {
						loginUserId : login_user_id,
						loginUsrFsgs : userFsgs,
						powerUserCase : powerUserCase
					};
	//searchObj.limit = limit;
	var outCollection = "UserMedia_"+login_user_id;
	console.log(outCollection);
	searchObj.out = {replace: outCollection};
	//searchObj.out = {reduce: outCollection};
	media.mapReduce(searchObj,function(err,result){
		console.log("Error---"+err);
		var stuff = {name: outCollection}; // Define info.
		var Model = createModelForName(stuff.name); // Create the model.
		var userMedia_userIdmodel = Model; // Create a model instance.
		
		var sortObj = sortObj = {'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
		if(powerUserCase)
			sortObj = {'value.UserMaxFSGSort':-1,'value.UserScore':-1,'value.MaxFSGSort':-1,'value.AvgFSGSort':-1,'value.MediaScore':-1,'value.UploadedOn':-1};
			
			
		//var pageLimit = 48;	
		var pageLimit = page*per_page;	
		
		userMedia_userIdmodel.find({}).sort(sortObj).limit(pageLimit).exec(function (err,result) { // Save
			if (err) {
				res.json({"status":"error","message":err});
				return;
			}
			else{
				console.log("result = ",result);
				__fullfillMediaLimit_2(result , pageLimit , mediaType , res);
				//console.log(result[0]);
				//res.json({"status":"success","results":__fullfillMediaLimit(result , pageLimit)});
				//return;
			}
		});
	})
}
//exports.search_by_descriptor = search_by_descriptor;
exports.search_by_descriptor = search_by_descriptor_v2;


var __fullfillMediaLimit_2 = function(result , pageLimit , mediaType , res){
	console.log("---------__fullfillMediaLimit-----");
	var outputRecords = [];
	var newLimit = 0;
	
	var outputRecords = result;
	console.log("outputRecords.length = ",outputRecords.length);
	//console.log("outputRecords.length = ",outputRecords);return;
	
	var conditions = {};
	//conditions = {Status:1,IsDeleted:0};
	conditions.IsDeleted = 0;
	conditions.Status = 1;
	conditions.IsPrivate = {$ne:1};
	//conditions.UploadedOn = 'desc';
	if( mediaType ){
		//conditions = {Status:1,IsDeleted:0,MediaType:mediaType};
		conditions.MediaType = mediaType;
	}
	
	var mediaCount = 0;
	//get count of all media records
	media.find(conditions).count().exec(function (err,results) { // Save
		if (err) {
			res.json({"status":"error","message":err});
			return;
		}
		else{
			mediaCount = results;
			console.log("mediaCount = ",mediaCount);//return;
			if( outputRecords.length < pageLimit ){
				newLimit = parseInt(pageLimit - result.length);
				
				console.log("---------In __fullfillMediaLimit if block-----newLimit = ",newLimit);
				var sortObj = {MediaScore:-1,UploadedOn:-1};
				var fields = {};
				fields = {
					_id:1,
					Title:1,
					Prompt:1,
					Locator:1,
					Location:1,
					MediaType:1,
					ContentType:1,
					UploadedOn:1,
					UploaderID:1,
					Content:1,
					UploadedBy:1,
					thumbnail:1
				};
				
				//Remove already selected media
				var selectedMediaIds = [];
				for( var loop = 0; loop < outputRecords.length; loop++ ){
					if( outputRecords[loop]._id )
						selectedMediaIds.push(outputRecords[loop]._id);
						conditions._id = {$nin : selectedMediaIds};
				}
				//console.log("selectedMediaIds = ",selectedMediaIds);//return;
				//conditions = { Status:1, MediaType:mediaType, _id:{$nin : selectedMediaIds} };
				//console.log("conditions = ",conditions);return;
				//End Remove already selected media
				
				media.find(conditions,fields).sort(sortObj).limit(newLimit).exec(function (err,results) { // Save
					if (err) {
						res.json({"status":"error","message":err});
						return;
					}
					else{
						console.log(results);
						//change media object structure
						for( var loop = 0; loop < results.length; loop++ ){
							console.log("single - ",results[loop])
							var tempObj = {};
							tempObj = results[loop].toObject();
							if( tempObj.Location[0].URL ){
								tempObj.URL = tempObj.Location[0].URL;
							}
							
							var requiredObj = {};
							requiredObj._id = tempObj._id;
							requiredObj.value = tempObj;
							
							
							if(requiredObj.value.Location[0].URL){
								requiredObj.value['URL'] = requiredObj.value.Location[0].URL;
							}
							outputRecords.push(requiredObj);
						}
						
						//return outputRecords;
						//console.log(results[0]);
						res.json({"status":"success","results":outputRecords,"mediaCount":mediaCount});
						return;
					}
				});
			}
			else{
				res.json({"status":"success","results":outputRecords,"mediaCount":mediaCount});
				return;
			}
			
		}
	});
	
};

//added on 30042015 - Multiple Case
var __fullfillMediaLimit_3 = function(result , pageLimit , mediaType , res){
	console.log("---------__fullfillMediaLimit-----");
	var outputRecords = [];
	var newLimit = 0;
	
	var outputRecords = result;
	console.log("outputRecords.length = ",outputRecords.length);
	//console.log("outputRecords.length = ",outputRecords);return;
	
	var conditions = {};
	//conditions = {Status:1,IsDeleted:0};
	conditions.IsDeleted = 0;
	conditions.Status = 1;
	conditions.IsPrivate = {$ne:1};
	//conditions.UploadedOn = 'desc';
	if( mediaType.length ){
		//conditions = {Status:1,IsDeleted:0,MediaType:mediaType};
		conditions.$or = mediaType;
	}
	console.log( "-------conditions----------",conditions );
	var mediaCount = 0;
	
	conditions.MetaMetaTags = "5464931fde9f6868484be3d7";
	
	//get count of all media records
	media.find(conditions).count().exec(function (err,results) { // Save
		if (err) {
			res.json({"status":"error","message":err});
			return;
		}
		else{
			mediaCount = results;
			console.log("mediaCount = ",mediaCount);//return;
			if( outputRecords.length < pageLimit ){
				newLimit = parseInt(pageLimit - result.length);
				
				console.log("---------In __fullfillMediaLimit if block-----newLimit = ",newLimit);
				var sortObj = {MediaScore:-1,UploadedOn:-1};
				var fields = {};
				fields = {
					_id:1,
					Title:1,
					Prompt:1,
					Locator:1,
					Location:1,
					MediaType:1,
					ContentType:1,
					UploadedOn:1,
					UploaderID:1,
					Content:1,
					UploadedBy:1,
					thumbnail:1
				};
				
				//Remove already selected media
				var selectedMediaIds = [];
				for( var loop = 0; loop < outputRecords.length; loop++ ){
					if( outputRecords[loop]._id )
						selectedMediaIds.push(outputRecords[loop]._id);
						conditions._id = {$nin : selectedMediaIds};
				}
				//console.log("selectedMediaIds = ",selectedMediaIds);//return;
				//conditions = { Status:1, MediaType:mediaType, _id:{$nin : selectedMediaIds} };
				//console.log("conditions = ",conditions);return;
				//End Remove already selected media
				
				conditions.MetaMetaTags = "5464931fde9f6868484be3d7";
				
				media.find(conditions,fields).sort(sortObj).limit(newLimit).exec(function (err,results) { // Save
					if (err) {
						res.json({"status":"error","message":err});
						return;
					}
					else{
						//console.log(results);
						//change media object structure
						for( var loop = 0; loop < results.length; loop++ ){
							//console.log("single - ",results[loop])
							var tempObj = {};
							tempObj = results[loop].toObject();
							if( tempObj.Location[0].URL ){
								tempObj.URL = tempObj.Location[0].URL;
							}
							
							var requiredObj = {};
							requiredObj._id = tempObj._id;
							requiredObj.value = tempObj;
							
							
							if(requiredObj.value.Location[0].URL){
								requiredObj.value['URL'] = requiredObj.value.Location[0].URL;
							}
							outputRecords.push(requiredObj);
						}
						
						//return outputRecords;
						//console.log(results[0]);
						res.json({"status":"success","results":outputRecords,"mediaCount":mediaCount});
						return;
					}
				});
			}
			else{
				res.json({"status":"success","results":outputRecords,"mediaCount":mediaCount});
				return;
			}
			
		}
	});
	
};

var test_sorting = function(req , res){
	var tempArr = [];
	tempArr = [
		{
			"MatchedCount":1,
			"Weight":5
		},
		{
			"MatchedCount":5,
			"Weight":53
		},
		{
			"MatchedCount":5,
			"Weight":54
		},
		{
			"MatchedCount":4,
			"Weight":5
		},
		{
			"MatchedCount":3,
			"Weight":14
		}
	];
	
	tempArr.sort(function(a,b){
		return b.MatchedCount - a.MatchedCount || b.Weight - a.Weight;
	});
	
	res.json({"returnVal":tempArr});
};

exports.test_sorting = test_sorting;