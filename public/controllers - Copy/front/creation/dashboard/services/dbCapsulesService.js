var collabmedia = angular.module('collabmedia');
//request service
collabmedia.provide.factory('DbCapsulesService', ['$http' , '$q' , function( $http , $q ){
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
		}
	}
}]);