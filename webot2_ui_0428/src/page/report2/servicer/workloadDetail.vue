<template>
  <div class="report">
    <h1 class="page_title noBorder">
      客服
      <button class="my-btn my-btn-info-o pull-right font14 marg_l_10"
              @click="download()"
      ><i class="fa fa-sign-out"></i>导出报表</button>
      <my-date-picker class="pull-right search_time" v-model="time_frame" :max-time="Date.now()-24*3600*1000" option-index="1" type="daterange"></my-date-picker>
    </h1>
    <el-breadcrumb class="paths">
      <el-breadcrumb-item v-for="(p,i) in paths.filter(val=>val.name!=='')" :to="{ path: p.path }">{{p.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="page_title noBorder">
      会话量&nbsp;<word-explain keys="工作报表-客服-工作量详情-会话量"></word-explain>
    </h1>
    <div class="clearfix data-screening">
        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.会话量.接入会话量}}</div>
              <div class="message">接入会话量</div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.会话量.已回复会话量}}</div>
              <div class="message">已回复会话量</div>
            </div>
            <div class="percentage">回复率：{{ (allData.会话量.回复率*100).toAccuracy(2)}}%</div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.会话量.未回复会话量}}</div>
              <div class="message">未回复会话量</div>
            </div>
            <div class="percentage">未回复率：{{ (allData.会话量.未回复率*100).toAccuracy(2)}}%</div>
          </div>
        </div>
    </div>

    <div>
      <div class="clearfix part margin_bottom_px">
        <div class="col-xs-12">
          <div  class="">
            <div class="large_canvas" >
              <chart :options="会话量_option" :auto-resize="true"></chart>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="clearfix data-screening">

      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">{{ allData.会话量.转接量}}</div>
            <div class="message">转接量</div>
          </div>
          <div class="percentage">转接率：{{ (allData.会话量.转接率*100).toAccuracy(2)}}%</div>
        </div>
      </div>


      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">{{ allData.会话量.无效会话量}}</div>
            <div class="message">无效会话量</div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="top3_box_content top3_box_content_rw">
          <div class="inner_content ">
            <div class="strong">{{ allData.会话量.主动会话量}}</div>
            <div class="message">主动会话量</div>
          </div>
        </div>
      </div>
      <!--<div class="col-md-6 col-lg-3">-->
        <!--<div class="top3_box_content top3_box_content_rw">-->
          <!--<div class="inner_content ">-->
            <!--<div class="strong">{{ allData.会话量.留言处理量}}</div>-->
            <!--<div class="message">留言处理量</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    </div>



    <h1 class="page_title_rewrite no_underLine_tittle ">
      消息量&nbsp;<word-explain keys="工作报表-客服-工作量详情-消息量"></word-explain>
    </h1>
      <!--悬浮框-->
      <div class="data-screening clearfix">
        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{ allData.消息量.总消息量}}</div>
              <div class="message">总消息量</div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{ allData.消息量.客服消息量}}</div>
              <div class="message">客服消息量</div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{ allData.消息量.访客消息量}}</div>
              <div class="message">访客消息量</div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{ (allData.消息量.答问比*100).toAccuracy(2)}}%</div>
              <div class="message">答问比</div>
            </div>
          </div>
        </div>

      </div>
    <div>
      <div class="clearfix part">
        <div class="col-xs-12">
          <div class="">
            <div class="large_canvas">
              <chart :options="消息量_option" :auto-resize="true"></chart>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>&nbsp;</div>
    <h1 class="page_title noBorder">
      服务时长&nbsp;<word-explain keys="工作报表-客服-工作量详情-服务时长"></word-explain>
    </h1>
    <div class="clearfix">
      <!--悬浮框-->
      <div class="data-screening">
        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content top3_box_content_rw">
            <div class="inner_content ">
              <div class="strong">{{ $api.MillisecondToDate(allData.服务时长.平均接待时长*1000) }}</div>
              <div class="message">平均接待时长</div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content top3_box_content_rw">
            <div class="inner_content ">
              <div class="strong">{{ $api.MillisecondToDate(allData.服务时长 .平均首次响应时长*1000)}}</div>
              <div class="message">平均首次响应时长</div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content top3_box_content_rw">
            <div class="inner_content ">
              <div class="strong">{{ $api.MillisecondToDate(allData.服务时长 .平均响应时长*1000)}}</div>
              <div class="message">平均响应时长</div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="clearfix">
      <div class="col-md-4 col-sm-6 padding_px">
        <h4 class="box_title_rw noBorder marginTop">接待时长
        </h4>
        <div class="small_canvas part small_part noMarginTop">
          <chart :options="接待时长_barOption" :auto-resize="true"></chart>
        </div>
      </div>
      <div class="col-md-4 col-sm-6 ">
        <h4 class="box_title_rw noBorder marginTop">首次响应时长
        </h4>
        <div class="small_canvas part small_part noMarginTop">
          <chart :options="首次响应时长_barOption" :auto-resize="true"></chart>
        </div>
      </div>

      <div class="col-md-4 col-sm-6 ">
        <h4 class="box_title_rw noBorder marginTop">响应时长
        </h4>
        <div class="small_canvas part small_part noMarginTop">
          <chart :options="响应时长_barOption" :auto-resize="true"></chart>
        </div>
      </div>
    </div>



    <div class="clearfix">
      <div class="col-md-6 col-lg-4  padding_px" style="min-width: 450px">
        <h4 class="box_title_rw noBorder marginTop">问题解决率
        </h4>
        <div class=" part small_part noMarginTop small_canvas small_canvas_rw">
          <chart :options="问题解决率_pieOption" :auto-resize="true"></chart>
          <div class="info" size="2">
          	<table>
          		<tr>
                <td><i class="pull-left small-round_rw rColor5" />&nbsp;</td>
                <td>已解决&ensp;</td>
          			<td class="text-right">{{问题解决率_pieOption.series[0].data[0].value}} &nbsp;</td>
          			<td class="text-right ps">({{(allData.问题解决率.已解决率*100).toAccuracy(2)}}%)</td>
          		</tr>
          		<tr>
                <td><i class="pull-left small-round_rw rColor6" />&nbsp;</td>
          			<td>未解决&ensp;</td>
          			<td class="text-right">{{问题解决率_pieOption.series[0].data[1].value}} &nbsp;</td>
          			<td class="text-right ps">({{(allData.问题解决率.未解决率*100).toAccuracy(2)}}%)</td>
          		</tr>
          	</table>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4" style="min-width: 450px">
        <h4 class="box_title_rw noBorder marginTop">满意度
        </h4>
        <div class=" part small_part noMarginTop small_canvas small_canvas_rw">
          <chart :options="满意度_pieOption" :auto-resize="true"></chart>
          <div class="info" size="2">
            <table style="
    position: relative;top: -70%;">
              <tr v-if="allData.满意度.非常满意||allData.满意度.非常不满意">
                <td><i class="pull-left small-round_rw rColor0" />&nbsp;</td>
                <td>非常满意&ensp;</td>
                <td>{{ allData.满意度.非常满意 }}&emsp;</td>
                <td class="text-right ps">({{((allData.满意度.非常满意占比 || 0)*100).toAccuracy(2)}}%)</td>
              </tr>
              <tr>
                <td><i class="pull-left small-round_rw rColor1" />&nbsp;</td>
                <td>满意&ensp;</td>
                <td>{{ allData.满意度.满意 }}&emsp;</td>
                <td class="text-right ps">({{((allData.满意度.满意占比 || 0)*100).toAccuracy(2)}}%)</td>
              </tr>
              <tr v-if="allData.满意度.一般||allData.满意度.非常满意||allData.满意度.非常不满意">
                <td><i class="pull-left small-round_rw rColor2" />&nbsp;</td>
                <td>一般&ensp;</td>
                <td>{{ allData.满意度.一般 }}&emsp;</td>
                <td class="text-right ps">({{((allData.满意度.一般占比 || 0)*100).toAccuracy(2)}}%)</td>
              </tr>
              <tr>
                <td><i class="pull-left small-round_rw rColor3" />&nbsp;</td>
                <td>不满意&ensp;</td>
                <td>{{ allData.满意度.不满意 }}&emsp;</td>
                <td class="text-right ps">({{((allData.满意度.不满意占比 || 0)*100).toAccuracy(2)}}%)</td>
              </tr>
              <tr v-if="allData.满意度.非常满意||allData.满意度.非常不满意">
                <td><i class="pull-left small-round_rw rColor4" :style="{color:满意度_pieOption.color[1]}"/>&nbsp;</td>
                <td>非常不满意&ensp;</td>
                <td>{{ allData.满意度.非常不满意 }}&emsp;</td>
                <td class="text-right ps">({{((allData.满意度.非常不满意占比 || 0)*100).toAccuracy(2)}}%)</td>
              </tr>
              <tr>
                <td></td>
                <td>参评率&ensp;</td>
                <td></td>
                <td class="text-right ps">({{(allData.满意度.参评率*100).toAccuracy(2)}}%)</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div>&nbsp;</div>



    <h2 class="page_title noBorder">考勤信息&nbsp;<word-explain keys="工作报表-客服-工作量详情-考勤信息"></word-explain>
    </h2>
    <div class=" kf_table clearfix col-sm-12 padding_px">

      <div class="table_wrap part_rw" >
        <!--style="padding:10px;"-->
        <table class="table3">
          <thead>
          <tr class="table3_head_rw">
            <th>姓名 </th>
            <th>日期</th>
            <th>登录总时长</th>
            <th>在线总时长</th>
            <th>在线时长比</th>
            <th>首次上线时间</th>
            <th>最后离线时间</th>
            <th>首次登录时间
            </th>
            <th>最后注销时间</th>
          </tr>
          </thead>
          <tbody>

          <tr v-for="kf in kfs" >
            <td>
              <img src="../../../assets/img/user2_icon.png" height="15" width="13"/>
              {{kf.id ? (kfs_info[kf.id] ? kfs_info[kf.id].username:'--') : kf.姓名}}</td>
            <td>{{$api.dateFormat('yyyy-MM-dd', kf.日期)}}</td>
            <td>{{ $api.MillisecondToDate(kf.登录总时长*1000)|| '--'}}</td>
            <td>{{ $api.MillisecondToDate(kf.在线总时长*1000) || '--'}}</td>
            <td>{{ kf.在线时长比=='--'? '--':(kf.在线时长比*100).toAccuracy(2)+'%'  }}</td>
            <td>{{kf.首次上线时间 || '--'}}</td>
            <td>{{kf.最后离线时间 || '--'}}</td>
            <td>{{kf.首次登录时间 || '--'}}</td>
            <td>{{kf.最后注销时间 || '--'}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      &nbsp;
    </div>
  </div>
</template>

<script>
  import ECharts from '../../module/ECharts.vue'
  import echarts from 'echarts'
  import 图表 from '../../mixin/图表.js'
  export default {
    mixins: [图表],
    data() {
      return {
        time_frame: [new Date().getTime() - 7 * 24 * 3600 * 1000, new Date().getTime() - 24 * 3600 * 1000],
        search: {
          cid: 1,
          user_id:'',
        },

        allData:{
          会话量:{
            接入会话量:0,
            已回复会话量:0,
            回复率:0,
            未回复会话量:0,
            未回复率:0,
            转接量:0,
            转接率:0,
            主动会话量:0,
            留言处理量:0,
            无效会话量:0,
          },
          消息量:{
            总消息量:0,
            客服消息量:0,
            访客消息量:0,
            答问比:0,
          },
          服务时长:{
            平均接待时长:0,
            平均首次响应时长:0,
            平均响应时长:0,
          },
          问题解决率:{
            已解决率:0,
            未解决率:0,
          },
          满意度:{
            满意占比:0,
            不满意占比:0,
            参评率:0,
          },



        },
        kfs:[],
        kfs_info:'',
       /* 机器人服务数据_option01: {
          color: ['#80B8F3',
            '#B0E69A', '#F39363'],
          grid: {
            left: 30
          },
          smooth: true,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: ['接入会话量', '已回复会话量', '未回复会话量'],
            top: 'bottom'
          },
          calculable: true,
          xAxis: {
            axisLine: {
              lineStyle: {
                color: '#91A2AB'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            type: 'category',
            data: []
          },
          yAxis: {
            axisLine: {
              lineStyle: {
                color: '#91A2AB'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            type: 'value',
          },
          series: [
            {
              name: '接入会话量',
              type: 'bar',
              smooth: true,
              // color: '#fff',
              data: [],
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#FDA8A8'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              },
            },
            {
              name: '已回复会话量',
              type: 'bar',
              smooth: true,
              data: [],
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#FEC87D'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              }
            },
            {
              name: '未回复会话量',
              type: 'bar',
              smooth: true,
              data: [],
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#FEC87D'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              }
            },
          ]
        },*/
        /*客服服务数据_option02: {
          color: ['#80B8F3',
            '#B0E69A', '#F39363'],
          grid: {
            left: 30
          },
          smooth: true,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: ['总消息量', '客服消息量','访客消息量','答问比'],
            top: 'bottom'
          },
          calculable: true,
          xAxis: {
            axisLine: {
              lineStyle: {
                color: '#91A2AB'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            type: 'category',
            data: []
          },
          yAxis: {
            axisLine: {
              lineStyle: {
                color: '#91A2AB'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            type: 'value',
          },
          series: [
            {
              name: '总消息量',
              type: 'bar',
              smooth: true,
              // color: '#fff',
              data: [],
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#FDA8A8'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              },
            },
            {
              name: '客服消息量',
              type: 'bar',
              smooth: true,
              data: [],
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#FEC87D'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              }
            },
            {
              name: '访客消息量',
              type: 'bar',
              smooth: true,
              data: [],
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#FEC87D'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              }
            },
            {
              name: '答问比',
              type: 'bar',
              smooth: true,
              data: [],
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: '#FEC87D'},
                      {offset: 1, color: '#fff'}
                    ]
                  )
                }
              }
            },
          ]
        },*/
        /*问题解决率_pieOption:
          {
            tooltip: {
              trigger: 'item',
              formatter: "{b} : {c} ({d}%)"
            },
            legend: {
              show: false,
              // data: legend_data,
              formatter: function (a) {
                return a
              },
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                center: ['40%', '50%'],
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: false,
                    textStyle: {
                      fontSize: '16',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {
                    value: 0,
                    name: '已解决'
                  },
                  {
                    value: 0,
                    name: '未解决'
                  }
                ],
                itemStyle: {
                  emphasis: {
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },

              }
            ]
          },
        满意度02_pieOption:
          {
            tooltip: {
              trigger: 'item',
              formatter: "{b} : {c} ({d}%)"
            },
            legend: {
              show: false,
              // data: legend_data,
              formatter: function (a) {
                return a
              },
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                center: ['40%', '50%'],
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: false,
                    textStyle: {
                      fontSize: '16',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {
                    value: 0,
                    name: '满意'
                  },
                  {
                    value: 0,
                    name: '不满意'
                  }
                ],
                itemStyle: {
                  emphasis: {
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },

              }
            ]
          },*/
        会话量_option: {},
        消息量_option: {},
        首次响应时长_barOption: {},
        响应时长_barOption: {},
        接待时长_barOption: {},
        满意度_pieOption: {},
        问题解决率_pieOption: {},
      }
    },
    created() {
      this.search.user_id = this.$router.history.current.query.id;
      this.$source.kfs().then(data=>{
        this.kfs_info = data;
      })
      this.init图配置();
      this.searchs();
    },
    computed:{
      paths(){
        let user_info = this.kfs_info[this.search.user_id],
          paths = JSON.parse(sessionStorage.historys).slice(-2,-1);
        paths.push({name: user_info ? user_info.username : ''});
        return paths;
      }
    },
    methods: {
      download(){



        let v =this;
        // start: v.time_frame[0], end: v.time_frame[1]
        // /api/statistic/export/kf_service_work_load?cid=1&start=2018-03-01&end=2018-03-03
        var url = '/api/statistic/export/customer_details?cid=1&'

        v.time_frame[0] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[0])
        v.time_frame[1] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[1])
        url = url + 'start='+ v.time_frame[0] + '&'+'end='+ v.time_frame[1]+ '&'+'user_id='+v.$router.history.current.query.id

        v.$api.downloadFromService('',url)
        // window.open(url)

      },
      init图配置() {
        let v = this;
        let options = {
        	legend: ['接入会话量', '已回复会话量', '未回复会话量'],
        	series_names :  ['接入会话量', '已回复会话量', '回复率', '未回复会话量', '未回复率'],
        	colors: ['#58D676', '#7ee2e3', 'none', '#d4e8e9', 'none'],
        	series_types: ['line' , 'bar', 'custom', 'bar', 'custom'],
        };
        v.会话量_option = v.fn_mixin获取折线和柱状图配置(options);
        let options2 = {
        	legend: ['总消息量', '客服消息量','访客消息量'],
        	series_names : ['总消息量', '客服消息量','访客消息量','答问比'],
        	colors: ['#E0D686', '#ffa5a5', '#ffae21', 'none'],
        	series_types: ['line' , 'bar', 'bar', 'custom'],
        };
        v.消息量_option = v.fn_mixin获取折线和柱状图配置(options2);
        let ydata1 = ['<15s', '15s-30s', '30s-45s', '45s-1m', '>1m'];
        let ydata2 = ['0%', '0%', '0%', '0%', '0%'];
        let ydata3 = ['<2m', '2m-4m', '4m-6m', '6m-8m', '>8m'];
        let sdata1 = [100, 100, 100, 100, 100];
        let sdata2 = [0, 0, 0, 0, 0];
        v.首次响应时长_barOption = v.fn_mixin获取双向柱状图配置(ydata1, ydata2, sdata1, sdata2);
        v.响应时长_barOption = v.fn_mixin获取双向柱状图配置(ydata1, ydata2, sdata1, sdata2);
        v.接待时长_barOption = v.fn_mixin获取双向柱状图配置(ydata3, ydata2, sdata1, sdata2);


        v.问题解决率_pieOption = v.fn_mixin获取空心饼状图配置(['已解决', '未解决'], 0);
        v.问题解决率_pieOption.color = [
          '#76d2b7'
          , '#d6e4eb'];
        v.满意度_pieOption =
          v.fn_mixin获取空心饼状图配置02([], 0)
      },
      searchs() {
        var v = this;
        let start = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[0]);
        let end = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[1]);
        v.search.start = start;
        v.search.end = end;

        v.$api.ajax('/statistic/kf_service_work_load', 'get', v.search)
          .then(data => {
            v.allData = data;
            v.kfs=v.allData.考勤信息;
						v.清除数据痕迹();
						//


						//将列表改为对象
						let 消息量 = {},
							会话量 = {};
						let format = new Date(v.time_frame[0]).setHours(0,0,0,0)==new Date(v.time_frame[1]).setHours(0,0,0,0) ? 'hh:00' : 'yyyy-MM-dd';

						data.会话量.趋势.forEach(val=>{
							let time  = v.$api.dateFormat(format,(new Date(val.时间).getTime()+300*1000));
							time = time == '00:00'?'24:00':time;
							会话量[time] = val;
						});
						data.消息量.趋势.forEach(val=>{
							let time  = v.$api.dateFormat(format,(new Date(val.时间).getTime()+300*1000));
							time = time == '00:00'?'24:00':time;
							消息量[time] = val;
						});
						//填充数据
						v.会话量_option.xAxis.data.forEach((val,i)=>{
							if(!会话量[val]){
								return false;
							}
							v.会话量_option.series[0].data[i]= 会话量[val].接入会话量;
							v.会话量_option.series[1].data[i]= 会话量[val].已回复会话量;
							v.会话量_option.series[2].data[i]= (会话量[val].回复率*100).toAccuracy(2)+'%';;
							v.会话量_option.series[3].data[i]= 会话量[val].未回复会话量;
							v.会话量_option.series[4].data[i]= (会话量[val].未回复率*100).toAccuracy(2)+'%';;
						});
						v.消息量_option.xAxis.data.forEach((val,i)=>{
							if(!消息量[val]){
								return false;
							}
							v.消息量_option.series[0].data[i] = 消息量[val].总消息量;
							v.消息量_option.series[1].data[i] = 消息量[val].客服消息量;
							v.消息量_option.series[2].data[i] = 消息量[val].访客消息量;
							v.消息量_option.series[3].data[i] = (消息量[val].答问比 *100).toAccuracy(2)+'%';;
						});
						//将列表改为对象2
						let 接待时长 = Object.assign(...data.服务时长.接待时长),
								响应时长 = Object.assign(...data.服务时长.响应时长),
								首次响应时长 = Object.assign(...data.服务时长.首次响应时长);
						//填充数据
						v.接待时长_barOption.yAxis[0].data.forEach((val,i)=>{
								let percent =  (接待时长[val]*100).toAccuracy(2);
								v.接待时长_barOption.series[1].data[i] = percent;
								v.接待时长_barOption.yAxis[1].data[i] = percent +'%';
						});
						v.响应时长_barOption.yAxis[0].data.forEach((val,i)=>{
								let percent =  (响应时长[val]*100).toAccuracy(2);
								v.响应时长_barOption.series[1].data[i] = percent;
								v.响应时长_barOption.yAxis[1].data[i] = percent +'%';
						});
						v.首次响应时长_barOption.yAxis[0].data.forEach((val,i)=>{
								let percent =  (首次响应时长[val]*100).toAccuracy(2);
								v.首次响应时长_barOption.series[1].data[i] = percent;
								v.首次响应时长_barOption.yAxis[1].data[i] = percent +'%';
						});
						//填充数据
						v.问题解决率_pieOption.series[0].data[0].value=data.问题解决率.已解决;
            v.问题解决率_pieOption.series[0].data[1].value=data.问题解决率.未解决;





            //造数据
            // data.满意度.非常满意=1
            // data.满意度.满意=0
            // data.满意度.一般=0
            // data.满意度.不满意=0
            // data.满意度.非常不满意=0

            v.满意度_pieOption.color = []
            v.满意度_pieOption.series[0].data =[]

            if(!data.满意度.非常满意&&!data.满意度.一般&&!data.满意度.非常不满意){

              v.满意度_pieOption.series[0].data.push(
                {name:'满意',value:data.满意度.满意}
              )
              v.满意度_pieOption.series[0].data.push(
                {name:'不满意',value:data.满意度.不满意}
              )

              v.满意度_pieOption.color = [
                '#69aefa',
                '#f5d9a3',
              ]

            }


            if(data.满意度.非常满意||data.满意度.非常不满意){

              v.满意度_pieOption.series[0].data.push(
                {name:'满意',value:data.满意度.满意}
              )
              v.满意度_pieOption.series[0].data.push(
                {name:'不满意',value:data.满意度.不满意}
              )

              v.满意度_pieOption.series[0].data.splice(0,0,{name:'非常满意',value:data.满意度.非常满意})
              v.满意度_pieOption.series[0].data.splice(2,0,{name:'一般',value:data.满意度.一般})
              v.满意度_pieOption.series[0].data.splice(4,0,{name:'非常不满意',value:data.满意度.非常不满意})

              v.满意度_pieOption.color = [
                '#9ae246',
                '#69aefa',
                '#d2d4e8',
                '#f5d9a3',
                '#e18d8d',
              ]

            }

            if (!data.满意度.非常满意&&!data.满意度.非常不满意&&data.满意度.一般){

              v.满意度_pieOption.series[0].data.push(
                {name:'满意',value:data.满意度.满意}
              )
              v.满意度_pieOption.series[0].data.push(
                {name:'不满意',value:data.满意度.不满意}
              )
              v.满意度_pieOption.series[0].data.splice(1,0,{name:'一般',value:data.满意度.一般})
              v.满意度_pieOption.color = [
                '#69aefa',
                '#d2d4e8',
                '#f5d9a3',
              ]

            }




           /* v.问题解决率_pieOption.series[0].data[0].value=v.allData.问题解决率.已解决
            v.问题解决率_pieOption.series[0].data[1].value=v.allData.问题解决率.未解决
            v.满意度02_pieOption.series[0].data[0].value=v.allData.满意度.满意
            v.满意度02_pieOption.series[0].data[1].value=v.allData.满意度.不满意




            let hArr01=[],hArr02=[],hArr03=[]
            v.allData.会话量.趋势.forEach(item=>{
              hArr01.push(item.接入会话量)})
            v.allData.会话量.趋势.forEach(item=>{
              hArr02.push(item.已回复会话量)})
            v.allData.会话量.趋势.forEach(item=>{
              hArr03.push(item.未回复会话量)})

            v.机器人服务数据_option01.series[0].data=hArr01
            v.机器人服务数据_option01.series[1].data=hArr02
            v.机器人服务数据_option01.series[2].data=hArr03


            let xArr01=[],xArr02=[],xArr03=[],xArr04=[]
            v.allData.消息量.趋势.forEach(item=>{
              xArr01.push(item.总消息量)})
            v.allData.消息量.趋势.forEach(item=>{
              xArr02.push(item.客服消息量)})
            v.allData.消息量.趋势.forEach(item=>{
              xArr03.push(item.访客消息量)})
            v.allData.消息量.趋势.forEach(item=>{
              xArr04.push(item.答问比)})

            v.客服服务数据_option02.series[0].data=xArr01
            v.客服服务数据_option02.series[1].data=xArr02
            v.客服服务数据_option02.series[2].data=xArr03
            v.客服服务数据_option02.series[3].data=xArr04

            v.响应时长_barOption01 = new 构造双向柱状图()
            var temp_arr01 = []
            v.allData.服务时长.响应时长.forEach(item => {
              temp_arr01.push(Object.keys(item)[0])
            })
            temp_arr01.reverse()
            v.响应时长_barOption01.yAxis[0].data = temp_arr01
            //
            var temp_arr02 = []
            v.allData.服务时长.响应时长.forEach(item => {
              temp_arr02.push(Object.values(item)[0])
            })
            temp_arr02.reverse()
            v.响应时长_barOption01.series[1].data = temp_arr02.map(item => {
              return item * 100
            })
            v.响应时长_barOption01.yAxis[1].data = temp_arr02.map(item => {
              return item * 100 + '%'
            })



            v.接待时长_barOption01 = new 构造双向柱状图()

            var temp_arr03 = []
            v.allData.服务时长.会话时长.forEach(item => {
              temp_arr03.push(Object.keys(item)[0])
            })
            temp_arr03.reverse()
            v.接待时长_barOption01.yAxis[0].data = temp_arr03
            var temp_arr04 = []
            v.allData.服务时长.会话时长.forEach(item => {
              temp_arr04.push(Object.values(item)[0])
            })
            temp_arr04.reverse()
            v.接待时长_barOption01.series[1].data = temp_arr04.map(item => {
              return item * 100
            })
            v.接待时长_barOption01.yAxis[1].data = temp_arr04.map(item => {
              return item * 100 + '%'
            })


            v.首次响应时长_barOption02 = new 构造双向柱状图()
            var temp_arr05 = []
            v.allData.服务时长.首次响应时长.forEach(item => {
              temp_arr05.push(Object.keys(item)[0])
            })
            temp_arr05.reverse()
            v.首次响应时长_barOption02.yAxis[0].data = temp_arr05
            //
            var temp_arr06 = []
            v.allData.服务时长.首次响应时长.forEach(item => {
              temp_arr06.push(Object.values(item)[0])
            })
            temp_arr06.reverse()
            v.首次响应时长_barOption02.series[1].data = temp_arr06.map(item => {
              return item * 100
            })
            v.首次响应时长_barOption02.yAxis[1].data = temp_arr06.map(item => {
              return item * 100 + '%'
            })*/









          /*  function 构造双向柱状图() {
              this.grid = {
                left: 55,
                right: 40,
                top: 20,
                bottom: 20,
                backgroundColor: 'rgb(0,0,0)',
                borderColor: '#fff',
              }
              this.xAxis = {
                show: false,
                type: 'value',
                name: 'Days',
                max: 100,
                min: 0,
                axisLabel: {
                  formatter: '{value}'
                }
              },
                this.yAxis = [
                  {
                    type: 'category',
                    data: [''],
                    // '<15s','15s-30s','30s-45s','45s-1m','>1m'
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {color: window.color.图表字颜色,},
                  },
                  {
                    type: 'category',
                    data: [],
                    // '0%','0%','0%','0%','0%'
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {color: window.color.图表字颜色2,},
                  }
                ],
                this.series = [
                  {
                    name: 'background',
                    type: 'bar',
                    barWidth: 9,
                    yAxisIndex: 1,
                    silent: true,
                    itemStyle: {
                      normal: {
                        color: window.color.小柱状图bar背景,
                        barBorderRadius: 8,
                      },
                      emphasis: {color: window.color.小柱状图bar背景,}
                    },
                    barGap: '0',
                    barCategoryGap: '50%',
                    data: [100, 100, 100, 100, 100],
                    //固定不变
                  },
                  {
                    name: '',
                    type: 'bar',
                    barWidth: 8,
                    itemStyle: {
                      normal: {
                        show: true,
                        color: window.color.小柱状图bar颜色,
                        barBorderRadius: 8,
                      },
                    },
                    data: [],
                  }
                ]
            }*/
//
          });
      },
      清除数据痕迹() {
        let v = this;
        let 图标1 = ['会话量_option', '消息量_option'];
        let 图标2 = ['首次响应时长_barOption', '响应时长_barOption', '接待时长_barOption'];
        let 图标3 = [ '问题解决率_pieOption', '满意度_pieOption'];
        let time = {start: v.time_frame[0], end: v.time_frame[1]};
        图标1.forEach(val => {
          v.fn_mixin初始化折线和柱状图Bytime(v[val], time, 0);
        });
        图标2.forEach(val => {
          v[val].series[1].data = [];
          let i = 0;
          while (i <= 4) {
            v[val].series[1].data.push(0);
            i++;
          }
        });
        图标3.forEach(val => {
          v.fn_mixin初始化饼状图(v[val], 0);
        });
      }
    },
    watch: {
      'time_frame': {
        handler: function (n, o) {
          this.searchs();
        },
        deep: true,
      }
    },
    components: {
      'chart': ECharts,
    }
  }
