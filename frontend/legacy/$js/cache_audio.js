class cached_audio {

    constructor(_audio_dir) {
        this.AUDIO_DIR = _audio_dir
        this.ctx = new AudioContext()
        this.gainNode = this.ctx.createGain()
        this.gainNode.gain.value = 0.3
        this.gainNode.connect(this.ctx.destination)
        this.SOUNDS = {

        }
    }

    SET_VOLUME = (volume) => this.gainNode.gain.value = volume

    add_sound(file_name) {
        return new Promise((resolve, reject) => {
            if (Object.keys(this.SOUNDS).includes(file_name)) return resolve()
            let xhr = new XMLHttpRequest()
            xhr.onload = (e) => {
                this.ctx.decodeAudioData(e.target.response, (b) => {
                    // console.log(b)
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

    async play(file_name) {
        await this.add_sound(file_name)
        let source = this.ctx.createBufferSource()
        source.buffer = this.SOUNDS[file_name]
        source.connect(this.gainNode)
        source.onended = () => {
            if (source.stop)
                source.stop()
            if (source.disconnect)
                source.disconnect()
        }
        source.start(0)
    }

}
