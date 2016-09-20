var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('DashboardMgmtCtrl',['$scope', '$location','$timeout','loginService','ChaptersService','PagesService','$rootScope', function($scope, $location, $timeout, loginService,ChaptersService,PagesService,$rootScope){
	//module collabmedia: chapters management
	$scope.DashboardMgmt = (function(){
		var app = {
			chapters : [],
			cChapterObj : {},
			qc : 'all',
			init : function(){
				this.init__pagination();
				$('body').addClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').addClass('chapter');
				startupall()
				this.getAllChapters();
				//this.getAllPaginated();
				this.setQueryCriteria(this.qc);
				this.getPageLibrary();
			},
			init__pagination : function(){
				$scope.paginationData = {};
				$scope.perPage = 50;
				$scope.pageNoPages = 1;
				$scope.pageNoChapter = 1;
			},
			callBrowseScripts : function(){
				$timeout(function(){
					mediaSite.test();
				},50);
			},
			getAllChapters : function(){					//anonymous function : default case
				ChaptersService.getAll()
				//ChaptersService.getLaunchedChapters()
				.then(function(data){
					$scope.DashboardMgmt.chapters = data.data.results;
					$scope.DashboardMgmt.callBrowseScripts();
				});
			},
			getAllPaginated : function(qc){					//anonymous function : default case
				//ChaptersService.getAllPaginated({perPage:$scope.perPage,pageNo:$scope.pageNoChapter,qc:qc ? qc : 'all'})
				ChaptersService.getLaunchedChapters({perPage:$scope.perPage,pageNo:$scope.pageNoChapter,qc:qc ? qc : 'all'})
				.then(function(data){
					$scope.DashboardMgmt.chaptersPaginated = data.data.results;
					$scope.count = data.data.count;
					//$scope.DashboardMgmt.callBrowseScripts();
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
						
					case 'launchedByMe':
						this.getAllPaginated(qc);
						break;
						
					case 'invitationForMe':
						this.getAllPaginated(qc);
						break;
						
					case 'byTheHouse':
						this.getAllPaginated(qc);
						break;
					
					default : 
						this.getAllPaginated('all');
				}
			},
			pageNoChangedChapters : function(no){
				$scope.pageNoChapter = no;
				this.getAllPaginated(this.qc);
			}, 
			viewChapter : function(id){
				PagesService.getAll(id).then(function(data){
					console.log(data);
					if (data.data.status == 200) {
						if (data.data.results.length >0) {
							$rootScope.pageIndex = 0;
							$location.path('/chapter-view/'+id+'/'+data.data.results[0]._id)
						}else{
							alert('There are no pages in this chapter to preview');
						}
					}else{
						$scope.setFlashInstant('Oopss!! something went wrong.');
					}
				})
			},
			getPageLibrary : function(qc){
				//this.isAllowed();
				
				PagesService.getPageLibrary({perPage:$scope.perPage,pageNo:$scope.pageNoPages,qc:qc ? qc : 'all'})
				.then(function(data){
					$scope.DashboardMgmt.page_library = data.data.results;
					$scope.count1 = data.data.count;
				});
			},
			pageNoChangedPages : function(no){
				$scope.pageNoPages = no;
				this.getPageLibrary(this.qc);
			}
		};
		app.init();
		//console.log("app.getAll = ", app.getAll)
		return app;
	})();
	
	//$watchCollection for reordering
	//$scope.$watchCollection("DashboardMgmt.chapters", function(newValue , oldValue) {  
	//	"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.DashboardMgmt.reorder()
	//});
}]);