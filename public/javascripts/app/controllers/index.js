PulseApp.controller('IndexCtrl', ['$scope', '$rootScope', '$announcementService', function($scope, $rootScope, $announcementService){
	
	$rootScope.activeView='Announcements';

	$scope.announcements = $announcementService.announcements;
	$scope.loud = false;

	$scope.getFreshness = function(message){
		var now = new Date();
		var fifteenMinutesAgo = new Date();
		fifteenMinutesAgo.setTime(now.getTime() +(-15*60*1000));
		
		var anHourAgo = new Date();
		anHourAgo.setTime(now.getTime() +(-60*60*1000));

		var aDayAgo = new Date().setTime(now.getTime() + (-24*60*60*1000));

		var messageTime = new Date(Date.parse(message.time));
		if(messageTime> fifteenMinutesAgo)
			return 'fresh';
		else if(messageTime>anHourAgo)
			return 'old';
		else if(messageTime>aDayAgo)
			return 'stale';
		else
			return 'really-stale'
	};

	$scope.toggleVolume = function(){
		$scope.loud = !$scope.loud;
	};


	var lastMsg = null;
	$scope.newMessage = '';
	$scope.postNewMessage = function(){
		$announcementService.add($scope.newMessage, $scope.loud);
		$scope.newMessage='';
		$scope.loud = false;
	};

}]);
