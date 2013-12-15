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
		likeMessage: function(id){
			$socket.emit('likeMessage', {id: id});
		},
		deleteMessage: function(id){
			$socket.emit('deleteMessage', {id: id});
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

	function findMessageById(id){
		var messages = chatService.chatMessages;
		for(var i=0; i<messages.length;i++){
			var message = messages[i];
			if(message.id==id)
				return message;
		}
	}
	function findMessageIndex(id){
		var messages = chatService.chatMessages;
		for(var i=0; i<messages.length;i++){
			var message = messages[i];
			if(message.id==id)
				return i;
		}
		return -1;
	}

	$socket.on('updateMessageLikes', function(data){
		var message = findMessageById(data.id);
		if(message){
			message.likes = data.likes;
			$rootScope.$apply();
		}
	});

	$socket.on('removeMessage', function(data){
		var index = findMessageIndex(data.id);
		if(index > -1){
			chatService.chatMessages.splice(index,1);
			$rootScope.$apply();
		}
	});


	return chatService;
}]);
