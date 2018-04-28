<template>
	<div class="_qa-detail">
		<div class="_qa_wrap">
			<!--<template v-if="keyword">
				<div class="_qa-q">
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text" v-html="$api.filterSerachStringAndLimitNum(detail.question,keyword,30)"></b>
				</div>
				<div class="_qa-a"  v-html="$api.filterSerachStringAndLimitNum(detail.answer,keyword,12000)"></div>
			</template>
			<template v-else>
				<div class="_qa-q" >
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text">{{detail.question}}</b>
				</div>
				<div class="_qa-a" >{{detail.answer || rich_text[0]}}</div>
			</template>-->
			<one-qa :index="index" :question="detail.question" :answer="detail.answer" :rich-answer="detail.rich_answer" :show-tooltip="false"></one-qa>
		</div>
		<div class="_qa-rich-answer" v-if="detail.rich_answer && detail.rich_answer.length>0">
			<small class="ps">富媒体：</small>
			<template v-for="(item,i) in detail.rich_answer">
				<div class="_qa-rich-item text" v-if="item.type=='text'">
					{{item.text}}
				</div>
				<div class="_qa-rich-item" v-else-if="item.type=='image'">
					<img :src="item.url" @click="$store.dispatch('setZoominUri',item.url)" />
				</div>
				<div class="_qa-rich-item"  v-else-if="item.type=='audio'">
					<audio controls :src="item.url"></audio>
				</div>
				<div class="_qa-rich-item" v-else-if="item.type=='video'">
					<video controls :src="item.url"></video>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import oneQa from './oneQA'
	export default {
		props:{
			detail:{
				required:false,
				default:()=>{
					return {
						question:'',
						answer:'',
						rich_answer:[],
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
			oneQa,
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
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