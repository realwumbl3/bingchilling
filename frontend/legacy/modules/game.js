import AlertFx from "./AlertFx.js";

export const alertFx = new AlertFx();

export default class Game {

    // VID HIT HELPER

    // TOO LATE MISS

    constructor() {

        this.agent = (navigator.userAgent.indexOf("Chrome") > -1) ? 'Chrome' : (navigator.userAgent.indexOf("Firefox") > -1) ? 'Firefox' : 'Chrome'

        this.PACKS = {}

        this.FIRST_PACK = pageData.packs[0]

        this.video_editor = new video_creator_class(this)

        this.fetch_pack(this.FIRST_PACK)

        this.init = true

        this.cached_audio_player = new cached_audio("/static/legacy/sounds/")

        this.cached_video_player = new cached_video(this)

        this.always_win = false

        this.scrollable_screen = document.getElementById('scrollable_screens')

        this.main_container = document.getElementById('main')

        this.game_container = document.getElementById('game')

        this.main_container.append(alertFx.main)

        this.game_bg_container = document.getElementById('game_bg_container')

        this.mobile = (typeof window.orientation !== "undefined")

        window.addEventListener("load", () => {
            this.scrollable_screen.style.opacity = 1
        })

        this.VIDEOS = {}

        this.SOUNDS = [
            "reverb_fart.mp3",
            "pussy.mp3",
            "reverb_fart_alt.mp3",
            "pussy2.mp3",
            "duck_fart.mp3",
        ]

        this.current_sound_index = 0

        this.hit_helper_mode = this.mobile ? "easy" : "hard"

        this.hit_helper = {
            "easy": {
                animationDuration: 800,
                handicapBuffer: 150
            },
            "hard": {
                animationDuration: 600,
                handicapBuffer: 0
            }
        }

        this.current_volume = .4

        this.clip_drop_container = newElement({
            cls: 'clip_drop_container'
        })

        this.PLAYING_VIDEOS = []

        this.hit_combo_count = newElement({
            type: 'b',
            cls: 'fart_streak_combo_count'
        })

        this.hit_combo_indicator = newElement({
            type: 'o',
            cls: 'fart_streak_combo_indicator',
            inner: 'COMBO!!!'
        })

        this.combosaver_ctn = newElement({
            cls: 'runsaver_container'
        })

        this.score_exp = newElement({
            cls: 'score_exp',
            append: [this.hit_combo_indicator, this.combosaver_ctn],
        })

        this.hit_score_dom = newElement({
            type: 'a',
            cls: 'hit_score'
        })

        this.score = newElement({
            cls: 'fart_streak_score',
            append: [this.hit_combo_count, this.score_exp, this.hit_score_dom]
        })

        this.highscore_dom = newElement({
            cls: 'fart_streak_high_score',
            inner: 'Highscore: 0'
        })

        this.logo = newElement({
            id: 'game_logo'
        })

        this.game = newElement({
            cls: 'fart_streak_game',
            append: [this.score, this.highscore_dom]
        })

        this.game_container.append(this.clip_drop_container, this.game, this.logo)

        this.streak = 0

        this.hit_score = 0

        this.highscore = 0

        this.previous_switch = null

        this.think_fast = null
        this.think_fast_switch = false

        this.keypressable_keys = [
            "Space"
        ]

        window.removeEventListener('keyup', this.click_hit.bind(this))

        this.COOLDOWN_DURATION = 200

        this.cooldown = null

        this.debug_click = false

        this.debug_console = true

        this.time_scale = 1

        this.default_combo_font_size = 10

        this.update_hit_combo_count(this.rnd_emoji_string())

        this.set_logo_position({ _bottom: 'unset', _top: 5 + "%", _x: 0 + "%", _y: 0 + "%", _z: 20, _width: 50 })

        this.dont_remove_videos = false

        this.camera_moving = true

        // "clip" , "game"

        this.PER_TARGET = "clip"

        this.game_container._default_camera = {
            _tx: 0, _ty: 0, _tz: 0, _s: 1, _rx: 0, _ry: 0, _rz: 0,
            _px: 50, _py: 50, _pz: 1000, _ox: 50, _oy: 50
        }

        Object.assign(this.game_container, this.game_container._default_camera)

        this.TARGET_CLIP

        this.reset_game_rotate()

        // this.animate_camera()

        this.game_container.requestPointerLock =
            this.game_container.requestPointerLock ||
            this.game_container.webkitRequestPointerLock

        document.exitPointerLock =
            document.exitPointerLock ||
            document.webkitExitPointerLock

        this.game_container.onclick = (e) => {
            this.game_container.requestPointerLock()
        }

        document.addEventListener('pointerlockchange', this.game_focused.bind(this), false)

        this.GAME_FOCUSED = false

        this.cursor_thing = newElement({
            style: {
                position: 'fixed',
                width: '35px',
                aspectRatio: '1/1',
                backgroundColor: 'white',
                border: "2px solid black",
                transform: "rotate(6deg)",
                transformOrigin: "0% 0%",
                top: window.innerHeight / 2 + "px",
                left: window.innerWidth / 2 + "px",
                borderRadius: "3% 50% 100% 50%"
            }
        })

        document.addEventListener('mousemove', (e) => {
            if (!this.GAME_FOCUSED) return
            // console.log('x: ', e.movementX, ' y: ', e.movementY)
            // let current_pos = getComputedStyle(this.cursor_thing)
            // console.dir(this.cursor_thing)

            this.cursor_thing.style.left = Math.max(
                Math.min(this.cursor_thing.offsetLeft + e.movementX, this.game_container.clientWidth), 0)
                + 'px'
            this.cursor_thing.style.top = Math.max(
                Math.min(this.cursor_thing.offsetTop + e.movementY, this.game_container.clientHeight), 0)
                + 'px'

            // this.cursor_thing.style.left = this.cursor_thing.offsetLeft + e.movementX + 'px'
            // this.cursor_thing.style.top = this.cursor_thing.offsetTop + e.movementY + 'px'

        })

        this.game_container.append(this.cursor_thing)


    }

