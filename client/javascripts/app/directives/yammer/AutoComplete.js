PulseApp.directive('autoComplete', function () {
	return {
		restrict: 'A',
		transclude: true,
		scope: {
			items: '=',
			types: '@',
			value: '=',
			addItems: '=',
			textArea: '@',
			textAreaRows: '@',
			onAddLink: '=',
			isDirty: '=',
			users: '=',
			onValueChange: '=',
			placeholder: '@'
		},
		template:	'<span class="autoComplete" ng-class="isInputFocused ? \'current\' :\'\'">' +
						'<span class="item" ng-repeat="item in addItems">' +
							'<a class="link" target="_blank" ng-href="{{item.Url ? item.Url : item.ProfileUrl}}" title="{{item.Name}}">{{(item.Type == "topic" ? "#" : "") + item.Name}}</a>' +
							'<a href="" class="remove glyphicon glyphicon-remove" ng-click="remove(item)"></a>' +
						'</span>' +
						'<span class="autoCompleteInput">' +
							'<textarea ng-show="textArea" rows="{{textAreaRows}}" ng-model="autoCompleteText" ng-change="autoComplete()" ng-focus="openAutoComplete()" ng-blur="closeAutoComplete()" />' +
							'<input type="text" placeholder="{{placeholder}}" ng-hide="textArea" ng-model="autoCompleteText" ng-change="autoComplete()" onfocus="$(this).select();" onmouseup="return false;" ng-focus="openAutoComplete()" ng-blur="closeAutoComplete()" />' +
							'<div class="autoCompleteListContainer" ng-show="(isInputFocused && items.length > 0 || isSearching) && !hideAutoCompletes" ng-class="types ? \'offset\' :\'\'">' +
								'<span class="autoCompleteList">'+
									'<span loading-Anim="" ng-show="isSearching"></span>' +
									'<div ng-show="!isSearching">'+
										'<a href="" ng-repeat="item in items" ng-click="select(item)">' +
											'<img ng-show="item.PictureUrl.length > 0" ng-src="{{item.PictureUrl}}" />' +
											'<span ng-show="item.PictureUrl.length <= 0" class="glyphicon glyphicon-home"></span>' +
											'<span>{{(item.Type == "topic" ? "#" : "") + item.Name}}</span>' +
										'</a>'+
									'</div>'+
								'</span>'+
							'</div>' +
						'</span>' +
					'</span>',
		controller: function ($scope, yammerService, $timeout, $rootScope) {
			$scope.autoCompleteTimer = null;

			$scope.resetValueIfNeeded = function () {
				if ($scope.value)
					$scope.autoCompleteText = $scope.value.Name;
			};

			$scope.resetValueIfNeeded();

			$scope.$watch('autoCompleteText', function () {
				if ($scope.onValueChange)
					$scope.onValueChange($scope.autoCompleteText);
			});

			$scope.openAutoComplete = function () {
				$scope.isInputFocused = true;

				$timeout(function () {
					if ($('.autoComplete.current .autoCompleteListContainer .enscroll-track').length <= 0) {
						$('.autoComplete.current .autoCompleteList').enscroll({
							minScrollbarLength: 28
						});
					}
				}, 100);
			};

			$scope.closeAutoComplete = function () {
				$timeout(function () {
					$scope.resetValueIfNeeded();
					$scope.isInputFocused = false;
				}, 100);
			};

			$scope.select = function (item) {
				$scope.isInputFocused = false;
				var input = $scope.getTextInput();

				if (!$scope.types) {
					$scope.hideAutoCompletes = true;
					var insert = '';
					if (item.Type == 'user') {
						insert = item.Name;
						if ($scope.users && $.grep($scope.users, function (e) { return e.Id == item.Id; }).length <= 0)
							$scope.users.push(item);
					} else if (item.Type == 'topic')
						insert = '#' + item.Name.split(" ").join("");

					var start = $scope.autoCompleteText.substring(0, $scope.autoCompleteTextPosition.Start);
					$scope.autoCompleteText = start + insert + $scope.autoCompleteText.substring($scope.autoCompleteTextPosition.End);

					$timeout(function () {
						input.focus();
						input.caret(start.length + insert.length);
					}, 100);
				}
				else if ($scope.value) {
					$scope.autoCompleteText = '';
					$scope.value = item;
				} else if ($scope.addItems) {
					if ($.grep($scope.addItems, function(e) { return e.Id == item.Id; }).length <= 0) {
						$scope.autoCompleteText = '';
						$scope.addItems.push(item);
					}
					$timeout(function() { input.focus(); }, 100);
				}
			};

			$scope.remove = function(item) {
				$scope.addItems.splice($.inArray(item, $scope.addItems), 1);
			};
			
			$scope.autoComplete = function () {
				$scope.isDirty = true;
				$timeout.cancel($scope.autoCompleteTimer);

				$scope.autoCompleteTimer = $timeout(function () {
					var types = $scope.types;
					var autoCompleteText = $scope.autoCompleteText.trim();

					if (!types) {
						var advanced = $scope.advancedAutoComplete(autoCompleteText, types);
						autoCompleteText = advanced.autoCompleteText;
						types = advanced.types;
					}

					if (types && autoCompleteText.length > 0 && (autoCompleteText.trim() != $scope.lastAutoCompleteText || types != $scope.lastAutoCompleteTypes)) {
						$scope.isSearching = true;
						$scope.hideAutoCompletes = false;
						$scope.lastAutoCompleteText = autoCompleteText;
						$scope.lastAutoCompleteTypes = types;
						yammerService.autoComplete(autoCompleteText, types, function (result) {
							$scope.items.length = 0;

							if (result.user) {
								$.each(result.user, function (i, value) {
									$scope.items.push({ Type: 'user', Id: value.id, Name: value.full_name, PictureUrl: value.photo, ProfileUrl: value.web_url, AtIdentifier: value.name });
								});
							}
							if (result.topic) {
								$.each(result.topic, function (i, value) {
									$scope.items.push({ Type: 'topic', Id: value.id, Name: value.name, Url: value.web_url });
								});
							}
							if (result.group) {
								if (autoCompleteText.toLowerCase().match("^[a|c]") || autoCompleteText.trim().length <= 0)
									$scope.items.push(yammerService.allCompanyGroup);

								$.each(result.group, function (i, value) {
									$scope.items.push({ Type: 'group', Id: value.id, Name: value.full_name, PictureUrl: value.photo, Description: value.description });
								});
							}
							$scope.autoCompleteFinished();
						});
					} else {
						$scope.hideAutoCompletes = (!types || autoCompleteText.length <= 0) && !$scope.isSearching;
						if (!$scope.isSearching)
							$scope.autoCompleteFinished();
					}
				}, 500);
			};

			$scope.advancedAutoComplete = function (autoCompleteText, types) {
				$scope.autoCompleteTextPosition = {};

				$scope.autoCompleteTextPosition.End = $scope.getTextInput().caret();
				autoCompleteText = autoCompleteText.substring(0, $scope.autoCompleteTextPosition.End).trim();
				$scope.autoCompleteTextPosition.Start = autoCompleteText.lastIndexOf(" ", $scope.autoCompleteTextPosition.End) + 1;
				var start = autoCompleteText.lastIndexOf("\n", $scope.autoCompleteTextPosition.End) + 1;
				$scope.autoCompleteTextPosition.Start = start > $scope.autoCompleteTextPosition.Start ? start : $scope.autoCompleteTextPosition.Start;
				if ($scope.autoCompleteTextPosition.Start >= 0)
					autoCompleteText = autoCompleteText.substring($scope.autoCompleteTextPosition.Start);

				if (autoCompleteText.match("^@")) {
					types = 'user:5';
					autoCompleteText = autoCompleteText.substring(1);
				} else if (autoCompleteText.match("^#")) {
					types = 'topic:5';
					autoCompleteText = autoCompleteText.substring(1);
				} else if (autoCompleteText.match("^www") || autoCompleteText.match("^http")) {
					if (autoCompleteText.match("^www"))
						autoCompleteText = "http://" + autoCompleteText;
					$scope.addLink(autoCompleteText);
				}

				return { autoCompleteText: autoCompleteText, types: types };
			};

			$scope.addLink = function (url) {
				$scope.isSearching = true;
				$rootScope.$apply();
				
				yammerService.getOpenGraph(url, function (result) {
					if (result.site_name && $scope.onAddLink)
						$scope.onAddLink(result);
					$scope.autoCompleteFinished();
				}, function(error) {
					$scope.autoCompleteFinished();
				});
			};

			$scope.autoCompleteFinished = function () {
				$scope.isSearching = false;
				if ($scope.isDirty !== undefined)
					$scope.isDirty = false;
				$rootScope.$apply();
			};

			$scope.getTextInput = function() {
				return $('.autoComplete.current ' + ($scope.textArea ? 'textarea' : 'input'));
			};
		}
	};
});