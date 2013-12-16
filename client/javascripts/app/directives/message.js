PulseApp.directive('message', ['$emojify', '$modalService', function($emojify, $modalService){

	return {
		restrict: 'E',
		replace: true,
		template: '<div class="chat-message"></div>',
		scope: {
			message: '='
		},
		transclude: false,
		link: function(scope, elm, attrs){

			var text = scope.message.text;
			var message = scope.message;
			if(message.isSystemMessage){
				var systemMessagePrefix = '## ';
				if(message.type=='connect')
				{
					var name = angular.element('<strong>').text(message.username);
					elm.append(systemMessagePrefix);
					elm.append(name);
					elm.append(' has connected to the chat.');
				}
				else if(message.type=='disconnect'){
					var name = angular.element('<strong>').text(message.username);
					elm.append(systemMessagePrefix);
					elm.append(name);
					elm.append(' has left the chat.');	
				}
				else if(message.type=='namechange'){
					var oldName = angular.element('<strong>').text(message.oldName);
					var newName = angular.element('<strong>').text(message.newName);
					elm.append(systemMessagePrefix)
					elm.append(oldName).append(' has updated their name to ').append(newName);
				}
				elm.parent().addClass('system');
			}
			else{

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

				var imageMatches = text.match(/(https?:\/\/\S*\.(?:png|jpg|gif))/gi);
				if(imageMatches)
					replaceMatchesWithAnchors(imageMatches, true);
				else{
					var urlMatches= text.match(/(https?:\/\/\S*)/gi);
					if(urlMatches)
						replaceMatchesWithAnchors(urlMatches, false);
				}

				newString.push(text);			

				newString.forEach(function(item){
					if(typeof(item)=='string'){
						var span = angular.element('<span>').text(item);
						$emojify.run(span[0]);
						elm.append(span);
					}
					else
						elm.append(item);
				});
			}

		}
	};

}]);