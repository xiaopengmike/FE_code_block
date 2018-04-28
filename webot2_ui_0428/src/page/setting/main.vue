<template>
    <div id="setting">
    	<bar wrapper="wrapper">
    		<subnav primaryNav="设置"></subnav>
    	</bar>
    	<!--<subnav>
    		<template slot="title">
    			工单中心&nbsp;<word-explain keys="工单中心"></word-explain>
	    			&emsp;&emsp;&emsp;
	    			<Icon type="refresh" class="pointer"></Icon>
    		</template>
    		<template slot="content">
    			<ul>
    				<li v-for="nav in navs" v-if="nav.meta.mode.indexOf(getMode)!=-1 && authority[nav.permission]!==0" @click="mynav.isShow=!mynav.isShow">
    					<router-link :to="{'path': nav.url||nav.redirect}">
		                	{{mynav.name}}
		                	<i v-if="nav.url == null" :class="nav.isShow?'glyphicon glyphicon-triangle-right':'glyphicon glyphicon-triangle-bottom'" class="font12"></i>
		                </router-link>
		                <div v-if="nav.url==null" class="inner-nav">
		                 	<ol>
		                 		<li v-for="nav2 in nav.children" :class="nav2.url.split('/')[2] == $store.state.global.path.split('/')[2]&&nav2.url.split('/')[3] == $store.state.global.path.split('/')[3] ?'active':''" v-authority="nav2.permission">
		                            <router-link :to="{'path': nav2.url}">{{nav2.name}}</router-link>
		                        </li>
		                 	</ol>
		                </div>
    				</li>
    			</ul>
    		</template>
    	</subnav>-->
       <!--<span v-authority="'训练模型'" class="btn test-btn pointer" @click="test">训练</span>-->
        <div class="setting">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
	import navArr from '../../config/routes'
    import subnav from '../module/subNavVertical.vue'
    import {mapGetters} from 'vuex'
    import bar from '../module/自定义滚动条.vue'
    export default {
        props:{},
        data(){
            return {
                show:0,
            }
        },
        computed:{
        	...mapGetters(['getMode']),
        	navs(){
        		let navs = [];
        		navArr.some(val=>{
        			if(val.name=='设置'){
        				navs = val.children;
        			}
        		});
        		return navs;
        	}
        },
        methods:{
        },
        components:{
            subnav, bar,
            mapGetters,
        }
    }
</script>
<style lang="scss">
	#setting {
		height:100%;
		padding-left:0 !important;
		padding-right:0 !important;
		display:flex;
		.wrapper{
			max-height:100%;
		}
		.subnav,.setting{
			
		}
		.subnav {
			flex-shrink: 1;
			height:100%;
			border-right:1px solid #eee;
		}
		.setting {
			flex: 1;
			height:100%;
			overflow-y:auto;
		}
	}
    .test-btn {color:#fff; background:#2CB8EB;  border-radius:5px; border:1px solid #fff;}
    .col-right {padding-left: 190px; height: calc(100vh - 70px); overflow-y: auto;}

    #setting h2{font-size: 2rem; padding: 10px 0 5px; font-weight: 600; display: inline-block;}
    #setting article { margin-bottom: 50px }
    #setting article > header {  border-bottom: solid 1px #e5e5e5; position: relative; margin: 0 40px 20px}

    #setting .visitor{margin: 10px 0}
    #setting section header > h3 { margin-bottom: 7px; }
    #setting section header > p{ margin-top: 7px; }
    #setting .visitor span{padding: 6px 30px; border: solid 1px #ccc; cursor: pointer; color: #ccc; line-height: 30px;}
    #setting .visitor span:nth-child(1){ border-right: 0px; }
    #setting .visitor .used{background: #62a8ea; color: white; border-color: #62a8ea; }
    #setting .visitor .unused{background: #999; color: white; border-color: #999; }
    #setting .font-btn { border: none; color: #20a0ff; padding: 0;}
    #setting .font-btn[disabled="disabled"]{color: #ccc}
    #setting span.error {color: red;}
    .setting .ps {line-height:30px; font-size:1.4rem;}
    .setting .ps2 {line-height:30px; color:#999;}
    .setting .section {margin-left:50px;}
    ::-moz-placeholder { color: #d8d8d8 ; }
    ::-webkit-input-placeholder { color: #d8d8d8; }
    :-ms-input-placeholder { color: #d8d8d8; }
</style>
