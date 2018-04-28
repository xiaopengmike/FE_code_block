<template>
	<div class="__tree">
		<ul>
			<li v-for="(item,i) in list"> 
				<template>
					<div v-if='!item.edit' @click="childShow(i,!item.show)">
						<span class="unselect pointer el-icon-caret-right" v-if="item[options.child]&&item[options.child].length>0"
							 :class="item[options.child]&&item[options.child].length>0?(item.show?' turn':' '):' opacity'"></span>
						<p @click="itemShow(item[options.id]),changeTag(item[options.id])" :title="item[options.name]" :class="show.tag1===item[options.id]?'c_13a0e3':''">{{item[options.name]}}</p>
						<b v-if="item.edit!=undefined" @click.stop="deleteTag(i)" title="删除" v-authority="'删除分类'" class="glyphicon glyphicon-trash pointer"></b>
						<b v-if="item.edit!=undefined" @click.stop="editTag(i)" title="编辑" v-authority="'修改分类'" class="glyphicon glyphicon-pencil pointer"></b>
						<b v-if="item[options.child]!=undefined && series>1 && options.addChild" @click.stop="addTag(i)" title="新增" v-authority="'增加分类'" class="glyphicon glyphicon-plus pointer"></b>
					</div>
					<div v-else class="edit"  @click="childShow(i,!item.show)">
						<p><input class="form-control" v-model="item[options.copy]" ></p>
						<b @click.stop="cancelEdit(i)" title="取消" class="glyphicon glyphicon-remove pointer"></b>
						<b v-show="item[options.copy].trim()!=''" @click.stop="sureEdit(i)" title="确认" class="glyphicon glyphicon-ok pointer"></b>
					</div>
					<ol v-if="item[options.child]&&item[options.child].length>0" v-show="item.show">
						<li v-for="(child,j) in item[options.child]" :class="(show.tag2===child.id&&item.show)?'active':''">
							<div v-if="!child.edit"  :class="show.tag2==child[options.id]?'b_13a0e3':''">
								<!--<label>&emsp;</label>-->
								<p @click="changeTag(item[options.id],child[options.id]); itemShow(item[options.id],child[options.id]);" :title="child[options.name]">{{child[options.name]}}</p>
								<b v-if="child.edit!=undefined" @click="deleteTag(i,j)" title="删除" v-authority="'删除分类'" class="glyphicon glyphicon-trash pull-right pointer"></b>
								<b v-if="child.edit!=undefined" @click="editTag(i,j)" title="编辑" v-authority="'修改分类'" class="glyphicon glyphicon-pencil pull-right pointer"></b>
							</div>
							<div v-else class="edit">
								<p><input class="form-control"  v-model="child[options.copy]"/></p>
								<b @click="cancelEdit(i,j)" title="取消" class="glyphicon glyphicon-remove pull-right pointer"></b>
								<b v-show="child[options.copy].trim()!=''" @click="sureEdit(i,j)" title="确认" class="glyphicon glyphicon-ok pull-right pointer"></b>
							</div>
						</li>
					</ol>
				</template>
				
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
		components:{
			
		},
		watch:{
			
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style lang="scss">
	$color1:#13a0e3;
	.__tree {
		position:relative; 
			li { 
				margin:15px 0;position:relative; height:auto;
				div{
					&:hover{
						b{opacity:1;}
					}
					padding:0;height:30px; line-height:30px; position:relative; 
					span,b {width:15px; height:15px;position:absolute; top:0; bottom:0; margin:auto;}
					b{
						display:inline-block;
						right:5px;
						opacity:0;
						&+b {
							right:25px;
							&+b {right:45px;}
						}
					}
					span {
						left:7px; font-size:12px;transition: all 0.5s; 
						&:hover {color:#31B0D5;}
						&.opcity {opacity:0;}
					}
				}
				ol {
					li {
						b{display:inline-block;}
						div {
							&.b_13a0e3 {
								p{color:$color1; }
							}
							label {color:#84dc95; font-size:15px; font-family:"微软雅黑"; vertical-align:top; position:relative; left:30px;}
							p {
								margin-left:35px;
							}
						}
					}
				}
				p {
					display:inline-block; max-width:60%;overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis; 
					margin:0 0 0 20px; padding: 0px 5px;
					&:hover {color:#31B0D5; cursor:pointer;}
					input {line-height:28px; height:28px;}
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
	
	.glyphicon-pencil:hover,.glyphicon-ok:hover {
		color:#84dc95;
	}
	.glyphicon-trash:hover,.glyphicon-remove:hover{
		color:#ff9999;
	}
	.glyphicon-plus:hover{
		color:#ffc156
	}
	
</style>