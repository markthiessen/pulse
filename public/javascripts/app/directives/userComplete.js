PulseApp.directive('userComplete', [function(){
	
	return {
		scope:{
			users: '='
		},
		link: function(scope, elm, attrs){

			function findUserMatches(str){
				return scope.users.filter(function(u){
					return u.name.toLowerCase().indexOf(str.toLowerCase())==0;
				});
			}

			function setSelectionFromMatch(users){
				if(searchString){
					var user = users[0].name;
					var caretPosition = doGetCaretPosition(elm[0]);

					var lastTyped = searchString.substr(searchString.length-1, 1);

					var userSub = lastTyped + user.substr(searchString.length, user.length-searchString.length);
					
					insertAtCaret(elm[0], userSub);
					createSelection(elm[0], caretPosition+1, caretPosition+userSub.length);
				}
			}


			var choosingUser=false;
			var searchString = ''

			elm.on('keyup', function(e){
				var code = e.keyCode || e.which;
				if(code == 50 && e.shiftKey) { //Enter keycode

  					selectedIndex=0;

				  	setSelectionFromMatch(scope.users);
  					choosingUser=true;
  					searchString='';
  				}
				else if(code == 8){
					searchString='';
					choosingUser = false;
				}
			});
			elm.on('keydown', function(e){
				var code = e.keyCode || e.which;
				if(code == 9 && choosingUser){
					searchString = '';
  					setCaretPosition(elm[0], elm[0].value.length);
  					choosingUser=false;
  					
  					elm.trigger('input');

  					e.preventDefault();
				}
				else if(code == 13 && choosingUser){
					searchString = '';
  					setCaretPosition(elm[0], elm[0].value.length);
					choosingUser = false;

  					elm.trigger('input');

					e.preventDefault();

				}
			});
			elm.on('keypress', function(e){
				var code = e.keyCode || e.which;

				if(code==32 && choosingUser){
					choosingUser = false;
					searchString='';
				}
				else if(choosingUser){	
					var character = String.fromCharCode(e.keyCode);
					if(character!='@')
					{	searchString+=String.fromCharCode(e.keyCode);


						var users = findUserMatches(searchString);

						if(users.length){
							event.preventDefault();
							setSelectionFromMatch(users);
	  					}
	  					else
	  						choosingUser=false;
	  				}
				}
			});

		}
	};

	function insertAtCaret(elm, myValue){
		
		if (elm.selectionStart || elm.selectionStart == '0') {
            var startPos = elm.selectionStart;
            var endPos = elm.selectionEnd;
            var scrollTop = elm.scrollTop;
            elm.value = elm.value.substring(0, startPos)+myValue+elm.value.substring(endPos,elm.value.length);
            elm.focus();
            elm.selectionStart = startPos + myValue.length;
            elm.selectionEnd = startPos + myValue.length;
            elm.scrollTop = scrollTop;
        } else {
            elm.value += myValue;
            elm.focus();
        }
	}	

	function createSelection(field, start, end) {
	    if( field.createTextRange ) {
	      var selRange = field.createTextRange();
	      selRange.collapse(true);
	      selRange.moveStart('character', start);
	      selRange.moveEnd('character', end);
	      selRange.select();
	      field.focus();
	    } else if( field.setSelectionRange ) {
	      field.focus();
	      field.setSelectionRange(start, end);
	    } else if( typeof field.selectionStart != 'undefined' ) {
	      field.selectionStart = start;
	      field.selectionEnd = end;
	      field.focus();
	    }
  	}

  	function doGetCaretPosition (oField) {
	 	return oField.selectionStart;
	}

	function setCaretPosition(elem, caretPos){
	    if(elem != null) {
	        if(elem.createTextRange) {
	            var range = elem.createTextRange();
	            range.move('character', caretPos);
	            range.select();
	        }
	        else {
	            if(elem.selectionStart) {
	                elem.focus();
	                elem.setSelectionRange(caretPos, caretPos);
	            }
	            else
	                elem.focus();
	        }
	    }
	}

	function clearSelection(elm) {
	    var caretPosition = doGetCaretPosition(elm);
	    var val = elm.value;
	    var selectionStart = elm.selectionStart;
	    var selectionEnd = elm.selectionEnd;

	    var newString = '';
	    for(var i=0; i<val.length; ++i){
	    	if(i<selectionStart || i>selectionEnd)
	    		newString+=val[i];
	    }
	    elm.value=newString;
	}
}]);