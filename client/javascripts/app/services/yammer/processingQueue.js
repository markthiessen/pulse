PulseApp.factory('processingQueue', function ($timeout) {
	var processingQueue = { yammerQueryDelay: 3000 }; //Yammer limits # of requests per second

	processingQueue.addItem = function (queue, item) {
		if (!queue.items)
			queue.items = [];
		queue.items.push(item);
	};

	processingQueue.startQueueIfNeeded = function (queue, processQueveItem, finish) {
		if (queue.items.length > 0) {
			if (!queue.isQueueRunning) {
				queue.isQueueRunning = true;
				processQueveItem(queue.items[0]);
				queue.items.splice(0, 1);
			}
		} else if (finish)
			finish();
	};

	processingQueue.queueItemFinishedProcessing = function (queue, processQueveItem, delay, finish) {
		$timeout(function() {
			queue.isQueueRunning = false;
			processingQueue.startQueueIfNeeded(queue, processQueveItem, finish);
		}, delay ? delay : processingQueue.yammerQueryDelay);
	};

	return processingQueue;
});