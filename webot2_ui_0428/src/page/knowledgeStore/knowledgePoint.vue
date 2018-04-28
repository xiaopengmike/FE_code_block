<template>
	<div class="knowledgestore point flex flex-2">
		<left-aside class="flex-left" type="tags">
			<template slot="title">
				知识点
			</template>
			<template slot="content">
				<ul class="tags">
					<li class="tag unselect" @click="addTag">
						<div class="add">
							<i class="fa fa-plus"></i>
							添加标签
						</div>
					</li>
				</ul>
				<bar wrapper="wrapper">
					<tags :tags="tags" @change="changeTag" @update="updateTag" @remove="removeTag"></tags>
				</bar>
			</template>
		</left-aside>
		<div class="flex-right">
			<h1 class="page_title">
				<span v-show="page.tag ===''">全部标签</span>
				<span v-show="page.tag !==''">{{tags_obj[page.tag]}} </span>
			</h1>
				<div class="input-group search_wrap clearfix">
					<Input v-model="page.q" size="small" @on-enter.prevent='searchs(1)' icon="ios-search" placeholder="请输入搜索内容">
					    <Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
					        <Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
					    </Select>
					    <Button slot="append" icon="search" @click="searchs(1)"></Button>
				   </Input>
					<!--<Input v-model="page.q" size="small" icon="ios-search" @on-click="searchs(1)" @on-enter.prevent='searchs(1)' style="width: 200px"></Input>-->
					 <button class="my-btn my-btn-info-f my-btn-small pull-right" @click="edit()">创建知识点</button>
				</div>
				<div class="table_wrap">
					<div class="table4 simulate_table table_select">
						<ul class="thead">
							<li class="tr">
								<div class="th"></div>
								<div class="th">标题&ensp;<!--<sort akey="question" :active="page.sort_filed=='question'" :status="page.sort" @click="changeFilterSort"></sort>--></div>
								<div class="th">答案&ensp;<!--<sort akey="answer" :active="page.sort_filed=='answer'" :status="page.sort" @click="changeFilterSort"></sort>--></div>
								<div class="th">创建时间&ensp;<!--<sort akey="created" :active="page.sort_filed=='created'" :status="page.sort" @click="changeFilterSort"></sort>--></div>
								<div class="th">属性</div>
								<div class="th">状态</div>
								<div class="th">操作</div>
							</li>
						</ul>
						<ul class="tbody">
							<li class="tr" v-for="(item, index) in list" :key="item.id" :class="{disable:item.status,selected:选中.indexOf(item.id)!=-1,editing:item.id==point.id}"  v-tap="()=>{if(选中.indexOf(item.id)==-1) edit(item.id);}">
									<div class="td" @mousedown.stop>
										<span :class="选中.indexOf(item.id)!=-1?'is-checked el-checkbox__input':'el-checkbox__input'"
											@click.stop="()=>{if(选中.indexOf(item.id)!=-1){选中.splice(选中.indexOf(item.id),1);}else{ 选中.push(item.id);}}">
											<span class="el-checkbox__inner"></span>
										</span>
									</div>
									<div class="td">
										<el-tooltip popper-class="black html" v-if="prev_page.q_filed=='title'||prev_page.q_filed==''" :open-delay="400" placement="top-start">
											<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.title,prev_page.q,1000)"></div>
											<p class="text" v-html="$api.filterSerachStringAndLimitNum(item.title,prev_page.q,60)"></p>
										</el-tooltip>
										<el-tooltip v-else  popper-class="black html" :open-delay="400" placement="top-start">
											<div slot="content" v-html="item.title"></div>
											<p class="text" v-html="item.title"></p>
										</el-tooltip>
									</div>
									<div class="td">
										<el-tooltip v-if="prev_page.q_filed=='content'||prev_page.q_filed==''"  popper-class="black html" :open-delay="400" placement="top-start">
											<div slot="content">
												<p  v-html="$api.filterSerachStringAndLimitNum(item.content.text,prev_page.q,30000)"></p>
												<div class="accessory">
													<p class="ps special" v-if="item.content.accessory.length>0">附件：</p>
													<ul>
														<li v-for="i in item.content.accessory" class=" special">{{i.name}}</li>
													</ul>
												</div>
											</div>
											<p class="text" v-html="$api.filterSerachStringAndLimitNum($api.htmlToStr(item.content.text),prev_page.q,20)"></p>
										</el-tooltip>
										<el-tooltip v-else  popper-class="black html" :open-delay="400" placement="top-start">
											<div slot="content">
												<p  v-html="$api.filterSerachStringAndLimitNum(item.content.text,'',30000)"></p>
												<div class="accessory">
													<p class="ps special" v-if="item.content.accessory.length>0">附件：</p>
													<ul>
														<li v-for="i in item.content.accessory" class=' special'>{{i.name}}</li>
													</ul>
												</div>
											</div>
											<p class="text" v-html="$api.htmlToStr(item.content.text)==''?'【附件】':$api.htmlToStr(item.content.text)"></p>
										</el-tooltip>
									</div>
									<div class="td">{{item.created}}</div>
									<div class="td">
										<span class="situation" v-if="item.situation==0">&ensp;内&ensp;</span>
										<span class="situation" v-if="item.situation==1">&ensp;外&ensp;</span>
										<span class="situation" v-if="item.situation==2">内/外</span>
									</div>
									<div class="td" @mousedown.stop>
										<span class="status-disable" v-if="item.status==0" @click.stop="able(1, item.id)">禁用</span>
										<span class="status-using" v-if="item.status==1" @click.stop="able(0, item.id)">启用</span>
									</div>
									<div class="td" @mousedown.stop>
										<span class="operate-edit pointer" @click.stop="edit(item.id)">编辑</span>&nbsp;
										<span class="operate-remove" @click.stop="del(item)">删除</span>
									</div>
							</li>
						</ul>
						<ul class="tfoot" v-if="list.length>0">
							<li class="tr">
								<div class="td">
									<!--<el-checkbox :indeterminate="isAllChoose" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
	 								<span @click="全选()" class="el-checkbox__input" :class="{'is-checked':选中.length==list.length}">
										<span class="el-checkbox__inner"></span>
									</span>
									<span @click="全选()" class="check-txt pointer unselect">全选</span>
									<button v-if="选中.length>0" @click="del('all')" class="my-btn my-btn-primary my-btn-small">删除</button>
								</div>
								<div class="td text-right" v-show="选中.length!=0">
									<button @click.stop="able(0)" v-authority="'机器人知识库-知识库-禁用'" class="my-btn my-btn-info-o my-btn-small" >禁用
									</button><button @click.stop="able(1)" v-authority="'机器人知识库-知识库-禁用'" class="my-btn my-btn-info-o my-btn-small marg_l_10">启用</button>
								</div>
							</li>
						</ul>
					</div>
				</div><br />
				<div class="pagination_wrap" v-if="total>0">
					<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
					<!--<pagination :page="page" :total="total" v-on:pageTurn="searchs"></pagination>-->
				</div>
		</div>

		<my-modals v-model="AUX.show_edit">
			<span slot="title">知识点编辑</span>
			<div slot="content">
				<el-form :model="point" :rules="point_rules" ref="point" class="small_modals">
					<el-form-item label="知识点标题" prop="title">
					    <el-input v-model="point.title"></el-input>
					</el-form-item>
					<el-form-item label="标签" prop="tag">
					    <el-select v-model="point.tag" multiple style="width:100%;">
					    	<el-option v-for="t in tags" v-if="t.id" :key="t.id"  :label="t.name" :value="t.id"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="" style="margin-bottom:5px">
						<label for="content.text" class="el-form-item__label"><font class='red'>*</font> 知识点内容</label>
						<textarea v-model="point.content.text" style="display:none;"></textarea>
					    <editor  v-model="point.content.text" :options="editorOption" placeholder="请输入.." ref="myQuillEditor">
					    </editor>
					</el-form-item>
					<div class="upload">
						<upload  :action="$uri.upload.file" size="20M"
                     :success="uploadSuccess" :error="uploadError_mixin" :before="beforeUpload" >
							<a class="upload_text pointer">
								<i class="fa fa-paperclip" aria-hidden="true"></i>
								上传附件
							</a>
						</upload>
						<div class="file" v-for="(f,i) in point.content.accessory">
							<i class="fa fa-file" ></i>
							<span class="name" :title="f.name">{{f.name}}</span>
							<span class="upload_text pointer"><!--查看--></span>
							<span class="upload_text pointer" @click="$api.downloadFromService(f.name,f.url)">下载</span>
							<b class="close" @click="point.content.accessory.splice(i,1)">×</b>
							<div class="progress"></div>
						</div>
					</div>
					<el-form-item label="适用场景" prop="situation">
					   	<el-radio-group v-model="point.situation">
						    <el-radio :label="0">对内</el-radio>
						    <el-radio :label="1" disabled>对外(暂时无法配置)</el-radio>
						    <!--<el-radio :label="2">内/外</el-radio>-->
						  </el-radio-group>
					</el-form-item>
					<el-form-item label="相关问题">
					   	<a class="btn btn-default" @click.stop="toNewQuestion">添加新问题</a>
					   	<a @click.stop="AUX.show_select_question=true" class="btn btn-default">关联已有问题</a>
					</el-form-item>
					<ul class="list">
						<li class="item" v-for="(q,i) in point.questions">
							<span class="text" :title="questions[q]">{{i+1}}.{{questions[q]}}</span>
							<b class="close" @click="point.questions.splice(i,1)">×</b>
						</li>
					</ul>
				</el-form>
			</div>
			<div slot="foot">
				<button class="my-btn my-btn-transparent" @click="AUX.show_edit=false">&emsp;取消&emsp;</button>&emsp;&emsp;
				<button class="my-btn my-btn-info-f" @click="update">&emsp;确定&emsp;</button>
			</div>
		</my-modals>

		<question-modal  :question="question" v-model="isShowQuestion" @successHandler="addQuestionSuccess">
		</question-modal>
		<selectQuestion :ids="point.questions" @update:ids='val=>point.questions=val'  v-model="AUX.show_select_question"></selectQuestion>

		</modal>
	</div>
