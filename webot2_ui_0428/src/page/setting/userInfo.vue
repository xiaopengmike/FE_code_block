<template>
    <div class="user-info setting">
        <article>
            <header>
                <h2>个人信息</h2>
            </header>
            <section>
            	<div class="row clearfix">
            		<div class="col-md-8">
	            		 <div class="account item">
		                    <label>账号<i></i></label>
		                    <div class="displayIB">{{userInfo.account}}</div>
		                    <!--<input type="text" v-model="userInfo.account"  readonly="readonly" class="no-border">-->
		                </div>
		                <div class="item">
		                    <label>姓名<i></i></label>
		                    <input type="text" v-model="userInfo.username">
		                </div>
		                <div class="item">
		                    <label>昵称</label>
		                    <input type="text" v-model="userInfo.nickname">
		                </div>
		                <div class="item">
		                    <label>手机号</label>
		                    <input type="text" v-model="userInfo.mobile">
		                </div>
	            	</div>
	               	<div class="col-md-4">
	               		<div class="kf_head">
	               			<p>
	               				<img v-if="!userInfo.head" src="../../assets/img/user_header.png" />
	               				<img v-else :src="userInfo.head"  />
	               			</p>
	               			<small>85x85</small><br />
	               			<el-button class="pointer" @click="show_crop=!show_crop">上传头像</el-button>
	               			<upload field="file" :width="85" :height="85" :url="$uri.upload.file"
								@crop-success="cropSuccess"
						        @crop-upload-success="cropUploadSuccess"
						        @crop-upload-fail="cropUploadFail"
						        v-model="show_crop" 
								></upload>
	               			<!--<upload :action="'/api/chats/upload/logo'" :accept="'image/*'" :success="successUpload" :error="uploadError_mixin" :before = "beforeUpload_mixin">
		                        <el-button class="pointer">上传头像</el-button>
		                   </upload><br />-->
	               		</div>
	               		
	               	</div>
            	</div>
            </section>
            <el-button type="primary" @click="submit" :disabled="!change_userInfo?true:false">保存</el-button>
        </article>

        <article>
            <header>
                <h2>密码设置</h2>
            </header>
            <section>
                <div class="item">
                    <label>原密码<i></i></label>
                    <input type="password" v-model="pwd.old_password">
                </div>
                <div class="item">
                    <label>新密码<i></i></label>
                    <input type="password" v-model="pwd.password">
                </div>
                <div class="item">
                    <label>确认新密码</label>
                    <input type="password" v-输入验证="'^'+pwd.password+'$'" v-model="re_password">
                </div>
            </section>
            <el-button type="primary" @click="submit('password')" :disabled="!change_pwd?true:false">保存</el-button>
        </article>
    </div>
