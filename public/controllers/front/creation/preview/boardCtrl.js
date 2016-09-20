var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('boardCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
    $scope.boardsMedia=0;
    $scope.boardMedia=null;
	$scope.selectedMediaFromBoards=[];
	$scope.per_page_MyBoard = 4;
	$scope.pageNo_MyBoard = 1;
	$scope.has_more_MyBoard = false;
	$scope.show_img_MyBoard = false;
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
    $scope.getAllBoards = function(){
        $http.post('/myBoards',{boards:$stateParams.id}).then(function (data, status, headers, config) {
            if (data.data.code==200 && data.data.response.length) {
                $scope.myboardsMedia=data.data.response;
            }
            else{
                $scope.myboardsMedia=[];    
            }
        });
    }
    $scope.getAllBoards();
/**********************************END***********************************/


    $scope.closeBoardMedia = function(){
        $scope.boardMedia=null;
        $scope.boardsMedia=null;
		$scope.pageNo_MyBoard = 1;
		$('#addFromBoards .main .board-gallery').scrollTop(0);
        $scope.boardMedia=null;
        $scope.selectedMediaFromBoards=[];
    }
    
    $scope.viewBoardsMedia =  function(){
		if ($scope.countOfTrayMedia < 15) {
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
    
	$scope.showMyBoardMedia = function(board){
		//$scope.boardMedia=null;
		$scope.current_board =  board;
		$scope.current_board_name = board.Title;
		
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
	
	$scope.showMore_MyBoard = function(){
		$scope.show_img_MyBoard = true;
		$scope.pageNo_MyBoard++;
		$scope.showMyBoardMedia($scope.current_board);
		
	}
	
	$scope.showMyBoard = function(){
		$scope.pageNo_MyBoard = 1;
		$('#addFromBoards .main .board-gallery').scrollTop(0);
        $scope.boardMedia=null;
        $scope.selectedMediaFromBoards=[];
    }
	
	$scope.selectBoardMedia = function(board){
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
	
	
	$scope.AddBoardsMediasToBoard_v_2= function(){
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
}]);