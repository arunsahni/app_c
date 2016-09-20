var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('CapsulesMgmtCtrl',['$scope', '$location','$timeout','loginService','CapsulesService','ChaptersService','PagesService','$rootScope', function($scope, $location, $timeout, loginService,CapsulesService,ChaptersService,PagesService,$rootScope){
	//module collabmedia: capsules management
	$scope.CapsulesMgmt = (function(){
		var app = {
			capsules : [],
			cCapsuleObj : {},
			qc : 'all',
			sortableOptions : {
				//axis : 'x',
				//distance : 5,
				handle: '.chapter-overlay2',
				helper : 'clone',
				revert : true,
				//containment: 'parent',
				start : function( event, ui ){
					$(event.target).data("ui-sortable").floating = true;
					console.log(ui.helper.find('.chapter-box'));
					ui.helper.find('.chapter-box').removeClass('zoomIn');
					//$( '.ui-sortable' ).sortable( "refresh" );
					//$( '.ui-sortable' ).sortable( "refreshPositions" );
					//if ($scope.firstSort){  // Call a refresh on ui-sortable on drag of first element.
					//	console.log('inside first sort');
					//	
					//	$scope.firstSort = false;
					//}
				},
				update: function(e, ui) {
					var logEntry = $scope.CapsulesMgmt.capsules.map(function(i){
						return i.Title;
					}).join(', ');
					console.log('before Update: ' + logEntry);
				},
				stop: function(e, ui) {
					// this callback has the changed model
					var logEntry = $scope.CapsulesMgmt.capsules.map(function(i){
						return i.Title;
					}).join(', ');
					console.log('after Stop: ' + logEntry);
				}
			},
			init : function(){
				$scope.firstSort = true;
				//$scope.paginationData = {};
				//$scope.perPage = 50;
				//$scope.pageNo = 1;
				this.init__pagination();
				$('body').addClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').addClass('chapter');
				//$('[data-toggle="tooltip"]').tooltip();
				console.log(' --inside CapsulesMgmtCtrl -- ')
				startupall()
				this.getAll();
				//this.getAllPaginated();
				this.setQueryCriteria(this.qc);
				this.getAllFriends();
				$timeout(function(){
					$scope.CapsulesMgmt.init_popupAnim();
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
						//console.log($(this).parent().parent().parent().siblings('div').find('textarea'));
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
						//console.log($(this).parent().parent().parent().parent().siblings('div').find('textarea'));
						$(this).parent().parent().parent().parent().siblings('div').find('input').focus()
					}
				});
			},
			callBrowseScripts : function(){
                            $timeout(function(){
                                    mediaSite.test();
                            },50);
			},
			getAll : function(){					//anonymous function : default case
				CapsulesService.getAll()
				.then(function(data){
					$scope.CapsulesMgmt.capsules = data.data.results;
					$scope.CapsulesMgmt.callBrowseScripts();
				});
			},
			getAllPaginated : function(qc){					//anonymous function : default case
				CapsulesService.getAllPaginated({perPage:$scope.perPage,pageNo:$scope.pageNo,qc:qc ? qc : 'all'})
				.then(function(data){
					$scope.CapsulesMgmt.capsulesPaginated = data.data.results;
					$scope.count = data.data.count;
					//$scope.CapsulesMgmt.callBrowseScripts();
					$timeout(function(){
						$scope.CapsulesMgmt.init_popupAnim();
					},1000);
					
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
					$scope.CapsulesMgmt.init_popupAnim();
				},500)
			}, 
			create: function(){
				CapsulesService.create()
				.then(function(data){
					$scope.setFlashInstant('Done.');
					$scope.CapsulesMgmt.capsules.push(data.data.result);
					$scope.CapsulesMgmt.setQueryCriteria(this.qc);
					$timeout(function(){
						$scope.CapsulesMgmt.init_popupAnim();
					},100)
					//$scope.CapsulesMgmt.reorder();
				});	
			},
			edit : function( id ){
				$location.path('/manage-pages');
			},
			duplicate : function( id ){
				CapsulesService.duplicate( id )
				.then(function(data){
					$scope.setFlashInstant('Duplicated.');
					console.log("data = "+ data);
					$scope.CapsulesMgmt.capsules.push(data.data.result);
					$scope.CapsulesMgmt.setQueryCriteria(this.qc);
					//$scope.CapsulesMgmt.reorder();
				});	
			},
			addFromLibrary : function( id ){
				CapsulesService.addFromLibrary( id )
				.then(function(data){
					$scope.setFlashInstant('Added.');
					console.log("data = "+ data);
					$scope.CapsulesMgmt.capsules.push(data.data.result);
					$scope.CapsulesMgmt.setQueryCriteria(this.qc);
					//$scope.CapsulesMgmt.reorder();
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
				CapsulesService.remove(id)
				.then(function(data){
					var idx = $scope.CapsulesMgmt.getObjArrayIdxByKey($scope.CapsulesMgmt.capsules , '_id' , id);
					if(idx >= 0){
						$scope.CapsulesMgmt.capsules.splice(idx , 1);
						$scope.CapsulesMgmt.setQueryCriteria(this.qc);
						$scope.setFlashInstant('Removed.');
						
						var idx = $scope.CapsulesMgmt.getObjArrayIdxByKey($scope.CapsulesMgmt.capsulesPaginated , '_id' , id);
						if(idx >= 0){
							$scope.setFlashInstant('Removed.');
							$scope.CapsulesMgmt.capsulesPaginated.splice(idx , 1);
							$scope.CapsulesMgmt.setQueryCriteria(this.qc);
						}
					}
					else{
						var idx = $scope.CapsulesMgmt.getObjArrayIdxByKey($scope.CapsulesMgmt.capsulesPaginated , '_id' , id);
						if(idx >= 0){
							$scope.setFlashInstant('Removed.');
							$scope.CapsulesMgmt.capsulesPaginated.splice(idx , 1);
							$scope.CapsulesMgmt.setQueryCriteria(this.qc);
						}
						else{
							alert("Oops! Something went wrong.");
						}
					}
					//$scope.CapsulesMgmt.reorder();
				});	
			},
			cancel: function(){
				this.cCapsuleObj = {};
				$location.path('/manageCapsules');
			},
			getReorderedArr : function(){
				var requiredArr = []
				$scope.CapsulesMgmt.capsules.forEach(function(capsule){
					requiredArr.push(capsule._id);
				});
				return requiredArr;
			},
			reorder : function(){
				CapsulesService.reorder($scope.CapsulesMgmt.getReorderedArr())
				.then(function(data){
					console.log("reordered....");
					$scope.CapsulesMgmt.init_popupAnim();
				});	
				
				this.callBrowseScripts();
			},
			preview : function(id){
				PagesService.getAll(id).then(function(data){
					console.log(data);
					if (data.data.status == 200) {
						if (data.data.results.length >0) {
							$rootScope.pageIndex = 0;
							$location.path('/capsule-preview/'+id+'/'+data.data.results[0]._id)
						}else{
							alert('There are no pages in this capsule to preview');
						}
					}else{
						$scope.setFlashInstant('Oopss!! something went wrong.');
					}
				})
			},
			init_edit : function( id ){
				$location.path('/manage-chapters/'+id);
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
				//this.isAllowed();
				$('.send-message-block').removeClass('abc');
				$scope.setFlashInstant('Sharing...');
				
				CapsulesService.share( id , share_with_email )
				.then(function(data){
					$scope.setFlashInstant('Shared.');
					console.log("data = "+ data);
					//$scope.PagesMgmt.pages.push(data.data.result);
					//$scope.PagesMgmt.page_library.push(data.data.result);
					$scope.CapsulesMgmt.init_popupAnim();
				});	
			},
			updateCapsuleName : function (idx , capsuleId , capsuleName){
				//this.isAllowed();
				if( capsuleName == "" || capsuleName == "Untitled Capsule"){
					angular.element( ".edit-title-box-befor" ).show( "slow" );
					angular.element( ".edit-title-box-befor" ).next().hide( "slow" );
					return;
				}
				ChaptersService.updateCapsuleName(capsuleId , "" , capsuleName)
				.then(function(data){
					$scope.CapsulesMgmt.capsules[idx].Title = capsuleName;
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
	$scope.$watchCollection("CapsulesMgmt.capsules", function(newValue , oldValue) {  
		"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.CapsulesMgmt.reorder()
	});
}]);