PulseApp.controller('ChatCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
	$rootScope.activeView='Chat';

	$scope.messages = [];

	$scope.message = '';
	$scope.addMessage = function(){
		if($scope.message){
			$scope.messages.push({text: $scope.message, time: new Date()});
			$scope.message = '';
		}
	};
}]);