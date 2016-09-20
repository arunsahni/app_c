var admin = require('./../models/adminModel.js');

// For login of a admin
var login = function(req, res){
       
    var fields = {        
        email: req.body.email,
        password: req.body.password
    };
	
    admin.find(fields,function(err,result){
		if(err){ 		
			res.json(err);
		}
		else{
			if(result.length==0){
				res.json({"code":"404","msg":"Failed"})
			}
			else{
				if (req.body.remember == "1") {
                    
                }
				req.session.admin = result[0];
				//res.render('layouts/backend/adminLayout.html');
				res.json({"code":"200","msg":"Success","adminsession":req.session.admin});
			}
		}
	});
    
};

exports.login = login;



var chklogin = function(req, res){
    if (req.session.admin) {
        res.send(req.session.admin);
		//res.json({"code":"200","msg":"Success","adminsession":req.session.admin});
    }
    else{
        res.send("0");
		//res.json({"code":"404","msg":"Failed"})
    }
    
}
exports.chklogin = chklogin;