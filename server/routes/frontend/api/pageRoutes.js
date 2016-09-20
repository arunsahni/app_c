var Page = require('../../../controllers/pagesController.js');
var ACL = require('../../../middlewares/capsuleMiddlewares.js');

var TestCP = require('../../../controllers/testContentPageController.js'); 

module.exports = function(router){
	console.log("in pageRoutes.js",router);
	
	//testing content page - 10 Dec 2015
	router.post('/createcp',function(req,res){
		TestCP.create(req,res);
	});
	
	//getChapterName
	router.post('/getChapterName',function(req,res){
		Page.getChapterName(req,res);
	});
	
	//getPageData 
	router.get('/getPageData',ACL.chapter__checkMembership,function(req,res){
		Page.getPageData(req,res);
	});
	
	//getPageLibrary user chapters
	//router.get('/getPageLibrary',function(req,res){
	//	Page.getPageLibrary(req,res);
	//});
	router.post('/getPageLibrary',function(req,res){
		switch(req.body.qc){
			case 'all':
				Page.getPageLibrary(req,res);
				break;
				
			case 'createdByMe':
				Page.createdByMe(req,res);
				break;
				
			case 'sharedWithMe':
				Page.sharedWithMe(req,res);
				break;
			
			case 'byTheHouse':
				Page.byTheHouse(req,res);
				break;
				
			default : 
				Page.getPageLibrary(req,res);
		}
		
	});
	
	//findAll user pages - In The Making
	router.get('/',function(req,res){
		Page.findAll(req,res);
	});
	
	//findAll user pages - belongs to the chapter
	router.get('/getAllPages',function(req,res){
		Page.getAllPages(req,res);
	});
	
	//Add a Page
	router.post('/create',function(req,res){
		Page.create(req,res);
	});
	
	//duplicate a Page
	router.post('/duplicate',function(req,res){
		Page.duplicate(req,res);
	});
	
	//remove a Page
	router.post('/remove',function(req,res){
		Page.remove(req,res);
	});
	
	//reorder all Pages
	router.post('/reorder',function(req,res){
		Page.reorder(req,res);
	});
	
	//addFromLibrary
	router.post('/addFromLibrary',function(req,res){
		Page.addFromLibrary(req,res);
	});
		
	//preview
	router.post('/preview',function(req,res){
		Page.preview(req,res);
	});
	
	//share
	router.post('/share',function(req,res){
		Page.share(req,res);
	});
	
	
	//Specific apis : search gallery page
	//getPageName
	router.post('/getPageName',function(req,res){
		Page.SearchGalleryPage.getPageName(req,res);
	});
	
	//updatePageName
	router.post('/updatePageName',function(req,res){
		Page.SearchGalleryPage.updatePageName(req,res);
	});
	
	//uploadHeader
	router.post('/uploadHeader',function(req,res){
		Page.SearchGalleryPage.uploadHeader(req,res);
	});
	
	//listHeaders
	router.post('/listHeaders',function(req,res){
		Page.SearchGalleryPage.listHeaders(req,res);
	});
	//uploadHeader
	router.post('/cropHeader',function(req,res){
		Page.SearchGalleryPage.cropHeader(req,res);
	});
	
	
	//save sg settings
	router.post('/saveSettings',function(req,res){
            Page.SearchGalleryPage.saveSettings(req,res);
	});
        
        router.post('/saveQuesTip',function(req,res){
            Page.SearchGalleryPage.saveQuesTip(req,res);
	});
	router.post('/saveVideo',function(req,res){
            Page.SearchGalleryPage.saveQuesVideo(req,res);
	});
	router.post('/saveVideoData',function(req,res){
            Page.SearchGalleryPage.saveVideoData(req,res);
	});
	router.post('/saveThemeData',function(req,res){
            Page.SearchGalleryPage.saveThemeData(req,res);
	});
        
        router.post('/getallKeywordsByTheme', function(req,res){
	    Page.SearchGalleryPage.getallKeywordsByThemes(req,res);
	})
        
        router.get('/findAllGtOfMt', function(req,res){
	    Page.SearchGalleryPage.findAllGtOfMt(req,res);
	})
        router.post('/viewQuesTipData',function(req,res){
		Page.SearchGalleryPage.viewQuesTipData(req,res);
	});
	router.post('/uploadGalleryMedia',function(req,res){
		Page.SearchGalleryPage.uploadGalleryMedia(req,res);
	});
	
	router.post('/getallKeywordsByCondition', function(req,res){
	    Page.SearchGalleryPage.getallKeywordsByCondition(req,res);
	})
	//End search gallery page	
        
        //contentPageBuilder Apis
        //updateWidgets
	router.post('/updateWidgets',function(req,res){
            Page.ContentPage.updateWidgets(req,res);
	});
        
        router.post('/updateBackground',function(req,res){
            Page.ContentPage.updateBackground(req,res);
	});
        
        router.post('/updateCommonParams',function(req,res){
            Page.ContentPage.updateCommonParams(req,res);
	});
        
        router.post('/uploadMedia',function(req,res){
            Page.ContentPage.uploadMedia(req,res);
	});
        
        router.post('/uploadLink',function(req,res){
            Page.ContentPage.uploadLink(req,res);
	});
        
	// to get images by Arun Sahani
	router.post('/getMedia',function(req,res){
            Page.ContentPage.getMedia(req,res);
	});
	router.post('/getallKeywords', function(req,res){
	    Page.ContentPage.getallKeywords(req,res);
	})
	
	// To Delete Questio tip video
	router.post('/delQuesVideo',function(req,res){
		Page.SearchGalleryPage.delQuesVideo(req,res);
	});
	
	// To Delete Header Image
	router.post('/deleteHeaderImage',function(req,res){
		Page.SearchGalleryPage.deleteHeaderImage(req,res);
	});
	
	// To Display uploaded images 
	router.post('/showUploadedImg',function(req,res){
		Page.SearchGalleryPage.showUploadedImg(req,res);
	});
	
	// To Display selected media 
	router.post('/findSelectedMedia',function(req,res){
		Page.SearchGalleryPage.findSelectedMedia(req,res);
	});

	// To save page filters value 
	router.post('/savePageFilters',function(req,res){
		Page.SearchGalleryPage.savePageFilters(req,res);
	});
	
	// To save media Types
	router.post('/saveMediaTypes',function(req,res){
		Page.SearchGalleryPage.saveMediaTypes(req,res);
	});
	// To delete particular uploaded media
	router.post('/deleteUploadedImage',function(req,res){
		Page.SearchGalleryPage.deleteUploadedImage(req,res);
	});
	/*
	// To delete particular Hand picked image
	router.post('/deleteHandPickedImage',function(req,res){
		Page.SearchGalleryPage.deleteHandPickedImage(req,res);
	});*/
	
	// To save media range
	router.post('/saveMediaRange',function(req,res){
		Page.SearchGalleryPage.saveMediaRange(req,res);
	});
	//end contentPageBuilder Apis
        
	
	//findAll_dashedit user pages - In the Updation
	router.get('/findAlldashedit',function(req,res){
		Page.findAll_dashedit(req,res);
	});
        
	//publishNewChanges_dashedit user pages - In the Updation
	router.post('/publishNewUpdates_dashedit',function(req,res){
		Page.publishNewUpdates_dashedit(req,res);
	});
	// to add a copy of page
	router.post('/dashEditCreate',function(req,res){
		Page.dashEditCreate(req,res);
	});
	//revertNewChanges_dashedit user pages
	router.post('/revertDashEditCopy',function(req,res){
		Page.revertDashEditCopy(req,res);
	});
	
	//addFromLibrary_dashEdit
	router.post('/addFromLibrary_dashEdit',function(req,res){
		Page.addFromLibrary_dashEdit(req,res);
	});
	
	//user Gallery
	router.post('/userGalleryMedia',function(req,res){
		Page.SearchGalleryPage.userGalleryPreview(req,res);
	});
	//delete media from user Gallery
	router.post('/deleteGalleryMedia',function(req,res){
		Page.SearchGalleryPage.deleteGalleryMedia(req,res);
	});
	/* AUTOMATION
	this.controller = Page;
	
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