<template>
    <div class="join-wechat">
        <article class="setting">
            <header><h2>微信接入</h2></header>
            <section>
                <p>绑定后你可以让客服平台收到微信的客户咨询</p>
                <el-button type="primary" class="go-bind"><a :href="bind_url">去微信平台绑定</a></el-button>
                <ul>
                    <li><i class="circle-icon"></i>你的公众号必须是认证过的微信订阅号或服务号，否则无法正常回复顾客对话</li>
                    <li><i class="circle-icon"></i>绑定后，微信公众号原先配置的自动回复可能与客服消息冲突，建议将自动回复迁移至客服平台</li>
                </ul>
            </section>
        </article>
        <article class="setting">
            <header><h2>已绑定公众号</h2></header>
            <section class="binds">
                <el-row style="min-height:115px;">
                    <el-col class="a-bind" v-for="(wechat, index) in wechats">
                        <el-popover
                          placement="top"
                          width="290"
                          trigger="hover"
                          v-model="details[index]"
                          >
                            <ul class="tips">
                                <li class="no-margin">
                                    <p><span class="key">公众号类型</span>:<span>{{getWechatType(wechat.service_type_info.id)}}</span></p>
                                </li>
                                <li>
                                    <p><span class="key">原始ID</span>:<span>{{wechat.user_name}}</span></p>
                                </li>
                                <li>
                                    <p><span class="key">主体名称</span>:<span>{{wechat.principal_name}}</span></p>
                                </li>
                                <li>
                                    <p><span class="key">微信门店</span>:<span>{{getOpenOrNot(wechat.business_info.open_store)}}</span></p>
                                </li>
                                <li>
                                    <p><span class="key">微信扫商品</span>:<span>{{getOpenOrNot(wechat.business_info.open_scan)}}</span></p>
                                </li>
                                <li>
                                    <p><span class="key">微信支付</span>:<span>{{getOpenOrNot(wechat.business_info.open_pay)}}</span></p>
                                </li>
                                <li>
                                    <p><span class="key">微信卡券</span>:<span>{{getOpenOrNot(wechat.business_info.open_card)}}</span></p>
                                </li>
                                <li>
                                    <p><span class="key">微信摇一摇</span>:<span>{{getOpenOrNot(wechat.business_info.open_shake)}}</span></p>
                                </li>
                                <li class="qrcode">
                                    <img :src="wechat.qrcode_url" alt="微信二维码">
                                </li>

                            </ul>
                            <el-card  class="clearfix" slot="reference">
                                <img :src="wechat.head_img" alt="">
                                <div>
                                    <p>{{wechat.nick_name}}</p>
                                    <p @click="unbind(wechat)"><a href="https://mp.weixin.qq.com/" target="_blan">解绑链接</a></p>
                                </div>   
                            </el-card>
                        </el-popover>

                    </el-col>
                </el-row>
            </section>
            <section v-if="wechats.length>0" class="unbind-view">
                <h3>解绑微信公众号步骤</h3>
                <!-- <img src="../../assets/img/unbind-view.jpg" alt="" @click="toShowImg"> -->
                <img src="../../assets/img/unbind-view.jpg" alt="">
            </section>
        </article>
<!--         <el-dialog v-model="showBigImg" width="100%" :before-close="toCloseImg">
            <img src="../../assets/img/unbind-view.jpg" alt="">
        </el-dialog>   -->     
    </div>

</template>
<script>
    import subNav from '../module/subNavVertical.vue'
    
    export default {
        props:{},
        data(){
            return {
                show:0,
                bind_url: "",
                showBigImg: false,
                details: [],
                wechats: []
            }
        },
        created(){
            this.getUrl();
        },
        methods:{
            getUrl(){
                let v = this;
                v.$api.ajax('/chats/bind', 'get').then(data=>{
                    v.bind_url = data.to_bind_url;
                    let _wechats = [];
                    for(let i in data.wechats){
                        _wechats.push(data.wechats[i].authorizer_info)
                    }
                    v.wechats = _wechats;
                    v.details = new Array(_wechats.length)
                })
            },
            unbind(wechat){

            },
            funcShowImg(e){
                var els = document.getElementsByClassName("el-dialog--small")
                var el =  els.length > 0 ? els[0] : undefined;
                var body = document.body.clientWidth;
                var body_height =  document.body.clientHeight;
                var min_height = body_height*0.6;
                var max_height = body_height*1.5;
                
                if(e.deltaY>0 && el && el.clientHeight < max_height){ //向下滚
                    el.style.height = el.clientHeight+50+"px"
                }else if(el&&el.clientHeight>min_height){
                    el.style.height = el.clientHeight-50+"px"
                }
                if(el.clientWidth>body){
                    var left = (el.clientWidth)/2
                    el.style.left = left+"px";
                }
            },
            toShowImg(){
                document.addEventListener("mousewheel", this.funcShowImg,false)
                this.showBigImg = true
            },
            toCloseImg(){
                document.removeEventListener("mousewheel", this.funcShowImg, false);
                this.showBigImg = false
            },
            getOpenOrNot(num){
                num = parseInt(num)
                return ["未开通", "已开通"][num]
            },
            getWechatType(type_num){
                type_num = parseInt(type_num)
                return ["订阅号", "订阅号","服务号"][type_num]
            },
        },
        components:{
            subNav,
        },
        mounted(){

        },
    }
