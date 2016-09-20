var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('ChaptersMgmtCtrl',['$scope', '$location','$timeout','$stateParams','$window','loginService','ChaptersService','PagesService','$rootScope','LSService', function($scope, $location, $timeout,$stateParams,$window,loginService,ChaptersService,PagesService,$rootScope,LSService){
	//module collabmedia: chapters management
	$scope.ChaptersMgmt = (function(){
		var app = {
			capsule_id : $stateParams.id ? $stateParams.id : 0, 
			capsuleName : "",
			tempCapsuleName : "",
			chapters : [],
			cChapterObj : {},
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
				//$scope.paginationData = {};
				//$scope.perPage = 50;
				//$scope.pageNo = 1;
				this.init__pagination();
				$('body').addClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('media').addClass('chapter');
				//$('[data-toggle="tooltip"]').tooltip();
				console.log(' --inside chapterMgmtCtrl -- ')
				startupall()
				this.getAll();
				this.getCapsuleData();
				//this.getAllPaginated();
				this.setQueryCriteria(this.qc);
				this.getAllFriends();
				$timeout(function(){
					$scope.ChaptersMgmt.init_popupAnim();
				},1000)
			},
			init__pagination : function(){
				$scope.paginationData = {};
				$scope.perPage = 50;
				$scope.pageNo = 1;
			},
			init_popupAnim : function(){
				$('.open_pop').off('click');
				$('.open_pop2').off('click');
				$('.open_pop').on('click',function(){
					console.log('called');
					if ($(this).parent().parent().parent().siblings('div').hasClass('abc')) {
						$(this).parent().parent().parent().siblings('div').toggleClass('abc');
					}else{
						$('.send-message-block').removeClass('abc');
						$(this).parent().parent().parent().siblings('div').toggleClass('abc');
						$(this).parent().parent().parent().siblings('div').find('input').focus();
					}
				});
				$('.open_pop2').on('click',function(){
					console.log('called');
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
				if( !this.capsule_id || this.capsule_id == "" || this.capsule_id == null || typeof this.capsule_id == "undefined" ){
					//alert("hi");
					$location.path('/manage-capsules');
					return;
				}
			},
			getAll : function(){					//anonymous function : default case
				ChaptersService.getAll(this.capsule_id)
				.then(function(data){
					$scope.ChaptersMgmt.chapters = data.data.results;
					$scope.ChaptersMgmt.callBrowseScripts();
				});
			},
			getAllPaginated : function(qc){					//anonymous function : default case
				ChaptersService.getAllPaginated({perPage:$scope.perPage,pageNo:$scope.pageNo,qc:qc ? qc : 'all'} , this.capsule_id)
				.then(function(data){
					$scope.ChaptersMgmt.chaptersPaginated = data.data.results;
					$scope.count = data.data.count;
					//$scope.ChaptersMgmt.callBrowseScripts();
					$timeout(function(){
						$scope.ChaptersMgmt.init_popupAnim();
					},1000);
				});
			},
			getCapsuleData : function(){
				ChaptersService.currentCapsule(this.capsule_id).then(function(data){
					$scope.currentCapsule = data.data.result;
					if ($scope.currentCapsule.Title) {
						$scope.ChaptersMgmt.capsuleName = $scope.currentCapsule.Title;
					}
				})
			},
			updateCapsuleName : function (){
				this.isAllowed();
				if( $scope.ChaptersMgmt.capsuleName == "" || $scope.ChaptersMgmt.capsuleName == "Untitled Capsule"){
					$scope.ChaptersMgmt.capsuleName = $scope.ChaptersMgmt.tempCapsuleName;
					//alert($scope.ChaptersMgmt.capsuleName);
				}
				ChaptersService.updateCapsuleName(this.capsule_id , this.chapter_id , $scope.ChaptersMgmt.capsuleName)
				.then(function(data){
					//$scope.PagesMgmt.getAll();
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
						this.getAllPaginated(qc);
						break;
						
					case 'createdByMe':
						this.getAllPaginated(qc);
						break;
						
					case 'sharedWithMe':
						this.getAllPaginated(qc);
						break;
					
					case 'createdForMe':
						this.getAllPaginated(qc);
						break;
					
					case 'byTheHouse':
						this.getAllPaginated(qc);
						break;
					
					default : 
						this.getAllPaginated('all');
				}
			},
			pageChanged : function(no){
				$scope.pageNo = no;
				this.getAllPaginated(this.qc);
				$timeout(function(){
					$scope.ChaptersMgmt.init_popupAnim();
				},500)
			}, 
			create: function(){
				ChaptersService.create(this.capsule_id)
				.then(function(data){
					$scope.setFlashInstant('Done.');
					$scope.ChaptersMgmt.chapters.push(data.data.result);
					$scope.ChaptersMgmt.setQueryCriteria(this.qc);
					$timeout(function(){
						$scope.ChaptersMgmt.init_popupAnim();
					},100)
					//$scope.ChaptersMgmt.reorder();
				});	
			},
			edit : function( id ){
				$location.path('/manage-pages');
			},
			duplicate : function( id ){
				ChaptersService.duplicate( id )
				.then(function(data){
					$scope.setFlashInstant('Duplicated.');
					console.log("data = "+ data);
					$scope.ChaptersMgmt.chapters.push(data.data.result);
					$scope.ChaptersMgmt.setQueryCriteria(this.qc);
					//$scope.ChaptersMgmt.reorder();
				});	
			},
			addFromLibrary : function( id ){
				ChaptersService.addFromLibrary( id , this.capsule_id )
				.then(function(data){
					$scope.setFlashInstant('Added.');
					console.log("data = "+ data);
					$scope.ChaptersMgmt.chapters.push(data.data.result);
					$scope.ChaptersMgmt.setQueryCriteria(this.qc);
					//$scope.ChaptersMgmt.reorder();
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
				ChaptersService.remove(id)
				.then(function(data){
					var idx = $scope.ChaptersMgmt.getObjArrayIdxByKey($scope.ChaptersMgmt.chapters , '_id' , id);
					if(idx >= 0){
						$scope.setFlashInstant('Removed.');
						$scope.ChaptersMgmt.chapters.splice(idx , 1);
						$scope.ChaptersMgmt.setQueryCriteria(this.qc);
						
						var idx = $scope.ChaptersMgmt.getObjArrayIdxByKey($scope.ChaptersMgmt.chaptersPaginated , '_id' , id);
						if(idx >= 0){
							$scope.setFlashInstant('Removed.');
							$scope.ChaptersMgmt.chaptersPaginated.splice(idx , 1);
							$scope.ChaptersMgmt.setQueryCriteria(this.qc);
						}
					}
					else{
					
						var idx = $scope.ChaptersMgmt.getObjArrayIdxByKey($scope.ChaptersMgmt.chaptersPaginated , '_id' , id);
						if(idx >= 0){
							$scope.setFlashInstant('Removed.');
							$scope.ChaptersMgmt.chaptersPaginated.splice(idx , 1);
							$scope.ChaptersMgmt.setQueryCriteria(this.qc);
						}
						else{
							alert("Oops! Something went wrong.");
						}
					}
					//$scope.ChaptersMgmt.reorder();
				});	
			},
			cancel: function(){
				this.cChapterObj = {};
				$location.path('/manageChapters');
			},
			getReorderedArr : function(){
				var requiredArr = []
				$scope.ChaptersMgmt.chapters.forEach(function(chapter){
					requiredArr.push(chapter._id);
				});
				return requiredArr;
			},
			reorder : function(){
				ChaptersService.reorder($scope.ChaptersMgmt.getReorderedArr())
				.then(function(data){
					console.log("reordered....");
					$timeout(function(){
						$scope.ChaptersMgmt.init_popupAnim();
					},1000);
				});	
				
				this.callBrowseScripts();
			},
			preview : function(id){
				//PagesService.getAll(id).then(function(data){
				PagesService.getAllPages(id).then(function(data){
					console.log(data);
					if (data.data.status == 200) {
						if (data.data.results.length >0) {
							$rootScope.pageIndex = 0;
							//$location.path('/chapter-preview/'+id+'/'+data.data.results[0]._id)
							$window.open('#/chapter-preview/'+id+'/'+data.data.results[0]._id)
						}else{
							alert('There are no pages in this chapter to preview');
						}
					}else{
						$scope.setFlashInstant('Oopss!! something went wrong.');
					}
				})
			},
			init_edit : function( id ){
				$location.path('/manage-pages/'+this.capsule_id+'/'+id);
			},
			openLaunchSetting : function(section){
				//alert("called = "+this.capsule_id);
				LSService.getChapters(this.capsule_id).then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}else{
						console.log(data);
						if (data.data.chapter_ids.length == 0) {
							alert('There are no chapters under this capsule.');
						}else{
							$location.path('/ls/'+$scope.ChaptersMgmt.capsule_id);
						}
					}
				});
				//$location.path('/ls/'+this.capsule_id);
			},
			openLaunchSetting : function(section){
				//alert("called = "+this.capsule_id);
				/*
				LSService.getChapters(this.capsule_id).then(function(data){
					if (data.data.code==400) {
						$scope.setFlashInstant('Opps!! Something went wrong' , 'success');
					}else{
						console.log(data);
						if (data.data.chapter_ids.length == 0) {
							alert('There are no chapters under this capsule.');
						}else{
							$location.path('/ls/'+$scope.ChaptersMgmt.capsule_id);
						}
					}
				});
				*/
				$location.path('/ls/'+$scope.ChaptersMgmt.capsule_id);
				//$location.path('/ls/'+this.capsule_id);
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
			share : function( id , share_with_email ){
				this.isAllowed();
				$('.send-message-block').removeClass('abc');
				$scope.setFlashInstant('Sharing...');
				
				ChaptersService.share( id , share_with_email )
				.then(function(data){
					$scope.setFlashInstant('Shared.');
					console.log("data = "+ data);
					//$scope.PagesMgmt.pages.push(data.data.result);
					//$scope.PagesMgmt.page_library.push(data.data.result);
					$scope.ChaptersMgmt.init_popupAnim();
				});	
			},
			onTitleClick : function(){
				$scope.ChaptersMgmt.tempCapsuleName = $scope.ChaptersMgmt.capsuleName;
				$scope.ChaptersMgmt.capsuleName = "";
			},
			updateChapterName : function (idx , id , name){
				//this.isAllowed();
				if( name == "" || name == "Untitled Chapter"){
					angular.element( ".edit-title-box-befor" ).show( "slow" );
					angular.element( ".edit-title-box-befor" ).next().hide( "slow" );
					return;
				}
				PagesService.updateChapterName(id , "" , name)
				.then(function(data){
					$scope.ChaptersMgmt.chapters[idx].Title = name;
					angular.element( ".edit-title-box-befor" ).show( "slow" );
					angular.element( ".edit-title-box-befor" ).next().hide( "slow" );
					//$scope.PagesMgmt.getAll();
				});
			}
		};
		app.init();
		//console.log("app.getAll = ", app.getAll)
		return app;
	})();
	
	//$watchCollection for reordering
	$scope.$watchCollection("ChaptersMgmt.chapters", function(newValue , oldValue) {  
		"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.ChaptersMgmt.reorder()
	});
}]);