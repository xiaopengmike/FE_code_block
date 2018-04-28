<template>
	<div class='report'>
		<h1 class="page_title">
			留言报表
			<el-date-picker class="pull-right search_time" v-model="search.date" :picker-options="pickerOptions" :clearable="false" size="small" type="daterange" format="yyyy年MM月dd日" placeholder="选择日期"> </el-date-picker>
		</h1>
		<div class=" clearfix">
			<div  class=" col-md-12">
				<div class="part">
					<h4 class="box_title">留言数</h4>
					<div class="large_canvas">
						<chart :options="留言数_option" :auto-resize="true" class="large_canvas"></chart>
					</div>
				</div>
			</div>
		</div>
		<div class="clearfix breakFirstCol">
			<div class="col-sm-6">
				<h4 class="box_title noBorder marginTop">留言来源&nbsp;<word-explain keys="工作报表-留言-留言来源"></word-explain> </h4>
				<div class="small_canvas part noMarginTop">
					<chart :options="留言来源_pieOption" :auto-resize="true"></chart>
					<div class="info" size="2">
						<p>
							<i class="fa fa-weixin " :style="{color:留言来源_pieOption.color[0]}"/>&ensp;
							{{(留言来源_pieOption.series[0].data[0].value/((留言来源_pieOption.series[0].data[1].value+留言来源_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%
						</p>
						<p>
							<i class="ivu-icon ivu-icon-android-phone-portrait font20" :style="{color:留言来源_pieOption.color[1],}"/>&ensp;&nbsp;&thinsp;
							{{(留言来源_pieOption.series[0].data[1].value/((留言来源_pieOption.series[0].data[1].value+留言来源_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%
						</p>
					</div>
				</div>
			</div>
			<div class="col-sm-6">
				<h4 class="box_title noBorder marginTop">留言处理率&nbsp;<word-explain keys="工作报表-留言-留言处理率"></word-explain></h4>
				<div class="small_canvas part noMarginTop">	
					<chart :options="留言处理率_pieOption" :auto-resize="true"></chart>
					<div class="info" size="2">
						<p>
							<i class="fa fa-circle-o" :style="{color:留言处理率_pieOption.color[0]}"/>&ensp;
							<span class="ps">已处理</span>
							{{(留言处理率_pieOption.series[0].data[0].value/((留言处理率_pieOption.series[0].data[1].value+留言处理率_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%
						</p>
						<p>
							<i class="fa fa-circle-o" :style="{color:留言处理率_pieOption.color[1]}"/>&ensp;
							<span class="ps">未处理</span>
							{{(留言处理率_pieOption.series[0].data[1].value/((留言处理率_pieOption.series[0].data[1].value+留言处理率_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="breakFirstCol clearfix">
			<div class=" col-xs-12">
				<h4 class="box_title noBorder marginTop">咨询分类&nbsp;<word-explain keys="工作报表-留言-咨询分类"></word-explain></h4>
				<div class=" part noMarginTop small_canvas2">
					<chart :options="咨询分类_pieOption" :auto-resize="true"></chart>
				</div>	
			</div>
			
		</div>
		<br />
	</div>
</template>

<script>
	import ECharts from '../module/ECharts.vue'
	import 图表 from '../mixin/图表.js'
	export default{
		mixins:[图表],
		data(){
			return {
				search:{
					date:[new Date().getTime()-7*24*3600*1000,new Date().getTime()],
				},
				pickerOptions: {
					/*shortcuts: [ {
			            text: '昨天',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24);
			              end.setTime(end.getTime() - 3600 * 1000 * 24);
			              picker.$emit('pick', [start, end]);
			            }
			       },{
			            text: '最近一周',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			              picker.$emit('pick', [start, end]);
			            }
			        }, {
			            text: '最近一个月',
			            onClick(picker) {
			              const end = new Date();
			              const start = new Date();
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
			              picker.$emit('pick', [start, end]);
			            }
			        }],*/
		          	disabledDate(time) {
		            	return time.getTime() > Date.now();
		          	}
		       		
		        },
				留言数_option:{},
				
				留言来源_pieOption:{},
				
				留言处理率_pieOption:{},
				
				咨询分类_pieOption:{},
				
			}
		},
		created(){
			this.init图配置();
			this.searchs()
		},
		methods:{
			init图配置(){
				let v= this;
				let legend1 = ['留言数'];
				let rgbs = [window.color.green.rgb];
				v.留言数_option = v.fn_mixin获取折线和柱状图配置(legend1,rgbs);
				v.留言数_option.color = [window.color.green.str,window.color.yellow.str,window.color.red.str];
				v.留言来源_pieOption = v.fn_mixin获取空心饼状图配置([ 'wx','H5'],0);
				v.留言来源_pieOption.color=['#3cd66b','#768bd2'];
				v.留言处理率_pieOption = v.fn_mixin获取空心饼状图配置(['已处理','未处理'],0);
				v.留言处理率_pieOption.color=['#76d2b7','#d6e4eb'];
				v.咨询分类_pieOption = v.fn_mixin获取空心饼状图配置([],0);
				v.咨询分类_pieOption.series[0].center = ['300','50%']
				v.咨询分类_pieOption.legend = {
				        orient: 'vertical',
				        left: 530,
				        x:'left',
				        y:'center',
				        icon:'circle',
				        itemWidth:10,
				        data: [],
				        formatter:function(a){
				        	return a;
				        },
				   };
				v.咨询分类_pieOption.color=["#d6e4eb","#e1c193","#8fd2de","#eca467","#9ac97e","#50d6ec","#ff9a99","#6372c0","#b89cfe","#d38fc7","#c9eb85","#e9d754","#a38063","#d9716f","#3bd59c","#a29f8d","#5f9cac","#c37238","#a1c034","#4bb544","#ff6e6c","#5e89fd","#fbbe2b","#b2e7d2","#b5aedd","#45b8f8","#f8cba9","#99a7ff","#9c9fbf","#dba797","#b63836","#74bcd0","#fe90ea","#ecb6b5","#a1b897","#c5ae0d",];
			},
			searchs(){
				var v = this;
				let start = v.$api.dateFormat('yyyy-MM-dd',v.search.date[0]);
				let end = v.$api.dateFormat('yyyy-MM-dd',v.search.date[1]);
				let search = {
					start:start,
					end:end,
				}
				v.$api.ajax(v.$uri.company.index,'get',search)
				.then(result=>{
					this.清除数据痕迹();
					//排序
					let data = result.result;
					for(let i=0;i<data.length;i++){
						for(let j=i+1;j<data.length;j++){
							if(data[i].created>data[j].created){
								let a = data[i];
								data[i] = data[j];
								data[j] = a;
							}
						}
					}
					let date_format = search.start==search.end?'hh:00':'yyyy-MM-dd';
					let days = search.start==search.end?1:(data.length||1);
					let hours = data.length;
					
					data.forEach(val=>{
						val.created = search.start==search.end?new Date(val.created).getTime():new Date(val.created).getTime()-24*3600*1000;
						let time = v.$api.dateFormat(date_format,val.created+180*1000);
						if(time ==='00:00') time = '24:00';
						let index = v.留言数_option.xAxis.data.indexOf(time);
						if(index!=-1){
							v.留言数_option.series[0].data[index]=val.留言数;
						}
						if(typeof val.留言来源 == 'string'){
							val.留言来源 = JSON.parse(val.留言来源);
						}
						if(val.留言来源 && !v.$api.isEmptyObj(val.留言来源)){
							v.留言来源_pieOption.series[0].data[0].value += val.留言来源.weixin;
							v.留言来源_pieOption.series[0].data[1].value += val.留言来源.h5;
						}
						v.留言处理率_pieOption.series[0].data[0].value += val.留言处理量;
						v.留言处理率_pieOption.series[0].data[1].value += val.留言数-val.留言处理量;
						if(typeof val.咨询分类 == 'string'){
							val.咨询分类 = JSON.parse(val.咨询分类);
						}
						for(let tag in val.咨询分类){    
							let index = v.咨询分类_pieOption.legend.data.indexOf(tag);
							if(index!=-1){
								v.咨询分类_pieOption.series[0].data[index].value += val.咨询分类[tag];
							}else{
								v.咨询分类_pieOption.legend.data.push(tag);
								v.咨询分类_pieOption.series[0].data.push({name:tag,value:val.咨询分类[tag]});
							}
						}
							
					})
				});
			},
			清除数据痕迹(){
				let v = this;
				let 图标1 = ['留言数_option'];
				let 图标2 = ['留言来源_pieOption','留言处理率_pieOption'];
				let time = {start:v.search.date[0],end:v.search.date[1]};   
				图标1.forEach(val=>{
					v.fn_mixin初始化折线和柱状图Bytime(v[val],time,0);
				});
				图标2.forEach(val=>{
					v.fn_mixin初始化饼状图(v[val],0);
				})
				v.咨询分类_pieOption.legend.data=[];
				v.咨询分类_pieOption.series[0].data=[];
			}
		},
		components:{
			'chart':ECharts,
		},
		watch:{
			'search.date':{
				handler:function(n,o){
					this.searchs();
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
	.part{
		.middle_canvas {width:100%; height:250px;}
	}
</style>