<template>
  <div class="report">
    <h1 class="page_title">
    总览&nbsp;<word-explain keys="工作报表-总览"></word-explain>
    <button class="my-btn my-btn-info-o pull-right font14 marg_l_10"
    @click="download()"
    ><i class="fa fa-sign-out"></i>导出报表</button>

    <my-date-picker class="pull-right search_time" v-model="time_frame" :max-time="Date.now()-24*3600*1000" option-index="1" type="daterange"></my-date-picker>
    </h1>

    <!--click(function(){-->
    <!--var url = "https://codeload.github.com/douban/douban-client/legacy.zip/master";-->
    <!--window.open(url);-->
    <!--})-->

    <h1 class="page_title_rewrite no_underLine_tittle">
    机器人服务数据&nbsp;<word-explain keys="工作报表-总览-机器人服务数据"></word-explain>
    </h1>
    <div class="clearfix">
    <div class="data-screening">
    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">{{allData.机器人服务数据.机器人会话量||0}}</div>
    <div class="message">机器人会话量</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">{{allData.机器人服务数据.机器人解决量||0}}</div>
    <div class="message">机器人解决量</div>
    </div>
    <div class="percentage">机器人解决率：
    {{ (allData.机器人服务数据. 机器人解决率*100).toAccuracy(2)+'%'||0}}
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">
    {{allData.机器人服务数据.机器人转人工会话量||0}}
    </div>
    <div class="message">机器人转人工会话量</div>
    </div>
    <div class="percentage">机器人转人工率：
    {{ (allData.机器人服务数据.机器人转人工率*100).toAccuracy(2)+'%'||0}}

    </div>
    </div>
    </div>
    </div>
    </div>

    <div>
    <div class="clearfix part">
    <div class="col-xs-12">
    <div class="large_canvas">
    <chart :options="机器人服务数据_option" :auto-resize="true"></chart>
    </div>
    </div>
    </div>
    </div>
    <div>&nbsp;</div>
    <h1 class="page_title noBorder">
    客服服务数据&nbsp;<word-explain keys="工作报表-总览-客服服务数据"></word-explain>
    </h1>
    <div class="clearfix">
    <div class="data-screening">
    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">{{allData.客服服务数据.客服会话量||0}}</div>
    <div class="message">客服会话量</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">{{allData.客服服务数据.客服接待量||0}}</div>
    <div class="message">客服接待量</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">
    {{ ((allData.客服服务数据.问题解决效率||0)*100).toAccuracy(2)||0}}%

    </div>
    <div class="message">问题解决效率</div>
    </div>
    </div>
    </div>


    </div>
    </div>
    <div>
    <div class="clearfix part">
    <div class="col-xs-12">
    <div class="large_canvas">
    <chart :options="客服服务数据_option" :auto-resize="true"></chart>
    </div>
    </div>
    </div>
    </div>
    <div>&nbsp;</div>
    <h1 class="page_title_rewrite no_underLine_tittle">
    客服服务消息量&nbsp;<word-explain keys="工作报表-总览-客服服务消息量"></word-explain>
    </h1>
    <div class="clearfix">
    <!--悬浮框-->
    <div class="data-screening">
    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">{{allData.客服服务消息量.总消息量||0}}</div>
    <div class="message">总消息量</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">{{allData.客服服务消息量.客服消息量||0}}</div>
    <div class="message">客服消息量</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">{{allData.客服服务消息量.访客消息量||0}}</div>
    <div class="message">访客消息量</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">
    {{ (allData.客服服务消息量.答问比*100).toAccuracy(2)+'%'||0}}
    </div>
    <div class="message">答问比</div>
    </div>
    </div>
    </div>

    </div>
    </div>
    <div class="clearfix part">
    <div class="col-xs-12">
    <div class="large_canvas">
    <chart :options="客服服务消息量_option" :auto-resize="true"></chart>
    </div>
    </div>
    </div>
    <div>&nbsp;</div>
    <h1 class="page_title noBorder">
    客服服务时长&nbsp;<word-explain keys="工作报表-总览-客服服务时长"></word-explain>
    </h1>
    <div class="clearfix">
    <div class="data-screening">
    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content top3_box_content_rw">
    <div class="inner_content ">
    <div class="strong">
    {{$api.MillisecondToDate(allData.客服服务时长.平均会话时长*1000)||0}}
    </div>
    <div class="message">平均会话时长</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content top3_box_content_rw">
    <div class="inner_content ">
    <div class="strong">
    {{$api.MillisecondToDate(allData.客服服务时长.平均首次响应时长*1000)||0}}

    </div>

    <div class="message">平均首次响应时长</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content top3_box_content_rw">
    <div class="inner_content ">
    <div class="strong">
    {{$api.MillisecondToDate(allData.客服服务时长.平均响应时长*1000)||0}}
    </div>
    <div class="message">平均响应时长</div>
    </div>
    </div>
    </div>

    </div>
    </div>

    <div class="clearfix">
    <div class="col-lg-4 col-md-6 padding_px">
    <h4 class="box_title noBorder marginTop">会话时长&nbsp;<word-explain keys="工作报表-总览-首次响应时间"></word-explain>
    </h4>
    <div class="small_canvas part small_part noMarginTop">
    <chart :options="会话时长_barOption" :auto-resize="true"></chart>
    </div>
    </div>
    <div class="col-lg-4 col-md-6 ">
    <h4 class="box_title noBorder marginTop">首次响应时长&nbsp;<word-explain keys="工作报表-总览-首次响应时间"></word-explain>
    </h4>
    <div class="small_canvas part small_part noMarginTop">
    <chart :options="首次响应时长_barOption" :auto-resize="true"></chart>
    </div>
    </div>
    <div class="col-lg-4 col-md-6 ">
    <h4 class="box_title noBorder marginTop">响应时长&nbsp;<word-explain keys="工作报表-总览-首次响应时间"></word-explain>
    </h4>
    <div class="small_canvas part small_part noMarginTop">
    <chart :options="响应时长_barOption" :auto-resize="true"></chart>
    </div>
    </div>
    </div>
    <div>&nbsp;</div>
    <h1 class="page_title_rewrite no_underLine_tittle">
    访客来访情况&nbsp;<word-explain keys="工作报表-总览-访客来访情况"></word-explain>
    </h1>
    <div class="clearfix">
    <div class="data-screening">
    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">
    {{allData.访客咨询情况.历史访客||0}}
    </div>
    <div class="message">历史访客</div>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">
    {{allData.访客咨询情况.新访客||0}}
    </div>
    <div class="message">新访客</div>
    </div>
    <div class="percentage">新访客占比：{{(allData.访客咨询情况. 新访客占比*100).toAccuracy(2)+'%'||0}}</div>
    </div>
    </div>

    <div class="col-md-6 col-lg-3">
    <div class="top3_box_content">
    <div class="inner_content ">
    <div class="strong">{{allData.访客咨询情况.老访客||0}}</div>
    <div class="message">老访客</div>
    </div>
    <div class="percentage">老访客占比：{{ (allData.访客咨询情况.老访客占比*100).toAccuracy(2)+'%'||0}}</div>
    </div>
    </div>
    </div>

    <div class="clearfix part">

    <div class="col-xs-12">
    <div class="large_canvas">
    <chart :options="访客咨询情况_option" :auto-resize="true"></chart>
    </div>
    </div>
    </div>
    </div>
    <div class=" clearfix breakFirstCol">
    <div class="col-md-6 col-lg-4 padding_px"  style="min-width: 450px;">
    <h4 class="box_title noBorder marginTop">访客来源</h4>
    <div class=" part small_part noMarginTop small_canvas small_canvas_rw">
    <chart :options="访客来源_pieOption" :auto-resize="true"></chart>
    <div class="info" size="2">
    <table>
    <tr>
    <td><i class="fa fa-weixin " :style="{color:访客来源_pieOption.color[0]}"/>&nbsp;</td>
    <td>{{ 访客来源_pieOption.series[0].data[0].value }}&emsp;</td>
    <td class="text-right ps">({{((allData.访客来源.微信占比 || 0)*100).toAccuracy(2)}}%)</td>
    </tr>
    <tr>
    <td><i class="ivu-icon ivu-icon-monitor font20" :style="{color:访客来源_pieOption.color[1],}"/>&nbsp;</td>
    <td>{{ 访客来源_pieOption.series[0].data[1].value }}&emsp;</td>
    <td class="text-right ps">({{((allData.访客来源.网页占比 || 0)*100).toAccuracy(2)}}%)</td>
    </tr>
    </table>
    </div>
    </div>
    </div>

    <div class="col-md-6 col-lg-6 " style="min-width: 450px;">
    <h4 class="box_title noBorder marginTop">满意度</h4>
    <div class=" part small_part noMarginTop small_canvas small_canvas_rw">
    <chart :options="满意度_pieOption" :auto-resize="true"></chart>
    <div class="info info_rw" size="2">
    <table style="
    position: relative;top: 50%;transform: translateY(-15%);">
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

    <h4 class="page_title_rewrite no_underLine_tittle noBorder">咨询分类&nbsp;<word-explain
      keys="工作报表-总览-咨询分类"></word-explain>
    </h4>

    <div class="report part no-padding" style="width:100%;height:350px  ">
      <el-row>
        <el-col :span="7">
          <div class="">
            <div style="width:100%;height:350px">
              <chart :options="咨询分类_option" :auto-resize="true"></chart>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class=" no-padding">
            <div class="border-left" style="width:100%;height:350px">
              <h2 class="bar-classify-tittle">一级分类</h2>
              <bar wrapper="wrapper" style="height:306px;">
                <div class="bar-classify-content">
                  <div style="height: 25px" v-for="item in allData.咨询分类.一级分类">
                    <div class="pull-left small-round classfiRound "></div>
                    <div class="pull-left classify01_div" >
                      <el-tooltip :content="item.一级分类" placement="top">
                      <h3 class="classify01_h3">{{item.一级分类}}</h3>
                        </el-tooltip>
                    </div>
                    <div class="pull-right"><h3>{{item.数量}} <span
                      class="brackets">({{(item.占比*100).toAccuracy(2) }}%)</span></h3></div>
                  </div>
                </div>
              </bar>
            </div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class=" no-padding">
            <div class="border-left" style="width:100%;height:350px">
              <h2 class="bar-classify-tittle">二级分类</h2>
              <bar wrapper="wrapper" style="height:306px;">
                <div class="bar-classify-content">
                  <div style="height: 25px" v-for="item in allData.咨询分类.二级分类">
                    <div class="pull-left small-round classfiRound"></div>
                    <div class="pull-left classify01_div">
                      <el-tooltip :content="item.一级分类+'--'+item.内容" placement="top">
                        <h3 class="classify02_h3">{{item.一级分类+'--'+item.内容}}</h3>
                      </el-tooltip>
                    </div>
                    <div class="pull-right"><h3>{{item.数量}}<span class="brackets">({{(item.占比*100).toAccuracy(2) }}%)</span>
                    </h3></div>
                  </div>
                </div>
              </bar>
            </div>
          </div>
        </el-col>
      </el-row>








    </div>
    <div>
      &nbsp;
    </div>


  </div>
