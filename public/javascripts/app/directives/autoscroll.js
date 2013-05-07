PulseApp.directive('autoscroll', [function(){
	return {
		link: function(scope, elm, attrs){
			elm[0].scrollTop=elm[0].scrollHeight;
			
			scope.$watch(attrs.watchItem, function(){
				elm[0].scrollTop=elm[0].scrollHeight;
			}, true);
		}
	};	
}]);