    async first_load(pack_name) {
        await this.select_pack(pack_name)
        this.bind_events()
        this.init = false
    }

    async select_pack(pack_name) {
        this.VIDEOS = this.PACKS[pack_name]
        let pack_clip_count = Object.keys(this.VIDEOS).length


        this.loaded_pack_name = pack_name
        this.video_editor.init()
        alertFx.newAlert({ msg: 'PRELOADING "' + pack_name + '" clips.', dur: 99999999999999, alert_name: "PRELOADING" })
        await this.cached_video_player.preload_pack(Object.keys(this.VIDEOS))
        alertFx.newAlert({ msg: `Successfully loaded "${pack_name}" pack. (${pack_clip_count} clips.)`, alert_name: "PRELOADING" })
    }


    fetch_pack(pack_name, init) {
        fetch(`${window.origin}/staticcached/legacy/packs/${pack_name}/_clips.json`, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
            .then(response => response.json())
            .then(data => {
                let pack_clip_count = Object.keys(data?._SOLO).length
                if (pack_clip_count > 0) {
                    this.PACKS[pack_name] = data._SOLO
                    console.log('load solo', data._SOLO)
                } else {
                    console.log('load full', data.CLIPS)
                    this.PACKS[pack_name] = data.CLIPS
                }

                console.log(`Downloaded "${pack_name}" pack from server.  clips:`, data)
                if (this.init) this.first_load(pack_name)
            })
    }

    game_focused(e) {
        console.log(e)
        if (document.pointerLockElement === this.game_container) {
            console.log('GAME FOCUSED')
            this.GAME_FOCUSED = true
            this.cursor_thing.style.transition = "none"
            // this.game_container.style.cursor = "none"

        } else {
            console.log('GAME UNFOCUSED')
            this.GAME_FOCUSED = false
            this.cursor_thing.style.transition = "top .3s ease, left .3s ease"
            this.cursor_thing.style.left = 50 + "%"
            this.cursor_thing.style.top = 50 + "%"
            // this.game_container.style.cursor = "initial"
        }
    }


    bind_events() {

        if (this.mobile) {
            this.main_container.addEventListener('touchstart', this.click_hit.bind(this))
        } else {
            this.main_container.addEventListener('mousedown', this.click_hit.bind(this))
        }

        window.addEventListener('keydown', (e) => {
            if (e.code === "Space") e.preventDefault()

            if (e.code === "KeyO") {
                new_game_engine.combosaver("add_heart")
                return
            }

            if (e.code === "KeyP") {
                this.drop_all_videos_to_background()
                this.drop_new_video()
                this.streak = 2
                this.random_game_rotate()
                this.update_hit_combo_count("P")
                return
            }

            if (
                !this.keypressable_keys.includes(e.code)
                &&
                !["Num", "Key"].includes(e.code.slice(0, 3))
            ) return

            window.addEventListener('keyup', this.game_hit)
        })

    }

    update_hit_combo_count(text) {

        if (this.streak < 1) {
            this.hit_combo_count.style.fontFamily = 'Arial'
            this.hit_combo_count.innerHTML = text
            return true
        } else {
            this.hit_combo_count.style.fontFamily = 'Roboto Condensed'
        }

        this.hit_combo_count.style.setProperty('--font-size', this.default_combo_font_size + this.streak + "vw")

        clearTimeout(this?.update_float_timeout)
        this.update_float_timeout = setTimeout(() => {
            this.hit_combo_count.style.setProperty('--font-size', this.default_combo_font_size + "vw")
        }, 1337)

        this.hit_combo_count.innerHTML = text
    }

    current_sound = () => this.SOUNDS[this.current_sound_index]

    next_sound() {
        this.current_sound_index++
        if (this.current_sound_index > this.SOUNDS.length - 1) this.current_sound_index = 0
        return this.SOUNDS[this.current_sound_index]
    }

    coin_toss = () => Math.floor(Math.random() * 2).toString()

    sfx(sound_obj) {
        this.cached_audio_player.play(sound_obj)
    }

    get_time_scale = (whatever_variable) => whatever_variable * 1

    invert = () => this.game_container.classList.toggle('inverted')


    rnd_emoji_string() {
        return "&#" + (Math.floor(Math.random() * (128580 - 128512)) + 128512).toString()
    }

    rnd_emoji() {
        if (this.streak < 1) {
            this.update_hit_combo_count(this.rnd_emoji_string())
        } else {
            this.update_hit_combo_count(this.streak)
        }
    }

    cool_down() {
        if (this.cooldown) return true
        else this.cooldown = setTimeout(() => { this.cooldown = null }, this.COOLDOWN_DURATION); return false
    }

    combosaver(action) {
        switch (action) {
            case "add_heart":
                let new_heart = this.new_heart()
                this.combosaver_ctn.prepend(new_heart)
                break
            case "check":
                if (this.combosaver_ctn.childElementCount > 0) {
                    this.combosaver_ctn.firstChild.remove()
                    return true
                }
                return false
            default:
                break
        }
    }

    new_heart() {
        return newElement({
            cls: 'combosaver_heart'
        })
    }


    click_hit() {

        if (this.cool_down()) return

        let new_switch
        const video_hit = this.scan_hits()

        if (
            this.PLAYING_VIDEOS.length > 0
            &&
            video_hit
        ) {
            new_switch = this.previous_switch
        } else {
            new_switch = this.coin_toss()
        }

        if (!this.previous_switch) {
            this.sfx(this.current_sound())
            return this.previous_switch = new_switch
        }

        if (
            this.previous_switch === new_switch
            ||
            this.always_win
        ) {
            this.streak_progress()
        } else {
            this.streak_broken()
        }

        this.previous_switch = new_switch

        let hit_score = this.hit_score > 0 ? "Hit Score: " + this.hit_score.toString() : ''

        this.hit_score_dom.innerHTML = hit_score

        if (this.streak > this.highscore) {
            alertFx.newAlert({ msg: `${this.streak}! A NEW RECORD!!`, alert_name: 'newrecord' })
            this.cached_audio_player.play("wow.mp3")
            this.highscore = this.streak
            this.highscore_dom.innerHTML = "High Streak: " + this.highscore.toString() + " " + hit_score
        }

        if (this.streak > 1) {

            if (this.streak % 10 === 0) {
                this.combosaver("add_heart")
            }

            this.hit_combo_indicator.style.opacity = 1
            this.hit_combo_indicator.style.letterSpacing = 0 + "ch"
        } else {
            this.hit_combo_indicator.style.letterSpacing = -1 + "ch"
            this.hit_combo_indicator.style.opacity = 0
        }

        if (this.streak < 1) this.game_margin_offset(0, 0)

        if (this.streak > 1) this.drop_new_video()

        this.rnd_emoji()

    }

    streak_progress() {
        this.streak += 1
        this.sfx(this.current_sound())
        this.random_game_rotate()
    }

    streak_broken() {
        if (this.combosaver("check")) {
            return this.streak_progress()
        }

        this.game_container.classList.toggle('inverted')
        this.streak = 0
        this.hit_score = 0
        setTimeout(() => {
            if (this.PLAYING_VIDEOS.length < 1) this.reset_game_rotate()
        }, 300);
        this.sfx(this.next_sound())
    }

    scan_hits() {
        let hit = false
        this.PLAYING_VIDEOS.forEach((video_clone) => {
            let try_hit = this.hit(video_clone)
            if (try_hit) hit = video_clone
        })
        return hit
    }


    hit(video) {

        if (video._disconnect) return false

        if (!video?.start_play) return false

        video.hit_time = new Date().getTime()

        video.since_videostart_hit_ms = video.hit_time - video.start_play

        this.drop_all_videos_to_background(video)

        if (video.since_videostart_hit_ms <= video.start_ms) {
            if (video.start_ms - video.since_videostart_hit_ms < 10) {
                // video.hit
                return this.good_hit(video)
            }
            return this.miss(video)
        }

        if (video.since_videostart_hit_ms >= video.end_ms) {
            return this.miss(video)
        }

        return this.good_hit(video)

    }

    update_ms_count(ms_count, text) {

        ms_count.innerHTML = text
        ms_count.style.opacity = 1

        alertFx.newAlert({ msg: text, alert_name: 'ms_count' })

    }

    good_hit(video) {

        let react_target = video.start_play + video.start_ms
        let react_target_end = video.start_play + video.end_ms


        let nearness = video.hit_time - react_target

        if (!this.debug_click) {
            this.update_ms_count(video.ms_count, `HIT!!!<br>:D REACTED IN ${nearness} MS!`)
        }

        // VID HIT HELPER
        video.hit_helper.classList.add("hit_helper_flicker")

        if (nearness < 0) {
            if (nearness > -10) {
                this.hit_score += 500
                video.hit_helper.style.borderColor = "pink"
            }
        } else if (nearness <= 3) {
            this.hit_score += 3000
            video.hit_helper.style.borderColor = "fuchsia"
        } else if (nearness <= 25) {
            this.hit_score += 1250
            video.hit_helper.style.borderColor = "lime"
        } else if (nearness <= 60) {
            this.hit_score += 750
            video.hit_helper.style.borderColor = "green"
        } else if (nearness <= 100) {
            this.hit_score += 250
            video.hit_helper.style.borderColor = "yellow"
        } else {
            this.hit_score += 250
            video.hit_helper.style.borderColor = "orange"
        }

        video.hit_state = "unhit"

        video._disconnect = true

        return video
    }

    miss(video) {

        video.since_videostart_hit_ms = video.hit_time - video.start_play

        video.hit_state = "missed"

        video._disconnect = true

        video.hit_helper.style.animationPlayState = "paused"

        if (video.since_videostart_hit_ms < video.start_ms) {

            video.hit_helper.style.borderColor = "orange"

            let miss_diff = video.start_ms - video.since_videostart_hit_ms

            this.update_ms_count(video.ms_count, "TOO EARLY!!!<br> -" + miss_diff + "MS")

        } else if (video.since_videostart_hit_ms > video.end_ms) {

            this.hit_score -= 250

            video.hit_helper.style.borderColor = "red"

            let miss_diff = video.since_videostart_hit_ms - video.end_ms

            this.update_ms_count(video.ms_count, "TOO LATE!!!<br>MISSED BY " + miss_diff + "MS")

        }

        this.remove_video(video)

        return false

    }

    async create_video() {

        let random_video_file = Object.keys(this.VIDEOS)[Math.floor(Math.random() * Object.keys(this.VIDEOS).length)]

        let random_video = this.VIDEOS[random_video_file]

        let video = newElement({
            type: 'video'
        })

        video.src = await this.cached_video_player.load(random_video_file)

        // BG CLIP MIRROR
        // let video2 = video.cloneNode(true)
        // video2.classList.add('bg_video')

        let video_container_element = newElement({
            type: 'div',
            cls: 'drop_clip_video_container',
            append: [video]
        })

        let hit_helper = newElement({
            type: 'div',
            cls: 'hit_helper'
        })

        let ms_count = newElement({
            type: 'div',
            cls: 'ms_count'
        })

        let clip = newElement({
            cls: 'drop_clip',
            type: 'div',
            append: [video_container_element, hit_helper, ms_count]
        })

        clip.video = video

        // BG CLIP MIRROR
        // clip.video2 = video2

        clip.file_name = random_video_file

        clip.ms_count = ms_count

        clip.random_video = random_video

        clip.hit_state = false

        clip._disconnect = false

        clip.hit_helper = hit_helper

        clip.hit_difficulty = this.hit_helper[this.hit_helper_mode]

        clip.start_ms = this.get_time_scale(random_video.start_ms)

        clip.end_ms = this.get_time_scale(random_video.start_ms + random_video.window_ms) + clip.hit_difficulty.handicapBuffer

        clip.video.addEventListener('canplay', (e) => {

            clip.video.playbackRate = this.time_scale

            clip.video.volume = this.current_volume

            if (clip.random_video?.volume_red) clip.video.volume = clip.random_video?.volume_red * this.current_volume

            // BG CLIP MIRROR
            // clip.video2.playbackRate = this.time_scale
            // clip.video2.muted = true

            clip.video.play()

            // console.log('canplay?? ' + random_video_file)
        })

        clip.video.addEventListener('play', (e) => {

            clip.start_play = new Date().getTime()
            clip.length = this.get_time_scale(e.target.duration * 1000)
            clip.react_target = clip.start_play + clip.start_ms
            clip.react_target_end = clip.start_play + clip.end_ms

            // BG CLIP MIRROR
            // clip.video2.playbackRate = .8
            // clip.video2.play()

            this.play_video(clip)

            // console.log('play?? ' + random_video_file)
        })

        return clip
    }

    remove_video(video) {

        if (!this.dont_remove_videos) this.PLAYING_VIDEOS = this.PLAYING_VIDEOS.filter(item => item !== video)
        for (let timeOut of [video?.hit_helper_timeout, video?.remove_timeout, video?.invert_timeout]) window.clearTimeout(timeOut)

        // BG CLIP MIRROR
        // video.video2.style.animationName = "unset"
        // video.video2.style.transition = "opacity .3s ease"
        // video.video2.style.opacity = getComputedStyle(video.video2).opacity
        // video.video2.style.opacity = 0
        // setTimeout(() => {
        //     video.video2.remove()
        // }, 300);

        video.remove_timeout = setTimeout(() => {

            video.ms_count.style.opacity = 0

            let volume = video.video.volume
            let volume_decline = setInterval(() => {
                if ((volume *= .8) < .01) window.clearInterval(volume_decline)
                video.video.volume = volume
            }, 125)

            // VID HIT HELPER
            video.hit_helper.style.animationPlayState = "running"
            video.hit_helper.style.animationName = "hit_helper_kf_bye"
            video.hit_helper.style.animationDuration = this.get_time_scale(video.hit_difficulty.animationDuration / 2) + "ms"

            if (this.dont_remove_videos) return
            video.video.style.opacity = 0
            video.hit_helper.classList.remove("hit_helper_flicker")

            video.remove_timeout = setTimeout(() => {
                video.remove()
            }, this.get_time_scale(video.hit_difficulty.animationDuration / 2));

        }, 3000);

    }

    async drop_new_video() {

        let video = await this.create_video()

        this.PLAYING_VIDEOS.unshift(video)

        video = this.random_pos(video)

        video.style.setProperty('--place_width', video._w + "vw")
        video.style.setProperty('--place_height', video._w + "vh")
        video.style.setProperty('--place_top', video._y + "%")
        video.style.setProperty('--place_left', video._x + "%")

        this.lower_existing_volumes()

        this.focus_first_clip()

        this.focus_on_target()

        this.update_video_transform(video)

        this.clip_drop_container.append(video)

        setTimeout(() => {
            // _frame()
            video.style.opacity = 1
        }, 1);
    }

    play_video(video) {

        let hit_animationDuration = this.get_time_scale(video.hit_difficulty.animationDuration)

        // VID HIT HELPER
        video.hit_helper_timeout = setTimeout(() => {

            video.hit_helper.style.animationName = ran() > .5 ? "hit_helper_rotate_b" : "hit_helper_rotate_a"

            video.hit_helper.style.animationDuration = hit_animationDuration + "ms"

        },
            video.start_ms - hit_animationDuration
        )

        video.remove_timeout = setTimeout(() => {
            this.remove_video(video)
        },
            video.length
        )

        video.invert_timeout = setTimeout(() => {
            this.invert()
            video.invert_timeout = setTimeout(() => {

                // TOO LATE MISS
                if (video.hit_state !== "hit") {

                    video.ms_count.style.opacity = 1
                    video.ms_count.innerHTML = "TOO SLOW!!!"
                    video.hit_helper.style.borderColor = "red"

                    setTimeout(() => {
                        if (this.dont_remove_videos) return
                        video.video.style.opacity = 0
                        setTimeout(() => {
                            video.remove()
                        }, this.get_time_scale(video.hit_difficulty.animationDuration / 2));
                    }, 1500);

                }

                this.invert()
            }, video.end_ms - video.start_ms)
        }, video.start_ms)
    }

    random_pos(video) {

        let random_w = Math.floor(40 + 10 * Math.random())
        let _ran_x = ranP()
        let _ran_y = ranP()
        let _m = Math.floor((random_w / 100) * random_w)

        // console.log('_ran_x', _ran_x)
        // console.log('random_w', random_w)
        // console.log('_m', _m)
        // -1 to 1 random
        Object.assign(video, {
            _ran_x,
            _ran_y,
            // rotation
            _r: 0,
            // width
            _w: random_w,
            // margin
            _m,
            // x-y-axis
            _x: this.calc_offset_100(40, _ran_x) - _m,
            _y: this.calc_offset_100(30, _ran_y) - _m,
            // transform x-y-z-axis
            _tx: 0,
            _ty: 0,
            _tz: Math.floor(75 + (50 * ran()))
        })
        return video
    }

    update_video_transform(video) {
        let new_trans = "translate3D(" + video._tx + "%, " + video._ty + "%," + video._tz + "px)rotate3D(0,0,1," + video._r + "deg)"
        // console.log(video.file_name + " new transform:" + new_trans + " cord x,y,w:" + video._x + " , " + video._y + " , " + video._w)
        video.style.transform = new_trans
    }

    //############################################## 

    drop_all_videos_to_background = () => { for (let video of this.PLAYING_VIDEOS) this.drop_video_to_background(video) }

    drop_video_to_background = (video) => {
        video._tz = 0
        video.style.transition = "transform .5s ease"
        window.clearTimeout(video?.invert_timeout)
        this.update_video_transform(video)
    }

    _tunnel_drop(video) {
        let _start_z = video._tz
        const _frame = () => {
            video._tz--

            if (video._tz % 5 === 0) {
                console.log('_z_frame', video._tz)
                this._new_tuntun(video, _start_z - video._tz)
            }

            this.update_video_transform(video)
            if (video._tz > 0) window.requestAnimationFrame(_frame)
        }
        _frame()
    }

    _new_tuntun(video, _z_height) {
        let _new_tun = newElement({
            style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: 'translateZ(' + _z_height + 'px)',
                border: "10px solid lime",
                opacity: 0,
                transition: 'opacity .4s ease',
                borderRadius: 'inherit'
            }
        })
        console.log('new tun tun', _new_tun)
        video.append(_new_tun)
        setTimeout(() => {
            _new_tun.style.opacity = 1
        }, 1);
        setTimeout(() => {
            setTimeout(() => {
                setTimeout(() => {
                    _new_tun.style.opacity = 0
                    _new_tun.remove()
                }, 400);
            }, 1);
            _new_tun.remove()
        }, 400);
    }

