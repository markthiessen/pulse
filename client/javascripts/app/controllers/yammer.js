PulseApp.controller('YammerCtrl', 
	['$scope', '$rootScope', '$timeout', '$location', 'yammerData',
	function($scope, $rootScope, $timeout, $location, yammerData){
		$rootScope.activeView = 'Yammer';
		$scope.data = yammerData;

		$scope.$watch('data.isAuthenticated', function () {
			if ($scope.data.isAuthenticated === true && !$scope.data.isRefreshing && !$scope.data.isUpdating && !$scope.data.thread.Items) {
				if ($scope.getIsSingleThread())
					yammerData.refreshThread($scope.getSinglePostThreadId());
				else {
					yammerData.getAvalibleNetworks();
					yammerData.refreshFeed();
				}
				yammerData.updateNotifications();
			}
		});
		
		$scope.$watch('data.thread', function () {
			if (!$scope.getIsSingleThread() && $scope.data.thread && $scope.data.thread.Items && !$scope.data.isPolling)
				yammerData.startPolling();
		});

		$scope.$watchCollection('[data.isRefreshing, data.isUpdating]', function () {
			if (!$scope.getIsSingleThread() && $scope.data.thread && $scope.data.thread.Items && !$scope.data.isRefreshing && !$scope.data.isUpdating)
				yammerData.setLastSeenMessage();
		});

		$scope.$watch('data.currentNetworkToken', function (newValue, oldValue) {
			if (oldValue && newValue) {
				$scope.data.setCurrentNetwork($scope.data.currentNetworkToken);

				if ($scope.getIsSingleThread())
					yammerData.refreshThread($scope.getSinglePostThreadId());
				else
					yammerData.refreshFeed();
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

		$scope.getIsSingleThread = function() {
			return $scope.isSingleThread = $scope.getSinglePostThreadId() ? true : false;
		};

		$scope.getSinglePostThreadId = function() {
			return $location.search().threadId;
		};
		
		$scope.showAllPosts = function () {
			$scope.data.thread.Items = null;
			$location.search('threadId', null);
		};
}]);
