class Packs {
	constructor() {}

	async select_pack(pack_name) {
		this.VIDEOS = this.PACKS[pack_name];
		let pack_clip_count = Object.keys(this.VIDEOS).length;

		this.loaded_pack_name = pack_name;
		this.video_editor.init();
		alertFx({ message: 'PRELOADING "' + pack_name + '" clips.', dur: 99999999999999, alert_name: "PRELOADING" });
		await this.cached_video_player.preload_pack(Object.keys(this.VIDEOS));
		alertFx({ message: `Successfully loaded "${pack_name}" pack. (${pack_clip_count} clips.)`, alert_name: "PRELOADING" });
	}

	fetch_pack(pack_name, init) {
		fetch(`${window.origin}/static/bingchilling/dev/packs/${pack_name}/_clips.json`, {
			headers: {
				"Cache-Control": "no-cache",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				let pack_clip_count = Object.keys(data?._SOLO).length;
				if (pack_clip_count > 0) {
					this.PACKS[pack_name] = data._SOLO;
					console.log("load solo", data._SOLO);
				} else {
					console.log("load full", data.CLIPS);
					this.PACKS[pack_name] = data.CLIPS;
				}

				console.log(`Downloaded "${pack_name}" pack from server.  clips:`, data);
				if (this.init) this.first_load(pack_name);
			});
	}
}
