function SetupImages()
{
	$(".message .slides").imagesLoaded(function () {
		setTimeout(function () {
			var imageElements = $('.message .images');
			imageElements.show();

			imageElements.find('.slides').each(function () {
				var slideSet = $(this);
				if (slideSet.children('.slide').length > 1) {
					slideSet.carouFredSel({
						width: 399,
						pagination: {
							container: ".pagination",
							anchorBuilder: false
						},
						auto: {
							play: false
						}
					});
				} else
					slideSet.trigger('destroy');
			});

			imageElements.find(".slides .slideImg").fancybox({
				fitToView: false,
				type: 'image',
				beforeLoad: function () {
					this.title = $(this.element).parent().find('.caption')[0].outerHTML;
				}
			});

			$(".message .link a.thumb").fancybox({
				beforeLoad: function () {
					this.title = $(this.element).parent().children('.hiddenCaption')[0].outerHTML.replace('style="display: none"', '');
				}
			});
			$(".message .link a.title").fancybox({
				beforeLoad: function () {
					this.title = $(this.element).parent().parent().children('.hiddenCaption')[0].outerHTML.replace('style="display: none"', '');
				}
			});

			// Initialize the prev & next buttons afterwards since they like to disappear otherwise
			imageElements.find('.slides').each(function () {
				var slideSet = $(this);
				slideSet.trigger("configuration", {
					next: {
						button: slideSet.parent().parent().find('.nextBtn')
					},
					prev: {
						button: slideSet.parent().parent().find('.previousBtn')
					}
				});
			});
		}, 1000);
	});
}