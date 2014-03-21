PulseApp.controller('YammerCtrl', 
	['$scope', '$rootScope', '$chatService', '$pageInfoService', '$sce', '$timeout', 'yammerData',
	function($scope, $rootScope, $chatService, $pageInfoService, $sce, $timeout, yammerData){
		$rootScope.activeView='Yammer';

		$scope.data = yammerData;
		$scope.threadId = -1;
		$scope.isSingleThread = $scope.threadId > 0;

		$(document).ready(function () {
			yammerData.connect('#yammer-login', function() {
				$('#yammer-login').hide();
				$scope.isAuthenticated = true;

				if ($scope.isSingleThread)
					yammerData.refreshThread($scope.threadId);
				else
					yammerData.refreshFeed();
				yammerData.updateNotifications();
			});
		});
		
		$scope.$watch('data.thread', function () {
			if (!$scope.isSingleThread && $scope.data.thread && $scope.data.thread.Items)
				yammerData.startPolling();
		});

		$scope.$watchCollection('[data.isRefreshing, data.isUpdating]', function () {
			if (!$scope.isSingleThread && $scope.data.thread && $scope.data.thread.Items && !$scope.data.isRefreshing && !$scope.data.isUpdating)
				yammerData.setLastSeenMessage();
		});

		$scope.openNewPost = function() {
			$scope.newPostOpen = true;
			$timeout(function () {
				$(".postThread").scrollintoview({ duration: "normal" });
			}, 1);
		};

		$scope.search = function (event) {
			if (event.keyCode == 13 && event.currentTarget.value.length > 0)
				window.open("https://www.yammer.com/#/Threads/Search?type=following&search=" + event.currentTarget.value);
		};

		$scope.closeNewPost = function() {
			$scope.newPostOpen = false;
		};






		$scope.accentColors = ['#A4C400', '#60A917', '#008A00', '#00ABA9', '#1BA1E2',
							'#0050EF', '#6A00FF', '#AA00FF', '#F472D0', '#D80073',
							'#A20025', '#E51400', '#FA6800', '#F0A30A', '#E30800',
							'#825A2C', '#6D8764', '#647687', '#76608A', '#87794E'];
		$scope.accentColorsFileNames = ['lime', 'green', 'emerald', 'teal', 'cyan',
										'cobalt', 'indigo', 'violet', 'pink', 'magenta',
										'crimson', 'red', 'orange', 'amber', 'yellow',
										'brown', 'olive', 'steel', 'mauve', 'taupe'];

		$scope.settings = { accentColor: '#0050EF', theme: 1 };

		$scope.setAccentColor = function (color) {
			$scope.settings.accentColor = color;
			$scope.applyAndSaveThemeSettings();
		};

		$scope.$watch('settings.theme', function (newValue, oldValue) {
			if (newValue != oldValue)
				$scope.applyAndSaveThemeSettings();
		});

		$scope.applyAndSaveThemeSettings = function () {
			var cssFileName = $scope.settings.theme == 1 ? 'light/' : 'dark/';
			var index = $.inArray($scope.settings.accentColor, $scope.accentColors);
			cssFileName += $scope.accentColorsFileNames[index];

			$('.themeStyleSheet').remove();
			$('head').append('<link id="themeStyleSheet" rel="stylesheet" type="text/css" href="' + window.location.origin + '/stylesheets/yammer/' + cssFileName + '.css">');

			$.cookie("settings", angular.toJson($scope.settings), { expires: 365, path: '/' });
		};

		$(document).ready(function () {
			var savedSettings = angular.fromJson($.cookie('settings'));
			if (savedSettings && savedSettings.theme)
				$scope.settings = savedSettings;

			$scope.applyAndSaveThemeSettings();
		});
}]);
