<template>
	<div class="knowsearch">
		<Collapse accordion v-model="AUX.show_index">
			<Panel>
	            知识库
	            <template slot="content">
	            		<div class="search">
	            			<Input v-model="search.知识库.q" :icon="search.知识库.searching?'load-c':'ios-search'" size="small" @on-keydown.13="search知识('知识库', 1)" @on-click="search知识('知识库', 1)" ></Input>
	            		</div>
	            		<p class="ps">
	            			<span v-show="AUX.show_tabs.知识库==0">{{total.知识库}}条有关知识回答</span>
	            			<a v-show="AUX.show_tabs.知识库==1" @click="AUX.show_tabs.知识库=0">返回</a>
	            		</p>
	            		<tabs :tabs="[]" :body-size="2" v-model="AUX.show_tabs.知识库">
	            			<template slot="tab0">
	            				<bar wrapper="wrapper5" @arrive-bottom="getMoreStore">
				            		<div v-for="(l,i) in list.知识库" class="qa" @click="showDetail('知识库', i)">
				            			<one-qa :index="i+1" :keyword="copy_search.知识库.q" :question="l.question" :answer="l.answer" :richAnswer="l.rich_answer" :row="3"></one-qa>
										<!--<div class="q">
											<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
												<div slot="content" class="qa_detail">
													<div class="q">
														问题：<span v-html="filterSerachStringAndLimitNum(l.question,copy_search.知识库.q,100)"></span>
													</div>
													<div class="a">
														<p class="accessory">标准答案：</p>
														<span  v-html="filterSerachStringAndLimitNum(l.answer,copy_search.知识库.q,10000)"></span>
													</div>
													<template v-if="l.rich_answer && l.rich_answer.length>0">
														<p class="accessory">富媒体答案:</p>
														<div v-if="l.rich_answer.some(val=>val.type=='text')" v-for="r in l.rich_answer.filter(val=>val.type=='text')" >{{r.text}}</div>
														<div class="accessory" v-for="(r,i) in l.rich_answer.filter(val=>val.type!='text')">{{r.name || r.text || r.url?r.url.substr(r.url.lastIndexOf('/')+1):'文件'+i}}</div>
													</template>
												</div>
												<div class="tragger_q">
													<span class="index">{{i+1}}:</span>
													<p v-html="filterSerachStringAndLimitNum(l.question,copy_search.知识库.q,100)"></p>
												</div>
											</el-tooltip>
											<a class="submit pointer" @click.stop.pervent="pushStore(l)">推送答案</a>
										</div>
										<div class="a_wrap">
											<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
												<div slot="content" class="qa_detail">
													<div class="q">
														问题：<span v-html="filterSerachStringAndLimitNum(l.question,copy_search.知识库.q,100)"></span>
													</div>
													<div class="a">
														<p class="accessory">标准答案：</p>
														<span v-html="filterSerachStringAndLimitNum(l.answer,copy_search.知识库.q,10000)"></span>
													</div>
													<template v-if="l.rich_answer && l.rich_answer.length>0">
														<p class="accessory">富媒体答案:</p>
														<div v-if="l.rich_answer.some(val=>val.type=='text')" v-for="r in l.rich_answer.filter(val=>val.type=='text')" >{{r.text}}</div>
														<div class="accessory" v-for="r in l.rich_answer.filter(val=>val.type!='text')">{{r.name}}</div>
													</template>
												</div>
												<div class="a" v-if="l.answer"  v-html="filterSerachStringAndLimitNum(l.answer,copy_search.知识库.q,100)"></div>
												<div class="a" v-else-if="l.rich_answer.some(val=>val.type=='text')" v-html="l.rich_answer.filter(val=>val.type=='text')[0].text"></div>
												<div class="a" v-else>
													<p v-for="r in l.rich_answer">{{r.name}}</p>
												</div>
											</el-tooltip>
										</div>-->
										<a class="submit pointer" @click.stop.pervent="pushStore(l)">推送答案</a>
				            		</div>
									<p class="text-center" v-show="total.知识库!=0 && total.知识库!=list.知识库.length"><Icon class="font15" type="load-c"></Icon></p>
	            				</bar>
	            			</template>
	            			<template slot="tab1">
	            				<bar wrapper="wrapper5">
	            					<qa-detail :detail="list.知识库[detail_index.知识库]" :keyword="copy_search.知识库.q"></qa-detail>
	            				</bar>
	            			</template>
	            		</tabs>
	            </template>
	        </Panel>
	        <Panel>
	            知识点
	            <template slot="content">
	            		<div class="search">
	            			<Input v-model="search.知识点.q" :icon="search.知识点.searching?'load-c':'ios-search'" size="small" @on-keydown.13="search知识('知识点', 1)" @on-click="search知识('知识点', 1)" ></Input>
	            		</div>
	            		<p class="ps">
	            			<span v-show="AUX.show_tabs.知识点==0">{{total.知识点}}条有关知识回答</span>
	            			<a v-show="AUX.show_tabs.知识点==1" @click="AUX.show_tabs.知识点=0">返回</a>
	            		</p>
	            		<tabs :tabs="[]" :body-size="2" v-model="AUX.show_tabs.知识点">
	            			<template slot="tab0">
	            				<bar wrapper="wrapper5" @arrive-bottom="getMorePoint">
	            					<div v-for="(l,i) in list.知识点" class="qa" @click="showDetail('知识点', i)">
	            						<one-point :index="i+1" :keyword="copy_search.知识点.q" :title="l.title" :content="l.content" :content-text="$api.htmlToStr(l.content.text)" :row="3"></one-point>
	            						<a class="submit pointer" @click.stop.pervent="pushRichText(l.content.url,l.content.media_id)">推送答案</a>
	            					</div>
	            					<p class="text-center" v-show="total.知识点!=0 && total.知识点!=list.知识点.length"><Icon class="font15" type="load-c"></Icon></p>
	            				</bar>
	            			</template>
	            			<template slot="tab1">
	            				<bar wrapper="wrapper5">
	            					<point-detail :detail="list.知识点[detail_index.知识点]" :keyword="copy_search.知识点.q"></point-detail>
	            				</bar>
	            			</template>
	            		</tabs>
	            			
							<!--<div class="q">
								<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
									<div slot="content" class="qa_detail">
										<div class="q" >
											标题：<span v-html="filterSerachStringAndLimitNum(l.title,copy_search.知识点.q,100)"></span>
										</div>
										<div class="a" v-html="filterSerachStringAndLimitNum(l.content.text,copy_search.知识点.q,10000)"></div>
										<p v-if=" l.content.accessory.length>0" class="accessory">附件:</p>
										<div class="accessory" v-for="r in l.content.accessory">{{r.name}}</div>
									</div>
									<div class="tragger_q">
										<span class="index">{{i+1}}:</span>
										<p v-html="filterSerachStringAndLimitNum(l.title,copy_search.知识点.q,100)"></p>
									</div>
								</el-tooltip>
								<a class="submit pointer" @click="pushRichText(l.content.url,l.content.media_id)">推送答案</a>
							</div>
							<div class="a_wrap">
								<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
									<div slot="content" class="qa_detail">
										<div class="q" >
											标题：<span v-html="filterSerachStringAndLimitNum(l.title,copy_search.知识点.q,100)"></span>
										</div>
										<div class="a" v-html="filterSerachStringAndLimitNum(l.content.text,copy_search.知识点.q,10000)"></div>
										<p v-if=" l.content.accessory.length>0" class="accessory">附件:</p>
										<div class="accessory" v-for="r in l.content.accessory">{{r.name}}</div>
									</div>
									<div class="a" v-html="filterSerachStringAndLimitNum($api.htmlToStr(l.content.text),copy_search.知识点.q,1000)"></div>
								</el-tooltip>
							</div>-->
	            </template>
	        </Panel>
	        <Panel>
	            快捷语回复
	            <template slot="content">
	            	<bar wrapper="wrapper5">
	            		<div class="search">
	            			<Input v-model="search.快捷回复.q" icon="ios-search" size="small" @on-keydown.13="search快捷回复()" @on-click="search快捷回复()" ></Input>
	            		</div>
	            		<p class="ps">{{list.快捷回复.length}}条有关快捷语回复</p>
	            		<div v-for="(l,i) in list.快捷回复" class="qa" >
	            			<shortcut :index="i+1" :keyword="copy_search.快捷回复.q" :list="l" :row="3"></shortcut>
	            			<a class="submit pointer" @click.stop.pervent="pushAnswer(l[2])">推送答案</a>
							<!--<div class="q">
								<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
									<div slot="content" class="qa_detail">
										<div class="q">
											<b v-html="filterSerachStringAndLimitNum('【'+l[0]+'】',copy_search.快捷回复.q,100)"></b>
											<span v-html="filterSerachStringAndLimitNum(l[1],copy_search.快捷回复.q,100)"></span>
										</div>
										<div class="a" v-html="filterSerachStringAndLimitNum(l[2],copy_search.快捷回复.q,1000)"></div>
									</div>
									<div class="tragger_q">
										<p>
											{{i+1}}:<b v-html="filterSerachStringAndLimitNum('【'+l[0]+'】',copy_search.快捷回复.q,100)"></b>
											<span v-html="filterSerachStringAndLimitNum(l[1],copy_search.快捷回复.q,100)"></span>
										</p>
									</div>
								</el-tooltip>
								<a class="submit pointer" @click="pushAnswer(l[2])">推送答案</a>
							</div>
							<div class="a_wrap">
								<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
									<div slot="content" class="qa_detail">
										<div class="q">
											<b v-html="filterSerachStringAndLimitNum('【'+l[0]+'】',copy_search.快捷回复.q,100)"></b>
											<span v-html="filterSerachStringAndLimitNum(l[1],copy_search.快捷回复.q,100)"></span>
										</div>
										<div class="a" v-html="filterSerachStringAndLimitNum(l[2],copy_search.快捷回复.q,1000)"></div>
									</div>
									<div class="a"  v-html="filterSerachStringAndLimitNum(l[2],copy_search.快捷回复.q,100)"></div>
								</el-tooltip>
							</div>-->
						</div>
	            	</bar>
	            </template>
	        </Panel>
		</Collapse>	
	</div>
