var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('sideMenuCtrl',['$scope','$location','$timeout', function($scope,$location,$timeout){
    $(window).scrollTop(0);
    $timeout(function(){
            angular.element('#loader').hide()
            angular.element('#menu-button').jPushMenu();
			angular.element('select').selectric();
            if (angular.element('body').hasClass('content-bg-pic')) {
                angular.element('#left-menu').removeClass('left-menu-creation')
            }else{
                angular.element('#left-menu').addClass('left-menu-creation')
            }
            
            
            angular.element("body").tooltip({ selector: '[data-toggle=tooltip]' });
            
            angular.element('.creation-section').on('mouseup',function(e){
                var container = angular.element(".send-message-block");
					var toggleBtn = angular.element('.open_pop2 , .open_pop');
				
					if (!container.is(e.target) // if the target of the click isn't the container...
						&& container.has(e.target).length === 0 && !toggleBtn.is(e.target) && toggleBtn.has(e.target).length === 0) // ... nor a descendant of the container
					{
						//container.hide();
						angular.element('.send-message-block').removeClass('abc');
						//console.log('outside');
					}else{
						//console.log('inside');
					}
             })
            
        },1000)
    
    
    
//	$('[data-toggle="tooltip"]').on('load',function(){
//        $(this).tooltip();
//    })
//   
    angular.element('#left-menu a').on('click',function(){
        angular.element('body').removeClass('cbp-spmenu-push-toright');
        angular.element('#left-menu').removeClass('cbp-spmenu-open');
    })
    
		
		
		
    
    /*________________________________________________________________________
    * @Date:      	30 Jul 2015
    * @Method :   	isActive
    * Created By: 	smartData Enterprises Ltd
    * Modified On:	-
    * @Purpose:   	This is set active tab in side menu.
    * @Param:     	-
    * @Return:    	no
    _________________________________________________________________________
    */
    $scope.isActive =function(route){
       //alert($location.path());
       return route == $location.path();
    }
    /**********************************END***********************************/
}]);
