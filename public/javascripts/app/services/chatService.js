PulseApp.factory('$chatService', ['$socket', '$resource', '$rootScope', 
	function($socket, $resource, $rootScope){
	
	var restService = $resource('/chat/:id', {},{
			method: 'GET',
			cache:false
		});

	var chatService = {
		chatMessages: [],
		ChatMessage: restService
	};

	restService.query({ver:new Date().getMilliseconds()},function(results){
		results.forEach(function(item){
			chatService.chatMessages.push(item);
		})		
	});

	$socket.on('newchatmessage', function(message){
 		chatService.chatMessages.push(message);
		 $rootScope.$apply();
	 });

	return chatService;
}]);