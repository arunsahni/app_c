var collabmedia = angular.module('collabmedia');
collabmedia.controllerProvider.register('dashboardCtrl',function($scope,$http,$location,$window,loginService){
      loginService.chkUserLogin($http,$location,$window).then(function(){
              $scope.userInfo = tempData;
              userdata=$scope.userInfo;
              
              for(k in userdata.FSGs){
                      ud.push(k+'~'+userdata.FSGs[k])
              }
              
              
              
      });
      
      $scope.change_page=function(page){
        $window.location.href='#/'+page;
      }
});