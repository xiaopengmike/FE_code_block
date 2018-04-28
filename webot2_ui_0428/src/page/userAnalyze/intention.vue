<template>
	<div class="report">
		<!--悬浮框-->
		<el-popover ref="dataPandect1" trigger="hover"  popper-class="black">
			<div class="data_pandect">
				<table class="word-explain-table">
			  		<tr>
			  			<td>最受关注产品</td><td>{{产品关注度.最受关注产品}}</td>
			  		</tr>
			  		<tr>
			  			<td>关注率</td><td>{{产品关注度.关注率}}</td>
			  		</tr>
			  	</table>
			</div>
		</el-popover>
		<el-popover ref="dataPandect2" trigger="hover"  popper-class="black">
			<div class="data_pandect">
				<table class="word-explain-table">
			  		<tr>
			  			<td>热门意图</td><td>{{售前.热门意图}}</td>
			  		</tr>
			  		<tr>
			  			<td>意图频次</td><td>{{售前.意图频次}}</td>
			  		</tr>
			  	</table>
			</div>
		</el-popover>
		<el-popover ref="dataPandect3" trigger="hover"  popper-class="black">
			<div class="data_pandect">
				<table class="word-explain-table">
			  		<tr>
			  			<td>热门意图</td><td>{{售后.热门意图}}</td>
			  		</tr>
			  		<tr>
			  			<td>意图频次</td><td>{{售后.意图频次}}</td>
			  		</tr>
			  	</table>
			</div>
		</el-popover>
		<!--悬浮框-->
		<br />
		<div class="part clearfix">
			<h4 class="box_title">产品关注度</h4>
			<div class="map col-sm-12 col-md-6 text-center ">
				<div class="large_canvas">
					<chart :options="产品关注度_pieOption"  :auto-resize="true"></chart>
				</div>
			</div>
			<div class="col-sm-12 col-md-4 col-md-offset-1">
				<div class="data-screening">
					<div class="box_info color1">
						<div class="box_content" v-popover:dataPandect1>
							<div class="icon">
								<img src="../../assets/img/report_bell.png" alt="">
							</div>
							<div class="text">
								<strong>{{产品关注度.total}}</strong>
								<h3>产品相关会话&emsp;&emsp;</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div><br />
		<div class="part clearfix ">
			<h4 class="box_title">对话相关性业务</h4>
			<div class="map col-sm-12 col-md-6 text-center">
				<div class="large_canvas">
					<chart :options="售前_option" :auto-resize="true"></chart>
				</div>
			</div>
			<div class="col-sm-12 col-md-4  col-md-offset-1">
				<div class="data-screening">
					<div class="box_info color1">
						<div class="box_content" v-popover:dataPandect2>
							<div class="icon">
								<img src="../../assets/img/report_bell.png" alt="">
							</div>
							<div class="text">
								<strong>{{售前.total}}</strong>
								<h3>售前问题&emsp;&emsp;</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		</div><br />
		<div class="part clearfix">
			<div class="map col-sm-12 col-md-6 text-center">
				<div class="large_canvas">
					<chart :options="售后_option" :auto-resize="true"></chart>
				</div>
			</div>
			<div class="col-sm-12 col-md-4  col-md-offset-1">
				<div class="data-screening">
					<div class="box_info color1">
						<div class="box_content" v-popover:dataPandect3>
							<div class="icon">
								<img src="../../assets/img/report_bell.png" alt="">
							</div>
							<div class="text">
								<strong>{{售后.total}}</strong>
								<h3>售后问题&emsp;&emsp;</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<br />
	</div>
</template>

<script>
	import ECharts from '../module/ECharts.vue'
	import dipolar from '../module/dipolar'
	import 图表 from '../mixin/图表.js'
	export default {
		mixins:[图表],
		data(){
			return {
				产品关注度:{
					total:2023,
					最受关注产品:'境外通信卡',
					关注率:'19.28%',
				},
				产品关注度_pieData : [104,413,335,310,335,310,335],
				产品关注度_pieOption:{},
				售前:{
					total:969,
					热门意图:'产品说明',
					意图频次:410,
				},
				售前_option:{ },
				售后:{
					total:673,
					热门意图:'物流',
					意图频次:260,
				},
				售后_option:{ },
				
				emotion_dipolarOption:{
					arr:['正面','反面'],
					series:{
						data:[1,0],
					},
				},
				emotion_option:{
					
				},
			}
		},
		created(){
			this.init图配置();
		},
		methods:{
			init图配置(){
				let v= this;
				let legend1 =  ['非产品相关','境外通信卡','景点门票','八达通','L签','跨境巴士','wifi租赁'];
				v.产品关注度_pieOption = v.fn_mixin获取空心饼状图配置(legend1,v.产品关注度_pieData,true);
				v.产品关注度_pieOption.legend.show=true;
				v.产品关注度_pieOption.legend.orient= 'vertical';
				v.产品关注度_pieOption.legend.left= 'left';
				v.产品关注度_pieOption.color=["#d0d0d0","#e1c193","#8fd2de","#eca467","#9ac97e","#50d6ec","#ff9a99","#6372c0","#b89cfe","#d38fc7","#c9eb85","#e9d754","#a38063","#d9716f","#3bd59c","#a29f8d","#5f9cac","#c37238","#a1c034","#4bb544","#ff6e6c","#5e89fd","#fbbe2b","#b2e7d2","#b5aedd","#45b8f8","#f8cba9","#99a7ff","#9c9fbf","#dba797","#b63836","#74bcd0","#fe90ea","#ecb6b5","#a1b897","#c5ae0d",];
				v.产品关注度_pieOption.series[0].center = ['60%', '50%'];
				
				let Xdata2 = ['确认产品库存','议价','相关知识','产品说明','质疑','物流','后续服务咨询']
				let rgbs2 =  [window.color.blue.str,window.color.yellow.str,window.color.red.str];
				let option1={
					legend : [''],
					x_names : Xdata2,
					series_names:[''],
					series_types: 'bar',
					colors : [],
				}
				v.售前_option = v.fn_mixin获取折线和柱状图配置(option1);
				v.售前_option.color = [window.color.blue.str,window.color.yellow.str,window.color.red.str];
				v.售前_option.series[0].data = [96, 80, 154,410,35,133,61];
				
				let option2 = {
					legend : [''],
					x_names : Xdata2,
					series_names:[''],
					series_types: 'bar',
					colors : [],
				}
				v.售后_option = v.fn_mixin获取折线和柱状图配置(option2);
				v.售后_option.color = [window.color.blue.str,window.color.yellow.str,window.color.red.str];
				v.售后_option.series[0].data = [27, 10, 80,117,84,260,95];
				
				
				
				

				
			},
			searchs(){
				
			}
			
		},
		components:{
			'chart':ECharts,
			dipolar,
		}
	}
</script>

<style>
</style>