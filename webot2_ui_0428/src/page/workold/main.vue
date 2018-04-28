<template>
	<div class="workold flex flex-2">
		<subnav class="flex-left" type="nav" :width="185">
			<template slot="title">
				工单中心 &emsp;&emsp;&emsp;
				<i class="fa fa-refresh fa-span fa-fw pointer font16" :style="'transform:rotate('+refresh.rotate+'deg)'" @click="refresh.time++"></i>
			</template>
			<template slot="content">
				<ul>
					<template v-if="$store.state.global.mode == 'admin'">
						<li v-for="(o,k) in status_list" @click="changeStatus(o)" :class="{active:condition.status==o.status&&condition.uri==o.uri&&condition.user_id==o.user_id&&condition.creator_id==o.creator_id&&condition.effective}">
							<router-link :to="{path:'/workold/list',query:o}">
								{{o.name}}<span class="num">{{o.num}}</span>
							</router-link>
						</li>
						<li :class="{active:!condition.effective}" @click="changeStatus()">
							<router-link to="/workold/tag">
								<span>工单设置</span>
							</router-link>
						</li>
					</template>
					<template v-else>
						<li v-for="(o,k) in status_list" @click="changeStatus(o)" :class="{active:condition.status==o.status&&condition.uri==o.uri&&condition.user_id==o.user_id&&condition.creator_id==o.creator_id&&condition.effective}">
							<router-link  :to="{path:'/servicer/workold/list',query:o}" >
								{{o.name}}<span class="num">{{o.num}}</span>
							</router-link>
						</li>
						<li :class="{active:!condition.effective}" @click="changeStatus()">
							<router-link to="/servicer/workold/tag">
								<span>工单设置</span>
							</router-link>
						</li>
					</template>
				</ul>
			</template>
		</subnav>
		<div class="flex-right workold_content">
			<router-view :condition="condition" :refreshList="refresh.time" @changeNum="changeNum"></router-view>
		</div>
	</div>
