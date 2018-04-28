<template>
	<div class="session" @click="show_emoj=false">
		<template v-if="sessions.length>0">
			<div class="session_list list" @wheel.stop.prevent="">
				<div class="title">会话列表</div>
				<el-collapse v-model="AUX.list_show" :accordion="true">
					  	<el-collapse-item :title="'会话中 ('+getStatusNum(1)+')'" name="1" class="font14">
						    <bar :wrapper="'wrapper'">
								<ul>
									<li v-for="(session,i) in sortSessions" v-if="session.status==1" @click="changeSession(session.session_id)" :class="session_current_id!==''&&session.session_id===session_current_id?'on':''" class="pointer" :key="session.session_id">
										<div class="session-item_wrap">
											<span class="icon">
												<template v-if="session.head && session.head!==''"><img :src="session.head" /></template>
												<template v-else>{{session.session_id.slice(-2)}}</template>
											</span>
											<div>
												<h3>
													<span v-if="session.nickname" class="font14">{{session.nickname}}</span>
													<span v-else class="font14">Guest{{session.session_id.slice(-8)}}</span>
													<span class="pull-right opcity5 font12">{{$api.计算相差多少天(session.updated)!=0?($api.计算相差多少天(session.updated)==1?'昨天':'前天'):($api.dateFormat('hh:mm',session.updated))}}</span>
												</h3>
												<p class="font14 opcity5" :title="session.tell.length>0?(session.tell[session.tell.length-1].question||session.tell[session.tell.length-1].answer):''"
													v-html="session.tell_no_img.length>0?session.tell_no_img[session.tell_no_img.length-1].text:''">
												</p>
												<span v-if="session.news&&$store.state.global.enums.is_need_message_danger!==false" class="pull-right" :class="(Date.now()-session.news_update)<气泡时间[0]*1000?'c1':((Date.now()-session.news_update)<气泡时间[1]*1000?'c3':'c2')">{{session.news>99?'99+':session.news}}</span>
											</div>
										</div>
									</li>
								</ul>
							</bar>
					  	</el-collapse-item>
					  	<el-collapse-item :title="'已结束 ('+(getStatusNum(2)+getStatusNum(0))+')'" name="2">
						    <bar :wrapper="'wrapper'">
								<ul>
									<li v-for="(session,i) in sortSessions" v-if="session.status==2||session.status===0" @click="changeSession(session.session_id)" :class="session_current_id!==''&&session.session_id===session_current_id?'on':''" class="pointer" :key="session.session_id">
										<div class="session-item_wrap">
											<span class="icon">
												<template v-if="session.head"><img :src="session.head" /></template>
												<template v-else>{{session.session_id.slice(-2)}}</template>
											</span>
											<div>
												<h3>
													<span v-if="session.nickname" class="font14">{{session.nickname}}</span>
													<span v-else class="font14">Guest{{session.session_id.slice(-8)}}</span>
													<span class="pull-right opcity5 font12">{{$api.计算相差多少天(session.updated)!=0?($api.计算相差多少天(session.updated)==1?'昨天':'前天'):($api.dateFormat('hh:mm',session.updated))}}</span>
												</h3>
												<p class="font14 opcity5" :title="session.tell.length>0?(session.tell[session.tell.length-1].question||session.tell[session.tell.length-1].answer):''"
													v-html="session.tell_no_img.length>0?(session.tell_no_img[session.tell_no_img.length-1].question||session.tell_no_img[session.tell_no_img.length-1].answer):''">
												</p>
												<span class="pull-right" v-show="session.news.toString().slice(0,1)>0 && current!=sessions.length-i-1">{{session.news}}</span>
											</div>
										</div>
									</li>
								</ul>
							</bar>
					  	</el-collapse-item>
				</el-collapse>
			</div>
			<div class="section" v-if="current!==''">
				<div class="title text-center clearfix">
					<p><span v-if="sessions[current].nickname">{{sessions[current].nickname}}</span><span v-else>{{'Guest'+sessions[current].session_id.slice(15)}}</span></p>
					<p if="time!=''&&sessions[current].status==1" style="opacity:0;" class="time">&nbsp;当前会话时长：{{time}}</p>
					<p v-if="getKfStatus.status==1&&sessions[current].status==1" class="control pointer">
						<a @click="打开转接框()">转接</a>&emsp;<a @click="endSession" >结束</a>
					</p>
				</div>
				<div class="area" @wheel.stop.prevent="">
					<chatbox :session="sessions[current]" @reReply="reReply" @reUpload="reUpload" @reCall="reCall" @pushAnswer="pushAnswer"  @pushRichText="pushRichText"></chatbox>
				</div>
				<div class="say" :class="(say.focus?'focus ':'')+'kfState'+getKfStatus.status">
					<div class="control">
						<img @click.stop="show_emoj=!show_emoj" ref="emojs" src="../../assets/img/expression.png"  /> 
						<upload v-model="粘贴图片" :action="$uri.session.upload" :accept="'image/*'" :size="'2M'" :headers="headers" :success="successUpload" :error="errorUpload" :before="beforeUpload">
							<img src="../../assets/img/img.png" class="pointer" />
						</upload>
						<upload v-if="sessions[current].source!=='weixin'" :size="'2M'" :action="$uri.session.upload" :headers="headers" :success="successUpload" :error="errorUpload" :before="beforeUpload" :progress="progressUpload">
							<img src="../../assets/img/file.png" class="pointer" />
						</upload>
					</div>
					<div v-show="show_emoj" class="emoj" >
						<b v-for="e in emoj" :title="e.sign" class=" pointer" @click.stop="add_emoj(e)" ref='emojs_area'>
							<img v-if="e.uri!=undefined" :src="e.uri" />
							<span v-if="e.uri==undefined">{{e.txt}}</span>
						</b>
					</div>

					<div class="write_wrap">
						<div @keydown="sayKeyDown"  @input="inputChange" @focus="focus" @blur="blur" @paste="pasteHandler" ref='write' id="write" class="write" contenteditable="true" placeholder="小提示：在输入框内按下“Ctrl+Enter”,可以换行输入内容"> </div>
						<!--<textarea v-if="input.type=='txt'" v-model="input.text" @keydown="sayKeyDown" @input="inputChange" @focus="say.focus=true" @blur="say.focus=false" ref='write' class="write" multiple="multiple" placeholder="小提示：在输入框内按下“Ctrl+Enter”,可以换行输入内容"></textarea>-->
					</div>	

					</bar>
					<div class="hint" v-if="answer.show || 快捷回复.show" ref="hint">
						<bar :wrapper="'wrapper'" :scrollTop="answer" v-show="answer.show">
							<ul>
								<li v-for="(a,i) in answer.filtered" :title="a" @click="pushOverInput(a)" :class="answer.index==i?'on':''" v-html="strToHtml(a,$refs.write.innerHTML)">{{a}}</li>
							</ul>
						</bar>
						<bar :wrapper="'wrapper'" :scrollTop="快捷回复"  v-show="快捷回复.show">
							<ul>
								<li v-for="(a,i) in 快捷回复.filtered" :title="a" @click="pushOverInput(a[2])" :class="快捷回复.index==i?'on':''">
									<template v-if="a[0]!==''"><<span v-html="strToHtml(a[0],$refs.write.innerHTML.slice(1))"></span>> </template>
									<template v-if="a[1]!==''">"<span v-html="strToHtml(a[1],$refs.write.innerHTML.slice(1))"></span>"</template>
									<span v-if="a[2]!==''" v-html="strToHtml(a[2],$refs.write.innerHTML.slice(1))"></span>
								</li>
							</ul>
						</bar>
					</div>
					
					<button @click="reply('text',$refs.write.innerHTML)" class="pull-right my-btn my-btn-info">发送</button>
				</div>
			</div>
			<div class="section" v-else></div>
			<div class="aside">
				<tabs  v-if="current!==''" :tabs="AUX.tabs" v-model="AUX.tab_index">
					<div slot="tab0" class="info_wrap">
						<bar wrapper="wrapper">
							<userinfo :tags="tags" :info="sessions[current]"></userinfo>
						</bar>
						<footer class="work-btn">
							<button @click="showWorkOrder" class="my-btn my-btn-transparent">&emsp;创建工单&emsp;</button>
						</footer>
					</div>
					<template slot="tab1">
						<div class="wrapper2 wrapper">
							<knowsearch :快捷回复s="快捷回复s" @pushAnswer="pushAnswer" @pushRichText="pushRichText"></knowsearch>
						</div>
					</template>
					<template slot="tab2">
						<bar wrapper="wrapper3">
							<AUXinfo :info="sessions[current]" @pushAnswer="pushAnswer" @pushRichText="pushRichText"></AUXinfo>
						</bar>
					</template>
				</tabs>
				<!--<template v-if="current!==''">
					<ul class="tabs tabs-3" :class="'active'+AUX.tab_index">
						<li class="tab" v-for="(t,i) in AUX.tabs" @click="AUX.tab_index = i">{{t.name}}</li>
					</ul>
					<transition name="fades" mode="out-in">
						<div class="info_wrap" v-show="AUX.tab_index==0">
							<bar wrapper="wrapper">
								<userinfo :tags="tags" :info="sessions[current]"></userinfo>
							</bar>
							<footer class="work-btn">
								<button class="my-btn my-btn-info-o" @click="showWorkOrder">创建工单</Button>
							</footer>
						</div>
					</transition>
					<transition name="fades" mode="out-in">
						<div class="wrapper2 wrapper" v-show="AUX.tab_index==1">
							<knowsearch :快捷回复s="快捷回复s" @pushAnswer="pushAnswer" @pushRichText="pushRichText"></knowsearch>
						</div>
					</transition>
					<transition name="fades" mode="out-in">
						<bar wrapper="wrapper" v-show="AUX.tab_index==2">
							<AUXinfo :info="sessions[current]" @pushAnswer="pushAnswer" @pushRichText="pushRichText"></AUXinfo>
						</bar>
					</transition>
				</template>-->
			</div>
		</template>
		<div  v-if="sessions.length==0" class=" nosessions">
			暂无会话接入
		</div>
		<modal title="转接" v-model="turn.show" size="tiny">
			<div class="turn_title">
			  	<ul class="tabs tabs-2" :class="turn.select_type=='user_id'?'active0':'active1'">
			  		<li class="tab" @click="turn.select_type='user_id';turn.group_id='';">客服</li>
			  		<li class="tab" @click="turn.select_type='group_id';turn.user_id='';">客服组</li>
			  	</ul><br />
			  	<div class="turn_body" >
			  		<div v-if="turn.select_type=='user_id'" :style="turn.users.length>0?'':'display:table'">
			  			<bar v-if="!$api.isEmptyObj(turn.users)" :wrapper="'wrapper'">
			  				<table class="tables">
				  				<tbody>
				  					<tr v-for="(v,k) in turn.users">
					  					<td><el-radio class="radio" v-model="turn.user_id" :label="k" :key="k">{{v.username}}</el-radio></td>
					  				</tr>
				  				</tbody>
				  				
				  			</table>
			  			</bar>
			  			<p v-if="turn.users.length==0" class="vertical-center text-center">没有可转接的客服</p>
			  		</div>
			  		<div v-if="turn.select_type=='group_id'" :style="turn.groups.length>0?'':'display:table'">
			  			<bar v-if="!$api.isEmptyObj(turn.groups)" :wrapper="'wrapper'">
				  			<table class="tables">
				  				<tbody>
				  					<tr v-for="(v,k) in turn.groups">
					  					<td><el-radio class="radio" v-model="turn.group_id" :label="k" :key="k">{{v.group_name}}</el-radio></td>
					  					<td>{{v.users.length}}人在线</td>
					  				</tr>
				  				</tbody>
				  			</table>
			  			</bar>
			  			<p v-if="turn.groups.length==0" class="vertical-center text-center">没有可转接的客服组</p>
			  		</div>
			  	</div><br />
			  	<!--<div class="turn_foot">
			  		<el-input type="textarea" v-model="turn.remark" placeholder="备注"></el-input>
			  	</div>-->
			</div>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="turn.show = false">取 消</el-button>
			    <el-button type="primary" @click="准备转接()">确 定</el-button>
			</div>
		</modal>
		<createWorkOrder v-model="show_work_order" :work_order="work_order"></createWorkOrder>
		<upload v-model="reUploadFile.file" :action="$uri.session.upload" :success="reUploadSuccess" :error="errorUpload" :before="reUploadBefore"  :progress="progressUpload"></upload>
	</div>
