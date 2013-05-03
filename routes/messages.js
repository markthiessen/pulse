
/*
 * GET messages
 */
 var oldDate=new Date(), staleDate=new Date();
	oldDate.setTime(new Date().getTime() +(-50*60*1000));
	staleDate.setTime(new Date().getTime() +(-61*60*1000));
var messages = [
	{text: 'LUNCH TRAIN!!!', time: new Date()},
		{text: 'Bob is at the door...', time: oldDate},
		{text: 'Cookies in the kitchen. Come and get them.', time: oldDate},
		{text: 'Heading to Much Burrito!', time: staleDate}
];


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