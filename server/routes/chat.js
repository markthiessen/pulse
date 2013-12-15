var crypto = require('crypto'),
	http = require('http'),
	settings = require('../../settings');

var messages = [], users = [];

var messageCounter = 0;

var notifyCallback=function(){};
exports.setNotifyCallback = function(callback){
	notifyCallback=callback;
};

exports.list = function(req, res){
  res.send(messages);
};

exports.add = function(req, res){
	var message = req.body;
	if(message.text){
		message.time = new Date();
		message.id = messageCounter++;
		message.likes = 0;
		message.audio = '';

		if(messageCounter>1000)
			messageCounter=0;

		var publish = function(m) {
			messages.push(m);

			setTimeout(function(){
				purgeOldMessages();
				notifyCallback(m);

			}, 10);
		};

		if(message.text.indexOf('\u0007') > -1) {
			broadcast(message, publish);
		} else {
			publish(message);
		}
	}
	res.send();
};

exports.createSystemMessage = function(text){
	var message = {
		id: messageCounter++,
		text: text,
		likes: 0,
		audio: '',
		time: new Date()
	};

	messages.push(message);

	return message;
};

function findMessageById(id){
	for(var i=0; i<messages.length;i++){
		var message = messages[i];
		if(message.id==id)
			return message;
	}
}

exports.likeMessage = function(id){
	var message = findMessageById(id);
	if(message)
		message.likes++;
	return message;
};

exports.deleteMessage = function(id){
  var oldLength = messages.length;
  messages = messages.filter(function(elem){
    return elem.id != id;
  });

  return messages.length !== oldLength;
};

exports.users = function(req, res){
	res.send(users);
};

exports.addUser = function(req, res){
	res.send();
};

exports.removeUser = function(req, res){
	res.send();
};

exports.renameUser = function(req, res){
	res.send();
};

function purgeOldMessages(){
	if(messages.length>100)
		messages.splice(0, 1);
}



var broadcast = function(message, complete) {

	payload = JSON.stringify({ "phrase": message.text });

	var options = {
		host: settings.vocalizer.host,
		port: settings.vocalizer.port,
		path: '/api/testvocalize',
		method: 'POST',
		headers: {
			'Content-Type' : 'application/json',
			'Content-Length' : payload.length
		}
	};

	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			var data = JSON.parse(chunk);
			message.audio = 'http://' + settings.vocalizer.host + ':' + settings.vocalizer.port + '/api/testvocalize/' + data.id;
			complete(message);
		});
	}).on('error', function(err) {
		complete(message);
	});

	req.write(payload);
	req.end();
};
