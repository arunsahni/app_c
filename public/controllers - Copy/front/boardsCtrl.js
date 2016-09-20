var collabmedia = angular.module('collabmedia');

collabmedia.controllerProvider.register('boardsCtrl',function($scope,$http,$location,loginService,$window,$stateParams,ngTableParams,$filter){
      var userdata={};
      $scope.loaded=false;
      var ud=[];
	  if ($window.localStorage['addBoard']=="true") {
		  //console.log('here');
		  $scope.msg='Board added successfully';
		  $window.localStorage['addBoard']=false;
		  //code
	  }else if ($window.localStorage['editBoard']=='true') {
		  //console.log('here');
		  $scope.msg='Board updated successfully';
		  $window.localStorage['editBoard']=false;
		  //code
	  }
	  
      loginService.chkUserLogin($http,$location,$window).then(function(){
              $scope.userInfo = tempData;
              userdata=$scope.userInfo;
              
              for(k in userdata.FSGs){
                      ud.push(k+'~'+userdata.FSGs[k])
              }
              
              
              
      });
      
      
      document.getElementById('close_span').addEventListener('click', function(e) {
              // $("#msg").fadeOut();
              //alert("click");
              $("#close_span").parent().fadeOut();
              
           }, false);
      
      
      $(".close_icon").click(function(){
         //alert(1);
         
         $(this).parent().fadeOut();
         $scope.msg2="";
         });
        
        
      dat={};
      $scope.projid=$stateParams.id;
      dat.project=$stateParams.id;
      $http.post('/boards/getProjectBoards',dat).then(function (data, status, headers, config) {
         if (data.data.code==200){
                 $scope.boards=data.data.response;
                 $scope.boards=($scope.boards)?($scope.boards):[];
                   //<-- parul table code starts-->
				
				//var data=data.data.response;
			
				//console.log(data);
			
			
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 5,
			       filter: {
				   Title: ''       // initial filter
			       },
			       sorting: {
				   ModifiedDate: 'desc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
			//$timeout(function() {
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.boards, params.filter()) :
		                    data;
                                    console.log(filteredData);
		            var orderedData = params.sorting() ?$filter('orderBy')(filteredData, params.orderBy()) : $scope.boards;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        //},500);
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
				
			},$scope: {$data: {}}
		    });
                       // console.log($scope.projects);
			
				
				// parul table code ends
         }
         //setTimeout(function(){
				
				$scope.loaded=true;
				//},10);
      })
      
      
      
      $scope.project={};
      
      $("#delete_pop").hide();
      
      $scope.closeDel=function(){
         $("#delete_pop").hide();
      }
      
       $scope.confirmDel=function(){
            $("#delete_pop").hide();
            $http.post('/boards/delete',$scope.boardDat).then(function (data, status, headers, config) {
				//window.localStorage['boardDelete']=true;
                              $scope.boards=data.data.response;
                              $scope.boards=($scope.boards)?($scope.boards):[];
                              console.log('delete method');
                              console.log(data.data.response);
                              $scope.tableParams.reload();
                              $scope.msg='Board deleted successfully';
                              $("p").css("display", "block");

            })
            }
      
      
      
      $scope.deleteBoard=function(board_del){
         $("#delete_pop").show();
         $scope.boardDat={};
            $scope.boardDat.boardId=board_del;
            
            $scope.boardDat.projId=$stateParams.id;
            /*
         if (confirm('Are you sure you want to delete this Board?')) {            
            $http.post('/boards/delete',data).then(function (data, status, headers, config) {
				//window.localStorage['boardDelete']=true;
                              $scope.boards=data.data.response;
                              $scope.boards=($scope.boards)?($scope.boards):[];
                              console.log('delete method');
                              console.log(data.data.response);
                              $scope.tableParams.reload();
               /*if (data.data.code==200){                     
                  $scope.boards=data.data.response;
                  $scope.tableParams.reload();
				  //window.localStorage['deleteBoard']=true;
               }*/
              /* $scope.msg='Board deleted successfully';
                 $("p").css("display", "block");
                                                // $window.location.reload();

            })
         }*/
      }
      
});


