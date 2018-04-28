<template>
	<div id="Fast-reply">
		<div class="tree">
			<div class="addTag" @click="addTag()"><i class="fa fa-plus"></i>&thinsp;添加分类</div>
			<bar :wrapper="'wrapper'">
				<tree :list='classifys' :series="1" :option="options" @changeTag="changeTag" @updateTag="updateTag" @deleteTag="deleteTag"></tree>
			</bar>
		</div>
		<div class="list">
			<!--<div class="input-group serach_wrap clearfix">
			  	<span class="input-group-btn">
			    	<dropdown v-model="show_dropdown">
					  <button data-role="trigger" class="btn dropdown-toggle" type="button">
					    <span>{{page.q_name||'全部'}}</span>
					    <span class="caret"></span>
					  </button>
					  <template slot="dropdown" class="dropdown-menu">
					    <li @click="page.q_filed='';page.q_name='全部';">全部</li>
					    <li @click="page.q_filed='qKey';page.q_name='快捷词';">快捷词</li>
					    <li @click="page.q_filed='qContent';page.q_name='回复内容';">回复内容</li>
					  </template>
					</dropdown>
			  	</span>
			  	<input v-model="page.q" @keydown.13="" class="form-control" placeholder="请输入搜索关键字" />
			  	<span class="pointer" @click="page.q=''"><img src="../../assets/img/remove_icon.png" /> </span>
			    <span class="btns-search pointer"><span class="glyphicon glyphicon-search"></span> </span>
			    <button @click="edit(0)">添加新问题</button>
			</div>-->
			<div class="input-group search_wrap clearfix">
				<Input v-model="page.q" size="small" @on-enter.prevent='' icon="ios-search" placeholder="请输入搜索内容">
				    <Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
				        <Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
				    </Select>
				    <Button slot="append" icon="search" @click=""></Button>
			   	</Input>
				<button class="my-btn my-btn-info-o my-btn-small pull-right" @click="edit()">添加快捷词</button>
			</div>
			<div class="table_wrap">
				<div class="simulate_table table4">
					<ul class="thead">
						<li class="tr">
							<div class="th">快捷词</div>
							<div class="th">回复内容</div>
							<div class="th">操作</div>
						</li>
					</ul>
					<ul class="tbody">
						<li class="tr" v-for="(item,i) in items">
							<div class="td" :title="item.qKey">{{item.qKey}}</div>
							<div class="td":title="item.qContent">{{item.qContent}}</div>
							<div class="td">
								<i @click="edit(item)" class="glyphicon glyphicon-pencil"></i>&emsp;
								<i @click="deleted(item)" class="glyphicon glyphicon-trash"></i>
							</div>
						</li>
					</ul>
				</div>
			</div><br />
			<div v-if="list.length>0" class="text-center">
				<pagination :page='page' :total="list.length" @pageTurn="changePage"></pagination>
			</div>
		</div>
		<modal v-model="show_edit" width="600" size="lg" :backdrop='false'>
			<h4 slot="header">
		      	<b>回复编辑</b>
		    </h4>
		    <div>
		    	<el-form :model="reply" :rules="reply_rules" ref="reply" label-width="80px">
		    		<el-form-item label="分类" prop="tag">
						<el-select v-model="reply.tag" placeholder="">
							<el-option v-for="(op,i) in classifys" v-if="i>0" :value="op.id" :label="op.name"></el-option>
						</el-select>
					</el-form-item>
		    		<el-form-item label="快捷词" prop="qKey" >
						<el-input v-model="reply.qKey" placeholder="" ></el-input>
					</el-form-item>
					<el-form-item label="回复内容" prop="qContent" >
						<el-input v-model="reply.qContent"  type="textarea" :rows="4" placeholder="请输入标准答案" ></el-input>
					</el-form-item>
		    	</el-form>
		    </div>
		    <div slot="footer">
			    <button class="my-btn my-btn-info-o" @click="show_edit= false;resetForm();">取消</button>
			    <button class="my-btn my-btn-info-f" @click="edited">确定</button>
			</div>
		</modal>
	</div>
</template>

