<!--
*
* 
* 
* 
-->
<template>
	<div class="_qa _shortcut">
		<el-popover ref="popover1" placement="bottom-start" trigger="hover" popper-class="black html w250" :open-delay="400">
			<div class="_qa-popover">
				<template>
					<p>
						<b v-html="$api.filterSerachStringAndLimitNum('【'+list[0]+'】', keyword,100)"></b>
						<span v-html="$api.filterSerachStringAndLimitNum(list[1],keyword,100)"></span>
					</p>
					<p >
						<span  v-html="$api.filterSerachStringAndLimitNum(list[2],keyword,1000)"></span>
					</p>
				</template>
			</div>
		</el-popover>
		<el-popover ref="popover2" placement="bottom-start" trigger="hover" popper-class="black html w250" :open-delay="400">
			<div class="_qa-popover">
				<template>
					<p>
						<b v-html="$api.filterSerachStringAndLimitNum('【'+list[0]+'】', keyword,100)"></b>
						<span v-html="$api.filterSerachStringAndLimitNum(list[1],keyword,100)"></span>
					</p>
					<p >
						<span  v-html="$api.filterSerachStringAndLimitNum(list[2],keyword,1000)"></span>
					</p>
				</template>
			</div>
		</el-popover>
		<template>
			<div class="_qa-q">
				<b class="_qa-index" v-if="index">{{index}}:</b>
				<span  v-popover:popover1  class="_qa-text">
					<b v-html="$api.filterSerachStringAndLimitNum('【'+list[0]+'】',keyword,30)"></b>
					<span v-html="$api.filterSerachStringAndLimitNum(list[1],keyword,100)"></span>
				</span>
			</div>
			<div class="_qa-a"  v-popover:popover2  :class="'row'+row"  v-html="$api.filterSerachStringAndLimitNum(list[2],keyword,120)"></div>
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
			list:{
				required:false,
				default:()=>['', '', ''],
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