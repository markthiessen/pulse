PulseApp.controller('YammerCtrl', 
	['$scope', '$rootScope', '$timeout', 'yammerData',
	function($scope, $rootScope, $timeout, yammerData){
		$rootScope.activeView = 'Yammer';

		$scope.data = yammerData;
		$scope.threadId = -1; //TODO
		$scope.isSingleThread = $scope.threadId > 0;

		$scope.$watch('data.isAuthenticated', function () {
			if ($scope.data.isAuthenticated === true && !$scope.data.isRefreshing && !$scope.data.isUpdating && !$scope.data.thread.Items) {
				if ($scope.isSingleThread)
					yammerData.refreshThread($scope.threadId);
				else {
					yammerData.refreshFeed();
					yammerData.getAvalibleNetworks();
				}
				yammerData.updateNotifications();
			}
		});
		
		$scope.$watch('data.thread', function () {
			if (!$scope.isSingleThread && $scope.data.thread && $scope.data.thread.Items && !$scope.data.isPolling)
				yammerData.startPolling();
		});

		$scope.$watchCollection('[data.isRefreshing, data.isUpdating]', function () {
			if (!$scope.isSingleThread && $scope.data.thread && $scope.data.thread.Items && !$scope.data.isRefreshing && !$scope.data.isUpdating)
				yammerData.setLastSeenMessage();
		});

		$scope.$watch('data.currentNetworkToken', function (newValue, oldValue) {
			if (oldValue && newValue) {
				$scope.data.setCurrentNetwork($scope.data.currentNetworkToken);
			}
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
}]);
