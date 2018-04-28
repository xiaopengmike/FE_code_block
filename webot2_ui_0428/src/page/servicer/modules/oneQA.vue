<!--
*
* 
* 
* 
-->
<template>
	<div class="_qa">
			<el-popover ref="popover1" placement="bottom-start" trigger="hover" popper-class="black html w250" :open-delay="400">
				<div class="_qa-popover">
					<template v-if="keyword">
						<p>问题：<span v-html="$api.filterSerachStringAndLimitNum(question, keyword ,300)"></span></p>
						<p>答案：<span v-html="$api.filterSerachStringAndLimitNum(answer, keyword, 3000)"></span></p>
					</template>
					<template v-else>
						<p>问题：{{question}}</p>
						<p>答案：{{answer}}</p>
					</template>
					<template v-if="richAnswer && richAnswer.length>0">
						<p class="accessory">富媒体答案:</p>
						<div v-if="richAnswer.some(val=>val.type=='text')" v-for="r in richAnswer.filter(val=>val.type=='text')" >{{r.text}}</div>
						<div class="accessory" v-for="(r,i) in richAnswer.filter(val=>val.type!='text')">{{r.name || r.text || r.url?r.url.substr(r.url.lastIndexOf('/')+1):'文件'+i}}</div>
					</template>
				</div>
			</el-popover>
			<el-popover ref="popover2" placement="bottom-start" trigger="hover" popper-class="black html w250" :open-delay="400">
				<div class="_qa-popover">
					<template v-if="keyword">
						<p>问题：<span v-html="$api.filterSerachStringAndLimitNum(question,keyword,300)"></span></p>
						<p>答案：<span v-html="$api.filterSerachStringAndLimitNum(answer,keyword,3000)"></span></p>
					</template>
					<template v-else>
						<p>问题：{{question}}</p>
						<p>答案：{{answer}}</p>
					</template>
					<template v-if="richAnswer && richAnswer.length>0">
						<p class="accessory">富媒体答案:</p>
						<div v-if="richAnswer.some(val=>val.type=='text')" v-for="r in richAnswer.filter(val=>val.type=='text')" >{{r.text}}</div>
						<div class="accessory" v-for="(r,i) in richAnswer.filter(val=>val.type!='text')">{{r.name || r.text || r.url?r.url.substr(r.url.lastIndexOf('/')+1):'文件'+i}}</div>
					</template>
				</div>
			</el-popover>
		<template v-if="showTooltip">
			<template v-if="keyword">
				<div class="_qa-q">
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text" v-popover:popover1 v-html="$api.filterSerachStringAndLimitNum(question,keyword,30)"></b>
				</div>
				<div class="_qa-a" v-popover:popover2  :class="'row'+row"  v-html="$api.filterSerachStringAndLimitNum(answer,keyword,120)"></div>
			</template>
			<template v-else>
				<div class="_qa-q" >
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text" v-popover:popover1 >{{question}}</b>
				</div>
				<div class="_qa-a" v-popover:popover2  :class="'row'+row">{{answer || rich_text[0]}}</div>
			</template>
		</template>
		<template v-else>
			<template v-if="keyword">
				<div class="_qa-q">
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text" v-html="$api.filterSerachStringAndLimitNum(question,keyword,30)"></b>
				</div>
				<div class="_qa-a"  :class="'row'+row"  v-html="$api.filterSerachStringAndLimitNum(answer,keyword,120)"></div>
			</template>
			<template v-else>
				<div class="_qa-q" >
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text">{{question}}</b>
				</div>
				<div class="_qa-a"  :class="row ? 'row'+row : ''">{{answer || rich_text[0]}}</div>
			</template>
		</template>
	</div>
</template>

<script>
	export default {
		props:{
			index:{
				required:false,
			},
			keyword:{
				required:false,
				default:'',
			},
			question:{
				required:true,
			},
			answer:{
				required:false,
			},
			richAnswer:{
				default:()=>{return []},
				type:Array
			},
			row:{
				required: false,
				type:Number
			},
			showTooltip:{
				default: true,
				type: Boolean
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
				return this.richAnswer.filter(val=>val.type=='text');
			}
		},
		methods:{
			
		},
		components:{
			
		},
		watch:{
			
		}
	}
</script>
	
<style lang="scss">
@import "./qa.scss";
</style>