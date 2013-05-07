PulseApp.controller('ChatCtrl', ['$scope', '$rootScope', '$chatService', function($scope, $rootScope, $chatService){
	$rootScope.activeView='Chat';

	$scope.chatMessages = $chatService.chatMessages;

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
		if(newVal)
			window.localStorage.setItem('pulseUsername', newVal);
	});
}]);