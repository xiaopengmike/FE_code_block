<template>
	<div class="report">
		<br />
		<div class="part clearfix">
			<h4 class="box_title"><span>总体情感倾向</span></h4>
			<div class="col-md-6 col-sm-12 text-center">
				<h5 class="box_title">情感分析</h5>
				<div class="map"  style="width:100%">
					<dipolar :options="total_dipolarOption"></dipolar>
				</div>
			</div>
			<div class="col-md-6 col-sm-12 text-center">
				<h5 class="box_title">正面情感变化趋势</h5>
				<div class="large_canvas">
					<chart :options="total_option" :auto-resize="true" ></chart>
				</div>
			</div>
		</div><br />
		<div class="part clearfix">
			<h4 class="box_title"><span>售前情感倾向</span></h4>
			<div class="col-md-6 col-sm-12 text-center">
				<h5 class="box_title">情感分析</h5>
				<div class="map"  style="width:100%">
					<dipolar :options="beforeSell_dipolarOption"></dipolar>
				</div>
			</div>
			<div class="col-md-6 col-sm-12 text-center">
				<h5 class="box_title">正面情感变化趋势</h5>
				<div class="large_canvas">
					<chart :options="beforeSell_option" :auto-resize="true" ></chart>
				</div>
			</div>
		</div><br />
		<div class="part clearfix">
			<h4 class="box_title"><span>售后情感倾向</span></h4>
			<div class="col-md-6 col-sm-12 text-center">
				<h5 class="box_title">情感分析</h5>
				<div class="map"  style="width:100%">
					<dipolar :options="afterSell_dipolarOption"></dipolar>
				</div>
			</div>
			<div class="col-md-6 col-sm-12 text-center">
				<h5 class="box_title">正面情感变化趋势</h5>
				<div class="large_canvas">
					<chart :options="afterSell_option" :auto-resize="true"></chart>
				</div>
			</div>
		</div><br />
	</div>
</template>

<script>
	import ECharts from '../module/ECharts.vue'
	import dipolar from '../module/dipolar'
	import 图表 from '../mixin/图表.js'
	export default {
		mixins:[图表],
		data:function(){
			return {
				total_dipolarOption:{
					arr:['正面','负面'],
					series:{
						data:[1,0],
					},
				},
				total_option:{ },
				beforeSell_dipolarOption:{
					arr:['正面','负面'],
					series:{
						data:[0,1],
					},
				},
				beforeSell_option:{
					 
				},
				afterSell_dipolarOption:{
					arr:['正面','负面'],
					series:{
						data:[3,1],
					},
				},
				afterSell_option:{ },
			}
		},
		created(){
			this.init图配置();
		},
		methods:{
			init图配置(){
				let v= this;
				let Xdata4 = ['2017-04-14','2017-04-15',
									'2017-04-16','2017-04-17',
									'2017-04-18','2017-04-19',
									'2017-04-20','2017-04-21',
									'2017-04-22','2017-04-23',
									'2017-04-24','2017-04-25',
									'2017-04-26','2017-04-27',];
				let rgbs4 =  [window.color.blue.str,window.color.yellow.str,window.color.red.str];
				
				let option1 = {
					legend : ['1'],
					x_names : Xdata4,
					series_names:[''],
					series_types: 'line',
					colors : rgbs4,
				}
				
				
				v.total_option = v.fn_mixin获取折线和柱状图配置(option1);
				v.total_option.series[0].data = [38,45,42,45,46,55,53,53,60,61,58,59,61,62];
				v.total_option.color = [window.color.blue.str,window.color.yellow.str,window.color.red.str];
				
				v.beforeSell_option = v.fn_mixin获取折线和柱状图配置(option1);
				v.beforeSell_option.series[0].data = [35,58,47,36,95,78,55,66,84,56,54,78];
				v.beforeSell_option.color = [window.color.blue.str,window.color.yellow.str,window.color.red.str];
				
				v.afterSell_option = v.fn_mixin获取折线和柱状图配置(option1);
				v.afterSell_option.series[0].data = [38,45,42,45,46,55,53,53,60,61,58,59,61,62];
				v.afterSell_option.color = [window.color.blue.str,window.color.yellow.str,window.color.red.str];
				
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