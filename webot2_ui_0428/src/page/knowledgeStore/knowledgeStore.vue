<template>
	<div class="knowledgestore store flex flex-2">
		<div class="flex-left">
			<left-aside type="classify" width="190">
				<template slot="title">
					知识库
				</template>
				<template slot="content">
					<div class="addTag" @click="addTag()"><i class="fa fa-plus"></i>&thinsp;添加分类</div>
					<bar :wrapper="'wrapper'">
						<tree :list="Clists" @changeTag="changeTag" @deleteTag="deleteTag" @addTag="addTag" @updateTag="updateTag"></tree><br />
					</bar>
				</template>
			</left-aside>
			<!--<div class="addTag" @click="addTag()">+</div>
			<bar :wrapper="'wrapper'">
				<tree :list="Clists" @changeTag="changeTag" @deleteTag="deleteTag" @addTag="addTag" @updateTag="updateTag"></tree><br />
			</bar>-->
		</div>
		<div class="flex-right">
			<div class="page_title">
				<template v-if="page.tag1===''">全部分类</template>
				<template v-if="page.tag1===0">未分类</template>
				<template v-if="page.tag1">
					{{classify_index[page.tag1].name}}<span v-if="classify_index[page.tag2]"> / {{classify_index[page.tag2].name}}</span>
				</template>
			</div>
            <div class="input-group search_wrap clearfix" v-if="total>=0 || prev_page.q!=''">
                <Input v-model="page.q" size="small" @on-enter.prevent='searchs(1)' placeholder="请输入搜索内容">
                <Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
                    <Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
                </Select>
                <Button slot="append" icon="search" @click="searchs(1)"></Button>
                </Input>
                <button v-authority="'训练模型'" class="my-btn my-btn-info-f pull-right" @click="()=>{if($root.$children[0].训练模型信息.status==0) $root.$children[0].训练模型();}" v-html="$root.$children[0].训练模型信息.text[$root.$children[0].训练模型信息.status]" :class="'test'+$root.$children[0].训练模型信息.status"></button>
                <button @click="AUX.show_upload=true" class="my-btn my-btn-info-o pull-right">批量上传</button>
                <button @click="edit(0)" class="my-btn my-btn-info-o pull-right" v-authority="'机器人知识库-知识库-增加'">添加新问题</button>
            </div>
            <div class="table_wrap" v-if="total>0 || prev_page.q!=''">
                <div class="table4 simulate_table table_select">
                    <ul class="thead">
                        <li class="tr">
                            <div class="th"></div>
                            <div class="th">标准问题&ensp;<sort akey="question" :active="page.sort_filed=='question'" :status="page.sort" @click="changeFilterSort"></sort></div>
                            <div class="th">标准答案&ensp;<sort akey="answer" :active="page.sort_filed=='answer'" :status="page.sort" @click="changeFilterSort"></sort></div>
                            <div class="th">创建时间&ensp;<sort akey="created" :active="page.sort_filed=='created'" :status="page.sort" @click="changeFilterSort"></sort></div>
                            <div class="th">状态</div>
                            <div class="th">操作</div>
                        </li>
                    </ul>
                    <ul class="tbody">
                        <li class="tr" v-for="item in Qlists" :key="item.id" :class="{disable:!item.status,selected:选中.indexOf(item.id)!=-1,editing:item.id==editQuestion.id}" v-tap="()=>{if(选中.indexOf(item.id)==-1) edit(item.id);}">
                            <div class="td" @mousedown.stop>
									<span :class="选中.indexOf(item.id)!=-1?'is-checked el-checkbox__input':'el-checkbox__input'"
                                          @click.stop="()=>{if(选中.indexOf(item.id)!=-1){选中.splice(选中.indexOf(item.id),1);选中item.splice(选中.indexOf(item.id),1)}else{ 选中.push(item.id);选中item.push(item);}}">
										<span class="el-checkbox__inner"></span>
									</span>
								</div>
								<div class="td">
									<el-tooltip v-if="prev_page.q_filed=='question'" popper-class="black html" :open-delay="400" placement="top-start">
										<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,300)"></div>
										<div class="text" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></div>
									</el-tooltip>
									<el-tooltip v-else-if="prev_page.q_filed=='similar_question'"  popper-class="black html" :open-delay="400" placement="top-start">
										<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,'',300)"></div>
										<div class="text">
											<span v-if="prev_page.q!=''&&item.similar_question.indexOf(prev_page.q)>-1" class="keyt">[相似问题]</span>
											<span  v-html="item.question"></span>
										</div>
									</el-tooltip>
									<el-tooltip v-else-if="prev_page.q_filed==''" popper-class="black html" :open-delay="400" placement="top-start">
										<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,300)"></div>
										<div class="text">
											<span v-if="prev_page.q!=''&&item.similar_question.indexOf(prev_page.q)>-1" class="keyt">[相似问题]</span>
											<span  v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></span>
										</div>
									</el-tooltip>
                                    <el-tooltip v-else popper-class="black html" :open-delay="400" placement="top-start">
                                        <div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,'',300)"></div>
                                        <div class="text" v-html="$api.filterSerachStringAndLimitNum(item.question,'',20)">
                                        	
                                        </div>
                                    </el-tooltip>
								</div>
								<div class="td">
									<el-tooltip popper-class="black html" v-if="prev_page.q_filed=='answer'||prev_page.q_filed==''" :open-delay="400" placement="top-start">
										<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q,300)"></div>
										<p class="text" v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q,20)"></p>
									</el-tooltip>
									<el-tooltip v-else  popper-class="black html" :open-delay="400" placement="top-start">
										<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.answer,'',300)"></div>
										<p class="text" v-html="item.answer"></p>
									</el-tooltip>
								</div>
								<div class="td" :title="item.created">
									{{$api.dateFormat('yyyy-MM-dd',item.created) }}
								</div>
								<div class="td" @mousedown.stop>
									<span v-show="!item.status" v-authority="'机器人知识库-知识库-启用'" class="status-disable pointer" @click.stop="able(1,item.id)">禁用</span>
									<span v-show="item.status" v-authority="'机器人知识库-知识库-禁用'" class="status-using pointer" @click.stop="able(0,item.id)">启用</span>
								</div>
								<div class="td" @mousedown.stop>
									<p class="operate">
										<span class="operate-edit pointer" @click.stop="edit(item.id)" v-authority="'机器人知识库-知识库-修改'">编辑</span>&nbsp;
										<span class="operate-remove pointer" @click.stop="del(item)" v-authority="'机器人知识库-知识库-删除'">删除</span>
									</p>
								</div>
							</li>
						</ul>
						<ul class="tfoot" v-if="Qlists.length>0">
							<li class="tr">
								<div class="td">
									<span @click="全选()" :class="选中.length==Qlists.length?'is-checked el-checkbox__input':'el-checkbox__input'">
										<span class="el-checkbox__inner"></span>
									</span>
                                <span @click="全选()" class="check-txt pointer unselect">全选</span>
                                <button v-show="选中.length!=0" @click="del()" v-authority="'机器人知识库-知识库-删除'" class="my-btn my-btn-primary">删除</button>
                            </div>
                            <div class="td text-right" v-show="选中.length!=0">
                                <button @click="correlation()" class="my-btn my-btn-info-o marg_l_10">关联选中问题
                            	</button><button @click="able(1)" v-authority="'机器人知识库-知识库-禁用'" class="my-btn my-btn-info-o marg_l_10">启用
                                </button><button @click="able(0)" v-authority="'机器人知识库-知识库-禁用'" class="my-btn my-btn-info-o marg_l_10">禁用</button>
                            </div>
                        </li>
                    </ul>
                </div><br />
                <div class="pagination_wrap text-center" v-if="total>0">
                    <el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
                    <!--<pagination :page="page" :total="total" :searchString='prev_page.q' v-on:pageTurn="pageTurn"></pagination>-->
                </div><br />
            </div>
			<div v-else class="empty_table">
				<img src="../../assets/img/add_icon.png" @click="edit(0)" class="pointer"/>
			</div>
		</div>

		<question-modal :question="editQuestion" :tags="Clists" v-model="AUX.show_modal_info" @successHandler="submitSuccess"></question-modal>
		<question-modal :title="{merge:'问题关联编辑'}" type="merge" :question="editQuestion" :tags="Clists" v-model="AUX.show_modal_info2" @successHandler="submitSuccess"></question-modal>

		<!--上传和模板-->
		<el-dialog title="上传文件" v-model="AUX.show_upload" size="" >
				<div class="upload_dialog_list">
					<span @click="$api.downloadFromService('知识库导入模板.xlsx',$uri.静态文件baseurl+'/知识库导入模板.xlsx')" class="displayIB">
				  		<i class="glyphicon glyphicon-download font50" ></i><br />
				  		下载模板
				  	</span>
		    		<upload :action="$uri.knowledgeStore.postfile" :type="'post'" :accept="upload.type" :success="uploadSuccess" :error="uploadError_mixin" :before="beforeUpload_mixin">
				    	<div :title="'请上传'+upload.type+'文件'" class="text-center">
				    		<i class="glyphicon glyphicon-upload font50"></i><br />
				    	</div>
				    	<p>导入</p>
				    </upload>
				</div>
		</el-dialog>
	</div>
