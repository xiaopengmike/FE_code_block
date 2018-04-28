<template>
	<div class="workload report">
		<div class="table_filter">
			<button class="my-btn my-btn-info-o filter_btn" style="position:absolute; top:-40px; right:0;" @click="show_table_th=!show_table_th">
				筛选&nbsp;<i class="icon fa fa-angle-right" :class="{active:show_table_th}"></i>
			</button>
			<div class="filter_wrap" v-show="show_table_th">
				<span class="th" v-for="(t,k) in table_th" v-show="!t.notShow" :class="table_th[k].visibled?'visibled':''" @click="table_th[k].visibled=!table_th[k].visibled">{{k}}<Icon v-show="table_th[k].visibled" type="checkmark"></Icon></span>
			</div>
		</div>

    <h1 class="page_title noBorder">
      工作质量&nbsp;<word-explain keys="工作报表-客服-工作质量"></word-explain>
      <button class="my-btn my-btn-info-o pull-right font14 marg_l_10"
              @click="download()"
      ><i class="fa fa-sign-out"></i>导出报表</button>

    </h1>

    <div class="data-screening">
      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">
              {{$api.MillisecondToDate(allData.平均首次响应时长*1000)||0
              }}
            </div>
            <div class="message">平均首次响应时长</div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">
              {{$api.MillisecondToDate(allData.平均接待时长*1000)||0
              }}
            </div>
            <div class="message">平均接待时长</div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">
              {{(allData.平均相对满意度*100).toAccuracy(2)+'%'||0
              }}
            </div>
            <div class="message">平均相对满意度</div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">
              {{(allData.平均一次性解决率*100).toAccuracy(2)+'%'||0
              }}
            </div>
            <div class="message">平均一次性解决率</div>
          </div>
        </div>
      </div>
    </div>
		<br />
		<div class="table_wrap">
			<table class="table4">
				<thead>
					<tr>
						<th v-for="(t,k) in table_th" v-show="t.visibled">{{k}}&ensp;<sort v-if="t.sortable" :akey="t.sortname" :active="page.sort_filed==t.sortname" :status="page.sort" @click="changeFilterSort"></sort></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item,i) in list" @click="goDetail(item)" class="pointer" :class="{editing:AUX.selected_id == item.id}">
						<td v-show="table_th.姓名.visibled">{{ kfs_info[item.id] && kfs_info[item.id].username ? kfs_info[item.id].username : '--' }}</td>
						<td v-show="table_th.平均首次响应时长.visibled">{{$api.MillisecondToDate(item.平均首次响应时长*1000)||0 }}</td>
						<td v-show="table_th.平均响应时长.visibled">{{$api.MillisecondToDate(item.平均响应时长*1000)||0 }}</td>
						<td v-show="table_th['30秒应答率'].visibled">{{(item['应答率']*100).toAccuracy(2)+'%'||0 }}</td>
            <td v-show="table_th.接待总时长.visibled">{{$api.MillisecondToDate(item.接待总时长*1000)||0 }}</td>
            <td v-show="table_th.平均接待时长.visibled">{{$api.MillisecondToDate(item.平均接待时长*1000)||0 }}</td>
						<td v-show="table_th.客服消息数.visibled">{{item.客服消息数||0 }}</td>
						<td v-show="table_th.答问比.visibled">{{(item.答问比*100).toAccuracy(2)+'%'||0 }}</td>
						<td v-show="table_th.一次性解决率.visibled">{{(item.一次性解决效率*100).toAccuracy(2)+'%'||0 }}</td>
						<td v-show="table_th.参评率.visibled">{{((item.参评率||0)*100).toAccuracy(2)+'%' }}</td>
						<td v-show="table_th.相对满意度.visibled">
              <!--{{(item.相对满意度*100).toAccuracy(2)+'%'||0 }}-->
              {{item.相对满意度==='--'?item.相对满意度:((item.相对满意度*100).toAccuracy(2)+'%')}}
            </td>
						<td v-show="table_th.满意度详情.visibled">
							<!--{{item.满意度详情}}-->
							{{
              '非常满意'+'('+item.满意度详情.非常满意+')'+' '+
              '满意'+'('+item.满意度详情.满意+')'+' '+
              '一般'+'('+item.满意度详情.一般+')'+' '+
              '不满意'+'('+item.满意度详情.不满意+')'+' '+
              '非常不满意'+'('+item.满意度详情.非常不满意+')'
              ||'无' }}
						</td>

					</tr>
				</tbody>
			</table>
		</div>
		<br />
		<div class="pagination_wrap" v-if="total>0">
			<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
		</div>
		<br />
	</div>
