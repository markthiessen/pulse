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
		if(window.webkitNotifications){
			if(window.webkitNotifications.checkPermission() > 0)
				$rootScope.needsAlertPermissions = true;
		}
		else{
			$rootScope.needsAlertPermissions = false;
		}
	}
	updatePermissions();

	$rootScope.enableNotifications = function(){
		window.webkitNotifications.requestPermission(updatePermissions);
	}
}]);