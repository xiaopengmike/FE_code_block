<template>
    <div class="join-web setting">
        <article class="to-join">
            <header><h2>接入及开关</h2></header>
            <section>
                <header><h3>1.接入代码</h3></header>
                <p class="ps2">请将以下代码添加到你网站的 HTML 源代码中，放在</ body >标签之前</p>
                <textarea name="" id="" cols="50" rows="5" readonly="readonly">{{copyData}}</textarea>
                <el-button type="primary"
                v-clipboard:copy="copyData" 
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                >复制到剪切板</el-button>
                <a type="button" class="el-button no-decoration" :href="'./t.html?code='+scriptURL" target="_blank">效果预览</a>
            </section><br />
            <section>
                <header>
                    <h3>2.访客开关</h3>
                </header>
                <div class="visitor">
                    <span v-bind:class="{used: enable}"  @click="enable=true, setEnable()">启用</span><span v-bind:class="{unused: !enable}"  @click="enable=false, setEnable()">停用</span>
                </div>
                <p class="ps2">开启后,访客即可看见客服入口</p>
            </section>
        </article>

        <article class="select-method">
            <header><h2>对话框打开方式</h2></header>
            <section class="show-h5">
                <el-row>
                    <el-col>
                        <el-radio class="radio" v-model="openWay" label="in_page">
                        浮层样式
                        <div>
                            <i class="img show-in-page-img"></i>
                            <i class="el-icon-check"></i>
                        </div>       
                        </el-radio>
                    </el-col>
                    <el-col>
                        <el-radio class="radio" v-model="openWay" label="new_page">
                        弹窗样式
                        <div>
                            <i class="img show-new-page-img"></i>
                            <i class="el-icon-check"></i>
                        </div>             
                        </el-radio>
                    </el-col>
                    <el-col>
                        <el-radio class="radio" v-model="openWay" label="new_tab">
                        标签样式
                        <div>
                            <i class="img show-new-tab-img"></i>
                            <i class="el-icon-check"></i>
                        </div>             
                        </el-radio>
                    </el-col>
                </el-row> 
            </section>
        </article>

        <article class="select-method">
            <header><h2>访客端入口样式</h2></header>
                    <el-tabs v-model="tagStyle.showWay" value="system">
                        <el-tab-pane label="系统样式" name="system">
                            <el-row>
                                <el-col :span="12">
                                    <section class="tag-style">
                                        <h3>1. 选择入口标签样式</h3>
                                        <el-row>
                                            <el-col :class="{'checked': tagStyle.shape=='bar'}">
                                                <div @click="tagStyle.shape='bar'">
                                                    <i class="el-icon-check"></i>
                                                    <div class="tag-style1 total-center">
                                                        <i class="img show-bar-img"></i>
                                                        <p></p>
                                                    </div>
                                                </div>
                                            </el-col>
                                            <el-col :class="{'checked': tagStyle.shape=='square'}">
                                                <div @click="tagStyle.shape='square'">
                                                    <i v-show="tagStyle.shape=='square'" class="el-icon-check"></i>
                                                    <div class="tag-style2 total-center" @click="tagStyle.shape='square'">
                                                        <i class="img show-square-img"></i>
                                                        <p></p>
                                                    </div>
                                                </div>
                                            </el-col>
                                            <el-col :class="{'checked': tagStyle.shape=='circle'}">
                                                <div @click="tagStyle.shape='circle'">
                                                    <i v-show="tagStyle.shape=='circle'" class="el-icon-check"></i>
                                                    <div class="tag-style3 total-center"  @click="tagStyle.shape='circle'">
                                                        <i class="img show-circle-img"></i>
                                                    </div>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </section>
                                    <section class="tag-color">
                                        <h3>2. 选择入口标签颜色</h3>
                                        <div>
                                            <el-row>
                                                <el-col class="tag-color1" :span="4">
                                                    <div @click="tagSelectColor(1)"><i class="el-icon-check" v-show="tagStyle.isFocus==1"></i></div>
                                                </el-col>
                                                <el-col class="tag-color2" :span="4">
                                                    <div @click="tagSelectColor(2)"><i class="el-icon-check" v-show="tagStyle.isFocus==2"></i></div>
                                                </el-col>
                                                <el-col class="tag-color3" :span="4">
                                                    <div @click="tagSelectColor(3)"><i class="el-icon-check" v-show="tagStyle.isFocus==3"></i></div>
                                                </el-col>
                                                <el-col class="tag-color4" :span="4">
                                                    <div @click="tagSelectColor(4)"><i class="el-icon-check" v-show="tagStyle.isFocus==4"></i></div>
                                                </el-col>
                                                <el-col class="tag-color5" :span="4">
                                                    <div @click="tagSelectColor(5)"><i class="el-icon-check" v-show="tagStyle.isFocus==5"></i></div>
                                                </el-col>
                                                <el-col class="tag-color6" :span="4">
                                                    <div @click="tagSelectColor(6)"><i class="el-icon-check" v-show="tagStyle.isFocus==6"></i></div>
                                                </el-col>
                                                <el-col class="tag-color7" :span="4">
                                                    <div @click="tagSelectColor(7)"><i class="el-icon-check" v-show="tagStyle.isFocus==7"></i></div>
                                                </el-col>
                                                <div class="color-picker" @click="tagStyle.isFocus=0"> 
                                                    <el-color-picker v-model="tagColors[0]">
                                                    </el-color-picker>
                                                    <i class="el-icon-check" v-show="tagStyle.isFocus==0"></i>
                                                </div>
                                                    
                                            </el-row>
                                        </div>
                                    </section>    
                                </el-col>
                                <el-col :span="12">
                                    <aside>
                                        <h3>预览</h3>  
                                        <div class="test-view">
                                            <div class="tag1 total-center" :style="{backgroundColor: tagColors[tagStyle.isFocus]}" :class="'shape-'+tagStyle.shape">
                                                <i class="img tag-test-view-img"></i>
                                                <p>在线客服</p>
                                            </div>
                                        </div>
                                    </aside>
                                </el-col>
                            </el-row>  
                        </el-tab-pane>
                        <el-tab-pane label="自定义样式" name="user">
                            <el-row>
                                <el-col :span="12">
                                    <section class="tag-udf" :class="{'upload-over': isUploadTagOver}">
                                        <h3>上传入口图标</h3>
                                        <p class="suggest">建议尺寸300px*300px，jpg/png/bmp/gif格式</p>
                                        <p>{{uploadImgName}}</p>
                                        <el-button v-show="isUploadTagOver" @click="clearTagImg">删除</el-button>
                                        <upload2 :action="$uri.upload.file" :accept="'image/*'" :success="successUploadTag" :error="errorUpload">
                                            <el-button>
                                                <span v-show="!isUploadTagOver">上传图片</span>
                                                <span v-show="isUploadTagOver">重新上传</span>
                                            </el-button>
                                        </upload2>
                                    </section>
                                </el-col>
                                <el-col :span="12">
                                    <aside>
                                        <h3>预览</h3>  
                                        <div class="test-view user-defined">
                                            <div class="no-upload total-center" v-show="!isUploadTagOver">
                                                <i class="img tag-no-upload-img"></i>
                                                <p>上传图片后预览</p> 
                                            </div>
                                            <img class="total-center" :src="tagStyle.showImg" alt="入口样式图片" v-show="isUploadTagOver">
                                        </div> 
                                    </aside>
                                </el-col>
                            </el-row>

                        </el-tab-pane>
                        <footer>
                            <el-button type="primary" @click="setTag()" disabled="disabled" :disabled="!isChange(settings.tagStyle, tagStyle)">保存</el-button>
                        </footer>   
                    </el-tabs>
        </article>

        <article class="dialog-setting">
            <header><h2>对话框样式设置</h2></header>
            <el-row>
                <el-col :span="12">
                    <div class="left-content">
                        <section>
                            <h3>1. 选择对话框颜色</h3>
                            <div  class="tag-color">
                                <div>
                                    <el-row>
                                       <el-col class="tag-color1" :span="4">
                                            <div @click="dialogSelectColor(1)"><i class="el-icon-check" v-show="dialogStyle.isFocus==1"></i></div>
                                        </el-col>
                                        <el-col class="tag-color2" :span="4">
                                            <div @click="dialogSelectColor(2)"><i class="el-icon-check" v-show="dialogStyle.isFocus==2"></i></div>
                                        </el-col>
                                        <el-col class="tag-color3" :span="4">
                                            <div @click="dialogSelectColor(3)"><i class="el-icon-check" v-show="dialogStyle.isFocus==3"></i></div>
                                        </el-col>
                                        <el-col class="tag-color4" :span="4">
                                            <div @click="dialogSelectColor(4)"><i class="el-icon-check" v-show="dialogStyle.isFocus==4"></i></div>
                                        </el-col>
                                        <el-col class="tag-color5" :span="4">
                                            <div @click="dialogSelectColor(5)"><i class="el-icon-check" v-show="dialogStyle.isFocus==5"></i></div>
                                        </el-col>
                                        <el-col class="tag-color6" :span="4">
                                            <div @click="dialogSelectColor(6)"><i class="el-icon-check" v-show="dialogStyle.isFocus==6"></i></div>
                                        </el-col>
                                        <el-col class="tag-color7" :span="4">
                                            <div @click="dialogSelectColor(7)"><i class="el-icon-check" v-show="dialogStyle.isFocus==7"></i></div>
                                        </el-col>
                                        <div class="color-picker" @click="dialogStyle.isFocus=0"> 
                                            <el-color-picker v-model="dialogColors[0]"><div>test</div>
                                            </el-color-picker>
                                            <i class="el-icon-check" v-show="dialogStyle.isFocus==0"></i>
                                        </div>
                                    </el-row>
                                </div>
                            </div>
                            <div>
                                <p>请选择需要主题色的模块</p>
                                <el-checkbox-group v-model="dialogStyle.needColorList">
                                    <el-checkbox label="标题栏"></el-checkbox>
                                    <el-checkbox label="对话气泡"></el-checkbox>
                                    <el-checkbox label="用户头像" :disabled="isUploadYhOver?true:false"></el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </section>
                        <section>
                            <h3>2. 企业名称展示</h3>
                            <div class="c-name">
                                <el-radio class="radio" v-model="dialogStyle.showWay" label="name">展示企业名称</el-radio>
                                <el-radio class="radio" v-model="dialogStyle.showWay" label="logo">展示企业logo</el-radio>
                                <div>
                                    <el-input v-model="dialogStyle.name" placeholder="请输入内容" v-show="dialogStyle.showWay=='name'"></el-input>
                                    <p class="suggest" v-show="dialogStyle.showWay=='logo'">建议尺寸200px*30px，jpg/png/bmp/gif格式</p>
                                    
                                    <div class="show-logo" v-show="dialogStyle.showWay=='logo'"  :class="{'upload-over': isUploadOver}">
                                        <el-button v-show="isUploadOver" @click="clearLogo">删除</el-button>
                                        <upload2 :action="$uri.upload.file" :accept="'image/*'" :success="successUpload" :error="errorUpload">
                                            <el-button>
                                                <span v-show="!isUploadOver">上传图片</span>
                                                <span v-show="isUploadOver">重新上传</span>
                                            </el-button>
                                        </upload2>
                                    </div>
                                    
                                </div>
                            </div>
                        </section>
                        <section>
                            <h3>3. 替换用户头像</h3>
                            <div class="yh-head-img"> 
                                <p class="suggest">建议尺寸40px*40px，jpg/png/bmp/gif格式</p>

                                <div :class="{'upload-over': isUploadYhOver}">
                                    <el-button v-show="isUploadYhOver" @click="clearYh">删除</el-button>
                                   	<el-button @click="show_crop_Yh=!show_crop_Yh">
                                        <span v-show="!isUploadYhOver">上传图片</span>
                                        <span v-show="isUploadYhOver">重新上传</span>
                                    </el-button>
                                    <upload field="file" :width="40" :height="40"  :url="$uri.upload.file"
								        @crop-upload-success="successUploadYh"
								        @crop-upload-fail="errorUpload"
								        v-model="show_crop_Yh" ></upload>
                                </div>                   
                            </div>
                        </section>
                        <section>
                            <h3>4. 替换客服头像(仅访客可见)</h3>
                            <div class="kf-head-img"> 
                                <p class="suggest">建议尺寸40px*40px，jpg/png/bmp/gif格式，此处上传不会变更客服个人头像</p>

                                <div  :class="{'upload-over': isUploadKfOver}">
                                    <el-button v-show="isUploadKfOver" @click="clearKf">删除</el-button>
                                    <el-button @click="show_crop_kf=!show_crop_kf">
                                        <span v-show="!isUploadKfOver">上传图片</span>
                                        <span v-show="isUploadKfOver">重新上传</span>
                                    </el-button>
                                    <upload field="file" :width="40" :height="40"  :url="$uri.upload.file"
								        @crop-upload-success="successUploadKf"
								        @crop-upload-fail="errorUpload"
								        v-model="show_crop_kf" ></upload>
                                </div>                   
                            </div>
                        </section>

                        <footer>
                            <el-button type="primary" @click="setDialog()" :disabled="!isChange(settings.dialogStyle, dialogStyle)">保存</el-button> 
                        </footer>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div>
                        <aside>
                            <h3>预览</h3>  
                            <div class="test-view">
                                <div class="total-center">
                                    <i class="img dialog-test-view-img"></i>
                                    <!-- <i class="img dialog-to-kf-img"></i> -->
                                    <header :style="getStyle('标题栏')" >
                                        <span v-show="dialogStyle.showWay=='name'">{{dialogStyle.name}}</span>
                                        <span v-show="dialogStyle.showWay=='logo' && dialogStyle.logo==''">LOGO</span>
                                        <img class="total-center" :src="dialogStyle.logo" alt="" v-show="dialogStyle.showWay=='logo'&& dialogStyle.logo!='' && typeof(dialogStyle.logo) == 'string'">
                                    </header>
                                    <div class="user-word" >
                                        <img :src="dialogStyle.kfImg" v-show="dialogStyle.kfImg!='' && typeof(dialogStyle.kfImg)">
                                        <i class="img kf-defined-img" v-show="!dialogStyle.kfImg"></i>
                                        <i class="chat-box"></i>
                                        <i class="glyphicon glyphicon-triangle-left"></i>
                                    </div>
                                    <div class="kf-word">
                                        <i class="glyphicon glyphicon-triangle-right" :style="getStyle1()"></i>
                                        <i class="chat-box" :style="getStyle('对话气泡')"></i>
                                        <i class="img my-fa my-icon-user kf-img" :style="getStyle('用户头像')" v-show="!dialogStyle.yhImg"></i>
                                        <img class="img kf-img yh-img" :src="dialogStyle.yhImg" v-show="dialogStyle.yhImg!='' && typeof(dialogStyle.yhImg)">

                                    </div>
                                    <div class="kf-word1">
                                        <i class="glyphicon glyphicon-triangle-right" :style="getStyle1()"></i>
                                        <i class="chat-box-big" :style="getStyle('对话气泡')"></i>
                                        <i class="img my-fa my-icon-user kf-img" :style="getStyle('用户头像')" v-show="!dialogStyle.yhImg"></i>
                                        <img class="img kf-img yh-img" :src="dialogStyle.yhImg" v-show="dialogStyle.yhImg!='' && typeof(dialogStyle.yhImg)">
                                    </div>
                                    <footer>
                                        <i class="img test-view-send-img" :style="{backgroundColor: dialogColors[dialogStyle.isFocus]}"></i>
                                    </footer>
                                </div>
                            </div>
                        </aside>
                    </div>
                </el-col>
            </el-row>

        </article>
    </div>
