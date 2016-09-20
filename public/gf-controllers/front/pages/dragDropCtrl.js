var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('dragDropCtrl',['$scope','$sce','$http','$location','$window','$upload','$stateParams','loginService','$timeout','$compile','$controller','$rootScope','$filter', function($scope,$sce,$http,$location,$window,$upload,$stateParams,loginService,$timeout,$compile,$controller,$rootScope,$filter){
//alert(1);
/*________________________________________________________________________
* @Date:      	10 june 2015
* @Method :   	init_dropable_area
* Created By: 	smartData Enterprises Ltd
* Modified On:	-
* @Purpose:   	This is set droppable area for each page.
* @Param:     	-
* @Return:    	no
_________________________________________________________________________
*/
    $scope.init_dropable_area = function(pageId){
        if(pageId != null){
            // #dropzone----used for search list dropzone
            // #dropzone2----used for discuss list dropzone
            // .dropzone3----used for search list dropzone
            // .dropzone4----used for discuss list dropzone
            $("html").on("dragenter", function(event) {
                event.preventDefault();
                if ( event.target.className.indexOf("dropzone3") > -1 ) {
                    $('#'+pageId+' #dropzone').css({'border':'3px dotted red'})
                }else if ( event.target.className.indexOf("dropzone4") > -1 ) {
                    $('#'+pageId+' #dropzone2').css({'border':'3px dotted red'})
                }else{
                    $('#'+pageId+' #dropzone2').css({'border':''})
                    $('#'+pageId+' #dropzone').css({'border':''})
                }
            });

            $('#'+pageId+' #dropzone').on('dragleave',function(event){
                event.preventDefault();
                $('#'+pageId+' #dropzone').css({'border':''})
            })

            $('#'+pageId+' #dropzone2').on('dragleave',function(event){
                event.preventDefault();
                $('#'+pageId+' #dropzone2').css({'border':''})
            })
            // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
             $("html").on("dragover", function(event) {
                event.preventDefault();
            });

            /* On drop - Prevent the browser default handling of the data (default is open as link on drop)
               Reset the color of the output text and DIV's border color
               Get the dragged data with the dataTransfer.getData() method
               The dragged data is the id of the dragged element ("drag1")
               Append the dragged element into the drop element
            */
             $("html").on("drop", function(event) {
                            //alert(event.target.id);
                //event.preventDefault();
                $('#'+pageId+' #dropzone').css({'border':''});
                $('#'+pageId+' #dropzone2').css({'border':''});
                if ( event.target.className.indexOf("dropzone3") > -1 ||  event.target.className.indexOf("dropzone4") > -1 /*&& event.target.className.indexOf("ansr-box") == -1*/) {
                    event.preventDefault();
                    if ($scope.countOfTrayMedia <15) {
                        event.dataTransfer = event.originalEvent.dataTransfer;			
                        var file = event.originalEvent.dataTransfer.files;          
                        if (file.length == 0) {
                            var data = event.dataTransfer.getData("Text");
                            $scope.link.content = data;
                            setTimeout(function(){
                                $scope.uploadLink(pageId);
                            },500);
                        }else if (file.length == 1) {
                            if ((file[0].type).indexOf('image') != -1) {
                                var sendFile = [];
                                sendFile.push(file[0]);
                                $scope.onFileSelect(sendFile , pageId);
                            }else{
                                alert(file.type+" not allowed...");
                            }
                        }else{
                            alert('Please drop only one Link/Image at a time');
                        }
                    }else{
                        $('#'+pageId+" #media_tray_full_pop").show();
                    }
                }else if (event.target.id == "capturetext") {
                    //alert(1);
                    event.preventDefault();
                    event.stopPropagation();
                    //return false;
                }else{
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            
        }
        else{
            // #dropzone----used for search list dropzone
            // #dropzone2----used for discuss list dropzone
            // .dropzone3----used for search list dropzone
            // .dropzone4----used for discuss list dropzone
            $("html").on("dragenter", function(event) {
                event.preventDefault();
                if ( event.target.className.indexOf("dropzone3") > -1 ) {
                    $('#dropzone').css({'border':'3px dotted red'})
                }else if ( event.target.className.indexOf("dropzone4") > -1 ) {
                    $('#dropzone2').css({'border':'3px dotted red'})
                }else{
                    $('#dropzone2').css({'border':''})
                                    $('#dropzone').css({'border':''})
                }
            });

            $('#dropzone').on('dragleave',function(event){
                event.preventDefault();
                $('#dropzone').css({'border':''})
            })

            $('#dropzone2').on('dragleave',function(event){
                event.preventDefault();
                $('#dropzone2').css({'border':''})
            })
            // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
             $("html").on("dragover", function(event) {
                event.preventDefault();
            });

            /* On drop - Prevent the browser default handling of the data (default is open as link on drop)
               Reset the color of the output text and DIV's border color
               Get the dragged data with the dataTransfer.getData() method
               The dragged data is the id of the dragged element ("drag1")
               Append the dragged element into the drop element
            */
             $("html").on("drop", function(event) {
                            //alert(event.target.id);
                //event.preventDefault();
                $('#dropzone').css({'border':''});
                $('#dropzone2').css({'border':''});
                if ( event.target.className.indexOf("dropzone3") > -1 ||  event.target.className.indexOf("dropzone4") > -1 /*&& event.target.className.indexOf("ansr-box") == -1*/) {
                    event.preventDefault();
                    if ($scope.countOfTrayMedia <15) {
                        event.dataTransfer = event.originalEvent.dataTransfer;			
                        var file = event.originalEvent.dataTransfer.files;          
                        if (file.length == 0) {
                            var data = event.dataTransfer.getData("Text");
                            $scope.link.content = data;
                            setTimeout(function(){
                                $scope.uploadLink();
                            },500);
                        }else if (file.length == 1) {
                            if ((file[0].type).indexOf('image') != -1) {
                                var sendFile = [];
                                sendFile.push(file[0]);
                                $scope.onFileSelect(sendFile);
                            }else{
                                alert(file.type+" not allowed...");
                            }
                        }else{
                            alert('Please drop only one Link/Image at a time');
                        }
                    }else{
                        $("#media_tray_full_pop").show();
                    }
                }else if (event.target.id == "capturetext") {
                        //alert(1);
                        event.preventDefault();
                        event.stopPropagation();
                        //return false;
                }else{
                        event.preventDefault();
                        event.stopPropagation();
                }
            });
            
        }
    }
    
/**********************************END***********************************/

    //initial scripts : put always at the end 
    $scope.init__dragDropCtrl = function(pageId){
        if(pageId != null){
            $scope.init_dropable_area(pageId);
        }
        else{
            $scope.init_dropable_area();
        }
    }
    $scope.init__dragDropCtrl($scope.page_id);
    //initial scripts : put always at the end


}]);