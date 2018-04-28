<template>
	<div class="workload report">
		<!--<div class="input-group serach_wrap clearfix">
			<span class="page_title pull-left">工作量报表</span>
		  	<input class="form-control" placeholder="请输入搜索关键字" v-model="page.q" @keydown.13="searchs" />
		  	<span class="pointer" @click="page.q=''"><img src="../../../assets/img/remove_icon.png"  /> </span>
		  	<span class="btns-search pointer">
		    	<span class="btns-search glyphicon glyphicon-search" @click="searchs()"></span>
		  	</span>
		  	<el-date-picker v-model="page.time" :picker-options="pickerOptions" @change="searchs(1)" :clearable="false" type="daterange" format="yyyy年MM月dd日" placeholder="选择日期"> </el-date-picker>
		</div>-->
    <h1 class="page_title_rewrite no_underLine_tittle page_title_rw">
      工单分类统计&nbsp;<word-explain keys=""></word-explain>
      <button class="my-btn my-btn-info-o pull-right font14 marg_l_10"
              @click="download()"
      ><i class="fa fa-sign-out"></i>导出报表</button>
    </h1>
		<!--<div class="table_filter">-->
			<!--<button class="my-btn my-btn-info-o filter_btn" @click="show_table_th=!show_table_th " style="position:absolute; top:-40px; right:0;">-->
				<!--筛选&nbsp;<i class="icon fa fa-angle-right" :class="{'active':show_table_th}"></i>-->
			<!--</button>-->
			<!--<div class="filter_wrap" v-show="show_table_th">-->
				<!--<span class="th" v-for="(t,k) in table_th" :class="t.visibled?'visibled':''" @click="t.visibled=!t.visibled">{{k}}<Icon v-show="t.visibled" type="checkmark"></Icon></span>-->
			<!--</div>-->
		<!--</div>-->
		<div class="table_wrap">
			<table class="table4">
				<thead>
					<tr>
						<th v-for="(t,k) in table_th" v-show="t.visibled">{{k}}&ensp;<sort v-if="t.sortable" :akey="t.sortname" :active="page.sort_filed==t.sortname" :status="page.sort" @click="changeFilterSort"></sort></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item,i) in list" v-if="i>=(page.page-1)*page.size&&i<page.page*page.size"  class="pointer">
						<td v-show="table_th.工单分类.visibled">{{ tags[item.工单分类] || '--'}}</td>
            <!--this.$uri.workold.tags-->

						<td v-show="table_th.新建工单量.visibled">{{item.新建工单量||0}}</td>
						<td v-show="table_th.当前已解决工单量.visibled">{{item.当前已解决工单量||0}}</td>
						<td v-show="table_th.工单解决率.visibled">{{((item.工单解决率*100) || 0).toAccuracy(2)}}%</td>
						<td v-show="table_th.当前未受理工单量.visibled">{{item.当前未受理工单量||0}}</td>
						<td v-show="table_th.当前已受理工单量.visibled">{{item.当前已受理工单量||0}}</td>
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
		props:[
		   	'time_frame',
    	],
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
				list:[],
				total:0,
				tags:{
					'-1':'未分类',
				},
				show_table_th:false,
				table_th:{
					工单分类:{visibled:true,sortable:false},
					新建工单量:{visibled:true,sortable:true, sortname:'create'},
					当前已解决工单量:{visibled:true,sortable:true, sortname:'solve'},
		            工单解决率:{visibled:true,sortable:true, sortname:'solve_ratio'},
		            当前未受理工单量:{visibled:true,sortable:true, sortname:'unhandle'},
		            当前已受理工单量:{visibled:true,sortable:true, sortname:'handle'},
				}
			}
		},
		created(){
			this.getTags();
			this.searchs();
		},
		computed:{

		},
		methods:{
      download(){
        let v =this;
        // start: v.time_frame[0], end: v.time_frame[1]
        // /api/statistic/export/kf_service_work_load?cid=1&start=2018-03-01&end=2018-03-03
        var url = '/api/statistic/export/work_order_classification?cid=1&'

        v.time_frame[0] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[0])
        v.time_frame[1] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[1])
        url = url + 'start='+ v.time_frame[0] + '&'+'end='+ v.time_frame[1]
        v.$api.downloadFromService('',url)
      },
		    searchs(index=undefined){
		        var v = this;
		        if(index) v.page.page = index;
		        let start = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[0])
		        let end = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[1])
			    v.page.start = start;
			    v.page.end = end;
		        v.$api.ajax('/statistic/woker_order_classification', 'get', v.page).then( (data)=> {
		          v.list = data.list
					v.total = data.total;
					v.$emit('changeData',data);
		        })
		    },
		    getTags(){
		    	let v = this;
		    	v.$api.ajax(v.$uri.workold.tags,'get')
		    	.then(data=>{
		    		data.forEach(val=>{
		    			v.tags[val.id] = val.name;
		    		})
		    	});
		    },
			goDetail(info){
				this.$router.push({
									path:'/report/servicer/workloadDetail',
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
				handler:function(n){
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
  .page_title_rw{
    margin-top: -5px;
  }
</style>
