<template>
	<div class="report_server_main">
		<div v-if="$store.state.global.path !== '/report2/worksheet/workloadDetail'">
			<h1 class="page_title">工单&nbsp;
	      		<!--<button class="my-btn my-btn-info-o pull-right font14 marg_l_10"><i class="fa fa-sign-out"></i>导出报表</button>-->
	        	<my-date-picker class="pull-right search_time" v-model="time_frame" :max-time="Date.now()-24*3600*1000" option-index="1" type="daterange"></my-date-picker>
			</h1>
			<h1 class="page_title noBorder">工单数据总览&nbsp;<wordExplain keys="工作报表-工单-工单数据总览"></wordExplain></h1>

			<div class="data-screening">
				<div class="col-md-6 col-lg-3">
					<div class="top3_box_content">
						<div class="inner_content ">
							<div class="strong">{{someData.新建工单量||0}}</div>
							<div class="message">新建工单量</div>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="top3_box_content">
						<div class="inner_content ">
							<div class="strong">{{someData.当前已解决工单量||0}}</div>
							<div class="message">当前已解决工单量</div>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="top3_box_content">
						<div class="inner_content ">
							<div class="strong">{{(someData.工单解决率*100).toAccuracy(2)+'%'||0}}</div>
							<div class="message">工单解决率</div>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-3">
					<div class="top3_box_content">
						<div class="inner_content ">
							<div class="strong">
                {{$api.MillisecondToDate(someData.平均解决时长*1000)||0}}
              </div>
							<div class="message">平均解决时长</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<thirdNav :primaryNav="'工作报表'" :subNav="'工单'" v-show="$store.state.global.path.indexOf('workloadDetail')==-1"></thirdNav><br />
		<router-view :time_frame="time_frame" @changeData="changeData"></router-view>
	</div>
</template>

<script>
	import thirdNav from '../../module/thirdNav'
	export default {
		props:{},
		data(){
			return {
				someData:{
					新建工单量: 0,
					当前已解决工单量: 0,
					工单解决率: 0,
					平均解决时长: 0,
				},
				time_frame:[Date.now() - 7*3600 * 24*1000,Date.now() - 3600 * 24*1000],
				paths:[],
			}
		},


		created(){
			this.handlerPaths();
		},
		computed:{
			path(){
				return this.$store.state.global.path;
			},
		},
		methods:{
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
			},
			changeData(data){
				for(let i in this.someData){
					if(this.someData.hasOwnProperty(i)){
						this.someData[i] = data[i]||0;
					}
				}
			},
		},
		components:{
			thirdNav,
		},
		watch:{
			path(){
				this.handlerPaths();

			},
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

</style>
