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
					var animationCounter=0;
					var animationLimit = 5;

					function showFrame(){
						textAnimationContainer.text(scope.frames[index]);
						index++;
						if(index>=scope.frames.length)
							animationCounter++;
						index = index%scope.frames.length;
						if(animationCounter<=animationLimit)
							timeout = $timeout(showFrame, index==0? 2000: 100);
					}
					showFrame();

					elm.on("click", function(e){
						e.preventDefault();
						if(animationCounter>=animationLimit){
							animationCounter=0;
							index=0;
							showFrame();
						}
					})

					scope.$on('$destroy', function(){
						$timeout.cancel(timeout);
					});
				}
			}
		}
	}]);