<template>
	<div class="_qa-detail">
		<div class="_qa_wrap">
			<one-point :index="index" :title="detail.title" :content="detail.content" :show-tooltip="false"></one-point>
		</div>
		<div class="_qa-rich-answer" v-if="detail.content.accessory && detail.content.accessory.length>0">
			<small class="ps">附件：</small>
			<template v-for="(item,i) in detail.content.accessory">
				<div class="_qa-rich-item text">
					<a :href="item.url" target="_blank">{{item.name}}</a>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import onePoint from './onePoint'
	export default {
		props:{
			detail:{
				required:false,
				default:()=>{
					return {
						title:'',
						content:{
							text:'',
						},
					}
				}
			},
			keyword:{
				default:'',
			},
			index:{
				default:1,
			}
		},
		data(){
			return {
				
			}
		},
		created(){
			
		},
		computed:{
			rich_text(){
				return this.detail.rich_answer.filter(val=>val.type=='text');
			}
		},
		methods:{
			
		},
		components:{
			onePoint,
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
@import "./qa.scss";
._qa-detail{
	._qa_wrap {
		margin:0 30px;
	}
	._qa-q{
		position:relative;
		height:35px;
		._qa-index{
			position:absolute;
			top:7px; right: 100%;
		}
		._qa-text{
			display:inline-block;
			line-height:35px;
			max-width:100%;
			overflow-x:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;
		}
	}
	._qa-a{
		color:#9e9e9e;
        line-height:18px;
	}
	._qa-rich-answer{
		img, video, audio, .text {
			max-width:100%;
			padding:0 20px;
		}
		._qa-rich-item{
			& + ._qa-rich-item{
				margin-top:10px;
			}
		}
	}
}
</style>