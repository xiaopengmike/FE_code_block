<template>
	<div class="knowledgestore store flex flex-2">
		<div class="flex-right">
			<div class="page_title">
				<template v-if="page.tag1===''">知识库整理</template>
				<small class="current_edtion">当前更新版本：{{lastFinishTime}}</small>
				<!--<template v-if="page.tag1===0">未分类</template>-->
				<!--<template v-if="page.tag1">-->
				<!--{{classify_index[page.tag1].name}}<span-->
				<!--v-if="classify_index[page.tag2]"> / {{classify_index[page.tag2].name}}</span>-->
				<!--</template>-->
			</div>

			<div class="">
				<div class="input-group search_wrap clearfix">
					<Input v-model="page.q" size="small" placeholder="请输入搜索内容" @on-enter.prevent='searchs(1)'>
					<Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
						<Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
					</Select>
					<Button slot="append" icon="search" @click="searchs(1)"></Button>
					</Input>

					<button class="my-btn my-btn-info-f pull-right" @click="智能整理func01()" v-html=""
                  :disabled="getClusterStatus==1||getClusterStatus==2?true:false"
                  v-html="智能整理.text[智能整理.status]">
         </button>
					<span class="pull-right processing-time" v-show="clusterProgressCount">迭代次数：{{clusterProgressCount}}/{{clusterProgressLength}}</span>
				</div>
				<div class="table_wrap">
					<div class="table4 simulate_table table_select">
						<ul class="thead">
							<li class="tr">
								<div class="th"></div>
								<div class="th">标准问题&ensp;
								</div>
								<div class="th">标准答案&ensp;
								</div>
								<div class="th">击中次数&ensp;
								</div>
								<div class="th">创建时间&ensp;
								</div>
								<div class="th">操作</div>
							</li>
						</ul>

						<ul class="tbody" v-for="(arr,index) in front_end_ordered_qlists_arr" :class="index==front_end_ordered_qlists_arr.length-1? 'last_tbody':''">

							<li class="tr" v-for="item in arr.data" :key="item.id" :class="{selected:选中.indexOf(item.id)!=-1,disable:选中.indexOf(item.id)!=-1}" v-tap="()=>{if(选中.indexOf(item.id)==-1) edit(item.id);}">

								<div class="td" @mousedown.stop>
									<span :class="选中.indexOf(item.id)!=-1 ? 'is-checked el-checkbox__input':'el-checkbox__input'" @click.stop="clickSelect(item)">
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
                      <span v-if="prev_page.q!=''&&item.similar_question.toString().indexOf(prev_page.q)>-1" class="keyt">[相似问题]</span>
                      <span  v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></span>
                    </div>
                  </el-tooltip>
                  <el-tooltip v-if="prev_page.q_filed=='similar_question'"  popper-class="black html" :open-delay="400" placement="top-start">
                    <div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,'',300)"></div>
                    <div class="text">
                      <span v-if="prev_page.q!=''"  class="keyt">[相似问题]</span>
                      <span  v-html="item.question"></span>
                    </div>
                  </el-tooltip>
                  <el-tooltip v-if="prev_page.q_filed=='answer'" popper-class="black html" :open-delay="400" placement="top-start">
                    <div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,300)"></div>
                    <p class="text" v-html="$api.filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></p>
                  </el-tooltip>
                </div>

                <div class="td">

									<el-tooltip popper-class="black html" v-if="prev_page.q_filed=='answer'||prev_page.q_filed==''" :open-delay="400">
										<div slot="content">
											<span v-for="(i,index) in item.answer" v-html="filterSerachStringAndLimitNum(item.answer[index],prev_page.q,300)"></span>
										</div>
										<!--<bar wrapper="h500" slot="content">
											<span v-for="(i,index) in item.answer" v-html="filterSerachStringAndLimitNum(item.answer[index],prev_page.q,300)"></span>
										</bar>-->
										<p class="text" v-for="i in item.answer" v-html="filterSerachStringAndLimitNum(i,prev_page.q,29)"></p>
									</el-tooltip>

									<el-tooltip v-else popper-class="black html">
										<div slot="content" v-html="filterSerachStringAndLimitNum(item.answer,'',300)"></div>
										<p class="text" v-html="item.answer"></p>
									</el-tooltip>
								</div>

								<div class="td" :title="item.hit_count">
									&emsp;&emsp;&nbsp;&nbsp;{{item.hit_count}}
								</div>
								<div class="td" :title="item.created">
									{{$api.dateFormat('yyyy-MM-dd', item.created) }}
								</div>
								<div class="td" @mousedown.stop>
									<p class="operate">
										<span class="operate-edit pointer" @click.stop="edit(item.id)" v-authority="'机器人知识库-知识库-修改'">编辑</span>&nbsp;
										<span class="operate-remove pointer" @click.stop="del(item)" v-authority="'机器人知识库-知识库-删除'">删除</span>
									</p>
								</div>
							</li>
							<div v-for="(item,index) in arr.data">
								<li class="sum_li" v-if="arr.data.length&&index==arr.data.length-1 ">
									<div class=" sum_td"></div>
									<div class=" sum_td"></div>
									<div class=" sum_td">合计：&nbsp;{{arr.data[0].total_hit}}
									</div>
									<div class=" sum_td"></div>
									<div class=" sum_td"></div>
								</li>
							</div>

						</ul>

						<ul class="tfoot" v-if="Qlists.length>0">
							<li class="tr">
								<div class="td">
									<span id="全选" @click="全选()" :class="选中.length==Qlists.length?'is-checked el-checkbox__input':'el-checkbox__input'">
										<span class="el-checkbox__inner"></span>
									</span>
									<span @click="全选()" class="check-txt pointer unselect">全选</span>
									<button v-show="选中.length!=0" @click="del()" v-authority="'机器人知识库-知识整理-删除'" class="my-btn my-btn-primary">删除</button>
								</div>
								<div class="td text-right" v-show="选中.length!=0">
									<button @click="merge(选中item[0].id,选中item)" class="my-btn my-btn-info-o">合并</button>
								</div>
							</li>
						</ul>

					</div>

					<div class="pagination_wrap text-center" v-if="total>0">
						<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
						<!--<pagination :page="page" :total="total" :searchString='prev_page.q' v-on:pageTurn="pageTurn"></pagination>-->
					</div>
				</div>
			</div>

		</div>

		<!-- <question-merge :question="editQuestion" v-model="show_modal_info" :successHandler="submit" :cover="true">
    </question-merge>-->
		<question-modal :question="editQuestion" :tags="Clists" v-model="show_modal_info" type="merge" @successHandler="submit03" :cover="true"></question-modal>
		<question-modal :question="editQuestion" :tags="Clists" v-model="AUX.show_modal_info" @successHandler="submit02" :cover="true"></question-modal>



		<!--上传和模板-->
		<el-dialog title="上传文件" v-model="AUX.show_upload" size="">
			<div class="upload_dialog_list">
				<span @click="$api.downloadFromService('知识库导入模板.xlsx',$uri.静态文件baseurl+'/知识库导入模板.xlsx')" class="displayIB">
				  		<i class="glyphicon glyphicon-download font50"></i><br/>
				  		下载模板
				  	</span>
				<upload :action="$uri.knowledgeStore.postfile" :type="'post'" :accept="upload.type" :success="uploadSuccess" :error="uploadError_mixin" :before="beforeUpload_mixin">
					<div :title="'请上传'+upload.type+'文件'" class="text-center">
						<i class="glyphicon glyphicon-upload font50"></i><br/>
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
	import tree from '../module/tree'
	import questionMerge from './modules/merger_question.vue'
	import questionModal from './modules/edit_question.vue'
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
					callback();
				} else {
					callback();
				}
			};
			var validate2 = (rule, value, callback) => {
				let isObjEmpty = function(obj) {
					for(let i in obj) return false;
					return true;
				}
				if(isObjEmpty(this.editQuestion.rich_answer) && !value) {
					callback(new Error("请输入标准答案"));
				} else {
					callback();
				}
			};
			return {
				clusterProgressCount: "",
				clusterProgressLength: "",
				lastFinishTime: "",
				getClusterStatus: "",
				clusterProgress: "",
				front_end_ordered_qlists_arr: [],
				back_end_raw_data: {},

				智能整理: {
					status: 0,
					text: ['智能整理', '智能整理中&nbsp;<i class="el-icon-loading font12"></i>'],
					轮询时长: 2, //秒
				},

				show_modal_info: false,
				show_modal_info2: false,
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
				classify_index: {}, //分类id的索引
				total: 0,
				page: {
					page: 1,
					size: 15,
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
				question: {
					id: '',
					tag1: 0,
					tag2: null,
					question: '',
					similar_question: [""],
					answer: [''],
				},
				选中: [],
				选中item: [],
				tag2List: [],
				upload: {
					type: '|xls|xlsx',
				},

				AUX: {
					filterKeys: [{
							label: '全部',
							value: ''
						},
						{
							label: '标准问题',
							value: 'question'
						},
						{
							label: '相似问题',
							value: 'similar_question'
						},
						{
							label: '标准答案',
							value: 'answer'
						},
					],
					show_upload: false,
					show_modal_info: false,
				},
			}
		},
		created() {
			var v = this;
			v.editQuestion = v.genQuestion();
			this.searchs();
			this.getClassifyList();


		},

		//    beforeUpdate() {
		//      setTimeout(() => this.lastTbodyBorderNone(),
		//        1)
		//
		//
		//    },

		methods: {

			edit: function(id) {
				var v = this;
				v.editQuestion.merge_ids = []
				if(id) {
					this.$api.ajax('/questions/' + id, 'get').then(function(r) {

						v.editQuestion.id = r.id
						v.editQuestion.tag1 = r.tag1
						v.editQuestion.tag2 = r.tag2
						v.editQuestion.question = r.question
						v.editQuestion.points = r.points
						v.editQuestion.similar_question = r.similar_question
						v.editQuestion.answer = r.answer;
						v.editQuestion.rich_answer = r.rich_answer;
						v.editQuestion.updated = r.updated;
						v.AUX.show_modal_info2 = false;
						v.AUX.show_modal_info = true;
						// 格式化rich_answer
						let question = v.editQuestion
						for(var i = 0; i < question.rich_answer.length; i++) {
							let rich_answer = question.rich_answer[i]
							rich_answer["id"] = Date.now()
						}
					})
				} else {
					v.editQuestion = v.genQuestion();
					v.AUX.show_modal_info = true;
				}
			},
			edit_backup: function(id) {;
				var v = this;
				// v.$refs["editQuestion"].resetFields();
				if(id) {
					this.$api.ajax('/questions/' + id, 'get').then(function(r) {
						// 	v.editQuestion = r;
						v.editQuestion.id = r.id
						v.editQuestion.tag1 = r.tag1
						v.editQuestion.tag2 = r.tag2
						v.editQuestion.question = r.question
						v.editQuestion.similar_question = r.similar_question
						v.editQuestion.answer = r.answer;
						v.editQuestion.rich_answer = r.rich_answer;
						v.editQuestion.updated = r.updated;
						v.AUX.show_modal_info = true;
						// 格式化rich_answer
						let question = v.editQuestion
						for(var i = 0; i < question.rich_answer.length; i++) {
							let rich_answer = question.rich_answer[i]
							// if(rich_answer.type=="text"){
							// 	rich_answer["disabled"] = true;
							// }
							rich_answer["id"] = Date.now()
						}
					})
					v.AUX.show_modal_info = true;
				} else {
					v.editQuestion = {
						type: 0,
						id: '',
						tag1: v.page.tag1 || 0,
						tag2: v.page.tag2 || null,
						question: '',
						similar_question: [""],
						answer: [''],
						rich_answer: [],
						advanced_options: {
							switch: 1,
							priority: 2,
							valid_start: '',
							valid_end: '',
							start_switch: '',
							end_switch: '',
							keyword_switch: '',
							warning_switch: '',
						}
					};
					console.info(v.$refs)
					v.AUX.show_modal_info = true;
				}
			},

			clickSelect(item) {

				let GoalItem = item;

				let v = this;
				//点击一个，在前端分组后的数据中，被选中那个所在的组，判断有无其他被选中，
				//  1：如果无其他被选中，全组勾选
				//  2：有其他被选中，只选一个
				let selectedGroupId = item.group_id
				let selectedi;

				//如果已经选中，取消选中
				if(v.选中.indexOf(item.id) != -1) {
					v.选中.splice(v.选中.indexOf(item.id), 1);
					// v.选中item.splice(v.选中.indexOf(item.id), 1)

					var indexOfSelectedIn选中Item;
					for(var i = 0; i < v.选中item.length; i++) {
						if(v.选中item[i].id == item.id) {
							indexOfSelectedIn选中Item = i;
						}
					}

					v.选中item.splice(indexOfSelectedIn选中Item, 1)
				}

				//如果没被选中，看队友是否被选中
				else {
					v.front_end_ordered_qlists_arr.forEach((item, i) => {
						if(v.front_end_ordered_qlists_arr[i].data[0].group_id == selectedGroupId) {
							selectedi = i;
							//1：如果无其他被选中，全组勾选
							if(v.front_end_ordered_qlists_arr[i].data.every((item, l) => {
									return v.选中.indexOf(item.id) == -1
								})) {
								//选项之前没选中
								let selectedItemGroup_id = item.group_id;
								for(let i = 0; i < v.front_end_ordered_qlists_arr.length; i++) {
									if(v.front_end_ordered_qlists_arr[i].group_id == selectedItemGroup_id) {
										for(let j = 0; j < v.front_end_ordered_qlists_arr[i].data.length; j++) {
											v.选中.push(v.front_end_ordered_qlists_arr[i].data[j].id);
											v.选中item.push(v.front_end_ordered_qlists_arr[i].data[j]);
										}
									}
								}

								// v.选中 去重
								function arrayUniqueItem(array) {
									var result = [array[0]]; //结果数组
									//从第二项开始遍历
									for(var i = 1; i < array.length; i++) {
										//如果当前数组的第i项在当前数组中第一次出现的位置不是i，
										//那么表示第i项是重复的，忽略掉。否则存入结果数组
										if(array.indexOf(array[i]) == i) result.push(array[i]);
									}
									console.log(result);
									return result;
								}

								v.选中 = arrayUniqueItem(v.选中)

								// v.选中item 去重待写
								function unique(songs) {
									let result = {};
									let finalResult = [];
									for(let i = 0; i < songs.length; i++) {
										result[songs[i].name] = songs[i];
										//因为songs[i].name不能重复,达到去重效果,且这里必须知晓"name"或是其他键名
									}
									//console.log(result);{"羽根":{name:"羽根",artist:"air"},"晴天":{name:"晴天",artist:"周杰伦"}}
									//现在result内部都是不重复的对象了，只需要将其键值取出来转为数组即可
									for(item in result) {
										finalResult.push(result[item]);
									}
									//console.log(finalResult);[{name:"羽根",artist:"air"},{name:"晴天",artist:"周杰伦"}]
									return finalResult;
								}

								// v.选中item去重
								//将对象元素转换成字符串以作比较
								function obj2key(obj, keys) {
									var n = keys.length,
										key = [];
									while(n--) {
										key.push(obj[keys[n]]);
									}
									return key.join('|');
								}

								//去重操作
								function uniqeByKeys(array, keys) {
									var arr = [];
									var hash = {};
									for(var i = 0, j = array.length; i < j; i++) {
										var k = obj2key(array[i], keys);
										if(!(k in hash)) {
											hash[k] = true;
											arr.push(array[i]);
										}
									}
									return arr;
								}

								v.选中item = uniqeByKeys(v.选中item, ['id']);

								//          v.选中.push(item.id);
								//          v.选中item.push(item);

							}

							//2：如果有其他被选中，只选这一个
							else {
								v.选中.push(GoalItem.id);
								v.选中item.push(GoalItem)

								// v.back_end_raw_data.list.forEach((item02)=>{
								//   if(item02.id==selectedGroupId){
								//     v.选中item.push(item02)
								//   }
								// })

							}

							// 2：有其他被选中，只选一个
							//             if (!v.front_end_ordered_qlists_arr[i].data.every((item, l) => {
							//                 return v.选中.indexOf(item.id) == -1
							//               }))
							//             {
							//               if (v.选中.indexOf(item.id) != -1) {//如果已经选中
							//                 v.选中.splice(v.选中.indexOf(item.id), 1);
							//                 // v.选中item.splice(v.选中.indexOf(item.id), 1)
							//
							//
							//                 var indexOfSelectedIn选中Item;
							//                 for (var i = 0; i < v.选中item.length; i++) {
							//                   if (v.选中item[i].id == item.id) {
							//                     indexOfSelectedIn选中Item = i;
							//                   }
							//                 }
							//
							//                 v.选中item.splice(indexOfSelectedIn选中Item, 1)
							//               }
							//
							//               else {//选项之前没选中
							//                 let selectedItemGroup_id = item.group_id;
							//                 for (let i = 0; i < v.front_end_ordered_qlists_arr.length; i++) {
							//                   if (v.front_end_ordered_qlists_arr[i].group_id == selectedItemGroup_id) {
							//                     for (let j = 0; j < v.front_end_ordered_qlists_arr[i].data.length; j++) {
							//                       v.选中.push(v.front_end_ordered_qlists_arr[i].data[j].id);
							//
							//                       v.选中item.push(v.front_end_ordered_qlists_arr[i].data[j]);
							//                     }
							//                   }
							//                 }
							//
							//                 // v.选中 去重
							//                 function arrayUniqueItem(array) {
							//                   var result = [array[0]]; //结果数组
							// //从第二项开始遍历
							//                   for (var i = 1; i < array.length; i++) {
							// //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
							// //那么表示第i项是重复的，忽略掉。否则存入结果数组
							//                     if (array.indexOf(array[i]) == i) result.push(array[i]);
							//                   }
							//                   console.log(result);
							//                   return result;
							//                 }
							//
							//                 v.选中 = arrayUniqueItem(v.选中)
							//
							//
							//                 // v.选中item 去重待写
							//                 function unique(songs) {
							//                   let result = {};
							//                   let finalResult = [];
							//                   for (let i = 0; i < songs.length; i++) {
							//                     result[songs[i].name] = songs[i];
							//                     //因为songs[i].name不能重复,达到去重效果,且这里必须知晓"name"或是其他键名
							//                   }
							//                   //console.log(result);{"羽根":{name:"羽根",artist:"air"},"晴天":{name:"晴天",artist:"周杰伦"}}
							//                   //现在result内部都是不重复的对象了，只需要将其键值取出来转为数组即可
							//                   for (item in result) {
							//                     finalResult.push(result[item]);
							//                   }
							//                   //console.log(finalResult);[{name:"羽根",artist:"air"},{name:"晴天",artist:"周杰伦"}]
							//                   return finalResult;
							//                 }
							//
							//                 // v.选中item去重
							//                 //将对象元素转换成字符串以作比较
							//                 function obj2key(obj, keys) {
							//                   var n = keys.length,
							//                     key = [];
							//                   while (n--) {
							//                     key.push(obj[keys[n]]);
							//                   }
							//                   return key.join('|');
							//                 }
							//
							//                 //去重操作
							//                 function uniqeByKeys(array, keys) {
							//                   var arr = [];
							//                   var hash = {};
							//                   for (var i = 0, j = array.length; i < j; i++) {
							//                     var k = obj2key(array[i], keys);
							//                     if (!(k in hash)) {
							//                       hash[k] = true;
							//                       arr.push(array[i]);
							//                     }
							//                   }
							//                   return arr;
							//                 }
							//
							//                 v.选中item = uniqeByKeys(v.选中item, ['id']);
							//
							// //          v.选中.push(item.id);
							// //          v.选中item.push(item);
							//               }
							//             }
						}
					})

				}

				//
				//         else {//选项之前没选中
				//           let selectedItemGroup_id = item.group_id;
				//           for (let i = 0; i < v.front_end_ordered_qlists_arr.length; i++) {
				//             if (v.front_end_ordered_qlists_arr[i].group_id == selectedItemGroup_id) {
				//               for (let j = 0; j < v.front_end_ordered_qlists_arr[i].data.length; j++) {
				//                 v.选中.push(v.front_end_ordered_qlists_arr[i].data[j].id);
				//
				//                 v.选中item.push(v.front_end_ordered_qlists_arr[i].data[j]);
				//               }
				//             }
				//           }
				//
				//           // v.选中 去重
				//           function arrayUniqueItem(array) {
				//             var result = [array[0]]; //结果数组
				// //从第二项开始遍历
				//             for (var i = 1; i < array.length; i++) {
				// //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
				// //那么表示第i项是重复的，忽略掉。否则存入结果数组
				//               if (array.indexOf(array[i]) == i) result.push(array[i]);
				//             }
				//             console.log(result);
				//             return result;
				//           }
				//
				//           v.选中 = arrayUniqueItem(v.选中)
				//
				//
				//           // v.选中item 去重待写
				//           function unique(songs) {
				//             let result = {};
				//             let finalResult = [];
				//             for (let i = 0; i < songs.length; i++) {
				//               result[songs[i].name] = songs[i];
				//               //因为songs[i].name不能重复,达到去重效果,且这里必须知晓"name"或是其他键名
				//             }
				//             //console.log(result);{"羽根":{name:"羽根",artist:"air"},"晴天":{name:"晴天",artist:"周杰伦"}}
				//             //现在result内部都是不重复的对象了，只需要将其键值取出来转为数组即可
				//             for (item in result) {
				//               finalResult.push(result[item]);
				//             }
				//             //console.log(finalResult);[{name:"羽根",artist:"air"},{name:"晴天",artist:"周杰伦"}]
				//             return finalResult;
				//           }
				//
				//           // v.选中item去重
				//           //将对象元素转换成字符串以作比较
				//           function obj2key(obj, keys) {
				//             var n = keys.length,
				//               key = [];
				//             while (n--) {
				//               key.push(obj[keys[n]]);
				//             }
				//             return key.join('|');
				//           }
				//
				//           //去重操作
				//           function uniqeByKeys(array, keys) {
				//             var arr = [];
				//             var hash = {};
				//             for (var i = 0, j = array.length; i < j; i++) {
				//               var k = obj2key(array[i], keys);
				//               if (!(k in hash)) {
				//                 hash[k] = true;
				//                 arr.push(array[i]);
				//               }
				//             }
				//             return arr;
				//           }
				//
				//           v.选中item = uniqeByKeys(v.选中item, ['id']);
				//
				// //          v.选中.push(item.id);
				// //          v.选中item.push(item);
				//         }

			},

			智能整理func01() {
				var v = this;
        window.整理开始后收到状态3的次数=0

				var param = {
					"question": ""
				};
				if(v.智能整理.status == 1) return false;
				v.$api.ajaxReturnAllNoLoadingNoError('/start_cluster_service', 'post', param).then((data) => {
					data =data.data
					v.智能整理.status = 1;
					// ;
					v.$message({
						message: '本次整理大约需 要2-10分钟，请耐心等待',
						type: 'info'
					});
				})
				v.智能整理func01pollQuery()

			},

			智能整理func01pollQuery(multiple=1) {
				var v = this;

				setTimeout(() => {
					v.$api.ajaxReturnAllNoLoading('/query_cluster_status', 'get').then(({code,data,msg})=> {
						if(code!==0){
							v.$alert('知识库整理失败--'+msg);
							v.getClusterStatus = 0;
						}
						try{
							v.getClusterStatus = data.task_status
							if(data.task_status < 3) {
								v.智能整理func01pollQuery(1)
								v.clusterProgress = data.progress
								v.clusterProgressCount = data.count || v.clusterProgressCount;
								v.clusterProgressLength = data.length || v.clusterProgressLength;
							}
	            if(data.task_status == 3) {
								v.clusterProgressCount = data.length
								v.clusterProgressLength = data.length
								v.lastFinishTime = data.process_time
								v.智能整理.status = 0;
	              window.整理开始后收到状态3的次数++

								if(window.整理开始后收到状态3的次数===1){
	                v.$alert('知识库整理完成');
	                window.整理开始后收到状态3的次数=undefined
	              }

								v.searchs()
							}
						}catch(err){
							console.log('轮询数据出错了',err)
						}
					}).catch(err=>{
						if(multiple<=5){
							v.智能整理func01pollQuery(multiple+1);
						}else{
							v.$alert('知识库整理失败--'+err.toString());
						}
					})
				}, 3000)
			},

			智能整理func() {
				var v = this;

				setInterval(() => {
					v.$api.ajaxReturnAllNoLoadingNoError('/query_cluster_status', 'get')
						.then(data => {
							//
							v.clusterProgress = data.progress * 100 + "%"

						})
				}, 3000)

				v.$api.ajax('/send_msg_nlp', 'post')
					.then(data => {
						v.$message({
							message: '本次整理大约需 要2-10分钟，请耐心等待”',
							type: 'info'
						});
						v.训练信息.status = 1;
						v.轮询训练模型();
					})

			},

			genQuestion() {
				return {
					type: 0,
					id: '',
					tag1: 0,
					tag2: null,
					question: '',
					similar_question: [""],
					answer: [""],
					rich_answer: [],
					points: [],
					merge_ids: [],
					advanced_options: {
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
					r.forEach((val, i) => {
						v.classify_index[val.id] = [i + 2];
						val.edit = false;
						val.copy = val.name;
						val.child.forEach((val2, j) => {
							v.classify_index[val2.id] = [i + 2, j];
							val2.edit = false;
							val2.copy = val2.name;
						})
					})
					v.Clists = v.Clists.slice(0, 2);
					v.Clists = v.Clists.concat(r);
				})
			},

			updateTag(i, j = undefined) {
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
									v.Clists[i].name = v.Clists[i].copy;
									v.Clists[i].edit = false;
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
									/*var item = {
									                    id:data,
									                    name:v.Clists[i].child[j].name,
									                    edit:false
									                };
									                v.Clists[i].child.shift();
									                v.Clists[i].child.unshift(item);*/
									v.Clists[i].child[j].id = data;
									v.Clists[i].child[j].name = v.Clists[i].child[j].copy;
									v.Clists[i].child[j].edit = false;
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
				if(!i) {
					this.Clists.splice(2, i, {
						name: '',
						copy: '',
						edit: true,
						id: '',
						child: [],
					})
				} else {
					this.Clists[i].child.unshift({
						name: '',
						copy: '',
						edit: true,
						id: '',
					})
				}
			},
			changeTag(i, j = '') {
				this.page.tag1 = i;
				this.page.tag2 = j;
				this.searchs();
			},
			beforeSearchs() {
				//        this.选中 = [];
				//        this.选中item = [];
			},
			changeFilterKey(filter) {
				let v = this;
				v.page.q_filed = filter.value;
				v.page.q_name = filter.name;
				v.searchs(1);
			},
			changeFilterSort(akey, isactive, status) {
				this.page.sort_filed = akey;
				this.page.sort = 0 - this.page.sort;
				this.searchs();
			},
			//问题管理函数
			searchs(index) {

				var v = this;
				if(index) v.page.page = index;
				this.$api.ajax('/question_cluster', 'get', v.page).then(function(r) {
					v.back_end_raw_data = r;
					//
					var mergeArray = [];
					for(var i in r.list) {
						for(var j in r.list[i]) {
							mergeArray.push(r.list[i][j])
						}
					}

					v.Qlists = mergeArray;
					v.total = r.total;
					//记录本次的搜索条件
					v.prev_page = v.$api.deepCopy(v.page);

					// let first_group_id_arr = []
					//
					// for (var i = 0; i < r.list.length; i++) {
					//   first_group_id_arr.push(r.list[i].group_id)
					//   // r.list[i].group_id
					// }
					r.list = mergeArray;

					var map = {},
						dest = [];
					for(var i = 0; i < r.list.length; i++) {
						var ai = r.list[i];
						if(!map[ai.group_id]) {
							dest.push({
								tag1: ai.tag1,
								question: ai.question,
								status: ai.status,
								rich_answer: ai.rich_answer,
								created: ai.created,
								similar_cluter: ai.similar_cluter,
								count: ai.count,
								cid: ai.cid,
								updated: ai.updated,
								user_id: ai.user_id,
								id: ai.id,
								similar_question: ai.similar_question,
								tag2: ai.tag2,
								group_id: ai.group_id,
								answer: ai.answer,

								data: [ai]
							});
							map[ai.group_id] = ai;
						} else {
							for(var j = 0; j < dest.length; j++) {
								var dj = dest[j];
								if(dj.group_id == ai.group_id) {
									dj.data.push(ai);
									break;
								}
							}
						}
					}
					v.front_end_ordered_qlists_arr = dest

				});
				// $api.ajaxReturnAllNoLoadingNoError

				this.$api.ajaxReturnAllNoLoading('/query_cluster_status', 'get').then(({code,data,msg}) => {
					if(code!==0){
						v.getClusterStatus=0;
						v.$alert('知识库整理出错--'+msg);
						return false;
					}
					try{
						v.getClusterStatus = data.task_status
						v.lastFinishTime = data.process_time

	          if(data.task_status==0||data.task_status==1){
						  v.智能整理.status = data.task_status
						}

						if(data.task_status == 1) {
							v.智能整理func01pollQuery(1)

							v.clusterProgressCount = data.count
							v.clusterProgressLength = data.length
						}
					}catch(err){
						console.log('轮询数据出错了',err)
					}
				}).catch(err=>{
					v.智能整理func01pollQuery(2);
				})

				// v.$api.ajaxReturnAllNoLoadingNoError('/query_cluster_status', 'get')
				//   .then(
				//   )

			},

			// {
			// 	var v = this;
			// 	v.beforeSearchs();
			// 	if(index) v.page.page = index;
			// 	this.$api.ajax('/questions', 'get', v.page).then(function(r) {
			// 		v.Qlists = r.list;
			// 		v.total = r.total;
			// 		//记录本次的搜索条件
			// 		v.prev_page = v.$api.deepCopy(v.page);
			// 	});
			//  	},

			// dataHandle: function (index) ,

			merge01: function(id, 选中item) {
				var v = this;
				// v.$refs["editQuestion"].resetFields();
				v.editQuestion.answer = []
				// // ;;

				if(id) {
					this.$api.ajax('/questions/' + id, 'get').then(function(r) {
						// 	v.editQuestion = 选中item[0];
						选中item[0].id = 选中item[0].id
						v.editQuestion.tag1 = 选中item[0].tag1
						v.editQuestion.tag2 = 选中item[0].tag2

						v.editQuestion.question = 选中item[0].question

						v.editQuestion.similar_question = v.$api.deepCopy(选中item[0].similar_question)
						v.editQuestion.rich_answer = v.$api.deepCopy(选中item[0].rich_answer);
						v.editQuestion.answer = v.$api.deepCopy(选中item[0].answer);
						v.editQuestion.updated = 选中item[0].updated;

						// v.editQuestion = v.$api.deepCopy(选中item[0])
						// v.$api.deepCopy()

						v.editQuestion.merge_ids = []

						// 格式化rich_answer
						let question = v.editQuestion
						for(var i = 0; i < question.rich_answer.length; i++) {
							let rich_answer = question.rich_answer[i]
							// if(rich_answer.type=="text"){
							// 	rich_answer["disabled"] = true;
							// }
						}

						var questionArray = []
						for(var i = 1; i < v.选中item.length; i++) {
							v.editQuestion.similar_question.push(v.选中item[i].question);

							for(var j = 0; j < v.选中item[i].similar_question.length; j++) {
								v.editQuestion.similar_question.push(v.选中item[i].similar_question[j]);
							}

							for(var j = 0; j < v.选中item[i].answer.length; j++) {
								v.editQuestion.answer.push(v.选中item[i].answer[j]);
							}

							for(var j = 0; j < v.选中item[i].rich_answer.length; j++) {
								v.editQuestion.rich_answer.push(v.选中item[i].rich_answer[j]);
							}

							// v.editQuestion.similar_question.filter((item)=>{
							//   return item!="";
							// })

							v.editQuestion.similar_question = v.editQuestion.similar_question.filter((item) => {
								return item != ""
							})
							 ;

							// questionArray.push(v.选中item[i].answer);
						}
						// questionArray去重

						// v.editQuestion.answer = questionArray;

						v.show_modal_info = true;

					})

				} else {
					v.editQuestion = {
						type: 0,
						id: '',
						tag1: v.page.tag1 || 0,
						tag2: v.page.tag2 || null,
						question: '',
						similar_question: [""],
						answer: [''],
						rich_answer: [],
						advanced_options: {
							switch: 1,
							priority: 2,
							valid_start: '',
							valid_end: '',
							start_switch: '',
							end_switch: '',
							keyword_switch: '',
							warning_switch: '',
						}
					};
					console.info(v.$refs)
				}
				v.show_modal_info = true;

			},
			merge() {
				let v = this;
				var item = v.$api.deepCopy(v.选中item);
				v.editQuestion = v.genQuestion();
				v.editQuestion.similar_question = [];
				v.editQuestion.answer = [];
				item.forEach((val, i) => {
					v.editQuestion.merge_ids.push(val.id);
					if(i == 0) {
						v.editQuestion.question = val.question;
					} else {
						v.editQuestion.similar_question.push(val.question);
					}
					v.editQuestion.similar_question = v.editQuestion.similar_question.concat(val.similar_question.filter(val => val.trim() != ''));
					v.editQuestion.answer = v.editQuestion.answer.concat(val.answer.filter(val => val.trim() != ''));
					v.editQuestion.rich_answer = v.editQuestion.rich_answer.concat(val.rich_answer);
					v.editQuestion.points = v.editQuestion.points.concat(val.points);
				})
				//去重
				v.editQuestion.similar_question = [...new Set(v.editQuestion.similar_question)];
				v.editQuestion.answer = [...new Set(v.editQuestion.answer)];
				v.editQuestion.points = [...new Set(v.editQuestion.points)];
				v.show_modal_info = true;
			},
			submit03(result) {
				let v = this;
				v.选中item = [];
				v.选中 = [];
				v.searchs();
			},
			submit(event, question) {
				let v = this;

				question.merge_ids = [];

				for(var i = 0; i < v.选中item.length; i++) {
					question.merge_ids.push(v.选中item[i].id)
				}

				this.$api.ajax('/question_cluster', 'post', question).then(function(r) {
					v.show_modal_info = false;
					v.$message({
						type: 'success',
						message: '知识整理成功!'
					});
					v.searchs();
				})

				v.选中item = [];
			},

			submit02(event, question) {
				this.searchs();
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

				//        this.lastTbodyBorderNone()
				let v = this;
				v.选中 = [];
				v.选中item = []
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
			uploadSuccess(res) {
				console.log(res)
				this.uploadSuccess_mixin(res);
				this.AUX.show_upload = false;
				this.page.sort_filed = 'created',
					this.page.sort = -1,
					this.searchs(1);
			},
			input_focus(val, event) {
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
			questionMerge,
			questionModal
		}
	}
</script>
<style lang="scss" scoped>
	@import '../../assets/scss/api.scss';
	$th_widths: (0.3, 0.4, 0.1, 0.1, 0.1);
	@include simulateTableThWidth($th_widths, true);
	$color1: #bfe2ff;
	.store {
		position: relative;
		height: 100%;
		/*.simulate_table {*/
		/*.th, .td {*/
		/*&:nth-child(1) {*/
		/*width: 30%;*/
		/*}*/
		/*&:nth-child(2) {*/
		/*width: 40%;*/
		/*}*/
		/*&:nth-child(3) {*/
		/*width: 10%;*/
		/*}*/
		/*&:nth-child(4) {*/
		/*width: 10%;*/
		/*}*/
		/*&:nth-child(5) {*/
		/*width: 10%;*/
		/*}*/
		/*}*/
		/*}*/
		.empty_table img {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
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
	/*.classify .addTag{width:78%; color:#bbb;line-height:30px; border:1px solid #ccc ; text-align:center; font-size:30px; margin:auto; cursor:pointer;}
      .classify .addTag:hover {color:$color1; border-color:$color1;}}*/

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
		display: inline-block;
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

	.sum_li {
		height: 20px;
		background-color: #E7EFF3
	}

	.sum_td {
		&:nth-child(1) {
			width: 30%;
		}
		&:nth-child(2) {
			width: 40.2%;
		}
		&:nth-child(3) {
			width: 12%;
		}
		&:nth-child(4) {
			width: 10%;
		}
		&:nth-child(5) {
			width: 10%;
		}
		display: inline-block;
		height: 10px;
		line-height: 20px;
		font-size: 12px;
	}

	.processing-time {
		line-height: 30px;
	}
	/*.last_sum_li{*/
	/*display: none;*/
	/*}*/

	.current_edtion {
		font-size: 12px;
		font-weight:normal;
		color:#8b99a7;
	}

	.selected {
		position: relative;
		background: lighten(yellow, 40%);
		&:after {
			content: '';
			position: absolute;
			top: 0;
			left: 0px;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0);
		}
		.status-using,
		.operate-edit,
		.status-disable,
		.operate-remove {
			color: #b8c9d3;
			&:hover {
				color: #b8c9d3;
			}
		}
	}

	.sum_td {
		text-align: left;
	}
</style>
