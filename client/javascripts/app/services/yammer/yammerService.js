PulseApp.factory('yammerService', function ($resource) {
	
	var yammerService = {
		pollingCounter: 1,
		allCompanyGroup: { Id: -1, Name: 'All Company', PictureUrl: '', Description: '' },
		baseYammerServiceUrl: 'https://www.yammer.com/api/v1/',
		baseYammerFilesUrl: 'https://files.yammer.com/v2/',
		baseYammerUrl: 'https://www.yammer.com/',
		users: [],
		groups: []
	};

	yammerService.connect = function(loginButton, success) {
		yam.connect.loginButton(loginButton, function (resp) {
			if (resp.authResponse) {
				yammerService.authToken = resp.access_token.token;
				success();
			}
		});
	};
	//yam.platform.request(url, method, data);	https://assets.yammer.com/assets/platform_js_sdk.js
	yammerService.getFullFeed = function(success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages/my_all.json?threaded=extended&exclude_own_messages_from_unseen=true",
			method: "GET",
			success: function(result) { success(result); },
			error: function(error) { console.log(error); }
		});
	};

	yammerService.getThread = function (threadId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages/in_thread/" + threadId + ".json?threaded=extended",
			method: "GET",
			success: function (result) { success(result); },
			error: function(error) { console.log(error); }
		});
	};

	yammerService.getThreadOlder = function(oldestMessageId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages.json?threaded=extended&older_than=" + oldestMessageId,
			method: "GET",
			success: function(result) { success(result); },
			error: function(error) { console.log(error); }
		});
	};

	yammerService.getThreadNewer = function (newestMessageId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages.json?newer_than=" + newestMessageId,
			method: "GET",
			success: function (result) { success(result); },
			error: function (error) { console.log(error); }
		});
	};

	yammerService.startPolling = function (success) {
		$resource(yammerService.realtimeInfo.uri + "handshake", {}, { query: { method: 'POST', isArray: true } }).query(
			[{
				"ext": { "token": yammerService.authToken, "auth": "oauth" },
				"version": "1.0",
				"minimumVersion": "0.9",
				"channel": "/meta/handshake",
				"supportedConnectionTypes": ["long-polling"],
				"id": yammerService.pollingCounter++
			}],
			function (result) {
				if (result.length > 0 && result[0].successful) {
					yammerService.pollingInfo = result[0];

					$resource(yammerService.realtimeInfo.uri, {}, { query: { method: 'POST', isArray: true } }).query(
						[{
							"channel": "/meta/subscribe",
							"subscription": "/feeds/" + yammerService.realtimeInfo.channel_id + "/primary",
							"id": yammerService.pollingCounter++,
							"clientId": yammerService.pollingInfo.clientId
						}, {
							"channel": "/meta/subscribe",
							"subscription": "/feeds/" + yammerService.realtimeInfo.channel_id + "/secondary",
							"id": yammerService.pollingCounter++,
							"clientId": yammerService.pollingInfo.clientId
						}],
						function (r) {
							if (r.length > 0 && r[0].successful)
								success();
							else
								console.log(r);
						},
						function (error) {
							console.log(error);
						});

				} else
					console.log(result);
			}, function (error) {
				console.log(error);
			});
	};

	yammerService.longPoll = function (success) {
		$resource(yammerService.realtimeInfo.uri, {}, { query: { method: 'POST', isArray: true } }).query(
			[{
				"channel": "/meta/connect",
				"connectionType": "long-polling",
				"id": yammerService.pollingCounter++,
				"clientId": yammerService.pollingInfo.clientId
			}],
			function (result) {
				if (result.length > 0 && result[result.length - 1].successful) {
					if (result[0].data && result[0].data.data && result[0].data.data.messages) {
						success(result[0].data.data);
					}
					yammerService.longPoll(success);
				} else
					console.log(result);
			},
			function (error) {
				console.log(error);
			});
	};

	yammerService.getMessage = function(messageId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages/" + messageId + ".json",
			method: "GET",
			success: function(result) { success(result); }
		});
	};

	yammerService.unfollowMessage = function (threadId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "threads/" + threadId + "/follow.json",
			method: "DELETE",
			error: function () { success(); }
		});
	};

	yammerService.deleteMessage = function (messageId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages/" + messageId,
			method: "DELETE",
			error: function () { success(); }
		});
	};
	
	yammerService.likeMessage = function (messageId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages/liked_by/current.json?message_id=" + messageId,
			method: "POST",
			error: function() { success(); }
		});
	};
	
	yammerService.unlikeMessage = function (messageId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages/liked_by/current.json?message_id=" + messageId,
			method: "DELETE",
			error: function () { success(); }
		});
	};
	
	yammerService.showMore = function (threadId, olderThanMessageId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages/in_thread/" + threadId + ".json?older_than=" + olderThanMessageId,
			method: "GET",
			success: function (result) { success(result); },
			error: function (error) { console.log(error); }
		});
	};

	yammerService.showLess = function(threadId, success) {
		yammerService.getThread(threadId, success);
	};

	yammerService.getUser = function (userId, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "users/" + userId + ".json",
			method: "GET",
			success: function (result) { success(result); },
			error: function (error) { console.log(error); }
		});
	};

	yammerService.post = function (body, groupId, replyToMessageId, attachements, notifyUsers, linkUrl, topicNames, success) {
		var data = { body: HtmlEncode(body), group_id: groupId, replied_to_id: replyToMessageId, attached_objects: attachements, cc: notifyUsers, og_url: linkUrl };

		if (topicNames) {
			for (var i = 0; i < topicNames.length; i++) {
				data["topic" + i] = topicNames[i];
			}
		}

		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages.json",
			method: "POST",
			data: data,
			success: function (result) {
				success(result);
			},
			error: function (error) {
				console.log(error);
			}
		});

	};

	yammerService.autoComplete = function (text, types, success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "autocomplete/ranked",
			method: "GET",
			data: { prefix: text, models: types },
			success: function(result) {
				success(result);
			},
			error: function(error) {
				console.log(error);
			}
		});
	};

	yammerService.getOpenGraph = function(url, success, error) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "open_graph_objects/update",
			method: "PUT",
			data: { url: url },
			success: function(result) {
				success(result);
			},
			error: function (result) {
				console.log(result);
				if (error)
					error(result);
			}
		});
	};
	
	yammerService.uploadFile = function (file, progress, success) {
		var request = new XMLHttpRequest();

		request.upload.addEventListener('progress', function (e) {
			progress(e);
		}, false);

		request.addEventListener("loadend", function (e) {
			success(request.responseText);
		}, false);

		request.open('POST', yammerService.baseYammerFilesUrl + 'files?access_token=' + yammerService.authToken);
		
		var data = new FormData();
		data.append('file', file);
		request.send(data);
	};
	
	yammerService.removeFile = function (fileId) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "uploaded_files/" + fileId,
			method: "DELETE"
		});
	};

	yammerService.getNotifications = function(success) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "streams/notifications.json",
			method: "GET",
			success: function(result) { success(result); },
			error: function(result) { console.log(result); }
		});
	};
	
	yammerService.setLastSeenMessage = function(messageId) {
		yam.request({
			url: yammerService.baseYammerServiceUrl + "messages/last_seen",
			data: { message_id: messageId },
			method: "POST"
		});
	};

	return yammerService;
});