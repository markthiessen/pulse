PulseApp.controller('ChatCtrl', ['$scope', '$rootScope', '$chatService', function($scope, $rootScope, $chatService){
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
}]);