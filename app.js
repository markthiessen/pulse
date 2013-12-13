
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , messages = require('./routes/messages')
  , chat = require('./routes/chat')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/messages', messages.list);
app.post('/messages', messages.add);

app.get('/chat', chat.list);
app.post('/chat', chat.add);

var server = http.createServer(app).listen(app.get('port'), function(){
  //console.log('Express server listening on port ' + app.get('port'));
});


//notifications
var io = require('socket.io').listen(server, { log: false });

var socketCounter = 0;
function getNextSocketId(){
	socketCounter++;
	if(socketCounter>=10000)
		socketCounter=1;
	return socketCounter;
}


var sockets = [];
io.sockets.on('connection', function(socket){
	sockets.push(socket);
	socket.username = 'anony-mouse_'+sockets.length;
	socket.sockid = getNextSocketId();

	socket.on('disconnect', function() {
	    var i = sockets.indexOf(socket);
	    sockets.splice(i, 1);
	    setTimeout(broadcastUsers, 10);	
	});

	socket.on('updatename', function(data){
		socket.username = data.username;	
		setTimeout(broadcastUsers, 10);	
	});

	socket.on('typing', function(){
		io.sockets.emit('usertyping', {id: socket.sockid});
	});

	socket.on('likeMessage', function(data){
		var message = chat.likeMessage(data.id);
		console.log(message);
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


