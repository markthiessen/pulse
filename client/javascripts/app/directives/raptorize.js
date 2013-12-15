PulseApp.directive('raptorize', [function(){
	return {
		restrict: 'A',
		link: function(scope, elm, attrs){

			var options = undefined;

			if (attrs.raptorize && attrs.raptorize.length > 0) {
				options = JSON.parse(attrs.raptorize);
			}

			elm.raptorize(options);
		}
	};
}]);
