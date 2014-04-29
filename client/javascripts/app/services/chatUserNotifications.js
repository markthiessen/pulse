PulseApp.factory('$chatUserNotifications', ['$rootScope', '$chatService', '$pageInfoService', '$sce',
	function ($rootScope, $chatService, $pageInfoService, $sce) {

		var chatUserNotifications = {};

		chatUserNotifications.clearNotifications = function () {
			$pageInfoService.disableNewMessageNotification();
			$rootScope.chatHasNewMsg = false;
		};

		$rootScope.audioSrc = '';
		$rootScope.chatMessages = $chatService.chatMessages;

		$rootScope.$watch('chatMessages', function (newVal) {
			if (newVal.length) {
				var newMessage = newVal[newVal.length - 1];
				if (!newMessage.isSystemMessage) {
					$pageInfoService.enableNewMessageNotification();
					$rootScope.chatHasNewMsg = true;
					$rootScope.audioSrc = $sce.trustAsResourceUrl(newMessage.audio);

					if (newMessage.text.toLowerCase().indexOf('@' + $rootScope.user.name.toLowerCase()) >= 0)
						notify(newMessage.text);
				}
			}
		}, true);

		function notify(message) {
			if (window.webkitNotifications) {
				if (window.webkitNotifications.checkPermission() > 0) {
					RequestPermission(notify);
				} else {
					var notification = window.webkitNotifications.createNotification('/images/icon.png', message, '');
					notification.show();
				}
			}
		}

		return chatUserNotifications;
	}]);
