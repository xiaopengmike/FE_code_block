<template>
	<div class="report container-fluid workload_detail">
		<h1 class="box_title">{{params.info.姓名}}</h1>
		<!--悬浮框-->
		<el-popover ref="dataPandect3"  trigger="hover"  popper-class="black">
			<div class="data_pandect">
				<table class="word-explain-table">
			  		<tr>
			  			<td>答问比</td><td>{{oneData['答问比']}}</td>
			  		</tr>
			  		<tr>
			  			<td>30s应答率</td><td>{{oneData['应答率30s']||0}}%</td>
			  		</tr>
			  	</table>
			</div>
		</el-popover>
		<el-popover ref="dataPandect1" trigger="hover"  popper-class="black">
			<div class="data_pandect">
				<table class="word-explain-table">
			  		<tr>
			  			<td>回复率</td><td>{{oneData['回复率']}}</td>
			  		</tr>
			  		<tr>
			  			<td>转接量</td><td>{{oneData['转接量']}}%</td>
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
		<el-popover ref="dataPandect4" trigger="hover"  popper-class="black">
			<div class="data_pandect">
				<table class="word-explain-table">
			  		<tr>
			  			<td>参评率</td><td>{{oneData['参评率']}}</td>
			  		</tr>
			  		<tr>
			  			<td>一次性解决率</td><td>{{oneData['一次性解决率']||0}}%</td>
			  		</tr>
			  	</table>
			</div>
		</el-popover>
		<!--悬浮框-->
		<div class="clearfix">
			<div class="data-screening">
				<div class="col-sm-6 col-lg-3">
					<div class="box_info color1">
						<div class="box_content" v-popover:dataPandect1>
							<div class="icon">
								<img src="../../../assets/img/report_bell.png" alt="">
							</div>
							<div class="text">
								<strong>{{oneData['接入会话量']}}</strong>
								<h3>接入会话量&emsp;&emsp;&emsp;</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="col-sm-6 col-lg-3">
					<div class="box_info  color2">
							<div class="box_content" v-popover:dataPandect2>
								<div class="icon">
									<img src="../../../assets/img/home_dataScreening01.png" alt="">
								</div>
								<div class="text">
									<strong>{{$api.MillisecondToDate(oneData['平均会话时长'])}}</strong>
									<h3>平均会话时长</h3>
								</div>
							</div>
					</div>
				</div>
				<div class="col-sm-6 col-lg-3">
					<div class="box_info color3">
							<div class="box_content" v-popover:dataPandect3>
								<div class="icon">
									<img src="../../../assets/img/home_dataScreening04.png" alt="">
								</div>
								<div class="text">
									<strong>{{oneData['总消息量']}}</strong>
									<h3>总会话量&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h3>
								</div>
							</div>
					</div>
				</div>
				<div class="col-sm-6 col-lg-3">
					<div class="box_info color4">
							<div class="box_content" v-popover:dataPandect4>
								<div class="icon">
									<img src="../../../assets/img/home_dataScreening03.png" alt="">
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
			<div class="text-center  col-md-4 col-1250-5-1">
				<div class="box_info">
					<div class="total">
						<h3>接入会话量</h3>
						<strong>{{oneData['接入会话量']}}</strong>
					</div>
					<div class="rate">
						<p>
							回复率：<br />转接量：
						</p>
						<p>
							{{oneData['回复率']}}%<br />{{oneData['转接量']}}
						</p>
					</div>
				</div>
			</div>
			<div class="text-center  col-md-4 col-1250-5-1">
				<div class="box_info">
					<div class="total">
						<h3>总消息量</h3>
						<strong>{{oneData['总消息量']}}</strong>
					</div>
					<div class="rate">
						<p>答问比：<br />30s应答率：</p>
						<p>{{oneData['答问比']}}%<br />{{oneData['应答率30s']||0}}%</p>
					</div>
				</div>
			</div>
			<div class="text-center  col-md-4 col-1250-5-1">
				<div class="box_info">
					<div class="total">
						<h3>平均会话时长(分钟)</h3>
						<strong>{{oneData['平均会话时长']}}</strong>
					</div>
					<div class="rate">
						<p>平均首次响应时间：<br />平均响应时间：</p>
						<p>{{oneData['平均首次响应时长']}}<br />{{(oneData['平均响应时长'])}}</p>
					</div>
				</div>
			</div>
			<div class="text-center  col-md-4 col-1250-5-1">
				<div class="box_info">
					<div class="total">
						<h3>主动会话量</h3>
						<strong>{{oneData['主动会话量']}}%</strong>
					</div>
					<div class="rate">
						<p>留言处理量：<br />无效会话量：</p>
						<p>{{oneData['留言处理量']||0}}<br />{{oneData['无效会话量']||0}}</p>
					</div>
				</div>
			</div>
			<div class="text-center  col-md-4 col-1250-5-1">
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
		
		<div class="clearfix">
			<div class="col-xs-12">
				<div class="part">
					<h4 class="box_title ">已接入会话量&nbsp;<word-explain keys="工作报表-客服-工作量详情-已接入会话量"></word-explain></h4>
					<div class="large_canvas" >
						<chart :options="已接入会话量_option" :auto-resize="true"></chart>
					</div>
				</div>
			</div>
		</div>
		<div class=" clearfix">
			<div class="col-xs-12">
				<div class="part">
					<h4 class="box_title ">消息量&nbsp;<word-explain keys="工作报表-客服-工作量详情-消息量"></word-explain></h4>
					<div class="large_canvas" >
						<chart :options="消息量_option" :auto-resize="true"></chart>
					</div>
				</div>
			</div>
		</div>
		
		<div class=" breakFirstCol clearfix">
			<div class="col-md-4 col-sm-6">
				<h4 class="box_title noBorder marginTop">首次响应时间&nbsp;<word-explain keys="工作报表-客服-工作量详情-首次响应时间"></word-explain></h4>
				<div class="small_canvas part noMarginTop">
					<chart :options="首次响应时间_barOption" :auto-resize="true" ></chart>
				</div>
			</div>
			<div class="col-md-4 col-sm-6">
				<h4 class="box_title noBorder marginTop">响应时间&nbsp;<word-explain keys="工作报表-客服-工作量详情-响应时间"></word-explain></h4>
				<div class="small_canvas part noMarginTop">
					<chart :options="响应时间_barOption" :auto-resize="true" ></chart>
				</div>
			</div>
			<div class="col-md-4 col-sm-6">
				<h4 class="box_title noBorder marginTop">会话时长&nbsp;<word-explain keys="工作报表-客服-工作量详情-会话时长"></word-explain></h4>
				<div class="small_canvas part noMarginTop">
					<chart :options="会话时长_barOption" :auto-resize="true" ></chart>
				</div>
			</div>
		</div>
		<div class=" breakFirstCol clearfix">
			<div class="col-md-4 col-sm-6">
				<h4 class="box_title noBorder marginTop	">问题解决率&nbsp;<word-explain keys="工作报表-客服-工作量详情-问题解决率"></word-explain></h4>
				<div class="small_canvas part noMarginTop">
					<chart :options="问题解决率_pieOption" :auto-resize="true"></chart>
					<div class="info" size="2">
						<p>
							<i class="fa fa-circle-o" :style="{color:问题解决率_pieOption.color[0]}"/>&ensp;
							<span class="ps">已解决</span>
							{{(问题解决率_pieOption.series[0].data[0].value/((问题解决率_pieOption.series[0].data[1].value+问题解决率_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%
						</p>
						<p>
							<i class="fa fa-circle-o" :style="{color:问题解决率_pieOption.color[1]}"/>&ensp;
							<span class="ps">未解决</span>
							{{(问题解决率_pieOption.series[0].data[1].value/((问题解决率_pieOption.series[0].data[1].value+问题解决率_pieOption.series[0].data[0].value)||1)*100).toFixed(0)}}%
						</p>
					</div>
				</div>
			</div>
			<div class="col-md-4 col-sm-6">
				<h4 class="box_title noBorder marginTop	">满意度</h4>
				<div class="small_canvas part noMarginTop">
					<chart :options="满意度_pieOption" :auto-resize="true" ></chart>
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
		<div class=" clearfix">
			<div class=" col-xs-12">
				<div class="part">
					<h4 class="box_title noBorder">考勤信息&nbsp;<word-explain keys="工作报表-客服-工作量详情-考勤信息"></word-explain></h4>
					<div class="table_wrap">
						<table class="table3">
							<thead>
								<tr>
									<th>日期</th>
									<th>登录时长</th>
									<th>在线时长</th>
									<th>在线时长占比</th>
									<th>首次上线时间</th>
									<th>最后离线时间</th>
									<th>首次登录时间</th>
									<th>最后注销时间</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in 考勤信息">
									<td>{{$api.dateFormat('yyyy-MM-dd',item.created)}}</td>
									<td>{{$api.MillisecondToDate(item.登陆总时长*1000)}}</td>
									<td>{{$api.MillisecondToDate(item.在线总时长*1000)}}</td>
									<td>{{(item.在线总时长/(item.登陆总时长||1)).toFixed(2)}}</td>
									<td>{{item.首次上线时间?item.首次上线时间:'--'}}</td>
									<td>{{item.最后离线时间?item.最后离线时间:'--'}}</td>
									<td>{{item.首次登录时间?item.首次登录时间:'--'}}</td>
									<td>{{item.最后注销时间?item.最后注销时间:'--'}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			
		</div>
		<br />
	</div>
</template>

<script>
	import ECharts from '../../module/ECharts.vue'
	import echarts from 'echarts'
	import 图表 from '../../mixin/图表.js'
	export default{
		mixins:[图表],
		props:['time_frame'],
		data(){
			return {
				params:{
					info:{},
					historys:[],
				},
				oneData:{
					接入会话量:0,
					转接量:0,
					回复率:0,
					总消息量:0,
					答问比:0,
					应答率30s:0,
					平均会话时长:0,
					平均首次响应时长:0,
					平均响应时长:0,
					主动会话量:0,
					留言处理量:0,
					无效会话量:0,
					满意度:0,
					参评率:0,
					一次性解决率:0,
				},
				考勤信息:[],
				
				已接入会话量_option:{},
				消息量_option:{},
			
				首次响应时间_barOption:{},
		       	响应时间_barOption:{},
		       	会话时长_barOption:{},
				满意度_pieOption:{},
				问题解决率_pieOption:{	},
		       	考勤信息:[],
			}
		},
		created(){      
			this.init图配置();
			this.searchs();
			if(this.$route.params.info){
				this.params.info = this.$route.params.info;
			}
		},
		methods:{
			init图配置(){
				let v= this;
				let legend1 = ['已回复会话量','未回复会话量','已接入会话量'];
				let rgbs1 = [window.color.yellow.rgb,window.color.blue.rgb,window.color.green.rgb];
				v.已接入会话量_option = v.fn_mixin获取折线和柱状图配置(legend1,rgbs1);
				v.已接入会话量_option.color = [window.color.yellow.str,window.color.blue.str,window.color.green.str];
				let legend2 = ['客服发出消息','访客发出消息','总消息数'];
				let rgbs2 = [window.color.yellow.rgb,window.color.blue.rgb,window.color.red.rgb];
				v.消息量_option = v.fn_mixin获取折线和柱状图配置(legend2,rgbs2);
				v.消息量_option.color = [window.color.yellow.str,window.color.blue.str,window.color.red.str];
				
				let ydata1 = ['<15s','15s-30s', '30s-45s', '45s-1m','>1m'];
				let ydata2 = ['0%','0%', '0%', '0%','0%'];
				let sdata1 = [100,100,100,100,100];
				let sdata2 = [0,0,0,0,0];
				v.首次响应时间_barOption = v.fn_mixin获取双向柱状图配置(ydata1,ydata2,sdata1,sdata2);
				v.响应时间_barOption = v.fn_mixin获取双向柱状图配置(ydata1,ydata2,sdata1,sdata2);
				let ydata3 = ['<2m','2m-4m', '4m-6m', '6m-8m','>8m'];
				v.会话时长_barOption = v.fn_mixin获取双向柱状图配置(ydata3,ydata2,sdata1,sdata2);
				v.问题解决率_pieOption = v.fn_mixin获取空心饼状图配置(['解决','未解决'],0);
				v.问题解决率_pieOption.color=['#8bd5f8','#d6e4eb'];
				v.满意度_pieOption = v.fn_mixin获取空心饼状图配置(['满意','不满意'/*,'未评价'*/],0);
				v.满意度_pieOption.color=['#8bd5f8','#d6e4eb','#d0d0d0'];
			},
			searchs(){
				let v = this;  
				let search = {
					id:this.$route.query.id,
					start:v.$api.dateFormat('yyyy-MM-dd',this.time_frame[0]),
					end:v.$api.dateFormat('yyyy-MM-dd',this.time_frame[1]),
				}
				v.$api.ajax(v.$uri.客服报表数据.工作量列表,'get',search)
				.then(result=>{
					this.清除数据痕迹();
					v.params.info.姓名 = result.result[search.id].姓名;
					let data = result.result[search.id].统计数据;                                          
					v.考勤信息 =  search.start==search.end?(v.$api.isEmptyObj(result.考勤)?[]:[result.考勤]):v.$api.deepCopy(data);
					//排序    
					for(let i=0;i<data.length;i++){
						for(let j=i+1;j<data.length;j++){
							if(new Date(data[i].created).getTime()>new Date(data[j].created).getTime()){
								let a = data[i];
								data[i] = data[j];
								data[j] = a;
							}
						}
					}   console.log(data)
					let date_format = search.start==search.end?'hh:00':'yyyy-MM-dd';
					let days = search.start==search.end?1:(data.length||1);                       
					let hours = data.length||1; 													console.log('days'+days,'hours'+hours)
					let 首次响应时长=0,响应时长=0,首次响应个数=0,响应个数=0,会话个数=0,总会话时长=0,总会话量=0,问题数=0,回答数=0,回复会话量=0;
					let 会话时长=[0,0,0,0,0],首次响应时间=[0,0,0,0,0],响应时间=[0,0,0,0,0];
					data.forEach(val=>{
						while(typeof val == 'string'){
							try{
								val=JSON.parse(val)
							}catch(e){
								break;
							}
						} 
						if(typeof val.满意统计 == 'string') 
							val.满意统计 = JSON.parse(val.满意统计);
						if(typeof val.首次响应时间 == 'string') 
							val.首次响应时间 = JSON.parse(val.首次响应时间);
						if(typeof val.响应时间 == 'string') 
							val.响应时间 = JSON.parse(val.响应时间);
						if(typeof val.会话时长 == 'string') 
							val.会话时长 = JSON.parse(val.会话时长);
						

						v.oneData.接入会话量 += val.会话量-val.无效会话量;
						v.oneData.转接量 += val.转接会话量||0;
						回复会话量 += val.会话量-val.未回复会话量-val.无效会话量;
						v.oneData.无效会话量 += val.无效会话量;
						v.oneData.留言处理量 += val.留言处理量||0;
						v.oneData.一次性解决率 += val.一次性解决率*100;
						v.oneData.总消息量 += val.客户问题数+val.客服答案数;
						问题数 +=val.客户问题数;
						回答数+=val.客服答案数;
						
						val.created = search.start==search.end?new Date(val.created).getTime():new Date(val.created).getTime()-24*3600*1000;
						let time = v.$api.dateFormat(date_format,val.created+180*1000);
						if(time ==='00:00') time = '24:00';
						let index = v.已接入会话量_option.xAxis.data.indexOf(time);
						if(index!=-1){
							v.已接入会话量_option.series[0].data[index]=val.会话量-val.未回复会话量-val.无效会话量;
							v.已接入会话量_option.series[1].data[index]=val.未回复会话量;
							v.已接入会话量_option.series[2].data[index]= val.会话量-val.无效会话量;                                //!
							v.消息量_option.series[0].data[index]=val.客服答案数;
							v.消息量_option.series[1].data[index]=val.客户问题数;
							v.消息量_option.series[2].data[index]=val.客户问题数+val.客服答案数;
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
								会话个数 +=  val.会话时长[times2[i]];
								i++;
							}
							总会话时长 += val.会话时长.all;
						}
					
						if(val.解决方式 && !v.$api.isEmptyObj(val.解决方式)){
							v.问题解决率_pieOption.series[0].data[0].value += val.解决方式.robot;
							v.问题解决率_pieOption.series[0].data[1].value += val.解决方式.human;
						}
						
						if(val.满意统计 && !v.$api.isEmptyObj(val.满意统计)){                   
							v.满意度_pieOption.series[0].data[0].value += val.满意统计.满意;
							v.满意度_pieOption.series[0].data[1].value += val.满意统计.不满意;
						/*	v.满意度_pieOption.series[0].data[2].value += val.满意统计.未评价;*/
							总会话量 += val.满意统计.满意+val.满意统计.不满意+val.满意统计.未评价;
						}
						
					});  
					v.oneData.回复率 =( 回复会话量/(总会话量||1)*100).toFixed(2);
					v.oneData.平均首次响应时长 = (首次响应时长/(首次响应个数||1)*1000).toFixed(0);
					v.oneData.平均响应时长 = (响应时长/(响应个数||1)*1000).toFixed(0);  
					v.oneData.平均会话时长 = (总会话时长/(总会话量||1)*1000).toFixed(0);
					v.oneData.应答率30s = ((v.响应时间_barOption.series[0].data[4]+ v.响应时间_barOption.series[0].data[3])/((v.响应时间_barOption.series[0].data[4]+ v.响应时间_barOption.series[0].data[3]+v.响应时间_barOption.series[0].data[2]+ v.响应时间_barOption.series[0].data[1]+v.响应时间_barOption.series[0].data[0])||1)*100).toFixed(2);
					v.oneData.答问比 = (回答数/(问题数||1)*100).toFixed(2);
					v.oneData.满意度 = (v.满意度_pieOption.series[0].data[0].value/((v.满意度_pieOption.series[0].data[0].value+v.满意度_pieOption.series[0].data[1].value)||1)*100).toFixed(2);
					v.oneData.参评率 = ((v.满意度_pieOption.series[0].data[0].value+v.满意度_pieOption.series[0].data[1].value)/(总会话量||1)*100).toFixed(2);
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
						v.会话时长_barOption.series[1].data[i] =!会话时长[i]?0:(会话时长[i]/(会话个数||1)*100).toFixed(0);
						v.会话时长_barOption.yAxis[1].data[i] = v.会话时长_barOption.series[1].data[i]+'%';
						
						/*v.首次响应时间_barOption.series[1].data[i] = v.首次响应时间_barOption.series[1].data[i]==0?0:(v.首次响应时间_barOption.series[1].data[i]/(首次响应个数||1)*100).toFixed(0);
						v.首次响应时间_barOption.yAxis[1].data[i] = v.首次响应时间_barOption.series[1].data[i]+'%';
						v.响应时间_barOption.series[1].data[i] =v.响应时间_barOption.series[1].data[i]==0?0:(v.响应时间_barOption.series[1].data[i]/(响应个数||1)*100).toFixed(0);
						v.会话时长_barOption.series[1].data[i] =v.会话时长_barOption.series[1].data[i]==0?0:(v.会话时长_barOption.series[1].data[i]/(会话个数||1)*100).toFixed(0);
						v.响应时间_barOption.yAxis[1].data[i] = v.响应时间_barOption.series[1].data[i]+'%';
						v.会话时长_barOption.yAxis[1].data[i] = v.会话时长_barOption.series[1].data[i]+'%';*/
					}
				})
			},
			
			清除数据痕迹(){
				let v = this;
				v.oneData.接入会话量=0;
				v.oneData.转接量=0;
				v.oneData.回复率=0;
				v.oneData.总消息量=0;
				v.oneData.答问比=0;
				v.oneData.应答率30s=0;
				v.oneData.平均会话时长=0;
				v.oneData.平均首次响应时长=0;
				v.oneData.平均响应时长=0;
				v.oneData.主动会话量=0;
				v.oneData.留言处理量=0;
				v.oneData.无效会话量=0;
				v.oneData.满意度=0;
				v.oneData.参评率=0;
				v.oneData.一次性解决率=0;
				let 图标1 = ['已接入会话量_option','消息量_option'];
				let 图标2 = ['首次响应时间_barOption','响应时间_barOption','会话时长_barOption'];
				let 图标3 = ['问题解决率_pieOption','满意度_pieOption'];
				let time = {start:v.time_frame[0],end:v.time_frame[1]};   
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
				v.考勤信息 = [];
			}
		},
		components:{
			'chart':ECharts,
		},
		watch:{
			'time_frame':{
				handler(n){
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
	.report.workload_detail{
		.crumbs {padding:10px 0;}
		.box_info {
			.rate{
				
				p{display:inline-block; text-align:left; line-height: 22px;}
			}
		}
	}
	
	
</style>