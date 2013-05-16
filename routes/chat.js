var crypto = require('crypto');
var messages = [], users = [];

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
		messages.push(message);

		setTimeout(function(){
			purgeOldMessages();
			notifyCallback(message);

		}, 10);
	}
	res.send();
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
