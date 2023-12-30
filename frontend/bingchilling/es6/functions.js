export function rnd_emoji_string() {
	return "&#" + (Math.floor(Math.random() * (128580 - 128512)) + 128512).toString();
}

export function ran() {
	return Math.random();
}

export function ranStrict() {
	return Math.abs(Math.random() - Math.random()).toFixed(2);
}

export function ranPan() {
	return (Math.random() * 2 - 1).toFixed(2);
}
