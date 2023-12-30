const feMent = (prop) => {
    let { type, id, cls, user, attr, text, inner, append, evt } = prop
    let element = document.createElement(type || 'div')
    if (id) element.id = id
    if (cls) if (typeof cls === "object") for (let x of cls) element.classList.add(x); else element.classList.add(cls)
    if (user === true) if (isLoggedIn()) element.classList.add('loggedin')
    if (attr) for (let [key, value] of Object.entries(attr)) element.setAttribute(key, value)
    if (text) element.innerText = text;
    if (inner) element.innerHTML = inner
    if (append) for (let val of append) element.append(val)
    if (evt) for (let [key, val] of Object.entries(evt)) element.addEventListener(key, val)
    return element
}

class oeMent {
    constructor() {

    }

}