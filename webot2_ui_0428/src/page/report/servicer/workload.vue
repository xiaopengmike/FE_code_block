<template>
	<div class="workload report">
		<!--<div class="input-group serach_wrap clearfix">
			<span class="page_title pull-left">工作量报表</span>
		  	<input class="form-control" placeholder="请输入搜索关键字" v-model="page.q" @keydown.13="searchs" />
		  	<span class="pointer" @click="page.q=''"><img src="../../../assets/img/remove_icon.png"  /> </span>
		  	<span class="btns-search pointer"> 
		    	<span class="btns-search glyphicon glyphicon-search" @click="searchs()"></span> 
		  	</span>
		  	<el-date-picker v-model="page.time" :picker-options="pickerOptions" @change="searchs(1)" :clearable="false" type="daterange" format="yyyy年MM月dd日" placeholder="选择日期"> </el-date-picker>
		</div>-->
		<div class="table_filter">
			<button class="my-btn my-btn-info-o filter_btn" @click="show_table_th=!show_table_th" style="position:absolute; top:-40px; right:0;">
				筛选&nbsp;<i class="icon fa fa-angle-right" :class="{'active':show_table_th}"></i>
			</button>
			<div class="filter_wrap" v-show="show_table_th">
				<span class="th" v-for="(t,k) in table_th" :class="t.visibled?'visibled':''" @click="t.visibled=!t.visibled">{{k}}<Icon v-show="t.visibled" type="checkmark"></Icon></span>
			</div>
		</div>
		<br />
		<div class="table_wrap">
			<table class="table4">
				<thead>
					<tr>
						<th v-for="(t,k) in table_th" v-show="t.visibled">{{k}}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item,i) in list" v-if="i>=(page.page-1)*page.size&&i<page.page*page.size" @click="goDetail(item)" class="pointer">
						<td v-show="table_th.姓名.visibled">{{item.姓名}}</td>
						<td v-show="table_th.接入会话量.visibled">{{item.统计数据.会话量||'--'}}</td>
						<td v-show="table_th.未回复会话量.visibled">{{item.统计数据.未回复会话量||'--'}}</td>
						<td v-show="table_th.未回复率.visibled">{{(item.统计数据.未回复会话量/(item.统计数据.会话量||1)*100).toFixed(2)||'--'}}%</td>
						<td v-show="table_th.转接量.visibled">{{item.统计数据.转接量 || '--'}}</td>
						<td v-show="table_th.无效会话量.visibled">{{item.统计数据.无效会话量||'--'}}</td>
						<td v-show="table_th.留言处理量.visibled">{{item.统计数据.留言处理量||'--'}}</td>
						<td v-show="table_th.登录总时长.visibled">{{$api.MillisecondToDate(item.统计数据.登陆总时长*1000)}}</td>
						<td v-show="table_th.在线总时长.visibled">{{$api.MillisecondToDate(item.统计数据.在线总时长*1000)}}</td>
						<td v-show="table_th.在线时长比.visibled">{{(item.统计数据.在线总时长/(item.统计数据.登陆总时长||1)*100).toFixed(2)}}%</td>
					</tr>
				</tbody>
			</table>
		</div>
		<br />
		<div class="pagination_wrap" v-if="total>0">
			<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
			<!--<pagination :page="page" :total="total" v-on:pageTurn="pageTurn"></pagination>-->
		</div>
		<br />
	</div>
</template>

<script>
	import pagination from '../../module/pagination'
	export default{
		props:['time_frame'],
		data(){
			return {
				page:{
					page:1,
					size:16,
					start:'',
					end:'',
					id:'',
					group_id:'',
					
				},
				list:[],
				total:0,
				show_table_th:false,
				table_th:{
					姓名:{visibled:true},
					接入会话量:{visibled:true},
					未回复会话量:{visibled:true},
					未回复率:{visibled:true},
					转接量:{visibled:true},
					无效会话量:{visibled:true},
					留言处理量:{visibled:true},
					登录总时长:{visibled:true},
					在线总时长:{visibled:true},
					在线时长比:{visibled:true},
				}
		       		
		        
			}
		},
		created(){
	          
			this.searchs();
		},
		computed:{
			
		},
		methods:{
			searchs(index=undefined){
				let v = this;
				if(index) v.page.page= index;
				let page = v.$api.deepCopy(v.page);             
				if(this.time_frame&&this.time_frame.length==2) {
					page.start = v.$api.dateFormat('yyyy-MM-dd',this.time_frame[0]);
					page.end = v.$api.dateFormat('yyyy-MM-dd',this.time_frame[1]);
				}                          
				v.$api.ajax(v.$uri.客服报表数据.工作量列表,'get',page)
				.then(data=>{
					v.total = data.total;
					v.list=[];
					for(let i in data.result){    
						let kf = {};
						kf.id = data.result[i].id;
						kf.姓名 = data.result[i].姓名;
						kf.权限 = data.result[i].权限;  
						kf.统计数据 = data.result[i].统计数据.reduce((p,c,index)=>{
							return v.合并相同对象数字数据(p,c);
						})
						v.list.push(kf);
					}
				})
			},
			pageTurn(i){
				this.searchs(i);
			},
			goDetail(info){ 
				this.$router.push({name:'工作量详情',
									params:{info:info,historys:this.$router.history.current.matched,search:this.page.time},
									path:'/report/servicer/workloadDetail',
									query:{id:info.id}
								});
			},
			合并相同对象数字数据(p,n){
				for(let i in p){               
					if(!n.hasOwnProperty(i)) continue;
					p[i]=p[i]===null||p[i]===''?0:p[i];
					if(typeof p[i] == 'number' && typeof n[i] == 'number'){
						p[i] +=n[i];
					}
					while(typeof p[i] == 'string'){   
						try{
							p[i] = JSON.parse(p[i]);
						}catch(e){
							break;
						}
					}
					while(typeof n[i] == 'string'){ 
						try{
							n[i] = JSON.parse(n[i]);
						}catch(e){
							break;
						}
					}
					if(typeof p[i] == 'object' && typeof n[i] == 'object'){
						this.合并相同对象数字数据(p[i],n[i]);
					}
				}                    
				return p;
			}
		},
		components:{
			pagination,
		},
		watch:{
			'time_frame':{
				handler(n){
					this.searchs();
				},deep:true
			}
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style>
	
</style>