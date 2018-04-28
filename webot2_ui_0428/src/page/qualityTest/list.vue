<template>
    <div class="quality_list" :class="condition.name=='质检结果'?'quality-result':''">
        <h1 class="page_title">
            {{condition.name}}
            <div class="pull-right search_time" v-if="condition.name=='会话质检'">
                <my-date-picker class="pull-right search_time" v-model="chatStartTime" :maxTime="Date.now()" type="datetimerange" format="yyyy年MM月dd日 HH:mm"></my-date-picker>
            </div>
        </h1>
        <div class="input-group search_wrap clearfix">
            <Input  v-model="page.q" size="small" @on-enter.prevent='searchs(1)' placeholder="搜索会话内容">
            	<Button slot="append" icon="search" @click="searchs(1)"></Button>
            </Input>

        </div>
        <Collapse>
            <Panel name="1">
                <span >筛选</span>
                <div slot="content" class="filter-chose">
                    <Row v-if="condition.name=='会话质检'">
                        <Col :span="7">
                        <span>解决状态</span>
                        <Select v-model="filters.question_status" style="width:120px">
                            <Option v-for="item in question_items" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col :span="7">
                        <span>咨询分类</span>
                        <Select v-model="filters.tag1" style="width:120px">
                            <Option v-for="item in tags" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        </Col>
                        <Col :span="7">
                        <span>满意度</span>
                        <Select v-model="filters.satisfaction" style="width:120px">
                            <Option v-for="item in satisfaction_items" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                    </Row>
                    <Row v-if="condition.name=='会话质检'">
                        <Col :span="7">
                        <span>质检状态</span>
                        <Select v-model="filters.evaluation_status" style="width:120px">
                            <Option v-for="item in evaluation_items" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                        <Col :span="7">
                        <span>质检对象</span>
                        <Select v-model="filters.user_id" style="width:120px">
                            <Option v-for="item in kfs" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
                        </Select>
                        </Col>
                    </Row>
                    <div v-if="condition.name=='质检结果'" class="justify-center">
                        <div class="filter-opr justify-box">
                            <span>质检人</span>
                            <Select v-model="filters.inspector" style="width:120px">
                                <Option v-for="item in kfs" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
                            </Select>
                        </div>
                        <div class="filter-user justify-box">
                            <span>质检对象</span>
                            <Select v-model="filters.kf_id" style="width:120px">
                                <Option v-for="item in kfs" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
                            </Select>
                        </div>
                        <div class="filter-time justify-box">
                            <span>质检时间</span>
                            <el-date-picker v-model="filters.quality_time" :picker-options="pickerOptions" size="small" type="datetimerange" format="yyyy年MM月dd日 hh:mm" placeholder="选择创建日期"> </el-date-picker>
                        </div>
                        <div class="chat-filter-time justify-box">
                            <span>会话开始时间</span>
                            <el-date-picker v-model="filters.chat_time" :picker-options="pickerOptions" size="small" type="datetimerange" format="yyyy年MM月dd日 hh:mm" placeholder="选择创建日期"> </el-date-picker>
                        </div>
                        <div class="filter-score justify-box">
                            <span>分数区间</span>
                            <Input v-model="filters.score.start" placeholder="分"></Input>
                            -
                            <Input v-model="filters.score.end" placeholder="分"></Input>
                        </div>
                    </div>
                    <div class="filter-btns">
                        <button class="my-btn my-btn-transparent" @click="clearFilter(condition.name)">清空</button>
                        <button class="my-btn my-btn-info-f" @click="toFilter(condition.name)">确定</button>
                    </div>
                </div>
            </Panel>
        </Collapse>
        <div class="table_wrap">
            <div class="simulate_table table4 quality_list-quality" v-if="condition.name=='会话质检'">
                <ul class="thead">
                    <li class="tr">
                        <div class="th">会话开始时间</div>
                        <div class="th">用户名</div>
                        <div class="th">咨询分类</div>
                        <div class="th">接待客服</div>
                        <div class="th">满意度</div>
                        <div class="th">会话时长</div>
                        <div class="th">质检状态</div>
                    </li>
                </ul>
                <ul class="tbody">
                    <li class="tr" v-for="(obj, index) in qualitys" @click="toTest(index)" :class="{selected2:AUX.current ==index}">
                        <div class="td">{{getName('time', obj.created)}}</div>
                        <div class="td">{{obj.nickname}}</div>
                        <div class="td">{{getName('tag1', obj.tag1)}}</div>
                        <div class="td">{{getName('kf_id', obj.kf_id)}}</div>
                        <div class="td">{{getName('satisfaction', obj.satisfaction)}}</div>
                        <div class="td">{{getName('duration', obj.duration)}}</div>
                        <div class="td">
                        	<span :class="{'table-status__handled':obj.evaluation_status==1,'table-status__unhandle':obj.evaluation_status==0}" >{{getName('evaluation_status', obj.evaluation_status)}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="simulate_table table4 quality_list-result" v-if="condition.name=='质检结果'">
                <ul class="thead">
                    <li class="tr">
                        <div class="th">会话开始时间</div>
                        <div class="th">用户名</div>
                        <div class="th">接待客服</div>
                        <div class="th">满意度</div>
                        <div class="th">质检时间</div>
                        <div class="th">质检人</div>
                        <div class="th">总分<!--&ensp;<sort akey="question" :active="page.sort_filed=='question'" :status="page.sort" @click="changeFilterSort"></sort>--></div>
                    </li>
                </ul>
                <ul class="tbody">
                    <li class="tr pointer" v-for="(obj, index) in qualitys" @click="toTest(index);AUX.current = index;" :class="{selected2:AUX.current ==index}">
                        <div class="td">{{getName('time', obj.created)}}</div>
                        <div class="td">{{obj.nickname}}</div>
                        <div class="td">{{getName('tag1', obj.tag1)}}</div>
                        <div class="td">{{getName('satisfaction', obj.satisfaction)}}</div>
                        <div class="td">{{getName('time', obj.inspect_time)}}</div>
                        <div class="td">{{getName('kf_id', obj.inspector)}}</div>
                        <div class="td">{{obj.fraction}}</div>
                    </li>
                </ul>
            </div>
        </div><br />
        <div class="pagination_wrap" v-if="total>0">
            <el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
            <!-- <pagination :page="page" :total="total" v-on:pageTurn="searchs"></pagination> -->
        </div>
        <my-modals v-model="AUX.show_edit" free="true"  :width="'770'">
            <Col class="chat" :span='12' v-if="AUX.current>=0">
            <Tabs :animated="false" class="chat-nav">
                <TabPane :label="'客服'+ getName('kf_id', qualitys[AUX.current]?qualitys[AUX.current].kf_id:'') +' 聊天记录'">
                    <chatbox :session="qualitys[AUX.current]?qualitys[AUX.current].session.part:[]" :show-recommend-answer="false"></chatbox>
                </TabPane>
                <TabPane label="全部聊天记录">
                    <chatbox :session="qualitys[AUX.current]?qualitys[AUX.current].session.all:[]" :show-recommend-answer="false"></chatbox>
                </TabPane>
            </Tabs>
            </Col>
            <Col class="grade" :span='12' v-if="AUX.current>=0" :class="editing?'':'no-edit'">
            <Tabs :animated="false" class="grade-nav">
                <TabPane label="质检评分" class="do-score">
                    <header class="evaluation-header">
                        <!-- <Icon type="help-circled"></Icon> -->
                        <p class="total-score">
                            <span>当前总分: </span>
                            <span>{{scoreTotal}}</span>
                        </p>
                        <!-- <Button type="ghost" @click="reEvaluation">重新评价</Button> -->
                        <selectButton :value="btnValue" :btnClick="reEdit" :selects="selects" v-if="condition.name=='会话质检'"></selectButton>
                        <div class="choose-result-log" v-if="condition.name=='质检结果'">
                            <span>质检人</span>
                            <Select v-model="nowIndex" style="width:200px" :on-change="changeTest(nowIndex)">
                                <Option v-for="(item, index) in qualityFileds" :value="index" :key="index">{{ formatResultSelect(item) }}</Option>
                            </Select>
                        </div>
                    </header>
                    <h3 class="dashed-line"><span>质检项</span></h3>
                    <div class="quality-filed clearfix">
                        <dl v-for="dt in qualityFiled" class="clearfix">
                            <dt>{{dt.name}}</dt>
                            <dd v-for="dd in dt.child">
                                <span>{{dd.name}}</span>
                                <Input v-model="dd.score" :placeholder="'0-'+ dd.max" style="width: 70px" @on-blur="checkNumber(dd, $event)"></Input>
                            </dd>
                        </dl>
                    </div>
                    <div class="dashed-line"></div>
                    <footer>
                        <label>评语</label>
                        <Input v-model="evaluationText" type="textarea" :placeholder="condition.name=='质检结果'?'':'选填'"></Input>
                        <div class="commit-wrap" v-if="condition.name!='质检结果'">
                            <div class="commit clearfix">
                                <button class="btn btn-default" @click="AUX.show_edit=false">&emsp;取消&emsp;</button>&emsp;&emsp;
                                <button class="btn btn-info" @click="toevaluation">&emsp;确定&emsp;</button>
                            </div>
                        </div>
                    </footer>
                </TabPane>
                <TabPane label="用户信息" class="quality-user-info do-score">
                    <userinfo :info="qualitys[AUX.current]?qualitys[AUX.current].userinfo:{}" :tags="tags" v-if="AUX.current>=0&&qualitys.length>0"></userinfo>
                </TabPane>
            </Tabs>
            </Col>
        </my-modals>
    </div>
</template>

<script>
    import upload from '../module/upload'
    import bar from '../module/自定义滚动条'
    import upload_mixin from '../module/upload_mixin.js'
    import userinfo from '../servicer/modules/userInfo'
    import chatbox from '../servicer/chatbox'
    import session_mixin from '../servicer/mixin/sessions.js'
    import selectButton from './modules/select_button.vue'

    export default {
        mixins:[upload_mixin,session_mixin],
        props:['condition','refreshList'],
        data(){
            return {
                uri:"",
                chatStartTime: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > (Date.now()-24*3600);
                    }
                },
                selects: ['重新评价', '重置评价'],
                editing: false,
                question_items:[{
                    value: 0,
                    label: "未解决"
                },{
                    value: 1,
                    label: "已解决"
                }],
                satisfaction_items: [{
                    value: 5,
                    label: "满意"
                },{
                    value: 1,
                    label: "不满意"
                },{
                    value: 0,
                    label: "未评价"
                }],
                evaluation_items: [{
                    value: 1,
                    label: "已质检"
                },{
                    value: 0,
                    label: "未质检"
                }],
                filters:{
                    question_status: "",
                    tag1: "",
                    satisfaction: "",
                    score: {
                        start: "",
                        end: ""
                    },
                    evaluation_status: "",
                    user_id: "",
                    kf_id: "",
                    inspector: "",
                    quality_time: "",
                    chat_time: ""
                },
                page:{
                    q:'',
                    page:1,
                    size:15,
                    start_time:'',
                    end_time:'',
                },
                qualityFiledModel: {},
                qualityFiled:{},
                qualityFileds: [],
                curSid: "",
                btnValue: "",
                scoreTotal: "",
                qualitys:[],
                tags:[],
                kfs: {},
                evaluationText: "",
                nowIndex: -1,
                userinfo:{},
                isError: 0,

                AUX:{
                    show_edit:false,
                    status_txt:{
                        0: '未接单', 1: '已接单', 2: '已完成', 3: '已关闭'
                    },
                    fileds:[
                        {value:"",label:'全部'},
                    ],
                    current:-1,    //当前显示的详情
                },
                total:0,

            }
        },
        created(){
            let v = this;
            this.uri = this.condition.uri;
            v.initTodayTime();
            // v.InitCondition(this.condition);
            v.getKfs();
            v.getSatisfy();
            /*v.axios.all([v.searchs2(),v.getTags(), v.getSetting()])
            // v.axios.all([v.searchs2(),v.getTags()])
                .then(v.axios.spread((d1, d2, d3)=>{
                    v.searchsHandler(d1);
                    v.getTagsHandler(d2);
                    v.getSettingHandler(d3);
                    // v.getCustomersHnadler(d3);
                }))*/
            v.axios.all([v.getTags(), v.getSetting()])
                .then(v.axios.spread((d2, d3)=>{
                    v.getTagsHandler(d2);
                    v.getSettingHandler(d3);
                }))
        },
        computed:{
        },
        methods:{
            initTodayTime(){
                let start_time = new Date();
                let end_time = new Date();
                start_time.setHours(0, 0, 0, 0)
                end_time.setDate(end_time.getDate()+1)
                end_time.setHours(0, 0, 0, 0)
                this.chatStartTime = [start_time, end_time];
            },
            searchs(index){
                this.searchs2(index).then(this.searchsHandler);
            },
            reEdit(btnValue){
                // console.log(btnValue)
                // 重置评价
                if(btnValue==this.selects[1]){
                    this.reEvaluation();
                }
                this.editing = true;
            },
            formatResultSelect(item){
                console.log(item)
                let kf_name = this.getName('kf_id', item.质检人);
                let dates = '';
                let date = '';
                try {
                    dates = item.质检时间.split(" ");
                    date = dates[0].slice(5,).replace("-", ".") + " " + dates[1].slice(0,5);
                    // date = dates[0].slice(5,).replace("-", ".") + " " + dates[1].slice(,-3);
                } catch (e) {
                    date = ''
                }
                return kf_name + " - " + date + " - " + item.总分 + "分";
            },
            searchs2(index, data=null){
                let v = this;
                if(index) v.page.page = index;
                if(!v.chatStartTime){
                    v.page.start_time = 0;
                    v.page.end_time = 0;
                }
                else if(v.chatStartTime.length==2&&v.condition.name!='质检结果'){
                    v.page.start_time = new Date(v.chatStartTime[0]).getTime()/1000;
                    v.page.end_time = new Date(v.chatStartTime[1]).getTime()/1000;
                }
                console.log(v.page)
                v.page.refresh = this.refreshList;
                // console.log(v.uri)
                if(!v.uri) v.uri = v.$uri.qualityTest.list;
                if(!data) data = v.genPostData()
                console.log(v.filters.chat_time, data, data.start_time)
                if((v.condition.name=='质检结果'
                 &&v.filters.chat_time.length==2
                 &&(!v.filters.chat_time[0]
                 ||!v.filters.chat_time[1]))
                 ||!(data.start_time&&data.end_time)){
                    console.log("删除")
                    delete data.start_time;
                    delete data.end_time;
                }
                if((v.condition.name=='质检结果'
                 &&v.filters.quality_time.length==2
                 ||!v.filters.quality_time[0]
                 ||!v.filters.quality_time[1])){
                    delete data.inspect_start;
                    delete data.inspect_end;
                }
                return  v.$api.ajax(v.uri,'get',data);
            },
            searchsHandler(data){
                let v = this;
                //加上 历史会话
                data.list.forEach(val=>{
                    val.session={
                        part:{session_id:val.uid},
                        all:{session_id:val.uid},
                    };
                    val.userinfo={
                        address:'',
                        cid:'',
                        email:'',
                        head:'',
                        mobile:'',
                        source:'',
                        session_id:'',
                        ip:'',
                        question_status:'',
                        remark_info:'',
                        tag1:'',
                        tag2:'',
                    };
                    v.mixin_初始化会话(val.session.part);
                    v.mixin_初始化会话(val.session.all);
                })
                this.qualitys = data.list;
                this.total = data.total;
                this.$emit('changeNum',data);
            },
            genPostData(){
                let page = this.page;
                let data = {};
                for(let key in page){
                    if(!page[key] && page[key]==="") continue;
                    data[key] = page[key]
                }
                return data;
            },
            getName(item, value){
                let v = this;
                let df = v.$api.dateFormat;
                switch(item){
                    case 'evaluation_status':
                        return value == 1 ? "已质检" : "未质检";
                    case 'satisfaction':
                      if(value == 5){return "非常满意"}
                      if(value == 4){return "满意"}
                      if(value == 3){return "一般"}
                      if(value == 2){return "不满意"}
                      if(value == 1){return "非常不满意"}
                      return "未评价"

                        // return value == 5 ? "满意" : (value == 1 ? "不满意" : "未评价");

                    case 'time':
                        return df('yyyy',value)<df('yyyy') ? value : df('MM-dd hh:mm',value);
                    case 'tag1':
                        let tag1Name = '无分类'
                        if (value >= 0) {
                            for (let i = 0; i < v.tags.length; i++) {
                                if (v.tags[i].id === value) {
                                    tag1Name = v.tags[i].name
                                    break
                                }
                            }
                        }
                        return tag1Name
                    case 'kf_id':
                        return v.kfs && v.kfs[value] ? v.kfs[value].nickname : "";
                    case 'duration':
                        return v.strChatTime(parseInt(value));
                }
            },
            strChatTime(time){
                let ts = ""
                let sec = time % 60;
                let min = parseInt(time/60) % 60;
                let hour = parseInt(time/3600) % 24;
                if(hour) ts += hour + "时";
                if(min) ts += min + "分";
                if(sec) ts += sec + "秒";
                ts = !ts ? "--" : ts;
                return ts;
            },
            checkNumber(value, $event){
                let input = $event.target;
                let result = this._checkNumber(value);
                if(result!=true){
                    if(input.className.indexOf('error')<0){
                        input.className=input.className+' error';
                        this.isError += 1;
                    }
                    this.$message({type: "error", message: result});
                    value.isCount = false;
                }else{
                    if(input.className.indexOf('error')>=0){
                        input.className = input.className.replace("error", "");
                        value.isCount = true;
                        this.isError -= 1;
                    }
                }
                this.scoreTotal = this._countTotal();

            },
            _checkNumber(value){
                if(value.score==0) return true;
                if(isNaN(value.score)) return true;
                if(!/^[1-9]{1}[0-9]{0,2}$/.test(value.score)){
                    return value.name+":不是有效数值";
                }
                let num = parseInt(value.score);
                if(num<0||num>value.max){
                    return value.name+":数值超出范围";
                }
                return true;

            },
            setSearch(key_name){
                let v = this;

                switch(key_name){
                    case 'score':
                        if(v.filters.score.start)
                            v.page.start_fra = v.filters.score.start;
                        if(v.filters.score.end)
                            v.page.end_fra = v.filters.score.end;
                        break;
                    case 'quality_time':
                        if(!v.filters.quality_time) break;
                        var time = v.formatTime(v.filters.quality_time);
                        v.page.inspect_start = time[0];
                        v.page.inspect_end = time[1];
                        break;
                    case 'chat_time':
                        if(!v.filters.chat_time) break;
                        var time = v.formatTime(v.filters.chat_time);
                        v.page.start_time = time[0];
                        v.page.end_time = time[1];
                    // case 'satisfaction':
                    //     if(v.filters.satisfaction === 0)
                    //         v.page.satisfaction = null;
                    //     else v.page.satisfaction = v.filters.satisfaction;
                    //     break;
                    default:
                        if(v.filters[key_name] !== '')
                            v.page[key_name] = v.filters[key_name];
                }

            },
            formatTime(timeObj){
                let time0 = new Date(timeObj[0]).getTime()/1000;
                let time1 = new Date(timeObj[1]).getTime()/1000;
                return [time0, time1];
            },
            clearPage(){
                this.page = {
                    q:'',
                    page:1,
                    size:15,
                    start_time:'',
                    end_time:''
                }
            },
            clearFilter(page_name){
                let v = this;
                let result_list = ['inspector', 'kf_id', 'quality_time', 'chat_time', 'score'];
                let quality_list = ['question_status', 'tag1', 'satisfaction', 'evaluation_status', 'user_id'];
                let filters = page_name == "会话质检" ? quality_list : result_list;
                let hasChange = false;
                for(let index in filters){
                    let key = filters[index]
                    if(key == 'score'){
                        v.filters.score.start = "";
                        v.filters.score.end = "";
                    }else{
                        v.filters[key] = "";
                    }
                    if(v.page[key]!==undefined) hasChange=true;
                }
                v.clearPage();
                if(hasChange) v.searchs();
            },
            toFilter(page_name){
                let v = this;
                v.clearPage();
                let result_list = ['inspector', 'kf_id', 'quality_time', 'chat_time', 'score'];
                let quality_list = ['question_status', 'tag1', 'satisfaction', 'evaluation_status', 'user_id'];
                let filters = page_name == "会话质检" ? quality_list : result_list;
                for(let index in filters){
                    v.setSearch(filters[index]);
                }
                v.searchs();
            },
            getTags(){
                let v = this;
                return v.$api.ajax(v.$uri.questions.tag.get,'get');
            },

            getKfs(){
                this.$source.kfs().then(data => {
                    let _data = this.$api.deepCopy(data);
                    // console.log("kfs", data)
                    delete _data.head;
                    this.kfs = _data;
                });
            },

          getSatisfy(){
            debugger
            let v = this;
            v.$api.ajax('/company/setting/evaluation','get').then(data=>{
              v.satisfaction_items = data
            })
          },

            getSetting(){
                return this.$api.ajax(this.$uri.qualityTest.setting, 'get');
            },
            formatSetting(data){
                return data;
            },
            // formatSetting(data){
            //     console.log("format...",data)
            //     let _data = {}
            //     for(let dt_index in data){
            //         let _item = {};
            //         let dt = data[dt_index];
            //         for(let dd_index in dt){
            //             _item[dd_index] = {};
            //             _item[dd_index].max = dt[dd_index][1];
            //             _item[dd_index].score = dt[dd_index][0]?dt[dd_index][0]:"";
            //         }
            //         _data[dt_index] = _item;
            //     }
            //     return _data;
            // },
            getSettingHandler(data){
                let v = this;
                v.qualityFiledModel = v.formatSetting(data);
            },
            reEvaluation(){
                this.qualityFiled = this.$api.deepCopy(this.qualityFiledModel);
                this.evaluationText = "";
                this.scoreTotal = 0;
            },
            toevaluation(){
                let v = this;
                if(v.isError > 0){
                    return this.$message({
                        type: "error",
                        message: "你有未满足要求的评分项目!"
                    });
                };
                let data = {
                    quality_inspect:{
                        "评价": {},
                        "评语": v.evaluationText,
                        "总分": v._countTotal(),
                    }
                };
                let scores = this.$api.deepCopy(v.qualityFiled);
                for(var dt_index in scores){
                    var dt = scores[dt_index].child;
                    for(var dd_index in dt){
                        delete dt[dd_index].isCount;
                        // console.log(parseInt(dt[dd_index].score), dd_index);
                        if(isNaN(parseInt(dt[dd_index].score))){
                            this.$message({message: "不允许有未填的质检项", type: "error"});
                            return ;
                        }
                    }
                }
                data.quality_inspect["评价"] = scores;

                // console.log("evaluation",data)
                let post_url = v.$uri.qualityTest.result.replace("id", v.curSid);
                v.$api.ajax(post_url, 'post', data).then( data=> {
                    this.$message({message: "评分成功", type: "success"});
                    v.AUX.show_edit = false;
                    this.searchs();
                });
            },
            获取会话信息(id){
                let v = this;
                return new Promise((resolve,reject)=>{
                    v.$api.ajaxNoLoading('/chat/session/'+id,'get')
                        .then(data=>{
                            resolve(data);
                        }).catch(err=>{
                        reject(err)
                    })
                })
            },
            获取游客信息(id){
                let v = this;
                return new Promise((resolve,reject)=>{
                    v.$api.ajaxNoLoading(v.$uri.user.游客+'/'+id,'get')
                        .then(data=>{
                            resolve(data);
                        }).catch(err=>{
                        reject(err)
                    })
                })
            },
            changeTest(nowIndex){
                // console.log("选择质检人", nowIndex)
                if(nowIndex < 0) return;
                let evaluation = this.qualityFileds[nowIndex]
                this.qualityFiled = this.formatSetting(evaluation['评价']);
                this.evaluationText = evaluation["评语"]?evaluation["评语"]:"";
                this.scoreTotal = this._countTotal();
            },
            toTest(index){
                let v = this;
                let quality = v.qualitys[index];
                let sid = v.qualitys[index].session_id;
                v.curSid = sid;
                v.$api.ajax(v.$uri.qualityTest.result.replace("id", sid), 'get').then(data =>{
                    let last_evaluation = data.evaluation[data.evaluation.length-1]
                    // console.log(last_evaluation)
                    v.qualityFileds = data.evaluation
                    if(last_evaluation && !v.$api.isEmptyObj(last_evaluation["评价"])){
                        // console.log("使用后台数据", v.qualityFiled)
                        this.editing = false;
                        this.nowIndex = data.evaluation.length-1;
                        this.changeTest(this.nowIndex);
                        // v.qualityFiled = v.formatSetting(last_evaluation['评价']);
                        // v.evaluationText = last_evaluation["评语"]?last_evaluation["评语"]:"";
                        // v.scoreTotal = v._countTotal();
                    }else{
                        this.editing = true;
                        v.qualityFiled = this.$api.deepCopy(v.qualityFiledModel);
                        v.evaluationText = "";
                        // console.log("复制模板", v.qualityFiled)
                    }
                    v.scoreTotal = v._countTotal();

                    if(!quality.userinfo.cid){
                        v.获取游客信息(quality.uid)
                            .then(data=>{
                                for(let i in data)
                                    quality.userinfo[i] = data[i];
                            });
                        v.获取会话信息(quality.session_id)
                            .then(data=>{
                                for(let i in data)
                                    quality.userinfo[i] = data[i];
                            })
                    }
                    if(quality.session.part.historys.length==0){
                        v.mixin_处理历史(quality.session.part,data.logs);
                        quality.session.part.can_get_historys = false;
                    }
                    if(quality.session.all.historys.length==0){
                        v.mixin_会话历史(quality.session.all);
                    }

                    v.AUX.current = index;
                    v.AUX.show_edit = true;
                })
            },
            _countTotal(){
                let total = 0;
                for(let i in this.qualityFiled){
                    let items = this.qualityFiled[i]
                    for(let j in items.child){
                        let item = items.child[j];
                        if(item.isCount!==false){
                            let num = parseInt(item.score) | 0;
                            total += num;
                        }
                    }
                }
                return total;
            },
            getTagsHandler(data){
                // console.error(data);
                let v = this;
                v.tags = data;
            },
            InitCondition(n){
                this.uri = n.uri;
                this.searchs(1);
            }
        },
        components:{
            upload,
            bar,
            chatbox,
            userinfo,
            selectButton
        },
        watch:{
            chatStartTime(n){
                this.searchs(1);
            },
            condition:{
                handler(n){
                    // console.log("changeCondition")
                    this.AUX.show_edit = false;
                    this.AUX.current = -1;
                    this.time_frame = [];
                    // this.page.q_filed = '';
                    // this.page.q = '';
                    this.clearPage();
                    this.qualitys = [];
                    this.clearFilter(n.name);
                    this.InitCondition(n);
                },deep:true
            },
            refreshList(n){
                this.searchs();
            },
            list:{
                handler(n){
                    this.AUX.show_edit = false;
                    this.AUX.current = -1;
                },deep:true
            }
        }
    }
