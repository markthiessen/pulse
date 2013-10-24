PulseApp.factory('$emojify', ['$rootScope', 
	function($rootScope){
		emojify.setConfig({
		    emojify_tag_type: 'div',
		    emoticons_enabled: true,
		    people_enabled: true,
		    nature_enabled: true,
		    objects_enabled: true,
		    places_enabled: true,
		    symbols_enabled: true
		});

		return {
			run: function(elm){
				console.log('hello');
				emojify.run(elm);
			}
		};
	}]);