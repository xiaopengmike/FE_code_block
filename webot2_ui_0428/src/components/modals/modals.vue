<template>
	<transition name="translate-fade">
		<div v-if="currentValue" class="_my-modals-wrap"  :style="width?'width:'+width_c:''">
			<div class="cover" v-if="cover&&currentValue"></div>
		
			<div class="_my-modals-box">
				<template v-if="!free">
					<div class="_my-modals-title">
						<slot name="title"></slot>
					</div>
					<bar wrapper="_my-modals-wrapper">
						<div class="_my-modals-content">
							<slot name="content"></slot>
						</div>
					</bar>
					<div class="_my-modals-foot">
						<slot name="foot"></slot>
					</div>
				</template>
				<template v-else>
					<slot></slot>
				</template>
			</div>
			<span class="close" @click="currentValue=false"  v-show="currentValue">×</span>
		</div>
	</transition>
</template>
<script>
	import bar from '../../page/module/自定义滚动条'
	export default {
		props:{
			value:{
				type:Boolean,
				default:false
			},
			width:{
				default:'380'
			},
			free:{
				default:false,
			},
			cover:{
				default:false,
			}
		},
		data(){
			return {
				width_c :/%|(clac)|(false)/.test(this.width.toString()) ? this.width : this.width+'px',
			}
		},
		computed:{
			currentValue: {  
		        // 动态计算currentValue的值  
		        get:function() {  
		          return this.value; // 将props中的value赋值给currentValue  
		        },  
		        set:function(val) {  
		          this.$emit('input', val); // 通过$emit触发父组件
		        }  
		    }  
		},
		methods:{
			
		},
		components:{
			bar,
		},
		watch:{
			width(n){
				this.width_c = /%|(clac)|(false)/.test(n.toString()) ? n : n+'px'
			}
		}
	}
</script>
<style lang="scss">
	$color1:#d9e6ed;
	$top:60px;
	$padding:0 25px;
	$cover:rgba(0,0,0,0.2);
	$close-color:#d0dee6;
	._my-modals-wrap {
		position:fixed;
		top:$top; 
		right:0;
		height:calc(100% - #{$top}); 
		font-size:15px;;
		z-index:10;
		._my-modals-box{
			height:100%;
			width:100%;
			background:#FFF;
			box-shadow:0px 1px 22px #ccc;
			position:relative; z-index:1;
			._my-modals-title{
				font-weight:bold;
				line-height:50px;
				border-bottom:1px solid $color1;
				margin:$padding;
			}
			._my-modals-wrapper{
				padding:$padding;
				height:calc(100% - 105px);
				._my-modals-content{
					height:100%;
					position:relative;
				}
			}
			._my-modals-foot{
				padding:$padding;
				width:100%;
				position:absolute;
				left:0;
				bottom:0;
				background:#f3f8fb;
				height:60px; line-height:60px; text-align:center;
			}
		}
		& > .close{
			color:$close-color;
			width:20px !important; height:20px !important; line-height:20px !important; text-align: center !important; font-size:20px !important; user-select:none;
			position:absolute;top:0;left:-20px; display:inline-block; opacity:1;
			background:#fff; box-shadow:-7px 0px 22px #ccc;
			z-index:1;
			&:hover {color:darken($close-color,10%);}
		}
		& > .cover {
			background: $cover;
			position:fixed;
			top:0;left:0;
			width:100%; height:100%;
			z-index:1;
		}
		
		
		
	}
	.translate-fade-leave-to,.translate-fade-enter {
		transform: translateX(200px);
		opacity:0;
	}
		
	.translate-fade-enter-active{
		transition: all .5s ease-in-out;
	}
	.translate-fade-leave-active {
		transition: all .5s ease-in-out;
	}
	
</style>