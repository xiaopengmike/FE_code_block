<template>
	<div class="__recommend-answers">
		<el-popover ref="popover1" placement="right" trigger="click" popper-class="white html" v-model="show">
			<div class="popover_recommend-answers">
				<header>机器人回答</header>
				<section>
					<div v-if="!list" class="loading">
						<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
					</div>
					<div v-if="list.length==0" class="loading font15">
						无推荐答案
					</div>
					<div  v-if="list.length>0" v-for="(l,i) in list" class="qa" :class="{unRecommend:l.score<0.7}">
						<div class="q"    :id="l.id">
							<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
								<div slot="content" class="qa_detail">
									<div class="q">问题：{{l.question}}</div>
									<div class="a">{{l.answer}}</div>
								</div>
								<div class="tragger_q">
									<p>{{i+1}}:{{l.question}}</p>
								</div>
							</el-tooltip>
							<a class="read pointer" @click="read(l.id)" v-if="l.status">查看知识点</a>
							&emsp;<a class="submit pointer" @click="pushStore(l)">推送答案</a>
						</div>
						<div class="a_wrap">
							<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
								<div slot="content" class="qa_detail">
									<div class="q">问题：{{l.question}}</div>
									<div class="a">{{l.answer}}</div>
								</div>
								<div class="a">{{l.answer}}</div>
							</el-tooltip>
						</div>
					</div>
				</section>
			</div>

		</el-popover>
		<i v-popover:popover1 class="fa fa-info-circle" aria-hidden="true" @click="getData" placement="top"></i>
	</div>
</template>

<script>
	export default {
		props:['question'],
		data(){
			return {
				list:false,
				show:false,
			}
		},
		created(){

		},
		methods:{
			getData(){  
				let v = this;
				if(!v.list){
					v.$api.ajaxNoLoading(v.$uri.知识点.list,'get',{question:v.question})
					.then(data=>{	         
						v.show = false;
						data.forEach(val=>{
							try{
								val.rich_answer = JSON.parse(val.rich_answer);
							}catch(err){
								
							}
						})
						setTimeout(()=>{
							v.list = data;
							v.show = true;
						},300)
					}).catch(err=>{
						v.show = false;
					})

				}
			},
			pushStore(s){     console.log(s)
				if(s.answer&&(!s.rich_answer||s.rich_answer.length==0)){
					this.pushAnswer(s.answer)
				}
				if(s.rich_answer&&s.rich_answer.length!=0){
					let tests = s.rich_answer.filter(val=>val.type=='text');
					let no_tests  = s.rich_answer.filter(val=>val.type!='text');
					if(no_tests.length==0){
						this.pushAnswer(tests.map(val=>val.text).join('$$'));
					}else{
						this.pushRichAnswer(s.rich_answer);
					}
				}
			},
			pushAnswer(answer){
				this.$emit('pushAnswer',answer,'text');
			},
			pushRichAnswer(data){
				this.$emit('pushAnswer',data,'rich_answer');
			},
			read(id){   console.log(id)
				this.$emit('searchKnow',id);
				this.show = false;
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

	  .answer_field{
	    height: auto!important;
	  }
	  .qa .a{
	    height: auto;
	  }
	.__recommend-answers{
		i {color:#ccc; cursor:pointer;}
	}
	.popover_recommend-answers {
		max-height:calc(100vh - 60px);
		overflow-y:auto;
		max-width:400px;
		min-width:300px;
		header {color:#ccc; font-size:12px;;}
		.loading{font-size:8px; line-height:50px; text-align:center;}
		.qa{
			.q {
				p {max-width:calc(100% - 140px);}
				.read {position:absolute; top:0; right:70px;}
			}
			&:last-child {
				.a {border:none; }
			}
			&.unRecommend{
				.q p,.a{
				opacity: 0.5;}
			}
		}
	}
</style>
