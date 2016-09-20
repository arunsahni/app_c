var user = require('../../../controllers/userController.js');
module.exports = function(router){
	console.log("in userRoutes.js",router);
	
	router.post('/login',function(req,res){
		user.login(req,res);
	});
	
	router.get('/chklogin', function(req, res){
		console.log("m in chklogin...");
		user.chklogin(req,res);
	});
	
	router.get('/view', function(req, res){
		user.view(req,res);
	});
	
	router.post('/register', function(req, res){
		user.register(req,res);
	});
	//parul 6 jan 2015
	router.post('/saveSettings', function(req, res){
		user.saveSettings(req,res);
	});
	router.post('/addFsg', function(req, res){
		user.addFsg(req,res);
	});
	//added by parul
	router.post('/fsgArrUpdate', function(req, res){
		//console.log(req.body);
		user.fsgArrUpdate(req,res);
	});
	router.get('/logout', function(req, res){
		if (req.session.user) {
			req.session.user = null; // Deletes the cookie.
			res.clearCookie('connect.sid', { path: '/capsule' });
			res.json({"logout":"200","msg":"Success"});
		}        
	});
	//file upload route parul
	router.post('/fileUpload',function(req,res){
		user.fileUpload(req,res);
	});
	
	//save file route parul
	router.post('/saveFile',function(req,res){
		user.saveFile(req,res);
	});
	
	//reset password parul 23012015
	router.post('/reset_password',function(req,res){
		user.resetPassword(req,res);
	});
	
	//save new password parul 23012015
	router.post('/new_password',function(req,res){
		user.newPassword(req,res);
	});
	
	router.get('/updateAllPassword',function(req,res){
		user.updateAllPassword(req,res);
	});

	
}