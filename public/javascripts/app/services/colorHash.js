PulseApp.factory('$colorHash', function(){

	function pad(number, length) {   
	    var str = '' + number;
	    while (str.length < length) {
	        str = '0' + str;
	    }	   
	    return str;
	}

	function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? [
	        parseInt(result[1], 16),
	        parseInt(result[2], 16),
	        parseInt(result[3], 16)]
	     : null;
	}

	return {
		getColor: function(inputText) {
		    var maxBrightness=250; // int btwn 0 and 765
		    var spec=2; // int btwn 2-7, determines how unique each color will be
		    var hash =CryptoJS.MD5(inputText).toString(CryptoJS.enc.Hex);

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
		        outputHex = outputHex + pad(intsOut[y].toString(16), 2);
		    }
			var rgb = hexToRgb(outputHex);
			var rgba = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+", 0.7)";
			console.log(rgba);
			return rgba;
		}
	};
});