var keywordModel = require('./../models/groupTagsModel.js');

// Find all group tags
var findAll = function(req, res){    
	
	
    keywordModel.find({$or:[{status:1},{status:3}]},function(err,result){		
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
    keywordModel.find({status:1},function(err,result){		
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
	
	
    keywordModel.find({status:2},function(err,result){
		
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


function chkGt(abc,callback){
    keywordModel.find({status:1,GroupTagTitle:abc},function(err,result){
		if (err) {
			throw err;
	    }
	    else{
		    callback(result);
		}
	});
};

//Keyword Parsing code
/*
1) input : sentence - inputText - String
2) Match With : string file comma separated - keywords - Array
*/

var keywordParsar = function (req , res){
	console.log("-------- keywordParsar -----------");
	var isEqual = function(str1,str2){
		if( str1 == str2 ){
			return true;
		}
		else{
			return false
		}
	}
	
	var keywords = [];
	var matchedArr = [];
	var suggestedArr = [];
	
	console.log("-------req.body.inputText------------",req.body.inputText);
	//var inputText = "As much belief in himself as others have in him.  More sharing of his own story with others. Bringing more personal joys into self";
	var inputText = req.body.inputText ? req.body.inputText : "";
	
	var findObj = {};
	findObj.conditions = {};
	findObj.fields = {};
	
	//conditions
	findObj.conditions.$or = [ { status : 1 } , { status : 3 } ];
	console.log("--------findObj------" , findObj);
	keywordModel.find(findObj.conditions , findObj.fields , function(err,result){		
		if(err){ 
			console.log(err)
			res.json(err);
		}
		else{
			if( result.length == 0 ){
				res.json({"code":"404","msg":"No keywords found!"})
			}
			else{				
				//var keywordsStr = "much belief,belief,belief in himself,teamwork,sharing,own story,Bringing, personal joys,self,happy,passion in life";
				//var keywordsStr = getRelativeKeywords(inputText , keywordArray);
				//keywords = keywordsStr.split(",");
				//get keywords
				for( var loop = 0; loop < result.length; loop++ ){
					keywords.push({"title":result[loop].GroupTagTitle , "id":result[loop]._id});
				}
				
				console.log("-------------keywords -------",keywords);
				//match keywords
				inputText = inputText.toUpperCase().trim();
				
				for( var loop = 0;loop < keywords.length; loop++ ){
					var keyword = {};
					keyword.title = keywords[loop].title.toUpperCase().trim();
					keyword.id = keywords[loop].id;
					
					var idxOf__keyword = inputText.indexOf(keyword.title);
					//if( idxOf__keyword != -1 && (inputText.substring(idxOf__keyword - 1 , idxOf__keyword) == " " && idxOf__keyword != 0 ) && (inputText.substring(idxOf__keyword , idxOf__keyword + inputText.length -1) == " " && idxOf__keyword != (inputText.length -1) ) ){	
					if( idxOf__keyword != -1 && ( inputText.substring(idxOf__keyword - 1 , idxOf__keyword) == " " || idxOf__keyword == 0 || idxOf__keyword == (inputText.length -1) ) ){
					//if( idxOf__keyword != -1 ){
						if( isEqual(keyword.title , inputText) ){
							matchedArr.push(keyword);
							suggestedArr.push(keyword);
						}
						else{
							suggestedArr.push(keyword);
						}
					}
				}
				
				console.log("inputText : ",inputText);
				
				var response = {
					"inputText":inputText,
					"matchedArr":matchedArr,
					"suggestedArr":suggestedArr
				};
				
				console.log(response);
				res.json({"code":"200","msg":"Success","response":response})
			}
		}
    });
}
exports.keywordParsar = keywordParsar;

var test_duplicate = function(req, res){    
	keywordModel.find({$or:[{status:1},{status:3}]},function(err,result){
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
exports.test_duplicate = test_duplicate;

var isAlreadyExist = function( keyword ){
	keywordModel.find({GroupTagTitle:keyword,$or:[{status:1},{status:3}]},function(err,result){
		if(err){ 		
			res.json(err);
		}		
		else{	
			if(result.length == 0){
				res.json({"code":"404","msg":"Not Found"})
			}	
			else{
				for( var loop = 0; loop < result.length; loop++ ){
					if( result[loop].GroupTagTitle == result[loop2].GroupTagTitle ){
							
					}
				}
				
				res.json({"code":"200","msg":"Success","response":result})
			}	
		}		
	})
	
}

