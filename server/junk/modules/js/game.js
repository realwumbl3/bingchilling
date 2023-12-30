class game_constructor {
	constructor() {
		// this.agent = navigator.userAgent.indexOf("Chrome") > -1 ? "Chrome" : navigator.userAgent.indexOf("Firefox") > -1 ? "Firefox" : "Chrome";

		// this.PACKS = {};

		// this.FIRST_PACK = pageData.packs[0];

		// this.video_editor = new video_creator_class(this);

		// this.fetch_pack(this.FIRST_PACK);

		// this.init = true;

		// this.cached_audio_player = new cached_audio("/static/bingchilling/dev/sounds/");

		// this.cached_video_player = new cached_video(this);

		// this.main();
	}

	// async first_load(pack_name) {
	// 	await this.select_pack(pack_name);
	// 	this.bind_events();
	// 	this.init = false;
	// }

	main() {
		// this.always_win = false;

		// this.scrollable_screen = document.getElementById("scrollable_screens");

		// this.main_container = document.getElementById("main");

		// this.game_container = document.getElementById("game");

		// this.game_bg_container = document.getElementById("game_bg_container");

		// this.mobile = typeof window.orientation !== "undefined";

		// window.addEventListener("load", () => {
		// 	this.scrollable_screen.style.opacity = 1;
		// });

		// this.VIDEOS = {};

		// this.SOUNDS = ["reverb_fart.mp3", "pussy.mp3", "reverb_fart_alt.mp3", "pussy2.mp3", "duck_fart.mp3"];

		// this.current_sound_index = 0;

		// this.hit_helper_mode = this.mobile ? "easy" : "hard";

		// this.hit_helper = {
		// 	easy: {
		// 		animationDuration: 800,
		// 		handicapBuffer: 150,
		// 	},
		// 	hard: {
		// 		animationDuration: 600,
		// 		handicapBuffer: 0,
		// 	},
		// };

		// this.PLAYING_VIDEOS = [];

		// this.current_volume = 0.4;

		// this.clip_drop_container = newElement({
		// 	cls: "clip_drop_container",
		// });

		// this.hit_combo_count = newElement({
		// 	type: "b",
		// 	cls: "fart_streek_combo_count",
		// });

		// this.hit_combo_indicator = newElement({
		// 	type: "o",
		// 	cls: "fart_streek_combo_indicator",
		// 	inner: "COMBO!!!",
		// });

		// this.combosaver_ctn = newElement({
		// 	cls: "runsaver_container",
		// });

		// this.score_exp = newElement({
		// 	cls: "score_exp",
		// 	append: [this.hit_combo_indicator, this.combosaver_ctn],
		// });

		// this.hit_score_dom = newElement({
		// 	type: "a",
		// 	cls: "hit_score",
		// });

		// this.score = newElement({
		// 	cls: "fart_streek_score",
		// 	append: [this.hit_combo_count, this.score_exp, this.hit_score_dom],
		// });

		// this.highscore_dom = newElement({
		// 	cls: "fart_streek_high_score",
		// 	inner: "Highscore: 0",
		// });

		// this.logo = newElement({
		// 	id: "game_logo",
		// });

		// this.game = newElement({
		// 	cls: "fart_streek_game",
		// 	append: [this.score, this.highscore_dom],
		// });

		// this.game_container.append(this.clip_drop_container, this.game, this.logo);

		// this.streek = 0;

		// this.hit_score = 0;

		// this.highscore = 0;
		// this.last = null;

		// this.think_fast = null;
		// this.think_fast_switch = false;

		// this.keypressable_keys = ["Space"];

		// this.game_hit = (e) => {
		// 	this.click_hit();

		// 	window.removeEventListener("keyup", this.game_hit);
		// };

		// this.COOLDOWN_DURATION = 90;

		// this.cooldown = null;

		// this.debug_click = false;

		// this.debug_console = true;

		// this.time_scale = 1;

		// this.default_combo_font_size = 10;

		// this.update_hit_combo_count(this.rnd_emoji_string());

		// this.set_logo_position({ _bottom: "unset", _top: 5 + "%", _x: 0 + "%", _y: 0 + "%", _z: 20, _width: 50 });

		// this.dont_remove_videos = false;

		// this.camera_moving = true;

		// this.PER_TARGET = "clip";

		// this.game_container._default_camera = {
		// 	_tx: 0,
		// 	_ty: 0,
		// 	_tz: 0,
		// 	_s: 1,
		// 	_rx: 0,
		// 	_ry: 0,
		// 	_rz: 0,
		// 	_px: 50,
		// 	_py: 50,
		// 	_pz: 1000,
		// 	_ox: 50,
		// 	_oy: 50,
		// };

		// Object.assign(this.game_container, this.game_container._default_camera);

		// this.TARGET_CLIP;

		// this.reset_game_rotate();
	}

	bind_events() {
		if (this.mobile) {
			this.main_container.addEventListener("touchstart", this.click_hit);
		} else {
			this.main_container.addEventListener("mousedown", this.click_hit);
		}

		window.addEventListener("keydown", (e) => {
			if (e.code === "Space") e.preventDefault();

			// if (e.code === "KeyO") {
			// 	new_game_engine.combosaver("add_heart");
			// 	return;
			// }

			if (e.code === "KeyP") {
				this.drop_all_videos_to_background();
				this.drop_new_video();
				this.streek = 2;
				this.random_game_rotate();
				this.update_hit_combo_count("P");
				return;
			}

			if (!this.keypressable_keys.includes(e.code) && !["Num", "Key"].includes(e.code.slice(0, 3))) return;

			window.addEventListener("keyup", this.game_hit);
		});
	}

	current_sound = () => this.SOUNDS[this.current_sound_index];

	next_sound = () => {
		this.current_sound_index++;
		if (this.current_sound_index > this.SOUNDS.length - 1) this.current_sound_index = 0;
		return this.SOUNDS[this.current_sound_index];
	};

	coin_toss = () => Math.floor(Math.random() * 2).toString();

	sfx(sound_obj) {
		this.cached_audio_player.play(sound_obj);
	}

	// get_time_scale = (whatever_variable) => whatever_variable * 1;

	invert = () => this.game_container.classList.toggle("inverted");


	rnd_emoji() {
		if (this.streek < 1) {
			this.update_hit_combo_count(this.rnd_emoji_string());
		} else {
			this.update_hit_combo_count(this.streek);
		}
	}

	// cool_down = () => {
	// 	if (this.cooldown) return true;
	// 	else
	// 		this.cooldown = setTimeout(() => {
	// 			this.cooldown = null;
	// 		}, this.COOLDOWN_DURATION);
	// 	return false;
	// };

	// combosaver(action) {
	// 	switch (action) {
	// 		case "add_heart":
	// 			let new_heart = this.new_heart();
	// 			this.combosaver_ctn.prepend(new_heart);
	// 			break;
	// 		case "check":
	// 			if (this.combosaver_ctn.childElementCount > 0) {
	// 				this.combosaver_ctn.firstChild.remove();
	// 				return true;
	// 			}
	// 			return false;
	// 		default:
	// 			break;
	// 	}
	// }

	new_heart = () => {
		return newElement({
			cls: "combosaver_heart",
		});
	};

	click_hit = () => {
		// if (this.cool_down()) return;

		let new_random,
			video_hit = this.scan_hits();

		if (this.PLAYING_VIDEOS.length > 0 && video_hit) {
			new_random = this.last;
		} else {
			new_random = this.coin_toss();
		}

		if (!this.last) {
			this.sfx(this.current_sound());
			return (this.last = new_random);
		}

		if (this.last === new_random || this.always_win) {
			this.streek_progress();
		} else {
			this.streek_broken();
		}

		this.last = new_random;

		let hit_score = this.hit_score > 0 ? "Hit Score: " + this.hit_score.toString() : "";

		this.hit_score_dom.innerHTML = hit_score;

		if (this.streek > this.highscore) {
			alertFx({ message: `${this.streek}! A NEW RECORD!!`, alert_name: "newrecord" });
			this.cached_audio_player.play("wow.mp3");
			this.highscore = this.streek;
			this.highscore_dom.innerHTML = "High Streak: " + this.highscore.toString() + " " + hit_score;
		}

		if (this.streek > 1) {
			let tens = Math.ceil(this.streek / 10);

			// if (this.streek % 10 === 0) {
			// 	this.combosaver("add_heart");
			// }

			this.hit_combo_indicator.style.opacity = 1;
			this.hit_combo_indicator.style.letterSpacing = 0 + "ch";
		} else {
			this.hit_combo_indicator.style.letterSpacing = -1 + "ch";
			this.hit_combo_indicator.style.opacity = 0;
		}

		if (this.streek < 1) this.game_margin_offset(0, 0);

		if (this.streek > 1) this.drop_new_video();

		this.rnd_emoji();
	};

	// streek_progress = () => {
	// 	this.streek += 1;
	// 	this.sfx(this.current_sound());
	// 	this.random_game_rotate();
	// };

	streek_broken = () => {
		// if (this.combosaver("check")) {
		// 	return this.streek_progress();
		// }

		this.game_container.classList.toggle("inverted");
		this.streek = 0;
		this.hit_score = 0;
		setTimeout(() => {
			if (this.PLAYING_VIDEOS.length < 1) this.reset_game_rotate();
		}, 300);
		this.sfx(this.next_sound());
	};

	scan_hits() {
		let hit = false;
		this.PLAYING_VIDEOS.forEach((video_clone) => {
			let try_hit = this.hit(video_clone);
			if (try_hit) hit = video_clone;
		});
		return hit;
	}

	hit = (video) => {
		if (video._disconnect) return false;

		if (!video?.start_play) return false;

		video.hit_time = new Date().getTime();

		video.since_videostart_hit_ms = video.hit_time - video.start_play;

		this.drop_all_videos_to_background(video);

		if (video.since_videostart_hit_ms <= video.start_ms) {
			if (video.start_ms - video.since_videostart_hit_ms < 10) {
				// video.hit
				return this.good_hit(video);
			}
			return this.miss(video);
		}

		if (video.since_videostart_hit_ms >= video.end_ms) {
			return this.miss(video);
		}

		return this.good_hit(video);
	};

	update_ms_count = (ms_count, text) => {
		ms_count.innerHTML = text;
		ms_count.style.opacity = 1;

		alertFx({ message: text, alert_name: "ms_count" });
	};

	good_hit = (video) => {
		let react_target = video.start_play + video.start_ms;
		let react_target_end = video.start_play + video.end_ms;

		let nearness = video.hit_time - react_target;

		if (!this.debug_click) {
			this.update_ms_count(video.ms_count, `HIT!!!<br>:D REACTED IN ${nearness} MS!`);
		}

		// VID HIT HELPER
		video.hit_helper.classList.add("hit_helper_flicker");

		if (nearness < 0) {
			if (nearness > -10) {
				this.hit_score += 500;
				video.hit_helper.style.borderColor = "pink";
			}
		} else if (nearness <= 3) {
			this.hit_score += 3000;
			video.hit_helper.style.borderColor = "fuchsia";
		} else if (nearness <= 25) {
			this.hit_score += 1250;
			video.hit_helper.style.borderColor = "lime";
		} else if (nearness <= 60) {
			this.hit_score += 750;
			video.hit_helper.style.borderColor = "green";
		} else if (nearness <= 100) {
			this.hit_score += 250;
			video.hit_helper.style.borderColor = "yellow";
		} else {
			this.hit_score += 250;
			video.hit_helper.style.borderColor = "orange";
		}

		video.hit_state = "unhit";

		video._disconnect = true;

		return video;
	};

	miss = (video) => {
		video.since_videostart_hit_ms = video.hit_time - video.start_play;

		video.hit_state = "missed";

		video._disconnect = true;

		video.hit_helper.style.animationPlayState = "paused";

		if (video.since_videostart_hit_ms < video.start_ms) {
			video.hit_helper.style.borderColor = "orange";

			let miss_diff = video.start_ms - video.since_videostart_hit_ms;

			this.update_ms_count(video.ms_count, "TOO EARLY!!!<br> -" + miss_diff + "MS");
		} else if (video.since_videostart_hit_ms > video.end_ms) {
			this.hit_score -= 250;

			video.hit_helper.style.borderColor = "red";

			let miss_diff = video.since_videostart_hit_ms - video.end_ms;

			this.update_ms_count(video.ms_count, "TOO LATE!!!<br>MISSED BY " + miss_diff + "MS");
		}

		this.remove_video(video);

		return false;
	};

	random_pos(video) {
		let random_w = Math.floor(40 + 10 * Math.random());
		let _ran_x = ranP();
		let _ran_y = ranP();
		let _m = Math.floor((random_w / 100) * random_w);

		Object.assign(video, {
			_ran_x,
			_ran_y,
			// rotation
			_r: 0,
			// width
			_w: random_w,
			// margin
			_m,
			// x-y-axis
			_x: this.calc_offset_100(40, _ran_x) - _m,
			_y: this.calc_offset_100(30, _ran_y) - _m,
			// transform x-y-z-axis
			_tx: 0,
			_ty: 0,
			_tz: Math.floor(75 + 50 * ran()),
		});
		return video;
	}

	update_video_transform(video) {
		let new_trans = "translate3D(" + video._tx + "%, " + video._ty + "%," + video._tz + "px)rotate3D(0,0,1," + video._r + "deg)";
		// console.log(video.file_name + " new transform:" + new_trans + " cord x,y,w:" + video._x + " , " + video._y + " , " + video._w)
		video.style.transform = new_trans;
	}

	//##############################################

	drop_all_videos_to_background = () => {
		for (let video of this.PLAYING_VIDEOS) this.drop_video_to_background(video);
	};

	drop_video_to_background = (video) => {
		video._tz = 0;
		video.style.transition = "transform .5s ease";
		window.clearTimeout(video?.invert_timeout);
		this.update_video_transform(video);
	};

	lower_existing_volumes() {
		for (let video of this.PLAYING_VIDEOS) video.video.volume /= 2;
	}

	//##############################################

	first_clip() {
		return this.PLAYING_VIDEOS[0];
	}

	focus_first_clip() {
		this.TARGET_CLIP = this.first_clip();
	}

	target_clip(target) {
		if (this.TARGET_CLIP === target) return;
		this.TARGET_CLIP = target;
	}

	focus_on_target = () => {
		let target = this.TARGET_CLIP;
		switch (this.PER_TARGET) {
			case "game":
				this.update_camera_transform(this.game_container._default_camera);
				break;
			case "clip":
				// console.log('FOT - target_cord',)
				let new_camera_perspective = [target._ran_x * -40, target._ran_y * -20];
				// console.log('x:', new_camera_perspective[0], 'y:', new_camera_perspective[1])
				this.update_camera_transform({
					_tx: new_camera_perspective[0] + "%",
					_ty: new_camera_perspective[1] + "%",
				});
				this.set_logo_position({
					_top: target._ran_y < 0 ? 5 + "%" : 75 + "%",
					_width: 50,
					_z: 20,
					_r: 0,
					_rx: 0,
				});
				break;
		}
	};

	calc_offset_100(range, intensity) {
		return Math.floor(50 + range * intensity);
	}

	// update_camera_transform(assign) {
	// 	if (assign) Object.assign(this.game_container, assign);
	// 	let g = this.game_container;

	// 	let new_trans = "translate3D(" + g._tx + "," + g._ty + "," + g._tz + "px)scale(" + g._s + ")";
	// 	let new_rotate = "rotateX(" + g._rx + "deg)rotateY(" + g._ry + "deg)rotateZ(" + g._rz + "deg)";

	// 	let new_origin_zy = g._ox + "% " + g._oy + "%";

	// 	let new_perspective_xy = g._px + "% " + g._py + "%";
	// 	let new_perspective_z = g._pz + "px";

	// 	g.style.perspectiveOrigin = new_perspective_xy;
	// 	g.style.perspective = new_perspective_z;
	// 	g.style.transform = new_trans + new_rotate;
	// 	g.style.transformOrigin = new_origin_zy;
	// }



	// reset_game_rotate() {
	// 	this.game_container.style.borderRadius = 10 + "vh";
	// 	this.update_camera_transform({
	// 		_tx: 0 + "%",
	// 		_ty: 0 + "%",
	// 		_tz: -100,
	// 		_rx: 0,
	// 		_ry: 0,
	// 		_rz: 0,
	// 	});
	// 	this.game_margin_offset(0, 0);
	// 	this.set_logo_position({ _top: 5 + "%", _width: 50, _y: 0 + "%", _z: 20, _r: 0, _rx: 0 });
	// }

	set_logo_position({ ...u } = {}) {
		Object.assign(this.logo, u);
		Object.assign(this.logo.style, {
			top: this.logo._top,
			bottom: this.logo._bottom,
			transform: `translate3d(${this.logo._x},${this.logo._y},${this.logo._z}px)
                        ${this.logo?._r ? `rotate3D(${this.logo._rx | 0},${this.logo._ry | 0},${this.logo._rz | 0},${this.logo._r}deg)` : ""}`,
			width: "min(" + this.logo._width + "vw, " + this.logo._width + "vh)",
		});
	}

	game_margin_offset(offset_x, offset_y) {
		this.game_container.style.marginLeft = offset_x + "vw";
		this.game_container.style.marginTop = offset_y + "vw";
	}
}
