<template>
    <div class="online-base setting">
        <!--<article>
            <header>
                <h2>会话分配</h2>
            </header>
            
            <section>
                <header>
                    <h3>历史咨询优先分配</h3>
                </header>
                <p class="ps2">开启后, 访客自动分配给上一次服务的客服</p>
                <div class="visitor">
                    <span 
                        v-bind:class="{used: user.isChatContinue}"  
                        @click="save('open', 'isChatContinue')">开启</span><span 
                        v-bind:class="{unused: !user.isChatContinue}"
                        @click="save('close', 'isChatContinue')">关闭</span>
                </div>
            </section>
        </article>-->

        <article class="wel">
            <header>
                <h2>欢迎语设置</h2>
            </header>
            <section>
                <label for="">欢迎语 :</label>
                <textarea name="" id="" cols="30" rows="10" v-model="welcomeText" class="wel-text"></textarea>
                <el-button :disabled="user.welcomeText==welcomeText" type="primary" @click="welSave">保存</el-button>
            </section>
        </article>

        <article>
            <header>
                <h2>未选择分类提示</h2>
            </header>
            <section>
                <header>
                    <h3>未选择分类提示</h3>
                </header>
                <p class="ps2">开启后，当客服结束在线会话时，会判断是否已选择会话分类，若未选择分类，会提示客服进行会话的分类选择</p>
                <div class="visitor">
                    <span 
                        v-bind:class="{used: user.isNeedSort}"  
                        @click="save('open', 'isNeedSort')">开启</span><span 
                        v-bind:class="{unused: !user.isNeedSort}"
                        @click="save('close', 'isNeedSort')">关闭</span>
                </div>
            </section>
        </article> 

        <!--<article>
            <header>
                <h2>满意度邀请</h2>
            </header>
            <section>
                <header class="margin">
                    <h3>满意度开关</h3>
                    <p class="ps2">开启后，会话结束时，若访客没有主动评价且没有收到客服邀评，会收到满意度评价邀请的推送</p>
                </header>
                <div class="visitor">
                    <el-row class="satisfaction">
                        <header>
                            <h4>Web</h4>
                        </header>
                        <div class="visitor">
                            <span 
                                v-bind:class="{used: user.isEvaluateWeb}"  
                                @click="save('open', 'isEvaluateWeb')">开启</span><span 
                                v-bind:class="{unused: !user.isEvaluateWeb}"
                                @click="save('close', 'isEvaluateWeb')">关闭</span>
                        </div>
                    </el-row>
                    <el-row class="satisfaction">
                        <header>
                            <h4>微信</h4>
                        </header>
                        <div class="visitor">
                            <span 
                                v-bind:class="{used: user.isEvaluateWx}"  
                                @click="save('open', 'isEvaluateWx')">开启</span><span 
                                v-bind:class="{unused: !user.isEvaluateWx}"
                                @click="save('close', 'isEvaluateWx')">关闭</span>
                        </div>
                    </el-row>
                    <el-row v-show="user.isEvaluateWeb||user.isEvaluateWx" class="over-evaluate-time">
                        <div class="title">
                            <p>评价过期时间</p>
                        </div>
                        <div>
                            <input v-model="timeStopEvaluate"></input>
                        </div>
                        <div class="u">
                            <p>分钟</p>
                        </div>
                    </el-row>

                    <el-row  class="error" >
                        <div>
                            <p v-show="!checkTime(timeStopEvaluate, 0, -1)&&(user.isEvaluateWeb||user.isEvaluateWx)">请输入大于0的数字</p>
                        </div>
                    </el-row>
                </div>
                <el-row class="save-btn" v-show="user.isEvaluateWeb||user.isEvaluateWx">
                    <el-col :span="5">
                        <el-button type="primary" :disabled="user.timeStopEvaluate==timeStopEvaluate || !checkTime(timeStopEvaluate, 0, -1)"  @click="timeStopEvaluateSave" >保存</el-button>  
                    </el-col>
                </el-row>
            </section>
        </article>-->
        <article>
            <header>
                <h2>会话计时设置</h2>
            </header>
            <section>
                <p class="ps2">开启后,会话时长超出设置时间时,系统将提示当前会话时长</p>
                <div class="visitor chat-time">
                    <el-row>
                        <div class="title">
                            <p>会话计时</p>
                        </div>
                        <div>
                            <span 
                                v-bind:class="{used: user.isNeedTimeShow}"  
                                @click="save('open', 'isNeedTimeShow')">开启</span><span 
                                v-bind:class="{unused: !user.isNeedTimeShow}"
                                @click="save('close', 'isNeedTimeShow')">关闭</span>
                        </div>
                    </el-row>
                    <el-row v-show="user.isNeedTimeShow"> 
                        <div class="title">
                            <p>计时开始时间</p>
                        </div>
                        <div>
                            <input v-model="timeShow.min" maxlength="3" ></input>
                        </div>
                        <div class="u">
                            <p>分</p>
                        </div>
                        <div>
                            <input v-model="timeShow.sec" maxlength="3" ></input>
                        </div>
                        <div :span="1" class="u">
                            <p>秒</p>
                        </div>
                    </el-row>
                    <el-row  class="error">
                        <div>
                            <p v-show="(!checkTime(timeShow.min, 0, 99) || !checkTime(timeShow.sec, 0, 59))&&user.isNeedTimeShow">请输入小于100分, 小于60秒的正整数</p>
                        </div>
                    </el-row>
                </div>
                <el-row class="save-btn" v-show="user.isNeedTimeShow">
                    <div>
                        <el-button type="primary" :disabled="user.timeShow==timeShow.min+':'+timeShow.sec ||!checkTime(timeShow.min, 0, 99) || !checkTime(timeShow.sec, 0, 59)"  @click="timeShowSave" >保存</el-button>  
                    </div>
                </el-row>
            </section>
        </article> 
        <article class="message-danger">
            <header>
                <h2>消息计时设置</h2>
            </header>
            <section>
                <p class="ps2">开启后,访客消息未处理时间超过设置时间时，在会话窗口以不同颜色气泡显示提醒</p>
                <div class="visitor">
                    <el-row>
                        <el-col :span="12" class="chat-time">
                            <el-row class="danger-row">
                                <div class="title">
                                    <p>消息超时</p>
                                </div>
                                <div>
                                    <span 
                                        v-bind:class="{used: user.isNeedMessageDanger}"  
                                        @click="save('open', 'isNeedMessageDanger')">开启</span><span 
                                        v-bind:class="{unused: !user.isNeedMessageDanger}"
                                        @click="save('close', 'isNeedMessageDanger')">关闭</span>
                                </div>
                            </el-row>
                            <el-row v-show="user.isNeedMessageDanger" class="danger-row"> 
                                <div class="title">
                                    <p>消息时间</p>
                                </div>
                                <div class="set-time">
                                    <input value="0" readonly="true" ></input>
                                    <i class="line"></i>
                                    <input v-model="danger.toNormal" v-输入验证="'[1-9][0-9]*'"></input>
                                    <p>秒</p>
                                </div>
                                <div class="bubble-wrapper">气泡颜色<i class="c1 bubble"></i>
                                </div>
                            </el-row>
                            <el-row v-show="user.isNeedMessageDanger" class="danger-row"> 
                                <div class="title">
                                    <p>消息时间</p>
                                </div>
                                <div class="set-time">
                                    <input v-model="danger.toNormal"  v-输入验证="'[1-9][0-9]*'"></input>
                                    <i class="line"></i>
                                    <input v-model="danger.toDanger"  v-输入验证="'[1-9][0-9]*'"></input>
                                    <p>秒</p>
                                </div>
                                <div class="bubble-wrapper">气泡颜色<i class="c2 bubble"></i>
                                </div>
                            </el-row>
                            <el-row v-show="user.isNeedMessageDanger" class="danger-row"> 
                                <div class="title">
                                    <p>消息时间</p>
                                </div>
                                <div class="set-time" style="text-align:right;">
                                    <p>大于&emsp;&emsp;&emsp;&emsp;</p>
                                    <input v-model="danger.toDanger"  v-输入验证="'[1-9][0-9]*'"></input>
                                    <p>秒</p>
                                </div>
                                <div class="bubble-wrapper"> 气泡颜色<i class="c3 bubble"></i>
                                </div>
                            </el-row>
                        </el-col>
                        <el-col :span="12" class="danger-view">
                            <div><img src="../../assets/img/message_danger_view.jpg" alt="消息气泡的颜色"></div>
                        </el-col>
                    </el-row>

                    <el-row  class="error">
                        <div>
                            <p v-show="(!checkTime(timeShow.min, 0, 99) || !checkTime(timeShow.sec, 0, 59))&&user.isNeedMessageDanger">请输入小于100分, 小于60秒的正整数</p>
                        </div>
                    </el-row>
                    
                </div>
                <el-row class="save-btn" v-show="user.isNeedTimeShow">
                    <div>
                        <el-button type="primary" :disabled="user.messageDangerRange == danger.toNormal+'-'+danger.toDanger || !checkTime(timeShow.sec, 0, 59)"  @click="messageDangerRangeSave" >保存</el-button>  
                    </div>
                </el-row>
            </section>
        </article> 

 

        <!--<article>
            <header>
                <h2>会话超时设置</h2>
            </header>
            <section>
                <p class="ps2">开启后，在设置的时间内没有新消息产生，系统将自动关闭会话；并且向访客发送相应提示语</p>
                <div class="visitor chat-time">
                    <el-row>
                        <div class="title">
                            <p>会话超时</p>
                        </div>
                        <div>
                            <span 
                                v-bind:class="{used: user.isNeedTimeStopServer}"  
                                @click="save('open', 'isNeedTimeStopServer')">开启</span><span 
                                v-bind:class="{unused: !user.isNeedTimeStopServer}"
                                @click="save('close', 'isNeedTimeStopServer')">关闭</span>
                        </div>
                    </el-row>
                    <el-row v-show="user.isNeedTimeStopServer">
                        <div class="title">
                            <p>会话超时时间</p>
                        </div>
                        <div>
                            <input v-model="timeStopServer"  maxlength="3"></input>
                        </div>
                        <div class="u">
                            <p>分钟</p>
                        </div>
                    </el-row>
                    <el-row  class="error" >
                        <div>
                            <p v-show="!checkTime(timeStopServer, 3, 720)&&user.isNeedTimeStopServer">请输入3~720之间的数字</p>
                        </div>
                    </el-row>
                </div>
                <el-row class="save-btn" v-show="user.isNeedTimeStopServer">
                    <el-col :span="5">
                        <el-button type="primary" :disabled="user.timeStopServer==timeStopServer || !checkTime(timeStopServer, 3, 720)"  @click="timeStopServerSave" >保存</el-button>  
                    </el-col>
                </el-row>
            </section>
        </article>-->

    	<article class="online-base_kf-statuses">
    		<header>
                <h2>客服状态设置</h2>
            </header>
            <section>
            	<table class="table3">
            		<thead>
	            		<tr>
	            			<th>状态名称</th>
	            			<th>权限</th>
	            			<th>状态标识颜色</th>
	            			<th>是否启用</th>
	            			<th>操作</th>
	            		</tr>
            		</thead>
            		<tbody>
	            		<tr v-for="(item,i) in kf_statuses">
	            			<td>
	            				<input v-if="(item.isEditEnable && item.edit) || item.label.trim()==''" v-focus.bind="true" v-model="item.label" @keydown.enter="item.edit=false" @blur="item.edit=false" maxlength="4" class="name" />
	            				<span v-if="!((item.isEditEnable && item.edit) ||  item.label.trim()=='')" @click="item.edit = true" >{{item.label}}</span>
	            				<!--<span :contenteditable="item.isEditEnable && item.edit" @keydown="keydownStatuses($event,i)" @input="inputKfStatuses($event, i)" @click="editKfStatusLabel($event, item)" @keydown.13="item.edit=false" @blur="item.edit=false" @paste="$api.pasteHandler" v-focus.bind="item.isEditEnable && item.edit" class="name" :class="{empty: item.label.trim()===''}" >{{item.show}}</span>-->
	            			</td>
	            			<td>
	            				<el-checkbox v-model="item.status"  :disabled="!item.isEditEnable" :true-label="1" :false-label="0">接待会话</el-checkbox>
	            			</td>
	            			<td>
	            				<color-select :color.sync="item.color"  :disabled="!item.isEditEnable"></color-select>
	            				<!--<el-color-picker v-model="item.color"  v-if="item.isEditEnable"></el-color-picker>-->
	            			</td>
	            			<td>
	            				 <i-switch v-model="item.isEnable" size="small" :disabled="!item.isEditEnable"></i-switch>
	            				 <span v-if="!item.isEditEnable" class="disabled">默认项不可修改</span>
	            			</td>
	            			<td><span class="operate-remove pointer" v-if="item.isEditEnable" @click="removeKfStatus(i)">删除</span></td>
	            		</tr>
            			<tr>
            				<td colspan="5" class="text-center"><span @click="addKfStatuses" class=" ps2 unselect pointer"><i class="fa fa-plus"></i> 新增状态</span></td>
            			</tr>
            		</tbody>
            	</table><br />
            	<el-row class="save-btn">
                    <div>
                        <el-button type="primary" @click="updateKfStatus" :disabled="!change_kf_statuses">保存</el-button>
                    </div>
                </el-row>
            </section>
    	</article>


        <article class="chat-close-set">
            <header>
                <h2>结束会话设置</h2>
            </header>
            <section>
                <el-row>
                    <el-col :span="12" class="visitor">
                        <p class="ps2">开启后，访客可以通过“转机器人”主动结束人工回话</p>
                        <span :class="{used: isKH2REnable}"
                              @click="putSessionEndSet(true)">
                                开启
                            </span>
                        <span :class="{unused: !isKH2REnable}"
                              @click="putSessionEndSet(false)">
                                关闭
                            </span>
                    </el-col>
                    <el-col :span="12">
                        <template v-if="isKH2REnable">
                            <p class="preview-title">预览</p>
                            <div class="preview-box">
                                <div class="preview">
                                    <div class="head" :style="returnStyle('标题栏')">
                                        <template v-if="dialogStyle.showWay==='name'">
                                            {{dialogStyle.name}}
                                        </template>
                                        <template v-else>
                                            <img :src="dialogStyle.logo" alt="logo" v-if="dialogStyle.logo">
                                            <template v-else>LOGO</template>
                                        </template>
                                        <div class="btn-area">
                                            <span>转机器人</span>
                                            <span>转人工</span>
                                        </div>
                                    </div>
                                    <div class="body">
                                        <hr>
                                        <hr>
                                        <div class="msg left">
                                            <div class="head-icon">
                                                <img :src="dialogStyle.kfImg" alt="头像" v-if="dialogStyle.kfImg">
                                                <i class="kf-defined-img" v-else></i>
                                            </div>
                                            <div class="content">
                                                <i class="glyphicon glyphicon-triangle-left"></i>
                                            </div>
                                        </div>
                                        <div class="msg right">
                                            <div class="head-icon" :style="returnStyle('用户头像')">
                                                <img :src="dialogStyle.yhImg" alt="头像" v-if="dialogStyle.yhImg">
                                                <i class="my-fa my-icon-user" v-else></i>
                                            </div>
                                            <div class="content" :style="returnStyle('对话气泡')">
                                                <i class="glyphicon glyphicon-triangle-right"></i>
                                            </div>
                                        </div>
                                        <div class="msg right">
                                            <div class="head-icon" :style="returnStyle('用户头像')">
                                                <img :src="dialogStyle.yhImg" alt="头像" v-if="dialogStyle.yhImg">
                                                <i class="my-fa my-icon-user" v-else></i>
                                            </div>
                                            <div class="content" style="height: 75px;" :style="returnStyle('对话气泡')">
                                                <i class="glyphicon glyphicon-triangle-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="foot">
                                        <span :style="returnStyle('按钮')">发送</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-col>
                </el-row>
            </section>
        </article>
    </div>

