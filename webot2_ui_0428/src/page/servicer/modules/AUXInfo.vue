<template>
	<div class="AUXinfo">
		<h5 class="title">CRM/ERP</h5>
		<section class="info">
			<Row>
				<Col span="10">用户名：</Col>
				<Col span="14">{{CE.nickname}}</Col>
			</Row>
			<Row>
				<Col span="10">手机号：</Col>
				<Col span="14">{{CE.mobile}}</Col>
			</Row>
			<Row>
				<Col span="10">地址：</Col>
				<Col span="14">{{CE.address}}</Col>
			</Row>
			<Row>
				<Col span="10">浏览轨迹：</Col>
				<Col span="14">{{CE.historys}}</Col>
			</Row>
			<Row>
				<Col span="10">订单号：</Col>
				<Col span="14">{{CE.order_id}}</Col>
			</Row>
			<Row>
				<Col span="10">下单时间：</Col>
				<Col span="14">{{CE.order_time}}</Col>
			</Row>
			<Row>
				<Col span="10">物流单号：</Col>
				<Col span="14">{{CE.logistics_id}}</Col>
			</Row>
		</section>
		<h5 class="title">用户可能想问:</h5>
		<div v-for="(l,i) in list" class="qa" >
			<div class="q">
				<el-tooltip trigger="hover"  popper-class="black html"  :open-delay="400">
					<div slot="content" class="qa_detail">
						<div class="q">{{l.question}}</div>
						<div class="a">{{l.answer}}</div>
					</div>
					<div class="tragger_q">
						<span class="index">{{i+1}}:</span>
						<p>{{l.question}}</p>
					</div>
				</el-tooltip>
				<a class="submit pointer" @click="pushAnswer(l.answer)">推送答案</a>
			</div>	
			<div class="a_wrap">
				<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
					<div slot="content" class="qa_detail">
						<div class="q">{{l.question}}</div>
						<div class="a">{{l.answer}}</div>
					</div>
					<div class="a">{{l.answer}}</div>
				</el-tooltip>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:['info'],
		data(){
			return {
				CE:{
					nickname:'何先生',
			          mobile:'18765677889',
			          address:'广东省深圳市滨海大道',
			          historys:'www.webot.ai',
			          order_id:'165326598754',
			          order_time:'2017.12.21 16:30',
			          logistics_id:'35995654257',
				},
				list:[],
				page:{
					start_time:new Date().setHours(0,0,0,0)/1000-3600*24*30,
					end_time:Date.now()/1000,
					page:1,
					size:5,
				},
			}
		},
		created(){
			this.searchs();
		},
		methods:{
			pushAnswer(answer){     
				this.$emit('pushAnswer',answer,'text');
			},
			searchs(){
				let v = this;
				v.$api.ajaxNoLoading('/knowledge_point/hot','get',v.page)
				.then(data=>{
					v.list = data;
				})
			}
		},
		components:{
			
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
	@import "./AUXStyle.scss";
	.AUXinfo{
		width:100%;
		.title{
			line-height:50px;
			border-bottom:1px solid #efefef;
		}
		.info {
			padding-bottom:15px;
			padding-top:10px;
			line-height: 25px;
		}
		section{
			padding:0 15px;
		}
	}
	
</style>