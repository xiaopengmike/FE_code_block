<template>
  <div class="report">
      <h1 class="page_title_rewrite no_underLine_tittle">
        机器人服务数据&nbsp;<word-explain keys="工作报表-机器人-机器人数据总览-机器人总览"></word-explain>
        <button class="my-btn my-btn-info-o pull-right font14 marg_l_10"
                @click="download()"
        ><i class="fa fa-sign-out"></i>导出报表</button>
      </h1>


    <div class="clearfix">
      <!--悬浮框-->
      <div class="data-screening">
        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.机器人数据总览.机器人会话量||0}}</div>
              <div class="message">机器人会话量</div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.机器人数据总览.机器人解决量||0}}</div>
              <div class="message">机器人解决量</div>
            </div>

            <div class="percentage">机器人解决率：{{ (allData.机器人数据总览.机器人解决率*100).toAccuracy(2)}}%</div>

          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.机器人数据总览.机器人转人工会话量||0}}</div>
              <div class="message">机器人转人工会话量</div>
            </div>

            <div class="percentage">机器人转人工率：{{ (allData.机器人数据总览.机器人转人工率*100).toAccuracy(2)}}%</div>

          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="clearfix part">
        <div class="col-xs-12">
          <div  class="">
            <div class="large_canvas" >
              <chart :options="机器人数据总览_option" :auto-resize="true"></chart>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h3>&nbsp;</h3>
    <h1 class="page_title noBorder">
      机器人消息&nbsp;<word-explain keys="工作报表-机器人-机器人数据总览-机器人消息"></word-explain>
    </h1>
    <div class="clearfix">
      <!--悬浮框-->
      <div class="data-screening">
        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.机器人消息.访客提问总数||0}}</div>
              <div class="message">访客提问总数</div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.机器人消息.匹配提问数
                ||0}}</div>
              <div class="message">匹配提问数</div>
            </div>


            <div class="percentage">匹配率：{{(allData.机器人消息.匹配率*100).toAccuracy(2)}}%</div>

          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="top3_box_content">
            <div class="inner_content ">
              <div class="strong">{{allData.机器人消息.未匹配提问数||0

                }}</div>
              <div class="message">未匹配提问数</div>
            </div>
            <div class="percentage">未匹配率：{{(allData.机器人消息.未匹配率 *100).toAccuracy(2) }}%</div>
          </div>
        </div>


      </div>
    </div>
    <div>
      <div class="clearfix part">
        <div class="col-xs-12">
          <div class="">
            <div class="large_canvas">
              <chart :options="机器人消息_option" :auto-resize="true"></chart>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h1 class="page_title_rewrite no_underLine_tittle">
      热点问题咨询Top5&nbsp;<word-explain keys="工作报表-总览-在线服务数据"></word-explain>
    </h1>
    <div class="clearfix">
	    <div class="col-sm-12 no_padding_margin part">
	        <div style=" height:300px; max-width:800px; margin:auto;">
	          <chart :options="热点问题咨询Top5_option" :auto-resize="true"></chart>
	        </div>
	    </div>
    </div>
		<br />

  </div>
</template>

