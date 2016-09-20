var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('PagesMgmtCtrl',['$scope','$stateParams','$location','$timeout','$state','loginService','PagesService','SgPageService', function($scope,$stateParams,$location,$timeout,$state,loginService,PagesService,SgPageService){
	//module collabmedia: Pages management
	$scope.PagesMgmt = (function(){
		var app = {
			capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0, 
			chapter_id : $stateParams.id ? $stateParams.id : 0, 
			friends : [],
			page_library : [],
			pages : [],
			chapterName : "",
			tempChapterName : "Untitled Chapter",
			cPageObj : {},
			qc : 'all',
			sortableOptions : {
				handle: '.chapter-overlay2',
				helper : 'clone',
				revert : true,
				start : function( event, ui ){
					$(event.target).data("ui-sortable").floating = true;
					console.log(ui.helper.find('.chapter-box'));
					ui.helper.find('.chapter-box').removeClass('zoomIn');
				}
			},
			init : function(){
				//$scope.perPage = 50;
				//$scope.pageNo = 1;
				this.init__pagination();
				//this.getPageLibrary();
				this.setQueryCriteria(this.qc);
				//$timeout(function(){
					//$('[data-toggle="tooltip"]').tooltip({placement : 'bottom'})
				//},1000)
				$('body').addClass('page-bg-pic').removeClass('chapter-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('chapter').removeClass('media').addClass('boards');
				console.log(' --inside create page ctrl -- ')
				startupall()
				this.getChapterName();
				this.getAll();
				this.getAllFriends();
				$timeout(function(){
					$scope.PagesMgmt.init_popupAnim();
				},1000)
			},
			init__pagination : function(){
				$scope.perPage = 50;
				$scope.pageNo = 1;
			},
			init_popupAnim : function(){
				$('.open_pop').off('click');
				$('.open_pop2').off('click');
				$('.open_pop').on('click',function(){
					if ($(this).parent().parent().parent().siblings('div').hasClass('abc')) {
						$(this).parent().parent().parent().siblings('div').toggleClass('abc');
					}else{
						$('.send-message-block').removeClass('abc');
						$(this).parent().parent().parent().siblings('div').toggleClass('abc');
						$(this).parent().parent().parent().siblings('div').find('input').focus();
					}
				});
				$('.open_pop2').on('click',function(){
					//console.log($(this).parent().parent().parent().parent());
					if ($(this).parent().parent().parent().parent().siblings('div').hasClass('abc')) {
						$(this).parent().parent().parent().parent().siblings('div').toggleClass('abc');
					}else{
						$('.send-message-block').removeClass('abc');
						$(this).parent().parent().parent().parent().siblings('div').toggleClass('abc');
						$(this).parent().parent().parent().parent().siblings('div').find('input').focus();
					}
				});
			},
			callBrowseScripts : function(){
				$timeout(function(){
					mediaSite.test();
				},50);
			},
			isAllowed : function(){
				if( !this.chapter_id || this.chapter_id == "" || this.chapter_id == null || typeof this.chapter_id == "undefined" ){
					//alert("hi");
					$location.path('/manage-capsules');
					return;
				}
			},
			goTo : function (elemId , minus , plus){
				var body = $('html, body');
				console.log($(elemId).offset());
				body.animate({scrollTop:$(elemId).offset().top - minus}, '500', 'swing', function() { 
				   //alert("Finished animating"+body.scrollTop());
				});
			},
			goTo2 : function (elemId , minus , plus){
				var body = $('html, body');
				body.animate({scrollTop:$(elemId).height() - minus}, '500', 'swing', function() { 
				   //alert("Finished animating"+body.scrollTop());
				});
			},
			getChapterName : function(id){
				this.isAllowed();
				PagesService.getChapterName(this.chapter_id)
					.then(function(data){
						console.log("success",data);
						$scope.PagesMgmt.chapterName = data.data.result;
					});
			},
			getPageLibrary : function(qc){
				this.isAllowed();
				
				PagesService.getPageLibrary({perPage:$scope.perPage,pageNo:$scope.pageNo,qc:qc ? qc : 'all'})
				.then(function(data){
					$scope.PagesMgmt.page_library = data.data.results;
					$scope.count = data.data.count;
				});
			},
			setQueryCriteria : function(qc){
				//alert("called = "+qc);
				this.qc = qc;
				this.init__pagination();
				angular.element('.library-qc li a').removeClass('selected');
				angular.element('.library-qc li a.qc-'+qc).addClass('selected');
				
				switch(qc){
					case 'all':
						this.getPageLibrary(qc);
						break;
						
					case 'createdByMe':
						this.getPageLibrary(qc);
						break;
						
					case 'sharedWithMe':
						this.getPageLibrary(qc);
						break;
					
					case 'byTheHouse':
						this.getPageLibrary(qc);
						break;
						
					default : 
						this.getPageLibrary('all');
				}
			},
			pageChanged : function(no){
				$scope.pageNo = no;
				this.getPageLibrary(this.qc);
				$timeout(function(){
					$scope.PagesMgmt.init_popupAnim();
				},500)
			}, 
			getAll : function(){
				this.isAllowed();
				
				PagesService.getAll(this.chapter_id)
				.then(function(data){
					$scope.PagesMgmt.pages = data.data.results;
				});
			},
			create: function(pageType){
				this.goTo2(".chapter_box" , 250);
				this.isAllowed();
				
				PagesService.create(this.chapter_id , pageType)
				.then(function(data){
					$scope.setFlashInstant('Done.');
					$scope.PagesMgmt.pages.push(data.data.result);
					$scope.PagesMgmt.page_library.push(data.data.result);
					$timeout(function(){
						$scope.PagesMgmt.init_popupAnim();
					},100)
				});
			},
			edit : function( id , pageType ){
				//$location.path('/manage-sg/'+this.chapter_id+"/"+id);
				if(pageType == "gallery"){
					$location.path('/manage-sg/'+this.capsule_id+"/"+this.chapter_id+"/"+id);
				}
				else{
					//$location.path('/manage-cp/'+this.capsule_id+"/"+this.chapter_id+"/"+id);
					$state.go('manageCP2',{capsule_id:this.capsule_id,chapter_id:this.chapter_id,page_id:id});
				}
			},
			duplicate : function( id ){
				this.isAllowed();
				
				PagesService.duplicate( this.chapter_id , id )
				.then(function(data){
					$scope.setFlashInstant('Duplicated.');
					console.log("data = "+ data);
					$scope.PagesMgmt.pages.push(data.data.result);
					$scope.PagesMgmt.page_library.push(data.data.result);
				});	
			},
			share : function( id , share_with_email ){
				this.isAllowed();
				$('.send-message-block').removeClass('abc');
				$scope.setFlashInstant('Sharing...');
				
				//alert("Share Case.");
				//return;
				PagesService.share( this.chapter_id , id , share_with_email )
				.then(function(data){
					$scope.setFlashInstant('Shared.');
					console.log("data = "+ data);
					//$scope.PagesMgmt.pages.push(data.data.result);
					//$scope.PagesMgmt.page_library.push(data.data.result);
					$scope.PagesMgmt.init_popupAnim();
				});	
			},
			addFromLibrary : function( id ){
				this.isAllowed();
				//alert("addFromLibrary case");
				PagesService.addFromLibrary( this.chapter_id , id )
				.then(function(data){
					$scope.setFlashInstant('Added.');
					console.log("data = "+ data);
					$scope.PagesMgmt.pages.push(data.data.result);
					$scope.PagesMgmt.page_library.push(data.data.result);
				});	
			},
			getObjArrayIdxByKey : function(ObjArr , matchKey , matchVal){
				var idx;
				for( var loop = 0; loop < ObjArr.length; loop++ ){
					if (ObjArr[loop].hasOwnProperty(matchKey)) {
						if(ObjArr[loop][matchKey] == matchVal){
							idx = loop;
							break;
						}
					}
				}
				return idx;
			},
			remove : function( id ){
				this.isAllowed();
				PagesService.remove(this.chapter_id , id)
				.then(function(data){
					var idx1 = $scope.PagesMgmt.getObjArrayIdxByKey($scope.PagesMgmt.pages , '_id' , id);
					var idx2 = $scope.PagesMgmt.getObjArrayIdxByKey($scope.PagesMgmt.page_library , '_id' , id);
					if(idx1 >= 0 && idx2 >= 0){
						$scope.setFlashInstant('Removed.');
						$scope.PagesMgmt.pages.splice(idx1 , 1);
						$scope.PagesMgmt.page_library.splice(idx2 , 1);
					}
					else{
						alert("Oops! Something went wrong.");
					}
					//$scope.PagesMgmt.reorder();
				});	
			},
			remove : function( id ){
				this.isAllowed();
				PagesService.remove(this.chapter_id , id)
				.then(function(data){
					var idx1 = $scope.PagesMgmt.getObjArrayIdxByKey($scope.PagesMgmt.pages , '_id' , id);
					if(idx1 >= 0){
						$scope.setFlashInstant('Removed.');
						$scope.PagesMgmt.pages.splice(idx1 , 1);
						var idx2 = $scope.PagesMgmt.getObjArrayIdxByKey($scope.PagesMgmt.page_library , '_id' , id);
						if(idx2 >= 0){
							$scope.setFlashInstant('Removed.');
							$scope.PagesMgmt.page_library.splice(idx2 , 1);
						}
					}
					else{
						var idx2 = $scope.PagesMgmt.getObjArrayIdxByKey($scope.PagesMgmt.page_library , '_id' , id);
						if(idx2 >= 0){
							$scope.setFlashInstant('Removed.');
							$scope.PagesMgmt.page_library.splice(idx2 , 1);
						}
						else{
							alert("Oops! Something went wrong.");
						}
					}
				});	
			},
			cancel: function(){
				$location.path('/manage-pages');
			},
			getReorderedArr : function(){
				var requiredArr = []
				$scope.PagesMgmt.pages.forEach(function(page){
					requiredArr.push(page._id);
				});
				return requiredArr;
			},
			reorder : function(){
				this.isAllowed();
				
				PagesService.reorder(this.chapter_id , $scope.PagesMgmt.getReorderedArr())
				.then(function(data){
					//$scope.PagesMgmt.getAll();
					$scope.PagesMgmt.init_popupAnim();
				});	
				
				this.callBrowseScripts();
			},
			updateChapterName : function (){
				this.isAllowed();
				
				if( $scope.PagesMgmt.chapterName == "" || $scope.PagesMgmt.chapterName == "Untitled Chapter"){
					$scope.PagesMgmt.chapterName = "Untitled Chapter";//$scope.PagesMgmt.tempChapterName;
					//alert($scope.PagesMgmt.chapterName);
				}
				
				PagesService.updateChapterName(this.chapter_id , this.page_id , $scope.PagesMgmt.chapterName)
				.then(function(data){
					//$scope.PagesMgmt.getAll();
				});
				
			},
			openLaunchSetting : function(section){
				$location.path('/ls/'+this.capsule_id+'/'+this.chapter_id);
			},
			getAllFriends: function(){
				PagesService.getAllFriends().then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}else{
						//console.log(data);
						$scope.friends = data.data.friends;
					}
				})
			},
			onTitleClick : function(){
				$scope.PagesMgmt.tempChapterName = $scope.PagesMgmt.chapterName;
				if($scope.PagesMgmt.chapterName == "" || $scope.PagesMgmt.chapterName == "Untitled Chapter")
					$scope.PagesMgmt.chapterName = "";
			},
			updatePageName : function (idx , id , name){
				//this.isAllowed();
				if( name == "" || name == "Untitled Page"){
					angular.element( ".edit-title-box-befor" ).show( "slow" );
					angular.element( ".edit-title-box-befor" ).next().hide( "slow" );
					return;
				}
				SgPageService.updatePageName(this.chapter_id , id , name)
				.then(function(data){
					$scope.PagesMgmt.pages[idx].Title = name;
					angular.element( ".edit-title-box-befor" ).show( "slow" );
					angular.element( ".edit-title-box-befor" ).next().hide( "slow" );
				
				});
			}
		};
		app.init();
		return app;
	})();
	
	//$watchCollection for reordering
	$scope.$watchCollection("PagesMgmt.pages", function(newValue , oldValue) {  
		"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.PagesMgmt.reorder()
	});

}]);