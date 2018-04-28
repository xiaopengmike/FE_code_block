<template>
	<div id="guestbook">
		<div class="session_list"  @wheel.stop.prevent="">
			<h1>留言列表</h1>
			<div class="search">
				<el-row>
					<el-col :span="14">
						<el-date-picker v-model="page.time" type="daterange" :picker-options="pickerOptions2" @change="getList" align="right" format="M-d" size="small" placeholder="选择日期范围" > </el-date-picker>
					</el-col>
					<el-col :span="9" :offset="1">
						<el-select size="small" v-model="page.status" @change="getList">
							<el-option :label="'全部'" :value="''"></el-option>
							<el-option :label="'未接单'" :value="0"></el-option>
							<el-option :label="'已指派'" :value="1"></el-option>
						</el-select>
					</el-col>
				</el-row>
			</div>
			<bar :wrapper="'wrapper'" >
				<ul>
					<!--未处理-->
					<li v-for="(g,i) in 留言s" v-if="g.status==0" @click="changeCurrent(i)" :class="current===i?'on':''" class="pointer" :index="i">
						<div class="session-item_wrap">
							<div>
								<h3 class="font14">
									<span v-if="g.nickname" :title="g.nickname">{{g.nickname}}</span>
									<span v-else>Guest{{g.uid.slice(-8)}}</span>
									<span v-if="$api.计算相差多少天(g.created)>=2" class="pull-right opcity5">{{/(\d{2}-\d{2}-\d{2})/.exec(g.created)[0]}}</span>
									<span v-if="$api.计算相差多少天(g.created)==1" class="pull-right opcity5">昨天</span>
									<span v-if="$api.计算相差多少天(g.created)==0" class="pull-right opcity5">{{/\s(\d{2}:\d{2})/.exec(g.created)[0]}}</span>
								</h3>
								<p class="font14 opcity5" :title="g.content"
									v-html="g.content">
								</p>
								<span v-if="g.status==0" class="pull-right c1">未处理</span>
								<span v-else class="pull-right c2">已处理</span>
							</div>
						</div>
					</li>
					<!--已处理-->
					<li v-for="(g,i) in 留言s" v-if="g.status!=0" @click="changeCurrent(i)" :class="current===i?'on':''" class="pointer" :index="i">
						<div class="session-item_wrap">
							<div>
								<h3 class="font14">
									<span v-if="g.nickname" :title="g.nickname">{{g.nickname}}</span>
									<span v-else>Guest{{g.uid.slice(-8)}}</span>
									<span v-if="$api.计算相差多少天(g.created)>=2" class="pull-right opcity5">{{/(\d{2}-\d{2}-\d{2})/.exec(g.created)[0]}}</span>
									<span v-if="$api.计算相差多少天(g.created)==1" class="pull-right opcity5">昨天</span>
									<span v-if="$api.计算相差多少天(g.created)==0" class="pull-right opcity5">{{/\s(\d{2}:\d{2})/.exec(g.created)[0]}}</span>
								</h3>
								<p class="font14 opcity5" :title="g.content"
									v-html="g.content">
								</p>
								<span v-if="g.status==0" class="pull-right c1">未处理</span>
								<span v-else class="pull-right c2">已处理</span>
							</div>
						</div>
					</li>
				</ul>
			</bar>
		</div>
		<div class="section">
			<div v-if="current!==''" @wheel.stop.prevent="">
				<h1 class="first">留言信息
					<span v-if="留言s[current]&&留言s[current].status==0" @click="changeStatus(1)" class="c1 unselect pointer">接单</span>
					<span v-if="留言s[current]&&留言s[current].status==1&&(new Date().getTime()-new Date(留言s[current].created).getTime()>=47*3600*1000||留言s[current].user_id!=$store.state.global.user.id)" class="c2 unselect pointer">已接单</span>
					<span v-if="留言s[current]&&留言s[current].status==1&&new Date().getTime()-new Date(留言s[current].created).getTime()<47*3600*1000&&留言s[current].user_id==$store.state.global.user.id" @click="startSession(留言s[current],留言s[current].uid)" class="c3 unselect pointer">激活会话</span>
				</h1>
				<div class="guestbook">
					<chatbox :session="留言s[current].session1"  :showRecommendAnswer="false" :showhistory="false"></chatbox>
				</div>
			</div>
			<div v-if="current!==''" @wheel.stop.prevent="">
				<h1 class="second">历史记录</h1>
				<div class="historys">
					<chatbox :session="留言s[current].session2"  :showRecommendAnswer="false"></chatbox>
				</div>
			</div>
		</div>
		<div class="aside">
			<template v-if="current!==''">
				<div class="tab">用户信息状态</div>
				<bar :wrapper="'wrapper'">
					<sdetail :info="留言s[current]" :tags="tags"></sdetail>
				</bar>
			</template>
		</div>
	</div>
