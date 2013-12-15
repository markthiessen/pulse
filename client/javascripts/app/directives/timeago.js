PulseApp.directive('timeago', ['$timeout', function($timeout){
	return {
		scope: {
			time: '='
		},
		link: function(scope, elm, attrs){
			elm.tooltip({
				title: '<span><i class="glyphicon glyphicon-white glyphicon-time"></i> '
						+ moment(scope.time).format('MMMM Do, h:mm:ss a')
						+'</span>',
				html: true,
				placement: 'right',
				container: 'body'
			});
			var timeout;
			function updateTime(){
				var time = moment(scope.time).fromNow();
				elm.text(time);
				timeout=$timeout(updateTime, 30000);
			}	
			updateTime();

			scope.$on('$destroy', function(){
				$timeout.cancel(timeout);
			});
		}
	};	
}]);