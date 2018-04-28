export default {
	data(){
		return {
		}
	},
	computed:{
		sessions:{
			get(){
				return this.$store.state.service.sessions;
			},
			set(val){                        
				let chatting = 0;  //正在聊天的会话数量
				this.$store.state.service.sessions = val;
				this.$store.state.service.sessions索引 = {};
				val.forEach((val,i)=>{
					this.$store.state.service.sessions索引[val.session_id] = {
						index:i,
						status:val.status,
						msg_ids:[],
					}
					//记录正在聊天的数量
					memoryStorage.setItem('sessions索引',this.$store.state.service.sessions索引);
				})
			},
			
		},
		sessions索引:{
			get(){
				return this.$store.state.service.sessions索引;
			},
			set(val){
				this.$store.state.service.sessions索引 = val;
			}
		},
		session_current_id:{
			get(){
				return this.$store.state.service.session_current_id;
			},
			set(id){
				this.$store.dispatch('setSessionCurrentId',id);
			}
		}
	},
  	methods:{
  		mixin_初始化会话(session){
			session.question_status = session.question_status?session.question_status:'';
			session.tag1 = session.tag1?session.tag1:'';
			session.tag2 = session.tag2?session.tag2:'';
			session.remark_info = session.remark_info?session.remark_info:'';
			session.status = session.status===undefined?1:session.status;
			session.tell= [];										//新消息列表
			session.tell_no_img=[];							//去除图片的新消息列表
			session.historys=[];								//历史消息
			session.original_historys=[];					//未处理历史
			session.news=0;									//未读信息数
			session.news_update=Date.now();			//记录最后一条信息来的时间（本地时间）
			session.scroll={bottom:0,distance_top:false};                             //记录该滚动多高
			session.historys_page={page:0,size:20,end_time:Date.now()/1000};  //历史分页
			session.can_get_historys=true;              //是否已经拿完了历史
			session.getting_historys = false;            //正在获取历史中（防止同时多次触发）
			session.emial = session.emial||'';
			session.mobile = session.mobile||'';
			session.ip = session.ip||'';
			session.source = session.source||'';
			session.head = session.head || '';
		},
		mixin_激活会话(s,user_id=this.$store.state.global.user.id){   
			let v = this;
			return new Promise((resolve,reject)=>{
				v.$api.ajax('/chats/activate/'+s.session_id,'put',{kf_id:user_id})
					.then(data=>{                       
						s.status = 1;
						this.mixin_初始化会话(s);
						resolve(resolve);                              //激活后必须把main.vue里的ids索引也要加上。
					})
					.catch(err=>{                            
						reject(err);
					})
			})
		},
		mixin_会话历史(s){        
			let v = this;  
			if(s.historys_page.page*s.historys_page.size==s.original_historys.length)
				s.historys_page.page += 1;
			let page = v.$api.deepCopy(s.historys_page);
			page.session_id = s.session_id;
			s.getting_historys = true;
			return new Promise((resolve,reject)=>{
				v.$api.ajaxNoLoading(v.$uri.session.log,'get',page)
				.then(data=>{
					resolve(data);
					s.question_status = data.question_status;
					s.remark_info = data.remark_info;
					s.tag1 = data.tag1;
					s.tag2 = data.tag2;
					v.mixin_处理历史(s,data.list);
					s.getting_historys = false;
				}).catch(err=>{
					reject(err);
					s.getting_historys =false;
				})
			})
		},
		mixin_处理历史(s,data){    
			let v = this;										
			//判断本次会话的信息
			/*for(let i=0; i<data.length; i++){
				if(data[i].msg_type=='qa' || data[i].msg_type=="text_evaluation" || (data[i].event_type && data[i].event_type.indexOf(['结束会话', '分配客服']) != -1) || data[i].text.indexOf('结束')!=-1){
					break;
				}
				if(data[i].msg_type =='event' && ( (data[i].event_type && data[i].event_type.indexOf(['激活', '转接', '人工']) != -1) ||data[i].text.indexOf('转接')!=-1 || data[i].text.indexOf('激活会话')!=-1)){
					break;
				}
				let tell = data.shift();
				s.tell.unshift(tell);
				i--;
			}*/
			data = data.reverse();  
			if(data.length==0 ){
				s.can_get_historys=false;    
				s.historys.unshift({msg_type:'info2',info_b:'———————',info:'没有更多了'});
				return false;
			}else{
				s.original_historys = data.concat(s.original_historys);
				let h = s.original_historys ;
				let list = [];
				for(let i=0;i<h.length;i++){
					let n = v.$api.dateFormat('yyyy-MM-dd',h[i].time);
					let p =h[i-1]?v.$api.dateFormat('yyyy-MM-dd',h[i-1].time):'';
					if(n!==p)
						list.push({
							msg_type:'info',
							times:n,
						})
					list.push(h[i]);
				}
				
				s.historys = list;
				
				//数目不对即全部数据
				if(data.length<s.historys_page.size){
					s.can_get_historys=false;    
					s.historys.unshift({msg_type:'info2',info_b:'———————',info:'没有更多了'});
				}
			}
		},
  		mixin_结束会话(sid){
  			let v = this;
			return new Promise((resolve,reject)=>{
				this.$api.ajax('/chats/'+sid,'put')
				.then(data=>{
					let index = v.sessions索引[sid].index;
					v.sessions索引[sid].status = 2;
					v.sessions[index].status=2;
					resolve([v.sessions[index],index]);
				}).catch(err=>{
					reject(err);
				})
			})
  		},
  		mixin_关闭会话(s){
  			let v = this;   
  			v.mixin_changeSessionStatus(s.session_id, 2);
  		},
  		mixin_getSession(sid){
  			let index = this.sessions索引[sid] ? this.sessions索引[sid].index : -1;
  			if(this.sessions[index])
  				return this.sessions[index];
  			else
  				return false;
  		},
  		mixin_changeSessionStatus(sid, status){        
			let session = this.mixin_getSession(sid);
			if(status == session.status) return false;
			this.sessions索引[sid].status = session.status = status;
			memoryStorage.setItem('sessions索引', this.sessions索引);
			if(status != 1){
				session.news = 0;
			}
		},
  		mixin_sessionsPush(s){
  			this.$store.state.service.sessions.push(s);
  			this.sessions索引[s.session_id] = {
  				index: this.sessions.length-1,
  				status: s.status,
  				msg: [],
  			};
  			memoryStorage.setItem('sessions索引', this.sessions索引);   
  		},
		mixin_sessionsRemove(id){  
			//提前
			if(id == this.session_current_id){
				this.session_current_id = '';
			}
			let index = this.sessions索引[id].index;
  			this.sessions.splice(index,1);
  			//重新计算索引
  			let 索引2={};
  			this.$store.state.service.sessions.forEach((val,i)=>{
				索引2[val.session_id] = {
					index:i,
					status:val.status,
					msg_ids: this.sessions索引[val.session_id].msg_ids,
				}
			})
  			this.sessions索引 = 索引2;
  			memoryStorage.setItem('sessions索引', 索引2);
  			//重新选择正在的id
  			if(id == this.session_current_id){
  				for(let i=0; i<this.sessions.length; i++){
					if(this.sessions[i].status==1 ){
						this.session_current_id =this.sessions.session_id ;
						break ;
					}
				}
  			}
		},
		
		mixin_msgPush(sid,mid){   
			this.sessions索引[sid].msg_ids.push(mid);
		},
		mixin_msgSplice(sid,mid){
			let index = this.sessions索引[sid].msg_ids.indexOf(mid);
			this.sessions索引[sid].msg_ids.splice(index,1);
		}
  	},
}