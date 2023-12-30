function alertPopup(msg, sub) {
    if ($('.ctnPopupcontainer').length > 0) $('.ctnPopupcontainer').remove()
    if (msg) sub = `<div class="popup_msg">${msg}</div><div class="clicktocon">Click anywhere to continue.</div>`
    let popup_container = $('<div class="ctnPopupcontainer"></div>'),
        popup_popup = $(`<div class="ctnPopup"></div>`),
        clickTarget = null,
        exitable = false
    popup_popup.append(sub)
    popup_container.append(popup_popup)
        .on('mousedown', (e) => {
            clickTarget = e.target
        }).on('mouseup', (e) => {
            if (!exitable) return
            if (clickTarget !== e.target) return
            if (msg) return closectnPopup()
            if ($(e.target).is('.ctnPopupcontainer')) closectnPopup()
        })
    $('body').append(popup_container)
    setTimeout(() => {
        exitable = true
    }, 1000);
    popup_container.fadeTo(300, 1)
}

function closectnPopup() {
    $('.ctnPopupcontainer').fadeTo(300, 0, () => { $('.ctnPopupcontainer').remove() })
}


class alertFx_constructor {

    constructor() {
        this.text_container = newElement({
            cls: 'text_alert_container'
        })
        this.text_container_alt = newElement({
            cls: 'text_alert_container_alt'
        })

        this.glow = newElement({
            cls: 'top_fade'
        })
        this.glow.timeout_a = 0
        this.glow.timeout_b = 0

        this.new_alert = newElement({
            cls: ['new_alert'], append: [this.glow, this.text_container, this.text_container_alt]
        })
        this.alerts = {}
        this.alert_history = []
        document.body.append(this.new_alert)
    }

    alert(message, dur, pos, name) {

        this.alert_history.unshift({ message, dur, pos })

        let alert_text = newElement({
            cls: ['alert_text', pos + '_alert'], inner: message
        })
        alert_text.alert_name = name

        if (alert_text.alert_name === 'default') {
            this._add_text_alert(alert_text, dur)
        } else {
            this._remove_conflicts(alert_text)
            this._add_text_alert(alert_text, dur)
        }

    }

    _remove_conflicts(alert_text) {

        if (this.alerts[alert_text.alert_name] !== undefined) {
            this.alerts[alert_text.alert_name].remove()
        }

        this.alerts[alert_text.alert_name] = alert_text

    }

    _remove_from_alerts(alert_text) {

        alert_text.remove()

    }

    _add_text_alert(alert_text, dur) {

        this.text_container_alt.prepend(alert_text)

        alert_text.style.animation = 'come_in_trickle_in_baby .15s ease-out forwards'

        setTimeout(() => {
            this.glow.style.opacity = 1
        }, 1)

        // return

        window.clearTimeout(this.glow.timeout_a)
        window.clearTimeout(this.glow.timeout_b)

        this.glow.timeout_a = setTimeout(() => {
            this._glow_fade_out()
        }, dur + 1);

        setTimeout(() => {

            setTimeout(() => {

                this._remove_from_alerts(alert_text)

            }, 300);

            alert_text.style.animation = 'get_that_alert_outta_here .3s ease-out forwards'

        }, dur)

    }

    _glow_fade_out() {

        this.glow.timeout_b = setTimeout(() => {

            if (this.text_container_alt.childElementCount < 2) this.glow.style.opacity = 0

        }, 50);

    }

}

const new_alertfx = new alertFx_constructor()

const alertFx = ({ message, dur = 5000, pos = "top", alert_name = "default" } = {}) => {
    new_alertfx.alert(message, dur, pos, alert_name)
}

// window.alert('loaded')