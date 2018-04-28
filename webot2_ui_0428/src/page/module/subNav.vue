<template>
	<div id="subNav">
		<ul class="nav2">
			<li v-for="(nav,index) in navs" :class="$store.state.global.path.indexOf(nav.path)==0?'active':''" @click="$store.state.global.path=nav.path" v-if="authority[nav.permission]!==0">
	            <router-link  v-if="nav.show" :to="nav.path"><div class="name">{{nav.name}}<span class="info"></span></div></router-link>
	        </li>
		</ul>
	</div>
</template>
<script>
	import navArr from '../../config/routes'
	import {mapGetters,mapActions} from 'vuex'
	export default {
		props:['primaryNav'],
		data(){
			return {
			}
		},
		computed:{
			navs:function(){  
				let v = this;
				let nav=[] ;
				if(v.$store.state.global.mode=='admin'){
					for(let i=0;i<navArr.length;i++){   
						if(navArr[i].name==v.primaryNav){
							nav = navArr[i].children;
							break;
						}
					}
				}
				else{
					for(let i=navArr.length-1;i>0;i--){   
						if(navArr[i].name=='客服模式'){
							nav = navArr[i].children;
							for(let j=0;j<nav.length;j++){
								if(nav[j].name==v.primaryNav){
									nav = nav[j].children;
									break;
								}
							}
							break;
						}
					}
				}
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
	#subNav { 
		
		ul{
			&.nav2{
				li{
					line-height:57px;
					a{
						height:100%;
						display:block;
						position:relative;
						&.active {background:#fff;}
						.name{
							
							.info{position:absolute; top:0; bottom:0; right:20px; margin:auto;}
						}
					}
				}
			}
		}
	}
	#subNav ul.nav2 {display:inline-block; background: #fff; border-radius:5px; margin:3px 3px 3px 20px; overflow:hidden;}
	#subNav ul.nav2 li a {font-size:20px; color:#2bb3f3; padding:2px 10px; display:inline-block; text-decoration:none;}
	#subNav ul.nav2 li.active a{ color:#fff;  background:#2bb3f3; border-radius:5px;}
	#subNav ul.nav2 li {display:inline-block;}
</style>