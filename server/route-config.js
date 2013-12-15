var messages = require('./routes/messages'),
 chat = require('./routes/chat'),
 pages = require('./routes/pages');

exports.configureRoutes = function(app){

	app.get('/', pages.index);
	app.get('/messages', messages.list);
	app.post('/messages', messages.add);

	app.get('/chat', chat.list);
	app.post('/chat', chat.add);

};