PulseApp.factory('$chatService', ['$socket', '$resource', '$rootScope', 
	function($socket, $resource, $rootScope){
	
	var restService = $resource('/chat/:id', {},{
			method: 'GET',
			cache:false
		});

	var chatService = {
		chatMessages: [],
		ChatMessage: restService,
		updateName: function(name){
			$socket.emit('updatename', {username: name});
		},
		sendTypingNotification: function(){
			$socket.emit('typing', {username: name});
		},
		users: []
	};

	restService.query({ver:new Date().getMilliseconds()},function(results){
		results.forEach(function(item){
			chatService.chatMessages.push(item);
		})		
	});

	$socket.on('connect', function(){
		chatService.updateName($rootScope.user);
	});

	$socket.on('newchatmessage', function(message){
 		chatService.chatMessages.push(message);
		$rootScope.$apply();
	 });

	$socket.on('users', function(data){
		chatService.users.length=0;
		data.forEach(function(user){
			chatService.users.push(user);
		});
		$rootScope.$apply();
	});

	$socket.on('usertyping', function(data){
		var id = data.id;
		chatService.users.forEach(function(user){
			if(user.id==id)
				user.lastTyped=moment();
		});
	});


	return chatService;
}]);