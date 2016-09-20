var subAdmin = require('../../../controllers/subAdminController.js');
module.exports = function(router){
	console.log("in userRoutes.js",router);
	
	//-----/admin
	router.get('/',function(req,res){
		//if(req.session.admin)
			res.render('layouts/backend/subAdminLayout.html');
		//else{
			//var reqUrl = req.baseUrl + req.path;
			//if( reqUrl != '/admin/signin' ){
			//	res.render('admin/login.html');
			//}
		//}
		//res.render('admin/login.html');
	});
	/*
	router.get('/login',function(req,res){
		res.render('admin/login.html');
	});
	*/
	router.post('/signin',function(req,res){
		subAdmin.login(req,res);
	});
	router.get('/chklogin', function(req, res){
		subAdmin.chklogin(req,res);
	});

	router.get('/logout', function(req, res){
		if (req.session.subAdmin) {
			req.session.subAdmin = null; // Deletes the cookie.
			res.json({"logout":"200","msg":"Success"});
		}        
	});
	
}