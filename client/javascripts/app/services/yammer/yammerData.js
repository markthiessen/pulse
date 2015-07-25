PulseApp.factory('yammerData', function ($rootScope, $timeout, yammerService, yammerMessage, processingQueue) {
	var yammerData = {
		thread: {}, newMessageCount: 0, users: yammerService.users, groups: yammerService.groups,
		refreshQueue: {}, addNewReplyQueue: {},	isAuthenticated: {}, networks: {}
	};

	yammerData.connect = function (loginButton, success) {
		yammerService.connect(loginButton, success);
	};

	yammerData.getAvalibleNetworks = function () {
		yammerService.getNetworkAccessTokens(function(result) {
			yammerData.networks = result;
		});
	};

	yammerData.setCurrentNetwork = function (accessToken) {
		yammerService.setAccessToken(accessToken);
	};
	
	yammerData.refreshFeed = function () {
		if (!yammerData.isRefreshing) {
			yammerData.isRefreshing = true;
			yammerData.setNewMessageCount(0);

			yammerService.getFullFeed(function(result) {
				yammerService.realtimeInfo = result.meta.realtime;
				yammerData.refresh(result, true);
			});
		}
	};

	yammerData.refreshThread = function (threadId) {
		if (!yammerData.isRefreshing) {
			yammerData.isRefreshing = true;
			yammerService.getThread(threadId, function(result) { yammerData.refresh(result, true); });
		}
	};

	yammerData.showOlder = function () {
		yammerData.isRefreshing = true;
		yammerService.getThreadOlder(yammerData.getOldestMessage().MessageId, function (result) {
			yammerData.refresh(result, false);
		});
	};

	yammerData.refresh = function (data, clear) {
		if (clear) {
			yammerService.getUser(data.meta.current_user_id, function(result) {
				yammerData.currentUser = yammerMessage.createUser(result);
				$rootScope.$apply();
			});
			yammerData.thread = { Items: [] };
		}
		yammerData.olderAvailable = data.meta.older_available;

		$.each(data.messages, function (index, value) {
			processingQueue.addItem(yammerData.refreshQueue, { value: value, references: data.references, meta: data.meta, threaded_extended: data.threaded_extended });
		});
		processingQueue.startQueueIfNeeded(yammerData.refreshQueue, yammerData.refreshProcessItem, yammerData.refreshFinished);
	};
	yammerData.refreshProcessItem = function (data) {
		if (!data.value.replied_to_id)
			yammerData.createThread(data.value, data.threaded_extended, data.references, data.meta);
		$rootScope.$apply();
		processingQueue.queueItemFinishedProcessing(yammerData.refreshQueue, yammerData.refreshProcessItem, 100, yammerData.refreshFinished);
	};
	yammerData.refreshFinished = function () {
		for (var i = 0; i < yammerData.thread.Items.length; i++) {
			var thread = yammerData.thread.Items[i];
			if (!thread.newestReply && !thread.MarkedAsNew || thread.newestReply && !thread.newestReply.MarkedAsNew) {
				if (i > 0)
					yammerData.thread.Items[i - 1].IsLastNewMessage = true;
				break;
			}
		}
		$rootScope.$apply();
		yammerData.isRefreshing = false;
	};

	yammerData.createThread = function (messsage, threadedExtended, references, meta) {
		var thread = yammerMessage.create(messsage, references, meta);
		yammerData.thread.Items.push(thread);
		if (threadedExtended) {
			var extended = threadedExtended[thread.ThreadId];
			if (extended && extended.length > 0)
				yammerMessage.addReplies(thread, extended, false, references, meta);
		}
		return thread;
	};
		
	yammerData.updateFeed = function() {
		yammerData.isUpdating = true;
		var markAsRead = function (messages) {
			$.each(messages, function (index, value) {
				value.MarkedAsNew = false;
				value.NumberOfNewReplies = 0;
				value.IsLastNewMessage = false;
				value.UnreadMessageCount = 0;
				if (value.Replies && value.Replies.length > 0)
					markAsRead(value.Replies);
			});
		};
		markAsRead(yammerData.thread.Items);

		yammerService.getThreadNewer(yammerData.getNewestMessage().MessageId, function (result) {
			var messages = [];
			$.each(result.messages, function (index, message) {
				messages.push({ threadId: message.thread_id, message: message, references: result.references, meta: result.meta });
			});
			for (var i = messages.length - 1; i >= 0; i--) {
				if (i == messages.length - 1)
					messages[i].isLast = true;
				processingQueue.addItem(yammerData.addNewReplyQueue, messages[i]);
				processingQueue.startQueueIfNeeded(yammerData.addNewReplyQueue, yammerData.processAddNewReplyQueue, yammerData.updateFinished);
			}
			yammerData.updateNotifications();
			if (messages.length <= 0)
				yammerData.isUpdating = false;
		});
	};
	yammerData.processAddNewReplyQueue = function (data) {
		data.thread = FirstOrDefault(yammerData.thread.Items, function (e) { return e.ThreadId == data.threadId; });
		if (!data.message.replied_to_id) {
			data.thread = yammerMessage.create(data.message, data.references, data.meta);
			data.thread.MarkedAsNew = true;
			yammerData.thread.Items.splice(0, 0, data.thread);
			yammerData.processAddNewReplyQueueItemFinished(data, false, 100);
		}
		else if (!data.thread) {
			yammerService.getThread(data.threadId, function (result) {
				$.each(result.messages, function (index, value) {
					if (!data.replied_to_id)
						data.thread = yammerData.createThread(value, result.threaded_extended, result.references, result.meta);
				});
				yammerData.processAddNewReplyQueueItemFinished(data, true, null);
			});
		} else {
			if (data.thread.NumberOfNewReplies <= 0 && yammerMessage.getTotalNumberOfReplies(data.thread.Replies) > 4) {
				yammerMessage.showLess(data.thread, function() {
					yammerData.processAddNewReplyQueueItemFinished(data, true, null);
				});
			} else
				yammerData.processAddNewReplyQueueItemFinished(data, true, 100);
		}
	};
	yammerData.processAddNewReplyQueueItemFinished = function (data, addReplies, delay) {
		data.thread.IsLastNewMessage = data.thread.IsLastNewMessage || data.isLast;
		data.thread.NumberOfNewReplies++;
		if (data.thread.NumberOfNewReplies <= 1) {
			yammerData.thread.Items.splice($.inArray(data.thread, yammerData.thread.Items), 1);
			yammerData.thread.Items.splice(0, 0, data.thread);
		}
		if (addReplies)
			yammerMessage.addReplies(data.thread, [data.message], true, data.references, data.meta);
		$rootScope.$apply();
		processingQueue.queueItemFinishedProcessing(yammerData.addNewReplyQueue, yammerData.processAddNewReplyQueue, delay, yammerData.updateFinished);
	};
	yammerData.updateFinished = function () {
		yammerData.setNewMessageCount(0);
		yammerData.isUpdating = false;
	};

	yammerData.updateNotifications = function () {
		yammerService.getNotifications(function (result) {
			yammerData.newNotifications = $.grep(result.items, function (i) { return i.unseen; });
			$rootScope.$apply();
		});
	};

	yammerData.startPolling = function () {
		yammerData.isPolling = true;
		yammerService.startPolling(function () {
			yammerData.longPoll();
		});
	};

	yammerData.longPoll = function () {
		yammerService.longPoll(function (result) {
			yammerData.setNewMessageCount(yammerData.newMessageCount + result.messages.length);
		}, function(error){
			yammerData.startPolling();
		});
	};

	yammerData.onPost = function (result, parentMessage) {
		var message = yammerMessage.create(result.messages[0], result.references, result.meta);
		if (parentMessage) {
			parentMessage.IsCurrentUserFollowing = true;
			parentMessage.Replies.push(message);
		} else
			yammerData.thread.Items.splice(0, 0, message);

		yammerData.setNewMessageCount(yammerData.newMessageCount - 1);
	};

	yammerData.setLastSeenMessage = function() {
		yammerService.setLastSeenMessage(yammerData.getNewestMessage().MessageId);
	};

	yammerData.getOldestMessage = function() {
		var oldest = yammerData.thread.Items ? yammerData.thread.Items[yammerData.thread.Items.length - 1] : null;
		if (oldest && oldest.Replies.length > 0)
			oldest = oldest.oldestReply;
		return oldest;
	};

	yammerData.getNewestMessage = function () {
		var newest = yammerData.thread.Items ? yammerData.thread.Items[0] : null;
		if (newest && newest.Replies.length > 0)
			newest = newest.newestReply;
		return newest;
	};

	yammerData.setNewMessageCount = function (count) {
		yammerData.newMessageCount = count;
		$rootScope.yammerNewMsgCount = count;
	};

	return yammerData;
});