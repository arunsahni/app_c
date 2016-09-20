var collabmedia = angular.module('collabmedia');
collabmedia.service('capsuleService', function($http, $rootScope, $q){
    return {
        createCapsule : function(capsule){
            return $http.post('/capsule/createCapsule', capsule)
                        .success(function(response){
                                if(response){
                                        return { response:$q.defer().resolve(response)};
                                }
                                else{
                                        $q.reject(response);
                                        return { response:$q.defer().promise};
                                }
                        })
                        .error(function(response){
                                $q.reject(response);
                                return { response:$q.defer().promise};
                        });
        },
        createChapter : function(chapter){
            return $http.post('/capsule/createChapter', chapter,{ transformRequest:angular.identity, headers:{'content-type': undefined} })
                        .success(function(response){
                                if(response){
                                        return { response:$q.defer().resolve(response)};
                                }
                                else{
                                        $q.reject(response);
                                        return { response:$q.defer().promise};
                                }
                        })
                        .error(function(response){
                                $q.reject(response);
                                return { response:$q.defer().promise};
                        });
        },
        chaptersList : function(){
            return $http.get('/capsule/chapterslist')
                        .success(function(response){
                                if(response){
                                        return { response:$q.defer().resolve(response)};
                                }
                                else{
                                        $q.reject(response);
                                        return { response:$q.defer().promise};
                                }
                        })
                        .error(function(response){
                                $q.reject(response);
                                return { response:$q.defer().promise};
                        });
        },
    }
});