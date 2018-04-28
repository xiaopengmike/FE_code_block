<template>
    <div class="online-base setting">
        <article>
            <header>
                <h2>一次性解决率设置</h2>
            </header>
            
            <section>
            	<p class="ps">统计周期内，访客未二次来访的会话与总会话数的比值，此数据有一定时间延迟</p>
                <span>统计周期</span>
                <input v-model="nowTime" name="time" type="text" maxlength="3" class="error">
                <span>小时</span>
<!--                 <span v-show="errors.has('time')" class="error">{{errors.firstByRule('time', 'chinese')}}</span> -->
                <span class="descibe c_999">&emsp;{{nowTime}}小时内访客未二次来访即视为一性次解决</span>
                <el-button type="primary" :disabled="nowTime==user.timeSolveOnce"  @click="save" >保存</el-button>
            </section>
            
        </article>
    </div>
</template>
<script>
    import subNav from '../module/subNavVertical.vue'
    // import myValidate from '../../config/validation.js'
    
    export default {
        props:{},
        data(){
            return {
                nowTime: '',
                user: {
                    isChatContinue: false,  //　咨询优先
                    welcomeText: '',        //　欢迎语
                    notOnlineText: '当前客服不在线，如需帮助请留言',
                    isNeedSort: false,      // 必须分类
                    isEvaluateWeb: false,   // 是否开启客服评价web
                    isEvaluateWx: false,    // 是否开启客服评价微信
                    isNeedLeaveText: false, // 是否开启留言设置
                    isNeedTimeShow: false,  // 是否开启超时显示时间
                    isNeedTimeStopServer: false,    // 是否开启过时结束会话功能
                    timeSolveOnce: 0,       // 一次性解决统计时间设置
                    timeStopServer: "",     // 过时结束会话
                    timeShow: "",           // 超过这个设置，显示时间
                    contactWay: {           // 留言的联系方式
                        phone: false,
                        email: false,
                    }
                },
                myValidate:{
                    timeSolveOnce:{
                        required:1,
                        type:'integer',
                        name:'统计时间',
                    },
                },
            }
        },
        created(){
            this.getUser();
        },
        methods:{
            getUser(){
                this.$api.ajax('/company/setting/user', 'get').then(data=>{
                    if(data.user == null) return ;
                    this.user = data.user;
                    this.nowTime = this.user.timeSolveOnce;
                })
            },
            save(used, name){
                this.user.action = "修改断开会话时间";
                this.user.timeSolveOnce = this.nowTime;
                var [isOk,msg] = this.$api.validate(this.myValidate,this.user);
                if(!isOk){
                    this.$message({type: 'error', message: msg});
                    return 
                }
                this.settingAjax('user', 'put', this.user);
            },
            // 提交修改
            settingAjax(uri,method, data){
                this.$api.ajax(
                        '/company/setting/'+uri,
                        method, 
                        data
                    ).then(data=>{
                        this.$message({
                            type: 'success',
                            message: "修改成功"
                        })
                    })
            },
            // 

        },
        beforeRouteLeave (to,from,next){
            var user = this.user
            if(this.nowTime != this.user.timeSolveOnce){
                this.$confirm(
                    '您有数据未保存，确定要离开吗？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                        next();
                    }).catch(() => {
                       next(false);
                    });
            
            }
            else{
                next();
            }
        },
        components:{
            subNav,
        }
    }
</script>
<style>
    .online-base section {margin-left: 50px; font-size: 1.4rem}
    .online-base .el-button {display: block; margin: 30px 0 0;}
    .online-base section .visitor > div{margin-top: 30px;}


</style>
