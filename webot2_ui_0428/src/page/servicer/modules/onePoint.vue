<!--
*
* 
* 
* 
-->
<template>
	<div class="_qa _point">
			<el-popover ref="popover1" placement="bottom-start" trigger="hover" popper-class="black html w250" :open-delay="400">
				<div class="_qa-popover">
					<template v-if="keyword">
						<p>标题：<span v-html="$api.filterSerachStringAndLimitNum(title, keyword, 300)"></span></p>
						<p>内容：<span v-html="$api.filterSerachStringAndLimitNum(content.text, keyword ,3000)"></span></p>
					</template>
					<template v-else>
						<p>标题：{{title}}</p>
						<p>内容：{{ content.text }}</p>
					</template>
					<template v-if="content.accessory && content.accessory.length>0">
						<p class="accessory">附件:</p>
						<div class="accessory" v-for="(r,i) in content.accessory">{{ r.name }}</div>
					</template>
				</div>
			</el-popover>
			<el-popover ref="popover2" placement="bottom-start" trigger="hover" popper-class="black html w250" :open-delay="400">
				<div class="_qa-popover">
					<template v-if="keyword">
						<p>标题：<span v-html="$api.filterSerachStringAndLimitNum(title,keyword,300)"></span></p>
						<p>内容：<span v-html="$api.filterSerachStringAndLimitNum(content.text,keyword,3000)"></span></p>
					</template>
					<template v-else>
						<p>标题：{{title}}</p>
						<p>内容：{{ content.text }}</p>
					</template>
					<template v-if="content.accessory && content.accessory.length>0">
						<p class="accessory">附件:</p>
						<div class="accessory" v-for="(r,i) in content.accessory">{{ r.name }}</div>
					</template>
				</div>
			</el-popover>
		<template v-if="showTooltip">
			<template v-if="keyword">
				<div class="_qa-q">
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text" v-popover:popover1 v-html="$api.filterSerachStringAndLimitNum(title,keyword,30)"></b>
				</div>
				<div class="_qa-a" v-popover:popover2  :class="'row'+row"  v-html="$api.filterSerachStringAndLimitNum(contentText || content.text,keyword,120)"></div>
			</template>
			<template v-else>
				<div class="_qa-q" >
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text" v-popover:popover1 >{{title}}</b>
				</div>
				<div class="_qa-a" v-popover:popover2  :class="'row'+row" v-html="contentText || content.text"></div>
			</template>
		</template>
		<template v-else>
			<template v-if="keyword">
				<div class="_qa-q">
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text" v-html="$api.filterSerachStringAndLimitNum(title,keyword,30)"></b>
				</div>
				<div class="_qa-a"  :class="'row'+row"  v-html="$api.filterSerachStringAndLimitNum(contentText || content.text,keyword,120)"></div>
			</template>
			<template v-else>
				<div class="_qa-q" >
					<b class="_qa-index" v-if="index">{{index}}:</b>
					<b class="_qa-text">{{title}}</b>
				</div>
				<div class="_qa-a"  :class="row ? 'row'+row : ''" v-html="contentText || content.text"></div>
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
			title:{
				required:true,
			},
			content:{
				required:false,
				default:()=>{
					return {
						text:'',
						accessory:[]
					}
				}
			},
			contentText:{
				required:false,
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
		mounted(){
			let v = this;
			v.$nextTick(()=>{
				document.querySelector('._point ._qa-a').addEventListener('click',v.imgHandler.bind(v),false);
			})
		},
		computed:{
			rich_text(){
				return this.richAnswer.filter(val=>val.type=='text');
			}
		},
		methods:{
			imgHandler(e){   console.log(e)
				if(e.target.nodeName.toLowerCase() !== 'img') return false;
				let uri = e.target.src;
				this.$store.dispatch('setZoominUri', uri);
			}
		},
		beforeDestroy(){
			let v = this;
			if(document.querySelector('._point ._qa-a'))
				document.querySelector('._point ._qa-a').removeEventListener('click',v.imgHandler.bind(v),false);
		}
	}
</script>
	
<style lang="scss">
@import "./qa.scss";
</style>