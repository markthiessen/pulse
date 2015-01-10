PulseApp.directive('post', function ($compile, yammerMessage) {
	return {
		restrict: 'A',
		transclude: true,
		scope: {
			message: '=',
			onPost: '=',
			groups: '=',
			users: '=',
			currentUser: '=',
			rootList: '='
		},
		template:
		'<div id="message{{message.MessageId}}" class="message" ng-class="{\'inner\': !message.IsRootMessage}">' +
			'<span class="body">' +
				'<span class="isNew" ng-show="message.MarkedAsNew"></span>' +
				'<span ng-class="{\'isNewOffset\' : message.MarkedAsNew}">' +
					'<a class="profilePic" target="_blank" ng-href="{{message.Author.ProfileUrl}}">' +
						'<img ng-src="{{message.Author.PictureUrl}}" />' +
					'</a>' +
					'<span class="name">' +
						'<span>' +
							'<a target="_blank" ng-href="{{message.Author.ProfileUrl}}">{{message.Author.Name}}</a>' +
							'<span ng-show="message.IsRootMessage || message.NotifiedUsers.length > 0"> to </span>' +
							'<a ng-href="{{message.Group.Url}}" ng-show="message.IsRootMessage">{{message.Group.Name}}</a' +
							'><span ng-show="message.NotifiedUsers.length > 0"' +
								'><span ng-repeat="user in message.NotifiedUsers"' +
									'><span ng-show="!message.IsRootMessage"><span ng-show="$last && !$first"> and </span><span ng-show="!$last && !$first">, </span></span' +
									'><span ng-show="message.IsRootMessage"><span ng-show="$last"> and </span><span ng-show="!$last">, </span></span' +
									'><a class="notified" ng-href="{{user.ProfileUrl}}">{{user.Name}}</a' +
								'></span>' +
							'</span>' +
						'</span>' +
					'</span><br/>' +
					'<span class="date">{{message.PubDate | jsonDate:\'MMM dd yyyy hh:mm:ss a\'}}</span>' +
					'<a ng-show="message.IsRootMessage" class="glyphicon glyphicon-link messageLink" target="_blank" ng-href="{{message.Link}}"></a>' +
					'<span class="contents textContents" ng-class="{\'expanded\': message.CanCollapse}" ng-hide="message.Modules.length > 0" ng-bind-html="message.HtmlContent"></span>' +
					'<span class="contents" ng-show="message.Modules.length > 0" ng-repeat="module in message.Modules"><span id="module{{module.Id}}" class="module" compile="module.HtmlContent"></span></span>' +
					'<span class="commands" ng-show="message.CanExpand || message.CanCollapse">' +
						'<a href="" ng-show="message.CanExpand" ng-click="expandContents()">Expand</a>' +
						'<a href="" ng-show="message.CanCollapse" ng-click="collapseContents()">Collapse</a>' +
					'</span>' +
				'</span>' +
			'</span>' +

			'<div images-and-links="" message="message" ng-show="message.Links.length > 0 || message.Images.length > 0"></div>' +

			'<div class="tags" ng-show="message.Tags.length > 0">' +
				'<a class="tag" ng-repeat="tag in message.Tags" target="_blank" ng-href="{{tag.Link}}">#{{tag.Title}}</a>' +
			'</div>' +

			'<div class="likedBy" ng-show="message.LikedByUsers.length > 0">' +
				'<span>Liked by: </span>' +
				'<span class="you" ng-show="message.IsLikedByCurrentUser">You </span>' +
				'<a ng-repeat="user in message.LikedByUsers" target="_blank" ng-href="{{user.ProfileUrl}}">{{user.Name}}</a>' +
				'<span ng-show="message.LikedByNum - message.LikedByUsers.length > 0">and {{message.LikedByNum - message.LikedByUsers.length}} others</span>' +
			'</div>' +

			'<div class="commands">' +
				'<span loading-Anim="" ng-show="message.IsRepliesLoading"></span>' +
				'<div ng-hide="message.IsRepliesLoading">' +
					'<a href="" ng-hide="message.IsLikedByCurrentUser" ng-click="likeMessage()">Like</a>' +
					'<a href="" ng-show="message.IsLikedByCurrentUser" ng-click="unlikeMessage()">Unlike</a>' +
					'<a href="" ng-hide="message.IsReplyOpen" ng-click="openReply()">Reply</a>' +
					'<a href="" ng-show="message.AuthorId == currentUser.Id" ng-click="deleteMessage()">Delete</a>' +
					'<a href="" ng-show="message.IsCurrentUserFollowing" ng-click="unfollow()">Unfollow</a>' +
					'<a href="" ng-show="message.CanShowMore" ng-click="showMore()">Show {{message.NumberOfHiddenReplies}} More <span class="unread" ng-show="message.UnreadMessageCount > 0">({{message.UnreadMessageCount}} Unread)</span></a>' +
					'<a href="" ng-show="message.CanShowLess" ng-click="showLess()">Show Less</a>' +
				'</div>' +
			'</div>' +

			'<div class="post">' +
				'<div ng-if="message.IsReplyOpen" new-post="" parent-message="message" current-user="currentUser" on-post="onPost" users="users" groups="groups"></div>' +
			'</div>' +
		'</div>' +
		'<div class="newMessagesSeparator" ng-show="message.IsLastNewMessage"></div>',
		
		compile: function (tElement, tAttrs, transclude) {
			return {
				post: function ($scope, element, attrs, controller) {
					if ($scope.message.Replies) {
						var replies = $('<div ng-repeat="message in message.Replies" post="" message="message" root-list="rootList" on-post="onPost" users="users" groups="groups" current-user="currentUser"></div>');
						element.find('.post').before(replies);
						$compile(replies)($scope);
					}
				}
			};
		},
		
		controller: function ($scope, yammerService, $timeout, $rootScope) {
			$(document).ready(function () {
				setTimeout(function() {
					var bodyElement = $('#message' + $scope.message.MessageId + ' .textContents')[0];
					if (bodyElement) {
						$scope.message.CanExpand = bodyElement.scrollHeight > bodyElement.clientHeight;
						$rootScope.$apply();
					}
				}, 1);
			});

			$scope.expandContents = function() {
				$scope.message.CanCollapse = true;
				$scope.message.CanExpand = false;
			};

			$scope.collapseContents = function () {
				$scope.message.CanCollapse = false;
				$scope.message.CanExpand = true;
			};

			$scope.likeMessage = function () {
				$scope.message.IsRepliesLoading = true;
				yammerService.likeMessage($scope.message.MessageId, function () {
					$scope.message.IsLikedByCurrentUser = true;
					$scope.message.IsRepliesLoading = false;
					$rootScope.$apply();
				});
			};

			$scope.unlikeMessage = function () {
				$scope.message.IsRepliesLoading = true;
				yammerService.unlikeMessage($scope.message.MessageId, function () {
					$scope.message.IsLikedByCurrentUser = false;
					$scope.message.IsRepliesLoading = false;
					$rootScope.$apply();
				});
			};

			$scope.showMore = function () {
				yammerMessage.showMore($scope.message, function () {
					$rootScope.$apply();
				});
			};

			$scope.showLess = function () {
				yammerMessage.showLess($scope.message, function() {
					$rootScope.$apply();
				});
			};

			$scope.openReply = function () {
				$scope.message.IsReplyOpen = true;
				$timeout(function () {
					$("#message" + $scope.message.MessageId + " .post div:visible").scrollintoview({ duration: "normal" });
				}, 1);
			};

			$scope.unfollow = function () {
				yammerService.unfollowMessage($scope.message.ThreadId, function() {
					$scope.message.IsCurrentUserFollowing = false;
					$rootScope.$apply();
				});
			};

			$scope.deleteMessage = function () {
				if (window.confirm("Delete message?")) {
					yammerService.deleteMessage($scope.message.MessageId, function () {
						var removeMessage = function (list) {
							var index = $.inArray($scope.message, list);
							if (index >= 0) {
								list.splice(index, 1);
								$rootScope.$apply();
							} else {
								$.each(list, function (i, value) {
									removeMessage(value.Replies);
								});
							}
						};

						removeMessage($scope.rootList);
					});
				}
			};
		}
	};
});