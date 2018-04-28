<template>
  <div class="workold_list">
    <h1 class="page_title">
      {{condition.name}}
      	<my-date-picker class="pull-right search_time" v-model="time_frame" :maxTime="Date.now()" type="datetimerange" format="yyyy年MM月dd日 HH:mm" placeholder="请选择时间范围"></my-date-picker>
    </h1>
    <div class="input-group search_wrap clearfix">
      <Input v-if="condition.status===''&&condition.user_id===''" v-model="page.q" size="small" @on-enter.prevent='searchs(1)' placeholder="请输入搜索内容">
      <Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
        <Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
      </Select>
      <Button slot="append" icon="search" @click="searchs(1)"></Button>
      </Input>
      <button class="my-btn my-btn-info-f pull-right" @click="edit()">创建工单</button>
    </div>
    <div class="table_wrap">
      <div class="simulate_table table4">
        <ul class="thead">
          <li class="tr">
            <div class="th">分类</div>
            <div class="th">工单号</div>
            <div class="th">标题</div>
            <div class="th">发起人</div>
            <div class="th">受理人</div>
            <div class="th">创建时间</div>
            <div class="th">更新时间</div>
            <div class="th">状态</div>
            <div class="th">操作</div>
          </li>
        </ul>
        <ul class="tbody">
          <li class="tr" v-for="(l,j) in list" @click="$parent.AUX.index=j;goDetail(l.id)" :class="{editing:j==$parent.AUX.index}">
            <div class="td">
            	<p v-if="prev_page.q_filed=='tag' || prev_page.q_filed==''" class="text" v-html="$api.filterSerachStringAndLimitNum(getTag(l.tag1,l.tag2),prev_page.q,300)"></p>
            	<p v-else class="text">{{getTag(l.tag1,l.tag2)}}</p>
            </div>
            <div class="td">{{l.work_id}}</div>
            <div class="td">
            	<p v-if="prev_page.q_filed=='title' || prev_page.q_filed==''" class="text" v-html="$api.filterSerachStringAndLimitNum(l.title,prev_page.q,300)"></p>
            	<p v-else class="text">{{l.title}}</p>
            </div>
            <div class="td">
            	<p v-if="prev_page.q_filed=='creator_name' || prev_page.q_filed==''" class="text" v-html="$api.filterSerachStringAndLimitNum(l.creator_name,prev_page.q,300)"></p>
            	<p v-else class="text">{{l.creator_name}}</p>
            </div>
            <div class="td">
            	<p v-if="prev_page.q_filed=='user_name' || prev_page.q_filed==''" class="text" v-html="$api.filterSerachStringAndLimitNum(l.user_name,prev_page.q,300)"></p>
            	<p v-else class="text">
            		{{l.user_name}}
            	</p>
            </div>
            <div class="td">{{$api.dateFormat('yyyy',l.created)<$api.dateFormat('yyyy')?l.created:$api.dateFormat('MM-dd hh:mm',l.created)}}</div>
            <div class="td">{{$api.dateFormat('yyyy',l.updated)<$api.dateFormat('yyyy')?l.updated:$api.dateFormat('MM-dd hh:mm',l.updated)}}</div>
            <div class="td">
              <span :class="{'table-status__handled':l.status==1,'table-status__unhandle':l.status==0,'table-status__finish':l.status==2}">{{AUX.status_txt[l.status]}}</span>
            </div>
            <div class="td">
              <span :class="l.status===0?'can':'not'" @click.stop="接单(l.id,j)">接单</span>
            </div>
          </li>
        </ul>
      </div>
    </div><br />
    <div class="pagination_wrap" v-if="total>0">
      <el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
      <!--<pagination :page="page" :total="total" v-on:pageTurn="searchs"></pagination>-->
    </div>
		<br />
    <createWorkOrder v-model="AUX.show_edit" @update-success="updateSuccess"></createWorkOrder>
  </div>
</template>