collabmedia.controllerProvider.register('addboardsCtrl',function($scope,$http,$location,loginService,$window,$stateParams){
   var userdata={};
   var ud=[];
   
   $("li").keydown(function(){
         //alert(1);
         $(this).find("p").css("display", "block");
         
       });
   
      $('li').click(function() {
            //alert(1);
            //$("p").css("display", "block");
            
                  $(this).find("p").css("display", "block");
                  
            
        });
      
     
   
   /*
      $('form').submit(function(event){
                  
                  event.preventDefault();
                  alert(1);
                  $("p").css("display", "block");
                  $scope.msg2="Please complete all the fields to proceed.";
              });
   */
    $(".close_icon").click(function(){
         //alert(1);
         $(this).parent().fadeOut();
         $scope.msg2="";
         });
    
   $scope.projid=$stateParams.projid;
   loginService.chkUserLogin($http,$location,$window).then(function(){
           $scope.userInfo = tempData;
           userdata=$scope.userInfo;
           
           for(k in userdata.FSGs){
                   ud.push(k+'~'+userdata.FSGs[k])
           }
   });
   
   $http.get('/domains/view').then(function (data, status, headers, config) {
      if (data.data.code==200){
              $scope.domains=data.data.response;
      }	
   })
   
   $http.get('/collections/view').then(function (data, status, headers, config) {
      if (data.data.code==200){
              $scope.collections=data.data.response;
      }	
   })
   
   //$http.get('/groupTags/view').then(function (data, status, headers, config) {
   $http.get('/groupTags/without_descriptors').then(function (data, status, headers, config) {
      if (data.data.code==200){
			//added on 17032015 by paruls
            $scope.gts = data.data.response;
      }	
   })
   
   $scope.board={};
   $scope.submitForm=function(isValid){
      //console.log("is valid= "+isValid);
      if (isValid) {
         
         $scope.board.project=$scope.projid;
         
         $http.post('/boards/add',$scope.board).then(function (data, status, headers, config)         {
	    if (data.data.code==200){
               window.localStorage['addBoard']=true;
			   $window.location='#/boards/'+$scope.projid;
	       //$scope.fsgs=data.data.response;
	    }	
	 })
         
      }else{
            $("#msg2").css("display", "block");
            //var len=Object.keys($scope.board).length;
            /*console.log($scope.board);
            var count=0;
           Object.keys($scope.board).forEach(function(){
                  if ($scope.board.this==undefined) {
                        //code
                        count=count+1;
                  }
            });*/
           //console.log("count="+count);
            $scope.msg2="Please complete all the fields to proceed.";
            
      }
   }
   
});

collabmedia.controllerProvider.register('editboardsCtrl',function($scope,$http,$timeout,$location,loginService,$window,$stateParams){
   
   
   
   var userdata={};
   var ud=[];
   $scope.projid=$stateParams.projid;
   $scope.id=$stateParams.id;
   loginService.chkUserLogin($http,$location,$window).then(function(){
      $scope.userInfo = tempData;
      userdata=$scope.userInfo;
      
      for(k in userdata.FSGs){
              ud.push(k+'~'+userdata.FSGs[k])
      }
   });
   
   

   $http.get('/domains/view').then(function (data, status, headers, config) {
      if (data.data.code==200){
              $scope.domains=data.data.response;
      }	
   })
   
   $http.get('/collections/view').then(function (data, status, headers, config) {
      if (data.data.code==200){
              $scope.collections=data.data.response;
      }	
   })
   
   $http.get('/groupTags/without_descriptors').then(function (data, status, headers, config) {
      if (data.data.code==200){
              $scope.gts=data.data.response;
      }	
   })
   
   
   $http.post('/boards/getProjectBoards',{project:$scope.projid,id:$stateParams.id}).then(function (data, status, headers, config) {
      //console.log(1);
      if (data.data.code==200)
      {     //console.log(2);         
               $scope.boarddata=data.data.response;
               for(i in $scope.boarddata){
                  
                  if ($scope.boarddata[i]._id==$scope.id) {                
                     $timeout(function(){                        
                        var selectedVal=[];
                        for(abc in $scope.boarddata[i].Themes){
                           if(userdata._id==$scope.boarddata[i].Themes[abc].SuggestedBy){
                              selectedVal.push($scope.boarddata[i].Themes[abc].ThemeID+'~'+$scope.boarddata[i].Themes[abc].ThemeTitle);
                           }
                        }
                        $scope.board.gt=selectedVal;
                        //$scope.board.collection=$scope.boarddata[i].Collection._id; // commented by parul 08012015 to resolve some issue 
                        $scope.board.name=$scope.boarddata[i].Title;
                        $scope.board.domain=$scope.boarddata[i].Domain._id;
                        $scope.board.begin=$scope.boarddata[i].BeginDate;
                        $scope.board.end=$scope.boarddata[i].EndDate;
                        $scope.board.boardType=$scope.boarddata[i].PrivacySetting[0].BoardType;
                        $scope.board.displayName=$scope.boarddata[i].PrivacySetting[0].DisplayNames;
                        //alert(1);
                        //console.log($scope.board);
                     }, 500);
                  }
               }
      }	
   })
     $("li").keydown(function(){
         //alert(1);
         $(this).find("p").css("display", "block");
         
       });
   
      $('li').click(function() {
            //alert(1);
            //$("p").css("display", "block");
            
                  $(this).find("p").css("display", "block");
                  
            
        });
   $scope.board={};
   
   $scope.submitForm=function(isValid){
      if (isValid) {
         $scope.board.id=$scope.id;                  
         $scope.board.project=$scope.projid;
         
         console.log($scope.board);
          $http.post('/boards/edit',$scope.board).then(function (data, status, headers, config)         {
	    if (data.data.code==200){
               window.localStorage['editBoard']=true;
			   $window.location='#/boards/'+$scope.projid;
	    }	
	 })
      }else{
            $("p").css("display", "block");
            $scope.msg2="Please complete all the fields to proceed.";
      }
   }
   
});