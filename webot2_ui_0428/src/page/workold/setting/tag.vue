<template>
	<div class="workold_tags" @click.prevent>
		<h1 class="page_title">工单分类</h1>
		<div class="list">
			<div class="addtag" @click="add">
				<i class="fa fa-plus"></i> 添加分类
			</div>
			<el-collapse v-model="AUX.show_index" on-change="showIndex">
		        <el-collapse-item v-for="(t1,i) in reverTags" :name="tags.length-i-1" :key="tags.length-i-1" :class="{noChild:!t1.child||t1.child.length==0}">
		        	<div class="tag1" slot="title">
		        		
		        		<span class="text simulate_input" :class="{editing:t1.name!==t1.copy||t1.id==''}" :contenteditable="t1.edit" v-focus.bind="AUX.focus_index[0]==i&&AUX.focus_index[1]==-1" @click="focus($event,i)" @input="input($event,i)" @keydown.13="keydown($event,i)" @blur="blur($event,i)" @paste="pasteHandler" @click.stop placeholder="请输入分类" >{{t1.show}}</span>
		        		<span class="control" :class="{visibled:t1.name!==t1.copy||t1.name===''||t1.edit}" @click.stop="update(i)" >确定</span>
		        		<span class="control" :class="{visibled:t1.name!==t1.copy||t1.name===''||t1.edit}" @click.stop="cancel(i)" >取消</span>
		        		<span class="control visibled pull-right" @click.stop="remove(i)" v-if="t1.id">删除</span>
		        		<span class="control visibled pull-right" @click.stop="addChild(i)" v-if="t1.id">添加子分类</span>
		        	</div>
		            <ul vslot="content">
		            	<li v-for="(t2,j) in t1.child" @click.prevent>
		            		<span class="text simulate_input" :class="{editing:t2.name!==t2.copy||t2.id==''}" :contenteditable="t2.edit" v-focus.bind="AUX.focus_index[0]==i&&AUX.focus_index[1]==j" @click="focus($event,i,j)" @input="input($event,i,j)"  @keydown.13="keydown($event,i,j)" @blur="blur($event,i,j)" @paste="pasteHandler" placeholder="请输入分类" v-text="t2.show"></span>
		            		<span class="control" :class="{visibled:t2.name!==t2.copy||t2.name===''||t2.edit}" @click.stop="update(i,j)">确定</span>
		            		<span class="control" :class="{visibled:t2.name!==t2.copy||t2.name===''||t2.edit}" @click.stop="cancel(i,j)">取消</span>
		            		<span class="control visibled pull-right" v-if="t2.id" @click.stop="remove(i,j)">删除</span>
		            	</li>
		            </ul>
		        </el-collapse-item>
		       
		    </el-collapse>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				tags:[],
				
				AUX:{
					show_index:[],    //显示二极分类
					focus_index:[-1,-1],    //聚焦的分类
				}
			}
		},
		created(){
			this.getTags();
		},
		computed:{
			reverTags(){
				return this.$api.deepCopy(this.tags).reverse();
			}
		},
		methods:{
			getTags(){
				let v = this;
				v.$api.ajax(v.$uri.workold.tags,'get')
				.then(data=>{
					data.forEach(val=>{
						val.edit = false;
						val.dirty = false;  //脏数据（修改失败触发）
						val.copy = val.name;
						val.show = val.name;
						if(val.child){
							val.child.forEach(val2=>{
								val2.edit = false;
								val2.dirty = false;
								val2.copy = val2.name;
								val2.show = val2.name;
							})
						}
					})
					console.log("tags", data)
					v.tags = data;
				})
			},
			changeTag(i,j=undefined){
				let v = this;
				i=v.tags.length-i-1;
				
			},
			focus(e,i,j){
				let v = this;
				i=v.tags.length-i-1;
				let tag = v.tags[i];
				if(j!==undefined) tag = tag.child[j];  
				tag.edit = true;
				setTimeout(()=>{
					e.target.focus();
				},200)
			},
			blur(e,i,j){        
				let v = this;
				i=v.tags.length-i-1;
				let tag = v.tags[i];
				if(j!==undefined) tag = tag.child[j];  
				tag.name = tag.name==''?tag.code:tag.name;
				tag.show = tag.name;
				setTimeout(()=>{
					tag.edit = false;
				},200)
			},
			keydown(e,i,j){  
				let v = this;
				let i2=v.tags.length-i-1;
				let tag = v.tags[i2];
				if(j!==undefined) tag = tag.child[j];   
				v.update(i,j);
				e.preventDefault();
			},
			input(e,i,j){
				let v = this;
				let i2=v.tags.length-i-1;
				let tag = v.tags[i2];
				if(j!==undefined) tag = tag.child[j]; 
				tag.name = e.target.innerText;
			},
			update(i,j=undefined){
				let v = this;
				i=v.tags.length-i-1;
				let tag = v.tags[i];
				if(j!==undefined) tag = tag.child[j];  
				let data = {
					name:tag.name,
					pid:j!==undefined?v.tags[i].id:0
				}
				if(tag.name===''){
					v.$message({
						message:'分类名不能为空！',
						type:"warning"
					})
					return ;
				}
				if(v.判断重复(i,j)){
					v.$message({
						message:'此分类名已存在！',
						type:"warning"
					})
					return ;
				}
				if(tag.id){
					v.$api.ajax(v.$uri.workold.tags+'/'+tag.id,'put',data)
					.then(data=>{
						tag.copy = tag.name;   
						tag.show = tag.name;
						tag.c2 = tag.name;
						tag.dirty  = false;
						tag.edit = false;
						v.$message({
							message:'修改成功',
							type:"success"
						})
					}).catch(data=>{
						tag.edit = true;
						tag.dirty  = true;
						v.聚焦(i,j);
					})
				}else{
					v.$api.ajax(v.$uri.workold.tags,'post',data)
					.then(data=>{
						tag.id = data;
						tag.copy = tag.name;
						tag.show = tag.name;
						tag.dirty  = false;
						tag.edit = false;
						v.$message({
							message:'添加成功',
							type:"success"
						})
					}).catch(data=>{
						tag.edit = true;
						tag.dirty  = true;
						v.聚焦(i,j);
					})
				}
			},
			remove(i,j){
				let v = this;
				i=v.tags.length-i-1;
				let tags = v.tags;
				let tag =  v.tags[i];    
				let index = i;
				if(j!==undefined){
					tags = tags[i].child;
					tag = tag.child[j];
					index = j;
				}
				let txt= ['确认删除分类“',tag.name,'”？'];
				v.$confirm(txt.join(''), '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
		        }).then(() => {
		        	if(tag.id==='') {
		        		tags.splice(index,1)
		        	}else{
		        		v.$api.ajax(v.$uri.workold.tags+'/'+tag.id,'delete')
		        		.then(data=>{
		        			tags.splice(index,1);
		        		})
		        	}
		        })
			},
			cancel(i,j=undefined){  
				let v = this;
				i=v.tags.length-i-1;
				let tags = v.tags;
				let tag =  v.tags[i];
				let index = i;
				if(j!==undefined){
					tags = tags[i].child;
					tag = tag.child[j];
					index = j;
				}
				if(tag.id){								
					tag.name = tag.copy;
					tag.show = tag.copy;
					tag.edit = false;
					tag.dirty = false;
				}else{
					tags.splice(index,1);
				}
			},
			add(){
				let v = this;
				v.tags.push({
					id:'',
					name:'',
					copy:'',
					edit:true,
					dirty:false,
					child:[],
				});
				v.聚焦(0,-1);
			},
			addChild(i){
				let v = this;
				let i2=v.tags.length-i-1;
				if(!v.tags[i2].child) v.tags[i2].child = [];
				v.tags[i2].child.push({
					id:'',
					name:'',
					edit:true,
					dirty:false,
					copy:'',
				});
				if(v.AUX.show_index.indexOf(i2)==-1){
					v.AUX.show_index.push(i2)
				}
				v.聚焦(i,v.tags[i2].child.length-1);
			},
			判断重复(i,j){
				let v = this;
				let tags = v.tags;
				let tag = tags[i];
				let index = i;
				if(j!==undefined){
					tags = tags[i].child;
					tag = tags[j];
					index=j;
				}
				return tags.some((val,k)=>{
					if(index==k)
						return false;
					return val.name ==tag.name;
				})
			},
			聚焦(i,j=-1){
				let v = this;
				v.AUX.focus_index[0]=i;
				v.AUX.focus_index[1]=j;
			},
			showIndex(arr){
				let v = this;
				v.AUX.show_index = arr;
			},
			//粘贴限制
			pasteHandler(e){
				let v= this;
				let _this = v.$refs.write;
		        e.preventDefault();
		        var text = null;
		        if(window.clipboardData && clipboardData.setData) {
		            // IE
		            text = window.clipboardData.getData('text');
		        } else {
		            text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
		        }
		        if (document.body.createTextRange) {    
		            if (document.selection) {
		                textRange = document.selection.createRange();
		            } else if (window.getSelection) {
		                sel = window.getSelection();
		                var range = sel.getRangeAt(0);
		                
		                // 创建临时元素，使得TextRange可以移动到正确的位置
		                var tempEl = document.createElement("span");
		                tempEl.innerHTML = "&#FEFF;";
		                range.deleteContents();
		                range.insertNode(tempEl);
		                textRange = document.body.createTextRange();
		                textRange.moveToElementText(tempEl);
		                tempEl.parentNode.removeChild(tempEl);
		            }
		            textRange.text = text;
		            textRange.collapse(false);
		            textRange.select();
		        } else {
		            // Chrome之类浏览器
		            document.execCommand("insertText", false, text);
		        }
			},
		},
		components:{
			
		},
		watch:{
			
		},
		directives: {
		}
	}
