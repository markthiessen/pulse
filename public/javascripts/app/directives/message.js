PulseApp.directive('message', [function(){

	return {
		restrict: 'E',
		replace: true,
		template: '<div></div>',
		transclude: false,
		link: function(scope, elm, attrs){
			var text = scope.$eval(attrs.text);
			var matches = text.match(/(https?:\/\/\S*\.(?:png|jpg|gif))/i);
			var newString = [];
			if(matches)
				matches.forEach(function(match){
					var index = text.indexOf(match);
					if(index>=0){
						newString.push(text.substr(0, index));

						newString.push(
							angular.element('<a>').attr({'href':match,'target':'_blank'})
								.html(
									angular.element('<img class="img-polaroid">').attr('src', match)
								)
						);


						text = text.substr(index+match.length);
					}
				});

			newString.push(text);			

			newString.forEach(function(item){
				if(typeof(item)=='string')
					elm.append(angular.element('<span>').text(item));
				else
					elm.append(item);
			})
		}
	};

}]);