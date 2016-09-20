var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('CpPageMgmtCtrl',['$scope','$stateParams','$location','loginService','CpPageService','$http','$timeout','$filter','$upload','$window', function($scope,$stateParams,$location,loginService,CpPageService,$http,$timeout,$filter,$upload,$window){
	//module collabmedia: Pages management
	$scope.CpPageMgmt = (function(){
		var app = {
                    capsule_id : $stateParams.capsule_id ? $stateParams.capsule_id : 0, 
                    chapter_id : $stateParams.chapter_id ? $stateParams.chapter_id : 0, 
                    page_id : $stateParams.page_id ? $stateParams.page_id : 0,
                    pageName : "",
                    pageData : {},
                    medias : [],
                    fsgs : [],
                    selectedMedia: [],
                    mediaLimit: 30,
                    prevMediaLimit: 30,
                    contentmediaType: [],
                    countries : [],
                    currentCountries:[],
                    remainingCountries:[],
                    keywordList : [],
                    keywordsSelcted : [],
                    selectionType : '',
                    canSelect : true,
                    init : function(){
                            this.isAllowed();
                            $scope.firstAlert = true;
                            startupCreate();
                            $scope.selectedFSGs = {};
                            startupCreate();
                            //angular.element('body').removeClass('page-bg-pic').removeClass('chapter-bg-pic').addClass('creation-section').addClass('content-bg-pic')//.addClass('sg-page');
                            angular.element('[data-toggle="tooltip"]').tooltip();
                            //$('#content').removeClass('chapter').removeClass('boards').addClass('media');
                            console.log(' --inside sg--Create ctrl -- ');
                            //this.init_dragDrop();
                            //this.getPageData();
                            //this.init_masonry();
                            //this.filterSub();
                            //this.get_allFSG();
                            this.per_page = 40;

                    },
                    isAllowed : function(){
                        if( !this.chapter_id || !this.chapter_id || !this.page_id ){
                            $scope.setFlashInstant('<span style="color:red">Access Denied, Redirecting...</span>' , 'error');
                            $timeout(function(){
                                    $location.path('/manage-capsules');
                            },2000)
                            return;
                        }
                    },
                    init_dragDrop : function(){
                        angular.element(".test123").on("dragenter", function(event) {
                            event.preventDefault();
                            angular.element('.popup-overlayer').show();
                            angular.element('.drag-popup').show();
                        });
                        angular.element(".test123").on("dragover", function(event) {
                            event.preventDefault();
                            angular.element('.popup-overlayer').show();
                            angular.element('.drag-popup').show();
                        });

                        angular.element('.test123').on('dragleave',function(event){
                            event.preventDefault();
                            angular.element('.popup-overlayer').hide();
                            angular.element('.drag-popup').hide();
                        })
                        angular.element('body').on('dragleave',function(event){
                            event.preventDefault();
                            angular.element('.popup-overlayer').hide();
                            angular.element('.drag-popup').hide();
                        })
                        angular.element("html").on("drop", function(event) {
                            event.preventDefault();
                            angular.element('.popup-overlayer').hide();
                            angular.element('.drag-popup').hide();
                            event.dataTransfer = event.originalEvent.dataTransfer;
                            var file = event.originalEvent.dataTransfer.files;          
                            if (file.length == 0) {
                               alert('Please drop Image files .');
                            }else if (file.length == 1) {
                                    if ((file[0].type).indexOf('image') != -1) {
                                            var sendFile = [];
                                            sendFile.push(file[0]);
                                            console.log(sendFile[0]);
                                            $scope.SgPageMgmt.uploadHeader(sendFile[0]);
                                    }else{
                                            alert(file.type+" not allowed...");
                                    }
                            }else{
                                    alert('Please drop only one Image at a time');
                            }
                        });
                    },
                    getPageData : function(id){
                        this.isAllowed();
                        CpPageService.getPageData(this.chapter_id , this.page_id)
                            .then(function(data){
                                console.log("success",data);
                                $scope.SgPageMgmt.pageData = data.data.result;
                                $scope.SgPageMgmt.pageData.HeaderImage = $scope.SgPageMgmt.pageData.HeaderImage ? "/assets/Media/headers/aspectfit/"+$scope.SgPageMgmt.pageData.HeaderImage : "";
                                if ($scope.SgPageMgmt.pageData.HeaderImage != '') {
                                    angular.element('.upload.upload-block').removeClass('upload-nopic');
                                }else{
                                    angular.element('.upload.upload-block').addClass('upload-nopic');
                                }
                                if (data.data.result.SelectionCriteria == 'keyword') {
                                    console.log($scope.SgPageMgmt.pageData.SelectedKeywords);
                                    $scope.SgPageMgmt.keywordsSelcted = $scope.SgPageMgmt.pageData.SelectedKeywords;
                                    $scope.current__gtID = $scope.SgPageMgmt.keywordsSelcted[ $scope.SgPageMgmt.keywordsSelcted.length -1 ].id;
                                    this.selectionType = 'keyword';

                                    angular.element('#loader').show().css({'opacity':'1'});
                                    angular.element('.keys').removeClass('activeKey');
                                    angular.element('.keys').removeClass('activeKey');
                                    angular.element('.keys').last().addClass('activeKey');
                                    angular.element('#keyword_slider').scrollLeft($('#keyword_slider ul').width())

                                    angular.element('#theme-btn').addClass('active');
                                    angular.element('#media-btn').removeClass('active');
                                    $scope.SgPageMgmt.canSelect = false;
                                    angular.element('#container .item').removeClass('item-selected');
                                    $scope.SgPageMgmt.selectedMedia=[];
                                    $scope.SgPageMgmt.filterSub();
                                }else{
                                    $scope.SgPageMgmt.selectedMedia = $scope.SgPageMgmt.pageData.SelectedMedia ; 
                                    $scope.SgPageMgmt.selectionType = 'media';
                                    angular.element('#media-btn').addClass('active');
                                    angular.element('#theme-btn').removeClass('active');
                                    $scope.SgPageMgmt.canSelect = true;
                                }
                                $scope.SgPageMgmt.pageName = $scope.SgPageMgmt.pageData.Title;
                            });
                    },
                    updatePageName : function (){
                            this.isAllowed();
                            CpPageService.updatePageName(this.chapter_id , this.page_id , $scope.SgPageMgmt.pageName)
                            .then(function(data){
                            });
                    }
		};
		app.init();
		return app;
	})();
	/*
	//$watchCollection for reordering
	$scope.$watchCollection("PagesMgmt.pages", function(newValue , oldValue) {  
		"undefined" != typeof newValue && "undefined" != typeof oldValue && newValue != oldValue && $scope.PagesMgmt.reorder()
	});
	*/
}]);