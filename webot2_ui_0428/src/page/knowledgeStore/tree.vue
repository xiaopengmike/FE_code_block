<template>
	<div id="tree">
		<ul>
			<li :class="search.tag1===''?'active':''">
				<div>
					<span class="glyphicon glyphicon-chevron-right opcity"></span>
					<p @click="searchTag()">全部分类</p>
					<span class="glyphicon glyphicon-plus pointer" @click="addTag()" v-if="canEdit" v-authority="'增加分类'"></span>
				</div>
			</li>
			<li :class="search.tag1===0?'active':''">
				<div>
					<span class="glyphicon glyphicon-chevron-right opcity"></span>
					<p @click="searchTag(0)">未分类</p>
				</div>
			</li>
			<li v-for="(item,i) in list" :class="search.tag1===item.id?'active':''" v-if="item.id!=0">
				<div v-if='!item.edit'>
					<span @click="itemShow(i)" :class="item.child.length>0?(!item.show?'glyphicon glyphicon-play':'glyphicon glyphicon-play turn'):'glyphicon glyphicon-chevron-right opcity'"></span>
					<p @click="itemShow(i),searchTag(item.id)" :title="item.name">{{item.name}}</p>
					<b v-if="canEdit" @click="deleteTag(i)" v-authority="'删除分类'" class="glyphicon glyphicon-trash pull-right pointer"></b>
					<b v-if="canEdit" @click="editTag(i)" v-authority="'修改分类'" class="glyphicon glyphicon-pencil pull-right pointer"></b>
					<b v-if="canEdit" @click="addTag(i)" v-authority="'增加分类'" class="glyphicon glyphicon-plus pull-right pointer"></b>
				</div>
				<div v-else class="edit">
					<p><input class="form-control" v-model="item.name" /></p>
					<!--<popover v-show="item.name.trim()!=''&&item.repeated" placement="right">
					  <span data-role="trigger" class="glyphicon glyphicon-ok pull-right"></span>
					  <div slot="popover">
					    <p>{{err_content}}</p>
					  </div>
					</popover>-->
					<b @click="cancelEdit(i)" class="glyphicon glyphicon-remove pull-right pointer"></b>
					<b v-show="item.name.trim()!=''" @click="submitEdit(i)" class="glyphicon glyphicon-ok pull-right pointer"></b>
				</div>
				<ol v-if="item.child" v-show="item.show">
					<li v-for="(child,j) in item.child" :class="(search.tag2===child.id&&item.show)?'active':''">
						<div v-if="!child.edit">
							<label>·</label>
							<p @click="searchTag(item.id,child.id)" :title="child.name">{{child.name}}</p>
							<b v-if="canEdit" @click="deleteTag(i,j)" v-authority="'删除分类'" class="glyphicon glyphicon-trash pull-right pointer"></b>
							<b v-if="canEdit" @click="editTag(i,j)" v-authority="'修改分类'" class="glyphicon glyphicon-pencil pull-right pointer"></b>
						</div>
						<div v-else class="edit">
							<p><input class="form-control"  v-model="child.name"/></p>
							<b @click="cancelEdit(i,j)" class="glyphicon glyphicon-remove pull-right pointer"></b>
							<b @click="submitEdit(i,j)" class="glyphicon glyphicon-ok pull-right pointer"></b>
						</div>
					</li>
				</ol>
			</li>
		</ul>
	</div>
