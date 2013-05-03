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

	$scope.newMessage = new $rootScope.Messages();
	$scope.postNewMessage = function(){
		var copy = angular.copy($scope.newMessage);
		copy.time = new Date();
		copy.$save(function(){
			$scope.messages.unshift(copy);
			$scope.newMessage.text='';
		}, function(err){
			console.log(err);
		});
	};

	function requestPermission(){
		if (window.webkitNotifications)
			if( window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
		    // function defined in step 2
		    window.webkitNotifications.createNotification(
		        'icon.png', 'Notification Title', 'Notification content...');
		  } else {
		    window.webkitNotifications.requestPermission();
		  }
	}
	requestPermission();

	function notify(){
		if (window.webkitNotifications) {
		   window.webkitNotifications.createNotification(
        	null, 'Notification Title', 'Notification content...');
		}
		else {
		  console.log("Notifications are not supported for this Browser/OS version yet.");
		}
	}
	//notify();

	 var socket = io.connect('http://localhost:3001');
	 socket.on('new', function(data){
	 	refreshMessages();
	 });
}]);