</template>
<script>
	import bar from '../module/自定义滚动条.vue'
	import subnav from '../module/left-aside.vue'
	export default {
		props: {},
		data() {
			return {
				show: true,
				refresh: {
					rotate: 0,
					can: true,
					time: 0
				},
				status_list: {
					all: {
						name: '所有工单',
						status: '',
						uri: '/work_order',
						user_id: '',
						creator_id:'',
						num: '',
						effective: true,
					},
					my_submit: {
						name: '我创建的',
						status: '',
						uri: '/work_order',
						user_id:'',
						creator_id:this.$store.state.global.user.id,
						num: '',
						effective: true
					},
					my_num: {
						name: '我受理中的',
						status: '1',
						uri: '/work_order',
						user_id: this.$store.state.global.user.id,
						creator_id:'',
						num: '',
						effective: true
					},
					my_reply: {
						name: '我回复的',
						status: '',
						uri: '/work_order/my_list',
						user_id: this.$store.state.global.user.id,
						creator_id:'',
						num: '',
						action: '回复',
						effective: true
					},
					my_resolve: {
						name: '我解决的',
						status: '2',
						uri: '/work_order',
						user_id: this.$store.state.global.user.id,
						creator_id:'',
						num: '',
						action: '完成',
						effective: true
					},
					undo_num: {
						name: '未受理',
						status: '0',
						uri: '/work_order',
						user_id: '',
						creator_id:'',
						num: '',
						effective: true
					},
					done: {
						name: '已解决',
						status: '2',
						uri: '/work_order',
						user_id: '',
						creator_id:'',
						num: '',
						effective: true
					},
				},
				condition: {
					name: '所有工单',
					status: '',
					uri: '/work_order',
					user_id: '',
					creator_id:'',
					effective: true,
					action: '',
				},
				AUX:{
					page:{},
					prev_page:{},
					index:-1,
					prev_condition_name:'所有工单',
				}

			}
		},
		created(){
			this.judgeQuery();
		},
		updated() {    
			this.judgeQuery();
		},
		methods: {
			judgeQuery(){
				if(!this.$api.isEmptyObj(this.$router.currentRoute.query) && this.$router.currentRoute.query.name)
	        		this.condition = this.$router.currentRoute.query;
				if(this.$router.currentRoute.path.indexOf('tag') != -1) {
					this.condition.effective = false;
				}
			},
			changeStatus(s = undefined) {
				let v = this;
				if(!s) {
					v.condition.effective = false;
				} else {
					/*for(let i in v.condition) {
						v.condition[i] = s[i];
					}*/
					v.condition = v.$api.deepCopy(s);	
				}
			},
			changeNum(list) {
				let v = this;
				for(let i in v.status_list) {
					if(list[i] !== undefined) {
						v.status_list[i].num = '';
					}
					if(list[i]) {
						v.status_list[i].num = list[i];
					}
				}
			},
			genPage(){
				let v = this;
				v.AUX.page.page = 1;
	        	v.AUX.page.q='';
	          	v.AUX.page.q_filed='';
	          	v.AUX.page.status=this.condition.status;
	          	v.AUX.page.user_id=this.condition.user_id;
	          	v.AUX.page.creator_id=this.condition.creator_id;
	          	v.AUX.page.start_time='';
	          	v.AUX.page.end_time='';
	          	v.AUX.page.action='';
	          	v.AUX.page.sort=-1;
	          	v.AUX.page.sort_filed='updated';
	          	v.AUX.prev_page.q="";
	          	v.AUX.prev_page.q_filed="";
	          	
	          	v.AUX.index = -1;
			}
		},
		components: {
			bar,
			subnav,
		},
		watch: {
			'refresh.time': function(n) {
				if(!this.refresh.can) {
					return;
				} else {
					this.refresh.rotate += 360 * 3;
					this.refresh.can = false;
					setTimeout(() => {
						this.refresh.can = true;
					}, 1000)
				}
			},
			condition:{
				handler(n){
					if(n.name==this.AUX.prev_condition_name)
						return false;
					else
						this.genPage();
				},deep:true
			}
		}
	}
</script>
<style lang="scss" scoped="">
	$navItemHeight:60px;
	$navWidth:185px;
	.workold {
		height: 100%;
		display: flex;
		padding-left: 0 !important;
		padding-right: 0 !important;
		&>div {
			height: 100%;
		}
		.workold_nav {
			.page_title2 .fa-refresh {
				transition: all 3s ease-in-out;
			}
		}
		/*.workold_nav {
			flex-shrink: 1;
			
			background: #e9f1f4;
			position:relative;
			overflow:visible;
			.content {
				width:$navWidth; overflow:hidden;
				transition: width 0.2s ease-in-out;
				&.small{
					width:0;
				}
			}
			.close-open.small{
				transform:rotateZ(180deg);
				right:-11px;
			}
			.page_title2 {
				font-size:16px;
				font-weight:bold;
				background:#dde8ef;
				line-height:90px;
				i{
					font-weight:normal;
				}
			}
			.wrapper{
				height:calc(100% - 90px );
			}
			.page_title2,ul li a{
				padding-left:28px;
				width:$navWidth;
			}
			ul{
				li{
					font-size:14px;
					font-weight:bold;
					
					line-height:$navItemHeight;
					height:$navItemHeight;
					position:relative;
					cursor: pointer;
					a {
						display:block;
						text-decoration:none;
						color:#4a6876;
					}
					.num {
						font-size:12px;
						position:absolute;
						top:0;bottom:0;margin:auto 0;
						left:140px;
					}
				}
				.active{
					background:#fff;
				}
			}
			.close-open{
				position:absolute;
				top:0;bottom:0; right:0; margin:auto 0;
				cursor:ew-resize;
			}
		}*/
		.workold_content {
			flex: 1;
			height: 100%;
			padding:0 20px;
			overflow-y: auto;
		}
	}
</style>