</template>
<script>
	import { Popover  } from 'uiv'
	export default {
		props:['list','search','canEdit'],
		data(){
			return {
				err_content:'已存在此分类名！',
				show:0,
			}
		},
		computed:{
		},
		methods:{
			addTag(index=undefined){
				if(index==undefined){
					if(this.list.length==0 ||  this.list[0].id)
						this.list.unshift({name:"",edit:true});
				}
				else{
					this.list[index].show="true";
					if(!this.list[index].child)
						this.list[index].child=[];
					if(this.list[index].child.length==0||this.list[index].child[0].id)
						this.list[index].child.unshift({name:'',edit:true});
				}   
			},
			cancelEdit(index,index2=undefined){
				var v = this;
				if(index2==undefined){
					if(!this.list[index].id){
						this.list.splice(index,1);
					}else{
						this.list[index].edit=false;
					}
				}else{
					if(this.list[index].child[index2].id)
						this.list[index].child[index2].edit=false;
					else
						this.list[index].child.splice(index2,1);
				}
				v.list[index].name = v.list[index].name.trim();
			},
			submitEdit(index,index2=undefined){
				var v = this;  
				var list = index2? v.list[index]:v.list;
				var index3 =  index2? index2:index;
				for(var i=0;i<list.length;i++){
					if(i!=index3&&list[i].name.trim()==list[index3].name.trim()){
						alert("分类名重复了");
						return false;
					}
				}
				v.show++;
				if(index2==undefined){
					if(v.list[index].name.trim()!=''){
						if(!v.list[index].id){
							this.$api.ajax('/questions/tags','post',{pid:0,name:v.list[index].name.trim()})
							.then(function(data){
								var item = {id:data,name:v.list[index].name,child:[],edit:false};
								v.list.shift();
								v.list.unshift(item);
								v.show--;
							})
							.catch(err => {v.show--;});
						}else{
							this.$api.ajax('/questions/tags/'+v.list[index].id,'put',{pid:index,name:v.list[index].name.trim()})
							.then(function(data){
								v.list[index].edit=false;           
								v.list[index].name = v.list[index].name.trim()+' ';
								v.show--;
							})
							.catch(err => {v.show--;});
						}
						
					}
				}else{
					if(v.list[index].child[index2].name.trim()!=''){
						if(!v.list[index].child[index2].id){
							this.$api.ajax('/questions/tags','post',{pid:v.list[index].id,name:v.list[index].child[index2].name.trim()})
							.then(function(data){
								var item = {
									id:data,
									name:v.list[index].child[index2].name,
									edit:false
								};
								v.list[index].child.shift();
								v.list[index].child.unshift(item);
								v.show--;
							})
							.catch(err => {v.show--;});
						}
						else{
							this.$api.ajax('/questions/tags/'+v.list[index].child[index2].id,'put',{name:v.list[index].child[index2].name.trim()})
							.then(function(data){
								v.list[index].child[index2].edit=false;
								v.list[index].name = v.list[index].name.trim()+' ';
								v.show--;
							})
							.catch(err => {v.show--;});
						}
					}
				}  console.log(v.list)
			},
			deleteTag(index,index2=undefined){
				var v = this;
				var id = index2==undefined?v.list[index].id:v.list[index].child[index2].id;
				var name =  index2==undefined?v.list[index].name:v.list[index].child[index2].name;
				if(confirm('确定要删除分类："'+name+'"?'))
					this.$api.ajax('/questions/tags/'+id,'delete')
						.then(data => {
							if(index2==undefined){
								v.list.splice(index,1);
							}else{
								v.list[index].child.splice(index2,1);
							}
							if(id==v.search.tag1 || id==v.search.tag2){
								if(id==v.search.tag2)
									v.search.tag2='';
								if(id==v.search.tag1)
									v.search.tag1='';
								searchTag(v.search.tag1,v.search.tag2);
							}
							v.show--;
						})
						.catch(err => {v.show--;});
			},
			editTag(index,index2=undefined){   
				var v = this;                    
				if(index2==undefined){
					v.list[index].edit=true;
				}else{
					v.list[index].child[index2].edit=true;
				}
				v.list[index].name = ' '+v.list[index].name;
			},
			itemShow(index){   
				if(this.list[index].show==undefined)
					this.list[index].show = true;
				else
					this.list[index].show = !this.list[index].show; 
				if(this.list[index].show)
					this.list[index].name = this.list[index].name+' ';
				else
					this.list[index].name = this.list[index].name.trim();
			},
			searchTag(id='',id2=''){
				this.search.tag1 = id;
				this.search.tag2 = id2;
				this.$emit('searchTag');
			},
			isRepetition:function(i,j=undefined){
				var is = false;
				var list = j?this.list[i]:this.list;
				var index = j?j:i;
				for(var x=0;x<list.length;x++){
					if(x!=i&&list[x]==list[i]){
						is=true;
						break;
					}
				}
				return is
			},
		},
		watch:{
			
		},
		components:{
			Popover,
			
		},
		filter:{
			
		}
	}
</script>
<style>
	#tree {position:relative; top:10px; overflow-x:hidden; right:-17px;}
	#tree ul { overflow-y:scroll;overflow-x:hidden;}
	#tree ul li:first-child span {font-family:100;}
	#tree ul li:first-child span:hover {color:#ffc156;}
	/*tree ul::-webkit-scrollbar {width:0px; background:red;}*/
	#tree ul li div {padding:0;margin:5px 0; line-height:20px; }
	#tree ul li div input.form-control {height:23px; width:70px; padding:0;}
	#tree ul li div.edit {}
	#tree ul li span,#tree  ul li b {vertical-align:top; padding:5px 7px 0 0;}
	#tree ol li span,#tree  ol li b {padding-top:5px;}
	#tree ul li b.glyphicon {display:none;}
	#tree ul li div:hover b.glyphicon {display:inline-block;}
	#tree ul p {display:inline-block; max-width:70px;overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis; margin:0 0 0 10px; padding: 3px 5px;}
	#tree ul ol label {color:#84dc95; font-size:15px; font-family:"微软雅黑"; vertical-align:top; position:relative; left:30px;}
	#tree ol p {margin-left:40px;}
	#tree ul li p:hover {color:#31B0D5; cursor:pointer;}
	#tree ul li span:hover {color:#31B0D5;}
	#tree ul li div span.opcity {opacity:0;}
	#tree ul li span {transition: all 0.5s; color:#84dc95;}
	#tree ul li {position:relative;}
	#tree ul > li.active > div > p {color:#fff; background:#84dc95; border-radius:8px;}
	#tree ul li ol li.active p {color:#84dc95; border-bottom:3px solid #84dc95; font-weight: bold;}
	.turn {
		transform:rotate(90deg);
		-ms-transform:rotate(90deg); 	
		-moz-transform:rotate(90deg); 	
		-webkit-transform:rotate(90deg);
		-o-transform:rotate(90deg);
		transform-origin:50% 70%;
	}
	
	
</style>