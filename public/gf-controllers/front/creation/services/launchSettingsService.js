var collabmedia = angular.module('collabmedia');

collabmedia.provide.service('LaunchSettingsService', ['$http' , '$q' , function( $http , $q ){

	return {
		getFsgs: function(){
			return $http.get('/fsg/view')
				.success(function(response){
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					$q.reject(response);
					return { response:$q.defer().promise};
				});	
		},
		getChapterData : function(chapter_id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			return $http.get('/chapters/current')
				.success(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});	
		},
		uploadCover : function( chapter_id , myFile ){
			var uploadUrl = "/chapters/uploadCover";
			var fd = null; 
			fd = new FormData();
			fd.append('file', myFile);
			fd.append('chapter_id', chapter_id);
			return $http.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				})
				.success(function(response){
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		getAllFriends : function(){
			return $http.get('/members')
				.success(function(response){
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		invite : function( chapter_id , invitee ){
			console.log(chapter_id)
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			return $http.post('/chapters/invite',{'invitee':invitee,'chapter_id':chapter_id})
				.success(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		inviteMembers : function( chapter_id , member ){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			return $http.post('/chapters/inviteMember',{'member':member,'chapter_id':chapter_id})
				.success(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		removeInvitee : function( chapter_id , member ){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			return $http.post('/chapters/removeInvitee',{'member':member})
				.success(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		addOwner : function( chapter_id , email ){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			return $http.post('/chapters/addOwner',{'email':email})
				.success(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		removeOwner : function( chapter_id , email ){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			return $http.post('/chapters/removeOwner',{'email':email})
				.success(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		}
    }

}]);