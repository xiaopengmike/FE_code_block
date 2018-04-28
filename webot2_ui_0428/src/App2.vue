<template>
	<div id="_wrap">
		<template v-if="rerender || getPath=='/login'">
			<div id="nav" v-show="getUser.token">
				<div class="logo"><img :src="getEnums.logo" /></div>
				<bar :wrapper="'wrapper'">
					<primaryNav :small="small"></primaryNav>
				</bar>
				<div class="glyphicon glyphicon-transfer pointer" @click="small=!small"></div>
			</div>
			<div id="content">
				<div class="header">
					<div class="control">
						<div class="signal">
							<!--<i class="diffuse"></i>-->
							<i v-if="signal.time<=200" class="my-fa my-icon-signalFull " :class="signal.time<0?'break':'full'"></i>
							<i v-if="signal.time>200 && signal.time<=1000" class="my-fa my-icon-signalDelay delay"></i>
							<i v-if="signal.time>1000" class="my-fa my-icon-signalBad bad"></i>
							<span>{{signal.time>0?signal.time+'ms':'未连接'}}</span>

							<!--<i  class="my-fa my-icon-signalFull "></i>
			  						<i  class="my-fa my-icon-signalDelay delay"></i>
			  						<i  class="my-fa my-icon-signalBad bad" ></i>-->
						</div>
						<div class="select_model pointer" a-show="getMode=='servicer'" :style="getMode=='servicer'?'opacity:1':'opacity:0'">
							<el-dropdown trigger="click">
								<span class="el-dropdown-link">
										    	<span v-show="kf_status==2"><img src="./assets/img/rest_icon.png" />&ensp;休息</span>
								<span v-show="kf_status==0"><img src="./assets/img/leave_icon.png" />&ensp;离线</span>
								<span v-show="kf_status==1"><img src="./assets/img/online_icon.png" />&ensp;在线</span>
								<span class="caret"></span>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item>
										<div @click="changeKFState(1)" class="text-center"><img src="./assets/img/online_icon.png" />&ensp;在线 </div>
									</el-dropdown-item>
									<!--<el-dropdown-item><div @click="changeKFState(2)" class="text-center"><img src="../../assets/img/rest_icon.png" />&ensp;休息 </div></el-dropdown-item>-->
									<el-dropdown-item>
										<div @click="changeKFState(0)" class="text-center"><img src="./assets/img/leave_icon.png" />&ensp;离线 </div>
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
						<div class="select_model pointer">
							<el-dropdown trigger="click">
								<span class="el-dropdown-link">
										    	<span class="username" :title="$store.state.user.username">{{$store.state.user.username}}</span><span class="caret"></span>
								</span>
								<el-dropdown-menu slot="dropdown" class="li-no-padding">
									<el-dropdown-item>
										<div @click="dochange"><span v-if="getMode=='admin'">切换为客服模式</span><span v-else>切换为管理模式</span></div>
									</el-dropdown-item>
									<el-dropdown-item>
										<div @click="doLogout">注销</div>
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</div>
				</div>
				<div class="section">
					<router-view class="view" transition transition-mode="out-in"></router-view>
				</div>

			</div>
			<zoomin :url="getZoominUri" :closeZoomin="closeZoomin"></zoomin>
		</template>
		<loading :show="getLoading>0"></loading>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import primaryNav from './page/module/primaryNav'
	import zoomin from './page/module/放大图'
	import bar from './page/module/自定义滚动条.vue'
	export default {
		data() {
			return {
				rerender: true,
				show_dropdown: false,
				small: false,
				signal: {
					time: 100,
					interval: 10, //秒
				},
				//训练状态,全局用$root.$children[0],训练函数类似
				训练模型信息: {
					status: 0,
					text: ['&emsp;&nbsp;训练&nbsp;&emsp;', '训练中&nbsp;&nbsp;<i class="el-icon-loading font12"></i>'],
					轮询时长: 2, //秒
				},
				系统版本号: false,
				kf_status: 0,
			}
		},
		created() {
			var v = this;
			if(!v.$api.isEmptyObj(v.$store.state.user)) {
				v.axios.all([v.getUserInfo(), v.getSystemInfo(), v.getAuthorityInfo()])
					.then(v.axios.spread(function(d0, d1, d2) {
						v.handlerInfo(d0, d1, d2);
					}))
					.catch(err => {
						v.rerender = true;
					});

			}
		},
		methods: {
			...mapActions({
				initEnums: 'initEnums',
				initAuthority: 'initAuthority',
				logout: 'logout',
				changeMode: 'changeMode',
			}),
			getUserInfo() {
				return this.$api.ajax('/users/' + this.$store.state.user.id, 'get');
			},
			getSystemInfo() {
				return this.$api.ajax('/system', 'get');
			},
			getAuthorityInfo() {
				return this.$api.ajax('/role/permission', 'get', {
					page: 1,
					size: 1000
				});
			},
			handlerInfo(d0, d1, d2) {
				let v = this;
				d0.token = v.$store.state.user.token;
				v.$store.dispatch('setUser', d0);
				v.initAuthority(d2);
				localStorage.nickname = d0.nickname;
				localStorage.role = d0.role;
				localStorage.username = d0.username;
				v.initEnums(d1);
				if(d1.company_name) {
					document.title = `${d1.company_name}-智能客服平台`;
				}
				//	v.rerender = true;
			},
			doLogout() {
				let v = this;
				v.$store.state.准备登出 = true;
				if(v.$store.state.mode == 'servicer') {
					v.$router.push('/index');
				}
				if(v.$store.state.阻止登出) {
					return;
				}
				if(v.kf_status != 0) {
					v.$api.ajax('/kf/status', 'put', {
						status: 0
					}).then(data => {
						v.$message({
							message: '下线成功',
							type: 'success'
						})
					});
				}
				v.$api.ajax('/user/logout', 'get')
					.then(data => {
						v.$message({
							message: '注销成功',
							type: 'success'
						})
						v.logout();
						v.$store.state.准备登出 = false;
					}).catch(err => {
						v.$store.state.准备登出 = false;
					})
			},
			dochange() {
				let v = this;
				v.changeMode();
			},
			changeKFState(str) {
				let v = this;
				if(v.kf_status == str) return;
				v.kf_status = str;
				公共实例.$emit('kf_status', str);
			},
			closeZoomin() {
				this.$store.dispatch('setZoominUri', '');
			},

			//训练机器人
			训练模型() {
				var v = this;
				v.$api.ajax(v.$uri.knowledgeStore.训练, 'post')
					.then(data => {
						v.$message({
							message: '训练开始',
							type: 'info'
						});
						v.训练模型信息.status = 1;
						v.轮询训练模型();
					})
			},
			轮询训练模型() {
				let v = this;
				setTimeout(() => {
					v.$api.ajaxReturnAllNoLoading(v.$uri.knowledgeStore.训练, 'get')
						.then(data => {
							if(data.code == 0) {
								if(data.train) {
									v.轮询训练模型();
								} else {
									if(!v.$api.readingThisPage() || v.$api.isMinWindow()) {
										v.$api.newInfo(data.msg || '训练完成');
									}
									v.$alert(data.msg || '训练完成', '提示');
									v.训练模型信息.status = 0;
								}
							} else {
								v.$message({
									message: data.msg,
									type: 'error'
								})
								v.训练模型信息.status = 0;
							}
						}).catch(err => {
							v.训练模型信息.status = 0;
						})
				}, v.训练模型信息.轮询时长 * 1000);

			},
			版本号控制(n) {
				if(this.系统版本号 === false) {
					this.系统版本号 = n;
				} else if(n !== this.系统版本号) {
					this.$alert('系统版本已更新，即将重载页面', '提示', {
						confirmButtonText: '确定',
						callback: action => {
							window.location.reload();
						}
					});
				}
			},
		},
		computed: {
			...mapGetters([
				'getUser',
				'getLoading',
				'getZoominUri',
				'getMode',
				'getPath',
				'getEnums',
			]),
			userID() {
				return this.$store.state.user.id;
			}
		},
		components: {
			primaryNav,
			mapActions,
			mapGetters,
			zoomin,
			bar,
		},
		watch: {
			'userID': {
				handler: function(n, o) {
					console.log(n)
					let v = this;
					if(n !== '' && n !== undefined && n !== o) {
						v.delayCompute();
						v.axios.all([v.getUserInfo(), v.getSystemInfo(), v.getAuthorityInfo()])
							.then(v.axios.spread(function(d0, d1, d2) {
								v.handlerInfo(d0, d1, d2);
							}))
							.catch(err => {
								v.rerender = true;
							});
					}
				},
				deep: true
			}
		}
	}
