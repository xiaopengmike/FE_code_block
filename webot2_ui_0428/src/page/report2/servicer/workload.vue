<template>
	<div class="workload report">
		<div class="table_filter">
			<button class="my-btn my-btn-info-o filter_btn" @click="show_table_th=!show_table_th" style="position:absolute; top:-40px; right:0;">
				筛选&nbsp;<i class="icon fa fa-angle-right" :class="{'active':show_table_th}"></i>
			</button>

			<div class="filter_wrap" v-show="show_table_th">
				<span class="th" v-for="(t,k) in table_th" v-show="!t.notShow" :class="t.visibled?'visibled':''" @click="t.visibled=!t.visibled">{{k}}<Icon v-show="t.visibled" type="checkmark"></Icon></span>
			</div>
		</div>

    <h1 class="page_title noBorder">
      工作量&nbsp;<word-explain keys="工作报表-客服-工作量"></word-explain>
      <button class="my-btn my-btn-info-o pull-right font14 marg_l_10"
              @click="download()"
      ><i class="fa fa-sign-out"></i>导出报表</button>

    </h1>
    <div class="data-screening">
      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">{{allData.人均接入会话量.toAccuracy(2)||0}}</div>
            <div class="message">平均接入会话量</div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">{{$api.MillisecondToDate((allData.人均在线时长*1000))}}
            </div>
            <div class="message">平均在线时长</div>
          </div>
        </div>
      </div>
    </div>

		<br />
		<div class="table_wrap">
			<table class="table4">
				<thead>
					<tr>
						<th v-for="(t,k) in table_th" v-show="t.visibled ">{{k}}&ensp;<sort v-if="t.sortable" :akey="t.sortname" :active="page.sort_filed==t.sortname" :status="page.sort" @click="changeFilterSort"></sort></th>

					</tr>
				</thead>
				<tbody>
					<tr v-for="(item,i) in list" @click="goDetail(item)" class="pointer" :class="{editing:AUX.selected_id == item.id}">
						<td v-show="table_th.姓名.visibled">{{ kfs_info[item.id] && kfs_info[item.id].username ? kfs_info[item.id].username : '--'}}</td>
						<td v-show="table_th.接入会话量.visibled">{{item.接入会话量}}</td>
						<td v-show="table_th.未回复会话量.visibled">{{item.未回复会话量}}</td>
						<td v-show="table_th.未回复率.visibled"> {{(item.未回复率*100).toAccuracy(2)}}% </td>
            <td v-show="table_th.无效会话量.visibled">{{item.无效会话量}}</td>
            <td v-show="table_th.结束会话量.visibled">{{item.结束会话量}}</td>
            <td v-show="table_th.结束率.visibled">{{(item.结束率*100).toAccuracy(2)}}%</td>


            <td v-show="table_th.超时会话量.visibled">{{item.超时会话量}}</td>
            <td v-show="table_th.超时率.visibled">{{(item.超时率*100).toAccuracy(2) }}%</td>

						<td v-show="table_th.转接量.visibled">{{item.转接量}}</td>
            <td v-show="table_th.转接率.visibled">{{(item.转接率*100).toAccuracy(2) }}%</td>
            <td v-show="table_th.主动会话量.visibled">{{item.主动会话量 || 0}}</td>
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
				page:{
					cid:1,
					page:1,
					size:10,
					count:10,
					sort: 0,
					sort_filed:'',
				},
        allData:{
          人均接入会话量:0,
          人均在线时长:0
        },
				list:[],
				total:0,
				kfs_info:'',
				show_table_th:false,
				table_th:{
					姓名:{visibled:true,sortable:false,notShow:true},
					接入会话量:{visibled:true,sortable:true, sortname:'access'},
					未回复会话量:{visibled:true,sortable:true, sortname:'unanswered'},
					未回复率:{visibled:true,sortable:true, sortname:'unanswered_ratio'},
					无效会话量:{visibled:false,sortable:true, sortname:'invalid'},

          结束会话量:{visibled:true,sortable:true, sortname:'end_session_volume'},
          结束率:{visibled:true,sortable:true, sortname:'end_rate'},
          超时会话量:{visibled:true,sortable:true, sortname:'timeout_session'},
          超时率:{visibled:true,sortable:true, sortname:'overtime_rate'},

          转接量:{visibled:false,sortable:true, sortname:'transfer'},
          转接率:{visibled:true,sortable:true, sortname:'transfer_ratio'},
          主动会话量:{visibled:true,sortable:true, sortname:'initiative'},
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
        var url = '/api/statistic/export/kf_service_work_load?cid=1&'

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
        v.$api.ajax('/statistic/kf_service_work_load', 'get', v.page).then(function (data) {
          v.allData = data;
          v.list = data.list;
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
