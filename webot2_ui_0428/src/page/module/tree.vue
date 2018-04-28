<template>
	<div class="___tree">
		<ul>
			<li v-for="(item,i) in list"> 
				<div v-if='!item.edit' @click="childShow(i,!item.show)"  :class="{active:show.tag1===item[options.id]}">
					<span class="fa" :class="{'fa-folder':!item.show&&item[options.child]&&item[options.child].length>0,'fa-folder-open':item.show,'fa-folder-o':!item[options.child]||item[options.child].length==0}"></span>
					<p @click="itemShow(item[options.id]),changeTag(item[options.id])" :title="item[options.name]">{{item[options.name]}}</p>
					<b v-if="item.edit!=undefined" @click.stop="deleteTag(i)" title="删除" v-authority="'删除分类'" class="fa fa-trash pointer"></b>
					<b v-if="item.edit!=undefined" @click.stop="editTag(i)" title="编辑" v-authority="'修改分类'" class="fa fa-pencil pointer"></b>
					<b v-if="item[options.child]!=undefined && series>1 && options.addChild" @click.stop="addTag(i)" title="新增" v-authority="'增加分类'" class="fa fa-plus pointer"></b>
				</div>
				<div v-else class="edit"  @click="childShow(i,!item.show)">
					<p><input class="form-control" v-model="item[options.copy]" v-focus="item.edit" @keydown.13="sureEdit(i)"></p>
					<b @click.stop="cancelEdit(i)" title="取消" class="fa fa-remove pointer"></b>
					<b v-show="item[options.copy]!==''" @click.stop="sureEdit(i)" title="确认" class="fa fa-check pointer"></b>
				</div>
				<ol v-if="item[options.child]&&item[options.child].length>0" v-show="item.show">
					<li v-for="(child,j) in item[options.child]" :class="(show.tag2===child.id&&item.show)?'active':''">
						<div v-if="!child.edit" :class="{active:show.tag2==child[options.id]}">
							<span v-if="item[options.child]&&item[options.child].length>0" class="fa" :class="{'fa-file-text-o':!item.show,'fa-file-text-o':item.show,opacity:item[options.child]&&item[options.child].length>0}"></span>
							<p @click="changeTag(item[options.id],child[options.id]); itemShow(item[options.id],child[options.id]);" :title="child[options.name]">{{child[options.name]}}</p>
							<b v-if="child.edit!=undefined" @click="deleteTag(i,j)" title="删除" v-authority="'删除分类'" class="fa fa-trash pointer"></b>
							<b v-if="child.edit!=undefined" @click="editTag(i,j)" title="编辑" v-authority="'修改分类'" class="fa fa-pencil pointer"></b>
						</div>
						<div v-else class="edit">
							<p><input class="form-control"  v-model="child[options.copy]" @keydown.13="sureEdit(i,j)"  v-focus="child.edit" /></p>
							<b @click="cancelEdit(i,j)" title="取消" class="fa fa-remove pointer"></b>
							<b v-show="child[options.copy]!==''" @click="sureEdit(i,j)" title="确认" class="fa fa-check pointer"></b>
						</div>
					</li>
				</ol>
			</li>
		</ul>
	</div>
</template>

<script>
	
	export default{
		props:{
			list:{
				type:Array,
				required:true
			},
			option:{
				type:Object,
				default:()=>{
					return {};
				}
			},
			series:{
				type:Number,
				default:2,
			},
		},
		data(){
			return {
				options:{
					id:this.option.id||'id',
					name:this.option.name||'name',
					copy:this.option.copy||'copy',
					child:this.option.child||'child',
					addChild:this.option.addChild!=undefined?this.option.addChild:true,
				},
				show:{
					tag1:'',
					tag2:'',
				},
			}
		},
		created(){   
			this.show.tag1 = this.list[0][this.options.id];    
		},
		computed:{
			
		},
		methods:{
			itemShow(id1,id2=''){
				this.show.tag1=id1;
				this.show.tag2=id2;
			},
			childShow(i,b){ 
				this.$set(this.list[i],'show',b); console.log(this.list[i])
			},
			changeTag(i,j=undefined){  console.log(i,j)
				this.$emit('changeTag',i,j);
			},
			deleteTag(i,j=undefined){
				this.$emit('deleteTag',i,j);
			},
			editTag(i,j=undefined){
				let v = this;    
				let source = v.list[i];
				if(j!=undefined){
					source = source[v.options.child][j];
				}
				source.edit = true;
				this.$emit('beforeEditTag',i,j);
			},
			addTag(i){   console.log('add')
				this.childShow(i,true);
				this.$emit('addTag',i);
			},
			sureEdit(i,j=undefined){ console.log('suer')
				this.$emit('updateTag',i,j);
			},
			cancelEdit(i,j=undefined){
				let v = this;
				let source = v.list;
				let index = i;
				if(j!=undefined){
					source = source[i][v.options.child];
					index = j;
				}
				if(source[index][v.options.id]==''||source[index][v.options.id]==undefined){
					source.splice(index,1);
				}else{
					source[index][v.options.copy] = source[index][v.options.name];
					source[index].edit = false;
				}
				
			},
		},
	}
</script>

<style lang="scss">
	$color1:#0f86ff;
	$active-color:#1f89f6;
	$base-color:#8ba1ad;
	$border-color:#dde8ef;
	$tag-height:30px;
	.___tree {
		margin-right:6px;
		position:relative; 
			li { 
				padding:3px 0;position:relative; height:auto; margin-left:10px;
				
				div{
					&:hover{
						b{opacity:1;}
					}
					&.active{
						color:$active-color;
					}
					padding:0;height:30px; line-height:30px; position:relative; 
					span {width:15px; height:15px;position:absolute; top:0; bottom:0; margin:auto;z-index:6;}
					b{
						float:right; 
						color:$base-color;
						width:20px; height:20px; text-align:center; line-height:20px; 
						border-radius: 50%;
						margin-right:5px;
						margin-top:#{($tag-height - 20px)/2};
						opacity: 0;
						background:rgba($base-color,0.4);
						&:hover {color:darken($base-color,10%);}
					}
					span {
						left:7px; font-size:12px;transition: all 0.5s; 
						&:hover {color:$active-color;}
						&.opcity {opacity:0;}
					}
				}
				ol {
					li {
						&:before{
							content:'';
							width:1em;
							height:1em;
							
							border-bottom:1px solid darken($border-color,5%);
							position:absolute;
							top:0.6em;
							left:-0em;
						}
						&:after{
							content:'';
							display:block;
							position:absolute;
							height:100%;
							width:0;
							border-left:1px solid darken($border-color,5%);
							top:-1.5em;
							left:-0em;
							z-index:5;
						}
						b{display:inline-block;}
						div {
							&.b_13a0e3 {
								p{color:$color1; }
							}
							&.active {font-weight:bold;}
							label {color:#84dc95; font-size:15px; font-family:"微软雅黑"; vertical-align:top; position:relative; left:30px;}
							p {
								
							}
						}
					}
				}
				p {
					display:inline-block; max-width:45%;overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis; 
					margin:0 0 0 20px; padding: 0px 5px;
					cursor:pointer;
					
					&.active,&:hover{color:$active-color; }
					input {line-height:24px; height:24px; margin:2px 0; padding:2px 3px;}
				}
				&:first-child {
					span {
						font-weight:100;
						&::hover {color:#ffc156;}
					}
				}
			}
			.turn {
				transform:rotate(90deg);
				transform-origin:50% 50%;
			}
		
	}
	
	
</style>