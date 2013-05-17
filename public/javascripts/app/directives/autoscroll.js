PulseApp.directive('autoscroll', ['$timeout', function($timeout){
	return {
		link: function(scope, elm, attrs){
			function scroll(){
				if(scope.$eval(attrs.watchEnabled))
					elm[0].scrollTop=elm[0].scrollHeight;
			}

			var timeout;
			function autoscroll(){		
				scroll();		
				timeout = $timeout(autoscroll, 250);
			}
			autoscroll();
			scope.$on('destroy', function(e){
				$timeout.cancel(timeout);
			})

			scope.$watch(attrs.watchItem, scroll, true);
		}
	};	
}]);