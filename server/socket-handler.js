
//notifications

var socketCounter = 0;
function getNextSocketId(){
	socketCounter++;
	if(socketCounter>=10000)
		socketCounter=1;
	return socketCounter;
}

module.exports = function SocketHandler(server){

	var io = require('socket.io').listen(server, { log: false }),
	messages = require('./routes/messages'),
	chat = require('./routes/chat');

	var sockets = [];
	io.sockets.on('connection', function(socket){
		sockets.push(socket);
		socket.username = '';
		socket.sockid = getNextSocketId();

		socket.on('disconnect', function() {
			var i = sockets.indexOf(socket);
			sockets.splice(i, 1);
			process.nextTick(broadcastUsers);
			io.sockets.emit('newsystemmessage', chat.createSystemDisconnectMessage(socket.username));
		});

		socket.on('updatename', function(data){
			var oldname = socket.username;
			socket.username = data.username;

			if(oldname!=data.username)
			{	
				if(oldname)
				{
					io.sockets.emit('newsystemmessage', 
						chat.createSystemNameChangeMessage(oldname, data.username	, data.frames));
				}
				else{
					io.sockets.emit('newsystemmessage', chat.createSystemConnectMessage(socket.username));
				}

				process.nextTick(broadcastUsers);
			}
		});

		socket.on('typing', function(){
			io.sockets.emit('usertyping', {id: socket.sockid});
		});

		socket.on('likeMessage', function(data){
			var message = chat.likeMessage(data.id);
			if(message)
				io.sockets.emit('updateMessageLikes', {id: message.id, likes: message.likes});
		});

		socket.on('deleteMessage', function(data){
			var messageFound = chat.deleteMessage(data.id);
			if(messageFound)
				io.sockets.emit('removeMessage', {id: data.id});
		});
	});

	function broadcastUsers(){
		var users = sockets.map(function(socket){
			return {name: socket.username, id: socket.sockid};
		});
		io.sockets.emit('users', users);
	}

	messages.setNotifyCallback(
		function(message){
			io.sockets.emit('new', message);
		}
	);


	chat.setNotifyCallback(
		function notifyAllChatClients(message){
			io.sockets.emit('newchatmessage', message);
		}
	);
};
