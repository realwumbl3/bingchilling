class clip_animator_constructor {
	constructor() {}

	rotate_to_zero() {
		let wise = ran();

		let video_max_rotate = 30;

		let video_rotate = wise ? video_max_rotate : -video_max_rotate;

		let _damp = 500;

		let frame_number = 0;

		let _frame = () => {
			frame_number++;
			_either_place += _anim_dir * Math.max(0, _damp-- / 100);

			video.style.setProperty("--place_" + _place_dir, _either_place + "%");

			video_rotate *= !wise ? 1.003 : 0.997;

			video.z_rotate = video_rotate;

			this.update_video_transform(video);

			if (Math.abs(video_rotate) < 0.05) return;

			if (frame_number % 4 === 0)
				console.log("frame", {
					"Math.abs(video_rotate)": Math.abs(video_rotate),
				});

			window.requestAnimationFrame(_frame);
		};
		_frame();
	}

	update_video_transform(video) {
		video.style.transform = "translate3D(-50%, -50%," + video.z_translate + "px)rotate3D(0,0,1," + video.z_rotate + "deg)";
	}
}
