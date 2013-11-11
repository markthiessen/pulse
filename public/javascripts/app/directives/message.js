PulseApp.directive('message', ['$emojify', '$modalService', function($emojify, $modalService){

	return {
		restrict: 'E',
		replace: true,
		template: '<div class="chat-message"></div>',
		transclude: false,
		link: function(scope, elm, attrs){
			var text = scope.$eval(attrs.text);
			var imageMatches = text.match(/(https?:\/\/\S*\.(?:png|jpg|gif))/gi);
			var newString = [];

			function replaceMatchesWithAnchors(matches, images){
				matches.forEach(function(match){
					var index = text.indexOf(match);
					if(index>=0){
						newString.push(text.substr(0, index));
						if(images){
							newString.push(
								angular.element('<a>').attr({'href':'#'})
									.html(
										angular.element('<img class="img-polaroid">').attr('src', match).attr('onerror', 'this.src="/images/notfound.jpg"')
									).click(function(e){
										e.preventDefault();
										$modalService.showInModal(angular.element(this).children()[0], match);
									})
							);
						}
						else{
							newString.push(
								angular.element('<a>').attr({'href':match,'target':'_blank'}).text(match)
							);
						}
						text = text.substr(index+match.length);
					}
				});
			}

			if(imageMatches)
				replaceMatchesWithAnchors(imageMatches, true);
			else{
				var urlMatches= text.match(/(https?:\/\/\S*)/gi);
				if(urlMatches)
					replaceMatchesWithAnchors(urlMatches, false);
			}

			newString.push(text);			

			newString.forEach(function(item){
				if(typeof(item)=='string')
					elm.append(angular.element('<span>').text(item));
				else
					elm.append(item);
			});

			$emojify.run(elm[0]);

		}
	};

}]);