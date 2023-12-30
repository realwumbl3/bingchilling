import zyX, {  html, css } from "https://zyx.wumbl3.xyz/v:1.4/";

export default class ComboCounter {
	constructor() {
	}

	update_hit_combo_count = (text) => {
		if (this.streek < 1) {
			this.hit_combo_count.style.fontFamily = "Arial";
			this.hit_combo_count.innerHTML = text;
			return true;
		} else {
			this.hit_combo_count.style.fontFamily = "Roboto Condensed";
		}

		this.hit_combo_count.style.setProperty("--font-size", this.default_combo_font_size + this.streek + "vw");

		clearTimeout(this?.update_float_timeout);
		this.update_float_timeout = setTimeout(() => {
			this.hit_combo_count.style.setProperty("--font-size", this.default_combo_font_size + "vw");
		}, 1337);

		this.hit_combo_count.innerHTML = text;
	};
}
