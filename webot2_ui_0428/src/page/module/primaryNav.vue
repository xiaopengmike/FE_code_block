<template>
	<div id="primaryNav" :class="{small:small.bool,flow:flow}"   @mouseover='flow=true' @mouseleave="()=>{if($store.state.global.loading==0)flow=false;}">
		<div class="transfer pointer" :class="{small:small.bool,hide:!small.free_change}" @click="changeNav">
			<Icon type="navicon"></Icon>
		</div>
			<template v-if="authority!==undefined">
				<bar wrapper="wrapper" :scrollTop="scrollTop">
					<ul v-if="getMode=='admin'" class="navs">
						<template v-for="(nav,i) in navs" v-if="nav.show && nav.meta.mode=='admin'">
							<li :class="isActive(nav.path)?'active':''" v-if="authority[nav.permission]!==0" :authority="nav.permission">
								<div  @click="show_subnav=show_subnav==i?0:i">
									<Icon v-if="nav.show_child" type="android-arrow-dropright" class="arrow" :class="show_subnav==i?'turn':''"></Icon>
									<router-link :to="nav.path">
										<span v-if="nav.icon_class" class=" icon" :class="nav.icon_class"></span>
										<img v-if="nav.icon" :src="nav.icon" class="icon" />
										<span class="navName">{{nav.name}}</span>
									</router-link>
								</div>
								<transition name="height" v-if="nav.show_child">
									<ol class="subNav" v-show="show_subnav==i">
										<li v-for="sub in nav.children" v-if="sub.show && authority[nav.permission]!==0" :class="isActive(sub.path)?'active':''">
											<div>
												<router-link :to="sub.path">
													<span class="navName">{{sub.name}}</span>
												</router-link>
											</div>
										</li>
									</ol>
								</transition>
							</li>
						</template>
						<li>
							<div>
								<a @click="getChatUrl()" class="pointer">
					            	<span class="icon ivu-icon ivu-icon-chatbubbles"></span><span class="navName">聊天测试</span>
								</a>
							</div>
							
						</li>
					</ul>
					<ul v-if="getMode=='servicer'" class="navs">
						<template v-for="(nav,i) in navs" v-if="nav.show && nav.meta.mode=='servicer'">
							<li v-for="(n,i) in nav.children" :class="getPath.indexOf(n.path)!=-1?'active':''" @click="setPath(n.path)" :authority="n.permission" v-if="authority[n.permission]!=0&&n.show">
								<div  @click="show_subnav=show_subnav==i?0:i">
									<Icon v-if="n.show_child" type="android-arrow-dropright" class="arrow" :class="show_subnav==i?'turn':''"></Icon>
									<router-link :to="n.path">
										<span v-if="n.icon_class" class=" icon" :class="n.icon_class"></span>
										<!--仅当前会话显示信息数量-->
										<span v-if="n.name=='当前会话'" v-show="$store.state.global.path!=='/servicer/session' && (session_news_num>0||session_news_num.length>1)" class="news_num">
											{{session_news_num}}
										</span>
										<!--仅当前会话显示信息数量-->
										<img v-if="n.icon" :src="n.icon" class="icon" />
										<span class="navName">{{n.name}}</span>
									</router-link>
								</div>
							</li>
						</template>
					</ul>
				</bar>
				<ul class="nav_footer navs">
					<li v-show="$store.state.global.mode == 'admin'" :class="getPath.indexOf('/setting')!=-1?'active':''">
						<div>
							<router-link to="/setting">
								<span class="icon my-fa my-icon-setting"></span>
								<span class="设置">设置</span>
							</router-link>
						</div>
					</li>
					<li v-show="$store.state.global.mode == 'servicer'" :class="getPath.indexOf('/setting')!=-1?'active':''">
						<div>
							<router-link to="/servicer/setting">
								<span class="icon my-fa my-icon-setting"></span>
								<span class="设置">设置</span>
							</router-link>
						</div>
					</li>
					<li class="noNavItem">
						<div>
							<a class="signal">
								<template v-if="delay<=200">
									<i class="my-fa my-icon-signalFull icon" :class="delay<0?'break':'full'"></i>
									<span v-if="delay<0">网络断开</span>
									<span v-else>{{delay}}ms 网络畅通</span>
								</template>
								<template v-if="delay>200 && delay<=1000">
									<i class="my-fa my-icon-signalDelay delay icon"></i>
									<span>{{delay}}ms 网络延迟</span>
								</template>
								<template v-if="delay>1000">
									<i class="my-fa my-icon-signalBad bad icon"></i>
									<span>{{delay}}ms 网络拥堵</span>
								</template>
							</a>
						</div>
					</li>
				</ul>
			</template>
	
	</div>
	<!--<div id="primaryNav">
		<template v-if="authority!==undefined">
			<bar wrapper="wrapper">
				<el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="small" theme="dark">
					<template v-for="(nav,i) in navs" v-if="nav.show && nav.meta.mode=='admin'">
						<el-submenu index="i"  v-if="authority[nav.permission]!==0" :authority="nav.permission">
					 		<router-link :to="nav.path">
									<span v-if="nav.icon_class" class=" icon" :class="nav.icon_class"></span>
									<img v-if="nav.icon" :src="nav.icon" class="icon" />
									<span class="navName">{{nav.name}}</span>
								</router-link>
						</el-submenu>
					</template>
					
				</el-menu>
			</bar>
		</template>
	</div>-->
