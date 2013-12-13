PulseApp.controller('ChatCtrl', ['$scope', '$rootScope', '$chatService', '$pageInfoService', '$unicode', '$sce',
	function($scope, $rootScope, $chatService, $pageInfoService, $unicode, $sce){
		$rootScope.activeView='Chat';

		$scope.chatMessages = $chatService.chatMessages;
		$scope.users = $chatService.users;
		$scope.audioSrc = '';

		$scope.user = $unicode.escape($rootScope.user);

		$scope.message = '';
		$scope.addMessage = function(){
			if($scope.message){
				var message = new $chatService.ChatMessage();
				message.text = $unicode.replace($scope.message);
				message.user = $rootScope.user;
				message.$save();
				$scope.message='';
			}
		};

		$scope.$watch('user', function(newVal){
			if(newVal){
				window.localStorage.setItem('pulseUsername', $unicode.replace(newVal));
				$rootScope.user = $unicode.replace(newVal);
			}
			$chatService.updateName($unicode.replace(newVal) || 'no_name');
		}, true);

		$scope.$watch('chatMessages', function(newVal){
			if(newVal.length) {
				$pageInfoService.enableNewMessageNotification();
				var newMessage = newVal[newVal.length-1];
				$scope.audioSrc = $sce.trustAsResourceUrl(newMessage.audio);

				if(newMessage.text.toLowerCase().indexOf('@'+$rootScope.user.toLowerCase())>=0)
					notify(newMessage.text);
			}
		}, true);

		var lastTypingNotification = moment().subtract('s', 3);
		$scope.notifyTyping = function(){
			var threeSecondsAgo = moment().subtract('s', 3);
			if(threeSecondsAgo>lastTypingNotification){
				lastTypingNotification=moment();
				$chatService.sendTypingNotification();
			}
		}

		$scope.clearNotifications = function(){
			$pageInfoService.disableNewMessageNotification();
		}

		$scope.likeMessage = function(id){
			$chatService.likeMessage(id);
		};

		function notify(message) {
			if(window.webkitNotifications){
				if (window.webkitNotifications.checkPermission() > 0) {
					RequestPermission(notify);
				} else {
					var notification = window.webkitNotifications.createNotification('/images/icon.png', message, '');
					notification.show();
				}
			}
		}

}]);
