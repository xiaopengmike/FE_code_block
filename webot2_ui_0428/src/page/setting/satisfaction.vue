<template>
    <div class="satisfaction-main">
        <h2>满意度设置</h2>
        <div class="content">
            <div class="switch-text">
                <span>满意度开关</span>
                <el-switch v-model="form.isEnable" on-text="" off-text=""></el-switch>
                <p class="tips">
                    开启后，人工会话结束时，访客会收到满意度评价邀请的推送。
                </p>
            </div>
            <div class="detail-set" v-if="form.isEnable">
                <div class="switch-text">
                    <span>网页</span>
                    <el-switch v-model="form.isWebEnable" on-text="" off-text=""></el-switch>
                </div>
                <div class="switch-text">
                    <span>微信</span>
                    <el-switch v-model="form.isWxEnable" on-text="" off-text=""></el-switch>
                </div>
                <div class="expiration-time">
                    评价过期时间：
                    <el-input v-model="form.timeToStop" style="width: 75px;" size="small"></el-input>
                    分钟
                </div>
                <div class="satisfaction-mode">
                    满意度内容设置
                    <ul>
                        <li v-for="item in modes"
                            :key="item"
                            :class="{active: form.mode === item}"
                            @click="form.mode = item">
                            <div v-if="item === 2">
                                <span>模式一</span>
                                <span>满意</span>
                                <span>不满意</span>
                                <i class="el-icon-circle-check" v-if="form.mode === item"></i>
                            </div>
                            <div v-else-if="item === 3">
                                <span>模式二</span>
                                <span>满意</span>
                                <span>一般</span>
                                <span>不满意</span>
                                <i class="el-icon-circle-check" v-if="form.mode === item"></i>
                            </div>
                            <div v-else-if="item === 4">
                                <span>模式三</span>
                                <span>非常满意</span>
                                <span>满意</span>
                                <span>一般</span>
                                <i class="el-icon-circle-check" v-if="form.mode === item"></i>
                            </div>
                            <div v-else-if="item === 5">
                                <span>模式四</span>
                                <span>非常满意</span>
                                <span>满意</span>
                                <span>一般</span>
                                <span>不满意</span>
                                <span>非常不满意</span>
                                <i class="el-icon-circle-check" v-if="form.mode === item"></i>
                            </div>
                        </li>
                    </ul>
                </div>
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
                modes: [2, 3, 4, 5], // 满意度模式列表
                form: {
                    isEnable: false,
                    isWebEnable: false,
                    isWxEnable: false,
                    timeToStop: '',
                    mode: ''
                },
                formClone: {}
            }
        },
        computed: {
            disabled () {
                let disabled = true
                for (let key in this.form) {
                    if (this.form[key] !== this.formClone[key]) {
                        disabled = false
                        break
                    }
                }
                return disabled
            }
        },
        created() {
            this.formClone = {...this.form}
            this.getData()
        },
        methods: {
            getData () {
                this.$api.ajax(this.$uri.setting.online.satisfaction, 'get').then(data => {
                    if (Object.keys(data.evaluation).length > 0) {
                        this.form = data.evaluation
                        this.formClone = { ...this.form }
                    }
                })
            },
            submit () {
                const params = {
                    ...this.form,
                    action: '修改满意度设置'
                }
                this.$api.ajax(this.$uri.setting.online.satisfaction, 'put', params).then(data => {
                    this.formClone = { ...this.form }
                    this.$message.success('保存成功')
                })
            },
            cancel () {
                this.form = { ...this.formClone }
            }
        }
    }
</script>

<style type="text/scss" lang="scss">
    .satisfaction-main {
        .expiration-time {
            .el-input--small .el-input__inner {
                height: 28px;
            }
        }
    }
</style>
<style type="text/scss" lang="scss" scoped>
    @import "css/public";
    .satisfaction-main {
    .content {
        .switch-text {
            span {
                width: 72px;
            }
        }

        .satisfaction-mode {
            margin-top: 50px;

            ul {
                margin-top: 20px;

                li {
                    margin-bottom: 10px;

                    &.active {
                        div {
                            border-color: #0b87ff;
                        }
                    }

                    div {
                        display: inline-block;
                        height: 42px;
                        border: 1px solid #dcdcdc;
                        border-radius: 5px;
                        cursor: pointer;
                        position: relative;

                        span {
                            float: left;
                            height: 40px;
                            line-height: 40px;
                            padding: 0 15px;
                            &:first-child {
                                background-color: #e3ebee;
                                border-radius: 5px 0 0 5px;
                            }
                        }
                    }

                    i {
                        font-size: 20px;
                        color: #0b87ff;
                        position: absolute;
                        right: -8px;
                        top: -8px;
                        background-color: #fff;
                    }
                }
            }
        }
    }
}
</style>