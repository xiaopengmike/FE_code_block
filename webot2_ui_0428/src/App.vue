<template>
	<div id="_wrap">
		<template>
			<div id="_header">
				<div class="logo"><img :src="getEnums.logo" /></div>
				<div class="select-model pointer" @click="doChangeMode">
					<el-popover ref="modePandect1" popper-class="text-center black" trigger="hover" :content="getMode !=='admin'?'切换为管理模式':'切换为工作台模式'"></el-popover>
					<span v-if="getMode !=='admin'" v-popover:modePandect1>客服工作台</span>
					<span v-else v-popover:modePandect1>管理后台</span>
				</div>
				<div class="header">
					<font>欢迎你，{{getUser.username}}</font>
					<div class="select">
						<Dropdown trigger="click" v-show="getMode=='servicer'" placement="bottom-end">
							<span>
								<span v-for="(status,i) in kf_statuses" v-show="kf_status.label==status.label && kf_status.status==status.status">
									<i class="kf-status" :style="{ 'backgroundColor': status.color }"></i>&ensp;{{status.label}}
								</span>
								<Icon type="arrow-down-b"></Icon>
							</span>
							<DropdownMenu slot="list">
								<DropdownItem  v-for="(status,i) in kf_statuses" v-if="status.isEnable || !status.isEditEnable">
									<div @click="changeKFState(status.label, status.status)" class="text-left kf-status-container">
										<i class="kf-status" :style="{ 'background-color': status.color }"></i>&ensp;{{status.label}} 
									</div>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
						&emsp;&emsp;&emsp;&emsp;
						<div class="avatar">
							<img v-if="!getUser.head" src="./assets/img/user_header.png" />
							<img v-else :src="getUser.head" />
						</div>&ensp;
						<Dropdown trigger="click">
							<span class="el-dropdown-link">
								<span class="username" :title="$store.state.global.user.username">{{$store.state.global.user.username}}</span>
							<Icon type="arrow-down-b"></Icon>
							</span>
							<DropdownMenu slot="list">
								<DropdownItem>
									<div @click="doLogout" class="text-center">&emsp;&emsp;&emsp;&emsp;注销&emsp;&emsp;&emsp;&emsp;</div>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
			<div id="_section">
				<div id="_nav">
					<div class="nav_wrap">
						<primaryNav :small="small" :delay="signal.time" ></primaryNav>
					</div>
				</div>
				<div id="_content" :class="small.bool?'small':'large'" v-if="rerender||getPath=='/login'">
					<router-view class="_container" transition transition-mode="out-in"></router-view>
				</div>
			</div>
		</template>
		<zoomin :url="getZoominUri" @closeZoomin="closeZoomin"></zoomin>
		<loading v-model="$store.state.global.loading"></loading>
		<br /><br />
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import primaryNav from './page/module/primaryNav'
	import zoomin from './page/module/放大图'
	import bar from './page/module/自定义滚动条.vue'
	import { triggerResize } from './page/module/手动触发resize.js'
	export default {
		data() {
			return {
				rerender: false,
				show_dropdown: false,
				small: {
					free_change: true,
					bool: false,
				},

				signal: {
					time: 100,
					interval: 10, //秒
					instance:null
				},
				//训练状态,全局用$root.$children[0],训练函数类似
				训练模型信息: {
					task_id:'',
					status: 0,
					text: ['训练', '训练中&nbsp;<i class="el-icon-loading font12"></i>'],
					轮询时长: 2, //秒
				},
				系统版本号: false,
			}
		},
		created() {
			var v = this;
			v.init();
			if(!v.$api.isEmptyObj(v.$store.state.global.user)) {
				v.initData();
			}
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
				return this.$store.state.global.user.id;
			},
			kf_status:{
				get(){
					return this.$store.state.service.kf_status;
				},
				set(val){
					this.$store.dispatch('setKfStatus',val);
				}
			},
			kf_statuses:{
				get(){
					return this.$store.state.service.kf_statuses;
				},
				set(val){
					this.$store.dispatch('setKfStatuses',val);
				}
			}
		},
		methods: {
			...mapActions({
				initEnums: 'initEnums',
				initAuthority: 'initAuthority',
				logout: 'logout',
				changeMode: 'changeMode',
			}),
			init() {
				this.handlerResize();
				window.addEventListener('resize', this.handlerResize, false);
			},
			handlerResize() {
				let result1 = window.matchMedia('(min-width:1200px)');
				let result2 = window.matchMedia('(min-width:992px)');
				let result3 = window.matchMedia('(min-width:768px)');
				if(result1.matches) {
					this.small.free_change = true;
					console.log(">=1200 大型设备 大台式电脑");
				} else if(result2.matches) {
					this.small.bool = true;
					this.small.free_change = false;
					console.log("992=< <=1200 中型设备 台式电脑");
				} else if(result3.matches) {
					this.small.bool = true;
					this.small.free_change = false;
					console.log("768<= <=992 小型设备 平板电脑");
				} else {
					this.small.bool = true;
					this.small.free_change = false;
					console.log("<=768 超小设备 手机");
				}
			},
			initData(){
				let v = this;
				v.axios.all([v.getUserInfo(), v.getSystemInfo(), v.getAuthorityInfo(),v.get状态(),v.getKfStatuses()])
				.then(v.axios.spread(function(d0, d1, d2,d3,d4) {
					v.handlerInfo(d0, d1, d2,d3,d4);
				}))
				.catch(err => {
					v.rerender = true;
				});
			},
			getUserInfo() {
				console.log(this.$store.state.global.user)
				return this.$api.ajax('/users/' + this.$store.state.global.user.id, 'get');
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
			get状态(){
				return this.$api.ajax(this.$uri.company.some_status,'get');
			},
			getKfStatuses(){
				let v = this;
            	return v.$api.ajax(v.$uri.user.allkfStatus, 'get');
			},
			状态初始化(data){
				this.$store.state.global.问题检测 = Boolean(Number(data));
			},
			handlerInfo(d0, d1, d2, d3, d4) {
				let v = this;
				d0.token = v.$store.state.global.user.token;
				v.$store.dispatch('setUser', d0);
				v.initAuthority(d2);
				localStorage.nickname = d0.nickname;
				localStorage.role = d0.role;
				localStorage.username = d0.username;
				v.initEnums(d1);
				if(d1.company_name) {
					document.title = `${d1.company_name}-智能客服平台`;
				}
				if(this.$store.state.global.path.indexOf('login') != -1)
					this.$router.replace('/index');
				v.状态初始化(d3);
				
				v.kf_statuses = d4.kf_status;
				
				v.rerender = true;
			},
			doLogout() {
				let v = this;
				
				let sessions索引 = memoryStorage.getItem('sessions索引');
	  			if(sessions索引 && Object.values(sessions索引).some(val=>val.status==1)){
	  				v.$confirm('当前有正在会话的客户，请先结束会话或转交！','提示',{
						cancelButtonText: '取消',
					});
					return false;
	  			}
				if(v.kf_status.label != '离线' ) {
					v.$api.ajax('/kf/status', 'put', {
						label: '离线',
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
						clearTimeout(v.signal.instance);
						v.logout();
					})
			},
			doChangeMode() {
				let v = this;
				if( v.$store.state.global.mode == 'servicer' ){
					if(v.$store.state.service.sessions.some(val=>val.status==1)){
						v.$confirm('当前有正在会话的客户，请先结束会话或转交！','提示',{
							cancelButtonText: '取消',
						})
					}else {
						if( v.kf_status.label != '离线' ){
							v.$confirm('切换模式会导致离线，请问是否继续', '提示', {
						        confirmButtonText: '确定',
						        cancelButtonText: '取消',
						        type: 'warning'
					        }).then(() => {
					        	v.doChangeKfStatus('离线', 0).then(data=>{
									v.changeMode();
								}).catch(err=>{
									v.$api.error(err)
								})
					           	
					        })
						}else {
							v.changeMode();
						}
					}
				}else{
					v.changeMode();
				}
			},

			changeKFState(label, status) {
				let v = this;
				if( v.kf_status.status == status && v.kf_status.label == label ) return;
				v.doChangeKfStatus(label, status);
			},
			doChangeKfStatus(label, status){
				let v = this;
				return new Promise(( resolve, reject )=>{
					if( v.judgeChangeKfStatus( {label, status}, v.kf_status) ){
						v.$store.state.global.delay_lock.change_kf_status = true;
						v.$api.ajax(v.$uri.user.kfStatus, 'put', {label, status})
						.then(result=>{
							v.kf_status = {label, status};
							resolve('ok');
							v.$store.state.global.delay_lock.change_kf_status = false;
						}).catch(err=>{
							reject(  err );
							v.$store.state.global.delay_lock.change_kf_status = false;
						})
					}else {
						reject( '会话未结束，some sessions unresolved');
					}
				})
			},
			judgeChangeKfStatus(n, o){
				let v = this;
				if(n.status == 0 && o.status == 1){
					if(v.$store.state.service.sessions.some(val=>val.status==1)){
						v.$confirm('当前有正在会话的客户，请先结束会话或转交！','提示',{
							cancelButtonText: '取消',
						})
						return false;
					}
				}
				return true;
			},
			closeZoomin() {
				this.$store.dispatch('setZoominUri', '');
			},
			//计算网络延时


			delayCompute() {
			 	let v = this;
			 	v.signal.instance = setTimeout(() => {
			 		let begin = Date.now();
			 		v.$api.ajaxReturnAllNoLoading('/delay', 'get')
			 			.then(data => {
			 				v.signal.time = Date.now() - begin;
			 				v.版本号控制(data.data.version);
			 				if(v.kf状态处理(data.data.kf))
			 					v.delayCompute();
			 			}).catch(err => {              
			 				for(let i in err) {
			 					console.log(i, err[i])
			 				}
			 				if((err.code && err.code == 'ECONNABORTED') || err.response == undefined) {
			 					v.signal.time = -1;
			 				} else
			 					v.signal.time = Date.now() - begin;
			 				if(err&& err.code == 101) return false;
			 				v.delayCompute();
			 			})
			 	}, v.signal.interval * 1000 / 3);
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
						v.训练模型信息.task_id = data;
						v.训练模型信息.status = 1;
						v.轮询训练模型();
					})
			},
			轮询训练模型() {
				let v = this;
				setTimeout(() => {
					v.$api.ajaxReturnAllNoLoading(v.$uri.knowledgeStore.训练, 'get',{task_id:v.训练模型信息.task_id})
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
			kf状态处理({label, status}){
				let v = this;
				status = Number(status);
				if(v.kf_status.status == status &&v.kf_status.label == label  || v.$store.state.global.delay_lock.change_kf_status ) return true;
				if(v.kf_status.label==='' ){
					v.kf_status = {label, status};
				}else{
					if(v.$store.state.global.mode=='servicer' ){
						this.$alert('你的客服状态已改变，即将重载页面', '提示', {
							confirmButtonText: '确定',
							callback: action => {
								window.location.reload();
							}
						});
						return false;
					}else{
						v.kf_status = {label, status};
					}
				}

				return true;
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
						v.initData();
					}
				},
				deep: true
			},
			'small.bool' (n) {
				triggerResize();
			}
		}
	}
