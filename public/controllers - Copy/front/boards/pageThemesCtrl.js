var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('pageThemesCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
	
	/*
		Action : Rename Page Theme
	
	*/
	$scope.renametheme={};
    $scope.renametheme.title='';
    $scope.makealert = function(theme){
        //alert("In makealert");
		$scope.renametheme=theme;
        
    }
    
    $scope.renameTheme = function(){
        $('.ui-dialog-titlebar-close').trigger('click');
		
		console.log($scope.renametheme);
        var fields={};
        fields.board=$stateParams.id;
        fields.id=$scope.renametheme.id;
        fields.title=$scope.renametheme.title;
		
		if(fields.title=="" || fields.title=="undefined" || fields.title==undefined){
			//alert("m here--");
			$scope.setFlashInstant('<span style="color:red;">Page theme can not be empty.</span>' , 'error');
			$scope.update__PTObject();
			return 0;
		}
		
        $http.post('/boards/renameTheme',fields).then(function (data, status, headers, config) {
            if (data.data.code==200) {
				$scope.setFlashInstant('Page theme renamed successfully.' , 'success');
				$scope.gt=data.data.response[0].Themes;
				$scope.boarddata[0].Themes = data.data.response[0].Themes;
				$('#slideTitleHeader').cycle('destroy');
				//$('.ui-dialog-titlebar-close').trigger('click');
				$timeout(function(){
					$scope.update__PTObject();
					//startupall()
					$scope.runVendorScripts2();
				},100)
			}
			else{
				$scope.medias={};
				$scope.setFlashInstant('<span style="color:red;">Page theme could not be renamed, Please try again.</span>' , 'success');
				$('#slideTitleHeader').cycle('destroy');
				$timeout(function(){
					$scope.runVendorScripts2()
				},50)
			}
		})
    }
	
	/*
		Action : Create New Page Theme/GT
	
	*/
	$scope.createGroupTag=function(){
        $('.ui-dialog-titlebar-close').trigger('click');
		
		console.log($scope.groupta);
    	var dash = $scope.groupta;
		var successFlag = true;
    	var matchitem = $scope.GroupTagTitle;	//model variable: In inputbox
		dash.forEach(function(item) {
			if(item.title == matchitem) {
				//alert("Name Already exists.");
				//alert("This Theme has already been added to this Board.");
				$scope.setFlashInstant('<span style="color:red;">This Theme has already been added to this Board</span>' , 'success');
				successFlag = false;
				//$('.ui-dialog-titlebar-close').trigger('click');
				return false;
				
			}
		});
		if(!successFlag)
			return false;
			
		//alert("hello testing..");
		if ($scope.GroupTagNotes!="" && $scope.GroupTagTitle!="") {
            
            var fields={};
            fields.id=$stateParams.id;
            fields.gtNotes=$scope.GroupTagNotes;
            fields.gtsa=$scope.GroupTagTitle;
            $http.post('/boards/createGroupTag',fields).then(function (data, status, headers, config) {
				if (data.data.code==200) {
					$scope.gt=data.data.response[0].Themes;
					$scope.setFlashInstant('Page Theme added successfully.' , 'success');
					$scope.boarddata[0].Themes = data.data.response[0].Themes;
					$('#slideTitleHeader').cycle('destroy');
					$timeout(function(){
						//$('.ui-dialog-titlebar-close').trigger('click');
						$scope.update__PTObject();
						//startupall()
						$scope.runVendorScripts2();
					},100)
				}
				else{
					$scope.setFlashInstant('Page Theme could not be added, Please try again.' , 'success');
					$timeout(function(){
						$('#slideTitleHeader').cycle('destroy');
						startupall()
					},50)
				}
				//$window.location.reload(); 
				$scope.setPageThemeNavigator();
            });
        }
    }
    
	/*
		Action : Add Existing Page Theme/GT in the board
	
	*/
    $scope.addGroupTag=function(id,title){
        
        var fields={};
        fields.id=$stateParams.id;
        fields.gtsa=title;
        fields.themeid=id;
        fields.isapproved=1;
        $http.post('/boards/addGroupTag',fields).then(function (data, status, headers, config) {
            if (data.data.code==200) {
				$scope.setFlashInstant('Success.' , 'success');
				$scope.gt=data.data.response[0].Themes;
				$scope.setFlashInstant('Page theme added successfully.' , 'success');
				$scope.boarddata[0].Themes = data.data.response[0].Themes;
				$('#slideTitleHeader').cycle('destroy');
				$timeout(function(){
					$scope.update__PTObject();
					startupall()
					//$scope.runVendorScripts();
				},100)
			}
			else{
				$scope.setFlashInstant('Page theme could not be added, Please try again.' , 'success');
				$timeout(function(){
					$('#slideTitleHeader').cycle('destroy');
					$scope.runVendorScripts2();
				},50)
			}
			//$window.location.reload();  
			$scope.setPageThemeNavigator();
        });
    }
	
	/*
		Action : delete Page Theme/GT from board
	
	*/
	$scope.deleteGroupTag=function(id,title){
        $("#delete_pop").show();
        $scope.confirmDel = function() {
            $("#delete_pop").hide();
			
			var fields={};
            fields.id=$stateParams.id;
            fields.gtsa=title;
            fields.themeid=id;
            $http.post('/boards/deleteGroupTag',fields).then(function (data, status, headers, config) {
                //$scope.setFlash('Theme deleted successfully.' , 'success');
				//$window.location.reload();            
				if (data.data.code==200) {
					//$("#delete_pop").hide();
					$scope.setFlashInstant('Page theme deleted successfully.' , 'success');
					$scope.gt=data.data.response[0].Themes;
					$scope.boarddata[0].Themes = data.data.response[0].Themes;
					$('#slideTitleHeader').cycle('destroy');
					$timeout(function(){
						$scope.update__PTObject();
						//startupall()
						$scope.runVendorScripts2();
					},100)
				}
				else{
					//$("#delete_pop").hide();
					$scope.setFlashInstant('Page theme could not be deleted, Please try again.' , 'success');
					$timeout(function(){
						$('#slideTitleHeader').cycle('destroy');
						startupall()
					},50)
				}
				$scope.setPageThemeNavigator();
            });
        };
    }
	
	$scope.nextPageTheme = '';
	$scope.prevPageTheme = '';
	
	$scope.isNextTheme = false;
	$scope.isPrevTheme = false;
	
	$scope.getNextPageTheme = function(){
		$('#slideTitleHeader li').each(function(){
			if ($(this).css('visibility')!='hidden') {
				if($(this).attr('id')){
					if( $("#slideTitleHeader li").index($(this)) == $("#slideTitleHeader li").index($('#slideTitleHeader li').last()) ){
						$scope.nextPageTheme = $('#slideTitleHeader li').first().find('span').html();
					}
					else{
						$scope.nextPageTheme = $(this).next().find('span').html();
					}
				}
			}
		});
	}
	
	//by manishp - Page Theme Movement Code on 24122014
	$scope.getPrevPageTheme = function(){
		$('#slideTitleHeader li').each(function(){
			if ($(this).css('visibility')!='hidden') {
				if($(this).attr('id')){
					if( $("#slideTitleHeader li").index($(this)) == 1 ){
						$scope.prevPageTheme = $('#slideTitleHeader li').last().find('span').html();
						//$scope.$apply();
					}
					else{
						$scope.prevPageTheme = $(this).prev().find('span').html();
						//$scope.$apply();
					}
					//alert("Index of this li = "+$("#slideTitleHeader li").index($(this)));
					//alert("Index of last li = "+$("#slideTitleHeader li").index($('#slideTitleHeader li').last()));
				}
			}
		});
	}
	
	$scope.prevHoverIn = function(){
		$scope.getPrevPageTheme();
        $scope.isPrevTheme = true;
    };

    $scope.prevHoverOut = function(){
        $scope.isPrevTheme = false;
	};
	
	$scope.nextHoverIn = function(){
        $scope.getNextPageTheme();
		$scope.isNextTheme = true;
	};

    $scope.nextHoverOut = function(){
        $scope.isNextTheme = false;
    };
	//End by manishp - Page Theme Movement Code on 24122014
	
	$scope.setPageThemeNavigator = function(){
		if ( $scope.boarddata[0].Themes.length > 1 ) {
			$scope.pageThemeMovement = true;
		}
		else{
			$scope.pageThemeMovement = false;
		}
	}
	
});