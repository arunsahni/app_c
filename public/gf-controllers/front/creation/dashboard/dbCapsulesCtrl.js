var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('DbCapsulesCtrl',['$scope', '$location','$timeout','loginService','DbCapsulesService','PagesService','$rootScope', function($scope, $location, $timeout, loginService,DbCapsulesService,PagesService,$rootScope){
	//module collabmedia: capsules management
	$scope.DbCapsules = (function(){
		var app = {
			capsules : [],
			cCapsuleObj : {},
			qc : 'allPublished',
			init : function(){
				this.init__pagination();
				$('body').addClass('chapter-bg-pic').removeClass('page-bg-pic').addClass('creation-section').addClass('content-bg-pic');
				$('#content').removeClass('boards').removeClass('media').addClass('chapter');
				console.log(' --inside CapsulesMgmtCtrl -- ')
				startupall()
				//this.getAll();
				//this.getAllPaginated();
				this.setQueryCriteria(this.qc);
				//this.getAllFriends();
				$timeout(function(){
					$scope.DbCapsules.init_popupAnim();
				},1000)
			},
			init__pagination : function(){
				$scope.paginationData = {};
				$scope.perPage = 25;
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
			getAll : function(){					
				DbCapsulesService.getAll()
				.then(function(data){
					$scope.DbCapsules.capsules = data.data.results;
					$scope.DbCapsules.callBrowseScripts();
				});
			},
			getAllPaginated : function(qc){					
				DbCapsulesService.getAllPaginated({perPage:$scope.perPage,pageNo:$scope.pageNo,qc:qc ? qc : 'allPublished'})
				.then(function(data){
					$scope.DbCapsules.capsulesPaginated = data.data.results;
					$scope.count = data.data.count;
					//$scope.DbCapsules.callBrowseScripts();
				});
			},
			setQueryCriteria : function(qc){
				//alert("called = "+qc);
				this.qc = qc;
				this.init__pagination();
				angular.element('.library-qc li a').removeClass('selected');
				angular.element('.library-qc li a.qc-'+qc).addClass('selected');
				
				switch(qc){
					case 'allPublished':
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
					
					case 'publishedByMe':
						this.getAllPaginated(qc);
						break;
						
					case 'publishedForMe':
						this.getAllPaginated(qc);
						break;
						
					case 'invitationForMe':
						this.getAllPaginated(qc);
						break;
					
					default : 
						this.getAllPaginated('allPublished');
				}
			},
			pageChanged : function(no){
				$scope.pageNo = no;
				this.getAllPaginated(this.qc);
				$timeout(function(){
					$scope.DbCapsules.init_popupAnim();
				},500)
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
				DbCapsulesService.remove(id)
				.then(function(data){
					var idx = $scope.DbCapsules.getObjArrayIdxByKey($scope.DbCapsules.capsules , '_id' , id);
					if(idx >= 0){
						$scope.DbCapsules.capsules.splice(idx , 1);
						$scope.DbCapsules.setQueryCriteria(this.qc);
						$scope.setFlashInstant('Removed.');
					}
					else{
						alert("Oops! Something went wrong.");
					}
					//$scope.DbCapsules.reorder();
				});	
			},
			getReorderedArr : function(){
				var requiredArr = []
				$scope.DbCapsules.capsules.forEach(function(capsule){
					requiredArr.push(capsule._id);
				});
				return requiredArr;
			},
			reorder : function(){
				DbCapsulesService.reorder($scope.DbCapsules.getReorderedArr())
				.then(function(data){
					console.log("reordered....");
					$scope.DbCapsules.init_popupAnim();
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
				$location.path('/dashboard-chapters/'+id);
			}		
		};
		app.init();
		//console.log("app.getAll = ", app.getAll)
		return app;
	})();
	
	//$watchCollection for reordering
	/*
	$scope.$watchCollection("DbCapsules.capsules", function(newValue , oldValue) {  
		"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.DbCapsules.reorder()
	});
	*/
}]);