PulseApp.directive('autoscroll', ['$timeout', '$document', '$window', function($timeout, $document, $window){
	return {
		link: function(scope, elm, attrs){

			var atBottom=true;

			function scroll(){
				if(atBottom)
					$document[0].body.scrollTop=$document[0].body.scrollHeight;
			}

			var timeout;
			function autoscroll(){		
				scroll();	
				timeout = $timeout(autoscroll, 250);	
			}
			autoscroll();

			scope.$watch(attrs.watchItem, scroll, true);

			angular.element($window).scroll(function(e){	
				var height = angular.element($window).height();
		        var st = $document[0].body.scrollTop;
		        var scrollHeight = $document[0].body.scrollHeight;
		        atBottom = (st >= scrollHeight -height -150);			
			});

			scope.$on('$destroy', function(e){
               $timeout.cancel(timeout);
            });

		}
	};	
}]);