<script>
	import ECharts from '../../module/ECharts.vue'
	import 图表 from '../../mixin/图表.js'
	import echarts from 'echarts'
  export default {
    props: ['time_frame'],
    mixins: [图表],
    data() {
      return {

        allData:{
          机器人数据总览:{
            机器人会话量:0,
            机器人解决量:0,
            机器人解决率:0,
            机器人转人工会话量:0,
            机器人转人工率:0
          },
          机器人消息:{
            访客提问总数:0,
            匹配提问数:0,
            匹配率:0,
            未匹配提问数:0,
            未匹配率:0,

          }

        },

        /*机器人数据总览_option_error: {
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
            data: ['机器人会话量', '机器人解决量', '机器人转人工会话量'],
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
              name: '机器人会话量',
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
              name: '机器人解决量',
              type: 'custom',
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
              name: '机器人转人工会话量',
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
              name: '机器人解决率',
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
              name: '机器人转人工率',
              type: 'custom',
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
        /*机器人消息_option_error: {
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
            data: ['访客提问总数', '匹配提问数', '未匹配提问数'],
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
              name: '访客提问总数',
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
              name: '匹配提问数',
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
              name: '未匹配提问数',
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
              name: '匹配率',
              type: 'custom',
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
              name: '未匹配率',
              type: 'custom',
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

        热点问题咨询Top5_option: {
          title: {
            show:false,
            text: '热点问题Top5',
            top:'5%',
            left:'23%',
            textStyle:{
              fontSize:14,
              fontWeight:'500',
            }
          },
          grid: {
            top: 50,
            bottom: 20,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            show: false,
            splitLine: {show: false},//去除网格线
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            axisLine: {show: false},
            axisTick: {show: false},
            // splitLine:{show: false},//去除网格线
            type: 'category',
             inverse:true,
            data:[],
              // ['广东', '广西', '陕西', '山东', '12345678']
            axisLabel:{
            	fontSize:'14',
	            color: '#7b939f',
              formatter:function(str){
                let result = '';
                let len = 20;
                if(str.replace(/[^\x00-\xff]/g,'aa').length<=len*2+1){
                  return str;
                }else{
                  for(let i=len;i<str.length;i++){
                    result = str.slice(0,i);
                    if(result.replace(/[^\x00-\xff]/g,'aa').length==len*2 || result.replace(/[^\x00-\xff]/g,'aa').length==len*2+1)  {
                      break;
                    }
                  }
                  return result + '...';
                }
              }
            }
          },
          series: [

            {
              name: '咨询次数',
              type: 'bar',
              barWidth: 10,
              data: [],
              // [19325, 23438, 31000, 121594, 134141],
              itemStyle: {
                normal: {
                  label:{
                    formatter:'{c}次',
                    fontSize:'14',
	            			color: '#7b939f',
                  },
                  barBorderRadius: [0, 5, 5, 0],
                  // 随机显示
                  //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}

                  // 定制显示（按顺序）
                  color: function (params) {
                    var colorList = [
                      '#FC8182',
                      '#FC8182',
                      '#FC8182',
                      '#FC8182',
                      '#FC8182',
                      // '#FE9A9A',
                      // '#FDB5B4',
                      // '#FCC9C8',
                      // '#FFDCDC'
                    ];
                    return colorList[params.dataIndex]
                  }
                },
              },
              label:{
                normal:{
                  show: true,
                  position: 'right'}
              }
            },

          ]
        },

        /*机器人总览_option_error: {
          color: ['#69B0F8',
            '#B0E69A', '#A4A3F1'],
          title: {
          },
          smooth: true,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: ['机器人会话量', '机器人解决量', '机器人转人工会话量'],
            top:'bottom'
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            data: ['5月上', '5月下', '6月上', '6月下', '7月上', '7月下', '8月上', '8月下', '9月上', '9月下', '10月上', '10月下', '11月上', '11月下', '12月上', '12月下']
          }],
          yAxis: [{
            type: 'value',
          }],
          series: [{
            name: '机器人会话量',
            type: 'line',
            smooth: true,
            // color: '#fff',
            data: [40, 61, 193, 103, 115, 197, 425, 273, 214, 171, 136, 361, 227, 211, 424, 412],
          }, {
            name: '机器人解决量',
            type: 'bar',
            data: [13, 12, 39, 21, 19, 25, 43, 23, 18, 14, 11, 26, 16, 15, 30, 29],
          },
            {
              name: '机器人转人工会话量',
              type: 'bar',
              data: [13, 12, 39, 21, 19, 25, 43, 23, 18, 14, 11, 26, 16, 15, 30, 29],
            }
          ]
        },*/
        /*热点问题咨询_option: {
          title: {
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: [ '热点问题Top5']
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['巴西','印尼','美国','印度','中国']
          },
          series: [

            {
              name: '热点问题Top5',
              type: 'bar',
              data: [19325, 23438, 31000, 121594, 134141]
            }
          ]
        },*/

				机器人数据总览_option: {},
				机器人消息_option: {},
      }
    },
    created() {
    	this.init图配置();
      this.searchs();
    },
    mounted() {
      //this.清除数据痕迹();
    },
    methods: {
      download(){
        let v =this;
        // start: v.time_frame[0], end: v.time_frame[1]
        // /api/statistic/export/kf_service_work_load?cid=1&start=2018-03-01&end=2018-03-03
        var url = '/api/statistic/export/robot?cid=1&'

        v.time_frame[0] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[0])
        v.time_frame[1] = v.$api.dateFormat('yyyy-MM-dd',v.time_frame[1])
        url = url + 'start='+ v.time_frame[0] + '&'+'end='+ v.time_frame[1]
        v.$api.downloadFromService('',url)
      },
      init图配置() {
        let v = this;
        let options1 = {
        	legend: ['机器人会话量', '机器人解决量', '机器人转人工会话量'],
        	series_names :  ['机器人会话量', '机器人解决量', '机器人解决率', '机器人转人工会话量', '机器人转人工率'],
        	colors: ['#65AEF8', '#afe699', 'none', '#a4a3f1', 'none'],
        	series_types: ['line' , 'bar', 'custom', 'bar', 'custom'],
        };
        v.机器人数据总览_option = v.fn_mixin获取折线和柱状图配置(options1);
        let options2 = {
        	legend: ['访客提问数', '已匹配提问数', '未匹配提问数'],
        	series_names :  ['访客提问数', '已匹配提问数', '匹配率', '未匹配提问数', '未匹配率'],
        	colors: ['#E1AE21', '#9cd4f9', 'none', '#ddf0f1', 'none'],
        	series_types: ['line' , 'bar', 'custom', 'bar', 'custom'],
        };
        v.机器人消息_option = v.fn_mixin获取折线和柱状图配置(options2);
      },
      searchs() {
        var v = this;

        let start = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[0]);
        let end = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[1]);
        let search = {
          cid: 1,
          start: start,
          end: end,
        }

        /*v.机器人数据总览_option.xAxis.data = []
        v.机器人数据总览_option.series[0].data = []
        v.机器人数据总览_option.series[1].data = []
        v.机器人数据总览_option.series[2].data = []

        v.机器人消息_option.xAxis.data = []
        v.机器人消息_option.series[0].data = []
        v.机器人消息_option.series[1].data = []
        v.机器人消息_option.series[2].data = []*/


        v.$api.ajax('/statistic/robot', 'get', search).then(function (data) {
            v.清除数据痕迹();
            //1.
            v.allData = data
            let arr01 = [], arr02 = [];
            v.allData.热点问题咨询.forEach(item => {
            	arr01.push(item.hot_question)
              arr02.push(item.数量)
            })

            v.热点问题咨询Top5_option.yAxis.data = arr01
            v.热点问题咨询Top5_option.series[0].data = arr02

            //2.将列表改为对象
            let 机器人数据总览 = {},
              机器人消息 = {};
            let format = new Date(v.time_frame[0]).setHours(0, 0, 0, 0) == new Date(v.time_frame[1]).setHours(0, 0, 0, 0) ? 'hh:00' : 'yyyy-MM-dd';
            data.机器人数据总览.趋势.forEach(val => {
              let time = v.$api.dateFormat(format, new Date(val.时间).getTime()  + 300 * 1000);
              time = time == '00:00' ? '24:00' : time;
              机器人数据总览[time] = val;
            });
            data.机器人消息.趋势.forEach(val => {
              let time = v.$api.dateFormat(format, new Date(val.时间).getTime()  + 300 * 1000);
              time = time == '00:00' ? '24:00' : time;
              机器人消息[time] = val;
            });
            //填充
            v.机器人数据总览_option.xAxis.data.forEach((val, i) => {
              if (!机器人数据总览[val]) {
                return false;
              }
              v.机器人数据总览_option.series[0].data[i] = 机器人数据总览[val].机器人会话量;
              v.机器人数据总览_option.series[1].data[i] = 机器人数据总览[val].机器人解决量;
              v.机器人数据总览_option.series[2].data[i] = (机器人数据总览[val].机器人解决率*100).toAccuracy(2)+'%';;
              v.机器人数据总览_option.series[3].data[i] = 机器人数据总览[val].机器人转人工会话量;
              v.机器人数据总览_option.series[4].data[i] = (机器人数据总览[val].机器人转人工率*100).toAccuracy(2)+'%';;
            });
            v.机器人消息_option.xAxis.data.forEach((val, i) => {
              if (!机器人消息[val]) {
                return false;
              }
              v.机器人消息_option.series[0].data[i] = 机器人消息[val].访客提问数;
              v.机器人消息_option.series[1].data[i] = 机器人消息[val].已匹配提问数;
              v.机器人消息_option.series[2].data[i] = (机器人消息[val].匹配率*100).toAccuracy(2)+'%';;
              v.机器人消息_option.series[3].data[i] = 机器人消息[val].未匹配提问数;
              v.机器人消息_option.series[4].data[i] = (机器人消息[val].未匹配率*100).toAccuracy(2)+'%';;
            });
        })
      },
      清除数据痕迹() {
        let v = this;
        let 图标1 = ['机器人数据总览_option', '机器人消息_option'];
        let time = {start: v.time_frame[0], end: v.time_frame[1]};
        图标1.forEach(val => {
          v.fn_mixin初始化折线和柱状图Bytime(v[val], time, 0);
        });
      }
    },
    watch: {
      'time_frame': {
        handler: function (n) {
          this.searchs();
        }, deep: true
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

</style>
