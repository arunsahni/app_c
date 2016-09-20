collabmedia.factory(
	'adminInterceptor', 
	[
		'$q',
		'$rootScope',
		'$window',
		'$location',
				
		function($q, $rootScope , $window, $location){
			$rootScope.isLoggedIn = false;
			return {
		
				/* All the following methods are optional */

				request: function(config) {
					/*
					  Called before send a new XHR request.
					  This is a good place where manipulate the
					  request parameters.
					*/
					//$window.localStorage.removeItem('token');
					if($window.localStorage.getItem('admin-login-token') != "false") {
						//config.headers['token'] =  getUser;
						console.log("login-token-status....."+$window.localStorage.getItem('admin-login-token'));
					}else{
						console.log("-----login-token-status....."+$window.localStorage.getItem('admin-login-token'));
						//$window.localStorage.setItem('login-token', false);
						//$q.reject(config);
						$location.path("/login");
					}
					return config || $q.when(config);
				},

				requestError: function(rejection) {
					// Called when another request fails.

					// I am still searching a good use case for this.
					// If you are aware of it, please write a comment
					return $q.reject(rejection);
				},

				response: function(response) {
					// Called before a promise is resolved.
					if(response.data.authStatus){
						return response || $q.when(response);
					}
					else{
						$window.localStorage.setItem('login-token', false);
						$location.path('/login');
					}
				},

				responseError: function(rejection) {
					/*
					  Called when another XHR request returns with
					  an error status code.
					*/

					return $q.reject(rejection);
				}

			}
		}
]);