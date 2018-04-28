<template>
	<div class="study human_qa">
		<h1 class="page_title">
			人工客服问答

			<button class="pull-right my-btn my-btn-info-o font12" @click="()=>{if(refresh.status==0) 刷新();}" v-html="refresh.text[refresh.status]" :class="'test'+refresh.status"></button>

		</h1>
		<div class="table_wrap">
			<div class="table4 simulate_table table_select">
				<ul class="thead">
					<li class="tr">
						<div class="th"></div>
						<div class="th">问题</div>
						<div class="th">当前答复</div>
						<div class="th">提问时间</div>
						<div class="th">操作</div>
					</li>
				</ul>
				<ul class="tbody">
					<li class="tr" v-for="item in Lists">
						<div class="td">
							<span :class="选中.indexOf(item.id)!=-1?'is-checked el-checkbox__input':'el-checkbox__input'" 
								@click="()=>{if(选中.indexOf(item.id)!=-1){选中.splice(选中.indexOf(item.id),1);选中item.splice(选中.indexOf(item.id),1)}else{ 选中.push(item.id);选中item.push(item);}}">
								<span class="el-checkbox__inner"></span>
							</span>
						</div>
						<div class="td" >
							<el-tooltip  popper-class="black html" placement="top-start" :open-delay="400">
								<div slot="content" v-html="item.question"></div>
								<p class="text" v-html="$api.htmlToStr(item.question)"></p>
							</el-tooltip>
						</div>
						<div class="td">
							<el-tooltip  popper-class="black html" placement="top-start" :open-delay="400">
								<div slot="content" v-html="item.answer"></div>
								<p class="text" v-html="$api.htmlToStr(item.answer)"></p>
							</el-tooltip>
						</div>
						<div class="td" :title="item.created">{{$api.dateFormat('yyyy-MM-dd',item.created)}}</div>
						<div class="td">
							<span @click="addToStore(item)" class="operate-edit pointer">添加到知识库</span>&emsp;
							<span @click="relevanceToQuestion(item)" class="operate-edit pointer">关联为相似问题</span>&emsp;
							<span @click="ignore(item.id)" class="pointer operate-edit">忽略</span>
						</div>
					</li>
				</ul>
				<ul class="tfoot" v-if="Lists.length>0">
					<li class="tr">
						<div class="td">
							<span @click="全选()" :class="选中.length==Lists.length?'is-checked el-checkbox__input':'el-checkbox__input'">
								<span class="el-checkbox__inner"></span>
							</span>
							<span @click="全选()" class="check-txt pointer unselect">全选</span> 
						</div>
						<div class="td text-right" v-if="选中.length!=0">
							<button class="my-btn my-btn-info-o" @click="ignore()">忽略</button>
						</div>
					</li>
				</ul>
			</div>
		</div><br />
		<div class="pagination_wrap">
			<!--<pagination :page="page" :total="total" v-on:pageTurn="searchs"></pagination>-->
			<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
		</div><br />

		<question-modal  :question="editQuestion" v-model="show_modal_info" @successHandler="submitAddToStore"></question-modal>
		<associate-similar-question v-model="show_modal_list" :question="one_question" @success="searchs"></associate-similar-question>
	</div>
