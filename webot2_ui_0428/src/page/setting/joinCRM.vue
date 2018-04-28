<template>
    <div class="join-crm setting">
        <article class="to-join">
            <header>
                <h2>CRM信息对接</h2>
                <p class="ps">以下信息用于展示客户及订单信息等数据,请详细填写</p>
            </header>
            <section>
                <div>
                    <label>AppID<span class="red">&emsp;*</span></label>
                    <input type="text" placeholder="请输入AppID" v-model="companyInfo.appid">
                </div>
                <div>
                    <label>AppSecret<span class="red">&emsp;*</span></label>
                    <input type="text" placeholder="请输入AppSecret" v-model="companyInfo.appSecret">
                </div>
                <div>
                    <label>获取令牌URL</label>
                    <input type="text" placeholder="请输入企业令牌token" v-model="companyInfo.token">
                </div>
                <div>
                    <label>用户在线URL</label>
                    <input type="text" placeholder="请输入在线服务中与企业系统对接服务的接口URL" v-model="companyInfo.onlineServerUrl">
                </div>
                <div>
                    <label>用户电话URL</label>
                    <input type="text" placeholder=" 请输入电话服务中与企业系统对接服务的接口URL" v-model="companyInfo.phoneServerUrl">
                </div>
            </section>
            <el-button type="primary" @click="submit" :disabled="change_info?false:true">保存</el-button>
        </article>
    </div>
</template>
<script>
    import subNav from '../module/subNavVertical.vue'
    import CRMValidate from '../../Validation/CRM.js'
    
    export default {
        props:{},
        data(){
            return {
                companyInfo: {
                    appid: '',
                    appSecret: '',
                    token: '',
                    onlineServerUrl: '',
                    phoneServerUrl: ''   
                },
                change_info:false,
            }
        },
        created(){
            this.getSettings();
        },
        methods:{
            submit(){
                var [isOk, msg] = this.$api.validate(CRMValidate, this.companyInfo)
                if(!isOk) {
                    this.$message({
                        type: "error",
                        message: msg
                    })
                    return;
                }
                // console.info(this.companyInfo)
                this.companyInfo.action = "修改CRM对接信息";
                this.settingAjax('CRM', 'put', this.companyInfo)
            },
            getSettings(){
                this.$api.ajax('/company/setting/CRM','get')
                .then(data=>{
                    if(data.CRM != null){
                        this.companyInfo = data.CRM;
                    }
                    setTimeout(()=>{
                    	this.change_info=false;
                    },200)
                })
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
        	'companyInfo':{
        		handler:function(n){
        			this.change_info=true;
        		},
        		deep:true,
        	}
        }
    }
</script>
<style>
    .join-crm header p {margin: 0px}
    .join-crm h3{font-size: 1.6rem; margin: 20px 0 10px 0;}
    .join-crm p {margin:10px 0; }
    .join-crm section div{margin-top: 30px;}
    .join-crm section input {height: 40px; width: 340px; border: 1px solid #e6eaeb; padding: 10px}
    .join-crm section label{width: 150px; text-align: right; margin-right: 30px; font-size: 1.6rem; font-weight: 400}
    .join-crm .el-button{ margin: 20px 0 0 183px; }

</style>
