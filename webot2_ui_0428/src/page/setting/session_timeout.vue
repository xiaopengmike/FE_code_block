<template>
    <div class="session-timeout-main">
        <h2>会话超时设置</h2>
        <div class="content">
            <div class="switch-text">
                <span>客服未响应设置</span>
                <el-switch v-model="form.kf.isEnable" on-text="" off-text=""></el-switch>
                <p class="tips">
                    开启后，在设置的时间内，客服没有发送消息，系统将执行相应动作。
                </p>
            </div>
            <div class="expiration-time">
                超时时间：
                <el-input style="width: 75px;"
                          size="small"
                          v-model="form.kf.time"
                          @blur="testTimeout(1)"></el-input>
                分钟
            </div>
            <div class="timeout-action">
                超时动作：
                <ul>
                    <li>
                        <el-radio v-model="form.kf.action" :label="0">结束会话并发送提示语</el-radio>
                    </li>
                    <li>
                        <el-radio v-model="form.kf.action" :label="1">按会话分配规则转接给其他客服</el-radio>
                        <p class="tips">
                            如无其他客服在线，则结束回话。
                        </p>
                    </li>
                </ul>
            </div>

            <hr class="border">
            <div class="switch-text">
                <span>访客未响应设置</span>
                <el-switch v-model="form.kh.isEnable" on-text="" off-text=""></el-switch>
                <p class="tips">
                    开启后，在设置的时间内，访客没有发送消息，系统将自动关闭会话，并向访客发送提示语。
                </p>
            </div>
            <div class="expiration-time">
                超时时间：
                <el-input style="width: 75px;"
                        size="small"
                        v-model="form.kh.time"
                        @blur="testTimeout(2)"></el-input>
                分钟
            </div>
        </div>
        <div class="btn-box">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary"
                       :disabled="disabled"
                       @click="submit">保存</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "session-allocation",
        data() {
            return {
                minTimeout: 3, // 最小可设置的超时时间

                form: {
                    kf: {
                        isEnable: false,
                        time: '',
                        action: ''
                    },
                    kh: {
                        isEnable: false,
                        time: ''
                    }
                },
                formClone: {}
            }
        },
        computed: {
            disabled () {
                let disabled = true
                for (let key in this.form.kf) {
                    if (this.form.kf[key] !== this.formClone.kf[key]) {
                        disabled = false
                        break
                    }
                }
                if (disabled) {
                    for (let key in this.form.kh) {
                        if (this.form.kh[key] !== this.formClone.kh[key]) {
                            disabled = false
                            break
                        }
                    }
                }
                return disabled
            }
        },
        created () {
            this.formClone = JSON.parse(JSON.stringify(this.form))
            this.getData()
        },
        methods: {
            getData () {
                this.$api.ajax(this.$uri.setting.online.chatTimeout, 'get').then(data => {
                    if (Object.keys(data['chat_timeout']).length > 0) {
                        this.form = data['chat_timeout']
                        this.formClone = JSON.parse(JSON.stringify(this.form))
                    }
                })
            },
            submit () {
                // 验证 超时时间 是否合法
                if (this.form.kf.isEnable && !this.testTimeout(1)) {
                    return
                }
                if (this.form.kh.isEnable && !this.testTimeout(2)) {
                    return
                }

                const params = JSON.parse(JSON.stringify(this.form))
                params.action = '修改会话超时设置'
                this.$api.ajax(this.$uri.setting.online.chatTimeout, 'put', params).then(data => {
                    this.formClone = JSON.parse(JSON.stringify(this.form))
                    this.$message.success('保存成功')
                })
            },
            cancel () {
                this.form = JSON.parse(JSON.stringify(this.formClone))
            },

            testTimeout (type) {
                const key = type === 1 ? 'kf' : 'kh'
                let time = Number(this.form[key].time)
                if (time >= this.minTimeout) {
                    this.form[key].time = time
                    return true
                } else {
                    this.form[key].time = ''
                    this.$message.warning(`超时时间最小${this.minTimeout}分钟`)
                    return false
                }
            }
        }
    }
</script>

<style type="text/scss" lang="scss">
    .session-timeout-main {
        .expiration-time {
            .el-input--small .el-input__inner {
                height: 28px;
            }
        }
    }
</style>
<style type="text/scss" lang="scss" scoped>
    @import "css/public";
    .session-timeout-main {
        .content {
            .switch-text {
                span {
                    width: 99px;
                }
            }

            .timeout-action {
                margin-top: 10px;

                ul {
                    margin-top: 10px;

                    li {
                        margin-bottom: 10px;

                        p.tips {
                            margin: -5px 0 0 25px;
                        }
                    }
                }
            }

            hr.border {
                height: 1px;
                border: none;
                background-color: #e5e5e5;
                margin:  40px -20px 20px -20px;
            }
        }
    }
</style>