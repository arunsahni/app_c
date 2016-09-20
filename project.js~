
/*

* Date - 3 June 2014
* Comments - Creates the instance of the application and sets the environment
*/

//Setting default environment for NodeJS process
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Create and configure the instance for ExpressJS app
var app = require('express')();

//manages while file uploading
//process.env.TMPDIR = './server/.tmp';
//process.env.TMPDIR = __dirname+'/server/.tmp';
process.env.TMPDIR = __dirname+'/server/temp';

//This call returns the custom router to add api routes
var router = require('./config/express/config.js')(app); 

//Getting instance for database
//var db = require('./config/database.js')();
var mongoose = require("mongoose");

var dbURI = "mongodb://localhost/cm-arun";
//  var dbURI = "mongodb://192.168.0.212/collab_7_2_revised_cp";

mongoose.connect(dbURI);

//Loading Mongoose models
require('./server/models.js')();

//Loading custom middle-wares - back-end
require('./server/adminMiddlewares.js')(router.admin.adminRoutes);
require('./server/adminMiddlewares.js')(router.admin.fsgRoutes);
require('./server/adminMiddlewares.js')(router.admin.domainRoutes);
require('./server/adminMiddlewares.js')(router.admin.collectionRoutes);
require('./server/adminMiddlewares.js')(router.admin.groupTagRoutes);
require('./server/adminMiddlewares.js')(router.admin.metaMetaTagRoutes);
require('./server/adminMiddlewares.js')(router.admin.gtbindingRoutes);
require('./server/adminMiddlewares.js')(router.admin.tagRoutes);
require('./server/adminMiddlewares.js')(router.admin.massmediauploadRoutes);
require('./server/adminMiddlewares.js')(router.admin.sourceRoutes);
require('./server/adminMiddlewares.js')(router.admin.contributionRoutes);
require('./server/adminMiddlewares.js')(router.admin.metaTagRoutes);

require('./server/subAdminMiddlewares.js')(router.subadmin.subadminRoutes);

//Loading custom middle-wares - back-end

//Loading API routes & registering with applied middle-ware - back-end
require('./server/routes/admin/api/adminRoutes.js')(router.admin.adminRoutes);
require('./server/routes/admin/api/fsgRoutes.js')(router.admin.fsgRoutes);
require('./server/routes/admin/api/domainRoutes.js')(router.admin.domainRoutes);
require('./server/routes/admin/api/collectionRoutes.js')(router.admin.collectionRoutes);
require('./server/routes/admin/api/groupTagRoutes.js')(router.admin.groupTagRoutes);
require('./server/routes/admin/api/metaMetaTagRoutes.js')(router.admin.metaMetaTagRoutes);
require('./server/routes/admin/api/gtbindingRoutes.js')(router.admin.gtbindingRoutes);
require('./server/routes/admin/api/tagRoutes.js')(router.admin.tagRoutes);
require('./server/routes/admin/api/massmediauploadRoutes.js')(router.admin.massmediauploadRoutes);
require('./server/routes/admin/api/sourceRoutes.js')(router.admin.sourceRoutes);
require('./server/routes/admin/api/contributionRoutes.js')(router.admin.contributionRoutes);
require('./server/routes/admin/api/metaTagRoutes.js')(router.admin.metaTagRoutes);
//Loading API routes & registering with applied middle-ware - back-end

require('./server/routes/subadmin/api/subAdminRoutes.js')(router.subadmin.subadminRoutes);

//Loading API rotes for Capsules.
//require('./server/routes/capsule/api/capsuleRoutes.js')(router);

//Loading custom middle-wares - front-end
require('./server/middlewares.js')(router.userRoutes);
require('./server/middlewares.js')(router.projectRoutes);
require('./server/middlewares.js')(router.boardRoutes);
require('./server/middlewares.js')(router.myInviteeRoutes);
require('./server/middlewares.js')(router.myBoardRoutes);
require('./server/middlewares.js')(router.addBoardMediaToBoardRoutes);
require('./server/middlewares.js')(router.mediaRoutes);
require('./server/middlewares.js')(router.proxyRoutes);

require('./server/middlewares.js')(router.originalImageRoutes);

require('./server/middlewares.js')(router.keywordRoutes);

require('./server/middlewares.js')(router.chapterRoutes);

require('./server/middlewares.js')(router.groupRoutes);

require('./server/middlewares.js')(router.memberRoutes);

require('./server/middlewares.js')(router.pageRoutes);

