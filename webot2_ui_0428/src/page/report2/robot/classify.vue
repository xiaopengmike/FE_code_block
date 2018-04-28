<template>
	<div class="report report_robor_classify">

    <h1 class="page_title noBorder">
      问题分类统计&nbsp;<word-explain keys="工作报表-机器人-问题分类统计"></word-explain>
      <button class="my-btn my-btn-info-o pull-right font14 marg_l_10"
              @click="download()"
      ><i class="fa fa-sign-out"></i>导出报表</button>
    </h1>
		<div class="table_wrap">
			<div class="table4 simulate_table">
				<ul class="thead">
					<li class="tr">
						<div class="th">问题分类名称</div>
						<div class="th">匹配占比&ensp;<sort akey="match_count" :active="page.sort_filed=='match_ratio'" :status="page.sort" @click="changeFilterSort"></sort></div>
						<div class="th">匹配次数&nbsp;<sort akey="match_ratio" :active="page.sort_filed=='match_count'" :status="page.sort" @click="changeFilterSort"></sort></div>
					</li>
				</ul>
				<ul class="tbody">
					<li class="tr" v-for="(item,i) in list">
						<div class="td" :title="item.问题分类">{{item.问题分类||0}}</div>
						<div class="td" :title="item.匹配占比">{{(item.匹配占比*100).toAccuracy(2)+"%"||0}}</div>
						<div class="td" :title="item.匹配次数">{{item.匹配次数||0}}</div>
					</li>
				</ul>
			</div>
			<br />
			<div class="pagination_wrap text-center" v-if="total>0">
                <el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="searchs" layout="total, prev, pager, next, jumper"></el-pagination>
            </div>
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
					size:15,
					count:15,
					sort: 0,
					sort_filed:'match_count',
				},
				list:[],
				total:0,
			}
		},
		created(){
			this.searchs();
		},
		computed:{
		},
		methods:{
      download(){
        let v =this;
        // start: v.time_frame[0], end: v.time_frame[1]
        // /api/statistic/export/kf_service_work_load?cid=1&start=2018-03-01&end=2018-03-03
        var url = '/api/statistic/export/question_classification_statistics?cid=1&'

        v.time_frame[0] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[0])
        v.time_frame[1] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[1])
        url = url + 'start='+ v.time_frame[0] + '&'+'end='+ v.time_frame[1]
        v.$api.downloadFromService('',url)
      },
			searchs(index=0){
				var v = this;
				if(index) v.page.page = index;
				let start = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[0]);
				let end = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[1]);
				v.page.start = start;
				v.page.end = end;
				v.$api.ajax('/statistic/question_classification_statistics','get',v.page)
				.then(data=>{
						v.list = data.list;
						v.total = data.total;
				});
			},
			compare(property){
			    return function(a,b){
			        var value1 = a[property];
			        var value2 = b[property];
			        return  value2-value1;
			    }
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

<style lang="scss">
	@import '../../../assets/scss/api.scss';
	$th_widths:(0.4, 0.3, 0.3);
	.report_robor_classify {
		.simulate_table {
			@include simulateTableThWidth($th_widths);
		}
	}
</style>
