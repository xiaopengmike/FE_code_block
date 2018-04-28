<template>
    <div class="work-user-detail">
        <my-modals v-model="currentValue" :free="true" class="right-aside">
            <ul class="tabs tabs-2" :class="'active'+AUX.tab_index">
                <li class="tab" @click="AUX.tab_index = 0">工单信息</li>
                <li class="tab" @click="AUX.tab_index = 1">咨询记录</li>
            </ul>
            <div class="body">
                <transition name="fades" mode="out-in">
                    <div class="user_info tab-content" v-show="AUX.tab_index==0">
                        <h5 class="title">
                            <i class="fa fa-th-large"></i>&nbsp;工单信息
                        </h5>
                        <section class="info" v-if="workOrder.creator_id">
                            <Row>
                                <Col span="10">工单号：</Col>
                                <Col span="14">{{workOrder.work_id}}</Col>
                            </Row>
                            <Row>
                                <Col span="10">创建时间：</Col>
                                <Col span="14">{{$api.dateFormat('yyyy-MM-dd',workOrder.created)}}</Col>
                            </Row>
                            <Row>
                                <Col span="10">发起人：</Col>
                                <Col span="14" v-if="workOrder.creator">{{workOrder.creator}}</Col>
                                <Col span="14" v-else>--</Col>
                            </Row>
                            <Row>
                                <Col span="10">处理人/组：</Col>
                                <Col span="14" v-if="workOrder.handler">{{workOrder.handler}}</Col>
                                <Col span="14" v-else>--</Col>
                            </Row>
                            <Row>
                                <Col span="10">分类：</Col>
                                <Col span="14"><font v-html="tag_name"></font></Col>
                            </Row>
                            <Row>
                                <Col span="10">状态：</Col>
                                <Col span="14">{{AUX.workstatus[workOrder.status]}}</Col>
                            </Row>
                            
                        </section>
                        <h5 class="title">
                            <i class="fa fa-user"></i>&nbsp;用户信息
                        </h5>
                        <section class="info">
                            <!--<Row>
                                <Col span="10">用户ID：</Col>
                                <Col span="14">{{workOrder.uid}}</Col>
                            </Row>-->
                            <Row>
                                <Col span="10">姓名：</Col>
                                <Col span="14">{{workOrder.nickname}}</Col>
                            </Row>
                            <Row>
                                <Col span="10">手机：</Col>
                                <Col span="14">{{workOrder.mobile}}</Col>
                            </Row>
                            <Row>
                                <Col span="10">邮箱地址：</Col>
                                <Col span="14">{{workOrder.email}}</Col>
                            </Row>
                        </section>
                    </div>
                </transition>
                <transition name="fades" mode="out-in">
                    <div class="tab-content" v-show="AUX.tab_index==1">
                        <div v-if="!session.session_id" class="text-center vertical-center_wrap font14" style="width:100%;height:100%;">
                        	<span class="vertical-center" style="color:#b8c9d3;">暂无咨询记录</span>
                        </div>
                        <chatbox v-if="session.session_id && session.historys &&  session.historys.length>0" :session="session" :show-recommend-answer="false"></chatbox>
                    </div>
                </transition>
            </div>
            <div class="footer">
                <button v-if="workOrder.uid==''" class="my-btn my-btn-disabled">&emsp;&emsp;激活会话&emsp;&emsp;</button>
                <button v-else-if="$store.state.global.path.indexOf('servicer')!=-1" class="my-btn my-btn-transparent" @click="startSession">&emsp;&emsp;激活会话&emsp;&emsp;</button>
                <button v-else class="my-btn my-btn-transparent" @click="$api.warn('请在客服模式下激活！')">&emsp;&emsp;激活会话&emsp;&emsp;</button>
            </div>
        </my-modals>
    </div>
</template>

<script>
    import chatbox from '../../servicer/chatbox'
    import sessions_mixin from '../../servicer/mixin/sessions.js'
    export default {
        props:{
            workOrder:{
                type:Object,
                default:true,
            },
            session:{
                type:Object,
                default:true,
            },
            tags:{
            	required:true,
            },
            value: true,
        },
        mixins: [sessions_mixin],
        data(){
            return {
                AUX:{
                    tab_index:0,
                    workstatus:{
						0: "未受理",
						1: "已受理",
						2: "已解决"
					},
                },
            }
        },
        created(){
        },
        methods:{
            startSession(){
            	let v = this;
                let s ={
                    session_id:this.workOrder.uid,
                    uid:this.workOrder.uid,
                } ;
                this.mixin_激活会话(s)
                .then(()=>{
                	let 索引 = v.sessions索引[s.session_id];
					if(索引){
						v.mixin_changeSessionStatus(s.session_id, 1);
					}else{
						s.status = 1;
						v.mixin_sessionsPush(s);
					}
					v.session_current_id = s.session_id;
					v.$router.push('/servicer/session');
                })
            },
        },
        computed: {

            // 问题检测:{
            //     get(){
            //         return this.$store.state.global.问题检测;
            //     },
            //     set(val){
            //         this.$store.state.global.问题检测 = val;
            //     }
            // },
            currentValue: {
                // 动态计算currentValue的值
                get:function() {
                    return this.value; // 将props中的value赋值给currentValue
                },
                set:function(val) {
                    this.$emit('input', val); // 通过$emit触发父组件
                }
            },
            tag_name(){
            	let name="";
            	for(let i=0;i<this.tags.length;i++){
            		if(this.tags[i].id==this.workOrder.tag1){
            			name += this.tags[i].name+"&emsp;";
            			if(this.workOrder.tag2){
            				for(let j=0;j<this.tags[i].child.length;j++){
            					if(this.tags[i].child[j].id==this.workOrder.tag2){
            						name += this.tags[i].child[j].name;
            					}
            				}
            			}
            			break;
            		}
            	}
            	return name;
            },
        },
        components:{
            chatbox,
        },
        watch:{

        },
        filters: {
        },
    }
</script>

<style lang="scss">
    .work-user-detail{
        .right-aside{
            background:#fafcfd;
            .tabs {height:65px; line-height:65px;}
            .body{
                width:100%;
                position:relative;
                overflow-x:hidden;
                height:calc(100% - 65px - 50px );
                .user_info {padding:0 15px;}
                .tab-content{
                    width:100%;
                    height:100%;
                    position:absolute;
                    top:0; left:0;
                }
            }
            
            .footer {
                height:50px; line-height:50px;
                text-align:center;
                background:#f3f7f9;
            }
        }
    }
</style>
