var Capsule = require('./../../models/capsules/capsulesModel.js');
var fs = require('fs');
var formidable = require('formidable');

// To fetch all capsules
var findAll = function(req, res){
    var fields={};
    if(typeof(req.body.project)!='undefined'){
		fields['ProjectID']=req.body.project;	
    }
    if(typeof(req.body.id)!='undefined') {
		fields['_id']=req.body.id;
    }
    if (typeof(req.body.gt)!='undefined' && typeof(req.body.gt)=='String') {
		fields['Medias.ThemeID']=req.body.gt;
    }
    
    fields['isDeleted']=0;
    board.find(fields,function(err,result){
		
	if(err){ 		
	    res.json(err);
	}
	else{
	    if(result.length==0){
		res.json({"code":"404","msg":"Not Found"})
	    }
	    else{
		
		if (req.session.user) {
		    if (result[0].PrivacySetting[0].BoardType=='FriendsSolo' && result[0].OwnerID._id!=req.session.user._id) {
			var showMedias=result;			
			var medias=[];
			
			for(i=0;i<result[0].Medias.length;i++){
			    
			    if (String(result[0].Medias[i].PostedBy._id)==String(result[0].OwnerID._id) || String(result[0].Medias[i].PostedBy._id)==String(req.session.user._id)) {			    
				medias.push(result[0].Medias[i]);
			    }
			}
			result[0].Medias=[];
			result[0].Medias=medias;
			
			
		    }
		}
		res.json({"code":"200","msg":"Success","response":result})
		
	    }
	}
	
    }).populate('Domain Collection ProjectID OwnerID Medias.PostedBy Invitees.UserID')
    
};

// Controller action to save capsule info.
var createCapsule = function(req, res){
    var capsule = new Capsule();
    console.log(req.body, "request");
    capsule.saveCapsule(req.body, function(err, response){
	if(err) return res.send(500, err);
	
	res.send(200, { capsule: response, message: "Capsule created successfully!!"});
    });		
};


exports.findAll = findAll;

exports.createCapsule = createCapsule;

