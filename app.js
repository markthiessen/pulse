var express = require('express'),
	settings = require('./settings'),
	http = require('http'),
	path = require('path'),
	SocketHandler = require('./server/socket-handler'),
	routeConfig = require('./server/route-config');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/client/images/favicon.ico'));

//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

// load liveReload script only in development mode
// load before app.router
app.configure('development', function() {
  // live reload script
  var liveReloadPort = settings.liveReload.port || 35729;
  var excludeList = ['.woff', '.flv'];
  
  app.use(require('connect-livereload')({
    port: liveReloadPort,
    excludeList: excludeList
  }));
});

app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/client' }));
app.use(express.static(path.join(__dirname, 'client')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routeConfig.configureRoutes(app);

var server = http.createServer(app).listen(app.get('port'), function(){
  //console.log('Express server listening on port ' + app.get('port'));
});

var socketHandler = new SocketHandler(server);




