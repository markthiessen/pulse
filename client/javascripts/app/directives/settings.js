PulseApp.directive('settings', function ($cookieStore, $timeout) {
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

				$scope.updateStyleSheet('yammerStyleSheet', '/stylesheets/yammer/' + lightOrDark + '_yammer.css');
				$scope.updateStyleSheet('mainStyleSheet', '/stylesheets/' + lightOrDark + '_style.css');

				$cookieStore.put("settings", $scope.settings);
			};

			$scope.updateStyleSheet = function (name, path) {
				var styleSheet = $('<link rel="stylesheet" type="text/css" href="' + path + '">');
				$('head').append(styleSheet);
				$timeout(function () {
					$('#' + name).remove();
					styleSheet.attr('id', name);
				}, 1000);
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