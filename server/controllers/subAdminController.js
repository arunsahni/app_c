var subAdmin = require('./../models/subAdminModel.js');

// For login of a admin
var login = function(req, res){
       
    var fields = {        
        email: req.body.email,
        password: req.body.password
    };
	//subAdmin.find({},function(err,result){
	//		console.log(result);
	//})
    subAdmin.find(fields,function(err,result){
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				subAdmin.find({},function(err,result){
					console.log(result);
					console.log('subAdmin');
					res.json({"code":"404","msg":"Failed"})
	
				})
							}
			else{
				if (req.body.remember == "1") {
                    
                }
				req.session.subAdmin = result[0];
				//res.render('layouts/backend/adminLayout.html');
				res.json({"code":"200","msg":"Success","subAdminsession":req.session.subAdmin});
			}
		}
	});
    
};

exports.login = login;



var chklogin = function(req, res){
    if (req.session.subAdmin) {
        res.send(req.session.subAdmin);
		//res.json({"code":"200","msg":"Success","adminsession":req.session.admin});
    }
    else{
        res.send("0");
		//res.json({"code":"404","msg":"Failed"})
    }
    
}
exports.chklogin = chklogin;