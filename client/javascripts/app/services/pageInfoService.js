PulseApp.factory('$pageInfoService',['$document', function($document){


	var pageInfoService = {
		enableNewMessageNotification: function(){
				var currentTitle = $document.attr('title');
				if(currentTitle.substring(currentTitle.length-1) != "*")
					$document.attr('title', currentTitle + "*");
		},
		disableNewMessageNotification: function(){
				var currentTitle = $document.attr('title');
				if(currentTitle.substring(currentTitle.length-1) == "*")
					$document.attr('title', currentTitle.substring(0, currentTitle.length - 1));
		}
	};

	return pageInfoService;
}]);