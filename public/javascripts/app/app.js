var PulseApp = angular.module('PulseApp', ['ngResource'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/javascripts/app/views/index.html',
			controller: 'IndexCtrl'
		})
		.otherwise({
			redirectTo:'/'
		});
}])
.run(['$rootScope', '$resource', function($rootScope, $resource){
	$rootScope.Messages = $resource('/messages/:id', {}, {
		method: 'GET',
		cache:false
	});


	$rootScope.needsAlertPermissions;
	function updatePermissions(){
		$rootScope.needsAlertPermissions = window.webkitNotifications && (window.webkitNotifications.checkPermission() > 0);
	}
	updatePermissions();

	$rootScope.enableNotifications = function(){
		window.webkitNotifications.requestPermission(updatePermissions);
		updatePermissions();
	}
}]);