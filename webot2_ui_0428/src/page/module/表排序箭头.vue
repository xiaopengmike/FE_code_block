	<template>
	<b class="_module-arrows pointer" @click="click">
		<i :class="{on:active&&status>0}" class="ivu-icon ivu-icon-arrow-up-b _up">
		</i><i :class="{on:active&&status<=0}" class="ivu-icon ivu-icon-arrow-down-b _down"></i>
	</b>
</template>

<script>
export default{
	props:{
		akey:{
			required:true,
			default:null,
		},
		active:{
			required:true,
			default:false,
		},
		status:{
			required:false,
		}
	},
	data(){
		return {
			
		}
	},
	methods:{
		click(){
			this.$emit('click',this.akey,this.active,this.status);
		}
	},
}
</script>

<style lang="scss">
	._module-arrows {
		font-size: 12px;
		color: #d1d1d1;
		position:relative;
		display:inline-block;
		width:8px; height:14px;
		i{
			position:absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
			margin:auto;
			color:#343f4b;
		}
		._up{
			padding-bottom:6px;
		}
		._down{
			padding-top:6px;
		}
		.on {
			color: #0f86ff;
		}
		
	}
</style>