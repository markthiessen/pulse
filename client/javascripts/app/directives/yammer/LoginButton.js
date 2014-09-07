PulseApp.directive('loginButton', function (yammerData, $rootScope) {
	return {
		restrict: 'A',
		template: '<span id="yammer-login"></span>',
		link: function ($scope, elm, attrs) {
			$(document).ready(function () {
				if (!yammerData.thread || !yammerData.thread.Items) {
					yammerData.connect('#yammer-login', function (result) {
						elm.hide();
						yammerData.currentNetworkToken = result.access_token.token;
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