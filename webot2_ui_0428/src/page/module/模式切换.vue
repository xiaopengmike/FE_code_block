<template>
		<div>
			<el-dropdown trigger="click">
				  <span class="el-dropdown-link">
				    	{{$store.state.global.user.username}}<span class="caret"></span>
				  </span>
				  <el-dropdown-menu slot="dropdown">
				    <el-dropdown-item><div @click="dochange"><span v-if="getMode=='admin'">切换为客服模式</span><span v-else>切换为管理模式</span></div></el-dropdown-item>
				  </el-dropdown-menu>
			</el-dropdown>
		</div>
</template>

<script>
	import {mapGetters,mapActions} from 'vuex'
	export default{
		data(){
			return {
				
			}
		},
		created(){
			
		},
		computed:{
			...mapGetters([
				'getMode'
			]),
		},
		methods:{
			...mapActions({
		  		changeMode:'changeMode',
		  	}),
			dochange(){
				let v = this;
				v.changeMode();
			},
		},
		components:{
			mapActions,
  			mapGetters,
		},
		watch:{
			
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style>
	
</style>