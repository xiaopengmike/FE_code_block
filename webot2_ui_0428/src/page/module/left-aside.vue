<template>
	<div class="_aside"  :style="width>0?'width:'+width+'px':''" :class="{small:!show}">
		<transition name="my-fade">
			<div v-show="show" class="content" >
				<div class="content2">
					<div class="page_title2">
						<slot name="title" class="page_title2"></slot>
					</div>
					<bar wrapper="wrapper">
						<div :class="'_'+type">
							<slot name="content"></slot>
						</div>
					</bar>
				</div>
			</div>
		</transition>
		<img @click="show=!show" src="../../assets/img/close-open.png" class="close-open" />
	</div>
</template>

<script>
	import bar from '../module/自定义滚动条.vue'
	export default {
		props:{
			show:{
				default:true
			},
			width:{                              //也可以直接在css中定义
				default:-1             
			},
			type:{
				default:'nav',       //nav=导航，tag=标签，classify=分类
			}
		},
		data(){
			return {
				
			}
		},
		created(){
			
		},
		methods:{
			
		},
		components:{
			bar,
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
	$navItemHeight:60px;
	._aside{
		flex-shrink: 1;
		background: #e9f1f4;
		position:relative;
		overflow:visible;
		width:100%;
		height:100%;
		transition: width 0.2s ease-in-out;
		&.small{
			width:0 !important;
			.content {opacity:0 !important;}
			.close-open {right:-10px; transform:rotateZ(180deg);}
		}
		.content {
			height:100%;
			width:100%; overflow:hidden;
			
			.content2 {width:100%; height:100%;}
		}
		.close-open{
			position:absolute;
			top:0;bottom:0; right:0; margin:auto 0;
			cursor:pointer;
		}
		.page_title2,ul li a{
			padding-left:28px;
			width:100%;
		}
		.page_title2 {
			font-size:16px;
			font-weight:bold;
			background:#dde8ef;
			line-height:90px;
			i{
				font-weight:normal;
				transition: all 0.3s ease;
			}
		}
		.wrapper{
			height:calc(100% - 90px );
		}
		._nav{
			ul{
				li{
					font-size:14px;
					font-weight:bold;
				
					line-height:$navItemHeight;
					height:$navItemHeight;
					position:relative;
					cursor: pointer;
					a {
						display:block;
						text-decoration:none;
						color:#4a6876;
					}
					.num {
						font-size:12px;
						position:absolute;
						top:0;bottom:0;margin:auto 0;
						left:140px;
					}
				}
				.active{
					background:#fff;
				}
			}
		}
		._tags{
			padding:10px;
		}
		._classify{
			
		}
		
		.my-fade-enter-active {
		  	transition: opacity 0.2s ease 0.1s;
		}
		.my-fade-leave-active{
			transition: opacity 0.2s ease;
		}
		.my-fade-enter, .fade-leave-to{
			 opacity: 0;
		}
	}
</style>