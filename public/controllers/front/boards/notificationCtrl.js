var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('notificationCtrl',function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile){    
    
	/*
		Action : New Comment Notification
		parameters : request-type,url,data
	*/
	function getContent(timestamp){
		var queryString = {'timestamp' : timestamp};

		$.ajax(
			{
				type: 'GET',
				url: '/php-long-polling/server/server.php',
				data: queryString,
				success: function(data){
					// put result data into "obj"
					var obj = jQuery.parseJSON(data);
					// put the data_from_file into #response
					$('#response').html(obj.data_from_file);
					// call the function again, this time with the timestamp we just got from server.php
					getContent(obj.timestamp);
				}
			}
		);
	}
	
	
	$scope.get_comments = function(timestamp){
		var queryString = {'timestamp' : timestamp};
		
		$http.get('/notification/comment_notifier',queryString).then(function (data, status, headers, config) {
			if (data.data.code==200){
				// put result data into "obj"
				var obj = jQuery.parseJSON(data);
				
				// put the data_from_file into #response
				$('#response').html(obj.data_from_file);
				
				// call the function again, this time with the timestamp we just got from server.php
				get_comments(obj.timestamp);
			}	
		})
	}
	 field: { $exists: <boolean> } 
});