<script>
  import upload from '../module/upload'
  import upload_mixin from '../module/upload_mixin.js'
  import createWorkOrder from './modules/create_work_order.vue'
  export default {
    mixins:[upload_mixin],
    props:['condition','refreshList'],
    data(){
      return {
        uri:"",
        page:{
        	page:1,
        	size:16,
        	q:'',
          q_filed:'',
          status:this.condition.status,
          user_id:this.condition.user_id,
          creator_id:this.condition.creator_id,
          start_time:'',
          end_time:'',
          action:'',
          sort:-1,
          sort_filed:'updated',
        },
        prev_page:{
        	q:'',
        	q_filed:''
        },
        time_frame:['',''],
        list:[],
        total:0,
        nowCondition: "", // 防止ajax重复请求
        tags:{
          '测试':'00'
        },
        customers:[],
        kfs:[],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > (Date.now()-24*3600);
          }
        },
        AUX:{
          show_edit:false,
          loading:false,
          status_txt:{
            0: "未受理",
            1: "已受理",
            2: "已解决"
          },
          filterKeys:[
            {value:"",label:'全部'},
            /*{value:"tag",label:'分类'},*/
            {value:"work_id",label:'工单号'},
            {value:"title",label:'标题'},
            /*	{value:"uid",label:'用户ID'},*/
            {value:"creator_name",label:'发起人'},
            {value:"user_name",label:'受理人'},
          ]
        },





      }
    },
    created(){
      let v = this;
      this.initPage();
      this.InitCondition(this.condition);
      v.$source.kfs().then(data=>{
        this.kfs = data;
      });
      v.axios.all([v.getTags()])
        .then(v.axios.spread((d2)=>{
          v.getTagsHandler(d2);
        }))
    },
    computed:{
    },
    methods:{
      searchs(index){
        this.searchs2(index).then(this.searchsHandler);
      },
      searchs2(index){
        let v = this;
        if(index) v.page.page = index;
        if(v.time_frame.length==2 && v.time_frame[0]){
          v.page.start_time = new Date(v.time_frame[0]).getTime()/1000;
          v.page.end_time = new Date(v.time_frame[1]).getTime()/1000;
        }
        v.page.refresh = this.refreshList;
        if(!v.uri) v.uri = v.$uri.workold.list;
        return  v.$api.ajax(v.uri,'get',v.page);
      },
      searchsHandler(data){
        this.list = data.list;
        this.total = data.total;
        this.prev_page.q = this.page.q;
        this.prev_page.q_filed = this.page.q_filed;
        this.$api.deepCopy(this.page,this.$parent.AUX.page);
        this.$api.deepCopy(this.prev_page,this.$parent.AUX.prev_page);
        this.$emit('changeNum',data);
      },
      getTags(){
        let v = this;
        return v.$api.ajax(v.$uri.workold.tags,'get');
      },
      getTagsHandler(data){
        let v = this;
        data.forEach(val=>{
          v.tags[val.id] = v.$api.deepCopy(val);
          if(val.child&&val.child.length!=0){
            v.tags[val.id].child = {};
            val.child.forEach(val2=>{
              v.tags[val.id].child[val2.id] = val2;
            })
          }
        });
      },
      getTag(t1,t2){
        let txt = '';
        if(t1 ){
          if(this.tags[t1]){
            txt = this.tags[t1].name;
            if(t2){
              txt +='/' +( this.tags[t1].child&&this.tags[t1].child[t2]? this.tags[t1].child[t2].name:'未发现二极分类');
            }
          }else{
            txt ='未发现分类';
          }
        }else{
          txt = '未分类';
        }
        return txt;
      },
      filterCustomer(query){
        this.customers = [];
        this.AUX.loading = true;
        if(query!==''){
          this.$api.ajax(this.$uri.workold.游客,'get',{nickname:query})
            .then(data=>{
              this.customers = data;
              this.AUX.loading = false;
            }).catch((err)=>{
            this.AUX.loading = false;
          })
        }
      },
      changeCustomer(){
        let v = this;
        if(!v.workold.uid) {
          v.workold.name = '';
          v.workold.email = '';
          v.workold.mobile = '';
        }else{
          let customer = v.customers.find(val=>{
            return val.uid == v.workold.uid;
          }) ;
          if(customer){
            v.workold.name = customer.nickname;
            v.workold.email = customer.email;
            v.workold.mobile = customer.mobile;
          }
        }
      },

			edit(id=undefined){
				let v = this;
				if(!id){
					v.workold={
						title:'',
						content:'',
						status:0,
						uploads:[],
						tag1:'',
						tag2:'',
						uid:'',
						user_id:'',
						creator_id:this.$store.state.global.user.id,
						name:'',
						mobile:'',
						email:'',
					};
				}
				v.AUX.show_edit = true;
			},
			updateSuccess(){
				this.searchs();
			},
			goDetail(id){
				let path = this.$router.history.current.matched[this.$router.history.current.matched.length-2].path+'/detail';
				this.$router.push({
					path:path,
					query:{id:id}
				})
			},
			接单(id,i){
				let v = this;
				let data = {
					wid:id,
					action:'申领',  //指派，申领， 完成，激活，转交，回复
				}
				v.$api.ajax(v.$uri.workold.action,'put',data)
				.then(data=>{
					v.list[i].status = 1;
					v.list[i].user_id = v.$store.state.global.user.id;
					v.searchs();
				})
			},
			initPage(){
				let v = this;
				v.$api.deepCopy(v.$parent.AUX.page,v.page);
				v.$api.deepCopy(v.$parent.AUX.prev_page,v.prev_page);
			},
			InitCondition(n){
				this.uri = n.uri;
				this.page.status = n.status;
				this.page.user_id = n.user_id;
				this.page.creator_id = n.creator_id;
				this.page.action  = n.action||'';
        this.nowCondition = n.name;
        this.searchs();
      },



    },
    components:{
      upload,
      createWorkOrder
    },
    watch:{
      time_frame(n, o){
        if(n[0] == o[0] && n[1] == o[1] || this.nowCondition==""){
          return;
        }
        this.searchs(1);
      },
      condition:{
        handler(n, o){
          if(this.nowCondition == n.name) return;
          this.time_frame = ['',''];
          this.page.start_time = '';
          this.page.end_time　=　'';
          this.page.q_filed = '';
          this.page.q = '';
					this.InitCondition(n);
				},deep:true
			},
			refreshList(n){
				this.searchs();
			}
		}
	}
</script>

<style lang="scss">
  @import '../../assets/scss/api.scss';
  $th_widths:(0.1, 0.09, 0.16, 0.1, 0.1, 0.14, 0.14, 0.1, 0.07);
  .workold_list{
    .simulate_table {
      @include simulateTableThWidth($th_widths);
    }
    .can {
      color:#70abf8;
      cursor:pointer;
      &:hover{color:darken(#70abf8,20%);}
    }
    .not{
      color:#cbd7de;
    }

  }
</style>
