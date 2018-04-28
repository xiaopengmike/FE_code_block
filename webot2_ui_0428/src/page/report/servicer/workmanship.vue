<template>
	<div class="workload report">
		<div class="table_filter">
			<button class="my-btn my-btn-info-o filter_btn" style="position:absolute; top:-40px; right:0;" @click="show_table_th=!show_table_th">
				筛选&nbsp;<i class="icon fa fa-angle-right" :class="{active:show_table_th}"></i>
			</button>
			<div class="filter_wrap" v-show="show_table_th">
				<span class="th" v-for="(t,k) in table_th" :class="table_th[k].visibled?'visibled':''" @click="table_th[k].visibled=!table_th[k].visibled">{{k}}<Icon v-show="table_th[k].visibled" type="checkmark"></Icon></span>
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
					<tr v-for="(item,i) in list" @click="goDetail(item)" class="pointer">
						<td v-show="table_th.姓名.visibled">{{item.姓名}}</td>
						<td v-show="table_th.平均首次响应时间.visibled">{{item.平均首次响应时间}}</td>
						<td v-show="table_th.平均响应时间.visibled">{{item.平均响应时间}}</td>
						<td v-show="table_th['30秒应答率'].visibled">{{item.应答率30s}}</td>
						<td v-show="table_th.平均会话时长.visibled">{{item.平均会话时长}}</td>
						<td v-show="table_th.参评率.visibled">{{item.参评率}}%</td>
						<td v-show="table_th.相对满意度.visibled">{{item.满意度}}%</td>
						<td v-show="table_th.答问比.visibled">{{(item.统计数据.客服答案数/(item.统计数据.客户问题数||1)).toFixed(2)}}</td>
						<td v-show="table_th.一次性解决率.visibled">{{item.一次性解决率}}%</td>
						<td v-show="table_th.满意度详情.visibled">满意({{item.统计数据.满意统计.满意}})不满意({{item.统计数据.满意统计.不满意}})</td>
					</tr>
				</tbody>
			</table>
		</div>
		<br />
		<div class="pagination_wrap" v-if="total>0">
			<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
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
				total:0,
				list:[],
				show_table_th:false,
				table_th:{
					姓名:{visibled:true},
					平均首次响应时间:{visibled:true},
					平均响应时间:{visibled:true},
					'30秒应答率':{visibled:true},
					平均会话时长:{visibled:true},
					参评率:{visibled:true},
					相对满意度:{visibled:true},
					答问比:{visibled:true},
					一次性解决率:{visibled:true},
					满意度详情:{visibled:true},
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
					let length = (new Date(page.end).getTime() - new Date(page.start).getTime())/(24*3600*1000)+1;
					for(let i in data.result){
						let kf = {};
						kf.id = data.result[i].id;
						kf.姓名 = data.result[i].姓名;
						kf.权限 = data.result[i].权限;          console.log(data.result[i].统计数据)
						kf.统计数据 = data.result[i].统计数据.reduce((p,c,index)=>{
							return v.合并相同对象数字数据(p,c);
						})
						while(typeof kf.统计数据.首次响应时间 == 'string'){ 
							try{
								kf.统计数据.首次响应时间 = JSON.parse(kf.统计数据.首次响应时间);
							}catch(e){
								break;
							}
						}
						kf.平均首次响应时间 = (kf.统计数据.首次响应时间.all/((kf.统计数据.首次响应时间['<15s']+kf.统计数据.首次响应时间['15s-30s']+kf.统计数据.首次响应时间['30s-45s']+kf.统计数据.首次响应时间['45s-1m']+kf.统计数据.首次响应时间['>1m'])||1)/60).toFixed(2);
						while(typeof kf.统计数据.响应时间 == 'string'){ 
							try{
								kf.统计数据.响应时间 = JSON.parse(kf.统计数据.响应时间);
							}catch(e){
								break;
							}
						}
						
						kf.平均响应时间 = (kf.统计数据.响应时间.all/((kf.统计数据.响应时间['<15s']+kf.统计数据.响应时间['15s-30s']+kf.统计数据.响应时间['30s-45s']+kf.统计数据.响应时间['45s-1m']+kf.统计数据.响应时间['>1m'])||1)/60).toFixed(2);
						kf.应答率30s = ((kf.统计数据.响应时间['<15s']+kf.统计数据.响应时间['15s-30s'])/((kf.统计数据.响应时间['<15s']+kf.统计数据.响应时间['15s-30s']+kf.统计数据.响应时间['30s-45s']+kf.统计数据.响应时间['45s-1m']+kf.统计数据.响应时间['>1m'])||1)*100).toFixed(2);
						while(typeof kf.统计数据.会话时长 == 'string'){
							try{
								kf.统计数据.会话时长 = JSON.parse(kf.统计数据.会话时长);
							}catch(e){
								break;
							}
						}
						kf.平均会话时长 = (kf.统计数据.会话时长.all/((kf.统计数据.会话时长['<2m']+kf.统计数据.会话时长['2m-4m']+kf.统计数据.会话时长['4m-6m']+kf.统计数据.会话时长['6m-8m']+kf.统计数据.会话时长['>8m'])||1)/60).toFixed(2);
						while(typeof kf.统计数据.满意统计 == 'string'){
							try{
								kf.统计数据.满意统计 = JSON.parse(kf.统计数据.满意统计);
							}catch(e){
								break;
							}
						}				
						if(kf.姓名=='admin'){
							console.log(kf.统计数据.会话时长.all)
							console.log(kf.统计数据.会话时长['<2m']+kf.统计数据.会话时长['2m-4m']+kf.统计数据.会话时长['4m-6m']+kf.统计数据.会话时长['6m-8m']+kf.统计数据.会话时长['>8m'])
						}
						kf.参评率 = ((kf.统计数据.满意统计.满意+kf.统计数据.满意统计.不满意)/((kf.统计数据.满意统计.满意+kf.统计数据.满意统计.不满意+kf.统计数据.满意统计.未评价)||1)*100).toFixed(2);
						kf.满意度 = (kf.统计数据.满意统计.满意/((kf.统计数据.满意统计.满意+kf.统计数据.满意统计.不满意)||1)*100).toFixed(2);
						kf.一次性解决率 = (kf.统计数据.一次性解决率*100/length).toFixed(2);
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
				for(let i in p){        console.log(i)
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