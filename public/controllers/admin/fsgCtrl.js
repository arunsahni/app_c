var collabmedia = angular.module('collabmedia');
collabmedia.controller('fsgCtrl',function($rootScope,$scope,$http,$location,loginService,$window,ngTableParams,$filter){
	$rootScope.loggedIn=true;
	/*
	loginService.chkAdminLogin($http,$location,$window).then(function(){
		$scope.adminInfo = tempData;
	});
	*/
	$scope.loaded=false;
	$scope.amit={};
	
	
	/*
	var alphaOnly = /[A-Za-z]/g;
	
	

// create as many regular expressions here as you need:
//var digitsOnly = /[1234567890]/g;
//var integerOnly = /[0-9\.]/g;
var alphaOnly = /[A-Za-z]/g;
function restrictCharacters(myfield, e, restrictionType) {
//if (!e) var e = window.event
//if (e.keyCode) code = e.keyCode;
//else if (e.which) code = e.which;
var character = String.fromCharCode(code);
// if they pressed esc... remove focus from field...
if (code==27) { this.blur(); return false; }
// ignore if they are press other keys
// strange because code: 39 is the down key AND ' key...
// and DEL also equals .
if (!e.ctrlKey && code!=9 && code!=8 && code!=36 && code!=37 && code!=38 && (code!=39 || (code==39 && character=="'")) && code!=40) {
if (character.match(restrictionType)) {
return true;
} else {
return false;
}
}
} 
	
	*/
	$("#name").bind("keypress", function (event) {
		if ((event.charCode!=0)&&(event.charCode!=32)) {
		    var regex = new RegExp("^[a-zA-Z]+$");
		    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		    if (!regex.test(key)) {
			event.preventDefault();
			return false;
		    }
		}
	    });
	
	
	$http.get('/fsg/view').then(function (data, status, headers, config) {			
			if (data.data.code==200){
				$scope.amit=data.data.response;
				//<-- parul table code starts-->
				
				$scope.fsgData=data.data.response;
				$scope.fsgData=($scope.fsgData==undefined)?"":$scope.fsgData;
				//console.log(data);
	
			$scope.tableParams = new ngTableParams({
			       page: 1,            // show first page
			       count: 10,
			       filter: {
				   Title: ''       // initial filter
			       },
			       sorting: {
				   LastModified: 'desc'     // initial sorting
			       }
			       // count per page
			   }, {
				total:0, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var filteredData = params.filter() ?
		                    $filter('filter')($scope.fsgData, params.filter()) :
		                    $scope.fsgData;
		            var orderedData = params.sorting() ?
		                    $filter('orderBy')(filteredData, params.orderBy()) : $scope.fsgData;
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
	
	$scope.fsg={};
	$scope.addfsg = function(isValid){
		if(isValid){
		$http.post('/fsg/add',$scope.fsg).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.amit=data.data.response;
				$scope.fsgData=data.data.response;
				$scope.fsgData=($scope.fsgData==undefined)?"":$scope.fsgData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>FSG added successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				$('#myModal').modal('hide');
			}	
		})
		}
	}
	$scope.edit=0;
	$scope.openadd = function(){
		$scope.fsg.name="";
		$scope.fsg.values="";
		$scope.fsg.id="";
		$('#myModal').modal('show');
		$scope.edit=0;
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.openedit = function(Fsg){
		$("#name").removeAttr("readonly");
		$("#name").removeAttr("title");
		$scope.fsg.name=Fsg.Title;
		var fsgvalues = "";
		for(key in Fsg.Values){
			if(key==0){
				fsgvalues=Fsg.Values[key].valueTitle;
			}
			else{
				fsgvalues=fsgvalues+';'+Fsg.Values[key].valueTitle;
			}
		}
		$scope.fsg.values=fsgvalues;
		$scope.fsg.id=Fsg._id;
		$scope.edit=1;
		$('#myModal').modal('show');
		if ($scope.fsg.name=="Country of Affiliation"||$scope.fsg.name=="Gender"||$scope.fsg.name=="Relation") {
			//alert(1);
			$("#name").attr("readonly","true");
			$("#name").attr("title","This field is read only");
			//$("#fsgValues").attr("readonly","true");
		}
		setTimeout(function(){
			document.getElementById("name").focus();	
		},210);
	}
	
	$scope.editfsg = function(isValid){
		if(isValid){
			$http.post('/fsg/edit',$scope.fsg).then(function (data, status, headers, config) {
				if (data.data.code==200){
					$scope.amit=data.data.response;
					$scope.fsgData=data.data.response;
					document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>FSG updated successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
					$scope.tableParams.reload();
					$('#myModal').modal('hide');
				}	
			})
		}
	}
	
	$scope.domainId	=	"";
	$scope.openDelete = function(id){
		$scope.fsgId = id;
		$('#delete_pop').modal('show');
	}
	
	$scope.deletefsg = function(id){
		$http.post('/fsg/delete',{"id":id}).then(function (data, status, headers, config) {
			if (data.data.code==200){
				$scope.amit = data.data.response;
				$scope.fsgData=data.data.response;
				$scope.fsgData=($scope.fsgData==undefined)?"":$scope.fsgData;
				document.getElementById('msg').innerHTML="<div class='alert alert-warning alert-dismissible fade in' ng-show='msg1'>FSG deleted successfully.<a class='close' data-dismiss='alert' href='#' aria-hidden='true'>&times;</a></div>";
				$scope.tableParams.reload();
				$('#delete_pop').modal('hide');
			}	
		})
	}
	
	$scope.adminLogout = function() {
		console.log("asdasdasd");
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