</template>
<script>
    import subNav from '../module/subNavVertical.vue'
    import colorSelect from './module/color_select.vue'
    export default {
        props:{},
        data(){

            return {
                actions: {
                    isEvaluateWx: "微信满意度",
                    isEvaluateWeb: "H5满意度",
                    isNeedSort: "未选择分类提示",
                    isChatContinue: "历史咨询优先",
                    isNeedMessageDanger: '消息超时',
                    isNeedTimeShow: '会话计时'
                },
                welcomeText: "",
                timeShow:{
                    min: "",
                    sec: "",
                },
                danger:{
                    toNormal: 30,
                    toDanger: 120,
                },
                timeStopEvaluate: "5",
                timeStopServer: "",
                user: {
                    isChatContinue: false,  //　咨询优先
                    welcomeText: '',        //　欢迎语
                    notOnlineText: '当前客服不在线，如需帮助请留言',
                    isNeedSort: false,      // 必须分类
                    isEvaluateWeb: false,   // 是否开启客服评价web
                    isEvaluateWx: false,    // 是否开启客服评价微信
                    isNeedLeaveText: false, // 是否开启留言设置
                    isNeedTimeShow: false,  // 是否开启超时显示时间
                    isNeedMessageDanger: false,     // 是否开启消息紧急提醒
                    isNeedTimeStopServer: false,    // 是否开启过时结束会话功能
                    timeSolveOnce: false,   // 一次性解决统计时间设置
                    timeStopServer: "",     // 过时结束会话
                    timeStopEvaluate: "5",   // 过时关闭评价功能
                    timeShow: "",           // 超过这个设置，显示时间
                    messageDangerRange: "30-120", // 0-30不紧急, 30-120紧急, 120\以上非常紧急
                    contactWay: {           // 留言的联系方式
                        phone: false,
                        email: false,
                    }
                },
                isKH2REnable: true,
                dialogStyle: {
                    color: '',
                    isFocus: 4,
                    kfImg: '',
                    logo: '',
                    name: '',
                    needColorList: [],
                    showWay: 'name',
                    uColor: '',
                    yhImg: ''
                },
                kf_statuses: null,
                copy_kf_statuses: null,
                change_kf_statuses: false,
                AUX:{
                	colors: [ '#4EA2FB', '#EE5659', '#FEB942', '#A4ABB1', '#90644A', '#6F56ED' ],
                }
            }
        },
        created(){
            this.getUser();
            this.getKfStatuses();
            this.getSessionEndSet()
        },
        methods:{
            getUser(){
                this.$api.ajax('/company/setting/user', 'get').then(data=>{
                    if(data.user == null) return ;
                    this.user = data.user;
                    this.welcomeText = this.user.welcomeText;
                    this.timeShow.min = this.user.timeShow.split(":")[0];
                    this.timeShow.sec = this.user.timeShow.split(":")[1] || "";
                    this.timeStopServer = this.user.timeStopServer || "";
                    this.timeStopEvaluate = this.user.timeStopEvaluate;
                    this.danger.toNormal = this.user.messageDangerRange.split('-')[0];
                    this.danger.toDanger = this.user.messageDangerRange.split('-')[1];
                })
            },
            getKfStatuses(){
            	let v = this;
            	v.$api.ajax(v.$uri.user.allkfStatus, 'get')
            	.then(data=>{
            		data.kf_status.forEach(val=> {val.edit = false; })
            		v.kf_statuses = data.kf_status;
            		v.copy_kf_statuses = v.$api.deepCopy( data.kf_status);
            		this.change_kf_statuses = false;
            		v.$store.dispatch('setKfStatuses', v.$api.deepCopy( v.kf_statuses));
            	})
            },
            removeKfStatus(i){
            	let v = this;      
            	let status = v.copy_kf_statuses[i];
            	let ischange = v.change_kf_statuses;
            	if( status ){
            		v.$api.ajax(v.$uri.user.allkfStatus, 'delete', {
            			data:{
            				label: status.label,
            				status: status.status
            			}
            		}).then(data=>{
            			v.copy_kf_statuses.splice(i,1);
            			v.kf_statuses.splice(i,1);
            			setTimeout(()=>{
            				v.change_kf_statuses = ischange;
            			},100);
            			v.$store.dispatch('setKfStatuses', v.$api.deepCopy( v.kf_statuses));
            		})
            	}else{
            		v.kf_statuses.splice(i,1);
            	}
            },
            updateKfStatus(){
            	let v = this;
            	let labels = [];
            	v.kf_statuses.forEach(val=>{
            		val.label = val.label.trim();
            		labels.push(val.label);
            	});
            	if(labels.length != [...new Set(labels)].length){
            		v.$api.warn('客服状态名不能重复！');
            		return false;
            	}
            	v.$api.ajax(v.$uri.user.allkfStatus, 'put', v.kf_statuses)
            	.then(data=>{
            		v.copy_kf_statuses = v.$api.deepCopy(v.kf_statuses);
            		this.change_kf_statuses = false;
            		v.$store.dispatch('setKfStatuses', v.$api.deepCopy( v.kf_statuses));
            	})
            },
            addKfStatuses(){
            	let v = this;
            	let kf_status = {
            		label:'', status: 0, color: '#A4ABB1', isEditEnable : true, isEnable: true, edit:true,
            	};
            	v.kf_statuses.push(kf_status);
            },
            checkTime(timeStr, minLimit, maxLimit){
                console.info('timeStr', timeStr);
                if(!/^\d+$/.test(timeStr)) return false;
                var time = parseInt(timeStr);
                if(minLimit == -1) return time < maxLimit ? true : false;
                if(maxLimit == -1) return time > minLimit ? true : false;
                if(time <= maxLimit && time >= minLimit) return true;
                return false;
                
            },
            save(used, name){
                if(used == "close"){
                    if(this.user[name] == false) return ;
                    this.user[name] = false;
                    console.info(name)
                    this.user.action = "关闭"+this.actions[name];
                }else if(used == "open"){
                    if(this.user[name] == true) return;
                    this.user[name] = true;
                    this.user.action = "启用"+this.actions[name];
                }
                if(name == 'isNeedMessageDanger'){   
                	this.$store.state.global.enums.is_need_message_danger =( used == "close"?false:true);    
                }
                this.settingAjax('user', 'put', this.user);
            },
            timeStopServerSave(){
                this.user.action = "修改会话超时";
                this.user.timeStopServer = this.timeStopServer;
                this.settingAjax('user', 'put', this.user);
            },
            timeStopEvaluateSave(){
                this.user.action = "修改评价过期时间";
                this.user.timeStopEvaluate = this.timeStopEvaluate;
                this.settingAjax('user', 'put', this.user);
            },  
            timeShowSave(){
                this.user.action = "修改会话计时";
                this.user.timeShow = this.timeShow.min + ":" + this.timeShow.sec;
                this.settingAjax('user', 'put', this.user);
            },
            welSave(){
                this.user.action = "修改客服欢迎语";
                this.user.welcomeText = this.welcomeText;
                this.settingAjax('user', 'put', this.user);
            },
            messageDangerRangeSave(){
            	if(Number(this.danger.toNormal)>Number(this.danger.toDanger)){
            		[this.danger.toNormal,this.danger.toDanger] = [this.danger.toDanger,this.danger.toNormal];
            	}
            	this.user.action = "修改消息计时设置";
                this.user.messageDangerRange =  this.danger.toNormal+'-'+ this.danger.toDanger;
                this.settingAjax('user', 'put', this.user).then(data=>{   
                	this.$store.state.global.enums.message_danger_range = this.user.messageDangerRange;   
                });
            },
            // 提交修改
            settingAjax(uri,method, data){
            	return new Promise((resolve,reject)=>{
            		this.$api.ajax( '/company/setting/'+uri,method,  data
                    ).then(data=>{
                        this.$message({
                            type: 'success',
                            message: "修改成功"
                        });
                        resolve(data);
                    });
            	})
            },
            // 会话结束设置
            getSessionEndSet () {
                this.$api.ajax(this.$uri.setting.online.chatClose, 'get').then(data => {
                    if (Object.keys(data['chat_close']).length > 0) {
                        this.isKH2REnable = data['chat_close'].isKH2REnable
                        if (data['chat_close'].dialogStyle) {
                            this.dialogStyle = data['chat_close'].dialogStyle
                        }
                    }
                })
            },
            putSessionEndSet (boolean) {
                this.isKH2REnable = boolean
                const params = {
                    action: '修改结束会话设置',
                    isKH2REnable: boolean
                }
                this.$api.ajax(this.$uri.setting.online.chatClose, 'put', params).then(data => {
                    this.$message.success('修改成功')
                })
            },
            returnStyle (type) {
                let style = {}
                try {
                    if (this.dialogStyle.needColorList.indexOf(type) > -1 || type === '按钮') {
                        switch (type) {
                            case '标题栏':
                                style = {
                                    'background-color': this.dialogStyle.color,
                                    color: 'white',
                                    'border-color': 'white'
                                }
                                break
                            case '对话气泡':
                                style = {
                                    'background-color': this.dialogStyle.color,
                                    color: this.dialogStyle.color
                                }
                                break
                            case '用户头像':
                                style = {
                                    'background-color': this.dialogStyle.color,
                                    color: 'white'
                                }
                                break
                            case '按钮':
                                style = {
                                    'background-color': this.dialogStyle.color,
                                    color: this.dialogStyle.color ? 'white' : '',
                                    'border-color': this.dialogStyle.color
                                }
                                break
                            default: break
                        }
                    }
                } catch (e) {}
                return style
            }
            
        },
        watch:{
        	kf_statuses:{
        		handler(n,o){
	        		if(!o) return false;
	        		this.change_kf_statuses = true;
	        	},deep:true
        	}
        },
        beforeRouteLeave (to,from,next){
            var user = this.user;
            var timeShow = this.timeShow.min == "" ? "" : (this.timeShow.min+':'+this.timeShow.sec);
            console.info(this.welcomeText, this.timeStopServer, timeShow, user)
            if(this.welcomeText!=user.welcomeText ||
               this.timeStopServer!=user.timeStopServer ||
               user.timeShow!=timeShow || 
            	this.change_kf_statuses){
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
            colorSelect
        }
    }
</script>
<style type="text/scss" lang="scss">
    .online-base h3{font-size: 1.6rem; margin: 20px 0 10px 0;}
    .online-base .danger-row,
    .online-base section .visitor > div{margin: 10px 0 30px;}
    .online-base section .visitor .error {min-height: 30px; margin: 0;}
    .online-base section .visitor .error p{color: #FF4949; position: relative; top: -20px;}
    .online-base section .visitor .u{line-height: 30px; margin-left: 10px;}
    .online-base section .save-btn button{margin-top: 0}
    .online-base section .visitor .title{text-align: left; width: 84px; line-height: 30px; margin: 0 15px 0 0;}
    .online-base section {margin-left:50px; font-size:1.4rem;}
    .online-base section input {height: 40px; width: 340px; border: 1px solid #e6eaeb; padding: 10px}
    .online-base section .el-col input {height: 100%; width: 100%;}
    .online-base section label{text-align: right; font-size: 1.6rem; font-weight: 400}
    .online-base .wel label {vertical-align: top;}
    .online-base .el-button {display: block; margin: 30px 0 0;}
    .online-base .wel-text { height: 50px; margin-left: 20px; }
    .online-base section input[name="time"] {width:100px;}

    .online-base .over-evaluate-time.el-row div,
    .online-base .chat-time .el-row div{ display: inline-block; }

    .online-base .over-evaluate-time input,
    .online-base .chat-time input {width: 100px;}
    .online-base .satisfaction header,
    .online-base .satisfaction .visitor {display: inline-block;}
    .online-base .satisfaction header {margin-right: 30px;}

    .online-base .message-danger .el-col input { width: 60px; }

    .online-base .bubble-wrapper {position: relative; margin-left: 15px;}
    .online-base section .bubble {display:inline-block; width:10px; height:10px; border-radius:8px;  position:absolute; top:0; bottom:0; margin:auto; margin-left: 5px;}

    .online-base i.line {height: 1px; width: 10px; background: black; display: inline-block;}
    .online-base .message-danger .line{position: relative; top: -4px; margin: 0 5px;}
    .online-base .message-danger input[readonly="true"] {border: none;}
    .online-base .message-danger section .visitor .title {width: 60px;}
    .online-base .message-danger .danger-view {position: relative; height: 300px;}

    .online-base .message-danger .set-time { width: 176px;  text-align: center;}
    .online-base .message-danger .set-time p{display: inline;}
    .online-base .message-danger .danger-view img{height: 100%;}
    .online-base .message-danger .danger-view div{height: 280px; width: 262px; border: solid 1px #e5e5e5; padding: 10px; position: absolute; left: 0; right: 0; top: 0; bottom: 0; margin: auto; box-sizing: content-box;}
    .online-base .c1 {background:#33c848;}
    .online-base .c2 {background:#fec03b;}
    .online-base .c3 {background:#f54a45;}

    .online-base .chat-close-set {
        .ps2 {
            margin-bottom: 10px;
        }
        .preview-title {
            font-size: 1.6rem;
            margin-top: 10px;
        }
        .preview-box {
            width: 356px;
            height: 375px;
            margin-top: 18px;
            padding: 19px;
            border: 1px solid #e5e5e5;
        }
        .preview {
            width: 100%;
            height: 100%;
            box-shadow: 0 0 10px #ccc;
            user-select:none;

            .head {
                height: 27px;
                line-height: 27px;
                border-bottom: 1px solid rgb(229, 229, 229);
                text-align: center;
                position: relative;

                img {
                    display: block;
                    height: 25px;
                    margin: 1px auto;
                    border-radius: 50%;
                }

                .btn-area {
                    position: absolute;
                    top: 0;
                    right: 10px;
                    text-align: right;
                    font-size: 12px;
                    display: flex;

                    span {
                        display: block;
                        height: 23px;
                        line-height: 23px;
                        border: 1px solid #fff;
                        padding: 0 4px;
                        transform: scale(.7);
                        transform-origin: right;
                        margin-top: 2px;
                        &:first-child {
                            margin-right: -8px;
                        }
                    }
                }
            }

            .body {
                hr {
                    height: 5px;
                    margin: 10px auto;
                    background-color: #e7eff8;
                    border: none;

                    &:first-child { width: 70px; }
                    &:nth-of-type(2) { width: 190px; }
                }
                .msg {
                    &:after{
                        content: '';
                        display: block;
                        clear: both;
                    }

                    &.left {
                        margin: 10px 10px 20px 10px;
                        &>* {
                            float: left;
                        }
                        .content {
                            margin-left: 10px;
                            i {
                                left: -8px;
                            }
                        }
                    }

                    &.right {
                        margin: 10px;
                        &>* {
                            float: right;
                        }
                        .content {
                            margin-right: 10px;
                            i {
                                right: -8px;
                            }
                        }
                    }

                    .head-icon {
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        box-shadow: 1px 1px 10px 1px #d9e2ec;
                        overflow: hidden;

                        * {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }

                        i {
                            line-height: 25px;
                            text-align: center;
                        }

                        .kf-defined-img {
                            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWMAAAFjCAYAAADowmrhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUI2MTk5MEU3NzYxMTFFNzg5MUI5MUQ4QjIzNjFDMjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUI2MTk5MEQ3NzYxMTFFNzg5MUI5MUQ4QjIzNjFDMjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSI1RTVEQ0I5RTAxRUNENzBDNUIzMjUwRTAwNzQ4MkVBRiIgc3RSZWY6ZG9jdW1lbnRJRD0iNUU1RENCOUUwMUVDRDcwQzVCMzI1MEUwMDc0ODJFQUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6btOICAAAjaUlEQVR42uydf4hW1brHVzITjJcmcIIJUhj/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");
                            background-size: cover;
                        }
                    }

                    .content {
                        width: 85px;
                        height: 25px;
                        border-radius: 5px;
                        box-shadow: 1px 1px 10px 1px #d9e2ec, -10px 0 14px -7px #d9e2ec;
                        position: relative;
                        color: #fff;

                        i {
                            position: absolute;
                            top: 5px;
                        }


                    }
                }
            }

            .foot {
                height: 90px;
                margin-top: 20px;
                border-top: 1px solid rgb(229, 229, 229);
                position: relative;

                span {
                    display: inline-block;
                    position: absolute;
                    right: 10px;
                    bottom: 5px;
                    font-size: 12px;
                    border: 1px solid rgb(229, 229, 229);
                    background-color: #fff;
                    padding: 1px 5px;
                }
            }
        }
    }

    .online-base{
    	.online-base_kf-statuses{
    		.el-color-picker {
    			width:17px; height:17px; overflow:hidden; opacity:0;
    			position:relative; left:-21px; top:3px;
    		}
    		.ivu-switch-disabled.ivu-switch-checked{
    			background-color: lighten(#2d8cf0, 20);
    			border-color: lighten(#2d8cf0, 20);
    			&:after {
    				background: #fff;
    			}
    		}
    		table{max-width:800px;}
    		.name{
    			max-width:70px;
    			line-height:15px;
    			height:25px;
    			padding: 3px 5px;
    			
    		}
    		.empty {
    			
    		}

    	}
    }
</style>
