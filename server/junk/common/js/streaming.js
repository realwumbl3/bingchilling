class streamingclass {
	constructor() {
		this.connected;
		this.connection = null;
		this.room;
	}

	preset(preset) {
		let functions, room;
		switch (preset) {
			case "tweetdeckJson":
				(room = "tweetdeckJson"),
					(functions = {
						status: (response) => {
							this.alert(response);
						},
						listeners: {
							newTweet: (response) => {
								artDeckWebSocket.artDeckJson(response);
							},
							debugSocket: (response) => {
								console.log(response);
							},
						},
						after: (socket) => {
							if (typeof activity_sync == "object") activity_sync.listen(socket);
						},
						connect: this.tweetdeckConnect,
						disconnect: this.tweetdeckDisconnect,
					});
				break;
			case "tweetdeckJsonDebug":
				(room = "tweetdeckJson"),
					(functions = {
						status: (response) => {
							this.alert(response);
						},
						listeners: {
							newTweet: (response) => {
								try {
									debugJson(response);
								} catch (e) {
									console.log("Debug Json Error: ", e.message);
								}
							},
						},
						after: (socket) => {
							if (typeof listenforActivity == "function") listenforActivity(socket);
						},
					});
				break;
			case "idfntTweets":
				room = "tweetDeck";
				functions = {
					status: (response) => {
						this.alert("tweetdeck " + response);
					},
					listeners: {
						newTweet: (data) => {
							this.newTweet(data);
						},
						preTweet: (data) => {},
					},
				};
				break;
			case "uploadStream":
				room = idfnt.content_path;
				functions = {
					status: (response) => {
						this.alert(response);
					},
					listeners: {
						newUpload: (data) => {
							this.newItem(data);
						},
					},
				};
				break;
			default:
				room = preset;
				functions = {
					status: (response) => {
						this.alert("default " + response);
					},
					listeners: {
						newItem: (data) => {
							this.newItem(data);
							console.log("newItem Received: ", data);
						},
					},
				};
				break;
		}
		this.connection = this.connect(room, functions);
	}

	connect(roomCode, functions) {
		if (this.connection !== null) this.disconnect();
		let streamSocket = io.connect(`${window.origin}/dataStream`);
		this.room = roomCode;

		streamSocket.on("connect", () => {
			if (typeof functions.connect === "function") return functions.connect(streamSocket);
			this.defaultConnect(streamSocket);
		});

		streamSocket.on("disconnect", () => {
			if (typeof functions.disconnect === "function") return functions.disconnect(streamSocket);
			this.defaultDisconnect(streamSocket);
		});

		streamSocket.on("status", (response) => {
			functions.status(response["msg"]);
		});

		for (let listener of Object.entries(functions.listeners)) {
			streamSocket.on(listener[0], (response) => {
				listener[1](response);
			});
		}

		if (functions.after) {
			functions.after(streamSocket);
		}
		return streamSocket;
	}

	defaultConnect = (streamSocket) => {
		streamSocket.emit("enter", { roomCode: this.room });
		this.connected = true;
	};

	defaultDisconnect = (streamSocket) => {
		streamSocket.emit("leave", { roomCode: this.room });
		this.connected = false;
		this.connection = null;
	};

	tweetdeckConnect = (streamSocket) => {
		connectionStatus.setConnectionStatus("connected");
		get_missing_tweets();
		if (typeof serverTimeoutAlert === "object") serverTimeoutAlert.reset();
		this.defaultConnect(streamSocket);
	};

	tweetdeckDisconnect = () => {
		connectionStatus.setConnectionStatus("disconnected");
	};

	newItem(data) {
		thumbwall.addThumbViaList(data["items"]);
	}

	newTweet(data) {
		let tweetData = data["data"],
			items = tweetData["items"],
			dateformat = data["targetDate"];
		if (idfnt.content_name !== dateformat) {
			idfnt.jumpPool(dateformat);
		}
		if (idfnt.mergeMode) {
			let newUrls = [];
			for (let item of items) {
				newUrls.unshift(`*TweetDeckLivefeed/!${tweetData["target"]}/${dateformat}/full/${item}`);
			}
			thumbwall.addThumbViaList(newUrls);
		} else {
			if (idfnt.content_path.includes(tweetData["target"])) thumbwall.addThumbViaList(items);
		}
	}

	alert(msg) {
		if (typeof alertFx === "function") alertFx({ message: msg });
		else console.log(msg);
	}

	disconnect() {
		if (this.connection.disconnected === false) {
			this.connection.disconnect();
			this.connected = false;
			this.alert(`Disconnected from ${this.room}.`, 3000, 0, "both");
		} else {
			this.alert("Not currently connected to a room.", 3000, 0, "both");
		}
	}
}
