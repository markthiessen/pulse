PulseApp.factory('$pageInfoService',function(){
	var pageInfoService = {
		enableNewMessageNotification: function(){
				if(document.title.substring(document.title.length-1) != "*")
					document.title=document.title + "*";
		},
		disableNewMessageNotification: function(){
				if(document.title.substring(document.title.length-1) == "*")
					document.title = document.title.substring(0, document.title.length - 1);
		}
	};

	return pageInfoService;
});