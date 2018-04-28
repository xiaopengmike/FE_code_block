<template>
    <div class="robot-base setting">
        <article class="set-word">
            <header><h2>消息设置</h2></header>
            <div>
                <span>机器人欢迎语</span>
                <el-input placeholder="您好,有何吩咐?" v-model.lazy="robot.msg.welcomeText" @blur="msgSave('修改机器人欢迎语','robot$welcome', 'welcomeText')"></el-input>
            </div>
            <div>
                <span>未知问题回答</span>
                <el-input placeholder="对不起,这个问题我答不出来" v-model="robot.msg.noAnswerText" @blur="msgSave('修改机器人未知问题回答','robot$no$answer', 'unknowText')"></el-input>
            </div>
        </article>

        <article class="joins">
            <header><h2>接入平台</h2></header>
            
            <section class="join-web">
                <header>
                    <h3>网站接入</h3>
                </header>
                <div class="visitor">
                    <span 
                        v-bind:class="{used: robot.enableWeb.isUsed}"  
                        @click="webSave('open')">启用</span><span 
                        v-bind:class="{unused: !robot.enableWeb.isUsed}"
                        @click="webSave('close')">停用</span>
                </div>
                <div v-show="robot.enableWeb.isUsed" class="checks">
                    <div @click="webSave('1')">
                        <el-radio class="radio" v-model="robot.enableWeb.status" label="1" >只开启机器人</el-radio>
                    </div>
                    <div @click="webSave('2')">
                        <el-radio class="radio" v-model="robot.enableWeb.status" label="2" @click="webSave">开启人工和机器人</el-radio>
                    </div>

                </div>
            </section>

            <section>
                <header>
                    <h3>微信接入</h3>
                </header>
                <div class="visitor">
                    <span v-bind:class="{used: robot.enableWx.isUsed}"  @click="wxSave('open')">启用</span><span v-bind:class="{unused: !robot.enableWx.isUsed}" @click="wxSave('close')">停用</span>
                </div>
                <div v-show="robot.enableWx.isUsed" class="checks">
                    <div @click="wxSave('1')">
                        <el-radio class="radio" v-model="robot.enableWx.status" label="1">只开启机器人</el-radio>
                    </div>
                    <div @click="wxSave('2')">
                        <el-radio class="radio" v-model="robot.enableWx.status" label="2">开启人工和机器人</el-radio>
                    </div>
                </div>
            </section>
        </article>

        <article>
            <header><h2>机器人功能设置</h2></header>
            <section>
                <header>
                    <h3>机器人闲聊</h3>
                </header>
                <div class="visitor">
                    <span :class="{used: robot.enableNormalChat}"  @click="funcSave('启用')">启用</span><span :class="{unused: !robot.enableNormalChat}" @click="funcSave('停用')">停用</span>
                </div>
            </section>
        </article>

        <article class="set-info">
            <header><h2>机器人形象设置<small>（会导致训练）</small></h2></header>
                <div class="set-head">
                    <section>
                        <div class="head-img">
                            <div class="image" :class="{img_border: robot_base.img==''}">
                                <img :src="robot_base.img" alt="">
                            </div>
                        </div>
                        <div><small>70x70</small></div>
                        <el-button @click="show_crop=!show_crop">上传图片</el-button>
                        <upload field="file"
						:width="65"
						:height="65"
						 :url="$uri.upload.file"
						@crop-success="cropSuccess"
				        @crop-upload-success="cropUploadSuccess"
				        @crop-upload-fail="cropUploadFail"
				        v-model="show_crop" 
						></upload>
                    </section>
                </div>
                <div class="set-msg">
                    <el-row>
                        <el-col :span="10">
                            <label>机器人昵称 :</label>
                            <el-input placeholder="机器人" v-model="robot_base.name"></el-input>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <label>机器人年龄 :</label>
                            <el-input placeholder="1" v-model="robot_base.age"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <label>机器人性别 :</label>
                            <el-radio class="radio" v-model="robot_base.sex" label="1">男</el-radio>
							&emsp;
                            <el-radio class="radio" v-model="robot_base.sex" label="2">女</el-radio>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <label>机器人星座 :</label>
                            <el-select v-model="robot_base.star" placeholder="请选择">
                                <el-option
                                  v-for="item in stars"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <label>妈妈的名字 :</label>
                            <el-input placeholder="" v-model="robot_base.mother"></el-input>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <label>爸爸的名字 :</label>
                            <el-input placeholder="" v-model="robot_base.father"></el-input>
                        </el-col>
                    </el-row>
                    <el-button type="primary" @click="robotSave('修改机器人形象','robot')" :disabled="change_robot?false:true">保存</el-button>
                </div>
        </article>
    </div>
