PulseApp.directive('autocolor', ['$colorHash', function($colorHash){

	return {
		link: function(scope, elm, attrs){
			function updateColor(){
				var color = $colorHash.getColor(scope.$eval(attrs.autocolor));
				elm.css({'background-color': color, 'color':'white'});
				elm.children('.aftercontent').css({'border-color': 'transparent '+color});
			}
			updateColor();
			scope.$watch(attrs.autocolor, updateColor)
		}
	};

}]);