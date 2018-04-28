<template>
	<div class="report_server_main">
		<h1 class="page_title" v-if="$store.state.global.path !== '/report2/servicer/workloadDetail'">客服&nbsp;
			<!--<wordExplain keys="工作报表-客服"></wordExplain>-->
            <my-date-picker class="pull-right search_time" v-model="time_frame" :max-time="Date.now()-24*3600*1000" option-index="1" type="daterange"></my-date-picker>
		</h1>

    <!--<div class="data-screening">-->
      <!--<div class="col-md-6 col-lg-3">-->
        <!--<div class="top3_box_content">-->
          <!--<div class="inner_content ">-->
            <!--<div class="strong">100</div>-->
            <!--<div class="message">机器人会话量</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="col-md-6 col-lg-3">-->
        <!--<div class="top3_box_content">-->
          <!--<div class="inner_content ">-->
            <!--<div class="strong">100</div>-->
            <!--<div class="message">机器人会话量</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="col-md-6 col-lg-3">-->
        <!--<div class="top3_box_content">-->
          <!--<div class="inner_content ">-->
            <!--<div class="strong">100</div>-->
            <!--<div class="message">机器人会话量</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->



<div class="clearfix">
  <!--<el-breadcrumb class="paths">-->
    <!--<template  v-for="(p,i) in paths">-->
      <!--<el-breadcrumb-item :to="{ path: p.path }">-->
        <!--{{p.name}}&nbsp;-->
        <!--<word-explain v-if="i==paths.length-1" :keys="[paths[0].name,paths[1].name,paths[2].name].join('-')"></word-explain>-->
      <!--</el-breadcrumb-item>-->
    <!--</template>-->
  <!--</el-breadcrumb>-->
</div>

		<thirdNav :primaryNav="'工作报表'" :subNav="'客服'" v-show="$store.state.global.path.indexOf('workloadDetail')==-1"></thirdNav>
		<router-view :time_frame="time_frame"></router-view>
	</div>
</template>

<script>
	import thirdNav from '../../module/thirdNav'
	export default {
		props:{},
		data(){
			return {
				pickerOptions: {
		          	disabledDate(time) {
		            	return time.getTime() > (Date.now()-24*3600);
		          	}
		       },
				time_frame:[Date.now() - 7*3600 * 24*1000,Date.now() - 3600 * 24*1000],

				paths:[],
			}
		},
		created(){
      this.searchs()
      this.handlerPaths();
		},
		computed:{
			path(){
				return this.$store.state.global.path;
			},
		},
		methods:{
      searchs() {
        var v = this
        let start = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[0])
        let end = v.$api.dateFormat('yyyy-MM-dd', v.time_frame[1])
        let search = {
          cid: 1,
          start: start,
          end: end,
        }

        v.$api.ajax('/statistic/woker_order_kf', 'get', search).then(function (data) {
          v.allData = data
//  
        })

      },


      handlerPaths(){
				setTimeout(()=>{
					if(this.paths.length>0 && this.paths[this.paths.length-1].path==this.$router.history.current.matched[this.$router.history.current.matched.length-1].path){
						this.handlerPaths();
					}else{
						this.paths = [];
						this.$router.history.current.matched.forEach(val=>{
							this.paths.push(val)
						})
					}
				},100)
			}
		},
		components:{
			thirdNav,
		},
		watch:{
			path(){
				this.handlerPaths();
			}
		}
	}
</script>

<style lang="scss">
	.report_server_main {

	}
	.report {position:relative;}

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





</style>
