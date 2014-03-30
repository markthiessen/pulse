PulseApp.directive('loginButton', function (yammerData, $rootScope) {
	return {
		restrict: 'A',
		template: '<span id="yammer-login"></span>',
		link: function ($scope, elm, attrs) {
			$(document).ready(function () {
				if (!yammerData.thread || !yammerData.thread.Items) {
					yammerData.connect('#yammer-login', function () {
						elm.hide();
						yammerData.isAuthenticated = true;
						$rootScope.$apply();
					});
				}
				else
					yammerData.isAuthenticated = true;
			});
		}
	};
});