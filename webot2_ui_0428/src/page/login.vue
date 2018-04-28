<template>
	<div class="_login2">
  		<header>
  			<img src="../assets/img/logo.png" />
  		</header>
  		<section>
  			<div class="main_wrap">
		  		<div class="plane text-center">
		  			<img src="../assets/img/plane.png"  />
		  		</div>
	  			<div class="font text-center">Boost your business with conversational user experience！</div>
	  			<div class=" login_area">
					<div class="box_wrap">
				  		<div class="row inputs">
				  			<input ref="account" class="form-control user input" type="text" v-model="login.account"  :empty2="login.account" empty="" @change="(e)=>{e.target.setAttribute('empty', e.target.value)}"/>
				  			<label @click="$refs.account.focus()" class="unselect">请输入用户名</label>
				  		</div>
				  		<div class="row inputs">
					  			<input v-show="!show_pwd" ref="pwd1" id="pwd1" name="pwd" v-model="login.password" @keydown="(e)=>{if(e.keyCode==13) doLogin();}" :empty2="login.password" empty="" @change="(e)=>{e.target.setAttribute('empty', e.target.value)}" class="form-control pwd input" type="password"/>
					  			<input v-show="show_pwd" ref="pwd2" v-model="login.password" class="form-control pwd input" type="text" :empty2="login.password" empty="" @change="(e)=>{e.target.setAttribute('empty', e.target.value)}"/>
					  			<label @click="()=>{if(show_pwd) $refs.pwd2.focus(); else $refs.pwd1.focus();}" class="unselect">请输入密码</label>
						  		<span class="cover" v-show="login.password.length==0"  @click="()=>{if(show_pwd) $refs.pwd2.focus(); else $refs.pwd1.focus();}"></span>
						  		<i class="fa fa-eye-slash eye pointer" v-show="!show_pwd" @click="show_pwd=!show_pwd"></i>
						  		<i class="fa fa-eye eye pointer" v-show="show_pwd" @click="show_pwd=!show_pwd"></i>
				  		</div>
					  	<div class="row remember unselect clearfix">
					  		<span class="clearfix" >
					  			<Checkbox v-model="remember">&ensp;记住密码</Checkbox>
					  		</span>
					  	</div>
				  		<div class=" row code unselect">
				  			<p>请点击图片中倒立的文字</p>
				  			<p class="dots" @click="code">
				  				<img :src="'/captcha.gif?t='+login.t" /> 
				  				<i v-for="dot in login.code" @click="(e)=>e.stopPropagation()" class="dot fa fa-reddit" :style="'left:'+(dot-5)+'px;'"></i>
				  			</p>
				  			<b @click="login.t=Math.random();login.code=[];" class="ivu-icon-ios-loop-strong ivu-icon refresh pointer" a="fa fa-refresh"></b>
				  		</div>
				  		<div class="dividing row"></div>
					  	<div class="row text-center">
					  		<button class='btn btn-info btn-lg' :class="{'my-btn-disabled': login.account==='' || login.password==='' || login.code.length<2}" @click="doLogin()" :disabled="login.account==='' || login.password==='' || login.code.length<2">登录</button>
					  	</div>
			  		</div>
				</div>
  			</div>
  		</section>
  		<footer class="text-center">
  				<img src="../assets/img/persons.png"  />
  		</footer>
  </div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex'
	export default {
		data(){
			return {
				login:{ 
					account:'',
					password:'',
					code:[],
					t:Math.random(),
				},
				remember:false,
				show_pwd:false,
				eye_over:false,
			}
		},
		created(){
			this.$store.state.global.loading = 0;
			let account = this.$api.getCookie('account');
			if(account){
				this.login.account = account;
				this.login.password = this.$api.getCookie('psd');
				this.remember = true;
				this.pwd = new Array(this.login.password.length).fill('·').join("");
			}
			/*this.account = localStorage.account;*/
			/*this.pwd = localStorage.pwd;*/
		/*	this.cxt = document.querySelector('#canvas').getContext('2d');*/
		},
		mounted(){
			this.$nextTick(()=>{
				if(!this.remember)
					this.$refs.account.focus();
			})
		},
		computed:{
			...mapGetters(['getEnums']),
			
		},
		methods:{
			code(e){	  											
				var x =  e.offsetX;//e.offsetX > e.layerX ?e.offsetX : e.layerX;
				this.login.code.unshift(x);
				this.login.code = this.login.code.slice(0,2);
			},
			doLogin(){
				var v= this
				if(v.login.account && v.login.password && v.login.code.length!=0){  
					this.$api.ajax('/user','post',v.login).then(
						function(data){
							v.$store.dispatch('login',data);  
							if(v.remember&&!v.$api.getCookie('account')){
								v.$api.setCookie('account',v.login.account,7);
								v.$api.setCookie('psd',v.login.password,7);
							}
							if(!v.remember){
								v.$api.delCookie('account');
								v.$api.delCookie('psd');
							}
						}
					)
				}
			}
		},
		components:{
			mapGetters,mapActions,
		}
	}
