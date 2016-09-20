/*
Comments - Defines a custom middle-ware to check for session for every route, with exceptions routes listed in unprotectedRoutes[]
*/

//var mongoose = require('mongoose');
//var tokenModel = mongoose.model('Token');

module.exports = function(req, res, next){
	//define api prefix
	//var frontendApiPrefix = '/api';
	console.log('Something is happening.----admin panel...');
	reqUrl = req.baseUrl + req.path;
	console.log("request url : ",reqUrl);
	
	if(reqUrl.substring(0,6) == '/admin'){
		var frontendApiPrefix = '/admin';
		var unprotectedRoutes = [
				'/',
				'/login',
				'/signin',
				'/chklogin',
				'/register'
		];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,4) == '/fsg'){
		var frontendApiPrefix = '/fsg';
		var unprotectedRoutes = [
			'/view'
		];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,8) == '/domains'){
		var frontendApiPrefix = '/domains';
		var unprotectedRoutes = [
			'/view'
		];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,12) == '/collections'){
		var frontendApiPrefix = '/collections';
		var unprotectedRoutes = [
			'/view'
		];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,10) == '/groupTags'){
		var frontendApiPrefix = '/groupTags';
		var unprotectedRoutes = [
			'/view',
			'/without_descriptors',
			'/getKeywords'
		];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,13) == '/metaMetaTags'){
		var frontendApiPrefix = '/metaMetaTags';
		var unprotectedRoutes = [
			'/view'
		];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,10) == '/gtbinding'){
		var frontendApiPrefix = '/gtbinding';
		var unprotectedRoutes = [];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,5) == '/tags'){
		var frontendApiPrefix = '/tags';
		var unprotectedRoutes = [
			'/view'
		];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,16) == '/massmediaupload'){
		var frontendApiPrefix = '/massmediaupload';
		var unprotectedRoutes = [];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,8) == '/sources'){
		var frontendApiPrefix = '/sources';
		var unprotectedRoutes = [
			'view'
		];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,13) == '/contribution'){
		var frontendApiPrefix = '/contribution';
		var unprotectedRoutes = [];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else if(reqUrl.substring(0,9) == '/metaTags'){
		var frontendApiPrefix = '/metaTags';
		var unprotectedRoutes = [];
		
		checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl);
	}
	else{
		console.log("in else..");
		next();
	}
	
};

function checkUnprotectedRoutes(req , res , next , frontendApiPrefix , unprotectedRoutes , reqUrl){
	console.log("check : ",unprotectedRoutes.indexOf(reqUrl.replace(frontendApiPrefix, '').trim('/')));
	if(unprotectedRoutes.indexOf(reqUrl.replace(frontendApiPrefix, '').trim('/')) > -1){
		console.log("api status-----","public");
		next();
	}
	else{
		console.log("api status-----","protected");
		checkSession(req , res , next);
	}
}


function checkSession(req , res , next){
	if (req.session.admin || req.session.subAdmin) {
		next();
	}else{
		//console.log("session has expired...");
		//res.render('admin/login.html');
		//return;
		res.send(401, 'Your session has expired');
	} 
}