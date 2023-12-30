class video_creator_class {
	constructor(_engine) {
		this._engine = _engine;

		this.VIDEOS = {};

		this.loaded_asset_data;

		this.video_creator = document.getElementById("video_creator");

		this.creator_player = document.getElementById("creator_player");

		this.info_box = document.getElementById("info_box");

		this.info_text = this.info_box.querySelector("#seek_ms_position");

		this.seek_box = document.getElementById("seek_box");

		this.preview = document.getElementById("preview");

		this.seek_set = 0;

		this.seek = document.getElementById("seek");

		this.current_target = document.getElementById("current_target");

		this.player_pos = document.getElementById("player_pos");

		this.creator_selection = document.getElementById("video_selection");

		this.creator_selection.addEventListener("input", (e) => {
			console.log("e.target.value", e.target.value);
			let asset_name = e.target.value;
			this.load_game_asset({ asset_name: asset_name, ...this.VIDEOS[asset_name] });
		});

		this.seek_box.addEventListener("touchmove", (e) => {
			this.seek_move({
				layerX: e.touches[0].clientX - e.touches[0].target.getBoundingClientRect().left,
				target: e.touches[0].target,
			});
		});

		this.seek_box.addEventListener("mousedown", (e) => {
			this.seek_box.addEventListener("mousemove", this.seek_move);
			this.seek_move(e);
		});

		window.addEventListener("mouseup", () => {
			this.seek_box.removeEventListener("mousemove", this.seek_move);
		});

		this.creator_player.addEventListener("play", (e) => {
			console.log("play");
		});

		this.creator_player.addEventListener("canplay", (e) => {
			this.update_seek();
		});

		this.preview.addEventListener("touchstart", this.start_previewing);

		document.addEventListener("touchend", this.stop_previewing);

		this.preview.addEventListener("mousedown", this.start_previewing);

		document.addEventListener("mouseup", this.stop_previewing);

		this.rel_start_ms = 0;
		this.rel_len = 0;

		this.pos_animating = false;
	}

	stop_previewing = () => {
		this.creator_player.pause();
		this.pos_animating = false;
		this.creator_player.currentTime = this.seek_set;
	};

	start_previewing = () => {
		this.creator_player.currentTime = this.seek_set;
		this.creator_player.playbackRate = 0.3;
		this.creator_player.play();
		this.start_animating_pos();
	};

	init() {
		this.VIDEOS = this._engine.VIDEOS;

		this.creator_selection.append(
			newElement({
				type: "option",
				attr: {
					value: "SELECT VIDEO",
				},
				inner: "SELECT VIDEO",
			})
		);

		for (let [video, data] of Object.entries(this.VIDEOS)) {
			let new_selection = newElement({
				type: "option",
				attr: {
					value: video,
				},
				inner: video,
			});
			new_selection.video = data;
			this.creator_selection.append(new_selection);
		}
	}

	start_animating_pos = () => {
		this.pos_animating = true;
		const _frame = () => {
			try {
				this.animate_seek_pos();
			} catch {}
			if (this.pos_animating) window.requestAnimationFrame(_frame);
		};
		_frame();
	};

	animate_seek_pos = () => {
		this.player_pos.style.left = 100 * (this.creator_player.currentTime / this.creator_player.duration) + "%";
	};

	update_seek = () => {
		let duration_ms = Math.floor(this.creator_player.duration * 1000);

		this.rel_start_ms = this.loaded_asset_data.start_ms / duration_ms;
		this.rel_len = this.loaded_asset_data.window_ms / duration_ms;

		this.current_target.style.left = this.rel_start_ms * 100 + "%";
		this.current_target.style.width = this.rel_len * 100 + "%";

		this.info_text.innerText = "Seek: " + Math.floor(this.creator_player.currentTime * 1000) + "MS";
	};

	seek_move = (e) => {
		let X = e.layerX / e.target.clientWidth;
		let new_duration = this.creator_player.duration * X;
		this.seek.style.width = 100 * X + "%";
		this.creator_player.currentTime = new_duration;
		this.seek_set = new_duration;
		this.update_seek();
	};

	async load_game_asset(asset_data) {
		this.loaded_asset_data = asset_data;
		this.loaded_asset_data.start_s = asset_data.start_ms / 1000;
		console.log("this.loaded_asset_data", this.loaded_asset_data);
		await this.load(asset_data.asset_name);
	}

	async load(src) {
		this.info_text.innerText = "Seek video to see timestamp.";
		this.seek.style.width = 0 + "%";

		// this.seek_set = 0

		this.creator_player.src = await this._engine.cached_video_player.load(src);

		this.creator_player.load();

		this.seek_set = this.loaded_asset_data.start_s;

		this.creator_player.currentTime = this.loaded_asset_data.start_s;

		this.update_seek();
	}
}
