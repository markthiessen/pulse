PulseApp.directive('autofade', ['$timeout', function($timeout){
	return {
		link: function(scope, elm, attrs){

			var idleTime = 1000*60*5;

			function setIdle(){
				elm.css({opacity:'0.5'});
				elm.attr('title', 'Idle for more than 5 minutes...');
			}

			var existingTimeout=$timeout(setIdle,idleTime);


			scope.$watch(attrs.autofade, function(newVal){
				if(newVal){
					if(existingTimeout)
						$timeout.cancel(existingTimeout);

					elm.css({opacity:'1'});
					elm.attr('title', '');

					existingTimeout=$timeout(setIdle,idleTime);
				}
			});

			scope.$on('$destroy', function(){
				$timeout.cancel(existingTimeout);
			});
		}
	};	
}]);