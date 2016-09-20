var collabmedia = angular.module('collabmedia');
//request service
collabmedia.provide.service('ChaptersService', ['$http' , '$q' , function( $http , $q ){
	//get requests list
	return {
		getAll : function(id){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.get('/chapters')
				.success(function(response){
					delete $http.defaults.headers.common['capsule_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['capsule_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		getLaunchedChapters : function(data){
			//$http.defaults.headers.common['capsule_id'] = id;
			return $http.post('/chapters/getLaunchedChapters',data)
				.success(function(response){
					//delete $http.defaults.headers.common['capsule_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					//delete $http.defaults.headers.common['capsule_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		getAllPaginated : function(data , id){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.post('/chapters',data)
				.success(function(response){
					delete $http.defaults.headers.common['capsule_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['capsule_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		create : function(id){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.post('/chapters/create')
				.success(function(response){
					delete $http.defaults.headers.common['capsule_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['capsule_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		edit : function(){
			
			
		},
		duplicate : function(id){
			$http.defaults.headers.common['chapter_id'] = id;
			return $http.post('/chapters/duplicate')
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
		addFromLibrary : function(id , capsule_id){
			$http.defaults.headers.common['capsule_id'] = capsule_id;
			$http.defaults.headers.common['chapter_id'] = id;
			return $http.post('/chapters/addFromLibrary')
				.success(function(response){
					delete $http.defaults.headers.common['capsule_id'];
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
					delete $http.defaults.headers.common['capsule_id'];
					delete $http.defaults.headers.common['chapter_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
			
		},
		remove : function(id){
			$http.defaults.headers.common['chapter_id'] = id;
			return $http.post('/chapters/remove')
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
		reorder : function(ids){
			console.log("ids = ",ids);
			return $http.post('/chapters/reorder' , {chapter_ids : ids})
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
		share : function(chapter_id , share_with_email){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
						
			return $http.post('/chapters/share',{share_with_email:share_with_email})
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
		currentCapsule : function(id){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.get('/capsules/current')
				.success(function(response){
					delete $http.defaults.headers.common['capsule_id'];
					if(response){
						return { response:$q.defer().resolve(response) };
					}
					else{
						$q.reject(response);
						return { response:$q.defer().promise };
					}
				})
				.error(function(response){
					delete $http.defaults.headers.common['capsule_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		updateCapsuleName : function(capsule_id , chapter_id , capsule_name){
			$http.defaults.headers.common['capsule_id'] = capsule_id;
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			
			return $http.post('/capsules/updateCapsuleName',{Capsule_name:capsule_name})
				.success(function(response){
					delete $http.defaults.headers.common['capsule_id'];
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
					delete $http.defaults.headers.common['capsule_id'];
					delete $http.defaults.headers.common['chapter_id'];
					
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		saveSetting : function(chapter_id , data){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
					
			return $http.post('/chapters/saveSetting',data)
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
		saveAndLaunch : function(chapter_id , data){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
					
			return $http.post('/chapters/saveAndLaunch',data)
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