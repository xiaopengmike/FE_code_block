<template>
	<div>
		<router-view></router-view>
	</div>
</template>

<script>
	import subNav from '../module/subNav'
	
	export default {
		props:{},
		data(){
			return {
				
			}
		},
		methods:{
			
		},
		components:{
			subNav,
		}
	}
</script>

<style>
	.report .search_time.el-input {width:265px;}
	.box_info {position:relative; }
	.report .box_info {}
	.resolve .box_info {top:0}
	.resolve .date {margin-left:10px; margin-top:80px;}
	
	
		
	.report .map {display:inline-block; }
	#pandect_data .satisfaction > div > div  {text-align:center;}
	#pandect_data .satisfaction > div > div > div {display:inline-block;}
	.echarts {margin:0 auto;}
	.report .map {}
	.report .border01 {border:1px solid #ccc;}
	.report .small_canvas {width:100%; height:150px;}
	.report .small_canvas2 {width:100%; height:230px;}
	.report .large_canvas {width:100%; height:300px;}
</style>