<!-- 竖版子导航 -->
<template>
    <nav id="subnav-v">
        <ul>
            <li v-for="mynav in mynavs" v-if="mynav.meta.mode.indexOf(getMode)!=-1 && authority[mynav.permission]!==0" @click="mynav.isShow=!mynav.isShow" class="outer-nav live" :class="{'active': mynav.path.split('/')[2] == $store.state.global.path.split('/')[2]}"  
            	> 
                <router-link :to="{'path': mynav.url||mynav.redirect}">
                	{{mynav.name}}
                	<i v-if="mynav.url == null" :class="mynav.isShow?'glyphicon glyphicon-triangle-right':'glyphicon glyphicon-triangle-bottom'" class="font12"></i>
                </router-link>
                <div v-if="mynav.url==null" class="inner-nav">
                    <!--<div @click="mynav.isShow=!mynav.isShow">{{mynav.name}}</div>-->
                    <ul class="nav2" v-show="!mynav.isShow" @click.stop=''>
                        <li v-for="nav in mynav.child" :class="nav.url.split('/')[2] == $store.state.global.path.split('/')[2]&&nav.url.split('/')[3] == $store.state.global.path.split('/')[3] ?'active':''" @click="nowActive=nav.url" v-authority="nav.permission">
                            <router-link :to="{'path': nav.url}">{{nav.name}}</router-link>
                        </li>
                    </ul>            
                </div>
            </li>
        </ul>
    </nav>
