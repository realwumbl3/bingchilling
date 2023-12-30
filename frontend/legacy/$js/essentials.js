class cursorLock {
    constructor() {
        this.stop
    }
    c(delay = null) {
        if (this.stop) return true
        if (!delay) return false
        window.clearTimeout(this.stop)
        this.stop = setTimeout(() => {
            this.stop = undefined
        }, delay)
    }
}


const colorLog = (message, color = "Black") => console.log("%c" + message, "color:" + color);

const curLock = new cursorLock()

function removeAllChildNodes(parent) {
    while (parent.firstChild) parent.removeChild(parent.firstChild)
}

function plurs(int) { return (int > 1) ? 's' : '' }

function rngGet(howlong) {
    if (howlong === undefined) howlong = 5
    let tenten = Math.pow(10, howlong),
        randomnum = Math.floor((Math.random() * (tenten - 1)) + 0)
    return (new Array(howlong).join('0') + randomnum).slice(-howlong)
}

function ran() {
    return Math.random()
}

function ranS() {
    return (Math.abs(Math.random() - Math.random())).toFixed(2)
}

function ranP() {
    return ((Math.random() * 2) - 1).toFixed(2)
}

const ranR = (a, b) => Math.floor(Math.random() * (b - a) + a);

function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }
    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }
    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }
    return false;
}
