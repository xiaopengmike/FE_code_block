<!--二极图-->
<template>
	<div>
		<div :class="'_gauge'+_class" :style="'width:'+width+'px;height:'+height+'px'"></div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	export default {
		props:{
				rate:{
					type:String,
					default:0,
				},
				width:{
					type:String,
					required:false,
					default:400,
				},
				height:{
					type:String,
					required:false,
					default:400,
				},
				_class:{
					type:Number,
				}
			},
		data(){
			return {
				/*_class:Math.random(),*/
				chart:null,
				options:{
				    tooltip : {
				        formatter: "{a} <br/>{b} : {c}%"
				    },
				    series: [
				        {
				            name: '',
				            type: 'gauge',
				            startAngle: 180,  
           					endAngle: 0,
           					axisLine: {            // 坐标轴线  
				                lineStyle: {       // 属性lineStyle控制线条样式  
				                   color: [[0.0, 'lime'],[0.5, 'limegreen'],[1, 'deepskyblue']],  
				                   width: 10  
				                }  
				            },  
				            detail: {formatter:'{value}%'},
				            data: [{value: 70, name: ''}]
				        }
				    ]
				},
			}
		},
		mounted(){
			this.$nextTick(function(){   
				this.draw('._gauge'+this._class);
			})
		},
		methods:{
			draw(clas){                   
				this.options.series[0].axisLine.lineStyle.color[1][0] = this.rate/100;
				this.options.series[0].data[0].value = this.rate;
				this.chart = echarts.init(document.querySelector(clas));
				this.chart.showLoading();
				var that = this;
				this.chart.setOption(
					that.options,true
				);
				this.chart.hideLoading() 
			}
		},
		components:{
			echarts
		},
	}
</script>

<style>
	.b {color:limegreen}
</style>