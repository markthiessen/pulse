PulseApp.filter('jsonDate', function ($filter) {
	return function (input, format) {
		return $filter('date')(parseInt(input), format);
	};
});