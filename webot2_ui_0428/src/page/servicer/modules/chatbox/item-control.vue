/*
 * props: type        显示类型 0：loading, -0.5: warn for upload, -1:warn for text, 1: control, undefined:hidden,
 *
 */
<template>
	<div class="_chatbox-item-control">
		<!--<el-popover ref="popover1" placement="bottom-start" trigger="hover" popper-class="html black">
			<div class="_chatbox-item-control-popover">
				<ul>
					<li @click="reCall">撤回</li>
				</ul>
			</div>
			  
		</el-popover>-->
		
		<template>
			<i v-if="data.send===0" class="fa fa-spinner fa-pulse fa-fw _chatbox-item-control_loading"></i>
	    	<i v-else-if="data.send===-0.5" class="_chatbox-item-control_warn pointer  el-icon-warning" @click="reUpload"></i>
	    	<i v-else-if="data.send===-1" class="_chatbox-item-control_warn pointer el-icon-warning" @click="reReply"></i>
	    	<!--<a v-else-if="(data.send===1||data.send===undefined) && Date.now()- new Date(data.time).getTime() < 2*60*1000" class="pointer unselect _chatbox-item-control_recall"  @click="reCall">撤回</a>-->
	    		
	    	<!--<i v-popover:popover1 class="fa fa-ellipsis-h pointer _chatbox-item-control_control"></i>-->
	    	<el-dropdown visible-change="judgeControl"  v-else-if="(data.send===1||data.send===undefined) " class="_chatbox-item-control_recall" >
			    <span class="el-dropdown-link">
			        <i class="fa fa-ellipsis-h  pointer _chatbox-item-control_control"></i>
			    </span>
			    <el-dropdown-menu slot="dropdown"  class="_chatbox-item-control_recall-items" >
			        <el-dropdown-item v-if="Date.now()- new Date(data.time).getTime() < 2*60*1000">
			        	<div @click="reCall" class="text-center">撤回</div>
			        </el-dropdown-item>
			        <el-dropdown-item :disabled="data.msg_type !='text'">
			        	<div @click="copy" class="text-center">复制</div>
			        </el-dropdown-item>
			        <el-dropdown-item disabled="true">
			        	<div  class="text-center">知识推荐</div>
			        </el-dropdown-item>
			        <el-dropdown-item disabled="true">
			        	<div  class="text-center">相关文档</div>
			        </el-dropdown-item>
			        <el-dropdown-item disabled="true">
			        	<div  class="text-center">相似对话</div>
			        </el-dropdown-item>
			    </el-dropdown-menu>
		    </el-dropdown>
		</template>
	</div>
</template>

<script>
	export default {
		props:{
			type:{
				default: undefined,
			},
			data:{
				required: true,
			},
			index:{
				required: true,
			}
		},
		data(){
			return {
				controls:[
					{ label:'撤回' }
				]
			}
		},
		created(){
			
		},
		methods:{
			reCall(){
				this.$emit('reCall', this.data.msg_id, this.index);console.log(this.data.msg_id, this.index)
			},
			reUpload(){
				this.$emit('reUpload', this.data.file, data.reply_data, this.index);
			},
			reReply(){
				this.$emit('reReply', this.data.reply_data, this.index);    
			},
			copy(){
				this.$api.copyToClipboard(this.data.text);
			},
			judgeControl(){
				
			}
		},
		components:{
			
		},
		watch:{
			
		}
	}
</script>

<style lang="scss" >
	$loading-c: #ccc;
	$warn-c: #f03437;
	._chatbox-item-control{
		display:inline-block;
		font-size:12px;
		._chatbox-item-control_loading {
			color: $loading-c; 
			&:before {transform: skewX(45deg);}
		}
		._chatbox-item-control_warn {color: $warn-c}
		._chatbox-item-control_control:before{color: $loading-c; *border:1px solid $loading-c; }
		
		._chatbox-item-control_recall { display:inline-block; width:30px; position:absolute; left: -10px; top:0;}
	}
	._chatbox-item-control_recall-items {
		padding:0;
	}
</style>