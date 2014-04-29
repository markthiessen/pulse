PulseApp.controller('ChatCtrl', 
	['$scope', '$rootScope', '$chatUserNotifications', '$chatService', '$timeout',
	function ($scope, $rootScope, $chatUserNotifications, $chatService, $timeout) {
		$rootScope.activeView='Chat';

		$scope.chatMessages = $chatService.chatMessages;
		$scope.users = $chatService.users;

		$scope.user = $rootScope.user;

		$scope.message = '';
		$scope.addMessage = function(){
			if($scope.message){
				var message = new $chatService.ChatMessage();
				message.text = $scope.message;
				message.user = $rootScope.user;
				message.$save();
				$scope.message='';
			}
		};

		var usernameChangeTimeout;
		var nameChangeFrames = [];
		$scope.$watch('user', function(newVal, oldVal){

			if(!nameChangeFrames.length)
				nameChangeFrames.push(oldVal.name);

			nameChangeFrames.push(newVal.name);

			if(newVal){
				window.localStorage.setItem('pulseUsername', newVal.name);
				window.localStorage.setItem('pulseIcon', newVal.icon);
				$rootScope.user = newVal;
			}

			$timeout.cancel(usernameChangeTimeout);
			usernameChangeTimeout = $timeout(function(){
				var newUser = { 
					'name': newVal.name || 'no_name',
					'icon': newVal.icon || 0
				}
				$chatService.updateUser(newUser, nameChangeFrames);

				nameChangeFrames = [];
			}, 1500);
		}, true);



		var lastTypingNotification = moment().subtract('s', 3);
		$scope.notifyTyping = function(){
			var threeSecondsAgo = moment().subtract('s', 3);
			if(threeSecondsAgo>lastTypingNotification){
				lastTypingNotification=moment();
				$chatService.sendTypingNotification();
			}
		}

		$scope.nextIcon = function(){
			//force integer rollover because Javascript doesn't do it for us
			if ($scope.user.icon === Number.MAX_VALUE)
				$scope.user.icon = 0;
			else
				$scope.user.icon++;
		};

		$scope.clearNotifications = function(){
			$chatUserNotifications.clearNotifications();
		}

		$scope.likeMessage = function(id){
			$chatService.likeMessage(id);
		};

		$scope.deleteMessage = function(id){
			$chatService.deleteMessage(id);
		}

		$scope.isMyMessage = function(message){
			return message.user == $scope.user.name;
		}
}]);
