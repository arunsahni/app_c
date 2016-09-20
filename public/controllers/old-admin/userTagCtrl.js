var collabmedia = angular.module('collabmedia');
collabmedia.controller('userTagCtrl',function($rootScope,$scope,$http,$location,$timeout,loginService,$window,$stateParams,ngTableParams,$filter){
	$rootScope.loggedIn=true;
        
	$scope.gt={};
	
	$scope.openadd = function(T){
		$scope.t=T;
		$scope.dupMsg="";
		$scope.gt.mmt="";
		$scope.mt = "";
		$scope.gt.mt="";
		$scope.gt.name=T.TagTitle;
		$scope.gt.notes="";
		$scope.gt.id="";
		$('#myModal2').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	//////////////////////////////////////////////
	/*
	$scope.selectedGTS=[];
	$scope.chklst=function(x,y){
		console.log("x");
		console.log(x);
		console.log("y");
		console.log(y);
			$scope.addedT=false;
			for(a in $scope.selectedGTS){
				if ($scope.selectedGTS[a]._id==x._id) {
					$scope.addedT=true;
					$scope.gtIndex=a;
				}
			}
			if ($scope.addedT==true) {
				$("#"+x._id).remove();
				$scope.selectedGTS.splice(gtIndex,1);
			}
			else{
				console.log(y._id);
				$("#"+y._id).append("<div id="+x._id +" class='alert alert-warning alert-dismissible fade in' >"+x.GroupTagTitle +"</div>");
				$scope.selectedGTS.push(x);
			}
		
	}
	
	
	
	*/
	///////////////////////////////////////////////////////
	// function to populate lists on elevate to gt modal
	
	$scope.fetchmts=function(){		
		for(key in $scope.mmts){
			if($scope.mmts[key]._id==$scope.gt.mmt){
				$scope.mts=$scope.mmts[key].MetaTags;				
			}
		}
	}
	
	// function to elevate tag to  ==>> GT
	
	$scope.addgt = function(isValid){
		
		if(isValid){
		$http.post('/groupTags/add',$scope.gt).then(function (data, status, headers, config) {
			if (data.data.code==200){
					$scope.deletet();
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag Elevated to group tag successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
                                            
					$('#myModal').modal('hide');
			}
		});
		/*
		$http.post('/groupTags/add',$scope.gt).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.amit=data.data.response;
				$scope.gtData=data.data.response;
				$scope.gtData=($scope.gtData==undefined)?"":$scope.gtData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Group tag added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				$('#myModal').modal('hide');
			}
			else if (data.data.code==400) {
				$scope.dupMsg="A group tag with same name already exists.";
			}
		})
		*/
		}
		
	}
	
	
	$http.get('/metaMetaTags/view').then(function (data, status, headers, config) {			
		if (data.data.code==200){
			for (i in data.data.response){
				//if (data.data.response[i]._id == '54e7211a60e85291552b1187') {	// for ===== "5555" 
				if (data.data.response[i]._id == '54c98aab4fde7f30079fdd5a') { // for ===== "8888 " 
					data.data.response.splice(i,1);
				}
			}
			$scope.mmts=data.data.response;
			
		}	
	})
        
        $http.get('/tags/viewUserTag').then(function (data, status, headers, config) {
			//console.log(data.data.response);
                        if (data.data.code==200){				
                            $http.get('/groupTags/view').then(function (gtData, status, headers, config) {
                                        if (gtData.data.code==200){
                                            $scope.tagData=data.data.response;
                                            for(x in data.data.response){
                                                var gtTempSimilar=[];
												var gtTempRemaing=[];
                                                $scope.tagData[x].newGT=[];
												$scope.tagData[x].parent=$scope.tagData[x].gtId;
                                                for (y in gtData.data.response) {
                                                    if ((gtData.data.response[y].GroupTagTitle.indexOf(data.data.response[x].TagTitle))!=-1) {
                                                        gtTempSimilar.push(gtData.data.response[y]);
                                                    }else{
												gtTempRemaing.push(gtData.data.response[y]);
										    }                                                }
                                            $scope.tagData[x].gt=gtTempSimilar;
											$scope.tagData[x].remainingGt=gtTempRemaing;
                                        }
										$scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
										console.log($scope.tagData);
	                                    $scope.tableParams = new ngTableParams({
                                           page: 1,            // show first page
                                           count: 10,
                                           filter: {
                                               TagTitle: ''       // initial filter
                                           },
                                           sorting: {
                                               TagTitle: 'asc'     // initial sorting
                                           }
                                           // count per page
                                       }, {
                                            total: 0, // length of data
	                                    getData: function($defer, params) {
                                        // use build-in angular filter
                                        var filteredData = params.filter() ?
                                                $filter('filter')($scope.tagData, params.filter()) :
                                                $scope.tagData;
                                        var orderedData = params.sorting() ?
                                                $filter('orderBy')(filteredData, params.orderBy()) : $scope.tagData;
                                        params.total(orderedData.length); // set total for recalc pagination
                                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
                                    },$scope:{$data:{}}
                                    // getData: function($defer, params) {
                                    //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                    // }
                                });
                                            
                                            // parul table code ends
                            }
                            setTimeout(function(){
                                            
                                            $scope.loaded=true;
                                            },10);
                            });
                    
                    /*
                    loginService.chkAdminLogin($http,$location,$window).then(function(){
                            $scope.adminInfo = tempData;
                    });
                    */
                    
                    $scope.loaded=false;
                            }
                            
                            });
			//<-- parul table code starts-->
				
				
	//$scope.t={};
	////////////////Test start
	//$scope.id=$stateParams.id;
	//$scope.amit={};
	
       
	
	$scope.openedit = function(T){
            console.log(T);
            console.log("input[name='"+T._id+"[]']:checked");
		var abcc=$("input[name='"+T._id+"[]']:checked").val();
                
                
                
                console.log(abcc);
	}
        
        $scope.approve=function(){
            
            console.log($scope.t);
            if ($scope.t.parent==false) {
                //console.log(2);
                if ($scope.t.newGT.length<1) {
                    //console.log(3);
		     $('#approve_pop').modal('hide');
                    $('#noGT_pop').modal('show');
                }else{
		       
			$http.post('/tags/deleteUserTag',$scope.t).then(function (data, status, headers, config) {
				console.log(4);
				$http.post('/tags/addUserTags',$scope.t).then(function (data, status, headers, config) {
					console.log(5);
					$scope.tagData=data.data.response;
					$http.get('/groupTags/view').then(function (gtData, status, headers, config) {
                                        if (gtData.data.code==200){
                                            $scope.tagData=data.data.response;
                                            
                                            for(x in data.data.response){
                                                var gtTempSimilar=[];
						var gtTempRemaing=[];
                                                $scope.tagData[x].newGT=[];
						 $scope.tagData[x].parent=$scope.tagData[x].gtId;
                                                for (y in gtData.data.response) {
                                                    if ((gtData.data.response[y].GroupTagTitle.indexOf(data.data.response[x].TagTitle))!=-1) {
                                                        gtTempSimilar.push(gtData.data.response[y]);
                                                    }else{
							gtTempRemaing.push(gtData.data.response[y]);
						    }
                                                }
                                                $scope.tagData[x].gt=gtTempSimilar;
						$scope.tagData[x].remainingGt=gtTempRemaing;
                                            }
                                            $scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
                                           
                                        }
                                        });
                                       
                                       //     alert(1);
                                         document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag approved successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
                                            $scope.tableParams.reload();
                                          
					
					});
				});
			
		}
            }else
	    {
		//update -- updateUserTag
		$http.post('/tags/updateUserTag',$scope.t).then(function (data, status, headers, config) {
			console.log(6);
			if ($scope.t.newGT.length>0) {
				$http.post('/tags/addUserTags',$scope.t).then(function (data, status, headers, config) {
					console.log(7);
					$scope.tagData=data.data.response;
					$http.get('/groupTags/view').then(function (gtData, status, headers, config) {
                                        if (gtData.data.code==200){
                                            $scope.tagData=data.data.response;
                                            
                                            for(x in data.data.response){
                                                var gtTempSimilar=[];
						var gtTempRemaing=[];
                                                $scope.tagData[x].newGT=[];
						 $scope.tagData[x].parent=$scope.tagData[x].gtId;
                                                for (y in gtData.data.response) {
                                                    if ((gtData.data.response[y].GroupTagTitle.indexOf(data.data.response[x].TagTitle))!=-1) {
                                                        gtTempSimilar.push(gtData.data.response[y]);
                                                    }else{
							gtTempRemaing.push(gtData.data.response[y]);
						    }
                                                }
                                                $scope.tagData[x].gt=gtTempSimilar;
						$scope.tagData[x].remainingGt=gtTempRemaing;
                                            }
                                            $scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
                                           
                                        }
                                        });
                                       
                                       //     alert(1);
                                         document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag approved successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
                                            $scope.tableParams.reload();
                                          
					
					});
			}else{
				
				$scope.tagData=data.data.response;
					$http.get('/groupTags/view').then(function (gtData, status, headers, config) {
                                        if (gtData.data.code==200){
                                            $scope.tagData=data.data.response;
                                            
                                            for(x in data.data.response){
                                                var gtTempSimilar=[];
						var gtTempRemaing=[];
                                                $scope.tagData[x].newGT=[];
						 $scope.tagData[x].parent=$scope.tagData[x].gtId;
                                                for (y in gtData.data.response) {
                                                    if ((gtData.data.response[y].GroupTagTitle.indexOf(data.data.response[x].TagTitle))!=-1) {
                                                        gtTempSimilar.push(gtData.data.response[y]);
                                                    }else{
							gtTempRemaing.push(gtData.data.response[y]);
						    }
                                                }
                                                $scope.tagData[x].gt=gtTempSimilar;
						$scope.tagData[x].remainingGt=gtTempRemaing;
                                            }
                                            $scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
					    $scope.tableParams.reload();
                                       
                                        }
                                        });
                                       
                                       //     alert(1);
                                         document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag approved successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
                                        
			}
			
			});
		
		
	    //then if new gt has value update that too
	    }
	    
	$('#approve_pop').modal('hide');
        }
        
        
        
        $scope.opendelete = function(T){
		$scope.t=T;	
		$('#delete_pop').modal('show');
	}
	
         $scope.openApprove = function(T){
		$scope.t=T;	
		$('#approve_pop').modal('show');
	}
        $scope.deletet = function(){
			console.log($scope.t)
			$http.post('/tags/deleteUserTag',$scope.t).then(function (data, status, headers, config) {
				
					
					$scope.tagData=data.data.response;
					$http.get('/groupTags/view').then(function (gtData, status, headers, config) {
                                        if (gtData.data.code==200){
                                            $scope.tagData=data.data.response;
                                            
                                            for(x in data.data.response){
                                                var gtTempSimilar=[];
						var gtTempRemaing=[];
                                                $scope.tagData[x].newGT=[];
						 $scope.tagData[x].parent=$scope.tagData[x].gtId;
                                                for (y in gtData.data.response) {
                                                    if ((gtData.data.response[y].GroupTagTitle.indexOf(data.data.response[x].TagTitle))!=-1) {
                                                        gtTempSimilar.push(gtData.data.response[y]);
                                                    }else{
							gtTempRemaing.push(gtData.data.response[y]);
						    }
                                                }
                                                $scope.tagData[x].gt=gtTempSimilar;
						$scope.tagData[x].remainingGt=gtTempRemaing;
                                            }
                                            $scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
                                           
                                        }
                                        });
                                       
                                       //     alert(1);
                                         document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
                                            $scope.tableParams.reload();
                                            $('#delete_pop').modal('hide');
                                         
                                         
                                        
					
			})
		
	}
	
        $scope.openedit = function(T){
		$scope.t=T;		
		$scope.edit=1;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
        
        
        $scope.editt = function(isValid){
		if(isValid){
			$http.post('/tags/editUserTag',$scope.t).then(function (data, status, headers, config) {
				if (data.data.code==200){
					                                   
                                        
                                        $scope.tagData=data.data.response;
					$http.get('/groupTags/view').then(function (gtData, status, headers, config) {
                                        if (gtData.data.code==200){
                                            $scope.tagData=data.data.response;
                                            
                                            for(x in data.data.response){
                                                var gtTemp=[];
                                                $scope.tagData[x].newGT=[];
						 $scope.tagData[x].parent=$scope.tagData[x].gtId;
                                                for (y in gtData.data.response) {
                                                    if ((gtData.data.response[y].GroupTagTitle.indexOf(data.data.response[x].TagTitle))!=-1) {
                                                        gtTemp.push(gtData.data.response[y]);
                                                    }
                                                }
                                                $scope.tagData[x].gt=gtTemp;
                                            }
                                            $scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
                                           
                                        }
                                        });
                                        
                                        
                                        
                                        
                                        
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag renamed successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#myModal').modal('hide');
                                        
				}	
			})
		}
	}
        
        
        
	/*
         
	
	$http.post('/tags/view',{"id":$scope.id}).then(function (data, status, headers, config) {			
		if (data.data.code==200){				
			$scope.amit=data.data.response;
			//<-- parul table code starts-->
				
				$scope.tagData=data.data.response;
				$scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
				//console.log(data);
	
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   TagTitle: ''       // initial filter
			       },
			       sorting: {
				   TagTitle: 'asc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.tagData, params.filter()) :
		                    $scope.tagData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.tagData;
		            params.total(orderedData.length); // set total for recalc pagination
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
		        },$scope:{$data:{}}
		        // getData: function($defer, params) {
		        //     $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        // }
		    });
				
				// parul table code ends
		}
		setTimeout(function(){
				
				$scope.loaded=true;
				},10);
	});
        */
	
        
        /*
	$scope.addt = function(isValid){
		if(isValid){
		$http.post('/tags/add',$scope.t).then(function (data, status, headers, config) {
			if (data.data.code==200){
				console.log(data)
				$scope.amit=data.data.response;
				$scope.tagData=data.data.response;
				$scope.tagData=($scope.tagData==undefined)?"":$scope.tagData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				$('#myModal').modal('hide');
			}	
		})
		}
	}
	
        */
        
        /*
        
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.t.name="";
		$scope.t.tagid="";
		$scope.t.id=$scope.id;
		$('#myModal').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.openedit = function(T){
		$scope.t.name=T.TagTitle;
		$scope.t.tagid=T._id;
		$scope.t.id=$scope.id;
		$scope.edit=1;
		$('#myModal').modal('show');
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	*/
        
        
        
        /*
	$scope.editt = function(isValid){
		if(isValid){
			$http.post('/tags/edit',$scope.t).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.amit=data.data.response;
					$scope.tagData=data.data.response;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Tag updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#myModal').modal('hide');

				}	
			})
		}
	}
	*/
        
        
        
	
	
	
	///////////////Test End
	
        
        
        
        $scope.adminLogout = function() {
		$http.get('/admin/logout').then(function (data, status, headers, config) {
			if (data.data.logout=="200"){
				tempData = {};
				$window.location.href='/admin/login';
			}	
		})
	};
        
        
        
        
        
        
	//-------------------------- for theme and links ==> STARTS---------------->
	//highlight current / active link
	$('ul.main-menu li a').each(function(){
		if($($(this))[0].href==String(window.location))
			$(this).parent().addClass('active');
	});
	
	//themes, change CSS with JS
	//default theme(CSS) is cerulean, change it if needed
	var current_theme = $.cookie('current_theme')==null ? 'cerulean' :$.cookie('current_theme');
	//alert(current_theme);
	switch_theme(current_theme);
	
	$('#themes a[data-value="'+current_theme+'"]').find('i').addClass('icon-ok');
				 
	$('#themes a').click(function(e){
		//alert('hi');
		e.preventDefault();
		current_theme=$(this).attr('data-value');
		$.cookie('current_theme',current_theme,{expires:365});
		switch_theme(current_theme);
		$('#themes i').removeClass('icon-ok');
		$(this).find('i').addClass('icon-ok');
	});
	
	
	function switch_theme(theme_name)
	{
		//alert('switch_theme');
		$('#bs-css').attr('href','../assets/charisma/css/bootstrap-'+theme_name+'.css');
	}
	
	//-------------------------- for theme and links ==> STARTS---------------->
});