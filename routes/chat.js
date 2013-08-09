var crypto = require('crypto');
var messages = [], users = [];

var messageCounter = 0;

var notifyCallback=function(){}
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

		if(messageCounter>1000)
			messageCounter=0;

		messages.push(message);

		setTimeout(function(){
			purgeOldMessages();
			notifyCallback(message);

		}, 10);
	}
	res.send();
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
