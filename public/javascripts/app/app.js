var PulseApp = angular.module('PulseApp', [])
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
.run(['$rootScope', function($rootScope){
	

}]);