</template>
<script>
    import navArr from '../../config/routes'
    import {mapGetters,mapActions} from 'vuex'
    export default {
        props:['primaryNav'],
        data(){
            return {
                // now:localStorage.path,
                nowActive: window.location.hash.substr(1),
                mynavs: [{
                    name: "个人信息设置",
                    url: "/setting/userInfo",
                    path: "/setting/userInfo",
                    permission:'设置-个人信息设置',
                    meta:{
                    	mode:['admin']
                    },
                },
                {
                    name: "个人信息设置",
                    url: "/servicer/userInfo",
                    path: "/servicer/userInfo",
                    permission:'设置-个人信息设置',
                    meta:{
                    	mode:['servicer']
                    },
                },
                {
                    name: "公司信息设置",
                    url: "/setting/companyInfo",
                    path: "/setting/companyInfo",
                    permission:'设置-公司信息设置',
                    meta:{
                    	mode:['admin']
                    },
                },
                {
                    name: "在线服务设置",
                    isShow: false,
                    permission:'设置-在线服务设置',
                    path: "/setting/online",
                    redirect:'/setting/online/base',
                    meta:{
                    	mode:['admin']
                    },
                    child: [{
                        name: "基础设置",
                        url: "/setting/online/base",
                        permission:'设置-在线服务设置-基础设置',
                    },{
                        name: "会话分配设置",
                        url: "/setting/online/sessionAllocation",
                        permission:'设置-在线服务设置-会话分配设置',
                    },{
                        name: "满意度设置",
                        url: "/setting/online/satisfaction",
                        permission:'设置-在线服务设置-满意度设置',
                    },{
                        name: "统计设置",
                        url: "/setting/online/timeStopServer",
                        permission:'设置-在线服务设置-统计设置',
                    },{
                        name: "留言设置",
                        url: "/setting/online/leaveMessage",
                        permission:'设置-在线服务设置-留言设置',
                    },{
                        name: "会话超时设置",
                        url: "/setting/online/session_timeout",
                        permission:'设置-在线服务设置-会话超时设置',
                    }]
                },
                {
                    name: "接入设置",
                    isShow: false,
                    permission:'设置-接入设置',
                    path: "/setting/join",
                    redirect:'/setting/join/web',
                     meta:{
                    	mode:['admin']
                    },
                    child: [{
                        name: "网站接入",
                        url: "/setting/join/web",
                        permission:'设置-接入设置-网站接入',
                    },{
                        name: "微信接入",
                        url: "/setting/join/wechat",
                        permission:'设置-接入设置-微信接入',
                    },{
                        name: "信息对接",
                        url: "/setting/join/CRMInfo",
                        permission:'设置-接入设置-信息对接',
                    }]
                },{
                    name: "机器人设置",
                    isShow: false,
                    permission:'设置-机器人设置',
                    path: "/setting/robot",
                    redirect:'/setting/robot/base',
                     meta:{
                    	mode:['admin']
                    },
                    child: [{
                        name: "基础设置",
                        url: "/setting/robot/base",
                        permission:'设置-机器人设置-基础设置',
                    },{
                        name: "常见问题设置",
                        url: "/setting/robot/questions",
                        permission:'设置-机器人设置-常见问题设置',
                    }]

                },{
                    name: "快捷回复",
                    isShow: false,
                    permission:'设置-快捷回复',
                    path: "/setting/quickFB",
                    redirect:'/setting/quickFB/common',
                     meta:{
                    	mode:['admin']
                    },
                    child: [{
                        name: "公有库",
                        url: "/setting/quickFB/common",
                        permission:'设置-快捷回复-公有库',
                    },{
                        name: "私有库",
                        url: "/setting/quickFB/private",
                        permission:'设置-快捷回复-私有库',
                    }]

                },
                {
                    name: "快捷回复",
                    isShow: false,
                    permission:'设置-快捷回复',
                    path: "/servicer/quickFB",
                    redirect:'/servicer/quickFB/common',
                     meta:{
                    	mode:['servicer']
                    },
                    child: [{
                        name: "公有库",
                        url: "/servicer/quickFB/common",
                        permission:'设置-快捷回复-公有库',
                    },{
                        name: "私有库",
                        url: "/servicer/quickFB/private",
                        permission:'设置-快捷回复-私有库',
                    }]

                }]
            }
        },
        // computed:{
        //     navs:function(){  
        //         var v = this;
        //         var nav ;
        //         for(var i=0;i<navArr.length;i++){   
        //             if(navArr[i].name==v.primaryNav){
        //                 nav = navArr[i].children;
        //                 break;
        //             }
        //         }
        //         return nav;
        //     }
        // },
        computed:{
        	...mapGetters(['getMode']),
        	authority:function(){
			  	if(this.$store.state.global.authority[this.$store.state.global.user.role])
			  		return this.$store.state.global.authority[this.$store.state.global.user.role].permissions;
			  	else
			  		return undefined;
			  }
        },
        components:{
		  	mapGetters,
		  	mapActions,
		}
    }
</script>
<style>
    #subnav-v {width: 185px; font-size: 12px;}
    #subnav-v .outer-nav {font-size: 15px; color: #6E6D6B; line-height:35px; cursor: pointer;}
    #subnav-v ul.nav2 {border-radius:5px; overflow:hidden;}
    #subnav-v .outer-nav a i {position:absolute; right:10px; top:16px;}
    
    #subnav-v ul li a {font-size:15px; color:#6E6D6B; padding:2px 40px; width: 100%;display:inline-block; margin:3px 0; text-decoration:none;position:relative;}
    #subnav-v .outer-nav a{ padding: 5px 20px; }
    #subnav-v .inner-nav a {padding:5px 40px;}
    #subnav-v ul li.active{  background:#f6f8f9;}
    #subnav-v ul li.active > a{ color:#2bb3f3; border-radius:5px;}
    #subnav-v::-webkit-scrollbar {
    width: 7px;
    height:7px;
    }
    #subnav-v::-webkit-scrollbar-button {
    display: none;
    }
    #subnav-v::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #dddfe0;
    }
    #subnav-v::-webkit-scrollbar-track {
    width: 7px;
    height: 7px;
    }
    #subnav-v::-webkit-scrollbar-track-piece {
    background: transparent;
    }
</style>