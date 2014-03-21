PulseApp.directive('actionOnclick', function (yammerService, $compile) {
	return {
		restrict: 'A',
		link: function ($scope, elm, attrs) {
			if (elm.is('a')) {
				elm.click(function() {
					var parent = elm.closest('.message');
					var id = parent.attr('id');
					window.location.href = "https://www.yammer.com/messages/" + id.substring(7, id.length);
				});
			}
		}
	};
});