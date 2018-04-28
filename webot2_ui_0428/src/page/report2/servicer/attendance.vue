<template>
	<div class="workload report">
		<div class="table_filter">
			<button class="my-btn my-btn-info-o filter_btn" style="position:absolute; top:-40px; right:0;"
              @click="show_table_th=!show_table_th">
				筛选&nbsp;<i class="icon fa fa-angle-right" :class="{active:show_table_th}"></i>
			</button>
			<div class="filter_wrap" v-show="show_table_th">
				<span class="th" v-for="(t,k) in table_th" v-show="!t.notShow" :class="table_th[k].visibled?'visibled':''"
              @click="table_th[k].visibled=!table_th[k].visibled">{{k}}
          <Icon v-show="table_th[k].visibled" type="checkmark"></Icon></span>

        <span class="th" v-for="(t,k) in table_th_kf_status" v-show="!t.notShow"
              :class="table_th_kf_status[k].visibled?'visibled':''"
              @click="table_th_kf_status[k].visibled=!table_th_kf_status[k].visibled">{{k}}
          <Icon v-show="table_th_kf_status[k].visibled" type="checkmark"></Icon>
        <!--{{k}}-->
        </span>
			</div>
		</div>

    <h1 class="page_title noBorder">
      考勤信息&nbsp;<word-explain keys="工作报表-客服-考勤信息"></word-explain>
      <button class="my-btn my-btn-info-o pull-right font14 marg_l_10"
              @click="download()"
      ><i class="fa fa-sign-out"></i>导出报表</button>

    </h1>

		<div class="table_wrap">
			<table class="table4">
				<thead>
					<tr>
						<th v-for="(t,k) in table_th" v-show="t.visibled">{{k}}&ensp;<sort v-if="t.sortable" :akey="t.sortname" :active="page.sort_filed==t.sortname" :status="page.sort" @click="changeFilterSort"></sort></th>
						<th v-for="(t,k) in table_th_kf_status" v-show="t.visibled">{{k}}&ensp;<sort v-if="t.sortable" :akey="t.sortname" :active="page.sort_filed==t.sortname" :status="page.sort" @click="changeFilterSort"></sort></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item,i) in list" @click="goDetail(item)" class="pointer" :class="{editing:AUX.selected_id == item.id}">
            <td v-show="table_th.姓名.visibled">{{ kfs_info[item.姓名] && kfs_info[item.姓名].username ? kfs_info[item.姓名].username : '--' }}</td>
						<td v-show="table_th.登录总时长.visibled">{{$api.MillisecondToDate(item.登录总时长*1000)||0 }}</td>
						<td v-show="table_th.首次在线时间.visibled">{{item.首次上线时间}}</td>
						<td v-show="table_th.最后离线时间.visibled">{{item.最后离线时间}}</td>
						<td v-show="table_th.在线总时长.visibled">{{$api.MillisecondToDate(item.在线总时长*1000)||0 }}</td>
						<!--<td v-show="table_th.在线时长比.visibled">{{  ((item.在线时长比*100).toAccuracy(2))+'%'}}</td>-->
						<td v-show="table_th.在线时长比.visibled">{{item.在线时长比}}</td>
            <td v-for="item02 in allData.titles"    v-show="table_th_kf_status[item02].visibled">
              {{item02.indexOf('比')!=-1?
              item[item02]
              :$api.MillisecondToDate(item[item02]*1000)}}
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

        table_th_kf_status:{
        },

				table_th:{
          姓名:{visibled:true,sortable:false,notShow:true},
          登录总时长:{visibled:true,sortable:true ,sortname:'登录总时长'},
          首次在线时间:{visibled:false,sortable:true ,sortname:'首次上线时间'},
          最后离线时间:{visibled:false,sortable:true ,sortname:'最后离线时间'},
          在线总时长:{visibled:true,sortable:true ,sortname:'在线总时长'},
          在线时长比:{visibled:true,sortable:true ,sortname:'在线时长比'},
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
        var url = '/api/statistic/export/attendance?cid=1&'

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

        if(v.page.start==v.page.end){

          v.table_th.首次在线时间.visibled=true
          v.table_th.最后离线时间.visibled=true
        }
        if(v.page.start!=v.page.end){

          v.table_th.首次在线时间.visibled=false
          v.table_th.最后离线时间.visibled=false
        }


        v.$api.ajax('/statistic/customer_attendance', 'get', v.page).then(data=>{

          v.table_th_kf_status={

          }
            //状态复原
          v.allData = data
          v.list = data.list
          var titles =data.titles
          // var titles =
          //   [
          //     'titles01','titles02',
          //   ]


          titles.forEach(item=>{
            let obj = {
              'visibled':true,
              'sortable':true,
              'sortname':item
            }
            v.$set(v.table_th_kf_status, item, obj)
           // v.table_th_kf_status[item]=
           //    {
           //      'visibled':false,
           //      'sortable':true,
           //      'sortname':item
           //     }
          })



          v.total = data.total;
        } )
      },
      goDetail(info){
        this.$router.push({
          name:'工作量详情',
          params:{info:info,historys:this.$router.history.current.matched,search:this.page.time},
          path:'/report2/servicer/workloadDetail',
          query:{id:info.姓名}
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
