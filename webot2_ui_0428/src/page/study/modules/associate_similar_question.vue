<template>
	<modal v-model="show" width="900" class="_select-relevance-wrap modal__associate-similar-question">
		<div slot="header" >
		    <h4 >
		      	<b>设置相似问题</b>
		    </h4>
		</div>
		<div>
			<div class="clearfix one_question">
				<label class="col-sm-2 text-right">当前选择问题</label>
				<div class="col-sm-9">
					<input v-model="question.question" class="form-control" />
				</div>
				<span class="col-sm-1 red" v-show="question.question.trim()==''">必填</span>
			</div>
			<div class="input-group search_wrap2 clearfix">
				<Input v-model="page.q" size="small" icon="ios-search" @on-click="searchs(1)" @on-enter.prevent='searchs(1)' placeholder="搜索问题关键词 "></Input>
			</div>
			<div class="_select-relevance flex flex-2">
				<aside class="flex-left">
					<div class="table4">
						<div class="thead">
							<div class="tr">
								<div class="th" style="width:100%">知识库</div>
							</div>
						</div>
					</div>
					<bar :wrapper="'wrapper'">
						<tree :list="Clists" :search='page' :option="questionOption" @changeTag="changeTag"></tree><br />
					</bar>
				</aside>
				<section class="flex-right">
						<div class="table_wrap ">
							<div class="simulate_table simulate_table table4">
								<ul class="thead">
									<li class="tr">
										<div class="th">标准问题</div>
										<div class="th">标准答案</div>
										<div class="th">创建时间</div>
										<div class="th">操作</div>
									</li>
								</ul>
								<ul class="tbody">
									<li class="tr" v-for="item in list">
										<div class="td">
											<el-tooltip v-if="prev_page.q_filed=='question'" popper-class="black html" :open-delay="400" placement="top-start">
												<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,300)"></div>
												<p class="text" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></p>
											</el-tooltip>

											<el-tooltip v-if="prev_page.q_filed==''" popper-class="black html" :open-delay="400" placement="top-start">
												<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,300)"></div>
												<div class="text">
													<span v-if="prev_page.q!=''&&item.similar_question.indexOf(prev_page.q)>-1" class="keyt">[相似问题]</span>
													<span  v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></span>
												</div>
											</el-tooltip>
											<el-tooltip v-if="prev_page.q_filed=='similar_question'"  popper-class="black html" :open-delay="400" placement="top-start">
												<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,'',300)"></div>
												<div class="text">
													<span v-if="prev_page.q!=''&&item.similar_question.indexOf(prev_page.q)>-1" class="keyt">[相似问题]</span>
													<span  v-html="item.question"></span>
												</div>
											</el-tooltip>
										</div>

                    <div class="td">

                      <el-tooltip v-if="prev_page.q_filed=='answer'" popper-class="black html" :open-delay="400"
                                  placement="top-start">
                        <div slot="content"
                             v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q,300)"></div>
                        <p class="text" v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q,20)"></p>
                      </el-tooltip>

                      <el-tooltip v-if="prev_page.q_filed==''" popper-class="black html" :open-delay="400"
                                  placement="top-start">
                        <div slot="content"
                             v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q,300)"></div>
                        <div class="text">
                          <!--<span v-if="prev_page.q!=''&&item.similar_answer.indexOf(prev_page.q)>-1" class="keyt">[相似问题]</span>-->
                          <span v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q,20)"></span>
                        </div>
                      </el-tooltip>

                      <el-tooltip v-if="prev_page.q_filed=='similar_answer'" popper-class="black html" :open-delay="400"
                                  placement="top-start">
                        <div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.answer,'',300)"></div>
                        <div class="text">
                          <!--<span v-if="prev_page.q!=''&&item.similar_answer.indexOf(prev_page.q)>-1" class="keyt">[相似问题]</span>-->
                          <span v-html="item.answer"></span>
                        </div>
                      </el-tooltip>
                    </div>
										<div class="td">
											{{$api.dateFormat('yyyy-MM-dd',item.created)}}
										</div>
										<div class="td">
											<a @click="submitRelevanceToQuestion(item)" class="pointer">关联</a>
										</div>
									</li>
								</ul>
							</div>
						</div>

					<div class="pagination_wrap text-center">
						<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
					</div>
				</section>

			</div>
		</div>
		<div slot="footer" class="">
		    <button type="button" class="btn btn-default" @click="show = false">取消</button>
		</div>
	</modal>
</template>

<script>
	import tree from '../../module/tree'
	import bar from '../../module/自定义滚动条.vue'
	export default {
		props:{
			value:{
				type:Boolean,
				default:false,
			},
			//待合并的问题
			question:{
				required:true,
				type:Object,
			}
		},
		data(){
			return {
				page:{
					page:1,
					size:11,
					tag1:'',
					tag2:'',
					q:'',
					q_filed:'',
				},
				prev_page:{
					q_filed:'',
					q:'',
				},
				list:[],
				total:0,
				Clists:[{name:'全部分类',id:''},{name:'未分类',id:0}],
				questionOption:{
		      		addChild:false,
		      	},
			}
		},
		created(){

		},
		computed:{
			show:{
				set(val){ console.log(val)
					if(val){
						if(this.Clists.length==2)
							this.getClassifyList();
						this.list = [];
						this.page.tag1='';
						this.page.tag2='';
						this.searchs(1);
					}
					this.$emit('input', val);
				},
				get(){
					return this.value;
				}
			}
		},
		methods:{
			searchs(index=undefined){
				var v = this;
				if(index) v.page.page = index;
				this.$api.ajax(v.$uri.knowledgeStore.knowledge.list,'get',v.page).then(function (data) {
					v.list = data.list;
					v.total = data.total;
					v.prev_page = v.$api.deepCopy(v.page);
				})
		  	},
			getClassifyList(){
		  		var v = this;
		  		this.$api.ajax(v.$uri.knowledgeStore.knowledge.tags,'get').then(function (data) {
		  			v.Clists = v.Clists.slice(0,2);
					v.Clists = v.Clists.concat(data);
				})
		    },
		    changeTag(i,j=''){
		    	this.page.tag1 = i;
		    	this.page.tag2 = j;
		    	this.searchs(1);
		    },
			submitRelevanceToQuestion(item){
				var v = this;
				v.$api.ajax(v.$uri.knowledgeStore.knowledge.list+'/'+item.id,'get')
				.then((data)=>{
					data.similar_question.push(v.question.question);
					data.new_question_id = v.question.id;
					v.$api.ajax(v.$uri.knowledgeStore.knowledge.list+'/'+item.id,'put',data).then( (r)=> {
			  			v.$message({
				            type: 'success',
				            message: '关联成功!'
				        });
				        v.show =false;
			  			v.$emit('success');
					})
				})
			}
		},
		components:{
			bar,
			tree,
		},
		watch:{
			show(n){
				if(n){
					if(this.Clists.length==2)
						this.getClassifyList();
					this.list = [];
					this.page.tag1='';
					this.page.tag2='';
					this.searchs(1);
				}
			}
		}
	}
</script>

<style lang="scss" >
	@import '../../knowledgeStore/modules/select.scss';
	@import '../../../assets/scss/api.scss';
	$th_widths:(0.3, 0.4,0.2 ,0.1);
	.modal__associate-similar-question{
		.one_question {padding:10px; line-height:28px;}
		.simulate_table {
			@include simulateTableThWidth($th_widths);
		}
	}

</style>
