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


	return chatService;
}]);