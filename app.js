var express = require('express'),
	settings = require('./settings'),
  passport = require('passport'),
  wsfedsaml2 = require('passport-azure-ad').WsfedStrategy,
	http = require('http'),
	path = require('path'),
	SocketHandler = require('./server/socket-handler'),
  messages = require('./server/routes/messages'),
  chat = require('./server/routes/chat'),
  pages = require('./server/routes/pages');

var app = express();

// configure express
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: settings.session.secret }));
app.use(passport.initialize());
app.use(passport.session());

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/client/images/favicon.ico'));

//app.use(express.logger('dev'));
app.use(express.methodOverride());

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
app.use(require('less-middleware')(__dirname + '/client'));
app.use(express.static(path.join(__dirname, 'client')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var authConfig = {
    realm: settings.session.realm,
    identityProviderUrl: settings.session.identityProviderUrl,
    identityMetadata: settings.session.identityMetadata,
    logoutUrl: settings.session.logoutUrl
};

var profiles = [];

var wsfedStrategy = new wsfedsaml2(authConfig, function(profile, done) {
    profiles.push(profile);
    console.log(profile);
    if (!profile.email) {
        done(new Error("No email found"));
        return;
    }
    // validate the user here
    done(null, profile);
});
passport.use(wsfedStrategy);


// implement your user session strategy here
passport.serializeUser(function(user,cb){ 
  cb(null, user.id);
});
passport.deserializeUser(function(userid,cb){
  cb(null, findProfileById(userid));
});

function findProfileById(id){
  for(var i=0; i<profiles.length; i++){
    var profile = profiles[i];
    if(profile.id==id)
      return profile;
  }
  return null;
}

// send the user to WAAD to authenticate    
app.get('/authenticate', 
  passport.authenticate('wsfed-saml2', { failureRedirect: '/', failureFlash: true }), function(req, res) {
    res.redirect('/');
});

// callback from WAAD with a token
app.post('/authenticate', passport.authenticate('wsfed-saml2', { failureRedirect: '/', failureFlash: true }), function(req, res) {
    res.redirect('/');
});

app.get('/', ensureAuthenticated, pages.index);
app.get('/messages', ensureAuthenticated, messages.list);
app.post('/messages', ensureAuthenticated, messages.add);
app.get('/chat', ensureAuthenticated, chat.list);
app.post('/chat', ensureAuthenticated, chat.add);

var server = http.createServer(app).listen(app.get('port'), function(){
  //console.log('Express server listening on port ' + app.get('port'));
});

var socketHandler = new SocketHandler(server);

function ensureAuthenticated(req, res, next){
  if(!settings.session.useAzureAuth || sessionPresent(req)){
    return next();
  } 
  else{
    return res.redirect('/authenticate');
  }
}

function sessionPresent(req){
  return req.user;
}




