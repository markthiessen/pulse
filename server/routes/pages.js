
/*
 * GET home page.
 */

exports.index = function(req, res){
	var username = "anony-mouse";
	if(req.user)
		username = req.user.givenName+' '+req.user.familyName;

	res.render('index', { title: 'pulse', settings: require('../../settings'), username: username});
};