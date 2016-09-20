var Capsule = require('../../../controllers/capsulesController.js');
var LaunchSetting = require('../../../controllers/launchSettingsController.js');
module.exports = function(router){
	console.log("in capsuleRoutes.js",router);
	//findAll user Capsules
	router.get('/',function(req,res){
		Capsule.findAll(req,res);
	});
	
	//findAll user Capsules paginated for Capsule library
	router.post('/',function(req,res){
		switch(req.body.qc){
			case 'all':
				Capsule.findAllPaginated(req,res);
				break;
				
			case 'createdByMe':
				Capsule.createdByMe(req,res);
				break;
				
			case 'sharedWithMe':
				Capsule.sharedWithMe(req,res);
				break;
			
			case 'byTheHouse':
				Capsule.byTheHouse(req,res);
				break;
			
			case 'allPublished' :
				Capsule.allPublished(req,res);
				break;
			
			case 'publishedByMe' :
				Capsule.publishedByMe(req,res);
				break;
			
			case 'publishedForMe' :
				Capsule.publishedForMe(req,res);
				break;
				
			case 'invitationForMe' :
				Capsule.invitationForMe(req,res);
				break;
			
			default : 
				Capsule.findAllPaginated(req,res);
		}
	
		//Capsule.findAllPaginated(req,res);
	});
	
	//Add a Capsule
	router.post('/create',function(req,res){
		Capsule.create(req,res);
	});
	
	//duplicate a Capsule
	router.post('/duplicate',function(req,res){
		Capsule.duplicate(req,res);
	});
	
	//remove a Capsule
	router.post('/remove',function(req,res){
		Capsule.remove(req,res);
	});
	
	//reorder all Capsules
	router.post('/reorder',function(req,res){
		Capsule.reorder(req,res);
	});
	
	//remove a Capsule
	router.post('/updateCapsuleName',function(req,res){
		Capsule.updateCapsuleName(req,res);
	});
	
	//addFromLibrary
	router.post('/addFromLibrary',function(req,res){
		Capsule.addFromLibrary(req,res);
	});
	
	//preview
	router.post('/preview',function(req,res){
		Capsule.preview(req,res);
	});
	
	//share
	router.post('/share',function(req,res){
		Capsule.share(req,res);
	});
	
	//upload cover image
	router.post('/uploadCover',function(req,res){
		Capsule.uploadCover(req,res);
	});
	
	
	//get current Capsules data for launch settings
	router.get('/current',function(req,res){
		Capsule.find(req,res);
	});
	
	//add new invitee to capsule
	router.post('/invite',function(req,res){
		Capsule.invite(req,res);
	});
	
	//save settings
	router.post('/saveSettings',function(req,res){
		Capsule.saveSettings(req,res);
	});
	
	//add a member as invitee to capsule
	router.post('/inviteMember',function(req,res){
		Capsule.inviteMember(req,res);
	});
	
	//add a member as invitee to chapter
	router.post('/removeInvitee',function(req,res){
		Capsule.removeInvitee(req,res);
	});
	
	//Publish a Capsule
	router.post('/publish',function(req,res){
		LaunchSetting.publish(req,res);
	});
	
	router.get('/capsule__checkCompleteness',function(req,res){
		LaunchSetting.capsule__checkCompleteness(req,res);
	});
        //upload menu icon
	router.post('/uploadMenuIcon',function(req,res){
		Capsule.uploadMenuIcon(req,res);
	});
	
	router.post('/delMenuIcon',function(req,res){
		Capsule.delMenuIcon(req,res);
	});
	router.post('/delCoverArt',function(req,res){
		Capsule.delCoverArt(req,res);
	});
	
	// to update capsule
	router.post('/updateCapsule',function(req,res){
		Capsule.updateCapsuleForChapterId(req,res);
	});
	
	/* AUTOMATION
	this.controller = Capsule;
	
	var apis = [
		{ name : "/" , method : "get" , linkedFunc : "findAll"},
		{ name : "/create" , method : "post" , linkedFunc : "create" },
		{ name : "/duplicate" , method : "post" , linkedFunc : "duplicate" },
		{ name : "/remove" , method : "post" , linkedFunc : "remove" },
		{ name : "/addFromLibrary" , method : "post" , linkedFunc : "addFromLibrary" },
		{ name : "/preview" , method : "post" , linkedFunc : "preview" },
		{ name : "/share" , method : "post" , linkedFunc : "share" }
	];
		
	apis.forEach(function(api){
		router[api.method] = function(api.name , function(req , res){
			this.controller[api.linkedFunc](req , res);
		});
	});
	*/
}