</template>
<script>
    import subNav from '../module/subNavVertical.vue'
     import upload from '../module/image-crop-upload'
     import upload2 from '../module/upload'
    export default {
        props:{},
        data(){
            return {
                show:0,
                tagColors: ['#814141', '#f96868', '#f2a654', '#926dde', '#57c7d4', '#62a8ea', '#46be8a', '#526069'],
                dialogColors: ['#814141', '#f96868', '#f2a654', '#926dde', '#57c7d4', '#62a8ea', '#46be8a', '#526069'],
                enable: true,
                copyData: "",
                scriptURL:'',
                openWay: 'in_page',
                isUploadOver: true,
                isUploadTagOver: false,
                isUploadKfOver:false,
                isUploadYhOver: false,
                show_crop_kf:false,
                show_crop_Yh:false,
                uploadImgName: "",
                settings:{
                    enable: true,
                    tagStyle: {
                        isFocus: 1,
                        showWay: "system", // system, user
                        showImg: "",
                        shape: "bar",  // bar, square, circle
                        color: "#f96868",  // 自定义颜色
                        uColor: "#814141"
                    },
                    dialogStyle: {
                        isFocus: 1,
                        color: "#f96868",
                        uColor: "#814141",
                        showWay: "name",    // name, logo
                        needColorList: ["标题栏", "对话气泡", "用户头像"],
                        name: "",
                        logo: "",
                        kfImg: "",
                        yhImg: "",
                    },
                    openWay: "in_page",
                },
                tagStyle: {
                    isFocus: 1,
                    shape: "bar",
                    showImg: "",
                    showWay: "system", // system, user
                    color: "#f96868",
                    uColor: "#814141"
                },
                dialogStyle: {
                    isFocus: 1,
                    color: "#f96868",
                    uColor: "#814141",
                    showWay: "name",    // name, logo
                    needColorList: ["标题栏", "对话气泡", "用户头像"],
                    name: "",
                    logo: "",
                    kfImg: "",
                    yhImg: "",
                }
            }
        },
        created() {
            this.getCopyData();
            this.getSettings();
        },
        methods:{
            getCopyData(){
                this.$api.ajax('/company/bind/web', 'get').then(data=>{
                    this.copyData = '<script src=\"'+ 
                                    data +
                                    '\"><\/script>';
                    this.scriptURL=data;
                })
            },
            getSettings(){
                this.$api.ajax('/company/setting/chat_web', 'get').then(data=>{
                    var web = data.chat_web
                    if(web == '' || web == undefined) return;
                    this.settings = web;
                    this.tagStyle = this.deepCopy(web.tagStyle);
                    this.dialogStyle = this.deepCopy(web.dialogStyle);
                    this.openWay = this.deepCopy(web.openWay);
                    this.enable = web.enable;
                    this.tagColors[0] = web.tagStyle.uColor;
                    this.dialogColors[0] = web.dialogStyle.uColor;

                    if(web.tagStyle.showImg!='' && web.tagStyle.showImg!=undefined){
                        this.isUploadTagOver = true
                        this.uploadImgName = this.getUploadImgName(web.tagStyle.showImg)
                    }else{ this.isUploadTagOver = false }

                    if(web.dialogStyle.logo!='' && web.dialogStyle.logo!=undefined){
                        this.isUploadOver = true;
                    }else{ this.isUploadOver = false; }

                    if(web.dialogStyle.kfImg!='' && web.dialogStyle.kfImg!=undefined){
                        this.isUploadKfOver = true;
                    }else{ this.isUploadKfOver = false; }

                    if(web.dialogStyle.yhImg!='' && web.dialogStyle.yhImg!=undefined){
                        this.isUploadYhOver = true;
                    }else{ this.isUploadYhOver = false; }
                })
            },
            onCopy(){
                this.$message({
                    type: 'success',
                    message: '复制成功!'
                })
            },
            onError(){
                this.$message({
                    type: 'error',
                    message: '复制失败!'
                })
            },
            getStyle(name){
                if(this.dialogStyle.needColorList.indexOf(name) < 0){
                    return {
                        "background-color": "white",
                        "color": "black",
                        "border-bottom": "1px solid #e5e5e5"
                    }
                }else{
                    return {
                        "background-color": this.dialogColors[this.dialogStyle.isFocus],
                        "color": "white",
                    }
                }
            },
            getStyle1(){
                if(this.dialogStyle.needColorList.indexOf("对话气泡") < 0){
                    return {
                        "color": "white",
                    }
                }else{
                    return {
                        "color": this.dialogColors[this.dialogStyle.isFocus]
                    }
                }
            },
            clearYh(){
                this.dialogStyle.yhImg = "";
                this.isUploadYhOver = false;
            },
            clearKf(){
                this.dialogStyle.kfImg = "";
                this.isUploadKfOver = false;
            },
            clearLogo(){
                this.dialogStyle.logo = "";
                this.isUploadOver = false;
            },
            clearTagImg(){
                this.tagStyle.showImg = "";
                this.isUploadTagOver = false;
                this.uploadImgName = "";
            },
            dialogSelectColor(num){
                this.selectColor("dialog", num);
            },
            tagSelectColor(num){
                this.selectColor("tag", num);
            },
            selectColor(name, num){
                var style = name+"Style";
                var colors = name+"Colors";
                this[style]["isFocus"] = num;
                this[style]["color"] = this[colors][num];
            },
            setEnable(){
                this.setSetting("enable", "访客开关");
            },
            setTag(){
                this.tagStyle.uColor = this.tagColors[0];
                if(this.tagStyle.isFocus == 0){
                    this.tagStyle.color = this.tagStyle.uColor;
                }
                this.setSetting("tagStyle", "聊天入口标签样式");
            },
            setDialog(){
                this.dialogStyle.uColor = this.dialogColors[0];
                if(this.dialogStyle.isFocus == 0){
                    this.dialogStyle.color = this.dialogStyle.uColor;
                }
                this.setSetting("dialogStyle", "聊天窗样式");
            },
            setOpenWay(){
                this.setSetting("openWay", "聊天窗打开方式");
            },
            setSetting(s_name, action){
                if(!this.isChange(this.settings[s_name], this[s_name])) return;
                this.settings[s_name] = this.deepCopy(this[s_name]);
                this.settings.action = action;
                this.settingAjax('put', this.settings)
            },
            isChange(d1, d2){
                if(typeof(d1) == 'object'){
                    for(var key in d1){
                        if(!(d2[key] == null) || d1[key] != d2[key]) return true;
                    }
                    return false;
                }else{
                    return d1 !== d2
                }
            },
            deepCopy(from){
                return JSON.parse(JSON.stringify(from))
            },
            settingAjax(method, data){
                this.$api.ajax(
                        '/company/setting/chat_web',
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
            getUploadImgName(url){
                var list = url.split("/")
                return list[list.length-1]
            },
            successUpload(result,file,index){
                this.isUploadOver = true;
                this.dialogStyle.logo = result.url;     
            },
            successUploadYh(result,file,index){
                if(data.code==0){
                	this.isUploadYhOver = true;
					this.dialogStyle.yhImg = result.data.url+'?r='+Math.random();;            
	                let a = this.dialogStyle.needColorList.indexOf('用户头像');
	                if(a!=-1)
	                	this.dialogStyle.needColorList.splice(a,1);                             
	                let b = this.settings.dialogStyle.needColorList.indexOf('用户头像');
	                if(b!=-1)
	                	this.settings.dialogStyle.needColorList.splice(b,1);
				}else{
					this.$message({
						message:data.msg,
						type:'error'
					})
				}
                
            },
            successUploadKf(result,file,index){    
                if(data.code==0){
                	this.isUploadKfOver = true;
					this.dialogStyle.kfImg = result.data.url+'?r='+Math.random();
				}else{
					this.$message({
						message:data.msg,
						type:'error'
					})
				}
            },
            successUploadTag(result,file,index){      
                //this.tagStyle.showImg = result.url;
                this.$set(this.tagStyle,'showImg',result.url)
                this.isUploadTagOver = true;
                this.uploadImgName = this.getUploadImgName(result.url);
                console.log(this.uploadImgName)
            },
            errorUpload(msg,file,index){
                this.$message({
                    message:msg,
                    type:'error',
                })
            },
        },
        components:{
            subNav,
            upload,
            upload2,
        },
        watch:{
        	openWay(){
        		this.setOpenWay();
        	}
        }
    }
</script>
<style>
    .total-center{ position: absolute; left: 0; right: 0; top: 0; bottom: 0; margin: auto;}
    .join-web h3{font-size: 1.6rem; margin: 20px 0 10px 0;}
    .join-web p {margin:10px 0; }
    .join-web section,
    .join-web footer {margin-left:50px; font-size:1.4rem;}
    .join-web footer {margin-top: 30px;}
    .join-web textarea {display: block; margin-bottom: 10px}
    .join-web .visitor{margin-bottom: 10px}
    .join-web .visitor span{padding: 6px 30px; border: solid 1px #ccc; cursor: pointer; color: #ccc; line-height: 30px;}
    .join-web .visitor span:nth-child(1){ border-right: 0px; }
    .join-web .visitor .used{background: #62a8ea; color: white; border-color: #62a8ea; }
    .join-web .visitor .unused{background: #999; color: white; border-color: #999; }
    .join-web .show-h5 img {width: 100px;}
    .join-web .show-h5 .el-col {width: 100px;}
    .join-web .show-h5 .el-col:nth-child(n+2) {margin-left: 50px;}

    .join-web .user-word img,
    .join-web .kf-defined-img,
    .join-web .kf-img {
        box-shadow: 1px 1px 10px 1px #d9e2ec;
    }
    .join-web .yh-img {
        position: relative;
        top: -10px;
    }
    
    .join-web .select-method .el-tabs__header {border: none; padding: 0 0 0 50px;}
    .join-web .select-method .el-tabs__item { padding: 0 25px; }
    .join-web .select-method .el-tab-pane {min-height: 420px;}
    .join-web .select-method .user-defined {height: 300px; overflow: hidden;}
    .join-web .select-method .user-defined img { max-width: 260px; }
    .join-web .user-defined .no-upload { width: 100px; color: black; height: 78px;}
    .join-web .suggest { color: #999; }
    .join-web .tag-udf .suggest {margin: 10px 0 20px;}

    .join-web .tag-udf.upload-over button,
    .join-web .show-logo.upload-over button,
    .join-web .yh-head-img .upload-over button,
    .join-web .kf-head-img .upload-over button,
    .join-web .show-kf-img.upload-over button { border: none; padding: 0; color: #20a0ff;}

    .join-web .tag-udf.upload-over > button {margin-right: 15px;}

    .join-web .c-name .suggest {margin-top: 0}

    .join-web .tag-style {margin-bottom: 29px;}
    .join-web .tag-style .el-col i.el-icon-check{display: none;}
    .join-web .tag-style .el-col {width: 70px; height: 166px; border: solid 1px #e1e1e1; position: relative;}
    .join-web .tag-style .el-col.checked {border-color: #62a8ea}
    .join-web .tag-style .el-col.checked .el-icon-check,
    .join-web .show-h5 .is-checked + span .el-icon-check {display: block; position: absolute; color: white; width: 25px; height: 25px; text-align: center; line-height: 25px; font-size: 10px; background: #62a8ea; right: -12px; top: -12px; border-radius: 50%}
    .join-web .show-h5 .el-icon-check{display: none;}
    #setting .join-web .show-h5 .is-checked + span .el-icon-check {top: 20px; right: -11px;}


    .join-web .tag-style .el-col .img {width: 100%;}
    .join-web .tag-style .el-col > div {width: 100%; height: 100%; cursor: pointer; position: relative;}

    .join-web .tag-style .el-col:nth-child(n+2){width: 100px; margin-left: 20px;}
    .join-web .tag-style .el-col:nth-child(1) .total-center{width: 27px; height: 119px;}
    .join-web .tag-style .el-col:nth-child(2) .total-center{width: 58px; height: 58px;}
    .join-web .tag-style .el-col:nth-child(3) .total-center{width: 58px; height: 58px;}

    .join-web .dialog-setting .el-input {width: 308px}
    .join-web .dialog-setting .left-content section:nth-child(n+1) {margin-bottom: 40px;}
    .join-web .dialog-setting .test-view {width: 353px; height: 375px; position: relative; pointer-events: none;}
    .join-web .dialog-setting .test-view header {position: absolute; width: 304px; top: 5px; left: 5px; height: 27px; line-height: 27px;}
    .join-web .dialog-setting .test-view .user-word {position: absolute; top: 72px; left: 14px; height: 27px; width: 120px; }
    .join-web .dialog-setting .test-view .kf-word{position: absolute; top: 116px; right: 14px; height: 100px; width: 120px; }
    .join-web .dialog-setting .test-view .kf-word1{position: absolute; top: 150px; right: 14px; height: 100px; width: 120px; }
    .join-web .dialog-setting .test-view footer {position: absolute; width: 25px; bottom: 14px; right: 14px; height: 16px; line-height: 27px;}
    .join-web .dialog-setting .test-view .user-word img { vertical-align: unset; height: 27px; width: 27px; border-radius: 50%;}

    .join-web .dialog-setting .test-view > div{width: 316px; height: 335px;}
    .join-web .dialog-setting .test-view header > img {height: 20px; background: #fff;}
    .join-web .dialog-setting .test-view .total-center > img {width: 100%;}

    .join-web .test-view {width: 300px; height: 370px; position: relative; font-size: 14px; text-align: center; line-height: 1.2; color: white; border: 1px solid #e5e5e5;}
    .join-web .test-view .shape-bar {width: 30px; height: 122px; border-radius: 20px;}
    .join-web .test-view .shape-bar .img {width: 20px; height: 18px; margin-top: 20px;}
    .join-web .test-view .shape-bar p {display: inline-block; width: 20px; margin: 0;}


    .join-web .test-view .shape-square { width: 70px; height: 70px; }
    .join-web .test-view .shape-square .img {width: 20px; height: 18px; margin-top: 14px; }
    .join-web .test-view .shape-square p {margin: 5px 0 0;}

    .join-web .test-view .shape-circle { width: 70px; height: 70px; border-radius: 50%;}
    .join-web .test-view .shape-circle .img {width: 20px; height: 18px; margin-top: 14px; }
    .join-web .test-view .shape-circle p {margin: 5px 0 0;}

    .join-web .tag-color > div { width: 308px;  border: solid 1px #e1e1e1; padding: 20px 5px 5px 16px;}
    .join-web .tag-color .el-col:nth-child(n+1) {margin-bottom: 15px;}
    .join-web .tag-color .el-col {width: 46px; height: 46px; margin-right: 10px; text-align: center;}
    .join-web .tag-color .el-col > div{height: 100%}
    .join-web .tag-color i { color: white; font-size: 26px; line-height: 46px;}

    .join-web .tag-color1 {background-color: #f96868;}
    .join-web .tag-color2 {background-color: #f2a654;}
    .join-web .tag-color3 {background-color: #926dde;}
    .join-web .tag-color4 {background-color: #57c7d4;}
    .join-web .tag-color5 {background-color: #62a8ea;}
    .join-web .tag-color6 {background-color: #46be8a;}
    .join-web .tag-color7 {background-color: #526069;}

    .join-web .user-word .glyphicon-triangle-left{position: absolute; color: #fff; left: 30px; top: 7px; font-size: 10px;}
    .join-web .kf-word .glyphicon-triangle-right,
    .join-web .kf-word1 .glyphicon-triangle-right{position: absolute; font-size: 10px; right: 30px; top: 7px; z-index: 2;}

    .join-web .kf-word .chat-box,
    .join-web .kf-word1 .chat-box-big{
        position: relative;
        right: 5px;
    }

    .join-web .tag-color .el-row > div { cursor: pointer;}
    .join-web .tag-color .el-color-picker { width: inherit;}
    .join-web .tag-color .color-picker {position: relative; float: left;}
    .join-web .tag-color .color-picker i{position: absolute; left: 5px; top: 0; pointer-events: none;}
    .join-web .tag-color .el-color-picker .el-color-picker__trigger{ border: none; padding: 0; height: initial;}
    .join-web .tag-color .el-color-picker .el-color-picker__color {width: 46px; height: 46px; border: none;}
    .join-web .tag-color .el-color-picker .el-color-picker__icon  {width: 58px; height: 46px; margin: 0; position: static; border: 1px solid #e1e1e1;}
    .join-web .tag-color .el-color-picker .el-color-picker__icon:before {content: "自定义"; display: block; position: absolute; font-size: 14px; line-height: 46px; right: 8px;}

    .join-web .user-word .chat-box {background-color: #fff; position: relative; left: 6px;}
    .join-web .chat-box,
    .join-web .chat-box-big {border-radius: 5px; display: inline-block; width: 85px; box-shadow: 1px 1px 10px 2px #d9e2ec}
    .join-web .user-word .chat-box{box-shadow: 1px 1px 10px 1px #d9e2ec, -10px 0px 14px -7px #d9e2ec;}

    .join-web .chat-box {height: 25px; }
    .join-web .chat-box-big {height: 75px;  border-radius: 5px;}
    .join-web .chat-box-big + .kf-img {position: relative; top: -57px;}
    .join-web .chat-box-big + .kf-img + .kf-img {position: relative; top: -57px;}
    
    .join-web i.img{display: inline-block;background-size: 100%;}
    .join-web .show-h5 .img{width: 100px; height: 67.5px;}
    .join-web .show-h5 .el-radio__label div{margin-top: 10px;}
    .join-web .show-h5 .radio {margin-bottom: 0;}
    .join-web .kf-img {width: 25px; height: 25px; border-radius: 50%; font-size: 14px; line-height: 25px; top: -8px; position: relative;}
/*    .join-web img.kf-img{ max-width: 25px; max-height: 25px; width: auto; height: inherit; }*/
    .join-web .user-img {width: 25px; height: 25px; border-radius: 50%; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWMAAAFjCAYAAADowmrhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUI2MTk5MEU3NzYxMTFFNzg5MUI5MUQ4QjIzNjFDMjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUI2MTk5MEQ3NzYxMTFFNzg5MUI5MUQ4QjIzNjFDMjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSI1RTVEQ0I5RTAxRUNENzBDNUIzMjUwRTAwNzQ4MkVBRiIgc3RSZWY6ZG9jdW1lbnRJRD0iNUU1RENCOUUwMUVDRDcwQzVCMzI1MEUwMDc0ODJFQUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6btOICAAAjaUlEQVR42uydf4hW1brHVzITjJcmcIIJUhj/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);}
        
        .join-web .show-in-page-img {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACiCAYAAAB/E0BuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDNDODdERDIyQzU0MTFFNkEwMzVEOUJEOEM3QjdERkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDNDODdERDMyQzU0MTFFNkEwMzVEOUJEOEM3QjdERkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOTcyRjBFNzJDNEYxMUU2QTAzNUQ5QkQ4QzdCN0RGQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxOTcyRjBFODJDNEYxMUU2QTAzNUQ5QkQ4QzdCN0RGQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ps/DaPYAAAK/SURBVHja7N1LiiIxAIDhsinUjaIrN4JLD1D3P0IO4N6NOx8LHwg1nRocmu5WHKZGKunvA0E0ZBH4SVUb7V5d10UUQvj9BEjGmyWAdJWfX1gul1YFOm61WtmBwSU0IGBAwCBgQMCAgIF7SktAyuJJwu12WxwOh+J8PjevDQaDYjQaFZPJpOj1elnNJ2Cycb1ei/V6/SeMm+Px2Dx2u10xn8+LsiyzmM8lNFntvN/F8VF8L465nfdPeT4Bk5V4Wfoojo+RxLGpzydgshLvKdsc2/X5BExWTqdTq2O7Pp+A+bH+9S+9XZ5PwCRpOBw+PTZ+bJP6fAImK/Fz1DbHdn0+AZOVeAjimZ0rjoljU59PwGR3XxsPQTyKJL4Xxzxzj9n1+e5xEotkxRNMi8Wi+Rx1v98Xl8uleb3f7xfj8fivjyp2fT4Bk+VOPJ1Om8dPmM8lNGREwCBgQMCAgEHAgIABAQP3Ag4hWAlI0JeTWLf/ega4hAZeuQNXVWVVoONut71vogWX0ICAAQGDgAEBAwIGBAwCBgQMCBgEDAgYEDAgYBAwIGBAwICAQcCAgAEBg4ABAQMCBgQMAgYEDAgYEDAIGBAwIGAQMCBgQMCAgEHAgIABAYOAgVSVloD/KYRgEb5RVZUdGOzA8AKz2cwivNtsNu6BAQGDgAEBAwIGAQMCBgQMCBgEDAgYEDAI2BJAunwbiZdo+1s42IHBDgzPaOsXKFLX9i+U2IHBJTQgYEDAIGBAwICAAQGDgAEBAwIGAQMCBgQMCBgEDAgYEDAgYBAwIGBAwCBgQMCAgAEBg4ABAQMCBgQMAgYEDAgYBAwIGBAwIGAQMCBgQMAgYEDAgIABAYOAAQEDAgYEDAIGBAwIGAQMCBgQMCBgEDAgYEDAgIBBwICAAQGDgAEBAwIGHurVdd08CSHUlgPswMCL/BJgAPmDGYsjHM3bAAAAAElFTkSuQmCC")}
        .join-web .show-new-page-img {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACiCAYAAAB/E0BuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDNDODdEREEyQzU0MTFFNkEwMzVEOUJEOEM3QjdERkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDNDODdEREIyQzU0MTFFNkEwMzVEOUJEOEM3QjdERkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEM0M4N0REODJDNTQxMUU2QTAzNUQ5QkQ4QzdCN0RGQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEM0M4N0REOTJDNTQxMUU2QTAzNUQ5QkQ4QzdCN0RGQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnhMIy8AAAKMSURBVHja7N1LagIxHMDhWAZ1o+hecOkBvP8RcgD3HsDHwgeCJVMs0oe1YEsSvw+EMob/YuDHzHQCds7nc0hijG9/AMV4cQqgXM3HA7PZzFmBzC0WC1dgcAsNCBgQMAgYEDAgYOA7jVNAidIOwtVqFbbbbTgcDu2xXq8XBoNBGI1GodPpVDVPwFTjdDqF5XL5HsbFbrdrP+v1Okwmk9A0TRXz3EJT1ZX3qziupe/Smss+/5LnCZiqpNvSW3FcR5LWlj5PwFQlPVM+cm3u8wRMVfb7/UPX5j5PwDytR/2nN+d5AqYo/X7/7rXptU3p8wRMVdJ71EeuzX2egKlK2gRxz5UrrUlrS58nYKp7rk2bIG5Fkr5La+55xsx93k/sxKI4aQfTdDpt36NuNptwPB7b491uNwyHw19vVcx9noCp8ko8Ho/bzzPMcwsNFRIwCBgQMCBgEDAgYEDAwHcBxxidCSjQp51Yl189A9xCA/95BZ7P584KZO7y2PsiWnALDQgYEDAIGBAwIGBAwCBgQMCAgEHAgIABAQMCBgEDAgYEDAgYBAwIGBAwCBgQMCBgQMAgYEDAgIABAYOAAQEDAgYBAwIGBAwIGAQMCBgQMAgYEDAgYEDAIGBAwICAAQGDgAEBAwIGAQMCBgQMCBgEDAgYEDAgYBAwIGBAwCBgQMCAgAEBg4ABAQMCBgQMAgYEDAgYBAwIGBAwIGAQMCBgQMAgYEDAgIABAYOAAQEDAgYEDAIGBAwIGAQMCBgQMCBgEDAgYEDAgIBBwICAAQGDgAEBAwIGBAwCBgQMCBgQMAgYEDAgYBAwIGBAwICAQcCAgAEBg4ABAQMCBgQMAgby1Xw8EGN0VsAVGPhrrwIMAFleCc+RDD3gAAAAAElFTkSuQmCC")}
        .join-web .show-new-tab-img {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACiCAYAAAB/E0BuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDNDODdERDYyQzU0MTFFNkEwMzVEOUJEOEM3QjdERkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDNDODdERDcyQzU0MTFFNkEwMzVEOUJEOEM3QjdERkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEM0M4N0RENDJDNTQxMUU2QTAzNUQ5QkQ4QzdCN0RGQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEM0M4N0RENTJDNTQxMUU2QTAzNUQ5QkQ4QzdCN0RGQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PocnJxcAAAK3SURBVHja7NzLaupAAIDhsQR1o+hecOkD+P6PMA/g3gfwsvCC4GFSLOI5VFty6Mz0+0AocRgk+DNJTNNcr9eQxBjf/wCK8WYXQLmaxw2LxcJegcytVisrMDiEBgQMCBgEDJSheXXg7apX7h6vopf6ucEKDFbgMlaKZyvtcrnM8nPHGH0LvyHdQbjZbMJ+vw+n06ndNhgMwmg0CpPJJPR6varm6yxg+GmXyyWs1+uPMG4Oh0P72m63YTabhaZpqpjPITRVrbz/iuNeei+Nud3nX/J8AqYq6bD0szjuI0ljS59PwFQlnVN2OTb3+QRMVY7HY6djc59PwPxaXV3pzXk+AVOU4XD48tj0s03p8wmYqqTfUbscm/t8AqYq6SaIV1auNCaNLX0+AVPdeW26CeKzSNJ7acwr55i5z/eMO7EoTrqDaT6ft7+j7na7cD6f2+39fj+Mx+Mv36qY+3wCpsqVeDqdtq/fMJ9DaKiQgEHAgICBrwfsn8qhTH9dhX72ZIvcnzFVyjOwavncOIQGulqBc312VK3sb77jdtr75ksEDqEBAQMCBgEDAgYEDAgYBAwIGBAwCBgQMCBgQMAgYEDAgIABAYOAAQEDAgYBAwIGBAwIGAQMCBgQMCBgEDAgYEDAIGBAwICAAQGDgAEBAwIGAQMCBgQMCBgEDAgYEDAgYBAwIGBAwCBgQMCAgAEBg4ABAQMCBgQMAgYEDAgYBAwIGBAwIGAQMCBgQMCAgEHAgIABAYOAAQEDAgYEDAIGBAwIGAQMCBgQMCBgEDAgYEDAgIBBwICAAQGDgAEBAwIGBAwCBgQMCBgQMAgYEDAgYBAwIGBAwICAQcCAgAEBAwIGAQMCBgQMAgYEDAgYEDAIGBAwIGAQMCBgQMCAgEHAgIABAQMCBgEDP6153BBjtFfACgz8b38EGAB+Mx4ONYBw/wAAAABJRU5ErkJggg==")}

        .join-web .dialog-test-view-img {width: 316px; height: 333px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUoAAAFcCAYAAACupveDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0ZEMUUwMURBRjIxMTFFNzk4NTdFMUZEQ0NFMDUwRTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0ZEMUUwMUNBRjIxMTFFNzk4NTdFMUZEQ0NFMDUwRTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjRGRDI1NjQ4OTQxMUU2QjBDRUUwQkFBNzVCODkzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjRGRDI1NzQ4OTQxMUU2QjBDRUUwQkFBNzVCODkzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi0dyFkAAAZFSURBVHja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")}

        .join-web .show-bar-img {height: 100%; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAD2CAYAAACDZETaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4JpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowOEE2QTVBNTg3NDVFNTExQkM3MkNCRUFDNjgwNDdCRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMUY3ODlCM0JDRTcxMUU1QTQxQ0ZEMkU5MjcyQzNEMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMUY3ODlCMkJDRTcxMUU1QTQxQ0ZEMkU5MjcyQzNEMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRiM2UzODczLTJjYTItNDhhNi04OWVlLTg4NTJhYjExN2Y4OSIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmFjZjU1Nzg4LWIyMGEtMTE3OC04NDhlLWZl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")}
        
        .join-web .show-square-img {height: 100%; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAAByCAIAAADvfXkUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4JpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowOEE2QTVBNTg3NDVFNTExQkM3MkNCRUFDNjgwNDdCRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MEFCQjA3NEJDRTcxMUU1QTQxQ0ZEMkU5MjcyQzNEMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MEFCQjA3M0JDRTcxMUU1QTQxQ0ZEMkU5MjcyQzNEMyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdlMjM0Y2YwLTNjNjYtNGJlZi1iZmJlLWQ3ODM4ZDVkOWFiZSIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmFjZjU1Nzg4LWIyMGEtMTE3OC04NDhlLWZl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")}

        .join-web .show-circle-img {height: 100%; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA6CAYAAAAOeSEWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4JpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowOEE2QTVBNTg3NDVFNTExQkM3MkNCRUFDNjgwNDdCRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRTI3QzcyQzdFRUExMUU1OUVCQjg4OTI3NEFGQzNENyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRTI3QzcyQjdFRUExMUU1OUVCQjg4OTI3NEFGQzNENyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg0ODhkNDA2LThlNDUtNDQ5Ni05NTY4LTkxZDBiMjdhOTk0NyIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmFjZjU1Nzg4LWIyMGEtMTE3OC04NDhlLWZl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")}
        .join-web .tag-test-view-img {background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODBFMkQ0MDM0OEE0MTFFNkIwQ0VFMEJBQTc1Qjg5M0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODBFMkQ0MDQ0OEE0MTFFNkIwQ0VFMEJBQTc1Qjg5M0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMDRDRTkxQzQ4OUIxMUU2QjBDRUUwQkFBNzVCODkzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4MEUyRDQwMjQ4QTQxMUU2QjBDRUUwQkFBNzVCODkzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhvmNJgAAAGDSURBVHja7Jg9SMNAGIaTUkUdHBTdFMRFnEScdHN1cNOtawdRHNycRBwFx2z+DA46CC7dndwUVwcNdBS0lQ4xYHw+uUCIJZRocx/YF56EHpR7cnfJ/bhRFDlkELZhHSah7BSbEOpwA7vQLBupGsw79tIHU4YX2Ctx2bEslc6MXERszdGV72HkMsbejGCcMzgEHz5t2YlYM1U2AQ3bzVZqU5aUcqECt9CCqEu0TB0VUyeltFgKxyCteRIVn2Opu11XDpt7FTxLPVnNEruDOUti91liAfRbEvvIEou0vZUq0hPrif1rsXetYg2tYo9axWoaxWRKGuB+BUuapiTXbN8k4zAEz9rEfszwZltlI2HWd8y32GB+lphnUcxzEmv8NNLNW/AAQQFr/cDUtRmv+f/qKTfgqINzD/e3gz9PluESRrSJSabhGma1icUf6XNYySvWrWWPbHBWYT/v+Ue3WiwZabVTGDW/ZUsYahCTyIHcBSyYF+NVywr2CRbhAMY6+cOXAAMADOadXRMMy/wAAAAASUVORK5CYII=")}
        .join-web .tag-no-upload-img {width: 50px; height: 40px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABOCAYAAADW1bMEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NjRkYTAyZC0wNTdlLTRiZmItYjFiZC0yYTFkMWQ2Nzc4ZmIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjlDQTFFOTJBM0Y4MTFFNzlCMUJGN0IyRTQyN0UzQ0EiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjlDQTFFOTFBM0Y4MTFFNzlCMUJGN0IyRTQyN0UzQ0EiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDODA0NTE5OTFFM0IxMUU2OENGNUM5QzdCMjc2MEE1QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDODA0NTE5QTFFM0IxMUU2OENGNUM5QzdCMjc2MEE1QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnTTVf4AAARxSURBVHja7Jx7aE5xGMefve7DwkRrcmkZzb3klj9caokw4g+Jf1wKKZfktrGN2dwNKVJKuaSRRGhuRWIxt9yGFAklMW2u83oe53e0Yd7fM+95z++c83zq27Z69p5zft/3+Z3ndzknrqKiAhxmMmoRKg3VALzJV9Q91HrUPicPFOegIfNRnVBzwV8cRY3zmiEdUGWohuA/wqiu6vqiTsihk871qRk/v8SorV7KkF6oUgfNNoHvqN6oO17IkAKfm2G3W6EXuqxhqBEQDIaixpvcZVHfWoLqC8HhqSrnP5mYIRMDZgaosn6BiV0WDfjWMOLPqYwyVWMZ17IUlWyaITNRKYz4lYZ/84+hLmvGNkPlm3QPaY56jGqjGV+MSrf/iI+PN8qJyspK+9fBqIuMweIg1BUTMmQhwwwi2yP3h0uoE4yCplD9dNWQtsoQYGTHZfAOy9UgUId+qKluG7JC9aF+yw6bW6gDjPh8ZntE1ZDOqBmM+NMeyw6bLNQXzdgklVWuGJIHvPWNbPAmNPjbxYi3lx1iagj1lxMY8SejUYG4yGqUbjnaCLUp1oYUMCuKbPA2r5mNnAHWvF5MDBkJ1sSaLlQ6lvhgmmQD6g0jnsrg+k4bEmKOSsM+yA6bcua1d1czGI4aMgXVkxF/HHUN/MMO1HNGPK2cJjplSGNUTkCzw4am2TnzcIlqrOaIIXPA2rygC03QlYL/2AvWliBdZqvuK6qGtEAtC3h22FShMhnxdGPfGG1DlqBaMU6C9i7dBP9C13eVEZ+uSuGI6Ey/twNrD1ITRnbQjozbOsEGT79HYgjqPOOjH6F6oD5HSqdI5DDMIA7rmsFsANO4gDoF+ps6aO5vHmrt/2RImmrcepoHdWy/kqH0QV1nzFrQWKYL6lVd7yEFDDOIogCZQdxAHWLEJ0QaXP4rQzhLmEHMDhvaS3Af9Ge+qZ361zZgri1DKAXXMU+sKIBmEE9Qu5ljv221dXO1GULb7QcysyMXgssqqk8Y8QNQk3QNocorj3lC1I/eDbAhL4G/I556oKY6hkwD6/kHyQ4eVAC9ZcTT5rrFkQyhURp3E9tBdVMLOu+VKRzoUb+O/zKE9qkmMT6wSrKjBttRLxjxjX8vnqob0lo5xoG2yDwUH37xEXhLFARtUh/yN0My1cBFl2+quhBqsgf1gPk/m+0BuG0IbVuZxfyQ/eDQg48eh76oWcz/oQH19OojdVpMGh3jE48zvGHDMT4eVWgplCEZLpgh/AmtN20hQ3ZKWxhDakiVXoIZdAsxKyvBWRJC0gZmIYaIIYIYIoYIYogYIvjNkESD26VlEA0ZZbAhY9w6MM32hl06Nq2s0esonhlmRnuwHt9ODpohBD1MSTtczkIU3zlVR2hObzhYz5m3DWKGCFJliSGCGCKGCGKIGCKIIWKIIIYIYogYIoghYogghoghghgihggmGFIuzWAM5WTIGWkHYyimNfVUsF5X10Law1XeofpThtCTtPQu9yOoD9IuMeeDanvyoOyHAAMAyzXfYKb/qfwAAAAASUVORK5CYII=")}
        .join-web .test-view-send-img {width: 25px; height: 16px; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAQCAYAAADj5tSrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEVGQ0M1OEY0ODhCMTFFNkIwQ0VFMEJBQTc1Qjg5M0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEVGQ0M1OTA0ODhCMTFFNkIwQ0VFMEJBQTc1Qjg5M0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0RUZDQzU4RDQ4OEIxMUU2QjBDRUUwQkFBNzVCODkzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0RUZDQzU4RTQ4OEIxMUU2QjBDRUUwQkFBNzVCODkzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psfe6XkAAAERSURBVHjavFPLDYJAEF2NDXCTeKOFtQQogRagBFqQEjDaANy5QAlYgly9SQk4Yx7JuC5EE9dJXnaYmZ03n0WN41gTfIJyAM5br1hRSt2UO/GZRLmWtfqDzJF4OEOcgeHPhD2GHov4V7EsyyNcod8JmpAROvjY3hASQojYEP7Y9gBsnUyVlaJqDb1AlxFhICSEC2J73PXMhHOL12idUQn7BSM6EHLxXYB4ivmIhKVDglbsJwVpacSGIu4o9KdsZggSjKNCZQPsZlc5uuhhS0XsIkmAPUTQp6r3M9228HFhjS3ONq7MeL6VWPKApBoYLJW/jWtpJ54lgWnTlntfLf6nf7zvmGPLJCdWHBHsCOeHAAMAEFXi7PsBntAAAAAASUVORK5CYII=")}

        .join-web .dialog-to-kf-img {width: 15px; height: 15px; border-radius: 50%; position: absolute; right: 14px; top: 11px; z-index: 2; background-image: url("data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QA0RXhpZgAATU0AKgAAAAgAAQExAAIAAAARAAAAGgAAAABDYW1lcmEzNjAg54Wn54mHAAD/4QGbaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdG9yVG9vbD5DYW1lcmEzNjAg54Wn54mHPC94bXA6Q3JlYXRvclRvb2w+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQFhARExQVFRUMDxcYFhQYEhQVFP/bAEMBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAbIBuAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APyqooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z")}

        .join-web .kf-defined-img {width: 25px; height: 25px; border-radius: 50%; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWMAAAFjCAYAAADowmrhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUI2MTk5MEU3NzYxMTFFNzg5MUI5MUQ4QjIzNjFDMjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUI2MTk5MEQ3NzYxMTFFNzg5MUI5MUQ4QjIzNjFDMjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSI1RTVEQ0I5RTAxRUNENzBDNUIzMjUwRTAwNzQ4MkVBRiIgc3RSZWY6ZG9jdW1lbnRJRD0iNUU1RENCOUUwMUVDRDcwQzVCMzI1MEUwMDc0ODJFQUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6btOICAAAjaUlEQVR42uydf4hW1brHVzITjJcmcIIJUhj/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")}
        /*.join-web .xx-img {width: 25px; height: 25px; border-radius: 50%; background-image: url()}*/

</style>
