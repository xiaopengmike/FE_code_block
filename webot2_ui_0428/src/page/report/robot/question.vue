<template>
	<div class="report report_robot_question">
			<br />
		<!--<h1 class="page_title col-md-12">
			在线服务数据&nbsp;<word-explain keys="工作报表-机器人-热点问题统计"></word-explain>
			<div class="pull-right search_time">
				<el-date-picker v-model="search.date" :picker-options="pickerOptions" :clearable="false" type="daterange" format="yyyy年MM月dd日" placeholder="选择日期"> </el-date-picker>
			</div>


		</h1>-->

		<div class="table_wrap">
			<div class="table4 simulate_table">
				<ul class="thead">
					<li class="tr">
						<div class="th">热点问题</div>
						<div class="th">问题分类</div>
						<div class="th">匹配次数</div>
					</li>
				</ul>
				<ul class="tbody">
					<li class="tr" v-for="(item,i) in list">
						<div class="td" :title="item.name">{{item.name}}</div>
						<div class="td" :title="item.分类">{{item.分类}}</div>
						<div class="td" :title="item.计数">{{item.计数}}</div>
					</li>
				</ul>
			</div>
		</div>
	<br />
	</div>
</template>

<script>
	import pagination from '../../module/pagination'
	import wordExplain from '../../module/名词解释.vue'
	export default{
		props:['time_frame'],
		data(){
			return {
				list:[],
				pickerOptions: {
					shortcuts: [ {
			            text: '昨天',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24);
			              end.setTime(end.getTime() - 3600 * 1000 * 24);
			              picker.$emit('pick', [start, end]);
			            }
			       },{
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
			        }],
		          	disabledDate(time) {
		            	return time.getTime() > Date.now();
		          	}
		        },
			}
		},
		created(){
			this.searchs();
		},
		computed:{
		},
		methods:{
			searchs(){
				var v = this;
				let start = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[0]);
				let end = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[1]);
				let search = {
					start:start,
					end:end,
				}
				v.$api.ajax(v.$uri.company.index,'get',search)
				.then(data=>{
						let relation = {};
						v.list = [];
						data.result.forEach(val=>{
							if(typeof val.热点问题 == 'string')
								val.热点问题 = JSON.parse(val.热点问题);
							for(let i in val.热点问题){
								if(relation[i]!==undefined){
									v.list[relation[i]].计数 += val.热点问题[i].计数;
								}else{
									v.list.push({
										name:i,
										分类:val.热点问题[i].分类,
										计数:val.热点问题[i].计数,
									});
									relation[i] = v.list.length-1;
								}
							}

						});
						v.list.sort(this.compare('计数'));
				});
			},
			compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return  value2-value1;
			    }
			},
		},
		components:{
			pagination,
			'word-explain':wordExplain,
		},
		watch:{
			'time_frame':{
				handler:function(n){
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

<style lang="scss">
	.report_robot_question {
		.simulate_table {
			.th,.td{
				&:nth-child(1){width:60%;}
				&:nth-child(2){width:30%;}
				&:nth-child(3){width:10%;}
			}
		}
	}
</style>
