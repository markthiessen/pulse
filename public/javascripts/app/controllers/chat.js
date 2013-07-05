PulseApp.controller('ChatCtrl', ['$scope', '$rootScope', '$chatService', '$pageInfoService', function($scope, $rootScope, $chatService, $pageInfoService){
	$rootScope.activeView='Chat';

	$scope.chatMessages = $chatService.chatMessages;
	$scope.users = $chatService.users;

	$scope.user = $rootScope.user;
	
	$scope.autoScroll=true;

	$scope.message = '';
	$scope.addMessage = function(){
		if($scope.message){
			var message = new $chatService.ChatMessage();
			message.text = $scope.message;
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
		if(newVal.length>0)
			$pageInfoService.enableNewMessageNotification();
	}, true);

	var lastTypingNotification = moment().subtract('s', 3);
	$scope.notifyTyping = function(){
		var threeSecondsAgo = moment().subtract('s', 3);
		if(threeSecondsAgo>lastTypingNotification){
			lastTypingNotification=moment();
			$chatService.sendTypingNotification();
			console.log('changed');
		}
	}

	$scope.clearNotifications = function(){
		$pageInfoService.disableNewMessageNotification();
	}
}]);