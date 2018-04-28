<template>
  <div class="home report">
    <h2 class="page_title">今日数据总览&nbsp;<word-explain keys="首页-数据总览"></word-explain>
    </h2>
    <!--头部四色框02-->
    <div>
      <div class="col-md-6 col-lg-3">
        <div class="outDiv01 topColor01">
          <div class="outDiv02">
            <div class="top" >
              <div class="img_div" >
                <img src="../assets/img/home_dataScreening001.png" alt="">
              </div>
              <div>
                <div class="num">{{i_data.正在咨询人数||0}}</div>
                <div class="text01">正在咨询人数 </div>
              </div>
            </div>
            <div class="bottom bottomCol01" style="float: right">当前在线客服：{{i_data.当前在线客服||0}}</div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="outDiv01 topColor02">
          <div class="outDiv02">
            <div class="top" >
              <div class="img_div" >
                <img src="../assets/img/home_dataScreening002.png" alt="">
              </div>
              <div>
                <div class="num">{{$api.MillisecondToDate(i_data.今日总会话时长*1000)||0}}</div>
                <div class="text01">今日总会话时长 </div>
              </div>
            </div>
            <div class="bottom bottomCol02" style="float: right">平均会话时长：{{$api.MillisecondToDate(i_data.今日平均会话时长*1000)||0}}</div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="outDiv01 topColor03">
          <div class="outDiv02">
            <div class="top" >
              <div class="img_div" >
                <img src="../assets/img/home_dataScreening003.png" alt="">
              </div>
              <div>
                <div class="num">{{i_data.今日总会话量||0}}</div>
                <div class="text01">今日总会话量</div>
              </div>
            </div>
            <div class="bottom bottomCol03" style="float: right">机器人解决量：{{i_data.机器人解决量||0}}</div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="outDiv01 topColor04">
          <div class="outDiv02">
            <div class="top" >
              <div class="img_div_04" >
                <img src="../assets/img/home_dataScreening004.png" alt="">
              </div>
              <div>
                <div class="num">
                  {{i_data.今日相对满意度==='--'?i_data.今日相对满意度:((i_data.今日相对满意度*100).toAccuracy(2)+'%')}}
                  <!--{{(i_data_test.今日相对满意度*100).toAccuracy(2)+'%'||'&#45;&#45;' }}  -->
                </div>
                <div class="text01">今日相对满意度 </div>
              </div>
            </div>
            <div class="bottom bottomCol04" style="float: right">参评率：{{
              (i_data.参评率*100).toAccuracy(2)+'%'||0}}</div>
          </div>
        </div>
      </div>

      <!--<div class="col-md-3 outDiv01">02</div>-->
      <!--<div class="col-md-3 outDiv01">03</div>-->
      <!--<div class="col-md-3 outDiv01">04</div>-->
    </div>


    <!--访客来源-->
    <div>&nbsp;</div>
    <h2 class="page_title noBorder">访客分布&nbsp;</h2>
    <div class="clearfix part">

      <div class="col-xs-7 no_padding_margin">
        <div style="width:100%; height:500px; ">
          <chart :options="访客来源_option" :auto-resize="true"></chart>
        </div>
      </div>
      <div>
        <div class="clearfix">
          <!--<div class="col-xs-1 no_padding_margin top5_number">
            <div><img class="single_top5_number single_top5_1" src="../assets/img/1.png" alt=""></div>
            <div><img class="single_top5_number single_top5_2" src="../assets/img/2.png" alt=""></div>
            <div><img class="single_top5_number single_top5_3" src="../assets/img/3.png" alt=""></div>
            <div><img class="single_top5_number single_top5_4" src="../assets/img/4.png" alt=""></div>
            <div><img class="single_top5_number single_top5_5" src="../assets/img/5.png" alt=""></div>

          </div>-->
          <div class="col-xs-5 top5">
            <div style="width:100%; height:300px;max-width:470px ;">
              <chart :options="访客来源Top5_option" :auto-resize="true"></chart>
            </div>
          </div>
          <!--<div class="col-xs-1 top5_number_detail">
            <div class="top5_number_detail_1">{{}}</div>
            <div class="top5_number_detail_2">{{}}</div>
            <div class="top5_number_detail_3">{{}}</div>
            <div class="top5_number_detail_4">{{}}</div>
            <div class="top5_number_detail_5">{{}}</div>
          </div>-->
        </div>
      </div>

    </div>
    <div>&nbsp;</div>
    <div class="clearfix">
      <h1 class="page_title noBorder">
        今日客服服务数据趋势&nbsp;<word-explain keys="首页-今日客服服务数据趋势"></word-explain>
      </h1>
      <div class="clearfix">
        <!--悬浮框-->
        <div class="data-screening">
          <div class="col-md-6 col-lg-3">
            <div class="top3_box_content">
              <div class="inner_content ">
                <div class="strong">{{not_i_data.今日客服服务数据趋势.今日客服服务总会话量||0}}</div>
                <div class="message">今日客服总会话量</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="top3_box_content">
              <div class="inner_content ">
                <div class="strong">{{not_i_data.今日客服服务数据趋势.今日客服总接待量||0}}</div>
                <div class="message">今日客服总接待量</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12">
        <div class="part">
          <div class="large_canvas">
            <chart :options="今日客服服务数据趋势_option" :auto-resize="true"></chart>
          </div>
        </div>
      </div>
    </div>
    <div>&nbsp;</div>
    <div class="clearfix">
      <h1 class="page_title noBorder">
        今日机器人服务数据趋势&nbsp;<word-explain keys="首页-今日机器人服务数据趋势"></word-explain>
      </h1>
      <div class="clearfix">
        <!--悬浮框-->
        <div class="data-screening">
          <div class="col-md-6 col-lg-3">
            <div class="top3_box_content">
              <div class="inner_content ">
                <div class="strong">{{not_i_data.今日机器人服务数据趋势.今日机器人总会话量||0}}</div>
                <div class="message">今日机器人总会话量</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="top3_box_content">
              <div class="inner_content ">
                <div class="strong">{{not_i_data.今日机器人服务数据趋势.今日机器人解决量||0}}</div>
                <div class="message">今日机器人解决量</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="top3_box_content">
              <div class="inner_content ">
                <div class="strong">
                  {{ (not_i_data.今日机器人服务数据趋势.今日机器人解决率*100).toAccuracy(2)+'%'||0}}
                </div>
                <div class="message">今日机器人解决率</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12">
        <div class="part">
          <div class="large_canvas">
            <chart :options="今日机器人服务数据趋势_option" :auto-resize="true"></chart>
          </div>
        </div>
      </div>

      <h1>&nbsp;</h1>
      <div class="clearfix">
        <!--悬浮框-->
        <div class="data-screening">
          <div class="col-md-6 col-lg-3">
            <div class="top3_box_content">
              <div class="inner_content ">
                <div class="strong">{{not_i_data.今日机器人聊天数据趋势.今日访客提问数||0}}</div>
                <div class="message">今日访客提问数</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="top3_box_content">
              <div class="inner_content ">
                <div class="strong">{{not_i_data.今日机器人聊天数据趋势.今日匹配提问数||0}}</div>
                <div class="message">今日匹配提问数</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="top3_box_content">
              <div class="inner_content ">
                <div class="strong">
                  {{ (not_i_data.今日机器人聊天数据趋势.今日匹配率*100).toAccuracy(2)+'%'||0}}
                </div>
                <div class="message">今日匹配率</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12">
        <div class="part">
          <div class="large_canvas">
            <chart :options="今日机器人服务数据趋势_option02" :auto-resize="true"></chart>
          </div>
        </div>
      </div>
    </div>


    <div class=" kf_table clearfix ">
      <h2 class="page_title noBorder">今日客服活动&nbsp;<word-explain keys="首页-今日客服活动"></word-explain>
      </h2>
      <div class="table_wrap padding_px ">
        <table class="table3 ">
          <thead >

          <tr class="table3_head_rw">
            <th>客服</th>
            <th>在线状态</th>
            <th>当前接待量</th>
            <th>累计接待量</th>
            <th>相对满意度</th>
            <th>首次在线时间</th>
            <th>最后离线时间</th>
            <th>累计在线时长</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="kf in kfs" role="超级">
            <td>
              <img
                v-if="kfs_info[kf.id] && ($store.state.global.enums.user_role[kfs_info[kf.id].role].weight == 3 || $store.state.global.enums.user_role[kfs_info[kf.id].role].weight == 0)"
                src="../assets/img/super_icon.png"/>
              <img v-if="kfs_info[kf.id] && $store.state.global.enums.user_role[kfs_info[kf.id].role].weight == 2"
                   src="../assets/img/admin_icon.png"/>
              <img v-if="kfs_info[kf.id] && $store.state.global.enums.user_role[kfs_info[kf.id].role].weight == 1"
                   src="../assets/img/user2_icon.png"/>
              &nbsp;<span
              :class="{super_user:kfs_info[kf.id] && ($store.state.global.enums.user_role[kfs_info[kf.id].role].weight == 3 || $store.state.global.enums.user_role[kfs_info[kf.id].role].weight == 0)}">
              {{kfs_info[kf.id]?kfs_info[kf.id].username : '--'}}
            </span>
            </td>
            <td><i :style="{ 'color': kfs_info[kf.id]?kfs_info[kf.id].color:'#ADB4BA' }"
                   class="fa fa-circle" ></i>&nbsp;
              {{kfs_info[kf.id]?kfs_info[kf.id].label : '离线'}}
            </td>
            <td>{{kf.当前接待量 || '--'}}</td>
            <td>{{kf.累计接待量 || '--'}}</td>
            <td>
              <template v-if="kf.相对满意度===undefined || kf.相对满意度 === null || kf.相对满意度===''
