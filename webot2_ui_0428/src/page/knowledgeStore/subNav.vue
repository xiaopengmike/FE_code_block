<template>
	<div id="subNav">
		<ul class="nav2">
			<li v-for="(nav,index) in navs" :class="nav.path.indexOf(now)==0 ?'active':''" @click="now=nav.path">
	            <router-link  v-if="nav.show" :to="nav.path">{{nav.name}}</router-link>
	        </li>
		</ul>
	</div>
</template>
<script>
	import navArr from '../../config/routes'
	export default {
		props:['primaryNav'],
		data(){
			return {
				now:localStorage.path,
			}
		},
		computed:{
			navs:function(){  
				var v = this;
				var nav ;
				for(var i=0;i<navArr.length;i++){   
					if(navArr[i].name==v.primaryNav){
						nav = navArr[i].children;
						break;
					}
				}
				return nav;
			}
		},
		
	}
</script>
<style>
	#subNav { padding:19px 0 18px; background:#2bb3f3; min-width:700px;}
	ul.nav2 {display:inline-block; background: #fff; margin-left:20px; border-radius:5px; overflow:hidden;}
	ul.nav2 li a {font-size:20px; color:#2bb3f3; padding:2px 10px; display:inline-block; margin:3px; text-decoration:none;}
	ul.nav2 li.active a{ color:#fff;  background:#2bb3f3; border-radius:5px;}
	ul.nav2 li {display:inline-block;}
</style>