</script>

<style lang="scss" scoped>
  #pandect_data {
    .box_info {
      .rate {
        p {
          display: inline-block;
          text-align: left;
          line-height: 22px;
        }
      }
    }
  }

  .page_title_rewrite {
    margin-top: 5px;
    font-size: 16px;;
    line-height: 28px;
    padding-top: 14px;
    padding-left: 10px;
    margin-bottom: 14px;
    color: #343f4b;
    font-weight: bold;
    position: relative;
    &:before {
      content: '';
      width: 4px;
      height: calc(100% - 14px);
      background: #0f86ff;
      position: absolute;
      left: 0;
      top: 14px;
    }
    &:after {
      content: '';
      width: 100%;
      /*height:1px;*/
      background: #e7f2f7;
      position: absolute;
      bottom: -10px;
      left: 0;
    }
    &.noBorder {
      &:after {
        height: 0px;
      }
    }
  }

  .top3_box_content {
    margin: 5px 20px 25px 0px;
    background: #E2EDF3;
    height: 160px;
    border-radius: 10px;
    /*box-shadow: 2px 2px 22px 1px #E2EDF3;*/
    /*display: flex;*/
    /*align-items:center;*/
    position: relative;
  }

  .top3_box_content_rw{
  margin: 5px 20px 10px 0px;;

  }

  .inner_content {
    margin: 0 auto;
    text-align: center;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .percentage {
    position: absolute;
    top: 80%;
    float: right;
    right: 5%;
    /*margin-right: 30px;*/
    color: #a3b0b7;
  }

  .strong {
    font-size: 36px; font-weight: 500;
  }

  .message {
    font-weight: 500;
    font-size: 14px;
  }

  .part{

  }

  .small_part{
    margin: 0px
  }

  /*.box_title_rw{*/
    /*background: #fff;*/
  /*}*/

  .box_title_rw {
    font-size: 16px;
    color: #343f4b;
    padding-left: 12px;
    font-weight: bold;
    height: 27px;
    line-height: 28px;
    margin-bottom: 10px;
    margin-top: 10px;
    position: relative;
  }

  .margin_bottom_px{
    margin-bottom: 15px;
  }

  .padding_px{
    padding-left: 0px;
  }

  .part_rw{
    padding-left: 0px;
    padding-right: 0px;
  }

  .table3_head_rw{
    border: 1px solid #d6e4eb;
  }

  .small_canvas_rw{
    height: 210px
  }

  .info_rw{
    top: -80px!important;
  }

  .small-round_rw{
    margin-top: 4px;
    margin-right: 5px;
    width: 14px;
    height: 14px;
    background-color: #fff;
    /*border: 3px #E88484 solid;*/
    border-radius: 50px;
  }

  .small-round {
    margin-top: 0px;
    margin-right: 23px;
    width: 14px;
    height: 14px;
    background-color: #fff;
    border: 3px #E88484 solid;
    border-radius: 50px;
  }

  .rColor0{
    border: 3px #9ae246 solid;
  }
  .rColor1{
    border: 3px #69aefa solid;
  }
  .rColor2{
    border: 3px #d2d4e8 solid;
  }
  .rColor3{
    border: 3px #f5d9a3 solid;
  }
  .rColor4{
      border: 3px #e18d8d solid;
    }
  .rColor5{
      border: 3px #76d2b7 solid;
    }
  .rColor6{
      border: 3px #d6e4eb solid;
    }

</style>
