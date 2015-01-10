var PulseApp = angular.module('PulseApp', ['ngRoute', 'ngResource', 'ngSanitize', 'ngCookies'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/javascripts/app/views/index.html',
			controller: 'IndexCtrl'
		})
		.when('/chat', {
			templateUrl: '/javascripts/app/views/chat.html',
			controller: 'ChatCtrl'
		})
		.when('/admin', {
			templateUrl: '/javascripts/app/views/admin.html',
			controller: 'AdminCtrl'
		})
		.when('/yammer', {
			templateUrl: '/javascripts/app/views/yammer.html',
			controller: 'YammerCtrl'
		})
		.otherwise({
			redirectTo:'/'
		});
}])
.run(['$rootScope', '$resource', function($rootScope, $resource){

	$rootScope.user = {
		'name': window.localStorage.getItem('pulseUsername') || actualUserName,
		'icon': window.localStorage.getItem('pulseIcon') || 0
	};
	
	$rootScope.activeView='';

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
