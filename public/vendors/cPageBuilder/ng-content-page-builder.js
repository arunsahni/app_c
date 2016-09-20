var cpb = angular.module('collabmedia');

cpb.compileProvider.directive('widgetToolbar', ["$compile" , function ($compile) {
	var template = '<!-- WIDGET TOOLBAR --><div class="widget-toolbar">';
		template += '<div class="f-left">';
		template +='<a href="javascript:void(0)" class="icon-box background margin-left-15"><img src="../assets/cpage/images/icons/screen-view.png" alt="screen-view" /></a>'
		template += '<a href="javascript:void(0)" class="icon-box background margin-left-15"><img src="../assets/cpage/images/icons/undo-redo.png" alt="undo-redo" /></a>'
		template += '<!-- DESKTOP MODAL -->'
		template += '<div class="desktop-popup">'

		template += '</div>'
		template += '<!-- /DESKTOP MODAL -->'
		template += '</div>'

		template += '<div class="widget background margin-left-15 edit-bg">'
		template += '<a href="javascript:void(0)" class="add-bg-widget brandon-bold edit-bg-link">EDIT BACKGROUND</a>'
		template += '<div class="background-icons icons-box" style="display:none;">'
		template += '<a href="javascript:void(0);"><img src="../assets/cpage/images/icons/color.png" alt="color" /></a>'
		template += '<a href="javascript:void(0);"><img src="../assets/cpage/images/icons/photos.png" alt="photos" /></a>'
		template += '<a href="javascript:void(0);"><img src="../assets/cpage/images/icons/video.png" alt="video" /></a>'
		template += '</div>'
		template += '</div>'

		template += '<div class="widget background margin-left-15 edit-fg">'
		template += '<a href="javascript:void(0)" class="add-bg-widget brandon-bold edit-fg-link">EDIT FOREGROUND</a>'
		template += '<div class="foreground-icons icons-box" style="display:none;">'
		template += '<a href="javascript:void(0);"><img src="../assets/cpage/images/icons/text.png" alt="text" /></a>'
		template += '<a href="javascript:void(0);"><img src="../assets/cpage/images/icons/photos.png" alt="photos" /></a>'
		template += '<a href="javascript:void(0);"><img src="../assets/cpage/images/icons/video.png" alt="video" /></a>'
		template += '<a href="javascript:void(0);"><img src="../assets/cpage/images/icons/audio.png" alt="audio" /></a>'
		template += '<a href="javascript:void(0);"><img src="../assets/cpage/images/icons/ques-ans.png" alt="ques-ans" /></a>'
		template += '</div>'
		template += '</div>'

		template += '<div class="f-right">'
		template += '<a href="javascript:void(0)" class="icon-box background margin-left-15"><img src="../assets/cpage/images/icons/grid.png" alt="grid" /></a>'
		template += '<a href="javascript:void(0)" class="icon-box background margin-left-15"><img src="../assets/cpage/images/icons/adjust-screen.png" alt="adjust-screen" /></a>'
		template += '</div>'
		template += '</div><!-- /WIDGET TOOLBAR -->';

	var linker = function(scope, element, attrs) {
		element.html(template).show();
		$compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'=content'
        }
    };
}]);


//viewportSetter
cpb.compileProvider.directive('workshop', ["$compile" , function ($compile) {
	var template = '<div id="container" tabindex="-1" title="id:main"><div class="workshop" title="class:workspace" style="height: 642px;  left: 171px; opacity: 1; top: 0;  width: 1024px;" ><div class="workshop-inr" style=" height: 642px; width: 1024px;" ><testing content="{}"></testing></div><div class="workshop-border"></div></div></div>';
	var linker = function(scope, element, attrs) {
		element.html(template).show();
		$compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
}]);

cpb.compileProvider.directive('testing', ["$compile" , function ($compile) {
	var template = '<h1>testing....</h1>';
	var linker = function(scope, element, attrs) {
		element.html(template).show();
		$compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
}]);

cpb.compileProvider.directive('backgroundWidget', ["$compile" , '$timeout', function ($compile , $timeout) {
	var colorTemplate = '<div class="main-bg-block"><div class="main-bg"><div class="picture-bg" style="background-color: {{content.data}};"></div></div></div>';
	var imageTemplate = '<div class="main-bg-block"><div class="main-bg"><div class="picture-bg"  style="background-image:url('+'../assets/cpage/images/bg-image.jpg);"></div></div></div>';
	var videoTemplate = '<div class="main-bg-block"><div class="main-bg"><div class="video-bg" style="opacity: 1;display:block"><div class="video-overlay"></div>'+'<div class="video-block"><iframe width="640" height="320" frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/YtdK_Y5iZnU?wmode=opaque&enablejsapi=1&playlist=&autohide=1&loop=1&showinfo=0&theme=dark&controls=1&html5=1&rel=0&vq=hd1080" style="left: -5px; top: 0px; width: 1376px; height: 1032px;"></iframe>'+'</div></div></div></div>';
    
    var getTemplate = function(contentType) {
        var template = '';

        switch(contentType) {
            case 'color':
                template = colorTemplate;
                break;
			case 'image':
                template = imageTemplate;
                break;
            case 'video':
                template = videoTemplate;
                break;
        }
		
		return template;
    }

    var linker = function(scope, element, attrs) {
		element.html(getTemplate(scope.content.content_type)).show();
		$compile(element.contents())(scope);
	}
	
	return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
}]);