<template>
    <div class="session-allocation-main">
        <h2>会话分配设置</h2>
        <div class="content">
            <div class="switch-text">
                <span>历史咨询优先</span>
                <el-switch v-model="form.isChatContinue" on-text="" off-text=""></el-switch>
                <p class="tips">
                    开启后，访客优先分配给最后接待他的客服，若最后客服不在线，则按基础的分配方式进行分配。
                </p>
            </div>
            <div class="allocation-mode">
                分配方式
                <ul>
                    <li>
                        <el-radio v-model="form.distributionWay" label="idle">按最大空闲分配</el-radio>
                        <p class="tips">
                            新接入的访客，分配给当前空闲时间最长的客服，若客服无空闲，则按最后的接待会话时间由先到后进行分配。
                        </p>
                    </li>
                    <li>
                        <el-radio v-model="form.distributionWay" label="load">按当前负荷分配</el-radio>
                        <p class="tips">
                            新接入的访客，分配给当前会话数最少的客服。
                        </p>
                    </li>
                    <li>
                        <el-radio v-model="form.distributionWay" label="loop">按客服轮询分配</el-radio>
                        <p class="tips">
                            新接入的访客，按客服账号创建时间由先到后，轮流分配给在线客服。
                        </p>
                    </li>
                    <li>
                        <el-radio v-model="form.distributionWay" label="random">随机分配</el-radio>
                        <p class="tips">
                            新接入的访客，随机分配给在线客服。
                        </p>
                    </li>
                </ul>
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
                form: {
                    isChatContinue: '',
                    distributionWay: ''
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
                this.$api.ajax(this.$uri.setting.online.distribution, 'get').then(data => {
                    if (Object.keys(data.distribution).length > 0) {
                        this.form = data.distribution
                        this.formClone = {...this.form}
                    }
                })
            },
            submit () {
                const params = {
                    ...this.form,
                    action: '修改会话分配设置'
                }
                this.$api.ajax(this.$uri.setting.online.distribution, 'put', params).then(data => {
                    this.formClone = {...this.form}
                    this.$message.success('保存成功')
                })
            },
            cancel () {
                this.form = {...this.formClone}
            }
        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    @import "css/public";
    .session-allocation-main {
        .content {
            .allocation-mode {
                margin-top: 40px;

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
        }
    }
</style>