</template>
<script>
	import VueFileUpload from 'vue-file-upload'
	import bar from '../module/自定义滚动条.vue'
	import leftAside from '../module/left-aside.vue'
	import tree from '../module/tree'
	import questionModal from './modules/edit_question'
	import sort from '../module/表排序箭头'
	import { Modal, ProgressBar, Dropdown, Tooltip } from 'uiv'
	import pagination from '../module/pagination'
	import handler from './mixin.js'
	import upload from '../module/upload'
	import upload_mixin from '../module/upload_mixin.js'
export default {
	mixins: [handler, upload_mixin],
	data() {
		var validate1 = (rule, value, callback) => {
			if(value && value.indexOf('$') != -1) {
				callback(new Error("不允许使用'$'字符"));
			} else {
				callback();
			}
		};
	  	var validate2 = (rule, value, callback) => {
	  		let isObjEmpty = function(obj){
  				for(let i in obj) return false;
  				return true;
  			}
	  		if(isObjEmpty(this.editQuestion.rich_answer)&&!value){
  				callback(new Error("请输入标准答案"));
  			}else{
  				callback();
  			}
	  	};
		return {

			show_dropdown: false,
			rich_index: 0,
			Qlists: [],
			Clists: [{
				name: '全部分类',
				id: ""
			}, {
				name: '未分类',
				id: 0
			}],
			classify_index:{},     //分类id的索引
			total: 0,
			page: {
				page: 1,
				size: 16,
				q: '',
				tag1: '',
				tag2: '',
				sort_filed: 'created',
				sort: -1,
				q_filed: '',
				q_name: '',
			},
			prev_page: '',
			editQuestion: {},
			选中: [], //需要关联的问题集
			选中item: [],
			tag2List: [],
			upload: {
				type: '|xls|xlsx',
			},
			AUX: {
				filterKeys:[
					{ label:'全部',value:'' },
					{ label:'标准问题',value:'question' },
					{ label:'相似问题',value:'similar_question' },
					{ label:'标准答案',value:'answer' },
				],
				show_upload: false,
				show_modal_info: false,
				show_modal_info2: false,
			},
		}
	},
	created() {
		var v = this;
		v.editQuestion = v.genQuestion();
		this.searchs();
		this.getClassifyList();
	},

	methods: {
		genQuestion(){
			return {
				merge_ids:[],
	      		id: '',
	      		tag1: 0,
	      		tag2: null,
	      		question: '',
	      		similar_question:[""],
	      		answer:[""],
	      		rich_answer:[],
	      		points:[],
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
		getClassifyList() {
			var v = this;
			this.$api.ajax(v.$uri.knowledgeStore.knowledge.tags, 'get').then(function(r) {
				v.Clists = v.Clists.slice(0, 2);
				r.forEach((val,i) => {
					v.classify_index[val.id] = val;
					val.edit = false;
					val.copy = val.name;
					val.child.forEach((val2,j) => {
						v.classify_index[val2.id] =val2;
						val2.edit = false;
						val2.copy = val2.name;
					});
					v.Clists.push(val);
				});
			})
		},

		updateTag(i, j=undefined) {
			console.log('update', i, j)
			var v = this;
			var list = j != undefined ? v.Clists[i].child : v.Clists;
			var index3 = j != undefined ? j : i;
			for(let x = 0; x < list.length; x++) {
				if(x != index3 && list[x].name.trim() == list[index3].copy.trim()) {
					this.$message({
						message: "分类名重复了",
						type: 'warning'
					});
					return false;
				}
			}
			if(j == undefined) {
				if(v.Clists[i].copy.trim() !== '') {
					if(!v.Clists[i].id) {
						this.$api.ajax('/questions/tags', 'post', {
								pid: 0,
								name: v.Clists[i].copy.trim()
							})
							.then(function(data) {
								/*var item = {id:data,name:v.Clists[i].name,child:[],edit:false};
								v.Clists.shift();
								v.Clists.unshift(item);*/
								v.Clists[i].id = data;
								v.Clists[i].name = v.Clists[i].copy.trim();
								v.Clists[i].edit = false;
								//维护索引
								v.classify_index[data] = v.Clists[i];
							})
					} else {
						this.$api.ajax('/questions/tags/' + v.Clists[i].id, 'put', {
								pid: 0,
								name: v.Clists[i].copy.trim()
							})
							.then(function(data) {
								v.Clists[i].edit = false;
								v.Clists[i].name = v.Clists[i].copy.trim();
							})
					}
				}
			} else {
				if(v.Clists[i].child[j].copy.trim() !== '') {
					if(!v.Clists[i].child[j].id) {
						this.$api.ajax('/questions/tags', 'post', {
								pid: v.Clists[i].id,
								name: v.Clists[i].child[j].copy.trim()
							})
							.then(function(data) {
								v.Clists[i].child[j].id = data;
								v.Clists[i].child[j].name = v.Clists[i].child[j].copy.trim();
								v.Clists[i].child[j].edit = false;
								//维护索引
								v.classify_index[data] = v.Clists[i].child[j];
							})
					} else {
						this.$api.ajax('/questions/tags/' + v.Clists[i].child[j].id, 'put', {
								pid: v.Clists[i].id,
								name: v.Clists[i].child[j].copy.trim()
							})
							.then(function(data) {
								v.Clists[i].child[j].edit = false;
								v.Clists[i].child[j].name = v.Clists[i].child[j].copy.trim();
							})
					}
				}
			}
		},
		deleteTag(i, j = undefined) {
			var v = this;
			var id = j == undefined ? v.Clists[i].id : v.Clists[i].child[j].id;
			var name = j == undefined ? v.Clists[i].name : v.Clists[i].child[j].name;
			v.$confirm('确定要删除分类："' + name + '"?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$api.ajax('/questions/tags/' + id, 'delete')
					.then(data => {
						if(j == undefined) {
							v.Clists.splice(i, 1);
						} else {
							v.Clists[i].child.splice(j, 1);
						}
						if(id == v.page.tag1 || id == v.page.tag2) {
							if(id == v.page.tag2)
								v.page.tag2 = '';
							if(id == v.page.tag1)
								v.page.tag1 = '';
							v.searchs(1);
						}
					})
			});
		},
		addTag(i = undefined) {
		    let list =  i ? this.Clists[i].child : this.Clists
            let haveBlank = list.some((val) => {
                return val.name.trim() === ''
            })
            // 没有空白分类才可添加新分类
            if (!haveBlank) {
		        if (i) {
                    list.unshift({
                        name: '',
                        copy: '',
                        edit: true,
                        id: '',
                    })
                } else {
                    list.splice(2, i, {
                        name: '',
                        copy: '',
                        edit: true,
                        id: '',
                        child: [],
                    })
                }
            }
		},
		changeTag(i, j = '') {
			this.page.tag1 = i;
			this.page.tag2 = j;
			this.searchs();
		},
		beforeSearchs() {
			this.选中 = [];
			this.选中item = [];
		},
		changeFilterKey(filter){
			let v = this;
			v.page.q_filed=filter.value;
			v.page.q_name=filter.name;
			v.searchs(1);
		},
		changeFilterSort(akey,isactive,status){
			this.page.sort_filed = akey;
			this.page.sort = 0-this.page.sort;
			this.searchs();
		},
		//问题管理函数
		searchs(index) {
			var v = this;
			v.beforeSearchs();
			if(index) v.page.page = index;
			this.$api.ajax('/questions', 'get', v.page).then(function(r) {
				v.Qlists = r.list;
				v.total = r.total;
				//记录本次的搜索条件
				v.prev_page = v.$api.deepCopy(v.page);
				v.选中 = [];
				v.选中item = [];
			});
	  	},
	  	edit:function(id){
	  		var v = this;
	  		if(id){
	  			this.$api.ajax('/questions/'+id,'get').then(function (r) {

				 	v.editQuestion.id=r.id
		      		v.editQuestion.tag1=r.tag1
		      		v.editQuestion.tag2=r.tag2
		      		v.editQuestion.question=r.question
		      		v.editQuestion.points=r.points
		      		v.editQuestion.similar_question=r.similar_question
		      		v.editQuestion.answer=r.answer;
		      		v.editQuestion.rich_answer = r.rich_answer;
		      		v.editQuestion.updated = r.updated;
		      		v.editQuestion.merge_ids = [];
		      		v.AUX.show_modal_info2 = false;
				 	v.AUX.show_modal_info = true;
				 	// 格式化rich_answer
				 	let question = v.editQuestion
				 	for(var i=0;i<question.rich_answer.length;i++){
			  			let rich_answer = question.rich_answer[i]
			  			rich_answer["id"] = Date.now()
			  		}
				})
	  		}else{
	  			v.editQuestion = v.genQuestion();
	  			v.AUX.show_modal_info = true;
	  		}
	  	},
	  	submitSuccess(question){
	  		this.searchs();
	  	},

		//关联选中问题
		correlation() {
			var v = this;
			var item = v.$api.deepCopy(v.选中item);
			var id = v.$api.deepCopy(v.选中);
			v.editQuestion = v.genQuestion();
			v.editQuestion.similar_question = [];
			v.editQuestion.answer = [];
			item.forEach((val,i)=>{
				v.editQuestion.merge_ids.push(val.id);
				if(i==0){
					v.editQuestion.question = val.question;
				}else{
					v.editQuestion.similar_question.push(val.question);
				}
				v.editQuestion.similar_question = v.editQuestion.similar_question.concat(val.similar_question.split("$$").filter(val=>val.trim()!==''));
				v.editQuestion.answer = v.editQuestion.answer.concat(val.answer.split("$$").filter(val=>val.trim()!==''));
				v.editQuestion.rich_answer = v.editQuestion.rich_answer.concat(val.rich_answer);
				v.editQuestion.points = v.editQuestion.points.concat(val.points);
			})
			//去重
			v.editQuestion.similar_question = [...new Set(v.editQuestion.similar_question)];
			v.editQuestion.answer = [...new Set(v.editQuestion.answer)];
			v.editQuestion.points = [...new Set(v.editQuestion.points)];
			v.AUX.show_modal_info = false;
			v.AUX.show_modal_info2 = true;
		},
		//提交关联
		submit2() {
			var content = '',
				v = this;
			let question = v.$api.deepCopy(v.editQuestion);
			delete question.type;
			delete question.advanced_options; //暂时
			for(var i = 0; i < this.选中item.length; i++) {
				if(this.选中item[i].id != question.id) {
					content += '"' + this.选中item[i].question + '"\n'
				}
			}
			var data = {
				content: '你将关联这些问题' + content + '到"' + question.question + '",并删除这些问题',
				others: '',
				cb: 'correlat',
			};
			this.$confirm('你将关联这些问题' + content + '到"' + question.question + '",并删除这些问题', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				var [x, y] = v.$api.validate(questionStore, question);
				if(!x) {
					v.$message({
						type: 'error',
						message: y
					});
					return false;
				}
				v.$api.ajax('/questions/' + question.id, 'put', question).then(function(r) {
					v.AUX.show_modal_info2 = false;
					v.选中 = [];
					v.选中item = [];
					v.$message({
						type: 'success',
						message: '关联成功!'
					});
					v.searchs();
				})
				for(var i = 0; i < v.选中.length; i++) {
					if(v.选中[i] != question.id) {
						v.$api.ajax('/questions/' + v.选中[i], 'delete').then(function(r) {
							v.searchs();

						})
					}
				}
			});
		},
		able(status, id) {
			var v = this,
				ids = [],
				successMsg = status == 0 ? '禁用' : '启用';
			if(id) ids.push(id);
			else ids = v.选中;
			v.$api.ajax('/questions/batch', 'put', {
					ids: ids,
					status: status
				})
				.then(data => {
					v.$message({
						type: 'success',
						message: successMsg + '成功!'
					});
					v.searchs();
					v.选中 = [];
				})
		},
		del(item) {
			var v = this;
			let info = item ? `确定要删除问题"${item.question}"吗?` : `确定要删除选中问题吗?`;
			let uri = item ? '/questions/' + item.id : '/questions';
			this.$confirm(info, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				v.$api.ajax(uri, 'delete', {
					data: {
						ids: v.选中
					}
				}).then(function(r) {
					v.$message({
						type: 'success',
						message: '删除成功!'
					});
					v.searchs();
				})
			});
		},
		pageTurn: function() {
			this.searchs();
		},
		全选() {
			let v = this;
			if(v.选中.length !== v.Qlists.length) {
				v.选中 = [];
				v.选中item = [];
				v.选中 = v.Qlists.map((val) => {
					return val.id;
				});
				v.选中item = v.Qlists.map(val => {
					return val;
				});
			} else {
				v.选中 = [];
				v.选中item = [];
			}
		},
		uploadSuccess(res) {    console.log(res)
			this.uploadSuccess_mixin(res);
			this.AUX.show_upload = false;
			this.page.sort_filed='created',
	      	this.page.sort=-1,
			this.searchs(1);
			this.getClassifyList();
		},
     	input_focus(val, event){
     		val.disabled = false;
     		let textarea = event.target.previousElementSibling.firstChild;
     		textarea.removeAttribute("disabled")
     		textarea.focus();

     		// el.focus()
     	}

	},
	components: {
		Modal,
		ProgressBar,
		upload,
		tree,
		pagination,
		Dropdown,
		Tooltip,
		bar,
		sort,
		questionModal,
		leftAside,
	},
	watch:{

	}
}
</script>
<style lang="scss" scoped="">
	@import '../../assets/scss/api.scss';
	$color1:#bfe2ff;
	$th_widths:(0.3,0.36,0.15,0.08,0.11);
