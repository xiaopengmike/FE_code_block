<template>
    <div class="audio-player-main">
        <div class="left">
            <div class="slider-box">
                <Slider show-tip="never"
                        v-model="progress"
                        @mousedown.native="sliderMouseDown"
                        @on-change="progressChange"></Slider>
            </div>
            <span class="current-time">
                <template v-if="drag">
                    {{(duration * progress / 100) | talkTimeFormat}}
                </template>
                <template v-else>
                    {{currentTime | talkTimeFormat}}
                </template>
            </span>
            /
            <span>{{duration | talkTimeFormat}}</span>
        </div>
        <div class="right">
            <el-button type="text" @click="audioPlayToggle">
                {{ playing ? '暂停' : '播放'}}
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "audio-player",
        props: {
            url: {
                require: true,
                type: String
            },
            talkTime: { // 通话时长，用于录音时长的初步显示，避免初始化加载全部录音
                type: Number
            }
        },
        data() {
            return {
                progress: 0,
                duration: this.talkTime || 0,
                currentTime: 0,
                playing: false, // 播放中
                drag: false, // 拖拽进度条

                audioContext: '', // 音频对象
                getCurrentTimeTimer: null // 定时器
            }
        },
        mounted() {
            this.initAudioManager()
        },
        methods: {
            // 拖动进度条
            sliderMouseDown () {
                this.drag = true
            },

            // 手动改变进度
            progressChange (val) {
                this.drag = false
                clearInterval(this.getCurrentTimeTimer)
                const currentTime = val / 100 * this.duration
                this.audioContext.currentTime = currentTime
                this.currentTime = parseInt(currentTime)
                if (this.playing) {
                    this.playAfter() // 实时更新 显示时间
                }
            },

            // 音频管理 初始化
            initAudioManager () {
                if (!this.audioContext) {
                    const audio = document.createElement('audio')
                    // 能够开始播放
                    audio.oncanplay = () => {
                        if (audio.duration) { // 获取语音时长
                            this.duration = audio.duration
                        }
                    }
                    // 开始播放
                    audio.onplay = () => {
                       this.playAfter()
                    }
                    // 暂停播放
                    audio.onpause = () => {
                        this.pauseAfter()
                    }
                    // 音频播放 结束
                    audio.onended = () => {
                        this.pauseAfter()
                        this.currentTime = this.duration
                        this.progress = 100
                    }
                    // 音频播放 出错
                    audio.onerror = (err) => {
                        console.error(err)
                        this.$message.warning('语音播放失败')
                    }
                    audio.style.position = 'fixed'
                    audio.style.top = '-100%'
                    audio.src = this.url
                    audio['data-index'] = this.index
                    document.body.appendChild(audio)
                    this.audioContext = audio
                }
            },
            // 音频 播放 / 停止
            audioPlayToggle () {
                if (!this.playing) {
                    this.audioContext.play()
                    this.pauseOtherAudio()
                } else {
                    this.audioContext.pause()
                }
            },

            // 播放 / 暂停 之后的 处理
            playAfter () {
                this.playing = true
                this.getCurrentTimeTimer = setInterval(() => {
                    if (this.currentTime === this.duration) {
                        this.currentTime = 0
                    }
                    // this.currentTime = Math.round(this.audioContext.currentTime)
                    this.currentTime++
                    if (!this.drag) { // 正在拖拽时 不实时更新 进度条 状态
                        this.progress = parseInt(this.currentTime / this.duration * 100)
                    }
                }, 1000)
            },
            pauseAfter () {
                this.playing = false
                clearInterval(this.getCurrentTimeTimer)
            },

            // 暂停其他正在播放的音频
            pauseOtherAudio () {
                let audioArr = document.querySelectorAll('audio')
                audioArr = Array.from(audioArr)
                audioArr.forEach(val => {
                    if (val.src !== this.url) {
                        val.pause()
                    }
                })
            }
        },
        filters: {
            // 通话时长 处理
            talkTimeFormat (time) {
                time = parseInt(time)
                let minute = parseInt(time / 60)
                if (minute < 10) {
                    minute = '0' + minute
                }
                time = time % 60
                if (time < 10) {
                    time = '0' + time
                }
                return  minute + ':' + time
            }
        }
    }
</script>

<style type="text/scss" lang="scss">
    .audio-player-main{
        .ivu-slider-wrap {
            margin: 15px 0;
        }
        .ivu-slider-button-wrap {
            top: -5px;
        }
    }
</style>
<style type="text/scss" lang="scss" scoped>
    .audio-player-main {
        background-color: #f4f9fc;
        overflow: hidden;
        display: flex;

        .left {
            flex: 1;
            display: flex;
            line-height: 34px;

            .slider-box {
                flex: 1;
                margin: 0 10px;
            }

            span {
                font-size: 13px;

                &.current-time {
                    color: #000;
                }
            }
        }

        .right {
            padding: 0 12px;
            text-align: right;

            button {
                margin: 0 12px;
            }
        }
    }
</style>
