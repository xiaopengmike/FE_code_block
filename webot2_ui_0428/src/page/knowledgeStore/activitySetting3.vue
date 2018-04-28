<template>
	<div class="knowledgestore activitySetting flex flex-2">
		<div class="flex-left">
			<left-aside type="classify" :width="185">
				<template slot="title">
					活动配置
				</template>
				<template slot="content">
					<div class="addTag" @click="addTag()"><i class="fa fa-plus"></i>&thinsp;添加活动</div>
						<tree :list="tags" :series="2" @changeTag="changeTag" @deleteTag="deleteTag" @updateTag="updateTag" @copyTag="copyTag" @beforeEditTag="beforeEditTag"></tree><br />
				</template>
			</left-aside>
			<!--<div class="addTag" @click="addTag">+</div>
			<bar :wrapper="'wrapper'">
				<tree :list='tags' :series="2" @changeTag="changeTag" @updateTag="updateTag" @deleteTag="deleteTag" @copyTag="copyTag" @beforeEditTag="beforeEditTag"></tree>
			</bar>-->
		</div>	
		<div class="flex-right">
			<div class="page_title">
				<template v-if="page.activity">
					{{ currentTag.name }}
					<el-date-picker class="_my-date-picker pull-right" size="small"  v-model="currentTag_time" type="datetimerange" format="yyyy年MM月dd日 HH:mm" :clearable="false"> </el-date-picker>
				</template>
			</div>
			<div class="">
				<div class="input-group search_wrap clearfix">
				    <Input v-model="page.q" size="small" @on-enter.prevent='searchs(1)' placeholder="请输入搜索内容">
					    <Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
					        <Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
					    </Select>
					    <Button slot="append" icon="search" @click="searchs(1)"></Button>
				    </Input>
				    <button v-authority="'训练模型'" class="my-btn my-btn-info-f pull-right" @click="()=>{if($root.$children[0].训练模型信息.status==0) $root.$children[0].训练模型();}" v-html="$root.$children[0].训练模型信息.text[$root.$children[0].训练模型信息.status]" :class="'test'+$root.$children[0].训练模型信息.status"></button>
	            	<button @click="edit(false)" class="my-btn my-btn-info-o pull-right">添加新问题</button>
			    </div>
				<div class="table_wrap">
					<div class="table4 simulate_table table_select">
						<ul class="thead">
							<li class="tr">
								<div class="th"></div>
								<div class="th">标准问题</div>
								<div class="th">标准答案</div>
								<div class="th">创建时间</div>
								<div class="th">状态</div>
								<div class="th">操作</div>
							</li>
						</ul>
						<ul class="tbody">
							<li class="tr"  v-for="(item,i) in list" :key="item.id" :class="{selected:选中.indexOf(item.id)!=-1,editing:item.id==editQuestion.id}" v-tap="()=>{if(选中.indexOf(item.id)==-1) edit(item.id,item.activity);}" click="">
								<div class="td" @mousedown.stop>
									<span :class="选中.indexOf(item.id)!=-1?'is-checked el-checkbox__input':'el-checkbox__input'" @click.stop="()=>{if(选中.indexOf(item.id)!=-1){选中.splice(选中.indexOf(item.id),1)}else{ 选中.push(item.id)}}">
										<span class="el-checkbox__inner"></span>
									</span>
								</div>
								<div class="td">
									<el-tooltip v-if="prev_page.q_filed=='question'" popper-class="black html" :open-delay="400" placement="top-start">
										<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,300)"></div>
										<p class="text" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></p>
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
                                        <div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,300)"></div>
                                        <p class="text" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></p>
                                    </el-tooltip>
								</div>
								<div class="td">
									<tooltip v-if="prev_page.q_filed=='answer'||prev_page.q_filed==''" :open-delay="400">
										<div slot="content">
											<span  v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q,300)"></span>
										</div>
										<p class="text" v-html="filterSerachStringAndLimitNum(item.answer,prev_page.q,18)"></p>
									</tooltip>
									<tooltip v-else :open-delay="400">
										<div slot="content">
											{{filterSerachStringAndLimitNum(item.answer,'',300)}}
										</div>
										<p class="text" v-html="item.answer"></p>
									</tooltip>
								</div>
								<div class="td" :title="item.created">{{$api.dateFormat('yyyy-MM-dd',item.created) }}</div>
								<div class="td" @mousedown.stop>
									<span @click="forbidden(item);" v-if="item.advanced_options.switch===0" class="status-disable pointer">禁用</span>
									<!--<span v-if="(item.advanced_options.switch===1&&new Date(item.advanced_options.valid_end).getTime()<new Date().getTime())">启用</span>
									<span @click.stop="forbidden(item);" v-if="(item.advanced_options.switch===1&&new Date(item.advanced_options.valid_end).getTime()>=new Date().getTime())" :class="new Date(item.advanced_options.valid_start).getTime()<=Date.now()?'c1':''" class="operate-using pointer">启用</span>-->
									<span v-if="item.advanced_options.switch===1&&new Date(editTag2.end).getTime()<new Date().getTime()">启用</span>
									<span @click="forbidden(item);" v-if="item.advanced_options.switch===1&&new Date(editTag2.end).getTime()>=new Date().getTime()" class="status-using pointer">启用</span>
								</div>
								<div class="td" @mousedown.stop>
									<p class="operate">
										<span class="operate-edit pointer" @click.stop="edit(item.id,item.activity)" v-authority="'机器人知识库-活动配置-修改'">编辑</span>&nbsp;
										<span class="operate-remove pointer" @click.stop="del(item)" v-authority="'机器人知识库-活动配置-删除'">删除</span>
									</p>
								</div>
							</li>
						</ul>
						<ul class="tfoot" v-show="list.length>0">
							<li class="tr">
								<div class="td">
									<span @click="全选()" :class="选中.length==list.length?'is-checked el-checkbox__input':'el-checkbox__input'">
										<span class="el-checkbox__inner"></span>
									</span>
									<span @click="全选()" class="check-txt pointer unselect">全选</span> 
								</div>
								<div class="td">
									<el-button v-if="选中.length>0" @click="del(false)" size="small">删除</el-button>
								</div>
							</li>
						</ul>
					</div>
				</div><br />
				<div class="pagination_wrap text-center" v-if="total>0">
					<!--<pagination :page="page" :total="total" :searchString='prev_page.q' v-on:pageTurn="pageTurn"></pagination>-->
					<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
				</div>
			</div>
		</div>
		<Modal title="编辑活动" v-model="editTag.show">
		  	<div class="edit-tag">
		  		<el-row>
				  	<el-col :span="5" >活动名字</el-col>
				  	<el-col :span="19"><el-input v-model="editTag.name"></el-input></el-col>
				</el-row><br />
				<el-row>
				  	<el-col :span="5" >活动时间</el-col>
				  	<el-col :span="19">
				  		<el-date-picker v-model="editTag.time" type="daterange" format="yyyy年M月d日  HH:mm"></el-date-picker>
				  		<!--<el-date-picker v-if="editTag.pid=='undo'" v-model="editTag.time" type="datetimerange" format="yyyy年M月d日  HH:mm" :picker-options="pickerOptions4"></el-date-picker>
				  		<el-date-picker v-if="editTag.pid=='done'" v-model="editTag.time" type="datetimerange" format="yyyy年M月d日  HH:mm" :picker-options="pickerOptions5"></el-date-picker>-->
				  	</el-col>
				</el-row>
				<el-row><br />
					<el-col :offset="5">
						<span :class="editTag.pid=='doing'?'c_13a0e3':''" >进行中</span>&emsp;
						<span :class="editTag.pid=='undo'?'c_13a0e3':''">未开始</span>&emsp;
						<span :class="editTag.pid=='done'?'c_13a0e3':''">已过期</span>
					</el-col>
				</el-row>
		  	</div>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="editTag.show = false">取 消</el-button>
			    <el-button type="primary" @click="updateTag" :disabled="editTag.name==''||editTag.time==''||editTag.time[0]==null?true:false">确 定</el-button>
			  </div>
		</Modal>
		
		<my-modals v-model="AUX.show_edit" >
			<span slot="title">
				编辑活动
			</span>
			<div slot="content"  class="modal-body">
				<div>
					<b :class="editQuestion.type==0?'c_13a0e3':''" @click="editQuestion.type=0" class="pointer font15">普通选项</b>&emsp;&emsp;
					<b :class="editQuestion.type==1?'c_13a0e3':''" @click="editQuestion.type=1" class="pointer font15">高级选项</b>&emsp;<small class="explain">（高级选项暂时无法配置）</small>
				</div><br />
				<el-form :model="editQuestion" :rules="editQuestion_rules" ref="editQuestion"  class="small_modals">
					<div v-show="editQuestion.type==0">
						<el-form-item label="标准问题" prop="question" >
							<el-input v-model="editQuestion.question"></el-input>
						</el-form-item>
						<el-form-item label="活动" prop="activity" >
							<el-select v-model="editQuestion.activity" placeholder="">
								<el-option-group v-for="t1 in tags" :label="t1.name" v-if="t1.id!=0">
							        <el-option v-for="t2 in t1.child" :value="t2.id" :label="t2.name"> </el-option>
							    </el-option-group>
							</el-select>
						</el-form-item>
						<el-form-item v-for="(val,index) in editQuestion.similar_question"  :prop="'similar_question.'+index" :label="index==0?'相似问题':''" :rules="editQuestion_rules.similar_question" >
								<el-col :span="22">
									<el-input v-model="editQuestion.similar_question[index]"></el-input>
								</el-col>
								<el-col :span="1" :offset="1">
									<i class="el-icon-close pointer" @click="editQuestion.similar_question.splice(index,1)"></i>
								</el-col>
						</el-form-item>
						<el-form-item  :label="editQuestion.similar_question.length!=0?'':'相似问题'">
							<span class="text-info col-sm-offset-3 pointer" @click="editQuestion.similar_question.push('')" >添加相似问题</span>
						</el-form-item>
						<el-form-item v-for=" (val,index) in editQuestion.answer" :prop="'answer.'+index"  :label="index==0?'标准回答':''" :rules="editQuestion_rules.answer" >
								<el-col :span="22">
									<el-input type="textarea" v-model="editQuestion.answer[index]" ></el-input>
								</el-col>
								<el-col :span="1" :offset="1">
									<i v-if="editQuestion.answer.length!=1" class="el-icon-close pointer" @click="editQuestion.answer.splice(index,1)"></i>
								</el-col>
						</el-form-item>
						<el-form-item  label="">
								<span class="text-info col-sm-offset-3 pointer" @click="editQuestion.answer.push('')" >添加标准回答</span>
						</el-form-item>
					</div>
					<div v-show="editQuestion.type==1">
						<el-form-item label="定时启用" :rule="{ required:editQuestion.advanced_options.start_switch?true:false , message: '请输入邮箱地址', trigger: 'blur' }">
							<el-col :span="10">
								<div class="switch">
									<span :class="editQuestion.advanced_options.start_switch?'color1':''" @click="editQuestion.advanced_options.start_switch=1">开
									</span><span :class="editQuestion.advanced_options.start_switch?'':'color2'" @click="editQuestion.advanced_options.start_switch=0">关</span>
								</div>
							</el-col>
							<el-col :span="10">
								<el-date-picker v-model="editQuestion.advanced_options.valid_start" type="datetime" format="yyyy年M月d日  HH:mm" :picker-options="pickerOptions3"></el-date-picker>
							</el-col>
						</el-form-item>
						<el-form-item label="定时禁用" >
							<el-col :span="10">
								<div class="switch">
									<span :class="editQuestion.advanced_options.end_switch?'color1':''" @click="editQuestion.advanced_options.end_switch=1">开
									</span><span :class="editQuestion.advanced_options.end_switch?'':'color2'" @click="editQuestion.advanced_options.end_switch=0">关</span>
								</div>
							</el-col>
							<el-col :span="10">
								<el-date-picker v-model="editQuestion.advanced_options.valid_end" type="datetime" format="yyyy年M月d日  HH:mm" :picker-options="pickerOptions4"></el-date-picker>
							</el-col>
						</el-form-item>
						<el-form-item label="优先级" >
							<div class="switch">
								<span :class="editQuestion.advanced_options.priority==1?'color3':''" @click="editQuestion.advanced_options.priority=1">低
								</span><span :class="editQuestion.advanced_options.priority==2?'color4':''" @click="editQuestion.advanced_options.priority=2">中
								</span><span :class="editQuestion.advanced_options.priority==3?'color5':''" @click="editQuestion.advanced_options.priority=3">高</span>
							</div>
						</el-form-item>
						<el-form-item label="关键词模式" >
							<div class="switch">
								<span :class="editQuestion.advanced_options.keyword_switch?'color1':''" @click="editQuestion.advanced_options.keyword_switch=1">开
								</span><span :class="editQuestion.advanced_options.keyword_switch?'':'color2'" @click="editQuestion.advanced_options.keyword_switch=0">关</span>
							</div>
						</el-form-item>
						<el-form-item label="触发警报" >
							<div class="switch">
								<span :class="editQuestion.advanced_options.warning_switch?'color1':''" @click="editQuestion.advanced_options.warning_switch=1">开
								</span><span :class="editQuestion.advanced_options.warning_switch?'':'color2'" @click="editQuestion.advanced_options.warning_switch=0">关</span>
							</div>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div slot="foot" class="dialog-footer">
			    <button class="my-btn my-btn-transparent" @click="AUX.show_edit = false">&emsp;取消&emsp;</button>
			    <button class="my-btn my-btn-info-f" @click="update(editQuestion)">&emsp;提交&emsp;</button>
			</div>
		</my-modals>
	</div>
