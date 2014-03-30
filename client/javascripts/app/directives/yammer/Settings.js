PulseApp.directive('settings', function (yammerData, $cookieStore) {
	return {
		restrict: 'A',
		scope: {},
		template:
				'<a class="settings glyphicon glyphicon-cog" href="" ng-click="IsSettingsFlyoutOpen = true"></a>' +
				'<div class="settingsFlyout" ng-show="IsSettingsFlyoutOpen">' +
					'<h3>Settings</h3>' +
					'<div class="radio">' +
						'<label><input type="radio" name="darkLight" ng-model="settings.theme" value="1">Light</label>' +
					'</div>' +
					'<div class="radio">' +
						'<label><input type="radio" name="darkLight" ng-model="settings.theme" value="2">Dark</label>' +
					'</div>' +
					'<div class="accentColorSelectors">' +
						'<a href="" class="selector" ng-repeat="color in accentColors" ng-style="{\'background-color\':color}" ng-class="{\'current\': color == settings.accentColor}" ng-click="setAccentColor(color)"></a>' +
					'</div>' +
					'<a href="" class="closeBtn" ng-click="IsSettingsFlyoutOpen = false"><span class="glyphicon glyphicon-remove-circle"></span></a>' +
				'</div>',
		controller: function ($scope) {
			$scope.accentColors = ['#A4C400', '#60A917', '#008A00', '#00ABA9', '#1BA1E2',
							'#0050EF', '#6A00FF', '#AA00FF', '#F472D0', '#D80073',
							'#A20025', '#E51400', '#FA6800', '#F0A30A', '#E30800',
							'#825A2C', '#6D8764', '#647687', '#76608A', '#87794E'];
			$scope.accentColorsFileNames = ['lime', 'green', 'emerald', 'teal', 'cyan',
											'cobalt', 'indigo', 'violet', 'pink', 'magenta',
											'crimson', 'red', 'orange', 'amber', 'yellow',
											'brown', 'olive', 'steel', 'mauve', 'taupe'];

			$scope.settings = { accentColor: '#0050EF', theme: "1" };

			$scope.setAccentColor = function (color) {
				$scope.settings.accentColor = color;
				$scope.applyAndSaveThemeSettings();
			};
			
			$scope.$watch('settings.theme', function (newValue, oldValue) {
				if (newValue != oldValue)
					$scope.applyAndSaveThemeSettings();
			});

			$scope.applyAndSaveThemeSettings = function () {
				var cssFileName = $scope.settings.theme == "1" ? 'light/' : 'dark/';
				var index = $.inArray($scope.settings.accentColor, $scope.accentColors);
				cssFileName += $scope.accentColorsFileNames[index];

				$('.themeStyleSheet').remove();
				$('head').append('<link id="themeStyleSheet" rel="stylesheet" type="text/css" href="' + window.location.origin + '/stylesheets/yammer/' + cssFileName + '.css">');

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