PulseApp.factory('$unicode', [
	function() {
		var replace = function(str){
			var unicode = /\\u([a-f,0-9]{4})*/ig;

			str = str.replace(unicode, function(code){
				var matches = code.substring(2).match(/.{4}/g);

				//javascript returns null instead of empty array if no match. wat.
				if (matches){
					return matches.map(function(segment) {
						return String.fromCharCode(parseInt(segment, 16));
					})
					.join('');
				}
				return code;
			});

			return str;
		};

		var escape = function(str){
			var unprintable = /[^\u0020-\u007E]/g

			str = str.replace(unprintable, function(match){
				return '\\u' + ('000' + match.charCodeAt(0).toString(16)).slice(-4);
			});

			return str;
		};

		return {
			replace : replace,
			escape : escape
		};
	}]);