</template>
<script>
	import navs from '../../config/routes'
	import { mapGetters, mapActions } from 'vuex'
	import bar from './自定义滚动条.vue'
	export default {
		// name: 'header',
		props: ['small','delay'],
		data() {
			return {
				navs: navs,
				show_subnav:0,
				flow:false,
				over:false,
				scrollTop:{
					top:0,
				}
			}
		},
		created() {
			let v = this;
			document.addEventListener('mousemove',function(e){   
				if(e.pageX>170){
					v.flow=false;
				}
			})
		},
		computed: {
			...mapGetters([
				'getUser',
				'getAuthority',
				'getEnums',
				'getPath',
				'getMode',
			],),
			mode(){
				return this.$store.state.global.mode;
			},
			role: function() {
				return this.$store.state.global.user.role;
			},
			authority: function() {
				if(this.$store.state.global.authority[this.$store.state.global.user.role])
					return this.$store.state.global.authority[this.$store.state.global.user.role].permissions;
				else
					return undefined;
			},
			session_news_num(){
				if(!this.$store.state.service.sessions || this.$store.state.service.sessions.length==0) return 0;
				let num = this.$store.state.service.sessions.reduce((accumulator, currentValue)=>{
					if(currentValue.status!=1)
						return accumulator;
					else
						return accumulator.news!==undefined?accumulator.news+currentValue.news : accumulator+currentValue.news;
				}) ;
				return num>99?'99+':num;
			}
		},
		methods: {
			...mapActions({
				setPath: 'setPath',
			}),
			isActive(uri){
				let arr1 = this.getPath.split('/');
				let arr2 = uri.split('/');
				return arr2.every((val,i)=>val==arr1[i]);
			},
			changeNav() {
				let v = this;
				if(!v.small.free_change) return false;
				v.small.bool = !v.small.bool;
				v.flow = false;
			},
			getChatUrl() {
				var v = this;
				//window.open(data.chat_url,"_blank","toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=800, height=800");
				var chat = window.open(v.getEnums.chat_url + '&time=' + Date.now());
				chat.focus();
			},
			mouseleave(){
				if(this.small.bool&&this.show_subnav!=0){
					this.show_subnav = 0;
				}
			},
			MillisecondToDate(msd){
				let result = '';
				let format=['ms','s','m','h'];
			    if (null!= msd &&""!= msd) {
			    	let time = parseInt(msd)/1000;
			    	if(time>=3600){
			    		result += parseInt(time/3600);
			    		time = parseInt(time%3600);
			    	}else if(result.length>0){
			    		result +='0';
			    	}
			    	if(result.length>0)
			    		result +=format[3];
			    	if(time>=60){
			    		result += parseInt(time/60);
			    		time = parseInt(time%60);
			    	}else if(result.length>0){
			    		result +='0';
			    	}
			    	if(result.length>0)
			    		result +=format[2];
			    	if(time>=1){
			    		result += time;
			    	}
			    	else if(result.length>0){
			    		result +='0'
			    	}
			    	if(result.length>0)
			    		result +=format[1];
			    	if(time>=0){
			    		result += time*1000+format[0];
			    	}
			    }else{
			        result = "0"+format[0];
			    }
			    return result;
			}
		},
		components: {
			mapGetters,
			bar,
		},
		watch: {
			'small.bool'(n){
				this.mouseleave();
			},
			flow(n){
				this.mouseleave();
			},
			mode(n){
				this.scrollTop.top = 0;
			}
		}
	}