</template>
<script>
	import pagination from '../module/pagination'
	import {Modal} from 'uiv'
	import tree from '../module/tree'
	import bar from '../module/自定义滚动条.vue'
	import questionModal from '../knowledgeStore/modules/edit_question.vue'
	import associateSimilarQuestion from './modules/associate_similar_question'
	export default {
		data(){
			return {
				show_modal_info:false,
				show_modal_list:false,
				selectAll:false,
				page:{
					page:1,
					size:16,
					status:0,
					source:2,
				},
				total:0,
				
				Lists:[],
				Qlists:[],
				one_question:{
					question:'',
					answer:'',
					id:0,
				},
				editQuestion:{	},
		      	
		      	选中:[],
		      	选中item:[],
		      	refresh:{
					status:0,
					text:['&emsp;&nbsp;刷新&nbsp;&emsp;','刷新中&nbsp;&nbsp;<i class="el-icon-loading font12"></i>'],
				}
			}
		},
		created(){
			this.searchs();
			this.editQuestion = this.genQuestion(); 
		},
		computed:{
		  	tag2List:function(){
		  		var list;
		  		for(var i=0;i<this.Clists.length;i++){
		  			if(this.Clists[i].id == this.editQuestion.tag1){
		  				list = this.Clists[i].child;
		  				break;
		  			}
		  		}
		  		return list;
		  	},

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
			beforeSearchs(){
				this.选中 = [];
				this.选中item=[];
			},
			searchs(index){
				var v = this;
				return new Promise((resolve,reject)=>{
					if(index) v.page.page = index;
					v.beforeSearchs();
					v.$api.ajax('/new_questions','get',v.page)
					.then(function(data){
						v.Lists = data.list;
						v.total = data.total;
						resolve(true)
					}).catch(err=>{
						reject(err)
					})
				})
			},
			getClassifyList(){
		  		var v = this;
		  		this.$api.ajax('/questions/tags','get').then(function (data) {
		  			v.Clists = v.Clists.slice(0,2);
					v.Clists = v.Clists.concat(data);
				})
		    },
			addToStore(item){
				this.editQuestion = this.genQuestion();
				this.editQuestion.answer[0] = item.answer;
				this.editQuestion.question=item.question;
				this.editQuestion.new_question_id=item.id;
				this.show_modal_info=true;
			},
			submitAddToStore(){
		  		var v = this;
		  		v.searchs();
	  			/*this.$api.ajax('/questions','post',v.editQuestion).then(function(r) {
		  			v.show_modal_info =false;
		  			v.$message({
			            type: 'success',
			            message: '添加成功!'
			        });
		  			
				})*/
			},
			relevanceToQuestion(q){
				var v = this;
				v.one_question = v.$api.deepCopy(q);
				v.show_modal_list = true;
			},
			ignore(id=0){
				var v = this;
				var ids = v.选中;
				if(id){
					ids[0] = id;
				}
				if(ids.length==0) return;
				this.$confirm('确定要忽略'+(id==0?'选中':'此')+'问题？','提示',{
					confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
				}).then(()=>{
					v.$api.ajax('/new_questions','put',{ids:ids,status:1})
					.then(function(data){
						v.$message({
				            type: 'success',
				            message: '忽略成功!'
				        });
						v.searchs();
					})
				});
			},
		    //列表过滤
		    limitStringNum(str,num){
		    	var len = num||20;
		    	var s = str.slice(0,len);
		    	if(str.length>len)
		    		s = s+'···';
		    	return s;
		    },
			全选(){
				let v = this;
				if(v.选中.length!=v.Lists.length){
					v.选中 = [];
					v.选中item=[];
					v.Lists.forEach(val=>{
						v.选中.push(val.id);
						v.选中item.push(val);
					})
				}else{
					v.选中 = [];
					v.选中item=[];
				}
			},
			刷新(){
				this.refresh.status = 1;
				this.$api.ajaxNoLoading('/questions/study','get',{t:Date.now()})
				.then(data=>{
					setTimeout(()=>{
						this.searchs()
						.then(()=>{
							this.refresh.status = 0;
							this.$message({
								message:'刷新成功',
								type:'success'
							});
						});
					},2000);
				})
				
			},
		},
		watch:{
		},
		components:{
			pagination,
			Modal,
			tree,
			bar,
			questionModal,
			associateSimilarQuestion,
		}
	}
</script>
<style lang="scss" scoped="">
	@import '../../assets/scss/api.scss';
	$th_widths:(0.3 ,0.25, 0.15, 0.3);
	.human_qa {
		.simulate_table {
			min-width:900px;
			@include simulateTableThWidth($th_widths,true);
		}
	}
</style>
