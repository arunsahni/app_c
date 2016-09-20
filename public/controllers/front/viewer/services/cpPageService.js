var collabmedia = angular.module('collabmedia');
//request service
collabmedia.provide.service('CpPageService', ['$http' , '$q' , function( $http , $q ){
	//get requests list
	return {
		uploadHeader : function(chapter_id , id , fd){
			return $http.post('/pages/uploadHeader' , fd , {
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
					console.log("failure");
					
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		cropHeader : function(data){
			console.log(data);
			return $http.post('/pages/cropHeader' , data)
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
					console.log("failure");
					
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		getPageName : function(chapter_id , id){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			
			return $http.post('/pages/getPageName')
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
		getPageData : function(chapter_id , id){
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
		updatePageName : function(chapter_id , id , page_name){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			
			return $http.post('/pages/updatePageName',{page_name:page_name})
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
		listHeaders : function(){
			return $http.get('/pages/list_headers')
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
					//delete $http.defaults.headers.common['chapter_id'];
					
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		saveSettings : function(chapter_id , id , data){
			$http.defaults.headers.common['chapter_id'] = chapter_id;
			$http.defaults.headers.common['page_id'] = id;
			return $http.post('/pages/saveSettings',data)
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
					//delete $http.defaults.headers.common['chapter_id'];
					delete $http.defaults.headers.common['chapter_id'];
					delete $http.defaults.headers.common['page_id'];
					$q.reject(response);
					return { response:$q.defer().promise};
				});
		},
		updateWidgets : function(chapter_id , page_id , inputObj){
                    $http.defaults.headers.common['chapter_id'] = chapter_id;
                    $http.defaults.headers.common['page_id'] = page_id;
                    
                    return $http.post('/pages/updateWidgets',inputObj)
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
		updateBackground : function(chapter_id , page_id , inputObj){
                    $http.defaults.headers.common['chapter_id'] = chapter_id;
                    $http.defaults.headers.common['page_id'] = page_id;

                    return $http.post('/pages/updateBackground',inputObj)
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
		updateCommonParams : function(chapter_id , page_id , inputObj){
                    $http.defaults.headers.common['chapter_id'] = chapter_id;
                    $http.defaults.headers.common['page_id'] = page_id;

                    return $http.post('/pages/updateCommonParams',inputObj)
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
                createWidget : function(chapter_id , page_id , currentViewport,widgetType){
                    $http.defaults.headers.common['chapter_id'] = chapter_id;
                    $http.defaults.headers.common['page_id'] = page_id;
                    
                    var inputObj = {
                        currentViewport : currentViewport,
                        widgetType : widgetType
                    };
                    return $http.post('/pages/createWidget',inputObj)
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
                removeWidget : function(chapter_id , page_id , currentViewport,widgetId){
                    $http.defaults.headers.common['chapter_id'] = chapter_id;
                    $http.defaults.headers.common['page_id'] = page_id;
                    
                    var inputObj = {
                        currentViewport : currentViewport,
                        widgetId : widgetId
                    };
                    return $http.post('/pages/removeWidget',inputObj)
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
                uploadLink : function(chapter_id , page_id , inputObj){
                    $http.defaults.headers.common['chapter_id'] = chapter_id;
                    $http.defaults.headers.common['page_id'] = page_id;
                    
                    return $http.post('/pages/uploadLink',inputObj)
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