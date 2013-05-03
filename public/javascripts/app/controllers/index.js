PulseApp.controller('IndexCtrl', ['$scope', '$rootScope', function($scope, $rootScope){

	
	function refreshMessages(){
		$scope.messages = $rootScope.Messages.query();
	}
	refreshMessages();

	$scope.getFreshness = function(message){
		var now = new Date();
		var tenMinutesAgo = new Date();
		tenMinutesAgo.setTime(now.getTime() +(-10*60*1000));
		
		var anHourAgo = new Date();
		anHourAgo.setTime(now.getTime() +(-60*60*1000));

		var messageTime = new Date(Date.parse(message.time));
		if(messageTime> tenMinutesAgo)
			return 'fresh';
		else if(messageTime>anHourAgo)
			return 'old';
		else
			return 'stale';
	};

	$scope.newMessage = new $rootScope.Messages();
	$scope.postNewMessage = function(){
		$scope.newMessage.$save(function(){
			$scope.newMessage.text='';
			refreshMessages();
		}, function(err){
			console.log(err);
		});
	};
}]);