</template>

<script>
	import bar from '../module/自定义滚动条.vue'
	import chatbox from './chatbox.vue'
	import sdetail from './modules/userInfo.vue'//'./session_detail.vue'
	import sessions_mixin from './mixin/sessions.js'
	export default{
		mixins:[sessions_mixin],
		props:['tags'],
		data(){
			return {
				current:'',
				留言s:[],
				page:{
					time:[],
					start_time:'',
					end_time:'',
					status:'',
				},
				pickerOptions2: {
		          	shortcuts: [{
			            text: '最近一周',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			              picker.$emit('pick', [start, end]);
			            }
			        }, {
			            text: '最近一个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
			              picker.$emit('pick', [start, end]);
			            }
			        }, {
			            text: '最近三个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
			              picker.$emit('pick', [start, end]);
			            }
			        }],
			        disabledDate:function(n){
			        	if(n < new Date()){
			        		return false;
			        	}
			        	return true;
			        }
		        },
			}
		},
		created(){
			this.getList();
		},
		computed:{
			
		},
		methods:{
			getList(){
				let v =this;
				v.current = '';                      
				let page = v.$api.deepCopy(v.page);       
				if(page.time.length!=0&&page.time[0]){
					page.start_time = new Date(page.time[0]).getTime()/1000;
					page.end_time = new Date(page.time[1]).getTime()/1000;
				}
				if(page.start_time==page.end_time){
					page.end_time +=23.9*3600;
				}
				delete page.time;
				v.$api.ajax(v.$uri.session.guestbook,'get',page)
				.then(data=>{
					v.留言s=[];
					data.list.forEach((val,i)=>{
						v.初始化留言(val);
						v.留言s.push(val); 
					});
				})
			},
			初始化留言(gb){
				let v = this;
				gb.session2={};
				gb.session1={};
				v.mixin_初始化会话(gb);
				v.mixin_初始化会话(gb.session2);
				v.mixin_初始化会话(gb.session1);
				gb.session2.session_id = gb.uid;
				gb.session1.session_id = gb.uid;
				gb.session1.head = gb.head;
				gb.session_id=gb.uid;
				delete gb.session1.historys;
				if(gb.content instanceof Array){
					gb.content.forEach((c,j)=>{
						gb.session1.tell.push({
							from:'user',
				    		msg_type:'text',
				    		text:c,
				    		time:gb.created,
						});
					})
				}else{
					gb.session1.tell.push({
			    		msg_type:'info',
			    		times:v.$api.dateFormat(" - - - - - - - - yyyy-MM-dd - - - - - - - -",gb.created),
					});
					gb.session1.tell.push({
						from:'user',
			    		msg_type:'text',
			    		text:gb.content,
			    		time:gb.created,
					});
				}
			},
			changeCurrent(i){
				let v = this;
				v.current = i;
				let session = v.留言s[i].session2;				
				if(session.historys_page.page!=0) return;    
				if(v.留言s[i].head)
					v.getDetail(i);
				v.mixin_会话历史(session)
			},
			getDetail(i){
				let v = this;
				v.$api.ajaxNoLoading('/chats/'+v.留言s[i].uid,'get')
				.then(data=>{
					let 留言 = v.留言s[i];
					if(!留言.head){
						v.$set(留言,'head',data.head);
						v.$set(留言.session2,'head',data.head);
					}
					if(!留言.nickname)
						v.$set(留言,'nickname',data.nickname);
					if(!留言.address)
						v.$set(留言,'address',data.address);
					if(!留言.email)
						v.$set(留言,'email',data.email);
					if(!留言.mobile)
						v.$set(留言,'mobile',data.mobile);
				});
			},
			changeStatus(status){   
				let v = this;
				v.$api.ajax(v.$uri.session.guestbook,'put',{id:v.留言s[v.current].id,status:status})
				.then(data=>{
					v.留言s[v.current].status=status;
					v.留言s[v.current].user_id = v.$store.state.global.user.id;
				})
			},
			//激活会话
			startSession(s,uid){
				let v =this;
				s.session_id = uid;
				s.uid = uid;
				v.mixin_激活会话(s)
				.then(data=>{
					let 索引 = v.sessions索引[s.session_id];
					if(索引){
						v.sessions[索引.index].status = 1;
					}else{
						s.status = 1;
						v.mixin_sessionsPush(s);
					}
					v.session_current_id = s.session_id;
					v.$router.push('/servicer/session');
				})
			},
		},
		components:{
			bar,chatbox,sdetail,
		},
		watch:{
			'current':function(n){
				if(n!==''&&this.留言s[n].detail!=''){
					this.getDetail(n);
				}
			}
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style lang="scss" scoped="">
	#guestbook {
		font-size:0;
		height:100%;
		& > * {display:inline-block; font-size:14px; vertical-align:top;}
		.session_list {
			width:20%;
			height:100%; 
			h1 {font-size:16px; line-height:44px; padding:0 10px; border-bottom:1px solid #d3e1f0; }
			.search {
				padding:20px 10px;
				background:#f7fbff;
				.el-date-editor--daterange.el-input {width:100%;}
			}
			.wrapper {max-height:calc(100% - 115px);*background:#edf4fc;}
			li {
				.session-item_wrap div > span {
					background:none;
					bottom:6px;
					&.c1 {color:#f8b551;border:1px solid #f8b551; background: none;}
					&.c2 {color:#98acc5;border:1px solid #98acc5;background: none;}
				}
			}
		}
		.section {
			width:60%;
			height:100%;
			border-left:1px solid #d3e1f0; border-right:1px solid #d3e1f0;
			& > div {
				height:calc(50%);
				h1 {
					font-size:16px;text-align:center; line-height:44px;position:relative;
					&.first {border-bottom:1px solid #d3e1f0;}
					&.second { border-top:1px solid #d3e1f0;}
					span {
						position:absolute; font-size:14px; top:10px; right:30px; display:inline-block; width:80px; height:25px; line-height:25px;;
						&.c1 {color:#fff;background:#f8b551;}
						&.c2 {border:1px solid #DDD; background:#F5F5F5; color:#ACA899;}
						&.c3 {border:1px solid #DDD; background:#59c16d; color:#fff;}
					}
					
				};
				.guestbook,.historys {
					height:calc(100% - 45px); padding:0px; background:#f7fbff;
					 .__chatbox .wrapper {padding:0 15px;}
				}
			}
			
		}
		.aside {
			height:100%;
			width:20%;
			.tab {height:45px; line-height:45px; text-align:center; border-bottom:1px solid #d3e1f0;}
			.wrapper {max-height:calc(100% - 45px); padding:0 4%;}
		}
	}
	/*.session_list {
		ul {
			li{
				padding:10px; height:70px; position:relative; overflow:hidden;
				&.on {background:#d3e1f0;}
				&:hover {background:#e6effb;}
				
			}
		}
	}*/
</style>