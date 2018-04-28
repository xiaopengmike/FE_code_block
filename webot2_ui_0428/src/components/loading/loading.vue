<template>
	<div class="loading-box" v-show="show>0">
		<div class="load">
			<div class="circle1"></div>
		</div>
		<span class="closedd" @click="show=0">X</span>
	</div>
</template>
<script>
	export default {
		props:{
			value:{
				type:Number,
				default:0
			}
		},
		data(){
			return {
				example:'',
			}
		},
		computed:{
			show:{
				get(){
					return this.value;
				},
				set(val){
					this.$emit('input',val);
				}
			}
		},
		methods:{
			
		},
		watch:{
			show(n){
				clearTimeout(this.example);
				if(n>0){
					this.example = setTimeout(()=>{
						this.show = 0;
					},10000);
				}
			}
		}
	}
</script>
<style lang="scss">
	.closedd {
		position:absolute;
		top:0; right:0;
		display:inline-block;
		width:50px;height:50px;
		opacity:0;
	}
	.loading-box {
		position:fixed;
		top:0; 
		left:0;
		width:100%; 
		height:100%; 
		background:rgba(255,255,255,0);
		text-align:center; 
		line-height:100%;
		vertical-align:middle;
		font-size:150px;
		z-index:5000;
		.load{
			width:50px; height:50px; position:absolute; top:0;bottom:0; left:0;right:0; margin:auto;
			.circle1{
				width:100%; height:100%; border-radius:50%; background:#0082E6; opacity:0.6; position:absolute; top:0; left:0;
				animation: ball-scale 1s infinite ease-in-out;
			}
		}
	}
	@keyframes ball-scale {
		from{transform:scale(0,0);}
		to{transform:scale(1,1); opacity:0;}
	}
	
</style>