</template>

<script>
	import {mapGetters,mapActions} from 'vuex'
	import bar from '../module/自定义滚动条.vue'
	import upload from '../module/upload.vue'
	import tabs from '../module/tabs'
	import statics from '../../config/static.js'
	import chatbox from './chatbox.vue'
	import userinfo from './modules/userInfo.vue'
	import knowsearch from './modules/knowSearch.vue'
	import AUXinfo from './modules/AUXInfo.vue'
	import { on, off } from '../module/操作DOM.js'
	import sessions_mixin from './mixin/sessions.js'
	import handlerReplyData from './modules/handlerReplyData.js'
	import createWorkOrder from '../workold/modules/create_work_order.vue'
	export default{
		mixins:[sessions_mixin],
		props:['tags','answers'],
		data(){
			return {
				show_emoj:false,
				session_show:{
					a:false,b:false,
				},
				show_work_order: false,
				work_order: {},
				emoj:statics.emoj.emojs,
				time:0,              //会话时长
				timeout:null,
				headers:{
					Auth:this.$store.state.global.user.token,
				},    //上传头部
				qb_list:[],
				input:{
					text:'',
					type:'txt',
				},
				magnify_img:'',
				//答案匹配
				answer:{
					top:0,
					index:0,
					show:true,
					filtered:[],
				},
				快捷回复s:[],
				快捷回复:{
					top:0,
					index:0,
					show:true,
					filtered:[],
				},
				//展示用
				say:{
					focus:false,
				},
				//转接
				turn:{
					show:false,
					select_type:'user_id',
					users:{},
					groups:{},
					remark:'',
					user_id:'',
					group_id:'',
				},
				//客服输入信息
				kf_input:{
					status:0,
					间隔:5,
					实例:undefined,
				},
				粘贴图片: {},
				reUploadFile: {
					file:'',
				},
				AUX:{
					tab_index:0,
					list_show:"1",
					tabs:['用户资料', '知识搜索', '辅助信息'],
				},
			}
		},
		created(){
			let v = this;   
			//起掉当前会话的新信息
			if(v.$store.state.service.session_current_id){
				let index = v.$store.state.service.sessions索引[v.$store.state.service.session_current_id].index;
				v.$store.state.service.sessions[index].news = 0;
			}
			v.get快捷回复();
		},
		mounted() {
			let reference = this.$refs.emojs;
      		on(document, 'click', this.handleDocumentClick);
      		
		},
		beforeDestroy(){
			let reference = this.$refs.emojs;
      		off(document, 'click', this.handleDocumentClick);
		},
		computed:{
			...mapGetters([
		  		'getKfStatus'
		  	]),
			气泡时间(){
				let time = [30,120];
				if(this.$store.state.global.enums.message_danger_range)
					time = this.$store.state.global.enums.message_danger_range.split('-');
				return  time;
			},
			sortSessions(){
				let s  = this.$api.deepCopy(this.sessions);
				return s.sort(this.compareUpdated('updated'))
			},
			session_current_id:{
				get(){
					return this.$store.state.service.session_current_id;
				},
				set(val){
					this.$store.state.service.session_current_id = val;
				}
			},
			current(){   
				if(this.$store.state.service.session_current_id){
					return this.$store.state.service.sessions索引[this.session_current_id].index;
				}else{
					return '';
				}
			},
		},
		methods:{
			getStatusNum(status){
				let num=0;
				this.sessions.forEach((val,i)=>{
					if(val.status==status)
						num++;
				})
				return num;
			},
			initWorkOrder(){
				let sesstion = this.sessions[this.current];
				if(!sesstion) return false;
				this.work_order = {
					uid: sesstion.uid,
					nickname: sesstion.nickname,
					email: sesstion.email,
					mobile: sesstion.mobile
				}
			},
			showWorkOrder(){
				this.initWorkOrder()
				this.show_work_order=true
			},
			get快捷回复(){
		  		var v = this;
		  		this.$api.ajaxNoLoading(v.$uri.快捷回复.list,'get').then((data)=>{
					v.快捷回复s = data;  
				})
		  	},
			changeSession(id){   
				let v = this;
				v.session_current_id = id;
			},
			endSession(){   
				let v = this;
				let session_current_id = v.session_current_id;
				this.$confirm('是否确定要关闭此会话？', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
		        }).then(() => {
		        	v.mixin_结束会话(session_current_id)
		        	.then(data=>{
						v.重新计算显示会话();
						v.mixin_changeSessionStatus(session_current_id, 2);
		        	})
		          	
		        })
				
			},
			重新计算显示会话(){
				let v= this;
				v.session_current_id = '';
				for(let i=0;i<v.sessions.length;i++){
					if(v.sessions[i].status==1 ){
						v.session_current_id =v.sessions[i].session_id ;
						return ;
					}
				}
			},
			getUsers(){
				let page = {
					page:1,
					size:1000,
				},v=this;
				return this.$api.ajax(this.$uri.user.getSimpleUsers,'get',page);
			},
			getGroups(){
				return this.$api.ajax(this.$uri.user.getSimpleGroups,'get');
			},
			打开转接框(){
				let v = this;
				v.axios.all([v.getUsers(),v.getGroups()])
				.then(v.axios.spread((u,g)=>{     
					let users = v.turn.users = {};
					let groups = v.turn.groups ={};
					if(u.online_num==0){
						return false;
					}
					u.list.forEach(val=>{
						if(val.status==1&&val.id!=v.$store.state.global.user.id){
							users[val.id] = val;
						}
					});
					g.forEach(val=>{
						if(users[val.user_id]){
							if(!groups[val.group_id]){
								groups[val.group_id] = val;
								groups[val.group_id].users=[];
							}
							groups[val.group_id].users.push(val.user_id);
						}
					})
					v.turn.show=true;
				}))
			},
			转接成功(){  
				let v = this;
				v.turn.show=false;
				v.turn.user_id='';
				v.turn.group_id='';
				v.mixin_sessionsRemove(v.session_current_id);
				v.重新计算显示会话();
			},
			准备转接(){                         
				let v = this;
				if(v.turn.user_id===''&&v.turn.group_id===''){
					v.$message({
						message:'请选择转接人或组',
						type:'warning'
					});
					return;
				}
				let send={
					sid: v.session_current_id,
					user_id:v.turn.user_id,
					group_id:v.turn.group_id,
				}
				v.$api.ajax(v.$uri.session.转接客服,'post',send)
				.then(data=>{
					v.转接成功();
				})
			},
			add_emoj(e){
				if(document.activeElement.id!='write'){
					let textbox = this.$refs.write;   
					let sel = window.getSelection();
					let range = document.createRange();
					range.selectNodeContents(textbox);
					range.collapse(false);
					sel.removeAllRanges();
					sel.addRange(range);
				}
				if(e.uri!=undefined)
					document.execCommand('insertHTML',false,`<img class=emoj_icon src="${e.uri}" title="${e.sign}" alt="${e.sign}" code="${e.code}" />`);
				else{
					document.execCommand('insertHTML',false,e.txt);
				}
			},
			newLine(){    
				document.execCommand('insertHTML',false,'<br>\u200C');
			},
			pushOverInput(s){    
				let v= this;
				if(!v.是否可以推送()) return false;
				this.$refs.write.innerHTML = '';
				this.$refs.write.focus();
				if(document.activeElement.id!='write'){
					let sel = window.getSelection();
					let range = document.createRange();
					range.selectNodeContents(textbox);
					range.collapse(false);
					sel.removeAllRanges();
					sel.addRange(range);
				}
				document.execCommand('insertHTML',false,s);
				
				setTimeout(function(){
					v.answer.index=0; v.快捷回复.index=0;
					v.answer.show=false;v.快捷回复.show=false;
				},50);
			},
			pushAnswer(s,type){    
				let v= this;
				if(!v.是否可以推送()) return false;
				if(type=='text'){
					let old_str = this.$refs.write.innerHTML;
					this.$refs.write.focus();
					document.execCommand('insertHTML',false,s);
					setTimeout(function(){
						v.answer.index=0; v.快捷回复.index=0;
						v.answer.show=false;v.快捷回复.show=false;
					},50);
				}
				if(type=='rich_answer'){
					this.$confirm('这是一条富媒体内容，将直接发送给用户，确定发送吗？', '提示', {
			          	confirmButtonText: '确定',
			          	cancelButtonText: '取消',
			          	type: 'info'
			        }).then(() => {
			        	v.reply(type,s);
			        })
				}
			},
			pushRichText(url,id){
				let v = this;
				if(!v.是否可以推送()) return false;
				this.$confirm('这是一条富文本内容，将直接发送给用户，确定发送吗？', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'info'
		        }).then(() => {
		        	v.reply('rich_text',{url:url,media_id:id});
		        })
			},
			是否可以推送(){
				if(this.$store.state.service.kf_status.status == '0'){
					this.$message({
						message:'此状态无法推送！',
						type:'warning'
					})
					return false;
				}
				return true;
			},
			sayKeyDown(e){    
				let v= this;
				let answer_h = this.$refs.hint?this.$refs.hint.offsetHeight:0;
				let answer_t = this.$refs.hint?this.$refs.hint.scrollHeight:0;
				if((v.answer.show && answer_h)||(v.快捷回复.show && answer_h)){
					let source = v.answer.show?v.answer:v.快捷回复;
					if(e.keyCode==13){
						e.preventDefault();
						e.stopPropagation();
						let str = source.filtered[source.index];
						str = typeof str == 'string'?str:str[2];
						v.pushOverInput(str);
					}
					if(e.keyCode==38){
						source.index=source.index==0?0:source.index-1;
						if(0-(source.index-1)*30<answer_t){
							source.top=0-(source.index-1)*30;
						}
						if(source.index==0){
							source.top=0;
						}
						e.preventDefault();
						e.stopPropagation();
					}
					if(e.keyCode==40){
						source.index=source.index==source.filtered.length-1?source.index:source.index+1;
						if((source.index+1)*30>answer_t){
							source.top=0-(source.index-1)*30;
						}
						e.preventDefault();
						e.stopPropagation();
					}
					
				}else{
					if(e.keyCode==13){
						if(e.ctrlKey){
							v.newLine();
						}else{
							e.preventDefault();
							e.stopPropagation();
							v.reply('text',v.$refs.write.innerHTML);
						}
					}
				}
				
			},
			beforeReply(){
				let v = this; 
				let session = v.sessions[v.current];
				return new Promise((resolve,reject)=>{
					if(session.status!=1){
						v.mixin_激活会话(session,v.$store.state.global.user.id)
						.then(data=>{
							v.mixin_初始化会话(session);
							v.mixin_会话历史(session);  
							v.mixin_changeSessionStatus(v.session_current_id, 1);
							v.AUX.list_show="1";
							resolve('ok');
						}).catch(err=>{
							reject(err);
						})
					}else{
						resolve('ok');
					}
				})
			},
			handlerReplyData(type,source){
				let v = this;
				let session = v.sessions[v.current];
				let session_index = v.current;
				let data,tell,tell_no_img,tell_index;
				let kf_id = v.$store.state.global.user.id;
				let session_id = session.session_id;
				switch(type){
					case 'text':
						let text = source || this.$refs.write.innerHTML;
						this.$refs.write.innerHTML = '';   
						text = text.trim();
						if(text=="") return;
						text = text.replace(/<img[^<]+code="([^\s]+)?"[\s]*>/gi,"$1").replace(/<br>/g,'\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,'\t');
						[data,tell,tell_no_img]=handlerReplyData.text(text,session_id,kf_id);
						break;
					case 'rich_answer':
						[data,tell,tell_no_img]=handlerReplyData.richAnswer(source,session_id,kf_id);
						break;
					case 'rich_text':
						[data,tell,tell_no_img]=handlerReplyData.richText(source,session_id,kf_id);
						break;
					case 'image':
						[data,tell,tell_no_img]=handlerReplyData.image(source,session_id,kf_id);
						break;
					case 'file':
						[data,tell,tell_no_img]=handlerReplyData.file(source,session_id,kf_id);
						break;
					default :
						return false;
				}
				return [data,tell,tell_no_img];
			},
			reply(type,source){   
				let v = this;
				v.beforeReply().then(()=>{
					let tell_index;
					let [data,tell,tell_no_img] = v.handlerReplyData(type,source); 
					tell.reply_data = data;                        //发送失败重发用
					let session = v.sessions[v.current];
					if(type!='file'&&type!='image'){        //上传文件在此之前已经添加到相应的列表了
						session.tell.push(tell);
						session.tell_no_img.push(tell_no_img);
						tell_index = session.tell.length-1;
					}
					v.doReply(data,session.session_id,tell_index);
				})
			},
			doReply(data,session_id,tell_index){     
				let v= this;
				let session_index = v.sessions索引[session_id].index;
				let session = v.sessions[session_index];
				v.$api.ajaxNoLoading(v.$uri.session.回答,'post',data)
					.then(id=>{
						session.tell[tell_index].msg_id = id;                                    
						if(!v.$parent.待确认msg_id[id]){
							v.$parent.待确认msg_id[id]={
								session_id:session_id,
								session_index:session_index,
								tell_index:tell_index,
							}
						}else{
							delete v.$parent.待确认msg_id[id];     //确认完成，删除
							session.tell[tell_index].send = 1;
						}
					}).catch(err=>{     
						session.tell[tell_index].send=-1;
					})
			},
			reReply(data, tell_index, session_id){  
				let v= this;
				let session_index = v.sessions索引[ v.session_current_id ].index;
				let session = v.sessions[session_index];
				session.tell[tell_index].send = 0;
				v.doReply(data, session_id || v.session_current_id, tell_index);
			},
			reUpload(file, data, tell_index){
				let v= this;
				let session_index = v.sessions索引[ v.session_current_id ].index;
				let session = v.sessions[session_index];
				session.tell[tell_index].send = 0;   
				v.reUploadFile.data = {
					data: data,
					tell_index: tell_index,
					session_id: session.session_id
				};																//暂存，由于上传成功或失败是用
				v.reUploadFile.file = file;           				    //直接开始上传，接下来会在reUploadBefore 里收到信息
			},
			reCall( msg_id,tell_index){
				let v= this;
				let session_index = v.sessions索引[ v.session_current_id ].index;
				let session = v.sessions[session_index];
				let list = session.tell[tell_index]&&session.tell[tell_index].msg_id == msg_id ? 'tell' : 'historys';
				session[list][tell_index].send = 0;
				this.$api.ajaxNoLoading('/chats/history/'+msg_id, 'put')
				.then(data=>{
						session[list][tell_index].send = undefined;
						session[list][tell_index].msg_type = 'event';
						session[list][tell_index].event_type = 'recall';
						session[list][tell_index].kf_id = v.$store.state.global.user.id;
				}).catch(err=>{
					session.tell[tell_index].send = 1;
				})
			},
			strToHtml(str,text){
				if(!str) return;
				let reg1 = new RegExp(" ",'g');
				text = text.replace("&nbsp;", "");
				var word = text.replace(reg1, "|");
				/*let index = str.indexOf(text);
				let html = str.slice(0,index) +'<font>'+text+'</font>'+str.slice(index+text.length);*/
				let reg = new RegExp(word,'g');
				return str.replace(reg, function(word){return '<font>'+word+'</font>'});
				
			},
			//毫秒转时分秒
			MillisecondToDate(msd) {  
				let result = '';
			    if (null!= msd &&""!= msd) {  
			    	let time = parseInt(msd)/1000;
			    	if(time>=(24*3600)){
			    		result += parseInt(time/24/3600)>9?parseInt(time/24/3600):'0'+parseInt(time/24/3600);
			    		time = parseInt(time%(24*3600));
			    		result +="天";
			    	}
			    	
			    	if(time>=3600){
			    		result += parseInt(time/3600)>9?parseInt(time/3600):'0'+parseInt(time/3600);
			    		time = parseInt(time%3600);
			    	}else{
			    		result +='00';
			    	}
			    	result +=":";
			    	if(time>=60){
			    		result += parseInt(time/60)>9?parseInt(time/60):'0'+parseInt(time/60);
			    		time = parseInt(time%60);
			    	}else{
			    		result +='00';
			    	}
			    	result +=":";
			    	if(time!=0){
			    		result += time>9?time:'0'+time;
			    	}
			    	else{
			    		result +='00'
			    	}
			    }else{  
			        result = "00:00:00";  
			    }  
			    return result;  
			  
			},
			inputChange(){    

				let v = this;
				let text = v.$refs.write.innerHTML;
				text = text.replace("&nbsp;", "").trim();
				v.快捷回复.filtered =[];
				v.answer.filtered = [];
				if(text=='') {
					return ;
				}
				if(v.sessions[v.current].status===1){
					v.客服输入提示(1);
				}
				if(text[0]=='#'){
					var test = this.test
					// v.qb_list = this._fomatFBs(v.快捷回复s);
					v.快捷回复.show = true;
					v.answer.show=false;
					text = text.slice(1);
					v.快捷回复.index=0;
					v.快捷回复.filtered = [['','',text]];
					// this._filterQuickFBArr()
					var texts = text.split(" ")
					for(let i in v.快捷回复s){
						if(test(i, texts)){
							for(let j in v.快捷回复s[i]){
								v.快捷回复.filtered.push([i,j,v.快捷回复s[i][j]]);
							}
						}else{
							for(let j in v.快捷回复s[i]){
								if(test(j, texts) || test(v.快捷回复s[i][j], texts)){
									v.快捷回复.filtered.push([i,j,v.快捷回复s[i][j]]);
								}
							}
						}
					}
					v.快捷回复.filtered = v.快捷回复.filtered.length==1?[]:v.快捷回复.filtered;
				}else{
					v.answer.show=true;
					v.快捷回复.show = false;
					v.answer.index=0;
					v.answer.filtered = [text];
					v.answers.forEach((val,i)=>{
						if(val.indexOf(text)!=-1)
							v.answer.filtered.push(val);
					})
					v.answer.filtered = v.answer.filtered.length==1?[]:v.answer.filtered;
				}
			},
			focus(){
				this.客服输入提示(1);
			},
			blur(){ 
				this.客服输入提示(0);
			},
			客服输入提示(status){
				let v = this;
				if(this.sessions[v.current].status!=1) return false;
				if(!v.kf_input.实例 || status!=v.kf_input.status){
					v.kf_input.status = status;
					clearTimeout(v.kf_input.实例);
					v.$api.ajaxNoLoading(v.$uri.session.客服输入提示,'post',{session_id:v.sessions[v.current].session_id,status:status})
					.then(data=>{
						v.kf_input.实例 = setTimeout(()=>{
							v.kf_input.实例 = undefined;
						},v.kf_input.间隔*1000);
					});
				}
			},
			test(str, list){
				for(var i=0,len=list.length; i<len; i++){
					if(str != undefined && (str.indexOf(list[i])!=-1)){
						return true;
					}
				}
				return false;
			},
			compareUpdated(time){
				return (a,b)=>{
					return new Date(b[time]).getTime() - new Date(a[time]).getTime();
				}
			},
			
			//计算时间
			计算会话时长(){
				let v = this;
				if(v.$store.state.global.enums.is_time_show){
					v.timeout = setTimeout(function aa(){
						if(v.$store.state.global.path.indexOf('servicer')!=-1){
							v.time++;																				
							v.timeout = setTimeout(aa,1000);
						}
					},30);
	      		}
			},
			//粘贴处理
			pasteHandler(e){       console.log(e)
				let v= this;
				let _this = v.$refs.write;
		        e.preventDefault();
		        var clipboardData= null;
		        var text = null;
		        if(window.clipboardData && clipboardData.setData) {
		            // IE
		            clipboardData = window.clipboardData;
		            text = window.clipboardData.getData('text');
		        } else {
		            clipboardData = (e.originalEvent || e).clipboardData;
		            text =  (e.originalEvent || e).clipboardData.getData('text/plain');
		        }
		        var files = clipboardData.files
		        //剪切板第一个类型为文件
		        if(clipboardData.types[0]=='Files'){
		        	let blob = clipboardData.items[0].getAsFile();
	                let fr = new File([blob],'image.png',{type: "image/png", lastModified: Date.now()});
		        	v.粘贴图片 = fr//clipboardData.files[0];
		        	return ;
		        }
		        
		        if (document.body.createTextRange) {    
		            if (document.selection) {
		                textRange = document.selection.createRange();
		            } else if (window.getSelection) {
		                sel = window.getSelection();
		                var range = sel.getRangeAt(0);
		                
		                // 创建临时元素，使得TextRange可以移动到正确的位置
		                var tempEl = document.createElement("span");
		                tempEl.innerHTML = "&#FEFF;";
		                range.deleteContents();
		                range.insertNode(tempEl);
		                textRange = document.body.createTextRange();
		                textRange.moveToElementText(tempEl);
		                tempEl.parentNode.removeChild(tempEl);
		            }
		            textRange.text = text;
		            textRange.collapse(false);
		            textRange.select();
		        } else {
		            // Chrome之类浏览器
		            document.execCommand("insertText", false, text);
		        }
			},
			successUpload(result,file,before_upload_data){  
				let v = this;
				let session = v.sessions[v.sessions索引[before_upload_data.session_id].index];
				session.tell[before_upload_data.tell_index].media.url = result.url;
				v.doReply(before_upload_data.data, before_upload_data.session_id, before_upload_data.tell_index);
			},
			errorUpload(msg,before_upload_data){
				let v= this;
				if(before_upload_data){
					let session = v.sessions[v.sessions索引[before_upload_data.session_id].index];
					session.tell[before_upload_data.tell_index].send = -0.5;
				}else{
					v.$message({
						message:msg,
						type:'error',
					});
				}
			},
			beforeUpload(file){
				let v = this;
				let type
				let session = v.sessions[v.current];
				let media = {
					url:'',
					name:file.name,
					size:file.size,
					percent:0,
					stop_upload:false,              //可终止上传
				}
				if(file.type.indexOf('image')!=-1 ){
					let base64 = new FileReader();
					base64.readAsDataURL(file);
					base64.onload=function(e){
						media.url=this.result;
					}
					type = 'image';
				}else{
					type ='file';
				}
				let [data,tell,tell_no_img] =v.handlerReplyData(type,media);
				tell.file = file;                           //存储文件，上传失败后可重新上传！
				tell.reply_data = data;                      //发送失败后可重发的数据
				session.tell.push(tell);
				session.tell_no_img.push(tell_no_img);
				let tell_index = session.tell.length-1;
				delete data.media.percent;
				return {session_id:session.session_id,tell_index:tell_index,data:data};
			},
			progressUpload(percent,before_upload_data,实例){
				let v= this;
				let session = v.sessions[v.sessions索引[before_upload_data.session_id].index];
				let media = session.tell[before_upload_data.tell_index].media;
				media.percent = percent*100;
				if(media.stop_upload)
					实例.abort();
			},
			
			reUploadSuccess(result,file,before_upload_data){
				let v= this;
				let session = v.sessions[v.sessions索引[before_upload_data.session_id].index];
				v.reReply( before_upload_data.data, before_upload_data.tell_index, session.session_id );
			},
			reUploadBefore(file){
				let v = this;
				return v.reUploadFile.data;
			},
			handleDocumentClick(e) {
			      let reference = this.$refs.emojs;
			      const popper = this.emojs_area || this.$refs.emojs_area;
			      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
			        reference = this.referenceElm = this.$slots.reference[0].elm;
			      }
			      if (!this.$el ||
			        !reference ||
			        this.$el.contains(e.target) ||
			        reference.contains(e.target) ||
			        !popper /*||
			        popper.contains(e.target)*/) return;
			      this.show_emoj = false;
			},
			去除头尾空格字符(str){
				let reg = new RegExp('^[&nbsp;\s?]*(.*?)[&nbsp;\s?]*$');
				return str.match(reg)[1];
			}
		},
		components:{
			bar,
			tabs,
			chatbox,
			upload,
			userinfo,
			AUXinfo,
			knowsearch,
			on, off,
			createWorkOrder,
			mapGetters,mapActions
		},
		watch:{
			session_current_id(n,o){
				let v =this;
				if(o!=='' &&  v.sessions索引[o]){
					o = v.sessions索引[o].index;
					v.sessions[o].inputing = v.$refs.write.innerHTML;
					v.$refs.write.innerHTML = '';
				}
				if(n!==''){
					n = v.sessions索引[n].index;
					setTimeout(()=>{
						v.$refs.write.innerHTML = v.sessions[n].inputing?v.sessions[n].inputing:'';
					},50);
					v.answer.show = false;
					v.快捷回复.show = false;
					v.sessions[n].news = 0;
					v.AUX.list_show = this.$store.state.service.sessions.find(val=>val.session_id == v.$store.state.service.session_current_id).status ==1 ? '1' : '2';
				}
				clearTimeout(this.timeout);
				v.time = 0;
				v.initWorkOrder();
				v.计算会话时长();
			},
			'current2':function(n,o){       
				let v = this;
				if(o!==''){
					v.sessions[o].inputing = v.$refs.write.innerHTML;
					v.$refs.write.innerHTML = '';
				}
				if(n!==''){
					setTimeout(()=>{
						v.$refs.write.innerHTML = v.sessions[n].inputing?v.sessions[n].inputing:'';
					},50);
					v.answer.show = false;
					v.快捷回复.show = false;
					v.sessions[n].news = 0;
				}
				clearTimeout(this.timeout);
				v.time = 0;
				v.initWorkOrder();
				v.计算会话时长();
			}
			
		},
		beforeDestory(){
			clearTimeout(this.timeout);
		},
	}
