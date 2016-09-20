var collabmedia = angular.module('collabmedia');
collabmedia.provide.service('videoImageService', function(){
	this.chkUserLogin = function($http,$location,$window,$scope){
		return $http.get('/user/chklogin')
			.success(function (data, status, headers, config) {				
				if (data.code=="200"){
					tempData = data.usersession;
				}else{
					tempData = {};
					$location.path('/login');
				}
			});	
	};
});

function video_image($url){
	$image_url = parse_url($url);
	if($image_url['host'] == 'www.youtube.com' || $image_url['host'] == 'youtube.com'){
		$array = explode("&", $image_url['query']);
		return "http://img.youtube.com/vi/".substr($array[0], 2)."/0.jpg";
		//return "http://img.youtube.com/vi/".substr($array[0], 2)."/default.jpg"; //Small Default
		//return "http://img.youtube.com/vi/".substr($array[0], 2)."/0.jpg"; // Large Default
		//return "http://img.youtube.com/vi/".substr($array[0], 2)."/1.jpg";
		//return "http://img.youtube.com/vi/".substr($array[0], 2)."/2.jpg";
		//return "http://img.youtube.com/vi/".substr($array[0], 2)."/3.jpg";
		
	} else if($image_url['host'] == 'www.vimeo.com' || $image_url['host'] == 'vimeo.com'){
		$hash = unserialize(file_get_contents("http://vimeo.com/api/v2/video/".substr($image_url['path'], 1).".php"));
		return $hash[0]["thumbnail_small"];
		
		//return $hash[0]["thumbnail_medium"];  //Other available variations available.
		//return $hash[0]["thumbnail_large"];
		
	}
}