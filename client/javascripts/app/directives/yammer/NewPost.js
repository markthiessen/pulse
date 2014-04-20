PulseApp.directive('newPost', function () {
	return {
		restrict: 'A',
		transclude: true,
		scope: {
			parentMessage: '=',
			onPost: '=',
			groups: '=',
			users: '=',
			onCancel: '&',
			currentUser: '='
		},
		template:
		'<div class="message" ng-class="{\'inner\': parentMessage}">' +
			'<span class="body">' +
				'<span>' +
					'<a class="profilePic" ng-href="{{currentUser.ProfileUrl}}">' +
						'<img ng-src="{{currentUser.PictureUrl}}" />' +
					'</a>' +
					'<span class="name">' +
						'<span ng-show="!parentMessage">' +
							'<a ng-href="{{currentUser.ProfileUrl}}">{{currentUser.Name}}</a> ' +
							'to <span auto-complete="" types="group:5" items="groups" value="newMessage.Group" />' +
							' and <span auto-complete="" types="user:5" items="users" add-items="newMessage.Users" placeholder="Notify User" />' +
						'</span>' +
						'<span ng-show="parentMessage"><a ng-href="{{currentUser.ProfileUrl}}">{{currentUser.Name}}</a></span>' +
					'</span><br/>' +
					'<span class="date">[Androids insert date here]</span>' +
					'<span class="contents">' +
						'<span auto-complete="" text-area="true" text-area-rows="4" items="postAutoCompletes" on-value-change="setPostBody" users="newMessage.Users" on-add-link="addLinkOrImage" is-dirty="isSearchingPostLink" />' +
					'</span>' +
				'</span>' +
			'</span>' +
			
			'<div images-and-links="" message="newMessage" remove-link="removeLink" remove-image="removeImage"></div>' +

			'<div class="tags" ng-show="!parentMessage">' +
				'<span auto-complete="" types="topic:5" items="tagAutoCompletes" add-items="newMessage.Tags" placeholder="Add Tag" />' +
			'</div>' +

			'<div class="ccUsers" ng-show="parentMessage">' +
				'<span auto-complete="" types="user:5" items="users" add-items="newMessage.Users" placeholder="Notify User" />' +
			'</div>' +

			'<div class="files">' +
				'<div class="file" ng-repeat="file in newMessage.Files">' +
					'<span ng-show="file.IsUploading">' +
					'Uploading <span class="progressBar"><span class="inner" ng-style="{\'width\':file.UploadedPercent + \'%\'}"></span></span>' +
					'</span>' +
				'</div>' +
			'</div>' +

			'<div class="commands">' +
				'<span loading-Anim="" ng-show="newMessage.IsPosting"></span>' +
				'<div ng-hide="newMessage.IsPosting">' +
					'<a href="" ng-click="uploadFile(newMessage)">Attach File</a>' +
					'<input class="fileInput" type="file" style="display: none;" />' +
					'<div class="pullRight">' +
						'<a href="" ng-click="closeNewPost()" ng-show="newMessage.NumberOfImagesUpLoading <= 0 && !isSearchingPostLink">Cancel</a>' +
						'<span class="disabledPost" ng-hide="(newMessage.PostBody.length > 0 || newMessage.Files && newMessage.Files.length > 0) && newMessage.NumberOfImagesUpLoading <= 0 && !isSearchingPostLink">Post</span>' +
						'<a class="last" href="" ng-click="post()" ng-show="(newMessage.PostBody.length > 0 || newMessage.Files && newMessage.Files.length > 0) && newMessage.NumberOfImagesUpLoading <= 0 && !isSearchingPostLink">Post</a>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>',
		
		controller: function ($scope, yammerService, yammerMessage, $timeout, $rootScope) {
			$scope.newMessage = { MessageId: 0, Group: yammerService.allCompanyGroup, NumberOfImagesUpLoading: 0, Users: [], Tags: [], Links: [], Images: [], Files: [] };
			$scope.postAutoCompletes = [];
			$scope.tagAutoCompletes = [];
			$scope.isSearchingPostLink = false;

			$scope.setPostBody = function(text) {
				$scope.newMessage.PostBody = text;
			};

			$scope.post = function () {
				$scope.newMessage.IsPosting = true;

				var uploadedFileIds = [];
				$.each($scope.newMessage.Files, function (index, value) { uploadedFileIds.push("uploaded_file:" + value.data.id); });
				var topicNames = [];
				$.each($scope.newMessage.Tags, function (index, value) { topicNames.push(value.Name); });
				
				var linkUrl = null;
				if ($scope.newMessage.Links.length > 0)
					linkUrl = $scope.newMessage.Links[0].Link;

				var notifyUserIds = "[";
				var body = $scope.newMessage.PostBody;
				$.each($scope.newMessage.Users, function (index, value) {
					notifyUserIds += "[user:" + value.Id + "],";
					body = body.split(value.Name).join("@" + value.AtIdentifier);
				});
				if (notifyUserIds.length > 1)
					notifyUserIds = notifyUserIds.substr(0, notifyUserIds.length - 1);
				notifyUserIds += "]";

				var repliedToMessageId = $scope.parentMessage ? $scope.parentMessage.MessageId : null;
				var groupId = $scope.newMessage.Group.Id >= 0 ? $scope.newMessage.Group.Id : null;

				yammerService.post(body, groupId, repliedToMessageId, uploadedFileIds, notifyUserIds, linkUrl, topicNames, function (result) {
					$scope.onPost(result, $scope.parentMessage);
					
					$scope.closeNewPost(true);
					$scope.newMessage.IsPosting = false;
					$rootScope.$apply();
				});
			};

			$scope.uploadFile = function () {
				var fileInput = $scope.parentMessage ? $('#message' + $scope.parentMessage.MessageId + ' .fileInput') : $('.postThread .fileInput');

				fileInput.change(function () {
					if (fileInput[0].files.length > 0) {
						$scope.newMessage.NumberOfImagesUpLoading++;
						var fileInfo = { IsUploading: true, UploadedPercent: 0 };
						$scope.newMessage.Files.push(fileInfo);
						$rootScope.$apply();

						yammerService.uploadFile(fileInput[0].files[0], function (progress) {
							fileInfo.UploadedPercent = Math.ceil((progress.loaded / progress.total) * 100);
							$rootScope.$apply();
						}, function (result) {
							$scope.newMessage.NumberOfImagesUpLoading--;
							$scope.newMessage.Files.splice($.inArray(fileInfo, $scope.newMessage.Files), 1);
							$scope.addLinkOrImage($.parseJSON(result), true);
						});

						fileInput.replaceWith(fileInput.clone());
					}
				});

				fileInput.trigger('click');
			};

			$scope.removeImage = function (image, confirmed) {
				$timeout(function () {
					if (confirmed || window.confirm("Remove image?")) {
						$scope.newMessage.Images.splice($.inArray(image, $scope.newMessage.Images), 1);
						if (image.IsFile)
							yammerService.removeFile(image.Id);
					}
				}, 100); // Why is this timeout required???
			};

			$scope.removeLink = function (link, confirmed) {
				$timeout(function () {
					if (confirmed || window.confirm("Remove link?")) {
						$scope.newMessage.Links.splice($.inArray(link, $scope.newMessage.Links), 1);
						if (link.IsFile)
							yammerService.removeFile(link.Id);
					}
				}, 100); // Why is this timeout required???
			};

			$scope.closeNewPost = function (confirmed) {
				if (confirmed || window.confirm("Cancel post?")) {
					if ($scope.parentMessage)
						$scope.parentMessage.IsReplyOpen = false;
					$scope.clearMessage(true);

					if ($scope.onCancel)
						$scope.onCancel();
				}
			};

			$scope.addLinkOrImage = function (result, isFile) {
				var numberOfImages = $.grep($scope.newMessage.Images, function (i) { return !i.IsFile; }).length;
				var numberOfLinks = $.grep($scope.newMessage.Links, function (i) { return !i.IsFile; }).length;
				if (isFile || numberOfImages + numberOfLinks <= 0) {	//Yammer please let us add more then one link
					var item = yammerMessage.createLinkImageOrModule(result);
					item.IsFile = isFile;
					if (item.type == 'image')
						$scope.newMessage.Images.push(item);
					else
						$scope.newMessage.Links.push(item);
					$rootScope.$apply();
				}
			};

			$scope.clearMessage = function (removeFiles) {
				$scope.newMessage.PostBody = '';
				$scope.newMessage.Group = yammerService.allCompanyGroup;
				if (removeFiles) {
					$.each($scope.newMessage.Images, function (index, value) { if (value.IsFile) $scope.removeImage(value, true); });
					$.each($scope.newMessage.Links, function (index, value) { if (value.IsFile) $scope.removeLink(value, true); });
				}
				$scope.newMessage.Files.length = 0;
				$scope.newMessage.Images.length = 0;
				$scope.newMessage.Links.length = 0;
				$scope.newMessage.Tags.length = 0;
				$scope.newMessage.Users.length = 0;
			};
		}
	};
});
