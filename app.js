
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , messages = require('./routes/messages')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
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

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//notifications
var io = require('socket.io').listen(server);

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

messages.setNotifyCallback(notifyAllClients);
function notifyAllClients(message){
	sockets.forEach(function(socket){
		socket.emit('new', message);
	});
}
