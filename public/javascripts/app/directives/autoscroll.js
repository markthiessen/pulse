PulseApp.directive('autoscroll', ['$timeout', function($timeout){
	return {
		link: function(scope, elm, attrs){

			var atBottom=true;

			function scroll(){
				if(atBottom)
					elm[0].scrollTop=elm[0].scrollHeight;
			}

			var timeout;
			function autoscroll(){		
				scroll();	
				timeout = $timeout(autoscroll, 250);	
			}
			autoscroll();

			scope.$watch(attrs.watchItem, scroll, true);

			var container = angular.element(elm);
			container.scroll(function(e){	
				var height = container.height();
		        var scrollHeight = container[0].scrollHeight;
		        var st = container.scrollTop();
		        atBottom = (st >= scrollHeight - height - 100);			
			});

			scope.$on('destroy', function(e){
               $timeout.cancel(timeout);
            });

		}
	};	
}]);