<template>
	<div  class='report robot_pandect'>
		<br />
		<!--悬浮框-->
		<el-popover ref="dataPandect1"  trigger="hover"  popper-class="black">
			<div class="data_pandect">
				<table class="word-explain-table">
			  		<tr>
			  			<td>解决量</td><td>{{oneData['解决量']}}</td>
			  		</tr>
			  		<tr>
			  			<td>解决率</td><td>{{oneData['解决率']}}%</td>
			  		</tr>
			  	</table>
			</div>
		</el-popover>
		<el-popover ref="dataPandect2" trigger="hover"  popper-class="black">
			<div class="data_pandect">
				<table class="word-explain-table">
			  		<tr>
			  			<td>匹配提问数</td><td>{{oneData['匹配提问数']}}</td>
			  		</tr>
			  		<tr>
			  			<td>匹配率</td><td>{{oneData['匹配率']}}%</td>
			  		</tr>
			  	</table>
			</div>
		</el-popover>
		<!--悬浮框-->
		<div class="clearfix">
			<div class="data-screening">
				<div class="col-md-6 col-lg-3">
					<div class="box_info color3">
						<div class="box_content" v-popover:dataPandect1>
							<div class="icon">
								<img src="../../../assets/img/home_dataScreening04.png" alt="">
							</div>
							<div class="text">
								<strong>{{oneData['总会话量']}}</strong>
								<h3>总会话量&emsp;&emsp;&emsp;</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="box_info color2">
						<div class="box_content" v-popover:dataPandect2>
							<div class="icon">
								<img src="../../../assets/img/report_question.png" alt="">
							</div>
							<div class="text">
								<strong>{{oneData['提问总数']}}</strong>
								<h3>提问总数&emsp;&emsp;&emsp;</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class=" clearfix">
			<div class="col-xs-12">
				<div class="part">
					<h4 class="box_title">会话量&nbsp;<word-explain keys="工作报表-机器人-机器人数据总览-会话量"></word-explain></h4>
					<div class="large_canvas" >
						<chart :options="会话量_option" :auto-resize="true" style="width:100%;height:300px;"></chart>
					</div>
				</div>
			</div>
		</div>
		<div class=" clearfix">
			<div class="col-md-12">
				<div class="part">
					<h4 class="box_title">提问量&nbsp;<word-explain keys="工作报表-机器人-机器人数据总览-提问量"></word-explain></h4>
					<div class="large_canvas" >
						<chart :options="提问量_option" :auto-resize="true" ></chart>
					</div>
				</div>
			</div>
		</div>
		
		<div class=" clearfix">
			<div class="col-md-12">
				<h4 class="box_title noBorder">客户来源&nbsp;<word-explain keys="工作报表-机器人-机器人数据总览-客户来源"></word-explain></h4>
				<div class="part noMarginTop small_canvas2">
					<chart :options="客户来源_pieOption" :auto-resize="true"></chart>
					<div class="info" size="2">
						<!--<p>
							<i class="fa fa-weixin" :style="{color:客户来源_pieOption.color[0]}"/>&ensp;
							{{(客户来源_pieOption.series[0].data[0].value/((客户来源_pieOption.series[0].data[1].value+客户来源_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%</p>
						<p>
							<i class="ivu-icon ivu-icon-android-phone-portrait" :style="{color:客户来源_pieOption.color[1]}"/>&ensp;
							{{(客户来源_pieOption.series[0].data[1].value/((客户来源_pieOption.series[0].data[1].value+客户来源_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%</p>-->
					</div>
				</div>
			</div>
		</div>
		<br /><br /><br />
	</div>
</template>

<script>
	import ECharts from '../../module/ECharts.vue'
	import 图表 from '../../mixin/图表.js'
	import echarts from 'echarts'
	export default{
		mixins:[图表],
		props:['time_frame'],
		data(){
			return {
				oneData:{
					总会话量:0,
					解决量:0,
					解决率:0,
					提问总数:0,
					匹配提问数:0,
					匹配率:0,
				},
				
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
		        会话量_option:{ },
				提问量_option:{},
				客户来源_pieOption:{	},
			}
		},
		created(){
			this.init图配置();
			this.searchs();
		},
		methods:{
			init图配置(){
				let v= this;
				let legend1 = ['已解决会话量','未解决会话量','总会话量'];
				let rgbs1 = [window.color.yellow.rgb,window.color.blue.rgb,window.color.red.rgb];
				v.会话量_option = v.fn_mixin获取折线和柱状图配置(legend1,rgbs1);
				v.会话量_option.color =  [window.color.yellow.str,window.color.blue.str,window.color.red.str];
				let legend2=['已匹配提问量','未匹配提问量','总提问量'];
				let rgbs2= [window.color.green.rgb,window.color.blue.rgb,window.color.yellow.rgb];
				v.提问量_option = v.fn_mixin获取折线和柱状图配置(legend2,rgbs2);
				v.提问量_option.color = [window.color.green.str,window.color.blue.str,window.color.yellow.str];
				
				v.客户来源_pieOption = v.fn_mixin获取空心饼状图配置([ 'wx','H5'],0);
				v.客户来源_pieOption.color=['#3cd66b','#768bd2'];
			},
			searchs(){
				var v = this;
				let start = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[0]);
				let end = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[1]);
				let search = {
					start:start,
					end:end,
				}
				v.$api.ajax(v.$uri.company.index,'get',search)
				.then(result=>{
					this.清除数据痕迹();
					//排序
					let data = result.result;
					for(let i=0;i<data.length;i++){
						for(let j=i+1;j<data.length;j++){
							if(data[i].created>data[j].created){
								let a = data[i];
								data[i] = data[j];
								data[j] = a;
							}
						}
					}
					let date_format = search.start==search.end?'hh:00':'yyyy-MM-dd';
					let days = search.start==search.end?1:(data.length||1);
					let hours = data.length;
					
					data.forEach(val=>{
						val.created = search.start==search.end?new Date(val.created).getTime():new Date(val.created).getTime()-24*3600*1000;
						let time = v.$api.dateFormat(date_format,val.created+180*1000);
						if(time ==='00:00') time = '24:00';
						if(typeof val == 'string')
							val = JSON.parse(JSON.parse(val)); 
						if(typeof val.机器人用户来源 == 'string') 
							val.机器人用户来源 = JSON.parse(val.机器人用户来源); 
						if(typeof val.解决方式 == 'string') 
							val.解决方式 = JSON.parse(val.解决方式); 
						if(typeof val.咨询分类 == 'string') 
							val.咨询分类 = JSON.parse(val.咨询分类); 
						if(typeof val.满意统计 == 'string') 
							val.满意统计 = JSON.parse(val.满意统计);
						if(typeof val.首次响应时间 == 'string') 
							val.首次响应时间 = JSON.parse(val.首次响应时间);
						if(typeof val.响应时间 == 'string') 
							val.响应时间 = JSON.parse(val.响应时间);
						if(typeof val.会话时长 == 'string') 
							val.会话时长 = JSON.parse(val.会话时长);
						v.oneData.总会话量 += val.会话量-val.人工会话量;
						v.oneData.提问总数 += val.机器人消息量||0;
						v.oneData.解决量 += val.解决方式.robot||0;
						v.oneData.匹配提问数 += val.机器人匹配数||0;
						debugger
						let index = v.会话量_option.xAxis.data.indexOf(time);console.log(index,time)
						if(index!=-1){
							v.会话量_option.series[2].data[index]=val.会话量-val.人工会话量;
							v.会话量_option.series[1].data[index]=val.会话量-val.人工会话量 - val.解决方式.robot;
							v.会话量_option.series[0].data[index]=val.解决方式.robot;
						}
						
						index = v.提问量_option.xAxis.data.indexOf(time);
						if(index!=-1){
							v.提问量_option.series[2].data[index]=val.机器人消息量||0;
							v.提问量_option.series[1].data[index]=val.机器人消息量-val.机器人匹配数;
							v.提问量_option.series[0].data[index]=val.机器人匹配数;
						}
						
						if(val.机器人用户来源 && !v.$api.isEmptyObj(val.机器人用户来源)){
							v.客户来源_pieOption.series[0].data[0].value += val.机器人用户来源.weixin;
							v.客户来源_pieOption.series[0].data[1].value += val.机器人用户来源.h5;
						}
					});
					v.oneData.解决率 = (v.oneData.解决量/(v.oneData.总会话量||1)*100).toFixed(2);
					v.oneData.匹配率= (v.oneData.匹配提问数/(v.oneData.提问总数||1)*100).toFixed(2);
				});
				
			},
			清除数据痕迹(){
				let v = this;
				v.oneData.总会话量=0;
				v.oneData.提问总数=0;
				v.oneData.解决量=0;
				v.oneData.解决率=0;
				v.oneData.匹配提问数=0;
				v.oneData.匹配率=0;
				
				let 图标1 = ['会话量_option','提问量_option'];
				let 图标2 = ['客户来源_pieOption'];
				let time = {start:v.time_frame[0],end:v.time_frame[1]};   
				图标1.forEach(val=>{
					v.fn_mixin初始化折线和柱状图Bytime(v[val],time,0);
				});
				图标2.forEach(val=>{
					v.fn_mixin初始化饼状图(v[val],0);
				})
			}
			
		},
		components:{
			'chart':ECharts,
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

<style lang="scss">
	.robot_pandect{
		.box_info {
			.rate{
				
				p{display:inline-block; text-align:left; line-height: 22px;}
			}
		}
	}
	
	
</style>