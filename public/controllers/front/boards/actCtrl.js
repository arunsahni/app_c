var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('actCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	/*
		Action : ticked action while opening act page from search
		Gallery, addMedia into the board discuss.
	
	*/
	
	$scope.addMedia = function(){
		if ($scope.del_grid_noteCase == true) {
			//alert('del_grid_noteCase');
			$scope.addMedia_grid_noteCase();
		}else{
			var fields={};
			fields.id=$scope.id;
			fields.BoardId=$stateParams.id;
			fields.media=$scope.mediasData._id;
			fields.MediaID=$scope.mediasData._id;
			fields.owner=$scope.mediasData.value.UploaderID;
			fields.OwnerId=$scope.mediasData.value.UploaderID;
			fields.Action="Post";
			fields.url=$scope.mediasData.value.URL;
			fields.MediaURL=$scope.mediasData.value.URL;
			fields.MediaType=$scope.mediasData.value.MediaType;
			fields.ContentType=$scope.mediasData.value.ContentType;
			fields.contentType=$scope.mediasData.value.ContentType;
			fields.Content=$scope.mediasData.value.Content;
			fields.title=$scope.mediasData.value.Title;
			fields.prompt=$scope.mediasData.value.Prompt;
			fields.locator=$scope.mediasData.value.Locator;
			fields.Title=$scope.mediasData.value.Title;
			fields.Prompt=$scope.mediasData.value.Prompt;
			fields.Locator=$scope.mediasData.value.Locator;
			fields.data=$scope.mediasData;
			fields.Statement = $('.edit_froala1').editable('getHTML', true, true);
			fields.Statement  = (fields.Statement == '<p class="fr-tag">Start writing...</p>') ? '':fields.Statement;
			var thumbnail = '';
			if( $scope.mediasData.value.thumbnail ){
				thumbnail=$scope.mediasData.value.thumbnail;
				console.log("--------------if-------"+$scope.mediasData.value.thumbnail);
			}
			fields.thumbnail=thumbnail;
			$('#slideTitleHeader li').each(function(){
				if ($(this).css('visibility')!='hidden') {                
					fields.themeId=$(this).attr('id')
					fields.theme=$(this).find('span').html()
					console.log(fields);
					$http.post('/media/actions',fields).then(function (data, status, headers, config) {
						if (data.data.status=="success"){ 
							$scope.changePT();
							$scope.setFlashInstant('Media Posted into the Board' , 'success');
							$scope.close_holder_act();
						}
						else{
							$scope.medias={};
						}
					})          
				}
			})
		}
	}
	
	$scope.addMedia_grid_noteCase = function(){
		$scope.notes={};
		$scope.notes.comment = $('#noteContainer').html();
		var thumb = $('#holder-box #noteActual .innerimg-wrap').find('img').attr('src')
		thumb = thumb.split('/');
		var final_thumb = thumb[thumb.length-1];
		$scope.notes.thumbnail = final_thumb;
		$scope.link.isPrivate = 1;
		$scope.link.mmt = '5464931fde9f6868484be3d7';
		if($scope.notes.comment==''||$scope.notes.comment==undefined || $scope.notes.comment == "<p>Start writing...</p>" || $scope.notes.comment ==  '<p class="fr-tag">Start writing...</p>') {
			alert('please enter valid text/media');
			return;
		}else{
			if ($scope.notes.comment!="<p><br></p>" && $scope.notes.comment!="" ) {
				var fields={};
				fields.content = $scope.notes.comment;
				fields.type = 'Notes';
				fields.thumbnail = $scope.notes.thumbnail;
				$http.post('/media/uploadLink',fields).then(function (data, status, headers, config) {
					if(data.data.code==200){
						$scope.uploadedLink=data.data.response;
						var initial_url='/assets/Media/img/600/'+fields.thumbnail;
						$scope.addTags();
					}
				});            
			}
		}
	}
	
});
