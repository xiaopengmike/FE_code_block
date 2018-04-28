<template>
	<div id="servicer">
		<router-view :kfs="kfs"  :tags="tags" :answers="answers" ></router-view>
		<audio id="audio1" src="http://jsdx.sc.chinaz.com/Files/DownLoad/sound1/201703/8407.mp3"></audio>
	</div>
</template>

<script>
	import {mapGetters,mapActions} from 'vuex'
	import Centrifuge from 'centrifuge'
	import statics from '../../config/static.js'
	import logo from '../../assets/img/notification.jpg'
	import sessions_mixin from './mixin/sessions.js'
	export default{
		mixins:[sessions_mixin],
		data(){
			return {
				msgQueue:[],
				待确认msg_id:{},    //自己发出去的，等待后台确认对方是否收到
				tags:[],
				socket:{},
				kfs:{},
				emoj:statics.emoj.emojs,
				title:{
					timeout:'',
					count:10,
					news:'您有新的消息',
					index:0,
					statics:'智言数据管理平台',
				},
				//知识库答案
				answers:[],
				current_id:'',
				AUX:{
					session_list_refresh:true,
				}
			}
		},
		created(){
			let v = this;
			this.getSessionList();
			this.getClassifyList();
			this.getAnswers();
			
			this.$source.kfsHead().then(data=>{
				this.kfs = data;
			})
			this.title.statics = document.title;
			v.axios.all([this.getSocket(),this.getState()])
			.then(v.axios.spread((socket,state)=>{            
				v.socket=socket;    
	  			v.initSocket();
	  			if(state){
	  				v.kf_status = state;
	  			}else{
	  				v.kf_status = {
	  					label: '离线',
	  					status: 0
	  				}
	  			}
	  			v.connectSocket();
	  		//	v.handlerChangeKfStatus();
			}));
			
			window.onbeforeunload = function(){
				if(v.kf_status.label != '离线'){
					event.returnValue = "关闭";
					return "关闭";
				}
			}
			window.onunload=function(){
				if(v.kf_status.label != '离线'){
					event.returnValue = "关闭";
					return "关闭";
				}
			}
		},
		computed:{
			...mapGetters([
				'getMode'
			]),
			modelRight(){
				let r = 0;
				let username = document.querySelector('.username');
				r = username.offsetRight+username.offsetWidth+10;
				return r+'px';
			},
			kf_status:{
				get(){
					return this.$store.state.service.kf_status;
				},
				set(val){
					this.$store.dispatch('setKfStatus',val);  
				}
			}
		},
		methods:{
			...mapActions({
		  		changeMode:'changeMode',
		  	}),
		  	getKfs(){
				let v= this;
				this.$source.kfs();
			},
			getState(){
				let v = this;
		  		return v.$api.ajax('/kf/status','get');
			},
			getSocket(){
				let v= this;
				return v.$api.ajax('/chats/websocket','get');
			},
			getSessionList(){
				let v = this;
				v.$api.ajax('/chats','get',{sort:1}).then(data=>{
					data.list.forEach((val,i)=>{
						v.mixin_初始化会话(val);
					})
					v.sessions=data.list; 
				});
			},
			initSocket(){
				let v= this;
				if(!v.$store.state.service.socket.instance){
					v.$store.state.service.socket.instance = new Centrifuge({
				        url: v.socket.url,
				        user:v.socket.user,
				        timestamp:v.socket.timestamp ,
				        token: v.socket.token
				    });
				}
				v.订阅();
			    
			},
			订阅(){
				let v = this;
				let socket = v.$store.state.service.socket.instance;
				let port = v.socket.user;
				v.$store.state.service.socket.subscription = socket.subscribe(port,v.订阅handler);
			},
			取消订阅(){
				let v = this;  
				let sub = v.$store.state.service.socket.subscription;
				sub._events.message = [];
			},
			订阅handler(msg){   console.log(msg)
				let v = this;
				msg = msg.data;
				if(msg.type){
					let data = msg.data;
					switch(msg.type){
						case 'confirm':
							v.确认信息处理(msg.data);
							break;
						case 'chat':
							v.新信息处理(msg.data);
							break;
						case 'user_info':
							v.更新用户信息(msg.data);
							break;
						case 'chat_close':
							v.mixin_sessionsRemove(msg.data.session_id);
							break;
					}
				}	
			},
			handlerChangeKfStatus(){
				let v = this;
				if(this.kf_status){
					v.connectSocket();
				}else{
					v.closeSocket();
				}
			},
			closeSocket(){
				let v = this;
				// if(v.$store.state.service.socket.instance)
				// v.$store.state.service.socket.instance.disconnect();
			},
			connectSocket(){
				let v = this;
				if(v.$store.state.service.socket.instance)
				v.$store.state.service.socket.instance.connect();
			},
			新信息处理(data){												
				if(data.msg_id==''||!data.session_id){
	    			console.warn('一条没有session_id 的推文');
	    			return ;
	    		} 
	    		let v = this;
	    	//	v.返回推送信息id(data.msg_id);
		    	if(v.sessions索引[data.session_id]==undefined){
		    		v.addSession(data)
		    	}
		    	v.updateSession(data);
		    	
			},
			addSession(data){
				let v = this;
				let session = {
					session_id:data.session_id,
					uid:data.session_id,
					status:1,
				}
				v.mixin_初始化会话(session);
				v.mixin_sessionsPush(session);
				v.getSessionDetail(session);
			},
			updateSession(data){             
				let v =this,IDIndex=v.sessions索引[data.session_id];  
				if(IDIndex &&v.sessions[IDIndex.index].session_id !== data.session_id ){
					console.error('会话索引列表出 错！，重新生成索引中··',session_id,IDIndex.index)
					v.sessions = v.sessions;
					IDIndex=v.sessions索引[data.session_id];
				}
				let session = v.sessions[IDIndex.index];
				/*//判断是否是多次接受同一信息        （目前不需要验证）
				if(IDIndex.msg_ids.indexOf(data.msg_id)!=-1) return;
				//过多清空
				if(IDIndex.msg_ids.length.length>500)  IDIndex.msg_ids = [];
				IDIndex.msg_ids.push(data.msg_id);*/
				let time = v.$api.dateFormat('yyyy-MM-dd hh:mm:ss',Number(data.timestamp*1000));    
				session.updated = time;
		    	let tell = {
		    		from:data.from,
		    		msg_type:data.msg_type,
		    		time:time,
		    	};
		    	let tell_no_img = {
		    		from:data.from,
		    		time:time,
		    	};                                          
		    	v.转化聊天数据(data,tell,tell_no_img);
		    	if(session.status!=1){
		    		session.status=1;
       				v.mixin_初始化会话(session);
	  				v.mixin_会话历史(session);;
		    	}
		    	if(data.msg_type=="event" && data.event_type=='结束会话'){
       				v.mixin_关闭会话(session);
       			}
		    	session.tell.push(tell);
		       	if(v.session_current_id===''){
		       		for(let i=0;i<v.sessions.length;i++){
		       			if(v.sessions[i].status==1){
		       				v.session_current_id = v.sessions[i].session_id;
		       				break;
		       			}
		       		}
	       		}
		       	if(!data.from) return;
		       	session.tell_no_img.push(tell_no_img);
		        //页面最小化，目前没有浏览本页面
	        	if(v.session_current_id!=data.session_id||!v.$api.readingThisPage() || v.$api.isMinWindow()||v.$store.state.global.path!=='/servicer/session'){
	        		v.newInfo(tell_no_img.text,session.nickname||'Guest'+session.session_id.slice(15),()=>{ this.聚焦session(data.session_id); });
	        	}
		        if(v.session_current_id!=data.session_id || v.$store.state.global.path!=='/servicer/session'){  
					session.news += 1;
					session.news_update = Date.now();
		        }
			},
			聚焦session(sid){               
				let v =this;
				if(v.session_current_id!=sid)
    				v.session_current_id=sid;
    			if(!v.$api.readingThisPage() || v.$api.isMinWindow())
    				window.focus();
    			if(v.$store.state.global.path!=='/servicer/session')
    				v.$router.push('/servicer/session');
			},
			确认信息处理(data){
				let v = this;
				let msg = v.待确认msg_id[data.msg_id];          
				//待确认列表有这个msg_id
				if(msg){
					v.sessions[msg.session_index].tell[msg.tell_index].send= data.code?-1:1;
					delete  v.待确认msg_id[data.msg_id];                            //已确认过后删除此条信息的记录
				}else{
					v.待确认msg_id[data.msg_id] = {};
				}
			},
			转化聊天数据(data,tell,tell_no_img){
				switch(data.msg_type){
		    		case 'event':
		    			tell.text = data.text;
		    			tell_no_img.text = data.text;
			    		break;
			    		
			    	case 'text':
			    		tell.text = data.text;   
		    			tell_no_img.text = data.text.replace(statics.emoj.emoj_regex,(code)=>{return this.codeTo中文(code);});
			    		break;
			    	
			    	case 'image':
			    		tell.media = data.media;
			    		tell_no_img.text = '[图片]';
			    		break;
			    	case 'file':
			    		tell.media = data.media;
			    		tell_no_img.text = '[文件]';
			    		break;
			    	case 'text_recommend':
			    		tell.msg_type='text';
			    		tell.text = data.text;
		    			tell_no_img.text = '推荐问题';
			    		break;
		    	}
			},
			getSessionDetail(s){
				let v= this;
				v.$api.ajaxNoLoading(v.$uri.user.游客+'/'+s.session_id,'get')
				.then(data=>{             console.log('自己拿的',data);
					v.更新用户信息(data);
				});
			},
			更新用户信息(data, sid){   
				let v= this;
				let i = v.sessions索引[data.uid].index;  
				for(let k in data){
					if(data[k])
						v.sessions[i][k] = data[k];
				}
				v.mixin_changeSessionStatus(sid || data.uid, v.sessions[i].status);
			},
			getClassifyList(){
		  		var v = this;
		  		this.$api.ajaxNoLoading('/questions/tags','get').then(function (r) {
					v.tags = r;     
				})
		  	},
		  	getAnswers(){
		  		var v = this;
		  		this.$api.ajaxNoLoading('/answers','get').then(function (data) {
					v.answers = data;     
				})
		  	},
			//title通知
			setTimeoutF(){
				let v = this;
				if(v.title.count>0){
					document.title=v.title.news.slice(v.title.index);
					v.title.index = v.title.index==5?0:v.title.index+1;
					v.title.count--;
					setTimeout(v.setTimeoutF,1500)
				}else{
					v.title.count=10;
					document.title = v.title.statics;
				}
			},
			titleInfo(){
				let v = this;
				if(v.title.count==10){
					v.setTimeoutF();
				}else{
					v.title.index=0;
					v.title.count=10;
				}
			},
			//通知栏
			newInfo(info,user,clickFun){ 
				document.getElementById('audio1').play();
				let v =this;
				v.titleInfo();
				if(!window.newInfos) window.newInfos=[];
				if(window.Notification && Notification.permission !== "denied"){
					Notification.requestPermission(function(status) {
						if(window.newInfos.length==3){
							window.newInfos[2].close();
							window.newInfos.pop();
						}
						const n = new Notification(user?user+'说':'新的消息', { 
							icon: logo,  
							body: info ,
							silent:false,
							//sound:'http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201702/8343.mp3',
						});
						window.newInfos.unshift(n);
						n.onclick=function(){
							clickFun();
						},
						n.onshow = function() {  
				            setTimeout(function() {  
				                n.close();  
				            }, 4000);  
				        };  
					})
				}else{
					const h = this.$createElement;
				    this.$notify({
					    title: '新的消息',
					    type:'info',
					    position:'bottom-left',
					    message: h('i', { style: 'color: teal'}, info),
					    onClick:clickFun,
				    });
				}
			},
			
			/*返回推送信息id(id){
				this.$api.ajaxNoLoading(`${this.$uri.session.返回推送信息id}/${id}`,'post');
			},*/
			//告诉后台客服离开与进入
			通知关闭与进入(status){
				this.$api.ajaxNoLoading('/user/offline','get',{no_offline:status});
			},
			codeTo中文(code){    
				let v= this;   
				let str = code;
				for(let i=0;i<v.emoj.length;i++){
					if(v.emoj[i].code == code || (v.emoj[i].code2!=undefined && v.emoj[i].code2 == code)){   
						str = v.emoj[i].sign;
						break;
					}
				}
				return str;
			}
		},
		components:{
			mapActions,
  			mapGetters
		},
		watch:{
			session_current_id(n,o){   
				let v = this;
				if(n!=='' ){
					n = v.sessions索引[n].index;
					if(n!==undefined&& this.sessions[n].source===''){
						this.getSessionDetail(v.sessions[n]);
					}
					if(n!==undefined&&v.sessions[n].historys_page.page==0){
						v.mixin_会话历史(v.sessions[n]);
					}
				}
			},
		},
		beforeDestroy(){
			let v= this;
			v.取消订阅();
			window.onbeforeunload=null;
			window.onunload=null;
			//	v.closeSocket();
		}
	}
