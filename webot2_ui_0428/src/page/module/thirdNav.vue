<template>
	<div class="thirdNav">
		<ul class="nav3 ">
			<li v-for="(nav,index) in navs" :class="now.indexOf(nav.path)==0?'active':''" @click="now=nav.path" v-if="authority[nav.permission]!==0&&nav.show">
	            <router-link  :to="nav.path">{{nav.name}}</router-link>
	        </li>
		</ul>
	</div>
</template>
<script>
	import navArr from '../../config/routes'
	import {mapGetters,mapActions} from 'vuex'
	export default {
		props:['primaryNav','subNav'],
		data(){
			return {
				now:window.location.hash.substr(1),
			}
		},
		computed:{
			navs:function(){  
				var v = this;
				var nav =[];
				navArr.forEach((val,i)=>{
					if(val.name==v.primaryNav){
						val.children.forEach((val2,j)=>{
							if(val2.name == v.subNav){
								nav = val2.children;
								return nav;
							}
						})
						return nav;
					}
				})
				return nav;
			},
			authority:function(){
			  	if(this.$store.state.global.authority[this.$store.state.global.user.role])
			  		return this.$store.state.global.authority[this.$store.state.global.user.role].permissions;
			  	else
			  		return undefined;
			  }
		},
		methods:{
			
		},
		components:{
		  	mapGetters,
		  	mapActions,
		}
	}
</script>
<style lang="scss">
	@import "../../assets/scss/color.scss";
	.thirdNav{
		padding-top:10px; font-size:14px;
		.nav3 {
			border-bottom:0.5px solid $nav3BorderColor;
			li{
				width:130px; height:40px; line-height:40px;
				position:relative;
				display: inline-block;
				vertical-align:top;
				border-width:1px 1px 0 0;
				border-style: solid;
				border-color:$nav3BorderColor;
				&:first-child {border-left-width:1px;}
				&.active {
					&:before {content:'';width:100%; height:2px; background:#0f86ff; position:absolute; left:0;top:-1px;}
					&:after{content:''; width:100%; height:2px; background:#fff; position:absolute; left:0px; bottom:-2px; z-index:3;}
					a{
						color:#343f4b;
						height:auto;
						background:#fff;
						text-decoration:none;
					}
				}
				a {
					width:100%; height:100%;
					background:#f4fafd;
					display:block;
					text-align: center;
					color:#748392;
					&:hover {background:#fff;}
				}
			}
		}
		
	}
</style>