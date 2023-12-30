import { zyxTransform } from "https://zyx.wumbl3.xyz/v:1.4/";

import { ranPan } from "./functions.js";

export default class GameCamera {
	constructor(mainContainer) {
		this.viewport = mainContainer;
		zyxTransform(this.viewport);
		this.defaults = {
			translateZ: "-100px",
		};
		this.reset();
	}

	snapshot(name) {
		this.viewport.snapshot(name);
	}

	restore(name) {
		this.viewport.restore(name);
	}

	reset() {
		this.viewport.set(null);
		this.set(this.defaults);
	}

	set(cords) {
		console.log("update camera to", cords);
		this.viewport.set(cords);
	}
}

// Randomly rotate camera, rXYZ = Range in degres.
GameCamera.prototype.randomCameraRotate = function ({ rX = 3, rY = 5, rZ = 5 } = {}) {
	this.set({
		rotateX: ranPan() * rX + "deg",
		rotateY: ranPan() * rY + "deg",
		rotateZ: ranPan() * rZ + "deg",
	});
};