||kf.相对满意度==='--' ">--</template>
              <template v-else>{{(kf.相对满意度*100).toAccuracy(2)}}%</template>
            </td>
            <td>{{kf.首次在线时间 ? $api.dateFormat('hh:mm:ss',kf.首次在线时间) : '--'}}</td>
            <td>{{kf.最后离线时间 ? $api.dateFormat('hh:mm:ss',kf.最后离线时间) : '--'}}</td>
            <td>{{$api.MillisecondToDate((kf.累计在线时长 || 0)*1000)}}</td>
          </tr>
          <!--<tr v-for="kf in kfs" >
              <td>{{kfs_info[kf.id]?kfs_info[kf.id].username : '--'}}</td>
              <td>{{kf.客服在线情况=='1'? '在线':'离线'}}</td>
              <td>{{kf.当前接待量 || '--'}}</td>
              <td>{{kf.累计接待量 || '--'}}</td>
              <td>
                  <template v-if="kf.相对满意度===undefined || kf.相对满意度 == null || kf.相对满意度==''">--</template>
                  <template v-else>{{(kf.相对满意度*100).toAccuracy(2)}}%</template>
              </td>
              <td>{{kf.首次在线时间 ? $api.dateFormat('hh:mm:ss',kf.首次在线时间) : '--'}}</td>
              <td>{{kf.最后离线时间 ? $api.dateFormat('hh:mm:ss',kf.最后离线时间) : '--'}}</td>
              <td>{{$api.MillisecondToDate((kf.累计在线时长 || 0)*1000)}}</td>
            </tr>-->
          </tbody>
        </table>
      </div>
    </div>
    <br/><br/>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  import echarts from 'echarts'
  import china from './module/china.js'
  import ECharts from './module/ECharts.vue'
  import 图表 from './mixin/图表.js'

  export default {
    mixins: [图表],
    data() {
      return {
        i_data_test:{
          今日相对满意度:'--',
        },


        i_data: {
          正在咨询人数:0,
          当前在线客服:0,
          今日总会话时长:0,
          今日平均会话时长:0,


          今日总会话量:0,
          机器人解决量:0,
          今日相对满意度:0,
          参评率:0,
          今日客服服务数据趋势:0,
          今日客服服务数据趋势:0,
          今日机器人服务数据趋势:{
            今日机器人总会话量:0,
            今日机器人解决量:0,
            今日机器人解决率:0,
          },
          今日机器人聊天数据趋势:{
            今日访客提问数:0,
            今日匹配提问数:0,
            今日匹配率:0,
          },
          今日总会话量:0,
          今日总会话量:0,

        },
        not_i_data: {
          今日客服服务数据趋势:{
            今日客服服务总会话量:0,
            今日客服总接待量:0,
          },
          今日机器人服务数据趋势:{
            今日机器人解决量:0,
            今日机器人解决率:0,
          },
          今日机器人聊天数据趋势:{
            今日访客提问数:0,
            今日匹配提问数:0,
            今日匹配率:0,
          },

        },
        默认省份: ['广东', '香港', '台湾', '海南', '福建'],
        kfs: '',
        kfs_info: '',
        首页非实时报表数据: {
          "今日客服服务数据趋势": {
            "趋势": [
              {
                "时间": "2018-01-22 00:00:00",
                "客服会话量": 20,
                "客服接待量": 60,
                "在线客服人数": 10,
              },
              {
                "时间": "2018-01-22 01:00:00",
                "客服会话量": 20,
                "客服接待量": 60,
                "在线客服人数": 10,
              },
              {
                "时间": "2018-01-22 02:00:00",  // 列到当前时间为止
                "客服会话量": 20,
                "客服接待量": 60,
                "在线客服人数": 10,
              },
            ]
          },
          "今日机器人服务数据趋势": {
            "今日机器人总会话量": 30,
            "今日机器人解决量": 27,
            "今日机器人解决率": 0.90,
            "趋势": [
              {
                "时间": "2018-01-22 00:00:00",
                "机器人会话量": 10,
                "机器人解决量": 9,
              },
              {
                "时间": "2018-01-22 01:00:00",
                "机器人会话量": 10,
                "机器人解决量": 9,
              },
              {
                "时间": "2018-01-22 02:00:00",  // 列到当前时间为止
                "机器人会话量": 10,
                "机器人解决量": 9,
              },
            ]
          },
          "今日机器人聊天数据趋势": {
            "今日访客提问数": 200,
            "今日匹配提问数": 160,
            "今日匹配率": 0.80,
            "趋势": [
              {
                "时间": "2018-01-22 00:00:00",
                "访客提问数": 50,
                "匹配提问数": 40,
              },
              {
                "时间": "2018-01-22 01:00:00",
                "访客提问数": 70,
                "匹配提问数": 50,
              },
              {
                "时间": "2018-01-22 02:00:00",  // 列到当前时间为止
                "访客提问数": 80,
                "匹配提问数": 70,
              },
            ]
          }
        },
        访客来源_colors: [
          '#f00000',
          '#f94949',
          '#ff8e87',
          '#ffc5c7',
          '#ffd8de',
          '#ffebef',
        ],
        访客来源_option:{
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              if (params.value) {
                return params.name + "<br/>" + "访问量：" + params.value ;
              }
              else {
                return  params.name + "<br/>" + "访问量：" + '0'
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#f7f6f6',
              borderColor: '#a1b9d2',
              opacity: 0.5,
            },
            emphasis: {
              areaColor: '#ccdbeb'
            }
          },
          series: [
            {
              // name: "来源",
              type: "map",
              mapType: "china",
              zoom: 1.2,
              "selectedMode": false,
              "itemStyle": {
                "normal": {

                  "borderWidth": 0.8,
                  "borderColor": "#cbc6c6",
                  "label": {
                    "show": true
                  }
                },
                "emphasis": {
                  "areaColor": "#d9d5d7",
                  "label": {
                    "show": true
                  }
                }
              },
              "label": {
                "normal": {
                  "show": false
                },
                "emphasis": {
                  "show": false
                }
              },
              "data": [],
            }
          ]
        },
        访客来源Top5_option: {
          title: {
            text: '访客来源Top5',
            left: 'left',
            textStyle: {
              fontSize: 14,
              fontWeight: '500',
            }
          },
          grid: {
            left: 100,
            right: 100,
            top: 35,
            bottom: 20,
            backgroundColor: 'rgb(0,0,0)',
            borderColor: '#fff',
          },
          xAxis: {
            show: false,
            type: 'value',
            min: 0,
            axisLabel: {
              formatter: '{value}'
            }
          },
          yAxis: [
            {
              type: 'category',
              inverse: true,
              data: [
                {
                  value: ['{a|}', ''].join('  '),
                  textStyle: {
                    width: 88,
                    rich: {
                      a: {
                        fontSize: 20,
                        align: 'left',
                        backgroundColor: {
                          image: '/static/image/1.png',
                        },
                      }
                    }
                  }
                },
                {
                  value: ['{a|}', ''].join('  '),
                  textStyle: {
                    width: 88,
                    rich: {
                      a: {
                        fontSize: 20,
                        align: 'left',
                        backgroundColor: {
                          image: '/static/image/2.png',
                        },
                      }
                    }
                  }
                },
                {
                  value: ['{a|}', ''].join('  '),
                  textStyle: {
                    width: 88,
                    rich: {
                      a: {
                        fontSize: 20,
                        align: 'left',
                        backgroundColor: {
                          image: '/static/image/3.png',
                        },
                      }
                    }
                  }
                },
                {
                  value: ['{a|}', ''].join('  '),
                  textStyle: {
                    width: 88,
                    rich: {
                      a: {
                        fontSize: 20,
                        align: 'left',
                        backgroundColor: {
                          image: '/static/image/4.png',
                        },
                      }
                    }
                  }
                },
                {
                  value: ['{a|}', ''].join('  '),
                  textStyle: {
                    width: 88,
                    rich: {
                      a: {
                        fontSize: 20,
                        align: 'left',
                        backgroundColor: {
                          image: '/static/image/5.png',
                        },
                      }
                    }
                  }
                },
              ],
              axisLine: {show: false},
              axisTick: {show: false},
              splitLine: {show: false},
              axisLabel: {
                fontSize: '14',
                color: '#7b939f',
              },
            },
            {
              type: 'category',
              data: [0, 0, 0, 0, 0],
              inverse: true,
              axisLine: {show: false},
              axisTick: {show: false},
              splitLine: {show: false},
              axisLabel: {
                width: 300,
                fontSize: '14',
                color: '#7b939f',
              },
            }
          ],
          series: [
            {
              name: '',
              type: 'bar',
              barWidth: 6,
              itemStyle: {
                normal: {
                  barBorderRadius: 8,
                },
              },
              data: [0, 0, 0, 0, 0],
            }
          ],
          color:[]
        },
        今日客服服务数据趋势_option: {},
        今日机器人服务数据趋势_option: {},
        今日机器人服务数据趋势_option02: {},

      }
    },
    created() {
          this.$source.kfs().then(data => {
        this.kfs_info = data
      })
      this.init图配置()
      this.search()
      //this.getoneData();
    },
    mounted() {
    },
    computed: {
      ...mapGetters(['getUser']),
    },
    methods: {
      search() {
        let v = this

        function getCid(cid = 1) {
          var cid
          return cid
        }

        v.$api.ajax('/statistic/first_page/immediate', 'get', {cid: getCid()}).then(data => {
          v.i_data = data

          let 访客分布 = []
          //造数据
          // data.访客分布 = {
          //   广东: 100,
          //   宁夏: 100,
          //   内蒙古: 81,
          //   四川: 81,
          //   新疆:21,
          //   江苏:19,
          //   安徽:19,
          // }
          if (data.访客分布 instanceof Array) {
            let 省份 = v.默认省份.concat(object.keys(data.访客分布))
            //去重
            省份 = [...new Set(省份)]
            省份.forEach(val => {
              let obj = {name: val, value: data.访客分布[val] || 0}
              访客分布.push(obj)
            })
          } else {
            v.默认省份.forEach(val => {
              if (!data.访客分布[val]) {
                let obj = {name: val, value: 0}
                访客分布.push(obj)
              }
            })
            for (let k in data.访客分布) {
              let obj = {name: k, value: data.访客分布[k]}
              访客分布.push(obj)
            }
          }

          //排序
          访客分布.sort((a, b) => b.value - a.value)

          //颜色
          v.访客来源Top5_option.series[0].itemStyle.normal.color

          var top5Col = [
            '#fb8282',
            '#fd9a9a',
            '#fdb4b4',
            '#fcc8c8',
            '#ffdcdc']

          var 访客分布02 = this.$api.deepCopy(访客分布)
          var top5data = 访客分布02.splice(0,5,0)

          var dataArr=[[],[],[],[],[]]

          var maxNum = top5data[0].value
          top5data.forEach(item=>{
            var pecentage = (item.value)/maxNum
            if(pecentage<=1&&pecentage>0.8){
              dataArr[0].push(item)
            }
            if(pecentage<=0.8&&pecentage>0.6){
              dataArr[1].push(item)
            }
            if(pecentage<=0.6&&pecentage>0.4){
              dataArr[2].push(item)
            }
            if(pecentage<=0.4&&pecentage>0.2){
              dataArr[3].push(item)
            }
            if(pecentage<=0.2&&pecentage>0){
              dataArr[4].push(item)
            }
          })

          var top5FinalCol = []

          dataArr.forEach((item,i)=>{
            for(var j=0;j<dataArr[i].length;j++){
              top5FinalCol.push(top5Col[i])
            }
          })
          top5FinalCol.forEach(item=>{
            v.访客来源Top5_option.color.push(item)
          })

          v.访客来源Top5_option.color=
            [
              '#fb8282',
              '#fd9a9a',
              '#fdb4b4',
              '#fcc8c8',
              '#ffdcdc']

// 配色方案


          //赋值
          for (let i = 0; i < 5; i++) {
            let val = 访客分布[i]
            v.访客来源Top5_option.yAxis[0].data[i].value += val.name
            v.访客来源Top5_option.yAxis[1].data[i] = val.value + ' 人'
            v.访客来源Top5_option.series[0].data[i] = val.value
          }


          let 访客分布2 = [];
          for (let name in data.访客分布) {
            访客分布2.push({value: data.访客分布[name], name: name});
          }
          //排序
          访客分布2.sort((a, b) => {
            return b.value - a.value
          });
          访客分布2.forEach( (val,i)=>{
            let color = v.访客来源_colors[i]|| v.访客来源_colors[v.访客来源_colors.length-1];
              val.itemStyle = {
                normal:{
                  color: [],
                  label: {
                    show: true,
                  }
                }
              }

          })
          let fColors= [
            '#f00000',
            '#f94949',
            '#ff8e87',
            '#ffc5c7',
            '#ffd8de',
            '#ffebef',
          ]

          if(访客分布2[0]){
            let maxVal =  访客分布2[0].value
            访客分布2.forEach(item=>{
              let pecentage = (item.value)/maxVal
              if(pecentage<=1&&pecentage>0.8){
                item.itemStyle.normal.color = '#f00000'
              }
              if(pecentage<=0.8&&pecentage>0.6){
                item.itemStyle.normal.color = '#f94949'
              }
              if(pecentage<=0.6&&pecentage>0.4){
                item.itemStyle.normal.color = '#ff8e87'
              }
              if(pecentage<=0.4&&pecentage>0.2){
                item.itemStyle.normal.color = '#ffc5c7'
              }
              if(pecentage<=0.2&&pecentage>0){
                item.itemStyle.normal.color = '#ffd8de'
              }
            })

            v.访客来源_option.series[0].data = 访客分布2
          }

          v.kfs = data.今日客服活动

          // 造数据测试
          // v.kfs[0].相对满意度='--'

        })
        v.$api.ajax('/statistic/first_page/not_immediate', 'get', {cid: getCid()}).then(function (data) {
          v.not_i_data = data

          v.清除数据痕迹()
          //反其道而行之
          //数据列表转对象
          let 今日客服服务数据趋势 = {},
            今日机器人服务数据趋势 = {},
            今日机器人聊天数据趋势 = {}
          data.今日客服服务数据趋势.趋势.forEach(val => {
            let time = v.$api.dateFormat('hh:00', (new Date(val.时间).getTime() + 300 * 1000))
            time = time == '00:00' ? '24:00' : time
            今日客服服务数据趋势[time] = val
          })
          data.今日机器人服务数据趋势.趋势.forEach(val => {
            let time = v.$api.dateFormat('hh:00', (new Date(val.时间).getTime() + 300 * 1000))
            time = time == '00:00' ? '24:00' : time
            今日机器人服务数据趋势[time] = val
          })
          data.今日机器人聊天数据趋势.趋势.forEach(val => {
            let time = v.$api.dateFormat('hh:00', (new Date(val.时间).getTime() + 300 * 1000))
            time = time == '00:00' ? '24:00' : time
            今日机器人聊天数据趋势[time] = val
          })
          v.今日客服服务数据趋势_option.xAxis.data.forEach((val, i) => {
            if (!今日客服服务数据趋势[val]) {
              return false
            }
            v.今日客服服务数据趋势_option.series[0].data[i] = 今日客服服务数据趋势[val].客服会话量
            v.今日客服服务数据趋势_option.series[1].data[i] = 今日客服服务数据趋势[val].客服接待量
            // v.今日客服服务数据趋势_option.series[2].data[i] = 今日客服服务数据趋势[val].在线客服人数;
          })
          v.今日机器人服务数据趋势_option.xAxis.data.forEach((val, i) => {
            if (!今日机器人服务数据趋势[val]) {
              return false
            }
            v.今日机器人服务数据趋势_option.series[0].data[i] = 今日机器人服务数据趋势[val].机器人会话量
            v.今日机器人服务数据趋势_option.series[1].data[i] = 今日机器人服务数据趋势[val].机器人解决量
            v.今日机器人服务数据趋势_option.series[2].data[i] = (今日机器人服务数据趋势[val].机器人解决率 * 100).toAccuracy(2) + '%'
          })
          v.今日机器人服务数据趋势_option02.xAxis.data.forEach((val, i) => {
            if (!今日机器人聊天数据趋势[val]) {
              return false
            }
            v.今日机器人服务数据趋势_option02.series[0].data[i] = 今日机器人聊天数据趋势[val].访客提问数
            v.今日机器人服务数据趋势_option02.series[1].data[i] = 今日机器人聊天数据趋势[val].匹配提问数
            v.今日机器人服务数据趋势_option02.series[2].data[i] = (今日机器人聊天数据趋势[val].匹配率 * 100).toAccuracy(2) + '%'
          })
        })
      },
      setLinearGradient(arr, a = 0, b = 0, c = 0, d = 1) {
        var setter = []
        for (var i = 0; i < arr.length; i++) {
          setter.push({offset: arr[i][0], color: '#' + arr[i][1]})
        }
        var color = new echart.graphic.LinearGradient(a, b, c, d, setter)
        return color
      },
      init图配置() {
        let v = this
        let legend1 = ['客服会话量', '客服接待量']
        // let legend1 = ['客服会话量', '客服接待量', '在线客服总人数'];
        let options1 = {
          legend: legend1,
          series_names: legend1,
          colors: ['#FFA6A6', '#FFC063', '#f39262'],
          series_types: ['line', 'line', 'bar'],
        }
        v.今日客服服务数据趋势_option = v.fn_mixin获取折线和柱状图配置(options1)
        let options2 = {
          legend: ['机器人会话量', '机器人解决量'],
          series_names: ['机器人会话量', '机器人解决量', '机器人解决率'],
          colors: ['#7fb8f3', '#afe699', 'none'],
          series_types: ['bar', 'bar', 'custom'],
        }
        v.今日机器人服务数据趋势_option = v.fn_mixin获取折线和柱状图配置(options2)
        let options3 = {
          legend: ['访客提问数', '匹配提问数'],
          series_names: ['访客提问数', '匹配提问数', '匹配率'],
          colors: ['#ffae21', '#bbe0f9', 'none'],
          series_types: ['bar', 'bar', 'custom'],
        }
        v.今日机器人服务数据趋势_option02 = v.fn_mixin获取折线和柱状图配置(options3)
      },
      清除数据痕迹() {
        let v = this
        let 图标1 = ['今日客服服务数据趋势_option', '今日机器人服务数据趋势_option', '今日机器人服务数据趋势_option02']
        let start_h = '00:00'
        let end_h = '24:00'
        图标1.forEach(val => {
          v[val].xAxis.data = []
          let time = 0
          do {
            time++
            v[val].xAxis.data.push(time > 9 ? time + ':00' : '0' + time + ':00')
          } while (time < 24)
          let now_h = v.$api.dateFormat('h')
          let arr = new Array(now_h - 1 + 2)
          v[val].series.forEach(val2 => {
            val2.data = arr.join('0,').split(',')
          })
        })
      },
    },
    components: {
      mapGetters,
      'chart': ECharts,
    }
  }
