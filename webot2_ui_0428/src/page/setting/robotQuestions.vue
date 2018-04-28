<template>
    <div class="robot-question setting">

        <article class="normal-q-set">
            <header>
                <h2>常见问题设置 </h2>
                <div class="example">
                    <span>示例</span>
                    <div class="example-img"><img src="../../assets/img/robot_welcome_example.jpg" alt="机器人欢迎语示例"></div>
                </div>
                <p class="ps">用户进入机器人会话时, 会收到设置的一组常见问题。</p>
            </header>
            <section  class="template">
                <header>
                    <h3>1.设置常见问题模板</h3>
                </header>
                <!--<ul>-->
                    <!--<li v-for="(temp, index) in robot_guide.templates">-->
                        <!--<span   @click="formSet(index)">-->
                            <!--<el-radio class="radio" v-model="robot_guide.index" :label="index">{{temp.name}}</el-radio><i @click="edit(temp, index)" class="glyphicon glyphicon-pencil"></i>&emsp;-->
                        <!--<i @click="formDel(index)" class="glyphicon glyphicon-trash no-margin"></i>  -->
                        <!--</span>  -->
                    <!--</li>-->
                <!--</ul>-->
                <!--<el-button @click="show_addFAQ=true">添加常见问题模板</el-button>-->
                <table>
                	<tr>
                		<th class="font0">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</th><th></th>
                	</tr>
                    <tr v-for="(temp, index) in robot_guide.templates">
                    	<td>
                    		<span   @click="formSet(index)">
	                            <el-radio class="radio" v-model="robot_guide.index" :label="index">{{temp.name}}</el-radio>
	                        </span>
                    	</td>
                        <td>
                        	<i @click="edit(index), template_title='修改模板'" class="glyphicon glyphicon-pencil pointer font12"></i>&ensp;
                        	<i @click="remove(index)" class="glyphicon glyphicon-trash pointer font12"></i>
                        </td>
                    </tr>
                </table>
                <el-button @click="showAdd()">添加常见问题模板</el-button>
            </section>

            <section class="joins">
                <header>
                    <h3>2.选择常见问题接入平台</h3>
                </header>
				<br />
                <div>
                    <header>
                        <h4>网站接入</h4>
                    </header>
                    <div class="visitor">
                        <span
                            v-bind:class="{used: robot_guide.enableWeb}"
                            @click="webSave('open')">开启</span><span
                            v-bind:class="{unused: !robot_guide.enableWeb}"
                            @click="webSave('close')">关闭</span>
                    </div>
                </div>

                <div class="join-wx">
                    <header>
                        <h4>微信接入</h4>
                    </header>
                    <div class="visitor">
                        <span v-bind:class="{used: robot_guide.enableWx}"  @click="wxSave('open')">开启</span><span v-bind:class="{unused: !robot_guide.enableWx}" @click="wxSave('close')">关闭</span>
                    </div>
                </div>
            </section>
        </article>

        <el-dialog :title="template_title" v-model="show_editTemplate">
            <el-form :model="form.data">
                <el-form-item label="模板名称" :label-width="formLabelWidth">
                    <el-input v-model="form.data.name" auto-complete="off"  :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="常见问题引导" :label-width="formLabelWidth">
                    <el-input v-model="form.data.guideText" auto-complete="off" placehodler='例如 "热门问题"' :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="选择常见问题" :label-width="formLabelWidth">
                    <p v-for="q in form.data.questions">
                        <span>{{q.question}}</span>
                        <el-button @click="rmQuestion(q)" class="font-btn">删除</el-button>
                    </p>
                    <el-button @click="show_addFAQ=true" :class="{'font-btn': form.data.questions.length>0}" :disabled="form.data.questions.length>9"><i class="el-icon-plus" v-show="form.data.questions.length>0"></i>添加常见问题</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="show_editTemplate = false;formClear()">取 消</el-button>
                <el-button type="primary" @click="formSave">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="常见问题" v-model="show_addFAQ" size="small" :show-close="false">
        	<div style=" height:570px;">
        		<selectQuestion :selectedList="form.data.questions"></selectQuestion>
        	</div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="show_addFAQ = false">取 消</el-button>
                <el-button type="primary" @click="show_addFAQ = false;">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import subNav from '../module/subNavVertical.vue'
    import selectQuestion from './module/选择问题.vue'
    import tmpValidate from '../../Validation/questionTmp.js'
    export default {
        props:{},
        data(){
            const star_texts = []
            return {
                isEdit: false,
                template_title: "",
                web: {
                    isUsed: false,
                    radio: "1"
                },
                wx: {
                    isUsed: false,
                    radio: "1"
                },

                robot_guide:{
                    templates: [],
                    index: '-1',
                    enableWeb: false,
                    enableWx: false,
                },
                form: {
                	data:{
                		name: '',
	                    guideText: '',
	                    questions: [],
                	},
                	index:'',
                },
                formLabelWidth: '120px',


                //辅助显示
                show_addFAQ:false,
                show_editTemplate: false,
            }
        },
        created(){
            this.getFormTpls();
        },
        methods:{
            // 获取配置
            getFormTpls(){
            	let v = this;
                this.$api.ajax('/company/setting/robot_guide','get')
                .then(data=>{
                    if(data.robot_guide==null) return ;
                    v.robot_guide = v.deepCopy(data.robot_guide);
                    console.info("....",this.form)
                })
            },
            /*edit(temp, index){
                this.$api.deepCopy(this.form.data ,temp);
                this.form.index = index;
                this.show_addFAQ = true;
            },*/
            edit(i){
                let temp = this.robot_guide.templates[i];
                this.$api.ajax(this.$uri.questions.get,'get', {ids: temp.questions}).then(data=>{
                    var t = {};
                    this.$api.deepCopy(temp,t);
                    t.questions = data.list;
                    this.form.data = t;
                    this.form.index=i;
                    // console.log("data-temp", this.form, this.robot_guide)
                	this.show_editTemplate = true;
                    this.isEdit = true;
                    
                })
            },
            // formDel(index){
            //     console.info(this.robot_guide.index, index)
            //     if(this.robot_guide.index == index){
            //         this.robot_guide.index=-1;
            //     }
            //     this.robot_guide.templates.splice(index,1);
            //     this.settingAjax('robot_guide', 'put', this.robot_guide)
            // },
            // formatIds(data, ids){
            //     let t = [];
            //     for(var i in ids){
            //         for(var j in data){
            //             if(data[j].id === ids[i]){
            //                 t.push({id: data[j].id, name: data[j].name});
            //                 continue;
            //             }
            //         }
            //     }
            //     return t;
            // },
            showAdd(){
                this.formClear();
                this.show_editTemplate=true;
                console.info(this.show_editTemplate)
                this.template_title = "添加模板";
                this.isEdit=false;
            },
            addQuestions(){
                console.info("questions", this.form.questions),
                this.show_addFAQ = false
            },
            // 提交修改
            settingAjax(uri,method, data){
            	let v= this;
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
                    .catch(err=>{
                    	v.getFormTpls();
                    })
            },

            // 机器人基础配置
            webSave(used){
                var action = "";
                if(used == "close"){
                    if(this.robot_guide.enableWeb == false) return ;
                    action = "关闭机器人常见问题网页接入";
                    this.robot_guide.enableWeb = false;
                }else if(used == "open"){
                    if(this.robot_guide.enableWeb == true) return;
                    action = "启用机器人常见问题网页接入";
                    this.robot_guide.enableWeb = true;
                }
                this.robot_guide.action = action;
                this.settingAjax('robot_guide', 'put', this.robot_guide);
            },
            formSet(index){
                if(index == this.robot_guide.index) return ;
                this.robot_guide.index = index
                this.robot_guide.action = "选择机器人常见问题默认模板";
                this.settingAjax('robot_guide', 'put', this.robot_guide)
            },
            formSave(){
                let data = "";
                let qs = []
                data = this.deepCopy(this.form.data);

                console.log("data",data)
                for(var i in data.questions){
                    qs.push(data.questions[i].id);
                }
                data.questions = qs;
                var [isOk, msg] = this.$api.validate(tmpValidate, this.form.data)
                if(isOk){
                    [isOk, msg] = this.isExistName(data.name)
                }
                if(!isOk){
                    this.$message({type:"error", message: msg})
                    return;
                }
                //var formList = this.robot_guide.templates;
                //console.info(formList);
                //if(this.editIndex == -1){
                    //formList.push(this.form);
                    //this.robot_guide.action="新建机器人常见问题模板";
                //}
                //else{
                    //formList[this.editIndex] = this.form;
                    //this.robot_guide.action="修改机器人常见问题模板";
                //}
                //formList[this.form.index] =this.settingAjax('robot_guide', 'put', this.robot_guide)

                //this.show_addFAQ = false;
                console.info("data", this.form.data)
                if(this.isEdit){
                    this.robot_guide.action=`修改模板${data.name}`;
                    this.robot_guide.templates[this.form.index] = this.$api.deepCopy(data);
                    console.info("robot_guide", this.robot_guide.templates[this.form.index])
            	}else{
            		var formList = this.robot_guide.templates;
                    console.info(formList)
                    formList.push(data);
                    this.robot_guide.action="新建机器人常见问题模板";
            	}
                this.settingAjax('robot_guide', 'put', this.robot_guide)
                this.show_editTemplate = false;
                this.formClear();
            },
            isExistName(name){
                var templates = this.robot_guide.templates
                for(var i=0, len=templates.length; i<len; i++){
                    if(this.form.index === i) continue;
                    if(name == templates[i].name) return [false, "已存在该模板名称"]
                }
                return [true, ""];
            },
            deepCopy(from){
                return JSON.parse(JSON.stringify(from))
            },
            wxSave(used){
                var action = "";
                if(used == "close"){
                    if(this.robot_guide.enableWx == false) return ;
                    action = "关闭机器人常见问题微信接入";
                    this.robot_guide.enableWx = false;
                }else if(used == "open"){
                    if(this.robot_guide.enableWx == true) return;
                    action = "开启机器人常见问题微信接入";
                    this.robot_guide.enableWx = true;
                }
                this.robot_guide.action = action;
                this.settingAjax('robot_guide', 'put', this.robot_guide);
            },
            deepCopy(from){
                return JSON.parse(JSON.stringify(from))
            },
            formClear(){
                this.editIndex = -1;
                this.form = {
                	index:'',
                	data:{
                		name: '',
	                    guideText: '',
	                    questions: []
                	}
                }
            },
            rmQuestion(q){
                let qs = this.form.data.questions;
                for(var i in qs){
                    if(q.id === qs[i].id) qs.splice(i,1);
                }
            },
			remove(i){
				let v = this;
				this.$confirm(`确定要删除模板-‘${v.robot_guide.templates[i].name}’吗?`,'提示',{
					confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		     	}).then(() => {
                    console.info(i, v.robot_guide.index)
                    if(v.robot_guide.index == i){
                        v.robot_guide.index=-1;
                    }
		     		v.robot_guide.action=`删除模板${v.robot_guide.templates[i].name}`;
		          //	delete v.robot_guide.templates[i];
		          	v.robot_guide.templates.splice(i,1)
		          	v.settingAjax('robot_guide', 'put', v.robot_guide);
		        })
			},
        },
        components:{
            subNav,selectQuestion
        }
    }
