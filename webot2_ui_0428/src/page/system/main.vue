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
	.system {padding:20px;}
</style>