</template>

<script>
  /*import Chart from 'vue-bulma-chartjs'
    import gauge from '../module/gauge'*/
  import ECharts from '../module/ECharts.vue'//'vue-echarts/components/ECharts.vue'
  import echarts from 'echarts'
  import 图表 from '../mixin/图表.js'
  import bar from '../module/自定义滚动条.vue'

  import png1 from './1.png'

  export default {
    mixins: [图表],
    data() {
      return {
        window: {},
        time_frame: [new Date().getTime() - 7 * 24 * 3600 * 1000, new Date().getTime() - 24 * 3600 * 1000],
        search: {
          cid: 1,
        },

        allData: {
          咨询分类: {
            一级分类: [],
            二级分类: [],
          },
          客服服务数据: {
            客服会话量:0,
            客服接待量:0,
            问题解决效率:0,
          },
          客服服务时长: {
            平均会话时长:0,
            平均首次响应时长:0,
            平均响应时长:0,
          },
          客服服务消息量: {
            总消息量:0,
            客服消息量:0,
            访客消息量:0,
            答问比:0,
          },
          机器人服务数据: {
            机器人会话量:0,
            机器人解决量:0,
            机器人转人工会话量:0,
            机器人解决率:0,
            机器人转人工率:0,
          },
          访客来访情况:{
            历史访客:0,
            新访客:0,
            新访客占比:0,
            老访客:0,
            老访客占比:0,
          },
          满意度: {},
          访客咨询情况: {},
          访客来源: {},
        },


        机器人服务数据_option: {},
        客服服务数据_option: {},
        客服服务消息量_option: {},
        访客咨询情况_option: {},

        会话时长_barOption: {},
        响应时长_barOption: {},
        首次响应时长_barOption: {},

        访客来源_pieOption: {},
        满意度_pieOption: {},
        咨询分类_pieOption: {},
        咨询分类_option: {
          tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
          },
          color: [],
          //   ['#F5A5A6',
          //   '#FFE0A7',
          //   '#7FE18E',
          //   '#81AEF1',
          //   '#B6A6E4',
          // ],

          series: [
            {
              // name: '',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                normal: {
                  show: false,
                  position: 'inner'
                }
              },
              data: [
                {value: 100, name: '一级分类01'},
                {value: 100, name: '一级分类02'},
              ]
              // {value: 100, name: '搜索引擎'},
              // {value: 100, name: '搜索引擎1'},
              // {value: 100, name: '搜索引擎2'},
            },
            {
              label: {
                normal: {
                  show: false,
                  position: 'inner'
                }
              },
              // name: '',
              type: 'pie',
              radius: ['40%', '55%'],
              data: [
                {value: 50, name: '二级分类01'},
                {value: 50, name: '二级分类02'},
                {value: 50, name: '二级分类03'},
                {value: 50, name: '二级分类04'}
              ]
              // {value: 1048, name: '百度'},
              // {value: 251, name: '谷歌'},
              // {value: 102, name: '其他'}
            }
          ]
        },


      }
    },
    created() {
      let v = this
      this.init图配置()
      this.searchs()
    },
    mounted() {
      //this.清除数据痕迹();
    },
    methods: {
      rgbToHex(r, g, b) {
        var hex = ((r << 16) | (g << 8) | b).toString(16)
        return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex
      },

      hexToRgb(hex) {
        var rgb = []
        for (var i = 1; i < 7; i += 2) {
          rgb.push(parseInt("0x" + hex.slice(i, i + 2)))
        }
        return rgb
      },

      gradient(startColor, step) {
        //将hex转换为rgb
        var sColor = this.hexToRgb(startColor),
          eColor = this.hexToRgb('#ffffff')

        //计算R\G\B每一步的差值
        var rStep = (eColor[0] - sColor[0]) / step,
        gStep = (eColor[1] - sColor[1]) / step,
        bStep = (eColor[2] - sColor[2]) / step

        var gradientColorArr = []
        for (var i = 0; i < step; i++) {
          //计算每一步的hex值
          gradientColorArr.push(this.rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2])))
        }
        return gradientColorArr
      },

      download() {
        let v = this
        // start: v.time_frame[0], end: v.time_frame[1]
        // /api/statistic/export/kf_service_work_load?cid=1&start=2018-03-01&end=2018-03-03
        var url = '/api/statistic/export/overview?cid=1&'

        v.time_frame[0] = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[0])
        v.time_frame[1] = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[1])
        url = url + 'start=' + v.time_frame[0] + '&' + 'end=' + v.time_frame[1]
        v.$api.downloadFromService('', url)

      },
      init图配置() {
        let v = this
        let options1 = {
          legend: ['机器人会话量', '机器人解决量', '机器人转人工会话量'],
          series_names: ['机器人会话量', '机器人解决量', '机器人解决率', '机器人转人工会话量', '机器人转人工率'],
          colors: ['#7FB8F3', '#afe699', 'none', '#a4a3f1', 'none'],
          series_types: ['line', 'bar', 'custom', 'bar', 'custom'],
        }
        v.机器人服务数据_option = v.fn_mixin获取折线和柱状图配置(options1)

        // v.机器人服务数据_option.tooltip=
        // {
        // };

        let legend1 = ['客服会话量', '客服接待量']
        let options2 = {
          legend: ['客服会话量', '客服接待量'],
          series_names: ['客服会话量', '客服接待量', '问题解决效率'],
          colors: ['#F4A1A1', '#AA89BD', 'none'],
          series_types: ['line', 'line', 'custom'],
        }
        v.客服服务数据_option = v.fn_mixin获取折线和柱状图配置(options2)
        let options3 = {
          legend: ['总消息量', '客服消息量', '访客消息量'],
          series_names: ['总消息量', '客服消息量', '访客消息量', '答问比'],
          colors: ['#DED47F', '#ffa5a5', '#ffae21', 'none'],
          series_types: ['line', 'bar', 'bar', 'custom'],
        }
        v.客服服务消息量_option = v.fn_mixin获取折线和柱状图配置(options3)
        let options4 = {
          legend: ['历史访客', '新访客', '老访客'],
          series_names: ['历史访客', '新访客', '新访客占比', '老访客', '老访客占比'],
          colors: ['#E1AE21', '#bcdb81', 'none', '#eedd8e', 'none'],
          series_types: ['line', 'bar', 'custom', 'bar', 'custom'],
        }
        v.访客咨询情况_option = v.fn_mixin获取折线和柱状图配置(options4)
        let ydata1 = ['<15s', '15s-30s', '30s-45s', '45s-1m', '>1m']
        let ydata2 = ['0%', '0%', '0%', '0%', '0%']
        let ydata3 = ['<2m', '2m-4m', '4m-6m', '6m-8m', '>8m']
        let sdata1 = [100, 100, 100, 100, 100]
        let sdata2 = [0, 0, 0, 0, 0]
        v.首次响应时长_barOption = v.fn_mixin获取双向柱状图配置(ydata1, ydata2, sdata1, sdata2)
        v.响应时长_barOption = v.fn_mixin获取双向柱状图配置(ydata1, ydata2, sdata1, sdata2)
        v.会话时长_barOption = v.fn_mixin获取双向柱状图配置(ydata3, ydata2, sdata1, sdata2)

        v.访客来源_pieOption = v.fn_mixin获取空心饼状图配置(['微信', '网页'], 0)
        v.访客来源_pieOption.color = ['#4fd578', '#768bd2']
        v.满意度_pieOption =
          v.fn_mixin获取空心饼状图配置02([], 0)

      },
      searchs() {
        var v = this

        let start = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[0])
        let end = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[1])
        v.search.start = start
        v.search.end = end


        v.$api.ajax('/statistic/overview', 'get', v.search).then((data) => {
          v.allData = data

          v.清除数据痕迹()
          //将列表改为对象
          let 机器人服务数据 = {},
            客服服务数据 = {},
            客服服务消息量 = {},
            访客咨询情况 = {}
          let format = new Date(v.time_frame[0]).setHours(0, 0, 0, 0) == new Date(v.time_frame[1]).setHours(0, 0, 0, 0) ? 'hh:00' : 'yyyy-MM-dd'
          data.机器人服务数据.趋势.forEach(val => {
            let time = v.$api.dateFormat(format, new Date(val.时间).getTime() + 300 * 1000)
            time = time == '00:00' ? '24:00' : time
            机器人服务数据[time] = val
          })
          //填充数据
          v.机器人服务数据_option.xAxis.data.forEach((val, i) => {
            if (!机器人服务数据[val]) {
              return false
            }
            v.机器人服务数据_option.series[0].label
            v.机器人服务数据_option.series[0].data[i] = 机器人服务数据[val].机器人会话量
            v.机器人服务数据_option.series[1].data[i] = 机器人服务数据[val].机器人解决量
            v.机器人服务数据_option.series[2].data[i] = (机器人服务数据[val].机器人解决率 * 100).toAccuracy(2) + '%'

            v.机器人服务数据_option.series[3].data[i] = 机器人服务数据[val].机器人转人工会话量
            v.机器人服务数据_option.series[4].data[i] = (机器人服务数据[val].机器人转人工率 * 100).toAccuracy(2) + '%'

          })
          //将列表改为对象
          data.客服服务数据.趋势.forEach(val => {
            let time = v.$api.dateFormat(format, new Date(val.时间).getTime() + 300 * 1000)
            time = time == '00:00' ? '24:00' : time
            客服服务数据[time] = val
          })
          //填充数据
          v.客服服务数据_option.xAxis.data.forEach((val, i) => {
            if (!客服服务数据[val]) {
              return false
            }
            v.客服服务数据_option.series[0].data[i] = 客服服务数据[val].客服会话量
            v.客服服务数据_option.series[1].data[i] = 客服服务数据[val].客服接待量
            v.客服服务数据_option.series[2].data[i] = (客服服务数据[val].问题解决效率 * 100).toAccuracy(2) + '%'

          })
          //将列表改为对象
          data.客服服务消息量.趋势.forEach(val => {
            let time = v.$api.dateFormat(format, new Date(val.时间).getTime() + 300 * 1000)
            time = time == '00:00' ? '24:00' : time
            客服服务消息量[time] = val
          })
          //填充数据
          v.客服服务消息量_option.xAxis.data.forEach((val, i) => {
            if (!客服服务消息量[val]) {
              return false
            }
            v.客服服务消息量_option.series[0].data[i] = 客服服务消息量[val].总消息量
            v.客服服务消息量_option.series[1].data[i] = 客服服务消息量[val].客服消息量
            v.客服服务消息量_option.series[2].data[i] = 客服服务消息量[val].访客消息量

            v.客服服务消息量_option.series[3].data[i] = (客服服务消息量[val].答问比 * 100).toAccuracy(2) + '%'

          })
          //将列表改为对象
          data.访客咨询情况.趋势.forEach(val => {
            let time = v.$api.dateFormat(format, new Date(val.时间).getTime() + 300 * 1000)
            time = time == '00:00' ? '24:00' : time
            访客咨询情况[time] = val
          })
          //填充数据
          v.访客咨询情况_option.xAxis.data.forEach((val, i) => {
            if (!访客咨询情况[val]) {
              return false
            }
            v.访客咨询情况_option.series[0].data[i] = 访客咨询情况[val].历史访客
            // || 访客咨询情况[val].总访客;
            v.访客咨询情况_option.series[1].data[i] = 访客咨询情况[val].新访客
            v.访客咨询情况_option.series[2].data[i] = (访客咨询情况[val].新访客占比 * 100).toAccuracy(2) + '%'

            v.访客咨询情况_option.series[3].data[i] = 访客咨询情况[val].老访客
            v.访客咨询情况_option.series[4].data[i] = (访客咨询情况[val].老访客占比 * 100).toAccuracy(2) + '%'

          })

          //将列表改为对象2
          let 会话时长 = Object.assign(...data.客服服务时长.会话时长),
            响应时长 = Object.assign(...data.客服服务时长.响应时长),
            首次响应时长 = Object.assign(...data.客服服务时长.首次响应时长)
          //填充数据
          v.会话时长_barOption.yAxis[0].data.forEach((val, i) => {
            let percent = (会话时长[val] * 100).toAccuracy(2)
            v.会话时长_barOption.series[1].data[i] = percent
            v.会话时长_barOption.yAxis[1].data[i] = percent + '%'
          })
          v.响应时长_barOption.yAxis[0].data.forEach((val, i) => {
            let percent = (响应时长[val] * 100).toAccuracy(2)
            v.响应时长_barOption.series[1].data[i] = percent
            v.响应时长_barOption.yAxis[1].data[i] = percent + '%'
          })
          v.首次响应时长_barOption.yAxis[0].data.forEach((val, i) => {
            let percent = (首次响应时长[val] * 100).toAccuracy(2)
            v.首次响应时长_barOption.series[1].data[i] = percent
            v.首次响应时长_barOption.yAxis[1].data[i] = percent + '%'
          })
          //填充数据
          v.访客来源_pieOption.series[0].data[0].value = data.访客来源.微信
          v.访客来源_pieOption.series[0].data[1].value = data.访客来源.网页

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

          // v.满意度_pieOption_backup.color = [
          //   '#9ae246',
          //   '#69aefa',
          //   '#d2d4e8',
          //   '#f5d9a3',
          //   '#e18d8d',
          // ]

          // if(data.满意度.一般){
          //
          // }



          // if(data.满意度.非常满意||data.满意度.非常不满意){
          //   v.满意度_pieOption.series[0].data.push(
          //     {name:'非常满意',value:'0'}
          //   )

          //   v.满意度_pieOption.series[0].data.push(
          //     {name:'非常不满意',value:'0'}
          //   )
          //   v.满意度_pieOption.series[0].data[4].value = data.满意度.非常不满意
          //   v.满意度_pieOption.series[0].data[0].value = data.满意度.非常满意
          // }
          //
          //
          //
          // v.满意度_pieOption.series[0].data[1].value = data.满意度.满意
          // v.满意度_pieOption.series[0].data[3].value = data.满意度.不满意
          //
          // v.满意度_pieOption.series[0].data[0].value = data.满意度.满意

//造数据

          // v.allData.咨询分类.一级分类 = [
          //   {
          //     '一级分类': '一级分类1',
          //     '数量': 350
          //   },
          //   {
          //     '一级分类': '一级分类2',
          //     '数量': 100
          //   },
          // ]
          // v.allData.咨询分类.二级分类 = [
          //   {
          //     '一级分类': '一级分类1',
          //     '一级分类总数量':'200',
          //       '内容': '二级分类1',
          //     '数量': 50
          //   },
          //   {
          //     '一级分类': '一级分类1',
          //     '一级分类总数量':'200',
          //       '内容': '二级分类2',
          //     '数量': 50
          //   },
          //   {
          //     '一级分类': '一级分类1',
          //     '一级分类总数量':'200',
          //       '内容': '二级分类3',
          //     '数量': 100
          //   },
          //   {
          //     '一级分类': '一级分类1',
          //     '一级分类总数量':'200',
          //     '内容': '二级分类4',
          //     '数量': 150
          //   },
          //   {
          //     '一级分类': '一级分类2',
          //     '一级分类总数量':'100',
          //
          //     '内容': '二级分类5',
          //     '数量': 30
          //   },
          //   {
          //     '一级分类': '一级分类2',
          //     '一级分类总数量':'100',
          //
          //     '内容': '二级分类2',
          //     '数量': 70
          //   },
          // ]


          //咨询分类.二级分类 按一级分类总计数量排序
          var temArr01 = [], temArr02 = [], temArr03 = [], firstClassArr = [], temArr05 = [],
            secondClassArr = []
          v.allData.咨询分类.二级分类.forEach(item => {
            temArr01.push(item.一级分类 + '-' + item.一级分类总数量)
          })

          temArr02 = Array.from(new Set(temArr01))

          var Obj = function (a, b) {
            this.一级分类 = a
            this.一级分类总数量 = b
          }

          temArr02.forEach(item => {
            temArr03.push(new Obj(item.split("-")[0], item.split("-")[1]))
          })

          var compare = function (property) {
            return function (a, b) {
              var value1 = a[property]
              var value2 = b[property]
              return value1 - value2
            }
          }

          temArr03.sort(compare('一级分类总数量'))
          firstClassArr = temArr03.reverse()

          firstClassArr.forEach(item => {
            temArr05.push(new Array())
          })


          firstClassArr.forEach((itemOut, j) => {

            v.allData.咨询分类.二级分类.forEach((item, i) => {
              if (v.allData.咨询分类.二级分类[i].一级分类 ==
                firstClassArr[j].一级分类

              ) {
                temArr05[j].push(v.allData.咨询分类.二级分类[i])
              }
            })
          })

          temArr05.forEach(item => {
              (item.sort(compare('数量'
              )).reverse())
            }
          )
          secondClassArr = temArr05
          v.allData.咨询分类.二级分类 = [].concat.apply([], secondClassArr)
          // 咨询分类.二级分类 数据成组处理


          //一级、二级分类颜色数组
          let firstClaColor = [
            '#e32322',
            '#ea621f',
            '#f18e1c',
            '#fdc60b',
            '#f4e500',
            '#8cbb26',
            '#008e5b',
            '#0696bb',
            '#2a71b0',
            '#444e99',
            '#6d398b',
            '#c4037d',

          ]

          let secondClaColor = [
          ]
          let firstClaColorAft=[]
          v.allData.咨询分类.一级分类.forEach((item,index)=>{
            firstClaColorAft.push(firstClaColor[index])
          })

          secondClassArr.forEach(item=>{
            secondClaColor.push(new Array())
          })

          var fistArr = v.allData.咨询分类.一级分类
          var secondDulArr = []
          var finalColorArr = []

          v.allData.咨询分类.一级分类.forEach(item => {
            secondDulArr.push(new Array())
          })

          secondClassArr.forEach((item,index)=>{
            secondClaColor[index].push(v.gradient(firstClaColor[index],secondClassArr[index].length))

          })

          let secondClaColorAft=[]
          secondClaColor.forEach(item=>{
            item[0].forEach(itemIn=>{
              secondClaColorAft.push(itemIn)
            })
          })
          var finalColorArr =[]
          finalColorArr = firstClaColorAft.concat(secondClaColorAft)



          // v.allData.咨询分类.一级分类.forEach((item, i) => {
          //
          //   v.allData.咨询分类.二级分类.forEach((itemIn, j) => {
          //     if (item.一级分类 == itemIn.一级分类) {
          //       secondDulArr[i].push(v.allData.咨询分类.二级分类[j])
          //     }
          //   })
          // })
          //
          // fistArr.forEach((item, i) => {
          //   finalColorArr.push(firstClaColor[i])
          // })
          //
          // secondDulArr.forEach((item, i) => {
          //   secondDulArr[i].forEach((itemIn, j) => {
          //     finalColorArr.push(secondClaColor[i][j])
          //   })
          // })
          //
          //
          // v.咨询分类_option.series[0].data
          //
          // firstClaColor.slice(0, v.咨询分类_option.series[0].data.length)

          v.咨询分类_option.color = finalColorArr
          // finalColorArr

          //   '#5CD36D',
          //   '#5A9BFF',
          // ]
          let arr01 = []
          v.allData.咨询分类.一级分类.forEach((item, i) => {
            arr01.push({
              'name': v.allData.咨询分类.一级分类[i].一级分类,
              'value': v.allData.咨询分类.一级分类[i].数量
            })
          })

          let arr02 = []
          v.allData.咨询分类.二级分类.forEach((item, i) => {
            arr02.push({
              'name': v.allData.咨询分类.二级分类[i].一级分类 + '--' + v.allData.咨询分类.二级分类[i].内容,
              'value': v.allData.咨询分类.二级分类[i].数量
            })
          })
          v.咨询分类_option.series[0].data = arr01
          v.咨询分类_option.series[1].data = arr02
          //数据计算到此结束




          /* v.会话时长_barOption01 = new 构造双向柱状图()
           var temp_arr01 = []
           v.allData.客服服务时长.会话时长.forEach(item => {
             temp_arr01.push(Object.keys(item)[0])
           })
           temp_arr01.reverse()
           v.会话时长_barOption01.yAxis[0].data = temp_arr01

           var temp_arr02 = []
           v.allData.客服服务时长.会话时长.forEach(item => {
             temp_arr02.push(Object.values(item)[0])
           })
           temp_arr02.reverse()
           v.会话时长_barOption01.series[1].data = temp_arr02.map(item => {
             return item * 100
           })
           v.会话时长_barOption01.yAxis[1].data = temp_arr02.map(item => {
             return (item * 100).toAccuracy(0) + '%'
           })


           v.首次响应时长_barOption02 = new 构造双向柱状图()

           var temp_arr03 = []
           v.allData.客服服务时长.首次响应时长.forEach(item => {
             temp_arr03.push(Object.keys(item)[0])
           })
           temp_arr03.reverse()
           v.首次响应时长_barOption02.yAxis[0].data = temp_arr03
           var temp_arr04 = []
           v.allData.客服服务时长.首次响应时长.forEach(item => {
             temp_arr04.push(Object.values(item)[0])
           })
           temp_arr04.reverse()
           v.首次响应时长_barOption02.series[1].data = temp_arr04.map(item => {
             return item * 100
           })
           v.首次响应时长_barOption02.yAxis[1].data = temp_arr04.map(item => {
             return (item * 100).toAccuracy(0) + '%'
           })

           //
           v.响应时长_barOption03 = new 构造双向柱状图()
           var temp_arr05 = []
           v.allData.客服服务时长.响应时长.forEach(item => {
             temp_arr05.push(Object.keys(item)[0])
           })
           temp_arr05.reverse()
           v.响应时长_barOption03.yAxis[0].data = temp_arr05
           //
           var temp_arr06 = []
           v.allData.客服服务时长.响应时长.forEach(item => {
             temp_arr06.push(Object.values(item)[0])
           })
           temp_arr06.reverse()
           v.响应时长_barOption03.series[1].data = temp_arr06.map(item => {
             return item * 100
           })
           v.响应时长_barOption03.yAxis[1].data = temp_arr06.map(item => {
             return (item * 100).toAccuracy(0) + '%'
           })*/

        })
      },
      清除数据痕迹() {
        let v = this
        let 图标1 = ['机器人服务数据_option', '客服服务数据_option', '客服服务消息量_option', '访客咨询情况_option']
        let 图标2 = ['首次响应时长_barOption', '响应时长_barOption', '会话时长_barOption']
        let 图标3 = ['访客来源_pieOption', '满意度_pieOption']
        let time = {start: v.time_frame[0], end: v.time_frame[1]}
        图标1.forEach(val => {
          v.fn_mixin初始化折线和柱状图Bytime(v[val], time, 0)
        })
        图标2.forEach(val => {
          v[val].series[1].data = []
          let i = 0
          while (i <= 4) {
            v[val].series[1].data.push(0)
            i++
          }
        })
        图标3.forEach(val => {
          v.fn_mixin初始化饼状图(v[val], 0)
        })

      }


    },
    watch: {
      'time_frame': {
        handler: function (n, o) {
          this.searchs()
        },
        deep: true,
      }
    },
    components: {
      'chart': ECharts,
      bar
    }
  }