</script>

<style type="text/scss" lang="scss">
    @import '../../assets/scss/api.scss';
    $color1:#1f89f6;
    $color_line_0_3: #e7eff3;
    $color_font_gray_5: #92a7b2;
    $color_font_gray: #c4c4c5;
    $color_nav: #343f4b;
    $color_button_blue: #0f86ff;
    $th_widths1:[0.15, 0.2, 0.15, 0.15, 0.10, 0.15, 0.10];
    $th_widths2:[0.15, 0.2, 0.15, 0.12, 0.15, 0.13, 0.10];
    #_wrap .no-edit{
        .grade-nav{
            textarea{
                pointer-events: none;
                border: none;
            }
        }
        .quality-filed {
            input{
                border: none;
            }
        }
    }
    .quality_list{
        .justify-center{
            /* Android */
            display: -webkit-box;
            -webkit-box-pack: justify;

            /* iOS */
            display: -webkit-flex;
            -webkit-flex-wrap: wrap;
            -webkit-justify-content: space-between;

            /* IE10 */
            display: -ms-flexbox;
            -ms-flex-pack:justify;

            /* w3c */
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        .user_info{
            pointer-events: none;
        }
        .choose-result-log{
            margin-top: 7px;
            .ivu-select{
                margin-left: 10px;
            }
        }
        h3.dashed-line{
            margin-top: 20px;
        }
        .evaluation-header{
            position: relative;
            .ivu-btn{
                position: absolute;
                right: 10px;
                top: -5px;
            }
        }
        .content .txt{
            font-size: 14px;
        }
        .error{
            border-color: red;
        }
        .do-score{
            padding: 22px 20px;

            #my-select-btn{
                position: absolute;
                right: 0;
            }
            .ivu-icon-help-circled{
                position: relative;
                top: 5px;
            }
        }
        .total-score{
            display: inline-block;
            position: relative;
            top: 5px;
        }
        .ivu-input-group-prepend{
            background: transparent;
            border: none;
        }
        .justify-box{
            display: -webkit-box;
            -webkit-box-orient: vertical;
        }
        .ivu-input-group-small{
            width: 216px;
            .ivu-icon{
                position: relative;
                top: 1px;
                font-size: 18px;
                color: $color_font_gray_5;
            }
            .ivu-input{
                width: 190px;
                border-radius: 3px;
                border-top-left-radius:3px;
                border-bottom-left-radius: 3px;
                &:focus{
                    box-shadow: none;

                }
            }
        }
        .quality_list-quality {
            @include simulateTableThWidth($th_widths1);
        }
        .quality_list-result{
            @include simulateTableThWidth($th_widths2);
        }
        .ivu-input-wrapper-small{
            top: 3px;
        }
        .table_wrap{
            margin-top: 6px;
        }
        .status {
            font-size:12px;;
            padding:2px 10px; border-radius:20px;
            color:#fff;
            &.c0{background:#ffbf5e;}
            &.c1{background:#d9e6ed;}
            &.c2{background:#54ca52;}
            &.c3{background:#cdd4d8;}
        }
        .can {
            color:#70abf8;
            cursor:pointer;
            &:hover{color:darken(#70abf8,20%);}
        }
        .not{
            color:#cbd7de;
        }
        .chat{
            border-right: 1px solid $color_line_0_3;
        }
        .chat, .grade{
            height: 100%;
        }
        .ivu-select-dropdown{
            overflow-x: hidden;
        }
        .ivu-collapse{
            background-color: transparent;
            border: none;
            position: relative;
            .filter-btns{
                position: relative;
                text-align: right;
                top: -6px;
                right: -8px;
                .ivu-btn{
                    padding: 8px 24px;
                }
            }
            .ivu-collapse-item-active{
                &>.ivu-collapse-header>.ivu-icon{
                    transform: rotate(-90deg);
                }
            }
            .ivu-collapse-header{
                width: 86px;
                height: 28px;
                line-height:28px;
                top: -35px;
                position: absolute;
                right: 0;
                text-align: center;
                border: 1px solid #d6e4eb;
                padding: 0;
                color: #8b99a7;
                border-radius: 5px;
                transition: .3s;
                &:hover{
                    border-color: $color_button_blue;
                    color: $color_button_blue;
                }
                i{
                    position: relative;
                    left: 30px;
                    transform: rotate(90deg);
                }
                span{
                    position: relative;
                    right: 6px;
                }
            }
        }
        .modals-wrap .modals-box .title{
            margin-top: 20px;
            border: none;
        }
        .user_info{
            .title{
                padding: 0;
            }
            section{
                padding: 0 40px;
                font-size: 14px;
                margin: 15px 0 40px;

                &.tags .el-select{
                    display: block;
                }
            }
        }

        $filter_gap: 28px;
        .filter-chose{
            .ivu-col{
                &>span{
                    margin-right: 6px;
                }
            }
            .filter-opr{
                width: 165px;
                margin-bottom: 25px;
            }
            .filter-user{
                width: 177px;
            }
            .filter-score{
                width: 193px;
                .ivu-input-wrapper{
                    width: 62px;
                    display: inline-block;
                }
            }
            .filter-time{
                width: 251px;
                .el-input{
                    width: 194px;
                }
            }
            .chat-filter-time{
                .el-input{
                    width: 194px;
                }
                width: 275px;
            }
            .ivu-row:nth-child(1){
                margin-bottom: $filter_gap;
            }
        }
        .ivu-collapse-content-box{
            padding: $filter_gap 0 0;
            overflow: visible;
        }
        .ivu-collapse-content{
            clear: both;
            border: 1px solid $color_line_0_3;
            overflow: visible;
        }
        .chat-nav,
        .grade-nav{
            height: 100%;
            header{
                font-size: 14px;
                margin-bottom: 20px;
            }
            .ivu-tabs-tab{
                &::before{
                    content: "";
                    height: 22px;
                    width: 1px;
                    display: block;
                    background: $color_line_0_3;
                    position: absolute;
                    right: 0;

                }
                &+.ivu-tabs-tab::before{
                    display: none;
                }
            }
            dt{
                padding-left: 8px;
                line-height: 17px;
                position: relative;
                border-left: 3px solid $color_nav;
                clear: both;
            }
            dd{
                padding-left: 12px;
                width: 50%;
                float: left;
                span{
                    margin-right: 10px;
                }
                .ivu-input{
                    height: 28px;
                }
            }
            .dd-end{
                margin-bottom: 45px;
            }
            dt:nth-child(1){
                margin-top: 0;
            }
            dt, dd{
                font-size: 14px;
                margin-bottom: 17px;
            }
            dl:nth-child(-1){
                dd:nth-child(-2){
                    margin-bottom: 0px;
                }
            }
            footer{
                padding-left: 12px;
                margin-top: 20px;
                label{
                    font-weight: 700;
                }
            }
            .commit-wrap{
                bottom: 0;
                height: 66px;
                width: 100%;
                left: 0;
                position: absolute;
                background: #f3f7f9;

            }
            .commit{
                width: 240px;
                text-align: center;
                margin: 16px auto 0;
                button:nth-child(1){
                    float: left;
                }
                button:nth-child(2){
                    float: right;
                }

            }
            textarea{
                resize:none;
                width: 316px;
                height: 126px;
            }
        }
        h3{
            text-align: center;
            &>span{
                position: relative;
                z-index: 2;
                background: white;
                padding: 0 10px;
            }
        }
        .quality-filed{
            overflow-y: auto;
            height: 380px;
            &+.dashed-line{
                padding-bottom: 10px;
                &::before{
                    top: unset;
                    margin: 0;
                    bottom: 1px;
                }
            }
        }
        .dashed-line{
            position: relative;
            &::before{
                content: "";
                height: 1px;
                width: 100%;
                display: block;
                z-index: 1;
                position: absolute;
                top: 0;
                bottom: 0;
                margin: auto;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAABCAYAAAD9yd/wAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4YTc4MzE0My1iZmRiLWY1NDEtOTVhZS1mZmEwOWFkNjJkMjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTc3MDExMjRFOTUyMTFFNzlDMjg5MUFGMjQyNjI0MTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTc3MDExMjNFOTUyMTFFNzlDMjg5MUFGMjQyNjI0MTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzMwNmViOWEtYzg2Ni05NTQ3LWI0NjktNTZjOGI0NjVjOGI3IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDM5YzI0ZjUtZDY4Ni0xMWU3LTllYzgtZTM4ZjFjMjJkMTNjIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+NkwtAgAAABhJREFUeNpivH79+n8GJKChocEIogECDABSXQP/S0cgJgAAAABJRU5ErkJggg==);
            }
        }
        .nav-text{
            width: 100%;
            .ivu-tabs-tab{
                width: 50%;
                margin: 0;
            }
        }
        .ivu-tabs{
            .ivu-tabs-tabpane {
                height:100%;
            }
            .wrapper {
                height:calc(100% - 35px);
            }
        }
        .ivu-tabs-bar{
            margin: 0;
        }
        .ivu-tabs-tab{
            color: $color_font_gray;
            text-align: center;
            /*padding: 17px 16px;*/
            &:hover{
                color: $color_nav;
            }
        }
        .ivu-tabs-tab-active{
            color: $color_nav;
            &::after{
                content: "";
                width: 100%;
                height: 1px;
                position: absolute;
                bottom: 1px;
                left: 0;
                z-index: 1;
                background: $color_nav;
            }
        }
        .ivu-tabs-ink-bar{
            display: none!important;
        }
        .ivu-tabs-content{
            /* padding: 18px 20px;*/
            height: 100%;
        }
        .upload {
            margin-bottom:22px;
            .upload_text{
                color:$color1;
            }
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
                .upload_text {width:40px; text-align:center;}
                .close {font-size:28px;line-height:24px; }
                .progress{position:absolute;top:0; left:0; height:100%; background:lighten(yellow,15%); }
            }
        }
    }
    .quality-result{
        .modals-wrap{
            .evaluation-header{
                button{
                    display: none;
                }
            }
            .quality-filed{
                input{
                    border: none;
                    pointer-events: none;
                }
            }
            textarea{
                border: none;
                pointer-events: none;
            }
        }
    }
    // 1306
    @media screen and (max-width: 1500px){
        .quality_list .filter-chose {
            .filter-score{
                width: 50%;
            }

        }
    }
    @media screen and (max-height: 800px){
        .quality_list .do-score{
            overflow-y: scroll;
            padding-bottom: 100px;
        }
        .quality-user-info{
            overflow-y: scroll;
            padding-bottom: 50px;
        }
        .quality_list .grade-nav .commit-wrap{
            height: 43px;
        }
        .quality_list .grade-nav .commit{
            margin: 6px auto 0;
        }
    }
</style>
