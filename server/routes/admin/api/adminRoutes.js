var admin = require('../../../controllers/adminController.js');
module.exports = function(router){
	console.log("in userRoutes.js",router);
	
	//-----/admin
	router.get('/',function(req,res){
		//if(req.session.admin)
			res.render('layouts/backend/adminLayout.html');
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
		admin.login(req,res);
	});
	router.get('/chklogin', function(req, res){
		admin.chklogin(req,res);
	});

	router.get('/logout', function(req, res){
		if (req.session.admin) {
			req.session.admin = null; // Deletes the cookie.
			res.json({"logout":"200","msg":"Success"});
		}        
	});
	
}