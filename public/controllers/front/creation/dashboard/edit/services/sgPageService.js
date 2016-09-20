var collabmedia = angular.module('collabmedia');
//request service
collabmedia.provide.service('SgPageService', ['$http' , '$q' , function( $http , $q ){
    //get requests list
    return {
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
        saveQuesTip: function(data){
            return $http.post('/pages/saveQuesTip',data)
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