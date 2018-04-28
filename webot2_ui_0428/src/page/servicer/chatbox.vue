<template>
    <div class="__chatbox">
        <bar :wrapper="'wrapper'" :scrollTop="session.scroll">
            <div :id="id" ref="community_wrap">
                <div v-show="session.can_get_historys && session.historys" class="get-history-wrap">
                	<i v-show="session.getting_historys" class="el-icon-loading"></i>
                	<a v-show="!session.getting_historys&&session.historys_page.page*session.historys_page.size-session.original_historys.length>session.historys_page.size" @click="加载历史()">点击加载</a>
                </div>
                <template v-for="(c,i) in session.historys">
                    <div v-if="c.msg_type=='info2'">
                        <p v-if="c.info" class="infos text-center"><span class="opcity9">{{c.info_b}}</span>&emsp;{{c.info}}&emsp;<span class="opcity9">{{c.info_b}}</span></p>
                        <p v-if="c.times" class="times text-center"><span>{{c.times}}</span></p>
                    </div>
                    <div v-if="c.msg_type=='info'">
                        <p v-if="c.info" class="infos text-center">{{c.info}}</p>
                        <p v-if="c.times" class="times text-center"><span>{{c.times}}</span></p>
                    </div>
                    <div v-if="c.msg_type=='event'">
                    	<p v-if="c.event_type=='recall'" class="text-center infos">{{kfs_info[c.kf_id]?kfs_info[c.kf_id].nickname : c.kf_id}} 撤回了一条消息</p>
                        <p v-else class="text-center infos">{{$api.dateFormat('yyyy-MM-dd hh:mm:ss',c.time)}}&emsp;{{c.text}}</p>
                    </div>
                    <template v-if="c.msg_type=='text'">
                        <div v-if="c.from=='kf'"  class="servicer tell">
                            <div class="item-control-wrap">
                           		<div class="item-control-wrap2">
                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
                           		</div>
                           </div>
                            <div class="content">
                                <div v-if="c.text.indexOf(find.text)!=-1" class="txt _find" v-html="strToHtml(c.text)"></div>
                                <div v-else class="txt" v-html="strToHtml(c.text)"></div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <span class="icon"><img :src="computedKfHead(c.kf_id)" /></span>
                        </div>
                        <div v-if="c.from=='user'" class="guest tell">
							<span class="icon">
								<template v-if="session.head"><img :src="session.head" /></template>
								<template v-else><div class="icon_txt">{{session.session_id.slice(-2)}}</div></template>
							</span>
                            <div class="content">
                                <div v-if="c.text.indexOf(find.text)!=-1"  class="txt _find" v-html="strToHtml(c.text)"></div>
                                <div v-else class="txt" v-html="strToHtml(c.text)"></div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <b v-if="showRecommendAnswer"><recommend-answers class="recommend-answers" :question="c.text"  @pushAnswer="pushAnswer" @pushRichText="pushRichText" @searchKnow="searchKnow"></recommend-answers></b>
                        </div>
                    </template>
                    <template v-if="c.msg_type=='qa'">
                        <div class="guest tell">
							<span class="icon">
								<template v-if="session.head"><img :src="session.head" /></template>
								<template v-else><div class="icon_txt">{{session.session_id.slice(-2)}}</div></template>
							</span>
                            <div class="content">
                                <div v-if="c.qa.question && c.qa.question.indexOf(find.text)!=-1"  class="txt _find" v-html="strToHtml(c.qa.question)"></div>
                                <div v-else class="txt" v-html="strToHtml(c.qa.question)"></div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <b v-if="showRecommendAnswer"><recommend-answers  :question="c.qa.question"  @pushAnswer="pushAnswer" @pushRichText="pushRichText" @searchKnow="searchKnow"></recommend-answers></b>
                        </div>

                        <template v-if="!c.qa.rich_answer||c.qa.rich_answer.length==0">
                            <div class="servicer tell">
                                <b><i class=""></i></b>
                                <div class="content">
                                    <div v-if="c.qa.answer && c.qa.answer.indexOf(find.text)!=-1" class="txt _find" v-html="strToHtml(c.qa.answer)"></div>
                                    <div v-else class="txt" v-html="strToHtml(c.qa.answer)"></div>
                                    <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                </div>
                                <span class="icon"><img  :src="computedKfHead(c.kf_id)" /></span>
                            </div>
                        </template>
                        <template v-if="c.qa.rich_answer&&c.qa.rich_answer.length!=0">
                            <template v-for="r in c.qa.rich_answer">
                                <div v-if="r.type=='text'" class="servicer tell">
                                    <div class="content">
                                        <div v-if="r.text.indexOf(find.text)!=-1" class="txt _find" v-html="strToHtml(r.text)"></div>
                                        <div v-else class="txt" v-html="strToHtml(r.text)"></div>
                                        <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                    </div>
                                    <span class="icon"><img :src="computedKfHead(c.kf_id)" /></span>
                                </div>
                                <div v-if="r.type=='image'"  class="servicer tell">
                                    <div class="content">
                                        <div class="img">
                                            <img v-if="r.url===''" src="../../assets/img/loading_middle.gif"  />
                                            <img v-if="r.url===false" src="../../assets/img/bad_img.png" @click="reupload(r.file)" />
                                            <img v-if="r.url" :src="r.url" @click="!r.error?enlargement(r.url):r.url=r.url+'?'+Math.random()" @load="c.media.error=false;scrollBottom();" @error="c.media.error=true" :class="c.media.error?'false':''" class="pointer" />
                                        </div>
                                        <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                    </div>
                                    <span class="icon"><img  :src="computedKfHead(c.kf_id)"/></span>
                                </div>
                                <div v-if="r.type=='audio'||r.type=='video'"  class="servicer tell">
                                    <div class="content">
                                        <div class="file">
                                            <div class="file_icon"></div>
                                            <div>
                                                <p :title="r.name">{{r.name}}</p>
                                                <p>
                                                    <span>{{(r.size/1024).toFixed(2)}}kb</span>&emsp;<a :href="r.url"  target="_self" :download="r.name" class="pull-right">下载</a>

                                                </p>
                                            </div>
                                        </div>
                                        <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                    </div>
                                    <span class="icon"><img  :src="computedKfHead(c.kf_id)" /></span>
                                </div>
                            </template>
                        </template>
                        <template v-if="c.qa.rich_text">
                            <div class="servicer tell">
                                <div class="content">
                                    <iframes :url="c.qa.rich_text.url"></iframes>
                                    <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                </div>
                                <span class="icon"><img :src="computedKfHead(c.kf_id)" /></span>
                            </div>
                        </template>
                        <div v-if="c.qa.recommend_question &&c.qa.recommend_question.length>0" class="servicer recommends tell">
                            <div class="content">
                                <section class="lists">
                                    <p class="infos">{{c.qa.recommend_head||'您是不是想问：'}}</p>
                                    <ul>
                                        <li v-for="(re,i) in c.qa.recommend_question" :title="re" >&emsp;{{i+1}}.&nbsp;{{re}}&emsp;</li>
                                        <li>&emsp;{{c.qa.recommend_question.length+1}}.&nbsp;{{c.qa.recommend_end}}&emsp;</li>
                                    </ul>
                                </section>
                            </div>
                            <span class="icon" style="opacity:0;"></span>
                        </div>
                    </template>
                    <template v-if="c.msg_type=='image'">
                        <div v-if="c.from=='kf'"  class="servicer tell">
                            <div class="item-control-wrap">
                           		<div class="item-control-wrap2">
                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
                           		</div>
                           </div>
                            <div class="content">
                                <div class="img">
                                    <img v-if="c.media.url===''" src="../../assets/img/loading_middle.gif"  />
                                    <img v-if="c.media.url===false" src="../../assets/img/bad_img.png" @click="reupload(c.media.file)" />
                                    <img v-if="c.media.url" :src="c.media.url" @click="!c.media.error?enlargement(c.media.url):c.media.url=c.media.url+'?'+Math.random()" @load="c.media.error=false;scrollBottom();" @error="c.media.error=true" :class="c.media.error?'false':''" class="pointer" />
                                </div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <span class="icon"><img  :src="computedKfHead(c.kf_id)"/></span>
                        </div>
                        <div v-if="c.from=='user'" class="guest tell">
							<span class="icon">
								<template v-if="session.head"><img :src="session.head" /></template>
								<template v-else><div class="icon_txt">{{session.session_id.slice(-2)}}</div></template>
							</span>
                            <div class="content">
                                <div class="img">
                                    <img v-if="c.media.url===''" src="../../assets/img/loading_middle.gif"  />
                                    <img v-if="c.media.url===false" src="../../assets/img/bad_img.png" @click="reupload(c.media.file)" />
                                    <img v-if="c.media.url" :src="c.media.url" @click="!c.media.error?enlargement(c.media.url):c.media.url=c.media.url+'?'+Math.random()" @load="c.media.error=false;scrollBottom();" @error="c.media.error=true" :class="c.media.error?'false':''" class="pointer" />
                                </div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <b><i class=""></i></b><b><i @click="reloadImage(c)" class="fa fa-circle-o-notch pointer" :class="c.media.reload?'fa-spin':''"></i></b>
                        </div>
                    </template>
                    <template v-if="c.msg_type=='file'">
                        <div v-if="c.from=='kf'"  class="servicer tell">
                            <div class="item-control-wrap">
                           		<div class="item-control-wrap2">
                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
                           		</div>
                           </div>
                            <div class="content">
                                <div class="file">
                                    <div class="file_icon"></div>
                                    <div>
                                        <p :title="c.media.name">{{c.media.name}}</p>
                                        <p>
                                            <span>{{(c.media.size/1024).toFixed(2)}}kb</span>&emsp;<a :href="c.media.url"  target="_self" :download="c.media.name" class="pull-right">下载</a>

                                        </p>
                                    </div>
                                </div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <span class="icon"><img  :src="computedKfHead(c.kf_id)" /></span>
                        </div>
                        <div v-if="c.from=='user'" class="guest tell">
							<span class="icon">
								<template v-if="session.head"><img :src="session.head" /></template>
								<template v-else><div class="icon_txt">{{session.session_id.slice(-2)}}</div></template>
							</span>
                            <div class="content">
                                <div class="file">
                                    <div class="file_icon"></div>
                                    <div>
                                        <p :title="c.media.name">{{c.media.name}}</p>
                                        <p>
                                            <span>{{(c.media.size/1024).toFixed(2)}}kb</span>&emsp;<a :href="c.media.url"  target="_self" :download="c.media.name" class="pull-right">下载</a>

                                        </p>
                                    </div>
                                </div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <b><i class=""></i></b>
                        </div>
                    </template>
                    <template v-if="c.msg_type=='rich_answer'">
                        <template v-for="(r,ri) in c.rich_answer">
                            <div v-if="r.type=='text'" class="servicer tell">
                            	<div class="item-control-wrap">
	                           		<div class="item-control-wrap2">
	                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
	                           		</div>
	                           </div>
                                <div class="content">
                                    <div v-if="r.text.indexOf(find.text)!=-1" class="txt _find" v-html="strToHtml(r.text)"></div>
                                    <div v-else class="txt" v-html="strToHtml(r.text)"></div>
                                    <p class="time" v-opacity="ri == c.rich_answer.length-1">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                </div>
                                <span class="icon" v-opacity="ri==0"><img :src="computedKfHead(c.kf_id)" /></span>
                            </div>
                            <div v-if="r.type=='image'"  class="servicer tell">
                            	<div class="item-control-wrap">
	                           		<div class="item-control-wrap2">
	                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
	                           		</div>
	                            </div>
                                <div class="content">
                                    <div class="img">
                                        <img v-if="r.url===''" src="../../assets/img/loading_middle.gif"  />
                                        <img v-if="r.url===false" src="../../assets/img/bad_img.png" @click="reupload(r.file)" />
                                        <img v-if="r.url" :src="r.url" @click="!r.error?enlargement(r.url):r.url=r.url+'?'+Math.random()" @load="c.media.error=false;scrollBottom();" @error="c.media.error=true" :class="c.media.error?'false':''" class="pointer" />
                                    </div>
                                    <p class="time" v-opacity="ri == c.rich_answer.length-1">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                </div>
                                <span class="icon" v-opacity="ri==0"><img  :src="computedKfHead(c.kf_id)"/></span>
                            </div>
                            <div v-if="r.type=='audio'||r.type=='video'"  class="servicer tell">
                            	<div class="item-control-wrap">
	                           		<div class="item-control-wrap2">
	                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
	                           		</div>
	                            </div>
                                <div class="content">
                                    <div class="file">
                                        <div class="file_icon"></div>
                                        <div>
                                            <p :title="r.name">{{r.name}}</p>
                                            <p>
                                                <span>{{(r.size/1024).toFixed(2)}}kb</span>&emsp;<a :href="r.url"  target="_self" :download="r.name" class="pull-right">下载</a>

                                            </p>
                                        </div>
                                    </div>
                                    <p class="time" v-opacity="ri == c.rich_answer.length-1">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                </div>
                                <span class="icon" v-opacity="ri==0"><img  :src="computedKfHead(c.kf_id)" /></span>
                            </div>
                        </template>
                    </template>
                    <template v-if="c.msg_type=='rich_text'">
                        <div class="servicer tell">
                            <div class="content">
                                <!--<iframes :url="c.rich_text.url"></iframes>-->
                                <iframes :url="c.rich_text ? (c.rich_text.url || '') : ''"></iframes>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <span class="icon"><img :src="computedKfHead(c.kf_id)" /></span>
                        </div>
                    </template>
                </template>
                <template v-for="(c,i) in session.tell">
                    <div v-if="c.msg_type=='info'">
                        <p v-if="c.info" class="infos text-center">{{c.info}}</p>
                        <p v-if="c.times" class="times text-center"><span>{{c.times}}</span></p>
                    </div>
                    <div v-if="c.msg_type=='event'">
                    	<p v-if="c.event_type=='recall'" class="text-center infos">{{kfs_info[c.kf_id]?kfs_info[c.kf_id].nickname : c.kf_id}} 撤回了一条消息</p>
                        <p v-else class="text-center infos">{{$api.dateFormat('yyyy-MM-dd hh:mm:ss',c.time)}}&emsp;{{c.text}}</p>
                    </div>
                    <template v-if="c.msg_type=='text'">
                        <div v-if="c.from=='kf'"  class="servicer tell" >
                           <div class="item-control-wrap">
                           		<div class="item-control-wrap2">
                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
                           		</div>
                           </div>
                            <div class="content"  :msg_id="c.msg_id">
                                <div v-if="c.text.indexOf(find.text)!=-1"  class="txt _find" v-html="strToHtml(c.text)"></div>
                                <div v-else class="txt" v-html="strToHtml(c.text)"></div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <span class="icon"><img  :src="computedKfHead(c.kf_id)" /></span>
                        </div>
                        <div v-if="c.from=='user'" class="guest tell">
							<span class="icon">
								<template v-if="session.head"><img :src="session.head" /></template>
								<template v-else><div class="icon_txt">{{session.session_id.slice(-2)}}</div></template>
							</span>
                            <div class="content">
                                <div v-if="c.text.indexOf(find.text)!=-1"  class="txt _find" v-html="strToHtml(c.text)"></div>
                                <div v-else class="txt" v-html="strToHtml(c.text)"></div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <b v-if="showRecommendAnswer"><recommend-answers class="recommend-answers"  :question="c.text" @pushAnswer="pushAnswer" @pushRichText="pushRichText" @searchKnow="searchKnow"></recommend-answers></b>
                        </div>
                    </template>
                    <template v-if="c.msg_type=='image'">
                        <div v-if="c.from=='kf'"  class="servicer tell">
                        	<div class="item-control-wrap">
                           		<div class="item-control-wrap2">
                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
                           		</div>
                          	</div>
                            <div class="content">
                                <div class="img">
                                    <img v-if="c.media.url===''" src="../../assets/img/loading_middle.gif"  />
                                    <img v-if="c.media.url===false" src="../../assets/img/bad_img.png" @click="reupload(c.media.file)" />
                                    <img v-if="c.media.url" :src="c.media.url" @click="!c.media.error?enlargement(c.media.url):c.media.url=c.media.url+'?'+Math.random()" @load="c.media.error=false;scrollBottom();" @error="c.media.error=true" :class="c.media.error?'false':''" class="pointer" />
                                </div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <span class="icon"><img  :src="computedKfHead(c.kf_id)" /></span>
                        </div>
                        <div v-if="c.from=='user'" class="guest tell">
							<span class="icon">
								<template v-if="session.head"><img :src="session.head" /></template>
								<template v-else><div class="icon_txt">{{session.session_id.slice(-2)}}</div></template>
							</span>
                            <div class="content">
                                <div class="img">
                                    <img v-if="c.media.url===''" src="../../assets/img/loading_middle.gif"  />
                                    <img v-if="c.media.url===false" src="../../assets/img/bad_img.png" @click="reupload(c.media.file)" />
                                    <img v-if="c.media.url" :src="c.media.url" @click="!c.media.error?enlargement(c.media.url):c.media.url=c.media.url+'?'+Math.random()" @load="c.media.error=false;scrollBottom();" @error="c.media.error=true" :class="c.media.error?'false':''" class="pointer" />
                                </div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <b><i class=""></i></b><b><i @click="reloadImage(c)" class="fa fa-circle-o-notch pointer" :class="c.media.reload?'fa-spin':''"></i></b>
                        </div>
                    </template>
                    <template v-if="c.msg_type=='file' && !c.media.stop_upload" >
                        <div v-if="c.from=='kf'"  class="servicer tell">
                            <div class="item-control-wrap">
                           		<div class="item-control-wrap2">
                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
                           		</div>
                           </div>
                            <div class="content">
                                <div class="file">
                                    <div class="file_icon"></div>
                                    <div>
                                        <p :title="c.media.name">{{c.media.name}}</p>
                                        <p class="infos">
                                            <span>{{(c.media.size/1024).toFixed(2)}}kb&emsp;<a v-show="c.media.percent==100" :href="c.media.url"  target="_self" :download="c.media.name" class="pull-right">下载</a></span>
                                        </p>
                                    </div>
                                </div>
                                <div class="checkbox-tell-percent__wrap" v-show=" c.media.percent != 100">
                                	<div class="checkbox-tell-percent__bg">
                                		<p class="checkbox-tell-percent__bar" :style="{width:c.media.percent+'%'}"></p>
                                	</div>
                                	<span @click="c.media.stop_upload = true" class="checkbox-tell-percent__close unselect">×</span>
                                </div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <span class="icon"><img  :src="computedKfHead(c.kf_id)" /></span>
                        </div>
                        <div v-if="c.from=='user'" class="guest tell">
							<span class="icon">
								<template v-if="session.head"><img :src="session.head" /></template>
								<template v-else><div class="icon_txt">{{session.session_id.slice(-2)}}</div></template>
							</span>
                            <div class="content">
                                <div class="file">
                                    <div class="file_icon"></div>
                                    <div>
                                        <p :title="c.media.name">{{c.media.name}}</p>
                                        <p class="infos">
                                            <span v-if="!c.media.progress||c.media.progress==100">{{(c.media.size/1024).toFixed(2)}}kb</span>&emsp;<a :href="c.media.url"  target="_self" :download="c.media.name" class="pull-right">下载</a>
                                            <b v-if="c.media.progress&&c.media.progress!=100"><i :style="'width:'+c.media.progress+'%'"></i></b>
                                        </p>
                                    </div>
                                </div>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <b><i class=""></i></b>
                        </div>
                    </template>
                    <template v-if="c.msg_type=='rich_answer'">
                        <template v-for="(r,ri) in c.rich_answer">
                            <div v-if="r.type=='text'" class="servicer tell">
                            	<div class="item-control-wrap">
	                           		<div class="item-control-wrap2">
	                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
	                           		</div>
	                           	</div>
                                <div class="content">
                                    <div v-if="r.text.indexOf(find.text)!=-1" class="txt _find" v-html="strToHtml(r.text)"></div>
                                    <div v-else class="txt" v-html="strToHtml(r.text)"></div>
                                    <p class="time" v-opacity="ri == c.rich_answer.length-1">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                </div>
                                <span class="icon" v-opacity="ri==0"><img :src="computedKfHead(c.kf_id)" /></span>
                            </div>
                            <div v-if="r.type=='image'"  class="servicer tell">
                            	<div class="item-control-wrap">
	                           		<div class="item-control-wrap2">
	                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
	                           		</div>
	                           	</div>
                                <div class="content">
                                    <div class="img">
                                        <img v-if="r.url===''" src="../../assets/img/loading_middle.gif"  />
                                        <img v-if="r.url===false" src="../../assets/img/bad_img.png" @click="reupload(r.file)" />
                                        <img v-if="r.url" :src="r.url" @click="!r.error?enlargement(r.url):r.url=r.url+'?'+Math.random()" @load="c.media.error=false;scrollBottom();" @error="c.media.error=true" :class="c.media.error?'false':''" class="pointer" />
                                    </div>
                                    <p class="time" v-opacity="ri == c.rich_answer.length-1">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                </div>
                                <span class="icon" v-opacity="ri==0"><img  :src="computedKfHead(c.kf_id)"/></span>
                            </div>
                            <div v-if="r.type=='audio'||r.type=='video'"  class="servicer tell">
                            	<div class="item-control-wrap">
	                           		<div class="item-control-wrap2">
	                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
	                           		</div>
	                           	</div>
                                <div class="content">
                                    <div class="file">
                                        <div class="file_icon"></div>
                                        <div>
                                            <p :title="r.name">{{r.name}}</p>
                                            <p>
                                                <span>{{(r.size/1024).toFixed(2)}}kb</span>&emsp;<a :href="r.url"  target="_self" :download="r.name" class="pull-right">下载</a>

                                            </p>
                                        </div>
                                    </div>
                                    <p class="time" v-opacity="ri == c.rich_answer.length-1">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                                </div>
                                <span class="icon" v-opacity="ri==0"><img  :src="computedKfHead(c.kf_id)" /></span>
                            </div>
                        </template>
                    </template>
                    <template v-if="c.msg_type=='rich_text'">
                        <div class="servicer tell">
                        	<div class="item-control-wrap">
                           		<div class="item-control-wrap2">
                           			<item-control :index="i" :type="c.send" :data="c" @reReply="reReply" @reUpload="reUpload" @reCall="reCall"></item-control>
                           		</div>
                          	</div>
                            <div class="content">
                                <iframes :url="c.rich_text.url"></iframes>
                                <p class="time">{{$api.dateFormat('hh:mm:ss',c.time)}}</p>
                            </div>
                            <span class="icon"><img :src="computedKfHead(c.kf_id)" /></span>
                        </div>
                    </template>
                </template>
            </div>

        </bar>
        <my-modals v-model="AUX.show_know" free="true" :width="my_model_width">
            <div class="my-modals-know">
                <Collapse accordion v-model="AUX.arrow">
                    <Panel>
                        对外知识点
                        <div slot="content">
                            <bar wrapper="wrapper5">
                                <div v-for="(l,i) in list" class="qa" v-if="l.situation==1||l.situation==2">
                                    <div class="q">
                                        <el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
                                            <div slot="content" class="qa_detail">
                                                <div class="q" v-html="l.title"></div>
                                                <div class="a" v-html="l.content.text"></div>
                                            </div>
                                            <div class="tragger_q">
                                                <span class="index">{{i+1}}:</span>
												<p>{{l.title}}</p>
                                            </div>    
                                        </el-tooltip>
                                        <a class="submit pointer" @click="pushRichText(l.content.url,l.content.media_id)">推送答案</a>
                                    </div>
                                    <div class="a_wrap">
                                    	<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
                                            <div slot="content" class="qa_detail">
                                                <div class="q" v-html="l.title"></div>
                                                <div class="a" v-html="l.content.text"></div>
                                            </div>
                                            <div class="a" >{{$api.htmlToStr(l.content.text)}}</div>
                                        </el-tooltip>
                                    </div>
                                </div>
                                <div v-if="!list.some(l=>(l.situation==1||l.situation==2))">
                                    <p class="text-center">无</p>
                                </div>
                            </bar>
                        </div>
                    </Panel>
                    <Panel>
                        对内知识点
                        <div slot="content">
                            <bar wrapper="wrapper5">
                                <div v-for="(l,i) in list" class="qa" v-if="l.situation==0||l.situation==2">
                                    <div class="q">
                                        <el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
                                            <div slot="content" class="qa_detail">
                                                <div class="q" v-html="l.title"></div>
                                                <div class="a" v-html="l.content.text"></div>
                                            </div>
                                            <div class="tragger_q">
                                                <span class="index">{{i+1}}:</span>
												<p>{{l.title}}</p>
                                            </div>    
                                        </el-tooltip>
                                        <a class="submit pointer" @click="pushRichText(l.content.url,l.content.media_id)">推送答案</a>
                                    </div>
                                    <div class="a_wrap">
                                    	<el-tooltip trigger="hover"  popper-class="black html" :open-delay="400">
                                            <div slot="content" class="qa_detail">
                                                <div class="q" v-html="l.title"></div>
                                                <div class="a" v-html="l.content.text"></div>
                                            </div>
                                            <div class="a" >{{$api.htmlToStr(l.content.text)}}</div>
                                        </el-tooltip>
                                    </div>
                                </div>
                                <div v-if="!list.some(l=>(l.situation==0||l.situation==2))">
                                    <p class="text-center">无</p>
                                </div>
                            </bar>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </my-modals>
    </div>

