var collabmedia = angular.module('collabmedia');
//request service
collabmedia.provide.service('PreviewService', ['$http' , '$q' , function( $http , $q ){
	//get requests list
	return {
		mediaSearchEngine : function(queryParams){
			return $http.post('/media/searchEngine',queryParams)
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
		mediaAddViews : function(queryParams){
			return $http.post('/media/addViews',queryParams)
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
		keywordsParse : function(queryParams){
			return $http.post('/keywords/parse',queryParams)
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
		getAllFsg : function(){
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
		getUserData : function(){
			return $http.get('/user/chklogin')
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
		getPageData : function(chapter_id,id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			
			return $http.get('/pages/getPageData')
				.success(function(response){
					delete $http.defaults.headers.common['chapter_id'];
					delete $http.defaults.headers.common['page_id'];
					
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
					delete $http.defaults.headers.common['page_id'];
					
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		getChapterData : function(chapter_id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			
			return $http.get('/pages?chapter_id='+chapter_id)
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
		getAllPages : function(chapter_id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			
			return $http.get('/pages/getAllpages?chapter_id='+chapter_id)
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