<template>
	<div class="__magnify" v-show="url!==''" @click="close">
		<div>
			<img :src="url" />
		</div>
		<span @click="close" class="close glyphicon glyphicon-remove"></span>
	</div>
</template>

<script>
	export default{
		props:['url'],
		data(){
			return {
				
			}
		},
		created(){
			
		},
		computed:{
			
		},
		methods:{
			close(){
				this.$emit('closeZoomin');
			}
		},
		components:{
			
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
	.__magnify {position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.3);z-index:25;}
	.__magnify img {max-width:90%; max-height:90%; position:absolute; top:0; bottom:0; left:0; right:0; margin:auto;}
	.__magnify .close {position:absolute; top:0; right:0; display:inline-block; width:40px; height:40px; font-size:30px;}
</style>