</template>

<script>
    import bar from '../module/自定义滚动条bottom版.vue'
    import upload from '../module/upload.vue'
    import statics from '../../config/static.js'
    import bot from '../../assets/img/bot.png'
    import mixin from './mixin/sessions.js'
    import recommendAnswers from './modules/推荐答案.vue'
    import iframes from './modules/iframes'
    
    import itemControl from './modules/chatbox/item-control'
    export default{
        mixins:[mixin],
        props:{
            session:{
                type:Object,
                required:true,
            },
            showhistory:{
                type:Boolean,
                default:true,
            },
            id:{
                type:String,
                required:false,
            },
            finds:{
                type:String,
                required:false,
            },
            showRecommendAnswer:{
                type:Boolean,
                default:true,
            },
        },
        data(){
            return {
                magnify_img:'',
                find:{
                    text:this.finds||'',
                    count:0,
                },
                emoj:statics.emoj.emojs,
                tell_len:0,
                知识点:{
                    id:0
                },
                kfs_info:{},
                list:[],
                AUX:{
                    show_know:false,
                    arrow:'0',
                }
            }
        },
        created(){
            this.$source.kfs().then(data=>{
                this.kfs_info = data;
            })
        },
        mounted(){
            this.$nextTick(()=>{
                setTimeout(()=>{
                    let area = this.$refs.community_wrap;
                    if(area&&this.session.scroll){
                        let h = 0-area.offsetHeight;
                        this.session.scroll.top = h>0?0:h;
                    }
                },200);
            });
        },
        computed:{
            bot(){
                let img = 'bot';
                try{
                    img = this.$store.state.global.enums.robot.img || bot;
                }catch(e){}
                return img;
            },
            my_model_width(){
            	let result;
            	if(!this.$root.$children[0].small.bool && this.$root.$children[0].small.free_change){
            		result = 'calc((100% - 180px)*0.225)';
            	}else{
            		result = 'calc((100% - 60px)*0.225)';
            	}
            	return result;
            }
        },
        methods:{
            pushAnswer(data,type){
                this.$emit('pushAnswer',data,type);
            },
            pushRichText(url,id){
                this.$emit('pushRichText',url,id);
            },
            searchKnow(id){
                let v = this;
                if(v.知识点.id!=id){
                    v.知识点.id=id;
                    v.$api.ajax(v.$uri.知识点.list+'/'+id,'get')
                        .then(data=>{
                            v.list = data.list;
                            if(data.list.some((val)=>val.situation==0))
                                this.AUX.arrow = '1';
                            else
                                this.AUX.arrow='0';
                        })
                }
                v.AUX.show_know=true;
            },
            reReply(data,i){
            	this.$emit('reReply', data, i);
            },
            reUpload(file, data, i){
            	this.$emit('reUpload', file, data, i);
            },
            reCall(data, i){
            	this.$emit('reCall', data, i);  
            	console.log('撤回!!!')
            },
            enlargement(uri){
                this.$store.state.global.zoomin_uri = uri;
            },
            strToHtml(str){
                if(!str) return ;
                let v= this,html="";
                html = str.replace(/\n/g,'<br>').replace(/\s/g,'&nbsp;').replace(statics.emoj.emoj_regex,function(a){
                    for(let i=0;i<v.emoj.length;i++){
                        if(v.emoj[i].code == a || (v.emoj[i].code2!=undefined && v.emoj[i].code2 == a) || v.emoj[i].sign == a){
                            return '<img src="'+v.emoj[i].uri+'" class="emoj_icon">'
                        }
                    }
                    return a;
                });
                if(v.find.text.trim()=='') return html;
                let index = html.indexOf(v.find.text);
                if(index>-1){
                    let reg = new RegExp(v.find.text,'gi');
                    html = html.replace(reg,(s)=>{return '<font class="find">'+s+'</font>'})
                }
                return html;
            },
            reloadImage(tell){
                let v = this;
                v.$set(tell.media,'reload',1)
                let data = {
                    uid:v.session.session_id,
                    media_id:tell.media.media_id || "",
                    name:tell.media.name,
                }
                v.$api.ajaxNoLoading('/chat/img_reload','get',data)
                    .then(result=>{
                        setTimeout(()=>{
                            tell.media.reload = 0;
                        },1000)
                        if(result!='')
                            tell.media.url = result;
                    }).catch(err=>{
                    setTimeout(()=>{
                        tell.media.reload = 0;
                    },1000)
                })
            },
            scrollBottom(){
                setTimeout(()=>{
                    let area = this.$refs.community_wrap;
                    if(area&&this.session.scroll){
                        let h = 0-area.offsetHeight;
                        this.session.scroll.top = h>0?0:h;
                    }
                },200);
            },
            加载历史(){
            	if( this.session.can_get_historys &&!this.session.getting_historys){
            		this.session.getting_historys= true;
                    setTimeout(()=>{
                        this.mixin_会话历史(this.session)
                            .finally(()=>{
                                this.session.getting_historys= false;
                            })
                    },1500)
            	}
            },
            computedKfHead(id){
            	return this.kfs_info[id]&& this.kfs_info[id].head|| this.bot;
            }
        },
        components:{
            bar,
            upload,
            statics,
            recommendAnswers,iframes,
            itemControl
        },
        watch:{
            'session.session_id':{
                handler:function(n,o){
                    this.tell_len = this.session.tell.length;
                    this.historys_len = this.session.historys.length;
                  /*  if(this.session.original_historys==0){
                    	this.加载历史();
                    }*/
                    setTimeout(()=>{
                        let area = this.$refs.community_wrap;
                        if(area&&this.session.scroll){
                            let h = 0-area.offsetHeight;
                            this.session.scroll.top = h>0?0:h;
                        }
                    },200);
                }
            },
            'session.historys':{
                handler:function(n){
                    let v = this;
                    setTimeout(()=>{
                        let area = v.$refs.community_wrap;
                        if(area&&v.session.scroll){
                            /*let h = 0-area.offsetHeight;
                            v.session.scroll.top = h>0?0:h;         */
                            v.session.scroll.top = 0- (area.offsetHeight-this.到底部距离);
                        }
                    },300);
                    /*if(v.historys_len!=n.length){
                        v.historys_len=n.length;
                        setTimeout(()=>{
                            let area = v.$refs.community_wrap;
                            if(area&&v.session.scroll){
                                let h = 0-area.offsetHeight;
                                v.session.scroll.top = h>0?0:h;
                            }
                        },300);
                    }*/
                },deep:true,
            },
            'session.tell':{
                handler:function(n){
                    if(this.tell_len!=n.length){
                        this.tell_len=n.length;
                        setTimeout(()=>{
                            let area = this.$refs.community_wrap;
                            if(area&&this.session.scroll){
                                let h = 0-area.offsetHeight;
                                this.session.scroll.top = h>0?0:h;
                            }
                        },250);
                    }
                },deep:true,
            },
            'finds':{
                handler:function(n){
                    this.find.text = n;
                    this.find.count=0;
                }
            },
            'find.text':{
                handler:function(n){
                    this.session.scroll.top = document.querySelectorAll('._find')[0].offsetTop;
                }
            },
            'session.scroll.distance_top'(n,o){
                if(n===0){
                	this.加载历史();
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/scss/wrap_variate.scss";
    $color_1:#328eff;
    $color_2:#acbed4;
    $color_3:#9bb7d6;
    $color_4:#edf4fc;
    $color_5:#e8eff7;
    $color_6:#6eafff;
    $color_7:#d9e2ec;
    $color_8:#cfdbe6;
    $color_9:#7792ae;
    $color_10:#f6f6f6;
    $color_11:#a2b2c6;
    $color_13:#97aac0;
    
    $customerBg:#f0f0f0;
    $servicerBg:#2095f2;
    @mixin box_shadow-1-1-10-1 ($color){
        box-shadow:1px 1px 20px 1px $color;
    }
    .__chatbox {height:100%; }
    .__chatbox .wrapper {width:100%; height:100%; padding:0 15px;}
    .__chatbox .tell {padding-top:10px; position:relative;}
    .__chatbox .tell > *{ display:inline-block; vertical-align:top; }
    .__chatbox .icon {width:45px; height:45px;text-align:center; background:#fff; border-radius:45px; border-width:1px; border-style:solid;}
    .__chatbox .icon .icon_txt {line-height:43px;}
    .__chatbox .icon img {width:43px; height:43px; border-radius:43px;}
    .__chatbox .tell .content {max-width:70%; margin:0px 10px;}
    .__chatbox .tell .content .txt {min-width:60px; background:#fff; border-radius:23px; padding:12px; word-break:break-word; }
    .__chatbox .tell .content .txt .find {color:#f0c600; font-size:15px;}
    .__chatbox .tell .content .img img {border-radius:5px; max-height:250px; max-width:250px; border:1px solid #eee;}
    .__chatbox .tell .content .img img.false {min-width:70px; min-height:70px; background:url(../../assets/img/image_fail.jpg) no-repeat center center;}

    .__chatbox .tell > b { position:absolute; top:-10px; bottom:0; margin:auto 0;  width:20px; height:20px; background:transparent;}
    .__chatbox .tell > b > i { display:inline-block; width:20px; height:20px; position:relative; top:-7px;}
    .__chatbox .tell > b > i.warn { color: #f03437; }
    .__chatbox .tell > b > i.loading { background:url(../../assets/img/loading_small.gif) no-repeat center center;}
    .__chatbox .tell > b > i.fa-spin {transform-origin: 34% 35%;}
    .__chatbox .tell > b >.recommend-answers {top:-5px; position:relative;}
    .__chatbox .tell.servicer > b > i{left:-20px;}
    .__chatbox .tell.servicer {writing-mode: rl; text-align: right;}
    .__chatbox .tell.guest .icon,
    .__chatbox .tell.guest .content .txt {background:$customerBg; *box-shadow:1px 1px 10px 1px #d9e2ec;}
    .__chatbox .tell.servicer .content > div {text-align:left; }
    .__chatbox .servicer .icon,
    .__chatbox .tell.servicer .content .txt {background:$servicerBg; color:#fff; *box-shadow:1px 1px 10px 1px #6eafff;}
    
    .__chatbox .tell.guest .icon {border-color:#8b99a7; background:#8b99a7; color:#fff;}
    .__chatbox .tell.servicer .icon {border-color:$servicerBg;}
    
    .__chatbox .notmore,
    .__chatbox .history {width:60%; margin:0 auto; position:relative; }
    .__chatbox .notmore:after,
    .__chatbox .history:after {content:'';display:block; width:100%; height:0; border-bottom:1px solid #d9e3ee; position:absolute; left:0; bottom:10px;}
    .__chatbox .notmore span,
    .__chatbox .history span {position:relative; z-index:10; padding:0 10px; background:#f7fbff;}
    .__chatbox .history:after {border-bottom:1px dashed #d9e3ee;}

    .__chatbox {
	    .infos,.time{
	        color:#c5c5c5; line-height:28px; font-size:12px;
	    }
	    .times{
	        text-align:center;
		    span {
		        font-size:12px;
		        line-height:14px;
		        background:#d7d7d7; color:#fff; padding:1px 5px; display:inline-block; border-radius:10px;
		    }
	    }
	    .tell{
	    	._chatbox-item-control_recall { display: none; }
	    	&:hover{
	    		._chatbox-item-control_recall { display:inline-block; }
	    	}
	    	.content{
	    		.file {
	    			width:265px;padding:16px; background:#fff; border:1px solid #eee; border-radius: 4px;
	    			& > div {display:inline-block; vertical-align:top;}
	    			.file_icon {width:44px; height:50px; display:inline-block; background:url(../../assets/img/file_all.png) no-repeat center center;}
	    			.file_icon + div {
	    				padding-left:10px;
	    				p {
	    					width:170px;  font-size:14px;line-height:15px; text-align:left; overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;
	    					b {display:inline-block; width:170px; height:3px; margin-top:6px; position:relative; background:#f2f2f2;}
    						b i {display:inline-block; width:50%; height:2px; position:absolute; left:0; top:0; background:#0082E6;}
    						& + p{padding-top:20px; font-size:12px; color:#c5c5c5;}
	    				}
	    			}
	    		}
	    		.checkbox-tell-percent__wrap{
	    			width:265px;
	    			position:relative;
	    			height:15px;
	    			.checkbox-tell-percent__bg{
	    				height:2px;position:absolute;
	    				left:0; top:8px;
	    				border-radius:3px;
	    				width:calc(100% - 20px); background:#eee;
	    				overflow:hidden;
	    				.checkbox-tell-percent__bar {
	    					width:0;
	    					height:100%;
	    					background:#31c946;
	    					border-radius:3px;
	    				}
	    			}
	    			.checkbox-tell-percent__close {
	    				cursor:pointer;
	    				font-size:13px;
	    				border-radius:50%;
	    				line-height:10px;   padding:1px;
	    				text-align:center;
	    				color:#bfbfbf;
	    				background:#eee;
	    				position:absolute; right:0; top:3px;
	    			}
	    		}
	    	}
	    	.item-control-wrap{
	    		position:absolute; top:-10px; bottom:0; margin:auto 0;  width:20px; height:20px; background:transparent;
	    		.item-control-wrap2 {
	    			display:inline-block; width:20px; height:20px; position:relative; top:-3px; left:-17px;
	    		}
	    	}
	    }
	    .get-history-wrap {position:relative; left:0; top:0px; text-align:center; }
	    .recommends {
		    .content{
		        max-width:100%;
			    .lists {
			        width:100%;
				    & > p {
				          position:relative; top:-10px;
				
				      }
				    ul {
				        border-radius:5px; overflow:hidden; padding:5px 0;background:$color_5;
					    li {
					        width:100%;
					        padding-top:1px;  color:$color_13; text-align: left; line-height:30px;;
					        overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;
					
					    }
				    }
			    }
		    	&::after {display:none;}
		    }
	    }
	
	    .my-modals-know{
	    	.ivu-collapse-content{
	        	padding:0;
	    		.ivu-collapse-content-box {padding:0;}
	    	}
	   	 	.wrapper5 {height:calc(100vh - #{$wrap-head-height} - 76px); padding:10px;}
	    }
    }
    .__chatbox a.pull-right:focus{
        text-decoration: none;
    }
</style>