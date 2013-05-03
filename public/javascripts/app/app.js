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
}]);