<script>
	import bar from '../module/自定义滚动条.vue'
	import tree from '../module/tree.vue'
	import pagination from '../module/pagination.vue'
	import {Modal,ProgressBar,Dropdown,Tooltip} from 'uiv'
	export default{
		data(){
			var checkRepeat=(rule, value, cb)=>{
				if(this.isRepet(this.reply)){
					return cb(new Error('此快捷词已存在！'));
				}
				cb();
			};
			return {
				resource:{
					copy:{},
					source:{},
				},
				classifys:[{name:'全部分类',id:''}],
				options:{
					id:'id',
					name:'name',
					copy:'copy',
				},
				list:[],
				page:{
					page:1,
					size:10,
					tag:'',
					q:'',
					q_filed:"",
					q_name:'',
				},
				reply:{
					qKey_copy:'',
					tag_copy:'',
					qContent_copy:'',
					index:-1,
					qKey:'',
					tag:'',
					qContent:'',
				},
				reply_rules:{
					tag:[{required:true,message: '请选择分类'}],
					qKey:[{required:true,message: '请输入快捷词', trigger: 'blur'},{validator:checkRepeat,trigger:'blur'}],
					qContent:[{required:true,message: '请输入回复内容', trigger: 'blur'}],
				},
				log:{
					tag:{
						delete:'公有库删除分类：tag',
						update:'公有库更新分类：tag_old-tag',
						add:'公有库增加分类：tag'
					},
					reply:{
						delete:'公有库删除快捷回复：tag-qKey',
						update:'公有库更新快捷回复：tag_old-qKey_old-tag-qKey',
						add:'公有库增加快捷回复：tag-qKey'
					}
				},
				show_dropdown:false,
				show_edit:false,
				AUX:{
					filterKeys:[
						{label:'全部',value:''},
						{label:'快捷词',value:'qKey'},
						{label:'回复内容',value:'qContent'},
					]
				}
			}
		},
		created(){
			let v = this;
			v.searchs();
		},
		computed:{
			items(){
				let v= this;
				let list =v.list.filter((val,i)=>{
					if(v.page.q_filed)
						return val[v.page.q_filed].indexOf(v.page.q)>-1
					else
						return val.qKey.indexOf(v.page.q)>-1||val.qContent.indexOf(v.page.q)>-1;
				})
				return list.slice((v.page.page-1)*v.page.size,v.page.page*v.page.size>list.length?list.length:v.page.page*v.page.size);
			}
		},
		filter(){

		},
		methods:{
			searchs(){
				let v = this;
				v.$api.ajax(v.$uri.setting.快捷回复.common,'get')
				.then(data=>{
					if(data.quickFB && data.quickFB.tag!=undefined){
						for(let i in data.quickFB.tag){
							v.classifys.push({id:i,name:i,copy:i,edit:false});
						}
						v.resource.copy = v.$api.deepCopy(data.quickFB.tag);
						v.resource.source = v.$api.deepCopy(data.quickFB.tag);
						v.getList();
				    }
				});
			},
			getList(){
				let v = this;
				v.list = [];
				if(v.page.tag === ''){
					for(let i in v.resource.source){
						for(let j =0;j<v.resource.source[i].length;j++){
							let reply = v.$api.deepCopy(v.resource.source[i][j]);
							reply.tag = i;
							reply.index = j;
							v.list.push(reply);
						}
					}
				}else{
					for(let j=0;j<v.resource.source[v.page.tag].length;j++){
						let reply = v.$api.deepCopy(v.resource.source[v.page.tag][j]);
						reply.tag = v.page.tag;
						reply.index = j;
						v.list.push(reply);
					}
				}
			},
			update(log){
				let v = this;
				return new Promise((resolve,reject)=>{
					v.$api.ajax('/company/setting/quickFB','put',{tag:v.resource.source,action:log})
					.then(data=>{
						v.$message({
							message:'提交成功',
							type:'success'
						});
						v.resource.copy = v.$api.deepCopy(v.resource.source);
						resolve(data);
					}).catch(err=>{
						v.resource.source = v.$api.deepCopy(v.resource.copy);
						reject(err);
					});
				})

			},
			isRepet(reply){
				let v=this;
				var qfbs = v.resource.source;
				var qfbArr = qfbs[reply.tag]
				if(qfbArr == null) return false;
				for(var i=0,len=qfbArr.length; i<len; i++){
					if(reply.index == i && reply.tag_copy == reply.tag) continue;
					if(reply.qKey == qfbArr[i].qKey) return true;
				}
				return false;
			},
			edit(reply){
				let v= this;
				if(reply){
					v.reply.tag=v.reply.tag_copy = reply.tag;
					v.reply.qKey=v.reply.qKey_copy=reply.qKey;
					v.reply.qContent=v.reply.qContent_copy=reply.qContent;
					v.reply.index = reply.index;
				}else{
					v.reply.index = -1;
					v.reply.tag=v.reply.tag_copy=v.page.tag;
					v.reply.qKey='';
					v.reply.qContent='';
				}
				v.show_edit = true;
			},
			edited(){
				let v= this;
				let log='';
				this.$refs.reply.validate((valid) => {
					if(valid){
						if(v.reply.index>-1){
							if(v.reply.tag != v.reply.tag_copy){
								v.resource.source[v.reply.tag_copy].splice(v.reply.index,1);
								v.resource.source[v.reply.tag].unshift({qKey:v.reply.qKey,qContent:v.reply.qContent});
							}else{
								v.resource.source[v.reply.tag_copy][v.reply.index]={qKey:v.reply.qKey,qContent:v.reply.qContent};
							}
							log = v.log.reply.update.replace('tag_old',v.reply.tag_copy).replace('qKey_old',v.reply.qKey_copy).replace('qContent_old',v.reply.qContent_copy).replace('tag',v.reply.tag).replace('qKey',v.reply.qKey).replace('qContent',v.reply.qContent);
						}else{
							log = v.log.reply.add.replace('tag',v.reply.tag).replace('qKey',v.reply.qKey).replace('qContent',v.reply.qContent);
							v.resource.source[v.reply.tag].unshift({qKey:v.reply.qKey,qContent:v.reply.qContent});
						}
						v.update(log).then(data=>{
							v.show_edit = false;
							v.resetForm();
							v.getList();
						});
					}
				});
			},
			//重置表单
			resetForm(formName='reply') {
		        this.$refs[formName].resetFields();
		    },
			deleted(reply){
				let v= this;
				let index = reply.index;
				let tag = reply.tag;
				v.$confirm(`确认要删除快捷词-“${reply.qKey}”吗？`,'提示',{
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(()=>{
					let log = v.log.reply.delete.replace('tag',reply.tag).replace('qKey',reply.qKey).replace('qContent',reply.qContent);
					v.resource.source[tag].splice(index,1);
					v.update(log).then(data=>{
						v.getList();
					});
				})
			},
			addTag(){
				let v= this;
				if(v.classifys[v.classifys.length-1].name=='') return ;
				v.classifys.splice(1,0,{name:'',copy:'',edit:true})
			},
			deleteTag(i){
				let v= this;
				v.$confirm(`确认要删除分类-“${v.classifys[i].name}”，以及此分类下的快捷回复吗？`,'提示',{
					confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: 'warning'
				}).then(()=>{
					let log = v.log.tag.delete.replace('tag',v.classifys[i].name);
					delete v.resource.source[v.classifys[i].name];
					v.update(log).then(data=>{
						v.classifys.splice(i,1);
						v.getList();
					});
				})
			},
			updateTag(i){
				let v= this,log='';
				if(v.classifys[i].name==''){
					v.resource.source[v.classifys[i].copy]=[];
					log = v.log.tag.add.replace('tag',v.classifys[i].copy);
				}else{
					v.resource.source[v.classifys[i].copy] = v.resource.source[v.classifys[i].name];
					delete v.resource.source[v.classifys[i].name];
					log = v.log.tag.update.replace('tag_old',v.classifys[i].name).replace('tag',v.classifys[i].copy);
				}
				v.update(log).then(data=>{
					v.classifys[i].id = v.classifys[i].copy;
					v.classifys[i].name = v.classifys[i].copy;
					v.classifys[i].edit = false;
				});
			},
			changeTag(id){
				this.page.page = 1;
				this.page.tag = id;
				this.getList();
			},
			changePage(){

			}
		},
		components:{
			tree,pagination,bar,Dropdown,
		},
		watch:{

		},
		directives:{

		},
		filters:{

		},
	}
</script>

<style lang="scss" scoped="">
	$color1:#1f89f6;
	#Fast-reply {
		font-size:0;height:100%;
		& > * {display:inline-block; vertical-align:top; font-size:14px; }
		.tree {
			width:220px;
			height:calc(100% - 50px);
			border-right:1px solid #ccc;
			.addTag {
				margin-top:10px;
				height:40px; margin:auto; color:$color1;line-height:47px; font-size:14px; cursor:pointer; padding-left:15px;
				&:hover {color:darken($color1,10%);}
				i{display:iinline-block; border-radius:50%; width:18px; line-height:19px; height:18px; text-align:center; background:rgba($color1,0.2); margin-right:3px;}
			}
			.wrapper {
				height: 100%;
			}
			& > p {
				border-top:1px solid #ccc;
				border:1px solid #ccc;
				width:80%;
				margin:0 auto;
			}
		}
		.list{
			width:calc(100% - 220px); height:100%;
			padding-left:30px;
			padding-right:30px;
			.simulate_table {
				.td,.th{
					&:nth-child(1) {width: 20%;}
					&:nth-child(2) {width: 65%;}
					&:nth-child(3) {width: 15%;}
				}
			}
		}
	}

</style>
