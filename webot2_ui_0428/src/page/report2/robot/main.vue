<template>
	<div>
		<h1 class="page_title">机器人&nbsp;
			<!--<wordExplain keys="工作报表-机器人"></wordExplain>-->
    		<!--<button class="my-btn my-btn-info-o pull-right font14 marg_l_10"><i class="fa fa-sign-out"></i>导出报表</button>-->
            <my-date-picker class="pull-right search_time" v-model="time_frame" :max-time="Date.now()-24*3600*1000" option-index="1" type="daterange"></my-date-picker>
		</h1>
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
