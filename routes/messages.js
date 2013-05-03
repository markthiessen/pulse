var messages = [];

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
		message.time = new Date();
		messages.unshift(message);
	}
	setTimeout(function(){
		purgeOldMessages();
		notifyCallback(message);

	},10);
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