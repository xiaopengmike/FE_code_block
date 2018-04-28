<template>
    <div class="online-base leave-msg setting">
        <article>
            <header>
                <h2>留言设置</h2>
            </header>
            <section>
            	<div class="visitor">
	                <span 
	                    v-bind:class="{used: user.isNeedLeaveText}"  
	                    @click="choise('open', 'isNeedLeaveText')">开启</span><span 
	                    v-bind:class="{unused: !user.isNeedLeaveText}"
	                    @click="choise('close', 'isNeedLeaveText')">关闭</span>
	            </div>
	            
	            <div v-show="user.isNeedLeaveText">
	                <p class="s-title">留言引导文案(不超过50个字)</p>
	                <textarea v-model="user.notOnlineText" name="" id="" cols="50" rows="5" ></textarea>
	                <p>访客联系方式(至少选择一项)</p>
	                <el-checkbox v-model="user.contactWay.phone">手机</el-checkbox>
	                <el-checkbox v-model="user.contactWay.email">邮箱</el-checkbox>
	                <el-button type="primary" @click="save" :disabled="!change_info?true:false">保存</el-button>
	            </div>
            </section>
            
        </article>
    </div>
</template>
<script>
    import subNav from '../module/subNavVertical.vue'
    
    export default {
        props:{},
        data(){
            return {
                nowClose: false,
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
                    timeSolveOnce: false,   // 一次性解决统计时间设置
                    timeStopServer: "",     // 过时结束会话
                    timeShow: "",           // 超过这个设置，显示时间
                    contactWay: {           // 留言的联系方式
                        phone: false,
                        email: false,
                    }
                },
                change_info:false,
            }
        },
        created(){
            this.getUser();
        },
        methods:{
            getUser(){
            	let v = this;
                this.$api.ajax('/company/setting/user', 'get').then(data=>{
                    if(data.user == null) return ;
                    this.user = data.user;
                    this.nowClose = !this.user.isNeedLeaveText;
                    setTimeout(()=>{
                    	v.change_info = false;
                    },200)
                })
            },
            choise(used, name){
                if(used == "close"){
                    if(this.user[name]==false) return ;
                    this.user[name] = false;
                    if(this.nowClose) {
                        this.change_info = false;
                        return ;
                    }
                    this.user.action="关闭留言功能";
                    this.settingAjax('user','put', this.user);
                    this.nowClose = true;
                }else if(used == "open"){
                    this.user[name] = true;
                }
            },
            save(){
                if(this.user.isNeedLeaveText && !this.user.contactWay.phone && !this.user.contactWay.email){
                    this.$message({
                        type: 'error',
                        message: '访客联系方式至少选一个'
                    })
                    return ;
                };
                this.user.action="开启留言功能";
                this.settingAjax('user','put', this.user);
                this.nowClose = false;

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
                        this.change_info=false;
                    })
            },
            // 

        },
        components:{
            subNav,
        },
        beforeRouteLeave (to,from,next){
        	if(this.change_info){
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
        watch:{
        	'user':{
        		handler:function(n){
        			this.change_info=true;
        		},
        		deep:true,
        	},
        }
    }
</script>
<style>
    .online-base section {margin-left: 50px; font-size: 1.4rem}
    .online-base .el-button {display: block; margin: 30px 0 0;}
    .online-base .s-title { font-size: 16px; }
    .leave-msg p{ margin: 10px 0; }


</style>