.store {
	position: relative;
	height:100%;
	.simulate_table {
		@include simulateTableThWidth($th_widths,true);
	}
	.empty_table{
		width:100%; height:80%;
		position: relative;
		img {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
		}
	}

}
.keyt {
		color: #ffb400;
		font-weight: bold;
	}
.wrap {
	display: flex;
	position: relative;
}

.classify-table .wrap .el-dialog__body {
	padding-top: auto;
}


classify::-webkit-scrollbar {
	width: 1px;
	background: red;
}

.serach_wrap .train1 {
	background: #0082E6;
	color: #fff;
}

.serach_wrap .train1 i {
	transform: rotateY(45deg);
}

.form-group-special {
	margin: 5px 0;
}

.form-control.input-special-90 {
	width: 90%;
	display: inline-block;
}

.fileupload-button[data-v-9261aca0].update-btn {
	background-color: #ffc156;
	color: #000;
	border: none;
}


.tooltip {
	background: #transparent;
}

.tooltip.fade.in {
	opacity: 1;
}

.tooltip .tooltip-inner {
	background-color: #787878;
	background: #787878;
	color: #fff;
	font-size: 13px;
	;
	max-width: 300px;
	text-align: left;
	opacity: 0.9;
}

.tooltip.top.fade .tooltip-arrow {
	border-top-color: #787878;
	opacity: 0.9;
}



.correlation-body .similar-question {
	position: relative;
	background: #DCF2FD;
	padding: 5px 7px;
	margin: 0 10px 10px 0;
	display:inline-block;
}

.correlation-body .similar-question .close {
	position: absolute;
	top: -6px;
	right: -6px;
	display: block;
	width: 15px;
	height: 15px;
	font-size: 14px;
	font-weight: 100;
	color: #fff;
	text-align: center;
	line-height: 15px;
	background: #9CD9F8;
	border-radius: 20px;
	opacity: 1;
}
</style>
