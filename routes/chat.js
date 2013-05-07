var crypto = require('crypto');
var messages = [];

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
	}
	if(message.user){
		message.color = getColor(message.user);
	}
	messages.push(message);

	setTimeout(function(){
		purgeOldMessages();
		notifyCallback(message);

	}, 10);
	res.send();
};

function purgeOldMessages(){
	if(messages.length>100)
		messages.splice(0, 1);
}

String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};

function getColor(inputText) {
    var maxBrightness=150; // int btwn 0 and 765
    var spec=7; // int btwn 2-7, determines how unique each color will be
    var hash = crypto.createHash('md5').update(inputText).digest("hex");
    var specCeiling = Math.pow(16,spec) -1;
    var intsOut = new Array();
    for (var i=0; i<3; i++) {
        var sub = hash.substr(spec*i, spec);
        var asInt = parseInt("0x" + sub);
        var intOut = Math.floor(asInt/specCeiling*255);
        intsOut[i] = intOut;
    }
    
    // check max brightness and decrease all values incrementally until matched
    while (intsOut[0] + intsOut[1] + intsOut[2] > maxBrightness) {
        for (var x=0; x<3; x++) {
            if (intsOut[x] > 0) {
                intsOut[x] -= 1;
            }
        }
    }
    
    // build color string
    var outputHex = "#";
    for (var y=0;y<3;y++) {
        outputHex = outputHex + (intsOut[y].toString(16).paddingLeft("00"));
    }
    
    return outputHex;
}