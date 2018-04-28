<template>
	<div id="sessions_history">
		<div class="search_area">
			<div class="page_title">
				历史会话
				<div class="pull-right search_time">
					<my-date-picker v-model="page.extent" :maxTime="Date.now()" type="datetimerange" @change="changeExtentTime()" placeholder="选择日期范围"></my-date-picker>	
				</div>	
			</div>
			<div class="input-group search_wrap clearfix">
                <Input v-model="page.q" size="small" @on-enter.prevent='searchs(1)' placeholder="请输入搜索内容">
	                <Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
	                    <Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
	                </Select>
	                <Button slot="append" icon="search" @click="searchs(1)"></Button>
                </Input> &ensp;&nbsp;
                <el-select v-model="page.kf_id" @change="searchs()" placeholder="请选择" size="small" class="kf">
					<el-option label="全部客服" value=""> </el-option>
				    <el-option v-for="(k,v) in kfs" :label="k.username" :value="v"> </el-option>
				</el-select> &ensp;
				<el-select v-model="page.question_status" @change="searchs()" placeholder="请选择" size="small" class="resolve">
					<el-option label="全部状态" value=""> </el-option>
				    <el-option label="已解决" value="1"> </el-option>
				    <el-option label="未解决" value="0"> </el-option>
				</el-select> &ensp;
				<div class="select_group">
					<el-select v-model="page.tag1" @change="page.tag2='';searchs();" placeholder="请选择" size="small" >
						<el-option label="不分类" value=""> </el-option>
						<el-option v-for="t in tags" :label="t.name" :value="t.id"> </el-option>
					</el-select> &ensp;
					<el-select v-model="page.tag2" @change="searchs()" placeholder="请选择" size="small" >
						<el-option label="不分类" value=""> </el-option>
						<el-option v-for="t in Tag2" :label="t.name" :value="t.id"> </el-option>
					</el-select>
				</div> &ensp;
				<!--<el-select v-model="page.customer_satisfaction" @change="searchs()" placeholder="满意度" size="small" class="resolve">
					<el-option label="所有满意度" value=""> </el-option>
					<el-option v-for="(s,i) in satisfactions" :value="i" :label="s"></el-option>
				</el-select>-->
				<el-select v-model="page.source" @change="searchs()" placeholder="来源" size="small" class="resolve">
					<el-option label="所有来源" value=""> </el-option>
					<el-option v-for="(s,i) in source" :value="s.value" :label="s.text"></el-option>
				</el-select>
                
                <button  @click="$api.downloadFromService('历史会话.xlsx','/api/export?type=log')"  class="my-btn my-btn-info-f pull-right">导出</button>
            </div>
		</div>
		<br />
		<div class="table_wrap">
			<div class="simulate_table table4">
				<ul class="thead">
					<li class="tr">
						<div class="th">接入会话</div>
						<div class="th">用户名</div>
						<div class="th">客服名</div>
						<div class="th">会话开始时间</div>
						<div class="th">会话更新时间</div>
						<div class="th">咨询分类</div>
						<!--<th>满意度</th>-->
					</li>
				</ul>
				<ul class="tbody">
					<li class="tr pointer" v-for="(h,i) in historys" @click="changeCurrents(i)" :class="currents===i?'on':''">
						<div class="td">
							<i v-if="(new Date().getTime()-new Date(h.updated).getTime())<47*3600*1000" @click.prevent.stop="startSession(h)" class="ivu-icon ivu-icon-chatbubble-working font20 pointer" style="color:#2095f2;"></i>
							<i v-else class="ivu-icon ivu-icon-chatbubble-working c_c4d0dd font20"></i>
						</div>
						<div class="td">{{h.nickname||'Guest'+h.session_id.slice(15)}}</div>
						<div class="td">{{h.kfname}}</div>
						<div class="td">{{h.created}}</div>
						<div class="td">{{h.updated}}</div>
						<div class="td">{{matchTag(h.tag1,h.tag2)}}</div><!--<td>{{satisfactions[h.customer_satisfaction]}}</td>-->
					</li>
				</ul>
			</div>
		</div><br />
		<div class="text-center" v-if="historys.length>0">
			<!--<pagination :page="page" :total="total" @pageTurn="searchs"></pagination>-->
			<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
		</div>
		<my-modals v-model="AUX.show_detail" :free="true" width="750">
			<div class="session_detail" v-if="currents!==''">
				<chatbox :session="historys[currents]"  :showRecommendAnswer="false" :finds="page.q"></chatbox>
				<div class="info_warp">
					<bar :wrapper="'wrapper'">
						<sdetail :info="historys[currents]" :tags="tags"></sdetail>
					</bar>
					<footer>
						<Button @click="showWorkOrder" class="create_btn">创建工单</Button>
					</footer>
				</div>
			</div>
		</my-modals>
		<createWorkOrder v-model="show_work_order" :work_order="work_order"></createWorkOrder>
		
	</div>
