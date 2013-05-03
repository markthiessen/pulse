PulseApp.controller('IndexCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
	

	function refreshMessages(){
		$rootScope.Messages.query({ver:new Date().getMilliseconds()},function(result){
			$scope.messages = result;
		});
	}
	refreshMessages();

	$scope.getFreshness = function(message){
		var now = new Date();
		var fifteenMinutesAgo = new Date();
		fifteenMinutesAgo.setTime(now.getTime() +(-15*60*1000));
		
		var anHourAgo = new Date();
		anHourAgo.setTime(now.getTime() +(-60*60*1000));

		var messageTime = new Date(Date.parse(message.time));
		if(messageTime> fifteenMinutesAgo)
			return 'fresh';
		else if(messageTime>anHourAgo)
			return 'old';
		else
			return 'stale';
	};

	var lastMsg = null;
	$scope.newMessage = new $rootScope.Messages();
	$scope.postNewMessage = function(){
		var copy = angular.copy($scope.newMessage);
		copy.time = new Date();
		if(copy.text){
			lastMsg = copy.text;
			copy.$save(function(){
				$scope.messages.unshift(copy);
				$scope.newMessage.text='';
			}, function(err){
				console.log(err);
			});
		}
	};

	function notify(message) {
	  if (window.webkitNotifications.checkPermission() > 0) {
	    RequestPermission(notify);
	  } else {
	    notification = window.webkitNotifications.createNotification('/images/icon.png', message.text, '');
	    notification.show();
	  }
	}

	 var socket = io.connect('http://localhost:3001');
	 socket.on('new', function(message){
	 	refreshMessages();
	 	if(message.text!=lastMsg)
		 	notify(message);
	 });
}]);