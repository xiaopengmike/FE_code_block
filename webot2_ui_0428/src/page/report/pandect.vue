<template>
	<div class="report">
		<h1 class="page_title">
			工作报表总览2.0_new&nbsp;<word-explain keys="工作报表-总览-在线服务数据"></word-explain>
			<div class="pull-right search_time">
				<el-date-picker v-model="search.date" :picker-options="pickerOptions" :clearable="false" type="daterange" format="yyyy年MM月dd日" size="small" placeholder="选择日期"> </el-date-picker>
			</div>
		</h1>
		<div class="clearfix">
			<!--悬浮框-->
			<el-popover ref="dataPandect1" trigger="hover"  popper-class="black">
				<div class="data_pandect">
					<table class="word-explain-table">
				  		<tr>
				  			<td title="答问比：就是问与回答的比例">答问比</td><td>{{((oneData['客服答案数']/(oneData['客户问题数']||1))*100).toFixed(2)}}%</td>
				  		</tr>
				  		<tr>
				  			<td>30s应答率</td><td>{{oneData['应答率30s']||0}}%</td>
				  		</tr>
				  	</table>
				</div>
			</el-popover>
			<el-popover ref="dataPandect2" trigger="hover"  popper-class="black">
				<div class="data_pandect">
					<table class="word-explain-table">
				  		<tr>
				  			<td>平均首次响应时间</td><td>{{$api.MillisecondToDate(oneData['平均首次响应时长'])}}</td>
				  		</tr>
				  		<tr>
				  			<td>平均响应时间</td><td>{{$api.MillisecondToDate(oneData['平均响应时长'])}}</td>
				  		</tr>
				  	</table>
				</div>
			</el-popover>
			<el-popover ref="dataPandect3"  trigger="hover"  popper-class="black">
				<div class="data_pandect">
					<table class="word-explain-table">
				  		<tr>
				  			<td>机器人解决量</td><td>{{oneData['机器人解决量']}}</td>
				  		</tr>
				  		<tr>
				  			<td>机器人解决率</td><td>{{oneData['机器人解决率']||0}}%</td>
				  		</tr>
				  	</table>
				</div>
			</el-popover>
			<el-popover ref="dataPandect4" trigger="hover"  popper-class="black">
				<div class="data_pandect">
					<table class="word-explain-table">
				  		<tr>
				  			<td>参评率</td><td>{{oneData['参评率']||0}}%</td>
				  		</tr>
				  		<tr>
				  			<td>一次性解决率</td><td>{{oneData['一次性解决率']||0}}%</td>
				  		</tr>
				  	</table>
				</div>
			</el-popover>
			<!--悬浮框-->
			<div class="data-screening">
				<div class="col-md-6 col-lg-3">
					<div class="box_info color1">
						<div class="box_content" v-popover:dataPandect1>
							<div class="icon">
								<img src="../../assets/img/report_bell.png" alt="">
							</div>
							<div class="text">
								<strong>{{oneData.总消息量}}</strong>
								<h3>总消息量&emsp;&emsp;&emsp;</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="box_info  color2">
							<div class="box_content" v-popover:dataPandect2>
								<div class="icon">
									<img src="../../assets/img/home_dataScreening01.png" alt="">
								</div>
								<div class="text">
									<strong>{{$api.MillisecondToDate(oneData['平均会话时长'])}}</strong>
									<h3>平均会话时长</h3>
								</div>
							</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="box_info color3">
							<div class="box_content"  v-popover:dataPandect3>
								<div class="icon">
									<img src="../../assets/img/home_dataScreening04.png" alt="">
								</div>
								<div class="text">
									<strong>{{oneData['总会话量']}}</strong>
									<h3>总会话量&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h3>
								</div>
							</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="box_info color4">
							<div class="box_content" v-popover:dataPandect4>
								<div class="icon">
									<img src="../../assets/img/home_dataScreening03.png" alt="">
								</div>
								<div class="text">
									<strong>{{oneData['满意度']}}%</strong>
									<h3>相对满意度&emsp;&emsp;&emsp;&emsp;</h3>
								</div>
							</div>
						</div>
					</div>
			</div>
		</div>
		<!--<div class="resolve part clearfix">
			<div class="col-md-3 col-lg-3 col-sm-3 text-center ">
				<div class="box_info">
					<div class="total">
						<h3>总会话量</h3>
						<strong>{{oneData['总会话量']}}</strong>
					</div>
					<div class="rate">
						<p>机器人解决量：<br />机器人解决率：</p>
						<p>{{oneData['机器人解决量']}}<br />{{oneData['机器人解决率']}}%</p>
					</div>
				</div>
			</div>
			<div class="col-md-3  col-lg-3 col-sm-3 text-center">
				<div class="box_info">
					<div class="total">
						<h3>总消息量</h3>
						<strong>{{oneData['总消息量']}}</strong>
					</div>
					<div class="rate">
						<p>答问比：<br />30s应答率：</p>
						<p>{{((oneData['客服答案数']/(oneData['客户问题数']||1))*100).toFixed(2)}}%<br />{{oneData['应答率30s']||0}}%</p>
					</div>
				</div>
			</div>
			<div class="col-md-3 col-lg-3 col-sm-3 text-center">
				<div class="box_info">
					<div class="total">
						<h3>平均会话时长(分钟)</h3>
						<strong>{{oneData['平均会话时长']}}</strong>
					</div>
					<div class="rate">
						<p>平均首次响应时间(分钟)：<br />平均响应时间(分钟)：</p>
						<p>{{oneData['平均首次响应时长']}}<br />{{(oneData['平均响应时长'])}}</p>
					</div>
				</div>
			</div>
			<div class="col-md-3 col-lg-3 col-sm-3 text-center">
				<div class="box_info">
					<div class="total">
						<h3>相对满意度</h3>
						<strong>{{oneData['满意度']}}%</strong>
					</div>
					<div class="rate">
						<p>参评率：<br />一次性解决率：</p>
						<p>{{oneData['参评率']||0}}%<br />{{oneData['一次性解决率']||0}}%</p>
					</div>
				</div>
			</div>
		</div>-->
		<div>
			<div class="clearfix">
				<div class="col-xs-12">
					<div  class="part">
						<div class="large_canvas" >
							<chart :options="会话量_option" :auto-resize="true"></chart>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="clearfix">
			<div class="col-xs-12" >
				<div class="part">
					<h4 class="box_title ">消息量&nbsp;<word-explain keys="工作报表-总览-消息量"></word-explain></h4>
					<div class="large_canvas">
						<chart :options="消息量_option" :auto-resize="true" ></chart>
					</div>
				</div>
			</div>
		</div>
		<div class="clearfix breakFirstCol">
			<div class="col-md-4 col-sm-6 ">
				<h4 class="box_title noBorder marginTop">首次响应时间&nbsp;<word-explain keys="工作报表-总览-首次响应时间"></word-explain></h4>
				<div class="small_canvas part noMarginTop">
					<chart :options="首次响应时间_barOption" :auto-resize="true" ></chart>
				</div>
			</div>
			<div class="col-md-4 col-sm-6 ">
				<h4 class="box_title noBorder marginTop">响应时间&nbsp;<word-explain keys="工作报表-总览-响应时间"></word-explain></h4>
				<div class=" small_canvas part noMarginTop">
					<chart :options="响应时间_barOption" :auto-resize="true" ></chart>
				</div>
			</div>
			<div class="col-md-4 col-sm-6 ">
				<h4 class="box_title noBorder marginTop	">会话时长&nbsp;<word-explain keys="工作报表-总览-会话时长"></word-explain></h4>
				<div class=" small_canvas part noMarginTop">
					<chart :options="会话时长_barOption" :auto-resize="true"></chart>
				</div>
			</div>
		</div>
		<div class=" clearfix breakFirstCol">
			<div class="col-md-4 col-sm-6  ">
				<h4 class="box_title noBorder marginTop">客户来源&nbsp;<word-explain keys="工作报表-总览-客户来源"></word-explain></h4>
				<div class=" part noMarginTop small_canvas">
					<chart :options="客户来源_pieOption" :auto-resize="true"></chart>
					<div class="info" size="2">
						<p>
							<i class="fa fa-weixin " :style="{color:客户来源_pieOption.color[0]}"/>&ensp;
							{{(客户来源_pieOption.series[0].data[0].value/((客户来源_pieOption.series[0].data[1].value+客户来源_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%</p>
						<p>
							<i class="ivu-icon ivu-icon-android-phone-portrait font20" :style="{color:客户来源_pieOption.color[1],}"/>&ensp;&nbsp;&thinsp;
							{{(客户来源_pieOption.series[0].data[1].value/((客户来源_pieOption.series[0].data[1].value+客户来源_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%</p>
					</div>
 				</div>
			</div>
			<div class="col-md-4 col-sm-6">
				<h4 class="box_title noBorder marginTop">问题解决数</h4>
				<div class=" part noMarginTop small_canvas">
					<chart :options="问题解决数_pieOption" :auto-resize="true"></chart>
					<div class="info" size="2">
						<p>
							<i class="ivu-icon ivu-icon-social-reddit" :style="{color:问题解决数_pieOption.color[0]}"/>&ensp;
							{{(问题解决数_pieOption.series[0].data[0].value/((问题解决数_pieOption.series[0].data[1].value+问题解决数_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%
						</p>
						<p>
							<i class="ivu-icon ivu-icon-android-person" :style="{color:问题解决数_pieOption.color[1]}"/>&ensp;
							{{(问题解决数_pieOption.series[0].data[1].value/((问题解决数_pieOption.series[0].data[1].value+问题解决数_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%
						</p>
					</div>
				</div>
			</div>
			<div class="col-md-4 col-sm-6 ">
				<h4 class="box_title noBorder marginTop">满意度</h4>
				<div class=" part noMarginTop small_canvas">
 					<chart :options="满意度_pieOption" :auto-resize="true"></chart>
 					<div class="info" size="2">
						<p>
							<i class="fa fa-thumbs-up" :style="{color:满意度_pieOption.color[0]}"/>&ensp;
							{{(满意度_pieOption.series[0].data[0].value/((满意度_pieOption.series[0].data[1].value+满意度_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%</p>
						<p>
							<i class="fa fa-thumbs-down" :style="{color:满意度_pieOption.color[1]}"/>&ensp;
							{{(满意度_pieOption.series[0].data[1].value/((满意度_pieOption.series[0].data[1].value+满意度_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%</p>
					</div>
				</div>
			</div>
		</div>
		<div class=" breakFirstCol clearfix">
			<div class="col-xs-12">
				<h4 class="box_title noBorder marginTop">咨询分类&nbsp;<word-explain keys="工作报表-总览-咨询分类"></word-explain></h4>
				<div class=" part noMarginTop small_canvas2">
					<chart :options="咨询分类_pieOption" :auto-resize="true"></chart>
				</div>
			</div>
		</div>
		<br><br>
	</div>
</template>

<script>
	/*import Chart from 'vue-bulma-chartjs'
	import gauge from '../module/gauge'*/
	import ECharts from '../module/ECharts.vue'//'vue-echarts/components/ECharts.vue'
	import echarts from 'echarts'
	import 图表 from '../mixin/图表.js'
	export default {
		mixins:[图表],
		data(){
			return {
				search:{
					date:[new Date().getTime()-7*24*3600*1000,new Date().getTime()-24*3600*1000],
				},
				oneData:{
					"总会话量": 0,
	                 总消息量:0,

	                "参评率": 0,
	                '应答率30s':0,
					"匹配率": 0,
					"机器人解决率": 0,
					"满意率": 0,
				                平均首次响应时间:0,
				                平均响应时间:0,
				                平均会话时长:0,
				                一次性解决率:0,
	                "对话匹配类型": {
	                    "4": 0,
	                    "1": 0,
	                    "2": 0,
	                    "3": 0,
	                    "0": 0
	                },
	                "人工解决量": 0,
	                "机器人解决量": 0,
	                "机器人匹配数": 0,
	                   留言数:0,
	               	客户问题数:0,
	               	客服答案数:0,
				},
				pickerOptions: {
					shortcuts: [ {
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
			        }],
		          	disabledDate(time) {
		            	return time.getTime() > Date.now()-24*3600*1000;
		          	}

		        },


		        会话量_option:{ },
				消息量_option:{},
		        首次响应时间_barOption:{},
		       	响应时间_barOption:{},
		        会话时长_barOption:{},
		       	客户来源_pieOption:{},
		       	问题解决数_pieOption:{	},
		       	满意度_pieOption:{},
		       	咨询分类_pieOption:{	}

			}
		},
		created(){
			this.init图配置();
			this.searchs();
		},
		mounted(){
			//this.清除数据痕迹();
		},
		methods:{
			init图配置(){
				let v= this;
				let legend1 = ['机器人会话量','人工会话量','总会话量'];
				let rgbs1 =  [window.color.blue.rgb,window.color.yellow.rgb,window.color.red.rgb];
				v.会话量_option = v.fn_mixin获取折线和柱状图配置(legend1,rgbs1);
				v.会话量_option.color = [window.color.blue.str,window.color.yellow.str,window.color.red.str];
				let legend2 =['机器人消息量','人工消息量','消息总数'];
				let rgbs2 =  [window.color.blue.rgb,window.color.yellow.rgb,window.color.green.rgb];
				v.消息量_option = v.fn_mixin获取折线和柱状图配置(legend2,rgbs2);
				v.消息量_option.color = [window.color.blue.str,window.color.yellow.str,window.color.green.str];
				let ydata1 = ['<15s','15s-30s', '30s-45s', '45s-1m','>1m'];
				let ydata2 = ['0%','0%', '0%', '0%','0%'];
				let ydata3 = ['<2m','2m-4m', '4m-6m', '6m-8m','>8m'];
				let sdata1 = [100,100,100,100,100];
				let sdata2 = [0,0,0,0,0];
				v.首次响应时间_barOption = v.fn_mixin获取双向柱状图配置(ydata1,ydata2,sdata1,sdata2);
				v.响应时间_barOption = v.fn_mixin获取双向柱状图配置(ydata1,ydata2,sdata1,sdata2);
				v.会话时长_barOption = v.fn_mixin获取双向柱状图配置(ydata3,ydata2,sdata1,sdata2);
				v.客户来源_pieOption = v.fn_mixin获取空心饼状图配置([ 'wx','H5'],0);
				v.客户来源_pieOption.color=['#4fd578','#768bd2'];
				v.问题解决数_pieOption = v.fn_mixin获取空心饼状图配置( ['机器人解决','人工解决'],0);
				v.问题解决数_pieOption.color=['#66afff','#f9c068'];
				v.满意度_pieOption = v.fn_mixin获取空心饼状图配置(['满意','不满意'/*,'未评价'*/],0);
				v.满意度_pieOption.color=['#8bd5f8','#d6e4eb','#d0d0d0'];
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

					let 人工会话量 = 0;
					let 机器人回答数=0,首次响应时长=0,响应时长=0,首次响应个数=0,响应个数=0,总会话时长=0;
					let 会话时长=[0,0,0,0,0],首次响应时间=[0,0,0,0,0],响应时间=[0,0,0,0,0];
					for(let i=0;i<data.length;i++){
						let val = data[i];
						if(typeof val == 'string')
							val = JSON.parse(JSON.parse(val));
						if(typeof val.用户来源 == 'string')
							val.用户来源 = JSON.parse(val.用户来源);
						if(typeof val.解决方式 == 'string')
							val.解决方式 = JSON.parse(val.解决方式);
						if(typeof val.咨询分类 == 'string')
							val.咨询分类 = JSON.parse(val.咨询分类);
						if(typeof val.满意统计 == 'string')
							val.满意统计 = JSON.parse(val.满意统计);
						if(typeof val.首次响应时间 == 'string')
							val.首次响应时间 = JSON.parse(val.首次响应时间);
						if(typeof val.响应时间 == 'string')
							val.响应时间 = JSON.parse(val.响应时间);
						if(typeof val.会话时长 == 'string')
							val.会话时长 = JSON.parse(val.会话时长);

						机器人回答数+=val.机器人消息量;


						v.oneData.总会话量 +=val.会话量;
						v.oneData.总消息量 += val.人工消息量||0+val.机器人消息量||0;

						v.oneData.机器人匹配数 +=val.机器人匹配数||0;
						v.oneData.客户问题数 +=val.客户问题数||0;
						v.oneData.客服答案数 +=val.客服答案数||0;
						v.oneData.留言数 +=val.留言数||0;
						v.oneData.一次性解决率 += (val.一次性解决率)*100;


						val.created = search.start==search.end?new Date(val.created).getTime():new Date(val.created).getTime()-24*3600*1000;
						let time = v.$api.dateFormat(date_format,val.created+180*1000);
						if(time ==='00:00') time = '24:00';
						let index = v.会话量_option.xAxis.data.indexOf(time);console.log(index,time)
						if(index!=-1){
							v.会话量_option.series[2].data[index]=val.会话量;
							v.会话量_option.series[1].data[index]=val.人工会话量;
							v.会话量_option.series[0].data[index]=val.机器人会话量;
							v.消息量_option.series[2].data[index]=val.人工消息量+val.机器人消息量;
							v.消息量_option.series[1].data[index]=val.人工消息量;
							v.消息量_option.series[0].data[index]=val.机器人消息量;
						}
						let times = ['<15s','15s-30s', '30s-45s', '45s-1m','>1m'];
						if(val.首次响应时间 && !v.$api.isEmptyObj(val.首次响应时间)){
							let i = 0;
							while(i<5){
								首次响应时间[i] += val.首次响应时间[times[i]];
								首次响应个数 +=  val.首次响应时间[times[i]];
								i++;
							}
							首次响应时长 += val.首次响应时间.all;
						}
						if(val.响应时间 && !v.$api.isEmptyObj(val.响应时间)){
							let i = 0;
							while(i<5){
								响应时间[i] += val.响应时间[times[i]];
								响应个数 +=  val.响应时间[times[i]];
								i++;
							}
							响应时长 += val.响应时间.all;
						}
						let times2 = ['<2m','2m-4m', '4m-6m', '6m-8m','>8m'];
						if(val.会话时长 && !v.$api.isEmptyObj(val.会话时长)){
							let i = 0;
							while(i<5){
								会话时长[i] += val.会话时长[times2[i]];
								人工会话量 +=  val.会话时长[times2[i]];
								i++;
							}
							总会话时长 += val.会话时长.all;
						}

						if(val.用户来源 && !v.$api.isEmptyObj(val.用户来源)){
							v.客户来源_pieOption.series[0].data[0].value += val.用户来源.weixin;
							v.客户来源_pieOption.series[0].data[1].value += val.用户来源.h5;
						}

						if(val.解决方式 && !v.$api.isEmptyObj(val.解决方式)){
							v.问题解决数_pieOption.series[0].data[0].value += val.解决方式.robot;
							v.问题解决数_pieOption.series[0].data[1].value += val.解决方式.human;
						}
						if(val.满意统计 && !v.$api.isEmptyObj(val.满意统计)){
							v.满意度_pieOption.series[0].data[0].value += val.满意统计.满意;
							v.满意度_pieOption.series[0].data[1].value += val.满意统计.不满意;
							/*v.满意度_pieOption.series[0].data[2].value += val.满意统计.未评价;*/
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

					}

					v.oneData.机器人解决量 = v.问题解决数_pieOption.series[0].data[0].value;
					v.oneData.机器人解决率 = (v.问题解决数_pieOption.series[0].data[0].value/(v.oneData.总会话量||1)*100).toFixed(2);

					v.oneData.平均首次响应时长 = (首次响应时长/(首次响应个数||1)*1000).toFixed(0);
					v.oneData.平均响应时长 = (响应时长/(响应个数||1)*1000).toFixed(0);
					v.oneData.平均会话时长 = (总会话时长/(v.oneData.总会话量||1)*1000).toFixed(0);
					v.oneData.应答率30s = ((v.响应时间_barOption.series[0].data[4]+ v.响应时间_barOption.series[0].data[3])/((v.响应时间_barOption.series[0].data[4]+ v.响应时间_barOption.series[0].data[3]+v.响应时间_barOption.series[0].data[2]+ v.响应时间_barOption.series[0].data[1]+v.响应时间_barOption.series[0].data[0])||1)*100).toFixed(2);

					v.oneData.匹配率= v.oneData.机器人匹配数/(机器人回答数||1)*100;
					v.oneData.满意度 = (v.满意度_pieOption.series[0].data[0].value/((v.满意度_pieOption.series[0].data[0].value+v.满意度_pieOption.series[0].data[1].value)||1)*100).toFixed(2);
					v.oneData.参评率 = ((v.满意度_pieOption.series[0].data[0].value+v.满意度_pieOption.series[0].data[1].value)/(v.oneData.总会话量||1)*100).toFixed(2);
					if(search.start==search.end){
						v.oneData.一次性解决率 =(v.oneData.一次性解决率/hours).toFixed(2);
					}else{
						v.oneData.一次性解决率 =(v.oneData.一次性解决率/days).toFixed(2);
					}


					for(let i=0;i<5;i++){
						v.首次响应时间_barOption.series[1].data[i] = !首次响应时间[i]?0:(首次响应时间[i]/(首次响应个数||1)*100).toFixed(0);
						v.首次响应时间_barOption.yAxis[1].data[i] = v.首次响应时间_barOption.series[1].data[i]+'%';
						v.响应时间_barOption.series[1].data[i] =!响应时间[i]?0:(响应时间[i]/(响应个数||1)*100).toFixed(0);
						v.响应时间_barOption.yAxis[1].data[i] = v.响应时间_barOption.series[1].data[i]+'%';
						v.会话时长_barOption.series[1].data[i] =!会话时长[i]?0:(会话时长[i]/(人工会话量||1)*100).toFixed(0);
						v.会话时长_barOption.yAxis[1].data[i] = v.会话时长_barOption.series[1].data[i]+'%';
					}


				});
			},
			清除数据痕迹(){
				let v = this;
				v.oneData.总会话量 =0;
				v.oneData.机器人匹配数 =0;
				v.oneData.机器人解决量=0;

				v.oneData.解决率 =0;
				v.oneData.总消息量 =0;
				v.oneData.匹配率 =0;
				v.oneData.一次性解决率 = 0;
				v.oneData.满意度=0;
				v.oneData.客户问题数=0;
				v.oneData.客服答案数=0;
				let 图标1 = ['会话量_option','消息量_option'];
				let 图标2 = ['首次响应时间_barOption','响应时间_barOption','会话时长_barOption'];
				let 图标3 = ['客户来源_pieOption','问题解决数_pieOption','满意度_pieOption'];
				let time = {start:v.search.date[0],end:v.search.date[1]};
				图标1.forEach(val=>{
					v.fn_mixin初始化折线和柱状图Bytime(v[val],time,0);
				});
				图标2.forEach(val=>{
					v[val].series[1].data=[];
					let i=0;
					while(i<=4){
						v[val].series[1].data.push(0);
						i++;
					}
				});
				图标3.forEach(val=>{
					v.fn_mixin初始化饼状图(v[val],0);
				});
				v.咨询分类_pieOption.legend.data=[];
				v.咨询分类_pieOption.series[0].data=[];
			}
		},
		watch:{
			'search.date':{
				handler:function(n,o){
					this.searchs();
				},
				deep:true,
			}
		},
		components:{
			'chart':ECharts,
		}
	}
</script>

<style lang="scss">
	#pandect_data{
		.box_info {
			.rate{

				p{display:inline-block; text-align:left; line-height: 22px;}
			}
		}
	}


</style>