</template>

<script>
	import pagination from '../module/pagination'
	import sdetail from './modules/userInfo.vue'
	import chatbox from './chatbox.vue'
	import sessions_mixin from './mixin/sessions.js'
	import bar from '../module/自定义滚动条.vue'
	import createWorkOrder from '../workold/modules/create_work_order.vue'
	
	export default{
		mixins:[sessions_mixin],
		props:['tags'],
		data(){
			return {
				show_work_order: false,
				work_order: {},
				page:{
					page:1,
					size:16,
					q:'',
					q_filed:'content',
					kf_id:'',
					kf_name:'',
					question_status:'',
					extent:[],
					start_time:'',
					end_time:'',
					tag1:'',
					tag2:'',
					customer_satisfaction:'',
					source:'',
				},
				kfs:{},
				satisfactions:['未评价','非常不满意','不满意','一般','满意', '非常满意'],
				source:[{value:'weixin',text:'微信'},{value:'h5',text:'浏览器'}],
				classifys:[],
				historys:[],
				total:0,
				currents:'',
				picker_option:{
					shortcuts: [{
			            text: '今天',
			            onClick(picker) {
			              	const end = new Date();
			              	const start = new Date(end.getFullYear(),end.getMonth(),end.getDate());
			              	picker.$emit('pick', [start, end]);
			            }
			          }, {
			            text: '昨天',
			            onClick(picker) {
			              const now = new Date();
			              const end = new Date(now.getFullYear(),now.getMonth(),now.getDate());
			              const start = new Date(end.getTime()-24*3600*1000);
			              picker.$emit('pick', [start, end]);
			            }
			          },],
			        disabledDate:function(n){
			        	if(n < new Date()){
			        		return false;
			        	}
			        	return true;
			        }
				},
				AUX:{
					show_detail:false,
					filterKeys:[
						{label:'会话内容',value:'content'},
						{label:'用户信息',value:'user'},
						{label:'会话备注',value:'remark_info'},
					],
				}
			}
		},
		created(){
			let end = new Date();
			let start = new Date();
			start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 6);
			this.page.extent = [start,end]
			this.searchs();
			this.$source.kfs().then(data=>{
				this.kfs = data;
			})
		},
		computed:{
			Tag2(){
				let v= this,tag2=[];
				if(v.page.tag1!==''){
					for(let i=0;i<v.tags.length;i++){
						if(v.tags[i].id==v.page.tag1){
							tag2 = v.tags[i].child;
							break;
						}
					}
				}
				return tag2;
			}
		},
		methods:{
			searchs(index=0){
				let v = this;
				if(index)v.page.page = index;
				let page = v.$api.deepCopy(v.page);
				delete page.extent;
				v.$api.ajax('/sessions/log','get',page)
				.then(data=>{
					data.list.forEach((val,i)=>{
						v.mixin_初始化会话(val);
						delete val.historys_page.end_time;
					})
					v.historys=data.list;
					v.total = data.total;
				})
			},
			initWorkOrder(){
				console.log(this.historys, this.currents)
				let sesstion = this.historys[this.currents];
				this.work_order = {
					uid: sesstion.session_id,
					nickname: sesstion.nickname,
					email: sesstion.email,
					mobile: sesstion.mobile
				}
			},
			showWorkOrder(){
				this.initWorkOrder()
				this.show_work_order=true
			},
			/*getKfs(){
				let v = this;
				v.$api.ajax('/users/info','get')
				.then(data=>{
					v.kfs=data.list;
				})
			},*/
			matchTag(t='',t1=''){   
				let v=this,result="未分类";
				if(t!==''){
					for(let i=0;i<v.tags.length;i++){
						if(v.tags[i].id==t){
							result =v.tags[i].name;
							if(t1!=='' && v.tags[i].hasOwnProperty('child')){
								for(let j=0;j<v.tags[i].child.length;j++){
									if(v.tags[i].child[j].id==t1){
										result +='/'+v.tags[i].child[j].name;
										break;
									}
								}
							}
							break;
						}
					}
				}
				return result;
			},
			changeExtentTime(){   
				let v = this;
				v.page.start_time =v.page.extent[0]?new Date(v.page.extent[0]).getTime()/1000:'';
				v.page.end_time = v.page.extent[1]?new Date(v.page.extent[1]).getTime()/1000:'';
				v.searchs();
			},
			startSession(s){
				let v = this;
				v.mixin_激活会话(s)
				.then(data=>{
					let 索引 = v.sessions索引[s.session_id];
					if(索引){
						v.mixin_changeSessionStatus(s.session_id, 1);
					}else{
						s.status = 1;
						v.mixin_sessionsPush(s)
					}
					v.session_current_id = s.session_id;
					v.$router.push('/servicer/session');
				})
			},
			changeCurrents(i){
				let v = this;
				v.currents = i;
				let session = v.historys[i];
				this.AUX.show_detail = true;
				if(session.historys_page.page==0){
					v.mixin_会话历史(session);
				}
			},
		},
		components:{
			pagination,
			sdetail,
			chatbox,
			bar,
			createWorkOrder
		},
		watch:{
			currents(n){
				if(n!==''&&n>=0){
					this.initWorkOrder();
				}
			}
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style lang="scss">
	@import '../../assets/scss/api.scss';
	$th_widths:(0.10,0.20,0.15,0.20,0.20,0.15);
	#sessions_history {
		padding:0 20px; position:relative;
		&>h3 {line-height:40px; position:absolute; }
		
		.simulate_table {
			@include simulateTableThWidth($th_widths);
		}
		.session_detail{
			width:100%;
			height:100%;
			font-size:0;
			& > div {
				display:inline-block;
				&:first-child {width:60%;}
				&:nth-child(2) {width:40%;}
			}
			.info_warp{
				.wrapper{
					height:calc(100% - 70px)
				}
				footer{
					height: 66px;
					padding: 0 10px;
					text-align: center;
					background: #f3f7f9;
				}
			}
		}
		.create_btn{
			position: relative;
			top: 18px;
		}
	}
	
	#sessions_history .search_area .el-date-editor--datetimerange.el-input {width:300px;}
	#sessions_history .search_area .resolve {width:100px;}
	#sessions_history .search_area .kf {width:100px;}
	#sessions_history .search_area .search {width:300px;; display:inline-block;}
	#sessions_history .search_area .search .el-select {width:98px;}
	#sessions_history .search_area .search > .el-input {width:200px;}
	#sessions_history .search_area .el-input-group__prepend {width:30%;}
	#sessions_history .session_detail > div {display:inline-block; vertical-align:top; width:59%;}
	#sessions_history .session_detail{ }
	#sessions_history .session_detail > div  {width:60%; height:100%; background: rgb(247, 251, 255); font-size:14px;}
	#sessions_history .session_detail > div:first-child {box-shadow: -2px 2px 5px #e0e0e0;}
	#sessions_history .session_detail > div + div {width:40%; background:#fff; border-left: 1px solid #d3e1f0;}
	#sessions_history .session_detail .wrapper {height:100%; padding:0 10px;}
	#sessions_history .session_detail .__chatbox .wrapper {padding :0 18px ;}
	.select_group {display:inline-block; font-size:0; vertical-align:top;}
	.select_group > * {display:inline-block;  vertical-align:top;}
	.select_group .el-select {width:120px; vertical-align:top;}
	.select_group .el-select:first-child .el-input__inner{border-top-right-radius:0; border-bottom-right-radius:0;}
	.select_group .el-select:last-child .el-input__inner{border-top-left-radius:0; border-bottom-left-radius:0; border-left:none;}
	
	.search_group {display:inline-block; font-size:0; vertical-align:top;}
	.search_group > * {display:inline-block; vertical-align:top;}
	
	.search_group .el-select:first-child .el-input__inner{border-top-right-radius:0; border-bottom-right-radius:0;}
	.search_group .el-select  + .el-input .el-input__inner {border-top-left-radius:0; border-bottom-left-radius:0; border-left:none; padding-right:20px;;}
	.search_group .el-select  + .el-input .el-icon-search {position:absolute; top:8px;right:10px; cursor:pointer;}
	.search_group .el-select  + .el-input .el-icon-search:hover {color:#000;}
	.translate-left-leave-to,.translate-left-enter {
		transform: translateX(1000px);
		
	}
	.translate-left-enter-to,.translate-left-leave {
		transform: translateX(0px);
	}
	
	.translate-left-enter-active{
		transition: all 0.5s ease;
	}
	.translate-left-leave-active {
		transition: all 0.5s ease;
	}
</style>