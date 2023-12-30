import zyX, { html, css } from "https://zyx.wumbl3.xyz/v:1.4/";

class ClickClip {
	constructor() {}

	async create_video() {
		let random_video_file = Object.keys(this.VIDEOS)[Math.floor(Math.random() * Object.keys(this.VIDEOS).length)];

		let random_video = this.VIDEOS[random_video_file];

		let video = newElement({
			type: "video",
		});

		video.src = await this.cached_video_player.load(random_video_file);

		let video_container_element = newElement({
			type: "div",
			cls: "drop_clip_video_container",
			append: [video],
		});

		let hit_helper = newElement({
			type: "div",
			cls: "hit_helper",
		});

		let ms_count = newElement({
			type: "div",
			cls: "ms_count",
		});

		let clip = newElement({
			cls: "drop_clip",
			type: "div",
			append: [video_container_element, hit_helper, ms_count],
		});

		clip.video = video;

		clip.file_name = random_video_file;

		clip.ms_count = ms_count;

		clip.random_video = random_video;

		clip.hit_state = false;

		clip._disconnect = false;

		clip.hit_helper = hit_helper;

		clip.hit_difficulty = this.hit_helper[this.hit_helper_mode];

		clip.start_ms = this.get_time_scale(random_video.start_ms);

		clip.end_ms = this.get_time_scale(random_video.start_ms + random_video.window_ms) + clip.hit_difficulty.handicapBuffer;

		clip.video.addEventListener("canplay", (e) => {
			clip.video.playbackRate = this.time_scale;

			clip.video.volume = this.current_volume;

			if (clip.random_video?.volume_red) clip.video.volume = clip.random_video?.volume_red * this.current_volume;

			clip.video.play();
		});

		clip.video.addEventListener("play", (e) => {
			clip.start_play = new Date().getTime();
			clip.length = this.get_time_scale(e.target.duration * 1000);
			clip.react_target = clip.start_play + clip.start_ms;
			clip.react_target_end = clip.start_play + clip.end_ms;

			this.play_video(clip);
		});

		return clip;
	}

	remove_video(video) {
		if (!this.dont_remove_videos) this.PLAYING_VIDEOS = this.PLAYING_VIDEOS.filter((item) => item !== video);
		for (let timeOut of [video?.hit_helper_timeout, video?.remove_timeout, video?.invert_timeout]) window.clearTimeout(timeOut);

		video.remove_timeout = setTimeout(() => {
			video.ms_count.style.opacity = 0;

			let volume = video.video.volume;
			let volume_decline = setInterval(() => {
				if ((volume *= 0.8) < 0.01) window.clearInterval(volume_decline);
				video.video.volume = volume;
			}, 125);

			video.hit_helper.style.animationPlayState = "running";
			video.hit_helper.style.animationName = "hit_helper_kf_bye";
			video.hit_helper.style.animationDuration = this.get_time_scale(video.hit_difficulty.animationDuration / 2) + "ms";

			if (this.dont_remove_videos) return;
			video.video.style.opacity = 0;
			video.hit_helper.classList.remove("hit_helper_flicker");

			video.remove_timeout = setTimeout(() => {
				video.remove();
			}, this.get_time_scale(video.hit_difficulty.animationDuration / 2));
		}, 3000);
	}

	async drop_new_video() {
		let video = await this.create_video();

		this.PLAYING_VIDEOS.unshift(video);

		video = this.random_pos(video);

		video.style.setProperty("--place_width", video._w + "vw");
		video.style.setProperty("--place_height", video._w + "vh");
		video.style.setProperty("--place_top", video._y + "%");
		video.style.setProperty("--place_left", video._x + "%");

		this.lower_existing_volumes();

		this.focus_first_clip();

		this.focus_on_target();

		this.update_video_transform(video);

		this.clip_drop_container.append(video);

		setTimeout(() => {
			// _frame()
			video.style.opacity = 1;
		}, 1);
	}

	play_video(video) {
		let hit_animationDuration = this.get_time_scale(video.hit_difficulty.animationDuration);

		// VID HIT HELPER
		video.hit_helper_timeout = setTimeout(() => {
			video.hit_helper.style.animationName = ran() > 0.5 ? "hit_helper_rotate_b" : "hit_helper_rotate_a";

			video.hit_helper.style.animationDuration = hit_animationDuration + "ms";
		}, video.start_ms - hit_animationDuration);

		video.remove_timeout = setTimeout(() => {
			this.remove_video(video);
		}, video.length);

		video.invert_timeout = setTimeout(() => {
			this.invert();
			video.invert_timeout = setTimeout(() => {
				// TOO LATE MISS
				if (video.hit_state !== "hit") {
					video.ms_count.style.opacity = 1;
					video.ms_count.innerHTML = "TOO SLOW!!!";
					video.hit_helper.style.borderColor = "red";

					setTimeout(() => {
						if (this.dont_remove_videos) return;
						video.video.style.opacity = 0;
						setTimeout(() => {
							video.remove();
						}, this.get_time_scale(video.hit_difficulty.animationDuration / 2));
					}, 1500);
				}

				this.invert();
			}, video.end_ms - video.start_ms);
		}, video.start_ms);
	}
}