</script>
<style lang="scss">
$font-c :#d1d1d1;
$login_area_font-c: #6f7f90;
$login_area-bg: #313d4a;
$login_btn-bg: #0f86ff;
._login2 {
	width:100%; height:100%; position:fixed; top:0; left:0; z-index:1000;
	padding:0 !important;
	background: url(../assets/img/login_bg.png) no-repeat center center;
	background-size: 100%;
	background-color: #fff;
	header {
		padding-top: 15px; 
		img { margin-left:50px;; }
	}
	section{
		width:100%;  height: 100%;  *background:red;
		position:absolute; top:calc((100% - 730px) / 9); z-index:10;
		overflow-y: auto;  right:-17px; padding-right: 34px;
		.main_wrap {
			width:100%;  height: 100%; min-height: 700px;   margin-right:-17px;
		}
		.font { font-family: Calibri; font-size: 20px; color: $font-c;  }
		.plane {
			height: 15%;
			img { height:100%; }
		}
		.login_area {
			width:635px; height: 450px; margin: auto;
			background: url(../assets/img/login_area.png) no-repeat center center;
			.box_wrap {width: 320px; margin: auto; position:relative; top:80px; }
			.row {position: relative; margin: 0; margin-top:18px; }
			.remember { margin-top: 12px; }
			.code {margin-top:10px;}
			.inputs {padding-top: 15px;}
			.inputs label { display:block; color: $login_area_font-c; background: $login_area-bg;  position:absolute;  top:0; left:-10px; padding-left:10px; transition: all 0.2s ease;}
			.cover {display: block; width:100%; height:100%; opacity:0; position:absolute; top:0; left:0; cursor:text;}
			.input {height: 30px; font-size: 16px; color:#fff;  padding:0; letter-spacing: 1.5px;  border:none; border-bottom: 1px solid #4a5766; border-radius: 0; background: transparent; outline: none !important; box-shadow: none; }
			.input[type="password"] { font-size:20px; letter-spacing: 3px;}
			.input[empty2=""] {
				& ~ label{  top:18px;  left: -10px; font-size:16px; cursor:text;}
			}
			.input:focus {
				& ~ label{ color:#0F86FF; position:absolute; top:0; left:-10px; font-size:12px ; *transform:scale(0.7);  }
			}
			
			.inputs {
				.eye { color: $login_area_font-c; font-size:18px; position:absolute; right:0; bottom:5px; transform: rotateY(180deg);}
				.eye:hover  { color: lighten($login_area_font-c, 5) }
			}
			
			
			.dividing {
				position:relative; height:1px; background:#4a5766; 
				&:after {content:'·'; font-family:"微软雅黑"; color:#6f7f90; font-size:30px; text-align: center; line-height:1px; display:block; width: 30px; height:1px;  position:absolute; top:0; left:0; right:0; bottom:0; margin:auto; background:$login_area-bg ;}
			}
			.btn {position:relative;top:5px; border-radius:5px; width:100%; background-color:$login_btn-bg; border:none; outline: none;}
			.btn:hover {background-color:lighten($login_btn-bg , 10);}
			.btn[disabled] { color:$login_area_font-c !important; background-color: #495664 !important; }
			
			.code p {color: #8a9eb3; display:inline-block; width:200px; height:20px;  z-index:11; position:relative;}
			.code .dots {height:30px;}
			.code p .dot {color:red; position:absolute; top:5px;}
			.remember {
				color: $login_area_font-c;
				img {width:15px;}
			}
			.refresh{font-size:17px; color: $login_area_font-c; transition:all ease-in 0.1s; line-height:13px; position:relative; left:10px;   position:relative; top:3px;}
			.refresh:before {font-weight: bolder;}
			.refresh:hover { color: lighten($login_area_font-c, 5) }
			.refresh:active {transform: rotateZ(360deg);}
		}
	}
	footer {
		height:20%;
		position:absolute; bottom:0; left:0; right:0; margin: auto;
		img {height:100%; }
	}
	
	@media screen and (max-height:700px){
		section {
			top:10px; 
		}
		footer{
			img {opacity: 0; transition: all 0.5s ease;}
		}
	}
	.input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {  
	    -webkit-text-fill-color: #ededed !important;  
	    -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;  
	    background-color:transparent !important;  
	    background-opacity: 0 ;
	    background-image: none;  
	     transition: background-color 5000000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间  
	}  
	.input {  
	     background-color:transparent;  
	} 
	
	.ivu-checkbox-inner { background-color: transparent ; border-color:$login_area_font-c ;}
	.ivu-checkbox-checked .ivu-checkbox-inner { background-color: #2d8cf0 ; border-color: #2d8cf0 ; }
}

</style>
