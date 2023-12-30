import zyX, { html, css } from "https://zyx.wumbl3.xyz/v:1.4/";

export default class PlayerCursor {
	constructor() {
		html`
			<div this="cursor" class="PlayerCursor"></div>
		`.bind(this)

		this.pos = { x: 0, y: 0 };

		document.addEventListener("mousemove", (e) => {
			this.set(
				Math.max(Math.min(this.cursor.offsetLeft + e.movementX, window.innerWidth), 0),
				Math.max(Math.min(this.cursor.offsetTop + e.movementY, window.innerHeight), 0)
			);
		});
	}
	set(x, y) {
		this.pos.x = x;
		this.pos.y = y;
		this.updatePosition();
	}
	updatePosition() {
		this.cursor.style.left = this.pos.x + "px";
		this.cursor.style.top = this.pos.y + "px";
	}
	resetPos() {
		this.set(window.innerWidth / 2, window.innerHeight / 2);
	}
	show() {
		this.resetPos();
		this.cursor.classList.add("visible");
	}
	hide() {
		this.cursor.classList.remove("visible");
	}
}
