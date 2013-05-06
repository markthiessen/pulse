PulseApp.directive('autoscroll', [function(){
	return {
		link: function(scope, elm, attrs){
			
			scope.$watch(attrs.watchItem, function(){
				elm[0].scrollTop=elm[0].scrollHeight;
			}, true);
		}
	};	
}]);