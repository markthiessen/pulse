function FirstOrDefault(list, compare) {
	var firstOrDefault = $.grep(list, compare);
	return firstOrDefault.length > 0 ? firstOrDefault[0] : null;
}

function GetParameterByName(url, name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function StringEndsWith(string, pattern) {
	var d = string.length - pattern.length;
	return d >= 0 && string.lastIndexOf(pattern) === d;
}

function HtmlEncode(value) {
	//create a in-memory div, set it's inner text(which jQuery automatically encodes)
	//then grab the encoded contents back out.  The div never exists on the page.
	return $('<div/>').text(value).html();
}