require('./server/middlewares.js')(router.capsuleRoutes);
//Loading custom middle-wares - front-end

//Loading API routes & registering with applied middle-ware - front-end
require('./server/routes/frontend/api/userRoutes.js')(router.userRoutes);
require('./server/routes/frontend/api/projectRoutes.js')(router.projectRoutes);
require('./server/routes/frontend/api/boardRoutes.js')(router.boardRoutes);
require('./server/routes/frontend/api/myInviteeRoutes.js')(router.myInviteeRoutes);
require('./server/routes/frontend/api/myBoardRoutes.js')(router.myBoardRoutes);
require('./server/routes/frontend/api/addBoardMediaToBoardRoutes.js')(router.addBoardMediaToBoardRoutes);
require('./server/routes/frontend/api/mediaRoutes.js')(router.mediaRoutes);

require('./server/routes/frontend/api/proxyRoutes.js')(router.proxyRoutes);

require('./server/routes/frontend/api/keywordRoutes.js')(router.keywordRoutes);

require('./server/routes/frontend/api/chapterRoutes.js')(router.chapterRoutes);

require('./server/routes/frontend/api/groupRoutes.js')(router.groupRoutes);

require('./server/routes/frontend/api/memberRoutes.js')(router.memberRoutes);

require('./server/routes/frontend/api/pageRoutes.js')(router.pageRoutes);

require('./server/routes/frontend/api/capsuleRoutes.js')(router.capsuleRoutes);
//Loading API routes & registering with applied middle-ware - front-end


//Loading recorder routing code //check /config/express/config.js last lines for more detail
//require('./server/routes/recorder/api/recorderRoutes.js')(router.recorderRoutes);
console.log("jhkjhkh")
var server = require('./server/routes/recorder/api/server.js'),
handlers = require('./server/routes/recorder/api/handlers.js'),
routernew = require('./server/routes/recorder/api/router.js'),
handle = { };

handle["/recorder/uploadRecordedVideo"] = handlers.upload;
handle._static = handlers.serveStatic;
app.post('/recorder/uploadRecordedVideo',function(req,res){
	console.log("m here");
	server.start(routernew.route, handle,req,res);
});


//require('./server/routes/recorder/api/recorderRoutes.js');
//Loading recorder routing code


//run for all routes/ request
console.log("app : ",app);


app.use(function(req , res , next){
	reqUrl = req.baseUrl + req.path;
	console.log("\nrequest url : ",reqUrl);
	console.log("some other routes called......\n");
	next();
});

//Serving Index.html
//render layout code at last
//front-end renders
app.get('/',function(req,res){
	console.log("----------- Memory Usage ------------------------ ");
	console.log("Memory Statistics : ",process.memoryUsage())                // Returns an object describing the memory usage of the Node process measured in bytes.
	console.log("----------- Memory Usage ------------------------ ");
	console.log("-----------requested host = ",req.headers.host);
	res.render('layouts/frontend/frontLayout.html');
	/*
	if(req.headers.host == 'beta.scrpt.com'){
		console.log("m here");
		res.render('layouts/frontend/frontLayout.html');
	}
	else{
		res.render(__dirname+'/public/static.scrpt.com/static_index.html');
	}
	*/
	
});

app.get('/board',function(req,res){
	console.log("I have to render board layout.");
	//res.render('layouts/frontend/boardsLayout.html');
	res.render('layouts/frontend/capsuleLayout.html');
});

app.get('/capsule',function(req,res){
	console.log("I have to render board layout.");
	//res.render('layouts/frontend/boardsLayout.html');
	res.render('layouts/frontend/capsuleLayout.html');
});

//back-end renders
app.get('/admin_panel',function(req,res){
	res.render('layouts/backend/login.html');
});
//Serving Index.html
app.get('/subadmin',function(req,res){
	res.render('layouts/backend/subAdminLayout.html');
});
/*
var bugsense = require('node-bugsense').setAPIKey('1664acda');

//catch all errors in the application
process.on('uncaughtException', function (error) {
  console.error(error.stack);
  bugsense.logError(error)
});
*/
//throw new Error("Hmmm we crashed!");

app.listen(process.env.PORT, function(){
	console.log('-----------------------------------------------------------------------------------------------');
	console.log('');
	console.log('Application now running on port \'' + process.env.PORT + '\' under the \'' + process.env.NODE_ENV + '\' environment');
	console.log('');
	console.log('-----------------------------------------------------------------------------------------------');
	
	//throw new Error("Hmmm we crashed!");
});