</script>

<style lang="scss" scoped>
  .info_rw{
    top: -80px!important;
  }
  .small_canvas_rw{
    height: 210px
  }
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
    font-size: 36px;
    font-weight: 500;
  }

  .message {
    font-weight: 500;
    font-size: 14px;
  }

  .box_title:before {
    width: 0px
  }

  .border-left {
    border-left: 1px solid #e7f2f7;
  }

  .bar-classify-tittle {
    text-align: center;
    line-height: 40px;
    background-color: #F4F8FB;
  }

  .no-padding {
    padding-left: 0px;
    padding-right: 0px;
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
    margin-top: 0;
    margin-right: 20px;
    width: 14px;
    height: 14px;
    background-color: #fff;
    border: 3px #b3bdc2
    solid;
    border-radius: 50px;
  }

  .classify01_div{
    width: 43%;
  }

  .classify01_h3{
    display: inline-block;
    width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .classify02_h3{
    display: inline-block;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  .classfiRound{
    margin-right: 10px;
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


  .bar-classify-content {
    width: 78%;
    margin: 0 auto;
    padding: 25px 0;
  }

  .part {
  }

  .small_part {
    margin: 0px
  }

  .marginTop {
    margin-top: 20px;
  }

  .padding_px {
    padding-left: 0px;
  }

  .top3_box_content_rw {
    margin: 5px 20px 0px 0px;;

  }

  .brackets {
    color: #C0CED8;
  }

  .test {
    color: #e8f1d3;
  }
</style>
