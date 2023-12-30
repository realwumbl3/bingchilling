// #region [Imports] Copyright wumbl3 ©️ 2023 - No copying / redistribution / modification unless strictly allowed.
import zyX, { html } from 'https://zyx.wumbl3.xyz/v:1.4/';
// #endregion
export default class AlertFx {
	constructor() {
		html`
			<div this=main class="AlertFx">
				<div this=container class=Container></div>
			</div>
		`
			.bind(this);


		this.alerts = [];

	}

	newAlert(args, { alert_box } = {}) {
		const { name } = args;
		const active_by_name = this.alerts.filter((_) => _.name === name);
		if (name && active_by_name.length > 0) {
			alert_box = active_by_name[0];
			alert_box.renew(args);
		} else {
			alert_box = new AlertFxAlert(this, args);
			this.alerts.push(alert_box);
		}
		return alert_box;
	}

	deleteAlert = (alert) => this.alerts.splice(this.alerts.indexOf(alert), 1);

}

class AlertFxAlert {
	constructor(engine, args) {
		const { msg, duration = 5000, name = "default" } = args;
		this.engine = engine;
		this.name = name;
		this.duration = duration;

		this.animation = {
			fadeInDuration: 300,
			fadeOutDuration: 300,
		};

		html`
			<div this=alert class=TextAlert>
				<p this=text>${msg}</p>
			</div>
		`.bind(this);

		this.text.addEventListener("click", (_) => this.removeSelf());

		this.alert.style.animation = `come_in_trickle_in_baby ${this.animation.fadeInDuration}ms ease-out forwards`;
		this.engine.container.append(this.alert);
		this.removeTimeOut();
	}

	renew({ msg, duration } = {}) {
		this.duration = duration;
		this.text.innerHTML = msg;
	}

	removeTimeOut() {
		clearTimeout(this?.timeout);
		this.timeout = setTimeout((_) => this.removeSelf(), this.duration);
	}

	removeSelf() {
		this.alert.style.animation = `get_that_alert_outta_here ${this.animation.fadeOutDuration}ms ease-out forwards`;
		this.alert.addEventListener("animationend", (_) => this.alert.remove());
		this.engine.deleteAlert(this);
	}
}


// export const presetAlertFxs = {
// 	clipboardTwitterUrl: (data) => {
// 		const { handle = data.handle(), id = data.tweetId() } = {};
// 		navigator.clipboard.writeText(`https://twitter.com/${handle}/status/${id}`).then(() => {
// 			const [a, b] = [id.slice(0, 3), id.slice(-4)];
// 			alphaDek.alertBox({
// 				msg: `twitter@${handle}:${a}...${b} clipboarded.`,
// 			});
// 		});
// 	},
// 	clipboardTwitterProfile: (data) => {
// 		const handle = data.handle();
// 		navigator.clipboard.writeText(`https://twitter.com/${handle}/`).then(() => {
// 			alphaDek.alertBox({
// 				msg: `twitter.com/${handle}/<br>sent to clipboard.`,
// 			});
// 		});
// 	},
// };