</template>

<script>
	import pagination from '../../module/pagination'
  import sort from '../../module/表排序箭头'
	export default{
		props:['time_frame'],
		data(){
			return {
        allData:{
          平均首次响应时长:0,
          平均接待时长:0,
          平均相对满意度:0,
          平均一次性解决率:0,
        },
				page:{
					cid:1,
					page:1,
					size:10,
					count:10,
					sort: 0,
					sort_filed:'',
				},
				total:0,
				list:[],
				kfs_info:{},
				show_table_th:false,
				table_th:{
          姓名:{visibled:true,sortable:false,notShow:true},
					平均首次响应时长:{visibled:true,sortable:true ,sortname:'average_first_response_time'},
					平均响应时长:{visibled:true,sortable:true ,sortname:'average_response_time'},
					'30秒应答率':{visibled:true,sortable:true ,sortname:'answer_ratio'},
          接待总时长:{visibled:false, sortable:true ,sortname:'total_length_of_reception'},
					平均接待时长:{visibled:true, sortable:true ,sortname:'average_length_of_reception'},
					客服消息数:{visibled:false, sortable:true ,sortname:'kf_msg'},
          			答问比:{visibled:true,sortable:true ,sortname:'q_a_ratio'},
          			一次性解决率:{visibled:false,sortable:true ,sortname:'one-time_solution_rate'},
          			参评率:{visibled:true,sortable:true ,sortname:'participation'},
         			相对满意度:{visibled:false,sortable:true, sortname:'relative_satisfaction'},
					满意度详情:{visibled:true,sortable:false},
				},
				AUX:{
					selected_id:0,
				}
			}
		},
		created(){
			//获取查看上次id
			let historys = JSON.parse(sessionStorage.historys);
			if(historys[1] && historys[1].query.id){
				this.AUX.selected_id = historys[1].query.id;
			}
			this.$source.kfs().then(data=>{
				this.kfs_info = data;
			})
			this.searchs();
		},
		computed:{

		},
		methods:{
      download(){
        let v =this;
        // start: v.time_frame[0], end: v.time_frame[1]
        // /api/statistic/export/kf_service_work_load?cid=1&start=2018-03-01&end=2018-03-03
        var url = '/api/statistic/export/kf_service_quality_work?cid=1&'

        v.time_frame[0] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[0])
        v.time_frame[1] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[1])
        url = url + 'start='+ v.time_frame[0] + '&'+'end='+ v.time_frame[1]
        v.$api.downloadFromService('',url)
      },
      searchs(index=undefined){
        var v = this
        if(index) v.page.page = index;
        let start = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[0])
        let end = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[1])
        v.page.start = start;
        v.page.end = end;

        v.$api.ajax('/statistic/customer_service_quality_work', 'get', v.page).then(function (data) {

          v.allData = data
          v.list = data.list
          //造数据测试
          // v.list[0].相对满意度='--'

          v.total = data.total;
        })
      },
      goDetail(info){
        this.$router.push({
          name:'工作量详情',
          params:{info:info,historys:this.$router.history.current.matched,search:this.page.time},
          path:'/report2/servicer/workloadDetail',
          query:{id:info.id}
        });
      },
			合并相同对象数字数据(p,n){
				for(let i in p){

					if(!n.hasOwnProperty(i)) continue;
					p[i]=p[i]===null||p[i]===''?0:p[i];
					if(typeof p[i] == 'number' && typeof n[i] == 'number'){
						p[i] +=n[i];
					}
					while(typeof p[i] == 'string'){
						try{
							p[i] = JSON.parse(p[i]);
						}catch(e){
							break;
						}
					}
					while(typeof n[i] == 'string'){
						try{
							n[i] = JSON.parse(n[i]);
						}catch(e){
							break;
						}
					}
					if(typeof p[i] == 'object' && typeof n[i] == 'object'){
						this.合并相同对象数字数据(p[i],n[i]);
					}
				}
				return p;
			},
			changeFilterSort(akey,isactive,status){
				this.page.sort_filed = akey;
				this.page.sort = Number(!Boolean(status));
				this.searchs();
			},
		},
		components:{
			pagination,
      sort
		},
		watch:{
			'time_frame':{
				handler(n){
					this.searchs(1);
				},deep:true
			}
		},
		directives:{

		},
		filters:{

		},
	}
</script>

<style>
  .top3_box_content_rw{
    margin: 5px 20px 10px 0px;;

  }
</style>
