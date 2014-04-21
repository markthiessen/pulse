PulseApp.directive('settings', function ($cookieStore) {
	return {
		restrict: 'A',
		scope: {},
		template: '<span class="glyphicon glyphicon-certificate" ng-click="toggleTheme()" title="Change Theme"></span>',
		controller: function ($scope) {
			$scope.settings = { theme: 0 };
			
			$scope.toggleTheme = function () {
				$scope.settings.theme = $scope.settings.theme == 0 ? 1 : 0;
				$scope.applyAndSaveThemeSettings();
			};

			$scope.applyAndSaveThemeSettings = function () {
				var lightOrDark = $scope.settings.theme == 0 ? 'light' : 'dark';

				$('.yammerStyleSheet').remove();
				$('head').append('<link id="yammerStyleSheet" rel="stylesheet" type="text/css" href="' + window.location.origin + '/stylesheets/yammer/' + lightOrDark + '_yammer.css">');

				$('.mainStyleSheet').remove();
				$('head').append('<link id="mainStyleSheet" rel="stylesheet" type="text/css" href="' + window.location.origin + '/stylesheets/' + lightOrDark + '_style.css">');

				$cookieStore.put("settings", $scope.settings);
			};

			$(document).ready(function () {
				var savedSettings = $cookieStore.get('settings');
				if (savedSettings && savedSettings.theme)
					$scope.settings = savedSettings;

				$scope.applyAndSaveThemeSettings();
			});
		}
	};
});