</template>
<script>
    import subNav from '../module/subNavVertical.vue'
    import upload from '../module/image-crop-upload';
    export default {
    //	mixins:[upload_mixin],
        props:{},
        data(){
            return {
                re_password: '',
                userInfo: {
                    id: 0,
                    username: '',
                    nickname: '',
                    mobile: '',  
                    head:'',
                },
                change_userInfo:false,
                pwd:{
                	id: 0,
                	password: '',
                    old_password:'',
                },
                change_pwd:false,
                validate: {
                    mobile: {
                        required:0,
                        type:'mobile',
                        name:'联系电话',
                    }
                },
                show_crop:false,
            }
        },
        created(){
            this.getSettings();
        },
        methods:{
            submit(password){
                var postData = {}
                if(password=="password"){
                    if(this.re_password!=this.pwd.password){
                        this.$message({type: "error", message: "两次输入的密码不一致,请重新输入"})
                        return ;
                    }
                    postData = {
                        password: this.pwd.password,
                        old_password: this.pwd.old_password,
                        action: "修改用户密码"
                    }
                }else{
                    var [isOk, msg] = this.$api.validate(this.validate, this.userInfo);
                    if(!isOk){
                        this.$message({type: "error", message: msg})
                        return ;
                    };
                    postData = {
                        username: this.userInfo.username,
                        nickname: this.userInfo.nickname,
                        mobile: this.userInfo.mobile,
                        action: "修改用户基本信息",
                        head:this.userInfo.head,
                    }
                }
                // this.settingAjax('CRM', 'put', this.userInfo)
                this.$api.ajax('/user/self','put', postData).then(data=>{
                        this.$message({
                            type: 'success',
                            message: "修改成功"
                        })
                        if(postData.mobile!==undefined){
                        	this.change_userInfo=false;
                            let user = this.$store.state.global.user;
                            for(let k in postData){
                            	user[k] = postData[k];
                            }
                            this.$store.dispatch('setUser',user);  
                        }else{
                        	this.change_pwd=false;
                        }
                        //修改名字或头像直接反应在当前会话中
                        if(this.$parent.$parent.kfs){
                        	this.$parent.$parent.kfs.head[this.userInfo.id] = postData.head;
                        	this.$parent.$parent.kfs.name[this.userInfo.id] = postData.nickname;
                        }
                })
            },
            getSettings(){
            	let v= this;
                var user_id = this.$store.state.global.user.id;
                this.$api.ajax('/user/self','get')
                .then(data=>{
                    if(data.id != null){
                        var ui = this.userInfo
                        ui.account = data.account;
                        ui.username = data.username;
                        ui.nickname = data.nickname;
                        ui.mobile = data.mobile;
                        ui.id = user_id;
                        ui.head = data.head;
                        this.pwd.id = user_id;
                    }else{
                        this.userInfo.id = user_id;
                        this.pwd.id = user_id;
                    }
                    setTimeout(()=>{
                    	v.change_userInfo=false;
                    	v.change_pwd=false;
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
                    })
            },
            // 
			successUpload(result,file){
				this.uploadSuccess_mixin();
				this.userInfo.head = result.url;
			},
			cropSuccess(imgDataUrl, field){
				
			},
			cropUploadSuccess(data, field){    
				if(data.code==0){
					this.userInfo.head = data.data.url+'?r='+Math.random();
				}else{
					this.$message({
						message:data.msg,
						type:'error'
					})
				}
			},
			cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			}
			
        },
        components:{
            subNav,
            upload,
            
        },  
        	
        beforeRouteLeave (to,from,next){
        	if(this.change_userInfo){
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
        	'userInfo':{
        		handler:function(n){
        			this.change_userInfo=true;
        		},
        		deep:true,
        	},
        	'pwd':{
        		handler:function(n){
        			this.change_pwd=true;
        		},
        		deep:true,
        	}
        }
    }
</script>
<style>
    .user-info h2{font-size: 2rem; padding: 10px 0; font-weight: 700}

    .user-info > article > header {border-bottom: solid 1px #000;}
    .user-info header p {margin: 0px}
    .user-info h3{font-size: 1.6rem; margin: 20px 0 10px 0;}
    .user-info .account input {border: none;}
    .user-info p {margin: 0 0 10px 0;}
    .user-info section {margin-left:50px;}
    .user-info section .row {margin-right: 0; margin-top:0;}
    .user-info section .item + .item{margin-top: 30px;}
    
    .user-info section input {height: 40px; width: 340px; border: 1px solid #e6eaeb; padding: 10px}
    .user-info section label{width: 84px; text-align:left; margin: 0 15px 0 0; font-size: 1.6rem; font-weight: 400}
    .user-info .el-button{ margin: 20px 0 0 153px; }
	.user-info .kf_head {width:88px; text-align:center; padding-top:10px;}
	.user-info .kf_head p {height:85px; width:85px; margin:auto; border-radius:50px; overflow:hidden;}
	.user-info .kf_head img {width:85px; height:85px;}
	.user-info .kf_head .el-button {margin:0;}
</style>
