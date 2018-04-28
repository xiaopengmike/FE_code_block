<template>
    <div class="quality">
        <subnav class="quality_nav" :width="185">
            <template slot="title">
                质量质检
                    &emsp;&emsp;&emsp;
                   
            </template>
            <template slot="content">
                <ul>
                    <template>
                        <li v-for="(obj,key) in status_list" @click="changeCondition(obj)" :class="{active:condition.effective&&condition.name==obj.name}">
                            <router-link :to="{path:'/qualityTest/list',query:obj}">
                                {{obj.name}}<span class="num">{{obj.num}}</span>
                            </router-link>  
                        </li>
                        <li :class="{active:!condition.effective}" @click="changeCondition()">
                            <router-link to="/qualityTest/tag">
                                <span>质检设置</span>
                            </router-link>
                        </li>
                    </template>
                </ul>
            </template>
        </subnav>
        <div class="quality_content">
            <router-view :condition="condition" :refreshList="refresh.time" @changeNum="changeNum"></router-view>
        </div>
    </div>
</template>
<script>
    import bar from '../module/自定义滚动条.vue'
    import subnav from '../module/left-aside.vue'
    export default {
        props:{},
        data(){
            function genNav(name, uri){
                return {
                    name: name,
                    uri: uri,
                    status: '',
                    num: '',
                    effective: true
                }
            };
            return {
                show:true,
                refresh:{
                    rotate:0,
                    can:true,
                    time:0
                },
                status_list:{
                    all: genNav('会话质检', '/qualities/session'),
                    quality_result: genNav('质检结果', '/qualities/result')
                },
                condition:{
                    name:'会话质检',
                    status:'',
                    uri:'/qualities/session',
                    user_id:'',
                    effective:true,
                    // action:'',
                }
               
            }
        },
        created(){
			this.judgeQuery();
		},
		updated() {
            // this.judgeQuery(); // 多次改变 condition 导致 重复请求list接口
		},
        methods:{
        	judgeQuery(){
				if(!this.$api.isEmptyObj(this.$router.currentRoute.query) && this.$router.currentRoute.query.name)
	        		this.condition = this.$router.currentRoute.query;
				if(this.$router.currentRoute.path.indexOf('tag') != -1) {
					this.condition.effective = false;
				}
			},
            changeCondition(s=undefined){
                let v = this;
                if(!s){
                    v.condition.effective=false;
                }else{
                    v.condition = v.$api.deepCopy(s);	
                }
            },
            changeNum(list){
                let v = this;
                for(let i in v.status_list){
                    if(list[i]!==undefined){
                        v.status_list[i].num = '';
                    }
                    if(list[i]){                                            
                        v.status_list[i].num = list[i];
                    }
                }
            }
        },
        components:{
            bar,subnav,
        },
        watch:{
            'refresh.time':function(n){
                if(!this.refresh.can){
                    return ;
                }else{
                    this.refresh.rotate += 360*3;
                    this.refresh.can = false;
                    setTimeout(()=>{
                        this.refresh.can = true;
                    },1000)
                }
            }
        }
    }
</script>
<style lang="scss">
    $navItemHeight:60px;
    $navWidth:185px;
    .quality{
        height:100%;
        display:flex;
        padding-left:0 !important;
        padding-right:0 !important;
        &>div {height:100%;}
        .quality_nav{
            .page_title2 .fa-refresh {transition:all 3s ease-in-out;}
        }
        /*.quality_nav {
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
        .quality_content{
            flex:1;
            padding:0 20px;
            height:100%;
            overflow-y:auto;
        }
    }
</style>