    lower_existing_volumes() {
        for (let video of this.PLAYING_VIDEOS) video.video.volume /= 2
    }

    //############################################## 

    first_clip() {
        return this.PLAYING_VIDEOS[0]
    }

    focus_first_clip() {
        this.TARGET_CLIP = this.first_clip()
    }

    target_clip(target) {
        if (this.TARGET_CLIP === target) return
        this.TARGET_CLIP = target
    }

    animate_camera() {
        this.camera_moving = true
        this.camera_frame()
    }

    camera_frame() {
        let target_cord
        switch (this.PER_TARGET) {
            case "game":
                target_cord = this.game_container._default_camera
                break;
            case "clip":
                target_cord = this.get_clip_cords(this.TARGET_CLIP)
                break;
        }

        if (this.camera_moving) window.requestAnimationFrame(this.camera_frame)
    }

    focus_on_target() {
        let target = this.TARGET_CLIP
        switch (this.PER_TARGET) {
            case "game":
                this.update_camera_transform(this.game_container._default_camera)
                break
            case "clip":
                // console.log('FOT - target_cord',)
                let new_camera_perspective = [
                    target._ran_x * -40,
                    target._ran_y * -20
                ]
                // console.log('x:', new_camera_perspective[0], 'y:', new_camera_perspective[1])
                this.update_camera_transform({
                    _tx: new_camera_perspective[0] + "%",
                    _ty: new_camera_perspective[1] + "%"
                })
                this.set_logo_position({
                    _top: (target._ran_y < 0) ? 5 + "%" : 75 + '%',
                    _width: 50, _z: 20, _r: 0, _rx: 0
                })
                break
        }
    }

