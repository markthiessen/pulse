var messages = [],
	http = require('http'),
	settings = require('../settings');

var broadcast = function(message) {

	payload = JSON.stringify({ "phrase": message });

	var options = {
		host: settings.vocalizer.host,
		port: settings.vocalizer.port,
		path: '/api/vocalize',
		method: 'POST',
		headers: {
			'Content-Type' : 'application/json',
			'Content-Length' : payload.length
		}
	};

	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
				//ignore success
		});
	}).on('error', function(err) {
		//ignore error
	});

	req.write(payload);
	req.end();
};

exports.list = function(req, res){
  
  res.send(messages);
};

var notifyCallback=function(){}
exports.setNotifyCallback = function(callback){
	notifyCallback=callback;
};

exports.add = function(req, res){
	var message = req.body;
	if(message.text){

		if(message.broadcast) {
			broadcast(message.text);
		}

		delete message.broadcast; //hide broadcast flag from other clients
		message.time = new Date();
		messages.push(message);
		setTimeout(function(){
			purgeOldMessages();
			notifyCallback(message);

		},10);
	}
	res.send();
};

function purgeOldMessages(){
	var now = new Date();
	var anHourAgo = new Date();
	anHourAgo = now.setTime(now.getTime() + (-60 * 60 * 1000));
	messages = messages.filter(function(message){
		return message.time > anHourAgo;
	});
}
