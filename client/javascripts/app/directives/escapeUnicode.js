PulseApp.directive('escapeUnicode', ['$unicode', function($unicode){
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ngModel) {
			if(!ngModel) return;
 
			ngModel.$parsers.push($unicode.replace);
			ngModel.$formatters.push($unicode.escape);
		}
	};
}]);

