/// "priority" : 0
class audio_class {
    constructor(audio_dir) {
        this.AUDIO_DIR = audio_dir
        this.ctx = new AudioContext()
        this.gainNode = this.ctx.createGain()
        this.gainNode.gain.value = 1.0
        this.gainNode.connect(this.ctx.destination)
        this.SOUNDS = {}
    }
    add_sound(file_name) {
        return new Promise((resolve, reject) => {
            if (Object.keys(this.SOUNDS).includes(file_name)) return resolve()
            let xhr = new XMLHttpRequest()
            xhr.onload = (e) => {
                this.ctx.decodeAudioData(e.target.response, (b) => {
                    this.SOUNDS[file_name] = b
                    resolve(this.SOUNDS[file_name])
                }, (e) => {
                    reject(e)
                })
            }
            xhr.open('GET',
                this.AUDIO_DIR + file_name,
                true
            )
            xhr.responseType = 'arraybuffer'
            xhr.send()
        })
    }
    async play({
        name,
        looping = false,
        volume = 1
    } = {}) {
        await this.add_sound(name)
        let source = this.ctx.createBufferSource()
        source.buffer = this.SOUNDS[name]
        source.connect(this.gainNode)
        this.gainNode.gain.value = volume
        source.loop = looping
        source.onended = () => {
            if (source.stop)
                source.stop()
            if (source.disconnect)
                source.disconnect()
        }
        source.start(0)
        return source
    }
}
const audio = new audio_class('static/__app__/dev/modules/audio/sounds/')
