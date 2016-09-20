var collabmedia = angular.module('collabmedia');

collabmedia.controller('capsuleCtrl', function($scope, $location, $window, $rootScope, capsuleService) {

    $scope.initialize = function(){
        capsuleService.chaptersList()
            .then(function(response) {
                    if (response) {
                        console.log("Chapters", response.data.capsule.Chapters);
                        $scope.chaptersImages = response.data.capsule.Chapters;
                        setTimeout(function() {
                            $('.carousel').slick({
                                dots: true,
                                infinite: false,
                                speed: 500,
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                arrows: true,
                                draggable: true,
                                responsive: [
                                        {
                                                breakpoint: 1024,
                                                settings: {
                                                        slidesToShow: 4,
                                                        slidesToScroll: 1,
                                                        infinite: true,
                                                }
                                        },
                                        {
                                                breakpoint: 600,
                                                settings: {
                                                        slidesToShow: 1,
                                                        slidesToScroll: 1
                                                }
                                        },
                                        {
                                                breakpoint: 480,
                                                settings: {
                                                        slidesToShow: 1,
                                                        slidesToScroll: 1
                                                }
                                        }
                                ]
                                });
                        }, 1000);
                    }
                },
                function(error) {
                    console.log("error", error);
                }); 
    };
     
    $scope.initialize();
        
    $scope.createCapsule = function() {
        $('#add_capsule').hide();
        $('.capsule_edit').css({
            display: 'none',
            margin: '0 0 0 10px',
            position: 'absolute'
        });
        $('.capsule_text_field').hide();
        $('.capsule_text').show();
        if ($scope.capsule) {
            var capsuleData = {
                title: $scope.capsule.title
            };
            capsuleService.createCapsule(capsuleData)
                .then(function(response) {
                        if (response) {
                            console.log("response", response.data.capsule.Title);
                            $scope.Title = response.data.capsule.Title;
                            $('.capsule_text').text($scope.Title);
                        }
                    },
                    function(error) {
                        console.log("error", error);
                    });
        }
    };

    $scope.createChapter = function() {

        if ($scope.chapter) {

            var fd = new FormData();
            //if($scope.myFile){

            fd.append('file', $scope.myFile);
            fd.append('name', $scope.chapter.name);

            capsuleService.createChapter(fd)

            .then(function(response) {
                    if (response.data.response == 'success') {
                        console.log(response.data.data.Chapters, "Chapters");
                        $scope.data = response.data.data.Chapters;
                        $scope.chaptersImages = response.data.message;
                        $('#tips, .popup').fadeOut('slow');
                        location.reload();
                        //$scope.successmessage = '';
                    } else {
                        $scope.failuremessage = response.data.message;
                        //$scope.failuremessage = '';
                    }
                },
                function(error) {
                    $scope.message = error;
                });
            //}
        }
    }

    $scope.openChapterPopup = function() {
        if ($scope.chapter == undefined) {

        } else {
            $scope.chapter = {};
            $scope.myFile = {};
            $scope.successmessage = '';
            $scope.failuremessage = '';
        }
        $('#tips, .popup').fadeIn('slow');
    };

    $scope.closeChapterPopup = function() {
        $('#tips, .popup').fadeOut('slow');
    };
});