PulseApp.controller('ChatCtrl', ['$scope', '$rootScope', '$chatService', '$pageInfoService', '$sce',
	function($scope, $rootScope, $chatService, $pageInfoService, $sce){
		$rootScope.activeView='Chat';

		$scope.chatMessages = $chatService.chatMessages;
		$scope.users = $chatService.users;
		$scope.audioSrc = '';

		$scope.user = $rootScope.user;
		
		$scope.message = '';
		$scope.addMessage = function(){
			if($scope.message){
				var message = new $chatService.ChatMessage();
				message.text = unicode_replace($scope.message);
				message.user = $scope.user;
				message.$save();
				$scope.message='';
			}
		};
		
		$scope.$watch('user', function(newVal){
			if(newVal){
				window.localStorage.setItem('pulseUsername', newVal);
				$rootScope.user = newVal;			
			}
			$chatService.updateName(newVal || 'no_name');
		}, true);
		
		$scope.$watch('chatMessages', function(newVal){
			if(newVal.length>0) {
				$pageInfoService.enableNewMessageNotification();
				$scope.audioSrc = $sce.trustAsResourceUrl(newVal[newVal.length-1].audio);
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

		var unicode_replace = function(str){
			var unicode = /\\u[0-9][0-9][0-9][0-9]/g;

			str = str.replace(unicode, function(code){
				return String.fromCharCode(parseInt(code.substring(2), 16));
			});

			return str;
		};
}]);