</script>
<style lang="scss" scoped="">
	@import "../../assets/scss/color.scss";
	$subNavColor:#222c37;
	#primaryNav {
		height:100%;
		position: relative;
		background: $wrapColor;
		.transfer {
			color: #526071;
			font-size: 21px;
			text-align: center;
			height: 30px;
			line-height: 30px;
			background: #3a4654;
			&.small {
				i {
					transition: all 0.2s ease-in-out;
					transform: rotate(90deg);
				}
			}
		}
		.wrapper {
			max-height:calc(100% - 150px);
			overflow:hidden;
			
			._custom-scrollbar_bar{
				background:#505d6c;
				opacity: 1;
			}
		}
		.hide + .wrapper {
			max-height:calc(100% - 120px);
		}
		li {
			font-size: 14px;
			position: relative;
			cursor: pointer;
			color: $navColor;
			overflow: hidden;
			use-select:none;
			&.noNavItem{
				cursor:default;
				&>div{
					&:hover{background:none; }
				}
			}
			&>div{
				height:60px;
				.news_num {
					border-color: $wrapColor;
				}
				&:hover {	
					background: #3e4a57;
					.news_num {
						border-color:#3e4a57;
					}
				}
			}
			&.active>div {
				background:$subNavColor;
				.news_num {
					border-color: $subNavColor;
				}
			}
			.arrow {
				position: absolute;
				left: 10px;
				top: 20px;
				transition:all ease 0.2s;
				&.turn{transform:rotate(90deg) ;}
			}
			
			a {
				display: inline-block;
				width: 120px;
				color: $navColor;
				font-family: Light;
				line-height: 60px;
				height: 60px;
				margin-left: 60px;
				text-decoration: none;
				transition: width 0.2s ease-out;
				overflow:hidden;
				.icon {
					font-size:22px;
					padding: 0 5px;
					position: absolute;
					left: 20px;
					top: 17px;
					color:#8b99a7;
				}
				.news_num {
					font-size:12px;line-height:15px; color:#fff; text-align:center;
					display:inline-block; padding:0 4px; min-width:20px; height:21px;  border-radius:15px;
					position:absolute; top:-23px; bottom:0; margin:auto; left:32px; background:red; 
					border-width:3px;
					border-style: solid;
					transform:scale(0.7);
				}
			}
			.router-link-active {
				color:#fff;
				.icon {color:#fff;}
			}
			ol {
				background:$subNavColor;
				border-top:1px solid $navBorderColor;
				li {
					height:50px;
					&.active {
						background:$subNavColor;
					}
					&.active {
						&>div {background:#17212c;}
					}
				}
				a{font-size:14px;line-height:50px;;}
			}
		}
		&.small {
			&.flow {
				li {
					a {
						width: 120px;
						font-size: 14px;
						transition: width 0.2s ease-out;
					}
				}
			}
			li {
				a {
					width: 0;
					font-size: 0;
					transition: width 0.2s ease-out;
				}
			}
		}
		
		.nav_footer{
			border-top:1px solid $wrapBorderColor;
			position:absolute; bottom:0; left:0;
		}
	}
	/*网络延迟*/
	.signal {
		top:0 !important;
		font-size:12px !important;
		cursor:default;
		i{
			font-size:16px !important;
		}
		.full {
			color: #3fc3f7 !important;
			&+.num {
				color: #3fc3f7 !important;
			}
		}
		.bad {
			color: #f05a59 !important;
			&+.num {
				color: #f05a59 !important;
			}
		}
		.delay {
			color: #F2A41C !important;
			&+.num {
				color: #F2A41C !important;
			}
		}
		.break {
			color: #c4c4c4 !important;
			&+.num {
				color: #c4c4c4 !important;
			}
		}
		.num {
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
	/*二极导航动效*/
	.height-enter-active {
	 	/*transition: all .5s ease;*/
	}
	.height-leave-active{
	 	/*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
	}
	.height-enter, .height-leave-to {
	  	/*transform:scale(0,0);*/
	}
</style>