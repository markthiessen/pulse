PulseApp.controller('AdminCtrl', ['$scope', '$rootScope', '$chatService', function($scope, $rootScope, $chatService){
	$rootScope.activeView='Admin';

	$scope.users = $chatService.users;
	$scope.selectedUser = null;

	$scope.$watch('users', function(newVal, oldVal){
		if (newVal){
			$scope.selectedUser = newVal[0];
		}
	}, true);
}]);