</script>
<style>
    .robot-question .no-margin {margin: 0!important}
    .robot-question section {margin-left:50px; font-size:1.4rem;}
    .normal-q-set .example {display: inline-block; position: relative;}
    .normal-q-set .example-img { width: 369px; position: absolute; left: -6px; display: none; cursor: pointer;}
    .normal-q-set .example-img:hover {display: block;}
    .normal-q-set .example span:hover + .example-img {display: block;}
    .normal-q-set .example-img img{ width: 100%; box-shadow: 0 2px 3px #ddd; position: relative; top: -1px; z-index: 10;}
    .normal-q-set .example-img::before {content: ""; display: block; height: 0px; width: 0px; border: solid; border-width:6px; border-color: transparent transparent #328dff; margin-left: 40px; z-index: 100;}
    .normal-q-set > header span{padding: 4px 11px; border: solid 1px #ccc; background: #fafafa; margin-left: 15px; cursor: pointer;}
    .robot-question .joins section{margin-top: 25px;}
    .robot-question h3{font-size: 1.6rem; margin: 20px 0 10px 0;}

    .robot-question .normal-q-set > section { margin-top: 45px; }
    .robot-question .template button{
        margin-top: 20px;
    }
    .robot-question .template li > span {padding-right: 15px}
    .robot-question .template li i {display: none; margin-left: 20px; cursor: pointer;}
    .robot-question .template li i:hover{display: inline;}
    .robot-question .template li > span:hover > i{display: inline;}
    .robot-question .template tr td:nth-child(1) { padding-right: 15px; }
    .robot-question .visitor{margin: 10px 0;}
    .robot-question .join-wx{margin-top: 45px;}
    .robot-question .checks > div {display: inline; margin-right: 15px;}
    .robot-question .el-form-item p .font-btn{margin-left: 15px;}
    .robot-question .el-form-item .el-icon-plus {background: rgb(32, 160, 255); color: white; padding: 2px; margin-right: 3px;}
    .robot-question .el-form-item button[disabled="disabled"] .el-icon-plus {background: #ccc}
    .robot-question .el-form-item .el-form-item__content {padding-left: 20px;}
    .robot-question .el-dialog--small { width: 600px; }
    .robot-question .el-dialog--small .el-dialog__body { padding: 30px 50px 30px 20px;  }
    .robot-question .el-dialog--small .el-dialog__footer { padding: 10px 50px 15px; }
/*    .robot-question .set-info { min-width: 940px; }
    .robot-question .set-info .set-head { width: 200px; position: absolute; text-align: center;}
    .robot-question .set-info .set-head h3 {margin: 20px 0;}
    .robot-question .set-info .set-msg { padding-left: 250px; }
    .robot-question .set-info .set-msg .el-input { display: inline-block;  width: 200px;}
    .robot-question .set-info .set-msg .el-row {margin: 20px 5px;}
    .robot-question .set-info .set-msg .el-row:nth-child(2) { margin: 30px 5px; }
    .robot-question .set-info .set-msg label { margin-right: 5px;}
    .robot-question .set-info .set-msg > section{ width: 250px; margin: 0 auto; }
    .robot-question .set-info .set-msg h3{ text-align: center; }
 /*   .robot-question .set-info .set-msg div{ height: 170px; border: solid 1px #ccc; position: relative;}*/
/*    .robot-question .set-info .el-button {margin-top: 20px;}
    .robot-question .set-info .head-img img {height: 85px; width: 85px;margin: auto; border-radius: 50%;}*/
</style>
