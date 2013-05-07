PulseApp.factory('$announcementService', ['$socket', '$resource', '$rootScope',
	 function($socket, $resource, $rootScope){
	
	var restService = $resource('/messages/:id', {},{
			method: 'GET',
			cache:false
		});

	var lastMsg = '';
	var announcementService = {
		announcements: [],
		Announcement: restService,
		add: function(text){
			var announcement = new announcementService.Announcement();
			announcement.text = text;
			announcement.time = new Date();

			lastMsg = text;
			announcement.$save();
		}
	};

	restService.query({ver:new Date().getMilliseconds()},function(results){
		results.forEach(function(item){
			announcementService.announcements.unshift(item);
		})		
	});
	

	function notify(message) {
		if(window.webkitNotifications){
		  if (window.webkitNotifications.checkPermission() > 0) {
		    RequestPermission(notify);
		  } else {
		    var notification = window.webkitNotifications.createNotification('/images/icon.png', message.text, '');
		    notification.show();
		  }
		}
	}

	$socket.on('new', function(message){
	 	announcementService.announcements.unshift(message);
	 	if(message.text!=lastMsg)
		 	notify(message);
		 $rootScope.$apply();
	});
	return announcementService;
}]);