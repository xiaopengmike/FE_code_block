<template>
	<div class="_dipolar"> 
		<div>
			<div class="wrap">
				<div class="up" :style="'width:'+rate+'%'"></div>
			</div>
			<img class="up_icon" src="../../assets/img/dipolar-icon1.png"  /> 
			<img class="down_icon" src="../../assets/img/dipolar-icon2.png"  />
			<span class="upl label" :style="'left:'+(rate/2)+'%'">{{options.arr[0]}}</span>
			<span class="downl label" :style="'left:'+(rate-1+1+(100-rate)/2)+'%'">{{options.arr[1]}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			options:{
				default:{
					arr:['',''],
					series:{
						data:[0,0]
					}
				}
			}
		},
		data(){
			return {
				rate:0,
			}
		},
		methods:{
			init(){
				this.rate = (this.options.series.data[0]/(Number(this.options.series.data[0])+Number(this.options.series.data[1]))*100).toFixed(2);
			}
		},
		watch:{
			'options':{
				handler(n,o){    console.log(n.series.data)
					this.rate = (n.series.data[0]/(Number(n.series.data[0])+Number(n.series.data[1]))*100).toFixed(2);
				},
				deep:true,
			}
		},
		mounted(){
			this.$nextTick(function(){
				this.init();
			})
		}
		
	}
</script>

<style>
	._dipolar {display:inline-block; max-width:600px;width:100%; height:250px; position:relative;}
	._dipolar  > div {width:calc(100% - 200px); height:30px; margin:0 auto; position:relative; top:100px;}
	._dipolar .wrap {position:absolute; top:12px; width:100%; height:100%;background:#FF7575; border-radius:40px; overflow:hidden; }
	._dipolar .wrap div {transition:all 0.5s ease-in-out 0.3s;}
	._dipolar img {position:absolute; z-index:4;}
	._dipolar .up {background:#5dd8ff; left:0;text-align:left; z-index:4; border-bottom-right-radius:0; border-top-right-radius:0;}

	._dipolar .up_icon {left:-60px;}
	._dipolar .down_icon {right:-60px;}
	._dipolar .label {position:absolute; font-size:14px; color:#000; padding:0;}
	._dipolar .label:after {position:absolute; content:'';display:block; width:1px; height:50px; left:0%; background:#ccc;}
	._dipolar .upl {top:-70px;}
	._dipolar .upl:after {bottom:-60px;}
	._dipolar .downl {bottom:-95px;}
	._dipolar .downl:after {top:-60px;}
</style>