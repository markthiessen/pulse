PulseApp.directive('typingWatcher', ['$timeout', function($timeout){
	return {
		link: function(scope, elm, attrs){

			var existingTimeout;
			scope.$watch(attrs.typingWatcher, function(newVal){
				if(newVal){
					if(existingTimeout)
						$timeout.cancel(existingTimeout);
					elm.addClass('visible');//.show();
					existingTimeout=$timeout(function(){
						elm.removeClass('visible');
					},3000);
				}
			});
		}
	};	
}]);