</script>
<style>
    .join-wechat {padding: 0 40px;}
    #setting .join-wechat header {margin: 0 0 20px;}
    .join-wechat header{font-size: 2rem; border-bottom: solid 1px #000;font-weight: 600}
    .join-wechat section {font-size:1.4rem; margin-left:10px;}
    .join-wechat .go-bind {padding: 0;}
    .join-wechat .go-bind span{padding: 10px 0; display: block;}
    .join-wechat .go-bind a{padding: 10px 15px;}
    .join-wechat p {margin: 20px 0 10px; font-size: 1.4rem;}
    .join-wechat button a {color: white}
    .join-wechat button a:hover{ color: inherit; text-decoration: none}
    .join-wechat li {margin-top: 10px; font-size: 1.4rem;}
    .join-wechat ul li:nth-child(2) {margin-top: 5px;} 
    .join-wechat .el-card { height: 90px; overflow: hidden; border-color: #e5e5e5; box-shadow: none;}
    .join-wechat .el-card {
        transition:all 0.2s;
        -moz-transition:all 0.2s; /* Firefox 4 */
        -webkit-transition:all 0.2s; /* Safari and Chrome */
        -o-transition:all 0.2s; /* Opera */
    }
    .join-wechat .el-card:hover {box-shadow: 0 1px 4px 2px rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);}
    .join-wechat .el-card__body {padding: 10px;}
    .join-wechat .a-bind {position: relative; width: 220px; margin-bottom: 25px;}
    .join-wechat .a-bind:nth-child(n-2) {margin-right: 20px;}
    .join-wechat .a-bind img{height: 70px; float: left; margin-right: 25px;}
    .join-wechat .a-bind .el-card p{margin: 0; height: 35px; vertical-align: top; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;}
    .join-wechat .a-bind .el-card p:nth-child(1){font-size: 15px;}
    .join-wechat .a-bind .el-card p:nth-child(2){vertical-align: bottom;  display: table-cell; cursor: pointer; color: #20a0ff; font-size: 13px;}
    .join-wechat .el-card a {text-decoration: none; color: #20a0ff;}
    .join-wechat .tips { position: absolute; left: 60%; top: 50%; width: 365px; z-index: 99; border: solid 1px #e5e5e5; background: #fff; padding: 10px;}

    .join-wechat .unbind-view {border-top: solid 1px #e5e5e5; padding-top: 20px;}
    .join-wechat .unbind-view h3 {margin-bottom: 20px; font-size: 15px; font-weight: 700;}
    .join-wechat .unbind-view img{width: 100%;}
    .join-wechat .el-dialog img {height: 100%;}
    .join-wechat .el-dialog--small {width: auto; height: 70%}
    .join-wechat .el-dialog__body{height: 100%}

    .el-popover .a-bind:hover .tips {display: block; }
    .el-popover .no-margin {margin: 0;}
    .el-popover .tips .key {width: 64px; display: inline-block; padding: 0 0 0 10px; position: relative; box-sizing: content-box;}
/*    .el-popover .tips .key::before{content: ""; display: block; border-radius: 50%; width: 8px; height: 8px; background: #c5d6df; position: absolute; left: 0; top: 0; bottom: 0; margin: auto;}*/
    .el-popover .tips .key + span{margin-left: 5px;}
    .el-popover .tips p{margin: 0;}

    .el-popover .qrcode {position: absolute; right: 0; bottom: 0}
    .el-popover .qrcode img {margin: 10px; height: 80px;}
/*    .join-wechat .a-bind p{margin: 0 0 0 0; position: relative;}
    .join-wechat .a-bind p:nth-child(1) {top: -4px;}
    .join-wechat .a-bind p:nth-child(2) {top: 40px;}*/
    /*.join-wechat .a-bind > div {height: 100%;}*/
    .clearfix{ overflow: auto; zoom: 1; }
    .circle-icon {display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #777; margin-right: 5px;}
</style>
