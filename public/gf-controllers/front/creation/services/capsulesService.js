var collabmedia = angular.module('collabmedia');
//request service
collabmedia.provide.service('CapsulesService', ['$http' , '$q' , function( $http , $q ){
	//get requests list
	return {
		getAll : function(){
			return $http.get('/capsules')
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
		getAllPaginated : function(data){
			
			return $http.post('/capsules',data)
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
		create : function(){
			return $http.post('/capsules/create')
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
		edit : function(){
			
			
		},
		duplicate : function(id){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.post('/capsules/duplicate')
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
		addFromLibrary : function(id){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.post('/capsules/addFromLibrary')
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
		remove : function(id){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.post('/capsules/remove')
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
		reorder : function(ids){
			console.log("ids = ",ids);
			return $http.post('/capsules/reorder' , {capsule_ids : ids})
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
		current : function(id){
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
		saveSettings : function(id,data){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.post('/capsules/saveSettings',data)
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
		publish : function(id,data){
			$http.defaults.headers.common['capsule_id'] = id;
			return $http.post('/capsules/publish',data)
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
		uploadCover : function( capsule_id , myFile ){
			var uploadUrl = "/capsules/uploadCover";
			var fd = null; 
			fd = new FormData();
			fd.append('file', myFile);
			fd.append('capsule_id', capsule_id);
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
		share : function(capsule_id , share_with_email){
			$http.defaults.headers.common['capsule_id'] = capsule_id;
						
			return $http.post('/capsules/share',{share_with_email:share_with_email})
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
		invite : function( capsule_id , invitee ){
			console.log(capsule_id)
			$http.defaults.headers.common['capsule_id'] = capsule_id;
			return $http.post('/capsules/invite',{'invitee':invitee,'capsule_id':capsule_id})
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
		inviteMembers : function( capsule_id , member ){
			$http.defaults.headers.common['capsule_id'] = capsule_id;
			return $http.post('/capsules/inviteMember',{'member':member,'capsule_id':capsule_id})
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
		removeInvitee : function( capsule_id , member ){
			$http.defaults.headers.common['capsule_id'] = capsule_id;
			return $http.post('/capsules/removeInvitee',{'member':member})
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
	}
}]);