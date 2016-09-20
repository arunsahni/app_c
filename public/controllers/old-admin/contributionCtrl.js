var collabmedia = angular.module('collabmedia');
collabmedia.controller('contributionCtrl',function($rootScope,$scope,$http,$location,loginService,$window,ngTableParams,$filter){
		$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
        $scope.loaded=false;
	$scope.result={};
	$scope.data={};
        $scope.typ="Media Score";
        $scope.userScore=function(){
                $("#uscr").removeClass('btn-primary');
                $("#uscr").addClass('btn-success');
                $("#mscr").removeClass('btn-success');
                $("#mscr").addClass('btn-primary');
                $scope.typ="User Score";
        };
        
         $scope.mediaScore=function(){
                $("#mscr").removeClass('btn-primary');
                $("#mscr").addClass('btn-success');
                $("#uscr").removeClass('btn-success');
                $("#uscr").addClass('btn-primary');
                $scope.typ="Media Score";
        };
        
	$http.get('/contribution/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.result=data.data.response;
				setPagingData($scope.result);
                                //<-- parul table code starts-->
				
				$scope.conData=data.data.response;
				$scope.conData=($scope.conData==undefined)?"":$scope.conData;
				//console.log(data);
	
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   contributionTitle: ''       // initial filter
			       },
			       sorting: {
				   LastModified: 'desc'     // initial sorting
			       }
			       // count per page
			   }, {
				total: 0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.conData, params.filter()) :
		                    $scope.conData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.conData;
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
	})
	
	function setPagingData(datam){
		$scope.allData = {};
		$scope.perPage = 10;
		//$scope.allData = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		$scope.allData = datam;
		$scope.offset = 0;
		$scope.navButtons = [];
		
		$scope.isPreviousDisabled = false;
		$scope.isNextDisabled = false;

		$scope.buildNavButtons = function () {
			for (var i = 0, len = ($scope.allData.length / $scope.perPage); i < len; i = i + 1) {
				$scope.navButtons.push(i);
			}
			//alert("Nav Buttons : " + $scope.navButtons);
		}

		$scope.paginate = function() {
			$scope.data = $scope.allData.slice($scope.offset, $scope.offset + $scope.perPage);
			//alert("Sliced Data : " + $scope.data);
		};

		$scope.previous = function() {
			$scope.offset = $scope.offset - $scope.perPage;
			
		};

		$scope.next = function() {
			//alert("offset value : "+os);
			$scope.offset = $scope.offset + $scope.perPage;
			
		};	

		$scope.$watch('offset', function() {
			
			if( $scope.offset < 0 ){
				$scope.isPreviousDisabled = true;
				$scope.isNextDisabled = false;
				//alert("Previous button disabled : "+$scope.offset);
				$scope.offset = 0;
				//alert("Offset Value changed to : "+$scope.offset);
				return false;
			}
			else{
				$scope.isPreviousDisabled = false;
			}
			
			//disable Next button
			//if( $scope.offset > (($scope.perPage * ($scope.allData.length/$scope.perPage))-1) ){
			if( $scope.offset > ($scope.allData.length-1) ){
				$scope.isNextDisabled = true;
				$scope.isPreviousDisabled = false;
				//alert("Next button disabled : "+$scope.offset);
				$scope.offset = ($scope.perPage * ($scope.allData.length/$scope.perPage));
				//alert("Offset Value changed to : "+$scope.offset);
				return false;
			}
			else{
				$scope.isNextDisabled = false;
			}
			$scope.paginate();
			//alert("In else...");
		});
		$scope.buildNavButtons();
	}
	
	$scope.contribution={};
	$scope.addcontribution = function(isValid){
		if(isValid){
			//alert("validated....");
			//alert(JSON.stringify($scope.ssource));
			$http.post('/contribution/add',$scope.contribution).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.result=data.data.response;
					$scope.conData=data.data.response;
                    $scope.conData=($scope.conData==undefined)?"":$scope.conData;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Contribution added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
                    $('#myModal').modal('hide');
				}	
			})
		}
	}
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.contribution.title="";
		$scope.contribution.value="";
		$scope.contribution.id="";
		$('#myModal').modal('show');
		$scope.edit=0;
                setTimeout(function(){
			document.getElementById("value").focus();	
		},210);
	}
	
	$scope.openedit = function(Contribution){
		$scope.contribution.title=Contribution.contributionTitle;
		$scope.contribution.value=Contribution.contributionValue;
		$scope.contribution.id=Contribution._id;
		$scope.edit=1;
		$('#myModal').modal('show');
                setTimeout(function(){
			document.getElementById("value").focus();	
		},210);
	}
	
	$scope.editcontribution = function(isValid){
		if(isValid){
			$http.post('/contribution/edit',$scope.contribution).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.result=data.data.response;
					$scope.conData=data.data.response;
                                        $scope.conData=($scope.conData==undefined)?"":$scope.conData;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>Contribution updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
                                        
					$('#myModal').modal('hide');

				}	
			})
		}
	}
	
	$scope.sourceId	=	"";
	
	
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