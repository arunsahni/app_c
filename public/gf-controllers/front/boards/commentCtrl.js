var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('commentCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
   
	/*
		Action : Add/Post Comment
	
	*/
	
	//added by parul 15012015
	$scope.activeVote=function(){
		setTimeout(function(){
			$scope.actual_activeVote();
		},5500)
	}
	//added by parul 15012015
	$scope.closeCmntDel=function(){
		$('#delete_cmnt_pop').hide();
	}
	$scope.actual_activeVote=function(){
		console.log("Called After = 5500ms");
		//alert('$scope.actual_activeVote();');
		if ($scope.boarddata[0].Comments) {
			for (i in  $scope.boarddata[0].Comments){
				var cmntID=$scope.boarddata[0].Comments[i]._id;
				var vt=false;
				if($scope.boarddata[0].Comments[i].Votes){
					for(j in $scope.boarddata[0].Comments[i].Votes){
						//console.log($scope.boarddata[0].Comments[i].Votes[j].VotedBy+'='+$scope.userInfo._id);
						if ($scope.boarddata[0].Comments[i].Votes[j].VotedBy==$scope.userInfo._id) {
							vt=true;
						}
					}
				}
				if (vt==true) {
					$('#'+cmntID).css({'opacity':'1'});
				}
			}
		}
	}
	$scope.activeVote();
	$scope.addcomment = function(){
        alert('a');
		
		if($scope.comment.title !== 'undefined' && $scope.comment.title !== '' && $scope.comment.title !== null) {
			var fields={};
			fields.id=$stateParams.id;
			fields.comment=$scope.comment.title;
			// alert('b');
			$http.post('/boards/addComment',fields).then(function (data, status, headers, config) {
				if (data.data.code==200){         
					//$window.location.reload();
					//alert('here')
					$("#comment-box").val("");
					$(".write-comment").fadeOut(function(){
						$('.add-comment').fadeIn(300);	
					}); 
					$(".commentsframe").delay(700).fadeIn(600);
					//alert('comment');
					//console.log(data.data.response);
					$scope.boarddata[0].Comments = data.data.response[0].Comments;
					console.log($scope.boarddata[0].Comments);
					//added by parul 5 jan 2015
					setTimeout(function(){
						$scope.actual_activeVote();
					},500)
					$scope.boardComments=true;
					//$scope.boarddata = data.data.response;
					$scope.comment.title='';
					$scope.setFlashInstant('Comment added successfully.' , 'success'); 
				}
			});	
		}
             
    }
	$scope.commentVote=function(cmnt){
		//alert(1);
		var fields={};
		fields.boardId=$stateParams.id;
		fields.cmntId=cmnt._id;
		fields.voterId=$scope.userInfo._id;
		//console.log(cmnt);
		$http.post('/boards/cmntVote',fields).then(function (data, status, headers, config) {
            if (data.data.code==200){
				$scope.setFlashInstant('Your vote has been saved.' , 'success'); 
				$scope.getBoardData();
				//console.log('1');
				//console.log($scope.boarddata);
				//.css({'opacity':'1'});
				
				setTimeout(function(){
					$scope.actual_activeVote();
				},500)
				
				
			}
			else if (data.data.code==400 && data.data.message=="already commented") {
				$scope.setFlashInstant('You have already voted for this comment.' , 'success'); 
			}
		});
		
	}
		
	/*________________________________________________________________________
		* @Date:      	19 Jan 2015
		* @Method :   	delBoardComment
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used to delete comments from overpass.
		* @Param:     	1
		* @Return:    	Yes
	_________________________________________________________________________
	*/
	
	$scope.delcmntPop=function(abc){
			$('#delete_cmnt_pop').show();
			$scope.cmntID=abc._id;
	}
	
	$scope.delBoardComment=function()
	{
		//console.log("cmnt"+cmnt);
		var fields={};
		fields.boardId=$stateParams.id;
		fields.cmntId=$scope.cmntID
		$http.post('/boards/cmntDelete',fields).then(function (data, status, headers, config) {
		if (data.data.code==200) {
			$scope.getBoardData();
			$('#delete_cmnt_pop').hide();
			setTimeout(function(){$scope.actual_activeVote();},600)
			
			$scope.setFlashInstant('Comment deleted successfully.' , 'success'); 
		}else{
			$scope.setFlashInstant('Sorry there was some error processing your request.' , 'success'); 
		}
		
		})
	}
	/*________________________________________________________________________
		* @Date:      	24 Feb 2015
		* @Method :   	countWords
		* Created By: 	smartData Enterprises Ltd
		* Modified On:	-
		* @Purpose:   	This function is used to delete comments from overpass.
		* @Param:     	0
		* @Return:    	no
	_________________________________________________________________________
	*/

	$scope.countWords = function() {
		var text=$scope.comment.title;
		$scope.noOfWords = text ? text.split(/\s+/) : 0; // it splits the text on space/tab/enter
		
	};
	
	$('#comment-box').keydown(function(key) {
		//alert(1);
        if( $scope.noOfWords.length >= 50 )
		{	if ((key.which ==  32) || (key.which ==  13)) {
				//alert(1)
				return false;
			}	
		}
    });
});

		
	