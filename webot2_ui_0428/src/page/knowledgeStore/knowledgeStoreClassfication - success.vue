<template>
  <div class="knowledgestore store flex flex-2">

    <div class="flex-right">
      <div class="page_title">
        <template v-if="page.tag1===''">知识库整理</template>
        <span>当前更新版本01：</span>
        <template v-if="page.tag1===0">未分类</template>
        <template v-if="page.tag1">
          {{classify_index[page.tag1].name}}<span
          v-if="classify_index[page.tag2]"> / {{classify_index[page.tag2].name}}</span>
        </template>
      </div>
      <div class="">

        <div class="input-group search_wrap clearfix">
          <Input v-model="page.q" size="small" @on-enter.prevent='searchs(1)'>
          <Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
            <Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
          </Select>
          <Button slot="append" icon="search" @click="searchs(1)"></Button>
          </Input>
          <span>迭代次数</span>


          <button v-authority="'训练模型'" class="my-btn my-btn-info-f pull-right"
                  @click="()=>{if(智能整理信息.status==0) 智能整理func();}" v-html="智能整理信息.text[智能整理信息.status]"
                  :class="'test'+智能整理信息.status"></button>

        </div>
        <div v-if="total>0 || prev_page.q!=''" class="table_wrap">
          <div class="table4 simulate_table">
            <ul class="thead">
              <li class="tr">
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

            <ul class="tbody" v-for="(arr,index) in front_end_ordered_qlists_arr"
                :class="index==front_end_ordered_qlists_arr.length-1? 'last_tbody':''">
              <li class="tr" v-for="item in arr.data" :class="item.status?'':'disable'">
                <div class="td">
                  <span
                    :class="选中.indexOf(item.id)!=-1 ? 'is-checked el-checkbox__input':'el-checkbox__input'"
                    @click.stop="clickSelect(item)">
										<span class="el-checkbox__inner"></span>
									</span>

                  <span class="has_check">
										<span v-if="prev_page.q_filed=='question'||prev_page.q_filed==''"
                          v-html="filterSerachStringAndLimitNum(item.question,prev_page.q,20)"></span>
										<span v-else v-html="item.question"></span>
										<span v-if="prev_page.q!=''&&item.similar_question.indexOf(prev_page.q)>-1"
                          class="keyt">[相似问题]</span>
									</span>
                </div>

                <div class="td">
                  <el-tooltip popper-class="black html" v-if="prev_page.q_filed=='answer'||prev_page.q_filed==''">
                    <div slot="content" v-html="filterSerachStringAndLimitNum(item.answer,prev_page.q,300)"></div>
                    <p class="text" v-html="filterSerachStringAndLimitNum(item.answer,prev_page.q,29)"></p>
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
                <div class="td">
                  <p class="operate">
                    <span v-if="!item.status" v-authority="'机器人知识库-知识库-禁用'"
                          class="operate-disable glyphicon glyphicon-ban-circle pointer"
                          @click.stop="able('1',item.id)"></span>
                    <!--<span v-if="item.status" v-authority="'机器人知识库-知识库-禁用'"-->
                    <!--class="operate-enable glyphicon glyphicon-ok-sign pointer"-->
                    <!--@click.stop="able('0',item.id)"></span>-->
                    <span class="operate-edit glyphicon glyphicon-pencil pointer" @click.stop="edit(item.id)"
                          v-authority="'机器人知识库-知识库-修改'"></span>
                    <span class="operate-delete glyphicon glyphicon-trash pointer" @click.stop="del(item)"
                          v-authority="'机器人知识库-知识库-删除'"></span>
                  </p>
                </div>
              </li>
              <li class="sum_li" v-if="arr.data.length">
                <div class=" sum_td"></div>
                <div class=" sum_td"></div>
                <div class=" sum_td">合计:</div>
                <div class=" sum_td"></div>

              </li>
            </ul>

            <ul class="tfoot" v-if="Qlists.length>0">
              <li class="tr">
                <div class="td">
									<span @click="全选()"
                        :class="选中.length==Qlists.length?'is-checked el-checkbox__input':'el-checkbox__input'">
										<span class="el-checkbox__inner">&emsp;&emsp; 全选</span>
									</span>
                </div>
                <div class="td" v-show="选中item.length!=0">
                  <el-button @click="mergeQuestion()" size="small">合并</el-button>
                </div>
              </li>
            </ul>
          </div>

          <div class="pagination_wrap text-center" v-if="total>0">
            <el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size"
                           @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
            <!--<pagination :page="page" :total="total" :searchString='prev_page.q' v-on:pageTurn="pageTurn"></pagination>-->
          </div>
        </div>
        <div v-else class="empty_table">
          <img src="../../assets/img/add_icon.png" @click="edit(0)" class="pointer"/>
        </div>
      </div>

    </div>

    <question-merge :question="editQuestion" v-model="show_modal_info"  :successHandler="submit">

    </question-merge>
    <modal v-model="show_modal_info2" size="md" :backdrop='false'>
      <div slot="title">
        <h4 class="modal-title">
          <b>问题关联编辑</b>
        </h4>
      </div>
      <div slot="default" class="modal-body correlation-body">
        <form class="form-horizontal" role="form" name="ku1">
          <div class="form-group">
            <label class="col-sm-2">标准问题</label>
            <div class="col-sm-9">
              {{editQuestion.question}}
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2">分类<span class="red">&emsp;*</span></label>
            <div class="col-sm-10 row">
							<span class="col-sm-5">
								<select v-model="editQuestion.tag1" class="form-control">
									<option v-for="op in Clists" v-if="op.id!==''" v-bind:value="op.id">{{op.name}}</option>
								</select>
							</span>
              <span class="col-sm-5">
								<select v-model="editQuestion.tag2" class="form-control">
									<option v-bind:value="null">未分类</option>
									<option v-for="op2 in tag2List" v-if="op2.id" v-bind:value="op2.id">{{op2.name}}</option>
								</select>
							</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2">相似问题</label>
            <div class="col-sm-9 clearfix">
              <template class="form-group-special" v-for=" (value,index) in editQuestion.similar_question">
                <span class="similar-question">{{editQuestion.similar_question[index]}}</span>&emsp;
              </template>
            </div>
          </div>
          <div class="form-group">
            <label for="standardAnswer" class="col-sm-2">标准回答<span class="red">&emsp;*</span></label>
            <div class="col-sm-9">
              <div class="form-group-special" v-for=" (val,index) in editQuestion.answer">
                <textarea rows="4" placeholder="请输入标准答案" v-model="editQuestion.answer[index]"
                          class="form-control input-special-90"></textarea>
                <span @click="editQuestion.answer.splice(index,1)"
                      class="glyphicon glyphicon-remove remove-similarQuestion"></span>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div slot="footer" class="">
        <el-button @click="show_modal_info2 = false">取消</el-button>
        <el-button type="primary" @click="submit2">提交</el-button>
      </div>
    </modal>

    <!--上传和模板-->
    <el-dialog title="上传文件" v-model="AUX.show_upload" size="">
      <div class="upload_dialog_list">
					<span @click="$api.downloadFromService('知识库导入模板.xlsx',$uri.静态文件baseurl+'/知识库导入模板.xlsx')" class="displayIB">
				  		<i class="glyphicon glyphicon-download font50"></i><br/>
				  		下载模板
				  	</span>
        <upload :action="$uri.knowledgeStore.postfile" :type="'post'" :accept="upload.type" :success="uploadSuccess"
                :error="uploadError_mixin" :before="beforeUpload_mixin">
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
  import questionMerge from './modules/edit_question.vue'
  import sort from '../module/表排序箭头'
  import {Modal, ProgressBar, Dropdown, Tooltip} from 'uiv'
  import pagination from '../module/pagination'
  import handler from './mixin.js'
  import upload from '../module/upload'
  import upload_mixin from '../module/upload_mixin.js'

  export default {
    mixins: [handler, upload_mixin],
    data() {
      var validate1 = (rule, value, callback) => {
        if (value && value.indexOf('$') != -1) {
          callback(new Error("不允许使用'$'字符"));
        } else {
          callback();
        }
      };
      var validate2 = (rule, value, callback) => {
        let isObjEmpty = function (obj) {
          for (let i in obj) return false;
          return true;
        }
        if (isObjEmpty(this.editQuestion.rich_answer) && !value) {
          callback(new Error("请输入标准答案"));
        } else {
          callback();
        }
      };
      return {

        front_end_ordered_qlists_arr: [],
        back_end_ordered_qlists_arr: [],

        智能整理信息: {
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
        classify_index: {},     //分类id的索引
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
        选中: [], //需要关联的问题集
        选中item: [],
        tag2List: [],
        upload: {
          type: '|xls|xlsx',
        },
        AUX: {
          filterKeys: [
            {label: '全部', value: ''},
            {label: '标准问题', value: 'question'},
            {label: '相似问题', value: 'similar_question'},
            {label: '标准答案', value: 'answer'},
          ],
          show_upload: false,
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

      clickSelect(item) {
        let v = this;
        if (v.选中.indexOf(item.id) != -1) {//如果已经选中
          v.选中.splice(v.选中.indexOf(item.id), 1);
          v.选中item.splice(v.选中.indexOf(item.id), 1)
        }
        else {//没有选中

          let selectedItemGroup_id = item.group_id;
          //  ;

          for (let i = 0; i < v.front_end_ordered_qlists_arr.length; i++) {

            if (v.front_end_ordered_qlists_arr[i].group_id == selectedItemGroup_id) {
              for (let j = 0; j < v.front_end_ordered_qlists_arr[i].data.length; j++) {
                v.选中.push(v.front_end_ordered_qlists_arr[i].data[j].id);
                v.选中item.push(v.front_end_ordered_qlists_arr[i].data[j]);
              }

            }
          }


//           ;
//          v.选中.push(item.id);
//          v.选中item.push(item);
        }
      },

//      lastTbodyBorderNone() {
//        let tbodyArray =
//          document.getElementsByClassName('tbody');
//             ;
//        tbodyArray[tbodyArray.length - 1].style.setProperty('border', 'none')
//        //最后一个 .tbody的边框置空
//      },


      智能整理func() {
        var v = this;
        v.$api.ajax('/question_cluster', 'get')
          .then(data => {
            v.$message({
              message: '智能整理开始',
              type: 'info'
            });
            v.智能整理信息.status = 1;
            v.轮询训练模型();
          })
      },
      轮询训练模型() {
        let v = this;
        setTimeout(() => {
          v.$api.ajaxReturnAllNoLoading('/question_cluster', 'get', v.page)
            .then(data => {
              if (data.code == 0) {
                if (data.train) {
                  v.轮询训练模型();
                } else {
                  if (!v.$api.readingThisPage() || v.$api.isMinWindow()) {
                    v.$api.newInfo(data.msg || '训练完成');
                  }


                  v.$alert(data.msg || '训练完成', '提示');
                  v.智能整理信息.status = 0;
                }
              } else {
                v.$message({
                  message: data.msg,
                  type: 'error'
                })
                v.智能整理信息.status = 0;
              }
            }).catch(err => {
            v.智能整理信息.status = 0;
          })
        }, v.智能整理信息.轮询时长 * 1000);

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
        this.$api.ajax(v.$uri.knowledgeStore.knowledge.tags, 'get').then(function (r) {
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
        for (let x = 0; x < list.length; x++) {
          if (x != index3 && list[x].name.trim() == list[index3].copy.trim()) {
            this.$message({
              message: "分类名重复了",
              type: 'warning'
            });
            return false;
          }
        }
        if (j == undefined) {
          if (v.Clists[i].copy.trim() !== '') {
            if (!v.Clists[i].id) {
              this.$api.ajax('/questions/tags', 'post', {
                pid: 0,
                name: v.Clists[i].copy.trim()
              })
                .then(function (data) {
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
                .then(function (data) {
                  v.Clists[i].edit = false;
                  v.Clists[i].name = v.Clists[i].copy.trim();
                })
            }
          }
        } else {
          if (v.Clists[i].child[j].copy.trim() !== '') {
            if (!v.Clists[i].child[j].id) {
              this.$api.ajax('/questions/tags', 'post', {
                pid: v.Clists[i].id,
                name: v.Clists[i].child[j].copy.trim()
              })
                .then(function (data) {
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
                .then(function (data) {
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
              if (j == undefined) {
                v.Clists.splice(i, 1);
              } else {
                v.Clists[i].child.splice(j, 1);
              }
              if (id == v.page.tag1 || id == v.page.tag2) {
                if (id == v.page.tag2)
                  v.page.tag2 = '';
                if (id == v.page.tag1)
                  v.page.tag1 = '';
                v.searchs(1);
              }
            })
        });
      },
      addTag(i = undefined) {
        if (!i) {
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
        if (index) v.page.page = index;
        this.$api.ajax('/question_cluster', 'get', v.page).then(function (r) {

          //  ;
          var mergeArray = [];
          for (var i in r.list) {
            for (var j in r.list[i]) {
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
          for (var i = 0; i < r.list.length; i++) {
            var ai = r.list[i];
            if (!map[ai.group_id]) {
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
              for (var j = 0; j < dest.length; j++) {
                var dj = dest[j];
                if (dj.group_id == ai.group_id) {
                  dj.data.push(ai);
                  break;
                }
              }
            }
          }
          v.front_end_ordered_qlists_arr = dest

        });
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

      mergeQuestion: function () {
        var v = this;

         ;
        v.选中item[0].advanced_options=
         {
          switch: 1,
            priority: 2,
            valid_start: '',
            valid_end: '',
            start_switch: '',
            end_switch: '',
            keyword_switch: '',
            warning_switch: '',
          };


        v.editQuestion = v.选中item[0]



        v.show_modal_info = true;
      },


      edit: function (id) {
        var v = this;
        // v.$refs["editQuestion"].resetFields();
        if (id) {
          this.$api.ajax('/questions/' + id, 'get').then(function (r) {
            // 	v.editQuestion = r;
            v.editQuestion.id = r.id
            v.editQuestion.tag1 = r.tag1
            v.editQuestion.tag2 = r.tag2
            v.editQuestion.question = r.question
            v.editQuestion.similar_question = r.similar_question
            v.editQuestion.answer = r.answer;
            v.editQuestion.rich_answer = r.rich_answer;
            v.editQuestion.updated = r.updated;

            // 格式化rich_answer
            let question = v.editQuestion
            for (var i = 0; i < question.rich_answer.length; i++) {
              let rich_answer = question.rich_answer[i]
              // if(rich_answer.type=="text"){
              // 	rich_answer["disabled"] = true;
              // }
              rich_answer["id"] = Date.now()
            }
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

      submit(event, question) {
        let v = this;
        if (!question.id) {
          delete question.updated;
          this.$api.ajax('/questions', 'post', question).then(function (r) {
            v.show_modal_info = false;
            v.$message({
              type: 'success',
              message: '新增成功!'
            });
            v.searchs();
          })
        } else {
          this.$api.ajax('/questions/' + question.id, 'put', question).then(function (r) {
            v.show_modal_info = false;
            v.$message({
              type: 'success',
              message: '修改成功!'
            });
            v.searchs();
          })
        }
      },
      //关联选中问题
      correlation() {
        var v = this;
        var item = v.$api.deepCopy(v.选中item, []);
        var id = v.$api.deepCopy(v.选中, []);
        var bigest_id = id[0],
          bigest = 0;
        for (var i = 1; i < id.length; i++) {
          if (id[i] > bigest_id) {
            bigest = i;
            bigest_id = id[i];
          }
        }
        v.$api.deepCopy(item[bigest], v.editQuestion);
        v.editQuestion.similar_question = v.editQuestion.similar_question.split("$$");
        v.editQuestion.answer = v.editQuestion.answer.split("$$");
        for (var i = 0; i < item.length; i++) {
          if (item[i].id != v.editQuestion.id) {
            v.editQuestion.similar_question.push(item[i].question);
            v.editQuestion.similar_question = v.editQuestion.similar_question.concat(item[i].similar_question.split("$$"));
            v.editQuestion.answer = v.editQuestion.answer.concat(item[i].answer.split("$$"));
          }
        }
        for (var i = 0; i < v.editQuestion.similar_question.length; i++) {
          if (v.editQuestion.similar_question[i].trim() == '') {
            v.editQuestion.similar_question.splice(i, 1);
            i--;
          }
        }
        v.show_modal_info2 = true;
      },
      //提交关联
      submit2() {
        var content = '',
          v = this;
        let question = v.$api.deepCopy(v.editQuestion);
        delete question.type;
        delete question.advanced_options; //暂时
        for (var i = 0; i < this.选中item.length; i++) {
          if (this.选中item[i].id != question.id) {
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
          if (!x) {
            v.$message({
              type: 'error',
              message: y
            });
            return false;
          }
          v.$api.ajax('/questions/' + question.id, 'put', question).then(function (r) {
            v.show_modal_info2 = false;
            v.选中 = [];
            v.选中item = [];
            v.$message({
              type: 'success',
              message: '关联成功!'
            });
            v.searchs();
          })
          for (var i = 0; i < v.选中.length; i++) {
            if (v.选中[i] != question.id) {
              v.$api.ajax('/questions/' + v.选中[i], 'delete').then(function (r) {
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
        if (id) ids.push(id);
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
          }).then(function (r) {
            v.$message({
              type: 'success',
              message: '删除成功!'
            });
            v.searchs();
          })
        });
      },
      pageTurn: function () {
        this.searchs();
//        this.lastTbodyBorderNone()
      },
      全选() {
        let v = this;
        if (v.选中.length !== v.Qlists.length) {
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
      questionMerge
    }
  }
</script>
<style lang="scss" scoped>

  $color1: #bfe2ff;
  .store {
    position: relative;
    height: 100%;
    .simulate_table {
      .th, .td {
        &:nth-child(1) {
          width: 30%;
        }
        &:nth-child(2) {
          width: 39%;
        }
        &:nth-child(3) {
          width: 10%;
        }
        &:nth-child(4) {
          width: 10%;
        }
        &:nth-child(4) {
          width: 10%;
        }
      }
    }
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
    font-size: 13px;;
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
      width: 39%;
    }
    &:nth-child(3) {
      width: 10%;
    }
    &:nth-child(4) {
      width: 10%;
    }
    &:nth-child(4) {
      width: 10%;
    }
    display: inline-block;
    height: 10px;
    line-height: 20px;
    font-size: 12px;
  }

  /*.last_sum_li{*/
  /*display: none;*/
  /*}*/


</style>