</script>

<style lang="scss">
	$borderColor:#e7eff3;
	$fontColor:#8b99a7;
	$fontColor2:#343f4b;
	.workold_tags{
		font-size:14px;
		color:$fontColor;
		.ivu-collapse-content {
		}
		.el-collapse-item.noChild{
			.el-collapse-item__header__arrow {opacity:0;}
			.el-collapse-item__wrap {border:none;}
			.el-collapse-item__content {padding:0;}
		}
		.el-collapse-item__content {
			font-size:14px;
			color:$fontColor;
		}
		.addtag {
			border:1px dashed $borderColor;
			line-height:45px;
			text-align:center;
			cursor:pointer;
			margin: 20px 0 10px 0;
			border-radius:3px;
		}
		.tag1 {
			font-size:14px;
			color:$fontColor2;
			display:inline-block;
			width:calc(100% - 24px);
		}
		.text {
			display:inline-block;
			border-width:1px;
			border-style:solid;
			border-color:transparent;
			padding:0px 15px 0 14px;
			min-width: 50px;
			height:25px;
			line-height:25px;
			vertical-align: middle;
			border-radius:3px;
			outline: none;
			&:hover,&:focus,&.editing {border-color: #9ecaed;}
			&:focus{
				background: #fff;
			}
			&.editing {
				background: #fff;
			}
		}
		.control {
			padding-left:10px;
			font-size:14px;
			color:$fontColor;
			display:none;
			user-select:none;
			cursor: pointer;
			&:hover {color:darken($fontColor,20%);}
			&.visibled {display:inline;}
		}
		ul {
			
			li{
				padding-left:40px;
				padding-right:10px;
				line-height:35px;
				&+li {border-top: 1px solid $borderColor; }
			}
		}
		.noChild{
			.ivu-collapse-header{
				&>i {opacity: 0;}
			}
		}
		
		.ivu-collapse>.ivu-collapse-item>.ivu-collapse-header {
			padding-left:10px ;
		}
		.ivu-collapse-item:last-child>.ivu-collapse-content {
			padding-left:0px ;
			
		}
		.ivu-collapse-content,.ivu-collapse-content>.ivu-collapse-content-box {padding:0 !important;}
	}
</style>