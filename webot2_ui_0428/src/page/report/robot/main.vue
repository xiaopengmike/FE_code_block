<template>
	<div>
		<h1 class="page_title noBorder">机器人&nbsp;
			<!--<wordExplain keys="工作报表-机器人"></wordExplain>-->
			<div class="pull-right search_time">
				<el-date-picker v-model="time_frame" :picker-options="pickerOptions" size="small" :clearable="false" type="daterange" format="yyyy年MM月dd日" placeholder="选择日期"> </el-date-picker>
			</div>
		</h1>
		<el-breadcrumb class="paths">
			<template  v-for="(p,i) in paths">
				<el-breadcrumb-item :to="{ path: p.path }" :key="p.path">
					{{p.name}}&nbsp;
					<word-explain v-if="i==paths.length-1" :keys="[paths[0].name,paths[1].name,paths[2].name].join('-')"></word-explain>
				</el-breadcrumb-item>
			</template>
		</el-breadcrumb>
		<thirdNav :primaryNav="'工作报表'" :subNav="'机器人'"></thirdNav>
		<router-view  :time_frame="time_frame"></router-view>
	</div>
</template>

<script>
	import thirdNav from '../../module/thirdNav'	
	export default {
		props:{},
		data(){
			return {
				pickerOptions: {
		          	disabledDate(time) {
		            	return time.getTime() > (Date.now()-24*3600);
		          	}
		       },
				time_frame:[Date.now() - 3600 * 24*1000*7,Date.now() - 3600 * 24*1000],
				paths:[],
			}
		},
		created(){
			this.handlerPaths();	
		},
		computed:{
			path(){
				return this.$store.state.global.path;
			}
		},
		methods:{
			handlerPaths(){  
				setTimeout(()=>{
					if(this.paths.length>0&&this.paths[this.paths.length-1].path==this.$router.history.current.matched[this.$router.history.current.matched.length-1].path){
						this.handlerPaths();
					}else{
						this.paths = []; 
						this.$router.history.current.matched.forEach(val=>{
							this.paths.push(val)
						})
					}
				},100)
			}
		},
		components:{
			thirdNav,
		},
		watch:{
			path(n){    
				this.handlerPaths();	
			}
		}
	}
</script>

<style>
	.report {position:relative;}
</style>