</script>

<style lang="scss">
	#_wrap {}

	#wrap {
		display: flex;
		width: 100%;
		min-width: 1200px;
		height: 100%;
		font-size: 0;
		position: relative;
		overflow-y: hidden;
	}

	#nav,
	#content {
		vertical-align: top;
		font-size: 12px;
	}

	#nav {
		height: 100%;
		background: #fff;
		flex-shrink: 1;
		box-shadow: 1px 0px 5px #ccc;
		position: relative;
		z-index: 15;
	}

	#nav .logo {
		text-align: center;
		height: 70px;
		line-height: 70px;
		background: #13a0e3;
		overflow: hidden;
		position: relative;
		z-index: 3;
	}

	#nav .logo img {
		max-width: 70px;
		max-height: 70px;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
	}

	#nav .wrapper {
		max-height: calc(100vh - 70px);
	}

	#nav .glyphicon-transfer {
		position: absolute;
		top: 0;
		right: -11px;
		z-index: 250;
	}

	#content {
		flex: 1;
		flex-direction: column;
		min-height: 100%;
		flex-direction: column;
		flex-wrap: nowrap;
		position: relative;
	}
	/*#wrap { width:100%; min-width: 1200px; height:100%; font-size:0; position:relative;}
	#nav,#content {display:inline-block; vertical-align:top; font-size:12px;}
	#nav {height:100%; float:left; background:#fff;width:200px; box-shadow:1px 0px 5px #ccc;}
	#content {
		float:right;

    flex-direction: column;
    min-height: 100%;
    flex-direction:column;
    flex-wrap: nowrap;
    position:relative;
  }
  @media only screen and (min-width: 1200px) {
  	#content { width:calc(100% - 200px);}
  }
  @media only screen and (max-width:1201px ) {
  	#content { width:1000px;}
  }*/

	#content .header {
		height: 70px;
		text-align: right;
		box-shadow: 1px 0px 5px #ccc;
		position: relative;
		z-index: 13;
	}

	#content .header .control {
		text-align: right;
		height: 70px;
		line-height: 70px;
	}

	#content .header .control>* {
		display: inline-block;
		margin-right: 30px;
	}

	#content .header .username {
		display: inline-block;
		vertical-align: middle;
		max-width: 70px;
		overflow: hidden;
		word-break: keep-all;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	#content .header .username+span {
		vertical-align: middle;
	}

	#content .header .select_model {}

	#content .header .select_model+button {
		position: relative;
		top: 15px;
	}

	.el-dropdown-menu.li-no-padding .el-dropdown-menu__item {
		padding: 0;
	}

	.el-dropdown-menu.li-no-padding .el-dropdown-menu__item>div {
		padding: 0 10px;
	}

	#content .section {
		height: calc(100vh - 70px);
		overflow-y: auto;
	}

	#content .section>.view {
		*height: 100%;
	}

	#subNav {
		padding: 19px 0 18px;
		height: 70px;
		min-width: 700px;
		position: absolute;
		left: 10px;
		top: -0px;
		z-index: 15;
	}

	.signal {
		width: 38px;
		font-size: 24px;
		text-align: left;
		position: relative;
		.full {
			color: #3fc3f7;
			&+span {
				color: #3fc3f7;
			}
		}
		.bad {
			color: #f05a59;
			&+span {
				color: #f05a59;
			}
		}
		.delay {
			color: #F2A41C;
			&+span {
				color: #F2A41C;
			}
		}
		.break {
			color: #c4c4c4;
			&+span {
				color: #c4c4c4;
			}
		}
		span {
			opacity: 0;
			font-size: 12px;
			text-align: center;
			line-height: 25px;
			display: inline-block;
			width: 60px;
			height: 25px;
			position: absolute;
			bottom: 0px;
			left: 11px;
			border: 1px solid #eee;
			background: #fff;
			box-shadow: 3px 2px 5px #cecece;
			border-radius: 5px;
		}
		i:hover {
			&+span {
				opacity: 1;
				transition: all .5s ease;
			}
		}
		.diffuse {
			position: absolute;
			top: 0;
			left: 0;
			width: 22px;
			height: 22px;
		}
	}

	.diffuse {
		display: inline-block;
		position: relative;
		width: 50px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		&:before,
		&:after {
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 200px;
			opacity: 0;
			top: 0;
			left: 0;
			border: 1px solid #00A0E9;
			animation-iteration-count: infinite;
			animation: diffuse 1.2s ease infinite;
		}
		&:before {
			animation-delay: 0.6s;
		}
		&:after {
			animation-delay: 0s;
		}
	}

	@keyframes diffuse {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}
</style>
