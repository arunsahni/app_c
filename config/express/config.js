/*

* Date - 3 June 2014
* Comments - Creates the instance of the application and sets the environment
*/
var express = require('express');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bp = require('body-parser');

//enabling gZip compression : It will reduce the web site size to 70% - Added on 13052015
var compress = require('compression');

module.exports = function(app){
	
	require('./../env/default_2.js')(app);
	//app.use(compress()); 
	// Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));
		
	app.use(cookieParser());
	app.use(expressSession({secret:'somesecrettokenhere'}));
	//app.use(bp());
	app.use(bp({limit: '50mb'}));
	//app.use(bp({uploadDir:'./uploads'})); //did not work, check in project.js configuration (process.env.TMPDIR = './uploads')
	//app.use(bp.json());

	app.set('views',__dirname+'/../../public/views/');
	app.use(express.static(__dirname + '/../../public'));
	app.use(express.static(__dirname + '/../../public/static.scrpt.com'));
	app.use(express.static(__dirname + '/../../media-assets'));
	app.engine('html',function(path,opt,fn){
		fs.readFile(path,'utf-8',function(err,str){
			if(err) return str;
			return fn(null,str);
		});
	});

	var router = {};
	
	//Creating the custom router for the application - front-end
	var userRoutes = express.Router();
	app.use('/user', userRoutes);
	router.userRoutes = userRoutes;
	
	var projectRoutes = express.Router();
	app.use('/projects', projectRoutes);
	router.projectRoutes = projectRoutes;
	
	var boardRoutes = express.Router();
	app.use('/boards', boardRoutes);
	router.boardRoutes = boardRoutes;
	
	//should be in boards route
	var myInviteeRoutes = express.Router();
	app.use('/myInvitees', myInviteeRoutes);
	router.myInviteeRoutes = myInviteeRoutes;
	
	//should be in boards route
	var myBoardRoutes = express.Router();
	app.use('/myBoards', myBoardRoutes);
	router.myBoardRoutes = myBoardRoutes;
	
	//should be in boards route
	var addBoardMediaToBoardRoutes = express.Router();
	app.use('/addBoardMediaToBoard', addBoardMediaToBoardRoutes);
	router.addBoardMediaToBoardRoutes = addBoardMediaToBoardRoutes;
	
	var mediaRoutes = express.Router();
	app.use('/media', mediaRoutes);
	router.mediaRoutes = mediaRoutes;
	
	//added on 24022015 : resolved browser CORS problem
	var proxyRoutes = express.Router();
	app.use('/proxy', proxyRoutes);
	router.proxyRoutes = proxyRoutes;
	
	var originalImageRoutes = express.Router();
	app.use('/assets/Media/img', originalImageRoutes);
	router.originalImageRoutes = originalImageRoutes;
	
	
	var keywordRoutes = express.Router();
	app.use('/keywords', keywordRoutes);
	router.keywordRoutes = keywordRoutes;
	//Creating the custom router for the application - front-end
	
	//Creating the custom router for the application - back-end
	router.admin = {};
	
	var adminRoutes = express.Router();
	app.use('/admin', adminRoutes);
	router.admin.adminRoutes = adminRoutes;
	
	var fsgRoutes = express.Router();
	app.use('/fsg', fsgRoutes);
	router.admin.fsgRoutes = fsgRoutes;
	
	var domainRoutes = express.Router();
	app.use('/domains', domainRoutes);
	router.admin.domainRoutes = domainRoutes;
	
	var collectionRoutes = express.Router();
	app.use('/collections', collectionRoutes);
	router.admin.collectionRoutes = collectionRoutes;
	
	var groupTagRoutes = express.Router();
	app.use('/groupTags', groupTagRoutes);
	router.admin.groupTagRoutes = groupTagRoutes;
	
	var metaMetaTagRoutes = express.Router();
	app.use('/metaMetaTags', metaMetaTagRoutes);
	router.admin.metaMetaTagRoutes = metaMetaTagRoutes;
	
	var gtbindingRoutes = express.Router();
	app.use('/gtbinding', gtbindingRoutes);
	router.admin.gtbindingRoutes = gtbindingRoutes;
	
	var tagRoutes = express.Router();
	app.use('/tags', tagRoutes);
	router.admin.tagRoutes = tagRoutes;
	
	var massmediauploadRoutes = express.Router();
	app.use('/massmediaupload', massmediauploadRoutes);
	router.admin.massmediauploadRoutes = massmediauploadRoutes;
	
	var sourceRoutes = express.Router();
	app.use('/sources', sourceRoutes);
	router.admin.sourceRoutes = sourceRoutes;
	
	var contributionRoutes = express.Router();
	app.use('/contribution', contributionRoutes);
	router.admin.contributionRoutes = contributionRoutes;	
	
	var metaTagRoutes = express.Router();
	app.use('/metaTags', metaTagRoutes);
	router.admin.metaTagRoutes = metaTagRoutes;
	
	//Creating the custom router for the application - back-end
	
	//recorder routing instance
	var recorderRoutes = express.Router();
	app.use('/recorder', recorderRoutes);
	router.recorderRoutes = recorderRoutes;
	
	
	//Creating the custom router for the application - back-end-subadmin
	router.subadmin = {};
	
	var subadminRoutes = express.Router();
	app.use('/subadmin', subadminRoutes);
	router.subadmin.subadminRoutes = subadminRoutes;
	
	//31 july 2015 - collab-7.2
	var chapterRoutes = express.Router();
	app.use('/chapters', chapterRoutes);
	router.chapterRoutes = chapterRoutes;
	
	var pageRoutes = express.Router();
	app.use('/pages', pageRoutes);
	router.pageRoutes = pageRoutes;

	
	var groupRoutes = express.Router();
	app.use('/groups', groupRoutes);
	router.groupRoutes = groupRoutes;
	
	var memberRoutes = express.Router();
	app.use('/members', memberRoutes);
	router.memberRoutes = memberRoutes;
	
	//07 September 2015 - collab-7.2
	var capsuleRoutes = express.Router();
	app.use('/capsules', capsuleRoutes);
	router.capsuleRoutes = capsuleRoutes;
	
	console.log("router :",router);
	return router
}
