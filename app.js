
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

var sockets = [];
io.sockets.on('connection', function(socket){
	sockets.push(socket);
	socket.username = 'anony-mouse_'+sockets.length;

	socket.on('disconnect', function() {
	    var i = sockets.indexOf(socket);
	    sockets.splice(i, 1);
	    setTimeout(broadcastUsers, 10);	
	});

	socket.on('updatename', function(data){
		socket.username = data.username;	
		setTimeout(broadcastUsers, 10);	
	});
});

function broadcastUsers(){	
	var users = sockets.map(function(socket){
		return socket.username;
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