</template>

<script>
	import bar from '../../module/自定义滚动条.vue'
	import knowledgeStore from '../../knowledgeStore/mixin.js'
	import qaDetail from './QADetail' 
	import oneQa from './oneQA' 
	import pointDetail from './pointDetail' 
	import onePoint from './onePoint' 
	import shortcut from './快捷语' 
	import tabs from '../../module/tabs'
	export default {
		mixins:[knowledgeStore],
		props:['快捷回复s'],
		data(){
			return {
				status:'1',
				search:{
					知识库:{
						q:'',
						page:1,
						size:20,
						loading:false,
						searching:false,
					},
					知识点:{
						q:'',
						page:1,
						size:20,
						status: 1,
						loading:false,
						searching:false,
					},
					快捷回复:{
						q:'',
						loading:false,
						searching:false,
					}
				},
				copy_search:{
					知识库:{
						q:''
					},
					知识点:{
						q:''
					},
					快捷回复:{
						q:''
					}
				},
				list:{
					知识库:[],
					知识点:[],
					快捷回复:[],
				},
				total:{
					知识库:0,
					知识点:0,
					快捷回复:0,
				},
				//要显示在详情的列表索引
				detail_index:{
					知识库: '',
					知识点: '',
				},
				热点问题page:{
					start_time:new Date().setHours(0,0,0,0)/1000-3600*24*30,
					end_time:Date.now()/1000,
					page:1,
					size:5,
				},
				AUX:{
					show_index:'0',
					show_tabs:{
						知识库: 0,
						知识点: 0,
					},
				}
			}
		},
		created(){
			this.热点问题();
		},
		methods:{
			pushStore(s){
				if(s.answer&&(!s.rich_answer||s.rich_answer.length==0)){
					this.pushAnswer(s.answer)
				}
				if(s.rich_answer&&s.rich_answer.length!=0){
					let tests = s.rich_answer.filter(val=>val.type=='text');
					let no_tests  = s.rich_answer.filter(val=>val.type!='text');
					if(no_tests.length==0){
						this.pushAnswer(tests.map(val=>val.text).join('$$'));
					}else{
						this.pushRichAnswer(s.rich_answer);
					}
				}
			},
			pushRichText(url,id){   
				this.$emit('pushRichText',url,id)
			},
			pushAnswer(answer){
				this.$emit('pushAnswer',answer,'text');
			},
			pushRichAnswer(data){
				this.$emit('pushAnswer',data,'rich_answer');
			},
			热点问题(){
				let v = this;
				v.$api.ajaxNoLoading('/knowledge_point/hot','get',v.热点问题page)
				.then(data=>{
					v.list.知识库 = data;
				})
			},
			search知识(module, index ,load="searching"){
				let v = this;
				this.AUX.show_tabs[module] = 0;
				this.detail_index[module] = '';
				if(index==1){
					v.search[module].page = index;
					v.list[module] = [];
				} 
				let uri = module=='知识库' ? v.$uri.knowledgeStore.knowledge.list : v.$uri.knowledgeStore.point.list;
				v.$api.ajaxNoLoading(uri,'get',v.search[module])
				.then(data=>{
					v.copy_search[module] = v.search[module];
					v.list[module] = v.list[module].concat(data.list);  
					v.total[module] = data.total;
					v.search[module][load] = false;
				}).catch(()=>{
					v.search[module][load] = false;
				})
			},
			search快捷回复(){      console.log(this.search.快捷回复)
				let v = this;
				v.list.快捷回复 = [];
				let texts = v.search.快捷回复.q;
				let 快捷回复s = v.快捷回复s;
				let test = v.test;
				for(let i in 快捷回复s){
					if(test( texts ,i)){
						for(let j in 快捷回复s[i]){
							v.list.快捷回复.push([i,j,快捷回复s[i][j]]);
						}
					}else{
						for(let j in 快捷回复s[i]){
							if(test( texts ,j) || test(texts, 快捷回复s[i][j])){
								v.list.快捷回复.push([i,j,快捷回复s[i][j]]);
							}
						}
					}
				}
				v.copy_search.快捷回复.q = texts;
			},
			getMoreStore(){
				this.search.知识库.page++;
				this.search知识('知识库',0,'loading');
			},
			getMorePoint(){
				this.search.知识点.page++;
				this.search知识('知识点',0,'loading');
			},
			showDetail(module, index){
				this.detail_index[module] = index;
				this.AUX.show_tabs[module] = 1;
			},
			test(q,str){
				if(str.indexOf(q)!=-1) return true;
				return false;
			}
		},
		components:{
			bar,
			qaDetail,
			oneQa,
			onePoint,
			pointDetail,
			tabs,
			shortcut,
		},
		watch:{
		}
	}