</template>

<script>
	import leftAside from '../module/left-aside.vue'
	import questionModal from './modules/edit_question.vue'
	import  editor  from '../module/editor'
	import upload from '../module/upload'
	import upload_mixin from '../module/upload_mixin.js'
	import bar from '../module/自定义滚动条'
	import selectQuestion from './modules/select_question'
	import tags from './modules/tags'
	export default {
		mixins:[upload_mixin],
		data(){
			return {
				tags:[],
				tags_obj:{},
				list:[],
				total:0,
				checkList:[],
				page:{
					tag:'',
					page:1,
					size:16,
					q:'',
					q_filed:'',
					sort_filed:'created',
					sort:1,
				},
				prev_page:{
					q:'',
					q_filed:'',
				},
				选中:[],
				point:{
					id:'',
					title:'',
					tag:[],
					content:{
						text:'',
						accessory:[],
					},
					situation:0,
					status:-1,
					questions:[],
				},
				point_static:{
					id:'',
					title:'',
					tag:[],
					content:{
						text:'',
						accessory:[],
					},
					situation:0,
					status:1,
					questions:[],
				},
				questions: [],
				question: {},
				isShowQuestion: false,
				checkAll: "",
				isAllChoose: false,
				point_rules:{
					title:[{required:true,message:'请输入标题',trigger:'blur'}],
					/*content:{
						text:[{required:true,message:'请输入内容',trigger:'blur'}],
					},*/
				},
				editorOption:[
	            	[{ 'size': ['small', false, 'large', 'huge'] }],
	            	['bold', 'italic'],
	            	[{ 'list': 'ordered'}, { 'list': 'bullet' }],
	            	['link'],
			        [{image:{url:this.$uri.upload.file}}],
				],
				AUX:{
					show_edit:false,
					show_edit_question:false,
					show_select_question:false,
					filterKeys:[
						{ label:'全部',value:'' },
						{label:'标题',value:'title'},
						{label:'内容',value:'content'},
					]
				}
			}
		},
		created(){
			this.getTags();
			this.searchs();
			this.question = this.genQuestion();
		},
		computed:{

		},
		methods:{
			genQuestion(){
				return {
	  				type: 0,
		      		id: '',
		      		tag1: 0,
		      		tag2: null,
		      		question: '',
		      		similar_question:[""],
		      		answer:[""],
		      		rich_answer:[],
		      		points:[],
		      		merge_ids:[],
		      		advanced_options:{
						switch: 1,
						priority: 2,
						valid_start: '',
						valid_end: '',
						start_switch: '',
						end_switch: '',
						keyword_switch: '',
						warning_switch: '',
					}
		      	}
			},
			searchs(index){
				let v =this;
				if(index) v.page.page=index;
				v.$api.ajax(v.$uri.knowledgeStore.point.list,'get',v.page)
				.then(data=>{
					v.total = data.total;
					data.list.forEach(val=>{
						val.content = v.contentHandler(val.content);
					})
					v.list = data.list;
					v.prev_page.q = v.page.q;
					v.prev_page.q_filed = v.page.q_filed;
				});
			},
			contentHandler(content){
				try{
					while(typeof content == 'string'){
						content = JSON.parse(content);
					};
					if(!content){
						throw '空字段';
					}
				}catch(err){
					content = {
						text:'',
						accessory:[],
					};
				}
				return content;
			},
			addQuestionSuccess(data){
				this.point.questions.push(data);
			},
			addQuestion(event, question){
				let v = this;
				console.log("add question ...", question);
				v.$api.ajax(v.$uri.knowledgeStore.knowledge.list, 'post', question).then((resp) => {
					v.value = false;
					v.$message({
						type: 'success',
						message: '新增成功!'
					});
					this.questions[resp] = question.question;
					this.point.questions.push(resp);
					v.isShowQuestion = false;

				})
				// this.question = this.genQuestion();
			},
			getTags(){
				let v =this;
				v.$api.ajax(v.$uri.knowledgeStore.point.tags,'get',{page:1,size:10000})
				.then(data=>{
					data.list.forEach(val=>{
						val.edit = false;
						val.copy = val.name;
					})
					v.tags = data.list;
					v.生成TagObj();
				})
			},
			生成TagObj(){
				let v = this;
				v.tags.forEach(val=>{
					v.tags_obj[val.id] = val.name;
				})
			},
			addTag(){
				if(this.tags.length==0||this.tags[this.tags.length-1].id!==''){
					let tag = {
						id:'',
						name:'',
						copy:'',
						edit:true,
					};
					this.tags.push(tag);
				}
			},
			able(status, kid=null){
				let v = this;
				let put_url = "";
				let put_data = {status: Number(status)};
				if(kid!==null){
					put_url = v.$uri.knowledgeStore.point.list + "/" + kid;
				}else{
					put_url = v.$uri.knowledgeStore.point.list;
					put_data.ids = v.选中;
				}
				v.$api.ajax(put_url,'put',put_data).then(data=>{
					v.$message({
						type:'success',
						message:"修改成功"});
					v.searchs()
				})
			},
			changeTag(id){
				this.page.tag = id;
				this.searchs(1);
			},
			updateTag(t){
				let v =this;
				let tag = v.$api.deepCopy(t);
				tag.name = tag.copy;
				delete tag.copy;
				delete tag.edit;
				if(tag.id===''){
					delete tag.id;
				}
				let type = tag.id===undefined?'post':'put';
				v.$api.ajaxNoLoading(v.$uri.knowledgeStore.point.tags,type,tag)
				.then(data=>{
					t.id = t.id===''?data:t.id;
					t.name = t.copy;
					t.edit = false;
					v.生成TagObj();
				})
			},
			removeTag(id,i){
				let v = this;
		    	v.$api.ajaxNoLoading(v.$uri.knowledgeStore.point.tags+'/'+id,'delete')
		    	.then(data=>{
		    		v.tags.splice(i,1);
		    		v.生成TagObj();
		    		v.$message({
			    		  type: 'success',
			    		  message: '删除成功!'
		    		});
		    	})
			},

			edit(id){
				let v = this;
				if(id){
					v.$api.ajax(v.$uri.knowledgeStore.point.list,'get',{id:id})
					.then(data=>{
						//json型字符串转换
						data.content = v.contentHandler(data.content);
						if(typeof data.questions == 'string'){
							try{
								data.questions = JSON.parse(data.questions);
							}catch(e){
								data.questions = [];
							}
						}
						if(typeof data.tag == 'string'){
							try{
								data.tag = JSON.parse(data.tag);
							}catch(e){
								data.tag = [];
							}
						}
						//去掉不存在的tag
						data.tag = data.tag.filter(val=>v.tags_obj[val]!==undefined);
						v.point = data;
						v.AUX.show_edit = true;
					})
				}
				else{
					v.point  = v.$api.deepCopy(v.point_static);
					v.AUX.show_edit = true;
				}
			},
			del(item){
				let v= this;
				let content = "";
				let del_url = "";
				let del_data = {};
				if(item!="all"){
					del_url = v.$uri.knowledgeStore.point.list+"/"+item.id;
					content = '确定删除知识点“'+item.title+'”？';
				}else{
					del_url = v.$uri.knowledgeStore.point.list;
					content = '确定批量删除知识点？';
					del_data = {ids: v.选中};
				}
				v.$confirm( content,'提示',{
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(()=>{
		        	v.$api.ajax(del_url,'delete', {data: del_data})
		        	.then(data=>{
		        		v.$message({
		        			type:'success',
		        			message:'删除成功'
		        		});
		        		v.searchs();
		        	})
		        })
			},
			update(){
				let v= this;
				v.$refs.point.validate((valid) => {
					let error_msg = false;
					if(!valid){
						error_msg = '标题必须填写'
					}
					else if(v.point.content.text=='' && v.point.content.accessory.length==0){
						error_msg = '内容必须填写'
					}
					if(error_msg){
						v.$message({
							type: 'error',
							message: error_msg
						})
						return ;
					}
					if(v.point.id!==''){
						let put_url = v.$uri.knowledgeStore.point.list + '/' + v.point.id;
						v.$api.ajax(put_url,'put',v.point)
						.then(data=>{
							v.$message({
								message:'修改成功',
								type:"success"
							});
							v.AUX.show_edit=false;
							v.searchs();
						});
					}else{
						v.$api.ajax(v.$uri.knowledgeStore.point.list,'post',v.point)
						.then(data=>{
							v.$message({
								message:'新增成功',
								type:"success"
							});
							v.AUX.show_edit=false;
							v.searchs();
						});
					}
				})
			},
			beforeUpload(file){
				/*if(this.point.content.accessory.some(val=>val.name == file.name)){
					this.$message({
						message:'文件（file.name）已存在！',
						type:'warning'
					})
					return false;
				}*/
				return this.beforeUpload_mixin();
			},
			uploadSuccess(res,file){
				this.uploadSuccess_mixin(res);
				let data = {
					name:file.name,
					url:res.url,
					size:file.size
				};
				this.point.content.accessory.push(data)
			},
			getQuestions(ids){
				let v = this;
				let data = {};
				if(ids){
					data.ids = ids.join(',');
				}
				v.$api.ajaxNoLoading(v.$uri.knowledgeStore.knowledge.list,'get',{ids:ids})
				.then(data=>{
					v.questions = {};
					data.list.forEach(val=>{
						v.questions[val.id] = val.question;
					})
				})
			},
			toNewQuestion(){
				this.question = this.genQuestion();
				this.isShowQuestion = true;
			},
			全选() {
				let v = this;
				if(v.选中.length !== v.list.length) {
					v.选中 = [];
					v.选中 = v.list.map((val) => {
						return val.id;
					});
				} else {
					v.选中 = [];
				}
			},
			handleCheckAllChange(){
				if(!this.checkAll){
					return this.checkList = [];
				}
				let checks = []
				for(let i in this.list){
					checks.push(this.list[i].id);
				}
				this.checkList = checks;
			}

		},
		components:{
			leftAside,
			editor,
			upload,
			questionModal,
			selectQuestion,
			bar,
			tags,
		},
		watch:{
			"point.questions":{
				handler(n){
					if(n&&n.length>0)
					this.getQuestions(n)
				},deep:true,
			},

		}
	}
</script>

<style lang="scss" scoped="">
	@import '../../assets/scss/api.scss';

	$th_widths:(0.25,0.25,0.15,0.1,0.1,0.15);
	.point{
		height:100%;

		.flex-left{
			height:100%;
			width:185px;


		}
		.flex-right{padding:0 20px;}
		.simulate_table {
			@include simulateTableThWidth($th_widths,true);


			.situation {color:#fff; padding:0px 5px; border-radius:10px; background:#bbbec4; }
			.status {cursor: pointer;}
			.status0 {
				color:#b8c9d3;
			}
			.status1 {
				color:#1f89f6;
			}
			.control {
				cursor:pointer;
				&.edit{
					color:#1f89f6;
				}
				&.del{
					color:#e73e3e;
				}
			}
		}

		.upload {
			small {color:#cdd4d8;}
			.file {
				border:1px solid #eff5f8;
				background:#f7fafc;
				position:relative;
				padding:0 10px;
				color:#8b99a7;
				font-size: 14px;
				& > * {vertical-align:middle;display:inline-block; line-height:25px;;}
				.name{width:180px; overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;}
				.question{width:250px;}
				.upload_text {width:40px; text-align:center;}
				.progress{position:absolute;top:0; left:0; height:100%; background:lighten(yellow,15%); }
			}
		}


	}

	//el-tooltip__popper
	.el-tooltip__popper{
	    .accessory {
	        * {color:#ccc !important;}
	    }
	    p+.ps{ padding-top:10px;}
	    .ps {color:#bbb;}
	}
</style>
