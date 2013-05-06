PulseApp.controller('ChatCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
	$rootScope.activeView='Chat';


	$scope.message = '';
	$scope.user = 'anony-mouse';
	$scope.addMessage = function(){
		if($scope.message){
			var message = new $rootScope.ChatMessage();
			message.text = $scope.message;
			message.user = $scope.user;
			message.$save();
			$scope.message='';
		}
	};

	

}]);