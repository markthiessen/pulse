PulseApp.directive('userIcon', [function(){

	var icons = [
		'glyphicon-user',
		'glyphicon-asterisk',
		'glyphicon-certificate',
		'glyphicon-eye-open',
		'glyphicon-thumbs-up',
		'glyphicon-thumbs-down',
		'glyphicon-tree-conifer',
		'glyphicon-tree-deciduous',
		'glyphicon-tower',
		'glyphicon-bullhorn',
	];

	var applyIcon = function(elm, icon){
		icons.map(function(iconClass){
			elm.removeClass(iconClass);
		});

		elm.addClass(icons[icon % icons.length]);
	};

	return {
		link: function(scope, elm, attrs){

			elm.addClass('glyphicon');
			elm.addClass('glyphicon-white');

			applyIcon(elm, attrs.userIcon);

			scope.$watch(attrs.userIcon, function(newVal){
				if(newVal){
					applyIcon(elm, newVal);
				}
			});
		}
	};
}]);
