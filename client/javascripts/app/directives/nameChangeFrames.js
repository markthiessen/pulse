PulseApp.directive('nameChangeFrames', [ '$timeout',
	function($timeout){
		return {
			restrict: 'A',
			scope: {
				frames: '='
			},
			link: function(scope, elm, attrs){
				if(scope.frames){
					var textAnimationContainer = angular.element('<span>');
					elm.append(textAnimationContainer);
					var index = 0;

					var timeout;
					function showFrame(){
						textAnimationContainer.text(scope.frames[index]);
						index = (index+1)%scope.frames.length;
						timeout = $timeout(showFrame, index==0? 2000: 100);
					}
					showFrame();

					scope.$on('$destroy', function(){
						$timeout.cancel(timeout);
					});
				}
			}
		}
	}]);