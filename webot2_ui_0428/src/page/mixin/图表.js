import echarts from 'echarts'
export default {
  data(){
    return {

    }
  },
  methods:{
    fn_mixinTooltipFormatter(params, ticket, callback){
      let result = params[0].axisValue ;
      if(result.indexOf(':')!=-1 ){

        let time01 = result.split('<')[0];
        let temArr=time01.split(':')
        let time02hour = (Number(temArr[0])-1).toString()
        if(time02hour[1] ==undefined){
          time02hour = '0'+time02hour
        }

        let time02 = (time02hour+':'+temArr[1])


        result = time02+' - '+time01
      }

      let percent_reg = /率|比$/;
      params.forEach(val=>{
        result += '<br />';

        /*switch(val.seriesType){
                  case 'line' : result += `<i class="fa fa-line-chart" style="color:${val.color}"></i> `; break;
                  case 'bar' : result += `<i class="fa fa-bar-chart" style="color:${val.color}"></i> `;break;
                  default : result += '<i style="display:inline-block; width:15px; height:10px;"></i> ';break;
              }*/
        result += val.marker;
        result += val.seriesName +':&emsp;' + val.data;
        /*if(percent_reg.test(val.seriesName)){
                  result += (val.data*100).toAccuracy(2)+'%';
              }else{
                  result += val.data;
              }*/
      })
      return result;
    },
    fn_mixin计算折线或柱状图的最大值(value){
      if(value.max<10){
        if(value.max<5)
          return 5;
        else{
          if(Math.ceil(value.max)==9 || Math.ceil(value.max)==8)
            return 10;
          return value.max+1;
        }
      }else{
        let digit = 1,max=value.max;
        while(max>10){
          max /=10;
          digit*=10;
        }
        let val = Math.ceil(value.max/digit)==9?10:Math.ceil(value.max/digit);
        return val*digit;
      }
    },
    fn_mixin初始化折线和柱状图Bytime(options,xAxis,yAxis=0){
      let v = this;
      let long = 0;
      if(xAxis instanceof Array){
        options.xAxis.data = [];
        xAxis.forEach((item,i)=>{
          options.xAxis.data.push(item);
        })
      }else{
        if(xAxis.start&&xAxis.end){
          let start = v.$api.dateFormat('yyyy-MM-dd',xAxis.start);
          let end = v.$api.dateFormat('yyyy-MM-dd',xAxis.end);
          let now = v.$api.dateFormat('yyyy-MM-dd');
          let now_h = v.$api.dateFormat('hh:00',Date.now());
          let start_h = '00:00';
          let end_h = '24:00';
          if(start!==end){
            end = v.$api.dateFormat('yyyy-MM-dd',new Date(end).getTime()+24*3600*1000);
          }
          options.xAxis.data = [];
          if(start==end){
            let time = 0;
            do{
              time++;
              long++;
              options.xAxis.data.push(time>9?time+':00':'0'+time+':00');
            }while(time<24)
          }else{
            let time = start;
            do{
              long++;
              options.xAxis.data.push(time);
              time = v.$api.dateFormat('yyyy-MM-dd',new Date(time).getTime()+24*3600*1000);
            }while(time!==end)
          }
        }
      }
      if(yAxis instanceof Array){
        options.series.forEach((item,j)=>{
          item.data = yAxis[j];
        });
      }else{
        let arr = new Array(long+1);
        options.series.forEach(item=>{
          item.data = arr.join(yAxis+',').split(',');
          item.data.splice(-1);
        });
      }
    },

    fn_mixin初始化饼状图(options,value=0,text){
      if(text instanceof Array){
        text.forEach(item=>{
          options.legend.data.push(item);
        })
      }
      if(options.series[0]){
        options.series[0].data.forEach((val2,i)=>{
          val2.value=value[i]?value[i]:value;
        });
      }
    },
    fn_mixin初始化双向柱状图(options,value=0){
      if(options.series[1]){
        options.series[1].data.forEach((val2,i)=>{
          val2=value[i]?value[i]:value;
        });
      }
    },
    fn_mixin获取折线和柱状图配置(params){
      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          // formatter: "{b}<br/>{a} : {c}% "

          formatter:this.fn_mixinTooltipFormatter,
        },
        legend: {
          bottom:'10',
          textStyle:{
            color:window.color.图表字颜色,
          },
          data:params.legend,
        },
        grid: {
          left: '20',
          right: '10',
          bottom: '60',
          top:'30',
          containLabel: true
        },
        toolbox: {
          show: false,
          top:6,
          right:20,
          feature: {
            magicType: {type: ['line', 'bar']},
          },
        },
        xAxis: {
          type: 'category',
          splitLine:{
            show: true,
            lineStyle:{
              color:window.color.图表轴颜色,
              type:'dashed',
              opacity:0.5,
            }
          },
          axisLine:{
            lineStyle:{
              color:window.color.图表轴颜色,
              type:'solid',
            }
          },
          axisTick:{
            inside:true,
            color:window.color.图表轴颜色,
          },
          axisLabel:{
            color:window.color.图表字颜色,
          },
          data: params.x_names || [],
        },
        yAxis:{
          type: 'value',
          boundaryGap:true,
          minInterval:1,
          min:0,
          max:this.fn_mixin计算折线或柱状图的最大值,
          splitLine:{
            show: true,
            lineStyle:{
              color:window.color.图表轴颜色,
              type:'dashed',
              opacity:0.5,
            }
          },
          axisLine:{
            lineStyle:{
              type:'solid',
              color:window.color.图表轴颜色,
            }
          },
          axisTick:{
            inside:true,
            color:window.color.图表轴颜色,
          },
          axisLabel:{
            color:window.color.图表字颜色,
          },
        },
        series:[]
      };
      if(params.colors){
        options.color = params.colors;
      }
      params.series_names.forEach((val,i)=>{
        let type = typeof params.series_types == 'string' ? params.series_types : params.series_types[i];
        let color = type=='line'?
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: this.$api.hsl2rgb(params.colors[i] , 0.4)
          }, {
            offset: 1,
            color: this.$api.hsl2rgb(params.colors[i] , 0)
          }]) : params.colors[i];
        let s= {
          name:val,
          type: type,
          smooth:true,
          areaStyle:{
            normal:{
              color: color,
            }
          },
          data:[],
        };
        options.series.push(s);
      })
      return options;
    },
    fn_mixin获取双向柱状图配置(ydata1,ydata2,sdata1,sdata2){
      ydata2 = Object.assign([],ydata2);
      sdata2 = Object.assign([],sdata2);
      let options = {
        grid: {
          left:55,
          right:56,
          top:20,
          bottom:20,
          backgroundColor:'rgb(0,0,0)',
          borderColor:'#fff',
        },
        xAxis: {
          show:false,
          type: 'value',
          name: 'Days',
          max:100,
          min:0,
          axisLabel: {
            formatter: '{value}'
          }
        },
        yAxis: [
          {
            type: 'category',
            data: ydata1,
            axisLine:{show:false},
            axisTick:{show:false},
            splitLine:{show:false},
            axisLabel:{color:window.color.图表字颜色,  },
          },
          {
            type: 'category',
            data:  ydata2,
            axisLine:{show:false},
            axisTick:{show:false},
            splitLine:{show:false},
            offset: 45,
            axisLabel:{
              color:window.color.图表字颜色2,
              align: 'right'
            },
          }
        ],
        series:[
          {
            name:'background',
            type:'bar',
            barWidth: 9,
            yAxisIndex:1,
            silent: true,
            itemStyle: {
              normal: {
                color:window.color.小柱状图bar背景,
                barBorderRadius: 8,
              },
              emphasis:{color:window.color.小柱状图bar背景,}
            },
            barGap: '0',
            barCategoryGap: '50%',
            data:sdata1,
          },
          {
            name:'',
            type:'bar',
            barWidth: 8,
            itemStyle:{
              normal:{
                show: true,
                color:window.color.小柱状图bar颜色,
                barBorderRadius: 8,
              },
            },
            data:sdata2,
          }
        ]
      }
      return options;
    },
    fn_mixin获取空心饼状图配置(legend_data,data,show_legend=false){
      let options={
        tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          show:false,
          data: legend_data,
          formatter:function(a){
            return a;
          },
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['23%', '50%'],
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
            data:[

            ],
            itemStyle: {
              emphasis: {
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

          }
        ]
      };
      legend_data.forEach((val,i)=>{
        options.series[0].data.push({
          value:data[i]===undefined?data:data[i],
          name:val,
        })
      })
      return options;
    },
    fn_mixin获取空心饼状图配置02(legend_data,data,show_legend=false){
      let options={
        tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          show:false,
          data: legend_data,
          formatter:function(a){
            return a;
          },
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            center: ['23%', '50%'],
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
            data:[

            ],
            itemStyle: {
              emphasis: {
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

          }
        ]
      };
      legend_data.forEach((val,i)=>{
        options.series[0].data.push({
          value:data[i]===undefined?data:data[i],
          name:val,
        })
      })
      return options;
    },
  },
}
