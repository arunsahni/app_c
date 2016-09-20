var media = require('../../../controllers/mediaController.js');
var mediaActionLogs = require('../../../controllers/mediaActionLogsController.js');
var mediaSearchEngine = require('../../../controllers/mediaSearchEngineController.js');


module.exports = function(router){
	console.log("in userRoutes.js",router);
	
	router.post('/mediaActionLogs',function(req,res){
		mediaActionLogs.addMediaAction(req,res)
	})
	
	// Upload montage images
	router.post('/updateMontage',function(req,res){
		media.updateMontage(req, res);
		//mediaActionLogs.addMediaAction(req,res)
	})

	
	router.post('/searchEngine',function(req,res){
		//mediaSearchEngine.search_v_4(req,res)
		//mediaSearchEngine.search_v_5(req,res)	//added on 16092014
		//mediaSearchEngine.search_v_6(req,res)	//added on 28112014
		//mediaSearchEngine.search_v_7(req,res)	//added on 27012015 with show_more pagination
		//console.log('-----------------Im here-----------------');return false;
		if( req.body.searchBy == 'Descriptor' ){
			mediaSearchEngine.search_by_descriptor(req,res)
		}
		else{
			//mediaSearchEngine.search_v_8(req,res)	//added on 05022015 with IsPrivate Status
			// added by arun sahani 28/04/2016
			if(req.body.keywordsSelcted){
				mediaSearchEngine.search_v_8_temp(req,res)
			}else{
				//default case
				mediaSearchEngine.search_v_8(req,res)
			}
		}
		//mediaSearchEngine.search_v_9(req,res)	//added on 06022015 with multi case:weight - In testing
	})
	
	router.post('/showMoreMedia',function(req,res){
		mediaSearchEngine.showMoreMedia(req,res)	
	})
	router.post('/addTagsToUploadedMedia',function(req,res){
		media.addTagsToUploadedMedia(req,res)	
	})
	
	router.post('/addViews',function(req,res){
		media.viewMedia(req,res)	
	})
	
	router.get('/test_userscore',function(req,res){
		mediaActionLogs.test_userscore(req,res)	
	})
	
	router.post('/actions',function(req,res){
		mediaActionLogs.logMediaAction(req,res);	
	})
	
	router.post('/uploadLink',function(req,res){
		media.uploadLink(req,res);
	})
	
	//added on 14012015 by manishp : Test api : 
	router.get('/generate_thumbnail',function(req,res){
		media.GenerateThumbnail(req,res);
	})
	
	//testing
	router.get('/test_sorting',function(req,res){
		mediaSearchEngine.test_sorting(req,res);
	})
	
	router.get('/view',function(req , res){
		res.render('layouts/frontend/openMediaLayout.html');
		//media.getMedia(req,res);
		//media.view_media(req , res);
	});
	
	//by parul for descriptor auto complete 
	router.get('/descriptor',function(req , res){
		media.get_descriptor(req,res);
	});
	// end
	
	router.post('/getMediaDetail',function(req , res){
		media.view_media(req , res);
	});
	
	//video upload route parul 17 march 2015
	router.post('/videoUpload',function(req,res){
		media.videoUpload(req,res);
	});
	
	//audio upload route parul 17 march 2015
	router.post('/audioUpload',function(req,res){
		media.audioUpload(req,res);
	});
	
	// parul 03-04-2015
	router.post('/viewMedia',function(req,res){
		media.viewMediaAdmin(req,res);
	})
	// end
	
	// parul 08-04-2015
	router.post('/getBoardMedia',function(req,res){
		media.getBoardMedia(req,res);
	})
	// end
	
	// parul 14-04-2015
	router.post('/makePublic',function(req,res){
            media.makePublic(req,res);
	})
	// end
	
	//test api - Identifying faulty images
	router.get('/get_faulty_images',function(req,res){
            media.get_faulty_images(req,res);
	})
	
	// parul 20-04-2015
	router.post('/froala_file',function(req,res){
            media.froala_file(req,res);
	})
	// end
	router.post('/note_screenshot',function(req,res){
            media.note_screenshot(req,res);
	})
	// end
        
        // for selected media
	router.post('/findSelectedMedia',function(req,res){
            media.findSelectedMedia(req, res);
	})
	// For pagination in tailor media gallery by arun sahani 26052016
	router.post('/searchByPage',function(req,res){
		media.searchByPage(req, res);
	})
	
	router.get('/createResizedVersion',function(req,res){
		media.createResizedVersion(req, res);
	})
}