</script>

<style lang="scss">
	@import "../../../assets/scss/wrap_variate.scss";
	$tabHeight:60px;
	$ivu-collapse-header-height:45px;
	.knowsearch{
		height:100%;
		background:#fafcfd;
		.search {
			/*max-width: 175px;*/
			input {
				border-radius:20px;
				background: #ecf0f2;
				border-color: #ecf0f2;
				line-height:30px;
			}
		}
		.ivu-collapse{
			border: none !important;
		}
		.ivu-collapse-item {
			border-color: #dee5e9
		}
		.ivu-collapse-content{
			padding:0;
		}
		.ivu-collapse-header {
			height: $ivu-collapse-header-height !important;
			line-height: $ivu-collapse-header-height !important;
			background: #ecf0f2;
		}
		.ivu-collapse-content-box {
			padding:0;
			height:calc(100vh - #{$ivu-collapse-header-height*3} - #{$tabHeight} - #{$wrap-head-height} - 5px );
			background: #fafcfd;
			overflow-y: hidden;
		}
		.wrapper5{
			height:calc(100% - 80px);
		}
		
		.search,.ps{
			margin:0 30px;
		}
		.search{
			padding-top:15px;
		}
		.ps{
			color:#ccc;
			font-size:12px;
			line-height:40px;
			border-bottom:1px solid #eee;
		}
		.qa {
			margin: 0 30px;
			padding-bottom:10px;
			position:relative;
			.submit {
				top:15px;
			}
			border-bottom:1px solid #eee;
			._qa ._qa-q ._qa-text {
				width: calc(100% - 55px);
			}
		}
		.qa .a:after {background:#fafcfd;}
	}
</style>