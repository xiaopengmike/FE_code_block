<template>
	<div class="module_word-explain">
		<el-popover ref="popover1" placement="bottom-start" trigger="hover" v-model="show" popper-class="html black">
			<div class="popover_word-explain">
				<table v-if="list!=null" class="word-explain-table">
			  		<tr v-for="item in list">
			  			<td v-html="item[0]"></td><td v-html="item[1]"></td>
			  		</tr>
			  	</table>
			  	<p v-if="txt!=null" v-html="txt"></p>
			</div>
			  
		</el-popover>
		<i v-popover:popover1 v-show="txt||list" class="ivu-icon ivu-icon-help-circled" aria-hidden="true"></i>
		<!--<el-tooltip placement="top-start">
			<div slot="content">
			  	<div class="popover_word-explain">
					<table v-if="list!=null" class="word-explain-table">
				  		<tr v-for="item in list">
				  			<td v-html="item[0]"></td><td v-html="item[1]"></td>
				  		</tr>
				  	</table>
				  	<p v-if="txt!=null" v-html="txt"></p>
				</div>
			</div>
			<i v-popover:popover1 class="ivu-icon ivu-icon-help-circled" aria-hidden="true"></i>
		</el-tooltip>-->
	</div>
</template>

<script>
	import 名词解释 from '../../config/名词解释.js'
	export default{
		props:['keys'],
		data(){
			return {		
				名词解释s:名词解释,
				show:false,
				list:null,
				txt:null,
			}
		},
		created(){
			this.init(this.名词解释s);
		},
		methods:{
			init(n){   
				this.list = null;
				this.txt = null;
				if(n[this.keys] instanceof Array)
					this.list = n[this.keys];
				else	
					this.txt = n[this.keys];
				/*if(n){
					let keys = this.keys.split('-');
					let result =n;
					keys.forEach(val=>{
						result = result[val];
					})
					if(result instanceof Array)
						this.list = result;
					else	
						this.txt = result;
				}*/
			}
		},
		watch:{
			keys(n){
				this.init(this.名词解释s);
			}
		}
	}
</script>

<style lang="scss">
	.module_word-explain {
		display:inline-block;font-size:16px; color:#ccc; 
		&>i{color:#c0d2db; cursor: help;}
	}
	/*全局*/
	.popover_word-explain{
		max-width:600px;
		font-weight:normal;
		td{ 
			font-size:14px;
			padding:5px;
			color:#fff;
			&:first-child{white-space: nowrap;}
		}
		&>p{font-size:14px;color:#fff;}
	}
</style>