</script>

<style lang="scss">
	@import "./assets/scss/color.scss";
	@import "./assets/scss/wrap_variate.scss";
	$min_width:1020px;
	#_wrap {
		min-width: $min_width;
		max-height: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		#_header {
			font-size: 0;
			height: $wrap-head-height;
			background: $wrapColor;
			border-bottom:1px solid darken($wrapColor,5%);
			&>div {
				display: inline-block;
				font-size: 15px;
				;
				height: 100%;
				vertical-align: top;
				border-right: 1px solid $wrapBorderColor;
			}
			.logo {
				width: 60px;
				text-align: center;
				position: relative;
				overflow: hidden;
				img {
					max-width: 100%;
					max-height: 100%;
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;
					margin: auto;
				}
			}
			.select-model {
				color: $navColor;
				text-align: center;
				width: 120px;
				line-height: $wrap-head-height;
				&:hover {
					background: #3e4a57;
				}
				&:active {
					background: #222c37;
				}
			}
			.header {
				span {
					color: $navColor;
					cursor: pointer;
				}
				position:relative;
				width:calc(100% - 182px);
				padding:0 57px 0 25px;
				font {
					color: #526071;
					line-height: $wrap-head-height;
				}
				.select {
					line-height: $wrap-head-height;
					float: right;
					text-align: right;
					&>* {
						vertical-align: top;
					}
					.kf-status-container {
						padding: 7px 16px;
					}
					.ivu-dropdown-menu{
						min-width: auto;
					}
					.ivu-dropdown-item {
						margin: 0;
						line-height: normal;
						padding: 0px;
						clear: both;
						color: #495060;
						font-size: 12px !important;
						white-space: nowrap;
						list-style: none;
						cursor: pointer;
						transition: background .2s ease-in-out
					}
					.kf-status {
						display: inline-block;
						width: 12px;
						height: 12px;
						position: relative;
						top: 1px;
						border-radius: 50%;
					}
				}
				.avatar {
					display: inline-block;
					position: relative;
					width: 45px;
					height: $wrap-head-height;
					border-radius: 50%;
					overflow: hidden;
					img {
						width: 45px;
						height: 45px;
						position: absolute;
						top: 0;
						left: 0;
						bottom: 0;
						right: 0;
						margin: auto;
						border-radius: 50%;
						border: 2px solid #c5d6df;
					}
				}
			}
		}
		#_section {
			height:calc(100vh - #{$wrap-head-height});
			overflow: hidden;
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy) */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10 */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			display: flex;
			#_nav {
				flex-shrink: 1;
				position: absolute;
				top: $wrap-head-height;
				left: 0;
				z-index: 10;
				height:calc(100vh - #{$wrap-head-height});

				.nav_wrap {
					height: 100%;
					transition: all 0.2s ease;
				}
			}
			#_content {
				-webkit-box-flex: 1;
				/* OLD - iOS 6-, Safari 3.1-6 */
				-moz-box-flex: 1;
				/* OLD - Firefox 19- */
				-webkit-flex: 1;
				/* Chrome */
				-ms-flex: 1;
				/* IE 10 */
				flex: 1;
				height: 100%;
				overflow-y: auto;
				transition: all 0.2s ease;
				._container {
					height: 100%;
					padding-right: 42px;
					padding-left: 42px;
					margin-right: auto;
					margin-left: auto;
				}
				&.large {
					padding-left: 180px;
				}
				&.small {
					padding-left: 60px;
				}
			}
		}
	}
</style>