</script>

<style lang="scss">
	@import "../../assets/scss/wrap_variate.scss";
	$headHeight:59px;
	$collapse-head-height:43px;
	$border-color: #eff5f8;
	.session {
		font-size:0;
		height:100%;
		 .nosessions {width:100%; font-size:15px; text-align:center; position:relative; padding-top:20%;}
		 &> div {display:inline-block; height:100%; font-size:14px; vertical-align:top;}
		 .list {
		 	width:26%;
		 	border-right:1px solid $border-color;
		 	.title {
		 		line-height:$headHeight;
		 		text-align:center;
		 		font-size: 14px;
		 	}
		 	li{
		 		.session-item_wrap{
		 			position:relative;
		 			max-width:335px; margin:auto;
		 			height:74px;
		 			
		 			.icon {display:none;}
		 		}
		 		@media only screen and (min-width:1360px ) {
		 			.session-item_wrap {
		 				&:after {left:60px !important;}
		 				.icon {background:#8b99a7; color:#fff; display:inline-block; border-radius:50%; position:absolute; left:0px; top:13px; width:50px; height:50px; line-height:50px; text-align:center; border:1px solid #8b99a7; overflow:hidden;}
		 				.icon img {max-width:48px;}
		 				& > div { margin-left:60px; padding-left:0 !important;}
		 			}
				}
		 	}
		 	.el-collapse {border-right:none;}
		 	.el-collapse-item__header {font-size:14px; line-height:$collapse-head-height; height:$collapse-head-height; background:#f3f8fb; border-bottom-color:#e7eff3;}
		 	.el-collapse-item__content {padding:0;}
		 	.el-collapse-item__content ul {background:#fff;}
		 	.el-collapse-item__wrap {border:none;}
		 	.wrapper { max-height:calc(100vh - #{$collapse-head-height*2} - #{$headHeight} - #{$wrap-head-height} - 2px);}
		}
		
		.section {
			width:51.5%;
			 border:1px solid $border-color; border-top-width:0; border-left-width:0;
			.title {
				border-bottom:1px solid $border-color; padding:0px 20px;  background:#fff; position:relative;
				p {line-height:$headHeight;}
				.control {position:absolute; right:0; top:0;}
				.time {position:absolute; width:100%; top:17px; left:0;}
			}
			.area {
			 	height:calc(100% - 310px); background:#fff;
			 	.wrapper {height:100%; padding:0 20px;}
			}
			.control {
				height:60px; line-height:61px; border-top:1px solid $border-color; padding:0 20px; 
				&> * {margin-right:10px;}
				a {color:#2095f2;}
			}
			.say{
				height:250px;background:#fff; position:relative;
				&.focus {background:#fff;}
				&.kfState0{
					&:after {content:''; display:block; position:absolute; width:100%; height:100%; top:0; left:0; background:rgba(255,255,255,0.3);}
					&:hover {cursor:not-allowed;}
				}
				.emoj {
					position:absolute; left:8px; bottom:250px; width:calc(100% - 17px); font-size:0; background:#fff; z-index:200;
					b {display:inline-block; vertical-align:top; width:30px; height:30px; line-height:30px; text-align:center; border:0.5px solid #eee;}
				}
				button {position:absolute; bottom:20px; right:20px; }
				.hint .wrapper {max-height:150px; width:100%;}
				.write{
				 	width:calc(100% + 42px); height:130px; font-size:14px; outline:none; border:none; background:rgba(0,0,0,0); overflow-y:auto ; resize: none; padding:0 60px 0 20px; word-break: break-all;
				 	&:empty:before{content: attr(placeholder);color:#afbfd4;}
				 	&::placeholder { color:#afbfd4;}
				 	&:focus{content:none;}
				}
				
			}
		}
		.aside {
			width:22.5%;
			position:relative;
			background:#fafcfd;
			._my_tabs-title {
				height: #{$headHeight + 1px};
				li {line-height: #{$headHeight + 1px};}
			}
			._my_tabs-title{
				border-color: $border-color;
			}
			._my_tabs-items{
				height:calc(100% -  #{$headHeight + 1px});
			}
			.info_wrap{
		 		height:calc(100% - 60px);  padding:0;
		 		.wrapper {height:100%; padding:0 15px;}
		 		.work-btn{
		 			text-align: center; 
		 			line-height:60px;
					box-sizing: content-box; 
					background: #f3f7f9;
		 		}
		 	}
			.wrapper2 {
				height: 100%;
				padding:0;}
			.wrapper3{
				height: 100%;
				padding: 0 10px;
			}
		}
	}
	

	.session .section .say .write_wrap{max-width:100%; overflow-x:hidden;}
	.session .section .say .hint {position:absolute;top:97px; left:0; width:100%;max-height:150px; background:#eee; z-index:10;}
	.session .section .say .hint ul li:nth-child(odd) {background:#eaf6ff;}
	.session .section .say .hint ul li:nth-child(even) {background:#e1f2ff;}
	.session .section .say .hint ul li {color:#729bba; padding:0px 20px; line-height:30px; overflow:hidden; word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;}
	.session .section .say .hint ul li font {color:red;}
	.session .section .say .hint ul li:hover,.session .section .say .hint ul li.on {background:#b5d7f1; color:#437295;}
	.session .turn_title .on {color:#328eff;}
	.session .turn_body {width:100%; height:400px; border:1px solid #eee;}
	.session .turn_body > div {height:100%; width:100%;}
	.session .turn_body > div .wrapper {height:100%;}
	.session .turn_body td {padding-left: 5px;}
	
	
	
</style>