</script>
<style lang="scss" scoped>
  @import "../assets/scss/color.scss";

  $color_1: #fff;
  $color_2: #efefef;
  $解决率color1: #8bd5f8;
  $解决率color2: #ffb74d;
  .home {
    background: #ffffff;

    .main {

      overflow: hidden;
      /*.box {
                h2{font-size:17px; line-height:50px;border-bottom:1px solid $color_1; margin-bottom:20px;}
                .box_info {
                    display: inline-block;
                    width:100%;
                    background: #fff;
                    margin-bottom:15px;
                    p{background:#f9f9f9;}
                }

            }*/
      .resolve-rate {
        margin-left: 20px;
        width: calc(25% - 20px);

        h4 {
          line-height: 70px;
          font-size: 15px;
        }
        p {
          width: 50%;
          margin: auto;
          font-size: 45px;
          line-height: 80px;
          text-align: center;
        }
        .human {
          i {
            color: #f47171;
          }
          & + p {
            color: #f47171;
            border-bottom: 1px solid $color_2;
          }
        }
        .robot {
          i {
            color: #2b94ff;
          }
          & + p {
            color: #2b94ff;
          }
        }
      }
    }
    .mainCon {
      background: $color_1;

      .row-title {
        line-height: 28px;
        margin: 14px 0;
        border-left: 4px solid #0f86ff;
        padding-left: 12px;
        color: #000;
        font-weight: 100;
      }
      overflow: hidden;
    }

  }

  .robot, .human {
    padding: 10px 20px;
    color: #7b939f;
    max-width: 380px;
    margin: 0 auto;
    span {
      color: $wrapColor;
    }
    .ivu-icon-arrow-up-a {
      color: #ff5050;
    }
    .ivu-icon-arrow-down-a {
      color: #34d659;
    }
  }

  .robot {
    .fa-circle {
      color: $解决率color1;
    }
  }

  .human {
    .fa-circle {
      color: $解决率color2;
    }
  }

  .kf_table {
    table {
      padding: 10px 0;
      td {
        color: #7b939f;
      }
      img {
        position: relative;
        top: -2px;
      }
      .super_user {
        color: #f4a40a;
      }
      .fa-circle {
        font-size: 8px;
        color: #d0d0d0;
      }
      .online {
        color: #41db3d;
      }
    }
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

  .large_canvas {
    width: 100%;
    height: 300px;
  }

  .right_corner {
    text-align: right;
    margin-top: 15px;
  }

  .right_corner_color1 {
    color: #53AD66;
    position: relative;
    top: 8px;
  }

  .right_corner_color2 {
    color: #E1972C;
    position: relative;
    top: 8px;
  }

  .right_corner_color3 {
    color: #DB5E5F;
    position: relative;
    top: 8px;
  }

  .right_corner_color4 {
    color: #5DAED6;
    position: relative;
    top: 8px;
  }

  .col-xs-12 {
    padding: 0
  }

  .col-xs-3 {
    padding: 0
  }

  .no_padding_margin {
    padding: 0
  }

  .top5 {
    margin-top: 100px !important;
  }

  .top5_number {
    margin-top: 162px;
    position: relative;
    left: 7%;
  }

  .single_top5_number {

  }

  .single_top5_2 {
    margin-top: 30px
  }

  .single_top5_3 {
    margin-top: 30px
  }

  .single_top5_4 {
    margin-top: 29px;
  }

  .single_top5_5 {
    margin-top: 35px;
  }

  .top5_number_detail {
    margin-top: 165px;
  }

  .top5_number_detail_2 {
    margin-top: 30px
  }

  .top5_number_detail_3 {
    margin-top: 30px
  }

  .top5_number_detail_4 {
    margin-top: 29px
  }

  .top5_number_detail_5 {
    margin-top: 32px
  }

  .table_wrap {
    padding: 10px;
  }

  .text {
    position: relative;
    top: 5px
  }

  .part {

  }

  .position_left {
    position: relative;
    left: -15px;
  }

  .padding_px{
    padding: 0px;
  }

  .table3_head_rw{
    border: 1px solid #d6e4eb;
  }

  .img_special_handle_1200px_02{
    /*position: relative!important;*/
    /*right: 10px!important;*/
    margin-left: 8px;
    margin-bottom: 3px;
    margin-right: 5px;
    padding-left: 5px
  }

  .special_handle_1200px_03{
    margin-left: 10px;
    margin-right: 8px;
    padding-left: 5px
  }

  .special_handle_1200px_04{
    margin-bottom: 10px;
  }

  .text_1200px_02{
    right:15px
  }

  /*.text_1200px_03{*/
    /*right:10px*/
  /*}*/

  .outDiv01{

    border-radius: 15px;
    height:144px;
    margin-top: 30px;
    width: 100%;
  }

  .outDiv02{
    width: 85%;
    margin: 40px auto 10px
  }

  .topColor01 {
    border: #86da99 1px solid;
    background: #86da99;
    box-shadow: 2px 2px 22px 1px
    #86da99;
  }

  .topColor02 {
    border: #f9c068 1px solid;
    background: #f9c068;
     box-shadow: 2px 2px 22px 1px
    #f9c068;
  }

  .topColor03 {
    border: #fb8282 1px solid;
    background: #fb8282;
     box-shadow: 2px 2px 22px 1px
    #fb8282;
  }

  .topColor04 {
    border: #8bd5f8 1px solid;
    background: #8bd5f8;
     box-shadow: 2px 2px 22px 1px
    #8bd5f8;
  }

  .top{
    height:76px;
  }

  .num{
    color: white;
    font-size: 25px;
    font-weight: 100;
  }

  .text01{
    color: white;
    font-size: 13px;
    font-weight: 100;
  }

  .bottom{
    float: right;
    font-size: 13px;
  }

  .bottomCol01 {
    color: #53ad66;
  }

  .bottomCol02 {
    color: #e1972c;
  }

  .bottomCol03 {
    color: #db5e5f;
  }

  .bottomCol04 {
    color: #5daed6;
  }

  .img_div{
    margin-right: 12px;
    float: left;
    width: 30%;
  }

  .img_div_04{
    float: left;
    width: 30%;
    margin-right: 4px;
  }

  .text{
    padding-left: 1px
  }

  .num{
    line-height: 28px;
    font-size: 26px;
  }


</style>
