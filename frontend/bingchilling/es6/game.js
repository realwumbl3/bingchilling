import zyX, { html, css, zyxAudio } from "https://zyx.wumbl3.xyz/v:1.4/";

import PlayerCursor from "./game/cursor.js";
import GameCamera from "./camera.js";

export class Game {
	constructor() {
		html`
				<div id="ScrollableScreens">
					<div this="main" id="Main">
						<div this="game" id="Game">
							<div id="GameBackgroundContainer"></div>
						</div>
					</div>
					<div id="menu"></div>
				</div>
			`.bind(this)
			.place("app");


		this.state = {
			focused: false,
		};

		this.audio = new zyxAudio("/static/sounds/");

		for (const sound of ["wow.mp3"]) this.audio.addSound(sound);

		this.camera = new GameCamera(this.game);

		this.playerCursor = new PlayerCursor();
		this.game.append(this.playerCursor.cursor);

		cursorLock(this.main, this.gameFocus.bind(this), this.gameDeFocus.bind(this));
	}

	gameFocus() {
		if (this.state.focused) return;
		this.state.focused = true;
		this.game.style.borderRadius = 20 + "vh";
		this.playerCursor.show();
		this.camera.restore("pause");
		this.audio.play({ name: "wow.mp3" });
	}

	gameDeFocus() {
		this.state.focused = false;
		this.game.style.borderRadius = 0 + "vh";
		this.playerCursor.hide();
		this.camera.snapshot("pause");
		this.camera.set({
			translateZ: "0%",
		});
	}
}

function cursorLock(container, onFocus, onDeFocus) {
	container.requestPointerLock = container.requestPointerLock || container.webkitRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.webkitExitPointerLock;
	container.onclick = (e) => container.requestPointerLock();
	document.addEventListener(
		"pointerlockchange",
		(e) => {
			if (document.pointerLockElement === container) onFocus();
			else onDeFocus();
		},
		true
	);
}

const game = new Game();

export { game };
