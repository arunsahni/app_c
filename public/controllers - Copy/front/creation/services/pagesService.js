var collabmedia = angular.module('collabmedia');
//request service
collabmedia.provide.service('PagesService', ['$http' , '$q' , function( $http , $q ){
	//get requests list
	return {
		getPageLibrary : function(data){
			console.log(data);
			//return $http.get('/pages/getPageLibrary')
			return $http.post('/pages/getPageLibrary',data)
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
		getAll : function(chapter_id){
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
			
			return $http.get('/pages/getAllPages?chapter_id='+chapter_id)
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
		create : function(chapter_id , pageType){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			
			return $http.post('/pages/create' , {chapter_id : chapter_id , page_type : pageType})
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
		edit : function(){
			
			
		},
		duplicate : function(chapter_id , id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			
			return $http.post('/pages/duplicate')
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
		addFromLibrary : function(chapter_id , id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			
			return $http.post('/pages/addFromLibrary')
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
		remove : function(chapter_id , id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			
			return $http.post('/pages/remove')
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
		reorder : function(chapter_id , ids){
			console.log("ids = ",ids);
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			
			return $http.post('/pages/reorder' , {page_ids : ids})
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
		getChapterName : function(chapter_id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			
			return $http.post('/pages/getChapterName')
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
		updateChapterName : function(chapter_id , id , chapter_name){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			
			return $http.post('/chapters/updateChapterName',{chapter_name:chapter_name})
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
		share : function(chapter_id , id , share_with_email){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			
			return $http.post('/pages/share',{share_with_email:share_with_email})
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
		}
	}
}]);