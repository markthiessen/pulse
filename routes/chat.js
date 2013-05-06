var notifyCallback=function(){}
exports.setNotifyCallback = function(callback){
	notifyCallback=callback;
};

exports.add = function(req, res){
	var message = req.body;
	if(message.text){
		message.time = new Date();
	}
	setTimeout(function(){
		notifyCallback(message);

	}, 10);
	res.send();
};