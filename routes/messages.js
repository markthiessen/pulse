
/*
 * GET messages
 */
var messages = [];


exports.list = function(req, res){
  res.send(messages);
};

exports.add = function(req, res){
	var message = req.body;
	if(message.text){
		message.time = new Date();
		messages.unshift(message);
	}
	res.send();
};