</script>

<style lang="scss">
	$list-bg-c:#edf3f7;
	#servicer {
		width:100%; height:100%;
		padding-left:0 !important;
		padding-right:0 !important;
		.select_model {position:absolute; top:25px; right:130px; z-index:20;}
		.session_list {
			height:100%;
			li {
				.session-item_wrap{
					height:74px; position:relative; 
					&:after {content:''; display:block; width:1000px; height:0; border-bottom:1px solid #eff5f8; position:absolute; bottom:0; left:0;}
					div {
						&> span {
							font-size:12px; border-radius:10px;  color:#fff; text-align:center; display:inline-block; min-width:18px; line-height:18px; padding:0 3px; position:absolute; right:10px; bottom:10px;
							&.c1 {background:#33c848;}
							&.c2 {background:#f54a45;}
							&.c3 {background:#fec03b;}
						}
					}
					h3 {
						line-height:30px; height:30px;
						span:first-child {display:inline-block; max-width:80%;overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;}
					}
					p {display:inline-block; line-height:30px; max-width:78%;overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;}
					&>div{
						padding:10px;
					}
				}
				&.on,&.on:hover{
					background:$list-bg-c;
				}
				&:hover {background:#f7fafc;}
				/*@media only screen and (min-width:1360px ) {
					.icon {background:#fff; display:inline-block; border-radius:50px; position:absolute; left:15px; top:13px; width:50px;height:50px; line-height:50px; text-align:center; border:1px solid #eee; overflow:hidden;}
					.icon img {max-width:50px;}
				}
				@media only screen and (max-width:1361px ) {
					.icon {display:none;}
					&> div { margin-left:0px;}
				} */
			}
		}
	}
</style>
