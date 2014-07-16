(function(){

function MessageProcessor($emojify) {

  function isImageLink(link) {
    var imageRegEx = /(https?:\/\/\S*\.(?:png|jpg|gif))/gi;
    var matches = link.match(imageRegEx)
    return matches !== null && matches.length > 0;
  }

  function imageLinkToElm(link) {
    return angular.element('<a>').attr({'href':'#'})
            .html(
              angular.element('<img class="img-polaroid">').attr('src', link).attr('onerror', "this.src='/images/notfound.jpg'")
            ).click(function(e){
              e.preventDefault();
              $modalService.showInModal(angular.element(this).children()[0], link);
            });
  }

  function linkToElm(link) {
    return angular.element('<a>').attr({'href':link,'target':'_blank'}).text(link);
  }

  function processStrings(elems, func) {
      var newElems = [];

      elems.forEach(function(item){
        if(typeof(item)=='string'){
          if(item !== ''){
            newElems = newElems.concat(func(item));
          }
        } else {
          newElems.push(item);
        }
      });

      return newElems;
  }

  return {
    replaceLinks : function (elems){
      return processStrings(elems, function(str){
        var newElems = [];

        var urlMatches= str.match(/(https?:\/\/\S*)/gi);
        if (urlMatches) {
          urlMatches.forEach(function(match){
            var index = str.indexOf(match);
            if(index >=0){
              var elm = null;
              if (isImageLink(match)) {
                elm = imageLinkToElm(match);
              } else {
                elm = linkToElm(match);
              }
              newElems.push(str.substr(0, index));
              newElems.push(elm);

              str = str.substr(index+match.length);
            }
          });
        }

        newElems.push(str);

        return newElems;
      });
    },
    replaceEmoji : function (elems){
      return processStrings(elems, function(str){
        var span = angular.element('<span>').text(str);
        $emojify.run(span[0]);

        return [span];
      });
    }
  };
};

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
        var messageProcessor = new MessageProcessor($emojify);

        var elems = messageProcessor.replaceLinks([message.text]);
        elems =  messageProcessor.replaceEmoji(elems);

        elems.forEach(function(item){
          elm.append(item);
        });
			}

		}
	};

}]);
})();
