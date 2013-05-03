var io = require('socket.io').listen(3001);

var sockets = [];

io.sockets.on('connection', function(socket){
	console.log('Client connected');
	sockets.push(socket);

	socket.on('end', function() {
		console.log('Socket closed');
	    var i = sockets.indexOf(socket);
	    global_sockets_list.splice(i, 1);
	    socket.close();
	});
});

var messages = [];


exports.list = function(req, res){
  
  res.send(messages);
};

exports.add = function(req, res){
	var message = req.body;
	if(message.text){
		message.time = new Date();
		messages.unshift(message);
	}
	setTimeout(function(){
		sockets.forEach(function(socket){
			socket.emit('new', messages);
		});
	});
	res.send();
};