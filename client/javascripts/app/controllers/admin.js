PulseApp.controller('AdminCtrl', ['$scope', '$chatService', function($scope, $chatService){
	$rootScope.activeView='Admin';

	$scope.users = $chatService.users;
	$scope.selectedUser = null;

	$scope.$watch('users', function(newVal, oldVal){
		if (newVal){
			$scope.selectedUser = newVal[0];
		}
	}, true);
}]);
