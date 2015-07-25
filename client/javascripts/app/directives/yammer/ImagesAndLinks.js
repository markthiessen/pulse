PulseApp.directive('imagesAndLinks', function ($timeout) {
	return {
		restrict: 'A',
		transclude: true,
		scope: {
			message: '=',
			removeLink: '=',
			removeImage: '='
		},
		template:
			'<div class="webLinks" ng-show="message.Links.length > 0">' +
				'<div class="link" ng-repeat="link in message.Links">' +
					'<a class="thumb" target="_blank" ng-href="{{link.EmbeddedUrl.length <= 0 ? link.Link : link.EmbeddedUrl}}" ng-class="{\'fancybox.iframe\': link.EmbeddedUrl.length > 0}">' +
						'<img ng-src="{{link.PictureUrl}}" />' +
						'<span ng-show="link.PictureUrl.length <= 0" class="glyphicon glyphicon-pushpin"></span>' +
					'</a>' +
					'<span class="caption">' +
						'<a class="title" target="_blank" ng-href="{{link.EmbeddedUrl.length <= 0 ? link.Link : link.EmbeddedUrl}}" ng-class="{\'fancybox.iframe\': link.EmbeddedUrl.length > 0}">' +
							'<span class="text">{{link.Title}}</span> <span ng-show="link.EmbeddedUrl.length <= 0" class="glyphicon glyphicon-link"></span>' +
						'</a>' +
						'<a ng-if="removeLink" href="" class="remove glyphicon glyphicon-remove" ng-click="removeLink(link)"></a>' +
						'<a class="host" target="_blank" ng-href="{{link.Link}}">{{link.HostUrl}}</a>' +
						'<span class="description">{{link.Description}}</span>' +
					'</span>' +
					'<a class="hiddenCaption" target="_blank" style="display: none" ng-href="{{link.Link}}">{{link.Title}} <span class="glyphicon glyphicon-link"></span></a>' +
				'</div>' +
			'</div>' +

			'<div class="images" style="display: none;">' +
				'<div class="slides">' +
					'<div class="slide" ng-repeat="image in message.Images">' +
						'<a class="slideImg" ng-href="{{image.LargePictureUrl}}" rel="message{{message.MessageId}}">' +
							'<img ng-src="{{image.PictureUrl}}" />' +
						'</a>' +
						'<span class="caption">' +
							'<a class="title" target="_blank" ng-href="{{image.Link}}"><span class="text">{{image.Title}}</span> <span class="glyphicon glyphicon-link"></span></a>' +
							'<a ng-if="removeImage" class="remove glyphicon glyphicon-remove" href="" ng-click="removeImage(image)"></a>' +
						'</span>' +
					'</div>' +
				'</div>' +
				'<span ng-show="message.Images.length > 1">' +
					'<a href="" class="nextBtn glyphicon glyphicon-circle-arrow-right"></a>' +
					'<a href="" class="previousBtn glyphicon glyphicon-circle-arrow-left"></a>' +
				'</span>' +
				'<div class="pagination" ng-show="message.Images.length > 1">' +
					'<div class="thumb" ng-repeat="image in message.Images">' +
						'<a href="">' +
							'<img ng-src="{{image.PictureUrl}}" />' +
						'</a>' +
					'</div>' +
				'</div>' +
			'</div>',
		link: function ($scope, elm, attrs) {

			$scope.$watchCollection('message.Images', function () {
				if ($scope.message.Images && $scope.message.Images.length > 0) {
					elm.find(".slides").imagesLoaded(function() {
						$timeout(function() {
							var imageElements = elm.find('.images');
							imageElements.show();

							imageElements.find('.slides').each(function() {
								var slideSet = $(this);
								if (slideSet.children('.slide').length > 1) {
									slideSet.carouFredSel({
										width: 398,
										pagination: { container: ".pagination", anchorBuilder: false },
										auto: { play: false }
									});
								} else
									slideSet.trigger('destroy');
							});

							imageElements.find(".slides .slideImg").fancybox({
								fitToView: false,
								type: 'image',
								beforeLoad: function() {
									this.title = $(this.element).parent().find('.caption')[0].outerHTML;
								},
								afterLoad: function (a) {
									$(this.inner).click(function () {
										$(this).toggleClass('zoom');
									});
								}
							});

							// Initialize the prev & next buttons afterwards since they like to disappear otherwise
							imageElements.find('.slides').each(function() {
								var slideSet = $(this);
								slideSet.trigger("configuration", {
									next: { button: slideSet.parent().parent().find('.nextBtn') },
									prev: { button: slideSet.parent().parent().find('.previousBtn') }
								});
							});
						}, 1000);
					});
				}
			});

			$scope.$watchCollection('message.Links', function () {
				if ($scope.message.Links && $scope.message.Links.length > 0) {
					elm.find(".link a.thumb").fancybox({
						beforeLoad: function() {
							this.title = $(this.element).parent().children('.hiddenCaption')[0].outerHTML.replace('style="display: none"', '');
						}
					});
					elm.find(".link a.title").fancybox({
						beforeLoad: function() {
							this.title = $(this.element).parent().parent().children('.hiddenCaption')[0].outerHTML.replace('style="display: none"', '');
						}
					});
				}
			});
		}
	};
});