<template>
	<modal  v-model="currentValue" size="lg" :backdrop='false' width="800" class="_select-relevance-wrap modal__select-point">
		    <h4 slot="header">
		      	<b>关联知识点</b>
		    </h4>
			<div>
				<div class="input-group search_wrap2 clearfix">
					<Input placeholder="搜索知识点关键词" v-model="page.q" size="small" icon="ios-search" @on-click="searchs(1)" @on-enter.prevent='searchs(1)'></Input>
				</div>
				<div class="_select-relevance flex flex-2">
					<aside class="flex-left">
						<div class="table4">
							<div class="thead">
								<div class="tr">
									<div class="th" style="width:100%">知识点</div>
								</div>
							</div>
						</div>
						<bar wrapper="wrapper">
							<tags :tags="tags" @change="changeTag"></tags><br />
						</bar>
					</aside>
					<section class="flex-right">
						
						<!--<bar wrapper="wrapper">-->
							<div class="table_wrap">
								<div class="simulate_table table4 table_select">
									<ul class="thead">
										<li class="tr">
											<div class="th"></div>
											<div class="th"></div>
											<div class="th">标准标题</div>
											<div class="th">内容</div>
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
												<span class="situation" v-if="item.situation==0">内</span>
												<span class="situation" v-else-if="item.situation==1">外</span>
												<span class="situation" v-else>内/外</span>
											</div>
											<div class="td">
												<el-tooltip popper-class="black html" v-if="prev_page.q_filed=='title'||prev_page.q_filed==''" :open-delay="400">
													<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.title,prev_page.q,1000)"></div>
													<p class="text" v-html="$api.filterSerachStringAndLimitNum(item.title,prev_page.q,30)"></p>
												</el-tooltip>
												<el-tooltip v-else  popper-class="black html" :open-delay="400">
													<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.title,'',1000)"></div>
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
													<p class="text" v-html="$api.htmlToStr(item.content.text)"></p>
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
	import tags from './tags'
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
					tag:'',
					page:1,
					size:11,
					q:'',
					q_filed:'',
					sort_filed:'created',
					sort:1,
				},
				prev_page:{
					q:'',
					q_filed:'',
				},
				list:[],
				total:0,
				tags: [],
		      	cids:[],
			}
		},
		created(){
			this.getTags();
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
			changeTag(id){
				this.page.tag = id;
				this.searchs(1);
			},
			getTags(){
				let v =this;
				v.$api.ajax(v.$uri.knowledgeStore.point.tags,'get',{page:1,size:10000})
				.then(data=>{
					v.tags = data.list;
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
			tags,
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

<style lang="scss"  >
	@import './select.scss';
	@import '../../../assets/scss/api.scss';
	$th_widths:[0.15,0.35,0.5];
	.modal__select-point{
		.simulate_table {
	        @include simulateTableThWidth($th_widths,true);
	    }
	    .situation {
	    	padding:0px 6px; border-radius:10px; background:#ccc; color:#fff;
	    }
	}
</style>