</template>
<script>
   import upload from '../module/image-crop-upload'
    import subNav from '../module/subNavVertical.vue'
    export default {
        props:{},
        data(){
            return {
                my_validate: {
                    age: {
                        required:1,
                        type:'number',
                        name:'机器人年龄'
                    }
                },
                msgChange: false,
                robot:{
                    name: "",
                    age: "",
                    sex: "",
                    img: "",
                    star: "",
                    mother: "",
                    father: "",
                    enableNormalChat: true,
                    enableWeb: {                    
                        isUsed: false,
                        status: "1"
                    },
                    enableWx: {
                        isUsed: false,
                        status: "1"
                    },
                    msg:{
                        welcomeText: "",
                        noAnswerText: "",
                    }
                },
                robot_base:{
                    name: "",
                    age: "",
                    sex: "",
                    img: "",
                    star: "",
                    mother: "",
                    father: "",
                },
                change_robot:false,
                msg:{
                    welcomeText: "",
                    noAnswerText: "",
                },
                robotName: "",
                stars: [{}],
                show_crop:false,
            }
        },
        created(){
            this.getSettings();
            this.stars = this.gen_stars();
        },
        methods:{
            gen_stars(){
                var _resp = []
                var stars = ["水瓶座", "双鱼座","白羊座", "金牛座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座",  "魔羯座"]
                for(var i in stars){
                    _resp.push({
                        label: stars[i],
                        value: stars[i]
                    });
                }
                // console.info("星座", stars);
                return _resp;
                
            },
            baseCopy(robot, base){
                base.name = robot.name;
                base.age = robot.age;
                base.sex = robot.sex;
                base.img = robot.img;
                base.star = robot.star;
                base.mother = robot.mother;
                base.father = robot.father;
            },
            // 获取配置
            getSettings(){
                this.$api.ajax('/company/setting/robot','get')
                .then(data=>{
                    if(data.robot != null) 
                        this.robot = data.robot;
                        this.msg.welcomeText = this.robot.msg.welcomeText
                        this.msg.noAnswerText = this.robot.msg.noAnswerText
                        this.baseCopy(this.robot, this.robot_base);
                    setTimeout(()=>{
                    	this.change_robot=false;
                    },200)
                })
            },
            // 提交修改
            settingAjax(uri,method, data){
            	let v = this;
				return new Promise((resolve,reject)=>{
                	this.$api.ajax(
                        '/company/setting/'+uri,
                        method, 
                        data
                    ).then(data=>{
                        this.$message({
                            type: 'success',
                            message: "修改成功"
                        })
                        resolve(data);
                    }).catch(err=>{
                    	reject(err);
                    });
                });
            },
            funcSave(action){
                if(action=="启用"){
                    this.robot.enableNormalChat = true;
                }else{
                    this.robot.enableNormalChat = false;
                }
                this.robot.action = "机器人闲聊"+action;
                this.settingAjax('robot$chat', 'put', this.robot);
            },
            msgSave(action, put_name, who){
                if(who=="welcomeText" && this.msg.welcomeText==this.robot.msg.welcomeText) return;
                if(who=="unknowText" && this.msg.noAnswerText==this.robot.msg.noAnswerText) return;
                this.robotSave(action, put_name, true);
                this.msg.welcomeText = this.robot.msg.welcomeText;
                this.msg.noAnswerText = this.robot.msg.noAnswerText;
            },
            // 机器人基础配置
            robotSave(action, put_name, no_check){
                console.info(this.change_robot, this.robot, no_check) 
                if(!no_check){
                    var [isOk, msg] = this.$api.validate(this.my_validate, this.robot_base)
                    if(!isOk){
                        this.$message({type: "error", message: msg})
                        return 
                    }
                };
                if(action == ""){
                    this.robot.action = "修改机器人基础设置";
                }
                else this.robot.action = action;
                put_name = put_name == null ? 'robot' : put_name;
                this.baseCopy(this.robot_base, this.robot)
                this.settingAjax(put_name, 'put', this.robot)
                	.then(data=>{
                		this.change_robot = false;
                		if(action=='修改机器人形象'){
                			this.$root.$children[0].训练模型();
                		}
                		if(this.$store.state.global.enums.robot)
                			this.$store.state.global.enums.robot.img = this.robot.img;
                		else{
                			this.$store.state.global.enums.robot = {img: this.robot.img};
                		}
                	});
            },
            webSave(used, put_name){
                // console.info(used);
                var web = this.robot.enableWeb;
                if(used == "close"){
                    if(web.isUsed == false) return ;
                        web.isUsed = false;
                        this.robot.action = "停用机器人web接入";
                }else if(used == "open"){
                    if(web.isUsed == true) return ;
                        web.isUsed = true;
                        this.robot.action = "启用机器人web接入";
                }else{
                    if(web.status == used) return ;
                    web.status = used;
                    this.robot.action = "修改机器人web接入方式";
                }
                this.settingAjax('robot', 'put', this.robot).then(data=>{
                });
                
            },
            wxSave(used){
                var wx = this.robot.enableWx;
                // console.info(used)
                if(used == "close"){
                    if(wx.isUsed == false) return ;
                    wx.isUsed = false;
                    this.robot.action = "停用机器人微信接入";
                }else if(used == "open"){
                    if(wx.isUsed == true) return ;
                    wx.isUsed = true;
                    this.robot.action = "启用机器人微信接入";
                }else{
                    if(wx.status == used) return ;
                    wx.status = used;
                    this.robot.action = "修改机器人微信接入方式";
                }
                this.settingAjax('robot', 'put', this.robot).then(data=>{
                });
            },


            // 上传函数
            beforeUpload(){

            },
            successUpload(result,file,index){
                this.robot_base.img = result.url;        
            },
            errorUpload(msg,file,index){
                let v= this;
                v.$message({
                    message:msg,
                    type:'error',
                })
            },
            cropSuccess(imgDataUrl, field){
				console.log('-------- crop success --------');
				
			},
			cropUploadSuccess(data, field){
				console.log('-------- upload success --------');
				if(data.code==0){
					this.robot_base.img = data.data.url+'?r='+Math.random();
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
            //消息设置

        },
        components:{
            subNav,
            upload
        },
        beforeRouteLeave (to,from,next){
        	if(this.change_robot){
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
        	'robot_base':{
        		handler:function(n){
        			this.change_robot=true;
        		},
        		deep:true,
        	}
        }
    }
</script>
<style>
    .robot-base h3{font-size: 1.6rem; margin: 20px 0 10px 0;}
    .robot-base p {margin:10px 0; }
	.robot-base section {margin-left:50px; font-size:1.4rem;}
    .robot-base .set-word { position: relative; }
    .robot-base .set-word .head-img{position: relative; margin-top: 20px;}
    .robot-base .set-word > div {margin: 20px 0 20px 50px;}
    .robot-base .set-word span{position: absolute; font-size: 1.4rem; width: 90px; line-height: 40px;}
    .robot-base .set-word input{margin-left: 95px; height: 40px; max-width: 400px}

    .robot-base .checks > div {display: inline; margin-right: 15px;} 
    .robot-base .checks label {font-weight:normal;}
    .robot-base .set-info { min-width: 940px; position: relative;}
    .robot-base .set-info .set-head { width: 200px; position: absolute; text-align: center; margin-top: 15px;}
    .robot-base .set-info .set-head h3 {margin: 20px 0;}
    .robot-base .set-info .set-msg { padding-left: 250px; }
    .robot-base .set-info .set-msg .el-input { display: inline-block;  width: 200px;}
    .robot-base .set-info .set-msg .el-row {margin: 20px 5px;}
    .robot-base .set-info .set-msg .el-row:nth-child(2) { margin: 30px 5px; }
    .robot-base .set-info .set-msg label { font-size:1.4rem; margin:0; font-weight:normal;}
    .robot-base .set-info .set-msg > section{ width: 250px; margin: 0 auto; }
    .robot-base .set-info .set-msg h3{ text-align: center; }
 /*   .robot-base .set-info .set-msg div{ height: 170px; border: solid 1px #ccc; position: relative;}*/
    .robot-base .set-info .el-button {margin-top: 20px;}
    .robot-base .set-info .image {height: 70px; width: 70px;margin: auto; border-radius: 50%;}
    .robot-base .img_border {border: solid 1px #e5e5e5;}
    .robot-base .set-info .head-img img {
        width: 100%; height: 100%; border-radius: 50%;
    }
    .robot-base .joins .join-web { margin-bottom: 35px; }
</style>
