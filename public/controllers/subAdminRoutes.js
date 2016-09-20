var collabmedia = angular.module('collabmedia');
//alert(1);
collabmedia.directive('autoFocus', function($timeout) {
  return {
    link: {
      pre: function(scope, element, attr) {
        console.log('prelink executed for');
      },
      post: function(scope, element, attr) {
        console.log('postlink executed');
        $timeout(function() {
	element[0].focus();
	});
      }
    }
  }
});


collabmedia.run(['$rootScope', '$state',function($rootScope, $state){

  $rootScope.$on('$stateChangeStart',function(){
      console.log('$stateChangeStart');
	  $('body').addClass('wait');
 });


  $rootScope.$on('$stateChangeSuccess',function(){
      console.log('$stateChangeSuccess');
	  setTimeout(function(){$('body').removeClass('wait');},0)
	  
	});
   $rootScope.$on('$stateChangeError',function(){
      console.log('$stateChangeError');
	  setTimeout(function(){$('body').removeClass('wait');},0)
	  
 });

}]);
/*

directive added by parul on 06022015
for mass media manager auto complete search box

*/
collabmedia.directive('autoCompleteMedia', function($timeout,$http) {
    return function(scope, iElement, iAttrs) {
	  //alert(1);
			//iElement.autocomplete( "enable" );
			scope.$watch(iAttrs.autoCompleteMedia, function(value) {
			  scope.selcted={};
			   scope.selcted.Media="";
			  if (value == 'platform') {
				scope.selcted.locator = 'platform';
				scope.mediaList=[];
				//$http.post('/massmediaupload/view/all',{}).then(function (data, status, headers, config) {
				$http.post('/massmediaupload/searchByLocatorList',{}).then(function (data, status, headers, config) {	//updated by manishp on 10032016 - blind code
					scope.locatorAutoCompleteData=data.data.response;
					for (i in scope.locatorAutoCompleteData) {
						var temp={}
						if (scope.locatorAutoCompleteData[i].AutoId != null && scope.locatorAutoCompleteData[i].AutoId != '' && scope.locatorAutoCompleteData[i].AutoId != undefined) {
							//console.log($scope.locatorAutoCompleteData[i]);
							temp.label = scope.locatorAutoCompleteData[i].AutoId;
							//temp.recordLocator= $scope.locatorAutoCompleteData[i].Locator;
							//temp.platformLocator= $scope.locatorAutoCompleteData[i].AutoID;
							temp.value = scope.locatorAutoCompleteData[i]._id;
							scope.mediaList.push(temp);
						}
						
					}
					
				});
				iElement.autocomplete({
					  //appendTo: "#autoCom",
					 source: scope[iAttrs.uiItems],
					 select:function (event, ui) {
						 console.log(ui.item.label)
						 scope.selcted.Media = ui.item.label;
						 scope.selcted.MediaId = ui.item.value;
						 scope.$apply();
						 //alert(scope.selctedMedia);
						 return false;
					 },
					 focus:function (event, ui) {
						scope.selcted.Media = ui.item.label;
						 //scope.selcted.MediaId = ui.item.value;
						 scope.$apply();
						 return false;
					 }
				 });
			  }else if (value == 'record') {
				
				scope.selcted.locator = 'record';
				scope.mediaList=[];
				//$http.post('/massmediaupload/view/all',{}).then(function (data, status, headers, config) {
				$http.post('/massmediaupload/searchByLocatorList',{}).then(function (data, status, headers, config) {	
					scope.locatorAutoCompleteData=data.data.response;
					for (i in scope.locatorAutoCompleteData) {
						if (scope.locatorAutoCompleteData[i].Locator != null && scope.locatorAutoCompleteData[i].Locator != '' && scope.locatorAutoCompleteData[i].Locator != undefined) {
							var temp={}
							//console.log($scope.locatorAutoCompleteData[i]);
							temp.label = scope.locatorAutoCompleteData[i].Locator;
							temp.value = scope.locatorAutoCompleteData[i]._id;
							scope.mediaList.push(temp);
						}
						//var temp={}
						////console.log($scope.locatorAutoCompleteData[i]);
						//temp.label = scope.locatorAutoCompleteData[i].Locator;
						//temp.value = scope.locatorAutoCompleteData[i]._id;
						//scope.mediaList.push(temp);
					}
				  iElement.autocomplete({
					  //appendTo: "#autoCom",
					 source: scope[iAttrs.uiItems],
					 select:function (event, ui) {
						 console.log(ui.item.label)
						 scope.selcted.Media = ui.item.label;
						 //scope.selcted.MediaId = ui.item.value;
						 scope.$apply();
						 //alert(scope.selctedMedia);
						 return false;
					 },
					 focus:function (event, ui) {
					  scope.selcted.Media = ui.item.label;
					  scope.$apply();
						 return false;
					 }
				 });
			  
			  //console.log(iElement);
			  //scope.$apply();
			  //console.log(scope[iAttrs.uiItems]);
			  
			  
			});
		}
			});
	}
});
collabmedia.config(function($stateProvider,$urlRouterProvider,$httpProvider) {
 
	//code for IE redirection after login issue added on 09012014 suggested by vinodb
	var init_IE = function(){
		$httpProvider.defaults.cache = false;
		if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
		}
		// disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
	}
	init_IE();
 
  // functions to check admin's login state
  
 //----------------------------------------interceptor-block start-----------------// 
  
  /// check if admin is logged in
  
  var checkLoggedin = function($q, $timeout, $http, $location,$rootScope,$window)
	{ 
		var deferred = $q.defer(); 
		$http.get('/subadmin/chklogin').success(function(user)
		{ 
			if (user !== '0') {
			  console.log('case1');
			  $timeout(deferred.resolve, 0); 
			}
			else 
			{
			  console.log('case2');
			  $rootScope.message = 'You need to log in.'; 
			  $timeout(function(){
			  	deferred.reject();
			  },0); 
			  //$window.location.href='/admin/#/';
			  $location.path('/');
			}
		});
		      return deferred.promise;
	};

  // check if admin is logged out
  var checkLoggedOut = function($q, $timeout, $http, $location, $rootScope,$window)
	{ 
		var deferred = $q.defer(); 
		$http.get('/subadmin/chklogin').success(function(user)
		{
			  
			if (user !== '0') {
			$timeout(deferred.reject, 0);
			console.log('case3'); 
			$location.path('/dashboard');
			}
			else{
			  console.log('case4');
			  $rootScope.message = 'You need to log in.'; 
			  $timeout(function(){
			  	deferred.resolve();
			  },0); 
			}
		}); 
      return deferred.promise;
	};


$httpProvider.responseInterceptors.push(function ($q, $location,$window) 
{
  
			
			return function (promise) 
			{ return promise.then(
					function (response)
						{
						  //console.log('interceptor1');
						 return response;
						},
 			function (response) 
 				{ 	//var deferred = $q.defer(); 
 					if (response.status===401){
 	 				console.log('interceptor2');
					$location.path('/');
					}
 					return $q.resolve(response); 
				}); 
			} 
}); 

  //---------------------------------------interceptor-block ends-------------------//
  
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  // Now set up the states
  $stateProvider
	.state('adminLogin', {
      url: "/",
      views:{
	"":{
	  templateUrl: "../views/subadmin/login1.html",
	  controller:"adminLoginCtrl",
	  resolve:{checked:checkLoggedOut}
	}
      }
      
	 
    })
    .state('dashboard', {
      url: "/dashboard",
       views:{
	"":{
      templateUrl: "../views/subadmin/dashboard.html",
      controller:"adminDashCtrl",
      resolve:{checked:checkLoggedin}
	},
	"dropdowns": {
                templateUrl: "../views/layouts/backend/dropdowns.html",
                controller:"containerCtrl" 
            },
            "left-menu": {
                templateUrl: "../views/layouts/backend/left-menu-subadmin.html",
                controller:"containerCtrl" 
            }
       }
    })
    .state('logout', {
      url: "/logout",
      views:{
      "":{
      
	  controller:"logoutCtrl"
      },
	"dropdowns": {
                templateUrl: "../views/layouts/backend/dropdowns.html",
                controller:"containerCtrl" 
            },
            "left-menu": {
                templateUrl: "../views/layouts/backend/left-menu-subadmin.html",
                controller:"containerCtrl" 
            }
      }
    })
	.state('massimageupload',{
	  url:"/massimageupload",
	  views:{
	  "":{
	  templateUrl:"../views/admin/massimageupload.html",
	  controller:"massImageUploaderCtrl",
      resolve:{checked:checkLoggedin}	
	  },
	"dropdowns": {
                templateUrl: "../views/layouts/backend/dropdowns.html",
                controller:"containerCtrl" 
            },
            "left-menu": {
                templateUrl: "../views/layouts/backend/left-menu-subadmin.html",
                controller:"containerCtrl" 
            }
	  }
	})
	.state('MediaManager', {
      url: "/mediamanager",
      views:{
	"":{
      templateUrl: "../views/admin/sidemenu.html",
	  controller:"sidemenuCtrl",
      resolve:{checked:checkLoggedin}
	},
	"dropdowns": {
                templateUrl: "../views/layouts/backend/dropdowns.html",
                controller:"containerCtrl" 
            },
            "left-menu": {
                templateUrl: "../views/layouts/backend/left-menu-subadmin.html",
                controller:"containerCtrl" 
            }
	}
    })
});