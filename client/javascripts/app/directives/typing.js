PulseApp.directive('typingWatcher', ['$timeout', function($timeout){
	return {
		link: function(scope, elm, attrs){

			var timeout;
			scope.$watch(attrs.typingWatcher, function(newVal){
				if(newVal){
					
					$timeout.cancel(timeout);
					elm.addClass('visible');//.show();
					setTimeout(function() {}, 10);=$timeout(function(){
						elm.removeClass('visible');
					},3000);
				}
			});
			scope.$on('$destroy', function(){
				$timeout.cancel(timeout);
			});
		}
	};	
}]);