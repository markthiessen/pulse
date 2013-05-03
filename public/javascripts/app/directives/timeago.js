PulseApp.directive('timeago', ['$timeout', function($timeout){
	return {
		scope: {
			time: '='
		},
		link: function(scope, elm, attrs){
			function updateTime(){
				var time = moment(scope.time).fromNow();
				elm.text(time);
				$timeout(updateTime, 1000);
			}	
			updateTime();
		}
	};	
}]);