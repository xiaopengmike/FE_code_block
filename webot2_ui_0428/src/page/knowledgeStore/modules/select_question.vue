<template>
	<modal  v-model="currentValue" size="lg" :backdrop='false' width="800" class="modal__select-question _select-relevance-wrap">
		    <h4 slot="header">
		      	<b>关联问题</b>
		    </h4>
			<div>
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
						<bar wrapper="wrapper">
							<tree :list="Clists" :search='page' :option="questionOption" @changeTag="changeTag"></tree><br />
						</bar>
					</aside>
					<section class="flex-right">
						<!--<bar wrapper="wrapper">-->
							<div class="table_wrap">
								<div class="simulate_table table4 table_select">
									<ul class="thead">
										<li class="tr">
											<div class="th"></div>
											<div class="th">标准问题</div>
											<div class="th">标准回答</div>
										</li>
									</ul>
									<ul class="tbody">
										<li class="tr" v-for="(item,i) in list"
											 :class="{disable:!item.status,selected:cids.indexOf(item.id)!=-1}"
                                            @click="()=>{if(cids.indexOf(item.id)!=-1){cids.splice(cids.indexOf(item.id),1);}else{ cids.push(item.id);}}">
											<div class="td">
												<span :class="cids.indexOf(item.id)!=-1?'is-checked el-checkbox__input':'el-checkbox__input'">
													<span class="el-checkbox__inner"></span>
												</span>
											</div>
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
												<el-tooltip popper-class="black"  :open-delay="400" placement="top-start">
													<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q,300)"></div>
													<p class="text" v-html="$api.filterSerachStringAndLimitNum(item.answer,prev_page.q100)"></p>
												</el-tooltip>
											</div>
										</li>
									</ul>
									<ul class="tfoot" v-if="list.length>0">
										<li class="tr">
											<div class="td">
												<span @click="全选()" :class="judge全选?'is-checked el-checkbox__input':'el-checkbox__input'">
													<span class="el-checkbox__inner"></span>
												</span>
				                                <span @click="全选()" class="check-txt pointer unselect">全选</span>
				                           </div>
				                        </li>
				                    </ul>
								</div>
							</div>
						<!--</bar>-->
						
						<div class="pagination_wrap" v-if="total>0">
							<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
						</div>
					</section>
					
				</div>
			</div>
			<div slot="footer" class="">
			    <button class="my-btn my-btn-info-o" @click="currentValue= false">取消</button>
			    <button class="my-btn my-btn-info-f" @click="关联()">关联</button>
			</div>
	</modal>
	
</template>

<script>
	import bar from '../../module/自定义滚动条.vue'
	import tree from '../../module/tree'
	export default {
		props:{
			value:{
				type:Boolean,
				default:false
			},
			ids:{
				required:true,
				type:Array,
			}
		},
		data(){
			return {
				page:{
					page:1,
		      		size:11,
		      		q:'',
		      		tag1:'',
		      		tag2:'',
		      		q_filed:'',
				},
				prev_page:{
		      		q:'',
		      		q_filed:'',
				},
				list:[],
				total:0,
				Clists: [{name:'全部分类',id:''},{name:'未分类',id:0}],
				questionOption:{
		      		addChild:false,
		      	},
		      	cids:[],
			}
		},
		created(){
			this.getClassifyList();
		},
		computed:{
			currentValue: {  
		        get:function() {  
		          return this.value; 
		        },  
		        set:function(val) {  
		          this.$emit('input', val); 
		        }  
		    } ,
		    judge全选(){
		    	let v = this;
		    	let cids = v.cids;
		    	return !v.list.some(val=>{return cids.indexOf(val.id)==-1});
		    }
		},
		methods:{
			searchs(index){
				let v = this;
				if(index) v.page.page=index;
				v.$api.ajax(v.$uri.knowledgeStore.knowledge.list,'get',v.page)
				.then(data=>{
					v.total = data.total;
					v.list = data.list;
					v.prev_page = v.$api.deepCopy(v.page);
				})
			},
			changeTag(i,j=undefined){
				this.page.tag1 = i;
				this.page.tag2 = j===undefined?'':j;
				this.searchs(1);
			},
			getClassifyList(){
		  		var v = this;
		  		this.$api.ajax(v.$uri.knowledgeStore.knowledge.tags,'get').
		  		then( (data)=> {
		  			v.Clists = v.Clists.slice(0,2);
					v.Clists = v.Clists.concat(data); 
				})
		    },
		    关联(){
		    	let cids_copy=this.$api.deepCopy(this.cids);   
		    	this.$emit('update:ids',cids_copy);
		    	this.currentValue = false;
		    },
		    全选(){
		    	let v = this;   
		    	if(!v.judge全选){
		    		v.list.forEach(val=>{
		    			if(v.cids.indexOf(val.id)==-1){
		    				v.cids.push(val.id)
		    			}
		    		})
		    	}else{
		    		v.list.forEach(val=>{
		    			let index = v.cids.indexOf(val.id);
		    			v.cids.splice(index,1)
		    		})
		    	}
		    }
		},
		components:{
			bar,
			tree,
		},
		watch:{
			currentValue(n){
				if(n){
					this.list=[];
					this.page.page=1;
					this.searchs();
				}
				
			},
			ids:{
				handler(n){
					this.cids=this.$api.deepCopy(n);
				},deep:true,
			}
		}
	}
</script>

<style lang="scss" >
	@import './select.scss';
	@import '../../../assets/scss/api.scss';
	$th_widths:[0.4,0.6];
	.modal__select-question{
		.simulate_table {
	        @include simulateTableThWidth($th_widths,true);
	    }
	}
</style>