</template>

<script>
	import bar from '../module/自定义滚动条.vue'
	import leftAside from '../module/left-aside.vue'
	import tree from './tree2.vue'
	import pagination from '../module/pagination.vue'
	import handler from './mixin.js'
	export default{
		mixins: [handler],
		data(){
			var validate1 = (rule, value, callback) => {
				if(value&&value.indexOf('$')!=-1){
					callback(new Error("不允许使用'$'字符"));
				}else{
					callback();
				}
		   };
			return {
				tags:[
					/*{id:0,name:'全部活动'}*/
					{id:'doing',name:'进行中',child:[],addChild:false},
					{id:'undo',name:'未开始',child:[],addChild:false},
					{id:'done',name:'已过期',child:[],addChild:false},
				],
				tags_len:0,                //分类长度
				page:{
					activity:'',
					q_name:'',
					q_filed:'',
					q:'',
					page:1,
					size:16,
				},
				prev_page:{
					q:'',
					q_filed:'',
				},
				total:0,
				list:[],
				editTag:{
					show:false,
					pid:'',
					name:'',
					id:'',
					time:'',
					start:'',
					end:'',
					index1:'',
					index2:'',
				},
				editTag2:{
					id:'',
					name:'',
					start:'',
					end:'',
					start2:'',
					end2:'',
				},
				editQuestion:{
					
				},
				editQuestion_rules:{
		      		question:[{required: true, message: '请输入标准问题', trigger: 'blur'}],
		      		activity:[{required: true, type:'number', message: '请选择活动', trigger: 'blur'}],
		      		similar_question:[
		      			{ validator: validate1}
		      		],
		      		answer:[
		      			{ validator: validate1 },
		      			{ required: true, message: '请输入标准答案', trigger: 'blur' },
		      		],
		      		
		      	},
		      	
				选中:[],
				//辅助显示
				AUX:{
					show_edit:false,
					filterKeys:[
						{value:'',label:'全部'},
						{value:'question',label:'标准问题'},
						{value:'similar_question',label:'相似问题'},
						{value:'answer',label:'标准答案'},
					],
				},
				show_dropdown:false,
				pickerOptions1: {
		          disabledDate:(time)=> { 
		          	if(this.editTag2.end!='')
		            	return time.getTime() > new Date(this.editTag2.end).getTime();
		          }
		        },
		        pickerOptions2: {
		          disabledDate:(time)=> {
		          	if(this.editTag2.start!='')
		            	return time.getTime() < new Date(this.editTag2.start).getTime();
		          }
		        },
		        pickerOptions3: {
		          disabledDate:(time)=> { 
		          	if(this.editQuestion.end!='')
		            	return time.getTime() > new Date(this.editQuestion.end).getTime();
		          }
		        },
		        pickerOptions4: {
		          disabledDate:(time)=> {
		          	if(this.editQuestion.start!='')
		            	return time.getTime() < new Date(this.editQuestion.start).getTime();
		          }
		        },
			}
			
		},
		created(){
			this.getTags();
			this.editQuestion = this.genQuestion();
		},
		computed:{
			currentTag(){
				let tag = {};
				for(let i in this.tags){
					tag = this.tags[i].child.find(val2=>val2.id == this.page.activity);
					if(tag){
						break;
					}
				}
				return tag || {};
			},
			currentTag_time:{
				get(){
					if(this.currentTag.start)
						return [new Date(this.currentTag.start).getTime(), new Date(this.currentTag.end).getTime()];
					else
						return [];
				},
				set(val){   
					let tag ={};
					tag.time = val;
					tag.name = this.currentTag.name;
					tag.id = this.currentTag.id;
					this.updateTag(tag);
				}
			}
		},
		methods:{
			beforeSearchs(){
				if(!this.page.activity){
					v.自动选择activity();
				}
				if(!this.page.activity) return false;
				this.选中 = [];
			},
			searchs(index=undefined){
				let v = this;
				v.beforeSearchs();
				if(index) v.page.page = index;
				let page = v.$api.deepCopy(v.page);
				v.$api.ajax(v.$uri.knowledgeStore.活动知识,'get',page)
				.then(data=>{
					data.list.forEach(val=>{
						if(val.advanced_options!==''){
							while(typeof val.advanced_options == 'string' ){
								try{
									val.advanced_options = JSON.parse(val.advanced_options)
								}catch(e){
									break;
								}
							}
						}         
					})
					v.list = data.list;
					v.total = data.total;
					v.prev_page.q = page.q;
				})
			},
			getTags(){
				let v= this;
				v.$api.ajax(v.$uri.knowledgeStore.活动类型,'get')
				.then(data=>{  
					
					for(let i in data){
						for(let j=0; j<v.tags.length;j++){
							if(i == v.tags[j].id){
								v.tags[j].child = data[i].map((val,k)=>{
									val.copy = val.name;
									val.edit = false;
									return val;
								})
							}
						}
					}
					v.自动选择activity();
				})
			},
			genQuestion(){
				return {
					type:'0',
					id:'',
					activity:'',
					question:'',
					answer:[''],
					similar_question:[''],
					advanced_options:{
						switch:1,
						priority:'',
						valid_start:'',
						valid_end:'',
						start_switch:'',
						end_switch:'',
						keyword_switch:'',
						warning_switch:'',
					}
				}
			},
			自动选择activity(){
				let v = this;
				for(let i=0;i<3;i++){
					if(v.tags[i].child.length>0){
						v.changeTag(i,0);
						break;
					}
				}
			},	
			changeTag(i,j=0){   
				let v = this;
				if(i==undefined) return;console.log(i,j)
				if(v.tags[i].child[j]){
					v.editTag2.id =  v.tags[i].child[j].id;
					v.editTag2.name = v.tags[i].child[j].name;
					v.editTag2.start = v.editTag2.start2 = v.tags[i].child[j].start;
					v.editTag2.end =v.editTag2.end2= v.tags[i].child[j].end;
					v.page.activity = v.tags[i].child[j].id;
					v.searchs(1);
				}else{
					v.list =[];
				}
				
			},
			updateTag(editTag){
				let v = this;
				let type = editTag.id?'put':'post'
				let data = {
					name:editTag.name,
					start:v.$api.dateFormat('yyyy-MM-dd hh:mm:ss',editTag.time[0]),
					end:v.$api.dateFormat('yyyy-MM-dd hh:mm:ss',editTag.time[1]),
				}
				if(editTag.id) data.id=editTag.id ;
				v.$api.ajax(v.$uri.knowledgeStore.活动类型,type,data)
				.then(result=>{
					v.editTag.show=false;
					v.getTags();
				})
			},
			updateTag2(){
				let v = this;
				let start=v.$api.dateFormat('yyyy-MM-dd hh:mm:ss',v.editTag2.time[0])
				let end=v.$api.dateFormat('yyyy-MM-dd hh:mm:ss',v.editTag2.time[1])
				let tag = v.$api.deepCopy(v.editTag2);
				tag.start = start;
				tag.end = end;
				delete tag.start2;
				delete tag.end2;
				v.$api.ajaxNoLoading(v.$uri.knowledgeStore.活动类型,'put',tag)
				.then(data=>{
					for(let i=0;i<v.tags.length;i++){
						for(let j=0;j<v.tags[i].chil.length;j++){
							if(v.tags[i].child[j].id = tag.id){
								v.tags[i].child[j].start = v.editTag2.start2 = tag.start;
								v.tags[i].child[j].end = v.editTag2.end2 = tag.end;
								break;
							}
						}
					}
				}).catch(err=>{
					v.editTag2.start = v.editTag2.start2;
					v.editTag2.end = v.editTag2.end2;
				});
			},
			deleteTag(i,j){
				let v = this;
				let tag = v.tags[i].child[j];
				this.$confirm(`确定要删除活动-‘${tag.name}’和其下的知识吗?`, '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
		        }).then(() => {
					v.$api.ajax(`${v.$uri.knowledgeStore.活动类型}/${tag.id}`,'delete')
					.then(data=>{
						v.tags[i].child.splice(j,1);  
						if(v.tags[i].child[j]){
							v.page.activity = v.tags[i].child[j].id;
							v.searchs(1);
						}
						else if(v.tags[i].child[j-1]){
							v.page.activity = v.tags[i].child[j-1].id;
							v.searchs(1);
						}else{
							let tag1 = v.tags.find(val=>val.child&&val.child.length>0);
							if(tag1){
								v.page.activity = tag1.child[0].id;
								v.searchs(1);
							}else{
								v.list=[];
								v.page.activity=null;
							}
						}
					})
				});
			},
			beforeEditTag(i,j){
				let v = this;
				v.tags[i].child[j].edit = false;
				this.editTag.index1=i;
				this.editTag.index2=j;
				this.editTag.id = this.tags[i].child[j].id;
				this.editTag.pid = this.tags[i].id;
				this.editTag.name = v.tags[i].child[j].name;
				this.editTag.time= [v.tags[i].child[j].start,v.tags[i].child[j].end];
				this.editTag.show=true;
			},
			addTag(i=undefined){
				let v = this;
				this.editTag.id = '';
				this.editTag.name = '';
				this.editTag.time="";
				this.editTag.index1='';
				this.editTag.index2='';
				this.editTag.show=true;
			},
			copyTag(i,j){
				let v = this;
				let tag = v.$api.deepCopy(v.tags[i].child[j]);
				v.$api.ajax(`${v.$uri.knowledgeStore.活动类型}/copy/${tag.id}`,'get')
				.then(data=>{
					tag.id = data.id;
					tag.name=tag.copy = data.name;
					v.tags[i].child.splice(j,0,tag);
				});
			},
			edit(id,activity=undefined){
				let v=this;
				v.editQuestion = this.genQuestion();
				v.editQuestion.id=id?id:'';
				if(id){
					v.$api.ajax(`${v.$uri.knowledgeStore.活动知识}/${id}`,'get',{activity:activity})
					.then(data=>{
						v.AUX.show_edit=true;      
						if(typeof data.advanced_options == 'string'){
							data.advanced_options = JSON.parse(data.advanced_options);
						}
						v.$api.deepCopy(data,v.editQuestion);
						if(v.editQuestion.answer.length>1)
							v.editQuestion.answer.forEach((val,i)=>{
								if(val==''){
									v.editQuestion.answer.splice(i,1)
								}
							})
						if(v.editQuestion.similar_question.length>1)
							v.editQuestion.similar_question.forEach((val,i)=>{
								if(val==''){
									v.editQuestion.similar_question.splice(i,1)
								}
							})
					})
				}else{
					v.AUX.show_edit=true;
				}
			},
			_filter_arr(arr){
				var _resp = []
				for(var i=0, len=arr.length; i<len; i++){
					if(arr[i] != "") _resp.push(arr[i]);
				}
				return _resp
			},
			_check_arr(arr){
				for(var i=0, len=arr.length; i<len; i++){
					if(arr[i] && arr[i].indexOf("$") != -1) return false;
				}
				return true
			},
			update(editquestion){                
				let v = this;
				this.$refs.editQuestion.validate((valid) => {
          			if (valid) {
          				let type = editquestion.id==''?'post':'put';
          				let uri = editquestion.id?v.$uri.knowledgeStore.活动知识+'/'+editquestion.id : v.$uri.knowledgeStore.活动知识;
          				editquestion.similar_question = this._filter_arr(editquestion.similar_question);
          				let question = v.$api.deepCopy(editquestion);
          				if(!question.id) delete question.id;
          				delete question.type;
          				v.$api.ajax(uri,type,question)
          				.then(data=>{
          					v.AUX.show_edit=false;
          					v.searchs();
          				})
          			}
          		});
				/*var [x,y] = v.$api.validate(activitySetting,editquestion);   console.log(x,y)
				var isOk = v._check_arr(editquestion.answer) && v._check_arr(editquestion.similar_question);
				var em =  isOk ? "" : "相似问题或标准回答中不允许使用'$'字符";
				if(!x || !isOk){
					v.$message({
		  				type: 'error',
			            message: y || em
			         });
					return false;
				}*/
			},
			//禁用与启用知识
			forbidden(question){
				let v  =this;
				while(typeof question.advanced_options =='string'){
					try{
						question.advanced_options = JSON.parse(question.advanced_options)
					}catch(err){
						break;
						console.log('高级设置出错',question.advanced_options);
					}
				}
				question.advanced_options.switch = question.advanced_options.switch?0:1;
				v.$api.ajax(v.$uri.knowledgeStore.活动知识+'/'+question.id,'put',question)
				.then(data=>{
					v.$message({
		  				type: 'success',
			            message: question.enabled?'启用成功':'禁用成功',
			        });
			        v.searchs();
				})
				.catch(err=>{
					v.$message({
		  				type: 'warning',
			            message: question.enabled?'启用失败':'禁用失败',
			        });
					question.advanced_options.switch = question.advanced_options.switch?0:1;
				})
			},
			del(item){
				let v = this;
				let info = item?`确定要删除知识"${item.question}"吗?`:`确定要删除选中知识吗?`;
  				let uri = v.$uri.knowledgeStore.活动知识;
				this.$confirm(info, '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
		        }).then(() => {
			        if(item){
			        	v.$api.ajax(uri+'/'+item.id,'delete')
						.then(data=>{
							v.$message({
				  				type: 'success',
					            message: '删除成功'
					         });
							v.searchs();
						});
			        }else{
			        	v.$api.ajax(uri,'delete',{data:{ids:v.选中}})
						.then(data=>{
							v.$message({
				  				type: 'success',
					            message: '删除成功'
					         });
							v.searchs();
						});
		        	}
				});
			},
			pageTurn(index){
				this.searchs(index);
			},
			全选(){
				let v = this;
				if(v.选中.length!==v.list.length){
					v.选中=[];
					v.选中 = v.list.map((val)=>{
						return val.id;
					})
				}else{
					v.选中=[];
				}
			},
			//辅助显示（查询活动）
			filterActivity(id){
				let v = this;
				for(let i=0;i<v.tags.length;i++){
					for(let j=0;j<v.tags[i].child.length;j++){
						if(v.tags[i].child[j].id == id){
							return v.tags[i].child[j].name;
						}
					}
				}
			},
		},
		components:{
			tree,pagination,bar,
			leftAside,
		},
		watch:{
			'editTag.time':function(n){
				if(n==''||n[0]==''||n[1]==''){
					this.editTag.pid = '';
				}else{
					let now = Date.now();
					let start = new Date(n[0]).getTime();
					let end = new Date(n[1]).getTime();
					if(now<start && now<end){
						this.editTag.pid = 'undo';
					}
					if(now>=start && now<=end){
						this.editTag.pid = 'doing';
					}
					if(now>start && now>end){
						this.editTag.pid = 'done';
					}
				}
			},
			'editQuestion.activity':function(n){
				if(!n) return ;
				for(let i=0;i<this.tags.length;i++){
					if(this.tags[i].child){
						for(let j=0;j<this.tags[i].child.length;j++){
							if(this.tags[i].child[j].id == n){
								if(this.editQuestion.advanced_options===''||this.$api.isEmptyObj(this.editQuestion.advanced_options))
									this.editQuestion.advanced_options = {};
								this.editQuestion.advanced_options.valid_start = this.tags[i].child[j].start;
								this.editQuestion.advanced_options.valid_end = this.tags[i].child[j].end;
								break;
							}
						}
					}
				}
			},
			'AUX.show_edit':function(n){         
				if(!n){
					this.editQuestion.type=0;
					this.editQuestion.activity='';
					this.editQuestion.question='';
					this.editQuestion.answer=[''];
					this.editQuestion.similar_question=[''];
					this.editQuestion.advanced_options.priority='';
					this.editQuestion.advanced_options.start_switch='';
					this.editQuestion.advanced_options.end_switch='';
					this.editQuestion.advanced_options.keyword_switch='';
					this.editQuestion.advanced_options.warning_switch='';
				}else{
					this.editQuestion.activity=this.page.activity;
				}
			},
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style lang="scss">
	@import '../../assets/scss/api.scss';
	$color2:#ccc;
	$color3:#4cd23a;$color4:#f8ba43;$color5:#f06869;
	$color6:#feb312;
	$color1:#bfe2ff;
	$th_widths:(0.30,0.36,0.15,0.08,0.11);
.activitySetting {
	position: relative;
	height:100%;
	.classify {
		width:185px;
	}
	.simulate_table {
		@include simulateTableThWidth($th_widths,true);
	}
	.empty_table img {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}
	
	.classify_part .addTag{width:78%; color:#bbb;line-height:28px; border:1px solid #ccc ; text-align:center; font-size:30px; margin:auto; cursor:pointer;}
	.classify_part .addTag:hover {color:$color1; border-color:$color1;}
}

	.wrap {
		display:flex; position:relative; 
			.quantum {
				width:96%; margin:0 auto;
				border-width:1px 0 1px 0; border-style:solid; border-color:#eee; padding:20px ;
				& > div {
					display:inline-block; width:49%; text-align:center;height:34px;
					& > * {vertical-align:top;}
					label {display:inline-block; width:100px; color:#7d7d7d; font-size:14px; line-height:34px; border:1px solid #eee; background:#eee;}
					.el-input {
						width:220px;
						.el-input__inner {border-radius:0; border:1px solid #eee;}
					}
				}
			}
		
		.edit-tag {
			.el-date-editor {
				width:100%;
			}
			
		}
		.el-dialog__body {padding-top:0;}
		
	}
</style>