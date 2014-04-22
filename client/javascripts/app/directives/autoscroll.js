PulseApp.directive('autoscroll', ['$timeout', '$document', '$window', function($timeout, $document, $window){
	return {
		link: function(scope, elm, attrs){

			var atBottom=true;

			function scroll(){
				if(atBottom)
					elm[0].scrollTop = elm[0].scrollHeight;
			}

			var timeout;
			function autoscroll(){		
				scroll();	
				timeout = $timeout(autoscroll, 250);	
			}
			autoscroll();

			scope.$watch(attrs.watchItem, scroll, true);

			elm.scroll(function (e) {
				var height = elm.height();
				var st = elm[0].scrollTop;
				var scrollHeight = elm[0].scrollHeight;
				atBottom = elm[0].scrollHeight - elm[0].scrollTop - elm.height() <= 10;
			});

			scope.$on('$destroy', function(e){
               $timeout.cancel(timeout);
            });

		}
	};	
}]);