    calc_offset_new50(range, intensity) {
        return Math.floor(50 + (range * intensity))
    }

    calc_offset_100(range, intensity) {
        return Math.floor(50 + (range * intensity))
    }

    // Math.floor(
    //     50 + (10 * target_cord.r_x)
    // ),
    // Math.floor(
    //     50 + (10 * target_cord.r_y)
    // )

    update_camera_transform(assign) {
        if (assign) Object.assign(this.game_container, assign)
        let g = this.game_container

        let new_trans = 'translate3D(' + g._tx + ',' + g._ty + ',' + g._tz + 'px)scale(' + g._s + ')'
        let new_rotate = 'rotateX(' + g._rx + 'deg)rotateY(' + g._ry + 'deg)rotateZ(' + g._rz + 'deg)'

        // console.log('New camera pers:', new_trans)

        let new_origin_zy = g._ox + '% ' + g._oy + '%'

        let new_perspective_xy = g._px + '% ' + g._py + '%'
        let new_perspective_z = g._pz + 'px'

        g.style.perspectiveOrigin = new_perspective_xy
        g.style.perspective = new_perspective_z
        g.style.transform = new_trans + new_rotate
        g.style.transformOrigin = new_origin_zy

    }


    random_game_rotate() {
        this.game_container.style.borderRadius = 20 + "vh"
        this.set_logo_position({ _width: 20, _y: 0 + "%", _z: 200, _r: -20, _rx: 1 })
        // return false
        this.update_camera_transform({
            _rx: Math.floor(ranP() * 5),
            _ry: Math.floor(ranP() * 5),
            _rz: Math.floor(ranP() * 7),
            _tz: -500,
            _tx: 0 + "%",
            _ty: 0 + "%"
        })
    }

    reset_game_rotate() {
        this.game_container.style.borderRadius = 10 + "vh"
        this.update_camera_transform({
            _tx: 0 + "%", _ty: 0 + "%", _tz: -100, _rx: 0, _ry: 0, _rz: 0
        })
        this.game_margin_offset(0, 0)
        this.set_logo_position({ _top: 5 + "%", _width: 50, _y: 0 + "%", _z: 20, _r: 0, _rx: 0 })
    }

    set_logo_position({ ...u } = {}) {
        Object.assign(this.logo, u)
        Object.assign(this.logo.style, {
            top: this.logo._top,
            bottom: this.logo._bottom,
            transform: `translate3d(${this.logo._x},${this.logo._y},${this.logo._z}px)
                        ${this.logo?._r ? `rotate3D(${this.logo._rx | 0},${this.logo._ry | 0},${this.logo._rz | 0},${this.logo._r}deg)` : ''}`,
            width: "min(" + this.logo._width + "vw, " + this.logo._width + "vh)"
        })
    }

    game_margin_offset(offset_x, offset_y) {
        this.game_container.style.marginLeft = offset_x + "vw"
        this.game_container.style.marginTop = offset_y + "vw"
    }

}