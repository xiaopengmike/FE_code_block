<template>
	<div class="color-select">
		<el-popover ref="popover4" v-model="show" placement="right" width="70" trigger="click" popper-class="html noborder" :disabled="disabled">
		  	<div class="color-select-list">
		  		<span class="color-select-item" v-for="(item,i) in colors" @click="change(item); show=false;" :style="{ background: item }"></span>
		  	</div>
		</el-popover>
		<i v-popover:popover4 class="fa fa-chevron-circle-down color font20" :class="{'not-allowed': disabled, 'pointer': !disabled}" :style="{ color: color }"></i>
	</div>
</template>

<script>
	export default {
		props:{
			color:{
				default:'#000',
			},
			colors:{
				default: ()=> [ '#4EA2FB', '#EE5659', '#FEB942', '#A4ABB1', '#90644A', '#6F56ED' ],
			},
			disabled:{
				default: true,
			}
		},
		data(){
			return {
				show:false,	
			}
		},
		created(){
			
		},
		methods:{
			change(color){
				this.$emit('update:color', color);
			}
		},
		components:{
			
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
.color-select{
	
	.color {
		padding: 2px;
		border-radius: 50%;
		border: 1px solid #eee;
	}
}
.noborder {border: none;}
.color-select-list{
	text-align: center;
	.color-select-item {
		display: inline-block;
		width:20px; height:20px; 
		margin:5px 10px;
		border-radius:50%;
	}
}
</style>