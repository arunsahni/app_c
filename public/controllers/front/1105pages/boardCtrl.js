var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('boardCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
    $scope.boardsMedia=0;
    $scope.boardMedia=null;
    $scope.selectedMediaFromBoards=[];

    $scope.per_page_MyBoard = 4;
    $scope.pageNo_MyBoard = 1;
    $scope.has_more_MyBoard = false;

    $scope.myboardsMedia = null;
    $scope.per_page_Pages = 100;
    $scope.pageNo_Pages = 1;
    $scope.has_more_Pages = false;

    $scope.show_img_MyBoard = false;
    $scope.show_img_Page = false;
/*________________________________________________________________________
* @Date:      	16 june 2015
* @Method :   	getAllBoards
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This isget list of all boards of current user.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.getAllBoards = function(pageId){
        if(pageId != null){
            var offset = $scope.per_page_Pages * ( $scope.pageNo_Pages-1 );
            $http.post('/myBoards',{'boards':$scope.page_id, 'perPage':$scope.per_page_Pages,'offset': offset}).then(function (data, status, headers, config) {
                if (data.data.code==200 && data.data.response.length) {
                    if ($scope.myboardsMedia == null) {
                            $scope.myboardsMedia = data.data.response ;
                    }else{
                            $scope.myboardsMedia.push.apply($scope.myboardsMedia,data.data.response);
                    }
                    $scope.has_more_Pages = data.data.hasMore ? data.data.hasMore : false  ; 
                }
                else{
                    $scope.myboardsMedia=null;    
                }
                $scope.show_img_Page = false;
            });
            
        }
        else{
            var offset = $scope.per_page_Pages * ( $scope.pageNo_Pages-1 );
            $http.post('/myBoards',{'boards':$scope.page_id, 'perPage':$scope.per_page_Pages,'offset': offset}).then(function (data, status, headers, config) {
                if (data.data.code==200 && data.data.response.length) {
                    if ($scope.myboardsMedia == null) {
                            $scope.myboardsMedia = data.data.response ;
                    }else{
                            $scope.myboardsMedia.push.apply($scope.myboardsMedia,data.data.response);
                    }
                    $scope.has_more_Pages = data.data.hasMore ? data.data.hasMore : false  ; 
                }
                else{
                    $scope.myboardsMedia=null;    
                }
                $scope.show_img_Page = false;
            });
            
        }
    }
    //$scope.getAllBoards();
/**********************************END***********************************/


    $scope.closeBoardMedia = function(pageId){
        if(pageId != null){
            $scope.boardMedia=null;
            $scope.boardsMedia=null;
            $scope.pageNo_MyBoard = 1;

            $scope.pageNo_Pages = 1;
            $scope.myboardsMedia = null ;

            $('#'+pageId+' #addFromBoards .main .board-gallery').scrollTop(0);
            $scope.boardMedia=null;
            $scope.selectedMediaFromBoards=[];
            
        }
        else{
            $scope.boardMedia=null;
            $scope.boardsMedia=null;
            $scope.pageNo_MyBoard = 1;

            $scope.pageNo_Pages = 1;
            $scope.myboardsMedia = null ;

            $('#addFromBoards .main .board-gallery').scrollTop(0);
            $scope.boardMedia=null;
            $scope.selectedMediaFromBoards=[];
            
        }
    }
    
    $scope.viewBoardsMedia =  function(pageId){
        if(pageId != null){
            if ($scope.countOfTrayMedia < 15) {
                $scope.getAllBoards(pageId);
                $scope.boardMedia=null;
                console.log('viewBoardsMedia()');
                $('#'+pageId+' .main-container-boards-index li').each(function(){
                    $(this).height($(this).width())
                })

                $('#'+pageId+' .main-container-boards-index li a').each(function(){
                    $(this).height($(this).width())
                })
                $('#'+pageId+' .innerimg-wrap').each(function(){
                    height=$(this).parent().height();
                    imgheight=$(this).children().first('img').height();
                    imgwidth=$(this).children().first('img').width();
                    if(height>imgheight){
                          $(this).children().first('img').height(height)
                    }
                    else if(height>imgwidth){
                          $(this).children().first('img').width(height)
                    }
                    else{
                          if(imgheight<imgwidth){
                                  $(this).children().first('img').height(height)
                          }
                          else if(imgwidth<imgheight){
                                  $(this).children().first('img').width(height)
                          }
                          else{
                                  $(this).children().first('img').width(height)
                          }
                  }
                })
                $scope.boardsMedia=1;
            }else{
                    $('#'+pageId+" #media_tray_full_pop").show();
            }
            
        }
        else{
            if ($scope.countOfTrayMedia < 15) {
                    $scope.getAllBoards();
                    $scope.boardMedia=null;
                    console.log('viewBoardsMedia()');
                    $('.main-container-boards-index li').each(function(){
                            $(this).height($(this).width())
                    })

                    $('.main-container-boards-index li a').each(function(){
                            $(this).height($(this).width())
                    })
                    $('.innerimg-wrap').each(function(){
                              height=$(this).parent().height();
                              imgheight=$(this).children().first('img').height();
                              imgwidth=$(this).children().first('img').width();
                              if(height>imgheight){
                                    $(this).children().first('img').height(height)
                              }
                              else if(height>imgwidth){
                                    $(this).children().first('img').width(height)
                              }
                              else{
                                    if(imgheight<imgwidth){
                                            $(this).children().first('img').height(height)
                                    }
                                    else if(imgwidth<imgheight){
                                            $(this).children().first('img').width(height)
                                    }
                                    else{
                                            $(this).children().first('img').width(height)
                                    }
                            }
                    })
                    $scope.boardsMedia=1;
            }else{
                    $("#media_tray_full_pop").show();
            }
            
        }
    }
    
	$scope.showMyBoardMedia = function(board , pageId){
            if(pageId != null){
                //$scope.boardMedia=null;
		$scope.current_board =  board;
		$scope.current_board_name = board.Title;
		console.log($scope.current_board_name);
		
		//alert($scope.current_board_name);
		if ($scope.pageNo_MyBoard == 1) {
                    $('#'+pageId+' #addFromBoards .main .board-gallery').scrollTop(0);
		}
		$http.post('/boards/addFromBoards',{id:$scope.current_board._id,perPage:$scope.per_page_MyBoard, pageNo:$scope.pageNo_MyBoard}).then(function (data, status, headers, config) {
                    if (data.data.code==200){
                        if ($scope.boardMedia == null) {
                            $scope.boardMedia=data.data.response;
                        }else{
                            $scope.boardMedia.push.apply($scope.boardMedia,data.data.response);
                        }
                        //console.log($scope.boardMedia);
                        setTimeout(function(){
                            for(var i=0; i < $scope.selectedMediaFromBoards.length; i++){
                                //console.log($scope.selectedMediaFromBoards[i]);
                                $('#'+pageId+' #'+$scope.selectedMediaFromBoards[i]).addClass('select-li');
                            }
                        },100)
                    }
                    if (data.data.response.length > 0 && data.data.response.length == $scope.per_page_MyBoard) {
                        $scope.has_more_MyBoard = true;
                    }else{
                        $scope.has_more_MyBoard = false;
                    }
                    $scope.show_img_MyBoard = false;
		})
                
            }
            else{
                //$scope.boardMedia=null;
		$scope.current_board =  board;
		$scope.current_board_name = board.Title;
		console.log($scope.current_board_name);
		
		//alert($scope.current_board_name);
		if ($scope.pageNo_MyBoard == 1) {
			$('#addFromBoards .main .board-gallery').scrollTop(0);
		}
		$http.post('/boards/addFromBoards',{id:$scope.current_board._id,perPage:$scope.per_page_MyBoard, pageNo:$scope.pageNo_MyBoard}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				if ($scope.boardMedia == null) {
					$scope.boardMedia=data.data.response;
				}else{
					$scope.boardMedia.push.apply($scope.boardMedia,data.data.response);
				}
				//console.log($scope.boardMedia);
				setTimeout(function(){
					for(var i=0; i < $scope.selectedMediaFromBoards.length; i++){
						//console.log($scope.selectedMediaFromBoards[i]);
						$('#'+$scope.selectedMediaFromBoards[i]).addClass('select-li');
					}
				},100)
			}
			if (data.data.response.length > 0 && data.data.response.length == $scope.per_page_MyBoard) {
				$scope.has_more_MyBoard = true;
			}else{
				$scope.has_more_MyBoard = false;
			}
			$scope.show_img_MyBoard = false;
		})
                
            }
	}
	
	$scope.showMore_MyBoard = function(pageId){
            if(pageId != null){
                $scope.show_img_MyBoard = true;
		$scope.pageNo_MyBoard++;
		$scope.showMyBoardMedia($scope.current_board , pageId);
                
            }
            else{
                $scope.show_img_MyBoard = true;
		$scope.pageNo_MyBoard++;
		$scope.showMyBoardMedia($scope.current_board);
                
            }
	}
	
	$scope.showMore_Pages = function(pageId){
            if(pageId != null){
                $scope.show_img_Page = true;
		$scope.pageNo_Pages++;
		$scope.getAllBoards(pageId);	
                
            }
            else{
                $scope.show_img_Page = true;
		$scope.pageNo_Pages++;
		$scope.getAllBoards();	
                
            }
	}
	
	$scope.showMyBoard = function(pageId){
            if(pageId != null){
                $scope.pageNo_MyBoard = 1;
                $('#'+pageId+' #addFromBoards .main .board-gallery').scrollTop(0);
                $scope.boardMedia=null;
                $scope.selectedMediaFromBoards=[];
            }
            else{
                $scope.pageNo_MyBoard = 1;
                $('#addFromBoards .main .board-gallery').scrollTop(0);
                $scope.boardMedia=null;
                $scope.selectedMediaFromBoards=[];
            }
        }
	
	$scope.selectBoardMedia = function(board , pageId){
            if(pageId != null){
                if ($('#'+pageId+' #'+board._id).hasClass('select-li')) {
                    $('#'+pageId+' #'+board._id).removeClass('select-li');
                }
                else{
                    $('#'+pageId+' #'+board._id).addClass('select-li');
                }
                $scope.selectedMediaFromBoards=[];
                $('#'+pageId+' .select-li').each(function(){
                    $scope.selectedMediaFromBoards.push($(this).attr('id'))
                })
                console.log($scope.selectedMediaFromBoards);
                
            }
            else{
                if ($('#'+board._id).hasClass('select-li')) {
                    $('#'+board._id).removeClass('select-li');
                }
                else{
                    $('#'+board._id).addClass('select-li');
                }
                $scope.selectedMediaFromBoards=[];
                $('.select-li').each(function(){
                    $scope.selectedMediaFromBoards.push($(this).attr('id'))
                })
                console.log($scope.selectedMediaFromBoards);
                
            }
        }
	
	
	$scope.AddBoardsMediasToBoard_v_2= function(pageId){
            if(pageId != null){
                if ($scope.countOfTrayMedia < 15) {
                    if ( ( $scope.countOfTrayMedia + $scope.selectedMediaFromBoards.length ) <= 15) {
                        for (i in $scope.selectedMediaFromBoards) {
                            $http.post('/media/getBoardMedia',{ID:$scope.selectedMediaFromBoards[i],boardId:$stateParams.id}).then(function(data){
                                if (data.data.code == 200) {
                                        $scope.addtoTray_uploadCase(data.data.result[0] , pageId);
                                }
                            })
                        }
                        setTimeout(function(){$('#'+pageId+' .board_pop_close').trigger('click');},20);
                    }else{
                        $('#'+pageId+" #media_tray_full_board_pop").show();
                    }
		}else{
                    $('#'+pageId+" #media_tray_full_pop").show();
		}
            }
            else{
                if ($scope.countOfTrayMedia < 15) {
			if ( ( $scope.countOfTrayMedia + $scope.selectedMediaFromBoards.length ) <= 15) {
				for (i in $scope.selectedMediaFromBoards) {
					$http.post('/media/getBoardMedia',{ID:$scope.selectedMediaFromBoards[i],boardId:$stateParams.id}).then(function(data){
						if (data.data.code == 200) {
							$scope.addtoTray_uploadCase(data.data.result[0]);
						}
					})
				}
				setTimeout(function(){$('.board_pop_close').trigger('click');},20);
			}else{
				$("#media_tray_full_board_pop").show();
			}
		}else{
			$("#media_tray_full_pop").show();
		}
            }
	}
}]);